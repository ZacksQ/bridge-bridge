import React, {useEffect, useState} from "react";
import DraggableModal from "../../../component/modal/DraggableModal";
import BridgeTable from "../BridgeTable";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import ProgressDialog from "../../../component/progress/ProgressDialog";
import {copyBridgeFromBase} from "../../../../util/BridgeUtils";

const BridgeSelectionForm = ({visible, onOk, onCancel}) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bridgeData, setBridgeData] = useState({current: 1, pageSize: 10, data: [], searchData: {}});
    const [selectedBridgeIds, setSelectedBridgeIds] = useState([]);
    const [progressVisible, setProgressVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [progress, setProgress] = useState(0);
    //初始化
    const fetchBridge = pageData => {
        setLoading(true);
        BridgeBaseClient.getBridgePageFromBase(pageData)
            .then(setBridgeData)
            .finally(() => setLoading(false));
    };
    // eslint-disable-next-line
    useEffect(() => fetchBridge(bridgeData), []);
    //处理管养单位选中事件
    const handleSelect = keys => {
        setSelectedBridgeIds(keys);
    };
    //处理保存事件
    const submitForm = async () => {
        setSaving(true)
        setProgressVisible(true);
        setTotal(selectedBridgeIds.length)
        for (let bridgeId of selectedBridgeIds) {
            await copyBridgeFromBase(bridgeId);
            setProgress(progress => progress + 1);
        }
        setSaving(false);
        setProgressVisible(false);
        onOk();
    };
    //初始化表单
    useEffect(() => setSelectedBridgeIds([]), [visible]);
    //渲染
    return (
        <DraggableModal
            width={950}
            visible={visible}
            title="选择桥梁"
            confirmLoading={saving}
            disableOkBtn={selectedBridgeIds.length === 0}
            onOk={submitForm}
            onCancel={onCancel}>
            <BridgeTable
                loading={loading}
                rowSelection={{
                    selectedRowKeys: selectedBridgeIds,
                    onChange: handleSelect
                }}
                bridgeData={bridgeData}
                dataSupplier={fetchBridge}/>
            <ProgressDialog visible={progressVisible} total={total} progress={progress}/>
        </DraggableModal>
    )
}

export default BridgeSelectionForm;