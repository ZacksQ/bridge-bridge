import React from "react";
import "./card.css";
import {Skeleton} from "antd";
import {useHistory} from "react-router";
import {LeftOutlined} from "@ant-design/icons";

/**
 * 卡片绘制
 * @param loading 是否处于加载状态
 * @param style 自定义样式
 * @param className 自定义样式类
 * @param title 卡片标题
 * @param extra 卡片头部额外的内容，元素
 * @param canBack 是否可返回
 * @param children 卡片内部元素
 * @param footer 卡片页脚元素
 */
const Card = ({loading, style, className, title, extra, canBack, children, footer}) => {
    //路由
    const history = useHistory();
    //卡片标题是否可返回
    const cardTitle = canBack
        ? (
            <div className="card-title">
                <h4 className="clickable" onClick={history.goBack}><LeftOutlined className="back-icon"/>{title}</h4>
            </div>
        )
        : (
            <div className="card-title">
                {title&&<h4>{title}</h4>}
            </div>
        )
    //卡片脚部
    const footerRender = footer ? [<hr key="divider"/>, <div key="card-footer" className="card-footer">{footer}</div>] : null;
    //渲染组件
    return (
        <div style={style} className={"card " + className}>
            <span className="pull-right">
                {extra}
            </span>
            {cardTitle}
            <Skeleton paragraph={{rows: 8}} loading={loading} active>
                {children}
                {footerRender}
            </Skeleton>
        </div>
    )
}

export default Card;