import React, {Fragment, useEffect, useState} from "react";
import {Tabs, Divider, Form, Row, Col, Popconfirm, message, Select, Button, Spin, Table, Card} from "antd";
import AidDecisionMakingClient from "../../../../client/bridge/AidDecisionMakingClient";
import * as G2 from '@antv/g2'
import { DataSet } from '@antv/data-set';
import PriceIcon from '../../../../../resources/img/工程包预估费用图标.png'

const OptimizeConfigDetail = ({ detailData, goBack, capitalConfig, inspectionYear }) => {

    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [tableData, setTableData] = useState({data: [], current: 1, pageSize: 10, searchData: {}, total: 0})
    const [chartData, setChartData] = useState(null)
    const [sumPrice, setSumPrice] = useState(0)

    const fetchTableData = () => {
        setTableLoading(true)
        if (capitalConfig) {
            let params = {
                ...tableData,
                searchData: {
                    "inspectionYear": [inspectionYear],
                    "planIds": [detailData.planIds],
                    "roads": [detailData.roads],
                    "areas": [detailData.areas]
                }
            }

            AidDecisionMakingClient.getProjectDetailListByLimit(params).then(res => {
                setTableData(res)
            }).finally(() => {
                setTableLoading(false)
            })
        } else {
            let params = { ...tableData, searchData: {projectId: [detailData.id]} }

            AidDecisionMakingClient.getProjectDetailList(params).then(res => {
                    setTableData(res)
            }).finally(() => {
                setTableLoading(false)
            })
        }
    }

    useEffect(() => {
        fetchTableData()
        fetchProjectPlanPriceList()
    }, [])

    const initChart = (responseData) => {
        let list = responseData.slice(0, 5)
        let sumPrice = list.reduce((a, b) => a + b.price, 0)
        let charData = list.map(item => ({
            type: item.name,
            percent: parseFloat((item.price / sumPrice).toFixed(10)),
            price: item.price
        }))
        let chart = new G2.Chart({
            container: 'chart-wrap',
            forceFit: true,
            animate: false,
            height: 130,
            padding: [0, 130, 0, 0]
        });

        const sum = 500;
        const ds = new DataSet();
        const dv = ds.createView().source(charData);
        dv.transform({
            type: 'map',
            callback(row) {
                row.value = parseInt(sum * row.percent);
                return row;
            }
        });

        chart.source(dv, {
            price: {
                alias: '费用'
            },
            type: {
                alias: '项目名称'
            }
        });

        chart.legend({
            position: 'right-center',
            offsetX: 0
        });
        chart.coord('theta', {
            radius: 1,
            innerRadius: 0.6
        });
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        })
        chart.intervalStack().position('percent').color('type', [
            '#5C89FF',
            '#7c6af2',
            '#c95ff2',
            '#ff6383',
            '#ff9f40',
            '#ffcb48',
            '#31dc72'
        ])
            .opacity(1).tooltip('type*price')

        chart.render();
    }

    const fetchProjectPlanPriceList = () => {
        setLoading(true)
        if (capitalConfig) {
            let params = {
                "inspectionYear": inspectionYear,
                "planIds": detailData.planIds,
                "roads": detailData.roads,
                areas: detailData.areas
            }

            AidDecisionMakingClient.getProjectPlanPriceListByLimit(params).then(res => {
                setLoading(false)
                initChart(res)
            })
        } else {
            let params = { projectId: detailData.id }
            AidDecisionMakingClient.getProjectPlanPriceList(params).then(res => {
                setLoading(false)
                initChart(res)

            })
        }
    }

    const handleTableChange = (pagination) => {
        tableData.current = pagination.current
        tableData.pageSize = pagination.pageSize
        fetchTableData();
    }


    let columns = [
        { title: "桥梁名称", width: 350, dataIndex: "bridgeName", key: "bridgeName" },
        // { title: "分幅", width: 80, dataIndex: "sideTypeName", key: "sideTypeName" },
        // { title: "结构类型", width: 150, dataIndex: "superStructureTypeName", key: "superStructureTypeName" },
        // { title: "跨径组合", dataIndex: "spanComb", key: "spanComb" },
        { title: "处治方案（工程量）", /*width: 340,*/ dataIndex: "dealPlan", key: "dealPlan" },
        {
            title: "预估费用 ", width: 250, dataIndex: "price", key: "price", render: (text) => {
                return text.toFixed(2)
            }
        },
    ];
    //渲染
    return (
        <Spin spinning={loading}>
            <Card
                bodyStyle={{ padding: "12px" }}
                style={{ marginBottom: 12 }}
                title={"工程包详情 "}
                extra={<a href="#" onClick={e => {
                    e.preventDefault()
                    goBack()
                }}>返回</a>}
            >
                <div className="project-package-detail-header">
                    <div className="package-price">
                        <div className="p">
                            <div><img src={PriceIcon} /> </div>
                            <div>
                                <div className="label">预估费用</div>
                                <div className="price">
                                    <span className="unit">¥</span>
                                    <span>{detailData.allprice?detailData.allprice:(detailData.price?detailData.price:0)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="chart-wrap" id="chart-wrap"></div>
                    </div>
                    <div className="project-road-config-item detail">
                        <div className="project-name">{detailData.name || detailData.planNames}</div>
                        <div className="prci-body">
                            <div className="prci-left">
                                <div className="row">
                                    <div className="label">包含路线：</div>
                                    <div className="value">{capitalConfig ? detailData.roads : detailData.roadNames}</div>
                                </div>
                                {capitalConfig != 1 && <div className="row">
                                    <div className="label">包含路段：</div>
                                    <div className="value">{detailData.areas}</div>
                                </div>}
                                {capitalConfig != 2 && <div className="row">
                                    <div className="label">处治内容：</div>
                                    <div className="value">{detailData.planNames.split("、").map((item, index) => <div className="tag" key={index}>{item}</div>)}</div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <Card
                bodyStyle={{ padding: "12px" }}
                title={"桥梁处治详情 "}
            >
                <Spin spinning={tableLoading}>
                    <Table
                        bordered
                        size="small"
                        dataSource={tableData.data}
                        columns={columns}
                        rowKey="id"
                        onChange={handleTableChange}
                        pagination={{
                            total: tableData.total,
                            showSizeChanger: true,
                            showTotal: (total => `共 ${total} 条`),
                            pageSizeOptions: ["10", "20", "50", "100"]
                        }}
                    />
                </Spin>
            </Card>
        </Spin>
    );
};

export default OptimizeConfigDetail;