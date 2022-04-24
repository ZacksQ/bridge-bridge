/**
 * 获取对象属性，obj或prop不存在则返回undefined
 * @param obj 目标对象，可以为空
 * @param prop 目标属性
 */
function getProperty(obj, prop) {
    return obj ? obj[prop] : undefined;
}

/**
 * 把数据转为数组
 * @param data  待包为数组的数据
 * @returns {*}
 */
function wrapToArr(data) {
    return data ? [data] : undefined;
}

/**
 * 深度拷贝对象
 * @param target 拷贝对象
 */
function deepCopy(target) {
    return JSON.parse(JSON.stringify(target));
}


function hasValue(target, value) {
    let searchArr = value.split(" ");
    return searchArr.every(s => Object.keys(target).some(k =>typeof target[k] === "string" && target[k].indexOf(s) >= 0));
}

function getFieldValue(target, field, defaultValue) {
    if (!target || target[field] === undefined || target[field] === null) {
        return defaultValue ? defaultValue : undefined;
    } else {
        return target[field];
    }
}

function nvl(data, ifNullOrUndefine) {
    return data ? data : ifNullOrUndefine;
}

function createObject(targetObject = {}, keys = [], arrayKey) {
    if(!targetObject) targetObject = {};
    if(keys.length > 0){
        let key = keys[0];
        if(!isNullOrUndefined(key) && !targetObject[key]) targetObject[key] = {};
        keys.splice(0, 1);
        createObject(targetObject[key], keys, arrayKey);
    }else if(!isNullOrUndefined(arrayKey) && !targetObject[arrayKey]){
        targetObject[arrayKey] = [];
    }
    return targetObject;
}

function isNullOrUndefined(target) {
    return !target && target !== "" && target !== 0;
}

export {
    getProperty,
    wrapToArr,
    deepCopy,
    hasValue,
    getFieldValue,
    nvl,
    createObject,
    isNullOrUndefined
}