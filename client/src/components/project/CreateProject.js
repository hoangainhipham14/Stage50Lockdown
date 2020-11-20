import axios from "axios";
import React, { Component } from "react";
import {
  Container,
  Form,
  Button,
  OverlayTrigger,
  Popover,
  Row,
  Col,
  Image as BootstrapImage,
  Modal,
} from "react-bootstrap";
import { HCenter } from "../layout";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Editor from "rich-markdown-editor";

const acceptedImageTypes = ["jpg", "png", "jpeg"];

function appearEqual(file1, file2) {
  return (
    file1.name === file2.name &&
    file1.lastModified === file2.lastModified &&
    file1.size === file2.size
  );
}

function checkType(file, acceptedTypes) {
  // file.type looks like "application/html" or "image/jpg"
  const pieces = file.type.split("/");
  const fileType = pieces[pieces.length - 1];
  const acceptable = acceptedTypes.includes(fileType);
  if (!acceptable) {
    console.log(
      `Rejected the file ${renderFileName(file.name)} (invalid type).`
    );
  }
  return acceptable;
}

function checkSize(file, maxSize = 1 * 1024 * 1024) {
  const acceptable = file.size <= maxSize;
  if (!acceptable) {
    console.log(`Rejected the file ${renderFileName(file.name)} (too large).`);
  }
  // Popup here
  return acceptable;
}

// convert a list of accepted types (e.g. ["jpg", "png"]) to a string to be
// passed in as the accept attribute of an input (e.g. ".jpg,.png")
function typesToAcceptAttribute(types) {
  return types.map((t) => "." + t).join(",");
}

function renderFileName(fileName, maxLength = 40) {
  return fileName.length > maxLength
    ? fileName.substring(0, maxLength - 3) + "..."
    : fileName;
}

function discardPopover(message, cb) {
  return (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Are you sure?</Popover.Title>
      <Popover.Content>
        <Button variant="danger" onClick={cb}>
          {message}
        </Button>
      </Popover.Content>
    </Popover>
  );
}

const formattingPopover = (
  <Popover style={{ maxWidth: "20em" }}>
    <Popover.Title as="h3">Formatting help</Popover.Title>
    {/* <Popover.Content className="py-0 px-1"> */}
    <Popover.Content>
      <ul>
        <li>Click the + symbol to see formatting options.</li>
        <li>
          The<strong> info notice, warning notice, and tip notice </strong>
          formatting options will not render as intended.{" "}
        </li>
        <li>All standard markdown options are available to use. </li>
        <li>
          If you see a \ at the end of your text, be sure to check there are no
          trailing newlines at the end of your text.
        </li>
      </ul>
    </Popover.Content>
  </Popover>
);

const deleteItem = <>&times;</>;
const restoreItem = <span style={{ fontSize: "80%" }}>&#8635;</span>;

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
      <div class="loading-image">Loading image...</div>
    );
  }
}

function generateImagePopovers(n, func) {
  const popovers = [];
  for (var i = 0; i < n; i++) {
    popovers.push(
      <Popover>
        <Popover.Content>
          <ImageWithLoading src={func(i)} style={{ width: "100%" }} />
        </Popover.Content>
      </Popover>
    );
  }
  return popovers;
}

