(function () {
  'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    define(Gp, "constructor", GeneratorFunctionPrototype);
    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    });
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    define(Gp, iteratorSymbol, function() {
      return this;
    });

    define(Gp, "toString", function() {
      return "[object Generator]";
    });

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, in modern engines
    // we can explicitly access globalThis. In older engines we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }
  });

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

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var functionBindNative = !fails(function () {
    var test = (function () { /* empty */ }).bind();
    // eslint-disable-next-line no-prototype-builtins -- safe
    return typeof test != 'function' || test.hasOwnProperty('prototype');
  });

  var call$2 = Function.prototype.call;

  var functionCall = functionBindNative ? call$2.bind(call$2) : function () {
    return call$2.apply(call$2, arguments);
  };

  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  var f$6 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$2(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f$6
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var FunctionPrototype$3 = Function.prototype;
  var bind$2 = FunctionPrototype$3.bind;
  var call$1 = FunctionPrototype$3.call;
  var uncurryThis = functionBindNative && bind$2.bind(call$1, call$1);

  var functionUncurryThis = functionBindNative ? function (fn) {
    return fn && uncurryThis(fn);
  } : function (fn) {
    return fn && function () {
      return call$1.apply(fn, arguments);
    };
  };

  var toString$1 = functionUncurryThis({}.toString);
  var stringSlice$5 = functionUncurryThis(''.slice);

  var classofRaw = function (it) {
    return stringSlice$5(toString$1(it), 8, -1);
  };

  var Object$5 = global_1.Object;
  var split$3 = functionUncurryThis(''.split);

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object$5('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split$3(it, '') : Object$5(it);
  } : Object$5;

  var TypeError$i = global_1.TypeError;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError$i("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable = function (argument) {
    return typeof argument == 'function';
  };

  var isObject = function (it) {
    return typeof it == 'object' ? it !== null : isCallable(it);
  };

  var aFunction = function (argument) {
    return isCallable(argument) ? argument : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
  };

  var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

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

  var Object$4 = global_1.Object;

  var isSymbol = useSymbolAsUid ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn('Symbol');
    return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, Object$4(it));
  };

  var String$5 = global_1.String;

  var tryToString = function (argument) {
    try {
      return String$5(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var TypeError$h = global_1.TypeError;

  // `Assert: IsCallable(argument) is true`
  var aCallable = function (argument) {
    if (isCallable(argument)) return argument;
    throw TypeError$h(tryToString(argument) + ' is not a function');
  };

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod = function (V, P) {
    var func = V[P];
    return func == null ? undefined : aCallable(func);
  };

  var TypeError$g = global_1.TypeError;

  // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
  var ordinaryToPrimitive = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
    if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
    if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
    throw TypeError$g("Can't convert object to primitive value");
  };

  var isPure = false;

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
    version: '3.21.1',
    mode: 'global',
    copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
    license: 'https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE',
    source: 'https://github.com/zloirock/core-js'
  });
  });

  var Object$3 = global_1.Object;

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object$3(requireObjectCoercible(argument));
  };

  var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

  // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty(toObject(it), key);
  };

  var id = 0;
  var postfix = Math.random();
  var toString = functionUncurryThis(1.0.toString);

  var uid = function (key) {
    return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
  };

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

  var TypeError$f = global_1.TypeError;
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
      throw TypeError$f("Can't convert object to primitive value");
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

  var document$3 = global_1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject(document$3) && isObject(document$3.createElement);

  var documentCreateElement = function (it) {
    return EXISTS$1 ? document$3.createElement(it) : {};
  };

  // Thanks to IE8 for its funny defineProperty
  var ie8DomDefine = !descriptors && !fails(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  var f$5 = descriptors ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPropertyKey(P);
    if (ie8DomDefine) try {
      return $getOwnPropertyDescriptor$1(O, P);
    } catch (error) { /* empty */ }
    if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$5
  };

  // V8 ~ Chrome 36-
  // https://bugs.chromium.org/p/v8/issues/detail?id=3334
  var v8PrototypeDefineBug = descriptors && fails(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(function () { /* empty */ }, 'prototype', {
      value: 42,
      writable: false
    }).prototype != 42;
  });

  var String$4 = global_1.String;
  var TypeError$e = global_1.TypeError;

  // `Assert: Type(argument) is Object`
  var anObject = function (argument) {
    if (isObject(argument)) return argument;
    throw TypeError$e(String$4(argument) + ' is not an object');
  };

  var TypeError$d = global_1.TypeError;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty = Object.defineProperty;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var ENUMERABLE = 'enumerable';
  var CONFIGURABLE$1 = 'configurable';
  var WRITABLE = 'writable';

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  var f$4 = descriptors ? v8PrototypeDefineBug ? function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPropertyKey(P);
    anObject(Attributes);
    if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
      var current = $getOwnPropertyDescriptor(O, P);
      if (current && current[WRITABLE]) {
        O[P] = Attributes.value;
        Attributes = {
          configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
          enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
          writable: false
        };
      }
    } return $defineProperty(O, P, Attributes);
  } : $defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPropertyKey(P);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError$d('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f$4
  };

  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var functionToString$1 = functionUncurryThis(Function.toString);

  // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
  if (!isCallable(sharedStore.inspectSource)) {
    sharedStore.inspectSource = function (it) {
      return functionToString$1(it);
    };
  }

  var inspectSource = sharedStore.inspectSource;

  var WeakMap$1 = global_1.WeakMap;

  var nativeWeakMap = isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));

  var keys = shared('keys');

  var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys$1 = {};

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var TypeError$c = global_1.TypeError;
  var WeakMap = global_1.WeakMap;
  var set$1, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set$1(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError$c('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap || sharedStore.state) {
    var store = sharedStore.state || (sharedStore.state = new WeakMap());
    var wmget = functionUncurryThis(store.get);
    var wmhas = functionUncurryThis(store.has);
    var wmset = functionUncurryThis(store.set);
    set$1 = function (it, metadata) {
      if (wmhas(store, it)) throw new TypeError$c(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      wmset(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget(store, it) || {};
    };
    has = function (it) {
      return wmhas(store, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys$1[STATE] = true;
    set$1 = function (it, metadata) {
      if (hasOwnProperty_1(it, STATE)) throw new TypeError$c(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return hasOwnProperty_1(it, STATE);
    };
  }

  var internalState = {
    set: set$1,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var FunctionPrototype$2 = Function.prototype;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

  var EXISTS = hasOwnProperty_1(FunctionPrototype$2, 'name');
  // additional protection from minified / mangled / dropped function names
  var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
  var CONFIGURABLE = EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$2, 'name').configurable));

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

  var ceil = Math.ceil;
  var floor$3 = Math.floor;

  // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity
  var toIntegerOrInfinity = function (argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- safe
    return number !== number || number === 0 ? 0 : (number > 0 ? floor$3 : ceil)(number);
  };

  var max$1 = Math.max;
  var min$2 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toIntegerOrInfinity(index);
    return integer < 0 ? max$1(integer + length, 0) : min$2(integer, length);
  };

  var min$1 = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min$1(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike
  var lengthOfArrayLike = function (obj) {
    return toLength(obj.length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$2 = function (IS_INCLUDES) {
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
    includes: createMethod$2(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$2(false)
  };

  var indexOf$1 = arrayIncludes.indexOf;


  var push$5 = functionUncurryThis([].push);

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !hasOwnProperty_1(hiddenKeys$1, key) && hasOwnProperty_1(O, key) && push$5(result, key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
      ~indexOf$1(result, key) || push$5(result, key);
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
  var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys);
  };

  var objectGetOwnPropertyNames = {
  	f: f$3
  };

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  var f$2 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f$2
  };

  var concat$1 = functionUncurryThis([].concat);

  // all object keys, includes non-enumerable and symbols
  var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
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

  var bind$1 = functionUncurryThis(functionUncurryThis.bind);

  // optional / simple context binding
  var functionBindContext = function (fn, that) {
    aCallable(fn);
    return that === undefined ? fn : functionBindNative ? bind$1(fn, that) : function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es/no-array-isarray -- safe
  var isArray = Array.isArray || function isArray(argument) {
    return classofRaw(argument) == 'Array';
  };

  var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
  var test = {};

  test[TO_STRING_TAG$3] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
  var Object$2 = global_1.Object;

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
      : typeof (tag = tryGet(O = Object$2(it), TO_STRING_TAG$2)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
  };

  var noop = function () { /* empty */ };
  var empty = [];
  var construct = getBuiltIn('Reflect', 'construct');
  var constructorRegExp = /^\s*(?:class|function)\b/;
  var exec$4 = functionUncurryThis(constructorRegExp.exec);
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
      return INCORRECT_TO_STRING || !!exec$4(constructorRegExp, inspectSource(argument));
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

  var SPECIES$5 = wellKnownSymbol('species');
  var Array$4 = global_1.Array;

  // a part of `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesConstructor = function (originalArray) {
    var C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (isConstructor(C) && (C === Array$4 || isArray(C.prototype))) C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES$5];
        if (C === null) C = undefined;
      }
    } return C === undefined ? Array$4 : C;
  };

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate = function (originalArray, length) {
    return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
  };

  var push$4 = functionUncurryThis([].push);

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
  var createMethod$1 = function (TYPE) {
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
            case 2: push$4(target, value);      // filter
          } else switch (TYPE) {
            case 4: return false;             // every
            case 7: push$4(target, value);      // filterReject
          }
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$1(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: createMethod$1(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: createMethod$1(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: createMethod$1(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: createMethod$1(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: createMethod$1(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$1(6),
    // `Array.prototype.filterReject` method
    // https://github.com/tc39/proposal-array-filtering
    filterReject: createMethod$1(7)
  };

  var SPECIES$4 = wellKnownSymbol('species');

  var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return engineV8Version >= 51 || !fails(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES$4] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var $map = arrayIteration.map;


  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
    map: function map(callbackfn /* , thisArg */) {
      return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var String$3 = global_1.String;

  var toString_1 = function (argument) {
    if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
    return String$3(argument);
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

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  var f$1 = descriptors && !v8PrototypeDefineBug ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var props = toIndexedObject(Properties);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
    return O;
  };

  var objectDefineProperties = {
  	f: f$1
  };

  var html = getBuiltIn('document', 'documentElement');

  /* global ActiveXObject -- old IE, WSH */








  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
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
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys$1[IE_PROTO$1] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : objectDefineProperties.f(result, Properties);
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







  var getInternalState$3 = internalState.get;



  var nativeReplace = shared('native-string-replace', String.prototype.replace);
  var nativeExec = RegExp.prototype.exec;
  var patchedExec = nativeExec;
  var charAt$6 = functionUncurryThis(''.charAt);
  var indexOf = functionUncurryThis(''.indexOf);
  var replace$4 = functionUncurryThis(''.replace);
  var stringSlice$4 = functionUncurryThis(''.slice);

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
      var state = getInternalState$3(re);
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
        flags = replace$4(flags, 'y', '');
        if (indexOf(flags, 'g') === -1) {
          flags += 'g';
        }

        strCopy = stringSlice$4(str, re.lastIndex);
        // Support anchored sticky behavior.
        if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$6(str, re.lastIndex - 1) !== '\n')) {
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
          match.input = stringSlice$4(match.input, charsAdded);
          match[0] = stringSlice$4(match[0], charsAdded);
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








  var SPECIES$3 = wellKnownSymbol('species');
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
        re.constructor[SPECIES$3] = function () { return re; };
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

  // `SameValue` abstract operation
  // https://tc39.es/ecma262/#sec-samevalue
  // eslint-disable-next-line es/no-object-is -- safe
  var sameValue = Object.is || function is(x, y) {
    // eslint-disable-next-line no-self-compare -- NaN check
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  };

  var TypeError$b = global_1.TypeError;

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
    throw TypeError$b('RegExp#exec called on incompatible receiver');
  };

  // @@search logic
  fixRegexpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
    return [
      // `String.prototype.search` method
      // https://tc39.es/ecma262/#sec-string.prototype.search
      function search(regexp) {
        var O = requireObjectCoercible(this);
        var searcher = regexp == undefined ? undefined : getMethod(regexp, SEARCH);
        return searcher ? functionCall(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString_1(O));
      },
      // `RegExp.prototype[@@search]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
      function (string) {
        var rx = anObject(this);
        var S = toString_1(string);
        var res = maybeCallNative(nativeSearch, rx, S);

        if (res.done) return res.value;

        var previousLastIndex = rx.lastIndex;
        if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
        var result = regexpExecAbstract(rx, S);
        if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
        return result === null ? -1 : result.index;
      }
    ];
  });

  var leafletSrc = createCommonjsModule(function (module, exports) {
  /* @preserve
   * Leaflet 1.7.1, a JS library for interactive maps. http://leafletjs.com
   * (c) 2010-2019 Vladimir Agafonkin, (c) 2010-2011 CloudMade
   */

  (function (global, factory) {
    factory(exports) ;
  }(commonjsGlobal, (function (exports) {
    var version = "1.7.1";

    /*
     * @namespace Util
     *
     * Various utility functions, used by Leaflet internally.
     */

    // @function extend(dest: Object, src?: Object): Object
    // Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
    function extend(dest) {
    	var i, j, len, src;

    	for (j = 1, len = arguments.length; j < len; j++) {
    		src = arguments[j];
    		for (i in src) {
    			dest[i] = src[i];
    		}
    	}
    	return dest;
    }

    // @function create(proto: Object, properties?: Object): Object
    // Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
    var create = Object.create || (function () {
    	function F() {}
    	return function (proto) {
    		F.prototype = proto;
    		return new F();
    	};
    })();

    // @function bind(fn: Function, …): Function
    // Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
    // Has a `L.bind()` shortcut.
    function bind(fn, obj) {
    	var slice = Array.prototype.slice;

    	if (fn.bind) {
    		return fn.bind.apply(fn, slice.call(arguments, 1));
    	}

    	var args = slice.call(arguments, 2);

    	return function () {
    		return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
    	};
    }

    // @property lastId: Number
    // Last unique ID used by [`stamp()`](#util-stamp)
    var lastId = 0;

    // @function stamp(obj: Object): Number
    // Returns the unique ID of an object, assigning it one if it doesn't have it.
    function stamp(obj) {
    	/*eslint-disable */
    	obj._leaflet_id = obj._leaflet_id || ++lastId;
    	return obj._leaflet_id;
    	/* eslint-enable */
    }

    // @function throttle(fn: Function, time: Number, context: Object): Function
    // Returns a function which executes function `fn` with the given scope `context`
    // (so that the `this` keyword refers to `context` inside `fn`'s code). The function
    // `fn` will be called no more than one time per given amount of `time`. The arguments
    // received by the bound function will be any arguments passed when binding the
    // function, followed by any arguments passed when invoking the bound function.
    // Has an `L.throttle` shortcut.
    function throttle(fn, time, context) {
    	var lock, args, wrapperFn, later;

    	later = function () {
    		// reset lock and call if queued
    		lock = false;
    		if (args) {
    			wrapperFn.apply(context, args);
    			args = false;
    		}
    	};

    	wrapperFn = function () {
    		if (lock) {
    			// called too soon, queue to call later
    			args = arguments;

    		} else {
    			// call and lock until later
    			fn.apply(context, arguments);
    			setTimeout(later, time);
    			lock = true;
    		}
    	};

    	return wrapperFn;
    }

    // @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
    // Returns the number `num` modulo `range` in such a way so it lies within
    // `range[0]` and `range[1]`. The returned value will be always smaller than
    // `range[1]` unless `includeMax` is set to `true`.
    function wrapNum(x, range, includeMax) {
    	var max = range[1],
    	    min = range[0],
    	    d = max - min;
    	return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
    }

    // @function falseFn(): Function
    // Returns a function which always returns `false`.
    function falseFn() { return false; }

    // @function formatNum(num: Number, digits?: Number): Number
    // Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
    function formatNum(num, digits) {
    	var pow = Math.pow(10, (digits === undefined ? 6 : digits));
    	return Math.round(num * pow) / pow;
    }

    // @function trim(str: String): String
    // Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
    function trim(str) {
    	return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    // @function splitWords(str: String): String[]
    // Trims and splits the string on whitespace and returns the array of parts.
    function splitWords(str) {
    	return trim(str).split(/\s+/);
    }

    // @function setOptions(obj: Object, options: Object): Object
    // Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
    function setOptions(obj, options) {
    	if (!Object.prototype.hasOwnProperty.call(obj, 'options')) {
    		obj.options = obj.options ? create(obj.options) : {};
    	}
    	for (var i in options) {
    		obj.options[i] = options[i];
    	}
    	return obj.options;
    }

    // @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
    // Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
    // translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
    // be appended at the end. If `uppercase` is `true`, the parameter names will
    // be uppercased (e.g. `'?A=foo&B=bar'`)
    function getParamString(obj, existingUrl, uppercase) {
    	var params = [];
    	for (var i in obj) {
    		params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
    	}
    	return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
    }

    var templateRe = /\{ *([\w_-]+) *\}/g;

    // @function template(str: String, data: Object): String
    // Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
    // and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
    // `('Hello foo, bar')`. You can also specify functions instead of strings for
    // data values — they will be evaluated passing `data` as an argument.
    function template(str, data) {
    	return str.replace(templateRe, function (str, key) {
    		var value = data[key];

    		if (value === undefined) {
    			throw new Error('No value provided for variable ' + str);

    		} else if (typeof value === 'function') {
    			value = value(data);
    		}
    		return value;
    	});
    }

    // @function isArray(obj): Boolean
    // Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
    var isArray = Array.isArray || function (obj) {
    	return (Object.prototype.toString.call(obj) === '[object Array]');
    };

    // @function indexOf(array: Array, el: Object): Number
    // Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
    function indexOf(array, el) {
    	for (var i = 0; i < array.length; i++) {
    		if (array[i] === el) { return i; }
    	}
    	return -1;
    }

    // @property emptyImageUrl: String
    // Data URI string containing a base64-encoded empty GIF image.
    // Used as a hack to free memory from unused images on WebKit-powered
    // mobile devices (by setting image `src` to this string).
    var emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

    // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

    function getPrefixed(name) {
    	return window['webkit' + name] || window['moz' + name] || window['ms' + name];
    }

    var lastTime = 0;

    // fallback for IE 7-8
    function timeoutDefer(fn) {
    	var time = +new Date(),
    	    timeToCall = Math.max(0, 16 - (time - lastTime));

    	lastTime = time + timeToCall;
    	return window.setTimeout(fn, timeToCall);
    }

    var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
    var cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
    		getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };

    // @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
    // Schedules `fn` to be executed when the browser repaints. `fn` is bound to
    // `context` if given. When `immediate` is set, `fn` is called immediately if
    // the browser doesn't have native support for
    // [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
    // otherwise it's delayed. Returns a request ID that can be used to cancel the request.
    function requestAnimFrame(fn, context, immediate) {
    	if (immediate && requestFn === timeoutDefer) {
    		fn.call(context);
    	} else {
    		return requestFn.call(window, bind(fn, context));
    	}
    }

    // @function cancelAnimFrame(id: Number): undefined
    // Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
    function cancelAnimFrame(id) {
    	if (id) {
    		cancelFn.call(window, id);
    	}
    }

    var Util = ({
      extend: extend,
      create: create,
      bind: bind,
      lastId: lastId,
      stamp: stamp,
      throttle: throttle,
      wrapNum: wrapNum,
      falseFn: falseFn,
      formatNum: formatNum,
      trim: trim,
      splitWords: splitWords,
      setOptions: setOptions,
      getParamString: getParamString,
      template: template,
      isArray: isArray,
      indexOf: indexOf,
      emptyImageUrl: emptyImageUrl,
      requestFn: requestFn,
      cancelFn: cancelFn,
      requestAnimFrame: requestAnimFrame,
      cancelAnimFrame: cancelAnimFrame
    });

    // @class Class
    // @aka L.Class

    // @section
    // @uninheritable

    // Thanks to John Resig and Dean Edwards for inspiration!

    function Class() {}

    Class.extend = function (props) {

    	// @function extend(props: Object): Function
    	// [Extends the current class](#class-inheritance) given the properties to be included.
    	// Returns a Javascript function that is a class constructor (to be called with `new`).
    	var NewClass = function () {

    		// call the constructor
    		if (this.initialize) {
    			this.initialize.apply(this, arguments);
    		}

    		// call all constructor hooks
    		this.callInitHooks();
    	};

    	var parentProto = NewClass.__super__ = this.prototype;

    	var proto = create(parentProto);
    	proto.constructor = NewClass;

    	NewClass.prototype = proto;

    	// inherit parent's statics
    	for (var i in this) {
    		if (Object.prototype.hasOwnProperty.call(this, i) && i !== 'prototype' && i !== '__super__') {
    			NewClass[i] = this[i];
    		}
    	}

    	// mix static properties into the class
    	if (props.statics) {
    		extend(NewClass, props.statics);
    		delete props.statics;
    	}

    	// mix includes into the prototype
    	if (props.includes) {
    		checkDeprecatedMixinEvents(props.includes);
    		extend.apply(null, [proto].concat(props.includes));
    		delete props.includes;
    	}

    	// merge options
    	if (proto.options) {
    		props.options = extend(create(proto.options), props.options);
    	}

    	// mix given properties into the prototype
    	extend(proto, props);

    	proto._initHooks = [];

    	// add method for calling all hooks
    	proto.callInitHooks = function () {

    		if (this._initHooksCalled) { return; }

    		if (parentProto.callInitHooks) {
    			parentProto.callInitHooks.call(this);
    		}

    		this._initHooksCalled = true;

    		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
    			proto._initHooks[i].call(this);
    		}
    	};

    	return NewClass;
    };


    // @function include(properties: Object): this
    // [Includes a mixin](#class-includes) into the current class.
    Class.include = function (props) {
    	extend(this.prototype, props);
    	return this;
    };

    // @function mergeOptions(options: Object): this
    // [Merges `options`](#class-options) into the defaults of the class.
    Class.mergeOptions = function (options) {
    	extend(this.prototype.options, options);
    	return this;
    };

    // @function addInitHook(fn: Function): this
    // Adds a [constructor hook](#class-constructor-hooks) to the class.
    Class.addInitHook = function (fn) { // (Function) || (String, args...)
    	var args = Array.prototype.slice.call(arguments, 1);

    	var init = typeof fn === 'function' ? fn : function () {
    		this[fn].apply(this, args);
    	};

    	this.prototype._initHooks = this.prototype._initHooks || [];
    	this.prototype._initHooks.push(init);
    	return this;
    };

    function checkDeprecatedMixinEvents(includes) {
    	if (typeof L === 'undefined' || !L || !L.Mixin) { return; }

    	includes = isArray(includes) ? includes : [includes];

    	for (var i = 0; i < includes.length; i++) {
    		if (includes[i] === L.Mixin.Events) {
    			console.warn('Deprecated include of L.Mixin.Events: ' +
    				'this property will be removed in future releases, ' +
    				'please inherit from L.Evented instead.', new Error().stack);
    		}
    	}
    }

    /*
     * @class Evented
     * @aka L.Evented
     * @inherits Class
     *
     * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
     *
     * @example
     *
     * ```js
     * map.on('click', function(e) {
     * 	alert(e.latlng);
     * } );
     * ```
     *
     * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
     *
     * ```js
     * function onClick(e) { ... }
     *
     * map.on('click', onClick);
     * map.off('click', onClick);
     * ```
     */

    var Events = {
    	/* @method on(type: String, fn: Function, context?: Object): this
    	 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
    	 *
    	 * @alternative
    	 * @method on(eventMap: Object): this
    	 * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
    	 */
    	on: function (types, fn, context) {

    		// types can be a map of types/handlers
    		if (typeof types === 'object') {
    			for (var type in types) {
    				// we don't process space-separated events here for performance;
    				// it's a hot path since Layer uses the on(obj) syntax
    				this._on(type, types[type], fn);
    			}

    		} else {
    			// types can be a string of space-separated words
    			types = splitWords(types);

    			for (var i = 0, len = types.length; i < len; i++) {
    				this._on(types[i], fn, context);
    			}
    		}

    		return this;
    	},

    	/* @method off(type: String, fn?: Function, context?: Object): this
    	 * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
    	 *
    	 * @alternative
    	 * @method off(eventMap: Object): this
    	 * Removes a set of type/listener pairs.
    	 *
    	 * @alternative
    	 * @method off: this
    	 * Removes all listeners to all events on the object. This includes implicitly attached events.
    	 */
    	off: function (types, fn, context) {

    		if (!types) {
    			// clear all listeners if called without arguments
    			delete this._events;

    		} else if (typeof types === 'object') {
    			for (var type in types) {
    				this._off(type, types[type], fn);
    			}

    		} else {
    			types = splitWords(types);

    			for (var i = 0, len = types.length; i < len; i++) {
    				this._off(types[i], fn, context);
    			}
    		}

    		return this;
    	},

    	// attach listener (without syntactic sugar now)
    	_on: function (type, fn, context) {
    		this._events = this._events || {};

    		/* get/init listeners for type */
    		var typeListeners = this._events[type];
    		if (!typeListeners) {
    			typeListeners = [];
    			this._events[type] = typeListeners;
    		}

    		if (context === this) {
    			// Less memory footprint.
    			context = undefined;
    		}
    		var newListener = {fn: fn, ctx: context},
    		    listeners = typeListeners;

    		// check if fn already there
    		for (var i = 0, len = listeners.length; i < len; i++) {
    			if (listeners[i].fn === fn && listeners[i].ctx === context) {
    				return;
    			}
    		}

    		listeners.push(newListener);
    	},

    	_off: function (type, fn, context) {
    		var listeners,
    		    i,
    		    len;

    		if (!this._events) { return; }

    		listeners = this._events[type];

    		if (!listeners) {
    			return;
    		}

    		if (!fn) {
    			// Set all removed listeners to noop so they are not called if remove happens in fire
    			for (i = 0, len = listeners.length; i < len; i++) {
    				listeners[i].fn = falseFn;
    			}
    			// clear all listeners for a type if function isn't specified
    			delete this._events[type];
    			return;
    		}

    		if (context === this) {
    			context = undefined;
    		}

    		if (listeners) {

    			// find fn and remove it
    			for (i = 0, len = listeners.length; i < len; i++) {
    				var l = listeners[i];
    				if (l.ctx !== context) { continue; }
    				if (l.fn === fn) {

    					// set the removed listener to noop so that's not called if remove happens in fire
    					l.fn = falseFn;

    					if (this._firingCount) {
    						/* copy array in case events are being fired */
    						this._events[type] = listeners = listeners.slice();
    					}
    					listeners.splice(i, 1);

    					return;
    				}
    			}
    		}
    	},

    	// @method fire(type: String, data?: Object, propagate?: Boolean): this
    	// Fires an event of the specified type. You can optionally provide an data
    	// object — the first argument of the listener function will contain its
    	// properties. The event can optionally be propagated to event parents.
    	fire: function (type, data, propagate) {
    		if (!this.listens(type, propagate)) { return this; }

    		var event = extend({}, data, {
    			type: type,
    			target: this,
    			sourceTarget: data && data.sourceTarget || this
    		});

    		if (this._events) {
    			var listeners = this._events[type];

    			if (listeners) {
    				this._firingCount = (this._firingCount + 1) || 1;
    				for (var i = 0, len = listeners.length; i < len; i++) {
    					var l = listeners[i];
    					l.fn.call(l.ctx || this, event);
    				}

    				this._firingCount--;
    			}
    		}

    		if (propagate) {
    			// propagate the event to parents (set with addEventParent)
    			this._propagateEvent(event);
    		}

    		return this;
    	},

    	// @method listens(type: String): Boolean
    	// Returns `true` if a particular event type has any listeners attached to it.
    	listens: function (type, propagate) {
    		var listeners = this._events && this._events[type];
    		if (listeners && listeners.length) { return true; }

    		if (propagate) {
    			// also check parents for listeners if event propagates
    			for (var id in this._eventParents) {
    				if (this._eventParents[id].listens(type, propagate)) { return true; }
    			}
    		}
    		return false;
    	},

    	// @method once(…): this
    	// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
    	once: function (types, fn, context) {

    		if (typeof types === 'object') {
    			for (var type in types) {
    				this.once(type, types[type], fn);
    			}
    			return this;
    		}

    		var handler = bind(function () {
    			this
    			    .off(types, fn, context)
    			    .off(types, handler, context);
    		}, this);

    		// add a listener that's executed once and removed after that
    		return this
    		    .on(types, fn, context)
    		    .on(types, handler, context);
    	},

    	// @method addEventParent(obj: Evented): this
    	// Adds an event parent - an `Evented` that will receive propagated events
    	addEventParent: function (obj) {
    		this._eventParents = this._eventParents || {};
    		this._eventParents[stamp(obj)] = obj;
    		return this;
    	},

    	// @method removeEventParent(obj: Evented): this
    	// Removes an event parent, so it will stop receiving propagated events
    	removeEventParent: function (obj) {
    		if (this._eventParents) {
    			delete this._eventParents[stamp(obj)];
    		}
    		return this;
    	},

    	_propagateEvent: function (e) {
    		for (var id in this._eventParents) {
    			this._eventParents[id].fire(e.type, extend({
    				layer: e.target,
    				propagatedFrom: e.target
    			}, e), true);
    		}
    	}
    };

    // aliases; we should ditch those eventually

    // @method addEventListener(…): this
    // Alias to [`on(…)`](#evented-on)
    Events.addEventListener = Events.on;

    // @method removeEventListener(…): this
    // Alias to [`off(…)`](#evented-off)

    // @method clearAllEventListeners(…): this
    // Alias to [`off()`](#evented-off)
    Events.removeEventListener = Events.clearAllEventListeners = Events.off;

    // @method addOneTimeEventListener(…): this
    // Alias to [`once(…)`](#evented-once)
    Events.addOneTimeEventListener = Events.once;

    // @method fireEvent(…): this
    // Alias to [`fire(…)`](#evented-fire)
    Events.fireEvent = Events.fire;

    // @method hasEventListeners(…): Boolean
    // Alias to [`listens(…)`](#evented-listens)
    Events.hasEventListeners = Events.listens;

    var Evented = Class.extend(Events);

    /*
     * @class Point
     * @aka L.Point
     *
     * Represents a point with `x` and `y` coordinates in pixels.
     *
     * @example
     *
     * ```js
     * var point = L.point(200, 300);
     * ```
     *
     * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
     *
     * ```js
     * map.panBy([200, 300]);
     * map.panBy(L.point(200, 300));
     * ```
     *
     * Note that `Point` does not inherit from Leaflet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function Point(x, y, round) {
    	// @property x: Number; The `x` coordinate of the point
    	this.x = (round ? Math.round(x) : x);
    	// @property y: Number; The `y` coordinate of the point
    	this.y = (round ? Math.round(y) : y);
    }

    var trunc = Math.trunc || function (v) {
    	return v > 0 ? Math.floor(v) : Math.ceil(v);
    };

    Point.prototype = {

    	// @method clone(): Point
    	// Returns a copy of the current point.
    	clone: function () {
    		return new Point(this.x, this.y);
    	},

    	// @method add(otherPoint: Point): Point
    	// Returns the result of addition of the current and the given points.
    	add: function (point) {
    		// non-destructive, returns a new point
    		return this.clone()._add(toPoint(point));
    	},

    	_add: function (point) {
    		// destructive, used directly for performance in situations where it's safe to modify existing point
    		this.x += point.x;
    		this.y += point.y;
    		return this;
    	},

    	// @method subtract(otherPoint: Point): Point
    	// Returns the result of subtraction of the given point from the current.
    	subtract: function (point) {
    		return this.clone()._subtract(toPoint(point));
    	},

    	_subtract: function (point) {
    		this.x -= point.x;
    		this.y -= point.y;
    		return this;
    	},

    	// @method divideBy(num: Number): Point
    	// Returns the result of division of the current point by the given number.
    	divideBy: function (num) {
    		return this.clone()._divideBy(num);
    	},

    	_divideBy: function (num) {
    		this.x /= num;
    		this.y /= num;
    		return this;
    	},

    	// @method multiplyBy(num: Number): Point
    	// Returns the result of multiplication of the current point by the given number.
    	multiplyBy: function (num) {
    		return this.clone()._multiplyBy(num);
    	},

    	_multiplyBy: function (num) {
    		this.x *= num;
    		this.y *= num;
    		return this;
    	},

    	// @method scaleBy(scale: Point): Point
    	// Multiply each coordinate of the current point by each coordinate of
    	// `scale`. In linear algebra terms, multiply the point by the
    	// [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
    	// defined by `scale`.
    	scaleBy: function (point) {
    		return new Point(this.x * point.x, this.y * point.y);
    	},

    	// @method unscaleBy(scale: Point): Point
    	// Inverse of `scaleBy`. Divide each coordinate of the current point by
    	// each coordinate of `scale`.
    	unscaleBy: function (point) {
    		return new Point(this.x / point.x, this.y / point.y);
    	},

    	// @method round(): Point
    	// Returns a copy of the current point with rounded coordinates.
    	round: function () {
    		return this.clone()._round();
    	},

    	_round: function () {
    		this.x = Math.round(this.x);
    		this.y = Math.round(this.y);
    		return this;
    	},

    	// @method floor(): Point
    	// Returns a copy of the current point with floored coordinates (rounded down).
    	floor: function () {
    		return this.clone()._floor();
    	},

    	_floor: function () {
    		this.x = Math.floor(this.x);
    		this.y = Math.floor(this.y);
    		return this;
    	},

    	// @method ceil(): Point
    	// Returns a copy of the current point with ceiled coordinates (rounded up).
    	ceil: function () {
    		return this.clone()._ceil();
    	},

    	_ceil: function () {
    		this.x = Math.ceil(this.x);
    		this.y = Math.ceil(this.y);
    		return this;
    	},

    	// @method trunc(): Point
    	// Returns a copy of the current point with truncated coordinates (rounded towards zero).
    	trunc: function () {
    		return this.clone()._trunc();
    	},

    	_trunc: function () {
    		this.x = trunc(this.x);
    		this.y = trunc(this.y);
    		return this;
    	},

    	// @method distanceTo(otherPoint: Point): Number
    	// Returns the cartesian distance between the current and the given points.
    	distanceTo: function (point) {
    		point = toPoint(point);

    		var x = point.x - this.x,
    		    y = point.y - this.y;

    		return Math.sqrt(x * x + y * y);
    	},

    	// @method equals(otherPoint: Point): Boolean
    	// Returns `true` if the given point has the same coordinates.
    	equals: function (point) {
    		point = toPoint(point);

    		return point.x === this.x &&
    		       point.y === this.y;
    	},

    	// @method contains(otherPoint: Point): Boolean
    	// Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
    	contains: function (point) {
    		point = toPoint(point);

    		return Math.abs(point.x) <= Math.abs(this.x) &&
    		       Math.abs(point.y) <= Math.abs(this.y);
    	},

    	// @method toString(): String
    	// Returns a string representation of the point for debugging purposes.
    	toString: function () {
    		return 'Point(' +
    		        formatNum(this.x) + ', ' +
    		        formatNum(this.y) + ')';
    	}
    };

    // @factory L.point(x: Number, y: Number, round?: Boolean)
    // Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

    // @alternative
    // @factory L.point(coords: Number[])
    // Expects an array of the form `[x, y]` instead.

    // @alternative
    // @factory L.point(coords: Object)
    // Expects a plain object of the form `{x: Number, y: Number}` instead.
    function toPoint(x, y, round) {
    	if (x instanceof Point) {
    		return x;
    	}
    	if (isArray(x)) {
    		return new Point(x[0], x[1]);
    	}
    	if (x === undefined || x === null) {
    		return x;
    	}
    	if (typeof x === 'object' && 'x' in x && 'y' in x) {
    		return new Point(x.x, x.y);
    	}
    	return new Point(x, y, round);
    }

    /*
     * @class Bounds
     * @aka L.Bounds
     *
     * Represents a rectangular area in pixel coordinates.
     *
     * @example
     *
     * ```js
     * var p1 = L.point(10, 10),
     * p2 = L.point(40, 60),
     * bounds = L.bounds(p1, p2);
     * ```
     *
     * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
     *
     * ```js
     * otherBounds.intersects([[10, 10], [40, 60]]);
     * ```
     *
     * Note that `Bounds` does not inherit from Leaflet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function Bounds(a, b) {
    	if (!a) { return; }

    	var points = b ? [a, b] : a;

    	for (var i = 0, len = points.length; i < len; i++) {
    		this.extend(points[i]);
    	}
    }

    Bounds.prototype = {
    	// @method extend(point: Point): this
    	// Extends the bounds to contain the given point.
    	extend: function (point) { // (Point)
    		point = toPoint(point);

    		// @property min: Point
    		// The top left corner of the rectangle.
    		// @property max: Point
    		// The bottom right corner of the rectangle.
    		if (!this.min && !this.max) {
    			this.min = point.clone();
    			this.max = point.clone();
    		} else {
    			this.min.x = Math.min(point.x, this.min.x);
    			this.max.x = Math.max(point.x, this.max.x);
    			this.min.y = Math.min(point.y, this.min.y);
    			this.max.y = Math.max(point.y, this.max.y);
    		}
    		return this;
    	},

    	// @method getCenter(round?: Boolean): Point
    	// Returns the center point of the bounds.
    	getCenter: function (round) {
    		return new Point(
    		        (this.min.x + this.max.x) / 2,
    		        (this.min.y + this.max.y) / 2, round);
    	},

    	// @method getBottomLeft(): Point
    	// Returns the bottom-left point of the bounds.
    	getBottomLeft: function () {
    		return new Point(this.min.x, this.max.y);
    	},

    	// @method getTopRight(): Point
    	// Returns the top-right point of the bounds.
    	getTopRight: function () { // -> Point
    		return new Point(this.max.x, this.min.y);
    	},

    	// @method getTopLeft(): Point
    	// Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
    	getTopLeft: function () {
    		return this.min; // left, top
    	},

    	// @method getBottomRight(): Point
    	// Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
    	getBottomRight: function () {
    		return this.max; // right, bottom
    	},

    	// @method getSize(): Point
    	// Returns the size of the given bounds
    	getSize: function () {
    		return this.max.subtract(this.min);
    	},

    	// @method contains(otherBounds: Bounds): Boolean
    	// Returns `true` if the rectangle contains the given one.
    	// @alternative
    	// @method contains(point: Point): Boolean
    	// Returns `true` if the rectangle contains the given point.
    	contains: function (obj) {
    		var min, max;

    		if (typeof obj[0] === 'number' || obj instanceof Point) {
    			obj = toPoint(obj);
    		} else {
    			obj = toBounds(obj);
    		}

    		if (obj instanceof Bounds) {
    			min = obj.min;
    			max = obj.max;
    		} else {
    			min = max = obj;
    		}

    		return (min.x >= this.min.x) &&
    		       (max.x <= this.max.x) &&
    		       (min.y >= this.min.y) &&
    		       (max.y <= this.max.y);
    	},

    	// @method intersects(otherBounds: Bounds): Boolean
    	// Returns `true` if the rectangle intersects the given bounds. Two bounds
    	// intersect if they have at least one point in common.
    	intersects: function (bounds) { // (Bounds) -> Boolean
    		bounds = toBounds(bounds);

    		var min = this.min,
    		    max = this.max,
    		    min2 = bounds.min,
    		    max2 = bounds.max,
    		    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
    		    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

    		return xIntersects && yIntersects;
    	},

    	// @method overlaps(otherBounds: Bounds): Boolean
    	// Returns `true` if the rectangle overlaps the given bounds. Two bounds
    	// overlap if their intersection is an area.
    	overlaps: function (bounds) { // (Bounds) -> Boolean
    		bounds = toBounds(bounds);

    		var min = this.min,
    		    max = this.max,
    		    min2 = bounds.min,
    		    max2 = bounds.max,
    		    xOverlaps = (max2.x > min.x) && (min2.x < max.x),
    		    yOverlaps = (max2.y > min.y) && (min2.y < max.y);

    		return xOverlaps && yOverlaps;
    	},

    	isValid: function () {
    		return !!(this.min && this.max);
    	}
    };


    // @factory L.bounds(corner1: Point, corner2: Point)
    // Creates a Bounds object from two corners coordinate pairs.
    // @alternative
    // @factory L.bounds(points: Point[])
    // Creates a Bounds object from the given array of points.
    function toBounds(a, b) {
    	if (!a || a instanceof Bounds) {
    		return a;
    	}
    	return new Bounds(a, b);
    }

    /*
     * @class LatLngBounds
     * @aka L.LatLngBounds
     *
     * Represents a rectangular geographical area on a map.
     *
     * @example
     *
     * ```js
     * var corner1 = L.latLng(40.712, -74.227),
     * corner2 = L.latLng(40.774, -74.125),
     * bounds = L.latLngBounds(corner1, corner2);
     * ```
     *
     * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
     *
     * ```js
     * map.fitBounds([
     * 	[40.712, -74.227],
     * 	[40.774, -74.125]
     * ]);
     * ```
     *
     * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
     *
     * Note that `LatLngBounds` does not inherit from Leaflet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function LatLngBounds(corner1, corner2) { // (LatLng, LatLng) or (LatLng[])
    	if (!corner1) { return; }

    	var latlngs = corner2 ? [corner1, corner2] : corner1;

    	for (var i = 0, len = latlngs.length; i < len; i++) {
    		this.extend(latlngs[i]);
    	}
    }

    LatLngBounds.prototype = {

    	// @method extend(latlng: LatLng): this
    	// Extend the bounds to contain the given point

    	// @alternative
    	// @method extend(otherBounds: LatLngBounds): this
    	// Extend the bounds to contain the given bounds
    	extend: function (obj) {
    		var sw = this._southWest,
    		    ne = this._northEast,
    		    sw2, ne2;

    		if (obj instanceof LatLng) {
    			sw2 = obj;
    			ne2 = obj;

    		} else if (obj instanceof LatLngBounds) {
    			sw2 = obj._southWest;
    			ne2 = obj._northEast;

    			if (!sw2 || !ne2) { return this; }

    		} else {
    			return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
    		}

    		if (!sw && !ne) {
    			this._southWest = new LatLng(sw2.lat, sw2.lng);
    			this._northEast = new LatLng(ne2.lat, ne2.lng);
    		} else {
    			sw.lat = Math.min(sw2.lat, sw.lat);
    			sw.lng = Math.min(sw2.lng, sw.lng);
    			ne.lat = Math.max(ne2.lat, ne.lat);
    			ne.lng = Math.max(ne2.lng, ne.lng);
    		}

    		return this;
    	},

    	// @method pad(bufferRatio: Number): LatLngBounds
    	// Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
    	// For example, a ratio of 0.5 extends the bounds by 50% in each direction.
    	// Negative values will retract the bounds.
    	pad: function (bufferRatio) {
    		var sw = this._southWest,
    		    ne = this._northEast,
    		    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
    		    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

    		return new LatLngBounds(
    		        new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
    		        new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
    	},

    	// @method getCenter(): LatLng
    	// Returns the center point of the bounds.
    	getCenter: function () {
    		return new LatLng(
    		        (this._southWest.lat + this._northEast.lat) / 2,
    		        (this._southWest.lng + this._northEast.lng) / 2);
    	},

    	// @method getSouthWest(): LatLng
    	// Returns the south-west point of the bounds.
    	getSouthWest: function () {
    		return this._southWest;
    	},

    	// @method getNorthEast(): LatLng
    	// Returns the north-east point of the bounds.
    	getNorthEast: function () {
    		return this._northEast;
    	},

    	// @method getNorthWest(): LatLng
    	// Returns the north-west point of the bounds.
    	getNorthWest: function () {
    		return new LatLng(this.getNorth(), this.getWest());
    	},

    	// @method getSouthEast(): LatLng
    	// Returns the south-east point of the bounds.
    	getSouthEast: function () {
    		return new LatLng(this.getSouth(), this.getEast());
    	},

    	// @method getWest(): Number
    	// Returns the west longitude of the bounds
    	getWest: function () {
    		return this._southWest.lng;
    	},

    	// @method getSouth(): Number
    	// Returns the south latitude of the bounds
    	getSouth: function () {
    		return this._southWest.lat;
    	},

    	// @method getEast(): Number
    	// Returns the east longitude of the bounds
    	getEast: function () {
    		return this._northEast.lng;
    	},

    	// @method getNorth(): Number
    	// Returns the north latitude of the bounds
    	getNorth: function () {
    		return this._northEast.lat;
    	},

    	// @method contains(otherBounds: LatLngBounds): Boolean
    	// Returns `true` if the rectangle contains the given one.

    	// @alternative
    	// @method contains (latlng: LatLng): Boolean
    	// Returns `true` if the rectangle contains the given point.
    	contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
    		if (typeof obj[0] === 'number' || obj instanceof LatLng || 'lat' in obj) {
    			obj = toLatLng(obj);
    		} else {
    			obj = toLatLngBounds(obj);
    		}

    		var sw = this._southWest,
    		    ne = this._northEast,
    		    sw2, ne2;

    		if (obj instanceof LatLngBounds) {
    			sw2 = obj.getSouthWest();
    			ne2 = obj.getNorthEast();
    		} else {
    			sw2 = ne2 = obj;
    		}

    		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
    		       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
    	},

    	// @method intersects(otherBounds: LatLngBounds): Boolean
    	// Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
    	intersects: function (bounds) {
    		bounds = toLatLngBounds(bounds);

    		var sw = this._southWest,
    		    ne = this._northEast,
    		    sw2 = bounds.getSouthWest(),
    		    ne2 = bounds.getNorthEast(),

    		    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
    		    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

    		return latIntersects && lngIntersects;
    	},

    	// @method overlaps(otherBounds: LatLngBounds): Boolean
    	// Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
    	overlaps: function (bounds) {
    		bounds = toLatLngBounds(bounds);

    		var sw = this._southWest,
    		    ne = this._northEast,
    		    sw2 = bounds.getSouthWest(),
    		    ne2 = bounds.getNorthEast(),

    		    latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
    		    lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

    		return latOverlaps && lngOverlaps;
    	},

    	// @method toBBoxString(): String
    	// Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
    	toBBoxString: function () {
    		return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
    	},

    	// @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
    	// Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
    	equals: function (bounds, maxMargin) {
    		if (!bounds) { return false; }

    		bounds = toLatLngBounds(bounds);

    		return this._southWest.equals(bounds.getSouthWest(), maxMargin) &&
    		       this._northEast.equals(bounds.getNorthEast(), maxMargin);
    	},

    	// @method isValid(): Boolean
    	// Returns `true` if the bounds are properly initialized.
    	isValid: function () {
    		return !!(this._southWest && this._northEast);
    	}
    };

    // TODO International date line?

    // @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
    // Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

    // @alternative
    // @factory L.latLngBounds(latlngs: LatLng[])
    // Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
    function toLatLngBounds(a, b) {
    	if (a instanceof LatLngBounds) {
    		return a;
    	}
    	return new LatLngBounds(a, b);
    }

    /* @class LatLng
     * @aka L.LatLng
     *
     * Represents a geographical point with a certain latitude and longitude.
     *
     * @example
     *
     * ```
     * var latlng = L.latLng(50.5, 30.5);
     * ```
     *
     * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
     *
     * ```
     * map.panTo([50, 30]);
     * map.panTo({lon: 30, lat: 50});
     * map.panTo({lat: 50, lng: 30});
     * map.panTo(L.latLng(50, 30));
     * ```
     *
     * Note that `LatLng` does not inherit from Leaflet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function LatLng(lat, lng, alt) {
    	if (isNaN(lat) || isNaN(lng)) {
    		throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
    	}

    	// @property lat: Number
    	// Latitude in degrees
    	this.lat = +lat;

    	// @property lng: Number
    	// Longitude in degrees
    	this.lng = +lng;

    	// @property alt: Number
    	// Altitude in meters (optional)
    	if (alt !== undefined) {
    		this.alt = +alt;
    	}
    }

    LatLng.prototype = {
    	// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
    	// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
    	equals: function (obj, maxMargin) {
    		if (!obj) { return false; }

    		obj = toLatLng(obj);

    		var margin = Math.max(
    		        Math.abs(this.lat - obj.lat),
    		        Math.abs(this.lng - obj.lng));

    		return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
    	},

    	// @method toString(): String
    	// Returns a string representation of the point (for debugging purposes).
    	toString: function (precision) {
    		return 'LatLng(' +
    		        formatNum(this.lat, precision) + ', ' +
    		        formatNum(this.lng, precision) + ')';
    	},

    	// @method distanceTo(otherLatLng: LatLng): Number
    	// Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
    	distanceTo: function (other) {
    		return Earth.distance(this, toLatLng(other));
    	},

    	// @method wrap(): LatLng
    	// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
    	wrap: function () {
    		return Earth.wrapLatLng(this);
    	},

    	// @method toBounds(sizeInMeters: Number): LatLngBounds
    	// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
    	toBounds: function (sizeInMeters) {
    		var latAccuracy = 180 * sizeInMeters / 40075017,
    		    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

    		return toLatLngBounds(
    		        [this.lat - latAccuracy, this.lng - lngAccuracy],
    		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
    	},

    	clone: function () {
    		return new LatLng(this.lat, this.lng, this.alt);
    	}
    };



    // @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
    // Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

    // @alternative
    // @factory L.latLng(coords: Array): LatLng
    // Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

    // @alternative
    // @factory L.latLng(coords: Object): LatLng
    // Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

    function toLatLng(a, b, c) {
    	if (a instanceof LatLng) {
    		return a;
    	}
    	if (isArray(a) && typeof a[0] !== 'object') {
    		if (a.length === 3) {
    			return new LatLng(a[0], a[1], a[2]);
    		}
    		if (a.length === 2) {
    			return new LatLng(a[0], a[1]);
    		}
    		return null;
    	}
    	if (a === undefined || a === null) {
    		return a;
    	}
    	if (typeof a === 'object' && 'lat' in a) {
    		return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
    	}
    	if (b === undefined) {
    		return null;
    	}
    	return new LatLng(a, b, c);
    }

    /*
     * @namespace CRS
     * @crs L.CRS.Base
     * Object that defines coordinate reference systems for projecting
     * geographical points into pixel (screen) coordinates and back (and to
     * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
     * [spatial reference system](http://en.wikipedia.org/wiki/Coordinate_reference_system).
     *
     * Leaflet defines the most usual CRSs by default. If you want to use a
     * CRS not defined by default, take a look at the
     * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
     *
     * Note that the CRS instances do not inherit from Leaflet's `Class` object,
     * and can't be instantiated. Also, new classes can't inherit from them,
     * and methods can't be added to them with the `include` function.
     */

    var CRS = {
    	// @method latLngToPoint(latlng: LatLng, zoom: Number): Point
    	// Projects geographical coordinates into pixel coordinates for a given zoom.
    	latLngToPoint: function (latlng, zoom) {
    		var projectedPoint = this.projection.project(latlng),
    		    scale = this.scale(zoom);

    		return this.transformation._transform(projectedPoint, scale);
    	},

    	// @method pointToLatLng(point: Point, zoom: Number): LatLng
    	// The inverse of `latLngToPoint`. Projects pixel coordinates on a given
    	// zoom into geographical coordinates.
    	pointToLatLng: function (point, zoom) {
    		var scale = this.scale(zoom),
    		    untransformedPoint = this.transformation.untransform(point, scale);

    		return this.projection.unproject(untransformedPoint);
    	},

    	// @method project(latlng: LatLng): Point
    	// Projects geographical coordinates into coordinates in units accepted for
    	// this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
    	project: function (latlng) {
    		return this.projection.project(latlng);
    	},

    	// @method unproject(point: Point): LatLng
    	// Given a projected coordinate returns the corresponding LatLng.
    	// The inverse of `project`.
    	unproject: function (point) {
    		return this.projection.unproject(point);
    	},

    	// @method scale(zoom: Number): Number
    	// Returns the scale used when transforming projected coordinates into
    	// pixel coordinates for a particular zoom. For example, it returns
    	// `256 * 2^zoom` for Mercator-based CRS.
    	scale: function (zoom) {
    		return 256 * Math.pow(2, zoom);
    	},

    	// @method zoom(scale: Number): Number
    	// Inverse of `scale()`, returns the zoom level corresponding to a scale
    	// factor of `scale`.
    	zoom: function (scale) {
    		return Math.log(scale / 256) / Math.LN2;
    	},

    	// @method getProjectedBounds(zoom: Number): Bounds
    	// Returns the projection's bounds scaled and transformed for the provided `zoom`.
    	getProjectedBounds: function (zoom) {
    		if (this.infinite) { return null; }

    		var b = this.projection.bounds,
    		    s = this.scale(zoom),
    		    min = this.transformation.transform(b.min, s),
    		    max = this.transformation.transform(b.max, s);

    		return new Bounds(min, max);
    	},

    	// @method distance(latlng1: LatLng, latlng2: LatLng): Number
    	// Returns the distance between two geographical coordinates.

    	// @property code: String
    	// Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
    	//
    	// @property wrapLng: Number[]
    	// An array of two numbers defining whether the longitude (horizontal) coordinate
    	// axis wraps around a given range and how. Defaults to `[-180, 180]` in most
    	// geographical CRSs. If `undefined`, the longitude axis does not wrap around.
    	//
    	// @property wrapLat: Number[]
    	// Like `wrapLng`, but for the latitude (vertical) axis.

    	// wrapLng: [min, max],
    	// wrapLat: [min, max],

    	// @property infinite: Boolean
    	// If true, the coordinate space will be unbounded (infinite in both axes)
    	infinite: false,

    	// @method wrapLatLng(latlng: LatLng): LatLng
    	// Returns a `LatLng` where lat and lng has been wrapped according to the
    	// CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
    	wrapLatLng: function (latlng) {
    		var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
    		    lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
    		    alt = latlng.alt;

    		return new LatLng(lat, lng, alt);
    	},

    	// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
    	// Returns a `LatLngBounds` with the same size as the given one, ensuring
    	// that its center is within the CRS's bounds.
    	// Only accepts actual `L.LatLngBounds` instances, not arrays.
    	wrapLatLngBounds: function (bounds) {
    		var center = bounds.getCenter(),
    		    newCenter = this.wrapLatLng(center),
    		    latShift = center.lat - newCenter.lat,
    		    lngShift = center.lng - newCenter.lng;

    		if (latShift === 0 && lngShift === 0) {
    			return bounds;
    		}

    		var sw = bounds.getSouthWest(),
    		    ne = bounds.getNorthEast(),
    		    newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
    		    newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

    		return new LatLngBounds(newSw, newNe);
    	}
    };

    /*
     * @namespace CRS
     * @crs L.CRS.Earth
     *
     * Serves as the base for CRS that are global such that they cover the earth.
     * Can only be used as the base for other CRS and cannot be used directly,
     * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
     * meters.
     */

    var Earth = extend({}, CRS, {
    	wrapLng: [-180, 180],

    	// Mean Earth Radius, as recommended for use by
    	// the International Union of Geodesy and Geophysics,
    	// see http://rosettacode.org/wiki/Haversine_formula
    	R: 6371000,

    	// distance between two geographical points using spherical law of cosines approximation
    	distance: function (latlng1, latlng2) {
    		var rad = Math.PI / 180,
    		    lat1 = latlng1.lat * rad,
    		    lat2 = latlng2.lat * rad,
    		    sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2),
    		    sinDLon = Math.sin((latlng2.lng - latlng1.lng) * rad / 2),
    		    a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
    		    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    		return this.R * c;
    	}
    });

    /*
     * @namespace Projection
     * @projection L.Projection.SphericalMercator
     *
     * Spherical Mercator projection — the most common projection for online maps,
     * used by almost all free and commercial tile providers. Assumes that Earth is
     * a sphere. Used by the `EPSG:3857` CRS.
     */

    var earthRadius = 6378137;

    var SphericalMercator = {

    	R: earthRadius,
    	MAX_LATITUDE: 85.0511287798,

    	project: function (latlng) {
    		var d = Math.PI / 180,
    		    max = this.MAX_LATITUDE,
    		    lat = Math.max(Math.min(max, latlng.lat), -max),
    		    sin = Math.sin(lat * d);

    		return new Point(
    			this.R * latlng.lng * d,
    			this.R * Math.log((1 + sin) / (1 - sin)) / 2);
    	},

    	unproject: function (point) {
    		var d = 180 / Math.PI;

    		return new LatLng(
    			(2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
    			point.x * d / this.R);
    	},

    	bounds: (function () {
    		var d = earthRadius * Math.PI;
    		return new Bounds([-d, -d], [d, d]);
    	})()
    };

    /*
     * @class Transformation
     * @aka L.Transformation
     *
     * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
     * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
     * the reverse. Used by Leaflet in its projections code.
     *
     * @example
     *
     * ```js
     * var transformation = L.transformation(2, 5, -1, 10),
     * 	p = L.point(1, 2),
     * 	p2 = transformation.transform(p), //  L.point(7, 8)
     * 	p3 = transformation.untransform(p2); //  L.point(1, 2)
     * ```
     */


    // factory new L.Transformation(a: Number, b: Number, c: Number, d: Number)
    // Creates a `Transformation` object with the given coefficients.
    function Transformation(a, b, c, d) {
    	if (isArray(a)) {
    		// use array properties
    		this._a = a[0];
    		this._b = a[1];
    		this._c = a[2];
    		this._d = a[3];
    		return;
    	}
    	this._a = a;
    	this._b = b;
    	this._c = c;
    	this._d = d;
    }

    Transformation.prototype = {
    	// @method transform(point: Point, scale?: Number): Point
    	// Returns a transformed point, optionally multiplied by the given scale.
    	// Only accepts actual `L.Point` instances, not arrays.
    	transform: function (point, scale) { // (Point, Number) -> Point
    		return this._transform(point.clone(), scale);
    	},

    	// destructive transform (faster)
    	_transform: function (point, scale) {
    		scale = scale || 1;
    		point.x = scale * (this._a * point.x + this._b);
    		point.y = scale * (this._c * point.y + this._d);
    		return point;
    	},

    	// @method untransform(point: Point, scale?: Number): Point
    	// Returns the reverse transformation of the given point, optionally divided
    	// by the given scale. Only accepts actual `L.Point` instances, not arrays.
    	untransform: function (point, scale) {
    		scale = scale || 1;
    		return new Point(
    		        (point.x / scale - this._b) / this._a,
    		        (point.y / scale - this._d) / this._c);
    	}
    };

    // factory L.transformation(a: Number, b: Number, c: Number, d: Number)

    // @factory L.transformation(a: Number, b: Number, c: Number, d: Number)
    // Instantiates a Transformation object with the given coefficients.

    // @alternative
    // @factory L.transformation(coefficients: Array): Transformation
    // Expects an coefficients array of the form
    // `[a: Number, b: Number, c: Number, d: Number]`.

    function toTransformation(a, b, c, d) {
    	return new Transformation(a, b, c, d);
    }

    /*
     * @namespace CRS
     * @crs L.CRS.EPSG3857
     *
     * The most common CRS for online maps, used by almost all free and commercial
     * tile providers. Uses Spherical Mercator projection. Set in by default in
     * Map's `crs` option.
     */

    var EPSG3857 = extend({}, Earth, {
    	code: 'EPSG:3857',
    	projection: SphericalMercator,

    	transformation: (function () {
    		var scale = 0.5 / (Math.PI * SphericalMercator.R);
    		return toTransformation(scale, 0.5, -scale, 0.5);
    	}())
    });

    var EPSG900913 = extend({}, EPSG3857, {
    	code: 'EPSG:900913'
    });

    // @namespace SVG; @section
    // There are several static functions which can be called without instantiating L.SVG:

    // @function create(name: String): SVGElement
    // Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
    // corresponding to the class name passed. For example, using 'line' will return
    // an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
    function svgCreate(name) {
    	return document.createElementNS('http://www.w3.org/2000/svg', name);
    }

    // @function pointsToPath(rings: Point[], closed: Boolean): String
    // Generates a SVG path string for multiple rings, with each ring turning
    // into "M..L..L.." instructions
    function pointsToPath(rings, closed) {
    	var str = '',
    	i, j, len, len2, points, p;

    	for (i = 0, len = rings.length; i < len; i++) {
    		points = rings[i];

    		for (j = 0, len2 = points.length; j < len2; j++) {
    			p = points[j];
    			str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
    		}

    		// closes the ring for polygons; "x" is VML syntax
    		str += closed ? (svg ? 'z' : 'x') : '';
    	}

    	// SVG complains about empty path strings
    	return str || 'M0 0';
    }

    /*
     * @namespace Browser
     * @aka L.Browser
     *
     * A namespace with static properties for browser/feature detection used by Leaflet internally.
     *
     * @example
     *
     * ```js
     * if (L.Browser.ielt9) {
     *   alert('Upgrade your browser, dude!');
     * }
     * ```
     */

    var style$1 = document.documentElement.style;

    // @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
    var ie = 'ActiveXObject' in window;

    // @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
    var ielt9 = ie && !document.addEventListener;

    // @property edge: Boolean; `true` for the Edge web browser.
    var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

    // @property webkit: Boolean;
    // `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
    var webkit = userAgentContains('webkit');

    // @property android: Boolean
    // `true` for any browser running on an Android platform.
    var android = userAgentContains('android');

    // @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
    var android23 = userAgentContains('android 2') || userAgentContains('android 3');

    /* See https://stackoverflow.com/a/17961266 for details on detecting stock Android */
    var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10); // also matches AppleWebKit
    // @property androidStock: Boolean; `true` for the Android stock browser (i.e. not Chrome)
    var androidStock = android && userAgentContains('Google') && webkitVer < 537 && !('AudioNode' in window);

    // @property opera: Boolean; `true` for the Opera browser
    var opera = !!window.opera;

    // @property chrome: Boolean; `true` for the Chrome browser.
    var chrome = !edge && userAgentContains('chrome');

    // @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
    var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

    // @property safari: Boolean; `true` for the Safari browser.
    var safari = !chrome && userAgentContains('safari');

    var phantom = userAgentContains('phantom');

    // @property opera12: Boolean
    // `true` for the Opera browser supporting CSS transforms (version 12 or later).
    var opera12 = 'OTransition' in style$1;

    // @property win: Boolean; `true` when the browser is running in a Windows platform
    var win = navigator.platform.indexOf('Win') === 0;

    // @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
    var ie3d = ie && ('transition' in style$1);

    // @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
    var webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23;

    // @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
    var gecko3d = 'MozPerspective' in style$1;

    // @property any3d: Boolean
    // `true` for all browsers supporting CSS transforms.
    var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

    // @property mobile: Boolean; `true` for all browsers running in a mobile device.
    var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

    // @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
    var mobileWebkit = mobile && webkit;

    // @property mobileWebkit3d: Boolean
    // `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
    var mobileWebkit3d = mobile && webkit3d;

    // @property msPointer: Boolean
    // `true` for browsers implementing the Microsoft touch events model (notably IE10).
    var msPointer = !window.PointerEvent && window.MSPointerEvent;

    // @property pointer: Boolean
    // `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
    var pointer = !!(window.PointerEvent || msPointer);

    // @property touch: Boolean
    // `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
    // This does not necessarily mean that the browser is running in a computer with
    // a touchscreen, it only means that the browser is capable of understanding
    // touch events.
    var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window ||
    		(window.DocumentTouch && document instanceof window.DocumentTouch));

    // @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
    var mobileOpera = mobile && opera;

    // @property mobileGecko: Boolean
    // `true` for gecko-based browsers running in a mobile device.
    var mobileGecko = mobile && gecko;

    // @property retina: Boolean
    // `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
    var retina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;

    // @property passiveEvents: Boolean
    // `true` for browsers that support passive events.
    var passiveEvents = (function () {
    	var supportsPassiveOption = false;
    	try {
    		var opts = Object.defineProperty({}, 'passive', {
    			get: function () { // eslint-disable-line getter-return
    				supportsPassiveOption = true;
    			}
    		});
    		window.addEventListener('testPassiveEventSupport', falseFn, opts);
    		window.removeEventListener('testPassiveEventSupport', falseFn, opts);
    	} catch (e) {
    		// Errors can safely be ignored since this is only a browser support test.
    	}
    	return supportsPassiveOption;
    }());

    // @property canvas: Boolean
    // `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
    var canvas = (function () {
    	return !!document.createElement('canvas').getContext;
    }());

    // @property svg: Boolean
    // `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
    var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

    // @property vml: Boolean
    // `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
    var vml = !svg && (function () {
    	try {
    		var div = document.createElement('div');
    		div.innerHTML = '<v:shape adj="1"/>';

    		var shape = div.firstChild;
    		shape.style.behavior = 'url(#default#VML)';

    		return shape && (typeof shape.adj === 'object');

    	} catch (e) {
    		return false;
    	}
    }());


    function userAgentContains(str) {
    	return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
    }

    var Browser = ({
      ie: ie,
      ielt9: ielt9,
      edge: edge,
      webkit: webkit,
      android: android,
      android23: android23,
      androidStock: androidStock,
      opera: opera,
      chrome: chrome,
      gecko: gecko,
      safari: safari,
      phantom: phantom,
      opera12: opera12,
      win: win,
      ie3d: ie3d,
      webkit3d: webkit3d,
      gecko3d: gecko3d,
      any3d: any3d,
      mobile: mobile,
      mobileWebkit: mobileWebkit,
      mobileWebkit3d: mobileWebkit3d,
      msPointer: msPointer,
      pointer: pointer,
      touch: touch,
      mobileOpera: mobileOpera,
      mobileGecko: mobileGecko,
      retina: retina,
      passiveEvents: passiveEvents,
      canvas: canvas,
      svg: svg,
      vml: vml
    });

    /*
     * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
     */


    var POINTER_DOWN =   msPointer ? 'MSPointerDown'   : 'pointerdown';
    var POINTER_MOVE =   msPointer ? 'MSPointerMove'   : 'pointermove';
    var POINTER_UP =     msPointer ? 'MSPointerUp'     : 'pointerup';
    var POINTER_CANCEL = msPointer ? 'MSPointerCancel' : 'pointercancel';

    var _pointers = {};
    var _pointerDocListener = false;

    // Provides a touch events wrapper for (ms)pointer events.
    // ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

    function addPointerListener(obj, type, handler, id) {
    	if (type === 'touchstart') {
    		_addPointerStart(obj, handler, id);

    	} else if (type === 'touchmove') {
    		_addPointerMove(obj, handler, id);

    	} else if (type === 'touchend') {
    		_addPointerEnd(obj, handler, id);
    	}

    	return this;
    }

    function removePointerListener(obj, type, id) {
    	var handler = obj['_leaflet_' + type + id];

    	if (type === 'touchstart') {
    		obj.removeEventListener(POINTER_DOWN, handler, false);

    	} else if (type === 'touchmove') {
    		obj.removeEventListener(POINTER_MOVE, handler, false);

    	} else if (type === 'touchend') {
    		obj.removeEventListener(POINTER_UP, handler, false);
    		obj.removeEventListener(POINTER_CANCEL, handler, false);
    	}

    	return this;
    }

    function _addPointerStart(obj, handler, id) {
    	var onDown = bind(function (e) {
    		// IE10 specific: MsTouch needs preventDefault. See #2000
    		if (e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH) {
    			preventDefault(e);
    		}

    		_handlePointer(e, handler);
    	});

    	obj['_leaflet_touchstart' + id] = onDown;
    	obj.addEventListener(POINTER_DOWN, onDown, false);

    	// need to keep track of what pointers and how many are active to provide e.touches emulation
    	if (!_pointerDocListener) {
    		// we listen document as any drags that end by moving the touch off the screen get fired there
    		document.addEventListener(POINTER_DOWN, _globalPointerDown, true);
    		document.addEventListener(POINTER_MOVE, _globalPointerMove, true);
    		document.addEventListener(POINTER_UP, _globalPointerUp, true);
    		document.addEventListener(POINTER_CANCEL, _globalPointerUp, true);

    		_pointerDocListener = true;
    	}
    }

    function _globalPointerDown(e) {
    	_pointers[e.pointerId] = e;
    }

    function _globalPointerMove(e) {
    	if (_pointers[e.pointerId]) {
    		_pointers[e.pointerId] = e;
    	}
    }

    function _globalPointerUp(e) {
    	delete _pointers[e.pointerId];
    }

    function _handlePointer(e, handler) {
    	e.touches = [];
    	for (var i in _pointers) {
    		e.touches.push(_pointers[i]);
    	}
    	e.changedTouches = [e];

    	handler(e);
    }

    function _addPointerMove(obj, handler, id) {
    	var onMove = function (e) {
    		// don't fire touch moves when mouse isn't down
    		if ((e.pointerType === (e.MSPOINTER_TYPE_MOUSE || 'mouse')) && e.buttons === 0) {
    			return;
    		}

    		_handlePointer(e, handler);
    	};

    	obj['_leaflet_touchmove' + id] = onMove;
    	obj.addEventListener(POINTER_MOVE, onMove, false);
    }

    function _addPointerEnd(obj, handler, id) {
    	var onUp = function (e) {
    		_handlePointer(e, handler);
    	};

    	obj['_leaflet_touchend' + id] = onUp;
    	obj.addEventListener(POINTER_UP, onUp, false);
    	obj.addEventListener(POINTER_CANCEL, onUp, false);
    }

    /*
     * Extends the event handling code with double tap support for mobile browsers.
     */

    var _touchstart = msPointer ? 'MSPointerDown' : pointer ? 'pointerdown' : 'touchstart';
    var _touchend = msPointer ? 'MSPointerUp' : pointer ? 'pointerup' : 'touchend';
    var _pre = '_leaflet_';

    // inspired by Zepto touch code by Thomas Fuchs
    function addDoubleTapListener(obj, handler, id) {
    	var last, touch$$1,
    	    doubleTap = false,
    	    delay = 250;

    	function onTouchStart(e) {

    		if (pointer) {
    			if (!e.isPrimary) { return; }
    			if (e.pointerType === 'mouse') { return; } // mouse fires native dblclick
    		} else if (e.touches.length > 1) {
    			return;
    		}

    		var now = Date.now(),
    		    delta = now - (last || now);

    		touch$$1 = e.touches ? e.touches[0] : e;
    		doubleTap = (delta > 0 && delta <= delay);
    		last = now;
    	}

    	function onTouchEnd(e) {
    		if (doubleTap && !touch$$1.cancelBubble) {
    			if (pointer) {
    				if (e.pointerType === 'mouse') { return; }
    				// work around .type being readonly with MSPointer* events
    				var newTouch = {},
    				    prop, i;

    				for (i in touch$$1) {
    					prop = touch$$1[i];
    					newTouch[i] = prop && prop.bind ? prop.bind(touch$$1) : prop;
    				}
    				touch$$1 = newTouch;
    			}
    			touch$$1.type = 'dblclick';
    			touch$$1.button = 0;
    			handler(touch$$1);
    			last = null;
    		}
    	}

    	obj[_pre + _touchstart + id] = onTouchStart;
    	obj[_pre + _touchend + id] = onTouchEnd;
    	obj[_pre + 'dblclick' + id] = handler;

    	obj.addEventListener(_touchstart, onTouchStart, passiveEvents ? {passive: false} : false);
    	obj.addEventListener(_touchend, onTouchEnd, passiveEvents ? {passive: false} : false);

    	// On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
    	// the browser doesn't fire touchend/pointerup events but does fire
    	// native dblclicks. See #4127.
    	// Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
    	obj.addEventListener('dblclick', handler, false);

    	return this;
    }

    function removeDoubleTapListener(obj, id) {
    	var touchstart = obj[_pre + _touchstart + id],
    	    touchend = obj[_pre + _touchend + id],
    	    dblclick = obj[_pre + 'dblclick' + id];

    	obj.removeEventListener(_touchstart, touchstart, passiveEvents ? {passive: false} : false);
    	obj.removeEventListener(_touchend, touchend, passiveEvents ? {passive: false} : false);
    	obj.removeEventListener('dblclick', dblclick, false);

    	return this;
    }

    /*
     * @namespace DomUtil
     *
     * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
     * tree, used by Leaflet internally.
     *
     * Most functions expecting or returning a `HTMLElement` also work for
     * SVG elements. The only difference is that classes refer to CSS classes
     * in HTML and SVG classes in SVG.
     */


    // @property TRANSFORM: String
    // Vendor-prefixed transform style name (e.g. `'webkitTransform'` for WebKit).
    var TRANSFORM = testProp(
    	['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

    // webkitTransition comes first because some browser versions that drop vendor prefix don't do
    // the same for the transitionend event, in particular the Android 4.1 stock browser

    // @property TRANSITION: String
    // Vendor-prefixed transition style name.
    var TRANSITION = testProp(
    	['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

    // @property TRANSITION_END: String
    // Vendor-prefixed transitionend event name.
    var TRANSITION_END =
    	TRANSITION === 'webkitTransition' || TRANSITION === 'OTransition' ? TRANSITION + 'End' : 'transitionend';


    // @function get(id: String|HTMLElement): HTMLElement
    // Returns an element given its DOM id, or returns the element itself
    // if it was passed directly.
    function get(id) {
    	return typeof id === 'string' ? document.getElementById(id) : id;
    }

    // @function getStyle(el: HTMLElement, styleAttrib: String): String
    // Returns the value for a certain style attribute on an element,
    // including computed values or values set through CSS.
    function getStyle(el, style) {
    	var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

    	if ((!value || value === 'auto') && document.defaultView) {
    		var css = document.defaultView.getComputedStyle(el, null);
    		value = css ? css[style] : null;
    	}
    	return value === 'auto' ? null : value;
    }

    // @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
    // Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
    function create$1(tagName, className, container) {
    	var el = document.createElement(tagName);
    	el.className = className || '';

    	if (container) {
    		container.appendChild(el);
    	}
    	return el;
    }

    // @function remove(el: HTMLElement)
    // Removes `el` from its parent element
    function remove(el) {
    	var parent = el.parentNode;
    	if (parent) {
    		parent.removeChild(el);
    	}
    }

    // @function empty(el: HTMLElement)
    // Removes all of `el`'s children elements from `el`
    function empty(el) {
    	while (el.firstChild) {
    		el.removeChild(el.firstChild);
    	}
    }

    // @function toFront(el: HTMLElement)
    // Makes `el` the last child of its parent, so it renders in front of the other children.
    function toFront(el) {
    	var parent = el.parentNode;
    	if (parent && parent.lastChild !== el) {
    		parent.appendChild(el);
    	}
    }

    // @function toBack(el: HTMLElement)
    // Makes `el` the first child of its parent, so it renders behind the other children.
    function toBack(el) {
    	var parent = el.parentNode;
    	if (parent && parent.firstChild !== el) {
    		parent.insertBefore(el, parent.firstChild);
    	}
    }

    // @function hasClass(el: HTMLElement, name: String): Boolean
    // Returns `true` if the element's class attribute contains `name`.
    function hasClass(el, name) {
    	if (el.classList !== undefined) {
    		return el.classList.contains(name);
    	}
    	var className = getClass(el);
    	return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
    }

    // @function addClass(el: HTMLElement, name: String)
    // Adds `name` to the element's class attribute.
    function addClass(el, name) {
    	if (el.classList !== undefined) {
    		var classes = splitWords(name);
    		for (var i = 0, len = classes.length; i < len; i++) {
    			el.classList.add(classes[i]);
    		}
    	} else if (!hasClass(el, name)) {
    		var className = getClass(el);
    		setClass(el, (className ? className + ' ' : '') + name);
    	}
    }

    // @function removeClass(el: HTMLElement, name: String)
    // Removes `name` from the element's class attribute.
    function removeClass(el, name) {
    	if (el.classList !== undefined) {
    		el.classList.remove(name);
    	} else {
    		setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
    	}
    }

    // @function setClass(el: HTMLElement, name: String)
    // Sets the element's class.
    function setClass(el, name) {
    	if (el.className.baseVal === undefined) {
    		el.className = name;
    	} else {
    		// in case of SVG element
    		el.className.baseVal = name;
    	}
    }

    // @function getClass(el: HTMLElement): String
    // Returns the element's class.
    function getClass(el) {
    	// Check if the element is an SVGElementInstance and use the correspondingElement instead
    	// (Required for linked SVG elements in IE11.)
    	if (el.correspondingElement) {
    		el = el.correspondingElement;
    	}
    	return el.className.baseVal === undefined ? el.className : el.className.baseVal;
    }

    // @function setOpacity(el: HTMLElement, opacity: Number)
    // Set the opacity of an element (including old IE support).
    // `opacity` must be a number from `0` to `1`.
    function setOpacity(el, value) {
    	if ('opacity' in el.style) {
    		el.style.opacity = value;
    	} else if ('filter' in el.style) {
    		_setOpacityIE(el, value);
    	}
    }

    function _setOpacityIE(el, value) {
    	var filter = false,
    	    filterName = 'DXImageTransform.Microsoft.Alpha';

    	// filters collection throws an error if we try to retrieve a filter that doesn't exist
    	try {
    		filter = el.filters.item(filterName);
    	} catch (e) {
    		// don't set opacity to 1 if we haven't already set an opacity,
    		// it isn't needed and breaks transparent pngs.
    		if (value === 1) { return; }
    	}

    	value = Math.round(value * 100);

    	if (filter) {
    		filter.Enabled = (value !== 100);
    		filter.Opacity = value;
    	} else {
    		el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
    	}
    }

    // @function testProp(props: String[]): String|false
    // Goes through the array of style names and returns the first name
    // that is a valid style name for an element. If no such name is found,
    // it returns false. Useful for vendor-prefixed styles like `transform`.
    function testProp(props) {
    	var style = document.documentElement.style;

    	for (var i = 0; i < props.length; i++) {
    		if (props[i] in style) {
    			return props[i];
    		}
    	}
    	return false;
    }

    // @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
    // Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
    // and optionally scaled by `scale`. Does not have an effect if the
    // browser doesn't support 3D CSS transforms.
    function setTransform(el, offset, scale) {
    	var pos = offset || new Point(0, 0);

    	el.style[TRANSFORM] =
    		(ie3d ?
    			'translate(' + pos.x + 'px,' + pos.y + 'px)' :
    			'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
    		(scale ? ' scale(' + scale + ')' : '');
    }

    // @function setPosition(el: HTMLElement, position: Point)
    // Sets the position of `el` to coordinates specified by `position`,
    // using CSS translate or top/left positioning depending on the browser
    // (used by Leaflet internally to position its layers).
    function setPosition(el, point) {

    	/*eslint-disable */
    	el._leaflet_pos = point;
    	/* eslint-enable */

    	if (any3d) {
    		setTransform(el, point);
    	} else {
    		el.style.left = point.x + 'px';
    		el.style.top = point.y + 'px';
    	}
    }

    // @function getPosition(el: HTMLElement): Point
    // Returns the coordinates of an element previously positioned with setPosition.
    function getPosition(el) {
    	// this method is only used for elements previously positioned using setPosition,
    	// so it's safe to cache the position for performance

    	return el._leaflet_pos || new Point(0, 0);
    }

    // @function disableTextSelection()
    // Prevents the user from generating `selectstart` DOM events, usually generated
    // when the user drags the mouse through a page with text. Used internally
    // by Leaflet to override the behaviour of any click-and-drag interaction on
    // the map. Affects drag interactions on the whole document.

    // @function enableTextSelection()
    // Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
    var disableTextSelection;
    var enableTextSelection;
    var _userSelect;
    if ('onselectstart' in document) {
    	disableTextSelection = function () {
    		on(window, 'selectstart', preventDefault);
    	};
    	enableTextSelection = function () {
    		off(window, 'selectstart', preventDefault);
    	};
    } else {
    	var userSelectProperty = testProp(
    		['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

    	disableTextSelection = function () {
    		if (userSelectProperty) {
    			var style = document.documentElement.style;
    			_userSelect = style[userSelectProperty];
    			style[userSelectProperty] = 'none';
    		}
    	};
    	enableTextSelection = function () {
    		if (userSelectProperty) {
    			document.documentElement.style[userSelectProperty] = _userSelect;
    			_userSelect = undefined;
    		}
    	};
    }

    // @function disableImageDrag()
    // As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
    // for `dragstart` DOM events, usually generated when the user drags an image.
    function disableImageDrag() {
    	on(window, 'dragstart', preventDefault);
    }

    // @function enableImageDrag()
    // Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
    function enableImageDrag() {
    	off(window, 'dragstart', preventDefault);
    }

    var _outlineElement, _outlineStyle;
    // @function preventOutline(el: HTMLElement)
    // Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
    // of the element `el` invisible. Used internally by Leaflet to prevent
    // focusable elements from displaying an outline when the user performs a
    // drag interaction on them.
    function preventOutline(element) {
    	while (element.tabIndex === -1) {
    		element = element.parentNode;
    	}
    	if (!element.style) { return; }
    	restoreOutline();
    	_outlineElement = element;
    	_outlineStyle = element.style.outline;
    	element.style.outline = 'none';
    	on(window, 'keydown', restoreOutline);
    }

    // @function restoreOutline()
    // Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
    function restoreOutline() {
    	if (!_outlineElement) { return; }
    	_outlineElement.style.outline = _outlineStyle;
    	_outlineElement = undefined;
    	_outlineStyle = undefined;
    	off(window, 'keydown', restoreOutline);
    }

    // @function getSizedParentNode(el: HTMLElement): HTMLElement
    // Finds the closest parent node which size (width and height) is not null.
    function getSizedParentNode(element) {
    	do {
    		element = element.parentNode;
    	} while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
    	return element;
    }

    // @function getScale(el: HTMLElement): Object
    // Computes the CSS scale currently applied on the element.
    // Returns an object with `x` and `y` members as horizontal and vertical scales respectively,
    // and `boundingClientRect` as the result of [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
    function getScale(element) {
    	var rect = element.getBoundingClientRect(); // Read-only in old browsers.

    	return {
    		x: rect.width / element.offsetWidth || 1,
    		y: rect.height / element.offsetHeight || 1,
    		boundingClientRect: rect
    	};
    }

    var DomUtil = ({
      TRANSFORM: TRANSFORM,
      TRANSITION: TRANSITION,
      TRANSITION_END: TRANSITION_END,
      get: get,
      getStyle: getStyle,
      create: create$1,
      remove: remove,
      empty: empty,
      toFront: toFront,
      toBack: toBack,
      hasClass: hasClass,
      addClass: addClass,
      removeClass: removeClass,
      setClass: setClass,
      getClass: getClass,
      setOpacity: setOpacity,
      testProp: testProp,
      setTransform: setTransform,
      setPosition: setPosition,
      getPosition: getPosition,
      disableTextSelection: disableTextSelection,
      enableTextSelection: enableTextSelection,
      disableImageDrag: disableImageDrag,
      enableImageDrag: enableImageDrag,
      preventOutline: preventOutline,
      restoreOutline: restoreOutline,
      getSizedParentNode: getSizedParentNode,
      getScale: getScale
    });

    /*
     * @namespace DomEvent
     * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
     */

    // Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

    // @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
    // Adds a listener function (`fn`) to a particular DOM event type of the
    // element `el`. You can optionally specify the context of the listener
    // (object the `this` keyword will point to). You can also pass several
    // space-separated types (e.g. `'click dblclick'`).

    // @alternative
    // @function on(el: HTMLElement, eventMap: Object, context?: Object): this
    // Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
    function on(obj, types, fn, context) {

    	if (typeof types === 'object') {
    		for (var type in types) {
    			addOne(obj, type, types[type], fn);
    		}
    	} else {
    		types = splitWords(types);

    		for (var i = 0, len = types.length; i < len; i++) {
    			addOne(obj, types[i], fn, context);
    		}
    	}

    	return this;
    }

    var eventsKey = '_leaflet_events';

    // @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
    // Removes a previously added listener function.
    // Note that if you passed a custom context to on, you must pass the same
    // context to `off` in order to remove the listener.

    // @alternative
    // @function off(el: HTMLElement, eventMap: Object, context?: Object): this
    // Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
    function off(obj, types, fn, context) {

    	if (typeof types === 'object') {
    		for (var type in types) {
    			removeOne(obj, type, types[type], fn);
    		}
    	} else if (types) {
    		types = splitWords(types);

    		for (var i = 0, len = types.length; i < len; i++) {
    			removeOne(obj, types[i], fn, context);
    		}
    	} else {
    		for (var j in obj[eventsKey]) {
    			removeOne(obj, j, obj[eventsKey][j]);
    		}
    		delete obj[eventsKey];
    	}

    	return this;
    }

    function browserFiresNativeDblClick() {
    	// See https://github.com/w3c/pointerevents/issues/171
    	if (pointer) {
    		return !(edge || safari);
    	}
    }

    var mouseSubst = {
    	mouseenter: 'mouseover',
    	mouseleave: 'mouseout',
    	wheel: !('onwheel' in window) && 'mousewheel'
    };

    function addOne(obj, type, fn, context) {
    	var id = type + stamp(fn) + (context ? '_' + stamp(context) : '');

    	if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

    	var handler = function (e) {
    		return fn.call(context || obj, e || window.event);
    	};

    	var originalHandler = handler;

    	if (pointer && type.indexOf('touch') === 0) {
    		// Needs DomEvent.Pointer.js
    		addPointerListener(obj, type, handler, id);

    	} else if (touch && (type === 'dblclick') && !browserFiresNativeDblClick()) {
    		addDoubleTapListener(obj, handler, id);

    	} else if ('addEventListener' in obj) {

    		if (type === 'touchstart' || type === 'touchmove' || type === 'wheel' ||  type === 'mousewheel') {
    			obj.addEventListener(mouseSubst[type] || type, handler, passiveEvents ? {passive: false} : false);

    		} else if (type === 'mouseenter' || type === 'mouseleave') {
    			handler = function (e) {
    				e = e || window.event;
    				if (isExternalTarget(obj, e)) {
    					originalHandler(e);
    				}
    			};
    			obj.addEventListener(mouseSubst[type], handler, false);

    		} else {
    			obj.addEventListener(type, originalHandler, false);
    		}

    	} else if ('attachEvent' in obj) {
    		obj.attachEvent('on' + type, handler);
    	}

    	obj[eventsKey] = obj[eventsKey] || {};
    	obj[eventsKey][id] = handler;
    }

    function removeOne(obj, type, fn, context) {

    	var id = type + stamp(fn) + (context ? '_' + stamp(context) : ''),
    	    handler = obj[eventsKey] && obj[eventsKey][id];

    	if (!handler) { return this; }

    	if (pointer && type.indexOf('touch') === 0) {
    		removePointerListener(obj, type, id);

    	} else if (touch && (type === 'dblclick') && !browserFiresNativeDblClick()) {
    		removeDoubleTapListener(obj, id);

    	} else if ('removeEventListener' in obj) {

    		obj.removeEventListener(mouseSubst[type] || type, handler, false);

    	} else if ('detachEvent' in obj) {
    		obj.detachEvent('on' + type, handler);
    	}

    	obj[eventsKey][id] = null;
    }

    // @function stopPropagation(ev: DOMEvent): this
    // Stop the given event from propagation to parent elements. Used inside the listener functions:
    // ```js
    // L.DomEvent.on(div, 'click', function (ev) {
    // 	L.DomEvent.stopPropagation(ev);
    // });
    // ```
    function stopPropagation(e) {

    	if (e.stopPropagation) {
    		e.stopPropagation();
    	} else if (e.originalEvent) {  // In case of Leaflet event.
    		e.originalEvent._stopped = true;
    	} else {
    		e.cancelBubble = true;
    	}
    	skipped(e);

    	return this;
    }

    // @function disableScrollPropagation(el: HTMLElement): this
    // Adds `stopPropagation` to the element's `'wheel'` events (plus browser variants).
    function disableScrollPropagation(el) {
    	addOne(el, 'wheel', stopPropagation);
    	return this;
    }

    // @function disableClickPropagation(el: HTMLElement): this
    // Adds `stopPropagation` to the element's `'click'`, `'doubleclick'`,
    // `'mousedown'` and `'touchstart'` events (plus browser variants).
    function disableClickPropagation(el) {
    	on(el, 'mousedown touchstart dblclick', stopPropagation);
    	addOne(el, 'click', fakeStop);
    	return this;
    }

    // @function preventDefault(ev: DOMEvent): this
    // Prevents the default action of the DOM Event `ev` from happening (such as
    // following a link in the href of the a element, or doing a POST request
    // with page reload when a `<form>` is submitted).
    // Use it inside listener functions.
    function preventDefault(e) {
    	if (e.preventDefault) {
    		e.preventDefault();
    	} else {
    		e.returnValue = false;
    	}
    	return this;
    }

    // @function stop(ev: DOMEvent): this
    // Does `stopPropagation` and `preventDefault` at the same time.
    function stop(e) {
    	preventDefault(e);
    	stopPropagation(e);
    	return this;
    }

    // @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
    // Gets normalized mouse position from a DOM event relative to the
    // `container` (border excluded) or to the whole page if not specified.
    function getMousePosition(e, container) {
    	if (!container) {
    		return new Point(e.clientX, e.clientY);
    	}

    	var scale = getScale(container),
    	    offset = scale.boundingClientRect; // left and top  values are in page scale (like the event clientX/Y)

    	return new Point(
    		// offset.left/top values are in page scale (like clientX/Y),
    		// whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
    		(e.clientX - offset.left) / scale.x - container.clientLeft,
    		(e.clientY - offset.top) / scale.y - container.clientTop
    	);
    }

    // Chrome on Win scrolls double the pixels as in other platforms (see #4538),
    // and Firefox scrolls device pixels, not CSS pixels
    var wheelPxFactor =
    	(win && chrome) ? 2 * window.devicePixelRatio :
    	gecko ? window.devicePixelRatio : 1;

    // @function getWheelDelta(ev: DOMEvent): Number
    // Gets normalized wheel delta from a wheel DOM event, in vertical
    // pixels scrolled (negative if scrolling down).
    // Events from pointing devices without precise scrolling are mapped to
    // a best guess of 60 pixels.
    function getWheelDelta(e) {
    	return (edge) ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
    	       (e.deltaY && e.deltaMode === 0) ? -e.deltaY / wheelPxFactor : // Pixels
    	       (e.deltaY && e.deltaMode === 1) ? -e.deltaY * 20 : // Lines
    	       (e.deltaY && e.deltaMode === 2) ? -e.deltaY * 60 : // Pages
    	       (e.deltaX || e.deltaZ) ? 0 :	// Skip horizontal/depth wheel events
    	       e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
    	       (e.detail && Math.abs(e.detail) < 32765) ? -e.detail * 20 : // Legacy Moz lines
    	       e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
    	       0;
    }

    var skipEvents = {};

    function fakeStop(e) {
    	// fakes stopPropagation by setting a special event flag, checked/reset with skipped(e)
    	skipEvents[e.type] = true;
    }

    function skipped(e) {
    	var events = skipEvents[e.type];
    	// reset when checking, as it's only used in map container and propagates outside of the map
    	skipEvents[e.type] = false;
    	return events;
    }

    // check if element really left/entered the event target (for mouseenter/mouseleave)
    function isExternalTarget(el, e) {

    	var related = e.relatedTarget;

    	if (!related) { return true; }

    	try {
    		while (related && (related !== el)) {
    			related = related.parentNode;
    		}
    	} catch (err) {
    		return false;
    	}
    	return (related !== el);
    }

    var DomEvent = ({
      on: on,
      off: off,
      stopPropagation: stopPropagation,
      disableScrollPropagation: disableScrollPropagation,
      disableClickPropagation: disableClickPropagation,
      preventDefault: preventDefault,
      stop: stop,
      getMousePosition: getMousePosition,
      getWheelDelta: getWheelDelta,
      fakeStop: fakeStop,
      skipped: skipped,
      isExternalTarget: isExternalTarget,
      addListener: on,
      removeListener: off
    });

    /*
     * @class PosAnimation
     * @aka L.PosAnimation
     * @inherits Evented
     * Used internally for panning animations, utilizing CSS3 Transitions for modern browsers and a timer fallback for IE6-9.
     *
     * @example
     * ```js
     * var fx = new L.PosAnimation();
     * fx.run(el, [300, 500], 0.5);
     * ```
     *
     * @constructor L.PosAnimation()
     * Creates a `PosAnimation` object.
     *
     */

    var PosAnimation = Evented.extend({

    	// @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
    	// Run an animation of a given element to a new position, optionally setting
    	// duration in seconds (`0.25` by default) and easing linearity factor (3rd
    	// argument of the [cubic bezier curve](http://cubic-bezier.com/#0,0,.5,1),
    	// `0.5` by default).
    	run: function (el, newPos, duration, easeLinearity) {
    		this.stop();

    		this._el = el;
    		this._inProgress = true;
    		this._duration = duration || 0.25;
    		this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

    		this._startPos = getPosition(el);
    		this._offset = newPos.subtract(this._startPos);
    		this._startTime = +new Date();

    		// @event start: Event
    		// Fired when the animation starts
    		this.fire('start');

    		this._animate();
    	},

    	// @method stop()
    	// Stops the animation (if currently running).
    	stop: function () {
    		if (!this._inProgress) { return; }

    		this._step(true);
    		this._complete();
    	},

    	_animate: function () {
    		// animation loop
    		this._animId = requestAnimFrame(this._animate, this);
    		this._step();
    	},

    	_step: function (round) {
    		var elapsed = (+new Date()) - this._startTime,
    		    duration = this._duration * 1000;

    		if (elapsed < duration) {
    			this._runFrame(this._easeOut(elapsed / duration), round);
    		} else {
    			this._runFrame(1);
    			this._complete();
    		}
    	},

    	_runFrame: function (progress, round) {
    		var pos = this._startPos.add(this._offset.multiplyBy(progress));
    		if (round) {
    			pos._round();
    		}
    		setPosition(this._el, pos);

    		// @event step: Event
    		// Fired continuously during the animation.
    		this.fire('step');
    	},

    	_complete: function () {
    		cancelAnimFrame(this._animId);

    		this._inProgress = false;
    		// @event end: Event
    		// Fired when the animation ends.
    		this.fire('end');
    	},

    	_easeOut: function (t) {
    		return 1 - Math.pow(1 - t, this._easeOutPower);
    	}
    });

    /*
     * @class Map
     * @aka L.Map
     * @inherits Evented
     *
     * The central class of the API — it is used to create a map on a page and manipulate it.
     *
     * @example
     *
     * ```js
     * // initialize the map on the "map" div with a given center and zoom
     * var map = L.map('map', {
     * 	center: [51.505, -0.09],
     * 	zoom: 13
     * });
     * ```
     *
     */

    var Map = Evented.extend({

    	options: {
    		// @section Map State Options
    		// @option crs: CRS = L.CRS.EPSG3857
    		// The [Coordinate Reference System](#crs) to use. Don't change this if you're not
    		// sure what it means.
    		crs: EPSG3857,

    		// @option center: LatLng = undefined
    		// Initial geographic center of the map
    		center: undefined,

    		// @option zoom: Number = undefined
    		// Initial map zoom level
    		zoom: undefined,

    		// @option minZoom: Number = *
    		// Minimum zoom level of the map.
    		// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
    		// the lowest of their `minZoom` options will be used instead.
    		minZoom: undefined,

    		// @option maxZoom: Number = *
    		// Maximum zoom level of the map.
    		// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
    		// the highest of their `maxZoom` options will be used instead.
    		maxZoom: undefined,

    		// @option layers: Layer[] = []
    		// Array of layers that will be added to the map initially
    		layers: [],

    		// @option maxBounds: LatLngBounds = null
    		// When this option is set, the map restricts the view to the given
    		// geographical bounds, bouncing the user back if the user tries to pan
    		// outside the view. To set the restriction dynamically, use
    		// [`setMaxBounds`](#map-setmaxbounds) method.
    		maxBounds: undefined,

    		// @option renderer: Renderer = *
    		// The default method for drawing vector layers on the map. `L.SVG`
    		// or `L.Canvas` by default depending on browser support.
    		renderer: undefined,


    		// @section Animation Options
    		// @option zoomAnimation: Boolean = true
    		// Whether the map zoom animation is enabled. By default it's enabled
    		// in all browsers that support CSS3 Transitions except Android.
    		zoomAnimation: true,

    		// @option zoomAnimationThreshold: Number = 4
    		// Won't animate zoom if the zoom difference exceeds this value.
    		zoomAnimationThreshold: 4,

    		// @option fadeAnimation: Boolean = true
    		// Whether the tile fade animation is enabled. By default it's enabled
    		// in all browsers that support CSS3 Transitions except Android.
    		fadeAnimation: true,

    		// @option markerZoomAnimation: Boolean = true
    		// Whether markers animate their zoom with the zoom animation, if disabled
    		// they will disappear for the length of the animation. By default it's
    		// enabled in all browsers that support CSS3 Transitions except Android.
    		markerZoomAnimation: true,

    		// @option transform3DLimit: Number = 2^23
    		// Defines the maximum size of a CSS translation transform. The default
    		// value should not be changed unless a web browser positions layers in
    		// the wrong place after doing a large `panBy`.
    		transform3DLimit: 8388608, // Precision limit of a 32-bit float

    		// @section Interaction Options
    		// @option zoomSnap: Number = 1
    		// Forces the map's zoom level to always be a multiple of this, particularly
    		// right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
    		// By default, the zoom level snaps to the nearest integer; lower values
    		// (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
    		// means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
    		zoomSnap: 1,

    		// @option zoomDelta: Number = 1
    		// Controls how much the map's zoom level will change after a
    		// [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
    		// or `-` on the keyboard, or using the [zoom controls](#control-zoom).
    		// Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
    		zoomDelta: 1,

    		// @option trackResize: Boolean = true
    		// Whether the map automatically handles browser window resize to update itself.
    		trackResize: true
    	},

    	initialize: function (id, options) { // (HTMLElement or String, Object)
    		options = setOptions(this, options);

    		// Make sure to assign internal flags at the beginning,
    		// to avoid inconsistent state in some edge cases.
    		this._handlers = [];
    		this._layers = {};
    		this._zoomBoundLayers = {};
    		this._sizeChanged = true;

    		this._initContainer(id);
    		this._initLayout();

    		// hack for https://github.com/Leaflet/Leaflet/issues/1980
    		this._onResize = bind(this._onResize, this);

    		this._initEvents();

    		if (options.maxBounds) {
    			this.setMaxBounds(options.maxBounds);
    		}

    		if (options.zoom !== undefined) {
    			this._zoom = this._limitZoom(options.zoom);
    		}

    		if (options.center && options.zoom !== undefined) {
    			this.setView(toLatLng(options.center), options.zoom, {reset: true});
    		}

    		this.callInitHooks();

    		// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
    		this._zoomAnimated = TRANSITION && any3d && !mobileOpera &&
    				this.options.zoomAnimation;

    		// zoom transitions run with the same duration for all layers, so if one of transitionend events
    		// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
    		if (this._zoomAnimated) {
    			this._createAnimProxy();
    			on(this._proxy, TRANSITION_END, this._catchTransitionEnd, this);
    		}

    		this._addLayers(this.options.layers);
    	},


    	// @section Methods for modifying map state

    	// @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
    	// Sets the view of the map (geographical center and zoom) with the given
    	// animation options.
    	setView: function (center, zoom, options) {

    		zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
    		center = this._limitCenter(toLatLng(center), zoom, this.options.maxBounds);
    		options = options || {};

    		this._stop();

    		if (this._loaded && !options.reset && options !== true) {

    			if (options.animate !== undefined) {
    				options.zoom = extend({animate: options.animate}, options.zoom);
    				options.pan = extend({animate: options.animate, duration: options.duration}, options.pan);
    			}

    			// try animating pan or zoom
    			var moved = (this._zoom !== zoom) ?
    				this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
    				this._tryAnimatedPan(center, options.pan);

    			if (moved) {
    				// prevent resize handler call, the view will refresh after animation anyway
    				clearTimeout(this._sizeTimer);
    				return this;
    			}
    		}

    		// animation didn't start, just reset the map view
    		this._resetView(center, zoom);

    		return this;
    	},

    	// @method setZoom(zoom: Number, options?: Zoom/pan options): this
    	// Sets the zoom of the map.
    	setZoom: function (zoom, options) {
    		if (!this._loaded) {
    			this._zoom = zoom;
    			return this;
    		}
    		return this.setView(this.getCenter(), zoom, {zoom: options});
    	},

    	// @method zoomIn(delta?: Number, options?: Zoom options): this
    	// Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
    	zoomIn: function (delta, options) {
    		delta = delta || (any3d ? this.options.zoomDelta : 1);
    		return this.setZoom(this._zoom + delta, options);
    	},

    	// @method zoomOut(delta?: Number, options?: Zoom options): this
    	// Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
    	zoomOut: function (delta, options) {
    		delta = delta || (any3d ? this.options.zoomDelta : 1);
    		return this.setZoom(this._zoom - delta, options);
    	},

    	// @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
    	// Zooms the map while keeping a specified geographical point on the map
    	// stationary (e.g. used internally for scroll zoom and double-click zoom).
    	// @alternative
    	// @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
    	// Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
    	setZoomAround: function (latlng, zoom, options) {
    		var scale = this.getZoomScale(zoom),
    		    viewHalf = this.getSize().divideBy(2),
    		    containerPoint = latlng instanceof Point ? latlng : this.latLngToContainerPoint(latlng),

    		    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
    		    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

    		return this.setView(newCenter, zoom, {zoom: options});
    	},

    	_getBoundsCenterZoom: function (bounds, options) {

    		options = options || {};
    		bounds = bounds.getBounds ? bounds.getBounds() : toLatLngBounds(bounds);

    		var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
    		    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),

    		    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

    		zoom = (typeof options.maxZoom === 'number') ? Math.min(options.maxZoom, zoom) : zoom;

    		if (zoom === Infinity) {
    			return {
    				center: bounds.getCenter(),
    				zoom: zoom
    			};
    		}

    		var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

    		    swPoint = this.project(bounds.getSouthWest(), zoom),
    		    nePoint = this.project(bounds.getNorthEast(), zoom),
    		    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

    		return {
    			center: center,
    			zoom: zoom
    		};
    	},

    	// @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
    	// Sets a map view that contains the given geographical bounds with the
    	// maximum zoom level possible.
    	fitBounds: function (bounds, options) {

    		bounds = toLatLngBounds(bounds);

    		if (!bounds.isValid()) {
    			throw new Error('Bounds are not valid.');
    		}

    		var target = this._getBoundsCenterZoom(bounds, options);
    		return this.setView(target.center, target.zoom, options);
    	},

    	// @method fitWorld(options?: fitBounds options): this
    	// Sets a map view that mostly contains the whole world with the maximum
    	// zoom level possible.
    	fitWorld: function (options) {
    		return this.fitBounds([[-90, -180], [90, 180]], options);
    	},

    	// @method panTo(latlng: LatLng, options?: Pan options): this
    	// Pans the map to a given center.
    	panTo: function (center, options) { // (LatLng)
    		return this.setView(center, this._zoom, {pan: options});
    	},

    	// @method panBy(offset: Point, options?: Pan options): this
    	// Pans the map by a given number of pixels (animated).
    	panBy: function (offset, options) {
    		offset = toPoint(offset).round();
    		options = options || {};

    		if (!offset.x && !offset.y) {
    			return this.fire('moveend');
    		}
    		// If we pan too far, Chrome gets issues with tiles
    		// and makes them disappear or appear in the wrong place (slightly offset) #2602
    		if (options.animate !== true && !this.getSize().contains(offset)) {
    			this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
    			return this;
    		}

    		if (!this._panAnim) {
    			this._panAnim = new PosAnimation();

    			this._panAnim.on({
    				'step': this._onPanTransitionStep,
    				'end': this._onPanTransitionEnd
    			}, this);
    		}

    		// don't fire movestart if animating inertia
    		if (!options.noMoveStart) {
    			this.fire('movestart');
    		}

    		// animate pan unless animate: false specified
    		if (options.animate !== false) {
    			addClass(this._mapPane, 'leaflet-pan-anim');

    			var newPos = this._getMapPanePos().subtract(offset).round();
    			this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
    		} else {
    			this._rawPanBy(offset);
    			this.fire('move').fire('moveend');
    		}

    		return this;
    	},

    	// @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
    	// Sets the view of the map (geographical center and zoom) performing a smooth
    	// pan-zoom animation.
    	flyTo: function (targetCenter, targetZoom, options) {

    		options = options || {};
    		if (options.animate === false || !any3d) {
    			return this.setView(targetCenter, targetZoom, options);
    		}

    		this._stop();

    		var from = this.project(this.getCenter()),
    		    to = this.project(targetCenter),
    		    size = this.getSize(),
    		    startZoom = this._zoom;

    		targetCenter = toLatLng(targetCenter);
    		targetZoom = targetZoom === undefined ? startZoom : targetZoom;

    		var w0 = Math.max(size.x, size.y),
    		    w1 = w0 * this.getZoomScale(startZoom, targetZoom),
    		    u1 = (to.distanceTo(from)) || 1,
    		    rho = 1.42,
    		    rho2 = rho * rho;

    		function r(i) {
    			var s1 = i ? -1 : 1,
    			    s2 = i ? w1 : w0,
    			    t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
    			    b1 = 2 * s2 * rho2 * u1,
    			    b = t1 / b1,
    			    sq = Math.sqrt(b * b + 1) - b;

    			    // workaround for floating point precision bug when sq = 0, log = -Infinite,
    			    // thus triggering an infinite loop in flyTo
    			    var log = sq < 0.000000001 ? -18 : Math.log(sq);

    			return log;
    		}

    		function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
    		function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
    		function tanh(n) { return sinh(n) / cosh(n); }

    		var r0 = r(0);

    		function w(s) { return w0 * (cosh(r0) / cosh(r0 + rho * s)); }
    		function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }

    		function easeOut(t) { return 1 - Math.pow(1 - t, 1.5); }

    		var start = Date.now(),
    		    S = (r(1) - r0) / rho,
    		    duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

    		function frame() {
    			var t = (Date.now() - start) / duration,
    			    s = easeOut(t) * S;

    			if (t <= 1) {
    				this._flyToFrame = requestAnimFrame(frame, this);

    				this._move(
    					this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
    					this.getScaleZoom(w0 / w(s), startZoom),
    					{flyTo: true});

    			} else {
    				this
    					._move(targetCenter, targetZoom)
    					._moveEnd(true);
    			}
    		}

    		this._moveStart(true, options.noMoveStart);

    		frame.call(this);
    		return this;
    	},

    	// @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
    	// Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
    	// but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
    	flyToBounds: function (bounds, options) {
    		var target = this._getBoundsCenterZoom(bounds, options);
    		return this.flyTo(target.center, target.zoom, options);
    	},

    	// @method setMaxBounds(bounds: LatLngBounds): this
    	// Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
    	setMaxBounds: function (bounds) {
    		bounds = toLatLngBounds(bounds);

    		if (!bounds.isValid()) {
    			this.options.maxBounds = null;
    			return this.off('moveend', this._panInsideMaxBounds);
    		} else if (this.options.maxBounds) {
    			this.off('moveend', this._panInsideMaxBounds);
    		}

    		this.options.maxBounds = bounds;

    		if (this._loaded) {
    			this._panInsideMaxBounds();
    		}

    		return this.on('moveend', this._panInsideMaxBounds);
    	},

    	// @method setMinZoom(zoom: Number): this
    	// Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
    	setMinZoom: function (zoom) {
    		var oldZoom = this.options.minZoom;
    		this.options.minZoom = zoom;

    		if (this._loaded && oldZoom !== zoom) {
    			this.fire('zoomlevelschange');

    			if (this.getZoom() < this.options.minZoom) {
    				return this.setZoom(zoom);
    			}
    		}

    		return this;
    	},

    	// @method setMaxZoom(zoom: Number): this
    	// Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
    	setMaxZoom: function (zoom) {
    		var oldZoom = this.options.maxZoom;
    		this.options.maxZoom = zoom;

    		if (this._loaded && oldZoom !== zoom) {
    			this.fire('zoomlevelschange');

    			if (this.getZoom() > this.options.maxZoom) {
    				return this.setZoom(zoom);
    			}
    		}

    		return this;
    	},

    	// @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
    	// Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
    	panInsideBounds: function (bounds, options) {
    		this._enforcingBounds = true;
    		var center = this.getCenter(),
    		    newCenter = this._limitCenter(center, this._zoom, toLatLngBounds(bounds));

    		if (!center.equals(newCenter)) {
    			this.panTo(newCenter, options);
    		}

    		this._enforcingBounds = false;
    		return this;
    	},

    	// @method panInside(latlng: LatLng, options?: options): this
    	// Pans the map the minimum amount to make the `latlng` visible. Use
    	// `padding`, `paddingTopLeft` and `paddingTopRight` options to fit
    	// the display to more restricted bounds, like [`fitBounds`](#map-fitbounds).
    	// If `latlng` is already within the (optionally padded) display bounds,
    	// the map will not be panned.
    	panInside: function (latlng, options) {
    		options = options || {};

    		var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
    		    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),
    		    center = this.getCenter(),
    		    pixelCenter = this.project(center),
    		    pixelPoint = this.project(latlng),
    		    pixelBounds = this.getPixelBounds(),
    		    halfPixelBounds = pixelBounds.getSize().divideBy(2),
    		    paddedBounds = toBounds([pixelBounds.min.add(paddingTL), pixelBounds.max.subtract(paddingBR)]);

    		if (!paddedBounds.contains(pixelPoint)) {
    			this._enforcingBounds = true;
    			var diff = pixelCenter.subtract(pixelPoint),
    			    newCenter = toPoint(pixelPoint.x + diff.x, pixelPoint.y + diff.y);

    			if (pixelPoint.x < paddedBounds.min.x || pixelPoint.x > paddedBounds.max.x) {
    				newCenter.x = pixelCenter.x - diff.x;
    				if (diff.x > 0) {
    					newCenter.x += halfPixelBounds.x - paddingTL.x;
    				} else {
    					newCenter.x -= halfPixelBounds.x - paddingBR.x;
    				}
    			}
    			if (pixelPoint.y < paddedBounds.min.y || pixelPoint.y > paddedBounds.max.y) {
    				newCenter.y = pixelCenter.y - diff.y;
    				if (diff.y > 0) {
    					newCenter.y += halfPixelBounds.y - paddingTL.y;
    				} else {
    					newCenter.y -= halfPixelBounds.y - paddingBR.y;
    				}
    			}
    			this.panTo(this.unproject(newCenter), options);
    			this._enforcingBounds = false;
    		}
    		return this;
    	},

    	// @method invalidateSize(options: Zoom/pan options): this
    	// Checks if the map container size changed and updates the map if so —
    	// call it after you've changed the map size dynamically, also animating
    	// pan by default. If `options.pan` is `false`, panning will not occur.
    	// If `options.debounceMoveend` is `true`, it will delay `moveend` event so
    	// that it doesn't happen often even if the method is called many
    	// times in a row.

    	// @alternative
    	// @method invalidateSize(animate: Boolean): this
    	// Checks if the map container size changed and updates the map if so —
    	// call it after you've changed the map size dynamically, also animating
    	// pan by default.
    	invalidateSize: function (options) {
    		if (!this._loaded) { return this; }

    		options = extend({
    			animate: false,
    			pan: true
    		}, options === true ? {animate: true} : options);

    		var oldSize = this.getSize();
    		this._sizeChanged = true;
    		this._lastCenter = null;

    		var newSize = this.getSize(),
    		    oldCenter = oldSize.divideBy(2).round(),
    		    newCenter = newSize.divideBy(2).round(),
    		    offset = oldCenter.subtract(newCenter);

    		if (!offset.x && !offset.y) { return this; }

    		if (options.animate && options.pan) {
    			this.panBy(offset);

    		} else {
    			if (options.pan) {
    				this._rawPanBy(offset);
    			}

    			this.fire('move');

    			if (options.debounceMoveend) {
    				clearTimeout(this._sizeTimer);
    				this._sizeTimer = setTimeout(bind(this.fire, this, 'moveend'), 200);
    			} else {
    				this.fire('moveend');
    			}
    		}

    		// @section Map state change events
    		// @event resize: ResizeEvent
    		// Fired when the map is resized.
    		return this.fire('resize', {
    			oldSize: oldSize,
    			newSize: newSize
    		});
    	},

    	// @section Methods for modifying map state
    	// @method stop(): this
    	// Stops the currently running `panTo` or `flyTo` animation, if any.
    	stop: function () {
    		this.setZoom(this._limitZoom(this._zoom));
    		if (!this.options.zoomSnap) {
    			this.fire('viewreset');
    		}
    		return this._stop();
    	},

    	// @section Geolocation methods
    	// @method locate(options?: Locate options): this
    	// Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
    	// event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
    	// and optionally sets the map view to the user's location with respect to
    	// detection accuracy (or to the world view if geolocation failed).
    	// Note that, if your page doesn't use HTTPS, this method will fail in
    	// modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
    	// See `Locate options` for more details.
    	locate: function (options) {

    		options = this._locateOptions = extend({
    			timeout: 10000,
    			watch: false
    			// setView: false
    			// maxZoom: <Number>
    			// maximumAge: 0
    			// enableHighAccuracy: false
    		}, options);

    		if (!('geolocation' in navigator)) {
    			this._handleGeolocationError({
    				code: 0,
    				message: 'Geolocation not supported.'
    			});
    			return this;
    		}

    		var onResponse = bind(this._handleGeolocationResponse, this),
    		    onError = bind(this._handleGeolocationError, this);

    		if (options.watch) {
    			this._locationWatchId =
    			        navigator.geolocation.watchPosition(onResponse, onError, options);
    		} else {
    			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
    		}
    		return this;
    	},

    	// @method stopLocate(): this
    	// Stops watching location previously initiated by `map.locate({watch: true})`
    	// and aborts resetting the map view if map.locate was called with
    	// `{setView: true}`.
    	stopLocate: function () {
    		if (navigator.geolocation && navigator.geolocation.clearWatch) {
    			navigator.geolocation.clearWatch(this._locationWatchId);
    		}
    		if (this._locateOptions) {
    			this._locateOptions.setView = false;
    		}
    		return this;
    	},

    	_handleGeolocationError: function (error) {
    		var c = error.code,
    		    message = error.message ||
    		            (c === 1 ? 'permission denied' :
    		            (c === 2 ? 'position unavailable' : 'timeout'));

    		if (this._locateOptions.setView && !this._loaded) {
    			this.fitWorld();
    		}

    		// @section Location events
    		// @event locationerror: ErrorEvent
    		// Fired when geolocation (using the [`locate`](#map-locate) method) failed.
    		this.fire('locationerror', {
    			code: c,
    			message: 'Geolocation error: ' + message + '.'
    		});
    	},

    	_handleGeolocationResponse: function (pos) {
    		var lat = pos.coords.latitude,
    		    lng = pos.coords.longitude,
    		    latlng = new LatLng(lat, lng),
    		    bounds = latlng.toBounds(pos.coords.accuracy * 2),
    		    options = this._locateOptions;

    		if (options.setView) {
    			var zoom = this.getBoundsZoom(bounds);
    			this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
    		}

    		var data = {
    			latlng: latlng,
    			bounds: bounds,
    			timestamp: pos.timestamp
    		};

    		for (var i in pos.coords) {
    			if (typeof pos.coords[i] === 'number') {
    				data[i] = pos.coords[i];
    			}
    		}

    		// @event locationfound: LocationEvent
    		// Fired when geolocation (using the [`locate`](#map-locate) method)
    		// went successfully.
    		this.fire('locationfound', data);
    	},

    	// TODO Appropriate docs section?
    	// @section Other Methods
    	// @method addHandler(name: String, HandlerClass: Function): this
    	// Adds a new `Handler` to the map, given its name and constructor function.
    	addHandler: function (name, HandlerClass) {
    		if (!HandlerClass) { return this; }

    		var handler = this[name] = new HandlerClass(this);

    		this._handlers.push(handler);

    		if (this.options[name]) {
    			handler.enable();
    		}

    		return this;
    	},

    	// @method remove(): this
    	// Destroys the map and clears all related event listeners.
    	remove: function () {

    		this._initEvents(true);
    		this.off('moveend', this._panInsideMaxBounds);

    		if (this._containerId !== this._container._leaflet_id) {
    			throw new Error('Map container is being reused by another instance');
    		}

    		try {
    			// throws error in IE6-8
    			delete this._container._leaflet_id;
    			delete this._containerId;
    		} catch (e) {
    			/*eslint-disable */
    			this._container._leaflet_id = undefined;
    			/* eslint-enable */
    			this._containerId = undefined;
    		}

    		if (this._locationWatchId !== undefined) {
    			this.stopLocate();
    		}

    		this._stop();

    		remove(this._mapPane);

    		if (this._clearControlPos) {
    			this._clearControlPos();
    		}
    		if (this._resizeRequest) {
    			cancelAnimFrame(this._resizeRequest);
    			this._resizeRequest = null;
    		}

    		this._clearHandlers();

    		if (this._loaded) {
    			// @section Map state change events
    			// @event unload: Event
    			// Fired when the map is destroyed with [remove](#map-remove) method.
    			this.fire('unload');
    		}

    		var i;
    		for (i in this._layers) {
    			this._layers[i].remove();
    		}
    		for (i in this._panes) {
    			remove(this._panes[i]);
    		}

    		this._layers = [];
    		this._panes = [];
    		delete this._mapPane;
    		delete this._renderer;

    		return this;
    	},

    	// @section Other Methods
    	// @method createPane(name: String, container?: HTMLElement): HTMLElement
    	// Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
    	// then returns it. The pane is created as a child of `container`, or
    	// as a child of the main map pane if not set.
    	createPane: function (name, container) {
    		var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
    		    pane = create$1('div', className, container || this._mapPane);

    		if (name) {
    			this._panes[name] = pane;
    		}
    		return pane;
    	},

    	// @section Methods for Getting Map State

    	// @method getCenter(): LatLng
    	// Returns the geographical center of the map view
    	getCenter: function () {
    		this._checkIfLoaded();

    		if (this._lastCenter && !this._moved()) {
    			return this._lastCenter;
    		}
    		return this.layerPointToLatLng(this._getCenterLayerPoint());
    	},

    	// @method getZoom(): Number
    	// Returns the current zoom level of the map view
    	getZoom: function () {
    		return this._zoom;
    	},

    	// @method getBounds(): LatLngBounds
    	// Returns the geographical bounds visible in the current map view
    	getBounds: function () {
    		var bounds = this.getPixelBounds(),
    		    sw = this.unproject(bounds.getBottomLeft()),
    		    ne = this.unproject(bounds.getTopRight());

    		return new LatLngBounds(sw, ne);
    	},

    	// @method getMinZoom(): Number
    	// Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
    	getMinZoom: function () {
    		return this.options.minZoom === undefined ? this._layersMinZoom || 0 : this.options.minZoom;
    	},

    	// @method getMaxZoom(): Number
    	// Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
    	getMaxZoom: function () {
    		return this.options.maxZoom === undefined ?
    			(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
    			this.options.maxZoom;
    	},

    	// @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
    	// Returns the maximum zoom level on which the given bounds fit to the map
    	// view in its entirety. If `inside` (optional) is set to `true`, the method
    	// instead returns the minimum zoom level on which the map view fits into
    	// the given bounds in its entirety.
    	getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
    		bounds = toLatLngBounds(bounds);
    		padding = toPoint(padding || [0, 0]);

    		var zoom = this.getZoom() || 0,
    		    min = this.getMinZoom(),
    		    max = this.getMaxZoom(),
    		    nw = bounds.getNorthWest(),
    		    se = bounds.getSouthEast(),
    		    size = this.getSize().subtract(padding),
    		    boundsSize = toBounds(this.project(se, zoom), this.project(nw, zoom)).getSize(),
    		    snap = any3d ? this.options.zoomSnap : 1,
    		    scalex = size.x / boundsSize.x,
    		    scaley = size.y / boundsSize.y,
    		    scale = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);

    		zoom = this.getScaleZoom(scale, zoom);

    		if (snap) {
    			zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
    			zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
    		}

    		return Math.max(min, Math.min(max, zoom));
    	},

    	// @method getSize(): Point
    	// Returns the current size of the map container (in pixels).
    	getSize: function () {
    		if (!this._size || this._sizeChanged) {
    			this._size = new Point(
    				this._container.clientWidth || 0,
    				this._container.clientHeight || 0);

    			this._sizeChanged = false;
    		}
    		return this._size.clone();
    	},

    	// @method getPixelBounds(): Bounds
    	// Returns the bounds of the current map view in projected pixel
    	// coordinates (sometimes useful in layer and overlay implementations).
    	getPixelBounds: function (center, zoom) {
    		var topLeftPoint = this._getTopLeftPoint(center, zoom);
    		return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
    	},

    	// TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
    	// the map pane? "left point of the map layer" can be confusing, specially
    	// since there can be negative offsets.
    	// @method getPixelOrigin(): Point
    	// Returns the projected pixel coordinates of the top left point of
    	// the map layer (useful in custom layer and overlay implementations).
    	getPixelOrigin: function () {
    		this._checkIfLoaded();
    		return this._pixelOrigin;
    	},

    	// @method getPixelWorldBounds(zoom?: Number): Bounds
    	// Returns the world's bounds in pixel coordinates for zoom level `zoom`.
    	// If `zoom` is omitted, the map's current zoom level is used.
    	getPixelWorldBounds: function (zoom) {
    		return this.options.crs.getProjectedBounds(zoom === undefined ? this.getZoom() : zoom);
    	},

    	// @section Other Methods

    	// @method getPane(pane: String|HTMLElement): HTMLElement
    	// Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
    	getPane: function (pane) {
    		return typeof pane === 'string' ? this._panes[pane] : pane;
    	},

    	// @method getPanes(): Object
    	// Returns a plain object containing the names of all [panes](#map-pane) as keys and
    	// the panes as values.
    	getPanes: function () {
    		return this._panes;
    	},

    	// @method getContainer: HTMLElement
    	// Returns the HTML element that contains the map.
    	getContainer: function () {
    		return this._container;
    	},


    	// @section Conversion Methods

    	// @method getZoomScale(toZoom: Number, fromZoom: Number): Number
    	// Returns the scale factor to be applied to a map transition from zoom level
    	// `fromZoom` to `toZoom`. Used internally to help with zoom animations.
    	getZoomScale: function (toZoom, fromZoom) {
    		// TODO replace with universal implementation after refactoring projections
    		var crs = this.options.crs;
    		fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
    		return crs.scale(toZoom) / crs.scale(fromZoom);
    	},

    	// @method getScaleZoom(scale: Number, fromZoom: Number): Number
    	// Returns the zoom level that the map would end up at, if it is at `fromZoom`
    	// level and everything is scaled by a factor of `scale`. Inverse of
    	// [`getZoomScale`](#map-getZoomScale).
    	getScaleZoom: function (scale, fromZoom) {
    		var crs = this.options.crs;
    		fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
    		var zoom = crs.zoom(scale * crs.scale(fromZoom));
    		return isNaN(zoom) ? Infinity : zoom;
    	},

    	// @method project(latlng: LatLng, zoom: Number): Point
    	// Projects a geographical coordinate `LatLng` according to the projection
    	// of the map's CRS, then scales it according to `zoom` and the CRS's
    	// `Transformation`. The result is pixel coordinate relative to
    	// the CRS origin.
    	project: function (latlng, zoom) {
    		zoom = zoom === undefined ? this._zoom : zoom;
    		return this.options.crs.latLngToPoint(toLatLng(latlng), zoom);
    	},

    	// @method unproject(point: Point, zoom: Number): LatLng
    	// Inverse of [`project`](#map-project).
    	unproject: function (point, zoom) {
    		zoom = zoom === undefined ? this._zoom : zoom;
    		return this.options.crs.pointToLatLng(toPoint(point), zoom);
    	},

    	// @method layerPointToLatLng(point: Point): LatLng
    	// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
    	// returns the corresponding geographical coordinate (for the current zoom level).
    	layerPointToLatLng: function (point) {
    		var projectedPoint = toPoint(point).add(this.getPixelOrigin());
    		return this.unproject(projectedPoint);
    	},

    	// @method latLngToLayerPoint(latlng: LatLng): Point
    	// Given a geographical coordinate, returns the corresponding pixel coordinate
    	// relative to the [origin pixel](#map-getpixelorigin).
    	latLngToLayerPoint: function (latlng) {
    		var projectedPoint = this.project(toLatLng(latlng))._round();
    		return projectedPoint._subtract(this.getPixelOrigin());
    	},

    	// @method wrapLatLng(latlng: LatLng): LatLng
    	// Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
    	// map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
    	// CRS's bounds.
    	// By default this means longitude is wrapped around the dateline so its
    	// value is between -180 and +180 degrees.
    	wrapLatLng: function (latlng) {
    		return this.options.crs.wrapLatLng(toLatLng(latlng));
    	},

    	// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
    	// Returns a `LatLngBounds` with the same size as the given one, ensuring that
    	// its center is within the CRS's bounds.
    	// By default this means the center longitude is wrapped around the dateline so its
    	// value is between -180 and +180 degrees, and the majority of the bounds
    	// overlaps the CRS's bounds.
    	wrapLatLngBounds: function (latlng) {
    		return this.options.crs.wrapLatLngBounds(toLatLngBounds(latlng));
    	},

    	// @method distance(latlng1: LatLng, latlng2: LatLng): Number
    	// Returns the distance between two geographical coordinates according to
    	// the map's CRS. By default this measures distance in meters.
    	distance: function (latlng1, latlng2) {
    		return this.options.crs.distance(toLatLng(latlng1), toLatLng(latlng2));
    	},

    	// @method containerPointToLayerPoint(point: Point): Point
    	// Given a pixel coordinate relative to the map container, returns the corresponding
    	// pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
    	containerPointToLayerPoint: function (point) { // (Point)
    		return toPoint(point).subtract(this._getMapPanePos());
    	},

    	// @method layerPointToContainerPoint(point: Point): Point
    	// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
    	// returns the corresponding pixel coordinate relative to the map container.
    	layerPointToContainerPoint: function (point) { // (Point)
    		return toPoint(point).add(this._getMapPanePos());
    	},

    	// @method containerPointToLatLng(point: Point): LatLng
    	// Given a pixel coordinate relative to the map container, returns
    	// the corresponding geographical coordinate (for the current zoom level).
    	containerPointToLatLng: function (point) {
    		var layerPoint = this.containerPointToLayerPoint(toPoint(point));
    		return this.layerPointToLatLng(layerPoint);
    	},

    	// @method latLngToContainerPoint(latlng: LatLng): Point
    	// Given a geographical coordinate, returns the corresponding pixel coordinate
    	// relative to the map container.
    	latLngToContainerPoint: function (latlng) {
    		return this.layerPointToContainerPoint(this.latLngToLayerPoint(toLatLng(latlng)));
    	},

    	// @method mouseEventToContainerPoint(ev: MouseEvent): Point
    	// Given a MouseEvent object, returns the pixel coordinate relative to the
    	// map container where the event took place.
    	mouseEventToContainerPoint: function (e) {
    		return getMousePosition(e, this._container);
    	},

    	// @method mouseEventToLayerPoint(ev: MouseEvent): Point
    	// Given a MouseEvent object, returns the pixel coordinate relative to
    	// the [origin pixel](#map-getpixelorigin) where the event took place.
    	mouseEventToLayerPoint: function (e) {
    		return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
    	},

    	// @method mouseEventToLatLng(ev: MouseEvent): LatLng
    	// Given a MouseEvent object, returns geographical coordinate where the
    	// event took place.
    	mouseEventToLatLng: function (e) { // (MouseEvent)
    		return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
    	},


    	// map initialization methods

    	_initContainer: function (id) {
    		var container = this._container = get(id);

    		if (!container) {
    			throw new Error('Map container not found.');
    		} else if (container._leaflet_id) {
    			throw new Error('Map container is already initialized.');
    		}

    		on(container, 'scroll', this._onScroll, this);
    		this._containerId = stamp(container);
    	},

    	_initLayout: function () {
    		var container = this._container;

    		this._fadeAnimated = this.options.fadeAnimation && any3d;

    		addClass(container, 'leaflet-container' +
    			(touch ? ' leaflet-touch' : '') +
    			(retina ? ' leaflet-retina' : '') +
    			(ielt9 ? ' leaflet-oldie' : '') +
    			(safari ? ' leaflet-safari' : '') +
    			(this._fadeAnimated ? ' leaflet-fade-anim' : ''));

    		var position = getStyle(container, 'position');

    		if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
    			container.style.position = 'relative';
    		}

    		this._initPanes();

    		if (this._initControlPos) {
    			this._initControlPos();
    		}
    	},

    	_initPanes: function () {
    		var panes = this._panes = {};
    		this._paneRenderers = {};

    		// @section
    		//
    		// Panes are DOM elements used to control the ordering of layers on the map. You
    		// can access panes with [`map.getPane`](#map-getpane) or
    		// [`map.getPanes`](#map-getpanes) methods. New panes can be created with the
    		// [`map.createPane`](#map-createpane) method.
    		//
    		// Every map has the following default panes that differ only in zIndex.
    		//
    		// @pane mapPane: HTMLElement = 'auto'
    		// Pane that contains all other map panes

    		this._mapPane = this.createPane('mapPane', this._container);
    		setPosition(this._mapPane, new Point(0, 0));

    		// @pane tilePane: HTMLElement = 200
    		// Pane for `GridLayer`s and `TileLayer`s
    		this.createPane('tilePane');
    		// @pane overlayPane: HTMLElement = 400
    		// Pane for overlay shadows (e.g. `Marker` shadows)
    		this.createPane('shadowPane');
    		// @pane shadowPane: HTMLElement = 500
    		// Pane for vectors (`Path`s, like `Polyline`s and `Polygon`s), `ImageOverlay`s and `VideoOverlay`s
    		this.createPane('overlayPane');
    		// @pane markerPane: HTMLElement = 600
    		// Pane for `Icon`s of `Marker`s
    		this.createPane('markerPane');
    		// @pane tooltipPane: HTMLElement = 650
    		// Pane for `Tooltip`s.
    		this.createPane('tooltipPane');
    		// @pane popupPane: HTMLElement = 700
    		// Pane for `Popup`s.
    		this.createPane('popupPane');

    		if (!this.options.markerZoomAnimation) {
    			addClass(panes.markerPane, 'leaflet-zoom-hide');
    			addClass(panes.shadowPane, 'leaflet-zoom-hide');
    		}
    	},


    	// private methods that modify map state

    	// @section Map state change events
    	_resetView: function (center, zoom) {
    		setPosition(this._mapPane, new Point(0, 0));

    		var loading = !this._loaded;
    		this._loaded = true;
    		zoom = this._limitZoom(zoom);

    		this.fire('viewprereset');

    		var zoomChanged = this._zoom !== zoom;
    		this
    			._moveStart(zoomChanged, false)
    			._move(center, zoom)
    			._moveEnd(zoomChanged);

    		// @event viewreset: Event
    		// Fired when the map needs to redraw its content (this usually happens
    		// on map zoom or load). Very useful for creating custom overlays.
    		this.fire('viewreset');

    		// @event load: Event
    		// Fired when the map is initialized (when its center and zoom are set
    		// for the first time).
    		if (loading) {
    			this.fire('load');
    		}
    	},

    	_moveStart: function (zoomChanged, noMoveStart) {
    		// @event zoomstart: Event
    		// Fired when the map zoom is about to change (e.g. before zoom animation).
    		// @event movestart: Event
    		// Fired when the view of the map starts changing (e.g. user starts dragging the map).
    		if (zoomChanged) {
    			this.fire('zoomstart');
    		}
    		if (!noMoveStart) {
    			this.fire('movestart');
    		}
    		return this;
    	},

    	_move: function (center, zoom, data) {
    		if (zoom === undefined) {
    			zoom = this._zoom;
    		}
    		var zoomChanged = this._zoom !== zoom;

    		this._zoom = zoom;
    		this._lastCenter = center;
    		this._pixelOrigin = this._getNewPixelOrigin(center);

    		// @event zoom: Event
    		// Fired repeatedly during any change in zoom level, including zoom
    		// and fly animations.
    		if (zoomChanged || (data && data.pinch)) {	// Always fire 'zoom' if pinching because #3530
    			this.fire('zoom', data);
    		}

    		// @event move: Event
    		// Fired repeatedly during any movement of the map, including pan and
    		// fly animations.
    		return this.fire('move', data);
    	},

    	_moveEnd: function (zoomChanged) {
    		// @event zoomend: Event
    		// Fired when the map has changed, after any animations.
    		if (zoomChanged) {
    			this.fire('zoomend');
    		}

    		// @event moveend: Event
    		// Fired when the center of the map stops changing (e.g. user stopped
    		// dragging the map).
    		return this.fire('moveend');
    	},

    	_stop: function () {
    		cancelAnimFrame(this._flyToFrame);
    		if (this._panAnim) {
    			this._panAnim.stop();
    		}
    		return this;
    	},

    	_rawPanBy: function (offset) {
    		setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
    	},

    	_getZoomSpan: function () {
    		return this.getMaxZoom() - this.getMinZoom();
    	},

    	_panInsideMaxBounds: function () {
    		if (!this._enforcingBounds) {
    			this.panInsideBounds(this.options.maxBounds);
    		}
    	},

    	_checkIfLoaded: function () {
    		if (!this._loaded) {
    			throw new Error('Set map center and zoom first.');
    		}
    	},

    	// DOM event handling

    	// @section Interaction events
    	_initEvents: function (remove$$1) {
    		this._targets = {};
    		this._targets[stamp(this._container)] = this;

    		var onOff = remove$$1 ? off : on;

    		// @event click: MouseEvent
    		// Fired when the user clicks (or taps) the map.
    		// @event dblclick: MouseEvent
    		// Fired when the user double-clicks (or double-taps) the map.
    		// @event mousedown: MouseEvent
    		// Fired when the user pushes the mouse button on the map.
    		// @event mouseup: MouseEvent
    		// Fired when the user releases the mouse button on the map.
    		// @event mouseover: MouseEvent
    		// Fired when the mouse enters the map.
    		// @event mouseout: MouseEvent
    		// Fired when the mouse leaves the map.
    		// @event mousemove: MouseEvent
    		// Fired while the mouse moves over the map.
    		// @event contextmenu: MouseEvent
    		// Fired when the user pushes the right mouse button on the map, prevents
    		// default browser context menu from showing if there are listeners on
    		// this event. Also fired on mobile when the user holds a single touch
    		// for a second (also called long press).
    		// @event keypress: KeyboardEvent
    		// Fired when the user presses a key from the keyboard that produces a character value while the map is focused.
    		// @event keydown: KeyboardEvent
    		// Fired when the user presses a key from the keyboard while the map is focused. Unlike the `keypress` event,
    		// the `keydown` event is fired for keys that produce a character value and for keys
    		// that do not produce a character value.
    		// @event keyup: KeyboardEvent
    		// Fired when the user releases a key from the keyboard while the map is focused.
    		onOff(this._container, 'click dblclick mousedown mouseup ' +
    			'mouseover mouseout mousemove contextmenu keypress keydown keyup', this._handleDOMEvent, this);

    		if (this.options.trackResize) {
    			onOff(window, 'resize', this._onResize, this);
    		}

    		if (any3d && this.options.transform3DLimit) {
    			(remove$$1 ? this.off : this.on).call(this, 'moveend', this._onMoveEnd);
    		}
    	},

    	_onResize: function () {
    		cancelAnimFrame(this._resizeRequest);
    		this._resizeRequest = requestAnimFrame(
    		        function () { this.invalidateSize({debounceMoveend: true}); }, this);
    	},

    	_onScroll: function () {
    		this._container.scrollTop  = 0;
    		this._container.scrollLeft = 0;
    	},

    	_onMoveEnd: function () {
    		var pos = this._getMapPanePos();
    		if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
    			// https://bugzilla.mozilla.org/show_bug.cgi?id=1203873 but Webkit also have
    			// a pixel offset on very high values, see: http://jsfiddle.net/dg6r5hhb/
    			this._resetView(this.getCenter(), this.getZoom());
    		}
    	},

    	_findEventTargets: function (e, type) {
    		var targets = [],
    		    target,
    		    isHover = type === 'mouseout' || type === 'mouseover',
    		    src = e.target || e.srcElement,
    		    dragging = false;

    		while (src) {
    			target = this._targets[stamp(src)];
    			if (target && (type === 'click' || type === 'preclick') && !e._simulated && this._draggableMoved(target)) {
    				// Prevent firing click after you just dragged an object.
    				dragging = true;
    				break;
    			}
    			if (target && target.listens(type, true)) {
    				if (isHover && !isExternalTarget(src, e)) { break; }
    				targets.push(target);
    				if (isHover) { break; }
    			}
    			if (src === this._container) { break; }
    			src = src.parentNode;
    		}
    		if (!targets.length && !dragging && !isHover && isExternalTarget(src, e)) {
    			targets = [this];
    		}
    		return targets;
    	},

    	_handleDOMEvent: function (e) {
    		if (!this._loaded || skipped(e)) { return; }

    		var type = e.type;

    		if (type === 'mousedown' || type === 'keypress' || type === 'keyup' || type === 'keydown') {
    			// prevents outline when clicking on keyboard-focusable element
    			preventOutline(e.target || e.srcElement);
    		}

    		this._fireDOMEvent(e, type);
    	},

    	_mouseEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu'],

    	_fireDOMEvent: function (e, type, targets) {

    		if (e.type === 'click') {
    			// Fire a synthetic 'preclick' event which propagates up (mainly for closing popups).
    			// @event preclick: MouseEvent
    			// Fired before mouse click on the map (sometimes useful when you
    			// want something to happen on click before any existing click
    			// handlers start running).
    			var synth = extend({}, e);
    			synth.type = 'preclick';
    			this._fireDOMEvent(synth, synth.type, targets);
    		}

    		if (e._stopped) { return; }

    		// Find the layer the event is propagating from and its parents.
    		targets = (targets || []).concat(this._findEventTargets(e, type));

    		if (!targets.length) { return; }

    		var target = targets[0];
    		if (type === 'contextmenu' && target.listens(type, true)) {
    			preventDefault(e);
    		}

    		var data = {
    			originalEvent: e
    		};

    		if (e.type !== 'keypress' && e.type !== 'keydown' && e.type !== 'keyup') {
    			var isMarker = target.getLatLng && (!target._radius || target._radius <= 10);
    			data.containerPoint = isMarker ?
    				this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
    			data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
    			data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
    		}

    		for (var i = 0; i < targets.length; i++) {
    			targets[i].fire(type, data, true);
    			if (data.originalEvent._stopped ||
    				(targets[i].options.bubblingMouseEvents === false && indexOf(this._mouseEvents, type) !== -1)) { return; }
    		}
    	},

    	_draggableMoved: function (obj) {
    		obj = obj.dragging && obj.dragging.enabled() ? obj : this;
    		return (obj.dragging && obj.dragging.moved()) || (this.boxZoom && this.boxZoom.moved());
    	},

    	_clearHandlers: function () {
    		for (var i = 0, len = this._handlers.length; i < len; i++) {
    			this._handlers[i].disable();
    		}
    	},

    	// @section Other Methods

    	// @method whenReady(fn: Function, context?: Object): this
    	// Runs the given function `fn` when the map gets initialized with
    	// a view (center and zoom) and at least one layer, or immediately
    	// if it's already initialized, optionally passing a function context.
    	whenReady: function (callback, context) {
    		if (this._loaded) {
    			callback.call(context || this, {target: this});
    		} else {
    			this.on('load', callback, context);
    		}
    		return this;
    	},


    	// private methods for getting map state

    	_getMapPanePos: function () {
    		return getPosition(this._mapPane) || new Point(0, 0);
    	},

    	_moved: function () {
    		var pos = this._getMapPanePos();
    		return pos && !pos.equals([0, 0]);
    	},

    	_getTopLeftPoint: function (center, zoom) {
    		var pixelOrigin = center && zoom !== undefined ?
    			this._getNewPixelOrigin(center, zoom) :
    			this.getPixelOrigin();
    		return pixelOrigin.subtract(this._getMapPanePos());
    	},

    	_getNewPixelOrigin: function (center, zoom) {
    		var viewHalf = this.getSize()._divideBy(2);
    		return this.project(center, zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();
    	},

    	_latLngToNewLayerPoint: function (latlng, zoom, center) {
    		var topLeft = this._getNewPixelOrigin(center, zoom);
    		return this.project(latlng, zoom)._subtract(topLeft);
    	},

    	_latLngBoundsToNewLayerBounds: function (latLngBounds, zoom, center) {
    		var topLeft = this._getNewPixelOrigin(center, zoom);
    		return toBounds([
    			this.project(latLngBounds.getSouthWest(), zoom)._subtract(topLeft),
    			this.project(latLngBounds.getNorthWest(), zoom)._subtract(topLeft),
    			this.project(latLngBounds.getSouthEast(), zoom)._subtract(topLeft),
    			this.project(latLngBounds.getNorthEast(), zoom)._subtract(topLeft)
    		]);
    	},

    	// layer point of the current center
    	_getCenterLayerPoint: function () {
    		return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
    	},

    	// offset of the specified place to the current center in pixels
    	_getCenterOffset: function (latlng) {
    		return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
    	},

    	// adjust center for view to get inside bounds
    	_limitCenter: function (center, zoom, bounds) {

    		if (!bounds) { return center; }

    		var centerPoint = this.project(center, zoom),
    		    viewHalf = this.getSize().divideBy(2),
    		    viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
    		    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

    		// If offset is less than a pixel, ignore.
    		// This prevents unstable projections from getting into
    		// an infinite loop of tiny offsets.
    		if (offset.round().equals([0, 0])) {
    			return center;
    		}

    		return this.unproject(centerPoint.add(offset), zoom);
    	},

    	// adjust offset for view to get inside bounds
    	_limitOffset: function (offset, bounds) {
    		if (!bounds) { return offset; }

    		var viewBounds = this.getPixelBounds(),
    		    newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

    		return offset.add(this._getBoundsOffset(newBounds, bounds));
    	},

    	// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
    	_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
    		var projectedMaxBounds = toBounds(
    		        this.project(maxBounds.getNorthEast(), zoom),
    		        this.project(maxBounds.getSouthWest(), zoom)
    		    ),
    		    minOffset = projectedMaxBounds.min.subtract(pxBounds.min),
    		    maxOffset = projectedMaxBounds.max.subtract(pxBounds.max),

    		    dx = this._rebound(minOffset.x, -maxOffset.x),
    		    dy = this._rebound(minOffset.y, -maxOffset.y);

    		return new Point(dx, dy);
    	},

    	_rebound: function (left, right) {
    		return left + right > 0 ?
    			Math.round(left - right) / 2 :
    			Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
    	},

    	_limitZoom: function (zoom) {
    		var min = this.getMinZoom(),
    		    max = this.getMaxZoom(),
    		    snap = any3d ? this.options.zoomSnap : 1;
    		if (snap) {
    			zoom = Math.round(zoom / snap) * snap;
    		}
    		return Math.max(min, Math.min(max, zoom));
    	},

    	_onPanTransitionStep: function () {
    		this.fire('move');
    	},

    	_onPanTransitionEnd: function () {
    		removeClass(this._mapPane, 'leaflet-pan-anim');
    		this.fire('moveend');
    	},

    	_tryAnimatedPan: function (center, options) {
    		// difference between the new and current centers in pixels
    		var offset = this._getCenterOffset(center)._trunc();

    		// don't animate too far unless animate: true specified in options
    		if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

    		this.panBy(offset, options);

    		return true;
    	},

    	_createAnimProxy: function () {

    		var proxy = this._proxy = create$1('div', 'leaflet-proxy leaflet-zoom-animated');
    		this._panes.mapPane.appendChild(proxy);

    		this.on('zoomanim', function (e) {
    			var prop = TRANSFORM,
    			    transform = this._proxy.style[prop];

    			setTransform(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));

    			// workaround for case when transform is the same and so transitionend event is not fired
    			if (transform === this._proxy.style[prop] && this._animatingZoom) {
    				this._onZoomTransitionEnd();
    			}
    		}, this);

    		this.on('load moveend', this._animMoveEnd, this);

    		this._on('unload', this._destroyAnimProxy, this);
    	},

    	_destroyAnimProxy: function () {
    		remove(this._proxy);
    		this.off('load moveend', this._animMoveEnd, this);
    		delete this._proxy;
    	},

    	_animMoveEnd: function () {
    		var c = this.getCenter(),
    		    z = this.getZoom();
    		setTransform(this._proxy, this.project(c, z), this.getZoomScale(z, 1));
    	},

    	_catchTransitionEnd: function (e) {
    		if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
    			this._onZoomTransitionEnd();
    		}
    	},

    	_nothingToAnimate: function () {
    		return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
    	},

    	_tryAnimatedZoom: function (center, zoom, options) {

    		if (this._animatingZoom) { return true; }

    		options = options || {};

    		// don't animate if disabled, not supported or zoom difference is too large
    		if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
    		        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

    		// offset is the pixel coords of the zoom origin relative to the current center
    		var scale = this.getZoomScale(zoom),
    		    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

    		// don't animate if the zoom origin isn't within one screen from the current center, unless forced
    		if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

    		requestAnimFrame(function () {
    			this
    			    ._moveStart(true, false)
    			    ._animateZoom(center, zoom, true);
    		}, this);

    		return true;
    	},

    	_animateZoom: function (center, zoom, startAnim, noUpdate) {
    		if (!this._mapPane) { return; }

    		if (startAnim) {
    			this._animatingZoom = true;

    			// remember what center/zoom to set after animation
    			this._animateToCenter = center;
    			this._animateToZoom = zoom;

    			addClass(this._mapPane, 'leaflet-zoom-anim');
    		}

    		// @section Other Events
    		// @event zoomanim: ZoomAnimEvent
    		// Fired at least once per zoom animation. For continuous zoom, like pinch zooming, fired once per frame during zoom.
    		this.fire('zoomanim', {
    			center: center,
    			zoom: zoom,
    			noUpdate: noUpdate
    		});

    		// Work around webkit not firing 'transitionend', see https://github.com/Leaflet/Leaflet/issues/3689, 2693
    		setTimeout(bind(this._onZoomTransitionEnd, this), 250);
    	},

    	_onZoomTransitionEnd: function () {
    		if (!this._animatingZoom) { return; }

    		if (this._mapPane) {
    			removeClass(this._mapPane, 'leaflet-zoom-anim');
    		}

    		this._animatingZoom = false;

    		this._move(this._animateToCenter, this._animateToZoom);

    		// This anim frame should prevent an obscure iOS webkit tile loading race condition.
    		requestAnimFrame(function () {
    			this._moveEnd(true);
    		}, this);
    	}
    });

    // @section

    // @factory L.map(id: String, options?: Map options)
    // Instantiates a map object given the DOM ID of a `<div>` element
    // and optionally an object literal with `Map options`.
    //
    // @alternative
    // @factory L.map(el: HTMLElement, options?: Map options)
    // Instantiates a map object given an instance of a `<div>` HTML element
    // and optionally an object literal with `Map options`.
    function createMap(id, options) {
    	return new Map(id, options);
    }

    /*
     * @class Control
     * @aka L.Control
     * @inherits Class
     *
     * L.Control is a base class for implementing map controls. Handles positioning.
     * All other controls extend from this class.
     */

    var Control = Class.extend({
    	// @section
    	// @aka Control options
    	options: {
    		// @option position: String = 'topright'
    		// The position of the control (one of the map corners). Possible values are `'topleft'`,
    		// `'topright'`, `'bottomleft'` or `'bottomright'`
    		position: 'topright'
    	},

    	initialize: function (options) {
    		setOptions(this, options);
    	},

    	/* @section
    	 * Classes extending L.Control will inherit the following methods:
    	 *
    	 * @method getPosition: string
    	 * Returns the position of the control.
    	 */
    	getPosition: function () {
    		return this.options.position;
    	},

    	// @method setPosition(position: string): this
    	// Sets the position of the control.
    	setPosition: function (position) {
    		var map = this._map;

    		if (map) {
    			map.removeControl(this);
    		}

    		this.options.position = position;

    		if (map) {
    			map.addControl(this);
    		}

    		return this;
    	},

    	// @method getContainer: HTMLElement
    	// Returns the HTMLElement that contains the control.
    	getContainer: function () {
    		return this._container;
    	},

    	// @method addTo(map: Map): this
    	// Adds the control to the given map.
    	addTo: function (map) {
    		this.remove();
    		this._map = map;

    		var container = this._container = this.onAdd(map),
    		    pos = this.getPosition(),
    		    corner = map._controlCorners[pos];

    		addClass(container, 'leaflet-control');

    		if (pos.indexOf('bottom') !== -1) {
    			corner.insertBefore(container, corner.firstChild);
    		} else {
    			corner.appendChild(container);
    		}

    		this._map.on('unload', this.remove, this);

    		return this;
    	},

    	// @method remove: this
    	// Removes the control from the map it is currently active on.
    	remove: function () {
    		if (!this._map) {
    			return this;
    		}

    		remove(this._container);

    		if (this.onRemove) {
    			this.onRemove(this._map);
    		}

    		this._map.off('unload', this.remove, this);
    		this._map = null;

    		return this;
    	},

    	_refocusOnMap: function (e) {
    		// if map exists and event is not a keyboard event
    		if (this._map && e && e.screenX > 0 && e.screenY > 0) {
    			this._map.getContainer().focus();
    		}
    	}
    });

    var control = function (options) {
    	return new Control(options);
    };

    /* @section Extension methods
     * @uninheritable
     *
     * Every control should extend from `L.Control` and (re-)implement the following methods.
     *
     * @method onAdd(map: Map): HTMLElement
     * Should return the container DOM element for the control and add listeners on relevant map events. Called on [`control.addTo(map)`](#control-addTo).
     *
     * @method onRemove(map: Map)
     * Optional method. Should contain all clean up code that removes the listeners previously added in [`onAdd`](#control-onadd). Called on [`control.remove()`](#control-remove).
     */

    /* @namespace Map
     * @section Methods for Layers and Controls
     */
    Map.include({
    	// @method addControl(control: Control): this
    	// Adds the given control to the map
    	addControl: function (control) {
    		control.addTo(this);
    		return this;
    	},

    	// @method removeControl(control: Control): this
    	// Removes the given control from the map
    	removeControl: function (control) {
    		control.remove();
    		return this;
    	},

    	_initControlPos: function () {
    		var corners = this._controlCorners = {},
    		    l = 'leaflet-',
    		    container = this._controlContainer =
    		            create$1('div', l + 'control-container', this._container);

    		function createCorner(vSide, hSide) {
    			var className = l + vSide + ' ' + l + hSide;

    			corners[vSide + hSide] = create$1('div', className, container);
    		}

    		createCorner('top', 'left');
    		createCorner('top', 'right');
    		createCorner('bottom', 'left');
    		createCorner('bottom', 'right');
    	},

    	_clearControlPos: function () {
    		for (var i in this._controlCorners) {
    			remove(this._controlCorners[i]);
    		}
    		remove(this._controlContainer);
    		delete this._controlCorners;
    		delete this._controlContainer;
    	}
    });

    /*
     * @class Control.Layers
     * @aka L.Control.Layers
     * @inherits Control
     *
     * The layers control gives users the ability to switch between different base layers and switch overlays on/off (check out the [detailed example](http://leafletjs.com/examples/layers-control/)). Extends `Control`.
     *
     * @example
     *
     * ```js
     * var baseLayers = {
     * 	"Mapbox": mapbox,
     * 	"OpenStreetMap": osm
     * };
     *
     * var overlays = {
     * 	"Marker": marker,
     * 	"Roads": roadsLayer
     * };
     *
     * L.control.layers(baseLayers, overlays).addTo(map);
     * ```
     *
     * The `baseLayers` and `overlays` parameters are object literals with layer names as keys and `Layer` objects as values:
     *
     * ```js
     * {
     *     "<someName1>": layer1,
     *     "<someName2>": layer2
     * }
     * ```
     *
     * The layer names can contain HTML, which allows you to add additional styling to the items:
     *
     * ```js
     * {"<img src='my-layer-icon' /> <span class='my-layer-item'>My Layer</span>": myLayer}
     * ```
     */

    var Layers = Control.extend({
    	// @section
    	// @aka Control.Layers options
    	options: {
    		// @option collapsed: Boolean = true
    		// If `true`, the control will be collapsed into an icon and expanded on mouse hover or touch.
    		collapsed: true,
    		position: 'topright',

    		// @option autoZIndex: Boolean = true
    		// If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
    		autoZIndex: true,

    		// @option hideSingleBase: Boolean = false
    		// If `true`, the base layers in the control will be hidden when there is only one.
    		hideSingleBase: false,

    		// @option sortLayers: Boolean = false
    		// Whether to sort the layers. When `false`, layers will keep the order
    		// in which they were added to the control.
    		sortLayers: false,

    		// @option sortFunction: Function = *
    		// A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
    		// that will be used for sorting the layers, when `sortLayers` is `true`.
    		// The function receives both the `L.Layer` instances and their names, as in
    		// `sortFunction(layerA, layerB, nameA, nameB)`.
    		// By default, it sorts layers alphabetically by their name.
    		sortFunction: function (layerA, layerB, nameA, nameB) {
    			return nameA < nameB ? -1 : (nameB < nameA ? 1 : 0);
    		}
    	},

    	initialize: function (baseLayers, overlays, options) {
    		setOptions(this, options);

    		this._layerControlInputs = [];
    		this._layers = [];
    		this._lastZIndex = 0;
    		this._handlingClick = false;

    		for (var i in baseLayers) {
    			this._addLayer(baseLayers[i], i);
    		}

    		for (i in overlays) {
    			this._addLayer(overlays[i], i, true);
    		}
    	},

    	onAdd: function (map) {
    		this._initLayout();
    		this._update();

    		this._map = map;
    		map.on('zoomend', this._checkDisabledLayers, this);

    		for (var i = 0; i < this._layers.length; i++) {
    			this._layers[i].layer.on('add remove', this._onLayerChange, this);
    		}

    		return this._container;
    	},

    	addTo: function (map) {
    		Control.prototype.addTo.call(this, map);
    		// Trigger expand after Layers Control has been inserted into DOM so that is now has an actual height.
    		return this._expandIfNotCollapsed();
    	},

    	onRemove: function () {
    		this._map.off('zoomend', this._checkDisabledLayers, this);

    		for (var i = 0; i < this._layers.length; i++) {
    			this._layers[i].layer.off('add remove', this._onLayerChange, this);
    		}
    	},

    	// @method addBaseLayer(layer: Layer, name: String): this
    	// Adds a base layer (radio button entry) with the given name to the control.
    	addBaseLayer: function (layer, name) {
    		this._addLayer(layer, name);
    		return (this._map) ? this._update() : this;
    	},

    	// @method addOverlay(layer: Layer, name: String): this
    	// Adds an overlay (checkbox entry) with the given name to the control.
    	addOverlay: function (layer, name) {
    		this._addLayer(layer, name, true);
    		return (this._map) ? this._update() : this;
    	},

    	// @method removeLayer(layer: Layer): this
    	// Remove the given layer from the control.
    	removeLayer: function (layer) {
    		layer.off('add remove', this._onLayerChange, this);

    		var obj = this._getLayer(stamp(layer));
    		if (obj) {
    			this._layers.splice(this._layers.indexOf(obj), 1);
    		}
    		return (this._map) ? this._update() : this;
    	},

    	// @method expand(): this
    	// Expand the control container if collapsed.
    	expand: function () {
    		addClass(this._container, 'leaflet-control-layers-expanded');
    		this._section.style.height = null;
    		var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
    		if (acceptableHeight < this._section.clientHeight) {
    			addClass(this._section, 'leaflet-control-layers-scrollbar');
    			this._section.style.height = acceptableHeight + 'px';
    		} else {
    			removeClass(this._section, 'leaflet-control-layers-scrollbar');
    		}
    		this._checkDisabledLayers();
    		return this;
    	},

    	// @method collapse(): this
    	// Collapse the control container if expanded.
    	collapse: function () {
    		removeClass(this._container, 'leaflet-control-layers-expanded');
    		return this;
    	},

    	_initLayout: function () {
    		var className = 'leaflet-control-layers',
    		    container = this._container = create$1('div', className),
    		    collapsed = this.options.collapsed;

    		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
    		container.setAttribute('aria-haspopup', true);

    		disableClickPropagation(container);
    		disableScrollPropagation(container);

    		var section = this._section = create$1('section', className + '-list');

    		if (collapsed) {
    			this._map.on('click', this.collapse, this);

    			if (!android) {
    				on(container, {
    					mouseenter: this.expand,
    					mouseleave: this.collapse
    				}, this);
    			}
    		}

    		var link = this._layersLink = create$1('a', className + '-toggle', container);
    		link.href = '#';
    		link.title = 'Layers';

    		if (touch) {
    			on(link, 'click', stop);
    			on(link, 'click', this.expand, this);
    		} else {
    			on(link, 'focus', this.expand, this);
    		}

    		if (!collapsed) {
    			this.expand();
    		}

    		this._baseLayersList = create$1('div', className + '-base', section);
    		this._separator = create$1('div', className + '-separator', section);
    		this._overlaysList = create$1('div', className + '-overlays', section);

    		container.appendChild(section);
    	},

    	_getLayer: function (id) {
    		for (var i = 0; i < this._layers.length; i++) {

    			if (this._layers[i] && stamp(this._layers[i].layer) === id) {
    				return this._layers[i];
    			}
    		}
    	},

    	_addLayer: function (layer, name, overlay) {
    		if (this._map) {
    			layer.on('add remove', this._onLayerChange, this);
    		}

    		this._layers.push({
    			layer: layer,
    			name: name,
    			overlay: overlay
    		});

    		if (this.options.sortLayers) {
    			this._layers.sort(bind(function (a, b) {
    				return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
    			}, this));
    		}

    		if (this.options.autoZIndex && layer.setZIndex) {
    			this._lastZIndex++;
    			layer.setZIndex(this._lastZIndex);
    		}

    		this._expandIfNotCollapsed();
    	},

    	_update: function () {
    		if (!this._container) { return this; }

    		empty(this._baseLayersList);
    		empty(this._overlaysList);

    		this._layerControlInputs = [];
    		var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

    		for (i = 0; i < this._layers.length; i++) {
    			obj = this._layers[i];
    			this._addItem(obj);
    			overlaysPresent = overlaysPresent || obj.overlay;
    			baseLayersPresent = baseLayersPresent || !obj.overlay;
    			baseLayersCount += !obj.overlay ? 1 : 0;
    		}

    		// Hide base layers section if there's only one layer.
    		if (this.options.hideSingleBase) {
    			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
    			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
    		}

    		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

    		return this;
    	},

    	_onLayerChange: function (e) {
    		if (!this._handlingClick) {
    			this._update();
    		}

    		var obj = this._getLayer(stamp(e.target));

    		// @namespace Map
    		// @section Layer events
    		// @event baselayerchange: LayersControlEvent
    		// Fired when the base layer is changed through the [layers control](#control-layers).
    		// @event overlayadd: LayersControlEvent
    		// Fired when an overlay is selected through the [layers control](#control-layers).
    		// @event overlayremove: LayersControlEvent
    		// Fired when an overlay is deselected through the [layers control](#control-layers).
    		// @namespace Control.Layers
    		var type = obj.overlay ?
    			(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
    			(e.type === 'add' ? 'baselayerchange' : null);

    		if (type) {
    			this._map.fire(type, obj);
    		}
    	},

    	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
    	_createRadioElement: function (name, checked) {

    		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
    				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

    		var radioFragment = document.createElement('div');
    		radioFragment.innerHTML = radioHtml;

    		return radioFragment.firstChild;
    	},

    	_addItem: function (obj) {
    		var label = document.createElement('label'),
    		    checked = this._map.hasLayer(obj.layer),
    		    input;

    		if (obj.overlay) {
    			input = document.createElement('input');
    			input.type = 'checkbox';
    			input.className = 'leaflet-control-layers-selector';
    			input.defaultChecked = checked;
    		} else {
    			input = this._createRadioElement('leaflet-base-layers_' + stamp(this), checked);
    		}

    		this._layerControlInputs.push(input);
    		input.layerId = stamp(obj.layer);

    		on(input, 'click', this._onInputClick, this);

    		var name = document.createElement('span');
    		name.innerHTML = ' ' + obj.name;

    		// Helps from preventing layer control flicker when checkboxes are disabled
    		// https://github.com/Leaflet/Leaflet/issues/2771
    		var holder = document.createElement('div');

    		label.appendChild(holder);
    		holder.appendChild(input);
    		holder.appendChild(name);

    		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    		container.appendChild(label);

    		this._checkDisabledLayers();
    		return label;
    	},

    	_onInputClick: function () {
    		var inputs = this._layerControlInputs,
    		    input, layer;
    		var addedLayers = [],
    		    removedLayers = [];

    		this._handlingClick = true;

    		for (var i = inputs.length - 1; i >= 0; i--) {
    			input = inputs[i];
    			layer = this._getLayer(input.layerId).layer;

    			if (input.checked) {
    				addedLayers.push(layer);
    			} else if (!input.checked) {
    				removedLayers.push(layer);
    			}
    		}

    		// Bugfix issue 2318: Should remove all old layers before readding new ones
    		for (i = 0; i < removedLayers.length; i++) {
    			if (this._map.hasLayer(removedLayers[i])) {
    				this._map.removeLayer(removedLayers[i]);
    			}
    		}
    		for (i = 0; i < addedLayers.length; i++) {
    			if (!this._map.hasLayer(addedLayers[i])) {
    				this._map.addLayer(addedLayers[i]);
    			}
    		}

    		this._handlingClick = false;

    		this._refocusOnMap();
    	},

    	_checkDisabledLayers: function () {
    		var inputs = this._layerControlInputs,
    		    input,
    		    layer,
    		    zoom = this._map.getZoom();

    		for (var i = inputs.length - 1; i >= 0; i--) {
    			input = inputs[i];
    			layer = this._getLayer(input.layerId).layer;
    			input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
    			                 (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

    		}
    	},

    	_expandIfNotCollapsed: function () {
    		if (this._map && !this.options.collapsed) {
    			this.expand();
    		}
    		return this;
    	},

    	_expand: function () {
    		// Backward compatibility, remove me in 1.1.
    		return this.expand();
    	},

    	_collapse: function () {
    		// Backward compatibility, remove me in 1.1.
    		return this.collapse();
    	}

    });


    // @factory L.control.layers(baselayers?: Object, overlays?: Object, options?: Control.Layers options)
    // Creates a layers control with the given layers. Base layers will be switched with radio buttons, while overlays will be switched with checkboxes. Note that all base layers should be passed in the base layers object, but only one should be added to the map during map instantiation.
    var layers = function (baseLayers, overlays, options) {
    	return new Layers(baseLayers, overlays, options);
    };

    /*
     * @class Control.Zoom
     * @aka L.Control.Zoom
     * @inherits Control
     *
     * A basic zoom control with two buttons (zoom in and zoom out). It is put on the map by default unless you set its [`zoomControl` option](#map-zoomcontrol) to `false`. Extends `Control`.
     */

    var Zoom = Control.extend({
    	// @section
    	// @aka Control.Zoom options
    	options: {
    		position: 'topleft',

    		// @option zoomInText: String = '+'
    		// The text set on the 'zoom in' button.
    		zoomInText: '+',

    		// @option zoomInTitle: String = 'Zoom in'
    		// The title set on the 'zoom in' button.
    		zoomInTitle: 'Zoom in',

    		// @option zoomOutText: String = '&#x2212;'
    		// The text set on the 'zoom out' button.
    		zoomOutText: '&#x2212;',

    		// @option zoomOutTitle: String = 'Zoom out'
    		// The title set on the 'zoom out' button.
    		zoomOutTitle: 'Zoom out'
    	},

    	onAdd: function (map) {
    		var zoomName = 'leaflet-control-zoom',
    		    container = create$1('div', zoomName + ' leaflet-bar'),
    		    options = this.options;

    		this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
    		        zoomName + '-in',  container, this._zoomIn);
    		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
    		        zoomName + '-out', container, this._zoomOut);

    		this._updateDisabled();
    		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

    		return container;
    	},

    	onRemove: function (map) {
    		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
    	},

    	disable: function () {
    		this._disabled = true;
    		this._updateDisabled();
    		return this;
    	},

    	enable: function () {
    		this._disabled = false;
    		this._updateDisabled();
    		return this;
    	},

    	_zoomIn: function (e) {
    		if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
    			this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
    		}
    	},

    	_zoomOut: function (e) {
    		if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
    			this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
    		}
    	},

    	_createButton: function (html, title, className, container, fn) {
    		var link = create$1('a', className, container);
    		link.innerHTML = html;
    		link.href = '#';
    		link.title = title;

    		/*
    		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
    		 */
    		link.setAttribute('role', 'button');
    		link.setAttribute('aria-label', title);

    		disableClickPropagation(link);
    		on(link, 'click', stop);
    		on(link, 'click', fn, this);
    		on(link, 'click', this._refocusOnMap, this);

    		return link;
    	},

    	_updateDisabled: function () {
    		var map = this._map,
    		    className = 'leaflet-disabled';

    		removeClass(this._zoomInButton, className);
    		removeClass(this._zoomOutButton, className);

    		if (this._disabled || map._zoom === map.getMinZoom()) {
    			addClass(this._zoomOutButton, className);
    		}
    		if (this._disabled || map._zoom === map.getMaxZoom()) {
    			addClass(this._zoomInButton, className);
    		}
    	}
    });

    // @namespace Map
    // @section Control options
    // @option zoomControl: Boolean = true
    // Whether a [zoom control](#control-zoom) is added to the map by default.
    Map.mergeOptions({
    	zoomControl: true
    });

    Map.addInitHook(function () {
    	if (this.options.zoomControl) {
    		// @section Controls
    		// @property zoomControl: Control.Zoom
    		// The default zoom control (only available if the
    		// [`zoomControl` option](#map-zoomcontrol) was `true` when creating the map).
    		this.zoomControl = new Zoom();
    		this.addControl(this.zoomControl);
    	}
    });

    // @namespace Control.Zoom
    // @factory L.control.zoom(options: Control.Zoom options)
    // Creates a zoom control
    var zoom = function (options) {
    	return new Zoom(options);
    };

    /*
     * @class Control.Scale
     * @aka L.Control.Scale
     * @inherits Control
     *
     * A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems. Extends `Control`.
     *
     * @example
     *
     * ```js
     * L.control.scale().addTo(map);
     * ```
     */

    var Scale = Control.extend({
    	// @section
    	// @aka Control.Scale options
    	options: {
    		position: 'bottomleft',

    		// @option maxWidth: Number = 100
    		// Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
    		maxWidth: 100,

    		// @option metric: Boolean = True
    		// Whether to show the metric scale line (m/km).
    		metric: true,

    		// @option imperial: Boolean = True
    		// Whether to show the imperial scale line (mi/ft).
    		imperial: true

    		// @option updateWhenIdle: Boolean = false
    		// If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
    	},

    	onAdd: function (map) {
    		var className = 'leaflet-control-scale',
    		    container = create$1('div', className),
    		    options = this.options;

    		this._addScales(options, className + '-line', container);

    		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
    		map.whenReady(this._update, this);

    		return container;
    	},

    	onRemove: function (map) {
    		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
    	},

    	_addScales: function (options, className, container) {
    		if (options.metric) {
    			this._mScale = create$1('div', className, container);
    		}
    		if (options.imperial) {
    			this._iScale = create$1('div', className, container);
    		}
    	},

    	_update: function () {
    		var map = this._map,
    		    y = map.getSize().y / 2;

    		var maxMeters = map.distance(
    			map.containerPointToLatLng([0, y]),
    			map.containerPointToLatLng([this.options.maxWidth, y]));

    		this._updateScales(maxMeters);
    	},

    	_updateScales: function (maxMeters) {
    		if (this.options.metric && maxMeters) {
    			this._updateMetric(maxMeters);
    		}
    		if (this.options.imperial && maxMeters) {
    			this._updateImperial(maxMeters);
    		}
    	},

    	_updateMetric: function (maxMeters) {
    		var meters = this._getRoundNum(maxMeters),
    		    label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';

    		this._updateScale(this._mScale, label, meters / maxMeters);
    	},

    	_updateImperial: function (maxMeters) {
    		var maxFeet = maxMeters * 3.2808399,
    		    maxMiles, miles, feet;

    		if (maxFeet > 5280) {
    			maxMiles = maxFeet / 5280;
    			miles = this._getRoundNum(maxMiles);
    			this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);

    		} else {
    			feet = this._getRoundNum(maxFeet);
    			this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
    		}
    	},

    	_updateScale: function (scale, text, ratio) {
    		scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
    		scale.innerHTML = text;
    	},

    	_getRoundNum: function (num) {
    		var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
    		    d = num / pow10;

    		d = d >= 10 ? 10 :
    		    d >= 5 ? 5 :
    		    d >= 3 ? 3 :
    		    d >= 2 ? 2 : 1;

    		return pow10 * d;
    	}
    });


    // @factory L.control.scale(options?: Control.Scale options)
    // Creates an scale control with the given options.
    var scale = function (options) {
    	return new Scale(options);
    };

    /*
     * @class Control.Attribution
     * @aka L.Control.Attribution
     * @inherits Control
     *
     * The attribution control allows you to display attribution data in a small text box on a map. It is put on the map by default unless you set its [`attributionControl` option](#map-attributioncontrol) to `false`, and it fetches attribution texts from layers with the [`getAttribution` method](#layer-getattribution) automatically. Extends Control.
     */

    var Attribution = Control.extend({
    	// @section
    	// @aka Control.Attribution options
    	options: {
    		position: 'bottomright',

    		// @option prefix: String = 'Leaflet'
    		// The HTML text shown before the attributions. Pass `false` to disable.
    		prefix: '<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
    	},

    	initialize: function (options) {
    		setOptions(this, options);

    		this._attributions = {};
    	},

    	onAdd: function (map) {
    		map.attributionControl = this;
    		this._container = create$1('div', 'leaflet-control-attribution');
    		disableClickPropagation(this._container);

    		// TODO ugly, refactor
    		for (var i in map._layers) {
    			if (map._layers[i].getAttribution) {
    				this.addAttribution(map._layers[i].getAttribution());
    			}
    		}

    		this._update();

    		return this._container;
    	},

    	// @method setPrefix(prefix: String): this
    	// Sets the text before the attributions.
    	setPrefix: function (prefix) {
    		this.options.prefix = prefix;
    		this._update();
    		return this;
    	},

    	// @method addAttribution(text: String): this
    	// Adds an attribution text (e.g. `'Vector data &copy; Mapbox'`).
    	addAttribution: function (text) {
    		if (!text) { return this; }

    		if (!this._attributions[text]) {
    			this._attributions[text] = 0;
    		}
    		this._attributions[text]++;

    		this._update();

    		return this;
    	},

    	// @method removeAttribution(text: String): this
    	// Removes an attribution text.
    	removeAttribution: function (text) {
    		if (!text) { return this; }

    		if (this._attributions[text]) {
    			this._attributions[text]--;
    			this._update();
    		}

    		return this;
    	},

    	_update: function () {
    		if (!this._map) { return; }

    		var attribs = [];

    		for (var i in this._attributions) {
    			if (this._attributions[i]) {
    				attribs.push(i);
    			}
    		}

    		var prefixAndAttribs = [];

    		if (this.options.prefix) {
    			prefixAndAttribs.push(this.options.prefix);
    		}
    		if (attribs.length) {
    			prefixAndAttribs.push(attribs.join(', '));
    		}

    		this._container.innerHTML = prefixAndAttribs.join(' | ');
    	}
    });

    // @namespace Map
    // @section Control options
    // @option attributionControl: Boolean = true
    // Whether a [attribution control](#control-attribution) is added to the map by default.
    Map.mergeOptions({
    	attributionControl: true
    });

    Map.addInitHook(function () {
    	if (this.options.attributionControl) {
    		new Attribution().addTo(this);
    	}
    });

    // @namespace Control.Attribution
    // @factory L.control.attribution(options: Control.Attribution options)
    // Creates an attribution control.
    var attribution = function (options) {
    	return new Attribution(options);
    };

    Control.Layers = Layers;
    Control.Zoom = Zoom;
    Control.Scale = Scale;
    Control.Attribution = Attribution;

    control.layers = layers;
    control.zoom = zoom;
    control.scale = scale;
    control.attribution = attribution;

    /*
    	L.Handler is a base class for handler classes that are used internally to inject
    	interaction features like dragging to classes like Map and Marker.
    */

    // @class Handler
    // @aka L.Handler
    // Abstract class for map interaction handlers

    var Handler = Class.extend({
    	initialize: function (map) {
    		this._map = map;
    	},

    	// @method enable(): this
    	// Enables the handler
    	enable: function () {
    		if (this._enabled) { return this; }

    		this._enabled = true;
    		this.addHooks();
    		return this;
    	},

    	// @method disable(): this
    	// Disables the handler
    	disable: function () {
    		if (!this._enabled) { return this; }

    		this._enabled = false;
    		this.removeHooks();
    		return this;
    	},

    	// @method enabled(): Boolean
    	// Returns `true` if the handler is enabled
    	enabled: function () {
    		return !!this._enabled;
    	}

    	// @section Extension methods
    	// Classes inheriting from `Handler` must implement the two following methods:
    	// @method addHooks()
    	// Called when the handler is enabled, should add event hooks.
    	// @method removeHooks()
    	// Called when the handler is disabled, should remove the event hooks added previously.
    });

    // @section There is static function which can be called without instantiating L.Handler:
    // @function addTo(map: Map, name: String): this
    // Adds a new Handler to the given map with the given name.
    Handler.addTo = function (map, name) {
    	map.addHandler(name, this);
    	return this;
    };

    var Mixin = {Events: Events};

    /*
     * @class Draggable
     * @aka L.Draggable
     * @inherits Evented
     *
     * A class for making DOM elements draggable (including touch support).
     * Used internally for map and marker dragging. Only works for elements
     * that were positioned with [`L.DomUtil.setPosition`](#domutil-setposition).
     *
     * @example
     * ```js
     * var draggable = new L.Draggable(elementToDrag);
     * draggable.enable();
     * ```
     */

    var START = touch ? 'touchstart mousedown' : 'mousedown';
    var END = {
    	mousedown: 'mouseup',
    	touchstart: 'touchend',
    	pointerdown: 'touchend',
    	MSPointerDown: 'touchend'
    };
    var MOVE = {
    	mousedown: 'mousemove',
    	touchstart: 'touchmove',
    	pointerdown: 'touchmove',
    	MSPointerDown: 'touchmove'
    };


    var Draggable = Evented.extend({

    	options: {
    		// @section
    		// @aka Draggable options
    		// @option clickTolerance: Number = 3
    		// The max number of pixels a user can shift the mouse pointer during a click
    		// for it to be considered a valid click (as opposed to a mouse drag).
    		clickTolerance: 3
    	},

    	// @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
    	// Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
    	initialize: function (element, dragStartTarget, preventOutline$$1, options) {
    		setOptions(this, options);

    		this._element = element;
    		this._dragStartTarget = dragStartTarget || element;
    		this._preventOutline = preventOutline$$1;
    	},

    	// @method enable()
    	// Enables the dragging ability
    	enable: function () {
    		if (this._enabled) { return; }

    		on(this._dragStartTarget, START, this._onDown, this);

    		this._enabled = true;
    	},

    	// @method disable()
    	// Disables the dragging ability
    	disable: function () {
    		if (!this._enabled) { return; }

    		// If we're currently dragging this draggable,
    		// disabling it counts as first ending the drag.
    		if (Draggable._dragging === this) {
    			this.finishDrag();
    		}

    		off(this._dragStartTarget, START, this._onDown, this);

    		this._enabled = false;
    		this._moved = false;
    	},

    	_onDown: function (e) {
    		// Ignore simulated events, since we handle both touch and
    		// mouse explicitly; otherwise we risk getting duplicates of
    		// touch events, see #4315.
    		// Also ignore the event if disabled; this happens in IE11
    		// under some circumstances, see #3666.
    		if (e._simulated || !this._enabled) { return; }

    		this._moved = false;

    		if (hasClass(this._element, 'leaflet-zoom-anim')) { return; }

    		if (Draggable._dragging || e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }
    		Draggable._dragging = this;  // Prevent dragging multiple objects at once.

    		if (this._preventOutline) {
    			preventOutline(this._element);
    		}

    		disableImageDrag();
    		disableTextSelection();

    		if (this._moving) { return; }

    		// @event down: Event
    		// Fired when a drag is about to start.
    		this.fire('down');

    		var first = e.touches ? e.touches[0] : e,
    		    sizedParent = getSizedParentNode(this._element);

    		this._startPoint = new Point(first.clientX, first.clientY);

    		// Cache the scale, so that we can continuously compensate for it during drag (_onMove).
    		this._parentScale = getScale(sizedParent);

    		on(document, MOVE[e.type], this._onMove, this);
    		on(document, END[e.type], this._onUp, this);
    	},

    	_onMove: function (e) {
    		// Ignore simulated events, since we handle both touch and
    		// mouse explicitly; otherwise we risk getting duplicates of
    		// touch events, see #4315.
    		// Also ignore the event if disabled; this happens in IE11
    		// under some circumstances, see #3666.
    		if (e._simulated || !this._enabled) { return; }

    		if (e.touches && e.touches.length > 1) {
    			this._moved = true;
    			return;
    		}

    		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
    		    offset = new Point(first.clientX, first.clientY)._subtract(this._startPoint);

    		if (!offset.x && !offset.y) { return; }
    		if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) { return; }

    		// We assume that the parent container's position, border and scale do not change for the duration of the drag.
    		// Therefore there is no need to account for the position and border (they are eliminated by the subtraction)
    		// and we can use the cached value for the scale.
    		offset.x /= this._parentScale.x;
    		offset.y /= this._parentScale.y;

    		preventDefault(e);

    		if (!this._moved) {
    			// @event dragstart: Event
    			// Fired when a drag starts
    			this.fire('dragstart');

    			this._moved = true;
    			this._startPos = getPosition(this._element).subtract(offset);

    			addClass(document.body, 'leaflet-dragging');

    			this._lastTarget = e.target || e.srcElement;
    			// IE and Edge do not give the <use> element, so fetch it
    			// if necessary
    			if (window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance) {
    				this._lastTarget = this._lastTarget.correspondingUseElement;
    			}
    			addClass(this._lastTarget, 'leaflet-drag-target');
    		}

    		this._newPos = this._startPos.add(offset);
    		this._moving = true;

    		cancelAnimFrame(this._animRequest);
    		this._lastEvent = e;
    		this._animRequest = requestAnimFrame(this._updatePosition, this, true);
    	},

    	_updatePosition: function () {
    		var e = {originalEvent: this._lastEvent};

    		// @event predrag: Event
    		// Fired continuously during dragging *before* each corresponding
    		// update of the element's position.
    		this.fire('predrag', e);
    		setPosition(this._element, this._newPos);

    		// @event drag: Event
    		// Fired continuously during dragging.
    		this.fire('drag', e);
    	},

    	_onUp: function (e) {
    		// Ignore simulated events, since we handle both touch and
    		// mouse explicitly; otherwise we risk getting duplicates of
    		// touch events, see #4315.
    		// Also ignore the event if disabled; this happens in IE11
    		// under some circumstances, see #3666.
    		if (e._simulated || !this._enabled) { return; }
    		this.finishDrag();
    	},

    	finishDrag: function () {
    		removeClass(document.body, 'leaflet-dragging');

    		if (this._lastTarget) {
    			removeClass(this._lastTarget, 'leaflet-drag-target');
    			this._lastTarget = null;
    		}

    		for (var i in MOVE) {
    			off(document, MOVE[i], this._onMove, this);
    			off(document, END[i], this._onUp, this);
    		}

    		enableImageDrag();
    		enableTextSelection();

    		if (this._moved && this._moving) {
    			// ensure drag is not fired after dragend
    			cancelAnimFrame(this._animRequest);

    			// @event dragend: DragEndEvent
    			// Fired when the drag ends.
    			this.fire('dragend', {
    				distance: this._newPos.distanceTo(this._startPos)
    			});
    		}

    		this._moving = false;
    		Draggable._dragging = false;
    	}

    });

    /*
     * @namespace LineUtil
     *
     * Various utility functions for polyline points processing, used by Leaflet internally to make polylines lightning-fast.
     */

    // Simplify polyline with vertex reduction and Douglas-Peucker simplification.
    // Improves rendering performance dramatically by lessening the number of points to draw.

    // @function simplify(points: Point[], tolerance: Number): Point[]
    // Dramatically reduces the number of points in a polyline while retaining
    // its shape and returns a new array of simplified points, using the
    // [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
    // Used for a huge performance boost when processing/displaying Leaflet polylines for
    // each zoom level and also reducing visual noise. tolerance affects the amount of
    // simplification (lesser value means higher quality but slower and with more points).
    // Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
    function simplify(points, tolerance) {
    	if (!tolerance || !points.length) {
    		return points.slice();
    	}

    	var sqTolerance = tolerance * tolerance;

    	    // stage 1: vertex reduction
    	    points = _reducePoints(points, sqTolerance);

    	    // stage 2: Douglas-Peucker simplification
    	    points = _simplifyDP(points, sqTolerance);

    	return points;
    }

    // @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
    // Returns the distance between point `p` and segment `p1` to `p2`.
    function pointToSegmentDistance(p, p1, p2) {
    	return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
    }

    // @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
    // Returns the closest point from a point `p` on a segment `p1` to `p2`.
    function closestPointOnSegment(p, p1, p2) {
    	return _sqClosestPointOnSegment(p, p1, p2);
    }

    // Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
    function _simplifyDP(points, sqTolerance) {

    	var len = points.length,
    	    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
    	    markers = new ArrayConstructor(len);

    	    markers[0] = markers[len - 1] = 1;

    	_simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

    	var i,
    	    newPoints = [];

    	for (i = 0; i < len; i++) {
    		if (markers[i]) {
    			newPoints.push(points[i]);
    		}
    	}

    	return newPoints;
    }

    function _simplifyDPStep(points, markers, sqTolerance, first, last) {

    	var maxSqDist = 0,
    	index, i, sqDist;

    	for (i = first + 1; i <= last - 1; i++) {
    		sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

    		if (sqDist > maxSqDist) {
    			index = i;
    			maxSqDist = sqDist;
    		}
    	}

    	if (maxSqDist > sqTolerance) {
    		markers[index] = 1;

    		_simplifyDPStep(points, markers, sqTolerance, first, index);
    		_simplifyDPStep(points, markers, sqTolerance, index, last);
    	}
    }

    // reduce points that are too close to each other to a single point
    function _reducePoints(points, sqTolerance) {
    	var reducedPoints = [points[0]];

    	for (var i = 1, prev = 0, len = points.length; i < len; i++) {
    		if (_sqDist(points[i], points[prev]) > sqTolerance) {
    			reducedPoints.push(points[i]);
    			prev = i;
    		}
    	}
    	if (prev < len - 1) {
    		reducedPoints.push(points[len - 1]);
    	}
    	return reducedPoints;
    }

    var _lastCode;

    // @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
    // Clips the segment a to b by rectangular bounds with the
    // [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
    // (modifying the segment points directly!). Used by Leaflet to only show polyline
    // points that are on the screen or near, increasing performance.
    function clipSegment(a, b, bounds, useLastCode, round) {
    	var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
    	    codeB = _getBitCode(b, bounds),

    	    codeOut, p, newCode;

    	    // save 2nd code to avoid calculating it on the next segment
    	    _lastCode = codeB;

    	while (true) {
    		// if a,b is inside the clip window (trivial accept)
    		if (!(codeA | codeB)) {
    			return [a, b];
    		}

    		// if a,b is outside the clip window (trivial reject)
    		if (codeA & codeB) {
    			return false;
    		}

    		// other cases
    		codeOut = codeA || codeB;
    		p = _getEdgeIntersection(a, b, codeOut, bounds, round);
    		newCode = _getBitCode(p, bounds);

    		if (codeOut === codeA) {
    			a = p;
    			codeA = newCode;
    		} else {
    			b = p;
    			codeB = newCode;
    		}
    	}
    }

    function _getEdgeIntersection(a, b, code, bounds, round) {
    	var dx = b.x - a.x,
    	    dy = b.y - a.y,
    	    min = bounds.min,
    	    max = bounds.max,
    	    x, y;

    	if (code & 8) { // top
    		x = a.x + dx * (max.y - a.y) / dy;
    		y = max.y;

    	} else if (code & 4) { // bottom
    		x = a.x + dx * (min.y - a.y) / dy;
    		y = min.y;

    	} else if (code & 2) { // right
    		x = max.x;
    		y = a.y + dy * (max.x - a.x) / dx;

    	} else if (code & 1) { // left
    		x = min.x;
    		y = a.y + dy * (min.x - a.x) / dx;
    	}

    	return new Point(x, y, round);
    }

    function _getBitCode(p, bounds) {
    	var code = 0;

    	if (p.x < bounds.min.x) { // left
    		code |= 1;
    	} else if (p.x > bounds.max.x) { // right
    		code |= 2;
    	}

    	if (p.y < bounds.min.y) { // bottom
    		code |= 4;
    	} else if (p.y > bounds.max.y) { // top
    		code |= 8;
    	}

    	return code;
    }

    // square distance (to avoid unnecessary Math.sqrt calls)
    function _sqDist(p1, p2) {
    	var dx = p2.x - p1.x,
    	    dy = p2.y - p1.y;
    	return dx * dx + dy * dy;
    }

    // return closest point on segment or distance to that point
    function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
    	var x = p1.x,
    	    y = p1.y,
    	    dx = p2.x - x,
    	    dy = p2.y - y,
    	    dot = dx * dx + dy * dy,
    	    t;

    	if (dot > 0) {
    		t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

    		if (t > 1) {
    			x = p2.x;
    			y = p2.y;
    		} else if (t > 0) {
    			x += dx * t;
    			y += dy * t;
    		}
    	}

    	dx = p.x - x;
    	dy = p.y - y;

    	return sqDist ? dx * dx + dy * dy : new Point(x, y);
    }


    // @function isFlat(latlngs: LatLng[]): Boolean
    // Returns true if `latlngs` is a flat array, false is nested.
    function isFlat(latlngs) {
    	return !isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
    }

    function _flat(latlngs) {
    	console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.');
    	return isFlat(latlngs);
    }

    var LineUtil = ({
      simplify: simplify,
      pointToSegmentDistance: pointToSegmentDistance,
      closestPointOnSegment: closestPointOnSegment,
      clipSegment: clipSegment,
      _getEdgeIntersection: _getEdgeIntersection,
      _getBitCode: _getBitCode,
      _sqClosestPointOnSegment: _sqClosestPointOnSegment,
      isFlat: isFlat,
      _flat: _flat
    });

    /*
     * @namespace PolyUtil
     * Various utility functions for polygon geometries.
     */

    /* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
     * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
     * Used by Leaflet to only show polygon points that are on the screen or near, increasing
     * performance. Note that polygon points needs different algorithm for clipping
     * than polyline, so there's a separate method for it.
     */
    function clipPolygon(points, bounds, round) {
    	var clippedPoints,
    	    edges = [1, 4, 2, 8],
    	    i, j, k,
    	    a, b,
    	    len, edge, p;

    	for (i = 0, len = points.length; i < len; i++) {
    		points[i]._code = _getBitCode(points[i], bounds);
    	}

    	// for each edge (left, bottom, right, top)
    	for (k = 0; k < 4; k++) {
    		edge = edges[k];
    		clippedPoints = [];

    		for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
    			a = points[i];
    			b = points[j];

    			// if a is inside the clip window
    			if (!(a._code & edge)) {
    				// if b is outside the clip window (a->b goes out of screen)
    				if (b._code & edge) {
    					p = _getEdgeIntersection(b, a, edge, bounds, round);
    					p._code = _getBitCode(p, bounds);
    					clippedPoints.push(p);
    				}
    				clippedPoints.push(a);

    			// else if b is inside the clip window (a->b enters the screen)
    			} else if (!(b._code & edge)) {
    				p = _getEdgeIntersection(b, a, edge, bounds, round);
    				p._code = _getBitCode(p, bounds);
    				clippedPoints.push(p);
    			}
    		}
    		points = clippedPoints;
    	}

    	return points;
    }

    var PolyUtil = ({
      clipPolygon: clipPolygon
    });

    /*
     * @namespace Projection
     * @section
     * Leaflet comes with a set of already defined Projections out of the box:
     *
     * @projection L.Projection.LonLat
     *
     * Equirectangular, or Plate Carree projection — the most simple projection,
     * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
     * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
     * `EPSG:4326` and `Simple` CRS.
     */

    var LonLat = {
    	project: function (latlng) {
    		return new Point(latlng.lng, latlng.lat);
    	},

    	unproject: function (point) {
    		return new LatLng(point.y, point.x);
    	},

    	bounds: new Bounds([-180, -90], [180, 90])
    };

    /*
     * @namespace Projection
     * @projection L.Projection.Mercator
     *
     * Elliptical Mercator projection — more complex than Spherical Mercator. Assumes that Earth is an ellipsoid. Used by the EPSG:3395 CRS.
     */

    var Mercator = {
    	R: 6378137,
    	R_MINOR: 6356752.314245179,

    	bounds: new Bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

    	project: function (latlng) {
    		var d = Math.PI / 180,
    		    r = this.R,
    		    y = latlng.lat * d,
    		    tmp = this.R_MINOR / r,
    		    e = Math.sqrt(1 - tmp * tmp),
    		    con = e * Math.sin(y);

    		var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
    		y = -r * Math.log(Math.max(ts, 1E-10));

    		return new Point(latlng.lng * d * r, y);
    	},

    	unproject: function (point) {
    		var d = 180 / Math.PI,
    		    r = this.R,
    		    tmp = this.R_MINOR / r,
    		    e = Math.sqrt(1 - tmp * tmp),
    		    ts = Math.exp(-point.y / r),
    		    phi = Math.PI / 2 - 2 * Math.atan(ts);

    		for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
    			con = e * Math.sin(phi);
    			con = Math.pow((1 - con) / (1 + con), e / 2);
    			dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
    			phi += dphi;
    		}

    		return new LatLng(phi * d, point.x * d / r);
    	}
    };

    /*
     * @class Projection

     * An object with methods for projecting geographical coordinates of the world onto
     * a flat surface (and back). See [Map projection](http://en.wikipedia.org/wiki/Map_projection).

     * @property bounds: Bounds
     * The bounds (specified in CRS units) where the projection is valid

     * @method project(latlng: LatLng): Point
     * Projects geographical coordinates into a 2D point.
     * Only accepts actual `L.LatLng` instances, not arrays.

     * @method unproject(point: Point): LatLng
     * The inverse of `project`. Projects a 2D point into a geographical location.
     * Only accepts actual `L.Point` instances, not arrays.

     * Note that the projection instances do not inherit from Leaflet's `Class` object,
     * and can't be instantiated. Also, new classes can't inherit from them,
     * and methods can't be added to them with the `include` function.

     */

    var index = ({
      LonLat: LonLat,
      Mercator: Mercator,
      SphericalMercator: SphericalMercator
    });

    /*
     * @namespace CRS
     * @crs L.CRS.EPSG3395
     *
     * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
     */
    var EPSG3395 = extend({}, Earth, {
    	code: 'EPSG:3395',
    	projection: Mercator,

    	transformation: (function () {
    		var scale = 0.5 / (Math.PI * Mercator.R);
    		return toTransformation(scale, 0.5, -scale, 0.5);
    	}())
    });

    /*
     * @namespace CRS
     * @crs L.CRS.EPSG4326
     *
     * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
     *
     * Leaflet 1.0.x complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic),
     * which is a breaking change from 0.7.x behaviour.  If you are using a `TileLayer`
     * with this CRS, ensure that there are two 256x256 pixel tiles covering the
     * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
     * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
     */

    var EPSG4326 = extend({}, Earth, {
    	code: 'EPSG:4326',
    	projection: LonLat,
    	transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
    });

    /*
     * @namespace CRS
     * @crs L.CRS.Simple
     *
     * A simple CRS that maps longitude and latitude into `x` and `y` directly.
     * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
     * axis should still be inverted (going from bottom to top). `distance()` returns
     * simple euclidean distance.
     */

    var Simple = extend({}, CRS, {
    	projection: LonLat,
    	transformation: toTransformation(1, 0, -1, 0),

    	scale: function (zoom) {
    		return Math.pow(2, zoom);
    	},

    	zoom: function (scale) {
    		return Math.log(scale) / Math.LN2;
    	},

    	distance: function (latlng1, latlng2) {
    		var dx = latlng2.lng - latlng1.lng,
    		    dy = latlng2.lat - latlng1.lat;

    		return Math.sqrt(dx * dx + dy * dy);
    	},

    	infinite: true
    });

    CRS.Earth = Earth;
    CRS.EPSG3395 = EPSG3395;
    CRS.EPSG3857 = EPSG3857;
    CRS.EPSG900913 = EPSG900913;
    CRS.EPSG4326 = EPSG4326;
    CRS.Simple = Simple;

    /*
     * @class Layer
     * @inherits Evented
     * @aka L.Layer
     * @aka ILayer
     *
     * A set of methods from the Layer base class that all Leaflet layers use.
     * Inherits all methods, options and events from `L.Evented`.
     *
     * @example
     *
     * ```js
     * var layer = L.marker(latlng).addTo(map);
     * layer.addTo(map);
     * layer.remove();
     * ```
     *
     * @event add: Event
     * Fired after the layer is added to a map
     *
     * @event remove: Event
     * Fired after the layer is removed from a map
     */


    var Layer = Evented.extend({

    	// Classes extending `L.Layer` will inherit the following options:
    	options: {
    		// @option pane: String = 'overlayPane'
    		// By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
    		pane: 'overlayPane',

    		// @option attribution: String = null
    		// String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
    		attribution: null,

    		bubblingMouseEvents: true
    	},

    	/* @section
    	 * Classes extending `L.Layer` will inherit the following methods:
    	 *
    	 * @method addTo(map: Map|LayerGroup): this
    	 * Adds the layer to the given map or layer group.
    	 */
    	addTo: function (map) {
    		map.addLayer(this);
    		return this;
    	},

    	// @method remove: this
    	// Removes the layer from the map it is currently active on.
    	remove: function () {
    		return this.removeFrom(this._map || this._mapToAdd);
    	},

    	// @method removeFrom(map: Map): this
    	// Removes the layer from the given map
    	//
    	// @alternative
    	// @method removeFrom(group: LayerGroup): this
    	// Removes the layer from the given `LayerGroup`
    	removeFrom: function (obj) {
    		if (obj) {
    			obj.removeLayer(this);
    		}
    		return this;
    	},

    	// @method getPane(name? : String): HTMLElement
    	// Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
    	getPane: function (name) {
    		return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
    	},

    	addInteractiveTarget: function (targetEl) {
    		this._map._targets[stamp(targetEl)] = this;
    		return this;
    	},

    	removeInteractiveTarget: function (targetEl) {
    		delete this._map._targets[stamp(targetEl)];
    		return this;
    	},

    	// @method getAttribution: String
    	// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
    	getAttribution: function () {
    		return this.options.attribution;
    	},

    	_layerAdd: function (e) {
    		var map = e.target;

    		// check in case layer gets added and then removed before the map is ready
    		if (!map.hasLayer(this)) { return; }

    		this._map = map;
    		this._zoomAnimated = map._zoomAnimated;

    		if (this.getEvents) {
    			var events = this.getEvents();
    			map.on(events, this);
    			this.once('remove', function () {
    				map.off(events, this);
    			}, this);
    		}

    		this.onAdd(map);

    		if (this.getAttribution && map.attributionControl) {
    			map.attributionControl.addAttribution(this.getAttribution());
    		}

    		this.fire('add');
    		map.fire('layeradd', {layer: this});
    	}
    });

    /* @section Extension methods
     * @uninheritable
     *
     * Every layer should extend from `L.Layer` and (re-)implement the following methods.
     *
     * @method onAdd(map: Map): this
     * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
     *
     * @method onRemove(map: Map): this
     * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
     *
     * @method getEvents(): Object
     * This optional method should return an object like `{ viewreset: this._reset }` for [`addEventListener`](#evented-addeventlistener). The event handlers in this object will be automatically added and removed from the map with your layer.
     *
     * @method getAttribution(): String
     * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
     *
     * @method beforeAdd(map: Map): this
     * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
     */


    /* @namespace Map
     * @section Layer events
     *
     * @event layeradd: LayerEvent
     * Fired when a new layer is added to the map.
     *
     * @event layerremove: LayerEvent
     * Fired when some layer is removed from the map
     *
     * @section Methods for Layers and Controls
     */
    Map.include({
    	// @method addLayer(layer: Layer): this
    	// Adds the given layer to the map
    	addLayer: function (layer) {
    		if (!layer._layerAdd) {
    			throw new Error('The provided object is not a Layer.');
    		}

    		var id = stamp(layer);
    		if (this._layers[id]) { return this; }
    		this._layers[id] = layer;

    		layer._mapToAdd = this;

    		if (layer.beforeAdd) {
    			layer.beforeAdd(this);
    		}

    		this.whenReady(layer._layerAdd, layer);

    		return this;
    	},

    	// @method removeLayer(layer: Layer): this
    	// Removes the given layer from the map.
    	removeLayer: function (layer) {
    		var id = stamp(layer);

    		if (!this._layers[id]) { return this; }

    		if (this._loaded) {
    			layer.onRemove(this);
    		}

    		if (layer.getAttribution && this.attributionControl) {
    			this.attributionControl.removeAttribution(layer.getAttribution());
    		}

    		delete this._layers[id];

    		if (this._loaded) {
    			this.fire('layerremove', {layer: layer});
    			layer.fire('remove');
    		}

    		layer._map = layer._mapToAdd = null;

    		return this;
    	},

    	// @method hasLayer(layer: Layer): Boolean
    	// Returns `true` if the given layer is currently added to the map
    	hasLayer: function (layer) {
    		return !!layer && (stamp(layer) in this._layers);
    	},

    	/* @method eachLayer(fn: Function, context?: Object): this
    	 * Iterates over the layers of the map, optionally specifying context of the iterator function.
    	 * ```
    	 * map.eachLayer(function(layer){
    	 *     layer.bindPopup('Hello');
    	 * });
    	 * ```
    	 */
    	eachLayer: function (method, context) {
    		for (var i in this._layers) {
    			method.call(context, this._layers[i]);
    		}
    		return this;
    	},

    	_addLayers: function (layers) {
    		layers = layers ? (isArray(layers) ? layers : [layers]) : [];

    		for (var i = 0, len = layers.length; i < len; i++) {
    			this.addLayer(layers[i]);
    		}
    	},

    	_addZoomLimit: function (layer) {
    		if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
    			this._zoomBoundLayers[stamp(layer)] = layer;
    			this._updateZoomLevels();
    		}
    	},

    	_removeZoomLimit: function (layer) {
    		var id = stamp(layer);

    		if (this._zoomBoundLayers[id]) {
    			delete this._zoomBoundLayers[id];
    			this._updateZoomLevels();
    		}
    	},

    	_updateZoomLevels: function () {
    		var minZoom = Infinity,
    		    maxZoom = -Infinity,
    		    oldZoomSpan = this._getZoomSpan();

    		for (var i in this._zoomBoundLayers) {
    			var options = this._zoomBoundLayers[i].options;

    			minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
    			maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
    		}

    		this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
    		this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

    		// @section Map state change events
    		// @event zoomlevelschange: Event
    		// Fired when the number of zoomlevels on the map is changed due
    		// to adding or removing a layer.
    		if (oldZoomSpan !== this._getZoomSpan()) {
    			this.fire('zoomlevelschange');
    		}

    		if (this.options.maxZoom === undefined && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
    			this.setZoom(this._layersMaxZoom);
    		}
    		if (this.options.minZoom === undefined && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
    			this.setZoom(this._layersMinZoom);
    		}
    	}
    });

    /*
     * @class LayerGroup
     * @aka L.LayerGroup
     * @inherits Layer
     *
     * Used to group several layers and handle them as one. If you add it to the map,
     * any layers added or removed from the group will be added/removed on the map as
     * well. Extends `Layer`.
     *
     * @example
     *
     * ```js
     * L.layerGroup([marker1, marker2])
     * 	.addLayer(polyline)
     * 	.addTo(map);
     * ```
     */

    var LayerGroup = Layer.extend({

    	initialize: function (layers, options) {
    		setOptions(this, options);

    		this._layers = {};

    		var i, len;

    		if (layers) {
    			for (i = 0, len = layers.length; i < len; i++) {
    				this.addLayer(layers[i]);
    			}
    		}
    	},

    	// @method addLayer(layer: Layer): this
    	// Adds the given layer to the group.
    	addLayer: function (layer) {
    		var id = this.getLayerId(layer);

    		this._layers[id] = layer;

    		if (this._map) {
    			this._map.addLayer(layer);
    		}

    		return this;
    	},

    	// @method removeLayer(layer: Layer): this
    	// Removes the given layer from the group.
    	// @alternative
    	// @method removeLayer(id: Number): this
    	// Removes the layer with the given internal ID from the group.
    	removeLayer: function (layer) {
    		var id = layer in this._layers ? layer : this.getLayerId(layer);

    		if (this._map && this._layers[id]) {
    			this._map.removeLayer(this._layers[id]);
    		}

    		delete this._layers[id];

    		return this;
    	},

    	// @method hasLayer(layer: Layer): Boolean
    	// Returns `true` if the given layer is currently added to the group.
    	// @alternative
    	// @method hasLayer(id: Number): Boolean
    	// Returns `true` if the given internal ID is currently added to the group.
    	hasLayer: function (layer) {
    		if (!layer) { return false; }
    		var layerId = typeof layer === 'number' ? layer : this.getLayerId(layer);
    		return layerId in this._layers;
    	},

    	// @method clearLayers(): this
    	// Removes all the layers from the group.
    	clearLayers: function () {
    		return this.eachLayer(this.removeLayer, this);
    	},

    	// @method invoke(methodName: String, …): this
    	// Calls `methodName` on every layer contained in this group, passing any
    	// additional parameters. Has no effect if the layers contained do not
    	// implement `methodName`.
    	invoke: function (methodName) {
    		var args = Array.prototype.slice.call(arguments, 1),
    		    i, layer;

    		for (i in this._layers) {
    			layer = this._layers[i];

    			if (layer[methodName]) {
    				layer[methodName].apply(layer, args);
    			}
    		}

    		return this;
    	},

    	onAdd: function (map) {
    		this.eachLayer(map.addLayer, map);
    	},

    	onRemove: function (map) {
    		this.eachLayer(map.removeLayer, map);
    	},

    	// @method eachLayer(fn: Function, context?: Object): this
    	// Iterates over the layers of the group, optionally specifying context of the iterator function.
    	// ```js
    	// group.eachLayer(function (layer) {
    	// 	layer.bindPopup('Hello');
    	// });
    	// ```
    	eachLayer: function (method, context) {
    		for (var i in this._layers) {
    			method.call(context, this._layers[i]);
    		}
    		return this;
    	},

    	// @method getLayer(id: Number): Layer
    	// Returns the layer with the given internal ID.
    	getLayer: function (id) {
    		return this._layers[id];
    	},

    	// @method getLayers(): Layer[]
    	// Returns an array of all the layers added to the group.
    	getLayers: function () {
    		var layers = [];
    		this.eachLayer(layers.push, layers);
    		return layers;
    	},

    	// @method setZIndex(zIndex: Number): this
    	// Calls `setZIndex` on every layer contained in this group, passing the z-index.
    	setZIndex: function (zIndex) {
    		return this.invoke('setZIndex', zIndex);
    	},

    	// @method getLayerId(layer: Layer): Number
    	// Returns the internal ID for a layer
    	getLayerId: function (layer) {
    		return stamp(layer);
    	}
    });


    // @factory L.layerGroup(layers?: Layer[], options?: Object)
    // Create a layer group, optionally given an initial set of layers and an `options` object.
    var layerGroup = function (layers, options) {
    	return new LayerGroup(layers, options);
    };

    /*
     * @class FeatureGroup
     * @aka L.FeatureGroup
     * @inherits LayerGroup
     *
     * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
     *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
     *  * Events are propagated to the `FeatureGroup`, so if the group has an event
     * handler, it will handle events from any of the layers. This includes mouse events
     * and custom events.
     *  * Has `layeradd` and `layerremove` events
     *
     * @example
     *
     * ```js
     * L.featureGroup([marker1, marker2, polyline])
     * 	.bindPopup('Hello world!')
     * 	.on('click', function() { alert('Clicked on a member of the group!'); })
     * 	.addTo(map);
     * ```
     */

    var FeatureGroup = LayerGroup.extend({

    	addLayer: function (layer) {
    		if (this.hasLayer(layer)) {
    			return this;
    		}

    		layer.addEventParent(this);

    		LayerGroup.prototype.addLayer.call(this, layer);

    		// @event layeradd: LayerEvent
    		// Fired when a layer is added to this `FeatureGroup`
    		return this.fire('layeradd', {layer: layer});
    	},

    	removeLayer: function (layer) {
    		if (!this.hasLayer(layer)) {
    			return this;
    		}
    		if (layer in this._layers) {
    			layer = this._layers[layer];
    		}

    		layer.removeEventParent(this);

    		LayerGroup.prototype.removeLayer.call(this, layer);

    		// @event layerremove: LayerEvent
    		// Fired when a layer is removed from this `FeatureGroup`
    		return this.fire('layerremove', {layer: layer});
    	},

    	// @method setStyle(style: Path options): this
    	// Sets the given path options to each layer of the group that has a `setStyle` method.
    	setStyle: function (style) {
    		return this.invoke('setStyle', style);
    	},

    	// @method bringToFront(): this
    	// Brings the layer group to the top of all other layers
    	bringToFront: function () {
    		return this.invoke('bringToFront');
    	},

    	// @method bringToBack(): this
    	// Brings the layer group to the back of all other layers
    	bringToBack: function () {
    		return this.invoke('bringToBack');
    	},

    	// @method getBounds(): LatLngBounds
    	// Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
    	getBounds: function () {
    		var bounds = new LatLngBounds();

    		for (var id in this._layers) {
    			var layer = this._layers[id];
    			bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
    		}
    		return bounds;
    	}
    });

    // @factory L.featureGroup(layers?: Layer[], options?: Object)
    // Create a feature group, optionally given an initial set of layers and an `options` object.
    var featureGroup = function (layers, options) {
    	return new FeatureGroup(layers, options);
    };

    /*
     * @class Icon
     * @aka L.Icon
     *
     * Represents an icon to provide when creating a marker.
     *
     * @example
     *
     * ```js
     * var myIcon = L.icon({
     *     iconUrl: 'my-icon.png',
     *     iconRetinaUrl: 'my-icon@2x.png',
     *     iconSize: [38, 95],
     *     iconAnchor: [22, 94],
     *     popupAnchor: [-3, -76],
     *     shadowUrl: 'my-icon-shadow.png',
     *     shadowRetinaUrl: 'my-icon-shadow@2x.png',
     *     shadowSize: [68, 95],
     *     shadowAnchor: [22, 94]
     * });
     *
     * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
     * ```
     *
     * `L.Icon.Default` extends `L.Icon` and is the blue icon Leaflet uses for markers by default.
     *
     */

    var Icon = Class.extend({

    	/* @section
    	 * @aka Icon options
    	 *
    	 * @option iconUrl: String = null
    	 * **(required)** The URL to the icon image (absolute or relative to your script path).
    	 *
    	 * @option iconRetinaUrl: String = null
    	 * The URL to a retina sized version of the icon image (absolute or relative to your
    	 * script path). Used for Retina screen devices.
    	 *
    	 * @option iconSize: Point = null
    	 * Size of the icon image in pixels.
    	 *
    	 * @option iconAnchor: Point = null
    	 * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
    	 * will be aligned so that this point is at the marker's geographical location. Centered
    	 * by default if size is specified, also can be set in CSS with negative margins.
    	 *
    	 * @option popupAnchor: Point = [0, 0]
    	 * The coordinates of the point from which popups will "open", relative to the icon anchor.
    	 *
    	 * @option tooltipAnchor: Point = [0, 0]
    	 * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
    	 *
    	 * @option shadowUrl: String = null
    	 * The URL to the icon shadow image. If not specified, no shadow image will be created.
    	 *
    	 * @option shadowRetinaUrl: String = null
    	 *
    	 * @option shadowSize: Point = null
    	 * Size of the shadow image in pixels.
    	 *
    	 * @option shadowAnchor: Point = null
    	 * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
    	 * as iconAnchor if not specified).
    	 *
    	 * @option className: String = ''
    	 * A custom class name to assign to both icon and shadow images. Empty by default.
    	 */

    	options: {
    		popupAnchor: [0, 0],
    		tooltipAnchor: [0, 0]
    	},

    	initialize: function (options) {
    		setOptions(this, options);
    	},

    	// @method createIcon(oldIcon?: HTMLElement): HTMLElement
    	// Called internally when the icon has to be shown, returns a `<img>` HTML element
    	// styled according to the options.
    	createIcon: function (oldIcon) {
    		return this._createIcon('icon', oldIcon);
    	},

    	// @method createShadow(oldIcon?: HTMLElement): HTMLElement
    	// As `createIcon`, but for the shadow beneath it.
    	createShadow: function (oldIcon) {
    		return this._createIcon('shadow', oldIcon);
    	},

    	_createIcon: function (name, oldIcon) {
    		var src = this._getIconUrl(name);

    		if (!src) {
    			if (name === 'icon') {
    				throw new Error('iconUrl not set in Icon options (see the docs).');
    			}
    			return null;
    		}

    		var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
    		this._setIconStyles(img, name);

    		return img;
    	},

    	_setIconStyles: function (img, name) {
    		var options = this.options;
    		var sizeOption = options[name + 'Size'];

    		if (typeof sizeOption === 'number') {
    			sizeOption = [sizeOption, sizeOption];
    		}

    		var size = toPoint(sizeOption),
    		    anchor = toPoint(name === 'shadow' && options.shadowAnchor || options.iconAnchor ||
    		            size && size.divideBy(2, true));

    		img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');

    		if (anchor) {
    			img.style.marginLeft = (-anchor.x) + 'px';
    			img.style.marginTop  = (-anchor.y) + 'px';
    		}

    		if (size) {
    			img.style.width  = size.x + 'px';
    			img.style.height = size.y + 'px';
    		}
    	},

    	_createImg: function (src, el) {
    		el = el || document.createElement('img');
    		el.src = src;
    		return el;
    	},

    	_getIconUrl: function (name) {
    		return retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
    	}
    });


    // @factory L.icon(options: Icon options)
    // Creates an icon instance with the given options.
    function icon(options) {
    	return new Icon(options);
    }

    /*
     * @miniclass Icon.Default (Icon)
     * @aka L.Icon.Default
     * @section
     *
     * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
     * no icon is specified. Points to the blue marker image distributed with Leaflet
     * releases.
     *
     * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
     * (which is a set of `Icon options`).
     *
     * If you want to _completely_ replace the default icon, override the
     * `L.Marker.prototype.options.icon` with your own icon instead.
     */

    var IconDefault = Icon.extend({

    	options: {
    		iconUrl:       'marker-icon.png',
    		iconRetinaUrl: 'marker-icon-2x.png',
    		shadowUrl:     'marker-shadow.png',
    		iconSize:    [25, 41],
    		iconAnchor:  [12, 41],
    		popupAnchor: [1, -34],
    		tooltipAnchor: [16, -28],
    		shadowSize:  [41, 41]
    	},

    	_getIconUrl: function (name) {
    		if (!IconDefault.imagePath) {	// Deprecated, backwards-compatibility only
    			IconDefault.imagePath = this._detectIconPath();
    		}

    		// @option imagePath: String
    		// `Icon.Default` will try to auto-detect the location of the
    		// blue icon images. If you are placing these images in a non-standard
    		// way, set this option to point to the right path.
    		return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
    	},

    	_detectIconPath: function () {
    		var el = create$1('div',  'leaflet-default-icon-path', document.body);
    		var path = getStyle(el, 'background-image') ||
    		           getStyle(el, 'backgroundImage');	// IE8

    		document.body.removeChild(el);

    		if (path === null || path.indexOf('url') !== 0) {
    			path = '';
    		} else {
    			path = path.replace(/^url\(["']?/, '').replace(/marker-icon\.png["']?\)$/, '');
    		}

    		return path;
    	}
    });

    /*
     * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
     */


    /* @namespace Marker
     * @section Interaction handlers
     *
     * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
     *
     * ```js
     * marker.dragging.disable();
     * ```
     *
     * @property dragging: Handler
     * Marker dragging handler (by both mouse and touch). Only valid when the marker is on the map (Otherwise set [`marker.options.draggable`](#marker-draggable)).
     */

    var MarkerDrag = Handler.extend({
    	initialize: function (marker) {
    		this._marker = marker;
    	},

    	addHooks: function () {
    		var icon = this._marker._icon;

    		if (!this._draggable) {
    			this._draggable = new Draggable(icon, icon, true);
    		}

    		this._draggable.on({
    			dragstart: this._onDragStart,
    			predrag: this._onPreDrag,
    			drag: this._onDrag,
    			dragend: this._onDragEnd
    		}, this).enable();

    		addClass(icon, 'leaflet-marker-draggable');
    	},

    	removeHooks: function () {
    		this._draggable.off({
    			dragstart: this._onDragStart,
    			predrag: this._onPreDrag,
    			drag: this._onDrag,
    			dragend: this._onDragEnd
    		}, this).disable();

    		if (this._marker._icon) {
    			removeClass(this._marker._icon, 'leaflet-marker-draggable');
    		}
    	},

    	moved: function () {
    		return this._draggable && this._draggable._moved;
    	},

    	_adjustPan: function (e) {
    		var marker = this._marker,
    		    map = marker._map,
    		    speed = this._marker.options.autoPanSpeed,
    		    padding = this._marker.options.autoPanPadding,
    		    iconPos = getPosition(marker._icon),
    		    bounds = map.getPixelBounds(),
    		    origin = map.getPixelOrigin();

    		var panBounds = toBounds(
    			bounds.min._subtract(origin).add(padding),
    			bounds.max._subtract(origin).subtract(padding)
    		);

    		if (!panBounds.contains(iconPos)) {
    			// Compute incremental movement
    			var movement = toPoint(
    				(Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) -
    				(Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),

    				(Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) -
    				(Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
    			).multiplyBy(speed);

    			map.panBy(movement, {animate: false});

    			this._draggable._newPos._add(movement);
    			this._draggable._startPos._add(movement);

    			setPosition(marker._icon, this._draggable._newPos);
    			this._onDrag(e);

    			this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
    		}
    	},

    	_onDragStart: function () {
    		// @section Dragging events
    		// @event dragstart: Event
    		// Fired when the user starts dragging the marker.

    		// @event movestart: Event
    		// Fired when the marker starts moving (because of dragging).

    		this._oldLatLng = this._marker.getLatLng();

    		// When using ES6 imports it could not be set when `Popup` was not imported as well
    		this._marker.closePopup && this._marker.closePopup();

    		this._marker
    			.fire('movestart')
    			.fire('dragstart');
    	},

    	_onPreDrag: function (e) {
    		if (this._marker.options.autoPan) {
    			cancelAnimFrame(this._panRequest);
    			this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
    		}
    	},

    	_onDrag: function (e) {
    		var marker = this._marker,
    		    shadow = marker._shadow,
    		    iconPos = getPosition(marker._icon),
    		    latlng = marker._map.layerPointToLatLng(iconPos);

    		// update shadow position
    		if (shadow) {
    			setPosition(shadow, iconPos);
    		}

    		marker._latlng = latlng;
    		e.latlng = latlng;
    		e.oldLatLng = this._oldLatLng;

    		// @event drag: Event
    		// Fired repeatedly while the user drags the marker.
    		marker
    		    .fire('move', e)
    		    .fire('drag', e);
    	},

    	_onDragEnd: function (e) {
    		// @event dragend: DragEndEvent
    		// Fired when the user stops dragging the marker.

    		 cancelAnimFrame(this._panRequest);

    		// @event moveend: Event
    		// Fired when the marker stops moving (because of dragging).
    		delete this._oldLatLng;
    		this._marker
    		    .fire('moveend')
    		    .fire('dragend', e);
    	}
    });

    /*
     * @class Marker
     * @inherits Interactive layer
     * @aka L.Marker
     * L.Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
     *
     * @example
     *
     * ```js
     * L.marker([50.5, 30.5]).addTo(map);
     * ```
     */

    var Marker = Layer.extend({

    	// @section
    	// @aka Marker options
    	options: {
    		// @option icon: Icon = *
    		// Icon instance to use for rendering the marker.
    		// See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
    		// If not specified, a common instance of `L.Icon.Default` is used.
    		icon: new IconDefault(),

    		// Option inherited from "Interactive layer" abstract class
    		interactive: true,

    		// @option keyboard: Boolean = true
    		// Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
    		keyboard: true,

    		// @option title: String = ''
    		// Text for the browser tooltip that appear on marker hover (no tooltip by default).
    		title: '',

    		// @option alt: String = ''
    		// Text for the `alt` attribute of the icon image (useful for accessibility).
    		alt: '',

    		// @option zIndexOffset: Number = 0
    		// By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
    		zIndexOffset: 0,

    		// @option opacity: Number = 1.0
    		// The opacity of the marker.
    		opacity: 1,

    		// @option riseOnHover: Boolean = false
    		// If `true`, the marker will get on top of others when you hover the mouse over it.
    		riseOnHover: false,

    		// @option riseOffset: Number = 250
    		// The z-index offset used for the `riseOnHover` feature.
    		riseOffset: 250,

    		// @option pane: String = 'markerPane'
    		// `Map pane` where the markers icon will be added.
    		pane: 'markerPane',

    		// @option shadowPane: String = 'shadowPane'
    		// `Map pane` where the markers shadow will be added.
    		shadowPane: 'shadowPane',

    		// @option bubblingMouseEvents: Boolean = false
    		// When `true`, a mouse event on this marker will trigger the same event on the map
    		// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
    		bubblingMouseEvents: false,

    		// @section Draggable marker options
    		// @option draggable: Boolean = false
    		// Whether the marker is draggable with mouse/touch or not.
    		draggable: false,

    		// @option autoPan: Boolean = false
    		// Whether to pan the map when dragging this marker near its edge or not.
    		autoPan: false,

    		// @option autoPanPadding: Point = Point(50, 50)
    		// Distance (in pixels to the left/right and to the top/bottom) of the
    		// map edge to start panning the map.
    		autoPanPadding: [50, 50],

    		// @option autoPanSpeed: Number = 10
    		// Number of pixels the map should pan by.
    		autoPanSpeed: 10
    	},

    	/* @section
    	 *
    	 * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
    	 */

    	initialize: function (latlng, options) {
    		setOptions(this, options);
    		this._latlng = toLatLng(latlng);
    	},

    	onAdd: function (map) {
    		this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

    		if (this._zoomAnimated) {
    			map.on('zoomanim', this._animateZoom, this);
    		}

    		this._initIcon();
    		this.update();
    	},

    	onRemove: function (map) {
    		if (this.dragging && this.dragging.enabled()) {
    			this.options.draggable = true;
    			this.dragging.removeHooks();
    		}
    		delete this.dragging;

    		if (this._zoomAnimated) {
    			map.off('zoomanim', this._animateZoom, this);
    		}

    		this._removeIcon();
    		this._removeShadow();
    	},

    	getEvents: function () {
    		return {
    			zoom: this.update,
    			viewreset: this.update
    		};
    	},

    	// @method getLatLng: LatLng
    	// Returns the current geographical position of the marker.
    	getLatLng: function () {
    		return this._latlng;
    	},

    	// @method setLatLng(latlng: LatLng): this
    	// Changes the marker position to the given point.
    	setLatLng: function (latlng) {
    		var oldLatLng = this._latlng;
    		this._latlng = toLatLng(latlng);
    		this.update();

    		// @event move: Event
    		// Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
    		return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
    	},

    	// @method setZIndexOffset(offset: Number): this
    	// Changes the [zIndex offset](#marker-zindexoffset) of the marker.
    	setZIndexOffset: function (offset) {
    		this.options.zIndexOffset = offset;
    		return this.update();
    	},

    	// @method getIcon: Icon
    	// Returns the current icon used by the marker
    	getIcon: function () {
    		return this.options.icon;
    	},

    	// @method setIcon(icon: Icon): this
    	// Changes the marker icon.
    	setIcon: function (icon) {

    		this.options.icon = icon;

    		if (this._map) {
    			this._initIcon();
    			this.update();
    		}

    		if (this._popup) {
    			this.bindPopup(this._popup, this._popup.options);
    		}

    		return this;
    	},

    	getElement: function () {
    		return this._icon;
    	},

    	update: function () {

    		if (this._icon && this._map) {
    			var pos = this._map.latLngToLayerPoint(this._latlng).round();
    			this._setPos(pos);
    		}

    		return this;
    	},

    	_initIcon: function () {
    		var options = this.options,
    		    classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

    		var icon = options.icon.createIcon(this._icon),
    		    addIcon = false;

    		// if we're not reusing the icon, remove the old one and init new one
    		if (icon !== this._icon) {
    			if (this._icon) {
    				this._removeIcon();
    			}
    			addIcon = true;

    			if (options.title) {
    				icon.title = options.title;
    			}

    			if (icon.tagName === 'IMG') {
    				icon.alt = options.alt || '';
    			}
    		}

    		addClass(icon, classToAdd);

    		if (options.keyboard) {
    			icon.tabIndex = '0';
    		}

    		this._icon = icon;

    		if (options.riseOnHover) {
    			this.on({
    				mouseover: this._bringToFront,
    				mouseout: this._resetZIndex
    			});
    		}

    		var newShadow = options.icon.createShadow(this._shadow),
    		    addShadow = false;

    		if (newShadow !== this._shadow) {
    			this._removeShadow();
    			addShadow = true;
    		}

    		if (newShadow) {
    			addClass(newShadow, classToAdd);
    			newShadow.alt = '';
    		}
    		this._shadow = newShadow;


    		if (options.opacity < 1) {
    			this._updateOpacity();
    		}


    		if (addIcon) {
    			this.getPane().appendChild(this._icon);
    		}
    		this._initInteraction();
    		if (newShadow && addShadow) {
    			this.getPane(options.shadowPane).appendChild(this._shadow);
    		}
    	},

    	_removeIcon: function () {
    		if (this.options.riseOnHover) {
    			this.off({
    				mouseover: this._bringToFront,
    				mouseout: this._resetZIndex
    			});
    		}

    		remove(this._icon);
    		this.removeInteractiveTarget(this._icon);

    		this._icon = null;
    	},

    	_removeShadow: function () {
    		if (this._shadow) {
    			remove(this._shadow);
    		}
    		this._shadow = null;
    	},

    	_setPos: function (pos) {

    		if (this._icon) {
    			setPosition(this._icon, pos);
    		}

    		if (this._shadow) {
    			setPosition(this._shadow, pos);
    		}

    		this._zIndex = pos.y + this.options.zIndexOffset;

    		this._resetZIndex();
    	},

    	_updateZIndex: function (offset) {
    		if (this._icon) {
    			this._icon.style.zIndex = this._zIndex + offset;
    		}
    	},

    	_animateZoom: function (opt) {
    		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

    		this._setPos(pos);
    	},

    	_initInteraction: function () {

    		if (!this.options.interactive) { return; }

    		addClass(this._icon, 'leaflet-interactive');

    		this.addInteractiveTarget(this._icon);

    		if (MarkerDrag) {
    			var draggable = this.options.draggable;
    			if (this.dragging) {
    				draggable = this.dragging.enabled();
    				this.dragging.disable();
    			}

    			this.dragging = new MarkerDrag(this);

    			if (draggable) {
    				this.dragging.enable();
    			}
    		}
    	},

    	// @method setOpacity(opacity: Number): this
    	// Changes the opacity of the marker.
    	setOpacity: function (opacity) {
    		this.options.opacity = opacity;
    		if (this._map) {
    			this._updateOpacity();
    		}

    		return this;
    	},

    	_updateOpacity: function () {
    		var opacity = this.options.opacity;

    		if (this._icon) {
    			setOpacity(this._icon, opacity);
    		}

    		if (this._shadow) {
    			setOpacity(this._shadow, opacity);
    		}
    	},

    	_bringToFront: function () {
    		this._updateZIndex(this.options.riseOffset);
    	},

    	_resetZIndex: function () {
    		this._updateZIndex(0);
    	},

    	_getPopupAnchor: function () {
    		return this.options.icon.options.popupAnchor;
    	},

    	_getTooltipAnchor: function () {
    		return this.options.icon.options.tooltipAnchor;
    	}
    });


    // factory L.marker(latlng: LatLng, options? : Marker options)

    // @factory L.marker(latlng: LatLng, options? : Marker options)
    // Instantiates a Marker object given a geographical point and optionally an options object.
    function marker(latlng, options) {
    	return new Marker(latlng, options);
    }

    /*
     * @class Path
     * @aka L.Path
     * @inherits Interactive layer
     *
     * An abstract class that contains options and constants shared between vector
     * overlays (Polygon, Polyline, Circle). Do not use it directly. Extends `Layer`.
     */

    var Path = Layer.extend({

    	// @section
    	// @aka Path options
    	options: {
    		// @option stroke: Boolean = true
    		// Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
    		stroke: true,

    		// @option color: String = '#3388ff'
    		// Stroke color
    		color: '#3388ff',

    		// @option weight: Number = 3
    		// Stroke width in pixels
    		weight: 3,

    		// @option opacity: Number = 1.0
    		// Stroke opacity
    		opacity: 1,

    		// @option lineCap: String= 'round'
    		// A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
    		lineCap: 'round',

    		// @option lineJoin: String = 'round'
    		// A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
    		lineJoin: 'round',

    		// @option dashArray: String = null
    		// A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
    		dashArray: null,

    		// @option dashOffset: String = null
    		// A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
    		dashOffset: null,

    		// @option fill: Boolean = depends
    		// Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
    		fill: false,

    		// @option fillColor: String = *
    		// Fill color. Defaults to the value of the [`color`](#path-color) option
    		fillColor: null,

    		// @option fillOpacity: Number = 0.2
    		// Fill opacity.
    		fillOpacity: 0.2,

    		// @option fillRule: String = 'evenodd'
    		// A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
    		fillRule: 'evenodd',

    		// className: '',

    		// Option inherited from "Interactive layer" abstract class
    		interactive: true,

    		// @option bubblingMouseEvents: Boolean = true
    		// When `true`, a mouse event on this path will trigger the same event on the map
    		// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
    		bubblingMouseEvents: true
    	},

    	beforeAdd: function (map) {
    		// Renderer is set here because we need to call renderer.getEvents
    		// before this.getEvents.
    		this._renderer = map.getRenderer(this);
    	},

    	onAdd: function () {
    		this._renderer._initPath(this);
    		this._reset();
    		this._renderer._addPath(this);
    	},

    	onRemove: function () {
    		this._renderer._removePath(this);
    	},

    	// @method redraw(): this
    	// Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
    	redraw: function () {
    		if (this._map) {
    			this._renderer._updatePath(this);
    		}
    		return this;
    	},

    	// @method setStyle(style: Path options): this
    	// Changes the appearance of a Path based on the options in the `Path options` object.
    	setStyle: function (style) {
    		setOptions(this, style);
    		if (this._renderer) {
    			this._renderer._updateStyle(this);
    			if (this.options.stroke && style && Object.prototype.hasOwnProperty.call(style, 'weight')) {
    				this._updateBounds();
    			}
    		}
    		return this;
    	},

    	// @method bringToFront(): this
    	// Brings the layer to the top of all path layers.
    	bringToFront: function () {
    		if (this._renderer) {
    			this._renderer._bringToFront(this);
    		}
    		return this;
    	},

    	// @method bringToBack(): this
    	// Brings the layer to the bottom of all path layers.
    	bringToBack: function () {
    		if (this._renderer) {
    			this._renderer._bringToBack(this);
    		}
    		return this;
    	},

    	getElement: function () {
    		return this._path;
    	},

    	_reset: function () {
    		// defined in child classes
    		this._project();
    		this._update();
    	},

    	_clickTolerance: function () {
    		// used when doing hit detection for Canvas layers
    		return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance;
    	}
    });

    /*
     * @class CircleMarker
     * @aka L.CircleMarker
     * @inherits Path
     *
     * A circle of a fixed size with radius specified in pixels. Extends `Path`.
     */

    var CircleMarker = Path.extend({

    	// @section
    	// @aka CircleMarker options
    	options: {
    		fill: true,

    		// @option radius: Number = 10
    		// Radius of the circle marker, in pixels
    		radius: 10
    	},

    	initialize: function (latlng, options) {
    		setOptions(this, options);
    		this._latlng = toLatLng(latlng);
    		this._radius = this.options.radius;
    	},

    	// @method setLatLng(latLng: LatLng): this
    	// Sets the position of a circle marker to a new location.
    	setLatLng: function (latlng) {
    		var oldLatLng = this._latlng;
    		this._latlng = toLatLng(latlng);
    		this.redraw();

    		// @event move: Event
    		// Fired when the marker is moved via [`setLatLng`](#circlemarker-setlatlng). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
    		return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
    	},

    	// @method getLatLng(): LatLng
    	// Returns the current geographical position of the circle marker
    	getLatLng: function () {
    		return this._latlng;
    	},

    	// @method setRadius(radius: Number): this
    	// Sets the radius of a circle marker. Units are in pixels.
    	setRadius: function (radius) {
    		this.options.radius = this._radius = radius;
    		return this.redraw();
    	},

    	// @method getRadius(): Number
    	// Returns the current radius of the circle
    	getRadius: function () {
    		return this._radius;
    	},

    	setStyle : function (options) {
    		var radius = options && options.radius || this._radius;
    		Path.prototype.setStyle.call(this, options);
    		this.setRadius(radius);
    		return this;
    	},

    	_project: function () {
    		this._point = this._map.latLngToLayerPoint(this._latlng);
    		this._updateBounds();
    	},

    	_updateBounds: function () {
    		var r = this._radius,
    		    r2 = this._radiusY || r,
    		    w = this._clickTolerance(),
    		    p = [r + w, r2 + w];
    		this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
    	},

    	_update: function () {
    		if (this._map) {
    			this._updatePath();
    		}
    	},

    	_updatePath: function () {
    		this._renderer._updateCircle(this);
    	},

    	_empty: function () {
    		return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
    	},

    	// Needed by the `Canvas` renderer for interactivity
    	_containsPoint: function (p) {
    		return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
    	}
    });


    // @factory L.circleMarker(latlng: LatLng, options?: CircleMarker options)
    // Instantiates a circle marker object given a geographical point, and an optional options object.
    function circleMarker(latlng, options) {
    	return new CircleMarker(latlng, options);
    }

    /*
     * @class Circle
     * @aka L.Circle
     * @inherits CircleMarker
     *
     * A class for drawing circle overlays on a map. Extends `CircleMarker`.
     *
     * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
     *
     * @example
     *
     * ```js
     * L.circle([50.5, 30.5], {radius: 200}).addTo(map);
     * ```
     */

    var Circle = CircleMarker.extend({

    	initialize: function (latlng, options, legacyOptions) {
    		if (typeof options === 'number') {
    			// Backwards compatibility with 0.7.x factory (latlng, radius, options?)
    			options = extend({}, legacyOptions, {radius: options});
    		}
    		setOptions(this, options);
    		this._latlng = toLatLng(latlng);

    		if (isNaN(this.options.radius)) { throw new Error('Circle radius cannot be NaN'); }

    		// @section
    		// @aka Circle options
    		// @option radius: Number; Radius of the circle, in meters.
    		this._mRadius = this.options.radius;
    	},

    	// @method setRadius(radius: Number): this
    	// Sets the radius of a circle. Units are in meters.
    	setRadius: function (radius) {
    		this._mRadius = radius;
    		return this.redraw();
    	},

    	// @method getRadius(): Number
    	// Returns the current radius of a circle. Units are in meters.
    	getRadius: function () {
    		return this._mRadius;
    	},

    	// @method getBounds(): LatLngBounds
    	// Returns the `LatLngBounds` of the path.
    	getBounds: function () {
    		var half = [this._radius, this._radiusY || this._radius];

    		return new LatLngBounds(
    			this._map.layerPointToLatLng(this._point.subtract(half)),
    			this._map.layerPointToLatLng(this._point.add(half)));
    	},

    	setStyle: Path.prototype.setStyle,

    	_project: function () {

    		var lng = this._latlng.lng,
    		    lat = this._latlng.lat,
    		    map = this._map,
    		    crs = map.options.crs;

    		if (crs.distance === Earth.distance) {
    			var d = Math.PI / 180,
    			    latR = (this._mRadius / Earth.R) / d,
    			    top = map.project([lat + latR, lng]),
    			    bottom = map.project([lat - latR, lng]),
    			    p = top.add(bottom).divideBy(2),
    			    lat2 = map.unproject(p).lat,
    			    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
    			            (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

    			if (isNaN(lngR) || lngR === 0) {
    				lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
    			}

    			this._point = p.subtract(map.getPixelOrigin());
    			this._radius = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
    			this._radiusY = p.y - top.y;

    		} else {
    			var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

    			this._point = map.latLngToLayerPoint(this._latlng);
    			this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
    		}

    		this._updateBounds();
    	}
    });

    // @factory L.circle(latlng: LatLng, options?: Circle options)
    // Instantiates a circle object given a geographical point, and an options object
    // which contains the circle radius.
    // @alternative
    // @factory L.circle(latlng: LatLng, radius: Number, options?: Circle options)
    // Obsolete way of instantiating a circle, for compatibility with 0.7.x code.
    // Do not use in new applications or plugins.
    function circle(latlng, options, legacyOptions) {
    	return new Circle(latlng, options, legacyOptions);
    }

    /*
     * @class Polyline
     * @aka L.Polyline
     * @inherits Path
     *
     * A class for drawing polyline overlays on a map. Extends `Path`.
     *
     * @example
     *
     * ```js
     * // create a red polyline from an array of LatLng points
     * var latlngs = [
     * 	[45.51, -122.68],
     * 	[37.77, -122.43],
     * 	[34.04, -118.2]
     * ];
     *
     * var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
     *
     * // zoom the map to the polyline
     * map.fitBounds(polyline.getBounds());
     * ```
     *
     * You can also pass a multi-dimensional array to represent a `MultiPolyline` shape:
     *
     * ```js
     * // create a red polyline from an array of arrays of LatLng points
     * var latlngs = [
     * 	[[45.51, -122.68],
     * 	 [37.77, -122.43],
     * 	 [34.04, -118.2]],
     * 	[[40.78, -73.91],
     * 	 [41.83, -87.62],
     * 	 [32.76, -96.72]]
     * ];
     * ```
     */


    var Polyline = Path.extend({

    	// @section
    	// @aka Polyline options
    	options: {
    		// @option smoothFactor: Number = 1.0
    		// How much to simplify the polyline on each zoom level. More means
    		// better performance and smoother look, and less means more accurate representation.
    		smoothFactor: 1.0,

    		// @option noClip: Boolean = false
    		// Disable polyline clipping.
    		noClip: false
    	},

    	initialize: function (latlngs, options) {
    		setOptions(this, options);
    		this._setLatLngs(latlngs);
    	},

    	// @method getLatLngs(): LatLng[]
    	// Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
    	getLatLngs: function () {
    		return this._latlngs;
    	},

    	// @method setLatLngs(latlngs: LatLng[]): this
    	// Replaces all the points in the polyline with the given array of geographical points.
    	setLatLngs: function (latlngs) {
    		this._setLatLngs(latlngs);
    		return this.redraw();
    	},

    	// @method isEmpty(): Boolean
    	// Returns `true` if the Polyline has no LatLngs.
    	isEmpty: function () {
    		return !this._latlngs.length;
    	},

    	// @method closestLayerPoint(p: Point): Point
    	// Returns the point closest to `p` on the Polyline.
    	closestLayerPoint: function (p) {
    		var minDistance = Infinity,
    		    minPoint = null,
    		    closest = _sqClosestPointOnSegment,
    		    p1, p2;

    		for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
    			var points = this._parts[j];

    			for (var i = 1, len = points.length; i < len; i++) {
    				p1 = points[i - 1];
    				p2 = points[i];

    				var sqDist = closest(p, p1, p2, true);

    				if (sqDist < minDistance) {
    					minDistance = sqDist;
    					minPoint = closest(p, p1, p2);
    				}
    			}
    		}
    		if (minPoint) {
    			minPoint.distance = Math.sqrt(minDistance);
    		}
    		return minPoint;
    	},

    	// @method getCenter(): LatLng
    	// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the polyline.
    	getCenter: function () {
    		// throws error when not yet added to map as this center calculation requires projected coordinates
    		if (!this._map) {
    			throw new Error('Must add layer to map before using getCenter()');
    		}

    		var i, halfDist, segDist, dist, p1, p2, ratio,
    		    points = this._rings[0],
    		    len = points.length;

    		if (!len) { return null; }

    		// polyline centroid algorithm; only uses the first ring if there are multiple

    		for (i = 0, halfDist = 0; i < len - 1; i++) {
    			halfDist += points[i].distanceTo(points[i + 1]) / 2;
    		}

    		// The line is so small in the current view that all points are on the same pixel.
    		if (halfDist === 0) {
    			return this._map.layerPointToLatLng(points[0]);
    		}

    		for (i = 0, dist = 0; i < len - 1; i++) {
    			p1 = points[i];
    			p2 = points[i + 1];
    			segDist = p1.distanceTo(p2);
    			dist += segDist;

    			if (dist > halfDist) {
    				ratio = (dist - halfDist) / segDist;
    				return this._map.layerPointToLatLng([
    					p2.x - ratio * (p2.x - p1.x),
    					p2.y - ratio * (p2.y - p1.y)
    				]);
    			}
    		}
    	},

    	// @method getBounds(): LatLngBounds
    	// Returns the `LatLngBounds` of the path.
    	getBounds: function () {
    		return this._bounds;
    	},

    	// @method addLatLng(latlng: LatLng, latlngs?: LatLng[]): this
    	// Adds a given point to the polyline. By default, adds to the first ring of
    	// the polyline in case of a multi-polyline, but can be overridden by passing
    	// a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
    	addLatLng: function (latlng, latlngs) {
    		latlngs = latlngs || this._defaultShape();
    		latlng = toLatLng(latlng);
    		latlngs.push(latlng);
    		this._bounds.extend(latlng);
    		return this.redraw();
    	},

    	_setLatLngs: function (latlngs) {
    		this._bounds = new LatLngBounds();
    		this._latlngs = this._convertLatLngs(latlngs);
    	},

    	_defaultShape: function () {
    		return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
    	},

    	// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
    	_convertLatLngs: function (latlngs) {
    		var result = [],
    		    flat = isFlat(latlngs);

    		for (var i = 0, len = latlngs.length; i < len; i++) {
    			if (flat) {
    				result[i] = toLatLng(latlngs[i]);
    				this._bounds.extend(result[i]);
    			} else {
    				result[i] = this._convertLatLngs(latlngs[i]);
    			}
    		}

    		return result;
    	},

    	_project: function () {
    		var pxBounds = new Bounds();
    		this._rings = [];
    		this._projectLatlngs(this._latlngs, this._rings, pxBounds);

    		if (this._bounds.isValid() && pxBounds.isValid()) {
    			this._rawPxBounds = pxBounds;
    			this._updateBounds();
    		}
    	},

    	_updateBounds: function () {
    		var w = this._clickTolerance(),
    		    p = new Point(w, w);
    		this._pxBounds = new Bounds([
    			this._rawPxBounds.min.subtract(p),
    			this._rawPxBounds.max.add(p)
    		]);
    	},

    	// recursively turns latlngs into a set of rings with projected coordinates
    	_projectLatlngs: function (latlngs, result, projectedBounds) {
    		var flat = latlngs[0] instanceof LatLng,
    		    len = latlngs.length,
    		    i, ring;

    		if (flat) {
    			ring = [];
    			for (i = 0; i < len; i++) {
    				ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
    				projectedBounds.extend(ring[i]);
    			}
    			result.push(ring);
    		} else {
    			for (i = 0; i < len; i++) {
    				this._projectLatlngs(latlngs[i], result, projectedBounds);
    			}
    		}
    	},

    	// clip polyline by renderer bounds so that we have less to render for performance
    	_clipPoints: function () {
    		var bounds = this._renderer._bounds;

    		this._parts = [];
    		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
    			return;
    		}

    		if (this.options.noClip) {
    			this._parts = this._rings;
    			return;
    		}

    		var parts = this._parts,
    		    i, j, k, len, len2, segment, points;

    		for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
    			points = this._rings[i];

    			for (j = 0, len2 = points.length; j < len2 - 1; j++) {
    				segment = clipSegment(points[j], points[j + 1], bounds, j, true);

    				if (!segment) { continue; }

    				parts[k] = parts[k] || [];
    				parts[k].push(segment[0]);

    				// if segment goes out of screen, or it's the last one, it's the end of the line part
    				if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
    					parts[k].push(segment[1]);
    					k++;
    				}
    			}
    		}
    	},

    	// simplify each clipped part of the polyline for performance
    	_simplifyPoints: function () {
    		var parts = this._parts,
    		    tolerance = this.options.smoothFactor;

    		for (var i = 0, len = parts.length; i < len; i++) {
    			parts[i] = simplify(parts[i], tolerance);
    		}
    	},

    	_update: function () {
    		if (!this._map) { return; }

    		this._clipPoints();
    		this._simplifyPoints();
    		this._updatePath();
    	},

    	_updatePath: function () {
    		this._renderer._updatePoly(this);
    	},

    	// Needed by the `Canvas` renderer for interactivity
    	_containsPoint: function (p, closed) {
    		var i, j, k, len, len2, part,
    		    w = this._clickTolerance();

    		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

    		// hit detection for polylines
    		for (i = 0, len = this._parts.length; i < len; i++) {
    			part = this._parts[i];

    			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
    				if (!closed && (j === 0)) { continue; }

    				if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
    					return true;
    				}
    			}
    		}
    		return false;
    	}
    });

    // @factory L.polyline(latlngs: LatLng[], options?: Polyline options)
    // Instantiates a polyline object given an array of geographical points and
    // optionally an options object. You can create a `Polyline` object with
    // multiple separate lines (`MultiPolyline`) by passing an array of arrays
    // of geographic points.
    function polyline(latlngs, options) {
    	return new Polyline(latlngs, options);
    }

    // Retrocompat. Allow plugins to support Leaflet versions before and after 1.1.
    Polyline._flat = _flat;

    /*
     * @class Polygon
     * @aka L.Polygon
     * @inherits Polyline
     *
     * A class for drawing polygon overlays on a map. Extends `Polyline`.
     *
     * Note that points you pass when creating a polygon shouldn't have an additional last point equal to the first one — it's better to filter out such points.
     *
     *
     * @example
     *
     * ```js
     * // create a red polygon from an array of LatLng points
     * var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
     *
     * var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
     *
     * // zoom the map to the polygon
     * map.fitBounds(polygon.getBounds());
     * ```
     *
     * You can also pass an array of arrays of latlngs, with the first array representing the outer shape and the other arrays representing holes in the outer shape:
     *
     * ```js
     * var latlngs = [
     *   [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
     *   [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
     * ];
     * ```
     *
     * Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.
     *
     * ```js
     * var latlngs = [
     *   [ // first polygon
     *     [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
     *     [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
     *   ],
     *   [ // second polygon
     *     [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
     *   ]
     * ];
     * ```
     */

    var Polygon = Polyline.extend({

    	options: {
    		fill: true
    	},

    	isEmpty: function () {
    		return !this._latlngs.length || !this._latlngs[0].length;
    	},

    	getCenter: function () {
    		// throws error when not yet added to map as this center calculation requires projected coordinates
    		if (!this._map) {
    			throw new Error('Must add layer to map before using getCenter()');
    		}

    		var i, j, p1, p2, f, area, x, y, center,
    		    points = this._rings[0],
    		    len = points.length;

    		if (!len) { return null; }

    		// polygon centroid algorithm; only uses the first ring if there are multiple

    		area = x = y = 0;

    		for (i = 0, j = len - 1; i < len; j = i++) {
    			p1 = points[i];
    			p2 = points[j];

    			f = p1.y * p2.x - p2.y * p1.x;
    			x += (p1.x + p2.x) * f;
    			y += (p1.y + p2.y) * f;
    			area += f * 3;
    		}

    		if (area === 0) {
    			// Polygon is so small that all points are on same pixel.
    			center = points[0];
    		} else {
    			center = [x / area, y / area];
    		}
    		return this._map.layerPointToLatLng(center);
    	},

    	_convertLatLngs: function (latlngs) {
    		var result = Polyline.prototype._convertLatLngs.call(this, latlngs),
    		    len = result.length;

    		// remove last point if it equals first one
    		if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
    			result.pop();
    		}
    		return result;
    	},

    	_setLatLngs: function (latlngs) {
    		Polyline.prototype._setLatLngs.call(this, latlngs);
    		if (isFlat(this._latlngs)) {
    			this._latlngs = [this._latlngs];
    		}
    	},

    	_defaultShape: function () {
    		return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
    	},

    	_clipPoints: function () {
    		// polygons need a different clipping algorithm so we redefine that

    		var bounds = this._renderer._bounds,
    		    w = this.options.weight,
    		    p = new Point(w, w);

    		// increase clip padding by stroke width to avoid stroke on clip edges
    		bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));

    		this._parts = [];
    		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
    			return;
    		}

    		if (this.options.noClip) {
    			this._parts = this._rings;
    			return;
    		}

    		for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
    			clipped = clipPolygon(this._rings[i], bounds, true);
    			if (clipped.length) {
    				this._parts.push(clipped);
    			}
    		}
    	},

    	_updatePath: function () {
    		this._renderer._updatePoly(this, true);
    	},

    	// Needed by the `Canvas` renderer for interactivity
    	_containsPoint: function (p) {
    		var inside = false,
    		    part, p1, p2, i, j, k, len, len2;

    		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

    		// ray casting algorithm for detecting if point is in polygon
    		for (i = 0, len = this._parts.length; i < len; i++) {
    			part = this._parts[i];

    			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
    				p1 = part[j];
    				p2 = part[k];

    				if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
    					inside = !inside;
    				}
    			}
    		}

    		// also check if it's on polygon stroke
    		return inside || Polyline.prototype._containsPoint.call(this, p, true);
    	}

    });


    // @factory L.polygon(latlngs: LatLng[], options?: Polyline options)
    function polygon(latlngs, options) {
    	return new Polygon(latlngs, options);
    }

    /*
     * @class GeoJSON
     * @aka L.GeoJSON
     * @inherits FeatureGroup
     *
     * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
     * GeoJSON data and display it on the map. Extends `FeatureGroup`.
     *
     * @example
     *
     * ```js
     * L.geoJSON(data, {
     * 	style: function (feature) {
     * 		return {color: feature.properties.color};
     * 	}
     * }).bindPopup(function (layer) {
     * 	return layer.feature.properties.description;
     * }).addTo(map);
     * ```
     */

    var GeoJSON = FeatureGroup.extend({

    	/* @section
    	 * @aka GeoJSON options
    	 *
    	 * @option pointToLayer: Function = *
    	 * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
    	 * called when data is added, passing the GeoJSON point feature and its `LatLng`.
    	 * The default is to spawn a default `Marker`:
    	 * ```js
    	 * function(geoJsonPoint, latlng) {
    	 * 	return L.marker(latlng);
    	 * }
    	 * ```
    	 *
    	 * @option style: Function = *
    	 * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
    	 * called internally when data is added.
    	 * The default value is to not override any defaults:
    	 * ```js
    	 * function (geoJsonFeature) {
    	 * 	return {}
    	 * }
    	 * ```
    	 *
    	 * @option onEachFeature: Function = *
    	 * A `Function` that will be called once for each created `Feature`, after it has
    	 * been created and styled. Useful for attaching events and popups to features.
    	 * The default is to do nothing with the newly created layers:
    	 * ```js
    	 * function (feature, layer) {}
    	 * ```
    	 *
    	 * @option filter: Function = *
    	 * A `Function` that will be used to decide whether to include a feature or not.
    	 * The default is to include all features:
    	 * ```js
    	 * function (geoJsonFeature) {
    	 * 	return true;
    	 * }
    	 * ```
    	 * Note: dynamically changing the `filter` option will have effect only on newly
    	 * added data. It will _not_ re-evaluate already included features.
    	 *
    	 * @option coordsToLatLng: Function = *
    	 * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
    	 * The default is the `coordsToLatLng` static method.
    	 *
    	 * @option markersInheritOptions: Boolean = false
    	 * Whether default Markers for "Point" type Features inherit from group options.
    	 */

    	initialize: function (geojson, options) {
    		setOptions(this, options);

    		this._layers = {};

    		if (geojson) {
    			this.addData(geojson);
    		}
    	},

    	// @method addData( <GeoJSON> data ): this
    	// Adds a GeoJSON object to the layer.
    	addData: function (geojson) {
    		var features = isArray(geojson) ? geojson : geojson.features,
    		    i, len, feature;

    		if (features) {
    			for (i = 0, len = features.length; i < len; i++) {
    				// only add this if geometry or geometries are set and not null
    				feature = features[i];
    				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
    					this.addData(feature);
    				}
    			}
    			return this;
    		}

    		var options = this.options;

    		if (options.filter && !options.filter(geojson)) { return this; }

    		var layer = geometryToLayer(geojson, options);
    		if (!layer) {
    			return this;
    		}
    		layer.feature = asFeature(geojson);

    		layer.defaultOptions = layer.options;
    		this.resetStyle(layer);

    		if (options.onEachFeature) {
    			options.onEachFeature(geojson, layer);
    		}

    		return this.addLayer(layer);
    	},

    	// @method resetStyle( <Path> layer? ): this
    	// Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
    	// If `layer` is omitted, the style of all features in the current layer is reset.
    	resetStyle: function (layer) {
    		if (layer === undefined) {
    			return this.eachLayer(this.resetStyle, this);
    		}
    		// reset any custom styles
    		layer.options = extend({}, layer.defaultOptions);
    		this._setLayerStyle(layer, this.options.style);
    		return this;
    	},

    	// @method setStyle( <Function> style ): this
    	// Changes styles of GeoJSON vector layers with the given style function.
    	setStyle: function (style) {
    		return this.eachLayer(function (layer) {
    			this._setLayerStyle(layer, style);
    		}, this);
    	},

    	_setLayerStyle: function (layer, style) {
    		if (layer.setStyle) {
    			if (typeof style === 'function') {
    				style = style(layer.feature);
    			}
    			layer.setStyle(style);
    		}
    	}
    });

    // @section
    // There are several static functions which can be called without instantiating L.GeoJSON:

    // @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
    // Creates a `Layer` from a given GeoJSON feature. Can use a custom
    // [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
    // functions if provided as options.
    function geometryToLayer(geojson, options) {

    	var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
    	    coords = geometry ? geometry.coordinates : null,
    	    layers = [],
    	    pointToLayer = options && options.pointToLayer,
    	    _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng,
    	    latlng, latlngs, i, len;

    	if (!coords && !geometry) {
    		return null;
    	}

    	switch (geometry.type) {
    	case 'Point':
    		latlng = _coordsToLatLng(coords);
    		return _pointToLayer(pointToLayer, geojson, latlng, options);

    	case 'MultiPoint':
    		for (i = 0, len = coords.length; i < len; i++) {
    			latlng = _coordsToLatLng(coords[i]);
    			layers.push(_pointToLayer(pointToLayer, geojson, latlng, options));
    		}
    		return new FeatureGroup(layers);

    	case 'LineString':
    	case 'MultiLineString':
    		latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
    		return new Polyline(latlngs, options);

    	case 'Polygon':
    	case 'MultiPolygon':
    		latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
    		return new Polygon(latlngs, options);

    	case 'GeometryCollection':
    		for (i = 0, len = geometry.geometries.length; i < len; i++) {
    			var layer = geometryToLayer({
    				geometry: geometry.geometries[i],
    				type: 'Feature',
    				properties: geojson.properties
    			}, options);

    			if (layer) {
    				layers.push(layer);
    			}
    		}
    		return new FeatureGroup(layers);

    	default:
    		throw new Error('Invalid GeoJSON object.');
    	}
    }

    function _pointToLayer(pointToLayerFn, geojson, latlng, options) {
    	return pointToLayerFn ?
    		pointToLayerFn(geojson, latlng) :
    		new Marker(latlng, options && options.markersInheritOptions && options);
    }

    // @function coordsToLatLng(coords: Array): LatLng
    // Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
    // or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
    function coordsToLatLng(coords) {
    	return new LatLng(coords[1], coords[0], coords[2]);
    }

    // @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
    // Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
    // `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
    // Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
    function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
    	var latlngs = [];

    	for (var i = 0, len = coords.length, latlng; i < len; i++) {
    		latlng = levelsDeep ?
    			coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) :
    			(_coordsToLatLng || coordsToLatLng)(coords[i]);

    		latlngs.push(latlng);
    	}

    	return latlngs;
    }

    // @function latLngToCoords(latlng: LatLng, precision?: Number): Array
    // Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
    function latLngToCoords(latlng, precision) {
    	precision = typeof precision === 'number' ? precision : 6;
    	return latlng.alt !== undefined ?
    		[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] :
    		[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
    }

    // @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
    // Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
    // `closed` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
    function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
    	var coords = [];

    	for (var i = 0, len = latlngs.length; i < len; i++) {
    		coords.push(levelsDeep ?
    			latLngsToCoords(latlngs[i], levelsDeep - 1, closed, precision) :
    			latLngToCoords(latlngs[i], precision));
    	}

    	if (!levelsDeep && closed) {
    		coords.push(coords[0]);
    	}

    	return coords;
    }

    function getFeature(layer, newGeometry) {
    	return layer.feature ?
    		extend({}, layer.feature, {geometry: newGeometry}) :
    		asFeature(newGeometry);
    }

    // @function asFeature(geojson: Object): Object
    // Normalize GeoJSON geometries/features into GeoJSON features.
    function asFeature(geojson) {
    	if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
    		return geojson;
    	}

    	return {
    		type: 'Feature',
    		properties: {},
    		geometry: geojson
    	};
    }

    var PointToGeoJSON = {
    	toGeoJSON: function (precision) {
    		return getFeature(this, {
    			type: 'Point',
    			coordinates: latLngToCoords(this.getLatLng(), precision)
    		});
    	}
    };

    // @namespace Marker
    // @section Other methods
    // @method toGeoJSON(precision?: Number): Object
    // `precision` is the number of decimal places for coordinates.
    // The default value is 6 places.
    // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the marker (as a GeoJSON `Point` Feature).
    Marker.include(PointToGeoJSON);

    // @namespace CircleMarker
    // @method toGeoJSON(precision?: Number): Object
    // `precision` is the number of decimal places for coordinates.
    // The default value is 6 places.
    // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
    Circle.include(PointToGeoJSON);
    CircleMarker.include(PointToGeoJSON);


    // @namespace Polyline
    // @method toGeoJSON(precision?: Number): Object
    // `precision` is the number of decimal places for coordinates.
    // The default value is 6 places.
    // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
    Polyline.include({
    	toGeoJSON: function (precision) {
    		var multi = !isFlat(this._latlngs);

    		var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);

    		return getFeature(this, {
    			type: (multi ? 'Multi' : '') + 'LineString',
    			coordinates: coords
    		});
    	}
    });

    // @namespace Polygon
    // @method toGeoJSON(precision?: Number): Object
    // `precision` is the number of decimal places for coordinates.
    // The default value is 6 places.
    // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
    Polygon.include({
    	toGeoJSON: function (precision) {
    		var holes = !isFlat(this._latlngs),
    		    multi = holes && !isFlat(this._latlngs[0]);

    		var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);

    		if (!holes) {
    			coords = [coords];
    		}

    		return getFeature(this, {
    			type: (multi ? 'Multi' : '') + 'Polygon',
    			coordinates: coords
    		});
    	}
    });


    // @namespace LayerGroup
    LayerGroup.include({
    	toMultiPoint: function (precision) {
    		var coords = [];

    		this.eachLayer(function (layer) {
    			coords.push(layer.toGeoJSON(precision).geometry.coordinates);
    		});

    		return getFeature(this, {
    			type: 'MultiPoint',
    			coordinates: coords
    		});
    	},

    	// @method toGeoJSON(precision?: Number): Object
    	// `precision` is the number of decimal places for coordinates.
    	// The default value is 6 places.
    	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
    	toGeoJSON: function (precision) {

    		var type = this.feature && this.feature.geometry && this.feature.geometry.type;

    		if (type === 'MultiPoint') {
    			return this.toMultiPoint(precision);
    		}

    		var isGeometryCollection = type === 'GeometryCollection',
    		    jsons = [];

    		this.eachLayer(function (layer) {
    			if (layer.toGeoJSON) {
    				var json = layer.toGeoJSON(precision);
    				if (isGeometryCollection) {
    					jsons.push(json.geometry);
    				} else {
    					var feature = asFeature(json);
    					// Squash nested feature collections
    					if (feature.type === 'FeatureCollection') {
    						jsons.push.apply(jsons, feature.features);
    					} else {
    						jsons.push(feature);
    					}
    				}
    			}
    		});

    		if (isGeometryCollection) {
    			return getFeature(this, {
    				geometries: jsons,
    				type: 'GeometryCollection'
    			});
    		}

    		return {
    			type: 'FeatureCollection',
    			features: jsons
    		};
    	}
    });

    // @namespace GeoJSON
    // @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
    // Creates a GeoJSON layer. Optionally accepts an object in
    // [GeoJSON format](https://tools.ietf.org/html/rfc7946) to display on the map
    // (you can alternatively add it later with `addData` method) and an `options` object.
    function geoJSON(geojson, options) {
    	return new GeoJSON(geojson, options);
    }

    // Backward compatibility.
    var geoJson = geoJSON;

    /*
     * @class ImageOverlay
     * @aka L.ImageOverlay
     * @inherits Interactive layer
     *
     * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
     *
     * @example
     *
     * ```js
     * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
     * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
     * L.imageOverlay(imageUrl, imageBounds).addTo(map);
     * ```
     */

    var ImageOverlay = Layer.extend({

    	// @section
    	// @aka ImageOverlay options
    	options: {
    		// @option opacity: Number = 1.0
    		// The opacity of the image overlay.
    		opacity: 1,

    		// @option alt: String = ''
    		// Text for the `alt` attribute of the image (useful for accessibility).
    		alt: '',

    		// @option interactive: Boolean = false
    		// If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
    		interactive: false,

    		// @option crossOrigin: Boolean|String = false
    		// Whether the crossOrigin attribute will be added to the image.
    		// If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
    		// Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
    		crossOrigin: false,

    		// @option errorOverlayUrl: String = ''
    		// URL to the overlay image to show in place of the overlay that failed to load.
    		errorOverlayUrl: '',

    		// @option zIndex: Number = 1
    		// The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
    		zIndex: 1,

    		// @option className: String = ''
    		// A custom class name to assign to the image. Empty by default.
    		className: ''
    	},

    	initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
    		this._url = url;
    		this._bounds = toLatLngBounds(bounds);

    		setOptions(this, options);
    	},

    	onAdd: function () {
    		if (!this._image) {
    			this._initImage();

    			if (this.options.opacity < 1) {
    				this._updateOpacity();
    			}
    		}

    		if (this.options.interactive) {
    			addClass(this._image, 'leaflet-interactive');
    			this.addInteractiveTarget(this._image);
    		}

    		this.getPane().appendChild(this._image);
    		this._reset();
    	},

    	onRemove: function () {
    		remove(this._image);
    		if (this.options.interactive) {
    			this.removeInteractiveTarget(this._image);
    		}
    	},

    	// @method setOpacity(opacity: Number): this
    	// Sets the opacity of the overlay.
    	setOpacity: function (opacity) {
    		this.options.opacity = opacity;

    		if (this._image) {
    			this._updateOpacity();
    		}
    		return this;
    	},

    	setStyle: function (styleOpts) {
    		if (styleOpts.opacity) {
    			this.setOpacity(styleOpts.opacity);
    		}
    		return this;
    	},

    	// @method bringToFront(): this
    	// Brings the layer to the top of all overlays.
    	bringToFront: function () {
    		if (this._map) {
    			toFront(this._image);
    		}
    		return this;
    	},

    	// @method bringToBack(): this
    	// Brings the layer to the bottom of all overlays.
    	bringToBack: function () {
    		if (this._map) {
    			toBack(this._image);
    		}
    		return this;
    	},

    	// @method setUrl(url: String): this
    	// Changes the URL of the image.
    	setUrl: function (url) {
    		this._url = url;

    		if (this._image) {
    			this._image.src = url;
    		}
    		return this;
    	},

    	// @method setBounds(bounds: LatLngBounds): this
    	// Update the bounds that this ImageOverlay covers
    	setBounds: function (bounds) {
    		this._bounds = toLatLngBounds(bounds);

    		if (this._map) {
    			this._reset();
    		}
    		return this;
    	},

    	getEvents: function () {
    		var events = {
    			zoom: this._reset,
    			viewreset: this._reset
    		};

    		if (this._zoomAnimated) {
    			events.zoomanim = this._animateZoom;
    		}

    		return events;
    	},

    	// @method setZIndex(value: Number): this
    	// Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
    	setZIndex: function (value) {
    		this.options.zIndex = value;
    		this._updateZIndex();
    		return this;
    	},

    	// @method getBounds(): LatLngBounds
    	// Get the bounds that this ImageOverlay covers
    	getBounds: function () {
    		return this._bounds;
    	},

    	// @method getElement(): HTMLElement
    	// Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
    	// used by this overlay.
    	getElement: function () {
    		return this._image;
    	},

    	_initImage: function () {
    		var wasElementSupplied = this._url.tagName === 'IMG';
    		var img = this._image = wasElementSupplied ? this._url : create$1('img');

    		addClass(img, 'leaflet-image-layer');
    		if (this._zoomAnimated) { addClass(img, 'leaflet-zoom-animated'); }
    		if (this.options.className) { addClass(img, this.options.className); }

    		img.onselectstart = falseFn;
    		img.onmousemove = falseFn;

    		// @event load: Event
    		// Fired when the ImageOverlay layer has loaded its image
    		img.onload = bind(this.fire, this, 'load');
    		img.onerror = bind(this._overlayOnError, this, 'error');

    		if (this.options.crossOrigin || this.options.crossOrigin === '') {
    			img.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
    		}

    		if (this.options.zIndex) {
    			this._updateZIndex();
    		}

    		if (wasElementSupplied) {
    			this._url = img.src;
    			return;
    		}

    		img.src = this._url;
    		img.alt = this.options.alt;
    	},

    	_animateZoom: function (e) {
    		var scale = this._map.getZoomScale(e.zoom),
    		    offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;

    		setTransform(this._image, offset, scale);
    	},

    	_reset: function () {
    		var image = this._image,
    		    bounds = new Bounds(
    		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
    		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
    		    size = bounds.getSize();

    		setPosition(image, bounds.min);

    		image.style.width  = size.x + 'px';
    		image.style.height = size.y + 'px';
    	},

    	_updateOpacity: function () {
    		setOpacity(this._image, this.options.opacity);
    	},

    	_updateZIndex: function () {
    		if (this._image && this.options.zIndex !== undefined && this.options.zIndex !== null) {
    			this._image.style.zIndex = this.options.zIndex;
    		}
    	},

    	_overlayOnError: function () {
    		// @event error: Event
    		// Fired when the ImageOverlay layer fails to load its image
    		this.fire('error');

    		var errorUrl = this.options.errorOverlayUrl;
    		if (errorUrl && this._url !== errorUrl) {
    			this._url = errorUrl;
    			this._image.src = errorUrl;
    		}
    	}
    });

    // @factory L.imageOverlay(imageUrl: String, bounds: LatLngBounds, options?: ImageOverlay options)
    // Instantiates an image overlay object given the URL of the image and the
    // geographical bounds it is tied to.
    var imageOverlay = function (url, bounds, options) {
    	return new ImageOverlay(url, bounds, options);
    };

    /*
     * @class VideoOverlay
     * @aka L.VideoOverlay
     * @inherits ImageOverlay
     *
     * Used to load and display a video player over specific bounds of the map. Extends `ImageOverlay`.
     *
     * A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video)
     * HTML5 element.
     *
     * @example
     *
     * ```js
     * var videoUrl = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
     * 	videoBounds = [[ 32, -130], [ 13, -100]];
     * L.videoOverlay(videoUrl, videoBounds ).addTo(map);
     * ```
     */

    var VideoOverlay = ImageOverlay.extend({

    	// @section
    	// @aka VideoOverlay options
    	options: {
    		// @option autoplay: Boolean = true
    		// Whether the video starts playing automatically when loaded.
    		autoplay: true,

    		// @option loop: Boolean = true
    		// Whether the video will loop back to the beginning when played.
    		loop: true,

    		// @option keepAspectRatio: Boolean = true
    		// Whether the video will save aspect ratio after the projection.
    		// Relevant for supported browsers. Browser compatibility- https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
    		keepAspectRatio: true,

    		// @option muted: Boolean = false
    		// Whether the video starts on mute when loaded.
    		muted: false
    	},

    	_initImage: function () {
    		var wasElementSupplied = this._url.tagName === 'VIDEO';
    		var vid = this._image = wasElementSupplied ? this._url : create$1('video');

    		addClass(vid, 'leaflet-image-layer');
    		if (this._zoomAnimated) { addClass(vid, 'leaflet-zoom-animated'); }
    		if (this.options.className) { addClass(vid, this.options.className); }

    		vid.onselectstart = falseFn;
    		vid.onmousemove = falseFn;

    		// @event load: Event
    		// Fired when the video has finished loading the first frame
    		vid.onloadeddata = bind(this.fire, this, 'load');

    		if (wasElementSupplied) {
    			var sourceElements = vid.getElementsByTagName('source');
    			var sources = [];
    			for (var j = 0; j < sourceElements.length; j++) {
    				sources.push(sourceElements[j].src);
    			}

    			this._url = (sourceElements.length > 0) ? sources : [vid.src];
    			return;
    		}

    		if (!isArray(this._url)) { this._url = [this._url]; }

    		if (!this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(vid.style, 'objectFit')) {
    			vid.style['objectFit'] = 'fill';
    		}
    		vid.autoplay = !!this.options.autoplay;
    		vid.loop = !!this.options.loop;
    		vid.muted = !!this.options.muted;
    		for (var i = 0; i < this._url.length; i++) {
    			var source = create$1('source');
    			source.src = this._url[i];
    			vid.appendChild(source);
    		}
    	}

    	// @method getElement(): HTMLVideoElement
    	// Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
    	// used by this overlay.
    });


    // @factory L.videoOverlay(video: String|Array|HTMLVideoElement, bounds: LatLngBounds, options?: VideoOverlay options)
    // Instantiates an image overlay object given the URL of the video (or array of URLs, or even a video element) and the
    // geographical bounds it is tied to.

    function videoOverlay(video, bounds, options) {
    	return new VideoOverlay(video, bounds, options);
    }

    /*
     * @class SVGOverlay
     * @aka L.SVGOverlay
     * @inherits ImageOverlay
     *
     * Used to load, display and provide DOM access to an SVG file over specific bounds of the map. Extends `ImageOverlay`.
     *
     * An SVG overlay uses the [`<svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/svg) element.
     *
     * @example
     *
     * ```js
     * var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
     * svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
     * svgElement.setAttribute('viewBox', "0 0 200 200");
     * svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
     * var svgElementBounds = [ [ 32, -130 ], [ 13, -100 ] ];
     * L.svgOverlay(svgElement, svgElementBounds).addTo(map);
     * ```
     */

    var SVGOverlay = ImageOverlay.extend({
    	_initImage: function () {
    		var el = this._image = this._url;

    		addClass(el, 'leaflet-image-layer');
    		if (this._zoomAnimated) { addClass(el, 'leaflet-zoom-animated'); }
    		if (this.options.className) { addClass(el, this.options.className); }

    		el.onselectstart = falseFn;
    		el.onmousemove = falseFn;
    	}

    	// @method getElement(): SVGElement
    	// Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
    	// used by this overlay.
    });


    // @factory L.svgOverlay(svg: String|SVGElement, bounds: LatLngBounds, options?: SVGOverlay options)
    // Instantiates an image overlay object given an SVG element and the geographical bounds it is tied to.
    // A viewBox attribute is required on the SVG element to zoom in and out properly.

    function svgOverlay(el, bounds, options) {
    	return new SVGOverlay(el, bounds, options);
    }

    /*
     * @class DivOverlay
     * @inherits Layer
     * @aka L.DivOverlay
     * Base model for L.Popup and L.Tooltip. Inherit from it for custom popup like plugins.
     */

    // @namespace DivOverlay
    var DivOverlay = Layer.extend({

    	// @section
    	// @aka DivOverlay options
    	options: {
    		// @option offset: Point = Point(0, 7)
    		// The offset of the popup position. Useful to control the anchor
    		// of the popup when opening it on some overlays.
    		offset: [0, 7],

    		// @option className: String = ''
    		// A custom CSS class name to assign to the popup.
    		className: '',

    		// @option pane: String = 'popupPane'
    		// `Map pane` where the popup will be added.
    		pane: 'popupPane'
    	},

    	initialize: function (options, source) {
    		setOptions(this, options);

    		this._source = source;
    	},

    	onAdd: function (map) {
    		this._zoomAnimated = map._zoomAnimated;

    		if (!this._container) {
    			this._initLayout();
    		}

    		if (map._fadeAnimated) {
    			setOpacity(this._container, 0);
    		}

    		clearTimeout(this._removeTimeout);
    		this.getPane().appendChild(this._container);
    		this.update();

    		if (map._fadeAnimated) {
    			setOpacity(this._container, 1);
    		}

    		this.bringToFront();
    	},

    	onRemove: function (map) {
    		if (map._fadeAnimated) {
    			setOpacity(this._container, 0);
    			this._removeTimeout = setTimeout(bind(remove, undefined, this._container), 200);
    		} else {
    			remove(this._container);
    		}
    	},

    	// @namespace Popup
    	// @method getLatLng: LatLng
    	// Returns the geographical point of popup.
    	getLatLng: function () {
    		return this._latlng;
    	},

    	// @method setLatLng(latlng: LatLng): this
    	// Sets the geographical point where the popup will open.
    	setLatLng: function (latlng) {
    		this._latlng = toLatLng(latlng);
    		if (this._map) {
    			this._updatePosition();
    			this._adjustPan();
    		}
    		return this;
    	},

    	// @method getContent: String|HTMLElement
    	// Returns the content of the popup.
    	getContent: function () {
    		return this._content;
    	},

    	// @method setContent(htmlContent: String|HTMLElement|Function): this
    	// Sets the HTML content of the popup. If a function is passed the source layer will be passed to the function. The function should return a `String` or `HTMLElement` to be used in the popup.
    	setContent: function (content) {
    		this._content = content;
    		this.update();
    		return this;
    	},

    	// @method getElement: String|HTMLElement
    	// Returns the HTML container of the popup.
    	getElement: function () {
    		return this._container;
    	},

    	// @method update: null
    	// Updates the popup content, layout and position. Useful for updating the popup after something inside changed, e.g. image loaded.
    	update: function () {
    		if (!this._map) { return; }

    		this._container.style.visibility = 'hidden';

    		this._updateContent();
    		this._updateLayout();
    		this._updatePosition();

    		this._container.style.visibility = '';

    		this._adjustPan();
    	},

    	getEvents: function () {
    		var events = {
    			zoom: this._updatePosition,
    			viewreset: this._updatePosition
    		};

    		if (this._zoomAnimated) {
    			events.zoomanim = this._animateZoom;
    		}
    		return events;
    	},

    	// @method isOpen: Boolean
    	// Returns `true` when the popup is visible on the map.
    	isOpen: function () {
    		return !!this._map && this._map.hasLayer(this);
    	},

    	// @method bringToFront: this
    	// Brings this popup in front of other popups (in the same map pane).
    	bringToFront: function () {
    		if (this._map) {
    			toFront(this._container);
    		}
    		return this;
    	},

    	// @method bringToBack: this
    	// Brings this popup to the back of other popups (in the same map pane).
    	bringToBack: function () {
    		if (this._map) {
    			toBack(this._container);
    		}
    		return this;
    	},

    	_prepareOpen: function (parent, layer, latlng) {
    		if (!(layer instanceof Layer)) {
    			latlng = layer;
    			layer = parent;
    		}

    		if (layer instanceof FeatureGroup) {
    			for (var id in parent._layers) {
    				layer = parent._layers[id];
    				break;
    			}
    		}

    		if (!latlng) {
    			if (layer.getCenter) {
    				latlng = layer.getCenter();
    			} else if (layer.getLatLng) {
    				latlng = layer.getLatLng();
    			} else {
    				throw new Error('Unable to get source layer LatLng.');
    			}
    		}

    		// set overlay source to this layer
    		this._source = layer;

    		// update the overlay (content, layout, ect...)
    		this.update();

    		return latlng;
    	},

    	_updateContent: function () {
    		if (!this._content) { return; }

    		var node = this._contentNode;
    		var content = (typeof this._content === 'function') ? this._content(this._source || this) : this._content;

    		if (typeof content === 'string') {
    			node.innerHTML = content;
    		} else {
    			while (node.hasChildNodes()) {
    				node.removeChild(node.firstChild);
    			}
    			node.appendChild(content);
    		}
    		this.fire('contentupdate');
    	},

    	_updatePosition: function () {
    		if (!this._map) { return; }

    		var pos = this._map.latLngToLayerPoint(this._latlng),
    		    offset = toPoint(this.options.offset),
    		    anchor = this._getAnchor();

    		if (this._zoomAnimated) {
    			setPosition(this._container, pos.add(anchor));
    		} else {
    			offset = offset.add(pos).add(anchor);
    		}

    		var bottom = this._containerBottom = -offset.y,
    		    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

    		// bottom position the popup in case the height of the popup changes (images loading etc)
    		this._container.style.bottom = bottom + 'px';
    		this._container.style.left = left + 'px';
    	},

    	_getAnchor: function () {
    		return [0, 0];
    	}

    });

    /*
     * @class Popup
     * @inherits DivOverlay
     * @aka L.Popup
     * Used to open popups in certain places of the map. Use [Map.openPopup](#map-openpopup) to
     * open popups while making sure that only one popup is open at one time
     * (recommended for usability), or use [Map.addLayer](#map-addlayer) to open as many as you want.
     *
     * @example
     *
     * If you want to just bind a popup to marker click and then open it, it's really easy:
     *
     * ```js
     * marker.bindPopup(popupContent).openPopup();
     * ```
     * Path overlays like polylines also have a `bindPopup` method.
     * Here's a more complicated way to open a popup on a map:
     *
     * ```js
     * var popup = L.popup()
     * 	.setLatLng(latlng)
     * 	.setContent('<p>Hello world!<br />This is a nice popup.</p>')
     * 	.openOn(map);
     * ```
     */


    // @namespace Popup
    var Popup = DivOverlay.extend({

    	// @section
    	// @aka Popup options
    	options: {
    		// @option maxWidth: Number = 300
    		// Max width of the popup, in pixels.
    		maxWidth: 300,

    		// @option minWidth: Number = 50
    		// Min width of the popup, in pixels.
    		minWidth: 50,

    		// @option maxHeight: Number = null
    		// If set, creates a scrollable container of the given height
    		// inside a popup if its content exceeds it.
    		maxHeight: null,

    		// @option autoPan: Boolean = true
    		// Set it to `false` if you don't want the map to do panning animation
    		// to fit the opened popup.
    		autoPan: true,

    		// @option autoPanPaddingTopLeft: Point = null
    		// The margin between the popup and the top left corner of the map
    		// view after autopanning was performed.
    		autoPanPaddingTopLeft: null,

    		// @option autoPanPaddingBottomRight: Point = null
    		// The margin between the popup and the bottom right corner of the map
    		// view after autopanning was performed.
    		autoPanPaddingBottomRight: null,

    		// @option autoPanPadding: Point = Point(5, 5)
    		// Equivalent of setting both top left and bottom right autopan padding to the same value.
    		autoPanPadding: [5, 5],

    		// @option keepInView: Boolean = false
    		// Set it to `true` if you want to prevent users from panning the popup
    		// off of the screen while it is open.
    		keepInView: false,

    		// @option closeButton: Boolean = true
    		// Controls the presence of a close button in the popup.
    		closeButton: true,

    		// @option autoClose: Boolean = true
    		// Set it to `false` if you want to override the default behavior of
    		// the popup closing when another popup is opened.
    		autoClose: true,

    		// @option closeOnEscapeKey: Boolean = true
    		// Set it to `false` if you want to override the default behavior of
    		// the ESC key for closing of the popup.
    		closeOnEscapeKey: true,

    		// @option closeOnClick: Boolean = *
    		// Set it if you want to override the default behavior of the popup closing when user clicks
    		// on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.

    		// @option className: String = ''
    		// A custom CSS class name to assign to the popup.
    		className: ''
    	},

    	// @namespace Popup
    	// @method openOn(map: Map): this
    	// Adds the popup to the map and closes the previous one. The same as `map.openPopup(popup)`.
    	openOn: function (map) {
    		map.openPopup(this);
    		return this;
    	},

    	onAdd: function (map) {
    		DivOverlay.prototype.onAdd.call(this, map);

    		// @namespace Map
    		// @section Popup events
    		// @event popupopen: PopupEvent
    		// Fired when a popup is opened in the map
    		map.fire('popupopen', {popup: this});

    		if (this._source) {
    			// @namespace Layer
    			// @section Popup events
    			// @event popupopen: PopupEvent
    			// Fired when a popup bound to this layer is opened
    			this._source.fire('popupopen', {popup: this}, true);
    			// For non-path layers, we toggle the popup when clicking
    			// again the layer, so prevent the map to reopen it.
    			if (!(this._source instanceof Path)) {
    				this._source.on('preclick', stopPropagation);
    			}
    		}
    	},

    	onRemove: function (map) {
    		DivOverlay.prototype.onRemove.call(this, map);

    		// @namespace Map
    		// @section Popup events
    		// @event popupclose: PopupEvent
    		// Fired when a popup in the map is closed
    		map.fire('popupclose', {popup: this});

    		if (this._source) {
    			// @namespace Layer
    			// @section Popup events
    			// @event popupclose: PopupEvent
    			// Fired when a popup bound to this layer is closed
    			this._source.fire('popupclose', {popup: this}, true);
    			if (!(this._source instanceof Path)) {
    				this._source.off('preclick', stopPropagation);
    			}
    		}
    	},

    	getEvents: function () {
    		var events = DivOverlay.prototype.getEvents.call(this);

    		if (this.options.closeOnClick !== undefined ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
    			events.preclick = this._close;
    		}

    		if (this.options.keepInView) {
    			events.moveend = this._adjustPan;
    		}

    		return events;
    	},

    	_close: function () {
    		if (this._map) {
    			this._map.closePopup(this);
    		}
    	},

    	_initLayout: function () {
    		var prefix = 'leaflet-popup',
    		    container = this._container = create$1('div',
    			prefix + ' ' + (this.options.className || '') +
    			' leaflet-zoom-animated');

    		var wrapper = this._wrapper = create$1('div', prefix + '-content-wrapper', container);
    		this._contentNode = create$1('div', prefix + '-content', wrapper);

    		disableClickPropagation(container);
    		disableScrollPropagation(this._contentNode);
    		on(container, 'contextmenu', stopPropagation);

    		this._tipContainer = create$1('div', prefix + '-tip-container', container);
    		this._tip = create$1('div', prefix + '-tip', this._tipContainer);

    		if (this.options.closeButton) {
    			var closeButton = this._closeButton = create$1('a', prefix + '-close-button', container);
    			closeButton.href = '#close';
    			closeButton.innerHTML = '&#215;';

    			on(closeButton, 'click', this._onCloseButtonClick, this);
    		}
    	},

    	_updateLayout: function () {
    		var container = this._contentNode,
    		    style = container.style;

    		style.width = '';
    		style.whiteSpace = 'nowrap';

    		var width = container.offsetWidth;
    		width = Math.min(width, this.options.maxWidth);
    		width = Math.max(width, this.options.minWidth);

    		style.width = (width + 1) + 'px';
    		style.whiteSpace = '';

    		style.height = '';

    		var height = container.offsetHeight,
    		    maxHeight = this.options.maxHeight,
    		    scrolledClass = 'leaflet-popup-scrolled';

    		if (maxHeight && height > maxHeight) {
    			style.height = maxHeight + 'px';
    			addClass(container, scrolledClass);
    		} else {
    			removeClass(container, scrolledClass);
    		}

    		this._containerWidth = this._container.offsetWidth;
    	},

    	_animateZoom: function (e) {
    		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
    		    anchor = this._getAnchor();
    		setPosition(this._container, pos.add(anchor));
    	},

    	_adjustPan: function () {
    		if (!this.options.autoPan) { return; }
    		if (this._map._panAnim) { this._map._panAnim.stop(); }

    		var map = this._map,
    		    marginBottom = parseInt(getStyle(this._container, 'marginBottom'), 10) || 0,
    		    containerHeight = this._container.offsetHeight + marginBottom,
    		    containerWidth = this._containerWidth,
    		    layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);

    		layerPos._add(getPosition(this._container));

    		var containerPos = map.layerPointToContainerPoint(layerPos),
    		    padding = toPoint(this.options.autoPanPadding),
    		    paddingTL = toPoint(this.options.autoPanPaddingTopLeft || padding),
    		    paddingBR = toPoint(this.options.autoPanPaddingBottomRight || padding),
    		    size = map.getSize(),
    		    dx = 0,
    		    dy = 0;

    		if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
    			dx = containerPos.x + containerWidth - size.x + paddingBR.x;
    		}
    		if (containerPos.x - dx - paddingTL.x < 0) { // left
    			dx = containerPos.x - paddingTL.x;
    		}
    		if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
    			dy = containerPos.y + containerHeight - size.y + paddingBR.y;
    		}
    		if (containerPos.y - dy - paddingTL.y < 0) { // top
    			dy = containerPos.y - paddingTL.y;
    		}

    		// @namespace Map
    		// @section Popup events
    		// @event autopanstart: Event
    		// Fired when the map starts autopanning when opening a popup.
    		if (dx || dy) {
    			map
    			    .fire('autopanstart')
    			    .panBy([dx, dy]);
    		}
    	},

    	_onCloseButtonClick: function (e) {
    		this._close();
    		stop(e);
    	},

    	_getAnchor: function () {
    		// Where should we anchor the popup on the source layer?
    		return toPoint(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
    	}

    });

    // @namespace Popup
    // @factory L.popup(options?: Popup options, source?: Layer)
    // Instantiates a `Popup` object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the popup with a reference to the Layer to which it refers.
    var popup = function (options, source) {
    	return new Popup(options, source);
    };


    /* @namespace Map
     * @section Interaction Options
     * @option closePopupOnClick: Boolean = true
     * Set it to `false` if you don't want popups to close when user clicks the map.
     */
    Map.mergeOptions({
    	closePopupOnClick: true
    });


    // @namespace Map
    // @section Methods for Layers and Controls
    Map.include({
    	// @method openPopup(popup: Popup): this
    	// Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
    	// @alternative
    	// @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
    	// Creates a popup with the specified content and options and opens it in the given point on a map.
    	openPopup: function (popup, latlng, options) {
    		if (!(popup instanceof Popup)) {
    			popup = new Popup(options).setContent(popup);
    		}

    		if (latlng) {
    			popup.setLatLng(latlng);
    		}

    		if (this.hasLayer(popup)) {
    			return this;
    		}

    		if (this._popup && this._popup.options.autoClose) {
    			this.closePopup();
    		}

    		this._popup = popup;
    		return this.addLayer(popup);
    	},

    	// @method closePopup(popup?: Popup): this
    	// Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
    	closePopup: function (popup) {
    		if (!popup || popup === this._popup) {
    			popup = this._popup;
    			this._popup = null;
    		}
    		if (popup) {
    			this.removeLayer(popup);
    		}
    		return this;
    	}
    });

    /*
     * @namespace Layer
     * @section Popup methods example
     *
     * All layers share a set of methods convenient for binding popups to it.
     *
     * ```js
     * var layer = L.Polygon(latlngs).bindPopup('Hi There!').addTo(map);
     * layer.openPopup();
     * layer.closePopup();
     * ```
     *
     * Popups will also be automatically opened when the layer is clicked on and closed when the layer is removed from the map or another popup is opened.
     */

    // @section Popup methods
    Layer.include({

    	// @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
    	// Binds a popup to the layer with the passed `content` and sets up the
    	// necessary event listeners. If a `Function` is passed it will receive
    	// the layer as the first argument and should return a `String` or `HTMLElement`.
    	bindPopup: function (content, options) {

    		if (content instanceof Popup) {
    			setOptions(content, options);
    			this._popup = content;
    			content._source = this;
    		} else {
    			if (!this._popup || options) {
    				this._popup = new Popup(options, this);
    			}
    			this._popup.setContent(content);
    		}

    		if (!this._popupHandlersAdded) {
    			this.on({
    				click: this._openPopup,
    				keypress: this._onKeyPress,
    				remove: this.closePopup,
    				move: this._movePopup
    			});
    			this._popupHandlersAdded = true;
    		}

    		return this;
    	},

    	// @method unbindPopup(): this
    	// Removes the popup previously bound with `bindPopup`.
    	unbindPopup: function () {
    		if (this._popup) {
    			this.off({
    				click: this._openPopup,
    				keypress: this._onKeyPress,
    				remove: this.closePopup,
    				move: this._movePopup
    			});
    			this._popupHandlersAdded = false;
    			this._popup = null;
    		}
    		return this;
    	},

    	// @method openPopup(latlng?: LatLng): this
    	// Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
    	openPopup: function (layer, latlng) {
    		if (this._popup && this._map) {
    			latlng = this._popup._prepareOpen(this, layer, latlng);

    			// open the popup on the map
    			this._map.openPopup(this._popup, latlng);
    		}

    		return this;
    	},

    	// @method closePopup(): this
    	// Closes the popup bound to this layer if it is open.
    	closePopup: function () {
    		if (this._popup) {
    			this._popup._close();
    		}
    		return this;
    	},

    	// @method togglePopup(): this
    	// Opens or closes the popup bound to this layer depending on its current state.
    	togglePopup: function (target) {
    		if (this._popup) {
    			if (this._popup._map) {
    				this.closePopup();
    			} else {
    				this.openPopup(target);
    			}
    		}
    		return this;
    	},

    	// @method isPopupOpen(): boolean
    	// Returns `true` if the popup bound to this layer is currently open.
    	isPopupOpen: function () {
    		return (this._popup ? this._popup.isOpen() : false);
    	},

    	// @method setPopupContent(content: String|HTMLElement|Popup): this
    	// Sets the content of the popup bound to this layer.
    	setPopupContent: function (content) {
    		if (this._popup) {
    			this._popup.setContent(content);
    		}
    		return this;
    	},

    	// @method getPopup(): Popup
    	// Returns the popup bound to this layer.
    	getPopup: function () {
    		return this._popup;
    	},

    	_openPopup: function (e) {
    		var layer = e.layer || e.target;

    		if (!this._popup) {
    			return;
    		}

    		if (!this._map) {
    			return;
    		}

    		// prevent map click
    		stop(e);

    		// if this inherits from Path its a vector and we can just
    		// open the popup at the new location
    		if (layer instanceof Path) {
    			this.openPopup(e.layer || e.target, e.latlng);
    			return;
    		}

    		// otherwise treat it like a marker and figure out
    		// if we should toggle it open/closed
    		if (this._map.hasLayer(this._popup) && this._popup._source === layer) {
    			this.closePopup();
    		} else {
    			this.openPopup(layer, e.latlng);
    		}
    	},

    	_movePopup: function (e) {
    		this._popup.setLatLng(e.latlng);
    	},

    	_onKeyPress: function (e) {
    		if (e.originalEvent.keyCode === 13) {
    			this._openPopup(e);
    		}
    	}
    });

    /*
     * @class Tooltip
     * @inherits DivOverlay
     * @aka L.Tooltip
     * Used to display small texts on top of map layers.
     *
     * @example
     *
     * ```js
     * marker.bindTooltip("my tooltip text").openTooltip();
     * ```
     * Note about tooltip offset. Leaflet takes two options in consideration
     * for computing tooltip offsetting:
     * - the `offset` Tooltip option: it defaults to [0, 0], and it's specific to one tooltip.
     *   Add a positive x offset to move the tooltip to the right, and a positive y offset to
     *   move it to the bottom. Negatives will move to the left and top.
     * - the `tooltipAnchor` Icon option: this will only be considered for Marker. You
     *   should adapt this value if you use a custom icon.
     */


    // @namespace Tooltip
    var Tooltip = DivOverlay.extend({

    	// @section
    	// @aka Tooltip options
    	options: {
    		// @option pane: String = 'tooltipPane'
    		// `Map pane` where the tooltip will be added.
    		pane: 'tooltipPane',

    		// @option offset: Point = Point(0, 0)
    		// Optional offset of the tooltip position.
    		offset: [0, 0],

    		// @option direction: String = 'auto'
    		// Direction where to open the tooltip. Possible values are: `right`, `left`,
    		// `top`, `bottom`, `center`, `auto`.
    		// `auto` will dynamically switch between `right` and `left` according to the tooltip
    		// position on the map.
    		direction: 'auto',

    		// @option permanent: Boolean = false
    		// Whether to open the tooltip permanently or only on mouseover.
    		permanent: false,

    		// @option sticky: Boolean = false
    		// If true, the tooltip will follow the mouse instead of being fixed at the feature center.
    		sticky: false,

    		// @option interactive: Boolean = false
    		// If true, the tooltip will listen to the feature events.
    		interactive: false,

    		// @option opacity: Number = 0.9
    		// Tooltip container opacity.
    		opacity: 0.9
    	},

    	onAdd: function (map) {
    		DivOverlay.prototype.onAdd.call(this, map);
    		this.setOpacity(this.options.opacity);

    		// @namespace Map
    		// @section Tooltip events
    		// @event tooltipopen: TooltipEvent
    		// Fired when a tooltip is opened in the map.
    		map.fire('tooltipopen', {tooltip: this});

    		if (this._source) {
    			// @namespace Layer
    			// @section Tooltip events
    			// @event tooltipopen: TooltipEvent
    			// Fired when a tooltip bound to this layer is opened.
    			this._source.fire('tooltipopen', {tooltip: this}, true);
    		}
    	},

    	onRemove: function (map) {
    		DivOverlay.prototype.onRemove.call(this, map);

    		// @namespace Map
    		// @section Tooltip events
    		// @event tooltipclose: TooltipEvent
    		// Fired when a tooltip in the map is closed.
    		map.fire('tooltipclose', {tooltip: this});

    		if (this._source) {
    			// @namespace Layer
    			// @section Tooltip events
    			// @event tooltipclose: TooltipEvent
    			// Fired when a tooltip bound to this layer is closed.
    			this._source.fire('tooltipclose', {tooltip: this}, true);
    		}
    	},

    	getEvents: function () {
    		var events = DivOverlay.prototype.getEvents.call(this);

    		if (touch && !this.options.permanent) {
    			events.preclick = this._close;
    		}

    		return events;
    	},

    	_close: function () {
    		if (this._map) {
    			this._map.closeTooltip(this);
    		}
    	},

    	_initLayout: function () {
    		var prefix = 'leaflet-tooltip',
    		    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

    		this._contentNode = this._container = create$1('div', className);
    	},

    	_updateLayout: function () {},

    	_adjustPan: function () {},

    	_setPosition: function (pos) {
    		var subX, subY,
    		    map = this._map,
    		    container = this._container,
    		    centerPoint = map.latLngToContainerPoint(map.getCenter()),
    		    tooltipPoint = map.layerPointToContainerPoint(pos),
    		    direction = this.options.direction,
    		    tooltipWidth = container.offsetWidth,
    		    tooltipHeight = container.offsetHeight,
    		    offset = toPoint(this.options.offset),
    		    anchor = this._getAnchor();

    		if (direction === 'top') {
    			subX = tooltipWidth / 2;
    			subY = tooltipHeight;
    		} else if (direction === 'bottom') {
    			subX = tooltipWidth / 2;
    			subY = 0;
    		} else if (direction === 'center') {
    			subX = tooltipWidth / 2;
    			subY = tooltipHeight / 2;
    		} else if (direction === 'right') {
    			subX = 0;
    			subY = tooltipHeight / 2;
    		} else if (direction === 'left') {
    			subX = tooltipWidth;
    			subY = tooltipHeight / 2;
    		} else if (tooltipPoint.x < centerPoint.x) {
    			direction = 'right';
    			subX = 0;
    			subY = tooltipHeight / 2;
    		} else {
    			direction = 'left';
    			subX = tooltipWidth + (offset.x + anchor.x) * 2;
    			subY = tooltipHeight / 2;
    		}

    		pos = pos.subtract(toPoint(subX, subY, true)).add(offset).add(anchor);

    		removeClass(container, 'leaflet-tooltip-right');
    		removeClass(container, 'leaflet-tooltip-left');
    		removeClass(container, 'leaflet-tooltip-top');
    		removeClass(container, 'leaflet-tooltip-bottom');
    		addClass(container, 'leaflet-tooltip-' + direction);
    		setPosition(container, pos);
    	},

    	_updatePosition: function () {
    		var pos = this._map.latLngToLayerPoint(this._latlng);
    		this._setPosition(pos);
    	},

    	setOpacity: function (opacity) {
    		this.options.opacity = opacity;

    		if (this._container) {
    			setOpacity(this._container, opacity);
    		}
    	},

    	_animateZoom: function (e) {
    		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
    		this._setPosition(pos);
    	},

    	_getAnchor: function () {
    		// Where should we anchor the tooltip on the source layer?
    		return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
    	}

    });

    // @namespace Tooltip
    // @factory L.tooltip(options?: Tooltip options, source?: Layer)
    // Instantiates a Tooltip object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the tooltip with a reference to the Layer to which it refers.
    var tooltip = function (options, source) {
    	return new Tooltip(options, source);
    };

    // @namespace Map
    // @section Methods for Layers and Controls
    Map.include({

    	// @method openTooltip(tooltip: Tooltip): this
    	// Opens the specified tooltip.
    	// @alternative
    	// @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
    	// Creates a tooltip with the specified content and options and open it.
    	openTooltip: function (tooltip, latlng, options) {
    		if (!(tooltip instanceof Tooltip)) {
    			tooltip = new Tooltip(options).setContent(tooltip);
    		}

    		if (latlng) {
    			tooltip.setLatLng(latlng);
    		}

    		if (this.hasLayer(tooltip)) {
    			return this;
    		}

    		return this.addLayer(tooltip);
    	},

    	// @method closeTooltip(tooltip?: Tooltip): this
    	// Closes the tooltip given as parameter.
    	closeTooltip: function (tooltip) {
    		if (tooltip) {
    			this.removeLayer(tooltip);
    		}
    		return this;
    	}

    });

    /*
     * @namespace Layer
     * @section Tooltip methods example
     *
     * All layers share a set of methods convenient for binding tooltips to it.
     *
     * ```js
     * var layer = L.Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
     * layer.openTooltip();
     * layer.closeTooltip();
     * ```
     */

    // @section Tooltip methods
    Layer.include({

    	// @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
    	// Binds a tooltip to the layer with the passed `content` and sets up the
    	// necessary event listeners. If a `Function` is passed it will receive
    	// the layer as the first argument and should return a `String` or `HTMLElement`.
    	bindTooltip: function (content, options) {

    		if (content instanceof Tooltip) {
    			setOptions(content, options);
    			this._tooltip = content;
    			content._source = this;
    		} else {
    			if (!this._tooltip || options) {
    				this._tooltip = new Tooltip(options, this);
    			}
    			this._tooltip.setContent(content);

    		}

    		this._initTooltipInteractions();

    		if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
    			this.openTooltip();
    		}

    		return this;
    	},

    	// @method unbindTooltip(): this
    	// Removes the tooltip previously bound with `bindTooltip`.
    	unbindTooltip: function () {
    		if (this._tooltip) {
    			this._initTooltipInteractions(true);
    			this.closeTooltip();
    			this._tooltip = null;
    		}
    		return this;
    	},

    	_initTooltipInteractions: function (remove$$1) {
    		if (!remove$$1 && this._tooltipHandlersAdded) { return; }
    		var onOff = remove$$1 ? 'off' : 'on',
    		    events = {
    			remove: this.closeTooltip,
    			move: this._moveTooltip
    		    };
    		if (!this._tooltip.options.permanent) {
    			events.mouseover = this._openTooltip;
    			events.mouseout = this.closeTooltip;
    			if (this._tooltip.options.sticky) {
    				events.mousemove = this._moveTooltip;
    			}
    			if (touch) {
    				events.click = this._openTooltip;
    			}
    		} else {
    			events.add = this._openTooltip;
    		}
    		this[onOff](events);
    		this._tooltipHandlersAdded = !remove$$1;
    	},

    	// @method openTooltip(latlng?: LatLng): this
    	// Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
    	openTooltip: function (layer, latlng) {
    		if (this._tooltip && this._map) {
    			latlng = this._tooltip._prepareOpen(this, layer, latlng);

    			// open the tooltip on the map
    			this._map.openTooltip(this._tooltip, latlng);

    			// Tooltip container may not be defined if not permanent and never
    			// opened.
    			if (this._tooltip.options.interactive && this._tooltip._container) {
    				addClass(this._tooltip._container, 'leaflet-clickable');
    				this.addInteractiveTarget(this._tooltip._container);
    			}
    		}

    		return this;
    	},

    	// @method closeTooltip(): this
    	// Closes the tooltip bound to this layer if it is open.
    	closeTooltip: function () {
    		if (this._tooltip) {
    			this._tooltip._close();
    			if (this._tooltip.options.interactive && this._tooltip._container) {
    				removeClass(this._tooltip._container, 'leaflet-clickable');
    				this.removeInteractiveTarget(this._tooltip._container);
    			}
    		}
    		return this;
    	},

    	// @method toggleTooltip(): this
    	// Opens or closes the tooltip bound to this layer depending on its current state.
    	toggleTooltip: function (target) {
    		if (this._tooltip) {
    			if (this._tooltip._map) {
    				this.closeTooltip();
    			} else {
    				this.openTooltip(target);
    			}
    		}
    		return this;
    	},

    	// @method isTooltipOpen(): boolean
    	// Returns `true` if the tooltip bound to this layer is currently open.
    	isTooltipOpen: function () {
    		return this._tooltip.isOpen();
    	},

    	// @method setTooltipContent(content: String|HTMLElement|Tooltip): this
    	// Sets the content of the tooltip bound to this layer.
    	setTooltipContent: function (content) {
    		if (this._tooltip) {
    			this._tooltip.setContent(content);
    		}
    		return this;
    	},

    	// @method getTooltip(): Tooltip
    	// Returns the tooltip bound to this layer.
    	getTooltip: function () {
    		return this._tooltip;
    	},

    	_openTooltip: function (e) {
    		var layer = e.layer || e.target;

    		if (!this._tooltip || !this._map) {
    			return;
    		}
    		this.openTooltip(layer, this._tooltip.options.sticky ? e.latlng : undefined);
    	},

    	_moveTooltip: function (e) {
    		var latlng = e.latlng, containerPoint, layerPoint;
    		if (this._tooltip.options.sticky && e.originalEvent) {
    			containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
    			layerPoint = this._map.containerPointToLayerPoint(containerPoint);
    			latlng = this._map.layerPointToLatLng(layerPoint);
    		}
    		this._tooltip.setLatLng(latlng);
    	}
    });

    /*
     * @class DivIcon
     * @aka L.DivIcon
     * @inherits Icon
     *
     * Represents a lightweight icon for markers that uses a simple `<div>`
     * element instead of an image. Inherits from `Icon` but ignores the `iconUrl` and shadow options.
     *
     * @example
     * ```js
     * var myIcon = L.divIcon({className: 'my-div-icon'});
     * // you can set .my-div-icon styles in CSS
     *
     * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
     * ```
     *
     * By default, it has a 'leaflet-div-icon' CSS class and is styled as a little white square with a shadow.
     */

    var DivIcon = Icon.extend({
    	options: {
    		// @section
    		// @aka DivIcon options
    		iconSize: [12, 12], // also can be set through CSS

    		// iconAnchor: (Point),
    		// popupAnchor: (Point),

    		// @option html: String|HTMLElement = ''
    		// Custom HTML code to put inside the div element, empty by default. Alternatively,
    		// an instance of `HTMLElement`.
    		html: false,

    		// @option bgPos: Point = [0, 0]
    		// Optional relative position of the background, in pixels
    		bgPos: null,

    		className: 'leaflet-div-icon'
    	},

    	createIcon: function (oldIcon) {
    		var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
    		    options = this.options;

    		if (options.html instanceof Element) {
    			empty(div);
    			div.appendChild(options.html);
    		} else {
    			div.innerHTML = options.html !== false ? options.html : '';
    		}

    		if (options.bgPos) {
    			var bgPos = toPoint(options.bgPos);
    			div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
    		}
    		this._setIconStyles(div, 'icon');

    		return div;
    	},

    	createShadow: function () {
    		return null;
    	}
    });

    // @factory L.divIcon(options: DivIcon options)
    // Creates a `DivIcon` instance with the given options.
    function divIcon(options) {
    	return new DivIcon(options);
    }

    Icon.Default = IconDefault;

    /*
     * @class GridLayer
     * @inherits Layer
     * @aka L.GridLayer
     *
     * Generic class for handling a tiled grid of HTML elements. This is the base class for all tile layers and replaces `TileLayer.Canvas`.
     * GridLayer can be extended to create a tiled grid of HTML elements like `<canvas>`, `<img>` or `<div>`. GridLayer will handle creating and animating these DOM elements for you.
     *
     *
     * @section Synchronous usage
     * @example
     *
     * To create a custom layer, extend GridLayer and implement the `createTile()` method, which will be passed a `Point` object with the `x`, `y`, and `z` (zoom level) coordinates to draw your tile.
     *
     * ```js
     * var CanvasLayer = L.GridLayer.extend({
     *     createTile: function(coords){
     *         // create a <canvas> element for drawing
     *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
     *
     *         // setup tile width and height according to the options
     *         var size = this.getTileSize();
     *         tile.width = size.x;
     *         tile.height = size.y;
     *
     *         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
     *         var ctx = tile.getContext('2d');
     *
     *         // return the tile so it can be rendered on screen
     *         return tile;
     *     }
     * });
     * ```
     *
     * @section Asynchronous usage
     * @example
     *
     * Tile creation can also be asynchronous, this is useful when using a third-party drawing library. Once the tile is finished drawing it can be passed to the `done()` callback.
     *
     * ```js
     * var CanvasLayer = L.GridLayer.extend({
     *     createTile: function(coords, done){
     *         var error;
     *
     *         // create a <canvas> element for drawing
     *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
     *
     *         // setup tile width and height according to the options
     *         var size = this.getTileSize();
     *         tile.width = size.x;
     *         tile.height = size.y;
     *
     *         // draw something asynchronously and pass the tile to the done() callback
     *         setTimeout(function() {
     *             done(error, tile);
     *         }, 1000);
     *
     *         return tile;
     *     }
     * });
     * ```
     *
     * @section
     */


    var GridLayer = Layer.extend({

    	// @section
    	// @aka GridLayer options
    	options: {
    		// @option tileSize: Number|Point = 256
    		// Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
    		tileSize: 256,

    		// @option opacity: Number = 1.0
    		// Opacity of the tiles. Can be used in the `createTile()` function.
    		opacity: 1,

    		// @option updateWhenIdle: Boolean = (depends)
    		// Load new tiles only when panning ends.
    		// `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
    		// `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
    		// [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
    		updateWhenIdle: mobile,

    		// @option updateWhenZooming: Boolean = true
    		// By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
    		updateWhenZooming: true,

    		// @option updateInterval: Number = 200
    		// Tiles will not update more than once every `updateInterval` milliseconds when panning.
    		updateInterval: 200,

    		// @option zIndex: Number = 1
    		// The explicit zIndex of the tile layer.
    		zIndex: 1,

    		// @option bounds: LatLngBounds = undefined
    		// If set, tiles will only be loaded inside the set `LatLngBounds`.
    		bounds: null,

    		// @option minZoom: Number = 0
    		// The minimum zoom level down to which this layer will be displayed (inclusive).
    		minZoom: 0,

    		// @option maxZoom: Number = undefined
    		// The maximum zoom level up to which this layer will be displayed (inclusive).
    		maxZoom: undefined,

    		// @option maxNativeZoom: Number = undefined
    		// Maximum zoom number the tile source has available. If it is specified,
    		// the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
    		// from `maxNativeZoom` level and auto-scaled.
    		maxNativeZoom: undefined,

    		// @option minNativeZoom: Number = undefined
    		// Minimum zoom number the tile source has available. If it is specified,
    		// the tiles on all zoom levels lower than `minNativeZoom` will be loaded
    		// from `minNativeZoom` level and auto-scaled.
    		minNativeZoom: undefined,

    		// @option noWrap: Boolean = false
    		// Whether the layer is wrapped around the antimeridian. If `true`, the
    		// GridLayer will only be displayed once at low zoom levels. Has no
    		// effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
    		// in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
    		// tiles outside the CRS limits.
    		noWrap: false,

    		// @option pane: String = 'tilePane'
    		// `Map pane` where the grid layer will be added.
    		pane: 'tilePane',

    		// @option className: String = ''
    		// A custom class name to assign to the tile layer. Empty by default.
    		className: '',

    		// @option keepBuffer: Number = 2
    		// When panning the map, keep this many rows and columns of tiles before unloading them.
    		keepBuffer: 2
    	},

    	initialize: function (options) {
    		setOptions(this, options);
    	},

    	onAdd: function () {
    		this._initContainer();

    		this._levels = {};
    		this._tiles = {};

    		this._resetView();
    		this._update();
    	},

    	beforeAdd: function (map) {
    		map._addZoomLimit(this);
    	},

    	onRemove: function (map) {
    		this._removeAllTiles();
    		remove(this._container);
    		map._removeZoomLimit(this);
    		this._container = null;
    		this._tileZoom = undefined;
    	},

    	// @method bringToFront: this
    	// Brings the tile layer to the top of all tile layers.
    	bringToFront: function () {
    		if (this._map) {
    			toFront(this._container);
    			this._setAutoZIndex(Math.max);
    		}
    		return this;
    	},

    	// @method bringToBack: this
    	// Brings the tile layer to the bottom of all tile layers.
    	bringToBack: function () {
    		if (this._map) {
    			toBack(this._container);
    			this._setAutoZIndex(Math.min);
    		}
    		return this;
    	},

    	// @method getContainer: HTMLElement
    	// Returns the HTML element that contains the tiles for this layer.
    	getContainer: function () {
    		return this._container;
    	},

    	// @method setOpacity(opacity: Number): this
    	// Changes the [opacity](#gridlayer-opacity) of the grid layer.
    	setOpacity: function (opacity) {
    		this.options.opacity = opacity;
    		this._updateOpacity();
    		return this;
    	},

    	// @method setZIndex(zIndex: Number): this
    	// Changes the [zIndex](#gridlayer-zindex) of the grid layer.
    	setZIndex: function (zIndex) {
    		this.options.zIndex = zIndex;
    		this._updateZIndex();

    		return this;
    	},

    	// @method isLoading: Boolean
    	// Returns `true` if any tile in the grid layer has not finished loading.
    	isLoading: function () {
    		return this._loading;
    	},

    	// @method redraw: this
    	// Causes the layer to clear all the tiles and request them again.
    	redraw: function () {
    		if (this._map) {
    			this._removeAllTiles();
    			this._update();
    		}
    		return this;
    	},

    	getEvents: function () {
    		var events = {
    			viewprereset: this._invalidateAll,
    			viewreset: this._resetView,
    			zoom: this._resetView,
    			moveend: this._onMoveEnd
    		};

    		if (!this.options.updateWhenIdle) {
    			// update tiles on move, but not more often than once per given interval
    			if (!this._onMove) {
    				this._onMove = throttle(this._onMoveEnd, this.options.updateInterval, this);
    			}

    			events.move = this._onMove;
    		}

    		if (this._zoomAnimated) {
    			events.zoomanim = this._animateZoom;
    		}

    		return events;
    	},

    	// @section Extension methods
    	// Layers extending `GridLayer` shall reimplement the following method.
    	// @method createTile(coords: Object, done?: Function): HTMLElement
    	// Called only internally, must be overridden by classes extending `GridLayer`.
    	// Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
    	// is specified, it must be called when the tile has finished loading and drawing.
    	createTile: function () {
    		return document.createElement('div');
    	},

    	// @section
    	// @method getTileSize: Point
    	// Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
    	getTileSize: function () {
    		var s = this.options.tileSize;
    		return s instanceof Point ? s : new Point(s, s);
    	},

    	_updateZIndex: function () {
    		if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
    			this._container.style.zIndex = this.options.zIndex;
    		}
    	},

    	_setAutoZIndex: function (compare) {
    		// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

    		var layers = this.getPane().children,
    		    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

    		for (var i = 0, len = layers.length, zIndex; i < len; i++) {

    			zIndex = layers[i].style.zIndex;

    			if (layers[i] !== this._container && zIndex) {
    				edgeZIndex = compare(edgeZIndex, +zIndex);
    			}
    		}

    		if (isFinite(edgeZIndex)) {
    			this.options.zIndex = edgeZIndex + compare(-1, 1);
    			this._updateZIndex();
    		}
    	},

    	_updateOpacity: function () {
    		if (!this._map) { return; }

    		// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
    		if (ielt9) { return; }

    		setOpacity(this._container, this.options.opacity);

    		var now = +new Date(),
    		    nextFrame = false,
    		    willPrune = false;

    		for (var key in this._tiles) {
    			var tile = this._tiles[key];
    			if (!tile.current || !tile.loaded) { continue; }

    			var fade = Math.min(1, (now - tile.loaded) / 200);

    			setOpacity(tile.el, fade);
    			if (fade < 1) {
    				nextFrame = true;
    			} else {
    				if (tile.active) {
    					willPrune = true;
    				} else {
    					this._onOpaqueTile(tile);
    				}
    				tile.active = true;
    			}
    		}

    		if (willPrune && !this._noPrune) { this._pruneTiles(); }

    		if (nextFrame) {
    			cancelAnimFrame(this._fadeFrame);
    			this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
    		}
    	},

    	_onOpaqueTile: falseFn,

    	_initContainer: function () {
    		if (this._container) { return; }

    		this._container = create$1('div', 'leaflet-layer ' + (this.options.className || ''));
    		this._updateZIndex();

    		if (this.options.opacity < 1) {
    			this._updateOpacity();
    		}

    		this.getPane().appendChild(this._container);
    	},

    	_updateLevels: function () {

    		var zoom = this._tileZoom,
    		    maxZoom = this.options.maxZoom;

    		if (zoom === undefined) { return undefined; }

    		for (var z in this._levels) {
    			z = Number(z);
    			if (this._levels[z].el.children.length || z === zoom) {
    				this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
    				this._onUpdateLevel(z);
    			} else {
    				remove(this._levels[z].el);
    				this._removeTilesAtZoom(z);
    				this._onRemoveLevel(z);
    				delete this._levels[z];
    			}
    		}

    		var level = this._levels[zoom],
    		    map = this._map;

    		if (!level) {
    			level = this._levels[zoom] = {};

    			level.el = create$1('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
    			level.el.style.zIndex = maxZoom;

    			level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
    			level.zoom = zoom;

    			this._setZoomTransform(level, map.getCenter(), map.getZoom());

    			// force the browser to consider the newly added element for transition
    			falseFn(level.el.offsetWidth);

    			this._onCreateLevel(level);
    		}

    		this._level = level;

    		return level;
    	},

    	_onUpdateLevel: falseFn,

    	_onRemoveLevel: falseFn,

    	_onCreateLevel: falseFn,

    	_pruneTiles: function () {
    		if (!this._map) {
    			return;
    		}

    		var key, tile;

    		var zoom = this._map.getZoom();
    		if (zoom > this.options.maxZoom ||
    			zoom < this.options.minZoom) {
    			this._removeAllTiles();
    			return;
    		}

    		for (key in this._tiles) {
    			tile = this._tiles[key];
    			tile.retain = tile.current;
    		}

    		for (key in this._tiles) {
    			tile = this._tiles[key];
    			if (tile.current && !tile.active) {
    				var coords = tile.coords;
    				if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
    					this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
    				}
    			}
    		}

    		for (key in this._tiles) {
    			if (!this._tiles[key].retain) {
    				this._removeTile(key);
    			}
    		}
    	},

    	_removeTilesAtZoom: function (zoom) {
    		for (var key in this._tiles) {
    			if (this._tiles[key].coords.z !== zoom) {
    				continue;
    			}
    			this._removeTile(key);
    		}
    	},

    	_removeAllTiles: function () {
    		for (var key in this._tiles) {
    			this._removeTile(key);
    		}
    	},

    	_invalidateAll: function () {
    		for (var z in this._levels) {
    			remove(this._levels[z].el);
    			this._onRemoveLevel(Number(z));
    			delete this._levels[z];
    		}
    		this._removeAllTiles();

    		this._tileZoom = undefined;
    	},

    	_retainParent: function (x, y, z, minZoom) {
    		var x2 = Math.floor(x / 2),
    		    y2 = Math.floor(y / 2),
    		    z2 = z - 1,
    		    coords2 = new Point(+x2, +y2);
    		coords2.z = +z2;

    		var key = this._tileCoordsToKey(coords2),
    		    tile = this._tiles[key];

    		if (tile && tile.active) {
    			tile.retain = true;
    			return true;

    		} else if (tile && tile.loaded) {
    			tile.retain = true;
    		}

    		if (z2 > minZoom) {
    			return this._retainParent(x2, y2, z2, minZoom);
    		}

    		return false;
    	},

    	_retainChildren: function (x, y, z, maxZoom) {

    		for (var i = 2 * x; i < 2 * x + 2; i++) {
    			for (var j = 2 * y; j < 2 * y + 2; j++) {

    				var coords = new Point(i, j);
    				coords.z = z + 1;

    				var key = this._tileCoordsToKey(coords),
    				    tile = this._tiles[key];

    				if (tile && tile.active) {
    					tile.retain = true;
    					continue;

    				} else if (tile && tile.loaded) {
    					tile.retain = true;
    				}

    				if (z + 1 < maxZoom) {
    					this._retainChildren(i, j, z + 1, maxZoom);
    				}
    			}
    		}
    	},

    	_resetView: function (e) {
    		var animating = e && (e.pinch || e.flyTo);
    		this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
    	},

    	_animateZoom: function (e) {
    		this._setView(e.center, e.zoom, true, e.noUpdate);
    	},

    	_clampZoom: function (zoom) {
    		var options = this.options;

    		if (undefined !== options.minNativeZoom && zoom < options.minNativeZoom) {
    			return options.minNativeZoom;
    		}

    		if (undefined !== options.maxNativeZoom && options.maxNativeZoom < zoom) {
    			return options.maxNativeZoom;
    		}

    		return zoom;
    	},

    	_setView: function (center, zoom, noPrune, noUpdate) {
    		var tileZoom = Math.round(zoom);
    		if ((this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
    		    (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)) {
    			tileZoom = undefined;
    		} else {
    			tileZoom = this._clampZoom(tileZoom);
    		}

    		var tileZoomChanged = this.options.updateWhenZooming && (tileZoom !== this._tileZoom);

    		if (!noUpdate || tileZoomChanged) {

    			this._tileZoom = tileZoom;

    			if (this._abortLoading) {
    				this._abortLoading();
    			}

    			this._updateLevels();
    			this._resetGrid();

    			if (tileZoom !== undefined) {
    				this._update(center);
    			}

    			if (!noPrune) {
    				this._pruneTiles();
    			}

    			// Flag to prevent _updateOpacity from pruning tiles during
    			// a zoom anim or a pinch gesture
    			this._noPrune = !!noPrune;
    		}

    		this._setZoomTransforms(center, zoom);
    	},

    	_setZoomTransforms: function (center, zoom) {
    		for (var i in this._levels) {
    			this._setZoomTransform(this._levels[i], center, zoom);
    		}
    	},

    	_setZoomTransform: function (level, center, zoom) {
    		var scale = this._map.getZoomScale(zoom, level.zoom),
    		    translate = level.origin.multiplyBy(scale)
    		        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

    		if (any3d) {
    			setTransform(level.el, translate, scale);
    		} else {
    			setPosition(level.el, translate);
    		}
    	},

    	_resetGrid: function () {
    		var map = this._map,
    		    crs = map.options.crs,
    		    tileSize = this._tileSize = this.getTileSize(),
    		    tileZoom = this._tileZoom;

    		var bounds = this._map.getPixelWorldBounds(this._tileZoom);
    		if (bounds) {
    			this._globalTileRange = this._pxBoundsToTileRange(bounds);
    		}

    		this._wrapX = crs.wrapLng && !this.options.noWrap && [
    			Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
    			Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
    		];
    		this._wrapY = crs.wrapLat && !this.options.noWrap && [
    			Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
    			Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
    		];
    	},

    	_onMoveEnd: function () {
    		if (!this._map || this._map._animatingZoom) { return; }

    		this._update();
    	},

    	_getTiledPixelBounds: function (center) {
    		var map = this._map,
    		    mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
    		    scale = map.getZoomScale(mapZoom, this._tileZoom),
    		    pixelCenter = map.project(center, this._tileZoom).floor(),
    		    halfSize = map.getSize().divideBy(scale * 2);

    		return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
    	},

    	// Private method to load tiles in the grid's active zoom level according to map bounds
    	_update: function (center) {
    		var map = this._map;
    		if (!map) { return; }
    		var zoom = this._clampZoom(map.getZoom());

    		if (center === undefined) { center = map.getCenter(); }
    		if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

    		var pixelBounds = this._getTiledPixelBounds(center),
    		    tileRange = this._pxBoundsToTileRange(pixelBounds),
    		    tileCenter = tileRange.getCenter(),
    		    queue = [],
    		    margin = this.options.keepBuffer,
    		    noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
    		                              tileRange.getTopRight().add([margin, -margin]));

    		// Sanity check: panic if the tile range contains Infinity somewhere.
    		if (!(isFinite(tileRange.min.x) &&
    		      isFinite(tileRange.min.y) &&
    		      isFinite(tileRange.max.x) &&
    		      isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }

    		for (var key in this._tiles) {
    			var c = this._tiles[key].coords;
    			if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
    				this._tiles[key].current = false;
    			}
    		}

    		// _update just loads more tiles. If the tile zoom level differs too much
    		// from the map's, let _setView reset levels and prune old tiles.
    		if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

    		// create a queue of coordinates to load tiles from
    		for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
    			for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
    				var coords = new Point(i, j);
    				coords.z = this._tileZoom;

    				if (!this._isValidTile(coords)) { continue; }

    				var tile = this._tiles[this._tileCoordsToKey(coords)];
    				if (tile) {
    					tile.current = true;
    				} else {
    					queue.push(coords);
    				}
    			}
    		}

    		// sort tile queue to load tiles in order of their distance to center
    		queue.sort(function (a, b) {
    			return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
    		});

    		if (queue.length !== 0) {
    			// if it's the first batch of tiles to load
    			if (!this._loading) {
    				this._loading = true;
    				// @event loading: Event
    				// Fired when the grid layer starts loading tiles.
    				this.fire('loading');
    			}

    			// create DOM fragment to append tiles in one batch
    			var fragment = document.createDocumentFragment();

    			for (i = 0; i < queue.length; i++) {
    				this._addTile(queue[i], fragment);
    			}

    			this._level.el.appendChild(fragment);
    		}
    	},

    	_isValidTile: function (coords) {
    		var crs = this._map.options.crs;

    		if (!crs.infinite) {
    			// don't load tile if it's out of bounds and not wrapped
    			var bounds = this._globalTileRange;
    			if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
    			    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
    		}

    		if (!this.options.bounds) { return true; }

    		// don't load tile if it doesn't intersect the bounds in options
    		var tileBounds = this._tileCoordsToBounds(coords);
    		return toLatLngBounds(this.options.bounds).overlaps(tileBounds);
    	},

    	_keyToBounds: function (key) {
    		return this._tileCoordsToBounds(this._keyToTileCoords(key));
    	},

    	_tileCoordsToNwSe: function (coords) {
    		var map = this._map,
    		    tileSize = this.getTileSize(),
    		    nwPoint = coords.scaleBy(tileSize),
    		    sePoint = nwPoint.add(tileSize),
    		    nw = map.unproject(nwPoint, coords.z),
    		    se = map.unproject(sePoint, coords.z);
    		return [nw, se];
    	},

    	// converts tile coordinates to its geographical bounds
    	_tileCoordsToBounds: function (coords) {
    		var bp = this._tileCoordsToNwSe(coords),
    		    bounds = new LatLngBounds(bp[0], bp[1]);

    		if (!this.options.noWrap) {
    			bounds = this._map.wrapLatLngBounds(bounds);
    		}
    		return bounds;
    	},
    	// converts tile coordinates to key for the tile cache
    	_tileCoordsToKey: function (coords) {
    		return coords.x + ':' + coords.y + ':' + coords.z;
    	},

    	// converts tile cache key to coordinates
    	_keyToTileCoords: function (key) {
    		var k = key.split(':'),
    		    coords = new Point(+k[0], +k[1]);
    		coords.z = +k[2];
    		return coords;
    	},

    	_removeTile: function (key) {
    		var tile = this._tiles[key];
    		if (!tile) { return; }

    		remove(tile.el);

    		delete this._tiles[key];

    		// @event tileunload: TileEvent
    		// Fired when a tile is removed (e.g. when a tile goes off the screen).
    		this.fire('tileunload', {
    			tile: tile.el,
    			coords: this._keyToTileCoords(key)
    		});
    	},

    	_initTile: function (tile) {
    		addClass(tile, 'leaflet-tile');

    		var tileSize = this.getTileSize();
    		tile.style.width = tileSize.x + 'px';
    		tile.style.height = tileSize.y + 'px';

    		tile.onselectstart = falseFn;
    		tile.onmousemove = falseFn;

    		// update opacity on tiles in IE7-8 because of filter inheritance problems
    		if (ielt9 && this.options.opacity < 1) {
    			setOpacity(tile, this.options.opacity);
    		}

    		// without this hack, tiles disappear after zoom on Chrome for Android
    		// https://github.com/Leaflet/Leaflet/issues/2078
    		if (android && !android23) {
    			tile.style.WebkitBackfaceVisibility = 'hidden';
    		}
    	},

    	_addTile: function (coords, container) {
    		var tilePos = this._getTilePos(coords),
    		    key = this._tileCoordsToKey(coords);

    		var tile = this.createTile(this._wrapCoords(coords), bind(this._tileReady, this, coords));

    		this._initTile(tile);

    		// if createTile is defined with a second argument ("done" callback),
    		// we know that tile is async and will be ready later; otherwise
    		if (this.createTile.length < 2) {
    			// mark tile as ready, but delay one frame for opacity animation to happen
    			requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
    		}

    		setPosition(tile, tilePos);

    		// save tile in cache
    		this._tiles[key] = {
    			el: tile,
    			coords: coords,
    			current: true
    		};

    		container.appendChild(tile);
    		// @event tileloadstart: TileEvent
    		// Fired when a tile is requested and starts loading.
    		this.fire('tileloadstart', {
    			tile: tile,
    			coords: coords
    		});
    	},

    	_tileReady: function (coords, err, tile) {
    		if (err) {
    			// @event tileerror: TileErrorEvent
    			// Fired when there is an error loading a tile.
    			this.fire('tileerror', {
    				error: err,
    				tile: tile,
    				coords: coords
    			});
    		}

    		var key = this._tileCoordsToKey(coords);

    		tile = this._tiles[key];
    		if (!tile) { return; }

    		tile.loaded = +new Date();
    		if (this._map._fadeAnimated) {
    			setOpacity(tile.el, 0);
    			cancelAnimFrame(this._fadeFrame);
    			this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
    		} else {
    			tile.active = true;
    			this._pruneTiles();
    		}

    		if (!err) {
    			addClass(tile.el, 'leaflet-tile-loaded');

    			// @event tileload: TileEvent
    			// Fired when a tile loads.
    			this.fire('tileload', {
    				tile: tile.el,
    				coords: coords
    			});
    		}

    		if (this._noTilesToLoad()) {
    			this._loading = false;
    			// @event load: Event
    			// Fired when the grid layer loaded all visible tiles.
    			this.fire('load');

    			if (ielt9 || !this._map._fadeAnimated) {
    				requestAnimFrame(this._pruneTiles, this);
    			} else {
    				// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
    				// to trigger a pruning.
    				setTimeout(bind(this._pruneTiles, this), 250);
    			}
    		}
    	},

    	_getTilePos: function (coords) {
    		return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
    	},

    	_wrapCoords: function (coords) {
    		var newCoords = new Point(
    			this._wrapX ? wrapNum(coords.x, this._wrapX) : coords.x,
    			this._wrapY ? wrapNum(coords.y, this._wrapY) : coords.y);
    		newCoords.z = coords.z;
    		return newCoords;
    	},

    	_pxBoundsToTileRange: function (bounds) {
    		var tileSize = this.getTileSize();
    		return new Bounds(
    			bounds.min.unscaleBy(tileSize).floor(),
    			bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
    	},

    	_noTilesToLoad: function () {
    		for (var key in this._tiles) {
    			if (!this._tiles[key].loaded) { return false; }
    		}
    		return true;
    	}
    });

    // @factory L.gridLayer(options?: GridLayer options)
    // Creates a new instance of GridLayer with the supplied options.
    function gridLayer(options) {
    	return new GridLayer(options);
    }

    /*
     * @class TileLayer
     * @inherits GridLayer
     * @aka L.TileLayer
     * Used to load and display tile layers on the map. Note that most tile servers require attribution, which you can set under `Layer`. Extends `GridLayer`.
     *
     * @example
     *
     * ```js
     * L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(map);
     * ```
     *
     * @section URL template
     * @example
     *
     * A string of the following form:
     *
     * ```
     * 'http://{s}.somedomain.com/blabla/{z}/{x}/{y}{r}.png'
     * ```
     *
     * `{s}` means one of the available subdomains (used sequentially to help with browser parallel requests per domain limitation; subdomain values are specified in options; `a`, `b` or `c` by default, can be omitted), `{z}` — zoom level, `{x}` and `{y}` — tile coordinates. `{r}` can be used to add "&commat;2x" to the URL to load retina tiles.
     *
     * You can use custom keys in the template, which will be [evaluated](#util-template) from TileLayer options, like this:
     *
     * ```
     * L.tileLayer('http://{s}.somedomain.com/{foo}/{z}/{x}/{y}.png', {foo: 'bar'});
     * ```
     */


    var TileLayer = GridLayer.extend({

    	// @section
    	// @aka TileLayer options
    	options: {
    		// @option minZoom: Number = 0
    		// The minimum zoom level down to which this layer will be displayed (inclusive).
    		minZoom: 0,

    		// @option maxZoom: Number = 18
    		// The maximum zoom level up to which this layer will be displayed (inclusive).
    		maxZoom: 18,

    		// @option subdomains: String|String[] = 'abc'
    		// Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
    		subdomains: 'abc',

    		// @option errorTileUrl: String = ''
    		// URL to the tile image to show in place of the tile that failed to load.
    		errorTileUrl: '',

    		// @option zoomOffset: Number = 0
    		// The zoom number used in tile URLs will be offset with this value.
    		zoomOffset: 0,

    		// @option tms: Boolean = false
    		// If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
    		tms: false,

    		// @option zoomReverse: Boolean = false
    		// If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
    		zoomReverse: false,

    		// @option detectRetina: Boolean = false
    		// If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
    		detectRetina: false,

    		// @option crossOrigin: Boolean|String = false
    		// Whether the crossOrigin attribute will be added to the tiles.
    		// If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
    		// Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
    		crossOrigin: false
    	},

    	initialize: function (url, options) {

    		this._url = url;

    		options = setOptions(this, options);

    		// detecting retina displays, adjusting tileSize and zoom levels
    		if (options.detectRetina && retina && options.maxZoom > 0) {

    			options.tileSize = Math.floor(options.tileSize / 2);

    			if (!options.zoomReverse) {
    				options.zoomOffset++;
    				options.maxZoom--;
    			} else {
    				options.zoomOffset--;
    				options.minZoom++;
    			}

    			options.minZoom = Math.max(0, options.minZoom);
    		}

    		if (typeof options.subdomains === 'string') {
    			options.subdomains = options.subdomains.split('');
    		}

    		// for https://github.com/Leaflet/Leaflet/issues/137
    		if (!android) {
    			this.on('tileunload', this._onTileRemove);
    		}
    	},

    	// @method setUrl(url: String, noRedraw?: Boolean): this
    	// Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
    	// If the URL does not change, the layer will not be redrawn unless
    	// the noRedraw parameter is set to false.
    	setUrl: function (url, noRedraw) {
    		if (this._url === url && noRedraw === undefined) {
    			noRedraw = true;
    		}

    		this._url = url;

    		if (!noRedraw) {
    			this.redraw();
    		}
    		return this;
    	},

    	// @method createTile(coords: Object, done?: Function): HTMLElement
    	// Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
    	// to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
    	// callback is called when the tile has been loaded.
    	createTile: function (coords, done) {
    		var tile = document.createElement('img');

    		on(tile, 'load', bind(this._tileOnLoad, this, done, tile));
    		on(tile, 'error', bind(this._tileOnError, this, done, tile));

    		if (this.options.crossOrigin || this.options.crossOrigin === '') {
    			tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
    		}

    		/*
    		 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
    		 http://www.w3.org/TR/WCAG20-TECHS/H67
    		*/
    		tile.alt = '';

    		/*
    		 Set role="presentation" to force screen readers to ignore this
    		 https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
    		*/
    		tile.setAttribute('role', 'presentation');

    		tile.src = this.getTileUrl(coords);

    		return tile;
    	},

    	// @section Extension methods
    	// @uninheritable
    	// Layers extending `TileLayer` might reimplement the following method.
    	// @method getTileUrl(coords: Object): String
    	// Called only internally, returns the URL for a tile given its coordinates.
    	// Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
    	getTileUrl: function (coords) {
    		var data = {
    			r: retina ? '@2x' : '',
    			s: this._getSubdomain(coords),
    			x: coords.x,
    			y: coords.y,
    			z: this._getZoomForUrl()
    		};
    		if (this._map && !this._map.options.crs.infinite) {
    			var invertedY = this._globalTileRange.max.y - coords.y;
    			if (this.options.tms) {
    				data['y'] = invertedY;
    			}
    			data['-y'] = invertedY;
    		}

    		return template(this._url, extend(data, this.options));
    	},

    	_tileOnLoad: function (done, tile) {
    		// For https://github.com/Leaflet/Leaflet/issues/3332
    		if (ielt9) {
    			setTimeout(bind(done, this, null, tile), 0);
    		} else {
    			done(null, tile);
    		}
    	},

    	_tileOnError: function (done, tile, e) {
    		var errorUrl = this.options.errorTileUrl;
    		if (errorUrl && tile.getAttribute('src') !== errorUrl) {
    			tile.src = errorUrl;
    		}
    		done(e, tile);
    	},

    	_onTileRemove: function (e) {
    		e.tile.onload = null;
    	},

    	_getZoomForUrl: function () {
    		var zoom = this._tileZoom,
    		maxZoom = this.options.maxZoom,
    		zoomReverse = this.options.zoomReverse,
    		zoomOffset = this.options.zoomOffset;

    		if (zoomReverse) {
    			zoom = maxZoom - zoom;
    		}

    		return zoom + zoomOffset;
    	},

    	_getSubdomain: function (tilePoint) {
    		var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
    		return this.options.subdomains[index];
    	},

    	// stops loading all tiles in the background layer
    	_abortLoading: function () {
    		var i, tile;
    		for (i in this._tiles) {
    			if (this._tiles[i].coords.z !== this._tileZoom) {
    				tile = this._tiles[i].el;

    				tile.onload = falseFn;
    				tile.onerror = falseFn;

    				if (!tile.complete) {
    					tile.src = emptyImageUrl;
    					remove(tile);
    					delete this._tiles[i];
    				}
    			}
    		}
    	},

    	_removeTile: function (key) {
    		var tile = this._tiles[key];
    		if (!tile) { return; }

    		// Cancels any pending http requests associated with the tile
    		// unless we're on Android's stock browser,
    		// see https://github.com/Leaflet/Leaflet/issues/137
    		if (!androidStock) {
    			tile.el.setAttribute('src', emptyImageUrl);
    		}

    		return GridLayer.prototype._removeTile.call(this, key);
    	},

    	_tileReady: function (coords, err, tile) {
    		if (!this._map || (tile && tile.getAttribute('src') === emptyImageUrl)) {
    			return;
    		}

    		return GridLayer.prototype._tileReady.call(this, coords, err, tile);
    	}
    });


    // @factory L.tilelayer(urlTemplate: String, options?: TileLayer options)
    // Instantiates a tile layer object given a `URL template` and optionally an options object.

    function tileLayer(url, options) {
    	return new TileLayer(url, options);
    }

    /*
     * @class TileLayer.WMS
     * @inherits TileLayer
     * @aka L.TileLayer.WMS
     * Used to display [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services as tile layers on the map. Extends `TileLayer`.
     *
     * @example
     *
     * ```js
     * var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
     * 	layers: 'nexrad-n0r-900913',
     * 	format: 'image/png',
     * 	transparent: true,
     * 	attribution: "Weather data © 2012 IEM Nexrad"
     * });
     * ```
     */

    var TileLayerWMS = TileLayer.extend({

    	// @section
    	// @aka TileLayer.WMS options
    	// If any custom options not documented here are used, they will be sent to the
    	// WMS server as extra parameters in each request URL. This can be useful for
    	// [non-standard vendor WMS parameters](http://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
    	defaultWmsParams: {
    		service: 'WMS',
    		request: 'GetMap',

    		// @option layers: String = ''
    		// **(required)** Comma-separated list of WMS layers to show.
    		layers: '',

    		// @option styles: String = ''
    		// Comma-separated list of WMS styles.
    		styles: '',

    		// @option format: String = 'image/jpeg'
    		// WMS image format (use `'image/png'` for layers with transparency).
    		format: 'image/jpeg',

    		// @option transparent: Boolean = false
    		// If `true`, the WMS service will return images with transparency.
    		transparent: false,

    		// @option version: String = '1.1.1'
    		// Version of the WMS service to use
    		version: '1.1.1'
    	},

    	options: {
    		// @option crs: CRS = null
    		// Coordinate Reference System to use for the WMS requests, defaults to
    		// map CRS. Don't change this if you're not sure what it means.
    		crs: null,

    		// @option uppercase: Boolean = false
    		// If `true`, WMS request parameter keys will be uppercase.
    		uppercase: false
    	},

    	initialize: function (url, options) {

    		this._url = url;

    		var wmsParams = extend({}, this.defaultWmsParams);

    		// all keys that are not TileLayer options go to WMS params
    		for (var i in options) {
    			if (!(i in this.options)) {
    				wmsParams[i] = options[i];
    			}
    		}

    		options = setOptions(this, options);

    		var realRetina = options.detectRetina && retina ? 2 : 1;
    		var tileSize = this.getTileSize();
    		wmsParams.width = tileSize.x * realRetina;
    		wmsParams.height = tileSize.y * realRetina;

    		this.wmsParams = wmsParams;
    	},

    	onAdd: function (map) {

    		this._crs = this.options.crs || map.options.crs;
    		this._wmsVersion = parseFloat(this.wmsParams.version);

    		var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
    		this.wmsParams[projectionKey] = this._crs.code;

    		TileLayer.prototype.onAdd.call(this, map);
    	},

    	getTileUrl: function (coords) {

    		var tileBounds = this._tileCoordsToNwSe(coords),
    		    crs = this._crs,
    		    bounds = toBounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])),
    		    min = bounds.min,
    		    max = bounds.max,
    		    bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ?
    		    [min.y, min.x, max.y, max.x] :
    		    [min.x, min.y, max.x, max.y]).join(','),
    		    url = TileLayer.prototype.getTileUrl.call(this, coords);
    		return url +
    			getParamString(this.wmsParams, url, this.options.uppercase) +
    			(this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
    	},

    	// @method setParams(params: Object, noRedraw?: Boolean): this
    	// Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
    	setParams: function (params, noRedraw) {

    		extend(this.wmsParams, params);

    		if (!noRedraw) {
    			this.redraw();
    		}

    		return this;
    	}
    });


    // @factory L.tileLayer.wms(baseUrl: String, options: TileLayer.WMS options)
    // Instantiates a WMS tile layer object given a base URL of the WMS service and a WMS parameters/options object.
    function tileLayerWMS(url, options) {
    	return new TileLayerWMS(url, options);
    }

    TileLayer.WMS = TileLayerWMS;
    tileLayer.wms = tileLayerWMS;

    /*
     * @class Renderer
     * @inherits Layer
     * @aka L.Renderer
     *
     * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
     * DOM container of the renderer, its bounds, and its zoom animation.
     *
     * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
     * itself can be added or removed to the map. All paths use a renderer, which can
     * be implicit (the map will decide the type of renderer and use it automatically)
     * or explicit (using the [`renderer`](#path-renderer) option of the path).
     *
     * Do not use this class directly, use `SVG` and `Canvas` instead.
     *
     * @event update: Event
     * Fired when the renderer updates its bounds, center and zoom, for example when
     * its map has moved
     */

    var Renderer = Layer.extend({

    	// @section
    	// @aka Renderer options
    	options: {
    		// @option padding: Number = 0.1
    		// How much to extend the clip area around the map view (relative to its size)
    		// e.g. 0.1 would be 10% of map view in each direction
    		padding: 0.1,

    		// @option tolerance: Number = 0
    		// How much to extend click tolerance round a path/object on the map
    		tolerance : 0
    	},

    	initialize: function (options) {
    		setOptions(this, options);
    		stamp(this);
    		this._layers = this._layers || {};
    	},

    	onAdd: function () {
    		if (!this._container) {
    			this._initContainer(); // defined by renderer implementations

    			if (this._zoomAnimated) {
    				addClass(this._container, 'leaflet-zoom-animated');
    			}
    		}

    		this.getPane().appendChild(this._container);
    		this._update();
    		this.on('update', this._updatePaths, this);
    	},

    	onRemove: function () {
    		this.off('update', this._updatePaths, this);
    		this._destroyContainer();
    	},

    	getEvents: function () {
    		var events = {
    			viewreset: this._reset,
    			zoom: this._onZoom,
    			moveend: this._update,
    			zoomend: this._onZoomEnd
    		};
    		if (this._zoomAnimated) {
    			events.zoomanim = this._onAnimZoom;
    		}
    		return events;
    	},

    	_onAnimZoom: function (ev) {
    		this._updateTransform(ev.center, ev.zoom);
    	},

    	_onZoom: function () {
    		this._updateTransform(this._map.getCenter(), this._map.getZoom());
    	},

    	_updateTransform: function (center, zoom) {
    		var scale = this._map.getZoomScale(zoom, this._zoom),
    		    position = getPosition(this._container),
    		    viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
    		    currentCenterPoint = this._map.project(this._center, zoom),
    		    destCenterPoint = this._map.project(center, zoom),
    		    centerOffset = destCenterPoint.subtract(currentCenterPoint),

    		    topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

    		if (any3d) {
    			setTransform(this._container, topLeftOffset, scale);
    		} else {
    			setPosition(this._container, topLeftOffset);
    		}
    	},

    	_reset: function () {
    		this._update();
    		this._updateTransform(this._center, this._zoom);

    		for (var id in this._layers) {
    			this._layers[id]._reset();
    		}
    	},

    	_onZoomEnd: function () {
    		for (var id in this._layers) {
    			this._layers[id]._project();
    		}
    	},

    	_updatePaths: function () {
    		for (var id in this._layers) {
    			this._layers[id]._update();
    		}
    	},

    	_update: function () {
    		// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
    		// Subclasses are responsible of firing the 'update' event.
    		var p = this.options.padding,
    		    size = this._map.getSize(),
    		    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

    		this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

    		this._center = this._map.getCenter();
    		this._zoom = this._map.getZoom();
    	}
    });

    /*
     * @class Canvas
     * @inherits Renderer
     * @aka L.Canvas
     *
     * Allows vector layers to be displayed with [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
     * Inherits `Renderer`.
     *
     * Due to [technical limitations](http://caniuse.com/#search=canvas), Canvas is not
     * available in all web browsers, notably IE8, and overlapping geometries might
     * not display properly in some edge cases.
     *
     * @example
     *
     * Use Canvas by default for all paths in the map:
     *
     * ```js
     * var map = L.map('map', {
     * 	renderer: L.canvas()
     * });
     * ```
     *
     * Use a Canvas renderer with extra padding for specific vector geometries:
     *
     * ```js
     * var map = L.map('map');
     * var myRenderer = L.canvas({ padding: 0.5 });
     * var line = L.polyline( coordinates, { renderer: myRenderer } );
     * var circle = L.circle( center, { renderer: myRenderer } );
     * ```
     */

    var Canvas = Renderer.extend({
    	getEvents: function () {
    		var events = Renderer.prototype.getEvents.call(this);
    		events.viewprereset = this._onViewPreReset;
    		return events;
    	},

    	_onViewPreReset: function () {
    		// Set a flag so that a viewprereset+moveend+viewreset only updates&redraws once
    		this._postponeUpdatePaths = true;
    	},

    	onAdd: function () {
    		Renderer.prototype.onAdd.call(this);

    		// Redraw vectors since canvas is cleared upon removal,
    		// in case of removing the renderer itself from the map.
    		this._draw();
    	},

    	_initContainer: function () {
    		var container = this._container = document.createElement('canvas');

    		on(container, 'mousemove', this._onMouseMove, this);
    		on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this);
    		on(container, 'mouseout', this._handleMouseOut, this);

    		this._ctx = container.getContext('2d');
    	},

    	_destroyContainer: function () {
    		cancelAnimFrame(this._redrawRequest);
    		delete this._ctx;
    		remove(this._container);
    		off(this._container);
    		delete this._container;
    	},

    	_updatePaths: function () {
    		if (this._postponeUpdatePaths) { return; }

    		var layer;
    		this._redrawBounds = null;
    		for (var id in this._layers) {
    			layer = this._layers[id];
    			layer._update();
    		}
    		this._redraw();
    	},

    	_update: function () {
    		if (this._map._animatingZoom && this._bounds) { return; }

    		Renderer.prototype._update.call(this);

    		var b = this._bounds,
    		    container = this._container,
    		    size = b.getSize(),
    		    m = retina ? 2 : 1;

    		setPosition(container, b.min);

    		// set canvas size (also clearing it); use double size on retina
    		container.width = m * size.x;
    		container.height = m * size.y;
    		container.style.width = size.x + 'px';
    		container.style.height = size.y + 'px';

    		if (retina) {
    			this._ctx.scale(2, 2);
    		}

    		// translate so we use the same path coordinates after canvas element moves
    		this._ctx.translate(-b.min.x, -b.min.y);

    		// Tell paths to redraw themselves
    		this.fire('update');
    	},

    	_reset: function () {
    		Renderer.prototype._reset.call(this);

    		if (this._postponeUpdatePaths) {
    			this._postponeUpdatePaths = false;
    			this._updatePaths();
    		}
    	},

    	_initPath: function (layer) {
    		this._updateDashArray(layer);
    		this._layers[stamp(layer)] = layer;

    		var order = layer._order = {
    			layer: layer,
    			prev: this._drawLast,
    			next: null
    		};
    		if (this._drawLast) { this._drawLast.next = order; }
    		this._drawLast = order;
    		this._drawFirst = this._drawFirst || this._drawLast;
    	},

    	_addPath: function (layer) {
    		this._requestRedraw(layer);
    	},

    	_removePath: function (layer) {
    		var order = layer._order;
    		var next = order.next;
    		var prev = order.prev;

    		if (next) {
    			next.prev = prev;
    		} else {
    			this._drawLast = prev;
    		}
    		if (prev) {
    			prev.next = next;
    		} else {
    			this._drawFirst = next;
    		}

    		delete layer._order;

    		delete this._layers[stamp(layer)];

    		this._requestRedraw(layer);
    	},

    	_updatePath: function (layer) {
    		// Redraw the union of the layer's old pixel
    		// bounds and the new pixel bounds.
    		this._extendRedrawBounds(layer);
    		layer._project();
    		layer._update();
    		// The redraw will extend the redraw bounds
    		// with the new pixel bounds.
    		this._requestRedraw(layer);
    	},

    	_updateStyle: function (layer) {
    		this._updateDashArray(layer);
    		this._requestRedraw(layer);
    	},

    	_updateDashArray: function (layer) {
    		if (typeof layer.options.dashArray === 'string') {
    			var parts = layer.options.dashArray.split(/[, ]+/),
    			    dashArray = [],
    			    dashValue,
    			    i;
    			for (i = 0; i < parts.length; i++) {
    				dashValue = Number(parts[i]);
    				// Ignore dash array containing invalid lengths
    				if (isNaN(dashValue)) { return; }
    				dashArray.push(dashValue);
    			}
    			layer.options._dashArray = dashArray;
    		} else {
    			layer.options._dashArray = layer.options.dashArray;
    		}
    	},

    	_requestRedraw: function (layer) {
    		if (!this._map) { return; }

    		this._extendRedrawBounds(layer);
    		this._redrawRequest = this._redrawRequest || requestAnimFrame(this._redraw, this);
    	},

    	_extendRedrawBounds: function (layer) {
    		if (layer._pxBounds) {
    			var padding = (layer.options.weight || 0) + 1;
    			this._redrawBounds = this._redrawBounds || new Bounds();
    			this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
    			this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
    		}
    	},

    	_redraw: function () {
    		this._redrawRequest = null;

    		if (this._redrawBounds) {
    			this._redrawBounds.min._floor();
    			this._redrawBounds.max._ceil();
    		}

    		this._clear(); // clear layers in redraw bounds
    		this._draw(); // draw layers

    		this._redrawBounds = null;
    	},

    	_clear: function () {
    		var bounds = this._redrawBounds;
    		if (bounds) {
    			var size = bounds.getSize();
    			this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
    		} else {
    			this._ctx.save();
    			this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    			this._ctx.clearRect(0, 0, this._container.width, this._container.height);
    			this._ctx.restore();
    		}
    	},

    	_draw: function () {
    		var layer, bounds = this._redrawBounds;
    		this._ctx.save();
    		if (bounds) {
    			var size = bounds.getSize();
    			this._ctx.beginPath();
    			this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
    			this._ctx.clip();
    		}

    		this._drawing = true;

    		for (var order = this._drawFirst; order; order = order.next) {
    			layer = order.layer;
    			if (!bounds || (layer._pxBounds && layer._pxBounds.intersects(bounds))) {
    				layer._updatePath();
    			}
    		}

    		this._drawing = false;

    		this._ctx.restore();  // Restore state before clipping.
    	},

    	_updatePoly: function (layer, closed) {
    		if (!this._drawing) { return; }

    		var i, j, len2, p,
    		    parts = layer._parts,
    		    len = parts.length,
    		    ctx = this._ctx;

    		if (!len) { return; }

    		ctx.beginPath();

    		for (i = 0; i < len; i++) {
    			for (j = 0, len2 = parts[i].length; j < len2; j++) {
    				p = parts[i][j];
    				ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
    			}
    			if (closed) {
    				ctx.closePath();
    			}
    		}

    		this._fillStroke(ctx, layer);

    		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
    	},

    	_updateCircle: function (layer) {

    		if (!this._drawing || layer._empty()) { return; }

    		var p = layer._point,
    		    ctx = this._ctx,
    		    r = Math.max(Math.round(layer._radius), 1),
    		    s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

    		if (s !== 1) {
    			ctx.save();
    			ctx.scale(1, s);
    		}

    		ctx.beginPath();
    		ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

    		if (s !== 1) {
    			ctx.restore();
    		}

    		this._fillStroke(ctx, layer);
    	},

    	_fillStroke: function (ctx, layer) {
    		var options = layer.options;

    		if (options.fill) {
    			ctx.globalAlpha = options.fillOpacity;
    			ctx.fillStyle = options.fillColor || options.color;
    			ctx.fill(options.fillRule || 'evenodd');
    		}

    		if (options.stroke && options.weight !== 0) {
    			if (ctx.setLineDash) {
    				ctx.setLineDash(layer.options && layer.options._dashArray || []);
    			}
    			ctx.globalAlpha = options.opacity;
    			ctx.lineWidth = options.weight;
    			ctx.strokeStyle = options.color;
    			ctx.lineCap = options.lineCap;
    			ctx.lineJoin = options.lineJoin;
    			ctx.stroke();
    		}
    	},

    	// Canvas obviously doesn't have mouse events for individual drawn objects,
    	// so we emulate that by calculating what's under the mouse on mousemove/click manually

    	_onClick: function (e) {
    		var point = this._map.mouseEventToLayerPoint(e), layer, clickedLayer;

    		for (var order = this._drawFirst; order; order = order.next) {
    			layer = order.layer;
    			if (layer.options.interactive && layer._containsPoint(point)) {
    				if (!(e.type === 'click' || e.type !== 'preclick') || !this._map._draggableMoved(layer)) {
    					clickedLayer = layer;
    				}
    			}
    		}
    		if (clickedLayer)  {
    			fakeStop(e);
    			this._fireEvent([clickedLayer], e);
    		}
    	},

    	_onMouseMove: function (e) {
    		if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) { return; }

    		var point = this._map.mouseEventToLayerPoint(e);
    		this._handleMouseHover(e, point);
    	},


    	_handleMouseOut: function (e) {
    		var layer = this._hoveredLayer;
    		if (layer) {
    			// if we're leaving the layer, fire mouseout
    			removeClass(this._container, 'leaflet-interactive');
    			this._fireEvent([layer], e, 'mouseout');
    			this._hoveredLayer = null;
    			this._mouseHoverThrottled = false;
    		}
    	},

    	_handleMouseHover: function (e, point) {
    		if (this._mouseHoverThrottled) {
    			return;
    		}

    		var layer, candidateHoveredLayer;

    		for (var order = this._drawFirst; order; order = order.next) {
    			layer = order.layer;
    			if (layer.options.interactive && layer._containsPoint(point)) {
    				candidateHoveredLayer = layer;
    			}
    		}

    		if (candidateHoveredLayer !== this._hoveredLayer) {
    			this._handleMouseOut(e);

    			if (candidateHoveredLayer) {
    				addClass(this._container, 'leaflet-interactive'); // change cursor
    				this._fireEvent([candidateHoveredLayer], e, 'mouseover');
    				this._hoveredLayer = candidateHoveredLayer;
    			}
    		}

    		if (this._hoveredLayer) {
    			this._fireEvent([this._hoveredLayer], e);
    		}

    		this._mouseHoverThrottled = true;
    		setTimeout(bind(function () {
    			this._mouseHoverThrottled = false;
    		}, this), 32);
    	},

    	_fireEvent: function (layers, e, type) {
    		this._map._fireDOMEvent(e, type || e.type, layers);
    	},

    	_bringToFront: function (layer) {
    		var order = layer._order;

    		if (!order) { return; }

    		var next = order.next;
    		var prev = order.prev;

    		if (next) {
    			next.prev = prev;
    		} else {
    			// Already last
    			return;
    		}
    		if (prev) {
    			prev.next = next;
    		} else if (next) {
    			// Update first entry unless this is the
    			// single entry
    			this._drawFirst = next;
    		}

    		order.prev = this._drawLast;
    		this._drawLast.next = order;

    		order.next = null;
    		this._drawLast = order;

    		this._requestRedraw(layer);
    	},

    	_bringToBack: function (layer) {
    		var order = layer._order;

    		if (!order) { return; }

    		var next = order.next;
    		var prev = order.prev;

    		if (prev) {
    			prev.next = next;
    		} else {
    			// Already first
    			return;
    		}
    		if (next) {
    			next.prev = prev;
    		} else if (prev) {
    			// Update last entry unless this is the
    			// single entry
    			this._drawLast = prev;
    		}

    		order.prev = null;

    		order.next = this._drawFirst;
    		this._drawFirst.prev = order;
    		this._drawFirst = order;

    		this._requestRedraw(layer);
    	}
    });

    // @factory L.canvas(options?: Renderer options)
    // Creates a Canvas renderer with the given options.
    function canvas$1(options) {
    	return canvas ? new Canvas(options) : null;
    }

    /*
     * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
     */


    var vmlCreate = (function () {
    	try {
    		document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
    		return function (name) {
    			return document.createElement('<lvml:' + name + ' class="lvml">');
    		};
    	} catch (e) {
    		return function (name) {
    			return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
    		};
    	}
    })();


    /*
     * @class SVG
     *
     *
     * VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
     * with old versions of Internet Explorer.
     */

    // mixin to redefine some SVG methods to handle VML syntax which is similar but with some differences
    var vmlMixin = {

    	_initContainer: function () {
    		this._container = create$1('div', 'leaflet-vml-container');
    	},

    	_update: function () {
    		if (this._map._animatingZoom) { return; }
    		Renderer.prototype._update.call(this);
    		this.fire('update');
    	},

    	_initPath: function (layer) {
    		var container = layer._container = vmlCreate('shape');

    		addClass(container, 'leaflet-vml-shape ' + (this.options.className || ''));

    		container.coordsize = '1 1';

    		layer._path = vmlCreate('path');
    		container.appendChild(layer._path);

    		this._updateStyle(layer);
    		this._layers[stamp(layer)] = layer;
    	},

    	_addPath: function (layer) {
    		var container = layer._container;
    		this._container.appendChild(container);

    		if (layer.options.interactive) {
    			layer.addInteractiveTarget(container);
    		}
    	},

    	_removePath: function (layer) {
    		var container = layer._container;
    		remove(container);
    		layer.removeInteractiveTarget(container);
    		delete this._layers[stamp(layer)];
    	},

    	_updateStyle: function (layer) {
    		var stroke = layer._stroke,
    		    fill = layer._fill,
    		    options = layer.options,
    		    container = layer._container;

    		container.stroked = !!options.stroke;
    		container.filled = !!options.fill;

    		if (options.stroke) {
    			if (!stroke) {
    				stroke = layer._stroke = vmlCreate('stroke');
    			}
    			container.appendChild(stroke);
    			stroke.weight = options.weight + 'px';
    			stroke.color = options.color;
    			stroke.opacity = options.opacity;

    			if (options.dashArray) {
    				stroke.dashStyle = isArray(options.dashArray) ?
    				    options.dashArray.join(' ') :
    				    options.dashArray.replace(/( *, *)/g, ' ');
    			} else {
    				stroke.dashStyle = '';
    			}
    			stroke.endcap = options.lineCap.replace('butt', 'flat');
    			stroke.joinstyle = options.lineJoin;

    		} else if (stroke) {
    			container.removeChild(stroke);
    			layer._stroke = null;
    		}

    		if (options.fill) {
    			if (!fill) {
    				fill = layer._fill = vmlCreate('fill');
    			}
    			container.appendChild(fill);
    			fill.color = options.fillColor || options.color;
    			fill.opacity = options.fillOpacity;

    		} else if (fill) {
    			container.removeChild(fill);
    			layer._fill = null;
    		}
    	},

    	_updateCircle: function (layer) {
    		var p = layer._point.round(),
    		    r = Math.round(layer._radius),
    		    r2 = Math.round(layer._radiusY || r);

    		this._setPath(layer, layer._empty() ? 'M0 0' :
    			'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r2 + ' 0,' + (65535 * 360));
    	},

    	_setPath: function (layer, path) {
    		layer._path.v = path;
    	},

    	_bringToFront: function (layer) {
    		toFront(layer._container);
    	},

    	_bringToBack: function (layer) {
    		toBack(layer._container);
    	}
    };

    var create$2 = vml ? vmlCreate : svgCreate;

    /*
     * @class SVG
     * @inherits Renderer
     * @aka L.SVG
     *
     * Allows vector layers to be displayed with [SVG](https://developer.mozilla.org/docs/Web/SVG).
     * Inherits `Renderer`.
     *
     * Due to [technical limitations](http://caniuse.com/#search=svg), SVG is not
     * available in all web browsers, notably Android 2.x and 3.x.
     *
     * Although SVG is not available on IE7 and IE8, these browsers support
     * [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language)
     * (a now deprecated technology), and the SVG renderer will fall back to VML in
     * this case.
     *
     * @example
     *
     * Use SVG by default for all paths in the map:
     *
     * ```js
     * var map = L.map('map', {
     * 	renderer: L.svg()
     * });
     * ```
     *
     * Use a SVG renderer with extra padding for specific vector geometries:
     *
     * ```js
     * var map = L.map('map');
     * var myRenderer = L.svg({ padding: 0.5 });
     * var line = L.polyline( coordinates, { renderer: myRenderer } );
     * var circle = L.circle( center, { renderer: myRenderer } );
     * ```
     */

    var SVG = Renderer.extend({

    	getEvents: function () {
    		var events = Renderer.prototype.getEvents.call(this);
    		events.zoomstart = this._onZoomStart;
    		return events;
    	},

    	_initContainer: function () {
    		this._container = create$2('svg');

    		// makes it possible to click through svg root; we'll reset it back in individual paths
    		this._container.setAttribute('pointer-events', 'none');

    		this._rootGroup = create$2('g');
    		this._container.appendChild(this._rootGroup);
    	},

    	_destroyContainer: function () {
    		remove(this._container);
    		off(this._container);
    		delete this._container;
    		delete this._rootGroup;
    		delete this._svgSize;
    	},

    	_onZoomStart: function () {
    		// Drag-then-pinch interactions might mess up the center and zoom.
    		// In this case, the easiest way to prevent this is re-do the renderer
    		//   bounds and padding when the zooming starts.
    		this._update();
    	},

    	_update: function () {
    		if (this._map._animatingZoom && this._bounds) { return; }

    		Renderer.prototype._update.call(this);

    		var b = this._bounds,
    		    size = b.getSize(),
    		    container = this._container;

    		// set size of svg-container if changed
    		if (!this._svgSize || !this._svgSize.equals(size)) {
    			this._svgSize = size;
    			container.setAttribute('width', size.x);
    			container.setAttribute('height', size.y);
    		}

    		// movement: update container viewBox so that we don't have to change coordinates of individual layers
    		setPosition(container, b.min);
    		container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));

    		this.fire('update');
    	},

    	// methods below are called by vector layers implementations

    	_initPath: function (layer) {
    		var path = layer._path = create$2('path');

    		// @namespace Path
    		// @option className: String = null
    		// Custom class name set on an element. Only for SVG renderer.
    		if (layer.options.className) {
    			addClass(path, layer.options.className);
    		}

    		if (layer.options.interactive) {
    			addClass(path, 'leaflet-interactive');
    		}

    		this._updateStyle(layer);
    		this._layers[stamp(layer)] = layer;
    	},

    	_addPath: function (layer) {
    		if (!this._rootGroup) { this._initContainer(); }
    		this._rootGroup.appendChild(layer._path);
    		layer.addInteractiveTarget(layer._path);
    	},

    	_removePath: function (layer) {
    		remove(layer._path);
    		layer.removeInteractiveTarget(layer._path);
    		delete this._layers[stamp(layer)];
    	},

    	_updatePath: function (layer) {
    		layer._project();
    		layer._update();
    	},

    	_updateStyle: function (layer) {
    		var path = layer._path,
    		    options = layer.options;

    		if (!path) { return; }

    		if (options.stroke) {
    			path.setAttribute('stroke', options.color);
    			path.setAttribute('stroke-opacity', options.opacity);
    			path.setAttribute('stroke-width', options.weight);
    			path.setAttribute('stroke-linecap', options.lineCap);
    			path.setAttribute('stroke-linejoin', options.lineJoin);

    			if (options.dashArray) {
    				path.setAttribute('stroke-dasharray', options.dashArray);
    			} else {
    				path.removeAttribute('stroke-dasharray');
    			}

    			if (options.dashOffset) {
    				path.setAttribute('stroke-dashoffset', options.dashOffset);
    			} else {
    				path.removeAttribute('stroke-dashoffset');
    			}
    		} else {
    			path.setAttribute('stroke', 'none');
    		}

    		if (options.fill) {
    			path.setAttribute('fill', options.fillColor || options.color);
    			path.setAttribute('fill-opacity', options.fillOpacity);
    			path.setAttribute('fill-rule', options.fillRule || 'evenodd');
    		} else {
    			path.setAttribute('fill', 'none');
    		}
    	},

    	_updatePoly: function (layer, closed) {
    		this._setPath(layer, pointsToPath(layer._parts, closed));
    	},

    	_updateCircle: function (layer) {
    		var p = layer._point,
    		    r = Math.max(Math.round(layer._radius), 1),
    		    r2 = Math.max(Math.round(layer._radiusY), 1) || r,
    		    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

    		// drawing a circle with two half-arcs
    		var d = layer._empty() ? 'M0 0' :
    			'M' + (p.x - r) + ',' + p.y +
    			arc + (r * 2) + ',0 ' +
    			arc + (-r * 2) + ',0 ';

    		this._setPath(layer, d);
    	},

    	_setPath: function (layer, path) {
    		layer._path.setAttribute('d', path);
    	},

    	// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
    	_bringToFront: function (layer) {
    		toFront(layer._path);
    	},

    	_bringToBack: function (layer) {
    		toBack(layer._path);
    	}
    });

    if (vml) {
    	SVG.include(vmlMixin);
    }

    // @namespace SVG
    // @factory L.svg(options?: Renderer options)
    // Creates a SVG renderer with the given options.
    function svg$1(options) {
    	return svg || vml ? new SVG(options) : null;
    }

    Map.include({
    	// @namespace Map; @method getRenderer(layer: Path): Renderer
    	// Returns the instance of `Renderer` that should be used to render the given
    	// `Path`. It will ensure that the `renderer` options of the map and paths
    	// are respected, and that the renderers do exist on the map.
    	getRenderer: function (layer) {
    		// @namespace Path; @option renderer: Renderer
    		// Use this specific instance of `Renderer` for this path. Takes
    		// precedence over the map's [default renderer](#map-renderer).
    		var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;

    		if (!renderer) {
    			renderer = this._renderer = this._createRenderer();
    		}

    		if (!this.hasLayer(renderer)) {
    			this.addLayer(renderer);
    		}
    		return renderer;
    	},

    	_getPaneRenderer: function (name) {
    		if (name === 'overlayPane' || name === undefined) {
    			return false;
    		}

    		var renderer = this._paneRenderers[name];
    		if (renderer === undefined) {
    			renderer = this._createRenderer({pane: name});
    			this._paneRenderers[name] = renderer;
    		}
    		return renderer;
    	},

    	_createRenderer: function (options) {
    		// @namespace Map; @option preferCanvas: Boolean = false
    		// Whether `Path`s should be rendered on a `Canvas` renderer.
    		// By default, all `Path`s are rendered in a `SVG` renderer.
    		return (this.options.preferCanvas && canvas$1(options)) || svg$1(options);
    	}
    });

    /*
     * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
     */

    /*
     * @class Rectangle
     * @aka L.Rectangle
     * @inherits Polygon
     *
     * A class for drawing rectangle overlays on a map. Extends `Polygon`.
     *
     * @example
     *
     * ```js
     * // define rectangle geographical bounds
     * var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
     *
     * // create an orange rectangle
     * L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
     *
     * // zoom the map to the rectangle bounds
     * map.fitBounds(bounds);
     * ```
     *
     */


    var Rectangle = Polygon.extend({
    	initialize: function (latLngBounds, options) {
    		Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
    	},

    	// @method setBounds(latLngBounds: LatLngBounds): this
    	// Redraws the rectangle with the passed bounds.
    	setBounds: function (latLngBounds) {
    		return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
    	},

    	_boundsToLatLngs: function (latLngBounds) {
    		latLngBounds = toLatLngBounds(latLngBounds);
    		return [
    			latLngBounds.getSouthWest(),
    			latLngBounds.getNorthWest(),
    			latLngBounds.getNorthEast(),
    			latLngBounds.getSouthEast()
    		];
    	}
    });


    // @factory L.rectangle(latLngBounds: LatLngBounds, options?: Polyline options)
    function rectangle(latLngBounds, options) {
    	return new Rectangle(latLngBounds, options);
    }

    SVG.create = create$2;
    SVG.pointsToPath = pointsToPath;

    GeoJSON.geometryToLayer = geometryToLayer;
    GeoJSON.coordsToLatLng = coordsToLatLng;
    GeoJSON.coordsToLatLngs = coordsToLatLngs;
    GeoJSON.latLngToCoords = latLngToCoords;
    GeoJSON.latLngsToCoords = latLngsToCoords;
    GeoJSON.getFeature = getFeature;
    GeoJSON.asFeature = asFeature;

    /*
     * L.Handler.BoxZoom is used to add shift-drag zoom interaction to the map
     * (zoom to a selected bounding box), enabled by default.
     */

    // @namespace Map
    // @section Interaction Options
    Map.mergeOptions({
    	// @option boxZoom: Boolean = true
    	// Whether the map can be zoomed to a rectangular area specified by
    	// dragging the mouse while pressing the shift key.
    	boxZoom: true
    });

    var BoxZoom = Handler.extend({
    	initialize: function (map) {
    		this._map = map;
    		this._container = map._container;
    		this._pane = map._panes.overlayPane;
    		this._resetStateTimeout = 0;
    		map.on('unload', this._destroy, this);
    	},

    	addHooks: function () {
    		on(this._container, 'mousedown', this._onMouseDown, this);
    	},

    	removeHooks: function () {
    		off(this._container, 'mousedown', this._onMouseDown, this);
    	},

    	moved: function () {
    		return this._moved;
    	},

    	_destroy: function () {
    		remove(this._pane);
    		delete this._pane;
    	},

    	_resetState: function () {
    		this._resetStateTimeout = 0;
    		this._moved = false;
    	},

    	_clearDeferredResetState: function () {
    		if (this._resetStateTimeout !== 0) {
    			clearTimeout(this._resetStateTimeout);
    			this._resetStateTimeout = 0;
    		}
    	},

    	_onMouseDown: function (e) {
    		if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

    		// Clear the deferred resetState if it hasn't executed yet, otherwise it
    		// will interrupt the interaction and orphan a box element in the container.
    		this._clearDeferredResetState();
    		this._resetState();

    		disableTextSelection();
    		disableImageDrag();

    		this._startPoint = this._map.mouseEventToContainerPoint(e);

    		on(document, {
    			contextmenu: stop,
    			mousemove: this._onMouseMove,
    			mouseup: this._onMouseUp,
    			keydown: this._onKeyDown
    		}, this);
    	},

    	_onMouseMove: function (e) {
    		if (!this._moved) {
    			this._moved = true;

    			this._box = create$1('div', 'leaflet-zoom-box', this._container);
    			addClass(this._container, 'leaflet-crosshair');

    			this._map.fire('boxzoomstart');
    		}

    		this._point = this._map.mouseEventToContainerPoint(e);

    		var bounds = new Bounds(this._point, this._startPoint),
    		    size = bounds.getSize();

    		setPosition(this._box, bounds.min);

    		this._box.style.width  = size.x + 'px';
    		this._box.style.height = size.y + 'px';
    	},

    	_finish: function () {
    		if (this._moved) {
    			remove(this._box);
    			removeClass(this._container, 'leaflet-crosshair');
    		}

    		enableTextSelection();
    		enableImageDrag();

    		off(document, {
    			contextmenu: stop,
    			mousemove: this._onMouseMove,
    			mouseup: this._onMouseUp,
    			keydown: this._onKeyDown
    		}, this);
    	},

    	_onMouseUp: function (e) {
    		if ((e.which !== 1) && (e.button !== 1)) { return; }

    		this._finish();

    		if (!this._moved) { return; }
    		// Postpone to next JS tick so internal click event handling
    		// still see it as "moved".
    		this._clearDeferredResetState();
    		this._resetStateTimeout = setTimeout(bind(this._resetState, this), 0);

    		var bounds = new LatLngBounds(
    		        this._map.containerPointToLatLng(this._startPoint),
    		        this._map.containerPointToLatLng(this._point));

    		this._map
    			.fitBounds(bounds)
    			.fire('boxzoomend', {boxZoomBounds: bounds});
    	},

    	_onKeyDown: function (e) {
    		if (e.keyCode === 27) {
    			this._finish();
    		}
    	}
    });

    // @section Handlers
    // @property boxZoom: Handler
    // Box (shift-drag with mouse) zoom handler.
    Map.addInitHook('addHandler', 'boxZoom', BoxZoom);

    /*
     * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
     */

    // @namespace Map
    // @section Interaction Options

    Map.mergeOptions({
    	// @option doubleClickZoom: Boolean|String = true
    	// Whether the map can be zoomed in by double clicking on it and
    	// zoomed out by double clicking while holding shift. If passed
    	// `'center'`, double-click zoom will zoom to the center of the
    	//  view regardless of where the mouse was.
    	doubleClickZoom: true
    });

    var DoubleClickZoom = Handler.extend({
    	addHooks: function () {
    		this._map.on('dblclick', this._onDoubleClick, this);
    	},

    	removeHooks: function () {
    		this._map.off('dblclick', this._onDoubleClick, this);
    	},

    	_onDoubleClick: function (e) {
    		var map = this._map,
    		    oldZoom = map.getZoom(),
    		    delta = map.options.zoomDelta,
    		    zoom = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;

    		if (map.options.doubleClickZoom === 'center') {
    			map.setZoom(zoom);
    		} else {
    			map.setZoomAround(e.containerPoint, zoom);
    		}
    	}
    });

    // @section Handlers
    //
    // Map properties include interaction handlers that allow you to control
    // interaction behavior in runtime, enabling or disabling certain features such
    // as dragging or touch zoom (see `Handler` methods). For example:
    //
    // ```js
    // map.doubleClickZoom.disable();
    // ```
    //
    // @property doubleClickZoom: Handler
    // Double click zoom handler.
    Map.addInitHook('addHandler', 'doubleClickZoom', DoubleClickZoom);

    /*
     * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
     */

    // @namespace Map
    // @section Interaction Options
    Map.mergeOptions({
    	// @option dragging: Boolean = true
    	// Whether the map be draggable with mouse/touch or not.
    	dragging: true,

    	// @section Panning Inertia Options
    	// @option inertia: Boolean = *
    	// If enabled, panning of the map will have an inertia effect where
    	// the map builds momentum while dragging and continues moving in
    	// the same direction for some time. Feels especially nice on touch
    	// devices. Enabled by default unless running on old Android devices.
    	inertia: !android23,

    	// @option inertiaDeceleration: Number = 3000
    	// The rate with which the inertial movement slows down, in pixels/second².
    	inertiaDeceleration: 3400, // px/s^2

    	// @option inertiaMaxSpeed: Number = Infinity
    	// Max speed of the inertial movement, in pixels/second.
    	inertiaMaxSpeed: Infinity, // px/s

    	// @option easeLinearity: Number = 0.2
    	easeLinearity: 0.2,

    	// TODO refactor, move to CRS
    	// @option worldCopyJump: Boolean = false
    	// With this option enabled, the map tracks when you pan to another "copy"
    	// of the world and seamlessly jumps to the original one so that all overlays
    	// like markers and vector layers are still visible.
    	worldCopyJump: false,

    	// @option maxBoundsViscosity: Number = 0.0
    	// If `maxBounds` is set, this option will control how solid the bounds
    	// are when dragging the map around. The default value of `0.0` allows the
    	// user to drag outside the bounds at normal speed, higher values will
    	// slow down map dragging outside bounds, and `1.0` makes the bounds fully
    	// solid, preventing the user from dragging outside the bounds.
    	maxBoundsViscosity: 0.0
    });

    var Drag = Handler.extend({
    	addHooks: function () {
    		if (!this._draggable) {
    			var map = this._map;

    			this._draggable = new Draggable(map._mapPane, map._container);

    			this._draggable.on({
    				dragstart: this._onDragStart,
    				drag: this._onDrag,
    				dragend: this._onDragEnd
    			}, this);

    			this._draggable.on('predrag', this._onPreDragLimit, this);
    			if (map.options.worldCopyJump) {
    				this._draggable.on('predrag', this._onPreDragWrap, this);
    				map.on('zoomend', this._onZoomEnd, this);

    				map.whenReady(this._onZoomEnd, this);
    			}
    		}
    		addClass(this._map._container, 'leaflet-grab leaflet-touch-drag');
    		this._draggable.enable();
    		this._positions = [];
    		this._times = [];
    	},

    	removeHooks: function () {
    		removeClass(this._map._container, 'leaflet-grab');
    		removeClass(this._map._container, 'leaflet-touch-drag');
    		this._draggable.disable();
    	},

    	moved: function () {
    		return this._draggable && this._draggable._moved;
    	},

    	moving: function () {
    		return this._draggable && this._draggable._moving;
    	},

    	_onDragStart: function () {
    		var map = this._map;

    		map._stop();
    		if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
    			var bounds = toLatLngBounds(this._map.options.maxBounds);

    			this._offsetLimit = toBounds(
    				this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
    				this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1)
    					.add(this._map.getSize()));

    			this._viscosity = Math.min(1.0, Math.max(0.0, this._map.options.maxBoundsViscosity));
    		} else {
    			this._offsetLimit = null;
    		}

    		map
    		    .fire('movestart')
    		    .fire('dragstart');

    		if (map.options.inertia) {
    			this._positions = [];
    			this._times = [];
    		}
    	},

    	_onDrag: function (e) {
    		if (this._map.options.inertia) {
    			var time = this._lastTime = +new Date(),
    			    pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;

    			this._positions.push(pos);
    			this._times.push(time);

    			this._prunePositions(time);
    		}

    		this._map
    		    .fire('move', e)
    		    .fire('drag', e);
    	},

    	_prunePositions: function (time) {
    		while (this._positions.length > 1 && time - this._times[0] > 50) {
    			this._positions.shift();
    			this._times.shift();
    		}
    	},

    	_onZoomEnd: function () {
    		var pxCenter = this._map.getSize().divideBy(2),
    		    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

    		this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
    		this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
    	},

    	_viscousLimit: function (value, threshold) {
    		return value - (value - threshold) * this._viscosity;
    	},

    	_onPreDragLimit: function () {
    		if (!this._viscosity || !this._offsetLimit) { return; }

    		var offset = this._draggable._newPos.subtract(this._draggable._startPos);

    		var limit = this._offsetLimit;
    		if (offset.x < limit.min.x) { offset.x = this._viscousLimit(offset.x, limit.min.x); }
    		if (offset.y < limit.min.y) { offset.y = this._viscousLimit(offset.y, limit.min.y); }
    		if (offset.x > limit.max.x) { offset.x = this._viscousLimit(offset.x, limit.max.x); }
    		if (offset.y > limit.max.y) { offset.y = this._viscousLimit(offset.y, limit.max.y); }

    		this._draggable._newPos = this._draggable._startPos.add(offset);
    	},

    	_onPreDragWrap: function () {
    		// TODO refactor to be able to adjust map pane position after zoom
    		var worldWidth = this._worldWidth,
    		    halfWidth = Math.round(worldWidth / 2),
    		    dx = this._initialWorldOffset,
    		    x = this._draggable._newPos.x,
    		    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
    		    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
    		    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

    		this._draggable._absPos = this._draggable._newPos.clone();
    		this._draggable._newPos.x = newX;
    	},

    	_onDragEnd: function (e) {
    		var map = this._map,
    		    options = map.options,

    		    noInertia = !options.inertia || this._times.length < 2;

    		map.fire('dragend', e);

    		if (noInertia) {
    			map.fire('moveend');

    		} else {
    			this._prunePositions(+new Date());

    			var direction = this._lastPos.subtract(this._positions[0]),
    			    duration = (this._lastTime - this._times[0]) / 1000,
    			    ease = options.easeLinearity,

    			    speedVector = direction.multiplyBy(ease / duration),
    			    speed = speedVector.distanceTo([0, 0]),

    			    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
    			    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

    			    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
    			    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

    			if (!offset.x && !offset.y) {
    				map.fire('moveend');

    			} else {
    				offset = map._limitOffset(offset, map.options.maxBounds);

    				requestAnimFrame(function () {
    					map.panBy(offset, {
    						duration: decelerationDuration,
    						easeLinearity: ease,
    						noMoveStart: true,
    						animate: true
    					});
    				});
    			}
    		}
    	}
    });

    // @section Handlers
    // @property dragging: Handler
    // Map dragging handler (by both mouse and touch).
    Map.addInitHook('addHandler', 'dragging', Drag);

    /*
     * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
     */

    // @namespace Map
    // @section Keyboard Navigation Options
    Map.mergeOptions({
    	// @option keyboard: Boolean = true
    	// Makes the map focusable and allows users to navigate the map with keyboard
    	// arrows and `+`/`-` keys.
    	keyboard: true,

    	// @option keyboardPanDelta: Number = 80
    	// Amount of pixels to pan when pressing an arrow key.
    	keyboardPanDelta: 80
    });

    var Keyboard = Handler.extend({

    	keyCodes: {
    		left:    [37],
    		right:   [39],
    		down:    [40],
    		up:      [38],
    		zoomIn:  [187, 107, 61, 171],
    		zoomOut: [189, 109, 54, 173]
    	},

    	initialize: function (map) {
    		this._map = map;

    		this._setPanDelta(map.options.keyboardPanDelta);
    		this._setZoomDelta(map.options.zoomDelta);
    	},

    	addHooks: function () {
    		var container = this._map._container;

    		// make the container focusable by tabbing
    		if (container.tabIndex <= 0) {
    			container.tabIndex = '0';
    		}

    		on(container, {
    			focus: this._onFocus,
    			blur: this._onBlur,
    			mousedown: this._onMouseDown
    		}, this);

    		this._map.on({
    			focus: this._addHooks,
    			blur: this._removeHooks
    		}, this);
    	},

    	removeHooks: function () {
    		this._removeHooks();

    		off(this._map._container, {
    			focus: this._onFocus,
    			blur: this._onBlur,
    			mousedown: this._onMouseDown
    		}, this);

    		this._map.off({
    			focus: this._addHooks,
    			blur: this._removeHooks
    		}, this);
    	},

    	_onMouseDown: function () {
    		if (this._focused) { return; }

    		var body = document.body,
    		    docEl = document.documentElement,
    		    top = body.scrollTop || docEl.scrollTop,
    		    left = body.scrollLeft || docEl.scrollLeft;

    		this._map._container.focus();

    		window.scrollTo(left, top);
    	},

    	_onFocus: function () {
    		this._focused = true;
    		this._map.fire('focus');
    	},

    	_onBlur: function () {
    		this._focused = false;
    		this._map.fire('blur');
    	},

    	_setPanDelta: function (panDelta) {
    		var keys = this._panKeys = {},
    		    codes = this.keyCodes,
    		    i, len;

    		for (i = 0, len = codes.left.length; i < len; i++) {
    			keys[codes.left[i]] = [-1 * panDelta, 0];
    		}
    		for (i = 0, len = codes.right.length; i < len; i++) {
    			keys[codes.right[i]] = [panDelta, 0];
    		}
    		for (i = 0, len = codes.down.length; i < len; i++) {
    			keys[codes.down[i]] = [0, panDelta];
    		}
    		for (i = 0, len = codes.up.length; i < len; i++) {
    			keys[codes.up[i]] = [0, -1 * panDelta];
    		}
    	},

    	_setZoomDelta: function (zoomDelta) {
    		var keys = this._zoomKeys = {},
    		    codes = this.keyCodes,
    		    i, len;

    		for (i = 0, len = codes.zoomIn.length; i < len; i++) {
    			keys[codes.zoomIn[i]] = zoomDelta;
    		}
    		for (i = 0, len = codes.zoomOut.length; i < len; i++) {
    			keys[codes.zoomOut[i]] = -zoomDelta;
    		}
    	},

    	_addHooks: function () {
    		on(document, 'keydown', this._onKeyDown, this);
    	},

    	_removeHooks: function () {
    		off(document, 'keydown', this._onKeyDown, this);
    	},

    	_onKeyDown: function (e) {
    		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

    		var key = e.keyCode,
    		    map = this._map,
    		    offset;

    		if (key in this._panKeys) {
    			if (!map._panAnim || !map._panAnim._inProgress) {
    				offset = this._panKeys[key];
    				if (e.shiftKey) {
    					offset = toPoint(offset).multiplyBy(3);
    				}

    				map.panBy(offset);

    				if (map.options.maxBounds) {
    					map.panInsideBounds(map.options.maxBounds);
    				}
    			}
    		} else if (key in this._zoomKeys) {
    			map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);

    		} else if (key === 27 && map._popup && map._popup.options.closeOnEscapeKey) {
    			map.closePopup();

    		} else {
    			return;
    		}

    		stop(e);
    	}
    });

    // @section Handlers
    // @section Handlers
    // @property keyboard: Handler
    // Keyboard navigation handler.
    Map.addInitHook('addHandler', 'keyboard', Keyboard);

    /*
     * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
     */

    // @namespace Map
    // @section Interaction Options
    Map.mergeOptions({
    	// @section Mouse wheel options
    	// @option scrollWheelZoom: Boolean|String = true
    	// Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
    	// it will zoom to the center of the view regardless of where the mouse was.
    	scrollWheelZoom: true,

    	// @option wheelDebounceTime: Number = 40
    	// Limits the rate at which a wheel can fire (in milliseconds). By default
    	// user can't zoom via wheel more often than once per 40 ms.
    	wheelDebounceTime: 40,

    	// @option wheelPxPerZoomLevel: Number = 60
    	// How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
    	// mean a change of one full zoom level. Smaller values will make wheel-zooming
    	// faster (and vice versa).
    	wheelPxPerZoomLevel: 60
    });

    var ScrollWheelZoom = Handler.extend({
    	addHooks: function () {
    		on(this._map._container, 'wheel', this._onWheelScroll, this);

    		this._delta = 0;
    	},

    	removeHooks: function () {
    		off(this._map._container, 'wheel', this._onWheelScroll, this);
    	},

    	_onWheelScroll: function (e) {
    		var delta = getWheelDelta(e);

    		var debounce = this._map.options.wheelDebounceTime;

    		this._delta += delta;
    		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

    		if (!this._startTime) {
    			this._startTime = +new Date();
    		}

    		var left = Math.max(debounce - (+new Date() - this._startTime), 0);

    		clearTimeout(this._timer);
    		this._timer = setTimeout(bind(this._performZoom, this), left);

    		stop(e);
    	},

    	_performZoom: function () {
    		var map = this._map,
    		    zoom = map.getZoom(),
    		    snap = this._map.options.zoomSnap || 0;

    		map._stop(); // stop panning and fly animations if any

    		// map the delta with a sigmoid function to -4..4 range leaning on -1..1
    		var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
    		    d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
    		    d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
    		    delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;

    		this._delta = 0;
    		this._startTime = null;

    		if (!delta) { return; }

    		if (map.options.scrollWheelZoom === 'center') {
    			map.setZoom(zoom + delta);
    		} else {
    			map.setZoomAround(this._lastMousePos, zoom + delta);
    		}
    	}
    });

    // @section Handlers
    // @property scrollWheelZoom: Handler
    // Scroll wheel zoom handler.
    Map.addInitHook('addHandler', 'scrollWheelZoom', ScrollWheelZoom);

    /*
     * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
     */

    // @namespace Map
    // @section Interaction Options
    Map.mergeOptions({
    	// @section Touch interaction options
    	// @option tap: Boolean = true
    	// Enables mobile hacks for supporting instant taps (fixing 200ms click
    	// delay on iOS/Android) and touch holds (fired as `contextmenu` events).
    	tap: true,

    	// @option tapTolerance: Number = 15
    	// The max number of pixels a user can shift his finger during touch
    	// for it to be considered a valid tap.
    	tapTolerance: 15
    });

    var Tap = Handler.extend({
    	addHooks: function () {
    		on(this._map._container, 'touchstart', this._onDown, this);
    	},

    	removeHooks: function () {
    		off(this._map._container, 'touchstart', this._onDown, this);
    	},

    	_onDown: function (e) {
    		if (!e.touches) { return; }

    		preventDefault(e);

    		this._fireClick = true;

    		// don't simulate click or track longpress if more than 1 touch
    		if (e.touches.length > 1) {
    			this._fireClick = false;
    			clearTimeout(this._holdTimeout);
    			return;
    		}

    		var first = e.touches[0],
    		    el = first.target;

    		this._startPos = this._newPos = new Point(first.clientX, first.clientY);

    		// if touching a link, highlight it
    		if (el.tagName && el.tagName.toLowerCase() === 'a') {
    			addClass(el, 'leaflet-active');
    		}

    		// simulate long hold but setting a timeout
    		this._holdTimeout = setTimeout(bind(function () {
    			if (this._isTapValid()) {
    				this._fireClick = false;
    				this._onUp();
    				this._simulateEvent('contextmenu', first);
    			}
    		}, this), 1000);

    		this._simulateEvent('mousedown', first);

    		on(document, {
    			touchmove: this._onMove,
    			touchend: this._onUp
    		}, this);
    	},

    	_onUp: function (e) {
    		clearTimeout(this._holdTimeout);

    		off(document, {
    			touchmove: this._onMove,
    			touchend: this._onUp
    		}, this);

    		if (this._fireClick && e && e.changedTouches) {

    			var first = e.changedTouches[0],
    			    el = first.target;

    			if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
    				removeClass(el, 'leaflet-active');
    			}

    			this._simulateEvent('mouseup', first);

    			// simulate click if the touch didn't move too much
    			if (this._isTapValid()) {
    				this._simulateEvent('click', first);
    			}
    		}
    	},

    	_isTapValid: function () {
    		return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
    	},

    	_onMove: function (e) {
    		var first = e.touches[0];
    		this._newPos = new Point(first.clientX, first.clientY);
    		this._simulateEvent('mousemove', first);
    	},

    	_simulateEvent: function (type, e) {
    		var simulatedEvent = document.createEvent('MouseEvents');

    		simulatedEvent._simulated = true;
    		e.target._simulatedClick = true;

    		simulatedEvent.initMouseEvent(
    		        type, true, true, window, 1,
    		        e.screenX, e.screenY,
    		        e.clientX, e.clientY,
    		        false, false, false, false, 0, null);

    		e.target.dispatchEvent(simulatedEvent);
    	}
    });

    // @section Handlers
    // @property tap: Handler
    // Mobile touch hacks (quick tap and touch hold) handler.
    if (touch && (!pointer || safari)) {
    	Map.addInitHook('addHandler', 'tap', Tap);
    }

    /*
     * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
     */

    // @namespace Map
    // @section Interaction Options
    Map.mergeOptions({
    	// @section Touch interaction options
    	// @option touchZoom: Boolean|String = *
    	// Whether the map can be zoomed by touch-dragging with two fingers. If
    	// passed `'center'`, it will zoom to the center of the view regardless of
    	// where the touch events (fingers) were. Enabled for touch-capable web
    	// browsers except for old Androids.
    	touchZoom: touch && !android23,

    	// @option bounceAtZoomLimits: Boolean = true
    	// Set it to false if you don't want the map to zoom beyond min/max zoom
    	// and then bounce back when pinch-zooming.
    	bounceAtZoomLimits: true
    });

    var TouchZoom = Handler.extend({
    	addHooks: function () {
    		addClass(this._map._container, 'leaflet-touch-zoom');
    		on(this._map._container, 'touchstart', this._onTouchStart, this);
    	},

    	removeHooks: function () {
    		removeClass(this._map._container, 'leaflet-touch-zoom');
    		off(this._map._container, 'touchstart', this._onTouchStart, this);
    	},

    	_onTouchStart: function (e) {
    		var map = this._map;
    		if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

    		var p1 = map.mouseEventToContainerPoint(e.touches[0]),
    		    p2 = map.mouseEventToContainerPoint(e.touches[1]);

    		this._centerPoint = map.getSize()._divideBy(2);
    		this._startLatLng = map.containerPointToLatLng(this._centerPoint);
    		if (map.options.touchZoom !== 'center') {
    			this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
    		}

    		this._startDist = p1.distanceTo(p2);
    		this._startZoom = map.getZoom();

    		this._moved = false;
    		this._zooming = true;

    		map._stop();

    		on(document, 'touchmove', this._onTouchMove, this);
    		on(document, 'touchend', this._onTouchEnd, this);

    		preventDefault(e);
    	},

    	_onTouchMove: function (e) {
    		if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

    		var map = this._map,
    		    p1 = map.mouseEventToContainerPoint(e.touches[0]),
    		    p2 = map.mouseEventToContainerPoint(e.touches[1]),
    		    scale = p1.distanceTo(p2) / this._startDist;

    		this._zoom = map.getScaleZoom(scale, this._startZoom);

    		if (!map.options.bounceAtZoomLimits && (
    			(this._zoom < map.getMinZoom() && scale < 1) ||
    			(this._zoom > map.getMaxZoom() && scale > 1))) {
    			this._zoom = map._limitZoom(this._zoom);
    		}

    		if (map.options.touchZoom === 'center') {
    			this._center = this._startLatLng;
    			if (scale === 1) { return; }
    		} else {
    			// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
    			var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
    			if (scale === 1 && delta.x === 0 && delta.y === 0) { return; }
    			this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
    		}

    		if (!this._moved) {
    			map._moveStart(true, false);
    			this._moved = true;
    		}

    		cancelAnimFrame(this._animRequest);

    		var moveFn = bind(map._move, map, this._center, this._zoom, {pinch: true, round: false});
    		this._animRequest = requestAnimFrame(moveFn, this, true);

    		preventDefault(e);
    	},

    	_onTouchEnd: function () {
    		if (!this._moved || !this._zooming) {
    			this._zooming = false;
    			return;
    		}

    		this._zooming = false;
    		cancelAnimFrame(this._animRequest);

    		off(document, 'touchmove', this._onTouchMove, this);
    		off(document, 'touchend', this._onTouchEnd, this);

    		// Pinch updates GridLayers' levels only when zoomSnap is off, so zoomSnap becomes noUpdate.
    		if (this._map.options.zoomAnimation) {
    			this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
    		} else {
    			this._map._resetView(this._center, this._map._limitZoom(this._zoom));
    		}
    	}
    });

    // @section Handlers
    // @property touchZoom: Handler
    // Touch zoom handler.
    Map.addInitHook('addHandler', 'touchZoom', TouchZoom);

    Map.BoxZoom = BoxZoom;
    Map.DoubleClickZoom = DoubleClickZoom;
    Map.Drag = Drag;
    Map.Keyboard = Keyboard;
    Map.ScrollWheelZoom = ScrollWheelZoom;
    Map.Tap = Tap;
    Map.TouchZoom = TouchZoom;

    exports.version = version;
    exports.Control = Control;
    exports.control = control;
    exports.Browser = Browser;
    exports.Evented = Evented;
    exports.Mixin = Mixin;
    exports.Util = Util;
    exports.Class = Class;
    exports.Handler = Handler;
    exports.extend = extend;
    exports.bind = bind;
    exports.stamp = stamp;
    exports.setOptions = setOptions;
    exports.DomEvent = DomEvent;
    exports.DomUtil = DomUtil;
    exports.PosAnimation = PosAnimation;
    exports.Draggable = Draggable;
    exports.LineUtil = LineUtil;
    exports.PolyUtil = PolyUtil;
    exports.Point = Point;
    exports.point = toPoint;
    exports.Bounds = Bounds;
    exports.bounds = toBounds;
    exports.Transformation = Transformation;
    exports.transformation = toTransformation;
    exports.Projection = index;
    exports.LatLng = LatLng;
    exports.latLng = toLatLng;
    exports.LatLngBounds = LatLngBounds;
    exports.latLngBounds = toLatLngBounds;
    exports.CRS = CRS;
    exports.GeoJSON = GeoJSON;
    exports.geoJSON = geoJSON;
    exports.geoJson = geoJson;
    exports.Layer = Layer;
    exports.LayerGroup = LayerGroup;
    exports.layerGroup = layerGroup;
    exports.FeatureGroup = FeatureGroup;
    exports.featureGroup = featureGroup;
    exports.ImageOverlay = ImageOverlay;
    exports.imageOverlay = imageOverlay;
    exports.VideoOverlay = VideoOverlay;
    exports.videoOverlay = videoOverlay;
    exports.SVGOverlay = SVGOverlay;
    exports.svgOverlay = svgOverlay;
    exports.DivOverlay = DivOverlay;
    exports.Popup = Popup;
    exports.popup = popup;
    exports.Tooltip = Tooltip;
    exports.tooltip = tooltip;
    exports.Icon = Icon;
    exports.icon = icon;
    exports.DivIcon = DivIcon;
    exports.divIcon = divIcon;
    exports.Marker = Marker;
    exports.marker = marker;
    exports.TileLayer = TileLayer;
    exports.tileLayer = tileLayer;
    exports.GridLayer = GridLayer;
    exports.gridLayer = gridLayer;
    exports.SVG = SVG;
    exports.svg = svg$1;
    exports.Renderer = Renderer;
    exports.Canvas = Canvas;
    exports.canvas = canvas$1;
    exports.Path = Path;
    exports.CircleMarker = CircleMarker;
    exports.circleMarker = circleMarker;
    exports.Circle = Circle;
    exports.circle = circle;
    exports.Polyline = Polyline;
    exports.polyline = polyline;
    exports.Polygon = Polygon;
    exports.polygon = polygon;
    exports.Rectangle = Rectangle;
    exports.rectangle = rectangle;
    exports.Map = Map;
    exports.map = createMap;

    var oldL = window.L;
    exports.noConflict = function() {
    	window.L = oldL;
    	return this;
    };

    // Always export us to window global (see #2364)
    window.L = exports;

  })));

  });

  // eslint-disable-next-line es/no-object-assign -- safe
  var $assign = Object.assign;
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  var defineProperty$3 = Object.defineProperty;
  var concat = functionUncurryThis([].concat);

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  var objectAssign = !$assign || fails(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors && $assign({ b: 1 }, $assign(defineProperty$3({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$3(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), { b: 2 })).b !== 1) return true;
    // should work with symbols and should have deterministic property order (V8 bug)
    var A = {};
    var B = {};
    // eslint-disable-next-line es/no-symbol -- safe
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
    var T = toObject(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    var propertyIsEnumerable = objectPropertyIsEnumerable.f;
    while (argumentsLength > index) {
      var S = indexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
      }
    } return T;
  } : $assign;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  // eslint-disable-next-line es/no-object-assign -- required for testing
  _export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
    assign: objectAssign
  });

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

  var nativePromiseConstructor = global_1.Promise;

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var String$2 = global_1.String;
  var TypeError$a = global_1.TypeError;

  var aPossiblePrototype = function (argument) {
    if (typeof argument == 'object' || isCallable(argument)) return argument;
    throw TypeError$a("Can't set " + String$2(argument) + ' as a prototype');
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

  var defineProperty$2 = objectDefineProperty.f;



  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

  var setToStringTag = function (target, TAG, STATIC) {
    if (target && !STATIC) target = target.prototype;
    if (target && !hasOwnProperty_1(target, TO_STRING_TAG$1)) {
      defineProperty$2(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
    }
  };

  var SPECIES$2 = wellKnownSymbol('species');

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES$2]) {
      defineProperty(Constructor, SPECIES$2, {
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

  var iterators = {};

  var ITERATOR$7 = wellKnownSymbol('iterator');
  var ArrayPrototype$1 = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$7] === it);
  };

  var ITERATOR$6 = wellKnownSymbol('iterator');

  var getIteratorMethod = function (it) {
    if (it != undefined) return getMethod(it, ITERATOR$6)
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

  var ITERATOR$5 = wellKnownSymbol('iterator');
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
    iteratorWithReturn[ITERATOR$5] = function () {
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
      object[ITERATOR$5] = function () {
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

  var TypeError$6 = global_1.TypeError;

  // `Assert: IsConstructor(argument) is true`
  var aConstructor = function (argument) {
    if (isConstructor(argument)) return argument;
    throw TypeError$6(tryToString(argument) + ' is not a constructor');
  };

  var SPECIES$1 = wellKnownSymbol('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-speciesconstructor
  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES$1]) == undefined ? defaultConstructor : aConstructor(S);
  };

  var FunctionPrototype$1 = Function.prototype;
  var apply = FunctionPrototype$1.apply;
  var call = FunctionPrototype$1.call;

  // eslint-disable-next-line es/no-reflect -- safe
  var functionApply = typeof Reflect == 'object' && Reflect.apply || (functionBindNative ? call.bind(apply) : function () {
    return call.apply(apply, arguments);
  });

  var arraySlice = functionUncurryThis([].slice);

  var TypeError$5 = global_1.TypeError;

  var validateArgumentsLength = function (passed, required) {
    if (passed < required) throw TypeError$5('Not enough arguments');
    return passed;
  };

  var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(engineUserAgent);

  var engineIsNode = classofRaw(global_1.process) == 'process';

  var set = global_1.setImmediate;
  var clear = global_1.clearImmediate;
  var process$2 = global_1.process;
  var Dispatch = global_1.Dispatch;
  var Function$1 = global_1.Function;
  var MessageChannel = global_1.MessageChannel;
  var String$1 = global_1.String;
  var counter = 0;
  var queue$1 = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var location$1, defer, channel, port;

  try {
    // Deno throws a ReferenceError on `location` access without `--location` flag
    location$1 = global_1.location;
  } catch (error) { /* empty */ }

  var run = function (id) {
    if (hasOwnProperty_1(queue$1, id)) {
      var fn = queue$1[id];
      delete queue$1[id];
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
    global_1.postMessage(String$1(id), location$1.protocol + '//' + location$1.host);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set || !clear) {
    set = function setImmediate(handler) {
      validateArgumentsLength(arguments.length, 1);
      var fn = isCallable(handler) ? handler : Function$1(handler);
      var args = arraySlice(arguments, 1);
      queue$1[++counter] = function () {
        functionApply(fn, undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue$1[id];
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
      location$1 && location$1.protocol !== 'file:' &&
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
    set: set,
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

  var Queue = function () {
    this.head = null;
    this.tail = null;
  };

  Queue.prototype = {
    add: function (item) {
      var entry = { item: item, next: null };
      if (this.head) this.tail.next = entry;
      else this.head = entry;
      this.tail = entry;
    },
    get: function () {
      var entry = this.head;
      if (entry) {
        this.head = entry.next;
        if (this.tail === entry) this.tail = null;
        return entry.item;
      }
    }
  };

  var queue = Queue;

  var engineIsBrowser = typeof window == 'object';

  var task = task$1.set;













  var SPECIES = wellKnownSymbol('species');
  var PROMISE = 'Promise';

  var getInternalState$2 = internalState.getterFor(PROMISE);
  var setInternalState$4 = internalState.set;
  var getInternalPromiseState = internalState.getterFor(PROMISE);
  var NativePromisePrototype = nativePromiseConstructor && nativePromiseConstructor.prototype;
  var PromiseConstructor = nativePromiseConstructor;
  var PromisePrototype = NativePromisePrototype;
  var TypeError$4 = global_1.TypeError;
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

  var FORCED$2 = isForced_1(PROMISE, function () {
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
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return !GLOBAL_CORE_JS_PROMISE && engineIsBrowser && !NATIVE_REJECTION_EVENT;
  });

  var INCORRECT_ITERATION = FORCED$2 || !checkCorrectnessOfIteration(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
  });

  // helpers
  var isThenable = function (it) {
    var then;
    return isObject(it) && isCallable(then = it.then) ? then : false;
  };

  var callReaction = function (reaction, state) {
    var value = state.value;
    var ok = state.state == FULFILLED;
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
          reject(TypeError$4('Promise-chain cycle'));
        } else if (then = isThenable(result)) {
          functionCall(then, result, resolve, reject);
        } else resolve(result);
      } else reject(value);
    } catch (error) {
      if (domain && !exited) domain.exit();
      reject(error);
    }
  };

  var notify = function (state, isReject) {
    if (state.notified) return;
    state.notified = true;
    microtask(function () {
      var reactions = state.reactions;
      var reaction;
      while (reaction = reactions.get()) {
        callReaction(reaction, state);
      }
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
      if (state.facade === value) throw TypeError$4("Promise can't be resolved itself");
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
  if (FORCED$2) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromisePrototype);
      aCallable(executor);
      functionCall(Internal, this);
      var state = getInternalState$2(this);
      try {
        executor(bind(internalResolve, state), bind(internalReject, state));
      } catch (error) {
        internalReject(state, error);
      }
    };
    PromisePrototype = PromiseConstructor.prototype;
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    Internal = function Promise(executor) {
      setInternalState$4(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: new queue(),
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };
    Internal.prototype = redefineAll(PromisePrototype, {
      // `Promise.prototype.then` method
      // https://tc39.es/ecma262/#sec-promise.prototype.then
      // eslint-disable-next-line unicorn/no-thenable -- safe
      then: function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
        state.parent = true;
        reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
        reaction.fail = isCallable(onRejected) && onRejected;
        reaction.domain = engineIsNode ? process.domain : undefined;
        if (state.state == PENDING) state.reactions.add(reaction);
        else microtask(function () {
          callReaction(reaction, state);
        });
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
      var state = getInternalState$2(promise);
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

  _export({ global: true, wrap: true, forced: FORCED$2 }, {
    Promise: PromiseConstructor
  });

  setToStringTag(PromiseConstructor, PROMISE, false);
  setSpecies(PROMISE);

  PromiseWrapper = getBuiltIn(PROMISE);

  // statics
  _export({ target: PROMISE, stat: true, forced: FORCED$2 }, {
    // `Promise.reject` method
    // https://tc39.es/ecma262/#sec-promise.reject
    reject: function reject(r) {
      var capability = newPromiseCapability(this);
      functionCall(capability.reject, undefined, r);
      return capability.promise;
    }
  });

  _export({ target: PROMISE, stat: true, forced: FORCED$2 }, {
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

  var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails(function () {
      // eslint-disable-next-line no-useless-call -- required for testing
      method.call(null, argument || function () { return 1; }, 1);
    });
  };

  var $forEach = arrayIteration.forEach;


  var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');

  // `Array.prototype.forEach` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  var arrayForEach = !STRICT_METHOD$1 ? function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  // eslint-disable-next-line es/no-array-prototype-foreach -- safe
  } : [].forEach;

  var handlePrototype$1 = function (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
      createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
    } catch (error) {
      CollectionPrototype.forEach = arrayForEach;
    }
  };

  for (var COLLECTION_NAME$1 in domIterables) {
    if (domIterables[COLLECTION_NAME$1]) {
      handlePrototype$1(global_1[COLLECTION_NAME$1] && global_1[COLLECTION_NAME$1].prototype);
    }
  }

  handlePrototype$1(domTokenListPrototype);

  var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
    keys: function keys(it) {
      return objectKeys(toObject(it));
    }
  });

  var MATCH = wellKnownSymbol('match');

  // `IsRegExp` abstract operation
  // https://tc39.es/ecma262/#sec-isregexp
  var isRegexp = function (it) {
    var isRegExp;
    return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
  };

  var charAt$5 = functionUncurryThis(''.charAt);
  var charCodeAt$2 = functionUncurryThis(''.charCodeAt);
  var stringSlice$3 = functionUncurryThis(''.slice);

  var createMethod = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = toString_1(requireObjectCoercible($this));
      var position = toIntegerOrInfinity(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = charCodeAt$2(S, position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = charCodeAt$2(S, position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING
            ? charAt$5(S, position)
            : first
          : CONVERT_TO_STRING
            ? stringSlice$3(S, position, position + 2)
            : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod(true)
  };

  var charAt$4 = stringMultibyte.charAt;

  // `AdvanceStringIndex` abstract operation
  // https://tc39.es/ecma262/#sec-advancestringindex
  var advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? charAt$4(S, index).length : 1);
  };

  var createProperty = function (object, key, value) {
    var propertyKey = toPropertyKey(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  var Array$3 = global_1.Array;
  var max = Math.max;

  var arraySliceSimple = function (O, start, end) {
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var result = Array$3(max(fin - k, 0));
    for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  };

  var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;
  var MAX_UINT32 = 0xFFFFFFFF;
  var min = Math.min;
  var $push = [].push;
  var exec$3 = functionUncurryThis(/./.exec);
  var push$3 = functionUncurryThis($push);
  var stringSlice$2 = functionUncurryThis(''.slice);

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
            push$3(output, stringSlice$2(string, lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) functionApply($push, output, arraySliceSimple(match, 1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }
          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }
        if (lastLastIndex === string.length) {
          if (lastLength || !exec$3(separatorCopy, '')) push$3(output, '');
        } else push$3(output, stringSlice$2(string, lastLastIndex));
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
          var z = regexpExecAbstract(splitter, UNSUPPORTED_Y ? stringSlice$2(S, q) : S);
          var e;
          if (
            z === null ||
            (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
          ) {
            q = advanceStringIndex(S, q, unicodeMatching);
          } else {
            push$3(A, stringSlice$2(S, p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              push$3(A, z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        push$3(A, stringSlice$2(S, p));
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

  var ieee754 = {
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
          var val = ieee754.read(this.buf, this.pos, true, 23, 4);
          this.pos += 4;
          return val;
      },

      readDouble: function() {
          var val = ieee754.read(this.buf, this.pos, true, 52, 8);
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
          ieee754.write(this.buf, val, this.pos, true, 23, 4);
          this.pos += 4;
      },

      writeDouble: function(val) {
          this.realloc(8);
          ieee754.write(this.buf, val, this.pos, true, 52, 8);
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

  var PbfLayer = leafletSrc.GridLayer.extend({
    options: {
      zoomHook: function zoomHook(coords) {
        var tp = Object.assign({}, coords);
        var d = tp.z - 12;

        if (d > 0) {
          tp.z = 12;
          tp.scale = Math.pow(2, d);
          tp.x = Math.floor(tp.x / tp.scale);
          tp.y = Math.floor(tp.y / tp.scale);
        }

        return tp;
      }
    },
    createTile: function createTile(coords, done) {
      var _this = this;

      var tile = leafletSrc.DomUtil.create('canvas', 'leaflet-tile');
      var size = this.getTileSize();
      tile.width = size.x;
      tile.height = size.y;
      var pcoords = this.options.zoomHook ? this.options.zoomHook(coords) : coords;
      var url = leafletSrc.Util.template(this.options.template, pcoords);
      var dataManager = this.options.dataManager;

      if (dataManager && tile.transferControlToOffscreen) {
        var offscreen = tile.transferControlToOffscreen();
        dataManager.postMessage({
          cmd: 'tile',
          id: this.options.layerID || this._leaflet_id,
          canvas: offscreen,
          url: url,
          coords: coords,
          pcoords: pcoords,
          tKey: this._tileCoordsToKey(coords)
        }, [offscreen]);
        leafletSrc.Util.requestAnimFrame(leafletSrc.Util.bind(this._tileReady, this, coords, null, tile));
      } else {
        // const layer = this;
        Renderer.drawPBF(tile, url, coords, pcoords).then(function (flag) {
          leafletSrc.Util.requestAnimFrame(leafletSrc.Util.bind(_this._tileReady, _this, coords, null, tile));
        });
      }

      return tile;
    }
  });

  L.Control.Search = L.Control.extend({
    options: {
      position: 'topleft',
      notHide: true,
      id: 'search'
    },
    onAdd: function onAdd(map) {
      var container = L.DomUtil.create('div', 'search');
      L.DomUtil.create('input', '', container);
      L.DomUtil.create('i', '', container);
      this._container = container;

      if (this.options.notHide) {
        container._notHide = true;
      }

      container.id = this.options.id; // var url = '//scanex.ru/' + (L.gmxLocale && L.gmxLocale.getLanguage() === 'rus' ? '' : 'en/');
      // container.setAttribute('href', url);
      // container.setAttribute('target', '_blank');
      // this._logoPrefix = 'leaflet-gmx-logo' + (this.options.type ? '-' + this.options.type : '');
      // var shiftClass = this._logoPrefix + '-shift';
      // this._shift = false;
      // this._updatePosition = function (ev) {
      // if (container.parentNode) {
      // var shift = (container.clientWidth - container.parentNode.clientWidth) / 2 + ev.locationSize > 0 ? true : false;
      // if (this._shift !== shift) {
      // this._shift = shift;
      // if (shift) {
      // L.DomUtil.addClass(container, shiftClass);
      // } else {
      // L.DomUtil.removeClass(container, shiftClass);
      // }
      // }
      // }
      // };
      // map.fire('controladd', this);
      // if (map.gmxControlsManager) {
      // map.gmxControlsManager.add(this);
      // }

      return container;
    },
    onRemove: function onRemove(map) {
      if (map.gmxControlsManager) {
        map.gmxControlsManager.remove(this);
      }

      map.fire('controlremove', this);
      map.off('onChangeLocationSize', this._updatePosition, this);
    }
  });
  L.Control.search = L.Control.Search;

  L.control.search = function (options) {
    return new L.Control.Search(options);
  };

  var un$Join = functionUncurryThis([].join);

  var ES3_STRINGS = indexedObject != Object;
  var STRICT_METHOD = arrayMethodIsStrict('join', ',');

  // `Array.prototype.join` method
  // https://tc39.es/ecma262/#sec-array.prototype.join
  _export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
    join: function join(separator) {
      return un$Join(toIndexedObject(this), separator === undefined ? ',' : separator);
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

  var correctPrototypeGetter = !fails(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO = sharedKey('IE_PROTO');
  var Object$1 = global_1.Object;
  var ObjectPrototype = Object$1.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  var objectGetPrototypeOf = correctPrototypeGetter ? Object$1.getPrototypeOf : function (O) {
    var object = toObject(O);
    if (hasOwnProperty_1(object, IE_PROTO)) return object[IE_PROTO];
    var constructor = object.constructor;
    if (isCallable(constructor) && object instanceof constructor) {
      return constructor.prototype;
    } return object instanceof Object$1 ? ObjectPrototype : null;
  };

  var ITERATOR$4 = wellKnownSymbol('iterator');
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
    return IteratorPrototype$2[ITERATOR$4].call(test) !== test;
  });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

  // `%IteratorPrototype%[@@iterator]()` method
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
  if (!isCallable(IteratorPrototype$2[ITERATOR$4])) {
    redefine(IteratorPrototype$2, ITERATOR$4, function () {
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
  var ITERATOR$3 = wellKnownSymbol('iterator');
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
    var nativeIterator = IterablePrototype[ITERATOR$3]
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
          } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$3])) {
            redefine(CurrentIteratorPrototype, ITERATOR$3, returnThis);
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
    if (IterablePrototype[ITERATOR$3] !== defaultIterator) {
      redefine(IterablePrototype, ITERATOR$3, defaultIterator, { name: DEFAULT });
    }
    iterators[NAME] = defaultIterator;

    return methods;
  };

  var defineProperty$1 = objectDefineProperty.f;




  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$3 = internalState.set;
  var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

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
    setInternalState$3(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$1(this);
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

  var charAt$3 = stringMultibyte.charAt;




  var STRING_ITERATOR = 'String Iterator';
  var setInternalState$2 = internalState.set;
  var getInternalState = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState$2(this, {
      type: STRING_ITERATOR,
      string: toString_1(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt$3(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  var ITERATOR$2 = wellKnownSymbol('iterator');
  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  var ArrayValues = es_array_iterator.values;

  var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
    if (CollectionPrototype) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
        createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
      } catch (error) {
        CollectionPrototype[ITERATOR$2] = ArrayValues;
      }
      if (!CollectionPrototype[TO_STRING_TAG]) {
        createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
      }
      if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
          createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
        } catch (error) {
          CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
        }
      }
    }
  };

  for (var COLLECTION_NAME in domIterables) {
    handlePrototype(global_1[COLLECTION_NAME] && global_1[COLLECTION_NAME].prototype, COLLECTION_NAME);
  }

  handlePrototype(domTokenListPrototype, 'DOMTokenList');

  var ITERATOR$1 = wellKnownSymbol('iterator');

  var nativeUrl = !fails(function () {
    // eslint-disable-next-line unicorn/relative-url-style -- required for testing
    var url = new URL('b?a=1&b=2&c=3', 'http://a');
    var searchParams = url.searchParams;
    var result = '';
    url.pathname = 'c%20d';
    searchParams.forEach(function (value, key) {
      searchParams['delete']('b');
      result += key + value;
    });
    return (isPure && !url.toJSON)
      || !searchParams.sort
      || url.href !== 'http://a/c%20d?a=1&c=3'
      || searchParams.get('c') !== '3'
      || String(new URLSearchParams('?a=1')) !== 'a=1'
      || !searchParams[ITERATOR$1]
      // throws in Edge
      || new URL('https://a@b').username !== 'a'
      || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
      // not punycoded in Edge
      || new URL('http://тест').host !== 'xn--e1aybc'
      // not escaped in Chrome 62-
      || new URL('http://a#б').hash !== '#%D0%B1'
      // fails in Chrome 66-
      || result !== 'a1c3'
      // throws in Safari
      || new URL('http://x', undefined).host !== 'x';
  });

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
  };

  var Array$2 = global_1.Array;

  // `Array.from` method implementation
  // https://tc39.es/ecma262/#sec-array.from
  var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var IS_CONSTRUCTOR = isConstructor(this);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
    var iteratorMethod = getIteratorMethod(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod && !(this == Array$2 && isArrayIteratorMethod(iteratorMethod))) {
      iterator = getIterator(O, iteratorMethod);
      next = iterator.next;
      result = IS_CONSTRUCTOR ? new this() : [];
      for (;!(step = functionCall(next, iterator)).done; index++) {
        value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
        createProperty(result, index, value);
      }
    } else {
      length = lengthOfArrayLike(O);
      result = IS_CONSTRUCTOR ? new this(length) : Array$2(length);
      for (;length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty(result, index, value);
      }
    }
    result.length = index;
    return result;
  };

  // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js



  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80
  var delimiter = '-'; // '\x2D'
  var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
  var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
  var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
  var baseMinusTMin = base - tMin;

  var RangeError = global_1.RangeError;
  var exec$2 = functionUncurryThis(regexSeparators.exec);
  var floor$2 = Math.floor;
  var fromCharCode = String.fromCharCode;
  var charCodeAt$1 = functionUncurryThis(''.charCodeAt);
  var join$2 = functionUncurryThis([].join);
  var push$2 = functionUncurryThis([].push);
  var replace$3 = functionUncurryThis(''.replace);
  var split$2 = functionUncurryThis(''.split);
  var toLowerCase$1 = functionUncurryThis(''.toLowerCase);

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   */
  var ucs2decode = function (string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var value = charCodeAt$1(string, counter++);
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // It's a high surrogate, and there is a next character.
        var extra = charCodeAt$1(string, counter++);
        if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
          push$2(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // It's an unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair.
          push$2(output, value);
          counter--;
        }
      } else {
        push$2(output, value);
      }
    }
    return output;
  };

  /**
   * Converts a digit/integer into a basic code point.
   */
  var digitToBasic = function (digit) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26);
  };

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   */
  var adapt = function (delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor$2(delta / damp) : delta >> 1;
    delta += floor$2(delta / numPoints);
    while (delta > baseMinusTMin * tMax >> 1) {
      delta = floor$2(delta / baseMinusTMin);
      k += base;
    }
    return floor$2(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   */
  var encode = function (input) {
    var output = [];

    // Convert the input in UCS-2 to an array of Unicode code points.
    input = ucs2decode(input);

    // Cache the length.
    var inputLength = input.length;

    // Initialize the state.
    var n = initialN;
    var delta = 0;
    var bias = initialBias;
    var i, currentValue;

    // Handle the basic code points.
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < 0x80) {
        push$2(output, fromCharCode(currentValue));
      }
    }

    var basicLength = output.length; // number of basic code points.
    var handledCPCount = basicLength; // number of code points that have been handled;

    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
      push$2(output, delimiter);
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next larger one:
      var m = maxInt;
      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }

      // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
      var handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor$2((maxInt - delta) / handledCPCountPlusOne)) {
        throw RangeError(OVERFLOW_ERROR);
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue < n && ++delta > maxInt) {
          throw RangeError(OVERFLOW_ERROR);
        }
        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer.
          var q = delta;
          var k = base;
          while (true) {
            var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
            if (q < t) break;
            var qMinusT = q - t;
            var baseMinusT = base - t;
            push$2(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
            q = floor$2(qMinusT / baseMinusT);
            k += base;
          }

          push$2(output, fromCharCode(digitToBasic(q)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          handledCPCount++;
        }
      }

      delta++;
      n++;
    }
    return join$2(output, '');
  };

  var stringPunycodeToAscii = function (input) {
    var encoded = [];
    var labels = split$2(replace$3(toLowerCase$1(input), regexSeparators, '\u002E'), '.');
    var i, label;
    for (i = 0; i < labels.length; i++) {
      label = labels[i];
      push$2(encoded, exec$2(regexNonASCII, label) ? 'xn--' + encode(label) : label);
    }
    return join$2(encoded, '.');
  };

  var floor$1 = Math.floor;

  var mergeSort = function (array, comparefn) {
    var length = array.length;
    var middle = floor$1(length / 2);
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

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`




























  var ITERATOR = wellKnownSymbol('iterator');
  var URL_SEARCH_PARAMS = 'URLSearchParams';
  var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
  var setInternalState$1 = internalState.set;
  var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
  var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

  var n$Fetch = getBuiltIn('fetch');
  var N$Request = getBuiltIn('Request');
  var Headers = getBuiltIn('Headers');
  var RequestPrototype = N$Request && N$Request.prototype;
  var HeadersPrototype = Headers && Headers.prototype;
  var RegExp$1 = global_1.RegExp;
  var TypeError$3 = global_1.TypeError;
  var decodeURIComponent = global_1.decodeURIComponent;
  var encodeURIComponent$1 = global_1.encodeURIComponent;
  var charAt$2 = functionUncurryThis(''.charAt);
  var join$1 = functionUncurryThis([].join);
  var push$1 = functionUncurryThis([].push);
  var replace$2 = functionUncurryThis(''.replace);
  var shift$1 = functionUncurryThis([].shift);
  var splice = functionUncurryThis([].splice);
  var split$1 = functionUncurryThis(''.split);
  var stringSlice$1 = functionUncurryThis(''.slice);

  var plus = /\+/g;
  var sequences = Array(4);

  var percentSequence = function (bytes) {
    return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp$1('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
  };

  var percentDecode = function (sequence) {
    try {
      return decodeURIComponent(sequence);
    } catch (error) {
      return sequence;
    }
  };

  var deserialize = function (it) {
    var result = replace$2(it, plus, ' ');
    var bytes = 4;
    try {
      return decodeURIComponent(result);
    } catch (error) {
      while (bytes) {
        result = replace$2(result, percentSequence(bytes--), percentDecode);
      }
      return result;
    }
  };

  var find = /[!'()~]|%20/g;

  var replacements = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+'
  };

  var replacer = function (match) {
    return replacements[match];
  };

  var serialize = function (it) {
    return replace$2(encodeURIComponent$1(it), find, replacer);
  };

  var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
    setInternalState$1(this, {
      type: URL_SEARCH_PARAMS_ITERATOR,
      iterator: getIterator(getInternalParamsState(params).entries),
      kind: kind
    });
  }, 'Iterator', function next() {
    var state = getInternalIteratorState(this);
    var kind = state.kind;
    var step = state.iterator.next();
    var entry = step.value;
    if (!step.done) {
      step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
    } return step;
  }, true);

  var URLSearchParamsState = function (init) {
    this.entries = [];
    this.url = null;

    if (init !== undefined) {
      if (isObject(init)) this.parseObject(init);
      else this.parseQuery(typeof init == 'string' ? charAt$2(init, 0) === '?' ? stringSlice$1(init, 1) : init : toString_1(init));
    }
  };

  URLSearchParamsState.prototype = {
    type: URL_SEARCH_PARAMS,
    bindURL: function (url) {
      this.url = url;
      this.update();
    },
    parseObject: function (object) {
      var iteratorMethod = getIteratorMethod(object);
      var iterator, next, step, entryIterator, entryNext, first, second;

      if (iteratorMethod) {
        iterator = getIterator(object, iteratorMethod);
        next = iterator.next;
        while (!(step = functionCall(next, iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = functionCall(entryNext, entryIterator)).done ||
            (second = functionCall(entryNext, entryIterator)).done ||
            !functionCall(entryNext, entryIterator).done
          ) throw TypeError$3('Expected sequence with length 2');
          push$1(this.entries, { key: toString_1(first.value), value: toString_1(second.value) });
        }
      } else for (var key in object) if (hasOwnProperty_1(object, key)) {
        push$1(this.entries, { key: key, value: toString_1(object[key]) });
      }
    },
    parseQuery: function (query) {
      if (query) {
        var attributes = split$1(query, '&');
        var index = 0;
        var attribute, entry;
        while (index < attributes.length) {
          attribute = attributes[index++];
          if (attribute.length) {
            entry = split$1(attribute, '=');
            push$1(this.entries, {
              key: deserialize(shift$1(entry)),
              value: deserialize(join$1(entry, '='))
            });
          }
        }
      }
    },
    serialize: function () {
      var entries = this.entries;
      var result = [];
      var index = 0;
      var entry;
      while (index < entries.length) {
        entry = entries[index++];
        push$1(result, serialize(entry.key) + '=' + serialize(entry.value));
      } return join$1(result, '&');
    },
    update: function () {
      this.entries.length = 0;
      this.parseQuery(this.url.query);
    },
    updateURL: function () {
      if (this.url) this.url.update();
    }
  };

  // `URLSearchParams` constructor
  // https://url.spec.whatwg.org/#interface-urlsearchparams
  var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
    anInstance(this, URLSearchParamsPrototype);
    var init = arguments.length > 0 ? arguments[0] : undefined;
    setInternalState$1(this, new URLSearchParamsState(init));
  };

  var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

  redefineAll(URLSearchParamsPrototype, {
    // `URLSearchParams.prototype.append` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-append
    append: function append(name, value) {
      validateArgumentsLength(arguments.length, 2);
      var state = getInternalParamsState(this);
      push$1(state.entries, { key: toString_1(name), value: toString_1(value) });
      state.updateURL();
    },
    // `URLSearchParams.prototype.delete` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
    'delete': function (name) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var key = toString_1(name);
      var index = 0;
      while (index < entries.length) {
        if (entries[index].key === key) splice(entries, index, 1);
        else index++;
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.get` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-get
    get: function get(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = toString_1(name);
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) return entries[index].value;
      }
      return null;
    },
    // `URLSearchParams.prototype.getAll` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
    getAll: function getAll(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = toString_1(name);
      var result = [];
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) push$1(result, entries[index].value);
      }
      return result;
    },
    // `URLSearchParams.prototype.has` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-has
    has: function has(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = toString_1(name);
      var index = 0;
      while (index < entries.length) {
        if (entries[index++].key === key) return true;
      }
      return false;
    },
    // `URLSearchParams.prototype.set` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-set
    set: function set(name, value) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var found = false;
      var key = toString_1(name);
      var val = toString_1(value);
      var index = 0;
      var entry;
      for (; index < entries.length; index++) {
        entry = entries[index];
        if (entry.key === key) {
          if (found) splice(entries, index--, 1);
          else {
            found = true;
            entry.value = val;
          }
        }
      }
      if (!found) push$1(entries, { key: key, value: val });
      state.updateURL();
    },
    // `URLSearchParams.prototype.sort` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
    sort: function sort() {
      var state = getInternalParamsState(this);
      arraySort(state.entries, function (a, b) {
        return a.key > b.key ? 1 : -1;
      });
      state.updateURL();
    },
    // `URLSearchParams.prototype.forEach` method
    forEach: function forEach(callback /* , thisArg */) {
      var entries = getInternalParamsState(this).entries;
      var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined);
      var index = 0;
      var entry;
      while (index < entries.length) {
        entry = entries[index++];
        boundFunction(entry.value, entry.key, this);
      }
    },
    // `URLSearchParams.prototype.keys` method
    keys: function keys() {
      return new URLSearchParamsIterator(this, 'keys');
    },
    // `URLSearchParams.prototype.values` method
    values: function values() {
      return new URLSearchParamsIterator(this, 'values');
    },
    // `URLSearchParams.prototype.entries` method
    entries: function entries() {
      return new URLSearchParamsIterator(this, 'entries');
    }
  }, { enumerable: true });

  // `URLSearchParams.prototype[@@iterator]` method
  redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

  // `URLSearchParams.prototype.toString` method
  // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
  redefine(URLSearchParamsPrototype, 'toString', function toString() {
    return getInternalParamsState(this).serialize();
  }, { enumerable: true });

  setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

  _export({ global: true, forced: !nativeUrl }, {
    URLSearchParams: URLSearchParamsConstructor
  });

  // Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
  if (!nativeUrl && isCallable(Headers)) {
    var headersHas = functionUncurryThis(HeadersPrototype.has);
    var headersSet = functionUncurryThis(HeadersPrototype.set);

    var wrapRequestOptions = function (init) {
      if (isObject(init)) {
        var body = init.body;
        var headers;
        if (classof(body) === URL_SEARCH_PARAMS) {
          headers = init.headers ? new Headers(init.headers) : new Headers();
          if (!headersHas(headers, 'content-type')) {
            headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
          }
          return objectCreate(init, {
            body: createPropertyDescriptor(0, toString_1(body)),
            headers: createPropertyDescriptor(0, headers)
          });
        }
      } return init;
    };

    if (isCallable(n$Fetch)) {
      _export({ global: true, enumerable: true, forced: true }, {
        fetch: function fetch(input /* , init */) {
          return n$Fetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
        }
      });
    }

    if (isCallable(N$Request)) {
      var RequestConstructor = function Request(input /* , init */) {
        anInstance(this, RequestPrototype);
        return new N$Request(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      };

      RequestPrototype.constructor = RequestConstructor;
      RequestConstructor.prototype = RequestPrototype;

      _export({ global: true, forced: true }, {
        Request: RequestConstructor
      });
    }
  }

  var web_urlSearchParams = {
    URLSearchParams: URLSearchParamsConstructor,
    getState: getInternalParamsState
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`







  var defineProperties = objectDefineProperties.f;






  var codeAt = stringMultibyte.codeAt;







  var setInternalState = internalState.set;
  var getInternalURLState = internalState.getterFor('URL');
  var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
  var getInternalSearchParamsState = web_urlSearchParams.getState;

  var NativeURL = global_1.URL;
  var TypeError$2 = global_1.TypeError;
  var parseInt$1 = global_1.parseInt;
  var floor = Math.floor;
  var pow = Math.pow;
  var charAt$1 = functionUncurryThis(''.charAt);
  var exec$1 = functionUncurryThis(/./.exec);
  var join = functionUncurryThis([].join);
  var numberToString$1 = functionUncurryThis(1.0.toString);
  var pop = functionUncurryThis([].pop);
  var push = functionUncurryThis([].push);
  var replace$1 = functionUncurryThis(''.replace);
  var shift = functionUncurryThis([].shift);
  var split = functionUncurryThis(''.split);
  var stringSlice = functionUncurryThis(''.slice);
  var toLowerCase = functionUncurryThis(''.toLowerCase);
  var unshift = functionUncurryThis([].unshift);

  var INVALID_AUTHORITY = 'Invalid authority';
  var INVALID_SCHEME = 'Invalid scheme';
  var INVALID_HOST = 'Invalid host';
  var INVALID_PORT = 'Invalid port';

  var ALPHA = /[a-z]/i;
  // eslint-disable-next-line regexp/no-obscure-range -- safe
  var ALPHANUMERIC = /[\d+-.a-z]/i;
  var DIGIT = /\d/;
  var HEX_START = /^0x/i;
  var OCT = /^[0-7]+$/;
  var DEC = /^\d+$/;
  var HEX = /^[\da-f]+$/i;
  /* eslint-disable regexp/no-control-character -- safe */
  var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
  var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
  var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g;
  var TAB_AND_NEW_LINE = /[\t\n\r]/g;
  /* eslint-enable regexp/no-control-character -- safe */
  var EOF;

  // https://url.spec.whatwg.org/#ipv4-number-parser
  var parseIPv4 = function (input) {
    var parts = split(input, '.');
    var partsLength, numbers, index, part, radix, number, ipv4;
    if (parts.length && parts[parts.length - 1] == '') {
      parts.length--;
    }
    partsLength = parts.length;
    if (partsLength > 4) return input;
    numbers = [];
    for (index = 0; index < partsLength; index++) {
      part = parts[index];
      if (part == '') return input;
      radix = 10;
      if (part.length > 1 && charAt$1(part, 0) == '0') {
        radix = exec$1(HEX_START, part) ? 16 : 8;
        part = stringSlice(part, radix == 8 ? 1 : 2);
      }
      if (part === '') {
        number = 0;
      } else {
        if (!exec$1(radix == 10 ? DEC : radix == 8 ? OCT : HEX, part)) return input;
        number = parseInt$1(part, radix);
      }
      push(numbers, number);
    }
    for (index = 0; index < partsLength; index++) {
      number = numbers[index];
      if (index == partsLength - 1) {
        if (number >= pow(256, 5 - partsLength)) return null;
      } else if (number > 255) return null;
    }
    ipv4 = pop(numbers);
    for (index = 0; index < numbers.length; index++) {
      ipv4 += numbers[index] * pow(256, 3 - index);
    }
    return ipv4;
  };

  // https://url.spec.whatwg.org/#concept-ipv6-parser
  // eslint-disable-next-line max-statements -- TODO
  var parseIPv6 = function (input) {
    var address = [0, 0, 0, 0, 0, 0, 0, 0];
    var pieceIndex = 0;
    var compress = null;
    var pointer = 0;
    var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

    var chr = function () {
      return charAt$1(input, pointer);
    };

    if (chr() == ':') {
      if (charAt$1(input, 1) != ':') return;
      pointer += 2;
      pieceIndex++;
      compress = pieceIndex;
    }
    while (chr()) {
      if (pieceIndex == 8) return;
      if (chr() == ':') {
        if (compress !== null) return;
        pointer++;
        pieceIndex++;
        compress = pieceIndex;
        continue;
      }
      value = length = 0;
      while (length < 4 && exec$1(HEX, chr())) {
        value = value * 16 + parseInt$1(chr(), 16);
        pointer++;
        length++;
      }
      if (chr() == '.') {
        if (length == 0) return;
        pointer -= length;
        if (pieceIndex > 6) return;
        numbersSeen = 0;
        while (chr()) {
          ipv4Piece = null;
          if (numbersSeen > 0) {
            if (chr() == '.' && numbersSeen < 4) pointer++;
            else return;
          }
          if (!exec$1(DIGIT, chr())) return;
          while (exec$1(DIGIT, chr())) {
            number = parseInt$1(chr(), 10);
            if (ipv4Piece === null) ipv4Piece = number;
            else if (ipv4Piece == 0) return;
            else ipv4Piece = ipv4Piece * 10 + number;
            if (ipv4Piece > 255) return;
            pointer++;
          }
          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          numbersSeen++;
          if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
        }
        if (numbersSeen != 4) return;
        break;
      } else if (chr() == ':') {
        pointer++;
        if (!chr()) return;
      } else if (chr()) return;
      address[pieceIndex++] = value;
    }
    if (compress !== null) {
      swaps = pieceIndex - compress;
      pieceIndex = 7;
      while (pieceIndex != 0 && swaps > 0) {
        swap = address[pieceIndex];
        address[pieceIndex--] = address[compress + swaps - 1];
        address[compress + --swaps] = swap;
      }
    } else if (pieceIndex != 8) return;
    return address;
  };

  var findLongestZeroSequence = function (ipv6) {
    var maxIndex = null;
    var maxLength = 1;
    var currStart = null;
    var currLength = 0;
    var index = 0;
    for (; index < 8; index++) {
      if (ipv6[index] !== 0) {
        if (currLength > maxLength) {
          maxIndex = currStart;
          maxLength = currLength;
        }
        currStart = null;
        currLength = 0;
      } else {
        if (currStart === null) currStart = index;
        ++currLength;
      }
    }
    if (currLength > maxLength) {
      maxIndex = currStart;
      maxLength = currLength;
    }
    return maxIndex;
  };

  // https://url.spec.whatwg.org/#host-serializing
  var serializeHost = function (host) {
    var result, index, compress, ignore0;
    // ipv4
    if (typeof host == 'number') {
      result = [];
      for (index = 0; index < 4; index++) {
        unshift(result, host % 256);
        host = floor(host / 256);
      } return join(result, '.');
    // ipv6
    } else if (typeof host == 'object') {
      result = '';
      compress = findLongestZeroSequence(host);
      for (index = 0; index < 8; index++) {
        if (ignore0 && host[index] === 0) continue;
        if (ignore0) ignore0 = false;
        if (compress === index) {
          result += index ? ':' : '::';
          ignore0 = true;
        } else {
          result += numberToString$1(host[index], 16);
          if (index < 7) result += ':';
        }
      }
      return '[' + result + ']';
    } return host;
  };

  var C0ControlPercentEncodeSet = {};
  var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
    ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
  });
  var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
    '#': 1, '?': 1, '{': 1, '}': 1
  });
  var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
    '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
  });

  var percentEncode = function (chr, set) {
    var code = codeAt(chr, 0);
    return code > 0x20 && code < 0x7F && !hasOwnProperty_1(set, chr) ? chr : encodeURIComponent(chr);
  };

  // https://url.spec.whatwg.org/#special-scheme
  var specialSchemes = {
    ftp: 21,
    file: null,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };

  // https://url.spec.whatwg.org/#windows-drive-letter
  var isWindowsDriveLetter = function (string, normalized) {
    var second;
    return string.length == 2 && exec$1(ALPHA, charAt$1(string, 0))
      && ((second = charAt$1(string, 1)) == ':' || (!normalized && second == '|'));
  };

  // https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
  var startsWithWindowsDriveLetter = function (string) {
    var third;
    return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (
      string.length == 2 ||
      ((third = charAt$1(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
    );
  };

  // https://url.spec.whatwg.org/#single-dot-path-segment
  var isSingleDot = function (segment) {
    return segment === '.' || toLowerCase(segment) === '%2e';
  };

  // https://url.spec.whatwg.org/#double-dot-path-segment
  var isDoubleDot = function (segment) {
    segment = toLowerCase(segment);
    return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
  };

  // States:
  var SCHEME_START = {};
  var SCHEME = {};
  var NO_SCHEME = {};
  var SPECIAL_RELATIVE_OR_AUTHORITY = {};
  var PATH_OR_AUTHORITY = {};
  var RELATIVE = {};
  var RELATIVE_SLASH = {};
  var SPECIAL_AUTHORITY_SLASHES = {};
  var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
  var AUTHORITY = {};
  var HOST = {};
  var HOSTNAME = {};
  var PORT = {};
  var FILE = {};
  var FILE_SLASH = {};
  var FILE_HOST = {};
  var PATH_START = {};
  var PATH = {};
  var CANNOT_BE_A_BASE_URL_PATH = {};
  var QUERY = {};
  var FRAGMENT = {};

  var URLState = function (url, isBase, base) {
    var urlString = toString_1(url);
    var baseState, failure, searchParams;
    if (isBase) {
      failure = this.parse(urlString);
      if (failure) throw TypeError$2(failure);
      this.searchParams = null;
    } else {
      if (base !== undefined) baseState = new URLState(base, true);
      failure = this.parse(urlString, null, baseState);
      if (failure) throw TypeError$2(failure);
      searchParams = getInternalSearchParamsState(new URLSearchParams$1());
      searchParams.bindURL(this);
      this.searchParams = searchParams;
    }
  };

  URLState.prototype = {
    type: 'URL',
    // https://url.spec.whatwg.org/#url-parsing
    // eslint-disable-next-line max-statements -- TODO
    parse: function (input, stateOverride, base) {
      var url = this;
      var state = stateOverride || SCHEME_START;
      var pointer = 0;
      var buffer = '';
      var seenAt = false;
      var seenBracket = false;
      var seenPasswordToken = false;
      var codePoints, chr, bufferCodePoints, failure;

      input = toString_1(input);

      if (!stateOverride) {
        url.scheme = '';
        url.username = '';
        url.password = '';
        url.host = null;
        url.port = null;
        url.path = [];
        url.query = null;
        url.fragment = null;
        url.cannotBeABaseURL = false;
        input = replace$1(input, LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
      }

      input = replace$1(input, TAB_AND_NEW_LINE, '');

      codePoints = arrayFrom(input);

      while (pointer <= codePoints.length) {
        chr = codePoints[pointer];
        switch (state) {
          case SCHEME_START:
            if (chr && exec$1(ALPHA, chr)) {
              buffer += toLowerCase(chr);
              state = SCHEME;
            } else if (!stateOverride) {
              state = NO_SCHEME;
              continue;
            } else return INVALID_SCHEME;
            break;

          case SCHEME:
            if (chr && (exec$1(ALPHANUMERIC, chr) || chr == '+' || chr == '-' || chr == '.')) {
              buffer += toLowerCase(chr);
            } else if (chr == ':') {
              if (stateOverride && (
                (url.isSpecial() != hasOwnProperty_1(specialSchemes, buffer)) ||
                (buffer == 'file' && (url.includesCredentials() || url.port !== null)) ||
                (url.scheme == 'file' && !url.host)
              )) return;
              url.scheme = buffer;
              if (stateOverride) {
                if (url.isSpecial() && specialSchemes[url.scheme] == url.port) url.port = null;
                return;
              }
              buffer = '';
              if (url.scheme == 'file') {
                state = FILE;
              } else if (url.isSpecial() && base && base.scheme == url.scheme) {
                state = SPECIAL_RELATIVE_OR_AUTHORITY;
              } else if (url.isSpecial()) {
                state = SPECIAL_AUTHORITY_SLASHES;
              } else if (codePoints[pointer + 1] == '/') {
                state = PATH_OR_AUTHORITY;
                pointer++;
              } else {
                url.cannotBeABaseURL = true;
                push(url.path, '');
                state = CANNOT_BE_A_BASE_URL_PATH;
              }
            } else if (!stateOverride) {
              buffer = '';
              state = NO_SCHEME;
              pointer = 0;
              continue;
            } else return INVALID_SCHEME;
            break;

          case NO_SCHEME:
            if (!base || (base.cannotBeABaseURL && chr != '#')) return INVALID_SCHEME;
            if (base.cannotBeABaseURL && chr == '#') {
              url.scheme = base.scheme;
              url.path = arraySliceSimple(base.path);
              url.query = base.query;
              url.fragment = '';
              url.cannotBeABaseURL = true;
              state = FRAGMENT;
              break;
            }
            state = base.scheme == 'file' ? FILE : RELATIVE;
            continue;

          case SPECIAL_RELATIVE_OR_AUTHORITY:
            if (chr == '/' && codePoints[pointer + 1] == '/') {
              state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
              pointer++;
            } else {
              state = RELATIVE;
              continue;
            } break;

          case PATH_OR_AUTHORITY:
            if (chr == '/') {
              state = AUTHORITY;
              break;
            } else {
              state = PATH;
              continue;
            }

          case RELATIVE:
            url.scheme = base.scheme;
            if (chr == EOF) {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              url.path = arraySliceSimple(base.path);
              url.query = base.query;
            } else if (chr == '/' || (chr == '\\' && url.isSpecial())) {
              state = RELATIVE_SLASH;
            } else if (chr == '?') {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              url.path = arraySliceSimple(base.path);
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              url.path = arraySliceSimple(base.path);
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              url.path = arraySliceSimple(base.path);
              url.path.length--;
              state = PATH;
              continue;
            } break;

          case RELATIVE_SLASH:
            if (url.isSpecial() && (chr == '/' || chr == '\\')) {
              state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            } else if (chr == '/') {
              state = AUTHORITY;
            } else {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              state = PATH;
              continue;
            } break;

          case SPECIAL_AUTHORITY_SLASHES:
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            if (chr != '/' || charAt$1(buffer, pointer + 1) != '/') continue;
            pointer++;
            break;

          case SPECIAL_AUTHORITY_IGNORE_SLASHES:
            if (chr != '/' && chr != '\\') {
              state = AUTHORITY;
              continue;
            } break;

          case AUTHORITY:
            if (chr == '@') {
              if (seenAt) buffer = '%40' + buffer;
              seenAt = true;
              bufferCodePoints = arrayFrom(buffer);
              for (var i = 0; i < bufferCodePoints.length; i++) {
                var codePoint = bufferCodePoints[i];
                if (codePoint == ':' && !seenPasswordToken) {
                  seenPasswordToken = true;
                  continue;
                }
                var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
                if (seenPasswordToken) url.password += encodedCodePoints;
                else url.username += encodedCodePoints;
              }
              buffer = '';
            } else if (
              chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
              (chr == '\\' && url.isSpecial())
            ) {
              if (seenAt && buffer == '') return INVALID_AUTHORITY;
              pointer -= arrayFrom(buffer).length + 1;
              buffer = '';
              state = HOST;
            } else buffer += chr;
            break;

          case HOST:
          case HOSTNAME:
            if (stateOverride && url.scheme == 'file') {
              state = FILE_HOST;
              continue;
            } else if (chr == ':' && !seenBracket) {
              if (buffer == '') return INVALID_HOST;
              failure = url.parseHost(buffer);
              if (failure) return failure;
              buffer = '';
              state = PORT;
              if (stateOverride == HOSTNAME) return;
            } else if (
              chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
              (chr == '\\' && url.isSpecial())
            ) {
              if (url.isSpecial() && buffer == '') return INVALID_HOST;
              if (stateOverride && buffer == '' && (url.includesCredentials() || url.port !== null)) return;
              failure = url.parseHost(buffer);
              if (failure) return failure;
              buffer = '';
              state = PATH_START;
              if (stateOverride) return;
              continue;
            } else {
              if (chr == '[') seenBracket = true;
              else if (chr == ']') seenBracket = false;
              buffer += chr;
            } break;

          case PORT:
            if (exec$1(DIGIT, chr)) {
              buffer += chr;
            } else if (
              chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
              (chr == '\\' && url.isSpecial()) ||
              stateOverride
            ) {
              if (buffer != '') {
                var port = parseInt$1(buffer, 10);
                if (port > 0xFFFF) return INVALID_PORT;
                url.port = (url.isSpecial() && port === specialSchemes[url.scheme]) ? null : port;
                buffer = '';
              }
              if (stateOverride) return;
              state = PATH_START;
              continue;
            } else return INVALID_PORT;
            break;

          case FILE:
            url.scheme = 'file';
            if (chr == '/' || chr == '\\') state = FILE_SLASH;
            else if (base && base.scheme == 'file') {
              if (chr == EOF) {
                url.host = base.host;
                url.path = arraySliceSimple(base.path);
                url.query = base.query;
              } else if (chr == '?') {
                url.host = base.host;
                url.path = arraySliceSimple(base.path);
                url.query = '';
                state = QUERY;
              } else if (chr == '#') {
                url.host = base.host;
                url.path = arraySliceSimple(base.path);
                url.query = base.query;
                url.fragment = '';
                state = FRAGMENT;
              } else {
                if (!startsWithWindowsDriveLetter(join(arraySliceSimple(codePoints, pointer), ''))) {
                  url.host = base.host;
                  url.path = arraySliceSimple(base.path);
                  url.shortenPath();
                }
                state = PATH;
                continue;
              }
            } else {
              state = PATH;
              continue;
            } break;

          case FILE_SLASH:
            if (chr == '/' || chr == '\\') {
              state = FILE_HOST;
              break;
            }
            if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(join(arraySliceSimple(codePoints, pointer), ''))) {
              if (isWindowsDriveLetter(base.path[0], true)) push(url.path, base.path[0]);
              else url.host = base.host;
            }
            state = PATH;
            continue;

          case FILE_HOST:
            if (chr == EOF || chr == '/' || chr == '\\' || chr == '?' || chr == '#') {
              if (!stateOverride && isWindowsDriveLetter(buffer)) {
                state = PATH;
              } else if (buffer == '') {
                url.host = '';
                if (stateOverride) return;
                state = PATH_START;
              } else {
                failure = url.parseHost(buffer);
                if (failure) return failure;
                if (url.host == 'localhost') url.host = '';
                if (stateOverride) return;
                buffer = '';
                state = PATH_START;
              } continue;
            } else buffer += chr;
            break;

          case PATH_START:
            if (url.isSpecial()) {
              state = PATH;
              if (chr != '/' && chr != '\\') continue;
            } else if (!stateOverride && chr == '?') {
              url.query = '';
              state = QUERY;
            } else if (!stateOverride && chr == '#') {
              url.fragment = '';
              state = FRAGMENT;
            } else if (chr != EOF) {
              state = PATH;
              if (chr != '/') continue;
            } break;

          case PATH:
            if (
              chr == EOF || chr == '/' ||
              (chr == '\\' && url.isSpecial()) ||
              (!stateOverride && (chr == '?' || chr == '#'))
            ) {
              if (isDoubleDot(buffer)) {
                url.shortenPath();
                if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                  push(url.path, '');
                }
              } else if (isSingleDot(buffer)) {
                if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                  push(url.path, '');
                }
              } else {
                if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                  if (url.host) url.host = '';
                  buffer = charAt$1(buffer, 0) + ':'; // normalize windows drive letter
                }
                push(url.path, buffer);
              }
              buffer = '';
              if (url.scheme == 'file' && (chr == EOF || chr == '?' || chr == '#')) {
                while (url.path.length > 1 && url.path[0] === '') {
                  shift(url.path);
                }
              }
              if (chr == '?') {
                url.query = '';
                state = QUERY;
              } else if (chr == '#') {
                url.fragment = '';
                state = FRAGMENT;
              }
            } else {
              buffer += percentEncode(chr, pathPercentEncodeSet);
            } break;

          case CANNOT_BE_A_BASE_URL_PATH:
            if (chr == '?') {
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.fragment = '';
              state = FRAGMENT;
            } else if (chr != EOF) {
              url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
            } break;

          case QUERY:
            if (!stateOverride && chr == '#') {
              url.fragment = '';
              state = FRAGMENT;
            } else if (chr != EOF) {
              if (chr == "'" && url.isSpecial()) url.query += '%27';
              else if (chr == '#') url.query += '%23';
              else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
            } break;

          case FRAGMENT:
            if (chr != EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
            break;
        }

        pointer++;
      }
    },
    // https://url.spec.whatwg.org/#host-parsing
    parseHost: function (input) {
      var result, codePoints, index;
      if (charAt$1(input, 0) == '[') {
        if (charAt$1(input, input.length - 1) != ']') return INVALID_HOST;
        result = parseIPv6(stringSlice(input, 1, -1));
        if (!result) return INVALID_HOST;
        this.host = result;
      // opaque host
      } else if (!this.isSpecial()) {
        if (exec$1(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) return INVALID_HOST;
        result = '';
        codePoints = arrayFrom(input);
        for (index = 0; index < codePoints.length; index++) {
          result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
        }
        this.host = result;
      } else {
        input = stringPunycodeToAscii(input);
        if (exec$1(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
        result = parseIPv4(input);
        if (result === null) return INVALID_HOST;
        this.host = result;
      }
    },
    // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
    cannotHaveUsernamePasswordPort: function () {
      return !this.host || this.cannotBeABaseURL || this.scheme == 'file';
    },
    // https://url.spec.whatwg.org/#include-credentials
    includesCredentials: function () {
      return this.username != '' || this.password != '';
    },
    // https://url.spec.whatwg.org/#is-special
    isSpecial: function () {
      return hasOwnProperty_1(specialSchemes, this.scheme);
    },
    // https://url.spec.whatwg.org/#shorten-a-urls-path
    shortenPath: function () {
      var path = this.path;
      var pathSize = path.length;
      if (pathSize && (this.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
        path.length--;
      }
    },
    // https://url.spec.whatwg.org/#concept-url-serializer
    serialize: function () {
      var url = this;
      var scheme = url.scheme;
      var username = url.username;
      var password = url.password;
      var host = url.host;
      var port = url.port;
      var path = url.path;
      var query = url.query;
      var fragment = url.fragment;
      var output = scheme + ':';
      if (host !== null) {
        output += '//';
        if (url.includesCredentials()) {
          output += username + (password ? ':' + password : '') + '@';
        }
        output += serializeHost(host);
        if (port !== null) output += ':' + port;
      } else if (scheme == 'file') output += '//';
      output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
      if (query !== null) output += '?' + query;
      if (fragment !== null) output += '#' + fragment;
      return output;
    },
    // https://url.spec.whatwg.org/#dom-url-href
    setHref: function (href) {
      var failure = this.parse(href);
      if (failure) throw TypeError$2(failure);
      this.searchParams.update();
    },
    // https://url.spec.whatwg.org/#dom-url-origin
    getOrigin: function () {
      var scheme = this.scheme;
      var port = this.port;
      if (scheme == 'blob') try {
        return new URLConstructor(scheme.path[0]).origin;
      } catch (error) {
        return 'null';
      }
      if (scheme == 'file' || !this.isSpecial()) return 'null';
      return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
    },
    // https://url.spec.whatwg.org/#dom-url-protocol
    getProtocol: function () {
      return this.scheme + ':';
    },
    setProtocol: function (protocol) {
      this.parse(toString_1(protocol) + ':', SCHEME_START);
    },
    // https://url.spec.whatwg.org/#dom-url-username
    getUsername: function () {
      return this.username;
    },
    setUsername: function (username) {
      var codePoints = arrayFrom(toString_1(username));
      if (this.cannotHaveUsernamePasswordPort()) return;
      this.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        this.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    },
    // https://url.spec.whatwg.org/#dom-url-password
    getPassword: function () {
      return this.password;
    },
    setPassword: function (password) {
      var codePoints = arrayFrom(toString_1(password));
      if (this.cannotHaveUsernamePasswordPort()) return;
      this.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        this.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    },
    // https://url.spec.whatwg.org/#dom-url-host
    getHost: function () {
      var host = this.host;
      var port = this.port;
      return host === null ? ''
        : port === null ? serializeHost(host)
        : serializeHost(host) + ':' + port;
    },
    setHost: function (host) {
      if (this.cannotBeABaseURL) return;
      this.parse(host, HOST);
    },
    // https://url.spec.whatwg.org/#dom-url-hostname
    getHostname: function () {
      var host = this.host;
      return host === null ? '' : serializeHost(host);
    },
    setHostname: function (hostname) {
      if (this.cannotBeABaseURL) return;
      this.parse(hostname, HOSTNAME);
    },
    // https://url.spec.whatwg.org/#dom-url-port
    getPort: function () {
      var port = this.port;
      return port === null ? '' : toString_1(port);
    },
    setPort: function (port) {
      if (this.cannotHaveUsernamePasswordPort()) return;
      port = toString_1(port);
      if (port == '') this.port = null;
      else this.parse(port, PORT);
    },
    // https://url.spec.whatwg.org/#dom-url-pathname
    getPathname: function () {
      var path = this.path;
      return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
    },
    setPathname: function (pathname) {
      if (this.cannotBeABaseURL) return;
      this.path = [];
      this.parse(pathname, PATH_START);
    },
    // https://url.spec.whatwg.org/#dom-url-search
    getSearch: function () {
      var query = this.query;
      return query ? '?' + query : '';
    },
    setSearch: function (search) {
      search = toString_1(search);
      if (search == '') {
        this.query = null;
      } else {
        if ('?' == charAt$1(search, 0)) search = stringSlice(search, 1);
        this.query = '';
        this.parse(search, QUERY);
      }
      this.searchParams.update();
    },
    // https://url.spec.whatwg.org/#dom-url-searchparams
    getSearchParams: function () {
      return this.searchParams.facade;
    },
    // https://url.spec.whatwg.org/#dom-url-hash
    getHash: function () {
      var fragment = this.fragment;
      return fragment ? '#' + fragment : '';
    },
    setHash: function (hash) {
      hash = toString_1(hash);
      if (hash == '') {
        this.fragment = null;
        return;
      }
      if ('#' == charAt$1(hash, 0)) hash = stringSlice(hash, 1);
      this.fragment = '';
      this.parse(hash, FRAGMENT);
    },
    update: function () {
      this.query = this.searchParams.serialize() || null;
    }
  };

  // `URL` constructor
  // https://url.spec.whatwg.org/#url-class
  var URLConstructor = function URL(url /* , base */) {
    var that = anInstance(this, URLPrototype);
    var base = validateArgumentsLength(arguments.length, 1) > 1 ? arguments[1] : undefined;
    var state = setInternalState(that, new URLState(url, false, base));
    if (!descriptors) {
      that.href = state.serialize();
      that.origin = state.getOrigin();
      that.protocol = state.getProtocol();
      that.username = state.getUsername();
      that.password = state.getPassword();
      that.host = state.getHost();
      that.hostname = state.getHostname();
      that.port = state.getPort();
      that.pathname = state.getPathname();
      that.search = state.getSearch();
      that.searchParams = state.getSearchParams();
      that.hash = state.getHash();
    }
  };

  var URLPrototype = URLConstructor.prototype;

  var accessorDescriptor = function (getter, setter) {
    return {
      get: function () {
        return getInternalURLState(this)[getter]();
      },
      set: setter && function (value) {
        return getInternalURLState(this)[setter](value);
      },
      configurable: true,
      enumerable: true
    };
  };

  if (descriptors) {
    defineProperties(URLPrototype, {
      // `URL.prototype.href` accessors pair
      // https://url.spec.whatwg.org/#dom-url-href
      href: accessorDescriptor('serialize', 'setHref'),
      // `URL.prototype.origin` getter
      // https://url.spec.whatwg.org/#dom-url-origin
      origin: accessorDescriptor('getOrigin'),
      // `URL.prototype.protocol` accessors pair
      // https://url.spec.whatwg.org/#dom-url-protocol
      protocol: accessorDescriptor('getProtocol', 'setProtocol'),
      // `URL.prototype.username` accessors pair
      // https://url.spec.whatwg.org/#dom-url-username
      username: accessorDescriptor('getUsername', 'setUsername'),
      // `URL.prototype.password` accessors pair
      // https://url.spec.whatwg.org/#dom-url-password
      password: accessorDescriptor('getPassword', 'setPassword'),
      // `URL.prototype.host` accessors pair
      // https://url.spec.whatwg.org/#dom-url-host
      host: accessorDescriptor('getHost', 'setHost'),
      // `URL.prototype.hostname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hostname
      hostname: accessorDescriptor('getHostname', 'setHostname'),
      // `URL.prototype.port` accessors pair
      // https://url.spec.whatwg.org/#dom-url-port
      port: accessorDescriptor('getPort', 'setPort'),
      // `URL.prototype.pathname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-pathname
      pathname: accessorDescriptor('getPathname', 'setPathname'),
      // `URL.prototype.search` accessors pair
      // https://url.spec.whatwg.org/#dom-url-search
      search: accessorDescriptor('getSearch', 'setSearch'),
      // `URL.prototype.searchParams` getter
      // https://url.spec.whatwg.org/#dom-url-searchparams
      searchParams: accessorDescriptor('getSearchParams'),
      // `URL.prototype.hash` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hash
      hash: accessorDescriptor('getHash', 'setHash')
    });
  }

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  redefine(URLPrototype, 'toJSON', function toJSON() {
    return getInternalURLState(this).serialize();
  }, { enumerable: true });

  // `URL.prototype.toString` method
  // https://url.spec.whatwg.org/#URL-stringification-behavior
  redefine(URLPrototype, 'toString', function toString() {
    return getInternalURLState(this).serialize();
  }, { enumerable: true });

  if (NativeURL) {
    var nativeCreateObjectURL = NativeURL.createObjectURL;
    var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
    // `URL.createObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', functionBindContext(nativeCreateObjectURL, NativeURL));
    // `URL.revokeObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', functionBindContext(nativeRevokeObjectURL, NativeURL));
  }

  setToStringTag(URLConstructor, 'URL');

  _export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
    URL: URLConstructor
  });

  var Array$1 = global_1.Array;
  var $stringify = getBuiltIn('JSON', 'stringify');
  var exec = functionUncurryThis(/./.exec);
  var charAt = functionUncurryThis(''.charAt);
  var charCodeAt = functionUncurryThis(''.charCodeAt);
  var replace = functionUncurryThis(''.replace);
  var numberToString = functionUncurryThis(1.0.toString);

  var tester = /[\uD800-\uDFFF]/g;
  var low = /^[\uD800-\uDBFF]$/;
  var hi = /^[\uDC00-\uDFFF]$/;

  var fix = function (match, offset, string) {
    var prev = charAt(string, offset - 1);
    var next = charAt(string, offset + 1);
    if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
      return '\\u' + numberToString(charCodeAt(match, 0), 16);
    } return match;
  };

  var FORCED$1 = fails(function () {
    return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
      || $stringify('\uDEAD') !== '"\\udead"';
  });

  if ($stringify) {
    // `JSON.stringify` method
    // https://tc39.es/ecma262/#sec-json.stringify
    // https://github.com/tc39/proposal-well-formed-stringify
    _export({ target: 'JSON', stat: true, forced: FORCED$1 }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      stringify: function stringify(it, replacer, space) {
        for (var i = 0, l = arguments.length, args = Array$1(l); i < l; i++) args[i] = arguments[i];
        var result = functionApply($stringify, null, args);
        return typeof result == 'string' ? replace(result, tester, fix) : result;
      }
    });
  }

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

  var FUNCTION_NAME_EXISTS = functionName.EXISTS;

  var defineProperty = objectDefineProperty.f;

  var FunctionPrototype = Function.prototype;
  var functionToString = functionUncurryThis(FunctionPrototype.toString);
  var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
  var regExpExec = functionUncurryThis(nameRE.exec);
  var NAME = 'name';

  // Function instances `.name` property
  // https://tc39.es/ecma262/#sec-function-instances-name
  if (descriptors && !FUNCTION_NAME_EXISTS) {
    defineProperty(FunctionPrototype, NAME, {
      configurable: true,
      get: function () {
        try {
          return regExpExec(nameRE, functionToString(this))[1];
        } catch (error) {
          return '';
        }
      }
    });
  }

  var cadastreLayers = [{
    id: 1,
    title: 'Участок',
    reg: /^\d\d:\d+:\d+:\d+$/
  }, {
    id: 2,
    title: 'Квартал',
    reg: /^\d\d:\d+:\d+$/
  }, {
    id: 3,
    title: 'Район',
    reg: /^\d\d:\d+$/
  }, {
    id: 4,
    title: 'Округ',
    reg: /^\d\d$/
  }, {
    id: 5,
    title: 'ОКС',
    reg: /^\d\d:\d+:\d+:\d+:\d+$/
  }, {
    id: 6,
    title: 'Тер.зоны',
    reg: /^\w+$/
  }, {
    id: 7,
    title: 'Границы',
    reg: /^\w+$/
  }, {
    id: 9,
    title: 'ГОК',
    reg: /^\w+$/
  }, {
    id: 10,
    title: 'ЗОУИТ',
    reg: /^\d+\.\d+\.\d+/
  }, {
    id: 12,
    title: 'Лес',
    reg: /^\w+$/
  }, {
    id: 13,
    title: 'Красные линии',
    reg: /^\w+$/
  }, {
    id: 15,
    title: 'СРЗУ',
    reg: /^\w+$/
  }, {
    id: 16,
    title: 'ОЭЗ',
    reg: /^\w+$/
  }, {
    id: 20,
    title: 'Лесничество',
    reg: /^\w+$/
  } // /[^\d\:]/g,
  // /\d\d:\d+$/,
  // /\d\d:\d+:\d+$/,
  // /\d\d:\d+:\d+:\d+$/
  ];

  var getCadastreLayer = function getCadastreLayer(str, type) {
    // str = str.trim();
    for (var i = 0, len = cadastreLayers.length; i < len; i++) {
      var it = cadastreLayers[i];

      if (it.id === type) {
        return it;
      } // if (it.reg.exec(str)) { return it; }

    }

    return {};
  };

  var states = {
    '01': 'Ранее учтенный',
    '03': 'Условный',
    '04': 'Внесенный',
    '05': 'Временный (Удостоверен)',
    '06': 'Учтенный',
    '07': 'Снят с учета',
    '08': 'Аннулированный'
  };
  var category_types = {
    '003001000000': 'Земли сельскохозяйственного назначения',
    '003002000000': 'Земли поселений (земли населенных пунктов)',
    '003003000000': 'Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения',
    '003004000000': 'Земли особо охраняемых территорий и объектов',
    '003005000000': 'Земли лесного фонда',
    '003006000000': 'Земли водного фонда',
    '003007000000': 'Земли запаса',
    '003008000000': 'Категория не установлена'
  };

  var getCategoryType = function getCategoryType(id) {
    return category_types[id] || '';
  };

  var parcelOwnership = {
    '200': 'Собственность публично-правовых образований',
    '100': 'Частная собственность'
  };

  var getOwnership = function getOwnership(id) {
    return parcelOwnership[id] || '';
  };

  var utilizations = {
    '141000000000': 'Для размещения объектов сельскохозяйственного назначения и сельскохозяйственных угодий',
    '141001000000': 'Для сельскохозяйственного производства',
    '141001010000': 'Для использования в качестве сельскохозяйственных угодий',
    '141001020000': 'Для размещения зданий, строений, сооружений, используемых для производства, хранения и первичной переработки сельскохозяйственной продукции',
    '141001030000': 'Для размещения внутрихозяйственных дорог и коммуникаций',
    '141001040000': 'Для размещения водных объектов',
    '141002000000': 'Для ведения крестьянского (фермерского) хозяйства',
    '141003000000': 'Для ведения личного подсобного хозяйства',
    '141004000000': 'Для ведения гражданами садоводства и огородничества',
    '141005000000': 'Для ведения гражданами животноводства',
    '141006000000': 'Для дачного строительства',
    '141007000000': 'Для размещения древесно-кустарниковой растительности, предназначенной для защиты земель от воздействия негативных (вредных) природных, антропогенных и техногенных явлений',
    '141008000000': 'Для научно-исследовательских целей',
    '141009000000': 'Для учебных целей',
    '141010000000': 'Для сенокошения и выпаса скота гражданами',
    '141011000000': 'Фонд перераспределения',
    '141012000000': 'Для размещения объектов охотничьего хозяйства',
    '141013000000': 'Для размещения объектов рыбного хозяйства',
    '141014000000': 'Для иных видов сельскохозяйственного использования',
    '142000000000': 'Для размещения объектов, характерных для населенных пунктов',
    '142001000000': 'Для объектов жилой застройки',
    '142001010000': 'Для индивидуальной жилой застройки',
    '142001020000': 'Для многоквартирной застройки',
    '142001020100': 'Для малоэтажной застройки',
    '142001020200': 'Для среднеэтажной застройки',
    '142001020300': 'Для многоэтажной застройки',
    '142001020400': 'Для иных видов жилой застройки',
    '142001030000': 'Для размещения объектов дошкольного, начального, общего и среднего (полного) общего образования',
    '142001040000': 'Для размещения иных объектов, допустимых в жилых зонах и не перечисленных в классификаторе',
    '142002000000': 'Для объектов общественно-делового значения',
    '142002010000': 'Для размещения объектов социального и коммунально-бытового назначения',
    '142002020000': 'Для размещения объектов здравоохранения',
    '142002030000': 'Для размещения объектов культуры',
    '142002040000': 'Для размещения объектов торговли',
    '142002040100': 'Для размещения объектов розничной торговли',
    '142002040200': 'Для размещения объектов оптовой торговли',
    '142002050000': 'Для размещения объектов общественного питания',
    '142002060000': 'Для размещения объектов предпринимательской деятельности',
    '142002070000': 'Для размещения объектов среднего профессионального и высшего профессионального образования',
    '142002080000': 'Для размещения административных зданий',
    '142002090000': 'Для размещения научно-исследовательских учреждений',
    '142002100000': 'Для размещения культовых зданий',
    '142002110000': 'Для стоянок автомобильного транспорта',
    '142002120000': 'Для размещения объектов делового назначения, в том числе офисных центров',
    '142002130000': 'Для размещения объектов финансового назначения',
    '142002140000': 'Для размещения гостиниц',
    '142002150000': 'Для размещения подземных или многоэтажных гаражей',
    '142002160000': 'Для размещения индивидуальных гаражей',
    '142002170000': 'Для размещения иных объектов общественно-делового значения, обеспечивающих жизнь граждан',
    '142003000000': 'Для общего пользования (уличная сеть)',
    '142004000000': 'Для размещения объектов специального назначения',
    '142004010000': 'Для размещения кладбищ',
    '142004020000': 'Для размещения крематориев',
    '142004030000': 'Для размещения скотомогильников',
    '142004040000': 'Под объектами размещения отходов потребления',
    '142004050000': 'Под иными объектами специального назначения',
    '142005000000': 'Для размещения коммунальных, складских объектов',
    '142006000000': 'Для размещения объектов жилищно-коммунального хозяйства',
    '142007000000': 'Для иных видов использования, характерных для населенных пунктов',
    '143000000000': 'Для размещения объектов промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, обеспечения космической деятельности, обороны, безопасности и иного специального назначения',
    '143001000000': 'Для размещения промышленных объектов',
    '143001010000': 'Для размещения производственных и административных зданий, строений, сооружений и обслуживающих их объектов',
    '143001010100': 'Для размещения производственных зданий',
    '143001010200': 'Для размещения коммуникаций',
    '143001010300': 'Для размещения подъездных путей',
    '143001010400': 'Для размещения складских помещений',
    '143001010500': 'Для размещения административных зданий',
    '143001010600': 'Для размещения культурно-бытовых зданий',
    '143001010700': 'Для размещения иных сооружений промышленности',
    '143001020000': 'Для добычи и разработки полезных ископаемых',
    '143001030000': 'Для размещения иных объектов промышленности',
    '143002000000': 'Для размещения объектов энергетики',
    '143002010000': 'Для размещения электростанций и обслуживающих сооружений и объектов',
    '143002010100': 'Для размещения гидроэлектростанций',
    '143002010200': 'Для размещения атомных станций',
    '143002010300': 'Для размещения ядерных установок',
    '143002010400': 'Для размещения пунктов хранения ядерных материалов и радиоактивных веществ энергетики',
    '143002010500': 'Для размещения хранилищ радиоактивных отходов',
    '143002010600': 'Для размещения тепловых станций',
    '143002010700': 'Для размещения иных типов электростанций',
    '143002010800': 'Для размещения иных обслуживающих сооружений и объектов',
    '143002020000': 'Для размещения объектов электросетевого хозяйства',
    '143002020100': 'Для размещения воздушных линий электропередачи',
    '143002020200': 'Для размещения наземных сооружений кабельных линий электропередачи',
    '143002020300': 'Для размещения подстанций',
    '143002020400': 'Для размещения распределительных пунктов',
    '143002020500': 'Для размещения других сооружений и объектов электросетевого хозяйства',
    '143002030000': 'Для размещения иных объектов энергетики',
    '143003000000': 'Для размещения объектов транспорта',
    '143003010000': 'Для размещения и эксплуатации объектов железнодорожного транспорта',
    '143003010100': 'Для размещения железнодорожных путей и их конструктивных элементов',
    '143003010200': 'Для размещения полос отвода железнодорожных путей',
    '143003010300': 'Для размещения, эксплуатации, расширения и реконструкции строений, зданий, сооружений, в том числе железнодорожных вокзалов, железнодорожных станций, а также устройств и других объектов, необходимых для эксплуатации, содержания, строительства, реконструкции, ремонта, развития наземных и подземных зданий, строений, сооружений, устройств и других объектов железнодорожного транспорта',
    '143003010301': 'Для размещения железнодорожных вокзалов',
    '143003010302': 'Для размещения железнодорожных станций',
    '143003010303': 'Для размещения устройств и других объектов, необходимых для эксплуатации, содержания, строительства, реконструкции, ремонта, развития наземных и подземных зданий, строений, сооружений, устройств и других объектов железнодорожного транспорта',
    '143003020000': 'Для размещения и эксплуатации объектов автомобильного транспорта и объектов дорожного хозяйства',
    '143003020100': 'Для размещения автомобильных дорог и их конструктивных элементов',
    '143003020200': 'Для размещения полос отвода',
    '143003020300': 'Для размещения объектов дорожного сервиса в полосах отвода автомобильных дорог',
    '143003020400': 'Для размещения дорожных сооружений',
    '143003020500': 'Для размещения автовокзалов и автостанций',
    '143003020600': 'Для размещения иных объектов автомобильного транспорта и дорожного хозяйства',
    '143003030000': 'Для размещения и эксплуатации объектов морского, внутреннего водного транспорта',
    '143003030100': 'Для размещения искусственно созданных внутренних водных путей',
    '143003030200': 'Для размещения морских и речных портов, причалов, пристаней',
    '143003030300': 'Для размещения иных объектов морского, внутреннего водного транспорта',
    '143003030400': 'Для выделения береговой полосы',
    '143003040000': 'Для размещения и эксплуатации объектов воздушного транспорта',
    '143003040100': 'Для размещения аэропортов и аэродромов',
    '143003040200': 'Для размещения аэровокзалов',
    '143003040300': 'Для размещения взлетно-посадочных полос',
    '143003040400': 'Для размещения иных наземных объектов воздушного транспорта',
    '143003050000': 'Для размещения и эксплуатации объектов трубопроводного транспорта',
    '143003050100': 'Для размещения нефтепроводов',
    '143003050200': 'Для размещения газопроводов',
    '143003050300': 'Для размещения иных трубопроводов',
    '143003050400': 'Для размещения иных объектов трубопроводного транспорта',
    '143003060000': 'Для размещения и эксплуатации иных объектов транспорта',
    '143004000000': 'Для размещения объектов связи, радиовещания, телевидения, информатики',
    '143004010000': 'Для размещения эксплуатационных предприятий связи и обслуживания линий связи',
    '143004020000': 'Для размещения кабельных, радиорелейных и воздушных линий связи и линий радиофикации на трассах кабельных и воздушных линий связи и радиофикации и их охранные зоны',
    '143004030000': 'Для размещения подземных кабельных и воздушных линий связи и радиофикации и их охранные зоны',
    '143004040000': 'Для размещения наземных и подземных необслуживаемых усилительных пунктов на кабельных линиях связи и их охранные зоны',
    '143004050000': 'Для размещения наземных сооружений и инфраструктур спутниковой связи',
    '143004060000': 'Для размещения иных объектов связи, радиовещания, телевидения, информатики',
    '143005000000': 'Для размещения объектов, предназначенных для обеспечения космической деятельности',
    '143005010000': 'Для размещения космодромов, стартовых комплексов и пусковых установок',
    '143005020000': 'Для размещения командно-измерительных комплексов, центров и пунктов управления полетами космических объектов, приема, хранения и переработки информации',
    '143005030000': 'Для размещения баз хранения космической техники',
    '143005040000': 'Для размещения полигонов приземления космических объектов и взлетно-посадочных полос',
    '143005050000': 'Для размещения объектов экспериментальной базы для отработки космической техники',
    '143005060000': 'Для размещения центров и оборудования для подготовки космонавтов',
    '143005070000': 'Для размещения других наземных сооружений и техники, используемых при осуществлении космической деятельности',
    '143006000000': 'Для размещения объектов, предназначенных для обеспечения обороны и безопасности',
    '143006010000': 'Для обеспечения задач обороны',
    '143006010100': 'Для размещения военных организаций, учреждений и других объектов',
    '143006010200': 'Для дислокации войск и сил флота',
    '143006010300': 'Для проведения учений и иных мероприятий',
    '143006010400': 'Для испытательных полигонов',
    '143006010500': 'Для мест уничтожения оружия и захоронения отходов',
    '143006010600': 'Для создания запасов материальных ценностей в государственном и мобилизационном резервах (хранилища, склады и другие)',
    '143006010700': 'Для размещения иных объектов обороны',
    '143006020000': 'Для размещения объектов (территорий), обеспечивающих защиту и охрану Государственной границы Российской Федерации',
    '143006020100': 'Для обустройства и содержания инженерно-технических сооружений и заграждений',
    '143006020200': 'Для обустройства и содержания пограничных знаков',
    '143006020300': 'Для обустройства и содержания пограничных просек',
    '143006020400': 'Для обустройства и содержания коммуникаций',
    '143006020500': 'Для обустройства и содержания пунктов пропуска через Государственную границу Российской Федерации',
    '143006020600': 'Для размещения иных объектов для защиты и охраны Государственной границы Российской Федерации',
    '143006030000': 'Для размещения иных объектов обороны и безопасности',
    '143007000000': 'Для размещения иных объектов промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, обеспечения космической деятельности, обороны, безопасности и иного специального назначения',
    '144000000000': 'Для размещения особо охраняемых историко-культурных и природных объектов (территорий)',
    '144001000000': 'Для размещения особо охраняемых природных объектов (территорий)',
    '144001010000': 'Для размещения государственных природных заповедников (в том числе биосферных)',
    '144001020000': 'Для размещения государственных природных заказников',
    '144001030000': 'Для размещения национальных парков',
    '144001040000': 'Для размещения природных парков',
    '144001050000': 'Для размещения дендрологических парков',
    '144001060000': 'Для размещения ботанических садов',
    '144001070000': 'Для размещения объектов санаторного и курортного назначения',
    '144001080000': 'Территории месторождений минеральных вод, лечебных грязей, рапы лиманов и озер',
    '144001090000': 'Для традиционного природопользования',
    '144001100000': 'Для размещения иных особо охраняемых природных территорий (объектов)',
    '144002000000': 'Для размещения объектов (территорий) природоохранного назначения',
    '144003000000': 'Для размещения объектов (территорий) рекреационного назначения',
    '144003010000': 'Для размещения домов отдыха, пансионатов, кемпингов',
    '144003020000': 'Для размещения объектов физической культуры и спорта',
    '144003030000': 'Для размещения туристических баз, стационарных и палаточных туристско-оздоровительных лагерей, домов рыболова и охотника, детских туристических станций',
    '144003040000': 'Для размещения туристических парков',
    '144003050000': 'Для размещения лесопарков',
    '144003060000': 'Для размещения учебно-туристических троп и трасс',
    '144003070000': 'Для размещения детских и спортивных лагерей',
    '144003080000': 'Для размещения скверов, парков, городских садов',
    '144003090000': 'Для размещения пляжей',
    '144003100000': 'Для размещения иных объектов (территорий) рекреационного назначения',
    '144004000000': 'Для размещения объектов историко-культурного назначения',
    '144004010000': 'Для размещения объектов культурного наследия народов Российской Федерации (памятников истории и культуры), в том числе объектов археологического наследия',
    '144004020000': 'Для размещения военных и гражданских захоронений',
    '144005000000': 'Для размещения иных особо охраняемых историко-культурных и природных объектов (территорий)',
    '145000000000': 'Для размещения объектов лесного фонда',
    '145001000000': 'Для размещения лесной растительности',
    '145002000000': 'Для восстановления лесной растительности',
    '145003000000': 'Для прочих объектов лесного хозяйства',
    '146000000000': 'Для размещения объектов водного фонда',
    '146001000000': 'Под водными объектами',
    '146002000000': 'Для размещения гидротехнических сооружений',
    '146003000000': 'Для размещения иных сооружений, расположенных на водных объектах',
    '147000000000': 'Земли запаса (неиспользуемые)',
    '014001000000': 'Земли жилой застройки',
    '014001001000': 'Земли под жилыми домами многоэтажной и повышенной этажности застройки',
    '014001002000': 'Земли под домами индивидуальной жилой застройкой',
    '014001003000': 'Незанятые земли, отведенные под жилую застройку',
    '014002000000': 'Земли общественно-деловой застройки',
    '014002001000': 'Земли гаражей и автостоянок',
    '014002002000': 'Земли под объектами торговли, общественного питания, бытового обслуживания, автозаправочными и газонаполнительными станциями, предприятиями автосервиса',
    '014002003000': 'Земли учреждений и организаций народного образования, земли под объектами здравоохранения и социального обеспечения физической культуры и спорта, культуры и искусства, религиозными объектами',
    '014002004000': 'Земли под административно-управлен-ческими и общественными объектами, земли предприятий, организаций, учреждений финансирования, кредитования, страхования и пенсионного обеспечения',
    '014002005000': 'Земли под зданиями (строениями) рекреации',
    '014003000000': 'Земли под объектами промышленности',
    '014004000000': 'Земли общего пользования (геонимы в поселениях)',
    '014005000000': 'Земли под объектами транспорта, связи, инженерных коммуникаций',
    '014005001000': 'Под объектами железнодорожного транспорта',
    '014005002000': 'Под объектами автомобильного транспорта',
    '014005003000': 'Под объектами морского, внутреннего водного транспорта',
    '014005004000': 'Под объектами воздушного транспорта',
    '014005005000': 'Под объектами иного транспорта, связи, инженерных коммуникаций',
    '014006000000': 'Земли сельскохозяйственного использования',
    '014006001000': 'Земли под крестьянскими (фермерскими) хозяйствами',
    '014006002000': 'Земли под предприятиями, занимающимися сельскохозяйственным производством',
    '014006003000': 'Земли под садоводческими объединениями и индивидуальными садоводами',
    '014006004000': 'Земли под огородническими объединениями и индивидуальными огородниками',
    '014006005000': 'Земли под дачными объединениями',
    '014006006000': 'Земли под личными подсобными хозяйствами',
    '014006007000': 'Земли под служебными наделами',
    '014006008000': 'Земли оленьих пастбищ',
    '014006009000': 'Для других сельскохозяйственных целей',
    '014007000000': 'Земли под лесами в поселениях (в том числе городскими лесами), под древесно-кустарниковой растительностью, не входящей в лесной фонд (в том числе лесопарками, парками, скверами, бульварами)',
    '014008000000': 'Земли, занятые водными объектами, земли водоохранных зон водных объектов, а также земли, выделяемые для установления полос отвода и зон охраны водозаборов, гидротехнических сооружений и иных водохозяйственных сооружений, объектов.',
    '014009000000': 'Земли под военными и иными режимными объектами',
    '014010000000': 'Земли под объектами иного специального назначения',
    '014011000000': 'Земли, не вовлеченные в градостроительную или иную деятельность (земли – резерв)',
    '014012000000': 'Неопределено',
    '014013000000': 'Значение отсутствует'
  };

  var getUtilization = function getUtilization(id) {
    return utilizations[id] || '';
  };

  var cadNav = function cadNav(nm, features, id, name) {
    // const it = features[nm];
    // const id = it.attrs.id;
    var len = features.length;
    var title = name + ' (' + (nm + 1) + '/' + len + ')<br>' + id; // console.log('cadNav', it);
    // <img data-v-10b2f008="" src="https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/CadastreOriginal/MapServer/export?dpi=96&amp;f=image&amp;format=png8&amp;size=1024,768&amp;bboxSR=102100&amp;imageSR=102100&amp;transparent=true&amp;bbox=4177598.480724305,7479005.947084627,4177882.924905997,7479221.685299324&amp;layerDefs=%7B%220%22:%22ID%20IN%20('77:6:9003:8026')%22,%222%22:%22ID%20IN%20('')%22%7D&amp;layers=show:0,2" class="infowindow-image" style="margin-top: 37px;">
    // <img data-v-10b2f008="" src="https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/CadastreOriginal/MapServer/export?dpi=96&amp;f=image&amp;format=png8&amp;size=1024,768&amp;bboxSR=102100&amp;imageSR=102100&amp;transparent=true&amp;bbox=4176594.563002256,7478733.739024954,4178419.7729902538,7480814.232703805&amp;layerDefs=%7B%220%22:%22KVARTAL_ID%20=%20'77:6:9003'%20AND%20NOT%20ID%20=%20'1'%22,%222%22:%22KVARTAL_ID%20=%20'77:6:9003'%20AND%20NOT%20ID%20=%20'77:6:9003:8026'%22,%224%22:%22ID%20IN%20('77:6:9003')%22,%221%22:%22ID%20IN%20('77:6:9003:8026')%22%7D&amp;layers=show:1,0,2,4" class="infowindow-image" style="margin-top: 37px;">
    // https://pkk.rosreestr.ru/#/search/55.59756057529083,37.526718293804/17/@5w3tqxnc7?text=77%3A6%3A9011%3A1003&type=1&nameTab&indexTab&opened=77%3A6%3A9011%3A1003
    // https://pkk.rosreestr.ru/#/search/55.59756057529083,37.526718293804/17/@5w3tqxnc7?text=77%3A6%3A9011%3A1003&type=1&nameTab&indexTab&opened=77%3A6%3A9011%3A1003
    // https://pkk.rosreestr.ru/#/search/55.59958494444303,37.529283264270816/18/@5w3tqxnc7?text=77%3A6%3A9003%3A8026&type=1&nameTab&indexTab&opened=77%3A6%3A9003%3A8026
    // <div class="plans"><a href="https://pkk5.kosmosnimki.ru/plan.html?id=40:20:100512:10&amp;type=1" target="_blank">План ЗУ</a> <a href="https://pkk5.kosmosnimki.ru/plan.html?id=40:20:100512:10&amp;parent=40:20:100512&amp;type=2" target="_blank">План КК</a>
    // </div>
    // <span class="cadCount">УЧАСТОК (1/4)<br>40:20:100512:10
    // let lStyle = nm ? '' : ' style="visibility: hidden;"';
    // let rStyle = nm < features.length -1 ? '' : ' style="visibility: hidden;"';

    return "<div class=\"cadNav\">\n\t\t\t\t<span class=\"cadLeft\"".concat(nm ? '' : ' style="visibility: hidden;"', ">&lt;</span>\n\t\t\t\t<span class=\"cadCount\">").concat(title, "</span>\n\t\t\t\t<span class=\"cadRight\"").concat(nm < features.length - 1 ? '' : ' style="visibility: hidden;"', ">&gt;</span>\n\t\t\t</div>");
  };

  var featureCont = function featureCont(feature, title) {
    var attrs = feature.attrs;
    var address = attrs.address || attrs.desc || '';
    var name = attrs.name || attrs.name_zone || '';
    var date = attrs.cad_record_date || attrs.rec_date || '';
    var trs = [];
    trs.push('<tr><td class="first">Тип:</td><td>' + title + '</td></tr>');

    if (attrs.cn) {
      trs.push('<tr><td class="first">Кад.номер:</td><td>' + attrs.cn + '</td></tr>');
    } // plans += '<a href="' + proxy +  'plan.html?id=' + attrs.id + '&type=1" target="_blank">План ЗУ</a>' ;


    if (attrs.kvartal) {
      trs.push('<tr><td class="first">Кад.квартал:</td><td>' + attrs.kvartal_cn + '</td></tr>'); // plans += ' <a href="' + proxy + 'plan.html?id=' + attrs.id + '&parent=' + attrs.kvartal + '&type=2" target="_blank">План КК</a>';
    }

    if (attrs.statecd) {
      trs.push('<tr><td class="first">Статус:</td><td>' + states[attrs.statecd] + '</td></tr>');
    }

    if (name) {
      trs.push('<tr><td class="first">Наименование:</td><td>' + name + '</td></tr>');
    }

    if (attrs.cad_cost) {
      trs.push('<tr><td class="first">Кадастровая стоимость:</td><td>' + attrs.cad_cost + '</td></tr>');
    }

    if (attrs.area_value) {
      trs.push('<tr><td class="first">Общая площадь:</td><td>' + attrs.area_value + '</td></tr>');
    }

    if (address) {
      trs.push('<tr><td class="first">Адрес:</td><td>' + address + '</td></tr>');
    }

    if (attrs.category_type) {
      trs.push('<tr><td class="first">Категория земель:</td><td>' + getCategoryType(attrs.category_type) + '</td></tr>');
    }

    if (attrs.fp) {
      trs.push('<tr><td class="first">Форма собственности:</td><td>' + getOwnership(attrs.fp) + '</td></tr>');
    }

    if (attrs.util_code) {
      trs.push('<tr><td class="first">Разрешенное использование:</td><td>' + getUtilization(attrs.util_code) + '</td></tr>');
    }

    if (attrs.util_by_doc) {
      trs.push('<tr><td class="first">по документу:</td><td>' + attrs.util_by_doc + '</td></tr>');
    }

    if (date) {
      trs.push('<tr><td class="first">Дата изменения сведений в ГКН:</td><td>' + date + '</td></tr>');
    }

    return trs.join('\n');
  };

  var Utils = {
    getContent: function getContent(feature, nm, features) {
      var it = features[nm];
      var id = it.attrs.id;
      var cLayer = getCadastreLayer(id, it.type);
      var isOperHiden = location.search.indexOf('skipGeo=true') !== -1 || !window.OffscreenCanvas ? ' hidden' : '';
      console.log('isOperHiden', isOperHiden);
      return "\n\t\t\t<div class=\"cadItem\">\n\t\t\t\t".concat(cadNav(nm, features, id, cLayer.title), "\n\t\t\t\t<div class=\"featureCont\">\n\t\t\t\t\t<table class=\"table\"><tbody>\n\t\t\t\t\t").concat(featureCont(feature, cLayer.title), "\n\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"operCont").concat(isOperHiden, "\">\n\t\t\t\t\t<button class=\"ShowObject\">\u0412\u044B\u0434\u0435\u043B\u0438\u0442\u044C \u0433\u0440\u0430\u043D\u0438\u0446\u0443</button>\n\t\t\t\t\t<a class=\"exportIcon notVisible\" target=\"_blank\" href=\"\" title=\"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0432 GeoJSON\"></a>\n\t\t\t\t\t<span class=\"search notVisible\">\u041F\u043E\u0438\u0441\u043A \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438...</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t");
    }
  };

  var Config = {
    pkkPrefix: 'https://pkk.rosreestr.ru/',
    tilesPrefix: 'https://sveltejs.ru/'
  };

  var popup;
  var currNum = 0;
  var currGeo;
  var currGeoJson;

  var setNum = function setNum(delta, features) {
    var nextNum = currNum + delta;
    var it = features[nextNum];

    if (it) {
      currNum = nextNum;
      popup.setContent(getContent(it, features));
      toggleSearch(true);
      var dm = popup._map.options.dataManager;
      dm.postMessage({
        cmd: 'feature',
        prefix: Config.pkkPrefix,
        nm: currNum,
        id: it.attrs.id,
        type: it.type
      });
    }
  };

  var setBoundsView = function setBoundsView(it) {
    var crs = leafletSrc.Projection.SphericalMercator;
    var lBounds = leafletSrc.latLngBounds(crs.unproject(leafletSrc.point(it.extent.xmin, it.extent.ymin)), crs.unproject(leafletSrc.point(it.extent.xmax, it.extent.ymax)));
    var map = popup._map;
    var dm = map.options.dataManager;

    var onViewreset = function onViewreset() {
      var bounds = map.getPixelBounds();
      var ne = map.options.crs.project(map.unproject(bounds.getTopRight()));
      var sw = map.options.crs.project(map.unproject(bounds.getBottomLeft()));
      var ids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      var pars = {
        size: [bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y].join(','),
        bbox: [sw.x, sw.y, ne.x, ne.y].join(','),
        layers: 'show:' + ids.join(','),
        layerDefs: '{' + ids.map(function (nm) {
          return '\"' + nm + '\":\"ID = \'' + it.attrs.id + '\'"';
        }).join(',') + '}',
        format: 'png32',
        dpi: 96,
        transparent: 'true',
        imageSR: 102100,
        bboxSR: 102100
      };
      var imageUrl = Config.pkkPrefix + 'arcgis/rest/services/PKK6/';

      if (it.type === 10) {
        imageUrl += 'ZONESSelected';
      } else if (it.type === 6) {
        imageUrl += 'ZONESSelected';
      } else if (it.type === 7) {
        imageUrl += 'BordersGKNSelected';
      } else {
        imageUrl += 'CadastreSelected';
      }

      imageUrl += '/MapServer/export?f=image&cross=' + Math.random();

      for (var key in pars) {
        imageUrl += '&' + key + '=' + pars[key];
      }

      imageUrl = encodeURI(imageUrl);

      if (popup._overlay) {
        map.removeLayer(popup._overlay);
      }

      popup._overlay = new leafletSrc.ImageOverlay(imageUrl, map.getBounds(), {
        opacity: 0.5,
        crossOrigin: '*',
        clickable: true
      }).on('error', function (ev) {
        var img = ev.target._image;

        if (img.src.indexOf('retr=1') === -1) {
          img.src = imageUrl + '&retr=1';
        }
      }).on('load', function (ev) {
        if (!map.skipGeo) {
          var src = ev.currentTarget;
          var w = src.width,
              h = src.height;
          var ctx = new OffscreenCanvas(w, h).getContext('2d');
          ctx.drawImage(src, 0, 0, w, h);
          var imgData = ctx.getImageData(0, 0, w, h);
          dm.postMessage({
            cmd: 'msqr',
            pixels: imgData.data.buffer,
            width: w,
            height: h,
            channels: 4,
            it: it
          }, [imgData.data.buffer]);
        }
      }).addTo(map);
    };

    map.once('moveend', function () {
      setTimeout(onViewreset, 350);
    }); // map.once('moveend', () => { L.Util.requestAnimFrame(onViewreset)} );
    // map.once('moveend', onViewreset);

    map.fitBounds(lBounds, {
      reset: true
    });
  };

  var setEvents = function setEvents(pNode, features) {
    var exportIcon = pNode.getElementsByClassName('exportIcon')[0];

    if (exportIcon) {
      leafletSrc.DomEvent.on(exportIcon, 'click', function () {
        exportIcon.setAttribute('download', currGeoJson.properties.attrs.id + '.geojson');
        exportIcon.setAttribute('href', window.URL.createObjectURL(new Blob([JSON.stringify(currGeoJson, null, '\t')], {
          type: 'text/json;charset=utf-8;'
        })));
      });
    }

    var cadRight = pNode.getElementsByClassName('cadRight')[0];

    if (cadRight) {
      leafletSrc.DomEvent.on(cadRight, 'click', function () {
        setNum(1, features);
      });
    }

    var cadLeft = pNode.getElementsByClassName('cadLeft')[0];

    if (cadLeft) {
      leafletSrc.DomEvent.on(cadLeft, 'click', function () {
        setNum(-1, features);
      });
    }

    var showObject = pNode.getElementsByClassName('ShowObject')[0];

    if (showObject) {
      leafletSrc.DomEvent.on(showObject, 'click', function (ev) {
        toggleSearch(true);
        leafletSrc.DomEvent.stopPropagation(ev);
        setBoundsView(features[currNum]);
      });
    }
  };

  var getContent = function getContent(feature, features) {
    var node = leafletSrc.DomUtil.create('div', 'cadInfo');
    node.innerHTML = Utils.getContent(feature, currNum, features);
    setEvents(node, features);
    return node;
  };

  var getGeoJson = function getGeoJson(pathPoints, it) {
    var map = popup._map;
    var rings = pathPoints.map(function (it) {
      var ring = it.map(function (p) {
        return leafletSrc.point(p.x, p.y);
      });
      ring = leafletSrc.LineUtil.simplify(ring, 1);
      return ring.map(function (p) {
        return map.containerPointToLatLng(p);
      });
    });
    var search = popup.getContent().getElementsByClassName('search')[0];

    if (search) {
      leafletSrc.DomUtil.addClass(search, 'notVisible');
    }

    if (rings.length) {
      toggleSearch(false);

      if (map.options.clearGeoJson && currGeo && currGeo._map) {
        map.removeLayer(currGeo);

        if (popup._overlay) {
          map.removeLayer(popup._overlay);
        }
      }

      currGeo = leafletSrc.polygon(rings.map(function (r) {
        return [r];
      }));
      map.addLayer(currGeo);
      currGeoJson = currGeo.toGeoJSON();
      currGeoJson.properties = it;

      if (map.options.geoJsonDetected) {
        map.options.geoJsonDetected(currGeoJson);
      }

      return currGeoJson;
    }
  };

  var toggleSearch = function toggleSearch(flag) {
    var pNode = popup.getContent();
    var search = pNode.getElementsByClassName('search')[0];
    var exportIcon = pNode.getElementsByClassName('exportIcon')[0];

    if (search && exportIcon) {
      if (flag) {
        leafletSrc.DomUtil.removeClass(search, 'notVisible');
        leafletSrc.DomUtil.addClass(exportIcon, 'notVisible');
      } else {
        leafletSrc.DomUtil.addClass(search, 'notVisible');
        leafletSrc.DomUtil.removeClass(exportIcon, 'notVisible');
      }
    }
  };

  var itemsArr;
  var Popup = {
    getDataManager: function getDataManager() {
      // const isTransferControlToOffscreen = L.DomUtil.create('canvas', '').transferControlToOffscreen;
      // const dm = isTransferControlToOffscreen ? new Worker("dataManager.js") : null;
      var dm = new Worker("dataManager.js");

      dm.onmessage = function (msg) {
        var data = msg.data;
        var cmd = data.cmd;
            data.url;
            var feature = data.feature,
            items = data.items;
            data.coords;
            data.pcoords;
            data.prefix;
            data.point;
            data.nm;

        switch (cmd) {
          case 'features':
            itemsArr = items.arr;

            if (feature) {
              popup.setContent(getContent(feature, itemsArr));
            }

            break;

          case 'feature':
            popup.setContent(getContent(feature, itemsArr));
            break;

          case 'tile':
            // tile отрисован
            break;

          case 'msqr':
            getGeoJson(data.pathPoints, data.it);
            break;

          default:
            console.warn('Warning: Bad command ', cmd);
            break;
        }
      };

      return dm;
    },
    clickOnMap: function clickOnMap(ev) {
      var latlng = ev.latlng;
      var map = ev.target;
      currNum = 0;
      popup = leafletSrc.popup({
        minWidth: 350,
        className: 'cadasterPopup'
      }).setLatLng(latlng).setContent('<div class="cadInfo">Поиск информации...</div>').openOn(map);
      var dm = map.options.dataManager;
      dm.postMessage({
        cmd: 'features',
        prefix: Config.pkkPrefix,
        point: latlng.lat + '+' + latlng.lng
      });
      return popup;
    }
  };

  window.addEventListener('load', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var map, zoomHook;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            map = leafletSrc.map('map', {
              clearGeoJson: true,
              geoJsonDetected: function geoJsonDetected(geoJson) {
                console.log('geoJsonDetected', geoJson);
              },
              skipGeo: location.search.indexOf('skipGeo=true') !== -1 || !window.OffscreenCanvas,
              dataManager: Popup.getDataManager()
            }).setView([55.64, 37.52], 18).on('click', Popup.clickOnMap);

            zoomHook = function zoomHook(coords) {
              var tp = {
                z: coords.z,
                x: coords.x,
                y: coords.y
              };
              var d = tp.z - 12;

              if (d > 0) {
                tp.z = 12;
                tp.scale = Math.pow(2, d);
                tp.x = Math.floor(tp.x / tp.scale);
                tp.y = Math.floor(tp.y / tp.scale);
              } // console.log('ddd', coords, tp);


              return tp;
            };
            leafletSrc.control.layers({
              osm: leafletSrc.tileLayer(Config.tilesPrefix + 'tiles/om/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map)
            }, {
              cadGroup: leafletSrc.layerGroup([new PbfLayer({
                // crossOrigin: '*',
                // maxNativeZoom: 11,
                maxZoom: 14,
                dataManager: map.options.dataManager,
                zoomHook: zoomHook,
                template: Config.tilesPrefix + 'tiles/pkk/{z}/{y}/{x}.pbf' // template: prefix + 'arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=2'

              }),
              /*
              new PbfLayer({
              	// zoomHook: zoomHook,
              	maxZoom: 22,
              	minZoom: 11,
              	template: prefix + 'arcgis/rest/services/Hosted/vt_anno_light/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=2'
              })
              ,
              new PbfLayer({
              	zoomHook: zoomHook,
              	template: prefix + 'arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=2'
              })
              	,
              */
              leafletSrc.tileLayer.wms(Config.pkkPrefix + 'arcgis/rest/services/PKK6/CadastreObjects/MapServer/export', {
                attribution: "ПКК © Росреестр",
                tileSize: 1024,
                layers: "show:30,27,24,23,22",
                format: "PNG32",
                "imageSR": 102100,
                bboxSR: 102100,
                f: "image",
                transparent: true,
                size: "1024,1024",
                maxZoom: 22,
                minZoom: 15 // clickable:true

              })]).on('remove', function () {
                map._container.style.cursor = '';
              }).on('add', function () {
                map._container.style.cursor = 'help';
              })
            }).addTo(map); // const search = L.control.search({
            // }).addTo(map);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));

})();
//# sourceMappingURL=main.js.map
