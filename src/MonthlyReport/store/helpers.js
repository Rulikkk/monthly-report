import isArray from "lodash.isarray";
import isPlainObject from "lodash.isplainobject";

/** Pass a given argument back */
export function echo(arg) {
  return arg;
}

/** Create a timestamp string in the HH:MM:SS.MS format */
export function timestamp() {
  let d = new Date();
  let h = d.getHours().toString().padStart(2, "0");
  let m = d.getMinutes().toString().padStart(2, "0");
  let s = d.getSeconds().toString().padStart(2, "0");
  let ms = d.getMilliseconds().toString().padStart(3, "0");
  return `${[h, m, s].join(":")}.${ms}`;
}

/** TODO: add description */
export function apply(obj, fns) {
  return fns.reduce((acc, fn) => fn(acc), obj);
}

/** Create new object skipping one given key */
export function deleteKey(key) {
  return ({ [key]: _, ...rest }) => rest;
}

/** Create new object skipping all given keys */
export function deleteKeys(...keys) {
  return (obj) => apply(obj, keys.map(deleteKey));
}

/** Transform one key of a given object */
export function transformKey(k, fn = echo) {
  return ({ [k]: v, ...rest }) => ({ ...rest, [fn(k)]: v });
}

/**
 * Transform all keys of a given object
 * @example transformKeys({a: {b: 1}}, v => v.toUpperCase()) -> {A: {B: 1}}
 * */
export function transformKeys(obj, fn = echo) {
  if (!obj || (typeof obj).match(/string|number|boolean/)) return obj;
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (isPlainObject(v)) return { ...acc, [fn(k)]: transformKeys(v, fn) };
    else if (isArray(v)) return { ...acc, [fn(k)]: v.map((vv) => transformKeys(vv, fn)) };
    else return { ...acc, [fn(k)]: v };
  }, {});
}

export function joinAbs(...items) {
  return "/" + items.filter(Boolean).join("/");
}
