import React from "react";
// import { render } from "react-dom";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store";

import App from "./app";
const { render } = require("react-dom");

// import "bootstrap/dist/css/bootstrap.min.css";

// import Profile from "./components/profile/profile";
// import Signin from "./components/auth/signin";
// import Signup from "./components/auth/signup";
// import Navbar from "./components/layout/navbar";

// render(
//   <Router>
//     <Navbar />
//     <Route exact path="/signin" component={Signin} />
//     <Route exact path="/signup" component={Signup} />
//     <Route exact path="/profile/:username" component={Profile} />
//   </Router>,
//   document.getElementById("app")
// );

render(<App />, document.getElementById("root"));