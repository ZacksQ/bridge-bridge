import React from "react";
import {Button, Popconfirm} from "antd";

/**
 * 删除按钮
 * @param onConfirm 二次确认是否删除
 */
const DeleteButton = ({onConfirm, onCancel, ...props}) => {
    return (
        <Popconfirm title="确定删除？" onConfirm={onConfirm} onCancel={onCancel} cancelButtonProps={{style:{float: 'right', marginLeft: 20}}}>
            <Button size="small" type="link" style={{color: "#ff4d4f"}} {...props}>删除</Button>
        </Popconfirm>
    )
}

export default DeleteButton;