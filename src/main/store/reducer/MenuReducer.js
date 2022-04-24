import {SET_CUR_MENU} from "../action/MenuAction";

const initialState = {};

const MenuReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CUR_MENU:
            return {curMenu: action.payload};
        default:
            return {};
    }
}

export default MenuReducer;