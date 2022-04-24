import BaseClient from "../BaseClient";

class BridgeGroupClient {
    static getBridgeGroupList = () => {
        return BaseClient.get(`/pile-len/calc/bridge/group`)
    }

    static saveBridgeGroup = groupName => {
        return BaseClient.get(`/pile-len/calc/group/save?groupName=${groupName}`)
    }

    static delBridgeGroup = id => {
        return BaseClient.post(`/pile-len/calc/group/delete`, id)
    }

    static getBridgeBaseInfo = groupId => {
        return BaseClient.get(`/pile-len/calc/group/base-info?groupId=${groupId}`)
    }
    //查看桥梁结果汇总
    static getBridgeResult = groupId =>  {
        return BaseClient.get(`/pile-len/calc/group/result?groupId=${groupId}`)
    }

    static saveBridgeBaseInfo = data =>  {
        return BaseClient.post(`/pile-len/calc/group/base-info/save`, data)
    }

    static delBridgeRow = summaryId => {
        return BaseClient.get(`/pile-len/calc/summary/delete?summaryId=${summaryId}`)
    }

    static changeHole = data => {
        return BaseClient.post(`/pile-len/calc/change/hole`, data)
    }

    //桩长计算表
    static calcTableData = params => {
        return BaseClient.get(`/pile-len/calc/result/table`, params)
    }

    static calcTableDataChange = postData => {
        return BaseClient.post(`/pile-len/calc/table/change`, postData)
    }

    static getBridgePierNoList = groupId => {
        return BaseClient.get(`/pile-len/calc/summary/hole?groupId=${groupId}`)
    }

    static getBridgePierNoBySpanComb = spanComb => {
        return BaseClient.get(`/pile-len/calc/group/span?spanComb=${spanComb}`)
    }
}

export default BridgeGroupClient;