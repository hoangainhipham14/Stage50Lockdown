import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

import Profile from "./components/profile/profile";
import ResetPassword from "./components/password-recovery/passwordReset";
import Signin from "./components/auth/signin";
import Signup from "./components/auth/signup";
import Navbar from "./components/layout/navbar";
import PrivateRoute from "./components/private-route/privateRoute";
import Dashboard from "./components/dashboard/dashboard";
import FileUpload from "./components/upload/FileUpload";
import CreateProject from "./components/profile/createProject";

// check for token to keep user logged in
if (localStorage.token) {
  // set authentication token to header
  const token = localStorage.token;
  setAuthToken(token);
  // decode token and get user info and expiry
  const decoded = jwt_decode(token);
  // set user
  store.dispatch(setCurrentUser(decoded));
  // check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // log user out
    store.dispatch(logoutUser());

    // redirect to login
    window.location.href = "./";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="app">
            <Navbar />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/profile/:username" component={Profile} />
            <Route exact path="/upload" component={FileUpload} />
            <Route exact path="/create-project" component={CreateProject} />
            <Route
              exact
              path="/resetPassword/:token"
              component={ResetPassword}
            />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
