import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connectLinkToProject } from "./APIProject";
import {
  Card,
  Container,
  Image as BootstrapImage,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import { Center, HCenter } from "../layout";
import { SRLWrapper } from "simple-react-lightbox";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

const Purifier = require("html-purify");

class ImageWithLoading extends Component {
  state = { isLoaded: false };

  componentDidMount() {
    const image = new Image();
    image.onload = () => this.setState({ isLoaded: true });
    image.src = this.props.src;
  }

  render() {
    const { isLoaded } = this.state;

    return isLoaded ? (
      <BootstrapImage {...this.props} />
    ) : (
      <div className="loading-image">Loading image...</div>
    );
  }
}

class SingleProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: "",
      projectId: "",
      images: [],
      error: null,
      redirectToHome: false,
      showModal: false,
    };
  }

  componentDidMount = () => {
    const possibleLink = this.props.match.params.link;

    // Check to see if this was directed from a link and
    // go though connecting the link to the data
    if (possibleLink) {
      console.log("trying to access with a link");
      connectLinkToProject(possibleLink).then((data) => {
        console.log("Got project data:", data);
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({
            project: data,
            // This could possibly break lol
            projectId: data._id,
          });
          console.log(this.state.projectId);
        }
      });
    } else {
      // Otherwise go through the standard procedure
      // console.log("trying to access normally");
      const projectId = this.props.match.params.projectId;
      // console.log("project id:", projectId);
      axios
        .get(`/api/project/${projectId}`)
        .then((response) => {
          // console.log(response);
          this.setState({
            project: response.data,
            projectId: projectId,
          });
        })
        .catch((err) => {
          switch (err.response.status) {
            case 403:
              this.setState({
                error: "Project is private.",
              });
              break;
            case 404:
              this.setState({
                error: "Project does not exist.",
              });
              break;
            default:
              this.setState({
                error: "Unknown error.",
              });
          }
        });
    }
    // console.log("Current State: " + JSON.stringify(this.state));
  };

  convertRTFtoHTML = (txt) => {
    // replace **text** with <strong>text</strong>
    // Check if its defined first so that a deleted page
    // doesnt try to be replaced
    if (txt) {
      txt = txt.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      // replace *text* with <i>text</i>
      txt = txt.replace(/\*([^*]+)\*/g, "<i>$1</i>");
      // replace [site](url) with <a href="url">site</a>
      txt = txt.replace(/\[([^[]+)\]\(([^)]+)\)/g, "<a href='//$2'>$1</a>");
    }
    return txt;
  };

  deleteProject = () => {
    axios.delete(`/api/project/${this.state.projectId}/delete`).then((err) => {
      this.setState({
        redirectToHome: true,
      });
    });
  };

  handleShow = () => {
    this.setState({
      showModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false,
    });
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to={`/`} />;
    }

    if (this.state.error) {
      return <Container>{this.state.error}</Container>;
    }

    const { project } = this.state;
    if (!project) {
      return <Container>Loading....</Container>;
    }
    const {
      title,
      about,
      body,
      additionalFilesNames,
      imagesNames,
      mainImageIndex,
    } = project;
    const purifier = new Purifier();
    const formattedBody = purifier.purify(this.convertRTFtoHTML(body));
    // const posterId = project.postedBy ? `/user/${project.postedBy._id}` : "";
    // const posterName = project.postedBy ? project.postedBy.name : "Unknown";

    const files = additionalFilesNames.map((file, i) => {
      const url = `/api/project/${this.state.projectId}/file/${i}`;
      const displayName =
        file.length > 25 ? file.substring(0, 22) + "..." : file;
      return (
        <div key={i}>
          <a href={url}>{displayName}</a>
        </div>
      );
    });
    let filesDisplay;
    if (files.length > 0) {
      filesDisplay = (
        <div className="pt-3">
          <h5>Additional files</h5>
          {files}
        </div>
      );
    } else {
      filesDisplay = null;
    }

    const numImages = imagesNames.length;
    const images = [];
    for (var i = 0; i < numImages; i++) {
      if (i === mainImageIndex) continue;
      images.push(
        <Col sm={3} className="col-image" key={i}>
          <Center>
            <ImageWithLoading
              src={`/api/project/${this.state.projectId}/image/${i}`}
              className="w-100"
              alt={this.state.project.imagesNames[i]}
            />
          </Center>
        </Col>
      );
    }

    // const bodyJSX = (
    //   <div>
    //     <span
    //       style={{ whiteSpace: "pre-line" }}
    //       dangerouslySetInnerHTML={{ __html: formattedBody }}
    //     ></span>
    //   </div>
    // );

    return (
      <Container>
        <Card>
          <Card.Header>
            <HCenter>
              <h1>{title}</h1>
            </HCenter>
            <HCenter>
              <i>{about}</i>
            </HCenter>
          </Card.Header>
          <Card.Body>
            {mainImageIndex !== null ? (
              <Row>
                <Col>
                  <Col lg={6} className="float-left">
                    <ImageWithLoading
                      src={`/api/project/${this.state.projectId}/mainImage`}
                      alt=""
                      style={{ width: "100%" }}
                      thumbnail
                      className="img-responsive"
                    />
                  </Col>
                  <ReactMarkdown plugins={[gfm]}>{body}</ReactMarkdown>
                </Col>
              </Row>
            ) : (
              <ReactMarkdown plugins={[gfm]}>{body}</ReactMarkdown>
            )}
          </Card.Body>
          <Row noGutters>
            <Card.Body>
              <SRLWrapper>
                <Row className="justify-content-md-center">{images}</Row>
              </SRLWrapper>
            </Card.Body>
          </Row>
          <Card.Footer className="text-muted">
            <Row>
              <Col>{filesDisplay}</Col>
              <Col>
                {this.state.project.editingPrivileges ? (
                  <>
                    <Link
                      to={`/projects/${this.state.projectId}/edit`}
                      style={{ float: "right" }}
                    >
                      <Button>Edit Project</Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="float-right"
                      onClick={this.handleShow}
                    >
                      Delete Project
                    </Button>
                    <Modal
                      show={this.state.showModal}
                      onHide={this.handleClose}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>
                          Are you sure you want to delete this project?
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>This action cannot be undone!</Modal.Body>
                      <Modal.Footer>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        <Button onClick={this.deleteProject} variant="danger">
                          Delete
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                ) : null}
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Container>
    );
  }
}

export default SingleProject;
