"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var types = exports.types = {};
types.ArrayExpression = ["elements"];
types.AssignmentExpression = ["right", "left"];
types.BinaryExpression = types.LogicalExpression = ["left", "right"];
types.BlockStatement = types.Program = ["body"];
types.BreakStatement = types.ContinueStatement = ["label"];
types.CallExpression = types.NewExpression = ["callee", "arguments"];
types.CatchClause = ["param", "body"];
types.ConditionalExpression = types.IfStatement = ["test", "consequent", "alternate"];
types.DoWhileStatement = ["body", "test"];
types.ExpressionStatement = ["expression"];
types.ForStatement = ["init", "test", "body", "update"];
types.ForInStatement = ["right", "left", "body"];
types.FunctionDeclaration = types.FunctionExpression = ["id", "params", "body"];
types.LabeledStatement = ["label", "body"];
types.MemberExpression = ["object", "property"];
types.ObjectExpression = ["properties"];
types.Property = ["key", "value"];
types.ThrowStatement = types.UnaryExpression = types.UpdateExpression = types.ReturnStatement = ["argument"];
types.SequenceExpression = ["expressions"];
types.SwitchStatement = ["discriminant", "cases"];
types.SwitchCase = ["consequent"];
types.TryStatement = ["block", "handler", "finalizer"];
types.VariableDeclaration = ["declarations"];
types.VariableDeclarator = ["id", "init"];
types.WhileStatement = ["test", "body"];
types.WithStatement = ["object", "body"];

// ignore
types.DebuggerStatement = types.EmptyStatement = types.Identifier = types.Literal = types.ThisExpression = [];

// es6
types.SpreadElement = types.YieldExpression = ["argument"];
types.ArrowFunctionExpression = types.FunctionExpression;
types.TemplateLiteral = ["quasis", "expressions"];
types.TaggedTemplateExpression = ["tag", "quasi"];
types.TemplateElement = [];
types.AssignmentProperty = ["value"];
types.ObjectPattern = ["properties"];
types.ArrayPattern = ["elements"];
types.RestElement = ["argument"];
types.AssignmentPattern = ["left", "right"];
types.ClassExpression = types.ClassDeclaration = ["id", "superClass", "body"];
types.ClassBody = ["body"];
types.MethodDefinition = ["key", "value"];
types.MetaProperty = ["meta", "property"];
types.Super = [];
types.ExportDefaultDeclaration = ["declaration"];
types.ExportNamedDeclaration = ["declaration", "specifiers", "source"];
types.ExportSpecifier = ["exported", "local"];
types.ExportAllDeclaration = ["source"];
types.ImportDeclaration = ["specifiers", "source"];
types.ImportSpecifier = ["imported", "local"];
types.ImportDefaultSpecifier = ["local"];
types.ImportNamespaceSpecifier = ["local"];