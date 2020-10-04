import { SET_CURRENT_USER, USER_LOADING } from "../../actions/types";

const isEmpty = require("is-empty");

import authReducer from "../authReducer";

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
};

const dummyAction1 = { type: SET_CURRENT_USER, payload: "testPayload1" };
const dummyAction2 = { type: USER_LOADING, payload: "testPayload2" };

describe("authentication reducer", () => {
  // Default case where it just returns the default state without modification
  it("should return the initial state for ", () => {
    expect(authReducer(initialState, {})).toEqual(initialState);
  });

  // Success case where it returns the payload required for setting the current user in payload
  it("Should be able to handle the SET_CURRENT_USER state", () => {
    expect(authReducer(initialState, dummyAction1)).toEqual({
      isAuthenticated: !isEmpty(dummyAction1.payload),
      loading: false,
      user: dummyAction1.payload,
    });
  });

  // Success case where it returns loading as true without the rest of the payload being modified
  it("Should be able to handle the USER_LOADING state", () => {
    expect(authReducer(initialState, dummyAction2)).toEqual({
      isAuthenticated: false,
      loading: true,
      user: {},
    });
  });
});
