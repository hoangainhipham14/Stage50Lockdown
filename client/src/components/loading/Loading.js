import React from "react";
import { Spinner } from "react-bootstrap";
// import {Center, HCenter} from "../layout";

export function Loading() {
  return <Spinner animation="grow" size="lg" className="loading" />;
}
