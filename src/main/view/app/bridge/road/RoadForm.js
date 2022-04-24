import React, {useEffect, useState} from "react";
import DraggableModal from "../../../component/modal/DraggableModal";
import {Tree} from "antd";
import RoadClient from "../../../../client/bridge/RoadClient";
import {walkTree} from "../../../../util/TreeUtils";

const RoadForm = ({visible, onOk, onCancel}) => {
    //组件状态
    const [saving, setSaving] = useState(false);
    const [roadData, setRoadData] = useState([]);
    const [selectedRoads, setSelectedRoads] = useState([]);
    //初始化
    useEffect(() => {
        RoadClient.listRoadTreeFromBase().then(roadData => {
            walkTree(roadData, d => d.key = d.data.id ? d.data.id : d.key);
            setRoadData(roadData)
        });
    }, []);
    //处理选中事件
    const handleCheck = (keys, nodes) => {
        setSelectedRoads(nodes.checkedNodes.map(d => d.data));
    }
    //处理保存事件
    const submitForm = () => {
        setSaving(true);
        RoadClient.insertRoads(selectedRoads)
            .then(onOk)
            .finally(() => setSaving(false));
    }
    //初始化表单
    useEffect(() => {
        setSelectedRoads([]);
    }, [visible]);
    //渲染
    return (
        <DraggableModal
            visible={visible}
            title="路线编号表单"
            confirmLoading={saving}
            disableOkBtn={selectedRoads.length === 0}
            onOk={submitForm}
            onCancel={onCancel}>
            <Tree treeData={roadData} checkedKeys={selectedRoads.map(d => d.id)} onCheck={handleCheck} selectable={false} checkable/>
        </DraggableModal>
    )
};

export default RoadForm;