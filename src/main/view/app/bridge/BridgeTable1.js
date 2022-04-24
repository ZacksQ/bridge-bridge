import React, {Fragment,useEffect, useState} from "react";
import PaginationTable from "../../component/table/PaginationTable";
import {getColumnSearchProps, getColumnsRangeProps, getColumnsTreeSelectProps} from "../../component/table/Column";
import ManagementClient from "../../../client/bridge/ManagementClient";
import {walkTree} from "../../../util/TreeUtils";
import {Button} from "antd";
import {useHistory} from "react-router";

const ROAD_NOS = [
    {text: "G1521", value: "G1521"},
    {text: "G1522", value: "G1522"}
];

const ROAD_NAMES = [
    {text: "常嘉高速", value: "常嘉高速"},
    {text: "苏嘉杭高速公路", value: "苏嘉杭高速公路"},
];

const FUNCTIONS_TYPES = [
    {text: "主线桥", value: "主线桥"},
    {text: "匝道桥", value: "匝道桥"},
    {text: "支线上跨桥", value: "支线上跨桥"},
]

const BridgeTable = ({loading, bridgeData, dataSupplier, extraColumn, ...restProps}) => {
    const history = useHistory();
    //组件状态
    const [managementData, setManagementData] = useState([]);
    //获取管养单位数据
    const fetchManagementData = () => {
        ManagementClient.listManagementTrees().then(data => {
            walkTree(data, d => d.value = d.data.managementName)
            setManagementData(data);
        });
    };
       //打开表单 /bridge/nfcLable/:bridgeId
    const toBridgeSide = bridgeId => {
        history.push(`/bridge/archives/${bridgeId}`);
    };
    const toArchivesdtail = bridgeId => {
        history.push(`/bridge/archivesdtail/${bridgeId}`);
    };
    useEffect(fetchManagementData, []);
    //处理表格变动
    const handleChange = (pagination, filters, sorters) => {
        dataSupplier({...pagination, searchData: {...filters}});
    };
    
    // 过滤年月日
    const fromat = (value) => {
        var now = new Date(value); 
        return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
    }
    //表格列
    const searchData = bridgeData.searchData;
    const columns = [
        {title: "桥梁名称", key: "bridgeName", dataIndex: "bridgeName", width: 240, fixed: "left", ellipsis: true, ...getColumnSearchProps(searchData.bridgeName)},
        {title: "桥梁编码", key: "bridgeCode", dataIndex: "bridgeCode", width: 150, ...getColumnSearchProps(searchData.bridgeCode)},
        {title: "功能类型", key: "functionType", dataIndex: "functionType", width: 150, filters: FUNCTIONS_TYPES},
        {title: "中心桩号", key: "stakeNo", dataIndex: "stakeNo", width: 150, ...getColumnsRangeProps()},
        {title: "路线编号", key: "roadNo", dataIndex: "roadNo", width: 150, filters: ROAD_NOS},
        {title: "路线名称", key: "roadName", dataIndex: "roadName", width: 150, filters: ROAD_NAMES},
        {title: "上部结构类型", key: "superstructureTypeName", dataIndex: "superstructureTypeName", width: 240},
        {title: "跨径组合(m)", key: "spanComb", dataIndex: "spanComb", width: 240},
        // {title: "桥梁全长(m)", key: "bridgeLength", dataIndex: "bridgeLength", width: 150},
        {title: "跨径总长(m)", key: "totalSpanLength", dataIndex: "totalSpanLength", width: 150},
        {title: "单孔最大跨径(m)", key: "maxSpanLength", dataIndex: "maxSpanLength", width: 240},
        {title: "桥梁规模", key: "bridgeScale", dataIndex: "bridgeScale", width: 150},
        // {title: "管养单位", key: "managementCode", dataIndex: "managementName", width: 240, ...getColumnsTreeSelectProps(managementData)},
        {title: "设计荷载", key: "designLoadRankName", dataIndex: "designLoadRankName", width: 150}
    ];
    //补充操作列
    if (extraColumn) {
        if (Array.isArray(extraColumn)) extraColumn.forEach(c => columns.push(c));
        else columns.push(extraColumn);
    }
    return (
        <PaginationTable
            rowKey="id"
            loading={loading}
            pageData={bridgeData}
            columns={columns}
            scroll={{x: '100%'}}
            onChange={handleChange}
            {...restProps}
        />
    );
}

export default BridgeTable;