import React from "react";
import "./menu.css";
import PropTypes from "prop-types";
import * as Icons from '@ant-design/icons';
import Icon from "@ant-design/icons";
import {Link} from "react-router-dom";
import {isSelfOrParent} from "../../../util/TreeUtils";

const circle = () =>  (
  <svg width="14px" height="14px" viewBox="0 0 11 11">
      <title>圆形</title>
      <g id="圆形" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <circle id="椭圆形" stroke="#A5B6D1" strokeWidth="0.5" cx="7" cy="7" r="3"/>
      </g>
  </svg>
);

const len = () => (
  <svg width="14px" height="14px" viewBox="0 0 14 14">
      <title>画板</title>
      <g id="画板" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <rect id="矩形" stroke="#A5B6D1" strokeWidth="0.5" transform="translate(7.500000, 7.500000) rotate(45.000000) translate(-7.500000, -7.500000) " x="4" y="4" width="7" height="7"/>
      </g>
  </svg>
);

/**
 * 单个菜单条目
 * @param activeMenuCode 当前激活的菜单
 * @param expandMenuCodes 展开的菜单编码
 * @param menuData 菜单数据
 * @param onClick 菜单点击事件
 */
const MenuItem = ({activeMenuCode, expandMenuCodes, menuData, onClick, setActiveMenuCode, onMenuActive, setExpandMenuCodes, isActive}) => {
    //菜单点击事件
    const handleClick = (e, data, callback) => {
        if(Array.isArray(data.children) && data.children.length > 0){
            e.preventDefault();
        }
        //判断激活的菜单
        let active = isActive(activeMenuCode, data.key);
        //子菜单为空的均不能激活
        if (!data.children || (Array.isArray(data.children) && data.children.length === 0)) active = false;
        //判断展开的菜单
        let expandCodes = [];
        if (expandMenuCodes.indexOf(data.key) >= 0) {
            expandCodes = expandMenuCodes.filter(c => !isSelfOrParent(c, data.key));
        } else {
            expandCodes = [...expandMenuCodes, data.key];
        }

        //设置状态
        setActiveMenuCode(active ? data.key.substr(0, data.key.length - 3) : data.key);
        setExpandMenuCodes(expandCodes);
        //如果菜单能跳转的话，调用跳转菜单的回调函数
        if (data.data.url) {
        
            onMenuActive(data);
        }
    };
    //定义子菜单
    let subMenu = null;
    let caret = null;
    let menuItemClass = "menu-item";
    if (menuData.children && menuData.children.length > 0) {
        subMenu = (
          <ul className="sub-menu">
              {menuData.children.map(d =>
                <MenuItem key={d.key}
                          menuData={d}
                          onClick={e => handleClick(e, d, onClick)}
                          expandMenuCodes={expandMenuCodes}
                          setActiveMenuCode={setActiveMenuCode}
                          onMenuActive={onMenuActive}
                          setExpandMenuCodes={setExpandMenuCodes}
                          isActive={isActive}
                          activeMenuCode={activeMenuCode}/>
              )}
          </ul>
        );
        caret = (
          <Icons.RightOutlined className="caret"/>
        );
    }
    //判断菜单状态
    if (isActive(activeMenuCode, menuData.key) && !menuData?.children?.length) menuItemClass += " active";
    // if (expandMenuCodes.indexOf(menuData.key) >= 0) {
    //     menuItemClass += " expanded"
    // } else {
    //     menuItemClass.replace(" expanded", "");
    // }
    //菜单图标
    const MenuIcon = menuData.data.icon && Icons[menuData.data.icon]
      ? Icons[menuData.data.icon]
      : null;
    //渲染菜单
    return (
      <li className={menuItemClass + (expandMenuCodes.indexOf(menuData.key) >= 0?' expanded '+menuData.key: '')}>
          <Link to={menuData.data.url ? menuData.data.url : ""} className="menu-item-link"
                onClick={e => handleClick(e, menuData, onClick)}>
              {/* {MenuIcon && <MenuIcon className="menu-item-icon"/>
              || (!menuData?.children?.length ?
                <Icon component={circle} style={{bottom: 6}} className="menu-item-icon" /> :
                <Icon component={len} style={{bottom: 6}} className="menu-item-icon"/>)
              } */}
              {menuData.data.icon && menuData.data.icon}
              <span className="menu-item-title">{menuData.data.menuName}</span>
              {caret}
          </Link>
          {subMenu}
      </li>
    )
}

MenuItem.propTypes = {
    activeMenuCode: PropTypes.string,
    expandMenuCodes: PropTypes.array,
    menuData: PropTypes.object,
    onClick: PropTypes.func
}

export default MenuItem;