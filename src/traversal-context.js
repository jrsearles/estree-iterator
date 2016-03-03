import {types} from "./types";
import {interfaces} from "./interfaces";

function isNode (obj) {
	return obj && typeof obj === "object" && typeof obj.type === "string";
}

function assignChild (value, context) {
	if (value) {
		if (isNode(value)) {
			return new TraversalContext(value, context);
		}
		
		if (Array.isArray(value)) {
			return value.map(node => assignChild(node, context));
		}
	}
	
	return value;
}

function* getDirectives (body) {
	if (body.body) {
		yield* getDirectives(body.body);
	}
	
	if (Array.isArray(body)) {	
		let i = 0, length = body.length;
		while (i < length && body[i].isDirective()) {
			yield body[i++].expression.value;
		}
	}
}

export class TraversalContext {
	constructor (node, parent) {
		this._node = node;
		this._parent = parent;
	
		this.type = node.type;
		this.init();
	}
	
	init () {
		if (this._initialized) {
			return;
		}
		
		this.bindings = [];
		
		let currentScope = this._parent ? this._parent.scopeParent : this;
		let currentBlock = this._parent ? this._parent.blockParent : this;
		
		if (this.isDeclarator()) {
			currentScope.bindings.push(this);
			
			if (this.isBlockScope() && currentScope !== currentBlock) {
				currentBlock.bindings.push(this);
			}
		}
		
		if (this.isFunction() || this.isProgram()) {
			this.scopeParent = this.blockParent = this;
		} else if (this.isBlock()) {
			this.scopeParent = currentScope;
			this.blockParent = this;
		} else {
			this.scopeParent = currentScope;
			this.blockParent = currentBlock;
		}
		
		Object.keys(this._node).forEach(key => this[key] = assignChild(this._node[key], this));	
		this._initialized = true;
	}
	
	is (type) {
		if (type === this.type) {
			return true;
		}
		
		let key = `is${type}`;
		if (typeof this[key] === "function") {
			return this[key]();
		}
		
		return false;
	}
	
	has (key) {
		return this._node[key] != null;
	}
	
	getDirectives () {
		if (!this.directives) {
			this.directives = [];
			var it = getDirectives(this.body);
			var done, value;
			
			do {
				({done, value} = it.next());
				if (!done && value) {
					this.directives.push(value);
				}
			} while(!done);	
		}
		
		return this.directives;
	}
};

// add helper methods
Object.keys(interfaces).forEach(key => {
	TraversalContext.prototype[`is${key}`] = typeof interfaces[key] === "function" ? interfaces[key] : function () {
		return interfaces[key].indexOf(this.type) >= 0;
	};
});

Object.keys(types).forEach(key => {
	TraversalContext.prototype[`is${key}`] = function () {
		return this.type === key;
	};
});

["Var", "Const", "Let"].forEach(key => {
	const lowerCaseKey = key.toLowerCase();
	TraversalContext.prototype[`is${key}`] = function () {
		return this._parent._node.kind === lowerCaseKey;
	};
});

TraversalContext.prototype.isBlockScope = function () {
	return this.isLet() || this.isConst();
};