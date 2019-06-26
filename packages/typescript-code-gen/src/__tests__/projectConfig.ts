import createProjectConfig, { DEFAULT_CONFIG } from "../projectConfig";
jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
  existsSync: jest.fn()
}));
const fs = require("fs");

describe("ProjectConfig", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("New Project", () => {
    beforeEach(() => {
      // the file does not exist
      fs.existsSync.mockReturnValue(false);
    });

    it("writes a default config file", () => {
      createProjectConfig();
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        DEFAULT_CONFIG,
        "utf-8"
      );
    });
  });

  describe("Existing Projectfile", () => {
    beforeEach(() => {
      // the file does not exist
      fs.existsSync.mockReturnValue(true);
    });

    it("writes no config file", () => {
      createProjectConfig();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });
});
