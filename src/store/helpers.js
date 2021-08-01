export function echo(arg) {
  return arg;
}

export function transformKeys(obj, fn = echo) {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    return typeof v === "object"
      ? { ...acc, [fn(k)]: transformKeys(v, fn) }
      : { ...acc, [fn(k)]: v };
  }, {});
}
