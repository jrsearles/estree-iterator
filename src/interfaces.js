export const interfaces = {
  "Block": ["BlockStatement", "Program", "IfStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "LabeledStatement", "WhileStatement", "WithStatement"],
  "Function": ["FunctionExpression", "FunctionDeclaration", "ArrowFunctionExpression"],
  "Class": ["ClassExpression", "ClassDeclaration"],
  "Declaration": ["FunctionDeclaration", "VariableDeclaration", "ClassDeclaration"],
  "Declarator": ["VariableDeclarator", "FunctionDeclaration", "ClassDeclaration"],
  "Statement": ["ExpressionStatement", "BlockStatement", "EmptyStatement", "DebuggerStatement", "WithStatement", "ReturnStatement", "LabeledStatement", "BreakStatement", "ContinueStatement", "IfStatement", "SwitchStatement", "SwitchCase"],
  "Loop": ["WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement  "],
  "Expression": ["ThisExpression", "ArrayExpression", "ObjectExpression", "Property", "FunctionExpression", "UnaryExpression", "UpdateExpression", "BinaryExpression", "AssignmentExpression", "LogicalExpression", "MemberExpression", "ConditionalExpression", "CallExpression", "NewExpression", "SequenceExpression", "TemplateLiteral", "TaggedTemplateExpression", "ClassExpression"],
  "Directive" () {
    return this.type === "ExpressionStatement"
      && this.expression.type === "Literal"
      && typeof this.expression.value === "string";
  },
  "Scope": ["FunctionExpression", "FunctionDeclaration", "Program"]
};
