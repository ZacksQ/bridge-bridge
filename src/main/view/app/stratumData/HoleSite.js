import React, { useEffect, useImperativeHandle, useState } from "react";
import { Button, Row, Col, message, Spin, Divider, Form, Progress, Image, Alert, Table } from "antd";
import DeleteButton from "../../component/button/DeleteButton";
import Toolbar from "../../component/toolbar/Toolbar";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import StratumClient from "../../../client/stakeLength/StratumClient";
import DraggableModal from "../../component/modal/DraggableModal";
import StratumForm from "./StratumForm";
import { API_PREFIX, SERVER_URL } from '../../../config'
import sha256 from 'crypto-js/sha256';
import CryptoJS from "crypto-js";

const HoleSite = ({ onRef }) => {

    const [form] = Form.useForm();
    //组件状态
    const [loading,
        setLoading] = useState(false);

    const [holeData,
        setHoleData] = useState([]
            // pageNum: 1, pageSize: 10 
        );
    const [stratumForm,
        setStratumForm] = useState({ visible: false, initialData: undefined });
    const [uploadHoleModalVisible, setUploadHoleModalVisible] = useState(false)
    const [uploadSingleSiteModalVisible, setUploadSingleSiteModalVisible] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)

    const [imgLoading, setImgLoading] = useState(false)
    const [drillId, setDrillId] = useState('')
    const [uploadProgress, setUploadProgress] = useState(-1)
    const [imgSrc, setImgSrc] = useState('')

    useImperativeHandle(onRef, () => {
        return {
            setUploadHoleModalVisible,
            setUploadSingleSiteModalVisible,
            setDrillId
        }
    })
    let uploadStatusTimer = null
    //获取用户数据
    const fetchHoleData = () => {
        setLoading(true);
        StratumClient.getDrillList()
            .then(res => {
                if (res.code === 0) {
                    setHoleData(res.data)
                } else {
                    message.error(res.resultNote)
                }
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (uploadSingleSiteModalVisible === false) {
            setUploadProgress(-1)
        }
    }, [uploadSingleSiteModalVisible])

    //初始化
    useEffect(() => {
        fetchHoleData()
    }, []);


    const handleSave = () => {
        setStratumForm({ visible: false, initialData: undefined });

    };
    //处理删除imgSrc
    const handleDelete = record => {
        let drillId = record.drillId
        setLoading(true)
        StratumClient.delHole(drillId).then(res => {
            if (res.code === 0) {
                const dataSource = [...holeData];
                setHoleData(dataSource.filter(item => item.drillId !== drillId));
                if(record.imgFileId===imgSrc){
                    setImgSrc("")
                }
            } else {
                message.error(res.resultNote)
            }
        }).finally(() => setLoading(false))
    };

    const showPic = imgFileId => {
        // let img = new Image()
        // setImgLoading(true)
        // img.onload = function () {
        //     let img_wrap = document.querySelector(".hole-img-wrap")
        //     setImgLoading(false)
        //     if (img_wrap) {
        //         let hole_img = document.querySelector(".hole-img-wrap img")
        //         if (hole_img) {
        //             img_wrap.removeChild(hole_img)
        //         }
        //         img_wrap.appendChild(img)
        //     }
        // }
        // img.src = `${SERVER_URL}/pile-len/calc/geology/view?imgFileId=${imgFileId}`
        setImgSrc(imgFileId)
    }

    const holeFileOnChange = (info) => {
        const { status } = info.file;
        if (status == 'uploading') {
            setUploadLoading(true)
        }
        if (status === 'done') {
            if (info.file.response.code === 0) {
                message.success(`${info.file.name} 数据已成功上传.`);
                setUploadHoleModalVisible(false)
                fetchHoleData(holeData)
            } else {
                message.error(`${info.file.name} 上传失败.${info.file.response.resultNote}`)
            }
            setUploadLoading(false)
        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            setUploadLoading(false)
        }
    }

    const columns = [
        {
            title: "钻孔编号",
            key: "drillNum",
            dataIndex: "drillNum",
            width: 80, align:
            "center",
            className: "grey"
        },
        {
            title: "钻孔桩号",
            key: "pileNumber",
            dataIndex: "pileNumber",
            width: 80, align:
            "center"
        },
        {
            title: "操作", key: "action", width: 150, align:
                "center", render: (text, record) => {

                    return (<div>
                        <Button
                            size="small" type="link" onClick={() => {
                                showPic(record.imgFileId)
                            }}>查看</Button>

                        <Button
                            size="small" type="link" onClick={() => {
                                setUploadSingleSiteModalVisible(true)
                                setDrillId(record.drillId)
                            }}>覆盖</Button>

                        <DeleteButton
                            onConfirm={() => handleDelete(record)} />
                    </div>)
                }
        }
    ]

    /*切割文件方法*/
    function sliceFiles(file, num, drillId) {
        setUploadLoading(true)
        let singleSize = Math.ceil(file.size / num);
        let location = 0;
        let findex = 1
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async function () {
            var wordArray = CryptoJS.lib.WordArray.create(reader.result);
            var hash = sha256(wordArray).toString();
            while (location < file.size) {
                let fileSize = file.size
                let signleSize = location + singleSize
                // if(findex===num) signleSize = fileSize 
                // fileList.push(file.slice(location, location + singleSize));
                let sf = file.slice(location, signleSize)
                if (findex === num) signleSize = fileSize - 1
                let singleFile = await uploadFileSingle(sf, file.name, [{ header: "Content-Range", value: `bytes ${location}-${signleSize}/${fileSize}` },
                { header: "SHA256", value: hash }], findex, num, drillId)

                //查询分片上传情况
                if (findex === num) {
                    if (singleFile && singleFile.code === 0) {
                        uploadStatusTimer = setInterval(() => { getUploadProgress(singleFile.data) }, 1000)
                    } else {
                        message.error(singleFile.resultNote)
                    }
                }
                location += singleSize;
                findex++
            }
        }
    }

    const getUploadProgress = taskId => {
        StratumClient.getUploadProcess(taskId).then(res => {
            if (res.code === 0) {
                setUploadProgress(res.data)
                if (res.data == 100) {
                    clearInterval(uploadStatusTimer)
                    fetchHoleData()
                    setTimeout(() => {
                        setUploadSingleSiteModalVisible(false)
                    }, 2000)
                }
            } else {
                message.error(res.resultNote)
                setUploadSingleSiteModalVisible(false)
                clearInterval(uploadStatusTimer)
            }
        })
    }

    async function uploadFileSingle(file, filename, extHeader, index, num, drillId) {
        // await return new Promise(async function (resolve, reject) {
        let postData = { file, filename }
        if (drillId) {
            postData.drillId = drillId
        }
        return await StratumClient.uploadSliceFile(postData, true, extHeader).then(res => {
            if (index === num) {
                setUploadLoading(false)
                // setUploadSingleSiteModalVisible(false)
                fetchHoleData()
            }
            return res
        })
        // })
    }

    const uploadSliceFiles = e => {
        sliceFiles(e.file, 2, drillId)
    }


    return (<>
        <Row gutter={10}>
            <Col span={7}>
                <div className="hole-list-wrap">
                    <Table
                        size="small"
                        dataSource={holeData}
                        bordered
                        rowKey={"drillId"}
                        // style={{height: 700}}
                        columns={columns}
                        pagination={false}
                    />
                </div>
            </Col>
            <Col span={17}>
                <Spin spinning={imgLoading}>
                    <div className="hole-img-wrap">
                        {imgSrc && <Image
                            width={"100%"}
                            src={`${SERVER_URL}/pile-len/calc/geology/view?imgFileId=${imgSrc}`}
                        />}
                    </div>
                </Spin>
                {/* {imgSrc && <img src={imgSrc} alt="" id="hole-img" style={{width: "100%"}} />} */}
            </Col>
        </Row>
        <DraggableModal
            visible={uploadHoleModalVisible}
            title={"孔位桩号上传"}
            width={650}
            footer={null}
            // onOk={form.submit}
            onCancel={() => { setUploadHoleModalVisible(false) }}>
            <Dragger action={API_PREFIX + '/pile-len/calc/hole-list/upload'}
                maxCount={1}
                onChange={holeFileOnChange}>
                <Spin spinning={uploadLoading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖动到此处上传</p>
                </Spin>

            </Dragger>
        </DraggableModal>
        <DraggableModal
            visible={uploadSingleSiteModalVisible}
            title={"单孔信息上传"}
            width={650}
            // onOk={form.submit}
            footer={null}
            onCancel={() => { setUploadSingleSiteModalVisible(false) }}>
            <Dragger
                // action={'/api/pile-len/calc/hole-info/upload'}
                customRequest={uploadSliceFiles}
                maxCount={1}
                progress={false}
                progress={{
                    strokeWidth: 1,
                    trailColor: "#fff",
                    format: function () { return '' }
                }}
            // onChange={fileOnChange}
            >
                <Spin spinning={uploadLoading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖动到此处上传</p>

                    {uploadProgress > -1 && <>文件解析进度：<Progress percent={uploadProgress} style={{ width: "70%" }} />

                    </>}
                </Spin>
            </Dragger>
            {uploadProgress > -1 && <Alert
                style={{ marginTop: 20 }}
                message="文件解析中，请勿关闭弹窗！"
                type="warning"
                showIcon
            />}
        </DraggableModal>
        <StratumForm
            visible={stratumForm.visible}
            userData={stratumForm.initialData}
            onOk={handleSave}
            onCancel={() => setStratumForm({ visible: false, initialData: undefined })} />
    </>
    );
};

export default HoleSite;