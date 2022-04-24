import React, {useEffect, useState, Fragment} from "react";
import {Button, Tabs} from "antd";
import BridgeTable from "../BridgeTable";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import Card from "../../../component/card/Card";
import Toolbar from "../../../component/toolbar/Toolbar";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";

const BridgeCardsDownload = () => {
    //数据加载
    const [loading, setLoading] = useState(false);
    const [bridgeData, setBridgeData] = useState({data: [], current: 1, pageSize: 10, total: 0, searchData: {}});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    //获取桥梁分页
    const fetchBridgeData = pageData => {
        setLoading(true);
        BridgeBaseClient.getBridgePage(pageData)
            .then(setBridgeData)
            .finally(() => setLoading(false));
    };
    // eslint-disable-next-line
    useEffect(() => fetchBridgeData(bridgeData), []);

    const downloadBridgeCard = (bridgeId, bridgeName) => {
        BridgeBaseClient.downloadBridgeCard(bridgeId, bridgeName)
    }
    const downloadAllBridgeCards = (bridgeIdList) => {
        if(loading===false){
            setLoading(true)
            let params = {bridgeIdList: bridgeIdList}
            if(!Array.isArray(bridgeIdList)){
                params.searchData = bridgeData.searchData
            }
            BridgeBaseClient.downloadBridgeCardZip(params).then(()=>setLoading(false))
        }
    }

    const downloadAllBridge24Table = () =>{
        if(loading===false){
            setLoading(true)
            BridgeBaseClient.downloadAllBridge24Table().then(()=>setLoading(false))
        }
    }
    //操作列
    const extraColumns =[
        {
            title: "操作",
            key: "action",
            dataIndex: "sideAmount",
            width: 180,
            fixed: "right",
            align: "center",
            render: (text, record) => (<Fragment>
                <Button size="small" type="link" onClick={() => downloadBridgeCard(record.id, record.bridgeName)}>桥梁卡片下载</Button>
            </Fragment>)
        }];
    //渲染

    const filterSelectData = (datas, selectType, changeRows) => {
        let selectedData = Array.from(selectedRowKeys)
        let itList = datas
        if(selectType==false){
            itList = changeRows
        }
        itList.forEach(item=>{
            if(item!=undefined){
                if(selectType===true){
                    selectedData.push(item.id)
                }else {
                    selectedData.splice(selectedData.indexOf(item.id), 1)
                }
            }
        })
       return Array.from(new Set(selectedData))
    }
    const onSelect =  (selected, selectedRows) =>{
        if(selectedRows===true){
            setSelectedRowKeys([...selectedRowKeys,selected.id])
        }else{
            selectedRowKeys.splice(selectedRowKeys.indexOf(selected.id), 1)
            setSelectedRowKeys([...selectedRowKeys])
        }
    }

    const onSelectAll = (selected, selectedRows, changeRows) => {
        let datas = filterSelectData(selectedRows, selected,changeRows)
        setSelectedRowKeys(datas)
    }

    const rowSelection = {
        selectedRowKeys,
        fixed: true,
        // onChange: onSelectChange,
        onSelect: onSelect,
        onSelectAll: onSelectAll
    };

    return (
        <Card title="桥梁卡片下载" >
            <Toolbar>
                <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadAllBridgeCards(selectedRowKeys.toString())}>下载已选桥梁卡片</Button>
                <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadAllBridgeCards('ALL')}>下载所有桥梁卡片</Button>
                <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadAllBridge24Table()}>下载所有桥梁24表 </Button>
            </Toolbar>
            <BridgeTable
                rowSelection={rowSelection}
                loading={loading}
                bridgeData={bridgeData}
                dataSupplier={fetchBridgeData}
                extraColumn={extraColumns}/>
        </Card>
    );
};

export default BridgeCardsDownload;