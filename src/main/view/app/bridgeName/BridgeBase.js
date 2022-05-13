import React, { useEffect, useState, useRef, useContext, useImperativeHandle } from "react";
import { Button, Row, Col, message, Input, Spin, Form, Select, Table, InputNumber, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import DraggableModal from "../../component/modal/DraggableModal";
import BridgeGroupClient from "../../../client/bridgeGroup/BridgeGroupClient";
import { API_PREFIX } from '../../../config'
const EditableContext = React.createContext(null);

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
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });

        } catch (errInfo) {
            console.log('保存失败:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        let inputNode = null
        switch (inputType) {
            case "number":
                inputNode = <InputNumber precision={0} min={0} ref={inputRef} onPressEnter={save} onBlur={save} controls={false} style={{ width: '100%' }}/>
                break
            case "select":
                inputNode = <Select ref={inputRef} onBlur={save} >
                    {dataList.map(d => <Select.Option value={d.value} key={d.value} >{d.text}</Select.Option>)}
                </Select>
                break
            case "double":
                inputNode = <InputNumber precision={1} min={0} ref={inputRef} onPressEnter={save} onBlur={save} controls={false} style={{ width: '100%' }}/>
                break
            default:
                inputNode = <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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
                className="editable-cell-value-wrap"
               
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const BridgeBase = ({ selectedBridgeId, onRef, refresh }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [bridgeBaseData, setBridgeBaseData] = useState({})
    const [originBridgeBaseData, setOriginBridgeBaseData] = useState({})
    const [uploadPileModalVisible, setUploadPileModalVisible] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [fileName, setFileName] = useState("")
    const [spanSum, setSpanSum] = useState(-1)
    const initValues = {
        // pierLenMore: 5, abutLenMore: 3, pierCarryMore: 500, abutCarryMore: 300
    }

    useImperativeHandle(onRef, () => {
        return { saveData }
    })

    // useEffect(() => {
    //     if (originBridgeBaseData.basicList && originBridgeBaseData.basicList.length > 0 && spanSum > -1) {
    //         // debugger
    //         let newBasicList = []
    //         originBridgeBaseData.basicList.forEach(item => {
    //             if (parseInt(item.pierNo) <= spanSum) {
    //                 newBasicList.push(item)
    //             }
    //         })
    //         setBridgeBaseData({ ...originBridgeBaseData, basicList: newBasicList })
    //     }
    // }, [spanSum])

    const getBridgeBaseInfo = (groupId, mark) => {
        setLoading(true)
        BridgeGroupClient.getBridgeBaseInfo(groupId).then(res => {
            if (res.code === 0 && res.data && Array.isArray(res.data)) {
                let formData = {}
                if (mark == true) {
                    let newBasicList = []
                    let sp = form.getFieldValue("spanComb")
                    let spsum = getSumSpanComb(sp)
                    res.data[0].basicList.forEach(item => {
                        if (parseInt(item.pierNo) <= spsum) {
                            newBasicList.push(item)
                        }
                    })
                    formData = { basicList: newBasicList, ...form.getFieldsValue() }
                } else {
                    formData = res.data[0]
                }

                setBridgeBaseData(formData)
                setOriginBridgeBaseData(formData)
                // if (!formData.pierLenMore) formData.pierLenMore = initValues.pierCarryMore
                // if (!formData.abutLenMore) formData.abutLenMore = initValues.abutLenMore
                // if (!formData.pierCarryMore) formData.pierCarryMore = initValues.pierCarryMore
                // if (!formData.abutCarryMore) formData.abutCarryMore = initValues.abutCarryMore
                form.setFieldsValue(formData)
            } else {
                message.error(res.resultNote)
            }
        }).finally(() => setLoading(false))
    }

    //初始化
    useEffect(() => {
        if (selectedBridgeId) {
            getBridgeBaseInfo(selectedBridgeId)
        }
    }, [selectedBridgeId]);

    const saveData = () => {
        // if (bridgeBaseData && bridgeBaseData.length > 0) {
        let originData = bridgeBaseData
        form.validateFields().then(values => {
            setLoading(true)
            if (values.pierLenMore == undefined) values.pierLenMore = 0
            if (values.abutLenMore == undefined) values.abutLenMore = 0
            if (values.pierCarryMore == undefined) values.pierCarryMore = 0
            if (values.abutCarryMore == undefined) values.abutCarryMore = 0

            BridgeGroupClient.saveBridgeBaseInfo({ ...originData, ...values, groupId: selectedBridgeId }).then(res => {
                if (res.code === 0) {
                    message.success("桥梁信息修改成功！")
                    refresh()
                } else {
                    message.error(res.resultNote)
                }
            }).finally(() => setLoading(false))
        })
        // }
    }

    const getPierNoListBySpanComb = spanComb => {
        return BridgeGroupClient.getBridgePierNoBySpanComb(spanComb).then(res => {
            return res
            // if (res.code === 0) {
            // let bl = originBridgeBaseData.basicList
            // let newBasicList = res.data.map(item=>{

            //     for(let index = 0; index< bl.length; index++){
            //         if(bl[index].pierNo === item.pierNo){
            //             break
            //         }
            //     }
            // })
            // setBridgeBaseData({ ...originBridgeBaseData, basicList: res.data })
            // } else {
            // message.error(res.resultNote)
            // }
        })
    }

    const factorySpanComb = () => {

        // try {
        form.validateFields(["spanComb"]).then(values => {
            let spanComb = values["spanComb"]
            // getPierNoListBySpanComb(spanComb).then(res => {
            //     // console.log(res)
            //     if (res.code == 0) {
            let newBasicList = []
            let spsum = getSumSpanComb(spanComb)
            console.log(spsum,bridgeBaseData.basicList)
            if (bridgeBaseData.basicList.length > spsum) {
                bridgeBaseData.basicList.forEach(item => {
                    if (parseInt(item.pierNo) <= spsum) {
                        newBasicList.push(item)
                    }
                })
            } else {
                newBasicList = [...bridgeBaseData.basicList]
                let remainRows = spsum - bridgeBaseData.basicList.length
                for (let index = 0; index <= remainRows; index++) {
                    newBasicList.push({
                        pierNo: (bridgeBaseData.basicList.length + index) + "#",
                        pileDiameter: 0,
                        pileInfoId: 0,
                        pileTopCoForce: 0,
                        pileTopHigh: 0
                    })
                }
            }
            setBridgeBaseData({ ...originBridgeBaseData, basicList: newBasicList })
            //     } else {
            //         message.error(res.resultNote)
            //     }
            // })

        })

        // } catch (error) {
        //     console.log(error)
        // }
    }

    let getSumSpanComb = spanComb => {
        let ss = null
        //计算墩台数
        let eachSpan = spanComb.split("+")
        let span = eachSpan.map(item => {
            if (item.indexOf("*") > -1) {
                let spanNum = 1
                if (item.indexOf("(") > -1) {
                    let each = item.split("*")
                    spanNum = parseInt(each[0].replaceAll(/\(|\)/g, "")) * parseInt(each[1].replaceAll(/\(|\)/g, ""))
                } else {
                    spanNum = parseInt(item.split("*")[0])
                }
                return spanNum
            } else {
                return 1
            }
        })
        let sumSpan = span.reduce((a, b) => a + b)

        if (!isNaN(sumSpan)) {
            setSpanSum(sumSpan)
            ss = sumSpan
        }
        return ss
    }

    const columns = [
        {
            title: "序号",
            key: "no",
            dataIndex: "no",
            width: 30, align: "center",
            className: "grey",
            render(text, record, index) {
                return index + 1
            }
        },
        {
            title: "墩台编号",
            key: "pierNo",
            dataIndex: "pierNo",
            width: 30,
            className: "grey",
            align: 'center'
        },
        {
            title: "桩顶反力",
            key: "pileTopCoForce",
            dataIndex: "pileTopCoForce",
            width: 80,
            inputType: "number", editable: true,
            align: 'center',
            render(text) {
                return text ? text : 0
            }
        },
        {
            title: "桩基直径",
            key: "pileDiameter",
            dataIndex: "pileDiameter", inputType: "double",
            align: 'center',
            width: 80, editable: true,
            render(text) {
                return text ? text : 0
            }
        },
        {
            title: "桩顶高程",
            key: "pileTopHigh",
            dataIndex: "pileTopHigh", inputType: "double",
            align: 'center',
            width: 80, editable: true,
            render(text) {
                return text ? text : 0
            }
        }
    ]

    const pileUpload = () => {
        form.validateFields(["spanComb"]).then(value => {
            setUploadPileModalVisible(true)
        })
    }

    const pileFileOnChange = (info) => {
        const { status } = info.file;
        if (status == 'uploading') {
            setUploadLoading(true)
        }
        setFileName(info.file.name)
        if (status === 'done') {
            if (info.file.response.code === 0) {
                message.success(`${info.file.name} 数据已成功上传.`);
                setUploadPileModalVisible(false)
                getBridgeBaseInfo(selectedBridgeId, true)
            } else {
                message.error(`${info.file.name} 上传失败.${info.file.response.resultNote}`)
            }
            setUploadLoading(false)
        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            setUploadLoading(false)
        }
    }

    const handleSave = (row) => {
        const newData = [...bridgeBaseData.basicList];
        const index = newData.findIndex((item) => row.pierNo === item.pierNo);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        let data = { ...bridgeBaseData, basicList: [...newData] }
        setBridgeBaseData(data)
        setOriginBridgeBaseData(data)
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const mergeColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
                inputType: col.inputType,
                dataList: col.dataList
            }),
        };
    });

    useEffect(()=>{
        if(uploadPileModalVisible==false){
            setFileName("")
        }
    }, [uploadPileModalVisible])

    return (
        <Spin spinning={loading}>
            <Form layout="vertical" form={form} initialValues={initValues}>
                <Row>
                    <Col span={8}>
                    <h3>
                    <svg t="1647152878130" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3367" width="20" ><path d="M977.90864966 908.02873983c-14.05263333 0-25.5502424-11.3698568-25.55024236-25.5502424v-703.52589357c0-3.44928307-2.81052531-6.25980836-6.25980836-6.25980832h-66.55837905c-3.44928307 0-6.25980836 2.81052531-6.25980835 6.25980832v704.16465137c0 13.66938006-11.11435581 24.9114846-24.9114846 24.9114846h-4.34354188c-13.92488108 0-25.2947379-11.3698568-25.29473792-25.29473795v-68.7301499c0-3.44928307-2.81052531-6.25980836-6.2598084-6.25980835H211.0181591c-3.44928307 0-6.25980836 2.81052531-6.25981177 6.25980835v68.7301499c0 13.92488108-11.3698568 25.2947379-25.29473793 25.29473795h-4.0880374c-13.92488108 0-25.2947379-11.3698568-25.29474134-25.29473795v-703.78139802c0-3.44928307-2.81052531-6.25980836-6.25980838-6.25980832h-66.68612778c-3.44928307 0-6.25980836 2.81052531-6.25981177 6.25980832v703.90914688c0 13.92488108-11.24210461 25.16698909-25.16698568 25.16698909h-4.21578964c-13.92488108 0-25.2947379-11.3698568-25.29473793-25.29473795v-716.04551367c0-26.82775447 21.84545481-48.5454571 48.54545711-48.54545707h95.3024c24.52823133 0 44.32966747 19.80143615 44.32966747 44.32966743v16.35215651c0 63.62010147 31.937803 123.9186687 90.06460268 169.39809947 57.99904746 45.47943077 135.16077671 70.64641643 216.92154888 70.64641639 81.76077216 0 158.79474921-25.03923685 216.92154552-70.64641639 58.1267997-45.47943077 90.06459927-105.77799799 90.06460272-169.39809947v-12.13636687c0-26.82775447 21.84545481-48.5454571 48.54545706-48.54545707h95.30240001c24.52823133 0 44.32966747 19.80143615 44.32966747 44.32966743v720.51680443c0 13.92488108-11.24210461 25.16698909-25.1669857 25.16698905h-3.44928304z m-765.10197633-561.21104966c-1.40526435-0.38325328-2.81052531-0.38325328-4.08803743 0.25550107-2.0440187 0.89425881-3.83253634 3.70478412-3.83253634 6.0043073v397.30625195c0 3.44928307 2.81052531 6.25980836 6.25980838 6.25980837h100.15694738c3.44928307 0 6.25980836-2.81052531 6.25980835-6.25980837v-317.33399738c0-2.17177099-1.27751206-4.34354187-3.06602977-5.36554958-39.34737119-22.86746589-72.43493409-49.43971594-98.62393082-78.82249466-1.02201109-1.14975988-2.0440187-1.91626647-3.06602975-2.0440187z m599.66416541-3.70478408c-1.78851765 0-3.70478412 0.89425881-4.72679511 2.29951971-26.06124454 32.57655729-59.14880738 59.02105856-98.11292873 78.56699361-2.0440187 1.14975988-3.44928307 3.19377863-3.44927964 5.49330182v317.33399734c0 3.44928307 2.81052531 6.25980836 6.25980838 6.25980842h100.156944c3.44928307 0 6.25980836-2.81052531 6.25981173-6.25980842v-397.43400417c0-2.29952314-1.27751206-4.4712907-3.19378197-5.62105398-1.14975988-0.38325328-2.17177099-0.63875438-3.19377866-0.63875433z m-166.97082741 110.24928865c-0.63875438 0-1.40526435 0.12775226-1.91626991 0.38325675-27.33875662 9.07033706-62.47034164 16.09665205-98.87943185 19.80143614-3.19377863 0.38325328-5.49330178 2.93827751-5.49330177 6.13205612V747.06221967c0 3.44928307 2.81052531 6.25980836 6.25980838 6.25980836h100.15694738c3.44928307 0 6.25980836-2.81052531 6.25980835-6.25980836v-287.18471212c0-1.66076539-0.63875438-3.57703531-1.91626987-4.72679513-1.40526435-1.14975988-2.93827751-1.78851765-4.47129071-1.78851768z m-267.51102819 0c-1.78851765 0-3.44928307 0.76650659-4.59904292 2.17177097-1.02201109 1.14975988-1.40526435 2.68277647-1.40526093 4.21578964v287.18471208c0 3.44928307 2.81052531 6.25980836 6.25980833 6.25981178h100.15694401c3.44928307 0 6.25980836-2.81052531 6.25981175-6.25981178v-267.38327252c0-3.19377863-2.29952314-5.74880281-5.49330178-6.13205953-36.53684596-3.70478412-71.66842747-10.60335026-98.8794353-19.80143613-0.89425881-0.12775226-1.53301318-0.25550102-2.29952316-0.25550451z m0 0" p-id="3368"></path></svg>
                    桥梁信息
                    {/* <span className="pull-right">
                    <Button type="primary" icon={<SaveOutlined />} size={"small"} ghost onClick={saveData}>保存</Button>
                </span> */}
                </h3></Col>
                    <Col>
                    
                <h3><svg t="1647151791494" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3237" width="20" ><path d="M538.48 158.14v62.69l277.93 134.24v-62.63l-277.93-134.3zM211.47 355.07l278-134.24v-62.69l-278 134.27v62.66z m128 85.54v-45.28h0.29c2.68-49.85 86.28-75.99 168.97-75.99 82.73 0 166.26 26.14 169 75.99h0.26v50.3l109.54-52.92-273.56-132.13-273.52 132.19 99.02 47.87v-0.03z m169.26 442.97c73.94 0 117.49-21.57 120.21-31-2.72-9.36-46.27-30.9-120.21-30.9-74.39 0-118.04 21.79-120.27 30.74 2.24 9.31 45.89 31.16 120.27 31.16z m0-518.29c-77.62 0-120.24 24.38-120.24 32.47v399.36c32.21-14.06 76.37-21.35 120.24-21.35 43.9 0 88.03 7.29 120.24 21.35V397.79c0.01-8.08-42.62-32.5-120.24-32.5z m356.74 27.42c-0.13 8.79-5.3 16.72-13.29 20.39L678 497.23v353.76h-0.19c0.03 0.54 0.19 1.05 0.19 1.6 0 100.94-338.52 100.94-338.52 0 0-0.54 0.16-1.05 0.16-1.6h-0.13V492.21l-163.76-79.09a22.78 22.78 0 0 1-13.26-20.39l0.03-0.1h-0.03V278.38c0-8.6 5.11-16.46 13.26-20.39l326.98-157.92a25.75 25.75 0 0 1 22.5 0l326.95 157.95c8.15 3.93 13.29 11.82 13.29 20.39v114.23h-0.03l0.03 0.1v-0.03z" p-id="3238"></path></svg>桩长富余策略</h3>
                    </Col>
                </Row>
                
                <Row gutter={10}>
                    <Col span={2}>
                        <Form.Item label="桥梁中桩" name="centerPileNo" >
                            <Input  />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="跨径组合" name="spanComb" onBlur={factorySpanComb} rules={[{ required: true, message: "跨径组合不能为空" }]}>
                            <Input placeholder="跨数*跨径,乘号使用*,支持6*(4*30)格式" />
                        </Form.Item>
                    </Col>
                {/* </Row> */}

                {/* <Row gutter={20}> */}
                    <Col span={4}>
                        <Form.Item label="长度富余" name="pierLenMore" >
                            <InputNumber placeholder="" addonBefore={"桥墩"} addonAfter="m" controls={false}
                            // defaultValue={5}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="abutLenMore" label=" ">
                            <InputNumber placeholder="" addonBefore={"桥台"} addonAfter="m" controls={false}
                            // defaultValue={3} 
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>

                        <Form.Item label="承载力富余" name="pierCarryMore" >
                            <InputNumber placeholder="" addonBefore={"桥墩"} addonAfter="kN" controls={false}
                            // defaultValue={500} 
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>

                        <Form.Item label=" " name="abutCarryMore" >
                            <InputNumber placeholder="" addonBefore={"桥台"} addonAfter="kN" controls={false}
                            // defaultValue={300} 
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <h3 style={{ marginBottom: 20 }}>
                <svg t="1647151615757" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3103" width="20" ><path d="M698.4 313.8h135L697.4 165l1 148.8z m-422.7 452c-14.9 0.1-27.1-12-27.1-26.9-0.1-14.9 12-27.1 26.9-27.1l484.4-1.9c14.9-0.1 27.1 12 27.1 26.9 0.1 14.9-12 27.1-26.9 27.1l-484.4 1.9z m0-196.1c-14.9 0.1-27.1-12-27.1-26.9-0.1-14.9 12-27.1 26.9-27.1l484.4-1.9c14.9-0.1 27.1 12 27.1 26.9 0.1 14.9-12 27.1-26.9 27.1l-484.4 1.9z m9.1-203.7c-14.9 0-27-12.1-27-27s12.1-27 27-27h294.4c14.9 0 27 12.1 27 27s-12.1 27-27 27H284.8zM98.6 127.2c0-34.9 28-63.2 62.9-63.2h499.6c17.6 0 38.4 9.2 50.2 22.3l194.9 215.5c11.2 12.3 19.1 32.8 19.1 49.5v545.6c0 34.9-28.2 63.2-63 63.2H161.6c-34.9 0-63-28.2-63-63.2V127.2z m545.2-9.1H161.5c-4.9 0-8.9 4-8.9 9.1v769.6c0 5.2 4 9.1 8.9 9.1h700.8c4.9 0 8.9-4.1 8.9-9.1V365.6c-6.8 1.4-14.6 2.2-23.3 2.2H680.7c-19.9 0-36.1-16.1-36.2-36.1l-1.2-198.9c-0.2-5.2 0.1-10.2 0.5-14.7z" fill="#666666" p-id="3104"></path></svg>
                桩基信息<span className="pull-right">
                    <Button icon={<UploadOutlined />} size={"small"} ghost type="primary" onClick={pileUpload}>上传</Button>
                </span></h3>
            <Table
                bordered
                columns={mergeColumns}
                components={components}
                dataSource={bridgeBaseData.basicList}
                size={"small"}
                rowClassName={() => 'editable-row'}
                rowKey={"pierNo"}
                pagination={false}
            />
            <DraggableModal
                visible={uploadPileModalVisible}
                title={"桩基信息上传"}
                width={650}
                // onOk={form.submit}
                onCancel={() => { setUploadPileModalVisible(false) }}>
                    {/* <Row gutter={20} className="upload-card">
            <Col span={20}>
                <Input placeholder="上传桩基信息文件" value={fileName} disabled/>
            </Col>
            <Col span={4} className="tt">
            <Upload action={API_PREFIX + '/pile-len/calc/pile/upload'}
                    maxCount={1}
                    data={{
                        groupId: selectedBridgeId
                    }}
                    onChange={pileFileOnChange}>
                <Button type="primary" style={{width: '100%'}} loading={uploadLoading}>上传</Button>
            </Upload>
            </Col>
            </Row> */}
                <Dragger action={API_PREFIX + '/pile-len/calc/pile/upload'}
                    maxCount={1}
                    data={{
                        groupId: selectedBridgeId
                    }}
                    onChange={pileFileOnChange}>
                    <Spin spinning={uploadLoading}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击或拖动到此处上传</p>
                    </Spin>
                </Dragger>
            </DraggableModal>
        </Spin>
    );
};

export default BridgeBase;