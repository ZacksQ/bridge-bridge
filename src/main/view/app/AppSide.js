import React from "react";
import "./app_side.css";
import ScrollBody from "../component/scroll/ScrollBody";
import Menu from "../component/menu/Menu";
import {useDispatch} from "react-redux";
import {setCurMenu} from "../../store/action/MenuAction";

const AppSide = ({menuData}) => {
    const dispatch = useDispatch();
    return (
        <aside className="app-side">
            <div className="logo-wrapper">
            </div>
            <div className="menu-wrapper">
                <ScrollBody maxHeight="100%">
                    <Menu menuTreeData={menuData} onMenuActive={menu => dispatch(setCurMenu(menu))}/>
                </ScrollBody>
            </div>
        </aside>
    );
};

export default AppSide;