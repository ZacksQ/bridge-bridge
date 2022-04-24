import BaseClient from "../BaseClient";
import {normalizePageData} from "../../util/PageUtils";

class PartTypeClient {

    //列出部件树
    static listPartTypeTrees = () => {
        return BaseClient.get("/bridge-param/part-types/trees");
    }

    //列出部位下的部件类型
    static listPartTypesByPosition = positionTypeCode => {
        return BaseClient.get(`/bridge-param/position-types/${positionTypeCode}/part-types`);
    };

    //获取部件类型分页数据
    static getPartTypePage = pageData => {
        return BaseClient.get("/bridge-param/part-types", normalizePageData(pageData));
    }

    //通过ID获取部件类型
    static getPartTypeById = id => {
        return BaseClient.get(`/bridge-param/part-types/${id}`);
    }

    //新增部件
    static insertPartType = partType => {
        return BaseClient.post("/bridge-param/part-types", partType);
    };

    //更新部件
    static updatePartType= (id, partType) => {
        return BaseClient.put(`/bridge-param/part-types/${id}`, partType);
    };

    //删除部件
    static deletePartType = id => {
        return BaseClient.delete(`/bridge-param/part-types/${id}`);
    };
}

export default PartTypeClient;