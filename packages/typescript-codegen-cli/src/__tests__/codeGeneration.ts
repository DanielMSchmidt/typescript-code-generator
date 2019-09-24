import codeGeneration from "../codeGeneration";
import { readFileSync } from "fs";
import { resolve } from "path";

jest.mock("node-yaml", () => ({
  readSync: () => ({
    files: "./src/fixtures/**/*.ts",
    generates: {
      "./src/generated/typeguards.ts": {
        plugins: ["typeguards"]
      }
    }
  })
}));

describe("Code Generation", () => {
  it("runs all specified code generators on all files", () => {
    codeGeneration();
    expect(
      readFileSync(resolve(__dirname, "../generated/typeguards.ts"), "utf-8")
    ).toMatchInlineSnapshot(`""`);
  });
});