class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      about: "",
      body: "",
      mainImageIndex: null,
      images: [],
      additionalFiles: [],
      submitSuccess: false,
      projectId: null,
      showModal: false,
    };
  }

  modalClose = () => {
    this.setState({
      showModal: false,
    });
  };

  // called whenever a value is changed in the form
  onChange = (e) => {
    // the name of field changed
    const name = e.target.id;
    switch (name) {
      /* i know it looks strange to wrap case blocks in {}, but it means you 
      can "redeclare" a const across blocks, which is what i want to do since
      the blocks are mutually exclusive. */
      case "images": {
        const filesSelected = Array.from(e.target.files);
        const isAcceptable = (file) =>
          checkType(file, acceptedImageTypes) && checkSize(file);
        const filesSelectedValid = filesSelected.filter(isAcceptable);
        // Add if statement to toggle modal
        if (filesSelectedValid.length !== filesSelected.length) {
          this.setState({ showModal: true });
        }

        const alreadyAdded = (file) =>
          this.state.images.filter((f) => appearEqual(f, file)).length > 0;
        const filesToAdd = [];
        filesSelectedValid.forEach((file) => {
          if (!alreadyAdded(file)) {
            filesToAdd.push(file);
          }
        });
        this.setState({
          images: this.state.images.concat(filesToAdd),
        });
        break;
      }
      case "additionalFiles": {
        const filesSelected = Array.from(e.target.files);
        const isAcceptable = (file) => checkSize(file);
        const filesSelectedValid = filesSelected.filter(isAcceptable);
        if (filesSelectedValid.length !== filesSelected.length) {
          this.setState({ showModal: true });
        }
        const alreadyAdded = (file) =>
          this.state.additionalFiles.filter((f) => appearEqual(f, file))
            .length > 0;
        const filesToAdd = [];
        filesSelectedValid.forEach((file) => {
          if (!alreadyAdded(file)) {
            filesToAdd.push(file);
          }
        });
        this.setState({
          additionalFiles: this.state.additionalFiles.concat(filesToAdd),
        });
        break;
      }
      default:
        // by default, the value is just the field value
        this.setState({
          [name]: e.target.value,
        });
    }
  };

  onBodyChange = (e) => {
    this.setState({
      body: e(),
    });
  };

  onSubmit = (e) => {
    // prevent page from reloading
    e.preventDefault();

    // get user id for post request and to save as a reference for the project
    const _id = this.props.auth.user._id;
    const username = this.props.match.params.username;

    // create the formdata object
    // we need to do this because JSON isn't sufficient for image sending
    const formData = new FormData();
    formData.set("title", this.state.title);
    formData.set("about", this.state.about);
    formData.set("body", this.state.body);
    this.state.images.forEach((file, i) => {
      formData.set(`image-${i}`, file, file.name);
    });
    formData.set("numImages", this.state.images.length);
    formData.set("mainImageIndex", this.state.mainImageIndex);
    this.state.additionalFiles.forEach((file, i) => {
      formData.set(`file-${i}`, file, file.name);
    });
    formData.set("numAdditionalFiles", this.state.additionalFiles.length);
    formData.set("_userId", _id);
    formData.set("username", username);

    // configururation for post request since we aren't just posting json
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(`/api/project/create/${_id}`, formData, config)
      .then((response) => {
        console.log("Success!");
        console.log(response.data);
        // successful project creation should return project id
        this.setState({
          submitSuccess: true,
          projectId: response.data.projectId,
        });
        console.log(this.state);
      })
      .catch((err) => {
        console.log("Failure!");
        console.log(err);
      });
  };

  deleteImage = (i) => (e) => {
    this.state.images.splice(i, 1);
    const index = this.state.mainImageIndex;
    if (index) {
      console.log(index, i);
      if (index === i) {
        // just deleted the main image
        this.removeMainImage();
      } else if (index > i) {
        // need to decrement the main image
        console.log("need to decrement");
        this.setImageAsMain(index - 1)();
      }
    }
    this.forceUpdate();
  };

  deleteAdditionalFile = (i) => (e) => {
    this.state.additionalFiles.splice(i, 1);
    this.forceUpdate();
  };

  goBack = () => {
    this.props.history.goBack();
  };

  setImageAsMain = (i) => () => {
    console.log("setting", i);
    this.setState({
      mainImageIndex: i,
    });
  };

  removeMainImage = () => {
    this.setState({
      mainImageIndex: null,
    });
  };

  render() {
    if (this.state.submitSuccess) {
      return <Redirect to={`/projects/${this.state.projectId}`} />;
    }

    const images = [];
    this.state.images.forEach((image, i) => {
      const isMain = this.state.mainImageIndex === i;
      images.push(
        <div key={i} className="image-item">
          <span>{renderFileName(image.name)}</span>
          <button type="button" className="close" onClick={this.deleteImage(i)}>
            <span aria-hidden="true">&times;</span>
          </button>
          {isMain ? (
            <span className="unset-as-main" onClick={this.removeMainImage}>
              Remove as main
            </span>
          ) : (
            <span className="set-as-main" onClick={this.setImageAsMain(i)}>
              Set as main
            </span>
          )}
        </div>
      );
    });

    const additionalFiles = [];
    this.state.additionalFiles.forEach((file, i) => {
      additionalFiles.push(
        <div key={i}>
          <button
            type="button"
            className="close"
            onClick={this.deleteAdditionalFile(i)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <span>{renderFileName(file.name)}</span>
        </div>
      );
    });

    return (
      <Container className="project-form">
        <div style={{ margin: "0 auto" }}>
          <div className="text-center">
            <h2>Create New Project</h2>
          </div>

          <Form onSubmit={this.onSubmit} style={{ marginTop: "1rem" }}>
            <Row>
              <Col lg={6}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Give your project a title"
                    onChange={this.onChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="about">
                  <Form.Label>About</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    placeholder="A short description of the project"
                    onChange={this.onChange}
                  />
                </Form.Group>

                <Form.Group controlId="body">
                  <Form.Label>Body Text</Form.Label>
                  {/* <Form.Control
                    as="textarea"
                    rows="7"
                    placeholder="More information about your project"
                    onChange={this.onChange}
                  /> */}
                  <Editor
                    id="body"
                    onChange={this.onBodyChange}
                    placeholder="More information about your project"
                  />
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement="bottom"
                    overlay={formattingPopover}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    >
                      formatting help
                    </span>
                  </OverlayTrigger>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="images">
                  <Form.Label>Images</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      accept={typesToAcceptAttribute(acceptedImageTypes)}
                      multiple
                      className="custom-file-input"
                      id="images"
                      onChange={this.onChange}
                    />

                    <label className="custom-file-label" htmlFor="images">
                      Choose files
                    </label>
                  </div>
                  <div className="mt-2 pl-2">{images}</div>
                </Form.Group>

                <Form.Group controlId="additionalFiles">
                  <Form.Label>Additional files</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      multiple
                      className="custom-file-input"
                      id="additionalFiles"
                      onChange={this.onChange}
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="additionalFiles"
                    >
                      Choose files
                    </label>
                  </div>
                  <div className="mt-2 pl-2">{additionalFiles}</div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <HCenter>
                <div className="button-row">
                  <Button
                    className="display-btn"
                    variant="success"
                    type="submit"
                  >
                    Create Project
                  </Button>
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement="bottom"
                    overlay={discardPopover("Discard Project", this.goBack)}
                  >
                    <Button className="display-btn" variant="secondary">
                      Discard Project
                    </Button>
                  </OverlayTrigger>
                </div>
              </HCenter>
            </Row>
          </Form>
        </div>

        <Modal show={this.state.showModal} onHide={this.modalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Invalid File</Modal.Title>
          </Modal.Header>
          <Modal.Body>(Note): Files can be no larger than 1MB</Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={this.modalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export class EditProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      about: "",
      body: "",
      updatedbody: "",
      newImages: [],
      newAdditionalFiles: [],
      oldImagesNames: [],
      oldAdditionalFilesNames: [],
      imagesToDelete: new Set(),
      filesToDelete: new Set(),
      mainImageIndex: null,
      mainImageIsNew: false,
      showModal: false,
      carouselImageIndex: null,
      carouselImageIsNew: false,
    };
  }

  modalClose = () => {
    this.setState({
      showModal: false,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    // text fields
    formData.set("title", this.state.title);
    formData.set("about", this.state.about);
    formData.set("body", this.state.updatedbody);

    // main image
    formData.set("mainImageIndex", this.state.mainImageIndex);
    formData.set("mainImageIsNew", this.state.mainImageIsNew);

    // images
    this.state.newImages.forEach((file, i) => {
      formData.set(`image-${i}`, file, file.name);
    });
    formData.set("numNewImages", this.state.newImages.length);
    formData.set(
      "imagesToDelete",
      JSON.stringify(Array.from(this.state.imagesToDelete))
    );

    // files
    this.state.newAdditionalFiles.forEach((file, i) => {
      formData.set(`file-${i}`, file, file.name);
    });
    formData.set("numNewAdditionalFiles", this.state.newAdditionalFiles.length);
    formData.set(
      "filesToDelete",
      JSON.stringify(Array.from(this.state.filesToDelete))
    );

    // configururation for post request since we aren't just posting json
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(`/api/project/${this.state.projectId}/edit`, formData, config)
      .then((response) => {
        console.log("Success!");
        console.log(response.data);
        this.setState({
          submitSuccess: true,
        });
      })
      .catch((err) => {
        console.log("Failure!");
        console.log(err);
        this.setState({
          error: "Unauthorized",
        });
      });
  };

  onChange = (e) => {
    // the name of field changed
    const name = e.target.id;
    switch (name) {
      case "images": {
        const filesSelected = Array.from(e.target.files);
        const isAcceptable = (file) =>
          checkType(file, acceptedImageTypes) && checkSize(file);
        const filesSelectedValid = filesSelected.filter(isAcceptable);
        // Add if statement to toggle modal
        if (filesSelectedValid.length !== filesSelected.length) {
          this.setState({ showModal: true });
        }
        const alreadyAdded = (file) =>
          this.state.newImages.filter((f) => appearEqual(f, file)).length > 0;
        const filesToAdd = [];
        filesSelectedValid.forEach((file) => {
          if (!alreadyAdded(file)) {
            filesToAdd.push(file);
          }
        });
        this.setState({
          newImages: this.state.newImages.concat(filesToAdd),
        });
        break;
      }
      case "additionalFiles": {
        const filesSelected = Array.from(e.target.files);
        const isAcceptable = (file) => checkSize(file);
        const filesSelectedValid = filesSelected.filter(isAcceptable);
        if (filesSelectedValid.length !== filesSelected.length) {
          this.setState({ showModal: true });
        }
        const alreadyAdded = (file) =>
          this.state.newAdditionalFiles.filter((f) => appearEqual(f, file))
            .length > 0;
        const filesToAdd = [];
        filesSelectedValid.forEach((file) => {
          if (!alreadyAdded(file)) {
            filesToAdd.push(file);
          }
        });
        this.setState({
          newAdditionalFiles: this.state.newAdditionalFiles.concat(filesToAdd),
        });
        break;
      }
      default: {
        // by default, the value is just the field value
        this.setState({
          [name]: e.target.value,
        });
      }
    }
  };

  onBodyChange = (e) => {
    this.setState({
      updatedbody: e(),
    });
  };

  componentDidMount() {
    const projectId = this.props.match.params.projectId;
    console.log(projectId);
    const func = (i) => `/api/project/${projectId}/image/${i}`;

    axios
      .get(`/api/project/${projectId}`)
      .then((response) => {
        const project = response.data;
        this.setState({
          title: project.title,
          about: project.about,
          body: project.body,
          oldImagesNames: project.imagesNames,
          oldImagePopovers: generateImagePopovers(
            project.imagesNames.length,
            func
          ),
          oldAdditionalFilesNames: project.additionalFilesNames,
          mainImageIndex: project.mainImageIndex,
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

  toggleImageToDelete = (i) => () => {
    const imagesToDeleteUpdated = this.state.imagesToDelete;
    this.state.imagesToDelete.has(i)
      ? imagesToDeleteUpdated.delete(i)
      : imagesToDeleteUpdated.add(i);
    this.setState({
      imagesToDelete: imagesToDeleteUpdated,
    });

    // un-main this image if appropriate
    const mainImageIndex = this.state.mainImageIndex;
    if (
      this.state.imagesToDelete.has(i) &&
      !this.state.mainImageIsNew &&
      mainImageIndex === i
    ) {
      this.removeMainImage();
    }
  };

  toggleFileToDelete = (i) => () => {
    const filesToDeleteUpdated = this.state.filesToDelete;
    this.state.filesToDelete.has(i)
      ? filesToDeleteUpdated.delete(i)
      : filesToDeleteUpdated.add(i);
    this.setState({
      filesToDelete: filesToDeleteUpdated,
    });
  };

  deleteNewImage = (i) => () => {
    this.state.newImages.splice(i, 1);
    const index = this.state.mainImageIndex;
    if (this.state.mainImageIsNew && index) {
      if (index === i) {
        this.removeMainImage();
      } else if (index > i) {
        this.setNewImageAsMain(index - 1)();
      }
    }
    this.forceUpdate();
  };

  deleteNewAdditionalFile = (i) => () => {
    this.state.additionalFiles.splice(i, 1);
    this.forceUpdate();
  };

  setOldImageAsMain = (i) => () => {
    this.setState({
      mainImageIndex: i,
      mainImageIsNew: false,
    });
    if (this.state.imagesToDelete.has(i)) {
      this.toggleImageToDelete(i)();
    }
  };

  setNewImageAsMain = (i) => () => {
    this.setState({
      mainImageIndex: i,
      mainImageIsNew: true,
    });
  };

  removeMainImage = () => {
    this.setState({
      mainImageIndex: null,
      mainImageIsNew: false,
    });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    if (this.state.submitSuccess) {
      return <Redirect to={`/projects/${this.state.projectId}`} />;
    }

    if (this.state.error) {
      return <Container>{this.state.error}</Container>;
    }

    // collect the old additional images into an array of x-able items
    const oldImages = [];
    this.state.oldImagesNames.forEach((imageName, i) => {
      const toDelete = this.state.imagesToDelete.has(i);
      const isMain =
        this.state.mainImageIndex === i && !this.state.mainImageIsNew;
      const deleteStyle = toDelete ? { textDecoration: "line-through" } : {};
      oldImages.push(
        <div key={i} className="image-item">
          <OverlayTrigger
            trigger="click"
            rootClose
            placement="bottom"
            overlay={this.state.oldImagePopovers[i]}
          >
            <span
              style={{
                ...deleteStyle,
                cursor: "pointer",
              }}
            >
              {renderFileName(imageName)}
            </span>
          </OverlayTrigger>

          <button
            type="button"
            className="close"
            onClick={this.toggleImageToDelete(i)}
          >
            <span aria-hidden="true">
              {toDelete ? restoreItem : deleteItem}
            </span>
          </button>
          {isMain ? (
            <span className="unset-as-main" onClick={this.removeMainImage}>
              Remove as main
            </span>
          ) : (
            <span className="set-as-main" onClick={this.setOldImageAsMain(i)}>
              Set as main
            </span>
          )}
        </div>
      );
    });

    // collect the new additional images into an array of x-able items
    const newImages = [];
    this.state.newImages.forEach((image, i) => {
      const isMain =
        this.state.mainImageIndex === i && this.state.mainImageIsNew;
      newImages.push(
        <div key={i} className="image-item">
          <span>{renderFileName(image.name)}</span>
          <button
            type="button"
            className="close"
            onClick={this.deleteNewImage(i)}
          >
            <span aria-hidden="true">{deleteItem}</span>
          </button>
          {isMain ? (
            <span className="unset-as-main" onClick={this.removeMainImage}>
              Remove as main
            </span>
          ) : (
            <span className="set-as-main" onClick={this.setNewImageAsMain(i)}>
              Set as main
            </span>
          )}
        </div>
      );
    });

    // collect the old additional files into an array of x-able items
    const oldAdditionalFiles = [];
    this.state.oldAdditionalFilesNames.forEach((fileName, i) => {
      const toDelete = this.state.filesToDelete.has(i);
      oldAdditionalFiles.push(
        <div key={i}>
          <button
            type="button"
            className="close"
            onClick={this.toggleFileToDelete(i)}
          >
            <span aria-hidden="true">
              {toDelete ? restoreItem : deleteItem}
            </span>
          </button>
          <span style={toDelete ? { textDecoration: "line-through" } : {}}>
            {renderFileName(fileName)}
          </span>
        </div>
      );
    });

    // collect the new additional files into an array of x-able items
    const newAdditionalFiles = [];
    this.state.newAdditionalFiles.forEach((file, i) => {
      newAdditionalFiles.push(
        <div key={i}>
          <button
            type="button"
            className="close"
            onClick={this.deleteNewAdditionalFile(i)}
          >
            <span aria-hidden="true">{deleteItem}</span>
          </button>
          <span>{renderFileName(file.name)}</span>
        </div>
      );
    });

    return (
      <Container className="project-form">
        <div style={{ margin: "0 auto" }}>
          <HCenter>
            <h2>Edit Project</h2>
          </HCenter>

          <Form onSubmit={this.onSubmit} style={{ marginTop: "1rem" }}>
            <Row>
              <Col lg={6}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Give your project a title"
                    onChange={this.onChange}
                    value={this.state.title}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="about">
                  <Form.Label>About</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    placeholder="A short description of the project"
                    onChange={this.onChange}
                    value={this.state.about}
                  />
                </Form.Group>

                <Form.Group controlId="body">
                  <Form.Label>Body Text</Form.Label>
                  {/* <Form.Control
                    as="textarea"
                    rows="7"
                    placeholder="More information about your project"
                    onChange={this.onChange}
                    value={this.state.body}
                  /> */}

                  {/* Markdown Editor */}
                  <Editor
                    id="body"
                    onChange={this.onBodyChange}
                    placeholder="More information about your project"
                    value={this.state.body}
                  />
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement="bottom"
                    overlay={formattingPopover}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    >
                      formatting help
                    </span>
                  </OverlayTrigger>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="images">
                  <Form.Label>Images</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      accept={typesToAcceptAttribute(acceptedImageTypes)}
                      multiple
                      className="custom-file-input"
                      id="images"
                      onChange={this.onChange}
                    />

                    <label className="custom-file-label" htmlFor="images">
                      Choose images
                    </label>
                  </div>
                  {oldImages.length > 0 ? (
                    <div className="mt-2 pl-2">
                      <i>New images</i>
                      <div className="pl-3">
                        {newImages.length > 0 ? (
                          newImages
                        ) : (
                          <i style={{ opacity: "0.5" }}>
                            Images you add will appear here
                          </i>
                        )}
                      </div>
                      <i>Old images</i>
                      <div className="pl-3">{oldImages}</div>
                    </div>
                  ) : (
                    <div className="mt-2 pl-2">{newImages}</div>
                  )}
                </Form.Group>

                <Form.Group controlId="additionalFiles">
                  <Form.Label>Additional files</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      multiple
                      className="custom-file-input"
                      id="additionalFiles"
                      onChange={this.onChange}
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="additionalFiles"
                    >
                      Choose files
                    </label>
                  </div>
                  {oldAdditionalFiles.length > 0 ? (
                    <div className="mt-2 pl-2">
                      <i>New files</i>
                      <div className="pl-3">
                        {newAdditionalFiles.length > 0 ? (
                          newAdditionalFiles
                        ) : (
                          <i>Files you add will appear here</i>
                        )}
                      </div>
                      <i>Old files</i>
                      <div className="pl-3">{oldAdditionalFiles}</div>
                    </div>
                  ) : (
                    <div className="mt-2 pl-2">{newAdditionalFiles}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <HCenter>
                <div className="button-row">
                  <Button
                    variant="success"
                    type="submit"
                    className="display-btn"
                  >
                    Confirm Changes
                  </Button>
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement="bottom"
                    overlay={discardPopover("Discard changes", this.goBack)}
                  >
                    <Button className="display-btn" variant="secondary">
                      Discard Changes
                    </Button>
                  </OverlayTrigger>
                </div>
              </HCenter>
            </Row>
          </Form>
        </div>
        <Modal show={this.state.showModal} onHide={this.modalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Invalid File</Modal.Title>
          </Modal.Header>
          <Modal.Body>(Note): Files can be no larger than 1MB</Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={this.modalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

CreateProject.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CreateProject);
