import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import DraggableModal from "../../../component/modal/DraggableModal";
import {toDate} from "../../../../util/DateUtils";
import BridgeBuildClient from "../../../../client/bridge/BridgeBuildClient";

const BridgeBuildForm = ({visible, bridgeId, initialData, onOk, onCancel, buildTypeList, qualityEvaluationList}) => {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    //处理保存事件
    const submitForm = values => {
        setSaving(true);
        const request = initialData
            ? BridgeBuildClient.updateBridgeBuild({...initialData, ...values})
            : BridgeBuildClient.insertBridgeBuild({bridgeId, ...values});
        request.then(onOk).finally(() => setSaving(false));
    };
    //初始化表单
    useEffect(() => {
        if (initialData && visible) {
            if(initialData.commenceDate){
                initialData.commenceDate = toDate(initialData, "commenceDate");
            }
            if(initialData.completionDate){
                initialData.completionDate = toDate(initialData, "completionDate");
            }
        }
        // eslint-disable-next-line
    }, [visible]);
    useEffect(form.resetFields, [visible]);
    //渲染
    return (
        <DraggableModal
            visible={visible}
            title="修建工程记录"
            confirmLoading={saving}
            onOk={form.submit}
            onCancel={onCancel}>
            <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 18}} initialValues={initialData} onFinish={submitForm}>
                <Form.Item label="开工日期" name="commenceDate" >
                    <DatePicker style={{width: "100%"}} placeholder="选择开工日期"/>
                </Form.Item>
                <Form.Item label="完工日期" name="completionDate" >
                    <DatePicker style={{width: "100%"}} placeholder="选择完工日期"/>
                </Form.Item>
                <Form.Item label="修建类别" name="buildType">
                    <Select placeholder="修建类别..." allowClear>
                        {buildTypeList.map(d=><Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="修建原因" name="buildReason">
                    <Input placeholder="修建原因..."/>
                </Form.Item>
                <Form.Item label="工程范围" name="projectRange">
                    <Input placeholder="工程范围..."/>
                </Form.Item>
                <Form.Item label="工程费用（万元）" name="projectCost">
                    <Input placeholder="工程费用（万元）..."/>
                </Form.Item>
                <Form.Item label="经费来源" name="chargeSource">
                    <Input placeholder="经费来源..."/>
                </Form.Item>
                <Form.Item label="质量评定" name="qualityEvaluation">
                    <Select placeholder="质量评定..." allowClear>
                        {qualityEvaluationList.map(d=><Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="建设单位" name="buildUnit">
                    <Input placeholder="建设单位..."/>
                </Form.Item>
                <Form.Item label="设计单位" name="designUnit">
                    <Input placeholder="设计单位..."/>
                </Form.Item>
                <Form.Item label="施工单位" name="constructUnit">
                    <Input placeholder="施工单位..."/>
                </Form.Item>
                <Form.Item label="监理单位" name="superviseUnit">
                    <Input placeholder="监理单位..."/>
                </Form.Item>
            </Form>
        </DraggableModal>
    )
}

export default BridgeBuildForm;