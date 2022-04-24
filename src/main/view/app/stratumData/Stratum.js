import React, { useEffect, useState, useImperativeHandle } from "react";
import { Button, InputNumber, Divider, message, Spin, Input, Form, Typography, Popconfirm, Select } from "antd";
import DeleteButton from "../../component/button/DeleteButton";
import Dragger from "antd/es/upload/Dragger";
import PaginationTable from "../../component/table/PaginationTable";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import StratumClient from "../../../client/stakeLength/StratumClient";
import DraggableModal from "../../component/modal/DraggableModal";
import StratumForm from "./StratumForm";
import { API_PREFIX } from '../../../config'

const permeableTypeList = [
    { value: true, text: "透水" },
    { value: false, text: "不透水" },
]

const softSoilTypeList = [
    { value: true, text: "是" },
    { value: false, text: "否" },
]

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    dataList,
    ...restProps
}) => {
    let inputNode = null;

    switch (inputType) {
        case "number":
            inputNode = <InputNumber precision={0} min={0} controls={false} />
            break
        case "select":
            inputNode = <Select>
                {dataList.map(d => <Select.Option value={d.value} key={d.value}>{d.text}</Select.Option>)}
            </Select>
            break
        case "double":
            inputNode = <InputNumber precision={2} min={0} controls={false} />
            break
        default:
            inputNode = <Input />
            break
    }
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                // rules={[
                //     {
                //         required: true,
                //         message: `Please Input ${title}!`,
                //     },
                // ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const Stratum = ({ onRef }) => {
    const [form] = Form.useForm();
    //组件状态
    const [loading,
        setLoading] = useState(false);

    const [stratumData,
        setStratumData] = useState({
            data: [],
            // pageNum: 1, pageSize: 10 
        });
    const [stratumForm,
        setStratumForm] = useState(false);
    const [uploadModalVisible, setUploadModalVisible] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [editingKey, setEditingKey] = useState('');
    useImperativeHandle(onRef, () => {
        return {
            setUploadModalVisible,
            setStratumForm
        }
    })
    const isEditing = (record) => record.id === editingKey;
    //获取用户数据
    const fetchStratumData = (pageData) => {
        setLoading(true);
        StratumClient.getStratumData(pageData)
            .then(res => {
                if (res.code === 0) {
                    setStratumData(res)
                } else {
                    message.error(res.resultNote)
                }
            })
            .finally(() => setLoading(false))
    }
    //初始化
    useEffect(() => {
        fetchStratumData(stratumData)
    }, []);


    const handleSave = () => {
        setStratumForm(false);
        fetchStratumData(stratumData)
    };
    //处理删除
    const handleDelete = id => {
        setLoading(true)
        const dataSource = [...stratumData.data];
        StratumClient.delStratumData({ id }).then(res => {
            if (res.code === 0) {
                const dataSource = [...stratumData.data];
                setStratumData({ data: dataSource.filter(item => item.id !== id) });
            } else {
                message.error(res.resultNote)
            }
        }).finally(() => setLoading(false))
    };

    const saveRow = async record => {
        // console.log(record)
        // return false
        const row = await form.validateFields();

        StratumClient.editStratumData({ id: record.id, ...row }).then(res => {
            if (res.code === 0) {
                const newData = [...stratumData.data];
                const index = stratumData.data.findIndex((item) => record.id === item.id);

                if (index > -1) {
                    const item = stratumData.data[index];
                    newData.splice(index, 1, { ...item, ...row });
                    setStratumData({ data: newData });
                    setEditingKey('');
                }
            } else {
                message.error(res.resultNote)
            }
        })
    }
    //表格列
    const columns = [
        {
            title: "岩土编号",
            key: "soilNumber",
            dataIndex: "soilNumber",
            width: 80,
            editable: true,
            inputType: "string", align:
                "center",
            className: "grey"
        }, {
            title: "岩土名称",
            key: "soilName",
            dataIndex: "soilName",
            width: 150,
            editable: true,
            inputType: "string",
            align: 'center'
        }, {
            title: "液限/%",
            key: "liquidLimit",
            dataIndex: "liquidLimit",
            width: 100,
            editable: true,
            inputType: "double", align:
                "center"
        }, {
            title: "液性指数/lL",
            key: "liquidIndex",
            dataIndex: "liquidIndex", editable: true,
            width: 100,
            inputType: "double", align:
                "center"
        }, {
            title: <>地基承载力特性值<br />[f<sub>a0</sub>]/kPa</>,
            key: "fa0",
            dataIndex: "fa0", editable: true,
            width: 150,
            inputType: "number", align:
                "center"
        }, {
            title: <>桩侧土摩阻力标准值<br />[q<sub>ik</sub>]kPa</>,
            key: "qik",
            dataIndex: "qik", editable: true,
            width: 150,
            inputType: "number", align:
                "center"
        }, {
            title: <>饱和单轴抗压强度<br />R<sub>aj</sub>/MPa</>,
            key: "raj",
            dataIndex: "raj", editable: true,
            width: 150,
            inputType: "double", align:
                "center"
        }, {
            title: "透水性",
            key: "permeable",
            dataIndex: "permeable", editable: true,
            width: 120,
            render(text) {
                if (text) {
                    return "透水"
                } else {
                    return "不透水"
                }
            },
            dataList: permeableTypeList,
            inputType: "select", align:
                "center"
        }, {
            title: <>K<sub>2</sub></>,
            key: "k2",
            dataIndex: "k2", editable: true,
            width: 100,
            inputType: "double", align:
                "center"
        }, {
            title: "软弱层",
            key: "softSoil",
            dataIndex: "softSoil", editable: true,
            width: 100,
            dataList: softSoilTypeList,
            render(text) {
                if (text) {
                    return "是"
                } else {
                    return "否"
                }
            },
            inputType: "select", align:
                "center"
        },
        {
            title: "操作", key: "action", width: 150, align:
                "center", render: (text, record) => {
                    const editable = isEditing(record);

                    return editable ? <span>
                        <Typography.Link
                            onClick={() => saveRow(record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            保存
                        </Typography.Link>
                        <Button type="link" onClick={() => cancel()}>
                            取消
                        </Button>
                    </span> : (<div>
                        <Button
                            size="small" type="link" onClick={() => showEditForm(record)}>编辑</Button>
                        <Divider type="vertical" />
                        <DeleteButton
                            onConfirm={() => handleDelete(record.id)} />
                    </div>)
                }
        }
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                dataList: col.dataList,
                editing: isEditing(record),
            }),
        };
    });
    const fileOnChange = (info) => {
        const { status } = info.file;
        if (status == 'uploading') {
            // console.log(info.file, info.fileList);
            setUploadLoading(true)
        }
        if (status === 'done') {
            if (info.file.response.code === 0) {
                message.success(`${info.file.name} 数据已成功上传.`);
                setUploadModalVisible(false)
                fetchStratumData(stratumData)
            } else {
                message.error(`${info.file.name} 上传失败.${info.file.response.resultNote}`)
            }
            setUploadLoading(false)
        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            setUploadLoading(false)
        }

    }

    const showEditForm = (record) => {
        // setStratumForm({visible: true, initialData: record})
        form.setFieldsValue({
            // name: '',
            // age: '',
            // address: '',
            ...record,
        });
        setEditingKey(record.id);
    }

    const cancel = () => {
        setEditingKey('');
    };

    return (<>
        {/* <Toolbar className="toolbar pull-right">
            
        </Toolbar> */}
        <Form form={form} component={false}>
            <PaginationTable
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                size="small"
                rowKey="id"
                loading={loading}
                pageData={stratumData}
                columns={mergedColumns}
                pagination={false}
                // onChange={handleChange}
                scroll={{
                    x: "100%",
                    y: 500
                }} />
        </Form>
        <DraggableModal
            visible={uploadModalVisible}
            title={"数据上传"}
            width={650}
            // onOk={form.submit}
            footer={null}
            onCancel={() => { setUploadModalVisible(false) }}>
            <Dragger
                action={API_PREFIX + '/pile-len/calc/stratum/upload'}
                // fileList={fileList}
                maxCount={1}
                onChange={fileOnChange}
            // onRemove={handleRemove}
            // customRequest={aliossUpload}
            ><Spin spinning={uploadLoading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖动到此处上传</p>
                </Spin>
            </Dragger>
        </DraggableModal>
        <StratumForm
            visible={stratumForm}

            permeableTypeList={permeableTypeList}
            softSoilTypeList={softSoilTypeList}
            onOk={handleSave}
            onCancel={() => setStratumForm(false)} />
    </>
    );
};

export default Stratum;