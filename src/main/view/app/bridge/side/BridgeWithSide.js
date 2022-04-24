import React, {Fragment, useEffect, useState} from "react";
import {Button} from "antd";
import BridgeTable from "../BridgeTable";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import Card from "../../../component/card/Card";
import {useHistory} from "react-router";

const BridgeWithSide = () => {
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
    const toBridgeSide = bridgeId => {
        history.push(`/side/bridge/${bridgeId}`);
    };
    //操作列
    const extraColumns =
        {
            title: "分幅管理", key: "action", dataIndex: "sideAmount", width: 150, fixed: "right", align: "center", render: (text, record) => (
                <Fragment>
                    <Button size="small" type="link" onClick={() => toBridgeSide(record.id)}>{text ? "共" + text + "幅" : "未分幅"}</Button>
                </Fragment>
            )
        };
    //渲染
    return (
        <Card title="桥梁分幅管理">
            <BridgeTable
                loading={loading}
                bridgeData={bridgeData}
                dataSupplier={fetchBridgeData}
                extraColumn={extraColumns}/>
        </Card>
    );
};

export default BridgeWithSide;