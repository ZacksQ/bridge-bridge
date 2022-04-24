import React, {useEffect, useState} from "react";
import {Form, Input, InputNumber, Select, message, Col} from "antd";
import DraggableModal from "../../../component/modal/DraggableModal";
import BridgeSideClient from "../../../../client/bridge/BridgeSideClient";
import DictionaryClient from "../../../../client/param/DictionaryClient";
import {createUUID} from "../../../../util/StringUtils";

const labelCol = {
    span: 9
}

const BridgeStrideForm = ({visible, initialData, strideTypeData, onOk, onCancel, bridgeData}) => {
    const [form] = Form.useForm()

    //处理保存事件
    const submitForm = values => {
        if(!values.siteEnd){
            values.siteEnd = values.siteStart
        }
        if(bridgeData && bridgeData.maxSiteNo){
            let result = true
            if(values.siteEnd>bridgeData.maxSiteNo){
                result = false
            }
            if(values.siteStart<0||values.siteStart>bridgeData.maxSiteNo){
                result = false
            }
            if(result===false){
                message.error("孔号填写有误或超过最大孔号")
                return false
            }
        }
        values.strideTypeName = strideTypeData.filter(item=>item.id===values.strideType)[0].dicValue

        values.id = createUUID()
        onOk(values)
    };
    //初始化表单
    useEffect(form.resetFields, [visible]);
    //渲染
    return (
        <DraggableModal
            visible={visible}
            title="跨越地物及下穿通道表单"
            onOk={form.submit}
            onCancel={onCancel}>
            <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 18}} initialValues={initialData} onFinish={submitForm}>
                <Form.Item labelCol={labelCol} label={"孔号"+(bridgeData?`(最大孔号${bridgeData.maxSiteNo})`:"")} required={true} >
                    <Input.Group compact>
                        <Form.Item name="siteStart" rules={[{required: true, message: "起始孔号不能为空"}]} style={{marginBottom: 0}}>
                            <Input style={{ width: 115, textAlign: 'center' }} placeholder="起始孔号" />
                        </Form.Item>
                        <Input
                            className="site-input-split"
                            style={{
                                width: 30,
                                borderLeft: 0,
                                borderRight: 0,
                                pointerEvents: 'none',
                            }}
                            placeholder="~"
                            disabled
                        />
                        <Form.Item name="siteEnd" style={{marginBottom: 0}}>
                            <Input
                                className="site-input-right"
                                style={{
                                    width: 115,
                                    textAlign: 'center',
                                }}
                                placeholder="结束孔号"
                            />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
                <Form.Item labelCol={labelCol} label="跨越地物或下穿通道类型" name="strideType" rules={[{required: true, message: "类型不能为空"}]}>
                    <Select placeholder="选择类型">
                        {strideTypeData.map(d => (<Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                    </Select>
                </Form.Item>
                <Form.Item labelCol={labelCol} label="下穿通道桩号" name="strideStake" rules={[{required: true, message: "下穿通道桩号不能为空"}]}>
                    <InputNumber placeholder="输入下穿通道桩号" style={{width: "100%"}}/>
                </Form.Item>
                <Form.Item labelCol={labelCol} label="跨越地物或下穿通道名称" name="strideName">
                    <Input style={{width: "100%"}} placeholder="跨越地物或下穿通道名称..."/>
                </Form.Item>
                <Form.Item labelCol={labelCol} label="桥下净高(m)" name="clearHeight">
                    <InputNumber placeholder="桥下净高..." style={{width: "100%"}} />
                </Form.Item>
                <Form.Item labelCol={labelCol} label="备注" name="notes">
                    <Input style={{width: "100%"}} placeholder="备注..."/>
                </Form.Item>
            </Form>
        </DraggableModal>
    )
}

export default BridgeStrideForm;