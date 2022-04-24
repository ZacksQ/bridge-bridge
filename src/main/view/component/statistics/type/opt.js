import React, { useState, useEffect } from "react";
import G2 from '@antv/g2'
import { Select, Tooltip } from "antd";
import { Tabs } from 'antd';
import './index.css';
import clientHome from "../../../../client/home/home";
import ReaustMap from '../../../../client/map/requstMap'
const { TabPane } = Tabs;
const { Option } = Select;
let chartopt
let clickData
let view
let is = ''
let key1 = 1
function Opt({ dataFn, class1Fn, class2Fn, dataList, name,tbFn}) {
  const [data, setData] = useState({})
  const [class2, setClass2] = useState(1)
  const [class1, setClass1] = useState(1)
  const [department, setDepartment] = useState([
    { name: '按座数', id: 1 },
    { name: '按孔数', id: 2 },
    { name: '按延米数', id: 3 },
  ])
  const [department1, setDepartment1] = useState([
    { name: '全桥', id: 1 },
    { name: '桥幅', id: 2 },
  ])
  const [type, setType] = useState(1)
  // 渲染图例
  useEffect(() => {
    chartoptfn('opt4')
  }, []);
  // 监听获取数据
  useEffect(() => {
    if (dataList.statistic) {
      // 根据type渲染不同数据
      if (type == 1) {
        let arr = dataList.statistic.firstBarStatistic.data
        arr.forEach((item, index) => {
          item.id = index
          //定义颜色方便处理
          item.color = { rgb: "rgba(48,128,241,", a: "1", t: ")" }
        })
        setData(arr)
        clickData = arr
      } else if (type == 2) {
        if (dataList.statistic.thirdBarStatistic) {
          let arr = dataList.statistic.secondBarStatistic.data
          arr.forEach((item, index) => {
            item.id = index
            item.color = { rgb: "rgba(48,128,241,", a: "1", t: ")" }
          })
          setData(arr)
          clickData = arr
        }

      } else if (type == 3) {
        if (dataList.statistic.thirdBarStatistic) {
          let arr = dataList.statistic.thirdBarStatistic.data
          arr.forEach((item, index) => {
            item.id = index
            item.color = { rgb: "rgba(48,128,241,", a: "1", t: ")" }
          })
          setData(arr)
          clickData = arr
        }

      }
    }
  }, [dataList, type]);;
  // 监听渲染图例
  useEffect(() => {
    if (chartopt) {

      is = ''
      ReaustMap.totalPonit().then(res => {
        dataFn(res)
      })
      chartopt.changeData(data);
    }
  }, [data])
  useEffect(() => {
    class2Fn(class2)
  }, [class2])
  useEffect(() => {
    class1Fn(class1)
  }, [class1,])
  useEffect(() => {
    if(name == '点击exs了'){
      clickData.forEach(item => {
        return item.color.a = '1'
      });
      chartopt.changeData(data);
      is = ''
    }
  }, [name]);
  // 图表
  const chartoptfn = (id) => {
    chartopt = new G2.Chart({
      container: id,
      forceFit: true,
      height: document.getElementById("opt4").offsetHeight,
      width: 150,
      // height: 400 ,
      //  autoFit: true,
      padding: [0, 60, 0, 130]
    });
    // view = chartopt.view({
    //     start: { x: 0.2, y: 0.2 }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
    //     end: { x: 1, y: 1 }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
    //   // padding: [20, 40], // 指定视图的留白
    // });
    // 更改图例
    chartopt.legend({
      clickable: false
    });
    chartopt.source(data);
    chartopt.coord().transpose();
    chartopt.scale({
      x: {
        // max: 1400,
        // min: 0,
        alias: '数量',
      },
    });
    // chartopt.coordinate().transpose();
    // chartopt.tooltip({
    //   showMarkers: false
    // });
    // chartopt.interaction('active-region');
    chartopt.interval().position('y*x').color('name*color', function (name, color) {
      return color.rgb + color.a + color.t
    })
        .label('y', {
          offset: 10,
          textStyle: {
            fontSize: 12,
            shadowBlur: 2,
            // stroke:'rgb(0, 0, 0)',
            fill: "#666",
            // shadowColor: 'rgba(0, 0, 0,.45)'
          },
          rotate: 0,
          autoRotate: false,
          formatter: (text, item) => {
            return item.point.x;
          }
        });

    chartopt.axis('y', {
      // title: null,
      // tickLine: null,
      // line: null,
      title: {
        offset: 180,
        style: {
          fontSize: 10,
          // fontWeight:300 ,
        },
        grid: {
          left: '40%',
          lineStyle: {
            lineWidth: 0,
          }
        },
      },
    });
    //   chartopt.scale("date", {
    //     range: [100, 200],
    // });
    chartopt.on('click', ev => {
      tbFn('点击柱状图了')
      let arr = clickData

      if (ev.data) {
        if (ev.data._origin) {
          arr.forEach(item => {
            if (is == ev.data._origin.id) {
              return item.color.a = '1'
            }
            if (item.id !== ev.data._origin.id) {
              item.color.a = '.1'
            } else {
              item.color.a = '1'
            }
          });
          setData(arr)
          chartopt.changeData(arr);
          if (ev.data) {
            if (ev.data._origin) {
              if (is == ev.data._origin.id) {
                is = 'functionType'
                ReaustMap.totalPonit().then(res => {
                  dataFn(res)
                })
              } else {
                is = ev.data._origin.id

                let sty = ''
                if (key1 == 1) {
                  sty += 'superstructureType=' + ev.data._origin.y
                }
                if (key1 == 2) {
                  sty += 'pierType=' + ev.data._origin.y
                }
                if (key1 == 3) {
                  sty += 'abutmentType=' + ev.data._origin.y
                }
                clientHome.homebridges(sty).then(res => { dataFn(res) })
                // if (ev.data._origin.list) {

                //   dataFn(ev.data._origin.list)
                // }
              }
            }
          }

        }

      }
    })
    chartopt.render();
  }
  const tabsfn = (key) => {
    setType(key)
    // setClass1(1)
    // class2Fn(1)
    key1 = key
    if (key == 3 || key == 2) {
      setDepartment([
        { name: '按座数', id: 1 },
        { name: '按孔数', id: 2 },
      ])
      setClass2(1)
    } else {
      setDepartment([
        { name: '按座数', id: 1 },
        { name: '按孔数', id: 2 },
        { name: '按延米数', id: 3 },
      ])
    }
    setType(key)
  }
  return (
      <div className="situ-block">
        <Tabs className='tabs' defaultActiveKey="1" onChange={tabsfn}>
          <TabPane tab="上部结构类型" key="1">
          </TabPane>
          <TabPane tab="桥墩类型" key="2">
          </TabPane>
          <TabPane tab="桥台类型" key="3">
          </TabPane>
        </Tabs>
        <div className="select-box1" >
          <Select
              // size="small"
              showSearch
              className="select"
              placeholder="统计类别一"
              optionFilterProp="children"
              onChange={(value) => {
                setClass2(value)
              }}
              value={class2}
          >
            {department.map(item => (
                <Option key={item.id} value={item.id}><Tooltip placement="topLeft" title={item.name}>{item.name}</Tooltip></Option>
            ))}
          </Select>
          <Select
              // size="small"
              className="select"
              showSearch
              placeholder="统计类别二"
              optionFilterProp="children"
              value={class1}

              onChange={(value) => setClass1(value)}
          >
            {department1.map(item => (
                <Option key={item.id} value={item.id}><Tooltip placement="topLeft" title={item.name}>{item.name}</Tooltip></Option>
            ))}
          </Select>
        </div>
        <div id="opt4" className="optremove" ></div>
      </div>
  )
}

export default Opt