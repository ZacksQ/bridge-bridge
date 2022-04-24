import BaseClient from "../BaseClient";
import {normalizePageData} from "../../util/PageUtils";

class DiseaseTypeClient {
    //获取病害类型分页
    static getDiseaseTypePage = pageData => {
        return BaseClient.get("/bridge-param/disease-types", normalizePageData(pageData));
    };

    //通过id获取病害类型
    static getDiseaseTypeById = id => {
        return BaseClient.get(`/bridge-param/disease-types/${id}`);
    };

    //根据分类获取病害类型
    static listDiseaseTypesByCategory = categoryIndex => {
        return BaseClient.get(`/bridge-param/evaluation-categories/${categoryIndex}/disease-types`);
    }

    //新增病害类型
    static insertDiseaseType = diseaseType => {
        return BaseClient.post("/bridge-param/disease-types", diseaseType);
    };

    //更新病害类型
    static updateDiseaseType = (id, diseaseType) => {
        return BaseClient.put(`/bridge-param/disease-types/${id}`, diseaseType);
    };

    //删除病害类型
    static deleteDiseaseType = id => {
        return BaseClient.delete(`/bridge-param/disease-types/${id}`);
    }
}

export default DiseaseTypeClient;