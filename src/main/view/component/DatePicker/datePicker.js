import React from "react";
import {DatePicker} from "antd";
import moment from "moment";
import {getLocalTime} from "../../../util/publicMethods";
const DatePickerPlus = props=>{
const {
  value,
  defaultValue,
  ...rest
} = props
  let dateValue
  if (value){
    dateValue = value || defaultValue
    dateValue = moment(dateValue,'YYYY-MM-DD')

    // if (typeof value =='string'|| typeof value=='number'){
    //
    //   if (dateValue.indexOf('/')===-1 || dateValue.indexOf('-')===-1){
    //  const res = getLocalTime(dateValue,3)
    //     dateValue = moment(res,'YYYY-MM-DD')
    //   }else
    //     if (typeof value =='string'){
    //     dateValue = moment(dateValue,'YYYY-MM-DD')
    //   }
    // }else dateValue = value
  }
  const defaultDateValue = defaultValue && typeof defaultValue === 'string' ? moment(defaultValue) : defaultValue;
  return <DatePicker value={dateValue}
                     defaultValue={defaultDateValue}
                     {...rest}/>;
}

export default DatePickerPlus
