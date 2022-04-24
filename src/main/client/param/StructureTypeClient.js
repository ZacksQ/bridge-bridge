import BaseClient from "../BaseClient";

class StructureTypeClient {

    //通过ID获取结构形式
    static getStructureTypeById = id => {
        return BaseClient.get(`/bridge-param/structure-types/${id}`);
    };

    //获取所有结构形式
    static listStructureTypes = () => {
        return BaseClient.get("/bridge-param/structure-types");
    };

    //新增结构形式
    static insertStructureType = structureType => {
        return BaseClient.post("/bridge-param/structure-types", structureType);
    };

    //更新结构形式
    static updateStructureType = (id, structureType) => {
        return BaseClient.put(`/bridge-param/structure-types/${id}`, structureType);
    };

    //删除结构形式
    static deleteStructureType = id => {
        return BaseClient.delete(`/bridge-param/structure-types/${id}`);
    }
}

export default StructureTypeClient;