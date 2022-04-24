import React, { useEffect, useState } from "react";
import DraggableModal from "../../component/modal/DraggableModal";
import { Col, Form, Input, Row, TreeSelect, Select } from "antd";
import BridgeGroupClient from "../../../client/bridgeGroup/BridgeGroupClient";

const { Option } = Select;
const BridgeResultForm = ({ visible, onOk, selectedBridgeId, formData, onCancel, drillList, pierNoList }) => {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState([]);

    //初始化
    useEffect(form.resetFields, [visible]);
    //提交表单
    const submitForm = () => {
        form.validateFields().then(values => {
            BridgeGroupClient.changeHole({ ...values, groupId: selectedBridgeId, summaryId: 0 })
                .then(onOk).finally(() => setSaving(false))
        })
    };
    //渲染
    return (
        <DraggableModal
            title="数据编辑"
            onOk={form.submit}
            confirmLoading={saving}
            visible={visible}
            onCancel={onCancel}
            width={760}>
            <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={formData} onFinish={submitForm}>
                <Row>
                    <Col span={12}>
                        <Form.Item label="墩台编号" name="pierNo" rules={[{ required: true, message: "墩台编号不能为空" }]}>
                            <Select placeholder="选择墩台编号" >
                                {pierNoList.map(d => <Select.Option value={d.pierNo} key={d.pierNo}>{d.pierNo}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="对应孔号" name="corrDrillNum" rules={[{ required: true, message: "对应孔号不能为空" }]}>
                            <Select placeholder="选择对应孔号" >
                                {drillList.map(d => <Select.Option value={d.drillNum} key={d.drillNum}>{d.drillNum}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </DraggableModal>
    )
}

export default BridgeResultForm;