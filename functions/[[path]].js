var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 == "object" || typeof from2 == "function")
    for (let key of __getOwnPropNames(from2))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports) {
    "use strict";
    exports.parse = parse2;
    exports.serialize = serialize2;
    var decode = decodeURIComponent, encode = encodeURIComponent, fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse2(str, options) {
      if (typeof str != "string")
        throw new TypeError("argument str must be a string");
      for (var obj = {}, opt = options || {}, pairs = str.split(";"), dec = opt.decode || decode, i5 = 0; i5 < pairs.length; i5++) {
        var pair = pairs[i5], index = pair.indexOf("=");
        if (!(index < 0)) {
          var key = pair.substring(0, index).trim();
          if (obj[key] == null) {
            var val = pair.substring(index + 1, pair.length).trim();
            val[0] === '"' && (val = val.slice(1, -1)), obj[key] = tryDecode(val, dec);
          }
        }
      }
      return obj;
    }
    function serialize2(name, val, options) {
      var opt = options || {}, enc = opt.encode || encode;
      if (typeof enc != "function")
        throw new TypeError("option encode is invalid");
      if (!fieldContentRegExp.test(name))
        throw new TypeError("argument name is invalid");
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value))
        throw new TypeError("argument val is invalid");
      var str = name + "=" + value;
      if (opt.maxAge != null) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge))
          throw new TypeError("option maxAge is invalid");
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain))
          throw new TypeError("option domain is invalid");
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path))
          throw new TypeError("option path is invalid");
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        if (typeof opt.expires.toUTCString != "function")
          throw new TypeError("option expires is invalid");
        str += "; Expires=" + opt.expires.toUTCString();
      }
      if (opt.httpOnly && (str += "; HttpOnly"), opt.secure && (str += "; Secure"), opt.sameSite) {
        var sameSite = typeof opt.sameSite == "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case !0:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch {
        return str;
      }
    }
  }
});

// node_modules/@remix-run/server-runtime/esm/cookies.js
async function encodeCookieValue(sign, value, secrets) {
  let encoded = encodeData(value);
  return secrets.length > 0 && (encoded = await sign(encoded, secrets[0])), encoded;
}
async function decodeCookieValue(unsign, value, secrets) {
  if (secrets.length > 0) {
    for (let secret of secrets) {
      let unsignedValue = await unsign(value, secret);
      if (unsignedValue !== !1)
        return decodeData(unsignedValue);
    }
    return null;
  }
  return decodeData(value);
}
function encodeData(value) {
  return btoa(JSON.stringify(value));
}
function decodeData(value) {
  try {
    return JSON.parse(atob(value));
  } catch {
    return {};
  }
}
var import_cookie, createCookieFactory, isCookie, init_cookies = __esm({
  "node_modules/@remix-run/server-runtime/esm/cookies.js"() {
    import_cookie = __toESM(require_cookie());
    createCookieFactory = ({
      sign,
      unsign
    }) => (name, cookieOptions = {}) => {
      let {
        secrets,
        ...options
      } = {
        secrets: [],
        path: "/",
        ...cookieOptions
      };
      return {
        get name() {
          return name;
        },
        get isSigned() {
          return secrets.length > 0;
        },
        get expires() {
          return typeof options.maxAge < "u" ? new Date(Date.now() + options.maxAge * 1e3) : options.expires;
        },
        async parse(cookieHeader, parseOptions) {
          if (!cookieHeader)
            return null;
          let cookies = (0, import_cookie.parse)(cookieHeader, {
            ...options,
            ...parseOptions
          });
          return name in cookies ? cookies[name] === "" ? "" : await decodeCookieValue(unsign, cookies[name], secrets) : null;
        },
        async serialize(value, serializeOptions) {
          return (0, import_cookie.serialize)(name, value === "" ? "" : await encodeCookieValue(sign, value, secrets), {
            ...options,
            ...serializeOptions
          });
        }
      };
    }, isCookie = (object) => object != null && typeof object.name == "string" && typeof object.isSigned == "boolean" && typeof object.parse == "function" && typeof object.serialize == "function";
  }
});

// node_modules/@remix-run/server-runtime/esm/responses.js
function isResponse(value) {
  return value != null && typeof value.status == "number" && typeof value.statusText == "string" && typeof value.headers == "object" && typeof value.body < "u";
}
function isRedirectResponse(response) {
  return redirectStatusCodes.has(response.status);
}
function isCatchResponse(response) {
  return response.headers.get("X-Remix-Catch") != null;
}
var json, redirect, redirectStatusCodes, init_responses = __esm({
  "node_modules/@remix-run/server-runtime/esm/responses.js"() {
    json = (data, init2 = {}) => {
      let responseInit = init2;
      typeof init2 == "number" && (responseInit = {
        status: init2
      });
      let headers = new Headers(responseInit.headers);
      return headers.has("Content-Type") || headers.set("Content-Type", "application/json; charset=utf-8"), new Response(JSON.stringify(data), {
        ...responseInit,
        headers
      });
    }, redirect = (url, init2 = 302) => {
      let responseInit = init2;
      typeof responseInit == "number" ? responseInit = {
        status: responseInit
      } : typeof responseInit.status > "u" && (responseInit.status = 302);
      let headers = new Headers(responseInit.headers);
      return headers.set("Location", url), new Response(null, {
        ...responseInit,
        headers
      });
    };
    redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
  }
});

// node_modules/@remix-run/server-runtime/esm/data.js
async function callRouteAction({
  loadContext,
  match,
  request
}) {
  let action = match.route.module.action;
  if (!action) {
    let response = new Response(null, {
      status: 405
    });
    return response.headers.set("X-Remix-Catch", "yes"), response;
  }
  let result;
  try {
    result = await action({
      request: stripDataParam(stripIndexParam(request)),
      context: loadContext,
      params: match.params
    });
  } catch (error) {
    if (!isResponse(error))
      throw error;
    isRedirectResponse(error) || error.headers.set("X-Remix-Catch", "yes"), result = error;
  }
  if (result === void 0)
    throw new Error(`You defined an action for route "${match.route.id}" but didn't return anything from your \`action\` function. Please return a value or \`null\`.`);
  return isResponse(result) ? result : json(result);
}
async function callRouteLoader({
  loadContext,
  match,
  request
}) {
  let loader = match.route.module.loader;
  if (!loader)
    throw new Error(`You made a ${request.method} request to ${request.url} but did not provide a \`loader\` for route "${match.route.id}", so there is no way to handle the request.`);
  let result;
  try {
    result = await loader({
      request: stripDataParam(stripIndexParam(request.clone())),
      context: loadContext,
      params: match.params
    });
  } catch (error) {
    if (!isResponse(error))
      throw error;
    isRedirectResponse(error) || error.headers.set("X-Remix-Catch", "yes"), result = error;
  }
  if (result === void 0)
    throw new Error(`You defined a loader for route "${match.route.id}" but didn't return anything from your \`loader\` function. Please return a value or \`null\`.`);
  return isResponse(result) ? result : json(result);
}
function stripIndexParam(request) {
  let url = new URL(request.url), indexValues = url.searchParams.getAll("index");
  url.searchParams.delete("index");
  let indexValuesToKeep = [];
  for (let indexValue of indexValues)
    indexValue && indexValuesToKeep.push(indexValue);
  for (let toKeep of indexValuesToKeep)
    url.searchParams.append("index", toKeep);
  return new Request(url.href, request);
}
function stripDataParam(request) {
  let url = new URL(request.url);
  return url.searchParams.delete("_data"), new Request(url.href, request);
}
function extractData(response) {
  let contentType = response.headers.get("Content-Type");
  return contentType && /\bapplication\/json\b/.test(contentType) ? response.json() : response.text();
}
var init_data = __esm({
  "node_modules/@remix-run/server-runtime/esm/data.js"() {
    init_responses();
  }
});

// node_modules/@remix-run/server-runtime/esm/entry.js
function createEntryMatches(matches, routes2) {
  return matches.map((match) => ({
    params: match.params,
    pathname: match.pathname,
    route: routes2[match.route.id]
  }));
}
function createEntryRouteModules(manifest) {
  return Object.keys(manifest).reduce((memo, routeId) => (memo[routeId] = manifest[routeId].module, memo), {});
}
var init_entry = __esm({
  "node_modules/@remix-run/server-runtime/esm/entry.js"() {
  }
});

// node_modules/@remix-run/server-runtime/esm/errors.js
async function serializeError(error) {
  return {
    message: error.message,
    stack: error.stack
  };
}
var init_errors = __esm({
  "node_modules/@remix-run/server-runtime/esm/errors.js"() {
  }
});

// node_modules/set-cookie-parser/lib/set-cookie.js
var require_set_cookie = __commonJS({
  "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
    "use strict";
    var defaultParseOptions = {
      decodeValues: !0,
      map: !1,
      silent: !1
    };
    function isNonEmptyString(str) {
      return typeof str == "string" && !!str.trim();
    }
    function parseString(setCookieValue, options) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString), nameValue = parts.shift().split("="), name = nameValue.shift(), value = nameValue.join("=");
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      try {
        value = options.decodeValues ? decodeURIComponent(value) : value;
      } catch (e10) {
        console.error(
          "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
          e10
        );
      }
      var cookie = {
        name,
        value
      };
      return parts.forEach(function(part) {
        var sides = part.split("="), key = sides.shift().trimLeft().toLowerCase(), value2 = sides.join("=");
        key === "expires" ? cookie.expires = new Date(value2) : key === "max-age" ? cookie.maxAge = parseInt(value2, 10) : key === "secure" ? cookie.secure = !0 : key === "httponly" ? cookie.httpOnly = !0 : key === "samesite" ? cookie.sameSite = value2 : cookie[key] = value2;
      }), cookie;
    }
    function parse2(input, options) {
      if (options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions, !input)
        return options.map ? {} : [];
      if (input.headers && input.headers["set-cookie"])
        input = input.headers["set-cookie"];
      else if (input.headers) {
        var sch = input.headers[Object.keys(input.headers).find(function(key) {
          return key.toLowerCase() === "set-cookie";
        })];
        !sch && input.headers.cookie && !options.silent && console.warn(
          "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
        ), input = sch;
      }
      if (Array.isArray(input) || (input = [input]), options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions, options.map) {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
          var cookie = parseString(str, options);
          return cookies2[cookie.name] = cookie, cookies2;
        }, cookies);
      } else
        return input.filter(isNonEmptyString).map(function(str) {
          return parseString(str, options);
        });
    }
    function splitCookiesString2(cookiesString) {
      if (Array.isArray(cookiesString))
        return cookiesString;
      if (typeof cookiesString != "string")
        return [];
      var cookiesStrings = [], pos = 0, start, ch, lastComma, nextStart, cookiesSeparatorFound;
      function skipWhitespace() {
        for (; pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos)); )
          pos += 1;
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        return ch = cookiesString.charAt(pos), ch !== "=" && ch !== ";" && ch !== ",";
      }
      for (; pos < cookiesString.length; ) {
        for (start = pos, cookiesSeparatorFound = !1; skipWhitespace(); )
          if (ch = cookiesString.charAt(pos), ch === ",") {
            for (lastComma = pos, pos += 1, skipWhitespace(), nextStart = pos; pos < cookiesString.length && notSpecialChar(); )
              pos += 1;
            pos < cookiesString.length && cookiesString.charAt(pos) === "=" ? (cookiesSeparatorFound = !0, pos = nextStart, cookiesStrings.push(cookiesString.substring(start, lastComma)), start = pos) : pos = lastComma + 1;
          } else
            pos += 1;
        (!cookiesSeparatorFound || pos >= cookiesString.length) && cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
      }
      return cookiesStrings;
    }
    module.exports = parse2;
    module.exports.parse = parse2;
    module.exports.parseString = parseString;
    module.exports.splitCookiesString = splitCookiesString2;
  }
});

// node_modules/@remix-run/server-runtime/esm/headers.js
function getDocumentHeaders(build, matches, routeLoaderResponses, actionResponse) {
  return matches.reduce((parentHeaders, match, index) => {
    let routeModule = build.routes[match.route.id].module, routeLoaderResponse = routeLoaderResponses[match.route.id], loaderHeaders = routeLoaderResponse ? routeLoaderResponse.headers : new Headers(), actionHeaders = actionResponse ? actionResponse.headers : new Headers(), headers = new Headers(routeModule.headers ? typeof routeModule.headers == "function" ? routeModule.headers({
      loaderHeaders,
      parentHeaders,
      actionHeaders
    }) : routeModule.headers : void 0);
    return prependCookies(actionHeaders, headers), prependCookies(loaderHeaders, headers), prependCookies(parentHeaders, headers), headers;
  }, new Headers());
}
function prependCookies(parentHeaders, childHeaders) {
  let parentSetCookieString = parentHeaders.get("Set-Cookie");
  parentSetCookieString && (0, import_set_cookie_parser.splitCookiesString)(parentSetCookieString).forEach((cookie) => {
    childHeaders.append("Set-Cookie", cookie);
  });
}
var import_set_cookie_parser, init_headers = __esm({
  "node_modules/@remix-run/server-runtime/esm/headers.js"() {
    import_set_cookie_parser = __toESM(require_set_cookie());
  }
});

// node_modules/@remix-run/server-runtime/esm/mode.js
function isServerMode(value) {
  return value === ServerMode.Development || value === ServerMode.Production || value === ServerMode.Test;
}
var ServerMode, init_mode = __esm({
  "node_modules/@remix-run/server-runtime/esm/mode.js"() {
    (function(ServerMode2) {
      ServerMode2.Development = "development", ServerMode2.Production = "production", ServerMode2.Test = "test";
    })(ServerMode || (ServerMode = {}));
  }
});

// node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "node_modules/object-assign/index.js"(exports, module) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols, hasOwnProperty2 = Object.prototype.hasOwnProperty, propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val == null)
        throw new TypeError("Object.assign cannot be called with null or undefined");
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign)
          return !1;
        var test1 = new String("abc");
        if (test1[5] = "de", Object.getOwnPropertyNames(test1)[0] === "5")
          return !1;
        for (var test2 = {}, i5 = 0; i5 < 10; i5++)
          test2["_" + String.fromCharCode(i5)] = i5;
        var order2 = Object.getOwnPropertyNames(test2).map(function(n6) {
          return test2[n6];
        });
        if (order2.join("") !== "0123456789")
          return !1;
        var test3 = {};
        return "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        }), Object.keys(Object.assign({}, test3)).join("") === "abcdefghijklmnopqrst";
      } catch {
        return !1;
      }
    }
    module.exports = shouldUseNative() ? Object.assign : function(target, source) {
      for (var from2, to = toObject(target), symbols, s6 = 1; s6 < arguments.length; s6++) {
        from2 = Object(arguments[s6]);
        for (var key in from2)
          hasOwnProperty2.call(from2, key) && (to[key] = from2[key]);
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from2);
          for (var i5 = 0; i5 < symbols.length; i5++)
            propIsEnumerable.call(from2, symbols[i5]) && (to[symbols[i5]] = from2[symbols[i5]]);
        }
      }
      return to;
    };
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports) {
    "use strict";
    (function() {
      "use strict";
      var _assign = require_object_assign(), ReactVersion = "17.0.2", REACT_ELEMENT_TYPE = 60103, REACT_PORTAL_TYPE = 60106;
      exports.Fragment = 60107, exports.StrictMode = 60108, exports.Profiler = 60114;
      var REACT_PROVIDER_TYPE = 60109, REACT_CONTEXT_TYPE = 60110, REACT_FORWARD_REF_TYPE = 60112;
      exports.Suspense = 60113;
      var REACT_SUSPENSE_LIST_TYPE = 60120, REACT_MEMO_TYPE = 60115, REACT_LAZY_TYPE = 60116, REACT_BLOCK_TYPE = 60121, REACT_SERVER_BLOCK_TYPE = 60122, REACT_FUNDAMENTAL_TYPE = 60117, REACT_SCOPE_TYPE = 60119, REACT_OPAQUE_ID_TYPE = 60128, REACT_DEBUG_TRACING_MODE_TYPE = 60129, REACT_OFFSCREEN_TYPE = 60130, REACT_LEGACY_HIDDEN_TYPE = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var symbolFor = Symbol.for;
        REACT_ELEMENT_TYPE = symbolFor("react.element"), REACT_PORTAL_TYPE = symbolFor("react.portal"), exports.Fragment = symbolFor("react.fragment"), exports.StrictMode = symbolFor("react.strict_mode"), exports.Profiler = symbolFor("react.profiler"), REACT_PROVIDER_TYPE = symbolFor("react.provider"), REACT_CONTEXT_TYPE = symbolFor("react.context"), REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref"), exports.Suspense = symbolFor("react.suspense"), REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list"), REACT_MEMO_TYPE = symbolFor("react.memo"), REACT_LAZY_TYPE = symbolFor("react.lazy"), REACT_BLOCK_TYPE = symbolFor("react.block"), REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block"), REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental"), REACT_SCOPE_TYPE = symbolFor("react.scope"), REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id"), REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode"), REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen"), REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
      }
      var MAYBE_ITERATOR_SYMBOL = typeof Symbol == "function" && Symbol.iterator, FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable != "object")
          return null;
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        return typeof maybeIterator == "function" ? maybeIterator : null;
      }
      var ReactCurrentDispatcher = {
        current: null
      }, ReactCurrentBatchConfig = {
        transition: 0
      }, ReactCurrentOwner = {
        current: null
      }, ReactDebugCurrentFrame = {}, currentExtraStackFrame = null;
      function setExtraStackFrame(stack) {
        currentExtraStackFrame = stack;
      }
      ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
        currentExtraStackFrame = stack;
      }, ReactDebugCurrentFrame.getCurrentStack = null, ReactDebugCurrentFrame.getStackAddendum = function() {
        var stack = "";
        currentExtraStackFrame && (stack += currentExtraStackFrame);
        var impl = ReactDebugCurrentFrame.getCurrentStack;
        return impl && (stack += impl() || ""), stack;
      };
      var IsSomeRendererActing = {
        current: !1
      }, ReactSharedInternals = {
        ReactCurrentDispatcher,
        ReactCurrentBatchConfig,
        ReactCurrentOwner,
        IsSomeRendererActing,
        assign: _assign
      };
      ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
      function warn(format2) {
        {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)
            args[_key - 1] = arguments[_key];
          printWarning("warn", format2, args);
        }
      }
      function error(format2) {
        {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++)
            args[_key2 - 1] = arguments[_key2];
          printWarning("error", format2, args);
        }
      }
      function printWarning(level, format2, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame, stack = ReactDebugCurrentFrame2.getStackAddendum();
          stack !== "" && (format2 += "%s", args = args.concat([stack]));
          var argsWithFormat = args.map(function(item) {
            return "" + item;
          });
          argsWithFormat.unshift("Warning: " + format2), Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var didWarnStateUpdateForUnmountedComponent = {};
      function warnNoop(publicInstance, callerName) {
        {
          var _constructor = publicInstance.constructor, componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass", warningKey = componentName + "." + callerName;
          if (didWarnStateUpdateForUnmountedComponent[warningKey])
            return;
          error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName), didWarnStateUpdateForUnmountedComponent[warningKey] = !0;
        }
      }
      var ReactNoopUpdateQueue = {
        isMounted: function(publicInstance) {
          return !1;
        },
        enqueueForceUpdate: function(publicInstance, callback, callerName) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance, partialState, callback, callerName) {
          warnNoop(publicInstance, "setState");
        }
      }, emptyObject = {};
      Object.freeze(emptyObject);
      function Component(props, context, updater) {
        this.props = props, this.context = context, this.refs = emptyObject, this.updater = updater || ReactNoopUpdateQueue;
      }
      Component.prototype.isReactComponent = {}, Component.prototype.setState = function(partialState, callback) {
        if (!(typeof partialState == "object" || typeof partialState == "function" || partialState == null))
          throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      }, Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      {
        var deprecatedAPIs = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, defineDeprecationWarning = function(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function() {
              warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
            }
          });
        };
        for (var fnName in deprecatedAPIs)
          deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
      function ComponentDummy() {
      }
      ComponentDummy.prototype = Component.prototype;
      function PureComponent(props, context, updater) {
        this.props = props, this.context = context, this.refs = emptyObject, this.updater = updater || ReactNoopUpdateQueue;
      }
      var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
      pureComponentPrototype.constructor = PureComponent, _assign(pureComponentPrototype, Component.prototype), pureComponentPrototype.isPureReactComponent = !0;
      function createRef() {
        var refObject = {
          current: null
        };
        return Object.seal(refObject), refObject;
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var functionName = innerType.displayName || innerType.name || "";
        return outerType.displayName || (functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName);
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentName(type) {
        if (type == null)
          return null;
        if (typeof type.tag == "number" && error("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), typeof type == "function")
          return type.displayName || type.name || null;
        if (typeof type == "string")
          return type;
        switch (type) {
          case exports.Fragment:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case exports.Profiler:
            return "Profiler";
          case exports.StrictMode:
            return "StrictMode";
          case exports.Suspense:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type == "object")
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              return getComponentName(type.type);
            case REACT_BLOCK_TYPE:
              return getComponentName(type._render);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type, payload = lazyComponent._payload, init2 = lazyComponent._init;
              try {
                return getComponentName(init2(payload));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var hasOwnProperty2 = Object.prototype.hasOwnProperty, RESERVED_PROPS = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
      didWarnAboutStringRefs = {};
      function hasValidRef(config3) {
        if (hasOwnProperty2.call(config3, "ref")) {
          var getter = Object.getOwnPropertyDescriptor(config3, "ref").get;
          if (getter && getter.isReactWarning)
            return !1;
        }
        return config3.ref !== void 0;
      }
      function hasValidKey(config3) {
        if (hasOwnProperty2.call(config3, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config3, "key").get;
          if (getter && getter.isReactWarning)
            return !1;
        }
        return config3.key !== void 0;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        var warnAboutAccessingKey = function() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName));
        };
        warnAboutAccessingKey.isReactWarning = !0, Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: !0
        });
      }
      function defineRefPropWarningGetter(props, displayName) {
        var warnAboutAccessingRef = function() {
          specialPropRefWarningShown || (specialPropRefWarningShown = !0, error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName));
        };
        warnAboutAccessingRef.isReactWarning = !0, Object.defineProperty(props, "ref", {
          get: warnAboutAccessingRef,
          configurable: !0
        });
      }
      function warnIfStringRefCannotBeAutoConverted(config3) {
        if (typeof config3.ref == "string" && ReactCurrentOwner.current && config3.__self && ReactCurrentOwner.current.stateNode !== config3.__self) {
          var componentName = getComponentName(ReactCurrentOwner.current.type);
          didWarnAboutStringRefs[componentName] || (error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config3.ref), didWarnAboutStringRefs[componentName] = !0);
        }
      }
      var ReactElement = function(type, key, ref, self, source, owner, props) {
        var element = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref,
          props,
          _owner: owner
        };
        return element._store = {}, Object.defineProperty(element._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(element, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: self
        }), Object.defineProperty(element, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: source
        }), Object.freeze && (Object.freeze(element.props), Object.freeze(element)), element;
      };
      function createElement7(type, config3, children) {
        var propName, props = {}, key = null, ref = null, self = null, source = null;
        if (config3 != null) {
          hasValidRef(config3) && (ref = config3.ref, warnIfStringRefCannotBeAutoConverted(config3)), hasValidKey(config3) && (key = "" + config3.key), self = config3.__self === void 0 ? null : config3.__self, source = config3.__source === void 0 ? null : config3.__source;
          for (propName in config3)
            hasOwnProperty2.call(config3, propName) && !RESERVED_PROPS.hasOwnProperty(propName) && (props[propName] = config3[propName]);
        }
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1)
          props.children = children;
        else if (childrenLength > 1) {
          for (var childArray = Array(childrenLength), i5 = 0; i5 < childrenLength; i5++)
            childArray[i5] = arguments[i5 + 2];
          Object.freeze && Object.freeze(childArray), props.children = childArray;
        }
        if (type && type.defaultProps) {
          var defaultProps = type.defaultProps;
          for (propName in defaultProps)
            props[propName] === void 0 && (props[propName] = defaultProps[propName]);
        }
        if (key || ref) {
          var displayName = typeof type == "function" ? type.displayName || type.name || "Unknown" : type;
          key && defineKeyPropWarningGetter(props, displayName), ref && defineRefPropWarningGetter(props, displayName);
        }
        return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
        return newElement;
      }
      function cloneElement(element, config3, children) {
        if (element == null)
          throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
        var propName, props = _assign({}, element.props), key = element.key, ref = element.ref, self = element._self, source = element._source, owner = element._owner;
        if (config3 != null) {
          hasValidRef(config3) && (ref = config3.ref, owner = ReactCurrentOwner.current), hasValidKey(config3) && (key = "" + config3.key);
          var defaultProps;
          element.type && element.type.defaultProps && (defaultProps = element.type.defaultProps);
          for (propName in config3)
            hasOwnProperty2.call(config3, propName) && !RESERVED_PROPS.hasOwnProperty(propName) && (config3[propName] === void 0 && defaultProps !== void 0 ? props[propName] = defaultProps[propName] : props[propName] = config3[propName]);
        }
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1)
          props.children = children;
        else if (childrenLength > 1) {
          for (var childArray = Array(childrenLength), i5 = 0; i5 < childrenLength; i5++)
            childArray[i5] = arguments[i5 + 2];
          props.children = childArray;
        }
        return ReactElement(element.type, key, ref, self, source, owner, props);
      }
      function isValidElement2(object) {
        return typeof object == "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var SEPARATOR = ".", SUBSEPARATOR = ":";
      function escape(key) {
        var escapeRegex = /[=:]/g, escaperLookup = {
          "=": "=0",
          ":": "=2"
        }, escapedString = key.replace(escapeRegex, function(match) {
          return escaperLookup[match];
        });
        return "$" + escapedString;
      }
      var didWarnAboutMaps = !1, userProvidedKeyEscapeRegex = /\/+/g;
      function escapeUserProvidedKey(text) {
        return text.replace(userProvidedKeyEscapeRegex, "$&/");
      }
      function getElementKey(element, index) {
        return typeof element == "object" && element !== null && element.key != null ? escape("" + element.key) : index.toString(36);
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        (type === "undefined" || type === "boolean") && (children = null);
        var invokeCallback = !1;
        if (children === null)
          invokeCallback = !0;
        else
          switch (type) {
            case "string":
            case "number":
              invokeCallback = !0;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = !0;
              }
          }
        if (invokeCallback) {
          var _child = children, mappedChild = callback(_child), childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
          if (Array.isArray(mappedChild)) {
            var escapedChildKey = "";
            childKey != null && (escapedChildKey = escapeUserProvidedKey(childKey) + "/"), mapIntoArray(mappedChild, array, escapedChildKey, "", function(c4) {
              return c4;
            });
          } else
            mappedChild != null && (isValidElement2(mappedChild) && (mappedChild = cloneAndReplaceKey(
              mappedChild,
              escapedPrefix + (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? escapeUserProvidedKey("" + mappedChild.key) + "/" : "") + childKey
            )), array.push(mappedChild));
          return 1;
        }
        var child, nextName, subtreeCount = 0, nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
        if (Array.isArray(children))
          for (var i5 = 0; i5 < children.length; i5++)
            child = children[i5], nextName = nextNamePrefix + getElementKey(child, i5), subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
        else {
          var iteratorFn = getIteratorFn(children);
          if (typeof iteratorFn == "function") {
            var iterableChildren = children;
            iteratorFn === iterableChildren.entries && (didWarnAboutMaps || warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), didWarnAboutMaps = !0);
            for (var iterator = iteratorFn.call(iterableChildren), step, ii = 0; !(step = iterator.next()).done; )
              child = step.value, nextName = nextNamePrefix + getElementKey(child, ii++), subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
          } else if (type === "object") {
            var childrenString = "" + children;
            throw Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return subtreeCount;
      }
      function mapChildren(children, func, context) {
        if (children == null)
          return children;
        var result = [], count = 0;
        return mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        }), result;
      }
      function countChildren(children) {
        var n6 = 0;
        return mapChildren(children, function() {
          n6++;
        }), n6;
      }
      function forEachChildren(children, forEachFunc, forEachContext) {
        mapChildren(children, function() {
          forEachFunc.apply(this, arguments);
        }, forEachContext);
      }
      function toArray(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      }
      function onlyChild(children) {
        if (!isValidElement2(children))
          throw Error("React.Children.only expected to receive a single React element child.");
        return children;
      }
      function createContext3(defaultValue, calculateChangedBits) {
        calculateChangedBits === void 0 ? calculateChangedBits = null : calculateChangedBits !== null && typeof calculateChangedBits != "function" && error("createContext: Expected the optional second argument to be a function. Instead received: %s", calculateChangedBits);
        var context = {
          $$typeof: REACT_CONTEXT_TYPE,
          _calculateChangedBits: calculateChangedBits,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        context.Provider = {
          $$typeof: REACT_PROVIDER_TYPE,
          _context: context
        };
        var hasWarnedAboutUsingNestedContextConsumers = !1, hasWarnedAboutUsingConsumerProvider = !1, hasWarnedAboutDisplayNameOnConsumer = !1;
        {
          var Consumer = {
            $$typeof: REACT_CONTEXT_TYPE,
            _context: context,
            _calculateChangedBits: context._calculateChangedBits
          };
          Object.defineProperties(Consumer, {
            Provider: {
              get: function() {
                return hasWarnedAboutUsingConsumerProvider || (hasWarnedAboutUsingConsumerProvider = !0, error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), context.Provider;
              },
              set: function(_Provider) {
                context.Provider = _Provider;
              }
            },
            _currentValue: {
              get: function() {
                return context._currentValue;
              },
              set: function(_currentValue) {
                context._currentValue = _currentValue;
              }
            },
            _currentValue2: {
              get: function() {
                return context._currentValue2;
              },
              set: function(_currentValue2) {
                context._currentValue2 = _currentValue2;
              }
            },
            _threadCount: {
              get: function() {
                return context._threadCount;
              },
              set: function(_threadCount) {
                context._threadCount = _threadCount;
              }
            },
            Consumer: {
              get: function() {
                return hasWarnedAboutUsingNestedContextConsumers || (hasWarnedAboutUsingNestedContextConsumers = !0, error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), context.Consumer;
              }
            },
            displayName: {
              get: function() {
                return context.displayName;
              },
              set: function(displayName) {
                hasWarnedAboutDisplayNameOnConsumer || (warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName), hasWarnedAboutDisplayNameOnConsumer = !0);
              }
            }
          }), context.Consumer = Consumer;
        }
        return context._currentRenderer = null, context._currentRenderer2 = null, context;
      }
      var Uninitialized = -1, Pending = 0, Resolved = 1, Rejected = 2;
      function lazyInitializer(payload) {
        if (payload._status === Uninitialized) {
          var ctor = payload._result, thenable = ctor(), pending = payload;
          pending._status = Pending, pending._result = thenable, thenable.then(function(moduleObject) {
            if (payload._status === Pending) {
              var defaultExport = moduleObject.default;
              defaultExport === void 0 && error(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, moduleObject);
              var resolved = payload;
              resolved._status = Resolved, resolved._result = defaultExport;
            }
          }, function(error2) {
            if (payload._status === Pending) {
              var rejected = payload;
              rejected._status = Rejected, rejected._result = error2;
            }
          });
        }
        if (payload._status === Resolved)
          return payload._result;
        throw payload._result;
      }
      function lazy(ctor) {
        var payload = {
          _status: -1,
          _result: ctor
        }, lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: payload,
          _init: lazyInitializer
        };
        {
          var defaultProps, propTypes;
          Object.defineProperties(lazyType, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return defaultProps;
              },
              set: function(newDefaultProps) {
                error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), defaultProps = newDefaultProps, Object.defineProperty(lazyType, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return propTypes;
              },
              set: function(newPropTypes) {
                error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), propTypes = newPropTypes, Object.defineProperty(lazyType, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return lazyType;
      }
      function forwardRef3(render) {
        render != null && render.$$typeof === REACT_MEMO_TYPE ? error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof render != "function" ? error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render) : render.length !== 0 && render.length !== 2 && error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), render != null && (render.defaultProps != null || render.propTypes != null) && error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var elementType = {
          $$typeof: REACT_FORWARD_REF_TYPE,
          render
        };
        {
          var ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name, render.displayName == null && (render.displayName = name);
            }
          });
        }
        return elementType;
      }
      var enableScopeAPI = !1;
      function isValidElementType(type) {
        return !!(typeof type == "string" || typeof type == "function" || type === exports.Fragment || type === exports.Profiler || type === REACT_DEBUG_TRACING_MODE_TYPE || type === exports.StrictMode || type === exports.Suspense || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI || typeof type == "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE));
      }
      function memo(type, compare3) {
        isValidElementType(type) || error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
        var elementType = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: compare3 === void 0 ? null : compare3
        };
        {
          var ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name, type.displayName == null && (type.displayName = name);
            }
          });
        }
        return elementType;
      }
      function resolveDispatcher() {
        var dispatcher = ReactCurrentDispatcher.current;
        if (dispatcher === null)
          throw Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
        return dispatcher;
      }
      function useContext4(Context, unstable_observedBits) {
        var dispatcher = resolveDispatcher();
        if (unstable_observedBits !== void 0 && error("useContext() second argument is reserved for future use in React. Passing it is not supported. You passed: %s.%s", unstable_observedBits, typeof unstable_observedBits == "number" && Array.isArray(arguments[2]) ? `

Did you call array.map(useContext)? Calling Hooks inside a loop is not supported. Learn more at https://reactjs.org/link/rules-of-hooks` : ""), Context._context !== void 0) {
          var realContext = Context._context;
          realContext.Consumer === Context ? error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : realContext.Provider === Context && error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return dispatcher.useContext(Context, unstable_observedBits);
      }
      function useState4(initialState) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useState(initialState);
      }
      function useReducer(reducer, initialArg, init2) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useReducer(reducer, initialArg, init2);
      }
      function useRef5(initialValue) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useRef(initialValue);
      }
      function useEffect4(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useEffect(create, deps);
      }
      function useLayoutEffect4(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useLayoutEffect(create, deps);
      }
      function useCallback5(callback, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useCallback(callback, deps);
      }
      function useMemo4(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useMemo(create, deps);
      }
      function useImperativeHandle(ref, create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useImperativeHandle(ref, create, deps);
      }
      function useDebugValue(value, formatterFn) {
        {
          var dispatcher = resolveDispatcher();
          return dispatcher.useDebugValue(value, formatterFn);
        }
      }
      var disabledDepth = 0, prevLog, prevInfo, prevWarn, prevError, prevGroup, prevGroupCollapsed, prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = !0;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log, prevInfo = console.info, prevWarn = console.warn, prevError = console.error, prevGroup = console.group, prevGroupCollapsed = console.groupCollapsed, prevGroupEnd = console.groupEnd;
            var props = {
              configurable: !0,
              enumerable: !0,
              value: disabledLog,
              writable: !0
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          if (disabledDepth--, disabledDepth === 0) {
            var props = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: _assign({}, props, {
                value: prevLog
              }),
              info: _assign({}, props, {
                value: prevInfo
              }),
              warn: _assign({}, props, {
                value: prevWarn
              }),
              error: _assign({}, props, {
                value: prevError
              }),
              group: _assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: _assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: _assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          disabledDepth < 0 && error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher, prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === void 0)
            try {
              throw Error();
            } catch (x3) {
              var match = x3.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || "";
            }
          return `
` + prefix + name;
        }
      }
      var reentry = !1, componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap == "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry)
          return "";
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== void 0)
            return frame;
        }
        var control;
        reentry = !0;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        previousDispatcher = ReactCurrentDispatcher$1.current, ReactCurrentDispatcher$1.current = null, disableLogs();
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            if (Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x3) {
                control = x3;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x3) {
                control = x3;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x3) {
              control = x3;
            }
            fn();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack == "string") {
            for (var sampleLines = sample.stack.split(`
`), controlLines = control.stack.split(`
`), s6 = sampleLines.length - 1, c4 = controlLines.length - 1; s6 >= 1 && c4 >= 0 && sampleLines[s6] !== controlLines[c4]; )
              c4--;
            for (; s6 >= 1 && c4 >= 0; s6--, c4--)
              if (sampleLines[s6] !== controlLines[c4]) {
                if (s6 !== 1 || c4 !== 1)
                  do
                    if (s6--, c4--, c4 < 0 || sampleLines[s6] !== controlLines[c4]) {
                      var _frame = `
` + sampleLines[s6].replace(" at new ", " at ");
                      return typeof fn == "function" && componentFrameCache.set(fn, _frame), _frame;
                    }
                  while (s6 >= 1 && c4 >= 0);
                break;
              }
          }
        } finally {
          reentry = !1, ReactCurrentDispatcher$1.current = previousDispatcher, reenableLogs(), Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn ? fn.displayName || fn.name : "", syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        return typeof fn == "function" && componentFrameCache.set(fn, syntheticFrame), syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        return describeNativeComponentFrame(fn, !1);
      }
      function shouldConstruct(Component2) {
        var prototype = Component2.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null)
          return "";
        if (typeof type == "function")
          return describeNativeComponentFrame(type, shouldConstruct(type));
        if (typeof type == "string")
          return describeBuiltInComponentFrame(type);
        switch (type) {
          case exports.Suspense:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type == "object")
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_BLOCK_TYPE:
              return describeFunctionComponentFrame(type._render);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type, payload = lazyComponent._payload, init2 = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init2(payload), source, ownerFn);
              } catch {
              }
            }
          }
        return "";
      }
      var loggedTypeFailures = {}, ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        if (element) {
          var owner = element._owner, stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
          ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
        } else
          ReactDebugCurrentFrame$1.setExtraStackFrame(null);
      }
      function checkPropTypes(typeSpecs, values, location2, componentName, element) {
        {
          var has = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var typeSpecName in typeSpecs)
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] != "function") {
                  var err = Error((componentName || "React class") + ": " + location2 + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw err.name = "Invariant Violation", err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location2, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              error$1 && !(error$1 instanceof Error) && (setCurrentlyValidatingElement(element), error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location2, typeSpecName, typeof error$1), setCurrentlyValidatingElement(null)), error$1 instanceof Error && !(error$1.message in loggedTypeFailures) && (loggedTypeFailures[error$1.message] = !0, setCurrentlyValidatingElement(element), error("Failed %s type: %s", location2, error$1.message), setCurrentlyValidatingElement(null));
            }
        }
      }
      function setCurrentlyValidatingElement$1(element) {
        if (element) {
          var owner = element._owner, stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
          setExtraStackFrame(stack);
        } else
          setExtraStackFrame(null);
      }
      var propTypesMisspellWarningShown;
      propTypesMisspellWarningShown = !1;
      function getDeclarationErrorAddendum() {
        if (ReactCurrentOwner.current) {
          var name = getComponentName(ReactCurrentOwner.current.type);
          if (name)
            return `

Check the render method of \`` + name + "`.";
        }
        return "";
      }
      function getSourceInfoErrorAddendum(source) {
        if (source !== void 0) {
          var fileName = source.fileName.replace(/^.*[\\\/]/, ""), lineNumber = source.lineNumber;
          return `

Check your code at ` + fileName + ":" + lineNumber + ".";
        }
        return "";
      }
      function getSourceInfoErrorAddendumForProps(elementProps) {
        return elementProps != null ? getSourceInfoErrorAddendum(elementProps.__source) : "";
      }
      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        var info = getDeclarationErrorAddendum();
        if (!info) {
          var parentName = typeof parentType == "string" ? parentType : parentType.displayName || parentType.name;
          parentName && (info = `

Check the top-level render call using <` + parentName + ">.");
        }
        return info;
      }
      function validateExplicitKey(element, parentType) {
        if (!(!element._store || element._store.validated || element.key != null)) {
          element._store.validated = !0;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (!ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            ownerHasKeyUseWarning[currentComponentErrorInfo] = !0;
            var childOwner = "";
            element && element._owner && element._owner !== ReactCurrentOwner.current && (childOwner = " It was passed a child from " + getComponentName(element._owner.type) + "."), setCurrentlyValidatingElement$1(element), error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner), setCurrentlyValidatingElement$1(null);
          }
        }
      }
      function validateChildKeys(node, parentType) {
        if (typeof node == "object") {
          if (Array.isArray(node))
            for (var i5 = 0; i5 < node.length; i5++) {
              var child = node[i5];
              isValidElement2(child) && validateExplicitKey(child, parentType);
            }
          else if (isValidElement2(node))
            node._store && (node._store.validated = !0);
          else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn == "function" && iteratorFn !== node.entries)
              for (var iterator = iteratorFn.call(node), step; !(step = iterator.next()).done; )
                isValidElement2(step.value) && validateExplicitKey(step.value, parentType);
          }
        }
      }
      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type == null || typeof type == "string")
            return;
          var propTypes;
          if (typeof type == "function")
            propTypes = type.propTypes;
          else if (typeof type == "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MEMO_TYPE))
            propTypes = type.propTypes;
          else
            return;
          if (propTypes) {
            var name = getComponentName(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
          } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = !0;
            var _name = getComponentName(type);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
          }
          typeof type.getDefaultProps == "function" && !type.getDefaultProps.isReactClassApproved && error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function validateFragmentProps(fragment) {
        {
          for (var keys2 = Object.keys(fragment.props), i5 = 0; i5 < keys2.length; i5++) {
            var key = keys2[i5];
            if (key !== "children" && key !== "key") {
              setCurrentlyValidatingElement$1(fragment), error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key), setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          fragment.ref !== null && (setCurrentlyValidatingElement$1(fragment), error("Invalid attribute `ref` supplied to `React.Fragment`."), setCurrentlyValidatingElement$1(null));
        }
      }
      function createElementWithValidation(type, props, children) {
        var validType = isValidElementType(type);
        if (!validType) {
          var info = "";
          (type === void 0 || typeof type == "object" && type !== null && Object.keys(type).length === 0) && (info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var sourceInfo = getSourceInfoErrorAddendumForProps(props);
          sourceInfo ? info += sourceInfo : info += getDeclarationErrorAddendum();
          var typeString;
          type === null ? typeString = "null" : Array.isArray(type) ? typeString = "array" : type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE ? (typeString = "<" + (getComponentName(type.type) || "Unknown") + " />", info = " Did you accidentally export a JSX literal instead of a component?") : typeString = typeof type, error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
        }
        var element = createElement7.apply(this, arguments);
        if (element == null)
          return element;
        if (validType)
          for (var i5 = 2; i5 < arguments.length; i5++)
            validateChildKeys(arguments[i5], type);
        return type === exports.Fragment ? validateFragmentProps(element) : validatePropTypes(element), element;
      }
      var didWarnAboutDeprecatedCreateFactory = !1;
      function createFactoryWithValidation(type) {
        var validatedFactory = createElementWithValidation.bind(null, type);
        return validatedFactory.type = type, didWarnAboutDeprecatedCreateFactory || (didWarnAboutDeprecatedCreateFactory = !0, warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(validatedFactory, "type", {
          enumerable: !1,
          get: function() {
            return warn("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: type
            }), type;
          }
        }), validatedFactory;
      }
      function cloneElementWithValidation(element, props, children) {
        for (var newElement = cloneElement.apply(this, arguments), i5 = 2; i5 < arguments.length; i5++)
          validateChildKeys(arguments[i5], newElement.type);
        return validatePropTypes(newElement), newElement;
      }
      try {
        var frozenObject = Object.freeze({});
      } catch {
      }
      var createElement$1 = createElementWithValidation, cloneElement$1 = cloneElementWithValidation, createFactory = createFactoryWithValidation, Children2 = {
        map: mapChildren,
        forEach: forEachChildren,
        count: countChildren,
        toArray,
        only: onlyChild
      };
      exports.Children = Children2, exports.Component = Component, exports.PureComponent = PureComponent, exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals, exports.cloneElement = cloneElement$1, exports.createContext = createContext3, exports.createElement = createElement$1, exports.createFactory = createFactory, exports.createRef = createRef, exports.forwardRef = forwardRef3, exports.isValidElement = isValidElement2, exports.lazy = lazy, exports.memo = memo, exports.useCallback = useCallback5, exports.useContext = useContext4, exports.useDebugValue = useDebugValue, exports.useEffect = useEffect4, exports.useImperativeHandle = useImperativeHandle, exports.useLayoutEffect = useLayoutEffect4, exports.useMemo = useMemo4, exports.useReducer = useReducer, exports.useRef = useRef5, exports.useState = useState4, exports.version = ReactVersion;
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    module.exports = require_react_development();
  }
});

// node_modules/@babel/runtime/helpers/esm/extends.js
var init_extends = __esm({
  "node_modules/@babel/runtime/helpers/esm/extends.js"() {
  }
});

// node_modules/history/index.js
function createPath(_ref) {
  var _ref$pathname = _ref.pathname, pathname = _ref$pathname === void 0 ? "/" : _ref$pathname, _ref$search = _ref.search, search = _ref$search === void 0 ? "" : _ref$search, _ref$hash = _ref.hash, hash = _ref$hash === void 0 ? "" : _ref$hash;
  return search && search !== "?" && (pathname += search.charAt(0) === "?" ? search : "?" + search), hash && hash !== "#" && (pathname += hash.charAt(0) === "#" ? hash : "#" + hash), pathname;
}
function parsePath(path) {
  var parsedPath = {};
  if (path) {
    var hashIndex = path.indexOf("#");
    hashIndex >= 0 && (parsedPath.hash = path.substr(hashIndex), path = path.substr(0, hashIndex));
    var searchIndex = path.indexOf("?");
    searchIndex >= 0 && (parsedPath.search = path.substr(searchIndex), path = path.substr(0, searchIndex)), path && (parsedPath.pathname = path);
  }
  return parsedPath;
}
var Action, init_history = __esm({
  "node_modules/history/index.js"() {
    init_extends();
    (function(Action2) {
      Action2.Pop = "POP", Action2.Push = "PUSH", Action2.Replace = "REPLACE";
    })(Action || (Action = {}));
  }
});

// node_modules/react-router/index.js
function invariant(cond, message) {
  if (!cond)
    throw new Error(message);
}
function warning(cond, message) {
  if (!cond) {
    typeof console < "u" && console.warn(message);
    try {
      throw new Error(message);
    } catch {
    }
  }
}
function warningOnce(key, cond, message) {
  !cond && !alreadyWarned[key] && (alreadyWarned[key] = !0, warning(!1, message));
}
function matchRoutes(routes2, locationArg, basename) {
  basename === void 0 && (basename = "/");
  let location2 = typeof locationArg == "string" ? parsePath(locationArg) : locationArg, pathname = stripBasename(location2.pathname || "/", basename);
  if (pathname == null)
    return null;
  let branches = flattenRoutes(routes2);
  rankRouteBranches(branches);
  let matches = null;
  for (let i5 = 0; matches == null && i5 < branches.length; ++i5)
    matches = matchRouteBranch(branches[i5], pathname);
  return matches;
}
function flattenRoutes(routes2, branches, parentsMeta, parentPath) {
  return branches === void 0 && (branches = []), parentsMeta === void 0 && (parentsMeta = []), parentPath === void 0 && (parentPath = ""), routes2.forEach((route, index) => {
    let meta2 = {
      relativePath: route.path || "",
      caseSensitive: route.caseSensitive === !0,
      childrenIndex: index,
      route
    };
    meta2.relativePath.startsWith("/") && (meta2.relativePath.startsWith(parentPath) || invariant(!1, 'Absolute route path "' + meta2.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes."), meta2.relativePath = meta2.relativePath.slice(parentPath.length));
    let path = joinPaths([parentPath, meta2.relativePath]), routesMeta = parentsMeta.concat(meta2);
    route.children && route.children.length > 0 && (route.index === !0 && invariant(!1, "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')), flattenRoutes(route.children, branches, routesMeta, path)), !(route.path == null && !route.index) && branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  }), branches;
}
function rankRouteBranches(branches) {
  branches.sort((a4, b3) => a4.score !== b3.score ? b3.score - a4.score : compareIndexes(a4.routesMeta.map((meta2) => meta2.childrenIndex), b3.routesMeta.map((meta2) => meta2.childrenIndex)));
}
function computeScore(path, index) {
  let segments = path.split("/"), initialScore = segments.length;
  return segments.some(isSplat) && (initialScore += splatPenalty), index && (initialScore += indexRouteValue), segments.filter((s6) => !isSplat(s6)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a4, b3) {
  return a4.length === b3.length && a4.slice(0, -1).every((n6, i5) => n6 === b3[i5]) ? a4[a4.length - 1] - b3[b3.length - 1] : 0;
}
function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch, matchedParams = {}, matchedPathname = "/", matches = [];
  for (let i5 = 0; i5 < routesMeta.length; ++i5) {
    let meta2 = routesMeta[i5], end = i5 === routesMeta.length - 1, remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/", match = matchPath({
      path: meta2.relativePath,
      caseSensitive: meta2.caseSensitive,
      end
    }, remainingPathname);
    if (!match)
      return null;
    Object.assign(matchedParams, match.params);
    let route = meta2.route;
    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    }), match.pathnameBase !== "/" && (matchedPathname = joinPaths([matchedPathname, match.pathnameBase]));
  }
  return matches;
}
function matchPath(pattern, pathname) {
  typeof pattern == "string" && (pattern = {
    path: pattern,
    caseSensitive: !1,
    end: !0
  });
  let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end), match = pathname.match(matcher);
  if (!match)
    return null;
  let matchedPathname = match[0], pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1"), captureGroups = match.slice(1);
  return {
    params: paramNames.reduce((memo, paramName, index) => {
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      return memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || "", paramName), memo;
    }, {}),
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  caseSensitive === void 0 && (caseSensitive = !1), end === void 0 && (end = !0), warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let paramNames = [], regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^$?{}|()[\]]/g, "\\$&").replace(/:(\w+)/g, (_, paramName) => (paramNames.push(paramName), "([^\\/]+)"));
  return path.endsWith("*") ? (paramNames.push("*"), regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : regexpSource += end ? "\\/*$" : "(?:(?=[.~-]|%[0-9A-F]{2})|\\b|\\/|$)", [new RegExp(regexpSource, caseSensitive ? void 0 : "i"), paramNames];
}
function safelyDecodeURIComponent(value, paramName) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return warning(!1, 'The value for the URL param "' + paramName + '" will not be decoded because' + (' the string "' + value + '" is a malformed URL segment. This is probably') + (" due to a bad percent encoding (" + error + ").")), value;
  }
}
function resolvePath(to, fromPathname) {
  fromPathname === void 0 && (fromPathname = "/");
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to == "string" ? parsePath(to) : to;
  return {
    pathname: toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  return relativePath.split("/").forEach((segment) => {
    segment === ".." ? segments.length > 1 && segments.pop() : segment !== "." && segments.push(segment);
  }), segments.length > 1 ? segments.join("/") : "/";
}
function resolveTo(toArg, routePathnames, locationPathname) {
  let to = typeof toArg == "string" ? parsePath(toArg) : toArg, toPathname = toArg === "" || to.pathname === "" ? "/" : to.pathname, from2;
  if (toPathname == null)
    from2 = locationPathname;
  else {
    let routePathnameIndex = routePathnames.length - 1;
    if (toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      for (; toSegments[0] === ".."; )
        toSegments.shift(), routePathnameIndex -= 1;
      to.pathname = toSegments.join("/");
    }
    from2 = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from2);
  return toPathname && toPathname !== "/" && toPathname.endsWith("/") && !path.pathname.endsWith("/") && (path.pathname += "/"), path;
}
function getToPathname(to) {
  return to === "" || to.pathname === "" ? "/" : typeof to == "string" ? parsePath(to).pathname : to.pathname;
}
function stripBasename(pathname, basename) {
  if (basename === "/")
    return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase()))
    return null;
  let nextChar = pathname.charAt(basename.length);
  return nextChar && nextChar !== "/" ? null : pathname.slice(basename.length) || "/";
}
function useHref(to) {
  useInRouterContext() || invariant(
    !1,
    "useHref() may be used only in the context of a <Router> component."
  );
  let {
    basename,
    navigator: navigator2
  } = (0, import_react.useContext)(NavigationContext), {
    hash,
    pathname,
    search
  } = useResolvedPath(to), joinedPathname = pathname;
  if (basename !== "/") {
    let toPathname = getToPathname(to), endsWithSlash = toPathname != null && toPathname.endsWith("/");
    joinedPathname = pathname === "/" ? basename + (endsWithSlash ? "/" : "") : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return (0, import_react.useContext)(LocationContext) != null;
}
function useLocation() {
  return useInRouterContext() || invariant(
    !1,
    "useLocation() may be used only in the context of a <Router> component."
  ), (0, import_react.useContext)(LocationContext).location;
}
function useNavigate() {
  useInRouterContext() || invariant(
    !1,
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let {
    basename,
    navigator: navigator2
  } = (0, import_react.useContext)(NavigationContext), {
    matches
  } = (0, import_react.useContext)(RouteContext), {
    pathname: locationPathname
  } = useLocation(), routePathnamesJson = JSON.stringify(matches.map((match) => match.pathnameBase)), activeRef = (0, import_react.useRef)(!1);
  return (0, import_react.useEffect)(() => {
    activeRef.current = !0;
  }), (0, import_react.useCallback)(function(to, options) {
    if (options === void 0 && (options = {}), warning(activeRef.current, "You should call navigate() in a React.useEffect(), not when your component is first rendered."), !activeRef.current)
      return;
    if (typeof to == "number") {
      navigator2.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname);
    basename !== "/" && (path.pathname = joinPaths([basename, path.pathname])), (options.replace ? navigator2.replace : navigator2.push)(path, options.state);
  }, [basename, navigator2, routePathnamesJson, locationPathname]);
}
function useOutlet(context) {
  let outlet = (0, import_react.useContext)(RouteContext).outlet;
  return outlet && /* @__PURE__ */ (0, import_react.createElement)(OutletContext.Provider, {
    value: context
  }, outlet);
}
function useResolvedPath(to) {
  let {
    matches
  } = (0, import_react.useContext)(RouteContext), {
    pathname: locationPathname
  } = useLocation(), routePathnamesJson = JSON.stringify(matches.map((match) => match.pathnameBase));
  return (0, import_react.useMemo)(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname), [to, routePathnamesJson, locationPathname]);
}
function useRoutes(routes2, locationArg) {
  useInRouterContext() || invariant(
    !1,
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let {
    matches: parentMatches
  } = (0, import_react.useContext)(RouteContext), routeMatch = parentMatches[parentMatches.length - 1], parentParams = routeMatch ? routeMatch.params : {}, parentPathname = routeMatch ? routeMatch.pathname : "/", parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/", parentRoute = routeMatch && routeMatch.route;
  {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ('"' + parentPathname + '" (under <Route path="' + parentPath + '">) but the ') + `parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

` + ('Please change the parent <Route path="' + parentPath + '"> to <Route ') + ('path="' + (parentPath === "/" ? "*" : parentPath + "/*") + '">.'));
  }
  let locationFromContext = useLocation(), location2;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg == "string" ? parsePath(locationArg) : locationArg;
    parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase)) || invariant(!1, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, the location pathname must begin with the portion of the URL pathname that was " + ('matched by all parent routes. The current pathname base is "' + parentPathnameBase + '" ') + ('but pathname "' + parsedLocationArg.pathname + '" was given in the `location` prop.')), location2 = parsedLocationArg;
  } else
    location2 = locationFromContext;
  let pathname = location2.pathname || "/", remainingPathname = parentPathnameBase === "/" ? pathname : pathname.slice(parentPathnameBase.length) || "/", matches = matchRoutes(routes2, {
    pathname: remainingPathname
  });
  return warning(parentRoute || matches != null, 'No routes matched location "' + location2.pathname + location2.search + location2.hash + '" '), warning(matches == null || matches[matches.length - 1].route.element !== void 0, 'Matched leaf route at location "' + location2.pathname + location2.search + location2.hash + '" does not have an element. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.'), _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([parentPathnameBase, match.pathname]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([parentPathnameBase, match.pathnameBase])
  })), parentMatches);
}
function _renderMatches(matches, parentMatches) {
  return parentMatches === void 0 && (parentMatches = []), matches == null ? null : matches.reduceRight((outlet, match, index) => /* @__PURE__ */ (0, import_react.createElement)(RouteContext.Provider, {
    children: match.route.element !== void 0 ? match.route.element : outlet,
    value: {
      outlet,
      matches: parentMatches.concat(matches.slice(0, index + 1))
    }
  }), null);
}
function Outlet(props) {
  return useOutlet(props.context);
}
function Router(_ref3) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = !1
  } = _ref3;
  useInRouterContext() && invariant(!1, "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");
  let basename = normalizePathname(basenameProp), navigationContext = (0, import_react.useMemo)(() => ({
    basename,
    navigator: navigator2,
    static: staticProp
  }), [basename, navigator2, staticProp]);
  typeof locationProp == "string" && (locationProp = parsePath(locationProp));
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp, location2 = (0, import_react.useMemo)(() => {
    let trailingPathname = stripBasename(pathname, basename);
    return trailingPathname == null ? null : {
      pathname: trailingPathname,
      search,
      hash,
      state,
      key
    };
  }, [basename, pathname, search, hash, state, key]);
  return warning(location2 != null, '<Router basename="' + basename + '"> is not able to match the URL ' + ('"' + pathname + search + hash + '" because it does not start with the ') + "basename, so the <Router> won't render anything."), location2 == null ? null : /* @__PURE__ */ (0, import_react.createElement)(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ (0, import_react.createElement)(LocationContext.Provider, {
    children,
    value: {
      location: location2,
      navigationType
    }
  }));
}
var import_react, NavigationContext, LocationContext, RouteContext, alreadyWarned, paramRe, dynamicSegmentValue, indexRouteValue, emptySegmentValue, staticSegmentValue, splatPenalty, isSplat, joinPaths, normalizePathname, normalizeSearch, normalizeHash, OutletContext, init_react_router = __esm({
  "node_modules/react-router/index.js"() {
    init_history();
    init_history();
    import_react = __toESM(require_react());
    NavigationContext = /* @__PURE__ */ (0, import_react.createContext)(null);
    NavigationContext.displayName = "Navigation";
    LocationContext = /* @__PURE__ */ (0, import_react.createContext)(null);
    LocationContext.displayName = "Location";
    RouteContext = /* @__PURE__ */ (0, import_react.createContext)({
      outlet: null,
      matches: []
    });
    RouteContext.displayName = "Route";
    alreadyWarned = {};
    paramRe = /^:\w+$/, dynamicSegmentValue = 3, indexRouteValue = 2, emptySegmentValue = 1, staticSegmentValue = 10, splatPenalty = -2, isSplat = (s6) => s6 === "*";
    joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/"), normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/"), normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search, normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
    OutletContext = /* @__PURE__ */ (0, import_react.createContext)(null);
  }
});

// node_modules/react-router-dom/index.js
function _extends2() {
  return _extends2 = Object.assign || function(target) {
    for (var i5 = 1; i5 < arguments.length; i5++) {
      var source = arguments[i5];
      for (var key in source)
        Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
    return target;
  }, _extends2.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {}, sourceKeys = Object.keys(source), key, i5;
  for (i5 = 0; i5 < sourceKeys.length; i5++)
    key = sourceKeys[i5], !(excluded.indexOf(key) >= 0) && (target[key] = source[key]);
  return target;
}
function HistoryRouter(_ref3) {
  let {
    basename,
    children,
    history
  } = _ref3, [state, setState] = (0, import_react2.useState)({
    action: history.action,
    location: history.location
  });
  return (0, import_react2.useLayoutEffect)(() => history.listen(setState), [history]), /* @__PURE__ */ (0, import_react2.createElement)(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state
  } = _temp === void 0 ? {} : _temp, navigate = useNavigate(), location2 = useLocation(), path = useResolvedPath(to);
  return (0, import_react2.useCallback)((event) => {
    if (event.button === 0 && (!target || target === "_self") && !isModifiedEvent(event)) {
      event.preventDefault();
      let replace = !!replaceProp || createPath(location2) === createPath(path);
      navigate(to, {
        replace,
        state
      });
    }
  }, [location2, navigate, path, replaceProp, state, target, to]);
}
var import_react2, _excluded, _excluded2, Link, NavLink, init_react_router_dom = __esm({
  "node_modules/react-router-dom/index.js"() {
    import_react2 = __toESM(require_react());
    init_react_router();
    init_react_router();
    _excluded = ["onClick", "reloadDocument", "replace", "state", "target", "to"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "children"];
    HistoryRouter.displayName = "unstable_HistoryRouter";
    Link = /* @__PURE__ */ (0, import_react2.forwardRef)(function(_ref4, ref) {
      let {
        onClick,
        reloadDocument,
        replace = !1,
        state,
        target,
        to
      } = _ref4, rest = _objectWithoutPropertiesLoose(_ref4, _excluded), href = useHref(to), internalOnClick = useLinkClickHandler(to, {
        replace,
        state,
        target
      });
      function handleClick(event) {
        onClick && onClick(event), !event.defaultPrevented && !reloadDocument && internalOnClick(event);
      }
      return /* @__PURE__ */ (0, import_react2.createElement)("a", _extends2({}, rest, {
        href,
        onClick: handleClick,
        ref,
        target
      }));
    });
    Link.displayName = "Link";
    NavLink = /* @__PURE__ */ (0, import_react2.forwardRef)(function(_ref5, ref) {
      let {
        "aria-current": ariaCurrentProp = "page",
        caseSensitive = !1,
        className: classNameProp = "",
        end = !1,
        style: styleProp,
        to,
        children
      } = _ref5, rest = _objectWithoutPropertiesLoose(_ref5, _excluded2), location2 = useLocation(), path = useResolvedPath(to), locationPathname = location2.pathname, toPathname = path.pathname;
      caseSensitive || (locationPathname = locationPathname.toLowerCase(), toPathname = toPathname.toLowerCase());
      let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/", ariaCurrent = isActive ? ariaCurrentProp : void 0, className;
      typeof classNameProp == "function" ? className = classNameProp({
        isActive
      }) : className = [classNameProp, isActive ? "active" : null].filter(Boolean).join(" ");
      let style = typeof styleProp == "function" ? styleProp({
        isActive
      }) : styleProp;
      return /* @__PURE__ */ (0, import_react2.createElement)(Link, _extends2({}, rest, {
        "aria-current": ariaCurrent,
        className,
        ref,
        style,
        to
      }), typeof children == "function" ? children({
        isActive
      }) : children);
    });
    NavLink.displayName = "NavLink";
  }
});

// node_modules/@remix-run/server-runtime/esm/routeMatching.js
function matchServerRoutes(routes2, pathname) {
  let matches = matchRoutes(routes2, pathname);
  return matches ? matches.map((match) => ({
    params: match.params,
    pathname: match.pathname,
    route: match.route
  })) : null;
}
var init_routeMatching = __esm({
  "node_modules/@remix-run/server-runtime/esm/routeMatching.js"() {
    init_react_router_dom();
  }
});

// node_modules/@remix-run/server-runtime/esm/routes.js
function createRoutes(manifest, parentId) {
  return Object.keys(manifest).filter((key) => manifest[key].parentId === parentId).map((id) => ({
    ...manifest[id],
    children: createRoutes(manifest, id)
  }));
}
var init_routes = __esm({
  "node_modules/@remix-run/server-runtime/esm/routes.js"() {
  }
});

// node_modules/jsesc/jsesc.js
var require_jsesc = __commonJS({
  "node_modules/jsesc/jsesc.js"(exports, module) {
    "use strict";
    var object = {}, hasOwnProperty2 = object.hasOwnProperty, forOwn = (object2, callback) => {
      for (let key in object2)
        hasOwnProperty2.call(object2, key) && callback(key, object2[key]);
    }, extend = (destination, source) => (source && forOwn(source, (key, value) => {
      destination[key] = value;
    }), destination), forEach2 = (array, callback) => {
      let length = array.length, index = -1;
      for (; ++index < length; )
        callback(array[index]);
    }, fourHexEscape = (hex) => "\\u" + ("0000" + hex).slice(-4), hexadecimal = (code, lowercase) => {
      let hexadecimal2 = code.toString(16);
      return lowercase ? hexadecimal2 : hexadecimal2.toUpperCase();
    }, toString3 = object.toString, isArray3 = Array.isArray, isBuffer2 = (value) => typeof Buffer == "function" && Buffer.isBuffer(value), isObject3 = (value) => toString3.call(value) == "[object Object]", isString2 = (value) => typeof value == "string" || toString3.call(value) == "[object String]", isNumber2 = (value) => typeof value == "number" || toString3.call(value) == "[object Number]", isFunction2 = (value) => typeof value == "function", isMap = (value) => toString3.call(value) == "[object Map]", isSet = (value) => toString3.call(value) == "[object Set]", singleEscapes = {
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t"
    }, regexSingleEscape = /[\\\b\f\n\r\t]/, regexDigit = /[0-9]/, regexWhitespace = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, escapeEverythingRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^]/g, escapeNonAsciiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^ !#-&\(-\[\]-_a-~]/g, jsesc2 = (argument, options) => {
      let increaseIndentation = () => {
        oldIndent = indent, ++options.indentLevel, indent = options.indent.repeat(options.indentLevel);
      }, defaults = {
        escapeEverything: !1,
        minimal: !1,
        isScriptContext: !1,
        quotes: "single",
        wrap: !1,
        es6: !1,
        json: !1,
        compact: !0,
        lowercaseHex: !1,
        numbers: "decimal",
        indent: "	",
        indentLevel: 0,
        __inline1__: !1,
        __inline2__: !1
      }, json2 = options && options.json;
      json2 && (defaults.quotes = "double", defaults.wrap = !0), options = extend(defaults, options), options.quotes != "single" && options.quotes != "double" && options.quotes != "backtick" && (options.quotes = "single");
      let quote = options.quotes == "double" ? '"' : options.quotes == "backtick" ? "`" : "'", compact = options.compact, lowercaseHex = options.lowercaseHex, indent = options.indent.repeat(options.indentLevel), oldIndent = "", inline1 = options.__inline1__, inline2 = options.__inline2__, newLine = compact ? "" : `
`, result, isEmpty = !0, useBinNumbers = options.numbers == "binary", useOctNumbers = options.numbers == "octal", useDecNumbers = options.numbers == "decimal", useHexNumbers = options.numbers == "hexadecimal";
      if (json2 && argument && isFunction2(argument.toJSON) && (argument = argument.toJSON()), !isString2(argument)) {
        if (isMap(argument))
          return argument.size == 0 ? "new Map()" : (compact || (options.__inline1__ = !0, options.__inline2__ = !1), "new Map(" + jsesc2(Array.from(argument), options) + ")");
        if (isSet(argument))
          return argument.size == 0 ? "new Set()" : "new Set(" + jsesc2(Array.from(argument), options) + ")";
        if (isBuffer2(argument))
          return argument.length == 0 ? "Buffer.from([])" : "Buffer.from(" + jsesc2(Array.from(argument), options) + ")";
        if (isArray3(argument))
          return result = [], options.wrap = !0, inline1 && (options.__inline1__ = !1, options.__inline2__ = !0), inline2 || increaseIndentation(), forEach2(argument, (value) => {
            isEmpty = !1, inline2 && (options.__inline2__ = !1), result.push(
              (compact || inline2 ? "" : indent) + jsesc2(value, options)
            );
          }), isEmpty ? "[]" : inline2 ? "[" + result.join(", ") + "]" : "[" + newLine + result.join("," + newLine) + newLine + (compact ? "" : oldIndent) + "]";
        if (isNumber2(argument)) {
          if (json2)
            return JSON.stringify(argument);
          if (useDecNumbers)
            return String(argument);
          if (useHexNumbers) {
            let hexadecimal2 = argument.toString(16);
            return lowercaseHex || (hexadecimal2 = hexadecimal2.toUpperCase()), "0x" + hexadecimal2;
          }
          if (useBinNumbers)
            return "0b" + argument.toString(2);
          if (useOctNumbers)
            return "0o" + argument.toString(8);
        } else
          return isObject3(argument) ? (result = [], options.wrap = !0, increaseIndentation(), forOwn(argument, (key, value) => {
            isEmpty = !1, result.push(
              (compact ? "" : indent) + jsesc2(key, options) + ":" + (compact ? "" : " ") + jsesc2(value, options)
            );
          }), isEmpty ? "{}" : "{" + newLine + result.join("," + newLine) + newLine + (compact ? "" : oldIndent) + "}") : json2 ? JSON.stringify(argument) || "null" : String(argument);
      }
      let regex = options.escapeEverything ? escapeEverythingRegex : escapeNonAsciiRegex;
      return result = argument.replace(regex, (char, pair, lone, quoteChar, index, string) => {
        if (pair) {
          if (options.minimal)
            return pair;
          let first = pair.charCodeAt(0), second = pair.charCodeAt(1);
          if (options.es6) {
            let codePoint = (first - 55296) * 1024 + second - 56320 + 65536, hex2 = hexadecimal(codePoint, lowercaseHex);
            return "\\u{" + hex2 + "}";
          }
          return fourHexEscape(hexadecimal(first, lowercaseHex)) + fourHexEscape(hexadecimal(second, lowercaseHex));
        }
        if (lone)
          return fourHexEscape(hexadecimal(lone.charCodeAt(0), lowercaseHex));
        if (char == "\0" && !json2 && !regexDigit.test(string.charAt(index + 1)))
          return "\\0";
        if (quoteChar)
          return quoteChar == quote || options.escapeEverything ? "\\" + quoteChar : quoteChar;
        if (regexSingleEscape.test(char))
          return singleEscapes[char];
        if (options.minimal && !regexWhitespace.test(char))
          return char;
        let hex = hexadecimal(char.charCodeAt(0), lowercaseHex);
        return json2 || hex.length > 2 ? fourHexEscape(hex) : "\\x" + ("00" + hex).slice(-2);
      }), quote == "`" && (result = result.replace(/\$\{/g, "\\${")), options.isScriptContext && (result = result.replace(/<\/(script|style)/gi, "<\\/$1").replace(/<!--/g, json2 ? "\\u003C!--" : "\\x3C!--")), options.wrap && (result = quote + result + quote), result;
    };
    jsesc2.version = "3.0.2";
    module.exports = jsesc2;
  }
});

// node_modules/@remix-run/server-runtime/esm/serverHandoff.js
function createServerHandoffString(serverHandoff) {
  return (0, import_jsesc.default)(serverHandoff, {
    isScriptContext: !0
  });
}
var import_jsesc, init_serverHandoff = __esm({
  "node_modules/@remix-run/server-runtime/esm/serverHandoff.js"() {
    import_jsesc = __toESM(require_jsesc());
  }
});

// node_modules/@remix-run/server-runtime/esm/server.js
async function handleDataRequest({
  handleDataRequest: handleDataRequest2,
  loadContext,
  matches,
  request,
  serverMode
}) {
  if (!isValidRequestMethod(request))
    return errorBoundaryError(new Error(`Invalid request method "${request.method}"`), 405);
  let url = new URL(request.url);
  if (!matches)
    return errorBoundaryError(new Error(`No route matches URL "${url.pathname}"`), 404);
  let response, match;
  try {
    if (isActionRequest(request))
      match = getRequestMatch(url, matches), response = await callRouteAction({
        loadContext,
        match,
        request
      });
    else {
      let routeId = url.searchParams.get("_data");
      if (!routeId)
        return errorBoundaryError(new Error("Missing route id in ?_data"), 403);
      let tempMatch = matches.find((match2) => match2.route.id === routeId);
      if (!tempMatch)
        return errorBoundaryError(new Error(`Route "${routeId}" does not match URL "${url.pathname}"`), 403);
      match = tempMatch, response = await callRouteLoader({
        loadContext,
        match,
        request
      });
    }
    if (isRedirectResponse(response)) {
      let headers = new Headers(response.headers);
      return headers.set("X-Remix-Redirect", headers.get("Location")), headers.delete("Location"), response.headers.get("Set-Cookie") !== null && headers.set("X-Remix-Revalidate", "yes"), new Response(null, {
        status: 204,
        headers
      });
    }
    return handleDataRequest2 && (response = await handleDataRequest2(response.clone(), {
      context: loadContext,
      params: match.params,
      request: request.clone()
    })), response;
  } catch (error) {
    return serverMode !== ServerMode.Test && console.error(error), serverMode === ServerMode.Development ? errorBoundaryError(error, 500) : errorBoundaryError(new Error("Unexpected Server Error"), 500);
  }
}
async function handleDocumentRequest({
  build,
  loadContext,
  matches,
  request,
  routes: routes2,
  serverMode
}) {
  let url = new URL(request.url), appState = {
    trackBoundaries: !0,
    trackCatchBoundaries: !0,
    catchBoundaryRouteId: null,
    renderBoundaryRouteId: null,
    loaderBoundaryRouteId: null,
    error: void 0,
    catch: void 0
  };
  isValidRequestMethod(request) ? matches || (appState.trackCatchBoundaries = !1, appState.catch = {
    data: null,
    status: 404,
    statusText: "Not Found"
  }) : (matches = null, appState.trackCatchBoundaries = !1, appState.catch = {
    data: null,
    status: 405,
    statusText: "Method Not Allowed"
  });
  let actionStatus, actionData, actionMatch, actionResponse;
  if (matches && isActionRequest(request)) {
    actionMatch = getRequestMatch(url, matches);
    try {
      if (actionResponse = await callRouteAction({
        loadContext,
        match: actionMatch,
        request
      }), isRedirectResponse(actionResponse))
        return actionResponse;
      actionStatus = {
        status: actionResponse.status,
        statusText: actionResponse.statusText
      }, isCatchResponse(actionResponse) ? (appState.catchBoundaryRouteId = getDeepestRouteIdWithBoundary(matches, "CatchBoundary"), appState.trackCatchBoundaries = !1, appState.catch = {
        ...actionStatus,
        data: await extractData(actionResponse)
      }) : actionData = {
        [actionMatch.route.id]: await extractData(actionResponse)
      };
    } catch (error) {
      appState.loaderBoundaryRouteId = getDeepestRouteIdWithBoundary(matches, "ErrorBoundary"), appState.trackBoundaries = !1, appState.error = await serializeError(error), serverMode !== ServerMode.Test && console.error(`There was an error running the action for route ${actionMatch.route.id}`);
    }
  }
  let routeModules = createEntryRouteModules(build.routes), matchesToLoad = matches || [];
  appState.catch ? matchesToLoad = getMatchesUpToDeepestBoundary(
    matchesToLoad.slice(0, -1),
    "CatchBoundary"
  ) : appState.error && (matchesToLoad = getMatchesUpToDeepestBoundary(
    matchesToLoad.slice(0, -1),
    "ErrorBoundary"
  ));
  let routeLoaderResults = await Promise.allSettled(matchesToLoad.map((match) => match.route.module.loader ? callRouteLoader({
    loadContext,
    match,
    request
  }) : Promise.resolve(void 0))), actionCatch = appState.catch, actionError = appState.error, actionCatchBoundaryRouteId = appState.catchBoundaryRouteId, actionLoaderBoundaryRouteId = appState.loaderBoundaryRouteId;
  appState.catch = void 0, appState.error = void 0;
  let routeLoaderResponses = {}, loaderStatusCodes = [], routeData = {};
  for (let index = 0; index < matchesToLoad.length; index++) {
    let match = matchesToLoad[index], result = routeLoaderResults[index], error = result.status === "rejected" ? result.reason : void 0, response = result.status === "fulfilled" ? result.value : void 0, isRedirect = response ? isRedirectResponse(response) : !1, isCatch = response ? isCatchResponse(response) : !1;
    if (appState.catch || appState.error)
      break;
    if (!actionCatch && !actionError && response && isRedirect)
      return response;
    if (match.route.module.CatchBoundary && (appState.catchBoundaryRouteId = match.route.id), match.route.module.ErrorBoundary && (appState.loaderBoundaryRouteId = match.route.id), error) {
      loaderStatusCodes.push(500), appState.trackBoundaries = !1, appState.error = await serializeError(error), serverMode !== ServerMode.Test && console.error(`There was an error running the data loader for route ${match.route.id}`);
      break;
    } else if (response)
      if (routeLoaderResponses[match.route.id] = response, loaderStatusCodes.push(response.status), isCatch) {
        appState.trackCatchBoundaries = !1, appState.catch = {
          data: await extractData(response),
          status: response.status,
          statusText: response.statusText
        };
        break;
      } else
        routeData[match.route.id] = await extractData(response);
  }
  appState.catch || (appState.catchBoundaryRouteId = actionCatchBoundaryRouteId), appState.error || (appState.loaderBoundaryRouteId = actionLoaderBoundaryRouteId), appState.catch = actionCatch || appState.catch, appState.error = actionError || appState.error;
  let renderableMatches = getRenderableMatches(matches, appState);
  if (!renderableMatches) {
    renderableMatches = [];
    let root = routes2[0];
    root != null && root.module.CatchBoundary && (appState.catchBoundaryRouteId = "root", renderableMatches.push({
      params: {},
      pathname: "",
      route: routes2[0]
    }));
  }
  let notOkResponse = actionStatus && actionStatus.status !== 200 ? actionStatus.status : loaderStatusCodes.find((status) => status !== 200), responseStatusCode = appState.error ? 500 : typeof notOkResponse == "number" ? notOkResponse : appState.catch ? appState.catch.status : 200, responseHeaders = getDocumentHeaders(build, renderableMatches, routeLoaderResponses, actionResponse), entryMatches = createEntryMatches(renderableMatches, build.assets.routes), serverHandoff = {
    actionData,
    appState,
    matches: entryMatches,
    routeData
  }, entryContext = {
    ...serverHandoff,
    manifest: build.assets,
    routeModules,
    serverHandoffString: createServerHandoffString(serverHandoff)
  }, handleDocumentRequest2 = build.entry.module.default;
  try {
    return await handleDocumentRequest2(request.clone(), responseStatusCode, responseHeaders, entryContext);
  } catch (error) {
    responseStatusCode = 500, appState.trackBoundaries = !1, appState.error = await serializeError(error), entryContext.serverHandoffString = createServerHandoffString(serverHandoff);
    try {
      return await handleDocumentRequest2(request.clone(), responseStatusCode, responseHeaders, entryContext);
    } catch (error2) {
      serverMode !== ServerMode.Test && console.error(error2);
      let message = "Unexpected Server Error";
      return serverMode === ServerMode.Development && (message += `

${String(error2)}`), new Response(message, {
        status: 500,
        headers: {
          "Content-Type": "text/plain"
        }
      });
    }
  }
}
async function handleResourceRequest({
  loadContext,
  matches,
  request,
  serverMode
}) {
  let match = matches.slice(-1)[0];
  try {
    return isActionRequest(request) ? await callRouteAction({
      match,
      loadContext,
      request
    }) : await callRouteLoader({
      match,
      loadContext,
      request
    });
  } catch (error) {
    serverMode !== ServerMode.Test && console.error(error);
    let message = "Unexpected Server Error";
    return serverMode === ServerMode.Development && (message += `

${String(error)}`), new Response(message, {
      status: 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}
function isActionRequest(request) {
  let method = request.method.toLowerCase();
  return method === "post" || method === "put" || method === "patch" || method === "delete";
}
function isHeadRequest(request) {
  return request.method.toLowerCase() === "head";
}
function isValidRequestMethod(request) {
  return request.method.toLowerCase() === "get" || isHeadRequest(request) || isActionRequest(request);
}
async function errorBoundaryError(error, status) {
  return json(await serializeError(error), {
    status,
    headers: {
      "X-Remix-Error": "yes"
    }
  });
}
function isIndexRequestUrl(url) {
  for (let param of url.searchParams.getAll("index"))
    if (param === "")
      return !0;
  return !1;
}
function getRequestMatch(url, matches) {
  let match = matches.slice(-1)[0];
  return !isIndexRequestUrl(url) && match.route.id.endsWith("/index") ? matches.slice(-2)[0] : match;
}
function getDeepestRouteIdWithBoundary(matches, key) {
  let matched = getMatchesUpToDeepestBoundary(matches, key).slice(-1)[0];
  return matched ? matched.route.id : null;
}
function getMatchesUpToDeepestBoundary(matches, key) {
  let deepestBoundaryIndex = -1;
  return matches.forEach((match, index) => {
    match.route.module[key] && (deepestBoundaryIndex = index);
  }), deepestBoundaryIndex === -1 ? [] : matches.slice(0, deepestBoundaryIndex + 1);
}
function getRenderableMatches(matches, appState) {
  if (!matches)
    return null;
  if (!appState.catch && !appState.error)
    return matches;
  let lastRenderableIndex = -1;
  return matches.forEach((match, index) => {
    let id = match.route.id;
    (appState.renderBoundaryRouteId === id || appState.loaderBoundaryRouteId === id || appState.catchBoundaryRouteId === id) && (lastRenderableIndex = index);
  }), matches.slice(0, lastRenderableIndex + 1);
}
var createRequestHandler, init_server = __esm({
  "node_modules/@remix-run/server-runtime/esm/server.js"() {
    init_data();
    init_entry();
    init_errors();
    init_headers();
    init_mode();
    init_routeMatching();
    init_routes();
    init_responses();
    init_serverHandoff();
    createRequestHandler = (build, mode) => {
      let routes2 = createRoutes(build.routes), serverMode = isServerMode(mode) ? mode : ServerMode.Production;
      return async function(request, loadContext) {
        let url = new URL(request.url), matches = matchServerRoutes(routes2, url.pathname), response;
        return url.searchParams.has("_data") ? response = await handleDataRequest({
          request,
          loadContext,
          matches,
          handleDataRequest: build.entry.module.handleDataRequest,
          serverMode
        }) : matches && !matches[matches.length - 1].route.module.default ? response = await handleResourceRequest({
          request,
          loadContext,
          matches,
          serverMode
        }) : response = await handleDocumentRequest({
          build,
          loadContext,
          matches,
          request,
          routes: routes2,
          serverMode
        }), request.method.toLowerCase() === "head" ? new Response(null, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText
        }) : response;
      };
    };
  }
});

// node_modules/@remix-run/server-runtime/esm/warnings.js
function warnOnce(condition, message) {
  !condition && !alreadyWarned2[message] && (alreadyWarned2[message] = !0, console.warn(message));
}
var alreadyWarned2, init_warnings = __esm({
  "node_modules/@remix-run/server-runtime/esm/warnings.js"() {
    alreadyWarned2 = {};
  }
});

// node_modules/@remix-run/server-runtime/esm/sessions.js
function flash(name) {
  return `__flash_${name}__`;
}
function warnOnceAboutSigningSessionCookie(cookie) {
  warnOnce(cookie.isSigned, `The "${cookie.name}" cookie is not signed, but session cookies should be signed to prevent tampering on the client before they are sent back to the server. See https://remix.run/api/remix#signing-cookies for more information.`);
}
var createSession, isSession, createSessionStorageFactory, init_sessions = __esm({
  "node_modules/@remix-run/server-runtime/esm/sessions.js"() {
    init_cookies();
    init_warnings();
    createSession = (initialData = {}, id = "") => {
      let map = new Map(Object.entries(initialData));
      return {
        get id() {
          return id;
        },
        get data() {
          return Object.fromEntries(map);
        },
        has(name) {
          return map.has(name) || map.has(flash(name));
        },
        get(name) {
          if (map.has(name))
            return map.get(name);
          let flashName = flash(name);
          if (map.has(flashName)) {
            let value = map.get(flashName);
            return map.delete(flashName), value;
          }
        },
        set(name, value) {
          map.set(name, value);
        },
        flash(name, value) {
          map.set(flash(name), value);
        },
        unset(name) {
          map.delete(name);
        }
      };
    }, isSession = (object) => object != null && typeof object.id == "string" && typeof object.data < "u" && typeof object.has == "function" && typeof object.get == "function" && typeof object.set == "function" && typeof object.flash == "function" && typeof object.unset == "function", createSessionStorageFactory = (createCookie2) => ({
      cookie: cookieArg,
      createData,
      readData,
      updateData,
      deleteData
    }) => {
      let cookie = isCookie(cookieArg) ? cookieArg : createCookie2((cookieArg == null ? void 0 : cookieArg.name) || "__session", cookieArg);
      return warnOnceAboutSigningSessionCookie(cookie), {
        async getSession(cookieHeader, options) {
          let id = cookieHeader && await cookie.parse(cookieHeader, options), data = id && await readData(id);
          return createSession(data || {}, id || "");
        },
        async commitSession(session, options) {
          let {
            id,
            data
          } = session;
          return id ? await updateData(id, data, cookie.expires) : id = await createData(data, cookie.expires), cookie.serialize(id, options);
        },
        async destroySession(session, options) {
          return await deleteData(session.id), cookie.serialize("", {
            ...options,
            expires: new Date(0)
          });
        }
      };
    };
  }
});

// node_modules/@remix-run/server-runtime/esm/sessions/cookieStorage.js
var createCookieSessionStorageFactory, init_cookieStorage = __esm({
  "node_modules/@remix-run/server-runtime/esm/sessions/cookieStorage.js"() {
    init_cookies();
    init_sessions();
    createCookieSessionStorageFactory = (createCookie2) => ({
      cookie: cookieArg
    } = {}) => {
      let cookie = isCookie(cookieArg) ? cookieArg : createCookie2((cookieArg == null ? void 0 : cookieArg.name) || "__session", cookieArg);
      return warnOnceAboutSigningSessionCookie(cookie), {
        async getSession(cookieHeader, options) {
          return createSession(cookieHeader && await cookie.parse(cookieHeader, options) || {});
        },
        async commitSession(session, options) {
          let serializedCookie = await cookie.serialize(session.data, options);
          if (serializedCookie.length > 4096)
            throw new Error("Cookie length will exceed browser maximum. Length: " + serializedCookie.length);
          return serializedCookie;
        },
        async destroySession(_session, options) {
          return cookie.serialize("", {
            ...options,
            expires: new Date(0)
          });
        }
      };
    };
  }
});

// node_modules/@remix-run/server-runtime/esm/sessions/memoryStorage.js
var createMemorySessionStorageFactory, init_memoryStorage = __esm({
  "node_modules/@remix-run/server-runtime/esm/sessions/memoryStorage.js"() {
    createMemorySessionStorageFactory = (createSessionStorage2) => ({
      cookie
    } = {}) => {
      let uniqueId = 0, map = /* @__PURE__ */ new Map();
      return createSessionStorage2({
        cookie,
        async createData(data, expires) {
          let id = (++uniqueId).toString();
          return map.set(id, {
            data,
            expires
          }), id;
        },
        async readData(id) {
          if (map.has(id)) {
            let {
              data,
              expires
            } = map.get(id);
            if (!expires || expires > new Date())
              return data;
            expires && map.delete(id);
          }
          return null;
        },
        async updateData(id, data, expires) {
          map.set(id, {
            data,
            expires
          });
        },
        async deleteData(id) {
          map.delete(id);
        }
      });
    };
  }
});

// node_modules/@remix-run/server-runtime/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  createCookieFactory: () => createCookieFactory,
  createCookieSessionStorageFactory: () => createCookieSessionStorageFactory,
  createMemorySessionStorageFactory: () => createMemorySessionStorageFactory,
  createRequestHandler: () => createRequestHandler,
  createSession: () => createSession,
  createSessionStorageFactory: () => createSessionStorageFactory,
  isCookie: () => isCookie,
  isSession: () => isSession,
  json: () => json,
  redirect: () => redirect
});
var init_esm = __esm({
  "node_modules/@remix-run/server-runtime/esm/index.js"() {
    init_cookies();
    init_responses();
    init_server();
    init_sessions();
    init_cookieStorage();
    init_memoryStorage();
  }
});

// node-modules-polyfills:events
function EventHandlers() {
}
function EventEmitter() {
  EventEmitter.init.call(this);
}
function $getMaxListeners(that) {
  return that._maxListeners === void 0 ? EventEmitter.defaultMaxListeners : that._maxListeners;
}
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else
    for (var len = handler.length, listeners2 = arrayClone(handler, len), i5 = 0; i5 < len; ++i5)
      listeners2[i5].call(self);
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else
    for (var len = handler.length, listeners2 = arrayClone(handler, len), i5 = 0; i5 < len; ++i5)
      listeners2[i5].call(self, arg1);
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else
    for (var len = handler.length, listeners2 = arrayClone(handler, len), i5 = 0; i5 < len; ++i5)
      listeners2[i5].call(self, arg1, arg2);
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else
    for (var len = handler.length, listeners2 = arrayClone(handler, len), i5 = 0; i5 < len; ++i5)
      listeners2[i5].call(self, arg1, arg2, arg3);
}
function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else
    for (var len = handler.length, listeners2 = arrayClone(handler, len), i5 = 0; i5 < len; ++i5)
      listeners2[i5].apply(self, args);
}
function _addListener(target, type, listener, prepend) {
  var m4, events, existing;
  if (typeof listener != "function")
    throw new TypeError('"listener" argument must be a function');
  if (events = target._events, events ? (events.newListener && (target.emit(
    "newListener",
    type,
    listener.listener ? listener.listener : listener
  ), events = target._events), existing = events[type]) : (events = target._events = new EventHandlers(), target._eventsCount = 0), !existing)
    existing = events[type] = listener, ++target._eventsCount;
  else if (typeof existing == "function" ? existing = events[type] = prepend ? [listener, existing] : [existing, listener] : prepend ? existing.unshift(listener) : existing.push(listener), !existing.warned && (m4 = $getMaxListeners(target), m4 && m4 > 0 && existing.length > m4)) {
    existing.warned = !0;
    var w2 = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + type + " listeners added. Use emitter.setMaxListeners() to increase limit");
    w2.name = "MaxListenersExceededWarning", w2.emitter = target, w2.type = type, w2.count = existing.length, emitWarning(w2);
  }
  return target;
}
function emitWarning(e10) {
  typeof console.warn == "function" ? console.warn(e10) : console.log(e10);
}
function _onceWrap(target, type, listener) {
  var fired = !1;
  function g2() {
    target.removeListener(type, g2), fired || (fired = !0, listener.apply(target, arguments));
  }
  return g2.listener = listener, g2;
}
function listenerCount(type) {
  var events = this._events;
  if (events) {
    var evlistener = events[type];
    if (typeof evlistener == "function")
      return 1;
    if (evlistener)
      return evlistener.length;
  }
  return 0;
}
function spliceOne(list, index) {
  for (var i5 = index, k2 = i5 + 1, n6 = list.length; k2 < n6; i5 += 1, k2 += 1)
    list[i5] = list[k2];
  list.pop();
}
function arrayClone(arr, i5) {
  for (var copy2 = new Array(i5); i5--; )
    copy2[i5] = arr[i5];
  return copy2;
}
function unwrapListeners(arr) {
  for (var ret = new Array(arr.length), i5 = 0; i5 < ret.length; ++i5)
    ret[i5] = arr[i5].listener || arr[i5];
  return ret;
}
var domain, events_default, init_events = __esm({
  "node-modules-polyfills:events"() {
    "use strict";
    EventHandlers.prototype = /* @__PURE__ */ Object.create(null);
    events_default = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.usingDomains = !1;
    EventEmitter.prototype.domain = void 0;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.init = function() {
      this.domain = null, EventEmitter.usingDomains && domain.active && !(this instanceof domain.Domain) && (this.domain = domain.active), (!this._events || this._events === Object.getPrototypeOf(this)._events) && (this._events = new EventHandlers(), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter.prototype.setMaxListeners = function(n6) {
      if (typeof n6 != "number" || n6 < 0 || isNaN(n6))
        throw new TypeError('"n" argument must be a positive number');
      return this._maxListeners = n6, this;
    };
    EventEmitter.prototype.getMaxListeners = function() {
      return $getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i5, events, domain2, needDomainExit = !1, doError = type === "error";
      if (events = this._events, events)
        doError = doError && events.error == null;
      else if (!doError)
        return !1;
      if (domain2 = this.domain, doError) {
        if (er = arguments[1], domain2)
          er || (er = new Error('Uncaught, unspecified "error" event')), er.domainEmitter = this, er.domain = domain2, er.domainThrown = !1, domain2.emit("error", er);
        else {
          if (er instanceof Error)
            throw er;
          var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
          throw err.context = er, err;
        }
        return !1;
      }
      if (handler = events[type], !handler)
        return !1;
      var isFn = typeof handler == "function";
      switch (len = arguments.length, len) {
        case 1:
          emitNone(handler, isFn, this);
          break;
        case 2:
          emitOne(handler, isFn, this, arguments[1]);
          break;
        case 3:
          emitTwo(handler, isFn, this, arguments[1], arguments[2]);
          break;
        case 4:
          emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
          break;
        default:
          for (args = new Array(len - 1), i5 = 1; i5 < len; i5++)
            args[i5 - 1] = arguments[i5];
          emitMany(handler, isFn, this, args);
      }
      return needDomainExit && domain2.exit(), !0;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      return _addListener(this, type, listener, !1);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function(type, listener) {
      return _addListener(this, type, listener, !0);
    };
    EventEmitter.prototype.once = function(type, listener) {
      if (typeof listener != "function")
        throw new TypeError('"listener" argument must be a function');
      return this.on(type, _onceWrap(this, type, listener)), this;
    };
    EventEmitter.prototype.prependOnceListener = function(type, listener) {
      if (typeof listener != "function")
        throw new TypeError('"listener" argument must be a function');
      return this.prependListener(type, _onceWrap(this, type, listener)), this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, events, position, i5, originalListener;
      if (typeof listener != "function")
        throw new TypeError('"listener" argument must be a function');
      if (events = this._events, !events)
        return this;
      if (list = events[type], !list)
        return this;
      if (list === listener || list.listener && list.listener === listener)
        --this._eventsCount === 0 ? this._events = new EventHandlers() : (delete events[type], events.removeListener && this.emit("removeListener", type, list.listener || listener));
      else if (typeof list != "function") {
        for (position = -1, i5 = list.length; i5-- > 0; )
          if (list[i5] === listener || list[i5].listener && list[i5].listener === listener) {
            originalListener = list[i5].listener, position = i5;
            break;
          }
        if (position < 0)
          return this;
        if (list.length === 1) {
          if (list[0] = void 0, --this._eventsCount === 0)
            return this._events = new EventHandlers(), this;
          delete events[type];
        } else
          spliceOne(list, position);
        events.removeListener && this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var listeners2, events;
      if (events = this._events, !events)
        return this;
      if (!events.removeListener)
        return arguments.length === 0 ? (this._events = new EventHandlers(), this._eventsCount = 0) : events[type] && (--this._eventsCount === 0 ? this._events = new EventHandlers() : delete events[type]), this;
      if (arguments.length === 0) {
        for (var keys2 = Object.keys(events), i5 = 0, key; i5 < keys2.length; ++i5)
          key = keys2[i5], key !== "removeListener" && this.removeAllListeners(key);
        return this.removeAllListeners("removeListener"), this._events = new EventHandlers(), this._eventsCount = 0, this;
      }
      if (listeners2 = events[type], typeof listeners2 == "function")
        this.removeListener(type, listeners2);
      else if (listeners2)
        do
          this.removeListener(type, listeners2[listeners2.length - 1]);
        while (listeners2[0]);
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var evlistener, ret, events = this._events;
      return events ? (evlistener = events[type], evlistener ? typeof evlistener == "function" ? ret = [evlistener.listener || evlistener] : ret = unwrapListeners(evlistener) : ret = []) : ret = [], ret;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return typeof emitter.listenerCount == "function" ? emitter.listenerCount(type) : listenerCount.call(emitter, type);
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    EventEmitter.prototype.eventNames = function() {
      return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
    };
  }
});

// node-modules-polyfills:process
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout)
    return setTimeout(fun, 0);
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout)
    return cachedSetTimeout = setTimeout, setTimeout(fun, 0);
  try {
    return cachedSetTimeout(fun, 0);
  } catch {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout)
    return clearTimeout(marker);
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout)
    return cachedClearTimeout = clearTimeout, clearTimeout(marker);
  try {
    return cachedClearTimeout(marker);
  } catch {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
function cleanUpNextTick() {
  !draining || !currentQueue || (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue());
}
function drainQueue() {
  if (!draining) {
    var timeout = runTimeout(cleanUpNextTick);
    draining = !0;
    for (var len = queue.length; len; ) {
      for (currentQueue = queue, queue = []; ++queueIndex < len; )
        currentQueue && currentQueue[queueIndex].run();
      queueIndex = -1, len = queue.length;
    }
    currentQueue = null, draining = !1, runClearTimeout(timeout);
  }
}
function nextTick(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var i5 = 1; i5 < arguments.length; i5++)
      args[i5 - 1] = arguments[i5];
  queue.push(new Item(fun, args)), queue.length === 1 && !draining && runTimeout(drainQueue);
}
function Item(fun, array) {
  this.fun = fun, this.array = array;
}
function noop() {
}
function binding(name) {
  throw new Error("process.binding is not supported");
}
function cwd() {
  return "/";
}
function chdir(dir) {
  throw new Error("process.chdir is not supported");
}
function umask() {
  return 0;
}
function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3, seconds = Math.floor(clocktime), nanoseconds = Math.floor(clocktime % 1 * 1e9);
  return previousTimestamp && (seconds = seconds - previousTimestamp[0], nanoseconds = nanoseconds - previousTimestamp[1], nanoseconds < 0 && (seconds--, nanoseconds += 1e9)), [seconds, nanoseconds];
}
function uptime() {
  var currentTime = new Date(), dif = currentTime - startTime;
  return dif / 1e3;
}
var cachedSetTimeout, cachedClearTimeout, queue, draining, currentQueue, queueIndex, title, platform, browser, env, argv, version, versions, release, config, on, addListener2, once2, off, removeListener2, removeAllListeners2, emit2, performance, performanceNow, startTime, browser$1, process_default, init_process = __esm({
  "node-modules-polyfills:process"() {
    cachedSetTimeout = defaultSetTimout, cachedClearTimeout = defaultClearTimeout;
    typeof globalThis.setTimeout == "function" && (cachedSetTimeout = setTimeout);
    typeof globalThis.clearTimeout == "function" && (cachedClearTimeout = clearTimeout);
    queue = [], draining = !1, queueIndex = -1;
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    title = "browser", platform = "browser", browser = !0, env = {}, argv = [], version = "", versions = {}, release = {}, config = {};
    on = noop, addListener2 = noop, once2 = noop, off = noop, removeListener2 = noop, removeAllListeners2 = noop, emit2 = noop;
    performance = globalThis.performance || {}, performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
      return new Date().getTime();
    };
    startTime = new Date();
    browser$1 = {
      nextTick,
      title,
      browser,
      env,
      argv,
      version,
      versions,
      on,
      addListener: addListener2,
      once: once2,
      off,
      removeListener: removeListener2,
      removeAllListeners: removeAllListeners2,
      emit: emit2,
      binding,
      cwd,
      chdir,
      umask,
      hrtime,
      platform,
      release,
      config,
      uptime
    }, process_default = browser$1;
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/inherits.js
var inherits, inherits_default, init_inherits = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/inherits.js"() {
    typeof Object.create == "function" ? inherits = function(ctor, superCtor) {
      ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      });
    } : inherits = function(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype, ctor.prototype = new TempCtor(), ctor.prototype.constructor = ctor;
    };
    inherits_default = inherits;
  }
});

// node-modules-polyfills:util
function format(f2) {
  if (!isString(f2)) {
    for (var objects = [], i5 = 0; i5 < arguments.length; i5++)
      objects.push(inspect(arguments[i5]));
    return objects.join(" ");
  }
  for (var i5 = 1, args = arguments, len = args.length, str = String(f2).replace(formatRegExp, function(x4) {
    if (x4 === "%%")
      return "%";
    if (i5 >= len)
      return x4;
    switch (x4) {
      case "%s":
        return String(args[i5++]);
      case "%d":
        return Number(args[i5++]);
      case "%j":
        try {
          return JSON.stringify(args[i5++]);
        } catch {
          return "[Circular]";
        }
      default:
        return x4;
    }
  }), x3 = args[i5]; i5 < len; x3 = args[++i5])
    isNull(x3) || !isObject(x3) ? str += " " + x3 : str += " " + inspect(x3);
  return str;
}
function deprecate(fn, msg) {
  if (isUndefined(globalThis.process))
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  if (process_default.noDeprecation === !0)
    return fn;
  var warned = !1;
  function deprecated() {
    if (!warned) {
      if (process_default.throwDeprecation)
        throw new Error(msg);
      process_default.traceDeprecation ? console.trace(msg) : console.error(msg), warned = !0;
    }
    return fn.apply(this, arguments);
  }
  return deprecated;
}
function debuglog(set) {
  if (isUndefined(debugEnviron) && (debugEnviron = process_default.env.NODE_DEBUG || ""), set = set.toUpperCase(), !debugs[set])
    if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format.apply(null, arguments);
        console.error("%s %d: %s", set, pid, msg);
      };
    } else
      debugs[set] = function() {
      };
  return debugs[set];
}
function inspect(obj, opts) {
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  return arguments.length >= 3 && (ctx.depth = arguments[2]), arguments.length >= 4 && (ctx.colors = arguments[3]), isBoolean(opts) ? ctx.showHidden = opts : opts && _extend(ctx, opts), isUndefined(ctx.showHidden) && (ctx.showHidden = !1), isUndefined(ctx.depth) && (ctx.depth = 2), isUndefined(ctx.colors) && (ctx.colors = !1), isUndefined(ctx.customInspect) && (ctx.customInspect = !0), ctx.colors && (ctx.stylize = stylizeWithColor), formatValue(ctx, obj, ctx.depth);
}
function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];
  return style ? "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m" : str;
}
function stylizeNoColor(str, styleType) {
  return str;
}
function arrayToHash(array) {
  var hash = {};
  return array.forEach(function(val, idx) {
    hash[val] = !0;
  }), hash;
}
function formatValue(ctx, value, recurseTimes) {
  if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== inspect && !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    return isString(ret) || (ret = formatValue(ctx, ret, recurseTimes)), ret;
  }
  var primitive = formatPrimitive(ctx, value);
  if (primitive)
    return primitive;
  var keys2 = Object.keys(value), visibleKeys = arrayToHash(keys2);
  if (ctx.showHidden && (keys2 = Object.getOwnPropertyNames(value)), isError(value) && (keys2.indexOf("message") >= 0 || keys2.indexOf("description") >= 0))
    return formatError(value);
  if (keys2.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ": " + value.name : "";
      return ctx.stylize("[Function" + name + "]", "special");
    }
    if (isRegExp(value))
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    if (isDate(value))
      return ctx.stylize(Date.prototype.toString.call(value), "date");
    if (isError(value))
      return formatError(value);
  }
  var base = "", array = !1, braces = ["{", "}"];
  if (isArray(value) && (array = !0, braces = ["[", "]"]), isFunction(value)) {
    var n6 = value.name ? ": " + value.name : "";
    base = " [Function" + n6 + "]";
  }
  if (isRegExp(value) && (base = " " + RegExp.prototype.toString.call(value)), isDate(value) && (base = " " + Date.prototype.toUTCString.call(value)), isError(value) && (base = " " + formatError(value)), keys2.length === 0 && (!array || value.length == 0))
    return braces[0] + base + braces[1];
  if (recurseTimes < 0)
    return isRegExp(value) ? ctx.stylize(RegExp.prototype.toString.call(value), "regexp") : ctx.stylize("[Object]", "special");
  ctx.seen.push(value);
  var output;
  return array ? output = formatArray(ctx, value, recurseTimes, visibleKeys, keys2) : output = keys2.map(function(key) {
    return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
  }), ctx.seen.pop(), reduceToSingleString(output, base, braces);
}
function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize("undefined", "undefined");
  if (isString(value)) {
    var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return ctx.stylize(simple, "string");
  }
  if (isNumber(value))
    return ctx.stylize("" + value, "number");
  if (isBoolean(value))
    return ctx.stylize("" + value, "boolean");
  if (isNull(value))
    return ctx.stylize("null", "null");
}
function formatError(value) {
  return "[" + Error.prototype.toString.call(value) + "]";
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys2) {
  for (var output = [], i5 = 0, l4 = value.length; i5 < l4; ++i5)
    hasOwnProperty(value, String(i5)) ? output.push(formatProperty(
      ctx,
      value,
      recurseTimes,
      visibleKeys,
      String(i5),
      !0
    )) : output.push("");
  return keys2.forEach(function(key) {
    key.match(/^\d+$/) || output.push(formatProperty(
      ctx,
      value,
      recurseTimes,
      visibleKeys,
      key,
      !0
    ));
  }), output;
}
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  if (desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] }, desc.get ? desc.set ? str = ctx.stylize("[Getter/Setter]", "special") : str = ctx.stylize("[Getter]", "special") : desc.set && (str = ctx.stylize("[Setter]", "special")), hasOwnProperty(visibleKeys, key) || (name = "[" + key + "]"), str || (ctx.seen.indexOf(desc.value) < 0 ? (isNull(recurseTimes) ? str = formatValue(ctx, desc.value, null) : str = formatValue(ctx, desc.value, recurseTimes - 1), str.indexOf(`
`) > -1 && (array ? str = str.split(`
`).map(function(line) {
    return "  " + line;
  }).join(`
`).substr(2) : str = `
` + str.split(`
`).map(function(line) {
    return "   " + line;
  }).join(`
`))) : str = ctx.stylize("[Circular]", "special")), isUndefined(name)) {
    if (array && key.match(/^\d+$/))
      return str;
    name = JSON.stringify("" + key), name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (name = name.substr(1, name.length - 2), name = ctx.stylize(name, "name")) : (name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), name = ctx.stylize(name, "string"));
  }
  return name + ": " + str;
}
function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0, length = output.reduce(function(prev, cur) {
    return numLinesEst++, cur.indexOf(`
`) >= 0 && numLinesEst++, prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  return length > 60 ? braces[0] + (base === "" ? "" : base + `
 `) + " " + output.join(`,
  `) + " " + braces[1] : braces[0] + base + " " + output.join(", ") + " " + braces[1];
}
function isArray(ar) {
  return Array.isArray(ar);
}
function isBoolean(arg) {
  return typeof arg == "boolean";
}
function isNull(arg) {
  return arg === null;
}
function isNumber(arg) {
  return typeof arg == "number";
}
function isString(arg) {
  return typeof arg == "string";
}
function isUndefined(arg) {
  return arg === void 0;
}
function isRegExp(re) {
  return isObject(re) && objectToString(re) === "[object RegExp]";
}
function isObject(arg) {
  return typeof arg == "object" && arg !== null;
}
function isDate(d3) {
  return isObject(d3) && objectToString(d3) === "[object Date]";
}
function isError(e10) {
  return isObject(e10) && (objectToString(e10) === "[object Error]" || e10 instanceof Error);
}
function isFunction(arg) {
  return typeof arg == "function";
}
function objectToString(o11) {
  return Object.prototype.toString.call(o11);
}
function _extend(origin, add) {
  if (!add || !isObject(add))
    return origin;
  for (var keys2 = Object.keys(add), i5 = keys2.length; i5--; )
    origin[keys2[i5]] = add[keys2[i5]];
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var formatRegExp, debugs, debugEnviron, init_util = __esm({
  "node-modules-polyfills:util"() {
    init_process();
    init_inherits();
    formatRegExp = /%[sdj%]/g;
    debugs = {};
    inspect.colors = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39]
    };
    inspect.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      regexp: "red"
    };
  }
});

// node-modules-polyfills:buffer
function init() {
  inited = !0;
  for (var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i5 = 0, len = code.length; i5 < len; ++i5)
    lookup[i5] = code[i5], revLookup[code.charCodeAt(i5)] = i5;
  revLookup["-".charCodeAt(0)] = 62, revLookup["_".charCodeAt(0)] = 63;
}
function toByteArray(b64) {
  inited || init();
  var i5, j2, l4, tmp, placeHolders, arr, len = b64.length;
  if (len % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0, arr = new Arr(len * 3 / 4 - placeHolders), l4 = placeHolders > 0 ? len - 4 : len;
  var L2 = 0;
  for (i5 = 0, j2 = 0; i5 < l4; i5 += 4, j2 += 3)
    tmp = revLookup[b64.charCodeAt(i5)] << 18 | revLookup[b64.charCodeAt(i5 + 1)] << 12 | revLookup[b64.charCodeAt(i5 + 2)] << 6 | revLookup[b64.charCodeAt(i5 + 3)], arr[L2++] = tmp >> 16 & 255, arr[L2++] = tmp >> 8 & 255, arr[L2++] = tmp & 255;
  return placeHolders === 2 ? (tmp = revLookup[b64.charCodeAt(i5)] << 2 | revLookup[b64.charCodeAt(i5 + 1)] >> 4, arr[L2++] = tmp & 255) : placeHolders === 1 && (tmp = revLookup[b64.charCodeAt(i5)] << 10 | revLookup[b64.charCodeAt(i5 + 1)] << 4 | revLookup[b64.charCodeAt(i5 + 2)] >> 2, arr[L2++] = tmp >> 8 & 255, arr[L2++] = tmp & 255), arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  for (var tmp, output = [], i5 = start; i5 < end; i5 += 3)
    tmp = (uint8[i5] << 16) + (uint8[i5 + 1] << 8) + uint8[i5 + 2], output.push(tripletToBase64(tmp));
  return output.join("");
}
function fromByteArray(uint8) {
  inited || init();
  for (var tmp, len = uint8.length, extraBytes = len % 3, output = "", parts = [], maxChunkLength = 16383, i5 = 0, len2 = len - extraBytes; i5 < len2; i5 += maxChunkLength)
    parts.push(encodeChunk(uint8, i5, i5 + maxChunkLength > len2 ? len2 : i5 + maxChunkLength));
  return extraBytes === 1 ? (tmp = uint8[len - 1], output += lookup[tmp >> 2], output += lookup[tmp << 4 & 63], output += "==") : extraBytes === 2 && (tmp = (uint8[len - 2] << 8) + uint8[len - 1], output += lookup[tmp >> 10], output += lookup[tmp >> 4 & 63], output += lookup[tmp << 2 & 63], output += "="), parts.push(output), parts.join("");
}
function read(buffer, offset, isLE, mLen, nBytes) {
  var e10, m4, eLen = nBytes * 8 - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, nBits = -7, i5 = isLE ? nBytes - 1 : 0, d3 = isLE ? -1 : 1, s6 = buffer[offset + i5];
  for (i5 += d3, e10 = s6 & (1 << -nBits) - 1, s6 >>= -nBits, nBits += eLen; nBits > 0; e10 = e10 * 256 + buffer[offset + i5], i5 += d3, nBits -= 8)
    ;
  for (m4 = e10 & (1 << -nBits) - 1, e10 >>= -nBits, nBits += mLen; nBits > 0; m4 = m4 * 256 + buffer[offset + i5], i5 += d3, nBits -= 8)
    ;
  if (e10 === 0)
    e10 = 1 - eBias;
  else {
    if (e10 === eMax)
      return m4 ? NaN : (s6 ? -1 : 1) * (1 / 0);
    m4 = m4 + Math.pow(2, mLen), e10 = e10 - eBias;
  }
  return (s6 ? -1 : 1) * m4 * Math.pow(2, e10 - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
  var e10, m4, c4, eLen = nBytes * 8 - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, i5 = isLE ? 0 : nBytes - 1, d3 = isLE ? 1 : -1, s6 = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  for (value = Math.abs(value), isNaN(value) || value === 1 / 0 ? (m4 = isNaN(value) ? 1 : 0, e10 = eMax) : (e10 = Math.floor(Math.log(value) / Math.LN2), value * (c4 = Math.pow(2, -e10)) < 1 && (e10--, c4 *= 2), e10 + eBias >= 1 ? value += rt / c4 : value += rt * Math.pow(2, 1 - eBias), value * c4 >= 2 && (e10++, c4 /= 2), e10 + eBias >= eMax ? (m4 = 0, e10 = eMax) : e10 + eBias >= 1 ? (m4 = (value * c4 - 1) * Math.pow(2, mLen), e10 = e10 + eBias) : (m4 = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen), e10 = 0)); mLen >= 8; buffer[offset + i5] = m4 & 255, i5 += d3, m4 /= 256, mLen -= 8)
    ;
  for (e10 = e10 << mLen | m4, eLen += mLen; eLen > 0; buffer[offset + i5] = e10 & 255, i5 += d3, e10 /= 256, eLen -= 8)
    ;
  buffer[offset + i5 - d3] |= s6 * 128;
}
function kMaxLength() {
  return Buffer2.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function createBuffer(that, length) {
  if (kMaxLength() < length)
    throw new RangeError("Invalid typed array length");
  return Buffer2.TYPED_ARRAY_SUPPORT ? (that = new Uint8Array(length), that.__proto__ = Buffer2.prototype) : (that === null && (that = new Buffer2(length)), that.length = length), that;
}
function Buffer2(arg, encodingOrOffset, length) {
  if (!Buffer2.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer2))
    return new Buffer2(arg, encodingOrOffset, length);
  if (typeof arg == "number") {
    if (typeof encodingOrOffset == "string")
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}
function from(that, value, encodingOrOffset, length) {
  if (typeof value == "number")
    throw new TypeError('"value" argument must not be a number');
  return typeof ArrayBuffer < "u" && value instanceof ArrayBuffer ? fromArrayBuffer(that, value, encodingOrOffset, length) : typeof value == "string" ? fromString(that, value, encodingOrOffset) : fromObject(that, value);
}
function assertSize(size) {
  if (typeof size != "number")
    throw new TypeError('"size" argument must be a number');
  if (size < 0)
    throw new RangeError('"size" argument must not be negative');
}
function alloc(that, size, fill2, encoding) {
  return assertSize(size), size <= 0 ? createBuffer(that, size) : fill2 !== void 0 ? typeof encoding == "string" ? createBuffer(that, size).fill(fill2, encoding) : createBuffer(that, size).fill(fill2) : createBuffer(that, size);
}
function allocUnsafe(that, size) {
  if (assertSize(size), that = createBuffer(that, size < 0 ? 0 : checked(size) | 0), !Buffer2.TYPED_ARRAY_SUPPORT)
    for (var i5 = 0; i5 < size; ++i5)
      that[i5] = 0;
  return that;
}
function fromString(that, string, encoding) {
  if ((typeof encoding != "string" || encoding === "") && (encoding = "utf8"), !Buffer2.isEncoding(encoding))
    throw new TypeError('"encoding" must be a valid string encoding');
  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);
  return actual !== length && (that = that.slice(0, actual)), that;
}
function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i5 = 0; i5 < length; i5 += 1)
    that[i5] = array[i5] & 255;
  return that;
}
function fromArrayBuffer(that, array, byteOffset, length) {
  if (array.byteLength, byteOffset < 0 || array.byteLength < byteOffset)
    throw new RangeError("'offset' is out of bounds");
  if (array.byteLength < byteOffset + (length || 0))
    throw new RangeError("'length' is out of bounds");
  return byteOffset === void 0 && length === void 0 ? array = new Uint8Array(array) : length === void 0 ? array = new Uint8Array(array, byteOffset) : array = new Uint8Array(array, byteOffset, length), Buffer2.TYPED_ARRAY_SUPPORT ? (that = array, that.__proto__ = Buffer2.prototype) : that = fromArrayLike(that, array), that;
}
function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    return that = createBuffer(that, len), that.length === 0 || obj.copy(that, 0, 0, len), that;
  }
  if (obj) {
    if (typeof ArrayBuffer < "u" && obj.buffer instanceof ArrayBuffer || "length" in obj)
      return typeof obj.length != "number" || isnan(obj.length) ? createBuffer(that, 0) : fromArrayLike(that, obj);
    if (obj.type === "Buffer" && isArray2(obj.data))
      return fromArrayLike(that, obj.data);
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function checked(length) {
  if (length >= kMaxLength())
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
  return length | 0;
}
function internalIsBuffer(b3) {
  return !!(b3 != null && b3._isBuffer);
}
function byteLength(string, encoding) {
  if (internalIsBuffer(string))
    return string.length;
  if (typeof ArrayBuffer < "u" && typeof ArrayBuffer.isView == "function" && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer))
    return string.byteLength;
  typeof string != "string" && (string = "" + string);
  var len = string.length;
  if (len === 0)
    return 0;
  for (var loweredCase = !1; ; )
    switch (encoding) {
      case "ascii":
      case "latin1":
      case "binary":
        return len;
      case "utf8":
      case "utf-8":
      case void 0:
        return utf8ToBytes(string).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return len * 2;
      case "hex":
        return len >>> 1;
      case "base64":
        return base64ToBytes(string).length;
      default:
        if (loweredCase)
          return utf8ToBytes(string).length;
        encoding = ("" + encoding).toLowerCase(), loweredCase = !0;
    }
}
function slowToString(encoding, start, end) {
  var loweredCase = !1;
  if ((start === void 0 || start < 0) && (start = 0), start > this.length || ((end === void 0 || end > this.length) && (end = this.length), end <= 0) || (end >>>= 0, start >>>= 0, end <= start))
    return "";
  for (encoding || (encoding = "utf8"); ; )
    switch (encoding) {
      case "hex":
        return hexSlice(this, start, end);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, start, end);
      case "ascii":
        return asciiSlice(this, start, end);
      case "latin1":
      case "binary":
        return latin1Slice(this, start, end);
      case "base64":
        return base64Slice(this, start, end);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, start, end);
      default:
        if (loweredCase)
          throw new TypeError("Unknown encoding: " + encoding);
        encoding = (encoding + "").toLowerCase(), loweredCase = !0;
    }
}
function swap(b3, n6, m4) {
  var i5 = b3[n6];
  b3[n6] = b3[m4], b3[m4] = i5;
}
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  if (buffer.length === 0)
    return -1;
  if (typeof byteOffset == "string" ? (encoding = byteOffset, byteOffset = 0) : byteOffset > 2147483647 ? byteOffset = 2147483647 : byteOffset < -2147483648 && (byteOffset = -2147483648), byteOffset = +byteOffset, isNaN(byteOffset) && (byteOffset = dir ? 0 : buffer.length - 1), byteOffset < 0 && (byteOffset = buffer.length + byteOffset), byteOffset >= buffer.length) {
    if (dir)
      return -1;
    byteOffset = buffer.length - 1;
  } else if (byteOffset < 0)
    if (dir)
      byteOffset = 0;
    else
      return -1;
  if (typeof val == "string" && (val = Buffer2.from(val, encoding)), internalIsBuffer(val))
    return val.length === 0 ? -1 : arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  if (typeof val == "number")
    return val = val & 255, Buffer2.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function" ? dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset) : arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1, arrLength = arr.length, valLength = val.length;
  if (encoding !== void 0 && (encoding = String(encoding).toLowerCase(), encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le")) {
    if (arr.length < 2 || val.length < 2)
      return -1;
    indexSize = 2, arrLength /= 2, valLength /= 2, byteOffset /= 2;
  }
  function read2(buf, i6) {
    return indexSize === 1 ? buf[i6] : buf.readUInt16BE(i6 * indexSize);
  }
  var i5;
  if (dir) {
    var foundIndex = -1;
    for (i5 = byteOffset; i5 < arrLength; i5++)
      if (read2(arr, i5) === read2(val, foundIndex === -1 ? 0 : i5 - foundIndex)) {
        if (foundIndex === -1 && (foundIndex = i5), i5 - foundIndex + 1 === valLength)
          return foundIndex * indexSize;
      } else
        foundIndex !== -1 && (i5 -= i5 - foundIndex), foundIndex = -1;
  } else
    for (byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength), i5 = byteOffset; i5 >= 0; i5--) {
      for (var found = !0, j2 = 0; j2 < valLength; j2++)
        if (read2(arr, i5 + j2) !== read2(val, j2)) {
          found = !1;
          break;
        }
      if (found)
        return i5;
    }
  return -1;
}
function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  length ? (length = Number(length), length > remaining && (length = remaining)) : length = remaining;
  var strLen = string.length;
  if (strLen % 2 !== 0)
    throw new TypeError("Invalid hex string");
  length > strLen / 2 && (length = strLen / 2);
  for (var i5 = 0; i5 < length; ++i5) {
    var parsed = parseInt(string.substr(i5 * 2, 2), 16);
    if (isNaN(parsed))
      return i5;
    buf[offset + i5] = parsed;
  }
  return i5;
}
function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}
function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
function base64Slice(buf, start, end) {
  return start === 0 && end === buf.length ? fromByteArray(buf) : fromByteArray(buf.slice(start, end));
}
function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  for (var res = [], i5 = start; i5 < end; ) {
    var firstByte = buf[i5], codePoint = null, bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (i5 + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          firstByte < 128 && (codePoint = firstByte);
          break;
        case 2:
          secondByte = buf[i5 + 1], (secondByte & 192) === 128 && (tempCodePoint = (firstByte & 31) << 6 | secondByte & 63, tempCodePoint > 127 && (codePoint = tempCodePoint));
          break;
        case 3:
          secondByte = buf[i5 + 1], thirdByte = buf[i5 + 2], (secondByte & 192) === 128 && (thirdByte & 192) === 128 && (tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63, tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343) && (codePoint = tempCodePoint));
          break;
        case 4:
          secondByte = buf[i5 + 1], thirdByte = buf[i5 + 2], fourthByte = buf[i5 + 3], (secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128 && (tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63, tempCodePoint > 65535 && tempCodePoint < 1114112 && (codePoint = tempCodePoint));
      }
    }
    codePoint === null ? (codePoint = 65533, bytesPerSequence = 1) : codePoint > 65535 && (codePoint -= 65536, res.push(codePoint >>> 10 & 1023 | 55296), codePoint = 56320 | codePoint & 1023), res.push(codePoint), i5 += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH)
    return String.fromCharCode.apply(String, codePoints);
  for (var res = "", i5 = 0; i5 < len; )
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i5, i5 += MAX_ARGUMENTS_LENGTH)
    );
  return res;
}
function asciiSlice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i5 = start; i5 < end; ++i5)
    ret += String.fromCharCode(buf[i5] & 127);
  return ret;
}
function latin1Slice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i5 = start; i5 < end; ++i5)
    ret += String.fromCharCode(buf[i5]);
  return ret;
}
function hexSlice(buf, start, end) {
  var len = buf.length;
  (!start || start < 0) && (start = 0), (!end || end < 0 || end > len) && (end = len);
  for (var out = "", i5 = start; i5 < end; ++i5)
    out += toHex(buf[i5]);
  return out;
}
function utf16leSlice(buf, start, end) {
  for (var bytes = buf.slice(start, end), res = "", i5 = 0; i5 < bytes.length; i5 += 2)
    res += String.fromCharCode(bytes[i5] + bytes[i5 + 1] * 256);
  return res;
}
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0)
    throw new RangeError("offset is not uint");
  if (offset + ext > length)
    throw new RangeError("Trying to access beyond buffer length");
}
function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min)
    throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
}
function objectWriteUInt16(buf, value, offset, littleEndian) {
  value < 0 && (value = 65535 + value + 1);
  for (var i5 = 0, j2 = Math.min(buf.length - offset, 2); i5 < j2; ++i5)
    buf[offset + i5] = (value & 255 << 8 * (littleEndian ? i5 : 1 - i5)) >>> (littleEndian ? i5 : 1 - i5) * 8;
}
function objectWriteUInt32(buf, value, offset, littleEndian) {
  value < 0 && (value = 4294967295 + value + 1);
  for (var i5 = 0, j2 = Math.min(buf.length - offset, 4); i5 < j2; ++i5)
    buf[offset + i5] = value >>> (littleEndian ? i5 : 3 - i5) * 8 & 255;
}
function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
  if (offset < 0)
    throw new RangeError("Index out of range");
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
  return noAssert || checkIEEE754(buf, value, offset, 4), write(buf, value, offset, littleEndian, 23, 4), offset + 4;
}
function writeDouble(buf, value, offset, littleEndian, noAssert) {
  return noAssert || checkIEEE754(buf, value, offset, 8), write(buf, value, offset, littleEndian, 52, 8), offset + 8;
}
function base64clean(str) {
  if (str = stringtrim(str).replace(INVALID_BASE64_RE, ""), str.length < 2)
    return "";
  for (; str.length % 4 !== 0; )
    str = str + "=";
  return str;
}
function stringtrim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
}
function toHex(n6) {
  return n6 < 16 ? "0" + n6.toString(16) : n6.toString(16);
}
function utf8ToBytes(string, units) {
  units = units || 1 / 0;
  for (var codePoint, length = string.length, leadSurrogate = null, bytes = [], i5 = 0; i5 < length; ++i5) {
    if (codePoint = string.charCodeAt(i5), codePoint > 55295 && codePoint < 57344) {
      if (!leadSurrogate) {
        if (codePoint > 56319) {
          (units -= 3) > -1 && bytes.push(239, 191, 189);
          continue;
        } else if (i5 + 1 === length) {
          (units -= 3) > -1 && bytes.push(239, 191, 189);
          continue;
        }
        leadSurrogate = codePoint;
        continue;
      }
      if (codePoint < 56320) {
        (units -= 3) > -1 && bytes.push(239, 191, 189), leadSurrogate = codePoint;
        continue;
      }
      codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
    } else
      leadSurrogate && (units -= 3) > -1 && bytes.push(239, 191, 189);
    if (leadSurrogate = null, codePoint < 128) {
      if ((units -= 1) < 0)
        break;
      bytes.push(codePoint);
    } else if (codePoint < 2048) {
      if ((units -= 2) < 0)
        break;
      bytes.push(
        codePoint >> 6 | 192,
        codePoint & 63 | 128
      );
    } else if (codePoint < 65536) {
      if ((units -= 3) < 0)
        break;
      bytes.push(
        codePoint >> 12 | 224,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else if (codePoint < 1114112) {
      if ((units -= 4) < 0)
        break;
      bytes.push(
        codePoint >> 18 | 240,
        codePoint >> 12 & 63 | 128,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else
      throw new Error("Invalid code point");
  }
  return bytes;
}
function asciiToBytes(str) {
  for (var byteArray = [], i5 = 0; i5 < str.length; ++i5)
    byteArray.push(str.charCodeAt(i5) & 255);
  return byteArray;
}
function utf16leToBytes(str, units) {
  for (var c4, hi, lo, byteArray = [], i5 = 0; i5 < str.length && !((units -= 2) < 0); ++i5)
    c4 = str.charCodeAt(i5), hi = c4 >> 8, lo = c4 % 256, byteArray.push(lo), byteArray.push(hi);
  return byteArray;
}
function base64ToBytes(str) {
  return toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
  for (var i5 = 0; i5 < length && !(i5 + offset >= dst.length || i5 >= src.length); ++i5)
    dst[i5 + offset] = src[i5];
  return i5;
}
function isnan(val) {
  return val !== val;
}
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
}
function isFastBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer == "function" && obj.constructor.isBuffer(obj);
}
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE == "function" && typeof obj.slice == "function" && isFastBuffer(obj.slice(0, 0));
}
var lookup, revLookup, Arr, inited, toString, isArray2, INSPECT_MAX_BYTES, _kMaxLength, MAX_ARGUMENTS_LENGTH, INVALID_BASE64_RE, init_buffer = __esm({
  "node-modules-polyfills:buffer"() {
    lookup = [], revLookup = [], Arr = typeof Uint8Array < "u" ? Uint8Array : Array, inited = !1;
    toString = {}.toString, isArray2 = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
    INSPECT_MAX_BYTES = 50;
    Buffer2.TYPED_ARRAY_SUPPORT = globalThis.TYPED_ARRAY_SUPPORT !== void 0 ? globalThis.TYPED_ARRAY_SUPPORT : !0;
    _kMaxLength = kMaxLength();
    Buffer2.poolSize = 8192;
    Buffer2._augment = function(arr) {
      return arr.__proto__ = Buffer2.prototype, arr;
    };
    Buffer2.from = function(value, encodingOrOffset, length) {
      return from(null, value, encodingOrOffset, length);
    };
    Buffer2.TYPED_ARRAY_SUPPORT && (Buffer2.prototype.__proto__ = Uint8Array.prototype, Buffer2.__proto__ = Uint8Array);
    Buffer2.alloc = function(size, fill2, encoding) {
      return alloc(null, size, fill2, encoding);
    };
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(null, size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(null, size);
    };
    Buffer2.isBuffer = isBuffer;
    Buffer2.compare = function(a4, b3) {
      if (!internalIsBuffer(a4) || !internalIsBuffer(b3))
        throw new TypeError("Arguments must be Buffers");
      if (a4 === b3)
        return 0;
      for (var x3 = a4.length, y3 = b3.length, i5 = 0, len = Math.min(x3, y3); i5 < len; ++i5)
        if (a4[i5] !== b3[i5]) {
          x3 = a4[i5], y3 = b3[i5];
          break;
        }
      return x3 < y3 ? -1 : y3 < x3 ? 1 : 0;
    };
    Buffer2.isEncoding = function(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    };
    Buffer2.concat = function(list, length) {
      if (!isArray2(list))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (list.length === 0)
        return Buffer2.alloc(0);
      var i5;
      if (length === void 0)
        for (length = 0, i5 = 0; i5 < list.length; ++i5)
          length += list[i5].length;
      var buffer = Buffer2.allocUnsafe(length), pos = 0;
      for (i5 = 0; i5 < list.length; ++i5) {
        var buf = list[i5];
        if (!internalIsBuffer(buf))
          throw new TypeError('"list" argument must be an Array of Buffers');
        buf.copy(buffer, pos), pos += buf.length;
      }
      return buffer;
    };
    Buffer2.byteLength = byteLength;
    Buffer2.prototype._isBuffer = !0;
    Buffer2.prototype.swap16 = function() {
      var len = this.length;
      if (len % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var i5 = 0; i5 < len; i5 += 2)
        swap(this, i5, i5 + 1);
      return this;
    };
    Buffer2.prototype.swap32 = function() {
      var len = this.length;
      if (len % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var i5 = 0; i5 < len; i5 += 4)
        swap(this, i5, i5 + 3), swap(this, i5 + 1, i5 + 2);
      return this;
    };
    Buffer2.prototype.swap64 = function() {
      var len = this.length;
      if (len % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var i5 = 0; i5 < len; i5 += 8)
        swap(this, i5, i5 + 7), swap(this, i5 + 1, i5 + 6), swap(this, i5 + 2, i5 + 5), swap(this, i5 + 3, i5 + 4);
      return this;
    };
    Buffer2.prototype.toString = function() {
      var length = this.length | 0;
      return length === 0 ? "" : arguments.length === 0 ? utf8Slice(this, 0, length) : slowToString.apply(this, arguments);
    };
    Buffer2.prototype.equals = function(b3) {
      if (!internalIsBuffer(b3))
        throw new TypeError("Argument must be a Buffer");
      return this === b3 ? !0 : Buffer2.compare(this, b3) === 0;
    };
    Buffer2.prototype.inspect = function() {
      var str = "", max = INSPECT_MAX_BYTES;
      return this.length > 0 && (str = this.toString("hex", 0, max).match(/.{2}/g).join(" "), this.length > max && (str += " ... ")), "<Buffer " + str + ">";
    };
    Buffer2.prototype.compare = function(target, start, end, thisStart, thisEnd) {
      if (!internalIsBuffer(target))
        throw new TypeError("Argument must be a Buffer");
      if (start === void 0 && (start = 0), end === void 0 && (end = target ? target.length : 0), thisStart === void 0 && (thisStart = 0), thisEnd === void 0 && (thisEnd = this.length), start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length)
        throw new RangeError("out of range index");
      if (thisStart >= thisEnd && start >= end)
        return 0;
      if (thisStart >= thisEnd)
        return -1;
      if (start >= end)
        return 1;
      if (start >>>= 0, end >>>= 0, thisStart >>>= 0, thisEnd >>>= 0, this === target)
        return 0;
      for (var x3 = thisEnd - thisStart, y3 = end - start, len = Math.min(x3, y3), thisCopy = this.slice(thisStart, thisEnd), targetCopy = target.slice(start, end), i5 = 0; i5 < len; ++i5)
        if (thisCopy[i5] !== targetCopy[i5]) {
          x3 = thisCopy[i5], y3 = targetCopy[i5];
          break;
        }
      return x3 < y3 ? -1 : y3 < x3 ? 1 : 0;
    };
    Buffer2.prototype.includes = function(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, !0);
    };
    Buffer2.prototype.lastIndexOf = function(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, !1);
    };
    Buffer2.prototype.write = function(string, offset, length, encoding) {
      if (offset === void 0)
        encoding = "utf8", length = this.length, offset = 0;
      else if (length === void 0 && typeof offset == "string")
        encoding = offset, length = this.length, offset = 0;
      else if (isFinite(offset))
        offset = offset | 0, isFinite(length) ? (length = length | 0, encoding === void 0 && (encoding = "utf8")) : (encoding = length, length = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      var remaining = this.length - offset;
      if ((length === void 0 || length > remaining) && (length = remaining), string.length > 0 && (length < 0 || offset < 0) || offset > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      encoding || (encoding = "utf8");
      for (var loweredCase = !1; ; )
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
            return asciiWrite(this, string, offset, length);
          case "latin1":
          case "binary":
            return latin1Write(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase(), loweredCase = !0;
        }
    };
    Buffer2.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    MAX_ARGUMENTS_LENGTH = 4096;
    Buffer2.prototype.slice = function(start, end) {
      var len = this.length;
      start = ~~start, end = end === void 0 ? len : ~~end, start < 0 ? (start += len, start < 0 && (start = 0)) : start > len && (start = len), end < 0 ? (end += len, end < 0 && (end = 0)) : end > len && (end = len), end < start && (end = start);
      var newBuf;
      if (Buffer2.TYPED_ARRAY_SUPPORT)
        newBuf = this.subarray(start, end), newBuf.__proto__ = Buffer2.prototype;
      else {
        var sliceLen = end - start;
        newBuf = new Buffer2(sliceLen, void 0);
        for (var i5 = 0; i5 < sliceLen; ++i5)
          newBuf[i5] = this[i5 + start];
      }
      return newBuf;
    };
    Buffer2.prototype.readUIntLE = function(offset, byteLength2, noAssert) {
      offset = offset | 0, byteLength2 = byteLength2 | 0, noAssert || checkOffset(offset, byteLength2, this.length);
      for (var val = this[offset], mul = 1, i5 = 0; ++i5 < byteLength2 && (mul *= 256); )
        val += this[offset + i5] * mul;
      return val;
    };
    Buffer2.prototype.readUIntBE = function(offset, byteLength2, noAssert) {
      offset = offset | 0, byteLength2 = byteLength2 | 0, noAssert || checkOffset(offset, byteLength2, this.length);
      for (var val = this[offset + --byteLength2], mul = 1; byteLength2 > 0 && (mul *= 256); )
        val += this[offset + --byteLength2] * mul;
      return val;
    };
    Buffer2.prototype.readUInt8 = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 1, this.length), this[offset];
    };
    Buffer2.prototype.readUInt16LE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 2, this.length), this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUInt16BE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 2, this.length), this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUInt32LE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 4, this.length), (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUInt32BE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 4, this.length), this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readIntLE = function(offset, byteLength2, noAssert) {
      offset = offset | 0, byteLength2 = byteLength2 | 0, noAssert || checkOffset(offset, byteLength2, this.length);
      for (var val = this[offset], mul = 1, i5 = 0; ++i5 < byteLength2 && (mul *= 256); )
        val += this[offset + i5] * mul;
      return mul *= 128, val >= mul && (val -= Math.pow(2, 8 * byteLength2)), val;
    };
    Buffer2.prototype.readIntBE = function(offset, byteLength2, noAssert) {
      offset = offset | 0, byteLength2 = byteLength2 | 0, noAssert || checkOffset(offset, byteLength2, this.length);
      for (var i5 = byteLength2, mul = 1, val = this[offset + --i5]; i5 > 0 && (mul *= 256); )
        val += this[offset + --i5] * mul;
      return mul *= 128, val >= mul && (val -= Math.pow(2, 8 * byteLength2)), val;
    };
    Buffer2.prototype.readInt8 = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 1, this.length), this[offset] & 128 ? (255 - this[offset] + 1) * -1 : this[offset];
    };
    Buffer2.prototype.readInt16LE = function(offset, noAssert) {
      noAssert || checkOffset(offset, 2, this.length);
      var val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function(offset, noAssert) {
      noAssert || checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 4, this.length), this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 4, this.length), this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readFloatLE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 4, this.length), read(this, offset, !0, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 4, this.length), read(this, offset, !1, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 8, this.length), read(this, offset, !0, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function(offset, noAssert) {
      return noAssert || checkOffset(offset, 8, this.length), read(this, offset, !1, 52, 8);
    };
    Buffer2.prototype.writeUIntLE = function(value, offset, byteLength2, noAssert) {
      if (value = +value, offset = offset | 0, byteLength2 = byteLength2 | 0, !noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var mul = 1, i5 = 0;
      for (this[offset] = value & 255; ++i5 < byteLength2 && (mul *= 256); )
        this[offset + i5] = value / mul & 255;
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUIntBE = function(value, offset, byteLength2, noAssert) {
      if (value = +value, offset = offset | 0, byteLength2 = byteLength2 | 0, !noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var i5 = byteLength2 - 1, mul = 1;
      for (this[offset + i5] = value & 255; --i5 >= 0 && (mul *= 256); )
        this[offset + i5] = value / mul & 255;
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUInt8 = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 1, 255, 0), Buffer2.TYPED_ARRAY_SUPPORT || (value = Math.floor(value)), this[offset] = value & 255, offset + 1;
    };
    Buffer2.prototype.writeUInt16LE = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 2, 65535, 0), Buffer2.TYPED_ARRAY_SUPPORT ? (this[offset] = value & 255, this[offset + 1] = value >>> 8) : objectWriteUInt16(this, value, offset, !0), offset + 2;
    };
    Buffer2.prototype.writeUInt16BE = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 2, 65535, 0), Buffer2.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 8, this[offset + 1] = value & 255) : objectWriteUInt16(this, value, offset, !1), offset + 2;
    };
    Buffer2.prototype.writeUInt32LE = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 4, 4294967295, 0), Buffer2.TYPED_ARRAY_SUPPORT ? (this[offset + 3] = value >>> 24, this[offset + 2] = value >>> 16, this[offset + 1] = value >>> 8, this[offset] = value & 255) : objectWriteUInt32(this, value, offset, !0), offset + 4;
    };
    Buffer2.prototype.writeUInt32BE = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 4, 4294967295, 0), Buffer2.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = value & 255) : objectWriteUInt32(this, value, offset, !1), offset + 4;
    };
    Buffer2.prototype.writeIntLE = function(value, offset, byteLength2, noAssert) {
      if (value = +value, offset = offset | 0, !noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i5 = 0, mul = 1, sub = 0;
      for (this[offset] = value & 255; ++i5 < byteLength2 && (mul *= 256); )
        value < 0 && sub === 0 && this[offset + i5 - 1] !== 0 && (sub = 1), this[offset + i5] = (value / mul >> 0) - sub & 255;
      return offset + byteLength2;
    };
    Buffer2.prototype.writeIntBE = function(value, offset, byteLength2, noAssert) {
      if (value = +value, offset = offset | 0, !noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i5 = byteLength2 - 1, mul = 1, sub = 0;
      for (this[offset + i5] = value & 255; --i5 >= 0 && (mul *= 256); )
        value < 0 && sub === 0 && this[offset + i5 + 1] !== 0 && (sub = 1), this[offset + i5] = (value / mul >> 0) - sub & 255;
      return offset + byteLength2;
    };
    Buffer2.prototype.writeInt8 = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 1, 127, -128), Buffer2.TYPED_ARRAY_SUPPORT || (value = Math.floor(value)), value < 0 && (value = 255 + value + 1), this[offset] = value & 255, offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 2, 32767, -32768), Buffer2.TYPED_ARRAY_SUPPORT ? (this[offset] = value & 255, this[offset + 1] = value >>> 8) : objectWriteUInt16(this, value, offset, !0), offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 2, 32767, -32768), Buffer2.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 8, this[offset + 1] = value & 255) : objectWriteUInt16(this, value, offset, !1), offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648), Buffer2.TYPED_ARRAY_SUPPORT ? (this[offset] = value & 255, this[offset + 1] = value >>> 8, this[offset + 2] = value >>> 16, this[offset + 3] = value >>> 24) : objectWriteUInt32(this, value, offset, !0), offset + 4;
    };
    Buffer2.prototype.writeInt32BE = function(value, offset, noAssert) {
      return value = +value, offset = offset | 0, noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648), value < 0 && (value = 4294967295 + value + 1), Buffer2.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = value & 255) : objectWriteUInt32(this, value, offset, !1), offset + 4;
    };
    Buffer2.prototype.writeFloatLE = function(value, offset, noAssert) {
      return writeFloat(this, value, offset, !0, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function(value, offset, noAssert) {
      return writeFloat(this, value, offset, !1, noAssert);
    };
    Buffer2.prototype.writeDoubleLE = function(value, offset, noAssert) {
      return writeDouble(this, value, offset, !0, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function(value, offset, noAssert) {
      return writeDouble(this, value, offset, !1, noAssert);
    };
    Buffer2.prototype.copy = function(target, targetStart, start, end) {
      if (start || (start = 0), !end && end !== 0 && (end = this.length), targetStart >= target.length && (targetStart = target.length), targetStart || (targetStart = 0), end > 0 && end < start && (end = start), end === start || target.length === 0 || this.length === 0)
        return 0;
      if (targetStart < 0)
        throw new RangeError("targetStart out of bounds");
      if (start < 0 || start >= this.length)
        throw new RangeError("sourceStart out of bounds");
      if (end < 0)
        throw new RangeError("sourceEnd out of bounds");
      end > this.length && (end = this.length), target.length - targetStart < end - start && (end = target.length - targetStart + start);
      var len = end - start, i5;
      if (this === target && start < targetStart && targetStart < end)
        for (i5 = len - 1; i5 >= 0; --i5)
          target[i5 + targetStart] = this[i5 + start];
      else if (len < 1e3 || !Buffer2.TYPED_ARRAY_SUPPORT)
        for (i5 = 0; i5 < len; ++i5)
          target[i5 + targetStart] = this[i5 + start];
      else
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, start + len),
          targetStart
        );
      return len;
    };
    Buffer2.prototype.fill = function(val, start, end, encoding) {
      if (typeof val == "string") {
        if (typeof start == "string" ? (encoding = start, start = 0, end = this.length) : typeof end == "string" && (encoding = end, end = this.length), val.length === 1) {
          var code = val.charCodeAt(0);
          code < 256 && (val = code);
        }
        if (encoding !== void 0 && typeof encoding != "string")
          throw new TypeError("encoding must be a string");
        if (typeof encoding == "string" && !Buffer2.isEncoding(encoding))
          throw new TypeError("Unknown encoding: " + encoding);
      } else
        typeof val == "number" && (val = val & 255);
      if (start < 0 || this.length < start || this.length < end)
        throw new RangeError("Out of range index");
      if (end <= start)
        return this;
      start = start >>> 0, end = end === void 0 ? this.length : end >>> 0, val || (val = 0);
      var i5;
      if (typeof val == "number")
        for (i5 = start; i5 < end; ++i5)
          this[i5] = val;
      else {
        var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer2(val, encoding).toString()), len = bytes.length;
        for (i5 = 0; i5 < end - start; ++i5)
          this[i5 + start] = bytes[i5 % len];
      }
      return this;
    };
    INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/buffer-list.js
function BufferList() {
  this.head = null, this.tail = null, this.length = 0;
}
var buffer_list_default, init_buffer_list = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/buffer-list.js"() {
    init_buffer();
    buffer_list_default = BufferList;
    BufferList.prototype.push = function(v3) {
      var entry2 = { data: v3, next: null };
      this.length > 0 ? this.tail.next = entry2 : this.head = entry2, this.tail = entry2, ++this.length;
    };
    BufferList.prototype.unshift = function(v3) {
      var entry2 = { data: v3, next: this.head };
      this.length === 0 && (this.tail = entry2), this.head = entry2, ++this.length;
    };
    BufferList.prototype.shift = function() {
      if (this.length !== 0) {
        var ret = this.head.data;
        return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, ret;
      }
    };
    BufferList.prototype.clear = function() {
      this.head = this.tail = null, this.length = 0;
    };
    BufferList.prototype.join = function(s6) {
      if (this.length === 0)
        return "";
      for (var p2 = this.head, ret = "" + p2.data; p2 = p2.next; )
        ret += s6 + p2.data;
      return ret;
    };
    BufferList.prototype.concat = function(n6) {
      if (this.length === 0)
        return Buffer2.alloc(0);
      if (this.length === 1)
        return this.head.data;
      for (var ret = Buffer2.allocUnsafe(n6 >>> 0), p2 = this.head, i5 = 0; p2; )
        p2.data.copy(ret, i5), i5 += p2.data.length, p2 = p2.next;
      return ret;
    };
  }
});

// node-modules-polyfills:string_decoder
function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding))
    throw new Error("Unknown encoding: " + encoding);
}
function StringDecoder(encoding) {
  switch (this.encoding = (encoding || "utf8").toLowerCase().replace(/[-_]/, ""), assertEncoding(encoding), this.encoding) {
    case "utf8":
      this.surrogateSize = 3;
      break;
    case "ucs2":
    case "utf16le":
      this.surrogateSize = 2, this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case "base64":
      this.surrogateSize = 3, this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }
  this.charBuffer = new Buffer2(6), this.charReceived = 0, this.charLength = 0;
}
function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}
function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2, this.charLength = this.charReceived ? 2 : 0;
}
function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3, this.charLength = this.charReceived ? 3 : 0;
}
var isBufferEncoding, init_string_decoder = __esm({
  "node-modules-polyfills:string_decoder"() {
    init_buffer();
    isBufferEncoding = Buffer2.isEncoding || function(encoding) {
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return !0;
        default:
          return !1;
      }
    };
    StringDecoder.prototype.write = function(buffer) {
      for (var charStr = ""; this.charLength; ) {
        var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
        if (buffer.copy(this.charBuffer, this.charReceived, 0, available), this.charReceived += available, this.charReceived < this.charLength)
          return "";
        buffer = buffer.slice(available, buffer.length), charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
        var charCode = charStr.charCodeAt(charStr.length - 1);
        if (charCode >= 55296 && charCode <= 56319) {
          this.charLength += this.surrogateSize, charStr = "";
          continue;
        }
        if (this.charReceived = this.charLength = 0, buffer.length === 0)
          return charStr;
        break;
      }
      this.detectIncompleteChar(buffer);
      var end = buffer.length;
      this.charLength && (buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end), end -= this.charReceived), charStr += buffer.toString(this.encoding, 0, end);
      var end = charStr.length - 1, charCode = charStr.charCodeAt(end);
      if (charCode >= 55296 && charCode <= 56319) {
        var size = this.surrogateSize;
        return this.charLength += size, this.charReceived += size, this.charBuffer.copy(this.charBuffer, size, 0, size), buffer.copy(this.charBuffer, 0, 0, size), charStr.substring(0, end);
      }
      return charStr;
    };
    StringDecoder.prototype.detectIncompleteChar = function(buffer) {
      for (var i5 = buffer.length >= 3 ? 3 : buffer.length; i5 > 0; i5--) {
        var c4 = buffer[buffer.length - i5];
        if (i5 == 1 && c4 >> 5 == 6) {
          this.charLength = 2;
          break;
        }
        if (i5 <= 2 && c4 >> 4 == 14) {
          this.charLength = 3;
          break;
        }
        if (i5 <= 3 && c4 >> 3 == 30) {
          this.charLength = 4;
          break;
        }
      }
      this.charReceived = i5;
    };
    StringDecoder.prototype.end = function(buffer) {
      var res = "";
      if (buffer && buffer.length && (res = this.write(buffer)), this.charReceived) {
        var cr = this.charReceived, buf = this.charBuffer, enc = this.encoding;
        res += buf.slice(0, cr).toString(enc);
      }
      return res;
    };
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/readable.js
function prependListener2(emitter, event, fn) {
  if (typeof emitter.prependListener == "function")
    return emitter.prependListener(event, fn);
  !emitter._events || !emitter._events[event] ? emitter.on(event, fn) : Array.isArray(emitter._events[event]) ? emitter._events[event].unshift(fn) : emitter._events[event] = [fn, emitter._events[event]];
}
function listenerCount2(emitter, type) {
  return emitter.listeners(type).length;
}
function ReadableState(options, stream) {
  options = options || {}, this.objectMode = !!options.objectMode, stream instanceof Duplex && (this.objectMode = this.objectMode || !!options.readableObjectMode);
  var hwm = options.highWaterMark, defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm, this.highWaterMark = ~~this.highWaterMark, this.buffer = new buffer_list_default(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = options.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, options.encoding && (this.decoder = new StringDecoder(options.encoding), this.encoding = options.encoding);
}
function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);
  this._readableState = new ReadableState(options, this), this.readable = !0, options && typeof options.read == "function" && (this._read = options.read), events_default.call(this);
}
function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er)
    stream.emit("error", er);
  else if (chunk === null)
    state.reading = !1, onEofChunk(stream, state);
  else if (state.objectMode || chunk && chunk.length > 0)
    if (state.ended && !addToFront) {
      var e10 = new Error("stream.push() after EOF");
      stream.emit("error", e10);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error("stream.unshift() after end event");
      stream.emit("error", _e);
    } else {
      var skipAdd;
      state.decoder && !addToFront && !encoding && (chunk = state.decoder.write(chunk), skipAdd = !state.objectMode && chunk.length === 0), addToFront || (state.reading = !1), skipAdd || (state.flowing && state.length === 0 && !state.sync ? (stream.emit("data", chunk), stream.read(0)) : (state.length += state.objectMode ? 1 : chunk.length, addToFront ? state.buffer.unshift(chunk) : state.buffer.push(chunk), state.needReadable && emitReadable(stream))), maybeReadMore(stream, state);
    }
  else
    addToFront || (state.reading = !1);
  return needMoreData(state);
}
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}
function computeNewHighWaterMark(n6) {
  return n6 >= MAX_HWM ? n6 = MAX_HWM : (n6--, n6 |= n6 >>> 1, n6 |= n6 >>> 2, n6 |= n6 >>> 4, n6 |= n6 >>> 8, n6 |= n6 >>> 16, n6++), n6;
}
function howMuchToRead(n6, state) {
  return n6 <= 0 || state.length === 0 && state.ended ? 0 : state.objectMode ? 1 : n6 !== n6 ? state.flowing && state.length ? state.buffer.head.data.length : state.length : (n6 > state.highWaterMark && (state.highWaterMark = computeNewHighWaterMark(n6)), n6 <= state.length ? n6 : state.ended ? state.length : (state.needReadable = !0, 0));
}
function chunkInvalid(state, chunk) {
  var er = null;
  return !Buffer.isBuffer(chunk) && typeof chunk != "string" && chunk !== null && chunk !== void 0 && !state.objectMode && (er = new TypeError("Invalid non-string/buffer chunk")), er;
}
function onEofChunk(stream, state) {
  if (!state.ended) {
    if (state.decoder) {
      var chunk = state.decoder.end();
      chunk && chunk.length && (state.buffer.push(chunk), state.length += state.objectMode ? 1 : chunk.length);
    }
    state.ended = !0, emitReadable(stream);
  }
}
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = !1, state.emittedReadable || (debug("emitReadable", state.flowing), state.emittedReadable = !0, state.sync ? nextTick(emitReadable_, stream) : emitReadable_(stream));
}
function emitReadable_(stream) {
  debug("emit readable"), stream.emit("readable"), flow(stream);
}
function maybeReadMore(stream, state) {
  state.readingMore || (state.readingMore = !0, nextTick(maybeReadMore_, stream, state));
}
function maybeReadMore_(stream, state) {
  for (var len = state.length; !state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark && (debug("maybeReadMore read 0"), stream.read(0), len !== state.length); )
    len = state.length;
  state.readingMore = !1;
}
function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug("pipeOnDrain", state.awaitDrain), state.awaitDrain && state.awaitDrain--, state.awaitDrain === 0 && src.listeners("data").length && (state.flowing = !0, flow(src));
  };
}
function nReadingNextTick(self) {
  debug("readable nexttick read 0"), self.read(0);
}
function resume(stream, state) {
  state.resumeScheduled || (state.resumeScheduled = !0, nextTick(resume_, stream, state));
}
function resume_(stream, state) {
  state.reading || (debug("resume read 0"), stream.read(0)), state.resumeScheduled = !1, state.awaitDrain = 0, stream.emit("resume"), flow(stream), state.flowing && !state.reading && stream.read(0);
}
function flow(stream) {
  var state = stream._readableState;
  for (debug("flow", state.flowing); state.flowing && stream.read() !== null; )
    ;
}
function fromList(n6, state) {
  if (state.length === 0)
    return null;
  var ret;
  return state.objectMode ? ret = state.buffer.shift() : !n6 || n6 >= state.length ? (state.decoder ? ret = state.buffer.join("") : state.buffer.length === 1 ? ret = state.buffer.head.data : ret = state.buffer.concat(state.length), state.buffer.clear()) : ret = fromListPartial(n6, state.buffer, state.decoder), ret;
}
function fromListPartial(n6, list, hasStrings) {
  var ret;
  return n6 < list.head.data.length ? (ret = list.head.data.slice(0, n6), list.head.data = list.head.data.slice(n6)) : n6 === list.head.data.length ? ret = list.shift() : ret = hasStrings ? copyFromBufferString(n6, list) : copyFromBuffer(n6, list), ret;
}
function copyFromBufferString(n6, list) {
  var p2 = list.head, c4 = 1, ret = p2.data;
  for (n6 -= ret.length; p2 = p2.next; ) {
    var str = p2.data, nb = n6 > str.length ? str.length : n6;
    if (nb === str.length ? ret += str : ret += str.slice(0, n6), n6 -= nb, n6 === 0) {
      nb === str.length ? (++c4, p2.next ? list.head = p2.next : list.head = list.tail = null) : (list.head = p2, p2.data = str.slice(nb));
      break;
    }
    ++c4;
  }
  return list.length -= c4, ret;
}
function copyFromBuffer(n6, list) {
  var ret = Buffer.allocUnsafe(n6), p2 = list.head, c4 = 1;
  for (p2.data.copy(ret), n6 -= p2.data.length; p2 = p2.next; ) {
    var buf = p2.data, nb = n6 > buf.length ? buf.length : n6;
    if (buf.copy(ret, ret.length - n6, 0, nb), n6 -= nb, n6 === 0) {
      nb === buf.length ? (++c4, p2.next ? list.head = p2.next : list.head = list.tail = null) : (list.head = p2, p2.data = buf.slice(nb));
      break;
    }
    ++c4;
  }
  return list.length -= c4, ret;
}
function endReadable(stream) {
  var state = stream._readableState;
  if (state.length > 0)
    throw new Error('"endReadable()" called on non-empty stream');
  state.endEmitted || (state.ended = !0, nextTick(endReadableNT, state, stream));
}
function endReadableNT(state, stream) {
  !state.endEmitted && state.length === 0 && (state.endEmitted = !0, stream.readable = !1, stream.emit("end"));
}
function forEach(xs, f2) {
  for (var i5 = 0, l4 = xs.length; i5 < l4; i5++)
    f2(xs[i5], i5);
}
function indexOf2(xs, x3) {
  for (var i5 = 0, l4 = xs.length; i5 < l4; i5++)
    if (xs[i5] === x3)
      return i5;
  return -1;
}
var debug, MAX_HWM, init_readable = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/readable.js"() {
    "use strict";
    init_events();
    init_util();
    init_buffer_list();
    init_string_decoder();
    init_duplex();
    init_process();
    Readable.ReadableState = ReadableState;
    debug = debuglog("stream");
    inherits_default(Readable, events_default);
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      return !state.objectMode && typeof chunk == "string" && (encoding = encoding || state.defaultEncoding, encoding !== state.encoding && (chunk = Buffer.from(chunk, encoding), encoding = "")), readableAddChunk(this, state, chunk, encoding, !1);
    };
    Readable.prototype.unshift = function(chunk) {
      var state = this._readableState;
      return readableAddChunk(this, state, chunk, "", !0);
    };
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === !1;
    };
    Readable.prototype.setEncoding = function(enc) {
      return this._readableState.decoder = new StringDecoder(enc), this._readableState.encoding = enc, this;
    };
    MAX_HWM = 8388608;
    Readable.prototype.read = function(n6) {
      debug("read", n6), n6 = parseInt(n6, 10);
      var state = this._readableState, nOrig = n6;
      if (n6 !== 0 && (state.emittedReadable = !1), n6 === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended))
        return debug("read: emitReadable", state.length, state.ended), state.length === 0 && state.ended ? endReadable(this) : emitReadable(this), null;
      if (n6 = howMuchToRead(n6, state), n6 === 0 && state.ended)
        return state.length === 0 && endReadable(this), null;
      var doRead = state.needReadable;
      debug("need readable", doRead), (state.length === 0 || state.length - n6 < state.highWaterMark) && (doRead = !0, debug("length less than watermark", doRead)), state.ended || state.reading ? (doRead = !1, debug("reading or ended", doRead)) : doRead && (debug("do read"), state.reading = !0, state.sync = !0, state.length === 0 && (state.needReadable = !0), this._read(state.highWaterMark), state.sync = !1, state.reading || (n6 = howMuchToRead(nOrig, state)));
      var ret;
      return n6 > 0 ? ret = fromList(n6, state) : ret = null, ret === null ? (state.needReadable = !0, n6 = 0) : state.length -= n6, state.length === 0 && (state.ended || (state.needReadable = !0), nOrig !== n6 && state.ended && endReadable(this)), ret !== null && this.emit("data", ret), ret;
    };
    Readable.prototype._read = function(n6) {
      this.emit("error", new Error("not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this, state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1, debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = !pipeOpts || pipeOpts.end !== !1, endFn = doEnd ? onend2 : cleanup;
      state.endEmitted ? nextTick(endFn) : src.once("end", endFn), dest.on("unpipe", onunpipe);
      function onunpipe(readable) {
        debug("onunpipe"), readable === src && cleanup();
      }
      function onend2() {
        debug("onend"), dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = !1;
      function cleanup() {
        debug("cleanup"), dest.removeListener("close", onclose), dest.removeListener("finish", onfinish), dest.removeListener("drain", ondrain), dest.removeListener("error", onerror), dest.removeListener("unpipe", onunpipe), src.removeListener("end", onend2), src.removeListener("end", cleanup), src.removeListener("data", ondata), cleanedUp = !0, state.awaitDrain && (!dest._writableState || dest._writableState.needDrain) && ondrain();
      }
      var increasedAwaitDrain = !1;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata"), increasedAwaitDrain = !1;
        var ret = dest.write(chunk);
        ret === !1 && !increasedAwaitDrain && ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf2(state.pipes, dest) !== -1) && !cleanedUp && (debug("false write response, pause", src._readableState.awaitDrain), src._readableState.awaitDrain++, increasedAwaitDrain = !0), src.pause());
      }
      function onerror(er) {
        debug("onerror", er), unpipe(), dest.removeListener("error", onerror), listenerCount2(dest, "error") === 0 && dest.emit("error", er);
      }
      prependListener2(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish), unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish"), dest.removeListener("close", onclose), unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe"), src.unpipe(dest);
      }
      return dest.emit("pipe", src), state.flowing || (debug("pipe resume"), src.resume()), dest;
    };
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1)
        return dest && dest !== state.pipes ? this : (dest || (dest = state.pipes), state.pipes = null, state.pipesCount = 0, state.flowing = !1, dest && dest.emit("unpipe", this), this);
      if (!dest) {
        var dests = state.pipes, len = state.pipesCount;
        state.pipes = null, state.pipesCount = 0, state.flowing = !1;
        for (var _i = 0; _i < len; _i++)
          dests[_i].emit("unpipe", this);
        return this;
      }
      var i5 = indexOf2(state.pipes, dest);
      return i5 === -1 ? this : (state.pipes.splice(i5, 1), state.pipesCount -= 1, state.pipesCount === 1 && (state.pipes = state.pipes[0]), dest.emit("unpipe", this), this);
    };
    Readable.prototype.on = function(ev, fn) {
      var res = events_default.prototype.on.call(this, ev, fn);
      if (ev === "data")
        this._readableState.flowing !== !1 && this.resume();
      else if (ev === "readable") {
        var state = this._readableState;
        !state.endEmitted && !state.readableListening && (state.readableListening = state.needReadable = !0, state.emittedReadable = !1, state.reading ? state.length && emitReadable(this, state) : nextTick(nReadingNextTick, this));
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.resume = function() {
      var state = this._readableState;
      return state.flowing || (debug("resume"), state.flowing = !0, resume(this, state)), this;
    };
    Readable.prototype.pause = function() {
      return debug("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (debug("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
    };
    Readable.prototype.wrap = function(stream) {
      var state = this._readableState, paused = !1, self = this;
      stream.on("end", function() {
        if (debug("wrapped end"), state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          chunk && chunk.length && self.push(chunk);
        }
        self.push(null);
      }), stream.on("data", function(chunk) {
        if (debug("wrapped data"), state.decoder && (chunk = state.decoder.write(chunk)), !(state.objectMode && chunk == null) && !(!state.objectMode && (!chunk || !chunk.length))) {
          var ret = self.push(chunk);
          ret || (paused = !0, stream.pause());
        }
      });
      for (var i5 in stream)
        this[i5] === void 0 && typeof stream[i5] == "function" && (this[i5] = function(method) {
          return function() {
            return stream[method].apply(stream, arguments);
          };
        }(i5));
      var events = ["error", "close", "destroy", "pause", "resume"];
      return forEach(events, function(ev) {
        stream.on(ev, self.emit.bind(self, ev));
      }), self._read = function(n6) {
        debug("wrapped _read", n6), paused && (paused = !1, stream.resume());
      }, self;
    };
    Readable._fromList = fromList;
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/writable.js
function nop() {
}
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk, this.encoding = encoding, this.callback = cb, this.next = null;
}
function WritableState(options, stream) {
  Object.defineProperty(this, "buffer", {
    get: deprecate(function() {
      return this.getBuffer();
    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
  }), options = options || {}, this.objectMode = !!options.objectMode, stream instanceof Duplex && (this.objectMode = this.objectMode || !!options.writableObjectMode);
  var hwm = options.highWaterMark, defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
  var noDecode = options.decodeStrings === !1;
  this.decodeStrings = !noDecode, this.defaultEncoding = options.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(er) {
    onwrite(stream, er);
  }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new CorkedRequest(this);
}
function Writable(options) {
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);
  this._writableState = new WritableState(options, this), this.writable = !0, options && (typeof options.write == "function" && (this._write = options.write), typeof options.writev == "function" && (this._writev = options.writev)), EventEmitter.call(this);
}
function writeAfterEnd(stream, cb) {
  var er = new Error("write after end");
  stream.emit("error", er), nextTick(cb, er);
}
function validChunk(stream, state, chunk, cb) {
  var valid = !0, er = !1;
  return chunk === null ? er = new TypeError("May not write null values to stream") : !Buffer2.isBuffer(chunk) && typeof chunk != "string" && chunk !== void 0 && !state.objectMode && (er = new TypeError("Invalid non-string/buffer chunk")), er && (stream.emit("error", er), nextTick(cb, er), valid = !1), valid;
}
function decodeChunk(state, chunk, encoding) {
  return !state.objectMode && state.decodeStrings !== !1 && typeof chunk == "string" && (chunk = Buffer2.from(chunk, encoding)), chunk;
}
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding), Buffer2.isBuffer(chunk) && (encoding = "buffer");
  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark;
  if (ret || (state.needDrain = !0), state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb), last ? last.next = state.lastBufferedRequest : state.bufferedRequest = state.lastBufferedRequest, state.bufferedRequestCount += 1;
  } else
    doWrite(stream, state, !1, len, chunk, encoding, cb);
  return ret;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len, state.writecb = cb, state.writing = !0, state.sync = !0, writev ? stream._writev(chunk, state.onwrite) : stream._write(chunk, encoding, state.onwrite), state.sync = !1;
}
function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb, sync ? nextTick(cb, er) : cb(er), stream._writableState.errorEmitted = !0, stream.emit("error", er);
}
function onwriteStateUpdate(state) {
  state.writing = !1, state.writecb = null, state.length -= state.writelen, state.writelen = 0;
}
function onwrite(stream, er) {
  var state = stream._writableState, sync = state.sync, cb = state.writecb;
  if (onwriteStateUpdate(state), er)
    onwriteError(stream, state, sync, er, cb);
  else {
    var finished = needFinish(state);
    !finished && !state.corked && !state.bufferProcessing && state.bufferedRequest && clearBuffer(stream, state), sync ? nextTick(afterWrite, stream, state, finished, cb) : afterWrite(stream, state, finished, cb);
  }
}
function afterWrite(stream, state, finished, cb) {
  finished || onwriteDrain(stream, state), state.pendingcb--, cb(), finishMaybe(stream, state);
}
function onwriteDrain(stream, state) {
  state.length === 0 && state.needDrain && (state.needDrain = !1, stream.emit("drain"));
}
function clearBuffer(stream, state) {
  state.bufferProcessing = !0;
  var entry2 = state.bufferedRequest;
  if (stream._writev && entry2 && entry2.next) {
    var l4 = state.bufferedRequestCount, buffer = new Array(l4), holder = state.corkedRequestsFree;
    holder.entry = entry2;
    for (var count = 0; entry2; )
      buffer[count] = entry2, entry2 = entry2.next, count += 1;
    doWrite(stream, state, !0, state.length, buffer, "", holder.finish), state.pendingcb++, state.lastBufferedRequest = null, holder.next ? (state.corkedRequestsFree = holder.next, holder.next = null) : state.corkedRequestsFree = new CorkedRequest(state);
  } else {
    for (; entry2; ) {
      var chunk = entry2.chunk, encoding = entry2.encoding, cb = entry2.callback, len = state.objectMode ? 1 : chunk.length;
      if (doWrite(stream, state, !1, len, chunk, encoding, cb), entry2 = entry2.next, state.writing)
        break;
    }
    entry2 === null && (state.lastBufferedRequest = null);
  }
  state.bufferedRequestCount = 0, state.bufferedRequest = entry2, state.bufferProcessing = !1;
}
function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function prefinish(stream, state) {
  state.prefinished || (state.prefinished = !0, stream.emit("prefinish"));
}
function finishMaybe(stream, state) {
  var need = needFinish(state);
  return need && (state.pendingcb === 0 ? (prefinish(stream, state), state.finished = !0, stream.emit("finish")) : prefinish(stream, state)), need;
}
function endWritable(stream, state, cb) {
  state.ending = !0, finishMaybe(stream, state), cb && (state.finished ? nextTick(cb) : stream.once("finish", cb)), state.ended = !0, stream.writable = !1;
}
function CorkedRequest(state) {
  var _this = this;
  this.next = null, this.entry = null, this.finish = function(err) {
    var entry2 = _this.entry;
    for (_this.entry = null; entry2; ) {
      var cb = entry2.callback;
      state.pendingcb--, cb(err), entry2 = entry2.next;
    }
    state.corkedRequestsFree ? state.corkedRequestsFree.next = _this : state.corkedRequestsFree = _this;
  };
}
var init_writable = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/writable.js"() {
    init_util();
    init_buffer();
    init_events();
    init_duplex();
    init_process();
    Writable.WritableState = WritableState;
    inherits_default(Writable, EventEmitter);
    WritableState.prototype.getBuffer = function() {
      for (var current = this.bufferedRequest, out = []; current; )
        out.push(current), current = current.next;
      return out;
    };
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState, ret = !1;
      return typeof encoding == "function" && (cb = encoding, encoding = null), Buffer2.isBuffer(chunk) ? encoding = "buffer" : encoding || (encoding = state.defaultEncoding), typeof cb != "function" && (cb = nop), state.ended ? writeAfterEnd(this, cb) : validChunk(this, state, chunk, cb) && (state.pendingcb++, ret = writeOrBuffer(this, state, chunk, encoding, cb)), ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      state.corked && (state.corked--, !state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest && clearBuffer(this, state));
    };
    Writable.prototype.setDefaultEncoding = function(encoding) {
      if (typeof encoding == "string" && (encoding = encoding.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new TypeError("Unknown encoding: " + encoding);
      return this._writableState.defaultEncoding = encoding, this;
    };
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      typeof chunk == "function" ? (cb = chunk, chunk = null, encoding = null) : typeof encoding == "function" && (cb = encoding, encoding = null), chunk != null && this.write(chunk, encoding), state.corked && (state.corked = 1, this.uncork()), !state.ending && !state.finished && endWritable(this, state, cb);
    };
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/duplex.js
function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);
  Readable.call(this, options), Writable.call(this, options), options && options.readable === !1 && (this.readable = !1), options && options.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, options && options.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", onend);
}
function onend() {
  this.allowHalfOpen || this._writableState.ended || nextTick(onEndNT, this);
}
function onEndNT(self) {
  self.end();
}
var keys, method, v3, init_duplex = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/duplex.js"() {
    init_util();
    init_process();
    init_readable();
    init_writable();
    inherits_default(Duplex, Readable);
    keys = Object.keys(Writable.prototype);
    for (v3 = 0; v3 < keys.length; v3++)
      method = keys[v3], Duplex.prototype[method] || (Duplex.prototype[method] = Writable.prototype[method]);
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/transform.js
function TransformState(stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null;
}
function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = !1;
  var cb = ts.writecb;
  if (!cb)
    return stream.emit("error", new Error("no writecb in Transform class"));
  ts.writechunk = null, ts.writecb = null, data != null && stream.push(data), cb(er);
  var rs = stream._readableState;
  rs.reading = !1, (rs.needReadable || rs.length < rs.highWaterMark) && stream._read(rs.highWaterMark);
}
function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);
  Duplex.call(this, options), this._transformState = new TransformState(this);
  var stream = this;
  this._readableState.needReadable = !0, this._readableState.sync = !1, options && (typeof options.transform == "function" && (this._transform = options.transform), typeof options.flush == "function" && (this._flush = options.flush)), this.once("prefinish", function() {
    typeof this._flush == "function" ? this._flush(function(er) {
      done(stream, er);
    }) : done(stream);
  });
}
function done(stream, er) {
  if (er)
    return stream.emit("error", er);
  var ws = stream._writableState, ts = stream._transformState;
  if (ws.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (ts.transforming)
    throw new Error("Calling transform done when still transforming");
  return stream.push(null);
}
var init_transform = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/transform.js"() {
    init_duplex();
    init_util();
    inherits_default(Transform, Duplex);
    Transform.prototype.push = function(chunk, encoding) {
      return this._transformState.needTransform = !1, Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("Not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      if (ts.writecb = cb, ts.writechunk = chunk, ts.writeencoding = encoding, !ts.transforming) {
        var rs = this._readableState;
        (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) && this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n6) {
      var ts = this._transformState;
      ts.writechunk !== null && ts.writecb && !ts.transforming ? (ts.transforming = !0, this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)) : ts.needTransform = !0;
    };
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough.js
function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);
  Transform.call(this, options);
}
var init_passthrough = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough.js"() {
    init_transform();
    init_util();
    inherits_default(PassThrough, Transform);
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node-modules-polyfills:stream
var stream_exports = {};
__export(stream_exports, {
  Duplex: () => Duplex,
  PassThrough: () => PassThrough,
  Readable: () => Readable,
  Stream: () => Stream,
  Transform: () => Transform,
  Writable: () => Writable,
  default: () => stream_default
});
function Stream() {
  events_default.call(this);
}
var stream_default, init_stream = __esm({
  "node-modules-polyfills:stream"() {
    init_events();
    init_util();
    init_duplex();
    init_readable();
    init_writable();
    init_transform();
    init_passthrough();
    inherits_default(Stream, events_default);
    Stream.Readable = Readable;
    Stream.Writable = Writable;
    Stream.Duplex = Duplex;
    Stream.Transform = Transform;
    Stream.PassThrough = PassThrough;
    Stream.Stream = Stream;
    stream_default = Stream;
    Stream.prototype.pipe = function(dest, options) {
      var source = this;
      function ondata(chunk) {
        dest.writable && dest.write(chunk) === !1 && source.pause && source.pause();
      }
      source.on("data", ondata);
      function ondrain() {
        source.readable && source.resume && source.resume();
      }
      dest.on("drain", ondrain), !dest._isStdio && (!options || options.end !== !1) && (source.on("end", onend2), source.on("close", onclose));
      var didOnEnd = !1;
      function onend2() {
        didOnEnd || (didOnEnd = !0, dest.end());
      }
      function onclose() {
        didOnEnd || (didOnEnd = !0, typeof dest.destroy == "function" && dest.destroy());
      }
      function onerror(er) {
        if (cleanup(), events_default.listenerCount(this, "error") === 0)
          throw er;
      }
      source.on("error", onerror), dest.on("error", onerror);
      function cleanup() {
        source.removeListener("data", ondata), dest.removeListener("drain", ondrain), source.removeListener("end", onend2), source.removeListener("close", onclose), source.removeListener("error", onerror), dest.removeListener("error", onerror), source.removeListener("end", cleanup), source.removeListener("close", cleanup), dest.removeListener("close", cleanup);
      }
      return source.on("end", cleanup), source.on("close", cleanup), dest.on("close", cleanup), dest.emit("pipe", source), dest;
    };
  }
});

// node-modules-polyfills-commonjs:stream
var require_stream = __commonJS({
  "node-modules-polyfills-commonjs:stream"(exports, module) {
    var polyfill = (init_stream(), __toCommonJS(stream_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k2 in polyfill)
        module.exports[k2] = polyfill[k2];
    } else
      polyfill && (module.exports = polyfill);
  }
});

// node_modules/react-dom/cjs/react-dom-server.node.development.js
var require_react_dom_server_node_development = __commonJS({
  "node_modules/react-dom/cjs/react-dom-server.node.development.js"(exports) {
    "use strict";
    (function() {
      "use strict";
      var React5 = require_react(), _assign = require_object_assign(), stream = require_stream(), ReactVersion = "17.0.2";
      function formatProdErrorMessage(code) {
        for (var url = "https://reactjs.org/docs/error-decoder.html?invariant=" + code, i6 = 1; i6 < arguments.length; i6++)
          url += "&args[]=" + encodeURIComponent(arguments[i6]);
        return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var ReactSharedInternals = React5.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function warn(format2) {
        {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)
            args[_key - 1] = arguments[_key];
          printWarning("warn", format2, args);
        }
      }
      function error(format2) {
        {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++)
            args[_key2 - 1] = arguments[_key2];
          printWarning("error", format2, args);
        }
      }
      function printWarning(level, format2, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame, stack = ReactDebugCurrentFrame2.getStackAddendum();
          stack !== "" && (format2 += "%s", args = args.concat([stack]));
          var argsWithFormat = args.map(function(item) {
            return "" + item;
          });
          argsWithFormat.unshift("Warning: " + format2), Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var REACT_ELEMENT_TYPE = 60103, REACT_PORTAL_TYPE = 60106, REACT_FRAGMENT_TYPE = 60107, REACT_STRICT_MODE_TYPE = 60108, REACT_PROFILER_TYPE = 60114, REACT_PROVIDER_TYPE = 60109, REACT_CONTEXT_TYPE = 60110, REACT_FORWARD_REF_TYPE = 60112, REACT_SUSPENSE_TYPE = 60113, REACT_SUSPENSE_LIST_TYPE = 60120, REACT_MEMO_TYPE = 60115, REACT_LAZY_TYPE = 60116, REACT_BLOCK_TYPE = 60121, REACT_SERVER_BLOCK_TYPE = 60122, REACT_FUNDAMENTAL_TYPE = 60117, REACT_SCOPE_TYPE = 60119, REACT_OPAQUE_ID_TYPE = 60128, REACT_DEBUG_TRACING_MODE_TYPE = 60129, REACT_OFFSCREEN_TYPE = 60130, REACT_LEGACY_HIDDEN_TYPE = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var symbolFor = Symbol.for;
        REACT_ELEMENT_TYPE = symbolFor("react.element"), REACT_PORTAL_TYPE = symbolFor("react.portal"), REACT_FRAGMENT_TYPE = symbolFor("react.fragment"), REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode"), REACT_PROFILER_TYPE = symbolFor("react.profiler"), REACT_PROVIDER_TYPE = symbolFor("react.provider"), REACT_CONTEXT_TYPE = symbolFor("react.context"), REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref"), REACT_SUSPENSE_TYPE = symbolFor("react.suspense"), REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list"), REACT_MEMO_TYPE = symbolFor("react.memo"), REACT_LAZY_TYPE = symbolFor("react.lazy"), REACT_BLOCK_TYPE = symbolFor("react.block"), REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block"), REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental"), REACT_SCOPE_TYPE = symbolFor("react.scope"), REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id"), REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode"), REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen"), REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var functionName = innerType.displayName || innerType.name || "";
        return outerType.displayName || (functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName);
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentName(type) {
        if (type == null)
          return null;
        if (typeof type.tag == "number" && error("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), typeof type == "function")
          return type.displayName || type.name || null;
        if (typeof type == "string")
          return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type == "object")
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              return getComponentName(type.type);
            case REACT_BLOCK_TYPE:
              return getComponentName(type._render);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type, payload = lazyComponent._payload, init2 = lazyComponent._init;
              try {
                return getComponentName(init2(payload));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var enableSuspenseServerRenderer = !1, disabledDepth = 0, prevLog, prevInfo, prevWarn, prevError, prevGroup, prevGroupCollapsed, prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = !0;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log, prevInfo = console.info, prevWarn = console.warn, prevError = console.error, prevGroup = console.group, prevGroupCollapsed = console.groupCollapsed, prevGroupEnd = console.groupEnd;
            var props = {
              configurable: !0,
              enumerable: !0,
              value: disabledLog,
              writable: !0
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          if (disabledDepth--, disabledDepth === 0) {
            var props = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: _assign({}, props, {
                value: prevLog
              }),
              info: _assign({}, props, {
                value: prevInfo
              }),
              warn: _assign({}, props, {
                value: prevWarn
              }),
              error: _assign({}, props, {
                value: prevError
              }),
              group: _assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: _assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: _assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          disabledDepth < 0 && error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher, prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === void 0)
            try {
              throw Error();
            } catch (x3) {
              var match = x3.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || "";
            }
          return `
` + prefix + name;
        }
      }
      var reentry = !1, componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap == "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry)
          return "";
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== void 0)
            return frame;
        }
        var control;
        reentry = !0;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        previousDispatcher = ReactCurrentDispatcher.current, ReactCurrentDispatcher.current = null, disableLogs();
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            if (Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x3) {
                control = x3;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x3) {
                control = x3;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x3) {
              control = x3;
            }
            fn();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack == "string") {
            for (var sampleLines = sample.stack.split(`
`), controlLines = control.stack.split(`
`), s6 = sampleLines.length - 1, c4 = controlLines.length - 1; s6 >= 1 && c4 >= 0 && sampleLines[s6] !== controlLines[c4]; )
              c4--;
            for (; s6 >= 1 && c4 >= 0; s6--, c4--)
              if (sampleLines[s6] !== controlLines[c4]) {
                if (s6 !== 1 || c4 !== 1)
                  do
                    if (s6--, c4--, c4 < 0 || sampleLines[s6] !== controlLines[c4]) {
                      var _frame = `
` + sampleLines[s6].replace(" at new ", " at ");
                      return typeof fn == "function" && componentFrameCache.set(fn, _frame), _frame;
                    }
                  while (s6 >= 1 && c4 >= 0);
                break;
              }
          }
        } finally {
          reentry = !1, ReactCurrentDispatcher.current = previousDispatcher, reenableLogs(), Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn ? fn.displayName || fn.name : "", syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        return typeof fn == "function" && componentFrameCache.set(fn, syntheticFrame), syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        return describeNativeComponentFrame(fn, !1);
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null)
          return "";
        if (typeof type == "function")
          return describeNativeComponentFrame(type, shouldConstruct(type));
        if (typeof type == "string")
          return describeBuiltInComponentFrame(type);
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type == "object")
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_BLOCK_TYPE:
              return describeFunctionComponentFrame(type._render);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type, payload = lazyComponent._payload, init2 = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init2(payload), source, ownerFn);
              } catch {
              }
            }
          }
        return "";
      }
      var loggedTypeFailures = {}, ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        if (element) {
          var owner = element._owner, stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
          ReactDebugCurrentFrame.setExtraStackFrame(stack);
        } else
          ReactDebugCurrentFrame.setExtraStackFrame(null);
      }
      function checkPropTypes(typeSpecs, values, location2, componentName, element) {
        {
          var has = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var typeSpecName in typeSpecs)
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] != "function") {
                  var err = Error((componentName || "React class") + ": " + location2 + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw err.name = "Invariant Violation", err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location2, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              error$1 && !(error$1 instanceof Error) && (setCurrentlyValidatingElement(element), error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location2, typeSpecName, typeof error$1), setCurrentlyValidatingElement(null)), error$1 instanceof Error && !(error$1.message in loggedTypeFailures) && (loggedTypeFailures[error$1.message] = !0, setCurrentlyValidatingElement(element), error("Failed %s type: %s", location2, error$1.message), setCurrentlyValidatingElement(null));
            }
        }
      }
      var didWarnAboutInvalidateContextType;
      didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
      var emptyObject = {};
      Object.freeze(emptyObject);
      function maskContext(type, context) {
        var contextTypes = type.contextTypes;
        if (!contextTypes)
          return emptyObject;
        var maskedContext = {};
        for (var contextName in contextTypes)
          maskedContext[contextName] = context[contextName];
        return maskedContext;
      }
      function checkContextTypes(typeSpecs, values, location2) {
        checkPropTypes(typeSpecs, values, location2, "Component");
      }
      function validateContextBounds(context, threadID) {
        for (var i6 = context._threadCount | 0; i6 <= threadID; i6++)
          context[i6] = context._currentValue2, context._threadCount = i6 + 1;
      }
      function processContext(type, context, threadID, isClass) {
        if (isClass) {
          var contextType = type.contextType;
          if ("contextType" in type) {
            var isValid = contextType === null || contextType !== void 0 && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === void 0;
            if (!isValid && !didWarnAboutInvalidateContextType.has(type)) {
              didWarnAboutInvalidateContextType.add(type);
              var addendum = "";
              contextType === void 0 ? addendum = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof contextType != "object" ? addendum = " However, it is set to a " + typeof contextType + "." : contextType.$$typeof === REACT_PROVIDER_TYPE ? addendum = " Did you accidentally pass the Context.Provider instead?" : contextType._context !== void 0 ? addendum = " Did you accidentally pass the Context.Consumer instead?" : addendum = " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.", error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentName(type) || "Component", addendum);
            }
          }
          if (typeof contextType == "object" && contextType !== null)
            return validateContextBounds(contextType, threadID), contextType[threadID];
          {
            var maskedContext = maskContext(type, context);
            return type.contextTypes && checkContextTypes(type.contextTypes, maskedContext, "context"), maskedContext;
          }
        } else {
          var _maskedContext = maskContext(type, context);
          return type.contextTypes && checkContextTypes(type.contextTypes, _maskedContext, "context"), _maskedContext;
        }
      }
      for (var nextAvailableThreadIDs = new Uint16Array(16), i5 = 0; i5 < 15; i5++)
        nextAvailableThreadIDs[i5] = i5 + 1;
      nextAvailableThreadIDs[15] = 0;
      function growThreadCountAndReturnNextAvailable() {
        var oldArray = nextAvailableThreadIDs, oldSize = oldArray.length, newSize = oldSize * 2;
        if (!(newSize <= 65536))
          throw Error("Maximum number of concurrent React renderers exceeded. This can happen if you are not properly destroying the Readable provided by React. Ensure that you call .destroy() on it if you no longer want to read from it, and did not read to the end. If you use .pipe() this should be automatic.");
        var newArray = new Uint16Array(newSize);
        newArray.set(oldArray), nextAvailableThreadIDs = newArray, nextAvailableThreadIDs[0] = oldSize + 1;
        for (var _i = oldSize; _i < newSize - 1; _i++)
          nextAvailableThreadIDs[_i] = _i + 1;
        return nextAvailableThreadIDs[newSize - 1] = 0, oldSize;
      }
      function allocThreadID() {
        var nextID = nextAvailableThreadIDs[0];
        return nextID === 0 ? growThreadCountAndReturnNextAvailable() : (nextAvailableThreadIDs[0] = nextAvailableThreadIDs[nextID], nextID);
      }
      function freeThreadID(id) {
        nextAvailableThreadIDs[id] = nextAvailableThreadIDs[0], nextAvailableThreadIDs[0] = id;
      }
      var RESERVED = 0, STRING = 1, BOOLEANISH_STRING = 2, BOOLEAN = 3, OVERLOADED_BOOLEAN = 4, NUMERIC = 5, POSITIVE_NUMERIC = 6, ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", ROOT_ATTRIBUTE_NAME = "data-reactroot", VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$"), hasOwnProperty2 = Object.prototype.hasOwnProperty, illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
      function isAttributeNameSafe(attributeName) {
        return hasOwnProperty2.call(validatedAttributeNameCache, attributeName) ? !0 : hasOwnProperty2.call(illegalAttributeNameCache, attributeName) ? !1 : VALID_ATTRIBUTE_NAME_REGEX.test(attributeName) ? (validatedAttributeNameCache[attributeName] = !0, !0) : (illegalAttributeNameCache[attributeName] = !0, error("Invalid attribute name: `%s`", attributeName), !1);
      }
      function shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag) {
        return propertyInfo !== null ? propertyInfo.type === RESERVED : isCustomComponentTag ? !1 : name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N");
      }
      function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
        if (propertyInfo !== null && propertyInfo.type === RESERVED)
          return !1;
        switch (typeof value) {
          case "function":
          case "symbol":
            return !0;
          case "boolean": {
            if (isCustomComponentTag)
              return !1;
            if (propertyInfo !== null)
              return !propertyInfo.acceptsBooleans;
            var prefix2 = name.toLowerCase().slice(0, 5);
            return prefix2 !== "data-" && prefix2 !== "aria-";
          }
          default:
            return !1;
        }
      }
      function shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag) {
        if (value === null || typeof value > "u" || shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag))
          return !0;
        if (isCustomComponentTag)
          return !1;
        if (propertyInfo !== null)
          switch (propertyInfo.type) {
            case BOOLEAN:
              return !value;
            case OVERLOADED_BOOLEAN:
              return value === !1;
            case NUMERIC:
              return isNaN(value);
            case POSITIVE_NUMERIC:
              return isNaN(value) || value < 1;
          }
        return !1;
      }
      function getPropertyInfo(name) {
        return properties.hasOwnProperty(name) ? properties[name] : null;
      }
      function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
        this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN, this.attributeName = attributeName, this.attributeNamespace = attributeNamespace, this.mustUseProperty = mustUseProperty, this.propertyName = name, this.type = type, this.sanitizeURL = sanitizeURL2, this.removeEmptyString = removeEmptyString;
      }
      var properties = {}, reservedProps = [
        "children",
        "dangerouslySetInnerHTML",
        "defaultValue",
        "defaultChecked",
        "innerHTML",
        "suppressContentEditableWarning",
        "suppressHydrationWarning",
        "style"
      ];
      reservedProps.forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          RESERVED,
          !1,
          name,
          null,
          !1,
          !1
        );
      }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(_ref) {
        var name = _ref[0], attributeName = _ref[1];
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          !1,
          attributeName,
          null,
          !1,
          !1
        );
      }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEANISH_STRING,
          !1,
          name.toLowerCase(),
          null,
          !1,
          !1
        );
      }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEANISH_STRING,
          !1,
          name,
          null,
          !1,
          !1
        );
      }), [
        "allowFullScreen",
        "async",
        "autoFocus",
        "autoPlay",
        "controls",
        "default",
        "defer",
        "disabled",
        "disablePictureInPicture",
        "disableRemotePlayback",
        "formNoValidate",
        "hidden",
        "loop",
        "noModule",
        "noValidate",
        "open",
        "playsInline",
        "readOnly",
        "required",
        "reversed",
        "scoped",
        "seamless",
        "itemScope"
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEAN,
          !1,
          name.toLowerCase(),
          null,
          !1,
          !1
        );
      }), [
        "checked",
        "multiple",
        "muted",
        "selected"
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEAN,
          !0,
          name,
          null,
          !1,
          !1
        );
      }), [
        "capture",
        "download"
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          OVERLOADED_BOOLEAN,
          !1,
          name,
          null,
          !1,
          !1
        );
      }), [
        "cols",
        "rows",
        "size",
        "span"
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          POSITIVE_NUMERIC,
          !1,
          name,
          null,
          !1,
          !1
        );
      }), ["rowSpan", "start"].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          NUMERIC,
          !1,
          name.toLowerCase(),
          null,
          !1,
          !1
        );
      });
      var CAMELIZE = /[\-\:]([a-z])/g, capitalize = function(token) {
        return token[1].toUpperCase();
      };
      [
        "accent-height",
        "alignment-baseline",
        "arabic-form",
        "baseline-shift",
        "cap-height",
        "clip-path",
        "clip-rule",
        "color-interpolation",
        "color-interpolation-filters",
        "color-profile",
        "color-rendering",
        "dominant-baseline",
        "enable-background",
        "fill-opacity",
        "fill-rule",
        "flood-color",
        "flood-opacity",
        "font-family",
        "font-size",
        "font-size-adjust",
        "font-stretch",
        "font-style",
        "font-variant",
        "font-weight",
        "glyph-name",
        "glyph-orientation-horizontal",
        "glyph-orientation-vertical",
        "horiz-adv-x",
        "horiz-origin-x",
        "image-rendering",
        "letter-spacing",
        "lighting-color",
        "marker-end",
        "marker-mid",
        "marker-start",
        "overline-position",
        "overline-thickness",
        "paint-order",
        "panose-1",
        "pointer-events",
        "rendering-intent",
        "shape-rendering",
        "stop-color",
        "stop-opacity",
        "strikethrough-position",
        "strikethrough-thickness",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-opacity",
        "stroke-width",
        "text-anchor",
        "text-decoration",
        "text-rendering",
        "underline-position",
        "underline-thickness",
        "unicode-bidi",
        "unicode-range",
        "units-per-em",
        "v-alphabetic",
        "v-hanging",
        "v-ideographic",
        "v-mathematical",
        "vector-effect",
        "vert-adv-y",
        "vert-origin-x",
        "vert-origin-y",
        "word-spacing",
        "writing-mode",
        "xmlns:xlink",
        "x-height"
      ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          !1,
          attributeName,
          null,
          !1,
          !1
        );
      }), [
        "xlink:actuate",
        "xlink:arcrole",
        "xlink:role",
        "xlink:show",
        "xlink:title",
        "xlink:type"
      ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          !1,
          attributeName,
          "http://www.w3.org/1999/xlink",
          !1,
          !1
        );
      }), [
        "xml:base",
        "xml:lang",
        "xml:space"
      ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          !1,
          attributeName,
          "http://www.w3.org/XML/1998/namespace",
          !1,
          !1
        );
      }), ["tabIndex", "crossOrigin"].forEach(function(attributeName) {
        properties[attributeName] = new PropertyInfoRecord(
          attributeName,
          STRING,
          !1,
          attributeName.toLowerCase(),
          null,
          !1,
          !1
        );
      });
      var xlinkHref = "xlinkHref";
      properties[xlinkHref] = new PropertyInfoRecord(
        "xlinkHref",
        STRING,
        !1,
        "xlink:href",
        "http://www.w3.org/1999/xlink",
        !0,
        !1
      ), ["src", "href", "action", "formAction"].forEach(function(attributeName) {
        properties[attributeName] = new PropertyInfoRecord(
          attributeName,
          STRING,
          !1,
          attributeName.toLowerCase(),
          null,
          !0,
          !0
        );
      });
      var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, didWarn = !1;
      function sanitizeURL(url) {
        !didWarn && isJavaScriptProtocol.test(url) && (didWarn = !0, error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url)));
      }
      var matchHtmlRegExp = /["'&<>]/;
      function escapeHtml(string) {
        var str = "" + string, match = matchHtmlRegExp.exec(str);
        if (!match)
          return str;
        var escape, html = "", index, lastIndex = 0;
        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              escape = "&quot;";
              break;
            case 38:
              escape = "&amp;";
              break;
            case 39:
              escape = "&#x27;";
              break;
            case 60:
              escape = "&lt;";
              break;
            case 62:
              escape = "&gt;";
              break;
            default:
              continue;
          }
          lastIndex !== index && (html += str.substring(lastIndex, index)), lastIndex = index + 1, html += escape;
        }
        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
      }
      function escapeTextForBrowser(text) {
        return typeof text == "boolean" || typeof text == "number" ? "" + text : escapeHtml(text);
      }
      function quoteAttributeValueForBrowser(value) {
        return '"' + escapeTextForBrowser(value) + '"';
      }
      function createMarkupForRoot() {
        return ROOT_ATTRIBUTE_NAME + '=""';
      }
      function createMarkupForProperty(name, value) {
        var propertyInfo = getPropertyInfo(name);
        if (name !== "style" && shouldIgnoreAttribute(name, propertyInfo, !1) || shouldRemoveAttribute(name, value, propertyInfo, !1))
          return "";
        if (propertyInfo !== null) {
          var attributeName = propertyInfo.attributeName, type = propertyInfo.type;
          return type === BOOLEAN || type === OVERLOADED_BOOLEAN && value === !0 ? attributeName + '=""' : (propertyInfo.sanitizeURL && (value = "" + value, sanitizeURL(value)), attributeName + "=" + quoteAttributeValueForBrowser(value));
        } else if (isAttributeNameSafe(name))
          return name + "=" + quoteAttributeValueForBrowser(value);
        return "";
      }
      function createMarkupForCustomAttribute(name, value) {
        return !isAttributeNameSafe(name) || value == null ? "" : name + "=" + quoteAttributeValueForBrowser(value);
      }
      function is(x3, y3) {
        return x3 === y3 && (x3 !== 0 || 1 / x3 === 1 / y3) || x3 !== x3 && y3 !== y3;
      }
      var objectIs = typeof Object.is == "function" ? Object.is : is, currentlyRenderingComponent = null, firstWorkInProgressHook = null, workInProgressHook = null, isReRender = !1, didScheduleRenderPhaseUpdate = !1, renderPhaseUpdates = null, numberOfReRenders = 0, RE_RENDER_LIMIT = 25, isInHookUserCodeInDev = !1, currentHookNameInDev;
      function resolveCurrentlyRenderingComponent() {
        if (currentlyRenderingComponent === null)
          throw Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
        return isInHookUserCodeInDev && error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks"), currentlyRenderingComponent;
      }
      function areHookInputsEqual(nextDeps, prevDeps) {
        if (prevDeps === null)
          return error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev), !1;
        nextDeps.length !== prevDeps.length && error(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, currentHookNameInDev, "[" + nextDeps.join(", ") + "]", "[" + prevDeps.join(", ") + "]");
        for (var i6 = 0; i6 < prevDeps.length && i6 < nextDeps.length; i6++)
          if (!objectIs(nextDeps[i6], prevDeps[i6]))
            return !1;
        return !0;
      }
      function createHook() {
        if (numberOfReRenders > 0)
          throw Error("Rendered more hooks than during the previous render");
        return {
          memoizedState: null,
          queue: null,
          next: null
        };
      }
      function createWorkInProgressHook() {
        return workInProgressHook === null ? firstWorkInProgressHook === null ? (isReRender = !1, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = !0, workInProgressHook = firstWorkInProgressHook) : workInProgressHook.next === null ? (isReRender = !1, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = !0, workInProgressHook = workInProgressHook.next), workInProgressHook;
      }
      function prepareToUseHooks(componentIdentity) {
        currentlyRenderingComponent = componentIdentity, isInHookUserCodeInDev = !1;
      }
      function finishHooks(Component, props, children, refOrContext) {
        for (; didScheduleRenderPhaseUpdate; )
          didScheduleRenderPhaseUpdate = !1, numberOfReRenders += 1, workInProgressHook = null, children = Component(props, refOrContext);
        return resetHooksState(), children;
      }
      function resetHooksState() {
        isInHookUserCodeInDev = !1, currentlyRenderingComponent = null, didScheduleRenderPhaseUpdate = !1, firstWorkInProgressHook = null, numberOfReRenders = 0, renderPhaseUpdates = null, workInProgressHook = null;
      }
      function readContext(context, observedBits) {
        var threadID = currentPartialRenderer.threadID;
        return validateContextBounds(context, threadID), isInHookUserCodeInDev && error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."), context[threadID];
      }
      function useContext4(context, observedBits) {
        currentHookNameInDev = "useContext", resolveCurrentlyRenderingComponent();
        var threadID = currentPartialRenderer.threadID;
        return validateContextBounds(context, threadID), context[threadID];
      }
      function basicStateReducer(state, action) {
        return typeof action == "function" ? action(state) : action;
      }
      function useState4(initialState) {
        return currentHookNameInDev = "useState", useReducer(
          basicStateReducer,
          initialState
        );
      }
      function useReducer(reducer, initialArg, init2) {
        if (reducer !== basicStateReducer && (currentHookNameInDev = "useReducer"), currentlyRenderingComponent = resolveCurrentlyRenderingComponent(), workInProgressHook = createWorkInProgressHook(), isReRender) {
          var queue2 = workInProgressHook.queue, dispatch = queue2.dispatch;
          if (renderPhaseUpdates !== null) {
            var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue2);
            if (firstRenderPhaseUpdate !== void 0) {
              renderPhaseUpdates.delete(queue2);
              var newState = workInProgressHook.memoizedState, update = firstRenderPhaseUpdate;
              do {
                var action = update.action;
                isInHookUserCodeInDev = !0, newState = reducer(newState, action), isInHookUserCodeInDev = !1, update = update.next;
              } while (update !== null);
              return workInProgressHook.memoizedState = newState, [newState, dispatch];
            }
          }
          return [workInProgressHook.memoizedState, dispatch];
        } else {
          isInHookUserCodeInDev = !0;
          var initialState;
          reducer === basicStateReducer ? initialState = typeof initialArg == "function" ? initialArg() : initialArg : initialState = init2 !== void 0 ? init2(initialArg) : initialArg, isInHookUserCodeInDev = !1, workInProgressHook.memoizedState = initialState;
          var _queue = workInProgressHook.queue = {
            last: null,
            dispatch: null
          }, _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
          return [workInProgressHook.memoizedState, _dispatch];
        }
      }
      function useMemo4(nextCreate, deps) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent(), workInProgressHook = createWorkInProgressHook();
        var nextDeps = deps === void 0 ? null : deps;
        if (workInProgressHook !== null) {
          var prevState = workInProgressHook.memoizedState;
          if (prevState !== null && nextDeps !== null) {
            var prevDeps = prevState[1];
            if (areHookInputsEqual(nextDeps, prevDeps))
              return prevState[0];
          }
        }
        isInHookUserCodeInDev = !0;
        var nextValue = nextCreate();
        return isInHookUserCodeInDev = !1, workInProgressHook.memoizedState = [nextValue, nextDeps], nextValue;
      }
      function useRef5(initialValue) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent(), workInProgressHook = createWorkInProgressHook();
        var previousRef = workInProgressHook.memoizedState;
        if (previousRef === null) {
          var ref = {
            current: initialValue
          };
          return Object.seal(ref), workInProgressHook.memoizedState = ref, ref;
        } else
          return previousRef;
      }
      function useLayoutEffect4(create, inputs) {
        currentHookNameInDev = "useLayoutEffect", error("useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.");
      }
      function dispatchAction(componentIdentity, queue2, action) {
        if (!(numberOfReRenders < RE_RENDER_LIMIT))
          throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
        if (componentIdentity === currentlyRenderingComponent) {
          didScheduleRenderPhaseUpdate = !0;
          var update = {
            action,
            next: null
          };
          renderPhaseUpdates === null && (renderPhaseUpdates = /* @__PURE__ */ new Map());
          var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue2);
          if (firstRenderPhaseUpdate === void 0)
            renderPhaseUpdates.set(queue2, update);
          else {
            for (var lastRenderPhaseUpdate = firstRenderPhaseUpdate; lastRenderPhaseUpdate.next !== null; )
              lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
            lastRenderPhaseUpdate.next = update;
          }
        }
      }
      function useCallback5(callback, deps) {
        return useMemo4(function() {
          return callback;
        }, deps);
      }
      function useMutableSource(source, getSnapshot, subscribe) {
        return resolveCurrentlyRenderingComponent(), getSnapshot(source._source);
      }
      function useDeferredValue(value) {
        return resolveCurrentlyRenderingComponent(), value;
      }
      function useTransition2() {
        resolveCurrentlyRenderingComponent();
        var startTransition = function(callback) {
          callback();
        };
        return [startTransition, !1];
      }
      function useOpaqueIdentifier() {
        return (currentPartialRenderer.identifierPrefix || "") + "R:" + (currentPartialRenderer.uniqueID++).toString(36);
      }
      function noop2() {
      }
      var currentPartialRenderer = null;
      function setCurrentPartialRenderer(renderer) {
        currentPartialRenderer = renderer;
      }
      var Dispatcher = {
        readContext,
        useContext: useContext4,
        useMemo: useMemo4,
        useReducer,
        useRef: useRef5,
        useState: useState4,
        useLayoutEffect: useLayoutEffect4,
        useCallback: useCallback5,
        useImperativeHandle: noop2,
        useEffect: noop2,
        useDebugValue: noop2,
        useDeferredValue,
        useTransition: useTransition2,
        useOpaqueIdentifier,
        useMutableSource
      }, HTML_NAMESPACE = "http://www.w3.org/1999/xhtml", MATH_NAMESPACE = "http://www.w3.org/1998/Math/MathML", SVG_NAMESPACE = "http://www.w3.org/2000/svg", Namespaces = {
        html: HTML_NAMESPACE,
        mathml: MATH_NAMESPACE,
        svg: SVG_NAMESPACE
      };
      function getIntrinsicNamespace(type) {
        switch (type) {
          case "svg":
            return SVG_NAMESPACE;
          case "math":
            return MATH_NAMESPACE;
          default:
            return HTML_NAMESPACE;
        }
      }
      function getChildNamespace(parentNamespace, type) {
        return parentNamespace == null || parentNamespace === HTML_NAMESPACE ? getIntrinsicNamespace(type) : parentNamespace === SVG_NAMESPACE && type === "foreignObject" ? HTML_NAMESPACE : parentNamespace;
      }
      var hasReadOnlyValue = {
        button: !0,
        checkbox: !0,
        image: !0,
        hidden: !0,
        radio: !0,
        reset: !0,
        submit: !0
      };
      function checkControlledValueProps(tagName, props) {
        hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null || error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), props.onChange || props.readOnly || props.disabled || props.checked == null || error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
      }
      var omittedCloseTags = {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
      }, voidElementTags = _assign({
        menuitem: !0
      }, omittedCloseTags), HTML = "__html";
      function assertValidProps(tag, props) {
        if (!!props) {
          if (voidElementTags[tag] && !(props.children == null && props.dangerouslySetInnerHTML == null))
            throw Error(tag + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
          if (props.dangerouslySetInnerHTML != null) {
            if (props.children != null)
              throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            if (!(typeof props.dangerouslySetInnerHTML == "object" && HTML in props.dangerouslySetInnerHTML))
              throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
          }
          if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null && error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), !(props.style == null || typeof props.style == "object"))
            throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
        }
      }
      var isUnitlessNumber = {
        animationIterationCount: !0,
        borderImageOutset: !0,
        borderImageSlice: !0,
        borderImageWidth: !0,
        boxFlex: !0,
        boxFlexGroup: !0,
        boxOrdinalGroup: !0,
        columnCount: !0,
        columns: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        flexOrder: !0,
        gridArea: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowSpan: !0,
        gridRowStart: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnSpan: !0,
        gridColumnStart: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        floodOpacity: !0,
        stopOpacity: !0,
        strokeDasharray: !0,
        strokeDashoffset: !0,
        strokeMiterlimit: !0,
        strokeOpacity: !0,
        strokeWidth: !0
      };
      function prefixKey(prefix2, key) {
        return prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
      }
      var prefixes = ["Webkit", "ms", "Moz", "O"];
      Object.keys(isUnitlessNumber).forEach(function(prop) {
        prefixes.forEach(function(prefix2) {
          isUnitlessNumber[prefixKey(prefix2, prop)] = isUnitlessNumber[prop];
        });
      });
      function dangerousStyleValue(name, value, isCustomProperty) {
        var isEmpty = value == null || typeof value == "boolean" || value === "";
        return isEmpty ? "" : !isCustomProperty && typeof value == "number" && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) ? value + "px" : ("" + value).trim();
      }
      var uppercasePattern = /([A-Z])/g, msPattern = /^ms-/;
      function hyphenateStyleName(name) {
        return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-");
      }
      function isCustomComponent(tagName, props) {
        if (tagName.indexOf("-") === -1)
          return typeof props.is == "string";
        switch (tagName) {
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return !1;
          default:
            return !0;
        }
      }
      var warnValidStyle = function() {
      };
      {
        var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/, msPattern$1 = /^-ms-/, hyphenPattern = /-(.)/g, badStyleValueWithSemicolonPattern = /;\s*$/, warnedStyleNames = {}, warnedStyleValues = {}, warnedForNaNValue = !1, warnedForInfinityValue = !1, camelize = function(string) {
          return string.replace(hyphenPattern, function(_, character) {
            return character.toUpperCase();
          });
        }, warnHyphenatedStyleName = function(name) {
          warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name] || (warnedStyleNames[name] = !0, error(
            "Unsupported style property %s. Did you mean %s?",
            name,
            camelize(name.replace(msPattern$1, "ms-"))
          ));
        }, warnBadVendoredStyleName = function(name) {
          warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name] || (warnedStyleNames[name] = !0, error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1)));
        }, warnStyleValueWithSemicolon = function(name, value) {
          warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value] || (warnedStyleValues[value] = !0, error(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, "")));
        }, warnStyleValueIsNaN = function(name, value) {
          warnedForNaNValue || (warnedForNaNValue = !0, error("`NaN` is an invalid value for the `%s` css style property.", name));
        }, warnStyleValueIsInfinity = function(name, value) {
          warnedForInfinityValue || (warnedForInfinityValue = !0, error("`Infinity` is an invalid value for the `%s` css style property.", name));
        };
        warnValidStyle = function(name, value) {
          name.indexOf("-") > -1 ? warnHyphenatedStyleName(name) : badVendoredStyleNamePattern.test(name) ? warnBadVendoredStyleName(name) : badStyleValueWithSemicolonPattern.test(value) && warnStyleValueWithSemicolon(name, value), typeof value == "number" && (isNaN(value) ? warnStyleValueIsNaN(name, value) : isFinite(value) || warnStyleValueIsInfinity(name, value));
        };
      }
      var warnValidStyle$1 = warnValidStyle, ariaProperties = {
        "aria-current": 0,
        "aria-details": 0,
        "aria-disabled": 0,
        "aria-hidden": 0,
        "aria-invalid": 0,
        "aria-keyshortcuts": 0,
        "aria-label": 0,
        "aria-roledescription": 0,
        "aria-autocomplete": 0,
        "aria-checked": 0,
        "aria-expanded": 0,
        "aria-haspopup": 0,
        "aria-level": 0,
        "aria-modal": 0,
        "aria-multiline": 0,
        "aria-multiselectable": 0,
        "aria-orientation": 0,
        "aria-placeholder": 0,
        "aria-pressed": 0,
        "aria-readonly": 0,
        "aria-required": 0,
        "aria-selected": 0,
        "aria-sort": 0,
        "aria-valuemax": 0,
        "aria-valuemin": 0,
        "aria-valuenow": 0,
        "aria-valuetext": 0,
        "aria-atomic": 0,
        "aria-busy": 0,
        "aria-live": 0,
        "aria-relevant": 0,
        "aria-dropeffect": 0,
        "aria-grabbed": 0,
        "aria-activedescendant": 0,
        "aria-colcount": 0,
        "aria-colindex": 0,
        "aria-colspan": 0,
        "aria-controls": 0,
        "aria-describedby": 0,
        "aria-errormessage": 0,
        "aria-flowto": 0,
        "aria-labelledby": 0,
        "aria-owns": 0,
        "aria-posinset": 0,
        "aria-rowcount": 0,
        "aria-rowindex": 0,
        "aria-rowspan": 0,
        "aria-setsize": 0
      }, warnedProperties = {}, rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$"), rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$"), hasOwnProperty$1 = Object.prototype.hasOwnProperty;
      function validateProperty(tagName, name) {
        {
          if (hasOwnProperty$1.call(warnedProperties, name) && warnedProperties[name])
            return !0;
          if (rARIACamel.test(name)) {
            var ariaName = "aria-" + name.slice(4).toLowerCase(), correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
            if (correctName == null)
              return error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name), warnedProperties[name] = !0, !0;
            if (name !== correctName)
              return error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName), warnedProperties[name] = !0, !0;
          }
          if (rARIA.test(name)) {
            var lowerCasedName = name.toLowerCase(), standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
            if (standardName == null)
              return warnedProperties[name] = !0, !1;
            if (name !== standardName)
              return error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName), warnedProperties[name] = !0, !0;
          }
        }
        return !0;
      }
      function warnInvalidARIAProps(type, props) {
        {
          var invalidProps = [];
          for (var key in props) {
            var isValid = validateProperty(type, key);
            isValid || invalidProps.push(key);
          }
          var unknownPropString = invalidProps.map(function(prop) {
            return "`" + prop + "`";
          }).join(", ");
          invalidProps.length === 1 ? error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type) : invalidProps.length > 1 && error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
        }
      }
      function validateProperties(type, props) {
        isCustomComponent(type, props) || warnInvalidARIAProps(type, props);
      }
      var didWarnValueNull = !1;
      function validateProperties$1(type, props) {
        {
          if (type !== "input" && type !== "textarea" && type !== "select")
            return;
          props != null && props.value === null && !didWarnValueNull && (didWarnValueNull = !0, type === "select" && props.multiple ? error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type) : error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type));
        }
      }
      var possibleStandardNames = {
        accept: "accept",
        acceptcharset: "acceptCharset",
        "accept-charset": "acceptCharset",
        accesskey: "accessKey",
        action: "action",
        allowfullscreen: "allowFullScreen",
        alt: "alt",
        as: "as",
        async: "async",
        autocapitalize: "autoCapitalize",
        autocomplete: "autoComplete",
        autocorrect: "autoCorrect",
        autofocus: "autoFocus",
        autoplay: "autoPlay",
        autosave: "autoSave",
        capture: "capture",
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        challenge: "challenge",
        charset: "charSet",
        checked: "checked",
        children: "children",
        cite: "cite",
        class: "className",
        classid: "classID",
        classname: "className",
        cols: "cols",
        colspan: "colSpan",
        content: "content",
        contenteditable: "contentEditable",
        contextmenu: "contextMenu",
        controls: "controls",
        controlslist: "controlsList",
        coords: "coords",
        crossorigin: "crossOrigin",
        dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
        data: "data",
        datetime: "dateTime",
        default: "default",
        defaultchecked: "defaultChecked",
        defaultvalue: "defaultValue",
        defer: "defer",
        dir: "dir",
        disabled: "disabled",
        disablepictureinpicture: "disablePictureInPicture",
        disableremoteplayback: "disableRemotePlayback",
        download: "download",
        draggable: "draggable",
        enctype: "encType",
        enterkeyhint: "enterKeyHint",
        for: "htmlFor",
        form: "form",
        formmethod: "formMethod",
        formaction: "formAction",
        formenctype: "formEncType",
        formnovalidate: "formNoValidate",
        formtarget: "formTarget",
        frameborder: "frameBorder",
        headers: "headers",
        height: "height",
        hidden: "hidden",
        high: "high",
        href: "href",
        hreflang: "hrefLang",
        htmlfor: "htmlFor",
        httpequiv: "httpEquiv",
        "http-equiv": "httpEquiv",
        icon: "icon",
        id: "id",
        innerhtml: "innerHTML",
        inputmode: "inputMode",
        integrity: "integrity",
        is: "is",
        itemid: "itemID",
        itemprop: "itemProp",
        itemref: "itemRef",
        itemscope: "itemScope",
        itemtype: "itemType",
        keyparams: "keyParams",
        keytype: "keyType",
        kind: "kind",
        label: "label",
        lang: "lang",
        list: "list",
        loop: "loop",
        low: "low",
        manifest: "manifest",
        marginwidth: "marginWidth",
        marginheight: "marginHeight",
        max: "max",
        maxlength: "maxLength",
        media: "media",
        mediagroup: "mediaGroup",
        method: "method",
        min: "min",
        minlength: "minLength",
        multiple: "multiple",
        muted: "muted",
        name: "name",
        nomodule: "noModule",
        nonce: "nonce",
        novalidate: "noValidate",
        open: "open",
        optimum: "optimum",
        pattern: "pattern",
        placeholder: "placeholder",
        playsinline: "playsInline",
        poster: "poster",
        preload: "preload",
        profile: "profile",
        radiogroup: "radioGroup",
        readonly: "readOnly",
        referrerpolicy: "referrerPolicy",
        rel: "rel",
        required: "required",
        reversed: "reversed",
        role: "role",
        rows: "rows",
        rowspan: "rowSpan",
        sandbox: "sandbox",
        scope: "scope",
        scoped: "scoped",
        scrolling: "scrolling",
        seamless: "seamless",
        selected: "selected",
        shape: "shape",
        size: "size",
        sizes: "sizes",
        span: "span",
        spellcheck: "spellCheck",
        src: "src",
        srcdoc: "srcDoc",
        srclang: "srcLang",
        srcset: "srcSet",
        start: "start",
        step: "step",
        style: "style",
        summary: "summary",
        tabindex: "tabIndex",
        target: "target",
        title: "title",
        type: "type",
        usemap: "useMap",
        value: "value",
        width: "width",
        wmode: "wmode",
        wrap: "wrap",
        about: "about",
        accentheight: "accentHeight",
        "accent-height": "accentHeight",
        accumulate: "accumulate",
        additive: "additive",
        alignmentbaseline: "alignmentBaseline",
        "alignment-baseline": "alignmentBaseline",
        allowreorder: "allowReorder",
        alphabetic: "alphabetic",
        amplitude: "amplitude",
        arabicform: "arabicForm",
        "arabic-form": "arabicForm",
        ascent: "ascent",
        attributename: "attributeName",
        attributetype: "attributeType",
        autoreverse: "autoReverse",
        azimuth: "azimuth",
        basefrequency: "baseFrequency",
        baselineshift: "baselineShift",
        "baseline-shift": "baselineShift",
        baseprofile: "baseProfile",
        bbox: "bbox",
        begin: "begin",
        bias: "bias",
        by: "by",
        calcmode: "calcMode",
        capheight: "capHeight",
        "cap-height": "capHeight",
        clip: "clip",
        clippath: "clipPath",
        "clip-path": "clipPath",
        clippathunits: "clipPathUnits",
        cliprule: "clipRule",
        "clip-rule": "clipRule",
        color: "color",
        colorinterpolation: "colorInterpolation",
        "color-interpolation": "colorInterpolation",
        colorinterpolationfilters: "colorInterpolationFilters",
        "color-interpolation-filters": "colorInterpolationFilters",
        colorprofile: "colorProfile",
        "color-profile": "colorProfile",
        colorrendering: "colorRendering",
        "color-rendering": "colorRendering",
        contentscripttype: "contentScriptType",
        contentstyletype: "contentStyleType",
        cursor: "cursor",
        cx: "cx",
        cy: "cy",
        d: "d",
        datatype: "datatype",
        decelerate: "decelerate",
        descent: "descent",
        diffuseconstant: "diffuseConstant",
        direction: "direction",
        display: "display",
        divisor: "divisor",
        dominantbaseline: "dominantBaseline",
        "dominant-baseline": "dominantBaseline",
        dur: "dur",
        dx: "dx",
        dy: "dy",
        edgemode: "edgeMode",
        elevation: "elevation",
        enablebackground: "enableBackground",
        "enable-background": "enableBackground",
        end: "end",
        exponent: "exponent",
        externalresourcesrequired: "externalResourcesRequired",
        fill: "fill",
        fillopacity: "fillOpacity",
        "fill-opacity": "fillOpacity",
        fillrule: "fillRule",
        "fill-rule": "fillRule",
        filter: "filter",
        filterres: "filterRes",
        filterunits: "filterUnits",
        floodopacity: "floodOpacity",
        "flood-opacity": "floodOpacity",
        floodcolor: "floodColor",
        "flood-color": "floodColor",
        focusable: "focusable",
        fontfamily: "fontFamily",
        "font-family": "fontFamily",
        fontsize: "fontSize",
        "font-size": "fontSize",
        fontsizeadjust: "fontSizeAdjust",
        "font-size-adjust": "fontSizeAdjust",
        fontstretch: "fontStretch",
        "font-stretch": "fontStretch",
        fontstyle: "fontStyle",
        "font-style": "fontStyle",
        fontvariant: "fontVariant",
        "font-variant": "fontVariant",
        fontweight: "fontWeight",
        "font-weight": "fontWeight",
        format: "format",
        from: "from",
        fx: "fx",
        fy: "fy",
        g1: "g1",
        g2: "g2",
        glyphname: "glyphName",
        "glyph-name": "glyphName",
        glyphorientationhorizontal: "glyphOrientationHorizontal",
        "glyph-orientation-horizontal": "glyphOrientationHorizontal",
        glyphorientationvertical: "glyphOrientationVertical",
        "glyph-orientation-vertical": "glyphOrientationVertical",
        glyphref: "glyphRef",
        gradienttransform: "gradientTransform",
        gradientunits: "gradientUnits",
        hanging: "hanging",
        horizadvx: "horizAdvX",
        "horiz-adv-x": "horizAdvX",
        horizoriginx: "horizOriginX",
        "horiz-origin-x": "horizOriginX",
        ideographic: "ideographic",
        imagerendering: "imageRendering",
        "image-rendering": "imageRendering",
        in2: "in2",
        in: "in",
        inlist: "inlist",
        intercept: "intercept",
        k1: "k1",
        k2: "k2",
        k3: "k3",
        k4: "k4",
        k: "k",
        kernelmatrix: "kernelMatrix",
        kernelunitlength: "kernelUnitLength",
        kerning: "kerning",
        keypoints: "keyPoints",
        keysplines: "keySplines",
        keytimes: "keyTimes",
        lengthadjust: "lengthAdjust",
        letterspacing: "letterSpacing",
        "letter-spacing": "letterSpacing",
        lightingcolor: "lightingColor",
        "lighting-color": "lightingColor",
        limitingconeangle: "limitingConeAngle",
        local: "local",
        markerend: "markerEnd",
        "marker-end": "markerEnd",
        markerheight: "markerHeight",
        markermid: "markerMid",
        "marker-mid": "markerMid",
        markerstart: "markerStart",
        "marker-start": "markerStart",
        markerunits: "markerUnits",
        markerwidth: "markerWidth",
        mask: "mask",
        maskcontentunits: "maskContentUnits",
        maskunits: "maskUnits",
        mathematical: "mathematical",
        mode: "mode",
        numoctaves: "numOctaves",
        offset: "offset",
        opacity: "opacity",
        operator: "operator",
        order: "order",
        orient: "orient",
        orientation: "orientation",
        origin: "origin",
        overflow: "overflow",
        overlineposition: "overlinePosition",
        "overline-position": "overlinePosition",
        overlinethickness: "overlineThickness",
        "overline-thickness": "overlineThickness",
        paintorder: "paintOrder",
        "paint-order": "paintOrder",
        panose1: "panose1",
        "panose-1": "panose1",
        pathlength: "pathLength",
        patterncontentunits: "patternContentUnits",
        patterntransform: "patternTransform",
        patternunits: "patternUnits",
        pointerevents: "pointerEvents",
        "pointer-events": "pointerEvents",
        points: "points",
        pointsatx: "pointsAtX",
        pointsaty: "pointsAtY",
        pointsatz: "pointsAtZ",
        prefix: "prefix",
        preservealpha: "preserveAlpha",
        preserveaspectratio: "preserveAspectRatio",
        primitiveunits: "primitiveUnits",
        property: "property",
        r: "r",
        radius: "radius",
        refx: "refX",
        refy: "refY",
        renderingintent: "renderingIntent",
        "rendering-intent": "renderingIntent",
        repeatcount: "repeatCount",
        repeatdur: "repeatDur",
        requiredextensions: "requiredExtensions",
        requiredfeatures: "requiredFeatures",
        resource: "resource",
        restart: "restart",
        result: "result",
        results: "results",
        rotate: "rotate",
        rx: "rx",
        ry: "ry",
        scale: "scale",
        security: "security",
        seed: "seed",
        shaperendering: "shapeRendering",
        "shape-rendering": "shapeRendering",
        slope: "slope",
        spacing: "spacing",
        specularconstant: "specularConstant",
        specularexponent: "specularExponent",
        speed: "speed",
        spreadmethod: "spreadMethod",
        startoffset: "startOffset",
        stddeviation: "stdDeviation",
        stemh: "stemh",
        stemv: "stemv",
        stitchtiles: "stitchTiles",
        stopcolor: "stopColor",
        "stop-color": "stopColor",
        stopopacity: "stopOpacity",
        "stop-opacity": "stopOpacity",
        strikethroughposition: "strikethroughPosition",
        "strikethrough-position": "strikethroughPosition",
        strikethroughthickness: "strikethroughThickness",
        "strikethrough-thickness": "strikethroughThickness",
        string: "string",
        stroke: "stroke",
        strokedasharray: "strokeDasharray",
        "stroke-dasharray": "strokeDasharray",
        strokedashoffset: "strokeDashoffset",
        "stroke-dashoffset": "strokeDashoffset",
        strokelinecap: "strokeLinecap",
        "stroke-linecap": "strokeLinecap",
        strokelinejoin: "strokeLinejoin",
        "stroke-linejoin": "strokeLinejoin",
        strokemiterlimit: "strokeMiterlimit",
        "stroke-miterlimit": "strokeMiterlimit",
        strokewidth: "strokeWidth",
        "stroke-width": "strokeWidth",
        strokeopacity: "strokeOpacity",
        "stroke-opacity": "strokeOpacity",
        suppresscontenteditablewarning: "suppressContentEditableWarning",
        suppresshydrationwarning: "suppressHydrationWarning",
        surfacescale: "surfaceScale",
        systemlanguage: "systemLanguage",
        tablevalues: "tableValues",
        targetx: "targetX",
        targety: "targetY",
        textanchor: "textAnchor",
        "text-anchor": "textAnchor",
        textdecoration: "textDecoration",
        "text-decoration": "textDecoration",
        textlength: "textLength",
        textrendering: "textRendering",
        "text-rendering": "textRendering",
        to: "to",
        transform: "transform",
        typeof: "typeof",
        u1: "u1",
        u2: "u2",
        underlineposition: "underlinePosition",
        "underline-position": "underlinePosition",
        underlinethickness: "underlineThickness",
        "underline-thickness": "underlineThickness",
        unicode: "unicode",
        unicodebidi: "unicodeBidi",
        "unicode-bidi": "unicodeBidi",
        unicoderange: "unicodeRange",
        "unicode-range": "unicodeRange",
        unitsperem: "unitsPerEm",
        "units-per-em": "unitsPerEm",
        unselectable: "unselectable",
        valphabetic: "vAlphabetic",
        "v-alphabetic": "vAlphabetic",
        values: "values",
        vectoreffect: "vectorEffect",
        "vector-effect": "vectorEffect",
        version: "version",
        vertadvy: "vertAdvY",
        "vert-adv-y": "vertAdvY",
        vertoriginx: "vertOriginX",
        "vert-origin-x": "vertOriginX",
        vertoriginy: "vertOriginY",
        "vert-origin-y": "vertOriginY",
        vhanging: "vHanging",
        "v-hanging": "vHanging",
        videographic: "vIdeographic",
        "v-ideographic": "vIdeographic",
        viewbox: "viewBox",
        viewtarget: "viewTarget",
        visibility: "visibility",
        vmathematical: "vMathematical",
        "v-mathematical": "vMathematical",
        vocab: "vocab",
        widths: "widths",
        wordspacing: "wordSpacing",
        "word-spacing": "wordSpacing",
        writingmode: "writingMode",
        "writing-mode": "writingMode",
        x1: "x1",
        x2: "x2",
        x: "x",
        xchannelselector: "xChannelSelector",
        xheight: "xHeight",
        "x-height": "xHeight",
        xlinkactuate: "xlinkActuate",
        "xlink:actuate": "xlinkActuate",
        xlinkarcrole: "xlinkArcrole",
        "xlink:arcrole": "xlinkArcrole",
        xlinkhref: "xlinkHref",
        "xlink:href": "xlinkHref",
        xlinkrole: "xlinkRole",
        "xlink:role": "xlinkRole",
        xlinkshow: "xlinkShow",
        "xlink:show": "xlinkShow",
        xlinktitle: "xlinkTitle",
        "xlink:title": "xlinkTitle",
        xlinktype: "xlinkType",
        "xlink:type": "xlinkType",
        xmlbase: "xmlBase",
        "xml:base": "xmlBase",
        xmllang: "xmlLang",
        "xml:lang": "xmlLang",
        xmlns: "xmlns",
        "xml:space": "xmlSpace",
        xmlnsxlink: "xmlnsXlink",
        "xmlns:xlink": "xmlnsXlink",
        xmlspace: "xmlSpace",
        y1: "y1",
        y2: "y2",
        y: "y",
        ychannelselector: "yChannelSelector",
        z: "z",
        zoomandpan: "zoomAndPan"
      }, validateProperty$1 = function() {
      };
      {
        var warnedProperties$1 = {}, _hasOwnProperty = Object.prototype.hasOwnProperty, EVENT_NAME_REGEX = /^on./, INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/, rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$"), rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
        validateProperty$1 = function(tagName, name, value, eventRegistry) {
          if (_hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name])
            return !0;
          var lowerCasedName = name.toLowerCase();
          if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout")
            return error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), warnedProperties$1[name] = !0, !0;
          if (eventRegistry != null) {
            var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
            if (registrationNameDependencies.hasOwnProperty(name))
              return !0;
            var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
            if (registrationName != null)
              return error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName), warnedProperties$1[name] = !0, !0;
            if (EVENT_NAME_REGEX.test(name))
              return error("Unknown event handler property `%s`. It will be ignored.", name), warnedProperties$1[name] = !0, !0;
          } else if (EVENT_NAME_REGEX.test(name))
            return INVALID_EVENT_NAME_REGEX.test(name) && error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name), warnedProperties$1[name] = !0, !0;
          if (rARIA$1.test(name) || rARIACamel$1.test(name))
            return !0;
          if (lowerCasedName === "innerhtml")
            return error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), warnedProperties$1[name] = !0, !0;
          if (lowerCasedName === "aria")
            return error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), warnedProperties$1[name] = !0, !0;
          if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value != "string")
            return error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value), warnedProperties$1[name] = !0, !0;
          if (typeof value == "number" && isNaN(value))
            return error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name), warnedProperties$1[name] = !0, !0;
          var propertyInfo = getPropertyInfo(name), isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
          if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
            var standardName = possibleStandardNames[lowerCasedName];
            if (standardName !== name)
              return error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName), warnedProperties$1[name] = !0, !0;
          } else if (!isReserved && name !== lowerCasedName)
            return error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName), warnedProperties$1[name] = !0, !0;
          return typeof value == "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo, !1) ? (value ? error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name) : error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name), warnedProperties$1[name] = !0, !0) : isReserved ? !0 : shouldRemoveAttributeWithWarning(name, value, propertyInfo, !1) ? (warnedProperties$1[name] = !0, !1) : ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN && (error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value), warnedProperties$1[name] = !0), !0);
        };
      }
      var warnUnknownProperties = function(type, props, eventRegistry) {
        {
          var unknownProps = [];
          for (var key in props) {
            var isValid = validateProperty$1(type, key, props[key], eventRegistry);
            isValid || unknownProps.push(key);
          }
          var unknownPropString = unknownProps.map(function(prop) {
            return "`" + prop + "`";
          }).join(", ");
          unknownProps.length === 1 ? error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type) : unknownProps.length > 1 && error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
        }
      };
      function validateProperties$2(type, props, eventRegistry) {
        isCustomComponent(type, props) || warnUnknownProperties(type, props, eventRegistry);
      }
      var toArray = React5.Children.toArray, currentDebugStacks = [], ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher, ReactDebugCurrentFrame$1, prevGetCurrentStackImpl = null, getCurrentServerStackImpl = function() {
        return "";
      }, describeStackFrame = function(element) {
        return "";
      }, validatePropertiesInDevelopment = function(type, props) {
      }, pushCurrentDebugStack = function(stack) {
      }, pushElementToDebugStack = function(element) {
      }, popCurrentDebugStack = function() {
      }, hasWarnedAboutUsingContextAsConsumer = !1;
      ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame, validatePropertiesInDevelopment = function(type, props) {
        validateProperties(type, props), validateProperties$1(type, props), validateProperties$2(type, props, null);
      }, describeStackFrame = function(element) {
        return describeUnknownElementTypeFrameInDEV(element.type, element._source, null);
      }, pushCurrentDebugStack = function(stack) {
        currentDebugStacks.push(stack), currentDebugStacks.length === 1 && (prevGetCurrentStackImpl = ReactDebugCurrentFrame$1.getCurrentStack, ReactDebugCurrentFrame$1.getCurrentStack = getCurrentServerStackImpl);
      }, pushElementToDebugStack = function(element) {
        var stack = currentDebugStacks[currentDebugStacks.length - 1], frame = stack[stack.length - 1];
        frame.debugElementStack.push(element);
      }, popCurrentDebugStack = function() {
        currentDebugStacks.pop(), currentDebugStacks.length === 0 && (ReactDebugCurrentFrame$1.getCurrentStack = prevGetCurrentStackImpl, prevGetCurrentStackImpl = null);
      }, getCurrentServerStackImpl = function() {
        if (currentDebugStacks.length === 0)
          return "";
        for (var frames = currentDebugStacks[currentDebugStacks.length - 1], stack = "", i6 = frames.length - 1; i6 >= 0; i6--)
          for (var frame = frames[i6], debugElementStack = frame.debugElementStack, ii = debugElementStack.length - 1; ii >= 0; ii--)
            stack += describeStackFrame(debugElementStack[ii]);
        return stack;
      };
      var didWarnDefaultInputValue = !1, didWarnDefaultChecked = !1, didWarnDefaultSelectValue = !1, didWarnDefaultTextareaValue = !1, didWarnInvalidOptionChildren = !1, didWarnAboutNoopUpdateForComponent = {}, didWarnAboutBadClass = {}, didWarnAboutModulePatternComponent = {}, didWarnAboutDeprecatedWillMount = {}, didWarnAboutUndefinedDerivedState = {}, didWarnAboutUninitializedState = {}, valuePropNames = ["value", "defaultValue"], newlineEatingTags = {
        listing: !0,
        pre: !0,
        textarea: !0
      }, VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/, validatedTagCache = {};
      function validateDangerousTag(tag) {
        if (!validatedTagCache.hasOwnProperty(tag)) {
          if (!VALID_TAG_REGEX.test(tag))
            throw Error("Invalid tag: " + tag);
          validatedTagCache[tag] = !0;
        }
      }
      var styleNameCache = {}, processStyleName = function(styleName) {
        if (styleNameCache.hasOwnProperty(styleName))
          return styleNameCache[styleName];
        var result = hyphenateStyleName(styleName);
        return styleNameCache[styleName] = result, result;
      };
      function createMarkupForStyles(styles) {
        var serialized = "", delimiter = "";
        for (var styleName in styles)
          if (!!styles.hasOwnProperty(styleName)) {
            var isCustomProperty = styleName.indexOf("--") === 0, styleValue = styles[styleName];
            isCustomProperty || warnValidStyle$1(styleName, styleValue), styleValue != null && (serialized += delimiter + (isCustomProperty ? styleName : processStyleName(styleName)) + ":", serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty), delimiter = ";");
          }
        return serialized || null;
      }
      function warnNoop(publicInstance, callerName) {
        {
          var _constructor = publicInstance.constructor, componentName = _constructor && getComponentName(_constructor) || "ReactClass", warningKey = componentName + "." + callerName;
          if (didWarnAboutNoopUpdateForComponent[warningKey])
            return;
          error(`%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.

Please check the code for the %s component.`, callerName, callerName, componentName), didWarnAboutNoopUpdateForComponent[warningKey] = !0;
        }
      }
      function shouldConstruct$1(Component) {
        return Component.prototype && Component.prototype.isReactComponent;
      }
      function getNonChildrenInnerMarkup(props) {
        var innerHTML = props.dangerouslySetInnerHTML;
        if (innerHTML != null) {
          if (innerHTML.__html != null)
            return innerHTML.__html;
        } else {
          var content = props.children;
          if (typeof content == "string" || typeof content == "number")
            return escapeTextForBrowser(content);
        }
        return null;
      }
      function flattenTopLevelChildren(children) {
        if (!React5.isValidElement(children))
          return toArray(children);
        var element = children;
        if (element.type !== REACT_FRAGMENT_TYPE)
          return [element];
        var fragmentChildren = element.props.children;
        if (!React5.isValidElement(fragmentChildren))
          return toArray(fragmentChildren);
        var fragmentChildElement = fragmentChildren;
        return [fragmentChildElement];
      }
      function flattenOptionChildren(children) {
        if (children == null)
          return children;
        var content = "";
        return React5.Children.forEach(children, function(child) {
          child != null && (content += child, !didWarnInvalidOptionChildren && typeof child != "string" && typeof child != "number" && (didWarnInvalidOptionChildren = !0, error("Only strings and numbers are supported as <option> children.")));
        }), content;
      }
      var hasOwnProperty$2 = Object.prototype.hasOwnProperty, STYLE = "style", RESERVED_PROPS = {
        children: null,
        dangerouslySetInnerHTML: null,
        suppressContentEditableWarning: null,
        suppressHydrationWarning: null
      };
      function createOpenTagMarkup(tagVerbatim, tagLowercase, props, namespace, makeStaticMarkup, isRootElement) {
        var ret = "<" + tagVerbatim, isCustomComponent$1 = isCustomComponent(tagLowercase, props);
        for (var propKey in props)
          if (!!hasOwnProperty$2.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue != null) {
              propKey === STYLE && (propValue = createMarkupForStyles(propValue));
              var markup = null;
              isCustomComponent$1 ? RESERVED_PROPS.hasOwnProperty(propKey) || (markup = createMarkupForCustomAttribute(propKey, propValue)) : markup = createMarkupForProperty(propKey, propValue), markup && (ret += " " + markup);
            }
          }
        return makeStaticMarkup || isRootElement && (ret += " " + createMarkupForRoot()), ret;
      }
      function validateRenderResult(child, type) {
        if (child === void 0)
          throw Error((getComponentName(type) || "Component") + "(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.");
      }
      function resolve(child, context, threadID) {
        for (; React5.isValidElement(child); ) {
          var element = child, Component = element.type;
          if (pushElementToDebugStack(element), typeof Component != "function")
            break;
          processChild(element, Component);
        }
        function processChild(element2, Component2) {
          var isClass = shouldConstruct$1(Component2), publicContext = processContext(Component2, context, threadID, isClass), queue2 = [], replace = !1, updater = {
            isMounted: function(publicInstance) {
              return !1;
            },
            enqueueForceUpdate: function(publicInstance) {
              if (queue2 === null)
                return warnNoop(publicInstance, "forceUpdate"), null;
            },
            enqueueReplaceState: function(publicInstance, completeState) {
              replace = !0, queue2 = [completeState];
            },
            enqueueSetState: function(publicInstance, currentPartialState) {
              if (queue2 === null)
                return warnNoop(publicInstance, "setState"), null;
              queue2.push(currentPartialState);
            }
          }, inst;
          if (isClass) {
            if (inst = new Component2(element2.props, publicContext, updater), typeof Component2.getDerivedStateFromProps == "function") {
              if (inst.state === null || inst.state === void 0) {
                var componentName = getComponentName(Component2) || "Unknown";
                didWarnAboutUninitializedState[componentName] || (error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, inst.state === null ? "null" : "undefined", componentName), didWarnAboutUninitializedState[componentName] = !0);
              }
              var partialState = Component2.getDerivedStateFromProps.call(null, element2.props, inst.state);
              if (partialState === void 0) {
                var _componentName = getComponentName(Component2) || "Unknown";
                didWarnAboutUndefinedDerivedState[_componentName] || (error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", _componentName), didWarnAboutUndefinedDerivedState[_componentName] = !0);
              }
              partialState != null && (inst.state = _assign({}, inst.state, partialState));
            }
          } else {
            if (Component2.prototype && typeof Component2.prototype.render == "function") {
              var _componentName2 = getComponentName(Component2) || "Unknown";
              didWarnAboutBadClass[_componentName2] || (error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", _componentName2, _componentName2), didWarnAboutBadClass[_componentName2] = !0);
            }
            var componentIdentity = {};
            if (prepareToUseHooks(componentIdentity), inst = Component2(element2.props, publicContext, updater), inst = finishHooks(Component2, element2.props, inst, publicContext), inst != null && inst.render != null) {
              var _componentName3 = getComponentName(Component2) || "Unknown";
              didWarnAboutModulePatternComponent[_componentName3] || (error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName3, _componentName3, _componentName3), didWarnAboutModulePatternComponent[_componentName3] = !0);
            }
            if (inst == null || inst.render == null) {
              child = inst, validateRenderResult(child, Component2);
              return;
            }
          }
          inst.props = element2.props, inst.context = publicContext, inst.updater = updater;
          var initialState = inst.state;
          if (initialState === void 0 && (inst.state = initialState = null), typeof inst.UNSAFE_componentWillMount == "function" || typeof inst.componentWillMount == "function") {
            if (typeof inst.componentWillMount == "function") {
              if (inst.componentWillMount.__suppressDeprecationWarning !== !0) {
                var _componentName4 = getComponentName(Component2) || "Unknown";
                didWarnAboutDeprecatedWillMount[_componentName4] || (warn(
                  `componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.

Please update the following components: %s`,
                  _componentName4
                ), didWarnAboutDeprecatedWillMount[_componentName4] = !0);
              }
              typeof Component2.getDerivedStateFromProps != "function" && inst.componentWillMount();
            }
            if (typeof inst.UNSAFE_componentWillMount == "function" && typeof Component2.getDerivedStateFromProps != "function" && inst.UNSAFE_componentWillMount(), queue2.length) {
              var oldQueue = queue2, oldReplace = replace;
              if (queue2 = null, replace = !1, oldReplace && oldQueue.length === 1)
                inst.state = oldQueue[0];
              else {
                for (var nextState = oldReplace ? oldQueue[0] : inst.state, dontMutate = !0, i6 = oldReplace ? 1 : 0; i6 < oldQueue.length; i6++) {
                  var partial = oldQueue[i6], _partialState = typeof partial == "function" ? partial.call(inst, nextState, element2.props, publicContext) : partial;
                  _partialState != null && (dontMutate ? (dontMutate = !1, nextState = _assign({}, nextState, _partialState)) : _assign(nextState, _partialState));
                }
                inst.state = nextState;
              }
            } else
              queue2 = null;
          }
          child = inst.render(), child === void 0 && inst.render._isMockFunction && (child = null), validateRenderResult(child, Component2);
          var childContext;
          {
            if (typeof inst.getChildContext == "function") {
              var _childContextTypes = Component2.childContextTypes;
              if (typeof _childContextTypes == "object") {
                childContext = inst.getChildContext();
                for (var contextKey in childContext)
                  if (!(contextKey in _childContextTypes))
                    throw Error((getComponentName(Component2) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
              } else
                error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", getComponentName(Component2) || "Unknown");
            }
            childContext && (context = _assign({}, context, childContext));
          }
        }
        return {
          child,
          context
        };
      }
      var ReactDOMServerRenderer = /* @__PURE__ */ function() {
        function ReactDOMServerRenderer2(children, makeStaticMarkup, options) {
          var flatChildren = flattenTopLevelChildren(children), topFrame = {
            type: null,
            domNamespace: Namespaces.html,
            children: flatChildren,
            childIndex: 0,
            context: emptyObject,
            footer: ""
          };
          topFrame.debugElementStack = [], this.threadID = allocThreadID(), this.stack = [topFrame], this.exhausted = !1, this.currentSelectValue = null, this.previousWasTextNode = !1, this.makeStaticMarkup = makeStaticMarkup, this.suspenseDepth = 0, this.contextIndex = -1, this.contextStack = [], this.contextValueStack = [], this.uniqueID = 0, this.identifierPrefix = options && options.identifierPrefix || "", this.contextProviderStack = [];
        }
        var _proto = ReactDOMServerRenderer2.prototype;
        return _proto.destroy = function() {
          this.exhausted || (this.exhausted = !0, this.clearProviders(), freeThreadID(this.threadID));
        }, _proto.pushProvider = function(provider) {
          var index = ++this.contextIndex, context = provider.type._context, threadID = this.threadID;
          validateContextBounds(context, threadID);
          var previousValue = context[threadID];
          this.contextStack[index] = context, this.contextValueStack[index] = previousValue, this.contextProviderStack[index] = provider, context[threadID] = provider.props.value;
        }, _proto.popProvider = function(provider) {
          var index = this.contextIndex;
          (index < 0 || provider !== this.contextProviderStack[index]) && error("Unexpected pop.");
          var context = this.contextStack[index], previousValue = this.contextValueStack[index];
          this.contextStack[index] = null, this.contextValueStack[index] = null, this.contextProviderStack[index] = null, this.contextIndex--, context[this.threadID] = previousValue;
        }, _proto.clearProviders = function() {
          for (var index = this.contextIndex; index >= 0; index--) {
            var context = this.contextStack[index], previousValue = this.contextValueStack[index];
            context[this.threadID] = previousValue;
          }
        }, _proto.read = function(bytes) {
          if (this.exhausted)
            return null;
          var prevPartialRenderer = currentPartialRenderer;
          setCurrentPartialRenderer(this);
          var prevDispatcher = ReactCurrentDispatcher$1.current;
          ReactCurrentDispatcher$1.current = Dispatcher;
          try {
            for (var out = [""], suspended = !1; out[0].length < bytes; ) {
              if (this.stack.length === 0) {
                this.exhausted = !0, freeThreadID(this.threadID);
                break;
              }
              var frame = this.stack[this.stack.length - 1];
              if (suspended || frame.childIndex >= frame.children.length) {
                var footer = frame.footer;
                if (footer !== "" && (this.previousWasTextNode = !1), this.stack.pop(), frame.type === "select")
                  this.currentSelectValue = null;
                else if (frame.type != null && frame.type.type != null && frame.type.type.$$typeof === REACT_PROVIDER_TYPE) {
                  var provider = frame.type;
                  this.popProvider(provider);
                } else if (frame.type === REACT_SUSPENSE_TYPE) {
                  this.suspenseDepth--;
                  var buffered = out.pop();
                  if (suspended) {
                    suspended = !1;
                    var fallbackFrame = frame.fallbackFrame;
                    if (!fallbackFrame)
                      throw Error("ReactDOMServer did not find an internal fallback frame for Suspense. This is a bug in React. Please file an issue.");
                    this.stack.push(fallbackFrame), out[this.suspenseDepth] += "<!--$!-->";
                    continue;
                  } else
                    out[this.suspenseDepth] += buffered;
                }
                out[this.suspenseDepth] += footer;
                continue;
              }
              var child = frame.children[frame.childIndex++], outBuffer = "";
              pushCurrentDebugStack(this.stack), frame.debugElementStack.length = 0;
              try {
                outBuffer += this.render(child, frame.context, frame.domNamespace);
              } catch (err) {
                if (err != null && typeof err.then == "function")
                  if (enableSuspenseServerRenderer) {
                    if (!(this.suspenseDepth > 0))
                      throw Error(`A React component suspended while rendering, but no fallback UI was specified.

Add a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.`);
                    suspended = !0;
                  } else
                    throw Error("ReactDOMServer does not yet support Suspense.");
                else
                  throw err;
              } finally {
                popCurrentDebugStack();
              }
              out.length <= this.suspenseDepth && out.push(""), out[this.suspenseDepth] += outBuffer;
            }
            return out[0];
          } finally {
            ReactCurrentDispatcher$1.current = prevDispatcher, setCurrentPartialRenderer(prevPartialRenderer), resetHooksState();
          }
        }, _proto.render = function(child, context, parentNamespace) {
          if (typeof child == "string" || typeof child == "number") {
            var text = "" + child;
            return text === "" ? "" : this.makeStaticMarkup ? escapeTextForBrowser(text) : this.previousWasTextNode ? "<!-- -->" + escapeTextForBrowser(text) : (this.previousWasTextNode = !0, escapeTextForBrowser(text));
          } else {
            var nextChild, _resolve = resolve(child, context, this.threadID);
            if (nextChild = _resolve.child, context = _resolve.context, nextChild === null || nextChild === !1)
              return "";
            if (!React5.isValidElement(nextChild)) {
              if (nextChild != null && nextChild.$$typeof != null) {
                var $$typeof = nextChild.$$typeof;
                throw Error($$typeof === REACT_PORTAL_TYPE ? "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render." : "Unknown element-like object type: " + $$typeof.toString() + ". This is likely a bug in React. Please file an issue.");
              }
              var nextChildren = toArray(nextChild), frame = {
                type: null,
                domNamespace: parentNamespace,
                children: nextChildren,
                childIndex: 0,
                context,
                footer: ""
              };
              return frame.debugElementStack = [], this.stack.push(frame), "";
            }
            var nextElement = nextChild, elementType = nextElement.type;
            if (typeof elementType == "string")
              return this.renderDOM(nextElement, context, parentNamespace);
            switch (elementType) {
              case REACT_LEGACY_HIDDEN_TYPE:
              case REACT_DEBUG_TRACING_MODE_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_SUSPENSE_LIST_TYPE:
              case REACT_FRAGMENT_TYPE: {
                var _nextChildren = toArray(nextChild.props.children), _frame = {
                  type: null,
                  domNamespace: parentNamespace,
                  children: _nextChildren,
                  childIndex: 0,
                  context,
                  footer: ""
                };
                return _frame.debugElementStack = [], this.stack.push(_frame), "";
              }
              case REACT_SUSPENSE_TYPE:
                throw Error("ReactDOMServer does not yet support Suspense.");
              case REACT_SCOPE_TYPE:
                throw Error("ReactDOMServer does not yet support scope components.");
            }
            if (typeof elementType == "object" && elementType !== null)
              switch (elementType.$$typeof) {
                case REACT_FORWARD_REF_TYPE: {
                  var element = nextChild, _nextChildren5, componentIdentity = {};
                  prepareToUseHooks(componentIdentity), _nextChildren5 = elementType.render(element.props, element.ref), _nextChildren5 = finishHooks(elementType.render, element.props, _nextChildren5, element.ref), _nextChildren5 = toArray(_nextChildren5);
                  var _frame5 = {
                    type: null,
                    domNamespace: parentNamespace,
                    children: _nextChildren5,
                    childIndex: 0,
                    context,
                    footer: ""
                  };
                  return _frame5.debugElementStack = [], this.stack.push(_frame5), "";
                }
                case REACT_MEMO_TYPE: {
                  var _element = nextChild, _nextChildren6 = [React5.createElement(elementType.type, _assign({
                    ref: _element.ref
                  }, _element.props))], _frame6 = {
                    type: null,
                    domNamespace: parentNamespace,
                    children: _nextChildren6,
                    childIndex: 0,
                    context,
                    footer: ""
                  };
                  return _frame6.debugElementStack = [], this.stack.push(_frame6), "";
                }
                case REACT_PROVIDER_TYPE: {
                  var provider = nextChild, nextProps = provider.props, _nextChildren7 = toArray(nextProps.children), _frame7 = {
                    type: provider,
                    domNamespace: parentNamespace,
                    children: _nextChildren7,
                    childIndex: 0,
                    context,
                    footer: ""
                  };
                  return _frame7.debugElementStack = [], this.pushProvider(provider), this.stack.push(_frame7), "";
                }
                case REACT_CONTEXT_TYPE: {
                  var reactContext = nextChild.type;
                  reactContext._context === void 0 ? reactContext !== reactContext.Consumer && (hasWarnedAboutUsingContextAsConsumer || (hasWarnedAboutUsingContextAsConsumer = !0, error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : reactContext = reactContext._context;
                  var _nextProps = nextChild.props, threadID = this.threadID;
                  validateContextBounds(reactContext, threadID);
                  var nextValue = reactContext[threadID], _nextChildren8 = toArray(_nextProps.children(nextValue)), _frame8 = {
                    type: nextChild,
                    domNamespace: parentNamespace,
                    children: _nextChildren8,
                    childIndex: 0,
                    context,
                    footer: ""
                  };
                  return _frame8.debugElementStack = [], this.stack.push(_frame8), "";
                }
                case REACT_FUNDAMENTAL_TYPE:
                  throw Error("ReactDOMServer does not yet support the fundamental API.");
                case REACT_LAZY_TYPE: {
                  var _element2 = nextChild, lazyComponent = nextChild.type, payload = lazyComponent._payload, init2 = lazyComponent._init, result = init2(payload), _nextChildren10 = [React5.createElement(result, _assign({
                    ref: _element2.ref
                  }, _element2.props))], _frame10 = {
                    type: null,
                    domNamespace: parentNamespace,
                    children: _nextChildren10,
                    childIndex: 0,
                    context,
                    footer: ""
                  };
                  return _frame10.debugElementStack = [], this.stack.push(_frame10), "";
                }
              }
            var info = "";
            {
              var owner = nextElement._owner;
              (elementType === void 0 || typeof elementType == "object" && elementType !== null && Object.keys(elementType).length === 0) && (info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var ownerName = owner ? getComponentName(owner) : null;
              ownerName && (info += `

Check the render method of \`` + ownerName + "`.");
            }
            throw Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (elementType == null ? elementType : typeof elementType) + "." + info);
          }
        }, _proto.renderDOM = function(element, context, parentNamespace) {
          var tag = element.type.toLowerCase(), namespace = parentNamespace;
          parentNamespace === Namespaces.html && (namespace = getIntrinsicNamespace(tag)), namespace === Namespaces.html && tag !== element.type && error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", element.type), validateDangerousTag(tag);
          var props = element.props;
          if (tag === "input")
            checkControlledValueProps("input", props), props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnDefaultChecked && (error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type), didWarnDefaultChecked = !0), props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultInputValue && (error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type), didWarnDefaultInputValue = !0), props = _assign({
              type: void 0
            }, props, {
              defaultChecked: void 0,
              defaultValue: void 0,
              value: props.value != null ? props.value : props.defaultValue,
              checked: props.checked != null ? props.checked : props.defaultChecked
            });
          else if (tag === "textarea") {
            checkControlledValueProps("textarea", props), props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultTextareaValue && (error("Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components"), didWarnDefaultTextareaValue = !0);
            var initialValue = props.value;
            if (initialValue == null) {
              var defaultValue = props.defaultValue, textareaChildren = props.children;
              if (textareaChildren != null) {
                if (error("Use the `defaultValue` or `value` props instead of setting children on <textarea>."), defaultValue != null)
                  throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
                if (Array.isArray(textareaChildren)) {
                  if (!(textareaChildren.length <= 1))
                    throw Error("<textarea> can only have at most one child.");
                  textareaChildren = textareaChildren[0];
                }
                defaultValue = "" + textareaChildren;
              }
              defaultValue == null && (defaultValue = ""), initialValue = defaultValue;
            }
            props = _assign({}, props, {
              value: void 0,
              children: "" + initialValue
            });
          } else if (tag === "select") {
            {
              checkControlledValueProps("select", props);
              for (var i6 = 0; i6 < valuePropNames.length; i6++) {
                var propName = valuePropNames[i6];
                if (props[propName] != null) {
                  var isArray3 = Array.isArray(props[propName]);
                  props.multiple && !isArray3 ? error("The `%s` prop supplied to <select> must be an array if `multiple` is true.", propName) : !props.multiple && isArray3 && error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.", propName);
                }
              }
              props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultSelectValue && (error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), didWarnDefaultSelectValue = !0);
            }
            this.currentSelectValue = props.value != null ? props.value : props.defaultValue, props = _assign({}, props, {
              value: void 0
            });
          } else if (tag === "option") {
            var selected = null, selectValue = this.currentSelectValue, optionChildren = flattenOptionChildren(props.children);
            if (selectValue != null) {
              var value;
              if (props.value != null ? value = props.value + "" : value = optionChildren, selected = !1, Array.isArray(selectValue)) {
                for (var j2 = 0; j2 < selectValue.length; j2++)
                  if ("" + selectValue[j2] === value) {
                    selected = !0;
                    break;
                  }
              } else
                selected = "" + selectValue === value;
              props = _assign({
                selected: void 0,
                children: void 0
              }, props, {
                selected,
                children: optionChildren
              });
            }
          }
          validatePropertiesInDevelopment(tag, props), assertValidProps(tag, props);
          var out = createOpenTagMarkup(element.type, tag, props, namespace, this.makeStaticMarkup, this.stack.length === 1), footer = "";
          omittedCloseTags.hasOwnProperty(tag) ? out += "/>" : (out += ">", footer = "</" + element.type + ">");
          var children, innerMarkup = getNonChildrenInnerMarkup(props);
          innerMarkup != null ? (children = [], newlineEatingTags.hasOwnProperty(tag) && innerMarkup.charAt(0) === `
` && (out += `
`), out += innerMarkup) : children = toArray(props.children);
          var frame = {
            domNamespace: getChildNamespace(parentNamespace, element.type),
            type: tag,
            children,
            childIndex: 0,
            context,
            footer
          };
          return frame.debugElementStack = [], this.stack.push(frame), this.previousWasTextNode = !1, out;
        }, ReactDOMServerRenderer2;
      }();
      function renderToString2(element, options) {
        var renderer = new ReactDOMServerRenderer(element, !1, options);
        try {
          var markup = renderer.read(1 / 0);
          return markup;
        } finally {
          renderer.destroy();
        }
      }
      function renderToStaticMarkup(element, options) {
        var renderer = new ReactDOMServerRenderer(element, !0, options);
        try {
          var markup = renderer.read(1 / 0);
          return markup;
        } finally {
          renderer.destroy();
        }
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype), subClass.prototype.constructor = subClass, subClass.__proto__ = superClass;
      }
      var ReactMarkupReadableStream = /* @__PURE__ */ function(_Readable) {
        _inheritsLoose(ReactMarkupReadableStream2, _Readable);
        function ReactMarkupReadableStream2(element, makeStaticMarkup, options) {
          var _this;
          return _this = _Readable.call(this, {}) || this, _this.partialRenderer = new ReactDOMServerRenderer(element, makeStaticMarkup, options), _this;
        }
        var _proto = ReactMarkupReadableStream2.prototype;
        return _proto._destroy = function(err, callback) {
          this.partialRenderer.destroy(), callback(err);
        }, _proto._read = function(size) {
          try {
            this.push(this.partialRenderer.read(size));
          } catch (err) {
            this.destroy(err);
          }
        }, ReactMarkupReadableStream2;
      }(stream.Readable);
      function renderToNodeStream(element, options) {
        return new ReactMarkupReadableStream(element, !1, options);
      }
      function renderToStaticNodeStream(element, options) {
        return new ReactMarkupReadableStream(element, !0, options);
      }
      exports.renderToNodeStream = renderToNodeStream, exports.renderToStaticMarkup = renderToStaticMarkup, exports.renderToStaticNodeStream = renderToStaticNodeStream, exports.renderToString = renderToString2, exports.version = ReactVersion;
    })();
  }
});

// node_modules/react-dom/server.node.js
var require_server_node = __commonJS({
  "node_modules/react-dom/server.node.js"(exports, module) {
    "use strict";
    module.exports = require_react_dom_server_node_development();
  }
});

// node_modules/react-dom/server.js
var require_server = __commonJS({
  "node_modules/react-dom/server.js"(exports, module) {
    "use strict";
    module.exports = require_server_node();
  }
});

// node_modules/@remix-run/cloudflare/crypto.js
var require_crypto = __commonJS({
  "node_modules/@remix-run/cloudflare/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var encoder = new TextEncoder(), sign = async (value, secret) => {
      let key = await createKey(secret, ["sign"]), data = encoder.encode(value), signature = await crypto.subtle.sign("HMAC", key, data), hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=+$/, "");
      return value + "." + hash;
    }, unsign = async (signed, secret) => {
      let index = signed.lastIndexOf("."), value = signed.slice(0, index), hash = signed.slice(index + 1), key = await createKey(secret, ["verify"]), data = encoder.encode(value), signature = byteStringToUint8Array(atob(hash));
      return await crypto.subtle.verify("HMAC", key, signature, data) ? value : !1;
    };
    async function createKey(secret, usages) {
      return await crypto.subtle.importKey("raw", encoder.encode(secret), {
        name: "HMAC",
        hash: "SHA-256"
      }, !1, usages);
    }
    function byteStringToUint8Array(byteString) {
      let array = new Uint8Array(byteString.length);
      for (let i5 = 0; i5 < byteString.length; i5++)
        array[i5] = byteString.charCodeAt(i5);
      return array;
    }
    exports.sign = sign;
    exports.unsign = unsign;
  }
});

// node_modules/@remix-run/cloudflare/implementations.js
var require_implementations = __commonJS({
  "node_modules/@remix-run/cloudflare/implementations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var serverRuntime = (init_esm(), __toCommonJS(esm_exports)), crypto2 = require_crypto(), createCookie2 = serverRuntime.createCookieFactory({
      sign: crypto2.sign,
      unsign: crypto2.unsign
    }), createCookieSessionStorage2 = serverRuntime.createCookieSessionStorageFactory(createCookie2), createSessionStorage2 = serverRuntime.createSessionStorageFactory(createCookie2), createMemorySessionStorage2 = serverRuntime.createMemorySessionStorageFactory(createSessionStorage2);
    exports.createCookie = createCookie2;
    exports.createCookieSessionStorage = createCookieSessionStorage2;
    exports.createMemorySessionStorage = createMemorySessionStorage2;
    exports.createSessionStorage = createSessionStorage2;
  }
});

// node_modules/@remix-run/cloudflare/sessions/cloudflareKVSessionStorage.js
var require_cloudflareKVSessionStorage = __commonJS({
  "node_modules/@remix-run/cloudflare/sessions/cloudflareKVSessionStorage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var implementations = require_implementations();
    function createCloudflareKVSessionStorage2({
      cookie,
      kv
    }) {
      return implementations.createSessionStorage({
        cookie,
        async createData(data, expires) {
          for (; ; ) {
            let randomBytes = new Uint8Array(8);
            crypto.getRandomValues(randomBytes);
            let id = [...randomBytes].map((x3) => x3.toString(16).padStart(2, "0")).join("");
            if (!await kv.get(id, "json"))
              return await kv.put(id, JSON.stringify(data), {
                expiration: expires ? Math.round(expires.getTime() / 1e3) : void 0
              }), id;
          }
        },
        async readData(id) {
          let session = await kv.get(id);
          return session ? JSON.parse(session) : null;
        },
        async updateData(id, data, expires) {
          await kv.put(id, JSON.stringify(data), {
            expiration: expires ? Math.round(expires.getTime() / 1e3) : void 0
          });
        },
        async deleteData(id) {
          await kv.delete(id);
        }
      });
    }
    exports.createCloudflareKVSessionStorage = createCloudflareKVSessionStorage2;
  }
});

// node_modules/@remix-run/cloudflare/index.js
var require_cloudflare = __commonJS({
  "node_modules/@remix-run/cloudflare/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var cloudflareKVSessionStorage = require_cloudflareKVSessionStorage(), implementations = require_implementations(), serverRuntime = (init_esm(), __toCommonJS(esm_exports));
    exports.createCloudflareKVSessionStorage = cloudflareKVSessionStorage.createCloudflareKVSessionStorage;
    exports.createCookie = implementations.createCookie;
    exports.createCookieSessionStorage = implementations.createCookieSessionStorage;
    exports.createMemorySessionStorage = implementations.createMemorySessionStorage;
    exports.createSessionStorage = implementations.createSessionStorage;
    Object.defineProperty(exports, "createRequestHandler", {
      enumerable: !0,
      get: function() {
        return serverRuntime.createRequestHandler;
      }
    });
    Object.defineProperty(exports, "createSession", {
      enumerable: !0,
      get: function() {
        return serverRuntime.createSession;
      }
    });
    Object.defineProperty(exports, "isCookie", {
      enumerable: !0,
      get: function() {
        return serverRuntime.isCookie;
      }
    });
    Object.defineProperty(exports, "isSession", {
      enumerable: !0,
      get: function() {
        return serverRuntime.isSession;
      }
    });
    Object.defineProperty(exports, "json", {
      enumerable: !0,
      get: function() {
        return serverRuntime.json;
      }
    });
    Object.defineProperty(exports, "redirect", {
      enumerable: !0,
      get: function() {
        return serverRuntime.redirect;
      }
    });
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    (function() {
      "use strict";
      var React5 = require_react(), _assign = require_object_assign(), REACT_ELEMENT_TYPE = 60103, REACT_PORTAL_TYPE = 60106;
      exports.Fragment = 60107;
      var REACT_STRICT_MODE_TYPE = 60108, REACT_PROFILER_TYPE = 60114, REACT_PROVIDER_TYPE = 60109, REACT_CONTEXT_TYPE = 60110, REACT_FORWARD_REF_TYPE = 60112, REACT_SUSPENSE_TYPE = 60113, REACT_SUSPENSE_LIST_TYPE = 60120, REACT_MEMO_TYPE = 60115, REACT_LAZY_TYPE = 60116, REACT_BLOCK_TYPE = 60121, REACT_SERVER_BLOCK_TYPE = 60122, REACT_FUNDAMENTAL_TYPE = 60117, REACT_SCOPE_TYPE = 60119, REACT_OPAQUE_ID_TYPE = 60128, REACT_DEBUG_TRACING_MODE_TYPE = 60129, REACT_OFFSCREEN_TYPE = 60130, REACT_LEGACY_HIDDEN_TYPE = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var symbolFor = Symbol.for;
        REACT_ELEMENT_TYPE = symbolFor("react.element"), REACT_PORTAL_TYPE = symbolFor("react.portal"), exports.Fragment = symbolFor("react.fragment"), REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode"), REACT_PROFILER_TYPE = symbolFor("react.profiler"), REACT_PROVIDER_TYPE = symbolFor("react.provider"), REACT_CONTEXT_TYPE = symbolFor("react.context"), REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref"), REACT_SUSPENSE_TYPE = symbolFor("react.suspense"), REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list"), REACT_MEMO_TYPE = symbolFor("react.memo"), REACT_LAZY_TYPE = symbolFor("react.lazy"), REACT_BLOCK_TYPE = symbolFor("react.block"), REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block"), REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental"), REACT_SCOPE_TYPE = symbolFor("react.scope"), REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id"), REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode"), REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen"), REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
      }
      var MAYBE_ITERATOR_SYMBOL = typeof Symbol == "function" && Symbol.iterator, FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable != "object")
          return null;
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        return typeof maybeIterator == "function" ? maybeIterator : null;
      }
      var ReactSharedInternals = React5.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format2) {
        {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++)
            args[_key2 - 1] = arguments[_key2];
          printWarning("error", format2, args);
        }
      }
      function printWarning(level, format2, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame, stack = ReactDebugCurrentFrame2.getStackAddendum();
          stack !== "" && (format2 += "%s", args = args.concat([stack]));
          var argsWithFormat = args.map(function(item) {
            return "" + item;
          });
          argsWithFormat.unshift("Warning: " + format2), Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var enableScopeAPI = !1;
      function isValidElementType(type) {
        return !!(typeof type == "string" || typeof type == "function" || type === exports.Fragment || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI || typeof type == "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE));
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var functionName = innerType.displayName || innerType.name || "";
        return outerType.displayName || (functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName);
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentName(type) {
        if (type == null)
          return null;
        if (typeof type.tag == "number" && error("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), typeof type == "function")
          return type.displayName || type.name || null;
        if (typeof type == "string")
          return type;
        switch (type) {
          case exports.Fragment:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type == "object")
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              return getComponentName(type.type);
            case REACT_BLOCK_TYPE:
              return getComponentName(type._render);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type, payload = lazyComponent._payload, init2 = lazyComponent._init;
              try {
                return getComponentName(init2(payload));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var disabledDepth = 0, prevLog, prevInfo, prevWarn, prevError, prevGroup, prevGroupCollapsed, prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = !0;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log, prevInfo = console.info, prevWarn = console.warn, prevError = console.error, prevGroup = console.group, prevGroupCollapsed = console.groupCollapsed, prevGroupEnd = console.groupEnd;
            var props = {
              configurable: !0,
              enumerable: !0,
              value: disabledLog,
              writable: !0
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          if (disabledDepth--, disabledDepth === 0) {
            var props = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: _assign({}, props, {
                value: prevLog
              }),
              info: _assign({}, props, {
                value: prevInfo
              }),
              warn: _assign({}, props, {
                value: prevWarn
              }),
              error: _assign({}, props, {
                value: prevError
              }),
              group: _assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: _assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: _assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          disabledDepth < 0 && error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher, prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === void 0)
            try {
              throw Error();
            } catch (x3) {
              var match = x3.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || "";
            }
          return `
` + prefix + name;
        }
      }
      var reentry = !1, componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap == "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry)
          return "";
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== void 0)
            return frame;
        }
        var control;
        reentry = !0;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        previousDispatcher = ReactCurrentDispatcher.current, ReactCurrentDispatcher.current = null, disableLogs();
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            if (Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x3) {
                control = x3;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x3) {
                control = x3;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x3) {
              control = x3;
            }
            fn();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack == "string") {
            for (var sampleLines = sample.stack.split(`
`), controlLines = control.stack.split(`
`), s6 = sampleLines.length - 1, c4 = controlLines.length - 1; s6 >= 1 && c4 >= 0 && sampleLines[s6] !== controlLines[c4]; )
              c4--;
            for (; s6 >= 1 && c4 >= 0; s6--, c4--)
              if (sampleLines[s6] !== controlLines[c4]) {
                if (s6 !== 1 || c4 !== 1)
                  do
                    if (s6--, c4--, c4 < 0 || sampleLines[s6] !== controlLines[c4]) {
                      var _frame = `
` + sampleLines[s6].replace(" at new ", " at ");
                      return typeof fn == "function" && componentFrameCache.set(fn, _frame), _frame;
                    }
                  while (s6 >= 1 && c4 >= 0);
                break;
              }
          }
        } finally {
          reentry = !1, ReactCurrentDispatcher.current = previousDispatcher, reenableLogs(), Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn ? fn.displayName || fn.name : "", syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        return typeof fn == "function" && componentFrameCache.set(fn, syntheticFrame), syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        return describeNativeComponentFrame(fn, !1);
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null)
          return "";
        if (typeof type == "function")
          return describeNativeComponentFrame(type, shouldConstruct(type));
        if (typeof type == "string")
          return describeBuiltInComponentFrame(type);
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type == "object")
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_BLOCK_TYPE:
              return describeFunctionComponentFrame(type._render);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type, payload = lazyComponent._payload, init2 = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init2(payload), source, ownerFn);
              } catch {
              }
            }
          }
        return "";
      }
      var loggedTypeFailures = {}, ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        if (element) {
          var owner = element._owner, stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
          ReactDebugCurrentFrame.setExtraStackFrame(stack);
        } else
          ReactDebugCurrentFrame.setExtraStackFrame(null);
      }
      function checkPropTypes(typeSpecs, values, location2, componentName, element) {
        {
          var has = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var typeSpecName in typeSpecs)
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] != "function") {
                  var err = Error((componentName || "React class") + ": " + location2 + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw err.name = "Invariant Violation", err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location2, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              error$1 && !(error$1 instanceof Error) && (setCurrentlyValidatingElement(element), error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location2, typeSpecName, typeof error$1), setCurrentlyValidatingElement(null)), error$1 instanceof Error && !(error$1.message in loggedTypeFailures) && (loggedTypeFailures[error$1.message] = !0, setCurrentlyValidatingElement(element), error("Failed %s type: %s", location2, error$1.message), setCurrentlyValidatingElement(null));
            }
        }
      }
      var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner, hasOwnProperty2 = Object.prototype.hasOwnProperty, RESERVED_PROPS = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
      didWarnAboutStringRefs = {};
      function hasValidRef(config3) {
        if (hasOwnProperty2.call(config3, "ref")) {
          var getter = Object.getOwnPropertyDescriptor(config3, "ref").get;
          if (getter && getter.isReactWarning)
            return !1;
        }
        return config3.ref !== void 0;
      }
      function hasValidKey(config3) {
        if (hasOwnProperty2.call(config3, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config3, "key").get;
          if (getter && getter.isReactWarning)
            return !1;
        }
        return config3.key !== void 0;
      }
      function warnIfStringRefCannotBeAutoConverted(config3, self) {
        if (typeof config3.ref == "string" && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
          var componentName = getComponentName(ReactCurrentOwner.current.type);
          didWarnAboutStringRefs[componentName] || (error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', getComponentName(ReactCurrentOwner.current.type), config3.ref), didWarnAboutStringRefs[componentName] = !0);
        }
      }
      function defineKeyPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingKey = function() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName));
          };
          warnAboutAccessingKey.isReactWarning = !0, Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
          });
        }
      }
      function defineRefPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingRef = function() {
            specialPropRefWarningShown || (specialPropRefWarningShown = !0, error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName));
          };
          warnAboutAccessingRef.isReactWarning = !0, Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: !0
          });
        }
      }
      var ReactElement = function(type, key, ref, self, source, owner, props) {
        var element = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref,
          props,
          _owner: owner
        };
        return element._store = {}, Object.defineProperty(element._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(element, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: self
        }), Object.defineProperty(element, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: source
        }), Object.freeze && (Object.freeze(element.props), Object.freeze(element)), element;
      };
      function jsxDEV4(type, config3, maybeKey, source, self) {
        {
          var propName, props = {}, key = null, ref = null;
          maybeKey !== void 0 && (key = "" + maybeKey), hasValidKey(config3) && (key = "" + config3.key), hasValidRef(config3) && (ref = config3.ref, warnIfStringRefCannotBeAutoConverted(config3, self));
          for (propName in config3)
            hasOwnProperty2.call(config3, propName) && !RESERVED_PROPS.hasOwnProperty(propName) && (props[propName] = config3[propName]);
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps)
              props[propName] === void 0 && (props[propName] = defaultProps[propName]);
          }
          if (key || ref) {
            var displayName = typeof type == "function" ? type.displayName || type.name || "Unknown" : type;
            key && defineKeyPropWarningGetter(props, displayName), ref && defineRefPropWarningGetter(props, displayName);
          }
          return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
        }
      }
      var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner, ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement$1(element) {
        if (element) {
          var owner = element._owner, stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
          ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
        } else
          ReactDebugCurrentFrame$1.setExtraStackFrame(null);
      }
      var propTypesMisspellWarningShown;
      propTypesMisspellWarningShown = !1;
      function isValidElement2(object) {
        return typeof object == "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function getDeclarationErrorAddendum() {
        {
          if (ReactCurrentOwner$1.current) {
            var name = getComponentName(ReactCurrentOwner$1.current.type);
            if (name)
              return `

Check the render method of \`` + name + "`.";
          }
          return "";
        }
      }
      function getSourceInfoErrorAddendum(source) {
        {
          if (source !== void 0) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, ""), lineNumber = source.lineNumber;
            return `

Check your code at ` + fileName + ":" + lineNumber + ".";
          }
          return "";
        }
      }
      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType == "string" ? parentType : parentType.displayName || parentType.name;
            parentName && (info = `

Check the top-level render call using <` + parentName + ">.");
          }
          return info;
        }
      }
      function validateExplicitKey(element, parentType) {
        {
          if (!element._store || element._store.validated || element.key != null)
            return;
          element._store.validated = !0;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo])
            return;
          ownerHasKeyUseWarning[currentComponentErrorInfo] = !0;
          var childOwner = "";
          element && element._owner && element._owner !== ReactCurrentOwner$1.current && (childOwner = " It was passed a child from " + getComponentName(element._owner.type) + "."), setCurrentlyValidatingElement$1(element), error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner), setCurrentlyValidatingElement$1(null);
        }
      }
      function validateChildKeys(node, parentType) {
        {
          if (typeof node != "object")
            return;
          if (Array.isArray(node))
            for (var i5 = 0; i5 < node.length; i5++) {
              var child = node[i5];
              isValidElement2(child) && validateExplicitKey(child, parentType);
            }
          else if (isValidElement2(node))
            node._store && (node._store.validated = !0);
          else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn == "function" && iteratorFn !== node.entries)
              for (var iterator = iteratorFn.call(node), step; !(step = iterator.next()).done; )
                isValidElement2(step.value) && validateExplicitKey(step.value, parentType);
          }
        }
      }
      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type == null || typeof type == "string")
            return;
          var propTypes;
          if (typeof type == "function")
            propTypes = type.propTypes;
          else if (typeof type == "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MEMO_TYPE))
            propTypes = type.propTypes;
          else
            return;
          if (propTypes) {
            var name = getComponentName(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
          } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = !0;
            var _name = getComponentName(type);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
          }
          typeof type.getDefaultProps == "function" && !type.getDefaultProps.isReactClassApproved && error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function validateFragmentProps(fragment) {
        {
          for (var keys2 = Object.keys(fragment.props), i5 = 0; i5 < keys2.length; i5++) {
            var key = keys2[i5];
            if (key !== "children" && key !== "key") {
              setCurrentlyValidatingElement$1(fragment), error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key), setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          fragment.ref !== null && (setCurrentlyValidatingElement$1(fragment), error("Invalid attribute `ref` supplied to `React.Fragment`."), setCurrentlyValidatingElement$1(null));
        }
      }
      function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
        {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            (type === void 0 || typeof type == "object" && type !== null && Object.keys(type).length === 0) && (info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var sourceInfo = getSourceInfoErrorAddendum(source);
            sourceInfo ? info += sourceInfo : info += getDeclarationErrorAddendum();
            var typeString;
            type === null ? typeString = "null" : Array.isArray(type) ? typeString = "array" : type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE ? (typeString = "<" + (getComponentName(type.type) || "Unknown") + " />", info = " Did you accidentally export a JSX literal instead of a component?") : typeString = typeof type, error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
          }
          var element = jsxDEV4(type, props, key, source, self);
          if (element == null)
            return element;
          if (validType) {
            var children = props.children;
            if (children !== void 0)
              if (isStaticChildren)
                if (Array.isArray(children)) {
                  for (var i5 = 0; i5 < children.length; i5++)
                    validateChildKeys(children[i5], type);
                  Object.freeze && Object.freeze(children);
                } else
                  error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
              else
                validateChildKeys(children, type);
          }
          return type === exports.Fragment ? validateFragmentProps(element) : validatePropTypes(element), element;
        }
      }
      function jsxWithValidationStatic(type, props, key) {
        return jsxWithValidation(type, props, key, !0);
      }
      function jsxWithValidationDynamic(type, props, key) {
        return jsxWithValidation(type, props, key, !1);
      }
      var jsx = jsxWithValidationDynamic, jsxs = jsxWithValidationStatic;
      exports.jsx = jsx, exports.jsxs = jsxs;
    })();
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    module.exports = require_react_jsx_runtime_development();
  }
});

// node_modules/react/cjs/react-jsx-dev-runtime.development.js
var require_react_jsx_dev_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-dev-runtime.development.js"(exports) {
    "use strict";
    (function() {
      "use strict";
      var React5 = require_react(), _assign = require_object_assign(), REACT_ELEMENT_TYPE = 60103, REACT_PORTAL_TYPE = 60106;
      exports.Fragment = 60107;
      var REACT_STRICT_MODE_TYPE = 60108, REACT_PROFILER_TYPE = 60114, REACT_PROVIDER_TYPE = 60109, REACT_CONTEXT_TYPE = 60110, REACT_FORWARD_REF_TYPE = 60112, REACT_SUSPENSE_TYPE = 60113, REACT_SUSPENSE_LIST_TYPE = 60120, REACT_MEMO_TYPE = 60115, REACT_LAZY_TYPE = 60116, REACT_BLOCK_TYPE = 60121, REACT_SERVER_BLOCK_TYPE = 60122, REACT_FUNDAMENTAL_TYPE = 60117, REACT_SCOPE_TYPE = 60119, REACT_OPAQUE_ID_TYPE = 60128, REACT_DEBUG_TRACING_MODE_TYPE = 60129, REACT_OFFSCREEN_TYPE = 60130, REACT_LEGACY_HIDDEN_TYPE = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var symbolFor = Symbol.for;
        REACT_ELEMENT_TYPE = symbolFor("react.element"), REACT_PORTAL_TYPE = symbolFor("react.portal"), exports.Fragment = symbolFor("react.fragment"), REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode"), REACT_PROFILER_TYPE = symbolFor("react.profiler"), REACT_PROVIDER_TYPE = symbolFor("react.provider"), REACT_CONTEXT_TYPE = symbolFor("react.context"), REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref"), REACT_SUSPENSE_TYPE = symbolFor("react.suspense"), REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list"), REACT_MEMO_TYPE = symbolFor("react.memo"), REACT_LAZY_TYPE = symbolFor("react.lazy"), REACT_BLOCK_TYPE = symbolFor("react.block"), REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block"), REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental"), REACT_SCOPE_TYPE = symbolFor("react.scope"), REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id"), REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode"), REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen"), REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
      }
      var MAYBE_ITERATOR_SYMBOL = typeof Symbol == "function" && Symbol.iterator, FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable != "object")
          return null;
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        return typeof maybeIterator == "function" ? maybeIterator : null;
      }
      var ReactSharedInternals = React5.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format2) {
        {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++)
            args[_key2 - 1] = arguments[_key2];
          printWarning("error", format2, args);
        }
      }
      function printWarning(level, format2, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame, stack = ReactDebugCurrentFrame2.getStackAddendum();
          stack !== "" && (format2 += "%s", args = args.concat([stack]));
          var argsWithFormat = args.map(function(item) {
            return "" + item;
          });
          argsWithFormat.unshift("Warning: " + format2), Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var enableScopeAPI = !1;
      function isValidElementType(type) {
        return !!(typeof type == "string" || typeof type == "function" || type === exports.Fragment || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI || typeof type == "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE));
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var functionName = innerType.displayName || innerType.name || "";
        return outerType.displayName || (functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName);
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentName(type) {
        if (type == null)
          return null;
        if (typeof type.tag == "number" && error("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), typeof type == "function")
          return type.displayName || type.name || null;
        if (typeof type == "string")
          return type;
        switch (type) {
          case exports.Fragment:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type == "object")
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              return getComponentName(type.type);
            case REACT_BLOCK_TYPE:
              return getComponentName(type._render);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type, payload = lazyComponent._payload, init2 = lazyComponent._init;
              try {
                return getComponentName(init2(payload));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var disabledDepth = 0, prevLog, prevInfo, prevWarn, prevError, prevGroup, prevGroupCollapsed, prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = !0;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log, prevInfo = console.info, prevWarn = console.warn, prevError = console.error, prevGroup = console.group, prevGroupCollapsed = console.groupCollapsed, prevGroupEnd = console.groupEnd;
            var props = {
              configurable: !0,
              enumerable: !0,
              value: disabledLog,
              writable: !0
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          if (disabledDepth--, disabledDepth === 0) {
            var props = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: _assign({}, props, {
                value: prevLog
              }),
              info: _assign({}, props, {
                value: prevInfo
              }),
              warn: _assign({}, props, {
                value: prevWarn
              }),
              error: _assign({}, props, {
                value: prevError
              }),
              group: _assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: _assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: _assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          disabledDepth < 0 && error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher, prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === void 0)
            try {
              throw Error();
            } catch (x3) {
              var match = x3.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || "";
            }
          return `
` + prefix + name;
        }
      }
      var reentry = !1, componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap == "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry)
          return "";
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== void 0)
            return frame;
        }
        var control;
        reentry = !0;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        previousDispatcher = ReactCurrentDispatcher.current, ReactCurrentDispatcher.current = null, disableLogs();
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            if (Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x3) {
                control = x3;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x3) {
                control = x3;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x3) {
              control = x3;
            }
            fn();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack == "string") {
            for (var sampleLines = sample.stack.split(`
`), controlLines = control.stack.split(`
`), s6 = sampleLines.length - 1, c4 = controlLines.length - 1; s6 >= 1 && c4 >= 0 && sampleLines[s6] !== controlLines[c4]; )
              c4--;
            for (; s6 >= 1 && c4 >= 0; s6--, c4--)
              if (sampleLines[s6] !== controlLines[c4]) {
                if (s6 !== 1 || c4 !== 1)
                  do
                    if (s6--, c4--, c4 < 0 || sampleLines[s6] !== controlLines[c4]) {
                      var _frame = `
` + sampleLines[s6].replace(" at new ", " at ");
                      return typeof fn == "function" && componentFrameCache.set(fn, _frame), _frame;
                    }
                  while (s6 >= 1 && c4 >= 0);
                break;
              }
          }
        } finally {
          reentry = !1, ReactCurrentDispatcher.current = previousDispatcher, reenableLogs(), Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn ? fn.displayName || fn.name : "", syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        return typeof fn == "function" && componentFrameCache.set(fn, syntheticFrame), syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        return describeNativeComponentFrame(fn, !1);
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null)
          return "";
        if (typeof type == "function")
          return describeNativeComponentFrame(type, shouldConstruct(type));
        if (typeof type == "string")
          return describeBuiltInComponentFrame(type);
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type == "object")
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_BLOCK_TYPE:
              return describeFunctionComponentFrame(type._render);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type, payload = lazyComponent._payload, init2 = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init2(payload), source, ownerFn);
              } catch {
              }
            }
          }
        return "";
      }
      var loggedTypeFailures = {}, ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        if (element) {
          var owner = element._owner, stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
          ReactDebugCurrentFrame.setExtraStackFrame(stack);
        } else
          ReactDebugCurrentFrame.setExtraStackFrame(null);
      }
      function checkPropTypes(typeSpecs, values, location2, componentName, element) {
        {
          var has = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var typeSpecName in typeSpecs)
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] != "function") {
                  var err = Error((componentName || "React class") + ": " + location2 + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw err.name = "Invariant Violation", err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location2, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              error$1 && !(error$1 instanceof Error) && (setCurrentlyValidatingElement(element), error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location2, typeSpecName, typeof error$1), setCurrentlyValidatingElement(null)), error$1 instanceof Error && !(error$1.message in loggedTypeFailures) && (loggedTypeFailures[error$1.message] = !0, setCurrentlyValidatingElement(element), error("Failed %s type: %s", location2, error$1.message), setCurrentlyValidatingElement(null));
            }
        }
      }
      var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner, hasOwnProperty2 = Object.prototype.hasOwnProperty, RESERVED_PROPS = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
      didWarnAboutStringRefs = {};
      function hasValidRef(config3) {
        if (hasOwnProperty2.call(config3, "ref")) {
          var getter = Object.getOwnPropertyDescriptor(config3, "ref").get;
          if (getter && getter.isReactWarning)
            return !1;
        }
        return config3.ref !== void 0;
      }
      function hasValidKey(config3) {
        if (hasOwnProperty2.call(config3, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config3, "key").get;
          if (getter && getter.isReactWarning)
            return !1;
        }
        return config3.key !== void 0;
      }
      function warnIfStringRefCannotBeAutoConverted(config3, self) {
        if (typeof config3.ref == "string" && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
          var componentName = getComponentName(ReactCurrentOwner.current.type);
          didWarnAboutStringRefs[componentName] || (error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', getComponentName(ReactCurrentOwner.current.type), config3.ref), didWarnAboutStringRefs[componentName] = !0);
        }
      }
      function defineKeyPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingKey = function() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName));
          };
          warnAboutAccessingKey.isReactWarning = !0, Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
          });
        }
      }
      function defineRefPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingRef = function() {
            specialPropRefWarningShown || (specialPropRefWarningShown = !0, error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName));
          };
          warnAboutAccessingRef.isReactWarning = !0, Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: !0
          });
        }
      }
      var ReactElement = function(type, key, ref, self, source, owner, props) {
        var element = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref,
          props,
          _owner: owner
        };
        return element._store = {}, Object.defineProperty(element._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(element, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: self
        }), Object.defineProperty(element, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: source
        }), Object.freeze && (Object.freeze(element.props), Object.freeze(element)), element;
      };
      function jsxDEV4(type, config3, maybeKey, source, self) {
        {
          var propName, props = {}, key = null, ref = null;
          maybeKey !== void 0 && (key = "" + maybeKey), hasValidKey(config3) && (key = "" + config3.key), hasValidRef(config3) && (ref = config3.ref, warnIfStringRefCannotBeAutoConverted(config3, self));
          for (propName in config3)
            hasOwnProperty2.call(config3, propName) && !RESERVED_PROPS.hasOwnProperty(propName) && (props[propName] = config3[propName]);
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps)
              props[propName] === void 0 && (props[propName] = defaultProps[propName]);
          }
          if (key || ref) {
            var displayName = typeof type == "function" ? type.displayName || type.name || "Unknown" : type;
            key && defineKeyPropWarningGetter(props, displayName), ref && defineRefPropWarningGetter(props, displayName);
          }
          return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
        }
      }
      var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner, ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement$1(element) {
        if (element) {
          var owner = element._owner, stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
          ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
        } else
          ReactDebugCurrentFrame$1.setExtraStackFrame(null);
      }
      var propTypesMisspellWarningShown;
      propTypesMisspellWarningShown = !1;
      function isValidElement2(object) {
        return typeof object == "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function getDeclarationErrorAddendum() {
        {
          if (ReactCurrentOwner$1.current) {
            var name = getComponentName(ReactCurrentOwner$1.current.type);
            if (name)
              return `

Check the render method of \`` + name + "`.";
          }
          return "";
        }
      }
      function getSourceInfoErrorAddendum(source) {
        {
          if (source !== void 0) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, ""), lineNumber = source.lineNumber;
            return `

Check your code at ` + fileName + ":" + lineNumber + ".";
          }
          return "";
        }
      }
      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType == "string" ? parentType : parentType.displayName || parentType.name;
            parentName && (info = `

Check the top-level render call using <` + parentName + ">.");
          }
          return info;
        }
      }
      function validateExplicitKey(element, parentType) {
        {
          if (!element._store || element._store.validated || element.key != null)
            return;
          element._store.validated = !0;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo])
            return;
          ownerHasKeyUseWarning[currentComponentErrorInfo] = !0;
          var childOwner = "";
          element && element._owner && element._owner !== ReactCurrentOwner$1.current && (childOwner = " It was passed a child from " + getComponentName(element._owner.type) + "."), setCurrentlyValidatingElement$1(element), error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner), setCurrentlyValidatingElement$1(null);
        }
      }
      function validateChildKeys(node, parentType) {
        {
          if (typeof node != "object")
            return;
          if (Array.isArray(node))
            for (var i5 = 0; i5 < node.length; i5++) {
              var child = node[i5];
              isValidElement2(child) && validateExplicitKey(child, parentType);
            }
          else if (isValidElement2(node))
            node._store && (node._store.validated = !0);
          else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn == "function" && iteratorFn !== node.entries)
              for (var iterator = iteratorFn.call(node), step; !(step = iterator.next()).done; )
                isValidElement2(step.value) && validateExplicitKey(step.value, parentType);
          }
        }
      }
      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type == null || typeof type == "string")
            return;
          var propTypes;
          if (typeof type == "function")
            propTypes = type.propTypes;
          else if (typeof type == "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MEMO_TYPE))
            propTypes = type.propTypes;
          else
            return;
          if (propTypes) {
            var name = getComponentName(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
          } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = !0;
            var _name = getComponentName(type);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
          }
          typeof type.getDefaultProps == "function" && !type.getDefaultProps.isReactClassApproved && error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function validateFragmentProps(fragment) {
        {
          for (var keys2 = Object.keys(fragment.props), i5 = 0; i5 < keys2.length; i5++) {
            var key = keys2[i5];
            if (key !== "children" && key !== "key") {
              setCurrentlyValidatingElement$1(fragment), error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key), setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          fragment.ref !== null && (setCurrentlyValidatingElement$1(fragment), error("Invalid attribute `ref` supplied to `React.Fragment`."), setCurrentlyValidatingElement$1(null));
        }
      }
      function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
        {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            (type === void 0 || typeof type == "object" && type !== null && Object.keys(type).length === 0) && (info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var sourceInfo = getSourceInfoErrorAddendum(source);
            sourceInfo ? info += sourceInfo : info += getDeclarationErrorAddendum();
            var typeString;
            type === null ? typeString = "null" : Array.isArray(type) ? typeString = "array" : type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE ? (typeString = "<" + (getComponentName(type.type) || "Unknown") + " />", info = " Did you accidentally export a JSX literal instead of a component?") : typeString = typeof type, error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
          }
          var element = jsxDEV4(type, props, key, source, self);
          if (element == null)
            return element;
          if (validType) {
            var children = props.children;
            if (children !== void 0)
              if (isStaticChildren)
                if (Array.isArray(children)) {
                  for (var i5 = 0; i5 < children.length; i5++)
                    validateChildKeys(children[i5], type);
                  Object.freeze && Object.freeze(children);
                } else
                  error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
              else
                validateChildKeys(children, type);
          }
          return type === exports.Fragment ? validateFragmentProps(element) : validatePropTypes(element), element;
        }
      }
      var jsxDEV$1 = jsxWithValidation;
      exports.jsxDEV = jsxDEV$1;
    })();
  }
});

// node_modules/react/jsx-dev-runtime.js
var require_jsx_dev_runtime = __commonJS({
  "node_modules/react/jsx-dev-runtime.js"(exports, module) {
    "use strict";
    module.exports = require_react_jsx_dev_runtime_development();
  }
});

// node_modules/@remix-run/cloudflare-pages/esm/worker.js
init_esm();
function createRequestHandler2({
  build,
  getLoadContext,
  mode
}) {
  let handleRequest3 = createRequestHandler(build, mode);
  return (context) => {
    let loadContext = typeof getLoadContext == "function" ? getLoadContext(context) : void 0;
    return handleRequest3(context.request, loadContext);
  };
}
function createPagesFunctionHandler({
  build,
  getLoadContext,
  mode
}) {
  let handleRequest3 = createRequestHandler2({
    build,
    getLoadContext,
    mode
  }), handleFetch = async (context) => {
    let response;
    context.request.headers.delete("if-none-match");
    try {
      response = await context.env.ASSETS.fetch(context.request.url, context.request.clone()), response = response && response.status >= 200 && response.status < 400 ? new Response(response.body, response) : void 0;
    } catch {
    }
    return response || (response = await handleRequest3(context)), response;
  };
  return async (context) => {
    try {
      return await handleFetch(context);
    } catch (e10) {
      return e10 instanceof Error ? (console.error(e10), new Response(e10.message || e10.toString(), {
        status: 500
      })) : new Response("Internal Error", {
        status: 500
      });
    }
  };
}

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {};
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_server3 = __toESM(require_server());

// node_modules/remix/esm/index.js
var import_cloudflare = __toESM(require_cloudflare());

// node_modules/@remix-run/react/esm/_virtual/_rollupPluginBabelHelpers.js
function _extends3() {
  return _extends3 = Object.assign || function(target) {
    for (var i5 = 1; i5 < arguments.length; i5++) {
      var source = arguments[i5];
      for (var key in source)
        Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
    return target;
  }, _extends3.apply(this, arguments);
}

// node_modules/@remix-run/react/esm/components.js
var React2 = __toESM(require_react());
init_react_router_dom();

// node_modules/@remix-run/react/esm/errorBoundaries.js
var import_react3 = __toESM(require_react());
var RemixErrorBoundary = class extends import_react3.default.Component {
  constructor(props) {
    super(props), this.state = {
      error: props.error || null,
      location: props.location
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    return state.location !== props.location ? {
      error: props.error || null,
      location: props.location
    } : {
      error: props.error || state.error,
      location: state.location
    };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react3.default.createElement(this.props.component, {
      error: this.state.error
    }) : this.props.children;
  }
};
function RemixRootDefaultErrorBoundary({
  error
}) {
  return console.error(error), /* @__PURE__ */ import_react3.default.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ import_react3.default.createElement("head", null, /* @__PURE__ */ import_react3.default.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ import_react3.default.createElement("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1,viewport-fit=cover"
  }), /* @__PURE__ */ import_react3.default.createElement("title", null, "Application Error!")), /* @__PURE__ */ import_react3.default.createElement("body", null, /* @__PURE__ */ import_react3.default.createElement("main", {
    style: {
      fontFamily: "system-ui, sans-serif",
      padding: "2rem"
    }
  }, /* @__PURE__ */ import_react3.default.createElement("h1", {
    style: {
      fontSize: "24px"
    }
  }, "Application Error"), /* @__PURE__ */ import_react3.default.createElement("pre", {
    style: {
      padding: "2rem",
      background: "hsla(10, 50%, 50%, 0.1)",
      color: "red",
      overflow: "auto"
    }
  }, error.stack)), /* @__PURE__ */ import_react3.default.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `
              console.log(
                "\u{1F4BF} Hey developer\u{1F44B}. You can provide a way better UX than this when your app throws errors. Check out https://remix.run/guides/errors for more information."
              );
            `
    }
  })));
}
var RemixCatchContext = /* @__PURE__ */ import_react3.default.createContext(void 0);
function useCatch() {
  return (0, import_react3.useContext)(RemixCatchContext);
}
function RemixCatchBoundary({
  catch: catchVal,
  component: Component,
  children
}) {
  return catchVal ? /* @__PURE__ */ import_react3.default.createElement(RemixCatchContext.Provider, {
    value: catchVal
  }, /* @__PURE__ */ import_react3.default.createElement(Component, null)) : /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, children);
}
function RemixRootDefaultCatchBoundary() {
  let caught = useCatch();
  return /* @__PURE__ */ import_react3.default.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ import_react3.default.createElement("head", null, /* @__PURE__ */ import_react3.default.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ import_react3.default.createElement("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1,viewport-fit=cover"
  }), /* @__PURE__ */ import_react3.default.createElement("title", null, "Unhandled Thrown Response!")), /* @__PURE__ */ import_react3.default.createElement("body", null, /* @__PURE__ */ import_react3.default.createElement("h1", {
    style: {
      fontFamily: "system-ui, sans-serif",
      padding: "2rem"
    }
  }, caught.status, " ", caught.statusText), /* @__PURE__ */ import_react3.default.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `
              console.log(
                "\u{1F4BF} Hey developer\u{1F44B}. You can provide a way better UX than this when your app throws 404s (and other responses). Check out https://remix.run/guides/not-found for more information."
              );
            `
    }
  })));
}

// node_modules/@remix-run/react/esm/invariant.js
function invariant2(value, message) {
  if (value === !1 || value === null || typeof value > "u")
    throw new Error(message);
}

// node_modules/@remix-run/react/esm/links.js
init_history();

// node_modules/@remix-run/react/esm/routeModules.js
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache)
    return routeModulesCache[route.id];
  try {
    let routeModule = await import(route.module);
    return routeModulesCache[route.id] = routeModule, routeModule;
  } catch {
    return window.location.reload(), new Promise(() => {
    });
  }
}

// node_modules/@remix-run/react/esm/links.js
function getLinksForMatches(matches, routeModules, manifest) {
  let descriptors = matches.map((match) => {
    var _module$links;
    let module = routeModules[match.route.id];
    return ((_module$links = module.links) === null || _module$links === void 0 ? void 0 : _module$links.call(module)) || [];
  }).flat(1), preloads = getCurrentPageModulePreloadHrefs(matches, manifest);
  return dedupe(descriptors, preloads);
}
async function prefetchStyleLinks(routeModule) {
  if (!routeModule.links)
    return;
  let descriptors = routeModule.links();
  if (!descriptors)
    return;
  let styleLinks = [];
  for (let descriptor of descriptors)
    !isPageLinkDescriptor(descriptor) && descriptor.rel === "stylesheet" && styleLinks.push({
      ...descriptor,
      rel: "preload",
      as: "style"
    });
  let matchingLinks = styleLinks.filter((link) => !link.media || window.matchMedia(link.media).matches);
  await Promise.all(matchingLinks.map(prefetchStyleLink));
}
async function prefetchStyleLink(descriptor) {
  return new Promise((resolve) => {
    let link = document.createElement("link");
    Object.assign(link, descriptor);
    function removeLink() {
      document.head.contains(link) && document.head.removeChild(link);
    }
    link.onload = () => {
      removeLink(), resolve();
    }, link.onerror = () => {
      removeLink(), resolve();
    }, document.head.appendChild(link);
  });
}
function isPageLinkDescriptor(object) {
  return object != null && typeof object.page == "string";
}
function isHtmlLinkDescriptor(object) {
  return object != null && typeof object.rel == "string" && typeof object.href == "string";
}
async function getStylesheetPrefetchLinks(matches, routeModules) {
  return (await Promise.all(matches.map(async (match) => {
    let mod = await loadRouteModule(match.route, routeModules);
    return mod.links ? mod.links() : [];
  }))).flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map(({
    rel,
    ...attrs
  }) => rel === "preload" ? {
    rel: "prefetch",
    ...attrs
  } : {
    rel: "prefetch",
    as: "style",
    ...attrs
  });
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, location2, mode) {
  let path = parsePathPatch(page), isNew = (match, index) => currentMatches[index] ? match.route.id !== currentMatches[index].route.id : !0, matchPathChanged = (match, index) => {
    var _currentMatches$index;
    return currentMatches[index].pathname !== match.pathname || ((_currentMatches$index = currentMatches[index].route.path) === null || _currentMatches$index === void 0 ? void 0 : _currentMatches$index.endsWith("*")) && currentMatches[index].params["*"] !== match.params["*"];
  };
  return mode === "data" && location2.search !== path.search ? nextMatches.filter((match, index) => match.route.hasLoader ? isNew(match, index) || matchPathChanged(match, index) ? !0 : match.route.shouldReload ? match.route.shouldReload({
    params: match.params,
    prevUrl: new URL(location2.pathname + location2.search + location2.hash, window.origin),
    url: new URL(page, window.origin)
  }) : !0 : !1) : nextMatches.filter((match, index) => (mode === "assets" || match.route.hasLoader) && (isNew(match, index) || matchPathChanged(match, index)));
}
function getDataLinkHrefs(page, matches, manifest) {
  let path = parsePathPatch(page);
  return dedupeHrefs(matches.filter((match) => manifest.routes[match.route.id].hasLoader).map((match) => {
    let {
      pathname,
      search
    } = path, searchParams = new URLSearchParams(search);
    return searchParams.set("_data", match.route.id), `${pathname}?${searchParams}`;
  }));
}
function getModuleLinkHrefs(matches, manifestPatch) {
  return dedupeHrefs(matches.map((match) => {
    let route = manifestPatch.routes[match.route.id], hrefs = [route.module];
    return route.imports && (hrefs = hrefs.concat(route.imports)), hrefs;
  }).flat(1));
}
function getCurrentPageModulePreloadHrefs(matches, manifest) {
  return dedupeHrefs(matches.map((match) => {
    let route = manifest.routes[match.route.id], hrefs = [route.module];
    return route.imports && (hrefs = hrefs.concat(route.imports)), hrefs;
  }).flat(1));
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function dedupe(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set(), preloadsSet = new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    if (!isPageLinkDescriptor(descriptor) && descriptor.as === "script" && descriptor.href && preloadsSet.has(descriptor.href))
      return deduped;
    let str = JSON.stringify(descriptor);
    return set.has(str) || (set.add(str), deduped.push(descriptor)), deduped;
  }, []);
}
function parsePathPatch(href) {
  let path = parsePath(href);
  return path.search === void 0 && (path.search = ""), path;
}

// node_modules/@remix-run/react/esm/markup.js
function createHtml(html) {
  return {
    __html: html
  };
}

// node_modules/@remix-run/react/esm/routes.js
var React = __toESM(require_react());

// node_modules/@remix-run/react/esm/data.js
function isCatchResponse2(response) {
  return response instanceof Response && response.headers.get("X-Remix-Catch") != null;
}
function isErrorResponse(response) {
  return response instanceof Response && response.headers.get("X-Remix-Error") != null;
}
function isRedirectResponse2(response) {
  return response instanceof Response && response.headers.get("X-Remix-Redirect") != null;
}
async function fetchData(url, routeId, signal, submission) {
  url.searchParams.set("_data", routeId);
  let init2 = submission ? getActionInit(submission, signal) : {
    credentials: "same-origin",
    signal
  }, response = await fetch(url.href, init2);
  if (isErrorResponse(response)) {
    let data = await response.json(), error = new Error(data.message);
    return error.stack = data.stack, error;
  }
  return response;
}
async function extractData2(response) {
  let contentType = response.headers.get("Content-Type");
  return contentType && /\bapplication\/json\b/.test(contentType) ? response.json() : response.text();
}
function getActionInit(submission, signal) {
  let {
    encType,
    method,
    formData
  } = submission, headers, body = formData;
  if (encType === "application/x-www-form-urlencoded") {
    body = new URLSearchParams();
    for (let [key, value] of formData)
      invariant2(typeof value == "string", 'File inputs are not supported with encType "application/x-www-form-urlencoded", please use "multipart/form-data" instead.'), body.append(key, value);
    headers = {
      "Content-Type": encType
    };
  }
  return {
    method,
    body,
    signal,
    credentials: "same-origin",
    headers
  };
}

// node_modules/@remix-run/react/esm/transition.js
init_history();

// node_modules/@remix-run/react/esm/routeMatching.js
init_react_router_dom();
function matchClientRoutes(routes2, location2) {
  let matches = matchRoutes(routes2, location2);
  return matches ? matches.map((match) => ({
    params: match.params,
    pathname: match.pathname,
    route: match.route
  })) : null;
}

// node_modules/@remix-run/react/esm/transition.js
var CatchValue = class {
  constructor(status, statusText, data) {
    this.status = status, this.statusText = statusText, this.data = data;
  }
};
function isActionSubmission(submission) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(submission.method);
}
function isLoaderSubmission(submission) {
  return submission.method === "GET";
}
function isRedirectLocation(location2) {
  return Boolean(location2.state) && location2.state.isRedirect;
}
function isLoaderRedirectLocation(location2) {
  return isRedirectLocation(location2) && location2.state.type === "loader";
}
function isActionRedirectLocation(location2) {
  return isRedirectLocation(location2) && location2.state.type === "action";
}
function isFetchActionRedirect(location2) {
  return isRedirectLocation(location2) && location2.state.type === "fetchAction";
}
function isLoaderSubmissionRedirectLocation(location2) {
  return isRedirectLocation(location2) && location2.state.type === "loaderSubmission";
}
var TransitionRedirect = class {
  constructor(location2, setCookie) {
    this.setCookie = setCookie, this.location = typeof location2 == "string" ? location2 : location2.pathname + location2.search;
  }
}, IDLE_TRANSITION = {
  state: "idle",
  submission: void 0,
  location: void 0,
  type: "idle"
}, IDLE_FETCHER = {
  state: "idle",
  type: "init",
  data: void 0,
  submission: void 0
};
function createTransitionManager(init2) {
  let {
    routes: routes2
  } = init2, pendingNavigationController, fetchControllers = /* @__PURE__ */ new Map(), incrementingLoadId = 0, navigationLoadId = -1, fetchReloadIds = /* @__PURE__ */ new Map(), fetchRedirectIds = /* @__PURE__ */ new Set(), matches = matchClientRoutes(routes2, init2.location);
  matches || (matches = [{
    params: {},
    pathname: "",
    route: routes2[0]
  }]);
  let state = {
    location: init2.location,
    loaderData: init2.loaderData || {},
    actionData: init2.actionData,
    catch: init2.catch,
    error: init2.error,
    catchBoundaryId: init2.catchBoundaryId || null,
    errorBoundaryId: init2.errorBoundaryId || null,
    matches,
    nextMatches: void 0,
    transition: IDLE_TRANSITION,
    fetchers: /* @__PURE__ */ new Map()
  };
  function update(updates) {
    updates.transition && updates.transition === IDLE_TRANSITION && (pendingNavigationController = void 0), state = Object.assign({}, state, updates), init2.onChange(state);
  }
  function getState() {
    return state;
  }
  function getFetcher(key) {
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  function setFetcher(key, fetcher) {
    state.fetchers.set(key, fetcher);
  }
  function deleteFetcher(key) {
    fetchControllers.has(key) && abortFetcher(key), fetchReloadIds.delete(key), fetchRedirectIds.delete(key), state.fetchers.delete(key);
  }
  async function send(event) {
    switch (event.type) {
      case "navigation": {
        let {
          action,
          location: location2,
          submission
        } = event, matches2 = matchClientRoutes(routes2, location2);
        matches2 ? !submission && isHashChangeOnly(location2) ? await handleHashChange(location2, matches2) : action === Action.Pop ? await handleLoad(location2, matches2) : submission && isActionSubmission(submission) ? await handleActionSubmissionNavigation(location2, submission, matches2) : submission && isLoaderSubmission(submission) ? await handleLoaderSubmissionNavigation(location2, submission, matches2) : isActionRedirectLocation(location2) ? await handleActionRedirect(location2, matches2) : isLoaderSubmissionRedirectLocation(location2) ? await handleLoaderSubmissionRedirect(location2, matches2) : isLoaderRedirectLocation(location2) ? await handleLoaderRedirect(location2, matches2) : isFetchActionRedirect(location2) ? await handleFetchActionRedirect(location2, matches2) : await handleLoad(location2, matches2) : (matches2 = [{
          params: {},
          pathname: "",
          route: routes2[0]
        }], await handleNotFoundNavigation(location2, matches2)), navigationLoadId = -1;
        break;
      }
      case "fetcher": {
        let {
          key,
          submission,
          href
        } = event, matches2 = matchClientRoutes(routes2, href);
        invariant2(matches2, "No matches found"), fetchControllers.has(key) && abortFetcher(key);
        let match = getFetcherRequestMatch(new URL(href, window.location.href), matches2);
        submission && isActionSubmission(submission) ? await handleActionFetchSubmission(key, submission, match) : submission && isLoaderSubmission(submission) ? await handleLoaderFetchSubmission(href, key, submission, match) : await handleLoaderFetch(href, key, match);
        break;
      }
      default:
        throw new Error(`Unknown data event type: ${event.type}`);
    }
  }
  function dispose() {
    abortNormalNavigation();
    for (let [, controller] of fetchControllers)
      controller.abort();
  }
  function isIndexRequestUrl2(url) {
    for (let param of url.searchParams.getAll("index"))
      if (param === "")
        return !0;
    return !1;
  }
  function getFetcherRequestMatch(url, matches2) {
    let match = matches2.slice(-1)[0];
    return !isIndexRequestUrl2(url) && match.route.index ? matches2.slice(-2)[0] : match;
  }
  async function handleActionFetchSubmission(key, submission, match) {
    let currentFetcher = state.fetchers.get(key), fetcher = {
      state: "submitting",
      type: "actionSubmission",
      submission,
      data: (currentFetcher == null ? void 0 : currentFetcher.data) || void 0
    };
    setFetcher(key, fetcher), update({
      fetchers: new Map(state.fetchers)
    });
    let controller = new AbortController();
    fetchControllers.set(key, controller);
    let result = await callAction(submission, match, controller.signal);
    if (controller.signal.aborted)
      return;
    if (isRedirectResult(result)) {
      let locationState = {
        isRedirect: !0,
        type: "fetchAction",
        setCookie: result.value.setCookie
      };
      fetchRedirectIds.add(key), init2.onRedirect(result.value.location, locationState), setFetcher(key, {
        state: "loading",
        type: "actionRedirect",
        submission,
        data: void 0
      }), update({
        fetchers: new Map(state.fetchers)
      });
      return;
    }
    if (maybeBailOnError(match, key, result) || await maybeBailOnCatch(match, key, result))
      return;
    let loadFetcher = {
      state: "loading",
      type: "actionReload",
      data: result.value,
      submission
    };
    setFetcher(key, loadFetcher), update({
      fetchers: new Map(state.fetchers)
    });
    let maybeActionErrorResult = isErrorResult(result) ? result : void 0, maybeActionCatchResult = isCatchResult(result) ? result : void 0, loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let matchesToLoad = state.nextMatches || state.matches, results = await callLoaders(state, state.transition.location || state.location, matchesToLoad, controller.signal, maybeActionErrorResult, maybeActionCatchResult, submission, match.route.id, loadFetcher);
    if (controller.signal.aborted)
      return;
    fetchReloadIds.delete(key), fetchControllers.delete(key);
    let redirect2 = findRedirect(results);
    if (redirect2) {
      let locationState = {
        isRedirect: !0,
        type: "loader",
        setCookie: redirect2.setCookie
      };
      init2.onRedirect(redirect2.location, locationState);
      return;
    }
    let [error, errorBoundaryId] = findErrorAndBoundaryId(results, state.matches, maybeActionErrorResult), [catchVal, catchBoundaryId] = await findCatchAndBoundaryId(results, state.matches, maybeActionCatchResult) || [], doneFetcher = {
      state: "idle",
      type: "done",
      data: result.value,
      submission: void 0
    };
    setFetcher(key, doneFetcher);
    let abortedKeys = abortStaleFetchLoads(loadId);
    if (abortedKeys && markFetchersDone(abortedKeys), yeetStaleNavigationLoad(loadId)) {
      let {
        transition
      } = state;
      invariant2(transition.state === "loading", "Expected loading transition"), update({
        location: transition.location,
        matches: state.nextMatches,
        error,
        errorBoundaryId,
        catch: catchVal,
        catchBoundaryId,
        loaderData: makeLoaderData(state, results, matchesToLoad),
        actionData: transition.type === "actionReload" ? state.actionData : void 0,
        transition: IDLE_TRANSITION,
        fetchers: new Map(state.fetchers)
      });
    } else
      update({
        fetchers: new Map(state.fetchers),
        error,
        errorBoundaryId,
        loaderData: makeLoaderData(state, results, matchesToLoad)
      });
  }
  function yeetStaleNavigationLoad(landedId) {
    return state.transition.state === "loading" && navigationLoadId < landedId ? (abortNormalNavigation(), !0) : !1;
  }
  function markFetchersDone(keys2) {
    for (let key of keys2) {
      let fetcher = getFetcher(key), doneFetcher = {
        state: "idle",
        type: "done",
        data: fetcher.data,
        submission: void 0
      };
      setFetcher(key, doneFetcher);
    }
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds)
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant2(fetcher, `Expected fetcher: ${key}`), fetcher.state === "loading" && (abortFetcher(key), fetchReloadIds.delete(key), yeetedKeys.push(key));
      }
    return yeetedKeys.length ? yeetedKeys : !1;
  }
  async function handleLoaderFetchSubmission(href, key, submission, match) {
    let currentFetcher = state.fetchers.get(key), fetcher = {
      state: "submitting",
      type: "loaderSubmission",
      submission,
      data: (currentFetcher == null ? void 0 : currentFetcher.data) || void 0
    };
    setFetcher(key, fetcher), update({
      fetchers: new Map(state.fetchers)
    });
    let controller = new AbortController();
    fetchControllers.set(key, controller);
    let result = await callLoader(match, createUrl(href), controller.signal);
    if (fetchControllers.delete(key), controller.signal.aborted)
      return;
    if (isRedirectResult(result)) {
      let locationState = {
        isRedirect: !0,
        type: "loader",
        setCookie: result.value.setCookie
      };
      init2.onRedirect(result.value.location, locationState);
      return;
    }
    if (maybeBailOnError(match, key, result) || await maybeBailOnCatch(match, key, result))
      return;
    let doneFetcher = {
      state: "idle",
      type: "done",
      data: result.value,
      submission: void 0
    };
    setFetcher(key, doneFetcher), update({
      fetchers: new Map(state.fetchers)
    });
  }
  async function handleLoaderFetch(href, key, match) {
    if (typeof AbortController > "u")
      throw new Error("handleLoaderFetch was called during the server render, but it shouldn't be. You are likely calling useFetcher.load() in the body of your component. Try moving it to a useEffect or a callback.");
    let currentFetcher = state.fetchers.get(key), fetcher = {
      state: "loading",
      type: "normalLoad",
      submission: void 0,
      data: (currentFetcher == null ? void 0 : currentFetcher.data) || void 0
    };
    setFetcher(key, fetcher), update({
      fetchers: new Map(state.fetchers)
    });
    let controller = new AbortController();
    fetchControllers.set(key, controller);
    let result = await callLoader(match, createUrl(href), controller.signal);
    if (controller.signal.aborted)
      return;
    if (fetchControllers.delete(key), isRedirectResult(result)) {
      let locationState = {
        isRedirect: !0,
        type: "loader",
        setCookie: result.value.setCookie
      };
      init2.onRedirect(result.value.location, locationState);
      return;
    }
    if (maybeBailOnError(match, key, result) || await maybeBailOnCatch(match, key, result))
      return;
    let doneFetcher = {
      state: "idle",
      type: "done",
      data: result.value,
      submission: void 0
    };
    setFetcher(key, doneFetcher), update({
      fetchers: new Map(state.fetchers)
    });
  }
  async function maybeBailOnCatch(match, key, result) {
    if (isCatchResult(result)) {
      let catchBoundaryId = findNearestCatchBoundary(match, state.matches);
      return state.fetchers.delete(key), update({
        transition: IDLE_TRANSITION,
        fetchers: new Map(state.fetchers),
        catch: {
          data: result.value.data,
          status: result.value.status,
          statusText: result.value.statusText
        },
        catchBoundaryId
      }), !0;
    }
    return !1;
  }
  function maybeBailOnError(match, key, result) {
    if (isErrorResult(result)) {
      let errorBoundaryId = findNearestBoundary(match, state.matches);
      return state.fetchers.delete(key), update({
        fetchers: new Map(state.fetchers),
        error: result.value,
        errorBoundaryId
      }), !0;
    }
    return !1;
  }
  async function handleNotFoundNavigation(location2, matches2) {
    abortNormalNavigation(), update({
      transition: {
        state: "loading",
        type: "normalLoad",
        submission: void 0,
        location: location2
      },
      nextMatches: matches2
    }), await Promise.resolve();
    let catchBoundaryId = findNearestCatchBoundary(matches2[0], matches2);
    update({
      location: location2,
      matches: matches2,
      catch: {
        data: null,
        status: 404,
        statusText: "Not Found"
      },
      catchBoundaryId,
      transition: IDLE_TRANSITION
    });
  }
  async function handleActionSubmissionNavigation(location2, submission, matches2) {
    abortNormalNavigation(), update({
      transition: {
        state: "submitting",
        type: "actionSubmission",
        submission,
        location: location2
      },
      nextMatches: matches2
    });
    let controller = new AbortController();
    pendingNavigationController = controller;
    let actionMatches = matches2;
    !isIndexRequestUrl2(createUrl(submission.action)) && actionMatches[matches2.length - 1].route.index && (actionMatches = actionMatches.slice(0, -1));
    let leafMatch = actionMatches.slice(-1)[0], result = await callAction(submission, leafMatch, controller.signal);
    if (controller.signal.aborted)
      return;
    if (isRedirectResult(result)) {
      let locationState = {
        isRedirect: !0,
        type: "action",
        setCookie: result.value.setCookie
      };
      init2.onRedirect(result.value.location, locationState);
      return;
    }
    let catchVal, catchBoundaryId;
    isCatchResult(result) && ([catchVal, catchBoundaryId] = await findCatchAndBoundaryId([result], actionMatches, result) || []), update({
      transition: {
        state: "loading",
        type: "actionReload",
        submission,
        location: location2
      },
      actionData: {
        [leafMatch.route.id]: result.value
      }
    }), await loadPageData(location2, matches2, submission, leafMatch.route.id, result, catchVal, catchBoundaryId);
  }
  async function handleLoaderSubmissionNavigation(location2, submission, matches2) {
    abortNormalNavigation(), update({
      transition: {
        state: "submitting",
        type: "loaderSubmission",
        submission,
        location: location2
      },
      nextMatches: matches2
    }), await loadPageData(location2, matches2, submission);
  }
  async function handleHashChange(location2, matches2) {
    abortNormalNavigation(), update({
      transition: {
        state: "loading",
        type: "normalLoad",
        submission: void 0,
        location: location2
      },
      nextMatches: matches2
    }), await Promise.resolve(), update({
      location: location2,
      matches: matches2,
      transition: IDLE_TRANSITION
    });
  }
  async function handleLoad(location2, matches2) {
    abortNormalNavigation(), update({
      transition: {
        state: "loading",
        type: "normalLoad",
        submission: void 0,
        location: location2
      },
      nextMatches: matches2
    }), await loadPageData(location2, matches2);
  }
  async function handleLoaderRedirect(location2, matches2) {
    abortNormalNavigation(), update({
      transition: {
        state: "loading",
        type: "normalRedirect",
        submission: void 0,
        location: location2
      },
      nextMatches: matches2
    }), await loadPageData(location2, matches2);
  }
  async function handleLoaderSubmissionRedirect(location2, matches2) {
    abortNormalNavigation(), invariant2(state.transition.type === "loaderSubmission", `Unexpected transition: ${JSON.stringify(state.transition)}`);
    let {
      submission
    } = state.transition;
    update({
      transition: {
        state: "loading",
        type: "loaderSubmissionRedirect",
        submission,
        location: location2
      },
      nextMatches: matches2
    }), await loadPageData(location2, matches2, submission);
  }
  async function handleFetchActionRedirect(location2, matches2) {
    abortNormalNavigation(), update({
      transition: {
        state: "loading",
        type: "fetchActionRedirect",
        submission: void 0,
        location: location2
      },
      nextMatches: matches2
    }), await loadPageData(location2, matches2);
  }
  async function handleActionRedirect(location2, matches2) {
    abortNormalNavigation(), invariant2(state.transition.type === "actionSubmission" || state.transition.type === "actionReload", `Unexpected transition: ${JSON.stringify(state.transition)}`);
    let {
      submission
    } = state.transition;
    update({
      transition: {
        state: "loading",
        type: "actionRedirect",
        submission,
        location: location2
      },
      nextMatches: matches2
    }), await loadPageData(location2, matches2, submission);
  }
  function isHashChangeOnly(location2) {
    return createHref(state.location) === createHref(location2) && state.location.hash !== location2.hash;
  }
  async function loadPageData(location2, matches2, submission, submissionRouteId, actionResult, catchVal, catchBoundaryId) {
    let maybeActionErrorResult = actionResult && isErrorResult(actionResult) ? actionResult : void 0, maybeActionCatchResult = actionResult && isCatchResult(actionResult) ? actionResult : void 0, controller = new AbortController();
    pendingNavigationController = controller, navigationLoadId = ++incrementingLoadId;
    let results = await callLoaders(state, location2, matches2, controller.signal, maybeActionErrorResult, maybeActionCatchResult, submission, submissionRouteId, void 0, catchBoundaryId);
    if (controller.signal.aborted)
      return;
    let redirect2 = findRedirect(results);
    if (redirect2) {
      if (state.transition.type === "actionReload") {
        let locationState = {
          isRedirect: !0,
          type: "action",
          setCookie: redirect2.setCookie
        };
        init2.onRedirect(redirect2.location, locationState);
      } else if (state.transition.type === "loaderSubmission") {
        let locationState = {
          isRedirect: !0,
          type: "loaderSubmission",
          setCookie: redirect2.setCookie
        };
        init2.onRedirect(redirect2.location, locationState);
      } else {
        let locationState = {
          isRedirect: !0,
          type: "loader",
          setCookie: redirect2.setCookie
        };
        init2.onRedirect(redirect2.location, locationState);
      }
      return;
    }
    let [error, errorBoundaryId] = findErrorAndBoundaryId(results, matches2, maybeActionErrorResult);
    [catchVal, catchBoundaryId] = await findCatchAndBoundaryId(results, matches2, maybeActionErrorResult) || [catchVal, catchBoundaryId], markFetchRedirectsDone();
    let abortedIds = abortStaleFetchLoads(navigationLoadId);
    abortedIds && markFetchersDone(abortedIds), update({
      location: location2,
      matches: matches2,
      error,
      errorBoundaryId,
      catch: catchVal,
      catchBoundaryId,
      loaderData: makeLoaderData(state, results, matches2),
      actionData: state.transition.type === "actionReload" ? state.actionData : void 0,
      transition: IDLE_TRANSITION,
      fetchers: abortedIds ? new Map(state.fetchers) : state.fetchers
    });
  }
  function abortNormalNavigation() {
    pendingNavigationController && pendingNavigationController.abort();
  }
  function abortFetcher(key) {
    let controller = fetchControllers.get(key);
    invariant2(controller, `Expected fetch controller: ${key}`), controller.abort(), fetchControllers.delete(key);
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant2(fetcher, `Expected fetcher: ${key}`), fetcher.type === "actionRedirect" && (fetchRedirectIds.delete(key), doneKeys.push(key));
    }
    markFetchersDone(doneKeys);
  }
  return {
    send,
    getState,
    getFetcher,
    deleteFetcher,
    dispose,
    get _internalFetchControllers() {
      return fetchControllers;
    }
  };
}
async function callLoaders(state, location2, matches, signal, actionErrorResult, actionCatchResult, submission, submissionRouteId, fetcher, catchBoundaryId) {
  let url = createUrl(createHref(location2)), matchesToLoad = filterMatchesToLoad(state, location2, matches, actionErrorResult, actionCatchResult, submission, submissionRouteId, fetcher, catchBoundaryId);
  return Promise.all(matchesToLoad.map((match) => callLoader(match, url, signal)));
}
async function callLoader(match, url, signal) {
  invariant2(match.route.loader, `Expected loader for ${match.route.id}`);
  try {
    let {
      params
    } = match, value = await match.route.loader({
      params,
      url,
      signal
    });
    return {
      match,
      value
    };
  } catch (error) {
    return {
      match,
      value: error
    };
  }
}
async function callAction(submission, match, signal) {
  try {
    let value = await match.route.action({
      url: createUrl(submission.action),
      params: match.params,
      submission,
      signal
    });
    return {
      match,
      value
    };
  } catch (error) {
    return {
      match,
      value: error
    };
  }
}
function filterMatchesToLoad(state, location2, matches, actionErrorResult, actionCatchResult, submission, submissionRouteId, fetcher, catchBoundaryId) {
  var _location$state;
  if (catchBoundaryId || submissionRouteId && (actionCatchResult || actionErrorResult)) {
    let foundProblematicRoute = !1;
    matches = matches.filter((match) => foundProblematicRoute ? !1 : match.route.id === submissionRouteId || match.route.id === catchBoundaryId ? (foundProblematicRoute = !0, !1) : !0);
  }
  let isNew = (match, index) => state.matches[index] ? match.route.id !== state.matches[index].route.id : !0, matchPathChanged = (match, index) => {
    var _state$matches$index$;
    return state.matches[index].pathname !== match.pathname || ((_state$matches$index$ = state.matches[index].route.path) === null || _state$matches$index$ === void 0 ? void 0 : _state$matches$index$.endsWith("*")) && state.matches[index].params["*"] !== match.params["*"];
  }, url = createUrl(createHref(location2)), filterByRouteProps = (match, index) => {
    if (!match.route.loader)
      return !1;
    if (isNew(match, index) || matchPathChanged(match, index))
      return !0;
    if (match.route.shouldReload) {
      let prevUrl = createUrl(createHref(state.location));
      return match.route.shouldReload({
        prevUrl,
        url,
        submission,
        params: match.params
      });
    }
    return !0;
  };
  return state.matches.length === 1 ? matches.filter((match) => !!match.route.loader) : (fetcher == null ? void 0 : fetcher.type) === "actionReload" || state.transition.type === "actionReload" || state.transition.type === "actionRedirect" || createHref(url) === createHref(state.location) || url.searchParams.toString() !== state.location.search.substring(1) || (_location$state = location2.state) !== null && _location$state !== void 0 && _location$state.setCookie ? matches.filter(filterByRouteProps) : matches.filter((match, index, arr) => {
    var _location$state2;
    return (actionErrorResult || actionCatchResult) && arr.length - 1 === index ? !1 : match.route.loader && (isNew(match, index) || matchPathChanged(match, index) || ((_location$state2 = location2.state) === null || _location$state2 === void 0 ? void 0 : _location$state2.setCookie));
  });
}
function isRedirectResult(result) {
  return result.value instanceof TransitionRedirect;
}
function createHref(location2) {
  return location2.pathname + location2.search;
}
function findRedirect(results) {
  for (let result of results)
    if (isRedirectResult(result))
      return result.value;
  return null;
}
async function findCatchAndBoundaryId(results, matches, actionCatchResult) {
  let loaderCatchResult;
  for (let result of results)
    if (isCatchResult(result)) {
      loaderCatchResult = result;
      break;
    }
  let extractCatchData = async (res) => ({
    status: res.status,
    statusText: res.statusText,
    data: res.data
  });
  if (actionCatchResult && loaderCatchResult) {
    let boundaryId = findNearestCatchBoundary(loaderCatchResult.match, matches);
    return [await extractCatchData(actionCatchResult.value), boundaryId];
  }
  if (loaderCatchResult) {
    let boundaryId = findNearestCatchBoundary(loaderCatchResult.match, matches);
    return [await extractCatchData(loaderCatchResult.value), boundaryId];
  }
  return null;
}
function findErrorAndBoundaryId(results, matches, actionErrorResult) {
  let loaderErrorResult;
  for (let result of results)
    if (isErrorResult(result)) {
      loaderErrorResult = result;
      break;
    }
  if (actionErrorResult && loaderErrorResult) {
    let boundaryId = findNearestBoundary(loaderErrorResult.match, matches);
    return [actionErrorResult.value, boundaryId];
  }
  if (actionErrorResult) {
    let boundaryId = findNearestBoundary(actionErrorResult.match, matches);
    return [actionErrorResult.value, boundaryId];
  }
  if (loaderErrorResult) {
    let boundaryId = findNearestBoundary(loaderErrorResult.match, matches);
    return [loaderErrorResult.value, boundaryId];
  }
  return [void 0, void 0];
}
function findNearestCatchBoundary(matchWithError, matches) {
  let nearestBoundaryId = null;
  for (let match of matches)
    if (match.route.CatchBoundary && (nearestBoundaryId = match.route.id), match === matchWithError)
      break;
  return nearestBoundaryId;
}
function findNearestBoundary(matchWithError, matches) {
  let nearestBoundaryId = null;
  for (let match of matches)
    if (match.route.ErrorBoundary && (nearestBoundaryId = match.route.id), match === matchWithError)
      break;
  return nearestBoundaryId;
}
function makeLoaderData(state, results, matches) {
  let newData = {};
  for (let {
    match,
    value
  } of results)
    newData[match.route.id] = value;
  let loaderData = {};
  for (let {
    route
  } of matches) {
    let value = newData[route.id] !== void 0 ? newData[route.id] : state.loaderData[route.id];
    value !== void 0 && (loaderData[route.id] = value);
  }
  return loaderData;
}
function isCatchResult(result) {
  return result.value instanceof CatchValue;
}
function isErrorResult(result) {
  return result.value instanceof Error;
}
function createUrl(href) {
  return new URL(href, window.location.origin);
}

// node_modules/@remix-run/react/esm/routes.js
function createClientRoute(entryRoute, routeModulesCache, Component) {
  return {
    caseSensitive: !!entryRoute.caseSensitive,
    element: /* @__PURE__ */ React.createElement(Component, {
      id: entryRoute.id
    }),
    id: entryRoute.id,
    path: entryRoute.path,
    index: entryRoute.index,
    module: entryRoute.module,
    loader: createLoader(entryRoute, routeModulesCache),
    action: createAction(entryRoute, routeModulesCache),
    shouldReload: createShouldReload(entryRoute, routeModulesCache),
    ErrorBoundary: entryRoute.hasErrorBoundary,
    CatchBoundary: entryRoute.hasCatchBoundary,
    hasLoader: entryRoute.hasLoader
  };
}
function createClientRoutes(routeManifest, routeModulesCache, Component, parentId) {
  return Object.keys(routeManifest).filter((key) => routeManifest[key].parentId === parentId).map((key) => {
    let route = createClientRoute(routeManifest[key], routeModulesCache, Component), children = createClientRoutes(routeManifest, routeModulesCache, Component, route.id);
    return children.length > 0 && (route.children = children), route;
  });
}
function createShouldReload(route, routeModules) {
  return (arg) => {
    let module = routeModules[route.id];
    return invariant2(module, `Expected route module to be loaded for ${route.id}`), module.unstable_shouldReload ? module.unstable_shouldReload(arg) : !0;
  };
}
async function loadRouteModuleWithBlockingLinks(route, routeModules) {
  let routeModule = await loadRouteModule(route, routeModules);
  return await prefetchStyleLinks(routeModule), routeModule;
}
function createLoader(route, routeModules) {
  return async ({
    url,
    signal,
    submission
  }) => {
    if (route.hasLoader) {
      let [result] = await Promise.all([fetchData(url, route.id, signal, submission), loadRouteModuleWithBlockingLinks(route, routeModules)]);
      if (result instanceof Error)
        throw result;
      let redirect2 = await checkRedirect(result);
      if (redirect2)
        return redirect2;
      if (isCatchResponse2(result))
        throw new CatchValue(result.status, result.statusText, await extractData2(result.clone()));
      return extractData2(result);
    } else
      await loadRouteModuleWithBlockingLinks(route, routeModules);
  };
}
function createAction(route, routeModules) {
  return async ({
    url,
    signal,
    submission
  }) => {
    route.hasAction || console.error(`Route "${route.id}" does not have an action, but you are trying to submit to it. To fix this, please add an \`action\` function to the route`);
    let result = await fetchData(url, route.id, signal, submission);
    if (result instanceof Error)
      throw result;
    let redirect2 = await checkRedirect(result);
    if (redirect2)
      return redirect2;
    if (await loadRouteModuleWithBlockingLinks(route, routeModules), isCatchResponse2(result))
      throw new CatchValue(result.status, result.statusText, await extractData2(result.clone()));
    return extractData2(result);
  };
}
async function checkRedirect(response) {
  if (isRedirectResponse2(response)) {
    let url = new URL(response.headers.get("X-Remix-Redirect"), window.location.origin);
    if (url.origin !== window.location.origin)
      await new Promise(() => {
        window.location.replace(url.href);
      });
    else
      return new TransitionRedirect(url.pathname + url.search, response.headers.get("X-Remix-Revalidate") !== null);
  }
  return null;
}

// node_modules/@remix-run/react/esm/components.js
var RemixEntryContext = /* @__PURE__ */ React2.createContext(void 0);
function useRemixEntryContext() {
  let context = React2.useContext(RemixEntryContext);
  return invariant2(context, "You must render this element inside a <Remix> element"), context;
}
function RemixEntry({
  context: entryContext,
  action,
  location: historyLocation,
  navigator: _navigator,
  static: staticProp = !1
}) {
  let {
    manifest,
    routeData: documentLoaderData,
    actionData: documentActionData,
    routeModules,
    serverHandoffString,
    appState: entryComponentDidCatchEmulator
  } = entryContext, clientRoutes = React2.useMemo(() => createClientRoutes(manifest.routes, routeModules, RemixRoute), [manifest, routeModules]), [clientState, setClientState] = React2.useState(entryComponentDidCatchEmulator), [transitionManager] = React2.useState(() => createTransitionManager({
    routes: clientRoutes,
    actionData: documentActionData,
    loaderData: documentLoaderData,
    location: historyLocation,
    catch: entryComponentDidCatchEmulator.catch,
    catchBoundaryId: entryComponentDidCatchEmulator.catchBoundaryRouteId,
    onRedirect: _navigator.replace,
    onChange: (state) => {
      setClientState({
        catch: state.catch,
        error: state.error,
        catchBoundaryRouteId: state.catchBoundaryId,
        loaderBoundaryRouteId: state.errorBoundaryId,
        renderBoundaryRouteId: null,
        trackBoundaries: !1,
        trackCatchBoundaries: !1
      });
    }
  })), navigator2 = React2.useMemo(() => ({
    ..._navigator,
    push: (to, state) => transitionManager.getState().transition.state !== "idle" ? _navigator.replace(to, state) : _navigator.push(to, state)
  }), [_navigator, transitionManager]), {
    location: location2,
    matches,
    loaderData,
    actionData
  } = transitionManager.getState();
  React2.useEffect(() => {
    let {
      location: location3
    } = transitionManager.getState();
    historyLocation !== location3 && transitionManager.send({
      type: "navigation",
      location: historyLocation,
      submission: consumeNextNavigationSubmission(),
      action
    });
  }, [transitionManager, historyLocation, action]);
  let ssrErrorBeforeRoutesRendered = clientState.error && clientState.renderBoundaryRouteId === null && clientState.loaderBoundaryRouteId === null ? deserializeError(clientState.error) : void 0, ssrCatchBeforeRoutesRendered = clientState.catch && clientState.catchBoundaryRouteId === null ? clientState.catch : void 0;
  return /* @__PURE__ */ React2.createElement(RemixEntryContext.Provider, {
    value: {
      matches,
      manifest,
      appState: clientState,
      routeModules,
      serverHandoffString,
      clientRoutes,
      routeData: loaderData,
      actionData,
      transitionManager
    }
  }, /* @__PURE__ */ React2.createElement(RemixErrorBoundary, {
    location: location2,
    component: RemixRootDefaultErrorBoundary,
    error: ssrErrorBeforeRoutesRendered
  }, /* @__PURE__ */ React2.createElement(RemixCatchBoundary, {
    location: location2,
    component: RemixRootDefaultCatchBoundary,
    catch: ssrCatchBeforeRoutesRendered
  }, /* @__PURE__ */ React2.createElement(Router, {
    navigationType: action,
    location: location2,
    navigator: navigator2,
    static: staticProp
  }, /* @__PURE__ */ React2.createElement(Routes2, null)))));
}
function deserializeError(data) {
  let error = new Error(data.message);
  return error.stack = data.stack, error;
}
function Routes2() {
  let {
    clientRoutes
  } = useRemixEntryContext();
  return useRoutes(clientRoutes) || clientRoutes[0].element;
}
var RemixRouteContext = /* @__PURE__ */ React2.createContext(void 0);
function useRemixRouteContext() {
  let context = React2.useContext(RemixRouteContext);
  return invariant2(context, "You must render this element in a remix route element"), context;
}
function DefaultRouteComponent({
  id
}) {
  throw new Error(`Route "${id}" has no component! Please go add a \`default\` export in the route module file.
If you were trying to navigate or submit to a resource route, use \`<a>\` instead of \`<Link>\` or \`<Form reloadDocument>\`.`);
}
function RemixRoute({
  id
}) {
  let location2 = useLocation(), {
    routeData,
    routeModules,
    appState
  } = useRemixEntryContext(), data = routeData[id], {
    default: Component,
    CatchBoundary: CatchBoundary2,
    ErrorBoundary: ErrorBoundary2
  } = routeModules[id], element = Component ? /* @__PURE__ */ React2.createElement(Component, null) : /* @__PURE__ */ React2.createElement(DefaultRouteComponent, {
    id
  }), context = {
    data,
    id
  };
  if (CatchBoundary2) {
    let maybeServerCaught = appState.catch && appState.catchBoundaryRouteId === id ? appState.catch : void 0;
    appState.trackCatchBoundaries && (appState.catchBoundaryRouteId = id), context = maybeServerCaught ? {
      id,
      get data() {
        console.error("You cannot `useLoaderData` in a catch boundary.");
      }
    } : {
      id,
      data
    }, element = /* @__PURE__ */ React2.createElement(RemixCatchBoundary, {
      location: location2,
      component: CatchBoundary2,
      catch: maybeServerCaught
    }, element);
  }
  if (ErrorBoundary2) {
    let maybeServerRenderError = appState.error && (appState.renderBoundaryRouteId === id || appState.loaderBoundaryRouteId === id) ? deserializeError(appState.error) : void 0;
    appState.trackBoundaries && (appState.renderBoundaryRouteId = id), context = maybeServerRenderError ? {
      id,
      get data() {
        console.error("You cannot `useLoaderData` in an error boundary.");
      }
    } : {
      id,
      data
    }, element = /* @__PURE__ */ React2.createElement(RemixErrorBoundary, {
      location: location2,
      component: ErrorBoundary2,
      error: maybeServerRenderError
    }, element);
  }
  return /* @__PURE__ */ React2.createElement(RemixRouteContext.Provider, {
    value: context
  }, element);
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let [maybePrefetch, setMaybePrefetch] = React2.useState(!1), [shouldPrefetch, setShouldPrefetch] = React2.useState(!1), {
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onTouchStart
  } = theirElementProps;
  React2.useEffect(() => {
    prefetch === "render" && setShouldPrefetch(!0);
  }, [prefetch]);
  let setIntent = () => {
    prefetch === "intent" && setMaybePrefetch(!0);
  }, cancelIntent = () => {
    prefetch === "intent" && setMaybePrefetch(!1);
  };
  return React2.useEffect(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(!0);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]), [shouldPrefetch, {
    onFocus: composeEventHandlers(onFocus, setIntent),
    onBlur: composeEventHandlers(onBlur, cancelIntent),
    onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
    onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
    onTouchStart: composeEventHandlers(onTouchStart, setIntent)
  }];
}
var NavLink2 = /* @__PURE__ */ React2.forwardRef(({
  to,
  prefetch = "none",
  ...props
}, forwardedRef) => {
  let href = useHref(to), [shouldPrefetch, prefetchHandlers] = usePrefetchBehavior(prefetch, props);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(NavLink, _extends3({
    ref: forwardedRef,
    to
  }, props, prefetchHandlers)), shouldPrefetch ? /* @__PURE__ */ React2.createElement(PrefetchPageLinks, {
    page: href
  }) : null);
});
NavLink2.displayName = "NavLink";
var Link2 = /* @__PURE__ */ React2.forwardRef(({
  to,
  prefetch = "none",
  ...props
}, forwardedRef) => {
  let href = useHref(to), [shouldPrefetch, prefetchHandlers] = usePrefetchBehavior(prefetch, props);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Link, _extends3({
    ref: forwardedRef,
    to
  }, props, prefetchHandlers)), shouldPrefetch ? /* @__PURE__ */ React2.createElement(PrefetchPageLinks, {
    page: href
  }) : null);
});
Link2.displayName = "Link";
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event), event.defaultPrevented || ourHandler(event);
  };
}
function Links() {
  let {
    matches,
    routeModules,
    manifest
  } = useRemixEntryContext(), links2 = React2.useMemo(() => getLinksForMatches(matches, routeModules, manifest), [matches, routeModules, manifest]);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, links2.map((link) => isPageLinkDescriptor(link) ? /* @__PURE__ */ React2.createElement(PrefetchPageLinks, _extends3({
    key: link.page
  }, link)) : /* @__PURE__ */ React2.createElement("link", _extends3({
    key: link.rel + link.href
  }, link))));
}
function PrefetchPageLinks({
  page,
  ...dataLinkProps
}) {
  let {
    clientRoutes
  } = useRemixEntryContext(), matches = React2.useMemo(() => matchClientRoutes(clientRoutes, page), [clientRoutes, page]);
  return matches ? /* @__PURE__ */ React2.createElement(PrefetchPageLinksImpl, _extends3({
    page,
    matches
  }, dataLinkProps)) : (console.warn(`Tried to prefetch ${page} but no routes matched.`), null);
}
function usePrefetchedStylesheets(matches) {
  let {
    routeModules
  } = useRemixEntryContext(), [styleLinks, setStyleLinks] = React2.useState([]);
  return React2.useEffect(() => {
    let interrupted = !1;
    return getStylesheetPrefetchLinks(matches, routeModules).then((links2) => {
      interrupted || setStyleLinks(links2);
    }), () => {
      interrupted = !0;
    };
  }, [matches, routeModules]), styleLinks;
}
function PrefetchPageLinksImpl({
  page,
  matches: nextMatches,
  ...linkProps
}) {
  let location2 = useLocation(), {
    matches,
    manifest
  } = useRemixEntryContext(), newMatchesForData = React2.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, location2, "data"), [page, nextMatches, matches, location2]), newMatchesForAssets = React2.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, location2, "assets"), [page, nextMatches, matches, location2]), dataHrefs = React2.useMemo(() => getDataLinkHrefs(page, newMatchesForData, manifest), [newMatchesForData, page, manifest]), moduleHrefs = React2.useMemo(() => getModuleLinkHrefs(newMatchesForAssets, manifest), [newMatchesForAssets, manifest]), styleLinks = usePrefetchedStylesheets(newMatchesForAssets);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ React2.createElement("link", _extends3({
    key: href,
    rel: "prefetch",
    as: "fetch",
    href
  }, linkProps))), moduleHrefs.map((href) => /* @__PURE__ */ React2.createElement("link", _extends3({
    key: href,
    rel: "modulepreload",
    href
  }, linkProps))), styleLinks.map((link) => /* @__PURE__ */ React2.createElement("link", _extends3({
    key: link.href
  }, link))));
}
function Meta() {
  let {
    matches,
    routeData,
    routeModules
  } = useRemixEntryContext(), location2 = useLocation(), meta2 = {}, parentsData = {};
  for (let match of matches) {
    let routeId = match.route.id, data = routeData[routeId], params = match.params, routeModule = routeModules[routeId];
    if (routeModule.meta) {
      let routeMeta = typeof routeModule.meta == "function" ? routeModule.meta({
        data,
        parentsData,
        params,
        location: location2
      }) : routeModule.meta;
      Object.assign(meta2, routeMeta);
    }
    parentsData[routeId] = data;
  }
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, Object.entries(meta2).map(([name, value]) => {
    if (!value)
      return null;
    if (["charset", "charSet"].includes(name))
      return /* @__PURE__ */ React2.createElement("meta", {
        key: "charset",
        charSet: value
      });
    if (name === "title")
      return /* @__PURE__ */ React2.createElement("title", {
        key: "title"
      }, value);
    let isOpenGraphTag = name.startsWith("og:");
    return [value].flat().map((content) => isOpenGraphTag ? /* @__PURE__ */ React2.createElement("meta", {
      content,
      key: name + content,
      property: name
    }) : typeof content == "string" ? /* @__PURE__ */ React2.createElement("meta", {
      content,
      name,
      key: name + content
    }) : /* @__PURE__ */ React2.createElement("meta", _extends3({
      key: name + JSON.stringify(content)
    }, content)));
  }));
}
var isHydrated = !1;
function Scripts(props) {
  let {
    manifest,
    matches,
    pendingLocation,
    clientRoutes,
    serverHandoffString
  } = useRemixEntryContext();
  React2.useEffect(() => {
    isHydrated = !0;
  }, []);
  let initialScripts = React2.useMemo(() => {
    let contextScript = serverHandoffString ? `window.__remixContext = ${serverHandoffString};` : "", routeModulesScript = `${matches.map((match, index) => `import * as route${index} from ${JSON.stringify(manifest.routes[match.route.id].module)};`).join(`
`)}
window.__remixRouteModules = {${matches.map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`).join(",")}};`;
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("script", _extends3({}, props, {
      suppressHydrationWarning: !0,
      dangerouslySetInnerHTML: createHtml(contextScript)
    })), /* @__PURE__ */ React2.createElement("script", _extends3({}, props, {
      src: manifest.url
    })), /* @__PURE__ */ React2.createElement("script", _extends3({}, props, {
      dangerouslySetInnerHTML: createHtml(routeModulesScript),
      type: "module"
    })), /* @__PURE__ */ React2.createElement("script", _extends3({}, props, {
      src: manifest.entry.module,
      type: "module"
    })));
  }, []), nextMatches = React2.useMemo(() => {
    if (pendingLocation) {
      let matches2 = matchClientRoutes(clientRoutes, pendingLocation);
      return invariant2(matches2, `No routes match path "${pendingLocation.pathname}"`), matches2;
    }
    return [];
  }, [pendingLocation, clientRoutes]), routePreloads = matches.concat(nextMatches).map((match) => {
    let route = manifest.routes[match.route.id];
    return (route.imports || []).concat([route.module]);
  }).flat(1), preloads = manifest.entry.imports.concat(routePreloads);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, dedupe2(preloads).map((path) => /* @__PURE__ */ React2.createElement("link", {
    key: path,
    rel: "modulepreload",
    href: path,
    crossOrigin: props.crossOrigin
  })), isHydrated ? null : initialScripts);
}
function dedupe2(array) {
  return [...new Set(array)];
}
var Form = /* @__PURE__ */ React2.forwardRef((props, ref) => /* @__PURE__ */ React2.createElement(FormImpl, _extends3({}, props, {
  ref
})));
Form.displayName = "Form";
var FormImpl = /* @__PURE__ */ React2.forwardRef(({
  reloadDocument = !1,
  replace = !1,
  method = "get",
  action = ".",
  encType = "application/x-www-form-urlencoded",
  fetchKey,
  onSubmit,
  ...props
}, forwardedRef) => {
  let submit = useSubmitImpl(fetchKey), formMethod = method.toLowerCase() === "get" ? "get" : "post", formAction = useFormAction(action), formRef = React2.useRef(), ref = useComposedRefs(forwardedRef, formRef), clickedButtonRef = React2.useRef();
  return React2.useEffect(() => {
    let form = formRef.current;
    if (!form)
      return;
    function handleClick(event) {
      if (!(event.target instanceof Element))
        return;
      let submitButton = event.target.closest("button,input[type=submit]");
      submitButton && submitButton.form === form && submitButton.type === "submit" && (clickedButtonRef.current = submitButton);
    }
    return window.addEventListener("click", handleClick), () => {
      window.removeEventListener("click", handleClick);
    };
  }, []), /* @__PURE__ */ React2.createElement("form", _extends3({
    ref,
    method: formMethod,
    action: formAction,
    encType,
    onSubmit: reloadDocument ? void 0 : (event) => {
      onSubmit && onSubmit(event), !event.defaultPrevented && (event.preventDefault(), submit(clickedButtonRef.current || event.currentTarget, {
        method,
        replace
      }), clickedButtonRef.current = null);
    }
  }, props));
});
FormImpl.displayName = "FormImpl";
function useFormAction(action = ".", method = "get") {
  let {
    id
  } = useRemixRouteContext(), path = useResolvedPath(action), search = path.search, isIndexRoute = id.endsWith("/index");
  return action === "." && isIndexRoute && (search = search ? search.replace(/^\?/, "?index&") : "?index"), path.pathname + search;
}
var defaultMethod = "get", defaultEncType = "application/x-www-form-urlencoded";
function useSubmitImpl(key) {
  let navigate = useNavigate(), defaultAction = useFormAction(), {
    transitionManager
  } = useRemixEntryContext();
  return React2.useCallback((target, options = {}) => {
    let method, action, encType, formData;
    if (isFormElement(target)) {
      let submissionTrigger = options.submissionTrigger;
      method = options.method || target.getAttribute("method") || defaultMethod, action = options.action || target.getAttribute("action") || defaultAction, encType = options.encType || target.getAttribute("enctype") || defaultEncType, formData = new FormData(target), submissionTrigger && submissionTrigger.name && formData.append(submissionTrigger.name, submissionTrigger.value);
    } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
      let form = target.form;
      if (form == null)
        throw new Error("Cannot submit a <button> without a <form>");
      method = options.method || target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod, action = options.action || target.getAttribute("formaction") || form.getAttribute("action") || defaultAction, encType = options.encType || target.getAttribute("formenctype") || form.getAttribute("enctype") || defaultEncType, formData = new FormData(form), target.name && formData.set(target.name, target.value);
    } else {
      if (isHtmlElement(target))
        throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
      if (method = options.method || "get", action = options.action || defaultAction, encType = options.encType || "application/x-www-form-urlencoded", target instanceof FormData)
        formData = target;
      else if (formData = new FormData(), target instanceof URLSearchParams)
        for (let [name, value] of target)
          formData.append(name, value);
      else if (target != null)
        for (let name of Object.keys(target))
          formData.append(name, target[name]);
    }
    if (typeof document > "u")
      throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
    let {
      protocol,
      host
    } = window.location, url = new URL(action, `${protocol}//${host}`);
    if (method.toLowerCase() === "get")
      for (let [name, value] of formData)
        if (typeof value == "string")
          url.searchParams.append(name, value);
        else
          throw new Error("Cannot submit binary form data using GET");
    let submission = {
      formData,
      action: url.pathname + url.search,
      method: method.toUpperCase(),
      encType,
      key: Math.random().toString(36).substr(2, 8)
    };
    key ? transitionManager.send({
      type: "fetcher",
      href: submission.action,
      submission,
      key
    }) : (setNextNavigationSubmission(submission), navigate(url.pathname + url.search, {
      replace: options.replace
    }));
  }, [defaultAction, key, navigate, transitionManager]);
}
var nextNavigationSubmission;
function setNextNavigationSubmission(submission) {
  nextNavigationSubmission = submission;
}
function consumeNextNavigationSubmission() {
  let submission = nextNavigationSubmission;
  return nextNavigationSubmission = void 0, submission;
}
function isHtmlElement(object) {
  return object != null && typeof object.tagName == "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function useBeforeUnload(callback) {
  React2.useEffect(() => (window.addEventListener("beforeunload", callback), () => {
    window.removeEventListener("beforeunload", callback);
  }), [callback]);
}
function useTransition() {
  let {
    transitionManager
  } = useRemixEntryContext();
  return transitionManager.getState().transition;
}
var LiveReload = function({
  port = Number(8002)
}) {
  let setupLiveReload = ((port2) => {
    let protocol = location.protocol === "https:" ? "wss:" : "ws:", host = location.hostname, socketPath = `${protocol}//${host}:${port2}/socket`, ws = new WebSocket(socketPath);
    ws.onmessage = (message) => {
      let event = JSON.parse(message.data);
      event.type === "LOG" && console.log(event.message), event.type === "RELOAD" && (console.log("\u{1F4BF} Reloading window ..."), window.location.reload());
    }, ws.onerror = (error) => {
      console.log("Remix dev asset server web socket error:"), console.error(error);
    };
  }).toString();
  return /* @__PURE__ */ React2.createElement("script", {
    suppressHydrationWarning: !0,
    dangerouslySetInnerHTML: {
      __html: `(${setupLiveReload})(${JSON.stringify(port)})`
    }
  });
};
function useComposedRefs(...refs) {
  return React2.useCallback((node) => {
    for (let ref of refs)
      if (ref != null)
        if (typeof ref == "function")
          ref(node);
        else
          try {
            ref.current = node;
          } catch {
          }
  }, refs);
}

// node_modules/@remix-run/react/esm/index.js
init_react_router_dom();

// node_modules/@remix-run/react/esm/scroll-restoration.js
var React3 = __toESM(require_react());
init_react_router_dom();
var STORAGE_KEY = "positions", positions = {};
if (typeof document < "u") {
  let sessionPositions = sessionStorage.getItem(STORAGE_KEY);
  sessionPositions && (positions = JSON.parse(sessionPositions));
}
function ScrollRestoration() {
  useScrollRestoration(), React3.useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []), useBeforeUnload(React3.useCallback(() => {
    window.history.scrollRestoration = "auto";
  }, []));
  let restoreScroll = ((STORAGE_KEY2) => {
    if (!window.history.state || !window.history.state.key) {
      let key = Math.random().toString(32).slice(2);
      window.history.replaceState({
        key
      }, "");
    }
    try {
      let storedY = JSON.parse(sessionStorage.getItem(STORAGE_KEY2) || "{}")[window.history.state.key];
      typeof storedY == "number" && window.scrollTo(0, storedY);
    } catch (error) {
      console.error(error), sessionStorage.removeItem(STORAGE_KEY2);
    }
  }).toString();
  return /* @__PURE__ */ React3.createElement("script", {
    suppressHydrationWarning: !0,
    dangerouslySetInnerHTML: {
      __html: `(${restoreScroll})(${JSON.stringify(STORAGE_KEY)})`
    }
  });
}
var hydrated = !1;
function useScrollRestoration() {
  let location2 = useLocation(), transition = useTransition(), wasSubmissionRef = React3.useRef(!1);
  React3.useEffect(() => {
    transition.submission && (wasSubmissionRef.current = !0);
  }, [transition]), React3.useEffect(() => {
    transition.location && (positions[location2.key] = window.scrollY);
  }, [transition, location2]), useBeforeUnload(React3.useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }, [])), typeof document < "u" && React3.useLayoutEffect(() => {
    if (!hydrated) {
      hydrated = !0;
      return;
    }
    let y3 = positions[location2.key];
    if (y3 != null) {
      window.scrollTo(0, y3);
      return;
    }
    if (location2.hash) {
      let el = document.getElementById(location2.hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    if (wasSubmissionRef.current === !0) {
      wasSubmissionRef.current = !1;
      return;
    }
    window.scrollTo(0, 0);
  }, [location2]), React3.useEffect(() => {
    transition.submission && (wasSubmissionRef.current = !0);
  }, [transition]);
}

// node_modules/@remix-run/react/esm/server.js
init_history();
var React4 = __toESM(require_react());
function RemixServer({
  context,
  url
}) {
  typeof url == "string" && (url = new URL(url));
  let location2 = {
    pathname: url.pathname,
    search: url.search,
    hash: "",
    state: null,
    key: "default"
  }, staticNavigator = {
    createHref(to) {
      return typeof to == "string" ? to : createPath(to);
    },
    push(to) {
      throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
    },
    replace(to) {
      throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
    },
    go(delta) {
      throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
    },
    back() {
      throw new Error("You cannot use navigator.back() on the server because it is a stateless environment.");
    },
    forward() {
      throw new Error("You cannot use navigator.forward() on the server because it is a stateless environment.");
    },
    block() {
      throw new Error("You cannot use navigator.block() on the server because it is a stateless environment.");
    }
  };
  return /* @__PURE__ */ React4.createElement(RemixEntry, {
    context,
    action: Action.Pop,
    location: location2,
    navigator: staticNavigator,
    static: !0
  });
}

// node_modules/@nextui-org/react/esm/utils/prop-types.js
var tuple = (...e10) => e10;
tuple("xs", "sm", "md", "lg", "xl");
var normalColors = tuple("default", "primary", "secondary", "success", "warning", "error", "gradient"), simpleColors = tuple("default", "primary", "secondary", "success", "warning", "error"), extendedColors = tuple("default", "primary", "secondary", "success", "warning", "error", "invert", "gradient"), extendedColorsNoGradient = tuple("default", "primary", "secondary", "success", "warning", "error", "invert"), extraColors = tuple("default", "primary", "secondary", "success", "warning", "error", "dark", "lite", "alert", "purple", "violet", "gradient", "cyan"), normalLoaders = tuple("default", "points", "points-opacity", "gradient", "spinner"), normalWeights = tuple("light", "normal", "bold", "extrabold", "black"), textWeights = tuple("normal", "bold", "lighter", "bolder", "inherit", "initial", "revert", "unset"), textTransforms = tuple("none", "capitalize", "uppercase", "lowercase", "full-width", "full-size-kana", "inherit", "initial", "revert", "unset");
tuple("default", "slient", "prevent"), tuple("hover", "click"), tuple("top", "topStart", "topEnd", "left", "leftStart", "leftEnd", "bottom", "bottomStart", "bottomEnd", "right", "rightStart", "rightEnd"), tuple("static", "relative", "absolute", "fixed", "sticky", "inherit", "initial", "revert", "unset"), tuple("contain", "cover", "fill", "none", "scale-down", "inherit", "initial", "revert", "unset"), tuple("start", "center", "end", "left", "right"), tuple("flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"), tuple("flex-start", "flex-end", "center", "stretch", "baseline"), tuple("stretch", "center", "flex-start", "flex-end", "space-between", "space-around"), tuple("row", "row-reverse", "column", "column-reverse"), tuple("nowrap", "wrap", "wrap-reverse"), tuple("flex", "block", "grid", "inline", "inline-block", "inline-flex", "inline-grid"), tuple("left", "right"), tuple("start", "center", "end");
var excludedInputPropsForTextarea = tuple("clearable", "as", "rounded", "labelLeft", "labelRight", "contentLeft", "contentRight", "contentClickable", "contentLeftStyling", "contentRightStyling", "onContentClick", "onClearClick", "css"), excludedTableProps = tuple("items", "disabledKeys", "allowDuplicateSelectionEvents", "disallowEmptySelection", "defaultSelectedKeys", "sortDescriptor", "onSortChange");
tuple("toggle", "replace"), tuple("none", "single", "multiple");

// node_modules/@nextui-org/react/esm/theme/theme-context.js
var import_react8 = __toESM(require_react());

// node_modules/@stitches/react/dist/index.mjs
var import_react5 = __toESM(require_react(), 1), e = "colors", t = "sizes", r = "space", n = { gap: r, gridGap: r, columnGap: r, gridColumnGap: r, rowGap: r, gridRowGap: r, inset: r, insetBlock: r, insetBlockEnd: r, insetBlockStart: r, insetInline: r, insetInlineEnd: r, insetInlineStart: r, margin: r, marginTop: r, marginRight: r, marginBottom: r, marginLeft: r, marginBlock: r, marginBlockEnd: r, marginBlockStart: r, marginInline: r, marginInlineEnd: r, marginInlineStart: r, padding: r, paddingTop: r, paddingRight: r, paddingBottom: r, paddingLeft: r, paddingBlock: r, paddingBlockEnd: r, paddingBlockStart: r, paddingInline: r, paddingInlineEnd: r, paddingInlineStart: r, top: r, right: r, bottom: r, left: r, scrollMargin: r, scrollMarginTop: r, scrollMarginRight: r, scrollMarginBottom: r, scrollMarginLeft: r, scrollMarginX: r, scrollMarginY: r, scrollMarginBlock: r, scrollMarginBlockEnd: r, scrollMarginBlockStart: r, scrollMarginInline: r, scrollMarginInlineEnd: r, scrollMarginInlineStart: r, scrollPadding: r, scrollPaddingTop: r, scrollPaddingRight: r, scrollPaddingBottom: r, scrollPaddingLeft: r, scrollPaddingX: r, scrollPaddingY: r, scrollPaddingBlock: r, scrollPaddingBlockEnd: r, scrollPaddingBlockStart: r, scrollPaddingInline: r, scrollPaddingInlineEnd: r, scrollPaddingInlineStart: r, fontSize: "fontSizes", background: e, backgroundColor: e, backgroundImage: e, borderImage: e, border: e, borderBlock: e, borderBlockEnd: e, borderBlockStart: e, borderBottom: e, borderBottomColor: e, borderColor: e, borderInline: e, borderInlineEnd: e, borderInlineStart: e, borderLeft: e, borderLeftColor: e, borderRight: e, borderRightColor: e, borderTop: e, borderTopColor: e, caretColor: e, color: e, columnRuleColor: e, fill: e, outline: e, outlineColor: e, stroke: e, textDecorationColor: e, fontFamily: "fonts", fontWeight: "fontWeights", lineHeight: "lineHeights", letterSpacing: "letterSpacings", blockSize: t, minBlockSize: t, maxBlockSize: t, inlineSize: t, minInlineSize: t, maxInlineSize: t, width: t, minWidth: t, maxWidth: t, height: t, minHeight: t, maxHeight: t, flexBasis: t, gridTemplateColumns: t, gridTemplateRows: t, borderWidth: "borderWidths", borderTopWidth: "borderWidths", borderRightWidth: "borderWidths", borderBottomWidth: "borderWidths", borderLeftWidth: "borderWidths", borderStyle: "borderStyles", borderTopStyle: "borderStyles", borderRightStyle: "borderStyles", borderBottomStyle: "borderStyles", borderLeftStyle: "borderStyles", borderRadius: "radii", borderTopLeftRadius: "radii", borderTopRightRadius: "radii", borderBottomRightRadius: "radii", borderBottomLeftRadius: "radii", boxShadow: "shadows", textShadow: "shadows", transition: "transitions", zIndex: "zIndices" }, i = (e10, t13) => typeof t13 == "function" ? { "()": Function.prototype.toString.call(t13) } : t13, o = () => {
  let e10 = /* @__PURE__ */ Object.create(null);
  return (t13, r8, ...n6) => {
    let o11 = ((e11) => JSON.stringify(e11, i))(t13);
    return o11 in e10 ? e10[o11] : e10[o11] = r8(t13, ...n6);
  };
}, l = Symbol.for("sxs.internal"), s = (e10, t13) => Object.defineProperties(e10, Object.getOwnPropertyDescriptors(t13)), a = (e10) => {
  for (let t13 in e10)
    return !0;
  return !1;
}, { hasOwnProperty: c } = Object.prototype, d = (e10) => e10.includes("-") ? e10 : e10.replace(/[A-Z]/g, (e11) => "-" + e11.toLowerCase()), g = /\s+(?![^()]*\))/, p = (e10) => (t13) => e10(...typeof t13 == "string" ? String(t13).split(g) : [t13]), u = { appearance: (e10) => ({ WebkitAppearance: e10, appearance: e10 }), backfaceVisibility: (e10) => ({ WebkitBackfaceVisibility: e10, backfaceVisibility: e10 }), backdropFilter: (e10) => ({ WebkitBackdropFilter: e10, backdropFilter: e10 }), backgroundClip: (e10) => ({ WebkitBackgroundClip: e10, backgroundClip: e10 }), boxDecorationBreak: (e10) => ({ WebkitBoxDecorationBreak: e10, boxDecorationBreak: e10 }), clipPath: (e10) => ({ WebkitClipPath: e10, clipPath: e10 }), content: (e10) => ({ content: e10.includes('"') || e10.includes("'") || /^([A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(e10) ? e10 : `"${e10}"` }), hyphens: (e10) => ({ WebkitHyphens: e10, hyphens: e10 }), maskImage: (e10) => ({ WebkitMaskImage: e10, maskImage: e10 }), maskSize: (e10) => ({ WebkitMaskSize: e10, maskSize: e10 }), tabSize: (e10) => ({ MozTabSize: e10, tabSize: e10 }), textSizeAdjust: (e10) => ({ WebkitTextSizeAdjust: e10, textSizeAdjust: e10 }), userSelect: (e10) => ({ WebkitUserSelect: e10, userSelect: e10 }), marginBlock: p((e10, t13) => ({ marginBlockStart: e10, marginBlockEnd: t13 || e10 })), marginInline: p((e10, t13) => ({ marginInlineStart: e10, marginInlineEnd: t13 || e10 })), maxSize: p((e10, t13) => ({ maxBlockSize: e10, maxInlineSize: t13 || e10 })), minSize: p((e10, t13) => ({ minBlockSize: e10, minInlineSize: t13 || e10 })), paddingBlock: p((e10, t13) => ({ paddingBlockStart: e10, paddingBlockEnd: t13 || e10 })), paddingInline: p((e10, t13) => ({ paddingInlineStart: e10, paddingInlineEnd: t13 || e10 })) }, h = /([\d.]+)([^]*)/, f = (e10, t13) => e10.length ? e10.reduce((e11, r8) => (e11.push(...t13.map((e12) => e12.includes("&") ? e12.replace(/&/g, /[ +>|~]/.test(r8) && /&.*&/.test(e12) ? `:is(${r8})` : r8) : r8 + " " + e12)), e11), []) : t13, m = (e10, t13) => e10 in b && typeof t13 == "string" ? t13.replace(/^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/, (t14, r8, n6, i5) => r8 + (n6 === "stretch" ? `-moz-available${i5};${d(e10)}:${r8}-webkit-fill-available` : `-moz-fit-content${i5};${d(e10)}:${r8}fit-content`) + i5) : String(t13), b = { blockSize: 1, height: 1, inlineSize: 1, maxBlockSize: 1, maxHeight: 1, maxInlineSize: 1, maxWidth: 1, minBlockSize: 1, minHeight: 1, minInlineSize: 1, minWidth: 1, width: 1 }, S = (e10) => e10 ? e10 + "-" : "", k = (e10, t13, r8) => e10.replace(/([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g, (e11, n6, i5, o11, l4) => o11 == "$" == !!i5 ? e11 : (n6 || o11 == "--" ? "calc(" : "") + "var(--" + (o11 === "$" ? S(t13) + (l4.includes("$") ? "" : S(r8)) + l4.replace(/\$/g, "-") : l4) + ")" + (n6 || o11 == "--" ? "*" + (n6 || "") + (i5 || "1") + ")" : "")), y = /\s*,\s*(?![^()]*\))/, B = Object.prototype.toString, $ = (e10, t13, r8, n6, i5) => {
  let o11, l4, s6, a4 = (e11, t14, r9) => {
    let c4, g2, p2 = (e12) => {
      for (c4 in e12) {
        let R2 = c4.charCodeAt(0) === 64, z2 = R2 && Array.isArray(e12[c4]) ? e12[c4] : [e12[c4]];
        for (g2 of z2) {
          let e13 = /[A-Z]/.test($2 = c4) ? $2 : $2.replace(/-[^]/g, (e14) => e14[1].toUpperCase()), z3 = typeof g2 == "object" && g2 && g2.toString === B && (!n6.utils[e13] || !t14.length);
          if (e13 in n6.utils && !z3) {
            let t15 = n6.utils[e13];
            if (t15 !== l4) {
              l4 = t15, p2(t15(g2)), l4 = null;
              continue;
            }
          } else if (e13 in u) {
            let t15 = u[e13];
            if (t15 !== s6) {
              s6 = t15, p2(t15(g2)), s6 = null;
              continue;
            }
          }
          if (R2 && (b3 = c4.slice(1) in n6.media ? "@media " + n6.media[c4.slice(1)] : c4, c4 = b3.replace(/\(\s*([\w-]+)\s*(=|<|<=|>|>=)\s*([\w-]+)\s*(?:(<|<=|>|>=)\s*([\w-]+)\s*)?\)/g, (e14, t15, r10, n7, i6, o12) => {
            let l5 = h.test(t15), s7 = 0.0625 * (l5 ? -1 : 1), [a5, c5] = l5 ? [n7, t15] : [t15, n7];
            return "(" + (r10[0] === "=" ? "" : r10[0] === ">" === l5 ? "max-" : "min-") + a5 + ":" + (r10[0] !== "=" && r10.length === 1 ? c5.replace(h, (e15, t16, n8) => Number(t16) + s7 * (r10 === ">" ? 1 : -1) + n8) : c5) + (i6 ? ") and (" + (i6[0] === ">" ? "min-" : "max-") + a5 + ":" + (i6.length === 1 ? o12.replace(h, (e15, t16, r11) => Number(t16) + s7 * (i6 === ">" ? -1 : 1) + r11) : o12) : "") + ")";
          })), z3) {
            let e14 = R2 ? r9.concat(c4) : [...r9], n7 = R2 ? [...t14] : f(t14, c4.split(y));
            o11 !== void 0 && i5(x(...o11)), o11 = void 0, a4(g2, n7, e14);
          } else
            o11 === void 0 && (o11 = [[], t14, r9]), c4 = R2 || c4.charCodeAt(0) !== 36 ? c4 : `--${S(n6.prefix)}${c4.slice(1).replace(/\$/g, "-")}`, g2 = z3 ? g2 : typeof g2 == "number" ? g2 && e13 in I ? String(g2) + "px" : String(g2) : k(m(e13, g2 ?? ""), n6.prefix, n6.themeMap[e13]), o11[0].push(`${R2 ? `${c4} ` : `${d(c4)}:`}${g2}`);
        }
      }
      var b3, $2;
    };
    p2(e11), o11 !== void 0 && i5(x(...o11)), o11 = void 0;
  };
  a4(e10, t13, r8);
}, x = (e10, t13, r8) => `${r8.map((e11) => `${e11}{`).join("")}${t13.length ? `${t13.join(",")}{` : ""}${e10.join(";")}${t13.length ? "}" : ""}${Array(r8.length ? r8.length + 1 : 0).join("}")}`, I = { animationDelay: 1, animationDuration: 1, backgroundSize: 1, blockSize: 1, border: 1, borderBlock: 1, borderBlockEnd: 1, borderBlockEndWidth: 1, borderBlockStart: 1, borderBlockStartWidth: 1, borderBlockWidth: 1, borderBottom: 1, borderBottomLeftRadius: 1, borderBottomRightRadius: 1, borderBottomWidth: 1, borderEndEndRadius: 1, borderEndStartRadius: 1, borderInlineEnd: 1, borderInlineEndWidth: 1, borderInlineStart: 1, borderInlineStartWidth: 1, borderInlineWidth: 1, borderLeft: 1, borderLeftWidth: 1, borderRadius: 1, borderRight: 1, borderRightWidth: 1, borderSpacing: 1, borderStartEndRadius: 1, borderStartStartRadius: 1, borderTop: 1, borderTopLeftRadius: 1, borderTopRightRadius: 1, borderTopWidth: 1, borderWidth: 1, bottom: 1, columnGap: 1, columnRule: 1, columnRuleWidth: 1, columnWidth: 1, containIntrinsicSize: 1, flexBasis: 1, fontSize: 1, gap: 1, gridAutoColumns: 1, gridAutoRows: 1, gridTemplateColumns: 1, gridTemplateRows: 1, height: 1, inlineSize: 1, inset: 1, insetBlock: 1, insetBlockEnd: 1, insetBlockStart: 1, insetInline: 1, insetInlineEnd: 1, insetInlineStart: 1, left: 1, letterSpacing: 1, margin: 1, marginBlock: 1, marginBlockEnd: 1, marginBlockStart: 1, marginBottom: 1, marginInline: 1, marginInlineEnd: 1, marginInlineStart: 1, marginLeft: 1, marginRight: 1, marginTop: 1, maxBlockSize: 1, maxHeight: 1, maxInlineSize: 1, maxWidth: 1, minBlockSize: 1, minHeight: 1, minInlineSize: 1, minWidth: 1, offsetDistance: 1, offsetRotate: 1, outline: 1, outlineOffset: 1, outlineWidth: 1, overflowClipMargin: 1, padding: 1, paddingBlock: 1, paddingBlockEnd: 1, paddingBlockStart: 1, paddingBottom: 1, paddingInline: 1, paddingInlineEnd: 1, paddingInlineStart: 1, paddingLeft: 1, paddingRight: 1, paddingTop: 1, perspective: 1, right: 1, rowGap: 1, scrollMargin: 1, scrollMarginBlock: 1, scrollMarginBlockEnd: 1, scrollMarginBlockStart: 1, scrollMarginBottom: 1, scrollMarginInline: 1, scrollMarginInlineEnd: 1, scrollMarginInlineStart: 1, scrollMarginLeft: 1, scrollMarginRight: 1, scrollMarginTop: 1, scrollPadding: 1, scrollPaddingBlock: 1, scrollPaddingBlockEnd: 1, scrollPaddingBlockStart: 1, scrollPaddingBottom: 1, scrollPaddingInline: 1, scrollPaddingInlineEnd: 1, scrollPaddingInlineStart: 1, scrollPaddingLeft: 1, scrollPaddingRight: 1, scrollPaddingTop: 1, shapeMargin: 1, textDecoration: 1, textDecorationThickness: 1, textIndent: 1, textUnderlineOffset: 1, top: 1, transitionDelay: 1, transitionDuration: 1, verticalAlign: 1, width: 1, wordSpacing: 1 }, R = (e10) => String.fromCharCode(e10 + (e10 > 25 ? 39 : 97)), z = (e10) => ((e11) => {
  let t13, r8 = "";
  for (t13 = Math.abs(e11); t13 > 52; t13 = t13 / 52 | 0)
    r8 = R(t13 % 52) + r8;
  return R(t13 % 52) + r8;
})(((e11, t13) => {
  let r8 = t13.length;
  for (; r8; )
    e11 = 33 * e11 ^ t13.charCodeAt(--r8);
  return e11;
})(5381, JSON.stringify(e10)) >>> 0), W = ["themed", "global", "styled", "onevar", "resonevar", "allvar", "inline"], j = (e10) => {
  if (e10.href && !e10.href.startsWith(location.origin))
    return !1;
  try {
    return !!e10.cssRules;
  } catch {
    return !1;
  }
}, E = (e10) => {
  let t13, r8 = () => {
    let { cssRules: e11 } = t13.sheet;
    return [].map.call(e11, (r9, n7) => {
      let { cssText: i5 } = r9, o11 = "";
      if (i5.startsWith("--sxs"))
        return "";
      if (e11[n7 - 1] && (o11 = e11[n7 - 1].cssText).startsWith("--sxs")) {
        if (!r9.cssRules.length)
          return "";
        for (let e12 in t13.rules)
          if (t13.rules[e12].group === r9)
            return `--sxs{--sxs:${[...t13.rules[e12].cache].join(" ")}}${i5}`;
        return r9.cssRules.length ? `${o11}${i5}` : "";
      }
      return i5;
    }).join("");
  }, n6 = () => {
    if (t13) {
      let { rules: e11, sheet: r9 } = t13;
      if (!r9.deleteRule) {
        for (; Object(Object(r9.cssRules)[0]).type === 3; )
          r9.cssRules.splice(0, 1);
        r9.cssRules = [];
      }
      for (let t14 in e11)
        delete e11[t14];
    }
    let i5 = Object(e10).styleSheets || [];
    for (let e11 of i5)
      if (j(e11)) {
        for (let i6 = 0, o12 = e11.cssRules; o12[i6]; ++i6) {
          let l5 = Object(o12[i6]);
          if (l5.type !== 1)
            continue;
          let s6 = Object(o12[i6 + 1]);
          if (s6.type !== 4)
            continue;
          ++i6;
          let { cssText: a4 } = l5;
          if (!a4.startsWith("--sxs"))
            continue;
          let c4 = a4.slice(14, -3).trim().split(/\s+/), d3 = W[c4[0]];
          d3 && (t13 || (t13 = { sheet: e11, reset: n6, rules: {}, toString: r8 }), t13.rules[d3] = { group: s6, index: i6, cache: new Set(c4) });
        }
        if (t13)
          break;
      }
    if (!t13) {
      let i6 = (e11, t14) => ({ type: t14, cssRules: [], insertRule(e12, t15) {
        this.cssRules.splice(t15, 0, i6(e12, { import: 3, undefined: 1 }[(e12.toLowerCase().match(/^@([a-z]+)/) || [])[1]] || 4));
      }, get cssText() {
        return e11 === "@media{}" ? `@media{${[].map.call(this.cssRules, (e12) => e12.cssText).join("")}}` : e11;
      } });
      t13 = { sheet: e10 ? (e10.head || e10).appendChild(document.createElement("style")).sheet : i6("", "text/css"), rules: {}, reset: n6, toString: r8 };
    }
    let { sheet: o11, rules: l4 } = t13;
    for (let e11 = W.length - 1; e11 >= 0; --e11) {
      let t14 = W[e11];
      if (!l4[t14]) {
        let r9 = W[e11 + 1], n7 = l4[r9] ? l4[r9].index : o11.cssRules.length;
        o11.insertRule("@media{}", n7), o11.insertRule(`--sxs{--sxs:${e11}}`, n7), l4[t14] = { group: o11.cssRules[n7 + 1], index: n7, cache: /* @__PURE__ */ new Set([e11]) };
      }
      v(l4[t14]);
    }
  };
  return n6(), t13;
}, v = (e10) => {
  let t13 = e10.group, r8 = t13.cssRules.length;
  e10.apply = (e11) => {
    try {
      t13.insertRule(e11, r8), ++r8;
    } catch {
    }
  };
}, T = Symbol(), w = o(), M = (e10, t13) => w(e10, () => (...r8) => {
  let n6 = { type: null, composers: /* @__PURE__ */ new Set() };
  for (let t14 of r8)
    if (t14 != null)
      if (t14[l]) {
        n6.type == null && (n6.type = t14[l].type);
        for (let e11 of t14[l].composers)
          n6.composers.add(e11);
      } else
        t14.constructor !== Object || t14.$$typeof ? n6.type == null && (n6.type = t14) : n6.composers.add(C(t14, e10));
  return n6.type == null && (n6.type = "span"), n6.composers.size || n6.composers.add(["PJLV", {}, [], [], {}, []]), P(e10, n6, t13);
}), C = ({ variants: e10, compoundVariants: t13, defaultVariants: r8, ...n6 }, i5) => {
  let o11 = `${S(i5.prefix)}c-${z(n6)}`, l4 = [], s6 = [], d3 = /* @__PURE__ */ Object.create(null), g2 = [];
  for (let e11 in r8)
    d3[e11] = String(r8[e11]);
  if (typeof e10 == "object" && e10)
    for (let t14 in e10) {
      p2 = d3, u2 = t14, c.call(p2, u2) || (d3[t14] = "undefined");
      let r9 = e10[t14];
      for (let e11 in r9) {
        let n7 = { [t14]: String(e11) };
        String(e11) === "undefined" && g2.push(t14);
        let i6 = r9[e11], o12 = [n7, i6, !a(i6)];
        l4.push(o12);
      }
    }
  var p2, u2;
  if (typeof t13 == "object" && t13)
    for (let e11 of t13) {
      let { css: t14, ...r9 } = e11;
      t14 = typeof t14 == "object" && t14 || {};
      for (let e12 in r9)
        r9[e12] = String(r9[e12]);
      let n7 = [r9, t14, !a(t14)];
      s6.push(n7);
    }
  return [o11, n6, l4, s6, d3, g2];
}, P = (e10, t13, r8) => {
  let [n6, i5, o11, a4] = L(t13.composers), c4 = typeof t13.type == "function" || t13.type.$$typeof ? ((e11) => {
    function t14() {
      for (let r9 = 0; r9 < t14[T].length; r9++) {
        let [n7, i6] = t14[T][r9];
        e11.rules[n7].apply(i6);
      }
      return t14[T] = [], null;
    }
    return t14[T] = [], t14.rules = {}, W.forEach((e12) => t14.rules[e12] = { apply: (r9) => t14[T].push([e12, r9]) }), t14;
  })(r8) : null, d3 = (c4 || r8).rules, g2 = `.${n6}${i5.length > 1 ? `:where(.${i5.slice(1).join(".")})` : ""}`, p2 = (l4) => {
    l4 = typeof l4 == "object" && l4 || A;
    let { css: s6, ...p3 } = l4, u2 = {};
    for (let e11 in o11)
      if (delete p3[e11], e11 in l4) {
        let t14 = l4[e11];
        typeof t14 == "object" && t14 ? u2[e11] = { "@initial": o11[e11], ...t14 } : (t14 = String(t14), u2[e11] = t14 !== "undefined" || a4.has(e11) ? t14 : o11[e11]);
      } else
        u2[e11] = o11[e11];
    let h4 = /* @__PURE__ */ new Set([...i5]);
    for (let [n7, i6, o12, l5] of t13.composers) {
      r8.rules.styled.cache.has(n7) || (r8.rules.styled.cache.add(n7), $(i6, [`.${n7}`], [], e10, (e11) => {
        d3.styled.apply(e11);
      }));
      let t14 = O(o12, u2, e10.media), s7 = O(l5, u2, e10.media, !0);
      for (let i7 of t14)
        if (i7 !== void 0)
          for (let [t15, o13, l6] of i7) {
            let i8 = `${n7}-${z(o13)}-${t15}`;
            h4.add(i8);
            let s8 = (l6 ? r8.rules.resonevar : r8.rules.onevar).cache, a5 = l6 ? d3.resonevar : d3.onevar;
            s8.has(i8) || (s8.add(i8), $(o13, [`.${i8}`], [], e10, (e11) => {
              a5.apply(e11);
            }));
          }
      for (let t15 of s7)
        if (t15 !== void 0)
          for (let [i7, o13] of t15) {
            let t16 = `${n7}-${z(o13)}-${i7}`;
            h4.add(t16), r8.rules.allvar.cache.has(t16) || (r8.rules.allvar.cache.add(t16), $(o13, [`.${t16}`], [], e10, (e11) => {
              d3.allvar.apply(e11);
            }));
          }
    }
    if (typeof s6 == "object" && s6) {
      let t14 = `${n6}-i${z(s6)}-css`;
      h4.add(t14), r8.rules.inline.cache.has(t14) || (r8.rules.inline.cache.add(t14), $(s6, [`.${t14}`], [], e10, (e11) => {
        d3.inline.apply(e11);
      }));
    }
    for (let e11 of String(l4.className || "").trim().split(/\s+/))
      e11 && h4.add(e11);
    let f2 = p3.className = [...h4].join(" ");
    return { type: t13.type, className: f2, selector: g2, props: p3, toString: () => f2, deferredInjector: c4 };
  };
  return s(p2, { className: n6, selector: g2, [l]: t13, toString: () => (r8.rules.styled.cache.has(n6) || p2(), n6) });
}, L = (e10) => {
  let t13 = "", r8 = [], n6 = {}, i5 = [];
  for (let [o11, , , , l4, s6] of e10) {
    t13 === "" && (t13 = o11), r8.push(o11), i5.push(...s6);
    for (let e11 in l4) {
      let t14 = l4[e11];
      (n6[e11] === void 0 || t14 !== "undefined" || s6.includes(t14)) && (n6[e11] = t14);
    }
  }
  return [t13, r8, n6, new Set(i5)];
}, O = (e10, t13, r8, n6) => {
  let i5 = [];
  e:
    for (let [o11, l4, s6] of e10) {
      if (s6)
        continue;
      let e11, a4 = 0, c4 = !1;
      for (e11 in o11) {
        let n7 = o11[e11], i6 = t13[e11];
        if (i6 !== n7) {
          if (typeof i6 != "object" || !i6)
            continue e;
          {
            let e12, t14, o12 = 0;
            for (let l5 in i6) {
              if (n7 === String(i6[l5])) {
                if (l5 !== "@initial") {
                  let e13 = l5.slice(1);
                  (t14 = t14 || []).push(e13 in r8 ? r8[e13] : l5.replace(/^@media ?/, "")), c4 = !0;
                }
                a4 += o12, e12 = !0;
              }
              ++o12;
            }
            if (t14 && t14.length && (l4 = { ["@media " + t14.join(", ")]: l4 }), !e12)
              continue e;
          }
        }
      }
      (i5[a4] = i5[a4] || []).push([n6 ? "cv" : `${e11}-${o11[e11]}`, l4, c4]);
    }
  return i5;
}, A = {}, N = o(), D = (e10, t13) => N(e10, () => (...r8) => {
  let n6 = () => {
    for (let n7 of r8) {
      n7 = typeof n7 == "object" && n7 || {};
      let r9 = z(n7);
      if (!t13.rules.global.cache.has(r9)) {
        if (t13.rules.global.cache.add(r9), "@import" in n7) {
          let e11 = [].indexOf.call(t13.sheet.cssRules, t13.rules.themed.group) - 1;
          for (let r10 of [].concat(n7["@import"]))
            r10 = r10.includes('"') || r10.includes("'") ? r10 : `"${r10}"`, t13.sheet.insertRule(`@import ${r10};`, e11++);
          delete n7["@import"];
        }
        $(n7, [], [], e10, (e11) => {
          t13.rules.global.apply(e11);
        });
      }
    }
    return "";
  };
  return s(n6, { toString: n6 });
}), H = o(), V = (e10, t13) => H(e10, () => (r8) => {
  let n6 = `${S(e10.prefix)}k-${z(r8)}`, i5 = () => {
    if (!t13.rules.global.cache.has(n6)) {
      t13.rules.global.cache.add(n6);
      let i6 = [];
      $(r8, [], [], e10, (e11) => i6.push(e11));
      let o11 = `@keyframes ${n6}{${i6.join("")}}`;
      t13.rules.global.apply(o11);
    }
    return n6;
  };
  return s(i5, { get name() {
    return i5();
  }, toString: i5 });
}), G = class {
  constructor(e10, t13, r8, n6) {
    this.token = e10 == null ? "" : String(e10), this.value = t13 == null ? "" : String(t13), this.scale = r8 == null ? "" : String(r8), this.prefix = n6 == null ? "" : String(n6);
  }
  get computedValue() {
    return "var(" + this.variable + ")";
  }
  get variable() {
    return "--" + S(this.prefix) + S(this.scale) + this.token;
  }
  toString() {
    return this.computedValue;
  }
}, F = o(), J = (e10, t13) => F(e10, () => (r8, n6) => {
  n6 = typeof r8 == "object" && r8 || Object(n6);
  let i5 = `.${r8 = (r8 = typeof r8 == "string" ? r8 : "") || `${S(e10.prefix)}t-${z(n6)}`}`, o11 = {}, l4 = [];
  for (let t14 in n6) {
    o11[t14] = {};
    for (let r9 in n6[t14]) {
      let i6 = `--${S(e10.prefix)}${t14}-${r9}`, s7 = k(String(n6[t14][r9]), e10.prefix, t14);
      o11[t14][r9] = new G(r9, s7, t14, e10.prefix), l4.push(`${i6}:${s7}`);
    }
  }
  let s6 = () => {
    if (l4.length && !t13.rules.themed.cache.has(r8)) {
      t13.rules.themed.cache.add(r8);
      let i6 = `${n6 === e10.theme ? ":root," : ""}.${r8}{${l4.join(";")}}`;
      t13.rules.themed.apply(i6);
    }
    return r8;
  };
  return { ...o11, get className() {
    return s6();
  }, selector: i5, toString: s6 };
}), U = o();
var Y = o(), q = (e10) => {
  let t13 = ((e11) => {
    let t14 = !1, r8 = U(e11, (e12) => {
      t14 = !0;
      let r9 = "prefix" in (e12 = typeof e12 == "object" && e12 || {}) ? String(e12.prefix) : "", i5 = typeof e12.media == "object" && e12.media || {}, o11 = typeof e12.root == "object" ? e12.root || null : globalThis.document || null, l4 = typeof e12.theme == "object" && e12.theme || {}, s6 = { prefix: r9, media: i5, theme: l4, themeMap: typeof e12.themeMap == "object" && e12.themeMap || { ...n }, utils: typeof e12.utils == "object" && e12.utils || {} }, a4 = E(o11), c4 = { css: M(s6, a4), globalCss: D(s6, a4), keyframes: V(s6, a4), createTheme: J(s6, a4), reset() {
        a4.reset(), c4.theme.toString();
      }, theme: {}, sheet: a4, config: s6, prefix: r9, getCssText: a4.toString, toString: a4.toString };
      return String(c4.theme = c4.createTheme(l4)), c4;
    });
    return t14 || r8.reset(), r8;
  })(e10);
  return t13.styled = (({ config: e11, sheet: t14 }) => Y(e11, () => {
    let r8 = M(e11, t14);
    return (...e12) => {
      let t15 = r8(...e12), n6 = t15[l].type, i5 = import_react5.default.forwardRef((e13, r9) => {
        let i6 = e13 && e13.as || n6, { props: o11, deferredInjector: l4 } = t15(e13);
        return delete o11.as, o11.ref = r9, l4 ? import_react5.default.createElement(import_react5.default.Fragment, null, import_react5.default.createElement(i6, o11), import_react5.default.createElement(l4, null)) : import_react5.default.createElement(i6, o11);
      });
      return i5.className = t15.className, i5.displayName = `Styled.${n6.displayName || n6.name || n6}`, i5.selector = t15.selector, i5.toString = () => t15.selector, i5[l] = t15[l], i5;
    };
  }))(t13), t13;
};

// node_modules/@nextui-org/react/esm/theme/common.js
var defaultTokens = { fonts: { sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI','Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans','Helvetica Neue', sans-serif;", mono: "Menlo, Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono','Courier New', monospace;" }, fontSizes: { tiny: ".75rem", xs: "0.875rem", base: "1rem", sm: "1.25rem", md: "1.5rem", lg: "2.25rem", xl: "3rem" }, fontWeights: { hairline: 100, thin: 200, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 }, lineHeights: { xs: 1, sm: 1.25, md: 1.5, lg: 1.625, xl: 1.75 }, letterSpacings: { tighter: "-0.05em", tight: "-0.025em", normal: "0", wide: "0.025em", wider: "0.05em", widest: "0.1em" }, space: { 0: "0rem", xs: "0.5rem", sm: "0.75rem", md: "1rem", lg: "1.25rem", xl: "2.25rem", px: "1px", 1: "0.125rem", 2: "0.25rem", 3: "0.375rem", 4: "0.5rem", 5: "0.625rem", 6: "0.75rem", 7: "0.875rem", 8: "1rem", 9: "1.25rem", 10: "1.5rem", 11: "1.75rem", 12: "2rem", 13: "2.25rem", 14: "2.5rem", 15: "2.75rem", 16: "3rem", 17: "3.5rem", 18: "4rem", 20: "5rem", 24: "6rem", 28: "7rem", 32: "8rem", 36: "9rem", 40: "10rem", 44: "11rem", 48: "12rem", 52: "13rem", 56: "14rem", 60: "15rem", 64: "16rem", 72: "18rem", 80: "20rem", 96: "24rem" }, radii: { xs: "7px", sm: "9px", md: "12px", base: "14px", lg: "14px", xl: "18px", squared: "33%", rounded: "50%", pill: "9999px" }, zIndices: { 1: "100", 2: "200", 3: "300", 4: "400", 5: "500", 10: "1000", max: "9999" }, borderWeights: { light: "1px", normal: "2px", bold: "3px", extrabold: "4px", black: "5px" }, transitions: { default: "all 250ms ease", button: "background 0.25s ease 0s, color 0.25s ease 0s, border-color 0.25s ease 0s, box-shadow 0.25s ease 0s, transform 0.25s ease 0s, opacity 0.25s ease 0s" }, breakpoints: { xs: "650px", sm: "960px", md: "1280px", lg: "1400px", xl: "1920px" } }, defaultColors = { white: "#ffffff", black: "#000000", blue100: "#bfd8fc", blue200: "#98D5FD", blue300: "#64B8FB", blue400: "#3D9CF7", blue500: "#0070F3", blue600: "#0056D0", blue700: "#0040AE", blue800: "#002D8C", blue900: "#002074", purple100: "#dbc8f0", purple200: "#DDA9F9", purple300: "#C17CEF", purple400: "#A258DF", purple500: "#7928ca", purple600: "#5E1DAD", purple700: "#461491", purple800: "#310C75", purple900: "#220760", green100: "#dafee8", green200: "#A1F9AC", green300: "#6FEE8D", green400: "#4ADE7B", green500: "#17c964", green600: "#10AC63", green700: "#0B905F", green800: "#077457", green900: "#046050", yellow100: "#fce6c7", yellow200: "#FEE7A6", yellow300: "#FCD57A", yellow400: "#F9C258", yellow500: "#f5a623", yellow600: "#D28519", yellow700: "#B06811", yellow800: "#8E4D0B", yellow900: "#753A06", red100: "#fbc4d5", red200: "#FDA0A5", red300: "#FB7085", red400: "#F74C77", red500: "#f21361", red600: "#D00D65", red700: "#AE0963", red800: "#8C065C", red900: "#740357", cyan100: "#EEFFF4", cyan200: "#DDFFED", cyan300: "#CCFFE9", cyan400: "#BFFFEA", cyan500: "#AAFFEC", cyan600: "#7CDBCF", cyan700: "#55B7B4", cyan800: "#368D93", cyan900: "#206C7A", pink100: "#FFDBE7", pink200: "#FFB8D6", pink300: "#FF94CC", pink400: "#FF7ACC", pink500: "#ff4ecd", pink600: "#DB39BD", pink700: "#B727AA", pink800: "#921893", pink900: "#6E0E7A", gray100: "#F4F4F4", gray200: "#EAEAEA", gray300: "#C1C1C1", gray400: "#999999", gray500: "#888888", gray600: "#666666", gray700: "#444444", gray800: "#333333", gray900: "#111111", primaryLight: "$blue100", primary: "$blue500", primaryDark: "$blue600", primaryShadow: "$blue100", secondaryLight: "$purple100", secondary: "$purple500", secondaryDark: "$purple600", secondaryShadow: "$purple100", successLight: "$green100", success: "$green500", successDark: "$green600", successShadow: "$green100", warningLight: "$yellow100", warning: "$yellow500", warningDark: "$yellow600", warningShadow: "$yellow100", errorLight: "$red100", error: "$red500", errorDark: "$red600", errorShadow: "$red100", gradient: "linear-gradient(112deg, $cyan500 -63.59%, $pink500 -20.3%, $blue500 70.46%)", link: "$blue500" }, defaultMedia = { xs: `(min-width: ${defaultTokens.breakpoints.xs})`, sm: `(min-width: ${defaultTokens.breakpoints.sm})`, md: `(min-width: ${defaultTokens.breakpoints.md})`, lg: `(min-width: ${defaultTokens.breakpoints.lg})`, xl: `(min-width: ${defaultTokens.breakpoints.xl})`, xsMax: `(max-width: ${defaultTokens.breakpoints.xs})`, smMax: `(max-width: ${defaultTokens.breakpoints.sm})`, mdMax: `(max-width: ${defaultTokens.breakpoints.md})`, lgMax: `(max-width: ${defaultTokens.breakpoints.lg})`, xlMax: `(max-width: ${defaultTokens.breakpoints.xl})`, motion: "(prefers-reduced-motion)", safari: "not all and (min-resolution:.001dpcm)", hover: "(any-hover: hover)", dark: "(prefers-color-scheme: dark)", light: "(prefers-color-scheme: light)" }, defaultUtils = { p: (e10) => ({ padding: e10 }), pt: (e10) => ({ paddingTop: e10 }), pr: (e10) => ({ paddingRight: e10 }), pb: (e10) => ({ paddingBottom: e10 }), pl: (e10) => ({ paddingLeft: e10 }), px: (e10) => ({ paddingLeft: e10, paddingRight: e10 }), py: (e10) => ({ paddingTop: e10, paddingBottom: e10 }), m: (e10) => ({ margin: e10 }), mt: (e10) => ({ marginTop: e10 }), mr: (e10) => ({ marginRight: e10 }), mb: (e10) => ({ marginBottom: e10 }), ml: (e10) => ({ marginLeft: e10 }), mx: (e10) => ({ marginLeft: e10, marginRight: e10 }), my: (e10) => ({ marginTop: e10, marginBottom: e10 }), ta: (e10) => ({ textAlign: e10 }), tt: (e10) => ({ textTransform: e10 }), to: (e10) => ({ textOverflow: e10 }), d: (e10) => ({ display: e10 }), dflex: (e10) => ({ display: "flex", alignItems: e10, justifyContent: e10 }), fd: (e10) => ({ flexDirection: e10 }), fw: (e10) => ({ flexWrap: e10 }), ai: (e10) => ({ alignItems: e10 }), ac: (e10) => ({ alignContent: e10 }), jc: (e10) => ({ justifyContent: e10 }), as: (e10) => ({ alignSelf: e10 }), fg: (e10) => ({ flexGrow: e10 }), fs: (e10) => ({ fontSize: e10 }), fb: (e10) => ({ flexBasis: e10 }), bc: (e10) => ({ backgroundColor: e10 }), bf: (e10) => ({ backdropFilter: e10 }), bg: (e10) => ({ background: e10 }), bgBlur: (e10) => ({ bf: "saturate(180%) blur(10px)", bg: `${e10}66` }), bgColor: (e10) => ({ backgroundColor: e10 }), backgroundClip: (e10) => ({ WebkitBackgroundClip: e10, backgroundClip: e10 }), bgClip: (e10) => ({ WebkitBackgroundClip: e10, backgroundClip: e10 }), br: (e10) => ({ borderRadius: e10 }), bw: (e10) => ({ borderWidth: e10 }), btrr: (e10) => ({ borderTopRightRadius: e10 }), bbrr: (e10) => ({ borderBottomRightRadius: e10 }), bblr: (e10) => ({ borderBottomLeftRadius: e10 }), btlr: (e10) => ({ borderTopLeftRadius: e10 }), bs: (e10) => ({ boxShadow: e10 }), normalShadow: (e10) => ({ boxShadow: `0 4px 14px 0 $colors${e10}` }), normalShadowVar: (e10) => ({ boxShadow: `0 4px 14px 0 ${e10}` }), lh: (e10) => ({ lineHeight: e10 }), ov: (e10) => ({ overflow: e10 }), ox: (e10) => ({ overflowX: e10 }), oy: (e10) => ({ overflowY: e10 }), pe: (e10) => ({ pointerEvents: e10 }), events: (e10) => ({ pointerEvents: e10 }), us: (e10) => ({ WebkitUserSelect: e10, userSelect: e10 }), userSelect: (e10) => ({ WebkitUserSelect: e10, userSelect: e10 }), w: (e10) => ({ width: e10 }), h: (e10) => ({ height: e10 }), mw: (e10) => ({ maxWidth: e10 }), maxW: (e10) => ({ maxWidth: e10 }), mh: (e10) => ({ maxHeight: e10 }), maxH: (e10) => ({ maxHeight: e10 }), size: (e10) => ({ width: e10, height: e10 }), minSize: (e10) => ({ minWidth: e10, minHeight: e10, width: e10, height: e10 }), sizeMin: (e10) => ({ minWidth: e10, minHeight: e10, width: e10, height: e10 }), maxSize: (e10) => ({ maxWidth: e10, maxHeight: e10 }), sizeMax: (e10) => ({ maxWidth: e10, maxHeight: e10 }), appearance: (e10) => ({ WebkitAppearance: e10, appearance: e10 }), scale: (e10) => ({ transform: `scale(${e10})` }), linearGradient: (e10) => ({ backgroundImage: `linear-gradient(${e10})` }), tdl: (e10) => ({ textDecorationLine: e10 }), textGradient: (e10) => ({ backgroundImage: `linear-gradient(${e10})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", "&::selection": { WebkitTextFillColor: "$colors$text" } }) }, defaultThemeMap = { ...n, width: "space", height: "space", minWidth: "space", maxWidth: "space", minHeight: "space", maxHeight: "space", flexBasis: "space", gridTemplateColumns: "space", gridTemplateRows: "space", blockSize: "space", minBlockSize: "space", maxBlockSize: "space", inlineSize: "space", minInlineSize: "space", maxInlineSize: "space", borderWidth: "borderWeights" }, common_default = { prefix: "nextui", theme: { ...defaultTokens, colors: defaultColors, shadows: {} }, media: defaultMedia, utils: defaultUtils, themeMap: defaultThemeMap };

// node_modules/@nextui-org/react/esm/theme/light-theme.js
var light_theme_default = { colors: { accents1: "$gray100", accents2: "$gray200", accents3: "$gray300", accents4: "$gray400", accents5: "$gray500", accents6: "$gray600", accents7: "$gray700", accents8: "$gray800", accents9: "$gray900", text: "$gray800", background: "$white", foreground: "$black", codeLight: "$pink100", code: "$pink600", border: "$gray200", selection: "$blue200" }, shadows: { xs: "-4px 0 4px rgb(0 0 0 / 5%);", sm: "0 5px 20px -5px rgba(0, 0, 0, 0.1)", md: "0 8px 30px rgba(0, 0, 0, 0.15)", lg: "0 30px 60px rgba(0, 0, 0, 0.15)", xl: "0 40px 80px rgba(0, 0, 0, 0.25)" } };

// node_modules/@nextui-org/react/esm/utils/deep-merge.js
function t2(o11) {
  for (var r8, e10, l4 = Array.prototype.slice.call(arguments, 1); l4.length; )
    for (e10 in r8 = l4.shift())
      r8.hasOwnProperty(e10) && (typeof o11[e10] == "object" && o11[e10] && Object.prototype.toString.call(o11[e10]) !== "[object Array]" && typeof r8[e10] == "object" && r8[e10] !== null ? o11[e10] = t2({}, o11[e10], r8[e10]) : o11[e10] = r8[e10]);
  return o11;
}

// node_modules/@nextui-org/react/esm/theme/stitches.config.js
var c2 = q({ ...common_default, theme: { ...common_default.theme, shadows: { ...light_theme_default.shadows }, colors: { ...common_default.theme.colors, ...light_theme_default.colors } } }), createThemeBase = c2.createTheme, styled = c2.styled, css = c2.css, globalCss = c2.globalCss, keyframes = c2.keyframes, getCssText = c2.getCssText, theme = c2.theme, config2 = c2.config, sharedFocus = css({ WebkitTapHighlightColor: "transparent", "&:focus:not(&:focus-visible)": { boxShadow: "none" }, "&:focus": { outline: "none", boxShadow: "0 0 0 2px $colors$background, 0 0 0 4px $colors$primary" }, "@safari": { WebkitTapHighlightColor: "transparent", outline: "none" } }), cssFocusVisible = css({ variants: { isFocusVisible: { true: { outline: "transparent solid 2px", outlineOffset: "2px", boxShadow: "0 0 0 2px $colors$background, 0 0 0 4px $colors$primary" }, false: { outline: "none" } } } }), sharedVisuallyHidden = css({ border: "0px", clip: "rect(0px, 0px, 0px, 0px)", height: "1px", width: "1px", margin: "-1px", padding: "0px", overflow: "hidden", whiteSpace: "nowrap", position: "absolute" });

// node_modules/@nextui-org/react/esm/theme/theme-context.js
var defaultContext = { isDark: !1, theme, type: "light" }, o2 = import_react8.default.createContext(defaultContext), theme_context_default = o2;

// node_modules/@nextui-org/react/esm/use-ssr/use-ssr.js
var import_react9 = __toESM(require_react()), use_ssr_default = () => {
  let [n6, r8] = (0, import_react9.useState)(!1);
  return (0, import_react9.useEffect)(() => {
    r8(Boolean(typeof window < "u" && window.document && window.document.createElement));
  }, []), { isBrowser: n6, isServer: !n6 };
};

// node_modules/@nextui-org/react/esm/use-ssr/index.js
var use_ssr_default2 = use_ssr_default;

// node_modules/@nextui-org/react/esm/use-warning/use-warning.js
var o4 = {}, use_warning_default = (e10, n6) => {
  let r8 = `[Next UI]${n6 ? ` [${n6}]` : " "}: ${e10}`;
  if (typeof console < "u" && !o4[r8]) {
    return o4[r8] = !0, console.error(r8);
    console.warn(r8);
  }
};

// node_modules/@nextui-org/react/esm/use-warning/index.js
var use_warning_default2 = use_warning_default;

// node_modules/@nextui-org/react/esm/utils/object.js
var isObject2 = (e10) => e10 && typeof e10 == "object";
var copyObject = (e10) => isObject2(e10) ? e10 instanceof Array ? [...e10] : { ...e10 } : e10;

// node_modules/@nextui-org/react/esm/use-drip/use-drip.js
var import_react10 = __toESM(require_react()), use_drip_default = (e10 = !1, n6) => {
  let [r8, o11] = (0, import_react10.useState)(e10), [c4, i5] = (0, import_react10.useState)(0), [l4, u2] = (0, import_react10.useState)(0);
  return { visible: r8, x: c4, y: l4, onClick: (t13) => {
    if (!n6.current)
      return;
    let e11 = n6.current.getBoundingClientRect();
    o11(!0), i5(t13.clientX - e11.left), u2(t13.clientY - e11.top);
  }, onCompleted: () => {
    o11(!1), i5(0), u2(0);
  } };
};

// node_modules/@nextui-org/react/esm/use-drip/index.js
var use_drip_default2 = use_drip_default;

// node_modules/@nextui-org/react/esm/utils/drip.js
var import_react11 = __toESM(require_react());

// node_modules/@nextui-org/react/esm/utils/with-defaults.js
var with_defaults_default = (e10, t13) => (e10.defaultProps = t13, e10);

// node_modules/@nextui-org/react/esm/utils/clsx.js
function r2(e10) {
  var t13, f2, n6 = "";
  if (typeof e10 == "string" || typeof e10 == "number")
    n6 += e10;
  else if (typeof e10 == "object")
    if (Array.isArray(e10))
      for (t13 = 0; t13 < e10.length; t13++)
        e10[t13] && (f2 = r2(e10[t13])) && (n6 && (n6 += " "), n6 += f2);
    else
      for (t13 in e10)
        e10[t13] && (n6 && (n6 += " "), n6 += t13);
  return n6;
}
function clsx_default(...e10) {
  for (var t13, f2, n6 = 0, o11 = ""; n6 < e10.length; )
    (t13 = e10[n6++]) && (f2 = r2(t13)) && (o11 && (o11 += " "), o11 += f2);
  return o11;
}

// node_modules/@nextui-org/react/esm/utils/drip.js
var import_jsx_runtime = __toESM(require_jsx_runtime()), a2 = keyframes({ "0%": { opacity: 0, transform: "scale(0.25)" }, "30%": { opacity: 1 }, "80%": { opacity: 0.5 }, "100%": { transform: "scale(28)", opacity: 0 } }), StyledDrip = styled("div", { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, "& svg": { position: "absolute", animation: `350ms linear ${a2}`, animationFillMode: "forwards", width: "$md", height: "$md" } }), m2 = ({ visible: t13, x: r8, y: o11, color: n6, onCompleted: a4, className: m4, ...c4 }) => {
  let d3 = (0, import_react11.useRef)(null), p2 = Number.isNaN(+o11) ? 0 : o11 - 10, u2 = Number.isNaN(+r8) ? 0 : r8 - 10;
  return (0, import_react11.useEffect)(() => {
    if (d3.current)
      return d3.current.addEventListener("animationend", a4), () => {
        d3.current && d3.current.removeEventListener("animationend", a4);
      };
  }), t13 ? (0, import_jsx_runtime.jsx)(StyledDrip, { ref: d3, className: clsx_default("nextui-drip", m4), ...c4, children: (0, import_jsx_runtime.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 20 20", style: { top: p2, left: u2 }, children: (0, import_jsx_runtime.jsx)("g", { stroke: "none", strokeWidth: "1", fill: "none", fillRule: "evenodd", children: (0, import_jsx_runtime.jsx)("g", { className: "nextui-drip-filler", fill: n6, children: (0, import_jsx_runtime.jsx)("rect", { width: "100%", height: "100%", rx: "10" }) }) }) }) }) : null;
}, c3 = import_react11.default.memo(m2), drip_default = with_defaults_default(c3, { visible: !1, x: 0, y: 0, className: "" });

// node_modules/@nextui-org/react/esm/css-baseline/css-baseline.js
var import_react12 = __toESM(require_react());
var import_jsx_runtime2 = __toESM(require_jsx_runtime()), n2 = globalCss({ "*, *:before, *:after": { boxSizing: "border-box", textRendering: "geometricPrecision", WebkitTapHighlightColor: "transparent" }, html: { fontSize: "$base" }, body: { margin: 0, padding: 0, minHeight: "100%", position: "relative", overflowX: "hidden", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", textRendering: "optimizeLegibility", fontSize: "$base", lineHeight: "$md", fontFamily: "$sans" }, "html, body": { backgroundColor: "$background", color: "$text" }, "p, small": { color: "inherit", letterSpacing: "$tighter", fontWeight: "$normal", fontFamily: "$sans" }, p: { margin: "$md 0", fontSize: "$base", lineHeight: "$lg" }, small: { margin: 0, lineHeight: "$md", fontSize: "$xs" }, b: { fontWeight: "$semibold" }, span: { fontSize: "inherit", color: "inherit", fontWeight: "inherit" }, img: { maxWidth: "100%" }, a: { cursor: "pointer", fontSize: "inherit", WebkitTouchCallout: "none", WebkitTapHighlightColor: "rgba(0, 0, 0, 0)", WebkitBoxAlign: "center", alignItems: "center", color: "$link", textDecoration: "none" }, "a:hover": { textDecoration: "none" }, "ul,ol": { padding: 0, listStyleType: "none", margin: "$sm $sm $sm $lg", color: "$foreground" }, ol: { listStyleType: "decimal" }, li: { marginBottom: "$5", fontSize: "$base", lineHeight: "$lg" }, "h1,h2,h3,h4,h5,h6": { color: "inherit", margin: "0 0 $5 0" }, h1: { letterSpacing: "$tighter", lineHeight: "$md", fontSize: "$xl", fontWeight: "$bold" }, h2: { letterSpacing: "$tighter", fontSize: "$lg", fontWeight: "$semibold" }, h3: { letterSpacing: "$tighter", fontSize: "$md", fontWeight: "$semibold" }, h4: { letterSpacing: "$tighter", fontSize: "$sm", fontWeight: "$semibold" }, h5: { letterSpacing: "$tight", fontSize: "$base", fontWeight: "$semibold" }, h6: { letterSpacing: "$tight", fontSize: "$xs", fontWeight: "$semibold" }, "button, input, select,textarea": { fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit", color: "inherit", margin: 0 }, "button:focus, input:focus, select:focus,textarea:focus": { outline: "none" }, code: { color: "$code", padding: "$1 $2", borderRadius: "$xs", bg: "$codeLight", fontFamily: "$mono", fontSize: "$xs", whiteSpace: "pre-wrap", transition: "opacity 0.25s ease 0s" }, "code:hover": { opacity: 0.8 }, pre: { overflow: "auto", whiteSpace: "pre", textAlign: "left", fontSize: "$xs", borderRadius: "$lg", padding: "$md $lg", margin: "$lg 0 ", fontFamily: "$mono", lineHeight: "$md", webkitOverflowScrolling: "touch" }, "pre code": { color: "$foreground", fontSize: "$xs", lineHeight: "$sm", whiteSpace: "pre" }, "pre code:before,pre code:after": { display: "none" }, "pre p": { margin: 0 }, "pre::-webkit-scrollbar": { display: "none", width: 0, height: 0, background: "transparent" }, hr: { borderColor: "$accents2" }, details: { backgroundColor: "$accents1", border: "none" }, "details:focus, details:hover, details:active": { outline: "none" }, summary: { cursor: "pointer", userSelect: "none", listStyle: "none", outline: "none" }, "summary::-webkit-details-marker, summary::before": { display: "none" }, "summary::-moz-list-bullet": { fontSize: 0 }, "summary:focus, summary:hover, summary:active": { outline: "none", listStyle: "none" }, "::selection": { backgroundColor: "$selection" }, blockquote: { padding: "$md $lg", color: "$accents5", backgroundColor: "$accents1", borderRadius: "$lg", margin: "$10 0" }, "blockquote *:first-child": { marginTop: 0 }, "blockquote *:last-child": { marginBottom: 0 } }), r3 = ({ children: t13 }) => (n2(), (0, import_jsx_runtime2.jsx)(import_react12.default.Fragment, { children: t13 })), l2 = import_react12.default.memo(r3);
l2.flush = () => (0, import_jsx_runtime2.jsx)("style", { id: "stitches", dangerouslySetInnerHTML: { __html: getCssText() } });
var css_baseline_default = l2;

// node_modules/@react-aria/ssr/dist/module.js
var import_react13 = __toESM(require_react());
function $parcel$export(e10, n6, v3, s6) {
  Object.defineProperty(e10, n6, { get: v3, set: s6, enumerable: !0, configurable: !0 });
}
var $9d939cbc98267846$exports = {};
$parcel$export($9d939cbc98267846$exports, "SSRProvider", () => $9d939cbc98267846$export$9f8ac96af4b1b2ae);
$parcel$export($9d939cbc98267846$exports, "useSSRSafeId", () => $9d939cbc98267846$export$619500959fc48b26);
$parcel$export($9d939cbc98267846$exports, "useIsSSR", () => $9d939cbc98267846$export$535bd6ca7f90a273);
var $9d939cbc98267846$var$defaultContext = {
  prefix: String(Math.round(Math.random() * 1e10)),
  current: 0
}, $9d939cbc98267846$var$SSRContext = /* @__PURE__ */ import_react13.default.createContext($9d939cbc98267846$var$defaultContext);
function $9d939cbc98267846$export$9f8ac96af4b1b2ae(props) {
  let cur = (0, import_react13.useContext)($9d939cbc98267846$var$SSRContext), value = (0, import_react13.useMemo)(
    () => ({
      prefix: cur === $9d939cbc98267846$var$defaultContext ? "" : `${cur.prefix}-${++cur.current}`,
      current: 0
    }),
    [
      cur
    ]
  );
  return /* @__PURE__ */ import_react13.default.createElement($9d939cbc98267846$var$SSRContext.Provider, {
    value
  }, props.children);
}
var $9d939cbc98267846$var$canUseDOM = Boolean(typeof window < "u" && window.document && window.document.createElement);
function $9d939cbc98267846$export$619500959fc48b26(defaultId) {
  let ctx = (0, import_react13.useContext)($9d939cbc98267846$var$SSRContext);
  return ctx === $9d939cbc98267846$var$defaultContext && !$9d939cbc98267846$var$canUseDOM && console.warn("When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server."), (0, import_react13.useMemo)(
    () => defaultId || `react-aria${ctx.prefix}-${++ctx.current}`,
    [
      defaultId
    ]
  );
}
function $9d939cbc98267846$export$535bd6ca7f90a273() {
  let isInSSRContext = (0, import_react13.useContext)($9d939cbc98267846$var$SSRContext) !== $9d939cbc98267846$var$defaultContext, [isSSR, setIsSSR] = (0, import_react13.useState)(isInSSRContext);
  return typeof window < "u" && isInSSRContext && (0, import_react13.useLayoutEffect)(() => {
    setIsSSR(!1);
  }, []), isSSR;
}

// node_modules/@nextui-org/react/esm/theme/theme-provider.js
var import_react14 = __toESM(require_react());

// node_modules/@nextui-org/react/esm/theme/utils.js
var getTokenValue = (t13, l4) => {
  if (!document || !t13)
    return "";
  let o11 = getComputedStyle(document.documentElement), r8 = `--${common_default.prefix}-${t13}-${l4}`, n6 = o11.getPropertyValue(r8);
  return n6 && n6.includes("var") && getTokenValue(t13, n6), n6;
}, getDocumentCSSTokens = () => {
  let l4 = [...Object.keys(common_default.theme.colors), ...Object.keys(light_theme_default.colors)], o11 = Object.keys(light_theme_default.shadows);
  return { colors: l4.reduce((t13, l5) => {
    let o12 = getTokenValue("colors", l5);
    return o12 && (t13[l5] = { prefix: common_default.prefix, scale: "colors", token: l5, value: o12 }), t13;
  }, {}), shadows: o11.reduce((t13, l5) => {
    let o12 = getTokenValue("shadows", l5);
    return o12 && (t13[l5] = { prefix: common_default.prefix, scale: "shadows", token: l5, value: o12 }), t13;
  }, {}) };
}, getDocumentTheme = (e10) => {
  var t13;
  let l4 = (e10 == null || (t13 = e10.getAttribute("style")) == null ? void 0 : t13.split(";").map((e11) => e11.trim()).filter((e11) => e11.includes("color-scheme"))) || [], o11 = l4.length > 0 ? l4[0].replace("color-scheme: ", "").replace(";", "") : "";
  return (e10 == null ? void 0 : e10.getAttribute("data-theme")) || o11;
}, getThemeName = (e10) => typeof e10 == "string" && e10 != null && e10.includes("-theme") ? e10 == null ? void 0 : e10.replace("-theme", "") : e10, changeTheme = (e10) => {
  var t13, o11;
  if (!document)
    return;
  let r8 = document.documentElement, n6 = (r8 == null || (t13 = r8.getAttribute("class")) == null ? void 0 : t13.split(" ").filter((e11) => !e11.includes("theme") && !e11.includes("light") && !e11.includes("dark"))) || [], s6 = (r8 == null || (o11 = r8.getAttribute("style")) == null ? void 0 : o11.split(";").filter((e11) => !e11.includes("color-scheme") && e11.length).map((e11) => `${e11};`)) || [];
  r8 == null || r8.setAttribute("class", clsx_default(n6, `${getThemeName(e10)}-theme`)), r8 == null || r8.setAttribute("style", clsx_default(s6, `color-scheme: ${e10};`));
};

// node_modules/@nextui-org/react/esm/theme/theme-provider.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime()), import_jsx_runtime4 = __toESM(require_jsx_runtime()), theme_provider_default = with_defaults_default(({ theme: e10, disableBaseline: n6, children: x3 }) => {
  let { isBrowser: y3 } = use_ssr_default2(), [j2, B2] = (0, import_react14.useState)(defaultContext.type), N3 = (e11) => {
    B2((t13) => t13 !== e11 ? e11 : t13);
  }, g2 = (e11) => {
    let t13 = getDocumentTheme(e11);
    t13 && N3(t13);
  }, w2 = (0, import_react14.useMemo)(() => {
    let e11 = y3 ? getDocumentCSSTokens() : {}, t13 = t2(copyObject(defaultContext.theme), e11), r8 = getThemeName(j2);
    return { theme: t13, type: r8, isDark: r8 === "dark" };
  }, [j2, y3]);
  return (0, import_react14.useEffect)(() => {
    var e11, t13, r8;
    g2((e11 = document) == null ? void 0 : e11.documentElement);
    let o11 = new MutationObserver((e12) => {
      var t14;
      if (e12 && e12.length > 0 && ((t14 = e12[0]) == null ? void 0 : t14.target.nodeName) === "BODY") {
        var r9, o12, s6;
        let e13 = (r9 = document) == null || (o12 = r9.body) == null || (s6 = o12.dataset) == null ? void 0 : s6.theme;
        e13 && N3(e13);
      } else {
        var m4;
        g2((m4 = document) == null ? void 0 : m4.documentElement);
      }
    });
    return o11.observe((t13 = document) == null ? void 0 : t13.documentElement, { attributes: !0, attributeFilter: ["data-theme", "style"] }), o11.observe((r8 = document) == null ? void 0 : r8.body, { attributes: !0, attributeFilter: ["data-theme", "style"] }), () => o11.disconnect();
  }, []), (0, import_react14.useEffect)(() => {
    y3 && e10 && e10 != null && e10.className && (changeTheme(e10.className), N3(getThemeName(e10.className)));
  }, [y3, e10]), (0, import_jsx_runtime3.jsx)($9d939cbc98267846$export$9f8ac96af4b1b2ae, { children: (0, import_jsx_runtime4.jsxs)(theme_context_default.Provider, { value: w2, children: [!n6 && (0, import_jsx_runtime3.jsx)(css_baseline_default, {}), x3] }) });
}, { disableBaseline: !1 });

// node_modules/@nextui-org/react/esm/button/button.js
var import_react25 = __toESM(require_react());

// node_modules/@react-aria/focus/dist/module.js
var import_react18 = __toESM(require_react());

// node_modules/@react-aria/utils/dist/module.js
var import_react16 = __toESM(require_react());

// node_modules/clsx/dist/clsx.m.js
function toVal(mix) {
  var k2, y3, str = "";
  if (typeof mix == "string" || typeof mix == "number")
    str += mix;
  else if (typeof mix == "object")
    if (Array.isArray(mix))
      for (k2 = 0; k2 < mix.length; k2++)
        mix[k2] && (y3 = toVal(mix[k2])) && (str && (str += " "), str += y3);
    else
      for (k2 in mix)
        mix[k2] && (str && (str += " "), str += k2);
  return str;
}
function clsx_m_default() {
  for (var i5 = 0, tmp, x3, str = ""; i5 < arguments.length; )
    (tmp = arguments[i5++]) && (x3 = toVal(tmp)) && (str && (str += " "), str += x3);
  return str;
}

// node_modules/@react-stately/utils/dist/module.js
var import_react15 = __toESM(require_react());
function $parcel$export2(e10, n6, v3, s6) {
  Object.defineProperty(e10, n6, { get: v3, set: s6, enumerable: !0, configurable: !0 });
}
var $bfee1151ccb0650f$exports = {};
$parcel$export2($bfee1151ccb0650f$exports, "useControlledState", () => $bfee1151ccb0650f$export$40bfa8c7b0832715);
function $bfee1151ccb0650f$export$40bfa8c7b0832715(value1, defaultValue, onChange) {
  let [stateValue, setStateValue] = (0, import_react15.useState)(value1 || defaultValue), ref = (0, import_react15.useRef)(value1 !== void 0), wasControlled = ref.current, isControlled = value1 !== void 0, stateRef = (0, import_react15.useRef)(stateValue);
  wasControlled !== isControlled && console.warn(`WARN: A component changed from ${wasControlled ? "controlled" : "uncontrolled"} to ${isControlled ? "controlled" : "uncontrolled"}.`), ref.current = isControlled;
  let setValue = (0, import_react15.useCallback)((value2, ...args) => {
    let onChangeCaller = (value, ...onChangeArgs) => {
      onChange && (Object.is(stateRef.current, value) || onChange(value, ...onChangeArgs)), isControlled || (stateRef.current = value);
    };
    typeof value2 == "function" ? (console.warn("We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320"), setStateValue((oldValue, ...functionArgs) => {
      let interceptedValue = value2(isControlled ? stateRef.current : oldValue, ...functionArgs);
      return onChangeCaller(interceptedValue, ...args), isControlled ? oldValue : interceptedValue;
    })) : (isControlled || setStateValue(value2), onChangeCaller(value2, ...args));
  }, [
    isControlled,
    onChange
  ]);
  return isControlled ? stateRef.current = value1 : value1 = stateValue, [
    value1,
    setValue
  ];
}
var $48d9f1d165180307$exports = {};
$parcel$export2($48d9f1d165180307$exports, "clamp", () => $48d9f1d165180307$export$7d15b64cf5a3a4c4);
$parcel$export2($48d9f1d165180307$exports, "snapValueToStep", () => $48d9f1d165180307$export$cb6e0bb50bc19463);
$parcel$export2($48d9f1d165180307$exports, "toFixedNumber", () => $48d9f1d165180307$export$b6268554fba451f);
function $48d9f1d165180307$export$7d15b64cf5a3a4c4(value, min = -1 / 0, max = 1 / 0) {
  return Math.min(Math.max(value, min), max);
}
function $48d9f1d165180307$export$cb6e0bb50bc19463(value, min, max, step) {
  let remainder = (value - (isNaN(min) ? 0 : min)) % step, snappedValue = Math.abs(remainder) * 2 >= step ? value + Math.sign(remainder) * (step - Math.abs(remainder)) : value - remainder;
  isNaN(min) ? !isNaN(max) && snappedValue > max && (snappedValue = Math.floor(max / step) * step) : snappedValue < min ? snappedValue = min : !isNaN(max) && snappedValue > max && (snappedValue = min + Math.floor((max - min) / step) * step);
  let string = step.toString(), index = string.indexOf("."), precision = index >= 0 ? string.length - index : 0;
  if (precision > 0) {
    let pow = Math.pow(10, precision);
    snappedValue = Math.round(snappedValue * pow) / pow;
  }
  return snappedValue;
}
function $48d9f1d165180307$export$b6268554fba451f(value, digits, base = 10) {
  let pow = Math.pow(base, digits);
  return Math.round(value * pow) / pow;
}

// node_modules/@react-aria/utils/dist/module.js
function $parcel$export3(e10, n6, v3, s6) {
  Object.defineProperty(e10, n6, { get: v3, set: s6, enumerable: !0, configurable: !0 });
}
var $4208ab27be92763a$exports = {};
$parcel$export3($4208ab27be92763a$exports, "useId", () => $4208ab27be92763a$export$f680877a34711e37);
$parcel$export3($4208ab27be92763a$exports, "mergeIds", () => $4208ab27be92763a$export$cd8c9cb68f842629);
$parcel$export3($4208ab27be92763a$exports, "useSlotId", () => $4208ab27be92763a$export$b4cc09c592e8fdb8);
var $62918828a5c4cefe$exports = {};
$parcel$export3($62918828a5c4cefe$exports, "useLayoutEffect", () => $62918828a5c4cefe$export$e5c5a5f917a5871c);
var $62918828a5c4cefe$export$e5c5a5f917a5871c = typeof window < "u" ? import_react16.default.useLayoutEffect : () => {
}, $4208ab27be92763a$var$idsUpdaterMap = /* @__PURE__ */ new Map();
function $4208ab27be92763a$export$f680877a34711e37(defaultId) {
  let isRendering = (0, import_react16.useRef)(!0);
  isRendering.current = !0;
  let [value, setValue] = (0, import_react16.useState)(defaultId), nextId = (0, import_react16.useRef)(null), res = $9d939cbc98267846$export$619500959fc48b26(value), updateValue = (val) => {
    isRendering.current ? nextId.current = val : setValue(val);
  };
  return $4208ab27be92763a$var$idsUpdaterMap.set(res, updateValue), $62918828a5c4cefe$export$e5c5a5f917a5871c(() => {
    isRendering.current = !1;
  }, [
    updateValue
  ]), $62918828a5c4cefe$export$e5c5a5f917a5871c(() => {
    let r8 = res;
    return () => {
      $4208ab27be92763a$var$idsUpdaterMap.delete(r8);
    };
  }, [
    res
  ]), (0, import_react16.useEffect)(() => {
    let newId = nextId.current;
    newId && (setValue(newId), nextId.current = null);
  }, [
    setValue,
    updateValue
  ]), res;
}
function $4208ab27be92763a$export$cd8c9cb68f842629(idA, idB) {
  if (idA === idB)
    return idA;
  let setIdA = $4208ab27be92763a$var$idsUpdaterMap.get(idA);
  if (setIdA)
    return setIdA(idB), idB;
  let setIdB = $4208ab27be92763a$var$idsUpdaterMap.get(idB);
  return setIdB ? (setIdB(idA), idA) : idB;
}
function $4208ab27be92763a$export$b4cc09c592e8fdb8(depArray = []) {
  let id = $4208ab27be92763a$export$f680877a34711e37(), [resolvedId, setResolvedId] = $8bfb318ccfa2e412$export$14d238f342723f25(id), updateId = (0, import_react16.useCallback)(() => {
    setResolvedId(function* () {
      yield id, yield document.getElementById(id) ? id : null;
    });
  }, [
    id,
    setResolvedId
  ]);
  return $62918828a5c4cefe$export$e5c5a5f917a5871c(updateId, [
    id,
    updateId,
    ...depArray
  ]), resolvedId;
}
var $2aefb161b9a41928$exports = {};
$parcel$export3($2aefb161b9a41928$exports, "chain", () => $2aefb161b9a41928$export$e08e3b67e392101e);
function $2aefb161b9a41928$export$e08e3b67e392101e(...callbacks) {
  return (...args) => {
    for (let callback of callbacks)
      typeof callback == "function" && callback(...args);
  };
}
var $699afe8e9e0f66de$exports = {};
$parcel$export3($699afe8e9e0f66de$exports, "mergeProps", () => $699afe8e9e0f66de$export$9d1611c77c2fe928);
function $699afe8e9e0f66de$export$9d1611c77c2fe928(...args) {
  let result = {
    ...args[0]
  };
  for (let i5 = 1; i5 < args.length; i5++) {
    let props = args[i5];
    for (let key in props) {
      let a4 = result[key], b3 = props[key];
      typeof a4 == "function" && typeof b3 == "function" && key[0] === "o" && key[1] === "n" && key.charCodeAt(2) >= 65 && key.charCodeAt(2) <= 90 ? result[key] = $2aefb161b9a41928$export$e08e3b67e392101e(a4, b3) : (key === "className" || key === "UNSAFE_className") && typeof a4 == "string" && typeof b3 == "string" ? result[key] = clsx_m_default(a4, b3) : key === "id" && a4 && b3 ? result.id = $4208ab27be92763a$export$cd8c9cb68f842629(a4, b3) : result[key] = b3 !== void 0 ? b3 : a4;
    }
  }
  return result;
}
var $7efcb978e02fb174$exports = {};
$parcel$export3($7efcb978e02fb174$exports, "filterDOMProps", () => $7efcb978e02fb174$export$457c3d6518dd4c6f);
var $7efcb978e02fb174$var$DOMPropNames = /* @__PURE__ */ new Set([
  "id"
]), $7efcb978e02fb174$var$labelablePropNames = /* @__PURE__ */ new Set([
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-details"
]), $7efcb978e02fb174$var$propRe = /^(data-.*)$/;
function $7efcb978e02fb174$export$457c3d6518dd4c6f(props, opts = {}) {
  let { labelable, propNames } = opts, filteredProps = {};
  for (let prop in props)
    Object.prototype.hasOwnProperty.call(props, prop) && ($7efcb978e02fb174$var$DOMPropNames.has(prop) || labelable && $7efcb978e02fb174$var$labelablePropNames.has(prop) || (propNames == null ? void 0 : propNames.has(prop)) || $7efcb978e02fb174$var$propRe.test(prop)) && (filteredProps[prop] = props[prop]);
  return filteredProps;
}
var $0172e2a3384c2851$exports = {};
$parcel$export3($0172e2a3384c2851$exports, "focusWithoutScrolling", () => $0172e2a3384c2851$export$de79e2c695e052f3);
function $0172e2a3384c2851$export$de79e2c695e052f3(element) {
  if ($0172e2a3384c2851$var$supportsPreventScroll())
    element.focus({
      preventScroll: !0
    });
  else {
    let scrollableElements = $0172e2a3384c2851$var$getScrollableElements(element);
    element.focus(), $0172e2a3384c2851$var$restoreScrollPosition(scrollableElements);
  }
}
var $0172e2a3384c2851$var$supportsPreventScrollCached = null;
function $0172e2a3384c2851$var$supportsPreventScroll() {
  if ($0172e2a3384c2851$var$supportsPreventScrollCached == null) {
    $0172e2a3384c2851$var$supportsPreventScrollCached = !1;
    try {
      var focusElem = document.createElement("div");
      focusElem.focus({
        get preventScroll() {
          return $0172e2a3384c2851$var$supportsPreventScrollCached = !0, !0;
        }
      });
    } catch {
    }
  }
  return $0172e2a3384c2851$var$supportsPreventScrollCached;
}
function $0172e2a3384c2851$var$getScrollableElements(element) {
  for (var parent = element.parentNode, scrollableElements = [], rootScrollingElement = document.scrollingElement || document.documentElement; parent instanceof HTMLElement && parent !== rootScrollingElement; )
    (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) && scrollableElements.push({
      element: parent,
      scrollTop: parent.scrollTop,
      scrollLeft: parent.scrollLeft
    }), parent = parent.parentNode;
  return rootScrollingElement instanceof HTMLElement && scrollableElements.push({
    element: rootScrollingElement,
    scrollTop: rootScrollingElement.scrollTop,
    scrollLeft: rootScrollingElement.scrollLeft
  }), scrollableElements;
}
function $0172e2a3384c2851$var$restoreScrollPosition(scrollableElements) {
  for (let { element, scrollTop, scrollLeft } of scrollableElements)
    element.scrollTop = scrollTop, element.scrollLeft = scrollLeft;
}
var $5062b1512bdf762b$exports = {};
$parcel$export3($5062b1512bdf762b$exports, "getOffset", () => $5062b1512bdf762b$export$622cea445a1c5b7d);
function $5062b1512bdf762b$export$622cea445a1c5b7d(element, reverse, orientation = "horizontal") {
  let rect = element.getBoundingClientRect();
  return reverse ? orientation === "horizontal" ? rect.right : rect.bottom : orientation === "horizontal" ? rect.left : rect.top;
}
var $5cdbf4ddafd135bc$exports = {};
$parcel$export3($5cdbf4ddafd135bc$exports, "clamp", () => $48d9f1d165180307$export$7d15b64cf5a3a4c4);
$parcel$export3($5cdbf4ddafd135bc$exports, "snapValueToStep", () => $48d9f1d165180307$export$cb6e0bb50bc19463);
var $fdecdd2f4116564c$exports = {};
$parcel$export3($fdecdd2f4116564c$exports, "runAfterTransition", () => $fdecdd2f4116564c$export$24490316f764c430);
var $fdecdd2f4116564c$var$transitionsByElement = /* @__PURE__ */ new Map(), $fdecdd2f4116564c$var$transitionCallbacks = /* @__PURE__ */ new Set();
function $fdecdd2f4116564c$var$setupGlobalEvents() {
  if (typeof window > "u")
    return;
  let onTransitionStart = (e10) => {
    let transitions = $fdecdd2f4116564c$var$transitionsByElement.get(e10.target);
    transitions || (transitions = /* @__PURE__ */ new Set(), $fdecdd2f4116564c$var$transitionsByElement.set(e10.target, transitions), e10.target.addEventListener("transitioncancel", onTransitionEnd)), transitions.add(e10.propertyName);
  }, onTransitionEnd = (e10) => {
    let properties = $fdecdd2f4116564c$var$transitionsByElement.get(e10.target);
    if (!!properties && (properties.delete(e10.propertyName), properties.size === 0 && (e10.target.removeEventListener("transitioncancel", onTransitionEnd), $fdecdd2f4116564c$var$transitionsByElement.delete(e10.target)), $fdecdd2f4116564c$var$transitionsByElement.size === 0)) {
      for (let cb of $fdecdd2f4116564c$var$transitionCallbacks)
        cb();
      $fdecdd2f4116564c$var$transitionCallbacks.clear();
    }
  };
  document.body.addEventListener("transitionrun", onTransitionStart), document.body.addEventListener("transitionend", onTransitionEnd);
}
typeof document < "u" && (document.readyState !== "loading" ? $fdecdd2f4116564c$var$setupGlobalEvents() : document.addEventListener("DOMContentLoaded", $fdecdd2f4116564c$var$setupGlobalEvents));
function $fdecdd2f4116564c$export$24490316f764c430(fn) {
  requestAnimationFrame(() => {
    $fdecdd2f4116564c$var$transitionsByElement.size === 0 ? fn() : $fdecdd2f4116564c$var$transitionCallbacks.add(fn);
  });
}
var $95a0e07fe544f4e9$exports = {};
$parcel$export3($95a0e07fe544f4e9$exports, "useDrag1D", () => $95a0e07fe544f4e9$export$7bbed75feba39706);
var $95a0e07fe544f4e9$var$draggingElements = [];
function $95a0e07fe544f4e9$export$7bbed75feba39706(props) {
  console.warn("useDrag1D is deprecated, please use `useMove` instead https://react-spectrum.adobe.com/react-aria/useMove.html");
  let { containerRef, reverse, orientation, onHover, onDrag, onPositionChange, onIncrement, onDecrement, onIncrementToMax, onDecrementToMin, onCollapseToggle } = props, getPosition = (e10) => orientation === "horizontal" ? e10.clientX : e10.clientY, getNextOffset = (e10) => {
    let containerOffset = $5062b1512bdf762b$export$622cea445a1c5b7d(containerRef.current, reverse, orientation), mouseOffset = getPosition(e10);
    return reverse ? containerOffset - mouseOffset : mouseOffset - containerOffset;
  }, dragging = (0, import_react16.useRef)(!1), prevPosition = (0, import_react16.useRef)(0), handlers = (0, import_react16.useRef)({
    onPositionChange,
    onDrag
  });
  handlers.current.onDrag = onDrag, handlers.current.onPositionChange = onPositionChange;
  let onMouseDragged = (e10) => {
    e10.preventDefault();
    let nextOffset = getNextOffset(e10);
    dragging.current || (dragging.current = !0, handlers.current.onDrag && handlers.current.onDrag(!0), handlers.current.onPositionChange && handlers.current.onPositionChange(nextOffset)), prevPosition.current !== nextOffset && (prevPosition.current = nextOffset, onPositionChange && onPositionChange(nextOffset));
  }, onMouseUp = (e10) => {
    let target = e10.target;
    dragging.current = !1;
    let nextOffset = getNextOffset(e10);
    handlers.current.onDrag && handlers.current.onDrag(!1), handlers.current.onPositionChange && handlers.current.onPositionChange(nextOffset), $95a0e07fe544f4e9$var$draggingElements.splice($95a0e07fe544f4e9$var$draggingElements.indexOf(target), 1), window.removeEventListener("mouseup", onMouseUp, !1), window.removeEventListener("mousemove", onMouseDragged, !1);
  };
  return {
    onMouseDown: (e10) => {
      let target = e10.currentTarget;
      $95a0e07fe544f4e9$var$draggingElements.some(
        (elt) => target.contains(elt)
      ) || ($95a0e07fe544f4e9$var$draggingElements.push(target), window.addEventListener("mousemove", onMouseDragged, !1), window.addEventListener("mouseup", onMouseUp, !1));
    },
    onMouseEnter: () => {
      onHover && onHover(!0);
    },
    onMouseOut: () => {
      onHover && onHover(!1);
    },
    onKeyDown: (e10) => {
      switch (e10.key) {
        case "Left":
        case "ArrowLeft":
          orientation === "horizontal" && (e10.preventDefault(), onDecrement && !reverse ? onDecrement() : onIncrement && reverse && onIncrement());
          break;
        case "Up":
        case "ArrowUp":
          orientation === "vertical" && (e10.preventDefault(), onDecrement && !reverse ? onDecrement() : onIncrement && reverse && onIncrement());
          break;
        case "Right":
        case "ArrowRight":
          orientation === "horizontal" && (e10.preventDefault(), onIncrement && !reverse ? onIncrement() : onDecrement && reverse && onDecrement());
          break;
        case "Down":
        case "ArrowDown":
          orientation === "vertical" && (e10.preventDefault(), onIncrement && !reverse ? onIncrement() : onDecrement && reverse && onDecrement());
          break;
        case "Home":
          e10.preventDefault(), onDecrementToMin && onDecrementToMin();
          break;
        case "End":
          e10.preventDefault(), onIncrementToMax && onIncrementToMax();
          break;
        case "Enter":
          e10.preventDefault(), onCollapseToggle && onCollapseToggle();
          break;
      }
    }
  };
}
var $042598a43c3fee40$exports = {};
$parcel$export3($042598a43c3fee40$exports, "useGlobalListeners", () => $042598a43c3fee40$export$4eaf04e54aa8eed6);
function $042598a43c3fee40$export$4eaf04e54aa8eed6() {
  let globalListeners = (0, import_react16.useRef)(/* @__PURE__ */ new Map()), addGlobalListener = (0, import_react16.useCallback)((eventTarget, type, listener, options) => {
    let fn = options != null && options.once ? (...args) => {
      globalListeners.current.delete(listener), listener(...args);
    } : listener;
    globalListeners.current.set(listener, {
      type,
      eventTarget,
      fn,
      options
    }), eventTarget.addEventListener(type, listener, options);
  }, []), removeGlobalListener = (0, import_react16.useCallback)((eventTarget, type, listener, options) => {
    var _a;
    let fn = ((_a = globalListeners.current.get(listener)) == null ? void 0 : _a.fn) || listener;
    eventTarget.removeEventListener(type, fn, options), globalListeners.current.delete(listener);
  }, []), removeAllGlobalListeners = (0, import_react16.useCallback)(() => {
    globalListeners.current.forEach((value, key) => {
      removeGlobalListener(value.eventTarget, value.type, key, value.options);
    });
  }, [
    removeGlobalListener
  ]);
  return (0, import_react16.useEffect)(() => removeAllGlobalListeners, [
    removeAllGlobalListeners
  ]), {
    addGlobalListener,
    removeGlobalListener,
    removeAllGlobalListeners
  };
}
var $2ab91c20d1fbac23$exports = {};
$parcel$export3($2ab91c20d1fbac23$exports, "useLabels", () => $2ab91c20d1fbac23$export$d6875122194c7b44);
function $2ab91c20d1fbac23$export$d6875122194c7b44(props, defaultLabel) {
  let { id, "aria-label": label, "aria-labelledby": labelledBy } = props;
  return id = $4208ab27be92763a$export$f680877a34711e37(id), labelledBy && label ? labelledBy = [
    .../* @__PURE__ */ new Set([
      ...labelledBy.trim().split(/\s+/),
      id
    ])
  ].join(" ") : labelledBy && (labelledBy = labelledBy.trim().split(/\s+/).join(" ")), !label && !labelledBy && defaultLabel && (label = defaultLabel), {
    id,
    "aria-label": label,
    "aria-labelledby": labelledBy
  };
}
var $1ea3613dec903cb9$exports = {};
$parcel$export3($1ea3613dec903cb9$exports, "useObjectRef", () => $1ea3613dec903cb9$export$4338b53315abf666);
function $1ea3613dec903cb9$export$4338b53315abf666(forwardedRef) {
  let objRef = (0, import_react16.useRef)();
  return $62918828a5c4cefe$export$e5c5a5f917a5871c(() => {
    !forwardedRef || (typeof forwardedRef == "function" ? forwardedRef(objRef.current) : forwardedRef.current = objRef.current);
  }, [
    forwardedRef
  ]), objRef;
}
var $d3ab8ae13db3a1fd$exports = {};
$parcel$export3($d3ab8ae13db3a1fd$exports, "useUpdateEffect", () => $d3ab8ae13db3a1fd$export$496315a1608d9602);
function $d3ab8ae13db3a1fd$export$496315a1608d9602(effect, dependencies) {
  let isInitialMount = (0, import_react16.useRef)(!0);
  (0, import_react16.useEffect)(() => {
    isInitialMount.current ? isInitialMount.current = !1 : effect();
  }, dependencies);
}
var $f3e728a941364b05$exports = {};
$parcel$export3($f3e728a941364b05$exports, "useResizeObserver", () => $f3e728a941364b05$export$683480f191c0e3ea);
function $f3e728a941364b05$var$hasResizeObserver() {
  return typeof window.ResizeObserver < "u";
}
function $f3e728a941364b05$export$683480f191c0e3ea(options) {
  let { ref, onResize } = options;
  (0, import_react16.useEffect)(() => {
    let element = ref == null ? void 0 : ref.current;
    if (!!element)
      if ($f3e728a941364b05$var$hasResizeObserver()) {
        let resizeObserverInstance = new window.ResizeObserver((entries) => {
          !entries.length || onResize();
        });
        return resizeObserverInstance.observe(element), () => {
          element && resizeObserverInstance.unobserve(element);
        };
      } else
        return window.addEventListener("resize", onResize, !1), () => {
          window.removeEventListener("resize", onResize, !1);
        };
  }, [
    onResize,
    ref
  ]);
}
var $518b8f251641d71b$exports = {};
$parcel$export3($518b8f251641d71b$exports, "useSyncRef", () => $518b8f251641d71b$export$4debdb1a3f0fa79e);
function $518b8f251641d71b$export$4debdb1a3f0fa79e(context, ref) {
  $62918828a5c4cefe$export$e5c5a5f917a5871c(() => {
    if (context && context.ref && ref)
      return context.ref.current = ref.current, () => {
        context.ref.current = null;
      };
  }, [
    context,
    ref
  ]);
}
var $2fe8625dffd76a00$exports = {};
$parcel$export3($2fe8625dffd76a00$exports, "getScrollParent", () => $2fe8625dffd76a00$export$cfa2225e87938781);
function $2fe8625dffd76a00$export$cfa2225e87938781(node) {
  for (; node && !$2fe8625dffd76a00$var$isScrollable(node); )
    node = node.parentElement;
  return node || document.scrollingElement || document.documentElement;
}
function $2fe8625dffd76a00$var$isScrollable(node) {
  let style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}
var $c5fe598a15f005e5$exports = {};
$parcel$export3($c5fe598a15f005e5$exports, "useViewportSize", () => $c5fe598a15f005e5$export$d699905dd57c73ca);
var $c5fe598a15f005e5$var$visualViewport = typeof window < "u" && window.visualViewport;
function $c5fe598a15f005e5$export$d699905dd57c73ca() {
  let [size1, setSize] = (0, import_react16.useState)(
    () => $c5fe598a15f005e5$var$getViewportSize()
  );
  return (0, import_react16.useEffect)(() => {
    let onResize = () => {
      setSize((size) => {
        let newSize = $c5fe598a15f005e5$var$getViewportSize();
        return newSize.width === size.width && newSize.height === size.height ? size : newSize;
      });
    };
    return $c5fe598a15f005e5$var$visualViewport ? $c5fe598a15f005e5$var$visualViewport.addEventListener("resize", onResize) : window.addEventListener("resize", onResize), () => {
      $c5fe598a15f005e5$var$visualViewport ? $c5fe598a15f005e5$var$visualViewport.removeEventListener("resize", onResize) : window.removeEventListener("resize", onResize);
    };
  }, []), size1;
}
function $c5fe598a15f005e5$var$getViewportSize() {
  return {
    width: ($c5fe598a15f005e5$var$visualViewport == null ? void 0 : $c5fe598a15f005e5$var$visualViewport.width) || window.innerWidth,
    height: ($c5fe598a15f005e5$var$visualViewport == null ? void 0 : $c5fe598a15f005e5$var$visualViewport.height) || window.innerHeight
  };
}
var $5475261706737633$exports = {};
$parcel$export3($5475261706737633$exports, "useDescription", () => $5475261706737633$export$f8aeda7b10753fa1);
var $5475261706737633$var$descriptionId = 0, $5475261706737633$var$descriptionNodes = /* @__PURE__ */ new Map();
function $5475261706737633$export$f8aeda7b10753fa1(description) {
  let [id1, setId] = (0, import_react16.useState)(null);
  return $62918828a5c4cefe$export$e5c5a5f917a5871c(() => {
    if (!description)
      return;
    let desc = $5475261706737633$var$descriptionNodes.get(description);
    if (desc)
      setId(desc.element.id);
    else {
      let id = `react-aria-description-${$5475261706737633$var$descriptionId++}`;
      setId(id);
      let node = document.createElement("div");
      node.id = id, node.style.display = "none", node.textContent = description, document.body.appendChild(node), desc = {
        refCount: 0,
        element: node
      }, $5475261706737633$var$descriptionNodes.set(description, desc);
    }
    return desc.refCount++, () => {
      --desc.refCount === 0 && (desc.element.remove(), $5475261706737633$var$descriptionNodes.delete(description));
    };
  }, [
    description
  ]), {
    "aria-describedby": description ? id1 : void 0
  };
}
var $43a0edf5ccd884bb$exports = {};
$parcel$export3($43a0edf5ccd884bb$exports, "isMac", () => $43a0edf5ccd884bb$export$9ac100e40613ea10);
$parcel$export3($43a0edf5ccd884bb$exports, "isIPhone", () => $43a0edf5ccd884bb$export$186c6964ca17d99);
$parcel$export3($43a0edf5ccd884bb$exports, "isIPad", () => $43a0edf5ccd884bb$export$7bef049ce92e4224);
$parcel$export3($43a0edf5ccd884bb$exports, "isIOS", () => $43a0edf5ccd884bb$export$fedb369cb70207f1);
$parcel$export3($43a0edf5ccd884bb$exports, "isAppleDevice", () => $43a0edf5ccd884bb$export$e1865c3bedcd822b);
$parcel$export3($43a0edf5ccd884bb$exports, "isWebKit", () => $43a0edf5ccd884bb$export$78551043582a6a98);
$parcel$export3($43a0edf5ccd884bb$exports, "isChrome", () => $43a0edf5ccd884bb$export$6446a186d09e379e);
$parcel$export3($43a0edf5ccd884bb$exports, "isAndroid", () => $43a0edf5ccd884bb$export$a11b0059900ceec8);
function $43a0edf5ccd884bb$var$testUserAgent(re) {
  return typeof window < "u" && window.navigator != null ? re.test(window.navigator.userAgent) : !1;
}
function $43a0edf5ccd884bb$var$testPlatform(re) {
  return typeof window < "u" && window.navigator != null ? re.test(window.navigator.platform) : !1;
}
function $43a0edf5ccd884bb$export$9ac100e40613ea10() {
  return $43a0edf5ccd884bb$var$testPlatform(/^Mac/);
}
function $43a0edf5ccd884bb$export$186c6964ca17d99() {
  return $43a0edf5ccd884bb$var$testPlatform(/^iPhone/);
}
function $43a0edf5ccd884bb$export$7bef049ce92e4224() {
  return $43a0edf5ccd884bb$var$testPlatform(/^iPad/) || $43a0edf5ccd884bb$export$9ac100e40613ea10() && navigator.maxTouchPoints > 1;
}
function $43a0edf5ccd884bb$export$fedb369cb70207f1() {
  return $43a0edf5ccd884bb$export$186c6964ca17d99() || $43a0edf5ccd884bb$export$7bef049ce92e4224();
}
function $43a0edf5ccd884bb$export$e1865c3bedcd822b() {
  return $43a0edf5ccd884bb$export$9ac100e40613ea10() || $43a0edf5ccd884bb$export$fedb369cb70207f1();
}
function $43a0edf5ccd884bb$export$78551043582a6a98() {
  return $43a0edf5ccd884bb$var$testUserAgent(/AppleWebKit/) && !$43a0edf5ccd884bb$export$6446a186d09e379e();
}
function $43a0edf5ccd884bb$export$6446a186d09e379e() {
  return $43a0edf5ccd884bb$var$testUserAgent(/Chrome/);
}
function $43a0edf5ccd884bb$export$a11b0059900ceec8() {
  return $43a0edf5ccd884bb$var$testUserAgent(/Android/);
}
var $6f85328eaea47571$exports = {};
$parcel$export3($6f85328eaea47571$exports, "useEvent", () => $6f85328eaea47571$export$90fc3a17d93f704c);
function $6f85328eaea47571$export$90fc3a17d93f704c(ref, event, handler1, options) {
  let handlerRef = (0, import_react16.useRef)(handler1);
  handlerRef.current = handler1;
  let isDisabled = handler1 == null;
  (0, import_react16.useEffect)(() => {
    if (isDisabled)
      return;
    let element = ref.current, handler = (e10) => handlerRef.current.call(this, e10);
    return element.addEventListener(event, handler, options), () => {
      element.removeEventListener(event, handler, options);
    };
  }, [
    ref,
    event,
    options,
    isDisabled
  ]);
}
var $8bfb318ccfa2e412$exports = {};
$parcel$export3($8bfb318ccfa2e412$exports, "useValueEffect", () => $8bfb318ccfa2e412$export$14d238f342723f25);
function $8bfb318ccfa2e412$export$14d238f342723f25(defaultValue) {
  let [value, setValue] = (0, import_react16.useState)(defaultValue), valueRef = (0, import_react16.useRef)(value), effect = (0, import_react16.useRef)(null);
  valueRef.current = value;
  let nextRef = (0, import_react16.useRef)(null);
  nextRef.current = () => {
    let newValue = effect.current.next();
    if (newValue.done) {
      effect.current = null;
      return;
    }
    value === newValue.value ? nextRef.current() : setValue(newValue.value);
  }, $62918828a5c4cefe$export$e5c5a5f917a5871c(() => {
    effect.current && nextRef.current();
  });
  let queue2 = (0, import_react16.useCallback)((fn) => {
    effect.current = fn(valueRef.current), nextRef.current();
  }, [
    effect,
    nextRef
  ]);
  return [
    value,
    queue2
  ];
}
var $7b1a72e750057d55$exports = {};
$parcel$export3($7b1a72e750057d55$exports, "scrollIntoView", () => $7b1a72e750057d55$export$53a0910f038337bd);
function $7b1a72e750057d55$export$53a0910f038337bd(scrollView, element) {
  let offsetX = $7b1a72e750057d55$var$relativeOffset(scrollView, element, "left"), offsetY = $7b1a72e750057d55$var$relativeOffset(scrollView, element, "top"), width = element.offsetWidth, height = element.offsetHeight, x3 = scrollView.scrollLeft, y3 = scrollView.scrollTop, maxX = x3 + scrollView.offsetWidth, maxY = y3 + scrollView.offsetHeight;
  offsetX <= x3 ? x3 = offsetX : offsetX + width > maxX && (x3 += offsetX + width - maxX), offsetY <= y3 ? y3 = offsetY : offsetY + height > maxY && (y3 += offsetY + height - maxY), scrollView.scrollLeft = x3, scrollView.scrollTop = y3;
}
function $7b1a72e750057d55$var$relativeOffset(ancestor, child, axis) {
  let prop = axis === "left" ? "offsetLeft" : "offsetTop", sum = 0;
  for (; child.offsetParent && (sum += child[prop], child.offsetParent !== ancestor); ) {
    if (child.offsetParent.contains(ancestor)) {
      sum -= ancestor[prop];
      break;
    }
    child = child.offsetParent;
  }
  return sum;
}

// node_modules/@react-aria/interactions/dist/module.js
var import_react17 = __toESM(require_react());
function $parcel$export4(e10, n6, v3, s6) {
  Object.defineProperty(e10, n6, { get: v3, set: s6, enumerable: !0, configurable: !0 });
}
var $acf5f8872229f2cb$exports = {};
$parcel$export4($acf5f8872229f2cb$exports, "Pressable", () => $acf5f8872229f2cb$export$27c701ed9e449e99);
var $bb70d401e0bbab2b$exports = {};
$parcel$export4($bb70d401e0bbab2b$exports, "usePress", () => $bb70d401e0bbab2b$export$45712eceda6fad21);
var $8714dea79b55b9da$var$state = "default", $8714dea79b55b9da$var$savedUserSelect = "", $8714dea79b55b9da$var$modifiedElementMap = /* @__PURE__ */ new WeakMap();
function $8714dea79b55b9da$export$16a4697467175487(target) {
  $43a0edf5ccd884bb$export$fedb369cb70207f1() ? ($8714dea79b55b9da$var$state === "default" && ($8714dea79b55b9da$var$savedUserSelect = document.documentElement.style.webkitUserSelect, document.documentElement.style.webkitUserSelect = "none"), $8714dea79b55b9da$var$state = "disabled") : target && ($8714dea79b55b9da$var$modifiedElementMap.set(target, target.style.userSelect), target.style.userSelect = "none");
}
function $8714dea79b55b9da$export$b0d6fa1ab32e3295(target) {
  if ($43a0edf5ccd884bb$export$fedb369cb70207f1()) {
    if ($8714dea79b55b9da$var$state !== "disabled")
      return;
    $8714dea79b55b9da$var$state = "restoring", setTimeout(() => {
      $fdecdd2f4116564c$export$24490316f764c430(() => {
        $8714dea79b55b9da$var$state === "restoring" && (document.documentElement.style.webkitUserSelect === "none" && (document.documentElement.style.webkitUserSelect = $8714dea79b55b9da$var$savedUserSelect || ""), $8714dea79b55b9da$var$savedUserSelect = "", $8714dea79b55b9da$var$state = "default");
      });
    }, 300);
  } else if (target && $8714dea79b55b9da$var$modifiedElementMap.has(target)) {
    let targetOldUserSelect = $8714dea79b55b9da$var$modifiedElementMap.get(target);
    target.style.userSelect === "none" && (target.style.userSelect = targetOldUserSelect), target.getAttribute("style") === "" && target.removeAttribute("style"), $8714dea79b55b9da$var$modifiedElementMap.delete(target);
  }
}
function $e0ce205c97c9e771$export$60278871457622de(event) {
  return event.mozInputSource === 0 && event.isTrusted ? !0 : event.detail === 0 && !event.pointerType;
}
var $60f869ba95814a99$export$5165eccb35aaadb5 = import_react17.default.createContext(null);
$60f869ba95814a99$export$5165eccb35aaadb5.displayName = "PressResponderContext";
function $bb70d401e0bbab2b$var$usePressResponderContext(props) {
  let context = (0, import_react17.useContext)($60f869ba95814a99$export$5165eccb35aaadb5);
  if (context) {
    let { register, ...contextProps } = context;
    props = $699afe8e9e0f66de$export$9d1611c77c2fe928(contextProps, props), register();
  }
  return $518b8f251641d71b$export$4debdb1a3f0fa79e(context, props.ref), props;
}
function $bb70d401e0bbab2b$export$45712eceda6fad21(props) {
  let {
    onPress: onPress1,
    onPressChange: onPressChange1,
    onPressStart: onPressStart1,
    onPressEnd: onPressEnd1,
    onPressUp: onPressUp1,
    isDisabled: isDisabled1,
    isPressed: isPressedProp,
    preventFocusOnPress,
    shouldCancelOnPointerExit,
    allowTextSelectionOnPress,
    ref: _,
    ...domProps
  } = $bb70d401e0bbab2b$var$usePressResponderContext(props), propsRef = (0, import_react17.useRef)(null);
  propsRef.current = {
    onPress: onPress1,
    onPressChange: onPressChange1,
    onPressStart: onPressStart1,
    onPressEnd: onPressEnd1,
    onPressUp: onPressUp1,
    isDisabled: isDisabled1,
    shouldCancelOnPointerExit
  };
  let [isPressed, setPressed] = (0, import_react17.useState)(!1), ref = (0, import_react17.useRef)({
    isPressed: !1,
    ignoreEmulatedMouseEvents: !1,
    ignoreClickAfterPress: !1,
    didFirePressStart: !1,
    activePointerId: null,
    target: null,
    isOverTarget: !1,
    pointerType: null
  }), { addGlobalListener, removeAllGlobalListeners } = $042598a43c3fee40$export$4eaf04e54aa8eed6(), pressProps1 = (0, import_react17.useMemo)(() => {
    let state = ref.current, triggerPressStart = (originalEvent, pointerType) => {
      let { onPressStart, onPressChange, isDisabled } = propsRef.current;
      isDisabled || state.didFirePressStart || (onPressStart && onPressStart({
        type: "pressstart",
        pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      }), onPressChange && onPressChange(!0), state.didFirePressStart = !0, setPressed(!0));
    }, triggerPressEnd = (originalEvent, pointerType, wasPressed = !0) => {
      let { onPressEnd, onPressChange, onPress, isDisabled } = propsRef.current;
      !state.didFirePressStart || (state.ignoreClickAfterPress = !0, state.didFirePressStart = !1, onPressEnd && onPressEnd({
        type: "pressend",
        pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      }), onPressChange && onPressChange(!1), setPressed(!1), onPress && wasPressed && !isDisabled && onPress({
        type: "press",
        pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      }));
    }, triggerPressUp = (originalEvent, pointerType) => {
      let { onPressUp, isDisabled } = propsRef.current;
      isDisabled || onPressUp && onPressUp({
        type: "pressup",
        pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });
    }, cancel = (e10) => {
      state.isPressed && (state.isOverTarget && triggerPressEnd($bb70d401e0bbab2b$var$createEvent(state.target, e10), state.pointerType, !1), state.isPressed = !1, state.isOverTarget = !1, state.activePointerId = null, state.pointerType = null, removeAllGlobalListeners(), allowTextSelectionOnPress || $8714dea79b55b9da$export$b0d6fa1ab32e3295(state.target));
    }, pressProps = {
      onKeyDown(e10) {
        $bb70d401e0bbab2b$var$isValidKeyboardEvent(e10.nativeEvent) && e10.currentTarget.contains(e10.target) && ($bb70d401e0bbab2b$var$shouldPreventDefaultKeyboard(e10.target) && e10.preventDefault(), e10.stopPropagation(), !state.isPressed && !e10.repeat && (state.target = e10.currentTarget, state.isPressed = !0, triggerPressStart(e10, "keyboard"), addGlobalListener(document, "keyup", onKeyUp, !1)));
      },
      onKeyUp(e10) {
        $bb70d401e0bbab2b$var$isValidKeyboardEvent(e10.nativeEvent) && !e10.repeat && e10.currentTarget.contains(e10.target) && triggerPressUp($bb70d401e0bbab2b$var$createEvent(state.target, e10), "keyboard");
      },
      onClick(e10) {
        e10 && !e10.currentTarget.contains(e10.target) || e10 && e10.button === 0 && (e10.stopPropagation(), isDisabled1 && e10.preventDefault(), !state.ignoreClickAfterPress && !state.ignoreEmulatedMouseEvents && (state.pointerType === "virtual" || $e0ce205c97c9e771$export$60278871457622de(e10.nativeEvent)) && (!isDisabled1 && !preventFocusOnPress && $0172e2a3384c2851$export$de79e2c695e052f3(e10.currentTarget), triggerPressStart(e10, "virtual"), triggerPressUp(e10, "virtual"), triggerPressEnd(e10, "virtual")), state.ignoreEmulatedMouseEvents = !1, state.ignoreClickAfterPress = !1);
      }
    }, onKeyUp = (e10) => {
      if (state.isPressed && $bb70d401e0bbab2b$var$isValidKeyboardEvent(e10)) {
        $bb70d401e0bbab2b$var$shouldPreventDefaultKeyboard(e10.target) && e10.preventDefault(), e10.stopPropagation(), state.isPressed = !1;
        let target = e10.target;
        triggerPressEnd($bb70d401e0bbab2b$var$createEvent(state.target, e10), "keyboard", state.target.contains(target)), removeAllGlobalListeners(), (state.target.contains(target) && $bb70d401e0bbab2b$var$isHTMLAnchorLink(state.target) || state.target.getAttribute("role") === "link") && state.target.click();
      }
    };
    if (typeof PointerEvent < "u") {
      pressProps.onPointerDown = (e10) => {
        if (!(e10.button !== 0 || !e10.currentTarget.contains(e10.target))) {
          if ($bb70d401e0bbab2b$var$isVirtualPointerEvent(e10.nativeEvent)) {
            state.pointerType = "virtual";
            return;
          }
          $bb70d401e0bbab2b$var$shouldPreventDefault(e10.target) && e10.preventDefault(), state.pointerType = e10.pointerType, e10.stopPropagation(), state.isPressed || (state.isPressed = !0, state.isOverTarget = !0, state.activePointerId = e10.pointerId, state.target = e10.currentTarget, !isDisabled1 && !preventFocusOnPress && $0172e2a3384c2851$export$de79e2c695e052f3(e10.currentTarget), allowTextSelectionOnPress || $8714dea79b55b9da$export$16a4697467175487(state.target), triggerPressStart(e10, state.pointerType), addGlobalListener(document, "pointermove", onPointerMove, !1), addGlobalListener(document, "pointerup", onPointerUp, !1), addGlobalListener(document, "pointercancel", onPointerCancel, !1));
        }
      }, pressProps.onMouseDown = (e10) => {
        !e10.currentTarget.contains(e10.target) || e10.button === 0 && ($bb70d401e0bbab2b$var$shouldPreventDefault(e10.target) && e10.preventDefault(), e10.stopPropagation());
      }, pressProps.onPointerUp = (e10) => {
        !e10.currentTarget.contains(e10.target) || state.pointerType === "virtual" || e10.button === 0 && $bb70d401e0bbab2b$var$isOverTarget(e10, e10.currentTarget) && triggerPressUp(e10, state.pointerType || e10.pointerType);
      };
      let onPointerMove = (e10) => {
        e10.pointerId === state.activePointerId && ($bb70d401e0bbab2b$var$isOverTarget(e10, state.target) ? state.isOverTarget || (state.isOverTarget = !0, triggerPressStart($bb70d401e0bbab2b$var$createEvent(state.target, e10), state.pointerType)) : state.isOverTarget && (state.isOverTarget = !1, triggerPressEnd($bb70d401e0bbab2b$var$createEvent(state.target, e10), state.pointerType, !1), propsRef.current.shouldCancelOnPointerExit && cancel(e10)));
      }, onPointerUp = (e10) => {
        e10.pointerId === state.activePointerId && state.isPressed && e10.button === 0 && ($bb70d401e0bbab2b$var$isOverTarget(e10, state.target) ? triggerPressEnd($bb70d401e0bbab2b$var$createEvent(state.target, e10), state.pointerType) : state.isOverTarget && triggerPressEnd($bb70d401e0bbab2b$var$createEvent(state.target, e10), state.pointerType, !1), state.isPressed = !1, state.isOverTarget = !1, state.activePointerId = null, state.pointerType = null, removeAllGlobalListeners(), allowTextSelectionOnPress || $8714dea79b55b9da$export$b0d6fa1ab32e3295(state.target));
      }, onPointerCancel = (e10) => {
        cancel(e10);
      };
      pressProps.onDragStart = (e10) => {
        !e10.currentTarget.contains(e10.target) || cancel(e10);
      };
    } else {
      pressProps.onMouseDown = (e10) => {
        e10.button !== 0 || !e10.currentTarget.contains(e10.target) || ($bb70d401e0bbab2b$var$shouldPreventDefault(e10.target) && e10.preventDefault(), e10.stopPropagation(), !state.ignoreEmulatedMouseEvents && (state.isPressed = !0, state.isOverTarget = !0, state.target = e10.currentTarget, state.pointerType = $e0ce205c97c9e771$export$60278871457622de(e10.nativeEvent) ? "virtual" : "mouse", !isDisabled1 && !preventFocusOnPress && $0172e2a3384c2851$export$de79e2c695e052f3(e10.currentTarget), triggerPressStart(e10, state.pointerType), addGlobalListener(document, "mouseup", onMouseUp, !1)));
      }, pressProps.onMouseEnter = (e10) => {
        !e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), state.isPressed && !state.ignoreEmulatedMouseEvents && (state.isOverTarget = !0, triggerPressStart(e10, state.pointerType)));
      }, pressProps.onMouseLeave = (e10) => {
        !e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), state.isPressed && !state.ignoreEmulatedMouseEvents && (state.isOverTarget = !1, triggerPressEnd(e10, state.pointerType, !1), propsRef.current.shouldCancelOnPointerExit && cancel(e10)));
      }, pressProps.onMouseUp = (e10) => {
        !e10.currentTarget.contains(e10.target) || !state.ignoreEmulatedMouseEvents && e10.button === 0 && triggerPressUp(e10, state.pointerType);
      };
      let onMouseUp = (e10) => {
        if (e10.button === 0) {
          if (state.isPressed = !1, removeAllGlobalListeners(), state.ignoreEmulatedMouseEvents) {
            state.ignoreEmulatedMouseEvents = !1;
            return;
          }
          $bb70d401e0bbab2b$var$isOverTarget(e10, state.target) ? triggerPressEnd($bb70d401e0bbab2b$var$createEvent(state.target, e10), state.pointerType) : state.isOverTarget && triggerPressEnd($bb70d401e0bbab2b$var$createEvent(state.target, e10), state.pointerType, !1), state.isOverTarget = !1;
        }
      };
      pressProps.onTouchStart = (e10) => {
        if (!e10.currentTarget.contains(e10.target))
          return;
        e10.stopPropagation();
        let touch = $bb70d401e0bbab2b$var$getTouchFromEvent(e10.nativeEvent);
        !touch || (state.activePointerId = touch.identifier, state.ignoreEmulatedMouseEvents = !0, state.isOverTarget = !0, state.isPressed = !0, state.target = e10.currentTarget, state.pointerType = "touch", !isDisabled1 && !preventFocusOnPress && $0172e2a3384c2851$export$de79e2c695e052f3(e10.currentTarget), allowTextSelectionOnPress || $8714dea79b55b9da$export$16a4697467175487(state.target), triggerPressStart(e10, state.pointerType), addGlobalListener(window, "scroll", onScroll, !0));
      }, pressProps.onTouchMove = (e10) => {
        if (!e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), !state.isPressed))
          return;
        let touch = $bb70d401e0bbab2b$var$getTouchById(e10.nativeEvent, state.activePointerId);
        touch && $bb70d401e0bbab2b$var$isOverTarget(touch, e10.currentTarget) ? state.isOverTarget || (state.isOverTarget = !0, triggerPressStart(e10, state.pointerType)) : state.isOverTarget && (state.isOverTarget = !1, triggerPressEnd(e10, state.pointerType, !1), propsRef.current.shouldCancelOnPointerExit && cancel(e10));
      }, pressProps.onTouchEnd = (e10) => {
        if (!e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), !state.isPressed))
          return;
        let touch = $bb70d401e0bbab2b$var$getTouchById(e10.nativeEvent, state.activePointerId);
        touch && $bb70d401e0bbab2b$var$isOverTarget(touch, e10.currentTarget) ? (triggerPressUp(e10, state.pointerType), triggerPressEnd(e10, state.pointerType)) : state.isOverTarget && triggerPressEnd(e10, state.pointerType, !1), state.isPressed = !1, state.activePointerId = null, state.isOverTarget = !1, state.ignoreEmulatedMouseEvents = !0, allowTextSelectionOnPress || $8714dea79b55b9da$export$b0d6fa1ab32e3295(state.target), removeAllGlobalListeners();
      }, pressProps.onTouchCancel = (e10) => {
        !e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), state.isPressed && cancel(e10));
      };
      let onScroll = (e10) => {
        state.isPressed && e10.target.contains(state.target) && cancel({
          currentTarget: state.target,
          shiftKey: !1,
          ctrlKey: !1,
          metaKey: !1,
          altKey: !1
        });
      };
      pressProps.onDragStart = (e10) => {
        !e10.currentTarget.contains(e10.target) || cancel(e10);
      };
    }
    return pressProps;
  }, [
    addGlobalListener,
    isDisabled1,
    preventFocusOnPress,
    removeAllGlobalListeners,
    allowTextSelectionOnPress
  ]);
  return (0, import_react17.useEffect)(() => () => {
    allowTextSelectionOnPress || $8714dea79b55b9da$export$b0d6fa1ab32e3295(ref.current.target);
  }, [
    allowTextSelectionOnPress
  ]), {
    isPressed: isPressedProp || isPressed,
    pressProps: $699afe8e9e0f66de$export$9d1611c77c2fe928(domProps, pressProps1)
  };
}
function $bb70d401e0bbab2b$var$isHTMLAnchorLink(target) {
  return target.tagName === "A" && target.hasAttribute("href");
}
function $bb70d401e0bbab2b$var$isValidKeyboardEvent(event) {
  let { key, code, target } = event, element = target, { tagName, isContentEditable } = element, role = element.getAttribute("role");
  return (key === "Enter" || key === " " || key === "Spacebar" || code === "Space") && tagName !== "INPUT" && tagName !== "TEXTAREA" && isContentEditable !== !0 && (!$bb70d401e0bbab2b$var$isHTMLAnchorLink(element) || role === "button" && key !== "Enter") && !(role === "link" && key !== "Enter");
}
function $bb70d401e0bbab2b$var$getTouchFromEvent(event) {
  let { targetTouches } = event;
  return targetTouches.length > 0 ? targetTouches[0] : null;
}
function $bb70d401e0bbab2b$var$getTouchById(event, pointerId) {
  let changedTouches = event.changedTouches;
  for (let i5 = 0; i5 < changedTouches.length; i5++) {
    let touch = changedTouches[i5];
    if (touch.identifier === pointerId)
      return touch;
  }
  return null;
}
function $bb70d401e0bbab2b$var$createEvent(target, e10) {
  return {
    currentTarget: target,
    shiftKey: e10.shiftKey,
    ctrlKey: e10.ctrlKey,
    metaKey: e10.metaKey,
    altKey: e10.altKey
  };
}
function $bb70d401e0bbab2b$var$getPointClientRect(point) {
  let offsetX = point.width / 2 || point.radiusX || 0, offsetY = point.height / 2 || point.radiusY || 0;
  return {
    top: point.clientY - offsetY,
    right: point.clientX + offsetX,
    bottom: point.clientY + offsetY,
    left: point.clientX - offsetX
  };
}
function $bb70d401e0bbab2b$var$areRectanglesOverlapping(a4, b3) {
  return !(a4.left > b3.right || b3.left > a4.right || a4.top > b3.bottom || b3.top > a4.bottom);
}
function $bb70d401e0bbab2b$var$isOverTarget(point, target) {
  let rect = target.getBoundingClientRect(), pointRect = $bb70d401e0bbab2b$var$getPointClientRect(point);
  return $bb70d401e0bbab2b$var$areRectanglesOverlapping(rect, pointRect);
}
function $bb70d401e0bbab2b$var$shouldPreventDefault(target) {
  return !target.closest('[draggable="true"]');
}
function $bb70d401e0bbab2b$var$shouldPreventDefaultKeyboard(target) {
  return !((target.tagName === "INPUT" || target.tagName === "BUTTON") && target.type === "submit");
}
function $bb70d401e0bbab2b$var$isVirtualPointerEvent(event) {
  return event.width === 0 && event.height === 0 || event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0;
}
var $acf5f8872229f2cb$export$27c701ed9e449e99 = /* @__PURE__ */ import_react17.default.forwardRef(({ children, ...props }, ref) => {
  let newRef = (0, import_react17.useRef)();
  ref = ref ?? newRef;
  let { pressProps } = $bb70d401e0bbab2b$export$45712eceda6fad21({
    ...props,
    ref
  }), child = import_react17.default.Children.only(children);
  return /* @__PURE__ */ import_react17.default.cloneElement(
    child,
    {
      ref,
      ...$699afe8e9e0f66de$export$9d1611c77c2fe928(child.props, pressProps)
    }
  );
}), $36b2a54c41893e87$exports = {};
$parcel$export4($36b2a54c41893e87$exports, "PressResponder", () => $36b2a54c41893e87$export$3351871ee4b288b8);
var $36b2a54c41893e87$export$3351871ee4b288b8 = /* @__PURE__ */ import_react17.default.forwardRef(({ children, ...props }, ref) => {
  let isRegistered = (0, import_react17.useRef)(!1), prevContext = (0, import_react17.useContext)($60f869ba95814a99$export$5165eccb35aaadb5), context = $699afe8e9e0f66de$export$9d1611c77c2fe928(prevContext || {}, {
    ...props,
    ref: ref || (prevContext == null ? void 0 : prevContext.ref),
    register() {
      isRegistered.current = !0, prevContext && prevContext.register();
    }
  });
  return $518b8f251641d71b$export$4debdb1a3f0fa79e(prevContext, ref), (0, import_react17.useEffect)(() => {
    isRegistered.current || console.warn("A PressResponder was rendered without a pressable child. Either call the usePress hook, or wrap your DOM node with <Pressable> component.");
  }, []), /* @__PURE__ */ import_react17.default.createElement($60f869ba95814a99$export$5165eccb35aaadb5.Provider, {
    value: context
  }, children);
}), $96cd623b8d5dd15d$exports = {};
$parcel$export4($96cd623b8d5dd15d$exports, "useFocus", () => $96cd623b8d5dd15d$export$f8168d8dd8fd66e6);
function $96cd623b8d5dd15d$export$f8168d8dd8fd66e6(props) {
  if (props.isDisabled)
    return {
      focusProps: {}
    };
  let onFocus, onBlur;
  return (props.onFocus || props.onFocusChange) && (onFocus = (e10) => {
    e10.target === e10.currentTarget && (props.onFocus && props.onFocus(e10), props.onFocusChange && props.onFocusChange(!0));
  }), (props.onBlur || props.onFocusChange) && (onBlur = (e10) => {
    e10.target === e10.currentTarget && (props.onBlur && props.onBlur(e10), props.onFocusChange && props.onFocusChange(!1));
  }), {
    focusProps: {
      onFocus,
      onBlur
    }
  };
}
var $d2dd66cff767efeb$exports = {};
$parcel$export4($d2dd66cff767efeb$exports, "isFocusVisible", () => $d2dd66cff767efeb$export$b9b3dfddab17db27);
$parcel$export4($d2dd66cff767efeb$exports, "getInteractionModality", () => $d2dd66cff767efeb$export$630ff653c5ada6a9);
$parcel$export4($d2dd66cff767efeb$exports, "setInteractionModality", () => $d2dd66cff767efeb$export$8397ddfc504fdb9a);
$parcel$export4($d2dd66cff767efeb$exports, "useInteractionModality", () => $d2dd66cff767efeb$export$98e20ec92f614cfe);
$parcel$export4($d2dd66cff767efeb$exports, "useFocusVisible", () => $d2dd66cff767efeb$export$ffd9e5021c1fb2d6);
$parcel$export4($d2dd66cff767efeb$exports, "useFocusVisibleListener", () => $d2dd66cff767efeb$export$ec71b4b83ac08ec3);
var $d2dd66cff767efeb$var$currentModality = null, $d2dd66cff767efeb$var$changeHandlers = /* @__PURE__ */ new Set(), $d2dd66cff767efeb$var$hasSetupGlobalListeners = !1, $d2dd66cff767efeb$var$hasEventBeforeFocus = !1, $d2dd66cff767efeb$var$hasBlurredWindowRecently = !1, $d2dd66cff767efeb$var$FOCUS_VISIBLE_INPUT_KEYS = {
  Tab: !0,
  Escape: !0
};
function $d2dd66cff767efeb$var$triggerChangeHandlers(modality, e10) {
  for (let handler of $d2dd66cff767efeb$var$changeHandlers)
    handler(modality, e10);
}
function $d2dd66cff767efeb$var$isValidKey(e10) {
  return !(e10.metaKey || !$43a0edf5ccd884bb$export$9ac100e40613ea10() && e10.altKey || e10.ctrlKey || e10.key === "Control" || e10.key === "Shift" || e10.key === "Meta");
}
function $d2dd66cff767efeb$var$handleKeyboardEvent(e10) {
  $d2dd66cff767efeb$var$hasEventBeforeFocus = !0, $d2dd66cff767efeb$var$isValidKey(e10) && ($d2dd66cff767efeb$var$currentModality = "keyboard", $d2dd66cff767efeb$var$triggerChangeHandlers("keyboard", e10));
}
function $d2dd66cff767efeb$var$handlePointerEvent(e10) {
  $d2dd66cff767efeb$var$currentModality = "pointer", (e10.type === "mousedown" || e10.type === "pointerdown") && ($d2dd66cff767efeb$var$hasEventBeforeFocus = !0, $d2dd66cff767efeb$var$triggerChangeHandlers("pointer", e10));
}
function $d2dd66cff767efeb$var$handleClickEvent(e10) {
  $e0ce205c97c9e771$export$60278871457622de(e10) && ($d2dd66cff767efeb$var$hasEventBeforeFocus = !0, $d2dd66cff767efeb$var$currentModality = "virtual");
}
function $d2dd66cff767efeb$var$handleFocusEvent(e10) {
  e10.target === window || e10.target === document || (!$d2dd66cff767efeb$var$hasEventBeforeFocus && !$d2dd66cff767efeb$var$hasBlurredWindowRecently && ($d2dd66cff767efeb$var$currentModality = "virtual", $d2dd66cff767efeb$var$triggerChangeHandlers("virtual", e10)), $d2dd66cff767efeb$var$hasEventBeforeFocus = !1, $d2dd66cff767efeb$var$hasBlurredWindowRecently = !1);
}
function $d2dd66cff767efeb$var$handleWindowBlur() {
  $d2dd66cff767efeb$var$hasEventBeforeFocus = !1, $d2dd66cff767efeb$var$hasBlurredWindowRecently = !0;
}
function $d2dd66cff767efeb$var$setupGlobalFocusEvents() {
  if (typeof window > "u" || $d2dd66cff767efeb$var$hasSetupGlobalListeners)
    return;
  let focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function() {
    $d2dd66cff767efeb$var$hasEventBeforeFocus = !0, focus.apply(this, arguments);
  }, document.addEventListener("keydown", $d2dd66cff767efeb$var$handleKeyboardEvent, !0), document.addEventListener("keyup", $d2dd66cff767efeb$var$handleKeyboardEvent, !0), document.addEventListener("click", $d2dd66cff767efeb$var$handleClickEvent, !0), window.addEventListener("focus", $d2dd66cff767efeb$var$handleFocusEvent, !0), window.addEventListener("blur", $d2dd66cff767efeb$var$handleWindowBlur, !1), typeof PointerEvent < "u" ? (document.addEventListener("pointerdown", $d2dd66cff767efeb$var$handlePointerEvent, !0), document.addEventListener("pointermove", $d2dd66cff767efeb$var$handlePointerEvent, !0), document.addEventListener("pointerup", $d2dd66cff767efeb$var$handlePointerEvent, !0)) : (document.addEventListener("mousedown", $d2dd66cff767efeb$var$handlePointerEvent, !0), document.addEventListener("mousemove", $d2dd66cff767efeb$var$handlePointerEvent, !0), document.addEventListener("mouseup", $d2dd66cff767efeb$var$handlePointerEvent, !0)), $d2dd66cff767efeb$var$hasSetupGlobalListeners = !0;
}
typeof document < "u" && (document.readyState !== "loading" ? $d2dd66cff767efeb$var$setupGlobalFocusEvents() : document.addEventListener("DOMContentLoaded", $d2dd66cff767efeb$var$setupGlobalFocusEvents));
function $d2dd66cff767efeb$export$b9b3dfddab17db27() {
  return $d2dd66cff767efeb$var$currentModality !== "pointer";
}
function $d2dd66cff767efeb$export$630ff653c5ada6a9() {
  return $d2dd66cff767efeb$var$currentModality;
}
function $d2dd66cff767efeb$export$8397ddfc504fdb9a(modality) {
  $d2dd66cff767efeb$var$currentModality = modality, $d2dd66cff767efeb$var$triggerChangeHandlers(modality, null);
}
function $d2dd66cff767efeb$export$98e20ec92f614cfe() {
  $d2dd66cff767efeb$var$setupGlobalFocusEvents();
  let [modality, setModality] = (0, import_react17.useState)($d2dd66cff767efeb$var$currentModality);
  return (0, import_react17.useEffect)(() => {
    let handler = () => {
      setModality($d2dd66cff767efeb$var$currentModality);
    };
    return $d2dd66cff767efeb$var$changeHandlers.add(handler), () => {
      $d2dd66cff767efeb$var$changeHandlers.delete(handler);
    };
  }, []), modality;
}
function $d2dd66cff767efeb$var$isKeyboardFocusEvent(isTextInput, modality, e10) {
  return !(isTextInput && modality === "keyboard" && e10 instanceof KeyboardEvent && !$d2dd66cff767efeb$var$FOCUS_VISIBLE_INPUT_KEYS[e10.key]);
}
function $d2dd66cff767efeb$export$ffd9e5021c1fb2d6(props = {}) {
  let { isTextInput, autoFocus } = props, [isFocusVisibleState, setFocusVisible] = (0, import_react17.useState)(autoFocus || $d2dd66cff767efeb$export$b9b3dfddab17db27());
  return $d2dd66cff767efeb$export$ec71b4b83ac08ec3(($d2dd66cff767efeb$export$b9b3dfddab17db272) => {
    setFocusVisible($d2dd66cff767efeb$export$b9b3dfddab17db272);
  }, [
    isTextInput
  ], {
    isTextInput
  }), {
    isFocusVisible: isFocusVisibleState
  };
}
function $d2dd66cff767efeb$export$ec71b4b83ac08ec3(fn, deps, opts) {
  $d2dd66cff767efeb$var$setupGlobalFocusEvents(), (0, import_react17.useEffect)(() => {
    let handler = (modality, e10) => {
      !$d2dd66cff767efeb$var$isKeyboardFocusEvent(opts == null ? void 0 : opts.isTextInput, modality, e10) || fn($d2dd66cff767efeb$export$b9b3dfddab17db27());
    };
    return $d2dd66cff767efeb$var$changeHandlers.add(handler), () => {
      $d2dd66cff767efeb$var$changeHandlers.delete(handler);
    };
  }, deps);
}
var $d2acb2e6011484f7$exports = {};
$parcel$export4($d2acb2e6011484f7$exports, "useFocusWithin", () => $d2acb2e6011484f7$export$420e68273165f4ec);
function $d2acb2e6011484f7$export$420e68273165f4ec(props) {
  let state = (0, import_react17.useRef)({
    isFocusWithin: !1
  }).current;
  return props.isDisabled ? {
    focusWithinProps: {}
  } : {
    focusWithinProps: {
      onFocus: (e10) => {
        state.isFocusWithin || (props.onFocusWithin && props.onFocusWithin(e10), props.onFocusWithinChange && props.onFocusWithinChange(!0), state.isFocusWithin = !0);
      },
      onBlur: (e10) => {
        state.isFocusWithin && !e10.currentTarget.contains(e10.relatedTarget) && (props.onBlurWithin && props.onBlurWithin(e10), props.onFocusWithinChange && props.onFocusWithinChange(!1), state.isFocusWithin = !1);
      }
    }
  };
}
var $52a70f66afabebbb$exports = {};
$parcel$export4($52a70f66afabebbb$exports, "useHover", () => $52a70f66afabebbb$export$ae780daf29e6d456);
var $52a70f66afabebbb$var$globalIgnoreEmulatedMouseEvents = !1, $52a70f66afabebbb$var$hoverCount = 0;
function $52a70f66afabebbb$var$setGlobalIgnoreEmulatedMouseEvents() {
  $52a70f66afabebbb$var$globalIgnoreEmulatedMouseEvents = !0, setTimeout(() => {
    $52a70f66afabebbb$var$globalIgnoreEmulatedMouseEvents = !1;
  }, 50);
}
function $52a70f66afabebbb$var$handleGlobalPointerEvent(e10) {
  e10.pointerType === "touch" && $52a70f66afabebbb$var$setGlobalIgnoreEmulatedMouseEvents();
}
function $52a70f66afabebbb$var$setupGlobalTouchEvents() {
  if (!(typeof document > "u"))
    return typeof PointerEvent < "u" ? document.addEventListener("pointerup", $52a70f66afabebbb$var$handleGlobalPointerEvent) : document.addEventListener("touchend", $52a70f66afabebbb$var$setGlobalIgnoreEmulatedMouseEvents), $52a70f66afabebbb$var$hoverCount++, () => {
      $52a70f66afabebbb$var$hoverCount--, !($52a70f66afabebbb$var$hoverCount > 0) && (typeof PointerEvent < "u" ? document.removeEventListener("pointerup", $52a70f66afabebbb$var$handleGlobalPointerEvent) : document.removeEventListener("touchend", $52a70f66afabebbb$var$setGlobalIgnoreEmulatedMouseEvents));
    };
}
function $52a70f66afabebbb$export$ae780daf29e6d456(props) {
  let { onHoverStart, onHoverChange, onHoverEnd, isDisabled } = props, [isHovered, setHovered] = (0, import_react17.useState)(!1), state = (0, import_react17.useRef)({
    isHovered: !1,
    ignoreEmulatedMouseEvents: !1,
    pointerType: "",
    target: null
  }).current;
  (0, import_react17.useEffect)($52a70f66afabebbb$var$setupGlobalTouchEvents, []);
  let { hoverProps: hoverProps1, triggerHoverEnd: triggerHoverEnd1 } = (0, import_react17.useMemo)(() => {
    let triggerHoverStart = (event, pointerType) => {
      if (state.pointerType = pointerType, isDisabled || pointerType === "touch" || state.isHovered || !event.currentTarget.contains(event.target))
        return;
      state.isHovered = !0;
      let target = event.currentTarget;
      state.target = target, onHoverStart && onHoverStart({
        type: "hoverstart",
        target,
        pointerType
      }), onHoverChange && onHoverChange(!0), setHovered(!0);
    }, triggerHoverEnd = (event, pointerType) => {
      if (state.pointerType = "", state.target = null, pointerType === "touch" || !state.isHovered)
        return;
      state.isHovered = !1;
      let target = event.currentTarget;
      onHoverEnd && onHoverEnd({
        type: "hoverend",
        target,
        pointerType
      }), onHoverChange && onHoverChange(!1), setHovered(!1);
    }, hoverProps = {};
    return typeof PointerEvent < "u" ? (hoverProps.onPointerEnter = (e10) => {
      $52a70f66afabebbb$var$globalIgnoreEmulatedMouseEvents && e10.pointerType === "mouse" || triggerHoverStart(e10, e10.pointerType);
    }, hoverProps.onPointerLeave = (e10) => {
      !isDisabled && e10.currentTarget.contains(e10.target) && triggerHoverEnd(e10, e10.pointerType);
    }) : (hoverProps.onTouchStart = () => {
      state.ignoreEmulatedMouseEvents = !0;
    }, hoverProps.onMouseEnter = (e10) => {
      !state.ignoreEmulatedMouseEvents && !$52a70f66afabebbb$var$globalIgnoreEmulatedMouseEvents && triggerHoverStart(e10, "mouse"), state.ignoreEmulatedMouseEvents = !1;
    }, hoverProps.onMouseLeave = (e10) => {
      !isDisabled && e10.currentTarget.contains(e10.target) && triggerHoverEnd(e10, "mouse");
    }), {
      hoverProps,
      triggerHoverEnd
    };
  }, [
    onHoverStart,
    onHoverChange,
    onHoverEnd,
    isDisabled,
    state
  ]);
  return (0, import_react17.useEffect)(() => {
    isDisabled && triggerHoverEnd1({
      currentTarget: state.target
    }, state.pointerType);
  }, [
    isDisabled
  ]), {
    hoverProps: hoverProps1,
    isHovered
  };
}
var $ba9bc027ba236f10$exports = {};
$parcel$export4($ba9bc027ba236f10$exports, "useInteractOutside", () => $ba9bc027ba236f10$export$872b660ac5a1ff98);
function $ba9bc027ba236f10$export$872b660ac5a1ff98(props) {
  let { ref, onInteractOutside, isDisabled, onInteractOutsideStart } = props, state = (0, import_react17.useRef)({
    isPointerDown: !1,
    ignoreEmulatedMouseEvents: !1,
    onInteractOutside,
    onInteractOutsideStart
  }).current;
  state.onInteractOutside = onInteractOutside, state.onInteractOutsideStart = onInteractOutsideStart, (0, import_react17.useEffect)(() => {
    if (isDisabled)
      return;
    let onPointerDown = (e10) => {
      $ba9bc027ba236f10$var$isValidEvent(e10, ref) && state.onInteractOutside && (state.onInteractOutsideStart && state.onInteractOutsideStart(e10), state.isPointerDown = !0);
    };
    if (typeof PointerEvent < "u") {
      let onPointerUp = (e10) => {
        state.isPointerDown && state.onInteractOutside && $ba9bc027ba236f10$var$isValidEvent(e10, ref) && (state.isPointerDown = !1, state.onInteractOutside(e10));
      };
      return document.addEventListener("pointerdown", onPointerDown, !0), document.addEventListener("pointerup", onPointerUp, !0), () => {
        document.removeEventListener("pointerdown", onPointerDown, !0), document.removeEventListener("pointerup", onPointerUp, !0);
      };
    } else {
      let onMouseUp = (e10) => {
        state.ignoreEmulatedMouseEvents ? state.ignoreEmulatedMouseEvents = !1 : state.isPointerDown && state.onInteractOutside && $ba9bc027ba236f10$var$isValidEvent(e10, ref) && (state.isPointerDown = !1, state.onInteractOutside(e10));
      }, onTouchEnd = (e10) => {
        state.ignoreEmulatedMouseEvents = !0, state.onInteractOutside && state.isPointerDown && $ba9bc027ba236f10$var$isValidEvent(e10, ref) && (state.isPointerDown = !1, state.onInteractOutside(e10));
      };
      return document.addEventListener("mousedown", onPointerDown, !0), document.addEventListener("mouseup", onMouseUp, !0), document.addEventListener("touchstart", onPointerDown, !0), document.addEventListener("touchend", onTouchEnd, !0), () => {
        document.removeEventListener("mousedown", onPointerDown, !0), document.removeEventListener("mouseup", onMouseUp, !0), document.removeEventListener("touchstart", onPointerDown, !0), document.removeEventListener("touchend", onTouchEnd, !0);
      };
    }
  }, [
    ref,
    state,
    isDisabled
  ]);
}
function $ba9bc027ba236f10$var$isValidEvent(event, ref) {
  if (event.button > 0)
    return !1;
  if (event.target) {
    let ownerDocument = event.target.ownerDocument;
    if (!ownerDocument || !ownerDocument.documentElement.contains(event.target))
      return !1;
  }
  return ref.current && !ref.current.contains(event.target);
}
var $a866ba1020241f41$exports = {};
$parcel$export4($a866ba1020241f41$exports, "useKeyboard", () => $a866ba1020241f41$export$8f71654801c2f7cd);
function $23f3ec5b42541cce$export$48d1ea6320830260(handler) {
  if (!handler)
    return;
  let shouldStopPropagation = !0;
  return (e10) => {
    let event = {
      ...e10,
      preventDefault() {
        e10.preventDefault();
      },
      isDefaultPrevented() {
        return e10.isDefaultPrevented();
      },
      stopPropagation() {
        console.error("stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.");
      },
      continuePropagation() {
        shouldStopPropagation = !1;
      }
    };
    handler(event), shouldStopPropagation && e10.stopPropagation();
  };
}
function $a866ba1020241f41$export$8f71654801c2f7cd(props) {
  return {
    keyboardProps: props.isDisabled ? {} : {
      onKeyDown: $23f3ec5b42541cce$export$48d1ea6320830260(props.onKeyDown),
      onKeyUp: $23f3ec5b42541cce$export$48d1ea6320830260(props.onKeyUp)
    }
  };
}
var $75f78fec52a57cf7$exports = {};
$parcel$export4($75f78fec52a57cf7$exports, "useMove", () => $75f78fec52a57cf7$export$36da96379f79f245);
function $75f78fec52a57cf7$export$36da96379f79f245(props) {
  let { onMoveStart, onMove, onMoveEnd } = props, state = (0, import_react17.useRef)({
    didMove: !1,
    lastPosition: null,
    id: null
  }), { addGlobalListener, removeGlobalListener } = $042598a43c3fee40$export$4eaf04e54aa8eed6();
  return {
    moveProps: (0, import_react17.useMemo)(() => {
      let moveProps = {}, start = () => {
        $8714dea79b55b9da$export$16a4697467175487(), state.current.didMove = !1;
      }, move = (originalEvent, pointerType, deltaX, deltaY) => {
        deltaX === 0 && deltaY === 0 || (state.current.didMove || (state.current.didMove = !0, onMoveStart == null || onMoveStart({
          type: "movestart",
          pointerType,
          shiftKey: originalEvent.shiftKey,
          metaKey: originalEvent.metaKey,
          ctrlKey: originalEvent.ctrlKey,
          altKey: originalEvent.altKey
        })), onMove({
          type: "move",
          pointerType,
          deltaX,
          deltaY,
          shiftKey: originalEvent.shiftKey,
          metaKey: originalEvent.metaKey,
          ctrlKey: originalEvent.ctrlKey,
          altKey: originalEvent.altKey
        }));
      }, end = (originalEvent, pointerType) => {
        $8714dea79b55b9da$export$b0d6fa1ab32e3295(), state.current.didMove && (onMoveEnd == null || onMoveEnd({
          type: "moveend",
          pointerType,
          shiftKey: originalEvent.shiftKey,
          metaKey: originalEvent.metaKey,
          ctrlKey: originalEvent.ctrlKey,
          altKey: originalEvent.altKey
        }));
      };
      if (typeof PointerEvent > "u") {
        let onMouseMove = (e10) => {
          e10.button === 0 && (move(e10, "mouse", e10.pageX - state.current.lastPosition.pageX, e10.pageY - state.current.lastPosition.pageY), state.current.lastPosition = {
            pageX: e10.pageX,
            pageY: e10.pageY
          });
        }, onMouseUp = (e10) => {
          e10.button === 0 && (end(e10, "mouse"), removeGlobalListener(window, "mousemove", onMouseMove, !1), removeGlobalListener(window, "mouseup", onMouseUp, !1));
        };
        moveProps.onMouseDown = (e10) => {
          e10.button === 0 && (start(), e10.stopPropagation(), e10.preventDefault(), state.current.lastPosition = {
            pageX: e10.pageX,
            pageY: e10.pageY
          }, addGlobalListener(window, "mousemove", onMouseMove, !1), addGlobalListener(window, "mouseup", onMouseUp, !1));
        };
        let onTouchMove = (e10) => {
          let touch = [
            ...e10.changedTouches
          ].findIndex(
            ({ identifier }) => identifier === state.current.id
          );
          if (touch >= 0) {
            let { pageX, pageY } = e10.changedTouches[touch];
            move(e10, "touch", pageX - state.current.lastPosition.pageX, pageY - state.current.lastPosition.pageY), state.current.lastPosition = {
              pageX,
              pageY
            };
          }
        }, onTouchEnd = (e10) => {
          [
            ...e10.changedTouches
          ].findIndex(
            ({ identifier }) => identifier === state.current.id
          ) >= 0 && (end(e10, "touch"), state.current.id = null, removeGlobalListener(window, "touchmove", onTouchMove), removeGlobalListener(window, "touchend", onTouchEnd), removeGlobalListener(window, "touchcancel", onTouchEnd));
        };
        moveProps.onTouchStart = (e10) => {
          if (e10.changedTouches.length === 0 || state.current.id != null)
            return;
          let { pageX, pageY, identifier } = e10.changedTouches[0];
          start(), e10.stopPropagation(), e10.preventDefault(), state.current.lastPosition = {
            pageX,
            pageY
          }, state.current.id = identifier, addGlobalListener(window, "touchmove", onTouchMove, !1), addGlobalListener(window, "touchend", onTouchEnd, !1), addGlobalListener(window, "touchcancel", onTouchEnd, !1);
        };
      } else {
        let onPointerMove = (e10) => {
          if (e10.pointerId === state.current.id) {
            let pointerType = e10.pointerType || "mouse";
            move(e10, pointerType, e10.pageX - state.current.lastPosition.pageX, e10.pageY - state.current.lastPosition.pageY), state.current.lastPosition = {
              pageX: e10.pageX,
              pageY: e10.pageY
            };
          }
        }, onPointerUp = (e10) => {
          if (e10.pointerId === state.current.id) {
            let pointerType = e10.pointerType || "mouse";
            end(e10, pointerType), state.current.id = null, removeGlobalListener(window, "pointermove", onPointerMove, !1), removeGlobalListener(window, "pointerup", onPointerUp, !1), removeGlobalListener(window, "pointercancel", onPointerUp, !1);
          }
        };
        moveProps.onPointerDown = (e10) => {
          e10.button === 0 && state.current.id == null && (start(), e10.stopPropagation(), e10.preventDefault(), state.current.lastPosition = {
            pageX: e10.pageX,
            pageY: e10.pageY
          }, state.current.id = e10.pointerId, addGlobalListener(window, "pointermove", onPointerMove, !1), addGlobalListener(window, "pointerup", onPointerUp, !1), addGlobalListener(window, "pointercancel", onPointerUp, !1));
        };
      }
      let triggerKeyboardMove = (e10, deltaX, deltaY) => {
        start(), move(e10, "keyboard", deltaX, deltaY), end(e10, "keyboard");
      };
      return moveProps.onKeyDown = (e10) => {
        switch (e10.key) {
          case "Left":
          case "ArrowLeft":
            e10.preventDefault(), e10.stopPropagation(), triggerKeyboardMove(e10, -1, 0);
            break;
          case "Right":
          case "ArrowRight":
            e10.preventDefault(), e10.stopPropagation(), triggerKeyboardMove(e10, 1, 0);
            break;
          case "Up":
          case "ArrowUp":
            e10.preventDefault(), e10.stopPropagation(), triggerKeyboardMove(e10, 0, -1);
            break;
          case "Down":
          case "ArrowDown":
            e10.preventDefault(), e10.stopPropagation(), triggerKeyboardMove(e10, 0, 1);
            break;
        }
      }, moveProps;
    }, [
      state,
      onMoveStart,
      onMove,
      onMoveEnd,
      addGlobalListener,
      removeGlobalListener
    ])
  };
}
var $d19e70b846cd84a0$exports = {};
$parcel$export4($d19e70b846cd84a0$exports, "useScrollWheel", () => $d19e70b846cd84a0$export$2123ff2b87c81ca);
function $d19e70b846cd84a0$export$2123ff2b87c81ca(props, ref) {
  let { onScroll, isDisabled } = props, onScrollHandler = (0, import_react17.useCallback)((e10) => {
    e10.ctrlKey || (e10.preventDefault(), e10.stopPropagation(), onScroll && onScroll({
      deltaX: e10.deltaX,
      deltaY: e10.deltaY
    }));
  }, [
    onScroll
  ]);
  $6f85328eaea47571$export$90fc3a17d93f704c(ref, "wheel", isDisabled ? null : onScrollHandler);
}
var $ea9746f03755d5ba$exports = {};
$parcel$export4($ea9746f03755d5ba$exports, "useLongPress", () => $ea9746f03755d5ba$export$c24ed0104d07eab9);
var $ea9746f03755d5ba$var$DEFAULT_THRESHOLD = 500;
function $ea9746f03755d5ba$export$c24ed0104d07eab9(props) {
  let { isDisabled, onLongPressStart, onLongPressEnd, onLongPress, threshold = $ea9746f03755d5ba$var$DEFAULT_THRESHOLD, accessibilityDescription } = props, timeRef = (0, import_react17.useRef)(null), { addGlobalListener, removeGlobalListener } = $042598a43c3fee40$export$4eaf04e54aa8eed6(), { pressProps } = $bb70d401e0bbab2b$export$45712eceda6fad21({
    isDisabled,
    onPressStart(e1) {
      if ((e1.pointerType === "mouse" || e1.pointerType === "touch") && (onLongPressStart && onLongPressStart({
        ...e1,
        type: "longpressstart"
      }), timeRef.current = setTimeout(() => {
        e1.target.dispatchEvent(new PointerEvent("pointercancel", {
          bubbles: !0
        })), onLongPress && onLongPress({
          ...e1,
          type: "longpress"
        }), timeRef.current = null;
      }, threshold), e1.pointerType === "touch")) {
        let onContextMenu = (e10) => {
          e10.preventDefault();
        };
        addGlobalListener(e1.target, "contextmenu", onContextMenu, {
          once: !0
        }), addGlobalListener(window, "pointerup", () => {
          setTimeout(() => {
            removeGlobalListener(e1.target, "contextmenu", onContextMenu);
          }, 30);
        }, {
          once: !0
        });
      }
    },
    onPressEnd(e10) {
      timeRef.current && clearTimeout(timeRef.current), onLongPressEnd && (e10.pointerType === "mouse" || e10.pointerType === "touch") && onLongPressEnd({
        ...e10,
        type: "longpressend"
      });
    }
  }), descriptionProps = $5475261706737633$export$f8aeda7b10753fa1(onLongPress && !isDisabled ? accessibilityDescription : null);
  return {
    longPressProps: $699afe8e9e0f66de$export$9d1611c77c2fe928(pressProps, descriptionProps)
  };
}

// node_modules/@react-aria/focus/dist/module.js
function $parcel$export5(e10, n6, v3, s6) {
  Object.defineProperty(e10, n6, { get: v3, set: s6, enumerable: !0, configurable: !0 });
}
var $0238e4b796d1715f$exports = {};
$parcel$export5($0238e4b796d1715f$exports, "FocusScope", () => $0238e4b796d1715f$export$20e40289641fbbb6);
$parcel$export5($0238e4b796d1715f$exports, "useFocusManager", () => $0238e4b796d1715f$export$10c5169755ce7bd7);
$parcel$export5($0238e4b796d1715f$exports, "getFocusableTreeWalker", () => $0238e4b796d1715f$export$2d6ec8fc375ceafa);
$parcel$export5($0238e4b796d1715f$exports, "createFocusManager", () => $0238e4b796d1715f$export$c5251b9e124bf29);
var $f2c1256fdcfd2c09$exports = {};
$parcel$export5($f2c1256fdcfd2c09$exports, "focusSafely", () => $f2c1256fdcfd2c09$export$80f3e147d781571c);
function $f2c1256fdcfd2c09$export$80f3e147d781571c(element) {
  if ($d2dd66cff767efeb$export$630ff653c5ada6a9() === "virtual") {
    let lastFocusedElement = document.activeElement;
    $fdecdd2f4116564c$export$24490316f764c430(() => {
      document.activeElement === lastFocusedElement && document.contains(element) && $0172e2a3384c2851$export$de79e2c695e052f3(element);
    });
  } else
    $0172e2a3384c2851$export$de79e2c695e052f3(element);
}
function $c5775c2d6be42e6d$var$isStyleVisible(element) {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement))
    return !1;
  let { display, visibility } = element.style, isVisible = display !== "none" && visibility !== "hidden" && visibility !== "collapse";
  if (isVisible) {
    let { getComputedStyle: getComputedStyle2 } = element.ownerDocument.defaultView, { display: computedDisplay, visibility: computedVisibility } = getComputedStyle2(element);
    isVisible = computedDisplay !== "none" && computedVisibility !== "hidden" && computedVisibility !== "collapse";
  }
  return isVisible;
}
function $c5775c2d6be42e6d$var$isAttributeVisible(element, childElement) {
  return !element.hasAttribute("hidden") && (element.nodeName === "DETAILS" && childElement && childElement.nodeName !== "SUMMARY" ? element.hasAttribute("open") : !0);
}
function $c5775c2d6be42e6d$export$e989c0fffaa6b27a(element, childElement) {
  return element.nodeName !== "#comment" && $c5775c2d6be42e6d$var$isStyleVisible(element) && $c5775c2d6be42e6d$var$isAttributeVisible(element, childElement) && (!element.parentElement || $c5775c2d6be42e6d$export$e989c0fffaa6b27a(element.parentElement, element));
}
var $0238e4b796d1715f$var$FocusContext = /* @__PURE__ */ import_react18.default.createContext(null), $0238e4b796d1715f$var$activeScope = null, $0238e4b796d1715f$var$scopes = /* @__PURE__ */ new Map();
function $0238e4b796d1715f$export$20e40289641fbbb6(props) {
  let { children, contain, restoreFocus, autoFocus } = props, startRef = (0, import_react18.useRef)(), endRef = (0, import_react18.useRef)(), scopeRef = (0, import_react18.useRef)([]), ctx = (0, import_react18.useContext)($0238e4b796d1715f$var$FocusContext), parentScope = ctx == null ? void 0 : ctx.scopeRef;
  $62918828a5c4cefe$export$e5c5a5f917a5871c(() => {
    let node = startRef.current.nextSibling, nodes = [];
    for (; node && node !== endRef.current; )
      nodes.push(node), node = node.nextSibling;
    scopeRef.current = nodes;
  }, [
    children,
    parentScope
  ]), $62918828a5c4cefe$export$e5c5a5f917a5871c(() => ($0238e4b796d1715f$var$scopes.set(scopeRef, parentScope), () => {
    (scopeRef === $0238e4b796d1715f$var$activeScope || $0238e4b796d1715f$var$isAncestorScope(scopeRef, $0238e4b796d1715f$var$activeScope)) && (!parentScope || $0238e4b796d1715f$var$scopes.has(parentScope)) && ($0238e4b796d1715f$var$activeScope = parentScope), $0238e4b796d1715f$var$scopes.delete(scopeRef);
  }), [
    scopeRef,
    parentScope
  ]), $0238e4b796d1715f$var$useFocusContainment(scopeRef, contain), $0238e4b796d1715f$var$useRestoreFocus(scopeRef, restoreFocus, contain), $0238e4b796d1715f$var$useAutoFocus(scopeRef, autoFocus);
  let focusManager = $0238e4b796d1715f$var$createFocusManagerForScope(scopeRef);
  return /* @__PURE__ */ import_react18.default.createElement($0238e4b796d1715f$var$FocusContext.Provider, {
    value: {
      scopeRef,
      focusManager
    }
  }, /* @__PURE__ */ import_react18.default.createElement("span", {
    "data-focus-scope-start": !0,
    hidden: !0,
    ref: startRef
  }), children, /* @__PURE__ */ import_react18.default.createElement("span", {
    "data-focus-scope-end": !0,
    hidden: !0,
    ref: endRef
  }));
}
function $0238e4b796d1715f$export$10c5169755ce7bd7() {
  var _a;
  return (_a = (0, import_react18.useContext)($0238e4b796d1715f$var$FocusContext)) == null ? void 0 : _a.focusManager;
}
function $0238e4b796d1715f$var$createFocusManagerForScope(scopeRef) {
  return {
    focusNext(opts = {}) {
      let scope = scopeRef.current, { from: from2, tabbable, wrap } = opts, node = from2 || document.activeElement, sentinel = scope[0].previousElementSibling, walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa($0238e4b796d1715f$var$getScopeRoot(scope), {
        tabbable
      }, scope);
      walker.currentNode = $0238e4b796d1715f$var$isElementInScope(node, scope) ? node : sentinel;
      let nextNode = walker.nextNode();
      return !nextNode && wrap && (walker.currentNode = sentinel, nextNode = walker.nextNode()), nextNode && $0238e4b796d1715f$var$focusElement(nextNode, !0), nextNode;
    },
    focusPrevious(opts = {}) {
      let scope = scopeRef.current, { from: from2, tabbable, wrap } = opts, node = from2 || document.activeElement, sentinel = scope[scope.length - 1].nextElementSibling, walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa($0238e4b796d1715f$var$getScopeRoot(scope), {
        tabbable
      }, scope);
      walker.currentNode = $0238e4b796d1715f$var$isElementInScope(node, scope) ? node : sentinel;
      let previousNode = walker.previousNode();
      return !previousNode && wrap && (walker.currentNode = sentinel, previousNode = walker.previousNode()), previousNode && $0238e4b796d1715f$var$focusElement(previousNode, !0), previousNode;
    },
    focusFirst(opts = {}) {
      let scope = scopeRef.current, { tabbable } = opts, walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa($0238e4b796d1715f$var$getScopeRoot(scope), {
        tabbable
      }, scope);
      walker.currentNode = scope[0].previousElementSibling;
      let nextNode = walker.nextNode();
      return nextNode && $0238e4b796d1715f$var$focusElement(nextNode, !0), nextNode;
    },
    focusLast(opts = {}) {
      let scope = scopeRef.current, { tabbable } = opts, walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa($0238e4b796d1715f$var$getScopeRoot(scope), {
        tabbable
      }, scope);
      walker.currentNode = scope[scope.length - 1].nextElementSibling;
      let previousNode = walker.previousNode();
      return previousNode && $0238e4b796d1715f$var$focusElement(previousNode, !0), previousNode;
    }
  };
}
var $0238e4b796d1715f$var$focusableElements = [
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "summary",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]"
], $0238e4b796d1715f$var$FOCUSABLE_ELEMENT_SELECTOR = $0238e4b796d1715f$var$focusableElements.join(":not([hidden]),") + ",[tabindex]:not([disabled]):not([hidden])";
$0238e4b796d1715f$var$focusableElements.push('[tabindex]:not([tabindex="-1"]):not([disabled])');
var $0238e4b796d1715f$var$TABBABLE_ELEMENT_SELECTOR = $0238e4b796d1715f$var$focusableElements.join(':not([hidden]):not([tabindex="-1"]),');
function $0238e4b796d1715f$var$getScopeRoot(scope) {
  return scope[0].parentElement;
}
function $0238e4b796d1715f$var$useFocusContainment(scopeRef, contain) {
  let focusedNode = (0, import_react18.useRef)(), raf = (0, import_react18.useRef)(null);
  $62918828a5c4cefe$export$e5c5a5f917a5871c(() => {
    let scope1 = scopeRef.current;
    if (!contain)
      return;
    let onKeyDown = (e10) => {
      if (e10.key !== "Tab" || e10.altKey || e10.ctrlKey || e10.metaKey || scopeRef !== $0238e4b796d1715f$var$activeScope)
        return;
      let focusedElement = document.activeElement, scope = scopeRef.current;
      if (!$0238e4b796d1715f$var$isElementInScope(focusedElement, scope))
        return;
      let walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa($0238e4b796d1715f$var$getScopeRoot(scope), {
        tabbable: !0
      }, scope);
      walker.currentNode = focusedElement;
      let nextElement = e10.shiftKey ? walker.previousNode() : walker.nextNode();
      nextElement || (walker.currentNode = e10.shiftKey ? scope[scope.length - 1].nextElementSibling : scope[0].previousElementSibling, nextElement = e10.shiftKey ? walker.previousNode() : walker.nextNode()), e10.preventDefault(), nextElement && $0238e4b796d1715f$var$focusElement(nextElement, !0);
    }, onFocus = (e10) => {
      !$0238e4b796d1715f$var$activeScope || $0238e4b796d1715f$var$isAncestorScope($0238e4b796d1715f$var$activeScope, scopeRef) ? ($0238e4b796d1715f$var$activeScope = scopeRef, focusedNode.current = e10.target) : scopeRef === $0238e4b796d1715f$var$activeScope && !$0238e4b796d1715f$var$isElementInChildScope(e10.target, scopeRef) ? focusedNode.current ? focusedNode.current.focus() : $0238e4b796d1715f$var$activeScope && $0238e4b796d1715f$var$focusFirstInScope($0238e4b796d1715f$var$activeScope.current) : scopeRef === $0238e4b796d1715f$var$activeScope && (focusedNode.current = e10.target);
    }, onBlur = (e10) => {
      raf.current = requestAnimationFrame(() => {
        scopeRef === $0238e4b796d1715f$var$activeScope && !$0238e4b796d1715f$var$isElementInChildScope(document.activeElement, scopeRef) && ($0238e4b796d1715f$var$activeScope = scopeRef, focusedNode.current = e10.target, focusedNode.current.focus());
      });
    };
    return document.addEventListener("keydown", onKeyDown, !1), document.addEventListener("focusin", onFocus, !1), scope1.forEach(
      (element) => element.addEventListener("focusin", onFocus, !1)
    ), scope1.forEach(
      (element) => element.addEventListener("focusout", onBlur, !1)
    ), () => {
      document.removeEventListener("keydown", onKeyDown, !1), document.removeEventListener("focusin", onFocus, !1), scope1.forEach(
        (element) => element.removeEventListener("focusin", onFocus, !1)
      ), scope1.forEach(
        (element) => element.removeEventListener("focusout", onBlur, !1)
      );
    };
  }, [
    scopeRef,
    contain
  ]), (0, import_react18.useEffect)(() => () => cancelAnimationFrame(raf.current), [
    raf
  ]);
}
function $0238e4b796d1715f$var$isElementInAnyScope(element) {
  for (let scope of $0238e4b796d1715f$var$scopes.keys())
    if ($0238e4b796d1715f$var$isElementInScope(element, scope.current))
      return !0;
  return !1;
}
function $0238e4b796d1715f$var$isElementInScope(element, scope) {
  return scope.some(
    (node) => node.contains(element)
  );
}
function $0238e4b796d1715f$var$isElementInChildScope(element, scope) {
  for (let s6 of $0238e4b796d1715f$var$scopes.keys())
    if ((s6 === scope || $0238e4b796d1715f$var$isAncestorScope(scope, s6)) && $0238e4b796d1715f$var$isElementInScope(element, s6.current))
      return !0;
  return !1;
}
function $0238e4b796d1715f$var$isAncestorScope(ancestor, scope) {
  let parent = $0238e4b796d1715f$var$scopes.get(scope);
  return parent ? parent === ancestor ? !0 : $0238e4b796d1715f$var$isAncestorScope(ancestor, parent) : !1;
}
function $0238e4b796d1715f$var$focusElement(element, scroll = !1) {
  if (element != null && !scroll)
    try {
      $f2c1256fdcfd2c09$export$80f3e147d781571c(element);
    } catch {
    }
  else if (element != null)
    try {
      element.focus();
    } catch {
    }
}
function $0238e4b796d1715f$var$focusFirstInScope(scope) {
  let sentinel = scope[0].previousElementSibling, walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa($0238e4b796d1715f$var$getScopeRoot(scope), {
    tabbable: !0
  }, scope);
  walker.currentNode = sentinel, $0238e4b796d1715f$var$focusElement(walker.nextNode());
}
function $0238e4b796d1715f$var$useAutoFocus(scopeRef, autoFocus) {
  let autoFocusRef = import_react18.default.useRef(autoFocus);
  (0, import_react18.useEffect)(() => {
    autoFocusRef.current && ($0238e4b796d1715f$var$activeScope = scopeRef, $0238e4b796d1715f$var$isElementInScope(document.activeElement, $0238e4b796d1715f$var$activeScope.current) || $0238e4b796d1715f$var$focusFirstInScope(scopeRef.current)), autoFocusRef.current = !1;
  }, []);
}
function $0238e4b796d1715f$var$useRestoreFocus(scopeRef, restoreFocus, contain) {
  let nodeToRestoreRef = (0, import_react18.useRef)(typeof document < "u" ? document.activeElement : null);
  $62918828a5c4cefe$export$e5c5a5f917a5871c(() => {
    let nodeToRestore = nodeToRestoreRef.current;
    if (!restoreFocus)
      return;
    let onKeyDown = (e10) => {
      if (e10.key !== "Tab" || e10.altKey || e10.ctrlKey || e10.metaKey)
        return;
      let focusedElement = document.activeElement;
      if (!$0238e4b796d1715f$var$isElementInScope(focusedElement, scopeRef.current))
        return;
      let walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa(document.body, {
        tabbable: !0
      });
      walker.currentNode = focusedElement;
      let nextElement = e10.shiftKey ? walker.previousNode() : walker.nextNode();
      if ((!document.body.contains(nodeToRestore) || nodeToRestore === document.body) && (nodeToRestore = null), (!nextElement || !$0238e4b796d1715f$var$isElementInScope(nextElement, scopeRef.current)) && nodeToRestore) {
        walker.currentNode = nodeToRestore;
        do
          nextElement = e10.shiftKey ? walker.previousNode() : walker.nextNode();
        while ($0238e4b796d1715f$var$isElementInScope(nextElement, scopeRef.current));
        e10.preventDefault(), e10.stopPropagation(), nextElement ? $0238e4b796d1715f$var$focusElement(nextElement, !0) : $0238e4b796d1715f$var$isElementInAnyScope(nodeToRestore) ? $0238e4b796d1715f$var$focusElement(nodeToRestore, !0) : focusedElement.blur();
      }
    };
    return contain || document.addEventListener("keydown", onKeyDown, !0), () => {
      contain || document.removeEventListener("keydown", onKeyDown, !0), restoreFocus && nodeToRestore && $0238e4b796d1715f$var$isElementInScope(document.activeElement, scopeRef.current) && requestAnimationFrame(() => {
        document.body.contains(nodeToRestore) && $0238e4b796d1715f$var$focusElement(nodeToRestore);
      });
    };
  }, [
    scopeRef,
    restoreFocus,
    contain
  ]);
}
function $0238e4b796d1715f$export$2d6ec8fc375ceafa(root, opts, scope) {
  let selector = opts != null && opts.tabbable ? $0238e4b796d1715f$var$TABBABLE_ELEMENT_SELECTOR : $0238e4b796d1715f$var$FOCUSABLE_ELEMENT_SELECTOR, walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      var _a;
      return (_a = opts == null ? void 0 : opts.from) != null && _a.contains(node) ? NodeFilter.FILTER_REJECT : node.matches(selector) && $c5775c2d6be42e6d$export$e989c0fffaa6b27a(node) && (!scope || $0238e4b796d1715f$var$isElementInScope(node, scope)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  return opts != null && opts.from && (walker.currentNode = opts.from), walker;
}
function $0238e4b796d1715f$export$c5251b9e124bf29(ref) {
  return {
    focusNext(opts = {}) {
      let root = ref.current, { from: from2, tabbable, wrap } = opts, node = from2 || document.activeElement, walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa(root, {
        tabbable
      });
      root.contains(node) && (walker.currentNode = node);
      let nextNode = walker.nextNode();
      return !nextNode && wrap && (walker.currentNode = root, nextNode = walker.nextNode()), nextNode && $0238e4b796d1715f$var$focusElement(nextNode, !0), nextNode;
    },
    focusPrevious(opts = {}) {
      let root = ref.current, { from: from2, tabbable, wrap } = opts, node = from2 || document.activeElement, walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa(root, {
        tabbable
      });
      if (root.contains(node))
        walker.currentNode = node;
      else {
        let next = $0238e4b796d1715f$var$last(walker);
        return next && $0238e4b796d1715f$var$focusElement(next, !0), next;
      }
      let previousNode = walker.previousNode();
      return !previousNode && wrap && (walker.currentNode = root, previousNode = $0238e4b796d1715f$var$last(walker)), previousNode && $0238e4b796d1715f$var$focusElement(previousNode, !0), previousNode;
    },
    focusFirst(opts = {}) {
      let root = ref.current, { tabbable } = opts, nextNode = $0238e4b796d1715f$export$2d6ec8fc375ceafa(root, {
        tabbable
      }).nextNode();
      return nextNode && $0238e4b796d1715f$var$focusElement(nextNode, !0), nextNode;
    },
    focusLast(opts = {}) {
      let root = ref.current, { tabbable } = opts, walker = $0238e4b796d1715f$export$2d6ec8fc375ceafa(root, {
        tabbable
      }), next = $0238e4b796d1715f$var$last(walker);
      return next && $0238e4b796d1715f$var$focusElement(next, !0), next;
    }
  };
}
function $0238e4b796d1715f$var$last(walker) {
  let next, last;
  do
    last = walker.lastChild(), last && (next = last);
  while (last);
  return next;
}
var $db88f84346fe3322$exports = {};
$parcel$export5($db88f84346fe3322$exports, "FocusRing", () => $db88f84346fe3322$export$1a38b4ad7f578e1d);
var $e974583017b16a4e$exports = {};
$parcel$export5($e974583017b16a4e$exports, "useFocusRing", () => $e974583017b16a4e$export$4e328f61c538687f);
function $e974583017b16a4e$export$4e328f61c538687f(props = {}) {
  let { autoFocus = !1, isTextInput, within } = props, state = (0, import_react18.useRef)({
    isFocused: !1,
    isFocusVisible: autoFocus || $d2dd66cff767efeb$export$b9b3dfddab17db27()
  }).current, [isFocused1, setFocused] = (0, import_react18.useState)(!1), [isFocusVisibleState, setFocusVisible] = (0, import_react18.useState)(
    () => state.isFocused && state.isFocusVisible
  ), updateState = () => setFocusVisible(state.isFocused && state.isFocusVisible), onFocusChange = (isFocused) => {
    state.isFocused = isFocused, setFocused(isFocused), updateState();
  };
  $d2dd66cff767efeb$export$ec71b4b83ac08ec3((isFocusVisible) => {
    state.isFocusVisible = isFocusVisible, updateState();
  }, [], {
    isTextInput
  });
  let { focusProps } = $96cd623b8d5dd15d$export$f8168d8dd8fd66e6({
    isDisabled: within,
    onFocusChange
  }), { focusWithinProps } = $d2acb2e6011484f7$export$420e68273165f4ec({
    isDisabled: !within,
    onFocusWithinChange: onFocusChange
  });
  return {
    isFocused: isFocused1,
    isFocusVisible: state.isFocused && isFocusVisibleState,
    focusProps: within ? focusWithinProps : focusProps
  };
}
function $db88f84346fe3322$export$1a38b4ad7f578e1d(props) {
  let { children, focusClass, focusRingClass } = props, { isFocused, isFocusVisible, focusProps } = $e974583017b16a4e$export$4e328f61c538687f(props), child = import_react18.default.Children.only(children);
  return /* @__PURE__ */ import_react18.default.cloneElement(child, $699afe8e9e0f66de$export$9d1611c77c2fe928(child.props, {
    ...focusProps,
    className: clsx_m_default({
      [focusClass || ""]: isFocused,
      [focusRingClass || ""]: isFocusVisible
    })
  }));
}
var $e82d8245213b3ebf$exports = {};
$parcel$export5($e82d8245213b3ebf$exports, "FocusableProvider", () => $e82d8245213b3ebf$export$13f3202a3e5ddd5);
$parcel$export5($e82d8245213b3ebf$exports, "useFocusable", () => $e82d8245213b3ebf$export$4c014de7c8940b4c);
var $e82d8245213b3ebf$var$FocusableContext = /* @__PURE__ */ import_react18.default.createContext(null);
function $e82d8245213b3ebf$var$useFocusableContext(ref) {
  let context = (0, import_react18.useContext)($e82d8245213b3ebf$var$FocusableContext) || {};
  $518b8f251641d71b$export$4debdb1a3f0fa79e(context, ref);
  let { ref: _, ...otherProps } = context;
  return otherProps;
}
function $e82d8245213b3ebf$var$FocusableProvider(props, ref) {
  let { children, ...otherProps } = props, context = {
    ...otherProps,
    ref
  };
  return /* @__PURE__ */ import_react18.default.createElement($e82d8245213b3ebf$var$FocusableContext.Provider, {
    value: context
  }, children);
}
var $e82d8245213b3ebf$export$13f3202a3e5ddd5 = /* @__PURE__ */ import_react18.default.forwardRef($e82d8245213b3ebf$var$FocusableProvider);
function $e82d8245213b3ebf$export$4c014de7c8940b4c(props, domRef) {
  let { focusProps } = $96cd623b8d5dd15d$export$f8168d8dd8fd66e6(props), { keyboardProps } = $a866ba1020241f41$export$8f71654801c2f7cd(props), interactions = $699afe8e9e0f66de$export$9d1611c77c2fe928(focusProps, keyboardProps), domProps = $e82d8245213b3ebf$var$useFocusableContext(domRef), interactionProps = props.isDisabled ? {} : domProps, autoFocusRef = (0, import_react18.useRef)(props.autoFocus);
  return (0, import_react18.useEffect)(() => {
    autoFocusRef.current && domRef.current && domRef.current.focus(), autoFocusRef.current = !1;
  }, []), {
    focusableProps: $699afe8e9e0f66de$export$9d1611c77c2fe928({
      ...interactions,
      tabIndex: props.excludeFromTabOrder && !props.isDisabled ? -1 : void 0
    }, interactionProps)
  };
}

// node_modules/@react-aria/button/node_modules/@react-aria/utils/dist/module.js
var import_react19 = __toESM(require_react());
function $parcel$export6(e10, n6, v3, s6) {
  Object.defineProperty(e10, n6, { get: v3, set: s6, enumerable: !0, configurable: !0 });
}
var $bdb11010cef70236$exports = {};
$parcel$export6($bdb11010cef70236$exports, "useId", () => $bdb11010cef70236$export$f680877a34711e37);
$parcel$export6($bdb11010cef70236$exports, "mergeIds", () => $bdb11010cef70236$export$cd8c9cb68f842629);
$parcel$export6($bdb11010cef70236$exports, "useSlotId", () => $bdb11010cef70236$export$b4cc09c592e8fdb8);
var $f0a04ccd8dbdd83b$exports = {};
$parcel$export6($f0a04ccd8dbdd83b$exports, "useLayoutEffect", () => $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c);
var $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c = typeof window < "u" ? import_react19.default.useLayoutEffect : () => {
}, $bdb11010cef70236$var$idsUpdaterMap = /* @__PURE__ */ new Map();
function $bdb11010cef70236$export$f680877a34711e37(defaultId) {
  let isRendering = (0, import_react19.useRef)(!0);
  isRendering.current = !0;
  let [value, setValue] = (0, import_react19.useState)(defaultId), nextId = (0, import_react19.useRef)(null), res = $9d939cbc98267846$export$619500959fc48b26(value), updateValue = (val) => {
    isRendering.current ? nextId.current = val : setValue(val);
  };
  return $bdb11010cef70236$var$idsUpdaterMap.set(res, updateValue), $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    isRendering.current = !1;
  }, [
    updateValue
  ]), $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    let r8 = res;
    return () => {
      $bdb11010cef70236$var$idsUpdaterMap.delete(r8);
    };
  }, [
    res
  ]), (0, import_react19.useEffect)(() => {
    let newId = nextId.current;
    newId && (setValue(newId), nextId.current = null);
  }, [
    setValue,
    updateValue
  ]), res;
}
function $bdb11010cef70236$export$cd8c9cb68f842629(idA, idB) {
  if (idA === idB)
    return idA;
  let setIdA = $bdb11010cef70236$var$idsUpdaterMap.get(idA);
  if (setIdA)
    return setIdA(idB), idB;
  let setIdB = $bdb11010cef70236$var$idsUpdaterMap.get(idB);
  return setIdB ? (setIdB(idA), idA) : idB;
}
function $bdb11010cef70236$export$b4cc09c592e8fdb8(depArray = []) {
  let id = $bdb11010cef70236$export$f680877a34711e37(), [resolvedId, setResolvedId] = $1dbecbe27a04f9af$export$14d238f342723f25(id), updateId = (0, import_react19.useCallback)(() => {
    setResolvedId(function* () {
      yield id, yield document.getElementById(id) ? id : null;
    });
  }, [
    id,
    setResolvedId
  ]);
  return $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(updateId, [
    id,
    updateId,
    ...depArray
  ]), resolvedId;
}
var $ff5963eb1fccf552$exports = {};
$parcel$export6($ff5963eb1fccf552$exports, "chain", () => $ff5963eb1fccf552$export$e08e3b67e392101e);
function $ff5963eb1fccf552$export$e08e3b67e392101e(...callbacks) {
  return (...args) => {
    for (let callback of callbacks)
      typeof callback == "function" && callback(...args);
  };
}
var $3ef42575df84b30b$exports = {};
$parcel$export6($3ef42575df84b30b$exports, "mergeProps", () => $3ef42575df84b30b$export$9d1611c77c2fe928);
function $3ef42575df84b30b$export$9d1611c77c2fe928(...args) {
  let result = {
    ...args[0]
  };
  for (let i5 = 1; i5 < args.length; i5++) {
    let props = args[i5];
    for (let key in props) {
      let a4 = result[key], b3 = props[key];
      typeof a4 == "function" && typeof b3 == "function" && key[0] === "o" && key[1] === "n" && key.charCodeAt(2) >= 65 && key.charCodeAt(2) <= 90 ? result[key] = $ff5963eb1fccf552$export$e08e3b67e392101e(a4, b3) : (key === "className" || key === "UNSAFE_className") && typeof a4 == "string" && typeof b3 == "string" ? result[key] = clsx_m_default(a4, b3) : key === "id" && a4 && b3 ? result.id = $bdb11010cef70236$export$cd8c9cb68f842629(a4, b3) : result[key] = b3 !== void 0 ? b3 : a4;
    }
  }
  return result;
}
var $65484d02dcb7eb3e$exports = {};
$parcel$export6($65484d02dcb7eb3e$exports, "filterDOMProps", () => $65484d02dcb7eb3e$export$457c3d6518dd4c6f);
var $65484d02dcb7eb3e$var$DOMPropNames = /* @__PURE__ */ new Set([
  "id"
]), $65484d02dcb7eb3e$var$labelablePropNames = /* @__PURE__ */ new Set([
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-details"
]), $65484d02dcb7eb3e$var$propRe = /^(data-.*)$/;
function $65484d02dcb7eb3e$export$457c3d6518dd4c6f(props, opts = {}) {
  let { labelable, propNames } = opts, filteredProps = {};
  for (let prop in props)
    Object.prototype.hasOwnProperty.call(props, prop) && ($65484d02dcb7eb3e$var$DOMPropNames.has(prop) || labelable && $65484d02dcb7eb3e$var$labelablePropNames.has(prop) || (propNames == null ? void 0 : propNames.has(prop)) || $65484d02dcb7eb3e$var$propRe.test(prop)) && (filteredProps[prop] = props[prop]);
  return filteredProps;
}
var $7215afc6de606d6b$exports = {};
$parcel$export6($7215afc6de606d6b$exports, "focusWithoutScrolling", () => $7215afc6de606d6b$export$de79e2c695e052f3);
function $7215afc6de606d6b$export$de79e2c695e052f3(element) {
  if ($7215afc6de606d6b$var$supportsPreventScroll())
    element.focus({
      preventScroll: !0
    });
  else {
    let scrollableElements = $7215afc6de606d6b$var$getScrollableElements(element);
    element.focus(), $7215afc6de606d6b$var$restoreScrollPosition(scrollableElements);
  }
}
var $7215afc6de606d6b$var$supportsPreventScrollCached = null;
function $7215afc6de606d6b$var$supportsPreventScroll() {
  if ($7215afc6de606d6b$var$supportsPreventScrollCached == null) {
    $7215afc6de606d6b$var$supportsPreventScrollCached = !1;
    try {
      var focusElem = document.createElement("div");
      focusElem.focus({
        get preventScroll() {
          return $7215afc6de606d6b$var$supportsPreventScrollCached = !0, !0;
        }
      });
    } catch {
    }
  }
  return $7215afc6de606d6b$var$supportsPreventScrollCached;
}
function $7215afc6de606d6b$var$getScrollableElements(element) {
  for (var parent = element.parentNode, scrollableElements = [], rootScrollingElement = document.scrollingElement || document.documentElement; parent instanceof HTMLElement && parent !== rootScrollingElement; )
    (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) && scrollableElements.push({
      element: parent,
      scrollTop: parent.scrollTop,
      scrollLeft: parent.scrollLeft
    }), parent = parent.parentNode;
  return rootScrollingElement instanceof HTMLElement && scrollableElements.push({
    element: rootScrollingElement,
    scrollTop: rootScrollingElement.scrollTop,
    scrollLeft: rootScrollingElement.scrollLeft
  }), scrollableElements;
}
function $7215afc6de606d6b$var$restoreScrollPosition(scrollableElements) {
  for (let { element, scrollTop, scrollLeft } of scrollableElements)
    element.scrollTop = scrollTop, element.scrollLeft = scrollLeft;
}
var $ab71dadb03a6fb2e$exports = {};
$parcel$export6($ab71dadb03a6fb2e$exports, "getOffset", () => $ab71dadb03a6fb2e$export$622cea445a1c5b7d);
function $ab71dadb03a6fb2e$export$622cea445a1c5b7d(element, reverse, orientation = "horizontal") {
  let rect = element.getBoundingClientRect();
  return reverse ? orientation === "horizontal" ? rect.right : rect.bottom : orientation === "horizontal" ? rect.left : rect.top;
}
var $103b0e103f1b5952$exports = {};
$parcel$export6($103b0e103f1b5952$exports, "clamp", () => $48d9f1d165180307$export$7d15b64cf5a3a4c4);
$parcel$export6($103b0e103f1b5952$exports, "snapValueToStep", () => $48d9f1d165180307$export$cb6e0bb50bc19463);
var $bbed8b41f857bcc0$exports = {};
$parcel$export6($bbed8b41f857bcc0$exports, "runAfterTransition", () => $bbed8b41f857bcc0$export$24490316f764c430);
var $bbed8b41f857bcc0$var$transitionsByElement = /* @__PURE__ */ new Map(), $bbed8b41f857bcc0$var$transitionCallbacks = /* @__PURE__ */ new Set();
function $bbed8b41f857bcc0$var$setupGlobalEvents() {
  if (typeof window > "u")
    return;
  let onTransitionStart = (e10) => {
    let transitions = $bbed8b41f857bcc0$var$transitionsByElement.get(e10.target);
    transitions || (transitions = /* @__PURE__ */ new Set(), $bbed8b41f857bcc0$var$transitionsByElement.set(e10.target, transitions), e10.target.addEventListener("transitioncancel", onTransitionEnd)), transitions.add(e10.propertyName);
  }, onTransitionEnd = (e10) => {
    let properties = $bbed8b41f857bcc0$var$transitionsByElement.get(e10.target);
    if (!!properties && (properties.delete(e10.propertyName), properties.size === 0 && (e10.target.removeEventListener("transitioncancel", onTransitionEnd), $bbed8b41f857bcc0$var$transitionsByElement.delete(e10.target)), $bbed8b41f857bcc0$var$transitionsByElement.size === 0)) {
      for (let cb of $bbed8b41f857bcc0$var$transitionCallbacks)
        cb();
      $bbed8b41f857bcc0$var$transitionCallbacks.clear();
    }
  };
  document.body.addEventListener("transitionrun", onTransitionStart), document.body.addEventListener("transitionend", onTransitionEnd);
}
typeof document < "u" && (document.readyState !== "loading" ? $bbed8b41f857bcc0$var$setupGlobalEvents() : document.addEventListener("DOMContentLoaded", $bbed8b41f857bcc0$var$setupGlobalEvents));
function $bbed8b41f857bcc0$export$24490316f764c430(fn) {
  requestAnimationFrame(() => {
    $bbed8b41f857bcc0$var$transitionsByElement.size === 0 ? fn() : $bbed8b41f857bcc0$var$transitionCallbacks.add(fn);
  });
}
var $9cc09df9fd7676be$exports = {};
$parcel$export6($9cc09df9fd7676be$exports, "useDrag1D", () => $9cc09df9fd7676be$export$7bbed75feba39706);
var $9cc09df9fd7676be$var$draggingElements = [];
function $9cc09df9fd7676be$export$7bbed75feba39706(props) {
  console.warn("useDrag1D is deprecated, please use `useMove` instead https://react-spectrum.adobe.com/react-aria/useMove.html");
  let { containerRef, reverse, orientation, onHover, onDrag, onPositionChange, onIncrement, onDecrement, onIncrementToMax, onDecrementToMin, onCollapseToggle } = props, getPosition = (e10) => orientation === "horizontal" ? e10.clientX : e10.clientY, getNextOffset = (e10) => {
    let containerOffset = $ab71dadb03a6fb2e$export$622cea445a1c5b7d(containerRef.current, reverse, orientation), mouseOffset = getPosition(e10);
    return reverse ? containerOffset - mouseOffset : mouseOffset - containerOffset;
  }, dragging = (0, import_react19.useRef)(!1), prevPosition = (0, import_react19.useRef)(0), handlers = (0, import_react19.useRef)({
    onPositionChange,
    onDrag
  });
  handlers.current.onDrag = onDrag, handlers.current.onPositionChange = onPositionChange;
  let onMouseDragged = (e10) => {
    e10.preventDefault();
    let nextOffset = getNextOffset(e10);
    dragging.current || (dragging.current = !0, handlers.current.onDrag && handlers.current.onDrag(!0), handlers.current.onPositionChange && handlers.current.onPositionChange(nextOffset)), prevPosition.current !== nextOffset && (prevPosition.current = nextOffset, onPositionChange && onPositionChange(nextOffset));
  }, onMouseUp = (e10) => {
    let target = e10.target;
    dragging.current = !1;
    let nextOffset = getNextOffset(e10);
    handlers.current.onDrag && handlers.current.onDrag(!1), handlers.current.onPositionChange && handlers.current.onPositionChange(nextOffset), $9cc09df9fd7676be$var$draggingElements.splice($9cc09df9fd7676be$var$draggingElements.indexOf(target), 1), window.removeEventListener("mouseup", onMouseUp, !1), window.removeEventListener("mousemove", onMouseDragged, !1);
  };
  return {
    onMouseDown: (e10) => {
      let target = e10.currentTarget;
      $9cc09df9fd7676be$var$draggingElements.some(
        (elt) => target.contains(elt)
      ) || ($9cc09df9fd7676be$var$draggingElements.push(target), window.addEventListener("mousemove", onMouseDragged, !1), window.addEventListener("mouseup", onMouseUp, !1));
    },
    onMouseEnter: () => {
      onHover && onHover(!0);
    },
    onMouseOut: () => {
      onHover && onHover(!1);
    },
    onKeyDown: (e10) => {
      switch (e10.key) {
        case "Left":
        case "ArrowLeft":
          orientation === "horizontal" && (e10.preventDefault(), onDecrement && !reverse ? onDecrement() : onIncrement && reverse && onIncrement());
          break;
        case "Up":
        case "ArrowUp":
          orientation === "vertical" && (e10.preventDefault(), onDecrement && !reverse ? onDecrement() : onIncrement && reverse && onIncrement());
          break;
        case "Right":
        case "ArrowRight":
          orientation === "horizontal" && (e10.preventDefault(), onIncrement && !reverse ? onIncrement() : onDecrement && reverse && onDecrement());
          break;
        case "Down":
        case "ArrowDown":
          orientation === "vertical" && (e10.preventDefault(), onIncrement && !reverse ? onIncrement() : onDecrement && reverse && onDecrement());
          break;
        case "Home":
          e10.preventDefault(), onDecrementToMin && onDecrementToMin();
          break;
        case "End":
          e10.preventDefault(), onIncrementToMax && onIncrementToMax();
          break;
        case "Enter":
          e10.preventDefault(), onCollapseToggle && onCollapseToggle();
          break;
      }
    }
  };
}
var $03deb23ff14920c4$exports = {};
$parcel$export6($03deb23ff14920c4$exports, "useGlobalListeners", () => $03deb23ff14920c4$export$4eaf04e54aa8eed6);
function $03deb23ff14920c4$export$4eaf04e54aa8eed6() {
  let globalListeners = (0, import_react19.useRef)(/* @__PURE__ */ new Map()), addGlobalListener = (0, import_react19.useCallback)((eventTarget, type, listener, options) => {
    let fn = options != null && options.once ? (...args) => {
      globalListeners.current.delete(listener), listener(...args);
    } : listener;
    globalListeners.current.set(listener, {
      type,
      eventTarget,
      fn,
      options
    }), eventTarget.addEventListener(type, listener, options);
  }, []), removeGlobalListener = (0, import_react19.useCallback)((eventTarget, type, listener, options) => {
    var ref;
    let fn = ((ref = globalListeners.current.get(listener)) === null || ref === void 0 ? void 0 : ref.fn) || listener;
    eventTarget.removeEventListener(type, fn, options), globalListeners.current.delete(listener);
  }, []), removeAllGlobalListeners = (0, import_react19.useCallback)(() => {
    globalListeners.current.forEach((value, key) => {
      removeGlobalListener(value.eventTarget, value.type, key, value.options);
    });
  }, [
    removeGlobalListener
  ]);
  return (0, import_react19.useEffect)(() => removeAllGlobalListeners, [
    removeAllGlobalListeners
  ]), {
    addGlobalListener,
    removeGlobalListener,
    removeAllGlobalListeners
  };
}
var $313b98861ee5dd6c$exports = {};
$parcel$export6($313b98861ee5dd6c$exports, "useLabels", () => $313b98861ee5dd6c$export$d6875122194c7b44);
function $313b98861ee5dd6c$export$d6875122194c7b44(props, defaultLabel) {
  let { id, "aria-label": label, "aria-labelledby": labelledBy } = props;
  return id = $bdb11010cef70236$export$f680877a34711e37(id), labelledBy && label ? labelledBy = [
    .../* @__PURE__ */ new Set([
      ...labelledBy.trim().split(/\s+/),
      id
    ])
  ].join(" ") : labelledBy && (labelledBy = labelledBy.trim().split(/\s+/).join(" ")), !label && !labelledBy && defaultLabel && (label = defaultLabel), {
    id,
    "aria-label": label,
    "aria-labelledby": labelledBy
  };
}
var $df56164dff5785e2$exports = {};
$parcel$export6($df56164dff5785e2$exports, "useObjectRef", () => $df56164dff5785e2$export$4338b53315abf666);
function $df56164dff5785e2$export$4338b53315abf666(forwardedRef) {
  let objRef = (0, import_react19.useRef)();
  return $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    !forwardedRef || (typeof forwardedRef == "function" ? forwardedRef(objRef.current) : forwardedRef.current = objRef.current);
  }, [
    forwardedRef
  ]), objRef;
}
var $4f58c5f72bcf79f7$exports = {};
$parcel$export6($4f58c5f72bcf79f7$exports, "useUpdateEffect", () => $4f58c5f72bcf79f7$export$496315a1608d9602);
function $4f58c5f72bcf79f7$export$496315a1608d9602(effect, dependencies) {
  let isInitialMount = (0, import_react19.useRef)(!0);
  (0, import_react19.useEffect)(() => {
    isInitialMount.current ? isInitialMount.current = !1 : effect();
  }, dependencies);
}
var $9daab02d461809db$exports = {};
$parcel$export6($9daab02d461809db$exports, "useResizeObserver", () => $9daab02d461809db$export$683480f191c0e3ea);
function $9daab02d461809db$var$hasResizeObserver() {
  return typeof window.ResizeObserver < "u";
}
function $9daab02d461809db$export$683480f191c0e3ea(options) {
  let { ref, onResize } = options;
  (0, import_react19.useEffect)(() => {
    let element = ref == null ? void 0 : ref.current;
    if (!!element)
      if ($9daab02d461809db$var$hasResizeObserver()) {
        let resizeObserverInstance = new window.ResizeObserver((entries) => {
          !entries.length || onResize();
        });
        return resizeObserverInstance.observe(element), () => {
          element && resizeObserverInstance.unobserve(element);
        };
      } else
        return window.addEventListener("resize", onResize, !1), () => {
          window.removeEventListener("resize", onResize, !1);
        };
  }, [
    onResize,
    ref
  ]);
}
var $e7801be82b4b2a53$exports = {};
$parcel$export6($e7801be82b4b2a53$exports, "useSyncRef", () => $e7801be82b4b2a53$export$4debdb1a3f0fa79e);
function $e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, ref) {
  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    if (context && context.ref && ref)
      return context.ref.current = ref.current, () => {
        context.ref.current = null;
      };
  }, [
    context,
    ref
  ]);
}
var $62d8ded9296f3872$exports = {};
$parcel$export6($62d8ded9296f3872$exports, "getScrollParent", () => $62d8ded9296f3872$export$cfa2225e87938781);
function $62d8ded9296f3872$export$cfa2225e87938781(node) {
  for (; node && !$62d8ded9296f3872$var$isScrollable(node); )
    node = node.parentElement;
  return node || document.scrollingElement || document.documentElement;
}
function $62d8ded9296f3872$var$isScrollable(node) {
  let style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}
var $5df64b3807dc15ee$exports = {};
$parcel$export6($5df64b3807dc15ee$exports, "useViewportSize", () => $5df64b3807dc15ee$export$d699905dd57c73ca);
var $5df64b3807dc15ee$var$visualViewport = typeof window < "u" && window.visualViewport;
function $5df64b3807dc15ee$export$d699905dd57c73ca() {
  let [size1, setSize] = (0, import_react19.useState)(
    () => $5df64b3807dc15ee$var$getViewportSize()
  );
  return (0, import_react19.useEffect)(() => {
    let onResize = () => {
      setSize((size) => {
        let newSize = $5df64b3807dc15ee$var$getViewportSize();
        return newSize.width === size.width && newSize.height === size.height ? size : newSize;
      });
    };
    return $5df64b3807dc15ee$var$visualViewport ? $5df64b3807dc15ee$var$visualViewport.addEventListener("resize", onResize) : window.addEventListener("resize", onResize), () => {
      $5df64b3807dc15ee$var$visualViewport ? $5df64b3807dc15ee$var$visualViewport.removeEventListener("resize", onResize) : window.removeEventListener("resize", onResize);
    };
  }, []), size1;
}
function $5df64b3807dc15ee$var$getViewportSize() {
  return {
    width: ($5df64b3807dc15ee$var$visualViewport == null ? void 0 : $5df64b3807dc15ee$var$visualViewport.width) || window.innerWidth,
    height: ($5df64b3807dc15ee$var$visualViewport == null ? void 0 : $5df64b3807dc15ee$var$visualViewport.height) || window.innerHeight
  };
}
var $ef06256079686ba0$exports = {};
$parcel$export6($ef06256079686ba0$exports, "useDescription", () => $ef06256079686ba0$export$f8aeda7b10753fa1);
var $ef06256079686ba0$var$descriptionId = 0, $ef06256079686ba0$var$descriptionNodes = /* @__PURE__ */ new Map();
function $ef06256079686ba0$export$f8aeda7b10753fa1(description) {
  let [id1, setId] = (0, import_react19.useState)(null);
  return $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    if (!description)
      return;
    let desc = $ef06256079686ba0$var$descriptionNodes.get(description);
    if (desc)
      setId(desc.element.id);
    else {
      let id = `react-aria-description-${$ef06256079686ba0$var$descriptionId++}`;
      setId(id);
      let node = document.createElement("div");
      node.id = id, node.style.display = "none", node.textContent = description, document.body.appendChild(node), desc = {
        refCount: 0,
        element: node
      }, $ef06256079686ba0$var$descriptionNodes.set(description, desc);
    }
    return desc.refCount++, () => {
      --desc.refCount === 0 && (desc.element.remove(), $ef06256079686ba0$var$descriptionNodes.delete(description));
    };
  }, [
    description
  ]), {
    "aria-describedby": description ? id1 : void 0
  };
}
var $c87311424ea30a05$exports = {};
$parcel$export6($c87311424ea30a05$exports, "isMac", () => $c87311424ea30a05$export$9ac100e40613ea10);
$parcel$export6($c87311424ea30a05$exports, "isIPhone", () => $c87311424ea30a05$export$186c6964ca17d99);
$parcel$export6($c87311424ea30a05$exports, "isIPad", () => $c87311424ea30a05$export$7bef049ce92e4224);
$parcel$export6($c87311424ea30a05$exports, "isIOS", () => $c87311424ea30a05$export$fedb369cb70207f1);
$parcel$export6($c87311424ea30a05$exports, "isAppleDevice", () => $c87311424ea30a05$export$e1865c3bedcd822b);
$parcel$export6($c87311424ea30a05$exports, "isWebKit", () => $c87311424ea30a05$export$78551043582a6a98);
$parcel$export6($c87311424ea30a05$exports, "isChrome", () => $c87311424ea30a05$export$6446a186d09e379e);
$parcel$export6($c87311424ea30a05$exports, "isAndroid", () => $c87311424ea30a05$export$a11b0059900ceec8);
function $c87311424ea30a05$var$testUserAgent(re) {
  var ref;
  return typeof window > "u" || window.navigator == null ? !1 : ((ref = window.navigator.userAgentData) === null || ref === void 0 ? void 0 : ref.brands.some(
    (brand) => re.test(brand.brand)
  )) || re.test(window.navigator.userAgent);
}
function $c87311424ea30a05$var$testPlatform(re) {
  return typeof window < "u" && window.navigator != null ? re.test((window.navigator.userAgentData || window.navigator).platform) : !1;
}
function $c87311424ea30a05$export$9ac100e40613ea10() {
  return $c87311424ea30a05$var$testPlatform(/^Mac/i);
}
function $c87311424ea30a05$export$186c6964ca17d99() {
  return $c87311424ea30a05$var$testPlatform(/^iPhone/i);
}
function $c87311424ea30a05$export$7bef049ce92e4224() {
  return $c87311424ea30a05$var$testPlatform(/^iPad/i) || $c87311424ea30a05$export$9ac100e40613ea10() && navigator.maxTouchPoints > 1;
}
function $c87311424ea30a05$export$fedb369cb70207f1() {
  return $c87311424ea30a05$export$186c6964ca17d99() || $c87311424ea30a05$export$7bef049ce92e4224();
}
function $c87311424ea30a05$export$e1865c3bedcd822b() {
  return $c87311424ea30a05$export$9ac100e40613ea10() || $c87311424ea30a05$export$fedb369cb70207f1();
}
function $c87311424ea30a05$export$78551043582a6a98() {
  return $c87311424ea30a05$var$testUserAgent(/AppleWebKit/i) && !$c87311424ea30a05$export$6446a186d09e379e();
}
function $c87311424ea30a05$export$6446a186d09e379e() {
  return $c87311424ea30a05$var$testUserAgent(/Chrome/i);
}
function $c87311424ea30a05$export$a11b0059900ceec8() {
  return $c87311424ea30a05$var$testUserAgent(/Android/i);
}
var $e9faafb641e167db$exports = {};
$parcel$export6($e9faafb641e167db$exports, "useEvent", () => $e9faafb641e167db$export$90fc3a17d93f704c);
function $e9faafb641e167db$export$90fc3a17d93f704c(ref, event, handler1, options) {
  let handlerRef = (0, import_react19.useRef)(handler1);
  handlerRef.current = handler1;
  let isDisabled = handler1 == null;
  (0, import_react19.useEffect)(() => {
    if (isDisabled)
      return;
    let element = ref.current, handler = (e10) => handlerRef.current.call(this, e10);
    return element.addEventListener(event, handler, options), () => {
      element.removeEventListener(event, handler, options);
    };
  }, [
    ref,
    event,
    options,
    isDisabled
  ]);
}
var $1dbecbe27a04f9af$exports = {};
$parcel$export6($1dbecbe27a04f9af$exports, "useValueEffect", () => $1dbecbe27a04f9af$export$14d238f342723f25);
function $1dbecbe27a04f9af$export$14d238f342723f25(defaultValue) {
  let [value, setValue] = (0, import_react19.useState)(defaultValue), valueRef = (0, import_react19.useRef)(value), effect = (0, import_react19.useRef)(null);
  valueRef.current = value;
  let nextRef = (0, import_react19.useRef)(null);
  nextRef.current = () => {
    let newValue = effect.current.next();
    if (newValue.done) {
      effect.current = null;
      return;
    }
    value === newValue.value ? nextRef.current() : setValue(newValue.value);
  }, $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    effect.current && nextRef.current();
  });
  let queue2 = (0, import_react19.useCallback)((fn) => {
    effect.current = fn(valueRef.current), nextRef.current();
  }, [
    effect,
    nextRef
  ]);
  return [
    value,
    queue2
  ];
}
var $2f04cbc44ee30ce0$exports = {};
$parcel$export6($2f04cbc44ee30ce0$exports, "scrollIntoView", () => $2f04cbc44ee30ce0$export$53a0910f038337bd);
function $2f04cbc44ee30ce0$export$53a0910f038337bd(scrollView, element) {
  let offsetX = $2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, "left"), offsetY = $2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, "top"), width = element.offsetWidth, height = element.offsetHeight, x3 = scrollView.scrollLeft, y3 = scrollView.scrollTop, maxX = x3 + scrollView.offsetWidth, maxY = y3 + scrollView.offsetHeight;
  offsetX <= x3 ? x3 = offsetX : offsetX + width > maxX && (x3 += offsetX + width - maxX), offsetY <= y3 ? y3 = offsetY : offsetY + height > maxY && (y3 += offsetY + height - maxY), scrollView.scrollLeft = x3, scrollView.scrollTop = y3;
}
function $2f04cbc44ee30ce0$var$relativeOffset(ancestor, child, axis) {
  let prop = axis === "left" ? "offsetLeft" : "offsetTop", sum = 0;
  for (; child.offsetParent && (sum += child[prop], child.offsetParent !== ancestor); ) {
    if (child.offsetParent.contains(ancestor)) {
      sum -= ancestor[prop];
      break;
    }
    child = child.offsetParent;
  }
  return sum;
}

// node_modules/@react-aria/button/node_modules/@react-aria/focus/dist/module.js
var import_react21 = __toESM(require_react());

// node_modules/@react-aria/button/node_modules/@react-aria/interactions/dist/module.js
var import_react20 = __toESM(require_react());
function $parcel$export7(e10, n6, v3, s6) {
  Object.defineProperty(e10, n6, { get: v3, set: s6, enumerable: !0, configurable: !0 });
}
var $3b117e43dc0ca95d$exports = {};
$parcel$export7($3b117e43dc0ca95d$exports, "Pressable", () => $3b117e43dc0ca95d$export$27c701ed9e449e99);
var $f6c31cce2adf654f$exports = {};
$parcel$export7($f6c31cce2adf654f$exports, "usePress", () => $f6c31cce2adf654f$export$45712eceda6fad21);
var $14c0b72509d70225$var$state = "default", $14c0b72509d70225$var$savedUserSelect = "", $14c0b72509d70225$var$modifiedElementMap = /* @__PURE__ */ new WeakMap();
function $14c0b72509d70225$export$16a4697467175487(target) {
  $c87311424ea30a05$export$fedb369cb70207f1() ? ($14c0b72509d70225$var$state === "default" && ($14c0b72509d70225$var$savedUserSelect = document.documentElement.style.webkitUserSelect, document.documentElement.style.webkitUserSelect = "none"), $14c0b72509d70225$var$state = "disabled") : target && ($14c0b72509d70225$var$modifiedElementMap.set(target, target.style.userSelect), target.style.userSelect = "none");
}
function $14c0b72509d70225$export$b0d6fa1ab32e3295(target) {
  if ($c87311424ea30a05$export$fedb369cb70207f1()) {
    if ($14c0b72509d70225$var$state !== "disabled")
      return;
    $14c0b72509d70225$var$state = "restoring", setTimeout(() => {
      $bbed8b41f857bcc0$export$24490316f764c430(() => {
        $14c0b72509d70225$var$state === "restoring" && (document.documentElement.style.webkitUserSelect === "none" && (document.documentElement.style.webkitUserSelect = $14c0b72509d70225$var$savedUserSelect || ""), $14c0b72509d70225$var$savedUserSelect = "", $14c0b72509d70225$var$state = "default");
      });
    }, 300);
  } else if (target && $14c0b72509d70225$var$modifiedElementMap.has(target)) {
    let targetOldUserSelect = $14c0b72509d70225$var$modifiedElementMap.get(target);
    target.style.userSelect === "none" && (target.style.userSelect = targetOldUserSelect), target.getAttribute("style") === "" && target.removeAttribute("style"), $14c0b72509d70225$var$modifiedElementMap.delete(target);
  }
}
function $8a9cb279dc87e130$export$60278871457622de(event) {
  return event.mozInputSource === 0 && event.isTrusted ? !0 : event.detail === 0 && !event.pointerType;
}
var $8a9cb279dc87e130$export$905e7fc544a71f36 = class {
  isDefaultPrevented() {
    return this.nativeEvent.defaultPrevented;
  }
  preventDefault() {
    this.defaultPrevented = !0, this.nativeEvent.preventDefault();
  }
  stopPropagation() {
    this.nativeEvent.stopPropagation(), this.isPropagationStopped = () => !0;
  }
  isPropagationStopped() {
    return !1;
  }
  persist() {
  }
  constructor(type, nativeEvent) {
    this.nativeEvent = nativeEvent, this.target = nativeEvent.target, this.currentTarget = nativeEvent.currentTarget, this.relatedTarget = nativeEvent.relatedTarget, this.bubbles = nativeEvent.bubbles, this.cancelable = nativeEvent.cancelable, this.defaultPrevented = nativeEvent.defaultPrevented, this.eventPhase = nativeEvent.eventPhase, this.isTrusted = nativeEvent.isTrusted, this.timeStamp = nativeEvent.timeStamp, this.type = type;
  }
};
function $8a9cb279dc87e130$export$715c682d09d639cc(onBlur) {
  let stateRef = (0, import_react20.useRef)({
    isFocused: !1,
    onBlur,
    observer: null
  }), state1 = stateRef.current;
  return state1.onBlur = onBlur, $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => () => {
    state1.observer && (state1.observer.disconnect(), state1.observer = null);
  }, [
    state1
  ]), (e1) => {
    if (e1.target instanceof HTMLButtonElement || e1.target instanceof HTMLInputElement || e1.target instanceof HTMLTextAreaElement || e1.target instanceof HTMLSelectElement) {
      state1.isFocused = !0;
      let target = e1.target, onBlurHandler = (e10) => {
        var ref;
        let state = stateRef.current;
        state.isFocused = !1, target.disabled && ((ref = state.onBlur) === null || ref === void 0 || ref.call(state, new $8a9cb279dc87e130$export$905e7fc544a71f36("blur", e10))), state.observer && (state.observer.disconnect(), state.observer = null);
      };
      target.addEventListener("focusout", onBlurHandler, {
        once: !0
      }), state1.observer = new MutationObserver(() => {
        state1.isFocused && target.disabled && (state1.observer.disconnect(), target.dispatchEvent(new FocusEvent("blur")), target.dispatchEvent(new FocusEvent("focusout", {
          bubbles: !0
        })));
      }), state1.observer.observe(target, {
        attributes: !0,
        attributeFilter: [
          "disabled"
        ]
      });
    }
  };
}
var $ae1eeba8b9eafd08$export$5165eccb35aaadb5 = import_react20.default.createContext(null);
$ae1eeba8b9eafd08$export$5165eccb35aaadb5.displayName = "PressResponderContext";
function $f6c31cce2adf654f$var$usePressResponderContext(props) {
  let context = (0, import_react20.useContext)($ae1eeba8b9eafd08$export$5165eccb35aaadb5);
  if (context) {
    let { register, ...contextProps } = context;
    props = $3ef42575df84b30b$export$9d1611c77c2fe928(contextProps, props), register();
  }
  return $e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, props.ref), props;
}
function $f6c31cce2adf654f$export$45712eceda6fad21(props) {
  let {
    onPress: onPress1,
    onPressChange: onPressChange1,
    onPressStart: onPressStart1,
    onPressEnd: onPressEnd1,
    onPressUp: onPressUp1,
    isDisabled: isDisabled1,
    isPressed: isPressedProp,
    preventFocusOnPress,
    shouldCancelOnPointerExit,
    allowTextSelectionOnPress,
    ref: _,
    ...domProps
  } = $f6c31cce2adf654f$var$usePressResponderContext(props), propsRef = (0, import_react20.useRef)(null);
  propsRef.current = {
    onPress: onPress1,
    onPressChange: onPressChange1,
    onPressStart: onPressStart1,
    onPressEnd: onPressEnd1,
    onPressUp: onPressUp1,
    isDisabled: isDisabled1,
    shouldCancelOnPointerExit
  };
  let [isPressed, setPressed] = (0, import_react20.useState)(!1), ref = (0, import_react20.useRef)({
    isPressed: !1,
    ignoreEmulatedMouseEvents: !1,
    ignoreClickAfterPress: !1,
    didFirePressStart: !1,
    activePointerId: null,
    target: null,
    isOverTarget: !1,
    pointerType: null
  }), { addGlobalListener, removeAllGlobalListeners } = $03deb23ff14920c4$export$4eaf04e54aa8eed6(), pressProps1 = (0, import_react20.useMemo)(() => {
    let state = ref.current, triggerPressStart = (originalEvent, pointerType) => {
      let { onPressStart, onPressChange, isDisabled } = propsRef.current;
      isDisabled || state.didFirePressStart || (onPressStart && onPressStart({
        type: "pressstart",
        pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      }), onPressChange && onPressChange(!0), state.didFirePressStart = !0, setPressed(!0));
    }, triggerPressEnd = (originalEvent, pointerType, wasPressed = !0) => {
      let { onPressEnd, onPressChange, onPress, isDisabled } = propsRef.current;
      !state.didFirePressStart || (state.ignoreClickAfterPress = !0, state.didFirePressStart = !1, onPressEnd && onPressEnd({
        type: "pressend",
        pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      }), onPressChange && onPressChange(!1), setPressed(!1), onPress && wasPressed && !isDisabled && onPress({
        type: "press",
        pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      }));
    }, triggerPressUp = (originalEvent, pointerType) => {
      let { onPressUp, isDisabled } = propsRef.current;
      isDisabled || onPressUp && onPressUp({
        type: "pressup",
        pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });
    }, cancel = (e10) => {
      state.isPressed && (state.isOverTarget && triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e10), state.pointerType, !1), state.isPressed = !1, state.isOverTarget = !1, state.activePointerId = null, state.pointerType = null, removeAllGlobalListeners(), allowTextSelectionOnPress || $14c0b72509d70225$export$b0d6fa1ab32e3295(state.target));
    }, pressProps = {
      onKeyDown(e10) {
        $f6c31cce2adf654f$var$isValidKeyboardEvent(e10.nativeEvent) && e10.currentTarget.contains(e10.target) && ($f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e10.target) && e10.preventDefault(), e10.stopPropagation(), !state.isPressed && !e10.repeat && (state.target = e10.currentTarget, state.isPressed = !0, triggerPressStart(e10, "keyboard"), addGlobalListener(document, "keyup", onKeyUp, !1)));
      },
      onKeyUp(e10) {
        $f6c31cce2adf654f$var$isValidKeyboardEvent(e10.nativeEvent) && !e10.repeat && e10.currentTarget.contains(e10.target) && triggerPressUp($f6c31cce2adf654f$var$createEvent(state.target, e10), "keyboard");
      },
      onClick(e10) {
        e10 && !e10.currentTarget.contains(e10.target) || e10 && e10.button === 0 && (e10.stopPropagation(), isDisabled1 && e10.preventDefault(), !state.ignoreClickAfterPress && !state.ignoreEmulatedMouseEvents && (state.pointerType === "virtual" || $8a9cb279dc87e130$export$60278871457622de(e10.nativeEvent)) && (!isDisabled1 && !preventFocusOnPress && $7215afc6de606d6b$export$de79e2c695e052f3(e10.currentTarget), triggerPressStart(e10, "virtual"), triggerPressUp(e10, "virtual"), triggerPressEnd(e10, "virtual")), state.ignoreEmulatedMouseEvents = !1, state.ignoreClickAfterPress = !1);
      }
    }, onKeyUp = (e10) => {
      if (state.isPressed && $f6c31cce2adf654f$var$isValidKeyboardEvent(e10)) {
        $f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e10.target) && e10.preventDefault(), e10.stopPropagation(), state.isPressed = !1;
        let target = e10.target;
        triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e10), "keyboard", state.target.contains(target)), removeAllGlobalListeners(), (state.target.contains(target) && $f6c31cce2adf654f$var$isHTMLAnchorLink(state.target) || state.target.getAttribute("role") === "link") && state.target.click();
      }
    };
    if (typeof PointerEvent < "u") {
      pressProps.onPointerDown = (e10) => {
        if (!(e10.button !== 0 || !e10.currentTarget.contains(e10.target))) {
          if ($f6c31cce2adf654f$var$isVirtualPointerEvent(e10.nativeEvent)) {
            state.pointerType = "virtual";
            return;
          }
          $f6c31cce2adf654f$var$shouldPreventDefault(e10.currentTarget) && e10.preventDefault(), state.pointerType = e10.pointerType, e10.stopPropagation(), state.isPressed || (state.isPressed = !0, state.isOverTarget = !0, state.activePointerId = e10.pointerId, state.target = e10.currentTarget, !isDisabled1 && !preventFocusOnPress && $7215afc6de606d6b$export$de79e2c695e052f3(e10.currentTarget), allowTextSelectionOnPress || $14c0b72509d70225$export$16a4697467175487(state.target), triggerPressStart(e10, state.pointerType), addGlobalListener(document, "pointermove", onPointerMove, !1), addGlobalListener(document, "pointerup", onPointerUp, !1), addGlobalListener(document, "pointercancel", onPointerCancel, !1));
        }
      }, pressProps.onMouseDown = (e10) => {
        !e10.currentTarget.contains(e10.target) || e10.button === 0 && ($f6c31cce2adf654f$var$shouldPreventDefault(e10.currentTarget) && e10.preventDefault(), e10.stopPropagation());
      }, pressProps.onPointerUp = (e10) => {
        !e10.currentTarget.contains(e10.target) || state.pointerType === "virtual" || e10.button === 0 && $f6c31cce2adf654f$var$isOverTarget(e10, e10.currentTarget) && triggerPressUp(e10, state.pointerType || e10.pointerType);
      };
      let onPointerMove = (e10) => {
        e10.pointerId === state.activePointerId && ($f6c31cce2adf654f$var$isOverTarget(e10, state.target) ? state.isOverTarget || (state.isOverTarget = !0, triggerPressStart($f6c31cce2adf654f$var$createEvent(state.target, e10), state.pointerType)) : state.isOverTarget && (state.isOverTarget = !1, triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e10), state.pointerType, !1), propsRef.current.shouldCancelOnPointerExit && cancel(e10)));
      }, onPointerUp = (e10) => {
        e10.pointerId === state.activePointerId && state.isPressed && e10.button === 0 && ($f6c31cce2adf654f$var$isOverTarget(e10, state.target) ? triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e10), state.pointerType) : state.isOverTarget && triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e10), state.pointerType, !1), state.isPressed = !1, state.isOverTarget = !1, state.activePointerId = null, state.pointerType = null, removeAllGlobalListeners(), allowTextSelectionOnPress || $14c0b72509d70225$export$b0d6fa1ab32e3295(state.target));
      }, onPointerCancel = (e10) => {
        cancel(e10);
      };
      pressProps.onDragStart = (e10) => {
        !e10.currentTarget.contains(e10.target) || cancel(e10);
      };
    } else {
      pressProps.onMouseDown = (e10) => {
        e10.button !== 0 || !e10.currentTarget.contains(e10.target) || ($f6c31cce2adf654f$var$shouldPreventDefault(e10.currentTarget) && e10.preventDefault(), e10.stopPropagation(), !state.ignoreEmulatedMouseEvents && (state.isPressed = !0, state.isOverTarget = !0, state.target = e10.currentTarget, state.pointerType = $8a9cb279dc87e130$export$60278871457622de(e10.nativeEvent) ? "virtual" : "mouse", !isDisabled1 && !preventFocusOnPress && $7215afc6de606d6b$export$de79e2c695e052f3(e10.currentTarget), triggerPressStart(e10, state.pointerType), addGlobalListener(document, "mouseup", onMouseUp, !1)));
      }, pressProps.onMouseEnter = (e10) => {
        !e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), state.isPressed && !state.ignoreEmulatedMouseEvents && (state.isOverTarget = !0, triggerPressStart(e10, state.pointerType)));
      }, pressProps.onMouseLeave = (e10) => {
        !e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), state.isPressed && !state.ignoreEmulatedMouseEvents && (state.isOverTarget = !1, triggerPressEnd(e10, state.pointerType, !1), propsRef.current.shouldCancelOnPointerExit && cancel(e10)));
      }, pressProps.onMouseUp = (e10) => {
        !e10.currentTarget.contains(e10.target) || !state.ignoreEmulatedMouseEvents && e10.button === 0 && triggerPressUp(e10, state.pointerType);
      };
      let onMouseUp = (e10) => {
        if (e10.button === 0) {
          if (state.isPressed = !1, removeAllGlobalListeners(), state.ignoreEmulatedMouseEvents) {
            state.ignoreEmulatedMouseEvents = !1;
            return;
          }
          $f6c31cce2adf654f$var$isOverTarget(e10, state.target) ? triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e10), state.pointerType) : state.isOverTarget && triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e10), state.pointerType, !1), state.isOverTarget = !1;
        }
      };
      pressProps.onTouchStart = (e10) => {
        if (!e10.currentTarget.contains(e10.target))
          return;
        e10.stopPropagation();
        let touch = $f6c31cce2adf654f$var$getTouchFromEvent(e10.nativeEvent);
        !touch || (state.activePointerId = touch.identifier, state.ignoreEmulatedMouseEvents = !0, state.isOverTarget = !0, state.isPressed = !0, state.target = e10.currentTarget, state.pointerType = "touch", !isDisabled1 && !preventFocusOnPress && $7215afc6de606d6b$export$de79e2c695e052f3(e10.currentTarget), allowTextSelectionOnPress || $14c0b72509d70225$export$16a4697467175487(state.target), triggerPressStart(e10, state.pointerType), addGlobalListener(window, "scroll", onScroll, !0));
      }, pressProps.onTouchMove = (e10) => {
        if (!e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), !state.isPressed))
          return;
        let touch = $f6c31cce2adf654f$var$getTouchById(e10.nativeEvent, state.activePointerId);
        touch && $f6c31cce2adf654f$var$isOverTarget(touch, e10.currentTarget) ? state.isOverTarget || (state.isOverTarget = !0, triggerPressStart(e10, state.pointerType)) : state.isOverTarget && (state.isOverTarget = !1, triggerPressEnd(e10, state.pointerType, !1), propsRef.current.shouldCancelOnPointerExit && cancel(e10));
      }, pressProps.onTouchEnd = (e10) => {
        if (!e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), !state.isPressed))
          return;
        let touch = $f6c31cce2adf654f$var$getTouchById(e10.nativeEvent, state.activePointerId);
        touch && $f6c31cce2adf654f$var$isOverTarget(touch, e10.currentTarget) ? (triggerPressUp(e10, state.pointerType), triggerPressEnd(e10, state.pointerType)) : state.isOverTarget && triggerPressEnd(e10, state.pointerType, !1), state.isPressed = !1, state.activePointerId = null, state.isOverTarget = !1, state.ignoreEmulatedMouseEvents = !0, allowTextSelectionOnPress || $14c0b72509d70225$export$b0d6fa1ab32e3295(state.target), removeAllGlobalListeners();
      }, pressProps.onTouchCancel = (e10) => {
        !e10.currentTarget.contains(e10.target) || (e10.stopPropagation(), state.isPressed && cancel(e10));
      };
      let onScroll = (e10) => {
        state.isPressed && e10.target.contains(state.target) && cancel({
          currentTarget: state.target,
          shiftKey: !1,
          ctrlKey: !1,
          metaKey: !1,
          altKey: !1
        });
      };
      pressProps.onDragStart = (e10) => {
        !e10.currentTarget.contains(e10.target) || cancel(e10);
      };
    }
    return pressProps;
  }, [
    addGlobalListener,
    isDisabled1,
    preventFocusOnPress,
    removeAllGlobalListeners,
    allowTextSelectionOnPress
  ]);
  return (0, import_react20.useEffect)(() => () => {
    allowTextSelectionOnPress || $14c0b72509d70225$export$b0d6fa1ab32e3295(ref.current.target);
  }, [
    allowTextSelectionOnPress
  ]), {
    isPressed: isPressedProp || isPressed,
    pressProps: $3ef42575df84b30b$export$9d1611c77c2fe928(domProps, pressProps1)
  };
}
function $f6c31cce2adf654f$var$isHTMLAnchorLink(target) {
  return target.tagName === "A" && target.hasAttribute("href");
}
function $f6c31cce2adf654f$var$isValidKeyboardEvent(event) {
  let { key, code, target } = event, element = target, { tagName, isContentEditable } = element, role = element.getAttribute("role");
  return (key === "Enter" || key === " " || key === "Spacebar" || code === "Space") && tagName !== "INPUT" && tagName !== "TEXTAREA" && isContentEditable !== !0 && (!$f6c31cce2adf654f$var$isHTMLAnchorLink(element) || role === "button" && key !== "Enter") && !(role === "link" && key !== "Enter");
}
function $f6c31cce2adf654f$var$getTouchFromEvent(event) {
  let { targetTouches } = event;
  return targetTouches.length > 0 ? targetTouches[0] : null;
}
function $f6c31cce2adf654f$var$getTouchById(event, pointerId) {
  let changedTouches = event.changedTouches;
  for (let i5 = 0; i5 < changedTouches.length; i5++) {
    let touch = changedTouches[i5];
    if (touch.identifier === pointerId)
      return touch;
  }
  return null;
}
function $f6c31cce2adf654f$var$createEvent(target, e10) {
  return {
    currentTarget: target,
    shiftKey: e10.shiftKey,
    ctrlKey: e10.ctrlKey,
    metaKey: e10.metaKey,
    altKey: e10.altKey
  };
}
function $f6c31cce2adf654f$var$getPointClientRect(point) {
  let offsetX = point.width / 2 || point.radiusX || 0, offsetY = point.height / 2 || point.radiusY || 0;
  return {
    top: point.clientY - offsetY,
    right: point.clientX + offsetX,
    bottom: point.clientY + offsetY,
    left: point.clientX - offsetX
  };
}
function $f6c31cce2adf654f$var$areRectanglesOverlapping(a4, b3) {
  return !(a4.left > b3.right || b3.left > a4.right || a4.top > b3.bottom || b3.top > a4.bottom);
}
function $f6c31cce2adf654f$var$isOverTarget(point, target) {
  let rect = target.getBoundingClientRect(), pointRect = $f6c31cce2adf654f$var$getPointClientRect(point);
  return $f6c31cce2adf654f$var$areRectanglesOverlapping(rect, pointRect);
}
function $f6c31cce2adf654f$var$shouldPreventDefault(target) {
  return !target.draggable;
}
function $f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(target) {
  return !((target.tagName === "INPUT" || target.tagName === "BUTTON") && target.type === "submit");
}
function $f6c31cce2adf654f$var$isVirtualPointerEvent(event) {
  return event.width === 0 && event.height === 0 || event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0;
}
var $3b117e43dc0ca95d$export$27c701ed9e449e99 = /* @__PURE__ */ import_react20.default.forwardRef(({ children, ...props }, ref) => {
  let newRef = (0, import_react20.useRef)();
  ref = ref ?? newRef;
  let { pressProps } = $f6c31cce2adf654f$export$45712eceda6fad21({
    ...props,
    ref
  }), child = import_react20.default.Children.only(children);
  return /* @__PURE__ */ import_react20.default.cloneElement(
    child,
    {
      ref,
      ...$3ef42575df84b30b$export$9d1611c77c2fe928(child.props, pressProps)
    }
  );
}), $f1ab8c75478c6f73$exports = {};
$parcel$export7($f1ab8c75478c6f73$exports, "PressResponder", () => $f1ab8c75478c6f73$export$3351871ee4b288b8);
var $f1ab8c75478c6f73$export$3351871ee4b288b8 = /* @__PURE__ */ import_react20.default.forwardRef(({ children, ...props }, ref) => {
  let isRegistered = (0, import_react20.useRef)(!1), prevContext = (0, import_react20.useContext)($ae1eeba8b9eafd08$export$5165eccb35aaadb5), context = $3ef42575df84b30b$export$9d1611c77c2fe928(prevContext || {}, {
    ...props,
    ref: ref || (prevContext == null ? void 0 : prevContext.ref),
    register() {
      isRegistered.current = !0, prevContext && prevContext.register();
    }
  });
  return $e7801be82b4b2a53$export$4debdb1a3f0fa79e(prevContext, ref), (0, import_react20.useEffect)(() => {
    isRegistered.current || console.warn("A PressResponder was rendered without a pressable child. Either call the usePress hook, or wrap your DOM node with <Pressable> component.");
  }, []), /* @__PURE__ */ import_react20.default.createElement($ae1eeba8b9eafd08$export$5165eccb35aaadb5.Provider, {
    value: context
  }, children);
}), $a1ea59d68270f0dd$exports = {};
$parcel$export7($a1ea59d68270f0dd$exports, "useFocus", () => $a1ea59d68270f0dd$export$f8168d8dd8fd66e6);
function $a1ea59d68270f0dd$export$f8168d8dd8fd66e6(props) {
  let onBlur;
  !props.isDisabled && (props.onBlur || props.onFocusChange) ? onBlur = (e10) => {
    if (e10.target === e10.currentTarget)
      return props.onBlur && props.onBlur(e10), props.onFocusChange && props.onFocusChange(!1), !0;
  } : onBlur = null;
  let onSyntheticFocus = $8a9cb279dc87e130$export$715c682d09d639cc(onBlur), onFocus;
  return !props.isDisabled && (props.onFocus || props.onFocusChange || props.onBlur) && (onFocus = (e10) => {
    e10.target === e10.currentTarget && (props.onFocus && props.onFocus(e10), props.onFocusChange && props.onFocusChange(!0), onSyntheticFocus(e10));
  }), {
    focusProps: {
      onFocus,
      onBlur
    }
  };
}
var $507fabe10e71c6fb$exports = {};
$parcel$export7($507fabe10e71c6fb$exports, "isFocusVisible", () => $507fabe10e71c6fb$export$b9b3dfddab17db27);
$parcel$export7($507fabe10e71c6fb$exports, "getInteractionModality", () => $507fabe10e71c6fb$export$630ff653c5ada6a9);
$parcel$export7($507fabe10e71c6fb$exports, "setInteractionModality", () => $507fabe10e71c6fb$export$8397ddfc504fdb9a);
$parcel$export7($507fabe10e71c6fb$exports, "useInteractionModality", () => $507fabe10e71c6fb$export$98e20ec92f614cfe);
$parcel$export7($507fabe10e71c6fb$exports, "useFocusVisible", () => $507fabe10e71c6fb$export$ffd9e5021c1fb2d6);
$parcel$export7($507fabe10e71c6fb$exports, "useFocusVisibleListener", () => $507fabe10e71c6fb$export$ec71b4b83ac08ec3);
var $507fabe10e71c6fb$var$currentModality = null, $507fabe10e71c6fb$var$changeHandlers = /* @__PURE__ */ new Set(), $507fabe10e71c6fb$var$hasSetupGlobalListeners = !1, $507fabe10e71c6fb$var$hasEventBeforeFocus = !1, $507fabe10e71c6fb$var$hasBlurredWindowRecently = !1, $507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS = {
  Tab: !0,
  Escape: !0
};
function $507fabe10e71c6fb$var$triggerChangeHandlers(modality, e10) {
  for (let handler of $507fabe10e71c6fb$var$changeHandlers)
    handler(modality, e10);
}
function $507fabe10e71c6fb$var$isValidKey(e10) {
  return !(e10.metaKey || !$c87311424ea30a05$export$9ac100e40613ea10() && e10.altKey || e10.ctrlKey || e10.key === "Control" || e10.key === "Shift" || e10.key === "Meta");
}
function $507fabe10e71c6fb$var$handleKeyboardEvent(e10) {
  $507fabe10e71c6fb$var$hasEventBeforeFocus = !0, $507fabe10e71c6fb$var$isValidKey(e10) && ($507fabe10e71c6fb$var$currentModality = "keyboard", $507fabe10e71c6fb$var$triggerChangeHandlers("keyboard", e10));
}
function $507fabe10e71c6fb$var$handlePointerEvent(e10) {
  $507fabe10e71c6fb$var$currentModality = "pointer", (e10.type === "mousedown" || e10.type === "pointerdown") && ($507fabe10e71c6fb$var$hasEventBeforeFocus = !0, $507fabe10e71c6fb$var$triggerChangeHandlers("pointer", e10));
}
function $507fabe10e71c6fb$var$handleClickEvent(e10) {
  $8a9cb279dc87e130$export$60278871457622de(e10) && ($507fabe10e71c6fb$var$hasEventBeforeFocus = !0, $507fabe10e71c6fb$var$currentModality = "virtual");
}
function $507fabe10e71c6fb$var$handleFocusEvent(e10) {
  e10.target === window || e10.target === document || (!$507fabe10e71c6fb$var$hasEventBeforeFocus && !$507fabe10e71c6fb$var$hasBlurredWindowRecently && ($507fabe10e71c6fb$var$currentModality = "virtual", $507fabe10e71c6fb$var$triggerChangeHandlers("virtual", e10)), $507fabe10e71c6fb$var$hasEventBeforeFocus = !1, $507fabe10e71c6fb$var$hasBlurredWindowRecently = !1);
}
function $507fabe10e71c6fb$var$handleWindowBlur() {
  $507fabe10e71c6fb$var$hasEventBeforeFocus = !1, $507fabe10e71c6fb$var$hasBlurredWindowRecently = !0;
}
function $507fabe10e71c6fb$var$setupGlobalFocusEvents() {
  if (typeof window > "u" || $507fabe10e71c6fb$var$hasSetupGlobalListeners)
    return;
  let focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function() {
    $507fabe10e71c6fb$var$hasEventBeforeFocus = !0, focus.apply(this, arguments);
  }, document.addEventListener("keydown", $507fabe10e71c6fb$var$handleKeyboardEvent, !0), document.addEventListener("keyup", $507fabe10e71c6fb$var$handleKeyboardEvent, !0), document.addEventListener("click", $507fabe10e71c6fb$var$handleClickEvent, !0), window.addEventListener("focus", $507fabe10e71c6fb$var$handleFocusEvent, !0), window.addEventListener("blur", $507fabe10e71c6fb$var$handleWindowBlur, !1), typeof PointerEvent < "u" ? (document.addEventListener("pointerdown", $507fabe10e71c6fb$var$handlePointerEvent, !0), document.addEventListener("pointermove", $507fabe10e71c6fb$var$handlePointerEvent, !0), document.addEventListener("pointerup", $507fabe10e71c6fb$var$handlePointerEvent, !0)) : (document.addEventListener("mousedown", $507fabe10e71c6fb$var$handlePointerEvent, !0), document.addEventListener("mousemove", $507fabe10e71c6fb$var$handlePointerEvent, !0), document.addEventListener("mouseup", $507fabe10e71c6fb$var$handlePointerEvent, !0)), $507fabe10e71c6fb$var$hasSetupGlobalListeners = !0;
}
typeof document < "u" && (document.readyState !== "loading" ? $507fabe10e71c6fb$var$setupGlobalFocusEvents() : document.addEventListener("DOMContentLoaded", $507fabe10e71c6fb$var$setupGlobalFocusEvents));
function $507fabe10e71c6fb$export$b9b3dfddab17db27() {
  return $507fabe10e71c6fb$var$currentModality !== "pointer";
}
function $507fabe10e71c6fb$export$630ff653c5ada6a9() {
  return $507fabe10e71c6fb$var$currentModality;
}
function $507fabe10e71c6fb$export$8397ddfc504fdb9a(modality) {
  $507fabe10e71c6fb$var$currentModality = modality, $507fabe10e71c6fb$var$triggerChangeHandlers(modality, null);
}
function $507fabe10e71c6fb$export$98e20ec92f614cfe() {
  $507fabe10e71c6fb$var$setupGlobalFocusEvents();
  let [modality, setModality] = (0, import_react20.useState)($507fabe10e71c6fb$var$currentModality);
  return (0, import_react20.useEffect)(() => {
    let handler = () => {
      setModality($507fabe10e71c6fb$var$currentModality);
    };
    return $507fabe10e71c6fb$var$changeHandlers.add(handler), () => {
      $507fabe10e71c6fb$var$changeHandlers.delete(handler);
    };
  }, []), modality;
}
function $507fabe10e71c6fb$var$isKeyboardFocusEvent(isTextInput, modality, e10) {
  return !(isTextInput && modality === "keyboard" && e10 instanceof KeyboardEvent && !$507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS[e10.key]);
}
function $507fabe10e71c6fb$export$ffd9e5021c1fb2d6(props = {}) {
  let { isTextInput, autoFocus } = props, [isFocusVisibleState, setFocusVisible] = (0, import_react20.useState)(autoFocus || $507fabe10e71c6fb$export$b9b3dfddab17db27());
  return $507fabe10e71c6fb$export$ec71b4b83ac08ec3(($507fabe10e71c6fb$export$b9b3dfddab17db272) => {
    setFocusVisible($507fabe10e71c6fb$export$b9b3dfddab17db272);
  }, [
    isTextInput
  ], {
    isTextInput
  }), {
    isFocusVisible: isFocusVisibleState
  };
}
function $507fabe10e71c6fb$export$ec71b4b83ac08ec3(fn, deps, opts) {
  $507fabe10e71c6fb$var$setupGlobalFocusEvents(), (0, import_react20.useEffect)(() => {
    let handler = (modality, e10) => {
      !$507fabe10e71c6fb$var$isKeyboardFocusEvent(opts == null ? void 0 : opts.isTextInput, modality, e10) || fn($507fabe10e71c6fb$export$b9b3dfddab17db27());
    };
    return $507fabe10e71c6fb$var$changeHandlers.add(handler), () => {
      $507fabe10e71c6fb$var$changeHandlers.delete(handler);
    };
  }, deps);
}
var $9ab94262bd0047c7$exports = {};
$parcel$export7($9ab94262bd0047c7$exports, "useFocusWithin", () => $9ab94262bd0047c7$export$420e68273165f4ec);
function $9ab94262bd0047c7$export$420e68273165f4ec(props) {
  let state = (0, import_react20.useRef)({
    isFocusWithin: !1
  }).current, onBlur = props.isDisabled ? null : (e10) => {
    state.isFocusWithin && !e10.currentTarget.contains(e10.relatedTarget) && (state.isFocusWithin = !1, props.onBlurWithin && props.onBlurWithin(e10), props.onFocusWithinChange && props.onFocusWithinChange(!1));
  }, onSyntheticFocus = $8a9cb279dc87e130$export$715c682d09d639cc(onBlur);
  return {
    focusWithinProps: {
      onFocus: props.isDisabled ? null : (e10) => {
        state.isFocusWithin || (props.onFocusWithin && props.onFocusWithin(e10), props.onFocusWithinChange && props.onFocusWithinChange(!0), state.isFocusWithin = !0, onSyntheticFocus(e10));
      },
      onBlur
    }
  };
}
var $6179b936705e76d3$exports = {};
$parcel$export7($6179b936705e76d3$exports, "useHover", () => $6179b936705e76d3$export$ae780daf29e6d456);
var $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = !1, $6179b936705e76d3$var$hoverCount = 0;
function $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents() {
  $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = !0, setTimeout(() => {
    $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = !1;
  }, 50);
}
function $6179b936705e76d3$var$handleGlobalPointerEvent(e10) {
  e10.pointerType === "touch" && $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents();
}
function $6179b936705e76d3$var$setupGlobalTouchEvents() {
  if (!(typeof document > "u"))
    return typeof PointerEvent < "u" ? document.addEventListener("pointerup", $6179b936705e76d3$var$handleGlobalPointerEvent) : document.addEventListener("touchend", $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents), $6179b936705e76d3$var$hoverCount++, () => {
      $6179b936705e76d3$var$hoverCount--, !($6179b936705e76d3$var$hoverCount > 0) && (typeof PointerEvent < "u" ? document.removeEventListener("pointerup", $6179b936705e76d3$var$handleGlobalPointerEvent) : document.removeEventListener("touchend", $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents));
    };
}
function $6179b936705e76d3$export$ae780daf29e6d456(props) {
  let { onHoverStart, onHoverChange, onHoverEnd, isDisabled } = props, [isHovered, setHovered] = (0, import_react20.useState)(!1), state = (0, import_react20.useRef)({
    isHovered: !1,
    ignoreEmulatedMouseEvents: !1,
    pointerType: "",
    target: null
  }).current;
  (0, import_react20.useEffect)($6179b936705e76d3$var$setupGlobalTouchEvents, []);
  let { hoverProps: hoverProps1, triggerHoverEnd: triggerHoverEnd1 } = (0, import_react20.useMemo)(() => {
    let triggerHoverStart = (event, pointerType) => {
      if (state.pointerType = pointerType, isDisabled || pointerType === "touch" || state.isHovered || !event.currentTarget.contains(event.target))
        return;
      state.isHovered = !0;
      let target = event.currentTarget;
      state.target = target, onHoverStart && onHoverStart({
        type: "hoverstart",
        target,
        pointerType
      }), onHoverChange && onHoverChange(!0), setHovered(!0);
    }, triggerHoverEnd = (event, pointerType) => {
      if (state.pointerType = "", state.target = null, pointerType === "touch" || !state.isHovered)
        return;
      state.isHovered = !1;
      let target = event.currentTarget;
      onHoverEnd && onHoverEnd({
        type: "hoverend",
        target,
        pointerType
      }), onHoverChange && onHoverChange(!1), setHovered(!1);
    }, hoverProps = {};
    return typeof PointerEvent < "u" ? (hoverProps.onPointerEnter = (e10) => {
      $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents && e10.pointerType === "mouse" || triggerHoverStart(e10, e10.pointerType);
    }, hoverProps.onPointerLeave = (e10) => {
      !isDisabled && e10.currentTarget.contains(e10.target) && triggerHoverEnd(e10, e10.pointerType);
    }) : (hoverProps.onTouchStart = () => {
      state.ignoreEmulatedMouseEvents = !0;
    }, hoverProps.onMouseEnter = (e10) => {
      !state.ignoreEmulatedMouseEvents && !$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents && triggerHoverStart(e10, "mouse"), state.ignoreEmulatedMouseEvents = !1;
    }, hoverProps.onMouseLeave = (e10) => {
      !isDisabled && e10.currentTarget.contains(e10.target) && triggerHoverEnd(e10, "mouse");
    }), {
      hoverProps,
      triggerHoverEnd
    };
  }, [
    onHoverStart,
    onHoverChange,
    onHoverEnd,
    isDisabled,
    state
  ]);
  return (0, import_react20.useEffect)(() => {
    isDisabled && triggerHoverEnd1({
      currentTarget: state.target
    }, state.pointerType);
  }, [
    isDisabled
  ]), {
    hoverProps: hoverProps1,
    isHovered
  };
}
var $e0b6e0b68ec7f50f$exports = {};
$parcel$export7($e0b6e0b68ec7f50f$exports, "useInteractOutside", () => $e0b6e0b68ec7f50f$export$872b660ac5a1ff98);
function $e0b6e0b68ec7f50f$export$872b660ac5a1ff98(props) {
  let { ref, onInteractOutside, isDisabled, onInteractOutsideStart } = props, state = (0, import_react20.useRef)({
    isPointerDown: !1,
    ignoreEmulatedMouseEvents: !1,
    onInteractOutside,
    onInteractOutsideStart
  }).current;
  state.onInteractOutside = onInteractOutside, state.onInteractOutsideStart = onInteractOutsideStart, (0, import_react20.useEffect)(() => {
    if (isDisabled)
      return;
    let onPointerDown = (e10) => {
      $e0b6e0b68ec7f50f$var$isValidEvent(e10, ref) && state.onInteractOutside && (state.onInteractOutsideStart && state.onInteractOutsideStart(e10), state.isPointerDown = !0);
    };
    if (typeof PointerEvent < "u") {
      let onPointerUp = (e10) => {
        state.isPointerDown && state.onInteractOutside && $e0b6e0b68ec7f50f$var$isValidEvent(e10, ref) && (state.isPointerDown = !1, state.onInteractOutside(e10));
      };
      return document.addEventListener("pointerdown", onPointerDown, !0), document.addEventListener("pointerup", onPointerUp, !0), () => {
        document.removeEventListener("pointerdown", onPointerDown, !0), document.removeEventListener("pointerup", onPointerUp, !0);
      };
    } else {
      let onMouseUp = (e10) => {
        state.ignoreEmulatedMouseEvents ? state.ignoreEmulatedMouseEvents = !1 : state.isPointerDown && state.onInteractOutside && $e0b6e0b68ec7f50f$var$isValidEvent(e10, ref) && (state.isPointerDown = !1, state.onInteractOutside(e10));
      }, onTouchEnd = (e10) => {
        state.ignoreEmulatedMouseEvents = !0, state.onInteractOutside && state.isPointerDown && $e0b6e0b68ec7f50f$var$isValidEvent(e10, ref) && (state.isPointerDown = !1, state.onInteractOutside(e10));
      };
      return document.addEventListener("mousedown", onPointerDown, !0), document.addEventListener("mouseup", onMouseUp, !0), document.addEventListener("touchstart", onPointerDown, !0), document.addEventListener("touchend", onTouchEnd, !0), () => {
        document.removeEventListener("mousedown", onPointerDown, !0), document.removeEventListener("mouseup", onMouseUp, !0), document.removeEventListener("touchstart", onPointerDown, !0), document.removeEventListener("touchend", onTouchEnd, !0);
      };
    }
  }, [
    ref,
    state,
    isDisabled
  ]);
}
function $e0b6e0b68ec7f50f$var$isValidEvent(event, ref) {
  if (event.button > 0)
    return !1;
  if (event.target) {
    let ownerDocument = event.target.ownerDocument;
    if (!ownerDocument || !ownerDocument.documentElement.contains(event.target))
      return !1;
  }
  return ref.current && !ref.current.contains(event.target);
}
var $46d819fcbaf35654$exports = {};
$parcel$export7($46d819fcbaf35654$exports, "useKeyboard", () => $46d819fcbaf35654$export$8f71654801c2f7cd);
function $93925083ecbb358c$export$48d1ea6320830260(handler) {
  if (!handler)
    return;
  let shouldStopPropagation = !0;
  return (e10) => {
    let event = {
      ...e10,
      preventDefault() {
        e10.preventDefault();
      },
      isDefaultPrevented() {
        return e10.isDefaultPrevented();
      },
      stopPropagation() {
        console.error("stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.");
      },
      continuePropagation() {
        shouldStopPropagation = !1;
      }
    };
    handler(event), shouldStopPropagation && e10.stopPropagation();
  };
}
function $46d819fcbaf35654$export$8f71654801c2f7cd(props) {
  return {
    keyboardProps: props.isDisabled ? {} : {
      onKeyDown: $93925083ecbb358c$export$48d1ea6320830260(props.onKeyDown),
      onKeyUp: $93925083ecbb358c$export$48d1ea6320830260(props.onKeyUp)
    }
  };
}
var $e8a7022cf87cba2a$exports = {};
$parcel$export7($e8a7022cf87cba2a$exports, "useMove", () => $e8a7022cf87cba2a$export$36da96379f79f245);
function $e8a7022cf87cba2a$export$36da96379f79f245(props) {
  let { onMoveStart, onMove, onMoveEnd } = props, state = (0, import_react20.useRef)({
    didMove: !1,
    lastPosition: null,
    id: null
  }), { addGlobalListener, removeGlobalListener } = $03deb23ff14920c4$export$4eaf04e54aa8eed6();
  return {
    moveProps: (0, import_react20.useMemo)(() => {
      let moveProps = {}, start = () => {
        $14c0b72509d70225$export$16a4697467175487(), state.current.didMove = !1;
      }, move = (originalEvent, pointerType, deltaX, deltaY) => {
        deltaX === 0 && deltaY === 0 || (state.current.didMove || (state.current.didMove = !0, onMoveStart == null || onMoveStart({
          type: "movestart",
          pointerType,
          shiftKey: originalEvent.shiftKey,
          metaKey: originalEvent.metaKey,
          ctrlKey: originalEvent.ctrlKey,
          altKey: originalEvent.altKey
        })), onMove({
          type: "move",
          pointerType,
          deltaX,
          deltaY,
          shiftKey: originalEvent.shiftKey,
          metaKey: originalEvent.metaKey,
          ctrlKey: originalEvent.ctrlKey,
          altKey: originalEvent.altKey
        }));
      }, end = (originalEvent, pointerType) => {
        $14c0b72509d70225$export$b0d6fa1ab32e3295(), state.current.didMove && (onMoveEnd == null || onMoveEnd({
          type: "moveend",
          pointerType,
          shiftKey: originalEvent.shiftKey,
          metaKey: originalEvent.metaKey,
          ctrlKey: originalEvent.ctrlKey,
          altKey: originalEvent.altKey
        }));
      };
      if (typeof PointerEvent > "u") {
        let onMouseMove = (e10) => {
          e10.button === 0 && (move(e10, "mouse", e10.pageX - state.current.lastPosition.pageX, e10.pageY - state.current.lastPosition.pageY), state.current.lastPosition = {
            pageX: e10.pageX,
            pageY: e10.pageY
          });
        }, onMouseUp = (e10) => {
          e10.button === 0 && (end(e10, "mouse"), removeGlobalListener(window, "mousemove", onMouseMove, !1), removeGlobalListener(window, "mouseup", onMouseUp, !1));
        };
        moveProps.onMouseDown = (e10) => {
          e10.button === 0 && (start(), e10.stopPropagation(), e10.preventDefault(), state.current.lastPosition = {
            pageX: e10.pageX,
            pageY: e10.pageY
          }, addGlobalListener(window, "mousemove", onMouseMove, !1), addGlobalListener(window, "mouseup", onMouseUp, !1));
        };
        let onTouchMove = (e10) => {
          let touch = [
            ...e10.changedTouches
          ].findIndex(
            ({ identifier }) => identifier === state.current.id
          );
          if (touch >= 0) {
            let { pageX, pageY } = e10.changedTouches[touch];
            move(e10, "touch", pageX - state.current.lastPosition.pageX, pageY - state.current.lastPosition.pageY), state.current.lastPosition = {
              pageX,
              pageY
            };
          }
        }, onTouchEnd = (e10) => {
          [
            ...e10.changedTouches
          ].findIndex(
            ({ identifier }) => identifier === state.current.id
          ) >= 0 && (end(e10, "touch"), state.current.id = null, removeGlobalListener(window, "touchmove", onTouchMove), removeGlobalListener(window, "touchend", onTouchEnd), removeGlobalListener(window, "touchcancel", onTouchEnd));
        };
        moveProps.onTouchStart = (e10) => {
          if (e10.changedTouches.length === 0 || state.current.id != null)
            return;
          let { pageX, pageY, identifier } = e10.changedTouches[0];
          start(), e10.stopPropagation(), e10.preventDefault(), state.current.lastPosition = {
            pageX,
            pageY
          }, state.current.id = identifier, addGlobalListener(window, "touchmove", onTouchMove, !1), addGlobalListener(window, "touchend", onTouchEnd, !1), addGlobalListener(window, "touchcancel", onTouchEnd, !1);
        };
      } else {
        let onPointerMove = (e10) => {
          if (e10.pointerId === state.current.id) {
            let pointerType = e10.pointerType || "mouse";
            move(e10, pointerType, e10.pageX - state.current.lastPosition.pageX, e10.pageY - state.current.lastPosition.pageY), state.current.lastPosition = {
              pageX: e10.pageX,
              pageY: e10.pageY
            };
          }
        }, onPointerUp = (e10) => {
          if (e10.pointerId === state.current.id) {
            let pointerType = e10.pointerType || "mouse";
            end(e10, pointerType), state.current.id = null, removeGlobalListener(window, "pointermove", onPointerMove, !1), removeGlobalListener(window, "pointerup", onPointerUp, !1), removeGlobalListener(window, "pointercancel", onPointerUp, !1);
          }
        };
        moveProps.onPointerDown = (e10) => {
          e10.button === 0 && state.current.id == null && (start(), e10.stopPropagation(), e10.preventDefault(), state.current.lastPosition = {
            pageX: e10.pageX,
            pageY: e10.pageY
          }, state.current.id = e10.pointerId, addGlobalListener(window, "pointermove", onPointerMove, !1), addGlobalListener(window, "pointerup", onPointerUp, !1), addGlobalListener(window, "pointercancel", onPointerUp, !1));
        };
      }
      let triggerKeyboardMove = (e10, deltaX, deltaY) => {
        start(), move(e10, "keyboard", deltaX, deltaY), end(e10, "keyboard");
      };
      return moveProps.onKeyDown = (e10) => {
        switch (e10.key) {
          case "Left":
          case "ArrowLeft":
            e10.preventDefault(), e10.stopPropagation(), triggerKeyboardMove(e10, -1, 0);
            break;
          case "Right":
          case "ArrowRight":
            e10.preventDefault(), e10.stopPropagation(), triggerKeyboardMove(e10, 1, 0);
            break;
          case "Up":
          case "ArrowUp":
            e10.preventDefault(), e10.stopPropagation(), triggerKeyboardMove(e10, 0, -1);
            break;
          case "Down":
          case "ArrowDown":
            e10.preventDefault(), e10.stopPropagation(), triggerKeyboardMove(e10, 0, 1);
            break;
        }
      }, moveProps;
    }, [
      state,
      onMoveStart,
      onMove,
      onMoveEnd,
      addGlobalListener,
      removeGlobalListener
    ])
  };
}
var $7d0a636d7a4dcefd$exports = {};
$parcel$export7($7d0a636d7a4dcefd$exports, "useScrollWheel", () => $7d0a636d7a4dcefd$export$2123ff2b87c81ca);
function $7d0a636d7a4dcefd$export$2123ff2b87c81ca(props, ref) {
  let { onScroll, isDisabled } = props, onScrollHandler = (0, import_react20.useCallback)((e10) => {
    e10.ctrlKey || (e10.preventDefault(), e10.stopPropagation(), onScroll && onScroll({
      deltaX: e10.deltaX,
      deltaY: e10.deltaY
    }));
  }, [
    onScroll
  ]);
  $e9faafb641e167db$export$90fc3a17d93f704c(ref, "wheel", isDisabled ? null : onScrollHandler);
}
var $8a26561d2877236e$exports = {};
$parcel$export7($8a26561d2877236e$exports, "useLongPress", () => $8a26561d2877236e$export$c24ed0104d07eab9);
var $8a26561d2877236e$var$DEFAULT_THRESHOLD = 500;
function $8a26561d2877236e$export$c24ed0104d07eab9(props) {
  let { isDisabled, onLongPressStart, onLongPressEnd, onLongPress, threshold = $8a26561d2877236e$var$DEFAULT_THRESHOLD, accessibilityDescription } = props, timeRef = (0, import_react20.useRef)(null), { addGlobalListener, removeGlobalListener } = $03deb23ff14920c4$export$4eaf04e54aa8eed6(), { pressProps } = $f6c31cce2adf654f$export$45712eceda6fad21({
    isDisabled,
    onPressStart(e1) {
      if ((e1.pointerType === "mouse" || e1.pointerType === "touch") && (onLongPressStart && onLongPressStart({
        ...e1,
        type: "longpressstart"
      }), timeRef.current = setTimeout(() => {
        e1.target.dispatchEvent(new PointerEvent("pointercancel", {
          bubbles: !0
        })), onLongPress && onLongPress({
          ...e1,
          type: "longpress"
        }), timeRef.current = null;
      }, threshold), e1.pointerType === "touch")) {
        let onContextMenu = (e10) => {
          e10.preventDefault();
        };
        addGlobalListener(e1.target, "contextmenu", onContextMenu, {
          once: !0
        }), addGlobalListener(window, "pointerup", () => {
          setTimeout(() => {
            removeGlobalListener(e1.target, "contextmenu", onContextMenu);
          }, 30);
        }, {
          once: !0
        });
      }
    },
    onPressEnd(e10) {
      timeRef.current && clearTimeout(timeRef.current), onLongPressEnd && (e10.pointerType === "mouse" || e10.pointerType === "touch") && onLongPressEnd({
        ...e10,
        type: "longpressend"
      });
    }
  }), descriptionProps = $ef06256079686ba0$export$f8aeda7b10753fa1(onLongPress && !isDisabled ? accessibilityDescription : null);
  return {
    longPressProps: $3ef42575df84b30b$export$9d1611c77c2fe928(pressProps, descriptionProps)
  };
}

// node_modules/@react-aria/button/node_modules/@react-aria/focus/dist/module.js
function $parcel$export8(e10, n6, v3, s6) {
  Object.defineProperty(e10, n6, { get: v3, set: s6, enumerable: !0, configurable: !0 });
}
var $9bf71ea28793e738$exports = {};
$parcel$export8($9bf71ea28793e738$exports, "FocusScope", () => $9bf71ea28793e738$export$20e40289641fbbb6);
$parcel$export8($9bf71ea28793e738$exports, "useFocusManager", () => $9bf71ea28793e738$export$10c5169755ce7bd7);
$parcel$export8($9bf71ea28793e738$exports, "getFocusableTreeWalker", () => $9bf71ea28793e738$export$2d6ec8fc375ceafa);
$parcel$export8($9bf71ea28793e738$exports, "createFocusManager", () => $9bf71ea28793e738$export$c5251b9e124bf29);
var $6a99195332edec8b$exports = {};
$parcel$export8($6a99195332edec8b$exports, "focusSafely", () => $6a99195332edec8b$export$80f3e147d781571c);
function $6a99195332edec8b$export$80f3e147d781571c(element) {
  if ($507fabe10e71c6fb$export$630ff653c5ada6a9() === "virtual") {
    let lastFocusedElement = document.activeElement;
    $bbed8b41f857bcc0$export$24490316f764c430(() => {
      document.activeElement === lastFocusedElement && document.contains(element) && $7215afc6de606d6b$export$de79e2c695e052f3(element);
    });
  } else
    $7215afc6de606d6b$export$de79e2c695e052f3(element);
}
function $645f2e67b85a24c9$var$isStyleVisible(element) {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement))
    return !1;
  let { display, visibility } = element.style, isVisible = display !== "none" && visibility !== "hidden" && visibility !== "collapse";
  if (isVisible) {
    let { getComputedStyle: getComputedStyle2 } = element.ownerDocument.defaultView, { display: computedDisplay, visibility: computedVisibility } = getComputedStyle2(element);
    isVisible = computedDisplay !== "none" && computedVisibility !== "hidden" && computedVisibility !== "collapse";
  }
  return isVisible;
}
function $645f2e67b85a24c9$var$isAttributeVisible(element, childElement) {
  return !element.hasAttribute("hidden") && (element.nodeName === "DETAILS" && childElement && childElement.nodeName !== "SUMMARY" ? element.hasAttribute("open") : !0);
}
function $645f2e67b85a24c9$export$e989c0fffaa6b27a(element, childElement) {
  return element.nodeName !== "#comment" && $645f2e67b85a24c9$var$isStyleVisible(element) && $645f2e67b85a24c9$var$isAttributeVisible(element, childElement) && (!element.parentElement || $645f2e67b85a24c9$export$e989c0fffaa6b27a(element.parentElement, element));
}
var $9bf71ea28793e738$var$FocusContext = /* @__PURE__ */ import_react21.default.createContext(null), $9bf71ea28793e738$var$activeScope = null, $9bf71ea28793e738$var$scopes = /* @__PURE__ */ new Map();
function $9bf71ea28793e738$export$20e40289641fbbb6(props) {
  let { children, contain, restoreFocus, autoFocus } = props, startRef = (0, import_react21.useRef)(), endRef = (0, import_react21.useRef)(), scopeRef = (0, import_react21.useRef)([]), ctx = (0, import_react21.useContext)($9bf71ea28793e738$var$FocusContext), parentScope = ctx == null ? void 0 : ctx.scopeRef;
  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    let node = startRef.current.nextSibling, nodes = [];
    for (; node && node !== endRef.current; )
      nodes.push(node), node = node.nextSibling;
    scopeRef.current = nodes;
  }, [
    children,
    parentScope
  ]), $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => ($9bf71ea28793e738$var$scopes.set(scopeRef, parentScope), () => {
    (scopeRef === $9bf71ea28793e738$var$activeScope || $9bf71ea28793e738$var$isAncestorScope(scopeRef, $9bf71ea28793e738$var$activeScope)) && (!parentScope || $9bf71ea28793e738$var$scopes.has(parentScope)) && ($9bf71ea28793e738$var$activeScope = parentScope), $9bf71ea28793e738$var$scopes.delete(scopeRef);
  }), [
    scopeRef,
    parentScope
  ]), $9bf71ea28793e738$var$useFocusContainment(scopeRef, contain), $9bf71ea28793e738$var$useRestoreFocus(scopeRef, restoreFocus, contain), $9bf71ea28793e738$var$useAutoFocus(scopeRef, autoFocus);
  let focusManager = $9bf71ea28793e738$var$createFocusManagerForScope(scopeRef);
  return /* @__PURE__ */ import_react21.default.createElement($9bf71ea28793e738$var$FocusContext.Provider, {
    value: {
      scopeRef,
      focusManager
    }
  }, /* @__PURE__ */ import_react21.default.createElement("span", {
    "data-focus-scope-start": !0,
    hidden: !0,
    ref: startRef
  }), children, /* @__PURE__ */ import_react21.default.createElement("span", {
    "data-focus-scope-end": !0,
    hidden: !0,
    ref: endRef
  }));
}
function $9bf71ea28793e738$export$10c5169755ce7bd7() {
  var ref;
  return (ref = (0, import_react21.useContext)($9bf71ea28793e738$var$FocusContext)) === null || ref === void 0 ? void 0 : ref.focusManager;
}
function $9bf71ea28793e738$var$createFocusManagerForScope(scopeRef) {
  return {
    focusNext(opts = {}) {
      let scope = scopeRef.current, { from: from2, tabbable, wrap } = opts, node = from2 || document.activeElement, sentinel = scope[0].previousElementSibling, walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable
      }, scope);
      walker.currentNode = $9bf71ea28793e738$var$isElementInScope(node, scope) ? node : sentinel;
      let nextNode = walker.nextNode();
      return !nextNode && wrap && (walker.currentNode = sentinel, nextNode = walker.nextNode()), nextNode && $9bf71ea28793e738$var$focusElement(nextNode, !0), nextNode;
    },
    focusPrevious(opts = {}) {
      let scope = scopeRef.current, { from: from2, tabbable, wrap } = opts, node = from2 || document.activeElement, sentinel = scope[scope.length - 1].nextElementSibling, walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable
      }, scope);
      walker.currentNode = $9bf71ea28793e738$var$isElementInScope(node, scope) ? node : sentinel;
      let previousNode = walker.previousNode();
      return !previousNode && wrap && (walker.currentNode = sentinel, previousNode = walker.previousNode()), previousNode && $9bf71ea28793e738$var$focusElement(previousNode, !0), previousNode;
    },
    focusFirst(opts = {}) {
      let scope = scopeRef.current, { tabbable } = opts, walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable
      }, scope);
      walker.currentNode = scope[0].previousElementSibling;
      let nextNode = walker.nextNode();
      return nextNode && $9bf71ea28793e738$var$focusElement(nextNode, !0), nextNode;
    },
    focusLast(opts = {}) {
      let scope = scopeRef.current, { tabbable } = opts, walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable
      }, scope);
      walker.currentNode = scope[scope.length - 1].nextElementSibling;
      let previousNode = walker.previousNode();
      return previousNode && $9bf71ea28793e738$var$focusElement(previousNode, !0), previousNode;
    }
  };
}
var $9bf71ea28793e738$var$focusableElements = [
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "summary",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]"
], $9bf71ea28793e738$var$FOCUSABLE_ELEMENT_SELECTOR = $9bf71ea28793e738$var$focusableElements.join(":not([hidden]),") + ",[tabindex]:not([disabled]):not([hidden])";
$9bf71ea28793e738$var$focusableElements.push('[tabindex]:not([tabindex="-1"]):not([disabled])');
var $9bf71ea28793e738$var$TABBABLE_ELEMENT_SELECTOR = $9bf71ea28793e738$var$focusableElements.join(':not([hidden]):not([tabindex="-1"]),');
function $9bf71ea28793e738$var$getScopeRoot(scope) {
  return scope[0].parentElement;
}
function $9bf71ea28793e738$var$useFocusContainment(scopeRef, contain) {
  let focusedNode = (0, import_react21.useRef)(), raf = (0, import_react21.useRef)(null);
  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    let scope1 = scopeRef.current;
    if (!contain)
      return;
    let onKeyDown = (e10) => {
      if (e10.key !== "Tab" || e10.altKey || e10.ctrlKey || e10.metaKey || scopeRef !== $9bf71ea28793e738$var$activeScope)
        return;
      let focusedElement = document.activeElement, scope = scopeRef.current;
      if (!$9bf71ea28793e738$var$isElementInScope(focusedElement, scope))
        return;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable: !0
      }, scope);
      walker.currentNode = focusedElement;
      let nextElement = e10.shiftKey ? walker.previousNode() : walker.nextNode();
      nextElement || (walker.currentNode = e10.shiftKey ? scope[scope.length - 1].nextElementSibling : scope[0].previousElementSibling, nextElement = e10.shiftKey ? walker.previousNode() : walker.nextNode()), e10.preventDefault(), nextElement && $9bf71ea28793e738$var$focusElement(nextElement, !0);
    }, onFocus = (e10) => {
      !$9bf71ea28793e738$var$activeScope || $9bf71ea28793e738$var$isAncestorScope($9bf71ea28793e738$var$activeScope, scopeRef) ? ($9bf71ea28793e738$var$activeScope = scopeRef, focusedNode.current = e10.target) : scopeRef === $9bf71ea28793e738$var$activeScope && !$9bf71ea28793e738$var$isElementInChildScope(e10.target, scopeRef) ? focusedNode.current ? focusedNode.current.focus() : $9bf71ea28793e738$var$activeScope && $9bf71ea28793e738$var$focusFirstInScope($9bf71ea28793e738$var$activeScope.current) : scopeRef === $9bf71ea28793e738$var$activeScope && (focusedNode.current = e10.target);
    }, onBlur = (e10) => {
      raf.current = requestAnimationFrame(() => {
        scopeRef === $9bf71ea28793e738$var$activeScope && !$9bf71ea28793e738$var$isElementInChildScope(document.activeElement, scopeRef) && ($9bf71ea28793e738$var$activeScope = scopeRef, focusedNode.current = e10.target, focusedNode.current.focus());
      });
    };
    return document.addEventListener("keydown", onKeyDown, !1), document.addEventListener("focusin", onFocus, !1), scope1.forEach(
      (element) => element.addEventListener("focusin", onFocus, !1)
    ), scope1.forEach(
      (element) => element.addEventListener("focusout", onBlur, !1)
    ), () => {
      document.removeEventListener("keydown", onKeyDown, !1), document.removeEventListener("focusin", onFocus, !1), scope1.forEach(
        (element) => element.removeEventListener("focusin", onFocus, !1)
      ), scope1.forEach(
        (element) => element.removeEventListener("focusout", onBlur, !1)
      );
    };
  }, [
    scopeRef,
    contain
  ]), (0, import_react21.useEffect)(() => () => cancelAnimationFrame(raf.current), [
    raf
  ]);
}
function $9bf71ea28793e738$var$isElementInAnyScope(element) {
  for (let scope of $9bf71ea28793e738$var$scopes.keys())
    if ($9bf71ea28793e738$var$isElementInScope(element, scope.current))
      return !0;
  return !1;
}
function $9bf71ea28793e738$var$isElementInScope(element, scope) {
  return scope.some(
    (node) => node.contains(element)
  );
}
function $9bf71ea28793e738$var$isElementInChildScope(element, scope) {
  for (let s6 of $9bf71ea28793e738$var$scopes.keys())
    if ((s6 === scope || $9bf71ea28793e738$var$isAncestorScope(scope, s6)) && $9bf71ea28793e738$var$isElementInScope(element, s6.current))
      return !0;
  return !1;
}
function $9bf71ea28793e738$var$isAncestorScope(ancestor, scope) {
  let parent = $9bf71ea28793e738$var$scopes.get(scope);
  return parent ? parent === ancestor ? !0 : $9bf71ea28793e738$var$isAncestorScope(ancestor, parent) : !1;
}
function $9bf71ea28793e738$var$focusElement(element, scroll = !1) {
  if (element != null && !scroll)
    try {
      $6a99195332edec8b$export$80f3e147d781571c(element);
    } catch {
    }
  else if (element != null)
    try {
      element.focus();
    } catch {
    }
}
function $9bf71ea28793e738$var$focusFirstInScope(scope) {
  let sentinel = scope[0].previousElementSibling, walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
    tabbable: !0
  }, scope);
  walker.currentNode = sentinel, $9bf71ea28793e738$var$focusElement(walker.nextNode());
}
function $9bf71ea28793e738$var$useAutoFocus(scopeRef, autoFocus) {
  let autoFocusRef = import_react21.default.useRef(autoFocus);
  (0, import_react21.useEffect)(() => {
    autoFocusRef.current && ($9bf71ea28793e738$var$activeScope = scopeRef, $9bf71ea28793e738$var$isElementInScope(document.activeElement, $9bf71ea28793e738$var$activeScope.current) || $9bf71ea28793e738$var$focusFirstInScope(scopeRef.current)), autoFocusRef.current = !1;
  }, []);
}
function $9bf71ea28793e738$var$useRestoreFocus(scopeRef, restoreFocus, contain) {
  let nodeToRestoreRef = (0, import_react21.useRef)(typeof document < "u" ? document.activeElement : null);
  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    let nodeToRestore = nodeToRestoreRef.current;
    if (!restoreFocus)
      return;
    let onKeyDown = (e10) => {
      if (e10.key !== "Tab" || e10.altKey || e10.ctrlKey || e10.metaKey)
        return;
      let focusedElement = document.activeElement;
      if (!$9bf71ea28793e738$var$isElementInScope(focusedElement, scopeRef.current))
        return;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(document.body, {
        tabbable: !0
      });
      walker.currentNode = focusedElement;
      let nextElement = e10.shiftKey ? walker.previousNode() : walker.nextNode();
      if ((!document.body.contains(nodeToRestore) || nodeToRestore === document.body) && (nodeToRestore = null), (!nextElement || !$9bf71ea28793e738$var$isElementInScope(nextElement, scopeRef.current)) && nodeToRestore) {
        walker.currentNode = nodeToRestore;
        do
          nextElement = e10.shiftKey ? walker.previousNode() : walker.nextNode();
        while ($9bf71ea28793e738$var$isElementInScope(nextElement, scopeRef.current));
        e10.preventDefault(), e10.stopPropagation(), nextElement ? $9bf71ea28793e738$var$focusElement(nextElement, !0) : $9bf71ea28793e738$var$isElementInAnyScope(nodeToRestore) ? $9bf71ea28793e738$var$focusElement(nodeToRestore, !0) : focusedElement.blur();
      }
    };
    return contain || document.addEventListener("keydown", onKeyDown, !0), () => {
      contain || document.removeEventListener("keydown", onKeyDown, !0), restoreFocus && nodeToRestore && $9bf71ea28793e738$var$isElementInScope(document.activeElement, scopeRef.current) && requestAnimationFrame(() => {
        document.body.contains(nodeToRestore) && $9bf71ea28793e738$var$focusElement(nodeToRestore);
      });
    };
  }, [
    scopeRef,
    restoreFocus,
    contain
  ]);
}
function $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, opts, scope) {
  let selector = opts != null && opts.tabbable ? $9bf71ea28793e738$var$TABBABLE_ELEMENT_SELECTOR : $9bf71ea28793e738$var$FOCUSABLE_ELEMENT_SELECTOR, walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      var ref;
      return !(opts == null || (ref = opts.from) === null || ref === void 0) && ref.contains(node) ? NodeFilter.FILTER_REJECT : node.matches(selector) && $645f2e67b85a24c9$export$e989c0fffaa6b27a(node) && (!scope || $9bf71ea28793e738$var$isElementInScope(node, scope)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  return opts != null && opts.from && (walker.currentNode = opts.from), walker;
}
function $9bf71ea28793e738$export$c5251b9e124bf29(ref) {
  return {
    focusNext(opts = {}) {
      let root = ref.current, { from: from2, tabbable, wrap } = opts, node = from2 || document.activeElement, walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
        tabbable
      });
      root.contains(node) && (walker.currentNode = node);
      let nextNode = walker.nextNode();
      return !nextNode && wrap && (walker.currentNode = root, nextNode = walker.nextNode()), nextNode && $9bf71ea28793e738$var$focusElement(nextNode, !0), nextNode;
    },
    focusPrevious(opts = {}) {
      let root = ref.current, { from: from2, tabbable, wrap } = opts, node = from2 || document.activeElement, walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
        tabbable
      });
      if (root.contains(node))
        walker.currentNode = node;
      else {
        let next = $9bf71ea28793e738$var$last(walker);
        return next && $9bf71ea28793e738$var$focusElement(next, !0), next;
      }
      let previousNode = walker.previousNode();
      return !previousNode && wrap && (walker.currentNode = root, previousNode = $9bf71ea28793e738$var$last(walker)), previousNode && $9bf71ea28793e738$var$focusElement(previousNode, !0), previousNode;
    },
    focusFirst(opts = {}) {
      let root = ref.current, { tabbable } = opts, nextNode = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
        tabbable
      }).nextNode();
      return nextNode && $9bf71ea28793e738$var$focusElement(nextNode, !0), nextNode;
    },
    focusLast(opts = {}) {
      let root = ref.current, { tabbable } = opts, walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
        tabbable
      }), next = $9bf71ea28793e738$var$last(walker);
      return next && $9bf71ea28793e738$var$focusElement(next, !0), next;
    }
  };
}
function $9bf71ea28793e738$var$last(walker) {
  let next, last;
  do
    last = walker.lastChild(), last && (next = last);
  while (last);
  return next;
}
var $907718708eab68af$exports = {};
$parcel$export8($907718708eab68af$exports, "FocusRing", () => $907718708eab68af$export$1a38b4ad7f578e1d);
var $f7dceffc5ad7768b$exports = {};
$parcel$export8($f7dceffc5ad7768b$exports, "useFocusRing", () => $f7dceffc5ad7768b$export$4e328f61c538687f);
function $f7dceffc5ad7768b$export$4e328f61c538687f(props = {}) {
  let { autoFocus = !1, isTextInput, within } = props, state = (0, import_react21.useRef)({
    isFocused: !1,
    isFocusVisible: autoFocus || $507fabe10e71c6fb$export$b9b3dfddab17db27()
  }).current, [isFocused1, setFocused] = (0, import_react21.useState)(!1), [isFocusVisibleState, setFocusVisible] = (0, import_react21.useState)(
    () => state.isFocused && state.isFocusVisible
  ), updateState = () => setFocusVisible(state.isFocused && state.isFocusVisible), onFocusChange = (isFocused) => {
    state.isFocused = isFocused, setFocused(isFocused), updateState();
  };
  $507fabe10e71c6fb$export$ec71b4b83ac08ec3((isFocusVisible) => {
    state.isFocusVisible = isFocusVisible, updateState();
  }, [], {
    isTextInput
  });
  let { focusProps } = $a1ea59d68270f0dd$export$f8168d8dd8fd66e6({
    isDisabled: within,
    onFocusChange
  }), { focusWithinProps } = $9ab94262bd0047c7$export$420e68273165f4ec({
    isDisabled: !within,
    onFocusWithinChange: onFocusChange
  });
  return {
    isFocused: isFocused1,
    isFocusVisible: state.isFocused && isFocusVisibleState,
    focusProps: within ? focusWithinProps : focusProps
  };
}
function $907718708eab68af$export$1a38b4ad7f578e1d(props) {
  let { children, focusClass, focusRingClass } = props, { isFocused, isFocusVisible, focusProps } = $f7dceffc5ad7768b$export$4e328f61c538687f(props), child = import_react21.default.Children.only(children);
  return /* @__PURE__ */ import_react21.default.cloneElement(child, $3ef42575df84b30b$export$9d1611c77c2fe928(child.props, {
    ...focusProps,
    className: clsx_m_default({
      [focusClass || ""]: isFocused,
      [focusRingClass || ""]: isFocusVisible
    })
  }));
}
var $e6afbd83fe6ebbd2$exports = {};
$parcel$export8($e6afbd83fe6ebbd2$exports, "FocusableProvider", () => $e6afbd83fe6ebbd2$export$13f3202a3e5ddd5);
$parcel$export8($e6afbd83fe6ebbd2$exports, "useFocusable", () => $e6afbd83fe6ebbd2$export$4c014de7c8940b4c);
var $e6afbd83fe6ebbd2$var$FocusableContext = /* @__PURE__ */ import_react21.default.createContext(null);
function $e6afbd83fe6ebbd2$var$useFocusableContext(ref) {
  let context = (0, import_react21.useContext)($e6afbd83fe6ebbd2$var$FocusableContext) || {};
  $e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, ref);
  let { ref: _, ...otherProps } = context;
  return otherProps;
}
function $e6afbd83fe6ebbd2$var$FocusableProvider(props, ref) {
  let { children, ...otherProps } = props, context = {
    ...otherProps,
    ref
  };
  return /* @__PURE__ */ import_react21.default.createElement($e6afbd83fe6ebbd2$var$FocusableContext.Provider, {
    value: context
  }, children);
}
var $e6afbd83fe6ebbd2$export$13f3202a3e5ddd5 = /* @__PURE__ */ import_react21.default.forwardRef($e6afbd83fe6ebbd2$var$FocusableProvider);
function $e6afbd83fe6ebbd2$export$4c014de7c8940b4c(props, domRef) {
  let { focusProps } = $a1ea59d68270f0dd$export$f8168d8dd8fd66e6(props), { keyboardProps } = $46d819fcbaf35654$export$8f71654801c2f7cd(props), interactions = $3ef42575df84b30b$export$9d1611c77c2fe928(focusProps, keyboardProps), domProps = $e6afbd83fe6ebbd2$var$useFocusableContext(domRef), interactionProps = props.isDisabled ? {} : domProps, autoFocusRef = (0, import_react21.useRef)(props.autoFocus);
  return (0, import_react21.useEffect)(() => {
    autoFocusRef.current && domRef.current && domRef.current.focus(), autoFocusRef.current = !1;
  }, []), {
    focusableProps: $3ef42575df84b30b$export$9d1611c77c2fe928({
      ...interactions,
      tabIndex: props.excludeFromTabOrder && !props.isDisabled ? -1 : void 0
    }, interactionProps)
  };
}

// node_modules/@react-aria/button/dist/module.js
function $parcel$export9(e10, n6, v3, s6) {
  Object.defineProperty(e10, n6, { get: v3, set: s6, enumerable: !0, configurable: !0 });
}
var $701a24aa0da5b062$exports = {};
$parcel$export9($701a24aa0da5b062$exports, "useButton", () => $701a24aa0da5b062$export$ea18c227d4417cc3);
function $701a24aa0da5b062$export$ea18c227d4417cc3(props, ref) {
  let {
    elementType = "button",
    isDisabled,
    onPress,
    onPressStart,
    onPressEnd,
    onPressChange,
    preventFocusOnPress,
    allowFocusWhenDisabled,
    onClick: deprecatedOnClick,
    href,
    target,
    rel,
    type = "button"
  } = props, additionalProps;
  elementType === "button" ? additionalProps = {
    type,
    disabled: isDisabled
  } : additionalProps = {
    role: "button",
    tabIndex: isDisabled ? void 0 : 0,
    href: elementType === "a" && isDisabled ? void 0 : href,
    target: elementType === "a" ? target : void 0,
    type: elementType === "input" ? type : void 0,
    disabled: elementType === "input" ? isDisabled : void 0,
    "aria-disabled": !isDisabled || elementType === "input" ? void 0 : isDisabled,
    rel: elementType === "a" ? rel : void 0
  };
  let { pressProps, isPressed } = $f6c31cce2adf654f$export$45712eceda6fad21({
    onPressStart,
    onPressEnd,
    onPressChange,
    onPress,
    isDisabled,
    preventFocusOnPress,
    ref
  }), { focusableProps } = $e6afbd83fe6ebbd2$export$4c014de7c8940b4c(props, ref);
  allowFocusWhenDisabled && (focusableProps.tabIndex = isDisabled ? -1 : focusableProps.tabIndex);
  let buttonProps = $3ef42575df84b30b$export$9d1611c77c2fe928(focusableProps, pressProps, $65484d02dcb7eb3e$export$457c3d6518dd4c6f(props, {
    labelable: !0
  }));
  return {
    isPressed,
    buttonProps: $3ef42575df84b30b$export$9d1611c77c2fe928(additionalProps, buttonProps, {
      "aria-haspopup": props["aria-haspopup"],
      "aria-expanded": props["aria-expanded"],
      "aria-controls": props["aria-controls"],
      "aria-pressed": props["aria-pressed"],
      onClick: (e10) => {
        deprecatedOnClick && (deprecatedOnClick(e10), console.warn("onClick is deprecated, please use onPress"));
      }
    })
  };
}
var $55f54f7887471b58$exports = {};
$parcel$export9($55f54f7887471b58$exports, "useToggleButton", () => $55f54f7887471b58$export$51e84d46ca0bc451);
function $55f54f7887471b58$export$51e84d46ca0bc451(props, state, ref) {
  let { isSelected } = state, { isPressed, buttonProps } = $701a24aa0da5b062$export$ea18c227d4417cc3({
    ...props,
    onPress: $ff5963eb1fccf552$export$e08e3b67e392101e(state.toggle, props.onPress)
  }, ref);
  return {
    isPressed,
    buttonProps: $3ef42575df84b30b$export$9d1611c77c2fe928(buttonProps, {
      "aria-pressed": isSelected
    })
  };
}

// node_modules/@nextui-org/react/esm/button/utils.js
var filterPropsWithGroup = (e10, o11) => {
  var r8, t13, n6, l4, d3, a4, i5, s6, g2, u2, b3;
  return o11.isButtonGroup ? { ...e10, auto: !0, shadow: !1, bordered: (r8 = o11.bordered) != null ? r8 : e10.bordered, borderWeight: (t13 = o11.borderWeight) != null ? t13 : e10.borderWeight, ghost: (n6 = o11.ghost) != null ? n6 : e10.ghost, ripple: (l4 = o11.ripple) != null ? l4 : e10.ripple, flat: (d3 = o11.flat) != null ? d3 : e10.flat, animated: (a4 = o11.animated) != null ? a4 : e10.animated, rounded: (i5 = o11.rounded) != null ? i5 : e10.rounded, light: (s6 = o11.light) != null ? s6 : e10.light, size: (g2 = o11.size) != null ? g2 : e10.size, color: (u2 = o11.color) != null ? u2 : e10.color, disabled: (b3 = o11.disabled) != null ? b3 : e10.disabled } : e10;
}, getCssColors = (e10) => {
  if (!e10.disabled)
    return e10.auto && e10.color === "gradient" && (e10.bordered || e10.ghost) ? { px: "$$buttonBorderWeight", py: "$$buttonBorderWeight" } : {};
  let o11 = { bg: "$accents2", color: "$accents4", transform: "none", boxShadow: "none", pe: "none" };
  return e10.bordered || e10.flat || e10.ghost || e10.light ? e10.color === "gradient" && (e10.bordered || e10.ghost) ? { color: "$accents4", backgroundImage: "linear-gradient($background, $background), linear-gradient($accents2, $accents2)", transform: "none", boxShadow: "none", pe: "none", pl: "$$buttonBorderWeight", pr: "$$buttonBorderWeight" } : e10.bordered || e10.ghost || e10.light ? { ...o11, bg: "transparent", borderColor: "$accents2" } : e10.flat ? { ...o11, bg: "$accents1" } : {} : o11;
};

// node_modules/@nextui-org/react/esm/button/button-group-context.js
var import_react22 = __toESM(require_react()), o7 = { isButtonGroup: !1, disabled: !1 }, ButtonGroupContext = import_react22.default.createContext(o7), useButtonGroupContext = () => import_react22.default.useContext(ButtonGroupContext);

// node_modules/@nextui-org/react/esm/button/button-icon.js
var import_react23 = __toESM(require_react());
var import_jsx_runtime5 = __toESM(require_jsx_runtime()), StyledButtonIcon = styled("span", { dflex: "center", position: "absolute", left: "$$buttonPadding", right: "auto", top: "50%", transform: "translateY(-50%)", color: "inherit", zIndex: "$1", "& svg": { background: "transparent" }, variants: { isAuto: { true: { position: "relative", transform: "none", top: "0%" } }, isRight: { true: { right: "$$buttonPadding", left: "auto" } }, isSingle: { true: { position: "static", transform: "none" } }, isGradientButtonBorder: { true: {} } }, compoundVariants: [{ isAuto: !0, isRight: !0, isSingle: !1, css: { order: 2, ml: "$$buttonPadding", right: "0%", left: "0%" } }, { isAuto: !0, isRight: !1, isSingle: !1, css: { order: 0, mr: "$$buttonPadding", right: "0%", left: "0%" } }, { isSingle: !0, isRight: !1, css: { ml: 0 } }, { isSingle: !0, isRight: !0, css: { mr: 0 } }, { isSingle: !0, isRight: !1, isGradientButtonBorder: !0, css: { mr: "$$buttonPadding" } }] }), e6 = ({ children: t13, className: i5, ...n6 }) => (0, import_jsx_runtime5.jsx)(StyledButtonIcon, { className: clsx_default("nextui-button-icon", { "nextui-button-icon-right": n6.isRight, "nextui-button-icon-single": n6.isSingle }, i5), ...n6, children: t13 });
e6.toString = () => ".nextui-button-icon";
var r5 = import_react23.default.memo(e6), button_icon_default = with_defaults_default(r5, { className: "" });

// node_modules/@nextui-org/react/esm/button/button.styles.js
var StyledButton = styled("button", { $$buttonBorderRadius: "$radii$md", $$buttonHoverOpacity: 0.85, $$buttonPressedScale: 0.97, dflex: "center", appearance: "none", boxSizing: " border-box", fontWeight: "$medium", us: "none", lineHeight: "$sm", ta: "center", whiteSpace: "nowrap", transition: "$button", position: "relative", overflow: "hidden", border: "none", cursor: "pointer", pe: "auto", p: 0, br: "$$buttonBorderRadius", "@motion": { transition: "none" }, ".nextui-button-text": { dflex: "center", zIndex: "$2", "p, pre, div": { margin: 0 } }, [`& ${StyledDrip}`]: { zIndex: "$1", ".nextui-drip-filler": { opacity: 0.25, fill: "$accents2" } }, variants: { bordered: { true: { bg: "transparent", borderStyle: "solid", color: "$text" } }, ghost: { true: { "&:hover": { color: "$white" } } }, color: { default: { bg: "$primary", color: "$white" }, primary: { bg: "$primary", color: "$white" }, secondary: { bg: "$secondary", color: "$white" }, success: { bg: "$success", color: "$white" }, warning: { bg: "$warning", color: "$white" }, error: { bg: "$error", color: "$white" }, gradient: { bg: "$gradient", color: "$white" } }, size: { xs: { $$buttonPadding: "$space$3", $$buttonBorderRadius: "$radii$xs", px: "$3", height: "$10", lh: "$space$10", width: "auto", minWidth: "$20", fontSize: "$tiny" }, sm: { $$buttonPadding: "$space$5", $$buttonBorderRadius: "$radii$sm", px: "$5", height: "$12", lh: "$space$14", width: "auto", minWidth: "$36", fontSize: "$xs" }, md: { $$buttonPadding: "$space$7", $$buttonBorderRadius: "$radii$md", px: "$7", height: "$14", lh: "$space$14", width: "auto", minWidth: "$48", fontSize: "$xs" }, lg: { $$buttonPadding: "$space$9", $$buttonBorderRadius: "$radii$base", px: "$9", height: "$15", lh: "$space$15", width: "auto", minWidth: "$60", fontSize: "$base" }, xl: { $$buttonPadding: "$space$10", $$buttonBorderRadius: "$radii$xl", px: "$10", height: "$17", lh: "$space$17", width: "auto", minWidth: "$72", fontSize: "$sm" } }, borderWeight: { light: { bw: "$light", $$buttonBorderWeight: "$borderWeights$light" }, normal: { bw: "$normal", $$buttonBorderWeight: "$borderWeights$normal" }, bold: { bw: "$bold", $$buttonBorderWeight: "$borderWeights$bold" }, extrabold: { bw: "$extrabold", $$buttonBorderWeight: "$borderWeights$extrabold" }, black: { bw: "$black", $$buttonBorderWeight: "$borderWeights$black" } }, flat: { true: { color: "$text" } }, light: { true: { bg: "transparent", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { opacity: 0.8, fill: "$accents2" } } } }, shadow: { true: { bs: "$sm" } }, animated: { false: { transition: "none" } }, auto: { true: { width: "auto", minWidth: "min-content" } }, rounded: { true: { $$buttonBorderRadius: "$radii$pill" } }, isPressed: { true: {} }, isHovered: { true: { opacity: "$$buttonHoverOpacity" } } }, compoundVariants: [{ isPressed: !0, animated: !0, css: { transform: "scale($$buttonPressedScale)" } }, { auto: !0, size: "xs", css: { px: "$5", minWidth: "min-content" } }, { auto: !0, size: "sm", css: { px: "$8", minWidth: "min-content" } }, { auto: !0, size: "md", css: { px: "$9", minWidth: "min-content" } }, { auto: !0, size: "lg", css: { px: "$10", minWidth: "min-content" } }, { auto: !0, size: "xl", css: { px: "$11", minWidth: "min-content" } }, { shadow: !0, color: "default", css: { normalShadow: "$primaryShadow" } }, { shadow: !0, color: "primary", css: { normalShadow: "$primaryShadow" } }, { shadow: !0, color: "secondary", css: { normalShadow: "$secondaryShadow" } }, { shadow: !0, color: "warning", css: { normalShadow: "$warningShadow" } }, { shadow: !0, color: "success", css: { normalShadow: "$successShadow" } }, { shadow: !0, color: "error", css: { normalShadow: "$errorShadow" } }, { shadow: !0, color: "gradient", css: { normalShadow: "$primaryShadow" } }, { light: !0, color: "default", css: { bg: "transparent", color: "$text" } }, { light: !0, color: "primary", css: { bg: "transparent", color: "$primary" } }, { light: !0, color: "secondary", css: { bg: "transparent", color: "$secondary" } }, { light: !0, color: "warning", css: { bg: "transparent", color: "$warning" } }, { light: !0, color: "success", css: { bg: "transparent", color: "$success" } }, { light: !0, color: "error", css: { bg: "transparent", color: "$error" } }, { bordered: !0, color: "default", css: { bg: "transparent", borderColor: "$primary", color: "$primary", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { fill: "$primary" } } } }, { bordered: !0, color: "primary", css: { bg: "transparent", borderColor: "$primary", color: "$primary", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { fill: "$primary" } } } }, { bordered: !0, color: "secondary", css: { bg: "transparent", borderColor: "$secondary", color: "$secondary", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { fill: "$secondary" } } } }, { bordered: !0, color: "success", css: { bg: "transparent", borderColor: "$success", color: "$success", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { fill: "$success" } } } }, { bordered: !0, color: "warning", css: { bg: "transparent", borderColor: "$warning", color: "$warning", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { fill: "$warning" } } } }, { bordered: !0, color: "error", css: { bg: "transparent", borderColor: "$error", color: "$error", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { fill: "$error" } } } }, { bordered: !0, color: "gradient", css: { bg: "transparent", color: "$text", padding: "$$buttonBorderWeight", bgClip: "content-box, border-box", borderColor: "$primary", backgroundImage: "linear-gradient($background, $background), $gradient", border: "none", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { fill: "$secondary" } } } }, { ghost: !0, isHovered: !0, color: "default", css: { bg: "$primary" } }, { ghost: !0, isHovered: !0, color: "primary", css: { bg: "$primary" } }, { ghost: !0, isHovered: !0, color: "secondary", css: { bg: "$secondary" } }, { ghost: !0, isHovered: !0, color: "success", css: { bg: "$success" } }, { ghost: !0, isHovered: !0, color: "warning", css: { bg: "$warning" } }, { ghost: !0, isHovered: !0, color: "error", css: { bg: "$error" } }, { ghost: !0, color: "gradient", isHovered: !0, css: { bg: "$gradient" } }, { flat: !0, color: "default", css: { bg: "$primaryLight", color: "$primary", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { opacity: 0.4, fill: "$primary" } } } }, { flat: !0, color: "primary", css: { bg: "$primaryLight", color: "$primary", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { opacity: 0.4, fill: "$primary" } } } }, { flat: !0, color: "secondary", css: { bg: "$secondaryLight", color: "$secondary", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { opacity: 0.4, fill: "$secondary" } } } }, { flat: !0, color: "success", css: { bg: "$successLight", color: "$success", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { opacity: 0.4, fill: "$success" } } } }, { flat: !0, color: "warning", css: { bg: "$warningLight", color: "$warning", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { opacity: 0.4, fill: "$warning" } } } }, { flat: !0, color: "error", css: { bg: "$errorLight", color: "$error", [`& ${StyledDrip}`]: { ".nextui-drip-filler": { opacity: 0.4, fill: "$error" } } } }, { auto: !0, color: "gradient", bordered: !0, css: { ".nextui-button-text": { px: "$$buttonPadding" }, ".nextui-button-icon": { ml: "$$buttonPadding" }, ".nextui-button-icon-right": { mr: "$$buttonPadding" }, ".nextui-button-text-left": { pl: 0 }, ".nextui-button-text-right": { pr: 0 } } }, { rounded: !0, size: "xs", css: { br: "$pill" } }, { rounded: !0, size: "sm", css: { br: "$pill" } }, { rounded: !0, size: "md", css: { br: "$pill" } }, { rounded: !0, size: "lg", css: { br: "$pill" } }, { rounded: !0, size: "xl", css: { br: "$pill" } }], defaultVariants: { color: "default", borderWeight: "normal", animated: !0, size: "md" } }, cssFocusVisible), button_styles_default = StyledButton;

// node_modules/@nextui-org/react/esm/utils/dom.js
var import_react24 = __toESM(require_react());
function canUseDOM() {
  return !(typeof window > "u" || !window.document || !window.document.createElement);
}
var isBrowser = canUseDOM();
function createDOMRef(e10) {
  return { UNSAFE_getDOMNode: () => e10.current };
}
function createFocusableRef(e10, t13 = e10) {
  return { ...createDOMRef(e10), focus() {
    t13.current && t13.current.focus();
  } };
}
function useFocusableRef(r8, n6) {
  let o11 = (0, import_react24.useRef)(null);
  return (0, import_react24.useImperativeHandle)(r8, () => createFocusableRef(o11, n6)), o11;
}

// node_modules/@nextui-org/react/esm/button/button.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime()), import_jsx_runtime7 = __toESM(require_jsx_runtime()), import_jsx_runtime8 = __toESM(require_jsx_runtime()), N2 = import_react25.default.forwardRef(({ onClick: b3, onPress: N3, as: P2, css: B2, ...F2 }, j2) => {
  let w2 = useButtonGroupContext(), k2 = filterPropsWithGroup(F2, w2), C2 = getCssColors(k2), { flat: R2, children: S2, disabled: T2, animated: A2, light: D2, ripple: G2, bordered: H2, auto: U2, borderWeight: V2, icon: W2, iconRight: I2, ghost: $2, autoFocus: q2, className: z2, ...E2 } = k2, J2 = (t13) => {
    A2 && G2 && K.current && Z2(t13);
  }, K = useFocusableRef(j2), { buttonProps: L2, isPressed: M2 } = $701a24aa0da5b062$export$ea18c227d4417cc3({ ...F2, isDisabled: T2, elementType: P2, onPress: (t13) => {
    t13.pointerType !== "keyboard" && t13.pointerType !== "virtual" || J2(t13), N3 == null || N3(t13);
  } }, K), { hoverProps: O2, isHovered: Q } = $52a70f66afabebbb$export$ae780daf29e6d456({ isDisabled: T2 }), { isFocusVisible: X, focusProps: Y2 } = $e974583017b16a4e$export$4e328f61c538687f({ autoFocus: q2 }), { onClick: Z2, ..._ } = use_drip_default2(!1, K);
  L2.onClick = (t13) => {
    J2(t13), b3 == null || b3(t13);
  }, !0 && k2.color === "gradient" && (R2 || D2) && use_warning_default2("Using the gradient color on flat and light buttons will have no effect.");
  let tt = W2 || I2, ot = Boolean(I2), rt = (0, import_react25.useMemo)(() => M2 ? "pressed" : Q ? "hovered" : T2 ? "disabled" : "ready", [T2, Q, M2]);
  return (0, import_jsx_runtime8.jsxs)(button_styles_default, { as: P2, ref: K, borderWeight: V2, auto: U2, flat: R2, light: D2, ghost: $2, bordered: H2 || $2, "data-state": rt, animated: A2, isPressed: M2, isHovered: Q, isFocusVisible: X && !T2, className: clsx_default("nextui-button", `nextui-button--${rt}`, z2), css: { ...B2, ...C2 }, ...$699afe8e9e0f66de$export$9d1611c77c2fe928(L2, Y2, O2, E2), children: [import_react25.default.Children.count(S2) === 0 ? (0, import_jsx_runtime6.jsx)(button_icon_default, { isSingle: !0, isAuto: U2, isRight: ot, isGradientButtonBorder: E2.color === "gradient" && (H2 || $2), children: tt }) : tt ? (0, import_jsx_runtime8.jsxs)(import_jsx_runtime7.Fragment, { children: [(0, import_jsx_runtime6.jsx)(button_icon_default, { isSingle: !1, isAuto: U2, isRight: ot, isGradientButtonBorder: E2.color === "gradient" && (H2 || $2), children: tt }), (0, import_jsx_runtime6.jsx)("div", { className: clsx_default("nextui-button-text", { "nextui-button-text-right": ot, "nextui-button-text-left": !ot }), children: S2 })] }) : (0, import_jsx_runtime6.jsx)("span", { className: "nextui-button-text", children: S2 }), (0, import_jsx_runtime6.jsx)(drip_default, { color: "white", ..._ })] });
});
!0 && (N2.displayName = "NextUI - Button"), N2.toString = () => ".nextui-button";
var button_default = with_defaults_default(N2, { ghost: !1, bordered: !1, ripple: !0, animated: !0, disabled: !1, autoFocus: !1, auto: !1, className: "", type: "button" });

// node_modules/@nextui-org/react/esm/button/button-group.js
var import_react26 = __toESM(require_react());

// node_modules/@nextui-org/react/esm/button/button-group.styles.js
var StyledButtonGroup = styled("div", { display: "inline-flex", margin: "$3", backgroundColor: "transparent", height: "min-content", [`& ${button_styles_default}`]: { ".nextui-button-text": { top: 0 } }, variants: { vertical: { true: { fd: "column", [`& ${button_styles_default}`]: { "&:not(:first-child)": { btlr: 0, btrr: 0 }, "&:not(:last-child)": { bblr: 0, bbrr: 0 } } }, false: { fd: "row", [`& ${button_styles_default}`]: { "&:not(:first-child)": { btlr: 0, bblr: 0 }, "&:not(:last-child)": { btrr: 0, bbrr: 0 } } } }, size: { xs: { br: "$xs" }, sm: { br: "$sm" }, md: { br: "$md" }, lg: { br: "$base" }, xl: { br: "$xl" } }, rounded: { true: { br: "$pill" } }, bordered: { true: { bg: "transparent" } }, gradient: { true: { pl: 0 } } }, defaultVariants: { vertical: !1 }, compoundVariants: [{ bordered: !0, vertical: !0, css: { [`& ${button_styles_default}`]: { "&:not(:last-child)": { borderBottom: "none", paddingBottom: "0" } } } }, { bordered: !0, vertical: !1, css: { [`& ${button_styles_default}`]: { "&:not(:first-child)": { borderLeft: "none" } } } }, { bordered: !0, vertical: !1, gradient: !0, css: { [`& ${button_styles_default}`]: { "&:not(:last-child)&:not(:first-child)": { pl: 0 }, "&:last-child": { pl: 0 } } } }] }), button_group_styles_default = StyledButtonGroup;

// node_modules/@nextui-org/react/esm/button/button-group.js
var import_jsx_runtime9 = __toESM(require_jsx_runtime()), a3 = (o11) => {
  let { disabled: t13, size: a4, color: l4, bordered: n6, ghost: s6, light: u2, flat: m4, shadow: p2, auto: c4, animated: g2, rounded: h4, ripple: b3, borderWeight: f2, children: x3, ...z2 } = o11, w2 = (0, import_react26.useMemo)(() => ({ disabled: t13, size: a4, color: l4, bordered: n6, light: u2, ghost: s6, flat: m4, shadow: p2, auto: c4, borderWeight: f2, animated: g2, rounded: h4, ripple: b3, isButtonGroup: !0 }), [t13, g2, a4, b3, l4, n6, u2, s6, m4, f2]);
  return (0, import_jsx_runtime9.jsx)(ButtonGroupContext.Provider, { value: w2, children: (0, import_jsx_runtime9.jsx)(button_group_styles_default, { size: a4, bordered: n6 || s6, gradient: o11.color === "gradient", ...z2, children: x3 }) });
};
a3.toString = () => ".nextui-button-group";
var l3 = import_react26.default.memo(a3), button_group_default = with_defaults_default(l3, { borderWeight: "normal", size: "md", color: "default" });

// node_modules/@nextui-org/react/esm/button/index.js
button_default.Group = button_group_default;
var button_default2 = button_default;

// node_modules/@nextui-org/react/esm/container/container.js
var import_react27 = __toESM(require_react());

// node_modules/@nextui-org/react/esm/container/container.styles.js
var StyledContainer = styled("div", { w: "100%", mr: "auto", ml: "auto", variants: { fluid: { true: { maxWidth: "100%" } }, responsive: { true: { "@xs": { maxWidth: "$breakpoints$xs" }, "@sm": { maxWidth: "$breakpoints$sm" }, "@md": { maxWidth: "$breakpoints$md" }, "@lg": { maxWidth: "$breakpoints$lg" }, "@xl": { maxWidth: "$breakpoints$xl" } } } }, defaultVariants: { fluid: !1, responsive: !0 } }), container_styles_default = StyledContainer;

// node_modules/@nextui-org/react/esm/container/container.js
var import_jsx_runtime10 = __toESM(require_jsx_runtime()), n3 = ({ xs: s6, sm: n6, md: r8, lg: a4, xl: o11, wrap: l4, gap: p2, as: m4, display: c4, justify: d3, direction: x3, alignItems: $2, alignContent: f2, children: g2, responsive: u2, fluid: b3, css: k2, ...y3 }) => {
  let j2 = (0, import_react27.useMemo)(() => `calc(${p2} * $space$sm)`, [p2]);
  return (0, import_jsx_runtime10.jsx)(container_styles_default, { css: { px: j2, maxWidth: s6 ? "$breakpoints$xs" : n6 ? "$breakpoints$sm" : r8 ? "$breakpoints$md" : a4 ? "$breakpoints$lg" : o11 ? "$breakpoints$xl" : "", alignItems: $2, alignContent: f2, flexWrap: l4, display: c4, justifyContent: d3, flexDirection: x3, ...k2 }, responsive: u2, fluid: b3, ...y3, children: g2 });
};
n3.toString = () => ".nextui-container", n3.defaultProps = { gap: 2, xs: !1, sm: !1, md: !1, lg: !1, xl: !1, responsive: !0, fluid: !1, wrap: "wrap", as: "div", display: "block" };
var container_default = import_react27.default.memo(n3);

// node_modules/@nextui-org/react/esm/container/index.js
var container_default2 = container_default;

// node_modules/@nextui-org/react/esm/utils/color.js
var isNormalColor = (r8) => normalColors.find((t13) => t13 === r8) != null;

// node_modules/@nextui-org/react/esm/text/text.js
var import_react29 = __toESM(require_react());

// node_modules/@nextui-org/react/esm/text/child.js
var import_react28 = __toESM(require_react());

// node_modules/@nextui-org/react/esm/text/text.styles.js
var StyledText = styled("p", { variants: { weight: { hairline: { fontWeight: "$hairline" }, thin: { fontWeight: "$thin" }, light: { fontWeight: "$light" }, normal: { fontWeight: "$normal" }, medium: { fontWeight: "$medium" }, semibold: { fontWeight: "$semibold" }, bold: { fontWeight: "$bold" }, extrabold: { fontWeight: "$extrabold" }, black: { fontWeight: "$black" } } } });

// node_modules/@nextui-org/react/esm/text/child.js
var import_jsx_runtime11 = __toESM(require_jsx_runtime()), s5 = ({ children: t13, tag: o11, color: s6, transform: n6, margin: c4, size: l4, css: f2, ...a4 }) => {
  let u2 = (0, import_react28.useMemo)(() => isNormalColor(s6) ? s6 === "default" ? "$text" : `$${s6}` : s6, [s6]), p2 = (0, import_react28.useMemo)(() => l4 ? typeof l4 == "number" ? `${l4}px` : l4 : "inherit", [l4]), x3 = (0, import_react28.useMemo)(() => c4 ? typeof c4 == "number" ? `${l4}px` : c4 : "inherit", [c4]);
  return (0, import_jsx_runtime11.jsx)(StyledText, { as: o11, css: { color: u2, fontSize: l4 ? p2 : "", margin: x3, tt: n6, ...f2 }, ...a4, children: t13 });
};
s5.toString = () => ".nextui-text-child";
var n4 = import_react28.default.memo(s5), child_default = with_defaults_default(n4, { color: "default" });

// node_modules/@nextui-org/react/esm/text/text.js
var import_jsx_runtime12 = __toESM(require_jsx_runtime()), n5 = (t13, e10, r8, h4) => {
  if (!t13.length)
    return e10;
  let i5 = t13.slice(1, t13.length);
  return (0, import_jsx_runtime12.jsx)(child_default, { tag: t13[0], size: r8, transform: h4, children: n5(i5, e10, r8) });
}, h3 = ({ h1: t13, h2: r8, h3: h4, h4: i5, h5: s6, h6: m4, b: a4, small: c4, i: f2, span: u2, del: d3, em: p2, blockquote: b3, transform: g2, size: k2, margin: x3, children: j2, ...q2 }) => {
  let z2 = { h1: t13, h2: r8, h3: h4, h4: i5, h5: s6, h6: m4, blockquote: b3 }, y3 = { span: u2, small: c4, b: a4, em: p2, i: f2, del: d3 }, O2 = Object.keys(z2).filter((t14) => z2[t14]), w2 = Object.keys(y3).filter((t14) => y3[t14]), S2 = (0, import_react29.useMemo)(() => O2[0] ? O2[0] : w2[0] ? w2[0] : "p", [O2, w2]), v3 = w2.filter((t14) => t14 !== S2), A2 = (0, import_react29.useMemo)(() => v3.length ? n5(v3, j2, k2, g2) : j2, [v3, j2, k2, g2]);
  return (0, import_jsx_runtime12.jsx)(child_default, { transform: g2, tag: S2, margin: x3, size: k2, ...q2, children: A2 });
};
h3.toString = () => ".nextui-text";
var i4 = import_react29.default.memo(h3), text_default = with_defaults_default(i4, { h1: !1, h2: !1, h3: !1, h4: !1, h5: !1, h6: !1, b: !1, small: !1, transform: "none", i: !1, span: !1, del: !1, em: !1, blockquote: !1, color: "default" });

// node_modules/@nextui-org/react/esm/text/index.js
var text_default2 = text_default;

// app/entry.server.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server3.renderToString)(
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(theme_provider_default, {
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RemixServer, {
        context: remixContext,
        url: request.url
      }, void 0, !1, {
        fileName: "app/entry.server.tsx",
        lineNumber: 13,
        columnNumber: 7
      }, this)
    }, void 0, !1, {
      fileName: "app/entry.server.tsx",
      lineNumber: 12,
      columnNumber: 5
    }, this)
  ).replace(/<\/head>/, `<style id="stitches">${getCssText()}</style></head>`);
  return responseHeaders.set("Content-Type", "text/html"), new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  meta: () => meta
});

// styles/global.css
var global_default = "/build/_assets/global-HT33CNKD.css";

// app/root.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime()), links = () => [
  { rel: "stylesheet", href: global_default }
], meta = () => ({ title: "PureML" });
function Document({
  children,
  title: title2 = "App | PureML"
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meta", {
            charSet: "utf-8"
          }, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 33,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meta", {
            name: "viewport",
            content: "width=device-width,initial-scale=1"
          }, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 34,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Meta, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 35,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("title", {
            children: title2
          }, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 36,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Links, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 37,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 32,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", {
        children: [
          children,
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScrollRestoration, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 41,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 42,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LiveReload, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 43,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 39,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 31,
    columnNumber: 5
  }, this);
}
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Document, {
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(theme_provider_default, {
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 54,
        columnNumber: 9
      }, this)
    }, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 53,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/root.tsx",
    lineNumber: 52,
    columnNumber: 5
  }, this);
}
function CatchBoundary() {
  let caught = useCatch();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Document, {
    title: `${caught.status} ${caught.statusText}`,
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(theme_provider_default, {
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(container_default2, {
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(text_default2, {
          h1: !0,
          color: "warning",
          css: { textAlign: "center" },
          children: [
            "[CatchBoundary]: ",
            caught.status,
            " ",
            caught.statusText
          ]
        }, void 0, !0, {
          fileName: "app/root.tsx",
          lineNumber: 68,
          columnNumber: 11
        }, this)
      }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 67,
        columnNumber: 9
      }, this)
    }, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 66,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/root.tsx",
    lineNumber: 65,
    columnNumber: 5
  }, this);
}
function ErrorBoundary({ error }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Document, {
    title: "Error!",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(theme_provider_default, {
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(container_default2, {
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(text_default2, {
          h1: !0,
          color: "error",
          css: { textAlign: "center" },
          children: [
            "[ErrorBoundary]: There was an error: ",
            error.message
          ]
        }, void 0, !0, {
          fileName: "app/root.tsx",
          lineNumber: 83,
          columnNumber: 11
        }, this)
      }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 82,
        columnNumber: 9
      }, this)
    }, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 81,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/root.tsx",
    lineNumber: 80,
    columnNumber: 5
  }, this);
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
function Index() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(container_default2, {
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "bg-black",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
          className: "text-2xl",
          children: "PureML app"
        }, void 0, !1, {
          fileName: "app/routes/index.tsx",
          lineNumber: 6,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(button_default2, {
          className: "px-2",
          children: "Demo Button"
        }, void 0, !1, {
          fileName: "app/routes/index.tsx",
          lineNumber: 7,
          columnNumber: 7
        }, this)
      ]
    }, void 0, !0, {
      fileName: "app/routes/index.tsx",
      lineNumber: 5,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/index.tsx",
    lineNumber: 4,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "6e5a7202", entry: { module: "/build/entry.client-6DLNKX3I.js", imports: ["/build/_shared/chunk-WEJFY444.js", "/build/_shared/chunk-R5FI2U2M.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-PRZCI4LO.js", imports: ["/build/_shared/chunk-IBBOPLMZ.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !0, hasErrorBoundary: !0 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-TLXPR5YG.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-6E5A7202.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public\\build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  }
};

// server.js
var handleRequest2 = createPagesFunctionHandler({
  build: server_build_exports,
  mode: "development",
  getLoadContext: (context) => context.env
});
function onRequest(context) {
  return handleRequest2(context);
}
export {
  onRequest
};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/**
 * @remix-run/cloudflare v1.3.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * @remix-run/cloudflare-pages v1.3.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * @remix-run/react v1.3.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * @remix-run/server-runtime v1.3.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * React Router DOM v6.3.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * React Router v6.3.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/** @license React v17.0.2
 * react-dom-server.node.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/** @license React v17.0.2
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/** @license React v17.0.2
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/** @license React v17.0.2
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//# sourceMappingURL=/build/[[path]].js.map
