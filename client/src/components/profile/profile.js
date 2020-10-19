import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Container, Col, Row, Alert } from "react-bootstrap";
import axios from "axios";

import ProjectList from "./ProjectList";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.match.params.username,
      firstName: "",
      lastName: "",
      email: "",
      userExists: true,
      phoneNumberExists: true,
      userId: this.props.auth.user._id,
      projects: [],
      projectExists: true,
    };
  }

  componentDidMount = () => {
    axios
      .get(`/api/user/${this.props.match.params.username}`)
      .then((response) => {
        if (response.error) {
          console.log(response.error);
        } else if (response.data.message === "Profile does not exist") {
          this.setState({
            userExists: false,
          });
        } else {
          this.setState({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
          });
          if (this.state.phoneNumber === "") {
            this.setState({
              phoneNumberExists: false,
            });
          }
        }
      });

    axios
      .post(`/api/project/list`, { userID: this.state.userId })
      .then((response) => {
        if (response.error) {
          console.log("failure");
          console.log(response.error);
        } else if (response.data.message === "Projects do not exist") {
          this.setState({
            projectExists: false,
          });
        } else {
          // console.log("response:");
          this.setState({
            projects: Array.from(response.data),
          });
        }
      });
  };

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
                  <Card.Subtitle>Email</Card.Subtitle>
                  <Card.Text>{this.state.email}</Card.Text>
                  <Card.Subtitle>Phone</Card.Subtitle>
                  <Card.Text>
                    {this.state.phoneNumberExists
                      ? this.state.phoneNumber
                      : " None"}
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
            <ProjectList
              projects={this.state.projects}
              projectExists={this.state.projectExists}
            ></ProjectList>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container>
          <Alert variant="warning">
            <Alert.Heading>User doesn't exist</Alert.Heading>
            <Alert.Link href="/">Go Home</Alert.Link>
          </Alert>
        </Container>
      );
    }
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Profile);
