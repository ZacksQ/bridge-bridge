import React, {useEffect, useState} from "react";
import DraggableModal from "../../../component/modal/DraggableModal";
import DictionaryClient from "../../../../client/param/DictionaryClient";
import {Table} from "antd";

const DictionaryForm = ({visible, groupId, onOk, onCancel}) => {
    //组件状态
    const [saving, setSaving] = useState(false);
    const [dictionaryData, setDictionaryData] = useState([]);
    const [selectedDic, setSelectedDic] = useState([]);
    //获取初始化数据
    useEffect(() => {
        if (visible) {
            DictionaryClient.getDictionaryPageFromBase({
                current: 1,
                pageSize: 0x7fffffff,
                searchData: {groupId: [groupId]}
            }).then(pageData => setDictionaryData(pageData.data));
        }
        //不管可不可见，清空选择
        setSelectedDic([]);
        // eslint-disable-next-line
    }, [visible]);
    //提交表单
    const submitForm = () => {
        setSaving(true);
        DictionaryClient.insertDictionaries(selectedDic)
            .then(onOk)
            .finally(() => setSaving(false));
    };
    //处理选择事件
    const handleTableSelect = (keys, rows) => {
        setSelectedDic(rows);
    };
    //定义表格列
    const columns = [
        {title: "顺序号", key: "ordinal", dataIndex: "ordinal"},
        {title: "字典值", key: "dicValue", dataIndex: "dicValue"},
        {title: "备注", key: "note", dataIndex: "note"}
    ];
    //渲染组件
    return (
        <DraggableModal
            visible={visible}
            title="数据字典表单"
            confirmLoading={saving}
            onOk={submitForm}
            onCancel={onCancel}
            disableOkBtn={selectedDic.length === 0}>
            <Table
                size="small"
                rowKey="id"
                rowSelection={{
                    selectedRowKeys: selectedDic.map(d => d.id),
                    onChange: handleTableSelect
                }}
                columns={columns}
                dataSource={dictionaryData}
                pagination={false}
            />
        </DraggableModal>
    );
}

export default DictionaryForm;