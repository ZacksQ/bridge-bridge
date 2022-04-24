import BaseClient from "../BaseClient";
import {BRIDGE_SERVICE,BEIDGE_PARAM} from "../../config";

class clientHome {
    static getBridgeExpData = () =>{
        return BaseClient.get(`/bridge/explain/list`)
    }

    static addBridgeExp = postData => {
        return BaseClient.post(`/bridge/explain/add`, postData, true)
    }

    static delBridgeExp = idList  =>{
        return BaseClient.post(`/bridge/explain/delete`, idList)
    }
}

export default clientHome;