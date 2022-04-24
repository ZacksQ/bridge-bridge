import React, {useEffect, useState, Fragment} from "react";
import {Button, Divider, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import Toolbar from "../../../component/toolbar/Toolbar";
import BridgeStrideForm from "./BridgeStrideForm";
import DeleteButton from "../../../component/button/DeleteButton";

const BridgeStrideTable = ({dataSource, strideTypeData, saveStrideTableRow, deleteStrideData, bridgeData}) => {
    const [bridgeStrideForm, setBridgeStrideForm] = useState({initData: null, visible: false})

    //组件状态
    const columns = [
        {
            title: '孔号', width: 100, dataIndex: 'site', key: 'site', render: (text, record) => {
                if (record.siteStart !== record.siteEnd) {
                    return record.siteStart + "~" + record.siteEnd
                } else {
                    return record.siteStart
                }
            }
        },
        {title: '类型', width: 100, dataIndex: 'strideTypeName', key: 'strideTypeName'},
        {title: '下穿通道桩号', width: 140, dataIndex: 'strideStake', key: 'strideStake'},
        {title: '跨越地物或下穿通道名称', width: 200, dataIndex: 'strideName', key: 'strideName'},
        {title: '下穿通道桩号', width: 150, dataIndex: 'strideStake', key: 'strideStake'},
        {title: '桥下净高', width: 100, dataIndex: 'clearHeight', key: 'clearHeight'},
        {title: '备注', width: 150, dataIndex: 'notes', key: 'notes'},
        {
            title: '操作', key: 'action', render: (text, record) => (
                <div>
                    <Button size="small" type="link" onClick={() => showBridgeStrideForm(record)}>编辑</Button>
                    <Divider type="vertical"/>
                    <DeleteButton onConfirm={() => handleDelete(record.id)}>删除</DeleteButton>
                </div>
            )
        },
    ];

    const showBridgeStrideForm = data => {
        setBridgeStrideForm({initData: data, visible: true})
    }

    const handleFormCancle = () => {
        setBridgeStrideForm({initData: null, visible: false})
    }

    const handleDelete = id => {
        deleteStrideData(id)
    }

    const handleSave = formData => {
        if(bridgeStrideForm.initData){
            formData.id = bridgeStrideForm.initData.id
            saveStrideTableRow(formData, bridgeStrideForm.initData.id)
        }else{
            saveStrideTableRow(formData)
        }
        handleFormCancle()
    }

    //渲染
    return (
        <Fragment>
            <BridgeStrideForm
                visible={bridgeStrideForm.visible}
                strideTypeData={strideTypeData}
                initialData={bridgeStrideForm.initData}
                bridgeData={bridgeData}
                onOk={handleSave}
                onCancel={handleFormCancle}
            />
            <Toolbar>
                <Button size="small" icon={<PlusOutlined/>} onClick={() => showBridgeStrideForm()}>新增</Button>
            </Toolbar>
            <Table dataSource={dataSource} columns={columns} rowKey="id"/>
        </Fragment>
    )
};

export default BridgeStrideTable;