import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";

// Register user
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

// Sign in user
export const signinUser = userData => dispatch => {
  axios
    .post("/api/users/signin", userData)
    .then(res => {
      // Save to local storage
      console.log("Login success with res.data =", res.data);
      // save token to local storage
      const { token } = res.data;
      localStorage.setItem("token", token);
      // set the token to the authentication header
      setAuthToken(token);
      // decode token to get user data
      const decoded = jwt_decode(token);
      console.log(decoded);
      // set the current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      console.log("Sign in error:", err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
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