import React from "react";
import {Button, Dropdown, Menu} from "antd";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";

/**
 * 带下拉菜单的按钮
 * @param listData 下拉菜单数据项
 * @param onClick 点击事件
 * @param children 按钮的子元素
 * @param keyProp key的属性名
 * @param titleProp 标题的属性名
 * @param restProps 剩下的属性
 */
const DropdownButton = ({listData = [], onItemClick, children, keyProp = "key", titleProp = "title", ...restProps}) => {
    //触发菜单点击事件
    const handleClick = menu => {
        onItemClick(menu.key);
    };
    //下拉菜单
    const menu = (
        <Menu onClick={handleClick}>
            {listData.map(d => (<Menu.Item key={d[keyProp]}>{d[titleProp]}</Menu.Item>))}
        </Menu>
    );
    //渲染
    return (
        <Dropdown overlay={menu} trigger={['click']} {...restProps}>
            <Button size="small" type="link" onClick={e => e.preventDefault()}>{children}<DownOutlined /></Button>
        </Dropdown>
    )
}

export default DropdownButton;