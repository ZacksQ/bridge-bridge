import React, { useState, useEffect } from "react";
import * as G2 from '@antv/g2'
// import { Button, Radio, } from "antd";
import './index.css'
import clientHome from './../../../../client/home/home'
import ReaustMap from '../../../../client/map/requstMap'
// import { DataSet } from '@antv/data-set';
let chartopt
let is = ''
// 全局数据
let clickData
let tiaoj
let dictionaries
let constypelist
function Opt({ dataFn, bridgetypelist, datalist, dictionariesId, constypelistId, dataSty ,name,tbFn}) {
  // 图表数据

  const [data, setData] = useState([])
  useEffect(() => {
    //判断接受数据动态化数据
    if (datalist) {
      setData(datalist.totalStatistic.data)
      clickData = datalist.totalStatistic.data
    }
  }, [datalist]);
  useEffect(() => {
    //判断接受数据动态化数据
    let sty = ''
    if (dataSty) {
      tiaoj = dataSty
      sty = dataSty
    }
    if(name == '上'){
      clientHome.homebridges(sty).then(res => { dataFn(res) })

    }
  }, [dataSty]);
  useEffect(() => {
    //初始化图表
    chartoptfn('opt')
  }, [])
  useEffect(() => {
    //初始化图表
    dictionaries = dictionariesId
    constypelist = constypelistId
  }, [dictionariesId, constypelistId])
  useEffect(() => {
    // 监听数据动态图例
    if (chartopt) {
      is = ''
      console.log(data)
      data.forEach((item)=>{

        if(item.color){
          item.color.a=1
        }
      })

      chartopt.changeData(data);
    }
  }, [data])
  useEffect(() => {
    if(name&&name != '上'){
      clickData.forEach(item => {
        return item.color.a = '1'
      });
      chartopt.changeData(data);
      is = ''
    }
  }, [name]);
  const chartoptfn = (id) => {
    chartopt = new G2.Chart({
      container: id,
      forceFit: true,
      height: document.getElementById("opt").offsetHeight,
      width: 150,
      padding: [20, 70, 20, 70]
    });
    chartopt.source(data);
    chartopt.coord().transpose();
    chartopt.interval().position('y*x').color(
        'name*color', function (name, color) {
          if (color) {
            return color.rgb + color.a + color.t
          }
        })
        // .opacity(1)
        .label('y', {
          offset: 10,
          textStyle: {
            // fill: 'white',
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
    chartopt.scale({
      x: {
        // max: 1400,
        // min: 0,
        alias: '数量',
      },
    });
    chartopt.on('click', ev => {
      tbFn('上')
      // 点击事件更改样式以及传输图表
      let arr = clickData


      if (ev.data) {
        arr.forEach((item, index) => {
          if (ev.data._origin) {
            if (is == ev.data._origin.id) {
              return item.color.a = '1'
            }
            if (item.id !== ev.data._origin.id) {
              item.color.a = '.1'
            } else {
              item.color.a = '1'
            }
          }
        });
        setData(arr)
        chartopt.changeData(arr);
        if (ev.data) {
          if (ev.data._origin) {
            if (is == ev.data._origin.id) {
              // ReaustMap.totalPonit().then(res => {
              //   dataFn(res)
              // })
              let sty = ''
              if(tiaoj){
                sty+= tiaoj
              }
              clientHome.homebridges(sty).then(res => { dataFn(res) })
              is = '清除选中'
            } else {
              is = ev.data._origin.id
              let sty = ''
              sty += 'roadNo=' + ev.data._origin.y + '&'
              if(tiaoj){
                sty+= tiaoj
              }
              clientHome.homebridges(sty).then(res => { dataFn(res) })
            }
          }
        }

      }
    })
    chartopt.render();
  }
  return (
      <div id="opt" className="optremove" ></div>
  )
}

export default Opt