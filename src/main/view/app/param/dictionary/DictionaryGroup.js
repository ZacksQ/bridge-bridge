import React, {useEffect, useState} from "react";
import DictionaryClient from "../../../../client/param/DictionaryClient";
import {getColumnSearchProps} from "../../../component/table/Column";
import {Button} from "antd";
import PaginationTable from "../../../component/table/PaginationTable";
import Card from "../../../component/card/Card";
import {useHistory} from "react-router-dom";

const DictionaryGroup = () => {
    //路由
    const history = useHistory();
    //组件状态
    const [loading, setLoading] = useState(false);
    const [groupData, setGroupData] = useState({data: [], current: 1, pageSize: 10, total: 0, searchData: {}});
    //生命周期函数
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchGroupData(groupData), []);
    //加载数据
    const fetchGroupData = groupData => {
        setLoading(true);
        DictionaryClient.getDictionaryGroupPage(groupData)
            .then(setGroupData)
            .finally(() => setLoading(false))
    };
    //跳转到字典页面
    const toDictionary = data => {
        history.push(`/param/dictionary/group/${data.id}`);
    };
    //处理表格变动
    const handleTableChange = (pagination, filters, sorter) => {
        fetchGroupData({...pagination, searchData: filters});
    };
    //表格列定义
    const columns = [
        {title: "字典组名", key: "groupName", dataIndex: "groupName", ...getColumnSearchProps(groupData.searchData.groupName)},
        {title: "属性字段", key: "fieldName", dataIndex: "field"},
        {title: "备注", key: "note", dataIndex: "note"},
        {title: "操作", key: "action", width: 240, align: "center", render: (text, record) => (
                <div>
                    <Button size="small" type="link" onClick={() => toDictionary(record)}>字典管理</Button>
                </div>
            )
        }
    ];
    //渲染
    return (
        <Card title="数据字典管理">
            <PaginationTable
                rowKey="id"
                loading={loading}
                pageData={groupData}
                columns={columns}
                onChange={handleTableChange}/>
        </Card>
    )
}

export default DictionaryGroup;