import React, { useEffect, useState, useRef, useContext } from "react";
import { message, Input, Spin, Form, Select, Table, InputNumber } from "antd";
import BridgeGroupClient from "../../../client/bridgeGroup/BridgeGroupClient";
import './calc.css'
const EditableContext = React.createContext(null);

const permeableTypeList = [
    { value: 1, text: "透水" },
    { value: 0, text: "不透水" },
]
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
            let postData = {
                groupId: selectedBridgeId,
                pierNo: recordData.pierNo,
                summaryId: recordData.id,
                sn: record.sn,
                columnName: Object.keys(values)[0],
                cellValue: values[Object.keys(values)[0]]
            }
            BridgeGroupClient.calcTableDataChange(postData).then(res => {
                if (res.code === 0) {
                    handleSave({ ...record, ...values });
                } else {
                    message.error(res.resultNote)
                }
            })
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
                inputNode = <Select ref={inputRef} onBlur={save} showArrow={false} style={{width: "100%"}}>
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
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {inputNode}
                {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    // paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td  {...restProps} className={"ant-table-cell" + (editable == true ? "" : " grey")}>{childNode}</td>;
};

const CalcTable = ({ selectedBridgeId, data, recordData, reloadData, summaryId, pierNoList }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [calcTableData, setCalcTableData] = useState([])
    const [translateX, setTranslateX] = useState(0)
    // const [pierNoList, setPierNoList] = useState([])
    const [curPierNo, setCurPier] = useState(null)

    useEffect(() => {
        setCalcTableData(data)
    }, [data])

    // useEffect(() => {
    // console.log(basicList)
    //     setPierNoList(Array.from(new Set(basicList.map(item => item.pierNo))).sort())
    // }, [basicList])

    // useEffect(() => {
    //     if (selectedBridgeId)
    //         fetchBridgePierNoList(selectedBridgeId)
    // }, [selectedBridgeId])

   

    const columns = [
        {
            title: "土层编号",
            key: "soilNumber",
            dataIndex: "soilNumber",
            width: 100,
            align: 'center'
            // className: "grey"
        }, {
            title: "土层名称",
            key: "soilName",
            dataIndex: "soilName",
            width: 180,
            align: 'center'
        }, {
            title: "层底标高",
            key: "height",
            dataIndex: "height",
            width: 100,
            align: 'center'
        }, {
            title: "厚度",
            key: "thickness",
            dataIndex: "thickness",
            width: 80,
            align: 'center'
        }, {
            title: <>q<sub>ik</sub></>,
            key: "qik",
            dataIndex: "qik", editable: true,
            width: 80,
            inputType: "number",
            align: 'center'
        }, {
            title: "基础分段",
            key: "basePiece",
            dataIndex: "basePiece",
            width: 80,
            inputType: "number",
            align: 'center'
        }, {
            title: "分段摩阻",
            key: "segFrict",
            dataIndex: "segFrict",
            width: 80,
            inputType: "double",
            align: 'center'
        }, {
            title: <>[f<sub>a0</sub>]</>,
            key: "fa0",
            dataIndex: "fa0", editable: true,
            width: 100,
            inputType: "number",
            align: 'center'
        }, {
            title: <>K<sub>2</sub></>,
            key: "k2",
            dataIndex: "k2", editable: true,
            width: 80,
            inputType: "double",
            align: 'center'
        }, {
            title: <>γ<sub>sat</sub></>,
            key: "rsat",
            dataIndex: "rsat", editable: true,
            width: 100,
            inputType: "double",
            align: 'center'
        }, {
            title: <>透水性</>,
            key: "permeable",
            dataIndex: "permeable", editable: true,
            width: 140,
            inputType: "select",
            dataList: permeableTypeList,
            align: 'center',
            render(text) {
                return text == 1 ? "透水" : (text == 0 ? "不透水" : "-")
            }
        }, {
            title: <>桩端层位</>,
            key: "bottomLayer",
            dataIndex: "bottomLayer",
            align: 'center',
            width: 100,
            inputType: "double", render(text) {
                switch (text) {
                    case 0:
                        return "↓"
                    case 1:
                        return "←"
                    case -1:
                        return "↑"
                    default:
                        return "-"
                }
            }
        }]

    const handleSave = (row) => {
        // const newData = [...calcTableData.detailList];
        // const index = newData.findIndex((item) => row.sn === item.sn);
        // const item = newData[index];
        // newData.splice(index, 1, { ...item, ...row });
        // setCalcTableData({ ...calcTableData, detailList: [...newData] })
        
        reloadData(recordData)
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
                editable: record.sn >= 0 ? col.editable : false,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
                selectedBridgeId: selectedBridgeId,
                recordData: recordData,
                inputType: col.inputType,
                dataList: col.dataList,
                // className2: ((record.sn>=0&&col.editable==true))?record.sn:"grey"
            }),
        };
    });
    return (
        <Spin spinning={loading}>
            <div className="ap-list-wrap" >
                <div className="ap-list-box">
                    <div className="ap-list" style={{ "transform": `translateX(${translateX}px)` }}>
                        {pierNoList.map((item, index) => <div key={index} className={"ap-list-item ap-btn" + (summaryId === item.summaryId ? " active" : '')}
                            onClick={() => {
                                reloadData({ ...recordData, pierNo: `${item.pierNo}`, id: item.summaryId })
                            }}
                        >{item.pierNo}</div>)}
                    </div>
                </div>
                <div className="ctrl">
                    <div className="ap-btn left" onClick={() => {
                        let tdis = translateX + 425
                        if (tdis >= 0) tdis = 0
                        setTranslateX(tdis)
                    }}></div>
                    <div className="ap-btn right" onClick={() => {
                        let tdis = translateX - 425
                        let allength = document.getElementsByClassName("ap-list")[0].scrollWidth
                        if (allength + tdis >= 700)
                            setTranslateX(tdis)
                    }}></div>
                </div>
            </div>
            <table className="calc-table" width={"100%"}>
                <thead>
                    <tr>
                        <th>U(m)</th>
                        <th>A<sub>p</sub>（m<sup>2</sup>）</th>
                        <th>m<sub>0</sub></th>
                        <th>λ</th>
                        <th>[f<sub>a0</sub>]（kPa）</th>
                        <th>K<sub>2</sub></th>
                        <th>γ<sub>2</sub></th>
                        <th>h(m)</th>
                        <th>q<sub>r</sub>（kPa）</th>
                        <th>t<sub>0</sub></th>
                        <th></th>
                        <th>{calcTableData.soil}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="grey">{calcTableData.um}</td>
                        <td className="grey">{calcTableData.ap}</td>
                        <td className="grey">{calcTableData.m0}</td>
                        <td className="grey">{calcTableData.lamda} </td>
                        <td className="grey">{calcTableData.fa0}</td>
                        <td className="grey" className="grey">{calcTableData.k2}</td>
                        <td className="grey">{calcTableData.r2}</td>
                        <td className="grey">{calcTableData.hm}</td>
                        <td className="grey">{calcTableData.qr} </td>
                        <td className="grey">{calcTableData.t0}</td>
                        <td className="grey"></td>
                        <td className="grey">{(calcTableData.bottomLimit == -1 || calcTableData.bottomLimit == 10000) ? "-" : calcTableData.bottomLimit}</td>
                    </tr>
                    <tr>
                        <td colSpan={12} className="tl grey" style={{borderBottom: 0}}>{calcTableData.note}</td>
                    </tr>
                </tbody>
            </table>
            <Table columns={mergeColumns} size="small" className="ct" rowClassName={() => 'editable-row'} rowKey="sn"
                components={components} bordered dataSource={calcTableData.detailList} pagination={false} summary={pageData => {
                    return (
                        <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={3} className="thead">
                                    桩顶至孔底总高度
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c">
                                    {data.ttn}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="thead">
                                    计算桩长
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c">
                                    {data.pileLength}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c">
                                    {data.tsf}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c">
                                    {data.fa0}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c">
                                    {data.k2}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c">
                                    {calcTableData.rsat}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c">
                                    {calcTableData.permeable == 1 ? "透水" : (calcTableData.permeable == 0 ? "不透水" : "-")}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c">
                                    {/* {calcTableData.soil} */}
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>

                                <Table.Summary.Cell colSpan={6} className="thead">
                                    桩端所处地层位置为：
                                </Table.Summary.Cell>

                                <Table.Summary.Cell colSpan={2} className="grey c">
                                    第 {data.plies} 层
                                </Table.Summary.Cell>
                                <Table.Summary.Cell colSpan={4} className="grey c">
                                    {calcTableData.soil}
                                </Table.Summary.Cell>
                            </Table.Summary.Row>

                            <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={2} rowSpan={2} className="thead tbt">
                                    桩基信息
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="thead">
                                    桩基承载力
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="thead">
                                    桩顶反力
                                </Table.Summary.Cell>

                                <Table.Summary.Cell  className="thead">
                                    桩基直径
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="thead">
                                    桩顶标高
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="thead">
                                    桩底标高
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="thead">
                                    承载力富余
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="thead">
                                    长度富余
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="thead">
                                    端承力比例
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="thead">
                                    长细比
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="thead">

                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                                <Table.Summary.Cell className="grey c">
                                    {calcTableData.bearingCapacity}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c">
                                    {calcTableData.pileTopCoForce}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="grey c">
                                    {calcTableData.pileDiameter}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="grey c">
                                    {calcTableData.pileTopHigh}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="grey c">
                                    {calcTableData.pileBottomHigh}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="grey c">
                                    {calcTableData.carryMore}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c" >
                                    {calcTableData.lenMore}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="grey c">
                                    {calcTableData.carryRatioStr}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell className="grey c" >
                                    {calcTableData.slenderRatio}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell  className="grey c">

                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            />
        </Spin>
    );
};

export default CalcTable;