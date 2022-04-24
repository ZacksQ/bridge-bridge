import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import MenuItem from "./MenuItem";
import MenuHeader from "./MenuHeader";
import {isSelfOrParent} from "../../../util/TreeUtils";

/**
 * 菜单组件
 * @param menuTreeData 菜单树结构数据
 * @param onMenuActive 菜单被激活时的回调
 */
function isActive(activeCode, code) {
    if (!activeCode || !code) return false;
    if (activeCode.length < code.length) return false;
    return activeCode.substr(0, code.length) === code;
}
const Menu = ({menuTreeData, onMenuActive}) => {
    //组件状态
    const [activeMenuCode, setActiveMenuCode] = useState(null);
    const [expandMenuCodes, setExpandMenuCodes] = useState([]);
    //处理菜单条目点击事件
    const handleMenuItemClick = (e, data) => {
    }

    //菜单全部收起

    // useEffect(() => {
    //     if (expandMenuCodes.length == 0) {
    //         let expMenu = []
    //         menuTreeData.forEach(item => {
    //             if (item.children && item.children.length > 0) {
    //                 expMenu.push(item.key)
    //                 // item.children.forEach(citem => {
    //                 //     if (citem.children && citem.children.length > 0) {
    //                 //         expMenu.push(citem.key)
    //                 //     }
    //                 // })
    //             }
    //         })
    //         setExpandMenuCodes(expMenu)
    //     }
    // }, [menuTreeData])
    //渲染菜单
    return (
      <ul style={{padding: 0}}>
          {menuTreeData.map((d, index) => <MenuItem key={d.key}
                                                    menuData={d}
                                                    onClick={handleMenuItemClick}
                                                    expandMenuCodes={expandMenuCodes}
                                                    setActiveMenuCode={setActiveMenuCode}
                                                    setExpandMenuCodes={setExpandMenuCodes}
                                                    onMenuActive={onMenuActive}
                                                    isActive={isActive}
                                                    activeMenuCode={activeMenuCode}/>
          )}
      </ul>
    )
}



Menu.propTypes = {
    menuTreeData: PropTypes.array.isRequired
};

export {isActive};
export default Menu;