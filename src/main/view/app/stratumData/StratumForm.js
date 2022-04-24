import React, { useEffect, useState } from "react";
import DraggableModal from "../../component/modal/DraggableModal";
import { Col, Form, Input, Row, message, Select } from "antd";
import StratumClient from "../../../client/stakeLength/StratumClient";

const { Option } = Select;
const StratumForm = ({ visible, permeableTypeList, userData, softSoilTypeList, onOk, onCancel }) => {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState([]);

    //初始化
    useEffect(form.resetFields, [visible]);
    //提交表单
    const submitForm = values => {
        setSaving(true);
        StratumClient.editStratumData({ ...values, id: 0}).then(res => {
            if (res.code === 0) {
                // const newData = [...stratumData.data];
                // const index = stratumData.data.findIndex((item) => record.id === item.id);

                // if (index > -1) {
                //     const item = stratumData.data[index];
                //     newData.splice(index, 1, { ...item, ...row });
                //     setStratumData({ data: newData });
                //     setEditingKey('');
                // }
            } else {
                message.error(res.resultNote)
            }
        }).then(onOk)
        // const request = userData
        //     ? UserClient.updateUser({...userData, ...values})
        //     : UserClient.insertUser({...values, unitId: selectedUnitId});
        // request.then(onOk).finally(() => setSaving(false));
    };
    //渲染
    return (
        <DraggableModal
            title="数据编辑"
            onOk={form.submit}
            confirmLoading={saving}
            visible={visible}
            onCancel={onCancel}
            width={900}>
            <Form form={form} labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} initialValues={userData} onFinish={submitForm}>
                <Row>
                    <Col span={12}>
                        <Form.Item label="岩土编号" name="soilNumber" rules={[{ required: true, message: "岩土编号不能为空" }]}>
                            <Input placeholder="请输入岩土编号" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="岩土名称" name="soilName" rules={[{ required: true, message: "岩土名称不能为空" }]}>
                            <Input placeholder="请输入岩土名称" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>

                    <Col span={12}>
                        <Form.Item label="液限/%" name="liquidLimit" rules={[{ required: true, message: "液限不能为空" }]}>
                            <Input placeholder="请输入液限" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="液性指数/lL" name="liquidIndex" rules={[{ required: true, message: "液性指数不能为空" }]}>
                            <Input placeholder="请输入液性指数" />
                        </Form.Item>
                    </Col>

                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label={<>地基承载力特性值[f<sub>a0</sub>]/kPa</>} name="fa0" rules={[{ required: true, message: "地基承载力特性值不能为空" }]}>
                            <Input placeholder="请输入地基承载力特性值" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<>桩侧土摩阻力标准值[q<sub>ik</sub>]kPa</>} name="qik" rules={[{ required: true, message: "桩侧土摩阻力标准值不能为空" }]}>
                            <Input placeholder="请输入桩侧土摩阻力标准值" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label={<>饱和单轴抗压强度R<sub>aj</sub>/MPa</>} name="raj" rules={[{ required: true, message: "饱和单轴抗压强度不能为空" }]}>
                            <Input placeholder="请输入饱和单轴抗压强度" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={"透水性"} name="permeable"rules={[{ required: true, message: "透水性不能为空" }]}>
                            <Select placeholder="请选择透水性" >
                                {permeableTypeList&&permeableTypeList.map(d => <Select.Option value={d.value} key={d.value}>{d.text}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label={<>K<sub>2</sub></>} name="k2" rules={[{ required: true, message: "k2不能为空" }]}>
                            <Input placeholder="请输入k2" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={"软弱层"} name="softSoil" rules={[{ required: true, message: "软弱层不能为空" }]}>
                            <Select placeholder="请选择是否软弱层" >
                                {softSoilTypeList&&softSoilTypeList.map(d => <Select.Option value={d.value} key={d.value}>{d.text}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </DraggableModal>
    )
}

export default StratumForm;