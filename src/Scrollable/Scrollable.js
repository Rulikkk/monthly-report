import React from "react";
import "./styles.css";

export const Scrollable = props => {
    const { children } = props;
	  return <div className="scrollable__scrollbar">{children}</div>;
};
