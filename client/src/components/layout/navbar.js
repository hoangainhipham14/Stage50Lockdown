import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// function getUsernameId(userdetails) {
//   console.log("User Id:" + userdetails.id);
//   axios.get(`/api/userId/${userdetails.id}`).then((res) => {
//     console.log("Response: " + res.data);
//     userdetails.username = res.data;
//     return res.json();
//   });
// }

const getUsernameId = (id) => {
  return fetch(`/api/userId/${id}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

function NavbarAccountLoggedOut() {
  return (
    <>
      <Nav className="ml-auto">
        <LinkContainer to="/signin">
          <Nav.Link>Sign In</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/signup">
          <Nav.Link>Sign up</Nav.Link>
        </LinkContainer>
      </Nav>
    </>
  );
}

function NavbarAccountLoggedIn(props) {
  console.log("Get Username ID: " + getUsernameId(props.user._id));
  const username = getUsernameId(props.user._id);
  return (
    <>
      <Nav className="mr-auto">
        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        {/* <Nav.Link href="/upload">Upload</Nav.Link> */}
        <Nav.Link href="/createProject">Create Project</Nav.Link>
        {/* <Nav.Link href="/project/projectId">My Projects</Nav.Link> */}
        {/* <LinkContainer to="/dashboard">
          <Nav.Link>{props.user.firstName}</Nav.Link>
        </LinkContainer> */}
      </Nav>
      <Nav className="ml-auto">
        <Nav.Link href={`/user/${username}/account`}>Account Details</Nav.Link>
        <Nav.Link onClick={props.onClickLogout}>Sign Out</Nav.Link>
      </Nav>
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
              {isAuthenticated ? (
                <NavbarAccountLoggedIn
                  onClickLogout={this.onClickLogout}
                  user={user}
                />
              ) : (
                <NavbarAccountLoggedOut />
              )}
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
