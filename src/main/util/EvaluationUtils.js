/**
 * 根据评定标度获取扣分值
 * @param deductionScale  评定标度
 * @param maxScale        最大标度
 * @return {number}       扣分值
 */
export const getDeductionPoint = (deductionScale, maxScale) => {
    let threeScale = [0, 20, 35];
    let fourScale = [0, 25, 40, 50];
    let fiveScale = [0, 35, 45, 60, 100];
    switch(maxScale) {
        case 3:
            return threeScale[deductionScale-1];
        case 4:
            return fourScale[deductionScale-1];
        case 5:
            return fiveScale[deductionScale-1];
        default:
            return 0;
    }
};

/**
 * 将桥梁评分转为等级
 * @param point  评分
 */
export const pointToLevel = (point)=>{
    if(point === null || point === undefined || isNaN(point)) return "尚未评定";
    if(point <40) return "5类";
    else if(point < 60) return "4类";
    else if(point < 80) return "3类";
    else if(point < 95) return "2类";
    else return "1类";
};

/**
 * 将桥梁评分转为等级
 * @param point  评分
 */
export const oldPointToLevel = (point)=>{
    if(point === null || point === undefined || isNaN(point)) return "尚未评定";
    if(point <20) return "五类";
    else if(point < 40) return "四类";
    else if(point < 60) return "三类";
    else if(point < 88) return "二类";
    else return "一类";
};

/**
 * 将桥梁评分转为等级
 * @param point  评分
 */
export const oldPartPointToLevel = (point)=>{
    if(point === null || point === undefined || isNaN(point)) return "尚未评定";
    if (point <= 1) {
        return "一类";
    } else if (point === 2) {
        return "二类";
    } else if (point === 3) {
        return "三类";
    } else if (point === 4) {
        return "四类";
    } else if (point === 5) {
        return "五类";
    }
};

/**
 * 获取不同桥梁等级对应的颜色
 * @param level  桥梁等级，1类、2类...5类
 */
export const getBridgeEvaluationColor = (level)=>{
    switch (level) {
        case "1类":
            return "success";
        case "2类":
            return "success";
        case "3类":
            return "primary";
        case "4类":
            return "warning";
        case "5类":
            return "danger";
        default:
            return "success";
    }
};

export const levelToMaintain = level => {
    switch (level) {
        case 2:
            return "需进行小修";
        case 3:
            return "需进行中修，酌情进行交通管制";
        case 4:
            return "需进行大修或改造，及时进行交通管制，如限载、限速通过，当缺损较严重时应关闭交通";
        case 5:
            return "需要进行改建或重建，及时关闭交通";
        default:
            return "进行正常保养";
    }
};