import React, { useState, useRef, useCallback, useEffect } from "react";

const getRandomId = () => {
  let array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  let str = "";
  for (let i = 0; i < array.length; i++) {
    str += (i < 2 || i > 5 ? "" : "-") + array[i].toString(16).slice(-4);
  }
  return str;
};

const getButtonColor = color => `bg-${color}-500 hover:bg-${color}-700 `;

const getButtonClassName = (red, small, disabled, className) =>
  [
    "text-white font-xs px-2 rounded truncate",
    getButtonColor(red ? "red" : "blue"),
    small ? "" : "py-1",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className
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
    {...props}
  >
    {children}
  </button>
);

const PrintButton = () => <Button onClick={() => window.print()}>Print</Button>;

const TopRightFixedMenu = ({ children }) => (
  <div className="fixed top-0 right-0 z-50 no-print p-1 rounded-bl spaced-row-grid">
    {children}
  </div>
);

const initCap = s => [s[0].toUpperCase(), ...s.slice(1)].join("");

const sortedKeys = x => Object.keys(x).sort();

const simpleHook = (object, hook, result) => {
  if (object)
    for (let r of sortedKeys(object))
      result[r] = Array.isArray(object[r])
        ? hook(...object[r])
        : hook(object[r]);
};

const useAll = ({ state, ref, callback, ...rest }) => {
  const result = {};
  if (state)
    for (let t of sortedKeys(state)) {
      const [a, b] = useState(state[t]); // eslint-disable-line
      result[t] = a;
      result["set" + initCap(t)] = b;
    }

  simpleHook(ref, useRef, result);
  simpleHook(callback, useCallback, result);

  if (rest) for (let r of sortedKeys(rest)) result[r] = rest[r];

  return result;
};

const useEffects = effects => {
  for (let effect of effects) {
    simpleHook(effect, useEffect, {});
  }
};

const enhanceDataInplace = data => {
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
  reps.forEach(report => {
    if (!report.projects) report.projects = [];
    for (let k in report.projects) {
      report.projects[k].forEach(proj => {
        if (!proj.id) proj.id = getRandomId();
        if (proj.issues)
          proj.issues.forEach(issue => {
            if (!issue.id) issue.id = getRandomId();
          });
      });
    }
  });

  data.enhanced = 1;
};

export {
  getRandomId,
  initCap,
  Button,
  TopRightFixedMenu,
  useAll,
  useEffects,
  PrintButton,
  enhanceDataInplace
};
