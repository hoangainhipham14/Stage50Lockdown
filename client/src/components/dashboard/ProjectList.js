/**********************************************/
/* The Project List */
/**********************************************/

import axios from "axios";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Row, Col, ListGroup, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      tempId: "",
    };
  }

  componentDidMount = () => {
    const userId = this.props.auth.user._id;
    console.log("Sending request with:" + userId);

    //const userid = this.props.auth.user._id;
    // Gather all the projects
    axios.post(`/api/project/list`, { userID: userId }).then((response) => {
      if (response.error) {
        console.log("failure");
        console.log(response.error);
      } else {
        console.log("response:");
        this.setState({ projects: response.data });
        //console.log(this.state.projects);
      }
    });
  };

  /*
  Note that I had to write this in HTML as I couldnt find an equally compatible
  native boostrap counterpart
  */
  /*
  render() {
    const projectCards = this.state.projects.map((project, idx) => (
      // project.linkRoute = "/projects/" + project._id;
      <Container>
        <Card>
          <Card.Body key={project._id}>
            <Card.Title>{project.title}</Card.Title>
            <Card.Body>{project.about}</Card.Body>
          </Card.Body>
        </Card>
        <Link to={`/projects/privacy/${project._id}`}>
          <Button>Change Privacy Settings</Button>
        </Link>
        <Link to={`/projects/${project._id}`}>
          <Button>View Project</Button>
        </Link>
      </Container>
    ));
*/

  render() {
    const projectCards = this.state.projects.map((project, idx) => (
      <div>
        <a
          href={`/projects/${project._id}`}
          class="list-group-item list-group-item-action"
        >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{project.title}</h5>
            <small>{project.created}</small>
          </div>
          <p class="mb-1">{project.about}</p>
        </a>
        <a href={`/projects/privacy/${project._id}`}>
          <button type="button" class="btn btn-primary btn-sm">
            Change Privacy Setting
          </button>
        </a>
      </div>
    ));

    return (
      <div class="list-group">
        Project List (Will make nicer in the future)
        {projectCards}
      </div>
    );
  }
}

ProjectList.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProjectList);
