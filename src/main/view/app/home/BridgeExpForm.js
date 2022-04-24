import React, { useEffect, useState } from "react";
import DraggableModal from "../../component/modal/DraggableModal";
import { Col, Form, Input, Row, Upload, Select, Button, message } from "antd";

import clientHome from "../../../client/home/home";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const BridgeExpForm = ({ visible, highwayClassify, userData, provinceList, specialUpperList, onOk, onCancel }) => {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [file, setFile] = useState(null);

    //初始化
    useEffect(() => {
        form.resetFields()
        if (visible === false) setFile(null)
    }, [visible]);
    //提交表单
    const submitForm = values => {
        setSaving(true);
        form.validateFields().then(values => {
            let postData = { ...values }
            if (file) { postData.file = file }
            else {
                message.error("文件未上传")
                setSaving(false)
                return false
            }
            clientHome.addBridgeExp(postData).then(res => {
                if (res.code === 0) {
                    onOk()
                } else {
                    message.error(res.resultNote)
                }
            }).finally(() => {
                setSaving(false)
            });
            // console.log(values)
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
            width={650}>
            <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} initialValues={userData} onFinish={submitForm}>
                <Row>
                    <Col span={24}>
                        <Form.Item label="项目名称" name="name" rules={[{ required: true, message: "项目名称不能为空" }]}>
                            <Input placeholder="项目名称" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="所在省份" name="province" >
                            <Select placeholder="选择所在省份">
                                {provinceList.map(d => (<Select.Option key={d.key} value={d.key}>{d.value}</Select.Option>))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="公路分级" name="highwayClassify" >
                            <Select placeholder="选择公路分级">
                                {highwayClassify.map(d => (<Select.Option key={d.key} value={d.key}>{d.value}</Select.Option>))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="特殊上部结构" name="specialUpper" >
                            <Select placeholder="选择特殊上部结构" mode="multiple">
                                {specialUpperList.map(d => (<Select.Option key={d.key} value={d.key}>{d.value}</Select.Option>))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="上传文件" name="file" >
                            <Upload customRequest={(options) => {
                                setFile(options.file)
                                options.onSuccess({}, options.file)
                            }} maxCount={1}>
                                <Button icon={<UploadOutlined />} size={"small"} ghost type="primary">点击上传文件</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </DraggableModal>
    )
}

export default BridgeExpForm;