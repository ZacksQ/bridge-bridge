import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import { Button, Input, message, Form, Select, Modal, Popover } from "antd";
import * as Icon from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth, setAuth } from "../../store/action/AuthAction";
import UserClient from "../../client/system/UserClient";
import DraggableModal from "../component/modal/DraggableModal";
import RoadSwitchClient from "../../client/roadSwitchClient/roadSwitchClient";
import PaginationTable from "../component/table/PaginationTable";
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import ChangePwdForm from './ChangePwdForm'
import logo from '../../../resources/img/logo-top.png'
import "./app_header.css";
import DictionaryClient from "../../client/param/DictionaryClient";

const { Search } = Input;

const AppHeader = ({ onRef }) => {
    //组件状态
    const [form] = Form.useForm()
    const [pwdFormVisible, setPwdFormVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [roadFormData, setRoadFormData] = useState({})
    const [roadData, setRoadData] = useState({
        pageNum: 1,
        pageSize: 10,
        pname: ''
    })
    const [selectRowsIds, setSelectRowsIds] = useState([])
    const [roadTypeList, setRoadTypeList] = useState([])
    const [roadEditFormVisible, setRoadEditFormVisible] = useState(false)
    const [userActionVisible, setUserActionVisible] = useState(false);
    const onCancel = () => {
        // message.error("关闭提示语")
        setVisible(false)
    }

    useImperativeHandle(onRef, ()=>{
        return {
            setVisible
        }
    })

    const columns = [
        {
            title: "序号", key: "index", dataIndex: "index", width: 40,
            align: 'center', render(text, record, index) {
                return index + roadData.pageNum * roadData.pageSize + 1 - roadData.pageSize
            }
        },
        { title: "项目全称", key: "pname", dataIndex: "pname", width: 200 },
        {
            title: "路线名称", key: "typeStr", dataIndex: "typeStr", width: 60,
            align: 'center'
        },
        {
            title: "操作", key: "action", dataIndex: "action", align: 'center', width: 120, render(text, record) {
                return <>
                    <Button type="link" onClick={() => {
                        setRoadEditFormVisible(true)
                        setRoadFormData(record)
                    }}>编辑</Button>
                    <Button disabled={!!record.curRid} type="link" onClick={() => { switchRoad(record.rid, record.pname) }}>进入项目</Button>
                </>
            }
        },

    ];

    const switchRoad = (rid, pname) => {
        setLoading(true)
        RoadSwitchClient.switchRoad(rid).then(res => {
            if (res.code === 0) {
                // fetchRoadSwitchData(roadData)
                setVisible(false)
                message.success("路线切换中...")
                dispatch(setAuth({...auth, rid, pname}))
                setTimeout(() => { window.location.reload() }, 1000)
            } else {
                message.error(res.resultNote)
            }
        }).finally(() => setLoading(false))
    }

    const fetchRoadSwitchData = (params) => {
        RoadSwitchClient.getRoadList(params).then(res => {
            if (res.code == 400) {
                dispatch(clearAuth())
            } else if (res.code === 0) {
                setRoadData({ ...params, data: res.data })
            }
        })
    }

    const fetchRoadTypeList = () => {
        DictionaryClient.getDictionaryGroupById('route_type').then(res => {
            if (res.code === 0) {
                setRoadTypeList(res.data)
            }
        })
    }

    useEffect(() => {
        fetchRoadSwitchData(roadData)
        fetchRoadTypeList()
    }, [])

    useEffect(() => {
        if (roadEditFormVisible === false) {
            setRoadFormData({})
            form.resetFields()
        } else if (roadEditFormVisible === true && roadFormData && roadFormData.rid) {
            form.setFieldsValue(roadFormData)
        }

    }, [roadEditFormVisible])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRowsIds([...selectedRowKeys])
        },
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //   name: record.name,
        // }),
    };

    const onSearch = value => {
        let params = { ...roadData, pname: value }
        fetchRoadSwitchData(params)
    }
    const ref = useRef(null);
    //全局状态
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const loginOut = () => {
        UserClient.loginOut().then(async () => {
            await localStorage.removeItem("LOGIN_INFO")
            dispatch(clearAuth())
        })

    }

    const submitForm = () => {
        form.validateFields().then(values => {
            let postData = { rid: '', ...roadFormData, ...values }
            RoadSwitchClient.editRoad(postData).then(res => {
                if (res.code === 0) {
                    setRoadEditFormVisible(false)
                    // fetchRoadSwitchData(roadData)
                    message.success("新建成功")
                    let newId = res.data
                    switchRoad(newId, values.pname)
                } else {
                    message.error(res.resultNote)
                }
            })
        })
    }

    const delRoads = () => {
        if (selectRowsIds.length > 0) {
            Modal.confirm({
                title: "提示",
                icon: <ExclamationCircleOutlined />,
                content: '确认删除所选路线？',
                cancelButtonProps: {
                    style: {
                        float: "right",
                        marginLeft: 10
                    }
                },
                onOk() {
                    const ids = { ridList: selectRowsIds }
                    RoadSwitchClient.delRoad(ids).then(res => {
                        if (res.code === 0) {

                            fetchRoadSwitchData(roadData)
                        } else {
                            message.error(res.resultNote)
                        }
                    })
                }
            })
        } else {
            message.error("未选择删除路线")
        }
    }

    const getUserActions = () => {
        return (
            <div className="select-wrapper">
                {/* <span className="icon-txt">{auth.username}</span>
                <Divider className="divider"/> */}
                <ul className="select" style={{marginBottom: 0}}>
                    <li onClick={() => {setUserActionVisible(false);setPwdFormVisible(true)}}>修改密码</li>
                    {/* <li onClick={() => dispatch(clearAuth())}><Icon.PoweroffOutlined className="icon" />退出登录</li> */}
                </ul>
            </div>
        )
    };

    /** 渲染应用头部 */
    return (
        <>
            <header className="app-header">
                <nav className="nav-bar">
                    <span>
                        <img src={logo} className="logo-top" alt="" />
                    </span>
                    <span className="divied"></span>
                    <span className="sys-name">桥梁智能设计系统</span>
                    <div className="pull-right">
                        <p onClick={() => { setVisible(true) }}><Icon.SwapOutlined className="top-icon" /> <span className="icon-txt">{auth.pname?auth.pname: "路线切换"}</span></p>
                        <p><Popover
                            visible={userActionVisible}
                            trigger="click"
                            content={getUserActions}
                            overlayStyle={{ padding: 0, margin: 0 }}
                            onVisibleChange={setUserActionVisible}
                            placement="bottom">
                            <span className="icon-txt">{auth.username}</span>
                            {/* <Icon.UserOutlined className="action expand"/> */}
                        </Popover>
                            {/* <span className="icon-txt">{auth.username}</span> */}
                        </p>

                        <p><Icon.PoweroffOutlined className="top-icon" onClick={loginOut} /></p>
                    </div>
                </nav>
                <ChangePwdForm visible={pwdFormVisible} onOk={() => setPwdFormVisible(false)} onCancel={() => setPwdFormVisible(false)} />
            </header>
            <DraggableModal
                visible={visible}
                title={"路线切换"}
                footer={null}
                width={850}
                height={620}

                onCancel={onCancel}>
                <div className="toolbar">
                    <Search className="road-search" size="small" placeholder="请输入项目名称" onSearch={onSearch} enterButton style={{ width: "250px" }} />

                    <div className="pull-right ">
                        <Button type="primary" size={"small"} icon={<PlusOutlined />} onClick={() => {
                            setRoadEditFormVisible(true)
                        }} style={{ marginRight: 10 }} >
                            新建
                        </Button>
                        <Button danger size={"small"} onClick={delRoads} icon={<DeleteOutlined />} >
                            删除
                        </Button>
                    </div>
                </div>
                <PaginationTable
                    rowKey="rid"
                    loading={loading}
                    pageData={roadData}
                    size="small"
                    columns={columns}
                    style={{ height: 540 }}
                    scroll={{ x: '100%', y: 500 }}
                    pagination={false}
                    rowSelection={{
                        ...rowSelection,
                    }}
                />
                <div className="record-count">
                    共<span>{roadData.data && roadData.data.length ? roadData.data.length : 0}</span>条记录
                </div>
            </DraggableModal>
            <DraggableModal
                visible={roadEditFormVisible}
                title={"路线切换"}
                width={650}
                onOk={form.submit}
                onCancel={() => { setRoadEditFormVisible(false) }}>
                <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
                    // initialValues={initialData}
                    onFinish={submitForm}>
                    <Form.Item label="项目全称" name="pname" rules={[{ required: true, message: "项目全称不能为空" }]}>
                        <Input style={{ width: "100%" }} placeholder="输入项目全称"
                            rules={[{ required: true, message: "项目全称不能为空" }]} />
                    </Form.Item>
                    <Form.Item label="路线名称" name="type" rules={[{ required: true, message: "路线名称不能为空" }]}>
                        <Select placeholder="选择路线名称" allowClear>
                            {roadTypeList.map(d => (
                                <Select.Option key={d.key} value={d.key}>{d.value}</Select.Option>))}
                        </Select>
                    </Form.Item>
                </Form>
            </DraggableModal>
        </>
    )
};

export default AppHeader;