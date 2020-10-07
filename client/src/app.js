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
import ResetPassword from "./components/auth/passwordReset";
import Signin from "./components/auth/signin";
import Signup from "./components/auth/signup";
import Navbar from "./components/layout/navbar";
import PrivateRoute from "./components/private-route/privateRoute";
import Dashboard from "./components/dashboard/dashboard";
import CreateProject from "./components/project/CreateProject";
import SingleProject from "./components/project/SingleProject";
import AccountDetails from "./components/profile/AccountDetails";
import RequestPasswordReset from "./components/auth/requestRecovery";
import NoMatch from "./components/404/404";

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
            <Switch>
              <Route exact path="/signin" component={Signin} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile/:username" component={Profile} />
              <Route exact path="/createProject" component={CreateProject} />
              <Route
                exact
                path="/project/:projectId"
                component={SingleProject}
              />
              <Route
                exact
                path="/user/:username/account"
                component={AccountDetails}
              />
              <Route path="/forgot-password" component={RequestPasswordReset} />
              <Route
                exact
                path="/resetPassword/:token"
                component={ResetPassword}
              />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
