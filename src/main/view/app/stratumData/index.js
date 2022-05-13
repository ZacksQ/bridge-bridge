import React, { useEffect, useState } from "react";
import { Tabs, Button, Input, Row, Col, message, Spin, Modal } from "antd";
import Card from "../../component/card/Card";
import Stratum from "./Stratum";
import HoleSite from "./HoleSite";
import { API_PREFIX } from '../../../config'
import { InboxOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import DraggableModal from "../../component/modal/DraggableModal";
import Dragger from "antd/es/upload/Dragger";
import StratumClient from "../../../client/stakeLength/StratumClient";
const { TabPane } = Tabs
let ctrlBtn = null
const StratumData = () => {
    const [activeKey, setActiveKey] = useState("1")
    const [fileName, setFileName] = useState("")
    const [uploadloading, setUploadLoading] = useState(false)
    const[uploadModalVisible, setUploadModalVisible] = useState(false)
    const tab1 = React.useRef()
    const tab2 = React.useRef()

    const showCurBtn = activeKey => {
        let extraContent = null
        switch (activeKey) {
            case "1":
                extraContent = <>
                    {/* <Button size="small" icon={< UploadOutlined />} style={{ marginRight: 10 }} type="primary" onClick={() => { tab1.current.setUploadModalVisible(true) }}>上传</Button> */}
                    <Button size="small" icon={< PlusOutlined />} type="primary" onClick={() => { tab1.current.setStratumForm(true) }}>新建</Button></>
                break
            // case "2":
            //     extraContent = <><Button size="small" icon={< UploadOutlined />} style={{ marginRight: 10 }} type="primary" onClick={() => { tab2.current.setUploadHoleModalVisible(true) }}>上传钻孔桩号</Button>
            //         <Button size="small" icon={< UploadOutlined />} type="primary" onClick={() => {
            //             tab2.current.setUploadSingleSiteModalVisible(true)
            //             tab2.current.setDrillId('')
            //         }}>上传单孔信息</Button></>
            //     break
        }
        return extraContent
    }

    useEffect(() => {
        getMdbFileName()
    }, [])

    const fileOnChange = (info) => {
        const { status } = info.file;
        if (status == 'uploading') {
            setUploadLoading(true)
        }
        if (status === 'done') {
            if (info.file.response.code === 0) {
                message.success(`${info.file.name} 数据已成功上传.`);
                setFileName(info.file.response.data)
                setUploadModalVisible(false)
                //刷新表格数据
                // if(activeKey=="1"){
                tab1.current.fetchStratumData()
                if (activeKey == "2") {
                    tab2.current.fetchHoleData()
                    tab2.current.setDrillData({})
                }
                if (info.file.response.resultNote != "") {
                    Modal.info({
                        title: '提示',
                        content: info.file.response.resultNote
                    })
                }
            } else {
                message.error(`${info.file.name} 上传失败.${info.file.response.resultNote}`)
            }
            setUploadLoading(false)
        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            setUploadLoading(false)
        }
    }

    const getMdbFileName = () => {
        return StratumClient.getMdbFileName().then(res => {
            if (res.code === 0) {
                setFileName(res.data)
            } else {
                message.error(res.resultNote)
            }
        })
    }

    return (<div style={{ backgroundColor: '#eff2f5' }}>
        <Card style={{ marginBottom: 20 }} className="upload-card">
            <Row gutter={20}>
                <Col span={20}>
                    <Input placeholder="上传地层信息文件" value={fileName} disabled />
                </Col>
                <Col span={4} className="tt">
                    {/* <Upload action={API_PREFIX + '/pile-len/calc/mdb/upload'}
                        accept=".mdb"
                        // fileList={[]}
                        progress={{
                            strokeWidth: 1,
                            trailColor: "#fff",
                            format: function () { return '' }
                        }}
                        maxCount={1}
                        onChange={fileOnChange}> */}
                        <Button type="primary" style={{ width: '100%' }} onClick={()=>{
                            setUploadModalVisible(true)
                        }}
                        // loading={uploadloading}
                        >上传</Button>
                    {/* </Upload> */}
                </Col>
            </Row>
        </Card>
        <Card style={{ paddingTop: 0, margin: 0 }}>
            <Tabs activeKey={activeKey} onChange={activeKey => {
                setActiveKey(activeKey)
            }} tabBarExtraContent={showCurBtn(activeKey)}>
                <TabPane tab="地层信息" key={"1"}>
                    <Stratum onRef={tab1} />
                </TabPane>
                <TabPane tab="钻孔信息" key={"2"}>
                    <HoleSite onRef={tab2} />
                </TabPane>
            </Tabs>
        </Card>
        
        <DraggableModal
            visible={uploadModalVisible}
            title={"地层信息文件上传"}
            className="tt"
            width={650}
            // onOk={form.submit}
            onCancel={() => { setUploadModalVisible(false) }}>
            <Dragger action={API_PREFIX + '/pile-len/calc/mdb/upload'}
                        accept=".mdb"
                        // fileList={[]}
                        progress={{
                            strokeWidth: 1,
                            trailColor: "#fff",
                            format: function () { return '' }
                        }}
                        maxCount={1}
                        onChange={fileOnChange}>
                <Spin spinning={uploadloading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖动到此处上传</p>
                </Spin>
            </Dragger>
        </DraggableModal>
    </div>
    );
};

export default StratumData;