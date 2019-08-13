import React from "react";
import "./styles.css";

export const Scrollable = props => {
  const { children } = props,
    isMacLike = !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
  
  return isMacLike ? children : <div className="scrollable__scrollbar">{children}</div>;
};
