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
  Table,
} from "react-bootstrap";
import { HCenter } from "../layout";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { singleProject } from "./APIProject";

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
    console.log(`Rejected the file ${file.name} (invalid type).`);
  }
  return acceptable;
}

function checkSize(file, maxSize = 10 * 1024 * 1024) {
  const acceptable = file.size <= maxSize;
  if (!acceptable) {
    console.log(`Rejected the file ${file.name} (too large).`);
  }
  return acceptable;
}

// convert a list of accepted types (e.g. ["jpg", "png"]) to a string to be
// passed in as the accept attribute of an input (e.g. ".jpg,.png")
function typesToAcceptAttribute(types) {
  return types.map((t) => "." + t).join(",");
}

const discardPopover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Are you sure?</Popover.Title>
    <Popover.Content>
      <Button
        variant="danger"
        onClick={() => alert("go back needs to be implemented")}
      >
        Discard project
      </Button>
    </Popover.Content>
  </Popover>
);

const formattingPopover = (
  <Popover style={{ maxWidth: "none" }}>
    <Popover.Title as="h3">Formatting help</Popover.Title>
    <Popover.Content className="py-0 px-1">
      <Table size="sm">
        <thead>
          <tr>
            <th>You type:</th>
            <th>You see:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>*italics*</td>
            <td>
              <i>italics</i>
            </td>
          </tr>
          <tr>
            <td>**bold**</td>
            <td>
              <strong>bold</strong>
            </td>
          </tr>
          <tr>
            <td>[Google](https://google.com)</td>
            <td>
              <a href="https://google.com">Google</a>
            </td>
          </tr>
        </tbody>
      </Table>
    </Popover.Content>
  </Popover>
);

const deleteItem = <>&times;</>;
const restoreItem = <span style={{ fontSize: "80%" }}>&#8635;</span>;

class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      about: "",
      body: "",
      mainImage: undefined,
      additionalImages: [],
      additionalFiles: [],
      submitSuccess: false,
      projectId: null,
    };
  }

  // called whenever a value is changed in the form
  onChange = (e) => {
    // the name of field changed
    const name = e.target.id;
    switch (name) {
      /* i know it looks strange to wrap case blocks in {}, but it means you 
      can "redeclare" a const across blocks, which is what i want to do since
      the blocks are mutually exclusive. */
      case "mainImage": {
        const image = e.target.files[0];
        // handle case of empty input (remove the main image)
        if (!image) {
          this.setState({
            mainImage: undefined,
          });
          break;
        }
        // check type and size
        if (checkType(image, acceptedImageTypes) && checkSize(image)) {
          this.setState({
            mainImage: image,
          });
        }
        break;
      }
      case "additionalImages": {
        const filesSelected = Array.from(e.target.files);
        const isAcceptable = (file) =>
          checkType(file, acceptedImageTypes) && checkSize(file);
        const filesSelectedValid = filesSelected.filter(isAcceptable);
        const alreadyAdded = (file) =>
          this.state.additionalImages.filter((f) => appearEqual(f, file))
            .length > 0;
        const filesToAdd = [];
        filesSelectedValid.forEach((file) => {
          if (!alreadyAdded(file)) {
            filesToAdd.push(file);
          }
        });
        this.setState({
          additionalImages: this.state.additionalImages.concat(filesToAdd),
        });
        break;
      }
      case "additionalFiles": {
        const filesSelected = Array.from(e.target.files);
        const isAcceptable = (file) => checkSize(file);
        const filesSelectedValid = filesSelected.filter(isAcceptable);
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

  deleteAdditionalImage = (i) => (e) => {
    this.state.additionalImages.splice(i, 1);
    this.forceUpdate();
  };

  deleteAdditionalFile = (i) => (e) => {
    this.state.additionalFiles.splice(i, 1);
    this.forceUpdate();
  };

  goBack = () => {
    this.props.history.goBack();
  };

  onSubmit = (e) => {
    // prevent page from reloading
    e.preventDefault();

    // get user id for post request and to save as a reference for the project
    const _id = this.props.auth.user._id;

    // create the formdata object
    // we need to do this because JSON isn't sufficient for image sending
    const formData = new FormData();
    formData.set("title", this.state.title);
    formData.set("about", this.state.about);
    formData.set("body", this.state.body);
    formData.set("image", this.state.mainImage);
    this.state.additionalImages.forEach((file, i) => {
      formData.set(`image-${i}`, file, file.name);
    });
    formData.set("numAdditionalImages", this.state.additionalImages.length);
    this.state.additionalFiles.forEach((file, i) => {
      formData.set(`file-${i}`, file, file.name);
    });
    formData.set("numAdditionalFiles", this.state.additionalFiles.length);
    formData.set("_userId", _id);

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
        this.setState({ submitSuccess: true, projectId: response.data._id });
      })
      .catch((err) => {
        console.log("Failure!");
        console.log(err);
      });
  };

  render() {
    if (this.state.submitSuccess) {
      return <Redirect to={`/projects/${this.state.projectId}`} />;
    }

    const additionalImages = [];
    this.state.additionalImages.forEach((file, i) => {
      additionalImages.push(
        <div key={i}>
          <button
            type="button"
            className="close"
            onClick={this.deleteAdditionalImage(i)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <span>{file.name}</span>
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
          <span>{file.name}</span>
        </div>
      );
    });

    return (
      <Container>
        <div style={{ margin: "0 auto" }}>
          <div className="text-center">
            <h2>Create New Project</h2>
          </div>

          <Form onSubmit={this.onSubmit} style={{ marginTop: "1rem" }}>
            <Row>
              <Col md={6}>
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
                  <Form.Control
                    as="textarea"
                    rows="7"
                    placeholder="More information about your project"
                    onChange={this.onChange}
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
              <Col md={6}>
                <Form.Group controlId="mainImage">
                  <Form.Label>Main image</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      accept={typesToAcceptAttribute(acceptedImageTypes)}
                      className="custom-file-input"
                      id="mainImage"
                      onChange={this.onChange}
                    />
                    <label className="custom-file-label" htmlFor="mainImage">
                      {this.state.mainImage
                        ? this.state.mainImage.name
                        : "Choose file"}
                    </label>
                    <div className="invalid-feedback">
                      Example invalid custom file feedback
                    </div>
                  </div>
                </Form.Group>

                <Form.Group controlId="additionalImages">
                  <Form.Label>Additional images</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      accept={typesToAcceptAttribute(acceptedImageTypes)}
                      multiple
                      className="custom-file-input"
                      id="additionalImages"
                      onChange={this.onChange}
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="additionalImages"
                    >
                      Choose files
                    </label>
                  </div>
                  <div className="mt-2">{additionalImages}</div>
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
                  <div className="mt-2">{additionalFiles}</div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <HCenter>
                <div className="button-row">
                  <Button variant="success" type="submit">
                    Create Project
                  </Button>
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement="bottom"
                    overlay={discardPopover}
                  >
                    <Button variant="secondary">Discard Project</Button>
                  </OverlayTrigger>
                </div>
              </HCenter>
            </Row>
          </Form>
        </div>
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
      newAdditionalImages: [],
      newAdditionalFiles: [],
      oldAdditionalImagesNames: [],
      oldAdditionalFilesNames: [],
      imagesToDelete: new Set(),
      filesToDelete: new Set(),
    };
  }

  onChange = (e) => {
    // the name of field changed
    const name = e.target.id;
    switch (name) {
      case "additionalImages": {
        const filesSelected = Array.from(e.target.files);
        const isAcceptable = (file) =>
          checkType(file, acceptedImageTypes) && checkSize(file);
        const filesSelectedValid = filesSelected.filter(isAcceptable);
        const alreadyAdded = (file) =>
          this.state.newAdditionalImages.filter((f) => appearEqual(f, file))
            .length > 0;
        const filesToAdd = [];
        filesSelectedValid.forEach((file) => {
          if (!alreadyAdded(file)) {
            filesToAdd.push(file);
          }
        });
        this.setState({
          newAdditionalImages: this.state.newAdditionalImages.concat(
            filesToAdd
          ),
        });
        break;
      }
      case "additionalFiles": {
        const filesSelected = Array.from(e.target.files);
        const isAcceptable = (file) => checkSize(file);
        const filesSelectedValid = filesSelected.filter(isAcceptable);
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

  componentDidMount() {
    const projectId = this.props.match.params.projectId;
    console.log(projectId);
    singleProject(projectId).then((data) => {
      console.log(data);
      this.setState({
        title: data.title,
        about: data.about,
        body: data.body,

        mainImageName: data.mainImageName,

        oldAdditionalImagesNames: data.additionalImagesNames,

        oldAdditionalFilesNames: data.additionalFilesNames,
      });
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

  deleteNewAdditionalImage = (i) => () => {
    this.state.additionalImages.splice(i, 1);
    this.forceUpdate();
  };

  deleteNewAdditionalFile = (i) => () => {
    this.state.additionalFiles.splice(i, 1);
    this.forceUpdate();
  };

  render() {
    // collect the old additional images into an array of x-able items
    const oldAdditionalImages = [];
    this.state.oldAdditionalImagesNames.forEach((imageName, i) => {
      const toDelete = this.state.imagesToDelete.has(i);
      oldAdditionalImages.push(
        <div key={i}>
          <button
            type="button"
            className="close"
            onClick={this.toggleImageToDelete(i)}
          >
            <span aria-hidden="true">
              {toDelete ? restoreItem : deleteItem}
            </span>
          </button>
          <span style={toDelete ? { textDecoration: "line-through" } : {}}>
            {imageName}
          </span>
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
            {fileName}
          </span>
        </div>
      );
    });

    // collect the new additional images into an array of x-able items
    const newAdditionalImages = [];
    this.state.newAdditionalImages.forEach((image, i) => {
      newAdditionalImages.push(
        <div key={i}>
          <button
            type="button"
            className="close"
            onClick={this.deleteNewAdditionalImage(i)}
          >
            <span aria-hidden="true">{deleteItem}</span>
          </button>
          <span>{image.name}</span>
        </div>
      );
    });

    // collect the new additional images into an array of x-able items
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
          <span>{file.name}</span>
        </div>
      );
    });

    // collect the new additional files into an array of x-able items

    return (
      <Container className="project-form">
        <div style={{ margin: "0 auto" }}>
          <HCenter>
            <h2>Edit Project</h2>
          </HCenter>

          <Form onSubmit={this.onSubmit} style={{ marginTop: "1rem" }}>
            <Row>
              <Col md={6}>
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
                  <Form.Control
                    as="textarea"
                    rows="7"
                    placeholder="More information about your project"
                    onChange={this.onChange}
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
              <Col md={6}>
                <Form.Group controlId="mainImage">
                  <Form.Label>Main image</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      accept={typesToAcceptAttribute(acceptedImageTypes)}
                      className="custom-file-input"
                      id="mainImage"
                      onChange={this.onChange}
                    />
                    <label className="custom-file-label" htmlFor="mainImage">
                      {this.state.mainImage
                        ? this.state.mainImage.name
                        : "Choose file"}
                    </label>
                  </div>
                </Form.Group>

                <Form.Group controlId="additionalImages">
                  <Form.Label>Additional images</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      accept={typesToAcceptAttribute(acceptedImageTypes)}
                      multiple
                      className="custom-file-input"
                      id="additionalImages"
                      onChange={this.onChange}
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="additionalImages"
                    >
                      Choose images
                    </label>
                  </div>
                  {oldAdditionalImages.length > 0 ? (
                    <div className="mt-2 pl-2">
                      <i>New images</i>
                      <div className="pl-3">
                        {newAdditionalImages.length > 0 ? (
                          newAdditionalImages
                        ) : (
                          <i>New images you add will appear here</i>
                        )}
                      </div>
                      <i>Old files</i>
                      <div className="pl-3">{oldAdditionalImages}</div>
                    </div>
                  ) : (
                    <div className="mt-2 pl-2">{newAdditionalImages}</div>
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
                          <i>New files you add will appear here</i>
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
                  <Button variant="success" type="submit">
                    Confirm Changes
                  </Button>
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement="bottom"
                    overlay={discardPopover}
                  >
                    <Button variant="secondary">Discard Changes</Button>
                  </OverlayTrigger>
                </div>
              </HCenter>
            </Row>
          </Form>
        </div>
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
