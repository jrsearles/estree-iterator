"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendVisitors = exports.makeRules = undefined;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.walker = walker;
exports.walk = walk;
exports.step = step;
exports.iterate = iterate;

var _traversalContext = require("./traversal-context");

var _visitors = require("./visitors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [walker, iterate].map(_regenerator2.default.mark);

function walker(visitors, node, state, next) {
  var i, ln, visitor;
  return _regenerator2.default.wrap(function walker$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // create a bound walk function to pass to visitors so they can continue walking their child nodes
          next = next || walker.bind(null, visitors);

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

          return _context.delegateYield(next(node[i], state, next), "t0", 5);

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

          return _context.delegateYield(visitor(node, state, next), "t1", 14);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function walk(node, visitors, state) {
  var it = walker(visitors, new _traversalContext.TraversalContext(node), state);
  var done = false;
  var value = undefined;

  do {
    var _it$next = it.next(value);

    done = _it$next.done;
    value = _it$next.value;
  } while (!done);
}

function step(root, visitors, state, rules) {
  var r = (0, _visitors.makeRules)(rules);
  var node = new _traversalContext.TraversalContext(root, null, function (n) {
    return r(n, state);
  });

  function next(current, arg) {
    if (typeof visitors[current.type] === "function") {
      return visitors[current.type](current, arg, next);
    }
  };

  return next(node, state);
}

function iterate(node, filters) {
  var hash, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, current;

  return _regenerator2.default.wrap(function iterate$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          hash = undefined;

          if (filters && Array.isArray(filters)) {
            hash = (0, _create2.default)(null);
            filters.forEach(function (type) {
              return hash[type] = true;
            });
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 5;
          _iterator = (0, _getIterator3.default)(walker(_visitors.defaultVisitors, new _traversalContext.TraversalContext(node)));

        case 7:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 15;
            break;
          }

          current = _step.value;

          if (!(!hash || hash[current.type])) {
            _context2.next = 12;
            break;
          }

          _context2.next = 12;
          return current;

        case 12:
          _iteratorNormalCompletion = true;
          _context2.next = 7;
          break;

        case 15:
          _context2.next = 21;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 21:
          _context2.prev = 21;
          _context2.prev = 22;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 24:
          _context2.prev = 24;

          if (!_didIteratorError) {
            _context2.next = 27;
            break;
          }

          throw _iteratorError;

        case 27:
          return _context2.finish(24);

        case 28:
          return _context2.finish(21);

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked[1], this, [[5, 17, 21, 29], [22,, 24, 28]]);
}

exports.makeRules = _visitors.makeRules;
exports.extendVisitors = _visitors.extendVisitors;