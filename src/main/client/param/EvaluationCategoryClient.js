import BaseClient from "../BaseClient";

class EvaluationCategoryClient {
    //获取评定分类树
    static listEvaluationCategoryTrees() {
        return BaseClient.get("/bridge-param/evaluation-categories");
    }

    //新增评定指标分类
    static insertEvaluationCategory = category => {
        return BaseClient.post("/bridge-param/evaluation-categories", category);
    };

    //更新评定指标分类
    static updateEvaluationCategory = (id, category) => {
        return BaseClient.put(`/bridge-param/evaluation-categories/${id}`, category);
    };

    //删除评定指标分类
    static deleteEvaluationCategory = id => {
        return BaseClient.delete(`/bridge-param/evaluation-categories/${id}`);
    };
}

export default EvaluationCategoryClient;