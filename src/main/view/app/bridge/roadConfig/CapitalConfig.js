import React, {Fragment, useEffect, useState} from "react";
import {Tabs, Divider, Form, Row, Col, Slider, message, Select, Button, Spin, InputNumber, Card} from "antd";
import AidDecisionMakingClient from "../../../../client/bridge/AidDecisionMakingClient";
import OptimizeConfigDetail from "./OptimizeConfigDetail";
import AreaIcon from '../../../../../resources/img/段区优先标签.png'
import CaseIcon from '../../../../../resources/img/方案优先.png'

const formItemLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 22}
};
const CapitalConfig = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [inspectyear, setInspectyear] = useState([])
    const [capitalValue, setCapitalValue] = useState(1)
    const [configType, setConfigType] = useState(1)
    const [dataList, setDataList] = useState([])
    const [detailVisible, setDetailVisible] = useState(false)
    const [detailData, setDetailData] = useState(null)
    const [inspectionYear, setInspectionYear] = useState(new Date().getFullYear())
    const [manageUnitId, setManageUnitId] = useState(null)

    const fetchInspectYear = () => {
        AidDecisionMakingClient.getQuantitiesYearList().then(res => {
            if (res.length > 0) {
                form.setFieldsValue({"inspectionYear": res[0]})
                setInspectyear(res)
            }
        },res => {
            if (res.length > 0) {
                form.setFieldsValue({"inspectionYear": res[0]})
                setInspectyear(res)
            }
        }).finally(()=>{
            setInspectionYear(form.getFieldValue("inspectionYear"))
        })
    }

    useEffect(() => {
        fetchInspectYear()
    }, [])

    const onSliderInputChange = (value) => {
        setCapitalValue(value)
    }

    const postConfigData = () => {
        setLoading(true)
        let inspectionYear = form.getFieldValue("inspectionYear")
        // setInspectyear(inspectionYear)
        let url = ''
        let params = {inspectionYear, limitPrice: capitalValue}
        if (configType == 1) {
            url = AidDecisionMakingClient.getProjectLimitBudgetByArea(params)
        } else {
            url = AidDecisionMakingClient.getProjectLimitBudgetByPlan(params)
        }
        url.then(res => {
            if (res.length == 0) {
                message.success("暂无数据")
            }
            setDataList(res)
            setLoading(false)
        })
    }

    const goBack = () => {
        setDetailVisible(false)
        setDetailData(null)
    }

    //渲染
    return (
        <Card title={"处治方案详情-资金配置"}>
            <div className="indicator-weight-config">
                {!detailVisible&&<div className={detailVisible ? 'hidden' : ''}>
                    <Form form={form}>
                        <Form.Item {...formItemLayout} name={"inspectionYear"} label={"检查数据年份"}>
                            {/*{getFieldDecorator("inspectionYear", { initialValue: new Date().getFullYear() })(*/}
                            <Select style={{width: 115}}>
                                {inspectyear.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={<div className="indicator-filter">设定资金：</div>}>

                            <Row>
                                <Col span={12}>
                                    <Slider
                                        min={1}
                                        max={500}
                                        onChange={onSliderInputChange}
                                        value={typeof capitalValue === 'number' ? capitalValue : 0}
                                    />
                                </Col>
                                <Col span={4}>
                                    <InputNumber
                                        min={1}
                                        max={500}
                                        style={{margin: '0 16px'}}
                                        value={capitalValue}
                                        onChange={onSliderInputChange}
                                    />
                                    万
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={<div className="indicator-filter">优化原则：</div>}>
                            <div className={"capital-config-type" + (configType == 1 ? " active" : "")} onClick={() => {
                                setConfigType(1)
                                setDataList([])
                            }}>
                                <div><img src={AreaIcon}/></div>
                                <div>
                                    <div className="tit">段区优先</div>
                                    <div className="desc">一个段区为一个工程包，将各处治方案按费用从高到低的顺序放进包内，取与设定资金最接近的方案组合，作为一个工程包结果。
                                    </div>
                                </div>
                            </div>
                            <div className={"capital-config-type" + (configType == 2 ? " active" : "")} onClick={() => {
                                setConfigType(2)
                                setDataList([])
                            }}>
                                <div><img src={CaseIcon}/></div>
                                <div>
                                    <div className="tit">方案优先</div>
                                    <div className="desc">包含封缝、灌缝、混凝土修补、钢筋除锈阻锈、支座更换、伸缩缝更换、维修。</div>
                                </div>
                            </div>
                        </Form.Item>
                        <Row>
                            <Col offset={20}>
                                <Button type="primary" loading={loading} onClick={() => {
                                    postConfigData()
                                }}>运行计算</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>}
                {!detailVisible && dataList.map((item, index) => <div className="project-road-config-item" key={index}
                                                                      onClick={() => {
                                                                          if(configType==1) {
                                                                              item.name = item.areas
                                                                          }else {
                                                                              item.name = item.planNames
                                                                          }
                                                                          setDetailVisible(true)
                                                                          setDetailData(item)
                                                                      }}>
                    <div className="project-name">{configType==1?item.areas:item.planNames}{index == 0 &&
                    <span className="best-tag">最佳方案</span>}</div>
                    <div className="prci-body">
                        <div className="prci-left">
                            <div className="row">
                                <div className="label">包含路线：</div>
                                <div className="value">{item.roads}</div>
                            </div>
                            {configType == 2 && <div className="row">
                                <div className="label">包含路段：</div>
                                <div className="value">{item.areas}</div>
                            </div>}
                            {configType != 2 && <div className="row">
                                <div className="label">处治内容：</div>
                                <div className="value">{item.planNames.split("、").map((item, index) => <div
                                    className="tag" key={index}>{item}</div>)}</div>
                            </div>}
                        </div>
                        <div className="prci-price">
                            <span className="unit">¥</span><span className="cost-amount">{item.price}</span>
                        </div>
                    </div>
                </div>)}

                {detailVisible &&
                <OptimizeConfigDetail goBack={goBack} detailData={detailData} capitalConfig={configType}
                                      inspectionYear={form.getFieldValue("inspectionYear")}/>}
            </div>
        </Card>
    );
};

export default CapitalConfig;