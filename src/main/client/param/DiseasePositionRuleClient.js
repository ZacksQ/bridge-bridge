import BaseClient from "../BaseClient";

class DiseasePositionRuleClient {

    static getDiseasePositionRuleById = id => {
        return BaseClient.get(`/bridge-param/disease-position-rules/${id}`);
    }

    //列出所有病害位置规则
    static listDiseasePositionRules = () => {
        return BaseClient.get("/bridge-param/disease-position-rules");
    };
    //新增病害位置规则
    static insertDiseasePositionRule = rule => {
        return BaseClient.post("/bridge-param/disease-position-rules", rule);
    };
    //更新病害位置规则
    static updateDiseasePositionRule = (id, rule) => {
        return BaseClient.put(`/bridge-param/disease-position-rules/${id}`, rule);
    };
    //删除病害位置规则
    static deleteDiseasePositionRule = id => {
        return BaseClient.delete(`/bridge-param/disease-desc-rules/${id}`);
    };
}

export default DiseasePositionRuleClient;