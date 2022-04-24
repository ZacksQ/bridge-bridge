import React from "react";
import {Transfer, Tree} from "antd";
import {complement, flatten} from "../../../util/TreeUtils";

/**
 * 树结构穿梭框
 * @param targetKeys 选中的key
 * @param treeData 树结构数据
 * @param onChange 选择结果变化事件, 参数为选中的keys
 * @param restProps 剩余的属性
 */
const TreeTransfer = ({targetKeys, treeData, onChange, ...restProps}) => {
    const complementTreeData = complement(treeData, targetKeys);
    return (
        <Transfer dataSource={flatten(treeData, true)}
                  targetKeys={targetKeys}
                  render={item => item.title}
                  listStyle={() => ({width: 200, height: 300, overflow: "auto"})}
                  onChange={onChange}
                  showSelectAll={false}
                  {...restProps}>
            {({ direction, onItemSelect, selectedKeys}) => {
                if (direction === 'left') {
                    return (
                        <Tree
                            treeData={complementTreeData}
                            selectedKeys={[]}
                            checkedKeys={selectedKeys}
                            onCheck={(checkedKeys, e) => onItemSelect(e.node.key, e.checked)}
                            checkable
                            selectable={false}
                            blockNode
                            checkStrictly
                            defaultExpandAll/>
                    );
                }
            }}
        </Transfer>
    )
};

export default TreeTransfer;