import React, {useEffect, useState} from "react";
import {Button, Divider, Table} from "antd";
import DeleteButton from "../../../component/button/DeleteButton";
import Card from "../../../component/card/Card";
import Toolbar from "../../../component/toolbar/Toolbar";
import {PlusOutlined} from "@ant-design/icons";
import {useHistory, useParams} from "react-router";
import BridgeSideForm from "./BridgeSideForm";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import BridgeSideClient from "../../../../client/bridge/BridgeSideClient";
import BridgeSideCopyForm from "./BridgeSideCopyForm";

const BridgeSide = () => {
    //路由参数
    const {bridgeId} = useParams();
    const history = useHistory();
    //组件状态
    const [loading, setLoading] = useState(false);
    const [bridge, setBridge] = useState({});
    const [bridgeSideData, setBridgeSideData] = useState([]);
    const [bridgeSideForm, setBridgeSideForm] = useState({visible: false, initialData: undefined});
    const [bridgeCopyForm, setBridgeCopyForm] = useState({visible: false, bridgeSideId: undefined});
    //获取桥梁
    const fetchBridge = () => {
        BridgeBaseClient.getBridgeById(bridgeId).then(setBridge);
    };
    const fetchBridgeSide = delay => {
        setLoading(true);
        setTimeout(() => {
            BridgeSideClient.listBridgeSides(bridgeId)
                .then(setBridgeSideData)
                .finally(() => setLoading(false));
        }, delay)
    };
    //初始化数据
    useEffect(() => {
        fetchBridge();
        fetchBridgeSide(0);
        // eslint-disable-next-line
    }, []);
    //跳转到部件
    const toBridgePart = bridgeSideId => {
        history.push(`/side/bridge/${bridgeId}/${bridgeSideId}`);
    };
    //显示桥梁分幅表单
    const showBridgeSideForm = bridgeSideId => {
        if (bridgeSideId) {
            BridgeSideClient.getBridgeSideById(bridgeSideId).then(initialData => {
                setBridgeSideForm({visible: true, initialData});
            });
        } else {
            setBridgeSideForm({visible: true});
        }
    };
    const showBridgeSideCopyForm = bridgeSideId => {
        setBridgeCopyForm({visible: true, bridgeSideId});
    }
    //处理保存事件
    const handleSave = () => {
        setBridgeSideForm({visible: false});
        fetchBridgeSide(2000);
    }
    const handleCopy = () => {
        setBridgeCopyForm({visible: false});
        fetchBridgeSide(3000);
    }
    //删除分幅
    const handleDelete = id => {
        BridgeSideClient.deleteBridgeSide(id).then(() => fetchBridgeSide(2000));
    }
    //表格列
    const columns = [
        {title: "分幅", key: "sideTypeName", dataIndex: "sideTypeName", width: 150},
        {title: "上部结构类型", key: "superstructureTypeName", dataIndex: "superstructureTypeName", width: 150},
        {title: "桥梁全长(m)", key: "bridgeLength", dataIndex: "bridgeLength", width: 150},
        {title: "跨径组合(m)", key: "spanComb", dataIndex: "spanComb", width: 240},
        {title: "跨径总长", key: "totalSpanLength", dataIndex: "totalSpanLength", width: 108},
        {title: "最大跨径", key: "maxSpanLength", dataIndex: "maxSpanLength", width: 100},
        {title: "操作", key: "action", width: 200, align: "center", render: (text, record) => (
                <div>
                    <Button size="small" type="link" onClick={() => toBridgePart(record.id)}>部构件拆分</Button>
                    <Divider type="vertical"/>
                    <Button size="small" type="link" onClick={() => showBridgeSideForm(record.id)}>编辑</Button>
                    <Divider type="vertical"/>
                    <Button size="small" type="link" onClick={() => showBridgeSideCopyForm(record.id)}>复制</Button>
                    <Divider type="vertical"/>
                    <DeleteButton onConfirm={() => handleDelete(record.id)}>删除</DeleteButton>
                </div>
            )}
    ];
    return (
        <Card title={bridge.bridgeName + "分幅管理"} canBack>
            <Toolbar>
                <Button size="small" icon={<PlusOutlined/>} onClick={() => showBridgeSideForm()}>新增</Button>
            </Toolbar>
            <Table
                size="small"
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={bridgeSideData}
                pagination={false}
                bordered />
            <BridgeSideForm
                visible={bridgeSideForm.visible}
                initialData={bridgeSideForm.initialData}
                bridgeId={bridgeId}
                onOk={handleSave}
                onCancel={() => setBridgeSideForm({visible: false})}
            />
            <BridgeSideCopyForm
                visible={bridgeCopyForm.visible}
                bridgeSideId={bridgeCopyForm.bridgeSideId}
                onOk={handleCopy}
                onCancel={() => setBridgeCopyForm({visible: false})}
            />
        </Card>
    )
}

export default BridgeSide;