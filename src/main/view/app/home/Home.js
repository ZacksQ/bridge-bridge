import React, { useState, useEffect } from "react";
import { Input, Pagination, Button, Spin, message } from "antd";
import PaginationTable from "../../component/table/PaginationTable";
import Card from "../../component/card/Card";
import './index.css'
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import clientHome from "../../../client/home/home";
import BridgeExpForm from "./BridgeExpForm";
import DictionaryClient from "../../../client/param/DictionaryClient";
import { API_PREFIX, SERVER_URL } from '../../../config'
import DeleteButton from "../../component/button/DeleteButton";
import { useSelector } from "react-redux";

const Home = () => {
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [addFormVisible, setAddFormVisible] = useState(false)
    const [provinceList, setProvinceList] = useState([])
    const [specialUpperList, setSpecialUpperList] = useState([])
    const [highwayClassify, setHighwayClassify] = useState([])
    const [selectRowsIds, setSelectRowsIds] = useState([])
    const auth = useSelector(state => state.auth);
    let permissions = auth.permissions

    const fetctBridgeExpData = () => {
        clientHome.getBridgeExpData().then(res => {
            if (res.code === 0) {
                setTableData(res.data)
            } else {
                message.error(res.resultNote)
            }
        })
    }

    const fetchDictionaryList = (param, f) => {
        DictionaryClient.getDictionaryGroupById(param).then(res => {
            if (res.code === 0) {
                f(res.data)
            } else {
                message.error(res.resultNote)
            }
        })
    }


    useEffect(() => {
        fetctBridgeExpData()
        fetchDictionaryList("highway_classify", setHighwayClassify)
        fetchDictionaryList("special_upper", setSpecialUpperList)
        fetchDictionaryList("explain_province", setProvinceList)
    }, [])
    //表格列
    const columns = [
        {
            title: "序号",
            key: "no",
            dataIndex: "no",
            width: 40,
            align: 'center',
            // className: 'grey',
            render(_, r, index) { return index + 1 }
        },
        {
            title: "项目名称",
            key: "name",
            dataIndex: "name",
            width: 250,
            // align: 'center'
        }, {
            title: "所在省份",
            key: "provinceStr",
            dataIndex: "provinceStr",
            width: 150,
            align: 'center'
        }, {
            title: "公路分级",
            key: "highwayClassifyStr",
            dataIndex: "highwayClassifyStr",
            width: 100,
            align: 'center'

        },
        {
            title: "特殊上部结构",
            key: "specialUpperStr",
            dataIndex: "specialUpperStr",
            width: 100,
            align: 'center'

        },
        {
            title: "操作", key: "action", fixed: "right", width: 150, align: "center", render: (text, record) => {
                return (<div>
                    <Button
                        size="small" type="link" onClick={() => { window.open(`${SERVER_URL}/bridge/explain/download?id=${record.id}`) }}>下载</Button>
                </div>)
            }
        }
    ];

    const handleSave = () => {
        setAddFormVisible(false)
        fetctBridgeExpData()
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRowsIds([...selectedRowKeys])
        }
    };

    const handleDelete = () =>{
        if(selectRowsIds.length>0){
            clientHome.delBridgeExp({idList: selectRowsIds}).then(res=>{
                if(res.code == 0){
                    message.success("删除成功")
                    fetctBridgeExpData()
                    setSelectRowsIds([])
                }else{
                    message.error(res.resultNote)
                }
            })
        }else{
            message.error("未选择要删除的记录")
        }
    }

    return (
        <Card style={{ width: "100%" }} title="桥梁说明概览" extra={permissions &&<>
            <Button size="small" icon={< PlusOutlined />} type="primary" onClick={() => { setAddFormVisible(true) }} style={{marginRight: 10}}>新建</Button>
            <DeleteButton onConfirm={() => handleDelete()} type="ghost" danger icon={<DeleteOutlined />} >删除</DeleteButton>
            </>}>
            <PaginationTable
                size="small"
                rowKey="id"
                loading={loading}
                pageData={{ data: tableData }}
                columns={columns}
                rowSelection={{
                    ...rowSelection,
                }}
            // onChange={handleChange}
            />
            <div className="note" style={{ color: '#f00', marginTop: 10 }}>注：常规上部结构包括：空心板、组合箱梁、40cm以下跨径的现浇箱梁，其余均为特殊上部结构</div>

            <BridgeExpForm
                visible={addFormVisible}
                provinceList={provinceList}
                specialUpperList={specialUpperList}
                highwayClassify={highwayClassify}
                onOk={handleSave}
                onCancel={() => setAddFormVisible(false)} />
        </Card>

    )
}
export default Home;