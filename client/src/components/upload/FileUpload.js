import React, { Fragment, Component } from "react";
import axios from "axios";
import Message from "./Message";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      fileName: "Choose File",
      message: "",
      isSubmitted: false,
    };
  }

  onChange = (e) => {
    try {
      this.setState({
        file: e.target.files[0],
        fileName: e.target.files[0].name,
        message: "",
        isSubmitted: false,
      });
    } catch (err) {
      this.setState({
        file: "",
        fileName: "Choose File",
        message: "Error File not selected",
        isSubmitted: false,
      });
    }
  };

  onSubmit = async (e) => {
    e.preventDefault();

    if (this.state.file === "") {
      this.setState({
        message: "File not supplied",
        isSubmitted: false,
      });
      return;
    }
    if (
      this.state.file.type !== "image/jpeg" &&
      this.state.file.type !== "image/png"
    ) {
      this.setState({
        message: "Wrong File Type",
        isSubmitted: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("fileName", this.state.fileName);

    try {
      axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTimeout(() => {
        this.setState({
          message: "File Uploaded",
          isSubmitted: true,
        });
      }, 1000);
    } catch (err) {
      if (err.response.status === 500) {
        this.setState({
          message: "There was a problem wrong with the server",
        });
      } else {
        this.setState({
          message: err.response.state,
        });
      }
    }
  };

  render() {
    return (
      <div
        className="container"
        style={{ maxWidth: "30rem", margin: "0 auto" }}
      >
        <Fragment>
          {this.state.message ? (
            <Message
              isSubmitted={this.state.isSubmitted}
              message={this.state.message}
            />
          ) : null}
          <form onSubmit={this.onSubmit}>
            <div className="custom-file mb-4">
              <input
                name="file"
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={this.onChange}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {this.state.fileName}
              </label>
            </div>
            <input
              type="submit"
              value="Upload"
              className="btn btn-primary btn-block mt-4"
            />
            <div>
              {/* If File is uploaded then display filename */}
              <strong>
                {this.state.isSubmitted ? this.state.fileName : null}
              </strong>
            </div>
            <img
              src={
                this.state.isSubmitted
                  ? `/api/upload/display/?fileName=${this.state.fileName}`
                  : null
              }
              alt=""
              width="100%"
            ></img>
          </form>
        </Fragment>
      </div>
    );
  }
}

export default FileUpload;
