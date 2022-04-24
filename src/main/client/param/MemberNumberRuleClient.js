import BaseClient from "../BaseClient";

class MemberNumberRuleClient {

    //通过ID获取构件编号规则
    static getMemberNumberRuleById = id => {
        return BaseClient.get(`/bridge-param/member-number-rules/${id}`);
    };

    //列出构件的编号规则
    static listMemberNumberRules = () => {
        return BaseClient.get("/bridge-param/member-number-rules");
    };
    //新增构件编号规则
    static insertMemberNumberRule = rule => {
        return BaseClient.post("/bridge-param/member-number-rules", rule);
    };
    //更新构件编号规则
    static updateMemberNumberRule = (id, rule) => {
        return BaseClient.put(`/bridge-param/member-number-rules/${id}`, rule);
    };
    //删除构件编号规则
    static deleteMemberNumberRule = id => {
        return BaseClient.delete(`/bridge-param/member-number-rules/${id}`);
    };
}

export default MemberNumberRuleClient;