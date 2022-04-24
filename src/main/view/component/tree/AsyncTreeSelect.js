import React, {useState} from "react";
import {TreeSelect} from "antd";

const AsyncTreeSelect = ({treeData, defaultExpandAll, defaultExpandLevel, keyProp, labelProp, ...restProps}) => {
    //组件状态
    const [expandedKeys, setExpandedKeys] = useState([]);
    //处理展开事件
    const handleExpand = expandedKeys => {
        setExpandedKeys(expandedKeys);
    };
    let mutableExpandKeys = expandedKeys;
    //展开情况
    // if (expandedKeys.length === 0) {
    //     if (defaultExpandAll) {
    //         mutableExpandKeys = getAllExpandedKeys(treeData, keyProp, labelProp);
    //     } else if (defaultExpandLevel) {
    //         mutableExpandKeys = getExpandedLevelKeys(treeData, 0, defaultExpandLevel, keyProp, labelProp);
    //     }
    // }
    //渲染
    return (
        <TreeSelect treeData={treeData} expandedKeys={mutableExpandKeys} onExpand={handleExpand} {...restProps}/>
    )
};
//
// //获取对应展开层级的key
// function getExpandedLevelKeys(treeData, count, level, keyProp = "key", labelProp = "title") {
//     let keys = [];
//     if (Array.isArray(treeData) && count < level) {
//         treeData.forEach(d => {
//             keys.push(d[keyProp]);
//             if (Array.isArray(d.children) && d.children.length > 0) {
//                 keys = [...keys, ...getExpandedLevelKeys(d.children, count + 1, level, keyProp, labelProp)];
//             }
//         });
//     }
//     return keys;
// }
//
// //获取所有展开的key
// function getAllExpandedKeys(treeData, keyProp = "key", labelProp = "title") {
//     let keys = [];
//     if (Array.isArray(treeData)) {
//         treeData.forEach(d => {
//             keys.push(d[keyProp]);
//             if (Array.isArray(d.children) && d.children.length > 0) {
//                 keys = [...keys, ...getAllExpandedKeys(d.children, keyProp, labelProp)];
//             }
//         });
//     }
//     return keys;
// }

export default AsyncTreeSelect;