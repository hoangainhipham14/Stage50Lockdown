import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";

export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/signup", userData)
    .then(res => {
      console.log("Signup success with res.data =", res.data);
      history.push("/signin");
    })
    .catch(err => {
      console.log("Signup failed. Errors:", err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const signinUser = userData => dispatch => {
  axios
    .post("/api/users/signin", userData)
    .then(res => {
      // Save to local storage
      console.log("Login success with res.data =", res.data);
      const { token } = res.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      dispatch(setCurrentUser(token));
    })
    .catch(err => {
      console.log("Sign in error:", err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const setCurrentUser = token => {
  return {
    type: SET_CURRENT_USER,
    payload: token
  };
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("token");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
}