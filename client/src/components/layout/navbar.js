import React, { Component } from "react";

import { Navbar, Nav } from "react-bootstrap";

class MyNav extends Component {
  render() {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <Navbar bg="dark" variant="dark" expand="sm">
          <div className="container">
            <Navbar.Brand href="/">ePortfolio</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/signin">Sign In</Nav.Link>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
                <Nav.Link href="/upload">Upload</Nav.Link>
                <Nav.Link href="/signout">Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}

export default MyNav;
