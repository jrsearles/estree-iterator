"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.walk = walk;
exports.iterate = iterate;
exports.filter = filter;

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

require("babel-runtime");

var _traversalContext = require("./traversal-context");

var _walk = require("./walk");

var _visitors = require("./visitors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [iterate, filter].map(_regeneratorRuntime.mark);

function makeVisitor(keys) {
	return _regenerator2.default.mark(function visitor(node, state, w) {
		var i, ln, key;
		return _regenerator2.default.wrap(function visitor$(_context) {
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

function wrapVisitors(visitors, baseVisitors) {
	var wrappedVisitors = (0, _assign2.default)({}, baseVisitors);

	(0, _keys2.default)(visitors).forEach(function (key) {
		if (visitors[key] === false) {
			wrappedVisitors[key] = false;
			return;
		}

		if (Array.isArray(visitors[key])) {
			wrappedVisitors[key] = makeVisitor(visitors[key]);
			return;
		}

		var baseVisitor = baseVisitors[key];

		wrappedVisitors[key] = _regenerator2.default.mark(function _callee() {
			var result,
			    _args2 = arguments;
			return _regenerator2.default.wrap(function _callee$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return visitors[key].apply(visitors, _args2);

						case 2:
							result = _context2.sent;

							if (!(result !== false && baseVisitor)) {
								_context2.next = 5;
								break;
							}

							return _context2.delegateYield(baseVisitor.apply(undefined, _args2), "t0", 5);

						case 5:
						case "end":
							return _context2.stop();
					}
				}
			}, _callee, this);
		});
	});

	return wrappedVisitors;
}

function walk(node, visitors, state) {
	var wrappedVisitors = wrapVisitors(visitors, _visitors.defaultVisitors);
	var it = (0, _walk.walk)(wrappedVisitors, new _traversalContext.TraversalContext(node), state);
	var done = false;
	var value = undefined;

	do {
		var _it$next = it.next(value);

		done = _it$next.done;
		value = _it$next.value;
	} while (!done);
}

function iterate(node) {
	var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, current;

	return regeneratorRuntime.wrap(function iterate$(_context3) {
		while (1) switch (_context3.prev = _context3.next) {
			case 0:
				_iteratorNormalCompletion = true;
				_didIteratorError = false;
				_iteratorError = undefined;
				_context3.prev = 3;
				_iterator = (0, _getIterator3.default)((0, _walk.walk)(_visitors.defaultVisitors, new _traversalContext.TraversalContext(node)));

			case 5:
				if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
					_context3.next = 12;
					break;
				}

				current = _step.value;
				_context3.next = 9;
				return current;

			case 9:
				_iteratorNormalCompletion = true;
				_context3.next = 5;
				break;

			case 12:
				_context3.next = 18;
				break;

			case 14:
				_context3.prev = 14;
				_context3.t0 = _context3["catch"](3);
				_didIteratorError = true;
				_iteratorError = _context3.t0;

			case 18:
				_context3.prev = 18;
				_context3.prev = 19;

				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}

			case 21:
				_context3.prev = 21;

				if (!_didIteratorError) {
					_context3.next = 24;
					break;
				}

				throw _iteratorError;

			case 24:
				return _context3.finish(21);

			case 25:
				return _context3.finish(18);

			case 26:
			case "end":
				return _context3.stop();
		}
	}, _marked[0], this, [[3, 14, 18, 26], [19,, 21, 25]]);
}

function filter(node, filters) {
	var hash, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, current;

	return regeneratorRuntime.wrap(function filter$(_context4) {
		while (1) switch (_context4.prev = _context4.next) {
			case 0:
				hash = undefined;

				if (filters && Array.isArray(filters)) {
					hash = (0, _create2.default)(null);
					filters.forEach(function (type) {
						return hash[type] = true;
					});
				}

				_iteratorNormalCompletion2 = true;
				_didIteratorError2 = false;
				_iteratorError2 = undefined;
				_context4.prev = 5;
				_iterator2 = (0, _getIterator3.default)((0, _walk.walk)(_visitors.defaultVisitors, new _traversalContext.TraversalContext(node)));

			case 7:
				if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
					_context4.next = 15;
					break;
				}

				current = _step2.value;

				if (!(!hash || hash[current.type])) {
					_context4.next = 12;
					break;
				}

				_context4.next = 12;
				return current;

			case 12:
				_iteratorNormalCompletion2 = true;
				_context4.next = 7;
				break;

			case 15:
				_context4.next = 21;
				break;

			case 17:
				_context4.prev = 17;
				_context4.t0 = _context4["catch"](5);
				_didIteratorError2 = true;
				_iteratorError2 = _context4.t0;

			case 21:
				_context4.prev = 21;
				_context4.prev = 22;

				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}

			case 24:
				_context4.prev = 24;

				if (!_didIteratorError2) {
					_context4.next = 27;
					break;
				}

				throw _iteratorError2;

			case 27:
				return _context4.finish(24);

			case 28:
				return _context4.finish(21);

			case 29:
			case "end":
				return _context4.stop();
		}
	}, _marked[1], this, [[5, 17, 21, 29], [22,, 24, 28]]);
}