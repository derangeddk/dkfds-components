(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DKFDS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * array-foreach
 *   Array#forEach ponyfill for older browsers
 *   (Ponyfill: A polyfill that doesn't overwrite the native method)
 * 
 * https://github.com/twada/array-foreach
 *
 * Copyright (c) 2015-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/array-foreach/blob/master/MIT-LICENSE
 */
'use strict';

module.exports = function forEach(ary, callback, thisArg) {
  if (ary.forEach) {
    ary.forEach(callback, thisArg);
    return;
  }
  for (var i = 0; i < ary.length; i += 1) {
    callback.call(thisArg, ary[i], i, ary);
  }
};

},{}],2:[function(require,module,exports){
"use strict";

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in window.self) {
  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {
    (function (view) {
      "use strict";

      if (!('Element' in view)) return;
      var classListProp = "classList",
        protoProp = "prototype",
        elemCtrProto = view.Element[protoProp],
        objCtr = Object,
        strTrim = String[protoProp].trim || function () {
          return this.replace(/^\s+|\s+$/g, "");
        },
        arrIndexOf = Array[protoProp].indexOf || function (item) {
          var i = 0,
            len = this.length;
          for (; i < len; i++) {
            if (i in this && this[i] === item) {
              return i;
            }
          }
          return -1;
        }
        // Vendors: please allow content code to instantiate DOMExceptions
        ,
        DOMEx = function DOMEx(type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        },
        checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
          if (token === "") {
            throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
          }
          if (/\s/.test(token)) {
            throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
          }
          return arrIndexOf.call(classList, token);
        },
        ClassList = function ClassList(elem) {
          var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
            i = 0,
            len = classes.length;
          for (; i < len; i++) {
            this.push(classes[i]);
          }
          this._updateClassName = function () {
            elem.setAttribute("class", this.toString());
          };
        },
        classListProto = ClassList[protoProp] = [],
        classListGetter = function classListGetter() {
          return new ClassList(this);
        };
      // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function (i) {
        return this[i] || null;
      };
      classListProto.contains = function (token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function () {
        var tokens = arguments,
          i = 0,
          l = tokens.length,
          token,
          updated = false;
        do {
          token = tokens[i] + "";
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function () {
        var tokens = arguments,
          i = 0,
          l = tokens.length,
          token,
          updated = false,
          index;
        do {
          token = tokens[i] + "";
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function (token, force) {
        token += "";
        var result = this.contains(token),
          method = result ? force !== true && "remove" : force !== false && "add";
        if (method) {
          this[method](token);
        }
        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };
      classListProto.toString = function () {
        return this.join(" ");
      };
      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter,
          enumerable: true,
          configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) {
          // IE 8 doesn't support enumerable:true
          // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
          // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
          if (ex.number === undefined || ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }
    })(window.self);
  }

  // There is full or partial native classList support, so just check if we need
  // to normalize the add/remove and toggle APIs.

  (function () {
    "use strict";

    var testElement = document.createElement("_");
    testElement.classList.add("c1", "c2");

    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    if (!testElement.classList.contains("c2")) {
      var createMethod = function createMethod(method) {
        var original = DOMTokenList.prototype[method];
        DOMTokenList.prototype[method] = function (token) {
          var i,
            len = arguments.length;
          for (i = 0; i < len; i++) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };
      createMethod('add');
      createMethod('remove');
    }
    testElement.classList.toggle("c3", false);

    // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.
    if (testElement.classList.contains("c3")) {
      var _toggle = DOMTokenList.prototype.toggle;
      DOMTokenList.prototype.toggle = function (token, force) {
        if (1 in arguments && !this.contains(token) === !force) {
          return force;
        } else {
          return _toggle.call(this, token);
        }
      };
    }
    testElement = null;
  })();
}

},{}],3:[function(require,module,exports){
"use strict";

require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":10,"../../modules/es6.array.from":58,"../../modules/es6.string.iterator":60}],4:[function(require,module,exports){
"use strict";

require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":10,"../../modules/es6.object.assign":59}],5:[function(require,module,exports){
"use strict";

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],6:[function(require,module,exports){
"use strict";

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":27}],7:[function(require,module,exports){
"use strict";

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":49,"./_to-iobject":51,"./_to-length":52}],8:[function(require,module,exports){
"use strict";

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};
module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":9,"./_wks":56}],9:[function(require,module,exports){
"use strict";

var toString = {}.toString;
module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],10:[function(require,module,exports){
"use strict";

var core = module.exports = {
  version: '2.6.12'
};
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],11:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":36,"./_property-desc":43}],12:[function(require,module,exports){
"use strict";

// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function /* ...args */
  () {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":5}],13:[function(require,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],14:[function(require,module,exports){
"use strict";

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

},{"./_fails":18}],15:[function(require,module,exports){
"use strict";

var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":20,"./_is-object":27}],16:[function(require,module,exports){
"use strict";

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],17:[function(require,module,exports){
"use strict";

var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';
var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":10,"./_ctx":12,"./_global":20,"./_hide":22,"./_redefine":44}],18:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],19:[function(require,module,exports){
"use strict";

module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":47}],20:[function(require,module,exports){
"use strict";

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],21:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],22:[function(require,module,exports){
"use strict";

var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":36,"./_property-desc":43}],23:[function(require,module,exports){
"use strict";

var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":20}],24:[function(require,module,exports){
"use strict";

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":18}],25:[function(require,module,exports){
"use strict";

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":9}],26:[function(require,module,exports){
"use strict";

// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":32,"./_wks":56}],27:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
module.exports = function (it) {
  return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
};

},{}],28:[function(require,module,exports){
"use strict";

// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":6}],29:[function(require,module,exports){
'use strict';

var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
  return this;
});
module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, {
    next: descriptor(1, next)
  });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":22,"./_object-create":35,"./_property-desc":43,"./_set-to-string-tag":45,"./_wks":56}],30:[function(require,module,exports){
'use strict';

var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';
var returnThis = function returnThis() {
  return this;
};
module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }
    return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":17,"./_hide":22,"./_iter-create":29,"./_iterators":32,"./_library":33,"./_object-gpo":39,"./_redefine":44,"./_set-to-string-tag":45,"./_wks":56}],31:[function(require,module,exports){
"use strict";

var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;
try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}
module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () {
      return {
        done: safe = true
      };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

},{"./_wks":56}],32:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],34:[function(require,module,exports){
'use strict';

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = require('./_descriptors');
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  }
  return T;
} : $assign;

},{"./_descriptors":14,"./_fails":18,"./_iobject":25,"./_object-gops":38,"./_object-keys":41,"./_object-pie":42,"./_to-object":53}],35:[function(require,module,exports){
"use strict";

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) delete _createDict[PROTOTYPE][enumBugKeys[i]];
  return _createDict();
};
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":6,"./_dom-create":15,"./_enum-bug-keys":16,"./_html":23,"./_object-dps":37,"./_shared-key":46}],36:[function(require,module,exports){
"use strict";

var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;
exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_ie8-dom-define":24,"./_to-primitive":54}],37:[function(require,module,exports){
"use strict";

var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');
module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_object-dp":36,"./_object-keys":41}],38:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],39:[function(require,module,exports){
"use strict";

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;
module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }
  return O instanceof Object ? ObjectProto : null;
};

},{"./_has":21,"./_shared-key":46,"./_to-object":53}],40:[function(require,module,exports){
"use strict";

var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');
module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":7,"./_has":21,"./_shared-key":46,"./_to-iobject":51}],41:[function(require,module,exports){
"use strict";

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');
module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":16,"./_object-keys-internal":40}],42:[function(require,module,exports){
"use strict";

exports.f = {}.propertyIsEnumerable;

},{}],43:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],44:[function(require,module,exports){
"use strict";

var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var $toString = require('./_function-to-string');
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);
require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};
(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":10,"./_function-to-string":19,"./_global":20,"./_has":21,"./_hide":22,"./_uid":55}],45:[function(require,module,exports){
"use strict";

var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');
module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
    configurable: true,
    value: tag
  });
};

},{"./_has":21,"./_object-dp":36,"./_wks":56}],46:[function(require,module,exports){
"use strict";

var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":47,"./_uid":55}],47:[function(require,module,exports){
"use strict";

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":10,"./_global":20,"./_library":33}],48:[function(require,module,exports){
"use strict";

var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":13,"./_to-integer":50}],49:[function(require,module,exports){
"use strict";

var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":50}],50:[function(require,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],51:[function(require,module,exports){
"use strict";

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":13,"./_iobject":25}],52:[function(require,module,exports){
"use strict";

// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":50}],53:[function(require,module,exports){
"use strict";

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":13}],54:[function(require,module,exports){
"use strict";

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":27}],55:[function(require,module,exports){
"use strict";

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],56:[function(require,module,exports){
"use strict";

var store = require('./_shared')('wks');
var uid = require('./_uid');
var _Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';
var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};
$exports.store = store;

},{"./_global":20,"./_shared":47,"./_uid":55}],57:[function(require,module,exports){
"use strict";

var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":8,"./_core":10,"./_iterators":32,"./_wks":56}],58:[function(require,module,exports){
'use strict';

var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./_iter-detect')(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":11,"./_ctx":12,"./_export":17,"./_is-array-iter":26,"./_iter-call":28,"./_iter-detect":31,"./_to-length":52,"./_to-object":53,"./core.get-iterator-method":57}],59:[function(require,module,exports){
"use strict";

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');
$export($export.S + $export.F, 'Object', {
  assign: require('./_object-assign')
});

},{"./_export":17,"./_object-assign":34}],60:[function(require,module,exports){
'use strict';

var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return {
    value: undefined,
    done: true
  };
  point = $at(O, index);
  this._i += point.length;
  return {
    value: point,
    done: false
  };
});

},{"./_iter-define":30,"./_string-at":48}],61:[function(require,module,exports){
"use strict";

/* global define, KeyboardEvent, module */

(function () {
  var keyboardeventKeyPolyfill = {
    polyfill: polyfill,
    keys: {
      3: 'Cancel',
      6: 'Help',
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      28: 'Convert',
      29: 'NonConvert',
      30: 'Accept',
      31: 'ModeChange',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      41: 'Select',
      42: 'Print',
      43: 'Execute',
      44: 'PrintScreen',
      45: 'Insert',
      46: 'Delete',
      48: ['0', ')'],
      49: ['1', '!'],
      50: ['2', '@'],
      51: ['3', '#'],
      52: ['4', '$'],
      53: ['5', '%'],
      54: ['6', '^'],
      55: ['7', '&'],
      56: ['8', '*'],
      57: ['9', '('],
      91: 'OS',
      93: 'ContextMenu',
      144: 'NumLock',
      145: 'ScrollLock',
      181: 'VolumeMute',
      182: 'VolumeDown',
      183: 'VolumeUp',
      186: [';', ':'],
      187: ['=', '+'],
      188: [',', '<'],
      189: ['-', '_'],
      190: ['.', '>'],
      191: ['/', '?'],
      192: ['`', '~'],
      219: ['[', '{'],
      220: ['\\', '|'],
      221: [']', '}'],
      222: ["'", '"'],
      224: 'Meta',
      225: 'AltGraph',
      246: 'Attn',
      247: 'CrSel',
      248: 'ExSel',
      249: 'EraseEof',
      250: 'Play',
      251: 'ZoomOut'
    }
  };

  // Function keys (F1-24).
  var i;
  for (i = 1; i < 25; i++) {
    keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
  }

  // Printable ASCII characters.
  var letter = '';
  for (i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
  }
  function polyfill() {
    if (!('KeyboardEvent' in window) || 'key' in KeyboardEvent.prototype) {
      return false;
    }

    // Polyfill `key` on `KeyboardEvent`.
    var proto = {
      get: function get(x) {
        var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];
        if (Array.isArray(key)) {
          key = key[+this.shiftKey];
        }
        return key;
      }
    };
    Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
    return proto;
  }
  if (typeof define === 'function' && define.amd) {
    define('keyboardevent-key-polyfill', keyboardeventKeyPolyfill);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = keyboardeventKeyPolyfill;
  } else if (window) {
    window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
  }
})();

},{}],62:[function(require,module,exports){
'use strict';

var proto = typeof Element !== 'undefined' ? Element.prototype : {};
var vendor = proto.matches || proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;
module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}

},{}],63:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }

    // Detect buggy property enumeration order in older V8 versions.

    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
    test1[5] = 'de';
    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });
    if (order2.join('') !== '0123456789') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }
    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}
module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};

},{}],64:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var assign = require('object-assign');
var delegate = require('./delegate');
var delegateAll = require('./delegateAll');
var DELEGATE_PATTERN = /^(.+):delegate\((.+)\)$/;
var SPACE = ' ';
var getListeners = function getListeners(type, handler) {
  var match = type.match(DELEGATE_PATTERN);
  var selector;
  if (match) {
    type = match[1];
    selector = match[2];
  }
  var options;
  if (_typeof(handler) === 'object') {
    options = {
      capture: popKey(handler, 'capture'),
      passive: popKey(handler, 'passive')
    };
  }
  var listener = {
    selector: selector,
    delegate: _typeof(handler) === 'object' ? delegateAll(handler) : selector ? delegate(selector, handler) : handler,
    options: options
  };
  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function (_type) {
      return assign({
        type: _type
      }, listener);
    });
  } else {
    listener.type = type;
    return [listener];
  }
};
var popKey = function popKey(obj, key) {
  var value = obj[key];
  delete obj[key];
  return value;
};
module.exports = function behavior(events, props) {
  var listeners = Object.keys(events).reduce(function (memo, type) {
    var listeners = getListeners(type, events[type]);
    return memo.concat(listeners);
  }, []);
  return assign({
    add: function addBehavior(element) {
      listeners.forEach(function (listener) {
        element.addEventListener(listener.type, listener.delegate, listener.options);
      });
    },
    remove: function removeBehavior(element) {
      listeners.forEach(function (listener) {
        element.removeEventListener(listener.type, listener.delegate, listener.options);
      });
    }
  }, props);
};

},{"./delegate":67,"./delegateAll":68,"object-assign":63}],65:[function(require,module,exports){
"use strict";

var matches = require('matches-selector');
module.exports = function (element, selector) {
  do {
    if (matches(element, selector)) {
      return element;
    }
  } while ((element = element.parentNode) && element.nodeType === 1);
};

},{"matches-selector":62}],66:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],67:[function(require,module,exports){
"use strict";

var closest = require('./closest');
module.exports = function delegate(selector, fn) {
  return function delegation(event) {
    var target = closest(event.target, selector);
    if (target) {
      return fn.call(target, event);
    }
  };
};

},{"./closest":65}],68:[function(require,module,exports){
"use strict";

var delegate = require('./delegate');
var compose = require('./compose');
var SPLAT = '*';
module.exports = function delegateAll(selectors) {
  var keys = Object.keys(selectors);

  // XXX optimization: if there is only one handler and it applies to
  // all elements (the "*" CSS selector), then just return that
  // handler
  if (keys.length === 1 && keys[0] === SPLAT) {
    return selectors[SPLAT];
  }
  var delegates = keys.reduce(function (memo, selector) {
    memo.push(delegate(selector, selectors[selector]));
    return memo;
  }, []);
  return compose(delegates);
};

},{"./compose":66,"./delegate":67}],69:[function(require,module,exports){
"use strict";

module.exports = function ignore(element, fn) {
  return function ignorance(e) {
    if (element !== e.target && !element.contains(e.target)) {
      return fn.call(this, e);
    }
  };
};

},{}],70:[function(require,module,exports){
'use strict';

module.exports = {
  behavior: require('./behavior'),
  delegate: require('./delegate'),
  delegateAll: require('./delegateAll'),
  ignore: require('./ignore'),
  keymap: require('./keymap')
};

},{"./behavior":64,"./delegate":67,"./delegateAll":68,"./ignore":69,"./keymap":71}],71:[function(require,module,exports){
"use strict";

require('keyboardevent-key-polyfill');

// these are the only relevant modifiers supported on all platforms,
// according to MDN:
// <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState>
var MODIFIERS = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Ctrl': 'ctrlKey',
  'Shift': 'shiftKey'
};
var MODIFIER_SEPARATOR = '+';
var getEventKey = function getEventKey(event, hasModifiers) {
  var key = event.key;
  if (hasModifiers) {
    for (var modifier in MODIFIERS) {
      if (event[MODIFIERS[modifier]] === true) {
        key = [modifier, key].join(MODIFIER_SEPARATOR);
      }
    }
  }
  return key;
};
module.exports = function keymap(keys) {
  var hasModifiers = Object.keys(keys).some(function (key) {
    return key.indexOf(MODIFIER_SEPARATOR) > -1;
  });
  return function (event) {
    var key = getEventKey(event, hasModifiers);
    return [key, key.toLowerCase()].reduce(function (result, _key) {
      if (_key in keys) {
        result = keys[key].call(this, event);
      }
      return result;
    }, undefined);
  };
};
module.exports.MODIFIERS = MODIFIERS;

},{"keyboardevent-key-polyfill":61}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("../polyfills/Function/prototype/bind");
var toggle = require('../utils/toggle');
var isElementInViewport = require('../utils/is-in-viewport');
var BUTTON = ".accordion-button[aria-controls]";
var EXPANDED = 'aria-expanded';
var BULK_FUNCTION_ACTION_ATTRIBUTE = "data-accordion-bulk-expand";
var TEXT_ACCORDION = {
  "open_all": "Åbn alle",
  "close_all": "Luk alle"
};

/**
 * Adds click functionality to accordion list
 * @param {HTMLElement} $accordion the accordion ul element
 * @param {JSON} strings Translate labels: {"open_all": "Åbn alle", "close_all": "Luk alle"}
 */
function Accordion($accordion) {
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TEXT_ACCORDION;
  if (!$accordion) {
    throw new Error("Missing accordion group element");
  }
  this.accordion = $accordion;
  this.text = strings;
}

/**
 * Set eventlisteners on click elements in accordion list
 */
Accordion.prototype.init = function () {
  this.buttons = this.accordion.querySelectorAll(BUTTON);
  if (this.buttons.length == 0) {
    throw new Error("Missing accordion buttons");
  }

  // loop buttons in list
  for (var i = 0; i < this.buttons.length; i++) {
    var currentButton = this.buttons[i];

    // Verify state on button and state on panel
    var expanded = currentButton.getAttribute(EXPANDED) === 'true';
    this.toggleButton(currentButton, expanded);

    // Set click event on accordion buttons
    currentButton.removeEventListener('click', this.eventOnClick.bind(this, currentButton), false);
    currentButton.addEventListener('click', this.eventOnClick.bind(this, currentButton), false);
  }
  // Set click event on bulk button if present
  var prevSibling = this.accordion.previousElementSibling;
  if (prevSibling !== null && prevSibling.classList.contains('accordion-bulk-button')) {
    this.bulkFunctionButton = prevSibling;
    this.bulkFunctionButton.addEventListener('click', this.bulkEvent.bind(this));
  }
};

/**
 * Bulk event handler: Triggered when clicking on .accordion-bulk-button
 */
Accordion.prototype.bulkEvent = function () {
  var $module = this;
  if (!$module.accordion.classList.contains('accordion')) {
    throw new Error("Could not find accordion.");
  }
  if ($module.buttons.length == 0) {
    throw new Error("Missing accordion buttons");
  }
  var expand = true;
  if ($module.bulkFunctionButton.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE) === "false") {
    expand = false;
  }
  for (var i = 0; i < $module.buttons.length; i++) {
    $module.toggleButton($module.buttons[i], expand, true);
  }
  $module.bulkFunctionButton.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, !expand);
  if (!expand === true) {
    $module.bulkFunctionButton.innerText = this.text.open_all;
  } else {
    $module.bulkFunctionButton.innerText = this.text.close_all;
  }
};

/**
 * Accordion button event handler: Toggles accordion
 * @param {HTMLButtonElement} $button 
 * @param {PointerEvent} e 
 */
Accordion.prototype.eventOnClick = function ($button, e) {
  var $module = this;
  e.stopPropagation();
  e.preventDefault();
  $module.toggleButton($button);
  if ($button.getAttribute(EXPANDED) === 'true') {
    // We were just expanded, but if another accordion was also just
    // collapsed, we may no longer be in the viewport. This ensures
    // that we are still visible, so the user isn't confused.
    if (!isElementInViewport($button)) $button.scrollIntoView();
  }
};

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
Accordion.prototype.toggleButton = function (button, expanded) {
  var bulk = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var accordion = null;
  if (button.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode;
  } else if (button.parentNode.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode.parentNode;
  }
  expanded = toggle(button, expanded);
  if (expanded) {
    var eventOpen = new Event('fds.accordion.open');
    button.dispatchEvent(eventOpen);
  } else {
    var eventClose = new Event('fds.accordion.close');
    button.dispatchEvent(eventClose);
  }
  if (accordion !== null) {
    var bulkFunction = accordion.previousElementSibling;
    if (bulkFunction !== null && bulkFunction.classList.contains('accordion-bulk-button')) {
      var buttons = accordion.querySelectorAll(BUTTON);
      if (bulk === false) {
        var buttonsOpen = accordion.querySelectorAll(BUTTON + '[aria-expanded="true"]');
        var newStatus = true;
        if (buttons.length === buttonsOpen.length) {
          newStatus = false;
        }
        bulkFunction.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, newStatus);
        if (newStatus === true) {
          bulkFunction.innerText = this.text.open_all;
        } else {
          bulkFunction.innerText = this.text.close_all;
        }
      }
    }
  }
};
var _default = exports["default"] = Accordion;

},{"../polyfills/Function/prototype/bind":93,"../utils/is-in-viewport":102,"../utils/toggle":105}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Alert(alert) {
  this.alert = alert;
}
Alert.prototype.init = function () {
  var close = this.alert.getElementsByClassName('alert-close');
  if (close.length === 1) {
    close[0].addEventListener('click', this.hide.bind(this));
  }
};
Alert.prototype.hide = function () {
  this.alert.classList.add('d-none');
  var eventHide = new Event('fds.alert.hide');
  this.alert.dispatchEvent(eventHide);
};
Alert.prototype.show = function () {
  this.alert.classList.remove('d-none');
  var eventShow = new Event('fds.alert.show');
  this.alert.dispatchEvent(eventShow);
};
var _default = exports["default"] = Alert;

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function BackToTop(backtotop) {
  this.backtotop = backtotop;
}
BackToTop.prototype.init = function () {
  var backtotopbutton = this.backtotop;
  updateBackToTopButton(backtotopbutton);
  var observer = new MutationObserver(function (list) {
    var evt = new CustomEvent('dom-changed', {
      detail: list
    });
    document.body.dispatchEvent(evt);
  });

  // Which mutations to observe
  var config = {
    attributes: true,
    attributeOldValue: false,
    characterData: true,
    characterDataOldValue: false,
    childList: true,
    subtree: true
  };

  // DOM changes
  observer.observe(document.body, config);
  document.body.addEventListener('dom-changed', function (e) {
    updateBackToTopButton(backtotopbutton);
  });

  // Scroll actions
  window.addEventListener('scroll', function (e) {
    updateBackToTopButton(backtotopbutton);
  });

  // Window resizes
  window.addEventListener('resize', function (e) {
    updateBackToTopButton(backtotopbutton);
  });
};
function updateBackToTopButton(button) {
  var docBody = document.body;
  var docElem = document.documentElement;
  var heightOfViewport = Math.max(docElem.clientHeight || 0, window.innerHeight || 0);
  var heightOfPage = Math.max(docBody.scrollHeight, docBody.offsetHeight, docBody.getBoundingClientRect().height, docElem.scrollHeight, docElem.offsetHeight, docElem.getBoundingClientRect().height, docElem.clientHeight);
  var limit = heightOfViewport * 2; // The threshold selected to determine whether a back-to-top-button should be displayed

  // Never show the button if the page is too short
  if (limit > heightOfPage) {
    if (!button.classList.contains('d-none')) {
      button.classList.add('d-none');
    }
  }
  // If the page is long, calculate when to show the button
  else {
    if (button.classList.contains('d-none')) {
      button.classList.remove('d-none');
    }
    var lastKnownScrollPosition = window.scrollY;
    var footer = document.getElementsByTagName("footer")[0]; // If there are several footers, the code only applies to the first footer

    // Show the button, if the user has scrolled too far down
    if (lastKnownScrollPosition >= limit) {
      if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
        button.classList.remove('footer-sticky');
      } else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
        button.classList.add('footer-sticky');
      }
    }
    // If there's a sidenav, we might want to show the button anyway
    else {
      var sidenav = document.querySelector('.sidenav-list'); // Finds side navigations (left menus) and step guides

      if (sidenav && sidenav.offsetParent !== null) {
        var _sidenav$closest, _sidenav$closest2;
        // Only react to sidenavs, which are always visible (i.e. not opened from overflow-menu buttons)
        if (!(((_sidenav$closest = sidenav.closest(".overflow-menu-inner")) === null || _sidenav$closest === void 0 || (_sidenav$closest = _sidenav$closest.previousElementSibling) === null || _sidenav$closest === void 0 ? void 0 : _sidenav$closest.getAttribute('aria-expanded')) === "true" && ((_sidenav$closest2 = sidenav.closest(".overflow-menu-inner")) === null || _sidenav$closest2 === void 0 || (_sidenav$closest2 = _sidenav$closest2.previousElementSibling) === null || _sidenav$closest2 === void 0 ? void 0 : _sidenav$closest2.offsetParent) !== null)) {
          var rect = sidenav.getBoundingClientRect();
          if (rect.bottom < 0) {
            if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
              button.classList.remove('footer-sticky');
            } else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
              button.classList.add('footer-sticky');
            }
          } else {
            if (!button.classList.contains('footer-sticky')) {
              button.classList.add('footer-sticky');
            }
          }
        }
      }
      // There's no sidenav and we know the user hasn't reached the scroll limit: Ensure the button is hidden
      else {
        if (!button.classList.contains('footer-sticky')) {
          button.classList.add('footer-sticky');
        }
      }
    }
  }
}
function isFooterVisible(footerElement) {
  if (footerElement !== null && footerElement !== void 0 && footerElement.querySelector('.footer')) {
    var rect = footerElement.querySelector('.footer').getBoundingClientRect();

    // Footer is visible or partly visible
    if (rect.top < window.innerHeight || rect.top < document.documentElement.clientHeight) {
      return true;
    }
    // Footer is hidden
    else {
      return false;
    }
  } else {
    return false;
  }
}
var _default = exports["default"] = BackToTop;

},{}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var MAX_LENGTH = 'data-maxlength';
var TEXT_CHARACTERLIMIT = {
  "character_remaining": "Du har {value} tegn tilbage",
  "characters_remaining": "Du har {value} tegn tilbage",
  "character_too_many": "Du har {value} tegn for meget",
  "characters_too_many": "Du har {value} tegn for meget"
};

/**
 * Show number of characters left in a field
 * @param {HTMLElement} containerElement 
 * @param {JSON} strings Translate labels: {"character_remaining": "Du har {value} tegn tilbage", "characters_remaining": "Du har {value} tegn tilbage", "character_too_many": "Du har {value} tegn for meget", "characters_too_many": "Du har {value} tegn for meget"}
 */
function CharacterLimit(containerElement) {
  var _this = this;
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TEXT_CHARACTERLIMIT;
  if (!containerElement) {
    throw new Error("Missing form-limit element");
  }
  this.container = containerElement;
  this.input = containerElement.getElementsByClassName('form-input')[0];
  this.maxlength = this.container.getAttribute(MAX_LENGTH);
  this.text = strings;
  var lastKeyUpTimestamp = null;
  var oldValue = this.input.value;
  var intervalID = null;
  var handleKeyUp = function handleKeyUp() {
    updateVisibleMessage(_this);
    lastKeyUpTimestamp = Date.now();
  };
  var handleFocus = function handleFocus() {
    /* Reset the screen reader message on focus to force an update of the message.
    This ensures that a screen reader informs the user of how many characters there is left
    on focus and not just what the character limit is. */
    if (_this.input.value !== "") {
      var sr_message = _this.container.getElementsByClassName('character-limit-sr-only')[0];
      sr_message.innerHTML = '';
    }
    intervalID = setInterval(function () {
      /* Don't update the Screen Reader message unless it's been awhile
      since the last key up event. Otherwise, the user will be spammed
      with audio notifications while typing. */
      if (!lastKeyUpTimestamp || Date.now() - 500 >= lastKeyUpTimestamp) {
        var _sr_message = this.container.getElementsByClassName('character-limit-sr-only')[0].innerHTML;
        var visible_message = this.container.getElementsByClassName('character-limit')[0].innerHTML;

        /* Don't update the messages unless the input has changed or if there
        is a mismatch between the visible message and the screen reader message. */
        if (oldValue !== this.input.value || _sr_message !== visible_message) {
          oldValue = this.input.value;
          this.updateMessages();
        }
      }
    }.bind(_this), 1000);
  };
  var handleBlur = function handleBlur() {
    clearInterval(intervalID);
    // Don't update the messages on blur unless the value of the textarea/text input has changed
    if (oldValue !== _this.input.value) {
      oldValue = _this.input.value;
      _this.updateMessages();
    }
  };
  this.init = function () {
    var _this2 = this;
    if (!this.maxlength) {
      throw new Error("Character limit is missing attribute ".concat(MAX_LENGTH));
    }
    this.input.addEventListener('keyup', function () {
      handleKeyUp();
    });
    this.input.addEventListener('focus', function () {
      handleFocus();
    });
    this.input.addEventListener('blur', function () {
      handleBlur();
    });

    /* If the browser supports the pageshow event, use it to update the character limit
    message and sr-message once a page has loaded. Second best, use the DOMContentLoaded event. 
    This ensures that if the user navigates to another page in the browser and goes back, the 
    message and sr-message will show/tell the correct amount of characters left. */
    if ('onpageshow' in window) {
      window.addEventListener('pageshow', function () {
        _this2.updateMessages();
      });
    } else {
      window.addEventListener('DOMContentLoaded', function () {
        _this2.updateMessages();
      });
    }
  };
}
CharacterLimit.prototype.charactersLeft = function () {
  var current_length = this.input.value.length;
  return this.maxlength - current_length;
};
function characterLimitMessage(formLimit) {
  var count_message = "";
  var characters_left = formLimit.charactersLeft();
  if (characters_left === -1) {
    var exceeded = Math.abs(characters_left);
    count_message = formLimit.text.character_too_many.replace(/{value}/, exceeded);
  } else if (characters_left === 1) {
    count_message = formLimit.text.character_remaining.replace(/{value}/, characters_left);
  } else if (characters_left >= 0) {
    count_message = formLimit.text.characters_remaining.replace(/{value}/, characters_left);
  } else {
    var _exceeded = Math.abs(characters_left);
    count_message = formLimit.text.characters_too_many.replace(/{value}/, _exceeded);
  }
  return count_message;
}
function updateVisibleMessage(formLimit) {
  var characters_left = formLimit.charactersLeft();
  var count_message = characterLimitMessage(formLimit);
  var character_label = formLimit.container.getElementsByClassName('character-limit')[0];
  if (characters_left < 0) {
    if (!character_label.classList.contains('limit-exceeded')) {
      character_label.classList.add('limit-exceeded');
    }
    if (!formLimit.input.classList.contains('form-limit-error')) {
      formLimit.input.classList.add('form-limit-error');
    }
  } else {
    if (character_label.classList.contains('limit-exceeded')) {
      character_label.classList.remove('limit-exceeded');
    }
    if (formLimit.input.classList.contains('form-limit-error')) {
      formLimit.input.classList.remove('form-limit-error');
    }
  }
  character_label.innerHTML = count_message;
}
function updateScreenReaderMessage(formLimit) {
  var count_message = characterLimitMessage(formLimit);
  var character_label = formLimit.container.getElementsByClassName('character-limit-sr-only')[0];
  character_label.innerHTML = count_message;
}
CharacterLimit.prototype.updateMessages = function () {
  updateVisibleMessage(this);
  updateScreenReaderMessage(this);
};
var _default = exports["default"] = CharacterLimit;

},{}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("../polyfills/Function/prototype/bind");
var TOGGLE_TARGET_ATTRIBUTE = 'data-aria-controls';

/**
 * Adds click functionality to checkbox collapse component
 * @param {HTMLInputElement} checkboxElement 
 */
function CheckboxToggleContent(checkboxElement) {
  this.checkboxElement = checkboxElement;
  this.targetElement = null;
}

/**
 * Set events on checkbox state change
 */
CheckboxToggleContent.prototype.init = function () {
  this.checkboxElement.addEventListener('change', this.toggle.bind(this));
  this.toggle();
};

/**
 * Toggle checkbox content
 */
CheckboxToggleContent.prototype.toggle = function () {
  var $module = this;
  var targetAttr = this.checkboxElement.getAttribute(TOGGLE_TARGET_ATTRIBUTE);
  var targetEl = document.getElementById(targetAttr);
  if (targetEl === null || targetEl === undefined) {
    throw new Error("Could not find panel element. Verify value of attribute " + TOGGLE_TARGET_ATTRIBUTE);
  }
  if (this.checkboxElement.checked) {
    $module.expand(this.checkboxElement, targetEl);
  } else {
    $module.collapse(this.checkboxElement, targetEl);
  }
};

/**
 * Expand content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.expand = function (checkboxElement, contentElement) {
  if (checkboxElement !== null && checkboxElement !== undefined && contentElement !== null && contentElement !== undefined) {
    checkboxElement.setAttribute('data-aria-expanded', 'true');
    contentElement.classList.remove('collapsed');
    contentElement.setAttribute('aria-hidden', 'false');
    var eventOpen = new Event('fds.collapse.expanded');
    checkboxElement.dispatchEvent(eventOpen);
  }
};

/**
 * Collapse content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.collapse = function (triggerEl, targetEl) {
  if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
    triggerEl.setAttribute('data-aria-expanded', 'false');
    targetEl.classList.add('collapsed');
    targetEl.setAttribute('aria-hidden', 'true');
    var eventClose = new Event('fds.collapse.collapsed');
    triggerEl.dispatchEvent(eventClose);
  }
};
var _default = exports["default"] = CheckboxToggleContent;

},{"../polyfills/Function/prototype/bind":93}],77:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _receptor = require("receptor");
var _CLICK;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var behavior = require("../utils/behavior");
var select = require("../utils/select");
var _require = require("../config"),
  PREFIX = _require.prefix;
var _require2 = require("../events"),
  CLICK = _require2.CLICK;
var activeElement = require("../utils/active-element");
var isIosDevice = require("../utils/is-ios-device");
var DATE_PICKER_CLASS = "date-picker";
var DATE_PICKER_WRAPPER_CLASS = "".concat(DATE_PICKER_CLASS, "__wrapper");
var DATE_PICKER_INITIALIZED_CLASS = "".concat(DATE_PICKER_CLASS, "--initialized");
var DATE_PICKER_ACTIVE_CLASS = "".concat(DATE_PICKER_CLASS, "--active");
var DATE_PICKER_INTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__internal-input");
var DATE_PICKER_EXTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__external-input");
var DATE_PICKER_BUTTON_CLASS = "".concat(DATE_PICKER_CLASS, "__button");
var DATE_PICKER_CALENDAR_CLASS = "".concat(DATE_PICKER_CLASS, "__calendar");
var DATE_PICKER_STATUS_CLASS = "".concat(DATE_PICKER_CLASS, "__status");
var DATE_PICKER_GUIDE_CLASS = "".concat(DATE_PICKER_CLASS, "__guide");
var CALENDAR_DATE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date");
var DIALOG_WRAPPER_CLASS = "dialog-wrapper";
var DATE_PICKER_DIALOG_WRAPPER = ".".concat(DIALOG_WRAPPER_CLASS);
var CALENDAR_DATE_FOCUSED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--focused");
var CALENDAR_DATE_SELECTED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--selected");
var CALENDAR_DATE_PREVIOUS_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--previous-month");
var CALENDAR_DATE_CURRENT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--current-month");
var CALENDAR_DATE_NEXT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--next-month");
var CALENDAR_DATE_RANGE_DATE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date");
var CALENDAR_DATE_TODAY_CLASS = "".concat(CALENDAR_DATE_CLASS, "--today");
var CALENDAR_DATE_RANGE_DATE_START_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-start");
var CALENDAR_DATE_RANGE_DATE_END_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-end");
var CALENDAR_DATE_WITHIN_RANGE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--within-range");
var CALENDAR_PREVIOUS_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year");
var CALENDAR_PREVIOUS_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-month");
var CALENDAR_NEXT_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year");
var CALENDAR_NEXT_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-month");
var CALENDAR_MONTH_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-selection");
var CALENDAR_YEAR_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-selection");
var CALENDAR_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month");
var CALENDAR_MONTH_FOCUSED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--focused");
var CALENDAR_MONTH_SELECTED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--selected");
var CALENDAR_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year");
var CALENDAR_YEAR_FOCUSED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--focused");
var CALENDAR_YEAR_SELECTED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--selected");
var CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year-chunk");
var CALENDAR_NEXT_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year-chunk");
var CALENDAR_DATE_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date-picker");
var CALENDAR_MONTH_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-picker");
var CALENDAR_YEAR_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-picker");
var CALENDAR_TABLE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__table");
var CALENDAR_ROW_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__row");
var CALENDAR_CELL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__cell");
var CALENDAR_CELL_CENTER_ITEMS_CLASS = "".concat(CALENDAR_CELL_CLASS, "--center-items");
var CALENDAR_MONTH_LABEL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-label");
var CALENDAR_DAY_OF_WEEK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__day-of-week");
var DATE_PICKER = ".".concat(DATE_PICKER_CLASS);
var DATE_PICKER_BUTTON = ".".concat(DATE_PICKER_BUTTON_CLASS);
var DATE_PICKER_INTERNAL_INPUT = ".".concat(DATE_PICKER_INTERNAL_INPUT_CLASS);
var DATE_PICKER_EXTERNAL_INPUT = ".".concat(DATE_PICKER_EXTERNAL_INPUT_CLASS);
var DATE_PICKER_CALENDAR = ".".concat(DATE_PICKER_CALENDAR_CLASS);
var DATE_PICKER_STATUS = ".".concat(DATE_PICKER_STATUS_CLASS);
var DATE_PICKER_GUIDE = ".".concat(DATE_PICKER_GUIDE_CLASS);
var CALENDAR_DATE = ".".concat(CALENDAR_DATE_CLASS);
var CALENDAR_DATE_FOCUSED = ".".concat(CALENDAR_DATE_FOCUSED_CLASS);
var CALENDAR_DATE_CURRENT_MONTH = ".".concat(CALENDAR_DATE_CURRENT_MONTH_CLASS);
var CALENDAR_PREVIOUS_YEAR = ".".concat(CALENDAR_PREVIOUS_YEAR_CLASS);
var CALENDAR_PREVIOUS_MONTH = ".".concat(CALENDAR_PREVIOUS_MONTH_CLASS);
var CALENDAR_NEXT_YEAR = ".".concat(CALENDAR_NEXT_YEAR_CLASS);
var CALENDAR_NEXT_MONTH = ".".concat(CALENDAR_NEXT_MONTH_CLASS);
var CALENDAR_YEAR_SELECTION = ".".concat(CALENDAR_YEAR_SELECTION_CLASS);
var CALENDAR_MONTH_SELECTION = ".".concat(CALENDAR_MONTH_SELECTION_CLASS);
var CALENDAR_MONTH = ".".concat(CALENDAR_MONTH_CLASS);
var CALENDAR_YEAR = ".".concat(CALENDAR_YEAR_CLASS);
var CALENDAR_PREVIOUS_YEAR_CHUNK = ".".concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS);
var CALENDAR_NEXT_YEAR_CHUNK = ".".concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS);
var CALENDAR_DATE_PICKER = ".".concat(CALENDAR_DATE_PICKER_CLASS);
var CALENDAR_MONTH_PICKER = ".".concat(CALENDAR_MONTH_PICKER_CLASS);
var CALENDAR_YEAR_PICKER = ".".concat(CALENDAR_YEAR_PICKER_CLASS);
var CALENDAR_MONTH_FOCUSED = ".".concat(CALENDAR_MONTH_FOCUSED_CLASS);
var CALENDAR_YEAR_FOCUSED = ".".concat(CALENDAR_YEAR_FOCUSED_CLASS);
var text = {
  "open_calendar": "Åbn kalender",
  "choose_a_date": "Vælg en dato",
  "choose_a_date_between": "Vælg en dato mellem {minDay}. {minMonthStr} {minYear} og {maxDay}. {maxMonthStr} {maxYear}",
  "choose_a_date_before": "Vælg en dato. Der kan vælges indtil {maxDay}. {maxMonthStr} {maxYear}.",
  "choose_a_date_after": "Vælg en dato. Der kan vælges fra {minDay}. {minMonthStr} {minYear} og fremad.",
  "aria_label_date": "{dayStr} den {day}. {monthStr} {year}",
  "current_month_displayed": "Viser {monthLabel} {focusedYear}",
  "first_possible_date": "Første valgbare dato",
  "last_possible_date": "Sidste valgbare dato",
  "previous_year": "Navigér ét år tilbage",
  "previous_month": "Navigér én måned tilbage",
  "next_month": "Navigér én måned frem",
  "next_year": "Navigér ét år frem",
  "select_month": "Vælg måned",
  "select_year": "Vælg år",
  "previous_years": "Navigér {years} år tilbage",
  "next_years": "Navigér {years} år frem",
  "guide": "Navigerer du med tastatur, kan du skifte dag med højre og venstre piletaster, uger med op og ned piletaster, måneder med page up og page down-tasterne og år med shift-tasten plus page up eller page down. Home og end-tasten navigerer til start eller slutning af en uge.",
  "months_displayed": "Vælg en måned",
  "years_displayed": "Viser år {start} til {end}. Vælg et år.",
  "january": "januar",
  "february": "februar",
  "march": "marts",
  "april": "april",
  "may": "maj",
  "june": "juni",
  "july": "juli",
  "august": "august",
  "september": "september",
  "october": "oktober",
  "november": "november",
  "december": "december",
  "monday": "mandag",
  "tuesday": "tirsdag",
  "wednesday": "onsdag",
  "thursday": "torsdag",
  "friday": "fredag",
  "saturday": "lørdag",
  "sunday": "søndag"
};
var VALIDATION_MESSAGE = "Indtast venligst en gyldig dato";
var MONTH_LABELS = [text.january, text.february, text.march, text.april, text.may, text.june, text.july, text.august, text.september, text.october, text.november, text.december];
var DAY_OF_WEEK_LABELS = [text.monday, text.tuesday, text.wednesday, text.thursday, text.friday, text.saturday, text.sunday];
var ENTER_KEYCODE = 13;
var YEAR_CHUNK = 12;
var DEFAULT_MIN_DATE = "0000-01-01";
var DATE_FORMAT_OPTION_1 = "DD/MM/YYYY";
var DATE_FORMAT_OPTION_2 = "DD-MM-YYYY";
var DATE_FORMAT_OPTION_3 = "DD.MM.YYYY";
var DATE_FORMAT_OPTION_4 = "DD MM YYYY";
var DATE_FORMAT_OPTION_5 = "DD/MM-YYYY";
var INTERNAL_DATE_FORMAT = "YYYY-MM-DD";
var NOT_DISABLED_SELECTOR = ":not([disabled])";
var processFocusableSelectors = function processFocusableSelectors() {
  for (var _len = arguments.length, selectors = new Array(_len), _key = 0; _key < _len; _key++) {
    selectors[_key] = arguments[_key];
  }
  return selectors.map(function (query) {
    return query + NOT_DISABLED_SELECTOR;
  }).join(", ");
};
var DATE_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR, CALENDAR_PREVIOUS_MONTH, CALENDAR_YEAR_SELECTION, CALENDAR_MONTH_SELECTION, CALENDAR_NEXT_YEAR, CALENDAR_NEXT_MONTH, CALENDAR_DATE_FOCUSED);
var MONTH_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_MONTH_FOCUSED);
var YEAR_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR_CHUNK, CALENDAR_NEXT_YEAR_CHUNK, CALENDAR_YEAR_FOCUSED);

// #region Date Manipulation Functions

/**
 * Keep date within month. Month would only be over by 1 to 3 days
 *
 * @param {Date} dateToCheck the date object to check
 * @param {number} month the correct month
 * @returns {Date} the date, corrected if needed
 */
var keepDateWithinMonth = function keepDateWithinMonth(dateToCheck, month) {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0);
  }
  return dateToCheck;
};

/**
 * Set date from month day year
 *
 * @param {number} year the year to set
 * @param {number} month the month to set (zero-indexed)
 * @param {number} date the date to set
 * @returns {Date} the set date
 */
var setDate = function setDate(year, month, date) {
  var newDate = new Date(0);
  newDate.setFullYear(year, month, date);
  return newDate;
};

/**
 * todays date
 *
 * @returns {Date} todays date
 */
var today = function today() {
  var newDate = new Date();
  var day = newDate.getDate();
  var month = newDate.getMonth();
  var year = newDate.getFullYear();
  return setDate(year, month, day);
};

/**
 * Set date to first day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
var startOfMonth = function startOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth(), 1);
  return newDate;
};

/**
 * Set date to last day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
var lastDayOfMonth = function lastDayOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  return newDate;
};

/**
 * Add days to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */
var addDays = function addDays(_date, numDays) {
  var newDate = new Date(_date.getTime());
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

/**
 * Subtract days from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */
var subDays = function subDays(_date, numDays) {
  return addDays(_date, -numDays);
};

/**
 * Add weeks to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
var addWeeks = function addWeeks(_date, numWeeks) {
  return addDays(_date, numWeeks * 7);
};

/**
 * Subtract weeks from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
var subWeeks = function subWeeks(_date, numWeeks) {
  return addWeeks(_date, -numWeeks);
};

/**
 * Set date to the start of the week (Monday)
 *
 * @param {Date} _date the date to adjust
 * @returns {Date} the adjusted date
 */
var startOfWeek = function startOfWeek(_date) {
  var dayOfWeek = _date.getDay() - 1;
  if (dayOfWeek === -1) {
    dayOfWeek = 6;
  }
  return subDays(_date, dayOfWeek);
};

/**
 * Set date to the end of the week (Sunday)
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
var endOfWeek = function endOfWeek(_date) {
  var dayOfWeek = _date.getDay();
  return addDays(_date, 7 - dayOfWeek);
};

/**
 * Add months to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
var addMonths = function addMonths(_date, numMonths) {
  var newDate = new Date(_date.getTime());
  var dateMonth = (newDate.getMonth() + 12 + numMonths) % 12;
  newDate.setMonth(newDate.getMonth() + numMonths);
  keepDateWithinMonth(newDate, dateMonth);
  return newDate;
};

/**
 * Subtract months from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
var subMonths = function subMonths(_date, numMonths) {
  return addMonths(_date, -numMonths);
};

/**
 * Add years to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
var addYears = function addYears(_date, numYears) {
  return addMonths(_date, numYears * 12);
};

/**
 * Subtract years from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
var subYears = function subYears(_date, numYears) {
  return addYears(_date, -numYears);
};

/**
 * Set months of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} month zero-indexed month to set
 * @returns {Date} the adjusted date
 */
var setMonth = function setMonth(_date, month) {
  var newDate = new Date(_date.getTime());
  newDate.setMonth(month);
  keepDateWithinMonth(newDate, month);
  return newDate;
};

/**
 * Set year of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} year the year to set
 * @returns {Date} the adjusted date
 */
var setYear = function setYear(_date, year) {
  var newDate = new Date(_date.getTime());
  var month = newDate.getMonth();
  newDate.setFullYear(year);
  keepDateWithinMonth(newDate, month);
  return newDate;
};

/**
 * Return the earliest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the earliest date
 */
var min = function min(dateA, dateB) {
  var newDate = dateA;
  if (dateB < dateA) {
    newDate = dateB;
  }
  return new Date(newDate.getTime());
};

/**
 * Return the latest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the latest date
 */
var max = function max(dateA, dateB) {
  var newDate = dateA;
  if (dateB > dateA) {
    newDate = dateB;
  }
  return new Date(newDate.getTime());
};

/**
 * Check if dates are the in the same year
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same year
 */
var isSameYear = function isSameYear(dateA, dateB) {
  return dateA && dateB && dateA.getFullYear() === dateB.getFullYear();
};

/**
 * Check if dates are the in the same month
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same month
 */
var isSameMonth = function isSameMonth(dateA, dateB) {
  return isSameYear(dateA, dateB) && dateA.getMonth() === dateB.getMonth();
};

/**
 * Check if dates are the same date
 *
 * @param {Date} dateA the date to compare
 * @param {Date} dateB the date to compare
 * @returns {boolean} are dates the same date
 */
var isSameDay = function isSameDay(dateA, dateB) {
  return isSameMonth(dateA, dateB) && dateA.getDate() === dateB.getDate();
};

/**
 * return a new date within minimum and maximum date
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @returns {Date} the date between min and max
 */
var keepDateBetweenMinAndMax = function keepDateBetweenMinAndMax(date, minDate, maxDate) {
  var newDate = date;
  if (date < minDate) {
    newDate = minDate;
  } else if (maxDate && date > maxDate) {
    newDate = maxDate;
  }
  return new Date(newDate.getTime());
};

/**
 * Check if dates is valid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is there a day within the month within min and max dates
 */
var isDateWithinMinAndMax = function isDateWithinMinAndMax(date, minDate, maxDate) {
  return date >= minDate && (!maxDate || date <= maxDate);
};

/**
 * Check if dates month is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */
var isDatesMonthOutsideMinOrMax = function isDatesMonthOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(date) < minDate || maxDate && startOfMonth(date) > maxDate;
};

/**
 * Check if dates year is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */
var isDatesYearOutsideMinOrMax = function isDatesYearOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(setMonth(date, 11)) < minDate || maxDate && startOfMonth(setMonth(date, 0)) > maxDate;
};

/**
 * Parse a date with format D-M-YY
 *
 * @param {string} dateString the date string to parse
 * @param {string} dateFormat the format of the date string
 * @param {boolean} adjustDate should the date be adjusted
 * @returns {Date} the parsed date
 */
var parseDateString = function parseDateString(dateString) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;
  var adjustDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var date;
  var month;
  var day;
  var year;
  var parsed;
  if (dateString) {
    var monthStr, dayStr, yearStr;
    if (dateFormat === DATE_FORMAT_OPTION_1 || dateFormat === DATE_FORMAT_OPTION_2 || dateFormat === DATE_FORMAT_OPTION_3 || dateFormat === DATE_FORMAT_OPTION_4 || dateFormat === DATE_FORMAT_OPTION_5) {
      var _dateString$split = dateString.split(/-|\.|\/|\s/);
      var _dateString$split2 = _slicedToArray(_dateString$split, 3);
      dayStr = _dateString$split2[0];
      monthStr = _dateString$split2[1];
      yearStr = _dateString$split2[2];
    } else {
      var _dateString$split3 = dateString.split("-");
      var _dateString$split4 = _slicedToArray(_dateString$split3, 3);
      yearStr = _dateString$split4[0];
      monthStr = _dateString$split4[1];
      dayStr = _dateString$split4[2];
    }
    if (yearStr) {
      parsed = parseInt(yearStr, 10);
      if (!Number.isNaN(parsed)) {
        year = parsed;
        if (adjustDate) {
          year = Math.max(0, year);
          if (yearStr.length < 3) {
            var currentYear = today().getFullYear();
            var currentYearStub = currentYear - currentYear % Math.pow(10, yearStr.length);
            year = currentYearStub + parsed;
          }
        }
      }
    }
    if (monthStr) {
      parsed = parseInt(monthStr, 10);
      if (!Number.isNaN(parsed)) {
        month = parsed;
        if (adjustDate) {
          month = Math.max(1, month);
          month = Math.min(12, month);
        }
      }
    }
    if (month && dayStr && year != null) {
      parsed = parseInt(dayStr, 10);
      if (!Number.isNaN(parsed)) {
        day = parsed;
        if (adjustDate) {
          var lastDayOfTheMonth = setDate(year, month, 0).getDate();
          day = Math.max(1, day);
          day = Math.min(lastDayOfTheMonth, day);
        }
      }
    }
    if (month && day && year != null) {
      date = setDate(year, month - 1, day);
    }
  }
  return date;
};

/**
 * Format a date to format DD-MM-YYYY
 *
 * @param {Date} date the date to format
 * @param {string} dateFormat the format of the date string
 * @returns {string} the formatted date string
 */
var formatDate = function formatDate(date) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;
  var padZeros = function padZeros(value, length) {
    return "0000".concat(value).slice(-length);
  };
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  if (dateFormat === DATE_FORMAT_OPTION_1) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join("/");
  } else if (dateFormat === DATE_FORMAT_OPTION_2) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join("-");
  } else if (dateFormat === DATE_FORMAT_OPTION_3) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join(".");
  } else if (dateFormat === DATE_FORMAT_OPTION_4) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join(" ");
  } else if (dateFormat === DATE_FORMAT_OPTION_5) {
    var tempDayMonth = [padZeros(day, 2), padZeros(month, 2)].join("/");
    return [tempDayMonth, padZeros(year, 4)].join("-");
  }
  return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join("-");
};

// #endregion Date Manipulation Functions

/**
 * Create a grid string from an array of html strings
 *
 * @param {string[]} htmlArray the array of html items
 * @param {number} rowSize the length of a row
 * @returns {string} the grid string
 */
var listToGridHtml = function listToGridHtml(htmlArray, rowSize) {
  var grid = [];
  var row = [];
  var i = 0;
  while (i < htmlArray.length) {
    row = [];
    while (i < htmlArray.length && row.length < rowSize) {
      row.push("<td>".concat(htmlArray[i], "</td>"));
      i += 1;
    }
    grid.push("<tr>".concat(row.join(""), "</tr>"));
  }
  return grid.join("");
};

/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement} el The element to update
 * @param {string} value The new value of the element
 */
var changeElementValue = function changeElementValue(el) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var elementToChange = el;
  elementToChange.value = value;
  var event = new Event('change');
  elementToChange.dispatchEvent(event);
};

/**
 * The properties and elements within the date picker.
 * @typedef {Object} DatePickerContext
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLElement} datePickerEl
 * @property {HTMLDivElement} dialogEl
 * @property {HTMLInputElement} internalInputEl
 * @property {HTMLInputElement} externalInputEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLDivElement} guideEl
 * @property {HTMLDivElement} firstYearChunkEl
 * @property {Date} calendarDate
 * @property {Date} minDate
 * @property {Date} maxDate
 * @property {Date} selectedDate
 * @property {Date} rangeDate
 * @property {Date} defaultDate
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLElement} el the element within the date picker
 * @returns {DatePickerContext} elements
 */
var getDatePickerContext = function getDatePickerContext(el) {
  var datePickerEl = el.closest(DATE_PICKER);
  if (!datePickerEl) {
    throw new Error("Element is missing outer ".concat(DATE_PICKER));
  }
  var internalInputEl = datePickerEl.querySelector(DATE_PICKER_INTERNAL_INPUT);
  var externalInputEl = datePickerEl.querySelector(DATE_PICKER_EXTERNAL_INPUT);
  var calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
  var toggleBtnEl = datePickerEl.querySelector(DATE_PICKER_BUTTON);
  var statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);
  var guideEl = datePickerEl.querySelector(DATE_PICKER_GUIDE);
  var firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);
  var dialogEl = datePickerEl.querySelector(DATE_PICKER_DIALOG_WRAPPER);

  // Set date format
  var selectedDateFormat = DATE_FORMAT_OPTION_1;
  if (datePickerEl.hasAttribute("data-dateformat")) {
    switch (datePickerEl.dataset.dateformat) {
      case DATE_FORMAT_OPTION_1:
        selectedDateFormat = DATE_FORMAT_OPTION_1;
        break;
      case DATE_FORMAT_OPTION_2:
        selectedDateFormat = DATE_FORMAT_OPTION_2;
        break;
      case DATE_FORMAT_OPTION_3:
        selectedDateFormat = DATE_FORMAT_OPTION_3;
        break;
      case DATE_FORMAT_OPTION_4:
        selectedDateFormat = DATE_FORMAT_OPTION_4;
        break;
      case DATE_FORMAT_OPTION_5:
        selectedDateFormat = DATE_FORMAT_OPTION_5;
    }
  }
  var dateFormatOption = selectedDateFormat;
  var inputDate = parseDateString(externalInputEl.value, dateFormatOption, true);
  var selectedDate = parseDateString(internalInputEl.value);
  var calendarDate = parseDateString(calendarEl.dataset.value);
  var minDate = parseDateString(datePickerEl.dataset.minDate);
  var maxDate = parseDateString(datePickerEl.dataset.maxDate);
  var rangeDate = parseDateString(datePickerEl.dataset.rangeDate);
  var defaultDate = parseDateString(datePickerEl.dataset.defaultDate);
  if (minDate && maxDate && minDate > maxDate) {
    throw new Error("Minimum date cannot be after maximum date");
  }
  return {
    calendarDate: calendarDate,
    minDate: minDate,
    toggleBtnEl: toggleBtnEl,
    dialogEl: dialogEl,
    selectedDate: selectedDate,
    maxDate: maxDate,
    firstYearChunkEl: firstYearChunkEl,
    datePickerEl: datePickerEl,
    inputDate: inputDate,
    internalInputEl: internalInputEl,
    externalInputEl: externalInputEl,
    calendarEl: calendarEl,
    rangeDate: rangeDate,
    defaultDate: defaultDate,
    statusEl: statusEl,
    guideEl: guideEl,
    dateFormatOption: dateFormatOption
  };
};

/**
 * Disable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var disable = function disable(el) {
  var _getDatePickerContext = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext.externalInputEl,
    toggleBtnEl = _getDatePickerContext.toggleBtnEl;
  toggleBtnEl.disabled = true;
  externalInputEl.disabled = true;
};

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var enable = function enable(el) {
  var _getDatePickerContext2 = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext2.externalInputEl,
    toggleBtnEl = _getDatePickerContext2.toggleBtnEl;
  toggleBtnEl.disabled = false;
  externalInputEl.disabled = false;
};

// #region Validation

/**
 * Validate the value in the input as a valid date of format D/M/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var isDateInputInvalid = function isDateInputInvalid(el) {
  var _getDatePickerContext3 = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext3.externalInputEl,
    minDate = _getDatePickerContext3.minDate,
    maxDate = _getDatePickerContext3.maxDate;
  var dateString = externalInputEl.value;
  var isInvalid = false;
  if (dateString) {
    isInvalid = true;
    var dateStringParts = dateString.split(/-|\.|\/|\s/);
    var _dateStringParts$map = dateStringParts.map(function (str) {
        var value;
        var parsed = parseInt(str, 10);
        if (!Number.isNaN(parsed)) value = parsed;
        return value;
      }),
      _dateStringParts$map2 = _slicedToArray(_dateStringParts$map, 3),
      day = _dateStringParts$map2[0],
      month = _dateStringParts$map2[1],
      year = _dateStringParts$map2[2];
    if (month && day && year != null) {
      var checkDate = setDate(year, month - 1, day);
      if (checkDate.getMonth() === month - 1 && checkDate.getDate() === day && checkDate.getFullYear() === year && dateStringParts[2].length === 4 && isDateWithinMinAndMax(checkDate, minDate, maxDate)) {
        isInvalid = false;
      }
    }
  }
  return isInvalid;
};

/**
 * Validate the value in the input as a valid date of format M/D/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var validateDateInput = function validateDateInput(el) {
  var _getDatePickerContext4 = getDatePickerContext(el),
    externalInputEl = _getDatePickerContext4.externalInputEl;
  var isInvalid = isDateInputInvalid(externalInputEl);
  if (isInvalid && !externalInputEl.validationMessage) {
    externalInputEl.setCustomValidity(VALIDATION_MESSAGE);
  }
  if (!isInvalid && externalInputEl.validationMessage === VALIDATION_MESSAGE) {
    externalInputEl.setCustomValidity("");
  }
};

// #endregion Validation

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var reconcileInputValues = function reconcileInputValues(el) {
  var _getDatePickerContext5 = getDatePickerContext(el),
    internalInputEl = _getDatePickerContext5.internalInputEl,
    inputDate = _getDatePickerContext5.inputDate;
  var newValue = "";
  if (inputDate && !isDateInputInvalid(el)) {
    newValue = formatDate(inputDate);
  }
  if (internalInputEl.value !== newValue) {
    changeElementValue(internalInputEl, newValue);
  }
};

/**
 * Select the value of the date picker inputs.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {string} dateString The date string to update in YYYY-MM-DD format
 */
var setCalendarValue = function setCalendarValue(el, dateString) {
  var parsedDate = parseDateString(dateString);
  if (parsedDate) {
    var _getDatePickerContext6 = getDatePickerContext(el),
      datePickerEl = _getDatePickerContext6.datePickerEl,
      internalInputEl = _getDatePickerContext6.internalInputEl,
      externalInputEl = _getDatePickerContext6.externalInputEl,
      dateFormatOption = _getDatePickerContext6.dateFormatOption;
    var formattedDate = formatDate(parsedDate, dateFormatOption);
    changeElementValue(internalInputEl, dateString);
    changeElementValue(externalInputEl, formattedDate);
    validateDateInput(datePickerEl);
  }
};

/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date picker component
 */
var enhanceDatePicker = function enhanceDatePicker(el) {
  var datePickerEl = el.closest(DATE_PICKER);
  var defaultValue = datePickerEl.dataset.defaultValue;
  var internalInputEl = datePickerEl.querySelector("input");
  if (!internalInputEl) {
    throw new Error("".concat(DATE_PICKER, " is missing inner input"));
  }
  var minDate = parseDateString(datePickerEl.dataset.minDate || internalInputEl.getAttribute("min"));
  datePickerEl.dataset.minDate = minDate ? formatDate(minDate) : DEFAULT_MIN_DATE;
  var maxDate = parseDateString(datePickerEl.dataset.maxDate || internalInputEl.getAttribute("max"));
  if (maxDate) {
    datePickerEl.dataset.maxDate = formatDate(maxDate);
  }
  var calendarWrapper = document.createElement("div");
  calendarWrapper.classList.add(DATE_PICKER_WRAPPER_CLASS);
  calendarWrapper.tabIndex = "-1";
  var externalInputEl = internalInputEl.cloneNode();
  externalInputEl.classList.add(DATE_PICKER_EXTERNAL_INPUT_CLASS);
  externalInputEl.type = "text";
  externalInputEl.name = "";
  var dialogTitle = text.choose_a_date;
  var hasMinDate = minDate !== undefined && minDate !== "";
  var isDefaultMinDate = minDate !== undefined && minDate !== "" && parseDateString(DEFAULT_MIN_DATE).getTime() === minDate.getTime();
  var hasMaxDate = maxDate !== undefined && maxDate !== "";
  if (hasMinDate && !isDefaultMinDate && hasMaxDate) {
    var minDay = minDate.getDate();
    var minMonth = minDate.getMonth();
    var minMonthStr = MONTH_LABELS[minMonth];
    var minYear = minDate.getFullYear();
    var maxDay = maxDate.getDate();
    var maxMonth = maxDate.getMonth();
    var maxMonthStr = MONTH_LABELS[maxMonth];
    var maxYear = maxDate.getFullYear();
    dialogTitle = text.choose_a_date_between.replace(/{minDay}/, minDay).replace(/{minMonthStr}/, minMonthStr).replace(/{minYear}/, minYear).replace(/{maxDay}/, maxDay).replace(/{maxMonthStr}/, maxMonthStr).replace(/{maxYear}/, maxYear);
  } else if (hasMinDate && !isDefaultMinDate && !hasMaxDate) {
    var _minDay = minDate.getDate();
    var _minMonth = minDate.getMonth();
    var _minMonthStr = MONTH_LABELS[_minMonth];
    var _minYear = minDate.getFullYear();
    dialogTitle = text.choose_a_date_after.replace(/{minDay}/, _minDay).replace(/{minMonthStr}/, _minMonthStr).replace(/{minYear}/, _minYear);
  } else if (hasMaxDate) {
    var _maxDay = maxDate.getDate();
    var _maxMonth = maxDate.getMonth();
    var _maxMonthStr = MONTH_LABELS[_maxMonth];
    var _maxYear = maxDate.getFullYear();
    dialogTitle = text.choose_a_date_before.replace(/{maxDay}/, _maxDay).replace(/{maxMonthStr}/, _maxMonthStr).replace(/{maxYear}/, _maxYear);
  }
  var guideID = externalInputEl.getAttribute("id") + "-guide";
  calendarWrapper.appendChild(externalInputEl);
  calendarWrapper.insertAdjacentHTML("beforeend", ["<button type=\"button\" class=\"".concat(DATE_PICKER_BUTTON_CLASS, "\" aria-haspopup=\"true\" aria-label=\"").concat(text.open_calendar, "\">&nbsp;</button>"), "<div class=\"".concat(DIALOG_WRAPPER_CLASS, "\" role=\"dialog\" aria-modal=\"true\" aria-label=\"").concat(dialogTitle, "\" aria-describedby=\"").concat(guideID, "\" hidden><div role=\"application\"><div class=\"").concat(DATE_PICKER_CALENDAR_CLASS, "\" hidden></div></div></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_STATUS_CLASS, "\" role=\"status\" aria-live=\"polite\"></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_GUIDE_CLASS, "\" id=\"").concat(guideID, "\" hidden>").concat(text.guide, "</div>")].join(""));
  internalInputEl.setAttribute("aria-hidden", "true");
  internalInputEl.setAttribute("tabindex", "-1");
  internalInputEl.classList.add("sr-only", DATE_PICKER_INTERNAL_INPUT_CLASS);
  internalInputEl.removeAttribute('id');
  internalInputEl.required = false;
  datePickerEl.appendChild(calendarWrapper);
  datePickerEl.classList.add(DATE_PICKER_INITIALIZED_CLASS);
  if (defaultValue) {
    setCalendarValue(datePickerEl, defaultValue);
  }
  if (internalInputEl.disabled) {
    disable(datePickerEl);
    internalInputEl.disabled = false;
  }
  if (externalInputEl.value) {
    validateDateInput(externalInputEl);
  }
};

// #region Calendar - Date Selection View

/**
 * render the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 * @param {Date} _dateToDisplay a date to render on the calendar
 * @returns {HTMLElement} a reference to the new calendar element
 */
var renderCalendar = function renderCalendar(el, _dateToDisplay) {
  var _getDatePickerContext7 = getDatePickerContext(el),
    datePickerEl = _getDatePickerContext7.datePickerEl,
    calendarEl = _getDatePickerContext7.calendarEl,
    statusEl = _getDatePickerContext7.statusEl,
    selectedDate = _getDatePickerContext7.selectedDate,
    maxDate = _getDatePickerContext7.maxDate,
    minDate = _getDatePickerContext7.minDate,
    rangeDate = _getDatePickerContext7.rangeDate,
    dialogEl = _getDatePickerContext7.dialogEl,
    guideEl = _getDatePickerContext7.guideEl;
  var todaysDate = today();
  var dateToDisplay = _dateToDisplay || todaysDate;
  var calendarWasHidden = calendarEl.hidden;
  var focusedDate = addDays(dateToDisplay, 0);
  var focusedMonth = dateToDisplay.getMonth();
  var focusedYear = dateToDisplay.getFullYear();
  var prevMonth = subMonths(dateToDisplay, 1);
  var nextMonth = addMonths(dateToDisplay, 1);
  var currentFormattedDate = formatDate(dateToDisplay);
  var firstOfMonth = startOfMonth(dateToDisplay);
  var prevButtonsDisabled = isSameMonth(dateToDisplay, minDate);
  var nextButtonsDisabled = isSameMonth(dateToDisplay, maxDate);
  var rangeConclusionDate = selectedDate || dateToDisplay;
  var rangeStartDate = rangeDate && min(rangeConclusionDate, rangeDate);
  var rangeEndDate = rangeDate && max(rangeConclusionDate, rangeDate);
  var withinRangeStartDate = rangeDate && addDays(rangeStartDate, 1);
  var withinRangeEndDate = rangeDate && subDays(rangeEndDate, 1);
  var monthLabel = MONTH_LABELS[focusedMonth];
  var generateDateHtml = function generateDateHtml(dateToRender) {
    var classes = [CALENDAR_DATE_CLASS];
    var day = dateToRender.getDate();
    var month = dateToRender.getMonth();
    var year = dateToRender.getFullYear();
    var dayOfWeek = dateToRender.getDay() - 1;
    if (dayOfWeek === -1) {
      dayOfWeek = 6;
    }
    var formattedDate = formatDate(dateToRender);
    var tabindex = "-1";
    var isDisabled = !isDateWithinMinAndMax(dateToRender, minDate, maxDate);
    var isSelected = isSameDay(dateToRender, selectedDate);
    if (isSameMonth(dateToRender, prevMonth)) {
      classes.push(CALENDAR_DATE_PREVIOUS_MONTH_CLASS);
    }
    if (isSameMonth(dateToRender, focusedDate)) {
      classes.push(CALENDAR_DATE_CURRENT_MONTH_CLASS);
    }
    if (isSameMonth(dateToRender, nextMonth)) {
      classes.push(CALENDAR_DATE_NEXT_MONTH_CLASS);
    }
    if (isSelected) {
      classes.push(CALENDAR_DATE_SELECTED_CLASS);
    }
    if (isSameDay(dateToRender, todaysDate)) {
      classes.push(CALENDAR_DATE_TODAY_CLASS);
    }
    if (rangeDate) {
      if (isSameDay(dateToRender, rangeDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_CLASS);
      }
      if (isSameDay(dateToRender, rangeStartDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_START_CLASS);
      }
      if (isSameDay(dateToRender, rangeEndDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_END_CLASS);
      }
      if (isDateWithinMinAndMax(dateToRender, withinRangeStartDate, withinRangeEndDate)) {
        classes.push(CALENDAR_DATE_WITHIN_RANGE_CLASS);
      }
    }
    if (isSameDay(dateToRender, focusedDate)) {
      tabindex = "0";
      classes.push(CALENDAR_DATE_FOCUSED_CLASS);
    }
    var monthStr = MONTH_LABELS[month];
    var dayStr = DAY_OF_WEEK_LABELS[dayOfWeek];
    var ariaLabelDate = text.aria_label_date.replace(/{dayStr}/, dayStr).replace(/{day}/, day).replace(/{monthStr}/, monthStr).replace(/{year}/, year);
    return "<button\n      type=\"button\"\n      tabindex=\"".concat(tabindex, "\"\n      class=\"").concat(classes.join(" "), "\" \n      data-day=\"").concat(day, "\" \n      data-month=\"").concat(month + 1, "\" \n      data-year=\"").concat(year, "\" \n      data-value=\"").concat(formattedDate, "\"\n      aria-label=\"").concat(ariaLabelDate, "\"\n      aria-current=\"").concat(isSelected ? "date" : "false", "\"\n      ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n    >").concat(day, "</button>");
  };
  // set date to first rendered day
  dateToDisplay = startOfWeek(firstOfMonth);
  var days = [];
  while (days.length < 28 || dateToDisplay.getMonth() === focusedMonth || days.length % 7 !== 0) {
    days.push(generateDateHtml(dateToDisplay));
    dateToDisplay = addDays(dateToDisplay, 1);
  }
  var datesHtml = listToGridHtml(days, 7);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.dataset.value = currentFormattedDate;
  newCalendar.style.top = "".concat(datePickerEl.offsetHeight, "px");
  newCalendar.hidden = false;
  var content = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_DATE_PICKER_CLASS, "\">\n      <div class=\"").concat(CALENDAR_ROW_CLASS, "\">\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_YEAR_CLASS, "\"\n            aria-label=\"").concat(text.previous_year, "\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_MONTH_CLASS, "\"\n            aria-label=\"").concat(text.previous_month, "\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_MONTH_LABEL_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_MONTH_SELECTION_CLASS, "\" aria-label=\"").concat(monthLabel, ". ").concat(text.select_month, ".\"\n          >").concat(monthLabel, "</button>\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_YEAR_SELECTION_CLASS, "\" aria-label=\"").concat(focusedYear, ". ").concat(text.select_year, ".\"\n          >").concat(focusedYear, "</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_MONTH_CLASS, "\"\n            aria-label=\"").concat(text.next_month, "\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_YEAR_CLASS, "\"\n            aria-label=\"").concat(text.next_year, "\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n      </div>\n      <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <thead>\n          <tr>");
  for (var d in DAY_OF_WEEK_LABELS) {
    content += "<th class=\"".concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"").concat(DAY_OF_WEEK_LABELS[d], "\">").concat(DAY_OF_WEEK_LABELS[d].charAt(0), "</th>");
  }
  content += "</tr>\n        </thead>\n        <tbody>\n          ".concat(datesHtml, "\n        </tbody>\n      </table>\n    </div>");
  newCalendar.innerHTML = content;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  datePickerEl.classList.add(DATE_PICKER_ACTIVE_CLASS);
  if (dialogEl.hidden === true) {
    dialogEl.hidden = false;
    if (guideEl.hidden) {
      guideEl.hidden = false;
    }
  }
  var statuses = [];
  if (calendarWasHidden) {
    statusEl.textContent = "";
  } else if (_dateToDisplay.getTime() === minDate.getTime()) {
    statuses.push(text.first_possible_date);
  } else if (maxDate !== undefined && maxDate !== "" && _dateToDisplay.getTime() === maxDate.getTime()) {
    statuses.push(text.last_possible_date);
  } else {
    statuses.push(text.current_month_displayed.replace(/{monthLabel}/, monthLabel).replace(/{focusedYear}/, focusedYear));
  }
  statusEl.textContent = statuses.join(". ");
  return newCalendar;
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayPreviousYear = function displayPreviousYear(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext8 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext8.calendarEl,
    calendarDate = _getDatePickerContext8.calendarDate,
    minDate = _getDatePickerContext8.minDate,
    maxDate = _getDatePickerContext8.maxDate;
  var date = subYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate back one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayPreviousMonth = function displayPreviousMonth(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext9 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext9.calendarEl,
    calendarDate = _getDatePickerContext9.calendarDate,
    minDate = _getDatePickerContext9.minDate,
    maxDate = _getDatePickerContext9.maxDate;
  var date = subMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_MONTH);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayNextMonth = function displayNextMonth(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext10 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext10.calendarEl,
    calendarDate = _getDatePickerContext10.calendarDate,
    minDate = _getDatePickerContext10.minDate,
    maxDate = _getDatePickerContext10.maxDate;
  var date = addMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_MONTH);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
var displayNextYear = function displayNextYear(_buttonEl) {
  if (_buttonEl.disabled) return;
  var _getDatePickerContext11 = getDatePickerContext(_buttonEl),
    calendarEl = _getDatePickerContext11.calendarEl,
    calendarDate = _getDatePickerContext11.calendarDate,
    minDate = _getDatePickerContext11.minDate,
    maxDate = _getDatePickerContext11.maxDate;
  var date = addYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
var hideCalendar = function hideCalendar(el) {
  var _getDatePickerContext12 = getDatePickerContext(el),
    datePickerEl = _getDatePickerContext12.datePickerEl,
    calendarEl = _getDatePickerContext12.calendarEl,
    statusEl = _getDatePickerContext12.statusEl;
  datePickerEl.classList.remove(DATE_PICKER_ACTIVE_CLASS);
  calendarEl.hidden = true;
  statusEl.textContent = "";
};

/**
 * Select a date within the date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl A date element within the date picker component
 */
var selectDate = function selectDate(calendarDateEl) {
  if (calendarDateEl.disabled) return;
  var _getDatePickerContext13 = getDatePickerContext(calendarDateEl),
    datePickerEl = _getDatePickerContext13.datePickerEl,
    externalInputEl = _getDatePickerContext13.externalInputEl,
    dialogEl = _getDatePickerContext13.dialogEl,
    guideEl = _getDatePickerContext13.guideEl;
  setCalendarValue(calendarDateEl, calendarDateEl.dataset.value);
  hideCalendar(datePickerEl);
  dialogEl.hidden = true;
  guideEl.hidden = true;
  externalInputEl.focus();
};

/**
 * Toggle the calendar.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
var toggleCalendar = function toggleCalendar(el) {
  if (el.disabled) return;
  var _getDatePickerContext14 = getDatePickerContext(el),
    dialogEl = _getDatePickerContext14.dialogEl,
    calendarEl = _getDatePickerContext14.calendarEl,
    inputDate = _getDatePickerContext14.inputDate,
    minDate = _getDatePickerContext14.minDate,
    maxDate = _getDatePickerContext14.maxDate,
    defaultDate = _getDatePickerContext14.defaultDate,
    guideEl = _getDatePickerContext14.guideEl;
  if (calendarEl.hidden) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate || defaultDate || today(), minDate, maxDate);
    var newCalendar = renderCalendar(calendarEl, dateToDisplay);
    newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
  } else {
    hideCalendar(el);
    dialogEl.hidden = true;
    guideEl.hidden = true;
  }
};

/**
 * Update the calendar when visible.
 *
 * @param {HTMLElement} el an element within the date picker
 */
var updateCalendarIfVisible = function updateCalendarIfVisible(el) {
  var _getDatePickerContext15 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext15.calendarEl,
    inputDate = _getDatePickerContext15.inputDate,
    minDate = _getDatePickerContext15.minDate,
    maxDate = _getDatePickerContext15.maxDate;
  var calendarShown = !calendarEl.hidden;
  if (calendarShown && inputDate) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate, minDate, maxDate);
    renderCalendar(calendarEl, dateToDisplay);
  }
};

// #endregion Calendar - Date Selection View

// #region Calendar - Month Selection View
/**
 * Display the month selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @returns {HTMLElement} a reference to the new calendar element
 */
var displayMonthSelection = function displayMonthSelection(el, monthToDisplay) {
  var _getDatePickerContext16 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext16.calendarEl,
    statusEl = _getDatePickerContext16.statusEl,
    calendarDate = _getDatePickerContext16.calendarDate,
    minDate = _getDatePickerContext16.minDate,
    maxDate = _getDatePickerContext16.maxDate;
  var selectedMonth = calendarDate.getMonth();
  var focusedMonth = monthToDisplay == null ? selectedMonth : monthToDisplay;
  var months = MONTH_LABELS.map(function (month, index) {
    var monthToCheck = setMonth(calendarDate, index);
    var isDisabled = isDatesMonthOutsideMinOrMax(monthToCheck, minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_MONTH_CLASS];
    var isSelected = index === selectedMonth;
    if (index === focusedMonth) {
      tabindex = "0";
      classes.push(CALENDAR_MONTH_FOCUSED_CLASS);
    }
    if (isSelected) {
      classes.push(CALENDAR_MONTH_SELECTED_CLASS);
    }
    return "<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(index, "\"\n        data-label=\"").concat(month, "\"\n        aria-current=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(month, "</button>");
  });
  var monthsHtml = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_MONTH_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n      <tbody>\n        ").concat(listToGridHtml(months, 3), "\n      </tbody>\n    </table>\n  </div>");
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = monthsHtml;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = text.months_displayed;
  return newCalendar;
};

/**
 * Select a month in the date picker component.
 *
 * @param {HTMLButtonElement} monthEl An month element within the date picker component
 */
var selectMonth = function selectMonth(monthEl) {
  if (monthEl.disabled) return;
  var _getDatePickerContext17 = getDatePickerContext(monthEl),
    calendarEl = _getDatePickerContext17.calendarEl,
    calendarDate = _getDatePickerContext17.calendarDate,
    minDate = _getDatePickerContext17.minDate,
    maxDate = _getDatePickerContext17.maxDate;
  var selectedMonth = parseInt(monthEl.dataset.value, 10);
  var date = setMonth(calendarDate, selectedMonth);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar - Month Selection View

// #region Calendar - Year Selection View

/**
 * Display the year selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {number} yearToDisplay year to display in year selection
 * @returns {HTMLElement} a reference to the new calendar element
 */
var displayYearSelection = function displayYearSelection(el, yearToDisplay) {
  var _getDatePickerContext18 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext18.calendarEl,
    statusEl = _getDatePickerContext18.statusEl,
    calendarDate = _getDatePickerContext18.calendarDate,
    minDate = _getDatePickerContext18.minDate,
    maxDate = _getDatePickerContext18.maxDate;
  var selectedYear = calendarDate.getFullYear();
  var focusedYear = yearToDisplay == null ? selectedYear : yearToDisplay;
  var yearToChunk = focusedYear;
  yearToChunk -= yearToChunk % YEAR_CHUNK;
  yearToChunk = Math.max(0, yearToChunk);
  var prevYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk - 1), minDate, maxDate);
  var nextYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk + YEAR_CHUNK), minDate, maxDate);
  var years = [];
  var yearIndex = yearToChunk;
  while (years.length < YEAR_CHUNK) {
    var isDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearIndex), minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_YEAR_CLASS];
    var isSelected = yearIndex === selectedYear;
    if (yearIndex === focusedYear) {
      tabindex = "0";
      classes.push(CALENDAR_YEAR_FOCUSED_CLASS);
    }
    if (isSelected) {
      classes.push(CALENDAR_YEAR_SELECTED_CLASS);
    }
    years.push("<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(yearIndex, "\"\n        aria-current=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(yearIndex, "</button>"));
    yearIndex += 1;
  }
  var yearsHtml = listToGridHtml(years, 3);
  var ariaLabelPreviousYears = text.previous_years.replace(/{years}/, YEAR_CHUNK);
  var ariaLabelNextYears = text.next_years.replace(/{years}/, YEAR_CHUNK);
  var announceYears = text.years_displayed.replace(/{start}/, yearToChunk).replace(/{end}/, yearToChunk + YEAR_CHUNK - 1);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_YEAR_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <tbody>\n          <tr>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"").concat(ariaLabelPreviousYears, "\"\n                ").concat(prevYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n            <td colspan=\"3\">\n              <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n                <tbody>\n                  ").concat(yearsHtml, "\n                </tbody>\n              </table>\n            </td>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"").concat(ariaLabelNextYears, "\"\n                ").concat(nextYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>");
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = announceYears;
  return newCalendar;
};

/**
 * Navigate back by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
var displayPreviousYearChunk = function displayPreviousYearChunk(el) {
  if (el.disabled) return;
  var _getDatePickerContext19 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext19.calendarEl,
    calendarDate = _getDatePickerContext19.calendarDate,
    minDate = _getDatePickerContext19.minDate,
    maxDate = _getDatePickerContext19.maxDate;
  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear - YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR_CHUNK);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Navigate forward by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
var displayNextYearChunk = function displayNextYearChunk(el) {
  if (el.disabled) return;
  var _getDatePickerContext20 = getDatePickerContext(el),
    calendarEl = _getDatePickerContext20.calendarEl,
    calendarDate = _getDatePickerContext20.calendarDate,
    minDate = _getDatePickerContext20.minDate,
    maxDate = _getDatePickerContext20.maxDate;
  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear + YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR_CHUNK);
  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }
  nextToFocus.focus();
};

/**
 * Select a year in the date picker component.
 *
 * @param {HTMLButtonElement} yearEl A year element within the date picker component
 */
var selectYear = function selectYear(yearEl) {
  if (yearEl.disabled) return;
  var _getDatePickerContext21 = getDatePickerContext(yearEl),
    calendarEl = _getDatePickerContext21.calendarEl,
    calendarDate = _getDatePickerContext21.calendarDate,
    minDate = _getDatePickerContext21.minDate,
    maxDate = _getDatePickerContext21.maxDate;
  var selectedYear = parseInt(yearEl.innerHTML, 10);
  var date = setYear(calendarDate, selectedYear);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar - Year Selection View

// #region Calendar Event Handling

/**
 * Hide the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEscapeFromCalendar = function handleEscapeFromCalendar(event) {
  var _getDatePickerContext22 = getDatePickerContext(event.target),
    datePickerEl = _getDatePickerContext22.datePickerEl,
    externalInputEl = _getDatePickerContext22.externalInputEl,
    dialogEl = _getDatePickerContext22.dialogEl,
    guideEl = _getDatePickerContext22.guideEl;
  hideCalendar(datePickerEl);
  dialogEl.hidden = true;
  guideEl.hidden = true;
  externalInputEl.focus();
  event.preventDefault();
};

// #endregion Calendar Event Handling

// #region Calendar Date Event Handling

/**
 * Adjust the date and display the calendar if needed.
 *
 * @param {function} adjustDateFn function that returns the adjusted date
 */
var adjustCalendar = function adjustCalendar(adjustDateFn) {
  return function (event) {
    var _getDatePickerContext23 = getDatePickerContext(event.target),
      calendarEl = _getDatePickerContext23.calendarEl,
      calendarDate = _getDatePickerContext23.calendarDate,
      minDate = _getDatePickerContext23.minDate,
      maxDate = _getDatePickerContext23.maxDate;
    var date = adjustDateFn(calendarDate);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameDay(calendarDate, cappedDate)) {
      var newCalendar = renderCalendar(calendarEl, cappedDate);
      newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
    }
    event.preventDefault();
  };
};

/**
 * Navigate back one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleUpFromDate = adjustCalendar(function (date) {
  return subWeeks(date, 1);
});

/**
 * Navigate forward one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleDownFromDate = adjustCalendar(function (date) {
  return addWeeks(date, 1);
});

/**
 * Navigate back one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleLeftFromDate = adjustCalendar(function (date) {
  return subDays(date, 1);
});

/**
 * Navigate forward one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleRightFromDate = adjustCalendar(function (date) {
  return addDays(date, 1);
});

/**
 * Navigate to the start of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleHomeFromDate = adjustCalendar(function (date) {
  return startOfWeek(date);
});

/**
 * Navigate to the end of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEndFromDate = adjustCalendar(function (date) {
  return endOfWeek(date);
});

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageDownFromDate = adjustCalendar(function (date) {
  return addMonths(date, 1);
});

/**
 * Navigate back one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageUpFromDate = adjustCalendar(function (date) {
  return subMonths(date, 1);
});

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleShiftPageDownFromDate = adjustCalendar(function (date) {
  return addYears(date, 1);
});

/**
 * Navigate back one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleShiftPageUpFromDate = adjustCalendar(function (date) {
  return subYears(date, 1);
});

/**
 * display the calendar for the mousemove date.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A date element within the date picker component
 */
var handleMousemoveFromDate = function handleMousemoveFromDate(dateEl) {
  if (dateEl.disabled) return;
  var calendarEl = dateEl.closest(DATE_PICKER_CALENDAR);
  var currentCalendarDate = calendarEl.dataset.value;
  var hoverDate = dateEl.dataset.value;
  if (hoverDate === currentCalendarDate) return;
  var dateToDisplay = parseDateString(hoverDate);
  var newCalendar = renderCalendar(calendarEl, dateToDisplay);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

// #endregion Calendar Date Event Handling

// #region Calendar Month Event Handling

/**
 * Adjust the month and display the month selection screen if needed.
 *
 * @param {function} adjustMonthFn function that returns the adjusted month
 */
var adjustMonthSelectionScreen = function adjustMonthSelectionScreen(adjustMonthFn) {
  return function (event) {
    var monthEl = event.target;
    var selectedMonth = parseInt(monthEl.dataset.value, 10);
    var _getDatePickerContext24 = getDatePickerContext(monthEl),
      calendarEl = _getDatePickerContext24.calendarEl,
      calendarDate = _getDatePickerContext24.calendarDate,
      minDate = _getDatePickerContext24.minDate,
      maxDate = _getDatePickerContext24.maxDate;
    var currentDate = setMonth(calendarDate, selectedMonth);
    var adjustedMonth = adjustMonthFn(selectedMonth);
    adjustedMonth = Math.max(0, Math.min(11, adjustedMonth));
    var date = setMonth(calendarDate, adjustedMonth);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameMonth(currentDate, cappedDate)) {
      var newCalendar = displayMonthSelection(calendarEl, cappedDate.getMonth());
      newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
    }
    event.preventDefault();
  };
};

/**
 * Navigate back three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleUpFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 3;
});

/**
 * Navigate forward three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleDownFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 3;
});

/**
 * Navigate back one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleLeftFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 1;
});

/**
 * Navigate forward one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleRightFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 1;
});

/**
 * Navigate to the start of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleHomeFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - month % 3;
});

/**
 * Navigate to the end of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEndFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 2 - month % 3;
});

/**
 * Navigate to the last month (December) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageDownFromMonth = adjustMonthSelectionScreen(function () {
  return 11;
});

/**
 * Navigate to the first month (January) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageUpFromMonth = adjustMonthSelectionScreen(function () {
  return 0;
});

/**
 * update the focus on a month when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} monthEl A month element within the date picker component
 */
var handleMousemoveFromMonth = function handleMousemoveFromMonth(monthEl) {
  if (monthEl.disabled) return;
  if (monthEl.classList.contains(CALENDAR_MONTH_FOCUSED_CLASS)) return;
  var focusMonth = parseInt(monthEl.dataset.value, 10);
  var newCalendar = displayMonthSelection(monthEl, focusMonth);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
};

// #endregion Calendar Month Event Handling

// #region Calendar Year Event Handling

/**
 * Adjust the year and display the year selection screen if needed.
 *
 * @param {function} adjustYearFn function that returns the adjusted year
 */
var adjustYearSelectionScreen = function adjustYearSelectionScreen(adjustYearFn) {
  return function (event) {
    var yearEl = event.target;
    var selectedYear = parseInt(yearEl.dataset.value, 10);
    var _getDatePickerContext25 = getDatePickerContext(yearEl),
      calendarEl = _getDatePickerContext25.calendarEl,
      calendarDate = _getDatePickerContext25.calendarDate,
      minDate = _getDatePickerContext25.minDate,
      maxDate = _getDatePickerContext25.maxDate;
    var currentDate = setYear(calendarDate, selectedYear);
    var adjustedYear = adjustYearFn(selectedYear);
    adjustedYear = Math.max(0, adjustedYear);
    var date = setYear(calendarDate, adjustedYear);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
    if (!isSameYear(currentDate, cappedDate)) {
      var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
      newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
    }
    event.preventDefault();
  };
};

/**
 * Navigate back three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - 3;
});

/**
 * Navigate forward three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + 3;
});

/**
 * Navigate back one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleLeftFromYear = adjustYearSelectionScreen(function (year) {
  return year - 1;
});

/**
 * Navigate forward one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleRightFromYear = adjustYearSelectionScreen(function (year) {
  return year + 1;
});

/**
 * Navigate to the start of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleHomeFromYear = adjustYearSelectionScreen(function (year) {
  return year - year % 3;
});

/**
 * Navigate to the end of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handleEndFromYear = adjustYearSelectionScreen(function (year) {
  return year + 2 - year % 3;
});

/**
 * Navigate to back 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - YEAR_CHUNK;
});

/**
 * Navigate forward 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */
var handlePageDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + YEAR_CHUNK;
});

/**
 * update the focus on a year when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A year element within the date picker component
 */
var handleMousemoveFromYear = function handleMousemoveFromYear(yearEl) {
  if (yearEl.disabled) return;
  if (yearEl.classList.contains(CALENDAR_YEAR_FOCUSED_CLASS)) return;
  var focusYear = parseInt(yearEl.dataset.value, 10);
  var newCalendar = displayYearSelection(yearEl, focusYear);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
};

// #endregion Calendar Year Event Handling

// #region Focus Handling Event Handling

var tabHandler = function tabHandler(focusable) {
  var getFocusableContext = function getFocusableContext(el) {
    var _getDatePickerContext26 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext26.calendarEl;
    var focusableElements = select(focusable, calendarEl);
    var firstTabIndex = 0;
    var lastTabIndex = focusableElements.length - 1;
    var firstTabStop = focusableElements[firstTabIndex];
    var lastTabStop = focusableElements[lastTabIndex];
    var focusIndex = focusableElements.indexOf(activeElement());
    var isLastTab = focusIndex === lastTabIndex;
    var isFirstTab = focusIndex === firstTabIndex;
    var isNotFound = focusIndex === -1;
    return {
      focusableElements: focusableElements,
      isNotFound: isNotFound,
      firstTabStop: firstTabStop,
      isFirstTab: isFirstTab,
      lastTabStop: lastTabStop,
      isLastTab: isLastTab
    };
  };
  return {
    tabAhead: function tabAhead(event) {
      var _getFocusableContext = getFocusableContext(event.target),
        firstTabStop = _getFocusableContext.firstTabStop,
        isLastTab = _getFocusableContext.isLastTab,
        isNotFound = _getFocusableContext.isNotFound;
      if (isLastTab || isNotFound) {
        event.preventDefault();
        firstTabStop.focus();
      }
    },
    tabBack: function tabBack(event) {
      var _getFocusableContext2 = getFocusableContext(event.target),
        lastTabStop = _getFocusableContext2.lastTabStop,
        isFirstTab = _getFocusableContext2.isFirstTab,
        isNotFound = _getFocusableContext2.isNotFound;
      if (isFirstTab || isNotFound) {
        event.preventDefault();
        lastTabStop.focus();
      }
    }
  };
};
var datePickerTabEventHandler = tabHandler(DATE_PICKER_FOCUSABLE);
var monthPickerTabEventHandler = tabHandler(MONTH_PICKER_FOCUSABLE);
var yearPickerTabEventHandler = tabHandler(YEAR_PICKER_FOCUSABLE);

// #endregion Focus Handling Event Handling

// #region Date Picker Event Delegation Registration / Component

var datePickerEvents = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, CLICK, (_CLICK = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_CLICK, DATE_PICKER_BUTTON, function () {
  toggleCalendar(this);
}), CALENDAR_DATE, function () {
  selectDate(this);
}), CALENDAR_MONTH, function () {
  selectMonth(this);
}), CALENDAR_YEAR, function () {
  selectYear(this);
}), CALENDAR_PREVIOUS_MONTH, function () {
  displayPreviousMonth(this);
}), CALENDAR_NEXT_MONTH, function () {
  displayNextMonth(this);
}), CALENDAR_PREVIOUS_YEAR, function () {
  displayPreviousYear(this);
}), CALENDAR_NEXT_YEAR, function () {
  displayNextYear(this);
}), CALENDAR_PREVIOUS_YEAR_CHUNK, function () {
  displayPreviousYearChunk(this);
}), CALENDAR_NEXT_YEAR_CHUNK, function () {
  displayNextYearChunk(this);
}), _defineProperty(_defineProperty(_CLICK, CALENDAR_MONTH_SELECTION, function () {
  var newCalendar = displayMonthSelection(this);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
}), CALENDAR_YEAR_SELECTION, function () {
  var newCalendar = displayYearSelection(this);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
}))), "keyup", _defineProperty({}, DATE_PICKER_CALENDAR, function (event) {
  var keydown = this.dataset.keydownKeyCode;
  if ("".concat(event.keyCode) !== keydown) {
    event.preventDefault();
  }
})), "keydown", _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, DATE_PICKER_EXTERNAL_INPUT, function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    validateDateInput(this);
  }
}), CALENDAR_DATE, (0, _receptor.keymap)({
  Up: handleUpFromDate,
  ArrowUp: handleUpFromDate,
  Down: handleDownFromDate,
  ArrowDown: handleDownFromDate,
  Left: handleLeftFromDate,
  ArrowLeft: handleLeftFromDate,
  Right: handleRightFromDate,
  ArrowRight: handleRightFromDate,
  Home: handleHomeFromDate,
  End: handleEndFromDate,
  PageDown: handlePageDownFromDate,
  PageUp: handlePageUpFromDate,
  "Shift+PageDown": handleShiftPageDownFromDate,
  "Shift+PageUp": handleShiftPageUpFromDate
})), CALENDAR_DATE_PICKER, (0, _receptor.keymap)({
  Tab: datePickerTabEventHandler.tabAhead,
  "Shift+Tab": datePickerTabEventHandler.tabBack
})), CALENDAR_MONTH, (0, _receptor.keymap)({
  Up: handleUpFromMonth,
  ArrowUp: handleUpFromMonth,
  Down: handleDownFromMonth,
  ArrowDown: handleDownFromMonth,
  Left: handleLeftFromMonth,
  ArrowLeft: handleLeftFromMonth,
  Right: handleRightFromMonth,
  ArrowRight: handleRightFromMonth,
  Home: handleHomeFromMonth,
  End: handleEndFromMonth,
  PageDown: handlePageDownFromMonth,
  PageUp: handlePageUpFromMonth
})), CALENDAR_MONTH_PICKER, (0, _receptor.keymap)({
  Tab: monthPickerTabEventHandler.tabAhead,
  "Shift+Tab": monthPickerTabEventHandler.tabBack
})), CALENDAR_YEAR, (0, _receptor.keymap)({
  Up: handleUpFromYear,
  ArrowUp: handleUpFromYear,
  Down: handleDownFromYear,
  ArrowDown: handleDownFromYear,
  Left: handleLeftFromYear,
  ArrowLeft: handleLeftFromYear,
  Right: handleRightFromYear,
  ArrowRight: handleRightFromYear,
  Home: handleHomeFromYear,
  End: handleEndFromYear,
  PageDown: handlePageDownFromYear,
  PageUp: handlePageUpFromYear
})), CALENDAR_YEAR_PICKER, (0, _receptor.keymap)({
  Tab: yearPickerTabEventHandler.tabAhead,
  "Shift+Tab": yearPickerTabEventHandler.tabBack
})), DATE_PICKER_CALENDAR, function (event) {
  this.dataset.keydownKeyCode = event.keyCode;
}), DATE_PICKER, function (event) {
  var keyMap = (0, _receptor.keymap)({
    Escape: handleEscapeFromCalendar
  });
  keyMap(event);
})), "focusout", _defineProperty(_defineProperty({}, DATE_PICKER_EXTERNAL_INPUT, function () {
  validateDateInput(this);
}), DATE_PICKER, function (event) {
  if (!this.contains(event.relatedTarget)) {
    hideCalendar(this);
  }
})), "input", _defineProperty({}, DATE_PICKER_EXTERNAL_INPUT, function () {
  reconcileInputValues(this);
  updateCalendarIfVisible(this);
}));
if (!isIosDevice()) {
  datePickerEvents.mousemove = _defineProperty(_defineProperty(_defineProperty({}, CALENDAR_DATE_CURRENT_MONTH, function () {
    handleMousemoveFromDate(this);
  }), CALENDAR_MONTH, function () {
    handleMousemoveFromMonth(this);
  }), CALENDAR_YEAR, function () {
    handleMousemoveFromYear(this);
  });
}
var datePicker = behavior(datePickerEvents, {
  init: function init(root) {
    select(DATE_PICKER, root).forEach(function (datePickerEl) {
      if (!datePickerEl.classList.contains(DATE_PICKER_INITIALIZED_CLASS)) {
        enhanceDatePicker(datePickerEl);
      }
    });
  },
  setLanguage: function setLanguage(strings) {
    text = strings;
    MONTH_LABELS = [text.january, text.february, text.march, text.april, text.may, text.june, text.july, text.august, text.september, text.october, text.november, text.december];
    DAY_OF_WEEK_LABELS = [text.monday, text.tuesday, text.wednesday, text.thursday, text.friday, text.saturday, text.sunday];
  },
  getDatePickerContext: getDatePickerContext,
  disable: disable,
  enable: enable,
  isDateInputInvalid: isDateInputInvalid,
  setCalendarValue: setCalendarValue,
  validateDateInput: validateDateInput,
  renderCalendar: renderCalendar,
  updateCalendarIfVisible: updateCalendarIfVisible
});

// #endregion Date Picker Event Delegation Registration / Component

module.exports = datePicker;

},{"../config":90,"../events":92,"../utils/active-element":99,"../utils/behavior":100,"../utils/is-ios-device":103,"../utils/select":104,"receptor":70}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dropdown = _interopRequireDefault(require("./dropdown"));
require("../polyfills/Function/prototype/bind");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Add functionality to sorting variant of Overflow menu component
 * @param {HTMLElement} container .overflow-menu element
 */
function DropdownSort(container) {
  this.container = container;
  this.button = container.getElementsByClassName('button-overflow-menu')[0];

  // if no value is selected, choose first option
  if (!this.container.querySelector('.overflow-list li button[aria-current="true"]')) {
    this.container.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', "true");
  }
  this.updateSelectedValue();
}

/**
 * Add click events on overflow menu and options in menu
 */
DropdownSort.prototype.init = function () {
  this.overflowMenu = new _dropdown["default"](this.button).init();
  var sortingOptions = this.container.querySelectorAll('.overflow-list li button');
  for (var s = 0; s < sortingOptions.length; s++) {
    var option = sortingOptions[s];
    option.addEventListener('click', this.onOptionClick.bind(this));
  }
};

/**
 * Update button text to selected value
 */
DropdownSort.prototype.updateSelectedValue = function () {
  var selectedItem = this.container.querySelector('.overflow-list li button[aria-current="true"]');
  this.container.getElementsByClassName('button-overflow-menu')[0].getElementsByClassName('selected-value')[0].innerText = selectedItem.innerText;
};

/**
 * Triggers when choosing option in menu
 * @param {PointerEvent} e
 */
DropdownSort.prototype.onOptionClick = function (e) {
  var li = e.target.parentNode;
  li.parentNode.querySelector('li button[aria-current="true"]').removeAttribute('aria-current');
  li.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', 'true');
  var button = li.parentNode.parentNode.parentNode.getElementsByClassName('button-overflow-menu')[0];
  var eventSelected = new Event('fds.dropdown.selected');
  eventSelected.detail = this.target;
  button.dispatchEvent(eventSelected);
  this.updateSelectedValue();

  // hide menu
  var overflowMenu = new _dropdown["default"](button);
  overflowMenu.hide();
};
var _default = exports["default"] = DropdownSort;

},{"../polyfills/Function/prototype/bind":93,"./dropdown":79}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var breakpoints = require('../utils/breakpoints');
var BUTTON = '.button-overflow-menu';
var jsDropdownCollapseModifier = 'js-dropdown--responsive-collapse'; //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
var TARGET = 'data-js-target';

/**
 * Add functionality to overflow menu component
 * @param {HTMLButtonElement} buttonElement Overflow menu button
 */
function Dropdown(buttonElement) {
  this.buttonElement = buttonElement;
  this.targetEl = null;
  this.responsiveListCollapseEnabled = false;
  if (this.buttonElement === null || this.buttonElement === undefined) {
    throw new Error("Could not find button for overflow menu component.");
  }
  var targetAttr = this.buttonElement.getAttribute(TARGET);
  if (targetAttr === null || targetAttr === undefined) {
    throw new Error('Attribute could not be found on overflow menu component: ' + TARGET);
  }
  var targetEl = document.getElementById(targetAttr.replace('#', ''));
  if (targetEl === null || targetEl === undefined) {
    throw new Error('Panel for overflow menu component could not be found.');
  }
  this.targetEl = targetEl;
}

/**
 * Set click events
 */
Dropdown.prototype.init = function () {
  if (this.buttonElement !== null && this.buttonElement !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
    if (this.buttonElement.parentNode.classList.contains('overflow-menu--md-no-responsive') || this.buttonElement.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      this.responsiveListCollapseEnabled = true;
    }

    //Clicked outside dropdown -> close it
    document.getElementsByTagName('body')[0].removeEventListener('click', outsideClose);
    document.getElementsByTagName('body')[0].addEventListener('click', outsideClose);
    //Clicked on dropdown open button --> toggle it
    this.buttonElement.removeEventListener('click', toggleDropdown);
    this.buttonElement.addEventListener('click', toggleDropdown);
    var $module = this;
    // set aria-hidden correctly for screenreaders (Tringuide responsive)
    if (this.responsiveListCollapseEnabled) {
      var element = this.buttonElement;
      if (window.IntersectionObserver) {
        // trigger event when button changes visibility
        var observer = new IntersectionObserver(function (entries) {
          // button is visible
          if (entries[0].intersectionRatio) {
            if (element.getAttribute('aria-expanded') === 'false') {
              $module.targetEl.setAttribute('aria-hidden', 'true');
            }
          } else {
            // button is not visible
            if ($module.targetEl.getAttribute('aria-hidden') === 'true') {
              $module.targetEl.setAttribute('aria-hidden', 'false');
            }
          }
        }, {
          root: document.body
        });
        observer.observe(element);
      } else {
        // IE: IntersectionObserver is not supported, so we listen for window resize and grid breakpoint instead
        if (doResponsiveCollapse($module.triggerEl)) {
          // small screen
          if (element.getAttribute('aria-expanded') === 'false') {
            $module.targetEl.setAttribute('aria-hidden', 'true');
          } else {
            $module.targetEl.setAttribute('aria-hidden', 'false');
          }
        } else {
          // Large screen
          $module.targetEl.setAttribute('aria-hidden', 'false');
        }
        window.addEventListener('resize', function () {
          if (doResponsiveCollapse($module.triggerEl)) {
            if (element.getAttribute('aria-expanded') === 'false') {
              $module.targetEl.setAttribute('aria-hidden', 'true');
            } else {
              $module.targetEl.setAttribute('aria-hidden', 'false');
            }
          } else {
            $module.targetEl.setAttribute('aria-hidden', 'false');
          }
        });
      }
    }
    document.removeEventListener('keyup', closeOnEscape);
    document.addEventListener('keyup', closeOnEscape);
  }
};

/**
 * Hide overflow menu
 */
Dropdown.prototype.hide = function () {
  toggle(this.buttonElement);
};

/**
 * Show overflow menu
 */
Dropdown.prototype.show = function () {
  toggle(this.buttonElement);
};
var closeOnEscape = function closeOnEscape(event) {
  var key = event.which || event.keyCode;
  if (key === 27) {
    closeAll(event);
  }
};

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param parent accordion element
 * @returns {NodeListOf<SVGElementTagNameMap[[string]]> | NodeListOf<HTMLElementTagNameMap[[string]]> | NodeListOf<Element>}
 */
var getButtons = function getButtons(parent) {
  return parent.querySelectorAll(BUTTON);
};

/**
 * Close all overflow menus
 * @param {event} event default is null
 */
var closeAll = function closeAll() {
  var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var changed = false;
  var body = document.querySelector('body');
  var overflowMenuEl = document.getElementsByClassName('overflow-menu');
  for (var oi = 0; oi < overflowMenuEl.length; oi++) {
    var currentOverflowMenuEL = overflowMenuEl[oi];
    var triggerEl = currentOverflowMenuEL.querySelector(BUTTON + '[aria-expanded="true"]');
    if (triggerEl !== null) {
      changed = true;
      var targetEl = document.getElementById(triggerEl.getAttribute(TARGET).replace('#', ''));
      if (targetEl !== null && triggerEl !== null) {
        if (doResponsiveCollapse(triggerEl)) {
          if (triggerEl.getAttribute('aria-expanded') === true) {
            var eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }
          triggerEl.setAttribute('aria-expanded', 'false');
          targetEl.classList.add('collapsed');
          targetEl.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }
  if (changed && event !== null) {
    event.stopImmediatePropagation();
  }
};
var offset = function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};
var toggleDropdown = function toggleDropdown(event) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  event.stopPropagation();
  event.preventDefault();
  toggle(this, forceClose);
};
var toggle = function toggle(button) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var triggerEl = button;
  var targetEl = null;
  if (triggerEl !== null && triggerEl !== undefined) {
    var targetAttr = triggerEl.getAttribute(TARGET);
    if (targetAttr !== null && targetAttr !== undefined) {
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
  }
  if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
    //change state

    targetEl.style.left = null;
    targetEl.style.right = null;
    if (triggerEl.getAttribute('aria-expanded') === 'true' || forceClose) {
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.classList.add('collapsed');
      targetEl.setAttribute('aria-hidden', 'true');
      var eventClose = new Event('fds.dropdown.close');
      triggerEl.dispatchEvent(eventClose);
    } else {
      if (!document.getElementsByTagName('body')[0].classList.contains('mobile_nav-active')) {
        closeAll();
      }
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.classList.remove('collapsed');
      targetEl.setAttribute('aria-hidden', 'false');
      var eventOpen = new Event('fds.dropdown.open');
      triggerEl.dispatchEvent(eventOpen);
      var targetOffset = offset(targetEl);
      if (targetOffset.left < 0) {
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      var right = targetOffset.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {
        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }
      var offsetAgain = offset(targetEl);
      if (offsetAgain.left < 0) {
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      right = offsetAgain.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {
        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }
    }
  }
};
var hasParent = function hasParent(child, parentTagName) {
  if (child.parentNode.tagName === parentTagName) {
    return true;
  } else if (parentTagName !== 'BODY' && child.parentNode.tagName !== 'BODY') {
    return hasParent(child.parentNode, parentTagName);
  } else {
    return false;
  }
};
var outsideClose = function outsideClose(evt) {
  if (!document.getElementsByTagName('body')[0].classList.contains('mobile_nav-active')) {
    if (document.querySelector('body.mobile_nav-active') === null && !evt.target.classList.contains('button-menu-close')) {
      var openDropdowns = document.querySelectorAll(BUTTON + '[aria-expanded=true]');
      for (var i = 0; i < openDropdowns.length; i++) {
        var triggerEl = openDropdowns[i];
        var targetEl = null;
        var targetAttr = triggerEl.getAttribute(TARGET);
        if (targetAttr !== null && targetAttr !== undefined) {
          if (targetAttr.indexOf('#') !== -1) {
            targetAttr = targetAttr.replace('#', '');
          }
          targetEl = document.getElementById(targetAttr);
        }
        if (doResponsiveCollapse(triggerEl) || hasParent(triggerEl, 'HEADER') && !evt.target.classList.contains('overlay')) {
          //closes dropdown when clicked outside
          if (evt.target !== triggerEl) {
            //clicked outside trigger, force close
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
            var eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }
        }
      }
    }
  }
};
var doResponsiveCollapse = function doResponsiveCollapse(triggerEl) {
  if (!triggerEl.classList.contains(jsDropdownCollapseModifier)) {
    // not nav overflow menu
    if (triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive') || triggerEl.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      // trinindikator overflow menu
      if (window.innerWidth <= getTringuideBreakpoint(triggerEl)) {
        // overflow menu på responsiv tringuide aktiveret
        return true;
      }
    } else {
      // normal overflow menu
      return true;
    }
  }
  return false;
};
var getTringuideBreakpoint = function getTringuideBreakpoint(button) {
  if (button.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
    return breakpoints.md;
  }
  if (button.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
    return breakpoints.lg;
  }
};
var _default = exports["default"] = Dropdown;

},{"../utils/breakpoints":101}],80:[function(require,module,exports){
'use strict';

/**
 * Handle focus on input elements upon clicking link in error message
 * @param {HTMLElement} element Error summary element
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function ErrorSummary(element) {
  this.element = element;
}

/**
 * Set events on links in error summary
 */
ErrorSummary.prototype.init = function () {
  if (!this.element) {
    return;
  }
  this.element.focus();
  this.element.addEventListener('click', this.handleClick.bind(this));
};

/**
* Click event handler
*
* @param {MouseEvent} event - Click event
*/
ErrorSummary.prototype.handleClick = function (event) {
  var target = event.target;
  if (this.focusTarget(target)) {
    event.preventDefault();
  }
};

/**
 * Focus the target element
 *
 * By default, the browser will scroll the target into view. Because our labels
 * or legends appear above the input, this means the user will be presented with
 * an input without any context, as the label or legend will be off the top of
 * the screen.
 *
 * Manually handling the click event, scrolling the question into view and then
 * focussing the element solves this.
 *
 * This also results in the label and/or legend being announced correctly in
 * NVDA (as tested in 2018.3.2) - without this only the field type is announced
 * (e.g. "Edit, has autocomplete").
 *
 * @param {HTMLElement} $target - Event target
 * @returns {boolean} True if the target was able to be focussed
 */
ErrorSummary.prototype.focusTarget = function ($target) {
  // If the element that was clicked was not a link, return early
  if ($target.tagName !== 'A' || $target.href === false) {
    return false;
  }
  var inputId = this.getFragmentFromUrl($target.href);
  var $input = document.getElementById(inputId);
  if (!$input) {
    return false;
  }
  var $legendOrLabel = this.getAssociatedLegendOrLabel($input);
  if (!$legendOrLabel) {
    return false;
  }

  // Scroll the legend or label into view *before* calling focus on the input to
  // avoid extra scrolling in browsers that don't support `preventScroll` (which
  // at time of writing is most of them...)
  $legendOrLabel.scrollIntoView();
  $input.focus({
    preventScroll: true
  });
  return true;
};

/**
 * Get fragment from URL
 *
 * Extract the fragment (everything after the hash) from a URL, but not including
 * the hash.
 *
 * @param {string} url - URL
 * @returns {string} Fragment from URL, without the hash
 */
ErrorSummary.prototype.getFragmentFromUrl = function (url) {
  if (url.indexOf('#') === -1) {
    return false;
  }
  return url.split('#').pop();
};

/**
 * Get associated legend or label
 *
 * Returns the first element that exists from this list:
 *
 * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
 *   as the top of it is no more than half a viewport height away from the
 *   bottom of the input
 * - The first `<label>` that is associated with the input using for="inputId"
 * - The closest parent `<label>`
 *
 * @param {HTMLElement} $input - The input
 * @returns {HTMLElement} Associated legend or label, or null if no associated
 *                        legend or label can be found
 */
ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
  var $fieldset = $input.closest('fieldset');
  if ($fieldset) {
    var legends = $fieldset.getElementsByTagName('legend');
    if (legends.length) {
      var $candidateLegend = legends[0];

      // If the input type is radio or checkbox, always use the legend if there
      // is one.
      if ($input.type === 'checkbox' || $input.type === 'radio') {
        return $candidateLegend;
      }

      // For other input types, only scroll to the fieldset’s legend (instead of
      // the label associated with the input) if the input would end up in the
      // top half of the screen.
      //
      // This should avoid situations where the input either ends up off the
      // screen, or obscured by a software keyboard.
      var legendTop = $candidateLegend.getBoundingClientRect().top;
      var inputRect = $input.getBoundingClientRect();

      // If the browser doesn't support Element.getBoundingClientRect().height
      // or window.innerHeight (like IE8), bail and just link to the label.
      if (inputRect.height && window.innerHeight) {
        var inputBottom = inputRect.top + inputRect.height;
        if (inputBottom - legendTop < window.innerHeight / 2) {
          return $candidateLegend;
        }
      }
    }
  }
  return document.querySelector("label[for='" + $input.getAttribute('id') + "']") || $input.closest('label');
};
var _default = exports["default"] = ErrorSummary;

},{}],81:[function(require,module,exports){
'use strict';

/**
 * Adds click functionality to modal
 * @param {HTMLElement} $modal Modal element
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Modal($modal) {
  this.$modal = $modal;
  var id = this.$modal.getAttribute('id');
  this.triggers = document.querySelectorAll('[data-module="modal"][data-target="' + id + '"]');
}

/**
 * Set events
 */
Modal.prototype.init = function () {
  var triggers = this.triggers;
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    trigger.addEventListener('click', this.show.bind(this));
  }
  var closers = this.$modal.querySelectorAll('[data-modal-close]');
  for (var c = 0; c < closers.length; c++) {
    var closer = closers[c];
    closer.addEventListener('click', this.hide.bind(this));
  }
};

/**
 * Hide modal
 */
Modal.prototype.hide = function () {
  var modalElement = this.$modal;
  if (modalElement !== null) {
    modalElement.setAttribute('aria-hidden', 'true');
    var eventClose = document.createEvent('Event');
    eventClose.initEvent('fds.modal.hidden', true, true);
    modalElement.dispatchEvent(eventClose);
    var $backdrop = document.querySelector('#modal-backdrop');
    $backdrop === null || $backdrop === void 0 || $backdrop.parentNode.removeChild($backdrop);
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.removeEventListener('keydown', trapFocus, true);
    if (!hasForcedAction(modalElement)) {
      document.removeEventListener('keyup', handleEscape);
    }
    var dataModalOpener = modalElement.getAttribute('data-modal-opener');
    if (dataModalOpener !== null) {
      var opener = document.getElementById(dataModalOpener);
      if (opener !== null) {
        opener.focus();
      }
      modalElement.removeAttribute('data-modal-opener');
    }
  }
};

/**
 * Show modal
 */
Modal.prototype.show = function () {
  var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var modalElement = this.$modal;
  if (modalElement !== null) {
    if (e !== null) {
      var openerId = e.target.getAttribute('id');
      if (openerId === null) {
        openerId = 'modal-opener-' + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        e.target.setAttribute('id', openerId);
      }
      modalElement.setAttribute('data-modal-opener', openerId);
    }

    // Hide open modals - FDS do not recommend more than one open modal at a time
    var activeModals = document.querySelectorAll('.fds-modal[aria-hidden=false]');
    for (var i = 0; i < activeModals.length; i++) {
      new Modal(activeModals[i]).hide();
    }
    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.setAttribute('tabindex', '-1');
    var eventOpen = document.createEvent('Event');
    eventOpen.initEvent('fds.modal.shown', true, true);
    modalElement.dispatchEvent(eventOpen);
    var $backdrop = document.createElement('div');
    $backdrop.classList.add('modal-backdrop');
    $backdrop.setAttribute('id', "modal-backdrop");
    document.getElementsByTagName('body')[0].appendChild($backdrop);
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    modalElement.focus();
    document.addEventListener('keydown', trapFocus, true);
    if (!hasForcedAction(modalElement)) {
      document.addEventListener('keyup', handleEscape);
    }
  }
};

/**
 * Close modal when hitting ESC
 * @param {KeyboardEvent} event 
 */
var handleEscape = function handleEscape(event) {
  var key = event.which || event.keyCode;
  var modalElement = document.querySelector('.fds-modal[aria-hidden=false]');
  var currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
  if (key === 27) {
    var possibleOverflowMenus = modalElement.querySelectorAll('.button-overflow-menu[aria-expanded="true"]');
    if (possibleOverflowMenus.length === 0) {
      currentModal.hide();
    }
  }
};

/**
 * Trap focus in modal when open
 * @param {PointerEvent} e
 */
function trapFocus(e) {
  var currentDialog = document.querySelector('.fds-modal[aria-hidden=false]');
  if (currentDialog !== null) {
    var focusableElements = currentDialog.querySelectorAll('a[href]:not([disabled]):not([aria-hidden=true]), button:not([disabled]):not([aria-hidden=true]), textarea:not([disabled]):not([aria-hidden=true]), input:not([type=hidden]):not([disabled]):not([aria-hidden=true]), select:not([disabled]):not([aria-hidden=true]), details:not([disabled]):not([aria-hidden=true]), [tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden=true])');
    var firstFocusableElement = focusableElements[0];
    var lastFocusableElement = focusableElements[focusableElements.length - 1];
    var isTabPressed = e.key === 'Tab' || e.keyCode === 9;
    if (!isTabPressed) {
      return;
    }
    if (e.shiftKey) /* shift + tab */{
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else /* tab */{
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
  }
}
;
function hasForcedAction(modal) {
  if (modal.getAttribute('data-modal-forced-action') === null) {
    return false;
  }
  return true;
}
var _default = exports["default"] = Modal;

},{}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var forEach = require('array-foreach');
var select = require('../utils/select');
var NAV = ".nav";
var NAV_LINKS = "".concat(NAV, " a");
var OPENERS = ".js-menu-open";
var CLOSE_BUTTON = ".js-menu-close";
var OVERLAY = ".overlay";
var CLOSERS = "".concat(CLOSE_BUTTON, ", .overlay");
var TOGGLES = [NAV, OVERLAY].join(', ');
var ACTIVE_CLASS = 'mobile_nav-active';
var VISIBLE_CLASS = 'is-visible';

/**
 * Add mobile menu functionality
 */
var Navigation = /*#__PURE__*/function () {
  function Navigation() {
    _classCallCheck(this, Navigation);
  }
  _createClass(Navigation, [{
    key: "init",
    value:
    /**
     * Set events
     */
    function init() {
      window.addEventListener('resize', mobileMenu, false);
      mobileMenu();
    }

    /**
     * Remove events
     */
  }, {
    key: "teardown",
    value: function teardown() {
      window.removeEventListener('resize', mobileMenu, false);
    }
  }]);
  return Navigation;
}();
/**
 * Add functionality to mobile menu
 */
var mobileMenu = function mobileMenu() {
  var mobile = false;
  var openers = document.querySelectorAll(OPENERS);
  for (var o = 0; o < openers.length; o++) {
    if (window.getComputedStyle(openers[o], null).display !== 'none') {
      openers[o].addEventListener('click', toggleNav);
      mobile = true;
    }
  }

  // if mobile
  if (mobile) {
    var closers = document.querySelectorAll(CLOSERS);
    for (var c = 0; c < closers.length; c++) {
      closers[c].addEventListener('click', toggleNav);
    }
    var navLinks = document.querySelectorAll(NAV_LINKS);
    for (var n = 0; n < navLinks.length; n++) {
      navLinks[n].addEventListener('click', function () {
        // A navigation link has been clicked! We want to collapse any
        // hierarchical navigation UI it's a part of, so that the user
        // can focus on whatever they've just selected.

        // Some navigation links are inside dropdowns; when they're
        // clicked, we want to collapse those dropdowns.

        // If the mobile navigation menu is active, we want to hide it.
        if (isActive()) {
          toggleNav.call(this, false);
        }
      });
    }
    var trapContainers = document.querySelectorAll(NAV);
    for (var i = 0; i < trapContainers.length; i++) {
      focusTrap = _focusTrap(trapContainers[i]);
    }
  }
  var closer = document.body.querySelector(CLOSE_BUTTON);
  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

/**
 * Check if mobile menu is active
 * @returns true if mobile menu is active and false if not active
 */
var isActive = function isActive() {
  return document.body.classList.contains(ACTIVE_CLASS);
};

/**
 * Trap focus in mobile menu if active
 * @param {HTMLElement} trapContainer 
 */
var _focusTrap = function _focusTrap(trapContainer) {
  // Find all focusable children
  var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  var focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  var firstTabStop = focusableElements[0];
  function trapTabKey(e) {
    var key = event.which || event.keyCode;
    // Check for TAB key press
    if (key === 9) {
      var lastTabStop = null;
      for (var i = 0; i < focusableElements.length; i++) {
        var number = focusableElements.length - 1;
        var element = focusableElements[number - i];
        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
          lastTabStop = element;
          break;
        }
      }

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

        // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.key === 'Escape') {
      toggleNav.call(this, false);
    }
  }
  return {
    enable: function enable() {
      // Focus first child
      firstTabStop.focus();
      // Listen for and trap the keyboard
      document.addEventListener('keydown', trapTabKey);
    },
    release: function release() {
      document.removeEventListener('keydown', trapTabKey);
    }
  };
};
var focusTrap;
var toggleNav = function toggleNav(active) {
  var body = document.body;
  if (typeof active !== 'boolean') {
    active = !isActive();
  }
  body.classList.toggle(ACTIVE_CLASS, active);
  forEach(select(TOGGLES), function (el) {
    el.classList.toggle(VISIBLE_CLASS, active);
  });
  if (active) {
    focusTrap.enable();
  } else {
    focusTrap.release();
  }
  var closeButton = body.querySelector(CLOSE_BUTTON);
  var menuButton = body.querySelector(OPENERS);
  if (active && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!active && document.activeElement === closeButton && menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }
  return active;
};
var _default = exports["default"] = Navigation;

},{"../utils/select":104,"array-foreach":1}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var TOGGLE_ATTRIBUTE = 'data-controls';

/**
 * Adds click functionality to radiobutton collapse list
 * @param {HTMLElement} containerElement 
 */
function RadioToggleGroup(containerElement) {
  this.radioGroup = containerElement;
  this.radioEls = null;
  this.targetEl = null;
}

/**
 * Set events
 */
RadioToggleGroup.prototype.init = function () {
  this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
  if (this.radioEls.length === 0) {
    throw new Error('No radiobuttons found in radiobutton group.');
  }
  var that = this;
  for (var i = 0; i < this.radioEls.length; i++) {
    var radio = this.radioEls[i];
    radio.addEventListener('change', function () {
      for (var a = 0; a < that.radioEls.length; a++) {
        that.toggle(that.radioEls[a]);
      }
    });
    this.toggle(radio);
  }
};

/**
 * Toggle radiobutton content
 * @param {HTMLInputElement} radioInputElement 
 */
RadioToggleGroup.prototype.toggle = function (radioInputElement) {
  var contentId = radioInputElement.getAttribute(TOGGLE_ATTRIBUTE);
  if (contentId !== null && contentId !== undefined && contentId !== "") {
    var contentElement = document.querySelector(contentId);
    if (contentElement === null || contentElement === undefined) {
      throw new Error("Could not find panel element. Verify value of attribute " + TOGGLE_ATTRIBUTE);
    }
    if (radioInputElement.checked) {
      this.expand(radioInputElement, contentElement);
    } else {
      this.collapse(radioInputElement, contentElement);
    }
  }
};

/**
 * Expand radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.expand = function (radioInputElement, contentElement) {
  if (radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined) {
    radioInputElement.setAttribute('data-expanded', 'true');
    contentElement.setAttribute('aria-hidden', 'false');
    var eventOpen = new Event('fds.radio.expanded');
    radioInputElement.dispatchEvent(eventOpen);
  }
};
/**
 * Collapse radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.collapse = function (radioInputElement, contentElement) {
  if (radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined) {
    radioInputElement.setAttribute('data-expanded', 'false');
    contentElement.setAttribute('aria-hidden', 'true');
    var eventClose = new Event('fds.radio.collapsed');
    radioInputElement.dispatchEvent(eventClose);
  }
};
var _default = exports["default"] = RadioToggleGroup;

},{}],84:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var modifierState = {
  shift: false,
  alt: false,
  ctrl: false,
  command: false
};
/*
* Prevents the user from inputting based on a regex.
* Does not work the same way af <input pattern="">, this pattern is only used for validation, not to prevent input.
* Usecase: number input for date-component.
* Example - number only: <input type="text" data-input-regex="^\d*$">
*/
var InputRegexMask = /*#__PURE__*/_createClass(function InputRegexMask(element) {
  _classCallCheck(this, InputRegexMask);
  element.addEventListener('paste', regexMask);
  element.addEventListener('keydown', regexMask);
});
var regexMask = function regexMask(event) {
  if (modifierState.ctrl || modifierState.command) {
    return;
  }
  var newChar = null;
  if (typeof event.key !== 'undefined') {
    if (event.key.length === 1) {
      newChar = event.key;
    }
  } else {
    if (!event.charCode) {
      newChar = String.fromCharCode(event.keyCode);
    } else {
      newChar = String.fromCharCode(event.charCode);
    }
  }
  var regexStr = this.getAttribute('data-input-regex');
  if (event.type !== undefined && event.type === 'paste') {
    //console.log('paste');
  } else {
    var element = null;
    if (event.target !== undefined) {
      element = event.target;
    }
    if (newChar !== null && element !== null) {
      if (newChar.length > 0) {
        var newValue = this.value;
        if (element.type === 'number') {
          newValue = this.value; //Note input[type=number] does not have .selectionStart/End (Chrome).
        } else {
          newValue = this.value.slice(0, element.selectionStart) + this.value.slice(element.selectionEnd) + newChar; //removes the numbers selected by the user, then adds new char.
        }
        var r = new RegExp(regexStr);
        if (r.exec(newValue) === null) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event.returnValue = false;
          }
        }
      }
    }
  }
};
var _default = exports["default"] = InputRegexMask;

},{}],85:[function(require,module,exports){
'use strict';

/**
 * 
 * @param {HTMLTableElement} table Table Element
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function TableSelectableRows(table) {
  this.table = table;
}

/**
 * Initialize eventlisteners for checkboxes in table
 */
TableSelectableRows.prototype.init = function () {
  this.groupCheckbox = this.getGroupCheckbox();
  this.tbodyCheckboxList = this.getCheckboxList();
  if (this.tbodyCheckboxList.length !== 0) {
    for (var c = 0; c < this.tbodyCheckboxList.length; c++) {
      var checkbox = this.tbodyCheckboxList[c];
      checkbox.removeEventListener('change', updateGroupCheck);
      checkbox.addEventListener('change', updateGroupCheck);
    }
  }
  if (this.groupCheckbox !== false) {
    this.groupCheckbox.removeEventListener('change', updateCheckboxList);
    this.groupCheckbox.addEventListener('change', updateCheckboxList);
  }
};

/**
 * Get group checkbox in table header
 * @returns element on true - false if not found
 */
TableSelectableRows.prototype.getGroupCheckbox = function () {
  var checkbox = this.table.getElementsByTagName('thead')[0].getElementsByClassName('form-checkbox');
  if (checkbox.length === 0) {
    return false;
  }
  return checkbox[0];
};
/**
 * Get table body checkboxes
 * @returns HTMLCollection
 */
TableSelectableRows.prototype.getCheckboxList = function () {
  return this.table.getElementsByTagName('tbody')[0].getElementsByClassName('form-checkbox');
};

/**
 * Update checkboxes in table body when group checkbox is changed
 * @param {Event} e 
 */
function updateCheckboxList(e) {
  var checkbox = e.target;
  checkbox.removeAttribute('aria-checked');
  var table = e.target.parentNode.parentNode.parentNode.parentNode;
  var tableSelectableRows = new TableSelectableRows(table);
  var checkboxList = tableSelectableRows.getCheckboxList();
  var checkedNumber = 0;
  if (checkbox.checked) {
    for (var c = 0; c < checkboxList.length; c++) {
      checkboxList[c].checked = true;
      checkboxList[c].parentNode.parentNode.classList.add('table-row-selected');
    }
    checkedNumber = checkboxList.length;
  } else {
    for (var _c = 0; _c < checkboxList.length; _c++) {
      checkboxList[_c].checked = false;
      checkboxList[_c].parentNode.parentNode.classList.remove('table-row-selected');
    }
  }
  var event = new CustomEvent("fds.table.selectable.updated", {
    bubbles: true,
    cancelable: true,
    detail: {
      checkedNumber: checkedNumber
    }
  });
  table.dispatchEvent(event);
}

/**
 * Update group checkbox when checkbox in table body is changed
 * @param {Event} e 
 */
function updateGroupCheck(e) {
  // update label for event checkbox
  if (e.target.checked) {
    e.target.parentNode.parentNode.classList.add('table-row-selected');
  } else {
    e.target.parentNode.parentNode.classList.remove('table-row-selected');
  }
  var table = e.target.parentNode.parentNode.parentNode.parentNode;
  var tableSelectableRows = new TableSelectableRows(table);
  var groupCheckbox = tableSelectableRows.getGroupCheckbox();
  if (groupCheckbox !== false) {
    var checkboxList = tableSelectableRows.getCheckboxList();

    // how many row has been selected
    var checkedNumber = 0;
    for (var c = 0; c < checkboxList.length; c++) {
      var loopedCheckbox = checkboxList[c];
      if (loopedCheckbox.checked) {
        checkedNumber++;
      }
    }
    if (checkedNumber === checkboxList.length) {
      // if all rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = true;
    } else if (checkedNumber == 0) {
      // if no rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = false;
    } else {
      // if some but not all rows has been selected
      groupCheckbox.setAttribute('aria-checked', 'mixed');
      groupCheckbox.checked = false;
    }
    var event = new CustomEvent("fds.table.selectable.updated", {
      bubbles: true,
      cancelable: true,
      detail: {
        checkedNumber: checkedNumber
      }
    });
    table.dispatchEvent(event);
  }
}
var _default = exports["default"] = TableSelectableRows;

},{}],86:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var select = require('../utils/select');

/**
 * Set data-title on cells, where the attribute is missing
 */
var ResponsiveTable = /*#__PURE__*/_createClass(function ResponsiveTable(table) {
  _classCallCheck(this, ResponsiveTable);
  insertHeaderAsAttributes(table);
});
/**
 * Add data attributes needed for responsive mode.
 * @param {HTMLTableElement} tableEl Table element
 */
function insertHeaderAsAttributes(tableEl) {
  if (!tableEl) return;
  var header = tableEl.getElementsByTagName('thead');
  if (header.length !== 0) {
    var headerCellEls = header[0].getElementsByTagName('th');
    if (headerCellEls.length == 0) {
      headerCellEls = header[0].getElementsByTagName('td');
    }
    if (headerCellEls.length > 0) {
      var bodyRowEls = select('tbody tr', tableEl);
      Array.from(bodyRowEls).forEach(function (rowEl) {
        var cellEls = rowEl.children;
        if (cellEls.length === headerCellEls.length) {
          Array.from(headerCellEls).forEach(function (headerCellEl, i) {
            // Grab header cell text and use it body cell data title.
            if (!cellEls[i].hasAttribute('data-title') && headerCellEl.tagName === "TH" && !headerCellEl.classList.contains("sr-header")) {
              cellEls[i].setAttribute('data-title', headerCellEl.textContent);
            }
          });
        }
      });
    }
  }
}
var _default = exports["default"] = ResponsiveTable;

},{"../utils/select":104}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};

// For easy reference
var keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  "delete": 46
};

// Add or substract depending on key pressed
var direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1
};

/**
 * Add functionality to tabnav component
 * @param {HTMLElement} tabnav Tabnav container
 */
function Tabnav(tabnav) {
  this.tabnav = tabnav;
  this.tabs = this.tabnav.querySelectorAll('button.tabnav-item');
}

/**
 * Set event on component
 */
Tabnav.prototype.init = function () {
  if (this.tabs.length === 0) {
    throw new Error("Tabnav HTML seems to be missing tabnav-item. Add tabnav items to ensure each panel has a button in the tabnavs navigation.");
  }

  // if no hash is set on load, set active tab
  if (!setActiveHashTab()) {
    // set first tab as active
    var tab = this.tabs[0];

    // check no other tabs as been set at default
    var alreadyActive = getActiveTabs(this.tabnav);
    if (alreadyActive.length === 0) {
      tab = alreadyActive[0];
    }

    // activate and deactivate tabs
    this.activateTab(tab, false);
  }
  var $module = this;
  // add eventlisteners on buttons
  for (var t = 0; t < this.tabs.length; t++) {
    this.tabs[t].addEventListener('click', function () {
      $module.activateTab(this, false);
    });
    this.tabs[t].addEventListener('keydown', keydownEventListener);
    this.tabs[t].addEventListener('keyup', keyupEventListener);
  }
};

/***
 * Show tab and hide others
 * @param {HTMLButtonElement} tab button element
 * @param {boolean} setFocus True if tab button should be focused
 */
Tabnav.prototype.activateTab = function (tab, setFocus) {
  var tabs = getAllTabsInList(tab);

  // close all tabs except selected
  for (var i = 0; i < this.tabs.length; i++) {
    if (tabs[i] === tab) {
      continue;
    }
    if (tabs[i].getAttribute('aria-selected') === 'true') {
      var eventClose = new Event('fds.tabnav.close');
      tabs[i].dispatchEvent(eventClose);
    }
    tabs[i].setAttribute('tabindex', '-1');
    tabs[i].setAttribute('aria-selected', 'false');
    var _tabpanelID = tabs[i].getAttribute('aria-controls');
    var _tabpanel = document.getElementById(_tabpanelID);
    if (_tabpanel === null) {
      throw new Error("Could not find tabpanel.");
    }
    _tabpanel.setAttribute('aria-hidden', 'true');
  }

  // Set selected tab to active
  var tabpanelID = tab.getAttribute('aria-controls');
  var tabpanel = document.getElementById(tabpanelID);
  if (tabpanel === null) {
    throw new Error("Could not find accordion panel.");
  }
  tab.setAttribute('aria-selected', 'true');
  tabpanel.setAttribute('aria-hidden', 'false');
  tab.removeAttribute('tabindex');

  // Set focus when required
  if (setFocus) {
    tab.focus();
  }
  var eventChanged = new Event('fds.tabnav.changed');
  tab.parentNode.dispatchEvent(eventChanged);
  var eventOpen = new Event('fds.tabnav.open');
  tab.dispatchEvent(eventOpen);
};

/**
 * Add keydown events to tabnav component
 * @param {KeyboardEvent} event 
 */
function keydownEventListener(event) {
  var key = event.keyCode;
  switch (key) {
    case keys.end:
      event.preventDefault();
      // Activate last tab
      focusLastTab(event.target);
      break;
    case keys.home:
      event.preventDefault();
      // Activate first tab
      focusFirstTab(event.target);
      break;
    // Up and down are in keydown
    // because we need to prevent page scroll >:)
    case keys.up:
    case keys.down:
      determineOrientation(event);
      break;
  }
}

/**
 * Add keyup events to tabnav component
 * @param {KeyboardEvent} event 
 */
function keyupEventListener(event) {
  var key = event.keyCode;
  switch (key) {
    case keys.left:
    case keys.right:
      determineOrientation(event);
      break;
    case keys["delete"]:
      break;
    case keys.enter:
    case keys.space:
      new Tabnav(event.target.parentNode).activateTab(event.target, true);
      break;
  }
}

/**
 * When a tablist aria-orientation is set to vertical,
 * only up and down arrow should function.
 * In all other cases only left and right arrow function.
 */
function determineOrientation(event) {
  var key = event.keyCode;
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
  var vertical = x < breakpoints.md;
  var proceed = false;
  if (vertical) {
    if (key === keys.up || key === keys.down) {
      event.preventDefault();
      proceed = true;
    }
  } else {
    if (key === keys.left || key === keys.right) {
      proceed = true;
    }
  }
  if (proceed) {
    switchTabOnArrowPress(event);
  }
}

/**
 * Either focus the next, previous, first, or last tab
 * depending on key pressed
 */
function switchTabOnArrowPress(event) {
  var pressed = event.keyCode;
  if (direction[pressed]) {
    var target = event.target;
    var tabs = getAllTabsInList(target);
    var index = getIndexOfElementInList(target, tabs);
    if (index !== -1) {
      if (tabs[index + direction[pressed]]) {
        tabs[index + direction[pressed]].focus();
      } else if (pressed === keys.left || pressed === keys.up) {
        focusLastTab(target);
      } else if (pressed === keys.right || pressed == keys.down) {
        focusFirstTab(target);
      }
    }
  }
}

/**
 * Get all active tabs in list
 * @param tabnav parent .tabnav element
 * @returns returns list of active tabs if any
 */
function getActiveTabs(tabnav) {
  return tabnav.querySelectorAll('button.tabnav-item[aria-selected=true]');
}

/**
 * Get a list of all button tabs in current tablist
 * @param tab Button tab element
 * @returns {*} return array of tabs
 */
function getAllTabsInList(tab) {
  var parentNode = tab.parentNode;
  if (parentNode.classList.contains('tabnav')) {
    return parentNode.querySelectorAll('button.tabnav-item');
  }
  return [];
}

/**
 * Get index of element in list
 * @param {HTMLElement} element 
 * @param {HTMLCollection} list 
 * @returns {index}
 */
function getIndexOfElementInList(element, list) {
  var index = -1;
  for (var i = 0; i < list.length; i++) {
    if (list[i] === element) {
      index = i;
      break;
    }
  }
  return index;
}

/**
 * Checks if there is a tab hash in the url and activates the tab accordingly
 * @returns {boolean} returns true if tab has been set - returns false if no tab has been set to active
 */
function setActiveHashTab() {
  var hash = location.hash.replace('#', '');
  if (hash !== '') {
    var tab = document.querySelector('button.tabnav-item[aria-controls="#' + hash + '"]');
    if (tab !== null) {
      activateTab(tab, false);
      return true;
    }
  }
  return false;
}

/**
 * Get first tab by tab in list
 * @param {HTMLButtonElement} tab 
 */
function focusFirstTab(tab) {
  getAllTabsInList(tab)[0].focus();
}

/**
 * Get last tab by tab in list
 * @param {HTMLButtonElement} tab 
 */
function focusLastTab(tab) {
  var tabs = getAllTabsInList(tab);
  tabs[tabs.length - 1].focus();
}
var _default = exports["default"] = Tabnav;

},{}],88:[function(require,module,exports){
'use strict';

/**
 * Show/hide toast component
 * @param {HTMLElement} element 
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Toast(element) {
  this.element = element;
}

/**
 * Show toast
 */
Toast.prototype.show = function () {
  this.element.classList.remove('hide');
  this.element.classList.add('showing');
  this.element.getElementsByClassName('toast-close')[0].addEventListener('click', function () {
    var toast = this.parentNode.parentNode;
    new Toast(toast).hide();
  });
  requestAnimationFrame(showToast);
};

/**
 * Hide toast
 */
Toast.prototype.hide = function () {
  this.element.classList.remove('show');
  this.element.classList.add('hide');
};

/**
 * Adds classes to make show animation
 */
function showToast() {
  var toasts = document.querySelectorAll('.toast.showing');
  for (var t = 0; t < toasts.length; t++) {
    var toast = toasts[t];
    toast.classList.remove('showing');
    toast.classList.add('show');
  }
}
var _default = exports["default"] = Toast;

},{}],89:[function(require,module,exports){
'use strict';

/**
 * Set tooltip on element
 * @param {HTMLElement} element Element which has tooltip
 */
function Tooltip(element) {
  this.element = element;
  if (this.element.getAttribute('data-tooltip') === null) {
    throw new Error("Tooltip text is missing. Add attribute data-tooltip and the content of the tooltip as value.");
  }
}

/**
 * Set eventlisteners
 */
Tooltip.prototype.init = function () {
  var module = this;
  this.element.addEventListener('mouseenter', function (e) {
    var trigger = e.target;
    if (trigger.classList.contains('tooltip-hover') === false && trigger.classList.contains('tooltip-focus') === false) {
      closeAllTooltips(e);
      trigger.classList.add("tooltip-hover");
      setTimeout(function () {
        if (trigger.classList.contains('tooltip-hover')) {
          var element = e.target;
          if (element.getAttribute('aria-describedby') !== null) return;
          addTooltip(element);
        }
      }, 300);
    }
  });
  this.element.addEventListener('mouseleave', function (e) {
    var trigger = e.target;
    if (trigger.classList.contains('tooltip-hover')) {
      trigger.classList.remove('tooltip-hover');
      var tooltipId = trigger.getAttribute('aria-describedby');
      var tooltipElement = document.getElementById(tooltipId);
      if (tooltipElement !== null) {
        closeHoverTooltip(trigger);
      }
    }
  });
  this.element.addEventListener('keyup', function (event) {
    var key = event.which || event.keyCode;
    if (key === 27) {
      var tooltip = this.getAttribute('aria-describedby');
      if (tooltip !== null && document.getElementById(tooltip) !== null) {
        document.body.removeChild(document.getElementById(tooltip));
      }
      this.classList.remove('active');
      this.removeAttribute('aria-describedby');
    }
  });
  if (this.element.getAttribute('data-tooltip-trigger') === 'click') {
    this.element.addEventListener('click', function (e) {
      var trigger = e.target;
      closeAllTooltips(e);
      trigger.classList.add('tooltip-focus');
      trigger.classList.remove('tooltip-hover');
      if (trigger.getAttribute('aria-describedby') !== null) return;
      addTooltip(trigger);
    });
  }
  document.getElementsByTagName('body')[0].removeEventListener('click', closeAllTooltips);
  document.getElementsByTagName('body')[0].addEventListener('click', closeAllTooltips);
};

/**
 * Close all tooltips
 */
function closeAll() {
  var elements = document.querySelectorAll('.js-tooltip[aria-describedby]');
  for (var i = 0; i < elements.length; i++) {
    var popper = elements[i].getAttribute('aria-describedby');
    elements[i].removeAttribute('aria-describedby');
    document.body.removeChild(document.getElementById(popper));
  }
}
function addTooltip(trigger) {
  var pos = trigger.getAttribute('data-tooltip-position') || 'top';
  var tooltip = createTooltip(trigger, pos);
  document.body.appendChild(tooltip);
  positionAt(trigger, tooltip, pos);
}

/**
 * Create tooltip element
 * @param {HTMLElement} element Element which the tooltip is attached
 * @param {string} pos Position of tooltip (top | bottom)
 * @returns 
 */
function createTooltip(element, pos) {
  var tooltip = document.createElement('div');
  tooltip.className = 'tooltip-popper';
  var poppers = document.getElementsByClassName('tooltip-popper');
  var id = 'tooltip-' + poppers.length + 1;
  tooltip.setAttribute('id', id);
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('x-placement', pos);
  element.setAttribute('aria-describedby', id);
  var tooltipInner = document.createElement('div');
  tooltipInner.className = 'tooltip';
  var tooltipArrow = document.createElement('div');
  tooltipArrow.className = 'tooltip-arrow';
  tooltipInner.appendChild(tooltipArrow);
  var tooltipContent = document.createElement('div');
  tooltipContent.className = 'tooltip-content';
  tooltipContent.innerHTML = element.getAttribute('data-tooltip');
  tooltipInner.appendChild(tooltipContent);
  tooltip.appendChild(tooltipInner);
  return tooltip;
}

/**
 * Positions the tooltip.
 *
 * @param {object} parent - The trigger of the tooltip.
 * @param {object} tooltip - The tooltip itself.
 * @param {string} posHorizontal - Desired horizontal position of the tooltip relatively to the trigger (left/center/right)
 * @param {string} posVertical - Desired vertical position of the tooltip relatively to the trigger (top/center/bottom)
 *
 */
function positionAt(parent, tooltip, pos) {
  var trigger = parent;
  var arrow = tooltip.getElementsByClassName('tooltip-arrow')[0];
  var triggerPosition = parent.getBoundingClientRect();
  var parentCoords = parent.getBoundingClientRect(),
    left,
    top;
  var tooltipWidth = tooltip.offsetWidth;
  var dist = 12;
  var arrowDirection = "down";
  left = parseInt(parentCoords.left) + (parent.offsetWidth - tooltip.offsetWidth) / 2;
  switch (pos) {
    case 'bottom':
      top = parseInt(parentCoords.bottom) + dist;
      arrowDirection = "up";
      break;
    default:
    case 'top':
      top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
  }

  // if tooltip is out of bounds on left side
  if (left < 0) {
    left = dist;
    var endPositionOnPage = triggerPosition.left + trigger.offsetWidth / 2;
    var tooltipArrowHalfWidth = 8;
    var arrowLeftPosition = endPositionOnPage - dist - tooltipArrowHalfWidth;
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.left = arrowLeftPosition + 'px';
  }

  // if tooltip is out of bounds on the bottom of the page
  if (top + tooltip.offsetHeight >= window.innerHeight) {
    top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
    arrowDirection = "down";
  }

  // if tooltip is out of bounds on the top of the page
  if (top < 0) {
    top = parseInt(parentCoords.bottom) + dist;
    arrowDirection = "up";
  }
  if (window.innerWidth < left + tooltipWidth) {
    tooltip.style.right = dist + 'px';
    var _endPositionOnPage = triggerPosition.right - trigger.offsetWidth / 2;
    var _tooltipArrowHalfWidth = 8;
    var arrowRightPosition = window.innerWidth - _endPositionOnPage - dist - _tooltipArrowHalfWidth;
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.right = arrowRightPosition + 'px';
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.left = 'auto';
  } else {
    tooltip.style.left = left + 'px';
  }
  tooltip.style.top = top + pageYOffset + 'px';
  tooltip.getElementsByClassName('tooltip-arrow')[0].classList.add(arrowDirection);
}
function closeAllTooltips(event) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (force || !event.target.classList.contains('js-tooltip') && !event.target.classList.contains('tooltip') && !event.target.classList.contains('tooltip-content')) {
    var elements = document.querySelectorAll('.tooltip-popper');
    for (var i = 0; i < elements.length; i++) {
      var trigger = document.querySelector('[aria-describedby=' + elements[i].getAttribute('id') + ']');
      trigger.removeAttribute('data-tooltip-active');
      trigger.removeAttribute('aria-describedby');
      trigger.classList.remove('tooltip-focus');
      trigger.classList.remove('tooltip-hover');
      document.body.removeChild(elements[i]);
    }
  }
}
function closeHoverTooltip(trigger) {
  var tooltipId = trigger.getAttribute('aria-describedby');
  var tooltipElement = document.getElementById(tooltipId);
  tooltipElement.removeEventListener('mouseenter', onTooltipHover);
  tooltipElement.addEventListener('mouseenter', onTooltipHover);
  setTimeout(function () {
    var tooltipElement = document.getElementById(tooltipId);
    if (tooltipElement !== null) {
      if (!trigger.classList.contains("tooltip-hover")) {
        removeTooltip(trigger);
      }
    }
  }, 300);
}
function onTooltipHover(e) {
  var tooltipElement = this;
  var trigger = document.querySelector('[aria-describedby=' + tooltipElement.getAttribute('id') + ']');
  trigger.classList.add('tooltip-hover');
  tooltipElement.addEventListener('mouseleave', function () {
    var trigger = document.querySelector('[aria-describedby=' + tooltipElement.getAttribute('id') + ']');
    if (trigger !== null) {
      trigger.classList.remove('tooltip-hover');
      closeHoverTooltip(trigger);
    }
  });
}
function removeTooltip(trigger) {
  var tooltipId = trigger.getAttribute('aria-describedby');
  var tooltipElement = document.getElementById(tooltipId);
  if (tooltipId !== null && tooltipElement !== null) {
    document.body.removeChild(tooltipElement);
  }
  trigger.removeAttribute('aria-describedby');
  trigger.classList.remove('tooltip-hover');
  trigger.classList.remove('tooltip-focus');
}
module.exports = Tooltip;

},{}],90:[function(require,module,exports){
"use strict";

module.exports = {
  prefix: ''
};

},{}],91:[function(require,module,exports){
'use strict';

var _accordion = _interopRequireDefault(require("./components/accordion"));
var _alert = _interopRequireDefault(require("./components/alert"));
var _backToTop = _interopRequireDefault(require("./components/back-to-top"));
var _characterLimit = _interopRequireDefault(require("./components/character-limit"));
var _checkboxToggleContent = _interopRequireDefault(require("./components/checkbox-toggle-content"));
var _dropdown = _interopRequireDefault(require("./components/dropdown"));
var _dropdownSort = _interopRequireDefault(require("./components/dropdown-sort"));
var _errorSummary = _interopRequireDefault(require("./components/error-summary"));
var _regexInputMask = _interopRequireDefault(require("./components/regex-input-mask"));
var _modal = _interopRequireDefault(require("./components/modal"));
var _navigation = _interopRequireDefault(require("./components/navigation"));
var _radioToggleContent = _interopRequireDefault(require("./components/radio-toggle-content"));
var _table = _interopRequireDefault(require("./components/table"));
var _tabnav = _interopRequireDefault(require("./components/tabnav"));
var _selectableTable = _interopRequireDefault(require("./components/selectable-table"));
var _toast = _interopRequireDefault(require("./components/toast"));
var _tooltip = _interopRequireDefault(require("./components/tooltip"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var datePicker = require('./components/date-picker');
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

/**
 * Init all components
 * @param {JSON} options {scope: HTMLElement} - Init all components within scope (default is document)
 */
var init = function init(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {};

  // Allow the user to initialise FDS in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;

  /*
  ---------------------
  Accordions
  ---------------------
  */
  var jsSelectorAccordion = scope.getElementsByClassName('accordion');
  for (var c = 0; c < jsSelectorAccordion.length; c++) {
    new _accordion["default"](jsSelectorAccordion[c]).init();
  }
  var jsSelectorAccordionBordered = scope.querySelectorAll('.accordion-bordered:not(.accordion)');
  for (var _c = 0; _c < jsSelectorAccordionBordered.length; _c++) {
    new _accordion["default"](jsSelectorAccordionBordered[_c]).init();
  }

  /*
  ---------------------
  Alerts
  ---------------------
  */

  var alertsWithCloseButton = scope.querySelectorAll('.alert.has-close');
  for (var _c2 = 0; _c2 < alertsWithCloseButton.length; _c2++) {
    new _alert["default"](alertsWithCloseButton[_c2]).init();
  }

  /*
  ---------------------
  Back to top button
  ---------------------
  */

  var backToTopButtons = scope.getElementsByClassName('back-to-top-button');
  for (var _c3 = 0; _c3 < backToTopButtons.length; _c3++) {
    new _backToTop["default"](backToTopButtons[_c3]).init();
  }

  /*
  ---------------------
  Character limit
  ---------------------
  */
  var jsCharacterLimit = scope.getElementsByClassName('form-limit');
  for (var _c4 = 0; _c4 < jsCharacterLimit.length; _c4++) {
    new _characterLimit["default"](jsCharacterLimit[_c4]).init();
  }

  /*
  ---------------------
  Checkbox collapse
  ---------------------
  */
  var jsSelectorCheckboxCollapse = scope.getElementsByClassName('js-checkbox-toggle-content');
  for (var _c5 = 0; _c5 < jsSelectorCheckboxCollapse.length; _c5++) {
    new _checkboxToggleContent["default"](jsSelectorCheckboxCollapse[_c5]).init();
  }

  /*
  ---------------------
  Overflow menu
  ---------------------
  */
  var jsSelectorDropdown = scope.getElementsByClassName('js-dropdown');
  for (var _c6 = 0; _c6 < jsSelectorDropdown.length; _c6++) {
    new _dropdown["default"](jsSelectorDropdown[_c6]).init();
  }

  /*
  ---------------------
  Overflow menu sort
  ---------------------
  */
  var jsSelectorDropdownSort = scope.getElementsByClassName('overflow-menu--sort');
  for (var _c7 = 0; _c7 < jsSelectorDropdownSort.length; _c7++) {
    new _dropdownSort["default"](jsSelectorDropdownSort[_c7]).init();
  }

  /*
  ---------------------
  Datepicker
  ---------------------
  */
  datePicker.on(scope);

  /*
  ---------------------
  Error summary
  ---------------------
  */
  var $errorSummary = scope.querySelector('[data-module="error-summary"]');
  new _errorSummary["default"]($errorSummary).init();

  /*
  ---------------------
  Input Regex - used on date fields
  ---------------------
  */
  var jsSelectorRegex = scope.querySelectorAll('input[data-input-regex]');
  for (var _c8 = 0; _c8 < jsSelectorRegex.length; _c8++) {
    new _regexInputMask["default"](jsSelectorRegex[_c8]);
  }

  /*
  ---------------------
  Modal
  ---------------------
  */
  var modals = scope.querySelectorAll('.fds-modal');
  for (var d = 0; d < modals.length; d++) {
    new _modal["default"](modals[d]).init();
  }

  /*
  ---------------------
  Navigation
  ---------------------
  */
  new _navigation["default"]().init();

  /*
  ---------------------
  Radiobutton group collapse
  ---------------------
  */
  var jsSelectorRadioCollapse = scope.getElementsByClassName('js-radio-toggle-group');
  for (var _c9 = 0; _c9 < jsSelectorRadioCollapse.length; _c9++) {
    new _radioToggleContent["default"](jsSelectorRadioCollapse[_c9]).init();
  }

  /*
  ---------------------
  Responsive tables
  ---------------------
  */
  var jsSelectorTable = scope.querySelectorAll('table.table--responsive-headers, table.table-sm-responsive-headers, table.table-md-responsive-headers, table.table-lg-responsive-headers');
  for (var _c10 = 0; _c10 < jsSelectorTable.length; _c10++) {
    new _table["default"](jsSelectorTable[_c10]);
  }

  /*
  ---------------------
  Selectable rows in table
  ---------------------
  */
  var jsSelectableTable = scope.querySelectorAll('table.table--selectable');
  for (var _c11 = 0; _c11 < jsSelectableTable.length; _c11++) {
    new _selectableTable["default"](jsSelectableTable[_c11]).init();
  }

  /*
  ---------------------
  Tabnav
  ---------------------
  */
  var jsSelectorTabnav = scope.getElementsByClassName('tabnav');
  for (var _c12 = 0; _c12 < jsSelectorTabnav.length; _c12++) {
    new _tabnav["default"](jsSelectorTabnav[_c12]).init();
  }

  /*
  ---------------------
  Tooltip
  ---------------------
  */
  var jsSelectorTooltip = scope.getElementsByClassName('js-tooltip');
  for (var _c13 = 0; _c13 < jsSelectorTooltip.length; _c13++) {
    new _tooltip["default"](jsSelectorTooltip[_c13]).init();
  }
};
module.exports = {
  init: init,
  Accordion: _accordion["default"],
  Alert: _alert["default"],
  BackToTop: _backToTop["default"],
  CharacterLimit: _characterLimit["default"],
  CheckboxToggleContent: _checkboxToggleContent["default"],
  Dropdown: _dropdown["default"],
  DropdownSort: _dropdownSort["default"],
  datePicker: datePicker,
  ErrorSummary: _errorSummary["default"],
  InputRegexMask: _regexInputMask["default"],
  Modal: _modal["default"],
  Navigation: _navigation["default"],
  RadioToggleGroup: _radioToggleContent["default"],
  ResponsiveTable: _table["default"],
  TableSelectableRows: _selectableTable["default"],
  Tabnav: _tabnav["default"],
  Toast: _toast["default"],
  Tooltip: _tooltip["default"]
};

},{"./components/accordion":72,"./components/alert":73,"./components/back-to-top":74,"./components/character-limit":75,"./components/checkbox-toggle-content":76,"./components/date-picker":77,"./components/dropdown":79,"./components/dropdown-sort":78,"./components/error-summary":80,"./components/modal":81,"./components/navigation":82,"./components/radio-toggle-content":83,"./components/regex-input-mask":84,"./components/selectable-table":85,"./components/table":86,"./components/tabnav":87,"./components/toast":88,"./components/tooltip":89,"./polyfills":97}],92:[function(require,module,exports){
"use strict";

module.exports = {
  // This used to be conditionally dependent on whether the
  // browser supported touch events; if it did, `CLICK` was set to
  // `touchstart`.  However, this had downsides:
  //
  // * It pre-empted mobile browsers' default behavior of detecting
  //   whether a touch turned into a scroll, thereby preventing
  //   users from using some of our components as scroll surfaces.
  //
  // * Some devices, such as the Microsoft Surface Pro, support *both*
  //   touch and clicks. This meant the conditional effectively dropped
  //   support for the user's mouse, frustrating users who preferred
  //   it on those systems.
  CLICK: 'click'
};

},{}],93:[function(require,module,exports){
(function (global){(function (){
"use strict";

require("../../Object/defineProperty");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function (undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
  var detect = ('bind' in Function.prototype);
  if (detect) return;

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
  Object.defineProperty(Function.prototype, 'bind', {
    value: function bind(that) {
      // .length is 1
      // add necessary es5-shim utilities
      var $Array = Array;
      var $Object = Object;
      var ObjectPrototype = $Object.prototype;
      var ArrayPrototype = $Array.prototype;
      var Empty = function Empty() {};
      var to_string = ObjectPrototype.toString;
      var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';
      var isCallable; /* inlined from https://npmjs.com/is-callable */
      var fnToStr = Function.prototype.toString,
        tryFunctionObject = function tryFunctionObject(value) {
          try {
            fnToStr.call(value);
            return true;
          } catch (e) {
            return false;
          }
        },
        fnClass = '[object Function]',
        genClass = '[object GeneratorFunction]';
      isCallable = function isCallable(value) {
        if (typeof value !== 'function') {
          return false;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        var strClass = to_string.call(value);
        return strClass === fnClass || strClass === genClass;
      };
      var array_slice = ArrayPrototype.slice;
      var array_concat = ArrayPrototype.concat;
      var array_push = ArrayPrototype.push;
      var max = Math.max;
      // /add necessary es5-shim utilities

      // 1. Let Target be the this value.
      var target = this;
      // 2. If IsCallable(Target) is false, throw a TypeError exception.
      if (!isCallable(target)) {
        throw new TypeError('Function.prototype.bind called on incompatible ' + target);
      }
      // 3. Let A be a new (possibly empty) internal list of all of the
      //   argument values provided after thisArg (arg1, arg2 etc), in order.
      // XXX slicedArgs will stand in for "A" if used
      var args = array_slice.call(arguments, 1); // for normal call
      // 4. Let F be a new native ECMAScript object.
      // 11. Set the [[Prototype]] internal property of F to the standard
      //   built-in Function prototype object as specified in 15.3.3.1.
      // 12. Set the [[Call]] internal property of F as described in
      //   15.3.4.5.1.
      // 13. Set the [[Construct]] internal property of F as described in
      //   15.3.4.5.2.
      // 14. Set the [[HasInstance]] internal property of F as described in
      //   15.3.4.5.3.
      var bound;
      var binder = function binder() {
        if (this instanceof bound) {
          // 15.3.4.5.2 [[Construct]]
          // When the [[Construct]] internal method of a function object,
          // F that was created using the bind function is called with a
          // list of arguments ExtraArgs, the following steps are taken:
          // 1. Let target be the value of F's [[TargetFunction]]
          //   internal property.
          // 2. If target has no [[Construct]] internal method, a
          //   TypeError exception is thrown.
          // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Construct]] internal
          //   method of target providing args as the arguments.

          var result = target.apply(this, array_concat.call(args, array_slice.call(arguments)));
          if ($Object(result) === result) {
            return result;
          }
          return this;
        } else {
          // 15.3.4.5.1 [[Call]]
          // When the [[Call]] internal method of a function object, F,
          // which was created using the bind function is called with a
          // this value and a list of arguments ExtraArgs, the following
          // steps are taken:
          // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 2. Let boundThis be the value of F's [[BoundThis]] internal
          //   property.
          // 3. Let target be the value of F's [[TargetFunction]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Call]] internal method
          //   of target providing boundThis as the this value and
          //   providing args as the arguments.

          // equiv: target.call(this, ...boundArgs, ...args)
          return target.apply(that, array_concat.call(args, array_slice.call(arguments)));
        }
      };

      // 15. If the [[Class]] internal property of Target is "Function", then
      //     a. Let L be the length property of Target minus the length of A.
      //     b. Set the length own property of F to either 0 or L, whichever is
      //       larger.
      // 16. Else set the length own property of F to 0.

      var boundLength = max(0, target.length - args.length);

      // 17. Set the attributes of the length own property of F to the values
      //   specified in 15.3.5.1.
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        array_push.call(boundArgs, '$' + i);
      }

      // XXX Build a dynamic function with desired amount of arguments is the only
      // way to set the length property of a function.
      // In environments where Content Security Policies enabled (Chrome extensions,
      // for ex.) all use of eval or Function costructor throws an exception.
      // However in all of these environments Function.prototype.bind exists
      // and so this code will never be executed.
      bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);
      if (target.prototype) {
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        // Clean up dangling references.
        Empty.prototype = null;
      }

      // TODO
      // 18. Set the [[Extensible]] internal property of F to true.

      // TODO
      // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
      // 20. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
      //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
      //   false.
      // 21. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
      //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
      //   and false.

      // TODO
      // NOTE Function objects created using Function.prototype.bind do not
      // have a prototype property or the [[Code]], [[FormalParameters]], and
      // [[Scope]] internal properties.
      // XXX can't delete prototype in pure-js.

      // 22. Return F.
      return bound;
    }
  });
}).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof global === "undefined" ? "undefined" : _typeof(global)) && global || {});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../Object/defineProperty":94}],94:[function(require,module,exports){
(function (global){(function (){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function (undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
  var detect =
  // In IE8, defineProperty could only act on DOM elements, so full support
  // for the feature requires the ability to set a property on an arbitrary object
  'defineProperty' in Object && function () {
    try {
      var a = {};
      Object.defineProperty(a, 'test', {
        value: 42
      });
      return true;
    } catch (e) {
      return false;
    }
  }();
  if (detect) return;

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
  (function (nativeDefineProperty) {
    var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
    var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
    var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';
    Object.defineProperty = function defineProperty(object, property, descriptor) {
      // Where native support exists, assume it
      if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
        return nativeDefineProperty(object, property, descriptor);
      }
      if (object === null || !(object instanceof Object || _typeof(object) === 'object')) {
        throw new TypeError('Object.defineProperty called on non-object');
      }
      if (!(descriptor instanceof Object)) {
        throw new TypeError('Property description must be an object');
      }
      var propertyString = String(property);
      var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
      var getterType = 'get' in descriptor && _typeof(descriptor.get);
      var setterType = 'set' in descriptor && _typeof(descriptor.set);

      // handle descriptor.get
      if (getterType) {
        if (getterType !== 'function') {
          throw new TypeError('Getter must be a function');
        }
        if (!supportsAccessors) {
          throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
        }
        if (hasValueOrWritable) {
          throw new TypeError(ERR_VALUE_ACCESSORS);
        }
        Object.__defineGetter__.call(object, propertyString, descriptor.get);
      } else {
        object[propertyString] = descriptor.value;
      }

      // handle descriptor.set
      if (setterType) {
        if (setterType !== 'function') {
          throw new TypeError('Setter must be a function');
        }
        if (!supportsAccessors) {
          throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
        }
        if (hasValueOrWritable) {
          throw new TypeError(ERR_VALUE_ACCESSORS);
        }
        Object.__defineSetter__.call(object, propertyString, descriptor.set);
      }

      // OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
      if ('value' in descriptor) {
        object[propertyString] = descriptor.value;
      }
      return object;
    };
  })(Object.defineProperty);
}).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof global === "undefined" ? "undefined" : _typeof(global)) && global || {});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],95:[function(require,module,exports){
"use strict";

/* eslint-disable consistent-return */
/* eslint-disable func-names */
(function () {
  if (typeof window.CustomEvent === "function") return false;
  function CustomEvent(event, _params) {
    var params = _params || {
      bubbles: false,
      cancelable: false,
      detail: null
    };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  window.CustomEvent = CustomEvent;
})();

},{}],96:[function(require,module,exports){
'use strict';

var elproto = window.HTMLElement.prototype;
var HIDDEN = 'hidden';
if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get: function get() {
      return this.hasAttribute(HIDDEN);
    },
    set: function set(value) {
      if (value) {
        this.setAttribute(HIDDEN, '');
      } else {
        this.removeAttribute(HIDDEN);
      }
    }
  });
}

},{}],97:[function(require,module,exports){
'use strict';

// polyfills HTMLElement.prototype.classList and DOMTokenList
require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

// polyfills Number.isNaN()
require("./number-is-nan");

// polyfills CustomEvent
require("./custom-event");
require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./custom-event":95,"./element-hidden":96,"./number-is-nan":98,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],98:[function(require,module,exports){
"use strict";

Number.isNaN = Number.isNaN || function isNaN(input) {
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
};

},{}],99:[function(require,module,exports){
"use strict";

module.exports = function () {
  var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return htmlDocument.activeElement;
};

},{}],100:[function(require,module,exports){
"use strict";

var assign = require("object-assign");
var receptor = require("receptor");

/**
 * @name sequence
 * @param {...Function} seq an array of functions
 * @return { closure } callHooks
 */
// We use a named function here because we want it to inherit its lexical scope
// from the behavior props object, not from the module
var sequence = function sequence() {
  for (var _len = arguments.length, seq = new Array(_len), _key = 0; _key < _len; _key++) {
    seq[_key] = arguments[_key];
  }
  return function callHooks() {
    var _this = this;
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    seq.forEach(function (method) {
      if (typeof _this[method] === "function") {
        _this[method].call(_this, target);
      }
    });
  };
};

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = function (events, props) {
  return receptor.behavior(events, assign({
    on: sequence("init", "add"),
    off: sequence("teardown", "remove")
  }, props));
};

},{"object-assign":63,"receptor":70}],101:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
module.exports = breakpoints;

},{}],102:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}
module.exports = isElementInViewport;

},{}],103:[function(require,module,exports){
"use strict";

// iOS detection from: http://stackoverflow.com/a/9039885/177710
function isIosDevice() {
  return typeof navigator !== "undefined" && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
}
module.exports = isIosDevice;

},{}],104:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */
var isElement = function isElement(value) {
  return value && _typeof(value) === "object" && value.nodeType === 1;
};

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */
module.exports = function (selector, context) {
  if (typeof selector !== "string") {
    return [];
  }
  if (!context || !isElement(context)) {
    context = window.document; // eslint-disable-line no-param-reassign
  }
  var selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],105:[function(require,module,exports){
'use strict';

var EXPANDED = 'aria-expanded';
var CONTROLS = 'aria-controls';
var HIDDEN = 'aria-hidden';
module.exports = function (button, expanded) {
  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) === 'false';
  }
  button.setAttribute(EXPANDED, expanded);
  var id = button.getAttribute(CONTROLS);
  var controls = document.getElementById(id);
  if (!controls) {
    throw new Error('No toggle target found with id: "' + id + '"');
  }
  controls.setAttribute(HIDDEN, !expanded);
  return expanded;
};

},{}]},{},[91])(91)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2tleW1hcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FsZXJ0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYmFjay10by10b3AuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RvYXN0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5LmpzIiwic3JjL2pzL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvbnVtYmVyLWlzLW5hbi5qcyIsInNyYy9qcy91dGlscy9hY3RpdmUtZWxlbWVudC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9pcy1pb3MtZGV2aWNlLmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTs7QUFFWixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMs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Q0FBQyxHQUFHLFNBQVM7SUFDL0MsSUFBSSxPQUFPLEdBQUcsS0FBSyxLQUFLLFNBQVM7SUFDakMsSUFBSSxLQUFLLEdBQUcsQ0FBQztJQUNiLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDekIsSUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRO0lBQ2xDLElBQUksT0FBTyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDdkU7SUFDQSxJQUFJLE1BQU0sSUFBSSxTQUFTLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO01BQy9ELEtBQUssUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN6RixjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDeEc7SUFDRixDQUFDLE1BQU07TUFDTCxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7TUFDM0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNwRCxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMs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LENBQUEsR0FBQSxNQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsYUFBQSxDQUFBLEVBQUEsQ0FBQSxvQkFBQSxPQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsV0FBQSxrQkFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsZ0NBQUEsT0FBQSxDQUFBLENBQUEsVUFBQSxDQUFBLFlBQUEsU0FBQSx5RUFBQSxDQUFBLEdBQUEsTUFBQSxHQUFBLE1BQUEsRUFBQSxDQUFBO0FBQUEsU0FBQSxlQUFBLEdBQUEsRUFBQSxDQUFBLFdBQUEsZUFBQSxDQUFBLEdBQUEsS0FBQSxxQkFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsMkJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLGdCQUFBO0FBQUEsU0FBQSxpQkFBQSxjQUFBLFNBQUE7QUFBQSxTQUFBLDRCQUFBLENBQUEsRUFBQSxNQUFBLFNBQUEsQ0FBQSxxQkFBQSxDQUFBLHNCQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxpQkFBQSxDQUFBLENBQUEsV0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsV0FBQSxDQUFBLElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxtQkFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLCtEQUFBLElBQUEsQ0FBQSxDQUFBLFVBQUEsaUJBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQTtBQUFBLFNBQUEsa0JBQUEsR0FBQSxFQUFBLEdBQUEsUUFBQSxHQUFBLFlBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLFdBQUEsQ0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLENB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QUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsb0JBQW9CO0VBQ3pELElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFJLEtBQUssRUFBRSxNQUFNLEVBQUs7SUFDbEMsT0FBTyxPQUFBLE1BQUEsQ0FBTyxLQUFLLEVBQUcsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDO0VBQ3RDLENBQUM7RUFFRCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQ2pDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUMxQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7RUFFL0IsSUFBSSxVQUFVLEtBQUssb0JBQW9CLEVBQUU7SUFDdkMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUM1RSxDQUFDLE1BQ0ksSUFBSSxVQUFVLEtBQUssb0JBQW9CLEVBQUU7SUFDNUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUM1RSxDQUFDLE1BQ0ksSUFBSSxVQUFVLEtBQUssb0JBQW9CLEVBQUU7SUFDNUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUM1RSxDQUFDLE1BQ0ksSUFBSSxVQUFVLEtBQUssb0JBQW9CLEVBQUU7SUFDNUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztFQUM1RSxDQUFDLE1BQ0ksSUFBSSxVQUFVLEtBQUssb0JBQW9CLEVBQUU7SUFDNUMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ25FLE9BQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7RUFDcEQ7RUFFQSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQzVFLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQUksU0FBUyxFQUFFLE9BQU8sRUFBSztFQUM3QyxJQUFNLElBQUksR0FBRyxFQUFFO0VBQ2YsSUFBSSxHQUFHLEdBQUcsRUFBRTtFQUVaLElBQUksQ0FBQyxHQUFHLENBQUM7RUFDVCxPQUFPLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQzNCLEdBQUcsR0FBRyxFQUFFO0lBQ1IsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLE9BQU8sRUFBRTtNQUNuRCxHQUFHLENBQUMsSUFBSSxRQUFBLE1BQUEsQ0FBUSxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQU8sQ0FBQztNQUNwQyxDQUFDLElBQUksQ0FBQztJQUNSO0lBQ0EsSUFBSSxDQUFDLElBQUksUUFBQSxNQUFBLENBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBTyxDQUFDO0VBQ3ZDO0VBRUEsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUN0QixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLENBQUksRUFBRSxFQUFpQjtFQUFBLElBQWYsS0FBSyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsRUFBRTtFQUN4QyxJQUFNLGVBQWUsR0FBRyxFQUFFO0VBQzFCLGVBQWUsQ0FBQyxLQUFLLEdBQUcsS0FBSztFQUc3QixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUM7RUFDL0IsZUFBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7QUFDdEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixDQUFJLEVBQUUsRUFBSztFQUNuQyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztFQUU1QyxJQUFJLENBQUMsWUFBWSxFQUFFO0lBQ2pCLE1BQU0sSUFBSSxLQUFLLDZCQUFBLE1BQUEsQ0FBNkIsV0FBVyxDQUFFLENBQUM7RUFDNUQ7RUFFQSxJQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUNoRCwwQkFDRixDQUFDO0VBQ0QsSUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FDaEQsMEJBQ0YsQ0FBQztFQUNELElBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUM7RUFDbkUsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztFQUNsRSxJQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0VBQy9ELElBQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUM7RUFDN0QsSUFBTSxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQztFQUNsRSxJQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLDBCQUEwQixDQUFDOztFQUV2RTtFQUNBLElBQUksa0JBQWtCLEdBQUcsb0JBQW9CO0VBQzdDLElBQUksWUFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0lBQ2hELFFBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVO01BQ3JDLEtBQUssb0JBQW9CO1FBQ3ZCLGtCQUFrQixHQUFHLG9CQUFvQjtRQUN6QztNQUNGLEtBQUssb0JBQW9CO1FBQ3ZCLGtCQUFrQixHQUFHLG9CQUFvQjtRQUN6QztNQUNGLEtBQUssb0JBQW9CO1FBQ3ZCLGtCQUFrQixHQUFHLG9CQUFvQjtRQUN6QztNQUNGLEtBQUssb0JBQW9CO1FBQ3ZCLGtCQUFrQixHQUFHLG9CQUFvQjtRQUN6QztNQUNGLEtBQUssb0JBQW9CO1FBQ3ZCLGtCQUFrQixHQUFHLG9CQUFvQjtJQUM3QztFQUNGO0VBQ0EsSUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0I7RUFFM0MsSUFBTSxTQUFTLEdBQUcsZUFBZSxDQUMvQixlQUFlLENBQUMsS0FBSyxFQUNyQixnQkFBZ0IsRUFDaEIsSUFDRixDQUFDO0VBQ0QsSUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7RUFFM0QsSUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0VBQzlELElBQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztFQUM3RCxJQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7RUFDN0QsSUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0VBQ2pFLElBQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztFQUVyRSxJQUFJLE9BQU8sSUFBSSxPQUFPLElBQUksT0FBTyxHQUFHLE9BQU8sRUFBRTtJQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDO0VBQzlEO0VBRUEsT0FBTztJQUNMLFlBQVksRUFBWixZQUFZO0lBQ1osT0FBTyxFQUFQLE9BQU87SUFDUCxXQUFXLEVBQVgsV0FBVztJQUNYLFFBQVEsRUFBUixRQUFRO0lBQ1IsWUFBWSxFQUFaLFlBQVk7SUFDWixPQUFPLEVBQVAsT0FBTztJQUNQLGdCQUFnQixFQUFoQixnQkFBZ0I7SUFDaEIsWUFBWSxFQUFaLFlBQVk7SUFDWixTQUFTLEVBQVQsU0FBUztJQUNULGVBQWUsRUFBZixlQUFlO0lBQ2YsZUFBZSxFQUFmLGVBQWU7SUFDZixVQUFVLEVBQVYsVUFBVTtJQUNWLFNBQVMsRUFBVCxTQUFTO0lBQ1QsV0FBVyxFQUFYLFdBQVc7SUFDWCxRQUFRLEVBQVIsUUFBUTtJQUNSLE9BQU8sRUFBUCxPQUFPO0lBQ1AsZ0JBQWdCLEVBQWhCO0VBQ0YsQ0FBQztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLEVBQUUsRUFBSztFQUN0QixJQUFBLHFCQUFBLEdBQXlDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztJQUF6RCxlQUFlLEdBQUEscUJBQUEsQ0FBZixlQUFlO0lBQUUsV0FBVyxHQUFBLHFCQUFBLENBQVgsV0FBVztFQUVwQyxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUk7RUFDM0IsZUFBZSxDQUFDLFFBQVEsR0FBRyxJQUFJO0FBQ2pDLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFJLEVBQUUsRUFBSztFQUNyQixJQUFBLHNCQUFBLEdBQXlDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztJQUF6RCxlQUFlLEdBQUEsc0JBQUEsQ0FBZixlQUFlO0lBQUUsV0FBVyxHQUFBLHNCQUFBLENBQVgsV0FBVztFQUVwQyxXQUFXLENBQUMsUUFBUSxHQUFHLEtBQUs7RUFDNUIsZUFBZSxDQUFDLFFBQVEsR0FBRyxLQUFLO0FBQ2xDLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLENBQUksRUFBRSxFQUFLO0VBQ2pDLElBQUEsc0JBQUEsR0FBOEMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBQTlELGVBQWUsR0FBQSxzQkFBQSxDQUFmLGVBQWU7SUFBRSxPQUFPLEdBQUEsc0JBQUEsQ0FBUCxPQUFPO0lBQUUsT0FBTyxHQUFBLHNCQUFBLENBQVAsT0FBTztFQUV6QyxJQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsS0FBSztFQUN4QyxJQUFJLFNBQVMsR0FBRyxLQUFLO0VBRXJCLElBQUksVUFBVSxFQUFFO0lBQ2QsU0FBUyxHQUFHLElBQUk7SUFFaEIsSUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7SUFDdEQsSUFBQSxvQkFBQSxHQUEyQixlQUFlLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxFQUFLO1FBQ3RELElBQUksS0FBSztRQUNULElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssR0FBRyxNQUFNO1FBQ3pDLE9BQU8sS0FBSztNQUNkLENBQUMsQ0FBQztNQUFBLHFCQUFBLEdBQUEsY0FBQSxDQUFBLG9CQUFBO01BTEssR0FBRyxHQUFBLHFCQUFBO01BQUUsS0FBSyxHQUFBLHFCQUFBO01BQUUsSUFBSSxHQUFBLHFCQUFBO0lBT3ZCLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO01BQ2hDLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUM7TUFFL0MsSUFDRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxJQUNsQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQzNCLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLElBQUksSUFDaEMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQy9CLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQ2xEO1FBQ0EsU0FBUyxHQUFHLEtBQUs7TUFDbkI7SUFDRjtFQUNGO0VBRUEsT0FBTyxTQUFTO0FBQ2xCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0saUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLENBQUksRUFBRSxFQUFLO0VBQ2hDLElBQUEsc0JBQUEsR0FBNEIsb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBQTVDLGVBQWUsR0FBQSxzQkFBQSxDQUFmLGVBQWU7RUFDdkIsSUFBTSxTQUFTLEdBQUcsa0JBQWtCLENBQUMsZUFBZSxDQUFDO0VBRXJELElBQUksU0FBUyxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFFO0lBQ25ELGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQztFQUN2RDtFQUVBLElBQUksQ0FBQyxTQUFTLElBQUksZUFBZSxDQUFDLGlCQUFpQixLQUFLLGtCQUFrQixFQUFFO0lBQzFFLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUM7RUFDdkM7QUFDRixDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixDQUFJLEVBQUUsRUFBSztFQUNuQyxJQUFBLHNCQUFBLEdBQXVDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztJQUF2RCxlQUFlLEdBQUEsc0JBQUEsQ0FBZixlQUFlO0lBQUUsU0FBUyxHQUFBLHNCQUFBLENBQVQsU0FBUztFQUNsQyxJQUFJLFFBQVEsR0FBRyxFQUFFO0VBRWpCLElBQUksU0FBUyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDeEMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7RUFDbEM7RUFFQSxJQUFJLGVBQWUsQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO0lBQ3RDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUM7RUFDL0M7QUFDRixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksRUFBRSxFQUFFLFVBQVUsRUFBSztFQUMzQyxJQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFDO0VBRTlDLElBQUksVUFBVSxFQUFFO0lBRWQsSUFBQSxzQkFBQSxHQUtJLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztNQUoxQixZQUFZLEdBQUEsc0JBQUEsQ0FBWixZQUFZO01BQ1osZUFBZSxHQUFBLHNCQUFBLENBQWYsZUFBZTtNQUNmLGVBQWUsR0FBQSxzQkFBQSxDQUFmLGVBQWU7TUFDZixnQkFBZ0IsR0FBQSxzQkFBQSxDQUFoQixnQkFBZ0I7SUFHbEIsSUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQztJQUU5RCxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDO0lBQy9DLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUM7SUFFbEQsaUJBQWlCLENBQUMsWUFBWSxDQUFDO0VBQ2pDO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBSSxFQUFFLEVBQUs7RUFDaEMsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7RUFDNUMsSUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZO0VBRXRELElBQU0sZUFBZSxHQUFHLFlBQVksQ0FBQyxhQUFhLFFBQVEsQ0FBQztFQUUzRCxJQUFJLENBQUMsZUFBZSxFQUFFO0lBQ3BCLE1BQU0sSUFBSSxLQUFLLElBQUEsTUFBQSxDQUFJLFdBQVcsNEJBQXlCLENBQUM7RUFDMUQ7RUFFQSxJQUFNLE9BQU8sR0FBRyxlQUFlLENBQzdCLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLGVBQWUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUNwRSxDQUFDO0VBQ0QsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxHQUNsQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQ25CLGdCQUFnQjtFQUVwQixJQUFNLE9BQU8sR0FBRyxlQUFlLENBQzdCLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLGVBQWUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUNwRSxDQUFDO0VBQ0QsSUFBSSxPQUFPLEVBQUU7SUFDWCxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDO0VBQ3BEO0VBRUEsSUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDckQsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7RUFDeEQsZUFBZSxDQUFDLFFBQVEsR0FBRyxJQUFJO0VBRS9CLElBQU0sZUFBZSxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUNuRCxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQztFQUMvRCxlQUFlLENBQUMsSUFBSSxHQUFHLE1BQU07RUFDN0IsZUFBZSxDQUFDLElBQUksR0FBRyxFQUFFO0VBRXpCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhO0VBQ3BDLElBQU0sVUFBVSxHQUFHLE9BQU8sS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLEVBQUU7RUFDMUQsSUFBTSxnQkFBZ0IsR0FBSSxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sS0FBSyxFQUFFLElBQUksZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDdEksSUFBTSxVQUFVLEdBQUcsT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssRUFBRTtFQUUxRCxJQUFJLFVBQVUsSUFBSSxDQUFDLGdCQUFnQixJQUFJLFVBQVUsRUFBRTtJQUNqRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLElBQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDMUMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztJQUMxQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckMsV0FBVyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7RUFDMU8sQ0FBQyxNQUNJLElBQUksVUFBVSxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxVQUFVLEVBQUU7SUFDdkQsSUFBTSxPQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLElBQU0sU0FBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxJQUFNLFlBQVcsR0FBRyxZQUFZLENBQUMsU0FBUSxDQUFDO0lBQzFDLElBQU0sUUFBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxXQUFXLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxZQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFFBQU8sQ0FBQztFQUN4SSxDQUFDLE1BQ0ksSUFBSSxVQUFVLEVBQUU7SUFDbkIsSUFBTSxPQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLElBQU0sU0FBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxJQUFNLFlBQVcsR0FBRyxZQUFZLENBQUMsU0FBUSxDQUFDO0lBQzFDLElBQU0sUUFBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxXQUFXLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxZQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFFBQU8sQ0FBQztFQUN6STtFQUVBLElBQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUTtFQUU3RCxlQUFlLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztFQUM1QyxlQUFlLENBQUMsa0JBQWtCLENBQ2hDLFdBQVcsRUFDWCxvQ0FBQSxNQUFBLENBQ2tDLHdCQUF3Qiw2Q0FBQSxNQUFBLENBQXNDLElBQUksQ0FBQyxhQUFhLHlDQUFBLE1BQUEsQ0FDakcsb0JBQW9CLDBEQUFBLE1BQUEsQ0FBaUQsV0FBVyw0QkFBQSxNQUFBLENBQXVCLE9BQU8sdURBQUEsTUFBQSxDQUFnRCwwQkFBMEIsMkRBQUEsTUFBQSxDQUNoTCx3QkFBd0IsNkVBQUEsTUFBQSxDQUN4Qix1QkFBdUIsY0FBQSxNQUFBLENBQVMsT0FBTyxnQkFBQSxNQUFBLENBQVksSUFBSSxDQUFDLEtBQUssWUFDckYsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNYLENBQUM7RUFFRCxlQUFlLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7RUFDbkQsZUFBZSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0VBQzlDLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUMzQixTQUFTLEVBQ1QsZ0NBQ0YsQ0FBQztFQUNELGVBQWUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO0VBQ3JDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsS0FBSztFQUVoQyxZQUFZLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztFQUN6QyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQztFQUV6RCxJQUFJLFlBQVksRUFBRTtJQUNoQixnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0VBQzlDO0VBRUEsSUFBSSxlQUFlLENBQUMsUUFBUSxFQUFFO0lBQzVCLE9BQU8sQ0FBQyxZQUFZLENBQUM7SUFDckIsZUFBZSxDQUFDLFFBQVEsR0FBRyxLQUFLO0VBQ2xDO0VBRUEsSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFO0lBQ3pCLGlCQUFpQixDQUFDLGVBQWUsQ0FBQztFQUNwQztBQUNGLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQUksRUFBRSxFQUFFLGNBQWMsRUFBSztFQUM3QyxJQUFBLHNCQUFBLEdBVUksb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBVDFCLFlBQVksR0FBQSxzQkFBQSxDQUFaLFlBQVk7SUFDWixVQUFVLEdBQUEsc0JBQUEsQ0FBVixVQUFVO0lBQ1YsUUFBUSxHQUFBLHNCQUFBLENBQVIsUUFBUTtJQUNSLFlBQVksR0FBQSxzQkFBQSxDQUFaLFlBQVk7SUFDWixPQUFPLEdBQUEsc0JBQUEsQ0FBUCxPQUFPO0lBQ1AsT0FBTyxHQUFBLHNCQUFBLENBQVAsT0FBTztJQUNQLFNBQVMsR0FBQSxzQkFBQSxDQUFULFNBQVM7SUFDVCxRQUFRLEdBQUEsc0JBQUEsQ0FBUixRQUFRO0lBQ1IsT0FBTyxHQUFBLHNCQUFBLENBQVAsT0FBTztFQUVULElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDO0VBQzFCLElBQUksYUFBYSxHQUFHLGNBQWMsSUFBSSxVQUFVO0VBRWhELElBQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLE1BQU07RUFFM0MsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7RUFDN0MsSUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQzdDLElBQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUUvQyxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztFQUM3QyxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztFQUU3QyxJQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7RUFFdEQsSUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQztFQUNoRCxJQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO0VBQy9ELElBQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7RUFFL0QsSUFBTSxtQkFBbUIsR0FBRyxZQUFZLElBQUksYUFBYTtFQUN6RCxJQUFNLGNBQWMsR0FBRyxTQUFTLElBQUksR0FBRyxDQUFDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQztFQUN2RSxJQUFNLFlBQVksR0FBRyxTQUFTLElBQUksR0FBRyxDQUFDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQztFQUVyRSxJQUFNLG9CQUFvQixHQUFHLFNBQVMsSUFBSSxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztFQUNwRSxJQUFNLGtCQUFrQixHQUFHLFNBQVMsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztFQUVoRSxJQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsWUFBWSxDQUFDO0VBRTdDLElBQU0sZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksWUFBWSxFQUFLO0lBQ3pDLElBQU0sT0FBTyxHQUFHLENBQUMsbUJBQW1CLENBQUM7SUFDckMsSUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLElBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQyxJQUFNLElBQUksR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkMsSUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUN6QyxJQUFJLFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtNQUNwQixTQUFTLEdBQUcsQ0FBQztJQUNmO0lBRUEsSUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztJQUU5QyxJQUFJLFFBQVEsR0FBRyxJQUFJO0lBRW5CLElBQU0sVUFBVSxHQUFHLENBQUMscUJBQXFCLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7SUFDekUsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUM7SUFFeEQsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxFQUFFO01BQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUM7SUFDbEQ7SUFFQSxJQUFJLFdBQVcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLEVBQUU7TUFDMUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQztJQUNqRDtJQUVBLElBQUksV0FBVyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsRUFBRTtNQUN4QyxPQUFPLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDO0lBQzlDO0lBRUEsSUFBSSxVQUFVLEVBQUU7TUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDO0lBQzVDO0lBRUEsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxFQUFFO01BQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUM7SUFDekM7SUFFQSxJQUFJLFNBQVMsRUFBRTtNQUNiLElBQUksU0FBUyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsRUFBRTtRQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDO01BQzlDO01BRUEsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxFQUFFO1FBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUM7TUFDcEQ7TUFFQSxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLEVBQUU7UUFDekMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQztNQUNsRDtNQUVBLElBQ0UscUJBQXFCLENBQ25CLFlBQVksRUFDWixvQkFBb0IsRUFDcEIsa0JBQ0YsQ0FBQyxFQUNEO1FBQ0EsT0FBTyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQztNQUNoRDtJQUNGO0lBRUEsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxFQUFFO01BQ3hDLFFBQVEsR0FBRyxHQUFHO01BQ2QsT0FBTyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQztJQUMzQztJQUVBLElBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDcEMsSUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxDQUFDO0lBQzVDLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUM7SUFFcEosMkRBQUEsTUFBQSxDQUVjLFFBQVEsd0JBQUEsTUFBQSxDQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLDRCQUFBLE1BQUEsQ0FDZCxHQUFHLDhCQUFBLE1BQUEsQ0FDRCxLQUFLLEdBQUcsQ0FBQyw2QkFBQSxNQUFBLENBQ1YsSUFBSSw4QkFBQSxNQUFBLENBQ0gsYUFBYSw2QkFBQSxNQUFBLENBQ2IsYUFBYSwrQkFBQSxNQUFBLENBQ1gsVUFBVSxHQUFHLE1BQU0sR0FBRyxPQUFPLGdCQUFBLE1BQUEsQ0FDM0MsVUFBVSw2QkFBMkIsRUFBRSxhQUFBLE1BQUEsQ0FDeEMsR0FBRztFQUNSLENBQUM7RUFDRDtFQUNBLGFBQWEsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDO0VBRXpDLElBQU0sSUFBSSxHQUFHLEVBQUU7RUFFZixPQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUNoQixhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxZQUFZLElBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFDckI7SUFDQSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzFDLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztFQUMzQztFQUNBLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0VBRXpDLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMxQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxvQkFBb0I7RUFDaEQsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQUEsTUFBQSxDQUFNLFlBQVksQ0FBQyxZQUFZLE9BQUk7RUFDeEQsV0FBVyxDQUFDLE1BQU0sR0FBRyxLQUFLO0VBQzFCLElBQUksT0FBTyxtQ0FBQSxNQUFBLENBQWdDLDBCQUEwQiw4QkFBQSxNQUFBLENBQ25ELGtCQUFrQixnQ0FBQSxNQUFBLENBQ2hCLG1CQUFtQixPQUFBLE1BQUEsQ0FBSSxnQ0FBZ0MsZ0ZBQUEsTUFBQSxDQUd4RCw0QkFBNEIsbUNBQUEsTUFBQSxDQUN2QixJQUFJLENBQUMsYUFBYSxzQkFBQSxNQUFBLENBQzlCLG1CQUFtQiw2QkFBMkIsRUFBRSx5RUFBQSxNQUFBLENBR3hDLG1CQUFtQixPQUFBLE1BQUEsQ0FBSSxnQ0FBZ0MsZ0ZBQUEsTUFBQSxDQUd4RCw2QkFBNkIsbUNBQUEsTUFBQSxDQUN4QixJQUFJLENBQUMsY0FBYyxzQkFBQSxNQUFBLENBQy9CLG1CQUFtQiw2QkFBMkIsRUFBRSx5RUFBQSxNQUFBLENBR3hDLG1CQUFtQixPQUFBLE1BQUEsQ0FBSSwwQkFBMEIsZ0ZBQUEsTUFBQSxDQUdsRCw4QkFBOEIsc0JBQUEsTUFBQSxDQUFpQixVQUFVLFFBQUEsTUFBQSxDQUFLLElBQUksQ0FBQyxZQUFZLHNCQUFBLE1BQUEsQ0FDdkYsVUFBVSxzRkFBQSxNQUFBLENBR0YsNkJBQTZCLHNCQUFBLE1BQUEsQ0FBaUIsV0FBVyxRQUFBLE1BQUEsQ0FBSyxJQUFJLENBQUMsV0FBVyxzQkFBQSxNQUFBLENBQ3RGLFdBQVcsc0RBQUEsTUFBQSxDQUVGLG1CQUFtQixPQUFBLE1BQUEsQ0FBSSxnQ0FBZ0MsZ0ZBQUEsTUFBQSxDQUd4RCx5QkFBeUIsbUNBQUEsTUFBQSxDQUNwQixJQUFJLENBQUMsVUFBVSxzQkFBQSxNQUFBLENBQzNCLG1CQUFtQiw2QkFBMkIsRUFBRSx5RUFBQSxNQUFBLENBR3hDLG1CQUFtQixPQUFBLE1BQUEsQ0FBSSxnQ0FBZ0MsZ0ZBQUEsTUFBQSxDQUd4RCx3QkFBd0IsbUNBQUEsTUFBQSxDQUNuQixJQUFJLENBQUMsU0FBUyxzQkFBQSxNQUFBLENBQzFCLG1CQUFtQiw2QkFBMkIsRUFBRSx1RkFBQSxNQUFBLENBSXhDLG9CQUFvQiwrREFFM0I7RUFDYixLQUFJLElBQUksQ0FBQyxJQUFJLGtCQUFrQixFQUFDO0lBQzlCLE9BQU8sbUJBQUEsTUFBQSxDQUFrQiwwQkFBMEIsb0NBQUEsTUFBQSxDQUE2QixrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBQSxNQUFBLENBQUssa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFPO0VBQ2xKO0VBQ0EsT0FBTywyREFBQSxNQUFBLENBR0csU0FBUyxtREFHVjtFQUNULFdBQVcsQ0FBQyxTQUFTLEdBQUcsT0FBTztFQUMvQixVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDO0VBRTNELFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDO0VBQ3BELElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7SUFDNUIsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLO0lBQ3ZCLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtNQUNsQixPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUs7SUFDeEI7RUFDRjtFQUVBLElBQU0sUUFBUSxHQUFHLEVBQUU7RUFFbkIsSUFBSSxpQkFBaUIsRUFBRTtJQUNyQixRQUFRLENBQUMsV0FBVyxHQUFHLEVBQUU7RUFDM0IsQ0FBQyxNQUNJLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7SUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7RUFDekMsQ0FBQyxNQUNJLElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssRUFBRSxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFO0lBQ2xHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0VBQ3hDLENBQUMsTUFDSTtJQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztFQUN2SDtFQUVBLFFBQVEsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7RUFFMUMsT0FBTyxXQUFXO0FBQ3BCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sbUJBQW1CLEdBQUcsU0FBdEIsbUJBQW1CLENBQUksU0FBUyxFQUFLO0VBQ3pDLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRTtFQUN4QixJQUFBLHNCQUFBLEdBQXVELG9CQUFvQixDQUN6RSxTQUNGLENBQUM7SUFGTyxVQUFVLEdBQUEsc0JBQUEsQ0FBVixVQUFVO0lBQUUsWUFBWSxHQUFBLHNCQUFBLENBQVosWUFBWTtJQUFFLE9BQU8sR0FBQSxzQkFBQSxDQUFQLE9BQU87SUFBRSxPQUFPLEdBQUEsc0JBQUEsQ0FBUCxPQUFPO0VBR2xELElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0VBQ3BDLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztFQUN2RCxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztFQUVwRCxJQUFJLFdBQVcsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDO0VBQ25FLElBQUksV0FBVyxDQUFDLFFBQVEsRUFBRTtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztFQUMvRDtFQUNBLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixDQUFJLFNBQVMsRUFBSztFQUMxQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUU7RUFDeEIsSUFBQSxzQkFBQSxHQUF1RCxvQkFBb0IsQ0FDekUsU0FDRixDQUFDO0lBRk8sVUFBVSxHQUFBLHNCQUFBLENBQVYsVUFBVTtJQUFFLFlBQVksR0FBQSxzQkFBQSxDQUFaLFlBQVk7SUFBRSxPQUFPLEdBQUEsc0JBQUEsQ0FBUCxPQUFPO0lBQUUsT0FBTyxHQUFBLHNCQUFBLENBQVAsT0FBTztFQUdsRCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztFQUNyQyxJQUFJLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7RUFDdkQsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7RUFFcEQsSUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQztFQUNwRSxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7SUFDeEIsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUM7RUFDL0Q7RUFDQSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxTQUFTLEVBQUs7RUFDdEMsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFO0VBQ3hCLElBQUEsdUJBQUEsR0FBdUQsb0JBQW9CLENBQ3pFLFNBQ0YsQ0FBQztJQUZPLFVBQVUsR0FBQSx1QkFBQSxDQUFWLFVBQVU7SUFBRSxZQUFZLEdBQUEsdUJBQUEsQ0FBWixZQUFZO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87RUFHbEQsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7RUFDckMsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0VBQ3ZELElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0VBRXBELElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7RUFDaEUsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO0lBQ3hCLFdBQVcsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDO0VBQy9EO0VBQ0EsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxTQUFTLEVBQUs7RUFDckMsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFO0VBQ3hCLElBQUEsdUJBQUEsR0FBdUQsb0JBQW9CLENBQ3pFLFNBQ0YsQ0FBQztJQUZPLFVBQVUsR0FBQSx1QkFBQSxDQUFWLFVBQVU7SUFBRSxZQUFZLEdBQUEsdUJBQUEsQ0FBWixZQUFZO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87RUFHbEQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7RUFDcEMsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0VBQ3ZELElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0VBRXBELElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUM7RUFDL0QsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO0lBQ3hCLFdBQVcsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDO0VBQy9EO0VBQ0EsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEVBQUUsRUFBSztFQUMzQixJQUFBLHVCQUFBLEdBQStDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztJQUEvRCxZQUFZLEdBQUEsdUJBQUEsQ0FBWixZQUFZO0lBQUUsVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtJQUFFLFFBQVEsR0FBQSx1QkFBQSxDQUFSLFFBQVE7RUFFMUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUM7RUFDdkQsVUFBVSxDQUFDLE1BQU0sR0FBRyxJQUFJO0VBQ3hCLFFBQVEsQ0FBQyxXQUFXLEdBQUcsRUFBRTtBQUMzQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxjQUFjLEVBQUs7RUFDckMsSUFBSSxjQUFjLENBQUMsUUFBUSxFQUFFO0VBRTdCLElBQUEsdUJBQUEsR0FBNkQsb0JBQW9CLENBQy9FLGNBQ0YsQ0FBQztJQUZPLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7SUFBRSxlQUFlLEdBQUEsdUJBQUEsQ0FBZixlQUFlO0lBQUUsUUFBUSxHQUFBLHVCQUFBLENBQVIsUUFBUTtJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87RUFHeEQsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0VBQzlELFlBQVksQ0FBQyxZQUFZLENBQUM7RUFDMUIsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJO0VBQ3RCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSTtFQUVyQixlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFJLEVBQUUsRUFBSztFQUM3QixJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7RUFDakIsSUFBQSx1QkFBQSxHQVFJLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztJQVAxQixRQUFRLEdBQUEsdUJBQUEsQ0FBUixRQUFRO0lBQ1IsVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtJQUNWLFNBQVMsR0FBQSx1QkFBQSxDQUFULFNBQVM7SUFDVCxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBQ1AsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztJQUNQLFdBQVcsR0FBQSx1QkFBQSxDQUFYLFdBQVc7SUFDWCxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0VBR1QsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO0lBQ3JCLElBQU0sYUFBYSxHQUFHLHdCQUF3QixDQUM1QyxTQUFTLElBQUksV0FBVyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQ25DLE9BQU8sRUFDUCxPQUNGLENBQUM7SUFDRCxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztJQUM3RCxXQUFXLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDMUQsQ0FBQyxNQUFNO0lBQ0wsWUFBWSxDQUFDLEVBQUUsQ0FBQztJQUNoQixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUk7SUFDdEIsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJO0VBQ3ZCO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSx1QkFBdUIsR0FBRyxTQUExQix1QkFBdUIsQ0FBSSxFQUFFLEVBQUs7RUFDdEMsSUFBQSx1QkFBQSxHQUFvRCxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7SUFBcEUsVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtJQUFFLFNBQVMsR0FBQSx1QkFBQSxDQUFULFNBQVM7SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztFQUMvQyxJQUFNLGFBQWEsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO0VBRXhDLElBQUksYUFBYSxJQUFJLFNBQVMsRUFBRTtJQUM5QixJQUFNLGFBQWEsR0FBRyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUMzRSxjQUFjLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztFQUMzQztBQUNGLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFJLEVBQUUsRUFBRSxjQUFjLEVBQUs7RUFDcEQsSUFBQSx1QkFBQSxHQU1JLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztJQUwxQixVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO0lBQ1YsUUFBUSxHQUFBLHVCQUFBLENBQVIsUUFBUTtJQUNSLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7SUFDWixPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBQ1AsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztFQUdULElBQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUM3QyxJQUFNLFlBQVksR0FBRyxjQUFjLElBQUksSUFBSSxHQUFHLGFBQWEsR0FBRyxjQUFjO0VBRTVFLElBQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFLO0lBQ2hELElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDO0lBRWxELElBQU0sVUFBVSxHQUFHLDJCQUEyQixDQUM1QyxZQUFZLEVBQ1osT0FBTyxFQUNQLE9BQ0YsQ0FBQztJQUVELElBQUksUUFBUSxHQUFHLElBQUk7SUFFbkIsSUFBTSxPQUFPLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztJQUN0QyxJQUFNLFVBQVUsR0FBRyxLQUFLLEtBQUssYUFBYTtJQUUxQyxJQUFJLEtBQUssS0FBSyxZQUFZLEVBQUU7TUFDMUIsUUFBUSxHQUFHLEdBQUc7TUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDO0lBQzVDO0lBRUEsSUFBSSxVQUFVLEVBQUU7TUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDO0lBQzdDO0lBRUEsZ0VBQUEsTUFBQSxDQUVnQixRQUFRLDBCQUFBLE1BQUEsQ0FDWCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQ0FBQSxNQUFBLENBQ1osS0FBSywrQkFBQSxNQUFBLENBQ0wsS0FBSyxpQ0FBQSxNQUFBLENBQ0gsVUFBVSxHQUFHLE1BQU0sR0FBRyxPQUFPLGtCQUFBLE1BQUEsQ0FDM0MsVUFBVSw2QkFBMkIsRUFBRSxlQUFBLE1BQUEsQ0FDeEMsS0FBSztFQUNaLENBQUMsQ0FBQztFQUVGLElBQU0sVUFBVSxtQ0FBQSxNQUFBLENBQWdDLDJCQUEyQiw4QkFBQSxNQUFBLENBQ3pELG9CQUFvQix3REFBQSxNQUFBLENBRTlCLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLDZDQUcxQjtFQUVQLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMxQyxXQUFXLENBQUMsU0FBUyxHQUFHLFVBQVU7RUFDbEMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQztFQUUzRCxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0I7RUFFNUMsT0FBTyxXQUFXO0FBQ3BCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sV0FBVyxHQUFHLFNBQWQsV0FBVyxDQUFJLE9BQU8sRUFBSztFQUMvQixJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7RUFDdEIsSUFBQSx1QkFBQSxHQUF1RCxvQkFBb0IsQ0FDekUsT0FDRixDQUFDO0lBRk8sVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtJQUFFLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztFQUdsRCxJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO0VBQ3pELElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDO0VBQ2hELElBQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztFQUN2RCxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztFQUNwRCxXQUFXLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUQsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CLENBQUksRUFBRSxFQUFFLGFBQWEsRUFBSztFQUNsRCxJQUFBLHVCQUFBLEdBTUksb0JBQW9CLENBQUMsRUFBRSxDQUFDO0lBTDFCLFVBQVUsR0FBQSx1QkFBQSxDQUFWLFVBQVU7SUFDVixRQUFRLEdBQUEsdUJBQUEsQ0FBUixRQUFRO0lBQ1IsWUFBWSxHQUFBLHVCQUFBLENBQVosWUFBWTtJQUNaLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87SUFDUCxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0VBR1QsSUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQy9DLElBQU0sV0FBVyxHQUFHLGFBQWEsSUFBSSxJQUFJLEdBQUcsWUFBWSxHQUFHLGFBQWE7RUFFeEUsSUFBSSxXQUFXLEdBQUcsV0FBVztFQUM3QixXQUFXLElBQUksV0FBVyxHQUFHLFVBQVU7RUFDdkMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQztFQUV0QyxJQUFNLHFCQUFxQixHQUFHLDBCQUEwQixDQUN0RCxPQUFPLENBQUMsWUFBWSxFQUFFLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFDdEMsT0FBTyxFQUNQLE9BQ0YsQ0FBQztFQUVELElBQU0scUJBQXFCLEdBQUcsMEJBQTBCLENBQ3RELE9BQU8sQ0FBQyxZQUFZLEVBQUUsV0FBVyxHQUFHLFVBQVUsQ0FBQyxFQUMvQyxPQUFPLEVBQ1AsT0FDRixDQUFDO0VBRUQsSUFBTSxLQUFLLEdBQUcsRUFBRTtFQUNoQixJQUFJLFNBQVMsR0FBRyxXQUFXO0VBQzNCLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxVQUFVLEVBQUU7SUFDaEMsSUFBTSxVQUFVLEdBQUcsMEJBQTBCLENBQzNDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLEVBQ2hDLE9BQU8sRUFDUCxPQUNGLENBQUM7SUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJO0lBRW5CLElBQU0sT0FBTyxHQUFHLENBQUMsbUJBQW1CLENBQUM7SUFDckMsSUFBTSxVQUFVLEdBQUcsU0FBUyxLQUFLLFlBQVk7SUFFN0MsSUFBSSxTQUFTLEtBQUssV0FBVyxFQUFFO01BQzdCLFFBQVEsR0FBRyxHQUFHO01BQ2QsT0FBTyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQztJQUMzQztJQUVBLElBQUksVUFBVSxFQUFFO01BQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQztJQUM1QztJQUVBLEtBQUssQ0FBQyxJQUFJLDBEQUFBLE1BQUEsQ0FHTSxRQUFRLDBCQUFBLE1BQUEsQ0FDWCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQ0FBQSxNQUFBLENBQ1osU0FBUyxpQ0FBQSxNQUFBLENBQ1AsVUFBVSxHQUFHLE1BQU0sR0FBRyxPQUFPLGtCQUFBLE1BQUEsQ0FDM0MsVUFBVSw2QkFBMkIsRUFBRSxlQUFBLE1BQUEsQ0FDeEMsU0FBUyxjQUNkLENBQUM7SUFDRCxTQUFTLElBQUksQ0FBQztFQUNoQjtFQUVBLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0VBQzFDLElBQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQztFQUNqRixJQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7RUFDekUsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsV0FBVyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUM7RUFFekgsSUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzFDLFdBQVcsQ0FBQyxTQUFTLG1DQUFBLE1BQUEsQ0FBZ0MsMEJBQTBCLDhCQUFBLE1BQUEsQ0FDN0Qsb0JBQW9CLG9LQUFBLE1BQUEsQ0FNZixrQ0FBa0Msd0NBQUEsTUFBQSxDQUM3QixzQkFBc0IsMEJBQUEsTUFBQSxDQUNsQyxxQkFBcUIsNkJBQTJCLEVBQUUsd0hBQUEsTUFBQSxDQUl0QyxvQkFBb0IsNEVBQUEsTUFBQSxDQUU5QixTQUFTLCtLQUFBLE1BQUEsQ0FPSiw4QkFBOEIsd0NBQUEsTUFBQSxDQUN6QixrQkFBa0IsMEJBQUEsTUFBQSxDQUM5QixxQkFBcUIsNkJBQTJCLEVBQUUsdUhBTXpEO0VBQ1QsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQztFQUUzRCxRQUFRLENBQUMsV0FBVyxHQUFHLGFBQWE7RUFFcEMsT0FBTyxXQUFXO0FBQ3BCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sd0JBQXdCLEdBQUcsU0FBM0Isd0JBQXdCLENBQUksRUFBRSxFQUFLO0VBQ3ZDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtFQUVqQixJQUFBLHVCQUFBLEdBQXVELG9CQUFvQixDQUN6RSxFQUNGLENBQUM7SUFGTyxVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO0lBQUUsWUFBWSxHQUFBLHVCQUFBLENBQVosWUFBWTtJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0VBR2xELElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUM7RUFDOUQsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0VBRXJELElBQUksWUFBWSxHQUFHLFlBQVksR0FBRyxVQUFVO0VBQzVDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUM7RUFFeEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUM7RUFDaEQsSUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7RUFDbkUsSUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQ3RDLFVBQVUsRUFDVixVQUFVLENBQUMsV0FBVyxDQUFDLENBQ3pCLENBQUM7RUFFRCxJQUFJLFdBQVcsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDO0VBQ3pFLElBQUksV0FBVyxDQUFDLFFBQVEsRUFBRTtJQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztFQUMvRDtFQUNBLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixDQUFJLEVBQUUsRUFBSztFQUNuQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7RUFFakIsSUFBQSx1QkFBQSxHQUF1RCxvQkFBb0IsQ0FDekUsRUFDRixDQUFDO0lBRk8sVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtJQUFFLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0lBQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztFQUdsRCxJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDO0VBQzlELElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztFQUVyRCxJQUFJLFlBQVksR0FBRyxZQUFZLEdBQUcsVUFBVTtFQUM1QyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDO0VBRXhDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0VBQ2hELElBQU0sVUFBVSxHQUFHLHdCQUF3QixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0VBQ25FLElBQU0sV0FBVyxHQUFHLG9CQUFvQixDQUN0QyxVQUFVLEVBQ1YsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUN6QixDQUFDO0VBRUQsSUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQztFQUNyRSxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7SUFDeEIsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUM7RUFDL0Q7RUFDQSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksTUFBTSxFQUFLO0VBQzdCLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtFQUNyQixJQUFBLHVCQUFBLEdBQXVELG9CQUFvQixDQUN6RSxNQUNGLENBQUM7SUFGTyxVQUFVLEdBQUEsdUJBQUEsQ0FBVixVQUFVO0lBQUUsWUFBWSxHQUFBLHVCQUFBLENBQVosWUFBWTtJQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0VBR2xELElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztFQUNuRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztFQUM5QyxJQUFJLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7RUFDdkQsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7RUFDcEQsV0FBVyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFELENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sd0JBQXdCLEdBQUcsU0FBM0Isd0JBQXdCLENBQUksS0FBSyxFQUFLO0VBQzFDLElBQUEsdUJBQUEsR0FBNkQsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUF2RixZQUFZLEdBQUEsdUJBQUEsQ0FBWixZQUFZO0lBQUUsZUFBZSxHQUFBLHVCQUFBLENBQWYsZUFBZTtJQUFFLFFBQVEsR0FBQSx1QkFBQSxDQUFSLFFBQVE7SUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO0VBRXhELFlBQVksQ0FBQyxZQUFZLENBQUM7RUFDMUIsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJO0VBQ3RCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSTtFQUNyQixlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7RUFFdkIsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBSSxZQUFZLEVBQUs7RUFDdkMsT0FBTyxVQUFDLEtBQUssRUFBSztJQUNoQixJQUFBLHVCQUFBLEdBQXVELG9CQUFvQixDQUN6RSxLQUFLLENBQUMsTUFDUixDQUFDO01BRk8sVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtNQUFFLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7TUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO01BQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztJQUlsRCxJQUFNLElBQUksR0FBRyxZQUFZLENBQUMsWUFBWSxDQUFDO0lBRXZDLElBQU0sVUFBVSxHQUFHLHdCQUF3QixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0lBQ25FLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxFQUFFO01BQ3hDLElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO01BQzFELFdBQVcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRDtJQUNBLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUN4QixDQUFDO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxnQkFBZ0IsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQUM7O0FBRXBFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQUEsRUFBQzs7QUFFdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBSTtFQUFBLE9BQUssT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFBQSxFQUFDOztBQUVyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQUM7O0FBRXRFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLFdBQVcsQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUFDOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxpQkFBaUIsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFBQzs7QUFFbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sc0JBQXNCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBSTtFQUFBLE9BQUssU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFBQSxFQUFDOztBQUUzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQUM7O0FBRXpFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLDJCQUEyQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQUEsRUFBQzs7QUFFL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0seUJBQXlCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBSTtFQUFBLE9BQUssUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFBQSxFQUFDOztBQUU3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHVCQUF1QixHQUFHLFNBQTFCLHVCQUF1QixDQUFJLE1BQU0sRUFBSztFQUMxQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7RUFFckIsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztFQUV2RCxJQUFNLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSztFQUNwRCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUs7RUFFdEMsSUFBSSxTQUFTLEtBQUssbUJBQW1CLEVBQUU7RUFFdkMsSUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQztFQUNoRCxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztFQUM3RCxXQUFXLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUQsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSwwQkFBMEIsR0FBRyxTQUE3QiwwQkFBMEIsQ0FBSSxhQUFhLEVBQUs7RUFDcEQsT0FBTyxVQUFDLEtBQUssRUFBSztJQUNoQixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTTtJQUM1QixJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO0lBQ3pELElBQUEsdUJBQUEsR0FBdUQsb0JBQW9CLENBQ3pFLE9BQ0YsQ0FBQztNQUZPLFVBQVUsR0FBQSx1QkFBQSxDQUFWLFVBQVU7TUFBRSxZQUFZLEdBQUEsdUJBQUEsQ0FBWixZQUFZO01BQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztNQUFFLE9BQU8sR0FBQSx1QkFBQSxDQUFQLE9BQU87SUFHbEQsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7SUFFekQsSUFBSSxhQUFhLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQztJQUNoRCxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFeEQsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7SUFDbEQsSUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7SUFDbkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLEVBQUU7TUFDekMsSUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQ3ZDLFVBQVUsRUFDVixVQUFVLENBQUMsUUFBUSxDQUFDLENBQ3RCLENBQUM7TUFDRCxXQUFXLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0Q7SUFDQSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDeEIsQ0FBQztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0saUJBQWlCLEdBQUcsMEJBQTBCLENBQUMsVUFBQyxLQUFLO0VBQUEsT0FBSyxLQUFLLEdBQUcsQ0FBQztBQUFBLEVBQUM7O0FBRTFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLG1CQUFtQixHQUFHLDBCQUEwQixDQUFDLFVBQUMsS0FBSztFQUFBLE9BQUssS0FBSyxHQUFHLENBQUM7QUFBQSxFQUFDOztBQUU1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxtQkFBbUIsR0FBRywwQkFBMEIsQ0FBQyxVQUFDLEtBQUs7RUFBQSxPQUFLLEtBQUssR0FBRyxDQUFDO0FBQUEsRUFBQzs7QUFFNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sb0JBQW9CLEdBQUcsMEJBQTBCLENBQUMsVUFBQyxLQUFLO0VBQUEsT0FBSyxLQUFLLEdBQUcsQ0FBQztBQUFBLEVBQUM7O0FBRTdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLG1CQUFtQixHQUFHLDBCQUEwQixDQUNwRCxVQUFDLEtBQUs7RUFBQSxPQUFLLEtBQUssR0FBSSxLQUFLLEdBQUcsQ0FBRTtBQUFBLENBQ2hDLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sa0JBQWtCLEdBQUcsMEJBQTBCLENBQ25ELFVBQUMsS0FBSztFQUFBLE9BQUssS0FBSyxHQUFHLENBQUMsR0FBSSxLQUFLLEdBQUcsQ0FBRTtBQUFBLENBQ3BDLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sdUJBQXVCLEdBQUcsMEJBQTBCLENBQUM7RUFBQSxPQUFNLEVBQUU7QUFBQSxFQUFDOztBQUVwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxxQkFBcUIsR0FBRywwQkFBMEIsQ0FBQztFQUFBLE9BQU0sQ0FBQztBQUFBLEVBQUM7O0FBRWpFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sd0JBQXdCLEdBQUcsU0FBM0Isd0JBQXdCLENBQUksT0FBTyxFQUFLO0VBQzVDLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtFQUN0QixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLEVBQUU7RUFFOUQsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztFQUV0RCxJQUFNLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO0VBQzlELFdBQVcsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRCxDQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHlCQUF5QixHQUFHLFNBQTVCLHlCQUF5QixDQUFJLFlBQVksRUFBSztFQUNsRCxPQUFPLFVBQUMsS0FBSyxFQUFLO0lBQ2hCLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNO0lBQzNCLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7SUFDdkQsSUFBQSx1QkFBQSxHQUF1RCxvQkFBb0IsQ0FDekUsTUFDRixDQUFDO01BRk8sVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtNQUFFLFlBQVksR0FBQSx1QkFBQSxDQUFaLFlBQVk7TUFBRSxPQUFPLEdBQUEsdUJBQUEsQ0FBUCxPQUFPO01BQUUsT0FBTyxHQUFBLHVCQUFBLENBQVAsT0FBTztJQUdsRCxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztJQUV2RCxJQUFJLFlBQVksR0FBRyxZQUFZLENBQUMsWUFBWSxDQUFDO0lBQzdDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUM7SUFFeEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUM7SUFDaEQsSUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7SUFDbkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLEVBQUU7TUFDeEMsSUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQ3RDLFVBQVUsRUFDVixVQUFVLENBQUMsV0FBVyxDQUFDLENBQ3pCLENBQUM7TUFDRCxXQUFXLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQ7SUFDQSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDeEIsQ0FBQztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sZ0JBQWdCLEdBQUcseUJBQXlCLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxJQUFJLEdBQUcsQ0FBQztBQUFBLEVBQUM7O0FBRXRFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGtCQUFrQixHQUFHLHlCQUF5QixDQUFDLFVBQUMsSUFBSTtFQUFBLE9BQUssSUFBSSxHQUFHLENBQUM7QUFBQSxFQUFDOztBQUV4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyx5QkFBeUIsQ0FBQyxVQUFDLElBQUk7RUFBQSxPQUFLLElBQUksR0FBRyxDQUFDO0FBQUEsRUFBQzs7QUFFeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sbUJBQW1CLEdBQUcseUJBQXlCLENBQUMsVUFBQyxJQUFJO0VBQUEsT0FBSyxJQUFJLEdBQUcsQ0FBQztBQUFBLEVBQUM7O0FBRXpFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLGtCQUFrQixHQUFHLHlCQUF5QixDQUNsRCxVQUFDLElBQUk7RUFBQSxPQUFLLElBQUksR0FBSSxJQUFJLEdBQUcsQ0FBRTtBQUFBLENBQzdCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0saUJBQWlCLEdBQUcseUJBQXlCLENBQ2pELFVBQUMsSUFBSTtFQUFBLE9BQUssSUFBSSxHQUFHLENBQUMsR0FBSSxJQUFJLEdBQUcsQ0FBRTtBQUFBLENBQ2pDLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sb0JBQW9CLEdBQUcseUJBQXlCLENBQ3BELFVBQUMsSUFBSTtFQUFBLE9BQUssSUFBSSxHQUFHLFVBQVU7QUFBQSxDQUM3QixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHNCQUFzQixHQUFHLHlCQUF5QixDQUN0RCxVQUFDLElBQUk7RUFBQSxPQUFLLElBQUksR0FBRyxVQUFVO0FBQUEsQ0FDN0IsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLHVCQUF1QixHQUFHLFNBQTFCLHVCQUF1QixDQUFJLE1BQU0sRUFBSztFQUMxQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7RUFDckIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFO0VBRTVELElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7RUFFcEQsSUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztFQUMzRCxXQUFXLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUQsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxTQUFTLEVBQUs7RUFDaEMsSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBSSxFQUFFLEVBQUs7SUFDbEMsSUFBQSx1QkFBQSxHQUF1QixvQkFBb0IsQ0FBQyxFQUFFLENBQUM7TUFBdkMsVUFBVSxHQUFBLHVCQUFBLENBQVYsVUFBVTtJQUNsQixJQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDO0lBRXZELElBQU0sYUFBYSxHQUFHLENBQUM7SUFDdkIsSUFBTSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDakQsSUFBTSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsYUFBYSxDQUFDO0lBQ3JELElBQU0sV0FBVyxHQUFHLGlCQUFpQixDQUFDLFlBQVksQ0FBQztJQUNuRCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUU3RCxJQUFNLFNBQVMsR0FBRyxVQUFVLEtBQUssWUFBWTtJQUM3QyxJQUFNLFVBQVUsR0FBRyxVQUFVLEtBQUssYUFBYTtJQUMvQyxJQUFNLFVBQVUsR0FBRyxVQUFVLEtBQUssQ0FBQyxDQUFDO0lBRXBDLE9BQU87TUFDTCxpQkFBaUIsRUFBakIsaUJBQWlCO01BQ2pCLFVBQVUsRUFBVixVQUFVO01BQ1YsWUFBWSxFQUFaLFlBQVk7TUFDWixVQUFVLEVBQVYsVUFBVTtNQUNWLFdBQVcsRUFBWCxXQUFXO01BQ1gsU0FBUyxFQUFUO0lBQ0YsQ0FBQztFQUNILENBQUM7RUFFRCxPQUFPO0lBQ0wsUUFBUSxXQUFBLFNBQUMsS0FBSyxFQUFFO01BQ2QsSUFBQSxvQkFBQSxHQUFnRCxtQkFBbUIsQ0FDakUsS0FBSyxDQUFDLE1BQ1IsQ0FBQztRQUZPLFlBQVksR0FBQSxvQkFBQSxDQUFaLFlBQVk7UUFBRSxTQUFTLEdBQUEsb0JBQUEsQ0FBVCxTQUFTO1FBQUUsVUFBVSxHQUFBLG9CQUFBLENBQVYsVUFBVTtNQUkzQyxJQUFJLFNBQVMsSUFBSSxVQUFVLEVBQUU7UUFDM0IsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RCLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN0QjtJQUNGLENBQUM7SUFDRCxPQUFPLFdBQUEsUUFBQyxLQUFLLEVBQUU7TUFDYixJQUFBLHFCQUFBLEdBQWdELG1CQUFtQixDQUNqRSxLQUFLLENBQUMsTUFDUixDQUFDO1FBRk8sV0FBVyxHQUFBLHFCQUFBLENBQVgsV0FBVztRQUFFLFVBQVUsR0FBQSxxQkFBQSxDQUFWLFVBQVU7UUFBRSxVQUFVLEdBQUEscUJBQUEsQ0FBVixVQUFVO01BSTNDLElBQUksVUFBVSxJQUFJLFVBQVUsRUFBRTtRQUM1QixLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEIsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3JCO0lBQ0Y7RUFDRixDQUFDO0FBQ0gsQ0FBQztBQUVELElBQU0seUJBQXlCLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDO0FBQ25FLElBQU0sMEJBQTBCLEdBQUcsVUFBVSxDQUFDLHNCQUFzQixDQUFDO0FBQ3JFLElBQU0seUJBQXlCLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDOztBQUVuRTs7QUFFQTs7QUFFQSxJQUFNLGdCQUFnQixHQUFBLGVBQUEsQ0FBQSxlQUFBLENBQUEsZUFBQSxDQUFBLGVBQUEsQ0FBQSxlQUFBLEtBQ25CLEtBQUssR0FBQSxNQUFBLE9BQUEsZUFBQSxDQUFBLGVBQUEsQ0FBQSxlQUFBLENBQUEsZUFBQSxDQUFBLGVBQUEsQ0FBQSxlQUFBLENBQUEsZUFBQSxDQUFBLGVBQUEsQ0FBQSxlQUFBLENBQUEsZUFBQSxDQUFBLE1BQUEsRUFDSCxrQkFBa0IsY0FBSTtFQUNyQixjQUFjLENBQUMsSUFBSSxDQUFDO0FBQ3RCLENBQUMsR0FDQSxhQUFhLGNBQUk7RUFDaEIsVUFBVSxDQUFDLElBQUksQ0FBQztBQUNsQixDQUFDLEdBQ0EsY0FBYyxjQUFJO0VBQ2pCLFdBQVcsQ0FBQyxJQUFJLENBQUM7QUFDbkIsQ0FBQyxHQUNBLGFBQWEsY0FBSTtFQUNoQixVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ2xCLENBQUMsR0FDQSx1QkFBdUIsY0FBSTtFQUMxQixvQkFBb0IsQ0FBQyxJQUFJLENBQUM7QUFDNUIsQ0FBQyxHQUNBLG1CQUFtQixjQUFJO0VBQ3RCLGdCQUFnQixDQUFDLElBQUksQ0FBQztBQUN4QixDQUFDLEdBQ0Esc0JBQXNCLGNBQUk7RUFDekIsbUJBQW1CLENBQUMsSUFBSSxDQUFDO0FBQzNCLENBQUMsR0FDQSxrQkFBa0IsY0FBSTtFQUNyQixlQUFlLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLENBQUMsR0FDQSw0QkFBNEIsY0FBSTtFQUMvQix3QkFBd0IsQ0FBQyxJQUFJLENBQUM7QUFDaEMsQ0FBQyxHQUNBLHdCQUF3QixjQUFJO0VBQzNCLG9CQUFvQixDQUFDLElBQUksQ0FBQztBQUM1QixDQUFDLEdBQUEsZUFBQSxDQUFBLGVBQUEsQ0FBQSxNQUFBLEVBQ0Esd0JBQXdCLGNBQUk7RUFDM0IsSUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDO0VBQy9DLFdBQVcsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRCxDQUFDLEdBQ0EsdUJBQXVCLGNBQUk7RUFDMUIsSUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDO0VBQzlDLFdBQVcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDLGNBQUEsZUFBQSxLQUdBLG9CQUFvQixZQUFFLEtBQUssRUFBRTtFQUM1QixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWM7RUFDM0MsSUFBSSxHQUFBLE1BQUEsQ0FBRyxLQUFLLENBQUMsT0FBTyxNQUFPLE9BQU8sRUFBRTtJQUNsQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDeEI7QUFDRixDQUFDLGVBQUEsZUFBQSxDQUFBLGVBQUEsQ0FBQSxlQUFBLENBQUEsZUFBQSxDQUFBLGVBQUEsQ0FBQSxlQUFBLENBQUEsZUFBQSxDQUFBLGVBQUEsQ0FBQSxlQUFBLEtBR0EsMEJBQTBCLFlBQUUsS0FBSyxFQUFFO0VBQ2xDLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxhQUFhLEVBQUU7SUFDbkMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO0VBQ3pCO0FBQ0YsQ0FBQyxHQUNBLGFBQWEsRUFBRyxJQUFBLGdCQUFNLEVBQUM7RUFDdEIsRUFBRSxFQUFFLGdCQUFnQjtFQUNwQixPQUFPLEVBQUUsZ0JBQWdCO0VBQ3pCLElBQUksRUFBRSxrQkFBa0I7RUFDeEIsU0FBUyxFQUFFLGtCQUFrQjtFQUM3QixJQUFJLEVBQUUsa0JBQWtCO0VBQ3hCLFNBQVMsRUFBRSxrQkFBa0I7RUFDN0IsS0FBSyxFQUFFLG1CQUFtQjtFQUMxQixVQUFVLEVBQUUsbUJBQW1CO0VBQy9CLElBQUksRUFBRSxrQkFBa0I7RUFDeEIsR0FBRyxFQUFFLGlCQUFpQjtFQUN0QixRQUFRLEVBQUUsc0JBQXNCO0VBQ2hDLE1BQU0sRUFBRSxvQkFBb0I7RUFDNUIsZ0JBQWdCLEVBQUUsMkJBQTJCO0VBQzdDLGNBQWMsRUFBRTtBQUNsQixDQUFDLENBQUMsR0FDRCxvQkFBb0IsRUFBRyxJQUFBLGdCQUFNLEVBQUM7RUFDN0IsR0FBRyxFQUFFLHlCQUF5QixDQUFDLFFBQVE7RUFDdkMsV0FBVyxFQUFFLHlCQUF5QixDQUFDO0FBQ3pDLENBQUMsQ0FBQyxHQUNELGNBQWMsRUFBRyxJQUFBLGdCQUFNLEVBQUM7RUFDdkIsRUFBRSxFQUFFLGlCQUFpQjtFQUNyQixPQUFPLEVBQUUsaUJBQWlCO0VBQzFCLElBQUksRUFBRSxtQkFBbUI7RUFDekIsU0FBUyxFQUFFLG1CQUFtQjtFQUM5QixJQUFJLEVBQUUsbUJBQW1CO0VBQ3pCLFNBQVMsRUFBRSxtQkFBbUI7RUFDOUIsS0FBSyxFQUFFLG9CQUFvQjtFQUMzQixVQUFVLEVBQUUsb0JBQW9CO0VBQ2hDLElBQUksRUFBRSxtQkFBbUI7RUFDekIsR0FBRyxFQUFFLGtCQUFrQjtFQUN2QixRQUFRLEVBQUUsdUJBQXVCO0VBQ2pDLE1BQU0sRUFBRTtBQUNWLENBQUMsQ0FBQyxHQUNELHFCQUFxQixFQUFHLElBQUEsZ0JBQU0sRUFBQztFQUM5QixHQUFHLEVBQUUsMEJBQTBCLENBQUMsUUFBUTtFQUN4QyxXQUFXLEVBQUUsMEJBQTBCLENBQUM7QUFDMUMsQ0FBQyxDQUFDLEdBQ0QsYUFBYSxFQUFHLElBQUEsZ0JBQU0sRUFBQztFQUN0QixFQUFFLEVBQUUsZ0JBQWdCO0VBQ3BCLE9BQU8sRUFBRSxnQkFBZ0I7RUFDekIsSUFBSSxFQUFFLGtCQUFrQjtFQUN4QixTQUFTLEVBQUUsa0JBQWtCO0VBQzdCLElBQUksRUFBRSxrQkFBa0I7RUFDeEIsU0FBUyxFQUFFLGtCQUFrQjtFQUM3QixLQUFLLEVBQUUsbUJBQW1CO0VBQzFCLFVBQVUsRUFBRSxtQkFBbUI7RUFDL0IsSUFBSSxFQUFFLGtCQUFrQjtFQUN4QixHQUFHLEVBQUUsaUJBQWlCO0VBQ3RCLFFBQVEsRUFBRSxzQkFBc0I7RUFDaEMsTUFBTSxFQUFFO0FBQ1YsQ0FBQyxDQUFDLEdBQ0Qsb0JBQW9CLEVBQUcsSUFBQSxnQkFBTSxFQUFDO0VBQzdCLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxRQUFRO0VBQ3ZDLFdBQVcsRUFBRSx5QkFBeUIsQ0FBQztBQUN6QyxDQUFDLENBQUMsR0FDRCxvQkFBb0IsWUFBRSxLQUFLLEVBQUU7RUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLE9BQU87QUFDN0MsQ0FBQyxHQUNBLFdBQVcsWUFBRSxLQUFLLEVBQUU7RUFDbkIsSUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxFQUFDO0lBQ3BCLE1BQU0sRUFBRTtFQUNWLENBQUMsQ0FBQztFQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDLGdCQUFBLGVBQUEsQ0FBQSxlQUFBLEtBR0EsMEJBQTBCLGNBQUk7RUFDN0IsaUJBQWlCLENBQUMsSUFBSSxDQUFDO0FBQ3pCLENBQUMsR0FDQSxXQUFXLFlBQUUsS0FBSyxFQUFFO0VBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRTtJQUN2QyxZQUFZLENBQUMsSUFBSSxDQUFDO0VBQ3BCO0FBQ0YsQ0FBQyxhQUFBLGVBQUEsS0FHQSwwQkFBMEIsY0FBSTtFQUM3QixvQkFBb0IsQ0FBQyxJQUFJLENBQUM7RUFDMUIsdUJBQXVCLENBQUMsSUFBSSxDQUFDO0FBQy9CLENBQUMsRUFFSjtBQUVELElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFO0VBQ2xCLGdCQUFnQixDQUFDLFNBQVMsR0FBQSxlQUFBLENBQUEsZUFBQSxDQUFBLGVBQUEsS0FDdkIsMkJBQTJCLGNBQUk7SUFDOUIsdUJBQXVCLENBQUMsSUFBSSxDQUFDO0VBQy9CLENBQUMsR0FDQSxjQUFjLGNBQUk7SUFDakIsd0JBQXdCLENBQUMsSUFBSSxDQUFDO0VBQ2hDLENBQUMsR0FDQSxhQUFhLGNBQUk7SUFDaEIsdUJBQXVCLENBQUMsSUFBSSxDQUFDO0VBQy9CLENBQUMsQ0FDRjtBQUNIO0FBRUEsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0VBQzVDLElBQUksV0FBQSxLQUFDLElBQUksRUFBRTtJQUNULE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsWUFBWSxFQUFLO01BQ2xELElBQUcsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFDO1FBQ2pFLGlCQUFpQixDQUFDLFlBQVksQ0FBQztNQUNqQztJQUNGLENBQUMsQ0FBQztFQUNKLENBQUM7RUFDRCxXQUFXLFdBQUEsWUFBQyxPQUFPLEVBQUU7SUFDbkIsSUFBSSxHQUFHLE9BQU87SUFDZCxZQUFZLEdBQUcsQ0FDYixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLFNBQVMsRUFDZCxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FDZDtJQUNELGtCQUFrQixHQUFHLENBQ25CLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLE1BQU0sRUFDWCxJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxNQUFNLENBQ1o7RUFDSCxDQUFDO0VBQ0Qsb0JBQW9CLEVBQXBCLG9CQUFvQjtFQUNwQixPQUFPLEVBQVAsT0FBTztFQUNQLE1BQU0sRUFBTixNQUFNO0VBQ04sa0JBQWtCLEVBQWxCLGtCQUFrQjtFQUNsQixnQkFBZ0IsRUFBaEIsZ0JBQWdCO0VBQ2hCLGlCQUFpQixFQUFqQixpQkFBaUI7RUFDakIsY0FBYyxFQUFkLGNBQWM7RUFDZCx1QkFBdUIsRUFBdkI7QUFDRixDQUFDLENBQUM7O0FBRUY7O0FBRUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVOzs7QUM5eEUzQixZQUFZOztBQUFDLE1BQUEsQ0FBQSxjQUFBLENBQUEsT0FBQTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFDYixJQUFBLFNBQUEsR0FBQSxzQkFBQSxDQUFBLE9BQUE7QUFDQSxPQUFBO0FBQThDLFNBQUEsdUJBQUEsR0FBQSxXQUFBLEdBQUEsSUFBQSxHQUFBLENBQUEsVUFBQSxHQUFBLEdBQUEsZ0JBQUEsR0FBQTtBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsWUFBWSxDQUFFLFNBQVMsRUFBQztFQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVM7RUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsc0JBQXNCLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7O0VBRXpFO0VBQ0EsSUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLCtDQUErQyxDQUFDLEVBQUM7SUFDOUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDO0VBQ3ZHO0VBRUEsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBVTtFQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFFcEQsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQztFQUNoRixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztJQUMxQyxJQUFJLE1BQU0sR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbkU7QUFDSixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFlBQVksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEdBQUcsWUFBVTtFQUNuRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywrQ0FBK0MsQ0FBQztFQUNoRyxJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLFNBQVM7QUFDbkosQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFVBQVMsQ0FBQyxFQUFDO0VBQzlDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVTtFQUM1QixFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUM7RUFDN0YsRUFBRSxDQUFDLGdCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUM7RUFFdkYsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLHNCQUFzQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2xHLElBQUksYUFBYSxHQUFHLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDO0VBQ3RELGFBQWEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU07RUFDbEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUM7RUFDbkMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0VBRTFCO0VBQ0EsSUFBSSxZQUFZLEdBQUcsSUFBSSxvQkFBUSxDQUFDLE1BQU0sQ0FBQztFQUN2QyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUFBLElBQUEsUUFBQSxHQUFBLE9BQUEsY0FFYyxZQUFZOzs7QUM3RDNCLFlBQVk7O0FBQUMsTUFBQSxDQUFBLGNBQUEsQ0FBQSxPQUFBO0VBQUEsS0FBQTtBQUFBO0FBQUEsT0FBQTtBQUNiLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQztBQUNuRCxJQUFNLE1BQU0sR0FBRyx1QkFBdUI7QUFDdEMsSUFBTSwwQkFBMEIsR0FBRyxrQ0FBa0MsQ0FBQyxDQUFDO0FBQ3ZFLElBQU0sTUFBTSxHQUFHLGdCQUFnQjs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBRSxhQUFhLEVBQUU7RUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhO0VBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSTtFQUNwQixJQUFJLENBQUMsNkJBQTZCLEdBQUcsS0FBSztFQUUxQyxJQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxJQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUyxFQUFDO0lBQ2hFLE1BQU0sSUFBSSxLQUFLLHFEQUFxRCxDQUFDO0VBQ3ZFO0VBQ0EsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO0VBQ3hELElBQUcsVUFBVSxLQUFLLElBQUksSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFDO0lBQ2pELE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELEdBQUMsTUFBTSxDQUFDO0VBQ3JGO0VBQ0EsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUNuRSxJQUFHLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBQztJQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDO0VBQzFFO0VBQ0EsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVc7RUFDbkMsSUFBRyxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBQztJQUUxSCxJQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsaUNBQWlDLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLEVBQUM7TUFDNUssSUFBSSxDQUFDLDZCQUE2QixHQUFHLElBQUk7SUFDM0M7O0lBRUE7SUFDQSxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztJQUNyRixRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztJQUNsRjtJQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQztJQUMvRCxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUM7SUFDNUQsSUFBSSxPQUFPLEdBQUcsSUFBSTtJQUNsQjtJQUNBLElBQUcsSUFBSSxDQUFDLDZCQUE2QixFQUFFO01BQ3JDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhO01BQ2hDLElBQUksTUFBTSxDQUFDLG9CQUFvQixFQUFFO1FBQy9CO1FBQ0EsSUFBSSxRQUFRLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxVQUFVLE9BQU8sRUFBRTtVQUN6RDtVQUNBLElBQUksT0FBTyxDQUFFLENBQUMsQ0FBRSxDQUFDLGlCQUFpQixFQUFFO1lBQ2xDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsS0FBSyxPQUFPLEVBQUU7Y0FDckQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztZQUN0RDtVQUNGLENBQUMsTUFBTTtZQUNMO1lBQ0EsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxNQUFNLEVBQUU7Y0FDM0QsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztZQUN2RDtVQUNGO1FBQ0YsQ0FBQyxFQUFFO1VBQ0QsSUFBSSxFQUFFLFFBQVEsQ0FBQztRQUNqQixDQUFDLENBQUM7UUFDRixRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztNQUMzQixDQUFDLE1BQU07UUFDTDtRQUNBLElBQUksb0JBQW9CLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1VBQzNDO1VBQ0EsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLE9BQU8sRUFBRTtZQUNyRCxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO1VBQ3RELENBQUMsTUFBSztZQUNKLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7VUFDdkQ7UUFDRixDQUFDLE1BQU07VUFDTDtVQUNBLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7UUFDdkQ7UUFDQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQVk7VUFDNUMsSUFBSSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDM0MsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLE9BQU8sRUFBRTtjQUNyRCxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO1lBQ3RELENBQUMsTUFBSztjQUNKLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7WUFDdkQ7VUFDRixDQUFDLE1BQU07WUFDTCxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO1VBQ3ZEO1FBQ0YsQ0FBQyxDQUFDO01BQ0o7SUFDRjtJQUdBLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO0lBQ3BELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO0VBQ25EO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFVO0VBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQzVCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBVTtFQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztBQUM1QixDQUFDO0FBRUQsSUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFZLEtBQUssRUFBQztFQUNqQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPO0VBQ3RDLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRTtJQUNkLFFBQVEsQ0FBQyxLQUFLLENBQUM7RUFDakI7QUFDRixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFhLE1BQU0sRUFBRTtFQUNqQyxPQUFPLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7QUFDeEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFBLEVBQTBCO0VBQUEsSUFBYixLQUFLLEdBQUEsU0FBQSxDQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsTUFBRyxJQUFJO0VBQ25DLElBQUksT0FBTyxHQUFHLEtBQUs7RUFDbkIsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7RUFFM0MsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLGVBQWUsQ0FBQztFQUNyRSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtJQUNqRCxJQUFJLHFCQUFxQixHQUFHLGNBQWMsQ0FBRSxFQUFFLENBQUU7SUFDaEQsSUFBSSxTQUFTLEdBQUcscUJBQXFCLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBQyx3QkFBd0IsQ0FBQztJQUNwRixJQUFHLFNBQVMsS0FBSyxJQUFJLEVBQUM7TUFDcEIsT0FBTyxHQUFHLElBQUk7TUFDZCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztNQUVyRixJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtRQUMzQyxJQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxFQUFDO1VBQ2pDLElBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsS0FBSyxJQUFJLEVBQUM7WUFDbEQsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUM7WUFDaEQsU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7VUFDckM7VUFDQSxTQUFTLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUM7VUFDaEQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1VBQ25DLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztRQUM5QztNQUNGO0lBQ0o7RUFDRjtFQUVBLElBQUcsT0FBTyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUM7SUFDM0IsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7RUFDbEM7QUFDRixDQUFDO0FBQ0QsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQWEsRUFBRSxFQUFFO0VBQ3pCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ25DLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVTtJQUN0RSxTQUFTLEdBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVM7RUFDdEUsT0FBTztJQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLFNBQVM7SUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRztFQUFXLENBQUM7QUFDcEUsQ0FBQztBQUVELElBQUksY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBYSxLQUFLLEVBQXNCO0VBQUEsSUFBcEIsVUFBVSxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsS0FBSztFQUN0RCxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7RUFDdkIsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBRXRCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO0FBRTFCLENBQUM7QUFFRCxJQUFJLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBWSxNQUFNLEVBQXFCO0VBQUEsSUFBbkIsVUFBVSxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsS0FBSztFQUM5QyxJQUFJLFNBQVMsR0FBRyxNQUFNO0VBQ3RCLElBQUksUUFBUSxHQUFHLElBQUk7RUFDbkIsSUFBRyxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUM7SUFDL0MsSUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7SUFDL0MsSUFBRyxVQUFVLEtBQUssSUFBSSxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUM7TUFDakQsUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDakU7RUFDRjtFQUNBLElBQUcsU0FBUyxLQUFLLElBQUksSUFBSSxTQUFTLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBQztJQUM5Rjs7SUFFQSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJO0lBQzFCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUk7SUFFM0IsSUFBRyxTQUFTLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLE1BQU0sSUFBSSxVQUFVLEVBQUM7TUFDbEU7TUFDQSxTQUFTLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUM7TUFDaEQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO01BQ25DLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztNQUM1QyxJQUFJLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztNQUNoRCxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNyQyxDQUFDLE1BQUk7TUFFSCxJQUFHLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBQztRQUNuRixRQUFRLENBQUMsQ0FBQztNQUNaO01BQ0E7TUFDQSxTQUFTLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUM7TUFDL0MsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO01BQ3RDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztNQUM3QyxJQUFJLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztNQUM5QyxTQUFTLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztNQUNsQyxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO01BRW5DLElBQUcsWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUM7UUFDdkIsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSztRQUMzQixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNO01BQy9CO01BQ0EsSUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsV0FBVztNQUNwRCxJQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFDO1FBQzNCLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU07UUFDNUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSztNQUM5QjtNQUVBLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFFbEMsSUFBRyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBQztRQUV0QixRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLO1FBQzNCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU07TUFDL0I7TUFDQSxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsV0FBVztNQUMvQyxJQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFDO1FBRTNCLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU07UUFDNUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSztNQUM5QjtJQUNGO0VBRUY7QUFDRixDQUFDO0FBRUQsSUFBSSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQWEsS0FBSyxFQUFFLGFBQWEsRUFBQztFQUM3QyxJQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxLQUFLLGFBQWEsRUFBQztJQUM1QyxPQUFPLElBQUk7RUFDYixDQUFDLE1BQU0sSUFBRyxhQUFhLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBQztJQUN4RSxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztFQUNuRCxDQUFDLE1BQUk7SUFDSCxPQUFPLEtBQUs7RUFDZDtBQUNGLENBQUM7QUFFRCxJQUFJLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBYSxHQUFHLEVBQUM7RUFDL0IsSUFBRyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEVBQUM7SUFDbkYsSUFBRyxRQUFRLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEVBQUU7TUFDbkgsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBQyxzQkFBc0IsQ0FBQztNQUM1RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM3QyxJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksUUFBUSxHQUFHLElBQUk7UUFDbkIsSUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7UUFDL0MsSUFBSSxVQUFVLEtBQUssSUFBSSxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7VUFDbkQsSUFBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDO1lBQ2hDLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7VUFDMUM7VUFDQSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7UUFDaEQ7UUFDQSxJQUFJLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxJQUFLLFNBQVMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFFLEVBQUU7VUFDcEg7VUFDQSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQzVCO1lBQ0EsU0FBUyxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDO1lBQ2hELFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztZQUNuQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7WUFDNUMsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUM7WUFDaEQsU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7VUFDckM7UUFDRjtNQUNGO0lBQ0Y7RUFDRjtBQUNGLENBQUM7QUFFRCxJQUFJLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixDQUFhLFNBQVMsRUFBQztFQUM3QyxJQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsRUFBQztJQUMzRDtJQUNBLElBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLEVBQUU7TUFDM0o7TUFDQSxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksc0JBQXNCLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDMUQ7UUFDQSxPQUFPLElBQUk7TUFDYjtJQUNGLENBQUMsTUFBSztNQUNKO01BQ0EsT0FBTyxJQUFJO0lBQ2I7RUFDRjtFQUVBLE9BQU8sS0FBSztBQUNkLENBQUM7QUFFRCxJQUFJLHNCQUFzQixHQUFHLFNBQXpCLHNCQUFzQixDQUFhLE1BQU0sRUFBQztFQUM1QyxJQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFDO0lBQ3pFLE9BQU8sV0FBVyxDQUFDLEVBQUU7RUFDdkI7RUFDQSxJQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFDO0lBQ3pFLE9BQU8sV0FBVyxDQUFDLEVBQUU7RUFDdkI7QUFDRixDQUFDO0FBQUMsSUFBQSxRQUFBLEdBQUEsT0FBQSxjQUVhLFFBQVE7OztBQ3RUdkIsWUFBWTs7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUhBLE1BQUEsQ0FBQSxjQUFBLENBQUEsT0FBQTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFJQSxTQUFTLFlBQVksQ0FBRSxPQUFPLEVBQUU7RUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVk7RUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDakI7RUFDRjtFQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7RUFFcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckUsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxLQUFLLEVBQUU7RUFDcEQsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU07RUFDekIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0lBQzVCLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUN4QjtBQUNGLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxPQUFPLEVBQUU7RUFDdEQ7RUFDQSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO0lBQ3JELE9BQU8sS0FBSztFQUNkO0VBRUEsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7RUFDbkQsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7RUFDN0MsSUFBSSxDQUFDLE1BQU0sRUFBRTtJQUNYLE9BQU8sS0FBSztFQUNkO0VBRUEsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQztFQUM1RCxJQUFJLENBQUMsY0FBYyxFQUFFO0lBQ25CLE9BQU8sS0FBSztFQUNkOztFQUVBO0VBQ0E7RUFDQTtFQUNBLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQUUsYUFBYSxFQUFFO0VBQUssQ0FBQyxDQUFDO0VBRXJDLE9BQU8sSUFBSTtBQUNiLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLEdBQUcsRUFBRTtFQUN6RCxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7SUFDM0IsT0FBTyxLQUFLO0VBQ2Q7RUFFQSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLENBQUMsU0FBUyxDQUFDLDBCQUEwQixHQUFHLFVBQVUsTUFBTSxFQUFFO0VBQ3BFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0VBRTFDLElBQUksU0FBUyxFQUFFO0lBQ2IsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQztJQUV0RCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7TUFDbEIsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDOztNQUVqQztNQUNBO01BQ0EsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtRQUN6RCxPQUFPLGdCQUFnQjtNQUN6Qjs7TUFFQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxJQUFJLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsR0FBRztNQUM1RCxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7TUFFOUM7TUFDQTtNQUNBLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO1FBQzFDLElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU07UUFFbEQsSUFBSSxXQUFXLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFFO1VBQ3BELE9BQU8sZ0JBQWdCO1FBQ3pCO01BQ0Y7SUFDRjtFQUNGO0VBRUEsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUM3RSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUMzQixDQUFDO0FBQUEsSUFBQSxRQUFBLEdBQUEsT0FBQSxjQUVjLFlBQVk7OztBQ3JKM0IsWUFBWTs7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUhBLE1BQUEsQ0FBQSxjQUFBLENBQUEsT0FBQTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFJQSxTQUFTLEtBQUssQ0FBRSxNQUFNLEVBQUU7RUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNO0VBQ3BCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztFQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxxQ0FBcUMsR0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDO0FBQzVGOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVk7RUFDakMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVE7RUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7SUFDdkMsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFFLENBQUMsQ0FBRTtJQUMzQixPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3pEO0VBQ0EsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQztFQUNoRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztJQUN0QyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUUsQ0FBQyxDQUFFO0lBQ3pCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDeEQ7QUFDRixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVc7RUFDaEMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU07RUFDOUIsSUFBRyxZQUFZLEtBQUssSUFBSSxFQUFDO0lBQ3ZCLFlBQVksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztJQUVoRCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztJQUM5QyxVQUFVLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7SUFDcEQsWUFBWSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7SUFFdEMsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztJQUN6RCxTQUFTLGFBQVQsU0FBUyxlQUFULFNBQVMsQ0FBRSxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztJQUU1QyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkUsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDO0lBRXhELElBQUcsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLEVBQUM7TUFDaEMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7SUFDckQ7SUFDQSxJQUFJLGVBQWUsR0FBRyxZQUFZLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDO0lBQ3BFLElBQUcsZUFBZSxLQUFLLElBQUksRUFBQztNQUMxQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQztNQUNyRCxJQUFHLE1BQU0sS0FBSyxJQUFJLEVBQUM7UUFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ2hCO01BQ0EsWUFBWSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQztJQUNuRDtFQUNGO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFtQjtFQUFBLElBQVQsQ0FBQyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsSUFBSTtFQUN2QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTTtFQUM5QixJQUFHLFlBQVksS0FBSyxJQUFJLEVBQUM7SUFDdkIsSUFBRyxDQUFDLEtBQUssSUFBSSxFQUFDO01BQ1osSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO01BQzFDLElBQUcsUUFBUSxLQUFLLElBQUksRUFBQztRQUNuQixRQUFRLEdBQUcsZUFBZSxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDL0UsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztNQUN2QztNQUNBLFlBQVksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDO0lBQzFEOztJQUVBO0lBQ0EsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLCtCQUErQixDQUFDO0lBQzdFLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO01BQzFDLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DO0lBRUEsWUFBWSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO0lBQ2pELFlBQVksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztJQUUzQyxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztJQUM3QyxTQUFTLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7SUFDbEQsWUFBWSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFFckMsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDN0MsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7SUFDekMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUM7SUFDOUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7SUFFL0QsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0lBRXBFLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVwQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUM7SUFDckQsSUFBRyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsRUFBQztNQUNoQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztJQUNsRDtFQUVGO0FBQ0YsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFhLEtBQUssRUFBRTtFQUNsQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPO0VBQ3RDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsK0JBQStCLENBQUM7RUFDMUUsSUFBSSxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0VBQ3JGLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBQztJQUNiLElBQUkscUJBQXFCLEdBQUcsWUFBWSxDQUFDLGdCQUFnQixDQUFDLDZDQUE2QyxDQUFDO0lBQ3hHLElBQUcscUJBQXFCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBQztNQUNwQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckI7RUFDRjtBQUNGLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUM7RUFDcEIsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQztFQUMzRSxJQUFHLGFBQWEsS0FBSyxJQUFJLEVBQUM7SUFDeEIsSUFBSSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsK1hBQStYLENBQUM7SUFFdmIsSUFBSSxxQkFBcUIsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7SUFDaEQsSUFBSSxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRTFFLElBQUksWUFBWSxHQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssQ0FBRTtJQUV2RCxJQUFJLENBQUMsWUFBWSxFQUFFO01BQ2pCO0lBQ0Y7SUFFQSxJQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUcsaUJBQWtCO1FBQ2xDLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxxQkFBcUIsRUFBRTtVQUNwRCxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztVQUMxQixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEI7TUFDRixDQUFDLE1BQU0sU0FBVTtRQUNmLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxvQkFBb0IsRUFBRTtVQUNuRCxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztVQUMzQixDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEI7TUFDRjtFQUNGO0FBQ0Y7QUFBQztBQUVELFNBQVMsZUFBZSxDQUFFLEtBQUssRUFBQztFQUM5QixJQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUMsS0FBSyxJQUFJLEVBQUM7SUFDekQsT0FBTyxLQUFLO0VBQ2Q7RUFDQSxPQUFPLElBQUk7QUFDYjtBQUFDLElBQUEsUUFBQSxHQUFBLE9BQUEsY0FFYyxLQUFLOzs7QUMvSnBCLFlBQVk7O0FBQUMsTUFBQSxDQUFBLGNBQUEsQ0FBQSxPQUFBO0VBQUEsS0FBQTtBQUFBO0FBQUEsT0FBQTtBQUFBLFNBQUEsUUFBQSxDQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLENBQUEsa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSx5QkFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsZ0JBQUEsUUFBQSxFQUFBLFdBQUEsVUFBQSxRQUFBLFlBQUEsV0FBQSxlQUFBLFNBQUE7QUFBQSxTQUFBLGtCQUFBLE1BQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsVUFBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLFdBQUEsVUFBQSxDQUFBLFlBQUEsd0JBQUEsVUFBQSxFQUFBLFVBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQTtBQUFBLFNBQUEsYUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsUUFBQSxVQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsT0FBQSxXQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsV0FBQSxpQkFBQSxRQUFBLG1CQUFBLFdBQUE7QUFBQSxTQUFBLGVBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxZQUFBLENBQUEsQ0FBQSxnQ0FBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsYUFBQSxDQUFBLEVBQUEsQ0FBQSxvQkFBQSxPQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsV0FBQSxrQkFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsZ0NBQUEsT0FBQSxDQUFBLENBQUEsVUFBQSxDQUFBLFlBQUEsU0FBQSx5RUFBQSxDQUFBLEdBQUEsTUFBQSxHQUFBLE1BQUEsRUFBQSxDQUFBO0FBQ2IsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQztBQUN4QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7QUFFekMsSUFBTSxHQUFHLFNBQVM7QUFDbEIsSUFBTSxTQUFTLE1BQUEsTUFBQSxDQUFNLEdBQUcsT0FBSTtBQUM1QixJQUFNLE9BQU8sa0JBQWtCO0FBQy9CLElBQU0sWUFBWSxtQkFBbUI7QUFDckMsSUFBTSxPQUFPLGFBQWE7QUFDMUIsSUFBTSxPQUFPLE1BQUEsTUFBQSxDQUFNLFlBQVksZUFBWTtBQUMzQyxJQUFNLE9BQU8sR0FBRyxDQUFFLEdBQUcsRUFBRSxPQUFPLENBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBRTNDLElBQU0sWUFBWSxHQUFHLG1CQUFtQjtBQUN4QyxJQUFNLGFBQWEsR0FBRyxZQUFZOztBQUVsQztBQUNBO0FBQ0E7QUFGQSxJQUdNLFVBQVU7RUFBQSxTQUFBLFdBQUE7SUFBQSxlQUFBLE9BQUEsVUFBQTtFQUFBO0VBQUEsWUFBQSxDQUFBLFVBQUE7SUFBQSxHQUFBO0lBQUEsS0FBQTtJQUNkO0FBQ0Y7QUFDQTtJQUNFLFNBQUEsS0FBQSxFQUFRO01BQ04sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDO01BQ3BELFVBQVUsQ0FBQyxDQUFDO0lBQ2Q7O0lBRUE7QUFDRjtBQUNBO0VBRkU7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUdBLFNBQUEsU0FBQSxFQUFZO01BQ1YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDO0lBQ3pEO0VBQUM7RUFBQSxPQUFBLFVBQUE7QUFBQTtBQUdIO0FBQ0E7QUFDQTtBQUNBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFBLEVBQWM7RUFDNUIsSUFBSSxNQUFNLEdBQUcsS0FBSztFQUNsQixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO0VBQ2hELEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3RDLElBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUFFO01BQy9ELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO01BQy9DLE1BQU0sR0FBRyxJQUFJO0lBQ2Y7RUFDRjs7RUFFQTtFQUNBLElBQUcsTUFBTSxFQUFDO0lBQ1IsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztJQUNoRCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUN0QyxPQUFPLENBQUUsQ0FBQyxDQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUNuRDtJQUVBLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7SUFDbkQsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDdkMsUUFBUSxDQUFFLENBQUMsQ0FBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFVO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUdBO1FBQ0EsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFO1VBQ2QsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1FBQzdCO01BQ0YsQ0FBQyxDQUFDO0lBQ0o7SUFFQSxJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO0lBQ3JELEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO01BQzVDLFNBQVMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDO0VBRUY7RUFFQSxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7RUFFeEQsSUFBSSxRQUFRLENBQUMsQ0FBQyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7SUFDdEU7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7RUFDL0I7QUFDRixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUE7RUFBQSxPQUFTLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7QUFBQTs7QUFFckU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxhQUFhLEVBQUs7RUFFcEM7RUFDQSxJQUFNLHVCQUF1QixHQUFHLGdMQUFnTDtFQUNoTixJQUFJLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQztFQUMvRSxJQUFJLFlBQVksR0FBRyxpQkFBaUIsQ0FBRSxDQUFDLENBQUU7RUFFekMsU0FBUyxVQUFVLENBQUUsQ0FBQyxFQUFFO0lBQ3RCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU87SUFDdEM7SUFDQSxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7TUFFYixJQUFJLFdBQVcsR0FBRyxJQUFJO01BQ3RCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7UUFDL0MsSUFBSSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDekMsSUFBSSxPQUFPLEdBQUcsaUJBQWlCLENBQUUsTUFBTSxHQUFHLENBQUMsQ0FBRTtRQUM3QyxJQUFJLE9BQU8sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFO1VBQ3ZELFdBQVcsR0FBRyxPQUFPO1VBQ3JCO1FBQ0Y7TUFDRjs7TUFFQTtNQUNBLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtRQUNkLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxZQUFZLEVBQUU7VUFDM0MsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ2xCLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQjs7UUFFRjtNQUNBLENBQUMsTUFBTTtRQUNMLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxXQUFXLEVBQUU7VUFDMUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1VBQ2xCLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QjtNQUNGO0lBQ0Y7O0lBRUE7SUFDQSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssUUFBUSxFQUFFO01BQ3RCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztJQUM3QjtFQUNGO0VBRUEsT0FBTztJQUNMLE1BQU0sV0FBQSxPQUFBLEVBQUk7TUFDTjtNQUNBLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN0QjtNQUNBLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDO0lBQ2xELENBQUM7SUFFRCxPQUFPLFdBQUEsUUFBQSxFQUFJO01BQ1QsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7SUFDckQ7RUFDRixDQUFDO0FBQ0gsQ0FBQztBQUVELElBQUksU0FBUztBQUViLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFhLE1BQU0sRUFBRTtFQUNsQyxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSTtFQUMxQixJQUFJLE9BQU8sTUFBTSxLQUFLLFNBQVMsRUFBRTtJQUMvQixNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUN0QjtFQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUM7RUFFM0MsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxVQUFBLEVBQUUsRUFBSTtJQUM3QixFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO0VBQzVDLENBQUMsQ0FBQztFQUNGLElBQUksTUFBTSxFQUFFO0lBQ1YsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3BCLENBQUMsTUFBTTtJQUNMLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUNyQjtFQUVBLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO0VBQ3BELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO0VBRTlDLElBQUksTUFBTSxJQUFJLFdBQVcsRUFBRTtJQUN6QjtJQUNBO0lBQ0EsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3JCLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssV0FBVyxJQUNqRCxVQUFVLEVBQUU7SUFDckI7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNwQjtFQUVBLE9BQU8sTUFBTTtBQUNmLENBQUM7QUFBQyxJQUFBLFFBQUEsR0FBQSxPQUFBLGNBRWEsVUFBVTs7O0FDck16QixZQUFZOztBQUFDLE1BQUEsQ0FBQSxjQUFBLENBQUEsT0FBQTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFDYixJQUFNLGdCQUFnQixHQUFHLGVBQWU7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBQztFQUN2QyxJQUFJLENBQUMsVUFBVSxHQUFHLGdCQUFnQjtFQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUk7RUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBVztFQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLENBQUM7RUFDdkUsSUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUM7SUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQztFQUNsRTtFQUNBLElBQUksSUFBSSxHQUFHLElBQUk7RUFFZixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7SUFDekMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDLENBQUU7SUFFOUIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFXO01BQ3hDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQyxDQUFFLENBQUM7TUFDbkM7SUFDSixDQUFDLENBQUM7SUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztFQUN0QjtBQUNKLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsaUJBQWlCLEVBQUM7RUFDNUQsSUFBSSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDO0VBQ2hFLElBQUcsU0FBUyxLQUFLLElBQUksSUFBSSxTQUFTLEtBQUssU0FBUyxJQUFJLFNBQVMsS0FBSyxFQUFFLEVBQUM7SUFDakUsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDdEQsSUFBRyxjQUFjLEtBQUssSUFBSSxJQUFJLGNBQWMsS0FBSyxTQUFTLEVBQUM7TUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNEQsZ0JBQWdCLENBQUM7SUFDakc7SUFDQSxJQUFHLGlCQUFpQixDQUFDLE9BQU8sRUFBQztNQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQztJQUNsRCxDQUFDLE1BQUk7TUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQztJQUNwRDtFQUNKO0FBQ0osQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLGlCQUFpQixFQUFFLGNBQWMsRUFBQztFQUM1RSxJQUFHLGlCQUFpQixLQUFLLElBQUksSUFBSSxpQkFBaUIsS0FBSyxTQUFTLElBQUksY0FBYyxLQUFLLElBQUksSUFBSSxjQUFjLEtBQUssU0FBUyxFQUFDO0lBQ3hILGlCQUFpQixDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDO0lBQ3ZELGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztJQUNuRCxJQUFJLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztJQUMvQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO0VBQzlDO0FBQ0osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVMsaUJBQWlCLEVBQUUsY0FBYyxFQUFDO0VBQzdFLElBQUcsaUJBQWlCLEtBQUssSUFBSSxJQUFJLGlCQUFpQixLQUFLLFNBQVMsSUFBSSxjQUFjLEtBQUssSUFBSSxJQUFJLGNBQWMsS0FBSyxTQUFTLEVBQUM7SUFDeEgsaUJBQWlCLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUM7SUFDeEQsY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO0lBQ2xELElBQUksVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDO0lBQ2pELGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7RUFDL0M7QUFDSixDQUFDO0FBQUEsSUFBQSxRQUFBLEdBQUEsT0FBQSxjQUVjLGdCQUFnQjs7O0FDakYvQixZQUFZOztBQUFDLFNBQUEsUUFBQSxDQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLENBQUEsa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSx5QkFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsT0FBQTtFQUFBLEtBQUE7QUFBQTtBQUFBLE9BQUE7QUFBQSxTQUFBLGtCQUFBLE1BQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsVUFBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLFdBQUEsVUFBQSxDQUFBLFlBQUEsd0JBQUEsVUFBQSxFQUFBLFVBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQTtBQUFBLFNBQUEsYUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsUUFBQSxVQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsT0FBQSxXQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsV0FBQSxpQkFBQSxRQUFBLG1CQUFBLFdBQUE7QUFBQSxTQUFBLGVBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxZQUFBLENBQUEsQ0FBQSxnQ0FBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsYUFBQSxDQUFBLEVBQUEsQ0FBQSxvQkFBQSxPQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsV0FBQSxrQkFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsZ0NBQUEsT0FBQSxDQUFBLENBQUEsVUFBQSxDQUFBLFlBQUEsU0FBQSx5RUFBQSxDQUFBLEdBQUEsTUFBQSxHQUFBLE1BQUEs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dCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBhcnJheS1mb3JlYWNoXG4gKiAgIEFycmF5I2ZvckVhY2ggcG9ueWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzXG4gKiAgIChQb255ZmlsbDogQSBwb2x5ZmlsbCB0aGF0IGRvZXNuJ3Qgb3ZlcndyaXRlIHRoZSBuYXRpdmUgbWV0aG9kKVxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNS0yMDE2IFRha3V0byBXYWRhXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoL2Jsb2IvbWFzdGVyL01JVC1MSUNFTlNFXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoIChhcnksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKGFyeS5mb3JFYWNoKSB7XG4gICAgICAgIGFyeS5mb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBhcnlbaV0sIGksIGFyeSk7XG4gICAgfVxufTtcbiIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMS4yMDE3MDQyN1xuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5pZiAoXCJkb2N1bWVudFwiIGluIHdpbmRvdy5zZWxmKSB7XG5cbi8vIEZ1bGwgcG9seWZpbGwgZm9yIGJyb3dzZXJzIHdpdGggbm8gY2xhc3NMaXN0IHN1cHBvcnRcbi8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxuaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIikpKSB7XG5cbihmdW5jdGlvbiAodmlldykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XG5cbnZhclxuXHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdCwgcHJvdG9Qcm9wID0gXCJwcm90b3R5cGVcIlxuXHQsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG5cdCwgb2JqQ3RyID0gT2JqZWN0XG5cdCwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuXHR9XG5cdCwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdHZhclxuXHRcdFx0ICBpID0gMFxuXHRcdFx0LCBsZW4gPSB0aGlzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fVxuXHQvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcblx0LCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG5cdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHR0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHQsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XG5cdFx0aWYgKHRva2VuID09PSBcIlwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJTWU5UQVhfRVJSXCJcblx0XHRcdFx0LCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdCwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcblx0fVxuXHQsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdCwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdH07XG5cdH1cblx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0LCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG5cdH1cbjtcbi8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcbi8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuRE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XG5jbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcblx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcbn07XG5jbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHR0b2tlbiArPSBcIlwiO1xuXHRyZXR1cm4gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSAhPT0gLTE7XG59O1xuY2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHVzaCh0b2tlbik7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQsIGluZGV4XG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0d2hpbGUgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuXHR0b2tlbiArPSBcIlwiO1xuXG5cdHZhclxuXHRcdCAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcblx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRmb3JjZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXG5cdFx0OlxuXHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0O1xuXG5cdGlmIChtZXRob2QpIHtcblx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHR9XG5cblx0aWYgKGZvcmNlID09PSB0cnVlIHx8IGZvcmNlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBmb3JjZTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gIXJlc3VsdDtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbn07XG5cbmlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcblx0dmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuXHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHQsIGVudW1lcmFibGU6IHRydWVcblx0XHQsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHR9O1xuXHR0cnkge1xuXHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0Ly8gYWRkaW5nIHVuZGVmaW5lZCB0byBmaWdodCB0aGlzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9pc3N1ZXMvMzZcblx0XHQvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXG5cdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcblx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHR9XG5cdH1cbn0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xuXHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xufVxuXG59KHdpbmRvdy5zZWxmKSk7XG5cbn1cblxuLy8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXG4vLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG4oZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYzFcIiwgXCJjMlwiKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAvMTEgYW5kIEZpcmVmb3ggPDI2LCB3aGVyZSBjbGFzc0xpc3QuYWRkIGFuZFxuXHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0aWYgKCF0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjMlwiKSkge1xuXHRcdHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcblx0XHRcdFx0dmFyIGksIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0dG9rZW4gPSBhcmd1bWVudHNbaV07XG5cdFx0XHRcdFx0b3JpZ2luYWwuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdGNyZWF0ZU1ldGhvZCgncmVtb3ZlJyk7XG5cdH1cblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMCBhbmQgRmlyZWZveCA8MjQsIHdoZXJlIGNsYXNzTGlzdC50b2dnbGUgZG9lcyBub3Rcblx0Ly8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHR2YXIgX3RvZ2dsZSA9IERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlO1xuXG5cdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbih0b2tlbiwgZm9yY2UpIHtcblx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH1cblxuXHR0ZXN0RWxlbWVudCA9IG51bGw7XG59KCkpO1xuXG59XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZyb207XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi42LjEyJyB9O1xuaWYgKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpIF9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIGluZGV4LCB2YWx1ZSkge1xuICBpZiAoaW5kZXggaW4gb2JqZWN0KSAkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTtcbiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoLyogLi4uYXJncyAqLykge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIHRhcmdldCA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSk7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmICh0YXJnZXQpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmIChleHBvcnRzW2tleV0gIT0gb3V0KSBoaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZiAoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpIGV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCduYXRpdmUtZnVuY3Rpb24tdG8tc3RyaW5nJywgRnVuY3Rpb24udG9TdHJpbmcpO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIHtcbiAgICAgIGtleSA9IGtleXNbaisrXTtcbiAgICAgIGlmICghREVTQ1JJUFRPUlMgfHwgaXNFbnVtLmNhbGwoUywga2V5KSkgVFtrZXldID0gU1trZXldO1xuICAgIH1cbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduO1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFNSQyA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKTtcbnZhciAkdG9TdHJpbmcgPSByZXF1aXJlKCcuL19mdW5jdGlvbi10by1zdHJpbmcnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDIwIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7IGFzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCIvKiBnbG9iYWwgZGVmaW5lLCBLZXlib2FyZEV2ZW50LCBtb2R1bGUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuICB2YXIga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ge1xuICAgIHBvbHlmaWxsOiBwb2x5ZmlsbCxcbiAgICBrZXlzOiB7XG4gICAgICAzOiAnQ2FuY2VsJyxcbiAgICAgIDY6ICdIZWxwJyxcbiAgICAgIDg6ICdCYWNrc3BhY2UnLFxuICAgICAgOTogJ1RhYicsXG4gICAgICAxMjogJ0NsZWFyJyxcbiAgICAgIDEzOiAnRW50ZXInLFxuICAgICAgMTY6ICdTaGlmdCcsXG4gICAgICAxNzogJ0NvbnRyb2wnLFxuICAgICAgMTg6ICdBbHQnLFxuICAgICAgMTk6ICdQYXVzZScsXG4gICAgICAyMDogJ0NhcHNMb2NrJyxcbiAgICAgIDI3OiAnRXNjYXBlJyxcbiAgICAgIDI4OiAnQ29udmVydCcsXG4gICAgICAyOTogJ05vbkNvbnZlcnQnLFxuICAgICAgMzA6ICdBY2NlcHQnLFxuICAgICAgMzE6ICdNb2RlQ2hhbmdlJyxcbiAgICAgIDMyOiAnICcsXG4gICAgICAzMzogJ1BhZ2VVcCcsXG4gICAgICAzNDogJ1BhZ2VEb3duJyxcbiAgICAgIDM1OiAnRW5kJyxcbiAgICAgIDM2OiAnSG9tZScsXG4gICAgICAzNzogJ0Fycm93TGVmdCcsXG4gICAgICAzODogJ0Fycm93VXAnLFxuICAgICAgMzk6ICdBcnJvd1JpZ2h0JyxcbiAgICAgIDQwOiAnQXJyb3dEb3duJyxcbiAgICAgIDQxOiAnU2VsZWN0JyxcbiAgICAgIDQyOiAnUHJpbnQnLFxuICAgICAgNDM6ICdFeGVjdXRlJyxcbiAgICAgIDQ0OiAnUHJpbnRTY3JlZW4nLFxuICAgICAgNDU6ICdJbnNlcnQnLFxuICAgICAgNDY6ICdEZWxldGUnLFxuICAgICAgNDg6IFsnMCcsICcpJ10sXG4gICAgICA0OTogWycxJywgJyEnXSxcbiAgICAgIDUwOiBbJzInLCAnQCddLFxuICAgICAgNTE6IFsnMycsICcjJ10sXG4gICAgICA1MjogWyc0JywgJyQnXSxcbiAgICAgIDUzOiBbJzUnLCAnJSddLFxuICAgICAgNTQ6IFsnNicsICdeJ10sXG4gICAgICA1NTogWyc3JywgJyYnXSxcbiAgICAgIDU2OiBbJzgnLCAnKiddLFxuICAgICAgNTc6IFsnOScsICcoJ10sXG4gICAgICA5MTogJ09TJyxcbiAgICAgIDkzOiAnQ29udGV4dE1lbnUnLFxuICAgICAgMTQ0OiAnTnVtTG9jaycsXG4gICAgICAxNDU6ICdTY3JvbGxMb2NrJyxcbiAgICAgIDE4MTogJ1ZvbHVtZU11dGUnLFxuICAgICAgMTgyOiAnVm9sdW1lRG93bicsXG4gICAgICAxODM6ICdWb2x1bWVVcCcsXG4gICAgICAxODY6IFsnOycsICc6J10sXG4gICAgICAxODc6IFsnPScsICcrJ10sXG4gICAgICAxODg6IFsnLCcsICc8J10sXG4gICAgICAxODk6IFsnLScsICdfJ10sXG4gICAgICAxOTA6IFsnLicsICc+J10sXG4gICAgICAxOTE6IFsnLycsICc/J10sXG4gICAgICAxOTI6IFsnYCcsICd+J10sXG4gICAgICAyMTk6IFsnWycsICd7J10sXG4gICAgICAyMjA6IFsnXFxcXCcsICd8J10sXG4gICAgICAyMjE6IFsnXScsICd9J10sXG4gICAgICAyMjI6IFtcIidcIiwgJ1wiJ10sXG4gICAgICAyMjQ6ICdNZXRhJyxcbiAgICAgIDIyNTogJ0FsdEdyYXBoJyxcbiAgICAgIDI0NjogJ0F0dG4nLFxuICAgICAgMjQ3OiAnQ3JTZWwnLFxuICAgICAgMjQ4OiAnRXhTZWwnLFxuICAgICAgMjQ5OiAnRXJhc2VFb2YnLFxuICAgICAgMjUwOiAnUGxheScsXG4gICAgICAyNTE6ICdab29tT3V0J1xuICAgIH1cbiAgfTtcblxuICAvLyBGdW5jdGlvbiBrZXlzIChGMS0yNCkuXG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgMjU7IGkrKykge1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzWzExMSArIGldID0gJ0YnICsgaTtcbiAgfVxuXG4gIC8vIFByaW50YWJsZSBBU0NJSSBjaGFyYWN0ZXJzLlxuICB2YXIgbGV0dGVyID0gJyc7XG4gIGZvciAoaSA9IDY1OyBpIDwgOTE7IGkrKykge1xuICAgIGxldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbaV0gPSBbbGV0dGVyLnRvTG93ZXJDYXNlKCksIGxldHRlci50b1VwcGVyQ2FzZSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvbHlmaWxsICgpIHtcbiAgICBpZiAoISgnS2V5Ym9hcmRFdmVudCcgaW4gd2luZG93KSB8fFxuICAgICAgICAna2V5JyBpbiBLZXlib2FyZEV2ZW50LnByb3RvdHlwZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFBvbHlmaWxsIGBrZXlgIG9uIGBLZXlib2FyZEV2ZW50YC5cbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1t0aGlzLndoaWNoIHx8IHRoaXMua2V5Q29kZV07XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIGtleSA9IGtleVsrdGhpcy5zaGlmdEtleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfVxuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEtleWJvYXJkRXZlbnQucHJvdG90eXBlLCAna2V5JywgcHJvdG8pO1xuICAgIHJldHVybiBwcm90bztcbiAgfVxuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJywga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfSBlbHNlIGlmICh3aW5kb3cpIHtcbiAgICB3aW5kb3cua2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9XG5cbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwcm90byA9IHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyA/IEVsZW1lbnQucHJvdG90eXBlIDoge307XG52YXIgdmVuZG9yID0gcHJvdG8ubWF0Y2hlc1xuICB8fCBwcm90by5tYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5vTWF0Y2hlc1NlbGVjdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoO1xuXG4vKipcbiAqIE1hdGNoIGBlbGAgdG8gYHNlbGVjdG9yYC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIG1hdGNoKGVsLCBzZWxlY3Rvcikge1xuICBpZiAoIWVsIHx8IGVsLm5vZGVUeXBlICE9PSAxKSByZXR1cm4gZmFsc2U7XG4gIGlmICh2ZW5kb3IpIHJldHVybiB2ZW5kb3IuY2FsbChlbCwgc2VsZWN0b3IpO1xuICB2YXIgbm9kZXMgPSBlbC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG5vZGVzW2ldID09IGVsKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuL2RlbGVnYXRlJyk7XG5jb25zdCBkZWxlZ2F0ZUFsbCA9IHJlcXVpcmUoJy4vZGVsZWdhdGVBbGwnKTtcblxuY29uc3QgREVMRUdBVEVfUEFUVEVSTiA9IC9eKC4rKTpkZWxlZ2F0ZVxcKCguKylcXCkkLztcbmNvbnN0IFNQQUNFID0gJyAnO1xuXG5jb25zdCBnZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlLCBoYW5kbGVyKSB7XG4gIHZhciBtYXRjaCA9IHR5cGUubWF0Y2goREVMRUdBVEVfUEFUVEVSTik7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKG1hdGNoKSB7XG4gICAgdHlwZSA9IG1hdGNoWzFdO1xuICAgIHNlbGVjdG9yID0gbWF0Y2hbMl07XG4gIH1cblxuICB2YXIgb3B0aW9ucztcbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBjYXB0dXJlOiBwb3BLZXkoaGFuZGxlciwgJ2NhcHR1cmUnKSxcbiAgICAgIHBhc3NpdmU6IHBvcEtleShoYW5kbGVyLCAncGFzc2l2ZScpXG4gICAgfTtcbiAgfVxuXG4gIHZhciBsaXN0ZW5lciA9IHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgZGVsZWdhdGU6ICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpXG4gICAgICA/IGRlbGVnYXRlQWxsKGhhbmRsZXIpXG4gICAgICA6IHNlbGVjdG9yXG4gICAgICAgID8gZGVsZWdhdGUoc2VsZWN0b3IsIGhhbmRsZXIpXG4gICAgICAgIDogaGFuZGxlcixcbiAgICBvcHRpb25zOiBvcHRpb25zXG4gIH07XG5cbiAgaWYgKHR5cGUuaW5kZXhPZihTUEFDRSkgPiAtMSkge1xuICAgIHJldHVybiB0eXBlLnNwbGl0KFNQQUNFKS5tYXAoZnVuY3Rpb24oX3R5cGUpIHtcbiAgICAgIHJldHVybiBhc3NpZ24oe3R5cGU6IF90eXBlfSwgbGlzdGVuZXIpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RlbmVyLnR5cGUgPSB0eXBlO1xuICAgIHJldHVybiBbbGlzdGVuZXJdO1xuICB9XG59O1xuXG52YXIgcG9wS2V5ID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gIGRlbGV0ZSBvYmpba2V5XTtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiZWhhdmlvcihldmVudHMsIHByb3BzKSB7XG4gIGNvbnN0IGxpc3RlbmVycyA9IE9iamVjdC5rZXlzKGV2ZW50cylcbiAgICAucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBnZXRMaXN0ZW5lcnModHlwZSwgZXZlbnRzW3R5cGVdKTtcbiAgICAgIHJldHVybiBtZW1vLmNvbmNhdChsaXN0ZW5lcnMpO1xuICAgIH0sIFtdKTtcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZEJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmVCZWhhdmlvcihlbGVtZW50KSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgbGlzdGVuZXIudHlwZSxcbiAgICAgICAgICBsaXN0ZW5lci5kZWxlZ2F0ZSxcbiAgICAgICAgICBsaXN0ZW5lci5vcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHByb3BzKTtcbn07XG4iLCJjb25zdCBtYXRjaGVzID0gcmVxdWlyZSgnbWF0Y2hlcy1zZWxlY3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gIGRvIHtcbiAgICBpZiAobWF0Y2hlcyhlbGVtZW50LCBzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cbiAgfSB3aGlsZSAoKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpO1xufTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3NlKGZ1bmN0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBmdW5jdGlvbnMuc29tZShmdW5jdGlvbihmbikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZSkgPT09IGZhbHNlO1xuICAgIH0sIHRoaXMpO1xuICB9O1xufTtcbiIsImNvbnN0IGNsb3Nlc3QgPSByZXF1aXJlKCcuL2Nsb3Nlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlbGVnYXRpb24oZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9yKTtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0YXJnZXQsIGV2ZW50KTtcbiAgICB9XG4gIH1cbn07XG4iLCJjb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcbmNvbnN0IGNvbXBvc2UgPSByZXF1aXJlKCcuL2NvbXBvc2UnKTtcblxuY29uc3QgU1BMQVQgPSAnKic7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVsZWdhdGVBbGwoc2VsZWN0b3JzKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhzZWxlY3RvcnMpXG5cbiAgLy8gWFhYIG9wdGltaXphdGlvbjogaWYgdGhlcmUgaXMgb25seSBvbmUgaGFuZGxlciBhbmQgaXQgYXBwbGllcyB0b1xuICAvLyBhbGwgZWxlbWVudHMgKHRoZSBcIipcIiBDU1Mgc2VsZWN0b3IpLCB0aGVuIGp1c3QgcmV0dXJuIHRoYXRcbiAgLy8gaGFuZGxlclxuICBpZiAoa2V5cy5sZW5ndGggPT09IDEgJiYga2V5c1swXSA9PT0gU1BMQVQpIHtcbiAgICByZXR1cm4gc2VsZWN0b3JzW1NQTEFUXTtcbiAgfVxuXG4gIGNvbnN0IGRlbGVnYXRlcyA9IGtleXMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHNlbGVjdG9yKSB7XG4gICAgbWVtby5wdXNoKGRlbGVnYXRlKHNlbGVjdG9yLCBzZWxlY3RvcnNbc2VsZWN0b3JdKSk7XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIFtdKTtcbiAgcmV0dXJuIGNvbXBvc2UoZGVsZWdhdGVzKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlnbm9yZShlbGVtZW50LCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gaWdub3JhbmNlKGUpIHtcbiAgICBpZiAoZWxlbWVudCAhPT0gZS50YXJnZXQgJiYgIWVsZW1lbnQuY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKTtcbiAgICB9XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYmVoYXZpb3I6IHJlcXVpcmUoJy4vYmVoYXZpb3InKSxcbiAgZGVsZWdhdGU6IHJlcXVpcmUoJy4vZGVsZWdhdGUnKSxcbiAgZGVsZWdhdGVBbGw6IHJlcXVpcmUoJy4vZGVsZWdhdGVBbGwnKSxcbiAgaWdub3JlOiByZXF1aXJlKCcuL2lnbm9yZScpLFxuICBrZXltYXA6IHJlcXVpcmUoJy4va2V5bWFwJyksXG59O1xuIiwicmVxdWlyZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnKTtcblxuLy8gdGhlc2UgYXJlIHRoZSBvbmx5IHJlbGV2YW50IG1vZGlmaWVycyBzdXBwb3J0ZWQgb24gYWxsIHBsYXRmb3Jtcyxcbi8vIGFjY29yZGluZyB0byBNRE46XG4vLyA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0tleWJvYXJkRXZlbnQvZ2V0TW9kaWZpZXJTdGF0ZT5cbmNvbnN0IE1PRElGSUVSUyA9IHtcbiAgJ0FsdCc6ICAgICAgJ2FsdEtleScsXG4gICdDb250cm9sJzogICdjdHJsS2V5JyxcbiAgJ0N0cmwnOiAgICAgJ2N0cmxLZXknLFxuICAnU2hpZnQnOiAgICAnc2hpZnRLZXknXG59O1xuXG5jb25zdCBNT0RJRklFUl9TRVBBUkFUT1IgPSAnKyc7XG5cbmNvbnN0IGdldEV2ZW50S2V5ID0gZnVuY3Rpb24oZXZlbnQsIGhhc01vZGlmaWVycykge1xuICB2YXIga2V5ID0gZXZlbnQua2V5O1xuICBpZiAoaGFzTW9kaWZpZXJzKSB7XG4gICAgZm9yICh2YXIgbW9kaWZpZXIgaW4gTU9ESUZJRVJTKSB7XG4gICAgICBpZiAoZXZlbnRbTU9ESUZJRVJTW21vZGlmaWVyXV0gPT09IHRydWUpIHtcbiAgICAgICAga2V5ID0gW21vZGlmaWVyLCBrZXldLmpvaW4oTU9ESUZJRVJfU0VQQVJBVE9SKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGtleTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ga2V5bWFwKGtleXMpIHtcbiAgY29uc3QgaGFzTW9kaWZpZXJzID0gT2JqZWN0LmtleXMoa2V5cykuc29tZShmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4ga2V5LmluZGV4T2YoTU9ESUZJRVJfU0VQQVJBVE9SKSA+IC0xO1xuICB9KTtcbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGtleSA9IGdldEV2ZW50S2V5KGV2ZW50LCBoYXNNb2RpZmllcnMpO1xuICAgIHJldHVybiBba2V5LCBrZXkudG9Mb3dlckNhc2UoKV1cbiAgICAgIC5yZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCBfa2V5KSB7XG4gICAgICAgIGlmIChfa2V5IGluIGtleXMpIHtcbiAgICAgICAgICByZXN1bHQgPSBrZXlzW2tleV0uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0sIHVuZGVmaW5lZCk7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5NT0RJRklFUlMgPSBNT0RJRklFUlM7XG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcclxuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9nZ2xlJyk7XHJcbmNvbnN0IGlzRWxlbWVudEluVmlld3BvcnQgPSByZXF1aXJlKCcuLi91dGlscy9pcy1pbi12aWV3cG9ydCcpO1xyXG5jb25zdCBCVVRUT04gPSBgLmFjY29yZGlvbi1idXR0b25bYXJpYS1jb250cm9sc11gO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFID0gXCJkYXRhLWFjY29yZGlvbi1idWxrLWV4cGFuZFwiO1xyXG5jb25zdCBURVhUX0FDQ09SRElPTiA9IHtcclxuICAgIFwib3Blbl9hbGxcIjogXCLDhWJuIGFsbGVcIixcclxuICAgIFwiY2xvc2VfYWxsXCI6IFwiTHVrIGFsbGVcIlxyXG59XHJcblxyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIGFjY29yZGlvbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICRhY2NvcmRpb24gdGhlIGFjY29yZGlvbiB1bCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7SlNPTn0gc3RyaW5ncyBUcmFuc2xhdGUgbGFiZWxzOiB7XCJvcGVuX2FsbFwiOiBcIsOFYm4gYWxsZVwiLCBcImNsb3NlX2FsbFwiOiBcIkx1ayBhbGxlXCJ9XHJcbiAqL1xyXG5mdW5jdGlvbiBBY2NvcmRpb24oJGFjY29yZGlvbiwgc3RyaW5ncyA9IFRFWFRfQUNDT1JESU9OKSB7XHJcbiAgICBpZiAoISRhY2NvcmRpb24pIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGdyb3VwIGVsZW1lbnRgKTtcclxuICAgIH1cclxuICAgIHRoaXMuYWNjb3JkaW9uID0gJGFjY29yZGlvbjtcclxuICAgIHRoaXMudGV4dCA9IHN0cmluZ3M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRsaXN0ZW5lcnMgb24gY2xpY2sgZWxlbWVudHMgaW4gYWNjb3JkaW9uIGxpc3RcclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuYnV0dG9ucyA9IHRoaXMuYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgIGlmICh0aGlzLmJ1dHRvbnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBsb29wIGJ1dHRvbnMgaW4gbGlzdFxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9uc1tpXTtcclxuXHJcbiAgICAgICAgLy8gVmVyaWZ5IHN0YXRlIG9uIGJ1dHRvbiBhbmQgc3RhdGUgb24gcGFuZWxcclxuICAgICAgICBsZXQgZXhwYW5kZWQgPSBjdXJyZW50QnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcclxuICAgICAgICB0aGlzLnRvZ2dsZUJ1dHRvbihjdXJyZW50QnV0dG9uLCBleHBhbmRlZCk7XHJcblxyXG4gICAgICAgIC8vIFNldCBjbGljayBldmVudCBvbiBhY2NvcmRpb24gYnV0dG9uc1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmV2ZW50T25DbGljay5iaW5kKHRoaXMsIGN1cnJlbnRCdXR0b24pLCBmYWxzZSk7XHJcbiAgICAgICAgY3VycmVudEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZXZlbnRPbkNsaWNrLmJpbmQodGhpcywgY3VycmVudEJ1dHRvbiksIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8vIFNldCBjbGljayBldmVudCBvbiBidWxrIGJ1dHRvbiBpZiBwcmVzZW50XHJcbiAgICBsZXQgcHJldlNpYmxpbmcgPSB0aGlzLmFjY29yZGlvbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgaWYgKHByZXZTaWJsaW5nICE9PSBudWxsICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLWJ1bGstYnV0dG9uJykpIHtcclxuICAgICAgICB0aGlzLmJ1bGtGdW5jdGlvbkJ1dHRvbiA9IHByZXZTaWJsaW5nO1xyXG4gICAgICAgIHRoaXMuYnVsa0Z1bmN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5idWxrRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCdWxrIGV2ZW50IGhhbmRsZXI6IFRyaWdnZXJlZCB3aGVuIGNsaWNraW5nIG9uIC5hY2NvcmRpb24tYnVsay1idXR0b25cclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuYnVsa0V2ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gICAgaWYgKCEkbW9kdWxlLmFjY29yZGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24uYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoJG1vZHVsZS5idXR0b25zLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBidXR0b25zYCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGV4cGFuZCA9IHRydWU7XHJcbiAgICBpZiAoJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uZ2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSkgPT09IFwiZmFsc2VcIikge1xyXG4gICAgICAgIGV4cGFuZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkbW9kdWxlLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAkbW9kdWxlLnRvZ2dsZUJ1dHRvbigkbW9kdWxlLmJ1dHRvbnNbaV0sIGV4cGFuZCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgIWV4cGFuZCk7XHJcbiAgICBpZiAoIWV4cGFuZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmlubmVyVGV4dCA9IHRoaXMudGV4dC5vcGVuX2FsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uaW5uZXJUZXh0ID0gdGhpcy50ZXh0LmNsb3NlX2FsbDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFjY29yZGlvbiBidXR0b24gZXZlbnQgaGFuZGxlcjogVG9nZ2xlcyBhY2NvcmRpb25cclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gJGJ1dHRvbiBcclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGUgXHJcbiAqL1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLmV2ZW50T25DbGljayA9IGZ1bmN0aW9uICgkYnV0dG9uLCBlKSB7XHJcbiAgICB2YXIgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJG1vZHVsZS50b2dnbGVCdXR0b24oJGJ1dHRvbik7XHJcbiAgICBpZiAoJGJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZScpIHtcclxuICAgICAgICAvLyBXZSB3ZXJlIGp1c3QgZXhwYW5kZWQsIGJ1dCBpZiBhbm90aGVyIGFjY29yZGlvbiB3YXMgYWxzbyBqdXN0XHJcbiAgICAgICAgLy8gY29sbGFwc2VkLCB3ZSBtYXkgbm8gbG9uZ2VyIGJlIGluIHRoZSB2aWV3cG9ydC4gVGhpcyBlbnN1cmVzXHJcbiAgICAgICAgLy8gdGhhdCB3ZSBhcmUgc3RpbGwgdmlzaWJsZSwgc28gdGhlIHVzZXIgaXNuJ3QgY29uZnVzZWQuXHJcbiAgICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KCRidXR0b24pKSAkYnV0dG9uLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgYSBidXR0b24ncyBcInByZXNzZWRcIiBzdGF0ZSwgb3B0aW9uYWxseSBwcm92aWRpbmcgYSB0YXJnZXRcclxuICogc3RhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxyXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBleHBhbmRlZCBJZiBubyBzdGF0ZSBpcyBwcm92aWRlZCwgdGhlIGN1cnJlbnRcclxuICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIHJlc3VsdGluZyBzdGF0ZVxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS50b2dnbGVCdXR0b24gPSBmdW5jdGlvbiAoYnV0dG9uLCBleHBhbmRlZCwgYnVsayA9IGZhbHNlKSB7XHJcbiAgICBsZXQgYWNjb3JkaW9uID0gbnVsbDtcclxuICAgIGlmIChidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpIHtcclxuICAgICAgICBhY2NvcmRpb24gPSBidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gICAgfSBlbHNlIGlmIChidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSkge1xyXG4gICAgICAgIGFjY29yZGlvbiA9IGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICAgIH1cclxuICAgIGV4cGFuZGVkID0gdG9nZ2xlKGJ1dHRvbiwgZXhwYW5kZWQpO1xyXG4gICAgaWYgKGV4cGFuZGVkKSB7XHJcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5vcGVuJyk7XHJcbiAgICAgICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnKTtcclxuICAgICAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYWNjb3JkaW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGJ1bGtGdW5jdGlvbiA9IGFjY29yZGlvbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgIGlmIChidWxrRnVuY3Rpb24gIT09IG51bGwgJiYgYnVsa0Z1bmN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLWJ1bGstYnV0dG9uJykpIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbnMgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG4gICAgICAgICAgICBpZiAoYnVsayA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGxldCBidXR0b25zT3BlbiA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTiArICdbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdTdGF0dXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChidXR0b25zLmxlbmd0aCA9PT0gYnV0dG9uc09wZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYnVsa0Z1bmN0aW9uLnNldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUsIG5ld1N0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3U3RhdHVzID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IHRoaXMudGV4dC5vcGVuX2FsbDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IHRoaXMudGV4dC5jbG9zZV9hbGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBY2NvcmRpb247IiwiJ3VzZSBzdHJpY3QnO1xyXG5mdW5jdGlvbiBBbGVydChhbGVydCl7XHJcbiAgICB0aGlzLmFsZXJ0ID0gYWxlcnQ7XHJcbn1cclxuXHJcbkFsZXJ0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIGxldCBjbG9zZSA9IHRoaXMuYWxlcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWxlcnQtY2xvc2UnKTtcclxuICAgIGlmKGNsb3NlLmxlbmd0aCA9PT0gMSl7XHJcbiAgICAgICAgY2xvc2VbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkFsZXJ0LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuYWxlcnQuY2xhc3NMaXN0LmFkZCgnZC1ub25lJyk7XHJcbiAgICBsZXQgZXZlbnRIaWRlID0gbmV3IEV2ZW50KCdmZHMuYWxlcnQuaGlkZScpO1xyXG4gICAgdGhpcy5hbGVydC5kaXNwYXRjaEV2ZW50KGV2ZW50SGlkZSk7XHJcbn07XHJcblxyXG5BbGVydC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmFsZXJ0LmNsYXNzTGlzdC5yZW1vdmUoJ2Qtbm9uZScpO1xyXG4gICAgXHJcbiAgICBsZXQgZXZlbnRTaG93ID0gbmV3IEV2ZW50KCdmZHMuYWxlcnQuc2hvdycpO1xyXG4gICAgdGhpcy5hbGVydC5kaXNwYXRjaEV2ZW50KGV2ZW50U2hvdyk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBbGVydDsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBCYWNrVG9Ub3AoYmFja3RvdG9wKXtcclxuICAgIHRoaXMuYmFja3RvdG9wID0gYmFja3RvdG9wO1xyXG59XHJcblxyXG5CYWNrVG9Ub3AucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBiYWNrdG90b3BidXR0b24gPSB0aGlzLmJhY2t0b3RvcDtcclxuXHJcbiAgICB1cGRhdGVCYWNrVG9Ub3BCdXR0b24oYmFja3RvdG9wYnV0dG9uKTtcclxuXHJcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCBsaXN0ID0+IHtcclxuICAgICAgICBjb25zdCBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2RvbS1jaGFuZ2VkJywge2RldGFpbDogbGlzdH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuZGlzcGF0Y2hFdmVudChldnQpXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBXaGljaCBtdXRhdGlvbnMgdG8gb2JzZXJ2ZVxyXG4gICAgbGV0IGNvbmZpZyA9IHtcclxuICAgICAgICBhdHRyaWJ1dGVzICAgICAgICAgICAgOiB0cnVlLFxyXG4gICAgICAgIGF0dHJpYnV0ZU9sZFZhbHVlICAgICA6IGZhbHNlLFxyXG4gICAgICAgIGNoYXJhY3RlckRhdGEgICAgICAgICA6IHRydWUsXHJcbiAgICAgICAgY2hhcmFjdGVyRGF0YU9sZFZhbHVlIDogZmFsc2UsXHJcbiAgICAgICAgY2hpbGRMaXN0ICAgICAgICAgICAgIDogdHJ1ZSxcclxuICAgICAgICBzdWJ0cmVlICAgICAgICAgICAgICAgOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIERPTSBjaGFuZ2VzXHJcbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIGNvbmZpZyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2RvbS1jaGFuZ2VkJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihiYWNrdG90b3BidXR0b24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gU2Nyb2xsIGFjdGlvbnNcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBXaW5kb3cgcmVzaXplc1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB1cGRhdGVCYWNrVG9Ub3BCdXR0b24oYmFja3RvdG9wYnV0dG9uKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVCYWNrVG9Ub3BCdXR0b24oYnV0dG9uKSB7XHJcbiAgICBsZXQgZG9jQm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICBsZXQgZG9jRWxlbSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgIGxldCBoZWlnaHRPZlZpZXdwb3J0ID0gTWF0aC5tYXgoZG9jRWxlbS5jbGllbnRIZWlnaHQgfHwgMCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xyXG4gICAgbGV0IGhlaWdodE9mUGFnZSA9IE1hdGgubWF4KGRvY0JvZHkuc2Nyb2xsSGVpZ2h0LCBkb2NCb2R5Lm9mZnNldEhlaWdodCwgZG9jQm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jRWxlbS5zY3JvbGxIZWlnaHQsIGRvY0VsZW0ub2Zmc2V0SGVpZ2h0LCBkb2NFbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCwgZG9jRWxlbS5jbGllbnRIZWlnaHQpO1xyXG4gICAgXHJcbiAgICBsZXQgbGltaXQgPSBoZWlnaHRPZlZpZXdwb3J0ICogMjsgLy8gVGhlIHRocmVzaG9sZCBzZWxlY3RlZCB0byBkZXRlcm1pbmUgd2hldGhlciBhIGJhY2stdG8tdG9wLWJ1dHRvbiBzaG91bGQgYmUgZGlzcGxheWVkXHJcbiAgICBcclxuICAgIC8vIE5ldmVyIHNob3cgdGhlIGJ1dHRvbiBpZiB0aGUgcGFnZSBpcyB0b28gc2hvcnRcclxuICAgIGlmIChsaW1pdCA+IGhlaWdodE9mUGFnZSkge1xyXG4gICAgICAgIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZC1ub25lJykpIHtcclxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIElmIHRoZSBwYWdlIGlzIGxvbmcsIGNhbGN1bGF0ZSB3aGVuIHRvIHNob3cgdGhlIGJ1dHRvblxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Qtbm9uZScpKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsYXN0S25vd25TY3JvbGxQb3NpdGlvbiA9IHdpbmRvdy5zY3JvbGxZO1xyXG4gICAgICAgIGxldCBmb290ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImZvb3RlclwiKVswXTsgLy8gSWYgdGhlcmUgYXJlIHNldmVyYWwgZm9vdGVycywgdGhlIGNvZGUgb25seSBhcHBsaWVzIHRvIHRoZSBmaXJzdCBmb290ZXJcclxuXHJcbiAgICAgICAgLy8gU2hvdyB0aGUgYnV0dG9uLCBpZiB0aGUgdXNlciBoYXMgc2Nyb2xsZWQgdG9vIGZhciBkb3duXHJcbiAgICAgICAgaWYgKGxhc3RLbm93blNjcm9sbFBvc2l0aW9uID49IGxpbWl0KSB7XHJcbiAgICAgICAgICAgIGlmICghaXNGb290ZXJWaXNpYmxlKGZvb3RlcikgJiYgYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmICFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdmb290ZXItc3RpY2t5JykpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdmb290ZXItc3RpY2t5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgdGhlcmUncyBhIHNpZGVuYXYsIHdlIG1pZ2h0IHdhbnQgdG8gc2hvdyB0aGUgYnV0dG9uIGFueXdheVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgc2lkZW5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaWRlbmF2LWxpc3QnKTsgLy8gRmluZHMgc2lkZSBuYXZpZ2F0aW9ucyAobGVmdCBtZW51cykgYW5kIHN0ZXAgZ3VpZGVzXHJcblxyXG4gICAgICAgICAgICBpZiAoc2lkZW5hdiAmJiBzaWRlbmF2Lm9mZnNldFBhcmVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gT25seSByZWFjdCB0byBzaWRlbmF2cywgd2hpY2ggYXJlIGFsd2F5cyB2aXNpYmxlIChpLmUuIG5vdCBvcGVuZWQgZnJvbSBvdmVyZmxvdy1tZW51IGJ1dHRvbnMpXHJcbiAgICAgICAgICAgICAgICBpZiAoIShzaWRlbmF2LmNsb3Nlc3QoXCIub3ZlcmZsb3ctbWVudS1pbm5lclwiKT8ucHJldmlvdXNFbGVtZW50U2libGluZz8uZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IFwidHJ1ZVwiICYmXHJcbiAgICAgICAgICAgICAgICBzaWRlbmF2LmNsb3Nlc3QoXCIub3ZlcmZsb3ctbWVudS1pbm5lclwiKT8ucHJldmlvdXNFbGVtZW50U2libGluZz8ub2Zmc2V0UGFyZW50ICE9PSBudWxsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZWN0ID0gc2lkZW5hdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVjdC5ib3R0b20gPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGb290ZXJWaXNpYmxlKGZvb3RlcikgJiYgYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmICFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdmb290ZXItc3RpY2t5JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdmb290ZXItc3RpY2t5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBUaGVyZSdzIG5vIHNpZGVuYXYgYW5kIHdlIGtub3cgdGhlIHVzZXIgaGFzbid0IHJlYWNoZWQgdGhlIHNjcm9sbCBsaW1pdDogRW5zdXJlIHRoZSBidXR0b24gaXMgaGlkZGVuXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdmb290ZXItc3RpY2t5JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gaXNGb290ZXJWaXNpYmxlKGZvb3RlckVsZW1lbnQpIHtcclxuICAgIGlmIChmb290ZXJFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyJykpIHtcclxuICAgICAgICBsZXQgcmVjdCA9IGZvb3RlckVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3RlcicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICAvLyBGb290ZXIgaXMgdmlzaWJsZSBvciBwYXJ0bHkgdmlzaWJsZVxyXG4gICAgICAgIGlmICgocmVjdC50b3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgcmVjdC50b3AgPCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRm9vdGVyIGlzIGhpZGRlblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYWNrVG9Ub3A7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgTUFYX0xFTkdUSCA9ICdkYXRhLW1heGxlbmd0aCc7XHJcbmNvbnN0IFRFWFRfQ0hBUkFDVEVSTElNSVQgPSB7XHJcbiAgICBcImNoYXJhY3Rlcl9yZW1haW5pbmdcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIHRpbGJhZ2VcIixcclxuICAgIFwiY2hhcmFjdGVyc19yZW1haW5pbmdcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIHRpbGJhZ2VcIixcclxuICAgIFwiY2hhcmFjdGVyX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIixcclxuICAgIFwiY2hhcmFjdGVyc190b29fbWFueVwiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gZm9yIG1lZ2V0XCJcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTaG93IG51bWJlciBvZiBjaGFyYWN0ZXJzIGxlZnQgaW4gYSBmaWVsZFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxyXG4gKiBAcGFyYW0ge0pTT059IHN0cmluZ3MgVHJhbnNsYXRlIGxhYmVsczoge1wiY2hhcmFjdGVyX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLCBcImNoYXJhY3RlcnNfcmVtYWluaW5nXCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiB0aWxiYWdlXCIsIFwiY2hhcmFjdGVyX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIiwgXCJjaGFyYWN0ZXJzX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIn1cclxuICovXHJcbiBmdW5jdGlvbiBDaGFyYWN0ZXJMaW1pdChjb250YWluZXJFbGVtZW50LCBzdHJpbmdzID0gVEVYVF9DSEFSQUNURVJMSU1JVCkge1xyXG4gICAgaWYgKCFjb250YWluZXJFbGVtZW50KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGZvcm0tbGltaXQgZWxlbWVudGApO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJFbGVtZW50O1xyXG4gICAgdGhpcy5pbnB1dCA9IGNvbnRhaW5lckVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1pbnB1dCcpWzBdO1xyXG4gICAgdGhpcy5tYXhsZW5ndGggPSB0aGlzLmNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoTUFYX0xFTkdUSCk7XHJcbiAgICB0aGlzLnRleHQgPSBzdHJpbmdzO1xyXG5cclxuICAgIGxldCBsYXN0S2V5VXBUaW1lc3RhbXAgPSBudWxsO1xyXG4gICAgbGV0IG9sZFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuICAgIGxldCBpbnRlcnZhbElEID0gbnVsbDtcclxuXHJcbiAgICBsZXQgaGFuZGxlS2V5VXAgPSAoKSA9PiB7XHJcbiAgICAgICAgdXBkYXRlVmlzaWJsZU1lc3NhZ2UodGhpcyk7XHJcbiAgICAgICAgbGFzdEtleVVwVGltZXN0YW1wID0gRGF0ZS5ub3coKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaGFuZGxlRm9jdXMgPSAoKSA9PiB7XHJcbiAgICAgICAgLyogUmVzZXQgdGhlIHNjcmVlbiByZWFkZXIgbWVzc2FnZSBvbiBmb2N1cyB0byBmb3JjZSBhbiB1cGRhdGUgb2YgdGhlIG1lc3NhZ2UuXHJcbiAgICAgICAgVGhpcyBlbnN1cmVzIHRoYXQgYSBzY3JlZW4gcmVhZGVyIGluZm9ybXMgdGhlIHVzZXIgb2YgaG93IG1hbnkgY2hhcmFjdGVycyB0aGVyZSBpcyBsZWZ0XHJcbiAgICAgICAgb24gZm9jdXMgYW5kIG5vdCBqdXN0IHdoYXQgdGhlIGNoYXJhY3RlciBsaW1pdCBpcy4gKi9cclxuICAgICAgICBpZiAodGhpcy5pbnB1dC52YWx1ZSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICBsZXQgc3JfbWVzc2FnZSA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdC1zci1vbmx5JylbMF07XHJcbiAgICAgICAgICAgIHNyX21lc3NhZ2UuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLyogRG9uJ3QgdXBkYXRlIHRoZSBTY3JlZW4gUmVhZGVyIG1lc3NhZ2UgdW5sZXNzIGl0J3MgYmVlbiBhd2hpbGVcclxuICAgICAgICAgICAgc2luY2UgdGhlIGxhc3Qga2V5IHVwIGV2ZW50LiBPdGhlcndpc2UsIHRoZSB1c2VyIHdpbGwgYmUgc3BhbW1lZFxyXG4gICAgICAgICAgICB3aXRoIGF1ZGlvIG5vdGlmaWNhdGlvbnMgd2hpbGUgdHlwaW5nLiAqL1xyXG4gICAgICAgICAgICBpZiAoIWxhc3RLZXlVcFRpbWVzdGFtcCB8fCAoRGF0ZS5ub3coKSAtIDUwMCkgPj0gbGFzdEtleVVwVGltZXN0YW1wKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3JfbWVzc2FnZSA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdC1zci1vbmx5JylbMF0uaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZpc2libGVfbWVzc2FnZSA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdCcpWzBdLmlubmVySFRNTDsgICAgIFxyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAvKiBEb24ndCB1cGRhdGUgdGhlIG1lc3NhZ2VzIHVubGVzcyB0aGUgaW5wdXQgaGFzIGNoYW5nZWQgb3IgaWYgdGhlcmVcclxuICAgICAgICAgICAgICAgIGlzIGEgbWlzbWF0Y2ggYmV0d2VlbiB0aGUgdmlzaWJsZSBtZXNzYWdlIGFuZCB0aGUgc2NyZWVuIHJlYWRlciBtZXNzYWdlLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB0aGlzLmlucHV0LnZhbHVlIHx8IHNyX21lc3NhZ2UgIT09IHZpc2libGVfbWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2VzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcyksIDEwMDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBsZXQgaGFuZGxlQmx1ciA9ICgpID0+IHtcclxuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSUQpO1xyXG4gICAgICAgIC8vIERvbid0IHVwZGF0ZSB0aGUgbWVzc2FnZXMgb24gYmx1ciB1bmxlc3MgdGhlIHZhbHVlIG9mIHRoZSB0ZXh0YXJlYS90ZXh0IGlucHV0IGhhcyBjaGFuZ2VkXHJcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB0aGlzLmlucHV0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIG9sZFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoIXRoaXMubWF4bGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2hhcmFjdGVyIGxpbWl0IGlzIG1pc3NpbmcgYXR0cmlidXRlICR7TUFYX0xFTkdUSH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlS2V5VXAoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUZvY3VzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUJsdXIoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyogSWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhlIHBhZ2VzaG93IGV2ZW50LCB1c2UgaXQgdG8gdXBkYXRlIHRoZSBjaGFyYWN0ZXIgbGltaXRcclxuICAgICAgICBtZXNzYWdlIGFuZCBzci1tZXNzYWdlIG9uY2UgYSBwYWdlIGhhcyBsb2FkZWQuIFNlY29uZCBiZXN0LCB1c2UgdGhlIERPTUNvbnRlbnRMb2FkZWQgZXZlbnQuIFxyXG4gICAgICAgIFRoaXMgZW5zdXJlcyB0aGF0IGlmIHRoZSB1c2VyIG5hdmlnYXRlcyB0byBhbm90aGVyIHBhZ2UgaW4gdGhlIGJyb3dzZXIgYW5kIGdvZXMgYmFjaywgdGhlIFxyXG4gICAgICAgIG1lc3NhZ2UgYW5kIHNyLW1lc3NhZ2Ugd2lsbCBzaG93L3RlbGwgdGhlIGNvcnJlY3QgYW1vdW50IG9mIGNoYXJhY3RlcnMgbGVmdC4gKi9cclxuICAgICAgICBpZiAoJ29ucGFnZXNob3cnIGluIHdpbmRvdykge1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZXNob3cnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2VzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlcygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUuY2hhcmFjdGVyc0xlZnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgY3VycmVudF9sZW5ndGggPSB0aGlzLmlucHV0LnZhbHVlLmxlbmd0aDtcclxuICAgIHJldHVybiB0aGlzLm1heGxlbmd0aCAtIGN1cnJlbnRfbGVuZ3RoO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGFyYWN0ZXJMaW1pdE1lc3NhZ2UoZm9ybUxpbWl0KSB7XHJcbiAgICBsZXQgY291bnRfbWVzc2FnZSA9IFwiXCI7XHJcbiAgICBsZXQgY2hhcmFjdGVyc19sZWZ0ID0gZm9ybUxpbWl0LmNoYXJhY3RlcnNMZWZ0KCk7XHJcblxyXG4gICAgaWYgKGNoYXJhY3RlcnNfbGVmdCA9PT0gLTEpIHtcclxuICAgICAgICBsZXQgZXhjZWVkZWQgPSBNYXRoLmFicyhjaGFyYWN0ZXJzX2xlZnQpO1xyXG4gICAgICAgIGNvdW50X21lc3NhZ2UgPSBmb3JtTGltaXQudGV4dC5jaGFyYWN0ZXJfdG9vX21hbnkucmVwbGFjZSgve3ZhbHVlfS8sIGV4Y2VlZGVkKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGNoYXJhY3RlcnNfbGVmdCA9PT0gMSkge1xyXG4gICAgICAgIGNvdW50X21lc3NhZ2UgPSBmb3JtTGltaXQudGV4dC5jaGFyYWN0ZXJfcmVtYWluaW5nLnJlcGxhY2UoL3t2YWx1ZX0vLCBjaGFyYWN0ZXJzX2xlZnQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoY2hhcmFjdGVyc19sZWZ0ID49IDApIHtcclxuICAgICAgICBjb3VudF9tZXNzYWdlID0gZm9ybUxpbWl0LnRleHQuY2hhcmFjdGVyc19yZW1haW5pbmcucmVwbGFjZSgve3ZhbHVlfS8sIGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBsZXQgZXhjZWVkZWQgPSBNYXRoLmFicyhjaGFyYWN0ZXJzX2xlZnQpO1xyXG4gICAgICAgIGNvdW50X21lc3NhZ2UgPSBmb3JtTGltaXQudGV4dC5jaGFyYWN0ZXJzX3Rvb19tYW55LnJlcGxhY2UoL3t2YWx1ZX0vLCBleGNlZWRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50X21lc3NhZ2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVZpc2libGVNZXNzYWdlKGZvcm1MaW1pdCkge1xyXG4gICAgbGV0IGNoYXJhY3RlcnNfbGVmdCA9IGZvcm1MaW1pdC5jaGFyYWN0ZXJzTGVmdCgpO1xyXG4gICAgbGV0IGNvdW50X21lc3NhZ2UgPSBjaGFyYWN0ZXJMaW1pdE1lc3NhZ2UoZm9ybUxpbWl0KTtcclxuICAgIGxldCBjaGFyYWN0ZXJfbGFiZWwgPSBmb3JtTGltaXQuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdCcpWzBdO1xyXG5cclxuICAgIGlmIChjaGFyYWN0ZXJzX2xlZnQgPCAwKSB7XHJcbiAgICAgICAgaWYgKCFjaGFyYWN0ZXJfbGFiZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW1pdC1leGNlZWRlZCcpKSB7XHJcbiAgICAgICAgICAgIGNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuYWRkKCdsaW1pdC1leGNlZWRlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWZvcm1MaW1pdC5pbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm0tbGltaXQtZXJyb3InKSkge1xyXG4gICAgICAgICAgICBmb3JtTGltaXQuaW5wdXQuY2xhc3NMaXN0LmFkZCgnZm9ybS1saW1pdC1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChjaGFyYWN0ZXJfbGFiZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW1pdC1leGNlZWRlZCcpKSB7XHJcbiAgICAgICAgICAgIGNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QucmVtb3ZlKCdsaW1pdC1leGNlZWRlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZm9ybUxpbWl0LmlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybS1saW1pdC1lcnJvcicpKSB7XHJcbiAgICAgICAgICAgIGZvcm1MaW1pdC5pbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdmb3JtLWxpbWl0LWVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYXJhY3Rlcl9sYWJlbC5pbm5lckhUTUwgPSBjb3VudF9tZXNzYWdlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVTY3JlZW5SZWFkZXJNZXNzYWdlKGZvcm1MaW1pdCkge1xyXG4gICAgbGV0IGNvdW50X21lc3NhZ2UgPSBjaGFyYWN0ZXJMaW1pdE1lc3NhZ2UoZm9ybUxpbWl0KTtcclxuICAgIGxldCBjaGFyYWN0ZXJfbGFiZWwgPSBmb3JtTGltaXQuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdC1zci1vbmx5JylbMF07XHJcbiAgICBjaGFyYWN0ZXJfbGFiZWwuaW5uZXJIVE1MID0gY291bnRfbWVzc2FnZTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLnVwZGF0ZU1lc3NhZ2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdXBkYXRlVmlzaWJsZU1lc3NhZ2UodGhpcyk7XHJcbiAgICB1cGRhdGVTY3JlZW5SZWFkZXJNZXNzYWdlKHRoaXMpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJMaW1pdDsiLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcclxuXHJcbmNvbnN0IFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFID0gJ2RhdGEtYXJpYS1jb250cm9scyc7XHJcblxyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIGNoZWNrYm94IGNvbGxhcHNlIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBcclxuICovXHJcbmZ1bmN0aW9uIENoZWNrYm94VG9nZ2xlQ29udGVudChjaGVja2JveEVsZW1lbnQpe1xyXG4gICAgdGhpcy5jaGVja2JveEVsZW1lbnQgPSBjaGVja2JveEVsZW1lbnQ7XHJcbiAgICB0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50cyBvbiBjaGVja2JveCBzdGF0ZSBjaGFuZ2VcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmNoZWNrYm94RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMudG9nZ2xlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgY2hlY2tib3ggY29udGVudFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gICAgdmFyIHRhcmdldEF0dHIgPSB0aGlzLmNoZWNrYm94RWxlbWVudC5nZXRBdHRyaWJ1dGUoVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUpXHJcbiAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcclxuICAgIGlmKHRhcmdldEVsID09PSBudWxsIHx8IHRhcmdldEVsID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcGFuZWwgZWxlbWVudC4gVmVyaWZ5IHZhbHVlIG9mIGF0dHJpYnV0ZSBgKyBUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSk7XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmNoZWNrYm94RWxlbWVudC5jaGVja2VkKXtcclxuICAgICAgICAkbW9kdWxlLmV4cGFuZCh0aGlzLmNoZWNrYm94RWxlbWVudCwgdGFyZ2V0RWwpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgJG1vZHVsZS5jb2xsYXBzZSh0aGlzLmNoZWNrYm94RWxlbWVudCwgdGFyZ2V0RWwpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRXhwYW5kIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBjaGVja2JveEVsZW1lbnQgQ2hlY2tib3ggaW5wdXQgZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnQgQ29udGVudCBjb250YWluZXIgZWxlbWVudCBcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUuZXhwYW5kID0gZnVuY3Rpb24oY2hlY2tib3hFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XHJcbiAgICBpZihjaGVja2JveEVsZW1lbnQgIT09IG51bGwgJiYgY2hlY2tib3hFbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudEVsZW1lbnQgIT09IG51bGwgJiYgY29udGVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgY2hlY2tib3hFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmV4cGFuZGVkJyk7XHJcbiAgICAgICAgY2hlY2tib3hFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENvbGxhcHNlIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBjaGVja2JveEVsZW1lbnQgQ2hlY2tib3ggaW5wdXQgZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnQgQ29udGVudCBjb250YWluZXIgZWxlbWVudCBcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUuY29sbGFwc2UgPSBmdW5jdGlvbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmNvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQ7XHJcbiIsImltcG9ydCB7a2V5bWFwfSBmcm9tICdyZWNlcHRvcic7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZShcIi4uL3V0aWxzL2JlaGF2aW9yXCIpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKFwiLi4vdXRpbHMvc2VsZWN0XCIpO1xyXG5jb25zdCB7IHByZWZpeDogUFJFRklYIH0gPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpO1xyXG5jb25zdCB7IENMSUNLIH0gPSByZXF1aXJlKFwiLi4vZXZlbnRzXCIpO1xyXG5jb25zdCBhY3RpdmVFbGVtZW50ID0gcmVxdWlyZShcIi4uL3V0aWxzL2FjdGl2ZS1lbGVtZW50XCIpO1xyXG5jb25zdCBpc0lvc0RldmljZSA9IHJlcXVpcmUoXCIuLi91dGlscy9pcy1pb3MtZGV2aWNlXCIpO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVJfQ0xBU1MgPSBgZGF0ZS1waWNrZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9XUkFQUEVSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X193cmFwcGVyYDtcclxuY29uc3QgREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU30tLWluaXRpYWxpemVkYDtcclxuY29uc3QgREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9LS1hY3RpdmVgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9faW50ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fZXh0ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2J1dHRvbmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19jYWxlbmRhcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVU19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fc3RhdHVzYDtcclxuY29uc3QgREFURV9QSUNLRVJfR1VJREVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2d1aWRlYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZWA7XHJcblxyXG5jb25zdCBESUFMT0dfV1JBUFBFUl9DTEFTUyA9IGBkaWFsb2ctd3JhcHBlcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0RJQUxPR19XUkFQUEVSID0gYC4ke0RJQUxPR19XUkFQUEVSX0NMQVNTfWA7XHJcblxyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXByZXZpb3VzLW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLWN1cnJlbnQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tbmV4dC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS10b2RheWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLXN0YXJ0YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0VORF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLWVuZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXdpdGhpbi1yYW5nZWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLXllYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQteWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9NT05USF9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLXNlbGVjdGVkYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhci1jaHVua2A7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyLWNodW5rYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RhdGUtcGlja2VyYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhci1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9UQUJMRV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fdGFibGVgO1xyXG5jb25zdCBDQUxFTkRBUl9ST1dfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3Jvd2A7XHJcbmNvbnN0IENBTEVOREFSX0NFTExfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2NlbGxgO1xyXG5jb25zdCBDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTUyA9IGAke0NBTEVOREFSX0NFTExfQ0xBU1N9LS1jZW50ZXItaXRlbXNgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9MQUJFTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtbGFiZWxgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF5LW9mLXdlZWtgO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVIgPSBgLiR7REFURV9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfQlVUVE9OID0gYC4ke0RBVEVfUElDS0VSX0JVVFRPTl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9DQUxFTkRBUiA9IGAuJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9TVEFUVVMgPSBgLiR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0dVSURFID0gYC4ke0RBVEVfUElDS0VSX0dVSURFX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEUgPSBgLiR7Q0FMRU5EQVJfREFURV9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USCA9IGAuJHtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUiA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUiA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USCA9IGAuJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTiA9IGAuJHtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEggPSBgLiR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUElDS0VSID0gYC4ke0NBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1N9YDtcclxuXHJcbmxldCB0ZXh0ID0ge1xyXG4gIFwib3Blbl9jYWxlbmRhclwiOiBcIsOFYm4ga2FsZW5kZXJcIixcclxuICBcImNob29zZV9hX2RhdGVcIjogXCJWw6ZsZyBlbiBkYXRvXCIsXHJcbiAgXCJjaG9vc2VfYV9kYXRlX2JldHdlZW5cIjogXCJWw6ZsZyBlbiBkYXRvIG1lbGxlbSB7bWluRGF5fS4ge21pbk1vbnRoU3RyfSB7bWluWWVhcn0gb2cge21heERheX0uIHttYXhNb250aFN0cn0ge21heFllYXJ9XCIsXHJcbiAgXCJjaG9vc2VfYV9kYXRlX2JlZm9yZVwiOiBcIlbDpmxnIGVuIGRhdG8uIERlciBrYW4gdsOmbGdlcyBpbmR0aWwge21heERheX0uIHttYXhNb250aFN0cn0ge21heFllYXJ9LlwiLFxyXG4gIFwiY2hvb3NlX2FfZGF0ZV9hZnRlclwiOiBcIlbDpmxnIGVuIGRhdG8uIERlciBrYW4gdsOmbGdlcyBmcmEge21pbkRheX0uIHttaW5Nb250aFN0cn0ge21pblllYXJ9IG9nIGZyZW1hZC5cIixcclxuICBcImFyaWFfbGFiZWxfZGF0ZVwiOiBcIntkYXlTdHJ9IGRlbiB7ZGF5fS4ge21vbnRoU3RyfSB7eWVhcn1cIixcclxuICBcImN1cnJlbnRfbW9udGhfZGlzcGxheWVkXCI6IFwiVmlzZXIge21vbnRoTGFiZWx9IHtmb2N1c2VkWWVhcn1cIixcclxuICBcImZpcnN0X3Bvc3NpYmxlX2RhdGVcIjogXCJGw7hyc3RlIHZhbGdiYXJlIGRhdG9cIixcclxuICBcImxhc3RfcG9zc2libGVfZGF0ZVwiOiBcIlNpZHN0ZSB2YWxnYmFyZSBkYXRvXCIsXHJcbiAgXCJwcmV2aW91c195ZWFyXCI6IFwiTmF2aWfDqXIgw6l0IMOlciB0aWxiYWdlXCIsXHJcbiAgXCJwcmV2aW91c19tb250aFwiOiBcIk5hdmlnw6lyIMOpbiBtw6VuZWQgdGlsYmFnZVwiLFxyXG4gIFwibmV4dF9tb250aFwiOiBcIk5hdmlnw6lyIMOpbiBtw6VuZWQgZnJlbVwiLFxyXG4gIFwibmV4dF95ZWFyXCI6IFwiTmF2aWfDqXIgw6l0IMOlciBmcmVtXCIsXHJcbiAgXCJzZWxlY3RfbW9udGhcIjogXCJWw6ZsZyBtw6VuZWRcIixcclxuICBcInNlbGVjdF95ZWFyXCI6IFwiVsOmbGcgw6VyXCIsXHJcbiAgXCJwcmV2aW91c195ZWFyc1wiOiBcIk5hdmlnw6lyIHt5ZWFyc30gw6VyIHRpbGJhZ2VcIixcclxuICBcIm5leHRfeWVhcnNcIjogXCJOYXZpZ8OpciB7eWVhcnN9IMOlciBmcmVtXCIsXHJcbiAgXCJndWlkZVwiOiBcIk5hdmlnZXJlciBkdSBtZWQgdGFzdGF0dXIsIGthbiBkdSBza2lmdGUgZGFnIG1lZCBow7hqcmUgb2cgdmVuc3RyZSBwaWxldGFzdGVyLCB1Z2VyIG1lZCBvcCBvZyBuZWQgcGlsZXRhc3RlciwgbcOlbmVkZXIgbWVkIHBhZ2UgdXAgb2cgcGFnZSBkb3duLXRhc3Rlcm5lIG9nIMOlciBtZWQgc2hpZnQtdGFzdGVuIHBsdXMgcGFnZSB1cCBlbGxlciBwYWdlIGRvd24uIEhvbWUgb2cgZW5kLXRhc3RlbiBuYXZpZ2VyZXIgdGlsIHN0YXJ0IGVsbGVyIHNsdXRuaW5nIGFmIGVuIHVnZS5cIixcclxuICBcIm1vbnRoc19kaXNwbGF5ZWRcIjogXCJWw6ZsZyBlbiBtw6VuZWRcIixcclxuICBcInllYXJzX2Rpc3BsYXllZFwiOiBcIlZpc2VyIMOlciB7c3RhcnR9IHRpbCB7ZW5kfS4gVsOmbGcgZXQgw6VyLlwiLFxyXG4gIFwiamFudWFyeVwiOiBcImphbnVhclwiLFxyXG4gIFwiZmVicnVhcnlcIjogXCJmZWJydWFyXCIsXHJcbiAgXCJtYXJjaFwiOiBcIm1hcnRzXCIsXHJcbiAgXCJhcHJpbFwiOiBcImFwcmlsXCIsXHJcbiAgXCJtYXlcIjogXCJtYWpcIixcclxuICBcImp1bmVcIjogXCJqdW5pXCIsXHJcbiAgXCJqdWx5XCI6IFwianVsaVwiLFxyXG4gIFwiYXVndXN0XCI6IFwiYXVndXN0XCIsXHJcbiAgXCJzZXB0ZW1iZXJcIjogXCJzZXB0ZW1iZXJcIixcclxuICBcIm9jdG9iZXJcIjogXCJva3RvYmVyXCIsXHJcbiAgXCJub3ZlbWJlclwiOiBcIm5vdmVtYmVyXCIsXHJcbiAgXCJkZWNlbWJlclwiOiBcImRlY2VtYmVyXCIsXHJcbiAgXCJtb25kYXlcIjogXCJtYW5kYWdcIixcclxuICBcInR1ZXNkYXlcIjogXCJ0aXJzZGFnXCIsXHJcbiAgXCJ3ZWRuZXNkYXlcIjogXCJvbnNkYWdcIixcclxuICBcInRodXJzZGF5XCI6IFwidG9yc2RhZ1wiLFxyXG4gIFwiZnJpZGF5XCI6IFwiZnJlZGFnXCIsXHJcbiAgXCJzYXR1cmRheVwiOiBcImzDuHJkYWdcIixcclxuICBcInN1bmRheVwiOiBcInPDuG5kYWdcIlxyXG59XHJcblxyXG5jb25zdCBWQUxJREFUSU9OX01FU1NBR0UgPSBcIkluZHRhc3QgdmVubGlnc3QgZW4gZ3lsZGlnIGRhdG9cIjtcclxuXHJcbmxldCBNT05USF9MQUJFTFMgPSBbXHJcbiAgdGV4dC5qYW51YXJ5LFxyXG4gIHRleHQuZmVicnVhcnksXHJcbiAgdGV4dC5tYXJjaCxcclxuICB0ZXh0LmFwcmlsLFxyXG4gIHRleHQubWF5LFxyXG4gIHRleHQuanVuZSxcclxuICB0ZXh0Lmp1bHksXHJcbiAgdGV4dC5hdWd1c3QsXHJcbiAgdGV4dC5zZXB0ZW1iZXIsXHJcbiAgdGV4dC5vY3RvYmVyLFxyXG4gIHRleHQubm92ZW1iZXIsXHJcbiAgdGV4dC5kZWNlbWJlclxyXG5dO1xyXG5cclxubGV0IERBWV9PRl9XRUVLX0xBQkVMUyA9IFtcclxuICB0ZXh0Lm1vbmRheSxcclxuICB0ZXh0LnR1ZXNkYXksXHJcbiAgdGV4dC53ZWRuZXNkYXksXHJcbiAgdGV4dC50aHVyc2RheSxcclxuICB0ZXh0LmZyaWRheSxcclxuICB0ZXh0LnNhdHVyZGF5LFxyXG4gIHRleHQuc3VuZGF5XHJcbl07XHJcblxyXG5jb25zdCBFTlRFUl9LRVlDT0RFID0gMTM7XHJcblxyXG5jb25zdCBZRUFSX0NIVU5LID0gMTI7XHJcblxyXG5jb25zdCBERUZBVUxUX01JTl9EQVRFID0gXCIwMDAwLTAxLTAxXCI7XHJcbmNvbnN0IERBVEVfRk9STUFUX09QVElPTl8xID0gXCJERC9NTS9ZWVlZXCI7XHJcbmNvbnN0IERBVEVfRk9STUFUX09QVElPTl8yID0gXCJERC1NTS1ZWVlZXCI7XHJcbmNvbnN0IERBVEVfRk9STUFUX09QVElPTl8zID0gXCJERC5NTS5ZWVlZXCI7XHJcbmNvbnN0IERBVEVfRk9STUFUX09QVElPTl80ID0gXCJERCBNTSBZWVlZXCI7XHJcbmNvbnN0IERBVEVfRk9STUFUX09QVElPTl81ID0gXCJERC9NTS1ZWVlZXCI7XHJcbmNvbnN0IElOVEVSTkFMX0RBVEVfRk9STUFUID0gXCJZWVlZLU1NLUREXCI7XHJcblxyXG5jb25zdCBOT1RfRElTQUJMRURfU0VMRUNUT1IgPSBcIjpub3QoW2Rpc2FibGVkXSlcIjtcclxuXHJcbmNvbnN0IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMgPSAoLi4uc2VsZWN0b3JzKSA9PlxyXG4gIHNlbGVjdG9ycy5tYXAoKHF1ZXJ5KSA9PiBxdWVyeSArIE5PVF9ESVNBQkxFRF9TRUxFQ1RPUikuam9pbihcIiwgXCIpO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSLFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX01PTlRILFxyXG4gIENBTEVOREFSX1lFQVJfU0VMRUNUSU9OLFxyXG4gIENBTEVOREFSX01PTlRIX1NFTEVDVElPTixcclxuICBDQUxFTkRBUl9ORVhUX1lFQVIsXHJcbiAgQ0FMRU5EQVJfTkVYVF9NT05USCxcclxuICBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURcclxuKTtcclxuXHJcbmNvbnN0IE1PTlRIX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX01PTlRIX0ZPQ1VTRURcclxuKTtcclxuXHJcbmNvbnN0IFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyxcclxuICBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTkssXHJcbiAgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEXHJcbik7XHJcblxyXG4vLyAjcmVnaW9uIERhdGUgTWFuaXB1bGF0aW9uIEZ1bmN0aW9uc1xyXG5cclxuLyoqXHJcbiAqIEtlZXAgZGF0ZSB3aXRoaW4gbW9udGguIE1vbnRoIHdvdWxkIG9ubHkgYmUgb3ZlciBieSAxIHRvIDMgZGF5c1xyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVUb0NoZWNrIHRoZSBkYXRlIG9iamVjdCB0byBjaGVja1xyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggdGhlIGNvcnJlY3QgbW9udGhcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBkYXRlLCBjb3JyZWN0ZWQgaWYgbmVlZGVkXHJcbiAqL1xyXG5jb25zdCBrZWVwRGF0ZVdpdGhpbk1vbnRoID0gKGRhdGVUb0NoZWNrLCBtb250aCkgPT4ge1xyXG4gIGlmIChtb250aCAhPT0gZGF0ZVRvQ2hlY2suZ2V0TW9udGgoKSkge1xyXG4gICAgZGF0ZVRvQ2hlY2suc2V0RGF0ZSgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlVG9DaGVjaztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSBmcm9tIG1vbnRoIGRheSB5ZWFyXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggdGhlIG1vbnRoIHRvIHNldCAoemVyby1pbmRleGVkKVxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBzZXQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0RGF0ZSA9ICh5ZWFyLCBtb250aCwgZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKHllYXIsIG1vbnRoLCBkYXRlKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiB0b2RheXMgZGF0ZVxyXG4gKlxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdG9kYXlzIGRhdGVcclxuICovXHJcbmNvbnN0IHRvZGF5ID0gKCkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGNvbnN0IGRheSA9IG5ld0RhdGUuZ2V0RGF0ZSgpO1xyXG4gIGNvbnN0IG1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xyXG4gIGNvbnN0IHllYXIgPSBuZXdEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgcmV0dXJuIHNldERhdGUoeWVhciwgbW9udGgsIGRheSk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gZmlyc3QgZGF5IG9mIHRoZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdGFydE9mTW9udGggPSAoZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCAxKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byBsYXN0IGRheSBvZiB0aGUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgbGFzdERheU9mTW9udGggPSAoZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpICsgMSwgMCk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIGRheXMgdG8gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtRGF5cyB0aGUgZGlmZmVyZW5jZSBpbiBkYXlzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkRGF5cyA9IChfZGF0ZSwgbnVtRGF5cykgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG4gIG5ld0RhdGUuc2V0RGF0ZShuZXdEYXRlLmdldERhdGUoKSArIG51bURheXMpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IGRheXMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIHRoZSBkaWZmZXJlbmNlIGluIGRheXNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJEYXlzID0gKF9kYXRlLCBudW1EYXlzKSA9PiBhZGREYXlzKF9kYXRlLCAtbnVtRGF5cyk7XHJcblxyXG4vKipcclxuICogQWRkIHdlZWtzIHRvIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkV2Vla3MgPSAoX2RhdGUsIG51bVdlZWtzKSA9PiBhZGREYXlzKF9kYXRlLCBudW1XZWVrcyAqIDcpO1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IHdlZWtzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZFdlZWtzKF9kYXRlLCAtbnVtV2Vla3MpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgd2VlayAoTW9uZGF5KVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN0YXJ0T2ZXZWVrID0gKF9kYXRlKSA9PiB7XHJcbiAgbGV0IGRheU9mV2VlayA9IF9kYXRlLmdldERheSgpLTE7XHJcbiAgaWYoZGF5T2ZXZWVrID09PSAtMSl7XHJcbiAgICBkYXlPZldlZWsgPSA2O1xyXG4gIH1cclxuICByZXR1cm4gc3ViRGF5cyhfZGF0ZSwgZGF5T2ZXZWVrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byB0aGUgZW5kIG9mIHRoZSB3ZWVrIChTdW5kYXkpXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGVuZE9mV2VlayA9IChfZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IGRheU9mV2VlayA9IF9kYXRlLmdldERheSgpO1xyXG4gIHJldHVybiBhZGREYXlzKF9kYXRlLCA3IC0gZGF5T2ZXZWVrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9udGhzIHRvIGRhdGUgYW5kIGtlZXAgZGF0ZSB3aXRoaW4gbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bU1vbnRocyB0aGUgZGlmZmVyZW5jZSBpbiBtb250aHNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRNb250aHMgPSAoX2RhdGUsIG51bU1vbnRocykgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBjb25zdCBkYXRlTW9udGggPSAobmV3RGF0ZS5nZXRNb250aCgpICsgMTIgKyBudW1Nb250aHMpICUgMTI7XHJcbiAgbmV3RGF0ZS5zZXRNb250aChuZXdEYXRlLmdldE1vbnRoKCkgKyBudW1Nb250aHMpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgZGF0ZU1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgbW9udGhzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1Yk1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiBhZGRNb250aHMoX2RhdGUsIC1udW1Nb250aHMpO1xyXG5cclxuLyoqXHJcbiAqIEFkZCB5ZWFycyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1ZZWFycyB0aGUgZGlmZmVyZW5jZSBpbiB5ZWFyc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZFllYXJzID0gKF9kYXRlLCBudW1ZZWFycykgPT4gYWRkTW9udGhzKF9kYXRlLCBudW1ZZWFycyAqIDEyKTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCB5ZWFycyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRZZWFycyhfZGF0ZSwgLW51bVllYXJzKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgbW9udGhzIG9mIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHplcm8taW5kZXhlZCBtb250aCB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXRNb250aCA9IChfZGF0ZSwgbW9udGgpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuXHJcbiAgbmV3RGF0ZS5zZXRNb250aChtb250aCk7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBtb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCB5ZWFyIG9mIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXIgdGhlIHllYXIgdG8gc2V0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0WWVhciA9IChfZGF0ZSwgeWVhcikgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBjb25zdCBtb250aCA9IG5ld0RhdGUuZ2V0TW9udGgoKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKHllYXIpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGVhcmxpZXN0IGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBlYXJsaWVzdCBkYXRlXHJcbiAqL1xyXG5jb25zdCBtaW4gPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcclxuXHJcbiAgaWYgKGRhdGVCIDwgZGF0ZUEpIHtcclxuICAgIG5ld0RhdGUgPSBkYXRlQjtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSBsYXRlc3QgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGxhdGVzdCBkYXRlXHJcbiAqL1xyXG5jb25zdCBtYXggPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcclxuXHJcbiAgaWYgKGRhdGVCID4gZGF0ZUEpIHtcclxuICAgIG5ld0RhdGUgPSBkYXRlQjtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgYXJlIHRoZSBpbiB0aGUgc2FtZSB5ZWFyXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgaW4gdGhlIHNhbWUgeWVhclxyXG4gKi9cclxuY29uc3QgaXNTYW1lWWVhciA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICByZXR1cm4gZGF0ZUEgJiYgZGF0ZUIgJiYgZGF0ZUEuZ2V0RnVsbFllYXIoKSA9PT0gZGF0ZUIuZ2V0RnVsbFllYXIoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgaW4gdGhlIHNhbWUgbW9udGhcclxuICovXHJcbmNvbnN0IGlzU2FtZU1vbnRoID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBpc1NhbWVZZWFyKGRhdGVBLCBkYXRlQikgJiYgZGF0ZUEuZ2V0TW9udGgoKSA9PT0gZGF0ZUIuZ2V0TW9udGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIHNhbWUgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIHRoZSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiB0aGUgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgdGhlIHNhbWUgZGF0ZVxyXG4gKi9cclxuY29uc3QgaXNTYW1lRGF5ID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBpc1NhbWVNb250aChkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldERhdGUoKSA9PT0gZGF0ZUIuZ2V0RGF0ZSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHJldHVybiBhIG5ldyBkYXRlIHdpdGhpbiBtaW5pbXVtIGFuZCBtYXhpbXVtIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZGF0ZSBiZXR3ZWVuIG1pbiBhbmQgbWF4XHJcbiAqL1xyXG5jb25zdCBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIGxldCBuZXdEYXRlID0gZGF0ZTtcclxuXHJcbiAgaWYgKGRhdGUgPCBtaW5EYXRlKSB7XHJcbiAgICBuZXdEYXRlID0gbWluRGF0ZTtcclxuICB9IGVsc2UgaWYgKG1heERhdGUgJiYgZGF0ZSA+IG1heERhdGUpIHtcclxuICAgIG5ld0RhdGUgPSBtYXhEYXRlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBpcyB2YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZXJlIGEgZGF5IHdpdGhpbiB0aGUgbW9udGggd2l0aGluIG1pbiBhbmQgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVXaXRoaW5NaW5BbmRNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT5cclxuICBkYXRlID49IG1pbkRhdGUgJiYgKCFtYXhEYXRlIHx8IGRhdGUgPD0gbWF4RGF0ZSk7XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgbW9udGggaXMgaW52YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZSBtb250aCBvdXRzaWRlIG1pbiBvciBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGxhc3REYXlPZk1vbnRoKGRhdGUpIDwgbWluRGF0ZSB8fCAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoZGF0ZSkgPiBtYXhEYXRlKVxyXG4gICk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgeWVhciBpcyBpbnZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBsYXN0RGF5T2ZNb250aChzZXRNb250aChkYXRlLCAxMSkpIDwgbWluRGF0ZSB8fFxyXG4gICAgKG1heERhdGUgJiYgc3RhcnRPZk1vbnRoKHNldE1vbnRoKGRhdGUsIDApKSA+IG1heERhdGUpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQYXJzZSBhIGRhdGUgd2l0aCBmb3JtYXQgRC1NLVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIHRoZSBkYXRlIHN0cmluZyB0byBwYXJzZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFkanVzdERhdGUgc2hvdWxkIHRoZSBkYXRlIGJlIGFkanVzdGVkXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgcGFyc2VkIGRhdGVcclxuICovXHJcbmNvbnN0IHBhcnNlRGF0ZVN0cmluZyA9IChcclxuICBkYXRlU3RyaW5nLFxyXG4gIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCxcclxuICBhZGp1c3REYXRlID0gZmFsc2VcclxuKSA9PiB7XHJcbiAgbGV0IGRhdGU7XHJcbiAgbGV0IG1vbnRoO1xyXG4gIGxldCBkYXk7XHJcbiAgbGV0IHllYXI7XHJcbiAgbGV0IHBhcnNlZDtcclxuXHJcbiAgaWYgKGRhdGVTdHJpbmcpIHtcclxuICAgIGxldCBtb250aFN0ciwgZGF5U3RyLCB5ZWFyU3RyO1xyXG4gICAgaWYgKGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8xIHx8IGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8yIHx8IGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8zIHx8IGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl80IHx8IGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl81KSB7XHJcbiAgICAgIFtkYXlTdHIsIG1vbnRoU3RyLCB5ZWFyU3RyXSA9IGRhdGVTdHJpbmcuc3BsaXQoLy18XFwufFxcL3xcXHMvKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFt5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyXSA9IGRhdGVTdHJpbmcuc3BsaXQoXCItXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh5ZWFyU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KHllYXJTdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgIHllYXIgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIHllYXIgPSBNYXRoLm1heCgwLCB5ZWFyKTtcclxuICAgICAgICAgIGlmICh5ZWFyU3RyLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSB0b2RheSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyU3R1YiA9XHJcbiAgICAgICAgICAgICAgY3VycmVudFllYXIgLSAoY3VycmVudFllYXIgJSAxMCAqKiB5ZWFyU3RyLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHllYXIgPSBjdXJyZW50WWVhclN0dWIgKyBwYXJzZWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KG1vbnRoU3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBtb250aCA9IHBhcnNlZDtcclxuICAgICAgICBpZiAoYWRqdXN0RGF0ZSkge1xyXG4gICAgICAgICAgbW9udGggPSBNYXRoLm1heCgxLCBtb250aCk7XHJcbiAgICAgICAgICBtb250aCA9IE1hdGgubWluKDEyLCBtb250aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheVN0ciAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgcGFyc2VkID0gcGFyc2VJbnQoZGF5U3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBkYXkgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIGNvbnN0IGxhc3REYXlPZlRoZU1vbnRoID0gc2V0RGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgZGF5ID0gTWF0aC5tYXgoMSwgZGF5KTtcclxuICAgICAgICAgIGRheSA9IE1hdGgubWluKGxhc3REYXlPZlRoZU1vbnRoLCBkYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIGRhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvcm1hdCBhIGRhdGUgdG8gZm9ybWF0IERELU1NLVlZWVlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIHRoZSBkYXRlIHRvIGZvcm1hdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZm9ybWF0dGVkIGRhdGUgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCBmb3JtYXREYXRlID0gKGRhdGUsIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCkgPT4ge1xyXG4gIGNvbnN0IHBhZFplcm9zID0gKHZhbHVlLCBsZW5ndGgpID0+IHtcclxuICAgIHJldHVybiBgMDAwMCR7dmFsdWV9YC5zbGljZSgtbGVuZ3RoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgaWYgKGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl8xKSB7XHJcbiAgICByZXR1cm4gW3BhZFplcm9zKGRheSwgMiksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCIvXCIpO1xyXG4gIH1cclxuICBlbHNlIGlmIChkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fMikge1xyXG4gICAgcmV0dXJuIFtwYWRaZXJvcyhkYXksIDIpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKHllYXIsIDQpXS5qb2luKFwiLVwiKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoZGF0ZUZvcm1hdCA9PT0gREFURV9GT1JNQVRfT1BUSU9OXzMpIHtcclxuICAgIHJldHVybiBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIi5cIik7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGRhdGVGb3JtYXQgPT09IERBVEVfRk9STUFUX09QVElPTl80KSB7XHJcbiAgICByZXR1cm4gW3BhZFplcm9zKGRheSwgMiksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCIgXCIpO1xyXG4gIH1cclxuICBlbHNlIGlmIChkYXRlRm9ybWF0ID09PSBEQVRFX0ZPUk1BVF9PUFRJT05fNSkge1xyXG4gICAgbGV0IHRlbXBEYXlNb250aCA9IFtwYWRaZXJvcyhkYXksIDIpLCBwYWRaZXJvcyhtb250aCwgMildLmpvaW4oXCIvXCIpO1xyXG4gICAgcmV0dXJuIFt0ZW1wRGF5TW9udGgsIHBhZFplcm9zKHllYXIsIDQpXS5qb2luKFwiLVwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBbcGFkWmVyb3MoeWVhciwgNCksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoZGF5LCAyKV0uam9pbihcIi1cIik7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIERhdGUgTWFuaXB1bGF0aW9uIEZ1bmN0aW9uc1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIGdyaWQgc3RyaW5nIGZyb20gYW4gYXJyYXkgb2YgaHRtbCBzdHJpbmdzXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IGh0bWxBcnJheSB0aGUgYXJyYXkgb2YgaHRtbCBpdGVtc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gcm93U2l6ZSB0aGUgbGVuZ3RoIG9mIGEgcm93XHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBncmlkIHN0cmluZ1xyXG4gKi9cclxuY29uc3QgbGlzdFRvR3JpZEh0bWwgPSAoaHRtbEFycmF5LCByb3dTaXplKSA9PiB7XHJcbiAgY29uc3QgZ3JpZCA9IFtdO1xyXG4gIGxldCByb3cgPSBbXTtcclxuXHJcbiAgbGV0IGkgPSAwO1xyXG4gIHdoaWxlIChpIDwgaHRtbEFycmF5Lmxlbmd0aCkge1xyXG4gICAgcm93ID0gW107XHJcbiAgICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGggJiYgcm93Lmxlbmd0aCA8IHJvd1NpemUpIHtcclxuICAgICAgcm93LnB1c2goYDx0ZD4ke2h0bWxBcnJheVtpXX08L3RkPmApO1xyXG4gICAgICBpICs9IDE7XHJcbiAgICB9XHJcbiAgICBncmlkLnB1c2goYDx0cj4ke3Jvdy5qb2luKFwiXCIpfTwvdHI+YCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ3JpZC5qb2luKFwiXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHNldCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQgYW5kIGRpc3BhdGNoIGEgY2hhbmdlIGV2ZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gZWwgVGhlIGVsZW1lbnQgdG8gdXBkYXRlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCBjaGFuZ2VFbGVtZW50VmFsdWUgPSAoZWwsIHZhbHVlID0gXCJcIikgPT4ge1xyXG4gIGNvbnN0IGVsZW1lbnRUb0NoYW5nZSA9IGVsO1xyXG4gIGVsZW1lbnRUb0NoYW5nZS52YWx1ZSA9IHZhbHVlO1xyXG5cclxuXHJcbiAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KCdjaGFuZ2UnKTtcclxuICBlbGVtZW50VG9DaGFuZ2UuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhlIHByb3BlcnRpZXMgYW5kIGVsZW1lbnRzIHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIuXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IERhdGVQaWNrZXJDb250ZXh0XHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGNhbGVuZGFyRWxcclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZGF0ZVBpY2tlckVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGRpYWxvZ0VsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTElucHV0RWxlbWVudH0gaW50ZXJuYWxJbnB1dEVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTElucHV0RWxlbWVudH0gZXh0ZXJuYWxJbnB1dEVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IHN0YXR1c0VsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGd1aWRlRWxcclxuICogQHByb3BlcnR5IHtIVE1MRGl2RWxlbWVudH0gZmlyc3RZZWFyQ2h1bmtFbFxyXG4gKiBAcHJvcGVydHkge0RhdGV9IGNhbGVuZGFyRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IG1pbkRhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBtYXhEYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gc2VsZWN0ZWREYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gcmFuZ2VEYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gZGVmYXVsdERhdGVcclxuICovXHJcblxyXG4vKipcclxuICogR2V0IGFuIG9iamVjdCBvZiB0aGUgcHJvcGVydGllcyBhbmQgZWxlbWVudHMgYmVsb25naW5nIGRpcmVjdGx5IHRvIHRoZSBnaXZlblxyXG4gKiBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRoZSBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXJcclxuICogQHJldHVybnMge0RhdGVQaWNrZXJDb250ZXh0fSBlbGVtZW50c1xyXG4gKi9cclxuY29uc3QgZ2V0RGF0ZVBpY2tlckNvbnRleHQgPSAoZWwpID0+IHtcclxuICBjb25zdCBkYXRlUGlja2VyRWwgPSBlbC5jbG9zZXN0KERBVEVfUElDS0VSKTtcclxuXHJcbiAgaWYgKCFkYXRlUGlja2VyRWwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBpcyBtaXNzaW5nIG91dGVyICR7REFURV9QSUNLRVJ9YCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBpbnRlcm5hbElucHV0RWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihcclxuICAgIERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUXHJcbiAgKTtcclxuICBjb25zdCBleHRlcm5hbElucHV0RWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihcclxuICAgIERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXHJcbiAgKTtcclxuICBjb25zdCBjYWxlbmRhckVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfQ0FMRU5EQVIpO1xyXG4gIGNvbnN0IHRvZ2dsZUJ0bkVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfQlVUVE9OKTtcclxuICBjb25zdCBzdGF0dXNFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX1NUQVRVUyk7XHJcbiAgY29uc3QgZ3VpZGVFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0dVSURFKTtcclxuICBjb25zdCBmaXJzdFllYXJDaHVua0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUik7XHJcbiAgY29uc3QgZGlhbG9nRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9ESUFMT0dfV1JBUFBFUik7XHJcblxyXG4gIC8vIFNldCBkYXRlIGZvcm1hdFxyXG4gIGxldCBzZWxlY3RlZERhdGVGb3JtYXQgPSBEQVRFX0ZPUk1BVF9PUFRJT05fMTtcclxuICBpZiAoZGF0ZVBpY2tlckVsLmhhc0F0dHJpYnV0ZShcImRhdGEtZGF0ZWZvcm1hdFwiKSkge1xyXG4gICAgc3dpdGNoIChkYXRlUGlja2VyRWwuZGF0YXNldC5kYXRlZm9ybWF0KSB7XHJcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzE6XHJcbiAgICAgICAgc2VsZWN0ZWREYXRlRm9ybWF0ID0gREFURV9GT1JNQVRfT1BUSU9OXzE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzI6XHJcbiAgICAgICAgc2VsZWN0ZWREYXRlRm9ybWF0ID0gREFURV9GT1JNQVRfT1BUSU9OXzI7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzM6XHJcbiAgICAgICAgc2VsZWN0ZWREYXRlRm9ybWF0ID0gREFURV9GT1JNQVRfT1BUSU9OXzM7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzQ6XHJcbiAgICAgICAgc2VsZWN0ZWREYXRlRm9ybWF0ID0gREFURV9GT1JNQVRfT1BUSU9OXzQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgREFURV9GT1JNQVRfT1BUSU9OXzU6XHJcbiAgICAgICAgc2VsZWN0ZWREYXRlRm9ybWF0ID0gREFURV9GT1JNQVRfT1BUSU9OXzU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNvbnN0IGRhdGVGb3JtYXRPcHRpb24gPSBzZWxlY3RlZERhdGVGb3JtYXQ7IFxyXG5cclxuICBjb25zdCBpbnB1dERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBleHRlcm5hbElucHV0RWwudmFsdWUsXHJcbiAgICBkYXRlRm9ybWF0T3B0aW9uLFxyXG4gICAgdHJ1ZVxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGludGVybmFsSW5wdXRFbC52YWx1ZSk7XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhjYWxlbmRhckVsLmRhdGFzZXQudmFsdWUpO1xyXG4gIGNvbnN0IG1pbkRhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSk7XHJcbiAgY29uc3QgbWF4RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlKTtcclxuICBjb25zdCByYW5nZURhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQucmFuZ2VEYXRlKTtcclxuICBjb25zdCBkZWZhdWx0RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5kZWZhdWx0RGF0ZSk7XHJcblxyXG4gIGlmIChtaW5EYXRlICYmIG1heERhdGUgJiYgbWluRGF0ZSA+IG1heERhdGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIk1pbmltdW0gZGF0ZSBjYW5ub3QgYmUgYWZ0ZXIgbWF4aW11bSBkYXRlXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNhbGVuZGFyRGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICB0b2dnbGVCdG5FbCxcclxuICAgIGRpYWxvZ0VsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIGZpcnN0WWVhckNodW5rRWwsXHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBpbnB1dERhdGUsXHJcbiAgICBpbnRlcm5hbElucHV0RWwsXHJcbiAgICBleHRlcm5hbElucHV0RWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgcmFuZ2VEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgICBzdGF0dXNFbCxcclxuICAgIGd1aWRlRWwsXHJcbiAgICBkYXRlRm9ybWF0T3B0aW9uXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEaXNhYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzYWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICB0b2dnbGVCdG5FbC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmRpc2FibGVkID0gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbmFibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBlbmFibGUgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCwgdG9nZ2xlQnRuRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgdG9nZ2xlQnRuRWwuZGlzYWJsZWQgPSBmYWxzZTtcclxuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcclxufTtcclxuXHJcbi8vICNyZWdpb24gVmFsaWRhdGlvblxyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgYXMgYSB2YWxpZCBkYXRlIG9mIGZvcm1hdCBEL00vWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBpc0RhdGVJbnB1dEludmFsaWQgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBkYXRlU3RyaW5nID0gZXh0ZXJuYWxJbnB1dEVsLnZhbHVlO1xyXG4gIGxldCBpc0ludmFsaWQgPSBmYWxzZTtcclxuXHJcbiAgaWYgKGRhdGVTdHJpbmcpIHtcclxuICAgIGlzSW52YWxpZCA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgZGF0ZVN0cmluZ1BhcnRzID0gZGF0ZVN0cmluZy5zcGxpdCgvLXxcXC58XFwvfFxccy8pO1xyXG4gICAgY29uc3QgW2RheSwgbW9udGgsIHllYXJdID0gZGF0ZVN0cmluZ1BhcnRzLm1hcCgoc3RyKSA9PiB7XHJcbiAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoc3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHZhbHVlID0gcGFyc2VkO1xyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobW9udGggJiYgZGF5ICYmIHllYXIgIT0gbnVsbCkge1xyXG4gICAgICBjb25zdCBjaGVja0RhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBjaGVja0RhdGUuZ2V0TW9udGgoKSA9PT0gbW9udGggLSAxICYmXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldERhdGUoKSA9PT0gZGF5ICYmXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldEZ1bGxZZWFyKCkgPT09IHllYXIgJiZcclxuICAgICAgICBkYXRlU3RyaW5nUGFydHNbMl0ubGVuZ3RoID09PSA0ICYmXHJcbiAgICAgICAgaXNEYXRlV2l0aGluTWluQW5kTWF4KGNoZWNrRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgaXNJbnZhbGlkID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBpc0ludmFsaWQ7XHJcbn07XHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IE0vRC9ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHZhbGlkYXRlRGF0ZUlucHV0ID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCBpc0ludmFsaWQgPSBpc0RhdGVJbnB1dEludmFsaWQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuXHJcbiAgaWYgKGlzSW52YWxpZCAmJiAhZXh0ZXJuYWxJbnB1dEVsLnZhbGlkYXRpb25NZXNzYWdlKSB7XHJcbiAgICBleHRlcm5hbElucHV0RWwuc2V0Q3VzdG9tVmFsaWRpdHkoVkFMSURBVElPTl9NRVNTQUdFKTtcclxuICB9XHJcblxyXG4gIGlmICghaXNJbnZhbGlkICYmIGV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSA9PT0gVkFMSURBVElPTl9NRVNTQUdFKSB7XHJcbiAgICBleHRlcm5hbElucHV0RWwuc2V0Q3VzdG9tVmFsaWRpdHkoXCJcIik7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBWYWxpZGF0aW9uXHJcblxyXG4vKipcclxuICogRW5hYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgcmVjb25jaWxlSW5wdXRWYWx1ZXMgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGludGVybmFsSW5wdXRFbCwgaW5wdXREYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgbGV0IG5ld1ZhbHVlID0gXCJcIjtcclxuXHJcbiAgaWYgKGlucHV0RGF0ZSAmJiAhaXNEYXRlSW5wdXRJbnZhbGlkKGVsKSkge1xyXG4gICAgbmV3VmFsdWUgPSBmb3JtYXREYXRlKGlucHV0RGF0ZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLnZhbHVlICE9PSBuZXdWYWx1ZSkge1xyXG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGludGVybmFsSW5wdXRFbCwgbmV3VmFsdWUpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgdGhlIHZhbHVlIG9mIHRoZSBkYXRlIHBpY2tlciBpbnB1dHMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVTdHJpbmcgVGhlIGRhdGUgc3RyaW5nIHRvIHVwZGF0ZSBpbiBZWVlZLU1NLUREIGZvcm1hdFxyXG4gKi9cclxuY29uc3Qgc2V0Q2FsZW5kYXJWYWx1ZSA9IChlbCwgZGF0ZVN0cmluZykgPT4ge1xyXG4gIGNvbnN0IHBhcnNlZERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVN0cmluZyk7XHJcblxyXG4gIGlmIChwYXJzZWREYXRlKSB7XHJcbiAgICBcclxuICAgIGNvbnN0IHtcclxuICAgICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgICBpbnRlcm5hbElucHV0RWwsXHJcbiAgICAgIGV4dGVybmFsSW5wdXRFbCxcclxuICAgICAgZGF0ZUZvcm1hdE9wdGlvblxyXG4gICAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShwYXJzZWREYXRlLCBkYXRlRm9ybWF0T3B0aW9uKTtcclxuXHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBkYXRlU3RyaW5nKTtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShleHRlcm5hbElucHV0RWwsIGZvcm1hdHRlZERhdGUpO1xyXG5cclxuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGRhdGVQaWNrZXJFbCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuaGFuY2UgYW4gaW5wdXQgd2l0aCB0aGUgZGF0ZSBwaWNrZXIgZWxlbWVudHNcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgVGhlIGluaXRpYWwgd3JhcHBpbmcgZWxlbWVudCBvZiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBlbmhhbmNlRGF0ZVBpY2tlciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHRWYWx1ZTtcclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoYGlucHV0YCk7XHJcblxyXG4gIGlmICghaW50ZXJuYWxJbnB1dEVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7REFURV9QSUNLRVJ9IGlzIG1pc3NpbmcgaW5uZXIgaW5wdXRgKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IG1pbkRhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlIHx8IGludGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtaW5cIilcclxuICApO1xyXG4gIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUgPSBtaW5EYXRlXHJcbiAgICA/IGZvcm1hdERhdGUobWluRGF0ZSlcclxuICAgIDogREVGQVVMVF9NSU5fREFURTtcclxuXHJcbiAgY29uc3QgbWF4RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUgfHwgaW50ZXJuYWxJbnB1dEVsLmdldEF0dHJpYnV0ZShcIm1heFwiKVxyXG4gICk7XHJcbiAgaWYgKG1heERhdGUpIHtcclxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUgPSBmb3JtYXREYXRlKG1heERhdGUpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2FsZW5kYXJXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBjYWxlbmRhcldyYXBwZXIuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9XUkFQUEVSX0NMQVNTKTtcclxuICBjYWxlbmRhcldyYXBwZXIudGFiSW5kZXggPSBcIi0xXCI7XHJcblxyXG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGludGVybmFsSW5wdXRFbC5jbG9uZU5vZGUoKTtcclxuICBleHRlcm5hbElucHV0RWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTUyk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLnR5cGUgPSBcInRleHRcIjtcclxuICBleHRlcm5hbElucHV0RWwubmFtZSA9IFwiXCI7XHJcblxyXG4gIGxldCBkaWFsb2dUaXRsZSA9IHRleHQuY2hvb3NlX2FfZGF0ZTtcclxuICBjb25zdCBoYXNNaW5EYXRlID0gbWluRGF0ZSAhPT0gdW5kZWZpbmVkICYmIG1pbkRhdGUgIT09IFwiXCI7XHJcbiAgY29uc3QgaXNEZWZhdWx0TWluRGF0ZSA9ICBtaW5EYXRlICE9PSB1bmRlZmluZWQgJiYgbWluRGF0ZSAhPT0gXCJcIiAmJiBwYXJzZURhdGVTdHJpbmcoREVGQVVMVF9NSU5fREFURSkuZ2V0VGltZSgpID09PSBtaW5EYXRlLmdldFRpbWUoKTtcclxuICBjb25zdCBoYXNNYXhEYXRlID0gbWF4RGF0ZSAhPT0gdW5kZWZpbmVkICYmIG1heERhdGUgIT09IFwiXCI7XHJcbiAgXHJcbiAgaWYgKGhhc01pbkRhdGUgJiYgIWlzRGVmYXVsdE1pbkRhdGUgJiYgaGFzTWF4RGF0ZSkge1xyXG4gICAgY29uc3QgbWluRGF5ID0gbWluRGF0ZS5nZXREYXRlKCk7XHJcbiAgICBjb25zdCBtaW5Nb250aCA9IG1pbkRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1pbk1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21pbk1vbnRoXTtcclxuICAgIGNvbnN0IG1pblllYXIgPSBtaW5EYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBtYXhEYXkgPSBtYXhEYXRlLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1heE1vbnRoID0gbWF4RGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbWF4TW9udGhTdHIgPSBNT05USF9MQUJFTFNbbWF4TW9udGhdO1xyXG4gICAgY29uc3QgbWF4WWVhciA9IG1heERhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgIGRpYWxvZ1RpdGxlID0gdGV4dC5jaG9vc2VfYV9kYXRlX2JldHdlZW4ucmVwbGFjZSgve21pbkRheX0vLCBtaW5EYXkpLnJlcGxhY2UoL3ttaW5Nb250aFN0cn0vLCBtaW5Nb250aFN0cikucmVwbGFjZSgve21pblllYXJ9LywgbWluWWVhcikucmVwbGFjZSgve21heERheX0vLCBtYXhEYXkpLnJlcGxhY2UoL3ttYXhNb250aFN0cn0vLCBtYXhNb250aFN0cikucmVwbGFjZSgve21heFllYXJ9LywgbWF4WWVhcik7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGhhc01pbkRhdGUgJiYgIWlzRGVmYXVsdE1pbkRhdGUgJiYgIWhhc01heERhdGUpIHtcclxuICAgIGNvbnN0IG1pbkRheSA9IG1pbkRhdGUuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbWluTW9udGggPSBtaW5EYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtaW5Nb250aFN0ciA9IE1PTlRIX0xBQkVMU1ttaW5Nb250aF07XHJcbiAgICBjb25zdCBtaW5ZZWFyID0gbWluRGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgZGlhbG9nVGl0bGUgPSB0ZXh0LmNob29zZV9hX2RhdGVfYWZ0ZXIucmVwbGFjZSgve21pbkRheX0vLCBtaW5EYXkpLnJlcGxhY2UoL3ttaW5Nb250aFN0cn0vLCBtaW5Nb250aFN0cikucmVwbGFjZSgve21pblllYXJ9LywgbWluWWVhcik7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGhhc01heERhdGUpIHtcclxuICAgIGNvbnN0IG1heERheSA9IG1heERhdGUuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbWF4TW9udGggPSBtYXhEYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtYXhNb250aFN0ciA9IE1PTlRIX0xBQkVMU1ttYXhNb250aF07XHJcbiAgICBjb25zdCBtYXhZZWFyID0gbWF4RGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgZGlhbG9nVGl0bGUgPSB0ZXh0LmNob29zZV9hX2RhdGVfYmVmb3JlLnJlcGxhY2UoL3ttYXhEYXl9LywgbWF4RGF5KS5yZXBsYWNlKC97bWF4TW9udGhTdHJ9LywgbWF4TW9udGhTdHIpLnJlcGxhY2UoL3ttYXhZZWFyfS8sIG1heFllYXIpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZ3VpZGVJRCA9IGV4dGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSArIFwiLWd1aWRlXCI7XHJcblxyXG4gIGNhbGVuZGFyV3JhcHBlci5hcHBlbmRDaGlsZChleHRlcm5hbElucHV0RWwpO1xyXG4gIGNhbGVuZGFyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoXHJcbiAgICBcImJlZm9yZWVuZFwiLFxyXG4gICAgW1xyXG4gICAgICBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCIke0RBVEVfUElDS0VSX0JVVFRPTl9DTEFTU31cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtbGFiZWw9XCIke3RleHQub3Blbl9jYWxlbmRhcn1cIj4mbmJzcDs8L2J1dHRvbj5gLFxyXG4gICAgICBgPGRpdiBjbGFzcz1cIiR7RElBTE9HX1dSQVBQRVJfQ0xBU1N9XCIgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIiR7ZGlhbG9nVGl0bGV9XCIgYXJpYS1kZXNjcmliZWRieT1cIiR7Z3VpZGVJRH1cIiBoaWRkZW4+PGRpdiByb2xlPVwiYXBwbGljYXRpb25cIj48ZGl2IGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31cIiBoaWRkZW4+PC9kaXY+PC9kaXY+PC9kaXY+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfVwiIHJvbGU9XCJzdGF0dXNcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj48L2Rpdj5gLFxyXG4gICAgICBgPGRpdiBjbGFzcz1cInNyLW9ubHkgJHtEQVRFX1BJQ0tFUl9HVUlERV9DTEFTU31cIiBpZD1cIiR7Z3VpZGVJRH1cIiBoaWRkZW4+JHt0ZXh0Lmd1aWRlfTwvZGl2PmBcclxuICAgIF0uam9pbihcIlwiKVxyXG4gICk7XHJcblxyXG4gIGludGVybmFsSW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLmNsYXNzTGlzdC5hZGQoXHJcbiAgICBcInNyLW9ubHlcIixcclxuICAgIERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTXHJcbiAgKTtcclxuICBpbnRlcm5hbElucHV0RWwucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xyXG4gIGludGVybmFsSW5wdXRFbC5yZXF1aXJlZCA9IGZhbHNlO1xyXG5cclxuICBkYXRlUGlja2VyRWwuYXBwZW5kQ2hpbGQoY2FsZW5kYXJXcmFwcGVyKTtcclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUyk7XHJcblxyXG4gIGlmIChkZWZhdWx0VmFsdWUpIHtcclxuICAgIHNldENhbGVuZGFyVmFsdWUoZGF0ZVBpY2tlckVsLCBkZWZhdWx0VmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGludGVybmFsSW5wdXRFbC5kaXNhYmxlZCkge1xyXG4gICAgZGlzYWJsZShkYXRlUGlja2VyRWwpO1xyXG4gICAgaW50ZXJuYWxJbnB1dEVsLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChleHRlcm5hbElucHV0RWwudmFsdWUpIHtcclxuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGV4dGVybmFsSW5wdXRFbCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIERhdGUgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8qKlxyXG4gKiByZW5kZXIgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGVUb0Rpc3BsYXkgYSBkYXRlIHRvIHJlbmRlciBvbiB0aGUgY2FsZW5kYXJcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IHJlbmRlckNhbGVuZGFyID0gKGVsLCBfZGF0ZVRvRGlzcGxheSkgPT4ge1xyXG4gIGNvbnN0IHtcclxuICAgIGRhdGVQaWNrZXJFbCxcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBzdGF0dXNFbCxcclxuICAgIHNlbGVjdGVkRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgcmFuZ2VEYXRlLFxyXG4gICAgZGlhbG9nRWwsXHJcbiAgICBndWlkZUVsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCB0b2RheXNEYXRlID0gdG9kYXkoKTtcclxuICBsZXQgZGF0ZVRvRGlzcGxheSA9IF9kYXRlVG9EaXNwbGF5IHx8IHRvZGF5c0RhdGU7XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV2FzSGlkZGVuID0gY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGNvbnN0IGZvY3VzZWREYXRlID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAwKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSBkYXRlVG9EaXNwbGF5LmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGNvbnN0IHByZXZNb250aCA9IHN1Yk1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcclxuICBjb25zdCBuZXh0TW9udGggPSBhZGRNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRGb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9EaXNwbGF5KTtcclxuXHJcbiAgY29uc3QgZmlyc3RPZk1vbnRoID0gc3RhcnRPZk1vbnRoKGRhdGVUb0Rpc3BsYXkpO1xyXG4gIGNvbnN0IHByZXZCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtaW5EYXRlKTtcclxuICBjb25zdCBuZXh0QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWF4RGF0ZSk7XHJcblxyXG4gIGNvbnN0IHJhbmdlQ29uY2x1c2lvbkRhdGUgPSBzZWxlY3RlZERhdGUgfHwgZGF0ZVRvRGlzcGxheTtcclxuICBjb25zdCByYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRGF0ZSAmJiBtaW4ocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcclxuICBjb25zdCByYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgbWF4KHJhbmdlQ29uY2x1c2lvbkRhdGUsIHJhbmdlRGF0ZSk7XHJcblxyXG4gIGNvbnN0IHdpdGhpblJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIGFkZERheXMocmFuZ2VTdGFydERhdGUsIDEpO1xyXG4gIGNvbnN0IHdpdGhpblJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBzdWJEYXlzKHJhbmdlRW5kRGF0ZSwgMSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoTGFiZWwgPSBNT05USF9MQUJFTFNbZm9jdXNlZE1vbnRoXTtcclxuXHJcbiAgY29uc3QgZ2VuZXJhdGVEYXRlSHRtbCA9IChkYXRlVG9SZW5kZXIpID0+IHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfREFURV9DTEFTU107XHJcbiAgICBjb25zdCBkYXkgPSBkYXRlVG9SZW5kZXIuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbW9udGggPSBkYXRlVG9SZW5kZXIuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRlVG9SZW5kZXIuZ2V0RnVsbFllYXIoKTtcclxuICAgIGxldCBkYXlPZldlZWsgPSBkYXRlVG9SZW5kZXIuZ2V0RGF5KCkgLSAxO1xyXG4gICAgaWYgKGRheU9mV2VlayA9PT0gLTEpIHtcclxuICAgICAgZGF5T2ZXZWVrID0gNjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9SZW5kZXIpO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gIWlzRGF0ZVdpdGhpbk1pbkFuZE1heChkYXRlVG9SZW5kZXIsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHNlbGVjdGVkRGF0ZSk7XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgcHJldk1vbnRoKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9QUkVWSU9VU19NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIG5leHRNb250aCkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCB0b2RheXNEYXRlKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJhbmdlRGF0ZSkge1xyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VEYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VTdGFydERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZUVuZERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgaXNEYXRlV2l0aGluTWluQW5kTWF4KFxyXG4gICAgICAgICAgZGF0ZVRvUmVuZGVyLFxyXG4gICAgICAgICAgd2l0aGluUmFuZ2VTdGFydERhdGUsXHJcbiAgICAgICAgICB3aXRoaW5SYW5nZUVuZERhdGVcclxuICAgICAgICApXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1dJVEhJTl9SQU5HRV9DTEFTUyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21vbnRoXTtcclxuICAgIGNvbnN0IGRheVN0ciA9IERBWV9PRl9XRUVLX0xBQkVMU1tkYXlPZldlZWtdO1xyXG4gICAgY29uc3QgYXJpYUxhYmVsRGF0ZSA9IHRleHQuYXJpYV9sYWJlbF9kYXRlLnJlcGxhY2UoL3tkYXlTdHJ9LywgZGF5U3RyKS5yZXBsYWNlKC97ZGF5fS8sIGRheSkucmVwbGFjZSgve21vbnRoU3RyfS8sIG1vbnRoU3RyKS5yZXBsYWNlKC97eWVhcn0vLCB5ZWFyKTtcclxuXHJcbiAgICByZXR1cm4gYDxidXR0b25cclxuICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgZGF0YS1kYXk9XCIke2RheX1cIiBcclxuICAgICAgZGF0YS1tb250aD1cIiR7bW9udGggKyAxfVwiIFxyXG4gICAgICBkYXRhLXllYXI9XCIke3llYXJ9XCIgXHJcbiAgICAgIGRhdGEtdmFsdWU9XCIke2Zvcm1hdHRlZERhdGV9XCJcclxuICAgICAgYXJpYS1sYWJlbD1cIiR7YXJpYUxhYmVsRGF0ZX1cIlxyXG4gICAgICBhcmlhLWN1cnJlbnQ9XCIke2lzU2VsZWN0ZWQgPyBcImRhdGVcIiA6IFwiZmFsc2VcIn1cIlxyXG4gICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICA+JHtkYXl9PC9idXR0b24+YDtcclxuICB9O1xyXG4gIC8vIHNldCBkYXRlIHRvIGZpcnN0IHJlbmRlcmVkIGRheVxyXG4gIGRhdGVUb0Rpc3BsYXkgPSBzdGFydE9mV2VlayhmaXJzdE9mTW9udGgpO1xyXG5cclxuICBjb25zdCBkYXlzID0gW107XHJcblxyXG4gIHdoaWxlIChcclxuICAgIGRheXMubGVuZ3RoIDwgMjggfHxcclxuICAgIGRhdGVUb0Rpc3BsYXkuZ2V0TW9udGgoKSA9PT0gZm9jdXNlZE1vbnRoIHx8XHJcbiAgICBkYXlzLmxlbmd0aCAlIDcgIT09IDBcclxuICApIHtcclxuICAgIGRheXMucHVzaChnZW5lcmF0ZURhdGVIdG1sKGRhdGVUb0Rpc3BsYXkpKTtcclxuICAgIGRhdGVUb0Rpc3BsYXkgPSBhZGREYXlzKGRhdGVUb0Rpc3BsYXksIDEpOyAgICBcclxuICB9XHJcbiAgY29uc3QgZGF0ZXNIdG1sID0gbGlzdFRvR3JpZEh0bWwoZGF5cywgNyk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5kYXRhc2V0LnZhbHVlID0gY3VycmVudEZvcm1hdHRlZERhdGU7XHJcbiAgbmV3Q2FsZW5kYXIuc3R5bGUudG9wID0gYCR7ZGF0ZVBpY2tlckVsLm9mZnNldEhlaWdodH1weGA7XHJcbiAgbmV3Q2FsZW5kYXIuaGlkZGVuID0gZmFsc2U7XHJcbiAgbGV0IGNvbnRlbnQgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9ST1dfQ0xBU1N9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHt0ZXh0LnByZXZpb3VzX3llYXJ9XCJcclxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCIke3RleHQucHJldmlvdXNfbW9udGh9XCJcclxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfTU9OVEhfTEFCRUxfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHttb250aExhYmVsfS4gJHt0ZXh0LnNlbGVjdF9tb250aH0uXCJcclxuICAgICAgICAgID4ke21vbnRoTGFiZWx9PC9idXR0b24+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTfVwiIGFyaWEtbGFiZWw9XCIke2ZvY3VzZWRZZWFyfS4gJHt0ZXh0LnNlbGVjdF95ZWFyfS5cIlxyXG4gICAgICAgICAgPiR7Zm9jdXNlZFllYXJ9PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHt0ZXh0Lm5leHRfbW9udGh9XCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHt0ZXh0Lm5leHRfeWVhcn1cIlxyXG4gICAgICAgICAgICAke25leHRCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICA8dHI+YDtcclxuICBmb3IobGV0IGQgaW4gREFZX09GX1dFRUtfTEFCRUxTKXtcclxuICAgIGNvbnRlbnQgKz0gYDx0aCBjbGFzcz1cIiR7Q0FMRU5EQVJfREFZX09GX1dFRUtfQ0xBU1N9XCIgc2NvcGU9XCJjb2xcIiBhcmlhLWxhYmVsPVwiJHtEQVlfT0ZfV0VFS19MQUJFTFNbZF19XCI+JHtEQVlfT0ZfV0VFS19MQUJFTFNbZF0uY2hhckF0KDApfTwvdGg+YDtcclxuICB9XHJcbiAgY29udGVudCArPSBgPC90cj5cclxuICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICR7ZGF0ZXNIdG1sfVxyXG4gICAgICAgIDwvdGJvZHk+XHJcbiAgICAgIDwvdGFibGU+XHJcbiAgICA8L2Rpdj5gO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0FDVElWRV9DTEFTUyk7XHJcbiAgaWYgKGRpYWxvZ0VsLmhpZGRlbiA9PT0gdHJ1ZSkge1xyXG4gICAgZGlhbG9nRWwuaGlkZGVuID0gZmFsc2U7XHJcbiAgICBpZiAoZ3VpZGVFbC5oaWRkZW4pIHtcclxuICAgICAgZ3VpZGVFbC5oaWRkZW4gPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgY29uc3Qgc3RhdHVzZXMgPSBbXTtcclxuXHJcbiAgaWYgKGNhbGVuZGFyV2FzSGlkZGVuKSB7XHJcbiAgICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IFwiXCI7XHJcbiAgfSBcclxuICBlbHNlIGlmIChfZGF0ZVRvRGlzcGxheS5nZXRUaW1lKCkgPT09IG1pbkRhdGUuZ2V0VGltZSgpKSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKHRleHQuZmlyc3RfcG9zc2libGVfZGF0ZSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKG1heERhdGUgIT09IHVuZGVmaW5lZCAmJiBtYXhEYXRlICE9PSBcIlwiICYmIF9kYXRlVG9EaXNwbGF5LmdldFRpbWUoKSA9PT0gbWF4RGF0ZS5nZXRUaW1lKCkpIHtcclxuICAgIHN0YXR1c2VzLnB1c2godGV4dC5sYXN0X3Bvc3NpYmxlX2RhdGUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHN0YXR1c2VzLnB1c2godGV4dC5jdXJyZW50X21vbnRoX2Rpc3BsYXllZC5yZXBsYWNlKC97bW9udGhMYWJlbH0vLCBtb250aExhYmVsKS5yZXBsYWNlKC97Zm9jdXNlZFllYXJ9LywgZm9jdXNlZFllYXIpKTtcclxuICB9XHJcblxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gc3RhdHVzZXMuam9pbihcIi4gXCIpO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNZZWFyID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gc3ViWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUik7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlQcmV2aW91c01vbnRoID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gc3ViTW9udGhzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX01PTlRIKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRNb250aCA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IGFkZE1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX01PTlRIKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TmV4dFllYXIgPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBhZGRZZWFycyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX1lFQVIpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRoZSBjYWxlbmRhciBvZiBhIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGlkZUNhbGVuZGFyID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGNhbGVuZGFyRWwsIHN0YXR1c0VsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QucmVtb3ZlKERBVEVfUElDS0VSX0FDVElWRV9DTEFTUyk7XHJcbiAgY2FsZW5kYXJFbC5oaWRkZW4gPSB0cnVlO1xyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgYSBkYXRlIHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBjYWxlbmRhckRhdGVFbCBBIGRhdGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0RGF0ZSA9IChjYWxlbmRhckRhdGVFbCkgPT4ge1xyXG4gIGlmIChjYWxlbmRhckRhdGVFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgZXh0ZXJuYWxJbnB1dEVsLCBkaWFsb2dFbCwgZ3VpZGVFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBjYWxlbmRhckRhdGVFbFxyXG4gICk7XHJcbiAgc2V0Q2FsZW5kYXJWYWx1ZShjYWxlbmRhckRhdGVFbCwgY2FsZW5kYXJEYXRlRWwuZGF0YXNldC52YWx1ZSk7XHJcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XHJcbiAgZGlhbG9nRWwuaGlkZGVuID0gdHJ1ZTtcclxuICBndWlkZUVsLmhpZGRlbiA9IHRydWU7XHJcblxyXG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHRvZ2dsZUNhbGVuZGFyID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3Qge1xyXG4gICAgZGlhbG9nRWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgaW5wdXREYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgICBkZWZhdWx0RGF0ZSxcclxuICAgIGd1aWRlRWxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBpZiAoY2FsZW5kYXJFbC5oaWRkZW4pIHtcclxuICAgIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoXHJcbiAgICAgIGlucHV0RGF0ZSB8fCBkZWZhdWx0RGF0ZSB8fCB0b2RheSgpLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG4gICAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBoaWRlQ2FsZW5kYXIoZWwpO1xyXG4gICAgZGlhbG9nRWwuaGlkZGVuID0gdHJ1ZTtcclxuICAgIGd1aWRlRWwuaGlkZGVuID0gdHJ1ZTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVXBkYXRlIHRoZSBjYWxlbmRhciB3aGVuIHZpc2libGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIGFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxyXG4gKi9cclxuY29uc3QgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGNvbnN0IGNhbGVuZGFyU2hvd24gPSAhY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGlmIChjYWxlbmRhclNob3duICYmIGlucHV0RGF0ZSkge1xyXG4gICAgY29uc3QgZGF0ZVRvRGlzcGxheSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChpbnB1dERhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIERhdGUgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xyXG4vKipcclxuICogRGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpbiB0aGUgZGF0ZSBwaWNrZXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlNb250aFNlbGVjdGlvbiA9IChlbCwgbW9udGhUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gY2FsZW5kYXJEYXRlLmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZE1vbnRoID0gbW9udGhUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkTW9udGggOiBtb250aFRvRGlzcGxheTtcclxuXHJcbiAgY29uc3QgbW9udGhzID0gTU9OVEhfTEFCRUxTLm1hcCgobW9udGgsIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBtb250aFRvQ2hlY2sgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGluZGV4KTtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgICBtb250aFRvQ2hlY2ssXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfTU9OVEhfQ0xBU1NdO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGluZGV4ID09PSBzZWxlY3RlZE1vbnRoO1xyXG5cclxuICAgIGlmIChpbmRleCA9PT0gZm9jdXNlZE1vbnRoKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfTU9OVEhfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBgPGJ1dHRvbiBcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgICBkYXRhLXZhbHVlPVwiJHtpbmRleH1cIlxyXG4gICAgICAgIGRhdGEtbGFiZWw9XCIke21vbnRofVwiXHJcbiAgICAgICAgYXJpYS1jdXJyZW50PVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgID4ke21vbnRofTwvYnV0dG9uPmA7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoc0h0bWwgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICA8dGJvZHk+XHJcbiAgICAgICAgJHtsaXN0VG9HcmlkSHRtbChtb250aHMsIDMpfVxyXG4gICAgICA8L3Rib2R5PlxyXG4gICAgPC90YWJsZT5cclxuICA8L2Rpdj5gO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gbW9udGhzSHRtbDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSB0ZXh0Lm1vbnRoc19kaXNwbGF5ZWQ7XHJcblxyXG4gIHJldHVybiBuZXdDYWxlbmRhcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgYSBtb250aCBpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBtb250aEVsIEFuIG1vbnRoIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdE1vbnRoID0gKG1vbnRoRWwpID0+IHtcclxuICBpZiAobW9udGhFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIG1vbnRoRWxcclxuICApO1xyXG4gIGNvbnN0IHNlbGVjdGVkTW9udGggPSBwYXJzZUludChtb250aEVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuICBsZXQgZGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRNb250aCk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIE1vbnRoIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gWWVhciBTZWxlY3Rpb24gVmlld1xyXG5cclxuLyoqXHJcbiAqIERpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbiBpbiB0aGUgZGF0ZSBwaWNrZXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXJUb0Rpc3BsYXkgeWVhciB0byBkaXNwbGF5IGluIHllYXIgc2VsZWN0aW9uXHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5WWVhclNlbGVjdGlvbiA9IChlbCwgeWVhclRvRGlzcGxheSkgPT4ge1xyXG4gIGNvbnN0IHtcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBzdGF0dXNFbCxcclxuICAgIGNhbGVuZGFyRGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IGNhbGVuZGFyRGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gIGNvbnN0IGZvY3VzZWRZZWFyID0geWVhclRvRGlzcGxheSA9PSBudWxsID8gc2VsZWN0ZWRZZWFyIDogeWVhclRvRGlzcGxheTtcclxuXHJcbiAgbGV0IHllYXJUb0NodW5rID0gZm9jdXNlZFllYXI7XHJcbiAgeWVhclRvQ2h1bmsgLT0geWVhclRvQ2h1bmsgJSBZRUFSX0NIVU5LO1xyXG4gIHllYXJUb0NodW5rID0gTWF0aC5tYXgoMCwgeWVhclRvQ2h1bmspO1xyXG5cclxuICBjb25zdCBwcmV2WWVhckNodW5rRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcclxuICAgIHNldFllYXIoY2FsZW5kYXJEYXRlLCB5ZWFyVG9DaHVuayAtIDEpLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGVcclxuICApO1xyXG5cclxuICBjb25zdCBuZXh0WWVhckNodW5rRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcclxuICAgIHNldFllYXIoY2FsZW5kYXJEYXRlLCB5ZWFyVG9DaHVuayArIFlFQVJfQ0hVTkspLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGVcclxuICApO1xyXG5cclxuICBjb25zdCB5ZWFycyA9IFtdO1xyXG4gIGxldCB5ZWFySW5kZXggPSB5ZWFyVG9DaHVuaztcclxuICB3aGlsZSAoeWVhcnMubGVuZ3RoIDwgWUVBUl9DSFVOSykge1xyXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhckluZGV4KSxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgdGFiaW5kZXggPSBcIi0xXCI7XHJcblxyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9ZRUFSX0NMQVNTXTtcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSB5ZWFySW5kZXggPT09IHNlbGVjdGVkWWVhcjtcclxuXHJcbiAgICBpZiAoeWVhckluZGV4ID09PSBmb2N1c2VkWWVhcikge1xyXG4gICAgICB0YWJpbmRleCA9IFwiMFwiO1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfWUVBUl9TRUxFQ1RFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgeWVhcnMucHVzaChcclxuICAgICAgYDxidXR0b24gXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXHJcbiAgICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXHJcbiAgICAgICAgZGF0YS12YWx1ZT1cIiR7eWVhckluZGV4fVwiXHJcbiAgICAgICAgYXJpYS1jdXJyZW50PVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgID4ke3llYXJJbmRleH08L2J1dHRvbj5gXHJcbiAgICApO1xyXG4gICAgeWVhckluZGV4ICs9IDE7XHJcbiAgfVxyXG5cclxuICBjb25zdCB5ZWFyc0h0bWwgPSBsaXN0VG9HcmlkSHRtbCh5ZWFycywgMyk7XHJcbiAgY29uc3QgYXJpYUxhYmVsUHJldmlvdXNZZWFycyA9IHRleHQucHJldmlvdXNfeWVhcnMucmVwbGFjZSgve3llYXJzfS8sIFlFQVJfQ0hVTkspO1xyXG4gIGNvbnN0IGFyaWFMYWJlbE5leHRZZWFycyA9IHRleHQubmV4dF95ZWFycy5yZXBsYWNlKC97eWVhcnN9LywgWUVBUl9DSFVOSyk7XHJcbiAgY29uc3QgYW5ub3VuY2VZZWFycyA9IHRleHQueWVhcnNfZGlzcGxheWVkLnJlcGxhY2UoL3tzdGFydH0vLCB5ZWFyVG9DaHVuaykucmVwbGFjZSgve2VuZH0vLCB5ZWFyVG9DaHVuayArIFlFQVJfQ0hVTksgLSAxKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7YXJpYUxhYmVsUHJldmlvdXNZZWFyc31cIlxyXG4gICAgICAgICAgICAgICAgJHtwcmV2WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj5cclxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgJHt5ZWFyc0h0bWx9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9XCIgXHJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHthcmlhTGFiZWxOZXh0WWVhcnN9XCJcclxuICAgICAgICAgICAgICAgICR7bmV4dFllYXJDaHVua0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgPC90Ym9keT5cclxuICAgICAgPC90YWJsZT5cclxuICAgIDwvZGl2PmA7XHJcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XHJcblxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gYW5ub3VuY2VZZWFycztcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciAtIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTkspO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIGJ5IHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0WWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciArIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIHllYXIgaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0geWVhckVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RZZWFyID0gKHllYXJFbCkgPT4ge1xyXG4gIGlmICh5ZWFyRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICB5ZWFyRWxcclxuICApO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5pbm5lckhUTUwsIDEwKTtcclxuICBsZXQgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhciA9IChldmVudCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBleHRlcm5hbElucHV0RWwsIGRpYWxvZ0VsLCBndWlkZUVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChldmVudC50YXJnZXQpO1xyXG5cclxuICBoaWRlQ2FsZW5kYXIoZGF0ZVBpY2tlckVsKTtcclxuICBkaWFsb2dFbC5oaWRkZW4gPSB0cnVlO1xyXG4gIGd1aWRlRWwuaGlkZGVuID0gdHJ1ZTtcclxuICBleHRlcm5hbElucHV0RWwuZm9jdXMoKTtcclxuXHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgRGF0ZSBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgZGF0ZSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIgaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3REYXRlRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGp1c3RDYWxlbmRhciA9IChhZGp1c3REYXRlRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIGV2ZW50LnRhcmdldFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBkYXRlID0gYWRqdXN0RGF0ZUZuKGNhbGVuZGFyRGF0ZSk7XHJcblxyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lRGF5KGNhbGVuZGFyRGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBjYXBwZWREYXRlKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViV2Vla3MoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVEb3duRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkV2Vla3MoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIGRheSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJEYXlzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBkYXkgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVSaWdodEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZERheXMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUhvbWVGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdGFydE9mV2VlayhkYXRlKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGVuZE9mV2VlayhkYXRlKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZE1vbnRocyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJNb250aHMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVTaGlmdFBhZ2VEb3duRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkWWVhcnMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVTaGlmdFBhZ2VVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YlllYXJzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBkaXNwbGF5IHRoZSBjYWxlbmRhciBmb3IgdGhlIG1vdXNlbW92ZSBkYXRlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IFRoZSBtb3VzZW1vdmUgZXZlbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZGF0ZUVsIEEgZGF0ZSBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tRGF0ZSA9IChkYXRlRWwpID0+IHtcclxuICBpZiAoZGF0ZUVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyRWwgPSBkYXRlRWwuY2xvc2VzdChEQVRFX1BJQ0tFUl9DQUxFTkRBUik7XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRDYWxlbmRhckRhdGUgPSBjYWxlbmRhckVsLmRhdGFzZXQudmFsdWU7XHJcbiAgY29uc3QgaG92ZXJEYXRlID0gZGF0ZUVsLmRhdGFzZXQudmFsdWU7XHJcblxyXG4gIGlmIChob3ZlckRhdGUgPT09IGN1cnJlbnRDYWxlbmRhckRhdGUpIHJldHVybjtcclxuXHJcbiAgY29uc3QgZGF0ZVRvRGlzcGxheSA9IHBhcnNlRGF0ZVN0cmluZyhob3ZlckRhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIERhdGUgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgTW9udGggRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3QgdGhlIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0TW9udGhGbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGFkanVzdGVkIG1vbnRoXHJcbiAqL1xyXG5jb25zdCBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbiA9IChhZGp1c3RNb250aEZuKSA9PiB7XHJcbiAgcmV0dXJuIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgbW9udGhFbCA9IGV2ZW50LnRhcmdldDtcclxuICAgIGNvbnN0IHNlbGVjdGVkTW9udGggPSBwYXJzZUludChtb250aEVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgICAgbW9udGhFbFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZE1vbnRoKTtcclxuXHJcbiAgICBsZXQgYWRqdXN0ZWRNb250aCA9IGFkanVzdE1vbnRoRm4oc2VsZWN0ZWRNb250aCk7XHJcbiAgICBhZGp1c3RlZE1vbnRoID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTEsIGFkanVzdGVkTW9udGgpKTtcclxuXHJcbiAgICBjb25zdCBkYXRlID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZE1vbnRoKTtcclxuICAgIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBpZiAoIWlzU2FtZU1vbnRoKGN1cnJlbnREYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlNb250aFNlbGVjdGlvbihcclxuICAgICAgICBjYWxlbmRhckVsLFxyXG4gICAgICAgIGNhcHBlZERhdGUuZ2V0TW9udGgoKVxyXG4gICAgICApO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayB0aHJlZSBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVVwRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCAtIDMpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgdGhyZWUgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVEb3duRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCArIDMpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCAtIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVSaWdodEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggKyAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHJvdyBvZiBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUhvbWVGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbihcclxuICAobW9udGgpID0+IG1vbnRoIC0gKG1vbnRoICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSByb3cgb2YgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVFbmRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbihcclxuICAobW9udGgpID0+IG1vbnRoICsgMiAtIChtb250aCAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGxhc3QgbW9udGggKERlY2VtYmVyKSBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZURvd25Gcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigoKSA9PiAxMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGZpcnN0IG1vbnRoIChKYW51YXJ5KSBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZVVwRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKCkgPT4gMCk7XHJcblxyXG4vKipcclxuICogdXBkYXRlIHRoZSBmb2N1cyBvbiBhIG1vbnRoIHdoZW4gdGhlIG1vdXNlIG1vdmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IFRoZSBtb3VzZW1vdmUgZXZlbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gbW9udGhFbCBBIG1vbnRoIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21Nb250aCA9IChtb250aEVsKSA9PiB7XHJcbiAgaWYgKG1vbnRoRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBpZiAobW9udGhFbC5jbGFzc0xpc3QuY29udGFpbnMoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUykpIHJldHVybjtcclxuXHJcbiAgY29uc3QgZm9jdXNNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlNb250aFNlbGVjdGlvbihtb250aEVsLCBmb2N1c01vbnRoKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIE1vbnRoIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIFllYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3QgdGhlIHllYXIgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbiBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdFllYXJGbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGFkanVzdGVkIHllYXJcclxuICovXHJcbmNvbnN0IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4gPSAoYWRqdXN0WWVhckZuKSA9PiB7XHJcbiAgcmV0dXJuIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeWVhckVsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgICAgeWVhckVsXHJcbiAgICApO1xyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRZZWFyKTtcclxuXHJcbiAgICBsZXQgYWRqdXN0ZWRZZWFyID0gYWRqdXN0WWVhckZuKHNlbGVjdGVkWWVhcik7XHJcbiAgICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRZZWFyKTtcclxuICAgIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBpZiAoIWlzU2FtZVllYXIoY3VycmVudERhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24oXHJcbiAgICAgICAgY2FsZW5kYXJFbCxcclxuICAgICAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICAgICAgKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayB0aHJlZSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciAtIDMpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgdGhyZWUgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciArIDMpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciAtIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgKyAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHJvdyBvZiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyIC0gKHllYXIgJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHJvdyBvZiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVFbmRGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgKyAyIC0gKHllYXIgJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIGJhY2sgMTIgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZVVwRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyIC0gWUVBUl9DSFVOS1xyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgMTIgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZURvd25Gcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgKyBZRUFSX0NIVU5LXHJcbik7XHJcblxyXG4vKipcclxuICogdXBkYXRlIHRoZSBmb2N1cyBvbiBhIHllYXIgd2hlbiB0aGUgbW91c2UgbW92ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBkYXRlRWwgQSB5ZWFyIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21ZZWFyID0gKHllYXJFbCkgPT4ge1xyXG4gIGlmICh5ZWFyRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBpZiAoeWVhckVsLmNsYXNzTGlzdC5jb250YWlucyhDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MpKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGZvY3VzWWVhciA9IHBhcnNlSW50KHllYXJFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24oeWVhckVsLCBmb2N1c1llYXIpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBZZWFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIEZvY3VzIEhhbmRsaW5nIEV2ZW50IEhhbmRsaW5nXHJcblxyXG5jb25zdCB0YWJIYW5kbGVyID0gKGZvY3VzYWJsZSkgPT4ge1xyXG4gIGNvbnN0IGdldEZvY3VzYWJsZUNvbnRleHQgPSAoZWwpID0+IHtcclxuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBzZWxlY3QoZm9jdXNhYmxlLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgICBjb25zdCBmaXJzdFRhYkluZGV4ID0gMDtcclxuICAgIGNvbnN0IGxhc3RUYWJJbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDE7XHJcbiAgICBjb25zdCBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1tmaXJzdFRhYkluZGV4XTtcclxuICAgIGNvbnN0IGxhc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbbGFzdFRhYkluZGV4XTtcclxuICAgIGNvbnN0IGZvY3VzSW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5pbmRleE9mKGFjdGl2ZUVsZW1lbnQoKSk7XHJcblxyXG4gICAgY29uc3QgaXNMYXN0VGFiID0gZm9jdXNJbmRleCA9PT0gbGFzdFRhYkluZGV4O1xyXG4gICAgY29uc3QgaXNGaXJzdFRhYiA9IGZvY3VzSW5kZXggPT09IGZpcnN0VGFiSW5kZXg7XHJcbiAgICBjb25zdCBpc05vdEZvdW5kID0gZm9jdXNJbmRleCA9PT0gLTE7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZm9jdXNhYmxlRWxlbWVudHMsXHJcbiAgICAgIGlzTm90Rm91bmQsXHJcbiAgICAgIGZpcnN0VGFiU3RvcCxcclxuICAgICAgaXNGaXJzdFRhYixcclxuICAgICAgbGFzdFRhYlN0b3AsXHJcbiAgICAgIGlzTGFzdFRhYixcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHRhYkFoZWFkKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IHsgZmlyc3RUYWJTdG9wLCBpc0xhc3RUYWIsIGlzTm90Rm91bmQgfSA9IGdldEZvY3VzYWJsZUNvbnRleHQoXHJcbiAgICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoaXNMYXN0VGFiIHx8IGlzTm90Rm91bmQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdGFiQmFjayhldmVudCkge1xyXG4gICAgICBjb25zdCB7IGxhc3RUYWJTdG9wLCBpc0ZpcnN0VGFiLCBpc05vdEZvdW5kIH0gPSBnZXRGb2N1c2FibGVDb250ZXh0KFxyXG4gICAgICAgIGV2ZW50LnRhcmdldFxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGlzRmlyc3RUYWIgfHwgaXNOb3RGb3VuZCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgbGFzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoREFURV9QSUNLRVJfRk9DVVNBQkxFKTtcclxuY29uc3QgbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKE1PTlRIX1BJQ0tFUl9GT0NVU0FCTEUpO1xyXG5jb25zdCB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihZRUFSX1BJQ0tFUl9GT0NVU0FCTEUpO1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBGb2N1cyBIYW5kbGluZyBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBEYXRlIFBpY2tlciBFdmVudCBEZWxlZ2F0aW9uIFJlZ2lzdHJhdGlvbiAvIENvbXBvbmVudFxyXG5cclxuY29uc3QgZGF0ZVBpY2tlckV2ZW50cyA9IHtcclxuICBbQ0xJQ0tdOiB7XHJcbiAgICBbREFURV9QSUNLRVJfQlVUVE9OXSgpIHtcclxuICAgICAgdG9nZ2xlQ2FsZW5kYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX0RBVEVdKCkge1xyXG4gICAgICBzZWxlY3REYXRlKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9NT05USF0oKSB7XHJcbiAgICAgIHNlbGVjdE1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXSgpIHtcclxuICAgICAgc2VsZWN0WWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEhdKCkge1xyXG4gICAgICBkaXNwbGF5UHJldmlvdXNNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9NT05USF0oKSB7XHJcbiAgICAgIGRpc3BsYXlOZXh0TW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX1lFQVJdKCkge1xyXG4gICAgICBkaXNwbGF5UHJldmlvdXNZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX1lFQVJdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dFllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTktdKCkge1xyXG4gICAgICBkaXNwbGF5UHJldmlvdXNZZWFyQ2h1bmsodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfWUVBUl9DSFVOS10oKSB7XHJcbiAgICAgIGRpc3BsYXlOZXh0WWVhckNodW5rKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05dKCkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlNb250aFNlbGVjdGlvbih0aGlzKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl0oKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24odGhpcyk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGtleXVwOiB7XHJcbiAgICBbREFURV9QSUNLRVJfQ0FMRU5EQVJdKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGtleWRvd24gPSB0aGlzLmRhdGFzZXQua2V5ZG93bktleUNvZGU7XHJcbiAgICAgIGlmIChgJHtldmVudC5rZXlDb2RlfWAgIT09IGtleWRvd24pIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAga2V5ZG93bjoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXShldmVudCkge1xyXG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gRU5URVJfS0VZQ09ERSkge1xyXG4gICAgICAgIHZhbGlkYXRlRGF0ZUlucHV0KHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX0RBVEVdOiBrZXltYXAoe1xyXG4gICAgICBVcDogaGFuZGxlVXBGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dVcDogaGFuZGxlVXBGcm9tRGF0ZSxcclxuICAgICAgRG93bjogaGFuZGxlRG93bkZyb21EYXRlLFxyXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tRGF0ZSxcclxuICAgICAgTGVmdDogaGFuZGxlTGVmdEZyb21EYXRlLFxyXG4gICAgICBBcnJvd0xlZnQ6IGhhbmRsZUxlZnRGcm9tRGF0ZSxcclxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbURhdGUsXHJcbiAgICAgIEFycm93UmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbURhdGUsXHJcbiAgICAgIEhvbWU6IGhhbmRsZUhvbWVGcm9tRGF0ZSxcclxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tRGF0ZSxcclxuICAgICAgUGFnZURvd246IGhhbmRsZVBhZ2VEb3duRnJvbURhdGUsXHJcbiAgICAgIFBhZ2VVcDogaGFuZGxlUGFnZVVwRnJvbURhdGUsXHJcbiAgICAgIFwiU2hpZnQrUGFnZURvd25cIjogaGFuZGxlU2hpZnRQYWdlRG93bkZyb21EYXRlLFxyXG4gICAgICBcIlNoaWZ0K1BhZ2VVcFwiOiBoYW5kbGVTaGlmdFBhZ2VVcEZyb21EYXRlLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfREFURV9QSUNLRVJdOiBrZXltYXAoe1xyXG4gICAgICBUYWI6IGRhdGVQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IGRhdGVQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQmFjayxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX01PTlRIXToga2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21Nb250aCxcclxuICAgICAgRG93bjogaGFuZGxlRG93bkZyb21Nb250aCxcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbU1vbnRoLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd0xlZnQ6IGhhbmRsZUxlZnRGcm9tTW9udGgsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21Nb250aCxcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tTW9udGgsXHJcbiAgICAgIEhvbWU6IGhhbmRsZUhvbWVGcm9tTW9udGgsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbU1vbnRoLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIFBhZ2VVcDogaGFuZGxlUGFnZVVwRnJvbU1vbnRoLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhfUElDS0VSXToga2V5bWFwKHtcclxuICAgICAgVGFiOiBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJBaGVhZCxcclxuICAgICAgXCJTaGlmdCtUYWJcIjogbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQmFjayxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX1lFQVJdOiBrZXltYXAoe1xyXG4gICAgICBVcDogaGFuZGxlVXBGcm9tWWVhcixcclxuICAgICAgQXJyb3dVcDogaGFuZGxlVXBGcm9tWWVhcixcclxuICAgICAgRG93bjogaGFuZGxlRG93bkZyb21ZZWFyLFxyXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tWWVhcixcclxuICAgICAgTGVmdDogaGFuZGxlTGVmdEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd0xlZnQ6IGhhbmRsZUxlZnRGcm9tWWVhcixcclxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbVllYXIsXHJcbiAgICAgIEFycm93UmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbVllYXIsXHJcbiAgICAgIEhvbWU6IGhhbmRsZUhvbWVGcm9tWWVhcixcclxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tWWVhcixcclxuICAgICAgUGFnZURvd246IGhhbmRsZVBhZ2VEb3duRnJvbVllYXIsXHJcbiAgICAgIFBhZ2VVcDogaGFuZGxlUGFnZVVwRnJvbVllYXIsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSX1BJQ0tFUl06IGtleW1hcCh7XHJcbiAgICAgIFRhYjogeWVhclBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJBaGVhZCxcclxuICAgICAgXCJTaGlmdCtUYWJcIjogeWVhclBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbREFURV9QSUNLRVJfQ0FMRU5EQVJdKGV2ZW50KSB7XHJcbiAgICAgIHRoaXMuZGF0YXNldC5rZXlkb3duS2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XHJcbiAgICB9LFxyXG4gICAgW0RBVEVfUElDS0VSXShldmVudCkge1xyXG4gICAgICBjb25zdCBrZXlNYXAgPSBrZXltYXAoe1xyXG4gICAgICAgIEVzY2FwZTogaGFuZGxlRXNjYXBlRnJvbUNhbGVuZGFyLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGtleU1hcChldmVudCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZm9jdXNvdXQ6IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF0oKSB7XHJcbiAgICAgIHZhbGlkYXRlRGF0ZUlucHV0KHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtEQVRFX1BJQ0tFUl0oZXZlbnQpIHtcclxuICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XHJcbiAgICAgICAgaGlkZUNhbGVuZGFyKHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF0oKSB7XHJcbiAgICAgIHJlY29uY2lsZUlucHV0VmFsdWVzKHRoaXMpO1xyXG4gICAgICB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgfSxcclxufTtcclxuXHJcbmlmICghaXNJb3NEZXZpY2UoKSkge1xyXG4gIGRhdGVQaWNrZXJFdmVudHMubW91c2Vtb3ZlID0ge1xyXG4gICAgW0NBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF0oKSB7XHJcbiAgICAgIGhhbmRsZU1vdXNlbW92ZUZyb21EYXRlKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9NT05USF0oKSB7XHJcbiAgICAgIGhhbmRsZU1vdXNlbW92ZUZyb21Nb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl0oKSB7XHJcbiAgICAgIGhhbmRsZU1vdXNlbW92ZUZyb21ZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5jb25zdCBkYXRlUGlja2VyID0gYmVoYXZpb3IoZGF0ZVBpY2tlckV2ZW50cywge1xyXG4gIGluaXQocm9vdCkge1xyXG4gICAgc2VsZWN0KERBVEVfUElDS0VSLCByb290KS5mb3JFYWNoKChkYXRlUGlja2VyRWwpID0+IHtcclxuICAgICAgaWYoIWRhdGVQaWNrZXJFbC5jbGFzc0xpc3QuY29udGFpbnMoREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MpKXtcclxuICAgICAgICBlbmhhbmNlRGF0ZVBpY2tlcihkYXRlUGlja2VyRWwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIHNldExhbmd1YWdlKHN0cmluZ3MpIHtcclxuICAgIHRleHQgPSBzdHJpbmdzO1xyXG4gICAgTU9OVEhfTEFCRUxTID0gW1xyXG4gICAgICB0ZXh0LmphbnVhcnksXHJcbiAgICAgIHRleHQuZmVicnVhcnksXHJcbiAgICAgIHRleHQubWFyY2gsXHJcbiAgICAgIHRleHQuYXByaWwsXHJcbiAgICAgIHRleHQubWF5LFxyXG4gICAgICB0ZXh0Lmp1bmUsXHJcbiAgICAgIHRleHQuanVseSxcclxuICAgICAgdGV4dC5hdWd1c3QsXHJcbiAgICAgIHRleHQuc2VwdGVtYmVyLFxyXG4gICAgICB0ZXh0Lm9jdG9iZXIsXHJcbiAgICAgIHRleHQubm92ZW1iZXIsXHJcbiAgICAgIHRleHQuZGVjZW1iZXJcclxuICAgIF07XHJcbiAgICBEQVlfT0ZfV0VFS19MQUJFTFMgPSBbXHJcbiAgICAgIHRleHQubW9uZGF5LFxyXG4gICAgICB0ZXh0LnR1ZXNkYXksXHJcbiAgICAgIHRleHQud2VkbmVzZGF5LFxyXG4gICAgICB0ZXh0LnRodXJzZGF5LFxyXG4gICAgICB0ZXh0LmZyaWRheSxcclxuICAgICAgdGV4dC5zYXR1cmRheSxcclxuICAgICAgdGV4dC5zdW5kYXlcclxuICAgIF07XHJcbiAgfSxcclxuICBnZXREYXRlUGlja2VyQ29udGV4dCxcclxuICBkaXNhYmxlLFxyXG4gIGVuYWJsZSxcclxuICBpc0RhdGVJbnB1dEludmFsaWQsXHJcbiAgc2V0Q2FsZW5kYXJWYWx1ZSxcclxuICB2YWxpZGF0ZURhdGVJbnB1dCxcclxuICByZW5kZXJDYWxlbmRhcixcclxuICB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZVxyXG59KTtcclxuXHJcbi8vICNlbmRyZWdpb24gRGF0ZSBQaWNrZXIgRXZlbnQgRGVsZWdhdGlvbiBSZWdpc3RyYXRpb24gLyBDb21wb25lbnRcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZGF0ZVBpY2tlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9kcm9wZG93bic7XHJcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byBzb3J0aW5nIHZhcmlhbnQgb2YgT3ZlcmZsb3cgbWVudSBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC5vdmVyZmxvdy1tZW51IGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIERyb3Bkb3duU29ydCAoY29udGFpbmVyKXtcclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgdGhpcy5idXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcclxuXHJcbiAgICAvLyBpZiBubyB2YWx1ZSBpcyBzZWxlY3RlZCwgY2hvb3NlIGZpcnN0IG9wdGlvblxyXG4gICAgaWYoIXRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy1saXN0IGxpIGJ1dHRvblthcmlhLWN1cnJlbnQ9XCJ0cnVlXCJdJykpe1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vdmVyZmxvdy1saXN0IGxpIGJ1dHRvbicpWzBdLnNldEF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50JywgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRWYWx1ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIGNsaWNrIGV2ZW50cyBvbiBvdmVyZmxvdyBtZW51IGFuZCBvcHRpb25zIGluIG1lbnVcclxuICovXHJcbkRyb3Bkb3duU29ydC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLm92ZXJmbG93TWVudSA9IG5ldyBEcm9wZG93bih0aGlzLmJ1dHRvbikuaW5pdCgpO1xyXG5cclxuICAgIGxldCBzb3J0aW5nT3B0aW9ucyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vdmVyZmxvdy1saXN0IGxpIGJ1dHRvbicpO1xyXG4gICAgZm9yKGxldCBzID0gMDsgcyA8IHNvcnRpbmdPcHRpb25zLmxlbmd0aDsgcysrKXtcclxuICAgICAgICBsZXQgb3B0aW9uID0gc29ydGluZ09wdGlvbnNbc107XHJcbiAgICAgICAgb3B0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbk9wdGlvbkNsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIGJ1dHRvbiB0ZXh0IHRvIHNlbGVjdGVkIHZhbHVlXHJcbiAqL1xyXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLnVwZGF0ZVNlbGVjdGVkVmFsdWUgPSBmdW5jdGlvbigpe1xyXG4gICAgbGV0IHNlbGVjdGVkSXRlbSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy1saXN0IGxpIGJ1dHRvblthcmlhLWN1cnJlbnQ9XCJ0cnVlXCJdJyk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbGVjdGVkLXZhbHVlJylbMF0uaW5uZXJUZXh0ID0gc2VsZWN0ZWRJdGVtLmlubmVyVGV4dDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyaWdnZXJzIHdoZW4gY2hvb3Npbmcgb3B0aW9uIGluIG1lbnVcclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGVcclxuICovXHJcbkRyb3Bkb3duU29ydC5wcm90b3R5cGUub25PcHRpb25DbGljayA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgbGV0IGxpID0gZS50YXJnZXQucGFyZW50Tm9kZTtcclxuICAgIGxpLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignbGkgYnV0dG9uW2FyaWEtY3VycmVudD1cInRydWVcIl0nKS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcpO1xyXG4gICAgbGkucXVlcnlTZWxlY3RvckFsbCgnLm92ZXJmbG93LWxpc3QgbGkgYnV0dG9uJylbMF0uc2V0QXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnLCAndHJ1ZScpO1xyXG5cclxuICAgIGxldCBidXR0b24gPSBsaS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdO1xyXG4gICAgbGV0IGV2ZW50U2VsZWN0ZWQgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5zZWxlY3RlZCcpO1xyXG4gICAgZXZlbnRTZWxlY3RlZC5kZXRhaWwgPSB0aGlzLnRhcmdldDtcclxuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50U2VsZWN0ZWQpO1xyXG4gICAgdGhpcy51cGRhdGVTZWxlY3RlZFZhbHVlKCk7XHJcblxyXG4gICAgLy8gaGlkZSBtZW51XHJcbiAgICBsZXQgb3ZlcmZsb3dNZW51ID0gbmV3IERyb3Bkb3duKGJ1dHRvbik7XHJcbiAgICBvdmVyZmxvd01lbnUuaGlkZSgpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93blNvcnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYnJlYWtwb2ludHMgPSByZXF1aXJlKCcuLi91dGlscy9icmVha3BvaW50cycpO1xyXG5jb25zdCBCVVRUT04gPSAnLmJ1dHRvbi1vdmVyZmxvdy1tZW51JztcclxuY29uc3QganNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIgPSAnanMtZHJvcGRvd24tLXJlc3BvbnNpdmUtY29sbGFwc2UnOyAvL29wdGlvbjogbWFrZSBkcm9wZG93biBiZWhhdmUgYXMgdGhlIGNvbGxhcHNlIGNvbXBvbmVudCB3aGVuIG9uIHNtYWxsIHNjcmVlbnMgKHVzZWQgYnkgc3VibWVudXMgaW4gdGhlIGhlYWRlciBhbmQgc3RlcC1kcm9wZG93bikuXHJcbmNvbnN0IFRBUkdFVCA9ICdkYXRhLWpzLXRhcmdldCc7XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gb3ZlcmZsb3cgbWVudSBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uRWxlbWVudCBPdmVyZmxvdyBtZW51IGJ1dHRvblxyXG4gKi9cclxuZnVuY3Rpb24gRHJvcGRvd24gKGJ1dHRvbkVsZW1lbnQpIHtcclxuICB0aGlzLmJ1dHRvbkVsZW1lbnQgPSBidXR0b25FbGVtZW50O1xyXG4gIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG4gIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgaWYodGhpcy5idXR0b25FbGVtZW50ID09PSBudWxsIHx8dGhpcy5idXR0b25FbGVtZW50ID09PSB1bmRlZmluZWQpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBidXR0b24gZm9yIG92ZXJmbG93IG1lbnUgY29tcG9uZW50LmApO1xyXG4gIH1cclxuICBsZXQgdGFyZ2V0QXR0ciA9IHRoaXMuYnV0dG9uRWxlbWVudC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICBpZih0YXJnZXRBdHRyID09PSBudWxsIHx8IHRhcmdldEF0dHIgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dHJpYnV0ZSBjb3VsZCBub3QgYmUgZm91bmQgb24gb3ZlcmZsb3cgbWVudSBjb21wb25lbnQ6ICcrVEFSR0VUKTtcclxuICB9XHJcbiAgbGV0IHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcclxuICBpZih0YXJnZXRFbCA9PT0gbnVsbCB8fCB0YXJnZXRFbCA9PT0gdW5kZWZpbmVkKXtcclxuICAgIHRocm93IG5ldyBFcnJvcignUGFuZWwgZm9yIG92ZXJmbG93IG1lbnUgY29tcG9uZW50IGNvdWxkIG5vdCBiZSBmb3VuZC4nKTtcclxuICB9XHJcbiAgdGhpcy50YXJnZXRFbCA9IHRhcmdldEVsO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGNsaWNrIGV2ZW50c1xyXG4gKi9cclxuRHJvcGRvd24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcclxuICBpZih0aGlzLmJ1dHRvbkVsZW1lbnQgIT09IG51bGwgJiYgdGhpcy5idXR0b25FbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgdGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG5cclxuICAgIGlmKHRoaXMuYnV0dG9uRWxlbWVudC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpIHx8IHRoaXMuYnV0dG9uRWxlbWVudC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgICAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9DbGlja2VkIG91dHNpZGUgZHJvcGRvd24gLT4gY2xvc2UgaXRcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbG9zZSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgLy9DbGlja2VkIG9uIGRyb3Bkb3duIG9wZW4gYnV0dG9uIC0tPiB0b2dnbGUgaXRcclxuICAgIHRoaXMuYnV0dG9uRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcclxuICAgIHRoaXMuYnV0dG9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcclxuICAgIGxldCAkbW9kdWxlID0gdGhpcztcclxuICAgIC8vIHNldCBhcmlhLWhpZGRlbiBjb3JyZWN0bHkgZm9yIHNjcmVlbnJlYWRlcnMgKFRyaW5ndWlkZSByZXNwb25zaXZlKVxyXG4gICAgaWYodGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkge1xyXG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuYnV0dG9uRWxlbWVudDtcclxuICAgICAgaWYgKHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlcikge1xyXG4gICAgICAgIC8vIHRyaWdnZXIgZXZlbnQgd2hlbiBidXR0b24gY2hhbmdlcyB2aXNpYmlsaXR5XHJcbiAgICAgICAgbGV0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChlbnRyaWVzKSB7XHJcbiAgICAgICAgICAvLyBidXR0b24gaXMgdmlzaWJsZVxyXG4gICAgICAgICAgaWYgKGVudHJpZXNbIDAgXS5pbnRlcnNlY3Rpb25SYXRpbykge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGJ1dHRvbiBpcyBub3QgdmlzaWJsZVxyXG4gICAgICAgICAgICBpZiAoJG1vZHVsZS50YXJnZXRFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgcm9vdDogZG9jdW1lbnQuYm9keVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gSUU6IEludGVyc2VjdGlvbk9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQsIHNvIHdlIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBhbmQgZ3JpZCBicmVha3BvaW50IGluc3RlYWRcclxuICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UoJG1vZHVsZS50cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgICAvLyBzbWFsbCBzY3JlZW5cclxuICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBMYXJnZSBzY3JlZW5cclxuICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKCRtb2R1bGUudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgY2xvc2VPbkVzY2FwZSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGNsb3NlT25Fc2NhcGUpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGUgb3ZlcmZsb3cgbWVudVxyXG4gKi9cclxuRHJvcGRvd24ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gIHRvZ2dsZSh0aGlzLmJ1dHRvbkVsZW1lbnQpO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyBvdmVyZmxvdyBtZW51XHJcbiAqL1xyXG5Ecm9wZG93bi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCl7XHJcbiAgdG9nZ2xlKHRoaXMuYnV0dG9uRWxlbWVudCk7XHJcbn1cclxuXHJcbmxldCBjbG9zZU9uRXNjYXBlID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gIGlmIChrZXkgPT09IDI3KSB7XHJcbiAgICBjbG9zZUFsbChldmVudCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBBcnJheSBvZiBidXR0b24gZWxlbWVudHMgYmVsb25naW5nIGRpcmVjdGx5IHRvIHRoZSBnaXZlblxyXG4gKiBhY2NvcmRpb24gZWxlbWVudC5cclxuICogQHBhcmFtIHBhcmVudCBhY2NvcmRpb24gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Tm9kZUxpc3RPZjxTVkdFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxIVE1MRWxlbWVudFRhZ05hbWVNYXBbW3N0cmluZ11dPiB8IE5vZGVMaXN0T2Y8RWxlbWVudD59XHJcbiAqL1xyXG5sZXQgZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcclxuICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9zZSBhbGwgb3ZlcmZsb3cgbWVudXNcclxuICogQHBhcmFtIHtldmVudH0gZXZlbnQgZGVmYXVsdCBpcyBudWxsXHJcbiAqL1xyXG5sZXQgY2xvc2VBbGwgPSBmdW5jdGlvbiAoZXZlbnQgPSBudWxsKXtcclxuICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xyXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcblxyXG4gIGxldCBvdmVyZmxvd01lbnVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LW1lbnUnKTtcclxuICBmb3IgKGxldCBvaSA9IDA7IG9pIDwgb3ZlcmZsb3dNZW51RWwubGVuZ3RoOyBvaSsrKSB7XHJcbiAgICBsZXQgY3VycmVudE92ZXJmbG93TWVudUVMID0gb3ZlcmZsb3dNZW51RWxbIG9pIF07XHJcbiAgICBsZXQgdHJpZ2dlckVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLnF1ZXJ5U2VsZWN0b3IoQlVUVE9OKydbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCl7XHJcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICBsZXQgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCkucmVwbGFjZSgnIycsICcnKSk7XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IG51bGwpIHtcclxuICAgICAgICAgIGlmKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkpe1xyXG4gICAgICAgICAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZihjaGFuZ2VkICYmIGV2ZW50ICE9PSBudWxsKXtcclxuICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gIH1cclxufTtcclxubGV0IG9mZnNldCA9IGZ1bmN0aW9uIChlbCkge1xyXG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcbiAgICBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxyXG4gICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgcmV0dXJuIHsgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9O1xyXG59O1xyXG5cclxubGV0IHRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKGV2ZW50LCBmb3JjZUNsb3NlID0gZmFsc2UpIHtcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICB0b2dnbGUodGhpcywgZm9yY2VDbG9zZSk7XHJcblxyXG59O1xyXG5cclxubGV0IHRvZ2dsZSA9IGZ1bmN0aW9uKGJ1dHRvbiwgZm9yY2VDbG9zZSA9IGZhbHNlKXtcclxuICBsZXQgdHJpZ2dlckVsID0gYnV0dG9uO1xyXG4gIGxldCB0YXJnZXRFbCA9IG51bGw7XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIC8vY2hhbmdlIHN0YXRlXHJcblxyXG4gICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9IG51bGw7XHJcbiAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9IG51bGw7XHJcblxyXG4gICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgZm9yY2VDbG9zZSl7XHJcbiAgICAgIC8vY2xvc2VcclxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7ICAgICAgXHJcbiAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgXHJcbiAgICAgIGlmKCFkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5jb250YWlucygnbW9iaWxlX25hdi1hY3RpdmUnKSl7XHJcbiAgICAgICAgY2xvc2VBbGwoKTtcclxuICAgICAgfVxyXG4gICAgICAvL29wZW5cclxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5vcGVuJyk7XHJcbiAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICAgIGxldCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYodGFyZ2V0T2Zmc2V0LmxlZnQgPCAwKXtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHJpZ2h0ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgb2Zmc2V0QWdhaW4gPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYob2Zmc2V0QWdhaW4ubGVmdCA8IDApe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgcmlnaHQgPSBvZmZzZXRBZ2Fpbi5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG59XHJcblxyXG5sZXQgaGFzUGFyZW50ID0gZnVuY3Rpb24gKGNoaWxkLCBwYXJlbnRUYWdOYW1lKXtcclxuICBpZihjaGlsZC5wYXJlbnROb2RlLnRhZ05hbWUgPT09IHBhcmVudFRhZ05hbWUpe1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIGlmKHBhcmVudFRhZ05hbWUgIT09ICdCT0RZJyAmJiBjaGlsZC5wYXJlbnROb2RlLnRhZ05hbWUgIT09ICdCT0RZJyl7XHJcbiAgICByZXR1cm4gaGFzUGFyZW50KGNoaWxkLnBhcmVudE5vZGUsIHBhcmVudFRhZ05hbWUpO1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmxldCBvdXRzaWRlQ2xvc2UgPSBmdW5jdGlvbiAoZXZ0KXtcclxuICBpZighZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ21vYmlsZV9uYXYtYWN0aXZlJykpe1xyXG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keS5tb2JpbGVfbmF2LWFjdGl2ZScpID09PSBudWxsICYmICFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYnV0dG9uLW1lbnUtY2xvc2UnKSkge1xyXG4gICAgICBsZXQgb3BlbkRyb3Bkb3ducyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKydbYXJpYS1leHBhbmRlZD10cnVlXScpO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5Ecm9wZG93bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgdHJpZ2dlckVsID0gb3BlbkRyb3Bkb3duc1tpXTtcclxuICAgICAgICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xyXG4gICAgICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgICAgIGlmICh0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgaWYodGFyZ2V0QXR0ci5pbmRleE9mKCcjJykgIT09IC0xKXtcclxuICAgICAgICAgICAgdGFyZ2V0QXR0ciA9IHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0cmlnZ2VyRWwpIHx8IChoYXNQYXJlbnQodHJpZ2dlckVsLCAnSEVBREVSJykgJiYgIWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVybGF5JykpKSB7XHJcbiAgICAgICAgICAvL2Nsb3NlcyBkcm9wZG93biB3aGVuIGNsaWNrZWQgb3V0c2lkZVxyXG4gICAgICAgICAgaWYgKGV2dC50YXJnZXQgIT09IHRyaWdnZXJFbCkge1xyXG4gICAgICAgICAgICAvL2NsaWNrZWQgb3V0c2lkZSB0cmlnZ2VyLCBmb3JjZSBjbG9zZVxyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubGV0IGRvUmVzcG9uc2l2ZUNvbGxhcHNlID0gZnVuY3Rpb24gKHRyaWdnZXJFbCl7XHJcbiAgaWYoIXRyaWdnZXJFbC5jbGFzc0xpc3QuY29udGFpbnMoanNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIpKXtcclxuICAgIC8vIG5vdCBuYXYgb3ZlcmZsb3cgbWVudVxyXG4gICAgaWYodHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykgfHwgdHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpIHtcclxuICAgICAgLy8gdHJpbmluZGlrYXRvciBvdmVyZmxvdyBtZW51XHJcbiAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBnZXRUcmluZ3VpZGVCcmVha3BvaW50KHRyaWdnZXJFbCkpIHtcclxuICAgICAgICAvLyBvdmVyZmxvdyBtZW51IHDDpSByZXNwb25zaXYgdHJpbmd1aWRlIGFrdGl2ZXJldFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2V7XHJcbiAgICAgIC8vIG5vcm1hbCBvdmVyZmxvdyBtZW51XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubGV0IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQgPSBmdW5jdGlvbiAoYnV0dG9uKXtcclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICByZXR1cm4gYnJlYWtwb2ludHMubWQ7XHJcbiAgfVxyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgIHJldHVybiBicmVha3BvaW50cy5sZztcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93bjsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBIYW5kbGUgZm9jdXMgb24gaW5wdXQgZWxlbWVudHMgdXBvbiBjbGlja2luZyBsaW5rIGluIGVycm9yIG1lc3NhZ2VcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFcnJvciBzdW1tYXJ5IGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIEVycm9yU3VtbWFyeSAoZWxlbWVudCkge1xyXG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzIG9uIGxpbmtzIGluIGVycm9yIHN1bW1hcnlcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHRoaXMuZWxlbWVudC5mb2N1cygpXHJcblxyXG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKSlcclxufVxyXG5cclxuLyoqXHJcbiogQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4qXHJcbiogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIENsaWNrIGV2ZW50XHJcbiovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XHJcbiAgaWYgKHRoaXMuZm9jdXNUYXJnZXQodGFyZ2V0KSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEZvY3VzIHRoZSB0YXJnZXQgZWxlbWVudFxyXG4gKlxyXG4gKiBCeSBkZWZhdWx0LCB0aGUgYnJvd3NlciB3aWxsIHNjcm9sbCB0aGUgdGFyZ2V0IGludG8gdmlldy4gQmVjYXVzZSBvdXIgbGFiZWxzXHJcbiAqIG9yIGxlZ2VuZHMgYXBwZWFyIGFib3ZlIHRoZSBpbnB1dCwgdGhpcyBtZWFucyB0aGUgdXNlciB3aWxsIGJlIHByZXNlbnRlZCB3aXRoXHJcbiAqIGFuIGlucHV0IHdpdGhvdXQgYW55IGNvbnRleHQsIGFzIHRoZSBsYWJlbCBvciBsZWdlbmQgd2lsbCBiZSBvZmYgdGhlIHRvcCBvZlxyXG4gKiB0aGUgc2NyZWVuLlxyXG4gKlxyXG4gKiBNYW51YWxseSBoYW5kbGluZyB0aGUgY2xpY2sgZXZlbnQsIHNjcm9sbGluZyB0aGUgcXVlc3Rpb24gaW50byB2aWV3IGFuZCB0aGVuXHJcbiAqIGZvY3Vzc2luZyB0aGUgZWxlbWVudCBzb2x2ZXMgdGhpcy5cclxuICpcclxuICogVGhpcyBhbHNvIHJlc3VsdHMgaW4gdGhlIGxhYmVsIGFuZC9vciBsZWdlbmQgYmVpbmcgYW5ub3VuY2VkIGNvcnJlY3RseSBpblxyXG4gKiBOVkRBIChhcyB0ZXN0ZWQgaW4gMjAxOC4zLjIpIC0gd2l0aG91dCB0aGlzIG9ubHkgdGhlIGZpZWxkIHR5cGUgaXMgYW5ub3VuY2VkXHJcbiAqIChlLmcuIFwiRWRpdCwgaGFzIGF1dG9jb21wbGV0ZVwiKS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJHRhcmdldCAtIEV2ZW50IHRhcmdldFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdGFyZ2V0IHdhcyBhYmxlIHRvIGJlIGZvY3Vzc2VkXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmZvY3VzVGFyZ2V0ID0gZnVuY3Rpb24gKCR0YXJnZXQpIHtcclxuICAvLyBJZiB0aGUgZWxlbWVudCB0aGF0IHdhcyBjbGlja2VkIHdhcyBub3QgYSBsaW5rLCByZXR1cm4gZWFybHlcclxuICBpZiAoJHRhcmdldC50YWdOYW1lICE9PSAnQScgfHwgJHRhcmdldC5ocmVmID09PSBmYWxzZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgaW5wdXRJZCA9IHRoaXMuZ2V0RnJhZ21lbnRGcm9tVXJsKCR0YXJnZXQuaHJlZilcclxuICB2YXIgJGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZClcclxuICBpZiAoISRpbnB1dCkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgJGxlZ2VuZE9yTGFiZWwgPSB0aGlzLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsKCRpbnB1dClcclxuICBpZiAoISRsZWdlbmRPckxhYmVsKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIC8vIFNjcm9sbCB0aGUgbGVnZW5kIG9yIGxhYmVsIGludG8gdmlldyAqYmVmb3JlKiBjYWxsaW5nIGZvY3VzIG9uIHRoZSBpbnB1dCB0b1xyXG4gIC8vIGF2b2lkIGV4dHJhIHNjcm9sbGluZyBpbiBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgYHByZXZlbnRTY3JvbGxgICh3aGljaFxyXG4gIC8vIGF0IHRpbWUgb2Ygd3JpdGluZyBpcyBtb3N0IG9mIHRoZW0uLi4pXHJcbiAgJGxlZ2VuZE9yTGFiZWwuc2Nyb2xsSW50b1ZpZXcoKVxyXG4gICRpbnB1dC5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSlcclxuXHJcbiAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBmcmFnbWVudCBmcm9tIFVSTFxyXG4gKlxyXG4gKiBFeHRyYWN0IHRoZSBmcmFnbWVudCAoZXZlcnl0aGluZyBhZnRlciB0aGUgaGFzaCkgZnJvbSBhIFVSTCwgYnV0IG5vdCBpbmNsdWRpbmdcclxuICogdGhlIGhhc2guXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBVUkxcclxuICogQHJldHVybnMge3N0cmluZ30gRnJhZ21lbnQgZnJvbSBVUkwsIHdpdGhvdXQgdGhlIGhhc2hcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZ2V0RnJhZ21lbnRGcm9tVXJsID0gZnVuY3Rpb24gKHVybCkge1xyXG4gIGlmICh1cmwuaW5kZXhPZignIycpID09PSAtMSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdXJsLnNwbGl0KCcjJykucG9wKClcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbFxyXG4gKlxyXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgZXhpc3RzIGZyb20gdGhpcyBsaXN0OlxyXG4gKlxyXG4gKiAtIFRoZSBgPGxlZ2VuZD5gIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xvc2VzdCBgPGZpZWxkc2V0PmAgYW5jZXN0b3IsIGFzIGxvbmdcclxuICogICBhcyB0aGUgdG9wIG9mIGl0IGlzIG5vIG1vcmUgdGhhbiBoYWxmIGEgdmlld3BvcnQgaGVpZ2h0IGF3YXkgZnJvbSB0aGVcclxuICogICBib3R0b20gb2YgdGhlIGlucHV0XHJcbiAqIC0gVGhlIGZpcnN0IGA8bGFiZWw+YCB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQgdXNpbmcgZm9yPVwiaW5wdXRJZFwiXHJcbiAqIC0gVGhlIGNsb3Nlc3QgcGFyZW50IGA8bGFiZWw+YFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkaW5wdXQgLSBUaGUgaW5wdXRcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBBc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbCwgb3IgbnVsbCBpZiBubyBhc3NvY2lhdGVkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kIG9yIGxhYmVsIGNhbiBiZSBmb3VuZFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRBc3NvY2lhdGVkTGVnZW5kT3JMYWJlbCA9IGZ1bmN0aW9uICgkaW5wdXQpIHtcclxuICB2YXIgJGZpZWxkc2V0ID0gJGlucHV0LmNsb3Nlc3QoJ2ZpZWxkc2V0JylcclxuXHJcbiAgaWYgKCRmaWVsZHNldCkge1xyXG4gICAgdmFyIGxlZ2VuZHMgPSAkZmllbGRzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xlZ2VuZCcpXHJcblxyXG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoKSB7XHJcbiAgICAgIHZhciAkY2FuZGlkYXRlTGVnZW5kID0gbGVnZW5kc1swXVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGlucHV0IHR5cGUgaXMgcmFkaW8gb3IgY2hlY2tib3gsIGFsd2F5cyB1c2UgdGhlIGxlZ2VuZCBpZiB0aGVyZVxyXG4gICAgICAvLyBpcyBvbmUuXHJcbiAgICAgIGlmICgkaW5wdXQudHlwZSA9PT0gJ2NoZWNrYm94JyB8fCAkaW5wdXQudHlwZSA9PT0gJ3JhZGlvJykge1xyXG4gICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZvciBvdGhlciBpbnB1dCB0eXBlcywgb25seSBzY3JvbGwgdG8gdGhlIGZpZWxkc2V04oCZcyBsZWdlbmQgKGluc3RlYWQgb2ZcclxuICAgICAgLy8gdGhlIGxhYmVsIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQpIGlmIHRoZSBpbnB1dCB3b3VsZCBlbmQgdXAgaW4gdGhlXHJcbiAgICAgIC8vIHRvcCBoYWxmIG9mIHRoZSBzY3JlZW4uXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRoaXMgc2hvdWxkIGF2b2lkIHNpdHVhdGlvbnMgd2hlcmUgdGhlIGlucHV0IGVpdGhlciBlbmRzIHVwIG9mZiB0aGVcclxuICAgICAgLy8gc2NyZWVuLCBvciBvYnNjdXJlZCBieSBhIHNvZnR3YXJlIGtleWJvYXJkLlxyXG4gICAgICB2YXIgbGVnZW5kVG9wID0gJGNhbmRpZGF0ZUxlZ2VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcclxuICAgICAgdmFyIGlucHV0UmVjdCA9ICRpbnB1dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XHJcbiAgICAgIC8vIG9yIHdpbmRvdy5pbm5lckhlaWdodCAobGlrZSBJRTgpLCBiYWlsIGFuZCBqdXN0IGxpbmsgdG8gdGhlIGxhYmVsLlxyXG4gICAgICBpZiAoaW5wdXRSZWN0LmhlaWdodCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgICB2YXIgaW5wdXRCb3R0b20gPSBpbnB1dFJlY3QudG9wICsgaW5wdXRSZWN0LmhlaWdodFxyXG5cclxuICAgICAgICBpZiAoaW5wdXRCb3R0b20gLSBsZWdlbmRUb3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGNhbmRpZGF0ZUxlZ2VuZFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFtmb3I9J1wiICsgJGlucHV0LmdldEF0dHJpYnV0ZSgnaWQnKSArIFwiJ11cIikgfHxcclxuICAgICRpbnB1dC5jbG9zZXN0KCdsYWJlbCcpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVycm9yU3VtbWFyeTsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gbW9kYWxcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJG1vZGFsIE1vZGFsIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIE1vZGFsICgkbW9kYWwpIHtcclxuICAgIHRoaXMuJG1vZGFsID0gJG1vZGFsO1xyXG4gICAgbGV0IGlkID0gdGhpcy4kbW9kYWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgdGhpcy50cmlnZ2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZT1cIm1vZGFsXCJdW2RhdGEtdGFyZ2V0PVwiJytpZCsnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzXHJcbiAqL1xyXG5Nb2RhbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHJpZ2dlcnMgPSB0aGlzLnRyaWdnZXJzO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpZ2dlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IHRyaWdnZXIgPSB0cmlnZ2Vyc1sgaSBdO1xyXG4gICAgdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgbGV0IGNsb3NlcnMgPSB0aGlzLiRtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbC1jbG9zZV0nKTtcclxuICBmb3IgKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspe1xyXG4gICAgbGV0IGNsb3NlciA9IGNsb3NlcnNbIGMgXTtcclxuICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSBtb2RhbFxyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5oaWRkZW4nLCB0cnVlLCB0cnVlKTtcclxuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG5cclxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcD8ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCgkYmFja2Ryb3ApO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBGb2N1cywgdHJ1ZSk7XHJcblxyXG4gICAgaWYoIWhhc0ZvcmNlZEFjdGlvbihtb2RhbEVsZW1lbnQpKXtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVFc2NhcGUpO1xyXG4gICAgfVxyXG4gICAgbGV0IGRhdGFNb2RhbE9wZW5lciA9IG1vZGFsRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJyk7XHJcbiAgICBpZihkYXRhTW9kYWxPcGVuZXIgIT09IG51bGwpe1xyXG4gICAgICBsZXQgb3BlbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YU1vZGFsT3BlbmVyKVxyXG4gICAgICBpZihvcGVuZXIgIT09IG51bGwpe1xyXG4gICAgICAgIG9wZW5lci5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICAgIG1vZGFsRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3cgbW9kYWxcclxuICovXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKGUgPSBudWxsKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIGlmKGUgIT09IG51bGwpe1xyXG4gICAgICBsZXQgb3BlbmVySWQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgIGlmKG9wZW5lcklkID09PSBudWxsKXtcclxuICAgICAgICBvcGVuZXJJZCA9ICdtb2RhbC1vcGVuZXItJytNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTk5OSAtIDEwMDAgKyAxKSArIDEwMDApO1xyXG4gICAgICAgIGUudGFyZ2V0LnNldEF0dHJpYnV0ZSgnaWQnLCBvcGVuZXJJZClcclxuICAgICAgfVxyXG4gICAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicsIG9wZW5lcklkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIaWRlIG9wZW4gbW9kYWxzIC0gRkRTIGRvIG5vdCByZWNvbW1lbmQgbW9yZSB0aGFuIG9uZSBvcGVuIG1vZGFsIGF0IGEgdGltZVxyXG4gICAgbGV0IGFjdGl2ZU1vZGFscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYWN0aXZlTW9kYWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgbmV3IE1vZGFsKGFjdGl2ZU1vZGFsc1tpXSkuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG5cclxuICAgIGxldCBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIGV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5zaG93bicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuXHJcbiAgICBsZXQgJGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAkYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2lkJywgXCJtb2RhbC1iYWNrZHJvcFwiKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuXHJcbiAgICBtb2RhbEVsZW1lbnQuZm9jdXMoKTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcEZvY3VzLCB0cnVlKTtcclxuICAgIGlmKCFoYXNGb3JjZWRBY3Rpb24obW9kYWxFbGVtZW50KSl7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsb3NlIG1vZGFsIHdoZW4gaGl0dGluZyBFU0NcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmxldCBoYW5kbGVFc2NhcGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICBsZXQgY3VycmVudE1vZGFsID0gbmV3IE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJykpO1xyXG4gIGlmIChrZXkgPT09IDI3KXtcclxuICAgIGxldCBwb3NzaWJsZU92ZXJmbG93TWVudXMgPSBtb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJ1dHRvbi1vdmVyZmxvdy1tZW51W2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZihwb3NzaWJsZU92ZXJmbG93TWVudXMubGVuZ3RoID09PSAwKXtcclxuICAgICAgY3VycmVudE1vZGFsLmhpZGUoKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVHJhcCBmb2N1cyBpbiBtb2RhbCB3aGVuIG9wZW5cclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGVcclxuICovXHJcbiBmdW5jdGlvbiB0cmFwRm9jdXMoZSl7XHJcbiAgdmFyIGN1cnJlbnREaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gIGlmKGN1cnJlbnREaWFsb2cgIT09IG51bGwpe1xyXG4gICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gY3VycmVudERpYWxvZy5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZdOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBkZXRhaWxzOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKScpO1xyXG4gICAgXHJcbiAgICB2YXIgZmlyc3RGb2N1c2FibGVFbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbMF07XHJcbiAgICB2YXIgbGFzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICB2YXIgaXNUYWJQcmVzc2VkID0gKGUua2V5ID09PSAnVGFiJyB8fCBlLmtleUNvZGUgPT09IDkpO1xyXG5cclxuICAgIGlmICghaXNUYWJQcmVzc2VkKSB7IFxyXG4gICAgICByZXR1cm47IFxyXG4gICAgfVxyXG5cclxuICAgIGlmICggZS5zaGlmdEtleSApIC8qIHNoaWZ0ICsgdGFiICovIHtcclxuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xyXG4gICAgICAgIGxhc3RGb2N1c2FibGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSAvKiB0YWIgKi8ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdEZvY3VzYWJsZUVsZW1lbnQpIHtcclxuICAgICAgICBmaXJzdEZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGhhc0ZvcmNlZEFjdGlvbiAobW9kYWwpe1xyXG4gIGlmKG1vZGFsLmdldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1mb3JjZWQtYWN0aW9uJykgPT09IG51bGwpe1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTW9kYWw7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcblxyXG5jb25zdCBOQVYgPSBgLm5hdmA7XHJcbmNvbnN0IE5BVl9MSU5LUyA9IGAke05BVn0gYWA7XHJcbmNvbnN0IE9QRU5FUlMgPSBgLmpzLW1lbnUtb3BlbmA7XHJcbmNvbnN0IENMT1NFX0JVVFRPTiA9IGAuanMtbWVudS1jbG9zZWA7XHJcbmNvbnN0IE9WRVJMQVkgPSBgLm92ZXJsYXlgO1xyXG5jb25zdCBDTE9TRVJTID0gYCR7Q0xPU0VfQlVUVE9OfSwgLm92ZXJsYXlgO1xyXG5jb25zdCBUT0dHTEVTID0gWyBOQVYsIE9WRVJMQVkgXS5qb2luKCcsICcpO1xyXG5cclxuY29uc3QgQUNUSVZFX0NMQVNTID0gJ21vYmlsZV9uYXYtYWN0aXZlJztcclxuY29uc3QgVklTSUJMRV9DTEFTUyA9ICdpcy12aXNpYmxlJztcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9iaWxlIG1lbnUgZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuY2xhc3MgTmF2aWdhdGlvbiB7XHJcbiAgLyoqXHJcbiAgICogU2V0IGV2ZW50c1xyXG4gICAqL1xyXG4gIGluaXQgKCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG1vYmlsZU1lbnUsIGZhbHNlKTtcclxuICAgIG1vYmlsZU1lbnUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBldmVudHNcclxuICAgKi9cclxuICB0ZWFyZG93biAoKSB7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbW9iaWxlTWVudSwgZmFsc2UpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIG1vYmlsZSBtZW51XHJcbiAqL1xyXG5jb25zdCBtb2JpbGVNZW51ID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IG1vYmlsZSA9IGZhbHNlO1xyXG4gIGxldCBvcGVuZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChPUEVORVJTKTtcclxuICBmb3IobGV0IG8gPSAwOyBvIDwgb3BlbmVycy5sZW5ndGg7IG8rKykge1xyXG4gICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUob3BlbmVyc1tvXSwgbnVsbCkuZGlzcGxheSAhPT0gJ25vbmUnKSB7XHJcbiAgICAgIG9wZW5lcnNbb10uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xyXG4gICAgICBtb2JpbGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaWYgbW9iaWxlXHJcbiAgaWYobW9iaWxlKXtcclxuICAgIGxldCBjbG9zZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChDTE9TRVJTKTtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgIGNsb3NlcnNbIGMgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU5hdik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5hdkxpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVZfTElOS1MpO1xyXG4gICAgZm9yKGxldCBuID0gMDsgbiA8IG5hdkxpbmtzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgIG5hdkxpbmtzWyBuIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIEEgbmF2aWdhdGlvbiBsaW5rIGhhcyBiZWVuIGNsaWNrZWQhIFdlIHdhbnQgdG8gY29sbGFwc2UgYW55XHJcbiAgICAgICAgLy8gaGllcmFyY2hpY2FsIG5hdmlnYXRpb24gVUkgaXQncyBhIHBhcnQgb2YsIHNvIHRoYXQgdGhlIHVzZXJcclxuICAgICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxyXG5cclxuICAgICAgICAvLyBTb21lIG5hdmlnYXRpb24gbGlua3MgYXJlIGluc2lkZSBkcm9wZG93bnM7IHdoZW4gdGhleSdyZVxyXG4gICAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgZHJvcGRvd25zLlxyXG5cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXHJcbiAgICAgICAgaWYgKGlzQWN0aXZlKCkpIHtcclxuICAgICAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRyYXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVYpO1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRyYXBDb250YWluZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyc1tpXSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcblxyXG4gIGlmIChpc0FjdGl2ZSgpICYmIGNsb3NlciAmJiBjbG9zZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPT09IDApIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcclxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxyXG4gICAgLy8gaW4gbW9iaWxlIG1vZGUuIExldCdzIG1ha2UgdGhlIHBhZ2Ugc3RhdGUgY29uc2lzdGVudCBieVxyXG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxyXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIG1vYmlsZSBtZW51IGlzIGFjdGl2ZVxyXG4gKiBAcmV0dXJucyB0cnVlIGlmIG1vYmlsZSBtZW51IGlzIGFjdGl2ZSBhbmQgZmFsc2UgaWYgbm90IGFjdGl2ZVxyXG4gKi9cclxuY29uc3QgaXNBY3RpdmUgPSAoKSA9PiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhBQ1RJVkVfQ0xBU1MpO1xyXG5cclxuLyoqXHJcbiAqIFRyYXAgZm9jdXMgaW4gbW9iaWxlIG1lbnUgaWYgYWN0aXZlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRyYXBDb250YWluZXIgXHJcbiAqL1xyXG5jb25zdCBfZm9jdXNUcmFwID0gKHRyYXBDb250YWluZXIpID0+IHtcclxuXHJcbiAgLy8gRmluZCBhbGwgZm9jdXNhYmxlIGNoaWxkcmVuXHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xyXG4gIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XHJcbiAgbGV0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XHJcblxyXG4gIGZ1bmN0aW9uIHRyYXBUYWJLZXkgKGUpIHtcclxuICAgIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcclxuICAgIGlmIChrZXkgPT09IDkpIHtcclxuXHJcbiAgICAgIGxldCBsYXN0VGFiU3RvcCA9IG51bGw7XHJcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgbGV0IG51bWJlciA9IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1sgbnVtYmVyIC0gaSBdO1xyXG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gMCAmJiBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDApIHtcclxuICAgICAgICAgIGxhc3RUYWJTdG9wID0gZWxlbWVudDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU0hJRlQgKyBUQUJcclxuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRBQlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRVNDQVBFXHJcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XHJcbiAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbmFibGUgKCkge1xyXG4gICAgICAgIC8vIEZvY3VzIGZpcnN0IGNoaWxkXHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIC8vIExpc3RlbiBmb3IgYW5kIHRyYXAgdGhlIGtleWJvYXJkXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVsZWFzZSAoKSB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmxldCBmb2N1c1RyYXA7XHJcblxyXG5jb25zdCB0b2dnbGVOYXYgPSBmdW5jdGlvbiAoYWN0aXZlKSB7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xyXG4gICAgYWN0aXZlID0gIWlzQWN0aXZlKCk7XHJcbiAgfVxyXG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XHJcblxyXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XHJcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XHJcbiAgfSk7XHJcbiAgaWYgKGFjdGl2ZSkge1xyXG4gICAgZm9jdXNUcmFwLmVuYWJsZSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmb2N1c1RyYXAucmVsZWFzZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuICBjb25zdCBtZW51QnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKE9QRU5FUlMpO1xyXG5cclxuICBpZiAoYWN0aXZlICYmIGNsb3NlQnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBhY3RpdmF0ZWQsIHNvIGZvY3VzIG9uIHRoZSBjbG9zZSBidXR0b24sXHJcbiAgICAvLyB3aGljaCBpcyBqdXN0IGJlZm9yZSBhbGwgdGhlIG5hdiBlbGVtZW50cyBpbiB0aGUgdGFiIG9yZGVyLlxyXG4gICAgY2xvc2VCdXR0b24uZm9jdXMoKTtcclxuICB9IGVsc2UgaWYgKCFhY3RpdmUgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gY2xvc2VCdXR0b24gJiZcclxuICAgICAgICAgICAgIG1lbnVCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGRlYWN0aXZhdGVkLCBhbmQgZm9jdXMgd2FzIG9uIHRoZSBjbG9zZVxyXG4gICAgLy8gYnV0dG9uLCB3aGljaCBpcyBubyBsb25nZXIgdmlzaWJsZS4gV2UgZG9uJ3Qgd2FudCB0aGUgZm9jdXMgdG9cclxuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xyXG4gICAgLy8gdmlzaWJsZSAodGhpcyBtYXkgaGF2ZSBiZWVuIHdoYXQgdGhlIHVzZXIgd2FzIGp1c3QgZm9jdXNlZCBvbixcclxuICAgIC8vIGlmIHRoZXkgdHJpZ2dlcmVkIHRoZSBtb2JpbGUgbmF2IGJ5IG1pc3Rha2UpLlxyXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFjdGl2ZTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdmlnYXRpb247IiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUT0dHTEVfQVRUUklCVVRFID0gJ2RhdGEtY29udHJvbHMnO1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byByYWRpb2J1dHRvbiBjb2xsYXBzZSBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lckVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBSYWRpb1RvZ2dsZUdyb3VwKGNvbnRhaW5lckVsZW1lbnQpe1xyXG4gICAgdGhpcy5yYWRpb0dyb3VwID0gY29udGFpbmVyRWxlbWVudDtcclxuICAgIHRoaXMucmFkaW9FbHMgPSBudWxsO1xyXG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzXHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCl7XHJcbiAgICB0aGlzLnJhZGlvRWxzID0gdGhpcy5yYWRpb0dyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xyXG4gICAgaWYodGhpcy5yYWRpb0Vscy5sZW5ndGggPT09IDApe1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcmFkaW9idXR0b25zIGZvdW5kIGluIHJhZGlvYnV0dG9uIGdyb3VwLicpO1xyXG4gICAgfVxyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnJhZGlvRWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgcmFkaW8gPSB0aGlzLnJhZGlvRWxzWyBpIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgYSA9IDA7IGEgPCB0aGF0LnJhZGlvRWxzLmxlbmd0aDsgYSsrICl7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LnJhZGlvRWxzWyBhIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50b2dnbGUocmFkaW8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVG9nZ2xlIHJhZGlvYnV0dG9uIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYWRpb0lucHV0RWxlbWVudCBcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChyYWRpb0lucHV0RWxlbWVudCl7XHJcbiAgICB2YXIgY29udGVudElkID0gcmFkaW9JbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFRPR0dMRV9BVFRSSUJVVEUpO1xyXG4gICAgaWYoY29udGVudElkICE9PSBudWxsICYmIGNvbnRlbnRJZCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRJZCAhPT0gXCJcIil7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250ZW50SWQpO1xyXG4gICAgICAgIGlmKGNvbnRlbnRFbGVtZW50ID09PSBudWxsIHx8IGNvbnRlbnRFbGVtZW50ID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHBhbmVsIGVsZW1lbnQuIFZlcmlmeSB2YWx1ZSBvZiBhdHRyaWJ1dGUgYCsgVE9HR0xFX0FUVFJJQlVURSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50LmNoZWNrZWQpe1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRXhwYW5kIHJhZGlvIGJ1dHRvbiBjb250ZW50XHJcbiAqIEBwYXJhbSB7fSByYWRpb0lucHV0RWxlbWVudCBSYWRpbyBJbnB1dCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Kn0gY29udGVudEVsZW1lbnQgQ29udGVudCBlbGVtZW50XHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5leHBhbmQgPSBmdW5jdGlvbiAocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50ICE9PSBudWxsICYmIHJhZGlvSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudEVsZW1lbnQgIT09IG51bGwgJiYgY29udGVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLnJhZGlvLmV4cGFuZGVkJyk7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDb2xsYXBzZSByYWRpbyBidXR0b24gY29udGVudFxyXG4gKiBAcGFyYW0ge30gcmFkaW9JbnB1dEVsZW1lbnQgUmFkaW8gSW5wdXQgZWxlbWVudFxyXG4gKiBAcGFyYW0geyp9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgZWxlbWVudFxyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUuY29sbGFwc2UgPSBmdW5jdGlvbihyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xyXG4gICAgaWYocmFkaW9JbnB1dEVsZW1lbnQgIT09IG51bGwgJiYgcmFkaW9JbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnJhZGlvLmNvbGxhcHNlZCcpO1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJhZGlvVG9nZ2xlR3JvdXA7IiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xyXG4gIHNoaWZ0OiBmYWxzZSxcclxuICBhbHQ6IGZhbHNlLFxyXG4gIGN0cmw6IGZhbHNlLFxyXG4gIGNvbW1hbmQ6IGZhbHNlXHJcbn07XHJcbi8qXHJcbiogUHJldmVudHMgdGhlIHVzZXIgZnJvbSBpbnB1dHRpbmcgYmFzZWQgb24gYSByZWdleC5cclxuKiBEb2VzIG5vdCB3b3JrIHRoZSBzYW1lIHdheSBhZiA8aW5wdXQgcGF0dGVybj1cIlwiPiwgdGhpcyBwYXR0ZXJuIGlzIG9ubHkgdXNlZCBmb3IgdmFsaWRhdGlvbiwgbm90IHRvIHByZXZlbnQgaW5wdXQuXHJcbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cclxuKiBFeGFtcGxlIC0gbnVtYmVyIG9ubHk6IDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXQtcmVnZXg9XCJeXFxkKiRcIj5cclxuKi9cclxuY2xhc3MgSW5wdXRSZWdleE1hc2sge1xyXG4gIGNvbnN0cnVjdG9yIChlbGVtZW50KXtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCByZWdleE1hc2spO1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVnZXhNYXNrKTtcclxuICB9XHJcbn1cclxudmFyIHJlZ2V4TWFzayA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIGlmKG1vZGlmaWVyU3RhdGUuY3RybCB8fCBtb2RpZmllclN0YXRlLmNvbW1hbmQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG5ld0NoYXIgPSBudWxsO1xyXG4gIGlmKHR5cGVvZiBldmVudC5rZXkgIT09ICd1bmRlZmluZWQnKXtcclxuICAgIGlmKGV2ZW50LmtleS5sZW5ndGggPT09IDEpe1xyXG4gICAgICBuZXdDaGFyID0gZXZlbnQua2V5O1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZighZXZlbnQuY2hhckNvZGUpe1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5rZXlDb2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmNoYXJDb2RlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciByZWdleFN0ciA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LXJlZ2V4Jyk7XHJcblxyXG4gIGlmKGV2ZW50LnR5cGUgIT09IHVuZGVmaW5lZCAmJiBldmVudC50eXBlID09PSAncGFzdGUnKXtcclxuICAgIC8vY29uc29sZS5sb2coJ3Bhc3RlJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xyXG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IElucHV0UmVnZXhNYXNrOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MVGFibGVFbGVtZW50fSB0YWJsZSBUYWJsZSBFbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJsZVNlbGVjdGFibGVSb3dzICh0YWJsZSkge1xyXG4gIHRoaXMudGFibGUgPSB0YWJsZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgZXZlbnRsaXN0ZW5lcnMgZm9yIGNoZWNrYm94ZXMgaW4gdGFibGVcclxuICovXHJcblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMuZ3JvdXBDaGVja2JveCA9IHRoaXMuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIHRoaXMudGJvZHlDaGVja2JveExpc3QgPSB0aGlzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGlmKHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoICE9PSAwKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCB0aGlzLnRib2R5Q2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgbGV0IGNoZWNrYm94ID0gdGhpcy50Ym9keUNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgY2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XHJcbiAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUdyb3VwQ2hlY2spO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZih0aGlzLmdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIHRoaXMuZ3JvdXBDaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xyXG4gICAgdGhpcy5ncm91cENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoZWNrYm94TGlzdCk7XHJcbiAgfVxyXG59XHJcbiAgXHJcbi8qKlxyXG4gKiBHZXQgZ3JvdXAgY2hlY2tib3ggaW4gdGFibGUgaGVhZGVyXHJcbiAqIEByZXR1cm5zIGVsZW1lbnQgb24gdHJ1ZSAtIGZhbHNlIGlmIG5vdCBmb3VuZFxyXG4gKi9cclxuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuZ2V0R3JvdXBDaGVja2JveCA9IGZ1bmN0aW9uKCl7XHJcbiAgbGV0IGNoZWNrYm94ID0gdGhpcy50YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWNoZWNrYm94Jyk7XHJcbiAgaWYoY2hlY2tib3gubGVuZ3RoID09PSAwKXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIGNoZWNrYm94WzBdO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGFibGUgYm9keSBjaGVja2JveGVzXHJcbiAqIEByZXR1cm5zIEhUTUxDb2xsZWN0aW9uXHJcbiAqL1xyXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5nZXRDaGVja2JveExpc3QgPSBmdW5jdGlvbigpe1xyXG4gIHJldHVybiB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0Ym9keScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBjaGVja2JveGVzIGluIHRhYmxlIGJvZHkgd2hlbiBncm91cCBjaGVja2JveCBpcyBjaGFuZ2VkXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVDaGVja2JveExpc3QoZSl7XHJcbiAgbGV0IGNoZWNrYm94ID0gZS50YXJnZXQ7XHJcbiAgY2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIGxldCB0YWJsZVNlbGVjdGFibGVSb3dzID0gbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3ModGFibGUpO1xyXG4gIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGxldCBjaGVja2VkTnVtYmVyID0gMDtcclxuICBpZihjaGVja2JveC5jaGVja2VkKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBjaGVja2JveExpc3RbY10uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tlZE51bWJlciA9IGNoZWNrYm94TGlzdC5sZW5ndGg7XHJcbiAgfSBlbHNle1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgfSk7XHJcbiAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgZ3JvdXAgY2hlY2tib3ggd2hlbiBjaGVja2JveCBpbiB0YWJsZSBib2R5IGlzIGNoYW5nZWRcclxuICogQHBhcmFtIHtFdmVudH0gZSBcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUdyb3VwQ2hlY2soZSl7XHJcbiAgLy8gdXBkYXRlIGxhYmVsIGZvciBldmVudCBjaGVja2JveFxyXG4gIGlmKGUudGFyZ2V0LmNoZWNrZWQpe1xyXG4gICAgZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gIH0gZWxzZXtcclxuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICB9XHJcbiAgbGV0IHRhYmxlID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICBsZXQgdGFibGVTZWxlY3RhYmxlUm93cyA9IG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKHRhYmxlKTtcclxuICBsZXQgZ3JvdXBDaGVja2JveCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIGlmKGdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG5cclxuICAgIC8vIGhvdyBtYW55IHJvdyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgbGV0IGNoZWNrZWROdW1iZXIgPSAwO1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGxldCBsb29wZWRDaGVja2JveCA9IGNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgaWYobG9vcGVkQ2hlY2tib3guY2hlY2tlZCl7XHJcbiAgICAgICAgY2hlY2tlZE51bWJlcisrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKGNoZWNrZWROdW1iZXIgPT09IGNoZWNrYm94TGlzdC5sZW5ndGgpeyAvLyBpZiBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IHRydWU7XHJcbiAgICB9IGVsc2UgaWYoY2hlY2tlZE51bWJlciA9PSAwKXsgLy8gaWYgbm8gcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgfSBlbHNleyAvLyBpZiBzb21lIGJ1dCBub3QgYWxsIHJvd3MgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgICAgZ3JvdXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcsICdtaXhlZCcpO1xyXG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgICB9KTtcclxuICAgIHRhYmxlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFibGVTZWxlY3RhYmxlUm93czsiLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0YS10aXRsZSBvbiBjZWxscywgd2hlcmUgdGhlIGF0dHJpYnV0ZSBpcyBtaXNzaW5nXHJcbiAqL1xyXG5jbGFzcyBSZXNwb25zaXZlVGFibGUge1xyXG4gICAgY29uc3RydWN0b3IodGFibGUpIHtcclxuICAgICAgICBpbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXModGFibGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cclxuICogQHBhcmFtIHtIVE1MVGFibGVFbGVtZW50fSB0YWJsZUVsIFRhYmxlIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZUVsKSB7XHJcbiAgICBpZiAoIXRhYmxlRWwpIHJldHVybjtcclxuXHJcbiAgICBsZXQgaGVhZGVyID0gdGFibGVFbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKTtcclxuICAgIGlmIChoZWFkZXIubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgbGV0IGhlYWRlckNlbGxFbHMgPSBoZWFkZXJbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoJyk7XHJcbiAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keVJvd0VscyA9IHNlbGVjdCgndGJvZHkgdHInLCB0YWJsZUVsKTtcclxuICAgICAgICAgICAgQXJyYXkuZnJvbShib2R5Um93RWxzKS5mb3JFYWNoKHJvd0VsID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsRWxzID0gcm93RWwuY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShoZWFkZXJDZWxsRWxzKS5mb3JFYWNoKChoZWFkZXJDZWxsRWwsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JhYiBoZWFkZXIgY2VsbCB0ZXh0IGFuZCB1c2UgaXQgYm9keSBjZWxsIGRhdGEgdGl0bGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2VsbEVsc1tpXS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSAmJiBoZWFkZXJDZWxsRWwudGFnTmFtZSA9PT0gXCJUSFwiICYmICFoZWFkZXJDZWxsRWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwic3ItaGVhZGVyXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsRWxzW2ldLnNldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScsIGhlYWRlckNlbGxFbC50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zaXZlVGFibGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5cclxuLy8gRm9yIGVhc3kgcmVmZXJlbmNlXHJcbnZhciBrZXlzID0ge1xyXG4gIGVuZDogMzUsXHJcbiAgaG9tZTogMzYsXHJcbiAgbGVmdDogMzcsXHJcbiAgdXA6IDM4LFxyXG4gIHJpZ2h0OiAzOSxcclxuICBkb3duOiA0MCxcclxuICBkZWxldGU6IDQ2XHJcbn07XHJcblxyXG4vLyBBZGQgb3Igc3Vic3RyYWN0IGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG52YXIgZGlyZWN0aW9uID0ge1xyXG4gIDM3OiAtMSxcclxuICAzODogLTEsXHJcbiAgMzk6IDEsXHJcbiAgNDA6IDFcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhYm5hdiBUYWJuYXYgY29udGFpbmVyXHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJuYXYgKHRhYm5hdikge1xyXG4gIHRoaXMudGFibmF2ID0gdGFibmF2O1xyXG4gIHRoaXMudGFicyA9IHRoaXMudGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50IG9uIGNvbXBvbmVudFxyXG4gKi9cclxuVGFibmF2LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICBpZih0aGlzLnRhYnMubGVuZ3RoID09PSAwKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgVGFibmF2IEhUTUwgc2VlbXMgdG8gYmUgbWlzc2luZyB0YWJuYXYtaXRlbS4gQWRkIHRhYm5hdiBpdGVtcyB0byBlbnN1cmUgZWFjaCBwYW5lbCBoYXMgYSBidXR0b24gaW4gdGhlIHRhYm5hdnMgbmF2aWdhdGlvbi5gKTtcclxuICB9XHJcblxyXG4gIC8vIGlmIG5vIGhhc2ggaXMgc2V0IG9uIGxvYWQsIHNldCBhY3RpdmUgdGFiXHJcbiAgaWYgKCFzZXRBY3RpdmVIYXNoVGFiKCkpIHtcclxuICAgIC8vIHNldCBmaXJzdCB0YWIgYXMgYWN0aXZlXHJcbiAgICBsZXQgdGFiID0gdGhpcy50YWJzWyAwIF07XHJcblxyXG4gICAgLy8gY2hlY2sgbm8gb3RoZXIgdGFicyBhcyBiZWVuIHNldCBhdCBkZWZhdWx0XHJcbiAgICBsZXQgYWxyZWFkeUFjdGl2ZSA9IGdldEFjdGl2ZVRhYnModGhpcy50YWJuYXYpO1xyXG4gICAgaWYgKGFscmVhZHlBY3RpdmUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRhYiA9IGFscmVhZHlBY3RpdmVbIDAgXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhY3RpdmF0ZSBhbmQgZGVhY3RpdmF0ZSB0YWJzXHJcbiAgICB0aGlzLmFjdGl2YXRlVGFiKHRhYiwgZmFsc2UpO1xyXG4gIH1cclxuICBsZXQgJG1vZHVsZSA9IHRoaXM7XHJcbiAgLy8gYWRkIGV2ZW50bGlzdGVuZXJzIG9uIGJ1dHRvbnNcclxuICBmb3IobGV0IHQgPSAwOyB0IDwgdGhpcy50YWJzLmxlbmd0aDsgdCArKyl7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7JG1vZHVsZS5hY3RpdmF0ZVRhYih0aGlzLCBmYWxzZSl9KTtcclxuICAgIHRoaXMudGFic1sgdCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRMaXN0ZW5lcik7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwRXZlbnRMaXN0ZW5lcik7XHJcbiAgfVxyXG59XHJcblxyXG4vKioqXHJcbiAqIFNob3cgdGFiIGFuZCBoaWRlIG90aGVyc1xyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgYnV0dG9uIGVsZW1lbnRcclxuICogQHBhcmFtIHtib29sZWFufSBzZXRGb2N1cyBUcnVlIGlmIHRhYiBidXR0b24gc2hvdWxkIGJlIGZvY3VzZWRcclxuICovXHJcbiBUYWJuYXYucHJvdG90eXBlLmFjdGl2YXRlVGFiID0gZnVuY3Rpb24odGFiLCBzZXRGb2N1cykge1xyXG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xyXG5cclxuICAvLyBjbG9zZSBhbGwgdGFicyBleGNlcHQgc2VsZWN0ZWRcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKHRhYnNbIGkgXSA9PT0gdGFiKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWJzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykge1xyXG4gICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jbG9zZScpO1xyXG4gICAgICB0YWJzWyBpIF0uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxuXHJcbiAgICB0YWJzWyBpIF0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgdGFic1sgaSBdLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xyXG4gICAgbGV0IHRhYnBhbmVsSUQgPSB0YWJzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgICBsZXQgdGFicGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWJwYW5lbElEKVxyXG4gICAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHRhYnBhbmVsLmApO1xyXG4gICAgfVxyXG4gICAgdGFicGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFNldCBzZWxlY3RlZCB0YWIgdG8gYWN0aXZlXHJcbiAgbGV0IHRhYnBhbmVsSUQgPSB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRCk7XHJcbiAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24gcGFuZWwuYCk7XHJcbiAgfVxyXG5cclxuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuICB0YWJwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgdGFiLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcclxuXHJcbiAgLy8gU2V0IGZvY3VzIHdoZW4gcmVxdWlyZWRcclxuICBpZiAoc2V0Rm9jdXMpIHtcclxuICAgIHRhYi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgbGV0IGV2ZW50Q2hhbmdlZCA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jaGFuZ2VkJyk7XHJcbiAgdGFiLnBhcmVudE5vZGUuZGlzcGF0Y2hFdmVudChldmVudENoYW5nZWQpO1xyXG5cclxuICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMudGFibmF2Lm9wZW4nKTtcclxuICB0YWIuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIGtleWRvd24gZXZlbnRzIHRvIHRhYm5hdiBjb21wb25lbnRcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmZ1bmN0aW9uIGtleWRvd25FdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmVuZDpcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gQWN0aXZhdGUgbGFzdCB0YWJcclxuICAgICAgZm9jdXNMYXN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmhvbWU6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGZpcnN0IHRhYlxyXG4gICAgICBmb2N1c0ZpcnN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgLy8gVXAgYW5kIGRvd24gYXJlIGluIGtleWRvd25cclxuICAgIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBwcmV2ZW50IHBhZ2Ugc2Nyb2xsID46KVxyXG4gICAgY2FzZSBrZXlzLnVwOlxyXG4gICAgY2FzZSBrZXlzLmRvd246XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGtleXVwIGV2ZW50cyB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBrZXl1cEV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIHN3aXRjaCAoa2V5KSB7XHJcbiAgICBjYXNlIGtleXMubGVmdDpcclxuICAgIGNhc2Uga2V5cy5yaWdodDpcclxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5kZWxldGU6XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmVudGVyOlxyXG4gICAgY2FzZSBrZXlzLnNwYWNlOlxyXG4gICAgICBuZXcgVGFibmF2KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlKS5hY3RpdmF0ZVRhYihldmVudC50YXJnZXQsIHRydWUpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXaGVuIGEgdGFibGlzdCBhcmlhLW9yaWVudGF0aW9uIGlzIHNldCB0byB2ZXJ0aWNhbCxcclxuICogb25seSB1cCBhbmQgZG93biBhcnJvdyBzaG91bGQgZnVuY3Rpb24uXHJcbiAqIEluIGFsbCBvdGhlciBjYXNlcyBvbmx5IGxlZnQgYW5kIHJpZ2h0IGFycm93IGZ1bmN0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT3JpZW50YXRpb24gKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIGxldCB3PXdpbmRvdyxcclxuICAgIGQ9ZG9jdW1lbnQsXHJcbiAgICBlPWQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgZz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXSxcclxuICAgIHg9dy5pbm5lcldpZHRofHxlLmNsaWVudFdpZHRofHxnLmNsaWVudFdpZHRoLFxyXG4gICAgeT13LmlubmVySGVpZ2h0fHxlLmNsaWVudEhlaWdodHx8Zy5jbGllbnRIZWlnaHQ7XHJcblxyXG4gIGxldCB2ZXJ0aWNhbCA9IHggPCBicmVha3BvaW50cy5tZDtcclxuICBsZXQgcHJvY2VlZCA9IGZhbHNlO1xyXG5cclxuICBpZiAodmVydGljYWwpIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMudXAgfHwga2V5ID09PSBrZXlzLmRvd24pIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaWYgKGtleSA9PT0ga2V5cy5sZWZ0IHx8IGtleSA9PT0ga2V5cy5yaWdodCkge1xyXG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHByb2NlZWQpIHtcclxuICAgIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyhldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRWl0aGVyIGZvY3VzIHRoZSBuZXh0LCBwcmV2aW91cywgZmlyc3QsIG9yIGxhc3QgdGFiXHJcbiAqIGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG4gKi9cclxuZnVuY3Rpb24gc3dpdGNoVGFiT25BcnJvd1ByZXNzIChldmVudCkge1xyXG4gIHZhciBwcmVzc2VkID0gZXZlbnQua2V5Q29kZTtcclxuICBpZiAoZGlyZWN0aW9uWyBwcmVzc2VkIF0pIHtcclxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFyZ2V0KTtcclxuICAgIGxldCBpbmRleCA9IGdldEluZGV4T2ZFbGVtZW50SW5MaXN0KHRhcmdldCwgdGFicyk7XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgIGlmICh0YWJzWyBpbmRleCArIGRpcmVjdGlvblsgcHJlc3NlZCBdIF0pIHtcclxuICAgICAgICB0YWJzWyBpbmRleCArIGRpcmVjdGlvblsgcHJlc3NlZCBdIF0uZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLmxlZnQgfHwgcHJlc3NlZCA9PT0ga2V5cy51cCkge1xyXG4gICAgICAgIGZvY3VzTGFzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHByZXNzZWQgPT09IGtleXMucmlnaHQgfHwgcHJlc3NlZCA9PSBrZXlzLmRvd24pIHtcclxuICAgICAgICBmb2N1c0ZpcnN0VGFiKHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYWxsIGFjdGl2ZSB0YWJzIGluIGxpc3RcclxuICogQHBhcmFtIHRhYm5hdiBwYXJlbnQgLnRhYm5hdiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHJldHVybnMgbGlzdCBvZiBhY3RpdmUgdGFicyBpZiBhbnlcclxuICovXHJcbmZ1bmN0aW9uIGdldEFjdGl2ZVRhYnMgKHRhYm5hdikge1xyXG4gIHJldHVybiB0YWJuYXYucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtW2FyaWEtc2VsZWN0ZWQ9dHJ1ZV0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhIGxpc3Qgb2YgYWxsIGJ1dHRvbiB0YWJzIGluIGN1cnJlbnQgdGFibGlzdFxyXG4gKiBAcGFyYW0gdGFiIEJ1dHRvbiB0YWIgZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Kn0gcmV0dXJuIGFycmF5IG9mIHRhYnNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFsbFRhYnNJbkxpc3QgKHRhYikge1xyXG4gIGxldCBwYXJlbnROb2RlID0gdGFiLnBhcmVudE5vZGU7XHJcbiAgaWYgKHBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWJuYXYnKSkge1xyXG4gICAgcmV0dXJuIHBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtJyk7XHJcbiAgfVxyXG4gIHJldHVybiBbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBpbmRleCBvZiBlbGVtZW50IGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MQ29sbGVjdGlvbn0gbGlzdCBcclxuICogQHJldHVybnMge2luZGV4fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QgKGVsZW1lbnQsIGxpc3Qpe1xyXG4gIGxldCBpbmRleCA9IC0xO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyApe1xyXG4gICAgaWYobGlzdFsgaSBdID09PSBlbGVtZW50KXtcclxuICAgICAgaW5kZXggPSBpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBpbmRleDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0aGVyZSBpcyBhIHRhYiBoYXNoIGluIHRoZSB1cmwgYW5kIGFjdGl2YXRlcyB0aGUgdGFiIGFjY29yZGluZ2x5XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm5zIHRydWUgaWYgdGFiIGhhcyBiZWVuIHNldCAtIHJldHVybnMgZmFsc2UgaWYgbm8gdGFiIGhhcyBiZWVuIHNldCB0byBhY3RpdmVcclxuICovXHJcbmZ1bmN0aW9uIHNldEFjdGl2ZUhhc2hUYWIgKCkge1xyXG4gIGxldCBoYXNoID0gbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xyXG4gIGlmIChoYXNoICE9PSAnJykge1xyXG4gICAgbGV0IHRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLWNvbnRyb2xzPVwiIycgKyBoYXNoICsgJ1wiXScpO1xyXG4gICAgaWYgKHRhYiAhPT0gbnVsbCkge1xyXG4gICAgICBhY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBmaXJzdCB0YWIgYnkgdGFiIGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXNGaXJzdFRhYiAodGFiKSB7XHJcbiAgZ2V0QWxsVGFic0luTGlzdCh0YWIpWyAwIF0uZm9jdXMoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBsYXN0IHRhYiBieSB0YWIgaW4gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgXHJcbiAqL1xyXG5mdW5jdGlvbiBmb2N1c0xhc3RUYWIgKHRhYikge1xyXG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xyXG4gIHRhYnNbIHRhYnMubGVuZ3RoIC0gMSBdLmZvY3VzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhYm5hdjsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBTaG93L2hpZGUgdG9hc3QgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBUb2FzdCAoZWxlbWVudCl7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyB0b2FzdFxyXG4gKi9cclxuVG9hc3QucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93aW5nJyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9hc3QtY2xvc2UnKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IHRvYXN0ID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgICAgICAgbmV3IFRvYXN0KHRvYXN0KS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzaG93VG9hc3QpO1xyXG59XHJcblxyXG4vKipcclxuICogSGlkZSB0b2FzdFxyXG4gKi9cclxuVG9hc3QucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7ICAgICAgICAgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsYXNzZXMgdG8gbWFrZSBzaG93IGFuaW1hdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gc2hvd1RvYXN0KCl7XHJcbiAgICBsZXQgdG9hc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvYXN0LnNob3dpbmcnKTtcclxuICAgIGZvcihsZXQgdCA9IDA7IHQgPCB0b2FzdHMubGVuZ3RoOyB0Kyspe1xyXG4gICAgICAgIGxldCB0b2FzdCA9IHRvYXN0c1t0XTtcclxuICAgICAgICB0b2FzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93aW5nJyk7XHJcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUb2FzdDsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBTZXQgdG9vbHRpcCBvbiBlbGVtZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aGljaCBoYXMgdG9vbHRpcFxyXG4gKi9cclxuZnVuY3Rpb24gVG9vbHRpcChlbGVtZW50KSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgaWYgKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcCcpID09PSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUb29sdGlwIHRleHQgaXMgbWlzc2luZy4gQWRkIGF0dHJpYnV0ZSBkYXRhLXRvb2x0aXAgYW5kIHRoZSBjb250ZW50IG9mIHRoZSB0b29sdGlwIGFzIHZhbHVlLmApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50bGlzdGVuZXJzXHJcbiAqL1xyXG5Ub29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG1vZHVsZSA9IHRoaXM7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgICBpZiAodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSA9PT0gZmFsc2UgJiYgdHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtZm9jdXMnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgY2xvc2VBbGxUb29sdGlwcyhlKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKFwidG9vbHRpcC1ob3ZlclwiKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9vbHRpcChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgICBpZiAodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICAgICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XHJcbiAgICAgICAgICAgIGlmICh0b29sdGlwRWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgICAgICBpZiAoa2V5ID09PSAyNykge1xyXG4gICAgICAgICAgICB2YXIgdG9vbHRpcCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgICAgIGlmICh0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtdHJpZ2dlcicpID09PSAnY2xpY2snKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgICAgICAgY2xvc2VBbGxUb29sdGlwcyhlKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKCd0b29sdGlwLWZvY3VzJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgICAgICAgICBpZiAodHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBhZGRUb29sdGlwKHRyaWdnZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUFsbFRvb2x0aXBzKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUFsbFRvb2x0aXBzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9zZSBhbGwgdG9vbHRpcHNcclxuICovXHJcbmZ1bmN0aW9uIGNsb3NlQWxsKCkge1xyXG4gICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRvb2x0aXBbYXJpYS1kZXNjcmliZWRieV0nKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcG9wcGVyID0gZWxlbWVudHNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgZWxlbWVudHNbaV0ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3BwZXIpKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG9vbHRpcCh0cmlnZ2VyKSB7XHJcbiAgICB2YXIgcG9zID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicpIHx8ICd0b3AnO1xyXG5cclxuICAgIHZhciB0b29sdGlwID0gY3JlYXRlVG9vbHRpcCh0cmlnZ2VyLCBwb3MpO1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XHJcblxyXG4gICAgcG9zaXRpb25BdCh0cmlnZ2VyLCB0b29sdGlwLCBwb3MpO1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlIHRvb2x0aXAgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2hpY2ggdGhlIHRvb2x0aXAgaXMgYXR0YWNoZWRcclxuICogQHBhcmFtIHtzdHJpbmd9IHBvcyBQb3NpdGlvbiBvZiB0b29sdGlwICh0b3AgfCBib3R0b20pXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpIHtcclxuICAgIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICd0b29sdGlwLXBvcHBlcic7XHJcbiAgICB2YXIgcG9wcGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICB2YXIgaWQgPSAndG9vbHRpcC0nICsgcG9wcGVycy5sZW5ndGggKyAxO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndG9vbHRpcCcpO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JywgcG9zKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWQpO1xyXG5cclxuICAgIHZhciB0b29sdGlwSW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRvb2x0aXBJbm5lci5jbGFzc05hbWUgPSAndG9vbHRpcCc7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBBcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcEFycm93LmNsYXNzTmFtZSA9ICd0b29sdGlwLWFycm93JztcclxuICAgIHRvb2x0aXBJbm5lci5hcHBlbmRDaGlsZCh0b29sdGlwQXJyb3cpO1xyXG5cclxuICAgIHZhciB0b29sdGlwQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcENvbnRlbnQuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtY29udGVudCc7XHJcbiAgICB0b29sdGlwQ29udGVudC5pbm5lckhUTUwgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwJyk7XHJcbiAgICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcENvbnRlbnQpO1xyXG4gICAgdG9vbHRpcC5hcHBlbmRDaGlsZCh0b29sdGlwSW5uZXIpO1xyXG5cclxuICAgIHJldHVybiB0b29sdGlwO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFBvc2l0aW9ucyB0aGUgdG9vbHRpcC5cclxuICpcclxuICogQHBhcmFtIHtvYmplY3R9IHBhcmVudCAtIFRoZSB0cmlnZ2VyIG9mIHRoZSB0b29sdGlwLlxyXG4gKiBAcGFyYW0ge29iamVjdH0gdG9vbHRpcCAtIFRoZSB0b29sdGlwIGl0c2VsZi5cclxuICogQHBhcmFtIHtzdHJpbmd9IHBvc0hvcml6b250YWwgLSBEZXNpcmVkIGhvcml6b250YWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAobGVmdC9jZW50ZXIvcmlnaHQpXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3NWZXJ0aWNhbCAtIERlc2lyZWQgdmVydGljYWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAodG9wL2NlbnRlci9ib3R0b20pXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBwb3NpdGlvbkF0KHBhcmVudCwgdG9vbHRpcCwgcG9zKSB7XHJcbiAgICBsZXQgdHJpZ2dlciA9IHBhcmVudDtcclxuICAgIGxldCBhcnJvdyA9IHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdO1xyXG4gICAgbGV0IHRyaWdnZXJQb3NpdGlvbiA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICB2YXIgcGFyZW50Q29vcmRzID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBsZWZ0LCB0b3A7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBXaWR0aCA9IHRvb2x0aXAub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgdmFyIGRpc3QgPSAxMjtcclxuICAgIGxldCBhcnJvd0RpcmVjdGlvbiA9IFwiZG93blwiO1xyXG4gICAgbGVmdCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5sZWZ0KSArICgocGFyZW50Lm9mZnNldFdpZHRoIC0gdG9vbHRpcC5vZmZzZXRXaWR0aCkgLyAyKTtcclxuXHJcbiAgICBzd2l0Y2ggKHBvcykge1xyXG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XHJcbiAgICAgICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdDtcclxuICAgICAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNhc2UgJ3RvcCc6XHJcbiAgICAgICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy50b3ApIC0gdG9vbHRpcC5vZmZzZXRIZWlnaHQgLSBkaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRvb2x0aXAgaXMgb3V0IG9mIGJvdW5kcyBvbiBsZWZ0IHNpZGVcclxuICAgIGlmIChsZWZ0IDwgMCkge1xyXG4gICAgICAgIGxlZnQgPSBkaXN0O1xyXG4gICAgICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5sZWZ0ICsgKHRyaWdnZXIub2Zmc2V0V2lkdGggLyAyKTtcclxuICAgICAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgICAgICBsZXQgYXJyb3dMZWZ0UG9zaXRpb24gPSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XHJcbiAgICAgICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uc3R5bGUubGVmdCA9IGFycm93TGVmdFBvc2l0aW9uICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiB0b29sdGlwIGlzIG91dCBvZiBib3VuZHMgb24gdGhlIGJvdHRvbSBvZiB0aGUgcGFnZVxyXG4gICAgaWYgKCh0b3AgKyB0b29sdGlwLm9mZnNldEhlaWdodCkgPj0gd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLnRvcCkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIGRpc3Q7XHJcbiAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcImRvd25cIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiB0b29sdGlwIGlzIG91dCBvZiBib3VuZHMgb24gdGhlIHRvcCBvZiB0aGUgcGFnZVxyXG4gICAgaWYgKHRvcCA8IDApIHtcclxuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XHJcbiAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgKGxlZnQgKyB0b29sdGlwV2lkdGgpKSB7XHJcbiAgICAgICAgdG9vbHRpcC5zdHlsZS5yaWdodCA9IGRpc3QgKyAncHgnO1xyXG4gICAgICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5yaWdodCAtICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICAgICAgbGV0IHRvb2x0aXBBcnJvd0hhbGZXaWR0aCA9IDg7XHJcbiAgICAgICAgbGV0IGFycm93UmlnaHRQb3NpdGlvbiA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZW5kUG9zaXRpb25PblBhZ2UgLSBkaXN0IC0gdG9vbHRpcEFycm93SGFsZldpZHRoO1xyXG4gICAgICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLnJpZ2h0ID0gYXJyb3dSaWdodFBvc2l0aW9uICsgJ3B4JztcclxuICAgICAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcclxuICAgIH1cclxuICAgIHRvb2x0aXAuc3R5bGUudG9wID0gdG9wICsgcGFnZVlPZmZzZXQgKyAncHgnO1xyXG4gICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uY2xhc3NMaXN0LmFkZChhcnJvd0RpcmVjdGlvbik7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjbG9zZUFsbFRvb2x0aXBzKGV2ZW50LCBmb3JjZSA9IGZhbHNlKSB7XHJcbiAgICBpZiAoZm9yY2UgfHwgKCFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy10b29sdGlwJykgJiYgIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1jb250ZW50JykpKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWRlc2NyaWJlZGJ5PScgKyBlbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoJ2lkJykgKyAnXScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtZm9jdXMnKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcikge1xyXG4gICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgdG9vbHRpcEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uVG9vbHRpcEhvdmVyKTtcclxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvblRvb2x0aXBIb3Zlcik7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgICAgIGlmICh0b29sdGlwRWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoIXRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwidG9vbHRpcC1ob3ZlclwiKSkge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sIDMwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uVG9vbHRpcEhvdmVyKGUpIHtcclxuICAgIGxldCB0b29sdGlwRWxlbWVudCA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nICsgdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ10nKTtcclxuICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCgndG9vbHRpcC1ob3ZlcicpO1xyXG5cclxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nICsgdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ10nKTtcclxuICAgICAgICBpZiAodHJpZ2dlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICAgICAgY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVRvb2x0aXAodHJpZ2dlcikge1xyXG4gICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG5cclxuICAgIGlmICh0b29sdGlwSWQgIT09IG51bGwgJiYgdG9vbHRpcEVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRvb2x0aXBFbGVtZW50KTtcclxuICAgIH1cclxuICAgIHRyaWdnZXIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1mb2N1cycpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvb2x0aXA7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHByZWZpeDogJycsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IEFjY29yZGlvbiBmcm9tICcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJztcclxuaW1wb3J0IEFsZXJ0IGZyb20gJy4vY29tcG9uZW50cy9hbGVydCc7XHJcbmltcG9ydCBCYWNrVG9Ub3AgZnJvbSAnLi9jb21wb25lbnRzL2JhY2stdG8tdG9wJztcclxuaW1wb3J0IENoYXJhY3RlckxpbWl0IGZyb20gJy4vY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQnO1xyXG5pbXBvcnQgQ2hlY2tib3hUb2dnbGVDb250ZW50IGZyb20gJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24nO1xyXG5pbXBvcnQgRHJvcGRvd25Tb3J0IGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi1zb3J0JztcclxuaW1wb3J0IEVycm9yU3VtbWFyeSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeSc7XHJcbmltcG9ydCBJbnB1dFJlZ2V4TWFzayBmcm9tICcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzayc7XHJcbmltcG9ydCBNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvbW9kYWwnO1xyXG5pbXBvcnQgTmF2aWdhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbic7XHJcbmltcG9ydCBSYWRpb1RvZ2dsZUdyb3VwIGZyb20gJy4vY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBSZXNwb25zaXZlVGFibGUgZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlJztcclxuaW1wb3J0IFRhYm5hdiBmcm9tICAnLi9jb21wb25lbnRzL3RhYm5hdic7XHJcbmltcG9ydCBUYWJsZVNlbGVjdGFibGVSb3dzIGZyb20gJy4vY29tcG9uZW50cy9zZWxlY3RhYmxlLXRhYmxlJztcclxuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy90b2FzdCc7XHJcbmltcG9ydCBUb29sdGlwIGZyb20gJy4vY29tcG9uZW50cy90b29sdGlwJztcclxuY29uc3QgZGF0ZVBpY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kYXRlLXBpY2tlcicpO1xyXG4vKipcclxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXHJcbiAqIG9sZGVyIGJyb3dzZXJzLCBzbyBtdXN0IGJlIGxvYWRlZCBmaXJzdC5cclxuICovXHJcbnJlcXVpcmUoJy4vcG9seWZpbGxzJyk7XHJcblxyXG4vKipcclxuICogSW5pdCBhbGwgY29tcG9uZW50c1xyXG4gKiBAcGFyYW0ge0pTT059IG9wdGlvbnMge3Njb3BlOiBIVE1MRWxlbWVudH0gLSBJbml0IGFsbCBjb21wb25lbnRzIHdpdGhpbiBzY29wZSAoZGVmYXVsdCBpcyBkb2N1bWVudClcclxuICovXHJcbnZhciBpbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAvLyBTZXQgdGhlIG9wdGlvbnMgdG8gYW4gZW1wdHkgb2JqZWN0IGJ5IGRlZmF1bHQgaWYgbm8gb3B0aW9ucyBhcmUgcGFzc2VkLlxyXG4gIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge31cclxuXHJcbiAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gaW5pdGlhbGlzZSBGRFMgaW4gb25seSBjZXJ0YWluIHNlY3Rpb25zIG9mIHRoZSBwYWdlXHJcbiAgLy8gRGVmYXVsdHMgdG8gdGhlIGVudGlyZSBkb2N1bWVudCBpZiBub3RoaW5nIGlzIHNldC5cclxuICB2YXIgc2NvcGUgPSB0eXBlb2Ygb3B0aW9ucy5zY29wZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNjb3BlIDogZG9jdW1lbnRcclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBBY2NvcmRpb25zXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWNjb3JkaW9uJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pLmluaXQoKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1ib3JkZXJlZDpub3QoLmFjY29yZGlvbiknKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQWxlcnRzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgYWxlcnRzV2l0aENsb3NlQnV0dG9uID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFsZXJ0Lmhhcy1jbG9zZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBhbGVydHNXaXRoQ2xvc2VCdXR0b24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFsZXJ0KGFsZXJ0c1dpdGhDbG9zZUJ1dHRvblsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIEJhY2sgdG8gdG9wIGJ1dHRvblxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcblxyXG4gIGNvbnN0IGJhY2tUb1RvcEJ1dHRvbnMgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdiYWNrLXRvLXRvcC1idXR0b24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwgYmFja1RvVG9wQnV0dG9ucy5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQmFja1RvVG9wKGJhY2tUb1RvcEJ1dHRvbnNbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBDaGFyYWN0ZXIgbGltaXRcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzQ2hhcmFjdGVyTGltaXQgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWxpbWl0Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzQ2hhcmFjdGVyTGltaXQubGVuZ3RoOyBjKyspe1xyXG5cclxuICAgIG5ldyBDaGFyYWN0ZXJMaW1pdChqc0NoYXJhY3RlckxpbWl0WyBjIF0pLmluaXQoKTtcclxuICB9XHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBDaGVja2JveCBjb2xsYXBzZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQ2hlY2tib3hUb2dnbGVDb250ZW50KGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgT3ZlcmZsb3cgbWVudVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtZHJvcGRvd24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93bihqc1NlbGVjdG9yRHJvcGRvd25bIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBPdmVyZmxvdyBtZW51IHNvcnRcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93blNvcnQgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51LS1zb3J0Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JEcm9wZG93blNvcnQubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IERyb3Bkb3duU29ydChqc1NlbGVjdG9yRHJvcGRvd25Tb3J0WyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgRGF0ZXBpY2tlclxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgZGF0ZVBpY2tlci5vbihzY29wZSk7XHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBFcnJvciBzdW1tYXJ5XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICB2YXIgJGVycm9yU3VtbWFyeSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW1vZHVsZT1cImVycm9yLXN1bW1hcnlcIl0nKTtcclxuICBuZXcgRXJyb3JTdW1tYXJ5KCRlcnJvclN1bW1hcnkpLmluaXQoKTtcclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBJbnB1dCBSZWdleCAtIHVzZWQgb24gZGF0ZSBmaWVsZHNcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JSZWdleCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W2RhdGEtaW5wdXQtcmVnZXhdJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSZWdleC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgSW5wdXRSZWdleE1hc2soanNTZWxlY3RvclJlZ2V4WyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBNb2RhbFxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QgbW9kYWxzID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmZkcy1tb2RhbCcpO1xyXG4gIGZvcihsZXQgZCA9IDA7IGQgPCBtb2RhbHMubGVuZ3RoOyBkKyspIHtcclxuICAgIG5ldyBNb2RhbChtb2RhbHNbZF0pLmluaXQoKTtcclxuICB9XHJcbiAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBOYXZpZ2F0aW9uXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBuZXcgTmF2aWdhdGlvbigpLmluaXQoKTtcclxuICAgXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBSYWRpb2J1dHRvbiBncm91cCBjb2xsYXBzZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclJhZGlvQ29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1yYWRpby10b2dnbGUtZ3JvdXAnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclJhZGlvQ29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJhZGlvVG9nZ2xlR3JvdXAoanNTZWxlY3RvclJhZGlvQ29sbGFwc2VbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBSZXNwb25zaXZlIHRhYmxlc1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclRhYmxlID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgndGFibGUudGFibGUtLXJlc3BvbnNpdmUtaGVhZGVycywgdGFibGUudGFibGUtc20tcmVzcG9uc2l2ZS1oZWFkZXJzLCB0YWJsZS50YWJsZS1tZC1yZXNwb25zaXZlLWhlYWRlcnMsIHRhYmxlLnRhYmxlLWxnLXJlc3BvbnNpdmUtaGVhZGVycycpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJlc3BvbnNpdmVUYWJsZShqc1NlbGVjdG9yVGFibGVbIGMgXSk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFNlbGVjdGFibGUgcm93cyBpbiB0YWJsZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RhYmxlVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZS50YWJsZS0tc2VsZWN0YWJsZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdGFibGVUYWJsZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyhqc1NlbGVjdGFibGVUYWJsZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRhYm5hdlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclRhYm5hdiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYm5hdicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibmF2Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUYWJuYXYoanNTZWxlY3RvclRhYm5hdlsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRvb2x0aXBcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUb29sdGlwID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtdG9vbHRpcCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVG9vbHRpcC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVG9vbHRpcChqc1NlbGVjdG9yVG9vbHRpcFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGluaXQsIEFjY29yZGlvbiwgQWxlcnQsIEJhY2tUb1RvcCwgQ2hhcmFjdGVyTGltaXQsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIERyb3Bkb3duU29ydCwgZGF0ZVBpY2tlciwgRXJyb3JTdW1tYXJ5LCBJbnB1dFJlZ2V4TWFzaywgTW9kYWwsIE5hdmlnYXRpb24sIFJhZGlvVG9nZ2xlR3JvdXAsIFJlc3BvbnNpdmVUYWJsZSwgVGFibGVTZWxlY3RhYmxlUm93cywgVGFibmF2LCBUb2FzdCwgVG9vbHRpcH07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLy8gVGhpcyB1c2VkIHRvIGJlIGNvbmRpdGlvbmFsbHkgZGVwZW5kZW50IG9uIHdoZXRoZXIgdGhlXHJcbiAgLy8gYnJvd3NlciBzdXBwb3J0ZWQgdG91Y2ggZXZlbnRzOyBpZiBpdCBkaWQsIGBDTElDS2Agd2FzIHNldCB0b1xyXG4gIC8vIGB0b3VjaHN0YXJ0YC4gIEhvd2V2ZXIsIHRoaXMgaGFkIGRvd25zaWRlczpcclxuICAvL1xyXG4gIC8vICogSXQgcHJlLWVtcHRlZCBtb2JpbGUgYnJvd3NlcnMnIGRlZmF1bHQgYmVoYXZpb3Igb2YgZGV0ZWN0aW5nXHJcbiAgLy8gICB3aGV0aGVyIGEgdG91Y2ggdHVybmVkIGludG8gYSBzY3JvbGwsIHRoZXJlYnkgcHJldmVudGluZ1xyXG4gIC8vICAgdXNlcnMgZnJvbSB1c2luZyBzb21lIG9mIG91ciBjb21wb25lbnRzIGFzIHNjcm9sbCBzdXJmYWNlcy5cclxuICAvL1xyXG4gIC8vICogU29tZSBkZXZpY2VzLCBzdWNoIGFzIHRoZSBNaWNyb3NvZnQgU3VyZmFjZSBQcm8sIHN1cHBvcnQgKmJvdGgqXHJcbiAgLy8gICB0b3VjaCBhbmQgY2xpY2tzLiBUaGlzIG1lYW50IHRoZSBjb25kaXRpb25hbCBlZmZlY3RpdmVseSBkcm9wcGVkXHJcbiAgLy8gICBzdXBwb3J0IGZvciB0aGUgdXNlcidzIG1vdXNlLCBmcnVzdHJhdGluZyB1c2VycyB3aG8gcHJlZmVycmVkXHJcbiAgLy8gICBpdCBvbiB0aG9zZSBzeXN0ZW1zLlxyXG4gIENMSUNLOiAnY2xpY2snLFxyXG59O1xyXG4iLCJpbXBvcnQgJy4uLy4uL09iamVjdC9kZWZpbmVQcm9wZXJ0eSdcclxuXHJcbihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuICAvLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQvZGV0ZWN0LmpzXHJcbiAgdmFyIGRldGVjdCA9ICdiaW5kJyBpbiBGdW5jdGlvbi5wcm90b3R5cGVcclxuXHJcbiAgaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4gIC8vIFBvbHlmaWxsIGZyb20gaHR0cHM6Ly9jZG4ucG9seWZpbGwuaW8vdjIvcG9seWZpbGwuanM/ZmVhdHVyZXM9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQmZmxhZ3M9YWx3YXlzXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ2JpbmQnLCB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXHJcbiAgICAgICAgICAvLyBhZGQgbmVjZXNzYXJ5IGVzNS1zaGltIHV0aWxpdGllc1xyXG4gICAgICAgICAgdmFyICRBcnJheSA9IEFycmF5O1xyXG4gICAgICAgICAgdmFyICRPYmplY3QgPSBPYmplY3Q7XHJcbiAgICAgICAgICB2YXIgT2JqZWN0UHJvdG90eXBlID0gJE9iamVjdC5wcm90b3R5cGU7XHJcbiAgICAgICAgICB2YXIgQXJyYXlQcm90b3R5cGUgPSAkQXJyYXkucHJvdG90eXBlO1xyXG4gICAgICAgICAgdmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcclxuICAgICAgICAgIHZhciB0b19zdHJpbmcgPSBPYmplY3RQcm90b3R5cGUudG9TdHJpbmc7XHJcbiAgICAgICAgICB2YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xyXG4gICAgICAgICAgdmFyIGlzQ2FsbGFibGU7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1jYWxsYWJsZSAqLyB2YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZywgdHJ5RnVuY3Rpb25PYmplY3QgPSBmdW5jdGlvbiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSkgeyB0cnkgeyBmblRvU3RyLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgZm5DbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJzsgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHsgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH0gaWYgKGhhc1RvU3RyaW5nVGFnKSB7IHJldHVybiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSk7IH0gdmFyIHN0ckNsYXNzID0gdG9fc3RyaW5nLmNhbGwodmFsdWUpOyByZXR1cm4gc3RyQ2xhc3MgPT09IGZuQ2xhc3MgfHwgc3RyQ2xhc3MgPT09IGdlbkNsYXNzOyB9O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3NsaWNlID0gQXJyYXlQcm90b3R5cGUuc2xpY2U7XHJcbiAgICAgICAgICB2YXIgYXJyYXlfY29uY2F0ID0gQXJyYXlQcm90b3R5cGUuY29uY2F0O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3B1c2ggPSBBcnJheVByb3RvdHlwZS5wdXNoO1xyXG4gICAgICAgICAgdmFyIG1heCA9IE1hdGgubWF4O1xyXG4gICAgICAgICAgLy8gL2FkZCBuZWNlc3NhcnkgZXM1LXNoaW0gdXRpbGl0aWVzXHJcblxyXG4gICAgICAgICAgLy8gMS4gTGV0IFRhcmdldCBiZSB0aGUgdGhpcyB2YWx1ZS5cclxuICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xyXG4gICAgICAgICAgLy8gMi4gSWYgSXNDYWxsYWJsZShUYXJnZXQpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXHJcbiAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgJyArIHRhcmdldCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyAzLiBMZXQgQSBiZSBhIG5ldyAocG9zc2libHkgZW1wdHkpIGludGVybmFsIGxpc3Qgb2YgYWxsIG9mIHRoZVxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cclxuICAgICAgICAgIC8vIFhYWCBzbGljZWRBcmdzIHdpbGwgc3RhbmQgaW4gZm9yIFwiQVwiIGlmIHVzZWRcclxuICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpOyAvLyBmb3Igbm9ybWFsIGNhbGxcclxuICAgICAgICAgIC8vIDQuIExldCBGIGJlIGEgbmV3IG5hdGl2ZSBFQ01BU2NyaXB0IG9iamVjdC5cclxuICAgICAgICAgIC8vIDExLiBTZXQgdGhlIFtbUHJvdG90eXBlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0aGUgc3RhbmRhcmRcclxuICAgICAgICAgIC8vICAgYnVpbHQtaW4gRnVuY3Rpb24gcHJvdG90eXBlIG9iamVjdCBhcyBzcGVjaWZpZWQgaW4gMTUuMy4zLjEuXHJcbiAgICAgICAgICAvLyAxMi4gU2V0IHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4xLlxyXG4gICAgICAgICAgLy8gMTMuIFNldCB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4yLlxyXG4gICAgICAgICAgLy8gMTQuIFNldCB0aGUgW1tIYXNJbnN0YW5jZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXHJcbiAgICAgICAgICAvLyAgIDE1LjMuNC41LjMuXHJcbiAgICAgICAgICB2YXIgYm91bmQ7XHJcbiAgICAgICAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCxcclxuICAgICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcclxuICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgVHlwZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXHJcbiAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgkT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXHJcbiAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcclxuICAgICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxyXG4gICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2RcclxuICAgICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIC8vIDE1LiBJZiB0aGUgW1tDbGFzc11dIGludGVybmFsIHByb3BlcnR5IG9mIFRhcmdldCBpcyBcIkZ1bmN0aW9uXCIsIHRoZW5cclxuICAgICAgICAgIC8vICAgICBhLiBMZXQgTCBiZSB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIFRhcmdldCBtaW51cyB0aGUgbGVuZ3RoIG9mIEEuXHJcbiAgICAgICAgICAvLyAgICAgYi4gU2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gZWl0aGVyIDAgb3IgTCwgd2hpY2hldmVyIGlzXHJcbiAgICAgICAgICAvLyAgICAgICBsYXJnZXIuXHJcbiAgICAgICAgICAvLyAxNi4gRWxzZSBzZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byAwLlxyXG5cclxuICAgICAgICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXHJcbiAgICAgICAgICAvLyAgIHNwZWNpZmllZCBpbiAxNS4zLjUuMS5cclxuICAgICAgICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIGFycmF5X3B1c2guY2FsbChib3VuZEFyZ3MsICckJyArIGkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFhYWCBCdWlsZCBhIGR5bmFtaWMgZnVuY3Rpb24gd2l0aCBkZXNpcmVkIGFtb3VudCBvZiBhcmd1bWVudHMgaXMgdGhlIG9ubHlcclxuICAgICAgICAgIC8vIHdheSB0byBzZXQgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBhIGZ1bmN0aW9uLlxyXG4gICAgICAgICAgLy8gSW4gZW52aXJvbm1lbnRzIHdoZXJlIENvbnRlbnQgU2VjdXJpdHkgUG9saWNpZXMgZW5hYmxlZCAoQ2hyb21lIGV4dGVuc2lvbnMsXHJcbiAgICAgICAgICAvLyBmb3IgZXguKSBhbGwgdXNlIG9mIGV2YWwgb3IgRnVuY3Rpb24gY29zdHJ1Y3RvciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxyXG4gICAgICAgICAgLy8gSG93ZXZlciBpbiBhbGwgb2YgdGhlc2UgZW52aXJvbm1lbnRzIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGV4aXN0c1xyXG4gICAgICAgICAgLy8gYW5kIHNvIHRoaXMgY29kZSB3aWxsIG5ldmVyIGJlIGV4ZWN1dGVkLlxyXG4gICAgICAgICAgYm91bmQgPSBGdW5jdGlvbignYmluZGVyJywgJ3JldHVybiBmdW5jdGlvbiAoJyArIGJvdW5kQXJncy5qb2luKCcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcclxuXHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnByb3RvdHlwZSkge1xyXG4gICAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGFuZ2xpbmcgcmVmZXJlbmNlcy5cclxuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIDE4LiBTZXQgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdHJ1ZS5cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXHJcbiAgICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcclxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcclxuICAgICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxyXG4gICAgICAgICAgLy8gICBmYWxzZS5cclxuICAgICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxyXG4gICAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcclxuICAgICAgICAgIC8vICAgYW5kIGZhbHNlLlxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxyXG4gICAgICAgICAgLy8gaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBvciB0aGUgW1tDb2RlXV0sIFtbRm9ybWFsUGFyYW1ldGVyc11dLCBhbmRcclxuICAgICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cclxuXHJcbiAgICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXHJcbiAgICAgICAgICByZXR1cm4gYm91bmQ7XHJcbiAgICAgIH1cclxuICB9KTtcclxufSlcclxuLmNhbGwoJ29iamVjdCcgPT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8ICdvYmplY3QnID09PSB0eXBlb2Ygc2VsZiAmJiBzZWxmIHx8ICdvYmplY3QnID09PSB0eXBlb2YgZ2xvYmFsICYmIGdsb2JhbCB8fCB7fSk7XHJcbiIsIihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuXHJcbi8vIERldGVjdGlvbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9GaW5hbmNpYWwtVGltZXMvcG9seWZpbGwtc2VydmljZS9ibG9iL21hc3Rlci9wYWNrYWdlcy9wb2x5ZmlsbC1saWJyYXJ5L3BvbHlmaWxscy9PYmplY3QvZGVmaW5lUHJvcGVydHkvZGV0ZWN0LmpzXHJcbnZhciBkZXRlY3QgPSAoXHJcbiAgLy8gSW4gSUU4LCBkZWZpbmVQcm9wZXJ0eSBjb3VsZCBvbmx5IGFjdCBvbiBET00gZWxlbWVudHMsIHNvIGZ1bGwgc3VwcG9ydFxyXG4gIC8vIGZvciB0aGUgZmVhdHVyZSByZXF1aXJlcyB0aGUgYWJpbGl0eSB0byBzZXQgYSBwcm9wZXJ0eSBvbiBhbiBhcmJpdHJhcnkgb2JqZWN0XHJcbiAgJ2RlZmluZVByb3BlcnR5JyBpbiBPYmplY3QgJiYgKGZ1bmN0aW9uKCkge1xyXG4gIFx0dHJ5IHtcclxuICBcdFx0dmFyIGEgPSB7fTtcclxuICBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsICd0ZXN0Jywge3ZhbHVlOjQyfSk7XHJcbiAgXHRcdHJldHVybiB0cnVlO1xyXG4gIFx0fSBjYXRjaChlKSB7XHJcbiAgXHRcdHJldHVybiBmYWxzZVxyXG4gIFx0fVxyXG4gIH0oKSlcclxuKVxyXG5cclxuaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4vLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSZmbGFncz1hbHdheXNcclxuKGZ1bmN0aW9uIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSkge1xyXG5cclxuXHR2YXIgc3VwcG9ydHNBY2Nlc3NvcnMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdfX2RlZmluZUdldHRlcl9fJyk7XHJcblx0dmFyIEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCA9ICdHZXR0ZXJzICYgc2V0dGVycyBjYW5ub3QgYmUgZGVmaW5lZCBvbiB0aGlzIGphdmFzY3JpcHQgZW5naW5lJztcclxuXHR2YXIgRVJSX1ZBTFVFX0FDQ0VTU09SUyA9ICdBIHByb3BlcnR5IGNhbm5vdCBib3RoIGhhdmUgYWNjZXNzb3JzIGFuZCBiZSB3cml0YWJsZSBvciBoYXZlIGEgdmFsdWUnO1xyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XHJcblxyXG5cdFx0Ly8gV2hlcmUgbmF0aXZlIHN1cHBvcnQgZXhpc3RzLCBhc3N1bWUgaXRcclxuXHRcdGlmIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSAmJiAob2JqZWN0ID09PSB3aW5kb3cgfHwgb2JqZWN0ID09PSBkb2N1bWVudCB8fCBvYmplY3QgPT09IEVsZW1lbnQucHJvdG90eXBlIHx8IG9iamVjdCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob2JqZWN0ID09PSBudWxsIHx8ICEob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIShkZXNjcmlwdG9yIGluc3RhbmNlb2YgT2JqZWN0KSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBwcm9wZXJ0eVN0cmluZyA9IFN0cmluZyhwcm9wZXJ0eSk7XHJcblx0XHR2YXIgaGFzVmFsdWVPcldyaXRhYmxlID0gJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yIHx8ICd3cml0YWJsZScgaW4gZGVzY3JpcHRvcjtcclxuXHRcdHZhciBnZXR0ZXJUeXBlID0gJ2dldCcgaW4gZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci5nZXQ7XHJcblx0XHR2YXIgc2V0dGVyVHlwZSA9ICdzZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0O1xyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLmdldFxyXG5cdFx0aWYgKGdldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKGdldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdHZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVHZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3IuZ2V0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG9iamVjdFtwcm9wZXJ0eVN0cmluZ10gPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLnNldFxyXG5cdFx0aWYgKHNldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKHNldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVTZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3Iuc2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBPSyB0byBkZWZpbmUgdmFsdWUgdW5jb25kaXRpb25hbGx5IC0gaWYgYSBnZXR0ZXIgaGFzIGJlZW4gc3BlY2lmaWVkIGFzIHdlbGwsIGFuIGVycm9yIHdvdWxkIGJlIHRocm93biBhYm92ZVxyXG5cdFx0aWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikge1xyXG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb2JqZWN0O1xyXG5cdH07XHJcbn0oT2JqZWN0LmRlZmluZVByb3BlcnR5KSk7XHJcbn0pXHJcbi5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBjb25zaXN0ZW50LXJldHVybiAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLW5hbWVzICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgX3BhcmFtcykge1xyXG4gICAgY29uc3QgcGFyYW1zID0gX3BhcmFtcyB8fCB7XHJcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgZGV0YWlsOiBudWxsLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiQ3VzdG9tRXZlbnRcIik7XHJcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KFxyXG4gICAgICBldmVudCxcclxuICAgICAgcGFyYW1zLmJ1YmJsZXMsXHJcbiAgICAgIHBhcmFtcy5jYW5jZWxhYmxlLFxyXG4gICAgICBwYXJhbXMuZGV0YWlsXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIGV2dDtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xyXG59KSgpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGVscHJvdG8gPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlO1xyXG5jb25zdCBISURERU4gPSAnaGlkZGVuJztcclxuXHJcbmlmICghKEhJRERFTiBpbiBlbHByb3RvKSkge1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbHByb3RvLCBISURERU4sIHtcclxuICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShISURERU4sICcnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc0xpc3QgYW5kIERPTVRva2VuTGlzdFxyXG5yZXF1aXJlKCdjbGFzc2xpc3QtcG9seWZpbGwnKTtcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5oaWRkZW5cclxucmVxdWlyZSgnLi9lbGVtZW50LWhpZGRlbicpO1xyXG5cclxuLy8gcG9seWZpbGxzIE51bWJlci5pc05hTigpXHJcbnJlcXVpcmUoXCIuL251bWJlci1pcy1uYW5cIik7XHJcblxyXG4vLyBwb2x5ZmlsbHMgQ3VzdG9tRXZlbnRcclxucmVxdWlyZShcIi4vY3VzdG9tLWV2ZW50XCIpO1xyXG5cclxucmVxdWlyZSgnY29yZS1qcy9mbi9vYmplY3QvYXNzaWduJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vYXJyYXkvZnJvbScpOyIsIk51bWJlci5pc05hTiA9XHJcbiAgTnVtYmVyLmlzTmFOIHx8XHJcbiAgZnVuY3Rpb24gaXNOYU4oaW5wdXQpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcclxuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCIgJiYgaW5wdXQgIT09IGlucHV0O1xyXG4gIH07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gKGh0bWxEb2N1bWVudCA9IGRvY3VtZW50KSA9PiBodG1sRG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7XHJcbmNvbnN0IHJlY2VwdG9yID0gcmVxdWlyZShcInJlY2VwdG9yXCIpO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlcXVlbmNlXHJcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IHNlcSBhbiBhcnJheSBvZiBmdW5jdGlvbnNcclxuICogQHJldHVybiB7IGNsb3N1cmUgfSBjYWxsSG9va3NcclxuICovXHJcbi8vIFdlIHVzZSBhIG5hbWVkIGZ1bmN0aW9uIGhlcmUgYmVjYXVzZSB3ZSB3YW50IGl0IHRvIGluaGVyaXQgaXRzIGxleGljYWwgc2NvcGVcclxuLy8gZnJvbSB0aGUgYmVoYXZpb3IgcHJvcHMgb2JqZWN0LCBub3QgZnJvbSB0aGUgbW9kdWxlXHJcbmNvbnN0IHNlcXVlbmNlID0gKC4uLnNlcSkgPT5cclxuICBmdW5jdGlvbiBjYWxsSG9va3ModGFyZ2V0ID0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgc2VxLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXNbbWV0aG9kXSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgdGhpc1ttZXRob2RdLmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBiZWhhdmlvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnRzXHJcbiAqIEBwYXJhbSB7b2JqZWN0P30gcHJvcHNcclxuICogQHJldHVybiB7cmVjZXB0b3IuYmVoYXZpb3J9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChldmVudHMsIHByb3BzKSA9PlxyXG4gIHJlY2VwdG9yLmJlaGF2aW9yKFxyXG4gICAgZXZlbnRzLFxyXG4gICAgYXNzaWduKFxyXG4gICAgICB7XHJcbiAgICAgICAgb246IHNlcXVlbmNlKFwiaW5pdFwiLCBcImFkZFwiKSxcclxuICAgICAgICBvZmY6IHNlcXVlbmNlKFwidGVhcmRvd25cIiwgXCJyZW1vdmVcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb3BzXHJcbiAgICApXHJcbiAgKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgJ3hzJzogMCxcclxuICAnc20nOiA1NzYsXHJcbiAgJ21kJzogNzY4LFxyXG4gICdsZyc6IDk5MixcclxuICAneGwnOiAxMjAwXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJyZWFrcG9pbnRzO1xyXG4iLCIvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU1NzQzM1xyXG5mdW5jdGlvbiBpc0VsZW1lbnRJblZpZXdwb3J0IChlbCwgd2luPXdpbmRvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jRWw9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcbiAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIHJlY3QudG9wID49IDAgJiZcclxuICAgIHJlY3QubGVmdCA+PSAwICYmXHJcbiAgICByZWN0LmJvdHRvbSA8PSAod2luLmlubmVySGVpZ2h0IHx8IGRvY0VsLmNsaWVudEhlaWdodCkgJiZcclxuICAgIHJlY3QucmlnaHQgPD0gKHdpbi5pbm5lcldpZHRoIHx8IGRvY0VsLmNsaWVudFdpZHRoKVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNFbGVtZW50SW5WaWV3cG9ydDtcclxuIiwiLy8gaU9TIGRldGVjdGlvbiBmcm9tOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MDM5ODg1LzE3NzcxMFxyXG5mdW5jdGlvbiBpc0lvc0RldmljZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhpUG9kfGlQaG9uZXxpUGFkKS9nKSB8fFxyXG4gICAgICAobmF2aWdhdG9yLnBsYXRmb3JtID09PSBcIk1hY0ludGVsXCIgJiYgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMSkpICYmXHJcbiAgICAhd2luZG93Lk1TU3RyZWFtXHJcbiAgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc0lvc0RldmljZTtcclxuIiwiLyoqXHJcbiAqIEBuYW1lIGlzRWxlbWVudFxyXG4gKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9ICh2YWx1ZSkgPT5cclxuICB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoc2VsZWN0b3IsIGNvbnRleHQpID0+IHtcclxuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc2VsZWN0aW9uKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgQ09OVFJPTFMgPSAnYXJpYS1jb250cm9scyc7XHJcbmNvbnN0IEhJRERFTiA9ICdhcmlhLWhpZGRlbic7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XHJcblxyXG4gIGlmICh0eXBlb2YgZXhwYW5kZWQgIT09ICdib29sZWFuJykge1xyXG4gICAgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ2ZhbHNlJztcclxuICB9XHJcbiAgYnV0dG9uLnNldEF0dHJpYnV0ZShFWFBBTkRFRCwgZXhwYW5kZWQpO1xyXG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XHJcbiAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgaWYgKCFjb250cm9scykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAnTm8gdG9nZ2xlIHRhcmdldCBmb3VuZCB3aXRoIGlkOiBcIicgKyBpZCArICdcIidcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb250cm9scy5zZXRBdHRyaWJ1dGUoSElEREVOLCAhZXhwYW5kZWQpO1xyXG4gIHJldHVybiBleHBhbmRlZDtcclxufTtcclxuIl19
