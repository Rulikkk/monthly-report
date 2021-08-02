const echo = arg => arg;

const ifNotNull = (obj, fn) => (!obj ? obj : fn(obj));

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

export const transformKeys = (obj, fn) =>
  !obj
    ? obj
    : Object.entries(obj).reduce(
        (acc, [k, v]) =>
          typeof v === "object"
            ? { ...acc, [fn(k)]: transformKeys(v, fn) }
            : { ...acc, [fn(k)]: v },
        {}
      );
