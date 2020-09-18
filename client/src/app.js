import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";

import Profile from "./components/profile/profile";
import Signin from "./components/auth/signin";
import Signup from "./components/auth/signup";
import Navbar from "./components/layout/navbar";

class App extends Component {
  render() {
    return (
      // <Provider store={store}>
        <Router>
          <div className="app">
            <Navbar />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/profile/:username" component={Profile} />
          </div>
        </Router>
      // </Provider>
    );
  }
}

export default App;