import React, { Component } from "react";
import { singleProject } from "./APIProject";
import { Card, Container, Image, Row, Col, ListGroup } from "react-bootstrap";
class SingleProject extends Component {
  state = {
    project: "",
    projectId: "",
  };

  componentDidMount = () => {
    const projectId = this.props.match.params.projectId;
    singleProject(projectId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          project: data,
          projectId: projectId,
        });
      }
    });
  };

  renderProject = (project) => {
    return (
      <Container>
        <Card bg="Light" border="secondary">
          <Card.Header>{project.title}</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>{project.about}</ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={20}>
                  <Image
                    src={`/api/project/img/${this.state.projectId}`}
                    alt={project.title}
                    rounded
                    thumbnail
                  />
                </Col>
                <Col lg={true}>{project.body}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card>

        <Row className="justify-content-md-center">
          <Image
            src={`/api/project/img/${this.state.projectId}`}
            alt={project.title}
            rounded
          />
        </Row>
        <Row className="justify-content-md-center">
          <Image
            src={`/api/project/img/${this.state.projectId}`}
            alt={project.title}
            rounded
          />
        </Row>
      </Container>
    );
  };

  render() {
    const { project } = this.state;
    return (
      <div className="container">
        {!project ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderProject(project)
        )}
      </div>
    );
  }
}

export default SingleProject;
