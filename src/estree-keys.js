const keys = {};
keys.ArrayExpression = ["elements"];
keys.AssignmentExpression = ["right", "left"];
keys.BinaryExpression = keys.LogicalExpression = ["left", "right"];
keys.BlockStatement = keys.Program = ["body"];
keys.BreakStatement = keys.ContinueStatement = ["label"];
keys.CallExpression = keys.NewExpression = ["callee", "arguments"];
keys.CatchClause = ["param", "body"];
keys.ConditionalExpression = keys.IfStatement = ["test", "consequent", "alternate"];
keys.DoWhileStatement = ["body", "test"];
keys.ExpressionStatement = ["expression"];
keys.ForStatement = ["init", "test", "body", "update"];
keys.ForInStatement = ["right", "left", "body"];
keys.FunctionDeclaration = keys.FunctionExpression = ["id", "params", "body"];
keys.LabeledStatement = ["label", "body"];
keys.MemberExpression = ["object", "property"];
keys.ObjectExpression = ["properties"];
keys.Property = ["key", "value"];
keys.ThrowStatement = keys.UnaryExpression = keys.UpdateExpression = keys.ReturnStatement = ["argument"];
keys.SequenceExpression = ["expressions"];
keys.SwitchStatement = ["discriminant", "cases"];
keys.SwitchCase = ["consequent"];
keys.TryStatement = ["block", "handler", "finalizer"];
keys.VariableDeclaration = ["declarations"];
keys.VariableDeclarator = ["id", "init"];
keys.WhileStatement = ["test", "body"];
keys.WithStatement = ["object", "body"];

// ignore
keys.DebuggerStatement = keys.EmptyStatement = keys.Identifier = keys.Literal = keys.ThisExpression = [];

export default keys;