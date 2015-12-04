"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TraversalContext = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _types = require("./types");

var _interfaces = require("./interfaces");

var _binding = require("./binding");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isNode(obj) {
	return obj && (typeof obj === "undefined" ? "undefined" : (0, _typeof3.default)(obj)) === "object" && typeof obj.type === "string";
}

function assignChild(value, context) {
	if (value) {
		if (isNode(value)) {
			return new TraversalContext(value, context);
		}

		if (Array.isArray(value)) {
			return value.map(function (node) {
				return assignChild(node, context);
			});
		}
	}

	return value;
}

var initers = {};
initers["Program"] = initers["Function"] = {
	enter: function enter() {
		this.scopeParent = this.blockParent = this;
		this.bindings = [];
		this.directives = [];
	},

	exit: function exit() {
		var i = 0;
		var body = this.body.body || this.body;
		var length = body.length;

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
		this._parent.scopeParent.bindings.push(new _binding.Binding(this, this._node.id));
	}
};

initers["VariableDeclarator"] = {
	exit: function exit() {
		var binding = new _binding.Binding(this, this._node.id, this._parent._node.kind);

		if (binding.isBlockScope()) {
			this.blockParent.bindings.push(binding);
		} else {
			this.scopeParent.bindings.push(binding);
		}
	}
};

var initKeys = (0, _keys2.default)(initers);

var TraversalContext = exports.TraversalContext = (function () {
	function TraversalContext(node, parent) {
		(0, _classCallCheck3.default)(this, TraversalContext);

		this._node = node;
		this._parent = parent;

		this.type = node.type;
		this.init();
	}

	(0, _createClass3.default)(TraversalContext, [{
		key: "init",
		value: function init() {
			var _this = this;

			if (this._initialized) {
				return;
			}

			if (this._parent) {
				this.scopeParent = this._parent.scopeParent;
				this.blockParent = this._parent.blockParent;
			}

			initKeys.forEach(function (key) {
				if (_this.is(key)) {
					var initer = initers[key].enter || initers[key];
					if (typeof initer === "function") {
						initer.call(_this);
					}
				}
			});

			(0, _keys2.default)(this._node).forEach(function (key) {
				return _this[key] = assignChild(_this._node[key], _this);
			});

			initKeys.forEach(function (key) {
				if (initers[key].exit && _this.is(key)) {
					initers[key].exit.call(_this);
				}
			});

			this._initialized = true;
		}
	}, {
		key: "is",
		value: function is(type) {
			if (type === this.type) {
				return true;
			}

			var key = "is" + type;
			if (typeof this[key] === "function") {
				return this[key]();
			}

			return false;
		}
	}, {
		key: "has",
		value: function has(key) {
			return this._node[key] != null;
		}
	}, {
		key: "hasBindings",
		value: function hasBindings() {
			return this.bindings && this.bindings.length > 0;
		}
	}]);
	return TraversalContext;
})();

;

// add helper methods
(0, _keys2.default)(_interfaces.interfaces).forEach(function (key) {
	TraversalContext.prototype["is" + key] = typeof _interfaces.interfaces[key] === "function" ? _interfaces.interfaces[key] : function () {
		return _interfaces.interfaces[key].indexOf(this.type) >= 0;
	};
});

(0, _keys2.default)(_types.types).forEach(function (key) {
	TraversalContext.prototype["is" + key] = function () {
		return this.type === key;
	};
});