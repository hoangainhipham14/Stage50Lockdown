import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import setAuthToken from "./utils/setAuthToken";
// import { setCurrentUser } from "./actions/authActions";

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

// // check for token to keep user logged in
// if (localStorage.jwtToken) {
//   const token = localStorage.jwtToken;
//   const decoded = jwt_decode(token);
//   store.dispatch(setCurrentUser(decoded));
// }

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
