import React, { Fragment, Component } from "react";
import axios from "axios";
import Message from "./Message";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      fileName: "Choose File",
      message: "",
      data: [], 
    }
  }
  

  onChange = (e) => {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.files[0].name
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("fileName", this.state.fileName);
    
    // Submit Uploaded Image
    try {
        axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        this.setState({
          message: "File Uploaded"
        });
        
      } catch (err) {
        if (err.response.status === 500) {
          this.setState({
            message: "There was a problem with the server"
          });
        } else {
          this.setState({
            message: err.response.data.msg
          });
      }
    }
    try {
      const res = axios.get("/api/upload", {
        fileName: this.state.fileName
      });
      console.log(res);
      this.setState({
        data: res.data
      })
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <Fragment>
        {this.state.message ? <Message msg={this.state.message} /> : null}
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
        </form>
        {/* <div>
          <h1>{this.state.file ? this.state.fileName : null}</h1>
          {this.state.data ? this.state.data.map(
            file => (<div key={file.fileName}>{file ? <img src={`${file.file.path}`} 
            alt={file.fileName}/>:<span>deleted</span>}</div>)): 
          <h3>loading</h3>}
        </div> */}
      </Fragment>
    );
  }
};

// FileUpload.propTypes = {
//   uploadFile: PropTypes.func.isRequired,
// };

// const mapStateToProps = state => ({
//   auth: state.auth
// });

// export default connect(
//   mapStateToProps,
// )(FileUpload);

export default FileUpload;