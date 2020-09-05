import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    console.log("Loaded navbar");
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">ePortfolio</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="navbar-item"><Link to="/login" className="nav-link">Log in</Link></li>
            <li className="navbar-item"><Link to="/signup" className="nav-link">Sign up</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}