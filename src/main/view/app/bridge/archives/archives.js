import React, {Fragment, useEffect, useState} from "react";
import {Button,Tag } from "antd";
import BridgeTable from "../BridgeTable1";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import Card from "../../../component/card/Card";
import {useHistory} from "react-router";

const Archives = () => {
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
    //打开表单 /bridge/nfcLable/:bridgeId
    const toBridgeSide = bridgeId => {
        history.push(`/bridge/archives/${bridgeId}`);
    };
    const toArchivesdtail = bridgeId => {
        history.push(`/bridge/archivesdtail/${bridgeId}`);
    };
    // 过滤年月日
    const fromat = (value) => {
        var now = new Date(value); 
        return `${now.getFullYear()}/${now.getMonth() + 1}`
    }
    //操作列
    const extraColumns =
       [ 
        {title: "档案号", key: "fileNo", dataIndex: "fileNo", width: 100,fixed: "right",  align: "center", },
        {title: "建档年月", key: "fileDate", dataIndex: "fileDate",width: 100,fixed: "right",  align: "center", render: (text, record) => (
            <div>{text ? fromat(text) : null}</div>
        )},
        {title: "档案数量", key: "archivesAmount", dataIndex: "archivesAmount",fixed: "right",  align: "center",width: 100,render: (text, record) => (
            <Tag color="default">{text}</Tag>
        )},
        {
            title: "操作", key: "action", dataIndex: "sideAmount", width: 200, fixed: "right", align: "center", render: (text, record) => (
                <Fragment>
                    <Button size="small" type="link" onClick={() => toBridgeSide(record.id)}>{'档案管理'}</Button>
                    <Button size="small" type="link" onClick={() => toArchivesdtail(record.id)}>{'建档情况'}</Button>
                </Fragment>
            )
        }
    ]
    //渲染
    return (
        <Card title="桥梁档案管理">
            <BridgeTable
                loading={loading}
                bridgeData={bridgeData}
                dataSupplier={fetchBridgeData}
                extraColumn={extraColumns}/>
        </Card>
    );
};

export default Archives;