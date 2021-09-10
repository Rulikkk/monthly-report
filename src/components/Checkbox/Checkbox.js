import React, { useCallback } from "react";

import { inIframe } from "../../common/utils";

export const Checkbox = ({ project, setProject, label, projectField, initialValue = "" }) => {
  const has = project[projectField] !== undefined;

  const onClickHandler = useCallback(() => {
    if (has && !inIframe() && !window.confirm(`Are you sure you want to remove ${label}?`)) return;
    if (has) {
      const { [projectField]: omitted, ...rest } = project;
      setProject(rest);
    } else {
      setProject({ ...project, [projectField]: initialValue });
    }
  }, [has, project]);
  return (
    <div
      className="mt-1 mr-1 px-2 text-white bg-blue-500 hover:bg-blue-700 rounded cursor-pointer truncate"
      onClick={onClickHandler}>
      <input className="mr-2" type="checkbox" checked={has} readOnly />
      <label>{label}</label>
    </div>
  );
};
