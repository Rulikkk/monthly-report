import React, { useCallback, useEffect } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { useDropzone } from "react-dropzone";

const getRandomId = () => {
  let array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  let str = "";
  for (let i = 0; i < array.length; i++) {
    str += (i < 2 || i > 5 ? "" : "-") + array[i].toString(16).slice(-4);
  }
  return str;
};

const getButtonColor = (color) => `bg-${color}-500 hover:bg-${color}-700 `;

const getButtonClassName = (red, small, disabled, className) =>
  [
    "text-white font-xs px-2 rounded truncate",
    getButtonColor(red ? "red" : "blue"),
    small ? "" : "py-1",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ].join(" ");

const Button = ({
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

const PrintButton = () => <Button onClick={() => window.print()}>Print</Button>;

const initCap = (s) => `${s[0].toUpperCase()}${s.slice(1)}`;

const sortedKeys = (x) => Object.keys(x).sort();

const simpleHook = (object, hook, result) => {
  if (object)
    for (let r of sortedKeys(object))
      result[r] = Array.isArray(object[r]) ? hook(...object[r]) : hook(object[r]);
};

const useEffects = (effects) => {
  for (let effect of effects) {
    simpleHook(effect, useEffect, {});
  }
};

const enhanceDataInplace = (data) => {
  const reps = data.reports;

  // fill next/prev links
  if (reps.length > 1) {
    reps[0].next = reps[1];
    reps[reps.length - 1].prev = reps[reps.length - 2];
  }
  for (let i = 1; i < data.reports.length - 1; i++) {
    reps[i].prev = reps[i - 1];
    reps[i].next = reps[i + 1];
  }

  // fill IDs for projects and issues
  reps.forEach((report) => {
    if (!report.projects) report.projects = [];
    for (let k in report.projects) {
      report.projects[k].forEach((proj) => {
        if (!proj.id) proj.id = getRandomId();
        if (proj.issues)
          proj.issues.forEach((issue) => {
            if (!issue.id) issue.id = getRandomId();
          });
      });
    }
  });

  data.enhanced = 1;
  return data;
};

const EditorShadowedCard = ({ children }) => (
  <div className="m-2 p-2 rounded border shadow-lg">{children}</div>
);

const SingleImgButton = ({ onImage, className, title, dragTitle }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do whatever you want with the file contents
      if (acceptedFiles.length > 1) {
        window.alert(`Only support one file.`);
        return;
      }

      try {
        if (acceptedFiles.length > 0 && acceptedFiles[0]) {
          let reader = new FileReader();
          reader.readAsDataURL(acceptedFiles[0]);
          reader.onerror = (err) => console.log(err);
          reader.onloadend = () => onImage(reader.result);
        }
      } catch (e) {
        window.alert(`Could not parse file with error ${e}.`);
      }
    },
    [onImage],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*",
  });

  return (
    <div className={className} title={title} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <p>{dragTitle}</p> : <p>{title}</p>}
    </div>
  );
};

const Input = ({
  value,
  onChange,
  afterChange,
  textarea = false,
  className = "",
  ...otherProps
}) => {
  const handleChange = ({ target: { value } }) => {
    onChange && onChange(value);
    afterChange && afterChange();
  };
  const props = {
    ...otherProps,
    className:
      "shadow w-full appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " +
      className,
    value,
    onChange: handleChange,
  };

  return textarea ? <TextareaAutosize {...props} /> : <input type="text" {...props} />;
};

export {
  getRandomId,
  initCap,
  Button,
  useEffects,
  PrintButton,
  enhanceDataInplace,
  EditorShadowedCard,
  SingleImgButton,
  Input,
};
