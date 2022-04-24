import {SET_AUTH, CLEAR_AUTH} from "../action/AuthAction";

const initialState = {};

function AuthReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AUTH:
            return {...state, ...action.payload};
        case CLEAR_AUTH:
            return {};
        default:
            return {...state};
    }
}

export default AuthReducer;