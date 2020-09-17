import React from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import App from "./components/app/app";
import Profile from "./components/profile/profile";
// import NotFound from "./components/app/notfound";

import Signin from "./components/auth/signin";
import Signup from "./components/auth/signup";
import Navbar from "./components/layout/navbar";

render(
  <Router>
    <App>
      <Router>
        <Navbar />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/profile/:username" component={Profile} />
        {/* <Route component={NotFound} /> */}
      </Router>
    </App>
  </Router>,
  document.getElementById("app")
);