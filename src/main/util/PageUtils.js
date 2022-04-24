/** 将分页数据标准化，去掉数据项，JSON字符串化查询数据 */
const normalizePageData = pageData => {
    return {...pageData, data: undefined, searchData: JSON.stringify(pageData.searchData)};
};

export {
    normalizePageData
}