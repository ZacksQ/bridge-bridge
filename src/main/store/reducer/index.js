import {combineReducers} from "redux";
import {persistReducer} from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";
import AuthReducer from "./AuthReducer";
import MenuReducer from "./MenuReducer";

const allReducers = {
    auth: persistReducer({key: "auth", storage: sessionStorage}, AuthReducer),
    menu: persistReducer({key: "menu", storage: sessionStorage}, MenuReducer)
};

export default combineReducers(allReducers);