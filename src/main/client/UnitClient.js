import BaseClient from "./BaseClient";

class UnitClient {
    //获取单位树
    static listUnitTrees = () => {
        return BaseClient.get("/auth-service/units/trees");
    };

    //新增单位
    static insertUnit = unit => {
        return BaseClient.post("/auth-service/units", unit);
    };

    //更新单位
    static updateUnit = unit => {
        return BaseClient.put(`/auth-service/units/${unit.id}`, unit);
    };

    //删除单位
    static deleteUnit = id => {
        return BaseClient.delete(`/auth-service/units/${id}`);
    }
}

export default UnitClient;