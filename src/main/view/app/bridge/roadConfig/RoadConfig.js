import React, {Fragment, useEffect, useState} from "react";
import {Tabs, Divider, Form, Row, Col, Popconfirm, message, Select, Button, Spin, Checkbox, Card} from "antd";
import AidDecisionMakingClient from "../../../../client/bridge/AidDecisionMakingClient";
import DiffOutlined from "@ant-design/icons/lib/icons/DiffOutlined";
import RoadNameForm from "./RoadNameForm";
import RoadStakeItem from "./RoadStakeItem";
import OptimizeConfigDetail from "./OptimizeConfigDetail";


const formItemLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 22}
};
const RoadConfig = () => {
    const [form] = Form.useForm()
    const [disabled, setDisabled] = useState(false)
    const [projectList, setProjectList] = useState({current: 1, pageSize: 10000, searchData: {}, data: []})

    const [loading, setLoading] = useState(false)
    const [yearList, setYearList] = useState([])
    const [roadList, setRoadList] = useState([])
    const [areaList, setAreaList] = useState([])
    const [planList, setPlanList] = useState([])
    const [inspectionYear, setInspectionYear] = useState('')
    const [roadConfigFormVisible, setRoadConfigFormVisible] = useState(false)
    const [roads, setRoads] = useState([])
    const [price, setPrice] = useState('')
    const [detailVisible, setDetailVisible] = useState(false)
    const [detailData, setDetailData] = useState({})
    const [edit, setEdit] = useState(false)
    const [selectedAreas, setSelectedAreas] = useState([])
    const [selectedPlans, setSelectedPlans] = useState([])
    const [roadNameFormVisible, setRoadNameFormVisible] = useState(false)
    const [changeForm, setChangeForm] = useState(false)
    const [canSave, setCanSave] = useState(true)

    const getTreatProjectList = () => {
        setLoading(true)
        AidDecisionMakingClient.getTreatProjectList(projectList).then(res => {
            setProjectList(res)
            setLoading(false)
        })
    }
    const getConfigItems = () => {
        setLoading(true)
        AidDecisionMakingClient.getTreatProjectVo().then(res => {
            const {yearList, roadList, areaList, planList} = res
            if (yearList.length > 0) {
                setSelectedPlans(planList.map(item => item.id).toString())
            }

            setYearList(yearList)
            setRoadList(roadList)
            setAreaList(areaList)
            setPlanList(planList)
            setLoading(false)
        })
    }

    const handleEdit = (disabled) => {
        setDisabled(disabled)
    }

    const factoryData = () => {
        let roadStacks = document.querySelectorAll(".road-stake-item.active")
        let roads = []
        roadStacks.forEach(item => {
            let roadNo = item.getElementsByClassName("roadNo")[0].textContent
            let startStack = item.getElementsByTagName("input")[0].value
            let endStack = item.getElementsByTagName("input")[2].value
            let roadValue = roadNo
            if (startStack == "" && endStack != "") {
                message.error("初始桩号未填写")
                return false
            }
            if (startStack) {
                roadValue += ("_" + startStack)
            }
            if (endStack) {
                roadValue += ("_" + endStack)
            }
            roads.push(roadValue)
        })

        let data = form.getFieldsValue()
        if (inspectionYear) {
            data.inspectionYear = inspectionYear
        }
        data.roads = roads
        // console.log(data.plans)
        // if (selectedAreas) {
        //     data.areas = selectedAreas.toString()
        // } else {
            data.areas = data.areas ? data.areas.toString() : null
        // }
        // if (selectedPlans) {
        //     data.plans = selectedPlans.toString()
        // } else {
            data.plans = data.plans ? data.plans.toString() : null
        // }
        if (data.roads) {
            data.roads = data.roads ? data.roads.toString() : null
        }
        return data
    }

    const saveData = (calc, data) => {
        if (!calc) {
            form.validateFields().then(() => {
                setLoading(true)
                let postData = factoryData()
                if (data.name) {
                    postData.name = data.name
                }

                if (detailData.id) {
                    AidDecisionMakingClient.updateTreatProject({...postData, id: detailData.id}).then(res => {
                        getTreatProjectList()
                        setRoadConfigFormVisible(false)
                        setDetailData(null)
                        setRoadNameFormVisible(false)
                    }, res => {
                        // message.error(res.message)
                    }).finally(() => {
                        setLoading(false)
                    })
                } else {
                    AidDecisionMakingClient.insertTreatProject(postData).then(res => {
                        getTreatProjectList()
                        setRoadConfigFormVisible(false)
                        setRoadNameFormVisible(false)

                    }, res => {
                        // message.error(res.message)
                    }).finally(() => {
                        setLoading(false)
                    })
                }

            })
        } else {
            setLoading(true)
            let postData = factoryData()
            AidDecisionMakingClient.getTreatProjectPrice(postData).then(res => {
                if(res<0) {
                    res = 0
                    setCanSave(false)
                    message.error("处治内容不能为空")
                }else{
                    setCanSave(true)
                }
                setPrice(res)
                // }
            }, res => {
                if(res<0) {
                    res = 0
                    setCanSave(false)
                    message.error("处治内容不能为空")
                }else{
                    setCanSave(true)
                }
                setPrice(res)
                // message.error(res.message)
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    useEffect(() => {
        getConfigItems()
        getTreatProjectList()
    }, [])

    const goBack = () => {
        setDetailData({})
        setDetailVisible(false)
        setEdit(false)
        setPrice(0)
    }

    const deleteConfig = (id) => {
        AidDecisionMakingClient.deleteTreatProject(id).then(res => {
            // if (res.success) {
            // message.error(res.message)
            getTreatProjectList()
            // }
        }, res => {
            // message.error(res.message)
        })
    }

    const saveProject = () => {
        setRoadNameFormVisible(true)
    }

    const calcPrice = () => {
        saveData(true)
    }

    useEffect(() => {
        if (changeForm == true) {
            calcPrice()
            setChangeForm(false)
        }
    }, [changeForm])


    //渲染
    return (
        <Spin spinning={loading}>
            <Card title={"处治方案详情-路段配置"}>
                <div className="r-c-config-container">
                    {roadNameFormVisible && <RoadNameForm
                        title={"工程包名"}
                        initialValue={detailData}
                        onSave={saveData}
                        onCancel={() => {
                            setRoadNameFormVisible(false)
                        }}
                        visible={roadNameFormVisible}
                    />}
                    {!detailVisible && !roadConfigFormVisible && <div className="add-project-btn" onClick={e => {
                        form.setFieldsValue({"inspectionYear": (yearList.length > 0 ? yearList[0] : '')})
                        form.setFieldsValue({plans: planList.map(item => item.id)})
                        form.setFieldsValue({areas: []})
                        setRoadConfigFormVisible(true)
                    }}>
                        <DiffOutlined/> 添加工程包
                    </div>}
                    {roadConfigFormVisible && <div className="road-config-form">
                        <Form initialValues={detailData} form={form}>
                            <Form.Item name={"inspectionYear"} {...formItemLayout} label={"检查数据年份"}>

                                <Select style={{width: 115}} onChange={e => {
                                    setInspectionYear(e)
                                    setChangeForm(true)
                                }}>
                                    {yearList.map(item => <Select.Option value={item}
                                                                         key={item}>{item}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={"路线桩号"}>
                                <Row>
                                    {roadList.map(item => <RoadStakeItem calcPrice={calcPrice} value={item} key={item}
                                                                         initialValue={detailData && detailData.roads ? detailData.roads : ''}/>)}
                                </Row>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={"段区"} name={"areas"}>
                                <Checkbox.Group style={{width: '100%'}} onChange={(e) => {
                                    setSelectedAreas(e)
                                    setChangeForm(true)
                                }}>
                                    <Row>
                                        {areaList.map(item => <Col span={4} key={item}><Checkbox
                                            value={item}>{item}</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={"处治内容"} name={"plans"}>
                                <Checkbox.Group style={{width: '100%'}} onChange={(e) => {
                                    setSelectedPlans(e)
                                    setChangeForm(true)
                                }}>
                                    <Row>
                                        {planList.map(item => <Col span={4} key={item.id}><Checkbox
                                            value={item.id}>{item.name}</Checkbox></Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>

                            <Form.Item>
                                <Row>
                                    <Col span={5} offset={1} className="cost-amount-wrap">
                                        预估费用：<span className="unit">¥</span><span
                                        className="cost-amount">{(price == '' ? 0 : price)}</span>
                                    </Col>
                                    <Col span={2} offset={13}><Button style={{width: '100%'}} onClick={() => {
                                        handleEdit(false);
                                        setRoadConfigFormVisible(false)
                                        setDetailData({})
                                        setPrice(0)
                                        setRoads([])
                                        setSelectedAreas([])
                                        setSelectedPlans([])
                                        setCanSave(true)
                                    }}>取消</Button></Col>
                                    <Col offset={1} span={2}> <Button type="primary" style={{width: '100%'}}
                                                                      disabled={!canSave}
                                                                      onClick={() => {
                                                                          saveProject()
                                                                      }}>保存</Button></Col>
                                </Row>
                            </Form.Item>
                        </Form>

                    </div>}
                    {!detailVisible && !roadConfigFormVisible && projectList.data.map(item => <div
                        className="project-road-config-item" key={item.id} onClick={e => {
                        setDetailVisible(true)
                        setDetailData(item)
                    }}>
                        <div className="project-name">{item.name}
                            <span
                                className="last-modify-time">最后一次保存时间：{item.createTime.toString().substring(0, item.createTime.toString().lastIndexOf(":"))}</span>
                            <div style={{float: 'right'}} onClick={e => {
                                e.stopPropagation()
                            }}>
                                <Button type="link" size="small" onClick={() => {
                                    let objData = {}
                                    Object.assign(objData, item)
                                    if (objData.plans.indexOf(",") > -1) {
                                        objData.plans = objData.plans.split(",")
                                    }else if(objData.plans){
                                        objData.plans = [objData.plans]
                                    }
                                    if (objData.areas.indexOf(",") > -1) {
                                        objData.areas = objData.areas.split(",")
                                    }else if(objData.areas){
                                        objData.areas = [objData.areas]
                                    }
                                    if (objData.roadsAll == 1) {
                                        objData.roads = ""
                                    }
                                    handleEdit(true)
                                    setRoadConfigFormVisible(true)
                                    setDetailData(objData)
                                    form.setFieldsValue(objData)
                                    console.log(objData)
                                    setPrice(objData.allprice)
                                    setSelectedPlans(objData.plans)
                                    setRoads(objData.roads.split(","))
                                    setSelectedAreas(objData.areas)
                                }}>
                                    编辑
                                </Button>
                                <Divider type="vertical"/>
                                <Popconfirm title="确定删除" onConfirm={e => {
                                    deleteConfig(item.id)
                                }}>
                                    <Button type="link" size="small">
                                        删除
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                        <div className="prci-body">
                            <div className="prci-left">
                                <div className="row">
                                    <div className="label">包含路线：</div>
                                    <div className="value">{item.roadNames}</div>
                                </div>
                                <div className="row">
                                    <div className="label">处治内容：</div>
                                    <div className="value">{item.planNames.split("、").map((item, index) => <div
                                        className="tag" key={index}>{item}</div>)}</div>
                                </div>
                            </div>
                            <div className="prci-middle">
                                <div className="row">
                                    <div className="label">包含路段：</div>
                                    <div className="value">{item.areas}</div>
                                </div>
                                <div className="row">
                                    <div className="label">检查数据年份：</div>
                                    <div className="value">{item.inspectionYear}</div>
                                </div>
                            </div>
                            <div className="prci-price">
                                <span className="unit">¥</span><span className="cost-amount">{item.allprice}</span>
                            </div>
                        </div>
                    </div>)}
                    {detailVisible && <OptimizeConfigDetail goBack={goBack} detailData={detailData}/>}
                </div>
            </Card>
        </Spin>
    );
};

export default RoadConfig;