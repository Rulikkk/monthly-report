const echo = arg => arg;

const deleteKey =
  key =>
  ({ [key]: _, ...rest }) =>
    rest;

export const apply = (obj, fns) => fns.reduce((c, fn) => fn(c), obj);

export const deleteKeys = keys => obj => apply(obj, keys.map(deleteKey));

export const renameKey =
  (oldName, newName) =>
  ({ [oldName]: oldVal, ...rest }) => {
    rest[newName] = oldVal;
    return rest;
  };

export function transformKeys(obj, fn = echo) {
  if (!obj) return obj;
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (Array.isArray(v)) {
      return { ...acc, [fn(k)]: v.map(el => transformKeys(el, fn)) };
    } else if (typeof v === "object") {
      return { ...acc, [fn(k)]: transformKeys(v) };
    } else {
      return { ...acc, [fn(k)]: v };
    }
  }, {});
}
