import React, {useEffect, useState} from "react";
import {Button, Divider, Table} from "antd";
import DeleteButton from "../../../component/button/DeleteButton";
import Card from "../../../component/card/Card";
import Toolbar from "../../../component/toolbar/Toolbar";
import {PlusOutlined} from "@ant-design/icons";
import {useParams} from "react-router";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import BridgeBuildForm from "./BridgeBuildForm";
import BridgeBuildClient from "../../../../client/bridge/BridgeBuildClient";
import {toDate} from "../../../../util/DateUtils";
import DictionaryClient from "../../../../client/param/DictionaryClient";

const BridgeBuild = () => {
    //路由参数
    const {bridgeId} = useParams();
    //组件状态
    const [bridge, setBridge] = useState({});
    const [loading, setLoading] = useState(false);
    const [buildData, setBuildData] = useState([]);
    const [buildForm, setBuildForm] = useState({visible: false, initialData: undefined});
    const [buildTypeList, setBuildTypeList] = useState([])
    const [qualityEvaluationList, setQualityEvaluationList] = useState([])
    //获取桥梁
    const fetchBridge = () => {
        BridgeBaseClient.getBridgeById(bridgeId).then(setBridge);
    };
    //获取建造数据
    const fetchBuildData = () => {
        if (bridgeId) {
            setLoading(true);
            BridgeBuildClient.listBridgeBuilds(bridgeId).then(setBuildData).finally(() => setLoading(false));
        }
    };

    const fetchFieldData = () => {
        DictionaryClient.listDictionariesByField("BUILD_TYPE").then(setBuildTypeList);
        DictionaryClient.listDictionariesByField("QUALITY_EVALUATION").then(setQualityEvaluationList);
    }

    //初始化数据
    useEffect(() => {
        fetchBridge();
        fetchBuildData();
        fetchFieldData()
        // eslint-disable-next-line
    }, []);
    //显示桥梁分幅表单
    const showBuildForm = initialData => {
        setBuildForm({visible: true, initialData});
    };
    //处理保存事件
    const handleSave = () => {
        setBuildForm({visible: false});
        fetchBuildData();
    }
    //删除分幅
    const handleDelete = id => {
        BridgeBuildClient.deleteBridgeBuild(id).then(response => fetchBuildData());
    }
    //表格列
    const columns = [
        {title: "开工日期", key: "commenceDate", dataIndex: "commenceDate", render: (text, record) => {
            if(record.commenceDate){
                return toDate(record, "commenceDate").format("YYYY-MM-DD")
            }
            return ''
            }, width: 150},
        {title: "竣工日期", key: "completionDate", dataIndex: "completionDate", render: (text, record) => {
                if(record.completionDate) {
                    toDate(record, "completionDate").format("YYYY-MM-DD")
                }
                return ''
            }, width: 150},
        {title: "修建类别", key: "buildType", dataIndex: "buildTypeName", width: 150},
        {title: "修建原因", key: "buildReason", dataIndex: "buildReason", width: 200},
        {title: "工程范围", key: "projectRange", dataIndex: "projectRange", width: 150},
        {title: "工程费用（万元）", key: "projectCost", dataIndex: "projectCost", width: 150},
        {title: "经费来源", key: "chargeSource", dataIndex: "chargeSource", width: 150},
        {title: "质量评定", key: "qualityEvaluation", dataIndex: "qualityEvaluationName", width: 150},
        {title: "建设单位", key: "buildUnit", dataIndex: "buildUnit", ellipsis: true, width: 200},
        {title: "设计单位", key: "designUnit", dataIndex: "designUnit", ellipsis: true, width: 200},
        {title: "施工单位", key: "constructUnit", dataIndex: "constructUnit", ellipsis: true, width: 200},
        {title: "监理单位", key: "superviseUnit", dataIndex: "superviseUnit", ellipsis: true, width: 200},
        {title: "操作", key: "action", width: 200, align: "center", fixed: "right", render: (text, record) => (
                <div>
                    <Button size="small" type="link" onClick={() => showBuildForm(record)}>编辑</Button>
                    <Divider type="vertical"/>
                    <DeleteButton onConfirm={() => handleDelete(record.id)}>删除</DeleteButton>
                </div>
            )}
    ];
    return (
        <Card title={bridge.bridgeName + "修建工程记录"} canBack>
            <Toolbar>
                <Button size="small" icon={<PlusOutlined/>} onClick={() => showBuildForm()}>新增</Button>
            </Toolbar>
            <Table
                size="small"
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={buildData}
                pagination={false}
                scroll={{x: '100%'}}
                bordered />
            <BridgeBuildForm
                visible={buildForm.visible}
                initialData={buildForm.initialData}
                bridgeId={bridgeId}
                buildTypeList={buildTypeList}
                qualityEvaluationList={qualityEvaluationList}
                onOk={handleSave}
                onCancel={() => setBuildForm({visible: false})}
            />
        </Card>
    )
}

export default BridgeBuild;