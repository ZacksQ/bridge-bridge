import React from "react";
import "./toolbar.css";
import {Space} from "antd";

/**
 * 工具栏，用于存放表格上方的按钮
 * @param children
 * @param restProps
 */
const Toolbar = ({children, ...restProps}) => {
    return (
        <Space className="toolbar" {...restProps}>
            {children}
        </Space>
    )
}

export default Toolbar;