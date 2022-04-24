/**
 * 是否是自己或者是父节点
 * @param childCode 子节点
 * @param parentCode 父节点
 * @returns {boolean} true-是，false-否
 */
import {deepCopy} from "./ObjectUtils";

const isSelfOrParent = (childCode, parentCode) => {
    return new RegExp("^" + parentCode + ".*$").test(childCode);
};

/**
 * 遍历树结构数据
 * @param treeData 树结构数据
 * @param visitor 访问者对象
 */
const walkTree = (treeData, visitor) => {
    treeData.forEach(d => {
        visitor(d);
        if (Array.isArray(d.children)) {
            walkTree(d.children, visitor);
        }
    });
};

/**
 * 将树结构数据展平
 * @param treeData 树结构数据
 * @param ignoreRoot 展平时是否忽略根节点
 * @returns [] 展平后的数据
 */
const flatten = (treeData, ignoreRoot) => {
    const result = [];
    treeData.forEach(d => {
        if (!ignoreRoot) {
            result.push({...d, children: undefined});
        }
        if (Array.isArray(d.children) && d.children.length > 0) {
            flatten(d.children).forEach(c => result.push(c));
        }
    });
    return result;
};

/**
 * 从树结构中删除指定keys,补集
 * @param treeData 树数据
 * @param targetKeys 目标keys
 */
const complement = (treeData, targetKeys) => {
    if (Array.isArray(targetKeys)) {
        const treeDataClone = deepCopy(treeData);
        removeAll(treeDataClone, targetKeys);
        return treeDataClone;
    } else {
        return treeData;
    }
}

/**
 * 移除树结构中所有相关key的节点
 * @param treeData 树结构数据
 * @param targetKeys 需要移除的keys
 */
const removeAll = (treeData, targetKeys) => {
    treeData.forEach((d, index) => {
        if (targetKeys.indexOf(d.key) >= 0) {
            treeData.splice(index, 1);
        }
        if (Array.isArray(d.children) && d.children.length > 0) {
            removeAll(d.children, targetKeys);
        }
    });
}

/**
 * 将编码按长度转为数组
 * @param code 编码
 * @param codeIncrement 编码增长长度
 */
function toCodePaths(code, codeIncrement) {
    const arr = [];
    for (let i = codeIncrement; i <= code.length; i += codeIncrement) {
        arr.push(code.substr(0, i));
    }
    return arr;
}

export {
    isSelfOrParent,
    walkTree,
    flatten,
    complement,
    toCodePaths
}