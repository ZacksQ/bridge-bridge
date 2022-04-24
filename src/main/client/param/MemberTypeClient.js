import BaseClient from "../BaseClient";
import {normalizePageData} from "../../util/PageUtils";

class MemberTypeClient {
    //获取部件下的构件类型
    static listMemberTypesByPart = partTypeCode => {
        return BaseClient.get(`/bridge-param/part-types/${partTypeCode}/member-types`);
    }

    //获取上部结构关联的构件类型
    static listMemberTypesBySuperstructure = superstructureTypeId => {
        return BaseClient.get(`/bridge-param/superstructure-types/${superstructureTypeId}/member-types`);
    };

    //通过ID获取构件类型
    static getMemberTypeById = id => {
        return BaseClient.get(`/bridge-param/member-types/${id}`);
    }

    //获取构件分页数据
    static getMemberTypePage = pageData => {
        return BaseClient.get("/bridge-param/member-types", normalizePageData(pageData));
    };

    //新增默认的构件类型
    static insertMemberType = memberType => {
        return BaseClient.post("/bridge-param/member-types", memberType);
    };

    //更新构件类型
    static updateMemberType = (id, memberType) => {
        return BaseClient.put(`/bridge-param/member-types/${id}`, memberType);
    }

    //删除构件类型
    static deleteMemberType = id => {
        return BaseClient.delete(`/bridge-param/member-types/${id}`);
    }

    //获取构件关联的病害
    static listMemberDiseases = (memberClass, superstructureTypeId, memberTypeId) => {
        return BaseClient.get(`/bridge-param/member-types/${memberTypeId}/disease-types`, {memberClass, superstructureTypeId});
    }

    //新增构件关联的病害
    static insertMemberDisease = data => {
        return BaseClient.post("/bridge-param/member-types/disease-types", data);
    };

    //删除构件关联的病害
    static deleteMemberDisease = (memberTypeId, data) => {
        return BaseClient.delete(`/bridge-param/member-types/${memberTypeId}/disease-types`, data);
    }
}

export default MemberTypeClient;