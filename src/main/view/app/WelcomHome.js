import { Button } from "antd";
import React from "react";
import "./app_body.css";
import himg from '../../../resources/img/41471650763190_.pic.jpg'

const WelcomHome = ({appHeaderRef}) => {
    return (
        <div >
            <div className="bread-crumb"style={{ margin: '72px 24px 20px 0' }}>
                
            </div>
            <div className="app-body"  style={{marginBottom: 24, display:"grid"}}>
                <div className="welcom-page-wrap">
                    <div className="wbox">
                        <div className="hi">
                            <img src={himg} />
                        </div>
                        <div>
                            <div className="welcome-txt">欢迎使用桥梁智能设计系统<br/>
                            请建立或切换路线</div>
                            <Button type="primary" style={{width: 120}} onClick={()=>{
                                appHeaderRef.current.setVisible(true)}}>路线切换</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomHome;