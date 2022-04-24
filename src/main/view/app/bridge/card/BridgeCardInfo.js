import React, {useEffect, useState} from "react";
import "./bridge-card.css";
import BridgeBaseClient from "../../../../client/bridge/BridgeBaseClient";
import {Skeleton} from "antd";
import {toDate} from "../../../../util/DateUtils";
import {ALIOSS_URL} from "../../../../config";

const BridgeCardInfo = ({bridgeId}) => {
    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState({});
    //获取卡片数据
    const fetchBridgeCardData = bridgeId => {
        setLoading(true);
        BridgeBaseClient.getBridgeCard(bridgeId)
            .then(data => {
                if (data) {
                    setCardData(data);
                } else {
                    setCardData({});
                }
            })
            .finally(() => setLoading(false));
    }
    //初始化获取数据
    useEffect(() => {
        fetchBridgeCardData(bridgeId);
    }, [bridgeId]);
    //返回视图
    return (
        <Skeleton loading={loading}>
            <table className="bridge-card-table">
                <tbody>
                <tr>
                    <th colSpan={9}>A：行政识别数据</th>
                </tr>
                <tr>
                    <th className="index">1</th>
                    <th className="title">路线编号</th>
                    <td>{getFieldValue(cardData, "roadNo", "/")}</td>
                    <th className="index">2</th>
                    <th className="title">路线名</th>
                    <td>{getFieldValue(cardData, "roadName", "/")}</td>
                    <th className="index">3</th>
                    <th className="title">路线等级</th>
                    <td style={{width: '15%'}}>{getFieldValue(cardData, "roadRank", "/")}</td>
                </tr>
                <tr>
                    <th className="index">4</th>
                    <th className="title">桥梁编号</th>
                    <td>{getFieldValue(cardData, "bridgeCode", "/")}</td>
                    <th className="index">5</th>
                    <th className="title">桥梁名称</th>
                    <td>{getFieldValue(cardData, "bridgeName", "/")}</td>
                    <th className="index">6</th>
                    <th className="title">桥位桩号</th>
                    <td>{getFieldValue(cardData, "stakeNo", "/")}</td>
                </tr>
                <tr>
                    <th className="index">7</th>
                    <th className="title">功能类型</th>
                    <td>{getFieldValue(cardData, "functionType", "/")}</td>
                    <th className="index">8</th>
                    <th className="title">下穿通道名</th>
                    <td>{getFieldValue(cardData, "strideName", "/")}</td>
                    <th className="index">9</th>
                    <th className="title">下穿通道孔号</th>
                    <td>{getFieldValue(cardData, "strideStakeNo", "/")}</td>
                </tr>
                <tr>
                    <th className="index">10</th>
                    <th className="title">设计荷载</th>
                    <td>{getFieldValue(cardData, "designLoadRank", "/")}</td>
                    <th className="index">11</th>
                    <th className="title">通行载重</th>
                    <td>{getFieldValue(cardData, "loadCapacity", "/")}</td>
                    <th className="index">12</th>
                    <th className="title">弯斜坡度</th>
                    <td>{getFieldValue(cardData, "slopeFeature", "/")}</td>
                </tr>
                <tr>
                    <th className="index">13</th>
                    <th className="title">桥面铺装</th>
                    <td>{getFieldValue(cardData, "deckPavement", "/")}</td>
                    <th className="index">14</th>
                    <th className="title">管养单位</th>
                    <td>{getFieldValue(cardData, "management", "/")}</td>
                    <th className="index">15</th>
                    <th className="title">建成年限</th>
                    <td>{getFieldValue(cardData, "buildDate", "/")}</td>
                </tr>
                <tr>
                    <th colSpan="9">B：结构技术数据</th>
                </tr>
                <tr>
                    <th className="index">16</th>
                    <th className="title">桥梁全长(m)</th>
                    <td>{getFieldValue(cardData, "bridgeLength", "/")}</td>
                    <th className="index">17</th>
                    <th className="title">桥面总宽(m)</th>
                    <td>{getFieldValue(cardData, "deckTotalWidth", "/")}</td>
                    <th className="index">18</th>
                    <th className="title">车行道宽(m)</th>
                    <td>{getFieldValue(cardData, "laneWidth", "/")}</td>
                </tr>
                <tr>
                    <th className="index">19</th>
                    <th className="title">桥面标高(m)</th>
                    <td>{getFieldValue(cardData, "deckElevation", "/")}</td>
                    <th className="index">20</th>
                    <th className="title">桥下净空(m)</th>
                    <td style={{width: '28%'}}>{getFieldValue(cardData, "downClearHeight", "/")}</td>
                    <th className="index">21</th>
                    <th className="title">桥上净高(m)</th>
                    <td>{getFieldValue(cardData, "upClearHeight", "/")}</td>
                </tr>
                <tr>
                    <th className="index">22</th>
                    <th className="title">引道总宽(m)</th>
                    <td>{getFieldValue(cardData, "accessTotalWidth", "/")}</td>
                    <th className="index">23</th>
                    <th className="title">引道路面宽(m)</th>
                    <td>{getFieldValue(cardData, "accessRoadWidth", "/")}</td>
                    <th className="index">24</th>
                    <th className="title">引道线形</th>
                    <td>{getFieldValue(cardData, "accessLineType", "/")}</td>
                </tr>
                <tr>
                    <td style={{padding: 0}} colSpan={9}>
                        <table className="bridge-card-table inner-table">
                            <tbody>
                            <tr>
                                <th className="index" rowSpan={4}>上部结构</th>
                                <th className="index">25</th>
                                <th className="title">孔号</th>
                                <td style={{width: '41%'}}>{getFieldValue(cardData, "siteNos", "/")}</td>
                                <th className="index" rowSpan={4}>下部结构</th>
                                <th className="index">29</th>
                                <th className="title">桥墩构造类型</th>
                                <td>{getFieldValue(cardData, "pierNos", "/")}</td>
                                <td>{getFieldValue(cardData, "abutmentNos", "/")}</td>
                            </tr>
                            <tr>
                                <th className="index">26</th>
                                <th className="title">上部结构类型</th>
                                <td>{getFieldValue(cardData, "superstructureType", "/")}</td>
                                <th className="index">30</th>
                                <th className="title">桥台构造类型</th>
                                <td>{getFieldValue(cardData, "pierType", "/")}</td>
                                <td>{getFieldValue(cardData, "abutmentType", "/")}</td>
                            </tr>
                            <tr>
                                <th className="index">27</th>
                                <th className="title">跨径(m)</th>
                                <td>{getFieldValue(cardData, "spanComb", "/")}</td>
                                <th className="index">31</th>
                                <th className="title">墩台材料</th>
                                <td>{getFieldValue(cardData, "pierAbutmentMaterial", "/")}</td>
                                <td>{getFieldValue(cardData, "abutmentMaterial", "/")}</td>
                            </tr>
                            <tr>
                                <th className="index">28</th>
                                <th className="title">上部结构材料</th>
                                <td>{getFieldValue(cardData, "superMaterial", "/")}</td>
                                <th className="index">32</th>
                                <th className="title">基础形式</th>
                                <td>{getFieldValue(cardData, "baseType", "/")}</td>
                                <td>{getFieldValue(cardData, "abutmentBaseType", "/")}</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th className="index">33</th>
                    <th className="title">伸缩缝类型</th>
                    <td>{getFieldValue(cardData, "expansionJointType", "/")}</td>
                    <th className="index">34</th>
                    <th className="title">支座形式</th>
                    <td>{getFieldValue(cardData, "supportType", "/")}</td>
                    <th className="index">35</th>
                    <th className="title">地震动峰值<br/>加速度系数</th>
                    <td>{getFieldValue(cardData, "seismicPeakAcceleration", "/")}</td>
                </tr>
                <tr>
                    <th className="index">36</th>
                    <th className="title">桥台护坡</th>
                    <td>{getFieldValue(cardData, "slopeProtector", "/")}</td>
                    <th className="index">37</th>
                    <th className="title">护墩体</th>
                    <td>{getFieldValue(cardData, "pierProtector", "/")}</td>
                    <th className="index">38</th>
                    <th className="title">调治构造物</th>
                    <td>{getFieldValue(cardData, "regulatingStructure", "/")}</td>
                </tr>
                <tr>
                    <th className="index">39</th>
                    <th className="title">常水位</th>
                    <td>{getFieldValue(cardData, "normalWaterGrade", "/")}</td>
                    <th className="index">40</th>
                    <th className="title">设计水位</th>
                    <td>{getFieldValue(cardData, "designWaterGrade", "/")}</td>
                    <th className="index">41</th>
                    <th className="title">历史洪水位</th>
                    <td>{getFieldValue(cardData, "historyMaxFlood", "/")}</td>
                </tr>
                <tr>
                    <th colSpan={9}>C：档案资料(全、不全或无)</th>
                </tr>
                <tr>
                    <th className="index">42</th>
                    <th className="title">设计图纸</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "designPaper", "/")}</td>
                    <th className="index">43</th>
                    <th className="title">设计文件</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "designFile", "/")}</td>
                    <th className="index">44</th>
                    <th className="title">施工文件</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "constructFile", "/")}</td>
                </tr>
                <tr>
                    <th className="index">45</th>
                    <th className="title">竣工图纸</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "completionFile", "/")}</td>
                    <th className="index">46</th>
                    <th className="title">验收文件</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "acceptFile", "/")}</td>
                    <th className="index">47</th>
                    <th className="title">行政文件</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "administrativeFile", "/")}</td>
                </tr>
                <tr>
                    <th className="index">48</th>
                    <th className="title">定期检查报告</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "regularReport", "/")}</td>
                    <th className="index">49</th>
                    <th className="title">特殊检查报告</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "specialReport", "/")}</td>
                    <th className="index">50</th>
                    <th className="title">历次维修资料</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "repairRecord", "/")}</td>
                </tr>
                <tr>
                    <th className="index">51</th>
                    <th className="title">档案号</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "fileNo", "/")}</td>
                    <th className="index">52</th>
                    <th className="title">存档案</th>
                    <td>{getFieldValue(cardData ? cardData.bridgeFile : cardData, "saveFile", "/")}</td>
                    <th className="index">53</th>
                    <th className="title">建档年月</th>
                    <td>{getDateField(cardData ? cardData.bridgeFile : cardData, "fileDate", "/")}</td>
                </tr>
                <tr>
                    <th colSpan={9}>D：最近技术状况评定</th>
                </tr>
                <tr>
                    <td style={{padding: 0}} colSpan={9}>
                        <table className="bridge-card-table inner-table">
                            <tbody>
                            <tr>
                                <th style={{width: "10%", textAlign: "center"}}>54</th>
                                <th style={{width: "10%", textAlign: "center"}}>55</th>
                                <th style={{width: "10%", textAlign: "center"}}>56</th>
                                <th style={{width: "10%", textAlign: "center"}}>57</th>
                                <th style={{width: "10%", textAlign: "center"}}>58</th>
                                <th style={{width: "7%", textAlign: "center"}}>59</th>
                                <th style={{width: "8%", textAlign: "center"}}>60</th>
                                <th style={{width: "5%", textAlign: "center"}}>61</th>
                                <th style={{width: "10%", textAlign: "center"}}>62</th>
                                <th style={{width: "10%", textAlign: "center"}}>63</th>
                                <th style={{width: "10%", textAlign: "center"}}>64</th>
                            </tr>
                            <tr>
                                <th style={{width: "10%", textAlign: "center"}}>检查年月</th>
                                <th style={{width: "10%", textAlign: "center"}}>定期或特殊检查</th>
                                <th style={{width: "10%", textAlign: "center"}}>全桥评定等级</th>
                                <th style={{width: "10%", textAlign: "center"}}>桥台与基础</th>
                                <th style={{width: "10%", textAlign: "center"}}>桥墩与基础</th>
                                <th style={{width: "7%", textAlign: "center"}}>地基冲刷</th>
                                <th style={{width: "8%", textAlign: "center"}}>上部结构</th>
                                <th style={{width: "5%", textAlign: "center"}}>支座</th>
                                <th style={{width: "10%", textAlign: "center"}}>经常保养小修</th>
                                <th style={{width: "10%", textAlign: "center"}}>处治对策</th>
                                <th style={{width: "10%", textAlign: "center"}}>下次检查年份</th>
                            </tr>
                            {
                                Array.isArray(cardData.bridgeEvaluations) && cardData.bridgeEvaluations.length > 0
                                    ? cardData.bridgeEvaluations.map(d => (
                                        <tr key={d.id}>
                                            <td>{d.inspectionYear}</td>
                                            <td>定期检查</td>
                                            <td>{d.bridgeRank}</td>
                                            <td>{d.abutmentRank}</td>
                                            <td>{d.pierRank}</td>
                                            <td>{d.baseRank}</td>
                                            <td>{d.superRank}</td>
                                            <td>{d.supportRank}</td>
                                            <td>{d.regularRepair}</td>
                                            <td>{d.fixStrategy}</td>
                                            <td>{d.nextYear}</td>
                                        </tr>
                                    ))
                                    : (
                                        <tr>
                                            <td>/</td>
                                            <td>/</td>
                                            <td>/</td>
                                            <td>/</td>
                                            <td>/</td>
                                            <td>/</td>
                                            <td>/</td>
                                            <td>/</td>
                                            <td>/</td>
                                            <td>/</td>
                                            <td>/</td>
                                        </tr>
                                    )
                            }
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th colSpan={9}>E：修建工程记录</th>
                </tr>
                <tr>
                    <td style={{padding: 0}} colSpan={9}>
                        <table className="bridge-card-table inner-table">
                            <tbody>
                            <tr>
                                <th style={{width: "10%"}}>65</th>
                                <th style={{width: "10%"}}>施工日期</th>
                                <th style={{width: "4%"}} rowSpan="2">66</th>
                                <th style={{width: "4%"}} rowSpan="2">修建类别</th>
                                <th style={{width: "4%"}} rowSpan="2">67</th>
                                <th style={{width: "4%"}} rowSpan="2">修建原因</th>
                                <th style={{width: "4%"}} rowSpan="2">68</th>
                                <th style={{width: "4%"}} rowSpan="2">工程范围</th>
                                <th style={{width: "4%"}} rowSpan="2">69</th>
                                <th style={{width: "4%"}} rowSpan="2">工程费用(万元)</th>
                                <th style={{width: "4%"}} rowSpan="2">70</th>
                                <th style={{width: "4%"}} rowSpan="2">经费来源</th>
                                <th style={{width: "4%"}} rowSpan="2">71</th>
                                <th style={{width: "4%"}} rowSpan="2">质量评定</th>
                                <th style={{width: "4%"}} rowSpan="2">72</th>
                                <th style={{width: "4%"}} rowSpan="2">建设单位</th>
                                <th style={{width: "4%"}} rowSpan="2">74</th>
                                <th style={{width: "4%"}} rowSpan="2">设计单位</th>
                                <th style={{width: "4%"}} rowSpan="2">75</th>
                                <th style={{width: "4%"}} rowSpan="2">施工单位</th>
                                <th style={{width: "4%"}} rowSpan="2">76</th>
                                <th style={{width: "4%"}} rowSpan="2">监理单位</th>
                            </tr>
                            <tr>
                                <th>开工</th>
                                <th>竣工</th>
                            </tr>
                            {
                                Array.isArray(cardData.bridgeBuilds) && cardData.bridgeBuilds.length > 0
                                ? cardData.bridgeBuilds.map(d => (
                                        <tr key={d.id}>
                                            <td>{getDateField(d, "commenceDate", "/")}</td>
                                            <td>{getDateField(d, "completionDate", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "buildTypeName", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "buildReason", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "projectRange", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "projectCost", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "chargeSource", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "qualityEvaluationName", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "buildUnit", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "designUnit", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "constructUnit", "/")}</td>
                                            <td colSpan="2">{getFieldValue(d, "superviseUnit", "/")}</td>
                                        </tr>
                                    ))
                                    : (
                                        <tr>
                                            <td>/</td>
                                            <td>/</td>
                                            <td colSpan="2">/</td>
                                            <td colSpan="2">/</td>
                                            <td colSpan="2">/</td>
                                            <td colSpan="2">/</td>
                                            <td colSpan="2">/</td>
                                            <td colSpan="2">/</td>
                                            <td colSpan="2">/</td>
                                            <td colSpan="2">/</td>
                                            <td colSpan="2">/</td>
                                            <td colSpan="2">/</td>
                                        </tr>
                                    )
                            }
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style={{padding: 0}} colSpan={9}>
                        <table className="bridge-card-table inner-table">
                            <tbody>
                            <tr>
                                <th style={{width: "10%"}}>F</th>
                                <th style={{width: "10%"}}>桥梁照片</th>
                                <th style={{width: "4%"}}>77</th>
                                <th style={{width: "10%"}}>立面照</th>
                                <td style={{width: "26%", textAlign: "center"}}>
                                    {cardData.sidePhoto&&<img src={ALIOSS_URL + getFieldValue(cardData, "sidePhoto")} alt=""
                                          style={{width: 150}}/>}
                                </td>
                                <th style={{width: "4%"}}>78</th>
                                <th style={{width: "10%"}}>桥梁正面照</th>
                                <td style={{width: "26%", textAlign: "center"}}>
                                    {cardData.frontPhoto&&<img src={ALIOSS_URL + getFieldValue(cardData, "frontPhoto")} alt="" style={{width: 150}}/>}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </Skeleton>
    );
}

function getFieldValue(target, field, defaultValue) {
    if (!target || target[field] === undefined || target[field] === null) {
        return defaultValue ? defaultValue : undefined;
    } else {
        return target[field];
    }
}

function getDateField(target, field, defaultValue) {
    if (!target || target[field] === undefined || target[field] === null) {
        return defaultValue ? defaultValue : undefined;
    } else {
        return toDate(target, field).format("YYYY-MM-DD");
    }
}

export default BridgeCardInfo;