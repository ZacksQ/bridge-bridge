import React from "react";
import PropTypes from "prop-types";
import "./menu.css";

/**
 * 菜单标题栏
 * @param title 菜单标题
 */
const MenuHeader = ({title}) => {
    return (
        <li className="menu-header">
            {title}
        </li>
    );
};

MenuHeader.propTypes = {
    title: PropTypes.string
};

export default MenuHeader;