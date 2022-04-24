/**
 * 给字符串包裹一层括号，传入的字符串为空则返回空字符串
 * @param value 字符串
 */
const wrapBrackets = value => {
    return value ? "(" + value + ")" : "";
};

/**
 * 字符串比较
 * @param s1 字符串1
 * @param s2 字符串2
 */
const compareStr = (s1, s2) => {
    if (s1 > s2) {
        return 1;
    } else if (s1 < s2) {
        return -1;
    } else {
        return 0;
    }
};

const createUUID = (function (uuidRegEx, uuidReplacer) {
    return function () {
        return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
    };
})(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0,
        v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
});

export {
    wrapBrackets,
    compareStr,
    createUUID
}