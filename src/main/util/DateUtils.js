import moment from "moment";

/** 转换为日期 */
function toDate(obj, dateProp) {
    return obj && obj[dateProp] ? moment(obj[dateProp]) : undefined;
}

export {toDate}