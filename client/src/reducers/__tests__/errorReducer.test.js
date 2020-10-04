// This is essentially the same as the passwordResetReducer

import errorReducer from "../errorReducer";
import { GET_ERRORS } from "../../actions/types";

const dummyAction = { payload: "test payload", type: GET_ERRORS };

const dummyState = { foo: "bar" };

describe("password reset reducer", () => {
  // Default case where it just returns the default state without modification
  it("should return the initial state for ", () => {
    expect(errorReducer(dummyState, {})).toEqual(dummyState);
  });

  // Success case where it returns the payload required from the dummy Action
  it("Should be able to handle the EMAILSUCCESS state", () => {
    expect(errorReducer(dummyState, dummyAction)).toEqual(dummyAction.payload);
  });
});
