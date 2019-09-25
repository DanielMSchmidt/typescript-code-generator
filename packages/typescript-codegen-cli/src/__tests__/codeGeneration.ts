import codeGeneration from "../codeGeneration";
import { readFileSync } from "fs";
import { resolve } from "path";

jest.mock("node-yaml", () => ({
  readSync: () => ({
    files: "./src/fixtures/**/*.ts",
    generates: {
      "./src/generated/typeguards.ts": {
        plugins: ["typeguards"],
        keyword: "typeguards"
      }
    }
  })
}));

jest.mock(
  "@typescript-codegen/typeguards",
  () => (_config: unknown, input: unknown) => input
);

describe("Code Generation", () => {
  it("runs all specified code generators on all files", () => {
    codeGeneration();
    expect(
      readFileSync(resolve(__dirname, "../generated/typeguards.ts"), "utf-8")
    ).toMatchInlineSnapshot(`
      "// @ts-gen typeguards
      type foo = {
        name: string;
        size: number;
        isGreat: boolean;
        aliases: string[];
      };"
    `);
  });
});
