import React, {useEffect, useState} from "react";
import {Button, Divider, Table, Tooltip } from "antd";
import DeleteButton from "../../../component/button/DeleteButton";
import Card from "../../../component/card/Card";
import Toolbar from "../../../component/toolbar/Toolbar";
import {PlusOutlined} from "@ant-design/icons";
import {useParams} from "react-router";
import Archives from "../../../../client/bridge/Archives";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import BaseClient from "../../../../client/BaseClient";
import {toDate} from "../../../../util/DateUtils";
import {ALIOSS_URL} from '../../../../config'

const ArchivesId = ({bridgeId}) => {
   
    //组件状态   
    const [current, setCurrent] = useState(1);
    const [pagesize, setPagesize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [bridge, setBridge] = useState({});
    const [lableData, setlableData] = useState({});
    const [str, setStr] = useState('');
    const [bridgeSideForm, setBridgeSideForm] = useState({visible: false, initialData: undefined,title:'',uploadVisible:true});
    const [options,setOptions] = useState([
        {
          value: 1,
          text: '设计图纸'
        },
        {
          value: 2,
          text: '设计文件'
        },
        {
          value: 3,
          text: '施工文件'
        },
        {
          value: 4,
          text: '竣工文件'
        },
        {
          value: 5,
          text: '验收文件'
        },
        {
          value: 6,
          text: '行政文件'
        },
        {
          value: 7,
          text: '定期检查报告'
        },
        {
          value: 8,
          text: '特殊检查报告'
        },
        {
          value: 9,
          text: '历次维修资料'
        },
        {
            value: 10,
            text: '竣工图纸'
        },
      ]);
    const [yaerOption, setYaerOption] = useState([]);
    //获取桥梁标签
    const fetchBridge = () => {
        BridgeBaseClient.getBridgeById(bridgeId).then(setBridge);
    };

    // 预览
    const yulan = (text) => {
        window.open(ALIOSS_URL+text.filePath);
    }
    const fetchBridge1 = (search) => {
        setLoading(true) 
        search = search ? search : `%7B"bridgeId"%3A%5B"${bridgeId}"%5D%7D`
        Archives.archivesList(`current=${current}&pageSize=${pagesize}&searchData=${search}`)
            .then((res) =>{
                setlableData(res)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    };
    //初始化数据
    useEffect(() => {
        fetchBridge();
        fetchBridge1(str);
        getYear()
    }, []);
    // 过滤年月日
    const fromat = (value) => {
        var now = new Date(value); 
        return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
    }
    // 下载前转换
    const funDownload = (content, filename) => {
        // 创建隐藏的可下载链接
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    };
    // 下载
    const downLoad = (text) => {
        funDownload(ALIOSS_URL + text.filePath,text.filePath)
    }
    // 分页
    const getList = (page, pagesize) => {
        setCurrent(page)
        setPagesize(pagesize)
    };
    // 筛选年份
    const getYear = () => {
        Archives.getYear(bridgeId).then(res => {
            var arr = []
            res.forEach((item) => {
                arr.push({
                    value:item,
                    text:item
                })
            })
            setYaerOption(arr)
        })
    };
    // 排序-筛选
    const handleChange = (pagination, filters, sorter) => {
        var str = {
            "bridgeId":[`${bridgeId}`]
        }
        if(sorter.order){
            str.column = [sorter.field == 'archivesType' ? 'archives_type' : 'archives_year']
            str.sort = [sorter.order == 'ascend' ? 'ASC' : 'DESC']
        } 
        if(filters.archivesType || filters.archivesYear){
            if(filters.archivesType && filters.archivesYear){
                str.archivesType = [...filters.archivesType]
                str.archivesYear = [...filters.archivesYear]
            }else if(filters.archivesType){
                str.archivesType = [...filters.archivesType]
            }else if(filters.archivesYear){
                str.archivesYear = [...filters.archivesYear]
            }
        }
        if(!str){
            setStr(null)
            fetchBridge1(str)
        }else{
            fetchBridge1(encodeURIComponent(JSON.stringify(str)))
            setStr(encodeURIComponent(JSON.stringify(str)))
        }
    };
    //表格列
    const columns = [
        {title: "文件编号", key: "archivesNo", dataIndex: "archivesNo", width: 150},
        {
            title: "资料类型", key: "archivesType", dataIndex: "archivesType", width: 120,
            sorter: true,
            filters: options,
            render: (text) => (
                <div>{options[text-1].text}</div>
            )
        },
        {title: "资料名称", key: "archivesName", dataIndex: "archivesName", width: 200},
        {
            title: "资料年份", key: "archivesYear", dataIndex: "archivesYear", width: 120,
            filters: yaerOption,
            sorter: true,
        },
        {title: "资料描述", key: "archivesDescribe", dataIndex: "archivesDescribe", width: 120,render: (text, record) => (
                <Tooltip title={text}>
                    <div style={{
                        width:120,
                        overflow:"hidden",
                        textOverflow:"ellipsis",
                        whiteSpace:"nowrap"
                    }}>{text}</div>
                </Tooltip>
            )},
        {title: "资料格式", key: "fileFormat", dataIndex: "fileFormat", width: 100},
        {title: "上传时间", key: "archivesDate", dataIndex: "archivesDate", width: 100,render: (text, record) => (
                <div>{fromat(text)}</div>
            )},
        {title: "操作", key: "action", width: 140, align: "center", flexd:'right',render: (text, record) => (
                <div>
                    {
                        record.fileFormat == 'png' || record.fileFormat == 'pdf' ? <Button size="small" type="link" onClick={() => yulan(record)}>预览</Button> : null
                    }
                    <Button size="small" type="link" onClick={() => downLoad(text)}>下载</Button>

                </div>
            )}
    ];
    return (
            <Table
                size="small"
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={lableData.data}
                onChange={handleChange}
                pagination={{
                    onChange: (page, pageSize) => getList(page, pageSize),
                    onShowSizeChange: (current, size) => getList(current, size),
                    data: undefined,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "30", "50", "100"],
                    total:lableData.total,
                    showTotal: (total, range) => `第${range[0]}~${range[1]}条，共${total}条`}}
                bordered />
    )
}

export default ArchivesId;