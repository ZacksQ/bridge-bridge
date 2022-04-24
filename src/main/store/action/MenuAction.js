const [SET_CUR_MENU] = [Symbol()];

/** 设置当前菜单 */
function setCurMenu(menu) {
    return {
        type: SET_CUR_MENU,
        payload: menu
    };
}

export {
    SET_CUR_MENU,
    setCurMenu
}