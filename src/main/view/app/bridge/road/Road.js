import React, {useEffect, useState} from "react";
import Card from "../../../component/card/Card";
import Toolbar from "../../../component/toolbar/Toolbar";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import DeleteButton from "../../../component/button/DeleteButton";
import PaginationTable from "../../../component/table/PaginationTable";
import RoadClient from "../../../../client/bridge/RoadClient";
import RoadForm from "./RoadForm";
import {getColumnSearchProps} from "../../../component/table/Column";

const Road = () => {
    //组件状态
    const [loading, setLoading] = useState(false);
    const [roadData, setRoadData] = useState({data: [], current: 1, pageSize: 10, total: 0, searchData: {}});
    const [roadFormVisible, setRoadFormVisible] = useState(false);
    const [roadRankData, setRoadRankData] = useState([]);
    //获取路线数据
    const fetchRoadData = pageData => {
        setLoading(true);
        RoadClient.getRoadPage(pageData)
            .then(setRoadData)
            .finally(() => setLoading(false));
    };
    const fetchRoadRankData = () => {
        RoadClient.listRoadRanks().then(setRoadRankData);
    };
    //初始化数据
    // eslint-disable-next-line
    useEffect(() => {
        fetchRoadData(roadData);
        fetchRoadRankData();
        // eslint-disable-next-line
    }, []);
    //打开表单
    const showRoadForm = () => {
        setRoadFormVisible(true);
    };
    //保存表单
    const handleSave = () => {
        setRoadFormVisible(false);
        fetchRoadData(roadData);
    };
    //表格变动
    const handleChange = (pagination, filters, sorters) => {
        fetchRoadData({...pagination, searchData: {...filters}});
    };
    //删除事件
    const handleDelete = id => {
        RoadClient.deleteRoad(id).then(() => fetchRoadData(roadData));
    };
    //表格列
    const columns = [
        {title: "路线行政等级", key: "roadRank", dataIndex: "roadRankName", width: 200, filters: roadRankData.map(r => ({text: r.roadRankName, value: r.roadRank}))},
        {title: "路线号", key: "roadNo", dataIndex: "roadNo", width: 200, ...getColumnSearchProps(roadData.searchData.roadNo)},
        {title: "操作", key: "action", width: 100, align: "center", render: (text, record) => <DeleteButton onConfirm={() => handleDelete(record.id)}>删除</DeleteButton>}
    ];
    //渲染
    return (
        <Card title="路线管理">
            <Toolbar>
                <Button size="small" icon={<PlusOutlined/>} onClick={showRoadForm}>选择路线编号</Button>
            </Toolbar>
            <PaginationTable
                rowKey="id"
                loading={loading}
                pageData={roadData}
                columns={columns}
                onChange={handleChange}
            />
            <RoadForm
                visible={roadFormVisible}
                onOk={handleSave}
                onCancel={() => setRoadFormVisible(false)}
            />
        </Card>
    )
};

export default Road;