import React, { useState, useEffect } from "react";
import * as G2 from '@antv/g2'
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
let dictionaries
let constypelist
let chart
function Opt1({ dataFn, datalist,dictionariesId,constypelistId ,name,tbFn}) {
  const [data, setData] = useState([])
  useEffect(() => {
    chartoptfn('opt1')
  }, []);
  useEffect(() => {
    if(name&&name != '下'){
      chart.changeData(data);
      is = ''
    }
  }, [name]);
  useEffect(() => {
    if (datalist) {
      setData(datalist.bridgeScaleStatistic.data)
      clickData = datalist.bridgeScaleStatistic.data
    }
  }, [datalist])
  useEffect(() => {
    if (chart) {
      is = ''

      // ReaustMap.totalPonit().then(res => {
      //   dataFn(res)
      // })
      if(name != '中'){
        chart.changeData(data);
      }
    }
  }, [data])
  useEffect(() => {
    //初始化图表
    dictionaries =dictionariesId
    constypelist =constypelistId
  }, [dictionariesId,constypelistId])
  const chartoptfn = (id) => {
    const sum = 500;
    chart = new G2.Chart({
      container: id,
      forceFit: true,
      height: document.getElementById("opt1").offsetHeight,
      width:150,
      padding: 'auto'
    });
    chart.source(data);
    chart.tooltip(false);
    chart.legend({
      position: 'right-center',
      offsetX: -100
    });
    chart.coord('theta', {
      radius: 0.75,
      innerRadius: 0.6
    });
    chart.intervalStack().position('x').color('y', ['#FF8C00', '#FFA500', '#FFA500', '#FFDEAD	', '#FAEBD7'])
        .opacity(1)
        .label('y', {
          offset: 18,
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
            return item.point.y+'-'+ String(parseInt(item.point.x / nam * 100)) + '%';
          }
        });
    chart.legend({
      position: 'bottom', // 设置图例的显示位置
      offsetX: 1,
      itemGap: 10, // 图例项之间的间距
      clickable:false
    });
    chart.on('click', ev => {
      tbFn('下',()=>{
        if (ev.data) {
          if (ev.data._origin) {
            let sty = ''
            sty += 'bridgeScale=' + ev.data._origin.y + '&'
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

      <div id="opt1" className="optremove" ></div>
  )
}

export default Opt1