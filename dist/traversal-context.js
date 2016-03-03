"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

exports.TraversalContext = TraversalContext;

var _types = require("./types");

var _interfaces = require("./interfaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_getDirectives].map(_regenerator2.default.mark);

function isNode(obj) {
  return obj && (typeof obj === "undefined" ? "undefined" : (0, _typeof3.default)(obj)) === "object" && typeof obj.type === "string";
}

function assignChild(value, parent, rules) {
  if (value) {
    if (isNode(value)) {
      return new TraversalContext(value, parent, rules);
    }

    if (Array.isArray(value)) {
      return value.map(function (node) {
        return assignChild(node, parent, rules);
      });
    }
  }

  return value;
}

function isDirective(node) {
  return node.type === "ExpressionStatement" && node.expression.type === "Literal" && typeof node.expression.value === "string";
}

function _getDirectives(body) {
  var i, length, expr, value;
  return _regenerator2.default.wrap(function getDirectives$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!body.body) {
            _context.next = 2;
            break;
          }

          return _context.delegateYield(_getDirectives(body.body), "t0", 2);

        case 2:
          if (!Array.isArray(body)) {
            _context.next = 12;
            break;
          }

          i = 0, length = body.length;

        case 4:
          if (!(i < length && isDirective(body[i]))) {
            _context.next = 12;
            break;
          }

          expr = body[i++].expression;
          value = expr.value;


          if (expr.raw) {
            // remove quotes
            value = expr.raw.substr(1, expr.raw.length - 2);
          }

          _context.next = 10;
          return value;

        case 10:
          _context.next = 4;
          break;

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function TraversalContext(node, parent, rules) {
  if (node instanceof TraversalContext) {
    return node;
  }

  this._node = node;
  this._parent = parent;

  this.type = node.type;
  this.init(rules);
}

var proto = TraversalContext.prototype = {
  constructor: TraversalContext,

  init: function init(rules) {
    var _this = this;

    this._bindings = [];

    var currentScope = this._parent ? this._parent.scopeParent : this;
    var currentBlock = this._parent ? this._parent.blockParent : this;

    if (this.isDeclarator()) {
      if (this.isBlockScope()) {
        currentBlock._bindings.push(this);
      } else {
        currentScope._bindings.push(this);
      }
    }

    if (this.isScope()) {
      this.scopeParent = this.blockParent = this;
    } else if (this.isBlock()) {
      this.scopeParent = currentScope;
      this.blockParent = this;
    } else {
      this.scopeParent = currentScope;
      this.blockParent = currentBlock;
    }

    (0, _keys2.default)(this._node).forEach(function (key) {
      return _this[key] = assignChild(_this._node[key], _this, rules);
    });
    rules(this);
  },
  is: function is(type) {
    if (type === this.type) {
      return true;
    }

    var key = "is" + type;
    if (typeof this[key] === "function") {
      return this[key]();
    }

    return false;
  },
  has: function has(key) {
    return this._node[key] != null;
  },
  getDirectives: function getDirectives() {
    if (!this._directives) {
      this._directives = [];
      var it = _getDirectives(this._node.body);
      var done = undefined,
          _value = undefined;

      do {
        var _it$next = it.next();

        done = _it$next.done;
        _value = _it$next.value;

        if (!done && _value) {
          this._directives.push(_value);
        }
      } while (!done);
    }

    return this._directives;
  },
  getBindings: function getBindings() {
    return this._bindings || [];
  },
  hasBindings: function hasBindings() {
    return this.getBindings().length > 0;
  },
  getParent: function getParent() {
    return this._parent;
  },
  isBlockScope: function isBlockScope() {
    return this.isLet() || this.isConst() || this.isClassDeclaration();
  },
  isStrict: function isStrict() {
    if ("_strict" in this) {
      return this._strict;
    }

    if (this.isScope()) {
      var directives = this.getDirectives();
      var strict = directives.some(function (d) {
        return d === "use strict";
      });

      if (strict || this.isProgram()) {
        return this._strict = strict;
      }

      return this.getParent().isStrict();
    }

    return this.scopeParent.isStrict();
  }
};

// add helper methods
(0, _keys2.default)(_interfaces.interfaces).forEach(function (key) {
  proto["is" + key] = typeof _interfaces.interfaces[key] === "function" ? _interfaces.interfaces[key] : function () {
    return _interfaces.interfaces[key].indexOf(this.type) >= 0;
  };
});

(0, _keys2.default)(_types.types).forEach(function (key) {
  proto["is" + key] = function () {
    return this.type === key;
  };
});

["Var", "Const", "Let"].forEach(function (key) {
  var lowerCaseKey = key.toLowerCase();
  proto["is" + key] = function () {
    return this._parent._node.kind === lowerCaseKey;
  };
});