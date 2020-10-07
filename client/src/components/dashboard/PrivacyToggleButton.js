// The button that allows a user to toggle the privacy of a particular project

const { Component } = require("react");
const { Container } = require("react-bootstrap");
import { Container, Button } from "react-bootstrap";

class PrivacyToggleButton extends Component {
  onTogglePrivacyClick = (projectId) => {
    axios
      .post(`/api/project/togglePrivacy`, { projectID: projectId })
      .then((response) => {
        if (response.error) {
          console.log("failure");
          console.log(response.error);
        } else {
          console.log("Button Clicked with id" + projectId);
          //console.log("Project is now" + response.data);
          //console.log(this.state.projects);
        }
      });
  };

  render() {
    return (
      <Container>
        <Button type="submit">Toggle Privacy</Button>
      </Container>
    );
  }
}
