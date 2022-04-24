import React, { useState, useEffect } from "react";
import { Button, Radio, Select, } from "antd";
import Opt from './opt'
import Opt1 from './opt1'
import './index.css'
import clientHome from './../../../../client/home/home'
// import G2 from '@antv/g2';
// import createG2 from 'g2-react';


//  const chart = new G2.Chart({
//     container: 'c1', // 指定图表容器 ID
//     width: 600, // 指定图表宽度
//     height: 300 // 指定图表高度
//   });
//   chart.source(this.state.data);
//   chart.interval().position('genre*sold').color('genre');

function Type({ dataFn }) {
    const [connt, setConnt] = useState(1)
    const [data, setData] = useState({})
    const [class1, setClass1] = useState(1)
    const [class2, setClass2] = useState(1)
    const [name, setName] = useState(null)


    useEffect(() => {
        structureFn()
    }, [class1, class2]);
    const structureFn = () => {
        clientHome.structure(class1 + '/' + class2).then(setData)
    }
    const class1Fn = (data) => {
        setClass1(data)
    }
    const class2Fn = (data) => {
        setClass2(data)
    }
    // 点击的图标触发的自定义方法
    const tbFn = (key) => {
        setName(key)
    }
    // 更改单幅双幅
    return (
        <div className="chart-wrap">
            <div className="situ-block" >
                <Opt
                    dataFn={dataFn}
                    class1Fn={class1Fn}
                    class2Fn={class2Fn}
                    dataList={data}
                    connt={connt}
                    name={name}
                    tbFn={tbFn}
                >
                </Opt>
            </div>
            <div className="situ-block" >
                <Opt1
                    dataFn={dataFn}
                    dataList={data}
                    name={name}
                    tbFn={tbFn}
                >
                </Opt1>
            </div>
            <div>
            </div>
        </div>)
}
export default Type