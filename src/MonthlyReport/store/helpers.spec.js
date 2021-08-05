import { deleteKey, deleteKeys, echo, transformKey, transformKeys } from "./helpers";

let toUpperCase = (str) => str.toUpperCase();

describe("echo", () => {
  it("returns it's arg", () => {
    expect(echo({ foo: "bar" })).toEqual({ foo: "bar" });
  });
});

describe("deleteKey", () => {
  it("returns an object without one specified key", () => {
    let result = deleteKey("foo")({ foo: null, bar: null });
    expect("foo" in result).toBeFalsy();
    expect("bar" in result).toBeTruthy();
  });
});

describe("deleteKeys", () => {
  it("return an object without all specified keys", () => {
    let result = deleteKeys("foo", "bar")({ foo: null, bar: null, baz: null });
    expect("foo" in result).toBeFalsy();
    expect("bar" in result).toBeFalsy();
    expect("baz" in result).toBeTruthy();
  });
});

describe("transformKey", () => {
  it("mutates one key on a given object", () => {
    let result = transformKey("foo", toUpperCase)({ foo: null });
    expect("FOO" in result).toBeTruthy();
    expect("foo" in result).toBeFalsy();
  });
});

describe("transformKeys", () => {
  it("recursively traverses and mutates all keys on a given object", () => {
    let result = transformKeys({ foo: { bar: { baz: { qux: null } } } }, toUpperCase);
    expect(result).toEqual({ FOO: { BAR: { BAZ: { QUX: null } } } });
  });

  it("keeps an array being an array", () => {
    let result = transformKeys({ foo: [{ bar: { baz: null } }, { qux: null }] }, toUpperCase);
    expect(Array.isArray(result.FOO)).toBeTruthy();
  });
});
