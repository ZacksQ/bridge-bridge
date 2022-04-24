import React, { useState } from "react";
import "antd/dist/antd.css";
import "./app.css";
import { useSelector } from "react-redux";
import AppSide from "./AppSide";
import AppHeader from "./AppHeader";
import AppBody from "./AppBody";
import Login from "./login/Login";
import { BackTop } from "antd";
import { HashRouter as Router } from "react-router-dom";

const App = () => {
    const auth = useSelector(state => state.auth);
    //菜单
    const [menuData, setMenuData] = useState([
        {
        key: '000', name: '桥梁说明参考', data: { "id": "1", "menuCode": "000", "menuName": "桥梁说明参考", "url": "/", "icon": <svg t="1647155843193" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3764" width="18" ><path d="M707.820606 246.949495v532.454141c0 53.553131-43.429495 96.982626-96.982626 96.982627H245.313939c-53.553131 0-96.982626-43.429495-96.982626-96.982627V246.031515c0-53.566061 43.429495-96.995556 96.982626-96.995555H610.83798c53.566061 0 96.982626 43.429495 96.982626 96.995555v0.91798z m0 670.422626v14.972121h111.90303c61.789091 0 111.90303-50.10101 111.903031-111.90303V372.84202c0-61.80202-50.10101-111.90303-111.903031-111.90303h-55.957979v-55.945051c0-61.80202-50.10101-111.90303-111.890101-111.90303H204.276364C142.474343 93.090909 92.373333 143.191919 92.373333 204.993939v615.447273c0 61.80202 50.10101 111.90303 111.903031 111.90303h447.599192a111.566869 111.566869 0 0 0 55.94505-14.972121z m167.848081-137.955555c0 53.553131-43.416566 96.982626-96.982626 96.982626H748.793535c9.528889-16.471919 14.972121-35.568485 14.972122-55.945051V316.88404h14.920404c53.566061 0 96.982626 43.416566 96.982626 96.982627v365.549899zM260.221414 694.561616c0 15.450505 12.528485 13.976566 27.966061 13.976566h279.751111c15.450505 0 27.97899 1.46101 27.97899-13.976566 0-15.450505-12.515556-41.968485-27.97899-41.968485H288.187475c-15.437576-0.012929-27.966061 26.505051-27.966061 41.968485z m0-167.86101c0 15.450505 12.528485 13.989495 27.966061 13.989495h279.751111c15.450505 0 27.97899 1.46101 27.97899-13.989495s-12.515556-41.968485-27.97899-41.968485H288.187475c-15.437576 0-27.966061 26.51798-27.966061 41.968485z m0-167.848081c0 15.450505 12.528485 13.989495 27.966061 13.989495h279.751111c15.450505 0 27.97899 1.46101 27.97899-13.989495s-12.515556-41.968485-27.97899-41.968485H288.187475c-15.437576 0-27.966061 26.51798-27.966061 41.968485z m0 0" p-id="3765"></path></svg> }
    },
    {
        key: '006', name: '桩长计算', data: {
            "id": "6", "menuCode": "006", "menuName": "桩长计算", "icon": <svg t="1647156023748" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3894" width="18">
            <path d="M150.331915 188.822695h595.51773v43.574468H150.331915zM106.757447 551.943262h682.666666v43.574468H106.757447zM77.707801 936.851064h755.290781v87.148936H77.707801z" p-id="3895"></path>
            <path d="M687.750355 624.567376c-5.809929 0-10.167376-1.452482-14.524823-5.809929l-421.219858-392.170213c-8.714894-8.714894-8.714894-21.787234-1.452483-30.502128 8.714894-8.714894 21.787234-8.714894 30.502128-1.452482l421.219858 392.170213c8.714894 8.714894 8.714894 21.787234 1.452483 30.502128-4.357447 4.357447-10.167376 7.262411-15.977305 7.262411z" p-id="3896"></path>
            <path d="M208.431206 624.567376c-5.809929 0-11.619858-2.904965-15.977305-7.262411-8.714894-8.714894-7.262411-21.787234 1.452482-30.502128l421.219858-392.170213c8.714894-8.714894 23.239716-7.262411 30.502128 1.452482 8.714894 8.714894 7.262411 23.239716-1.452482 30.502128l-421.219859 392.170213c-4.357447 4.357447-8.714894 5.809929-14.524822 5.809929z" p-id="3897"></path>
            <path d="M687.750355 987.687943c-5.809929 0-10.167376-1.452482-14.524823-5.809929l-421.219858-392.170213c-8.714894-8.714894-8.714894-21.787234-1.452483-30.502127 8.714894-8.714894 21.787234-8.714894 30.502128-1.452483l421.219858 392.170213c8.714894 8.714894 8.714894 21.787234 1.452483 30.502128-4.357447 4.357447-10.167376 7.262411-15.977305 7.262411z" p-id="3898"></path>
            <path d="M222.956028 973.163121c-5.809929 0-11.619858-2.904965-15.977305-7.262412-8.714894-8.714894-7.262411-21.787234 1.452483-30.502127l421.219858-392.170213c8.714894-8.714894 23.239716-7.262411 30.502127 1.452482 8.714894 8.714894 7.262411 23.239716-1.452482 30.502128l-421.219858 392.170212c-4.357447 4.357447-8.714894 5.809929-14.524823 5.80993z" p-id="3899"></path>
            <path d="M745.849645 1002.212766c-10.167376 0-20.334752-7.262411-21.787234-18.88227l-117.651063-758.195744c-1.452482-11.619858 5.809929-23.239716 18.882269-24.692199 11.619858-1.452482 23.239716 5.809929 24.692199 18.88227l117.651063 758.195744c1.452482 11.619858-5.809929 23.239716-18.882269 24.692199H745.849645zM148.879433 1002.212766h-2.904965c-11.619858-1.452482-20.334752-13.07234-18.882269-24.692199L244.743262 217.87234c1.452482-11.619858 13.07234-20.334752 24.692199-18.882269 11.619858 1.452482 20.334752 13.07234 18.882269 24.692199L170.666667 983.330496c-1.452482 11.619858-11.619858 18.88227-21.787234 18.88227zM446.638298 204.8h-94.411348L445.185816 29.049645l95.863829 175.750355zM767.636879 66.814184h178.65532v43.574468H767.636879z" p-id="3900"></path>
            <path d="M834.451064 0h43.574468v178.655319h-43.574468z" p-id="3901"></path></svg>
        },
        children: [
            { title: '地勘资料', key: '0061', data: { id: 61, "url": "/stratumData", menuName: "地勘资料" }, parent: "桩长计算" },
            { title: '桥梁名称', key: '0062', data: { id: 62, "url": "/bridgeName", menuName: "桥梁名称" }, parent: "桩长计算"  },
        ]
    }]);
    const [pathname, setPathname] = useState('/');
    // //获取菜单
    // useEffect(() => {
    //     // this.props.match.params
    //     if (auth.username) {
    //         // MenuClient.listMenuTrees(auth.id).then(setMenuData);
    //     }
    // }, [auth]);
    const psuhFn = (data) => {
        setPathname(data)
    }
    //判断是否需要重新登录
    if (auth && !auth.username) {
        return <Login />
    } else {
        //内容容器
        return (
            <div className="content-wrapper">
                <Router>
                    <AppHeader menuData={menuData} />
                    <AppSide menuData={menuData} />
                    <div className="content">
                        <AppBody
                            psuhFn={psuhFn}
                        />
                        <BackTop />
                    </div>
                </Router>
            </div>
        )
    }
}

export default App;