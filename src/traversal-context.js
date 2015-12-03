import {types} from "./types";
import {interfaces} from "./interfaces";
import {Binding} from "./binding";

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

const initers = {};
initers["Program"] = initers["Function"] = {
	enter: function () {
		this.scopeParent = this.blockParent = this;
		this.bindings = [];
		this.directives = [];
	},
	
	exit: function () {
		let i = 0;
		let body = this.body.body || this.body;
		let length = body.length;
		
		while (i < length && body[i].isDirective()) {
			this.directives.push(body[i++].expression.value);
		}
	}
};

initers["Block"] = function () {
	this.blockParent = this;
	this.bindings = [];
};

initers["FunctionDeclaration"] = function () {
	if (this._node.id) {
		this._parent.scopeParent.bindings.push(new Binding(this, this._node.id));
	}
};

initers["VariableDeclarator"] = {
	exit: function () {
		let binding = new Binding(this, this._node.id, this._parent._node.kind);

		if (binding.isBlockScope()) {
			this.blockParent.bindings.push(binding);
		}
		else {
			this.scopeParent.bindings.push(binding);
		}
	}
};

let initKeys = Object.keys(initers);

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
		
		if (this._parent) {
			this.scopeParent = this._parent.scopeParent;
			this.blockParent = this._parent.blockParent;
		}
	
		initKeys.forEach(key => {
			if (this.is(key)) {
				let initer = initers[key].enter || initers[key];
				if (typeof initer === "function") {
					initer.call(this)
				}
			}
		});
		
		Object.keys(this._node).forEach(key => this[key] = assignChild(this._node[key], this));
		
		initKeys.forEach(key => {
			if (initers[key].exit && this.is(key)) {
				initers[key].exit.call(this);
			}
		});
		
		this._initialized = true;
	}
	
	is (type) {
		if (type === this.type) {
			return true;
		}
		
		let key = "is" + type;
		if (typeof this[key] === "function") {
			return this[key]();
		}
		
		return false;
	}
	
	has (key) {
		return this._node[key] != null;
	}
	
	hasBindings () {
		return this.bindings && this.bindings.length > 0;
	}
};

// add helper methods
Object.keys(interfaces).forEach(key => {
	TraversalContext.prototype["is" + key] = typeof interfaces[key] === "function" ? interfaces[key] : function () {
		return interfaces[key].indexOf(this.type) >= 0;
	};
});

Object.keys(types).forEach(key => {
	TraversalContext.prototype["is" + key] = function () {
		return this.type === key;
	};
});
