import React, {Fragment, useEffect, useState} from "react";
import {Button, Divider, message, Dropdown, Menu} from "antd";
import Toolbar from "../../../component/toolbar/Toolbar";
import BridgeTable from "../BridgeTable";
import BridgeBaseForm from "./BridgeBaseForm";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import Card from "../../../component/card/Card";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

import DropDownDelete from "../../../component/menu/DropDownDelete";
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";
import BridgeSelectionForm from "./BridgeSelectionForm";
import CopyOutlined from "@ant-design/icons/lib/icons/CopyOutlined";
import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
import ProgressDialog from "../../../component/progress/ProgressDialog";
import {copyBridgeToBase} from "../../../../util/BridgeUtils";
import {useSelector} from "react-redux";
import OperationClient from "../../../../client/system/OperationClient";

const BridgeBase = () => {
    const menu = useSelector(state => state.menu);
    const auth = useSelector(state => state.auth);
    //数据加载
    const [loading, setLoading] = useState(false);
    const [bridgeData, setBridgeData] = useState({data: [], current: 1, pageSize: 10, total: 0, searchData: {}});
    const [bridgeSelectionFormVisible, setBridgeSelectionFormVisible] = useState(false);
    const [bridgeForm, setBridgeForm] = useState({visible: false, bridgeId: undefined});
    const [copyBackVisible, setCopyBackVisible] = useState(false);
    const [selectedBridgeIds, setSelectedBridgeIds] = useState([]);
    const [progressVisible, setProgressVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [progress, setProgress] = useState(0);
    const [operations, setOperations] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false)
    //获取操作权限
    useEffect(() => {
        if (menu.curMenu) {
            OperationClient.listUserOperations(auth.id, menu.curMenu.data.id).then(setOperations);
        }
        // eslint-disable-next-line
    }, []);
    //获取桥梁分页
    const fetchBridgeData = (pageData, delay) => {
        setLoading(true);
        setTimeout(() => {
            BridgeBaseClient.getBridgePage(pageData)
                .then(setBridgeData)
                .finally(() => setLoading(false));
        }, delay);
    };
    // eslint-disable-next-line
    useEffect(() => fetchBridgeData(bridgeData, 0), []);
    //打开表单
    const showBridgeBaseForm = bridgeId => {
        if (bridgeId) {
            BridgeBaseClient.getBridgeById(bridgeId).then(initialData => setBridgeForm({visible: true, initialData}));
        } else {
            setBridgeForm({visible: true});
        }
    };
    const showBridgeSelectionForm = () => {
        setBridgeSelectionFormVisible(true);
    };
    const handleSave = () => {
        setBridgeForm({visible: false});
        setBridgeSelectionFormVisible(false);
        fetchBridgeData(bridgeData, 2000);
    };
    //处理删除事件
    const handleDelete = id => {
        BridgeBaseClient.deleteBridge(id).then(() => fetchBridgeData(bridgeData, 2000));
    };
    //处理表格选中事件
    const handleBridgeSelect = keys => {
        setSelectedBridgeIds(keys);
    };
    //复制选中桥梁至基础数据库
    const copySelectedBridgeToBase = async () => {
        setProgressVisible(true);
        setTotal(selectedBridgeIds.length);
        for (let bridgeId of selectedBridgeIds) {
            await copyBridgeToBase(bridgeId);
            setProgress(p => p + 1);
        }
        setProgressVisible(false);
        setCopyBackVisible(false);
        setSelectedBridgeIds([]);
        message.success(`${selectedBridgeIds.length}座桥梁已经全部复制至基础数据库`);
    };
    //操作列
    const actionColumn = {
        title: "操作",
        key: "action",
        width: 150,
        fixed: "right",
        align: "center",
        render: (text, record) => {
            return  <Fragment>
                <Button size="small" type="link" onClick={() => showBridgeBaseForm(record.id)}>编辑</Button>
                <Divider type="vertical"/>
                <DropDownDelete handleDelete={()=>handleDelete(record.id)}/>
            </Fragment>
        }

    };
    //渲染
    return (
        <Card title="桥梁基础信息管理">
            <Toolbar>
                {
                    operations.some(o => o.operationName === "选择桥梁")
                        ?
                        <Button size="small" icon={<CheckOutlined/>}
                                onClick={() => showBridgeSelectionForm()}>选择桥梁</Button>
                        :
                        null
                }
                {
                    operations.some(o => o.operationName === "桥梁迁回")
                        ?
                        <Button size="small" icon={<CopyOutlined/>}
                                onClick={() => setCopyBackVisible(v => !v)}>桥梁迁回</Button>
                        :
                        null
                }
                {
                    copyBackVisible
                        ?
                        [
                            <Button size="small" icon={<CheckOutlined/>} onClick={copySelectedBridgeToBase}
                                    disabled={selectedBridgeIds.length === 0}/>,
                            <Button size="small" icon={<CloseOutlined/>} onClick={() => setCopyBackVisible(false)}/>
                        ]
                        :
                        null
                }
                <Button size="small" icon={<PlusOutlined/>} onClick={() => showBridgeBaseForm()}>新增</Button>
            </Toolbar>
            <BridgeTable
                loading={loading}
                rowSelection={
                    copyBackVisible ?
                        {
                            selectedRowKeys: selectedBridgeIds,
                            onChange: handleBridgeSelect
                        }
                        :
                        false
                }
                bridgeData={bridgeData}
                dataSupplier={fetchBridgeData}
                extraColumn={actionColumn}/>
            <BridgeBaseForm
                visible={bridgeForm.visible}
                bridgeData={bridgeForm.initialData}
                onOk={handleSave}
                onCancel={() => setBridgeForm({visible: false})}/>
            <BridgeSelectionForm
                visible={bridgeSelectionFormVisible}
                onOk={handleSave}
                onCancel={() => setBridgeSelectionFormVisible(false)}
            />
            <ProgressDialog visible={progressVisible} total={total} progress={progress}/>
        </Card>
    );
};

export default BridgeBase;