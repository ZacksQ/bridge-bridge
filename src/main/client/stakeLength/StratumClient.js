import BaseClient from "../BaseClient";
import { normalizePageData } from "../../util/PageUtils";

class StratumClient {

    static getStratumData = pageData => {
        return BaseClient.get("/pile-len/calc/stratum/list", normalizePageData(pageData));
    };

    static uploadStratumData = file => {
        return BaseClient.post('/pile-len/calc/stratum/upload', file)
    }

    static editStratumData = postData => {
        return BaseClient.post('/pile-len/calc/stratum/update', postData)
    }

    static delStratumData = id => {
        return BaseClient.post('/pile-len/calc/stratum/delete', id)
    }

    static getDrillList = () => {
        return BaseClient.get('/pile-len/calc/drill/list')
    }

    static uploadSliceFile = (file, isFormData, extHeader) => {
        return BaseClient.post('/pile-len/calc/hole-info/upload', file, isFormData, extHeader)
    }

    static getGeologyView = imgFileId => {
        return BaseClient.get(`/pile-len/calc/geology/view?imgFileId=${imgFileId}`)
    }

    static delHole = drillId => {
        return BaseClient.get(`/pile-len/calc/hole/delete?drillId=${drillId}`)
    }

    //轮训分片上传进度
    static getUploadProcess = taskId => {
        return BaseClient.get(`/pile-len/calc/upload/progress?taskId=${taskId}`)
    }
}


export default StratumClient;