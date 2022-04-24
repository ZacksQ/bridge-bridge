import BaseClient from "../BaseClient";
import {normalizePageData} from "../../util/PageUtils";

class RoadSwitchClient {

    static getRoadList = params => {
        return BaseClient.post(`/route/list`, normalizePageData(params));
    };

    static editRoad = data =>{
        return BaseClient.post(`/route/add`, data)
    }

    static delRoad = ids => {
        return BaseClient.post(`/route/delete`, ids)
    }

    static switchRoad = rid => {
        return BaseClient.get(`/route/switch?rid=${rid}`)
    }
}

export default RoadSwitchClient;