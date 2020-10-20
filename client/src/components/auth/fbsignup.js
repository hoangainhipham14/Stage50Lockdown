import React, { Component } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import isEmpty from "is-empty";
import axios from "axios";

class FacebookSignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
    };
  }

  componentDidMount() {
    // Get props from landing page and map to state
    try {
      this.setState({
        email: this.props.location.state.email,
        username: this.props.location.state.username,
        firstName: this.props.location.state.firstName,
        lastName: this.props.location.state.lastName,
        fbIsLoggedIn: this.props.location.state.fbIsLoggedIn,
        fbUserID: this.props.location.state.fbUserID,
        fbPicture: this.props.location.state.fbPicture,
        fbAccessToken: this.props.location.state.fbAccessToken,
      });
    } catch (err) {
      console.log("no state passed in");
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      username: this.state.username,
      email: this.state.email,
      fbIsLoggedIn: this.state.fbIsLoggedIn,
      fbUserID: this.state.fbUserID,
      fbPicture: this.state.fbPicture,
      fbAccessToken: this.state.fbAccessToken,
    };

    // post new user to backend
    axios
      .post("/api/signup", newUser)
      .then((res) => {
        // successful sign up! go to sign in page
        console.log("Signup success with res.data =", res.data);
        this.props.history.push("/signin");
      })
      .catch((err) => {
        // sign in failed. receive errors and pass them to state for display.
        console.log(
          "Signup failure with err.response.data =",
          err.response.data
        );
        this.setState({
          errors: err.response.data,
        });
      });
  };

  render() {
    const { errors } = this.state;

    return (
      <Container>
        <div className="form-container">
          <div className="formContainer">
            <h2 align="center">Sign Up</h2>
            <p align="center">
              Already have an account? <Link to="/signin">Sign in</Link>
            </p>
            <Form onSubmit={this.onSubmit}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  onChange={this.onChange}
                  defaultValue={this.state.username}
                />
                <Alert variant="danger" show={!isEmpty(errors.username)}>
                  {errors.username}
                </Alert>
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit">
                  Sign Up
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    );
  }
}

export default withRouter(FacebookSignup);
