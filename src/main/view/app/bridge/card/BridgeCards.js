import React, {useEffect, useState, Fragment} from "react";
import {Button, Tabs} from "antd";
import BridgeTable from "../BridgeTable";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import Card from "../../../component/card/Card";
import DraggableModal from "../../../component/modal/DraggableModal";
import BridgeCardInfo from "./BridgeCardInfo";
import BridgeMemberStats from "./BridgeMemberStats";
import Archives from "./archivesId";
import ReviewHistoryId from "../reviewHistory/review";

const BridgeCards = () => {
    //数据加载
    const [loading, setLoading] = useState(false);
    const [bridgeData, setBridgeData] = useState({data: [], current: 1, pageSize: 10, total: 0, searchData: {}});
    const [bridgeCardModal, setBridgerCardModal] = useState({visible: false, bridgeId: undefined});
    //获取桥梁分页
    const fetchBridgeData = pageData => {
        setLoading(true);
        BridgeBaseClient.getBridgePage(pageData)
            .then(setBridgeData)
            .finally(() => setLoading(false));
    };
    // eslint-disable-next-line
    useEffect(() => fetchBridgeData(bridgeData), []);
    //打开表单
    const showBridgeCardInfo = bridgeId => {
        setBridgerCardModal({visible: true, bridgeId});
    };
    const downloadBridgeCard = (bridgeId, bridgeName) => {
        BridgeBaseClient.downloadBridgeCard(bridgeId, bridgeName)
    }
    //操作列
    const extraColumns =
        {
            title: "操作",
            key: "action",
            dataIndex: "sideAmount",
            width: 240,
            fixed: "right",
            align: "center",
            render: (text, record) => (<Fragment>
                <Button size="small" type="link" onClick={() => showBridgeCardInfo(record.id)}>查看桥梁信息</Button>
                <Button size="small" type="link" onClick={() => downloadBridgeCard(record.id, record.bridgeName)}>桥梁卡片下载</Button>
            </Fragment>)
        };
    //渲染
    return (
        <Card title="桥梁信息查看">
            <BridgeTable
                loading={loading}
                bridgeData={bridgeData}
                dataSupplier={fetchBridgeData}
                extraColumn={extraColumns}/>
                <DraggableModal
                    width={1150}
                    visible={bridgeCardModal.visible}
                    title={null}
                    footer={null}
                    onCancel={() => setBridgerCardModal({visible: false})}>
                    <Tabs tabPosition="top">
                        <Tabs.TabPane key="1" tab="桥梁基本状况卡片">
                            <BridgeCardInfo bridgeId={bridgeCardModal.bridgeId}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key="2" tab="构件拆分情况">
                            <BridgeMemberStats bridgeId={bridgeCardModal.bridgeId}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key="3" tab="桥梁档案情况">
                            <Archives bridgeId={bridgeCardModal.bridgeId}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key="4" tab="检查结果查看">
                            <ReviewHistoryId bridgeId={bridgeCardModal.bridgeId} dialog={true} canBack={false} style={{boxShadow: 'none'}}  />
                        </Tabs.TabPane>
                    </Tabs>
                </DraggableModal>
        </Card>
    );
};

export default BridgeCards;