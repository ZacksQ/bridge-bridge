import React, { useEffect, useState } from "react";
import { Table, Radio, DatePicker, Input } from "antd";
import Card from "../../../component/card/Card";
import { useHistory, useParams } from "react-router";
import Archives from "../../../../client/bridge/Archives";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import { toDate } from "../../../../util/DateUtils";
const { MonthPicker, } = DatePicker;
let t
let data
const ArchivesDtail = () => {

    //路由参数
    const { bridgeId } = useParams();
    //组件状态 
    const [current, setCurrent] = useState(1);
    const [radioValue, setRadioValue] = useState(undefined);
    const [list, setList] = useState({});
    const [pagesize, setPagesize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [bridge, setBridge] = useState({});
    const [lableData, setlableData] = useState([]);
    const [bridgeCopyForm, setBridgeCopyForm] = useState({ visible: false, bridgeSideId: undefined });
    //获取桥梁标签
    const fetchBridge = () => {
        BridgeBaseClient.getBridgeById(bridgeId).then(setBridge);
    };
    const fetchBridge1 = () => {
        setLoading(true)
        Archives.bridgesList(bridgeId)
            .then((res) => {
                setList(res ? res : {
                    bridgeId,
                    saveFile: '无',
                    designPaper: '无',
                    designFile: '无',
                    constructFile: '无',
                    completionFile: '无',
                    acceptFile: '无',
                    administrativeFile: '无',
                    regularReport: '无',
                    specialReport: '无',
                    repiarRecord: '无',
                })
                setlableData([
                    { title: '档案号', action: res.fileNo, index: 0 },
                    { title: '建档年月', action: res.fileDate, index: 2 },
                    { title: '存档案', action: res.saveFile ? res.saveFile : '无', index: 1 },
                    { title: '设计图纸', action: res.designPaper ? res.designPaper : '无', index: 3 },
                    { title: '设计文件', action: res.designFile ? res.designFile : '无', index: 4 },
                    { title: '竣工文件', action: res.constructFile ? res.constructFile : '无', index: 5 },
                    { title: '竣工图纸', action: res.completionFile ? res.completionFile : '无', index: 6 },
                    { title: '验收文件', action: res.acceptFile ? res.acceptFile : '无', index: 7 },
                    { title: '行政文件', action: res.administrativeFile ? res.administrativeFile : '无', index: 8 },
                    { title: '定期检查报告', action: res.regularReport ? res.regularReport : '无', index: 9 },
                    { title: '特殊检查报告', action: res.specialReport ? res.specialReport : '无', index: 10 },
                    { title: '历次维修资料', action: res.repiarRecord ? res.repiarRecord : '无', index: 11 },
                ])
                setLoading(false)
            })

    };
    //初始化数据
    useEffect(() => {
        fetchBridge();
        fetchBridge1();
    }, []);
    useEffect(() => {
        // console.log(radioValue)
        if (radioValue) {
            fetchBridge2();
        }
    }, [radioValue]);

    const fetchBridge2 = () => {
        Archives.bridgespost(radioValue).then(() => fetchBridge1())
    }
    const handleCopy = () => {
        setBridgeCopyForm({ visible: false });
    }
    const onChange = (e, record, dateString) => {
        let obj = list
        if (record.index == 0) {
            obj.fileNo = e
        } else if (record.index == 1) {
            obj.saveFile = e.target.value

        } else if (record.index == 2) {
            obj.fileDate = new Date(dateString).getTime()

        } else if (record.index == 3) {
            obj.designPaper = e.target.value

        } else if (record.index == 4) {
            obj.designFile = e.target.value

        } else if (record.index == 5) {
            obj.constructFile = e.target.value

        } else if (record.index == 6) {
            obj.completionFile = e.target.value

        } else if (record.index == 7) {
            obj.acceptFile = e.target.value

        } else if (record.index == 8) {
            obj.administrativeFile = e.target.value

        } else if (record.index == 9) {
            obj.regularReport = e.target.value

        } else if (record.index == 10) {
            obj.specialReport = e.target.value

        } else if (record.index == 11) {
            obj.repiarRecord = e.target.value

        }
        setRadioValue({ ...obj })
        // setRadioValue(e.target.value)
    };
    //表格列
    const columns = [
        { title: "文件类型", key: "title", dataIndex: "title", width: 150, align: "center" },
        {
            title: "是否齐全", key: "index", dataIndex: 'action', width: 200, align: "center", render: (text, record) => {
                // console.log(text)
                if (text === '全' || text === '不全' || text === '无') {
                    return (
                        <div>
                            <Radio.Group value={text} onChange={(e) => { onChange(e, record) }}>
                                <Radio style={{marginLeft:'10px'}}  value={'全'}>全</Radio>
                                <Radio style={{marginLeft:'40px'}}  value={'不全'}>不全</Radio>
                                <Radio style={{marginLeft:'40px'}}  value={'无'}>无</Radio>
                            </Radio.Group>
                        </div>
                    )
                } else if (record.index == 0) {
                    // record.action1 = toDate(record, "action");
                    data = text
                    return <input id="CSDN_NAME" onChange={(e) => {
                        data = document.getElementById("CSDN_NAME").value
                        clearTimeout(t);
                        t = setTimeout(function () {
                            onChange(document.getElementById("CSDN_NAME").value, record)
                        }, 1500)
                    }} defaultValue={data} style={{ width: 240 }} />
                } else if (record.index == 2) {
                    // return   <DatePicker value={record.action} onChange={onChange} style={{ width: 240}} showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" />
                    return <MonthPicker  defaultValue={toDate(record, 'action')} onChange={(e, dateString) => { onChange(e, record, dateString) }} style={{ width: 240 }} format="YYYY-MM" />
                }
            }
        }
    ];
    return (
        <Card title={bridge.bridgeName + "档案情况"} canBack>
            <Table
                size="small"
                rowKey="id"
                loading={loading}
                showHeader={false}
                columns={columns}
                dataSource={lableData}
                pagination={false}
                bordered />
        </Card>
    )
}

export default ArchivesDtail;