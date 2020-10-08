// The button that allows a user to toggle the privacy of a particular project

import React, { Component } from "react";
import axios from "axios";
import { Container, Form } from "react-bootstrap";
//import Switch from "react-bootstrap/esm/Switch";

class PrivacyToggleButton extends Component {
  componentDidMount = () => {};

  // Send a request to the database to switch the itemIsPublic bool
  onToggleClick = (e) => {
    e.preventDefault();
    const projectId = this.props.match.params.projectId;
    //console.log("Button Clicked with id: " + projectId);
    axios
      .post(`/api/project/togglePrivacy/${projectId}`, { projectID: projectId })
      .then((response) => {
        if (response.error) {
          console.log("failure");
          console.log(response.error);
        } else {
          //console.log("Button Clicked with id: " + projectId);
          console.log("itemIsPublic is now " + response.data);
          //console.log(this.state.projects);
        }
      });
  };

  render() {
    return (
      <Container>
        <Form.Group controlId="switch">
          <Form.Label>Toggle Privacy Of Item Here</Form.Label>
          <Form.Check
            type="switch"
            id="switch"
            label="switch"
            onChange={this.onToggleClick}
          />
        </Form.Group>
      </Container>
    );
  }
}

export default PrivacyToggleButton;
