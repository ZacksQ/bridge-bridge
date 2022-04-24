import React, {useEffect, useState} from "react";
import {Form, Input, InputNumber, Select} from "antd";
import DraggableModal from "../../../component/modal/DraggableModal";
import BridgeSideClient from "../../../../client/bridge/BridgeSideClient";
import DictionaryClient from "../../../../client/param/DictionaryClient";

const BridgeSideForm = ({visible, bridgeId, initialData, onOk, onCancel}) => {
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
        const request = initialData
            ? BridgeSideClient.updateBridgeSide(initialData.id, {...initialData, ...values})
            : BridgeSideClient.insertBridgeSide({bridgeId, ...values});
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
            <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 18}} initialValues={initialData} onFinish={submitForm}>
                <Form.Item label="分幅类型" name="sideTypeId" rules={[{required: true, message: "分幅类型不能为空"}]}>
                    <Select placeholder="选择分幅类型">
                        {sideTypeData.map(d => (<Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                    </Select>
                </Form.Item>
                <Form.Item label="桥梁全长" name="bridgeLength">
                    <InputNumber style={{width: "100%"}} precision={2} step={0.1} placeholder="桥梁全长..."/>
                </Form.Item>
                <Form.Item label="跨径组合" name="spanComb">
                    <Input.TextArea placeholder="跨径组合..." autoSize/>
                </Form.Item>
            </Form>
        </DraggableModal>
    )
}

export default BridgeSideForm;