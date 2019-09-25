import traverse, { NodePath } from "@babel/traverse";
import template from "@babel/template";
import * as t from "@babel/types";

type TypeDefinition = t.TSInterfaceDeclaration | t.TSTypeAliasDeclaration;
type TypeDefinitionPath = NodePath<TypeDefinition>;

type Config = {};

function createTypeGuard(node: TypeDefinition) {
  console.log(node);
  return node;
}

module.exports = function(
  _config: Config,
  tsDefinitions: TypeDefinitionPath[]
) {
  return tsDefinitions;
  return tsDefinitions.map(definition => createTypeGuard(definition.node));
};
