/**
 * 以templateArr为模板，进行差异化合并
 * @param templateArr 模板数组，最终数组项以它为主
 * @param detailArr 详细信息数组，重复项以它的为主
 * @param compareFunc 数组项相等性测试函数
 */
const diffMerge = (templateArr, detailArr, compareFunc) => {
    const result = [];
    templateArr.forEach(ta => {
        const exists = detailArr.filter(da => compareFunc(ta, da));
        if (exists.length === 0) {
            result.push({...ta});
        } else {
            result.push({...exists[0]});
        }
    });
    return result;
}

/**
 * targetArr与compareArr取交集
 * @param targetArr 最终交集内容以它为主
 * @param compareArr 作为对比用
 * @param compareFunc 相等性测试函数
 */
const intersection = (targetArr, compareArr, compareFunc) => {
    const result = [];
    targetArr.forEach(ta => {
        if (compareArr.some(da => compareFunc(ta, da))) {
            result.push({...ta});
        }
    });
    return result;
}

export {
    diffMerge,
    intersection
};