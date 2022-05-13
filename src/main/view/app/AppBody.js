import React from "react";
import "./app_body.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Route, Switch, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./login/Login";
import Home from "./home/Home";
import StratumData from "./stratumData/index"
import BridgeName from "./bridgeName/BridgeName";
import WelcomHome from "./WelcomHome";
const AppBody = ({ psuhFn, appHeaderRef }) => {
    const location = useLocation();
    // psuhFn(location.pathname)
    const menu = useSelector(state => state.menu);
    const auth = useSelector(state => state.auth)
    
    return (
        <div >
            {<div className="bread-crumb" style={{ margin: `${location.pathname != "/" || (location.pathname=="/"&&auth.rid)?'72px 24px 20px 0':0}`, overflow: 'hidden' }}>
                {location.pathname == "/intro" || (location.pathname=="/"&&auth.rid) ? <span className="cur-path">桥梁说明参考</span> : (location.pathname != "/" && menu.curMenu && menu.curMenu.parent && <><span className="parent-path">{menu.curMenu.parent} / </span><span className="cur-path">{menu.curMenu.title}</span></>)}
            </div>}
            <div className="app-body" style={{ 
                // marginBottom: 24, 
                minHeight: `${location.pathname == "/" ? 'calc(100vh - 98px)' : 'calc(100vh - 140px)'}` }}>
                <TransitionGroup>
                    <CSSTransition
                        key={location.pathname}
                        classNames="switch"
                        appear={true}
                        timeout={500}
                        unmountOnExit={true}>
                        <Switch location={location}>
                            <Route path="/" exact
                            // component={auth.rid ? Home : WelcomHome}  
                            render={()=>{
                                if(auth.rid){
                                    return <Home />
                                }else{
                                    return <WelcomHome appHeaderRef={appHeaderRef}/>
                                }
                            }}
                            />
                            <Route path="/login" component={Login} />
                            <Route path="/intro" component={Home} exact />
                            <Route path="/stratumData" component={StratumData} exact />
                            <Route path="/bridgeName" component={BridgeName} exact />
                            {/* <Route path="/welcome" component={WelcomHome} exact /> */}
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    );
}

export default AppBody;