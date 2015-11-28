const kinds = {
	"Block": ["BlockStatement", "Program", "IfStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "LabeledStatement", "WhileStatement", "WithStatement"],
	"Function": ["FunctionExpression", "FunctionDeclaration"],
	"Program": ["Program"]
};

function isDirective (node) {
	return node.type === "ExpressionStatement"
		&& node.expression.type === "Literal"
		&& typeof node.expression.value === "string";
}

export function TraversalContext (node, parent) {
	this.node = node;
	this.parent = parent;
	
	this.type = node.type;
}

Object.keys(kinds).forEach(key => {
	TraversalContext.prototype["is" + key] = function () {
		return kinds[key].indexOf(this.node.type) >= 0;
	};
});

TraversalContext.prototype.has = function (key) {
	return this.node[key] != null;
};

TraversalContext.prototype.makeChild = function (child) {
	if (typeof child === "string") {
		return this.makeChild(this.node[child]);
	}
	
	if (Array.isArray(child)) {
		return child.map(this.makeChild);
	}
	
	return new TraversalContext(child, this);
};

TraversalContext.prototype.getDirectives = function () {
	let directives = [];
	
	if (this.isFunction() || this.isProgram()) {
		let i = 0;
		let length = this.node.body.length;
		
		while (i < length) {
			let current = this.node.body[i++];
			if (!isDirective(current)) {
				break;
			}

			directives.push(current.expression.value);
		}
	}
	
	return directives;
};
