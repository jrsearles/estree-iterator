"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EstreeIterator = undefined;

var _traversalContext = require("./traversal-context");

var _estreeKeys = require("./estree-keys");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _marked = [_walk, defaultVisitor].map(regeneratorRuntime.mark);

function _walk(visitors, node, state, w) {
	var i, ln, visitor;
	return regeneratorRuntime.wrap(function walk$(_context) {
		while (1) switch (_context.prev = _context.next) {
			case 0:
				// create a bound walk function to pass to visitors so they can continue walking their child nodes
				w = w || _walk.bind(null, visitors);

				if (!Array.isArray(node)) {
					_context.next = 10;
					break;
				}

				i = 0, ln = node.length;

			case 3:
				if (!(i < ln)) {
					_context.next = 8;
					break;
				}

				return _context.delegateYield(_walk(visitors, node[i], state, w), "t0", 5);

			case 5:
				i++;
				_context.next = 3;
				break;

			case 8:
				_context.next = 14;
				break;

			case 10:
				if (!node) {
					_context.next = 14;
					break;
				}

				visitor = visitors[node.type];

				if (!(typeof visitor === "function")) {
					_context.next = 14;
					break;
				}

				return _context.delegateYield(visitor(node, state, w), "t1", 14);

			case 14:
			case "end":
				return _context.stop();
		}
	}, _marked[0], this);
}

function makeVisitor(keys) {
	return regeneratorRuntime.mark(function visitor(node, state, w) {
		var i, ln, key;
		return regeneratorRuntime.wrap(function visitor$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return node;

					case 2:
						i = 0, ln = keys.length;

					case 3:
						if (!(i < ln)) {
							_context2.next = 10;
							break;
						}

						key = keys[i];

						if (!node.has(key)) {
							_context2.next = 7;
							break;
						}

						return _context2.delegateYield(w(node.makeChild(key), state, w), "t0", 7);

					case 7:
						i++;
						_context2.next = 3;
						break;

					case 10:
					case "end":
						return _context2.stop();
				}
			}
		}, visitor, this);
	});
}

function defaultVisitor(node, state, w) {
	var _i, _ln, _key;

	return regeneratorRuntime.wrap(function defaultVisitor$(_context3) {
		while (1) switch (_context3.prev = _context3.next) {
			case 0:
				_context3.next = 2;
				return node;

			case 2:
				if (!(node.type in _estreeKeys.keys)) {
					_context3.next = 11;
					break;
				}

				_i = 0, _ln = _estreeKeys.keys[node.type].length;

			case 4:
				if (!(_i < _ln)) {
					_context3.next = 11;
					break;
				}

				_key = _estreeKeys.keys[node.type][_i];

				if (!node.has(_key)) {
					_context3.next = 8;
					break;
				}

				return _context3.delegateYield(w(node.makeChild(_key), state, w), "t0", 8);

			case 8:
				_i++;
				_context3.next = 4;
				break;

			case 11:
			case "end":
				return _context3.stop();
		}
	}, _marked[1], this);
}

function extendVisitors(visitors) {
	Object.keys(visitors).forEach(function (key) {
		var visitor = visitors[key];

		if (Array.isArray(visitor)) {
			visitors[key] = makeVisitor(visitor);
		} else if (visitors[key] === true) {
			visitors[key] = defaultVisitor;
		}
	});

	return visitors;
}

// make default visitor
// function* defaultVisitor (node, parent, state, w) {
// 	yield node;

// 	for (let i = 0, ln = keys[node.type]; i < ln; i++) {
// 		let childKey = keys[node.type][i];
// 		let child = node[childKey];

// 		if (child) {
// 			yield* w(child, node, state);
// 		}
// 	}
// }

var defaultVisitors = {};
Object.keys(_estreeKeys.keys).forEach(function (key) {
	return defaultVisitors[key] = defaultVisitor;
});

function wrapVisitors(visitors, baseVisitors) {
	var wrappedVisitors = Object.assign({}, baseVisitors);

	Object.keys(visitors).forEach(function (key) {
		if (visitors[key] === false) {
			wrappedVisitors[key] = false;
			return;
		}

		if (Array.isArray(visitors[key])) {
			wrappedVisitors[key] = makeVisitor(visitors[key]);
			return;
		}

		var baseVisitor = baseVisitors[key];

		wrappedVisitors[key] = regeneratorRuntime.mark(function _callee() {
			var result,
			    _args4 = arguments;
			return regeneratorRuntime.wrap(function _callee$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							_context4.next = 2;
							return visitors[key].apply(visitors, _args4);

						case 2:
							result = _context4.sent;

							if (!(result !== false && baseVisitor)) {
								_context4.next = 5;
								break;
							}

							return _context4.delegateYield(baseVisitor.apply(undefined, _args4), "t0", 5);

						case 5:
						case "end":
							return _context4.stop();
					}
				}
			}, _callee, this);
		});
	});

	return wrappedVisitors;
}

var EstreeIterator = exports.EstreeIterator = (function () {
	function EstreeIterator(node, visitors, state) {
		_classCallCheck(this, EstreeIterator);

		this.root = node;
		this.visitors = visitors;
		this.state = state;
	}

	_createClass(EstreeIterator, [{
		key: Symbol.iterator,
		value: function value() {
			return _walk(this.visitors, this.root, null, this.state);
		}
	}], [{
		key: "create",
		value: function create(node, visitors, state) {
			return new EstreeIterator(node, visitors || defaultVisitors, state);
		}
	}, {
		key: "walk",
		value: function walk(node, visitors, state) {
			var wrappedVisitors = wrapVisitors(visitors, defaultVisitors);
			var it = _walk(wrappedVisitors, new _traversalContext.TraversalContext(node), state);
			var done = false;
			var value = undefined;

			do {
				var _it$next = it.next(value);

				done = _it$next.done;
				value = _it$next.value;
			} while (!done);
		}
	}, {
		key: "extend",
		value: function extend(node, visitors, state) {
			var merged = Object.assign({}, _estreeKeys.keys, visitors);
			return EstreeIterator.create(node, extendVisitors(merged), state);
		}
	}]);

	return EstreeIterator;
})();

;