import React, {useEffect, useState} from "react";
import {Button} from "antd";
import BridgeTable from "../BridgeTable";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import Card from "../../../component/card/Card";
import {useHistory} from "react-router";

const BridgeBuilds = () => {
    const history = useHistory();
    //数据加载
    const [loading, setLoading] = useState(false);
    const [bridgeData, setBridgeData] = useState({data: [], current: 1, pageSize: 10, total: 0, searchData: {}});
    //获取桥梁分页
    const fetchBridgeData = pageData => {
        setLoading(true);
        BridgeBaseClient.getBridgePage(pageData)
            .then(setBridgeData)
            .finally(() => setLoading(false));
    };
    // eslint-disable-next-line
    useEffect(() => fetchBridgeData(bridgeData), []);
    //打开表单
    const toBridgeBuild = bridgeId => {
        history.push(`/bridge/builds/${bridgeId}/build`);
    };
    //操作列
    const extraColumns =
        {
            title: "操作",
            key: "action",
            dataIndex: "sideAmount",
            width: 200,
            fixed: "right",
            align: "center",
            render: (text, record) => <Button size="small" type="link" onClick={() => toBridgeBuild(record.id)}>修建工程记录管理</Button>
        };
    //渲染
    return (
        <Card title="桥梁修建工程记录管理">
            <BridgeTable
                loading={loading}
                bridgeData={bridgeData}
                dataSupplier={fetchBridgeData}
                extraColumn={extraColumns}/>
        </Card>
    );
};

export default BridgeBuilds;