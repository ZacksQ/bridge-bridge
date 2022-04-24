import React, { useState, useEffect } from "react";
import { Tabs, } from "antd";
import Opt from './opt'
import Opt1 from './opt1'
import './index.css'
const { TabPane } = Tabs;

function Technical({ dataFn, bridgetypelist }) {
    const [tebnam, setTebnam] = useState('04')
    const [name, setName] = useState(null)


    useEffect(() => {
        structureFn()
    }, []);
    const structureFn = () => {
    }
    // 更改单幅双幅
    // 点击tabs
    const tabsfn = (key) => {
        setTebnam(key)
    }
    // 点击的图标触发的自定义方法
    const tbFn = (key) => {
        setName(key)
    }
    return (
        <div className="chart-wrap">
            <div className="box situ-block ">
                <Tabs className='tabs' defaultActiveKey="1" onChange={tabsfn}>
                    <TabPane tab="04规范评定" key="04">
                    </TabPane>
                    <TabPane tab="11标准评定" key="11">
                    </TabPane>
                </Tabs>
                <Opt1
                    dataFn={dataFn}
                    tebnam={tebnam}
                    name={name}
                    tbFn={tbFn}
                    bridgetypelist={bridgetypelist}
                >
                </Opt1>
            </div>
            <div className="situ-block f15"  >
                <div className="tltie">
                    部件评定
                </div>
                <Opt
                    dataFn={dataFn}
                    tebnam={tebnam}
                    name={name}
                    tbFn={tbFn}
                >
                </Opt>
            </div>
            <div>
            </div>
        </div>)
}
export default Technical