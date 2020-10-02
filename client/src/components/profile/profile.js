import React, { Component } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.match.params.username,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      userExists: false,
    };
  }

  onChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;

    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    // prevent page from reloading
    e.preventDefault();

    // create the formdata object
    // we need to do this because JSON isn't sufficient for image sending
    const formData = new FormData();
    formData.set("firstName", this.state.firstName);
    formData.set("lastName", this.state.lastName);
    formData.set("email", this.state.email);
    formData.set("phoneNumber", this.state.phoneNumber);
    formData.set("username", this.state.username);

    // configururation for post request since we aren't just posting json
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    // Pull user details from backend API
    axios
      .post(`/api/user/${this.props.match.params.username}`, formData, config)
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            userExists: true,
          });
        }
      });
  };

  render() {
    return (
      <Container>
        <div style={{ maxWidth: "30rem", margin: "0 auto" }}>
          <div className="text-center">
            <h2>Account Details</h2>
          </div>

          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" onChange={this.onChange} />
            </Form.Group>

            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" onChange={this.onChange} />
            </Form.Group>

            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" onChange={this.onChange} />
            </Form.Group>

            <Form.Group controlId="username">
              <Form.Label>User Name</Form.Label>
              <Form.Control type="text" onChange={this.onChange} />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" onChange={this.onChange} />
            </Form.Group>

            <div className="text-center">
              <Button variant="success" type="submit">
                Save Changes
              </Button>
              <Button variant="secondary" type="submit">
                Discard Changes
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    );
  }
}

export default Profile;
