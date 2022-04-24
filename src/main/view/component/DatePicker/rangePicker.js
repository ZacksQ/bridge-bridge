import React from "react";
import {DatePicker} from "antd";
import moment from "moment";
import {getLocalTime} from "../../../util/publicMethods";
const { RangePicker } = DatePicker;
const RangePickerPlus = props =>{
  const {
    start,
    end,
    form,
    defaultValue,
    ...rest
  } = props
  let dateValue
  if (start && end){
    if (typeof start =='string'|| typeof start=='number'){
      dateValue = [moment(getLocalTime(start,3),'YYYY-MM-DD'),moment(getLocalTime(end,3),'YYYY-MM-DD')]
    }else {
      dateValue = [moment(start,'YYYY-MM-DD'),moment(end,'YYYY-MM-DD')]
    }
  }
  if (dateValue && typeof dateValue[0]==='string') return
  return <RangePicker  defaultValue={dateValue} onChange={(e)=>{
  e.length===2 && form.setFieldsValue({startDate:e[0].valueOf(),endDate:e[1].valueOf()})
  }
  } {...rest}/>;
}

export default RangePickerPlus
