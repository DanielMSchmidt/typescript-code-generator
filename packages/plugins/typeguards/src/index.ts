import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

type TypeDefinition = t.TSInterfaceDeclaration | t.TSTypeAliasDeclaration;
type TypeDefinitionPath = NodePath<TypeDefinition>;

type Config = {};

module.exports = function(
  _config: Config,
  tsDefinitions: TypeDefinitionPath[]
) {
  return [];
};
