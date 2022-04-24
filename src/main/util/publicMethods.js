import OSS from "ali-oss";
import {message} from "antd";
import OperationClient from "../client/system/OperationClient";
import {ALIOSS_URL} from "../config";

const setTime = (time)=>{
  if (Number(time)<10) return '0'+time
  return time
}
// 0 年月日 1 时分秒
const getLocalTime = (nS,type=0)=>{
  Date.prototype.toLocaleString = function() {
    let baseTime = this.getFullYear() + "/" +setTime((this.getMonth() + 1)) + "/" + setTime(this.getDate())
    let lineTime = this.getFullYear() + "-" +setTime((this.getMonth() + 1)) + "-" + setTime(this.getDate())
    let addTime =  " " + setTime(this.getHours()) + ":" + setTime(this.getMinutes()) + ":" + setTime(this.getSeconds())
    if (type==3) return lineTime
    else  return type==0 ? baseTime :baseTime+addTime

  };

  return new Date(parseInt(nS)).toLocaleString()
}

const getTimeStamp = (str)=>{
  return  Date.parse(new Date(str))/1000
}

const filterTargetColumns = (target,source)=>{
  let arr = []
  source.forEach(item=>{
    arr.push(target[item])
  })
  return arr
}

const insAliOss = (credentials) => {
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
  if (name) {
    return directory + '/' + name
  }
  return directory + '/' + createUUID()
}

// 上传
const aliossUpload = async (e,fileList,setFileList,isImg,setLoading,maxCount = 1) => {
  let file = e.file;
  if (isImg){
    if(!e.file.type.includes('image')){
      message.error(`上传文件格式不正确`);
      return false
    }
  }else {
    if (!(file.name.includes('pdf') || file.name.includes('docx') || file.name.includes('doc') || file.name.includes('dwg') || file.type.includes('excel')|| file.type.includes('sheet'))) {
      message.error(`上传文件格式不正确`);
      return false
    }
  }
  setLoading && setLoading(true)
  let fileLength = file.name.split('.').length - 1
  let credentials = await OperationClient.getAliFileUploadCredentials(createFilePath() + '.' + file.name.split('.')[fileLength]);
  let fileName = credentials.fileName;
  let showName = file.name
  let client = insAliOss(credentials);
  try {
    await client.put(fileName, file);
    if (maxCount === 1){
      setFileList([{
        uid: fileName,
        name: showName,
        status: 'done',
        url: ALIOSS_URL + fileName,
        fileName:showName,
        filePath:ALIOSS_URL + fileName
      }])
    }else {
      setFileList([...fileList,{
        uid: fileName,
        name: showName,
        status: 'done',
        url: ALIOSS_URL + fileName,
        fileName:showName,
        filePath:ALIOSS_URL + fileName
      }])
    }
  } catch (e) {
    console.log(e,'error');
  } finally {
    setLoading && setLoading(false)
  }
}
const downLoad = text =>window.open(text.filePath)




export {
  getLocalTime,
  getTimeStamp,
  filterTargetColumns,
  aliossUpload,
  downLoad
}