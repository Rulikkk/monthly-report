import React from "react";

export const Checkbox = ({ checked, label, onChange }) => (
  <div
    className="mt-1 mr-1 px-2 text-white bg-blue-500 hover:bg-blue-700 rounded cursor-pointer truncate"
    onClick={() => onChange(!checked)}>
    <input className="mr-2" type="checkbox" checked={checked} readOnly />
    <label>{label}</label>
  </div>
);
