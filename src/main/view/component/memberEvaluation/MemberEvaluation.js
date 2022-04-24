import React, {useEffect, useState} from "react";
import {Button, Divider, Table, Tabs, Tooltip} from "antd";
import DraggableModal from "../modal/DraggableModal";
import {getColumnSearchProps} from "../table/Column";

const MemberEvaluation = ({loading, memberEvaluationsDialog={}, onCancel}) => {
    // const [memberEvaluationsDialog, setMemberEvaluationsDialog] = useState({visible: false, data: []});
    const [searchData, setSearchData] = useState({})

    const handleChange = (pagination, filters, sorters) => {
        setSearchData({
            memberNumber: filters?.memberNumber
        });
    };

    const memberColumns = [
        // {title: "构件编号", align: "center", dataIndex: "memberCode", key: "memberCode", width: 300},
        {title: "孔号", align: "center", dataIndex: "siteNo", key: "siteNo", width: 120},
        {title: "构件名称", align: "center", dataIndex: "memberNumber", key: "memberNumber", ...getColumnSearchProps(searchData.memberNumber) },
        {title: "构件评分", align: "center", dataIndex: "memberScore", key: "memberScore"},
    ]

    const filterData = () =>{
        console.log( memberEvaluationsDialog.data, searchData.memberNumber)
        let data = memberEvaluationsDialog.data.filter(d=> !Array.isArray(searchData.memberNumber) || d.memberNumber.includes(searchData.memberNumber[0]))
        return data
    }

    return (
            <DraggableModal
                loading={loading}
                width={1200}
                visible={memberEvaluationsDialog.visible}
                title="构件评分"
                footer={false}
                onCancel={onCancel}
                >
                <p>注：若构件得分低于60分会被前置排列。</p>
                <Table
                    size="small"
                    rowKey="sortIndex"
                    columns={memberColumns}
                    dataSource={filterData()}
                    // pagination={false}
                    onChange={handleChange}
                    bordered
                />
            </DraggableModal>

    )
}

export default MemberEvaluation;