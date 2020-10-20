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

const acceptedImageTypes = [".jpg", ".png", ".jpeg"];

function appearEqual(file1, file2) {
  return (
    file1.name === file2.name &&
    file1.lastModified === file2.lastModified &&
    file1.size === file2.size
  );
}

class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      about: "",
      body: "",
      mainImage: undefined,
      files: [],
      submitSuccess: false,
      projectId: null,
    };
  }

  // called whenever a value is changed in the form
  onChange = (e) => {
    const maxBytes = 10 * 1024 * 1024;

    // the name of field changed
    const name = e.target.id;
    switch (name) {
      case "mainImage":
        // extract the image
        const image = e.target.files[0];
        if (image) {
          // check file type
          const filetype = image.type.replace("image/", ".");
          if (!acceptedImageTypes.includes(filetype)) {
            alert(`Invalid file type. ${acceptedImageTypes.join("/")} only.`);
            break;
          }
          // check file size
          if (image.size > maxBytes) {
            alert("The selected image is too large (over 10MB).");
            break;
          }
        }
        // tests passed (for now...)
        this.setState({
          mainImage: image,
        });
        break;
      case "additionalFiles":
        // list of files selected on this click of "choose files"
        const filesSelected = e.target.files;

        var filesToAdd = [];
        var filesTooLarge = [];
        for (var i = 0; i < filesSelected.length; i++) {
          const file = filesSelected[i];

          /* Check that the file is not too large. Note this should also be 
          done on the backend, but it's good to do it here because the user
          doesn't have to wait for their large file to be sent to the server
          before being told it's too large to store. */
          if (file.size > maxBytes) {
            // bigger than 10MB
            filesTooLarge.push(file.name);
            continue;
          }

          // next we need to check that the file isn't already added
          var alreadyAdded = false;
          // search already selected files
          for (var j in this.state.files) {
            const f = this.state.files[j];
            if (appearEqual(file, f)) {
              // found a match!
              // file already selected - we won't add it
              alreadyAdded = true;
              break;
            }
          }
          if (!alreadyAdded) {
            filesToAdd.push(file);
          }
        }
        // alert the user of files that were too large
        if (filesTooLarge.length > 0) {
          alert(
            `The following files were too large (over 10MB) and were not added:\n${filesTooLarge.join(
              "\n"
            )}`
          );
        }

        // new list of files is the old list plus files we've decided to add
        this.setState({ files: this.state.files.concat(filesToAdd) });
        break;
      default:
        // by default, the value is just the field value
        this.setState({
          [name]: e.target.value,
        });
    }
  };

  // this guy deletes the ith file from the file list
  // note this is a curried function - it takes a number (i) and produces a
  // function that takes an event and deletes the ith file
  deleteFile = (i) => (e) => {
    this.state.files.splice(i, 1);
    this.setState({});
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
    for (var i in this.state.files) {
      const file = this.state.files[i];
      /*
      Add the ith file with the key file-i to the formData. Why not an array? Because I can't figure out how to get formidable to show me the full array on the other end. I hate it. I hate it so much.
      */
      formData.append(`file-${i}`, file, file.name);
    }
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

    const discardPopover = (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Are you sure?</Popover.Title>
        <Popover.Content>
          <Button variant="danger" onClick={this.goBack}>
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

    var files = [];
    for (var i = 0; i < this.state.files.length; i++) {
      const file = this.state.files[i];
      files.push(
        <div key={i}>
          <button type="button" className="close" onClick={this.deleteFile(i)}>
            <span aria-hidden="true">&times;</span>
          </button>
          <span>{file.name}</span>
        </div>
      );
    }

    return (
      <Container>
        <div style={{ margin: "0 auto" }}>
          <div className="text-center">
            <h2>Create New Project</h2>
          </div>

          <Form onSubmit={this.onSubmit} style={{ marginTop: "1rem" }}>
            <Row>
              <Col>
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
              <Col>
                <Form.Group controlId="mainImage">
                  <Form.Label>Main image</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      accept={acceptedImageTypes.join(",")}
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
                  <div className="mt-2">{files}</div>
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

CreateProject.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CreateProject);
