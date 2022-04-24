import React from "react";
import "./app_body.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Route, Switch, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./login/Login";
import Home from "./home/Home";
import StratumData from "./stratumData/index"
import BridgeName from "./bridgeName/BridgeName";
const AppBody = ({ psuhFn }) => {
    const location = useLocation();
    // psuhFn(location.pathname)
    const menu = useSelector(state => state.menu);
    
    return (
        <div >
            <div className="bread-crumb"style={{ margin: '72px 24px 20px 0' }}>
                {location.pathname=="/"?<span className="cur-path">桥梁说明参考</span>: (menu.curMenu&&menu.curMenu.parent&&<><span className="parent-path">{menu.curMenu.parent} / </span><span className="cur-path">{menu.curMenu.title}</span></>)}
            </div>
            <div className="app-body"  style={{marginBottom: 24}}>
                <TransitionGroup>
                    <CSSTransition
                        key={location.pathname}
                        classNames="switch"
                        appear={true}
                        timeout={500}
                        unmountOnExit={true}>
                        <Switch location={location}>
                            <Route path="/login" component={Login} />
                            <Route path="/" component={Home} exact />
                            <Route path="/stratumData" component={StratumData} exact />
                            <Route path="/bridgeName" component={BridgeName} exact />

                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    );
}

export default AppBody;