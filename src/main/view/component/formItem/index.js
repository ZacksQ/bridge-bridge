import React from "react";
import {
  Tabs,
  Divider,
  Form,
  Row,
  Col,
  Popconfirm,
  message,
  Select,
  TreeSelect,
  Button,
  Spin,
  Checkbox,
  Card,
  Input,
  AutoComplete
} from "antd";
import DatePickerPlus from "../DatePicker/datePicker";
import RangePickerPlus from "../DatePicker/rangePicker";
const {Option} = Select
const {TextArea} = Input;
const GetElement = props => {
  const {formData, form, ...rest} = props

  const {type, position = 'right'} = formData
  const size = formData.size ? formData.size : 'default'
  //使用large,small字段会和antd的某些配置冲突，这里使用big
  const sizeArr = ['tiny', 'default', 'big']
  switch (type) {
    case 'input':
      return <Input
        placeholder={formData.placeholder ? formData.placeholder : "请输入"}
        allowClear
        className={sizeArr.indexOf(size) === 1 ? 'form-element-antd' : sizeArr.indexOf(size) === 0 ? 'form-element-small' : 'cus-element-large'}
        {...rest}
        {...formData}

      />
    case 'textArea':
      return <TextArea
        placeholder={formData.placeholder ? formData.placeholder : "请输入"}
        className={`form-element-antd-textArea-${position}`}
        allowClear
        {...formData}
        {...rest}
      />
    case 'tree':
      return <TreeSelect
        treeData={formData.list ? formData.list : []}
        treeDefaultExpandAll={true}
        showSearch
        allowClear
        className={sizeArr.indexOf(size) === 1 ? 'form-element-antd' : sizeArr.indexOf(size) === 0 ? 'form-element-small' : 'cus-element-large'}
        placeholder={formData.placeholder ? formData.placeholder : "请选择"}
        {...rest}
        {...formData}
      />
    case 'select':
      return <Select
        mode={formData.multiple ? 'multiple' : ''}
        // showSearch
        placeholder={formData.placeholder ? formData.placeholder : "请选择"}
        allowClear
        className={sizeArr.indexOf(size) === 1 ? 'form-element-antd' : sizeArr.indexOf(size) === 0 ? 'form-element-small' : 'cus-element-large'}
        {...rest}
        {...formData}
        maxTagTextLength={3}
      >
        {
          formData.list && formData.list.map((item,index) => {
            return <Option key={item.id || item.color || index}
                           value={item.id || item.fullName || item[formData.cusname]}>
              {item.value || item.name || item[formData.cusname]}
            </Option>
          })
        }
      </Select>
    case 'complete':
      let {custom,cusname,option = [],...prop} = formData
      if (typeof option ==='string') option = []
      return  custom
        ? <AutoComplete
          allowClear
          backfill={true}
          placeholder={formData.placeholder ? formData.placeholder : "请选择"}
          className={sizeArr.indexOf(size) === 1 ? 'form-element-antd' : sizeArr.indexOf(size) === 0 ? 'form-element-small' : 'cus-element-large'}
          {...rest}
          {...prop}
        >
          {
            option.map(item=>{
              return <AutoComplete.Option key={item.id} value={item[cusname]}>
                {item[cusname]}
              </AutoComplete.Option>
            })
          }
        </AutoComplete>:
        <AutoComplete allowClear
                      placeholder={formData.placeholder ? formData.placeholder : "请选择"}
                      className={sizeArr.indexOf(size) === 1 ? 'form-element-antd' : sizeArr.indexOf(size) === 0 ? 'form-element-small' : 'cus-element-large'}
                      {...rest}
                      {...formData}
        />
    case 'date':
      const {disabledDate,disabledDateCustom,...props} = formData
      return <DatePickerPlus
        className={sizeArr.indexOf(size) === 1 ? 'form-element-antd' : sizeArr.indexOf(size) === 0 ? 'form-element-small' : 'cus-element-large'}
        disabledDate={formData.disabledDateCustom ? (current)=>{
         return formData.disabledDateCustom(current,form)
        } :disabledDate}
        {...props}
        {...rest}
        onChange={formData.onChange ? formData.onChange :
          e=>{
          let obj = {}
            obj[formData.name] = e ? e.format('YYYY-MM-DD') : null
            form.setFieldsValue(obj)
          }
        }
      />
    case 'range':
      return <RangePickerPlus
        className={sizeArr.indexOf(size) === 1 ? 'form-element-antd' : sizeArr.indexOf(size) === 0 ? 'form-element-small' : 'cus-element-large'}
        form={form}
        {...formData}
        {...rest}
      />
    default:
      return <div>暂无元素</div>
  }
}
const GetFormItem = props => {
  const {
    formData,
    form,
    ...rest
  } = props
  const {name, label, rules, formClassName, required, formStyle = {}, type, position = 'right', hidden,noStyle} = formData
  if (hidden) return null
  else
    return <Form.Item
      name={name}
      labelCol={12}
      label={label}
      noStyle={noStyle}
      className={`${type === 'textArea' ? `form-element-antd-textArea-${position}` : `form-element-${position}`} ${formClassName ? formClassName : ''}`}
      style={{...formStyle}}
      rules={required && !rules ? [{required: true, message: `${label}不能为空`}] : rules ? rules : null}
    >
      {
        noStyle
          ? null
          :
        <GetElement
          formData={formData}
          form={form}
          {...rest}
        />
      }

    </Form.Item>
}

export default GetFormItem