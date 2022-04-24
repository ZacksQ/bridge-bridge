import React, {useEffect, useState} from "react";
import {Button, Divider, Modal, Skeleton, Table, Timeline} from "antd";
import DeleteButton from "../../../component/button/DeleteButton";
import Card from "../../../component/card/Card";
import {useHistory, useParams} from "react-router";
import BridgeSideClient from "../../../../client/bridge/BridgeSideClient";
import moment from "moment";
import RegularDiseaseClient from "../../../../client/inspection/RegularDiseaseClient";
import {ALIOSS_URL} from "../../../../config";
import DraggableModal from "../../../component/modal/DraggableModal";
import {parseDiseaseTrend} from "../../../../util/BridgeUtils";
import ImgModal from "../../../component/imgModal/imgModal";

const HistoryDisease = ({bridgeId, bridgeSideId, siteNo, memberData = {}, visible, onCancel}) => {
    const {memberTypeId, memberCode} = memberData
    //组件状态
    const [loading, setLoading] = useState(false);
    const [diseaseData, setDiseaseData] = useState([]);

    const [imgModalData, setImgModalData] = useState({visible:false,imgUrlArr:undefined});
    const imgUrlArrFn = () => {
        setImgModalData({visible:false , imgUrlArr :undefined })
    }
    const showDiseasePic = diseaseId => {
        // showDiseaseForm(id, false, true)
        if (diseaseId) {
            RegularDiseaseClient.getDiseaseById(diseaseId).then(data => {
                let arr = []
                data.photos.forEach(v=>{
                    arr.push({url:ALIOSS_URL+v})
                })
                setImgModalData({visible:true , imgUrlArr :arr })
                // setPreview({
                //     previewVisible: true,
                //     previewImage: data.photos,
                //     previewTitle: '',
                //     imageIndex: 0
                // })
            })
        }
    }
    //初始化数据
    useEffect(() => {
        if (visible === true) {
            fetchMemberHistoryDisease()
        }
        // eslint-disable-next-line
    }, [visible]);

    const fetchMemberHistoryDisease = () => {
        setLoading(true)
        BridgeSideClient.memberHistoryDisease({
            bridgeId, bridgeSideId, siteNo: siteNo ? siteNo : 1
        }, {memberTypeId, memberCode}).then(setDiseaseData).finally(() => {
            setLoading(false)
        })
    }

    return (
        <DraggableModal
            width={1250}
            loading={loading}
            visible={visible}
            title="病害表单"
            footer={null}
            zIndex={999999}
            onCancel={onCancel}>
            <ImgModal
                visible={imgModalData.visible}
                imgUrlArr={imgModalData.imgUrlArr}
                onCancel={imgUrlArrFn}
            />
            <Skeleton loading={loading}>
                {diseaseData.length > 0 ? <Timeline>
                    {diseaseData.map((item, index) => <Timeline.Item
                        key={index}>{item.taskDate ? moment(item.taskDate).format('YYYY') : ''}年主要病害
                        - {item.mainDiseases}
                        <br/>
                        {item.diseaseVOList.map((disease, index) => {
                            return <div className="disease-item">
                                <div className={"disease-item-body"}>
                                    <div className={"trend " + (disease.trend?disease.trend:'')} >
                                        {parseDiseaseTrend(disease.trend)}
                                    </div>
                                    {disease.diseaseDesc} {disease.hasPhoto && <span onClick={()=>showDiseasePic(disease.id)}>检查照片</span>}
                                </div>
                                <div className="footer">
                                    <div>
                                        <span>检查人：</span>{disease.inspectorName}
                                    </div>
                                    <div>
                                        <span>记录日期：</span>{disease.recordDatetime}
                                    </div>
                                </div>
                            </div>
                        })}
                        {/*<Button size="small" style={{marginTop: 15}} onClick={() => {*/}
                        {/*    showDetailDiseaseTable(item.id)*/}
                        {/*}}>病害详表</Button>*/}
                    </Timeline.Item>)}
                </Timeline> : "历年暂无病害"}
            </Skeleton>
        </DraggableModal>
    )
}

export default HistoryDisease;