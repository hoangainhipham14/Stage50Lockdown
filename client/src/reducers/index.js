import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import passwordResetReducer from "./passwordResetReducer";
// import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  passwordReset: passwordResetReducer,
});
