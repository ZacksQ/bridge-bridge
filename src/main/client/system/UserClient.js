import BaseClient from "../BaseClient";
import CryptoJS from "crypto-js";
import sha256 from 'crypto-js/sha256';
import {CRYPTO_KEY} from "../../config";
import {normalizePageData} from "../../util/PageUtils";

class UserClient {

    //登录
    static login = loginData => {
        loginData.password = sha256(loginData.password).toString();
        // let loginDataFormData = new FormData()
        // loginDataFormData.append("username", loginData.username)
        // loginDataFormData.append("password", loginData.password)
        return BaseClient.post("/login", loginData, true);
    };

    static loginOut = () => {
        return BaseClient.post("/logout",{}, true)
    }

    //更新用户密码
    static registerUser = formData => {
        formData.password = sha256(formData.password).toString();
        return BaseClient.post(`/register`, formData);
    };

    static sendMailCaptcha = (mail, type = 1) => {
        return BaseClient.get(`/sendSMS`, {mail, type})
    }

    static updatePassword = postData => {
        postData.confirmPassword = sha256(postData.confirmPassword).toString();
        postData.newPassword = sha256(postData.newPassword).toString();
        postData.oldPassword = sha256(postData.oldPassword).toString();
        return BaseClient.post(`/user/updatePassword`, postData)
    }

    static forgetPassword = postData => {
        postData.newPassword = sha256(postData.newPassword).toString();
        postData.confirmPassword = sha256(postData.confirmPassword).toString();
        return BaseClient.post(`/forgotPassword`, postData)
    }
}

function encrypt(content) {
    const key = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);
    const result = CryptoJS.AES.encrypt(content, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return result.ciphertext.toString();
}

export default UserClient;