import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signinUser } from "../../actions/authActions";
import RequestPasswordReset from "../password-recovery/requestRecovery";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      email: "",
      password: "",
      errors: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  onSubmit = e => {
    e.preventDefault();
    
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.signinUser(userData);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container" style={{ maxWidth: "30rem", margin: "0 auto" }}>
        <h2 align="center">Sign In</h2>
        <p align="center">Need an account? <Link to="/signup">Sign up</Link></p>

        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email" 
              placeholder="Enter email"
              onChange={this.onChange}
            />
            <div className="error-text">
              {errors.email}
              {errors.emailnotfound}
            </div>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={this.onChange}
            />
            <div className="error-text">
              {errors.password}
              {errors.passwordincorrect}
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">z
            Sign In
          </Button>

          <div className="error-text">
            {errors.notvalidated}
          </div>
        </Form>
        <RequestPasswordReset/>
      </div>
    );
  }
}

Signin.propTypes = {
  signinUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { signinUser }
)(Signin);