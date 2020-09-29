import {
  FILE_UPLOAD,
} from "../actions/types";

// const isEmpty = require("is-empty");

const initialState = {
  file: "",
  fileName: "Choose File",
  message: "",
  isSubmitted: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case FILE_UPLOAD:
      return {
        ...state,
        file: (action.payload.file),
        fileName: (action.payload.fileName),
        message: (action.payload.message),
        isSubmitted: (action.payload.isSubmitted),
      }
    default:
      return state;
  }
}