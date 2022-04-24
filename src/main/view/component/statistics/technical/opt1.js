import React, { useState, useEffect } from "react";
import * as G2 from '@antv/g2'
import insertCss from 'insert-css';
import { Radio, Select,Tooltip as TooltipA  } from "antd";
import {
  // G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
  PathUtil
} from "bizcharts";
import img1 from '../images/全桥评定-环形图未选中.png'
import img2 from '../images/全桥评定-环形图选中.png'
import img3 from '../images/全桥评定-锥形图选中.png'
import img4 from '../images/选中.png'
import ReaustMap from '../../../../client/map/requstMap'

// 引入 ECharts 主模块
import * as echarts from 'echarts';

import clientHome from './../../../../client/home/home'
import './index.css'

const { Option } = Select;
insertCss(`
    .g2-guide-html {
        width: 100px;
        height: 80px;
        vertical-align: middle;
        text-align: center;
        line-height: 0.2;
    }

    .g2-guide-html .title {
        font-size: 12px;
        color: #8c8c8c;
        font-weight: 300;
    }

    .g2-guide-html .value {
        font-size: 32px;
        color: #000;
        font-weight: bold;
    }
`);
var myChart
let clickData = []
let clickDataarr = []
let chart
let chart1
let is = ''

function Opt1({ dataFn, bridgetypelist, tebnam,name,tbFn }) {
  const [COLORS, setCOLORS] = useState([
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8441",
    "#EE3B61",
    "#FF6590",
    "#9575DE",
    "#8EA4F1",
    "#C6E8D2",
    "#FFDB91",
    "#FF9054"
  ])
  const [data, setData] = useState([])
  const [department, setDepartment] = useState([

      ] // 柱状图变形
  )

  // 结构类型数组
  const [constypelist, setConstypelist] = useState([2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030])
  // 功能类型数组
  const [dictionarieslist, setDictionarieslist] = useState([])
  // 结构类型id
  var myDate = new Date();


  const [constypelistId, setConstypelistId] = useState(2021)
  // 功能类型id
  const [dictionariesId, setDictionariesId] = useState('')
  // 规模类型id
  const [bridgetypelistId, setBridgetypelistId] = useState('')
  // 全桥评定选择
  const [imgIs, setImgIs] = useState(1)
  // 部件评定
  const [size, setSize] = useState('1')

  // 获取上部结构
  // const superstructureTypesAllFn = () => {
  //   clientHome.superstructureTypesAll().then(setConstypelist)
  // }
  // 获取功能列表
  const dictionariesFn = () => {
    clientHome.dictionaries().then(setDictionarieslist)
  }
  const sidebciFn = () => {
    let sty = ''
    if (constypelistId) {
      sty += "inspectYear=" + constypelistId + '&'
    }
    if (dictionariesId) {
      sty += "functionTypeName=" + dictionariesId + '&'
    }
    if (bridgetypelistId) {
      sty += "bridgeScale=" + bridgetypelistId + '&'
    }
    if (tebnam == '04') {
      clientHome.sidebci(sty).then(res => {
        let arr = res.bridge.data
        arr.forEach(v => {
          v.genre = v.y
          v.sold = v.x
        });
        clickData = arr
        setData(arr)
        setDepartment(arr)
        if(imgIs==2){
          echartstfn()
        }
      })
    } else {
      clientHome.side11(size + '?' + sty).then(res => {
        let arr
        if(res.bridge){
          arr = res.bridge.data
        }
        if(res.superstructure){
          arr = res.superstructure.data
        }
        if(res.position){
          arr = res.position.data
        }

        arr.forEach(v => {
          v.genre = v.y
          v.sold = v.x
        });
        clickData = arr
        setData(arr)
        setDepartment(arr)
        if(imgIs==2){
          echartstfn()
        }
      })
    }
  }
  // useEffect(()=>{

  // },[data])
  useEffect(() => {
    if (dictionarieslist.length == 0) {
      dictionariesFn()
    }
    chartoptfn('opt10')
  }, [])
  useEffect(() => {
    if(name == '点击分类图表了'){
      chart.changeData(data);
      is = ''
    }
  }, [name]);
  useEffect(() => {
    sidebciFn()
  }, [constypelistId, dictionariesId, bridgetypelistId, tebnam, size])

  useEffect(() => {
    // chartoptfn('opt')
    if (chart) {
      is = ''
      let arr = []
      data.forEach(ietm=>{
        arr = [...arr ,...ietm.list ]
      })
      dataFn(arr)
      // ReaustMap.totalPonit().then(res => {
      //   dataFn(res)
      // })
      chart.changeData(data);
      // chart1.changeData(data);
    }
    // if(data.length>0){

    // }
  }, [data])
  useEffect(()=>{
    if(imgIs==2){
      is = ''
      ReaustMap.totalPonit().then(res => {
        dataFn(res)
      })
      echartstfn()
    }
  },[imgIs])
  useEffect(()=>{
  },[size])

  const chartoptfn = (id) => {
    const sum = 500;

    chart = new G2.Chart({
      container: id,
      forceFit: true,
      height: document.getElementById("opt10").offsetHeight,
      width:150,
      padding: 'auto'
    });
    chart.source(data);
    chart.tooltip(false);
    // chart.legend({
    //   position: 'right-center',
    //   offsetX: -100
    // });
    chart.coord('theta', {
      radius: 0.75,
      innerRadius: 0.6
    });
    chart.intervalStack().position('x').color('y',
        (type, city) => {
          let color;
          if (type === '一类' || type === '1类') color = '#5C89FF';
          if (type === '二类' || type === '2类') color = '#7C6AF2';
          if (type === '三类' || type === '3类') color = '#C95FF2';
          if (type === '四类' || type === '4类') color = '#FF9F40';
          if (type === '五类' || type === '5类') color = '#FF6383';
          // if (type === '首都人口' && city === '中国（北京）') color = '#f5222d';
          return color;
        })
        .opacity(1)
        .label('y', {
          offset: 15,
          textStyle: {
            // fill: 'white',
            fontSize: 12,
            fill:'#666',
            shadowBlur: 2,
            // shadowColor: 'rgba(0, 0, 0, .45)'
          },
          rotate: 0,
          autoRotate: false,
          formatter: (text, item) => {
            let nam = 0
            clickData.forEach((item) => {
              nam += item.x
            })

            return text+'-'+ String(parseInt(item.point.x / nam * 100)) + '%';
          }
        });
    chart.legend({
      position: 'bottom-center',
      // offsetX: -100,
      clickable:false
    });

    chart.on('click', ev => {
      tbFn('点击')
      if (ev.data) {
        if (ev.data._origin) {
          if(is ==ev.data._origin.genre){
            ReaustMap.totalPonit().then(res => {
              dataFn(res)
            })
            is ='functionType'
          }else{
            is =ev.data._origin.genre
            dataFn(ev.data._origin.list)

          }
        }
      }


    })
    chart.render();
  }



  const echartstfn = (id) => {
    // 基于准备好的dom，初始化echarts实例
    let smyChart = echarts.init(document.getElementById('main1'));
    // 绘制图表
    smyChart.off('click')

    smyChart.setOption({
      // series: [{
      //   name: 'hill',
      //   type: 'pictorialBar',

      // }],
      padding:[10,10,10,10],
      grid: {
        left: 0,
        right: 0,
        bottom: 20,
        top: 20
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: function(params) {
          return params[0].name + ': ' + params[0].value;
        }
      },
      xAxis: {
        type: 'category',
        data: clickData.map(item => item.y),
        axisLabel: { interval: 0, fontSize: 11, rotate: 8, margin: 10 }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      color: ['#e54035'],
      series: [{
        name: 'hill',
        type: 'pictorialBar',
        barCategoryGap: '-130%',
        barWidth: 200,
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        label: {
          show: true,
          position: 'top',
          distance: 4,
          color: '#666',
          // fontWeight: 'bolder',
          fontSize: 12,
          formatter: function(params) {

            return params.name + ': ' + params.value;

          }
        },
        itemStyle: {
          normal: {
            color: function(params) {
              let colorList = [
                'rgba(92,137,255,0.5)', 'rgba(124,106,242,0.5)',
                'rgba(201,95,242,0.5)', 'rgba(255,159,64,0.5)',
                'rgba(255,99,131,0.5)', 'rgba(96, 227, 255,0.7)',
                'rgba(25, 255, 224,0.7)'
              ];
              return colorList[params.dataIndex];
            }
          },
          emphasis: {
            opacity: 1
          }
        },
        data: clickData.map(item => item.x),
        // data: [2, 30, 25, 16, ],
        z: 10
      }]
    })
    smyChart.on('click', function (params) {
      let sty = ''
      if (is == params.data) {
        is = 'functionType'
        ReaustMap.totalPonit().then(res => {
          dataFn(res)
        })
      } else {
        dataFn(clickData[params.dataIndex].list)
        is = params.data
      }

      // if(key1 === 1){
      //   sty += 'expansionJointType=' + params.data.y
      // }
      // if(key1 === 2){
      //   sty += 'supportType=' +  params.data.y
      // }
      // clientHome.homebridges(sty).then(res=>{})
    });
  }
  return (
      <div className="situ-block">
        <div className="tltie">
          全桥评定
        </div>

        {tebnam == '11' ?
            <Radio.Group className='radio' value={size}
                // size="small"
                         onChange={(e) => setSize(e.target.value)}>
              <Radio.Button value="1">按全桥</Radio.Button>
              <Radio.Button value="2">按单元</Radio.Button>
              <Radio.Button value="3">上部结构</Radio.Button>
              <Radio.Button value="4">下部结构</Radio.Button>
              <Radio.Button value="5">桥面系</Radio.Button>
            </Radio.Group> : ''
        }

        <div className='img-select-box'>
          <div className='img-box'>
            {imgIs == 1 ? <img src={img2}></img> : <img onClick={() => {
              setImgIs(1)
            }} src={img1}></img>}
            {imgIs == 2 ? <img src={img4} ></img> : <img onClick={() => {
              setImgIs(2)
            }} src={img3}></img>}
          </div>
          <div className='select-box'>
            <Select
                className='select'
                // size="small"
                showSearch
                placeholder="功能类型"
                optionFilterProp="children"
                onChange={(value) => { setDictionariesId(value) }}
                style={{ width: 110 }}
                allowClear
            >
              {dictionarieslist.map(item => (
                  <Option key={item.id} value={item.dicValue}><TooltipA placement="topLeft" title={item.dicValue}>{item.dicValue}</TooltipA></Option>
              ))}
            </Select>
            <Select
                // size="small"
                className='select'
                showSearch
                placeholder="规模类型"
                onChange={(value) => { setBridgetypelistId(value) }}
                style={{ width: 90 }}
                optionFilterProp="children"
                allowClear
            >
              {bridgetypelist.map(item => (
                  <Option key={item.id} value={item.name}><TooltipA placement="topLeft" title={item.name}>{item.name}</TooltipA></Option>
              ))}
            </Select>
            <Select
                // size="small"
                showSearch
                // width={200}
                className='select'
                placeholder="检查年份"
                defaultValue={constypelistId}
                style={{ width: 110 }}
                onChange={(value) => { setConstypelistId(value) }}
                optionFilterProp="children"
                // allowClear
            >
              {constypelist.map(item => (
                  <Option key={item} value={item}><TooltipA placement="topLeft" title={item}>{item}</TooltipA></Option>
              ))}
            </Select>
          </div>
        </div>
        <div className={imgIs == 1 ? 'situ-block' : "optremove1"}>
          <div  className='optremove'  id="opt10"  ></div>
        </div>
        <div className={imgIs == 2 ? 'situ-block ' : "optremove1"} style={{marginLeft:'30px'}} >
          <div className='optremove'  id="main1" style={{ width: 380
            // , height: document.getElementById("main1").offsetHeight,
          }}></div>
        </div>
        {/* {imgIs == 1 ? <div   ></div> : */}
        {/* } */}
        {/*  <Chart
          height={300}
          source={department}
          forceFit
          padding={[50, 100, 50, 60]}
          data={department}
          onClick={ev => {
            if (ev.data) {
              if (ev.data._origin) {
                if (ev.data._origin.list) {
                  dataFn(ev.data._origin.list)
                }
              }
            }
          }}
        >
          <Axis
            name="genre"
            tickLine={null}
            line={null}
            title={null}
            labels={{
              custom: true,
              renderer: (text, item, index) => {
                return (
                  '<div style="color:' +
                  COLORS[index] +
                  ';font-size:10px;width:45px;position:relative;left:15px;">' +
                  text +
                  "</div>"
                );
              }
            }}
          />
          <Axis name="sold" visible={false} />
          <Geom
            type="interval"
            position="genre*sold"
            shape="smoothInterval"
            color={["genre", COLORS]}
            label={[
              "sold",
              {
                custom: true,
                renderer: val => {
                  // 3 替换成Min
                  const topOffset = val == 3 ? -30 : 0;
                  return (
                    '<div style="color:#999;font-size:10px;position:relative;left:15px;top:' +
                    topOffset +
                    'px">' +
                    val +
                    "%</div>"
                  );
                }
              }
            ]}
          >
            <Label label="sold" />
          </Geom>
        </Chart> */}
      </div>
  )
}

export default Opt1