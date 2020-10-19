import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Container, Col, Row, Alert } from "react-bootstrap";
import axios from "axios";

import ProjectList from "./ProjectList";
import { getUsernameId } from "../layout/GetUsername";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileUserName: this.props.match.params.username,
      firstName: "",
      lastName: "",
      email: "",
      userExists: true,
      phoneNumberExists: true,
      userId: this.props.auth.user._id,
      projects: [],
      projectExists: true,
      aboutUserExists: true,
      aboutUser: "",
      photoExist: false,
      isAuth: false,
    };
  }

  componentDidMount = () => {
    getUsernameId(this.state.userId).then((data) => {
      console.log(data);
      console.log(this.state.profileUserName);
      if (data === this.state.profileUserName)
        this.setState({
          isAuth: true,
        });
    });

    axios
      .get(`/api/user/${this.props.match.params.username}`)
      .then((response) => {
        if (response.error) {
          console.log(response.error);
        } else if (response.data.message === "Profile does not exist") {
          this.setState({
            userExists: false,
            photoExist: response.data.photoExist,
          });
        } else {
          this.setState({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            aboutUser: response.data.aboutUser,
            photoExist: response.data.photoExist,
          });

          if (this.state.phoneNumber === "") {
            this.setState({
              phoneNumberExists: false,
            });
          } else if (this.state.aboutUser === "") {
            this.setState({
              aboutUser: false,
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
                {this.state.photoExist ? (
                  <Card.Img
                    src={`/api/user/${this.state.profileUserName}/photo`}
                    thumbnail
                    fluid
                  />
                ) : (
                  <Card.Img src="../../default_photo.png" fluid thumbnail />
                )}

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
                  {this.state.aboutUserExists ? this.state.aboutUser : " None"}
                </Card.Body>
              </Card>
            </Col>
            <ProjectList
              projects={this.state.projects}
              projectExists={this.state.projectExists}
              username={this.state.profileUserName}
              isAuth={this.state.isAuth}
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
