import React, {useEffect, useState} from "react";
import {Button} from "antd";
import DeleteButton from "../../../component/button/DeleteButton";
import {getColumnSearchProps} from "../../../component/table/Column";
import {useParams} from "react-router-dom";
import PaginationTable from "../../../component/table/PaginationTable";
import Toolbar from "../../../component/toolbar/Toolbar";
import Card from "../../../component/card/Card";
import {PlusOutlined} from "@ant-design/icons";
import DictionaryClient from "../../../../client/param/DictionaryClient";
import DictionaryForm from "./DictionaryForm";

const Dictionary = () => {
    //路由
    const {groupId} = useParams();
    //组件状态
    const [loading, setLoading] = useState(false);
    const [dicGroup, setDicGroup] = useState({});
    const [dicData, setDicData] = useState({data: [], current: 1, pageSize: 10, total: 0, searchData: {}});
    const [dicFormVisible, setDicFormVisible] = useState(false);
    //初始化
    useEffect(() => {
        fetchDicData(dicData);
        fetchDicGroup();
        // eslint-disable-next-line
    }, []);
    //获取字典值数据
    const fetchDicData = pageData => {
        setLoading(true);
        pageData.searchData = {...pageData.searchData, groupId: [groupId]};
        DictionaryClient
            .getDictionaryPage(pageData)
            .then(setDicData)
            .finally(() => setLoading(false));
    }
    //根据ID获取字典组
    const fetchDicGroup = () => {
        DictionaryClient.getDictionaryGroupById(groupId).then(setDicGroup);
    };
    //表格变动事件处理
    const handleTableChange = (pagination, filters, sorters) => {
        fetchDicData({...pagination, searchData: filters});
    };
    //打开表单
    const showDicForm = () => {
        setDicFormVisible(true);
    };
    //表单保存事件
    const handleSave = () => {
        setDicFormVisible(false);
        fetchDicData(dicData);
    };
    //处理删除事件
    const handleDelete = id => {
        DictionaryClient.deleteDictionary(id).then(response => fetchDicData(dicData));
    };
    //定义表格列
    const columns = [
        {title: "顺序号", key: "ordinal", dataIndex: "ordinal"},
        {title: "字典值", key: "dicValue", dataIndex: "dicValue", ...getColumnSearchProps(dicData.searchData.dicValue)},
        {title: "备注", key: "note", dataIndex: "note"},
        {title: "操作", key: "action", width: 150, align: "center", render: (text, record) => <DeleteButton onConfirm={() => handleDelete(record.id)}/>}
    ];
    //渲染数据字典值表格
    return (
        <Card title={dicGroup.groupName + "字典值管理"} canBack>
            <Toolbar>
                <Button size="small" icon={<PlusOutlined/>} onClick={showDicForm}>选择字典值</Button>
            </Toolbar>
            <PaginationTable
                rowKey="id"
                loading={loading}
                pageData={dicData}
                columns={columns}
                onChange={handleTableChange}/>
            <DictionaryForm
                visible={dicFormVisible}
                groupId={groupId}
                onOk={handleSave}
                onCancel={() => setDicFormVisible(false)}
            />
        </Card>
    )
}

export default Dictionary;