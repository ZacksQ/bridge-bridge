import BaseClient from "../BaseClient";

class DictionaryClient {
    //通过ID获取字典组
    static getDictionaryGroupById = dictype => {
        return BaseClient.get(`/sys/dict/list?dictCode=`+dictype);
    }

}

export default DictionaryClient;