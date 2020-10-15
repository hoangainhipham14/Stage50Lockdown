import axios from "axios";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ListGroup, Button, Card, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      projectExists: true,
    };
  }

  componentDidMount = () => {
    const userId = this.props.auth.user._id;
    // console.log("Sending request with:" + userId);

    // Gather all the projects in a post request with a userID
    axios.post(`/api/project/list`, { userID: userId }).then((response) => {
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
    const projectCards = this.state.projects.map((project) => (
      <ListGroup.Item key={project._id}>
        <Card.Text style={{ textAlign: "right", fontSize: 13 }}>
          {project.created}
        </Card.Text>
        <Card.Title>{project.title}</Card.Title>
        <Card.Text>{project.about}</Card.Text>
        <Link to={`/projects/privacy/${project._id}`}>
          <Button>Change Privacy Settings</Button>
        </Link>
      </ListGroup.Item>
    ));

    // if projects exist
    if (this.state.projectExists) {
      // if numbers of projects are smaller than 4, display list of them fully
      if (this.state.projects.length < 4) {
        return (
          <Col className="col-sm d-flex">
            <Card style={{ width: "45rem" }}>
              <Card.Header>Projects</Card.Header>
              <ListGroup className="list-group-flush">{projectCards}</ListGroup>
            </Card>
          </Col>
        );
      } else {
        // display scrollable projects
        return (
          <Col className="col-sm d-flex">
            <Card style={{ width: "45rem" }}>
              <Card.Header>Projects</Card.Header>
              <Container style={{ overflowY: "scroll", maxHeight: 300 }}>
                <ListGroup className="list-group-flush">
                  {projectCards}
                </ListGroup>
              </Container>
            </Card>
          </Col>
        );
      }
    } else {
      // display no project
      return (
        <Col className="col-sm d-flex">
          <Card style={{ width: "45rem" }}>
            <Card.Header>Projects</Card.Header>
            <Card.Body>
              <Card.Title>No project</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      );
    }
  }
}

ProjectList.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProjectList);
