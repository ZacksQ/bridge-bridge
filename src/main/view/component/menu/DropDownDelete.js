import React, {useState} from "react";
import { Dropdown, Menu} from "antd";
import DeleteButton from "../button/DeleteButton";

const DropDownDelete = ({handleDelete}) => {
    const [menuVisible, setMenuVisible] = useState(false)
    const menu = <Menu>
        <Menu.Item><DeleteButton onConfirm={() => {
            handleDelete()
            setMenuVisible(false)
        }} onCancel={()=>setMenuVisible(false)}>删除</DeleteButton></Menu.Item>
    </Menu>

    return (
        <Dropdown overlay={menu} trigger={"click"} visible={menuVisible}>
            <a className="ant-dropdown-link" onClick={()=>{setMenuVisible(!menuVisible)}}>更多</a>
        </Dropdown>)
}

export default DropDownDelete;