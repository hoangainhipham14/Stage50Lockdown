// The button that allows a user to toggle the privacy of a particular project

import React, { Component } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";

class PrivacyToggleButton extends Component {
  componentDidMount = () => {};

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
        <Button onClick={this.onToggleClick}>Toggle Privacy</Button>
      </Container>
    );
  }
}

export default PrivacyToggleButton;
