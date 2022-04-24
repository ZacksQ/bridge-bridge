import React, {useCallback, useEffect} from "react";
import "./chart.css";
import {Chart} from "@antv/g2";

//创建chart对象
let chart = null
let index = 0
const BarChart = ({id, data, title, subtitle, width, height, forceFit}) => {
    //初始化
    useEffect(() => {

        // //配置矩形框
        // chart.interval()
        //     .position("x*y")
        //     .color("x");
        // //配置图例
        // chart.legend(false);
        // // 开始配置坐标轴
        // chart.axis('x', {
        //     label: {
        //         textStyle: {
        //             fill: '#aaaaaa'
        //         }
        //     },
        //     tickLine: {
        //         alignWithLabel: false,
        //         length: 1
        //     }
        // });
        // chart.axis('y', {
        //     label: {
        //         textStyle: {
        //             fill: '#aaaaaa'
        //         },
        //         formatter: val => {
        //             return val + "个";
        //         }
        //     }
        // });
        // chart.scale('xField', {
        //     type: 'linear',
        //     min: 1,
        //     max: 1000
        // });


        // eslint-disable-next-linefilterDeductionData
    }, []);
    //更新视图
    useEffect(() => {
        // if (!chart.filteredData || chart.filteredData.length === 0 || chart.filteredData.some((value, index) => data[index].x !== value.x || data[index].y !== value.y)) {
        if(data.length>0){

            chart = new Chart({
                container: id,
                width: width,
                height: height + data.length * 36,
                forceFit: forceFit,
                padding: [0,50,50,50]
            });
            chart.clear()
            chart.source(data.reverse(), {
                y: {
                    alias: '构件数量（个）'
                }
            });
            chart.axis('x', {
                label: {
                    textStyle: {
                        fill: '#8d8d8d',
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
            chart.axis('y', {
                label: {
                    textStyle: {
                        fill: '#8d8d8d'
                    },
                    formatter: val => {
                        return val + "个";
                    }
                }
            });
            chart.legend(false);
            chart.coord().transpose();
            chart.interval().position('x*y').size(26)
                .opacity(1)
                .label('y', {
                    textStyle: {
                        fill: '#8d8d8d'
                    },
                    offset: 10
                });

            chart.render();

            // }
        }
        return function clearUp(){
            if(chart){
                chart.destroy()
            }
        }
    }, [data]);

    //渲染
    return (
        <div>
            {title ? <h2 className="title">{title}</h2> : null}
            {subtitle ? <h4 className="subtitle">{subtitle}</h4> : null}
            <div id={id}/>
        </div>
    )
}

export default BarChart;