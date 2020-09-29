import axios from "axios";

import {
  FILE_UPLOAD,
  GET_ERRORS,
} from "./types";

export const uploadImage = (file, fileName) => dispatch => {

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);

  axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
  }).then(res => {
      console.log("File Uploaded");
      dispatch({
        type: FILE_UPLOAD,
        payload: {
          file: file,
          fileName: fileName,
          message: "File Uploaded",
          isSubmitted: true,
        }
      })
  }).catch(err => {
      if (err.response.status === 500) {
          const msg = "There was a problem with the server";
          console.log(msg);
      } else {
          const msg = err.response.data.msg;
          console.log(msg);
      }
      

      dispatch({
          type: GET_ERRORS,
          payload: err.response.data
      });
      dispatch({
        type: FILE_UPLOAD,
        payload: {
          file: file,
          fileName: fileName,
          message: "File Upload Failure",
          isSubmitted: false,
        }
    });       
  })
      
};


//   export const registerUser = (userData, history) => dispatch => {
//     axios
//       .post("/api/users/signup", userData)
//       .then(res => {
//         console.log("Signup success with res.data =", res.data);
//         history.push("/signin");
//       })
//       .catch(err => {
//         console.log("Signup failed. Errors:", err.response.data);
//         dispatch({
//           type: GET_ERRORS,
//           payload: err.response.data
//         });
//       });
//   };