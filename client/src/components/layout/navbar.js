import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function NavbarAccountLoggedOut() {
  return (
    <>
      <LinkContainer to="/signin">
        <Nav.Link>Sign In</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/signup">
        <Nav.Link>Sign up</Nav.Link>
      </LinkContainer>
    </>
  );
}

function NavbarAccountLoggedIn(props) {
  return (
    <>
      <LinkContainer to="/dashboard">
        <Nav.Link>{props.user.firstName}</Nav.Link>
      </LinkContainer>
      <Nav.Link onClick={props.onClickLogout}>Sign Out</Nav.Link>
    </>
  );
}

class MyNavbar extends Component {
  onClickLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    return (
      <div style={{ marginBottom: "1rem" }}>
        <Navbar bg="dark" variant="dark" expand="sm">
          <Container>
            <Navbar.Brand href="/">ePortfolio</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/carousel">Carousel</Nav.Link>
              </Nav>
              <Nav className="ml-auto">
                {isAuthenticated ? (
                  <NavbarAccountLoggedIn
                    onClickLogout={this.onClickLogout}
                    user={user}
                  />
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
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(MyNavbar);
