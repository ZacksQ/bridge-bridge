import BaseClient from "../BaseClient";

class PositionTypeClient {
    //获取所有部位
    static listPositionTypes = () => {
        return BaseClient.get("/bridge-param/position-types");
    };
    //根据ID获取部位
    static getPositionTypeById = id => {
        return BaseClient.get(`/bridge-param/position-types/${id}`);
    }
    //新增部位
    static insertPositionType = positionType => {
        return BaseClient.post("/bridge-param/position-types", positionType);
    };
    //更新部位
    static updatePositionType = (id, positionType) => {
        return BaseClient.put(`/bridge-param/position-types/${id}`, positionType);
    }
    //删除部位
    static deletePositionType = id => {
        return BaseClient.delete(`/bridge-param/position-types/${id}`);
    }
}

export default PositionTypeClient;