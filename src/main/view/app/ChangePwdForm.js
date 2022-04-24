import React, {useState} from "react";
import DraggableModal from "../component/modal/DraggableModal";
import PropTypes from "prop-types";
import {Form, Input, message} from "antd";
import {LockOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";
import UserClient from "../../client/system/UserClient";

/**
 * 更换用户密码表单
 * @param visible 是否可见
 * @param onCancel 取消表单事件
 * @param onOk 确认事件
 */
const ChangePwdForm = ({visible, onCancel, onOk}) => {
    //全局状态
    const authInfo = useSelector(state => state.auth);
    //组件状态
    const [isChanging, setIsChanging] = useState(false);
    //表单处理
    const [form] = Form.useForm();
    //获取表单数据
    const submitForm = async () => {
        const values = await form.validateFields();
        // values.account = authInfo.account;
        // values.userId = authInfo.username
        return UserClient.updatePassword(values);
    }
    //保存表单
    const handleSave = () => {
        setIsChanging(true);
        submitForm().then(res=>{
            console.log(res)
            if(res.code==0){
                onOk()
            }else{
                message.error(res.resultNote)
            }
        }).finally(() => {
            setIsChanging(false)
        });
    };
    //渲染组件
    return (
        <DraggableModal
            title="修改密码"
            width={500}
            confirmLoading={isChanging}
            onOk={handleSave}
            onCancel={onCancel}
            visible={visible}>
            <Form form={form} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                <Form.Item label="旧密码" name="oldPassword" rules={[{required:true, message: "旧密码不能为空！"}]}>
                    <Input.Password type="password" placeholder="请输入旧密码"/>
                </Form.Item>
                <Form.Item label="新密码" name="newPassword" rules={[{required:true, message: "新密码不能为空！"}]}>
                    <Input.Password type="password" placeholder="请输入新密码" onBlur={()=>{form.validateFields()}}/>
                </Form.Item>
                <Form.Item label="确认新密码" name="confirmPassword" rules={[{required: true, message: "请确认新密码！"},({ getFieldValue })=>({validator(rule, value) {
                        const newPassword = getFieldValue("newPassword");
                        console.log(newPassword, value)
                        if (value && value !== newPassword) {
                            return Promise.reject('两次密码输入不一致');
                        }
                        return Promise.resolve();
                    }})]}>
                    <Input.Password type="password" placeholder="请确认新密码"/>
                </Form.Item>
            </Form>
        </DraggableModal>
    )
}

ChangePwdForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ChangePwdForm;