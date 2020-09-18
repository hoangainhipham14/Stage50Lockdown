import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

/**
 * Combine both reducers into a single reducer that does the job of both at
 * once.
 */
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
});