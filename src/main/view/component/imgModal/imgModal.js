import React, {useState,useEffect} from "react";
import { Empty } from 'antd';
import DraggableModal from "../../component/modal/DraggableModal";
import './imgModal.css'
/**
 * 检查图片
 * @param visible 是否可见
 * @param imgUrlArr 图片数据
 * @function onCancel 关闭
 */
const ImgModal = ({visible, imgUrlArr, onCancel}) => {
    
    // 变量
    const [imgUrl, setImgUrl] = useState('');
    const [activeVisible, setActiveVisible] = useState(0);
    
    // 点击图片切换
    const cahngeImg = (url,val) => {
        setActiveVisible(val)
        setImgUrl(url)
    }
    useEffect(()=>{
        if(imgUrlArr){
            setImgUrl(imgUrlArr[0].url)
         }else{
            setImgUrl('')
         }
    },[imgUrlArr])
    //渲染组件
    return (
        <DraggableModal
            className='imgModal'
            title="检查图片"
            width={500}
            zIndex={999999}
            onCancel={onCancel}
            footer={null}
            visible={visible}>
                {console.log(imgUrlArr)}
                {
                    imgUrlArr && imgUrlArr.length != 0 ? <div className='imgContent'> 
                        <div className='bigImg'>
                            <img width='100%' src={imgUrl} />
                        </div>
                        <div className='smallImg'>
                            {
                                imgUrlArr.map((item,index) => {
                                    return (
                                        <div className={activeVisible == index ? 'img imgActive' : 'img'} onClick={() => {cahngeImg(item.url,index)}}>
                                            <img src={item.url} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
        </DraggableModal>
    )
}

export default ImgModal;