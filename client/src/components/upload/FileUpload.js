import React, { Fragment, Component } from "react";
// import axios from "axios";
import Message from "./Message";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uploadImage } from "../../actions/uploadAction";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      fileName: "Choose File",
      message: "",
      isSubmitted: false
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
    
    // Submit Uploaded Image
    // try {
    uploadImage(this.state.file, this.state.fileName);
        
    //     // Successful Upload
    //     this.setState({
    //       message: "File Uploaded",
    //       isSubmitted: true
    //     });
        
    //   } catch (err) {
    //     if (err.response.status === 500) {
    //       this.setState({
    //         message: "There was a problem with the server"
    //       });
    //     } else {
    //       this.setState({
    //         message: err.response.data.msg
    //       });
    //   }
    // }
  };

  render() {
    return (
      <Fragment>
        {this.state.message ? <Message msg={this.state.message} /> : null}
        <form maxWidth={'30rem'} onSubmit={this.onSubmit}>
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
            <h3>{this.state.isSubmitted ? this.state.fileName : null}</h3>
          </div>
          <img
            src={this.state.isSubmitted ? `/api/upload/display/?fileName=${this.state.fileName}`  : null}
            alt=""
          ></img>
        </form>
      </Fragment>
    );
  }
};

FileUpload.propTypes = {
  uploadImage: PropTypes.func.isRequired,
  file: PropTypes.object,
  fileName: PropTypes.object,
  message: PropTypes.object,
  isSubmitted: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  file: state.file,
  fileName: state.fileName,
  message: state.message,
  isSubmitted: state.isSubmitted
});

export default connect(
  mapStateToProps,
  { uploadImage }
)(FileUpload);
