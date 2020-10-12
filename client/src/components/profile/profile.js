import React, { Component } from "react";

import { Card, Container, Col, Row } from "react-bootstrap";
import axios from "axios";

import ProjectList from "../profile/ProjectList";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.match.params.username,
      firstName: "",
      lastName: "",
      email: "",
      userExists: false,
      phoneNumberExists: true,
    };

    axios
      .get(`/api/user/${this.props.match.params.username}`)
      .then((response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          this.setState({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            userExists: true,
          });
          if (this.state.phoneNumber === "") {
            this.setState({
              phoneNumberExists: false,
            });
          }
        }
      });
  }

  render() {
    if (this.state.userExists) {
      return (
        <Container fluid>
          <Row>
            <Col className="col-sm d-flex ml-4">
              <Card style={{ width: "20rem" }}>
                <Card.Img variant="top" src="../../doraemon.png" />
                <Card.Body>
                  <Card.Title>
                    {this.state.firstName} {this.state.lastName}
                  </Card.Title>
                  <Card.Text>
                    <Card.Subtitle>Email</Card.Subtitle>
                    <Card.Text>{this.state.email}</Card.Text>
                    <Card.Subtitle>Phone</Card.Subtitle>
                    <Card.Text>
                      {this.state.phoneNumberExists
                        ? this.state.phoneNumber
                        : " None"}
                    </Card.Text>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="col-sm d-flex">
              <Card style={{ width: "20rem" }}>
                <Card.Header>About</Card.Header>
                <Card.Body>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Body>
              </Card>
            </Col>
            <ProjectList></ProjectList>
          </Row>
        </Container>
      );
    } else {
      return (
        <div>
          <h1>
            This profile does not exist: {this.props.match.params.username}
          </h1>
          <a href="/">Go home</a>
        </div>
      );
    }
  }
}

export default Profile;
