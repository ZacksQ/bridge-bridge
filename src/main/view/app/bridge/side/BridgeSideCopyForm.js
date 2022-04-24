import React, {useEffect, useState} from "react";
import {Form, Select} from "antd";
import DraggableModal from "../../../component/modal/DraggableModal";
import DictionaryClient from "../../../../client/param/DictionaryClient";
import BridgeSideClient from "../../../../client/bridge/BridgeSideClient";

const BridgeSideCopyForm = ({visible, bridgeSideId, onOk, onCancel}) => {
    const [form] = Form.useForm();
    const [sideTypeData, setSideTypeData] = useState([]);
    const [saving, setSaving] = useState(false);
    //获取表单数据
    const fetchSideType = () => {
        DictionaryClient.listDictionariesByField("SIDE_TYPE").then(setSideTypeData);
    };
    useEffect(fetchSideType, []);
    //处理保存事件
    const submitForm = values => {
        setSaving(true);
        const request = BridgeSideClient.copyBridgeSide({...values, bridgeSideId});
        request.then(onOk).finally(() => setSaving(false));
    };
    //初始化表单
    useEffect(form.resetFields, [visible]);
    //渲染
    return (
        <DraggableModal
            visible={visible}
            title="分幅表单"
            confirmLoading={saving}
            onOk={form.submit}
            onCancel={onCancel}>
            <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 18}} onFinish={submitForm}>
                <Form.Item label="复制至分幅" name="sideTypeId" rules={[{required: true, message: "分幅类型不能为空"}]}>
                    <Select placeholder="选择分幅类型">
                        {sideTypeData.map(d => (<Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                    </Select>
                </Form.Item>
            </Form>
        </DraggableModal>
    )
}

export default BridgeSideCopyForm;