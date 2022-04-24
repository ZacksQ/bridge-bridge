import BaseClient from "./BaseClient";

class RoleClient {
    //获取系统下的所有角色
    static listRoleBySystem = systemId => {
        return BaseClient.get(`/auth-service/systems/${systemId}/roles`);
    };

    //获取角色树
    static listRoleTrees = () => {
        return BaseClient.get("/auth-service/roles/trees");
    };

    //根据ID获取角色
    static getRoleById = id => {
        return BaseClient.get(`/auth-service/roles/${id}`);
    };

    //新增角色
    static insertRole = role => {
        return BaseClient.post("/auth-service/roles", role);
    };

    //更新角色
    static updateRole = role => {
        return BaseClient.put(`/auth-service/roles/${role.id}`, role);
    };

    //删除角色
    static deleteRole = id => {
        return BaseClient.delete(`/auth-service/roles/${id}`);
    };
}

export default RoleClient;