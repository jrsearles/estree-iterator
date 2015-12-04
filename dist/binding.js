"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Binding = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Binding = exports.Binding = (function () {
	function Binding(node, id, kind) {
		(0, _classCallCheck3.default)(this, Binding);

		this.node = node;
		this.id = id;
		this.kind = kind;
	}

	(0, _createClass3.default)(Binding, [{
		key: "isBlockScope",
		value: function isBlockScope() {
			return this.isLet() || this.isConst();
		}
	}, {
		key: "isLet",
		value: function isLet() {
			return this.kind === "let";
		}
	}, {
		key: "isConst",
		value: function isConst() {
			return this.kind === "const";
		}
	}, {
		key: "isVar",
		value: function isVar() {
			return this.kind === "var";
		}
	}]);
	return Binding;
})();