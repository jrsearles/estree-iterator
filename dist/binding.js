"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Binding = exports.Binding = (function () {
	function Binding(node, id, kind) {
		_classCallCheck(this, Binding);

		this.node = node;
		this.id = id;
		this.kind = kind;
	}

	_createClass(Binding, [{
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