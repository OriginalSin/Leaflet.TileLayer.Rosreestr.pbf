(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$4 = Object.defineProperty;

	var setGlobal = function (key, value) {
	  try {
	    defineProperty$4(global_1, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store$1 = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store$1;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.20.0',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});
	});

	var FunctionPrototype$2 = Function.prototype;
	var bind$3 = FunctionPrototype$2.bind;
	var call$2 = FunctionPrototype$2.call;
	var callBind = bind$3 && bind$3.bind(call$2);

	var functionUncurryThis = bind$3 ? function (fn) {
	  return fn && callBind(call$2, fn);
	} : function (fn) {
	  return fn && function () {
	    return call$2.apply(fn, arguments);
	  };
	};

	var TypeError$h = global_1.TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError$h("Can't call method on " + it);
	  return it;
	};

	var Object$5 = global_1.Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object$5(requireObjectCoercible(argument));
	};

	var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};

	var id = 0;
	var postfix = Math.random();
	var toString$1 = functionUncurryThis(1.0.toString);

	var uid = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$1(++id + postfix, 36);
	};

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable = function (argument) {
	  return typeof argument == 'function';
	};

	var aFunction = function (argument) {
	  return isCallable(argument) ? argument : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process$3 = global_1.process;
	var Deno = global_1.Deno;
	var versions = process$3 && process$3.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	/* eslint-disable es/no-symbol -- required for testing */



	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  var symbol = Symbol();
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && engineV8Version && engineV8Version < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */


	var useSymbolAsUid = nativeSymbol
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var symbolFor = Symbol$1 && Symbol$1['for'];
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!hasOwnProperty_1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
	    var description = 'Symbol.' + name;
	    if (nativeSymbol && hasOwnProperty_1(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else if (useSymbolAsUid && symbolFor) {
	      WellKnownSymbolsStore[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
	    }
	  } return WellKnownSymbolsStore[name];
	};

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$3] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var isObject = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it);
	};

	var document$3 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject(document$3) && isObject(document$3.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS$1 ? document$3.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var String$5 = global_1.String;
	var TypeError$g = global_1.TypeError;

	// `Assert: Type(argument) is Object`
	var anObject = function (argument) {
	  if (isObject(argument)) return argument;
	  throw TypeError$g(String$5(argument) + ' is not an object');
	};

	var call$1 = Function.prototype.call;

	var functionCall = call$1.bind ? call$1.bind(call$1) : function () {
	  return call$1.apply(call$1, arguments);
	};

	var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

	var Object$4 = global_1.Object;

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, Object$4(it));
	};

	var String$4 = global_1.String;

	var tryToString = function (argument) {
	  try {
	    return String$4(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var TypeError$f = global_1.TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable = function (argument) {
	  if (isCallable(argument)) return argument;
	  throw TypeError$f(tryToString(argument) + ' is not a function');
	};

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable(func);
	};

	var TypeError$e = global_1.TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  throw TypeError$e("Can't convert object to primitive value");
	};

	var TypeError$d = global_1.TypeError;
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive = function (input, pref) {
	  if (!isObject(input) || isSymbol(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = functionCall(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol(result)) return result;
	    throw TypeError$d("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var TypeError$c = global_1.TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	var f$5 = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError$c('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$5
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var functionToString = functionUncurryThis(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable(sharedStore.inspectSource)) {
	  sharedStore.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$1 = global_1.WeakMap;

	var nativeWeakMap = isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));

	var keys$1 = shared('keys');

	var sharedKey = function (key) {
	  return keys$1[key] || (keys$1[key] = uid(key));
	};

	var hiddenKeys$1 = {};

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$b = global_1.TypeError;
	var WeakMap = global_1.WeakMap;
	var set$2, get$1, has;

	var enforce = function (it) {
	  return has(it) ? get$1(it) : set$2(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get$1(it)).type !== TYPE) {
	      throw TypeError$b('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap || sharedStore.state) {
	  var store = sharedStore.state || (sharedStore.state = new WeakMap());
	  var wmget = functionUncurryThis(store.get);
	  var wmhas = functionUncurryThis(store.has);
	  var wmset = functionUncurryThis(store.set);
	  set$2 = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$b(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store, it, metadata);
	    return metadata;
	  };
	  get$1 = function (it) {
	    return wmget(store, it) || {};
	  };
	  has = function (it) {
	    return wmhas(store, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys$1[STATE] = true;
	  set$2 = function (it, metadata) {
	    if (hasOwnProperty_1(it, STATE)) throw new TypeError$b(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get$1 = function (it) {
	    return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwnProperty_1(it, STATE);
	  };
	}

	var internalState = {
	  set: set$2,
	  get: get$1,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var FunctionPrototype$1 = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwnProperty_1(FunctionPrototype$1, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$1, 'name').configurable));

	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var redefine = createCommonjsModule(function (module) {
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;
	  if (isCallable(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }
	    if (!hasOwnProperty_1(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
	      createNonEnumerableProperty(value, 'name', name);
	    }
	    state = enforceInternalState(value);
	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable(this) && getInternalState(this).source || inspectSource(this);
	});
	});

	var toString = functionUncurryThis({}.toString);
	var stringSlice$3 = functionUncurryThis(''.slice);

	var classofRaw = function (it) {
	  return stringSlice$3(toString(it), 8, -1);
	};

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	var Object$3 = global_1.Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object$3(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	var f$4 = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$2(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f$4
	};

	var Object$2 = global_1.Object;
	var split = functionUncurryThis(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object$2('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split(it, '') : Object$2(it);
	} : Object$2;

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	var f$3 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPropertyKey(P);
	  if (ie8DomDefine) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$3
	};

	var ceil = Math.ceil;
	var floor$4 = Math.floor;

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- safe
	  return number !== number || number === 0 ? 0 : (number > 0 ? floor$4 : ceil)(number);
	};

	var max$2 = Math.max;
	var min$4 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toIntegerOrInfinity(index);
	  return integer < 0 ? max$2(integer + length, 0) : min$4(integer, length);
	};

	var min$3 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min$3(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike = function (obj) {
	  return toLength(obj.length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$3 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = lengthOfArrayLike(O);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$3(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$3(false)
	};

	var indexOf$1 = arrayIncludes.indexOf;


	var push$2 = functionUncurryThis([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwnProperty_1(hiddenKeys$1, key) && hasOwnProperty_1(O, key) && push$2(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
	    ~indexOf$1(result, key) || push$2(result, key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	var f$2 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys);
	};

	var objectGetOwnPropertyNames = {
		f: f$2
	};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	var f$1 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$1
	};

	var concat = functionUncurryThis([].concat);

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwnProperty_1(target, key) && !(exceptions && hasOwnProperty_1(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : isCallable(detection) ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	  options.name        - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var nativePromiseConstructor = global_1.Promise;

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var String$3 = global_1.String;
	var TypeError$a = global_1.TypeError;

	var aPossiblePrototype = function (argument) {
	  if (typeof argument == 'object' || isCallable(argument)) return argument;
	  throw TypeError$a("Can't set " + String$3(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */




	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var defineProperty$3 = objectDefineProperty.f;



	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (target, TAG, STATIC) {
	  if (target && !STATIC) target = target.prototype;
	  if (target && !hasOwnProperty_1(target, TO_STRING_TAG$1)) {
	    defineProperty$3(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
	  }
	};

	var SPECIES$6 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$6]) {
	    defineProperty(Constructor, SPECIES$6, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var TypeError$9 = global_1.TypeError;

	var anInstance = function (it, Prototype) {
	  if (objectIsPrototypeOf(Prototype, it)) return it;
	  throw TypeError$9('Incorrect invocation');
	};

	var bind$2 = functionUncurryThis(functionUncurryThis.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
	  aCallable(fn);
	  return that === undefined ? fn : bind$2 ? bind$2(fn, that) : function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var iterators = {};

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$5] === it);
	};

	var ITERATOR$4 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return getMethod(it, ITERATOR$4)
	    || getMethod(it, '@@iterator')
	    || iterators[classof(it)];
	};

	var TypeError$8 = global_1.TypeError;

	var getIterator = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
	  if (aCallable(iteratorMethod)) return anObject(functionCall(iteratorMethod, argument));
	  throw TypeError$8(tryToString(argument) + ' is not iterable');
	};

	var iteratorClose = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject(iterator);
	  try {
	    innerResult = getMethod(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = functionCall(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject(innerResult);
	  return value;
	};

	var TypeError$7 = global_1.TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = functionBindContext(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw TypeError$7(tryToString(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && objectIsPrototypeOf(ResultPrototype, result)) return result;
	      } return new Result(false);
	    }
	    iterator = getIterator(iterable, iterFn);
	  }

	  next = iterator.next;
	  while (!(step = functionCall(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && objectIsPrototypeOf(ResultPrototype, result)) return result;
	  } return new Result(false);
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$3] = function () {
	    return this;
	  };
	  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$3] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var noop = function () { /* empty */ };
	var empty = [];
	var construct = getBuiltIn('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$1 = functionUncurryThis(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  try {
	    construct(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  switch (classof(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction': return false;
	  }
	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING || !!exec$1(constructorRegExp, inspectSource(argument));
	  } catch (error) {
	    return true;
	  }
	};

	isConstructorLegacy.sham = true;

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor = !construct || fails(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call)
	    || !isConstructorModern(Object)
	    || !isConstructorModern(function () { called = true; })
	    || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var TypeError$6 = global_1.TypeError;

	// `Assert: IsConstructor(argument) is true`
	var aConstructor = function (argument) {
	  if (isConstructor(argument)) return argument;
	  throw TypeError$6(tryToString(argument) + ' is not a constructor');
	};

	var SPECIES$5 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$5]) == undefined ? defaultConstructor : aConstructor(S);
	};

	var FunctionPrototype = Function.prototype;
	var apply = FunctionPrototype.apply;
	var bind$1 = FunctionPrototype.bind;
	var call = FunctionPrototype.call;

	// eslint-disable-next-line es/no-reflect -- safe
	var functionApply = typeof Reflect == 'object' && Reflect.apply || (bind$1 ? call.bind(apply) : function () {
	  return call.apply(apply, arguments);
	});

	var html = getBuiltIn('document', 'documentElement');

	var arraySlice = functionUncurryThis([].slice);

	var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(engineUserAgent);

	var engineIsNode = classofRaw(global_1.process) == 'process';

	var set$1 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process$2 = global_1.process;
	var Dispatch = global_1.Dispatch;
	var Function$1 = global_1.Function;
	var MessageChannel = global_1.MessageChannel;
	var String$2 = global_1.String;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var location, defer, channel, port;

	try {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  location = global_1.location;
	} catch (error) { /* empty */ }

	var run = function (id) {
	  if (hasOwnProperty_1(queue, id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(String$2(id), location.protocol + '//' + location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(fn) {
	    var args = arraySlice(arguments, 1);
	    queue[++counter] = function () {
	      functionApply(isCallable(fn) ? fn : Function$1(fn), undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (engineIsNode) {
	    defer = function (id) {
	      process$2.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !engineIsIos) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = functionBindContext(port.postMessage, port);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global_1.addEventListener &&
	    isCallable(global_1.postMessage) &&
	    !global_1.importScripts &&
	    location && location.protocol !== 'file:' &&
	    !fails(post)
	  ) {
	    defer = post;
	    global_1.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task$1 = {
	  set: set$1,
	  clear: clear
	};

	var engineIsIosPebble = /ipad|iphone|ipod/i.test(engineUserAgent) && global_1.Pebble !== undefined;

	var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var macrotask = task$1.set;





	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var document$2 = global_1.document;
	var process$1 = global_1.process;
	var Promise$1 = global_1.Promise;
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify$1, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (engineIsNode && (parent = process$1.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify$1();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
	  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify$1 = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (!engineIsIosPebble && Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    // workaround of WebKit ~ iOS Safari 10.1 bug
	    promise.constructor = Promise$1;
	    then = functionBindContext(promise.then, promise);
	    notify$1 = function () {
	      then(flush);
	    };
	  // Node.js without promises
	  } else if (engineIsNode) {
	    notify$1 = function () {
	      process$1.nextTick(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    // strange IE + webpack dev server bug - use .bind(global)
	    macrotask = functionBindContext(macrotask, global_1);
	    notify$1 = function () {
	      macrotask(flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify$1();
	  } last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aCallable(resolve);
	  this.reject = aCallable(reject);
	};

	// `NewPromiseCapability` abstract operation
	// https://tc39.es/ecma262/#sec-newpromisecapability
	var f = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability$1 = {
		f: f
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability$1.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors = function (a, b) {
	  var console = global_1.console;
	  if (console && console.error) {
	    arguments.length == 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var engineIsBrowser = typeof window == 'object';

	var task = task$1.set;












	var SPECIES$4 = wellKnownSymbol('species');
	var PROMISE = 'Promise';

	var getInternalState$3 = internalState.getterFor(PROMISE);
	var setInternalState$2 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var NativePromisePrototype = nativePromiseConstructor && nativePromiseConstructor.prototype;
	var PromiseConstructor = nativePromiseConstructor;
	var PromisePrototype = NativePromisePrototype;
	var TypeError$5 = global_1.TypeError;
	var document$1 = global_1.document;
	var process = global_1.process;
	var newPromiseCapability = newPromiseCapability$1.f;
	var newGenericPromiseCapability = newPromiseCapability;

	var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global_1.dispatchEvent);
	var NATIVE_REJECTION_EVENT = isCallable(global_1.PromiseRejectionEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var SUBCLASSING = false;

	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED$5 = isForced_1(PROMISE, function () {
	  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
	  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor);
	  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	  // We can't detect it synchronously, so just check versions
	  if (!GLOBAL_CORE_JS_PROMISE && engineV8Version === 66) return true;
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (engineV8Version >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = new PromiseConstructor(function (resolve) { resolve(1); });
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES$4] = FakePromise;
	  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
	  if (!SUBCLASSING) return true;
	  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	  return !GLOBAL_CORE_JS_PROMISE && engineIsBrowser && !NATIVE_REJECTION_EVENT;
	});

	var INCORRECT_ITERATION = FORCED$5 || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && isCallable(then = it.then) ? then : false;
	};

	var notify = function (state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0;
	    // variable length - can't use forEach
	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
	            state.rejection = HANDLED;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // can throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$5('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            functionCall(then, result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$1.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (!NATIVE_REJECTION_EVENT && (handler = global_1['on' + name])) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (state) {
	  functionCall(task, global_1, function () {
	    var promise = state.facade;
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (engineIsNode) {
	          process.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (state) {
	  functionCall(task, global_1, function () {
	    var promise = state.facade;
	    if (engineIsNode) {
	      process.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind = function (fn, state, unwrap) {
	  return function (value) {
	    fn(state, value, unwrap);
	  };
	};

	var internalReject = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify(state, true);
	};

	var internalResolve = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (state.facade === value) throw TypeError$5("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = { done: false };
	        try {
	          functionCall(then, value,
	            bind(internalResolve, wrapper, state),
	            bind(internalReject, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify(state, false);
	    }
	  } catch (error) {
	    internalReject({ done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$5) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromisePrototype);
	    aCallable(executor);
	    functionCall(Internal, this);
	    var state = getInternalState$3(this);
	    try {
	      executor(bind(internalResolve, state), bind(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };
	  PromisePrototype = PromiseConstructor.prototype;
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  Internal = function Promise(executor) {
	    setInternalState$2(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal.prototype = redefineAll(PromisePrototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.es/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reactions = state.reactions;
	      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
	      reaction.fail = isCallable(onRejected) && onRejected;
	      reaction.domain = engineIsNode ? process.domain : undefined;
	      state.parent = true;
	      reactions[reactions.length] = reaction;
	      if (state.state != PENDING) notify(state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.es/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$3(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, state);
	    this.reject = bind(internalReject, state);
	  };
	  newPromiseCapability$1.f = newPromiseCapability = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if (isCallable(nativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
	    nativeThen = NativePromisePrototype.then;

	    if (!SUBCLASSING) {
	      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
	      redefine(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
	        var that = this;
	        return new PromiseConstructor(function (resolve, reject) {
	          functionCall(nativeThen, that, resolve, reject);
	        }).then(onFulfilled, onRejected);
	      // https://github.com/zloirock/core-js/issues/640
	      }, { unsafe: true });

	      // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
	      redefine(NativePromisePrototype, 'catch', PromisePrototype['catch'], { unsafe: true });
	    }

	    // make `.constructor === Promise` work for native promise-based APIs
	    try {
	      delete NativePromisePrototype.constructor;
	    } catch (error) { /* empty */ }

	    // make `instanceof Promise` work for native promise-based APIs
	    if (objectSetPrototypeOf) {
	      objectSetPrototypeOf(NativePromisePrototype, PromisePrototype);
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: FORCED$5 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = getBuiltIn(PROMISE);

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED$5 }, {
	  // `Promise.reject` method
	  // https://tc39.es/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    functionCall(capability.reject, undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced: FORCED$5 }, {
	  // `Promise.resolve` method
	  // https://tc39.es/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve(this, x);
	  }
	});

	_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
	  // `Promise.all` method
	  // https://tc39.es/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aCallable(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        functionCall($promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.es/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aCallable(C.resolve);
	      iterate(iterable, function (promise) {
	        functionCall($promiseResolve, C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`


	var classList = documentCreateElement('span').classList;
	var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

	var domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray = Array.isArray || function isArray(argument) {
	  return classofRaw(argument) == 'Array';
	};

	var SPECIES$3 = wellKnownSymbol('species');
	var Array$6 = global_1.Array;

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesConstructor = function (originalArray) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (isConstructor(C) && (C === Array$6 || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES$3];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array$6 : C;
	};

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var push$1 = functionUncurryThis([].push);

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod$2 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that);
	    var length = lengthOfArrayLike(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push$1(target, value);      // filter
	        } else switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push$1(target, value);      // filterReject
	        }
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$2(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$2(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$2(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$2(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$2(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$2(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$2(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$2(7)
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $forEach$1 = arrayIteration.forEach;


	var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD$1 ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	} : [].forEach;

	var handlePrototype = function (CollectionPrototype) {
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	};

	for (var COLLECTION_NAME in domIterables) {
	  if (domIterables[COLLECTION_NAME]) {
	    handlePrototype(global_1[COLLECTION_NAME] && global_1[COLLECTION_NAME].prototype);
	  }
	}

	handlePrototype(domTokenListPrototype);

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var String$1 = global_1.String;

	var toString_1 = function (argument) {
	  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String$1(argument);
	};

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	var $RegExp$2 = global_1.RegExp;

	var UNSUPPORTED_Y$2 = fails(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	// UC Browser bug
	// https://github.com/zloirock/core-js/issues/1008
	var MISSED_STICKY = UNSUPPORTED_Y$2 || fails(function () {
	  return !$RegExp$2('a', 'y').sticky;
	});

	var BROKEN_CARET = UNSUPPORTED_Y$2 || fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
	  BROKEN_CARET: BROKEN_CARET,
	  MISSED_STICKY: MISSED_STICKY,
	  UNSUPPORTED_Y: UNSUPPORTED_Y$2
	};

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
	  return O;
	};

	/* global ActiveXObject -- old IE, WSH */








	var GT = '>';
	var LT = '<';
	var PROTOTYPE$1 = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE$1][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys$1[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE$1] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
	var $RegExp$1 = global_1.RegExp;

	var regexpUnsupportedDotAll = fails(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
	var $RegExp = global_1.RegExp;

	var regexpUnsupportedNcg = fails(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' ||
	    'b'.replace(re, '$<a>c') !== 'bc';
	});

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
	/* eslint-disable regexp/no-useless-quantifier -- testing */







	var getInternalState$2 = internalState.get;



	var nativeReplace = shared('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt$2 = functionUncurryThis(''.charAt);
	var indexOf = functionUncurryThis(''.indexOf);
	var replace = functionUncurryThis(''.replace);
	var stringSlice$2 = functionUncurryThis(''.slice);

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  functionCall(nativeExec, re1, 'a');
	  functionCall(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || regexpUnsupportedDotAll || regexpUnsupportedNcg;

	if (PATCH) {
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState$2(re);
	    var str = toString_1(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = functionCall(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = functionCall(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = replace(flags, 'y', '');
	      if (indexOf(flags, 'g') === -1) {
	        flags += 'g';
	      }

	      strCopy = stringSlice$2(str, re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$2(str, re.lastIndex - 1) !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = functionCall(nativeExec, sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = stringSlice$2(match.input, charsAdded);
	        match[0] = stringSlice$2(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      functionCall(nativeReplace, match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = objectCreate(null);
	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points








	var SPECIES$2 = wellKnownSymbol('species');
	var RegExpPrototype = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$2] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    FORCED
	  ) {
	    var uncurriedNativeRegExpMethod = functionUncurryThis(/./[SYMBOL]);
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var uncurriedNativeMethod = functionUncurryThis(nativeMethod);
	      var $exec = regexp.exec;
	      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
	        }
	        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
	      }
	      return { done: false };
	    });

	    redefine(String.prototype, KEY, methods[0]);
	    redefine(RegExpPrototype, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
	};

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var charAt$1 = functionUncurryThis(''.charAt);
	var charCodeAt = functionUncurryThis(''.charCodeAt);
	var stringSlice$1 = functionUncurryThis(''.slice);

	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString_1(requireObjectCoercible($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING
	          ? charAt$1(S, position)
	          : first
	        : CONVERT_TO_STRING
	          ? stringSlice$1(S, position, position + 2)
	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var charAt = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var Array$5 = global_1.Array;
	var max$1 = Math.max;

	var arraySliceSimple = function (O, start, end) {
	  var length = lengthOfArrayLike(O);
	  var k = toAbsoluteIndex(start, length);
	  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	  var result = Array$5(max$1(fin - k, 0));
	  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
	  result.length = n;
	  return result;
	};

	var TypeError$4 = global_1.TypeError;

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (isCallable(exec)) {
	    var result = functionCall(exec, R, S);
	    if (result !== null) anObject(result);
	    return result;
	  }
	  if (classofRaw(R) === 'RegExp') return functionCall(regexpExec, R, S);
	  throw TypeError$4('RegExp#exec called on incompatible receiver');
	};

	var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;
	var MAX_UINT32 = 0xFFFFFFFF;
	var min$2 = Math.min;
	var $push = [].push;
	var exec = functionUncurryThis(/./.exec);
	var push = functionUncurryThis($push);
	var stringSlice = functionUncurryThis(''.slice);

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	// @@split logic
	fixRegexpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    // eslint-disable-next-line regexp/no-empty-group -- required for testing
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = toString_1(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegexp(separator)) {
	        return functionCall(nativeSplit, string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = functionCall(regexpExec, separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          push(output, stringSlice(string, lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) functionApply($push, output, arraySliceSimple(match, 1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !exec(separatorCopy, '')) push(output, '');
	      } else push(output, stringSlice(string, lastLastIndex));
	      return output.length > lim ? arraySliceSimple(output, 0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : functionCall(nativeSplit, this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.es/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible(this);
	      var splitter = separator == undefined ? undefined : getMethod(separator, SPLIT);
	      return splitter
	        ? functionCall(splitter, separator, O, limit)
	        : functionCall(internalSplit, toString_1(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (string, limit) {
	      var rx = anObject(this);
	      var S = toString_1(string);
	      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

	      if (res.done) return res.value;

	      var C = speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (UNSUPPORTED_Y ? 'g' : 'y');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
	        var z = regexpExecAbstract(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
	        var e;
	        if (
	          z === null ||
	          (e = min$2(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          push(A, stringSlice(S, p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            push(A, z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      push(A, stringSlice(S, p));
	      return A;
	    }
	  ];
	}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

	var ARG_LENGTH = {
	  a: 7,
	  c: 6,
	  h: 1,
	  l: 2,
	  m: 2,
	  q: 4,
	  s: 4,
	  t: 2,
	  v: 1,
	  z: 0
	};
	var SEGMENT_PATTERN = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
	var NUMBER = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;

	function parseValues(args) {
	  var numbers = args.match(NUMBER);
	  return numbers ? numbers.map(Number) : [];
	}
	/**
	 * parse an svg path data string. Generates an Array
	 * of commands where each command is an Array of the
	 * form `[command, arg1, arg2, ...]`
	 *
	 * https://www.w3.org/TR/SVG/paths.html#PathDataGeneralInformation
	 * @ignore
	 *
	 * @param {string} path
	 * @returns {array}
	 */


	function parse(path) {
	  var data = [];
	  var p = String(path).trim(); // A path data segment (if there is one) must begin with a "moveto" command

	  if (p[0] !== "M" && p[0] !== "m") {
	    return data;
	  }

	  p.replace(SEGMENT_PATTERN, function (_, command, args) {
	    var type = command.toLowerCase();
	    var theArgs = parseValues(args);
	    var theCommand = command; // overloaded moveTo

	    if (type === "m" && theArgs.length > 2) {
	      data.push([theCommand].concat(theArgs.splice(0, 2)));
	      type = "l";
	      theCommand = theCommand === "m" ? "l" : "L";
	    } // Ignore invalid commands


	    if (theArgs.length < ARG_LENGTH[type]) {
	      return "";
	    }

	    data.push([theCommand].concat(theArgs.splice(0, ARG_LENGTH[type]))); // The command letter can be eliminated on subsequent commands if the
	    // same command is used multiple times in a row (e.g., you can drop the
	    // second "L" in "M 100 200 L 200 100 L -100 -200" and use
	    // "M 100 200 L 200 100 -100 -200" instead).

	    while (theArgs.length >= ARG_LENGTH[type] && theArgs.length && ARG_LENGTH[type]) {
	      data.push([theCommand].concat(theArgs.splice(0, ARG_LENGTH[type])));
	    }

	    return "";
	  });
	  return data;
	}

	var parsePath$2 = parse;

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	var parsePath$1 = parsePath$2;
	/**
	 * Work around for https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8438884/
	 * @ignore
	 */

	function supportsSvgPathArgument(window) {
	  var canvas = window.document.createElement("canvas");
	  var g = canvas.getContext("2d");
	  var p = new window.Path2D("M0 0 L1 1");
	  g.strokeStyle = "red";
	  g.lineWidth = 1;
	  g.stroke(p);
	  var imgData = g.getImageData(0, 0, 1, 1);
	  return imgData.data[0] === 255; // Check if pixel is red
	}

	function rotatePoint(point, angle) {
	  var nx = point.x * Math.cos(angle) - point.y * Math.sin(angle);
	  var ny = point.y * Math.cos(angle) + point.x * Math.sin(angle);
	  point.x = nx;
	  point.y = ny;
	}

	function translatePoint(point, dx, dy) {
	  point.x += dx;
	  point.y += dy;
	}

	function scalePoint(point, s) {
	  point.x *= s;
	  point.y *= s;
	}

	function polyFillPath2D(window) {
	  if (typeof window === "undefined" || !window.CanvasRenderingContext2D) {
	    return;
	  }

	  if (window.Path2D && supportsSvgPathArgument(window)) {
	    return;
	  }
	  /**
	   * Crates a Path2D polyfill object
	   * @constructor
	   * @ignore
	   * @param {String} path
	   */


	  var Path2D = /*#__PURE__*/function () {
	    function Path2D(path) {
	      _classCallCheck(this, Path2D);

	      this.segments = [];

	      if (path && path instanceof Path2D) {
	        var _this$segments;

	        (_this$segments = this.segments).push.apply(_this$segments, _toConsumableArray(path.segments));
	      } else if (path) {
	        this.segments = parsePath$1(path);
	      }
	    }

	    _createClass(Path2D, [{
	      key: "addPath",
	      value: function addPath(path) {
	        if (path && path instanceof Path2D) {
	          var _this$segments2;

	          (_this$segments2 = this.segments).push.apply(_this$segments2, _toConsumableArray(path.segments));
	        }
	      }
	    }, {
	      key: "moveTo",
	      value: function moveTo(x, y) {
	        this.segments.push(["M", x, y]);
	      }
	    }, {
	      key: "lineTo",
	      value: function lineTo(x, y) {
	        this.segments.push(["L", x, y]);
	      }
	    }, {
	      key: "arc",
	      value: function arc(x, y, r, start, end, ccw) {
	        this.segments.push(["AC", x, y, r, start, end, !!ccw]);
	      }
	    }, {
	      key: "arcTo",
	      value: function arcTo(x1, y1, x2, y2, r) {
	        this.segments.push(["AT", x1, y1, x2, y2, r]);
	      }
	    }, {
	      key: "ellipse",
	      value: function ellipse(x, y, rx, ry, angle, start, end, ccw) {
	        this.segments.push(["E", x, y, rx, ry, angle, start, end, !!ccw]);
	      }
	    }, {
	      key: "closePath",
	      value: function closePath() {
	        this.segments.push(["Z"]);
	      }
	    }, {
	      key: "bezierCurveTo",
	      value: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
	        this.segments.push(["C", cp1x, cp1y, cp2x, cp2y, x, y]);
	      }
	    }, {
	      key: "quadraticCurveTo",
	      value: function quadraticCurveTo(cpx, cpy, x, y) {
	        this.segments.push(["Q", cpx, cpy, x, y]);
	      }
	    }, {
	      key: "rect",
	      value: function rect(x, y, width, height) {
	        this.segments.push(["R", x, y, width, height]);
	      }
	    }]);

	    return Path2D;
	  }();

	  function buildPath(canvas, segments) {
	    var endAngle;
	    var startAngle;
	    var largeArcFlag;
	    var sweepFlag;
	    var endPoint;
	    var midPoint;
	    var angle;
	    var lambda;
	    var t1;
	    var t2;
	    var x;
	    var x1;
	    var y;
	    var y1;
	    var r;
	    var rx;
	    var ry;
	    var w;
	    var h;
	    var pathType;
	    var centerPoint;
	    var cpx;
	    var cpy;
	    var qcpx;
	    var qcpy;
	    var ccw;
	    var startPoint = {
	      x: 0,
	      y: 0
	    };
	    var currentPoint = {
	      x: 0,
	      y: 0
	    };
	    canvas.beginPath();

	    for (var i = 0; i < segments.length; ++i) {
	      var s = segments[i];
	      pathType = s[0]; // Reset control point if command is not cubic

	      if (pathType !== "S" && pathType !== "s" && pathType !== "C" && pathType !== "c") {
	        cpx = null;
	        cpy = null;
	      }

	      if (pathType !== "T" && pathType !== "t" && pathType !== "Q" && pathType !== "q") {
	        qcpx = null;
	        qcpy = null;
	      }

	      switch (pathType) {
	        case "m":
	        case "M":
	          if (pathType === "m") {
	            x += s[1];
	            y += s[2];
	          } else {
	            x = s[1];
	            y = s[2];
	          }

	          if (pathType === "M" || !startPoint) {
	            startPoint = {
	              x: x,
	              y: y
	            };
	          }

	          canvas.moveTo(x, y);
	          break;

	        case "l":
	          x += s[1];
	          y += s[2];
	          canvas.lineTo(x, y);
	          break;

	        case "L":
	          x = s[1];
	          y = s[2];
	          canvas.lineTo(x, y);
	          break;

	        case "H":
	          x = s[1];
	          canvas.lineTo(x, y);
	          break;

	        case "h":
	          x += s[1];
	          canvas.lineTo(x, y);
	          break;

	        case "V":
	          y = s[1];
	          canvas.lineTo(x, y);
	          break;

	        case "v":
	          y += s[1];
	          canvas.lineTo(x, y);
	          break;

	        case "a":
	        case "A":
	          if (pathType === "a") {
	            x += s[6];
	            y += s[7];
	          } else {
	            x = s[6];
	            y = s[7];
	          }

	          rx = s[1]; // rx

	          ry = s[2]; // ry

	          angle = s[3] * Math.PI / 180;
	          largeArcFlag = !!s[4];
	          sweepFlag = !!s[5];
	          endPoint = {
	            x: x,
	            y: y
	          }; // https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes

	          midPoint = {
	            x: (currentPoint.x - endPoint.x) / 2,
	            y: (currentPoint.y - endPoint.y) / 2
	          };
	          rotatePoint(midPoint, -angle); // radius correction

	          lambda = midPoint.x * midPoint.x / (rx * rx) + midPoint.y * midPoint.y / (ry * ry);

	          if (lambda > 1) {
	            lambda = Math.sqrt(lambda);
	            rx *= lambda;
	            ry *= lambda;
	          }

	          centerPoint = {
	            x: rx * midPoint.y / ry,
	            y: -(ry * midPoint.x) / rx
	          };
	          t1 = rx * rx * ry * ry;
	          t2 = rx * rx * midPoint.y * midPoint.y + ry * ry * midPoint.x * midPoint.x;

	          if (sweepFlag !== largeArcFlag) {
	            scalePoint(centerPoint, Math.sqrt((t1 - t2) / t2) || 0);
	          } else {
	            scalePoint(centerPoint, -Math.sqrt((t1 - t2) / t2) || 0);
	          }

	          startAngle = Math.atan2((midPoint.y - centerPoint.y) / ry, (midPoint.x - centerPoint.x) / rx);
	          endAngle = Math.atan2(-(midPoint.y + centerPoint.y) / ry, -(midPoint.x + centerPoint.x) / rx);
	          rotatePoint(centerPoint, angle);
	          translatePoint(centerPoint, (endPoint.x + currentPoint.x) / 2, (endPoint.y + currentPoint.y) / 2);
	          canvas.save();
	          canvas.translate(centerPoint.x, centerPoint.y);
	          canvas.rotate(angle);
	          canvas.scale(rx, ry);
	          canvas.arc(0, 0, 1, startAngle, endAngle, !sweepFlag);
	          canvas.restore();
	          break;

	        case "C":
	          cpx = s[3]; // Last control point

	          cpy = s[4];
	          x = s[5];
	          y = s[6];
	          canvas.bezierCurveTo(s[1], s[2], cpx, cpy, x, y);
	          break;

	        case "c":
	          canvas.bezierCurveTo(s[1] + x, s[2] + y, s[3] + x, s[4] + y, s[5] + x, s[6] + y);
	          cpx = s[3] + x; // Last control point

	          cpy = s[4] + y;
	          x += s[5];
	          y += s[6];
	          break;

	        case "S":
	          if (cpx === null || cpy === null) {
	            cpx = x;
	            cpy = y;
	          }

	          canvas.bezierCurveTo(2 * x - cpx, 2 * y - cpy, s[1], s[2], s[3], s[4]);
	          cpx = s[1]; // last control point

	          cpy = s[2];
	          x = s[3];
	          y = s[4];
	          break;

	        case "s":
	          if (cpx === null || cpy === null) {
	            cpx = x;
	            cpy = y;
	          }

	          canvas.bezierCurveTo(2 * x - cpx, 2 * y - cpy, s[1] + x, s[2] + y, s[3] + x, s[4] + y);
	          cpx = s[1] + x; // last control point

	          cpy = s[2] + y;
	          x += s[3];
	          y += s[4];
	          break;

	        case "Q":
	          qcpx = s[1]; // last control point

	          qcpy = s[2];
	          x = s[3];
	          y = s[4];
	          canvas.quadraticCurveTo(qcpx, qcpy, x, y);
	          break;

	        case "q":
	          qcpx = s[1] + x; // last control point

	          qcpy = s[2] + y;
	          x += s[3];
	          y += s[4];
	          canvas.quadraticCurveTo(qcpx, qcpy, x, y);
	          break;

	        case "T":
	          if (qcpx === null || qcpy === null) {
	            qcpx = x;
	            qcpy = y;
	          }

	          qcpx = 2 * x - qcpx; // last control point

	          qcpy = 2 * y - qcpy;
	          x = s[1];
	          y = s[2];
	          canvas.quadraticCurveTo(qcpx, qcpy, x, y);
	          break;

	        case "t":
	          if (qcpx === null || qcpy === null) {
	            qcpx = x;
	            qcpy = y;
	          }

	          qcpx = 2 * x - qcpx; // last control point

	          qcpy = 2 * y - qcpy;
	          x += s[1];
	          y += s[2];
	          canvas.quadraticCurveTo(qcpx, qcpy, x, y);
	          break;

	        case "z":
	        case "Z":
	          x = startPoint.x;
	          y = startPoint.y;
	          startPoint = undefined;
	          canvas.closePath();
	          break;

	        case "AC":
	          // arc
	          x = s[1];
	          y = s[2];
	          r = s[3];
	          startAngle = s[4];
	          endAngle = s[5];
	          ccw = s[6];
	          canvas.arc(x, y, r, startAngle, endAngle, ccw);
	          break;

	        case "AT":
	          // arcTo
	          x1 = s[1];
	          y1 = s[2];
	          x = s[3];
	          y = s[4];
	          r = s[5];
	          canvas.arcTo(x1, y1, x, y, r);
	          break;

	        case "E":
	          // ellipse
	          x = s[1];
	          y = s[2];
	          rx = s[3];
	          ry = s[4];
	          angle = s[5];
	          startAngle = s[6];
	          endAngle = s[7];
	          ccw = s[8];
	          canvas.save();
	          canvas.translate(x, y);
	          canvas.rotate(angle);
	          canvas.scale(rx, ry);
	          canvas.arc(0, 0, 1, startAngle, endAngle, ccw);
	          canvas.restore();
	          break;

	        case "R":
	          // rect
	          x = s[1];
	          y = s[2];
	          w = s[3];
	          h = s[4];
	          startPoint = {
	            x: x,
	            y: y
	          };
	          canvas.rect(x, y, w, h);
	          break;

	      }

	      currentPoint.x = x;
	      currentPoint.y = y;
	    }
	  }

	  var cFill = window.CanvasRenderingContext2D.prototype.fill;
	  var cStroke = window.CanvasRenderingContext2D.prototype.stroke;

	  window.CanvasRenderingContext2D.prototype.fill = function fill() {
	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var fillRule = "nonzero";

	    if (args.length === 0 || args.length === 1 && typeof args[0] === "string") {
	      cFill.apply(this, args);
	      return;
	    }

	    if (arguments.length === 2) {
	      fillRule = args[1];
	    }

	    var path = args[0];
	    buildPath(this, path.segments);
	    cFill.call(this, fillRule);
	  };

	  window.CanvasRenderingContext2D.prototype.stroke = function stroke(path) {
	    if (!path) {
	      cStroke.call(this);
	      return;
	    }

	    buildPath(this, path.segments);
	    cStroke.call(this);
	  };

	  var cIsPointInPath = window.CanvasRenderingContext2D.prototype.isPointInPath;

	  window.CanvasRenderingContext2D.prototype.isPointInPath = function isPointInPath() {
	    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    // let fillRule = 'nonzero';
	    if (args[0].constructor.name === "Path2D") {
	      // first argument is a Path2D object
	      var x = args[1];
	      var y = args[2];
	      var fillRule = args[3] || "nonzero";
	      var path = args[0];
	      buildPath(this, path.segments);
	      return cIsPointInPath.apply(this, [x, y, fillRule]);
	    } else {
	      return cIsPointInPath.apply(this, args);
	    }
	  };

	  window.Path2D = Path2D;
	}

	var path2dPolyfill$1 = polyFillPath2D;
	var path2dPolyfill = path2dPolyfill$1;

	if (typeof window !== "undefined") {
	  path2dPolyfill(window);
	}

	var pointGeometry = Point;

	/**
	 * A standalone point geometry with useful accessor, comparison, and
	 * modification methods.
	 *
	 * @class Point
	 * @param {Number} x the x-coordinate. this could be longitude or screen
	 * pixels, or any other sort of unit.
	 * @param {Number} y the y-coordinate. this could be latitude or screen
	 * pixels, or any other sort of unit.
	 * @example
	 * var point = new Point(-77, 38);
	 */
	function Point(x, y) {
	    this.x = x;
	    this.y = y;
	}

	Point.prototype = {

	    /**
	     * Clone this point, returning a new point that can be modified
	     * without affecting the old one.
	     * @return {Point} the clone
	     */
	    clone: function() { return new Point(this.x, this.y); },

	    /**
	     * Add this point's x & y coordinates to another point,
	     * yielding a new point.
	     * @param {Point} p the other point
	     * @return {Point} output point
	     */
	    add:     function(p) { return this.clone()._add(p); },

	    /**
	     * Subtract this point's x & y coordinates to from point,
	     * yielding a new point.
	     * @param {Point} p the other point
	     * @return {Point} output point
	     */
	    sub:     function(p) { return this.clone()._sub(p); },

	    /**
	     * Multiply this point's x & y coordinates by point,
	     * yielding a new point.
	     * @param {Point} p the other point
	     * @return {Point} output point
	     */
	    multByPoint:    function(p) { return this.clone()._multByPoint(p); },

	    /**
	     * Divide this point's x & y coordinates by point,
	     * yielding a new point.
	     * @param {Point} p the other point
	     * @return {Point} output point
	     */
	    divByPoint:     function(p) { return this.clone()._divByPoint(p); },

	    /**
	     * Multiply this point's x & y coordinates by a factor,
	     * yielding a new point.
	     * @param {Point} k factor
	     * @return {Point} output point
	     */
	    mult:    function(k) { return this.clone()._mult(k); },

	    /**
	     * Divide this point's x & y coordinates by a factor,
	     * yielding a new point.
	     * @param {Point} k factor
	     * @return {Point} output point
	     */
	    div:     function(k) { return this.clone()._div(k); },

	    /**
	     * Rotate this point around the 0, 0 origin by an angle a,
	     * given in radians
	     * @param {Number} a angle to rotate around, in radians
	     * @return {Point} output point
	     */
	    rotate:  function(a) { return this.clone()._rotate(a); },

	    /**
	     * Rotate this point around p point by an angle a,
	     * given in radians
	     * @param {Number} a angle to rotate around, in radians
	     * @param {Point} p Point to rotate around
	     * @return {Point} output point
	     */
	    rotateAround:  function(a,p) { return this.clone()._rotateAround(a,p); },

	    /**
	     * Multiply this point by a 4x1 transformation matrix
	     * @param {Array<Number>} m transformation matrix
	     * @return {Point} output point
	     */
	    matMult: function(m) { return this.clone()._matMult(m); },

	    /**
	     * Calculate this point but as a unit vector from 0, 0, meaning
	     * that the distance from the resulting point to the 0, 0
	     * coordinate will be equal to 1 and the angle from the resulting
	     * point to the 0, 0 coordinate will be the same as before.
	     * @return {Point} unit vector point
	     */
	    unit:    function() { return this.clone()._unit(); },

	    /**
	     * Compute a perpendicular point, where the new y coordinate
	     * is the old x coordinate and the new x coordinate is the old y
	     * coordinate multiplied by -1
	     * @return {Point} perpendicular point
	     */
	    perp:    function() { return this.clone()._perp(); },

	    /**
	     * Return a version of this point with the x & y coordinates
	     * rounded to integers.
	     * @return {Point} rounded point
	     */
	    round:   function() { return this.clone()._round(); },

	    /**
	     * Return the magitude of this point: this is the Euclidean
	     * distance from the 0, 0 coordinate to this point's x and y
	     * coordinates.
	     * @return {Number} magnitude
	     */
	    mag: function() {
	        return Math.sqrt(this.x * this.x + this.y * this.y);
	    },

	    /**
	     * Judge whether this point is equal to another point, returning
	     * true or false.
	     * @param {Point} other the other point
	     * @return {boolean} whether the points are equal
	     */
	    equals: function(other) {
	        return this.x === other.x &&
	               this.y === other.y;
	    },

	    /**
	     * Calculate the distance from this point to another point
	     * @param {Point} p the other point
	     * @return {Number} distance
	     */
	    dist: function(p) {
	        return Math.sqrt(this.distSqr(p));
	    },

	    /**
	     * Calculate the distance from this point to another point,
	     * without the square root step. Useful if you're comparing
	     * relative distances.
	     * @param {Point} p the other point
	     * @return {Number} distance
	     */
	    distSqr: function(p) {
	        var dx = p.x - this.x,
	            dy = p.y - this.y;
	        return dx * dx + dy * dy;
	    },

	    /**
	     * Get the angle from the 0, 0 coordinate to this point, in radians
	     * coordinates.
	     * @return {Number} angle
	     */
	    angle: function() {
	        return Math.atan2(this.y, this.x);
	    },

	    /**
	     * Get the angle from this point to another point, in radians
	     * @param {Point} b the other point
	     * @return {Number} angle
	     */
	    angleTo: function(b) {
	        return Math.atan2(this.y - b.y, this.x - b.x);
	    },

	    /**
	     * Get the angle between this point and another point, in radians
	     * @param {Point} b the other point
	     * @return {Number} angle
	     */
	    angleWith: function(b) {
	        return this.angleWithSep(b.x, b.y);
	    },

	    /*
	     * Find the angle of the two vectors, solving the formula for
	     * the cross product a x b = |a||b|sin(θ) for θ.
	     * @param {Number} x the x-coordinate
	     * @param {Number} y the y-coordinate
	     * @return {Number} the angle in radians
	     */
	    angleWithSep: function(x, y) {
	        return Math.atan2(
	            this.x * y - this.y * x,
	            this.x * x + this.y * y);
	    },

	    _matMult: function(m) {
	        var x = m[0] * this.x + m[1] * this.y,
	            y = m[2] * this.x + m[3] * this.y;
	        this.x = x;
	        this.y = y;
	        return this;
	    },

	    _add: function(p) {
	        this.x += p.x;
	        this.y += p.y;
	        return this;
	    },

	    _sub: function(p) {
	        this.x -= p.x;
	        this.y -= p.y;
	        return this;
	    },

	    _mult: function(k) {
	        this.x *= k;
	        this.y *= k;
	        return this;
	    },

	    _div: function(k) {
	        this.x /= k;
	        this.y /= k;
	        return this;
	    },

	    _multByPoint: function(p) {
	        this.x *= p.x;
	        this.y *= p.y;
	        return this;
	    },

	    _divByPoint: function(p) {
	        this.x /= p.x;
	        this.y /= p.y;
	        return this;
	    },

	    _unit: function() {
	        this._div(this.mag());
	        return this;
	    },

	    _perp: function() {
	        var y = this.y;
	        this.y = this.x;
	        this.x = -y;
	        return this;
	    },

	    _rotate: function(angle) {
	        var cos = Math.cos(angle),
	            sin = Math.sin(angle),
	            x = cos * this.x - sin * this.y,
	            y = sin * this.x + cos * this.y;
	        this.x = x;
	        this.y = y;
	        return this;
	    },

	    _rotateAround: function(angle, p) {
	        var cos = Math.cos(angle),
	            sin = Math.sin(angle),
	            x = p.x + cos * (this.x - p.x) - sin * (this.y - p.y),
	            y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y);
	        this.x = x;
	        this.y = y;
	        return this;
	    },

	    _round: function() {
	        this.x = Math.round(this.x);
	        this.y = Math.round(this.y);
	        return this;
	    }
	};

	/**
	 * Construct a point from an array if necessary, otherwise if the input
	 * is already a Point, or an unknown type, return it unchanged
	 * @param {Array<Number>|Point|*} a any kind of input value
	 * @return {Point} constructed point, or passed-through value.
	 * @example
	 * // this
	 * var point = Point.convert([0, 1]);
	 * // is equivalent to
	 * var point = new Point(0, 1);
	 */
	Point.convert = function (a) {
	    if (a instanceof Point) {
	        return a;
	    }
	    if (Array.isArray(a)) {
	        return new Point(a[0], a[1]);
	    }
	    return a;
	};

	var vectortilefeature = VectorTileFeature;

	function VectorTileFeature(pbf, end, extent, keys, values) {
	    // Public
	    this.properties = {};
	    this.extent = extent;
	    this.type = 0;

	    // Private
	    this._pbf = pbf;
	    this._geometry = -1;
	    this._keys = keys;
	    this._values = values;

	    pbf.readFields(readFeature, this, end);
	}

	function readFeature(tag, feature, pbf) {
	    if (tag == 1) feature.id = pbf.readVarint();
	    else if (tag == 2) readTag(pbf, feature);
	    else if (tag == 3) feature.type = pbf.readVarint();
	    else if (tag == 4) feature._geometry = pbf.pos;
	}

	function readTag(pbf, feature) {
	    var end = pbf.readVarint() + pbf.pos;

	    while (pbf.pos < end) {
	        var key = feature._keys[pbf.readVarint()],
	            value = feature._values[pbf.readVarint()];
	        feature.properties[key] = value;
	    }
	}

	VectorTileFeature.types = ['Unknown', 'Point', 'LineString', 'Polygon'];

	VectorTileFeature.prototype.loadGeometry = function() {
	    var pbf = this._pbf;
	    pbf.pos = this._geometry;

	    var end = pbf.readVarint() + pbf.pos,
	        cmd = 1,
	        length = 0,
	        x = 0,
	        y = 0,
	        lines = [],
	        line;

	    while (pbf.pos < end) {
	        if (length <= 0) {
	            var cmdLen = pbf.readVarint();
	            cmd = cmdLen & 0x7;
	            length = cmdLen >> 3;
	        }

	        length--;

	        if (cmd === 1 || cmd === 2) {
	            x += pbf.readSVarint();
	            y += pbf.readSVarint();

	            if (cmd === 1) { // moveTo
	                if (line) lines.push(line);
	                line = [];
	            }

	            line.push(new pointGeometry(x, y));

	        } else if (cmd === 7) {

	            // Workaround for https://github.com/mapbox/mapnik-vector-tile/issues/90
	            if (line) {
	                line.push(line[0].clone()); // closePolygon
	            }

	        } else {
	            throw new Error('unknown command ' + cmd);
	        }
	    }

	    if (line) lines.push(line);

	    return lines;
	};

	VectorTileFeature.prototype.bbox = function() {
	    var pbf = this._pbf;
	    pbf.pos = this._geometry;

	    var end = pbf.readVarint() + pbf.pos,
	        cmd = 1,
	        length = 0,
	        x = 0,
	        y = 0,
	        x1 = Infinity,
	        x2 = -Infinity,
	        y1 = Infinity,
	        y2 = -Infinity;

	    while (pbf.pos < end) {
	        if (length <= 0) {
	            var cmdLen = pbf.readVarint();
	            cmd = cmdLen & 0x7;
	            length = cmdLen >> 3;
	        }

	        length--;

	        if (cmd === 1 || cmd === 2) {
	            x += pbf.readSVarint();
	            y += pbf.readSVarint();
	            if (x < x1) x1 = x;
	            if (x > x2) x2 = x;
	            if (y < y1) y1 = y;
	            if (y > y2) y2 = y;

	        } else if (cmd !== 7) {
	            throw new Error('unknown command ' + cmd);
	        }
	    }

	    return [x1, y1, x2, y2];
	};

	VectorTileFeature.prototype.toGeoJSON = function(x, y, z) {
	    var size = this.extent * Math.pow(2, z),
	        x0 = this.extent * x,
	        y0 = this.extent * y,
	        coords = this.loadGeometry(),
	        type = VectorTileFeature.types[this.type],
	        i, j;

	    function project(line) {
	        for (var j = 0; j < line.length; j++) {
	            var p = line[j], y2 = 180 - (p.y + y0) * 360 / size;
	            line[j] = [
	                (p.x + x0) * 360 / size - 180,
	                360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90
	            ];
	        }
	    }

	    switch (this.type) {
	    case 1:
	        var points = [];
	        for (i = 0; i < coords.length; i++) {
	            points[i] = coords[i][0];
	        }
	        coords = points;
	        project(coords);
	        break;

	    case 2:
	        for (i = 0; i < coords.length; i++) {
	            project(coords[i]);
	        }
	        break;

	    case 3:
	        coords = classifyRings(coords);
	        for (i = 0; i < coords.length; i++) {
	            for (j = 0; j < coords[i].length; j++) {
	                project(coords[i][j]);
	            }
	        }
	        break;
	    }

	    if (coords.length === 1) {
	        coords = coords[0];
	    } else {
	        type = 'Multi' + type;
	    }

	    var result = {
	        type: "Feature",
	        geometry: {
	            type: type,
	            coordinates: coords
	        },
	        properties: this.properties
	    };

	    if ('id' in this) {
	        result.id = this.id;
	    }

	    return result;
	};

	// classifies an array of rings into polygons with outer rings and holes

	function classifyRings(rings) {
	    var len = rings.length;

	    if (len <= 1) return [rings];

	    var polygons = [],
	        polygon,
	        ccw;

	    for (var i = 0; i < len; i++) {
	        var area = signedArea(rings[i]);
	        if (area === 0) continue;

	        if (ccw === undefined) ccw = area < 0;

	        if (ccw === area < 0) {
	            if (polygon) polygons.push(polygon);
	            polygon = [rings[i]];

	        } else {
	            polygon.push(rings[i]);
	        }
	    }
	    if (polygon) polygons.push(polygon);

	    return polygons;
	}

	function signedArea(ring) {
	    var sum = 0;
	    for (var i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
	        p1 = ring[i];
	        p2 = ring[j];
	        sum += (p2.x - p1.x) * (p1.y + p2.y);
	    }
	    return sum;
	}

	var vectortilelayer = VectorTileLayer;

	function VectorTileLayer(pbf, end) {
	    // Public
	    this.version = 1;
	    this.name = null;
	    this.extent = 4096;
	    this.length = 0;

	    // Private
	    this._pbf = pbf;
	    this._keys = [];
	    this._values = [];
	    this._features = [];

	    pbf.readFields(readLayer, this, end);

	    this.length = this._features.length;
	}

	function readLayer(tag, layer, pbf) {
	    if (tag === 15) layer.version = pbf.readVarint();
	    else if (tag === 1) layer.name = pbf.readString();
	    else if (tag === 5) layer.extent = pbf.readVarint();
	    else if (tag === 2) layer._features.push(pbf.pos);
	    else if (tag === 3) layer._keys.push(pbf.readString());
	    else if (tag === 4) layer._values.push(readValueMessage(pbf));
	}

	function readValueMessage(pbf) {
	    var value = null,
	        end = pbf.readVarint() + pbf.pos;

	    while (pbf.pos < end) {
	        var tag = pbf.readVarint() >> 3;

	        value = tag === 1 ? pbf.readString() :
	            tag === 2 ? pbf.readFloat() :
	            tag === 3 ? pbf.readDouble() :
	            tag === 4 ? pbf.readVarint64() :
	            tag === 5 ? pbf.readVarint() :
	            tag === 6 ? pbf.readSVarint() :
	            tag === 7 ? pbf.readBoolean() : null;
	    }

	    return value;
	}

	// return feature `i` from this layer as a `VectorTileFeature`
	VectorTileLayer.prototype.feature = function(i) {
	    if (i < 0 || i >= this._features.length) throw new Error('feature index out of bounds');

	    this._pbf.pos = this._features[i];

	    var end = this._pbf.readVarint() + this._pbf.pos;
	    return new vectortilefeature(this._pbf, end, this.extent, this._keys, this._values);
	};

	var vectortile = VectorTile$1;

	function VectorTile$1(pbf, end) {
	    this.layers = pbf.readFields(readTile, {}, end);
	}

	function readTile(tag, layers, pbf) {
	    if (tag === 3) {
	        var layer = new vectortilelayer(pbf, pbf.readVarint() + pbf.pos);
	        if (layer.length) layers[layer.name] = layer;
	    }
	}

	var VectorTile = vectortile;

	/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
	var read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	};

	var write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = ((value * c) - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

	var ieee754$1 = {
		read: read,
		write: write
	};

	var pbf = Pbf;



	function Pbf(buf) {
	    this.buf = ArrayBuffer.isView && ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf || 0);
	    this.pos = 0;
	    this.type = 0;
	    this.length = this.buf.length;
	}

	Pbf.Varint  = 0; // varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
	Pbf.Fixed64 = 1; // 64-bit: double, fixed64, sfixed64
	Pbf.Bytes   = 2; // length-delimited: string, bytes, embedded messages, packed repeated fields
	Pbf.Fixed32 = 5; // 32-bit: float, fixed32, sfixed32

	var SHIFT_LEFT_32 = (1 << 16) * (1 << 16),
	    SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;

	// Threshold chosen based on both benchmarking and knowledge about browser string
	// data structures (which currently switch structure types at 12 bytes or more)
	var TEXT_DECODER_MIN_LENGTH = 12;
	var utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf8');

	Pbf.prototype = {

	    destroy: function() {
	        this.buf = null;
	    },

	    // === READING =================================================================

	    readFields: function(readField, result, end) {
	        end = end || this.length;

	        while (this.pos < end) {
	            var val = this.readVarint(),
	                tag = val >> 3,
	                startPos = this.pos;

	            this.type = val & 0x7;
	            readField(tag, result, this);

	            if (this.pos === startPos) this.skip(val);
	        }
	        return result;
	    },

	    readMessage: function(readField, result) {
	        return this.readFields(readField, result, this.readVarint() + this.pos);
	    },

	    readFixed32: function() {
	        var val = readUInt32(this.buf, this.pos);
	        this.pos += 4;
	        return val;
	    },

	    readSFixed32: function() {
	        var val = readInt32(this.buf, this.pos);
	        this.pos += 4;
	        return val;
	    },

	    // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)

	    readFixed64: function() {
	        var val = readUInt32(this.buf, this.pos) + readUInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
	        this.pos += 8;
	        return val;
	    },

	    readSFixed64: function() {
	        var val = readUInt32(this.buf, this.pos) + readInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
	        this.pos += 8;
	        return val;
	    },

	    readFloat: function() {
	        var val = ieee754$1.read(this.buf, this.pos, true, 23, 4);
	        this.pos += 4;
	        return val;
	    },

	    readDouble: function() {
	        var val = ieee754$1.read(this.buf, this.pos, true, 52, 8);
	        this.pos += 8;
	        return val;
	    },

	    readVarint: function(isSigned) {
	        var buf = this.buf,
	            val, b;

	        b = buf[this.pos++]; val  =  b & 0x7f;        if (b < 0x80) return val;
	        b = buf[this.pos++]; val |= (b & 0x7f) << 7;  if (b < 0x80) return val;
	        b = buf[this.pos++]; val |= (b & 0x7f) << 14; if (b < 0x80) return val;
	        b = buf[this.pos++]; val |= (b & 0x7f) << 21; if (b < 0x80) return val;
	        b = buf[this.pos];   val |= (b & 0x0f) << 28;

	        return readVarintRemainder(val, isSigned, this);
	    },

	    readVarint64: function() { // for compatibility with v2.0.1
	        return this.readVarint(true);
	    },

	    readSVarint: function() {
	        var num = this.readVarint();
	        return num % 2 === 1 ? (num + 1) / -2 : num / 2; // zigzag encoding
	    },

	    readBoolean: function() {
	        return Boolean(this.readVarint());
	    },

	    readString: function() {
	        var end = this.readVarint() + this.pos;
	        var pos = this.pos;
	        this.pos = end;

	        if (end - pos >= TEXT_DECODER_MIN_LENGTH && utf8TextDecoder) {
	            // longer strings are fast with the built-in browser TextDecoder API
	            return readUtf8TextDecoder(this.buf, pos, end);
	        }
	        // short strings are fast with our custom implementation
	        return readUtf8(this.buf, pos, end);
	    },

	    readBytes: function() {
	        var end = this.readVarint() + this.pos,
	            buffer = this.buf.subarray(this.pos, end);
	        this.pos = end;
	        return buffer;
	    },

	    // verbose for performance reasons; doesn't affect gzipped size

	    readPackedVarint: function(arr, isSigned) {
	        if (this.type !== Pbf.Bytes) return arr.push(this.readVarint(isSigned));
	        var end = readPackedEnd(this);
	        arr = arr || [];
	        while (this.pos < end) arr.push(this.readVarint(isSigned));
	        return arr;
	    },
	    readPackedSVarint: function(arr) {
	        if (this.type !== Pbf.Bytes) return arr.push(this.readSVarint());
	        var end = readPackedEnd(this);
	        arr = arr || [];
	        while (this.pos < end) arr.push(this.readSVarint());
	        return arr;
	    },
	    readPackedBoolean: function(arr) {
	        if (this.type !== Pbf.Bytes) return arr.push(this.readBoolean());
	        var end = readPackedEnd(this);
	        arr = arr || [];
	        while (this.pos < end) arr.push(this.readBoolean());
	        return arr;
	    },
	    readPackedFloat: function(arr) {
	        if (this.type !== Pbf.Bytes) return arr.push(this.readFloat());
	        var end = readPackedEnd(this);
	        arr = arr || [];
	        while (this.pos < end) arr.push(this.readFloat());
	        return arr;
	    },
	    readPackedDouble: function(arr) {
	        if (this.type !== Pbf.Bytes) return arr.push(this.readDouble());
	        var end = readPackedEnd(this);
	        arr = arr || [];
	        while (this.pos < end) arr.push(this.readDouble());
	        return arr;
	    },
	    readPackedFixed32: function(arr) {
	        if (this.type !== Pbf.Bytes) return arr.push(this.readFixed32());
	        var end = readPackedEnd(this);
	        arr = arr || [];
	        while (this.pos < end) arr.push(this.readFixed32());
	        return arr;
	    },
	    readPackedSFixed32: function(arr) {
	        if (this.type !== Pbf.Bytes) return arr.push(this.readSFixed32());
	        var end = readPackedEnd(this);
	        arr = arr || [];
	        while (this.pos < end) arr.push(this.readSFixed32());
	        return arr;
	    },
	    readPackedFixed64: function(arr) {
	        if (this.type !== Pbf.Bytes) return arr.push(this.readFixed64());
	        var end = readPackedEnd(this);
	        arr = arr || [];
	        while (this.pos < end) arr.push(this.readFixed64());
	        return arr;
	    },
	    readPackedSFixed64: function(arr) {
	        if (this.type !== Pbf.Bytes) return arr.push(this.readSFixed64());
	        var end = readPackedEnd(this);
	        arr = arr || [];
	        while (this.pos < end) arr.push(this.readSFixed64());
	        return arr;
	    },

	    skip: function(val) {
	        var type = val & 0x7;
	        if (type === Pbf.Varint) while (this.buf[this.pos++] > 0x7f) {}
	        else if (type === Pbf.Bytes) this.pos = this.readVarint() + this.pos;
	        else if (type === Pbf.Fixed32) this.pos += 4;
	        else if (type === Pbf.Fixed64) this.pos += 8;
	        else throw new Error('Unimplemented type: ' + type);
	    },

	    // === WRITING =================================================================

	    writeTag: function(tag, type) {
	        this.writeVarint((tag << 3) | type);
	    },

	    realloc: function(min) {
	        var length = this.length || 16;

	        while (length < this.pos + min) length *= 2;

	        if (length !== this.length) {
	            var buf = new Uint8Array(length);
	            buf.set(this.buf);
	            this.buf = buf;
	            this.length = length;
	        }
	    },

	    finish: function() {
	        this.length = this.pos;
	        this.pos = 0;
	        return this.buf.subarray(0, this.length);
	    },

	    writeFixed32: function(val) {
	        this.realloc(4);
	        writeInt32(this.buf, val, this.pos);
	        this.pos += 4;
	    },

	    writeSFixed32: function(val) {
	        this.realloc(4);
	        writeInt32(this.buf, val, this.pos);
	        this.pos += 4;
	    },

	    writeFixed64: function(val) {
	        this.realloc(8);
	        writeInt32(this.buf, val & -1, this.pos);
	        writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
	        this.pos += 8;
	    },

	    writeSFixed64: function(val) {
	        this.realloc(8);
	        writeInt32(this.buf, val & -1, this.pos);
	        writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
	        this.pos += 8;
	    },

	    writeVarint: function(val) {
	        val = +val || 0;

	        if (val > 0xfffffff || val < 0) {
	            writeBigVarint(val, this);
	            return;
	        }

	        this.realloc(4);

	        this.buf[this.pos++] =           val & 0x7f  | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
	        this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
	        this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
	        this.buf[this.pos++] =   (val >>> 7) & 0x7f;
	    },

	    writeSVarint: function(val) {
	        this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
	    },

	    writeBoolean: function(val) {
	        this.writeVarint(Boolean(val));
	    },

	    writeString: function(str) {
	        str = String(str);
	        this.realloc(str.length * 4);

	        this.pos++; // reserve 1 byte for short string length

	        var startPos = this.pos;
	        // write the string directly to the buffer and see how much was written
	        this.pos = writeUtf8(this.buf, str, this.pos);
	        var len = this.pos - startPos;

	        if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);

	        // finally, write the message length in the reserved place and restore the position
	        this.pos = startPos - 1;
	        this.writeVarint(len);
	        this.pos += len;
	    },

	    writeFloat: function(val) {
	        this.realloc(4);
	        ieee754$1.write(this.buf, val, this.pos, true, 23, 4);
	        this.pos += 4;
	    },

	    writeDouble: function(val) {
	        this.realloc(8);
	        ieee754$1.write(this.buf, val, this.pos, true, 52, 8);
	        this.pos += 8;
	    },

	    writeBytes: function(buffer) {
	        var len = buffer.length;
	        this.writeVarint(len);
	        this.realloc(len);
	        for (var i = 0; i < len; i++) this.buf[this.pos++] = buffer[i];
	    },

	    writeRawMessage: function(fn, obj) {
	        this.pos++; // reserve 1 byte for short message length

	        // write the message directly to the buffer and see how much was written
	        var startPos = this.pos;
	        fn(obj, this);
	        var len = this.pos - startPos;

	        if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);

	        // finally, write the message length in the reserved place and restore the position
	        this.pos = startPos - 1;
	        this.writeVarint(len);
	        this.pos += len;
	    },

	    writeMessage: function(tag, fn, obj) {
	        this.writeTag(tag, Pbf.Bytes);
	        this.writeRawMessage(fn, obj);
	    },

	    writePackedVarint:   function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedVarint, arr);   },
	    writePackedSVarint:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedSVarint, arr);  },
	    writePackedBoolean:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedBoolean, arr);  },
	    writePackedFloat:    function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedFloat, arr);    },
	    writePackedDouble:   function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedDouble, arr);   },
	    writePackedFixed32:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedFixed32, arr);  },
	    writePackedSFixed32: function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedSFixed32, arr); },
	    writePackedFixed64:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedFixed64, arr);  },
	    writePackedSFixed64: function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedSFixed64, arr); },

	    writeBytesField: function(tag, buffer) {
	        this.writeTag(tag, Pbf.Bytes);
	        this.writeBytes(buffer);
	    },
	    writeFixed32Field: function(tag, val) {
	        this.writeTag(tag, Pbf.Fixed32);
	        this.writeFixed32(val);
	    },
	    writeSFixed32Field: function(tag, val) {
	        this.writeTag(tag, Pbf.Fixed32);
	        this.writeSFixed32(val);
	    },
	    writeFixed64Field: function(tag, val) {
	        this.writeTag(tag, Pbf.Fixed64);
	        this.writeFixed64(val);
	    },
	    writeSFixed64Field: function(tag, val) {
	        this.writeTag(tag, Pbf.Fixed64);
	        this.writeSFixed64(val);
	    },
	    writeVarintField: function(tag, val) {
	        this.writeTag(tag, Pbf.Varint);
	        this.writeVarint(val);
	    },
	    writeSVarintField: function(tag, val) {
	        this.writeTag(tag, Pbf.Varint);
	        this.writeSVarint(val);
	    },
	    writeStringField: function(tag, str) {
	        this.writeTag(tag, Pbf.Bytes);
	        this.writeString(str);
	    },
	    writeFloatField: function(tag, val) {
	        this.writeTag(tag, Pbf.Fixed32);
	        this.writeFloat(val);
	    },
	    writeDoubleField: function(tag, val) {
	        this.writeTag(tag, Pbf.Fixed64);
	        this.writeDouble(val);
	    },
	    writeBooleanField: function(tag, val) {
	        this.writeVarintField(tag, Boolean(val));
	    }
	};

	function readVarintRemainder(l, s, p) {
	    var buf = p.buf,
	        h, b;

	    b = buf[p.pos++]; h  = (b & 0x70) >> 4;  if (b < 0x80) return toNum(l, h, s);
	    b = buf[p.pos++]; h |= (b & 0x7f) << 3;  if (b < 0x80) return toNum(l, h, s);
	    b = buf[p.pos++]; h |= (b & 0x7f) << 10; if (b < 0x80) return toNum(l, h, s);
	    b = buf[p.pos++]; h |= (b & 0x7f) << 17; if (b < 0x80) return toNum(l, h, s);
	    b = buf[p.pos++]; h |= (b & 0x7f) << 24; if (b < 0x80) return toNum(l, h, s);
	    b = buf[p.pos++]; h |= (b & 0x01) << 31; if (b < 0x80) return toNum(l, h, s);

	    throw new Error('Expected varint not more than 10 bytes');
	}

	function readPackedEnd(pbf) {
	    return pbf.type === Pbf.Bytes ?
	        pbf.readVarint() + pbf.pos : pbf.pos + 1;
	}

	function toNum(low, high, isSigned) {
	    if (isSigned) {
	        return high * 0x100000000 + (low >>> 0);
	    }

	    return ((high >>> 0) * 0x100000000) + (low >>> 0);
	}

	function writeBigVarint(val, pbf) {
	    var low, high;

	    if (val >= 0) {
	        low  = (val % 0x100000000) | 0;
	        high = (val / 0x100000000) | 0;
	    } else {
	        low  = ~(-val % 0x100000000);
	        high = ~(-val / 0x100000000);

	        if (low ^ 0xffffffff) {
	            low = (low + 1) | 0;
	        } else {
	            low = 0;
	            high = (high + 1) | 0;
	        }
	    }

	    if (val >= 0x10000000000000000 || val < -0x10000000000000000) {
	        throw new Error('Given varint doesn\'t fit into 10 bytes');
	    }

	    pbf.realloc(10);

	    writeBigVarintLow(low, high, pbf);
	    writeBigVarintHigh(high, pbf);
	}

	function writeBigVarintLow(low, high, pbf) {
	    pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
	    pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
	    pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
	    pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
	    pbf.buf[pbf.pos]   = low & 0x7f;
	}

	function writeBigVarintHigh(high, pbf) {
	    var lsb = (high & 0x07) << 4;

	    pbf.buf[pbf.pos++] |= lsb         | ((high >>>= 3) ? 0x80 : 0); if (!high) return;
	    pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
	    pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
	    pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
	    pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
	    pbf.buf[pbf.pos++]  = high & 0x7f;
	}

	function makeRoomForExtraLength(startPos, len, pbf) {
	    var extraLen =
	        len <= 0x3fff ? 1 :
	        len <= 0x1fffff ? 2 :
	        len <= 0xfffffff ? 3 : Math.floor(Math.log(len) / (Math.LN2 * 7));

	    // if 1 byte isn't enough for encoding message length, shift the data to the right
	    pbf.realloc(extraLen);
	    for (var i = pbf.pos - 1; i >= startPos; i--) pbf.buf[i + extraLen] = pbf.buf[i];
	}

	function writePackedVarint(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeVarint(arr[i]);   }
	function writePackedSVarint(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeSVarint(arr[i]);  }
	function writePackedFloat(arr, pbf)    { for (var i = 0; i < arr.length; i++) pbf.writeFloat(arr[i]);    }
	function writePackedDouble(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeDouble(arr[i]);   }
	function writePackedBoolean(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeBoolean(arr[i]);  }
	function writePackedFixed32(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed32(arr[i]);  }
	function writePackedSFixed32(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed32(arr[i]); }
	function writePackedFixed64(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed64(arr[i]);  }
	function writePackedSFixed64(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed64(arr[i]); }

	// Buffer code below from https://github.com/feross/buffer, MIT-licensed

	function readUInt32(buf, pos) {
	    return ((buf[pos]) |
	        (buf[pos + 1] << 8) |
	        (buf[pos + 2] << 16)) +
	        (buf[pos + 3] * 0x1000000);
	}

	function writeInt32(buf, val, pos) {
	    buf[pos] = val;
	    buf[pos + 1] = (val >>> 8);
	    buf[pos + 2] = (val >>> 16);
	    buf[pos + 3] = (val >>> 24);
	}

	function readInt32(buf, pos) {
	    return ((buf[pos]) |
	        (buf[pos + 1] << 8) |
	        (buf[pos + 2] << 16)) +
	        (buf[pos + 3] << 24);
	}

	function readUtf8(buf, pos, end) {
	    var str = '';
	    var i = pos;

	    while (i < end) {
	        var b0 = buf[i];
	        var c = null; // codepoint
	        var bytesPerSequence =
	            b0 > 0xEF ? 4 :
	            b0 > 0xDF ? 3 :
	            b0 > 0xBF ? 2 : 1;

	        if (i + bytesPerSequence > end) break;

	        var b1, b2, b3;

	        if (bytesPerSequence === 1) {
	            if (b0 < 0x80) {
	                c = b0;
	            }
	        } else if (bytesPerSequence === 2) {
	            b1 = buf[i + 1];
	            if ((b1 & 0xC0) === 0x80) {
	                c = (b0 & 0x1F) << 0x6 | (b1 & 0x3F);
	                if (c <= 0x7F) {
	                    c = null;
	                }
	            }
	        } else if (bytesPerSequence === 3) {
	            b1 = buf[i + 1];
	            b2 = buf[i + 2];
	            if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80) {
	                c = (b0 & 0xF) << 0xC | (b1 & 0x3F) << 0x6 | (b2 & 0x3F);
	                if (c <= 0x7FF || (c >= 0xD800 && c <= 0xDFFF)) {
	                    c = null;
	                }
	            }
	        } else if (bytesPerSequence === 4) {
	            b1 = buf[i + 1];
	            b2 = buf[i + 2];
	            b3 = buf[i + 3];
	            if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
	                c = (b0 & 0xF) << 0x12 | (b1 & 0x3F) << 0xC | (b2 & 0x3F) << 0x6 | (b3 & 0x3F);
	                if (c <= 0xFFFF || c >= 0x110000) {
	                    c = null;
	                }
	            }
	        }

	        if (c === null) {
	            c = 0xFFFD;
	            bytesPerSequence = 1;

	        } else if (c > 0xFFFF) {
	            c -= 0x10000;
	            str += String.fromCharCode(c >>> 10 & 0x3FF | 0xD800);
	            c = 0xDC00 | c & 0x3FF;
	        }

	        str += String.fromCharCode(c);
	        i += bytesPerSequence;
	    }

	    return str;
	}

	function readUtf8TextDecoder(buf, pos, end) {
	    return utf8TextDecoder.decode(buf.subarray(pos, end));
	}

	function writeUtf8(buf, str, pos) {
	    for (var i = 0, c, lead; i < str.length; i++) {
	        c = str.charCodeAt(i); // code point

	        if (c > 0xD7FF && c < 0xE000) {
	            if (lead) {
	                if (c < 0xDC00) {
	                    buf[pos++] = 0xEF;
	                    buf[pos++] = 0xBF;
	                    buf[pos++] = 0xBD;
	                    lead = c;
	                    continue;
	                } else {
	                    c = lead - 0xD800 << 10 | c - 0xDC00 | 0x10000;
	                    lead = null;
	                }
	            } else {
	                if (c > 0xDBFF || (i + 1 === str.length)) {
	                    buf[pos++] = 0xEF;
	                    buf[pos++] = 0xBF;
	                    buf[pos++] = 0xBD;
	                } else {
	                    lead = c;
	                }
	                continue;
	            }
	        } else if (lead) {
	            buf[pos++] = 0xEF;
	            buf[pos++] = 0xBF;
	            buf[pos++] = 0xBD;
	            lead = null;
	        }

	        if (c < 0x80) {
	            buf[pos++] = c;
	        } else {
	            if (c < 0x800) {
	                buf[pos++] = c >> 0x6 | 0xC0;
	            } else {
	                if (c < 0x10000) {
	                    buf[pos++] = c >> 0xC | 0xE0;
	                } else {
	                    buf[pos++] = c >> 0x12 | 0xF0;
	                    buf[pos++] = c >> 0xC & 0x3F | 0x80;
	                }
	                buf[pos++] = c >> 0x6 & 0x3F | 0x80;
	            }
	            buf[pos++] = c & 0x3F | 0x80;
	        }
	    }
	    return pos;
	}

	var Renderer = {
	  drawPBF: function drawPBF(tile, url, coords, pcoords) {
	    // return fetch(url, { mode: 'cors' })
	    return fetch(url, {}).then(function (res) {
	      if (res.status === 404) {
	        throw new TypeError('tile skiped: ' + url);
	      }

	      return res.blob();
	    }).then(function (blob) {
	      return blob.arrayBuffer();
	    }).then(function (buf) {
	      var zoom = coords.z;
	      var d = coords.z - pcoords.z;
	      var scale = 1;
	      var dx = 0;
	      var dy = 0;

	      if (d > 0) {
	        scale = Math.pow(2, d);
	        dx = 256 * (coords.x - pcoords.x * scale);
	        dy = 256 * (coords.y - pcoords.y * scale);
	      } // console.log('kdd', coords, pcoords, scale, dx, dy);


	      var path = new Path2D();
	      var pbf$1 = new pbf(buf);

	      var _VectorTile = new VectorTile(pbf$1),
	          layers = _VectorTile.layers;

	      var ctx = tile.getContext("2d");
	      ctx.strokeStyle = 'red'; // console.log('layers', layers);

	      Object.keys(layers).forEach(function (k) {
	        var lineWidth = 0;
	        var type = 0;

	        if (k.indexOf('label') !== -1) {
	          ctx.font = "16px serif";
	        }

	        if (k.indexOf('округа') !== -1) {
	          lineWidth = 1;
	          type = 1;

	          if (zoom > 6) {
	            lineWidth = 3;
	            ctx.font = "18px serif";
	          }
	        } else if (k.indexOf('районы') !== -1) {
	          type = 2;
	          lineWidth = zoom > 6 ? 1 : 0;
	        } else if (k.indexOf('варталы') !== -1) {
	          type = 3;
	          lineWidth = zoom < 11 ? 0 : 1;
	        } // else if (pcoords.z > 7 && k.indexOf('районы') !== -1) { lineWidth = 2; } 
	        // else if (pcoords.z > 6 && k.indexOf('варталы') !== -1) { lineWidth = 1; } 


	        if (lineWidth) {
	          (function () {
	            ctx.lineWidth = lineWidth; // ctx.strokeStyle = 'red';

	            var layer = layers[k];
	            var sc = 256 * scale / layer.extent; // console.log('k', k, coords, pcoords, scale, dx, dy);

	            for (var i = 0; i < layer.length; ++i) {
	              var vf = layer.feature(i);
	              var _coords = vf.loadGeometry()[0];

	              var p = _coords.shift();

	              var tx = p.x * sc - dx;
	              var ty = p.y * sc - dy; // const geo = vf.toGeoJSON(pcoords.x, pcoords.y, pcoords.z);
	              // console.log('geo', zoom, k, geo.geometry.type, vf.type, geo.properties);

	              if (zoom > 4 && zoom < 13 && vf.type === 1) {
	                var props = vf.properties;
	                var title = props._name;
	                var cntTitle = title.split(':').length; // if (zoom < 9 && props._label_class === 1) { tx = 0; }

	                if (zoom < 9 && type !== 1 && cntTitle === 2) {
	                  tx = 0;
	                } // if (zoom < 9 && type !== 1 && props._label_class === 1) { tx = 0; }


	                if (zoom >= 9 && type !== 1 && cntTitle === 1) {
	                  tx = 0;
	                }

	                if (zoom > 10 && type === 3) {
	                  tx = 0;
	                } // if (zoom >= 9 && type !== 1 && props._label_class === 0) { tx = 0; }


	                if (tx > 10) {
	                  // ctx.strokeStyle = 'blue';
	                  ctx.strokeText(props._name, tx - 10, ty);
	                } // points.push({pos: [p.x * sc, p.y * sc], vf});
	                // } else if (vf.type === 1 && props._name.length === 2) {

	              } else if (vf.type === 2 || vf.type === 3) {
	                // ctx.strokeStyle = 'red';
	                path.moveTo(tx, ty);

	                _coords.forEach(function (p, i) {
	                  var tx = p.x * sc - dx;
	                  var ty = p.y * sc - dy;
	                  path.lineTo(tx, ty);
	                });
	              }
	            }

	            ctx.stroke(path);
	          })();
	        }
	      });
	      return true;
	    }).catch(function (err) {
	      // console.log('error', err);
	      return false;
	    });
	  }
	};

	// import 'path2d-polyfill';
	// import {VectorTile} from '@mapbox/vector-tile';
	// import Protobuf from 'pbf';
	var Features = {
	  getFeature: function getFeature(id, type, prefix) {
	    var url = prefix + 'api/features/' + type + '/' + id + '?date_format=%c&_=1640681662291';
	    return fetch(url, {}).then(function (res) {
	      return res.json();
	    }).then(function (json) {
	      return {
	        prefix: prefix,
	        id: id,
	        feature: json
	      };
	    });
	  },
	  getFeatures: function getFeatures(point, prefix) {
	    var url = prefix + 'api/features/?tolerance=16&skip=0&inPoint=true&text=' + point;
	    return fetch(url, {}).then(function (res) {
	      if (res.status === 404) {
	        throw new TypeError('features not found on point: ' + point);
	      }

	      return res.json();
	    }).then(function (json) {
	      return {
	        prefix: prefix,
	        point: point,
	        arr: json.results
	      };
	    }).catch(function (err) {
	      console.warn('error', err);
	      return false;
	    });
	  }
	};

	// eslint-disable-next-line es/no-typed-arrays -- safe
	var arrayBufferNative = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

	var RangeError$4 = global_1.RangeError;

	// `ToIndex` abstract operation
	// https://tc39.es/ecma262/#sec-toindex
	var toIndex = function (it) {
	  if (it === undefined) return 0;
	  var number = toIntegerOrInfinity(it);
	  var length = toLength(number);
	  if (number !== length) throw RangeError$4('Wrong length or index');
	  return length;
	};

	// IEEE754 conversions based on https://github.com/feross/ieee754


	var Array$4 = global_1.Array;
	var abs = Math.abs;
	var pow = Math.pow;
	var floor$3 = Math.floor;
	var log = Math.log;
	var LN2 = Math.LN2;

	var pack = function (number, mantissaLength, bytes) {
	  var buffer = Array$4(bytes);
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
	  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
	  var index = 0;
	  var exponent, mantissa, c;
	  number = abs(number);
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (number != number || number === Infinity) {
	    // eslint-disable-next-line no-self-compare -- NaN check
	    mantissa = number != number ? 1 : 0;
	    exponent = eMax;
	  } else {
	    exponent = floor$3(log(number) / LN2);
	    c = pow(2, -exponent);
	    if (number * c < 1) {
	      exponent--;
	      c *= 2;
	    }
	    if (exponent + eBias >= 1) {
	      number += rt / c;
	    } else {
	      number += rt * pow(2, 1 - eBias);
	    }
	    if (number * c >= 2) {
	      exponent++;
	      c /= 2;
	    }
	    if (exponent + eBias >= eMax) {
	      mantissa = 0;
	      exponent = eMax;
	    } else if (exponent + eBias >= 1) {
	      mantissa = (number * c - 1) * pow(2, mantissaLength);
	      exponent = exponent + eBias;
	    } else {
	      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
	      exponent = 0;
	    }
	  }
	  while (mantissaLength >= 8) {
	    buffer[index++] = mantissa & 255;
	    mantissa /= 256;
	    mantissaLength -= 8;
	  }
	  exponent = exponent << mantissaLength | mantissa;
	  exponentLength += mantissaLength;
	  while (exponentLength > 0) {
	    buffer[index++] = exponent & 255;
	    exponent /= 256;
	    exponentLength -= 8;
	  }
	  buffer[--index] |= sign * 128;
	  return buffer;
	};

	var unpack = function (buffer, mantissaLength) {
	  var bytes = buffer.length;
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var nBits = exponentLength - 7;
	  var index = bytes - 1;
	  var sign = buffer[index--];
	  var exponent = sign & 127;
	  var mantissa;
	  sign >>= 7;
	  while (nBits > 0) {
	    exponent = exponent * 256 + buffer[index--];
	    nBits -= 8;
	  }
	  mantissa = exponent & (1 << -nBits) - 1;
	  exponent >>= -nBits;
	  nBits += mantissaLength;
	  while (nBits > 0) {
	    mantissa = mantissa * 256 + buffer[index--];
	    nBits -= 8;
	  }
	  if (exponent === 0) {
	    exponent = 1 - eBias;
	  } else if (exponent === eMax) {
	    return mantissa ? NaN : sign ? -Infinity : Infinity;
	  } else {
	    mantissa = mantissa + pow(2, mantissaLength);
	    exponent = exponent - eBias;
	  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
	};

	var ieee754 = {
	  pack: pack,
	  unpack: unpack
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO = sharedKey('IE_PROTO');
	var Object$1 = global_1.Object;
	var ObjectPrototype$2 = Object$1.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object$1.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwnProperty_1(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;
	  if (isCallable(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof Object$1 ? ObjectPrototype$2 : null;
	};

	// `Array.prototype.fill` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.fill
	var arrayFill = function fill(value /* , start = 0, end = @length */) {
	  var O = toObject(this);
	  var length = lengthOfArrayLike(O);
	  var argumentsLength = arguments.length;
	  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
	  var end = argumentsLength > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var defineProperty$2 = objectDefineProperty.f;





	var PROPER_FUNCTION_NAME$1 = functionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME$1 = functionName.CONFIGURABLE;
	var getInternalState$1 = internalState.get;
	var setInternalState$1 = internalState.set;
	var ARRAY_BUFFER$1 = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE = 'prototype';
	var WRONG_LENGTH = 'Wrong length';
	var WRONG_INDEX = 'Wrong index';
	var NativeArrayBuffer$1 = global_1[ARRAY_BUFFER$1];
	var $ArrayBuffer = NativeArrayBuffer$1;
	var ArrayBufferPrototype = $ArrayBuffer && $ArrayBuffer[PROTOTYPE];
	var $DataView = global_1[DATA_VIEW];
	var DataViewPrototype$1 = $DataView && $DataView[PROTOTYPE];
	var ObjectPrototype$1 = Object.prototype;
	var Array$3 = global_1.Array;
	var RangeError$3 = global_1.RangeError;
	var fill = functionUncurryThis(arrayFill);
	var reverse = functionUncurryThis([].reverse);

	var packIEEE754 = ieee754.pack;
	var unpackIEEE754 = ieee754.unpack;

	var packInt8 = function (number) {
	  return [number & 0xFF];
	};

	var packInt16 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF];
	};

	var packInt32 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
	};

	var unpackInt32 = function (buffer) {
	  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
	};

	var packFloat32 = function (number) {
	  return packIEEE754(number, 23, 4);
	};

	var packFloat64 = function (number) {
	  return packIEEE754(number, 52, 8);
	};

	var addGetter = function (Constructor, key) {
	  defineProperty$2(Constructor[PROTOTYPE], key, { get: function () { return getInternalState$1(this)[key]; } });
	};

	var get = function (view, count, index, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$1(view);
	  if (intIndex + count > store.byteLength) throw RangeError$3(WRONG_INDEX);
	  var bytes = getInternalState$1(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = arraySliceSimple(bytes, start, start + count);
	  return isLittleEndian ? pack : reverse(pack);
	};

	var set = function (view, count, index, conversion, value, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$1(view);
	  if (intIndex + count > store.byteLength) throw RangeError$3(WRONG_INDEX);
	  var bytes = getInternalState$1(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = conversion(+value);
	  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
	};

	if (!arrayBufferNative) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance(this, ArrayBufferPrototype);
	    var byteLength = toIndex(length);
	    setInternalState$1(this, {
	      bytes: fill(Array$3(byteLength), 0),
	      byteLength: byteLength
	    });
	    if (!descriptors) this.byteLength = byteLength;
	  };

	  ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE];

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance(this, DataViewPrototype$1);
	    anInstance(buffer, ArrayBufferPrototype);
	    var bufferLength = getInternalState$1(buffer).byteLength;
	    var offset = toIntegerOrInfinity(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError$3('Wrong offset');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError$3(WRONG_LENGTH);
	    setInternalState$1(this, {
	      buffer: buffer,
	      byteLength: byteLength,
	      byteOffset: offset
	    });
	    if (!descriptors) {
	      this.buffer = buffer;
	      this.byteLength = byteLength;
	      this.byteOffset = offset;
	    }
	  };

	  DataViewPrototype$1 = $DataView[PROTOTYPE];

	  if (descriptors) {
	    addGetter($ArrayBuffer, 'byteLength');
	    addGetter($DataView, 'buffer');
	    addGetter($DataView, 'byteLength');
	    addGetter($DataView, 'byteOffset');
	  }

	  redefineAll(DataViewPrototype$1, {
	    getInt8: function getInt8(byteOffset) {
	      return get(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set(this, 1, byteOffset, packInt8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set(this, 1, byteOffset, packInt8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
	    }
	  });
	} else {
	  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME$1 && NativeArrayBuffer$1.name !== ARRAY_BUFFER$1;
	  /* eslint-disable no-new -- required for testing */
	  if (!fails(function () {
	    NativeArrayBuffer$1(1);
	  }) || !fails(function () {
	    new NativeArrayBuffer$1(-1);
	  }) || fails(function () {
	    new NativeArrayBuffer$1();
	    new NativeArrayBuffer$1(1.5);
	    new NativeArrayBuffer$1(NaN);
	    return INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME$1;
	  })) {
	  /* eslint-enable no-new -- required for testing */
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance(this, ArrayBufferPrototype);
	      return new NativeArrayBuffer$1(toIndex(length));
	    };

	    $ArrayBuffer[PROTOTYPE] = ArrayBufferPrototype;

	    for (var keys = getOwnPropertyNames(NativeArrayBuffer$1), j = 0, key; keys.length > j;) {
	      if (!((key = keys[j++]) in $ArrayBuffer)) {
	        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer$1[key]);
	      }
	    }

	    ArrayBufferPrototype.constructor = $ArrayBuffer;
	  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME$1) {
	    createNonEnumerableProperty(NativeArrayBuffer$1, 'name', ARRAY_BUFFER$1);
	  }

	  // WebKit bug - the same parent prototype for typed arrays and data view
	  if (objectSetPrototypeOf && objectGetPrototypeOf(DataViewPrototype$1) !== ObjectPrototype$1) {
	    objectSetPrototypeOf(DataViewPrototype$1, ObjectPrototype$1);
	  }

	  // iOS Safari 7.x bug
	  var testView = new $DataView(new $ArrayBuffer(2));
	  var $setInt8 = functionUncurryThis(DataViewPrototype$1.setInt8);
	  testView.setInt8(0, 2147483648);
	  testView.setInt8(1, 2147483649);
	  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll(DataViewPrototype$1, {
	    setInt8: function setInt8(byteOffset, value) {
	      $setInt8(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      $setInt8(this, byteOffset, value << 24 >> 24);
	    }
	  }, { unsafe: true });
	}

	setToStringTag($ArrayBuffer, ARRAY_BUFFER$1);
	setToStringTag($DataView, DATA_VIEW);

	var arrayBuffer = {
	  ArrayBuffer: $ArrayBuffer,
	  DataView: $DataView
	};

	var ARRAY_BUFFER = 'ArrayBuffer';
	var ArrayBuffer$3 = arrayBuffer[ARRAY_BUFFER];
	var NativeArrayBuffer = global_1[ARRAY_BUFFER];

	// `ArrayBuffer` constructor
	// https://tc39.es/ecma262/#sec-arraybuffer-constructor
	_export({ global: true, forced: NativeArrayBuffer !== ArrayBuffer$3 }, {
	  ArrayBuffer: ArrayBuffer$3
	});

	setSpecies(ARRAY_BUFFER);

	var ArrayBuffer$2 = arrayBuffer.ArrayBuffer;
	var DataView$1 = arrayBuffer.DataView;
	var DataViewPrototype = DataView$1.prototype;
	var un$ArrayBufferSlice = functionUncurryThis(ArrayBuffer$2.prototype.slice);
	var getUint8 = functionUncurryThis(DataViewPrototype.getUint8);
	var setUint8 = functionUncurryThis(DataViewPrototype.setUint8);

	var INCORRECT_SLICE = fails(function () {
	  return !new ArrayBuffer$2(2).slice(1, undefined).byteLength;
	});

	// `ArrayBuffer.prototype.slice` method
	// https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
	_export({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
	  slice: function slice(start, end) {
	    if (un$ArrayBufferSlice && end === undefined) {
	      return un$ArrayBufferSlice(anObject(this), start); // FF fix
	    }
	    var length = anObject(this).byteLength;
	    var first = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    var result = new (speciesConstructor(this, ArrayBuffer$2))(toLength(fin - first));
	    var viewSource = new DataView$1(this);
	    var viewTarget = new DataView$1(result);
	    var index = 0;
	    while (first < fin) {
	      setUint8(viewTarget, index++, getUint8(viewSource, first++));
	    } return result;
	  }
	});

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$2[ITERATOR$2].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable(IteratorPrototype$2[ITERATOR$2])) {
	  redefine(IteratorPrototype$2, ITERATOR$2, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var PROPER_FUNCTION_NAME = functionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var IteratorPrototype = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$1 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$1]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
	        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$1])) {
	          redefine(CurrentIteratorPrototype, ITERATOR$1, returnThis);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if (CONFIGURABLE_FUNCTION_NAME) {
	      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() { return functionCall(nativeIterator, this); };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
	  }

	  // define iterator
	  if (IterablePrototype[ITERATOR$1] !== defaultIterator) {
	    redefine(IterablePrototype, ITERATOR$1, defaultIterator, { name: DEFAULT });
	  }
	  iterators[NAME] = defaultIterator;

	  return methods;
	};

	var defineProperty$1 = objectDefineProperty.f;




	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	var values = iterators.Arguments = iterators.Array;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	// V8 ~ Chrome 45- bug
	if (descriptors && values.name !== 'values') try {
	  defineProperty$1(values, 'name', { value: 'values' });
	} catch (error) { /* empty */ }

	var defineProperty = objectDefineProperty.f;






	var Int8Array$3 = global_1.Int8Array;
	var Int8ArrayPrototype = Int8Array$3 && Int8Array$3.prototype;
	var Uint8ClampedArray$1 = global_1.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
	var TypedArray = Int8Array$3 && objectGetPrototypeOf(Int8Array$3);
	var TypedArrayPrototype$1 = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
	var ObjectPrototype = Object.prototype;
	var TypeError$3 = global_1.TypeError;

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	var TYPED_ARRAY_CONSTRUCTOR$1 = uid('TYPED_ARRAY_CONSTRUCTOR');
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQIRED = false;
	var NAME, Constructor, Prototype;

	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var BigIntArrayConstructorsList = {
	  BigInt64Array: 8,
	  BigUint64Array: 8
	};

	var isView = function isView(it) {
	  if (!isObject(it)) return false;
	  var klass = classof(it);
	  return klass === 'DataView'
	    || hasOwnProperty_1(TypedArrayConstructorsList, klass)
	    || hasOwnProperty_1(BigIntArrayConstructorsList, klass);
	};

	var isTypedArray = function (it) {
	  if (!isObject(it)) return false;
	  var klass = classof(it);
	  return hasOwnProperty_1(TypedArrayConstructorsList, klass)
	    || hasOwnProperty_1(BigIntArrayConstructorsList, klass);
	};

	var aTypedArray$n = function (it) {
	  if (isTypedArray(it)) return it;
	  throw TypeError$3('Target is not a typed array');
	};

	var aTypedArrayConstructor$2 = function (C) {
	  if (isCallable(C) && (!objectSetPrototypeOf || objectIsPrototypeOf(TypedArray, C))) return C;
	  throw TypeError$3(tryToString(C) + ' is not a typed array constructor');
	};

	var exportTypedArrayMethod$o = function (KEY, property, forced, options) {
	  if (!descriptors) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && hasOwnProperty_1(TypedArrayConstructor.prototype, KEY)) try {
	      delete TypedArrayConstructor.prototype[KEY];
	    } catch (error) { /* empty */ }
	  }
	  if (!TypedArrayPrototype$1[KEY] || forced) {
	    redefine(TypedArrayPrototype$1, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS$1 && Int8ArrayPrototype[KEY] || property, options);
	  }
	};

	var exportTypedArrayStaticMethod = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!descriptors) return;
	  if (objectSetPrototypeOf) {
	    if (forced) for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global_1[ARRAY];
	      if (TypedArrayConstructor && hasOwnProperty_1(TypedArrayConstructor, KEY)) try {
	        delete TypedArrayConstructor[KEY];
	      } catch (error) { /* empty */ }
	    }
	    if (!TypedArray[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$1 && TypedArray[KEY] || property);
	      } catch (error) { /* empty */ }
	    } else return;
	  }
	  for (ARRAY in TypedArrayConstructorsList) {
	    TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
	      redefine(TypedArrayConstructor, KEY, property);
	    }
	  }
	};

	for (NAME in TypedArrayConstructorsList) {
	  Constructor = global_1[NAME];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR$1, Constructor);
	  else NATIVE_ARRAY_BUFFER_VIEWS$1 = false;
	}

	for (NAME in BigIntArrayConstructorsList) {
	  Constructor = global_1[NAME];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR$1, Constructor);
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS$1 || !isCallable(TypedArray) || TypedArray === Function.prototype) {
	  // eslint-disable-next-line no-shadow -- safe
	  TypedArray = function TypedArray() {
	    throw TypeError$3('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS$1) for (NAME in TypedArrayConstructorsList) {
	    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME], TypedArray);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS$1 || !TypedArrayPrototype$1 || TypedArrayPrototype$1 === ObjectPrototype) {
	  TypedArrayPrototype$1 = TypedArray.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS$1) for (NAME in TypedArrayConstructorsList) {
	    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME].prototype, TypedArrayPrototype$1);
	  }
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS$1 && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype$1) {
	  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype$1);
	}

	if (descriptors && !hasOwnProperty_1(TypedArrayPrototype$1, TO_STRING_TAG)) {
	  TYPED_ARRAY_TAG_REQIRED = true;
	  defineProperty(TypedArrayPrototype$1, TO_STRING_TAG, { get: function () {
	    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
	  } });
	  for (NAME in TypedArrayConstructorsList) if (global_1[NAME]) {
	    createNonEnumerableProperty(global_1[NAME], TYPED_ARRAY_TAG, NAME);
	  }
	}

	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$1,
	  TYPED_ARRAY_CONSTRUCTOR: TYPED_ARRAY_CONSTRUCTOR$1,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
	  aTypedArray: aTypedArray$n,
	  aTypedArrayConstructor: aTypedArrayConstructor$2,
	  exportTypedArrayMethod: exportTypedArrayMethod$o,
	  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
	  isView: isView,
	  isTypedArray: isTypedArray,
	  TypedArray: TypedArray,
	  TypedArrayPrototype: TypedArrayPrototype$1
	};

	/* eslint-disable no-new -- required for testing */



	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$1 = global_1.ArrayBuffer;
	var Int8Array$2 = global_1.Int8Array;

	var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
	  Int8Array$2(1);
	}) || !fails(function () {
	  new Int8Array$2(-1);
	}) || !checkCorrectnessOfIteration(function (iterable) {
	  new Int8Array$2();
	  new Int8Array$2(null);
	  new Int8Array$2(1.5);
	  new Int8Array$2(iterable);
	}, true) || fails(function () {
	  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
	  return new Int8Array$2(new ArrayBuffer$1(2), 1, undefined).length !== 1;
	});

	var floor$2 = Math.floor;

	// `IsIntegralNumber` abstract operation
	// https://tc39.es/ecma262/#sec-isintegralnumber
	// eslint-disable-next-line es/no-number-isinteger -- safe
	var isIntegralNumber = Number.isInteger || function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor$2(it) === it;
	};

	var RangeError$2 = global_1.RangeError;

	var toPositiveInteger = function (it) {
	  var result = toIntegerOrInfinity(it);
	  if (result < 0) throw RangeError$2("The argument can't be less than 0");
	  return result;
	};

	var RangeError$1 = global_1.RangeError;

	var toOffset = function (it, BYTES) {
	  var offset = toPositiveInteger(it);
	  if (offset % BYTES) throw RangeError$1('Wrong offset');
	  return offset;
	};

	var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

	var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
	  var C = aConstructor(this);
	  var O = toObject(source);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var i, length, result, step, iterator, next;
	  if (iteratorMethod && !isArrayIteratorMethod(iteratorMethod)) {
	    iterator = getIterator(O, iteratorMethod);
	    next = iterator.next;
	    O = [];
	    while (!(step = functionCall(next, iterator)).done) {
	      O.push(step.value);
	    }
	  }
	  if (mapping && argumentsLength > 2) {
	    mapfn = functionBindContext(mapfn, arguments[2]);
	  }
	  length = lengthOfArrayLike(O);
	  result = new (aTypedArrayConstructor$1(C))(length);
	  for (i = 0; length > i; i++) {
	    result[i] = mapping ? mapfn(O[i], i) : O[i];
	  }
	  return result;
	};

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    isCallable(NewTarget = dummy.constructor) &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var typedArrayConstructor = createCommonjsModule(function (module) {






















	var getOwnPropertyNames = objectGetOwnPropertyNames.f;

	var forEach = arrayIteration.forEach;






	var getInternalState = internalState.get;
	var setInternalState = internalState.set;
	var nativeDefineProperty = objectDefineProperty.f;
	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var round = Math.round;
	var RangeError = global_1.RangeError;
	var ArrayBuffer = arrayBuffer.ArrayBuffer;
	var ArrayBufferPrototype = ArrayBuffer.prototype;
	var DataView = arrayBuffer.DataView;
	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
	var TYPED_ARRAY_CONSTRUCTOR = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
	var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
	var TypedArray = arrayBufferViewCore.TypedArray;
	var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
	var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
	var isTypedArray = arrayBufferViewCore.isTypedArray;
	var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	var WRONG_LENGTH = 'Wrong length';

	var fromList = function (C, list) {
	  aTypedArrayConstructor(C);
	  var index = 0;
	  var length = list.length;
	  var result = new C(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var addGetter = function (it, key) {
	  nativeDefineProperty(it, key, { get: function () {
	    return getInternalState(this)[key];
	  } });
	};

	var isArrayBuffer = function (it) {
	  var klass;
	  return objectIsPrototypeOf(ArrayBufferPrototype, it) || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
	};

	var isTypedArrayIndex = function (target, key) {
	  return isTypedArray(target)
	    && !isSymbol(key)
	    && key in target
	    && isIntegralNumber(+key)
	    && key >= 0;
	};

	var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
	  key = toPropertyKey(key);
	  return isTypedArrayIndex(target, key)
	    ? createPropertyDescriptor(2, target[key])
	    : nativeGetOwnPropertyDescriptor(target, key);
	};

	var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
	  key = toPropertyKey(key);
	  if (isTypedArrayIndex(target, key)
	    && isObject(descriptor)
	    && hasOwnProperty_1(descriptor, 'value')
	    && !hasOwnProperty_1(descriptor, 'get')
	    && !hasOwnProperty_1(descriptor, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable
	    && (!hasOwnProperty_1(descriptor, 'writable') || descriptor.writable)
	    && (!hasOwnProperty_1(descriptor, 'enumerable') || descriptor.enumerable)
	  ) {
	    target[key] = descriptor.value;
	    return target;
	  } return nativeDefineProperty(target, key, descriptor);
	};

	if (descriptors) {
	  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	    objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
	    objectDefineProperty.f = wrappedDefineProperty;
	    addGetter(TypedArrayPrototype, 'buffer');
	    addGetter(TypedArrayPrototype, 'byteOffset');
	    addGetter(TypedArrayPrototype, 'byteLength');
	    addGetter(TypedArrayPrototype, 'length');
	  }

	  _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
	    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
	    defineProperty: wrappedDefineProperty
	  });

	  module.exports = function (TYPE, wrapper, CLAMPED) {
	    var BYTES = TYPE.match(/\d+$/)[0] / 8;
	    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + TYPE;
	    var SETTER = 'set' + TYPE;
	    var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
	    var TypedArrayConstructor = NativeTypedArrayConstructor;
	    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
	    var exported = {};

	    var getter = function (that, index) {
	      var data = getInternalState(that);
	      return data.view[GETTER](index * BYTES + data.byteOffset, true);
	    };

	    var setter = function (that, index, value) {
	      var data = getInternalState(that);
	      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
	      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
	    };

	    var addElement = function (that, index) {
	      nativeDefineProperty(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };

	    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
	        anInstance(that, TypedArrayConstructorPrototype);
	        var index = 0;
	        var byteOffset = 0;
	        var buffer, byteLength, length;
	        if (!isObject(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new ArrayBuffer(byteLength);
	        } else if (isArrayBuffer(data)) {
	          buffer = data;
	          byteOffset = toOffset(offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
	            byteLength = $len - byteOffset;
	            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (isTypedArray(data)) {
	          return fromList(TypedArrayConstructor, data);
	        } else {
	          return functionCall(typedArrayFrom, TypedArrayConstructor, data);
	        }
	        setInternalState(that, {
	          buffer: buffer,
	          byteOffset: byteOffset,
	          byteLength: byteLength,
	          length: length,
	          view: new DataView(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });

	      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
	    } else if (typedArrayConstructorsRequireWrappers) {
	      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
	        anInstance(dummy, TypedArrayConstructorPrototype);
	        return inheritIfRequired(function () {
	          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
	          if (isArrayBuffer(data)) return $length !== undefined
	            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
	            : typedArrayOffset !== undefined
	              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
	              : new NativeTypedArrayConstructor(data);
	          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
	          return functionCall(typedArrayFrom, TypedArrayConstructor, data);
	        }(), dummy, TypedArrayConstructor);
	      });

	      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
	        if (!(key in TypedArrayConstructor)) {
	          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
	        }
	      });
	      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
	    }

	    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
	    }

	    createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_CONSTRUCTOR, TypedArrayConstructor);

	    if (TYPED_ARRAY_TAG) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
	    }

	    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

	    _export({
	      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
	    }, exported);

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
	      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
	    }

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
	    }

	    setSpecies(CONSTRUCTOR_NAME);
	  };
	} else module.exports = function () { /* empty */ };
	});

	// `Uint8ClampedArray` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint8', function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);

	var aTypedArray$m = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.at` method
	// https://github.com/tc39/proposal-relative-indexing-method
	exportTypedArrayMethod$n('at', function at(index) {
	  var O = aTypedArray$m(this);
	  var len = lengthOfArrayLike(O);
	  var relativeIndex = toIntegerOrInfinity(index);
	  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	  return (k < 0 || k >= len) ? undefined : O[k];
	});

	var min$1 = Math.min;

	// `Array.prototype.copyWithin` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.copywithin
	// eslint-disable-next-line es/no-array-prototype-copywithin -- safe
	var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject(this);
	  var len = lengthOfArrayLike(O);
	  var to = toAbsoluteIndex(target, len);
	  var from = toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = min$1((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else delete O[to];
	    to += inc;
	    from += inc;
	  } return O;
	};

	var u$ArrayCopyWithin = functionUncurryThis(arrayCopyWithin);
	var aTypedArray$l = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.copyWithin` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
	exportTypedArrayMethod$m('copyWithin', function copyWithin(target, start /* , end */) {
	  return u$ArrayCopyWithin(aTypedArray$l(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var $every = arrayIteration.every;

	var aTypedArray$k = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.every` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
	exportTypedArrayMethod$l('every', function every(callbackfn /* , thisArg */) {
	  return $every(aTypedArray$k(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$j = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.fill` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
	exportTypedArrayMethod$k('fill', function fill(value /* , start, end */) {
	  var length = arguments.length;
	  return functionCall(
	    arrayFill,
	    aTypedArray$j(this),
	    value,
	    length > 1 ? arguments[1] : undefined,
	    length > 2 ? arguments[2] : undefined
	  );
	});

	var arrayFromConstructorAndList = function (Constructor, list) {
	  var index = 0;
	  var length = lengthOfArrayLike(list);
	  var result = new Constructor(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var TYPED_ARRAY_CONSTRUCTOR = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
	var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;

	// a part of `TypedArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#typedarray-species-create
	var typedArraySpeciesConstructor = function (originalArray) {
	  return aTypedArrayConstructor(speciesConstructor(originalArray, originalArray[TYPED_ARRAY_CONSTRUCTOR]));
	};

	var typedArrayFromSpeciesAndList = function (instance, list) {
	  return arrayFromConstructorAndList(typedArraySpeciesConstructor(instance), list);
	};

	var $filter = arrayIteration.filter;


	var aTypedArray$i = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filter` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
	exportTypedArrayMethod$j('filter', function filter(callbackfn /* , thisArg */) {
	  var list = $filter(aTypedArray$i(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  return typedArrayFromSpeciesAndList(this, list);
	});

	var $find = arrayIteration.find;

	var aTypedArray$h = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.find` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
	exportTypedArrayMethod$i('find', function find(predicate /* , thisArg */) {
	  return $find(aTypedArray$h(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $findIndex = arrayIteration.findIndex;

	var aTypedArray$g = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
	exportTypedArrayMethod$h('findIndex', function findIndex(predicate /* , thisArg */) {
	  return $findIndex(aTypedArray$g(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $forEach = arrayIteration.forEach;

	var aTypedArray$f = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
	exportTypedArrayMethod$g('forEach', function forEach(callbackfn /* , thisArg */) {
	  $forEach(aTypedArray$f(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $includes = arrayIncludes.includes;

	var aTypedArray$e = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.includes` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
	exportTypedArrayMethod$f('includes', function includes(searchElement /* , fromIndex */) {
	  return $includes(aTypedArray$e(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $indexOf = arrayIncludes.indexOf;

	var aTypedArray$d = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
	exportTypedArrayMethod$e('indexOf', function indexOf(searchElement /* , fromIndex */) {
	  return $indexOf(aTypedArray$d(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ITERATOR = wellKnownSymbol('iterator');
	var Uint8Array$2 = global_1.Uint8Array;
	var arrayValues = functionUncurryThis(es_array_iterator.values);
	var arrayKeys = functionUncurryThis(es_array_iterator.keys);
	var arrayEntries = functionUncurryThis(es_array_iterator.entries);
	var aTypedArray$c = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;
	var TypedArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype;

	var GENERIC = !fails(function () {
	  TypedArrayPrototype[ITERATOR].call([1]);
	});

	var ITERATOR_IS_VALUES = !!TypedArrayPrototype
	  && TypedArrayPrototype.values
	  && TypedArrayPrototype[ITERATOR] === TypedArrayPrototype.values
	  && TypedArrayPrototype.values.name === 'values';

	var typedArrayValues = function values() {
	  return arrayValues(aTypedArray$c(this));
	};

	// `%TypedArray%.prototype.entries` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
	exportTypedArrayMethod$d('entries', function entries() {
	  return arrayEntries(aTypedArray$c(this));
	}, GENERIC);
	// `%TypedArray%.prototype.keys` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
	exportTypedArrayMethod$d('keys', function keys() {
	  return arrayKeys(aTypedArray$c(this));
	}, GENERIC);
	// `%TypedArray%.prototype.values` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
	exportTypedArrayMethod$d('values', typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });
	// `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
	exportTypedArrayMethod$d(ITERATOR, typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });

	var aTypedArray$b = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;
	var $join = functionUncurryThis([].join);

	// `%TypedArray%.prototype.join` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
	exportTypedArrayMethod$c('join', function join(separator) {
	  return $join(aTypedArray$b(this), separator);
	});

	/* eslint-disable es/no-array-prototype-lastindexof -- safe */






	var min = Math.min;
	var $lastIndexOf = [].lastIndexOf;
	var NEGATIVE_ZERO = !!$lastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
	var STRICT_METHOD = arrayMethodIsStrict('lastIndexOf');
	var FORCED$4 = NEGATIVE_ZERO || !STRICT_METHOD;

	// `Array.prototype.lastIndexOf` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
	var arrayLastIndexOf = FORCED$4 ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO) return functionApply($lastIndexOf, this, arguments) || 0;
	  var O = toIndexedObject(this);
	  var length = lengthOfArrayLike(O);
	  var index = length - 1;
	  if (arguments.length > 1) index = min(index, toIntegerOrInfinity(arguments[1]));
	  if (index < 0) index = length + index;
	  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
	  return -1;
	} : $lastIndexOf;

	var aTypedArray$a = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
	exportTypedArrayMethod$b('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
	  var length = arguments.length;
	  return functionApply(arrayLastIndexOf, aTypedArray$a(this), length > 1 ? [searchElement, arguments[1]] : [searchElement]);
	});

	var $map = arrayIteration.map;


	var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.map` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
	exportTypedArrayMethod$a('map', function map(mapfn /* , thisArg */) {
	  return $map(aTypedArray$9(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
	    return new (typedArraySpeciesConstructor(O))(length);
	  });
	});

	var TypeError$2 = global_1.TypeError;

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aCallable(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = lengthOfArrayLike(O);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError$2('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduce
	  left: createMethod(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
	  right: createMethod(true)
	};

	var $reduce = arrayReduce.left;

	var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
	exportTypedArrayMethod$9('reduce', function reduce(callbackfn /* , initialValue */) {
	  var length = arguments.length;
	  return $reduce(aTypedArray$8(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
	});

	var $reduceRight = arrayReduce.right;

	var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduceRicht` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
	exportTypedArrayMethod$8('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
	  var length = arguments.length;
	  return $reduceRight(aTypedArray$7(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;
	var floor$1 = Math.floor;

	// `%TypedArray%.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
	exportTypedArrayMethod$7('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$6(that).length;
	  var middle = floor$1(length / 2);
	  var index = 0;
	  var value;
	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  } return that;
	});

	var RangeError = global_1.RangeError;
	var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

	var FORCED$3 = fails(function () {
	  // eslint-disable-next-line es/no-typed-arrays -- required for testing
	  new Int8Array(1).set({});
	});

	// `%TypedArray%.prototype.set` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
	exportTypedArrayMethod$6('set', function set(arrayLike /* , offset */) {
	  aTypedArray$5(this);
	  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
	  var length = this.length;
	  var src = toObject(arrayLike);
	  var len = lengthOfArrayLike(src);
	  var index = 0;
	  if (len + offset > length) throw RangeError('Wrong length');
	  while (index < len) this[offset + index] = src[index++];
	}, FORCED$3);

	var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

	var FORCED$2 = fails(function () {
	  // eslint-disable-next-line es/no-typed-arrays -- required for testing
	  new Int8Array(1).slice();
	});

	// `%TypedArray%.prototype.slice` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
	exportTypedArrayMethod$5('slice', function slice(start, end) {
	  var list = arraySlice(aTypedArray$4(this), start, end);
	  var C = typedArraySpeciesConstructor(this);
	  var index = 0;
	  var length = list.length;
	  var result = new C(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	}, FORCED$2);

	var $some = arrayIteration.some;

	var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.some` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
	exportTypedArrayMethod$4('some', function some(callbackfn /* , thisArg */) {
	  return $some(aTypedArray$3(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var floor = Math.floor;

	var mergeSort = function (array, comparefn) {
	  var length = array.length;
	  var middle = floor(length / 2);
	  return length < 8 ? insertionSort(array, comparefn) : merge(
	    array,
	    mergeSort(arraySliceSimple(array, 0, middle), comparefn),
	    mergeSort(arraySliceSimple(array, middle), comparefn),
	    comparefn
	  );
	};

	var insertionSort = function (array, comparefn) {
	  var length = array.length;
	  var i = 1;
	  var element, j;

	  while (i < length) {
	    j = i;
	    element = array[i];
	    while (j && comparefn(array[j - 1], element) > 0) {
	      array[j] = array[--j];
	    }
	    if (j !== i++) array[j] = element;
	  } return array;
	};

	var merge = function (array, left, right, comparefn) {
	  var llength = left.length;
	  var rlength = right.length;
	  var lindex = 0;
	  var rindex = 0;

	  while (lindex < llength || rindex < rlength) {
	    array[lindex + rindex] = (lindex < llength && rindex < rlength)
	      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
	      : lindex < llength ? left[lindex++] : right[rindex++];
	  } return array;
	};

	var arraySort = mergeSort;

	var firefox = engineUserAgent.match(/firefox\/(\d+)/i);

	var engineFfVersion = !!firefox && +firefox[1];

	var engineIsIeOrEdge = /MSIE|Trident/.test(engineUserAgent);

	var webkit = engineUserAgent.match(/AppleWebKit\/(\d+)\./);

	var engineWebkitVersion = !!webkit && +webkit[1];

	var Array$2 = global_1.Array;
	var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;
	var Uint16Array = global_1.Uint16Array;
	var un$Sort = Uint16Array && functionUncurryThis(Uint16Array.prototype.sort);

	// WebKit
	var ACCEPT_INCORRECT_ARGUMENTS = !!un$Sort && !(fails(function () {
	  un$Sort(new Uint16Array(2), null);
	}) && fails(function () {
	  un$Sort(new Uint16Array(2), {});
	}));

	var STABLE_SORT = !!un$Sort && !fails(function () {
	  // feature detection can be too slow, so check engines versions
	  if (engineV8Version) return engineV8Version < 74;
	  if (engineFfVersion) return engineFfVersion < 67;
	  if (engineIsIeOrEdge) return true;
	  if (engineWebkitVersion) return engineWebkitVersion < 602;

	  var array = new Uint16Array(516);
	  var expected = Array$2(516);
	  var index, mod;

	  for (index = 0; index < 516; index++) {
	    mod = index % 4;
	    array[index] = 515 - index;
	    expected[index] = index - 2 * mod + 3;
	  }

	  un$Sort(array, function (a, b) {
	    return (a / 4 | 0) - (b / 4 | 0);
	  });

	  for (index = 0; index < 516; index++) {
	    if (array[index] !== expected[index]) return true;
	  }
	});

	var getSortCompare = function (comparefn) {
	  return function (x, y) {
	    if (comparefn !== undefined) return +comparefn(x, y) || 0;
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (y !== y) return -1;
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (x !== x) return 1;
	    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
	    return x > y;
	  };
	};

	// `%TypedArray%.prototype.sort` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
	exportTypedArrayMethod$3('sort', function sort(comparefn) {
	  if (comparefn !== undefined) aCallable(comparefn);
	  if (STABLE_SORT) return un$Sort(this, comparefn);

	  return arraySort(aTypedArray$2(this), getSortCompare(comparefn));
	}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);

	var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.subarray` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
	exportTypedArrayMethod$2('subarray', function subarray(begin, end) {
	  var O = aTypedArray$1(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex(begin, length);
	  var C = typedArraySpeciesConstructor(O);
	  return new C(
	    O.buffer,
	    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
	    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
	  );
	});

	var Int8Array$1 = global_1.Int8Array;
	var aTypedArray = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;
	var $toLocaleString = [].toLocaleString;

	// iOS Safari 6.x fails here
	var TO_LOCALE_STRING_BUG = !!Int8Array$1 && fails(function () {
	  $toLocaleString.call(new Int8Array$1(1));
	});

	var FORCED$1 = fails(function () {
	  return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
	}) || !fails(function () {
	  Int8Array$1.prototype.toLocaleString.call([1, 2]);
	});

	// `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
	exportTypedArrayMethod$1('toLocaleString', function toLocaleString() {
	  return functionApply(
	    $toLocaleString,
	    TO_LOCALE_STRING_BUG ? arraySlice(aTypedArray(this)) : aTypedArray(this),
	    arraySlice(arguments)
	  );
	}, FORCED$1);

	var exportTypedArrayMethod = arrayBufferViewCore.exportTypedArrayMethod;




	var Uint8Array$1 = global_1.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype || {};
	var arrayToString = [].toString;
	var join = functionUncurryThis([].join);

	if (fails(function () { arrayToString.call({}); })) {
	  arrayToString = function toString() {
	    return join(this);
	  };
	}

	var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

	// `%TypedArray%.prototype.toString` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
	exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);

	// `Array.prototype.fill` method
	// https://tc39.es/ecma262/#sec-array.prototype.fill
	_export({ target: 'Array', proto: true }, {
	  fill: arrayFill
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('fill');

	// `Uint32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint32', function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

	var SPECIES = wellKnownSymbol('species');
	var Array$1 = global_1.Array;
	var max = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = lengthOfArrayLike(O);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (isConstructor(Constructor) && (Constructor === Array$1 || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array$1 || Constructor === undefined) {
	        return arraySlice(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array$1 : Constructor)(max(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
	var TypeError$1 = global_1.TypeError;

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike(E);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError$1(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError$1(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var msqr = createCommonjsModule(function (module, exports) {
	  /*!
	  	MSQR v0.2.1 alpha
	  	(c) 2016 K3N / Epistemex
	  	www.epistemex.com
	  	MIT License
	  */

	  /**
	   * Convert a canvas, context, image or video frame to a path that aligns with the outline of the non-alpha pixels
	   * using an optimized version of the marching squares algorithm.
	   *
	   * Alpha threshold can be adjusted. Optional point reduction can be performed to reduce total number of points.
	   *
	   * Embeds alignment feature to produce tighter fit. Can pre-align before point reduction as well.
	   *
	   * Use maxShapes to trace more than 1 shape.
	   *
	   * @param {*} src - source is either canvas, context, image or video (note: only webm video format supports alpha channel. webm is only available in Chrome/Opera).
	   * @param {*} [options] - an optional option object to tweak values or to set clip
	   * @param {number} [options.x] - set x for clipping bound. Default is 0.
	   * @param {number} [options.y] - set y for clipping bound. Default is 0.
	   * @param {number} [options.width] - set width for clipping bound. Default is width of source.
	   * @param {number} [options.height] - set height for clipping bound. Default is c of source.
	   * @param {number} [options.alpha=0] - alpha level [0, 254] to use for clipping. Any alpha value in the image above this value is considered a solid pixel.
	   * @param {number} [options.tolerance=0] - point reduction tolerance in pixels. If 0 no point reduction is performed. Recommended values [0.7, 1.5]
	   * @param {number} [options.bleed=5] - if maxShapes > 1 activates bleed mask for removing a traced shape.
	   * @param {number} [options.maxShapes=1] - maximum number of shapes to trace. Minimum is 1. No upper limit but be careful not to block the browser.
	   * @param {boolean} [options.align=false] - Attempts to align points to edge after reduction or with path if no reduction is performed. Disabled if padding is enabled.
	   * @param {number} [options.alignWeight=0.95] - Weighting a aligned point to avoid overlapping points.
	   * @param {number} [options.padding=0] - Add padding before tracing (radius). Use negative value to contract. Padding overrides and disables aligning if enabled.
	   * @param {boolean} [options.path2D=false] - Return array holding Path2D objects instead of point arrays.
	   * @returns {Array} Holds arrays with points for each shape, or if path2D=true an Path2D object for each shape
	   * @static
	   */
	  function MSQR(src, options) {

	    options = options || {};
	    var ctx;

	    if (src instanceof ArrayBuffer) {
	      var offscreen = new OffscreenCanvas(options.width, options.height);
	      var pixels = new ImageData(options.width, options.height);
	      pixels.data.set(new Uint8ClampedArray(src));
	      ctx = offscreen.getContext('2d');
	      ctx.putImageData(pixels, 0, 0);
	    } else if (src instanceof CanvasRenderingContext2D) {
	      ctx = src;
	    } else if (src instanceof OffscreenCanvasRenderingContext2D) {
	      ctx = src;
	    } else if (src instanceof HTMLCanvasElement) {
	      ctx = src.getContext("2d");
	    } else if (src instanceof HTMLImageElement || src instanceof HTMLVideoElement) {
	      ctx = img2context(src);
	    } else throw "Invalid source.";

	    var w = ctx.canvas.width,
	        h = ctx.canvas.height,
	        cx = (options.x || 0) | 0,
	        cy = (options.y || 0) | 0,
	        cw = (options.width || w) | 0,
	        ch = (options.height || h) | 0,
	        bu,
	        paths = [],
	        path,
	        lastPos = 3,
	        i,
	        pt,
	        // for recursive calls
	    bleed = Math.max(1, options.bleed || 5),
	        max = Math.max(1, options.maxShapes || 1),
	        alpha = Math.max(0, Math.min(254, options.alpha || 0)),
	        padding = options.padding || 0,
	        tolerance = Math.max(0, options.tolerance || 0),
	        doAlign = !!options.align,
	        alignWeight = options.alignWeight || 0.95,
	        retPath = !!options.path2D,
	        ctx2,
	        inc;

	    var filter = function filter(zn) {
	      var ch = zn >>> 16 & 0xff;

	      if (options.filterType === 'sobel') {
	        return ch > alpha;
	      } else {
	        return ch < alpha;
	      }
	    }; // check bounds


	    if (cx < 0 || cy < 0 || cx >= w || cy >= h || cw < 1 || ch < 1 || cx + cw > w || cy + ch > h) return []; // recursive? make backup since we will need to remove shapes

	    if (max > 1 || padding) {
	      // backup bitmap so we can mess around
	      bu = img2context(ctx.canvas); // force reset so we won't get surprises

	      ctx.save();
	      ctx.setTransform(1, 0, 0, 1, 0, 0);
	      ctx.fillStyle = ctx.strokeStyle = "#000";
	      ctx.globalAlpha = 1;
	      ctx.shadowColor = "rgba(0,0,0,0)"; // Padding redraws the image in n number of timer around center
	      // to extend the edges.

	      if (padding) {
	        ctx2 = img2context(ctx.canvas);
	        inc = padding < 0 ? 4 : padding > 5 ? 16 : 8;
	        ctx.globalCompositeOperation = padding < 0 ? "destination-in" : "source-over";
	        padding = Math.min(10, Math.abs(padding));

	        for (var angle = 0, step = Math.PI * 2 / inc; angle < 6.28; angle += step) {
	          ctx.drawImage(ctx2.canvas, padding * Math.cos(angle), padding * Math.sin(angle));
	        }
	      } // loop to find each shape


	      ctx.globalCompositeOperation = "destination-out";
	      ctx.lineWidth = bleed;
	      ctx.miterLimit = 1;

	      if (options.startPoint) {
	        lastPos = options.startPoint.y * cw + options.startPoint.x;
	      } else {
	        filter = null;
	      } // var startPos = startPoint.y * ch + cw;


	      do {
	        path = trace(filter);

	        if (path.length) {
	          // add to list
	          paths.push(retPath ? points2path(path) : path); // remove traced shape

	          ctx.beginPath();
	          i = path.length - 1;

	          while (pt = path[i--]) {
	            ctx.lineTo(pt.x, pt.y);
	          }

	          ctx.closePath();
	          ctx.fill();
	          ctx.stroke();
	        }
	      } while (path.length && --max); // restore bitmap to original


	      ctx.globalCompositeOperation = "source-over";
	      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	      ctx.drawImage(bu.canvas, 0, 0);
	      ctx.restore();
	      return paths;
	    } else {
	      path = trace();
	      paths.push(retPath ? points2path(path) : path);
	    }

	    return paths;
	    /*
	    	Trace
	     */

	    function trace(filter) {
	      var path = [],
	          data,
	          l,
	          i,
	          x,
	          y,
	          sx,
	          sy,
	          start = -1,
	          step,
	          pStep = 9,
	          steps = [9, 0, 3, 3, 2, 0, 9, 3, 1, 9, 1, 1, 2, 0, 2, 9];
	      data = new Uint32Array(ctx.getImageData(cx, cy, cw, ch).data.buffer);
	      l = data.length; // start position

	      if (filter) {
	        if (start === -1) {
	          for (i = lastPos; i > 3; i--) {
	            // for(i = lastPos; i < l; i++) {
	            if (filter(data[i])) {
	              // if ((data[i]>>>16 & 0xff) < alpha) {	// sketch
	              // if ((data[i]>>>16 & 0xff) > alpha) {	// sobel
	              // if ((data[i]>>>24) > alpha) {
	              start = lastPos = i - 1;
	              break;
	            }
	          }
	        }
	      } else {
	        for (i = lastPos; i < l; i++) {
	          if (data[i] >>> 24 > alpha) {
	            start = lastPos = i;
	            break;
	          }
	        }
	      } // march from start point until start point


	      if (start >= 0) {
	        // calculate start position
	        x = sx = start % cw | 0;
	        y = sy = start / cw | 0;

	        do {
	          step = getNextStep(x, y);
	          if (step === 0) y--;else if (step === 1) y++;else if (step === 2) x--;else if (step === 3) x++;

	          if (step !== pStep) {
	            path.push({
	              x: x + cx,
	              y: y + cy
	            });
	            pStep = step;
	          }
	        } while (x !== sx || y !== sy); // point reduction?


	        if (tolerance) path = reduce(path, tolerance); // align? (only if no padding)

	        if (doAlign && !padding) path = align(path, alignWeight);
	      } // lookup pixel


	      function getState(x, y) {
	        if (filter) {
	          return x >= 0 && y >= 0 && x < cw && y < ch ? filter(data[y * cw + x]) : false;
	        }

	        return x >= 0 && y >= 0 && x < cw && y < ch ? data[y * cw + x] >>> 24 > alpha : false;
	      } // Parse 2x2 pixels to determine next step direction.
	      // See https://en.wikipedia.org/wiki/Marching_squares for details.
	      // Note: does not do clockwise cycle as in the original specs, but line by line.


	      function getNextStep(x, y) {
	        var v = 0;
	        if (getState(x - 1, y - 1)) v |= 1;
	        if (getState(x, y - 1)) v |= 2;
	        if (getState(x - 1, y)) v |= 4;
	        if (getState(x, y)) v |= 8;
	        if (v === 6) return pStep === 0 ? 2 : 3;else if (v === 9) return pStep === 3 ? 0 : 1;else return steps[v];
	      } // Ramer Douglas Peucker with correct distance point-to-line


	      function reduce(points, epsilon) {
	        var len1 = points.length - 1;
	        if (len1 < 2) return points;
	        var fPoint = points[0],
	            lPoint = points[len1],
	            epsilon2 = epsilon * epsilon,
	            i,
	            index = -1,
	            cDist,
	            dist = 0,
	            l1,
	            l2,
	            r1,
	            r2;

	        for (i = 1; i < len1; i++) {
	          cDist = distPointToLine(points[i], fPoint, lPoint);

	          if (cDist > dist) {
	            dist = cDist;
	            index = i;
	          }
	        }

	        if (dist > epsilon2) {
	          l1 = points.slice(0, index + 1);
	          l2 = points.slice(index);
	          r1 = reduce(l1, epsilon);
	          r2 = reduce(l2, epsilon);
	          return r1.slice(0, r1.length - 1).concat(r2);
	        } else return [fPoint, lPoint];
	      }

	      function distPointToLine(p, l1, l2) {
	        var lLen = dist(l1, l2),
	            t;
	        if (!lLen) return 0;
	        t = ((p.x - l1.x) * (l2.x - l1.x) + (p.y - l1.y) * (l2.y - l1.y)) / lLen;
	        if (t < 0) return dist(p, l1);else if (t > 1) return dist(p, l2);else return dist(p, {
	          x: l1.x + t * (l2.x - l1.x),
	          y: l1.y + t * (l2.y - l1.y)
	        });
	      }

	      function dist(p1, p2) {
	        var dx = p1.x - p2.x,
	            dy = p1.y - p2.y;
	        return dx * dx + dy * dy;
	      } // Align by K3N


	      function align(points, w) {
	        var ox = [1, -1, -1, 1],
	            oy = [1, 1, -1, -1],
	            p,
	            t = 0;

	        while (p = points[t++]) {
	          p.x = Math.round(p.x);
	          p.y = Math.round(p.y);

	          for (var i = 0, tx, ty, dx, dy; i < 4; i++) {
	            dx = ox[i];
	            dy = oy[i];
	            tx = p.x + (dx << 1);
	            ty = p.y + (dy << 1);

	            if (tx > cx && ty > cy && tx < cw - 1 && ty < ch - 1) {
	              if (!getState(tx, ty)) {
	                tx -= dx;
	                ty -= dy;

	                if (getState(tx, ty)) {
	                  p.x += dx * w;
	                  p.y += dy * w;
	                }
	              }
	            }
	          }
	        }

	        return points;
	      }

	      return path;
	    }
	    /*
	    	Helper functions
	    	function img2context(src) {
	    	var c = document.createElement("canvas"), ctx;
	    	c.width = src.naturalWidth || src.videoWidth || src.width;
	    	c.height = src.naturalHeight || src.videoHeight || src.height;
	    	ctx = c.getContext("2d");
	    	ctx.drawImage(src, 0, 0);
	    	return ctx
	    }
	     */


	    function img2context(src) {
	      src.naturalWidth || src.videoWidth || src.width;
	      var h = src.naturalHeight || src.videoHeight || src.height;
	      var c = new OffscreenCanvas(h, h); // var c = document.createElement("canvas"), ctx;
	      // c.width = src.naturalWidth || src.videoWidth || src.width;
	      // c.height = src.naturalHeight || src.videoHeight || src.height;

	      ctx = c.getContext("2d");
	      ctx.drawImage(src, 0, 0);
	      return ctx;
	    }

	    function points2path(points) {
	      var path = new Path2D(),
	          i = 0,
	          point;

	      while (point = points[i++]) {
	        path.lineTo(point.x, point.y);
	      }

	      path.closePath();
	      return path;
	    }
	  }
	  /**
	   * Generic function to obtain boundaries of an array with points. The
	   * array contains point objects with properties x and y.
	   *
	   * @example
	   *
	   *     var rect = MSQR.getBounds(points);
	   *
	   * @param {Array} points - point array with point objects
	   * @returns {{x: Number, y: Number, width: number, height: number}}
	   * @name MSQR.getBounds
	   * @function
	   * @global
	   */


	  MSQR.getBounds = function (points) {
	    var minX = 9999999,
	        minY = 9999999,
	        maxX = -9999999,
	        maxY = -9999999,
	        i,
	        l = points.length;

	    for (i = 0; i < l; i++) {
	      if (points[i].x > maxX) maxX = points[i].x;
	      if (points[i].x < minX) minX = points[i].x;
	      if (points[i].y > maxY) maxY = points[i].y;
	      if (points[i].y < minY) minY = points[i].y;
	    }

	    return {
	      x: minX | 0,
	      y: minY | 0,
	      width: Math.ceil(maxX - minX),
	      height: Math.ceil(maxY - minY)
	    };
	  };

	  exports.MSQR = MSQR;
	});
	msqr.MSQR;

	var getFeature = function getFeature(it, out) {
	  Features.getFeature(it.attrs.id, it.type, out.prefix).then(function (json1) {
	    out.feature = json1.feature.feature;
	    self.postMessage(out);
	  });
	};

	onmessage = function onmessage(evt) {
	  var data = evt.data || {};
	  var cmd = data.cmd;
	      data.zoom;
	      data.bbox;
	      data.bounds;
	      data.width;
	      data.height;
	      var canvas = data.canvas,
	      url = data.url,
	      coords = data.coords,
	      pcoords = data.pcoords,
	      prefix = data.prefix,
	      point = data.point,
	      nm = data.nm,
	      id = data.id,
	      type = data.type;

	  switch (cmd) {
	    case 'tile':
	      Renderer.drawPBF(canvas, url, coords, pcoords).then(function (flag) {
	        self.postMessage({
	          cmd: 'tile',
	          id: data.id,
	          tKey: data.tKey,
	          coords: coords,
	          url: url,
	          flag: flag
	        });
	      });
	      break;

	    case 'feature':
	      var out = {
	        cmd: cmd,
	        prefix: prefix,
	        nm: nm,
	        id: id,
	        type: type // point: point,
	        // items: json,
	        // id: data.id,
	        // url: url,
	        // flag: flag

	      };
	      getFeature({
	        type: type,
	        attrs: {
	          id: id
	        }
	      }, out);
	      break;

	    case 'features':
	      Features.getFeatures(point, prefix).then(function (json) {
	        // console.log('Features.getFeatures', json, prefix, point);
	        var out = {
	          cmd: 'features',
	          prefix: prefix,
	          point: point,
	          items: json // id: data.id,
	          // url: url,
	          // flag: flag

	        };

	        if (json.arr.length) {
	          getFeature(json.arr[0], out); // const it = json.arr[0];
	          // Features.getFeature(it.attrs.id, it.type, prefix).then(json1 => {
	          // out.feature = json1.feature;
	          // self.postMessage(out);
	          // });
	        } else {
	          self.postMessage(out);
	        }
	      });
	      break;

	    case 'msqr':
	      var pathPoints = msqr.MSQR(data.pixels, {
	        path2D: false,
	        maxShapes: 5,
	        width: data.width,
	        height: data.height // startPoint: point,
	        // filterType: filterType,
	        // alpha: 150,
	        // padding: attr.padding || 2,
	        // alignWeight: attr.alignWeight || 1.5,
	        // tolerance: 0,
	        // tolerance: [0.7, 1.5],
	        // align: true,

	      });
	      self.postMessage({
	        cmd: 'msqr',
	        it: data.it,
	        pathPoints: pathPoints
	      });
	      break;

	    default:
	      console.warn('Warning: Bad command ', data);
	      break;
	  }
	};

})();
//# sourceMappingURL=dataManager.js.map
