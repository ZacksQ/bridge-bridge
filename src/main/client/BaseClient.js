import { ACTIVE_PROFILE, SERVER_URL, TEST_SERVER_URL } from "../config";
import { Modal } from "antd";
import StoreContext from "../store"
import { clearAuth } from "../store/action/AuthAction";

const store = StoreContext.store;

const HttpStatus = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
};

class BaseClient {
    static get = (url, params) => {
        return new Promise((resolve, reject) => {
            const requestParams = toRequestParams(params);
            if (requestParams) url += "?" + requestParams;
            const request = getHttpRequest(url, "get", resolve, reject);
            request.send(null);
        });
    };

    static post = (url, data, formData, extHeader) => {
        let postData = null
        if (formData) {
            postData = new FormData()
            for (let i in data) {
                postData.append(i, data[i])
            }
        } else {
            postData = data
        }

        return new Promise((resolve, reject) => {
            const request = getHttpRequest(url, "post", resolve, reject);
            // request.timeout = 100000
            extHeader && Array.isArray(extHeader) && extHeader.forEach(item=>{
                request.setRequestHeader(item.header, item.value)
            })
            sendData(request, postData);
        });
    };

    static put = (url, data) => {
        return new Promise((resolve, reject) => {
            const request = getHttpRequest(url, "put", resolve, reject);
            sendData(request, data);
        })
    };

    static delete = (url, data) => {
        return new Promise((resolve, reject) => {
            const request = getHttpRequest(url, "delete", resolve, reject);
            sendData(request, data);
        });
    };

    static download = (url, fileName, params) => {
        return new Promise((resolve, reject) => {
            const requestParams = toRequestParams(params);
            if (requestParams) url += "?" + requestParams;
            const request = getHttpDownloadRequest(url, fileName, resolve, reject);
            request.send();
        });
    };
}

function getHttpRequest(url, method, resolve, reject) {
    const request = new XMLHttpRequest();
    request.withCredentials = true
    request.onload = () => {
        if (request.status === HttpStatus.OK) {
            if(request.response){
                let resolveValue = ''
                try{
                    resolveValue = JSON.parse(request.response)
                }catch{
                    resolve(request.response)
                }
                resolve(resolveValue)
            }
            // resolve(request.response ? JSON.parse(request.response) : "");
        } else {
            handleError(request, reject);
        }
    };
    request.onerror = e => {
        handleError(request, reject);
    };
    request.ontimeout = e => {
        handleError(request, reject);
    };
    request.open(method, absoluteUrl(url), true);
    if (store.getState().auth.token) request.setRequestHeader("Authorization", "Bearer " + store.getState().auth.token);
    request.setRequestHeader("Access-Control-Allow-Credentials", true)
    return request;
}

function getHttpDownloadRequest(url, fileName, resolve, reject) {
    const request = new XMLHttpRequest();
    // request.withCredentials = true
    // ?????????????????????????????????????????????????????????????????????/????????????????????????
    request.onload = function () {
        // ????????????
        if (this.status === HttpStatus.OK) {
            const blob = this.response;
            const reader = new FileReader();
            reader.readAsDataURL(blob);    // ?????????base64
            reader.onload = function (e) {
                // ???????????????????????????a??????????????????
                const a = document.createElement('a');
                a.download = fileName;
                a.href = e.target.result;
                document.body.append(a);    // ??????firefox???????????????click
                a.click();
                document.body.removeChild(a);
                resolve({ success: true });
            }
        }
    };
    request.onerror = e => {
        handleError(request, reject);
    };
    request.ontimeout = e => {
        handleError(request, reject);
    };
    request.open("get", absoluteUrl(url), true);
    request.responseType = "blob";
    if (store.getState().auth.token) request.setRequestHeader("Authorization", "Bearer " + store.getState().auth.token);
    return request;
}

function sendData(request, data) {
    // request.withCredentials = true
    if (data instanceof FormData) {
        //?????????????????????content-type??????????????????????????????boundary
        request.send(data);
    } else {
        request.setRequestHeader("content-type", "application/json;charset=utf-8"); //??????????????????????????? ?????????????????????415??????
        // request.setRequestHeader("Access-Control-Allow-Credentials", true);
        // request.setRequestHeader("Access-Control-Allow-Methods", "*");
        // request.setRequestHeader("Access-Control-Allow-Origin", "http://218.94.57.151:8087")
        // request.setRequestHeader("Access-Control-Max-Age", 60000)

        // request.withCredentials = true 
        request.send(JSON.stringify(data, (key, value) => {
            if (Array.isArray(value)) {
                return value.length > 0 ? value : undefined;
            } else {
                return value !== null ? value : undefined;
            }
        }));
    }
}

function handleError(request, reject) {
    console.log(request, 'request')
    try {
        let data = JSON.parse(request.response)
        switch (request.status) {
            case HttpStatus.UNAUTHORIZED:
                showWarn("??????", "???????????????????????????????????????", () => {
                    reject(request.status);
                    store.dispatch(clearAuth());
                });
                break;
            case HttpStatus.BAD_REQUEST:
                showWarn("??????", request.response, () => reject(request.status));
                break;
            case HttpStatus.FORBIDDEN:
                showWarn("??????", "??????????????????????????????????????????", () => reject(request.status));
                break;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                showWarn("??????", data.message || "??????????????????????????????????????????", () => reject(request.status));
                break;
            default:
                showWarn("??????", "?????????????????????????????????", () => reject(request.status));
                break;
        }
    } catch (e) {
        console.log("error", e)
    }
}

//???????????????????????????
let warnCounter = 0;
function showWarn(title, content, onOk) {
    if (warnCounter === 0) {
        warnCounter = 1;
        Modal.warning({
            title, content, onOk: () => {
                warnCounter = 0;
                onOk();
            }
        });
    }
}

function absoluteUrl(url) {
    return (ACTIVE_PROFILE === "dev" ? TEST_SERVER_URL : SERVER_URL) + url;
}

/**
 * ??????????????????????????????
 * @param data ???????????????
 */
function toRequestParams(data) {
    if (!data) return "";
    let requestParams = "";
    Object.keys(data).forEach(k => {
        if (data[k] !== undefined && data[k] != null) {
            let value = ""
            if (typeof data[k] == "object") {
                value = encodeURIComponent(JSON.stringify(data[k]));
            } else {
                value = encodeURIComponent(data[k]);
            }
            requestParams += k + "=" + value;
            requestParams += "&";
        }
    });
    if (requestParams.endsWith("&")) requestParams = requestParams.substring(0, requestParams.length - 1);
    return requestParams;
}

export { HttpStatus };
export default BaseClient;