//部位类型常数
const POSITION_TYPE = {
    SUPER: "上部结构",
    SUB: "下部结构",
    DECK: "桥面系",
};

//部件类型常数
const PART_TYPE = {
    BEARING: "上部承重构件",
    SUPPORT: "支座",
    PIER: "桥墩",
    ABUTMENT: "桥台",
    BASE: "墩台基础",
    WING: "翼墙、耳墙",
    SLOPE: "锥坡、护坡",
    RIVER: "河床",
    REGULATING: "调治构造物",
    DECK: "桥面铺装",
    EXPANSION: "伸缩缝装置"
};

const EVALUATION_TYPES = [
    {key: "COMPREHENSIVE", title: "综合评定"},
    {key: "SINGLE_CONTROL", title: "5类桥梁技术状况单项控制指标"},
    {key: "ITEM_4_1_7", title: "综合评分+4.1.7调整项"},
    {key: "ITEM_4_1_8", title: "综合评分+4.1.8调整项"}
];

export {POSITION_TYPE, PART_TYPE, EVALUATION_TYPES}