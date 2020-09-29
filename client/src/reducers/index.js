import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import uploadReducer from "./uploadReducer"
// import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  upload: uploadReducer,
});