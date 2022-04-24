import {Modal} from "antd"
import {clearToken} from "../store/action/AuthAction"
import StoreContext from "../store"
import {inspectionUrl} from "../client/config/ServerUrl";

const store = StoreContext.store;

let warnCounter = 0;

/** HTTP请求状态列表 */
const STATUS = {
    OK:200,
    NON_AUTHORITATIVE_INFORMATION: 203,
    UNAUTHORIZED: 401,
    METHOD_NOT_ALLOWED: 405
};

/** 发起GET请求 */
function GET(url, params, token) {
    return new Promise((resolve, reject) => {
        let requestParams = toRequestParams(params);
        if (!!requestParams) url += "?" + requestParams;
        let request = getHttpRequest({url, method:"get", resolve, reject});
        request.send(null);
    });
}

/** 发起POST请求 */
function POST(url, data, isFormData) {
    return new Promise((resolve, reject) => {
        let request = getHttpRequest({url, method:"post", resolve, reject});
        if (isFormData) {
            request.send(data);
        } else {
            request.setRequestHeader("content-type", "application/json;charset=UTF-8");
            request.send(JSON.stringify(data));
        }
    });
}

/** 发起PUT请求 */
function PUT(url, data, isFormData) {
    return new Promise((resolve, reject) => {
        let request = getHttpRequest({url, method:"put", resolve, reject});
        if (isFormData) {
            request.send(data);
        } else {
            request.setRequestHeader("content-type", "application/json;charset=UTF-8");
            request.send(JSON.stringify(data));
        }
    });
}

/** 发起PATCH请求 */
function PATCH(url, data, isFormData) {
    return new Promise((resolve, reject)=>{
        fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json;charset=UTF-8',
                "Authorization": "Bearer " + store.getState().auth.token
            }
        }).then(response=>{
            if(response.ok){
                resolve(response.json())
            }else{
                reject(response.json())
            }
        });
    })
}

/** 发起DELETE请求 */
function DELETE(url, data) {
    return new Promise((resolve, reject) => {
        let request = getHttpRequest({url, method:"delete", resolve, reject});
        request.setRequestHeader("content-type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(data));
    });
}

/** 获取Http请求对象 */
function getHttpRequest({url,
                            method,
                            responseType = "json",
                            resolve,
                            reject}) {
    let request = new XMLHttpRequest();
    //这几个方法应该出现在open之前
    request.onload = function() {
        if (this.status === STATUS.OK && this.response && this.response.success) {
            resolve(this.response);
        } else {
            // reject(this.status);
            reject(this.response);
            if (this.status === STATUS.UNAUTHORIZED) {
                warn("登录信息已失效，请重新登录", () => store.dispatch(clearToken()));
            }
        }
    };
    request.onerror = function(e) {
        reject(e);
        // warn("请检查网络是否可用或联系系统管理员");
    };
    request.ontimeout = function(e) {
        reject(e);
        warn("连接超时，请检查网络是否可用！");
    };
    request.open(method, url, true);
    request.responseType = responseType;
    if (store.getState().auth.token) {
        request.setRequestHeader("Authorization", "Bearer " + store.getState().auth.token);
    }
    return request;
}

/* 给promise注册一个finally方法 */
// eslint-disable-next-line
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value  => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {throw reason})
    );
};

/**
 * 对象转换为请求字符串
 * @param data 请求的对象
 */
function toRequestParams(data) {
    if (!data) return"";
    let requestParams = "";
    Object.keys(data).forEach(k => {
        requestParams += k;
        if (data[k] !== undefined && data[k] != null) requestParams += "=" + encodeURIComponent(data[k]);
        requestParams += "&";
    });
    if (requestParams.endsWith("&")) requestParams = requestParams.substring(0, requestParams.length - 1);
    return requestParams;
}

/** 警告提示 */
function warn(content, onOk) {
    if (warnCounter === 0) {
        warnCounter++;
        Modal.warn({
            title: "提示",
            visible: warnCounter === 0,
            content: content,
            onOk: () => {
                warnCounter--;
                if (typeof onOk === "function") onOk();
            }
        });
    }
}

export {
    STATUS,
    GET,
    POST,
    PUT,
    DELETE,
    PATCH
}