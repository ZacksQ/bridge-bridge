import React, {useEffect, useState} from "react";
import {useSelector} from 'react-redux'
import {Form, Input, Select,DatePicker,Upload,Spin,message } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import OSS from 'ali-oss'
import DraggableModal from "../../../component/modal/DraggableModal";
import Archives from "../../../../client/bridge/Archives";
import OperationClient from "../../../../client/system/OperationClient";
import {ALIOSS_URL} from '../../../../config'

const { Dragger } = Upload
const { TextArea } = Input;
const BridgeSideForm = ({visible, uploadVisible,bridgeId, initialData, onOk, onCancel,title}) => {
    const [form] = Form.useForm();

    const [options,setOptions] = useState([
        {
          value: 1,
          label: '设计图纸',
          isLeaf: false,
        },
        {
          value: 2,
          label: '设计文件',
          isLeaf: false,
        },
        {
          value: 3,
          label: '施工文件',
          isLeaf: false,
        },
        {
          value: 4,
          label: '竣工文件',
          isLeaf: false,
        },
        {
          value: 5,
          label: '验收文件',
          isLeaf: false,
        },
        {
          value: 6,
          label: '行政文件',
          isLeaf: false,
        },
        {
          value: 7,
          label: '定期检查报告',
          isLeaf: false,
        },
        {
          value: 8,
          label: '特殊检查报告',
          isLeaf: false,
        },
        {
          value: 9,
          label: '历次维修资料',
          isLeaf: false,
        },
        {
            value: 10,
            label: '竣工图纸',
            isLeaf: false,
        },
      ]);
    const [saving, setSaving] = useState(false);
    const [uploadUrl, setUploadUrl] = useState('');
    const [fileList, setFileList] = useState([]);
    const [fileFormat, setFileFormat] = useState('');
    const auth = useSelector(state => state.auth);
    const [uploadLoading, setUploadLoading] = useState(false)
    //处理保存事件
    const submitForm = values => {
      values.bridgeId = bridgeId
      values.archivesYear = values['archivesYear1'].format('YYYY')
      values.userId = auth.id
      if(initialData){
        values.filePath = initialData.filePath
        values.fileFormat = initialData.fileFormat
        values.id = initialData.id
        delete values.archivesYear1
      }else{
        values.filePath = uploadUrl
        values.fileFormat = fileFormat
      }
      if(!initialData && uploadUrl == ''){
        return message.error('文件未上传');
      }
      setSaving(true);
      Archives.addArchives(values).then(onOk).finally(() => setSaving(false))
    };
    const insAliOss = (credentials) =>{
      return new OSS({
          accessKeyId: credentials.accessKeyId,
          accessKeySecret: credentials.accessKeySecret,
          stsToken: credentials.securityToken,
          endpoint: 'oss-cn-hangzhou.aliyuncs.com',
          bucket: 'net-jsrbc-bridge'
      });
    }
    const createUUID = (function (uuidRegEx, uuidReplacer) {
        return function () {
            return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    })(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    });
  
    const createFilePath = (name) => {
        let date = new Date()
        let directory = ""
        let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDay()
        directory = year + (month < 10 ? ('0' + month) : month) + (day < 10 ? ('0' + day) : day)
        if(name){
            return directory+'/'+ name
        }
        return directory+'/'+createUUID()
    }
    // 上传
    const aliossUpload = async e => {
      let file = e.file;
        if (!(file.name.includes('pdf') || file.name.includes('docx') || file.name.includes('doc') || file.name.includes('dwg') || file.type.includes('excel'))) {
            message.error(`上传文件格式不正确`);
            return false
        }
        setUploadLoading(true)
      let fileLength = file.name.split('.').length- 1
      let credentials = await OperationClient.getAliFileUploadCredentials(createFilePath() + '.' + file.name.split('.')[fileLength]);
      let fileName = credentials.fileName;
      let client = insAliOss(credentials);
      try {
          await client.put(fileName, file);
          setFileList([ {
              uid: fileName,
              name: fileName,
              status: 'done',
              url: ALIOSS_URL + fileName,
          }])
          setUploadUrl(fileName)
          setFileFormat(file.name.split('.')[fileLength])
      } catch (e) {
          // console.log(e);
      } finally{
          setUploadLoading(false)
      }
  }
    //初始化表单
    useEffect(()=>{
      setFileList([])
      return form.resetFields
    }, [visible]);

    // 上传配置
    const props = {
      name: 'file',
      method:'put',
    };
    // 文件移出
    const handleRemove = () => {
      setFileList([]);
    }

    //渲染
    return (
        <DraggableModal
            visible={visible}
            title={title}
            confirmLoading={saving}
            onOk={form.submit}
            onCancel={onCancel}>
            <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 18}} initialValues={initialData} onFinish={submitForm}>

                <Form.Item label="文件编号" name="archivesNo" rules={[{required: true, message: "文件编号不能为空"}]}>
                    <Input style={{width: "100%"}} placeholder="输入文件编号" rules={[{required: true, message: "文件编号不能为空"}]}/>
                </Form.Item>

                <Form.Item label="资料类型"
                  name="archivesType"
                  rules={[{required: true, message: "资料类型文件编号不能为空"}]}>
                    <Select
                        options={options}
                        placeholder="选择资料类型"
                        rules={[{required: true, message: "资料类型不能为空"}]}
                    />
                </Form.Item>

                <Form.Item label="资料名称" name="archivesName" rules={[{required: true, message: "资料名称不能为空"}]}>
                    <Input style={{width: "100%"}} placeholder="输入资料名称" rules={[{required: true, message: "资料名称不能为空"}]}/>
                </Form.Item>

                <Form.Item label="资料年份"
                 name="archivesYear1" 
                 rules={[{required: true, message: "资料年份不能为空"}]}>
                  <DatePicker style={{width: "100%"}} picker="year" />
                </Form.Item>

                <Form.Item label="资料描述" name="archivesDescribe">
                    <TextArea style={{width: "100%"}}  placeholder="输入资料描述"></TextArea>
                </Form.Item>
                
                {
                  uploadVisible ? <div style={{paddingLeft:46}}>
                    <Dragger 
                      {...props} 
                      fileList = {fileList} 
                      onRemove={handleRemove}
                      customRequest={aliossUpload}
                    ><Spin spinning={uploadLoading}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">点击或拖动到此处上传</p>
                      </Spin>
                    </Dragger> 
                  </div> : ''
                }
            </Form>
        </DraggableModal>
    )
}

export default BridgeSideForm;