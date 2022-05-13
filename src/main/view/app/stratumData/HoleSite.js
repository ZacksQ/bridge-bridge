import React, { useEffect, useState, useRef, useContext, useImperativeHandle } from "react";
import { Button, Row, Col, message, Spin, Input, Form, Progress, Select, Alert, Table, InputNumber } from "antd";
import DeleteButton from "../../component/button/DeleteButton";
import Toolbar from "../../component/toolbar/Toolbar";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import StratumClient from "../../../client/stakeLength/StratumClient";
import DraggableModal from "../../component/modal/DraggableModal";
import StratumForm from "./StratumForm";
import { API_PREFIX, SERVER_URL } from '../../../config'
import { drillDefaultData, drillInfoDefaultData } from '../../defaultData'
import sha256 from 'crypto-js/sha256';
import CryptoJS from "crypto-js";
const EditableContext = React.createContext(null);
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    selectedBridgeId,
    inputType,
    recordData,
    dataList,
    drillData,
    setDrillLoading,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        if (record.defaultData != true) {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        }
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            let postData = {
                drillId: drillData.drillId,
                soilId: record.soilId || null,
                columnName: Object.keys(values)[0],
                cellValue: values[Object.keys(values)[0]]
            }
            console.log(postData)
            setDrillLoading(true)
            StratumClient.updateSingleDrillInfo(postData).then(res => {
                if (res.code == 0) {
                    handleSave({ ...record, ...values });
                } else {
                    message.error(res.resultNote)
                }
            }).finally(() => setDrillLoading(false))
        } catch (errInfo) {
            console.log('保存失败:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        let inputNode = null
        switch (inputType) {
            case "number":
                inputNode = <InputNumber precision={0} min={0} ref={inputRef} onPressEnter={save} onBlur={save} controls={false} style={{ width: '100%' }} />
                break
            case "select":
                inputNode = <Select ref={inputRef} onBlur={save} >
                    {dataList.map(d => <Select.Option value={d.value} key={d.value} >{d.text}</Select.Option>)}
                </Select>
                break
            case "double":
                inputNode = <InputNumber precision={1} min={0} ref={inputRef} onPressEnter={save} onBlur={save} controls={false} style={{ width: '100%' }} />
                break
            case "string":
                inputNode = <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                break
            default:
                inputNode = children
                break
        }

        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
            // rules={[
            //     {
            //         required: true,
            //         message: `${title} is required.`,
            //     },
            // ]}
            >
                {inputNode}
            </Form.Item>
        ) : (
            <div
                className={"editable-cell-value-wrap"}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    
    return dataIndex == "drillHeight"||dataIndex=="pileNumber" ? childNode : <td {...restProps} className={"ant-table-cell" + (record && record.defaultData == true ? " quiet" : "")+ (editable == true ? "" : " grey")}>{childNode}</td>;
};

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableDiv = (props) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <EditableCell {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const HoleSite = ({ onRef }) => {

    const [form] = Form.useForm();
    //组件状态
    const [loading,
        setLoading] = useState(false);

    const [holeData,
        setHoleData] = useState([]
            // pageNum: 1, pageSize: 10 
        );
    const [stratumForm,
        setStratumForm] = useState({ visible: false, initialData: undefined });
    const [uploadHoleModalVisible, setUploadHoleModalVisible] = useState(false)
    const [uploadSingleSiteModalVisible, setUploadSingleSiteModalVisible] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)

    const [imgLoading, setImgLoading] = useState(false)
    const [drillId, setDrillId] = useState('')
    const [uploadProgress, setUploadProgress] = useState(-1)
    const [imgSrc, setImgSrc] = useState('')
    const [drillData, setDrillData] = useState({})
    const [drillLoading, setDrillLoading] = useState(false)
    // const isEditing = (record) => record.id === editingKey;
    useImperativeHandle(onRef, () => {
        return {
            setUploadHoleModalVisible,
            setUploadSingleSiteModalVisible,
            setDrillId,
            fetchHoleData,
            setDrillData
        }
    })
    let uploadStatusTimer = null
    //获取用户数据
    const fetchHoleData = () => {
        setLoading(true);
        StratumClient.getDrillList()
            .then(res => {
                if (res.code === 0) {
                    setHoleData(res.data)
                } else {
                    message.error(res.resultNote)
                }
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (uploadSingleSiteModalVisible === false) {
            setUploadProgress(-1)
        }
    }, [uploadSingleSiteModalVisible])

    //初始化
    useEffect(() => {
        fetchHoleData()
    }, []);


    const handleSave = () => {
        setStratumForm({ visible: false, initialData: undefined });

    };
    //处理删除imgSrc
    const handleDelete = record => {
        let drillId = record.drillId
        setLoading(true)
        StratumClient.delHole(drillId).then(res => {
            if (res.code === 0) {
                const dataSource = [...holeData];
                setHoleData(dataSource.filter(item => item.drillId !== drillId));
                if (record.imgFileId === imgSrc) {
                    setImgSrc("")
                }
            } else {
                message.error(res.resultNote)
            }
        }).finally(() => setLoading(false))
    };

    const showPic = imgFileId => {
        // let img = new Image()
        // setImgLoading(true)
        // img.onload = function () {
        //     let img_wrap = document.querySelector(".hole-img-wrap")
        //     setImgLoading(false)
        //     if (img_wrap) {
        //         let hole_img = document.querySelector(".hole-img-wrap img")
        //         if (hole_img) {
        //             img_wrap.removeChild(hole_img)
        //         }
        //         img_wrap.appendChild(img)
        //     }
        // }
        // img.src = `${SERVER_URL}/pile-len/calc/geology/view?imgFileId=${imgFileId}`
        if (imgFileId) {
            setImgSrc(imgFileId)
        } else {
            message.warn("暂无数据")
        }
    }

    const holeFileOnChange = (info) => {
        const { status } = info.file;
        if (status == 'uploading') {
            setUploadLoading(true)
        }
        if (status === 'done') {
            if (info.file.response.code === 0) {
                message.success(`${info.file.name} 数据已成功上传.`);
                setUploadHoleModalVisible(false)
                fetchHoleData(holeData)
            } else {
                message.error(`${info.file.name} 上传失败.${info.file.response.resultNote}`)
            }
            setUploadLoading(false)
        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            setUploadLoading(false)
        }
    }

    const columns = [
        {
            title: "序号",
            key: "no",
            dataIndex: "no",
            width: 40, align:
                "center",
            className: "grey", render(text, record, index) {
                return <div className={record && record.defaultData == true ? "quiet" : ""}>{index + 1}</div>
            }
        },
        {
            title: "钻孔编号",
            key: "drillNum",
            dataIndex: "drillNum",
            width: 50, align:
                "center",
            // className: "grey"
            render(text, record) {
                return <div className={record && record.defaultData == true ? "quiet" : ""}>{text}</div>
            }
        },
        {
            title: "钻孔桩号",
            key: "pileNumber",
            dataIndex: "pileNumber",
            width: 50, align:
                "center", render(text, record) {
                    return <div className={record && record.defaultData == true ? "quiet" : ""}>{text}</div>
                }
        },
        {
            title: "操作", key: "action", width: 50, align:
                "center", render: (text, record) => {

                    return (<div className={record && record.defaultData == true ? "quiet" : ""}>
                        <Button
                            size="small" type="link" onClick={() => {
                                // showPic(record.imgFileId)
                                if (record.defaultData != true) {
                                    setDrillLoading(true)
                                    getDrillData(record.drillId).finally(() => setDrillLoading(false))
                                }
                            }}>查看</Button>

                        {/* <Button
                            size="small" type="link" onClick={() => {
                                setUploadSingleSiteModalVisible(true)
                                setDrillId(record.drillId)
                            }}>覆盖</Button>

                        <DeleteButton
                            onConfirm={() => handleDelete(record)} /> */}
                    </div>)
                }
        }
    ]

    const drillColumns = [
        {
            title: "序号",
            key: "no",
            dataIndex: "no",
            width: 30, align:
                "center",
            className: "grey", render(text, record, index) {
                return index + 1
            }
        },
        {
            title: "地层编号",
            key: "soilNumber",
            dataIndex: "soilNumber",
            width: 50, align:
                "center",

        },
        {
            title: "层底深度",
            key: "depth",
            dataIndex: "depth",
            width: 50, align:
                "center",
            editable: true,
            inputType: "string",
        },
        {
            title: "层底高程",
            key: "height",
            dataIndex: "height",
            width: 50, align:
                "center"
        },
        {
            title: "层厚",
            key: "thickness",
            dataIndex: "thickness",
            width: 40, align:
                "center"
        },
        {
            title: "岩土名称及其特征",
            key: "description",
            dataIndex: "description",
            width: 150, align:
                "center"
        },
        {
            title: <span style={{ fontSize: 12 }}>承载力基本<br />容许值[f<sub>a0</sub>]/kPa</span>,
            key: "fa0",
            dataIndex: "fa0",
            width: 80, align: "center",
            editable: true,
            inputType: "number", render(text) {
                if (text == 0) {
                    return "/"
                } else {
                    return text
                }
            }
        },
        {
            title: <span style={{ fontSize: 12 }}>钻孔桩侧壁摩阻力<br />标准值[q<sub>ik</sub>]/kPa</span>,
            key: "qik",
            dataIndex: "qik",
            width: 80, align: "center", editable: true,
            inputType: "number", render(text) {
                if (text == 0) {
                    return "/"
                } else {
                    return text
                }
            }
        },
        {
            title: "备注", key: "remarks", dataIndex: "remarks", width: 40, align: "center",editable: true,
            inputType: "string"
        }
    ]



    /*切割文件方法*/
    function sliceFiles(file, num, drillId) {
        setUploadLoading(true)
        let singleSize = Math.ceil(file.size / num);
        let location = 0;
        let findex = 1
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async function () {
            var wordArray = CryptoJS.lib.WordArray.create(reader.result);
            var hash = sha256(wordArray).toString();
            while (location < file.size) {
                let fileSize = file.size
                let signleSize = location + singleSize
                // if(findex===num) signleSize = fileSize 
                // fileList.push(file.slice(location, location + singleSize));
                let sf = file.slice(location, signleSize)
                if (findex === num) signleSize = fileSize - 1
                let singleFile = await uploadFileSingle(sf, file.name, [{ header: "Content-Range", value: `bytes ${location}-${signleSize}/${fileSize}` },
                { header: "SHA256", value: hash }], findex, num, drillId)

                //查询分片上传情况
                if (findex === num) {
                    if (singleFile && singleFile.code === 0) {
                        uploadStatusTimer = setInterval(() => { getUploadProgress(singleFile.data) }, 1000)
                    } else {
                        message.error(singleFile.resultNote)
                    }
                }
                location += singleSize;
                findex++
            }
        }
    }

    const getUploadProgress = taskId => {
        StratumClient.getUploadProcess(taskId).then(res => {
            if (res.code === 0) {
                setUploadProgress(res.data)
                if (res.data == 100) {
                    clearInterval(uploadStatusTimer)
                    fetchHoleData()
                    setTimeout(() => {
                        setUploadSingleSiteModalVisible(false)
                    }, 2000)
                }
            } else {
                message.error(res.resultNote)
                setUploadSingleSiteModalVisible(false)
                clearInterval(uploadStatusTimer)
            }
        })
    }

    async function uploadFileSingle(file, filename, extHeader, index, num, drillId) {
        // await return new Promise(async function (resolve, reject) {
        let postData = { file, filename }
        if (drillId) {
            postData.drillId = drillId
        }
        return await StratumClient.uploadSliceFile(postData, true, extHeader).then(res => {
            if (index === num) {
                setUploadLoading(false)
                // setUploadSingleSiteModalVisible(false)
                fetchHoleData()
            }
            return res
        })
        // })
    }

    const uploadSliceFiles = e => {
        sliceFiles(e.file, 2, drillId)
    }

    const getDrillData = drillId => {
        return StratumClient.getSingleDrillInfo(drillId).then(res => {
            if (res.code == 0) {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setDrillData(res.data[0])
                }
            } else {
                message.error(res.resultNote)
            }
        })
    }

    const mergedDrillColumns = drillColumns.map((col) => {
        // if (!col.editable) {
        //     return col;
        // }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editable: col.editable,
                dataList: col.dataList,
                drillData: drillData,
                setDrillLoading: setDrillLoading,
                // editing: isEditing(record),
                handleSave: handleDataSave,
            }),
        };
    });

    const handleDataSave = (row) => {
        if (row.soilId) {
            const newData = [...drillData.soilList];
            const index = newData.findIndex((item) => row.soilId === item.soilId);
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setDrillData({ ...drillData, soilList: [...newData] })
        }else {
            const newData = {...drillData, ...row};
            setDrillData(newData)
        }
    }

    return (<>
        <Row gutter={10}>
            <Col span={6}>
                <div className="hole-list-wrap">
                    <Table
                        size="small"
                        dataSource={holeData.length == 0 ? drillDefaultData : holeData}
                        bordered
                        loading={loading}
                        rowKey={"drillId"}
                        // style={{height: 700}}
                        columns={columns}
                        pagination={false}
                        scroll={{
                            // x: "100%",
                            y: 600
                        }}
                    />
                </div>
            </Col>
            <Col span={18}>
                <div className="drilltable-wrap">
                    <div className="dirll-data-wrap">
                        <div className="data">
                            钻孔编号：<div style={{ padding: "5px 12px" }}>{drillData.drillNum}</div>
                        </div>
                        <div className="data">
                            孔口高程：{EditableDiv({ children: drillData.drillHeight, dataIndex: "drillHeight", editable: true, inputType: 'string', record: { drillHeight: drillData.drillHeight }, drillData: drillData, setDrillLoading, drillId: drillData.drillId, handleSave: handleDataSave })}
                        </div>
                        <div className="data">
                            钻孔桩号：{EditableDiv({ children: drillData.pileNumber, dataIndex: "pileNumber", editable: true, inputType: 'string', record: { pileNumber: drillData.pileNumber }, drillData: drillData, setDrillLoading, drillId: drillData.drillId, handleSave: handleDataSave })}
                        </div>
                        <div className="data">
                            偏移量：<div style={{ padding: "5px 12px" }}>{drillData.offsetStr}</div>
                        </div>
                    </div>
                    <Table
                        size="small"
                        dataSource={drillData.soilList && drillData.soilList.length != 0 ? drillData.soilList : drillInfoDefaultData}
                        bordered
                        rowClassName={() => 'editable-row'}
                        components={{
                            body: {
                                row: EditableRow,
                                cell: EditableCell,
                            }
                        }}
                        loading={drillLoading}
                        rowKey={"soilId"}
                        // style={{height: 700}}
                        columns={mergedDrillColumns}
                        pagination={false}
                        scroll={{
                            // x: "100%",
                            y: 500
                        }}
                    />
                </div>
                {/* <Spin spinning={imgLoading}>
                    <div className="hole-img-wrap">
                        {imgSrc && <Image
                            width={"100%"}
                            src={`${SERVER_URL}/pile-len/calc/geology/view?imgFileId=${imgSrc}`}
                        />}
                    </div>
                </Spin> */}
                {/* {imgSrc && <img src={imgSrc} alt="" id="hole-img" style={{width: "100%"}} />} */}
            </Col>
        </Row>
        <DraggableModal
            visible={uploadHoleModalVisible}
            title={"孔位桩号上传"}
            width={650}
            footer={null}
            // onOk={form.submit}
            onCancel={() => { setUploadHoleModalVisible(false) }}>
            <Dragger action={API_PREFIX + '/pile-len/calc/hole-list/upload'}
                maxCount={1}
                onChange={holeFileOnChange}>
                <Spin spinning={uploadLoading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖动到此处上传</p>
                </Spin>
            </Dragger>
        </DraggableModal>
        <DraggableModal
            visible={uploadSingleSiteModalVisible}
            title={"单孔信息上传"}
            width={650}
            // onOk={form.submit}
            footer={null}
            onCancel={() => { setUploadSingleSiteModalVisible(false) }}>
            <Dragger
                // action={'/api/pile-len/calc/hole-info/upload'}
                customRequest={uploadSliceFiles}
                maxCount={1}
                progress={{
                    strokeWidth: 1,
                    trailColor: "#fff",
                    format: function () { return '' }
                }}
            // onChange={fileOnChange}
            >
                <Spin spinning={uploadLoading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖动到此处上传</p>

                    {uploadProgress > -1 && <>文件解析进度：<Progress percent={uploadProgress} style={{ width: "70%" }} />

                    </>}
                </Spin>
            </Dragger>
            {uploadProgress > -1 && <Alert
                style={{ marginTop: 20 }}
                message="文件解析中，请勿关闭弹窗！"
                type="warning"
                showIcon
            />}
        </DraggableModal>
        <StratumForm
            visible={stratumForm.visible}
            userData={stratumForm.initialData}
            onOk={handleSave}
            onCancel={() => setStratumForm({ visible: false, initialData: undefined })} />
    </>
    );
};

export default HoleSite;