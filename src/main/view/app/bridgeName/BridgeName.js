import React, { useEffect, useState } from "react";
import { Button, Row, Col, message, Input, Spin, Form, Checkbox, Select, Tooltip, Tabs } from "antd";
import { DeleteOutlined, InboxOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import DraggableModal from "../../component/modal/DraggableModal";
import Card from '../../component/card/Card'
import BridgeGroupClient from "../../../client/bridgeGroup/BridgeGroupClient";
import BridgeBase from "./BridgeBase";
import BridgeResult from "./BridgeResult";
import CalcTable from "./CalcTable";
import DeleteButton from "../../component/button/DeleteButton";
import { SERVER_URL } from "../../../config";

let clickCount = 0
const BridgeName = () => {
    const [form] = Form.useForm()
    const [checkGroupForm] = Form.useForm()
    const [bridgeGroupData, setBridgeGroupData] = useState([])
    const [addModalVisible, setAddModalVisible] = useState({ vidible: false, data: null })
    const [loading, setLoading] = useState(false)
    const [selectedBridgeId, setSelectBridgeId] = useState(null)
    const [activeKey, setActiveKey] = useState("1")
    const [resultTable, setResultTable] = useState({})
    const [recordData, setRecordData] = useState({})
    const [basicList, setbasicList] = useState([])
    const [calcDataLoading, setCalcDataLoading] = useState(false)
    const [summaryId, setSummaryId] = useState(0)
    const [pierNoList, setPierNoList] = useState([])
    let t1 = React.createRef()
    let t2 = React.createRef()
    //获取用户数据
    const fetchBridgeGroup = () => {
        setLoading(true);
        BridgeGroupClient.getBridgeGroupList()
            .then(res => {
                if (res.code === 0) {
                    setBridgeGroupData(res.data)
                    if (res.data.length > 0 && selectedBridgeId === null) {
                        setSelectBridgeId(res.data[0].groupId)
                    }
                } else {
                    message.error(res.resultNote)
                }
            })
            .finally(() => setLoading(false))
    }
    //初始化
    useEffect(() => {
        fetchBridgeGroup()
    }, []);

    useEffect(() => {
        form.resetFields()
        if (addModalVisible.visible === true && addModalVisible.data) {
            form.setFieldsValue(addModalVisible.data)
        }
    }, [addModalVisible.visible])

    const submitForm = () => {
        form.validateFields().then(values => {
            if (addModalVisible.data) {
                BridgeGroupClient.changeGroupName({groupId: addModalVisible.data.groupId, groupName: values.groupName}).then(res=>{
                    if (res.code === 0) {
                        fetchBridgeGroup()
                    } else {
                        message.error(res.resultNote)
                    }
                })
            } else {
                BridgeGroupClient.saveBridgeGroup(values.groupName).then(res => {
                    if (res.code === 0) {
                        fetchBridgeGroup()
                    } else {
                        message.error(res.resultNote)
                    }
                })
            }
        }).finally(() => {
            setAddModalVisible({ visible: false, data: null })
        })
    }


    const delBridgeGroup = () => {
        checkGroupForm.validateFields().then(values => {
            let idList = values["group-list"]
            if (idList && idList.length > 0) {
                BridgeGroupClient.delBridgeGroup({ idList }).then(res => {
                    if (res.code === 0) {
                        fetchBridgeGroup()
                        if (idList.indexOf(selectedBridgeId) > -1) {
                            setSelectBridgeId(null)
                        }
                    } else {
                        message.error(res.resultNote)
                    }
                })
            } else {
                message.error("未勾选桥梁分组")
            }
        })
    }

    const showResult = record => {
        // fetchBridgeResultTable(record)
        setActiveKey("3")

        // setRecordData(record)
        fetchBridgeResultTable(record)
        setRecordData({
            pierNo: `${record.pierNo}`, id: record.id
        })
    }

    const fetchBridgeResultTable = record => {

        setCalcDataLoading(true)
        let postParams = {
            groupId: selectedBridgeId,
            pierNo: record.pierNo,
            summaryId: record.id
        }
        setSummaryId(record.id)
        setRecordData({
            pierNo: `${record.pierNo}`, id: record.id
        })
        return BridgeGroupClient.calcTableData(postParams).then(res => {
            if (res.code === 0 && Array.isArray(res.data) && res.data.length > 0) {

                setResultTable(res.data[0])

                // setRecordData({...recordData, id: record.id}) //死循环了 
            } else {
                message.error(res.resultNote)
            }
        }).finally(() => setCalcDataLoading(false))
    }

    // useEffect(() => {
    // console.log(recordData)
    // if (recordData.id) {
    //     fetchBridgeResultTable(recordData)
    // }
    // }, [recordData])

    useEffect(() => {
        if (selectedBridgeId)
            fetchBridgePierNoList(selectedBridgeId)
    }, [selectedBridgeId])

    const getBaseList = data => {
        setbasicList(data)
    }

    const refresh = () => {
        fetchBridgePierNoList(selectedBridgeId)
    }

    const fetchBridgePierNoList = groupId => {
        return BridgeGroupClient.getBridgePierNoList(groupId).then(res => {
            if (res.code === 0) {

                if (res.data.length > 0) {
                    fetchBridgeResultTable({
                        pierNo: `${res.data[0].pierNo}`, id: res.data[0].summaryId
                    })
                    setRecordData({
                        pierNo: `${res.data[0].pierNo}`, id: res.data[0].summaryId
                    })
                }
                //     reloadData({ ...recordData, pierNo: `${res.data[0].pierNo}`, id: res.data[0].summaryId })

                setPierNoList(res.data)
            } else {
                message.error(res.resultNote)
            }
        })
    }

    return (<div style={{ minHeight: 'calc(100vh - 140px)', backgroundColor: '#F0F2F5' }}>
        <Row gutter={20} >
            <Col span={5}>
                <div className="shaowbox-wrap">
                    <Card
                        loading={loading}
                        title="桥梁名称"
                    // extra={<Button size="small" icon={<PlusOutlined />} type="primary" onClick={() => { setAddModalVisible(true) }}>新建</Button>}
                    >
                        <div className="hole-list-wrap">

                            <Form form={checkGroupForm} >
                                <Form.Item name="group-list">
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        {bridgeGroupData.map((d, index) => <div key={index}><Checkbox value={d.groupId} style={{ marginRight: 10 }} onChange={e => {

                                            e.preventDefault()
                                        }}>
                                        </Checkbox><div className={"list-item" + (d.groupId === selectedBridgeId ? " selected" : "")} onClick={e => {

                                            clickCount++
                                            setTimeout(() => {
                                                if (clickCount === 1) {
                                                    setSelectBridgeId(d.groupId)
                                                    setActiveKey("1")
                                                    setRecordData({})
                                                    setResultTable({})
                                                    setSummaryId(0)
                                                }
                                                else if (clickCount === 2) {
                                                    setAddModalVisible({ visible: true, data: d })
                                                }
                                                clickCount = 0
                                            }, 300)

                                            // setPierNoList([])

                                        }}
                                        // onDoubleClick={e=>{
                                        //     e.preventDefault()
                                        //     e.stopPropagation()
                                        //     console.log("dobleClick")
                                        // }}
                                        >
                                                {d.groupName}
                                            </div></div>)}

                                    </Checkbox.Group>
                                </Form.Item>
                            </Form>
                        </div>
                        {/* <div className="footer-action"> */}
                        <Row style={{ marginTop: 20 }}>
                            <Col span={12}
                                style={{ textAlign: 'center' }}
                            ><Button size="small" icon={<PlusOutlined />} type="primary" onClick={() => { setAddModalVisible({ visible: true }) }}>新建</Button></Col>
                            <Col span={12} style={{ textAlign: 'center' }}> <DeleteButton type="ghost" danger icon={<DeleteOutlined />} onConfirm={() => {
                                delBridgeGroup()
                            }}>删除</DeleteButton></Col>
                        </Row>


                        {/* </div> */}
                    </Card>
                </div>
            </Col>
            <Col span={19} style={{ backgroundColor: '#fff' }}>

                {selectedBridgeId && <div className="shaowbox-wrap">
                    <Tabs activeKey={activeKey} className="b-n" onChange={activeKey => {
                        // if (activeKey != 3)
                        setActiveKey(activeKey)
                    }
                    }
                        tabBarExtraContent={
                            activeKey == 1 ? <Button type="primary" icon={<SaveOutlined />} size={"small"} ghost onClick={() => { t1.current.saveData() }}>保存 / 计算</Button> : (activeKey == 2 ? <Button type="primary" size={"small"} ghost icon={<PlusOutlined />} onClick={() => { t2.current.setEditModal({ visible: true, data: {} }) }}>新建</Button> : <Tooltip placement="bottomRight" title="此为桩长excel计算模板，为各单元格公式关系示意，数据并非某特定孔" color={"#fff"} overlayInnerStyle={{ color: '#595959' }}>
                                <Button type="primary" size={"small"} onClick={() => {
                                    window.open(`${SERVER_URL}/pile-len/calc/result/template`)
                                }}>计算模板下载</Button>
                            </Tooltip>)
                        }>
                        <Tabs.TabPane tab="信息填入" key="1" >
                            <BridgeBase selectedBridgeId={selectedBridgeId} onRef={t1} refresh={refresh} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="结果输出" key="2">
                            <BridgeResult selectedBridgeId={selectedBridgeId} showResult={showResult} getBaseList={getBaseList} activeKey={activeKey} onRef={t2} pierNoList={pierNoList} fetchBridgePierNoList={fetchBridgePierNoList} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="结果明细" key="3">
                            <Spin spinning={calcDataLoading}>
                                <CalcTable selectedBridgeId={selectedBridgeId} data={resultTable} recordData={recordData} reloadData={fetchBridgeResultTable} basicList={basicList} summaryId={summaryId} pierNoList={pierNoList} />
                            </Spin>
                        </Tabs.TabPane>
                    </Tabs>
                </div>}

            </Col>
        </Row>
        <DraggableModal
            visible={addModalVisible.visible}
            title={"桥梁名称编辑"}
            width={650}
            onOk={form.submit}
            onCancel={() => { setAddModalVisible({ visible: false, data: null }) }}>
            <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
                // initialValues={initialData}
                onFinish={submitForm}>
                <Form.Item label="桥梁分组名称" name="groupName" rules={[{ required: true, message: "桥梁分组名称不能为空" }]}>
                    <Input style={{ width: "100%" }} placeholder="输入桥梁分组名称" />
                </Form.Item>
            </Form>
        </DraggableModal>
    </div>
    );
};

export default BridgeName;