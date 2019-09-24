import { readSync as readYaml } from "node-yaml";
import path, { resolve } from "path";
import { readFileSync, fstat, writeFileSync, unlinkSync } from "fs";
import { sync as globSync } from "glob";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";

type TypeDefinition = t.TSInterfaceDeclaration | t.TSTypeAliasDeclaration;
type TypeDefinitionPath = NodePath<TypeDefinition>;

function commentIncludes(searchString: string, path: TypeDefinitionPath) {
  return (path.node.leadingComments || []).some(leadingComment =>
    leadingComment.value.includes(searchString)
  );
}

export default function codeGeneration() {
  const configPath = path.resolve(process.cwd(), "tscodegen.yml");
  const config = readYaml(configPath);

  // Gather all files
  const files = globSync(config.files);

  // Get all type definitions
  const typeDefinitions = files
    .map(filePath => readFileSync(filePath, "utf-8"))
    .reduce(
      (carry, fileContent) => {
        const program = parse(fileContent, {
          sourceType: "unambiguous",
          plugins: [
            "typescript",
            "jsx",
            "dynamicImport",
            "decorators-legacy",
            "classProperties"
          ]
        });

        const typeDefinitions: TypeDefinitionPath[] = [];
        traverse(program, {
          enter(path) {
            if (
              (t.isTSTypeAliasDeclaration(path.node) ||
                t.isTSInterfaceDeclaration(path.node)) &&
              // Filter those ones out that have no leading comment
              commentIncludes("@ts-gen", path as TypeDefinitionPath)
            ) {
              typeDefinitions.push(path as TypeDefinitionPath);
            }
          }
        });

        return [...carry, ...typeDefinitions];
      },
      [] as TypeDefinitionPath[]
    );

  // For each output
  Object.entries(config.generates).forEach(([outFilePath, outputConfig]) => {
    const absolutOutPath = resolve(__dirname, "..", outFilePath);
    // Clear output path
    try {
      unlinkSync(absolutOutPath);
    } catch (e) {}

    // => Filter by leading comment === this keyword
    const applicableTypeDefs = typeDefinitions.filter(path =>
      commentIncludes((outputConfig as any).keyword, path)
    );

    // => gather babel asts from plugins
    const pluginOutputAsts = (outputConfig as any).plugins.reduce(
      (carry: string[], pluginName: string) => {
        // => require plugin
        const plugin = require("@typescript-codegen/" + pluginName);
        // => invoke plugin with type definitions
        return [...carry, ...plugin(outputConfig, applicableTypeDefs)];
      },
      []
    );

    // => generate
    const codeStrings = pluginOutputAsts.map((ast: any) => generate(ast));
    const code = codeStrings.join("\n");
    writeFileSync(absolutOutPath, code, "utf-8");
  });
}
