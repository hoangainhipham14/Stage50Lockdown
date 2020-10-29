import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  Alert,
  Container,
  Form,
  Button,
  Spinner,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { getUsernameId } from "../layout/GetUsername";
import { deleteUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { Loading } from "../loading/Loading";
import { Redirect, Link } from "react-router-dom";

class AccountDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailPrivate: "",
      phoneNumberPrivate: "",
      profilePrivate: "",
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
            emailPrivate: response.data.emailPrivate,
            phoneNumberPrivate: response.data.phoneNumberPrivate,
            profilePrivate: response.data.profilePrivate,
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

  togglePhoneNumberPrivacy = (e) => {
    this.setState({
      phoneNumberPrivate: !this.state.phoneNumberPrivate,
    });
  };

  toggleProfilePrivacy = (e) => {
    this.setState({
      profilePrivate: !this.state.profilePrivate,
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
    formData.set("profilePrivate", this.state.profilePrivate);
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
        }
      });
  };

  onAccountDeleteClick = (e) => {
    e.preventDefault();
    deleteUser(this.props.history);
    this.props.history.push("/");
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    } else if (this.state.submitted) {
      return <Redirect to={`/profile/${this.state.username}`} />;
    } else if (this.state.user === "") {
      return null;
    } else if (this.state.username === this.state.user) {
      // Are you sure dialog
      const popover = (
        <Popover id="popover-basic">
          <Popover.Title as="h3">
            Are you sure you want to delete your account?
          </Popover.Title>
          <Popover.Content>
            <p className="center">This action cannot be undone.</p>
            <Button variant="danger" onClick={this.onAccountDeleteClick}>
              Delete Account Forever
            </Button>
          </Popover.Content>
        </Popover>
      );
      return (
        <Container>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Button variant="danger" className="float-right">
              Delete Account
            </Button>
          </OverlayTrigger>
          <Link to="/changepassword">
            <Button variant="secondary">Change password</Button>
          </Link>

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
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={this.state.lastName}
                  onChange={this.onChange}
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
                  label={this.state.phoneNumberPrivate ? "Public" : "Private"}
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
                  label={this.state.emailPrivate ? "Private" : "Public"}
                  checked={this.state.emailPrivate}
                  onClick={this.toggleEmailPrivacy}
                />
              </Form.Group>

              <Form.Group>
                <Alert variant="warning">
                    Whole Profile Privacy (Will also remove from user search)
                </Alert>
                <Form.Check 
                  type="switch"
                  id="profile Privacy"
                  label={this.state.profilePrivate ? "Private" : "Public"}
                  checked={this.state.profilePrivate}
                  onClick={this.toggleProfilePrivacy}
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
