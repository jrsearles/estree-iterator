"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var interfaces = exports.interfaces = {
	"Block": ["BlockStatement", "Program", "IfStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "LabeledStatement", "WhileStatement", "WithStatement"],
	"Function": ["FunctionExpression", "FunctionDeclaration", "ArrowFunctionExpression"],
	"Declaration": ["FunctionDeclaration", "VariableDeclaration"],
	"Statement": ["ExpressionStatement", "BlockStatement", "EmptyStatement", "DebuggerStatement", "WithStatement", "ReturnStatement", "LabeledStatement", "BreakStatement", "ContinueStatement", "IfStatement", "SwitchStatement", "SwitchCase"],
	"Loop": ["WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement	"],
	"Expression": ["ThisExpression", "ArrayExpression", "ObjectExpression", "Property", "FunctionExpression", "UnaryExpression", "UpdateExpression", "BinaryExpression", "AssignmentExpression", "LogicalExpression", "MemberExpression", "ConditionalExpression", "CallExpression", "NewExpression", "SequenceExpression", "TemplateLiteral", "TaggedTemplateExpression"],
	"Directive": function Directive() {
		return this.type === "ExpressionStatement" && this.expression.type === "Literal" && typeof this.expression.value === "string";
	}
};