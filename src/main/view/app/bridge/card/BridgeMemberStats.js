import React, {useEffect, useState} from "react";
import G2 from "@antv/g2";
import {View} from '@antv/data-set';
import BridgeMemberClient from "../../../../client/bridge/BridgeMemberClient";
import {Empty, Skeleton} from "antd";
import MemberList from "./MemberList";

function getTypeColor(type) {
    if (type === '左幅') {
        return '#1890ff';
    }
    if (type === '右幅') {
        return '#2fc25b';
    } else {
        return '#facc14';
    }
}

let chart;

const BridgeMemberStats = ({bridgeId}) => {
    const [loading, setLoading] = useState(false);
    const [datalist, setDatalist] = useState([]);
    const [memberData, setMemberData] = useState(null)
    const [title, setTitle] = useState([])
    const [selectTitle, setSelectTitle] = useState([])
    const [siteList, setSiteList]= useState([])
    const [memberListVisible, setMemberListVisible] = useState({visible: false, data: {}})
    const getIndex = (arr, value) => {
        let rindex = -1
        for (let index = 0; index < arr.length; index++) {
            if (arr[index].memberTypeName === value) {
                rindex = index
                break
            }
        }
        return rindex
    }
    //获取数据
    const fetchData = () => {
        setLoading(true);
        let t = []
        let st = []
        BridgeMemberClient
            .listBridgeMemberStats(bridgeId)
            .then(data => {
                let chartData = []
                for (let sideType in data) {
                    if (data[sideType].length > 0) {
                        data[sideType].forEach(item => {
                            if (item.typeName.indexOf("所有孔跨") > -1) {
                                t.push(sideType + "：" + item.typeName)
                                st.push({name: sideType, curIndex: 0})
                                let cd = item.data.forEach((itemData, index) => {
                                    chartData.push({
                                        ...itemData, sideTypeName: sideType, superstructureTypeId: item.superstructureTypeId, bridgeSideId: item.bridgeSideId
                                    })
                                })
                            }
                        })
                    }
                }

                chartData = chartData.map(d => ({
                    class: d.sideTypeName,
                    memberTypeName: d.memberTypeName,
                    type: "构件数量",
                    value: d.memberAmount,
                    superstructureTypeId: d.superstructureTypeId,
                    bridgeSideId: d.bridgeSideId,
                    memberTypeId: d.memberTypeId
                })) //.reverse()

                chart.source(chartData);
                chart.render();
                setLoading(false);
                setDatalist(chartData)
                setMemberData(data)
                setTitle(t)
                setSelectTitle(st)

                chart.on("click", event=>{
                    console.log(event)
                    let data = null
                    if(event.target.name === "interval"){
                        data = event.data.point
                    }else if(event.target.name === "label" && event.data.bridgeSideId && event.data.superstructureTypeId){
                        data = event.data
                    }
                    if(data){
                        fetchSiteList(data.bridgeSideId, data.superstructureTypeId).then(sites=> {
                            if(sites.length>0){
                                setSiteList(sites)
                                setMemberListVisible({visible: true, data: {superstructureTypeId: data.superstructureTypeId, bridgeSideId: data.bridgeSideId, memberTypeId: data.memberTypeId}})
                            }
                        })
                    }
                })
            });
    }

    const fetchSiteList = (bridgeSideId, superstructureTypeId)=>{
        return BridgeMemberClient.getSiteList({bridgeSideId, superstructureTypeId})
    }

    useEffect(() => {
        if (bridgeId) {
            fetchData();
        }
        // eslint-disable-next-line
    }, [bridgeId])

    useEffect(() => {
        chart = new G2.Chart({
            container: 'BridgeMemberStats',
            width: 976,
            height: 900,
            autoFit: true,
            padding: [20, 20, 20, 70]
        });
        chart.coord().transpose()
        drawChart()
        // eslint-disable-next-line
    }, []);
//  useEffect(() => {
//     // 监听数据动态图例
//     if (chart) {
//         chart.changeData(data.map(d => ({class: d.sideTypeName, memberTypeName: d.memberTypeName, type: "构件数量", value: d.memberAmount})))
//     }
//   }, [data])
    const drawChart = () => {
        chart.tooltip(true, {
            crosshairs: {
                type: 'rect' ,
                style: {
                    // 图形样式
                    fill: 'transparent', // 填充的颜色

                }
            },
        });
        chart.facet('rect', {
            fields: ['class'],
            padding: [0, 48, 0, 0],
            showTitle: false,

            columnTitle: {
                offsetY: -15,
                style: {
                    fontSize: 14,
                    fontWeight: 300,
                    fill: '#8d8d8d'
                }
            },
            eachView: (view, facet) => {
                // if (facet.colValue == '左幅') {
                view.axis('memberTypeName', {
                    tickLine: null,
                    line: null,
                });

                view.axis('value', false);

                let color
                if (facet.colValue === '右幅') {
                    color = '#3ac563';
                } else {
                    color = '#2496ff'
                }
                view
                    .intervalStack().active([true], {
                    highlight: false, style: {
                        fill: 'red'
                    }
                })
                    // .adjust('stack')
                    .position('memberTypeName*value')
                    .color('type', [color])
                    .size(26)
                    .label('value*type', (val, t) => ({position: 'middle', offset: 0}));
                // view.interaction('element-active');
            }
        });
    }
    const filterChartData = (sideTypeName, memberPartName) => {
        let chartData = []
        let t = []
        let data = memberData
        for (let sideType in data) {
            // if(sideType==="右幅"){
            //     debugger
            // }
            if (data[sideType].length > 0) {
                data[sideType].forEach(item => {
                    if (sideType === sideTypeName) {
                        if (item.typeName.indexOf(memberPartName) > -1) {
                            t.push(sideTypeName + "：" + item.typeName )
                            let cd = item.data.forEach((sitem, index) => {
                                chartData.push({
                                    ...sitem, sideTypeName: sideTypeName, superstructureTypeId: item.superstructureTypeId, bridgeSideId: item.bridgeSideId
                                })
                            })
                        }
                    } else {
                        let remainIndex = -1
                        for (let rin = 0; rin < title.length; rin++) {
                            if (title[rin].indexOf(sideType) > -1) {
                                remainIndex = rin
                                break
                            }
                        }

                        if (remainIndex > -1) {
                            if (title[remainIndex].indexOf(item.typeName/*.replace(sideType + "(", "").replace(")", "")*/) > -1) {
                                t.push(sideType + "：" + item.typeName )
                                let cd = item.data.forEach((sitem, index) => {
                                    chartData.push({
                                        ...sitem, sideTypeName: sideType, superstructureTypeId: item.superstructureTypeId, bridgeSideId: item.bridgeSideId
                                    })
                                })
                            }
                        }
                    }
                })
            }else{
                data[sideTypeName].forEach(item => {

                })
            }
        }
        setTitle(t)
        chart.clear()
        chartData = chartData.map(d => ({
            class: d.sideTypeName,
            memberTypeName: d.memberTypeName,
            type: "构件数量",
            value: d.memberAmount,
            superstructureTypeId: d.superstructureTypeId,
            bridgeSideId: d.bridgeSideId,
            memberTypeId: d.memberTypeId
        }))//.reverse()

        chart.source(chartData)
        drawChart()
        chart.render()
    }

    const createTable = () => {
        let memberTable = []
        if (memberData) {
            for (let sideType in memberData) {
                let sindex = 0
                let table = []
                for(let si = 0; si< selectTitle.length; si++){
                    if(selectTitle[si].name===sideType){
                        sindex = si
                        break
                    }
                }
                if (memberData[sideType].length > 0) {
                    let td = []
                    memberData[sideType].forEach((item, index) => {
                        // <tr key={index}>
                        //     <td>{item.typeName}</td>
                        //     <td>共{item.siteAmount}跨</td>
                        //     <td className="show-memeber-amount" style={Array.isArray(item.data) && item.data.length>0?{}:{color: '#737373', cursor: 'default'}} onClick={() => {
                        //         if(Array.isArray(item.data) && item.data.length>0){
                        //             filterChartData(sideType, item.typeName)
                        //         }
                        //     }}>{Array.isArray(item.data) && item.data.length>0?'查看构件数量':"构件数为0"}
                        //     </td>
                        // </tr>
                        td.push(
                            <div key={index} className={"site-superstructure"+(selectTitle.length> 0 && selectTitle[sindex].curIndex===index?" active":"")}
                                 style={Array.isArray(item.data) && item.data.length > 0 ? {} : {
                                     color: '#737373',
                                     cursor: 'default'
                                 }} onClick={() => {
                                let titTemp = JSON.parse(JSON.stringify(selectTitle))
                                titTemp[sindex].curIndex = index
                                setSelectTitle(titTemp)
                                if (Array.isArray(item.data) && item.data.length > 0) {
                                    filterChartData(sideType, item.typeName)
                                }
                            }}
                            >
                                {item.typeName}(共{item.siteAmount}跨)
                            </div>
                        )

                    })
                    table.push(<div key={sideType} className={"sidetype-wrap"}>
                        {sideType}：{td}
                    </div>)
                }
                memberTable.push(table)
            }
            return memberTable//.reverse()
        }
        return null
    }

    useEffect(() => {
    }, [bridgeId])

    return (
        <div>
            <div className="member-table-wrap" style={{marginBottom: 10}}>
                {memberData ? createTable() : null}
            </div>
            <div style={{display: 'flex'}}>
                {title.map((item, index) => <div key={index} style={{textAlign: 'center', flex: 1}}>{item}</div>)}
            </div>
            <Skeleton loading={loading}>
                <div>
                    {chart && datalist && datalist.length > 0 ? null : <Empty/>}
                    <div id="BridgeMemberStats"/>
                </div>
            </Skeleton>
            <MemberList
                visible={memberListVisible.visible}
                member={memberListVisible.data}
                siteList={siteList}
                onCancel={()=>{
                    setMemberListVisible({visible: false, data:{}})
                }}
            />
        </div>

    )
}

export default BridgeMemberStats;