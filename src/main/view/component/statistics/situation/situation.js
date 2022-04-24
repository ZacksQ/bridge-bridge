import React, { useState, useEffect } from "react";
import { Radio, Select, Tooltip } from "antd";
import './index.css'
import Opt from './opt'
import Opt1 from './opt1'
import clientHome from './../../../../client/home/home'
import Opt2 from './opt2'
import bridgeImg from '../images/桥梁座数-选中.png'
import bridgeImg1 from '../images/桥梁座数-未选中.png'
import ReaustMap from '../../../../client/map/requstMap'
const { Option } = Select;

let is = ''

function Situation({ dataFn, bridgetypelist,superstructureTypesAllFn1}) {
  // 请求接口的字符串
  const [dataSty, setDataSty] = useState('')
  // 所有数据
  const [dataMap, setDataMap] = useState(null)
  // 过滤后数据
  const [dataMapList, setDataMapList] = useState(null)
  // 结构类型数组
  const [constypelist, setConstypelist] = useState([])
  // 功能类型数组
  const [dictionarieslist, setDictionarieslist] = useState([])
  // 结构类型id
  const [constypelistId, setConstypelistId] = useState(undefined)
  // 功能类型id
  const [dictionariesId, setDictionariesId] = useState(undefined)
  // 规模类型id
  const [bridgetypelistId, setBridgetypelistId] = useState(undefined)
  // 座数孔数延米数判断
  const [type, setType] = useState(1)
  // 桥幅的判断变量
  const [size, setSize] = useState('large')
  // 颜色数组
  const [colorList, setColorList] = useState([
    { rgb: "rgba(80,227,194,", a: "1", t: ")" },
    { rgb: "rgba(255,191,64,", a: "1", t: ")" },
    { rgb: "rgba(140,198,98,", a: "1", t: ")" },
    { rgb: "rgba(149,124,185,", a: "1", t: ")" },
    { rgb: "rgba(236,92,81,", a: "1", t: ")" },
    { rgb: "rgba(0,146,134,", a: "1", t: ")" },
    { rgb: "rgba(255,127,80,", a: "1", t: ")" },
    { rgb: "rgba(173,255,47,", a: "1", t: ")" },
  ])
  const [m, setM] = useState('')
  const [k, setK] = useState('')
  const [z, setZ] = useState('')
  const [name, setName] = useState('上')

  useEffect(() => {

    if (dictionarieslist.length == 0) {
      dictionariesFn()
    }
    if (constypelist.length == 0) {
      superstructureTypesAllFn()
    }
    statisticTotalFn()
  }, [size, dataSty]);
  useEffect(() => {
    setDataMapListFn()
  }, [type, dataMap])
  useEffect(() => {
    let sty = ''
    // 结构类型id
    if (constypelistId) {
      sty += 'superstructureType=' + constypelistId + '&'
    }
    // 功能类型id?
    if (dictionariesId) {
      sty += 'functionType=' + dictionariesId + '&'
    }
    // 桥规模
    if (bridgetypelistId) {
      sty += 'bridgeScale=' + bridgetypelistId + '&'
    }
    setDataSty(sty)
  }, [constypelistId, dictionariesId, bridgetypelistId])
  // 更改单幅双幅
  //   判断type值更新数据

  // 获取上部结构
  const superstructureTypesAllFn = () => {
    clientHome.superstructureTypesAll().then((res)=>{
      setConstypelist(res)
      superstructureTypesAllFn1(res)
    })
    
  }
  // 获取功能列表
  const dictionariesFn = () => {
    clientHome.dictionaries().then(setDictionarieslist)
  }
  // 获取总体列表
  const statisticTotalFn = () => {
    clientHome.statisticTotal((size == 'large' ? 1 : 2) + "?" + dataSty).then(res => { setDataMap(res) })
  }
  const setDataMapListFn = () => {
    if (!dataMap) {
      return
    }
    setM(dataMap.bridgeLen.totalStatistic.number)
    setZ(dataMap.bridge.totalStatistic.number)
    setK(dataMap.site.totalStatistic.number)
    //   判断孔号 座数 延米数
    if (type == 1) {
      let arr = dataMap.bridge
      arr.totalStatistic.data.forEach((item, index) => {
        if(item.y == "G1521"){
          item.color = colorList[0]
          item.id = 0
        }
        if(item.y == "G1522"){
          item.color = colorList[1]
          item.id = 1
        }

      });
      setDataMapList(arr)
    } else if (type == 2) {
      let arr = dataMap.site
      arr.totalStatistic.data.forEach((item, index) => {
        item.color = colorList[index]
        item.id = index
      });
      setDataMapList(dataMap.site)
    } else {
      let arr = dataMap.bridgeLen
      arr.totalStatistic.data.forEach((item, index) => {
        item.color = colorList[index]
        item.id = index
      })
      setDataMapList(dataMap.bridgeLen)
    }
  }

  // 点击的图标触发的自定义方法
  const tbFn = (key,callback) => {
    setName(key)
    if(key != '上'){
      setConstypelistId(undefined)
      setBridgetypelistId(undefined)
      setDictionariesId(undefined)
      window.setTimeout(function (){
        callback()
      },1000);
    }
  }
  return (
    <div className="chart-wrap">
      <div className="box situ-block f15">
        <div className="tltie">
          总体情况
          <Radio.Group className='radio' value={size}
            // size="small"
            onChange={(e) => setSize(e.target.value)}>
            <Radio.Button value="large">全桥</Radio.Button>
            <Radio.Button value="default">桥幅</Radio.Button>
          </Radio.Group>
        </div>
        <div className="select-box2">

          <Select
            // size="small"
            showSearch
            // width={200}
            className='select'
            placeholder="结构类型"
            style={{ width: 120 }}
            value = {constypelistId}
            onChange={(value) => {
              setName('上')
              setConstypelistId(value)
            }}
            optionFilterProp="children"
            allowClear
          >
            {constypelist.map(item => (

              <Option key={item.id} value={item.superstructureTypeName}><Tooltip placement="top" title={item.superstructureTypeName}>{item.superstructureTypeName}</Tooltip></Option>

            ))}
          </Select>
          <Select
            className='select'
            // size="small"
            showSearch
            placeholder="功能类型"
            optionFilterProp="children"
            value = {dictionariesId}
            onChange={(value) => {
              setName('上')
              setDictionariesId(value)
            }}
            style={{ width: 120 }}
            allowClear
          >
            {dictionarieslist.map(item => (
              <Option key={item.id} value={item.dicValue}><Tooltip placement="top" title={item.dicValue}>{item.dicValue}</Tooltip></Option>
            ))}

          </Select>
          <Select
            // size="small"
            className='select'
            showSearch
            value = {bridgetypelistId}
            placeholder="规模类型"
            onChange={(value) => {
              setName('上')
              setBridgetypelistId(value)
            }}
            style={{ width: 120 }}
            optionFilterProp="children"
            allowClear
          >
            {bridgetypelist.map(item => (
              <Option key={item.id} value={item.name}><Tooltip placement="top" title={item.name}>{item.name}</Tooltip></Option>
            ))}
          </Select>
        </div>
        <div className='box-icon'>
          <div className={type == 1 ? 'active' : ''} onClick={() => { setType(1) }}>
            <span className='span1'>{size === "large" ? '桥梁' : '桥幅'}座数</span>
            <span className='span2'>{z}座</span>
            {/* <Icon type="bar-chart" className='icon' /> */}
            {type == 1 ? <img src={bridgeImg}></img> :
              <img src={bridgeImg1}></img>}
          </div>
          <div className={type == 2 ? 'active' : ''} onClick={() => { setType(2) }}>
            <span className='span1'>{size === "large" ? '桥梁' : '桥幅'}孔数</span>
            <span className='span2'>{k}孔</span>
            {type == 2 ? <img src={bridgeImg}></img> :
              <img src={bridgeImg1}></img>}
          </div>
          <div className={type == 3 ? 'active' : ''} onClick={() => { setType(3) }} >
            <span className='span1'>{size === "large" ? '桥梁' : '桥幅'}延米数</span>
            <span className='span2'>{m}m</span>
            {type == 3 ? <img src={bridgeImg}></img> :
              <img src={bridgeImg1}></img>}
          </div>
        </div>
        <Opt
          tbFn={tbFn}
          name={name}
          dataFn={dataFn}
          bridgetypelist={bridgetypelist}
          type={type}
          datalist={dataMapList}
          dataSty={dataSty}
          constypelistId={constypelistId}
          dictionariesId={dictionariesId}
        >
        </Opt>
      </div>
      <div className="box situ-block">
        <div className="tltie">
          功能类型
                </div>
        <Opt1
          tbFn={tbFn}
          name={name}
          dataFn={dataFn}
          datalist={dataMapList}
          constypelistId={constypelistId}
          dictionariesId={dictionariesId}
        >
        </Opt1>
      </div>
      <div className="situ-block" >
        <div className="tltie">
          规模类型
                </div>
        <Opt2
          tbFn={tbFn}
          name={name}
          dataFn={dataFn}
          datalist={dataMapList}
          constypelistId={constypelistId}
          dictionariesId={dictionariesId}
        >
        </Opt2>
      </div>
    </div>)
}
export default Situation