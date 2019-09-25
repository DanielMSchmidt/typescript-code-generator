import traverse, { NodePath } from "@babel/traverse";
import template from "@babel/template";
import * as t from "@babel/types";

type TypeDefinition = t.TSInterfaceDeclaration | t.TSTypeAliasDeclaration;
type TypeDefinitionPath = NodePath<TypeDefinition>;

type Config = {};
const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const typeguardFunction = (typename: string, body: t.Statement[]) => {
  const input = t.identifier("input");
  input.typeAnnotation = t.tsTypeAnnotation(t.tsUnknownKeyword());

  const fn = t.functionDeclaration(
    t.identifier(`is${capitalize(typename)}`),
    [input],
    t.blockStatement(body)
  );

  const typeReference = {
    type: "TSTypeReference",
    typeName: t.identifier(typename)
  } as t.TSTypeReference;

  fn.returnType = t.tsTypeAnnotation(
    t.tsTypePredicate(input, t.tsTypeAnnotation(typeReference))
  );

  return fn;
};

const typeOfCheck = (type: string) =>
  template.ast(`
if (typeof input !== "${type}") {
  return false
}
`);

const returnTrue = template.ast(`return true`);

function getTypeChecks(node: TypeDefinition) {
  switch ((node as any).typeAnnotation.type as string) {
    case "TSStringKeyword":
      return [typeOfCheck("string")];
    case "TSNumberKeyword":
      return [typeOfCheck("number")];
    case "TSBooleanKeyword":
      return [typeOfCheck("boolean")];
    default:
      return [];
  }
}

function createTypeGuard(node: TypeDefinition) {
  switch (node.type) {
    case "TSTypeAliasDeclaration":
      return typeguardFunction(node.id.name, [
        ...getTypeChecks(node),
        returnTrue as any
      ]);
    default:
      return null;
  }
}

module.exports = function(_config: Config, tsDefinitions: TypeDefinition[]) {
  return tsDefinitions
    .map(definition => createTypeGuard(definition))
    .filter(def => def !== null);
};
