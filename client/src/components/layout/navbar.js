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
import { withRouter } from "react-router-dom";

function NavbarAccountLoggedOut() {
  return (
    <>
      <Nav className="mr-auto">
        <LinkContainer to="/user/username/projects/5f76b981baff9a2f08be5e1f">
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
        {/* <Nav.Link href="/upload">Upload</Nav.Link> */}
        <Nav.Link href="/createProject">Create Project</Nav.Link>
        {/* <Nav.Link href="/project/projectId">My Projects</Nav.Link> */}
        {/* <LinkContainer to="/dashboard">
          <Nav.Link>{props.user.firstName}</Nav.Link>
        </LinkContainer> */}
      </Nav>
      <Nav className="ml-auto">
        <Nav.Link href={`/user/${props.username}/account`}>
          Account Details
        </Nav.Link>
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
    console.log(e.target.value);
  };

  onSearchSubmit = (e) => {
    e.preventDefault();
    // this.props.history.action("POP");
    // this.props.history.go(-1);
    this.props.history.push({
      pathname: "/search",
      state: {
        searchphrase: this.state.searchphrase,
      },
    });
  };

  render() {
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
            {/* <Link
              to={{
                pathname: "/search",
                state: {
                  searchphrase: this.state.searchphrase,
                },
              }}
            > */}
            <Button variant="outline-secondary" size="sm" type="submit">
              Search
            </Button>
            {/* </Link> */}
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
      <div style={{ marginBottom: "1rem" }}>
        <Navbar bg="dark" variant="dark" expand="sm">
          <Container>
            <Navbar.Brand href="/">ePortfolio</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <NavbarUserSearch history={this.props.history} />
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
