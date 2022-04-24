import React, { useState, useEffect } from "react";
import * as G2 from '@antv/g2'
import './index.css';
import clientHome from './../../../../client/home/home'
import ReaustMap from '../../../../client/map/requstMap'
let is = ''
let chart
function Opt({dataFn,tebnam,name,tbFn}){
    const [data, setData] = useState([])

    useEffect(() => {
        chartoptfn('opt9')
    }, []);
    useEffect(() => {
        evaluationFn()
    }, [tebnam]);

    useEffect(() => {
        is = ''
        if(chart &&data&&data[0] ){
            chart.changeData(data);
        }
    },[data])

// 图表

    const evaluationFn = ()=>{
        clientHome.evaluation(tebnam).then(res=>{
            let arr = []
            res.data.forEach( i => {
                let nam = 0
                i.data.forEach(v => {
                    nam += v.x
                })
                i.data.forEach(v => {
                    arr.push({
                        city : i.key,
                        value: v.x/nam,
                        x: v.x,
                        type:v.y,
                        list:i.bridgeList,

                    })
                })
            });
            setData(arr)
        })
    }
// 图表
    const chartoptfn = (id)=>{
        chart = new G2.Chart({
            container: id,
            forceFit: true,
            height: document.getElementById("opt9").offsetHeight,
            width:400,
            padding: [ 20, 70, 50, 120 ]
        });
        chart.source(data, {
            value: {
                max: 1.0,
                min: 0.0,
                nice: false,
                // alias: '占比（%）'
            }
        });
        chart.axis('city', {
            label: {
                textStyle: {
                    fill: '#595959',
                    fontSize: 12
                }
            },
            tickLine: {
                alignWithLabel: false,
                length: 0
            },
            line: {
                lineWidth: 0
            }
        });
        chart.legend({
            position: 'top-left', // 设置图例的显示位置
            offsetX:1,
            itemGap: 10, // 图例项之间的间距
            clickable:false
        });
        chart.legend({
            position: 'top-center',
            padding:[10,10,10,10],

        });
        chart.coord().transpose();
        chart.intervalStack().position('city*value')
            .tooltip('x*type',function (x, type) {
                // rate = rate + type;//算法
                return {
                    name: type,//itemTpl:{name}
                    value:x// itemTpl:{value}
                }
            })
            .color('type*city', (type, city) => {
                let color;
                if (type === '一类' || type === '1类') color = '#5C89FF';
                if (type === '二类' || type === '2类') color = '#7C6AF2';
                if (type === '三类' || type === '3类') color = '#C95FF2';
                if (type === '四类' || type === '4类') color = '#FF9F40';
                if (type === '五类' || type === '5类') color = '#FF6383';
                // if (type === '首都人口' && city === '中国（北京）') color = '#f5222d';
                return color;
            })
            .size(12)
            .opacity(1)
            .label('value*type', (val, t) => {
                const color = (t === '首都人口') ? 'white' : '#47494b';
                if (val < 0.05) {
                    return false;
                }
                return {
                    position: 'middle',
                    offset: 0,
                    textStyle: {
                        fontSize: 12,
                        fill: "#fff",
                        shadowBlur: 2,
                        // shadowColor: 'rgba(0, 0, 0, .45)'
                    },
                    formatter: (text, item) => {
                        // return  item.point.x;
                    }
                }

            });
        chart.on('click', ev => {
            tbFn('点击分类图表了')
            if(ev.data){
                console.log(ev.data)
                if (ev.data._origin) {
                    if(is ==ev.data._origin.city){
                        ReaustMap.totalPonit().then(res => {
                            dataFn(res)
                        })
                        is ='functionType'
                    }else{
                        is =ev.data._origin.city
                        dataFn(ev.data._origin.list)

                    }
                }
            }
        })
        chart.render();
    }
    return(

        <div id="opt9" className="optremove" ></div>
    )
}

export default Opt