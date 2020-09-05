import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/navbar.component";
import Signin from "./components/signin.component";
import Signup from "./components/signup.component";

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Route path="/login" component={Signin} />
        <Route path="/signup" component={Signup} />
      </div>
    </Router>
  );
}

export default App;
