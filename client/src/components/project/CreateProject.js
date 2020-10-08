import axios from "axios";
import React, { Component } from "react";
import {
  Container,
  Form,
  Button,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
      mainImage: "",
      files: [],
    };
  }

  // called whenever a value is changed in the form
  onChange = (e) => {
    // the name of field changed
    const name = e.target.id;
    // the value of the field changed
    var value;
    switch (name) {
      case "mainImage":
        // extract the image
        value = e.target.files[0];
        break;
      case "files":
        // list of files selected on this click of "choose files"
        const filesSelected = e.target.files;
        // we'll only add files that aren't already selected
        var filesToAdd = [];
        for (var i = 0; i < filesSelected.length; i++) {
          const file = filesSelected[i];
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
        // new list of files is the old list plus files we've decided to add
        value = this.state.files.concat(filesToAdd);
        break;
      default:
        // by default, the value is just the field value
        value = e.target.value;
    }

    this.setState({
      [name]: value,
    });
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

    // create the formdata object
    // we need to do this because JSON isn't sufficient for image sending
    const formData = new FormData();
    formData.set("title", this.state.title);
    formData.set("about", this.state.about);
    formData.set("body", this.state.body);
    formData.set("image", this.state.mainImage);
    for (var i in this.state.files) {
      const file = this.state.files[i];
      // add file i with the key "file[i]"
      // this seems hacky because it is
      // i can't find a better way
      formData.append(`file-${i}`, file, file.name);
    }

    // configururation for post request since we aren't just posting json
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    // get user id for post request
    const _id = this.props.auth.user._id;

    axios
      .post(`/api/project/create/${_id}`, formData, config)
      .then((response) => {
        console.log("Success!");
        console.log(response.data);
      })
      .catch((err) => {
        console.log("Failure!");
        console.log(err);
      });
  };

  render() {
    const popover = (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Are you sure?</Popover.Title>
        <Popover.Content>
          <Button variant="danger" onClick={this.goBack}>
            Discard project
          </Button>
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
        <div style={{ maxWidth: "30rem", margin: "0 auto" }}>
          <div className="text-center">
            <h2>Create New Project</h2>
          </div>

          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" onChange={this.onChange} />
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
            </Form.Group>

            <Form.Group controlId="mainImage">
              <Form.File label="Main Image" onChange={this.onChange} />
            </Form.Group>

            <Form.Group controlId="files">
              <Form.Label>Additional files</Form.Label>
              <Form.File
                multiple
                onChange={this.onChange}
                style={{ color: "transparent" }}
                value=""
              />
              {files}
            </Form.Group>

            <div className="text-center">
              <Button variant="success" type="submit">
                Create Project
              </Button>
              <OverlayTrigger
                trigger="click"
                rootClose
                placement="bottom"
                overlay={popover}
              >
                <Button variant="secondary">Discard Project</Button>
              </OverlayTrigger>
            </div>
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
