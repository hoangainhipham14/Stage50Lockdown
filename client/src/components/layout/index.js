import React from "react";

export function Center(props) {
  console.log(props);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="h-100"
    >
      <div {...props}>{props.children}</div>
    </div>
  );
}

export function HCenter(props) {
  return (
    <div className="text-center w-100">
      <div {...props}>{props.children}</div>
    </div>
  );
}
