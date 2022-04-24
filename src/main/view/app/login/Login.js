import React, { useEffect, useState, useRef } from "react";
import "./login.css";
import { Button, Form, Input, Row, Col, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/action/AuthAction";
import UserClient from "../../../client/system/UserClient";
let timer = null
const Login = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [registerForm, setRegisterForm] = useState(false)
    const [autoLogin, setAutoLogin] = useState(false)
    const [sendedCaptcha, setSendedCaptcha] = useState(false)
    const [countDown, setCountDown] = useState(3)
    const [forget, setForget] = useState(false)
    const countRef = useRef(countDown)
    //登录的异步方法
    const login = async () => {
        const data = await form.validateFields();
        if (autoLogin) {
            let login_info = {
                username: data.username,
                password: data.password,
                autoLogin: true
            }
            localStorage.setItem("LOGIN_INFO", JSON.stringify(login_info))
        } else {
            localStorage.removeItem("LOGIN_INFO")
        }
        return await UserClient.login(data);
    }
    //最终执行请求
    const doLogin = () => {
        //登录时，重新回到首页
        window.history.replaceState(undefined, undefined, "/");
        setLoading(true);
        login()
            .then(authInfo => {
                if (authInfo.code === 0) {
                    dispatch(setAuth(authInfo.data))
                } else {
                    message.error(authInfo.resultNote)
                }
            }).catch(e => {

            })
            .finally(() => setLoading(false));
    }

    const userRegister = () => {
        form.validateFields().then(values => {
            if (forget) {
                UserClient.forgetPassword(values).then(res => {
                    if (res.code === 0) {
                        message.success("密码重置成功，请登录账号")
                        setRegisterForm(false)
                    }else{
                        message.error(res.resultNote)
                    }
                })
            } else {
                UserClient.registerUser(values).then(res => {
                    if (res.code === 0) {
                        message.success("注册成功，请登录账号")
                        setRegisterForm(false)
                    }else{
                        message.error(res.resultNote)
                    }
                })
            }
        })
    }

    const sendCaptcha = () => {
        form.validateFields(["mail"]).then(values => {
            // console.log(values)
            let mail = values.mail
            let type = (forget == false ? 1 : 2)
            UserClient.sendMailCaptcha(mail, type).then(res => {
                if (res.code === 0) {
                    message.success("发送成功，请查看邮箱")
                    setSendedCaptcha(true)
                    timer = setInterval(() => {
                        console.log(countRef.current)
                        if (countRef.current > 0) {
                            setCountDown(countRef.current - 1)
                        } else {
                            setSendedCaptcha(false)
                            setCountDown(60)
                            clearInterval(timer)
                        }

                    }, 1000)
                } else {
                    message.error(res.resultNote)
                }
            })
        })

    }
    useEffect(() => { countRef.current = countDown })

    useEffect(() => {
        let login_info = localStorage.getItem("LOGIN_INFO")
        if (login_info) {
            try {
                login_info = JSON.parse(login_info)
                setAutoLogin(true)
                UserClient.login(login_info).then(authInfo => {
                    if (authInfo.code === 0) {
                        dispatch(setAuth(authInfo.data))
                    } else {
                        message.error(authInfo.resultNote)
                    }
                }).catch(e => {

                })
            } catch (e) {
                console.log(e)
            }
        }
        return () => {
            if (timer) {
                clearInterval(timer)
            }
        }
    }, [])

    // const autoLogin = () =>{
    //     localStorage.setItem("LOGIN_INFO", )
    // }

    return (
        <div className="login-wrapper">
            <div className="login-form-wrapper">
                <div className="login-form-content">
                    <div className="login-wrap">
                        <div className="login-form-right vertical-center">
                            <div className="login-form">
                                <h3 className="sys-name">智能设计系统</h3>
                                {registerForm === false ?
                                    <Form form={form} style={{ textAlign: "left" }}>
                                        <Form.Item name="username" rules={[{ required: true, message: "请输入手机号/邮箱" }]}>
                                            <Input size="large" prefix={<svg t="1647154049343" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3501" width="15"><path d="M907.864007 1023.670814a10.204769 10.204769 0 0 1-10.287066-10.040176 385.888397 385.888397 0 0 0-658.372184-262.690501 383.090315 383.090315 0 0 0-112.91083 262.690501 10.287065 10.287065 0 0 1-10.287065 10.040176H38.565834A10.287065 10.287065 0 0 1 28.278768 1013.136859a477.319834 477.319834 0 0 1 37.938697-177.5136 483.245183 483.245183 0 0 1 103.693619-153.729905 477.319834 477.319834 0 0 1 153.565312-103.611323l1.563634-0.658372a318.981323 318.981323 0 1 1 373.461622 0l1.563634 0.658372a483.656666 483.656666 0 0 1 295.197628 435.019421 10.287065 10.287065 0 0 1-10.287065 10.533955z" fill="#1890FF" p-id="3502"></path></svg>} onPressEnter={doLogin} placeholder="手机号/邮箱" />
                                        </Form.Item>
                                        <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
                                            <Input.Password size="large" prefix={<svg t="1647154142803" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3631" width="15"><path d="M921.6 450.56H834.60096V163.84a163.84 163.84 0 0 0-163.84-163.84H353.32096a163.84 163.84 0 0 0-163.84 163.84v286.72H102.4A40.96 40.96 0 0 0 61.44 491.52v491.52a40.96 40.96 0 0 0 40.96 40.96h819.2a40.96 40.96 0 0 0 40.96-40.96V491.52a40.96 40.96 0 0 0-40.96-40.96z" fill="#1890FF" p-id="3632"></path><path d="M281.64096 163.84a71.76192 71.76192 0 0 1 71.68-71.68h317.44A71.76192 71.76192 0 0 1 742.44096 163.84v286.72H281.64096z" fill="#FFFFFF" p-id="3633"></path><path d="M870.4 931.84h-716.8v-389.12h716.8z" fill="#1890FF" p-id="3634"></path><path d="M476.20096 753.90976v67.82976a10.24 10.24 0 0 0 10.24 10.24h51.2a10.24 10.24 0 0 0 10.24-10.24v-67.82976a61.44 61.44 0 1 0-71.68 0z" fill="#FFFFFF" p-id="3635"></path></svg>} onPressEnter={doLogin} placeholder="请输入密码" />
                                        </Form.Item>
                                        <div className="account-form-link">
                                            <Form.Item name="auto-login" style={{ display: 'inline-block' }}>
                                                <Checkbox checked={autoLogin} onChange={(e) => { setAutoLogin(e.target.checked) }}>自动登录</Checkbox>
                                            </Form.Item>
                                            <p onClick={() => {
                                                setForget(false)
                                                setRegisterForm(true)
                                            }}>
                                                用户注册
                                            </p>
                                            <p style={{ marginLeft: 15, marginRight: 15 }}>|</p>
                                            <p onClick={() => {
                                                setRegisterForm(true)
                                                setForget(true)
                                            }}>忘记密码</p>
                                        </div>
                                        <Button type="primary" loading={loading} onClick={doLogin}>登录</Button>
                                    </Form> : <Form form={form} style={{ textAlign: "left" }}>
                                        <Form.Item name="telephone" rules={[{ required: true, message: "请输入手机号" }]}>
                                            <Input size="large" prefix={<svg t="1647175154803" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6288" width="15" ><path d="M160.992 128c0-70.688 57.6-128 127.488-128h449.024c70.4 0 127.488 56.96 127.488 128v768c0 70.688-57.6 128-127.488 128H288.48c-70.4 0-127.488-56.96-127.488-128V128z m352 853.28c37.504 0 67.872-29.76 67.872-66.496 0-36.736-30.4-66.496-67.872-66.496s-67.872 29.76-67.872 66.496c-0.032 36.704 30.368 66.496 67.872 66.496z m-253.408-176.128h508.768V122.112H259.584v683.04z" p-id="6289" fill="#1990ff"></path></svg>} placeholder="请输入手机号" />
                                        </Form.Item>
                                        <Form.Item name="mail" rules={[{
                                            type: "email",
                                            message: '邮箱格式不正确',
                                        }, { required: true, message: "请输入邮箱" }]}>
                                            <Input size="large" prefix={<svg t="1647174113724" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5142" width="15" ><path d="M149.6 171.8h691.9c47.2 0 85.9 37.7 86.5 83.9L495.7 493 63.5 256c0.4-46.4 38.8-84.2 86.1-84.2z m-86.1 175l-0.4 419.6c0 46.7 38.9 84.9 86.5 84.9h691.9c47.6 0 86.5-38.2 86.5-84.9V346.6L505.9 572.8c-6.5 3.5-14.3 3.5-20.7 0l-421.7-226z" p-id="5143" fill="#1990ff"></path></svg>} placeholder="请输入邮箱" />
                                        </Form.Item>
                                        <Form.Item >
                                            <Row gutter={8}>
                                                <Col span={14}>
                                                    <Form.Item name="sms" noStyle rules={[{ required: true, message: "请输入邮箱验证码" }]}>
                                                        <Input size="large" placeholder="请输入邮箱验证码" />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={10}>
                                                    <Button className={"get-captcha" + (sendedCaptcha ? " disable" : "")} disabled={sendedCaptcha} size="large" onClick={() => { sendCaptcha() }}>{sendedCaptcha ? `重新发送（${countDown}）` : "获取邮箱验证码"}</Button>
                                                </Col>
                                            </Row>


                                        </Form.Item>
                                        {!forget && <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
                                            <Input.Password size="large" onBlur={()=>{form.validateFields()}} prefix={<svg t="1647154142803" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3631" width="15"><path d="M921.6 450.56H834.60096V163.84a163.84 163.84 0 0 0-163.84-163.84H353.32096a163.84 163.84 0 0 0-163.84 163.84v286.72H102.4A40.96 40.96 0 0 0 61.44 491.52v491.52a40.96 40.96 0 0 0 40.96 40.96h819.2a40.96 40.96 0 0 0 40.96-40.96V491.52a40.96 40.96 0 0 0-40.96-40.96z" fill="#1890FF" p-id="3632"></path><path d="M281.64096 163.84a71.76192 71.76192 0 0 1 71.68-71.68h317.44A71.76192 71.76192 0 0 1 742.44096 163.84v286.72H281.64096z" fill="#FFFFFF" p-id="3633"></path><path d="M870.4 931.84h-716.8v-389.12h716.8z" fill="#1890FF" p-id="3634"></path><path d="M476.20096 753.90976v67.82976a10.24 10.24 0 0 0 10.24 10.24h51.2a10.24 10.24 0 0 0 10.24-10.24v-67.82976a61.44 61.44 0 1 0-71.68 0z" fill="#FFFFFF" p-id="3635"></path></svg>} placeholder="请输入密码" />
                                        </Form.Item>}
                                        {forget && <Form.Item name="newPassword" rules={[{ required: true, message: "请输入密码" }]}>
                                            <Input.Password size="large" onBlur={()=>{form.validateFields()}} prefix={<svg t="1647154142803" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3631" width="15"><path d="M921.6 450.56H834.60096V163.84a163.84 163.84 0 0 0-163.84-163.84H353.32096a163.84 163.84 0 0 0-163.84 163.84v286.72H102.4A40.96 40.96 0 0 0 61.44 491.52v491.52a40.96 40.96 0 0 0 40.96 40.96h819.2a40.96 40.96 0 0 0 40.96-40.96V491.52a40.96 40.96 0 0 0-40.96-40.96z" fill="#1890FF" p-id="3632"></path><path d="M281.64096 163.84a71.76192 71.76192 0 0 1 71.68-71.68h317.44A71.76192 71.76192 0 0 1 742.44096 163.84v286.72H281.64096z" fill="#FFFFFF" p-id="3633"></path><path d="M870.4 931.84h-716.8v-389.12h716.8z" fill="#1890FF" p-id="3634"></path><path d="M476.20096 753.90976v67.82976a10.24 10.24 0 0 0 10.24 10.24h51.2a10.24 10.24 0 0 0 10.24-10.24v-67.82976a61.44 61.44 0 1 0-71.68 0z" fill="#FFFFFF" p-id="3635"></path></svg>} placeholder="请输入密码" />
                                        </Form.Item>}
                                        {forget && <Form.Item name="confirmPassword" rules={[{ required: true, message: "请确认密码" }, ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                const newPassword = getFieldValue("newPassword");
                                                console.log(newPassword, value)
                                                if (value && value !== newPassword) {
                                                    return Promise.reject('两次密码输入不一致');
                                                }
                                                return Promise.resolve();
                                            }
                                        })]}>
                                            <Input.Password size="large" placeholder="请确认密码" />
                                        </Form.Item>}

                                        <div className="account-form-link">
                                            <p onClick={() => setRegisterForm(false)}>
                                                已有账号？用户登录
                                            </p></div>
                                        <Button type="primary" loading={loading} onClick={userRegister}>{forget ? "提交" : "注册"}</Button>
                                    </Form>}
                            </div>

                        </div>
                    </div>

                </div>
                <div className="login-copy-right">Copyright©2022 华设设计集团股份有限公司</div>
            </div>
        </div>
    );
};

export default Login;