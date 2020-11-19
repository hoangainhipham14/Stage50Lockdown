import React, { Component } from "react";
import { ListGroup, Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

class ProjectList extends Component {
  render() {
    console.log(this.props.projects);
    const projectCards = this.props.projects.map((project, idx) =>
      this.props.isAuth ? (
        <ListGroup.Item key={idx}>
          <Card.Text style={{ textAlign: "right", fontSize: 13 }}>
            {project.created}
          </Card.Text>
          <Link to={`/projects/${project._id}`}>
            <Card.Title>{project.title}</Card.Title>
          </Link>
          <Card.Text>{project.about}</Card.Text>
          {this.props.isAuth && (
            <Link to={`/projects/privacy/${project._id}`}>
              <Button variant="outline-primary">Change Privacy Settings</Button>
            </Link>
          )}
        </ListGroup.Item>
      ) : (
        project.itemIsPublic && (
          <ListGroup.Item key={idx}>
            <Card.Text style={{ textAlign: "right", fontSize: 13 }}>
              {project.created}
            </Card.Text>
            <Link to={`/projects/${project._id}`}>
              <Card.Title>{project.title}</Card.Title>
            </Link>
            <Card.Text>{project.about}</Card.Text>
            {this.props.isAuth && (
              <Link to={`/projects/privacy/${project._id}`}>
                <Button variant="outline-primary">
                  Change Privacy Settings
                </Button>
              </Link>
            )}
          </ListGroup.Item>
        )
      )
    );

    // if projects exist
    if (this.props.projectExists && this.props.projectPublic) {
      // display scrollable projects
      return (
        <div className="my-3">
          <Card>
            <Card.Header>Projects</Card.Header>
            <Container>
              <ListGroup className="list-group-flush">{projectCards}</ListGroup>
            </Container>
          </Card>
        </div>
      );
      // }
    } else {
      // display no project
      return (
        <Card className="my-3" style={{ width: "45rem" }}>
          <Card.Header>Projects</Card.Header>
          <Card.Body>
            <Card.Title>No projects</Card.Title>
          </Card.Body>
        </Card>
      );
    }
  }
}

export default ProjectList;
