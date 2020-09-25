import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import { Navbar, Nav, Container } from "react-bootstrap";

function NavbarAccountLoggedOut() {
  return (
    <>
      <Nav.Link href="/signin">Sign In</Nav.Link>
      <Nav.Link href="/signup">Sign up</Nav.Link>
    </>
  )
}

function NavbarAccountLoggedIn(props) {
  return (
    <>
      <Nav.Link href="/dashboard">{props.user.firstName}</Nav.Link>
      <Nav.Link onClick={props.onClickLogout}>Sign Out</Nav.Link>
    </>
  )
}

class MyNavbar extends Component {
  onClickLogout = e => {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    return (
      <div style={{marginBottom: "1rem"}}>
        <Navbar bg="dark" variant="dark" expand="sm">
          <Container>
            <Navbar.Brand href="/">ePortfolio</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                {/* <NavbarAccount isLoggedIn={isAuthenticated} firstName={user.firstName} onClickLogout={this.onClickLogout} /> */}
                {isAuthenticated ? (
                  <NavbarAccountLoggedIn onClickLogout={this.onClickLogout} user={user} />
                ) : (
                  <NavbarAccountLoggedOut />
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

MyNavbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(MyNavbar);