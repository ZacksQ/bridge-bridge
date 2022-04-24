import React from "react"
import BridgeBaseClient from "../client/bridge/BridgeBaseClient";
import {toDate} from "./DateUtils";
import BridgeSideClient from "../client/bridge/BridgeSideClient";
import MemberTypeClient from "../client/param/MemberTypeClient";
import BridgeMemberClient from "../client/bridge/BridgeMemberClient";

/**
 * 从基础数据库复制桥梁
 * @param bridgeId 桥梁ID
 */
const copyBridgeFromBase = async bridgeId => {
    //获取并保存桥梁
    let bridge = await BridgeBaseClient.getBridgeByIdFromBase(bridgeId);
    bridge = {
        ...bridge,
        buildDate: toDate(bridge, "buildDate"),
        rebuildDate: toDate(bridge, "rebuildDate"),
        openTrafficDate: toDate(bridge, "openTrafficDate"),
    };
    await BridgeBaseClient.updateBridge(bridgeId, bridge);
    //获取并保存分幅
    const bridgeSides = await BridgeSideClient.listBridgeSidesFromBase(bridgeId);
    for (let bridgeSide of bridgeSides) {
        bridgeSide = await BridgeSideClient.getBridgeSideByIdFromBase(bridgeSide.id);
        await BridgeSideClient.updateBridgeSide(bridgeSide.id, bridgeSide);
        const bridgeSites = await BridgeSideClient.listBridgeSitesBySideFromBase(bridgeSide.id);
        if (bridgeSites.length === 0) continue;
        //更新上部结构类型
        let startSiteNo = 1, superstructureTypeId = bridgeSites[0].superstructureTypeId;
        for (let bridgeSite of bridgeSites) {
            if (superstructureTypeId && superstructureTypeId !== bridgeSite.superstructureTypeId) {
                await BridgeSideClient.updateSiteSuperstructureType({bridgeSideId: bridgeSide.id, startSiteNo, endSiteNo: bridgeSite.siteNo - 1, superstructureTypeId});
                startSiteNo = bridgeSite.siteNo;
            }
        }
        if (superstructureTypeId && startSiteNo !== bridgeSites.length) {
            await BridgeSideClient.updateSiteSuperstructureType({bridgeSideId: bridgeSide.id, startSiteNo, endSiteNo: bridgeSites.length, superstructureTypeId})
        }
        //更新部构件
        for (let bridgeSite of bridgeSites) {
            if (!bridgeSite.superstructureTypeId) continue;
            const memberTypes = await MemberTypeClient.listMemberTypesBySuperstructure(bridgeSite.superstructureTypeId);
            for (let memberType of memberTypes) {
                const bridgeMembers = await BridgeMemberClient.listBridgeMembersFromBase(bridgeSide.id, bridgeSite.siteNo, memberType.id);
                bridgeMembers.forEach(b => BridgeMemberClient.updateBridgeMember(b));
            }
        }
    }
}

/**
 * 复制桥梁至基础数据库
 * @param bridgeId 桥梁ID
 */
const copyBridgeToBase = async bridgeId => {
    //获取并保存桥梁
    let bridge = await BridgeBaseClient.getBridgeById(bridgeId);
    bridge = {
        ...bridge,
        buildDate: toDate(bridge, "buildDate"),
        rebuildDate: toDate(bridge, "rebuildDate"),
        openTrafficDate: toDate(bridge, "openTrafficDate"),
    };
    await BridgeBaseClient.updateBridgeToBase(bridgeId, bridge);
    //获取并保存分幅
    const bridgeSides = await BridgeSideClient.listBridgeSides(bridgeId);
    for (let bridgeSide of bridgeSides) {
        bridgeSide = await BridgeSideClient.getBridgeSideById(bridgeSide.id);
        await BridgeSideClient.updateBridgeSideToBase(bridgeSide.id, bridgeSide);
        const bridgeSites = await BridgeSideClient.listBridgeSitesBySide(bridgeSide.id);
        if (bridgeSites.length === 0) continue;
        //更新上部结构类型
        let startSiteNo = 1, superstructureTypeId = bridgeSites[0].superstructureTypeId;
        for (let bridgeSite of bridgeSites) {
            if (superstructureTypeId && superstructureTypeId !== bridgeSite.superstructureTypeId) {
                await BridgeSideClient.updateSiteSuperstructureTypeToBase({bridgeSideId: bridgeSide.id, startSiteNo, endSiteNo: bridgeSite.siteNo - 1, superstructureTypeId});
                startSiteNo = bridgeSite.siteNo;
            }
        }
        if (superstructureTypeId && startSiteNo !== bridgeSites.length) {
            await BridgeSideClient.updateSiteSuperstructureTypeToBase({bridgeSideId: bridgeSide.id, startSiteNo, endSiteNo: bridgeSites.length, superstructureTypeId})
        }
        //更新部构件
        for (let bridgeSite of bridgeSites) {
            if (!bridgeSite.superstructureTypeId) continue;
            const memberTypes = await MemberTypeClient.listMemberTypesBySuperstructure(bridgeSite.superstructureTypeId);
            for (let memberType of memberTypes) {
                const bridgeMembers = await BridgeMemberClient.listBridgeMembers(bridgeSide.id, bridgeSite.siteNo, memberType.id);
                bridgeMembers.forEach(b => BridgeMemberClient.updateBridgeMemberToBase(b));
            }
        }
    }
}
function parseDiseaseTrend(code) {
    switch (code) {
        case 'REPAIRED':
            return <span style={{color: "green"}}>已维修</span>;
        case 'STABLE':
            return <span style={{color: "#3c8dbc"}}>稳定</span>;
        case 'EXPAND':
            return <span style={{color: "red"}}>扩展</span>;
        default:
            return <span>新增</span>
    }
}
export {
    copyBridgeFromBase,
    copyBridgeToBase,
    parseDiseaseTrend
}