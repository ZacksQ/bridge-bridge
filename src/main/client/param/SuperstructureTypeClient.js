import BaseClient from "../BaseClient";
import {normalizePageData} from "../../util/PageUtils";

class SuperstructureTypeClient {
    //获取上部结构分页
    static getSuperstructureTypePage = pageData => {
        return BaseClient.get("/bridge-param/superstructure-types", normalizePageData(pageData));
    };

    //根据结构形式获取上部结构类型
    static listSuperstructureTypesByStructure = structureTypeId => {
        return BaseClient.get(`/bridge-param/structure-types/${structureTypeId}/superstructure-types`);
    };

    //通过ID获取上部结构类型
    static getSuperstructureTypeById = id => {
        return BaseClient.get(`/bridge-param/superstructure-types/${id}`);
    };

    //新增上部结构类型
    static insertSuperstructureType = superstructureType => {
        return BaseClient.post("/bridge-param/superstructure-types", superstructureType);
    };

    //更新上部结构类型
    static updateSuperstructureType = (id, superstructureType) => {
        return BaseClient.put(`/bridge-param/superstructure-types/${id}`, superstructureType);
    }

    //删除上部结构类型
    static deleteSuperstructureType = id => {
        return BaseClient.delete(`/bridge-param/superstructure-types/${id}`);
    }
}

export default SuperstructureTypeClient;