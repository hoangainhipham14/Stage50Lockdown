import React, { Component } from "react";

import { Navbar, Nav } from "react-bootstrap";

class MyNav extends Component {
  render() {
    return(
      <div className="container">
        <Navbar bg="light" expand="sm">
          <Navbar.Brand href="/">ePortfolio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/signin">Sign In</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
              <Nav.Link href="/signout">Sign Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default MyNav;