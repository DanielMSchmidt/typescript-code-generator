import { existsSync, writeFileSync } from "fs";
import path from "path";

export const DEFAULT_CONFIG = `
# Source files to be used for generation
files: "src/**/*.ts",

# Generated files
generates:
    # File to be generated
    ./src/generated.ts:
        # Plugins to be used for generation
        plugins:
            # Plugin that creates ducktyping type guards
            - typeguards
        # You need to write a // @ts-gen typeguards comment to into this file
        keyword: typeguard
`;

export default function createProjectConfig() {
  const configPath = path.resolve(process.cwd(), "tscodegen.yml");
  if (!existsSync(configPath)) {
    writeFileSync(configPath, DEFAULT_CONFIG, "utf-8");
  }
}
