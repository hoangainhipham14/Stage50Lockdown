import React, { Component } from "react";
import { singleProject } from "./APIProject";
import { Link, Redirect } from "react-router-dom";
import { Container, Image, Card, Row, Col } from "react-bootstrap";

class SingleProject extends Component {
  state = {
    project: "",
    projectId: "",
    redirectToHome: false,
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
        // console.log("Project: " + this.state.project);
      }
    });
  };

  renderProject = (project) => {
    const userId = project.postedBy ? `/user/${project.postedBy._id}` : "";
    const userName = project.postedBy ? project.postedBy.name : "Unknown";

    return (
      <div className="card-body">
        <img
          src={`/api/project/img/${this.state.projectId}`}
          alt={project.title}
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
          className="img-thunbnail mb-3"
        />

        <p className="card-text">{project.body}</p>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`${userId}`}>{userName} </Link>
          on {new Date(project.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link className="btn btn-raised btn-primary btn-sm mr-5" to={`/`}>
            Back to projects...
          </Link>
        </div>
      </div>
    );
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
