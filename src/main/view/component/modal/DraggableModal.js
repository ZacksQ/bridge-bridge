import React, { useEffect, useState } from "react";
import "./draggable_modal.css";
import { Divider, Modal, Skeleton } from "antd";

//移动状态常量
const MOVE_STATE = { READY: Symbol(), DONE: Symbol() };

//全局变量，用于记录移动状态
let moveState, startPoint, initialPosition;

//起始位置
const INITIAL_POSITION = [0, 0];

/**
 * 可拖动的对话框
 * @param title 对话框标题
 * @param loading 对话框是否正在加载
 * @param width 对话框宽度
 * @param children 对话框内部内容
 * @param disableOkBtn 禁用确认按钮
 * @param restProps 与Antd的Modal属性保持一致
 */
const DraggableModal = ({ title, loading, children, disableOkBtn, ...restProps }) => {
    //组件状态
    const [position, setPosition] = useState(INITIAL_POSITION);
    const [opacity, setOpacity] = useState(undefined);
    //准备移动，标记状态
    const handleMoveStart = e => {
        moveState = MOVE_STATE.READY
        setOpacity(0.3)
        startPoint = [e.clientX, e.clientY];
        initialPosition = position;
    };
    //开始移动，修改位置
    const handleMove = e => {
        if (moveState === MOVE_STATE.READY) {
            setPosition([initialPosition[0] + e.clientX - startPoint[0], initialPosition[1] + e.clientY - startPoint[1]]);
        }
    };
    //结束移动
    const handleMoveDone = e => {
        moveState = MOVE_STATE.DONE;
        setOpacity(undefined);
    };
    //处理对话框关闭事件
    const handleClose = () => {
        setPosition(INITIAL_POSITION);
    };
    //初始化注册鼠标移动事件
    useEffect(() => {
        document.body.addEventListener("mouseup", handleMoveDone);
        document.body.addEventListener("mousemove", handleMove);
        return () => {
            document.body.removeEventListener("mouseup", handleMoveDone);
            document.body.removeEventListener("mousemove", handleMove);
        }
        // eslint-disable-next-line
    }, []);
    //渲染
    return (
        <Modal
            style={{ left: position[0], top: position[1], opacity }}
            bodyStyle={{ padding: 0 }}
            afterClose={handleClose}
            maskClosable={false}
            centered
            destroyOnClose
            okButtonProps={{ disabled: disableOkBtn }}
            cancelButtonProps={{
                style: {
                    float: "right",
                    marginLeft: 10
                }
            }}
            {...restProps}>
            {
                title
                    ?
                    <div className="draggable-modal-header" onMouseDown={handleMoveStart}>
                        <span className="draggable-modal-title">
                            {title}
                        </span>
                    </div>
                    :
                    null
            }
            <Divider style={{ margin: 0 }} />
            <div className="draggable-modal-body">
                <Skeleton paragraph={{ rows: 4 }} loading={loading} active>
                    {children}
                </Skeleton>
            </div>
        </Modal>
    )
}

export default DraggableModal;