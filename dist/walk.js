"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.walk = walk;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _visitors = require("./visitors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [walk].map(_regenerator2.default.mark);

function walk(visitors, node, state, w) {
	var i, ln, visitor;
	return regeneratorRuntime.wrap(function walk$(_context) {
		while (1) switch (_context.prev = _context.next) {
			case 0:
				// create a bound walk function to pass to visitors so they can continue walking their child nodes
				w = w || walk.bind(null, visitors);

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

				return _context.delegateYield(walk(visitors, node[i], state, w), "t0", 5);

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