import {createStore} from "redux";
import {persistStore} from "redux-persist";
import RootReducer from "./reducer";

const store = createStore(RootReducer);
const persistor = persistStore(store);

export default {store, persistor};