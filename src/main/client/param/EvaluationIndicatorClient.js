import BaseClient from "../BaseClient";
import {normalizePageData} from "../../util/PageUtils";

class EvaluationIndicatorClient {
    //获取分类下的所有指标
    static listEvaluationIndicatorsByCategory = categoryIndex => {
        return BaseClient.get(`/bridge-param/evaluation-categories/${categoryIndex}/evaluation-indicators`);
    };

    //获取评定指标分页
    static getEvaluationIndicatorPage = pageData => {
        return BaseClient.get("/bridge-param/evaluation-indicators", normalizePageData(pageData));
    };

    //新增评定指标
    static insertEvaluationIndicator = indicator => {
        return BaseClient.post("/bridge-param/evaluation-indicators", indicator);
    };

    //更新评定指标
    static updateEvaluationIndicator = (id, indicator) => {
        return BaseClient.put(`/bridge-param/evaluation-indicators/${id}`, indicator);
    };

    //删除评定指标
    static deleteEvaluationIndicator = id => {
        return BaseClient.delete(`/bridge-param/evaluation-indicators/${id}`);
    };
}

export default EvaluationIndicatorClient;