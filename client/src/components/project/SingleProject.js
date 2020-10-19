import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { singleProject, connectLinkToProject } from "./APIProject";
import { Card, Container, Image, Row, Col, ListGroup } from "react-bootstrap";
class SingleProject extends Component {
  state = {
    project: "",
    projectId: "",
  };

  componentDidMount = () => {
    const possibleLink = this.props.match.params.link;

    // Check to see if this was directed from a link and
    // go though connecting the link to the data
    if (possibleLink) {
      console.log("trying to access with a link");
      connectLinkToProject(possibleLink).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({
            project: data,
            // This could possibly break lol
            projectId: data._id,
          });
        }
      });
    } else {
      // Otherwise go through the standard procedure
      const projectId = this.props.match.params.projectId;
      singleProject(projectId).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({
            project: data,
            projectId: projectId,
          });
          // console.log("Project: " + this.state.project);
        }
      });
    }
  };

  renderProject = (project) => {
    if (project.itemIsPublic) {
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
                      alt=""
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
              alt=""
              rounded
            />
          </Row>
          <Row className="justify-content-md-center">
            <Image
              src={`/api/project/img/${this.state.projectId}`}
              alt=""
              rounded
            />
          </Row>
        </Container>
      );
    } else {
      return (
        <Container>
          <ListGroup.Item variant="warning">
            Project Is Currently Private
          </ListGroup.Item>
        </Container>
      );
    }
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to={`/`} />;
    }

    const { project } = this.state;
    if (!project) {
      return <Container>Loading...</Container>;
    }
    const { title, about, body } = project;
    // const posterId = project.postedBy ? `/user/${project.postedBy._id}` : "";
    // const posterName = project.postedBy ? project.postedBy.name : "Unknown";
    return (
      <Container>
        <Card>
          <Card.Header>
            <div className="text-center">
              <h1>{title}</h1>
            </div>
            <hr />
            <div className="text-center">{about}</div>
          </Card.Header>
          <Row noGutters>
            <Col lg={6}>
              <Card.Body>
                <Image
                  src={`/api/project/img/${this.state.projectId}`}
                  alt=""
                  style={{ width: "100%" }}
                  thumbnail
                />
              </Card.Body>
            </Col>
            <Col lg={6}>
              <Card.Body style={{ whiteSpace: "pre-line" }}>{body}</Card.Body>
            </Col>
          </Row>
          <hr />
          <Card.Body>
            <h2>Gallery</h2>
          </Card.Body>
          <hr />
          <Card.Body>
            <h2>Additional files</h2>
          </Card.Body>
          <Card.Footer className="text-muted">
            Last updated at some point who knows really
          </Card.Footer>
        </Card>
      </Container>
    );
  }
}

export default SingleProject;
