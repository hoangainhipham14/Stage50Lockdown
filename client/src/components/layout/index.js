import React from "react";

export function Center(props) {
  return <div style={{ border: "1px red solid" }}>{props.children}</div>;
}

export function HCenter(props) {
  return <div className="text-center">{props.children}</div>;
}
