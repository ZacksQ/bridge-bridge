import React, { useEffect, useImperativeHandle, useState } from "react";
import { Button, Row, Col, message, Input, Spin, Form, Typography, Popconfirm, Select, Table, Tabs, InputNumber } from "antd";
import DeleteButton from "../../component/button/DeleteButton";
import BridgeGroupClient from "../../../client/bridgeGroup/BridgeGroupClient";
import BridgeResultForm from "./BridgeResultForm";
import StratumClient from "../../../client/stakeLength/StratumClient";


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
                {dataList.map(d => <Select.Option value={d.drillNum} key={d.drillNum}>{d.drillNum}</Select.Option>)}
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


const BridgeResult = ({ selectedBridgeId, showResult, getBaseList, activeKey, onRef, pierNoList }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [bridgeBaseData, setBridgeBaseData] = useState([])
    const [editingKey, setEditingKey] = useState('');
    const [editModal, setEditModal] = useState({ visible: false, data: {} })
    const [drillList, setDrillList] = useState([])
    const isEditing = (record) => record.id === editingKey;

    useImperativeHandle(onRef, () => {
        return { setEditModal }
    })

    const getBridgeResult = groupId => {
        setLoading(true)
        BridgeGroupClient.getBridgeResult(groupId).then(res => {
            if (res.code === 0) {
                setBridgeBaseData(res.data)
               
                getBaseList(res.data)
            } else {
                message.error(res.resultNote)
            }
        }).finally(() => setLoading(false))
    }

    // 数据处理成平铺
    const handleDataSource = (arr) => {
        const list = [];
        arr.forEach((j) => {
            if (j.persons && j.persons.length) {
                j.persons.forEach((k) => {
                    list.push({ ...k, ...j });
                });
            } else {
                list.push({ ...j });
            }
        });
        return list;
    };

    // 表头只支持列合并，使用 column 里的 colSpan 进行设置。
    // 表格支持行/列合并，使用 render 里的单元格属性 colSpan 或者 rowSpan 设值为 0 时，设置的表格不会渲染。
    // 合并数组单元格
    const createNewArr = (data, key) => {
        // data 需要处理的表格数据 key 就是需要合并单元格的唯一主键，我这里是projectId
        return data
            .reduce((result, item) => {
                //首先将key字段作为新数组result取出
                if (result.indexOf(item[key]) < 0) {
                    result.push(item[key]);
                }
                return result;
            }, [])
            .reduce((result, value, rownum) => {
                //将key相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
                const children = data.filter((item) => item[key] === value);
                result = result.concat(
                    children.map((item, index) => ({
                        ...item,
                        rowSpan: index === 0 ? children.length : 0, //将第一行数据添加rowSpan字段
                        rownum: rownum + 1
                    }))
                );
                return result;
            }, []);
    };


    //初始化
    useEffect(() => {
        if (selectedBridgeId && activeKey == "2") {
            getBridgeResult(selectedBridgeId)
        }
    }, [selectedBridgeId, activeKey]);

    useEffect(() => {
        getDrillList()
    }, [])

    const getDrillList = () => {
        return StratumClient.getDrillList().then(res => {
            if (res.code === 0) {
                setDrillList(res.data)
            }
        })
    }
    const saveRow = async data => {
        const row = await form.validateFields();
        const postData = { ...data, ...row, groupId: selectedBridgeId, summaryId: data.id }
        BridgeGroupClient.changeHole(postData).then(res => {
            if (res.code === 0) {
                const newData = [...bridgeBaseData];
                const index = bridgeBaseData.findIndex((item) => data.id === item.id);

                if (index > -1) {
                    const item = bridgeBaseData[index];
                    newData.splice(index, 1, { ...item, ...row });
                    setBridgeBaseData(newData);
                    setEditingKey('');
                }
            } else {
                message.error(res.resultNote)
            }
        })
    }

    const saveData = data => {
        if (data.code === 0) {
            setEditModal({ visible: false, data: {} })
            if (selectedBridgeId) {
                getBridgeResult(selectedBridgeId)
            }
        } else {
            message.error(data.resultNote)
        }
    }

    const cancel = () => {
        setEditingKey('');
    };

    const handleDelete = id => {
        setLoading(true)
        BridgeGroupClient.delBridgeRow(id).then(res => {
            if (res.code === 0) {
                const dataSource = [...bridgeBaseData];
                setBridgeBaseData(dataSource.filter(item => item.id !== id));
                getBridgeResult(selectedBridgeId)
            } else {
                message.error(res.resultNote)
            }
        }).finally(() => setLoading(false))
    }

    const columns = [
        {
            title: "墩台编号",
            key: "pierNo",
            dataIndex: "pierNo",
            width: 60,
            className: "grey",
            align: 'center',
            render: (text, record) => {
                return {
                    children: text,
                    props: {
                        rowSpan: record.rowSpan
                    }
                };
            }
            // editable: true,
            // inputType: "string"
        },
        {
            title: "墩台桩号",
            key: "pierPileNo",
            dataIndex: "pierPileNo",
            width: 80,
            align: 'center',
            render: (text, record) => {
                return {
                    children: text,
                    props: {
                        rowSpan: record.rowSpan
                    }
                };
            }
        },
        {
            title: "计算桩长",
            key: "length",
            dataIndex: "length",
            width: 80,
            align: 'center'
        },
        {
            title: "建议桩长",
            key: "suggestLen",
            dataIndex: "suggestLen",
            width: 80,
            align: 'center'
        },
        {
            title: "对应孔号",
            key: "corrDrillNum",
            dataIndex: "corrDrillNum",
            width: 80,
            editable: true,
            inputType: "select",
            align: 'center',
            dataList: drillList
        },
        {
            title: "异常情况",
            key: "warnNote",
            dataIndex: "warnNote",
            width: 150,
            align: 'center'
        },
        {
            title: "操作",
            key: "action",
            dataIndex: "action",
            align: 'center',
            width: 150,
            render(text, record) {
                const editable = isEditing(record);
                return editable ? <span>
                    <Button type="link"
                        onClick={() => saveRow(record)}
                        style={{
                            marginRight: 8
                        }}
                    >
                        保存
                    </Button>
                    {/* <Popconfirm title="确认取消?" onConfirm={cancel} cancelButtonProps={{style:{float: 'right', marginLeft: 20}}}>
                        <a>取消</a>
                    </Popconfirm> */}
                    <Button type="link" onClick={() => cancel()}>
                        取消
                    </Button>
                </span> : (<div className="btn-ctrl-wrap">
                    <Button type="link" onClick={() => { showResult(record) }}>查看结果</Button>
                    <Button type="link" onClick={() => showEditForm(record)}>编辑</Button>
                    <DeleteButton
                        onConfirm={() => handleDelete(record.id)} /></div>)
            }
        }
    ]

    const showEditForm = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id);
    }

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

    return (
        <Spin spinning={loading}>
            <Row justify="end">
                <Col>
                    <div className="note" style={{ color: '#f00', marginBottom: 10 }}>注：若墩台位置距前后两钻孔相差小于1m，将自动生成两条计算结果</div>
                </Col>
            </Row>
            {/* <Row justify="end" style={{ marginBottom: 10 }}>
                <Col>
                    <Button type="primary" size={"small"} ghost icon={<PlusOutlined />} onClick={() => { setEditModal({ visible: true, data: {} }) }}>新建</Button>
                </Col>
            </Row> */}
            <BridgeResultForm visible={editModal.visible} onOk={saveData} selectedBridgeId={selectedBridgeId} 
            pierNoList={pierNoList}
            drillList={drillList}
            formData={editModal.data} onCancel={() => setEditModal({ visible: false, data: {} })} />
            <Form form={form} component={false}>
                <Table
                    bordered
                    dataSource={createNewArr(handleDataSource(bridgeBaseData), 'pierNo')}
                    size={"small"}
                    rowKey="summaryId"
                    pagination={false}
                    columns={mergedColumns}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                />
            </Form>
        </Spin >
    );
};

export default BridgeResult;