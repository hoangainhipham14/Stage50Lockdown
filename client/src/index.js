import React from "react";
import { render } from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  // Link,
  Switch,
} from "react-router-dom";

import App from "./components/app/app";
import Profile from "./components/profile/profile";
import NotFound from "./components/app/notfound";

import Home from "./components/home/home";

render(
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users/:username" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </App>
  </Router>,
  document.getElementById("app")
);
