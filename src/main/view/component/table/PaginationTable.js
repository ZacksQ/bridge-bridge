import React from "react";
import {Table} from "antd";

const PaginationTable = ({pageData, emptyText, ...props}) => {
    return (
        <Table
            size="small"
            tableLayout="fixed"
            dataSource={pageData?pageData.data:null}
            pagination={{
                ...pageData,
                data: undefined,
                // showSizeChanger: true,
                // pageSizeOptions: ["10", "20", "30", "50", "100"],
                showTotal: (total, range) => `第${range[0]}~${range[1]}条，共${total}条`
            }}
            locale={{emptyText: emptyText}}
            bordered
            {...props}
        />
    )
}

export default PaginationTable;