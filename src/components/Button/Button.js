import React from "react";
import { getButtonClassName } from "../../common/utils";

export const Button = ({
  children,
  small = false,
  red = false,
  disabled = false,
  className = "",
  ...props
}) => (
  <button
    className={getButtonClassName(red, small, disabled, className)}
    type="button"
    title={typeof children === "string" ? children : null}
    {...props}>
    {children}
  </button>
);
