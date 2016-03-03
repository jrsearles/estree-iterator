"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultVisitors = undefined;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.defaultVisitor = defaultVisitor;
exports.extendVisitors = extendVisitors;
exports.makeRules = makeRules;

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [defaultVisitor].map(_regenerator2.default.mark);

var noop = function noop() {};

function makeVisitorFromKeys(keys) {
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

function defaultVisitor(node, state, w) {
  var _i, _ln, _key;

  return _regenerator2.default.wrap(function defaultVisitor$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
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
    }
  }, _marked[0], this);
}

var defaultVisitors = exports.defaultVisitors = {};
(0, _keys2.default)(_types.types).forEach(function (key) {
  return defaultVisitors[key] = makeVisitorFromKeys(_types.types[key]);
});

function extendVisitors(visitors) {
  if (!visitors) {
    return defaultVisitors;
  }

  var target = (0, _assign2.default)({}, defaultVisitors);

  (0, _keys2.default)(visitors).forEach(function (key) {
    // skip false values using noop
    var current = visitors[key] || noop;

    // keep default visitor
    if (current === true) {
      return;
    }

    if (Array.isArray(current)) {
      current = makeVisitorFromKeys(current);
    }

    target[key] = current;
  });

  return target;
}

function makeRules(rules) {
  if (!rules) {
    return noop;
  }

  if (typeof rules === "function") {
    return rules;
  }

  var keys = (0, _keys2.default)(rules);

  return function (node, state) {
    keys.forEach(function (key) {
      if (node.is(key)) {
        rules[key](node, state);
      }
    });
  };
}