import React, { useEffect, useState } from "react";
import { Tabs, Button } from "antd";
import Card from "../../component/card/Card";
import Stratum from "./Stratum";
import HoleSite from "./HoleSite";
import { InboxOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
const { TabPane } = Tabs
let ctrlBtn = null
const StratumData = () => {
    const [activeKey, setActiveKey] = useState("1")
    const tab1 = React.useRef()
    const tab2 = React.useRef()
    
    const showCurBtn = activeKey=>{
        let extraContent = null
        switch(activeKey){
            case "1":
                extraContent=<><Button size="small" icon={< UploadOutlined />} style={{marginRight: 10}} type="primary" onClick={() => { tab1.current.setUploadModalVisible(true) }}>上传</Button><Button size="small" icon={< PlusOutlined />} type="primary" onClick={() => { tab1.current.setStratumForm(true) }}>新建</Button></>
            break
            case "2":
                extraContent = <><Button size="small" icon={< UploadOutlined />} style={{ marginRight: 10 }} type="primary" onClick={() => { tab2.current.setUploadHoleModalVisible(true) }}>上传钻孔桩号</Button>
                <Button size="small" icon={< UploadOutlined />} type="primary" onClick={() => {
                    tab2.current.setUploadSingleSiteModalVisible(true)
                    tab2.current.setDrillId('')
                }}>上传单孔信息</Button></>
            break
        }
        return extraContent
    }

    return (<Card style={{paddingTop: 0}}>
        <Tabs activeKey={activeKey} onChange={activeKey => {
            setActiveKey(activeKey)
        }} tabBarExtraContent={showCurBtn(activeKey)}>
            <TabPane tab="地层信息" key={"1"}>
                <Stratum onRef={tab1}/>
            </TabPane>
            <TabPane tab="钻孔信息" key={"2"}>
                <HoleSite onRef={tab2} />
            </TabPane>
        </Tabs>
    </Card>
    );
};

export default StratumData;