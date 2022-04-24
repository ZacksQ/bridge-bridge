import {isSelfOrParent} from "./TreeUtils";

const codeValidator = (codeLength, errorMsg) => {
    return (rule, value) => {
        if (new RegExp("^\\d{" + codeLength +"}$", "g").test(value)) {
            return Promise.resolve();
        } else {
            return Promise.reject(errorMsg ? errorMsg : "编码必须由" + codeLength + "位数字组成");
        }
    }
};

//父级校验器工厂，校验是否是自己或自己的子菜单
const parentValidator = initialData => {
    return (rule, value) => {
        if (initialData && value && isSelfOrParent(value, initialData.key)) {
            return Promise.reject("不能选择自己或子级");
        } else {
            return Promise.resolve();
        }
    };
};

export {
    codeValidator,
    parentValidator
}