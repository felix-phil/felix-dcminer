import { combineReducers } from "redux";
import authReducer from "./auth";
import loadReducer from "./loading";
import messageReducer from "./messages";
import errorReducer from "./errors";
import withdrawalReducer from "./withdrawal";
// import { articleReducer, articleUserReducer } from "./articles";

const rootReducer = combineReducers({
  authReducer,
  loadReducer,
  messageReducer,
  errorReducer,
  withdraw: withdrawalReducer,
});

export default rootReducer;
