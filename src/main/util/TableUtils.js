function calcTableScrollWidth(columns, extra = 0) {
    if (Array.isArray(columns)) {
        return columns.map(c => c.width).reduce((prev, cur) => prev + cur) + 10 + extra
    }
}

function fix(columns, extra = 0) {
    const colWidth = columns.map(c => c.width).reduce((x, y) => x + y);
    const containerWidth = document.querySelector(".wrapper").clientWidth - 270 - extra;
    if (colWidth < containerWidth) {
        columns.forEach(c => delete c.fixed);
    }
}

export {
    calcTableScrollWidth,
    fix
}