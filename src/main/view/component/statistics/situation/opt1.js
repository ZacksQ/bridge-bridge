import React, { useState, useEffect } from "react";
import * as G2 from '@antv/g2'
import { View } from '@antv/data-set';
import insertCss from 'insert-css';
import clientHome from './../../../../client/home/home'
import ReaustMap from '../../../../client/map/requstMap'
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
let clickData
let is = ''
// let dictionaries
// let constypelist
let chart
function Opt1({ dataFn, datalist,name,tbFn}) {
  const [data, setData] = useState([])
  useEffect(() => {
    chartoptfn('opt2')
  }, []);
  useEffect(() => {
    if (datalist) {
      setData(datalist.functionTypeStatistic.data)
      clickData = datalist.functionTypeStatistic.data
    }
  }, [datalist])
  useEffect(() => {
    if(name&&name != '中'){
      chart.changeData(data);
      is = ''
    }
  }, [name]);
  useEffect(() => {
    if (chart) {
      is = ''
      if(name != '中'){
        chart.changeData(data);
      }
    }
  }, [data])
  const [size, setSize] = useState('large')
  const chartoptfn = (id) => {
    const sum = 500;
    chart = new G2.Chart({
      container: id,
      forceFit: true,
      height: document.getElementById("opt2").offsetHeight,
      width:150,
      padding: 'auto'
    });
    chart.source(data);
    chart.tooltip(false);
    chart.legend({
      position: 'right-center',
      offsetX: -100,
      clickable:false
    });
    chart.coord('theta', {
      radius: 0.75,
      innerRadius: 0.6
    });
    chart.intervalStack().position('x').color('y', ['#0471b3', '#0092ea','#07b0ff', '#41c4ff', '#80d8ff'])
        .opacity(1)
        .label('y', {
          offset: 15,
          textStyle: {
            fill: '#666',
            fontSize: 12,
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

            return item.point.y+'-'+ String(parseInt(item.point.x / nam * 100)) + '%';
          }
        });
    chart.legend({
      position: 'bottom', // 设置图例的显示位置
      offsetX: 1,
      itemGap: 10 // 图例项之间的间距
    });
    chart.on('click', ev => {
      tbFn('中',()=>{
        if (ev.data) {
          if (ev.data._origin) {
            let sty = ''
            sty += 'functionType=' + ev.data._origin.y + '&'

            console.log(ev.data)
            if(is ==ev.data._origin.y){

              ReaustMap.totalPonit().then(res => {
                dataFn(res)
              })
              is ='functionType'
            }else{
              is =ev.data._origin.y

              clientHome.homebridges(sty).then(res=>{dataFn(res)})
            }
          }
        }
      })
    })
    chart.render();
  }
  return (
      // <div className="antv">
      <div id="opt2" className="optremove" ></div>
      // </div>
  )
}

export default Opt1