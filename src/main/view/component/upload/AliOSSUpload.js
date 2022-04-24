import React, {useState} from "react";
import {Upload, Modal } from "antd";
import {PlusOutlined} from "@ant-design/icons";

const AliOSSSUpload = ({photoList, aliossUpload, showUploadList, onRemove, max, label}) => {

    const [preview, setPreview] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: ''
    });

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const handleCancelPreviewModal = () => {
        setPreview({
            previewVisible: false,
            previewImage: '',
            previewTitle: ''
        })
    }
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreview({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div className="ant-upload-text">{label ? label : '图片上传'}</div>
        </div>
    );

    return <div>
        <Upload
            accept="image/*"
            listType="picture-card"
            fileList={photoList}
            onPreview={handlePreview}
            customRequest={aliossUpload}
            onRemove={onRemove}
            showUploadList={showUploadList}>
            {photoList.length >= (max !== undefined ? max : 8) ? null : uploadButton}
        </Upload>
        <Modal
            width="60%"
            visible={preview.previewVisible}
            title={null}
            footer={null}
            onCancel={handleCancelPreviewModal}>
            <img alt="" style={{width: '100%'}} src={preview.previewImage}/>
        </Modal>
    </div>
}

export default AliOSSSUpload;