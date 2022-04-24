import React, {Fragment, useEffect, useState} from "react";
import {Tabs, Modal, Form, Input, Col, Popconfirm, message, Select, Button, Spin, Checkbox, Card} from "antd";
import moment from 'moment';
import AidDecisionMakingClient from "../../../../client/bridge/AidDecisionMakingClient";
import DiffOutlined from "@ant-design/icons/lib/icons/DiffOutlined";

const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 16}
};
const RoadNameForm = ({
                          onSave,
                          title,
                          visible,
                          onCancel,
                          initialValue
                      }) => {
    const [form] = Form.useForm()

    const handleOk = () => {
        form.validateFields().then(values=>{
            if (typeof onSave === "function") {
                let data = form.getFieldsValue()
                onSave(false, data)
            }
        })
    }
    //渲染
    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            onCancel={onCancel}
            maskClosable={false}
            destroyOnClose>
            <Form initialValues={initialValue} form={form}>
                <Form.Item name={"name"} {...formItemLayout} label="工程包名" rules={[{required: true, message: "请输入工程包名"}]}>
                        <Input />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default RoadNameForm;