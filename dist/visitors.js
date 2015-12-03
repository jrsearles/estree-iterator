"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.defaultVisitors = undefined;
exports.defaultVisitor = defaultVisitor;
exports.extendVisitors = extendVisitors;

var _types = require("./types");

var _marked = [defaultVisitor].map(regeneratorRuntime.mark);

function makeVisitor(keys) {
	return regeneratorRuntime.mark(function visitor(node, state, w) {
		var i, ln, key;
		return regeneratorRuntime.wrap(function visitor$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return node;

					case 2:
						i = 0, ln = keys.length;

					case 3:
						if (!(i < ln)) {
							_context.next = 10;
							break;
						}

						key = keys[i];

						if (!node.has(key)) {
							_context.next = 7;
							break;
						}

						return _context.delegateYield(w(node[key], state, w), "t0", 7);

					case 7:
						i++;
						_context.next = 3;
						break;

					case 10:
					case "end":
						return _context.stop();
				}
			}
		}, visitor, this);
	});
}

function defaultVisitor(node, state, w) {
	var _i, _ln, _key;

	return regeneratorRuntime.wrap(function defaultVisitor$(_context2) {
		while (1) switch (_context2.prev = _context2.next) {
			case 0:
				_context2.next = 2;
				return node;

			case 2:
				if (!(node.type in _types.types)) {
					_context2.next = 11;
					break;
				}

				_i = 0, _ln = _types.types[node.type].length;

			case 4:
				if (!(_i < _ln)) {
					_context2.next = 11;
					break;
				}

				_key = _types.types[node.type][_i];

				if (!node.has(_key)) {
					_context2.next = 8;
					break;
				}

				return _context2.delegateYield(w(node[_key], state, w), "t0", 8);

			case 8:
				_i++;
				_context2.next = 4;
				break;

			case 11:
			case "end":
				return _context2.stop();
		}
	}, _marked[0], this);
}

var defaultVisitors = exports.defaultVisitors = {};
Object.keys(_types.types).forEach(function (key) {
	return defaultVisitors[key] = makeVisitor(_types.types[key]);
});

function extendVisitors(visitors, baseVisitors) {
	var wrappedVisitors = Object.assign({}, baseVisitors || defaultVisitors);

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
			    _args3 = arguments;
			return regeneratorRuntime.wrap(function _callee$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							_context3.next = 2;
							return visitors[key].apply(visitors, _args3);

						case 2:
							result = _context3.sent;

							if (!(result !== false && baseVisitor)) {
								_context3.next = 5;
								break;
							}

							return _context3.delegateYield(baseVisitor.apply(undefined, _args3), "t0", 5);

						case 5:
						case "end":
							return _context3.stop();
					}
				}
			}, _callee, this);
		});
	});

	return wrappedVisitors;
}