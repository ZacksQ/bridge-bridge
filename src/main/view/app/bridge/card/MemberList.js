import React, {Fragment, useEffect, useMemo, useState} from "react";
import {Button, Checkbox, Col, Divider, Form, Input, Row, Select, Table, Tag, Tree} from "antd";
import debounce from 'lodash/debounce';
import DraggableModal from "../../../component/modal/DraggableModal";
import MemberTypeClient from "../../../../client/param/MemberTypeClient";
import DictionaryClient from "../../../../client/param/DictionaryClient";
import BridgeMemberClient from "../../../../client/bridge/BridgeMemberClient";
import HistoryDisease from "../side/HistoryDisease";
import Card from "../../../component/card/Card";
import {getColumnSearchProps} from "../../../component/table/Column";

//部件
const MemberList = ({siteList, member, visible, onOk, onCancel}) => {
    const [selectSiteNo, setSelectSiteNo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])
    const [historyDisease, setHistoryDisease] = useState({
        visible: false,
        initialData: undefined,
        showPic: undefined
    });
    const [searchData, setSearchData] = useState({});

    const handleChange = (pagination, filters)=>{
        setSearchData({
            memberNumber: filters?.memberNumber
        });
    }

    let columns = [
        {title: "构件编号", key: "memberNumber", dataIndex: "memberNumber", width: 150, ...getColumnSearchProps(searchData.memberNumber),},
        {title: "类型", key: "structureTypeName", dataIndex: "structureTypeName", width: 150},
    ]
    if(selectSiteNo===null){
        columns.push({title: "孔号", key: "siteNo", dataIndex: "siteNo", width: 80})
    }
    if (member.memberTypeId == "001016001") {
        columns.push({title: "详细类型", key: "detailTypeName", dataIndex: "detailTypeName", width: 150})
    } else {
        columns.push({title: "材料类型", key: "materialTypeName", dataIndex: "materialTypeName", width: 150})
    }

    columns.push({title: "当前得分", key: "memberScore", dataIndex: "memberScore", width: 150,sorter: (a, b) => {
                let an = a.memberScore?a.memberScore:0
                let bn = b.memberScore?b.memberScore:0
                return an - bn
            }, render(text){
                if(!text){
                    return 100
                }
                return text
            }},
        {title: "扣分情况", key: "deductionDetail", dataIndex: "deductionDetail", width: 200},
        {title: "当前病害", key: "diseaseDesc", dataIndex: "diseaseDesc", width: 150},
        {
            title: "操作", key: "archivesNo", dataIndex: "archivesNo", align:'center', width: 150, render(text, record) {
                return <Button size="small" type="link" onClick={() => {
                    setHistoryDisease({
                        visible: true,
                        initialData: record
                    })
                }}>历年病害</Button>
            }
        },
    )

    const filternData = () => {
        let result = tableData.filter(d => (!Array.isArray(searchData.memberNumber) || d.memberNumber.includes(searchData.memberNumber[0])))
        return result
    };
    const handleSiteClick = (siteNo, focus) => {
        if (focus) {
            setSelectSiteNo(null)
            BridgeMemberClient.getMemberByAtt(member).then(setTableData)
        } else {
            setSelectSiteNo(siteNo)
            BridgeMemberClient.getMemberBySite({...member, siteNo}).then(setTableData)
        }
    }

    useEffect(() => {
        if (visible) {
            handleSiteClick(null, true)
        }
    }, [visible])

    //渲染
    return (
        <>
        <DraggableModal
            width={1420}
            visible={visible}
            title="构件信息列表"
            // confirmLoading={saving}
            // onOk={form.submit}
            onCancel={onCancel}>
            <div className={"inf-member"}>
                <div className="site-list">
                    {/*<div className="tit">孔跨列表</div>*/}
                    <div className={"site-item" + (selectSiteNo ? '' : ' active')}
                         onClick={() => handleSiteClick(null, true)}>
                        重点关注
                    </div>
                    {siteList.map(site => <div key={site.siteNo} className={"site-item" + (selectSiteNo === site.siteNo ? ' active' : '')}
                                               onClick={() => handleSiteClick(site.siteNo)}>
                        第{site.siteNo}孔
                    </div>)}
                </div>
                <div className="member-table">
                    <Table
                        size="small"
                        rowKey="id"
                        loading={loading}
                        columns={columns}
                        dataSource={filternData()}
                        onChange={handleChange}
                        scroll={{x: '100%'}}
                        pagination={{
                            // onChange: (page, pageSize) => getList(page, pageSize),
                            // onShowSizeChange: (current, size) => getList(current, size),
                            data: undefined,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "30", "50", "100"],
                            // total:lableData.total,
                            showTotal: (total, range) => `第${range[0]}~${range[1]}条，共${total}条`
                        }}
                        bordered/>
                </div>
            </div>
        </DraggableModal>
            {historyDisease.visible&&<HistoryDisease
                visible={historyDisease.visible}
                taskId={null}
                bridgeSideId={member.bridgeSideId}
                siteData={siteList}
                siteNo={selectSiteNo ? selectSiteNo : historyDisease.initialData.siteNo}
                // bridgeId={bridgeId}
                // handleDelete={handleDelete}
                memberData={historyDisease.initialData}
                // showDiseasePic={showDiseasePic}
                // onbianji={showDiseaseForm}
                onCancel={() => setHistoryDisease({visible: false})}
            />}
            </>
    )
};

export default MemberList;