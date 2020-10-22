import React, { Component, useState, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { singleProject, connectLinkToProject } from "./APIProject";
import {
  Card,
  Container,
  Image as BootstrapImage,
  Row,
  Col,
} from "react-bootstrap";
import { HCenter } from "../layout";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

// sanitizer so we can safely render the body text as html after conversion
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

function scale(width, height) {
  const m = Math.max(width, height);
  return [width / m, height / m];
}

class SingleProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: "",
      projectId: "",
    };
  }

  componentDidMount = () => {
    const possibleLink = this.props.match.params.link;

    // Check to see if this was directed from a link and
    // go though connecting the link to the data
    if (possibleLink) {
      console.log("trying to access with a link");
      connectLinkToProject(possibleLink).then((data) => {
        console.log(data);
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
        console.log(data);
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
    // // I don't know what this is doing, taken from docs
    // const [currentImage, setCurrentImage] = useState(0);
    // const [viewerIsOpen, setViewerIsOpen] = useState(false);

    // const openLightbox = useCallback((event, { photo, index }) => {
    //   setCurrentImage(index);
    //   setViewerIsOpen(true);
    // }, []);

    // const closeLightbox = () => {
    //   setCurrentImage(0);
    //   setViewerIsOpen(false);
    // };

    const photos = [];
    console.log(this.state.project.numAdditionalImages);
    for (var i = 0; i < this.state.project.numAdditionalImages; i++) {
      // Must declare as image object, this allows us to get dimensions
      const img = new Image();
      img.src = `http://localhost:5000/api/project/${this.state.projectId}/image/${i}`;
      const [w, h] = scale(img.width, img.height);

      photos.push({
        src: `http://localhost:5000/api/project/${this.state.projectId}/image/${i}`,
        width: w,
        height: h,
      });
    }
    console.log(photos);

    // const photos = [
    //   {
    //     src: "https://source.unsplash.com/2ShvY8Lf6l0/800x599",
    //     width: 4,
    //     height: 3,
    //   },
    //   {
    //     src: "https://source.unsplash.com/Dm-qxdynoEc/800x799",
    //     width: 1,
    //     height: 1,
    //   },
    //   {
    //     src: "https://source.unsplash.com/qDkso9nvCg0/600x799",
    //     width: 3,
    //     height: 4,
    //   },
    //   {
    //     src: "https://source.unsplash.com/iecJiKe_RNg/600x799",
    //     width: 3,
    //     height: 4,
    //   },
    //   {
    //     src: "https://source.unsplash.com/epcsn8Ed8kY/600x799",
    //     width: 3,
    //     height: 4,
    //   },
    //   {
    //     src: "https://source.unsplash.com/NQSWvyVRIJk/800x599",
    //     width: 4,
    //     height: 3,
    //   },
    //   {
    //     src: "https://source.unsplash.com/zh7GEuORbUw/600x799",
    //     width: 3,
    //     height: 4,
    //   },
    //   {
    //     src: "https://source.unsplash.com/PpOHJezOalU/800x599",
    //     width: 4,
    //     height: 3,
    //   },
    //   {
    //     src: "https://source.unsplash.com/I1ASdgphUH4/800x599",
    //     width: 4,
    //     height: 3,
    //   },
    // ];

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
                <BootstrapImage
                  src={`http://localhost:5000/api/project/${this.state.projectId}/mainImage`}
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
          {/* (just need things to save for the mmoment) */}
          <Row>
            <Card.Body>
              <Gallery photos={photos} />
              {/* <Gallery photos={photos} onClick={openLightbox} /> */}
              {/* <ModalGateway>
                {viewerIsOpen ? (
                  <Modal onClose={closeLightbox}>
                    <Carousel
                      currentIndex={currentImage}
                      views={photos.map((x) => ({
                        ...x,
                        srcset: x.srcSet,
                        caption: x.title,
                      }))}
                    />
                  </Modal>
                ) : null}
              </ModalGateway> */}
            </Card.Body>
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
