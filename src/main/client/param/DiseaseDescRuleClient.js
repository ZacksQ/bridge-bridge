import BaseClient from "../BaseClient";

class DiseaseDescRuleClient {
    //通过ID获取病害描述
    static getDiseaseDescRuleById = id => {
        return BaseClient.get(`/bridge-param/disease-desc-rules/${id}`);
    }
    //查询所有的病害描述规则
    static listDiseaseDescRules = () => {
        return BaseClient.get("/bridge-param/disease-desc-rules");
    };
    //新增病害描述规则
    static insertDiseaseDescRule = rule => {
        return BaseClient.post("/bridge-param/disease-desc-rules", rule);
    };
    //更新病害描述规则
    static updateDiseaseDescRule = (id, rule) => {
        return BaseClient.put(`/bridge-param/disease-desc-rules/${id}`, rule);
    };
    //删除病害描述规则
    static deleteDiseaseDescRule = id => {
        return BaseClient.delete(`/bridge-param/disease-desc-rules/${id}`);
    };
}

export default DiseaseDescRuleClient;