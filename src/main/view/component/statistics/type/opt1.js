import React, { useState, useEffect } from "react";
// import G2 from '@antv/g2'
import { Tabs, } from "antd";
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
// import ReactEcharts from "echarts-for-react";
import clientHome from "../../../../client/home/home";
import ReaustMap from '../../../../client/map/requstMap'
const { TabPane } = Tabs;
let clickData
var myChart
let is = ''
let key1 = 1

function Opt1({ dataFn, dataList,name,tbFn}) {
  const [type, setType] = useState(1)
  const [data, setData] = useState([])
  const [outData, setOutData] = useState([])
  useEffect(() => {
    chartoptfn('opt1')
  }, []);
  // 监听获取数据
  useEffect(() => {
    if (dataList.statistic) {
      if (type == 1) {
        let arr = dataList.statistic.firstSectorStatistic
        arr.inData.forEach((item, index) => {
          item.id = index
          item.value = item.x
          item.name = item.y
          item.id = index
          item.color = { rgb: "rgba(48,128,241,", a: "1", t: ")" }
        })
        setData(arr.inData)
        setOutData(arr.outData)
        clickData = arr
      } else if (type == 2) {
        let arr = dataList.statistic.secondSectorStatistic
        arr.inData.forEach((item, index) => {
          item.id = index
          item.value = item.x
          item.name = item.y
          item.id = index
          item.color = { rgb: "rgba(48,128,241,", a: "1", t: ")" }
        })
        setData(arr.inData)
        setOutData(arr.outData)
        clickData = arr
      }

    }
  }, [dataList, type]);;
  // 监听渲染图例
  useEffect(() => {
    is = ''
    ReaustMap.totalPonit().then(res => {
      dataFn(res)
    })
    chartoptfn()
  }, [data,type])
  useEffect(() => {
    if(name == '点击柱状图了'){
      chartoptfn()
      is = ''
    }
  }, [name]);
  const [size, setSize] = useState('large')
  const chartoptfn = (id) => {
    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.off('click')
    myChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],

          label: {
            show: true,
            position: 'inside',
            formatter: function (params) {
              if (params.name == "铸钢支座") {
                return '            ' + params.name
              } else if (params.name == "盆式支座") {
                //  params.marker = "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ffaa5a;'></span>"
                return params.name + '           '
              } else if (params.name != "铸钢支座") {
                return params.name;

              }

            },
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            normal: {
              color: function (params) {
                let colorList = [
                  '#ff885f', '#ffaa5a',
                  '#5c89ff', '#7c6af2',
                  '#c95ff2', '#ff6383',
                  '#ffcd2e', 'rgba(96, 227, 255,1)',
                  'rgba(25, 255, 224,1)'
                ];
                return colorList[params.dataIndex];
              }
            },
            emphasis: {
              opacity: 1
            }
          },
          data: data
        },
        {
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          color: '#666',

          label: {
            color: '#666',
            // backgroundColor: '#eee',
            // borderColor: '#aaa',
            rich: {
              a: {
                color: '#666',
                lineHeight: 24,
                align: 'center'
              },
              hr: {
                color: '#666',
                borderColor: '#aaa',
                width: '100%',
                borderWidth: 0.5,
                height: 0
              },
              b: {
                color: '#666',
                fontSize: 16,
                lineHeight: 33
              },
              per: {
                color: '#666',
                backgroundColor: '#334455',
                padding: [2, 4],
                borderRadius: 2
              }
            }
          },
          itemStyle: {
            normal: {
              color: function (params) {
                let colorList = [
                  '#ff885f', '#ffaa5a',
                  '#6b52fe',
                  '#6769fd',
                  '#ff6865',
                  '#ff885f',
                  '#ffaa5a',
                  '#ffd366',
                  '#83fb72',
                  '#57f5d9',
                  '#3bcde2',

                ];
                return colorList[params.dataIndex];
              }
            },
            emphasis: {
              opacity: 1
            }
          },
          data: data
          // data: outData
          // [
          //     {value: 335, name: '直达'},
          //     {value: 310, name: '邮件营销'},
          //     {value: 234, name: '联盟广告'},
          //     {value: 135, name: '视频广告'},
          //     {value: 1048, name: '百度'},
          //     {value: 251, name: '谷歌'},
          //     {value: 147, name: '必应'},
          //     {value: 102, name: '其他'}
          // ]
        }
      ]
    });
    myChart.on('click', function (params) {
      // dataFn(params.data.list)
      // console.log(params.data.id,params)
      tbFn('点击exs了')
      let sty = ''
      if (key1 == 1) {
        sty += 'expansionJointType=' + params.data.y
      }
      if (key1 == 2) {
        sty += 'supportType=' + params.data.y
      }
      if (is == params.data.id) {
        is = 'functionType'
        ReaustMap.totalPonit().then(res => {
          dataFn(res)
        })
      } else {
        clientHome.homebridges(sty).then(res => { dataFn(res) })
        is = params.data.id
      }

    });

  }
  // 点击tabs
  const tabsfn = (key) => {
    setType(key)
    // console.log(key,key1)
    key1 = key
  }
  return (
      <div className="situ-block">
        <Tabs className='tabs' defaultActiveKey="1" onChange={tabsfn}>
          <TabPane tab="伸缩缝类型" key="1">
          </TabPane>
          <TabPane tab="支座类型" key="2">
          </TabPane>
        </Tabs>
        {/* <div id="opt1" className="optremove" ></div> */}
        <div id="main" className="optremove" style={{ width: 460, }}></div>
      </div>
  )
}

export default Opt1