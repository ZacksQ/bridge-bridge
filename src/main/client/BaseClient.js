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
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    request.onload = function () {
        // 请求完成
        if (this.status === HttpStatus.OK) {
            const blob = this.response;
            const reader = new FileReader();
            reader.readAsDataURL(blob);    // 转换为base64
            reader.onload = function (e) {
                // 转换完成，创建一个a标签用于下载
                const a = document.createElement('a');
                a.download = fileName;
                a.href = e.target.result;
                document.body.append(a);    // 修复firefox中无法触发click
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
        //此处不需要设置content-type，要不然需要手动设置boundary
        request.send(data);
    } else {
        request.setRequestHeader("content-type", "application/json;charset=utf-8"); //设置头后报跨域错误 不设置验证码报415错误
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
                showWarn("提示", "登录信息失效，请重新登录！", () => {
                    reject(request.status);
                    store.dispatch(clearAuth());
                });
                break;
            case HttpStatus.BAD_REQUEST:
                showWarn("提示", request.response, () => reject(request.status));
                break;
            case HttpStatus.FORBIDDEN:
                showWarn("提示", "没有权限，请联系系统管理员！", () => reject(request.status));
                break;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                showWarn("提示", data.message || "服务器发生错误，请联系管理员", () => reject(request.status));
                break;
            default:
                showWarn("提示", "网络错误，请稍后重试！", () => reject(request.status));
                break;
        }
    } catch (e) {
        console.log("error", e)
    }
}

//防止反复弹出对话框
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
 * 对象转换为请求字符串
 * @param data 请求的对象
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