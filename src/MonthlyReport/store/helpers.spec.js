import { echo, transformKeys } from "./helpers";

describe("echo", () => {
  it("returns it's arg", () => {
    expect(echo({ foo: "bar" })).toEqual({ foo: "bar" });
  });
});

describe("transformKeys", () => {
  it("traverses and mutates the keys on a given object", () => {
    let obj = transformKeys({ foo: { bar: "baz" } }, key => key.toUpperCase());
    expect(obj).toEqual({ FOO: { BAR: "baz" } });
  });
});
