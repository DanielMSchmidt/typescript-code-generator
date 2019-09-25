import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";

const plugin = require("../");

// TODO: move into a testing plugin
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
  describe("simple types", () => {
    it("guards string type", () => {
      expect(
        runPlugin(`
        type myString = string
      `)
      ).toMatchInlineSnapshot(`
        "function isMyString(input: unknown): input is myString {
          if (typeof input !== \\"string\\") {
            return false;
          }

          return true;
        }"
      `);
    });

    it("guards number type", () => {
      expect(
        runPlugin(`
        type myNumber = number
      `)
      ).toMatchInlineSnapshot(`
        "function isMyNumber(input: unknown): input is myNumber {
          if (typeof input !== \\"number\\") {
            return false;
          }

          return true;
        }"
      `);
    });

    it("guards boolean type", () => {
      expect(
        runPlugin(`
        type myBool = boolean
      `)
      ).toMatchInlineSnapshot(`
        "function isMyBool(input: unknown): input is myBool {
          if (typeof input !== \\"boolean\\") {
            return false;
          }

          return true;
        }"
      `);
    });
  });

  describe("advanced types", () => {
    it.todo("guards enums of simple types");
    it.todo("guards arrays of simple types");
    it.todo("guards simple objects");
    it.todo("guards multi-level objects");
  });

  describe("complex types", () => {
    it.todo("guards specific generics");
  });

  describe("challenges", () => {
    it.todo("guards open generics");
    it.todo("guards referenced types");
  });
});
