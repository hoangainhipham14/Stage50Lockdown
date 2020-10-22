import axios from "axios";
import React, { Component } from "react";
import {
  Container,
  Form,
  Button,
  Col,
  Card,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { HCenter } from "../layout";

class CreateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      aboutUser: "",
      username: this.props.match.params.username,
      userPhoto: null,
      updated: false,
      fileName: "",
      photoExist: false,
      formwaiting: false,
      loading: true,
    };
  }

  componentDidMount() {
    // Get user information stored in database when sign up
    axios
      .get(`/api/user/${this.props.match.params.username}`)
      .then((response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          this.setState({
            aboutUser: response.data.aboutUser,
            photoExist: response.data.photoExist,
            loading: false,
          });
        }
      });
  }

  onChangeText = (e) => {
    this.setState({
      aboutUser: e.target.value,
      updated: true,
    });
  };

  onChangePhoto = (e) => {
    this.setState({
      userPhoto: e.target.files[0],
      updated: true,
      fileName: e.target.files[0].name,
      photoExist: true,
    });
  };

  onDiscard = (e) => {
    this.setState({
      photoExist: false,
    });
  };

  onSubmit = (e) => {
    // prevent page from reloading
    e.preventDefault();

    // Start spinner
    this.setState({ formwaiting: true });

    // create the formdata object
    // we need to do this because JSON isn't sufficient for image sending
    const formData = new FormData();
    formData.set("aboutUser", this.state.aboutUser);
    formData.set("userPhoto", this.state.userPhoto);
    formData.set("photoExist", this.state.photoExist);

    // configuration for post request since we aren't just posting json
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(`/api/user/${this.state.username}`, formData, config)
      .then((response) => {
        console.log("Success!");
        console.log(response.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log("Failure!");
        console.log(err);
        this.setState({ formwaiting: false });
      });
  };

  render() {
    return (
      <Container>
        {this.state.loading ? (
          <HCenter>
            <Spinner animation="grow" size="lg" />
          </HCenter>
        ) : (
          <Row>
            <Col className="col-sm d-flex">
              <Card style={{ width: "30rem" }}>
                <Card.Header>Profile Image</Card.Header>
                <Card.Body>
                  <Card.Subtitle>Current Image</Card.Subtitle>
                  <Container className="d-flex justify-content-center">
                    {this.state.photoExist ? (
                      <Image
                        className="mt-3"
                        src={`/api/user/${this.state.username}/photo`}
                        thumbnail
                        fluid
                      />
                    ) : (
                      <Image
                        src="../../default_photo.png"
                        className="mt-3"
                        thumbnail
                        fluid
                      />
                    )}
                  </Container>
                  <Card.Subtitle className="mt-3">
                    Upload New Image
                  </Card.Subtitle>
                  <Card.Text>(Choose 200 x 200 or square picture)</Card.Text>

                  <Form onSubmit={this.onSubmit} className="mt-3">
                    <Form.File
                      id="image"
                      label={this.state.fileName}
                      onChange={this.onChangePhoto}
                      custom
                    />

                    <Container className="d-flex justify-content-center mt-3">
                      <Button variant="success" type="submit" value="Update">
                        {this.state.formwaiting ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Update"
                        )}
                      </Button>

                      <Button
                        variant="success"
                        type="submit"
                        value="Delete"
                        onClick={this.onDiscard}
                      >
                        Delete
                      </Button>
                    </Container>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col className="col-sm d-flex">
              <Card style={{ width: "30rem" }}>
                <Card.Header>About Me</Card.Header>
                <Card.Body>
                  <Form onSubmit={this.onSubmit} className="mt-5">
                    <Form.Control
                      as="textarea"
                      rows="10"
                      placeholder={this.state.aboutUser}
                      onChange={this.onChangeText}
                      id="abouttext"
                    />

                    <Container className="d-flex justify-content-center mt-3">
                      <Button variant="success" type="submit">
                        {this.state.formwaiting ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </Container>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

CreateProfile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CreateProfile);
