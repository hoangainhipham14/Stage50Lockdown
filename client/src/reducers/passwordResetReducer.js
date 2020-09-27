import { EMAILSUCCESS } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case EMAILSUCCESS:
      return action.payload;
    default:
      return state;
  }
}
