import codeGeneration from "../codeGeneration";

jest.mock("node-yaml", () => ({
  readSync: () => ({
    files: "fixtures/**/*.ts",
    generates: {
      "./fixtures/generated.ts": {
        plugins: ["typeguard"]
      }
    }
  })
}));

jest.mock("ts-codegen-typeguard", () => () => {
  return [];
});

describe("Code Generation", () => {
  it("runs all specified code generators on all files", () => {
    codeGeneration();
  });
});
