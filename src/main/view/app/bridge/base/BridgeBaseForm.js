import React, {useEffect, useState} from "react";
import DraggableModal from "../../../component/modal/DraggableModal";
import {Cascader, Col, DatePicker, Form, Input, InputNumber, Row, Select, Tabs, TreeSelect, Table} from "antd";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import RoadClient from "../../../../client/bridge/RoadClient";
import AddressClient from "../../../../client/bridge/AddressClient";
import {toCodePaths, walkTree} from "../../../../util/TreeUtils";
import DictionaryClient from "../../../../client/param/DictionaryClient";
import ManagementClient from "../../../../client/bridge/ManagementClient";
import {toDate} from "../../../../util/DateUtils";
import BridgeStrideTable from './BridgeStrideTable'

const BridgeBaseForm = ({visible, bridgeData, onOk, onCancel}) => {
    //组件状态
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [roadTree, setRoadTree] = useState([]);
    const [addressTree, setAddressTree] = useState([]);
    const [bridgeTypeCodeData, setBridgeTypeCodeData] = useState([]);
    const [managementTree, setManagementTree] = useState([]);
    const [bridgeNatureData, setBridgeNatureData] = useState([]);
    const [strideTypeData, setStrideTypeData] = useState([]);
    const [roadTechRankData, setRoadTechRankData] = useState([]);
    const [designLoadRankData, setDesignLoadRankData] = useState([]);
    const [bridgeUsageData, setBridgeUsageData] = useState([]);
    const [navGradeData, setNavGradeData] = useState([]);
    const [regulatingStructureData, setRegulatingStructureData] = useState([]);
    const [slopeFeatureData, setSlopeFeatureData] = useState([]);
    const [seismicDesignData, setSeismicDesignData] = useState([]);
    const [chargeConditionData, setChargeConditionData] = useState([]);
    const [functionTypeData, setFunctionTypeData] = useState([]);
    const [strideTableData, setStrideTableData] = useState([])
    const [guardrailGradeData, setGuardrailGradeData] = useState([])
    const [protectFacilityTypeData, setProtectFacilityTypeData] = useState([])
    //获取初始数据
    const fetchFormData = () => {
        RoadClient.listRoadTree().then(data => {
            walkTree(data, d => d.value = d.data.roadNo);
            setRoadTree(data);
        });
        AddressClient.listAddressTrees().then(setAddressTree);
        DictionaryClient.listDictionariesByField("BRIDGE_TYPE_CODE").then(setBridgeTypeCodeData);
        ManagementClient.listManagementTrees().then(data => {
            walkTree(data, d => d.key = d.data.id);
            setManagementTree(data);
        });
        DictionaryClient.listDictionariesByField("BRIDGE_NATURE").then(setBridgeNatureData);
        DictionaryClient.listDictionariesByField("STRIDE_TYPE").then(setStrideTypeData);
        DictionaryClient.listDictionariesByField("ROAD_TECH_RANK").then(setRoadTechRankData);
        DictionaryClient.listDictionariesByField("DESIGN_LOAD_RANK").then(setDesignLoadRankData);
        DictionaryClient.listDictionariesByField("BRIDGE_USAGE").then(setBridgeUsageData);
        DictionaryClient.listDictionariesByField("NAV_GRADE").then(setNavGradeData);
        DictionaryClient.listDictionariesByField("REGULATING_STRUCTURE").then(setRegulatingStructureData);
        DictionaryClient.listDictionariesByField("SLOPE_FEATURE").then(setSlopeFeatureData);
        DictionaryClient.listDictionariesByField("SEISMIC_DESIGN").then(setSeismicDesignData);
        DictionaryClient.listDictionariesByField("CHARGE_CONDITION").then(setChargeConditionData);
        DictionaryClient.listDictionariesByField("FUNCTION_TYPE").then(setFunctionTypeData);
        DictionaryClient.listDictionariesByField("GUARDRAIL_GRADE").then(setGuardrailGradeData);
        DictionaryClient.listDictionariesByField("PROTECT_FACILITY_TYPE").then(setProtectFacilityTypeData);
    };
    useEffect(fetchFormData, []);
    //提交表单
    const submitForm = values => {
        setSaving(true);
        const addressCode = Array.isArray(values.addressCode) ? values.addressCode[values.addressCode.length - 1] : undefined;
        if (strideTableData.length > 0) {
            values.bridgeStrideList = strideTableData
        }
        const request = bridgeData
            ? BridgeBaseClient.updateBridge(bridgeData.id, {...bridgeData, ...values, addressCode})
            : BridgeBaseClient.insertBridge({...values, addressCode});
        request.then(onOk).finally(() => {
            setSaving(false)
        });
    };

    const getArrIndex = (strideData, id) => {
        let updateIndex = -1
        for (let sindex = 0; sindex < strideData.length; sindex++) {
            if (strideData[sindex].id === id) {
                updateIndex = sindex
                break
            }
        }
        return updateIndex
    }
    const saveStrideTableRow = (record, id) => {
        if (id) {
            let strideData = Array.from(strideTableData)
            let updateIndex = getArrIndex(strideData, id)
            if (updateIndex > -1) {
                strideData[updateIndex] = record
            }
            setStrideTableData(strideData)
        } else {
            setStrideTableData([...strideTableData, record])
        }
    }
    const deleteStrideData = id => {
        let strideData = Array.from(strideTableData)
        let updateIndex = getArrIndex(strideData, id)
        if (updateIndex > -1) {
            strideData.splice(updateIndex, 1)
        }
        setStrideTableData(strideData)
    }
    useEffect(() => {
        if (visible && bridgeData) {
            if (bridgeData.bridgeStrideList) {
                setStrideTableData(bridgeData.bridgeStrideList)
            }
        } else {
            setStrideTableData([])
        }
    }, [bridgeData, visible]);
    //初始化桥梁数据
    useEffect(form.resetFields, [visible]);
    //渲染
    return (
        <DraggableModal
            visible={visible}
            confirmLoading={saving}
            onOk={form.submit}
            onCancel={onCancel}
            width={1300}
            title="桥梁基础信息表单">
            <Form form={form}
                  labelCol={{span: 10}}
                  wrapperCol={{span: 14}}
                  initialValues={bridgeData
                      ? {
                          ...bridgeData,
                          addressCode: bridgeData.addressCode ? toCodePaths(bridgeData.addressCode, 2) : '',
                          buildDate: toDate(bridgeData, "buildDate"),
                          rebuildDate: toDate(bridgeData, "rebuildDate"),
                          openTrafficDate: toDate(bridgeData, "openTrafficDate")
                      }
                      : undefined
                  }
                  onFinish={submitForm}>
                <Tabs tabPosition="left">
                    <Tabs.TabPane key="1" tab="行政识别信息">
                        <Row>
                            <Col span={8}>
                                <Form.Item label="桥梁名称" name="bridgeName"
                                           rules={[{required: true, message: "桥梁名称不能为空"}]}>
                                    <Input placeholder="输入桥梁名称"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="路线编号" name="roadNo" rules={[{required: true, message: "路线编号不能为空"}]}>
                                    <TreeSelect treeData={roadTree} placeholder="选择路线编号" showSearch/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="路线名称" name="roadName">
                                    <Input placeholder="输入路线名称"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="公路技术状况等级" name="roadTechRankId">
                                    <Select placeholder="选择公路技术状况等级" allowClear>
                                        {roadTechRankData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="所在地" name="addressCode">
                                    <Cascader fieldNames={{label: "title", value: "key"}} options={addressTree}
                                              placeholder="选择桥梁所在地..." showSearch/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="桥类码" name="bridgeTypeCode">
                                    <Select placeholder="选择桥类码">
                                        {bridgeTypeCodeData.map(d => (<Select.Option key={d.dicValue}
                                                                                     value={d.dicValue}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="顺序号" name="ordinal" >
                                    <InputNumber precision={0} placeholder="输入顺序号" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="扩充码" name="extendCode" >
                                    <InputNumber precision={0} placeholder="输入扩充码" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="中心桩号" name="stakeNo" rules={[{required: true, message: "中心桩号不能为空"}]}>
                                    <InputNumber precision={6} placeholder="输入中心桩号" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="施工桩号" name="constructStakeNo">
                                    <Input placeholder="输入施工桩号"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="功能类型" name="functionTypeId">
                                    <Select placeholder="选择功能类型" allowClear>
                                        {functionTypeData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="桥梁性质" name="bridgeNatureId">
                                    <Select placeholder="选择桥梁性质" allowClear>
                                        {bridgeNatureData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="设计荷载等级" name="designLoadRankId">
                                    <Select placeholder="选择设计荷载等级" allowClear>
                                        {designLoadRankData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="通行限重(吨)" name="loadCapacity">
                                    <InputNumber precision={0} placeholder="输入通行限重" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="管养单位" name="managementId"
                                           rules={[{required: true, message: "管养单位不能为空"}]}>
                                    <TreeSelect treeData={managementTree} placeholder="选择管养单位" showSearch/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            {/*<Col span={8}>*/}
                            {/*    <Form.Item label="跨越地物类型" name="strideTypeId">*/}
                            {/*        <Select placeholder="选择跨越地物类型" mode="multiple" allowClear>*/}
                            {/*            {strideTypeData.map(d => (<Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}*/}
                            {/*        </Select>*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            {/*<Col span={8}>*/}
                            {/*    <Form.Item label="跨越地物名称" name="strideName">*/}
                            {/*        <Input placeholder="输入跨越地物名称"/>*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            <Col span={8}>
                                <Form.Item label="桥梁用途" name="bridgeUsageId">
                                    <Select placeholder="选择桥梁用途" allowClear>
                                        {bridgeUsageData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="建成年月" name="buildDate">
                                    <DatePicker style={{width: "100%"}} placeholder="选择建成年月" picker="month"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="改建年月" name="rebuildDate">
                                    <DatePicker style={{width: "100%"}} placeholder="选择改建年月" picker="month"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="经度" name="longitude">
                                    <InputNumber precision={6} placeholder="输入经度" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="纬度" name="latitude">
                                    <InputNumber precision={6} placeholder="输入纬度" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="是否互通立交" name="interChange">
                                    <Select placeholder="选择是否互通立交" allowClear>
                                        {/*<Select.Option value={0}>未知</Select.Option>*/}
                                        <Select.Option value={1}>是</Select.Option>
                                        <Select.Option value={2}>否</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="是否宽路窄桥" name="wideroadNarrowbridge">
                                    <Select placeholder="选择是否宽路窄桥" allowClear>
                                        {/*<Select.Option value={0}>未知</Select.Option>*/}
                                        <Select.Option value={1}>是</Select.Option>
                                        <Select.Option value={2}>否</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="是否在长大桥梁名录" name="largeDirectory">
                                    <Select placeholder="选择是否在长大桥梁名录" allowClear>
                                        {/*<Select.Option value={0}>未知</Select.Option>*/}
                                        <Select.Option value={1}>是</Select.Option>
                                        <Select.Option value={2}>否</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="是否有健康监测系统" name="inMonitor">
                                    <Select placeholder="选择是否有健康监测系统" allowClear>
                                        {/*<Select.Option value={0}>未知</Select.Option>*/}
                                        <Select.Option value={1}>是</Select.Option>
                                        <Select.Option value={2}>否</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="是否独柱墩" name="singleColumn">
                                    <Select placeholder="选择是否独柱墩" allowClear>
                                        {/*<Select.Option value={0}>未知</Select.Option>*/}
                                        <Select.Option value={1}>是</Select.Option>
                                        <Select.Option value={2}>否</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="墩台防撞设施类型" name="protectFacilityType">
                                    <Select placeholder="选择墩台防撞设施类型" allowClear>
                                        {protectFacilityTypeData.map(d => (<Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="2" tab="结构技术数据">
                        <Row>
                            <Col span={8}>
                                <Form.Item label="桥宽组合(m)" name="widthComb"
                                           rules={[{
                                               pattern: /((\d+(\.\d+)?)(~\d+(\.\d+)?)?(\+(\d+(\.\d+)?)(~\d+(\.\d+)?)?)*)?/,
                                               message: "桥宽组合格式错误，必须为数字和+号组成，示例：0.5+14+0.5"
                                           }]}>
                                    <Input placeholder="输入桥宽组合"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="车行道宽(m)" name="laneWidth">
                                    <Input placeholder="输入车行道宽"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="桥面中心标高(m)" name="deckCenterElevation">
                                    <Input placeholder="输入桥面中心标高"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            {/*<Col span={8}>*/}
                            {/*    <Form.Item label="桥下净高(m)" name="downClearHeight">*/}
                            {/*        <InputNumber precision={1} placeholder="桥下净高" style={{width: "100%"}}/>*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            <Col span={8}>
                                <Form.Item label="桥上净高(m)" name="upClearHeight">
                                    <InputNumber precision={1} placeholder="桥上净高" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="引道总宽(m)" name="accessTotalWidth">
                                    <Input placeholder="输入引道总宽"/>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="引道路面宽(m)" name="accessRoadWidth">
                                    <Input placeholder="输入引道路面宽"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="引道线形" name="accessLineTypeId">
                                    <Input placeholder="输入引道线形"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="弯斜坡特征" name="slopeFeatureId">
                                    <Select placeholder="选择弯斜坡特征" allowClear>
                                        {slopeFeatureData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="平曲线半径" name="horizontalCurveRadius">
                                    <Input placeholder="输入平曲线半径"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="桥梁斜交角" name="bridgeSkewAngle">
                                    <Input placeholder="输入桥梁斜交角"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="最大横坡" name="crossSlope">
                                    <Input placeholder="输入最大横坡"/>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="通航净空" name="navClearance">
                                    <Input placeholder="输入通航净空"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="通航等级" name="navGradeId">
                                    <Select placeholder="选择通航等级" allowClear>
                                        {navGradeData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="航道桩号" name="navStakeNo">
                                    <Input placeholder="输入航道桩号"/>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="矢跨比" name="riseSpanRatio">
                                    <Input placeholder="输入矢跨比"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="桥面纵坡" name="deckProfileGrade">
                                    <Input placeholder="输入桥面纵坡"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="地震动峰值加速度" name="seismicPeakAcceleration">
                                    <Input placeholder="输入地震动峰值加速度"/>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="桥台护坡" name="slopeProtector">
                                    <Input placeholder="输入桥台护坡"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="护墩体" name="pierProtector">
                                    <Input placeholder="输入护墩体"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="调治构造物" name="regulatingStructureId">
                                    <Select placeholder="选择调治构造物" allowClear>
                                        {regulatingStructureData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="常水位" name="normalWaterGrade">
                                    <Input placeholder="输入常水位"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="设计水位" name="designWaterGrade">
                                    <Input placeholder="输入设计水位"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="引导曲线半径(m)" name="guideCurveRadius">
                                    <InputNumber placeholder="输入引导曲线半径(m)" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="人行道宽度(m)" name="sidewalkWidth">
                                    <InputNumber placeholder="输入人行道宽度(m)" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="中护栏等级" name="middleGuardrailGrade">
                                    <Select placeholder="选择中护栏等级" allowClear>
                                        {guardrailGradeData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="边护栏等级" name="sideGuardrailGrade">
                                    <Select placeholder="选择边护栏等级" allowClear>
                                        {guardrailGradeData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="防撞栏高度(m)" name="crashBarrierHeight">
                                    <InputNumber placeholder="输入防撞栏高度(m)" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="护栏高度(m)" name="guardrailHeight">
                                    <InputNumber placeholder="输入护栏高度(m)" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="中央分隔带宽度(m)" name="medianWidth">
                                    <InputNumber placeholder="输入中央分隔带宽度(m)" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="桥面标准净宽" name="deckStandardClearance">
                                    <InputNumber placeholder="输入桥面标准净宽" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="桥面实际净宽" name="deckActualClearance">
                                    <InputNumber placeholder="输入桥面实际净宽" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="桥下标准净宽" name="underStandardClearance">
                                    <InputNumber placeholder="输入桥下标准净宽" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="桥下实际净宽" name="underActualClearance">
                                    <InputNumber placeholder="输入桥下实际净宽" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="3" tab="经济指标数据">
                        <Row>
                            <Col span={8}>
                                <Form.Item label="主桥基底标高(m)" name="baseElevation">
                                    <InputNumber precision={3} placeholder="输入主桥基底标高" style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="设计洪水频率" name="designFloodFreq">
                                    <Input placeholder="输入设计洪水频率"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="设计冲刷标高(m)" name="designFlushElevation">
                                    <Input placeholder="输入设计冲刷标高"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="历史最大洪水位" name="historyMaxFlood">
                                    <Input placeholder="输入历史最大洪水位"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="设计时速(km/h)" name="designSpeed">
                                    <Input placeholder="输入设计时速"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="通车日期" name="openTrafficDate">
                                    <DatePicker style={{width: "100%"}} placeholder="选择通车日期" picker="month"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="抗震设防" name="seismicDesignId">
                                    <Select placeholder="选择抗震设防" allowClear>
                                        {seismicDesignData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="地基地质" name="groundGeologyId">
                                    <Input placeholder="输入地基地质"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="收费情况" name="chargeConditionId">
                                    <Select placeholder="选择收费情况" allowClear>
                                        {chargeConditionData.map(d => (
                                            <Select.Option key={d.id} value={d.id}>{d.dicValue}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="4" tab="跨越地物及下穿通道">
                        <BridgeStrideTable bridgeData={bridgeData} strideTypeData={strideTypeData}
                                           dataSource={strideTableData} saveStrideTableRow={saveStrideTableRow}
                                           deleteStrideData={deleteStrideData}/>
                    </Tabs.TabPane>
                </Tabs>
            </Form>
        </DraggableModal>
    )
};

export default BridgeBaseForm;