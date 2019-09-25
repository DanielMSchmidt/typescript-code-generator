import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";

const plugin = require("../");

const runPlugin = (typeDefs: string): string => {
  const ast = parse(typeDefs, {
    sourceType: "unambiguous",
    plugins: [
      "typescript",
      "jsx",
      "dynamicImport",
      "decorators-legacy",
      "classProperties"
    ]
  }).program.body;
  const output = plugin({}, ast);
  return generate(t.program(output)).code;
};

describe("typeguards", () => {
  it("creates type guard for a simple type", () => {
    expect(
      runPlugin(`
      type myString = string
    `)
    ).toMatchInlineSnapshot(`"type myString = string;"`);
  });
});
