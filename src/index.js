import React from 'react';
import ReactDOM from 'react-dom';
import App from "./main/view/app/App";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import StoreContext from "./main/store";
import * as serviceWorker from './serviceWorker';
import {ConfigProvider} from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn"

//对状态进行持久化，使用SessionStorage
ReactDOM.render(
    <Provider store={StoreContext.store}>
        <PersistGate persistor={StoreContext.persistor}>
            <ConfigProvider locale={zh_CN}>
                <App />
            </ConfigProvider>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
