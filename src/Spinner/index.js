import React from "react";
import "./style.css";

const Spinner = ({ text, high }) => (
  <>
    <div className="lds-spinner mx-auto my-4">
      {Array(12)
        .fill(null)
        .map((_, i) => (
          <div key={i} />
        ))}
    </div>
    <p className="text-center good-fonts">{text}</p>
    {high && <div style={{ height: "1000px" }} />}
  </>
);

export default Spinner;
