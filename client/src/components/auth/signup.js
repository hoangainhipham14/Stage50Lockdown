import React, { Component } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import isEmpty from "is-empty";
import axios from "axios";

// REDUX DEPRACATED FOR THIS MODULE
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { registerUser } from "../../actions/authActions";

class Signup extends Component {
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
      password1: this.state.password1,
      password2: this.state.password2,
    };

    // this.props.registerUser(newUser, this.props.history);

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
              <Form.Group controlId="firstName">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  onChange={this.onChange}
                  defaultValue={this.state.firstName}
                />
                <Alert variant="danger" show={!isEmpty(errors.firstName)}>
                  {errors.firstName}
                </Alert>
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  onChange={this.onChange}
                  defaultValue={this.state.lastName}
                />
                <Alert variant="danger" show={!isEmpty(errors.lastName)}>
                  {errors.lastName}
                </Alert>
              </Form.Group>

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

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  onChange={this.onChange}
                  defaultValue={this.state.email}
                />
                <Alert variant="danger" show={!isEmpty(errors.email)}>
                  {errors.email}
                </Alert>
              </Form.Group>

              <Form.Group controlId="password1">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={this.onChange}
                />
                <Alert variant="danger" show={!isEmpty(errors.password1)}>
                  {errors.password1}
                </Alert>
              </Form.Group>

              <Form.Group controlId="password2">
                <Form.Label>Re-type passworrd</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={this.onChange}
                />
                <Alert variant="danger" show={!isEmpty(errors.password2)}>
                  {errors.password2}
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

// Signup.propTypes = {
//   registerUser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired,
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
//   errors: state.errors,
// });

// export default connect(mapStateToProps, { registerUser })(withRouter(Signup));

export default withRouter(Signup);
