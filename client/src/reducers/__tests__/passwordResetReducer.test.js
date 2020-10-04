import passwordResetReducer from "../passwordResetReducer";
import { EMAILSUCCESS } from "../../actions/types";

const dummyAction = {
  payload: "test payload",
  type: EMAILSUCCESS,
};

const dummyState = {
  foo: "bar",
};

describe("password reset reducer ", () => {
  // Default case where it just returns the default state without modification
  it("should return the initial state for ", () => {
    expect(passwordResetReducer(dummyState, {})).toEqual(dummyState);
  });

  // Success case where it returns the payload required from the dummy Action
  it("Should be able to handle the EMAILSUCCESS state", () => {
    expect(passwordResetReducer(dummyState, dummyAction)).toEqual(
      dummyAction.payload
    );
  });
});
