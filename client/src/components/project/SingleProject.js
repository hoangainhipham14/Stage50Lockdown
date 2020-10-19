import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { singleProject, connectLinkToProject } from "./APIProject";
import { Card, Container, Image, Row, Col, ListGroup } from "react-bootstrap";
import { HCenter } from "../layout";

// sanitizer so we can safely render the body text as html after conversion
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

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
        }
      });
    }
  };

  // renderProject = (project) => {
  //   if (project.itemIsPublic) {
  //     return (
  //       <Container>
  //         <Card bg="Light" border="secondary">
  //           <Card.Header>{project.title}</Card.Header>
  //           <ListGroup variant="flush">
  //             <ListGroup.Item>{project.about}</ListGroup.Item>
  //             <ListGroup.Item>
  //               <Row>
  //                 <Col sm={20}>
  //                   <Image
  //                     src={`/api/project/${this.state.projectId}/img`}
  //                     alt=""
  //                     rounded
  //                     thumbnail
  //                   />
  //                 </Col>
  //                 <Col lg={true}>{project.body}</Col>
  //               </Row>
  //             </ListGroup.Item>
  //           </ListGroup>
  //         </Card>
  //         <Row className="justify-content-md-center">
  //           <Image
  //             src={`/api/project/img/${this.state.projectId}`}
  //             alt=""
  //             rounded
  //           />
  //         </Row>
  //         <Row className="justify-content-md-center">
  //           <Image
  //             src={`/api/project/img/${this.state.projectId}`}
  //             alt=""
  //             rounded
  //           />
  //         </Row>
  //       </Container>
  //     );
  //   } else {
  //     return (
  //       <Container>
  //         <ListGroup.Item variant="warning">
  //           Project Is Currently Private
  //         </ListGroup.Item>
  //       </Container>
  //     );
  //   }
  // };

  convertRTFtoHTML = (txt) => {
    // replace **text** with <strong>text</strong>
    txt = txt.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // replace *text* with <i>text</i>
    txt = txt.replace(/\*([^*]+)\*/g, "<i>$1</i>");
    // replace [site](url) with <a href="url">site</a>
    txt = txt.replace(/\[([^[]+)\]\(([^)]+)\)/g, "<a href='$2'>$1</a>");
    return txt;
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to={`/`} />;
    }

    const { project } = this.state;
    if (!project) {
      return <Container>Loading...</Container>;
    }
    const { title, about, body, additionalFiles } = project;
    const formattedBody = DOMPurify.sanitize(this.convertRTFtoHTML(body));
    // const posterId = project.postedBy ? `/user/${project.postedBy._id}` : "";
    // const posterName = project.postedBy ? project.postedBy.name : "Unknown";

    const files = additionalFiles.map((file, i) => {
      const url = `http://localhost:5000/api/project/${this.state.projectId}/file/${i}`;
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
          <Row noGutters>
            <Col lg={6}>
              <Card.Body>
                <Image
                  src={`/api/project/${this.state.projectId}/img`}
                  alt=""
                  style={{ width: "100%" }}
                  thumbnail
                />
              </Card.Body>
            </Col>
            <Col lg={6}>
              <Card.Body style={{ whiteSpace: "pre-line" }}>
                <div dangerouslySetInnerHTML={{ __html: formattedBody }}></div>
                {filesDisplay}
              </Card.Body>
            </Col>
          </Row>
          <Card.Footer className="text-muted">
            Last updated at some point who knows really
          </Card.Footer>
        </Card>
      </Container>
    );
  }
}

export default SingleProject;
