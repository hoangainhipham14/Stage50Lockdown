import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Alert, Container, Form, Button, Spinner } from "react-bootstrap";
import { getUsernameId } from "../layout/GetUsername";
import PropTypes from "prop-types";
import { Loading } from "../loading/Loading";
import { Redirect } from "react-router-dom";

class AccountDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstNamePrivate: "",
      lastNamePrivate: "",
      emailPrivate: "",
      phoneNumberPrivate: "",
      user: "",
      username: this.props.match.params.username,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      userExists: false,
      loading: true,
      submitwaiting: false,
      submitted: false,
      changesMade: false,
    };
  }

  componentDidMount() {
    // Get user information stored in database when sign up
    axios
      .get(`/api/user/account/${this.props.match.params.username}`)
      .then((response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          console.log(response);
          this.setState({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            firstNamePrivate: response.data.firstNamePrivate,
            lastNamePrivate: response.data.lastNamePrivate,
            emailPrivate: response.data.emailPrivate,
            phoneNumberPrivate: response.data.phoneNumberPrivate,
            userExists: true,
            loading: false,
          });
        }
      });
    // Check user
    getUsernameId(this.props.auth.user._id).then((data) => {
      this.setState({
        user: data,
      });
    });
  }

  // Reset event, when discard changes, redirect to same page
  onReset = (e) => {
    window.location.replace(`/user/${this.state.username}/account`);
  };

  // Change event when fill in inputs
  onChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;

    this.setState({
      [name]: value,
    });
  };

  toggleEmailPrivacy = (e) => {
    this.setState({
      emailPrivate: !this.state.emailPrivate,
    });
  };

  toggleFirstNamePrivacy = (e) => {
    this.setState({
      firstNamePrivate: !this.state.firstNamePrivate,
    });
  };

  toggleLastNamePrivacy = (e) => {
    console.log(this.state.lastNamePrivate);
    this.setState({
      lastNamePrivate: !this.state.lastNamePrivate,
    });
  };

  togglePhoneNumberPrivacy = (e) => {
    this.setState({
      phoneNumberPrivate: !this.state.phoneNumberPrivate,
    });
  };

  // Submit event, update user information
  onSubmit = (e) => {
    // prevent page from reloading
    e.preventDefault();

    this.setState({
      submitwaiting: true,
    });

    // create the formdata object
    // we need to do this because JSON isn't sufficient for image sending
    const formData = new FormData();
    formData.set("firstName", this.state.firstName);
    formData.set("lastName", this.state.lastName);
    formData.set("email", this.state.email);
    formData.set("phoneNumber", this.state.phoneNumber);

    // Same but a boolean for all the items for privacy
    formData.set("firstNamePrivate", this.state.firstNamePrivate);
    formData.set("lastNamePrivate", this.state.lastNamePrivate);
    formData.set("emailPrivate", this.state.emailPrivate);
    formData.set("phoneNumberPrivate", this.state.phoneNumberPrivate);
    // formData.set("username", this.state.username);

    // configururation for post request since we aren't just posting json
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    // Update user information by sending request to back end
    axios
      .post(`/api/user/${this.state.username}`, formData, config)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          this.setState({
            submitwaiting: false,
          });
        } else {
          // Change this so the success message shows
          this.setState({
            changesMade: true,
            submitted: true,
          });

          /*
          this.setState({            
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            userExists: true,
            submitwaiting: false,
            submitted: true,
          });
          */
        }
      });
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    } else if (this.state.submitted) {
      return <Redirect to={`/profile/${this.state.username}`} />;
    } else if (this.state.user === "") {
      return null;
    } else if (this.state.username === this.state.user) {
      return (
        <Container>
          <div style={{ maxWidth: "30rem", margin: "0 auto" }}>
            <div className="text-center">
              <h2>Account Details</h2>
            </div>

            <Form onSubmit={this.onSubmit} onReset={this.onReset}>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={this.state.firstName}
                  onChange={this.onChange}
                />
                <Form.Check
                  type="switch"
                  id="first name switch"
                  label="Private"
                  checked={this.state.firstNamePrivate}
                  onClick={this.toggleFirstNamePrivacy}
                />
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={this.state.lastName}
                  onChange={this.onChange}
                />
                <Form.Check
                  type="switch"
                  id="last name switch"
                  label="Private"
                  checked={this.state.lastNamePrivate}
                  onClick={this.toggleLastNamePrivacy}
                />
              </Form.Group>

              <Form.Group controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={this.state.phoneNumber}
                  onChange={this.onChange}
                />
                <Form.Check
                  type="switch"
                  id="phone number switch"
                  label="Private"
                  checked={this.state.phoneNumberPrivate}
                  onClick={this.togglePhoneNumberPrivacy}
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={this.state.email}
                  onChange={this.onChange}
                />
                <Form.Check
                  type="switch"
                  id="email switch"
                  label="Private"
                  checked={this.state.emailPrivate}
                  onClick={this.toggleEmailPrivacy}
                />
              </Form.Group>

              <div className="text-center">
                <Button variant="success" type="submit">
                  {this.state.submitwaiting ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <Container>Save Changes</Container>
                  )}
                </Button>
                <Button variant="secondary" type="reset">
                  Discard Changes
                </Button>
                <Alert variant="success" show={this.state.changesMade}>
                  {"Changes saved"}
                </Alert>
              </div>
            </Form>
          </div>
        </Container>
      );
    } else {
      return <Alert variant="warning">{"You aren't authorised"}</Alert>;
    }
  }
}

AccountDetails.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AccountDetails);
