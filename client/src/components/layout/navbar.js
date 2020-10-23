import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getUsernameId } from "../layout/GetUsername";

import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { Redirect, withRouter } from "react-router-dom";

function NavbarAccountLoggedOut() {
  return (
    <>
      <Nav className="mr-auto">
        <LinkContainer to="/projects/5f9115b46e4c820db8a0d30d">
          <Nav.Link>Featured Project</Nav.Link>
        </LinkContainer>
      </Nav>
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
  // console.log("Props " + props.username);
  return (
    <>
      <Nav className="mr-auto">
        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        <Nav.Link href="/createProject">Create Project</Nav.Link>
      </Nav>
      <Nav className="ml-auto">
        <Nav.Link href={`/profile/${props.username}`}>My Profile</Nav.Link>
        <Nav.Link onClick={props.onClickLogout}>Sign Out</Nav.Link>
      </Nav>
    </>
  );
}

class NavbarUserSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchphrase: "",
      submitted: false,
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  componentDidUpdate() {
    // Resets search submitted status to default
    if (this.state.submitted) {
      this.setState({
        submitted: false,
      });
    }
  }

  onSearchSubmit = (e) => {
    e.preventDefault();

    this.setState(() => ({
      submitted: true,
    }));
  };

  render() {
    // Redirect to results page when submitted
    if (this.state.submitted) {
      return (
        <Redirect
          to={{
            pathname: "/search",
            state: { searchphrase: this.state.searchphrase },
          }}
        />
      );
    }
    return (
      <Nav className="mr-auto">
        <Form inline onSubmit={this.onSearchSubmit}>
          <Form.Group controlId="searchphrase">
            <FormControl
              type="text"
              placeholder="Search for a user"
              className="mr-sm-1"
              size="sm"
              onChange={this.onChange}
            />
            <Button variant="outline-secondary" size="sm" type="submit">
              Search
            </Button>
          </Form.Group>
        </Form>
      </Nav>
    );
  }
}

class MyNavbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      searchphrase: "",
    };
  }

  componentDidMount = () => {
    const id = this.props.auth.user._id;
    getUsernameId(id).then((data) => {
      this.setState({
        username: data,
      });
    });
  };

  onClickLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    return (
      <div className="mb-4">
        <Navbar bg="dark" variant="dark" expand="md">
          <Container>
            <Navbar.Brand href="/">ePortfolio</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <NavbarUserSearch />
              {isAuthenticated ? (
                <NavbarAccountLoggedIn
                  onClickLogout={this.onClickLogout}
                  user={user}
                  username={this.state.username}
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

export default withRouter(connect(mapStateToProps, { logoutUser })(MyNavbar));
