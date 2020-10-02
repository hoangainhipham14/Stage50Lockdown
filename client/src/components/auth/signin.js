import React, { Component } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import isEmpty from "is-empty";

import { signinUser } from "../../actions/authActions";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      email: "",
      password: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

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

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.signinUser(userData);
  };

  render() {
    const { errors } = this.state;

    return (
      <Container>
        <div className="form-container">
          <h2 align="center">Sign In</h2>
          <p align="center">
            Need an account? <Link to="/signup">Sign up</Link>
          </p>

          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={this.onChange}
              />
              <Alert
                variant="danger"
                show={
                  !isEmpty(errors.email) ||
                  !isEmpty(errors.emailnotfound) ||
                  !isEmpty(errors.notvalidated)
                }
              >
                {errors.email}
                {errors.emailnotfound}
                {errors.notvalidated}
              </Alert>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={this.onChange}
              />
              <Alert
                variant="danger"
                show={
                  !isEmpty(errors.password) ||
                  !isEmpty(errors.passwordincorrect)
                }
              >
                {errors.password}
                {errors.passwordincorrect}
              </Alert>
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit">
                Sign In
              </Button>
            </div>
            <p align="center">
              Forgot your password? Click{" "}
              <Link to="/forgot-password">here</Link>
            </p>
          </Form>
        </div>
      </Container>
    );
  }
}

Signin.propTypes = {
  signinUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { signinUser })(Signin);

// npm run hack.exe
