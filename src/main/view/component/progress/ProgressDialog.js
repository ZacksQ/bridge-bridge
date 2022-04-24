import React from "react";
import {Modal, Progress} from "antd";

const ProgressDialog = ({total, progress, ...restProps}) => {
    return (
        <Modal
            title="正在执行中..."
            footer={null}
            closable={false}
            centered
            {...restProps}>
            <Progress
                strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                }}
                percent={progress * 100 / total}
                status="active"/>
        </Modal>
    )
}

export default ProgressDialog;