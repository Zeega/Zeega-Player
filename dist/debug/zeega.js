/*

copyright 2012

ZEEGA LICENSE INFO HERE

*/
this['JST'] = this['JST'] || {};

this['JST']['app/templates/layouts/player-layout.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
 if( !chromeless ) { 
;__p+='\n\t<div class=\'ZEEGA-player-overlay\'></div>\n';
 } 
;__p+='\n<div class=\'ZEEGA-player-window\'></div>';
}
return __p;
};

this['JST']['app/templates/plugins/audio.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};

this['JST']['app/templates/plugins/image.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<img src="'+
( attr.uri )+
'" width=\'100%\' />';
}
return __p;
};

this['JST']['app/templates/plugins/link.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' style=\'position:absolute;width:100%;height:100%\'>\n\t';
 if( mode == 'editor' && !_.isNull( attr.to_frame ) ) { 
;__p+='\n\t\t<i class="icon-share go-to-sequence"></i>\n\t';
 } 
;__p+='\n</a>';
}
return __p;
};

this['JST']['app/templates/plugins/slideshow.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' class=\'slideshow-arrow slideshow-left-arrow disabled\'><img src=\'../assets/img/layers/slideshow-arrow.png\'/></a>\n<a href=\'#\' class=\'slideshow-arrow slideshow-right-arrow\'><img src=\'../assets/img/layers/slideshow-arrow.png\'/></a>\n<div class=\'slideshow-container\' style=\'width:'+
( (attr.slides.length *100) +'%' )+
'\'>\n\t';
 _.each( attr.slides, function(slide,i){ 
;__p+='\n\t\t<div class=\'slideshow-slide slideshow-slide-'+
( i )+
'\' style=\'width:'+
( (100 / attr.slides.length) +'%' )+
';background:url('+
( slide.attr.uri )+
') no-repeat center center;-webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;\'></div>\n\t';
 }) 
;__p+='\n</div>';
}
return __p;
};

this['JST']['app/templates/plugins/video.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};
(function () {
var zeega;(function () { if (typeof zeega === 'undefined') {
zeega = {};
/**
 * almond 0.1.3 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            return true;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = callDep(prefix);

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = makeRequire(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = {
                        id: name,
                        uri: '',
                        exports: defined[name],
                        config: makeConfig(name)
                    };
                } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else if (!defining[depName]) {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support zeega.require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());

zeega.requirejs = requirejs;zeega.require = require;zeega.define = define;
}
}());
zeega.define("../assets/js/libs/almond", function(){});

/*!
 * Lo-Dash v0.5.2 <http://lodash.com>
 * Copyright 2012 John-David Dalton <http://allyoucanleet.com/>
 * Based on Underscore.js 1.3.3, copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * <http://documentcloud.github.com/underscore>
 * Available under MIT license <http://lodash.com/license>
 */
;(function(window, undefined) {
  

  /**
   * Used to cache the last `_.templateSettings.evaluate` delimiter to avoid
   * unnecessarily assigning `reEvaluateDelimiter` a new generated regexp.
   * Assigned in `_.template`.
   */
  var lastEvaluateDelimiter;

  /**
   * Used to cache the last template `options.variable` to avoid unnecessarily
   * assigning `reDoubleVariable` a new generated regexp. Assigned in `_.template`.
   */
  var lastVariable;

  /**
   * Used to match potentially incorrect data object references, like `obj.obj`,
   * in compiled templates. Assigned in `_.template`.
   */
  var reDoubleVariable;

  /**
   * Used to match "evaluate" delimiters, including internal delimiters,
   * in template text. Assigned in `_.template`.
   */
  var reEvaluateDelimiter;

  /** Detect free variable `exports` */
  var freeExports = typeof exports == 'object' && exports &&
    (typeof global == 'object' && global && global == global.global && (window = global), exports);

  /** Native prototype shortcuts */
  var ArrayProto = Array.prototype,
      BoolProto = Boolean.prototype,
      ObjectProto = Object.prototype,
      NumberProto = Number.prototype,
      StringProto = String.prototype;

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to restore the original `_` reference in `noConflict` */
  var oldDash = window._;

  /** Used to detect delimiter values that should be processed by `tokenizeEvaluate` */
  var reComplexDelimiter = /[-+=!~*%&^<>|{(\/]|\[\D|\b(?:delete|in|instanceof|new|typeof|void)\b/;

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to insert the data object variable into compiled template source */
  var reInsertVariable = /(?:__e|__t = )\(\s*(?![\d\s"']|this\.)/g;

  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    (ObjectProto.valueOf + '')
      .replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&')
      .replace(/valueOf|for [^\]]+/g, '.+?') + '$'
  );

  /** Used to match tokens in template text */
  var reToken = /__token__(\d+)/g;

  /** Used to match unescaped characters in strings for inclusion in HTML */
  var reUnescapedHtml = /[&<"']/g;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to fix the JScript [[DontEnum]] bug */
  var shadowed = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** Used to replace template delimiters */
  var token = '__token__';

  /** Used to store tokenized template text snippets */
  var tokenized = [];

  /** Native method shortcuts */
  var concat = ArrayProto.concat,
      hasOwnProperty = ObjectProto.hasOwnProperty,
      push = ArrayProto.push,
      propertyIsEnumerable = ObjectProto.propertyIsEnumerable,
      slice = ArrayProto.slice,
      toString = ObjectProto.toString;

  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeBind = reNative.test(nativeBind = slice.bind) && nativeBind,
      nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray,
      nativeIsFinite = window.isFinite,
      nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Timer shortcuts */
  var clearTimeout = window.clearTimeout,
      setTimeout = window.setTimeout;

  /**
   * Detect the JScript [[DontEnum]] bug:
   * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
   * made non-enumerable as well.
   */
  var hasDontEnumBug;

  /** Detect if own properties are iterated after inherited properties (IE < 9) */
  var iteratesOwnLast;

  /** Detect if an `arguments` object's indexes are non-enumerable (IE < 9) */
  var noArgsEnum = true;

  (function() {
    var props = [];
    function ctor() { this.x = 1; }
    ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var prop in new ctor) { props.push(prop); }
    for (prop in arguments) { noArgsEnum = !prop; }
    hasDontEnumBug = (props + '').length < 4;
    iteratesOwnLast = props[0] != 'x';
  }(1));

  /** Detect if an `arguments` object's [[Class]] is unresolvable (Firefox < 4, IE < 9) */
  var noArgsClass = !isArguments(arguments);

  /** Detect if `Array#slice` cannot be used to convert strings to arrays (Opera < 10.52) */
  var noArraySliceOnStrings = slice.call('x')[0] != 'x';

  /**
   * Detect lack of support for accessing string characters by index:
   * IE < 8 can't access characters by index and IE 8 can only access
   * characters by index on string literals.
   */
  var noCharByIndex = ('x'[0] + Object('x')[0]) != 'xx';

  /**
   * Detect if a node's [[Class]] is unresolvable (IE < 9)
   * and that the JS engine won't error when attempting to coerce an object to
   * a string without a `toString` property value of `typeof` "function".
   */
  try {
    var noNodeClass = ({ 'toString': 0 } + '', toString.call(window.document || 0) == objectClass);
  } catch(e) { }

  /* Detect if `Function#bind` exists and is inferred to be fast (all but V8) */
  var isBindFast = nativeBind && /\n|Opera/.test(nativeBind + toString.call(window.opera));

  /* Detect if `Object.keys` exists and is inferred to be fast (IE, Opera, V8) */
  var isKeysFast = nativeKeys && /^.+$|true/.test(nativeKeys + !!window.attachEvent);

  /** Detect if sourceURL syntax is usable without erroring */
  try {
    // The JS engine in Adobe products, like InDesign, will throw a syntax error
    // when it encounters a single line comment beginning with the `@` symbol.
    // The JS engine in Narwhal will generate the function `function anonymous(){//}`
    // and throw a syntax error. In IE, `@` symbols are part of its non-standard
    // conditional compilation support. The `@cc_on` statement activates its support
    // while the trailing ` !` induces a syntax error to exlude it. Compatibility
    // modes in IE > 8 require a space before the `!` to induce a syntax error.
    // See http://msdn.microsoft.com/en-us/library/121hztk3(v=vs.94).aspx
    var useSourceURL = (Function('//@cc_on !')(), true);
  } catch(e){ }

  /** Used to identify object classifications that are array-like */
  var arrayLikeClasses = {};
  arrayLikeClasses[boolClass] = arrayLikeClasses[dateClass] = arrayLikeClasses[funcClass] =
  arrayLikeClasses[numberClass] = arrayLikeClasses[objectClass] = arrayLikeClasses[regexpClass] = false;
  arrayLikeClasses[argsClass] = arrayLikeClasses[arrayClass] = arrayLikeClasses[stringClass] = true;

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[argsClass] = cloneableClasses[funcClass] = false;
  cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] =
  cloneableClasses[stringClass] = true;

  /**
   * Used to escape characters for inclusion in HTML.
   * The `>` and `/` characters don't require escaping in HTML and have no
   * special meaning unless they're part of a tag or an unquoted attribute value
   * http://mathiasbynens.be/notes/ambiguous-ampersands (semi-related fun fact)
   */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#x27;'
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false,
    'unknown': true
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /*--------------------------------------------------------------------------*/

  /**
   * The `lodash` function.
   *
   * @name _
   * @constructor
   * @param {Mixed} value The value to wrap in a `LoDash` instance.
   * @returns {Object} Returns a `LoDash` instance.
   */
  function lodash(value) {
    // allow invoking `lodash` without the `new` operator
    return new LoDash(value);
  }

  /**
   * Creates a `LoDash` instance that wraps a value to allow chaining.
   *
   * @private
   * @constructor
   * @param {Mixed} value The value to wrap.
   */
  function LoDash(value) {
    // exit early if already wrapped
    if (value && value._wrapped) {
      return value;
    }
    this._wrapped = value;
  }

  /**
   * By default, the template delimiters used by Lo-Dash are similar to those in
   * embedded Ruby (ERB). Change the following template settings to use alternative
   * delimiters.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  lodash.templateSettings = {

    /**
     * Used to detect `data` property values to be HTML-escaped.
     *
     * @static
     * @memberOf _.templateSettings
     * @type RegExp
     */
    'escape': /<%-([\s\S]+?)%>/g,

    /**
     * Used to detect code to be evaluated.
     *
     * @static
     * @memberOf _.templateSettings
     * @type RegExp
     */
    'evaluate': /<%([\s\S]+?)%>/g,

    /**
     * Used to detect `data` property values to inject.
     *
     * @static
     * @memberOf _.templateSettings
     * @type RegExp
     */
    'interpolate': /<%=([\s\S]+?)%>/g,

    /**
     * Used to reference the data object in the template text.
     *
     * @static
     * @memberOf _.templateSettings
     * @type String
     */
    'variable': ''
  };

  /*--------------------------------------------------------------------------*/

  /**
   * The template used to create iterator functions.
   *
   * @private
   * @param {Obect} data The data object used to populate the text.
   * @returns {String} Returns the interpolated text.
   */
  var iteratorTemplate = template(
    // conditional strict mode
    '<% if (useStrict) { %>\'use strict\';\n<% } %>' +

    // the `iteratee` may be reassigned by the `top` snippet
    'var index, value, iteratee = <%= firstArg %>, ' +
    // assign the `result` variable an initial value
    'result<% if (init) { %> = <%= init %><% } %>;\n' +
    // add code to exit early or do so if the first argument is falsey
    '<%= exit %>;\n' +
    // add code after the exit snippet but before the iteration branches
    '<%= top %>;\n' +

    // the following branch is for iterating arrays and array-like objects
    '<% if (arrayBranch) { %>' +
    'var length = iteratee.length; index = -1;' +
    '  <% if (objectBranch) { %>\nif (length > -1 && length === length >>> 0) {<% } %>' +

    // add support for accessing string characters by index if needed
    '  <% if (noCharByIndex) { %>\n' +
    '  if (toString.call(iteratee) == stringClass) {\n' +
    '    iteratee = iteratee.split(\'\')\n' +
    '  }' +
    '  <% } %>\n' +

    '  <%= arrayBranch.beforeLoop %>;\n' +
    '  while (++index < length) {\n' +
    '    value = iteratee[index];\n' +
    '    <%= arrayBranch.inLoop %>\n' +
    '  }' +
    '  <% if (objectBranch) { %>\n}<% } %>' +
    '<% } %>' +

    // the following branch is for iterating an object's own/inherited properties
    '<% if (objectBranch) { %>' +
    '  <% if (arrayBranch) { %>\nelse {' +

    // add support for iterating over `arguments` objects if needed
    '  <%  } else if (noArgsEnum) { %>\n' +
    '  var length = iteratee.length; index = -1;\n' +
    '  if (length && isArguments(iteratee)) {\n' +
    '    while (++index < length) {\n' +
    '      value = iteratee[index += \'\'];\n' +
    '      <%= objectBranch.inLoop %>\n' +
    '    }\n' +
    '  } else {' +
    '  <% } %>' +

    '  <% if (!hasDontEnumBug) { %>\n' +
    '  var skipProto = typeof iteratee == \'function\' && \n' +
    '    propertyIsEnumerable.call(iteratee, \'prototype\');\n' +
    '  <% } %>' +

    // iterate own properties using `Object.keys` if it's fast
    '  <% if (isKeysFast && useHas) { %>\n' +
    '  var ownIndex = -1,\n' +
    '      ownProps = objectTypes[typeof iteratee] ? nativeKeys(iteratee) : [],\n' +
    '      length = ownProps.length;\n\n' +
    '  <%= objectBranch.beforeLoop %>;\n' +
    '  while (++ownIndex < length) {\n' +
    '    index = ownProps[ownIndex];\n' +
    '    <% if (!hasDontEnumBug) { %>if (!(skipProto && index == \'prototype\')) {\n  <% } %>' +
    '    value = iteratee[index];\n' +
    '    <%= objectBranch.inLoop %>\n' +
    '    <% if (!hasDontEnumBug) { %>}\n<% } %>' +
    '  }' +

    // else using a for-in loop
    '  <% } else { %>\n' +
    '  <%= objectBranch.beforeLoop %>;\n' +
    '  for (index in iteratee) {' +
    '    <% if (hasDontEnumBug) { %>\n' +
    '    <%   if (useHas) { %>if (hasOwnProperty.call(iteratee, index)) {\n  <% } %>' +
    '    value = iteratee[index];\n' +
    '    <%= objectBranch.inLoop %>;\n' +
    '    <%   if (useHas) { %>}<% } %>' +

    // Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
    // (if the prototype or a property on the prototype has been set)
    // incorrectly sets a function's `prototype` property [[Enumerable]]
    // value to `true`. Because of this Lo-Dash standardizes on skipping
    // the the `prototype` property of functions regardless of its
    // [[Enumerable]] value.
    '    <% } else { %>\n' +
    '    if (!(skipProto && index == \'prototype\')<% if (useHas) { %> &&\n' +
    '        hasOwnProperty.call(iteratee, index)<% } %>) {\n' +
    '      value = iteratee[index];\n' +
    '      <%= objectBranch.inLoop %>\n' +
    '    }' +
    '    <% } %>\n' +
    '  }' +
    '  <% } %>' +

    // Because IE < 9 can't set the `[[Enumerable]]` attribute of an
    // existing property and the `constructor` property of a prototype
    // defaults to non-enumerable, Lo-Dash skips the `constructor`
    // property when it infers it's iterating over a `prototype` object.
    '  <% if (hasDontEnumBug) { %>\n\n' +
    '  var ctor = iteratee.constructor;\n' +
    '    <% for (var k = 0; k < 7; k++) { %>\n' +
    '  index = \'<%= shadowed[k] %>\';\n' +
    '  if (<%' +
    '      if (shadowed[k] == \'constructor\') {' +
    '        %>!(ctor && ctor.prototype === iteratee) && <%' +
    '      } %>hasOwnProperty.call(iteratee, index)) {\n' +
    '    value = iteratee[index];\n' +
    '    <%= objectBranch.inLoop %>\n' +
    '  }' +
    '    <% } %>' +
    '  <% } %>' +
    '  <% if (arrayBranch || noArgsEnum) { %>\n}<% } %>' +
    '<% } %>\n' +

    // add code to the bottom of the iteration function
    '<%= bottom %>;\n' +
    // finally, return the `result`
    'return result'
  );

  /**
   * Reusable iterator options shared by
   * `every`, `filter`, `find`, `forEach`, `forIn`, `forOwn`, `groupBy`, `map`,
   * `reject`, `some`, and `sortBy`.
   */
  var baseIteratorOptions = {
    'args': 'collection, callback, thisArg',
    'init': 'collection',
    'top':
      'if (!callback) {\n' +
      '  callback = identity\n' +
      '}\n' +
      'else if (thisArg) {\n' +
      '  callback = iteratorBind(callback, thisArg)\n' +
      '}',
    'inLoop': 'if (callback(value, index, collection) === false) return result'
  };

  /** Reusable iterator options for `countBy`, `groupBy`, and `sortBy` */
  var countByIteratorOptions = {
    'init': '{}',
    'top':
      'var prop;\n' +
      'if (typeof callback != \'function\') {\n' +
      '  var valueProp = callback;\n' +
      '  callback = function(value) { return value[valueProp] }\n' +
      '}\n' +
      'else if (thisArg) {\n' +
      '  callback = iteratorBind(callback, thisArg)\n' +
      '}',
    'inLoop':
      'prop = callback(value, index, collection);\n' +
      '(hasOwnProperty.call(result, prop) ? result[prop]++ : result[prop] = 1)'
  };

  /** Reusable iterator options for `every` and `some` */
  var everyIteratorOptions = {
    'init': 'true',
    'inLoop': 'if (!callback(value, index, collection)) return !result'
  };

  /** Reusable iterator options for `defaults` and `extend` */
  var extendIteratorOptions = {
    'useHas': false,
    'useStrict': false,
    'args': 'object',
    'init': 'object',
    'top':
      'for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {\n' +
      '  if (iteratee = arguments[argsIndex]) {',
    'inLoop': 'result[index] = value',
    'bottom': '  }\n}'
  };

  /** Reusable iterator options for `filter`, `reject`, and `where` */
  var filterIteratorOptions = {
    'init': '[]',
    'inLoop': 'callback(value, index, collection) && result.push(value)'
  };

  /** Reusable iterator options for `find`, `forEach`, `forIn`, and `forOwn` */
  var forEachIteratorOptions = {
    'top': 'if (thisArg) callback = iteratorBind(callback, thisArg)'
  };

  /** Reusable iterator options for `forIn` and `forOwn` */
  var forOwnIteratorOptions = {
    'inLoop': {
      'object': baseIteratorOptions.inLoop
    }
  };

  /** Reusable iterator options for `invoke`, `map`, `pluck`, and `sortBy` */
  var mapIteratorOptions = {
    'init': '',
    'exit': 'if (!collection) return []',
    'beforeLoop': {
      'array':  'result = Array(length)',
      'object': 'result = ' + (isKeysFast ? 'Array(length)' : '[]')
    },
    'inLoop': {
      'array':  'result[index] = callback(value, index, collection)',
      'object': 'result' + (isKeysFast ? '[ownIndex] = ' : '.push') + '(callback(value, index, collection))'
    }
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new function optimized for searching large arrays for a given `value`,
   * starting at `fromIndex`, using strict equality for comparisons, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Number} [fromIndex=0] The index to start searching from.
   * @param {Number} [largeSize=30] The length at which an array is considered large.
   * @returns {Boolean} Returns `true` if `value` is found, else `false`.
   */
  function cachedContains(array, fromIndex, largeSize) {
    fromIndex || (fromIndex = 0);

    var length = array.length,
        isLarge = (length - fromIndex) >= (largeSize || 30),
        cache = isLarge ? {} : array;

    if (isLarge) {
      // init value cache
      var key,
          index = fromIndex - 1;

      while (++index < length) {
        // manually coerce `value` to string because `hasOwnProperty`, in some
        // older versions of Firefox, coerces objects incorrectly
        key = array[index] + '';
        (hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = [])).push(array[index]);
      }
    }
    return function(value) {
      if (isLarge) {
        var key = value + '';
        return hasOwnProperty.call(cache, key) && indexOf(cache[key], value) > -1;
      }
      return indexOf(cache, value, fromIndex) > -1;
    }
  }

  /**
   * Creates compiled iteration functions. The iteration function will be created
   * to iterate over only objects if the first argument of `options.args` is
   * "object" or `options.inLoop.array` is falsey.
   *
   * @private
   * @param {Object} [options1, options2, ...] The compile options objects.
   *
   *  useHas - A boolean to specify whether or not to use `hasOwnProperty` checks
   *   in the object loop.
   *
   *  useStrict - A boolean to specify whether or not to include the ES5
   *   "use strict" directive.
   *
   *  args - A string of comma separated arguments the iteration function will
   *   accept.
   *
   *  init - A string to specify the initial value of the `result` variable.
   *
   *  exit - A string of code to use in place of the default exit-early check
   *   of `if (!arguments[0]) return result`.
   *
   *  top - A string of code to execute after the exit-early check but before
   *   the iteration branches.
   *
   *  beforeLoop - A string or object containing an "array" or "object" property
   *   of code to execute before the array or object loops.
   *
   *  inLoop - A string or object containing an "array" or "object" property
   *   of code to execute in the array or object loops.
   *
   *  bottom - A string of code to execute after the iteration branches but
   *   before the `result` is returned.
   *
   * @returns {Function} Returns the compiled function.
   */
  function createIterator() {
    var object,
        prop,
        value,
        index = -1,
        length = arguments.length;

    // merge options into a template data object
    var data = {
      'bottom': '',
      'exit': '',
      'init': '',
      'top': '',
      'arrayBranch': { 'beforeLoop': '' },
      'objectBranch': { 'beforeLoop': '' }
    };

    while (++index < length) {
      object = arguments[index];
      for (prop in object) {
        value = (value = object[prop]) == null ? '' : value;
        // keep this regexp explicit for the build pre-process
        if (/beforeLoop|inLoop/.test(prop)) {
          if (typeof value == 'string') {
            value = { 'array': value, 'object': value };
          }
          data.arrayBranch[prop] = value.array;
          data.objectBranch[prop] = value.object;
        } else {
          data[prop] = value;
        }
      }
    }
    // set additional template `data` values
    var args = data.args,
        firstArg = /^[^,]+/.exec(args)[0];

    data.firstArg = firstArg;
    data.hasDontEnumBug = hasDontEnumBug;
    data.isKeysFast = isKeysFast;
    data.noArgsEnum = noArgsEnum;
    data.shadowed = shadowed;
    data.useHas = data.useHas !== false;
    data.useStrict = data.useStrict !== false;

    if (!('noCharByIndex' in data)) {
      data.noCharByIndex = noCharByIndex;
    }
    if (!data.exit) {
      data.exit = 'if (!' + firstArg + ') return result';
    }
    if (firstArg != 'collection' || !data.arrayBranch.inLoop) {
      data.arrayBranch = null;
    }
    // create the function factory
    var factory = Function(
        'arrayLikeClasses, ArrayProto, bind, compareAscending, concat, forIn, ' +
        'hasOwnProperty, identity, indexOf, isArguments, isArray, isFunction, ' +
        'isPlainObject, iteratorBind, objectClass, objectTypes, nativeKeys, ' +
        'propertyIsEnumerable, slice, stringClass, toString',
      'var callee = function(' + args + ') {\n' + iteratorTemplate(data) + '\n};\n' +
      'return callee'
    );
    // return the compiled function
    return factory(
      arrayLikeClasses, ArrayProto, bind, compareAscending, concat, forIn,
      hasOwnProperty, identity, indexOf, isArguments, isArray, isFunction,
      isPlainObject, iteratorBind, objectClass, objectTypes, nativeKeys,
      propertyIsEnumerable, slice, stringClass, toString
    );
  }

  /**
   * Used by `sortBy` to compare transformed `collection` values, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {Number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ai = a.index,
        bi = b.index;

    a = a.criteria;
    b = b.criteria;

    if (a === undefined) {
      return 1;
    }
    if (b === undefined) {
      return -1;
    }
    // ensure a stable sort in V8 and other engines
    // http://code.google.com/p/v8/issues/detail?id=90
    return a < b ? -1 : a > b ? 1 : ai < bi ? -1 : 1;
  }

  /**
   * Used by `template` to replace tokens with their corresponding code snippets.
   *
   * @private
   * @param {String} match The matched token.
   * @param {String} index The `tokenized` index of the code snippet.
   * @returns {String} Returns the code snippet.
   */
  function detokenize(match, index) {
    return tokenized[index];
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Used by `escape` to escape characters for inclusion in HTML.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeHtmlChar(match) {
    return htmlEscapes[match];
  }

  /**
   * Checks if a given `value` is an object created by the `Object` constructor
   * assuming objects created by the `Object` constructor have no inherited
   * enumerable properties and that there are no `Object.prototype` extensions.
   *
   * @private
   * @param {Mixed} value The value to check.
   * @param {Boolean} [skipArgsCheck=false] Internally used to skip checks for
   *  `arguments` objects.
   * @returns {Boolean} Returns `true` if the `value` is a plain `Object` object,
   *  else `false`.
   */
  function isPlainObject(value, skipArgsCheck) {
    // avoid non-objects and false positives for `arguments` objects
    var result = false;
    if (!(value && typeof value == 'object') || (!skipArgsCheck && isArguments(value))) {
      return result;
    }
    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
    // methods that are `typeof` "string" and still can coerce nodes to strings.
    // Also check that the constructor is `Object` (i.e. `Object instanceof Object`)
    var ctor = value.constructor;
    if ((!noNodeClass || !(typeof value.toString != 'function' && typeof (value + '') == 'string')) &&
        (!isFunction(ctor) || ctor instanceof ctor)) {
      // IE < 9 iterates inherited properties before own properties. If the first
      // iterated property is an object's own property then there are no inherited
      // enumerable properties.
      if (iteratesOwnLast) {
        forIn(value, function(objValue, objKey) {
          result = !hasOwnProperty.call(value, objKey);
          return false;
        });
        return result === false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(objValue, objKey) {
        result = objKey;
      });
      return result === false || hasOwnProperty.call(value, result);
    }
    return result;
  }

  /**
   * Creates a new function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and the arguments (value, index, object).
   *
   * @private
   * @param {Function} func The function to bind.
   * @param {Mixed} [thisArg] The `this` binding of `func`.
   * @returns {Function} Returns the new bound function.
   */
  function iteratorBind(func, thisArg) {
    return function(value, index, object) {
      return func.call(thisArg, value, index, object);
    };
  }

  /**
   * A no-operation function.
   *
   * @private
   */
  function noop() {
    // no operation performed
  }

  /**
   * Used by `template` to replace "escape" template delimiters with tokens.
   *
   * @private
   * @param {String} match The matched template delimiter.
   * @param {String} value The delimiter value.
   * @returns {String} Returns a token.
   */
  function tokenizeEscape(match, value) {
    if (match && reComplexDelimiter.test(value)) {
      return '<e%-' + value + '%>';
    }
    var index = tokenized.length;
    tokenized[index] = "' +\n__e(" + value + ") +\n'";
    return token + index;
  }

  /**
   * Used by `template` to replace "evaluate" template delimiters, or complex
   * "escape" and "interpolate" delimiters, with tokens.
   *
   * @private
   * @param {String} match The matched template delimiter.
   * @param {String} escapeValue The complex "escape" delimiter value.
   * @param {String} interpolateValue The complex "interpolate" delimiter value.
   * @param {String} [evaluateValue] The "evaluate" delimiter value.
   * @returns {String} Returns a token.
   */
  function tokenizeEvaluate(match, escapeValue, interpolateValue, evaluateValue) {
    if (evaluateValue) {
      var index = tokenized.length;
      tokenized[index] = "';\n" + evaluateValue + ";\n__p += '";
      return token + index;
    }
    return escapeValue
      ? tokenizeEscape(null, escapeValue)
      : tokenizeInterpolate(null, interpolateValue);
  }

  /**
   * Used by `template` to replace "interpolate" template delimiters with tokens.
   *
   * @private
   * @param {String} match The matched template delimiter.
   * @param {String} value The delimiter value.
   * @returns {String} Returns a token.
   */
  function tokenizeInterpolate(match, value) {
    if (match && reComplexDelimiter.test(value)) {
      return '<e%=' + value + '%>';
    }
    var index = tokenized.length;
    tokenized[index] = "' +\n((__t = (" + value + ")) == null ? '' : __t) +\n'";
    return token + index;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })(1, 2, 3);
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return toString.call(value) == argsClass;
  }
  // fallback for browsers that can't detect `arguments` objects by [[Class]]
  if (noArgsClass) {
    isArguments = function(value) {
      return !!(value && hasOwnProperty.call(value, 'callee'));
    };
  }

  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    return toString.call(value) == arrayClass;
  };

  /**
   * Checks if `value` is a function.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(''.concat);
   * // => true
   */
  function isFunction(value) {
    return typeof value == 'function';
  }
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return toString.call(value) == funcClass;
    };
  }

  /**
   * A shim implementation of `Object.keys` that produces an array of the given
   * object's own enumerable property names.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names.
   */
  var shimKeys = createIterator({
    'args': 'object',
    'init': '[]',
    'inLoop': 'result.push(index)'
  });

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a clone of `value`. If `deep` is `true`, all nested objects will
   * also be cloned otherwise they will be assigned by reference. If a value has
   * a `clone` method it will be used to perform the clone. Functions, DOM nodes,
   * `arguments` objects, and objects created by constructors other than `Object`
   * are **not** cloned unless they have a custom `clone` method.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to clone.
   * @param {Boolean} deep A flag to indicate a deep clone.
   * @param {Object} [guard] Internally used to allow this method to work with
   *  others like `_.map` without using their callback `index` argument for `deep`.
   * @param {Array} [stack=[]] Internally used to keep track of traversed objects
   *  to avoid circular references.
   * @param {Object} thorough Internally used to indicate whether or not to perform
   *  a more thorough clone of non-object values.
   * @returns {Mixed} Returns the cloned `value`.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 },
   *   { 'name': 'curly', 'age': 60 }
   * ];
   *
   * _.clone({ 'name': 'moe' });
   * // => { 'name': 'moe' }
   *
   * var shallow = _.clone(stooges);
   * shallow[0] === stooges[0];
   * // => true
   *
   * var deep = _.clone(stooges, true);
   * shallow[0] === stooges[0];
   * // => false
   */
  function clone(value, deep, guard, stack, thorough) {
    if (value == null) {
      return value;
    }
    if (guard) {
      deep = false;
    }
    // avoid slower checks on primitives
    thorough || (thorough = { 'value': null });
    if (thorough.value == null) {
      // primitives passed from iframes use the primary document's native prototypes
      thorough.value = !!(BoolProto.clone || NumberProto.clone || StringProto.clone);
    }
    // use custom `clone` method if available
    var isObj = objectTypes[typeof value];
    if ((isObj || thorough.value) && value.clone && isFunction(value.clone)) {
      thorough.value = null;
      return value.clone(deep);
    }
    // inspect [[Class]]
    if (isObj) {
      // don't clone `arguments` objects, functions, or non-object Objects
      var className = toString.call(value);
      if (!cloneableClasses[className] || (noArgsClass && isArguments(value))) {
        return value;
      }
      var isArr = className == arrayClass;
      isObj = isArr || (className == objectClass ? isPlainObject(value, true) : isObj);
    }
    // shallow clone
    if (!isObj || !deep) {
      // don't clone functions
      return isObj
        ? (isArr ? slice.call(value) : extend({}, value))
        : value;
    }

    var ctor = value.constructor;
    switch (className) {
      case boolClass:
        return new ctor(value == true);

      case dateClass:
        return new ctor(+value);

      case numberClass:
      case stringClass:
        return new ctor(value);

      case regexpClass:
        return ctor(value.source, reFlags.exec(value));
    }

    // check for circular references and return corresponding clone
    stack || (stack = []);
    var length = stack.length;
    while (length--) {
      if (stack[length].source == value) {
        return stack[length].value;
      }
    }

    // init cloned object
    length = value.length;
    var result = isArr ? ctor(length) : {};

    // add current clone and original source value to the stack of traversed objects
    stack.push({ 'value': result, 'source': value });

    // recursively populate clone (susceptible to call stack limits)
    if (isArr) {
      var index = -1;
      while (++index < length) {
        result[index] = clone(value[index], deep, null, stack, thorough);
      }
    } else {
      forOwn(value, function(objValue, key) {
        result[key] = clone(objValue, deep, null, stack, thorough);
      });
    }
    return result;
  }

  /**
   * Assigns enumerable properties of the default object(s) to the `destination`
   * object for all `destination` properties that resolve to `null`/`undefined`.
   * Once a property is set, additional defaults of the same property will be
   * ignored.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The destination object.
   * @param {Object} [default1, default2, ...] The default objects.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * var iceCream = { 'flavor': 'chocolate' };
   * _.defaults(iceCream, { 'flavor': 'vanilla', 'sprinkles': 'rainbow' });
   * // => { 'flavor': 'chocolate', 'sprinkles': 'rainbow' }
   */
  var defaults = createIterator(extendIteratorOptions, {
    'inLoop': 'if (result[index] == null) ' + extendIteratorOptions.inLoop
  });

  /**
   * Creates a shallow clone of `object` excluding the specified properties.
   * Property names may be specified as individual arguments or as arrays of
   * property names.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The source object.
   * @param {Object} [prop1, prop2, ...] The properties to drop.
   * @returns {Object} Returns an object without the dropped properties.
   * @example
   *
   * _.drop({ 'name': 'moe', 'age': 40, 'userid': 'moe1' }, 'userid');
   * // => { 'name': 'moe', 'age': 40 }
   */
  var drop = createIterator({
    'useHas': false,
    'args': 'object',
    'init': '{}',
    'top': 'var props = concat.apply(ArrayProto, arguments)',
    'inLoop': 'if (indexOf(props, index) < 0) result[index] = value'
  });

  /**
   * Assigns enumerable properties of the source object(s) to the `destination`
   * object. Subsequent sources will overwrite propery assignments of previous
   * sources.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The destination object.
   * @param {Object} [source1, source2, ...] The source objects.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * _.extend({ 'name': 'moe' }, { 'age': 40 });
   * // => { 'name': 'moe', 'age': 40 }
   */
  var extend = createIterator(extendIteratorOptions);

  /**
   * Iterates over `object`'s own and inherited enumerable properties, executing
   * the `callback` for each property. The `callback` is bound to `thisArg` and
   * invoked with 3 arguments; (value, key, object). Callbacks may exit iteration
   * early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Dog(name) {
   *   this.name = name;
   * }
   *
   * Dog.prototype.bark = function() {
   *   alert('Woof, woof!');
   * };
   *
   * _.forIn(new Dog('Dagny'), function(value, key) {
   *   alert(key);
   * });
   * // => alerts 'name' and 'bark' (order is not guaranteed)
   */
  var forIn = createIterator(baseIteratorOptions, forEachIteratorOptions, forOwnIteratorOptions, {
    'useHas': false
  });

  /**
   * Iterates over `object`'s own enumerable properties, executing the `callback`
   * for each property. The `callback` is bound to `thisArg` and invoked with 3
   * arguments; (value, key, object). Callbacks may exit iteration early by
   * explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Object} Returns `object`.
   * @example
   *
   * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
   *   alert(key);
   * });
   * // => alerts '0', '1', and 'length' (order is not guaranteed)
   */
  var forOwn = createIterator(baseIteratorOptions, forEachIteratorOptions, forOwnIteratorOptions);

  /**
   * Creates a sorted array of all enumerable properties, own and inherited,
   * of `object` that have function values.
   *
   * @static
   * @memberOf _
   * @alias methods
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names that have function values.
   * @example
   *
   * _.functions(_);
   * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
   */
  var functions = createIterator({
    'useHas': false,
    'args': 'object',
    'init': '[]',
    'inLoop': 'if (isFunction(value)) result.push(index)',
    'bottom': 'result.sort()'
  });

  /**
   * Checks if the specified object `property` exists and is a direct property,
   * instead of an inherited property.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to check.
   * @param {String} property The property to check for.
   * @returns {Boolean} Returns `true` if key is a direct property, else `false`.
   * @example
   *
   * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
   * // => true
   */
  function has(object, property) {
    return object ? hasOwnProperty.call(object, property) : false;
  }

  /**
   * Checks if `value` is a boolean (`true` or `false`) value.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a boolean value, else `false`.
   * @example
   *
   * _.isBoolean(null);
   * // => false
   */
  function isBoolean(value) {
    return value === true || value === false || toString.call(value) == boolClass;
  }

  /**
   * Checks if `value` is a date.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a date, else `false`.
   * @example
   *
   * _.isDate(new Date);
   * // => true
   */
  function isDate(value) {
    return toString.call(value) == dateClass;
  }

  /**
   * Checks if `value` is a DOM element.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a DOM element, else `false`.
   * @example
   *
   * _.isElement(document.body);
   * // => true
   */
  function isElement(value) {
    return value ? value.nodeType === 1 : false;
  }

  /**
   * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
   * length of `0` and objects with no own enumerable properties are considered
   * "empty".
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Array|Object|String} value The value to inspect.
   * @returns {Boolean} Returns `true` if the `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({});
   * // => true
   *
   * _.isEmpty('');
   * // => true
   */
  var isEmpty = createIterator({
    'args': 'value',
    'init': 'true',
    'top':
      'var className = toString.call(value),\n' +
      '    length = value.length;\n' +
      'if (arrayLikeClasses[className]' +
      (noArgsClass ? ' || isArguments(value)' : '') + ' ||\n' +
      '  (className == objectClass && length > -1 && length === length >>> 0 &&\n' +
      '  isFunction(value.splice))' +
      ') return !length',
    'inLoop': {
      'object': 'return false'
    }
  });

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent to each other. If a value has an `isEqual` method it will be
   * used to perform the comparison.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} a The value to compare.
   * @param {Mixed} b The other value to compare.
   * @param {Array} [stack=[]] Internally used to keep track of traversed objects
   *  to avoid circular references.
   * @param {Object} thorough Internally used to indicate whether or not to perform
   *  a more thorough comparison of non-object values.
   * @returns {Boolean} Returns `true` if the values are equvalent, else `false`.
   * @example
   *
   * var moe = { 'name': 'moe', 'luckyNumbers': [13, 27, 34] };
   * var clone = { 'name': 'moe', 'luckyNumbers': [13, 27, 34] };
   *
   * moe == clone;
   * // => false
   *
   * _.isEqual(moe, clone);
   * // => true
   */
  function isEqual(a, b, stack, thorough) {
    // a strict comparison is necessary because `null == undefined`
    if (a == null || b == null) {
      return a === b;
    }
    // avoid slower checks on non-objects
    thorough || (thorough = { 'value': null });
    if (thorough.value == null) {
      // primitives passed from iframes use the primary document's native prototypes
      thorough.value = !!(BoolProto.isEqual || NumberProto.isEqual || StringProto.isEqual);
    }
    if (objectTypes[typeof a] || objectTypes[typeof b] || thorough.value) {
      // unwrap any LoDash wrapped values
      if (a._chain) {
        a = a._wrapped;
      }
      if (b._chain) {
        b = b._wrapped;
      }
      // use custom `isEqual` method if available
      if (a.isEqual && isFunction(a.isEqual)) {
        thorough.value = null;
        return a.isEqual(b);
      }
      if (b.isEqual && isFunction(b.isEqual)) {
        thorough.value = null;
        return b.isEqual(a);
      }
    }
    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || (1 / a == 1 / b);
    }
    // compare [[Class]] names
    var className = toString.call(a);
    if (className != toString.call(b)) {
      return false;
    }
    switch (className) {
      case boolClass:
      case dateClass:
        // coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0`, treating invalid dates coerced to `NaN` as not equal
        return +a == +b;

      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return a != +a
          ? b != +b
          // but treat `+0` vs. `-0` as not equal
          : (a == 0 ? (1 / a == 1 / b) : a == +b);

      case regexpClass:
      case stringClass:
        // coerce regexes to strings (http://es5.github.com/#x15.10.6.4)
        // treat string primitives and their corresponding object instances as equal
        return a == b + '';
    }
    // exit early, in older browsers, if `a` is array-like but not `b`
    var isArr = arrayLikeClasses[className];
    if (noArgsClass && !isArr && (isArr = isArguments(a)) && !isArguments(b)) {
      return false;
    }
    // exit for functions and DOM nodes
    if (!isArr && (className != objectClass || (noNodeClass && (
        (typeof a.toString != 'function' && typeof (a + '') == 'string') ||
        (typeof b.toString != 'function' && typeof (b + '') == 'string'))))) {
      return false;
    }

    // assume cyclic structures are equal
    // the algorithm for detecting cyclic structures is adapted from ES 5.1
    // section 15.12.3, abstract operation `JO` (http://es5.github.com/#x15.12.3)
    stack || (stack = []);
    var length = stack.length;
    while (length--) {
      if (stack[length] == a) {
        return true;
      }
    }

    var index = -1,
        result = true,
        size = 0;

    // add `a` to the stack of traversed objects
    stack.push(a);

    // recursively compare objects and arrays (susceptible to call stack limits)
    if (isArr) {
      // compare lengths to determine if a deep comparison is necessary
      size = a.length;
      result = size == b.length;

      if (result) {
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          if (!(result = isEqual(a[size], b[size], stack, thorough))) {
            break;
          }
        }
      }
      return result;
    }

    var ctorA = a.constructor,
        ctorB = b.constructor;

    // non `Object` object instances with different constructors are not equal
    if (ctorA != ctorB && !(
          isFunction(ctorA) && ctorA instanceof ctorA &&
          isFunction(ctorB) && ctorB instanceof ctorB
        )) {
      return false;
    }
    // deep compare objects
    for (var prop in a) {
      if (hasOwnProperty.call(a, prop)) {
        // count the number of properties.
        size++;
        // deep compare each property value.
        if (!(hasOwnProperty.call(b, prop) && isEqual(a[prop], b[prop], stack, thorough))) {
          return false;
        }
      }
    }
    // ensure both objects have the same number of properties
    for (prop in b) {
      // The JS engine in Adobe products, like InDesign, has a bug that causes
      // `!size--` to throw an error so it must be wrapped in parentheses.
      // https://github.com/documentcloud/underscore/issues/355
      if (hasOwnProperty.call(b, prop) && !(size--)) {
        // `size` will be `-1` if `b` has more properties than `a`
        return false;
      }
    }
    // handle JScript [[DontEnum]] bug
    if (hasDontEnumBug) {
      while (++index < 7) {
        prop = shadowed[index];
        if (hasOwnProperty.call(a, prop) &&
            !(hasOwnProperty.call(b, prop) && isEqual(a[prop], b[prop], stack, thorough))) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Checks if `value` is a finite number.
   *
   * Note: This is not the same as native `isFinite`, which will return true for
   * booleans and other values. See http://es5.github.com/#x15.1.2.5.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a finite number, else `false`.
   * @example
   *
   * _.isFinite(-101);
   * // => true
   *
   * _.isFinite('10');
   * // => false
   *
   * _.isFinite(Infinity);
   * // => false
   */
  function isFinite(value) {
    return nativeIsFinite(value) && toString.call(value) == numberClass;
  }

  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.com/#x8
    // and avoid a V8 bug
    // http://code.google.com/p/v8/issues/detail?id=2291
    return value ? objectTypes[typeof value] : false;
  }

  /**
   * Checks if `value` is `NaN`.
   *
   * Note: This is not the same as native `isNaN`, which will return true for
   * `undefined` and other values. See http://es5.github.com/#x15.1.2.4.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is `NaN`, else `false`.
   * @example
   *
   * _.isNaN(NaN);
   * // => true
   *
   * _.isNaN(new Number(NaN));
   * // => true
   *
   * isNaN(undefined);
   * // => true
   *
   * _.isNaN(undefined);
   * // => false
   */
  function isNaN(value) {
    // `NaN` as a primitive is the only value that is not equal to itself
    // (perform the [[Class]] check first to avoid errors with some host objects in IE)
    return toString.call(value) == numberClass && value != +value
  }

  /**
   * Checks if `value` is `null`.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is `null`, else `false`.
   * @example
   *
   * _.isNull(null);
   * // => true
   *
   * _.isNull(undefined);
   * // => false
   */
  function isNull(value) {
    return value === null;
  }

  /**
   * Checks if `value` is a number.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a number, else `false`.
   * @example
   *
   * _.isNumber(8.4 * 5;
   * // => true
   */
  function isNumber(value) {
    return toString.call(value) == numberClass;
  }

  /**
   * Checks if `value` is a regular expression.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a regular expression, else `false`.
   * @example
   *
   * _.isRegExp(/moe/);
   * // => true
   */
  function isRegExp(value) {
    return toString.call(value) == regexpClass;
  }

  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('moe');
   * // => true
   */
  function isString(value) {
    return toString.call(value) == stringClass;
  }

  /**
   * Checks if `value` is `undefined`.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   */
  function isUndefined(value) {
    return value === undefined;
  }

  /**
   * Creates an array composed of the own enumerable property names of `object`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names.
   * @example
   *
   * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
   * // => ['one', 'two', 'three'] (order is not guaranteed)
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    var type = typeof object;

    // avoid iterating over the `prototype` property
    if (type == 'function' && propertyIsEnumerable.call(object, 'prototype')) {
      return shimKeys(object);
    }
    return object && objectTypes[type]
      ? nativeKeys(object)
      : [];
  };

  /**
   * Merges enumerable properties of the source object(s) into the `destination`
   * object. Subsequent sources will overwrite propery assignments of previous
   * sources.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The destination object.
   * @param {Object} [source1, source2, ...] The source objects.
   * @param {Object} [indicator] Internally used to indicate that the `stack`
   *  argument is an array of traversed objects instead of another source object.
   * @param {Array} [stack=[]] Internally used to keep track of traversed objects
   *  to avoid circular references.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe' },
   *   { 'name': 'larry' }
   * ];
   *
   * var ages = [
   *   { 'age': 40 },
   *   { 'age': 50 }
   * ];
   *
   * _.merge(stooges, ages);
   * // => [{ 'name': 'moe', 'age': 40 }, { 'name': 'larry', 'age': 50 }]
   */
  var merge = createIterator(extendIteratorOptions, {
    'args': 'object, source, indicator, stack',
    'top':
      'var destValue, found, isArr, stackLength, recursive = indicator == isPlainObject;\n' +
      'if (!recursive) stack = [];\n' +
      'for (var argsIndex = 1, argsLength = recursive ? 2 : arguments.length; argsIndex < argsLength; argsIndex++) {\n' +
      '  if (iteratee = arguments[argsIndex]) {',
    'inLoop':
      'if (value && ((isArr = isArray(value)) || isPlainObject(value))) {\n' +
      '  found = false; stackLength = stack.length;\n' +
      '  while (stackLength--) {\n' +
      '    if (found = stack[stackLength].source == value) break\n' +
      '  }\n' +
      '  if (found) {\n' +
      '    result[index] = stack[stackLength].value\n' +
      '  } else {\n' +
      '    destValue = (destValue = result[index]) && isArr\n' +
      '      ? (isArray(destValue) ? destValue : [])\n' +
      '      : (isPlainObject(destValue) ? destValue : {});\n' +
      '    stack.push({ value: destValue, source: value });\n' +
      '    result[index] = callee(destValue, value, isPlainObject, stack)\n' +
      '  }\n' +
      '} else if (value != null) {\n' +
      '  result[index] = value\n' +
      '}'
  });

  /**
   * Creates a shallow clone of `object` composed of the specified properties.
   * Property names may be specified as individual arguments or as arrays of
   * property names.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The source object.
   * @param {Object} [prop1, prop2, ...] The properties to pick.
   * @returns {Object} Returns an object composed of the picked properties.
   * @example
   *
   * _.pick({ 'name': 'moe', 'age': 40, 'userid': 'moe1' }, 'name', 'age');
   * // => { 'name': 'moe', 'age': 40 }
   */
  function pick(object) {
    var result = {};
    if (!object) {
      return result;
    }
    var prop,
        index = 0,
        props = concat.apply(ArrayProto, arguments),
        length = props.length;

    // start `index` at `1` to skip `object`
    while (++index < length) {
      prop = props[index];
      if (prop in object) {
        result[prop] = object[prop];
      }
    }
    return result;
  }

  /**
   * Gets the size of `value` by returning `value.length` if `value` is an
   * array, string, or `arguments` object. If `value` is an object, size is
   * determined by returning the number of own enumerable properties it has.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Objects
   * @param {Array|Object|String} value The value to inspect.
   * @returns {Number} Returns `value.length` or number of own enumerable properties.
   * @example
   *
   * _.size([1, 2]);
   * // => 2
   *
   * _.size({ 'one': 1, 'two': 2, 'three': 3 });
   * // => 3
   *
   * _.size('curly');
   * // => 5
   */
  function size(value) {
    if (!value) {
      return 0;
    }
    var className = toString.call(value),
        length = value.length;

    // return `value.length` for `arguments` objects, arrays, strings, and DOM
    // query collections of libraries like jQuery and MooTools
    // http://code.google.com/p/fbug/source/browse/branches/firebug1.9/content/firebug/chrome/reps.js?r=12614#653
    // http://trac.webkit.org/browser/trunk/Source/WebCore/inspector/InjectedScriptSource.js?rev=125186#L609
    if (arrayLikeClasses[className] || (noArgsClass && isArguments(value)) ||
        (className == objectClass && length > -1 && length === length >>> 0 && isFunction(value.splice))) {
      return length;
    }
    return keys(value).length;
  }

  /**
   * Creates an array composed of the own enumerable property values of `object`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property values.
   * @example
   *
   * _.values({ 'one': 1, 'two': 2, 'three': 3 });
   * // => [1, 2, 3]
   */
  var values = createIterator({
    'args': 'object',
    'init': '[]',
    'inLoop': 'result.push(value)'
  });

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if a given `target` element is present in a `collection` using strict
   * equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @alias include
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Mixed} target The value to check for.
   * @returns {Boolean} Returns `true` if the `target` element is found, else `false`.
   * @example
   *
   * _.contains([1, 2, 3], 3);
   * // => true
   *
   * _.contains({ 'name': 'moe', 'age': 40 }, 'moe');
   * // => true
   *
   * _.contains('curly', 'ur');
   * // => true
   */
  var contains = createIterator({
    'args': 'collection, target',
    'init': 'false',
    'noCharByIndex': false,
    'beforeLoop': {
      'array': 'if (toString.call(iteratee) == stringClass) return collection.indexOf(target) > -1'
    },
    'inLoop': 'if (value === target) return true'
  });

  /**
   * Creates an object composed of keys returned from running each element of
   * `collection` through a `callback`. The corresponding value of each key is
   * the number of times the key was returned by `callback`. The `callback` is
   * bound to `thisArg` and invoked with 3 arguments; (value, index|key, collection).
   * The `callback` argument may also be the name of a property to count by (e.g. 'length').
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|String} callback The function called per iteration or
   *  property name to count by.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Object} Returns the composed aggregate object.
   * @example
   *
   * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
   * // => { '4': 1, '6': 2 }
   *
   * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
   * // => { '4': 1, '6': 2 }
   *
   * _.countBy(['one', 'two', 'three'], 'length');
   * // => { '3': 2, '5': 1 }
   */
  var countBy = createIterator(baseIteratorOptions, countByIteratorOptions);

  /**
   * Checks if the `callback` returns a truthy value for **all** elements of a
   * `collection`. The `callback` is bound to `thisArg` and invoked with 3
   * arguments; (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @alias all
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Boolean} Returns `true` if all elements pass the callback check, else `false`.
   * @example
   *
   * _.every([true, 1, null, 'yes'], Boolean);
   * // => false
   */
  var every = createIterator(baseIteratorOptions, everyIteratorOptions);

  /**
   * Examines each element in a `collection`, returning an array of all elements
   * the `callback` returns truthy for. The `callback` is bound to `thisArg` and
   * invoked with 3 arguments; (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @alias select
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a new array of elements that passed callback check.
   * @example
   *
   * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => [2, 4, 6]
   */
  var filter = createIterator(baseIteratorOptions, filterIteratorOptions);

  /**
   * Examines each element in a `collection`, returning the first one the `callback`
   * returns truthy for. The function returns as soon as it finds an acceptable
   * element, and does not iterate over the entire `collection`. The `callback` is
   * bound to `thisArg` and invoked with 3 arguments; (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @alias detect
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the element that passed the callback check, else `undefined`.
   * @example
   *
   * var even = _.find([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => 2
   */
  var find = createIterator(baseIteratorOptions, forEachIteratorOptions, {
    'init': '',
    'inLoop': 'if (callback(value, index, collection)) return value'
  });

  /**
   * Iterates over a `collection`, executing the `callback` for each element in
   * the `collection`. The `callback` is bound to `thisArg` and invoked with 3
   * arguments; (value, index|key, collection). Callbacks may exit iteration
   * early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array|Object} Returns `collection`.
   * @example
   *
   * _([1, 2, 3]).forEach(alert).join(',');
   * // => alerts each number and returns '1,2,3'
   *
   * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, alert);
   * // => alerts each number (order is not guaranteed)
   */
  var forEach = createIterator(baseIteratorOptions, forEachIteratorOptions);

  /**
   * Creates an object composed of keys returned from running each element of
   * `collection` through a `callback`. The corresponding value of each key is an
   * array of elements passed to `callback` that returned the key. The `callback`
   * is bound to `thisArg` and invoked with 3 arguments; (value, index|key, collection).
   * The `callback` argument may also be the name of a property to count by (e.g. 'length').
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|String} callback The function called per iteration or
   *  property name to group by.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Object} Returns the composed aggregate object.
   * @example
   *
   * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
   * // => { '4': [4.2], '6': [6.1, 6.4] }
   *
   * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
   * // => { '4': [4.2], '6': [6.1, 6.4] }
   *
   * _.groupBy(['one', 'two', 'three'], 'length');
   * // => { '3': ['one', 'two'], '5': ['three'] }
   */
  var groupBy = createIterator(baseIteratorOptions, countByIteratorOptions, {
    'inLoop':
      'prop = callback(value, index, collection);\n' +
      '(hasOwnProperty.call(result, prop) ? result[prop] : result[prop] = []).push(value)'
  });

  /**
   * Invokes the method named by `methodName` on each element in the `collection`.
   * Additional arguments will be passed to each invoked method. If `methodName`
   * is a function it will be invoked for, and `this` bound to, each element
   * in the `collection`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|String} methodName The name of the method to invoke or
   *  the function invoked per iteration.
   * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the method with.
   * @returns {Array} Returns a new array of values returned from each invoked method.
   * @example
   *
   * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
   * // => [[1, 5, 7], [1, 2, 3]]
   *
   * _.invoke([123, 456], String.prototype.split, '');
   * // => [['1', '2', '3'], ['4', '5', '6']]
   */
  var invoke = createIterator(mapIteratorOptions, {
    'args': 'collection, methodName',
    'top':
      'var args = slice.call(arguments, 2),\n' +
      '    isFunc = typeof methodName == \'function\'',
    'inLoop': {
      'array':
        'result[index] = (isFunc ? methodName : value[methodName]).apply(value, args)',
      'object':
        'result' + (isKeysFast ? '[ownIndex] = ' : '.push') +
        '((isFunc ? methodName : value[methodName]).apply(value, args))'
    }
  });

  /**
   * Creates a new array of values by running each element in the `collection`
   * through a `callback`. The `callback` is bound to `thisArg` and invoked with
   * 3 arguments; (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @alias collect
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a new array of elements returned by the callback.
   * @example
   *
   * _.map([1, 2, 3], function(num) { return num * 3; });
   * // => [3, 6, 9]
   *
   * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
   * // => [3, 6, 9] (order is not guaranteed)
   */
  var map = createIterator(baseIteratorOptions, mapIteratorOptions);

  /**
   * Retrieves the value of a specified property from all elements in
   * the `collection`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {String} property The property to pluck.
   * @returns {Array} Returns a new array of property values.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 },
   *   { 'name': 'curly', 'age': 60 }
   * ];
   *
   * _.pluck(stooges, 'name');
   * // => ['moe', 'larry', 'curly']
   */
  var pluck = createIterator(mapIteratorOptions, {
    'args': 'collection, property',
    'inLoop': {
      'array':  'result[index] = value[property]',
      'object': 'result' + (isKeysFast ? '[ownIndex] = ' : '.push') + '(value[property])'
    }
  });

  /**
   * Boils down a `collection` to a single value. The initial state of the
   * reduction is `accumulator` and each successive step of it should be returned
   * by the `callback`. The `callback` is bound to `thisArg` and invoked with 4
   * arguments; for arrays they are (accumulator, value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @alias foldl, inject
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [accumulator] Initial value of the accumulator.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the accumulated value.
   * @example
   *
   * var sum = _.reduce([1, 2, 3], function(memo, num) { return memo + num; });
   * // => 6
   */
  var reduce = createIterator({
    'args': 'collection, callback, accumulator, thisArg',
    'init': 'accumulator',
    'top':
      'var noaccum = arguments.length < 3;\n' +
      'if (thisArg) callback = iteratorBind(callback, thisArg)',
    'beforeLoop': {
      'array': 'if (noaccum) result = collection[++index]'
    },
    'inLoop': {
      'array':
        'result = callback(result, value, index, collection)',
      'object':
        'result = noaccum\n' +
        '  ? (noaccum = false, value)\n' +
        '  : callback(result, value, index, collection)'
    }
  });

  /**
   * The right-associative version of `_.reduce`.
   *
   * @static
   * @memberOf _
   * @alias foldr
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [accumulator] Initial value of the accumulator.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the accumulated value.
   * @example
   *
   * var list = [[0, 1], [2, 3], [4, 5]];
   * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
   * // => [4, 5, 2, 3, 0, 1]
   */
  function reduceRight(collection, callback, accumulator, thisArg) {
    if (!collection) {
      return accumulator;
    }

    var length = collection.length,
        noaccum = arguments.length < 3;

    if(thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    // Opera 10.53-10.60 JITted `length >>> 0` returns the wrong value for negative numbers
    if (length > -1 && length === length >>> 0) {
      var iteratee = noCharByIndex && toString.call(collection) == stringClass
        ? collection.split('')
        : collection;

      if (length && noaccum) {
        accumulator = iteratee[--length];
      }
      while (length--) {
        accumulator = callback(accumulator, iteratee[length], length, collection);
      }
      return accumulator;
    }

    var prop,
        props = keys(collection);

    length = props.length;
    if (length && noaccum) {
      accumulator = collection[props[--length]];
    }
    while (length--) {
      prop = props[length];
      accumulator = callback(accumulator, collection[prop], prop, collection);
    }
    return accumulator;
  }

  /**
   * The opposite of `_.filter`, this method returns the values of a
   * `collection` that `callback` does **not** return truthy for.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a new array of elements that did **not** pass the callback check.
   * @example
   *
   * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => [1, 3, 5]
   */
  var reject = createIterator(baseIteratorOptions, filterIteratorOptions, {
    'inLoop': '!' + filterIteratorOptions.inLoop
  });

  /**
   * Checks if the `callback` returns a truthy value for **any** element of a
   * `collection`. The function returns as soon as it finds passing value, and
   * does not iterate over the entire `collection`. The `callback` is bound to
   * `thisArg` and invoked with 3 arguments; (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @alias any
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Boolean} Returns `true` if any element passes the callback check, else `false`.
   * @example
   *
   * _.some([null, 0, 'yes', false]);
   * // => true
   */
  var some = createIterator(baseIteratorOptions, everyIteratorOptions, {
    'init': 'false',
    'inLoop': everyIteratorOptions.inLoop.replace('!', '')
  });

  /**
   * Creates a new array, stable sorted in ascending order by the results of
   * running each element of `collection` through a `callback`. The `callback`
   * is bound to `thisArg` and invoked with 3 arguments; (value, index|key, collection).
   * The `callback` argument may also be the name of a property to sort by (e.g. 'length').
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|String} callback The function called per iteration or
   *  property name to sort by.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a new array of sorted elements.
   * @example
   *
   * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
   * // => [3, 1, 2]
   *
   * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
   * // => [3, 1, 2]
   *
   * _.sortBy(['larry', 'brendan', 'moe'], 'length');
   * // => ['moe', 'larry', 'brendan']
   */
  var sortBy = createIterator(baseIteratorOptions, countByIteratorOptions, mapIteratorOptions, {
    'inLoop': {
      'array':
        'result[index] = {\n' +
        '  criteria: callback(value, index, collection),\n' +
        '  index: index,\n' +
        '  value: value\n' +
        '}',
      'object':
        'result' + (isKeysFast ? '[ownIndex] = ' : '.push') + '({\n' +
        '  criteria: callback(value, index, collection),\n' +
        '  index: index,\n' +
        '  value: value\n' +
        '})'
    },
    'bottom':
      'result.sort(compareAscending);\n' +
      'length = result.length;\n' +
      'while (length--) {\n' +
      '  result[length] = result[length].value\n' +
      '}'
  });

  /**
   * Converts the `collection`, to an array. Useful for converting the
   * `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to convert.
   * @returns {Array} Returns the new converted array.
   * @example
   *
   * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
   * // => [2, 3, 4]
   */
  function toArray(collection) {
    if (!collection) {
      return [];
    }
    if (collection.toArray && isFunction(collection.toArray)) {
      return collection.toArray();
    }
    var length = collection.length;
    if (length > -1 && length === length >>> 0) {
      return (noArraySliceOnStrings ? toString.call(collection) == stringClass : typeof collection == 'string')
        ? collection.split('')
        : slice.call(collection);
    }
    return values(collection);
  }

  /**
   * Examines each element in a `collection`, returning an array of all elements
   * that contain the given `properties`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Object} properties The object of properties/values to filter by.
   * @returns {Array} Returns a new array of elements that contain the given `properties`.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 },
   *   { 'name': 'curly', 'age': 60 }
   * ];
   *
   * _.where(stooges, { 'age': 40 });
   * // => [{ 'name': 'moe', 'age': 40 }]
   */
  var where = createIterator(filterIteratorOptions, {
    'args': 'collection, properties',
    'top':
      'var pass, prop, propIndex, props = [];\n' +
      'forIn(properties, function(value, prop) { props.push(prop) });\n' +
      'var propsLength = props.length',
    'inLoop':
      'for (pass = true, propIndex = 0; propIndex < propsLength; propIndex++) {\n' +
      '  prop = props[propIndex];\n' +
      '  if (!(pass = value[prop] === properties[prop])) break\n' +
      '}\n' +
      'if (pass) result.push(value)'
  });

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new array with all falsey values of `array` removed. The values
   * `false`, `null`, `0`, `""`, `undefined` and `NaN` are all falsey.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to compact.
   * @returns {Array} Returns a new filtered array.
   * @example
   *
   * _.compact([0, 1, false, 2, '', 3]);
   * // => [1, 2, 3]
   */
  function compact(array) {
    var result = [];
    if (!array) {
      return result;
    }
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (array[index]) {
        result.push(array[index]);
      }
    }
    return result;
  }

  /**
   * Creates a new array of `array` elements not present in the other arrays
   * using strict equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to process.
   * @param {Array} [array1, array2, ...] Arrays to check.
   * @returns {Array} Returns a new array of `array` elements not present in the
   *  other arrays.
   * @example
   *
   * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
   * // => [1, 3, 4]
   */
  function difference(array) {
    var result = [];
    if (!array) {
      return result;
    }
    var index = -1,
        length = array.length,
        flattened = concat.apply(result, arguments),
        contains = cachedContains(flattened, length);

    while (++index < length) {
      if (!contains(array[index])) {
        result.push(array[index]);
      }
    }
    return result;
  }

  /**
   * Gets the first element of the `array`. Pass `n` to return the first `n`
   * elements of the `array`.
   *
   * @static
   * @memberOf _
   * @alias head, take
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Number} [n] The number of elements to return.
   * @param {Object} [guard] Internally used to allow this method to work with
   *  others like `_.map` without using their callback `index` argument for `n`.
   * @returns {Mixed} Returns the first element or an array of the first `n`
   *  elements of `array`.
   * @example
   *
   * _.first([5, 4, 3, 2, 1]);
   * // => 5
   */
  function first(array, n, guard) {
    if (array) {
      return (n == null || guard) ? array[0] : slice.call(array, 0, n);
    }
  }

  /**
   * Flattens a nested array (the nesting can be to any depth). If `shallow` is
   * truthy, `array` will only be flattened a single level.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to compact.
   * @param {Boolean} shallow A flag to indicate only flattening a single level.
   * @returns {Array} Returns a new flattened array.
   * @example
   *
   * _.flatten([1, [2], [3, [[4]]]]);
   * // => [1, 2, 3, 4];
   *
   * _.flatten([1, [2], [3, [[4]]]], true);
   * // => [1, 2, 3, [[4]]];
   */
  function flatten(array, shallow) {
    var result = [];
    if (!array) {
      return result;
    }
    var value,
        index = -1,
        length = array.length;

    while (++index < length) {
      value = array[index];
      if (isArray(value)) {
        push.apply(result, shallow ? value : flatten(value));
      } else {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Gets the index at which the first occurrence of `value` is found using
   * strict equality for comparisons, i.e. `===`. If the `array` is already
   * sorted, passing `true` for `isSorted` will run a faster binary search.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Boolean|Number} [fromIndex=0] The index to start searching from or
   *  `true` to perform a binary search on a sorted `array`.
   * @returns {Number} Returns the index of the matched value or `-1`.
   * @example
   *
   * _.indexOf([1, 2, 3, 1, 2, 3], 2);
   * // => 1
   *
   * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
   * // => 4
   *
   * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
   * // => 2
   */
  function indexOf(array, value, fromIndex) {
    if (!array) {
      return -1;
    }
    var index = -1,
        length = array.length;

    if (fromIndex) {
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? Math.max(0, length + fromIndex) : fromIndex) - 1;
      } else {
        index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
    }
    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Gets all but the last element of `array`. Pass `n` to exclude the last `n`
   * elements from the result.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Number} [n] The number of elements to return.
   * @param {Object} [guard] Internally used to allow this method to work with
   *  others like `_.map` without using their callback `index` argument for `n`.
   * @returns {Array} Returns all but the last element or `n` elements of `array`.
   * @example
   *
   * _.initial([3, 2, 1]);
   * // => [3, 2]
   */
  function initial(array, n, guard) {
    if (!array) {
      return [];
    }
    return slice.call(array, 0, -((n == null || guard) ? 1 : n));
  }

  /**
   * Computes the intersection of all the passed-in arrays using strict equality
   * for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} [array1, array2, ...] Arrays to process.
   * @returns {Array} Returns a new array of unique elements, in order, that are
   *  present in **all** of the arrays.
   * @example
   *
   * _.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
   * // => [1, 2]
   */
  function intersection(array) {
    var result = [];
    if (!array) {
      return result;
    }
    var value,
        index = -1,
        length = array.length,
        others = slice.call(arguments, 1),
        cache = [];

    while (++index < length) {
      value = array[index];
      if (indexOf(result, value) < 0 &&
          every(others, function(other, index) {
            return (cache[index] || (cache[index] = cachedContains(other)))(value);
          })) {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Gets the last element of the `array`. Pass `n` to return the lasy `n`
   * elementsvof the `array`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Number} [n] The number of elements to return.
   * @param {Object} [guard] Internally used to allow this method to work with
   *  others like `_.map` without using their callback `index` argument for `n`.
   * @returns {Mixed} Returns the last element or an array of the last `n`
   *  elements of `array`.
   * @example
   *
   * _.last([3, 2, 1]);
   * // => 1
   */
  function last(array, n, guard) {
    if (array) {
      var length = array.length;
      return (n == null || guard) ? array[length - 1] : slice.call(array, -n || length);
    }
  }

  /**
   * Gets the index at which the last occurrence of `value` is found using
   * strict equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Number} [fromIndex=array.length-1] The index to start searching from.
   * @returns {Number} Returns the index of the matched value or `-1`.
   * @example
   *
   * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
   * // => 4
   *
   * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
   * // => 1
   */
  function lastIndexOf(array, value, fromIndex) {
    if (!array) {
      return -1;
    }
    var index = array.length;
    if (fromIndex && typeof fromIndex == 'number') {
      index = (fromIndex < 0 ? Math.max(0, index + fromIndex) : Math.min(fromIndex, index - 1)) + 1;
    }
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Retrieves the maximum value of an `array`. If `callback` is passed,
   * it will be executed for each value in the `array` to generate the
   * criterion by which the value is ranked. The `callback` is bound to
   * `thisArg` and invoked with 3 arguments; (value, index, array).
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to iterate over.
   * @param {Function} [callback] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the maximum value.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 },
   *   { 'name': 'curly', 'age': 60 }
   * ];
   *
   * _.max(stooges, function(stooge) { return stooge.age; });
   * // => { 'name': 'curly', 'age': 60 };
   */
  function max(array, callback, thisArg) {
    var computed = -Infinity,
        result = computed;

    if (!array) {
      return result;
    }
    var current,
        index = -1,
        length = array.length;

    if (!callback) {
      while (++index < length) {
        if (array[index] > result) {
          result = array[index];
        }
      }
      return result;
    }
    if (thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    while (++index < length) {
      current = callback(array[index], index, array);
      if (current > computed) {
        computed = current;
        result = array[index];
      }
    }
    return result;
  }

  /**
   * Retrieves the minimum value of an `array`. If `callback` is passed,
   * it will be executed for each value in the `array` to generate the
   * criterion by which the value is ranked. The `callback` is bound to `thisArg`
   * and invoked with 3 arguments; (value, index, array).
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to iterate over.
   * @param {Function} [callback] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Mixed} Returns the minimum value.
   * @example
   *
   * _.min([10, 5, 100, 2, 1000]);
   * // => 2
   */
  function min(array, callback, thisArg) {
    var computed = Infinity,
        result = computed;

    if (!array) {
      return result;
    }
    var current,
        index = -1,
        length = array.length;

    if (!callback) {
      while (++index < length) {
        if (array[index] < result) {
          result = array[index];
        }
      }
      return result;
    }
    if (thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    while (++index < length) {
      current = callback(array[index], index, array);
      if (current < computed) {
        computed = current;
        result = array[index];
      }
    }
    return result;
  }

  /**
   * Creates an array of numbers (positive and/or negative) progressing from
   * `start` up to but not including `stop`. This method is a port of Python's
   * `range()` function. See http://docs.python.org/library/functions.html#range.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Number} [start=0] The start of the range.
   * @param {Number} end The end of the range.
   * @param {Number} [step=1] The value to increment or descrement by.
   * @returns {Array} Returns a new range array.
   * @example
   *
   * _.range(10);
   * // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *
   * _.range(1, 11);
   * // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
   *
   * _.range(0, 30, 5);
   * // => [0, 5, 10, 15, 20, 25]
   *
   * _.range(0, -10, -1);
   * // => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
   *
   * _.range(0);
   * // => []
   */
  function range(start, end, step) {
    start = +start || 0;
    step = +step || 1;

    if (end == null) {
      end = start;
      start = 0;
    }
    // use `Array(length)` so V8 will avoid the slower "dictionary" mode
    // http://www.youtube.com/watch?v=XAqIpGU8ZZk#t=16m27s
    var index = -1,
        length = Math.max(0, Math.ceil((end - start) / step)),
        result = Array(length);

    while (++index < length) {
      result[index] = start;
      start += step;
    }
    return result;
  }

  /**
   * The opposite of `_.initial`, this method gets all but the first value of
   * `array`. Pass `n` to exclude the first `n` values from the result.
   *
   * @static
   * @memberOf _
   * @alias tail
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Number} [n] The number of elements to return.
   * @param {Object} [guard] Internally used to allow this method to work with
   *  others like `_.map` without using their callback `index` argument for `n`.
   * @returns {Array} Returns all but the first value or `n` values of `array`.
   * @example
   *
   * _.rest([3, 2, 1]);
   * // => [2, 1]
   */
  function rest(array, n, guard) {
    if (!array) {
      return [];
    }
    return slice.call(array, (n == null || guard) ? 1 : n);
  }

  /**
   * Creates a new array of shuffled `array` values, using a version of the
   * Fisher-Yates shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to shuffle.
   * @returns {Array} Returns a new shuffled array.
   * @example
   *
   * _.shuffle([1, 2, 3, 4, 5, 6]);
   * // => [4, 1, 6, 3, 5, 2]
   */
  function shuffle(array) {
    if (!array) {
      return [];
    }
    var rand,
        index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
      rand = Math.floor(Math.random() * (index + 1));
      result[index] = result[rand];
      result[rand] = array[index];
    }
    return result;
  }

  /**
   * Uses a binary search to determine the smallest index at which the `value`
   * should be inserted into `array` in order to maintain the sort order of the
   * sorted `array`. If `callback` is passed, it will be executed for `value` and
   * each element in `array` to compute their sort ranking. The `callback` is
   * bound to `thisArg` and invoked with 1 argument; (value).
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to iterate over.
   * @param {Mixed} value The value to evaluate.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Number} Returns the index at which the value should be inserted
   *  into `array`.
   * @example
   *
   * _.sortedIndex([20, 30, 40], 35);
   * // => 2
   *
   * var dict = {
   *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'thirty-five': 35, 'fourty': 40 }
   * };
   *
   * _.sortedIndex(['twenty', 'thirty', 'fourty'], 'thirty-five', function(word) {
   *   return dict.wordToNumber[word];
   * });
   * // => 2
   *
   * _.sortedIndex(['twenty', 'thirty', 'fourty'], 'thirty-five', function(word) {
   *   return this.wordToNumber[word];
   * }, dict);
   * // => 2
   */
  function sortedIndex(array, value, callback, thisArg) {
    if (!array) {
      return 0;
    }
    var mid,
        low = 0,
        high = array.length;

    if (callback) {
      if (thisArg) {
        callback = bind(callback, thisArg);
      }
      value = callback(value);
      while (low < high) {
        mid = (low + high) >>> 1;
        callback(array[mid]) < value ? low = mid + 1 : high = mid;
      }
    } else {
      while (low < high) {
        mid = (low + high) >>> 1;
        array[mid] < value ? low = mid + 1 : high = mid;
      }
    }
    return low;
  }

  /**
   * Computes the union of the passed-in arrays using strict equality for
   * comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} [array1, array2, ...] Arrays to process.
   * @returns {Array} Returns a new array of unique values, in order, that are
   *  present in one or more of the arrays.
   * @example
   *
   * _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
   * // => [1, 2, 3, 101, 10]
   */
  function union() {
    var index = -1,
        result = [],
        flattened = concat.apply(result, arguments),
        length = flattened.length;

    while (++index < length) {
      if (indexOf(result, flattened[index]) < 0) {
        result.push(flattened[index]);
      }
    }
    return result;
  }

  /**
   * Creates a duplicate-value-free version of the `array` using strict equality
   * for comparisons, i.e. `===`. If the `array` is already sorted, passing `true`
   * for `isSorted` will run a faster algorithm. If `callback` is passed, each
   * element of `array` is passed through a callback` before uniqueness is computed.
   * The `callback` is bound to `thisArg` and invoked with 3 arguments; (value, index, array).
   *
   * @static
   * @memberOf _
   * @alias unique
   * @category Arrays
   * @param {Array} array The array to process.
   * @param {Boolean} [isSorted=false] A flag to indicate that the `array` is already sorted.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @returns {Array} Returns a duplicate-value-free array.
   * @example
   *
   * _.uniq([1, 2, 1, 3, 1]);
   * // => [1, 2, 3]
   *
   * _.uniq([1, 1, 2, 2, 3], true);
   * // => [1, 2, 3]
   *
   * _.uniq([1, 2, 1.5, 3, 2.5], function(num) { return Math.floor(num); });
   * // => [1, 2, 3]
   *
   * _.uniq([1, 2, 1.5, 3, 2.5], function(num) { return this.floor(num); }, Math);
   * // => [1, 2, 3]
   */
  function uniq(array, isSorted, callback, thisArg) {
    var result = [];
    if (!array) {
      return result;
    }
    var computed,
        index = -1,
        length = array.length,
        seen = [];

    // juggle arguments
    if (typeof isSorted == 'function') {
      thisArg = callback;
      callback = isSorted;
      isSorted = false;
    }
    if (!callback) {
      callback = identity;
    } else if (thisArg) {
      callback = iteratorBind(callback, thisArg);
    }
    while (++index < length) {
      computed = callback(array[index], index, array);
      if (isSorted
            ? !index || seen[seen.length - 1] !== computed
            : indexOf(seen, computed) < 0
          ) {
        seen.push(computed);
        result.push(array[index]);
      }
    }
    return result;
  }

  /**
   * Creates a new array with all occurrences of the passed values removed using
   * strict equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to filter.
   * @param {Mixed} [value1, value2, ...] Values to remove.
   * @returns {Array} Returns a new filtered array.
   * @example
   *
   * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
   * // => [2, 3, 4]
   */
  function without(array) {
    var result = [];
    if (!array) {
      return result;
    }
    var index = -1,
        length = array.length,
        contains = cachedContains(arguments, 1, 20);

    while (++index < length) {
      if (!contains(array[index])) {
        result.push(array[index]);
      }
    }
    return result;
  }

  /**
   * Groups the elements of each array at their corresponding indexes. Useful for
   * separate data sources that are coordinated through matching array indexes.
   * For a matrix of nested arrays, `_.zip.apply(...)` can transpose the matrix
   * in a similar fashion.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} [array1, array2, ...] Arrays to process.
   * @returns {Array} Returns a new array of grouped elements.
   * @example
   *
   * _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
   * // => [['moe', 30, true], ['larry', 40, false], ['curly', 50, false]]
   */
  function zip(array) {
    if (!array) {
      return [];
    }
    var index = -1,
        length = max(pluck(arguments, 'length')),
        result = Array(length);

    while (++index < length) {
      result[index] = pluck(arguments, index);
    }
    return result;
  }

  /**
   * Creates an object composed from an array of `keys` and an array of `values`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} keys The array of keys.
   * @param {Array} [values=[]] The array of values.
   * @returns {Object} Returns an object composed of the given keys and
   *  corresponding values.
   * @example
   *
   * _.zipObject(['moe', 'larry', 'curly'], [30, 40, 50]);
   * // => { 'moe': 30, 'larry': 40, 'curly': 50 }
   */
  function zipObject(keys, values) {
    if (!keys) {
      return {};
    }
    var index = -1,
        length = keys.length,
        result = {};

    values || (values = []);
    while (++index < length) {
      result[keys[index]] = values[index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new function that is restricted to executing only after it is
   * called `n` times.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Number} n The number of times the function must be called before
   * it is executed.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var renderNotes = _.after(notes.length, render);
   * _.forEach(notes, function(note) {
   *   note.asyncSave({ 'success': renderNotes });
   * });
   * // `renderNotes` is run once, after all notes have saved
   */
  function after(n, func) {
    if (n < 1) {
      return func();
    }
    return function() {
      if (--n < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  /**
   * Creates a new function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any additional `bind` arguments to those
   * passed to the bound function. Lazy defined methods may be bound by passing
   * the object they are bound to as `func` and the method name as `thisArg`.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function|Object} func The function to bind or the object the method belongs to.
   * @param {Mixed} [thisArg] The `this` binding of `func` or the method name.
   * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * // basic bind
   * var func = function(greeting) {
   *   return greeting + ' ' + this.name;
   * };
   *
   * func = _.bind(func, { 'name': 'moe' }, 'hi');
   * func();
   * // => 'hi moe'
   *
   * // lazy bind
   * var object = {
   *   'name': 'moe',
   *   'greet': function(greeting) {
   *     return greeting + ' ' + this.name;
   *   }
   * };
   *
   * var func = _.bind(object, 'greet', 'hi');
   * func();
   * // => 'hi moe'
   *
   * object.greet = function(greeting) {
   *   return greeting + ', ' + this.name + '!';
   * };
   *
   * func();
   * // => 'hi, moe!'
   */
  function bind(func, thisArg) {
    var methodName,
        isFunc = isFunction(func);

    // juggle arguments
    if (!isFunc) {
      methodName = thisArg;
      thisArg = func;
    }
    // use `Function#bind` if it exists and is fast
    // (in V8 `Function#bind` is slower except when partially applied)
    else if (isBindFast || (nativeBind && arguments.length > 2)) {
      return nativeBind.call.apply(nativeBind, arguments);
    }

    var partialArgs = slice.call(arguments, 2);

    function bound() {
      // `Function#bind` spec
      // http://es5.github.com/#x15.3.4.5
      var args = arguments,
          thisBinding = thisArg;

      if (!isFunc) {
        func = thisArg[methodName];
      }
      if (partialArgs.length) {
        args = args.length
          ? partialArgs.concat(slice.call(args))
          : partialArgs;
      }
      if (this instanceof bound) {
        // get `func` instance if `bound` is invoked in a `new` expression
        noop.prototype = func.prototype;
        thisBinding = new noop;

        // mimic the constructor's `return` behavior
        // http://es5.github.com/#x13.2.2
        var result = func.apply(thisBinding, args);
        return result && objectTypes[typeof result]
          ? result
          : thisBinding
      }
      return func.apply(thisBinding, args);
    }
    return bound;
  }

  /**
   * Binds methods on `object` to `object`, overwriting the existing method.
   * If no method names are provided, all the function properties of `object`
   * will be bound.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Object} object The object to bind and assign the bound methods to.
   * @param {String} [methodName1, methodName2, ...] Method names on the object to bind.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var buttonView = {
   *  'label': 'lodash',
   *  'onClick': function() { alert('clicked: ' + this.label); }
   * };
   *
   * _.bindAll(buttonView);
   * jQuery('#lodash_button').on('click', buttonView.onClick);
   * // => When the button is clicked, `this.label` will have the correct value
   */
  var bindAll = createIterator({
    'useHas': false,
    'useStrict': false,
    'args': 'object',
    'init': 'object',
    'top':
      'var funcs = arguments,\n' +
      '    length = funcs.length;\n' +
      'if (length > 1) {\n' +
      '  for (var index = 1; index < length; index++) {\n' +
      '    result[funcs[index]] = bind(result[funcs[index]], result)\n' +
      '  }\n' +
      '  return result\n' +
      '}',
    'inLoop':
      'if (isFunction(result[index])) {\n' +
      '  result[index] = bind(result[index], result)\n' +
      '}'
  });

  /**
   * Creates a new function that is the composition of the passed functions,
   * where each function consumes the return value of the function that follows.
   * In math terms, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} [func1, func2, ...] Functions to compose.
   * @returns {Function} Returns the new composed function.
   * @example
   *
   * var greet = function(name) { return 'hi: ' + name; };
   * var exclaim = function(statement) { return statement + '!'; };
   * var welcome = _.compose(exclaim, greet);
   * welcome('moe');
   * // => 'hi: moe!'
   */
  function compose() {
    var funcs = arguments;
    return function() {
      var args = arguments,
          length = funcs.length;

      while (length--) {
        args = [funcs[length].apply(this, args)];
      }
      return args[0];
    };
  }

  /**
   * Creates a new function that will delay the execution of `func` until after
   * `wait` milliseconds have elapsed since the last time it was invoked. Pass
   * `true` for `immediate` to cause debounce to invoke `func` on the leading,
   * instead of the trailing, edge of the `wait` timeout. Subsequent calls to
   * the debounced function will return the result of the last `func` call.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to debounce.
   * @param {Number} wait The number of milliseconds to delay.
   * @param {Boolean} immediate A flag to indicate execution is on the leading
   *  edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * var lazyLayout = _.debounce(calculateLayout, 300);
   * jQuery(window).on('resize', lazyLayout);
   */
  function debounce(func, wait, immediate) {
    var args,
        result,
        thisArg,
        timeoutId;

    function delayed() {
      timeoutId = null;
      if (!immediate) {
        func.apply(thisArg, args);
      }
    }

    return function() {
      var isImmediate = immediate && !timeoutId;
      args = arguments;
      thisArg = this;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(delayed, wait);

      if (isImmediate) {
        result = func.apply(thisArg, args);
      }
      return result;
    };
  }

  /**
   * Executes the `func` function after `wait` milliseconds. Additional arguments
   * will be passed to `func` when it is invoked.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to delay.
   * @param {Number} wait The number of milliseconds to delay execution.
   * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the function with.
   * @returns {Number} Returns the `setTimeout` timeout id.
   * @example
   *
   * var log = _.bind(console.log, console);
   * _.delay(log, 1000, 'logged later');
   * // => 'logged later' (Appears after one second.)
   */
  function delay(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function() { return func.apply(undefined, args); }, wait);
  }

  /**
   * Defers executing the `func` function until the current call stack has cleared.
   * Additional arguments will be passed to `func` when it is invoked.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to defer.
   * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the function with.
   * @returns {Number} Returns the `setTimeout` timeout id.
   * @example
   *
   * _.defer(function() { alert('deferred'); });
   * // returns from the function before `alert` is called
   */
  function defer(func) {
    var args = slice.call(arguments, 1);
    return setTimeout(function() { return func.apply(undefined, args); }, 1);
  }

  /**
   * Creates a new function that memoizes the result of `func`. If `resolver` is
   * passed, it will be used to determine the cache key for storing the result
   * based on the arguments passed to the memoized function. By default, the first
   * argument passed to the memoized function is used as the cache key.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] A function used to resolve the cache key.
   * @returns {Function} Returns the new memoizing function.
   * @example
   *
   * var fibonacci = _.memoize(function(n) {
   *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
   * });
   */
  function memoize(func, resolver) {
    var cache = {};
    return function() {
      var prop = resolver ? resolver.apply(this, arguments) : arguments[0];
      return hasOwnProperty.call(cache, prop)
        ? cache[prop]
        : (cache[prop] = func.apply(this, arguments));
    };
  }

  /**
   * Creates a new function that is restricted to one execution. Repeat calls to
   * the function will return the value of the first call.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // Application is only created once.
   */
  function once(func) {
    var result,
        ran = false;

    return function() {
      if (ran) {
        return result;
      }
      ran = true;
      result = func.apply(this, arguments);

      // clear the `func` variable so the function may be garbage collected
      func = null;
      return result;
    };
  }

  /**
   * Creates a new function that, when called, invokes `func` with any additional
   * `partial` arguments prepended to those passed to the new function. This method
   * is similar `bind`, except it does **not** alter the `this` binding.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to partially apply arguments to.
   * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
   * @returns {Function} Returns the new partially applied function.
   * @example
   *
   * var greet = function(greeting, name) { return greeting + ': ' + name; };
   * var hi = _.partial(greet, 'hi');
   * hi('moe');
   * // => 'hi: moe'
   */
  function partial(func) {
    var args = slice.call(arguments, 1),
        argsLength = args.length;

    return function() {
      var result,
          others = arguments;

      if (others.length) {
        args.length = argsLength;
        push.apply(args, others);
      }
      result = args.length == 1 ? func.call(this, args[0]) : func.apply(this, args);
      args.length = argsLength;
      return result;
    };
  }

  /**
   * Creates a new function that, when executed, will only call the `func`
   * function at most once per every `wait` milliseconds. If the throttled
   * function is invoked more than once during the `wait` timeout, `func` will
   * also be called on the trailing edge of the timeout. Subsequent calls to the
   * throttled function will return the result of the last `func` call.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to throttle.
   * @param {Number} wait The number of milliseconds to throttle executions to.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * var throttled = _.throttle(updatePosition, 100);
   * jQuery(window).on('scroll', throttled);
   */
  function throttle(func, wait) {
    var args,
        result,
        thisArg,
        timeoutId,
        lastCalled = 0;

    function trailingCall() {
      lastCalled = new Date;
      timeoutId = null;
      func.apply(thisArg, args);
    }

    return function() {
      var now = new Date,
          remain = wait - (now - lastCalled);

      args = arguments;
      thisArg = this;

      if (remain <= 0) {
        lastCalled = now;
        result = func.apply(thisArg, args);
      }
      else if (!timeoutId) {
        timeoutId = setTimeout(trailingCall, remain);
      }
      return result;
    };
  }

  /**
   * Creates a new function that passes `value` to the `wrapper` function as its
   * first argument. Additional arguments passed to the new function are appended
   * to those passed to the `wrapper` function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Mixed} value The value to wrap.
   * @param {Function} wrapper The wrapper function.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var hello = function(name) { return 'hello: ' + name; };
   * hello = _.wrap(hello, function(func) {
   *   return 'before, ' + func('moe') + ', after';
   * });
   * hello();
   * // => 'before, hello: moe, after'
   */
  function wrap(value, wrapper) {
    return function() {
      var args = [value];
      if (arguments.length) {
        push.apply(args, arguments);
      }
      return wrapper.apply(this, args);
    };
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Escapes a string for inclusion in HTML, replacing `&`, `<`, `"`, and `'`
   * characters.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} string The string to escape.
   * @returns {String} Returns the escaped string.
   * @example
   *
   * _.escape('Moe, Larry & Curly');
   * // => "Moe, Larry &amp; Curly"
   */
  function escape(string) {
    return string == null ? '' : (string + '').replace(reUnescapedHtml, escapeHtmlChar);
  }

  /**
   * This function returns the first argument passed to it.
   *
   * Note: It is used throughout Lo-Dash as a default callback.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Mixed} value Any value.
   * @returns {Mixed} Returns `value`.
   * @example
   *
   * var moe = { 'name': 'moe' };
   * moe === _.identity(moe);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Adds functions properties of `object` to the `lodash` function and chainable
   * wrapper.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} object The object of function properties to add to `lodash`.
   * @example
   *
   * _.mixin({
   *   'capitalize': function(string) {
   *     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
   *   }
   * });
   *
   * _.capitalize('larry');
   * // => 'Larry'
   *
   * _('curly').capitalize();
   * // => 'Curly'
   */
  function mixin(object) {
    forEach(functions(object), function(methodName) {
      var func = lodash[methodName] = object[methodName];

      LoDash.prototype[methodName] = function() {
        var args = [this._wrapped];
        if (arguments.length) {
          push.apply(args, arguments);
        }
        var result = func.apply(lodash, args);
        if (this._chain) {
          result = new LoDash(result);
          result._chain = true;
        }
        return result;
      };
    });
  }

  /**
   * Reverts the '_' variable to its previous value and returns a reference to
   * the `lodash` function.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @returns {Function} Returns the `lodash` function.
   * @example
   *
   * var lodash = _.noConflict();
   */
  function noConflict() {
    window._ = oldDash;
    return this;
  }

  /**
   * Resolves the value of `property` on `object`. If `property` is a function
   * it will be invoked and its result returned, else the property value is
   * returned. If `object` is falsey, then `null` is returned.
   *
   * @deprecated
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} object The object to inspect.
   * @param {String} property The property to get the result of.
   * @returns {Mixed} Returns the resolved value.
   * @example
   *
   * var object = {
   *   'cheese': 'crumpets',
   *   'stuff': function() {
   *     return 'nonsense';
   *   }
   * };
   *
   * _.result(object, 'cheese');
   * // => 'crumpets'
   *
   * _.result(object, 'stuff');
   * // => 'nonsense'
   */
  function result(object, property) {
    // based on Backbone's private `getValue` function
    // https://github.com/documentcloud/backbone/blob/0.9.2/backbone.js#L1419-1424
    if (!object) {
      return null;
    }
    var value = object[property];
    return isFunction(value) ? object[property]() : value;
  }

  /**
   * A micro-templating method that handles arbitrary delimiters, preserves
   * whitespace, and correctly escapes quotes within interpolated code.
   *
   * Note: In the development build `_.template` utilizes sourceURLs for easier
   * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
   *
   * Note: Lo-Dash may be used in Chrome extensions by either creating a `lodash csp`
   * build and avoiding `_.template` use, or loading Lo-Dash in a sandboxed page.
   * See http://developer.chrome.com/trunk/extensions/sandboxingEval.html
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} text The template text.
   * @param {Obect} data The data object used to populate the text.
   * @param {Object} options The options object.
   * @returns {Function|String} Returns a compiled function when no `data` object
   *  is given, else it returns the interpolated text.
   * @example
   *
   * // using a compiled template
   * var compiled = _.template('hello: <%= name %>');
   * compiled({ 'name': 'moe' });
   * // => 'hello: moe'
   *
   * var list = '<% _.forEach(people, function(name) { %> <li><%= name %></li> <% }); %>';
   * _.template(list, { 'people': ['moe', 'larry', 'curly'] });
   * // => '<li>moe</li><li>larry</li><li>curly</li>'
   *
   * // using the "escape" delimiter to escape HTML in data property values
   * _.template('<b><%- value %></b>', { 'value': '<script>' });
   * // => '<b>&lt;script></b>'
   *
   * // using the internal `print` function in "evaluate" delimiters
   * _.template('<% print("Hello " + epithet); %>', { 'epithet': 'stooge' });
   * // => 'Hello stooge.'
   *
   * // using custom template delimiter settings
   * _.templateSettings = {
   *   'interpolate': /\{\{(.+?)\}\}/g
   * };
   *
   * _.template('Hello {{ name }}!', { 'name': 'Mustache' });
   * // => 'Hello Mustache!'
   *
   * // using the `variable` option to ensure a with-statement isn't used in the compiled template
   * var compiled = _.template('hello: <%= data.name %>', null, { 'variable': 'data' });
   * compiled.source;
   * // => function(data) {
   *   var __t, __p = '', __e = _.escape;
   *   __p += 'hello: ' + ((__t = ( data.name )) == null ? '' : __t);
   *   return __p;
   * }
   *
   * // using the `source` property to inline compiled templates for meaningful
   * // line numbers in error messages and a stack trace
   * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
   *   var JST = {\
   *     "main": ' + _.template(mainText).source + '\
   *   };\
   * ');
   */
  function template(text, data, options) {
    // based on John Resig's `tmpl` implementation
    // http://ejohn.org/blog/javascript-micro-templating/
    // and Laura Doktorova's doT.js
    // https://github.com/olado/doT
    options || (options = {});
    text += '';

    var isEvaluating,
        result,
        escapeDelimiter = options.escape,
        evaluateDelimiter = options.evaluate,
        interpolateDelimiter = options.interpolate,
        settings = lodash.templateSettings,
        variable = options.variable || settings.variable,
        hasVariable = variable;

    // use default settings if no options object is provided
    if (escapeDelimiter == null) {
      escapeDelimiter = settings.escape;
    }
    if (evaluateDelimiter == null) {
      // use `false` as the fallback value, instead of leaving it `undefined`,
      // so the initial assignment of `reEvaluateDelimiter` will still occur
      evaluateDelimiter = settings.evaluate || false;
    }
    if (interpolateDelimiter == null) {
      interpolateDelimiter = settings.interpolate;
    }

    // tokenize delimiters to avoid escaping them
    if (escapeDelimiter) {
      text = text.replace(escapeDelimiter, tokenizeEscape);
    }
    if (interpolateDelimiter) {
      text = text.replace(interpolateDelimiter, tokenizeInterpolate);
    }
    if (evaluateDelimiter != lastEvaluateDelimiter) {
      // generate `reEvaluateDelimiter` to match `_.templateSettings.evaluate`
      // and internal `<e%- %>`, `<e%= %>` delimiters
      lastEvaluateDelimiter = evaluateDelimiter;
      reEvaluateDelimiter = RegExp(
        '<e%-([\\s\\S]+?)%>|<e%=([\\s\\S]+?)%>' +
        (evaluateDelimiter ? '|' + evaluateDelimiter.source : '')
      , 'g');
    }
    isEvaluating = tokenized.length;
    text = text.replace(reEvaluateDelimiter, tokenizeEvaluate);
    isEvaluating = isEvaluating != tokenized.length;

    // escape characters that cannot be included in string literals and
    // detokenize delimiter code snippets
    text = "__p += '" + text
      .replace(reUnescapedString, escapeStringChar)
      .replace(reToken, detokenize) + "';\n";

    // clear stored code snippets
    tokenized.length = 0;

    // if `variable` is not specified and the template contains "evaluate"
    // delimiters, wrap a with-statement around the generated code to add the
    // data object to the top of the scope chain
    if (!hasVariable) {
      variable = lastVariable || 'obj';

      if (isEvaluating) {
        text = 'with (' + variable + ') {\n' + text + '\n}\n';
      }
      else {
        if (variable != lastVariable) {
          // generate `reDoubleVariable` to match references like `obj.obj` inside
          // transformed "escape" and "interpolate" delimiters
          lastVariable = variable;
          reDoubleVariable = RegExp('(\\(\\s*)' + variable + '\\.' + variable + '\\b', 'g');
        }
        // avoid a with-statement by prepending data object references to property names
        text = text
          .replace(reInsertVariable, '$&' + variable + '.')
          .replace(reDoubleVariable, '$1__d');
      }
    }

    // cleanup code by stripping empty strings
    text = ( isEvaluating ? text.replace(reEmptyStringLeading, '') : text)
      .replace(reEmptyStringMiddle, '$1')
      .replace(reEmptyStringTrailing, '$1;');

    // frame code as the function body
    text = 'function(' + variable + ') {\n' +
      (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
      'var __t, __p = \'\', __e = _.escape' +
      (isEvaluating
        ? ', __j = Array.prototype.join;\n' +
          'function print() { __p += __j.call(arguments, \'\') }\n'
        : (hasVariable ? '' : ', __d = ' + variable + '.' + variable + ' || ' + variable) + ';\n'
      ) +
      text +
      'return __p\n}';

    // add a sourceURL for easier debugging
    // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
    if (useSourceURL) {
      text += '\n//@ sourceURL=/lodash/template/source[' + (templateCounter++) + ']';
    }

    try {
      result = Function('_', 'return ' + text)(lodash);
    } catch(e) {
      // defer syntax errors until the compiled template is executed to allow
      // examining the `source` property beforehand and for consistency,
      // because other template related errors occur at execution
      result = function() { throw e; };
    }

    if (data) {
      return result(data);
    }
    // provide the compiled function's source via its `toString` method, in
    // supported environments, or the `source` property as a convenience for
    // inlining compiled templates during the build process
    result.source = text;
    return result;
  }

  /**
   * Executes the `callback` function `n` times. The `callback` is bound to
   * `thisArg` and invoked with 1 argument; (index).
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Number} n The number of times to execute the callback.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding for the callback.
   * @example
   *
   * _.times(3, function() { genie.grantWish(); });
   * // => calls `genie.grantWish()` 3 times
   *
   * _.times(3, function() { this.grantWish(); }, genie);
   * // => also calls `genie.grantWish()` 3 times
   */
  function times(n, callback, thisArg) {
    var index = -1;
    if (thisArg) {
      while (++index < n) {
        callback.call(thisArg, index);
      }
    } else {
      while (++index < n) {
        callback(index);
      }
    }
  }

  /**
   * Generates a unique id. If `prefix` is passed, the id will be appended to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} [prefix] The value to prefix the id with.
   * @returns {Number|String} Returns a numeric id if no prefix is passed, else
   *  a string id may be returned.
   * @example
   *
   * _.uniqueId('contact_');
   * // => 'contact_104'
   */
  function uniqueId(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Wraps the value in a `lodash` wrapper object.
   *
   * @static
   * @memberOf _
   * @category Chaining
   * @param {Mixed} value The value to wrap.
   * @returns {Object} Returns the wrapper object.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 },
   *   { 'name': 'curly', 'age': 60 }
   * ];
   *
   * var youngest = _.chain(stooges)
   *     .sortBy(function(stooge) { return stooge.age; })
   *     .map(function(stooge) { return stooge.name + ' is ' + stooge.age; })
   *     .first()
   *     .value();
   * // => 'moe is 40'
   */
  function chain(value) {
    value = new LoDash(value);
    value._chain = true;
    return value;
  }

  /**
   * Invokes `interceptor` with the `value` as the first argument, and then
   * returns `value`. The purpose of this method is to "tap into" a method chain,
   * in order to perform operations on intermediate results within the chain.
   *
   * @static
   * @memberOf _
   * @category Chaining
   * @param {Mixed} value The value to pass to `interceptor`.
   * @param {Function} interceptor The function to invoke.
   * @returns {Mixed} Returns `value`.
   * @example
   *
   * _.chain([1,2,3,200])
   *  .filter(function(num) { return num % 2 == 0; })
   *  .tap(alert)
   *  .map(function(num) { return num * num })
   *  .value();
   * // => // [2, 200] (alerted)
   * // => [4, 40000]
   */
  function tap(value, interceptor) {
    interceptor(value);
    return value;
  }

  /**
   * Enables method chaining on the wrapper object.
   *
   * @name chain
   * @deprecated
   * @memberOf _
   * @category Chaining
   * @returns {Mixed} Returns the wrapper object.
   * @example
   *
   * _([1, 2, 3]).value();
   * // => [1, 2, 3]
   */
  function wrapperChain() {
    this._chain = true;
    return this;
  }

  /**
   * Extracts the wrapped value.
   *
   * @name value
   * @memberOf _
   * @category Chaining
   * @returns {Mixed} Returns the wrapped value.
   * @example
   *
   * _([1, 2, 3]).value();
   * // => [1, 2, 3]
   */
  function wrapperValue() {
    return this._wrapped;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type String
   */
  lodash.VERSION = '0.5.2';

  // assign static methods
  lodash.after = after;
  lodash.bind = bind;
  lodash.bindAll = bindAll;
  lodash.chain = chain;
  lodash.clone = clone;
  lodash.compact = compact;
  lodash.compose = compose;
  lodash.contains = contains;
  lodash.countBy = countBy;
  lodash.debounce = debounce;
  lodash.defaults = defaults;
  lodash.defer = defer;
  lodash.delay = delay;
  lodash.difference = difference;
  lodash.drop = drop;
  lodash.escape = escape;
  lodash.every = every;
  lodash.extend = extend;
  lodash.filter = filter;
  lodash.find = find;
  lodash.first = first;
  lodash.flatten = flatten;
  lodash.forEach = forEach;
  lodash.forIn = forIn;
  lodash.forOwn = forOwn;
  lodash.functions = functions;
  lodash.groupBy = groupBy;
  lodash.has = has;
  lodash.identity = identity;
  lodash.indexOf = indexOf;
  lodash.initial = initial;
  lodash.intersection = intersection;
  lodash.invoke = invoke;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isBoolean = isBoolean;
  lodash.isDate = isDate;
  lodash.isElement = isElement;
  lodash.isEmpty = isEmpty;
  lodash.isEqual = isEqual;
  lodash.isFinite = isFinite;
  lodash.isFunction = isFunction;
  lodash.isNaN = isNaN;
  lodash.isNull = isNull;
  lodash.isNumber = isNumber;
  lodash.isObject = isObject;
  lodash.isRegExp = isRegExp;
  lodash.isString = isString;
  lodash.isUndefined = isUndefined;
  lodash.keys = keys;
  lodash.last = last;
  lodash.lastIndexOf = lastIndexOf;
  lodash.map = map;
  lodash.max = max;
  lodash.memoize = memoize;
  lodash.merge = merge;
  lodash.min = min;
  lodash.mixin = mixin;
  lodash.noConflict = noConflict;
  lodash.once = once;
  lodash.partial = partial;
  lodash.pick = pick;
  lodash.pluck = pluck;
  lodash.range = range;
  lodash.reduce = reduce;
  lodash.reduceRight = reduceRight;
  lodash.reject = reject;
  lodash.rest = rest;
  lodash.result = result;
  lodash.shuffle = shuffle;
  lodash.size = size;
  lodash.some = some;
  lodash.sortBy = sortBy;
  lodash.sortedIndex = sortedIndex;
  lodash.tap = tap;
  lodash.template = template;
  lodash.throttle = throttle;
  lodash.times = times;
  lodash.toArray = toArray;
  lodash.union = union;
  lodash.uniq = uniq;
  lodash.uniqueId = uniqueId;
  lodash.values = values;
  lodash.where = where;
  lodash.without = without;
  lodash.wrap = wrap;
  lodash.zip = zip;
  lodash.zipObject = zipObject;

  // assign aliases
  lodash.all = every;
  lodash.any = some;
  lodash.collect = map;
  lodash.detect = find;
  lodash.each = forEach;
  lodash.foldl = reduce;
  lodash.foldr = reduceRight;
  lodash.head = first;
  lodash.include = contains;
  lodash.inject = reduce;
  lodash.methods = functions;
  lodash.select = filter;
  lodash.tail = rest;
  lodash.take = first;
  lodash.unique = uniq;

  // add pseudo private properties used and removed during the build process
  lodash._iteratorTemplate = iteratorTemplate;
  lodash._shimKeys = shimKeys;

  /*--------------------------------------------------------------------------*/

  // assign private `LoDash` constructor's prototype
  LoDash.prototype = lodash.prototype;

  // add all static functions to `LoDash.prototype`
  mixin(lodash);

  // add `LoDash.prototype.chain` after calling `mixin()` to avoid overwriting
  // it with the wrapped `lodash.chain`
  LoDash.prototype.chain = wrapperChain;
  LoDash.prototype.value = wrapperValue;

  // add all mutator Array functions to the wrapper.
  forEach(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
    var func = ArrayProto[methodName];

    LoDash.prototype[methodName] = function() {
      var value = this._wrapped;
      func.apply(value, arguments);

      // Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array
      // `shift()` and `splice()` functions that fail to remove the last element,
      // `value[0]`, of array-like objects even though the `length` property is
      // set to `0`. The `shift()` method is buggy in IE 8 compatibility mode,
      // while `splice()` is buggy regardless of mode in IE < 9 and buggy in
      // compatibility mode in IE 9.
      if (value.length === 0) {
        delete value[0];
      }
      if (this._chain) {
        value = new LoDash(value);
        value._chain = true;
      }
      return value;
    };
  });

  // add all accessor Array functions to the wrapper.
  forEach(['concat', 'join', 'slice'], function(methodName) {
    var func = ArrayProto[methodName];

    LoDash.prototype[methodName] = function() {
      var value = this._wrapped,
          result = func.apply(value, arguments);

      if (this._chain) {
        result = new LoDash(result);
        result._chain = true;
      }
      return result;
    };
  });

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
  if (typeof zeega.define === 'function' && typeof zeega.define.amd === 'object' && zeega.define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash was injected by a third-party script and not intended to be
    // loaded as a module. The global assignment can be reverted in the Lo-Dash
    // module via its `noConflict()` method.
    window._ = lodash;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    zeega.define('lodash',[],function() {
      return lodash;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports) {
    // in Node.js or RingoJS v0.8.0+
    if (typeof module == 'object' && module && module.exports == freeExports) {
      (module.exports = lodash)._ = lodash;
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      freeExports._ = lodash;
    }
  }
  else {
    // in a browser or Rhino
    window._ = lodash;
  }
}(this));

//     Backbone.js 0.9.2

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `global`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to slice/splice.
  var slice = Array.prototype.slice;
  var splice = Array.prototype.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.2';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = zeega.require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Set the JavaScript library that will be used for DOM manipulation and
  // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
  // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
  // alternate JavaScript library (or a mock library for testing your views
  // outside of a browser).
  Backbone.setDomLibrary = function(lib) {
    $ = lib;
  };

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // Regular expression used to split event strings
  var eventSplitter = /\s+/;

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback functions
  // to an event; trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) return this;
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      while (event = events.shift()) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
      }

      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) return;
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : _.keys(calls);
      while (event = events.shift()) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) continue;
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        while ((node = node.next) !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        if (node = calls[event]) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        if (node = all) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
      }

      return this;
    }

  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (options && options.parse) attributes = this.parse(attributes);
    if (defaults = getValue(this, 'defaults')) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) this.collection = options.collection;
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this.set(attributes, {silent: true});
    // Reset change tracking.
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // A hash of attributes that have silently changed since the last time
    // `change` was called.  Will become pending attributes on the next call.
    _silent: null,

    // A hash of attributes that have changed since the last `'change'` event
    // began.
    _pending: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.get(attr);
      return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, value, options) {
      var attrs, attr, val;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs instanceof Model) attrs = attrs.attributes;
      if (options.unset) for (attr in attrs) attrs[attr] = void 0;

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      var changes = options.changes = {};
      var now = this.attributes;
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};

      // For each `set` attribute...
      for (attr in attrs) {
        val = attrs[attr];

        // If the new and current value differ, record the change.
        if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
          delete escaped[attr];
          (options.silent ? this._silent : changes)[attr] = true;
        }

        // Update or delete the current value.
        options.unset ? delete now[attr] : now[attr] = val;

        // If the new and previous value differ, record the change.  If not,
        // then remove changes for this attribute.
        if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
          this.changed[attr] = val;
          if (!options.silent) this._pending[attr] = true;
        } else {
          delete this.changed[attr];
          delete this._pending[attr];
        }
      }

      // Fire the `"change"` events.
      if (!options.silent) this.change(options);
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      (options || (options = {})).unset = true;
      return this.set(attr, null, options);
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      (options || (options = {})).unset = true;
      return this.set(_.clone(this.attributes), options);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = Backbone.wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, value, options) {
      var attrs, current;

      // Handle both `("key", value)` and `({key: value})` -style calls.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      options = options ? _.clone(options) : {};

      // If we're "wait"-ing to set changed attributes, validate early.
      if (options.wait) {
        if (!this._validate(attrs, options)) return false;
        current = _.clone(this.attributes);
      }

      // Regular saves `set` attributes before persisting to the server.
      var silentOptions = _.extend({}, options, {silent: true});
      if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, xhr);
        if (options.wait) {
          delete options.wait;
          serverAttrs = _.extend(attrs || {}, serverAttrs);
        }
        if (!model.set(serverAttrs, options)) return false;
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      // Finish configuring and sending the Ajax request.
      options.error = Backbone.wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
      if (options.wait) this.set(current, silentOptions);
      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (this.isNew()) {
        triggerDestroy();
        return false;
      }

      options.success = function(resp) {
        if (options.wait) triggerDestroy();
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      options.error = Backbone.wrapError(options.error, model, options);
      var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
      if (!options.wait) triggerDestroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Call this method to manually fire a `"change"` event for this model and
    // a `"change:attribute"` event for each changed attribute.
    // Calling this will cause all objects observing the model to update.
    change: function(options) {
      options || (options = {});
      var changing = this._changing;
      this._changing = true;

      // Silent changes become pending changes.
      for (var attr in this._silent) this._pending[attr] = true;

      // Silent changes are triggered.
      var changes = _.extend({}, options.changes, this._silent);
      this._silent = {};
      for (var attr in changes) {
        this.trigger('change:' + attr, this, this.get(attr), options);
      }
      if (changing) return this;

      // Continue firing `"change"` events while there are pending changes.
      while (!_.isEmpty(this._pending)) {
        this._pending = {};
        this.trigger('change', this, options);
        // Pending and silent changes still remain.
        for (var attr in this.changed) {
          if (this._pending[attr] || this._silent[attr]) continue;
          delete this.changed[attr];
        }
        this._previousAttributes = _.clone(this.attributes);
      }

      this._changing = false;
      return this;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (!arguments.length) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false, old = this._previousAttributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Check if the model is currently in a valid state. It's only possible to
    // get into an *invalid* state if you're using silent changes.
    isValid: function() {
      return !this.validate(this.attributes);
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. If a specific `error` callback has
    // been passed, call that instead of firing the general `"error"` event.
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) return true;
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, {silent: true, parse: options.parse});
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `add` event for every new model.
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {
        if (!(model = models[i] = this._prepareModel(models[i], options))) {
          throw new Error("Can't add an invalid model to a collection");
        }
        cid = model.cid;
        id = model.id;
        if (cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
          dups.push(i);
          continue;
        }
        cids[cid] = ids[id] = model;
      }

      // Remove duplicates.
      i = dups.length;
      while (i--) {
        models.splice(dups[i], 1);
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0, length = models.length; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = options.at != null ? options.at : this.models.length;
      splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) this.sort({silent: true});
      if (options.silent) return this;
      for (i = 0, length = this.models.length; i < length; i++) {
        if (!cids[(model = this.models[i]).cid]) continue;
        options.index = i;
        model.trigger('add', model, this, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `remove` event for every model removed.
    remove: function(models, options) {
      var i, l, index, model;
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, options);
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Get a model from the set by id.
    get: function(id) {
      if (id == null) return void 0;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of `filter`.
    where: function(attrs) {
      if (_.isEmpty(attrs)) return [];
      return this.filter(function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length == 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      models  || (models = []);
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === undefined) options.parse = true;
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = Backbone.wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!options.wait) coll.add(model, options);
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) coll.add(nextModel, options);
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(model, options) {
      options || (options = {});
      if (!(model instanceof Model)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event == 'add' || event == 'remove') && collection != this) return;
      if (event == 'destroy') {
        this.remove(model, options);
      }
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      Backbone.history || (Backbone.history = new History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(windowOverride) {
      var loc = windowOverride ? windowOverride.location : window.location;
      var match = loc.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
        } else {
          fragment = this.getHash();
        }
      }
      if (!fragment.indexOf(this.options.root)) fragment = fragment.substr(this.options.root.length);
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.getHash(this.iframe));
      if (current == this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment == frag) return;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe && (frag != this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove: function() {
      this.$el.remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = (element instanceof $) ? element : $(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = getValue(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Method "' + events[key] + '" does not exist');
        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = getValue(this, 'attributes') || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Model.extend = Collection.extend = Router.extend = View.extend = extend;

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };

  // Wrap an optional error callback with a fallback error event.
  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
      }
    };
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

}).call(this);

zeega.define("backbone", ["lodash"], (function (global) {
    return function () {
        return global.Backbone;
    }
}(this)));

/*!
 * backbone.layoutmanager.js v0.6.6
 * Copyright 2012, Tim Branyen (@tbranyen)
 * backbone.layoutmanager.js may be freely distributed under the MIT license.
 */
(function(window) {



// Used to keep track of all LayoutManager key names.
var keys;

// Alias the libraries from the global object.
var Backbone = window.Backbone;
var _ = window._;
var $ = window.$;

// Store references to original View functions.
var _configure = Backbone.View.prototype._configure;
var render = Backbone.View.prototype.render;

// A LayoutManager is simply a Backbone.View with some sugar.
var LayoutManager = Backbone.View.extend({
  // This named function allows for significantly easier debugging.
  constructor: function Layout(options) {
    // Options should always a valid object.
    options = options || {};

    // Give this View superpowers.
    LayoutManager.setupView(this, options);

    // Have Backbone set up the rest of this View.
    Backbone.View.call(this, options);
  },

  // Swap the current layout to  new layout.
  swapLayout: function(newLayout) {
    // Set Views to be a hybrid of original and new layout.
    newLayout.views = _.defaults({}, this.views, newLayout.views);

    // Re-use the same layout DOM element.
    newLayout.setElement(this.el);

    // Allow for chainability.
    return newLayout;
  },

  // Shorthand to root.view function with append flag.
  insertView: function(selector, view) {
    // If a selector was passed, forward that onto setView.
    if (view) {
      return this.setView(selector, view, true);
    }

    // Omitting a selector will place the View directly into the parent.
    return this.setView(selector, true);
  },

  // Works like insertView, except allows you to bulk insert via setViews.
  insertViews: function(views) {
    // Ensure each view is wrapped in an array.
    _.each(views, function(view, selector) {
      views[selector] = [].concat(view);
    });

    return this.setViews(views);
  },

  // Will return a single view that matches the filter function.
  getView: function(fn) {
    return this.getViews(fn).first().value();
  },

  // Provide a filter function to get a flattened array of all the subviews.
  // If the filter function is omitted it will return all subviews.
  getViews: function(fn) {
    // Flatten all views.
    var views = _.chain(this.views).map(function(view) {
      return [].concat(view);
    }, this).flatten().value();

    // Return a wrapped function to allow for easier chaining.
    return _.chain(_.filter(views, fn ? fn : _.identity));
  },

  // This takes in a partial name and view instance and assigns them to
  // the internal collection of views.  If a view is not a LayoutManager
  // instance, then mix in the LayoutManager prototype.  This ensures
  // all Views can be used successfully.
  //
  // Must definitely wrap any render method passed in or defaults to a
  // typical render function `return layout(this).render()`.
  setView: function(name, view, append) {
    var partials, options;
    var root = this;

    // If no name was passed, use an empty string and shift all arguments.
    if (!_.isString(name)) {
      append = view;
      view = name;
      name = "";
    }

    // If the parent View's object, doesn't exist... create it.
    this.views = this.views || {};

    // Ensure remove is called when swapping View's.
    if (!append && this.views[name]) {
      // If the views are an array, iterate and remove each individually.
      if (_.isArray(this.views[name])) {
        _.each(this.views[name], function(view) {
          view.remove();
        });
      // Otherwise it's a single view and can safely call remove.
      } else {
        this.views[name].remove();
      }
    }

    // If the View has not been properly set up, throw an Error message
    // indicating that the View needs `manage: true` set.
    if (!view.__manager__) {
      throw new Error("manage property not set.  " +
        "http://tbranyen.github.com/backbone.layoutmanager/#usage/struc" +
        "turing-a-view");
    }

    // Instance overrides take precedence, fallback to prototype options.
    options = view._options();

    // Custom template render function.
    view.render = function(done) {
      var viewDeferred = options.deferred();
      var manager = view.__manager__;

      // Ensure the latest deferred is assigned.
      manager.viewDeferred = viewDeferred;
      
      // Break this callback out so that its not duplicated inside the 
      // following safety try/catch.
      function renderCallback() {
        // List items should not be re-added, unless they have `keep: true`
        // set.
        if ((!append || view.keep) || !manager.hasRendered) {
          options.partial(root.el, name, view.el, append);
        }

        // Ensure events are always correctly bound after rendering.
        view.delegateEvents();

        // If the View has a managed handler, resolve and remove it.
        if (manager.handler) {
          // Resolve the View's render handler deferred.
          manager.handler.resolveWith(view, [view.el]);

          // Remove the handler once it has resolved.
          delete manager.handler;
        }

        // When a view has been resolved, ensure that it is correctly updated
        // and that any done callbacks are triggered.
        viewDeferred.resolveWith(view, [view.el]);

        // Only call the done function if a callback was provided.
        if (_.isFunction(done)) {
          done.call(view, view.el);
        }
      }

      // Remove subViews without the `keep` flag set to `true`.
      view._removeViews();

      // Call the original render method.
      LayoutManager.prototype.render.call(view).then(renderCallback);

      // Return the promise for chainability.
      return viewDeferred.promise();
    };

    // Add reference to the parentView.
    view.__manager__.parent = root;
    // Add reference to the placement selector used.
    view.__manager__.selector = name;

    // Special logic for appending items. List items are represented as an
    // array.
    if (append) {
      // Start with an array if none exists.
      partials = this.views[name] = this.views[name] || [];
      
      if (!_.isArray(this.views[name])) {
        // Ensure this.views[name] is an array.
        partials = this.views[name] = [this.views[name]];
      }

      // Ensure the View is not already added to the list.  If it is, bail out
      // early.
      if (_.indexOf(partials, view) > -1) {
        return view;
      }

      // Add the view to the list of partials.
      partials.push(view);

      // Put the view into `append` mode.
      view.__manager__.append = true;

      return view;
    }

    // Assign to main views object and return for chainability.
    return this.views[name] = view;
  },

  // Allows the setting of multiple views instead of a single view.
  setViews: function(views) {
    // Iterate over all the views and use the View's view method to assign.
    _.each(views, function(view, name) {
      // If the view is an array put all views into insert mode.
      if (_.isArray(view)) {
        return _.each(view, function(view) {
          this.insertView(name, view);
        }, this);
      }

      // Assign each view using the view function.
      this.setView(name, view);
    }, this);

    // Allow for chaining
    return this;
  },

  // By default this should find all nested views and render them into
  // the this.el and call done once all of them have successfully been
  // resolved.
  //
  // This function returns a promise that can be chained to determine
  // once all subviews and main view have been rendered into the view.el.
  render: function(done) {
    var promise;
    var root = this;
    var options = this._options();
    var viewDeferred = options.deferred();
    var manager = this.__manager__;

    // Ensure duplicate renders don't override.
    if (manager.renderDeferred) {
      // Set the most recent done callback.
      manager.callback = done;

      // Return the deferred.
      return manager.renderDeferred;
    }

    // Disable the ability for any new sub-views to be added.
    manager.renderDeferred = viewDeferred;
    
    // Wait until this View has rendered before dealing with nested Views.
    this._render(LayoutManager._viewRender).fetch.then(function() {
      // Create a list of promises to wait on until rendering is done. Since
      // this method will run on all children as well, its sufficient for a
      // full hierarchical. 
      var promises = _.map(root.views, function(view) {
        // Hoist deferred var, used later on...
        var def;

        // Ensure views are rendered in sequence
        function seqRender(views, done) {
          // Once all views have been rendered invoke the sequence render
          // callback.
          if (!views.length) {
            return done();
          }

          // Get each view in order, grab the first one off the stack.
          var view = views.shift();

          // Render the View and once complete call the next view.
          view.render(function() {
            // Invoke the recursive sequence render function with the
            // remaining views.
            seqRender(views, done);
          });
        }

        // If rendering a list out, ensure they happen in a serial order.
        if (_.isArray(view)) {
          // A singular deferred that represents all the items.
          def = options.deferred();

          seqRender(_.clone(view), function() {
            def.resolve();
          });

          return def.promise();
        }

        // Only return the fetch deferred, resolve the main deferred after
        // the element has been attached to it's parent.
        return view.render();
      });

      // Once all subViews have been rendered, resolve this View's deferred.
      options.when(promises).then(function() {
        viewDeferred.resolveWith(root, [root.el]);
      });
    });

    // Return a promise that resolves once all immediate subViews have
    // rendered.
    promise = viewDeferred.then(function() {
      // Only call the done function if a callback was provided.
      if (_.isFunction(done)) {
        done.call(root, root.el);
      }

      if (root.__manager__.handler) {
        root.__manager__.handler.resolveWith(root, [root.el]);

        // Remove the handler, so it's never accidentally referenced.
        delete root.__manager__.handler;
      }

      // If the render was called twice, there is a possibility that the
      // callback style was used twice.  This will ensure the latest callback
      // is also triggered.
      if (_.isFunction(root.__manager__.callback)) {
        root.__manager__.callback.call(root, root.el);

        // Remove the most recent callback.
        delete root.__manager__.callback;
      }

      // Remove the rendered deferred.
      delete root.__manager__.renderDeferred;
    });

    // Proxy the View's properties to this promise for chaining purposes.
    return _.defaults(promise, root);
  },

  // Ensure the cleanup function is called whenever remove is called.
  remove: function() {
    // Force remove itself from it's parent.
    LayoutManager._removeView(this, true);

    // Call the original remove function.
    return this._remove.apply(this, arguments);
  },

  // Merge instance and global options.
  _options: function() {
    // Instance overrides take precedence, fallback to prototype options.
    return _.extend({}, this, LayoutManager.prototype.options, this.options);
  }
},
{
  // Clearable cache.
  _cache: {},

  // Creates a deferred and returns a function to call when finished.
  _makeAsync: function(options, done) {
    var handler = options.deferred();

    // Used to handle asynchronous renders.
    handler.async = function() {
      handler._isAsync = true;

      return done;
    };

    return handler;
  },

  // This gets passed to all _render methods.
  _viewRender: function(root) {
    var url, contents, handler;
    var options = root._options();

    // Once the template is successfully fetched, use its contents to
    // proceed.  Context argument is first, since it is bound for
    // partial application reasons.
    function done(context, contents) {
      // Ensure the cache is up-to-date.
      LayoutManager.cache(url, contents);

      // Render the View into the el property.
      if (contents) {
        options.html(root.el, options.render(contents, context));
      }

      // Resolve only the fetch (used internally) deferred with the View
      // element.
      handler.fetch.resolveWith(root, [root.el]);
    }

    return {
      // This render function is what gets called inside of the View render,
      // when manage(this).render is called.  Returns a promise that can be
      // used to know when the element has been rendered into its parent.
      render: function(context) {
        var manager = root.__manager__;
        var template = root.template || options.template;

        if (root.serialize) {
          options.serialize = root.serialize;
        }

        // Seek out serialize method and use that object.
        if (!context && _.isFunction(options.serialize)) {
          context = options.serialize.call(root);
        // If serialize is an object, just use that.
        } else if (!context && _.isObject(options.serialize)) {
          context = options.serialize;
        }

        // Create an asynchronous handler.
        handler = LayoutManager._makeAsync(options, _.bind(done, root,
          context));

        // Make a new deferred purely for the fetch function.
        handler.fetch = options.deferred();

        // Assign the handler internally to be resolved once its inside the
        // parent element.
        manager.handler = handler;

        // Set the url to the prefix + the view's template property.
        if (_.isString(template)) {
          url = manager.prefix + template;
        }

        // Check if contents are already cached.
        if (contents = LayoutManager.cache(url)) {
          done(context, contents, url);

          return handler;
        }

        // Fetch layout and template contents.
        if (_.isString(template)) {
          contents = options.fetch.call(handler, manager.prefix + template);
        // If its not a string just pass the object/function/whatever.
        } else if (template != null) {
          contents = options.fetch.call(handler, template);
        }

        // If the function was synchronous, continue execution.
        if (!handler._isAsync) {
          done(context, contents);
        }

        return handler;
      }
    };
  },

  // Accept either a single view or an array of views to clean of all DOM
  // events internal model and collection references and all Backbone.Events.
  cleanViews: function(views) {
    // Clear out all existing views.
    _.each([].concat(views), function(view) {
      // Remove all custom events attached to this View.
      view.unbind();

      // Ensure all nested views are cleaned as well.
      if (view.views) {
        _.each(view.views, function(view) {
          LayoutManager.cleanViews(view);
        });
      }

      // If a custom cleanup method was provided on the view, call it after
      // the initial cleanup is done
      if (_.isFunction(view.cleanup)) {
        view.cleanup.call(view);
      }
    });
  },

  // Cache templates into LayoutManager._cache.
  cache: function(path, contents) {
    // If template path is found in the cache, return the contents.
    if (path in this._cache) {
      return this._cache[path];
    // Ensure path and contents aren't undefined.
    } else if (path != null && contents != null) {
      return this._cache[path] = contents;
    }

    // If the template is not in the cache, return undefined.
  },

  // This static method allows for global configuration of LayoutManager.
  configure: function(opts) {
    _.extend(LayoutManager.prototype.options, opts);

    // Allow LayoutManager to manage Backbone.View.prototype.
    if (opts.manage) {
      Backbone.View.prototype.manage = true;
    }
  },

  // Configure a View to work with the LayoutManager plugin.
  setupView: function(view, options) {
    var views, viewOptions;
    var proto = Backbone.LayoutManager.prototype;
    var viewOverrides = _.pick(view, keys);

    // If the View has already been setup, no need to do it again.
    if (view.__manager__) {
      return;
    }

    // Ensure necessary properties are set.
    _.defaults(view, {
      // Ensure a view always has a views object.
      views: {},

      // Internal state object used to store whether or not a View has been
      // taken over by layout manager and if it has been rendered into the DOM.
      __manager__: {},

      // Add options into the prototype.
      _options: LayoutManager.prototype._options,

      // Add the ability to remove all Views.
      _removeViews: LayoutManager._removeViews,

      // Add the ability to remove itself.
      _removeView: LayoutManager._removeView
    });

    // Set the prefix for a layout.
    if (view instanceof Backbone.Layout) {
      view.__manager__.prefix = view._options().paths.layout || "";
    // Set the prefix for a template.
    } else {
      view.__manager__.prefix = view._options().paths.template || "";
    }

    // Extend the options with the prototype and passed options.
    options = view.options = _.defaults(options || {}, view.options,
      proto.options);

    // Ensure view events are properly copied over.
    viewOptions = _.pick(options, ["events"].concat(_.values(options.events)));
    _.extend(view, viewOptions);

    // If the View still has the Backbone.View#render method, remove it.  Don't
    // want it accidentally overriding the LM render.
    delete viewOverrides.render;

    // Pick out the specific properties that can be dynamically added at
    // runtime and ensure they are available on the view object.
    _.extend(options, viewOverrides);

    // By default the original Remove function is the Backbone.View one.
    view._remove = Backbone.View.prototype.remove;

    // Always use this render function when using LayoutManager.
    view._render = function(manage) {
      var renderDeferred;
      // Cache these properties.
      var beforeRender = this._options().beforeRender;
      var afterRender = this._options().afterRender;

      // Ensure all subViews are properly scrubbed.
      this._removeViews();

      // If a beforeRender function is defined, call it.
      if (_.isFunction(beforeRender)) {
        beforeRender.call(this, this);
      }

      // Always emit a beforeRender event.
      this.trigger("beforeRender", this);

      // Render!
      renderDeferred = manage(this).render();

      // Once rendering is complete...
      renderDeferred.then(function() {
        // Keep the view consistent between callbacks and deferreds.
        var view = this;
        // Shorthand the manager.
        var manager = view.__manager__;
        // Shorthand the View's parent.
        var parent = manager.parent;
        // This can be called immediately if the conditions allow, or it will
        // be deferred until a parent has finished rendering.
        var done = function() {
          // Ensure events are always correctly bound after rendering.
          view.delegateEvents();

          // Set the view hasRendered.
          view.__manager__.hasRendered = true;

          // If an afterRender function is defined, call it.
          if (_.isFunction(afterRender)) {
            afterRender.call(view, view);
          }

          // Always emit an afterRender event.
          view.trigger("afterRender", view);
        };
        // This function recursively loops through Views to find
        // the most top level parent.
        var findRootParent = function(view) {
          var manager = view.__manager__;

          // If a parent exists and the parent has not rendered, return that
          // parent.
          if (manager.parent && !manager.parent.__manager__.hasRendered) {
            return manager.parent;
          }

          // This is the most root parent.
          return view;
        };

        // If no parent exists, immediately call the done callback.
        if (!parent) {
          return done.call(view);
        }

        // If this view has already rendered, simply call the callback.
        if (parent.__manager__.hasRendered) {
          return options.when([manager.viewDeferred,
            parent.__manager__.viewDeferred]).then(function() {
            done.call(view);
          });
        }

        // Find the parent highest in the chain that has not yet rendered.
        parent = findRootParent(view);

        // Once the parent has finished rendering, trickle down and
        // call sub-view afterRenders.
        parent.on("afterRender", function() {
          // Ensure its properly unbound immediately.
          parent.off(null, null, view);

          // Call the done callback.
          done.call(view);
        }, view);
      });
      return renderDeferred;
    };

    // Ensure the render is always set correctly.
    view.render = LayoutManager.prototype.render;

    // If the user provided their own remove override, use that instead of the
    // default.
    if (view.remove !== proto.remove) {
      view._remove = view.remove;
      view.remove = proto.remove;
    }
    
    // Normalize views to exist on either instance or options, default to
    // options.
    views = options.views || view.views;

    // Set the internal views, only if selectors have been provided.
    if (_.keys(views).length) {
      view.setViews(views);
    }

    // Ensure the template is mapped over.
    if (view.template) {
      options.template = view.template;

      // Remove it from the instance.
      delete view.template;
    }
  },

  // Remove all subViews.
  _removeViews: function(root) {
    // Allow removeView to be called on instances.
    root = root || this;

    // Iterate over all of the view's subViews.
    root.getViews().each(function(view) {
      LayoutManager._removeView(view, true);
    });
  },

  // Remove a single subView.
  _removeView: function(view, force) {
    // Shorthand the manager for easier access.
    var manager = view.__manager__;
    // Test for keep.
    var keep = _.isBoolean(view.keep) ? view.keep : view.options.keep;
    // Only allow force if View contains a parent.
    force = force && manager.parent;

    // Ensure that cleanup is called correctly when `_removeView` is triggered.
    LayoutManager.cleanViews(view);

    // Only remove views that do not have `keep` attribute set, unless the
    // force flag is set.
    if (!keep && (manager.append === true || force) && manager.hasRendered) {
      // Remove the View completely.
      view.$el.remove();

      // If this is an array of items remove items that are not marked to
      // keep.
      if (_.isArray(manager.parent.views[manager.selector])) {
        // Remove directly from the Array reference.
        return manager.parent.getView(function(view, i) {
          // If the managers match, splice off this View.
          if (view.__manager__ === manager) {
            manager.parent.views[manager.selector].splice(i, 1);
          }
        });
      }

      // Otherwise delete the parent selector.
      delete manager.parent.views[manager.selector];
    }
  }
});

// Ensure all Views always have access to get/set/insert(View/Views).
_.each(["get", "set", "insert"], function(method) {
  var backboneProto = Backbone.View.prototype;
  var layoutProto = LayoutManager.prototype;

  // Attach the singular form.
  backboneProto[method + "View"] = layoutProto[method + "View"];

  // Attach the plural form.
  backboneProto[method + "Views"] = layoutProto[method + "Views"];
});

// Convenience assignment to make creating Layout's slightly shorter.
Backbone.Layout = Backbone.LayoutManager = LayoutManager;
// A LayoutView is just a Backbone.View with manage set to true.
Backbone.LayoutView = Backbone.View.extend({
  manage: true
});

// Override _configure to provide extra functionality that is necessary in
// order for the render function reference to be bound during initialize.
Backbone.View.prototype._configure = function() {
  // Run the original _configure.
  var retVal = _configure.apply(this, arguments);

  // If manage is set, do it!
  if (this.manage) {
    // Set up this View.
    LayoutManager.setupView(this);
  }

  // Act like nothing happened.
  return retVal;
};

// Default configuration options; designed to be overriden.
LayoutManager.prototype.options = {
  // Layout and template properties can be assigned here to prefix
  // template/layout names.
  paths: {},

  // Can be used to supply a different deferred implementation.
  deferred: function() {
    return $.Deferred();
  },

  // Fetch is passed a path and is expected to return template contents as a
  // function or string.
  fetch: function(path) {
    return _.template($(path).html());
  },

  // This is really the only way you will want to partially apply a view into
  // a layout.  Its entirely possible you'll want to do it differently, so
  // this method is available to change.
  partial: function(root, name, el, append) {
    // If no selector is specified, assume the parent should be added to.
    var $root = name ? $(root).find(name) : $(root);

    // If no root found, return false.
    if (!$root.length) {
      return false;
    }

    // Use the append method if append argument is true.
    this[append ? "append" : "html"]($root, el);

    // If successfully added, return true.
    return true;
  },

  // Override this with a custom HTML method, passed a root element and an
  // element to replace the innerHTML with.
  html: function(root, el) {
    $(root).html(el);
  },

  // Very similar to HTML except this one will appendChild.
  append: function(root, el) {
    $(root).append(el);
  },

  // Return a deferred for when all promises resolve/reject.
  when: function(promises) {
    return $.when.apply(null, promises);
  },

  // By default, render using underscore's templating.
  render: function(template, context) {
    return template(context);
  }
};

// Maintain a list of the keys at define time.
keys = _.keys(LayoutManager.prototype.options);

})(this);
zeega.define("plugins/backbone.layoutmanager", function(){});

zeega.define('zeega',[
	'backbone',
	"plugins/backbone.layoutmanager"
],

function(Backbone) {
	// Provide a global location to place configuration settings and module
	// creation.
	var app = {
		// The root path to run the application.
		root: "/"
	};

	// Localize or create a new JavaScript Template object.
	var JST = window.JST = window.JST || {};

	var zeegaBackbone = Backbone.noConflict();
	
	// Mix Backbone.Events, modules, and layout management into the app object.
	return _.extend(app, {
		// Create a custom object with a nested Views object.
		module: function(additionalProps) {
			return _.extend({ Views: {} }, additionalProps);
		},

		Backbone : zeegaBackbone

	}, zeegaBackbone.Events);

});

zeega.define('zeega_dir/plugins/layers/_layer/_layer',[
	"zeega"
],

function(Zeega){

	_Layer = Zeega.Backbone.Model.extend({
		
		layerType : null,

		controls : [],

		defaults : {
			citataion: true,
			default_controls : true,
			draggable : true,
			has_controls : true,
			linkable : true,
			mode : 'player',
			resizable : false,
			showCitation : true
		},
		defaultAttributes : {},

		initialize : function()
		{
			this.init();
		},

		init : function(){},

		player_onPreload : function(){},
		player_onPlay : function(){},
		player_onPause : function(){},
		player_onExit : function(){},
		player_onUnrender : function(){},
		player_onRenderError : function(){},

		editor_onLayerEnter : function(){},
		editor_onLayerExit : function(){},
		editor_onControlsOpen : function(){},
		editor_onControlsClosed : function(){}

	});

	_Layer.Visual = Zeega.Backbone.LayoutView.extend({
		
		fetch: function(path) {
			// Initialize done for use in async-mode
			var done;
			// Concatenate the file extension.
			path = 'app/templates/'+ path + ".html";
			// If cached, use the compiled template.
			if (JST[path]) {
				return JST[path];
			} else {
				// Put fetch into `async-mode`.
				done = this.async();
				// Seek out the template asynchronously.
				return $.ajax({ url: Zeega.root + path }).then(function(contents) {
					done(JST[path] = _.template(contents));
				});
			}
		},

		className : 'visual-element',
		template : '',

		serialize : function(){ return this.model.toJSON(); },

		initialize : function()
		{
			this.init();
		},

		beforePlayerRender : function(){},
		beforeRender : function()
		{
			this.className = this._className +' '+ this.className;
			this.beforePlayerRender();

			if(this.model.get('target_div') !== '' && !_.isNull(this.model.get('target_div')) )
			{
				$('#'+ this.model.get('target_div') +' .ZEEGA-player-window').append( this.el );
			}
			else
			{
				$('.ZEEGA-player-window').append( this.el );
			}
			this.$el.addClass('visual-element-'+ this.model.get('type').toLowerCase() );
			this.moveOffStage();
			this.applySize();
		},

		afterRender : function()
		{
			this.verifyReady();
		},

		applySize : function()
		{
			this.$el.css({
				//height : this.getAttr('height') +'%', // photos need a height!
				width : this.getAttr('width') +'%'
			});
		},

		init : function(){},
		render : function(){},

		// default verify fxn. return ready immediately
		verifyReady : function(){ this.model.trigger('visual_ready',this.model.id); },

		player_onPreload : function()
		{
			this.render();
		},
		player_onPlay : function()
		{
			this.onPlay();
		},
		player_onPause : function()
		{
			this.onPause();
		},
		player_onExit : function()
		{
			this.pause();
			this.moveOffStage();
			this.onExit();
		},
		player_onUnrender : function(){},
		player_onRenderError : function(){},

		onPreload : function()
		{

		},

		onPlay : function()
		{

		},

		onPause : function()
		{

		},

		onExit : function()
		{

		},

		updateZIndex : function( z )
		{
			this.$el.css('z-index', z);
		},


		editor_onLayerEnter : function(){},
		editor_onLayerExit : function(){},
		editor_onControlsOpen : function(){},
		editor_onControlsClosed : function(){},

		moveOffStage : function()
		{
			this.$el.css({
				top: '-1000%',
				left: '-1000%'
			});
		},

		moveOnStage : function()
		{
			this.$el.css({
				top: this.getAttr('top') +'%',
				left: this.getAttr('left') +'%'
			});
		},

		play : function()
		{
			this.isPlaying = true;
			this.moveOnStage();
			this.player_onPlay();
		},

		pause : function()
		{
			this.isPlaying = false;
			this.player_onPause();
		},

		playPause : function()
		{
			if( this.isPlaying !== false )
			{
				this.isPlaying = false;
				this.player_onPause();
			}
			else
			{
				this.isPlaying = true;
				this.player_onPlay();
			}
		},

		getAttr : function(key){ return this.model.get('attr')[key]; } // convenience method


	});

	return _Layer;

});

(function(c,n){var k="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";c.fn.imagesLoaded=function(l){function m(){var b=c(h),a=c(g);d&&(g.length?d.reject(e,b,a):d.resolve(e));c.isFunction(l)&&l.call(f,e,b,a)}function i(b,a){b.src===k||-1!==c.inArray(b,j)||(j.push(b),a?g.push(b):h.push(b),c.data(b,"imagesLoaded",{isBroken:a,src:b.src}),o&&d.notifyWith(c(b),[a,e,c(h),c(g)]),e.length===j.length&&(setTimeout(m),e.unbind(".imagesLoaded")))}var f=this,d=c.isFunction(c.Deferred)?c.Deferred():
0,o=c.isFunction(d.notify),e=f.find("img").add(f.filter("img")),j=[],h=[],g=[];e.length?e.bind("load.imagesLoaded error.imagesLoaded",function(b){i(b.target,"error"===b.type)}).each(function(b,a){var e=a.src,d=c.data(a,"imagesLoaded");if(d&&d.src===e)i(a,d.isBroken);else if(a.complete&&a.naturalWidth!==n)i(a,0===a.naturalWidth||0===a.naturalHeight);else if(a.readyState||a.complete)a.src=k,a.src=e}):m();return d?d.promise(f):f}})(jQuery);

zeega.define("plugins/jquery.imagesloaded.min", function(){});

zeega.define('zeega_dir/plugins/layers/image/image',[
	"zeega",
	'zeega_dir/plugins/layers/_layer/_layer',

	//plugins
	'plugins/jquery.imagesloaded.min'
],

function(Zeega, _Layer){

	var Layer = Zeega.module();

	Layer.Image = _Layer.extend({
			
		layerType : 'Image',

		defaultAttributes : {
			'title' : 'Image Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33
		},

		controls : [
			
			{
				type : 'checkbox',
				property : 'dissolve',
				label : 'Fade In'
			},
			{
				type : 'slider',
				property : 'width',
				label : 'Scale',
				suffix : '%',
				min : 1,
				max : 200
			},
			{
				type : 'slider',
				property : 'opacity',
				label : 'Scale',
				step : 0.01,
				min : 0.05,
				max : 1
			}

		]

	});

	Layer.Image.Visual = _Layer.Visual.extend({
		
		template : 'plugins/image',

		serialize : function(){ return this.model.toJSON(); },
		
		verifyReady : function()
		{
			var _this = this;
			var img = this.$el.imagesLoaded();
			img.done(function(){ _this.model.trigger('visual_ready',_this.model.id); });
			img.fail(function(){ _this.model.trigger('visual_error',_this.model.id); });
		}
		
	});

	return Layer;

});

zeega.define('zeega_dir/plugins/layers/link/link',[
	"zeega",
	'zeega_dir/plugins/layers/_layer/_layer'
],

function(Zeega, _Layer){

	var Layer = Zeega.module();

	Layer.Link = _Layer.extend({

		layerType : 'Link',

		defaultAttributes : {
			'title' : 'Link Layer',
			'from_sequence' : null,
			'to_frame' : null,
			'from_frame' : null,
			'left' : 25,
			'top' : 25,
			'height' : 50,
			'width' : 50,
			'opacity' : 1,
			'opacity_hover' : 1,
			'blink_on_start' : true,
			'glow_on_hover' : true,

			'citation':false,
			'linkable' : false,
			'default_controls' : false
		}
		
	});
	
	Layer.Link.Visual = _Layer.Visual.extend({
		
		template : 'plugins/link',

		serialize : function(){ return this.model.toJSON(); },
		
		beforePlayerRender : function()
		{
			var _this = this;
			var style = {
				'overflow' : 'visible',
				'z-index' : 100,
				'border' : 'none',
				'border-radius' : '0',
				'height' : this.getAttr('height') +'%',
				
				background: 'red',
				opacity: 0.1
			};
/*
			this.$el.removeClass('link-arrow-right link-arrow-down link-arrow-up link-arrow-left');

			if( this.preview ) this.delegateEvents({'click':'goClick'});

			if(this.model.get('attr').link_type == 'arrow_left')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-left');
			else if(this.model.get('attr').link_type == 'arrow_right')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-right');
			else if(this.model.get('attr').link_type == 'arrow_up')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-up');

			if( this.model.get('attr').glow_on_hover ) this.$el.addClass('linked-layer-glow');

			if( this.getAttr('mode') == 'editor' )
			{
				_.extend( style, {
					'border' : '2px dashed orangered',
					'border-radius' : '6px'
				});
			}
*/
			this.$el.css(style);
		},
		
		events : {
			'click a' : 'goClick',
			'mouseover' : 'onMouseOver',
			'mouseout' : 'onMouseOut'
		},

		onMouseOver : function()
		{
			//console.log('link on mouseover');
			//this.$el.stop().fadeTo( 500, this.model.get('attr').opacity_hover );
		},

		onMouseOut : function()
		{
			//console.log('link on mouseover');
			//this.$el.stop().fadeTo( 500, this.model.get('attr').opacity );
		},
		
		goClick : function()
		{
			this.model.trigger('cue_frame', this.getAttr('to_frame') );
			return false;
		}
		
		/*
		player_onPlay : function()
		{
			this.render();
			this.delegateEvents({
				'click':'goClick',
				'mouseover' : 'onMouseOver',
				'mouseout' : 'onMouseOut'
			});
			var _this = this;
			this.$el.animate({opacity:1},1000,function(){
				_this.$el.animate({opacity:0},1000);
			});
		}
		*/
		
		
	});
	
	return Layer;

});
zeega.define('zeega_dir/plugins/layers/slideshow/slideshow',[
	"zeega",
	'zeega_dir/plugins/layers/_layer/_layer'
],

function(Zeega, _Layer){

	var Layer = Zeega.module();

	Layer.SlideShow = _Layer.extend({
			
		layerType : 'SlideShow',

		defaultAttributes : {
			'arrows' : true, // turns on/off visual arrow controls
			'keyboard' : false, // turns on/off keyboard controls

			'title' : 'Slideshow Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33
		}

	});

	Layer.SlideShow.Visual = _Layer.Visual.extend({
		
		template : 'plugins/slideshow',

		slide : 0,

		init : function()
		{
			this.slideCount = this.model.get('attr').slides.length;
		},

		serialize : function(){ return this.model.toJSON(); },

		onPlay : function()
		{
			this.$el.css({'height': '100%'});
			this.hideArrows();
			this.initKeyboard();
			this.emitSlideData( this.slide );
		},

		onExit : function()
		{
			this.killKeyboard();
		},

		events : {
			'click  .slideshow-left-arrow' : 'goLeft', 
			'click  .slideshow-right-arrow' : 'goRight'
		},

		goLeft : function()
		{
			if(this.slide > 0 )
			{
				this.slide--;
				this.scrollTo(this.slide);
				this.hideArrows();
			}
			return false;
		},

		goRight : function()
		{
			if(this.slide < this.slideCount -1 )
			{
				this.slide++;
				this.scrollTo(this.slide);
				this.hideArrows();
			}
			return false;
		},

		scrollTo : function( slideNo )
		{
			this.$el.animate({left: (slideNo * -100)+'%'});
			this.emitSlideData(slideNo);
		},

		emitSlideData : function(slideNo)
		{
			this.model.trigger('slideshow_update',this.getAttr('slides')[slideNo] );
		},

		hideArrows : function()
		{
			if( this.slideCount <= 1 )						this.$('.slideshow-arrow').remove();
			else if( this.slide === 0 )						this.$('.slideshow-left-arrow').addClass('disabled');
			else if( this.slide == this.slideCount - 1 )	this.$('.slideshow-right-arrow').addClass('disabled');
			else											this.$('.slideshow-left-arrow, .slideshow-right-arrow').removeClass('disabled');
		},

		initKeyboard : function()
		{
			if( this.getAttr('keyboard') )
			{
				var _this = this;
				$(window).bind('keyup.slideshow', function(e){
					switch( e.which )
					{
						case 37: // left arrow
							_this.goLeft();
							break;
						case 39: // right arrow
							_this.goRight();
							break;
					}
				});
			}
		},

		killKeyboard : function()
		{
			if( this.getAttr('keyboard') ) $(window).unbind('keyup.slideshow');
		}
		
	});

	return Layer;

});

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-teststyles-hasevent-prefixes-domprefixes
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.6.2',

    Modernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  = document.createElement('input')  ,

    smile = ':)',

    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),

    ns = {'svg': 'http://www.w3.org/2000/svg'},

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },

    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq).matches;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
 

    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

            var isSupported = eventName in element;

        if ( !isSupported ) {
                if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

                    if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),


    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };



    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };


    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };



    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };


    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };



    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

            try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                            bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                                                    bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };


    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    function webforms() {
                                            Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
                                  attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
                            Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                                                    if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                                        bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                                                                                  (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                                                                                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                                        bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        }
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    Modernizr.input || webforms();


     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
                                              return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; 
     };


    setCss('');
    modElem = inputElem = null;

    ;(function(window, document) {
        var options = window.html5 || {};

        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        var supportsHtml5Styles;

        var expando = '_html5shiv';

        var expanID = 0;

        var expandoData = {};

        var supportsUnknownElements;

      (function() {
        try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
                    supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
                        (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
        } catch(e) {
          supportsHtml5Styles = true;
          supportsUnknownElements = true;
        }

      }());        function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement('p'),
            parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

        p.innerHTML = 'x<style>' + cssText + '</style>';
        return parent.insertBefore(p.lastChild, parent.firstChild);
      }

        function getElements() {
        var elements = html5.elements;
        return typeof elements == 'string' ? elements.split(' ') : elements;
      }

          function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
        }
        return data;
      }

        function createElement(nodeName, ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
        }
        if (!data) {
            data = getExpandoData(ownerDocument);
        }
        var node;

        if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
        } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
        } else {
            node = data.createElem(nodeName);
        }

                                    return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
      }

        function createDocumentFragment(ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
        }
        data = data || getExpandoData(ownerDocument);
        var clone = data.frag.cloneNode(),
            i = 0,
            elems = getElements(),
            l = elems.length;
        for(;i<l;i++){
            clone.createElement(elems[i]);
        }
        return clone;
      }

        function shivMethods(ownerDocument, data) {
        if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
        }


        ownerDocument.createElement = function(nodeName) {
                if (!html5.shivMethods) {
              return data.createElem(nodeName);
          }
          return createElement(nodeName, ownerDocument, data);
        };

        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
          'var n=f.cloneNode(),c=n.createElement;' +
          'h.shivMethods&&(' +
                    getElements().join().replace(/\w+/g, function(nodeName) {
              data.createElem(nodeName);
              data.frag.createElement(nodeName);
              return 'c("' + nodeName + '")';
            }) +
          ');return n}'
        )(html5, data.frag);
      }        function shivDocument(ownerDocument) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        var data = getExpandoData(ownerDocument);

        if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
          data.hasCSS = !!addStyleSheet(ownerDocument,
                    'article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
                    'mark{background:#FF0;color:#000}'
          );
        }
        if (!supportsUnknownElements) {
          shivMethods(ownerDocument, data);
        }
        return ownerDocument;
      }        var html5 = {

            'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',

            'shivCSS': (options.shivCSS !== false),

            'supportsUnknownElements': supportsUnknownElements,

            'shivMethods': (options.shivMethods !== false),

            'type': 'default',

            'shivDocument': shivDocument,

            createElement: createElement,

            createDocumentFragment: createDocumentFragment
      };        window.html5 = html5;

        shivDocument(document);

    }(this, document));

    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;

    Modernizr.mq            = testMediaQuery;

    Modernizr.hasEvent      = isEventSupported;    Modernizr.testStyles    = injectElementWithStyles;
    return Modernizr;

})(this, this.document);
;
zeega.define("libs/modernizr", function(){});

/*
 * popcorn.js version 1.1.2
 * http://popcornjs.org
 *
 * Copyright 2011, Mozilla Foundation
 * Licensed under the MIT license
 */

(function(global, document) {

  // Popcorn.js does not support archaic browsers
  if ( !document.addEventListener ) {
    global.Popcorn = {
      isSupported: false
    };

    var methods = ( "forEach extend effects error guid sizeOf isArray nop position disable enable destroy " +
          "addTrackEvent removeTrackEvent getTrackEvents getTrackEvent getLastTrackEventId " +
          "timeUpdate plugin removePlugin compose effect parser xhr getJSONP getScript" ).split(/\s+/);

    while ( methods.length ) {
      global.Popcorn[ methods.shift() ] = function() {};
    }
    return;
  }

  var

  AP = Array.prototype,
  OP = Object.prototype,

  forEach = AP.forEach,
  slice = AP.slice,
  hasOwn = OP.hasOwnProperty,
  toString = OP.toString,

  // Copy global Popcorn (may not exist)
  _Popcorn = global.Popcorn,

  //  ID string matching
  rIdExp  = /^(#([\w\-\_\.]+))$/,

  //  Ready fn cache
  readyStack = [],
  readyBound = false,
  readyFired = false,

  //  Non-public internal data object
  internal = {
    events: {
      hash: {},
      apis: {}
    }
  },

  //  Non-public `requestAnimFrame`
  //  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimFrame = (function(){
    return global.requestAnimationFrame ||
      global.webkitRequestAnimationFrame ||
      global.mozRequestAnimationFrame ||
      global.oRequestAnimationFrame ||
      global.msRequestAnimationFrame ||
      function( callback, element ) {
        global.setTimeout( callback, 16 );
      };
  }()),

  refresh = function( obj ) {
    var currentTime = obj.media.currentTime,
      animation = obj.options.frameAnimation,
      disabled = obj.data.disabled,
      tracks = obj.data.trackEvents,
      animating = tracks.animating,
      start = tracks.startIndex,
      registryByName = Popcorn.registryByName,
      animIndex = 0,
      byStart, natives, type;

    start = Math.min( start + 1, tracks.byStart.length - 2 );

    while ( start > 0 && tracks.byStart[ start ] ) {

      byStart = tracks.byStart[ start ];
      natives = byStart._natives;
      type = natives && natives.type;

      if ( !natives ||
          ( !!registryByName[ type ] || !!obj[ type ] ) ) {

        if ( ( byStart.start <= currentTime && byStart.end > currentTime ) &&
                disabled.indexOf( type ) === -1 ) {

          if ( !byStart._running ) {
            byStart._running = true;
            natives.start.call( obj, null, byStart );

            // if the 'frameAnimation' option is used,
            // push the current byStart object into the `animating` cue
            if ( animation &&
                ( byStart && byStart._running && byStart.natives.frame ) ) {

              natives.frame.call( obj, null, byStart, currentTime );
            }
          }
        } else if ( byStart._running === true ) {

          byStart._running = false;
          natives.end.call( obj, null, byStart );

          if ( animation && byStart._natives.frame ) {
            animIndex = animating.indexOf( byStart );
            if ( animIndex >= 0 ) {
              animating.splice( animIndex, 1 );
            }
          }
        }
      }

      start--;
    }
  },

  //  Declare constructor
  //  Returns an instance object.
  Popcorn = function( entity, options ) {
    //  Return new Popcorn object
    return new Popcorn.p.init( entity, options || null );
  };

  //  Popcorn API version, automatically inserted via build system.
  Popcorn.version = "1.1.2";

  //  Boolean flag allowing a client to determine if Popcorn can be supported
  Popcorn.isSupported = true;

  //  Instance caching
  Popcorn.instances = [];

  //  Declare a shortcut (Popcorn.p) to and a definition of
  //  the new prototype for our Popcorn constructor
  Popcorn.p = Popcorn.prototype = {

    init: function( entity, options ) {

      var matches;

      //  Supports Popcorn(function () { /../ })
      //  Originally proposed by Daniel Brooks

      if ( typeof entity === "function" ) {

        //  If document ready has already fired
        if ( document.readyState === "interactive" || document.readyState === "complete" ) {

          entity( document, Popcorn );

          return;
        }
        //  Add `entity` fn to ready stack
        readyStack.push( entity );

        //  This process should happen once per page load
        if ( !readyBound ) {

          //  set readyBound flag
          readyBound = true;

          var DOMContentLoaded  = function() {

            readyFired = true;

            //  Remove global DOM ready listener
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );

            //  Execute all ready function in the stack
            for ( var i = 0, readyStackLength = readyStack.length; i < readyStackLength; i++ ) {

              readyStack[ i ].call( document, Popcorn );

            }
            //  GC readyStack
            readyStack = null;
          };

          //  Register global DOM ready listener
          document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
        }

        return;
      }

      //  Check if entity is a valid string id
      matches = rIdExp.exec( entity );

      //  Get media element by id or object reference
      this.media = matches && matches.length && matches[ 2 ] ?
                     document.getElementById( matches[ 2 ] ) :
                     entity;

      //  Create an audio or video element property reference
      this[ ( this.media.nodeName && this.media.nodeName.toLowerCase() ) || "video" ] = this.media;

      //  Register new instance
      Popcorn.instances.push( this );

      this.options = options || {};

      this.isDestroyed = false;

      this.data = {

        // Executed by either timeupdate event or in rAF loop
        timeUpdate: Popcorn.nop,

        // Allows disabling a plugin per instance
        disabled: [],

        // Stores DOM event queues by type
        events: {},

        // Stores Special event hooks data
        hooks: {},

        // Store track event history data
        history: [],

        // Stores ad-hoc state related data]
        state: {
          volume: this.media.volume
        },

        // Store track event object references by trackId
        trackRefs: {},

        // Playback track event queues
        trackEvents: {
          byStart: [{

            start: -1,
            end: -1
          }],
          byEnd: [{
            start: -1,
            end: -1
          }],
          animating: [],
          startIndex: 0,
          endIndex: 0,
          previousUpdateTime: -1
        }
      };

      //  Wrap true ready check
      var isReady = function( that ) {

        var duration, videoDurationPlus;

        if ( that.media.readyState >= 2 ) {
          //  Adding padding to the front and end of the arrays
          //  this is so we do not fall off either end

          duration = that.media.duration;
          //  Check for no duration info (NaN)
          videoDurationPlus = duration != duration ? Number.MAX_VALUE : duration + 1;

          Popcorn.addTrackEvent( that, {
            start: videoDurationPlus,
            end: videoDurationPlus
          });

          if ( that.options.frameAnimation ) {
            //  if Popcorn is created with frameAnimation option set to true,
            //  requestAnimFrame is used instead of "timeupdate" media event.
            //  This is for greater frame time accuracy, theoretically up to
            //  60 frames per second as opposed to ~4 ( ~every 15-250ms)
            that.data.timeUpdate = function () {

              Popcorn.timeUpdate( that, {} );

              that.trigger( "timeupdate" );

              !that.isDestroyed && requestAnimFrame( that.data.timeUpdate );
            };

            !that.isDestroyed && requestAnimFrame( that.data.timeUpdate );

          } else {

            that.data.timeUpdate = function( event ) {
              Popcorn.timeUpdate( that, event );
            };

            if ( !that.isDestroyed ) {
              that.media.addEventListener( "timeupdate", that.data.timeUpdate, false );
            }
          }
        } else {
          global.setTimeout(function() {
            isReady( that );
          }, 1 );
        }
      };

      isReady( this );

      return this;
    }
  };

  //  Extend constructor prototype to instance prototype
  //  Allows chaining methods to instances
  Popcorn.p.init.prototype = Popcorn.p;

  Popcorn.forEach = function( obj, fn, context ) {

    if ( !obj || !fn ) {
      return {};
    }

    context = context || this;

    var key, len;

    // Use native whenever possible
    if ( forEach && obj.forEach === forEach ) {
      return obj.forEach( fn, context );
    }

    if ( toString.call( obj ) === "[object NodeList]" ) {
      for ( key = 0, len = obj.length; key < len; key++ ) {
        fn.call( context, obj[ key ], key, obj );
      }
      return obj;
    }

    for ( key in obj ) {
      if ( hasOwn.call( obj, key ) ) {
        fn.call( context, obj[ key ], key, obj );
      }
    }
    return obj;
  };

  Popcorn.extend = function( obj ) {
    var dest = obj, src = slice.call( arguments, 1 );

    Popcorn.forEach( src, function( copy ) {
      for ( var prop in copy ) {
        dest[ prop ] = copy[ prop ];
      }
    });

    return dest;
  };


  // A Few reusable utils, memoized onto Popcorn
  Popcorn.extend( Popcorn, {
    noConflict: function( deep ) {

      if ( deep ) {
        global.Popcorn = _Popcorn;
      }

      return Popcorn;
    },
    error: function( msg ) {
      throw new Error( msg );
    },
    guid: function( prefix ) {
      Popcorn.guid.counter++;
      return  ( prefix ? prefix : "" ) + ( +new Date() + Popcorn.guid.counter );
    },
    sizeOf: function( obj ) {
      var size = 0;

      for ( var prop in obj ) {
        size++;
      }

      return size;
    },
    isArray: Array.isArray || function( array ) {
      return toString.call( array ) === "[object Array]";
    },

    nop: function() {},

    position: function( elem ) {

      var clientRect = elem.getBoundingClientRect(),
          bounds = {},
          doc = elem.ownerDocument,
          docElem = document.documentElement,
          body = document.body,
          clientTop, clientLeft, scrollTop, scrollLeft, top, left;

      //  Determine correct clientTop/Left
      clientTop = docElem.clientTop || body.clientTop || 0;
      clientLeft = docElem.clientLeft || body.clientLeft || 0;

      //  Determine correct scrollTop/Left
      scrollTop = ( global.pageYOffset && docElem.scrollTop || body.scrollTop );
      scrollLeft = ( global.pageXOffset && docElem.scrollLeft || body.scrollLeft );

      //  Temp top/left
      top = Math.ceil( clientRect.top + scrollTop - clientTop );
      left = Math.ceil( clientRect.left + scrollLeft - clientLeft );

      for ( var p in clientRect ) {
        bounds[ p ] = Math.round( clientRect[ p ] );
      }

      return Popcorn.extend({}, bounds, { top: top, left: left });
    },

    disable: function( instance, plugin ) {

      var disabled = instance.data.disabled;

      if ( disabled.indexOf( plugin ) === -1 ) {
        disabled.push( plugin );
      }

      refresh( instance );

      return instance;
    },
    enable: function( instance, plugin ) {

      var disabled = instance.data.disabled,
          index = disabled.indexOf( plugin );

      if ( index > -1 ) {
        disabled.splice( index, 1 );
      }

      refresh( instance );

      return instance;
    },
    destroy: function( instance ) {
      var events = instance.data.events,
          singleEvent, item, fn;

      //  Iterate through all events and remove them
      for ( item in events ) {
        singleEvent = events[ item ];
        for ( fn in singleEvent ) {
          delete singleEvent[ fn ];
        }
        events[ item ] = null;
      }

      if ( !instance.isDestroyed ) {
        instance.data.timeUpdate && instance.media.removeEventListener( "timeupdate", instance.data.timeUpdate, false );
        instance.isDestroyed = true;
      }
    }
  });

  //  Memoized GUID Counter
  Popcorn.guid.counter = 1;

  //  Factory to implement getters, setters and controllers
  //  as Popcorn instance methods. The IIFE will create and return
  //  an object with defined methods
  Popcorn.extend(Popcorn.p, (function() {

      var methods = "load play pause currentTime playbackRate volume duration preload playbackRate " +
                    "autoplay loop controls muted buffered readyState seeking paused played seekable ended",
          ret = {};


      //  Build methods, store in object that is returned and passed to extend
      Popcorn.forEach( methods.split( /\s+/g ), function( name ) {

        ret[ name ] = function( arg ) {

          if ( typeof this.media[ name ] === "function" ) {

            // Support for shorthanded play(n)/pause(n) jump to currentTime
            // If arg is not null or undefined and called by one of the
            // allowed shorthandable methods, then set the currentTime
            // Supports time as seconds or SMPTE
            if ( arg != null && /play|pause/.test( name ) ) {
              this.media.currentTime = Popcorn.util.toSeconds( arg );
            }

            this.media[ name ]();

            return this;
          }


          if ( arg != null ) {

            this.media[ name ] = arg;

            return this;
          }

          return this.media[ name ];
        };
      });

      return ret;

    })()
  );

  Popcorn.forEach( "enable disable".split(" "), function( method ) {
    Popcorn.p[ method ] = function( plugin ) {
      return Popcorn[ method ]( this, plugin );
    };
  });

  Popcorn.extend(Popcorn.p, {

    //  Rounded currentTime
    roundTime: function() {
      return -~this.media.currentTime;
    },

    //  Attach an event to a single point in time
    exec: function( time, fn ) {

      //  Creating a one second track event with an empty end
      Popcorn.addTrackEvent( this, {
        start: time,
        end: time + 1,
        _running: false,
        _natives: {
          start: fn || Popcorn.nop,
          end: Popcorn.nop,
          type: "exec"
        }
      });

      return this;
    },

    // Mute the calling media, optionally toggle
    mute: function( toggle ) {

      var event = toggle == null || toggle === true ? "muted" : "unmuted";

      // If `toggle` is explicitly `false`,
      // unmute the media and restore the volume level
      if ( event === "unmuted" ) {
        this.media.muted = false;
        this.media.volume = this.data.state.volume;
      }

      // If `toggle` is either null or undefined,
      // save the current volume and mute the media element
      if ( event === "muted" ) {
        this.data.state.volume = this.media.volume;
        this.media.muted = true;
      }

      // Trigger either muted|unmuted event
      this.trigger( event );

      return this;
    },

    // Convenience method, unmute the calling media
    unmute: function( toggle ) {

      return this.mute( toggle == null ? false : !toggle );
    },

    // Get the client bounding box of an instance element
    position: function() {
      return Popcorn.position( this.media );
    },

    // Toggle a plugin's playback behaviour (on or off) per instance
    toggle: function( plugin ) {
      return Popcorn[ this.data.disabled.indexOf( plugin ) > -1 ? "enable" : "disable" ]( this, plugin );
    },

    // Set default values for plugin options objects per instance
    defaults: function( plugin, defaults ) {

      // If an array of default configurations is provided,
      // iterate and apply each to this instance
      if ( Popcorn.isArray( plugin ) ) {

        Popcorn.forEach( plugin, function( obj ) {
          for ( var name in obj ) {
            this.defaults( name, obj[ name ] );
          }
        }, this );

        return this;
      }

      if ( !this.options.defaults ) {
        this.options.defaults = {};
      }

      if ( !this.options.defaults[ plugin ] ) {
        this.options.defaults[ plugin ] = {};
      }

      Popcorn.extend( this.options.defaults[ plugin ], defaults );

      return this;
    }
  });

  Popcorn.Events  = {
    UIEvents: "blur focus focusin focusout load resize scroll unload",
    MouseEvents: "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave click dblclick",
    Events: "loadstart progress suspend emptied stalled play pause " +
            "loadedmetadata loadeddata waiting playing canplay canplaythrough " +
            "seeking seeked timeupdate ended ratechange durationchange volumechange"
  };

  Popcorn.Events.Natives = Popcorn.Events.UIEvents + " " +
                           Popcorn.Events.MouseEvents + " " +
                           Popcorn.Events.Events;

  internal.events.apiTypes = [ "UIEvents", "MouseEvents", "Events" ];

  // Privately compile events table at load time
  (function( events, data ) {

    var apis = internal.events.apiTypes,
    eventsList = events.Natives.split( /\s+/g ),
    idx = 0, len = eventsList.length, prop;

    for( ; idx < len; idx++ ) {
      data.hash[ eventsList[idx] ] = true;
    }

    apis.forEach(function( val, idx ) {

      data.apis[ val ] = {};

      var apiEvents = events[ val ].split( /\s+/g ),
      len = apiEvents.length,
      k = 0;

      for ( ; k < len; k++ ) {
        data.apis[ val ][ apiEvents[ k ] ] = true;
      }
    });
  })( Popcorn.Events, internal.events );

  Popcorn.events = {

    isNative: function( type ) {
      return !!internal.events.hash[ type ];
    },
    getInterface: function( type ) {

      if ( !Popcorn.events.isNative( type ) ) {
        return false;
      }

      var eventApi = internal.events,
        apis = eventApi.apiTypes,
        apihash = eventApi.apis,
        idx = 0, len = apis.length, api, tmp;

      for ( ; idx < len; idx++ ) {
        tmp = apis[ idx ];

        if ( apihash[ tmp ][ type ] ) {
          api = tmp;
          break;
        }
      }
      return api;
    },
    //  Compile all native events to single array
    all: Popcorn.Events.Natives.split( /\s+/g ),
    //  Defines all Event handling static functions
    fn: {
      trigger: function( type, data ) {

        var eventInterface, evt;
        //  setup checks for custom event system
        if ( this.data.events[ type ] && Popcorn.sizeOf( this.data.events[ type ] ) ) {

          eventInterface  = Popcorn.events.getInterface( type );

          if ( eventInterface ) {

            evt = document.createEvent( eventInterface );
            evt.initEvent( type, true, true, global, 1 );

            this.media.dispatchEvent( evt );

            return this;
          }

          //  Custom events
          Popcorn.forEach( this.data.events[ type ], function( obj, key ) {

            obj.call( this, data );

          }, this );

        }

        return this;
      },
      listen: function( type, fn ) {

        var self = this,
            hasEvents = true,
            eventHook = Popcorn.events.hooks[ type ],
            origType = type,
            tmp;

        if ( !this.data.events[ type ] ) {
          this.data.events[ type ] = {};
          hasEvents = false;
        }

        // Check and setup event hooks
        if ( eventHook ) {

          // Execute hook add method if defined
          if ( eventHook.add ) {
            eventHook.add.call( this, {}, fn );
          }

          // Reassign event type to our piggyback event type if defined
          if ( eventHook.bind ) {
            type = eventHook.bind;
          }

          // Reassign handler if defined
          if ( eventHook.handler ) {
            tmp = fn;

            fn = function wrapper( event ) {
              eventHook.handler.call( self, event, tmp );
            };
          }

          // assume the piggy back event is registered
          hasEvents = true;

          // Setup event registry entry
          if ( !this.data.events[ type ] ) {
            this.data.events[ type ] = {};
            // Toggle if the previous assumption was untrue
            hasEvents = false;
          }
        }

        //  Register event and handler
        this.data.events[ type ][ fn.name || ( fn.toString() + Popcorn.guid() ) ] = fn;

        // only attach one event of any type
        if ( !hasEvents && Popcorn.events.all.indexOf( type ) > -1 ) {

          this.media.addEventListener( type, function( event ) {

            Popcorn.forEach( self.data.events[ type ], function( obj, key ) {
              if ( typeof obj === "function" ) {
                obj.call( self, event );
              }
            });

          }, false);
        }
        return this;
      },
      unlisten: function( type, fn ) {

        if ( this.data.events[ type ] && this.data.events[ type ][ fn ] ) {

          delete this.data.events[ type ][ fn ];

          return this;
        }

        this.data.events[ type ] = null;

        return this;
      }
    },
    hooks: {
      canplayall: {
        bind: "canplaythrough",
        add: function( event, callback ) {

          var state = false;

          if ( this.media.readyState ) {

            callback.call( this, event );

            state = true;
          }

          this.data.hooks.canplayall = {
            fired: state
          };
        },
        // declare special handling instructions
        handler: function canplayall( event, callback ) {

          if ( !this.data.hooks.canplayall.fired ) {
            // trigger original user callback once
            callback.call( this, event );

            this.data.hooks.canplayall.fired = true;
          }
        }
      }
    }
  };

  //  Extend Popcorn.events.fns (listen, unlisten, trigger) to all Popcorn instances
  Popcorn.forEach( [ "trigger", "listen", "unlisten" ], function( key ) {
    Popcorn.p[ key ] = Popcorn.events.fn[ key ];
  });

  // Internal Only - Adds track events to the instance object
  Popcorn.addTrackEvent = function( obj, track ) {

    // Determine if this track has default options set for it
    // If so, apply them to the track object
    if ( track && track._natives && track._natives.type &&
        ( obj.options.defaults && obj.options.defaults[ track._natives.type ] ) ) {

      track = Popcorn.extend( {}, obj.options.defaults[ track._natives.type ], track );
    }

    if ( track._natives ) {
      //  Supports user defined track event id
      track._id = !track.id ? Popcorn.guid( track._natives.type ) : track.id;

      //  Push track event ids into the history
      obj.data.history.push( track._id );
    }

    track.start = Popcorn.util.toSeconds( track.start, obj.options.framerate );
    track.end   = Popcorn.util.toSeconds( track.end, obj.options.framerate );

    //  Store this definition in an array sorted by times
    var byStart = obj.data.trackEvents.byStart,
        byEnd = obj.data.trackEvents.byEnd,
        startIndex, endIndex,
        currentTime;

    for ( startIndex = byStart.length - 1; startIndex >= 0; startIndex-- ) {

      if ( track.start >= byStart[ startIndex ].start ) {
        byStart.splice( startIndex + 1, 0, track );
        break;
      }
    }

    for ( endIndex = byEnd.length - 1; endIndex >= 0; endIndex-- ) {

      if ( track.end > byEnd[ endIndex ].end ) {
        byEnd.splice( endIndex + 1, 0, track );
        break;
      }
    }

    // Display track event immediately if it's enabled and current
    if ( track._natives &&
        ( !!Popcorn.registryByName[ track._natives.type ] || !!obj[ track._natives.type ] ) ) {

      currentTime = obj.media.currentTime;
      if ( track.end > currentTime &&
        track.start <= currentTime &&
        obj.data.disabled.indexOf( track._natives.type ) === -1 ) {

        track._running = true;
        track._natives.start.call( obj, null, track );

        if ( obj.options.frameAnimation &&
          track._natives.frame ) {

          obj.data.trackEvents.animating.push( track );
          track._natives.frame.call( obj, null, track, currentTime );
        }
      }
    }

    // update startIndex and endIndex
    if ( startIndex <= obj.data.trackEvents.startIndex &&
      track.start <= obj.data.trackEvents.previousUpdateTime ) {

      obj.data.trackEvents.startIndex++;
    }

    if ( endIndex <= obj.data.trackEvents.endIndex &&
      track.end < obj.data.trackEvents.previousUpdateTime ) {

      obj.data.trackEvents.endIndex++;
    }

    this.timeUpdate( obj, null, true );

    // Store references to user added trackevents in ref table
    if ( track._id ) {
      Popcorn.addTrackEvent.ref( obj, track );
    }
  };

  // Internal Only - Adds track event references to the instance object's trackRefs hash table
  Popcorn.addTrackEvent.ref = function( obj, track ) {
    obj.data.trackRefs[ track._id ] = track;

    return obj;
  };

  Popcorn.removeTrackEvent  = function( obj, trackId ) {

    var historyLen = obj.data.history.length,
        indexWasAt = 0,
        byStart = [],
        byEnd = [],
        animating = [],
        history = [];

    Popcorn.forEach( obj.data.trackEvents.byStart, function( o, i, context ) {
      // Preserve the original start/end trackEvents
      if ( !o._id ) {
        byStart.push( obj.data.trackEvents.byStart[i] );
        byEnd.push( obj.data.trackEvents.byEnd[i] );
      }

      // Filter for user track events (vs system track events)
      if ( o._id ) {

        // Filter for the trackevent to remove
        if ( o._id !== trackId ) {
          byStart.push( obj.data.trackEvents.byStart[i] );
          byEnd.push( obj.data.trackEvents.byEnd[i] );
        }

        //  Capture the position of the track being removed.
        if ( o._id === trackId ) {
          indexWasAt = i;
          o._natives._teardown && o._natives._teardown.call( obj, o );
        }
      }

    });

    if ( obj.data.trackEvents.animating.length ) {
      Popcorn.forEach( obj.data.trackEvents.animating, function( o, i, context ) {
        // Preserve the original start/end trackEvents
        if ( !o._id ) {
          animating.push( obj.data.trackEvents.animating[i] );
        }

        // Filter for user track events (vs system track events)
        if ( o._id ) {
          // Filter for the trackevent to remove
          if ( o._id !== trackId ) {
            animating.push( obj.data.trackEvents.animating[i] );
          }
        }
      });
    }

    //  Update
    if ( indexWasAt <= obj.data.trackEvents.startIndex ) {
      obj.data.trackEvents.startIndex--;
    }

    if ( indexWasAt <= obj.data.trackEvents.endIndex ) {
      obj.data.trackEvents.endIndex--;
    }

    obj.data.trackEvents.byStart = byStart;
    obj.data.trackEvents.byEnd = byEnd;
    obj.data.trackEvents.animating = animating;

    for ( var i = 0; i < historyLen; i++ ) {
      if ( obj.data.history[ i ] !== trackId ) {
        history.push( obj.data.history[ i ] );
      }
    }

    // Update ordered history array
    obj.data.history = history;

    // Update track event references
    Popcorn.removeTrackEvent.ref( obj, trackId );
  };

  // Internal Only - Removes track event references from instance object's trackRefs hash table
  Popcorn.removeTrackEvent.ref = function( obj, trackId ) {
    delete obj.data.trackRefs[ trackId ];

    return obj;
  };

  // Return an array of track events bound to this instance object
  Popcorn.getTrackEvents = function( obj ) {

    var trackevents = [],
      refs = obj.data.trackEvents.byStart,
      length = refs.length,
      idx = 0,
      ref;

    for ( ; idx < length; idx++ ) {
      ref = refs[ idx ];
      // Return only user attributed track event references
      if ( ref._id ) {
        trackevents.push( ref );
      }
    }

    return trackevents;
  };

  // Internal Only - Returns an instance object's trackRefs hash table
  Popcorn.getTrackEvents.ref = function( obj ) {
    return obj.data.trackRefs;
  };

  // Return a single track event bound to this instance object
  Popcorn.getTrackEvent = function( obj, trackId ) {
    return obj.data.trackRefs[ trackId ];
  };

  // Internal Only - Returns an instance object's track reference by track id
  Popcorn.getTrackEvent.ref = function( obj, trackId ) {
    return obj.data.trackRefs[ trackId ];
  };

  Popcorn.getLastTrackEventId = function( obj ) {
    return obj.data.history[ obj.data.history.length - 1 ];
  };

  Popcorn.timeUpdate = function( obj, event ) {

    var currentTime = obj.media.currentTime,
        previousTime = obj.data.trackEvents.previousUpdateTime,
        tracks = obj.data.trackEvents,
        animating = tracks.animating,
        end = tracks.endIndex,
        start = tracks.startIndex,
        animIndex = 0,
        byStartLen = tracks.byStart.length,
        byEndLen = tracks.byEnd.length,
        registryByName = Popcorn.registryByName,
        trackstart = "trackstart",
        trackend = "trackend",

        byEnd, byStart, byAnimate, natives, type;

    //  Playbar advancing
    if ( previousTime <= currentTime ) {

      while ( tracks.byEnd[ end ] && tracks.byEnd[ end ].end <= currentTime ) {

        byEnd = tracks.byEnd[ end ];
        natives = byEnd._natives;
        type = natives && natives.type;

        //  If plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byEnd._running === true ) {
            byEnd._running = false;
            natives.end.call( obj, event, byEnd );

            obj.trigger( trackend,
              Popcorn.extend({}, byEnd, {
                plugin: type,
                type: trackend
              })
            );
          }

          end++;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byEnd._id );
          return;
        }
      }

      while ( tracks.byStart[ start ] && tracks.byStart[ start ].start <= currentTime ) {

        byStart = tracks.byStart[ start ];
        natives = byStart._natives;
        type = natives && natives.type;

        //  If plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byStart.end > currentTime &&
                byStart._running === false &&
                  obj.data.disabled.indexOf( type ) === -1 ) {

            byStart._running = true;
            natives.start.call( obj, event, byStart );

            obj.trigger( trackstart,
              Popcorn.extend({}, byStart, {
                plugin: type,
                type: trackstart
              })
            );

            // If the `frameAnimation` option is used,
            // push the current byStart object into the `animating` cue
            if ( obj.options.frameAnimation &&
                ( byStart && byStart._running && byStart._natives.frame ) ) {

              animating.push( byStart );
            }
          }
          start++;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byStart._id );
          return;
        }
      }

      // If the `frameAnimation` option is used, iterate the animating track
      // and execute the `frame` callback
      if ( obj.options.frameAnimation ) {
        while ( animIndex < animating.length ) {

          byAnimate = animating[ animIndex ];

          if ( !byAnimate._running ) {
            animating.splice( animIndex, 1 );
          } else {
            byAnimate._natives.frame.call( obj, event, byAnimate, currentTime );
            animIndex++;
          }
        }
      }

    // Playbar receding
    } else if ( previousTime > currentTime ) {

      while ( tracks.byStart[ start ] && tracks.byStart[ start ].start > currentTime ) {

        byStart = tracks.byStart[ start ];
        natives = byStart._natives;
        type = natives && natives.type;

        // if plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byStart._running === true ) {
            byStart._running = false;
            natives.end.call( obj, event, byStart );

            obj.trigger( trackend,
              Popcorn.extend({}, byEnd, {
                plugin: type,
                type: trackend
              })
            );
          }
          start--;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byStart._id );
          return;
        }
      }

      while ( tracks.byEnd[ end ] && tracks.byEnd[ end ].end > currentTime ) {

        byEnd = tracks.byEnd[ end ];
        natives = byEnd._natives;
        type = natives && natives.type;

        // if plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byEnd.start <= currentTime &&
                byEnd._running === false  &&
                  obj.data.disabled.indexOf( type ) === -1 ) {

            byEnd._running = true;
            natives.start.call( obj, event, byEnd );

            obj.trigger( trackstart,
              Popcorn.extend({}, byStart, {
                plugin: type,
                type: trackstart
              })
            );
            // If the `frameAnimation` option is used,
            // push the current byEnd object into the `animating` cue
            if ( obj.options.frameAnimation &&
                  ( byEnd && byEnd._running && byEnd._natives.frame ) ) {

              animating.push( byEnd );
            }
          }
          end--;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byEnd._id );
          return;
        }
      }

      // If the `frameAnimation` option is used, iterate the animating track
      // and execute the `frame` callback
      if ( obj.options.frameAnimation ) {
        while ( animIndex < animating.length ) {

          byAnimate = animating[ animIndex ];

          if ( !byAnimate._running ) {
            animating.splice( animIndex, 1 );
          } else {
            byAnimate._natives.frame.call( obj, event, byAnimate, currentTime );
            animIndex++;
          }
        }
      }
    // time bar is not moving ( video is paused )
    }

    tracks.endIndex = end;
    tracks.startIndex = start;
    tracks.previousUpdateTime = currentTime;

    //enforce index integrity if trackRemoved
    tracks.byStart.length < byStartLen && tracks.startIndex--;
    tracks.byEnd.length < byEndLen && tracks.endIndex--;

  };

  //  Map and Extend TrackEvent functions to all Popcorn instances
  Popcorn.extend( Popcorn.p, {

    getTrackEvents: function() {
      return Popcorn.getTrackEvents.call( null, this );
    },

    getTrackEvent: function( id ) {
      return Popcorn.getTrackEvent.call( null, this, id );
    },

    getLastTrackEventId: function() {
      return Popcorn.getLastTrackEventId.call( null, this );
    },

    removeTrackEvent: function( id ) {

      Popcorn.removeTrackEvent.call( null, this, id );
      return this;
    },

    removePlugin: function( name ) {
      Popcorn.removePlugin.call( null, this, name );
      return this;
    },

    timeUpdate: function( event ) {
      Popcorn.timeUpdate.call( null, this, event );
      return this;
    },

    destroy: function() {
      Popcorn.destroy.call( null, this );
      return this;
    }
  });

  //  Plugin manifests
  Popcorn.manifest = {};
  //  Plugins are registered
  Popcorn.registry = [];
  Popcorn.registryByName = {};
  //  An interface for extending Popcorn
  //  with plugin functionality
  Popcorn.plugin = function( name, definition, manifest ) {

    if ( Popcorn.protect.natives.indexOf( name.toLowerCase() ) >= 0 ) {
      Popcorn.error( "'" + name + "' is a protected function name" );
      return;
    }

    //  Provides some sugar, but ultimately extends
    //  the definition into Popcorn.p
    var reserved = [ "start", "end" ],
        plugin = {},
        setup,
        isfn = typeof definition === "function",
        methods = [ "_setup", "_teardown", "start", "end", "frame" ];

    // combines calls of two function calls into one
    var combineFn = function( first, second ) {

      first = first || Popcorn.nop;
      second = second || Popcorn.nop;

      return function() {
        first.apply( this, arguments );
        second.apply( this, arguments );
      };
    };

    //  If `manifest` arg is undefined, check for manifest within the `definition` object
    //  If no `definition.manifest`, an empty object is a sufficient fallback
    Popcorn.manifest[ name ] = manifest = manifest || definition.manifest || {};

    // apply safe, and empty default functions
    methods.forEach(function( method ) {
      definition[ method ] = safeTry( definition[ method ] || Popcorn.nop, name );
    });

    var pluginFn = function( setup, options ) {

      if ( !options ) {
        return this;
      }

      //  Storing the plugin natives
      var natives = options._natives = {},
          compose = "",
          defaults, originalOpts, manifestOpts, mergedSetupOpts;

      Popcorn.extend( natives, setup );

      options._natives.type = name;
      options._running = false;

      natives.start = natives.start || natives[ "in" ];
      natives.end = natives.end || natives[ "out" ];

      // extend teardown to always call end if running
      natives._teardown = combineFn(function() {

        var args = slice.call( arguments );

        // end function signature is not the same as teardown,
        // put null on the front of arguments for the event parameter
        args.unshift( null );

        // only call end if event is running
        args[ 1 ]._running && natives.end.apply( this, args );
      }, natives._teardown );

      // Check for previously set default options
      defaults = this.options.defaults && this.options.defaults[ options._natives && options._natives.type ];

      // default to an empty string if no effect exists
      // split string into an array of effects
      options.compose = options.compose && options.compose.split( " " ) || [];
      options.effect = options.effect && options.effect.split( " " ) || [];

      // join the two arrays together
      options.compose = options.compose.concat( options.effect );

      options.compose.forEach(function( composeOption ) {

        // if the requested compose is garbage, throw it away
        compose = Popcorn.compositions[ composeOption ] || {};

        // extends previous functions with compose function
        methods.forEach(function( method ) {
          natives[ method ] = combineFn( natives[ method ], compose[ method ] );
        });
      });

      //  Ensure a manifest object, an empty object is a sufficient fallback
      options._natives.manifest = manifest;

      //  Checks for expected properties
      if ( !( "start" in options ) ) {
        options.start = options[ "in" ] || 0;
      }

      if ( !( "end" in options ) ) {
        options.end = options[ "out" ] || this.duration() || Number.MAX_VALUE;
      }

      // Merge with defaults if they exist, make sure per call is prioritized
      mergedSetupOpts = defaults ? Popcorn.extend( {}, defaults, options ) :
                          options;

      // Resolves 239, 241, 242
      if ( !mergedSetupOpts.target ) {

        //  Sometimes the manifest may be missing entirely
        //  or it has an options object that doesn't have a `target` property
        manifestOpts = "options" in manifest && manifest.options;

        mergedSetupOpts.target = manifestOpts && "target" in manifestOpts && manifestOpts.target;
      }

      // Trigger _setup method if exists
      options._natives._setup && options._natives._setup.call( this, mergedSetupOpts );

      // Create new track event for this instance
      Popcorn.addTrackEvent( this, Popcorn.extend( mergedSetupOpts, options ) );

      //  Future support for plugin event definitions
      //  for all of the native events
      Popcorn.forEach( setup, function( callback, type ) {

        if ( type !== "type" ) {

          if ( reserved.indexOf( type ) === -1 ) {

            this.listen( type, callback );
          }
        }

      }, this );

      return this;
    };

    //  Assign new named definition
    plugin[ name ] = function( options ) {
      return pluginFn.call( this, isfn ? definition.call( this, options ) : definition,
                                  options );
    };

    //  Extend Popcorn.p with new named definition
    Popcorn.extend( Popcorn.p, plugin );

    //  Push into the registry
    var entry = {
      fn: plugin[ name ],
      definition: definition,
      base: definition,
      parents: [],
      name: name
    };
    Popcorn.registry.push(
       Popcorn.extend( plugin, entry, {
        type: name
      })
    );
    Popcorn.registryByName[ name ] = entry;

    return plugin;
  };

  // Storage for plugin function errors
  Popcorn.plugin.errors = [];

  // Returns wrapped plugin function
  function safeTry( fn, pluginName ) {
    return function() {

      //  When Popcorn.plugin.debug is true, do not suppress errors
      if ( Popcorn.plugin.debug ) {
        return fn.apply( this, arguments );
      }

      try {
        return fn.apply( this, arguments );
      } catch ( ex ) {

        // Push plugin function errors into logging queue
        Popcorn.plugin.errors.push({
          plugin: pluginName,
          thrown: ex,
          source: fn.toString()
        });

        // Trigger an error that the instance can listen for
        // and react to
        this.trigger( "error", Popcorn.plugin.errors );
      }
    };
  }

  // Debug-mode flag for plugin development
  Popcorn.plugin.debug = false;

  //  removePlugin( type ) removes all tracks of that from all instances of popcorn
  //  removePlugin( obj, type ) removes all tracks of type from obj, where obj is a single instance of popcorn
  Popcorn.removePlugin = function( obj, name ) {

    //  Check if we are removing plugin from an instance or from all of Popcorn
    if ( !name ) {

      //  Fix the order
      name = obj;
      obj = Popcorn.p;

      if ( Popcorn.protect.natives.indexOf( name.toLowerCase() ) >= 0 ) {
        Popcorn.error( "'" + name + "' is a protected function name" );
        return;
      }

      var registryLen = Popcorn.registry.length,
          registryIdx;

      // remove plugin reference from registry
      for ( registryIdx = 0; registryIdx < registryLen; registryIdx++ ) {
        if ( Popcorn.registry[ registryIdx ].name === name ) {
          Popcorn.registry.splice( registryIdx, 1 );
          delete Popcorn.registryByName[ name ];
          delete Popcorn.manifest[ name ];

          // delete the plugin
          delete obj[ name ];

          // plugin found and removed, stop checking, we are done
          return;
        }
      }

    }

    var byStart = obj.data.trackEvents.byStart,
        byEnd = obj.data.trackEvents.byEnd,
        animating = obj.data.trackEvents.animating,
        idx, sl;

    // remove all trackEvents
    for ( idx = 0, sl = byStart.length; idx < sl; idx++ ) {

      if ( ( byStart[ idx ] && byStart[ idx ]._natives && byStart[ idx ]._natives.type === name ) &&
                ( byEnd[ idx ] && byEnd[ idx ]._natives && byEnd[ idx ]._natives.type === name ) ) {

        byStart[ idx ]._natives._teardown && byStart[ idx ]._natives._teardown.call( obj, byStart[ idx ] );

        byStart.splice( idx, 1 );
        byEnd.splice( idx, 1 );

        // update for loop if something removed, but keep checking
        idx--; sl--;
        if ( obj.data.trackEvents.startIndex <= idx ) {
          obj.data.trackEvents.startIndex--;
          obj.data.trackEvents.endIndex--;
        }
      }
    }

    //remove all animating events
    for ( idx = 0, sl = animating.length; idx < sl; idx++ ) {

      if ( animating[ idx ] && animating[ idx ]._natives && animating[ idx ]._natives.type === name ) {

        animating.splice( idx, 1 );

        // update for loop if something removed, but keep checking
        idx--; sl--;
      }
    }

  };

  Popcorn.compositions = {};

  //  Plugin inheritance
  Popcorn.compose = function( name, definition, manifest ) {

    //  If `manifest` arg is undefined, check for manifest within the `definition` object
    //  If no `definition.manifest`, an empty object is a sufficient fallback
    Popcorn.manifest[ name ] = manifest = manifest || definition.manifest || {};

    // register the effect by name
    Popcorn.compositions[ name ] = definition;
  };

  Popcorn.plugin.effect = Popcorn.effect = Popcorn.compose;

  // stores parsers keyed on filetype
  Popcorn.parsers = {};

  // An interface for extending Popcorn
  // with parser functionality
  Popcorn.parser = function( name, type, definition ) {

    if ( Popcorn.protect.natives.indexOf( name.toLowerCase() ) >= 0 ) {
      Popcorn.error( "'" + name + "' is a protected function name" );
      return;
    }

    // fixes parameters for overloaded function call
    if ( typeof type === "function" && !definition ) {
      definition = type;
      type = "";
    }

    if ( typeof definition !== "function" || typeof type !== "string" ) {
      return;
    }

    // Provides some sugar, but ultimately extends
    // the definition into Popcorn.p

    var natives = Popcorn.events.all,
        parseFn,
        parser = {};

    parseFn = function( filename, callback ) {

      if ( !filename ) {
        return this;
      }

      var that = this;

      Popcorn.xhr({
        url: filename,
        dataType: type,
        success: function( data ) {

          var tracksObject = definition( data ),
              tracksData,
              tracksDataLen,
              tracksDef,
              idx = 0;

          tracksData = tracksObject.data || [];
          tracksDataLen = tracksData.length;
          tracksDef = null;

          //  If no tracks to process, return immediately
          if ( !tracksDataLen ) {
            return;
          }

          //  Create tracks out of parsed object
          for ( ; idx < tracksDataLen; idx++ ) {

            tracksDef = tracksData[ idx ];

            for ( var key in tracksDef ) {

              if ( hasOwn.call( tracksDef, key ) && !!that[ key ] ) {

                that[ key ]( tracksDef[ key ] );
              }
            }
          }
          if ( callback ) {
            callback();
          }
        }
      });

      return this;
    };

    // Assign new named definition
    parser[ name ] = parseFn;

    // Extend Popcorn.p with new named definition
    Popcorn.extend( Popcorn.p, parser );

    // keys the function name by filetype extension
    //Popcorn.parsers[ name ] = true;

    return parser;
  };

  Popcorn.player = function( name, player ) {

    player = player || {};

    var playerFn = function( target, src, options ) {

      options = options || {};

      // List of events
      var date = new Date() / 1000,
          baselineTime = date,
          currentTime = 0,
          volume = 1,
          muted = false,
          events = {},

          // The container div of the resource
          container = document.getElementById( rIdExp.exec( target ) && rIdExp.exec( target )[ 2 ] ) ||
                        document.getElementById( target ) ||
                          target,
          basePlayer = {},
          timeout,
          popcorn;

      // copies a div into the media object
      for( var val in container ) {

        if ( typeof container[ val ] === "object" ) {

          basePlayer[ val ] = container[ val ];
        } else if ( typeof container[ val ] === "function" ) {

          basePlayer[ val ] = (function( value ) {

            // this is a stupid ugly kludgy hack in honour of Safari
            // in Safari a NodeList is a function, not an object
            if ( "length" in container[ value ] && !container[ value ].call ) {

              return container[ value ];
            } else {

              return function() {

                return container[ value ].apply( container, arguments );
              };
            }
          }( val ));
        } else {

          Popcorn.player.defineProperty( basePlayer, val, {
            get: (function( value ) {

              return function() {

                return container[ value ];
              };
            }( val )),
            set: Popcorn.nop,
            configurable: true
          });
        }
      }

      var timeupdate = function() {

        date = new Date() / 1000;

        if ( !basePlayer.paused ) {

          basePlayer.currentTime = basePlayer.currentTime + ( date - baselineTime );
          basePlayer.dispatchEvent( "timeupdate" );
          timeout = setTimeout( timeupdate, 10 );
        }

        baselineTime = date;
      };

      basePlayer.play = function() {

        this.paused = false;

        if ( basePlayer.readyState >= 4 ) {

          baselineTime = new Date() / 1000;
          basePlayer.dispatchEvent( "play" );
          timeupdate();
        }
      };

      basePlayer.pause = function() {

        this.paused = true;
        basePlayer.dispatchEvent( "pause" );
      };

      Popcorn.player.defineProperty( basePlayer, "currentTime", {
        get: function() {

          return currentTime;
        },
        set: function( val ) {

          // make sure val is a number
          currentTime = +val;
          basePlayer.dispatchEvent( "timeupdate" );
          return currentTime;
        },
        configurable: true
      });

      Popcorn.player.defineProperty( basePlayer, "volume", {
        get: function() {

          return volume;
        },
        set: function( val ) {

          // make sure val is a number
          volume = +val;
          basePlayer.dispatchEvent( "volumechange" );
          return volume;
        },
        configurable: true
      });

      Popcorn.player.defineProperty( basePlayer, "muted", {
        get: function() {

          return muted;
        },
        set: function( val ) {

          // make sure val is a number
          muted = +val;
          basePlayer.dispatchEvent( "volumechange" );
          return muted;
        },
        configurable: true
      });

      // Adds an event listener to the object
      basePlayer.addEventListener = function( evtName, fn ) {

        if ( !events[ evtName ] ) {

          events[ evtName ] = [];
        }

        events[ evtName ].push( fn );
        return fn;
      };

      // Can take event object or simple string
      basePlayer.dispatchEvent = function( oEvent ) {

        var evt,
            self = this,
            eventInterface,
            eventName = oEvent.type;

        // A string was passed, create event object
        if ( !eventName ) {

          eventName = oEvent;
          eventInterface  = Popcorn.events.getInterface( eventName );

          if ( eventInterface ) {

            evt = document.createEvent( eventInterface );
            evt.initEvent( eventName, true, true, window, 1 );
          }
        }

        Popcorn.forEach( events[ eventName ], function( val ) {

          val.call( self, evt, self );
        });
      };

      // Attempt to get src from playerFn parameter
      basePlayer.src = src || "";
      basePlayer.readyState = 0;
      basePlayer.duration = 0;
      basePlayer.paused = true;
      basePlayer.ended = 0;

      if ( player._setup ) {

        player._setup.call( basePlayer, options );
      } else {

        // there is no setup, which means there is nothing to load
        basePlayer.readyState = 4;
        basePlayer.dispatchEvent( "load" );
        basePlayer.dispatchEvent( "loadeddata" );
      }

      // when a custom player is loaded, load basePlayer state into custom player
      basePlayer.addEventListener( "load", function() {

        // if a player is not ready before currentTime is called, this will set it after it is ready
        basePlayer.currentTime = currentTime;

        // same as above with volume and muted
        basePlayer.volume = volume;
        basePlayer.muted = muted;
      });

      basePlayer.addEventListener( "loadeddata", function() {

        // if play was called before player ready, start playing video
        !basePlayer.paused && basePlayer.play();
      });

      popcorn = new Popcorn.p.init( basePlayer, options );

      return popcorn;
    };

    Popcorn[ name ] = Popcorn[ name ] || playerFn;
  };

  Popcorn.player.defineProperty = Object.defineProperty || function( object, description, options ) {

    object.__defineGetter__( description, options.get || Popcorn.nop );
    object.__defineSetter__( description, options.set || Popcorn.nop );
  };

  //  Cache references to reused RegExps
  var rparams = /\?/,
  //  XHR Setup object
  setup = {
    url: "",
    data: "",
    dataType: "",
    success: Popcorn.nop,
    type: "GET",
    async: true,
    xhr: function() {
      return new global.XMLHttpRequest();
    }
  };

  Popcorn.xhr = function( options ) {

    options.dataType = options.dataType && options.dataType.toLowerCase() || null;

    if ( options.dataType &&
         ( options.dataType === "jsonp" || options.dataType === "script" ) ) {

      Popcorn.xhr.getJSONP(
        options.url,
        options.success,
        options.dataType === "script"
      );
      return;
    }

    var settings = Popcorn.extend( {}, setup, options );

    //  Create new XMLHttpRequest object
    settings.ajax  = settings.xhr();

    if ( settings.ajax ) {

      if ( settings.type === "GET" && settings.data ) {

        //  append query string
        settings.url += ( rparams.test( settings.url ) ? "&" : "?" ) + settings.data;

        //  Garbage collect and reset settings.data
        settings.data = null;
      }


      settings.ajax.open( settings.type, settings.url, settings.async );
      settings.ajax.send( settings.data || null );

      return Popcorn.xhr.httpData( settings );
    }
  };


  Popcorn.xhr.httpData = function( settings ) {

    var data, json = null,
        parser, xml = null;

    settings.ajax.onreadystatechange = function() {

      if ( settings.ajax.readyState === 4 ) {

        try {
          json = JSON.parse( settings.ajax.responseText );
        } catch( e ) {
          //suppress
        }

        data = {
          xml: settings.ajax.responseXML,
          text: settings.ajax.responseText,
          json: json
        };

        // Normalize: data.xml is non-null in IE9 regardless of if response is valid xml
        if ( !data.xml || !data.xml.documentElement ) {
          data.xml = null;

          try {
            parser = new DOMParser();
            xml = parser.parseFromString( settings.ajax.responseText, "text/xml" );

            if ( !xml.getElementsByTagName( "parsererror" ).length ) {
              data.xml = xml;
            }
          } catch ( e ) {
            // data.xml remains null
          }
        }

        //  If a dataType was specified, return that type of data
        if ( settings.dataType ) {
          data = data[ settings.dataType ];
        }


        settings.success.call( settings.ajax, data );

      }
    };
    return data;
  };

  Popcorn.xhr.getJSONP = function( url, success, isScript ) {

    var head = document.head || document.getElementsByTagName( "head" )[ 0 ] || document.documentElement,
      script = document.createElement( "script" ),
      paramStr = url.split( "?" )[ 1 ],
      isFired = false,
      params = [],
      callback, parts, callparam;

    if ( paramStr && !isScript ) {
      params = paramStr.split( "&" );
    }

    if ( params.length ) {
      parts = params[ params.length - 1 ].split( "=" );
    }

    callback = params.length ? ( parts[ 1 ] ? parts[ 1 ] : parts[ 0 ]  ) : "jsonp";

    if ( !paramStr && !isScript ) {
      url += "?callback=" + callback;
    }

    if ( callback && !isScript ) {

      //  If a callback name already exists
      if ( !!window[ callback ] ) {
        //  Create a new unique callback name
        callback = Popcorn.guid( callback );
      }

      //  Define the JSONP success callback globally
      window[ callback ] = function( data ) {
        // Fire success callbacks
        success && success( data );
        isFired = true;
      };

      //  Replace callback param and callback name
      url = url.replace( parts.join( "=" ), parts[ 0 ] + "=" + callback );
    }

    script.onload = function() {

      //  Handling remote script loading callbacks
      if ( isScript ) {
        //  getScript
        success && success();
      }

      //  Executing for JSONP requests
      if ( isFired ) {
        //  Garbage collect the callback
        delete window[ callback ];
      }
      //  Garbage collect the script resource
      head.removeChild( script );
    };

    script.src = url;

    head.insertBefore( script, head.firstChild );

    return;
  };

  Popcorn.getJSONP = Popcorn.xhr.getJSONP;

  Popcorn.getScript = Popcorn.xhr.getScript = function( url, success ) {

    return Popcorn.xhr.getJSONP( url, success, true );
  };

  Popcorn.util = {
    // Simple function to parse a timestamp into seconds
    // Acceptable formats are:
    // HH:MM:SS.MMM
    // HH:MM:SS;FF
    // Hours and minutes are optional. They default to 0
    toSeconds: function( timeStr, framerate ) {
      // Hours and minutes are optional
      // Seconds must be specified
      // Seconds can be followed by milliseconds OR by the frame information
      var validTimeFormat = /^([0-9]+:){0,2}[0-9]+([.;][0-9]+)?$/,
          errorMessage = "Invalid time format",
          digitPairs, lastIndex, lastPair, firstPair,
          frameInfo, frameTime;

      if ( typeof timeStr === "number" ) {
        return timeStr;
      }

      if ( typeof timeStr === "string" &&
            !validTimeFormat.test( timeStr ) ) {
        Popcorn.error( errorMessage );
      }

      digitPairs = timeStr.split( ":" );
      lastIndex = digitPairs.length - 1;
      lastPair = digitPairs[ lastIndex ];

      // Fix last element:
      if ( lastPair.indexOf( ";" ) > -1 ) {

        frameInfo = lastPair.split( ";" );
        frameTime = 0;

        if ( framerate && ( typeof framerate === "number" ) ) {
          frameTime = parseFloat( frameInfo[ 1 ], 10 ) / framerate;
        }

        digitPairs[ lastIndex ] = parseInt( frameInfo[ 0 ], 10 ) + frameTime;
      }

      firstPair = digitPairs[ 0 ];

      return {

        1: parseFloat( firstPair, 10 ),

        2: ( parseInt( firstPair, 10 ) * 60 ) +
              parseFloat( digitPairs[ 1 ], 10 ),

        3: ( parseInt( firstPair, 10 ) * 3600 ) +
            ( parseInt( digitPairs[ 1 ], 10 ) * 60 ) +
              parseFloat( digitPairs[ 2 ], 10 )

      }[ digitPairs.length || 1 ];
    }
  };


  // Initialize locale data
  // Based on http://en.wikipedia.org/wiki/Language_localisation#Language_tags_and_codes
  function initLocale( arg ) {

    var locale = typeof arg === "string" ? arg : [ arg.language, arg.region ].join( "-" ),
        parts = locale.split( "-" );

    // Setup locale data table
    return {
      iso6391: locale,
      language: parts[ 0 ] || "",
      region: parts[ 1 ] || ""
    };
  }

  // Declare locale data table
  var localeData = initLocale( global.navigator.userLanguage || global.navigator.language );

  Popcorn.locale = {

    // Popcorn.locale.get()
    // returns reference to privately
    // defined localeData
    get: function() {
      return localeData;
    },

    // Popcorn.locale.set( string|object );
    set: function( arg ) {

      localeData = initLocale( arg );

      Popcorn.locale.broadcast();

      return localeData;
    },

    // Popcorn.locale.broadcast( type )
    // Sends events to all popcorn media instances that are
    // listening for locale events
    broadcast: function( type ) {

      var instances = Popcorn.instances,
          length = instances.length,
          idx = 0,
          instance;

      type = type || "locale:changed";

      // Iterate all current instances
      for ( ; idx < length; idx++ ) {
        instance = instances[ idx ];

        // For those instances with locale event listeners,
        // trigger a locale change event
        if ( type in instance.data.events  ) {
          instance.trigger( type );
        }
      }
    }
  };

  // alias for exec function
  Popcorn.p.cue = Popcorn.p.exec;

  function getItems() {

    var item,
        list = [];

    if ( Object.keys ) {
      list = Object.keys( Popcorn.p );
    } else {

      for ( item in Popcorn.p ) {
        if ( hasOwn.call( Popcorn.p, item ) ) {
          list.push( item );
        }
      }
    }

    return list.join( "," ).toLowerCase().split( ",");
  }

  //  Protected API methods
  Popcorn.protect = {
    natives: getItems()
  };

  //  Exposes Popcorn to global context
  global.Popcorn = Popcorn;

})(window, window.document);
/*!
 * Popcorn.sequence
 *
 * Copyright 2011, Rick Waldron
 * Licensed under MIT license.
 *
 */

/* jslint forin: true, maxerr: 50, indent: 4, es5: true  */
/* global Popcorn: true */

// Requires Popcorn.js
(function( global, Popcorn ) {

  // TODO: as support increases, migrate to element.dataset
  var doc = global.document,
      location = global.location,
      rprotocol = /:\/\//,
      // TODO: better solution to this sucky stop-gap
      lochref = location.href.replace( location.href.split("/").slice(-1)[0], "" ),
      // privately held
      range = function(start, stop, step) {

        start = start || 0;
        stop = ( stop || start || 0 ) + 1;
        step = step || 1;

        var len = Math.ceil((stop - start) / step) || 0,
            idx = 0,
            range = [];

        range.length = len;

        while (idx < len) {
         range[idx++] = start;
         start += step;
        }
        return range;
      };

  Popcorn.sequence = function( parent, list ) {
    return new Popcorn.sequence.init( parent, list );
  };

  Popcorn.sequence.init = function( parent, list ) {

    // Video element
    this.parent = doc.getElementById( parent );

    // Store ref to a special ID
    this.seqId = Popcorn.guid( "__sequenced" );

    // List of HTMLVideoElements
    this.queue = [];

    // List of Popcorn objects
    this.playlist = [];

    // Lists of in/out points
    this.inOuts = {

      // Stores the video in/out times for each video in sequence
      ofVideos: [],

      // Stores the clip in/out times for each clip in sequences
      ofClips: []

    };

    // Store first video dimensions
    this.dims = {
      width: 0, //this.video.videoWidth,
      height: 0 //this.video.videoHeight
    };

    this.active = 0;
    this.cycling = false;
    this.playing = false;

    this.times = {
      last: 0
    };

    // Store event pointers and queues
    this.events = {

    };

    var self = this,
        clipOffset = 0;

    // Create `video` elements
    Popcorn.forEach( list, function( media, idx ) {

      var video = doc.createElement( "video" );

      video.preload = "auto";

      // Setup newly created video element
      video.controls = true;

      // If the first, show it, if the after, hide it
      video.style.display = ( idx && "none" ) || "" ;

      // Seta registered sequence id
      video.id = self.seqId + "-" + idx ;

      // Push this video into the sequence queue
      self.queue.push( video );

      var //satisfy lint
       mIn = media["in"],
       mOut = media["out"];

      // Push the in/out points into sequence ioVideos
      self.inOuts.ofVideos.push({
        "in": ( mIn !== undefined && mIn ) || 1,
        "out": ( mOut !== undefined && mOut ) || 0
      });

      self.inOuts.ofVideos[ idx ]["out"] = self.inOuts.ofVideos[ idx ]["out"] || self.inOuts.ofVideos[ idx ]["in"] + 2;

      // Set the sources
      video.src = !rprotocol.test( media.src ) ? lochref + media.src : media.src;

      // Set some squence specific data vars
      video.setAttribute("data-sequence-owner", parent );
      video.setAttribute("data-sequence-guid", self.seqId );
      video.setAttribute("data-sequence-id", idx );
      video.setAttribute("data-sequence-clip", [ self.inOuts.ofVideos[ idx ]["in"], self.inOuts.ofVideos[ idx ]["out"] ].join(":") );

      // Append the video to the parent element
      self.parent.appendChild( video );


      self.playlist.push( Popcorn("#" + video.id ) );

    });

    self.inOuts.ofVideos.forEach(function( obj ) {

      var clipDuration = obj["out"] - obj["in"],
          offs = {
            "in": clipOffset,
            "out": clipOffset + clipDuration
          };

      self.inOuts.ofClips.push( offs );

      clipOffset = offs["out"] + 1;
    });

    Popcorn.forEach( this.queue, function( media, idx ) {

      function canPlayThrough( event ) {

        // If this is idx zero, use it as dimension for all
        if ( !idx ) {
          self.dims.width = media.videoWidth;
          self.dims.height = media.videoHeight;
        }

        media.currentTime = self.inOuts.ofVideos[ idx ]["in"] - 0.5;

        media.removeEventListener( "canplaythrough", canPlayThrough, false );

        return true;
      }

      // Hook up event listeners for managing special playback
      media.addEventListener( "canplaythrough", canPlayThrough, false );

      // TODO: consolidate & DRY
      media.addEventListener( "play", function( event ) {

        self.playing = true;

      }, false );

      media.addEventListener( "pause", function( event ) {

        self.playing = false;

      }, false );

      media.addEventListener( "timeupdate", function( event ) {

        var target = event.srcElement || event.target,
            seqIdx = +(  (target.dataset && target.dataset.sequenceId) || target.getAttribute("data-sequence-id") ),
            floor = Math.floor( media.currentTime );

        if ( self.times.last !== floor &&
              seqIdx === self.active ) {

          self.times.last = floor;

          if ( floor === self.inOuts.ofVideos[ seqIdx ]["out"] ) {

            Popcorn.sequence.cycle.call( self, seqIdx );
          }
        }
      }, false );
    });

    return this;
  };

  Popcorn.sequence.init.prototype = Popcorn.sequence.prototype;

  //
  Popcorn.sequence.cycle = function( idx ) {

    if ( !this.queue ) {
      Popcorn.error("Popcorn.sequence.cycle is not a public method");
    }

    var // Localize references
    queue = this.queue,
    ioVideos = this.inOuts.ofVideos,
    current = queue[ idx ],
    nextIdx = 0,
    next, clip;


    var // Popcorn instances
    $popnext,
    $popprev;


    if ( queue[ idx + 1 ] ) {
      nextIdx = idx + 1;
    }

    // Reset queue
    if ( !queue[ idx + 1 ] ) {

      nextIdx = 0;
      this.playlist[ idx ].pause();

    } else {

      next = queue[ nextIdx ];
      clip = ioVideos[ nextIdx ];

      // Constrain dimentions
      Popcorn.extend( next, {
        width: this.dims.width,
        height: this.dims.height
      });

      $popnext = this.playlist[ nextIdx ];
      $popprev = this.playlist[ idx ];

      // When not resetting to 0
      current.pause();

      this.active = nextIdx;
      this.times.last = clip["in"] - 1;

      // Play the next video in the sequence
      $popnext.currentTime( clip["in"] );

      $popnext[ nextIdx ? "play" : "pause" ]();

      // Trigger custom cycling event hook
      this.trigger( "cycle", {

        position: {
          previous: idx,
          current: nextIdx
        }

      });

      // Set the previous back to it's beginning time
      // $popprev.currentTime( ioVideos[ idx ].in );

      if ( nextIdx ) {
        // Hide the currently ending video
        current.style.display = "none";
        // Show the next video in the sequence
        next.style.display = "";
      }

      this.cycling = false;
    }

    return this;
  };

  var excludes = [ "timeupdate", "play", "pause" ];

  // Sequence object prototype
  Popcorn.extend( Popcorn.sequence.prototype, {

    // Returns Popcorn object from sequence at index
    eq: function( idx ) {
      return this.playlist[ idx ];
    },
    // Remove a sequence from it's playback display container
    remove: function() {
      this.parent.innerHTML = null;
    },
    // Returns Clip object from sequence at index
    clip: function( idx ) {
      return this.inOuts.ofVideos[ idx ];
    },
    // Returns sum duration for all videos in sequence
    duration: function() {

      var ret = 0,
          seq = this.inOuts.ofClips,
          idx = 0;

      for ( ; idx < seq.length; idx++ ) {
        ret += seq[ idx ]["out"] - seq[ idx ]["in"] + 1;
      }

      return ret - 1;
    },

    play: function() {

      this.playlist[ this.active ].play();

      return this;
    },
    // Attach an event to a single point in time
    exec: function ( time, fn ) {

      var index = this.active;

      this.inOuts.ofClips.forEach(function( off, idx ) {
        if ( time >= off["in"] && time <= off["out"] ) {
          index = idx;
        }
      });

      //offsetBy = time - self.inOuts.ofVideos[ index ].in;

      time += this.inOuts.ofVideos[ index ]["in"] - this.inOuts.ofClips[ index ]["in"];

      // Creating a one second track event with an empty end
      Popcorn.addTrackEvent( this.playlist[ index ], {
        start: time - 1,
        end: time,
        _running: false,
        _natives: {
          start: fn || Popcorn.nop,
          end: Popcorn.nop,
          type: "exec"
        }
      });

      return this;
    },
    // Binds event handlers that fire only when all
    // videos in sequence have heard the event
    listen: function( type, callback ) {

      var self = this,
          seq = this.playlist,
          total = seq.length,
          count = 0,
          fnName;

      if ( !callback ) {
        callback = Popcorn.nop;
      }

      // Handling for DOM and Media events
      if ( Popcorn.Events.Natives.indexOf( type ) > -1 ) {
        Popcorn.forEach( seq, function( video ) {

          video.listen( type, function( event ) {

            event.active = self;

            if ( excludes.indexOf( type ) > -1 ) {

              callback.call( video, event );

            } else {
              if ( ++count === total ) {
                callback.call( video, event );
              }
            }
          });
        });

      } else {

        // If no events registered with this name, create a cache
        if ( !this.events[ type ] ) {
          this.events[ type ] = {};
        }

        // Normalize a callback name key
        fnName = callback.name || Popcorn.guid( "__" + type );

        // Store in event cache
        this.events[ type ][ fnName ] = callback;
      }

      // Return the sequence object
      return this;
    },
    unlisten: function( type, name ) {
      // TODO: finish implementation
    },
    trigger: function( type, data ) {
      var self = this;

      // Handling for DOM and Media events
      if ( Popcorn.Events.Natives.indexOf( type ) > -1 ) {

        //  find the active video and trigger api events on that video.
        return;

      } else {

        // Only proceed if there are events of this type
        // currently registered on the sequence
        if ( this.events[ type ] ) {

          Popcorn.forEach( this.events[ type ], function( callback, name ) {
            callback.call( self, { type: type }, data );
          });

        }
      }

      return this;
    }
  });


  Popcorn.forEach( Popcorn.manifest, function( obj, plugin ) {

    // Implement passthrough methods to plugins
    Popcorn.sequence.prototype[ plugin ] = function( options ) {

      // console.log( this, options );
      var videos = {}, assignTo = [],
      idx, off, inOuts, inIdx, outIdx, keys, clip, clipInOut, clipRange;

      for ( idx = 0; idx < this.inOuts.ofClips.length; idx++  ) {
        // store reference
        off = this.inOuts.ofClips[ idx ];
        // array to test against
        inOuts = range( off["in"], off["out"] );

        inIdx = inOuts.indexOf( options.start );
        outIdx = inOuts.indexOf( options.end );

        if ( inIdx > -1 ) {
          videos[ idx ] = Popcorn.extend( {}, off, {
            start: inOuts[ inIdx ],
            clipIdx: inIdx
          });
        }

        if ( outIdx > -1 ) {
          videos[ idx ] = Popcorn.extend( {}, off, {
            end: inOuts[ outIdx ],
            clipIdx: outIdx
          });
        }
      }

      keys = Object.keys( videos ).map(function( val ) {
                return +val;
              });

      assignTo = range( keys[ 0 ], keys[ 1 ] );

      //console.log( "PLUGIN CALL MAPS: ", videos, keys, assignTo );
      for ( idx = 0; idx < assignTo.length; idx++ ) {

        var compile = {},
        play = assignTo[ idx ],
        vClip = videos[ play ];

        if ( vClip ) {

          // has instructions
          clip = this.inOuts.ofVideos[ play ];
          clipInOut = vClip.clipIdx;
          clipRange = range( clip["in"], clip["out"] );

          if ( vClip.start ) {
            compile.start = clipRange[ clipInOut ];
            compile.end = clipRange[ clipRange.length - 1 ];
          }

          if ( vClip.end ) {
            compile.start = clipRange[ 0 ];
            compile.end = clipRange[ clipInOut ];
          }

          //compile.start += 0.1;
          //compile.end += 0.9;

        } else {

          compile.start = this.inOuts.ofVideos[ play ]["in"];
          compile.end = this.inOuts.ofVideos[ play ]["out"];

          //compile.start += 0.1;
          //compile.end += 0.9;

        }

        // Handling full clip persistance
        //if ( compile.start === compile.end ) {
          //compile.start -= 0.1;
          //compile.end += 0.9;
        //}

        // Call the plugin on the appropriate Popcorn object in the playlist
        // Merge original options object & compiled (start/end) object into
        // a new fresh object
        this.playlist[ play ][ plugin ](

          Popcorn.extend( {}, options, compile )

        );

      }

      // Return the sequence object
      return this;
    };

  });
})( this, Popcorn );
(function( Popcorn ) {
  document.addEventListener( "DOMContentLoaded", function() {

    //  Supports non-specific elements
    var dataAttr = "data-timeline-sources",
        medias = document.querySelectorAll( "[" + dataAttr + "]" );

    Popcorn.forEach( medias, function( idx, key ) {

      var media = medias[ key ],
          hasDataSources = false,
          dataSources, data, popcornMedia;

      //  Ensure that the DOM has an id
      if ( !media.id ) {

        media.id = Popcorn.guid( "__popcorn" );
      }

      //  Ensure we're looking at a dom node
      if ( media.nodeType && media.nodeType === 1 ) {

        popcornMedia = Popcorn( "#" + media.id );

        dataSources = ( media.getAttribute( dataAttr ) || "" ).split( "," );

        if ( dataSources[ 0 ] ) {

          Popcorn.forEach( dataSources, function( source ) {

            // split the parser and data as parser!file
            data = source.split( "!" );

            // if no parser is defined for the file, assume "parse" + file extension
            if ( data.length === 1 ) {

              // parse a relative URL for the filename, split to get extension
              data = source.match( /(.*)[\/\\]([^\/\\]+\.\w+)$/ )[ 2 ].split( "." );

              data[ 0 ] = "parse" + data[ 1 ].toUpperCase();
              data[ 1 ] = source;
            }

            //  If the media has data sources and the correct parser is registered, continue to load
            if ( dataSources[ 0 ] && popcornMedia[ data[ 0 ] ] ) {

              //  Set up the media and load in the datasources
              popcornMedia[ data[ 0 ] ]( data[ 1 ] );

            }
          });

        }

        //  Only play the media if it was specified to do so
        if ( !!popcornMedia.autoplay ) {
          popcornMedia.play();
        }

      }
    });
  }, false );

})( Popcorn );// PLUGIN: Attribution

(function( Popcorn ) {

  /**
   * Attribution popcorn plug-in
   * Adds text to an element on the page.
   * Options parameter will need a mandatory start, end, target.
   * Optional parameters include nameofwork, NameOfWorkUrl, CopyrightHolder, CopyrightHolderUrl, license & licenseUrl.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Target is the id of the document element that the text needs to be attached to, this target element must exist on the DOM
   * nameofwork is the title of the attribution
   * NameOfWorkUrl is a url that provides more details about the attribution
   * CopyrightHolder is the name of the person/institution that holds the rights to the attribution
   * CopyrightHolderUrl is the url that provides more details about the copyrightholder
   * license is the type of license that the work is copyrighted under
   * LicenseUrl is the url that provides more details about the ticense type
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .attribution({
          start: 5, // seconds
          end: 15, // seconds
          target: 'attributiondiv'
        } )
   *
   */
  Popcorn.plugin( "attribution" , (function() {

    var
    common = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAfCAYAAABjyArgAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAEZ0FNQQAAsY58+1GTAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAA",
    licenses = {
      "cc-by": common + "eeSURBVHja7JpfbNvGHce/R9JBU9Qa89QN2gD5TepLmGTJYyyte9mypiSC7aXrIj8NqDFI6lavLezISpwuE5LJwpACw7aaWJ8L0/kD7B8iyi2wRXYiGikgvUkPNbY+ybXbh5l/bg8kT6RlO7Zjq2maM0488e4o8sPv/e53vzOhlEYIIZ/hadr3RCklBAAFgNt/vwWO48BxHHieB8fx4DkOHO8dOQ6EcOAIASEEIMS/CigoqEPhUAeO42bbtt2jY8O2HTiOzeoc6rD2lFL/Zlj5SUg/fvknAAACgPpweZ53M8d3yzzv1nG8B5mAEC7I14PjgXVcmLbt5WDZDkN2HIeBDYJ+kiALAMJweQFC6Ojmm3O3UKlUUKvVsLa6FrrQYGQQp06dQup7Kbx09kewHR4cZ7kvxOZAQLx3GRg+DnVHArwxRPYH7v2FOrQPNDQajdD5RCIB+ZyM4yeP9RUyAUD/duevEASBQRUEwc28gKo+j+KVIpaXl3d0wWg0irG3xjA8fBqWbcO2LViWl20LlmUzhW+m5L2q+L//+RTXy9fRbDQBAMlkEpIkAQAMw4Cu6wCAeCKO0cwovvmt5/uiYAKA/rP6Dwi80AUrDGBAEJCfmIQ2q7EOoihClmXEYjEMDw8DAKrVKtrtNjRNw8rKCmsrKzJ+NfZLHH72MCzLgmlZsCwTlmWFTYYP2PFs+R5s8eernyMzmsXq6ipkWUapVEIsFgu1abfbyOVy0DQNkUgEl4uXDxwyA3znwzsY8MEOCBgQBkJwRVFENptFJpOBKIpbXlBVVeRyOQY6nojjT+/9Ec8cPgzLMmGaJlPyppDp3gBPvHkBzUYT6XQaMzMz3eHpmaDg9VRVxcjICOKJOC5duXjggDkA4D0bLPA8BD6sXEmSUK/Xkc/nt4ULAOl0Gq1Wiw3NZqOJq8VrIVvOMY+EdLP3txHMTm1us9GELMsYe+ONh7ZPp9OQZRnNRhP3F+oHbiY4AOB8t4znUdXnQ3ArlUrPcNsuiaKISqXCIGuzGqrVefC8sDlkznf7EIK806R94N5rqVRC4oUXNvqhm46GUqkU6nvggF0FuyouXikyUDMzMw9V7XaQ/b7F3xQ9X9qDSzyfmvM8DIIuZLI7yI1GA8lkskcEIyMjbISMjIyE6mKxGJLJZI+ncXAK9h7+5twt5i1ks1mmwr0kURSZUpaXl3Hzxi22YHEhb20idps2u09VVTctb9fnwAD7aqpUKgxOJpNhjXRdh6IoSKVSSKVSKBQKW9ZNT0+H7J2v4sqdSkC9XdNAyKOZiMc9uQsNQsARglqt5rpYsszA6LqOVCoV6qTrOnRdRyaTgaIoPXVLS0tsNpdlGaqqolaruSvAAFigC7frle/+IQzD2HQy85WbTqd31OcAFew+qL9CO3r0KGuQy+WY3Wq1WmzSO3/+PFOyJElotVqYnZ0N+cgAWHltda1rDtjR57p3E5FIJKDrOtrtduh80F0Lln2fWNd1JBKJ/ih44+QStE/+m06n04jFYgy0P5H4KvXrZFnumVC67hf72LcHkM/JaEw1kMvlMDs7u6M+vmjkc3J/FPxVTsdPHkM8EYemaT3ewlZwNU1DPBHvS1yC84MtQX8xaJ98NauqipWVFRiGgaGhIRQKha6v6y2Tg3XB4dj1S9nHvj7Er98eQyQSgaqqUBSF/WbQD26321AUBdPT04hEIhjNjPZvkvNvZDAyiLXVNSwtLbEG+Xye3fSRI0dC4Pw6wzB66vzkX2swMghKA8thUPjv1Pu254d4LvIcyten8dt3itA0DZqmQZIkSJIEURSh6zoTTT+DPWzevnvvLg4dOoTChQK0WQ2iKKLT6YQ8g3K5zGIMyWQS+XyeqbdcLrO2wToAGBoaQrvdxovffxHXSlfxv/V1mOY6TMuEaVqw/biEY8OxHRaE32vo8nEKV7Jgz78X/4WBgUP4aP4jZH6RYcvJbDb7SD/gB1YAYOqdKfzwzA+wbq5j3TRhmSZMawPgRwj4PK4Bdw4A29JJpoYRjUYBAIVCocf12U1aWVlhs3U0GvUC8X5o0oHj2WLfXDypiQMAhzqwbXcf7dLliwyQoiihGO9u4KZSKdZ37M0xL8BudyEHQpRskqVP1pYRm9wB0PH8OF24X6PGgzp99Wev+lM9lSSJ1ut1utPUarWoJEmsv6zI1HhQpwv3a/Ti5Yvs/Ncod79kX8/QxfoCNT42qKzI7LwoinRycpJ2Op0twXY6HTo5OUlFUWT9Tp46SZc+NuiisUDH8+NfR7i0Z/U/kR/Hy4oMQRBwrXgN7//l/T1vGRUuTcKyLNy9W8NrP3/t4IdiwLwEdzOCq9SN3/tmIoJ5Ij/uKvlBnb6n/plGo9Edv7FoNErLvy9T40GdLhoL9N0/vNs3tVBKty0Hz31pCvZT9vUMXvnpK2wXQq9UcWPuxrbb9mfls0gmh9le29zcDUwVpvqnlE0U/GUq96EBwuMnjmEifwHf/k40sBsRDDci5Lf6/3iy/Mkn+N3VEuar8/0digGIj4Np2HEE9vTwaZx56QxOfPcEvhGJhGO4nmv12eoq7i3ew+2bt/sO9iur4KdpHwBTSp8lhHzxFMWBjCjy/wEATHqgDqiBjQoAAAAASUVORK5CYII=",
      "cc-by-sa": common + "j2SURBVHja7FpLbBvHGf72IaMyInZ9SgKqiHQTdfH6eUossmlTuI7tZS27dtzUpA8NGqMgldpy2kiiKFupo9qh2MIx2iYS4/QaaP0CGqcwV2qAWpRtUnAA6kYGkFDnJIVKAVvc3elhd4e7FPWgHkHj+BeGOzuPf3e/+eaff/4RQwhxMQzzFZ7ImgshhGEAEAC4cfM6WJYFy7LgOA4sy4FjWbCceWVZMAwLlmHAMAzAMJYWEBAQnUAnOnTdSJqmGVddg6bp0HWN1ulEp+0JIdbL0PzjIAf3HwIAMACIBS7HcUZiuVKe44w6ljNBZsAwrB1fExwTWN0AU9PMZM9rTpB1XafA2oF+nEDmATjB5XjwjquRrl25jmQyiVQqhdnCrENRnasOO3fuhO+HPuzd9zI0nQPLqsaAaCwYMOZY2qaPToyZAHMOMYuDe28sDfljGdls1lHu8XggHZCwdceWVYGxXvoZAOSTW/8Az/MUVJ7njcTxGFZG0HeuD1NTU8tS6Ha70f67drS07IKqadA0FapqJk2FqmqU4ZWYXM7iB//5EhfjFzGRnQAAeL1eiKIIAMhkMlAUBQDQ5GnCidAJPPPs01UBsJ76D+4/ZAD8z+FPwXN8CVi+BjU8j0hnN+QhmXYQBAGSJKGhoQEtLS0AgOHhYeTzeciyjJmZGdpW8ks42f5b1G6shaqqKKoqVLUIVVWdJsMCWDdtuQ3orwtfI3QijEKhAEmSEIvF0NDQ4PiIfD6PtrY2yLIMl8uF3r7eZYOw3vopwLf+dQs1FrA1PGr4Gge4giAgHA4jFApBEIQFFSYSCbS1tVGgmzxNeH/gb/hebS1UtYhisUiZXBHkMnvc+WYXJrITCAQCGBwcLE0707TYmZ5IJBAMBtHkacKZcz3LAqCS/snJSUxNThqzsb4e9fX1K9Z/cP8hsADAmTaY5zjwnJO5oiginU4jEoksCi4ABAIB5HI5OsUmshM433fBYctZ6pEwpWT+2QG8N5bGRHYCkiSh/dSpJT8mEAhAkiRMZCdwbyy9LJtbrv/vly/D+/wLOHr4CI4ePgLv8y/g05s3V6TfEhYAWMst4zgMKyMOcJPJ5Lxps5gIgoBkMklBlodkDA+PgOP4yiCzltsHB8jyx8Y7xGIxeJqby/3LigtiLBZz9F1MyvWP3r6N7q4I6p95Fl6vDwdaWwEAv/7Va/hTf3/V+h0AGww2WNx3ro8CNTg4uCRrFwPZ6tv3hz7TlzbBZUyfmjU9DAYlkM3pn81m4fV65w1uMBikzA8Gg466hoYGeL3eeZ5AJbHrLxQKyKbvAwD2Sz/D+4kBvHP+j3irq9MwDwODVet3Mtj8+GtXrlNvIRwOUxauRARBoCM+NTWFa1ev0w2LAfLCJsKSSs9PJBIV84v1WUjsbXvfNYj11w8/oGU/fuklAEChUMCXDx5UrZ8CbLEpmUxScEKhEG2kKAr8fj98Ph98Ph+i0eiCdf3mdLLslsXi5K2kjb0l08AwlU3ENykulwvxeBwbXXW4dOlSxTYPHz5akW5jo8EwYBkGqVTKcLEkiQKjKAp8Pp+jk6IoUBQFoVAIfr9/Xt34+DhdlSVJQiKRQCqVMnaANmCBErglr7ykK5PJVFzMLOYGAoF59ZX6LCT2tjU8j/aTJ7GxtpaWjd6+TfPPNTxXtX4bg40PtXZomzdvpg3a2tqo/cnlcnTRO3bsGGWyKIrI5XIYGhpy+MgAaH62MFsyB/Rq4TrfRHg8HiiKgnw+7yi3u2v2vOWzKooCj8ez5IeX65+cnER3VwSv/PwwenvOoLfnDLo6OgAAp06frlq/A2D74lJuZ6wRCwQC1MjncjkEAgFaZ20+JEmidfaFp+R+0Z8lX0w6IDkGeDlitbX6VqM/ePw4gsePGwM3MIDBgQE8evgIe/a+jCNHX6lav8NE/D/K1h1b0ORpgizLCAaD89haCVxZltHkaVpW3KCS/re6OvGT3bvxxRcGq5ubm6mLWK1+J4OJc1dktzMWmxOJBGZmZpDJZNDY2IhoNFrydc1tsr3OPm1L/iv9WdbLnf59O1wuFxKJBPx+P9Vl94Pz+Tz8fj/6+/vhcrlwInRi2R9fSf/2HdtxoLUVB1pb4WluXpV+ymDrhetcdZgtzGJ8fJw2iEQi9OGbNm1yAGfVZTKZeXWWWLrqXHUgxLYdBoE1pubdvJd7yvUU4hf78c7bfZBlGbIsQxRFiKIIQRCgKAolw0qCMeutn67bo3dHsWHDBkS7opCHZAiCgOnpaYdnEI/HaYzB6/UiEolQ9sbjcdrWXgcAjY2NyOfzePFHL+JC7Dwezc2hWJxDUS2iWFShWXEJXYOu6TQIX75T+zaGK2mw5/adf6OmZgM+G/kMod+E6LYwHA6v6qWtAAkAnH37LH66ZzfminOYKxahFosoqmUAVwj4fNsD7iwAeqTj9bXA7XYDAKLR6DwXqRqZmZmhq67b7TYD8VZoUodu2mLLXDyuwgKATnRomnGOdqa3hwLk9/sdMd5qwPX5fLRv+5vtZoBdK4FsC1HSRZY8XkdGdHEHQDoiHWTsXopk7qfJq7981VrqiSiKJJ1Ok+VKLpcjoijS/pJfIpn7aTJ2L0V6ento+XcolW7Cb4TInfQYyXyeIZJfouWCIJDu7m4yPT29ILDT09Oku7ubCIJA++3YuYOMf54hdzJjpCPS8V0ElzDlTmlnpAP7/RJ4nseFvgv46PJHKz4yip7phqqqGB1N4fXXXl/5FLOZDftphn33WX6/Vs+w36/KRNhTZ6TDYPL9NBlIfEDcbveyR8ztdpP4n+Mkcz9N7mTGyHt/eW/VLCCELJq3l61W/1LPXDWDLQm/EcLRXxylpxBKchhXr1xd9Nh+n7QPXm8LPWu7cuUqzkbPrn6RqMCutWJu+TMqnfethsXMYvvWrdu2oDPShfofuG2nEfZwIxx+q/WPJ1OTk3j3fAwjwyNrswrbQFxr07DQsxZ75poBbMmull3Ys3cPtm3fhu+7XM4YrulafVUo4O6du7hx7caaAftNMXgpG7/uAD+RlQtDCNnIMMx/n0CxDhsMQpj/DQDwRbusfJXB0QAAAABJRU5ErkJggg==",
      "cc-by-nd": common + "grSURBVHja7FpNbBvHFf72R0YdROz6lBZsAQrogczFtB37aFF1AqR1bC1h2Jc0NXUqEKEgmTZqWkimaMupS9ilicJJA7fRojkHWvkH6B/MpRqgNSWLKzgAeSjAPURoe5IipYeKuzs97O5wl1xSFCWljeNnjHa5M/Ptzjdv3nvzxgwhJMAwzKd4KnsuhBCGAUAA4P4f74FlWbAsC47jwLIcOJYFy9lXlgXDsGAZBgzDAAzjoICAgJgEJjFhmlYxDMO6mgYMw4RpGrTOJCZtTwhxPobePwlyfvQCAIABQBxyOY6zCss17znOqmM5m2QGDMO6+bXJsYk1LTINwy7ue8NLsmmalFg30U8SyTwAL7kcD95ztcrd+XsoFosol8vY3Nj0AA0GBnHixAmMfHsEZ86+AsPkwLK6NSEGCwaMPZeu5WMSayXAXkNMd3KXFyuQP5RRrVY9zyORCMRzIo4eP7IrMvYLnwFA/vDg9+B5npLK87xVOB4lZQG5azmsrq72BBgMBjHx0wkMD5+EbhgwDB26bhdDh64bVMP9NLlVi//5j3/hVuEWatUaACAWiyEajQIAVFWFoigAgHAkjPHkOL729ed2RMB+4p8fvWAR/OfSn8BzfJNYfgADPI/M1DTkOZl2EAQBoigiFApheHgYAFAqlaBpGmRZxvr6Om0rxkX8eOJHOPjMQei6joauQ9cb0HXdazIcgk3blruI/mzjMyTHU9jY2IAoisjn8wiFQp5BaJqGdDoNWZYRCARwNXe1ZxL2G58S/OAvDzDgEDvAY4Af8JArCAJSqRSSySQEQegIKEkS0uk0JTocCeM379/GVw4ehK430Gg0qCb7ktxij6feuoRatYZEIoHZ2dnmsrNNi1vTJUnC2NgYwpEwrly73BMBnfA7jW2n+OdHL4AFAM62wTzHgee8mhuNRlGpVJDJZLqSCwCJRAL1ep0usVq1huu5Gx5bztKIhGkW+5+bwOXFCmrVGkRRxMSbb247mEQiAVEUUavWsLxY6cnm7ie+IywAsE5YxnEoKQsecovFYtuy6SaCIKBYLFKS5TkZpdICOI73J5l1wj54SJY/tL4hn88j8vzzrfGlr0PM5/Oevt2kG34n2Qm+h2BLgy0tzl3LUaJmZ2e31dpuJDt9cz/P2bG0TS5jx9SsHWEwaJJsL/9qtYpYLNY2uWNjY1Tzx8bGPHWhUAixWKwtEvATP/xvhYZ8Sz/4Xg22B393/h6NFlKpFNXCfkQQBDrjq6uruHvnHt2wWCR3NhGO+L1fkiTf+259Oklr25deftm39IsPwIqDHW0qFouUnGQySRspioJCoUCdVywWQyaT8a0bHR1FKpWidstxesUHRbxy5rStvbZpMJskOyaC4H+30Xj31+/uOaa10WAYsAyDcrlshViiSJe3oigYGRnxdFIUBYqiIJlMIh6Pt9WtrKxQryyKIiRJQrlctnaArItUNMltRuVNLFVVfZ2No7mJRKKt3q9PJ2lt6zYHbvm7Vu8Ln5oIZ8DODu3w4cO0QTqdpvanXq9Tp3fx4kVks1m6bOr1Oubm5jwxMgB6v7mx2TQH9Orw2m4iIpEIFEWBpmme5+5wqjW00jQNiqIgEolsO3A//FMvvehb+sH3aLDbubTaGWfGEokEQqEQJdpxOI6WOnWiKLY5nmb4Rf9s+2HiORHVmSrS6TTm5uZ6GoyjDOI5sS/8927f3jN8jwb/P8rR40cQjoQhy3JbtNBp8LIsIxwJ95Q32G98L8HEuyty2xlHmyVJwvr6OlRVxdDQELLZbDPWtbfJ7jr3smrGr/RPTx/3k59NIBAIQJIkxONxiuWOgzVNQzwex82bNxEIBDCeHO958J3wW81Ov/jURDgfPBgYxObGJlZWVmiDTCZDX37o0CHPi506VVXb6hxxsAYDgyDEtR0GgTOn9q+2j3s28CwKt27iF2/nIMsyZFlGNBpFNBqFIAhQFIUqQz/JmP3Gp3774aOHOHDgALKXspDnZAiCgLW1tZ7CNFmWUSgUaFt3HQAMDQ1B0zScevEUbuSv4z9bW2g0ttDQG2g0dBhOXsI0YBomTcK37tS+iOlKmuz529JfMTBwAB8tfITkD5N0W+jEs/2KkyABgJm3Z/Dd09/BVmMLW40G9EYDDb2FYJ+Ezxc94c4CoEc6sZFhBINBAEA2m/W1Sb3K+vo69brBYNBOxDupSROmbYsdc/GkCgsAJjFhGNY52pWrlylB8Xjck+PdCbkjIyO078RbE3aC3WiS7EpRUidLnqwjI+rcAZDJzCRZXC4T9XGFvPb91xxXT6LRKKlUKqRXqdfrJBqN0v5iXCTq4wpZXC6Ty1cv0+dfotL8kXojSZYqi0T9WCViXKTPBUEg09PTZG1trSOxa2trZHp6mgiCQPsdP3GcrHyskiV1kUxmJr+M5BKmNSidykxiNC6C53ncyN3AB7/7oO8jo+yVaei6jocPy3j9B6/3v8RcZsN9muHefbb+3im+H5bfe/s2Ee4ylZm0NPlxhbwv/ZYEg8GeZywYDJLCrwpEfVwhS+oieee9d3atBYSQrvfuZ/3ib4fb7zuYTtuq1BtJvPq9V+kphFIs4c78na7H9mfFs4jFhulZ2/z8HcxkZ3bvJLpo0m40109j/a67eQ/Tbd969NgRTGUu4RvfDLpOI9zpRnjiVuc/nqx+8gl+eT2PhdLC3njhLgPdS4Ldk/m5EOzIyeGTOH3mNI69cAxfDQS8OVw7tPp0YwOPlh7h/t37e0bs563B+2GDeyL4qfQvDCHkGYZh/v2Uin3YYBDC/HcArOiX8zGX6zMAAAAASUVORK5CYII=",
      "cc-by-nc": common + "k0SURBVHja7FpdbNvWFf5IysFS1BrztA1yMBt7sQqskZMmy4Ytlta9LJ4TCnaCFkkWuQ812mCTlB+3S+3Iyk8TK/Zkb0iBYVstrCjahwZm/oDNGSLaKzBbTiIZaSM9rJCK2FiHDbArpwVmkbx7EHlF2pIty3axpjnGFX/uvR/J75577jnnmiGEWBmG+RSPZc2FEMIwAAgA3Bi+DpZlwbIsOI4Dy3LgWBYspx1ZFgzDgmUYMAwDMIyOAgICohKoRIWq5ouiKPmjqkBRVKiqQutUotL2hBD9Zej5oyD79u4HADAAiE4ux3H5wnKFc47L17GcRjIDhmGN/GrkaMSqeTIVRSvGc8VMsqqqlFgj0Y8SyRYAZnI5CyymY75cu3Id0WgUsVgMc9k5E1C1tRo7duyA68cuNO/5GRSVA8vK+QFRWDBgtLE0TB+V5GcCtDnELE3u3Yk4xMsiksmk6b7dbofQImDr9oZVkbFe+AwA8pdbf4bFYqGkWiyWfOEsGJFGEboQwvT0dFmANpsNHb/qQGPjLsiKAkWRIctaUWTIskI1vJgmL9TiT/75L1wauIRUMgUAcDqdcDgcAIBEIgFJkgAA9fZ6HPEewTe/9Y0VEbCe+Pv27s8T/NeRm7BwlgKxlipUWSwIdHVDHBJpB57nIQgCamtr0djYCAAYGRlBJpOBKIqYnZ2lbQW3gOMdx7DxiY2QZRk5WYYs5yDLstlk6ASrmi03EP0w+xDeIz5ks1kIgoBwOIza2lrTR2QyGfj9foiiCKvVinOhc2WTsN74lOBbf7uFKp3YKguqLFUmcnmeh8/ng9frBc/zJQEjkQj8fj8lut5ejz+8+Xt8beNGyHIOuVyOanJRkhfY465XTyGVTMHj8WBwcLAw7TTTYtT0SCSCtrY21NvrcebC6bIIKIX/m/5+jI+N4+1331kV/r69+8ECAKfZYAvHwcKZNdfhcCAejyMQCCxJLgB4PB6k02k6xVLJFHpDfSZbzlKPhCkU7c9I4N2JOFLJFARBQMeJE8t+jMfjgSAISCVTuDsRL8vmppIpbG1owA92ft9E7oVQCNdu3MArx09gamqqInxdWABgdbeM4zAijZrIjUaji6bNUsLzPKLRKCVZHBIxMjIKjrMUJ5nV3T6YSBYv598hHA7D/tRTC/3LogtiOBw29V1K9DafP/wMPefPw/nDH+GlF9vh9fvR3t6OkydPItTXi/GxsYrwTQTnNTivxaELIUrU4ODgslq7FMl639D5kOZLa+Qymk/Nah4GgwLJ2vRPJpNwOp2LBretrY1qfltbm6mutrYWTqdzkSdQTHT85uZm7Nu/H1NTU7g5PIzvfLsWn889xMFDB3H/ww/R0tpaEb5Zg7WPv3blOvUWfD4f1cJKhOd5OuLT09O4dvU6DVjyJJc2EboUe34kEil6vlSfUuJwOBDq68X5UA/efvcdtLS24qOPMwj19WLz5s2IvDmI5P37FeNTgnVtikajlByv10sbSZIEt9sNl8sFl8uFYDBYsq6/v99kF3Utjt6KGrS3YBoYpriJ+KLlezt3oqf3Ih48eICOY8fR8N2ncfm999C8uwkHnnseN4eHK8LNBxoMA5ZhEIvF8i6WIFBiJEmCy+UydZIkCZIkwev1wu12L6qbnJykq7IgCIhEIojFYvkI0EAsUCC34JUXsBKJRNHFTNdcj8ezqL5Yn1KysG02m8XN4WH09F6E534bmnc3AQDGx8YwPjaGmpoaMFWWSjQ4/6F6hLZlyxbawO/3U/uTTqfponf48GGqyQ6HA+l0GkNDQyYfGQA9n8vOFcwBPeq8LjYRdrsdkiQhk8mY7hvdKeO57rNKkgS73b7shxfDf+nFdpw7fQZbn96CA889j48+zqCltRU9vRdx4ODBFeGbCDYuLgvtjD7KHo+HGvl0Og2Px0Pr9OBDEARaZ1wYCu4X/Vn2xYQWwTTA5YjeVu+7Uvye3otoe+EFfPKff+Mf6TQGwmG8dqoLLa2tCJ49g4btz5SNbyb4/1C2bm9Avb0eoigu8hZKkSuKIurt9WXlDYrh19TU4LVTXTjmP4rmpib80ueD1WqtCN9MMDFHRUbbpGtzJBLB7OwsEokE6urqEAwGC76uFiYb64zTtuC/0p+yXu6Vkx2wWq2IRCJwu90Uy+gHZzIZuN1u9Pf3w2q14oj3SNkfXwr/2InjNIpbDT5d5PQXrrZWYy47h8nJSdogEAjQh2/atMlEnF6XSCQW1emiY1Vbq0GIIRwGgT6m2tWil3vS+iQGLvWj5/UQRFGEKIpwOBxwOBzgeR6SJFFlqCQZs974dN0evzOODRs2IHgqCHFIBM/zmJmZMXkGAwMDNMfgdDoRCASo9g4MDNC2xjoAqKurQyaTwbM/eRZ94V78d34eudw8cnIOuZwMRc9LqApURaVJ+IWR2pcxXUmTPWO3/46qqg14f/R9eH/hpWGhz+db1UvrCRIAOPv6Wexu+inmc/OYz+Ug53LIyQsILpLw+bIn3FkAdEvH6WqEzWYDAASDwUUu0kpkdnaWrtA2m01LxOupSRWqZot1c/GoCgsAKlGhKPl9tDPnTlOC3G63Kce7EnJdLhft2/Fqh5ZgVwokG1KUdJElj9aWEV3cAZDOQCeZuBsjiXtxcujnh/SlnjgcDhKPx0m5kk6nicPhoP0Ft0AS9+Jk4m6MnD53mt7/CpXChe+ol9yOT5DEBwkiuAV6n+d50t3dTWZmZkoSOzMzQ7q7uwnP87Tf9h3byeQHCXI7MUE6A51fRXIJs9Ap7Qp0Yq9bgMViQV+oD2/96a2Kt4yCZ7ohyzLGx2N4uf3lyqeYwWwYdzOM0efC65Xil8LSn10pNoqx3hXozGvyvTh5M/JHYrPZyh4xm81GBn47QBL34uR2YoK88bs3Vq0FhJAlz433KsVfDrfSZzClwirfUS8OHDxAdyGk6AiuXrm65Lb9HmEPnM5Gutd25cpVnA2eXf0iUUSD10JzF2KUOq5GmKXi1q3bGtAVOIWazTbDboQx3QiT36r/48n01BR+3RvG6Mjo2qzCC6bsWpmG5UzCUs9dE4J12dW4C03NTdj2zDZ83Wo153A11+rTbBZ3bt/BjWs31ozYL1qD18MGl0XwY1mFiSCEPMEwzGePqViHAIMQ5n8DAFb/49reYmyHAAAAAElFTkSuQmCC",
      "cc-by-nc-sa": common + "pvSURBVHja7FptbFPXGX7utYlGJzz/2yYHYYQ2xZFWHAq0dLSx161TS9NcLylfocNmWtuVdUlKCNvIl4FAY0Id91Ob1sRrV7VaqTBfaxc6fEPQ4sRJbEaL82OVjZKoVJvm4KCpxB/vflzfE9/EThxo1Y72lY7v8T3nPPfc57znPe95z+WISMNx3FV8JZ+6EBHHASAAON19CjzPg+d5qFQq8LwKKp4Hr0pfeR4cx4PnOHAcB3CcjAICgVKEFKWQSkkpmUxK11QSyWQKqVSSlaUoxeoTkdwZlr8V5JHyjQAADgDJ5KpUKinxqum8SiWV8ao0yRw4js/kN01OmtiURGYymU6Z+aSS5FQqxYjNJPpWIlkNQEmuSg214iqlk8dPwev1YmBgAJOxSQXQEs0SrF27FuYfmFH28ENIplTg+YQ0IEkeHLj0WGZMnxRJMwHpOcRJ5A77A/C87UEoFFLUNxgMECoErFpTktfLfVFwOAD017PvQq1WM1LVarWUVGr0iOfgeMaB8fHxvDqk0+lQ/5t6lJbei0QyiWQygUQinZIJJBJJpuGZmvzR+Ed4vuMFjIRGAAAmkwlGoxEAEAwGIYoiAKDIUISd1TvxrW9/M+vzr3z0MV50vfiFwHmkfKNE8Hs9Z6BWqaeJVS/CIrUazY0t8BzzsAZarRaCIECv16O0tBQA0NPTg0gkAo/Hg4mJCVZXsAioq9+FxbctRiKRQDyRQCIRRyKRUJoMSuFq9Cp++cRTiMViEAQBTqcTer1e0dlIJILa2lp4PB5oNBq0OlpnvdS12DVU76z5wuDIdpjO9p6l3r5z1Ofvo8Ggny68HyTBIlB68pJWq6WWlhaKRqM0l3R1dZFWq2XtigxFdL6vlwaDg+Qb7KPevnPk7T1LZ8Ruevdv79Dp7lN04p3jZDAYCABZrVYFnowz8xky9lvH/6xIRYairDgup5O2btp8Uzijo6Pk6+sjX18fjY6O5oUDgHgAUKVtsFqlglql1Fyj0YhAIIDm5mZotdo5zYPVakU4HGZTaSQ0gnbHEYUt55lHInkjfp8foVAIgiCgfvfueU2Q1WqFIAgYCY1g2B9Q2MqR0AhWlZTg7rvWsfvPdXTgGYcDJ0+fxp663RgbG8sLJ7M/f3r1VZjW34OqzVtQtXkLTOvvwZnu7jlxFOtNr6+XfIM+Gr4wRK7nXUxzjEbjvFqbTaLRKBmNRobjesFFw/8Ypv4hH5339ZL3vKTF77z3FzIUS9obDofzxg+HwwSADAYD0xZ5FhR957u0YpmeSr+/np74+WMEgFpaWujQwUMEgI6+9VZeOHJ/fH19Et6d6+hn221Uv6uOVizT04plenI5nTlxsmiwpMWOZxzM3nZ1dc2rtdlEq9XC6/Wyto5DjrQvndZgLu1T8zxCl0IwmUyzbJzNZmNabrPZFGV6vR4mk0mxsodCEk5ZWRke2bgRY2NjONPdjRXL9Pjv5DVse3QbLn3wASoqK/PC0ev1iMViCAUuAgDKhZ/gD+5OtLUfxt6mRgCAu7MrJ44svOym8bzkisneQk1NDZvqNyJarRZOpxMAMD4+jpMnTrENi0Qyx9y0bM9xu91Z87Jka2M0GuE40o5Djja8/uYbqKisxIeXI3AcacfSpUvh7uxC6NKlvHBkaX1WUrjf//EVdu9H998PAIjFYvj4ypWcOIxgWZu8Xi8jp7q6mlUSRREWiwVmsxlmsxl2uz1nWUdHh8JeylrsPevN0F4OHD9N8Gchd951F9raD2N0dBT1u+pQ8r3b8fbRoyh7cAOqNm9hNnQu0Wg0cLlcuE2zBC+//HLWOp98cn1ODGmjwXHgOQ4DAwOSiyUIjBhRFGE2mxWNRFGEKIqorq6GxWKZVXbhwgV0dXUxLLfbjYGBAWkHmCZWIpdjfmW2xUzWXKvVOqs8W5uZ92KxGM50d6Ot/TCsl2woe3ADAKDf50O/z4fCwkJwi9Rz4ixSq1FfV4fbFi9m9/p9PpZfpl+Wsz8ZGiy9sLxDW7lyJatQW1vL7Ew4HIbX64Ver8f27duZJhuNRoTDYRw7dkzhIwNg+cnYpPQccBlXoLi4GKIoIhKJKDomD9DMvOyDiqIIg8Gg2FnNxPnFY4+jdd9+rLp9Jao2b8GHlyOoqKxEW/thVG3blhfO2NgYWpqasXXTZrTu24/WffvR1NAAANi9Z0/O/igIBgfFdM20J/LIWK1WZszD4TCsVisrkzcfgiCwssyFhG0bOfYz7YxvqlQMZD4i1xUqhOmNTTqfidPWfhi2HTtw5d//wj/DYbicTuxtakRFZSXsB/ajZM3qeXFsO3bAtmOHNNCdnejq7MT1T65jQ9lD2FK1NWd/FCbi85R169fBUGyAx+OBzWabpa3ZyPV4PCgyFCniAKvWlKDIUKTAKSwsxN6mRnxt8WIMDw3hVzU1N4Szt6kRP37gAVy+LGl1cXExDMXFc+IoNZiUUaxMeyJrs9vtxsTEBILBIJYvXw673c7K5G1yZlnmdJ6Oj7IfRScaWxqh0WjgdrthsVhYm8woWyQSgcViQUdHBzQaDXZW75z1Mnt+W58VZ9fuOrz+5hs3hbN6zWpUVFaiorIShuLivHBYsMc/PICCggKsv/seTMYmYbVamSZ5PJ5ZC5lsMsrLy3OWye1ra2vR0dGBJZolOP/3XkxNTWEqPoV4Io54PCEFg5IJRP8zgYP2g8yXNBqNMBqN0Gq1EEWRDfp8QZprsWtoO+hgQZrPE4cFe/qH+lFQUAB7kx2eYx5otVpEo1GFZ+ByuVgwx2Qyobm5mQ2Ay+VidTPLAGD58uWIRCK474f34YizHdenphCfQbAcN04lU/D3+3Hs6K0RrmQE+wb7sGhRAc6fO4/qpyT/1+l0oibDZt2IuN1utgs7cPAAHtzwAKbiU5iKx5GIxxFPzCA4SwD+/z3gzgNgRzomcyl0Oh0AwG63z3KdFiITExNsddXpdOlAfPoUI5VCKm2LKX3kdKsKDwApSiGZlM7R9rfuYwRZLBZFjHch5JrNZta2/tf16QB7cprkjCMjtsjSrXVkxBZ3ANTQ3ED+4QEKXgzQoz99VBFRCwQCC4p0ZUbSBItAwYsB8g8P0L7Wfez+lyhN/6l5upoGA34K3kDAPRqNUktLiyLgvmbtGrrwfpAGg35qaG74MpJL3EyntLG5AeUWAWq1GkccR/Daq6/d8JGRfX8LEokE+vsH8OTjT+bzHUHGro9j9zJ3mTP/58LJ1UZ+Rr6Bplx9WhDGzNTY3CBp8sUAdbpfIZ1Ol/eI6XQ6cj3vouDFAA0G/fTS717Ku+3MY6KZ+cx78+HM1z4frGx1FooxS4NlqXm6GlXbqthRj+jtwYnjJ+Y8tn9YeBgmUyk70Dx+/AQO2A8s5EuYWdqyEM2dWTfXdYFf52TV3lz9zLqTy1W46o4SNDY3oXCpLuM0IjPcCIXfKn94Mj42hmfbnTjXc27BL3MzpmE+kzAX/kIHLV+MOQmW5d7Se7GhbAPuWH0HvqHRpD+dmjYwRISrsRiGBodw+uTpBRP7WWnwzdrg+daET43gr+QmNhpE9PWvaPiMNhhE3P8GAG3CFDKJWtqSAAAAAElFTkSuQmCC",
      "cc-by-nc-nd": common + "m8SURBVHja7FpdcBvVFf52pXgGplH11mbkDPbQdqy8oIQmMZRiufwMxRivJiHtFChyZwqUlMoiiWlaO5JCfkBNKqvhp30oUsswMCVMlL9CHRqt4xTLkmKtE7D8UMZisIf2pZLltDO1Vnv6sNprrS1bsgNDGjgz17vW3fvt3W/PPfe75y5HRCaO46bxhX3iRkQcB4AA4HT/KfA8D57nYTAYwPMGGHgevKF05HlwHA+e48BxHMBxGgoIBFIICilQFLUUi0X1qBRRLCpQlCKrU0hh1xOR1hl2fi3YAx3bAAAcANLINRgMauENc+cGg1rHG0okc+A4vpzfEjklYhWVzGKxVMrPi3qSFUVhxJYTfS2RbASgJ9dghFF3VMvJ46cQjUYRj8cxk5/RAa02rcamTZvQ+p1WtN9/H4qKATwvqy+kyIMDV3qXZcNHIXUkoDSGOJXckUQKkTcjSKfTuuutViuELQI2bFxf08NdLTgcAPrL2bdhNBoZqUajUS0GIwbEc/A/68fU1FRNHbJYLOje3Y2WltshF4soFmXIcqkUZchykXl4uSd/PPUxjvQ9j/H0OADAbrfDZrMBACRJgiiKAIAmaxO2u7bjq2u+UvH+//j4n3gh+MJVgfNAxzaV4HcGzsBoMM4Ra1yFVUYjPL1eRI5FWAOz2QxBENDQ0ICWlhYAwMDAADKZDCKRCHK5HLtWcAjY2b0D111/HWRZRkGWIcsFyLKsDxmkYDo7jZ8+/iTy+TwEQUAgEEBDQ4Ous5lMBm63G5FIBCaTCfv9+xc81OX8Zbi2d101OFocprODZ2lw6BwNJYYoKSVo9D2JBIdApcFLZrOZvF4vZbNZWspCoRCZzWbWrsnaROeHBikpJSmWHKLBoXMUHTxLZ8R+evuvb9Hp/lN04q3jZLVaCQA5nU4dnoYz/x4a9hvH/6QrTdamijjBQIB+8L3vXzHOYs+8GA4A4gHAUIrBRoMBRoPec202G1KpFDweD8xm85Lhwel0YmJigg2l8fQ4DvkP62I5zxSJqkYSsQTS6TQEQUD3rl1VQ5DT6YQgCBhPj2MkkdLFyvH0ODasX49bm29hv/+mrw/P+v04efo0nt65C5OTkzXhXGl/dPPNYGyQYskYjYxeoOCRIPMcm81W1WsrWTabJZvNxnCCzwdp5OIIDV+I0fnYIEXPq1781jt/Jus61XsnJiZqxp+YmCAAZLVambdoo6Dp69+gG29ooJZv3UaP//hRAkBer5cOHjhIAOjoG2/UhHOl/angwaoX+5/1s3gbCoWqem0lM5vNiEajrK3/oL+kpUsezJU0Nc8jPZaG3W5fEOM6OzuZl3d2durqGhoaYLfbdTN7Oq3itLe344Ft2zA5OYkz/f248YYG/GfmMh56+CGMvf8+tmzdWhNOeX++1tBYsSyFoxmvyTSeV6WYpha6urrYUF+Jmc1mBAIBAMDU1BROnjjFFiwqyRyTaZXuEw6HK55rVqmNzWaD//AhHPQ/h1dffw1btm7FBx9m4D98CGvXrkX45RDSY2M14ZTbXffcU7FUwwGg6mDNm6LRKCPH5XKxi0RRRDAYZCrBbrfD4/FUrOvo6EBXVxeLT263G7lcDtGzUdzX3lbyXg4cz4FTuE9N5G9ubsbm5mY82eXCkb4gzvT3482jR/Hm0aPY3NwM5486cdfdd9eE9dJvX1pxP9SFBseB5zjE43FVYgkCG96iKKK1tVXXSBRFiKIIl8sFh8OxoG50dBShUIhhhcNhxONxdQXIc2zoa4sPSZIqTh6a5zqdzgX1ldrM/y2fz+NMfz+eO/QrOMc60X5vGwBgOBbDcCyG+vp6cKuMVXHKw0G5/T0zsWR/yjxYfWBthXbTTTexC9xuN4sz0WgUmUwGnZ2deOSRR+Dz+djwOHbsGCRJgtvtZhoZAFpaWhAOhzGTn1HvA67sCKxbtw6iKCKTyejiXigUYgRrL6tcg4qiCKvVqltZzcf5yaOPYTgWw5G+IADggw8z6N6xE5uaN+OiNIo/hMP4cGqyKs4dd925pJdW6o9ORSSlBF0au8hm/Wg0ukCLer3eBbPnUnWaRaNRdt2lsYuUlJL0bvxdGvibSO8MnCGPbw8BIEEQFsWfb4KgavTdPbvZjL27Z/cCnI8++oj2+fbSmjVraPWXVlMwEKDp6ell41SzSjg6FfFZ2i233QLrOisikcgCtVDJtNVTk7VJlwfYsHE9mqxNOpz6+nr8ck8vdrifQntbG37W1QWTybRsnJX0R6ciQPosVnk80WbHcDiMXC4HSZLQ2NgIn8/H6rRlcnld+fCZy4+yP7pO9Hp7YTKZEA6H4XA4WJvyLFsmk4HD4UBfXx9MJhO2u7YveJinf9FdEWfHrp149fXXrhhnfliohsOSPYmROOrq6nDbrd/GTH4GTqeTxb1IJLJgItMmno6OjkXrtPZutxt9fX1YbVqN8+8OYnZ2FrOFWRTkAgoFWU0GFWVk/5XDAd8BpiVtNhtsNhvMZjNEUWQvvVqS5nL+Mp474GdJms8ShyV7hi8Mo66uDr49PkSORWA2m5HNZmuSaZFIBMFgkF1bXgcAjY2NyGQyuOPOO3A4cAj/nZ1FYR7BWt5YKSpIDCdw7Oi1ka5kBMeSQ1i1qg7nz52H60lV/wYCAaZnV2rhcJjFsX0H9uHetu9itjCL2UIBcqGAgjyP4AoJ+P/3hDsPgG3p2FtbYLFYAAA+n69i7KnVcrkck3gWi6WUiC/tYigKlFIsptKW07VqPAAopKBYVPfRntm/lxHkcDh0Od7lkNva2sradv+8u5RgL86RXLZlxCZZura2jNjkDoB6PD2UGImTdClFD//wYV1GLZVKLSuzVJ5JExwCSZdSlBiJ0979e9nvn6My90/XUy5KphIkrSDhns1myev16hLuGzdtpNH3JEpKCerx9HweySVuvijt9fSgwyHAaDTisP8wXvnjKyveMvI944UsyxgejuOJx56o5TuCOf1YyrQRlW2OVvh/MZzF2mj3qIaxFE6lflYNEeWl19OjevKlFL0c/j1ZLJaa35jFYqHgkSBJl1KUlBL04u9erLnt/OXx/PPy36rhVGtfC9YngbPAgzXresqFBx96kG31iNEBnDh+Yslt+/uF+2G3t7ANzePHT2Cfb99yvoRZ1DNq8dxKnlbpuJz+VMOphrkowQCw4eb16PXsQf1aS9luRHm6ETrdqn14MjU5iV8fCuDcwLnlfmp0RaGhWkhYDjGfFM6SBGt2e8vtaGtvw83fvBlfNplKn07NBRgiwnQ+jwvJCzh98vSyif20PPhqiME1EfyFrdw4Irqe47h/f0HFp7DAIOL+NwDFrtvhh4x87AAAAABJRU5ErkJggg=="
    },
    target;

    return {

      _setup: function( options ) {

        var attrib = "",
        license = options.license && licenses[ options.license.toLowerCase() ],
        tar = "target=_blank";

        // make a div to put the information into
        options._container = document.createElement( "div" );
        options._container.style.display = "none";

        // Cache declared target
        target = document.getElementById( options.target );

        if ( options.nameofworkurl ) {
          attrib += "<a href='" + options.nameofworkurl + "' " + tar + ">";
        }
        if ( options.nameofwork ) {
          attrib += options.nameofwork;
        }
        if ( options.nameofworkurl ) {
          attrib += "</a>";
        }
        if ( options.copyrightholderurl ) {
          attrib += "<a href='" + options.copyrightholderurl + "' " + tar + ">";
        }
        if ( options.copyrightholder ) {
          attrib += ", " + options.copyrightholder;
        }
        if ( options.copyrightholderurl ) {
          attrib += "</a>";
        }

        //if the user did not specify any parameters just pull the text from the tag
        if ( attrib === "" ) {
          attrib = options.text;
        }

        if ( options.license ) {
          if ( license ) {
            if ( options.licenseurl ) {
              attrib = "<a href='" + options.licenseurl + "' " + tar + "><img src='"+ license +"' border='0'/></a> " + attrib;
            } else {
              attrib = "<img src='"+ license +"' />" + attrib;
            }
          } else {
            attrib += ", license: ";

            if ( options.licenseurl ) {
              attrib += "<a href='" + options.licenseurl + "' " + tar + ">" + options.license + "</a> ";
            } else {
              attrib += options.license;
            }
          }
        } else if ( options.licenseurl ) {
          attrib += ", <a href='" + options.licenseurl + "' " + tar + ">license</a> ";
        }

        options._container.innerHTML  = attrib;

        if ( !target && Popcorn.plugin.debug ) {
          throw new Error( "target container doesn't exist" );
        }
        target && target.appendChild( options._container );
      },
      /**
       * @member attribution
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        options._container.style.display = "inline";
      },
      /**
       * @member attribution
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        options._container.style.display = "none";
      },
      _teardown: function( options ) {

        // Cache declared target
        target = document.getElementById( options.target );

        target && target.removeChild( options._container );
      }
    };
  })(),
  {
    about:{
      name: "Popcorn Attribution Plugin",
      version: "0.2",
      author: "@rwaldron",
      website: "github.com/rwldrn"
    },
    options:{
      start: {
       elem: "input",
       type: "text",
       label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      nameofwork: {
        elem: "input",
        type: "text",
        label: "Name of Work"
      },
      nameofworkurl: {
        elem: "input",
        type: "url",
        label: "Url of Work"
      },
      copyrightholder: {
        elem: "input",
        type: "text",
        label: "Copyright Holder"
      },
      copyrightholderurl: {
        elem: "input",
        type: "url",
        label: "Copyright Holder Url"
      },
      license: {
        elem: "input",
        type: "text",
        label: "License type"
       },
      licenseurl: {
        elem: "input",
        type: "url",
        label: "License URL"
      },
      target: "attribution-container"
    }
  });
})( Popcorn );
// PLUGIN: Code

(function ( Popcorn ) {

  /**
   * Code Popcorn Plug-in
   *
   * Adds the ability to run arbitrary code (JavaScript functions) according to video timing.
   *
   * @param {Object} options
   *
   * Required parameters: start, end, template, data, and target.
   * Optional parameter: static.
   *
   *   start: the time in seconds when the mustache template should be rendered
   *          in the target div.
   *
   *   end: the time in seconds when the rendered mustache template should be
   *        removed from the target div.
   *
   *   onStart: the function to be run when the start time is reached.
   *
   *   onFrame: [optional] a function to be run on each paint call
   *            (e.g., called ~60 times per second) between the start and end times.
   *
   *   onEnd: [optional] a function to be run when the end time is reached.
   *
   * Example:
     var p = Popcorn('#video')

        // onStart function only
        .code({
          start: 1,
          end: 4,
          onStart: function( options ) {
            // called on start
          }
        })

        // onStart + onEnd only
        .code({
          start: 6,
          end: 8,
          onStart: function( options ) {
            // called on start
          },
          onEnd: function ( options ) {
            // called on end
          }
        })

        // onStart, onEnd, onFrame
        .code({
          start: 10,
          end: 14,
          onStart: function( options ) {
            // called on start
          },
          onFrame: function ( options ) {
            // called on every paint frame between start and end.
            // uses mozRequestAnimationFrame, webkitRequestAnimationFrame,
            // or setTimeout with 16ms window.
          },
          onEnd: function ( options ) {
            // called on end
          }
        });
  *
  */

  Popcorn.plugin( "code" , function( options ) {
    var running = false;

    // Setup a proper frame interval function (60fps), favouring paint events.
    var step = (function() {

      var buildFrameRunner = function( runner ) {
        return function( f, options ) {

          var _f = function() {
            running && f();
            running && runner( _f );
          };

          _f();
        };
      };

      // Figure out which level of browser support we have for this
      if ( window.webkitRequestAnimationFrame ) {
        return buildFrameRunner( window.webkitRequestAnimationFrame );
      } else if ( window.mozRequestAnimationFrame ) {
        return buildFrameRunner( window.mozRequestAnimationFrame );
      } else {
        return buildFrameRunner( function( f ) {
          window.setTimeout( f, 16 );
        });
      }

    })();

    if ( !options.onStart || typeof options.onStart !== "function" ) {

      if ( Popcorn.plugin.debug ) {
        throw new Error( "Popcorn Code Plugin Error: onStart must be a function." );
      }
      options.onStart = Popcorn.nop;
    }

    if ( options.onEnd && typeof options.onEnd !== "function" ) {

      if ( Popcorn.plugin.debug ) {
        throw new Error( "Popcorn Code Plugin Error: onEnd  must be a function." );
      }
      options.onEnd = undefined;
    }

    if ( options.onFrame && typeof options.onFrame !== "function" ) {

      if ( Popcorn.plugin.debug ) {
        throw new Error( "Popcorn Code Plugin Error: onFrame  must be a function." );
      }
      options.onFrame = undefined;
    }

    return {
      start: function( event, options ) {
        options.onStart( options );

        if ( options.onFrame ) {
          running = true;
          step( options.onFrame, options );
        }
      },

      end: function( event, options ) {
        if ( options.onFrame ) {
          running = false;
        }

        if ( options.onEnd ) {
          options.onEnd( options );
        }
      }
    };
  },
  {
    about: {
      name: "Popcorn Code Plugin",
      version: "0.1",
      author: "David Humphrey (@humphd)",
      website: "http://vocamus.net/dave"
    },
    options: {
      start: {
       elem: "input",
       type: "text",
       label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      onStart: {
        elem: "input",
        type: "function",
        label: "onStart"
      },
      onFrame: {
        elem: "input",
        type: "function",
        label: "onFrame"
      },
      onEnd: {
        elem: "input",
        type: "function",
        label: "onEnd"
      }
    }
  });
})( Popcorn );
// PLUGIN: Flickr
(function (Popcorn) {

  /**
   * Flickr popcorn plug-in
   * Appends a users Flickr images to an element on the page.
   * Options parameter will need a start, end, target and userid or username and api_key.
   * Optional parameters are numberofimages, height, width, padding, and border
   * Start is the time that you want this plug-in to execute (in seconds)
   * End is the time that you want this plug-in to stop executing (in seconds)
   * Userid is the id of who's Flickr images you wish to show
   * Tags is a mutually exclusive list of image descriptor tags
   * Username is the username of who's Flickr images you wish to show
   *  using both userid and username is redundant
   *  an api_key is required when using username
   * Apikey is your own api key provided by Flickr
   * Target is the id of the document element that the images are
   *  appended to, this target element must exist on the DOM
   * Numberofimages specify the number of images to retreive from flickr, defaults to 4
   * Height the height of the image, defaults to '50px'
   * Width the width of the image, defaults to '50px'
   * Padding number of pixels between images, defaults to '5px'
   * Border border size in pixels around images, defaults to '0px'
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .flickr({
          start:          5,                 // seconds, mandatory
          end:            15,                // seconds, mandatory
          userid:         '35034346917@N01', // optional
          tags:           'dogs,cats',       // optional
          numberofimages: '8',               // optional
          height:         '50px',            // optional
          width:          '50px',            // optional
          padding:        '5px',             // optional
          border:         '0px',             // optional
          target:         'flickrdiv'        // mandatory
        } )
   *
   */

  var idx = 0;

  Popcorn.plugin( "flickr" , function( options ) {
    var containerDiv,
        target = document.getElementById( options.target ),
        _userid,
        _uri,
        _link,
        _image,
        _count = options.numberofimages || 4,
        _height = options.height || "50px",
        _width = options.width || "50px",
        _padding = options.padding || "5px",
        _border = options.border || "0px";

    // create a new div this way anything in the target div is left intact
    // this is later populated with Flickr images
    containerDiv = document.createElement( "div" );
    containerDiv.id = "flickr" + idx;
    containerDiv.style.width = "100%";
    containerDiv.style.height = "100%";
    containerDiv.style.display = "none";
    idx++;

    // ensure the target container the user chose exists
    if ( !target && Popcorn.plugin.debug ) {
      throw new Error( "flickr target container doesn't exist" );
    }

    target && target.appendChild( containerDiv );

    // get the userid from Flickr API by using the username and apikey
    var isUserIDReady = function() {
      if ( !_userid ) {

        _uri  = "http://api.flickr.com/services/rest/?method=flickr.people.findByUsername&";
        _uri += "username=" + options.username + "&api_key=" + options.apikey + "&format=json&jsoncallback=flickr";
        Popcorn.getJSONP( _uri, function( data ) {
          _userid = data.user.nsid;
          getFlickrData();
        });

      } else {

        setTimeout(function () {
          isUserIDReady();
        }, 5 );
      }
    };

    // get the photos from Flickr API by using the user_id and/or tags
    var getFlickrData = function() {

      _uri  = "http://api.flickr.com/services/feeds/photos_public.gne?";

      if ( _userid ) {
        _uri += "id=" + _userid + "&";
      }
      if ( options.tags ) {
        _uri += "tags=" + options.tags + "&";
      }

      _uri += "lang=en-us&format=json&jsoncallback=flickr";

      Popcorn.xhr.getJSONP( _uri, function( data ) {

        var fragment = document.createElement( "p" );

        fragment.innerHTML = "<p style='padding:" + _padding + ";'>" + data.title + "<p/>";

        Popcorn.forEach( data.items, function ( item, i ) {
          if ( i < _count ) {

            _link = document.createElement( "a" );
            _link.setAttribute( "href", item.link );
            _link.setAttribute( "target", "_blank" );
            _image = document.createElement( "img" );
            _image.setAttribute( "src", item.media.m );
            _image.setAttribute( "height",_height );
            _image.setAttribute( "width", _width );
            _image.setAttribute( "style", "border:" + _border + ";padding:" + _padding );
            _link.appendChild( _image );
            fragment.appendChild( _link );

          } else {

            return false;
          }
        });

        containerDiv.appendChild( fragment );
      });
    };

    if ( options.username && options.apikey ) {
      isUserIDReady();
    }
    else {
      _userid = options.userid;
      getFlickrData();
    }
    return {
      /**
       * @member flickr
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        containerDiv.style.display = "inline";
      },
      /**
       * @member flickr
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        containerDiv.style.display = "none";
      },
      _teardown: function( options ) {
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( containerDiv );
      }
    };
  },
  {
    about: {
      name: "Popcorn Flickr Plugin",
      version: "0.2",
      author: "Scott Downe, Steven Weerdenburg, Annasob",
      website: "http://scottdowne.wordpress.com/"
    },
    options: {
      start: {
        elem: "input",
        type: "number",
        label: "In"
      },
      end: {
        elem: "input",
        type: "number",
        label: "Out"
      },
      userid: {
        elem: "input",
        type: "text",
        label: "UserID"
      },
      tags: {
        elem: "input",
        type: "text",
        label: "Tags"
      },
      username: {
        elem: "input",
        type: "text",
        label: "Username"
      },
      apikey: {
        elem: "input",
        type: "text",
        label: "Api_key"
      },
      target: "flickr-container",
      height: {
        elem: "input",
        type: "text",
        label: "Height"
      },
      width: {
        elem: "input",
        type: "text",
        label: "Width"
      },
      padding: {
        elem: "input",
        type: "text",
        label: "Padding"
      },
      border: {
        elem: "input",
        type: "text",
        label: "Border"
      },
      numberofimages: {
        elem: "input",
        type: "text",
        label: "Number of Images"
      }
    }
  });
})( Popcorn );
// PLUGIN: Footnote/Text

(function ( Popcorn ) {

  /**
   * Footnote popcorn plug-in
   * Adds text to an element on the page.
   * Options parameter will need a start, end, target and text.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Text is the text that you want to appear in the target
   * Target is the id of the document element that the text needs to be
   * attached to, this target element must exist on the DOM
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .footnote({
          start: 5, // seconds
          end: 15, // seconds
          text: 'This video made exclusively for drumbeat.org',
          target: 'footnotediv'
        } )
   *
   */

  Popcorn.forEach( [ "footnote", "text" ], function( name ) {

    Popcorn.plugin( name , {

      manifest: {
        about: {
          name: "Popcorn " + name + " Plugin",
          version: "0.2",
          author: "@annasob, @rwaldron",
          website: "annasob.wordpress.com"
        },
        options: {
          start: {
            elem: "input",
            type: "text",
            label: "In"
          },
          end: {
            elem: "input",
            type: "text",
            label: "Out"
          },
          text: {
            elem: "input",
            type: "text",
            label: "Text"
          },
          target: name + "-container"
        }
      },
    _setup: function( options ) {

      var target = document.getElementById( options.target );

      options._container = document.createElement( "div" );
      options._container.style.display = "none";
      options._container.innerHTML  = options.text;

      if ( !target && Popcorn.plugin.debug ) {
        throw new Error( "target container doesn't exist" );
      }
      target && target.appendChild( options._container );
    },
    /**
     * @member footnote
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function( event, options ){
      options._container.style.display = "inline";
    },
    /**
     * @member footnote
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function( event, options ){
      options._container.style.display = "none";
    },
    _teardown: function( options ) {
      document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
    }
  });
});

})( Popcorn );
//PLUGIN: facebook

(function( Popcorn, global ) {
/**
  * Facebook Popcorn plug-in
  * Places Facebook's "social plugins" inside a div ( http://developers.facebook.com/docs/plugins/ )
  * Sets options according to user input or default values
  * Options parameter will need a target, type, start and end time
  * Type is the name of the plugin in fbxml format. Options: LIKE (default), LIKE-BOX, ACTIVITY, FACEPILE
  * Target is the id of the document element that the text needs to be attached to. This target element must exist on the DOM
  * Start is the time that you want this plug-in to execute
  * End is the time that you want this plug-in to stop executing
  *
  * Other than the mandatory four parameters, there are several optional parameters (Some options are only applicable to certain plugins)
  * Action - like button will either "Like" or "Recommend". Options: recommend / like(default)
  * Always_post_to_friends - live-stream posts will be always be posted on your facebook wall if true. Options: true / false(default)
  * Border_color - border color of the activity feed. Names (i.e: "white") and html color codes are valid
  * Colorscheme - changes the color of almost all plugins. Options: light(default) / dark
  * Event_app_id - an app_id is required for the live-stream plugin
  * Font - the font of the text contained in the plugin. Options: arial / segoe ui / tahoma / trebuchet ms / verdana / lucida grande
  * Header - displays the title of like-box or activity feed. Options: true / false(default)
  * Href - url to apply to the plugin. Default is current page
  * Layout - changes the format of the 'like' count (written in english or a number in a callout).
  *          Options: box_count / button_count / standard(default)
  * Max_rows - number of rows to disperse pictures in facepile. Default is 1
  * Recommendations - shows recommendations, if any, in the bottom half of activity feed. Options: true / false(default)
  * Show_faces - show pictures beside like button and like-box. Options: true / false(default)
  * Site - href for activity feed. No idea why it must be "site". Default is current page
  * Stream - displays a the latest posts from the specified page's wall. Options: true / false(default)
  * Type - determines which plugin to create. Case insensitive
  * Xid - unique identifier if more than one live-streams are on one page
  *
  * @param {Object} options
  *
  * Example:
    var p = Popcorn('#video')
      .facebook({
        type  : "LIKE-BOX",
        target: "likeboxdiv",
        start : 3,
        end   : 10,
        href  : "http://www.facebook.com/senecacollege",
        show_faces: "true",
        header: "false"
      } )
  * This will show how many people "like" Seneca College's Facebook page, and show their profile pictures
  */

  var ranOnce = false;

  Popcorn.plugin( "facebook" , {
    manifest: {
      about: {
        name: "Popcorn Facebook Plugin",
        version: "0.1",
        author: "Dan Ventura, Matthew Schranz: @mjschranz",
        website: "dsventura.blogspot.com, mschranz.wordpress.com"
      },
      options: {
        type: {
          elem: "select",
          options: [ "LIKE", "LIKE-BOX", "ACTIVITY", "FACEPILE", "LIVE-STREAM", "SEND", "COMMENTS" ],
          label: "Type"
        },
        target: "facebook-container",
        start: {
          elem: "input",
          type: "number",
          label: "In"
        },
        end: {
          elem: "input",
          type: "number",
          label: "Out"
        },
        // optional parameters:
        font: {
          elem: "input",
          type: "text",
          label: "font"
        },
        xid: {
          elem: "input",
          type: "text",
          label: "Xid"
        },
        href: {
          elem: "input",
          type: "url",
          label: "Href"
        },
        site: {
          elem: "input",
          type: "url",
          label:"Site"
        },
        height: {
          elem: "input",
          type: "text",
          label: "Height"
        },
        width: {
          elem: "input",
          type: "text",
          label: "Width"
        },
        action: {
          elem: "select",
          options: [ "like", "recommend" ],
          label: "Action"
        },
        stream: {
          elem: "select",
          options: [ "false", "true" ],
          label: "Stream"
        },
        header: {
          elem: "select",
          options: [ "false", "true" ],
          label: "Header"
        },
        layout: {
          elem: "select",
          options: [ "standard", "button_count", "box_count" ],
          label: "Layout"
        },
        max_rows: {
          elem: "input",
          type: "text",
          label: "Max_rows"
        },
        border_color: {
          elem: "input",
          type: "text",
          label: "Border_color"
        },
        event_app_id: {
          elem: "input",
          type: "text",
          label: "Event_app_id"
        },
        colorscheme: {
           elem: "select",
           options: [ "light", "dark" ],
           label: "Colorscheme"
        },
        show_faces: {
           elem: "select",
           options: [ "false", "true" ],
           label: "Showfaces"
        },
        recommendations: {
           elem: "select",
           options: [ "false", "true" ],
           label: "Recommendations"
        },
        always_post_to_friends: {
          elem: "input",
          options: [ "false", "true" ],
          label: "Always_post_to_friends"
        },
        num_posts: {
          elem: "input",
          type: "text",
          label: "Number_of_Comments"
        }
      }
    },

    _setup: function( options ) {

      var target = document.getElementById( options.target ),
          _type = options.type;

      // facebook script requires a div named fb-root
      if ( !document.getElementById( "fb-root" ) ) {
        var fbRoot = document.createElement( "div" );
        fbRoot.setAttribute( "id", "fb-root" );
        document.body.appendChild( fbRoot );
      }

      if ( !ranOnce || options.event_app_id ) {
        ranOnce = true;
        // initialize facebook JS SDK
        Popcorn.getScript( "//connect.facebook.net/en_US/all.js" );

        global.fbAsyncInit = function() {
          FB.init({
            appId: ( options.event_app_id || "" ),
            status: true,
            cookie: true,
            xfbml: true
          });
        };
      }

      // Lowercase to make value consistent no matter what user inputs
      _type = _type.toLowerCase();

      var validType = function( type ) {
        return ( [ "like", "like-box", "activity", "facepile", "live-stream", "send", "comments" ].indexOf( type ) > -1 );
      };

      // Checks if type is valid
      if ( !validType( _type ) ) {
        throw new Error( "Facebook plugin type was invalid." );
      }

      options._container = document.createElement( "div" );
      options._container.id = "facebookdiv-" + Popcorn.guid();
      options._facebookdiv = document.createElement( "fb:" + _type );
      options._container.appendChild( options._facebookdiv );

      // All the the "types" for facebook share largely identical attributes, for loop suffices.
      // ** Credit to Rick Waldron, it's essentially all his code in this function.
      // activity feed uses 'site' rather than 'href'
      var attr = _type === "activity" ? "site" : "href";

      options._facebookdiv.setAttribute( attr, ( options[ attr ] || document.URL ) );

      // create an array of Facebook widget attributes
      var fbAttrs = (
        "width height layout show_faces stream header colorscheme" +
        " maxrows border_color recommendations font always_post_to_friends xid" +
        " num_posts"
      ).split(" ");

      // For Each that loops through all of our attributes adding them to the divs properties
      Popcorn.forEach( fbAttrs, function( attr ) {
        // Test for null/undef. Allows 0, false & ""
        if ( options[ attr ] != null ) {
          options._facebookdiv.setAttribute( attr, options[ attr ] );
        }
      });

      // Checks if the plugins target container exists
      if ( !target && Popcorn.plugin.debug ) {
        throw new Error( "Facebook target container doesn't exist" );
      }
      target && target.appendChild( options._container );
    },
    /**
    * @member facebook
    * The start function will be executed when the currentTime
    * of the video reaches the start time provided by the
    * options variable
    */
    start: function( event, options ){
      options._container.style.display = "";
    },
    /**
    * @member facebook
    * The end function will be executed when the currentTime
    * of the video reaches the end time provided by the
    * options variable
    */
    end: function( event, options ){
      options._container.style.display = "none";
    },
    _teardown: function( options ){
      var target = document.getElementById( options.target );
      target && target.removeChild( options._container );
    }
  });

})( Popcorn, this );

// PLUGIN: Google Maps
var googleCallback;
(function ( Popcorn ) {

  var i = 1,
    _mapFired = false,
    _mapLoaded = false,
    geocoder, loadMaps;
  //google api callback
  googleCallback = function ( data ) {
    // ensure all of the maps functions needed are loaded
    // before setting _maploaded to true
    if ( typeof google !== "undefined" && google.maps && google.maps.Geocoder && google.maps.LatLng ) {
      geocoder = new google.maps.Geocoder();
      _mapLoaded = true;
    } else {
      setTimeout(function () {
        googleCallback( data );
      }, 1);
    }
  };
  // function that loads the google api
  loadMaps = function () {
    // for some reason the Google Map API adds content to the body
    if ( document.body ) {
      _mapFired = true;
      Popcorn.getScript( "//maps.google.com/maps/api/js?sensor=false&callback=googleCallback" );
    } else {
      setTimeout(function () {
        loadMaps();
      }, 1);
    }
  };

  /**
   * googlemap popcorn plug-in
   * Adds a map to the target div centered on the location specified by the user
   * Options parameter will need a start, end, target, type, zoom, lat and lng, and location
   * -Start is the time that you want this plug-in to execute
   * -End is the time that you want this plug-in to stop executing
   * -Target is the id of the DOM element that you want the map to appear in. This element must be in the DOM
   * -Type [optional] either: HYBRID (default), ROADMAP, SATELLITE, TERRAIN, STREETVIEW
   * -Zoom [optional] defaults to 0
   * -Heading [optional] STREETVIEW orientation of camera in degrees relative to true north (0 north, 90 true east, ect)
   * -Pitch [optional] STREETVIEW vertical orientation of the camera (between 1 and 3 is recommended)
   * -Lat and Lng: the coordinates of the map must be present if location is not specified.
   * -Location: the adress you want the map to display, must be present if lat and lng are not specified.
   * Note: using location requires extra loading time, also not specifying both lat/lng and location will
   * cause and error.
   *
   * Tweening works using the following specifications:
   * -location is the start point when using an auto generated route
   * -tween when used in this context is a string which specifies the end location for your route
   * Note that both location and tween must be present when using an auto generated route, or the map will not tween
   * -interval is the speed in which the tween will be executed, a reasonable time is 1000 ( time in milliseconds )
   * Heading, Zoom, and Pitch streetview values are also used in tweening with the autogenerated route
   *
   * -tween is an array of objects, each containing data for one frame of a tween
   * -position is an object with has two paramaters, lat and lng, both which are mandatory for a tween to work
   * -pov is an object which houses heading, pitch, and zoom paramters, which are all optional, if undefined, these values default to 0
   * -interval is the speed in which the tween will be executed, a reasonable time is 1000 ( time in milliseconds )
   *
   * @param {Object} options
   *
   * Example:
   var p = Popcorn("#video")
   .googlemap({
   start: 5, // seconds
   end: 15, // seconds
   type: "ROADMAP",
   target: "map",
   lat: 43.665429,
   lng: -79.403323
   } )
   *
   */
  Popcorn.plugin( "googlemap", function ( options ) {
    var newdiv, map, location,
        target = document.getElementById( options.target );

    // if this is the firest time running the plugins
    // call the function that gets the sctipt
    if ( !_mapFired ) {
      loadMaps();
    }

    // create a new div this way anything in the target div is left intact
    // this is later passed on to the maps api
    newdiv = document.createElement( "div" );
    newdiv.id = "actualmap" + i;
    newdiv.style.width = "100%";
    newdiv.style.height = "100%";
    i++;

    // ensure the target container the user chose exists
    if ( !target && Popcorn.plugin.debug ) {
      throw new Error( "target container doesn't exist" );
    }
    target && target.appendChild( newdiv );

    // ensure that google maps and its functions are loaded
    // before setting up the map parameters
    var isMapReady = function () {
      if ( _mapLoaded ) {
        if ( options.location ) {
          // calls an anonymous google function called on separate thread
          geocoder.geocode({
            "address": options.location
          }, function ( results, status ) {
            if ( status === google.maps.GeocoderStatus.OK ) {
              options.lat = results[ 0 ].geometry.location.lat();
              options.lng = results[ 0 ].geometry.location.lng();
              location = new google.maps.LatLng( options.lat, options.lng );
              map = new google.maps.Map( newdiv, {
                mapTypeId: google.maps.MapTypeId[ options.type ] || google.maps.MapTypeId.HYBRID
              });
              map.getDiv().style.display = "none";
            }
          });
        } else {
          location = new google.maps.LatLng( options.lat, options.lng );
          map = new google.maps.Map( newdiv, {
            mapTypeId: google.maps.MapTypeId[ options.type ] || google.maps.MapTypeId.HYBRID
          });
          map.getDiv().style.display = "none";
        }
      } else {
          setTimeout(function () {
            isMapReady();
          }, 5);
        }
      };

    isMapReady();

    return {
      /**
       * @member webpage
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        var that = this,
            sView;

        // ensure the map has been initialized in the setup function above
        var isMapSetup = function() {
          if ( map ) {
            map.getDiv().style.display = "block";
            // reset the location and zoom just in case the user plaid with the map
            google.maps.event.trigger( map, "resize" );
            map.setCenter( location );

            // make sure options.zoom is a number
            if ( options.zoom && typeof options.zoom !== "number" ) {
              options.zoom = +options.zoom;
            }

            options.zoom = options.zoom || 8; // default to 8

            map.setZoom( options.zoom );

            //Make sure heading is a number
            if ( options.heading && typeof options.heading !== "number" ) {
              options.heading = +options.heading;
            }
            //Make sure pitch is a number
            if ( options.pitch && typeof options.pitch !== "number" ) {
              options.pitch = +options.pitch;
            }

            if ( options.type === "STREETVIEW" ) {
              // Switch this map into streeview mode
              map.setStreetView(
              // Pass a new StreetViewPanorama instance into our map

                sView = new google.maps.StreetViewPanorama( newdiv, {
                  position: location,
                  pov: {
                    heading: options.heading = options.heading || 0,
                    pitch: options.pitch = options.pitch || 0,
                    zoom: options.zoom
                  }
                })
              );

              //  Function to handle tweening using a set timeout
              var tween = function( rM, t ) {

                var computeHeading = google.maps.geometry.spherical.computeHeading;
                setTimeout(function() {

                  var current_time = that.media.currentTime;

                  //  Checks whether this is a generated route or not
                  if ( typeof options.tween === "object" ) {

                    for ( var i = 0, m = rM.length; i < m; i++ ) {

                      var waypoint = rM[ i ];

                      //  Checks if this position along the tween should be displayed or not
                      if ( current_time >= ( waypoint.interval * ( i + 1 ) ) / 1000 &&
                         ( current_time <= ( waypoint.interval * ( i + 2 ) ) / 1000 ||
                           current_time >= waypoint.interval * ( m ) / 1000 ) ) {

                        sView3.setPosition( new google.maps.LatLng( waypoint.position.lat, waypoint.position.lng ) );

                        sView3.setPov({
                          heading: waypoint.pov.heading || computeHeading( waypoint, rM[ i + 1 ] ) || 0,
                          zoom: waypoint.pov.zoom || 0,
                          pitch: waypoint.pov.pitch || 0
                        });
                      }
                    }

                    //  Calls the tween function again at the interval set by the user
                    tween( rM, rM[ 0 ].interval );
                  } else {

                    for ( var k = 0, l = rM.length; k < l; k++ ) {

                      var interval = options.interval;

                      if( current_time >= (interval * ( k + 1 ) ) / 1000 &&
                        ( current_time <= (interval * ( k + 2 ) ) / 1000 ||
                          current_time >= interval * ( l ) / 1000 ) ) {

                        sView2.setPov({
                          heading: computeHeading( rM[ k ], rM[ k + 1 ] ) || 0,
                          zoom: options.zoom,
                          pitch: options.pitch || 0
                        });
                        sView2.setPosition( checkpoints[ k ] );
                      }
                    }

                    tween( checkpoints, options.interval );
                  }
                }, t );
              };

              //  Determines if we should use hardcoded values ( using options.tween ),
              //  or if we should use a start and end location and let google generate
              //  the route for us
              if ( options.location && typeof options.tween === "string" ) {

              //  Creating another variable to hold the streetview map for tweening,
              //  Doing this because if there was more then one streetview map, the tweening would sometimes appear in other maps
              var sView2 = sView;

                //  Create an array to store all the lat/lang values along our route
                var checkpoints = [];

                //  Creates a new direction service, later used to create a route
                var directionsService = new google.maps.DirectionsService();

                //  Creates a new direction renderer using the current map
                //  This enables us to access all of the route data that is returned to us
                var directionsDisplay = new google.maps.DirectionsRenderer( sView2 );

                var request = {
                  origin: options.location,
                  destination: options.tween,
                  travelMode: google.maps.TravelMode.DRIVING
                };

                //  Create the route using the direction service and renderer
                directionsService.route( request, function( response, status ) {

                  if ( status == google.maps.DirectionsStatus.OK ) {
                    directionsDisplay.setDirections( response );
                    showSteps( response, that );
                  }

                });

                var showSteps = function ( directionResult, that ) {

                  //  Push new google map lat and lng values into an array from our list of lat and lng values
                  var routes = directionResult.routes[ 0 ].overview_path;
                  for ( var j = 0, k = routes.length; j < k; j++ ) {
                    checkpoints.push( new google.maps.LatLng( routes[ j ].lat(), routes[ j ].lng() ) );
                  }

                  //  Check to make sure the interval exists, if not, set to a default of 1000
                  options.interval = options.interval || 1000;
                  tween( checkpoints, 10 );

                };
              } else if ( typeof options.tween === "object" ) {

                //  Same as the above to stop streetview maps from overflowing into one another
                var sView3 = sView;

                for ( var i = 0, l = options.tween.length; i < l; i++ ) {

                  //  Make sure interval exists, if not, set to 1000
                  options.tween[ i ].interval = options.tween[ i ].interval || 1000;
                  tween( options.tween, 10 );
                }
              }
            }
          } else {
            setTimeout(function () {
              isMapSetup();
            }, 13);
          }
        };
        isMapSetup();
      },
      /**
       * @member webpage
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function ( event, options ) {
        // if the map exists hide it do not delete the map just in
        // case the user seeks back to time b/w start and end
        if ( map ) {
          map.getDiv().style.display = "none";
        }
      },
      _teardown: function ( options ) {

        var target = document.getElementById( options.target );

        // the map must be manually removed
        target && target.removeChild( newdiv );
        newdiv = map = location = null;
      }
    };
  }, {
    about: {
      name: "Popcorn Google Map Plugin",
      version: "0.1",
      author: "@annasob",
      website: "annasob.wordpress.com"
    },
    options: {
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target: "map-container",
      type: {
        elem: "select",
        options: [ "ROADMAP", "SATELLITE", "STREETVIEW", "HYBRID", "TERRAIN" ],
        label: "Type"
      },
      zoom: {
        elem: "input",
        type: "text",
        label: "Zoom"
      },
      lat: {
        elem: "input",
        type: "text",
        label: "Lat"
      },
      lng: {
        elem: "input",
        type: "text",
        label: "Lng"
      },
      location: {
        elem: "input",
        type: "text",
        label: "Location"
      },
      heading: {
        elem: "input",
        type: "text",
        label: "Heading"
      },
      pitch: {
        elem: "input",
        type: "text",
        label: "Pitch"
      }
    }
  });
})( Popcorn );

// PLUGIN: IMAGE

(function ( Popcorn ) {

/**
 * Images popcorn plug-in
 * Shows an image element
 * Options parameter will need a start, end, href, target and src.
 * Start is the time that you want this plug-in to execute
 * End is the time that you want this plug-in to stop executing
 * href is the url of the destination of a link - optional
 * Target is the id of the document element that the iframe needs to be attached to,
 * this target element must exist on the DOM
 * Src is the url of the image that you want to display
 * text is the overlayed text on the image - optional
 *
 * @param {Object} options
 *
 * Example:
   var p = Popcorn('#video')
      .image({
        start: 5, // seconds
        end: 15, // seconds
        href: 'http://www.drumbeat.org/',
        src: 'http://www.drumbeat.org/sites/default/files/domain-2/drumbeat_logo.png',
        text: 'DRUMBEAT',
        target: 'imagediv'
      } )
 *
 */
  Popcorn.plugin( "image", {
      manifest: {
        about: {
          name: "Popcorn image Plugin",
          version: "0.1",
          author: "Scott Downe",
          website: "http://scottdowne.wordpress.com/"
        },
        options: {
          start: {
            elem: "input",
            type: "number",
            label: "In"
          },
          end: {
            elem: "input",
            type: "number",
            label: "Out"
          },
          href: {
            elem: "input",
            type: "url",
            label: "Link URL"
          },
          target: "image-container",
          src: {
            elem: "input",
            type: "url",
            label: "Source URL"
          },
          text: {
            elem: "input",
            type: "text",
            label: "TEXT"
          }
        }
      },
      _setup: function( options ) {
        var img = document.createElement( "img" ),
            target = document.getElementById( options.target );

        options.link = document.createElement( "a" );
        options.link.style.position = "relative";
        options.link.style.textDecoration = "none";


        if ( !target && Popcorn.plugin.debug ) {
          throw new Error( "target container doesn't exist" );
        }
        // add the widget's div to the target div
        target && target.appendChild( options.link );

        img.addEventListener( "load", function() {

          // borders look really bad, if someone wants it they can put it on their div target
          img.style.borderStyle = "none";

          if ( options.href ) {
            options.link.href = options.href;
          }

          options.link.target = "_blank";

          var fontHeight = ( img.height / 12 ) + "px",
              divText = document.createElement( "div" );

          Popcorn.extend( divText.style, {

            color: "black",
            fontSize: fontHeight,
            fontWeight: "bold",
            position: "relative",
            textAlign: "center",
            width: img.width + "px",
            zIndex: "10"
          });

          divText.innerHTML = options.text || "";
          options.link.appendChild( divText );
          options.link.appendChild( img );
          divText.style.top = ( img.height / 2 ) - ( divText.offsetHeight / 2 ) + "px";
          options.link.style.display = "none";
        }, false );

        img.src = options.src;
      },

      /**
       * @member image
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        options.link.style.display = "block";
      },
      /**
       * @member image
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        options.link.style.display = "none";
      },
      _teardown: function( options ) {
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options.link );
      }
  });
})( Popcorn );
// PLUGIN: GML
(function( Popcorn ) {

  var gmlPlayer = function( $p ) {

        var _stroke = 0,
            onPt = 0,
            onStroke = 0,
            x = null,
            y = null,
            rotation = false,
            strokes = 0,
            play = function() {},
            reset = function() {

              $p.background( 0 );
              onPt = onStroke = 0;
              x = y = null;
            },
            drawLine = function( x, y, x2, y2 ) {

              var _x, _y, _x2, _y2;

              if ( rotation ) {

                _x  = y * $p.height;
                _y  = $p.width - ( x * $p.width );
                _x2 = y2 * $p.height;
                _y2 = $p.width - ( x2 * $p.width );
              } else {

                _x  = x * $p.width;
                _y  = y * $p.height;
                _x2 = x2 * $p.width;
                _y2 = y2 * $p.height;
              }

              $p.stroke( 0 );
              $p.strokeWeight( 13 );
              $p.strokeCap( $p.SQUARE );
              $p.line( _x, _y, _x2, _y2 );
              $p.stroke( 255 );
              $p.strokeWeight( 12 );
              $p.strokeCap( $p.ROUND );
              $p.line( _x, _y, _x2, _y2 );
            },
            seek = function( point ) {

              ( point < onPt ) && reset();

              while ( onPt <= point ) {

                if ( !strokes ) {
                  return;
                }

                _stroke = strokes[ onStroke ] || strokes;
                var pt = _stroke.pt[ onPt ],
                    p = onPt;
                x != null && drawLine( x, y, pt.x, pt.y );

                x = pt.x;
                y = pt.y;
                ( onPt === p ) && onPt++;
              }
            };

        $p.draw = function() {

          play();
        };
        $p.setup = function() {};
        $p.construct = function( media, data, options ) {

          var dataReady = function() {

            if ( data ) {

              strokes = data.gml.tag.drawing.stroke;

              var drawingDur = ( options.end - options.start ) / ( strokes.pt || (function( strokes ) {

                var rStrokes = [];

                for ( var i = 0, sl = strokes.length; i < sl; i++ ) {

                  rStrokes = rStrokes.concat( strokes[ i ].pt );
                }

                return rStrokes;
              })( strokes ) ).length;

              var tag = data.gml.tag,
                  app_name =  tag.header && tag.header.client && tag.header.client.name;

              rotation = app_name === "Graffiti Analysis 2.0: DustTag" ||
                         app_name === "DustTag: Graffiti Analysis 2.0" ||
                         app_name === "Fat Tag - Katsu Edition";

              play = function() {

                if ( media.currentTime < options.endDrawing ) {

                  seek( ( media.currentTime - options.start ) / drawingDur );
                }
              };

              return;
            }

            setTimeout( dataReady, 5 );
          };

          $p.size( 640, 640 );
          $p.frameRate( 60 );
          $p.smooth();
          reset();
          $p.noLoop();

          dataReady();
        };
      };

  /**
   * Grafiti markup Language (GML) popcorn plug-in
   * Renders a GML tag inside an HTML element
   * Options parameter will need a mandatory start, end, target, gmltag.
   * Optional parameters: none.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Target is the id of the document element that you wish to render the grafiti in
   * gmltag is the numerical reference to a gml tag via 000000book.com
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
       .gml({
         start: 0, // seconds
         end: 5, // seconds
         gmltag: '29582',
         target: 'gmldiv'
       });
   *
   */
  Popcorn.plugin( "gml" , {

    _setup: function( options ) {

      var self = this,
          target = document.getElementById( options.target );

      options.endDrawing = options.endDrawing || options.end;

      // create a canvas to put in the target div
      options.container = document.createElement( "canvas" );

      options.container.style.display = "none";
      options.container.setAttribute( "id", "canvas" + options.gmltag );

      if ( !target && Popcorn.plugin.debug ) {
        throw new Error( "target container doesn't exist" );
      }
      target && target.appendChild( options.container );

      var scriptReady = function() {
        Popcorn.getJSONP( "//000000book.com/data/" + options.gmltag + ".json?callback=", function( data ) {

          options.pjsInstance = new Processing( options.container, gmlPlayer );
          options.pjsInstance.construct( self.media, data, options );
          options._running && options.pjsInstance.loop();
        }, false );
      };

      if ( !window.Processing ) {

        Popcorn.getScript( "//processingjs.org/content/download/processing-js-1.3.0/processing-1.3.0.min.js", scriptReady );
      } else {

        scriptReady();
      }

    },
    /**
     * @member gml
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function( event, options ) {

      options.pjsInstance && options.pjsInstance.loop();
      options.container.style.display = "block";
    },
    /**
     * @member gml
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function( event, options ) {

      options.pjsInstance && options.pjsInstance.noLoop();
      options.container.style.display = "none";
    },
    _teardown: function( options ) {

      options.pjsInstance && options.pjsInstance.exit();
      document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options.container );
    }
  });
})( Popcorn );
// PLUGIN: LASTFM

(function ( Popcorn ) {

  var _artists = {},
      lastFMcallback = function( data ) {
        if ( data.artist ) {
          var htmlString = "";

          htmlString = "<h3>" + data.artist.name + "</h3>";
          htmlString += "<a href='" + data.artist.url + "' target='_blank' style='float:left;margin:0 10px 0 0;'><img src='" + data.artist.image[ 2 ][ "#text"] + "' alt=''></a>";
          htmlString += "<p>" + data.artist.bio.summary + "</p>";
          htmlString += "<hr /><p><h4>Tags</h4><ul>";

          Popcorn.forEach( data.artist.tags.tag, function( val, i) {
            htmlString += "<li><a href='" + val.url + "'>" + val.name + "</a></li>";
          });

          htmlString += "</ul></p>";
          htmlString += "<hr /><p><h4>Similar</h4><ul>";

          Popcorn.forEach( data.artist.similar.artist, function( val, i) {
            htmlString += "<li><a href='" + val.url + "'>" + val.name + "</a></li>";
          });

          htmlString += "</ul></p>";

          _artists[ data.artist.name.toLowerCase() ].htmlString = htmlString;
        }
      };

  /**
   * LastFM popcorn plug-in
   * Appends information about a LastFM artist to an element on the page.
   * Options parameter will need a start, end, target, artist and apikey.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Artist is the name of who's LastFM information you wish to show
   * Target is the id of the document element that the images are
   *  appended to, this target element must exist on the DOM
   * ApiKey is the API key registered with LastFM for use with their API
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .lastfm({
          start:          5,                                    // seconds, mandatory
          end:            15,                                   // seconds, mandatory
          artist:         'yacht',                              // mandatory
          target:         'lastfmdiv',                          // mandatory
          apikey:         '1234567890abcdef1234567890abcdef'    // mandatory
        } )
   *
   */
  Popcorn.plugin( "lastfm" , (function(){


    return {

      _setup: function( options ) {
        options._container = document.createElement( "div" );
        options._container.style.display = "none";
        options._container.innerHTML = "";
        options.artist = options.artist && options.artist.toLowerCase() || "";

        var target = document.getElementById( options.target );

        if ( !target && Popcorn.plugin.debug ) {
          throw new Error( "target container doesn't exist" );
        }
        target && target.appendChild( options._container );

        if ( !_artists[ options.artist ] ) {

          _artists[ options.artist ] = {
            count: 0,
            htmlString: "Unknown Artist"
          };
          Popcorn.getJSONP( "//ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + options.artist + "&api_key=" + options.apikey + "&format=json&callback=lastFMcallback", lastFMcallback, false );
        }
        _artists[ options.artist ].count++;

      },
      /**
       * @member LastFM
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        options._container.innerHTML = _artists[ options.artist ].htmlString;
        options._container.style.display = "inline";
      },
      /**
       * @member LastFM
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        options._container.style.display = "none";
        options._container.innerHTML = "";
      },
      _teardown: function( options ) {
        // cleaning possible reference to _artist array;
        --_artists[ options.artist ].count || delete _artists[ options.artist ];
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
      }
    };
  })(),
  {
    about:{
      name: "Popcorn LastFM Plugin",
      version: "0.1",
      author: "Steven Weerdenburg",
      website: "http://sweerdenburg.wordpress.com/"
    },
    options: {
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target: "lastfm-container",
      artist: {
        elem: "input",
        type: "text",
        label: "Artist"
      }
    }
  });

})( Popcorn );
// PLUGIN: lowerthird
(function ( Popcorn ) {

  /**
   * Lower Third popcorn plug-in
   * Displays information about a speaker over the video, or in the target div
   * Options parameter will need a start, and end.
   * Optional parameters are target, salutation, name and role.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Target is the id of the document element that the content is
   *  appended to, this target element must exist on the DOM
   * salutation is the speaker's Mr. Ms. Dr. etc.
   * name is the speaker's name.
   * role is information about the speaker, example Engineer.
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .lowerthird({
          start:          5,                 // seconds, mandatory
          end:            15,                // seconds, mandatory
          salutation:     'Mr',              // optional
          name:           'Scott Downe',     // optional
          role:           'Programmer',      // optional
          target:         'subtitlediv'      // optional
        } )
   *
   */

  Popcorn.plugin( "lowerthird", {

      manifest: {
        about:{
          name: "Popcorn lowerthird Plugin",
          version: "0.1",
          author: "Scott Downe",
          website: "http://scottdowne.wordpress.com/"
        },
        options:{
          start: {
            elem: "input",
            type: "text",
            label: "In"
          },
          end: {
            elem: "input",
            type: "text",
            label: "Out"
          },
          target: "lowerthird-container",
          salutation : {
            elem: "input",
            type: "text",
            label: "Text"
          },
          name: {
            elem: "input",
            type: "text",
            label: "Text"
          },
          role: {
            elem: "input",
            type: "text",
            label: "Text"
          }
        }
      },

      _setup: function( options ) {

        var target = document.getElementById( options.target );

        // Creates a div for all Lower Thirds to use
        if ( !this.container ) {
          this.container = document.createElement( "div" );

          this.container.style.position = "absolute";
          this.container.style.color = "white";
          this.container.style.textShadow = "black 2px 2px 6px";
          this.container.style.fontSize = "24px";
          this.container.style.fontWeight = "bold";
          this.container.style.paddingLeft = "40px";

          // the video element must have height and width defined
          this.container.style.width = this.video.offsetWidth + "px";
          this.container.style.left = this.position().left + "px";

          this.video.parentNode.appendChild( this.container );
        }

        // if a target is specified, use that
        if ( options.target && options.target !== "lowerthird-container" ) {
          options.container = document.createElement( "div" );
          if ( !target && Popcorn.plugin.debug ) {
            throw new Error( "target container doesn't exist" );
          }
          target && target.appendChild( options.container );
        // use shared default container
        } else {
          options.container = this.container;
        }

      },
      /**
       * @member lowerthird
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function(event, options){
        options.container.innerHTML = ( options.salutation ? options.salutation + " " : "" ) + options.name + ( options.role ? "<br />" + options.role : "" );
        this.container.style.top = this.position().top + this.video.offsetHeight - ( 40 + this.container.offsetHeight ) + "px";
      },
      /**
       * @member lowerthird
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        options.container.innerHTML = "";
      }

  });
})( Popcorn );
// PLUGIN: Google Feed
(function ( Popcorn ) {

  var i = 1,
      scriptLoaded  = false;

  /**
   * googlefeed popcorn plug-in
   * Adds a feed from the specified blog url at the target div
   * Options parameter will need a start, end, target, url and title
   * -Start is the time that you want this plug-in to execute
   * -End is the time that you want this plug-in to stop executing
   * -Target is the id of the DOM element that you want the map to appear in. This element must be in the DOM
   * -Url is the url of the blog's feed you are trying to access
   * -Title is the title of the blog you want displayed above the feed
   * -Orientation is the orientation of the blog, accepts either Horizontal or Vertical, defaults to Vertical
   * @param {Object} options
   *
   * Example:
    var p = Popcorn("#video")
      .googlefeed({
       start: 5, // seconds
       end: 15, // seconds
       target: "map",
       url: "http://zenit.senecac.on.ca/~chris.tyler/planet/rss20.xml",
       title: "Planet Feed"
    } )
  *
  */

  Popcorn.plugin( "googlefeed", function( options ) {

    var dynamicFeedLoad = function() {
      var dontLoad = false,
          k = 0,
          links = document.getElementsByTagName( "link" ),
          len = links.length,
          head = document.head || document.getElementsByTagName( "head" )[ 0 ],
          css = document.createElement( "link" ),
          resource = "//www.google.com/uds/solutions/dynamicfeed/gfdynamicfeedcontrol.";

      if ( !window.GFdynamicFeedControl ) {

        Popcorn.getScript( resource + "js", function() {
          scriptLoaded = true;
        });

      } else {
        scriptLoaded = true;
      }

      //  Checking if the css file is already included
      for ( ; k < len; k++ ){
        if ( links[ k ].href === resource + "css" ) {
          dontLoad = true;
        }
      }

      if ( !dontLoad ) {
        css.type = "text/css";
        css.rel = "stylesheet";
        css.href =  resource + "css";
        head.insertBefore( css, head.firstChild );
      }
    };

    if ( !window.google ) {

      Popcorn.getScript( "//www.google.com/jsapi", function() {

        google.load( "feeds", "1", {

          callback: function () {

            dynamicFeedLoad();
          }
        });
      });

    } else {
      dynamicFeedLoad();
    }

    // create a new div and append it to the parent div so nothing
    // that already exists in the parent div gets overwritten
    var newdiv = document.createElement( "div" ),
        target = document.getElementById( options.target ),
    initialize = function() {
      //ensure that the script has been loaded
      if ( !scriptLoaded ) {
        setTimeout( function () {
          initialize();
        }, 5 );
      } else {
        // Create the feed control using the user entered url and title
        options.feed = new GFdynamicFeedControl( options.url, newdiv, {
          vertical: options.orientation.toLowerCase() === "vertical" ? true : false,
          horizontal: options.orientation.toLowerCase() === "horizontal" ? true : false,
          title: options.title = options.title || "Blog"
        });
      }
    };

    // Default to vertical orientation if empty or incorrect input
    if( !options.orientation || ( options.orientation.toLowerCase() !== "vertical" &&
      options.orientation.toLowerCase() !== "horizontal" ) ) {
      options.orientation = "vertical";
    }

    newdiv.style.display = "none";
    newdiv.id = "_feed" + i;
    newdiv.style.width = "100%";
    newdiv.style.height = "100%";
    i++;

    if ( !target && Popcorn.plugin.debug ) {
      throw new Error( "target container doesn't exist" );
    }
    target && target.appendChild( newdiv );

    initialize();

    return {
      /**
       * @member webpage
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function( event, options ){
        newdiv.setAttribute( "style", "display:inline" );
      },
      /**
       * @member webpage
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function( event, options ){
        newdiv.setAttribute( "style", "display:none" );
      },
      _teardown: function( options ) {
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( newdiv );
        delete options.feed;
      }
    };
  },
  {
    about: {
      name: "Popcorn Google Feed Plugin",
      version: "0.1",
      author: "David Seifried",
      website: "dseifried.wordpress.com"
    },
    options: {
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target: "feed-container",
      url: {
        elem: "input",
        type: "url",
        label: "url"
      },
      title: {
        elem: "input",
        type: "text",
        label: "title"
      },
      orientation: {
        elem: "select",
        options: [ "Vertical", "Horizontal" ],
        label: "orientation"
      }
    }
  });
})( Popcorn );
// PLUGIN: Subtitle

(function ( Popcorn ) {

  var i = 0,
      createDefaultContainer = function( context, id ) {

        var ctxContainer = context.container = document.createElement( "div" ),
            style = ctxContainer.style,
            media = context.media;

        var updatePosition = function() {
          var position = context.position();
          // the video element must have height and width defined
          style.fontSize = "18px";
          style.width = media.offsetWidth + "px";
          style.top = position.top  + media.offsetHeight - ctxContainer.offsetHeight - 40 + "px";
          style.left = position.left + "px";

          setTimeout( updatePosition, 10 );
        };

        ctxContainer.id = id || Popcorn.guid();
        style.position = "absolute";
        style.color = "white";
        style.textShadow = "black 2px 2px 6px";
        style.fontWeight = "bold";
        style.textAlign = "center";

        updatePosition();

        context.media.parentNode.appendChild( ctxContainer );

        return ctxContainer;
      };

  /**
   * Subtitle popcorn plug-in
   * Displays a subtitle over the video, or in the target div
   * Options parameter will need a start, and end.
   * Optional parameters are target and text.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Target is the id of the document element that the content is
   *  appended to, this target element must exist on the DOM
   * Text is the text of the subtitle you want to display.
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .subtitle({
          start:            5,                 // seconds, mandatory
          end:              15,                // seconds, mandatory
          text:             'Hellow world',    // optional
          target:           'subtitlediv',     // optional
        } )
   *
   */

  Popcorn.plugin( "subtitle" , {

      manifest: {
        about: {
          name: "Popcorn Subtitle Plugin",
          version: "0.1",
          author: "Scott Downe",
          website: "http://scottdowne.wordpress.com/"
        },
        options: {
          start: {
            elem: "input",
            type: "text",
            label: "In"
          },
          end: {
            elem: "input",
            type: "text",
            label: "Out"
          },
          target: "subtitle-container",
          text: {
            elem: "input",
            type: "text",
            label: "Text"
          }
        }
      },

      _setup: function( options ) {
        var newdiv = document.createElement( "div" );

        newdiv.id = "subtitle-" + i++;
        newdiv.style.display = "none";

        // Creates a div for all subtitles to use
        ( !this.container && ( !options.target || options.target === "subtitle-container" ) ) &&
          createDefaultContainer( this );

        // if a target is specified, use that
        if ( options.target && options.target !== "subtitle-container" ) {
          // In case the target doesn't exist in the DOM
          options.container = document.getElementById( options.target ) || createDefaultContainer( this, options.target );
        } else {
          // use shared default container
          options.container = this.container;
        }

        document.getElementById( options.container.id ) && document.getElementById( options.container.id ).appendChild( newdiv );
        options.innerContainer = newdiv;

        options.showSubtitle = function() {
          options.innerContainer.innerHTML = options.text || "";
        };
      },
      /**
       * @member subtitle
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ){
        options.innerContainer.style.display = "inline";
        options.showSubtitle( options, options.text );
      },
      /**
       * @member subtitle
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        options.innerContainer.style.display = "none";
        options.innerContainer.innerHTML = "";
      },

      _teardown: function ( options ) {
        options.container.removeChild( options.innerContainer );
      }

  });

})( Popcorn );
// PLUGIN: tagthisperson

(function ( Popcorn ) {

  var peopleArray = [];
  // one People object per options.target
  var People = function() {
    this.name = "";
    this.contains = { };
    this.toString = function() {
      var r = [];
      for ( var j in this.contains ) {
        if ( this.contains.hasOwnProperty( j ) ) {
          r.push( " " + this.contains[ j ] );
        }
      }
      return r.toString();
    };
  };

  /**
   * tagthisperson popcorn plug-in
   * Adds people's names to an element on the page.
   * Options parameter will need a start, end, target, image and person.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Person is the name of the person who you want to tag
   * Image is the url to the image of the person - optional
   * href is the url to the webpage of the person - optional
   * Target is the id of the document element that the text needs to be
   * attached to, this target element must exist on the DOM
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .tagthisperson({
          start: 5, // seconds
          end: 15, // seconds
          person: '@annasob',
          image:  'http://newshour.s3.amazonaws.com/photos%2Fspeeches%2Fguests%2FRichardNSmith_thumbnail.jpg',
          href:   'http://annasob.wordpress.com',
          target: 'tagdiv'
        } )
   *
   */
  Popcorn.plugin( "tagthisperson" , ( function() {

    return {

      _setup: function( options ) {
        var exists = false,
            target = document.getElementById( options.target );

        if ( !target && Popcorn.plugin.debug ) {
          throw new Error( "target container doesn't exist" );
        }

        // loop through the existing objects to ensure no duplicates
        // the idea here is to have one object per unique options.target
        for ( var i = 0; i < peopleArray.length; i++ ) {
          if ( peopleArray[ i ].name === options.target ) {
            options._p = peopleArray[ i ];
            exists = true;
            break;
          }
        }
        if ( !exists ) {
          options._p = new People();
          options._p.name = options.target;
          peopleArray.push( options._p );
        }
      },
      /**
       * @member tagthisperson
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ){
        options._p.contains[ options.person ] = ( options.image ) ? "<img src='" + options.image + "'/> " : "" ;
        options._p.contains[ options.person ] += ( options.href ) ? "<a href='" + options.href + "' target='_blank'> " + options.person + "</a>" : options.person ;

        document.getElementById( options.target ).innerHTML = options._p.toString();
      },
      /**
       * @member tagthisperson
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ){
        delete options._p.contains[ options.person ];

        document.getElementById( options.target ).innerHTML = options._p.toString();
      }
   };
  })(),
  {
    about:{
      name: "Popcorn tagthisperson Plugin",
      version: "0.1",
      author: "@annasob",
      website: "annasob.wordpress.com"
    },
    options:{
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target : "tagthisperson-container",
      person: {
        elem: "input",
        type: "text",
        label: "Name"
      },
      image: {
        elem: "input",
        type: "url",
        label: "Image Src"
      },
      href: {
        elem: "input",
        type: "url",
        label: "URL"
      }
    }
  });

})( Popcorn );
// PLUGIN: TWITTER

(function ( Popcorn ) {
  var scriptLoading = false;

  /**
   * Twitter popcorn plug-in
   * Appends a Twitter widget to an element on the page.
   * Options parameter will need a start, end, target and source.
   * Optional parameters are height and width.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Src is the hash tag or twitter user to get tweets from
   * Target is the id of the document element that the images are
   *  appended to, this target element must exist on the DOM
   * Height is the height of the widget, defaults to 200
   * Width is the width of the widget, defaults to 250
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .twitter({
          start:          5,                // seconds, mandatory
          end:            15,               // seconds, mandatory
          src:            '@stevesong',     // mandatory, also accepts hash tags
          height:         200,              // optional
          width:          250,              // optional
          target:         'twitterdiv'      // mandatory
        } )
   *
   */

  Popcorn.plugin( "twitter" , {

      manifest: {
        about: {
          name: "Popcorn Twitter Plugin",
          version: "0.1",
          author: "Scott Downe",
          website: "http://scottdowne.wordpress.com/"
        },
        options:{
          start: {
            elem: "input",
            type: "number",
            label: "In"
          },
          end: {
            elem: "input",
            type: "number",
            label: "Out"
          },
          src: {
            elem: "input",
            type: "text",
            label: "Source"
          },
          target: "twitter-container",
          height: {
            elem: "input",
            type: "number",
            label: "Height"
          },
          width: {
            elem: "input",
            type: "number",
            label: "Width"
          }
        }
      },

      _setup: function( options ) {

        if ( !window.TWTR && !scriptLoading ) {
          scriptLoading = true;
          Popcorn.getScript( "//widgets.twimg.com/j/2/widget.js" );
        }

        var target = document.getElementById( options.target );
        // create the div to store the widget
        // setup widget div that is unique per track
        options.container = document.createElement( "div" );
        // use this id to connect it to the widget
        options.container.setAttribute( "id", Popcorn.guid() );
        // display none by default
        options.container.style.display = "none";

        if ( !target && Popcorn.plugin.debug ) {
          throw new Error( "target container doesn't exist" );
        }
         // add the widget's div to the target div
        target && target.appendChild( options.container );

        // setup info for the widget
        var src = options.src || "",
            width = options.width || 250,
            height = options.height || 200,
            profile = /^@/.test( src ),
            widgetOptions = {
              version: 2,
              // use this id to connect it to the div
              id: options.container.getAttribute( "id" ),
              rpp: 30,
              width: width,
              height: height,
              interval: 6000,
              theme: {
                shell: {
                  background: "#ffffff",
                  color: "#000000"
                },
                tweets: {
                  background: "#ffffff",
                  color: "#444444",
                  links: "#1985b5"
                }
              },
              features: {
                loop: true,
                timestamp: true,
                avatars: true,
                hashtags: true,
                toptweets: true,
                live: true,
                scrollbar: false,
                behavior: 'default'
              }
            };

        // create widget
        var isReady = function( that ) {
          if ( window.TWTR ) {
            if ( profile ) {

              widgetOptions.type = "profile";

              new TWTR.Widget( widgetOptions ).render().setUser( src ).start();

            } else {

              widgetOptions.type = "search";
              widgetOptions.search = src;
              widgetOptions.subject = src;

              new TWTR.Widget( widgetOptions ).render().start();

            }
          } else {
            setTimeout( function() {
              isReady( that );
            }, 1);
          }
        };

        isReady( this );
      },

      /**
       * @member Twitter
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        options.container.style.display = "inline";
      },

      /**
       * @member Twitter
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        options.container.style.display = "none";
      },
      _teardown: function( options ) {

        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options.container );
      }
    });

})( Popcorn );
// PLUGIN: WEBPAGE

(function ( Popcorn ) {

  /**
   * Webpages popcorn plug-in
   * Creates an iframe showing a website specified by the user
   * Options parameter will need a start, end, id, target and src.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Id is the id that you want assigned to the iframe
   * Target is the id of the document element that the iframe needs to be attached to,
   * this target element must exist on the DOM
   * Src is the url of the website that you want the iframe to display
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .webpage({
          id: "webpages-a",
          start: 5, // seconds
          end: 15, // seconds
          src: 'http://www.webmademovies.org',
          target: 'webpagediv'
        } )
   *
   */
  Popcorn.plugin( "webpage" , {
    manifest: {
      about: {
        name: "Popcorn Webpage Plugin",
        version: "0.1",
        author: "@annasob",
        website: "annasob.wordpress.com"
      },
      options: {
        id: {
          elem: "input",
          type: "text",
          label: "Id"
        },
        start: {
          elem: "input",
          type: "text",
          label: "In"
        },
        end: {
          elem: "input",
          type: "text",
          label: "Out"
        },
        src: {
          elem: "input",
          type: "url",
          label: "Src"
        },
        target: "iframe-container"
      }
    },
    _setup: function( options ) {

      var target = document.getElementById( options.target );

      // make src an iframe acceptable string
      options.src = options.src.replace( /^(https?:)?(\/\/)?/, "//" );

      // make an iframe
      options._iframe = document.createElement( "iframe" );
      options._iframe.setAttribute( "width", "100%" );
      options._iframe.setAttribute( "height", "100%" );
      options._iframe.id = options.id;
      options._iframe.src = options.src;
      options._iframe.style.display = "none";

      if ( !target && Popcorn.plugin.debug ) {
        throw new Error( "target container doesn't exist" );
      }

      // add the hidden iframe to the DOM
      target && target.appendChild( options._iframe );

    },
    /**
     * @member webpage
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function( event, options ){
      // make the iframe visible
      options._iframe.src = options.src;
      options._iframe.style.display = "inline";
    },
    /**
     * @member webpage
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function( event, options ){
      // make the iframe invisible
      options._iframe.style.display = "none";
    },
    _teardown: function( options ) {

      document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._iframe );
    }
  });
})( Popcorn );
// PLUGIN: WIKIPEDIA


var wikiCallback;

(function ( Popcorn ) {
  
  /**
   * Wikipedia popcorn plug-in 
   * Displays a wikipedia aricle in the target specified by the user by using
   * new DOM element instead overwriting them
   * Options parameter will need a start, end, target, lang, src, title and numberofwords.
   * -Start is the time that you want this plug-in to execute
   * -End is the time that you want this plug-in to stop executing 
   * -Target is the id of the document element that the text from the article needs to be  
   * attached to, this target element must exist on the DOM
   * -Lang (optional, defaults to english) is the language in which the article is in.
   * -Src is the url of the article 
   * -Title (optional) is the title of the article
   * -numberofwords (optional, defaults to 200) is  the number of words you want displaid.  
   *
   * @param {Object} options
   * 
   * Example:
     var p = Popcorn("#video")
        .wikipedia({
          start: 5, // seconds
          end: 15, // seconds
          src: "http://en.wikipedia.org/wiki/Cape_Town",
          target: "wikidiv"
        } )
   *
   */
  Popcorn.plugin( "wikipedia" , {
      
    manifest: {
      about:{
        name: "Popcorn Wikipedia Plugin",
        version: "0.1",
        author: "@annasob",
        website: "annasob.wordpress.com"
      },
      options:{
        start: {
          elem: "input", 
          type: "text", 
          label: "In"
        },
        end: {
          elem: "input", 
          type: "text", 
          label: "Out"
        },
        lang: {
          elem: "input", 
          type: "text", 
          label: "Language"
        },
        src: {
          elem: "input", 
          type: "url", 
          label: "Src"
        },
        title: {
          elem: "input", 
          type: "text", 
          label: "Title"
        },
        numberofwords: {
          elem: "input", 
          type: "text", 
          label: "Num Of Words"
        },
        target: "wikipedia-container"
      }
    },
    /**
     * @member wikipedia 
     * The setup function will get all of the needed 
     * items in place before the start function is called. 
     * This includes getting data from wikipedia, if the data
     * is not received and processed before start is called start 
     * will not do anything
     */
    _setup : function( options ) {
      // declare needed variables
      // get a guid to use for the global wikicallback function
      var  _text, _guid = Popcorn.guid(); 
      
      // if the user didn't specify a language default to english
      if ( !options.lang ) { 
        options.lang = "en"; 
      }

      // if the user didn't specify number of words to use default to 200 
      options.numberofwords  = options.numberofwords || 200;
            
      // wiki global callback function with a unique id
      // function gets the needed information from wikipedia
      // and stores it by appending values to the options object
      window[ "wikiCallback" + _guid ]  = function ( data ) { 

        options._link = document.createElement( "a" );
        options._link.setAttribute( "href", options.src );
        options._link.setAttribute( "target", "_blank" );

        // add the title of the article to the link
        options._link.innerHTML = options.title || data.parse.displaytitle;

        // get the content of the wiki article
        options._desc = document.createElement( "p" );

        // get the article text and remove any special characters
        _text = data.parse.text[ "*" ].substr( data.parse.text[ "*" ].indexOf( "<p>" ) );
        _text = _text.replace( /((<(.|\n)+?>)|(\((.*?)\) )|(\[(.*?)\]))/g, "" );
        
        _text = _text.split( " " );
        options._desc.innerHTML = ( _text.slice( 0, ( _text.length >= options.numberofwords ? options.numberofwords : _text.length ) ).join (" ") + " ..." ) ;
        
        options._fired = true;
      };
      
      if ( options.src ) {
        Popcorn.getScript( "//" + options.lang + ".wikipedia.org/w/api.php?action=parse&props=text&page=" + 
          options.src.slice( options.src.lastIndexOf( "/" ) + 1 )  + "&format=json&callback=wikiCallback" + _guid );
      } else if ( Popcorn.plugin.debug ) {
        throw new Error( "Wikipedia plugin needs a 'src'" );
      }

    },
    /**
     * @member wikipedia 
     * The start function will be executed when the currentTime 
     * of the video  reaches the start time provided by the 
     * options variable
     */
    start: function( event, options ){
      // dont do anything if the information didn't come back from wiki
      var isReady = function () {
        
        if ( !options._fired ) {
          setTimeout( function () {
            isReady();
          }, 13);
        } else {
      
          if ( options._link && options._desc ) {
            if ( document.getElementById( options.target ) ) {
              document.getElementById( options.target ).appendChild( options._link );
              document.getElementById( options.target ).appendChild( options._desc );
              options._added = true;
            }
          }
        }
      };
      
      isReady();
    },
    /**
     * @member wikipedia 
     * The end function will be executed when the currentTime 
     * of the video  reaches the end time provided by the 
     * options variable
     */
    end: function( event, options ){
      // ensure that the data was actually added to the 
      // DOM before removal
      if ( options._added ) {
        document.getElementById( options.target ).removeChild( options._link );
        document.getElementById( options.target ).removeChild( options._desc );
      }
    },

    _teardown: function( options ){

      if ( options._added ) {
        options._link.parentNode && document.getElementById( options.target ).removeChild( options._link );
        options._desc.parentNode && document.getElementById( options.target ).removeChild( options._desc );
        delete options.target;
      }
    }
  });

})( Popcorn );
// PLUGIN: Tumblr

(function( Popcorn, global ) {

  /**
  * Tumblr Popcorn Plugin.
  * Adds elements to the page from selected blog.
  * Start is the time that you want this plug-in to execute
  * End is the time that you want this plug-in to stop executing
  * ApiKey is the API key registered with Tumblr for use with their API.
  *  The ApiKey is required for Blog Info and to retrieve published blog
  *  posts.
  *
  * Test tumblr site is here: http://tumblrplugin.tumblr.com/
  *
  * @param {Object} options
  *
  * Example:
    var p = Popcorn('#video')
      .tumblr({
        start: 5,                     // seconds, mandatory
        end: 15,                      // seconds, mandatory
        requestType: 'blogpost',      // mandatory
        target: 'tumblrBlogInfodiv',  // mandatory
        base_hostname: "john.io",     // mandatory
        blogId: 123456789,            // Mandatory if requestType is 'blogpost'
        api_key: ew29j2o1mw91m1wom1s9 // Mandatory is requestType is 'blogpost' or 'info'
      } )
  *
  */

  var processBlogPost = {
    text: function( options ) {
      var post = options.post,
          link = document.createElement( "a" ),
          linkText = document.createTextNode( post.title ),
          linkDiv = document.createElement( "div" );

      link.setAttribute( "href", post.post_url );
      link.appendChild( linkText );
      linkDiv.appendChild( link );
      linkDiv.innerHTML += post.body;
      options._container.appendChild( linkDiv );

    },
    photo: function( options ) {
      var width = options.width || 250, defaultSizeIndex = -1,
          picCaptions = [ options.post.photos.length ],
          picURIs = [ options.post.photos.length ],
          picDiv = document.createElement( "div" ),
          pic = document.createElement( "img" ),
          post = options.post;

      // Finds the correct photo based on specified size, saves URI and Caption]
      for ( var i = 0, len = post.photos.length; i < len; i++ ) {
        // Store the current photo object being accessed
        var photo = post.photos[ i ],
            photoSizes = photo.alt_sizes;

        for ( var k = 0, len2 = photoSizes.length; k < len2; k++ ) {
          // Store the current alt_sizes object being accessed
          var size = photoSizes[ k ];

          // See If users desired photo size is in returned JSON
          if ( size.width === width ) {
            picURIs[ i ] = size.url;
            picCaptions[ i ] = photo.caption;
            defaultSizeIndex = 0;
            break;
          } else {
            // Our default size is going to be 250
            if( size.width === 250 ){
              defaultSizeIndex = k;
            }
          }
        }

        // Current means of handling if alt_sizes doesn't have our default image size
        defaultSizeIndex === -1 && Popcorn.error( "Clearly your blog has a picture that is so tiny it isn't even 250px wide. Consider " + 
          " using a bigger picture or try a smaller size." );

        // If a matching photo is never found, use the default size.
        if ( k === photoSizes.length ) {
          picURIs[ i ] = photoSizes[ defaultSizeIndex ].url;
        }
      }

      // Finally, all the potential setup is done. Below is the actual code putting everything in our div element
      for ( var m = 0, len3 = picURIs.length; m < len3; m++ ) {
        picDiv.innerHTML += picCaptions[ m ] + "<br/>";
        pic.setAttribute( "src", picURIs[ m ] );
        pic.setAttribute( "alt", "Pic" + m );
        picDiv.appendChild( pic );
        picDiv.innerHTML += "<br/>";
      }
      picDiv.innerHTML += "<br/>" + post.caption;
      options._container.appendChild( picDiv );
    },
    audio: function( options ) {
      var artistDiv = document.createElement( "div" ),
          artistLink = document.createElement( "a" ),
          post = options.post;
      // Artist/Track info is not always returned so checking first.
      // Truth be told I have no idea if this will ever be returned. Their API specified it as responses but no
      // matter how much I tried myself to replicate it in a test I couldn't ever get a response that included
      // this info.
      if ( !post.artist ) {
        var artistText = document.createTextNode( post.source_title );

        artistLink.setAttribute( "href", post.source_url );
        artistLink.appendChild( artistText );
        artistDiv.appendChild( artistLink );
        artistDiv.innerHTML += "<br/>";
      } else {
        var artistImage = document.createElement( "img" );

        artistDiv.innerHTML += "Artist: " + post.artist + "<br/>";
        artistLink.setAttribute( "href", post.source_url );

        // Construct Image
        artistImage.setAttribute( "src", post.album_art );
        artistImage.setAttribute( "alt", post.album );

        // Set Image for link, append to div
        artistLink.appendChild( artistImage );
        artistDiv.appendChild( artistLink );

        // Construct rest of plain old text
        artistDiv.innerHTML += "<hr/>" + post.track_number + " - " + post.track_name + "<br/>";
      }
      // Obviously the player itself is something that will be displayed either way so it is included outside the check
      artistDiv.innerHTML += post.player + "   " + post.plays + "plays<br/>" + post.caption;
      options._container.appendChild( artistDiv );
    },
    video: function( options ) {
      var width = options.width || 400,
          defaultSizeIndex = -1,
          post = options.post,
          videoDiv = document.createElement( "div" ),
          videoCode;

      for ( var i = 0, len = post.player.length; i < len; i++ ) {
      // First try to see if the current index matches the specified width
      // If it doesn't, check if it equals our default width incase user didn't
      // ever specify a width or if their width is never found.

        // Store current player object being accessed
        var video = post.player[ i ];

        if ( video.width === width ) {
          videoCode = video.embed_code;
          defaultSizeIndex = 0;
          break;
        } else {
          if( video.width === 400 ) {
            defaultSizeIndex = i;
          }
        }
      }

      // If specified width never found, use default
      if ( i === options.post.player.length ) {
        videoCode = post.player[ defaultSizeIndex ].embed_code;
      }

      // Will run if user's size is never found and our default is never found
      defaultSizeIndex === -1 && Popcorn.error( "Specified video size was not found and default was never found. Please try another width." );

      // Finally build the html for the div element
      videoDiv.innerHTML += videoCode + "<br/>" + post.caption;
      options._container.appendChild( videoDiv );
    },
    chat: function( options ) {
      var post = options.post,
          dialogue,
          chatDiv = document.createElement( "div" );

      // Brainstorm up ideas how to make each dialogue object to appear up "better" rather than just all be there at once
      chatDiv.innerHTML += "<strong><u>" + post.title + "</u></strong><br/><br/>";

      for ( var i = 0, len = post.dialogue.length; i < len; i++ ) {
        dialogue = post.dialogue[ i ];
        chatDiv.innerHTML += dialogue.label + " " + dialogue.phrase + "<br/>";
      }

      // Append it to the parent container
      options._container.appendChild( chatDiv );
    },
    quote: function( options ) {
      var quoteDiv = document.createElement( "div" ),
          quoteLink = document.createElement( "a" ),
          post = options.post,
          quoteLinkText = document.createTextNode( post.text );

      // Quotes don't come with a title, so for a link to the post I'm going to use the blogname
      quoteLink.setAttribute( "href", post.post_url );
      quoteLink.appendChild( quoteLinkText );

      // Append link, finish adding in plain text
      quoteDiv.appendChild( quoteLink );
      quoteDiv.innerHTML += "<br/><br/>Source: <b>" + post.source + "</b>";

      // Append div to parent container
      options._container.appendChild( quoteDiv );
    },
    link: function( options ) {
      var linkDiv = document.createElement( "div" ),
          link = document.createElement( "a" ),
          post = options.post,
          linkText = document.createTextNode( post.title );

      // Using the blog title as a link to it
      link.setAttribute( "href", post.post_url );
      link.appendChild( linkText );
      linkDiv.appendChild( link );
      linkDiv.innerHTML += "<br/>" + post.description;

      // Append to parent container
      options._container.appendChild( linkDiv );
    },
    answer: function( options ) {
      var answerDiv = document.createElement( "div" ),
          link = document.createElement( "a" ),
          post = options.post,
          linkText = document.createTextNode( post.asking_name );

      answerDiv.innerHTML = "Inquirer: ";
      link.setAttribute( "href", post.asking_url );
      link.appendChild( linkText );
      answerDiv.appendChild( link );
      answerDiv.innerHTML += "<br/><br/>Question: " + post.question + "<br/>Answer: " + post.answer;

      // Append to parent container
      options._container.appendChild( answerDiv );
    }
  };

  Popcorn.plugin( "tumblr" , {
    manifest: {
      about: {
        name: "Popcorn Tumblr Plugin",
        version: "0.1",
        author: "Matthew Schranz, @mjschranz",
        website: "mschranz.wordpress.com"
      },
      options: {
        requestType: {
          elem: "select",
          options:[ "INFO", "AVATAR", "BLOGPOST" ],
          label: "Type_Of_Plugin"
        },
        target: "tumblr-container",
        start: {
          elem: "input",
          type: "number",
          label: "Start_Time"
        },
        end: {
          elem: "input",
          type: "number",
          label: "End_Time"
        },
        base_hostname: {
          elem: "input",
          type: "text",
          label: "User_Name"
        },
        // optional parameters:
        api_key: { // Required for Blog Info and Blog Post retrievals
          elem: "input",
          type: "text",
          label: "Application_Key"
        },
        size: {
          elem: "select",
          options: [ 16, 24, 30, 40, 48, 64, 96, 128, 512 ],
          label: "avatarSize"
        },
        blogId: { // Required for BLOGPOST requests
          elem: "input",
          type: "number",
          label: "Blog_ID"
        },
        /* Optional for Photo and Video BlogPosts, defaulted to 250 pixels for photos and 400 for videos if not provided or provided width
        * is not found in their arrays. If multiple videos or photos are in the blogpost then it will use this same size for all of them unless
        * it is not found, which it will then use the default. If default is not present an error will be thrown.
        */
        width: {
          elem: "input",
          type: "number",
          label: "Photo_Width"
        }
      }
    },
    _setup: function( options ) {
      var target = document.getElementById( options.target ),
          requestString,
          uri,
          blogHTTPHeader,
          uriNoHeader,
          uriFinal,
          type;

      // Valid types of retrieval requests
      var validType = function( type ) {
        return ( [ "info", "avatar", "blogpost" ].indexOf( type ) > -1 );
      };

      // Lowercase the types incase user enters it in another way
      options.requestType = options.requestType.toLowerCase();

      // Check if blog url ( base_hostname ) is blank and api_key is included on info and blogpost requestType
      ( !options.base_hostname || ( !options.api_key && ( options.requestType === "info" || options.requestType === "blogpost" ) ) ) &&
        Popcorn.error( "Must provide a blog URL to the plugin and an api_key for Blog Info and Blog Post requests." );

      // Check Request Type
      !validType( options.requestType ) && Popcorn.error( "Invalid tumblr plugin type." );

      // Check if a blogID is supplied
      ( options.requestType === "blogpost" && options.blogId === undefined ) && Popcorn.error( "Error. BlogId required for blogpost requests" );

      // Check if target container exists
      ( !target && Popcorn.plugin.debug ) && Popcorn.error( "Target Tumblr container doesn't exist." );

      // Checks if user included any http header in the url and removes it if that's the case as request don't work with it
      uri = options.base_hostname.slice( ( options.base_hostname.indexOf( "/" ) + 2 ), options.base_hostname.length );
      blogHTTPHeader = options.base_hostname.slice( 0, ( options.base_hostname.indexOf( "/" ) + 2 ) );
      uriNoHeader = blogHTTPHeader === "http://" || blogHTTPHeader === "https://" ? uri : options.base_hostname;
      if ( uriNoHeader.indexOf( "/" ) > -1 ){
        uriNoHeader = uriNoHeader.slice( 0, uriNoHeader.indexOf( "/" ) );
      }
      options.base_hostname = uriNoHeader;

      // Create seperate container for plugin
      options._container = document.createElement( "div" );
      options._container.id = "tumblrdiv-" + Popcorn.guid();

      if ( options.requestType === "avatar" ) {
        options._container.innerHTML = "<img src=" + 'http://api.tumblr.com/v2/blog/' + options.base_hostname + '/avatar/' + options.size + " alt='BlogAvatar' />";
      } else {
        // Construct type based if it's a blogpost or blog info as request string differs
        if ( options.requestType === "blogpost" ) {
          type = "posts";
        } else {
          type = "info";
        }
        requestString = "http://api.tumblr.com/v2/blog/" + options.base_hostname + "/" + type + "?api_key=" + options.api_key + "&id=" + options.blogId + 
          "&jsonp=tumblrCallBack";

        Popcorn.getJSONP( requestString, function( data ) {
          if ( data.meta.msg === "OK" ) {
            var commonDiv = document.createElement( "div" );
            if ( options.requestType === "blogpost" ) {
              options.post = data.response.posts[ 0 ];
              var blogType = options.post.type,
                  post = options.post,
                  tags = post.tags;

              // date is a response type common to all blogposts so it's in here to prevent duplicated code
              commonDiv.innerHTML = "Date Published: " + options.post.date.slice( 0, options.post.date.indexOf( " " ) ) + "<br/>";
              // Check if tags were used for the post, append them to commonDiv
              if ( tags.length !== 0 ) {
                commonDiv.innerHTML += "Tags: " + tags[ 0 ];
                for ( var i = 1, len = tags.length; i < len; i++ ) {
                  commonDiv.innerHTML += ", " + tags[ i ];
                }
              } else {
                commonDiv.innerHTML += "Tags: No Tags Used";
              }
              // commonDiv is appended at two points because of the difference in how the information
              // is constructed between blogposts and bloginfo
              options._container.appendChild( commonDiv );

              // Processes information and forms an information div based on what the blog type is
              processBlogPost[ blogType ]( options );
            } else {
              // Blog Info Requests
              var link = document.createElement( "a" ),
                  blogInfo = data.response.blog,
                  linkText = document.createTextNode( blogInfo.title );

              link.setAttribute( "href", blogInfo.url );
              link.appendChild( linkText );
              commonDiv.appendChild( link );
              commonDiv.innerHTML += blogInfo.description;
              options._container.appendChild( commonDiv );
            }
          } else {
            // There was an error somewhere down the line that caused the request to fail.
            Popcorn.error( "Error. Request failed. Status code: " + data.meta.status + " - Message: " + data.meta.msg );
          }
        }, false );
      }
      options._container.style.display = "none";
      target && target.appendChild( options._container );
    },
    start: function( event, options ){
      if ( options._container ) {
        options._container.style.display = "";
      }
    },
    end: function( event, options ){
      if( options._container ) {
        options._container.style.display = "none";
      }
    },
    _teardown: function( options ){
      document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
    }
  });
})( Popcorn, this );
//PLUGIN: linkedin

(function ( Popcorn ){

  /**
   * LinkedIn Popcorn plug-in
   * Places a  LinkedIn plugin inside a div ( http://developers.facebook.com/docs/plugins/ )
   * Options parameter will need a start, end, target, type, and an api key
   * Optional parameters are url, counter, format, companyid, and productid
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Target is the id of the document element that the plugin needs to be attached to, this target element must exist on the DOM
   * Type is the name of the plugin, options are share, memberprofile, companyinsider, companyprofile, or recommendproduct
   * Apikey is your own api key from obtained from https://www.linkedin.com/secure/developer
   * Url is the desired url to share via LinkedIn. Defaults to the current page if no url is specified
   * Counter is the position where the counter will be positioned. This is used if the type is "share" or "recommendproduct"
   *  The options are right and top (don't include this option if you do not want a counter)
   * Format is the data format of the member and company profile plugins. The options are inlined, hover, and click. Defaults to inline
   * Companyid must be specified if the type is "companyprofile," "companyinsider," or "recommendproduct"
   * Productid must be specified if the type is "recommendproduct"
   *
   * @param {Object} options
   *
   * Example:
   * <script src="popcorn.linkedin.js"></script>
   * ...
   * var p = Popcorn("#video")
   *     .linkedin({
   *       type: "share",
   *       url: "http://www.google.ca",
   *       counter: "right",
   *       target: "sharediv"
   *       apikey: "ZOLRI2rzQS_oaXELpPF0aksxwFFEvoxAFZRLfHjaAhcGPfOX0Ds4snkJpWwKs8gk",
   *       start: 1,
   *       end: 3
   *     })
   *
   * This plugin will be displayed between 1 and 3 seconds, inclusive, in the video. This will show how many people have "shared" Google via LinkedIn,
   * with the number of people (counter) displayed to the right of the share plugin.
   */
  Popcorn.plugin( "linkedin", {
    manifest: {
      about: {
        name: "Popcorn LinkedIn Plugin",
        version: "0.1",
        author: "Dan Ventura",
        website: "dsventura.blogspot.com"
      },
      options: {
        type: {
          elem: "input",
          type: "text",
          label: "Type"
        },
        url: {
          elem: "input",
          type: "text",
          label: "URL"
        },
        apikey: {
          elem: "input",
          type: "text",
          label: "API Key"
        },
        counter: {
          elem: "input",
          type: "text",
          label: "Counter"
        },
        memberid: {
          elem: "input",
          type: "text",
          label: "Member ID"
        },
        format: {
          elem: "input",
          type: "text",
          label: "Format"
        },
        companyid: {
          elem: "input",
          type: "text",
          label: "Company ID"
        },
        modules: {
          elem: "input",
          type: "text",
          label: "Modules"
        },
        productid: {
          elem: "input",
          type: "text",
          label: "productid"
        },
        related: {
          elem: "input",
          type: "text",
          label: "related"
        },
        start: {
          elem: "input",
          type: "text",
          label: "In"
        },
        end: {
          elem: "input",
          type: "text",
          label: "Out"
        },

        target: "linkedin-container"
      }
    },
    _setup: function( options ) {

      var apikey = options.apikey,
          target = document.getElementById( options.target ),
          script = document.createElement( "script" );

      Popcorn.getScript( "//platform.linkedin.com/in.js" );

      options._container = document.createElement( "div" );
      options._container.appendChild( script );

      if ( apikey ) {
        script.innerHTML = "api_key: " + apikey;
      }

      options.type = options.type && options.type.toLowerCase() || "";

      // Replace the LinkedIn plugin's error message to something more helpful
      var errorMsg = function() {
        options._container = document.createElement( "p" );
        options._container.innerHTML = "Plugin requires a valid <a href='https://www.linkedin.com/secure/developer'>apikey</a>";
        if ( !target && Popcorn.plugin.debug ) {
          throw ( "target container doesn't exist" );
        }
        target && target.appendChild( options._container );
      };

      var setOptions = (function ( options ) {

        return {
          share: function () {

            script.setAttribute( "type", "IN/Share" );

            if ( options.counter ) {
              script.setAttribute( "data-counter", options.counter );
            }
            if ( options.url ) {
              script.setAttribute( "data-url", options.url );
            }
          },
          memberprofile: function () {

            script.setAttribute( "type", "IN/MemberProfile" );
            script.setAttribute( "data-id", ( options.memberid ) );
            script.setAttribute( "data-format", ( options.format || "inline" ) );

            if ( options.text && options.format.toLowerCase() !== "inline" ) {
              script.setAttribute( "data-text", options.text );
            }
          },
          companyinsider: function () {

            script.setAttribute( "type", "IN/CompanyInsider" );
            script.setAttribute( "data-id", options.companyid );

            if( options.modules ) {
              options._container.setAttribute( "data-modules", options.modules );
            }
          },
          companyprofile: function () {

            script.setAttribute( "type", "IN/CompanyProfile" );
            script.setAttribute( "data-id", ( options.companyid ) );
            script.setAttribute( "data-format", ( options.format || "inline" ) );

            if ( options.text && options.format.toLowerCase() !== "inline" ) {
              script.setAttribute( "data-text", options.text );
            }
            if ( options.related !== undefined ) {
              script.setAttribute( "data-related", options.related );
            }
          },
          recommendproduct: function () {

            script.setAttribute( "type", "IN/RecommendProduct" );
            script.setAttribute( "data-company", ( options.companyid || "LinkedIn" ) );
            script.setAttribute( "data-product", ( options.productid || "201714" ) );

            if ( options.counter ) {
              script.setAttribute( "data-counter", options.counter );
            }
          }
        };
      })( options );

      if ( !apikey ) {
        errorMsg();
      } else {
        setOptions[ options.type ] && setOptions[ options.type ]();
      }

      if ( !target && Popcorn.plugin.debug ) {
        throw new Error( "target container doesn't exist" );
      }
      target && target.appendChild( options._container );

      options._container.style.display = "none";
    },
    /**
     * @member linkedin
     * The start function will be executed when the currentTime
     * of the video reaches the start time provided by the
     * options variable
     */
    start: function( event, options ) {
      options._container.style.display = "block";
    },
    /**
     * @member linkedin
     * The end function will be executed when the currentTime
     * of the video reaches the end time provided by the
     * options variable
     */
    end: function( event, options ) {
      options._container.style.display = "none";
    },
    _teardown: function( options ) {
      var tar = document.getElementById( options.target );
      tar && tar.removeChild( options._container );
    }
  });
})( Popcorn );
// PLUGIN: Mustache

(function ( Popcorn ) {

  /**
   * Mustache Popcorn Plug-in
   *
   * Adds the ability to render JSON using templates via the Mustache templating library.
   *
   * @param {Object} options
   *
   * Required parameters: start, end, template, data, and target.
   * Optional parameter: static.
   *
   *   start: the time in seconds when the mustache template should be rendered
   *          in the target div.
   *
   *   end: the time in seconds when the rendered mustache template should be
   *        removed from the target div.
   *
   *   target: a String -- the target div's id.
   *
   *   template: the mustache template for the plugin to use when rendering.  This can be
   *             a String containing the template, or a Function that returns the template's
   *             String.
   *
   *   data: the data to be rendered using the mustache template.  This can be a JSON String,
   *         a JavaScript Object literal, or a Function returning a String or Literal.
   *
   *   dynamic: an optional argument indicating that the template and json data are dynamic
   *            and need to be loaded dynamically on every use.  Defaults to True.
   *
   * Example:
     var p = Popcorn('#video')

        // Example using template and JSON strings.
        .mustache({
          start: 5, // seconds
          end:  15,  // seconds
          target: 'mustache',
          template: '<h1>{{header}}</h1>'                         +
                    '{{#bug}}'                                    +
                    '{{/bug}}'                                    +
                    ''                                            +
                    '{{#items}}'                                  +
                    '  {{#first}}'                                +
                    '    <li><strong>{{name}}</strong></li>'      +
                    '  {{/first}}'                                +
                    '  {{#link}}'                                 +
                    '    <li><a href="{{url}}">{{name}}</a></li>' +
                    '  {{/link}}'                                 +
                    '{{/items}}'                                  +
                    ''                                            +
                    '{{#empty}}'                                  +
                    '  <p>The list is empty.</p>'                 +
                    '{{/empty}}'                                  ,

          data:     '{'                                                        +
                    '  "header": "Colors", '                                   +
                    '  "items": [ '                                            +
                    '      {"name": "red", "first": true, "url": "#Red"}, '    +
                    '      {"name": "green", "link": true, "url": "#Green"}, ' +
                    '      {"name": "blue", "link": true, "url": "#Blue"} '    +
                    '  ],'                                                     +
                    '  'empty': false'                                         +
                    '}',
          dynamic: false // The json is not going to change, load it early.
        } )

        // Example showing Functions instead of Strings.
        .mustache({
          start: 20,  // seconds
          end:   25,  // seconds
          target: 'mustache',
          template: function(instance, options) {
                      var template = // load your template file here...
                      return template;
                    },
          data:     function(instance, options) {
                      var json = // load your json here...
                      return json;
                    }
        } );
  *
  */

  Popcorn.plugin( "mustache" , function( options ){

    var getData, data, getTemplate, template;

    Popcorn.getScript( "https://github.com/janl/mustache.js/raw/master/mustache.js" );

    var shouldReload = !!options.dynamic,
        typeOfTemplate = typeof options.template,
        typeOfData = typeof options.data,
        target = document.getElementById( options.target );

    if ( !target && Popcorn.plugin.debug ) {
      throw new Error( "target container doesn't exist" );
    }
    options.container = target || document.createElement( "div" );

    if ( typeOfTemplate === "function" ) {
      if ( !shouldReload ) {
        template = options.template( options );
      } else {
        getTemplate = options.template;
      }
    } else if ( typeOfTemplate === "string" ) {
      template = options.template;
    } else if ( Popcorn.plugin.debug ) {
      throw new Error( "Mustache Plugin Error: options.template must be a String or a Function." );
    } else {
      template = "";
    }

    if ( typeOfData === "function" ) {
      if ( !shouldReload ) {
        data = options.data( options );
      } else {
        getData = options.data;
      }
    } else if ( typeOfData === "string" ) {
      data = JSON.parse( options.data );
    } else if ( typeOfData === "object" ) {
      data = options.data;
    } else if ( Popcorn.plugin.debug ) {
      throw new Error( "Mustache Plugin Error: options.data must be a String, Object, or Function." );
    } else {
      data = "";
    }

    return {
      start: function( event, options ) {

        var interval = function() {

          if( !window.Mustache ) {
            setTimeout( function() {
              interval();
            }, 10 );
          } else {

            // if dynamic, freshen json data on every call to start, just in case.
            if ( getData ) {
              data = getData( options );
            }

            if ( getTemplate ) {
              template = getTemplate( options );
            }

            var html = Mustache.to_html( template,
                                         data
                                       ).replace( /^\s*/mg, "" );
            options.container.innerHTML = html;
          }
        };

        interval();

      },

      end: function( event, options ) {
        options.container.innerHTML = "";
      },
      _teardown: function( options ) {
        getData = data = getTemplate = template = null;
      }
    };
  },
  {
    about: {
      name: "Popcorn Mustache Plugin",
      version: "0.1",
      author: "David Humphrey (@humphd)",
      website: "http://vocamus.net/dave"
    },
    options: {
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target: "mustache-container",
      template: {
        elem: "input",
        type: "text",
        label: "Template"
      },
      data: {
        elem: "input",
        type: "text",
        label: "Data"
      },
      /* TODO: how to show a checkbox/boolean? */
      dynamic: {
        elem: "input",
        type: "text",
        label: "Dynamic"
      }
    }
  });
})( Popcorn );
// PLUGIN: OPENMAP
( function ( Popcorn ) {

  /**
   * openmap popcorn plug-in
   * Adds an OpenLayers map and open map tiles (OpenStreetMap [default], NASA WorldWind, or USGS Topographic)
   * Based on the googlemap popcorn plug-in. No StreetView support
   * Options parameter will need a start, end, target, type, zoom, lat and lng
   * -Start is the time that you want this plug-in to execute
   * -End is the time that you want this plug-in to stop executing
   * -Target is the id of the DOM element that you want the map to appear in. This element must be in the DOM
   * -Type [optional] either: ROADMAP (OpenStreetMap), SATELLITE (NASA WorldWind / LandSat), or TERRAIN (USGS).  ROADMAP/OpenStreetMap is the default.
   * -Zoom [optional] defaults to 2
   * -Lat and Lng are the coordinates of the map if location is not named
   * -Location is a name of a place to center the map, geocoded to coordinates using TinyGeocoder.com
   * -Markers [optional] is an array of map marker objects, with the following properties:
   * --Icon is the URL of a map marker image
   * --Size [optional] is the radius in pixels of the scaled marker image (default is 14)
   * --Text [optional] is the HTML content of the map marker -- if your popcorn instance is named 'popped', use <script>popped.currentTime(10);</script> to control the video
   * --Lat and Lng are coordinates of the map marker if location is not specified
   * --Location is a name of a place for the map marker, geocoded to coordinates using TinyGeocoder.com
   *  Note: using location requires extra loading time, also not specifying both lat/lng and location will
   * cause a JavaScript error.
   * @param {Object} options
   *
   * Example:
     var p = Popcorn( '#video' )
        .openmap({
          start: 5,
          end: 15,
          type: 'ROADMAP',
          target: 'map',
          lat: 43.665429,
          lng: -79.403323
        })
   *
   */
  var newdiv,
      i = 1;

  function toggle( container, display ) {
    if ( container.map ) {

      container.map.div.style.display = display;
      return;
    }

    setTimeout(function() {
      toggle( container, display );
    }, 10 );
  }

  Popcorn.plugin( "openmap", function( options ){
    var newdiv,
        centerlonlat,
        projection,
        displayProjection,
        pointLayer,
        selectControl,
        popup,
        isGeoReady,
        target = document.getElementById( options.target );

    // create a new div within the target div
    // this is later passed on to the maps api
    newdiv = document.createElement( "div" );
    newdiv.id = "openmapdiv" + i;
    newdiv.style.width = "100%";
    newdiv.style.height = "100%";
    i++;

    if ( !target && Popcorn.plugin.debug ) {
      throw new Error( "target container doesn't exist" );
    }

    target && target.appendChild( newdiv );

    // callback function fires when the script is run
    isGeoReady = function() {
      if ( !window.OpenLayers ) {
        setTimeout(function() {
          isGeoReady();
        }, 50);
      } else {
        if ( options.location ) {
          // set a dummy center at start
          location = new OpenLayers.LonLat( 0, 0 );
          // query TinyGeocoder and re-center in callback
          Popcorn.getJSONP(
            "//tinygeocoder.com/create-api.php?q=" + options.location + "&callback=jsonp",
            function( latlng ) {
              centerlonlat = new OpenLayers.LonLat( latlng[ 1 ], latlng[ 0 ] );
              options.map.setCenter( centerlonlat );
            }
          );
        } else {
          centerlonlat = new OpenLayers.LonLat( options.lng, options.lat );
        }
        options.type = options.type || "ROADMAP";
        if ( options.type === "SATELLITE" ) {
          // add NASA WorldWind / LANDSAT map
          options.map = new OpenLayers.Map( { div: newdiv, "maxResolution": 0.28125, tileSize: new OpenLayers.Size( 512, 512 ) } );
          var worldwind = new OpenLayers.Layer.WorldWind( "LANDSAT", "//worldwind25.arc.nasa.gov/tile/tile.aspx", 2.25, 4, { T: "105" } );
          options.map.addLayer( worldwind );
          displayProjection = new OpenLayers.Projection( "EPSG:4326" );
          projection = new OpenLayers.Projection( "EPSG:4326" );
        }
        else if ( options.type === "TERRAIN" ) {
          // add terrain map ( USGS )
          displayProjection = new OpenLayers.Projection( "EPSG:4326" );
          projection = new OpenLayers.Projection( "EPSG:4326" );
          options.map = new OpenLayers.Map( {div: newdiv, projection: projection } );
          var relief = new OpenLayers.Layer.WMS( "USGS Terraserver", "//terraserver-usa.org/ogcmap.ashx?", { layers: "DRG" } );
          options.map.addLayer( relief );
        } else {
          // add OpenStreetMap layer
          projection = new OpenLayers.Projection( 'EPSG:900913' );
          displayProjection = new OpenLayers.Projection( 'EPSG:4326' );
          centerlonlat = centerlonlat.transform( displayProjection, projection );
          options.map = new OpenLayers.Map( { div: newdiv, projection: projection, "displayProjection": displayProjection } );
          var osm = new OpenLayers.Layer.OSM();
          options.map.addLayer( osm );
        }
        if ( options.map ) {
          options.map.div.style.display = "none";
        }
      }
    };

    isGeoReady();

    return {

      /**
       * @member openmap
       * The setup function will be executed when the plug-in is instantiated
       */
      _setup: function( options ) {

        // insert openlayers api script once
        if ( !window.OpenLayers ) {
          Popcorn.getScript( "//openlayers.org/api/OpenLayers.js" );
        }

        var isReady = function() {
          // wait until OpenLayers has been loaded, and the start function is run, before adding map
          if ( !options.map ) {
            setTimeout(function() {
              isReady();
            }, 13 );
          } else {

            // default zoom is 2
            options.zoom = options.zoom || 2;

            // make sure options.zoom is a number
            if ( options.zoom && typeof options.zoom !== "number" ) {
              options.zoom = +options.zoom;
            }

            // reset the location and zoom just in case the user played with the map
            options.map.setCenter( centerlonlat, options.zoom );
            if ( options.markers ) {
              var layerStyle = OpenLayers.Util.extend( {} , OpenLayers.Feature.Vector.style[ "default" ] ),
                  featureSelected = function( clickInfo ) {
                    clickedFeature = clickInfo.feature;
                    if ( !clickedFeature.attributes.text ) {
                      return;
                    }
                    popup = new OpenLayers.Popup.FramedCloud(
                      "featurePopup",
                      clickedFeature.geometry.getBounds().getCenterLonLat(),
                      new OpenLayers.Size( 120, 250 ),
                      clickedFeature.attributes.text,
                      null,
                      true,
                      function( closeInfo ) {
                        selectControl.unselect( this.feature );
                      }
                    );
                    clickedFeature.popup = popup;
                    popup.feature = clickedFeature;
                    options.map.addPopup( popup );
                  },
                  featureUnSelected = function( clickInfo ) {
                    feature = clickInfo.feature;
                    if ( feature.popup ) {
                      popup.feature = null;
                      options.map.removePopup( feature.popup );
                      feature.popup.destroy();
                      feature.popup = null;
                    }
                  },
                  gcThenPlotMarker = function( myMarker ) {
                    Popcorn.getJSONP(
                      "//tinygeocoder.com/create-api.php?q=" + myMarker.location + "&callback=jsonp",
                      function( latlng ) {
                        var myPoint = new OpenLayers.Geometry.Point( latlng[1], latlng[0] ).transform( displayProjection, projection ),
                            myPointStyle = OpenLayers.Util.extend( {}, layerStyle );
                        if ( !myMarker.size || isNaN( myMarker.size ) ) {
                          myMarker.size = 14;
                        }
                        myPointStyle.pointRadius = myMarker.size;
                        myPointStyle.graphicOpacity = 1;
                        myPointStyle.externalGraphic = myMarker.icon;
                        var myPointFeature = new OpenLayers.Feature.Vector( myPoint, null, myPointStyle );
                        if ( myMarker.text ) {
                          myPointFeature.attributes = {
                            text: myMarker.text
                          };
                        }
                        pointLayer.addFeatures( [ myPointFeature ] );
                      }
                    );
                  };
              pointLayer = new OpenLayers.Layer.Vector( "Point Layer", { style: layerStyle } );
              options.map.addLayer( pointLayer );
              for ( var m = 0, l = options.markers.length; m < l ; m++ ) {
                var myMarker = options.markers[ m ];
                if( myMarker.text ){
                  if( !selectControl ){
                    selectControl = new OpenLayers.Control.SelectFeature( pointLayer );
                    options.map.addControl( selectControl );
                    selectControl.activate();
                    pointLayer.events.on({
                      "featureselected": featureSelected,
                      "featureunselected": featureUnSelected
                    });
                  }
                }
                if ( myMarker.location ) {
                  var geocodeThenPlotMarker = gcThenPlotMarker;
                  geocodeThenPlotMarker( myMarker );
                } else {
                  var myPoint = new OpenLayers.Geometry.Point( myMarker.lng, myMarker.lat ).transform( displayProjection, projection ),
                      myPointStyle = OpenLayers.Util.extend( {}, layerStyle );
                  if ( !myMarker.size || isNaN( myMarker.size ) ) {
                    myMarker.size = 14;
                  }
                  myPointStyle.pointRadius = myMarker.size;
                  myPointStyle.graphicOpacity = 1;
                  myPointStyle.externalGraphic = myMarker.icon;
                  var myPointFeature = new OpenLayers.Feature.Vector( myPoint, null, myPointStyle );
                  if ( myMarker.text ) {
                    myPointFeature.attributes = {
                      text: myMarker.text
                    };
                  }
                  pointLayer.addFeatures( [ myPointFeature ] );
                }
              }
            }
          }
        };

        isReady();
      },

      /**
       * @member openmap
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        toggle( options, "block" );
      },

      /**
       * @member openmap
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
          toggle( options, "none" );
      },

      _teardown: function( options ) {

        target && target.removeChild( newdiv );
        newdiv = map = centerlonlat = projection = displayProjection = pointLayer = selectControl = popup = null;
      }
    };
  },
  {
    about:{
      name: "Popcorn OpenMap Plugin",
      version: "0.3",
      author: "@mapmeld",
      website: "mapadelsur.blogspot.com"
    },
    options:{
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target: "map-container",
      type: {
        elem: "select",
        options: [ "ROADMAP", "SATELLITE", "TERRAIN" ],
        label: "Type"
      },
      zoom: {
        elem: "input",
        type: "text",
        label: "Zoom"
      },
      lat: {
        elem: "input",
        type: "text",
        label: "Lat"
      },
      lng: {
        elem: "input",
        type: "text",
        label: "Lng"
      },
      location: {
        elem: "input",
        type: "text",
        label: "Location"
      },
      markers: {
        elem: "input",
        type: "text",
        label: "List Markers"
      }
    }
  });
}) ( Popcorn );
/**
* Pause Popcorn Plug-in
*
* When this plugin is used, links on the webpage, when clicked, will pause
* popcorn videos that especified 'pauseOnLinkClicked' as an option. Links may
* cause a new page to display on a new window, or may cause a new page to
* display in the current window, in which case the videos won't be available
* anymore. It only affects anchor tags. It does not affect objects with click
* events that act as anchors.
*
* Example:
 var p = Popcorn('#video', { pauseOnLinkClicked : true } )
   .play();
*
*/

document.addEventListener( "click", function( event ) {

  var targetElement = event.target;

  //Some browsers use an element as the target, some use the text node inside
  if ( targetElement.nodeName === "A" || targetElement.parentNode && targetElement.parentNode.nodeName === "A" ) {
    Popcorn.instances.forEach( function( video ) {
      if ( video.options.pauseOnLinkClicked ) {
        video.pause();
      }
    });
  }
}, false );
// PLUGIN: Wordriver

(function ( Popcorn ) {

  var container = {},
      spanLocation = 0,
      setupContainer = function( target ) {

        container[ target ] = document.createElement( "div" );

        var t = document.getElementById( target );
        t && t.appendChild( container[ target ] );

        container[ target ].style.height = "100%";
        container[ target ].style.position = "relative";

        return container[ target ];
      },
      // creates an object of supported, cross platform css transitions
      span = document.createElement( "span" ),
      prefixes = [ "webkit", "Moz", "ms", "O", "" ],
      specProp = [ "Transform", "TransitionDuration", "TransitionTimingFunction" ],
      supports = {},
      prop;

  document.getElementsByTagName( "head" )[ 0 ].appendChild( span );

  for ( var sIdx = 0, sLen = specProp.length; sIdx < sLen; sIdx++ ) {

    for ( var pIdx = 0, pLen = prefixes.length; pIdx < pLen; pIdx++ ) {

      prop = prefixes[ pIdx ] + specProp[ sIdx ];

      if ( prop in span.style ) {

        supports[ specProp[ sIdx ].toLowerCase() ] = prop;
        break;
      }
    }
  }

  // Garbage collect support test span
  document.getElementsByTagName( "head" )[ 0 ].appendChild( span );

  /**
   * Word River popcorn plug-in
   * Displays a string of text, fading it in and out
   * while transitioning across the height of the parent container
   * for the duration of the instance  (duration = end - start)
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn( '#video' )
        .wordriver({
          start: 5,                      // When to begin the Word River animation
          end: 15,                       // When to finish the Word River animation
          text: 'Hello World',           // The text you want to be displayed by Word River
          target: 'wordRiverDiv',        // The target div to append the text to
          color: "blue"                  // The color of the text. (can be Hex value i.e. #FFFFFF )
        } )
   *
   */

  Popcorn.plugin( "wordriver" , {

      manifest: {
        about:{
          name: "Popcorn WordRiver Plugin"
        },
        options: {
          start: {
            elem: "input",
            type: "text",
            label: "In"
          },
          end: {
            elem: "input",
            type: "text",
            label: "Out"
          },
          target: "wordriver-container",
          text: {
            elem: "input",
            type: "text",
            label: "Text"
          },
          color: {
            elem: "input",
            type: "text",
            label: "Color"
          }
        }
      },

      _setup: function( options ) {

        if ( !document.getElementById( options.target ) && Popcorn.plugin.debug ) {
          throw new Error( "target container doesn't exist" );
        }

        options._duration = options.end - options.start;
        options._container = container[ options.target ] || setupContainer( options.target );

        options.word = document.createElement( "span" );
        options.word.style.position = "absolute";

        options.word.style.whiteSpace = "nowrap";
        options.word.style.opacity = 0;

        options.word.style.MozTransitionProperty = "opacity, -moz-transform";
        options.word.style.webkitTransitionProperty = "opacity, -webkit-transform";
        options.word.style.OTransitionProperty = "opacity, -o-transform";
        options.word.style.transitionProperty = "opacity, transform";

        options.word.style[ supports.transitionduration ] = 1 + "s, " + options._duration + "s";
        options.word.style[ supports.transitiontimingfunction ] = "linear";

        options.word.innerHTML = options.text;
        options.word.style.color = options.color || "black";
      },
      start: function( event, options ){

        options._container.appendChild( options.word );

        // Resets the transform when changing to a new currentTime before the end event occurred.
        options.word.style[ supports.transform ] = "";

        options.word.style.fontSize = ~~( 30 + 20 * Math.random() ) + "px";
        spanLocation = spanLocation % ( options._container.offsetWidth - options.word.offsetWidth );
        options.word.style.left = spanLocation + "px";
        spanLocation += options.word.offsetWidth + 10;
        options.word.style[ supports.transform ] = "translateY(" +
          ( options._container.offsetHeight - options.word.offsetHeight ) + "px)";

        options.word.style.opacity = 1;

        // automatically clears the word based on time
        setTimeout( function() {

          options.word.style.opacity = 0;
        // ensures at least one second exists, because the fade animation is 1 second
        }, ( ( (options.end - options.start) - 1 ) || 1 ) * 1000 );
      },
      end: function( event, options ){

        // manually clears the word based on user interaction
        options.word.style.opacity = 0;
      },
      _teardown: function( options ) {

        var target = document.getElementById( options.target );
        // removes word span from generated container
        options.word.parentNode && options._container.removeChild( options.word );

        // if no more word spans exist in container, remove container
        container[ options.target ] &&
          !container[ options.target ].childElementCount &&
          target && target.removeChild( container[ options.target ] ) &&
          delete container[ options.target ];
      }
  });

})( Popcorn );
/**
 * Processing Popcorn Plug-In
 *
 * This plugin adds a Processing.js sketch to be added to a target div or canvas.
 *
 * Options parameter needs to specify start, end, target and  sketch attributes
 * -Start is the time [in seconds] that you want the sketch to display and start looping.
 * -End is the time [in seconds] you want the sketch to become hidden and stop looping.
 * -Target is the id of the div or canvas you want the target sketch to be displayed in. ( a target that is a div will have a canvas created and placed inside of it. )
 * -Sketch specifies the filename of the Procesing code to be loaded into Processing.js
 * -noLoop [optional] specifies whether a sketch should continue to loop when the video is paused or seeking.
 *
 * @param {Object} options
 *
 * Example:
 var p = Popcorn( "#video" )
 .processing({
   start: 5,
   end: 10,
   target: "processing-div",
   sketch: "processingSketch.pjs",
   noLoop: true
 });
 *
 */

(function( Popcorn ) {

  Popcorn.plugin( "processing", function( options ) {

    var init = function( context ) {

      function scriptReady( options ) {
        var addListeners = function() {
          context.listen( "pause", function() {
            if ( options.canvas.style.display === "inline" ) {
              options.pjsInstance.noLoop();
            }
          });
          context.listen( "play", function() {
            if ( options.canvas.style.display === "inline" ) {
              options.pjsInstance.loop();
            }
          });
        };

        if ( options.sketch ) {

          Popcorn.xhr({
            url: options.sketch,
            dataType: "text",
            success: function( responseCode ) {

              options.codeReady = false;

              var s = Processing.compile( responseCode );
              options.pjsInstance = new Processing( options.canvas, s );
              options.seeking = false;
              ( options._running && !context.media.paused && options.pjsInstance.loop() ) || options.pjsInstance.noLoop();

              context.listen( "seeking", function() {
                 options._running && options.canvas.style.display === "inline" && options.noPause && options.pjsInstance.loop();
              });

              options.noPause = options.noPause || false;
              !options.noPause && addListeners();
              options.codeReady = true;
            }
          });
        } else if ( Popcorn.plugin.debug ) {

          throw new Error( "Popcorn.Processing: options.sketch is undefined" );
        }
      }

      if ( !window.Processing ) {
        Popcorn.getScript( "//wac.1237.edgecastcdn.net/801237/cdn.processingjs.org/content/download/processing-js-1.3.6/processing-1.3.6.min.js", function() {
          scriptReady( options );
        });
      } else {
        scriptReady( options );
      }

    };

    return {

      _setup: function( options ) {

        options.codeReady = false;

        options.parentTarget = document.getElementById( options.target );

        if ( !options.parentTarget && Popcorn.plugin.debug ) {
          throw new Error( "target container doesn't exist" );
        }

        var canvas = document.createElement( "canvas" );
        canvas.id = Popcorn.guid( options.target + "-sketch" );
        canvas.style.display = "none";
        options.canvas = canvas;

        options.parentTarget && options.parentTarget.appendChild( options.canvas );

        init( this );
      },

      start: function( event, options ) {

        options.codeReady && !this.media.paused && options.pjsInstance.loop();
        options.canvas.style.display = "inline";

      },

      end: function( event, options ) {

        options.pjsInstance && options.pjsInstance.noLoop();
        options.canvas.style.display = "none";
      },

      _teardown: function( options ) {
        options.pjsInstance && options.pjsInstance.exit();
        options.parentTarget && options.parentTarget.removeChild( options.canvas );
      }
    };
  },
  {
    about: {
      name: "Popcorn Processing Plugin",
      version: "0.1",
      author: "Christopher De Cairos, Benjamin Chalovich",
      website: "cadecairos.blogspot.com, ben1amin.wordpress.org"
    },
    options: {
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target: {
        elem: "input",
        type: "text",
        label: "Target"
      },
      sketch: {
        elem: "input",
        type: "url",
        label: "Sketch"
      },
      noPause: {
        elem: "select",
        options: [ "TRUE", "FALSE" ],
        label: "No Loop"
      }
    }
  });
}( Popcorn ));
// PLUGIN: Timeline
(function ( Popcorn ) {

  /**
     * timeline popcorn plug-in
     * Adds data associated with a certain time in the video, which creates a scrolling view of each item as the video progresses
     * Options parameter will need a start, target, title, and text
     * -Start is the time that you want this plug-in to execute
     * -End is the time that you want this plug-in to stop executing, tho for this plugin an end time may not be needed ( optional )
     * -Target is the id of the DOM element that you want the timeline to appear in. This element must be in the DOM
     * -Title is the title of the current timeline box
     * -Text is text is simply related text that will be displayed
     * -innerHTML gives the user the option to add things such as links, buttons and so on
     * -direction specifies whether the timeline will grow from the top or the bottom, receives input as "UP" or "DOWN"
     * @param {Object} options
     *
     * Example:
      var p = Popcorn("#video")
        .timeline( {
         start: 5, // seconds
         target: "timeline",
         title: "Seneca",
         text: "Welcome to seneca",
         innerHTML: "Click this link <a href='http://www.google.ca'>Google</a>"
      } )
    *
  */

  var i = 1;

  Popcorn.plugin( "timeline" , function( options ) {

    var target = document.getElementById( options.target ),
        contentDiv = document.createElement( "div" ),
        container,
        goingUp = true;

    if ( target && !target.firstChild ) {
      target.appendChild ( container = document.createElement( "div" ) );
      container.style.width = "inherit";
      container.style.height = "inherit";
      container.style.overflow = "auto";
    } else {
      container = target.firstChild;
    }

    contentDiv.style.display = "none";
    contentDiv.id = "timelineDiv" + i;

    //  Default to up if options.direction is non-existant or not up or down
    options.direction = options.direction || "up";
    if ( options.direction.toLowerCase() === "down" ) {

      goingUp = false;
    }

    if ( target && container ) {
      // if this isnt the first div added to the target div
      if( goingUp ){
        // insert the current div before the previous div inserted
        container.insertBefore( contentDiv, container.firstChild );
      }
      else {

        container.appendChild( contentDiv );
      }

    } else if ( Popcorn.plugin.debug ) {
      throw new Error( "target container doesn't exist" );
    }

    i++;

    //  Default to empty if not used
    //options.innerHTML = options.innerHTML || "";

    contentDiv.innerHTML = "<p><span id='big' style='font-size:24px; line-height: 130%;' >" + options.title + "</span><br />" +
    "<span id='mid' style='font-size: 16px;'>" + options.text + "</span><br />" + options.innerHTML;

    return {

      start: function( event, options ) {
        contentDiv.style.display = "block";

        if( options.direction === "down" ) {
          container.scrollTop = container.scrollHeight;
        }
      },

      end: function( event, options ) {
        contentDiv.style.display = "none";
      },

      _teardown: function( options ) {

        ( container && contentDiv ) && container.removeChild( contentDiv ) && !container.firstChild && target.removeChild( container );
      }
    };
  },
  {

    about: {
      name: "Popcorn Timeline Plugin",
      version: "0.1",
      author: "David Seifried @dcseifried",
      website: "dseifried.wordpress.com"
    },

    options: {
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target: "feed-container",
      title: {
        elem: "input",
        type: "text",
        label: "title"
      },
      text: {
        elem: "input",
        type: "text",
        label: "text"
      },
      innerHTML: {
        elem: "input",
        type: "text",
        label: "innerHTML"
      },
      direction: {
        elem: "input",
        type: "text",
        label: "direction"
      }
    }
  });

})( Popcorn );
// PLUGIN: documentcloud

(function( Popcorn, document ) {

  /**
   * Document Cloud popcorn plug-in
   *
   * @param {Object} options
   *
   * Example:
   *  var p = Popcorn("#video")
   *     // Let the pdf plugin load your PDF file for you using pdfUrl.
   *     .documentcloud({
   *       start: 45
   *       url: "http://www.documentcloud.org/documents/70050-urbina-day-1-in-progress.html", // or .js
   *       width: ...,
   *       height: ...,
   *       zoom: ...,
   *       page: ...,
   *       container: ...
   *     });

api - https://github.com/documentcloud/document-viewer/blob/master/public/javascripts/DV/controllers/api.js

   */

   // track registered plugins by document
   var documentRegistry = {};

  Popcorn.plugin( "documentcloud", {

    manifest: {
      about: {
        name: "Popcorn Document Cloud Plugin",
        version: "0.1",
        author: "@humphd, @ChrisDeCairos",
        website: "http://vocamus.net/dave"
      },
      options: {
        start: {
          elem: "input",
          type: "text",
          label: "In"
        },
        end: {
          elem: "input",
          type: "text",
          label: "Out"
        },
        target: "documentcloud-container",
        width: {
          elem: "input",
          type: "text",
          label: "Width"
        },
        height: {
          elem: "input",
          type: "text",
          label: "Height"
        },
        src: {
          elem: "input",
          type: "text",
          label: "PDF URL"
        },
        preload: {
          elem: "input",
          type: "boolean",
          label: "Preload"
        },
        page: {
          elem: "input",
          type: "number",
          label: "Page Number"
        },
        aid: {
          elem: "input",
          type: "number",
          label: "Annotation Id"
        }
      }
    },

    _setup: function( options ) {
      var DV = window.DV = window.DV || {},
          that = this;

      //setup elem...
      function load() {
        DV.loaded = false;
        // swap .html URL to .js for API call
        var url = options.url.replace( /\.html$/, ".js" ),
          target = options.target,
          targetDiv = document.getElementById( target ),
          containerDiv = document.createElement( "div" ),
          containerDivSize = Popcorn.position( targetDiv ),
          // need to use size of div if not given
          width = options.width || containerDivSize.width,
          height = options.height || containerDivSize.height,
          sidebar = options.sidebar || true,
          text = options.text || true,
          pdf = options.pdf || true,
          showAnnotations = options.showAnnotations || true,
          zoom = options.zoom || 700,
          search = options.search || true,
          page = options.page,
          container;

        function setOptions( viewer ) {
          options._key = viewer.api.getId();

          options._changeView = function ( viewer ) {
            if ( options.aid ) {
              viewer.pageSet.showAnnotation( viewer.api.getAnnotation( options.aid ) );
            } else {
              viewer.api.setCurrentPage( options.page );
            }
          };
        }

        function documentIsLoaded( url ) {
          var found = false;
          Popcorn.forEach( DV.viewers, function( viewer, idx ) {
            if( viewer.api.getSchema().canonicalURL === url ) {
              var targetDoc;
              setOptions( viewer );
              targetDoc = documentRegistry[ options._key ];
              options._containerId = targetDoc.id;
              targetDoc.num += 1;
              found = true;
              DV.loaded = true;
            }
          });
          return found;
        }

        function createRegistryEntry() {
          var entry = {
            num: 1,
            id: options._containerId
          };
          documentRegistry[ options._key ] = entry;
          DV.loaded = true;
        }

        if ( !documentIsLoaded( options.url ) ) {

          containerDiv.id = options._containerId = Popcorn.guid( target );
          container = "#" + containerDiv.id;
          targetDiv.appendChild( containerDiv );
          that.trigger( "documentready" );

          // Figure out if we need a callback to change the page #
          var afterLoad = options.page || options.aid ?
            function( viewer ) {
              setOptions( viewer );
              options._changeView( viewer );
              containerDiv.style.visibility = "hidden";
              viewer.elements.pages.hide();
              createRegistryEntry();
            } :
            function( viewer ) {
              setOptions( viewer );
              createRegistryEntry();
              containerDiv.style.visibility = "hidden";
              viewer.elements.pages.hide();
            };
          DV.load( url, {
            width: width,
            height: height,
            sidebar: sidebar,
            text: text,
            pdf: pdf,
            showAnnotations: showAnnotations,
            zoom: zoom,
            search: search,
            container: container,
            afterLoad: afterLoad
          });
        }
      }
      function readyCheck() {
        if( window.DV.loaded ) {
          load();
        } else {
          setTimeout( readyCheck, 25 );
        }
      }

      // If the viewer is already loaded, don't repeat the process.
      if ( !DV.loading ) {
        DV.loading = true;
        DV.recordHit = "//www.documentcloud.org/pixel.gif";

        var link = document.createElement( "link" ),
            head = document.getElementsByTagName( "head" )[ 0 ];

        link.rel = "stylesheet";
        link.type = "text/css";
        link.media = "screen";
        link.href = "//s3.documentcloud.org/viewer/viewer-datauri.css";

        head.appendChild( link );

        // Record the fact that the viewer is loaded.
        DV.loaded = false;

        // Request the viewer JavaScript.
        Popcorn.getScript( "http://s3.documentcloud.org/viewer/viewer.js", function() {
          DV.loading = false;
          load();
        });
      } else {

        readyCheck();
      }

    },

    start: function( event, options ) {
      var elem = document.getElementById( options._containerId ),
          viewer = DV.viewers[ options._key ];
      ( options.page || options.aid ) && viewer &&
        options._changeView( viewer );

      if ( elem && viewer) {
        elem.style.visibility = "visible";
        viewer.elements.pages.show();
      }
    },

    end: function( event, options ) {
      var elem = document.getElementById( options._containerId );

      if ( elem && DV.viewers[ options._key ] ) {
        elem.style.visibility = "hidden";
        DV.viewers[ options._key ].elements.pages.hide();
      }
    },

    _teardown: function( options ) {
      var elem = document.getElementById( options._containerId ),
          key = options._key;
      if ( key && DV.viewers[ key ] && --documentRegistry[ key ].num === 0 ) {
        DV.viewers[ key ].api.unload();

        while ( elem.hasChildNodes() ) {
          elem.removeChild( elem.lastChild );
        }
        elem.parentNode.removeChild( elem );
      }
    }
  });
})( Popcorn, window.document );
// PARSER: 0.3 JSON

(function (Popcorn) {
  Popcorn.parser( "parseJSON", "JSON", function( data ) {

    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: []
        },
        manifestData = {}, 
        dataObj = data;
    
    
    /*
      TODO: add support for filling in source children of the video element
      
      
      remote: [
        { 
          src: "whatever.mp4", 
          type: 'video/mp4; codecs="avc1, mp4a"'
        }, 
        { 
          src: "whatever.ogv", 
          type: 'video/ogg; codecs="theora, vorbis"'
        }
      ]

    */
    
        
    Popcorn.forEach( dataObj.data, function ( obj, key ) {
      retObj.data.push( obj );
    });

    return retObj;
  });

})( Popcorn );
// PARSER: 0.1 SBV

(function (Popcorn) {

  /**
   * SBV popcorn parser plug-in 
   * Parses subtitle files in the SBV format.
   * Times are expected in H:MM:SS.MIL format, with hours optional
   * Subtitles which don't match expected format are ignored
   * Data parameter is given by Popcorn, will need a text.
   * Text is the file contents to be parsed
   * 
   * @param {Object} data
   * 
   * Example:
    0:00:02.400,0:00:07.200
    Senator, we're making our final approach into Coruscant.
   */
  Popcorn.parser( "parseSBV", function( data ) {
  
    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: []
        },
        subs = [],
        lines,
        i = 0,
        len = 0,
        idx = 0;
    
    // [H:]MM:SS.MIL string to SS.MIL
    // Will thrown exception on bad time format
    var toSeconds = function( t_in ) {
      var t = t_in.split( ":" ),
          l = t.length-1,
          time;
      
      try {
        time = parseInt( t[l-1], 10 )*60 + parseFloat( t[l], 10 );
        
        // Hours optionally given
        if ( l === 2 ) { 
          time += parseInt( t[0], 10 )*3600;
        }
      } catch ( e ) {
        throw "Bad cue";
      }
      
      return time;
    };
    
    var createTrack = function( name, attributes ) {
      var track = {};
      track[name] = attributes;
      return track;
    };
  
    // Here is where the magic happens
    // Split on line breaks
    lines = data.text.split( /(?:\r\n|\r|\n)/gm );
    len = lines.length;
    
    while ( i < len ) {
      var sub = {},
          text = [],
          time = lines[i++].split( "," );
      
      try {
        sub.start = toSeconds( time[0] );
        sub.end = toSeconds( time[1] );
        
        // Gather all lines of text
        while ( i < len && lines[i] ) {
          text.push( lines[i++] );
        }
        
        // Join line breaks in text
        sub.text = text.join( "<br />" );
        subs.push( createTrack( "subtitle", sub ) );
      } catch ( e ) {
        // Bad cue, advance to end of cue
        while ( i < len && lines[i] ) {
          i++;
        }
      }
      
      // Consume empty whitespace
      while ( i < len && !lines[i] ) {
        i++;
      }
    }
    
    retObj.data = subs;

    return retObj;
  });

})( Popcorn );
// PARSER: 0.3 SRT

(function (Popcorn) {
  /**
   * SRT popcorn parser plug-in 
   * Parses subtitle files in the SRT format.
   * Times are expected in HH:MM:SS,MIL format, though HH:MM:SS.MIL also supported
   * Ignore styling, which may occur after the end time or in-text
   * While not part of the "official" spec, majority of players support HTML and SSA styling tags
   * SSA-style tags are stripped, HTML style tags are left for the browser to handle:
   *    HTML: <font>, <b>, <i>, <u>, <s>
   *    SSA:  \N or \n, {\cmdArg1}, {\cmd(arg1, arg2, ...)}
   
   * Data parameter is given by Popcorn, will need a text.
   * Text is the file contents to be parsed
   * 
   * @param {Object} data
   * 
   * Example:
    1
    00:00:25,712 --> 00:00:30.399
    This text is <font color="red">RED</font> and has not been {\pos(142,120)} positioned.
    This takes \Nup three \nentire lines.
    This contains nested <b>bold, <i>italic, <u>underline</u> and <s>strike-through</s></u></i></b> HTML tags
    Unclosed but <b>supported tags are left in
    <ggg>Unsupported</ggg> HTML tags are left in, even if <hhh>not closed.
    SSA tags with {\i1} would open and close italicize {\i0}, but are stripped
    Multiple {\pos(142,120)\b1}SSA tags are stripped
   */
  Popcorn.parser( "parseSRT", function( data ) {

    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: []
        },
        subs = [],
        i = 0,
        len = 0,
        idx = 0,
        lines,
        time,
        text,
        sub;
    
    // Simple function to convert HH:MM:SS,MMM or HH:MM:SS.MMM to SS.MMM
    // Assume valid, returns 0 on error
    var toSeconds = function( t_in ) {
      var t = t_in.split( ':' );
      
      try {
        var s = t[2].split( ',' );
        
        // Just in case a . is decimal seperator
        if ( s.length === 1 ) {
          s = t[2].split( '.' );
        }
        
        return parseFloat( t[0], 10 )*3600 + parseFloat( t[1], 10 )*60 + parseFloat( s[0], 10 ) + parseFloat( s[1], 10 )/1000;
      } catch ( e ) {
        return 0;
      }
    };
    
    var createTrack = function( name, attributes ) {
      var track = {};
      track[name] = attributes;
      return track;
    };
  
    // Here is where the magic happens
    // Split on line breaks
    lines = data.text.split( /(?:\r\n|\r|\n)/gm );
    len = lines.length;
    
    for( i=0; i < len; i++ ) {
      sub = {};
      text = [];
      
      sub.id = parseInt( lines[i++], 10 );
      
      // Split on '-->' delimiter, trimming spaces as well
      time = lines[i++].split( /[\t ]*-->[\t ]*/ );
      
      sub.start = toSeconds( time[0] );
      
      // So as to trim positioning information from end
      idx = time[1].indexOf( " " );
      if ( idx !== -1) {
        time[1] = time[1].substr( 0, idx );
      }
      sub.end = toSeconds( time[1] );
      
      // Build single line of text from multi-line subtitle in file
      while ( i < len && lines[i] ) {
        text.push( lines[i++] );
      }
      
      // Join into 1 line, SSA-style linebreaks
      // Strip out other SSA-style tags
      sub.text = text.join( "\\N" ).replace( /\{(\\[\w]+\(?([\w\d]+,?)+\)?)+\}/gi, "" );
      
      // Escape HTML entities
      sub.text = sub.text.replace( /</g, "&lt;" ).replace( />/g, "&gt;" );
      
      // Unescape great than and less than when it makes a valid html tag of a supported style (font, b, u, s, i)
      // Modified version of regex from Phil Haack's blog: http://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx
      // Later modified by kev: http://kevin.deldycke.com/2007/03/ultimate-regular-expression-for-html-tag-parsing-with-php/
      sub.text = sub.text.replace( /&lt;(\/?(font|b|u|i|s))((\s+(\w|\w[\w\-]*\w)(\s*=\s*(?:\".*?\"|'.*?'|[^'\">\s]+))?)+\s*|\s*)(\/?)&gt;/gi, "<$1$3$7>" );
      sub.text = sub.text.replace( /\\N/gi, "<br />" );
      subs.push( createTrack( "subtitle", sub ) );
    }
    
    retObj.data = subs;
    return retObj;
  });

})( Popcorn );
// PARSER: 0.3 SSA/ASS

(function ( Popcorn ) {
  /**
   * SSA/ASS popcorn parser plug-in
   * Parses subtitle files in the identical SSA and ASS formats.
   * Style information is ignored, and may be found in these
   * formats: (\N    \n    {\pos(400,570)}     {\kf89})
   * Out of the [Script Info], [V4 Styles], [Events], [Pictures],
   * and [Fonts] sections, only [Events] is processed.
   * Data parameter is given by Popcorn, will need a text.
   * Text is the file contents to be parsed
   *
   * @param {Object} data
   *
   * Example:
     [Script Info]
      Title: Testing subtitles for the SSA Format
      [V4 Styles]
      Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding
      Style: Default,Arial,20,65535,65535,65535,-2147483640,-1,0,1,3,0,2,30,30,30,0,0
      [Events]
      Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
      Dialogue: 0,0:00:02.40,0:00:07.20,Default,,0000,0000,0000,,Senator, {\kf89}we're \Nmaking our final \napproach into Coruscant.
      Dialogue: 0,0:00:09.71,0:00:13.39,Default,,0000,0000,0000,,{\pos(400,570)}Very good, Lieutenant.
      Dialogue: 0,0:00:15.04,0:00:18.04,Default,,0000,0000,0000,,It's \Na \ntrap!
   *
   */

  // Register for SSA extensions
  Popcorn.parser( "parseSSA", function( data ) {
    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: [  ]
        },
        rNewLineFile = /(?:\r\n|\r|\n)/gm,
        subs = [  ],
        lines,
        headers,
        i = 0,
        len;

    // Here is where the magic happens
    // Split on line breaks
    lines = data.text.split( rNewLineFile );
    len = lines.length;

    // Ignore non-textual info
    while ( i < len && lines[ i ] !== "[Events]" ) {
      i++;
    }

    headers = parseFieldHeaders( lines[ ++i ] );

    while ( ++i < len && lines[ i ] && lines[ i ][ 0 ] !== "[" ) {
      try {
        subs.push( createTrack( "subtitle", parseSub( lines[ i ], headers ) ) );
      } catch ( e ) {}
    }

    retObj.data = subs;
    return retObj;
  });

  function parseSub( line, headers ) {
    // Trim beginning 'Dialogue: ' and split on delim
    var fields = line.substr( 10 ).split( "," ),
        rAdvancedStyles = /\{(\\[\w]+\(?([\w\d]+,?)+\)?)+\}/gi,
        rNewLineSSA = /\\N/gi,
        sub;

    sub = {
      start: toSeconds( fields[ headers.start ] ),
      end: toSeconds( fields[ headers.end ] )
    };

    // Invalid time, skip
    if ( sub.start === -1 || sub.end === -1 ) {
      throw "Invalid time";
    }

    // Eliminate advanced styles and convert forced line breaks
    sub.text = getTextFromFields( fields, headers.text ).replace( rAdvancedStyles, "" ).replace( rNewLineSSA, "<br />" );

    return sub;
  }

  // h:mm:ss.cc (centisec) string to SS.mmm
  // Returns -1 if invalid
  function toSeconds( t_in ) {
    var t = t_in.split( ":" );

    // Not all there
    if ( t_in.length !== 10 || t.length < 3 ) {
      return -1;
    }

    return parseInt( t[ 0 ], 10 ) * 3600 + parseInt( t[ 1 ], 10 ) * 60 + parseFloat( t[ 2 ], 10 );
  }

  function getTextFromFields( fields, startIdx ) {
    var fieldLen = fields.length,
        text = [  ],
        i = startIdx;

    // There may be commas in the text which were split, append back together into one line
    for( ; i < fieldLen; i++ ) {
      text.push( fields[ i ] );
    }

    return text.join( "," );
  }

  function createTrack( name, attributes ) {
    var track = {};
    track[ name ] = attributes;
    return track;
  }

  function parseFieldHeaders( line ) {
    // Trim 'Format: ' off front, split on delim
    var fields = line.substr( 8 ).split( ", " ),
        result = {},
        len,
        i;

     //Find where in Dialogue string the start, end and text info is
    for ( i = 0, len = fields.length; i < len; i++ ) {
      if ( fields[ i ] === "Start" ) {
        result.start = i;
      } else if ( fields[ i ] === "End" ) {
        result.end = i;
      } else if ( fields[ i ] === "Text" ) {
        result.text = i;
      }
    }

    return result;
  }
})( Popcorn );
// PARSER: 0.3 TTML

(function (Popcorn) {

  /**
   * TTML popcorn parser plug-in 
   * Parses subtitle files in the TTML format.
   * Times may be absolute to the timeline or relative
   *   Absolute times are ISO 8601 format (hh:mm:ss[.mmm])
   *   Relative times are a fraction followed by a unit metric (d.ddu)
   *     Relative times are relative to the time given on the parent node
   * Styling information is ignored
   * Data parameter is given by Popcorn, will need an xml.
   * Xml is the file contents to be processed
   * 
   * @param {Object} data
   * 
   * Example:
    <tt xmlns:tts="http://www.w3.org/2006/04/ttaf1#styling" xmlns="http://www.w3.org/2006/04/ttaf1">
      <body region="subtitleArea">
        <div>
          <p xml:id="subtitle1" begin="0.76s" end="3.45s">
            It seems a paradox, does it not,
          </p>
        </div>
      </body>
    </tt>
   */
  Popcorn.parser( "parseTTML", function( data ) {

    // declare needed variables
    var returnData = {
          title: "",
          remote: "",
          data: []
        },
        node,
        numTracks = 0,
        region;
    
    // Convert time expression to SS.mmm
    // Expression may be absolute to timeline (hh:mm:ss.ms)
    //   or relative ( fraction followedd by metric ) ex: 3.4s, 5.7m
    // Returns -1 if invalid    
    var toSeconds = function ( t_in, offset ) {
      if ( !t_in ) {
        return -1;
      }
      
      var t = t_in.split( ":" ),
          l = t.length - 1,
          metric,
          multiplier,
          i;
          
      // Try clock time
      if ( l >= 2 ) {
        return parseInt( t[0], 10 )*3600 + parseInt( t[l-1], 10 )*60 + parseFloat( t[l], 10 );
      }
      
      // Was not clock time, assume relative time
      // Take metric from end of string (may not be single character)
      // First find metric
      for( i = t_in.length - 1; i >= 0; i-- ) {
        if ( t_in[i] <= "9" && t_in[i] >= "0" ) {
          break;
        }
      }
      
      // Point i at metric and normalize offsete time
      i++;
      metric = t_in.substr( i );
      offset = offset || 0;
      
      // Determine multiplier for metric relative to seconds
      if ( metric === "h" ) {
        multiplier = 3600;
      } else if ( metric === "m" ) {
        multiplier = 60;
      } else if ( metric === "s" ) {
        multiplier = 1;
      } else if ( metric === "ms" ) {
        multiplier = 0.001;
      } else {
        return -1;
      }
      
      // Valid multiplier
      return parseFloat( t_in.substr( 0, i ) ) * multiplier + offset;
    };

    // creates an object of all atrributes keyd by name
    var createTrack = function( name, attributes ) {
      var track = {};
      track[name] = attributes;
      return track;
    };
    
    // Parse a node for text content
    var parseNode = function( node, timeOffset ) {
      var sub = {};
      
      // Trim left and right whitespace from text and change non-explicit line breaks to spaces
      sub.text = node.textContent.replace(/^[\s]+|[\s]+$/gm, "").replace(/(?:\r\n|\r|\n)/gm, "<br />");
      sub.id = node.getAttribute( "xml:id" ) || node.getAttribute( "id" );
      sub.start = toSeconds ( node.getAttribute( "begin" ), timeOffset );
      sub.end = toSeconds( node.getAttribute( "end" ), timeOffset );
      sub.target = region;
      
      if ( sub.end < 0 ) {
        // No end given, infer duration if possible
        // Otherwise, give end as MAX_VALUE
        sub.end = toSeconds( node.getAttribute( "duration" ), 0 );
        
        if ( sub.end >= 0 ) {
          sub.end += sub.start;
        } else {
          sub.end = Number.MAX_VALUE;
        }
      }
      
      return sub;
    };
    
    // Parse the children of the given node
    var parseChildren = function( node, timeOffset ) {
      var currNode = node.firstChild,
          sub,
          newOffset;
      
      while ( currNode ) {
        if ( currNode.nodeType === 1 ) {
          if ( currNode.nodeName === "p" ) {
            // p is a teextual node, process contents as subtitle
            sub = parseNode( currNode, timeOffset );
            returnData.data.push( createTrack( "subtitle", sub ) );
            numTracks++;
          } else if ( currNode.nodeName === "div" ) {
            // div is container for subtitles, recurse
            newOffset = toSeconds( currNode.getAttribute("begin") );
            
            if (newOffset < 0 ) {
              newOffset = timeOffset;
            }
           
            parseChildren( currNode, newOffset );
          }
        }
        
        currNode = currNode.nextSibling;
      }
    };
    
    // Null checks
    if ( !data.xml || !data.xml.documentElement || !( node = data.xml.documentElement.firstChild ) ) {
      return returnData;
    }
    
    // Find body tag
    while ( node.nodeName !== "body" ) {
      node = node.nextSibling;
    }
    
    region = "";
    parseChildren( node, 0 );

    return returnData;
  });

})( Popcorn );
// PARSER: 0.1 TTXT

(function (Popcorn) {

  /**
   * TTXT popcorn parser plug-in 
   * Parses subtitle files in the TTXT format.
   * Style information is ignored.
   * Data parameter is given by Popcorn, will need an xml.
   * Xml is the file contents to be parsed as a DOM tree
   * 
   * @param {Object} data
   * 
   * Example:
     <TextSample sampleTime="00:00:00.000" text=""></TextSample>
   */
  Popcorn.parser( "parseTTXT", function( data ) {

    // declare needed variables
    var returnData = {
          title: "",
          remote: "",
          data: []
        };

    // Simple function to convert HH:MM:SS.MMM to SS.MMM
    // Assume valid, returns 0 on error
    var toSeconds = function(t_in) {
      var t = t_in.split(":");
      var time = 0;
      
      try {        
        return parseFloat(t[0], 10)*60*60 + parseFloat(t[1], 10)*60 + parseFloat(t[2], 10);
      } catch (e) { time = 0; }
      
      return time;
    };

    // creates an object of all atrributes keyed by name
    var createTrack = function( name, attributes ) {
      var track = {};
      track[name] = attributes;
      return track;
    };

    // this is where things actually start
    var node = data.xml.lastChild.lastChild; // Last Child of TextStreamHeader
    var lastStart = Number.MAX_VALUE;
    var cmds = [];
    
    // Work backwards through DOM, processing TextSample nodes
    while (node) {
      if ( node.nodeType === 1 && node.nodeName === "TextSample") {
        var sub = {};
        sub.start = toSeconds(node.getAttribute('sampleTime'));
        sub.text = node.getAttribute('text');
      
        if (sub.text) { // Only process if text to display
          // Infer end time from prior element, ms accuracy
          sub.end = lastStart - 0.001;
          cmds.push( createTrack("subtitle", sub) );
        }
        lastStart = sub.start;
      }
      node = node.previousSibling;
    }
    
    returnData.data = cmds.reverse();

    return returnData;
  });

})( Popcorn );
// PARSER: 0.3 WebSRT/VTT

(function ( Popcorn ) {
  /**
   * WebVTT popcorn parser plug-in
   * Parses subtitle files in the WebVTT format.
   * Specification here: http://www.whatwg.org/specs/web-apps/current-work/webvtt.html
   * Styles which appear after timing information are presently ignored.
   * Inline styling tags follow HTML conventions and are left in for the browser to handle (or ignore if VTT-specific)
   * Data parameter is given by Popcorn, text property holds file contents.
   * Text is the file contents to be parsed
   *
   * @param {Object} data
   *
   * Example:
    00:32.500 --> 00:00:33.500 A:start S:50% D:vertical L:98%
    <v Neil DeGrass Tyson><i>Laughs</i>
   */
  Popcorn.parser( "parseVTT", function( data ) {

    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: []
        },
        subs = [],
        i = 0,
        len = 0,
        lines,
        text,
        sub,
        rNewLine = /(?:\r\n|\r|\n)/gm;

    // Here is where the magic happens
    // Split on line breaks
    lines = data.text.split( rNewLine );
    len = lines.length;

    // Check for BOF token
    if ( len === 0 || lines[ 0 ] !== "WEBVTT" ) {
      return retObj;
    }

    i++;

    while ( i < len ) {
      text = [];

      try {
        i = skipWhitespace( lines, len, i );
        sub = parseCueHeader( lines[ i++ ] );

        // Build single line of text from multi-line subtitle in file
        while ( i < len && lines[ i ] ) {
          text.push( lines[ i++ ] );
        }

        // Join lines together to one and build subtitle text
        sub.text = text.join( "<br />" );
        subs.push( createTrack( "subtitle", sub ) );
      } catch ( e ) {
        i = skipNonWhitespace( lines, len, i );
      }
    }

    retObj.data = subs;
    return retObj;
  });

  // [HH:]MM:SS.mmm string to SS.mmm float
  // Throws exception if invalid
  function toSeconds ( t_in ) {
    var t = t_in.split( ":" ),
        l = t_in.length,
        time;

    // Invalid time string provided
    if ( l !== 12 && l !== 9 ) {
      throw "Bad cue";
    }

    l = t.length - 1;

    try {
      time = parseInt( t[ l-1 ], 10 ) * 60 + parseFloat( t[ l ], 10 );

      // Hours were given
      if ( l === 2 ) {
        time += parseInt( t[ 0 ], 10 ) * 3600;
      }
    } catch ( e ) {
      throw "Bad cue";
    }

    return time;
  }

  function createTrack( name, attributes ) {
    var track = {};
    track[ name ] = attributes;
    return track;
  }

  function parseCueHeader ( line ) {
    var lineSegments,
        args,
        sub = {},
        rToken = /-->/,
        rWhitespace = /[\t ]+/;

    if ( !line || line.indexOf( "-->" ) === -1 ) {
      throw "Bad cue";
    }

    lineSegments = line.replace( rToken, " --> " ).split( rWhitespace );

    if ( lineSegments.length < 2 ) {
      throw "Bad cue";
    }

    sub.id = line;
    sub.start = toSeconds( lineSegments[ 0 ] );
    sub.end = toSeconds( lineSegments[ 2 ] );

    return sub;
  }

  function skipWhitespace ( lines, len, i ) {
    while ( i < len && !lines[ i ] ) {
      i++;
    }

    return i;
  }

  function skipNonWhitespace ( lines, len, i ) {
    while ( i < len && lines[ i ] ) {
      i++;
    }

    return i;
  }
})( Popcorn );
// PARSER: 0.1 XML

(function (Popcorn) {

  /**
   *
   *
   */
  Popcorn.parser( "parseXML", "XML", function( data ) {

    // declare needed variables
    var returnData = {
          title: "",
          remote: "",
          data: []
        },
        manifestData = {};

    // Simple function to convert 0:05 to 0.5 in seconds
    // acceptable formats are HH:MM:SS:MM, MM:SS:MM, SS:MM, SS
    var toSeconds = function(time) {
      var t = time.split(":");
      if (t.length === 1) {
        return parseFloat(t[0], 10);
      } else if (t.length === 2) {
        return parseFloat(t[0], 10) + parseFloat(t[1] / 12, 10);
      } else if (t.length === 3) {
        return parseInt(t[0] * 60, 10) + parseFloat(t[1], 10) + parseFloat(t[2] / 12, 10);
      } else if (t.length === 4) {
        return parseInt(t[0] * 3600, 10) + parseInt(t[1] * 60, 10) + parseFloat(t[2], 10) + parseFloat(t[3] / 12, 10);
      }
    };

    // turns a node tree element into a straight up javascript object
    // also converts in and out to start and end
    // also links manifest data with ids
    var objectifyAttributes = function ( nodeAttributes ) {

      var returnObject = {};

      for ( var i = 0, nal = nodeAttributes.length; i < nal; i++ ) {

        var key  = nodeAttributes.item(i).nodeName,
            data = nodeAttributes.item(i).nodeValue;

        // converts in into start
        if (key === "in") {
          returnObject.start = toSeconds( data );
        // converts out into end
        } else if ( key === "out" ){
          returnObject.end = toSeconds( data );
        // this is where ids in the manifest are linked
        } else if ( key === "resourceid" ) {
          Popcorn.extend( returnObject, manifestData[data] );
        // everything else
        } else {
          returnObject[key] = data;
        }

      }

      return returnObject;
    };

    // creates an object of all atrributes keyd by name
    var createTrack = function( name, attributes ) {
      var track = {};
      track[name] = attributes;
      return track;
    };

    // recursive function to process a node, or process the next child node
    var parseNode = function ( node, allAttributes, manifest ) {
      var attributes = {};
      Popcorn.extend( attributes, allAttributes, objectifyAttributes( node.attributes ), { text: node.textContent } );

      var childNodes = node.childNodes;

      // processes the node
      if ( childNodes.length < 1 || ( childNodes.length === 1 && childNodes[0].nodeType === 3 ) ) {

        if ( !manifest ) {
          returnData.data.push( createTrack( node.nodeName, attributes ) );
        } else {
          manifestData[attributes.id] = attributes;
        }

      // process the next child node
      } else {

        for ( var i = 0; i < childNodes.length; i++ ) {

          if ( childNodes[i].nodeType === 1 ) {
            parseNode( childNodes[i], attributes, manifest );
          }

        }
      }
    };

    // this is where things actually start
    var x = data.documentElement.childNodes;

    for ( var i = 0, xl = x.length; i < xl; i++ ) {

      if ( x[i].nodeType === 1 ) {

        // start the process of each main node type, manifest or timeline
        if ( x[i].nodeName === "manifest" ) {
          parseNode( x[i], {}, true );
        } else { // timeline
          parseNode( x[i], {}, false );
        }

      }
    }

    return returnData;
  });

})( Popcorn );
// Popcorn Soundcloud Player Wrapper
( function( Popcorn, global ) {
  /**
  * Soundcloud wrapper for Popcorn.
  * This player adds enables Popcorn.js to handle Soundcloud audio. It does so by masking an embedded Soundcloud Flash object
  * as a video and implementing the HTML5 Media Element interface.
  *
  * You can configure the video source and dimensions in two ways:
  *  1. Use the embed code path supplied by Soundcloud the id of the desired location into a new Popcorn.soundcloud object.
  *     Width and height can be configured throughh CSS.
  *
  *    <div id="player_1" style="width: 500px; height: 81px"></div>
  *    <script type="text/javascript">
  *      document.addEventListener("DOMContentLoaded", function() {
  *        var popcorn = Popcorn( Popcorn.soundcloud( "player_1", "http://soundcloud.com/forss/flickermood" ));
  *      }, false);
  *    </script>
  *
  *  2. Width and height may also be configured directly with the player; this will override any CSS. This is useful for
  *     when different sizes are desired. for multiple players within the same parent container.
  *
  *     <div id="player_1"></div>
  *     <script type="text/javascript">
  *       document.addEventListener("DOMContentLoaded", function() {
  *       var popcorn = Popcorn( Popcorn.soundcloud( "player_1", "http://soundcloud.com/forss/flickermood", {
  *         width: "500",                                     // Optional, will default to CSS values
  *         height: "81"                                      // Optional, will default to CSS values
  *       }));
  *       }, false);
  *     </script>
  *
  * The player can be further configured to integrate with the SoundCloud API:
  *
  * var popcorn = Popcorn( Popcorn.soundcloud( "player_1", "http://soundcloud.com/forss/flickermood", {
  *   width: "100%",                                    // Optional, the width for the player. May also be as '##px'
  *                                                     //           Defaults to the maximum possible width
  *   height: "81px",                                   // Optional, the height for the player. May also be as '###%'
  *                                                     //           Defaults to 81px
  *   api: {                                            // Optional, information for Soundcloud API interaction
  *     key: "abcdefsdfsdf",                            // Required for API interaction. The Soundcloud API key
  *     commentdiv: "divId_for_output",                 // Required for comment retrieval, the Div Id for outputting comments.
  *     commentformat: function( comment ) {}           // Optional, a function to format a comment. Returns HTML string
  *   }
  * }));
  *
  * Comments are retrieved from Soundcloud when the player is registered with Popcorn by calling the registerWithPopcorn()
  * function. For this to work, the api_key and commentdiv attributes must be set. Comments are output by default similar to
  * how Soundcloud formats them in-player, but a custom formatting function may be supplied. It receives a comment object and
  * the current date. A comment object has:
  *
  * var comment = {
  *   start: 0,                           // Required. Start time in ms.
  *   date: new Date(),                   // Required. Date comment wasa posted.
  *   text: "",                           // Required. Comment text
  *   user: {                             // Required. Describes the user who posted the comment
  *     name: "",                         // Required. User name
  *     profile: "",                      // Required. User profile link
  *     avatar: ""                        // Required. User avatar link
  *   }
  * }
  *
  * These events are completely custom-implemented and may be subscribed to at any time:
  *   canplaythrough
  *   durationchange
  *   load
  *   loadedmetadata
  *   loadstart
  *   play
  *   readystatechange
  *   volumechange
  *
  * These events are related to player functionality and must be subscribed to during or after the load event:
  *   canplay
  *   ended
  *   error
  *   pause
  *   playing
  *   progress
  *   seeked
  *   timeupdate
  *
  * These events are not supported:
  *   abort
  *   emptied
  *   loadeddata
  *   ratechange
  *   seeking
  *   stalled
  *   suspend
  *   waiting
  *
  * Supported media attributes:
  *   autoplay ( via Popcorn )
  *   currentTime
  *   defaultPlaybackRate ( get only )
  *   duration ( get only )
  *   ended ( get only )
  *   initialTime ( get only, always 0 )
  *   loop ( get only, set by calling setLoop() )
  *   muted ( get only )
  *   paused ( get only )
  *   playbackRate ( get only )
  *   played ( get only, 0/1 only )
  *   readyState ( get only )
  *   src ( get only )
  *   volume
  *
  *   load() function
  *   mute() function ( toggles on/off )
  *   play() function
  *   pause() function
  *
  * Unsupported media attributes:
  *   buffered
  *   networkState
  *   preload
  *   seekable
  *   seeking
  *   startOffsetTime
  *
  *   canPlayType() function
  */

  // Trackers
  var timeupdateInterval = 33,
      timeCheckInterval = 0.25,
      abs = Math.abs,
      floor = Math.floor,
      round = Math.round,
      registry = {};

  function hasAllDependencies() {
    return global.swfobject && global.soundcloud;
  }

  // Borrowed from: http://www.quirksmode.org/dom/getstyles.html
  // Gets the style for the given element
  function getStyle( elem, styleProp ) {
    if ( elem.currentStyle ) {
      // IE way
      return elem.currentStyle[styleProp];
    } else if ( global.getComputedStyle ) {
      // Firefox, Chrome, et. al
      return document.defaultView.getComputedStyle( elem, null ).getPropertyValue( styleProp );
    }
  }

  function formatComment( comment ) {
    // Calclate the difference between d and now, express as "n units ago"
    function ago( d ) {
      var diff = ( ( new Date() ).getTime() - d.getTime() )/1000;

      function pluralize( value, unit ) {
        return value + " " + unit + ( value > 1 ? "s" : "") + " ago";
      }

      if ( diff < 60 ) {
        return pluralize( round( diff ), "second" );
      }
      diff /= 60;

      if ( diff < 60 ) {
        return pluralize( round( diff ), "minute" );
      }
      diff /= 60;

      if ( diff < 24 ) {
        return pluralize( round( diff ), "hour" );
      }
      diff /= 24;

      // Rough approximation of months
      if ( diff < 30 ) {
        return pluralize( round( diff ), "day" );
      }

      if ( diff < 365 ) {
        return pluralize( round( diff/30 ), "month" );
      }

      return pluralize( round( diff/365 ), "year" );
    }

    // Converts sec to min.sec
    function timeToFraction ( totalSec ) {
      var min = floor( totalSec / 60 ),
          sec = round( totalSec % 60 );

      return min + "." + ( sec < 10 ? "0" : "" ) + sec;
    }

    return '<div><a href="' + comment.user.profile + '">' +
           '<img width="16px height="16px" src="' + comment.user.avatar + '"></img>' +
           comment.user.name + '</a> at ' + timeToFraction( comment.start ) + ' '  +
           ago( comment.date )  +
           '<br />' + comment.text + '</span>';
  }

  function isReady( self ) {
    if ( !hasAllDependencies() ) {
      setTimeout( function() {
        isReady( self );
      }, 15 );
      return;
    }

    var flashvars = {
      enable_api: true,
      object_id: self._playerId,
      url: self.src,
      // Hide comments in player if showing them elsewhere
      show_comments: !self._options.api.key && !self._options.api.commentdiv
    },
    params = {
      allowscriptaccess: "always",
      // This is so we can overlay html ontop of Flash
      wmode: 'transparent'
    },
    attributes = {
      id: self._playerId,
      name: self._playerId
    },
    actualTarget = document.createElement( 'div' );

    actualTarget.setAttribute( "id", self._playerId );
    self._container.appendChild( actualTarget );

    swfobject.embedSWF( "http://player.soundcloud.com/player.swf", self._playerId, self.offsetWidth, self.height, "9.0.0", "expressInstall.swf", flashvars, params, attributes );
  }


  Popcorn.soundcloud = function( containerId, src, options ) {

    Popcorn.getScript( "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" );

    // Source file originally from 'https://github.com/soundcloud/Widget-JS-API/raw/master/soundcloud.player.api.js'
    Popcorn.getScript( "http://popcornjs.org/code/players/soundcloud/lib/soundcloud.player.api.js", function() {
      // Play event is fired twice when player is first started. Ignore second one
      var ignorePlayEvt = 1;

      // Register the wrapper's load event with the player
      soundcloud.addEventListener( 'onPlayerReady', function( object, data ) {
        var wrapper = registry[object.api_getFlashId()];

        wrapper.swfObj = object;
        wrapper.duration = object.api_getTrackDuration();
        wrapper.currentTime = object.api_getTrackPosition();
        // This eliminates volumechangee event from firing on load
        wrapper.volume = wrapper.previousVolume =  object.api_getVolume()/100;

        // The numeric id of the track for use with Soundcloud API
        wrapper._mediaId = data.mediaId;

        wrapper.dispatchEvent( 'load' );
        wrapper.dispatchEvent( 'canplay' );
        wrapper.dispatchEvent( 'durationchange' );

        wrapper.timeupdate();
      });

      // Register events for when the flash player plays a track for the first time
      soundcloud.addEventListener( 'onMediaStart', function( object, data ) {
        var wrapper = registry[object.api_getFlashId()];
        wrapper.played = 1;
        wrapper.dispatchEvent( 'playing' );
      });

      // Register events for when the flash player plays a track
      soundcloud.addEventListener( 'onMediaPlay', function( object, data ) {
        if ( ignorePlayEvt ) {
          ignorePlayEvt = 0;
          return;
        }

        var wrapper = registry[object.api_getFlashId()];
        wrapper.dispatchEvent( 'play' );
      });

      // Register events for when the flash player pauses a track
      soundcloud.addEventListener( 'onMediaPause', function( object, data ) {
        var wrapper = registry[object.api_getFlashId()];
        wrapper.dispatchEvent( 'pause' );
      });

      // Register events for when the flash player is buffering
      soundcloud.addEventListener( 'onMediaBuffering', function( object, data ) {
        var wrapper = registry[object.api_getFlashId()];

        wrapper.dispatchEvent( 'progress' );

        if ( wrapper.readyState === 0 ) {
          wrapper.readyState = 3;
          wrapper.dispatchEvent( "readystatechange" );
        }
      });

      // Register events for when the flash player is done buffering
      soundcloud.addEventListener( 'onMediaDoneBuffering', function( object, data ) {
        var wrapper = registry[object.api_getFlashId()];
        wrapper.dispatchEvent( 'canplaythrough' );
      });

      // Register events for when the flash player has finished playing
      soundcloud.addEventListener( 'onMediaEnd', function( object, data ) {
        var wrapper = registry[object.api_getFlashId()];
        wrapper.paused = 1;
        //wrapper.pause();
        wrapper.dispatchEvent( 'ended' );
      });

      // Register events for when the flash player has seeked
      soundcloud.addEventListener( 'onMediaSeek', function( object, data ) {
        var wrapper = registry[object.api_getFlashId()];

        wrapper.setCurrentTime( object.api_getTrackPosition() );

        if ( wrapper.paused ) {
          wrapper.dispatchEvent( "timeupdate" );
        }
      });

      // Register events for when the flash player has errored
      soundcloud.addEventListener( 'onPlayerError', function( object, data ) {
        var wrapper = registry[object.api_getFlashId()];
        wrapper.dispatchEvent( 'error' );
      });
    });

    return new Popcorn.soundcloud.init( containerId, src, options );
  };

  // A constructor, but we need to wrap it to allow for "static" functions
  Popcorn.soundcloud.init = (function() {
    function pullFromContainer( that ) {
      var options = that._options,
          container = that._container,
          bounds = container.getBoundingClientRect(),
          tmp,
          undef;

      that.width = options.width || getStyle( container, "width" ) || "100%";
      that.height = options.height || getStyle( container, "height" ) || "81px";
      that.src = options.src;
      that.autoplay = options.autoplay;

      if ( parseFloat( that.height, 10 ) !== 81 ) {
        that.height = "81px";
      }

      that.offsetLeft = bounds.left;
      that.offsetTop = bounds.top;
      that.offsetHeight = parseFloat( that.height, 10 );
      that.offsetWidth = parseFloat( that.width, 10 );

      // Width and height may've been specified as a %, find the value now in case a plugin needs it (like subtitle)
      if ( /[\d]+%/.test( that.width ) ) {
        tmp = getStyle( container, "width" );
        that._container.style.width = that.width;
        that.offsetWidth = that._container.offsetWidth;
        that._container.style.width = tmp;
      }

      if ( /[\d]+%/.test( that.height ) ) {
        tmp = getStyle( container, "height" );
        that._container.style.height = that.height;
        that.offsetHeight = that._container.offsetHeight;
        that._container.style.height = tmp;
      }
    }

    // If container id is not supplied, assumed to be same as player id
    var ctor = function ( containerId, src, options ) {
      if ( !containerId ) {
        throw "Must supply an id!";
      } else if ( !src ) {
        throw "Must supply a source!";
      } else if ( /file/.test( location.protocol ) ) {
        throw "Must run from a web server!";
      }

      var container = this._container = document.getElementById( containerId );

      if ( !container ) {
        throw "Could not find that container in the DOM!";
      }

      options = options || {};
      options.api = options.api || {};
      options.target = containerId;
      options.src = src;
      options.api.commentformat = options.api.commentformat || formatComment;

      this._mediaId = 0;
      this._listeners = {};
      this._playerId = Popcorn.guid( options.target );
      this._containerId = options.target;
      this._options = options;
      this._comments = [];
      this._popcorn = null;

      pullFromContainer( this );

      this.duration = 0;
      this.volume = 1;
      this.currentTime = 0;
      this.ended = 0;
      this.paused = 1;
      this.readyState = 0;
      this.playbackRate = 1;

      this.top = 0;
      this.left = 0;

      this.autoplay = null;
      this.played = 0;

      this.addEventListener( "load", function() {
        var boundRect = this.getBoundingClientRect();

        this.top = boundRect.top;
        this.left = boundRect.left;

        this.offsetWidth = this.swfObj.offsetWidth;
        this.offsetHeight = this.swfObj.offsetHeight;
        this.offsetLeft = this.swfObj.offsetLeft;
        this.offsetTop = this.swfObj.offsetTop;
      });

      registry[ this._playerId ] = this;
      isReady( this );
    };
    return ctor;
  })();

  Popcorn.soundcloud.init.prototype = Popcorn.soundcloud.prototype;

  // Sequence object prototype
  Popcorn.extend( Popcorn.soundcloud.prototype, {
    // Set the volume as a value between 0 and 1
    setVolume: function( val ) {
      if ( !val && val !== 0 ) {
        return;
      }

      // Normalize in case outside range of expected values of 0 .. 1
      if ( val < 0 ) {
        val = -val;
      }

      if ( val > 1 ) {
        val %= 1;
      }

      // HTML video expects to be 0.0 -> 1.0, Flash object expects 0-100
      this.volume = this.previousVolume = val;
      this.swfObj.api_setVolume( val*100 );
      this.dispatchEvent( "volumechange" );
    },
    // Seeks the video
    setCurrentTime: function ( time ) {
      if ( !time && time !== 0 ) {
        return;
      }

      this.currentTime = this.previousCurrentTime = time;
      this.ended = time >= this.duration;

      // Fire events for seeking and time change
      this.dispatchEvent( "seeked" );
    },
    // Play the video
    play: function() {
      // In case someone is cheeky enough to try this before loaded
      if ( !this.swfObj ) {
        this.addEventListener( "load", this.play );
        return;
      } else if ( !this.paused ) {
        // No need to process if already playing
        return;
      }

      this.paused = 0;
      this.swfObj.api_play();
    },
    // Pause the video
    pause: function() {
      // In case someone is cheeky enough to try this before loaded
      if ( !this.swfObj ) {
        this.addEventListener( "load", this.pause );
        return;
      } else if ( this.paused ) {
        // No need to process if already playing
        return;
      }

      this.paused = 1;
      this.swfObj.api_pause();
    },
    // Toggle video muting
    // Unmuting will leave it at the old value
    mute: function() {
      // In case someone is cheeky enough to try this before loaded
      if ( !this.swfObj ) {
        this.addEventListener( "load", this.mute );
        return;
      }

      if ( !this.muted() ) {
        this.oldVol = this.volume;

        if ( this.paused ) {
          this.setVolume( 0 );
        } else {
          this.volume = 0;
        }
      } else {
        if ( this.paused ) {
          this.setVolume( this.oldVol );
        } else {
          this.volume = this.oldVol;
        }
      }
    },
    muted: function() {
      return this.volume === 0;
    },
    // Force loading by playing the player. Pause afterwards
    load: function() {
      // In case someone is cheeky enough to try this before loaded
      if ( !this.swfObj ) {
        this.addEventListener( "load", this.load );
        return;
      }

      this.play();
      this.pause();
    },
    // Hook an event listener for the player event into internal event system
    // Stick to HTML conventions of add event listener and keep lowercase, without prepending "on"
    addEventListener: function( evt, fn ) {
      if ( !this._listeners[evt] ) {
        this._listeners[evt] = [];
      }

      this._listeners[evt].push( fn );
      return fn;
    },
    dispatchEvent: function( evt ) {
      var self = this,
          evtName = evt.type || evt;

      // Manually triggered a UI event, have it invoke rather than just the event handlers
      if ( evtName === "play" && this.paused || evtName === "pause" && !this.paused ) {
        this[evtName]();
        return;
      }

      Popcorn.forEach( this._listeners[evtName], function( fn ) {
        fn.call( self );
      });
    },
    timeupdate: function() {
      var self = this,
          checkedVolume = this.swfObj.api_getVolume()/100,
          seeked = 0;

      // If has been changed through setting currentTime attribute
      if ( abs( this.currentTime - this.previousCurrentTime ) > timeCheckInterval ) {
        // Has programatically set the currentTime
        this.swfObj.api_seekTo( this.currentTime );
        seeked = 1;
      } else {
        this.previousCurrentTime = this.currentTime = this.swfObj.api_getTrackPosition();
      }

      // If has been changed throughh volume attribute
      if ( checkedVolume !== this.previousVolume ) {
        this.setVolume( checkedVolume );
      } else if ( this.volume !== this.previousVolume ) {
        this.setVolume( this.volume );
      }

      if ( !this.paused ) {
        this.dispatchEvent( 'timeupdate' );
      }

      if( !self.ended ) {
        setTimeout( function() {
          self.timeupdate.call( self );
        }, timeupdateInterval);
      }
    },

    getBoundingClientRect: function() {
      var b,
          self = this;

      if ( this.swfObj ) {
        b = this.swfObj.getBoundingClientRect();

        return {
          bottom: b.bottom,
          left: b.left,
          right: b.right,
          top: b.top,

          //  These not guaranteed to be in there
          width: b.width || ( b.right - b.left ),
          height: b.height || ( b.bottom - b.top )
        };
      } else {
        //container = document.getElementById( this.playerId );
        tmp = this._container.getBoundingClientRect();

        // Update bottom, right for expected values once the container loads
        return {
          left: tmp.left,
          top: tmp.top,
          width: self.offsetWidth,
          height: self.offsetHeight,
          bottom: tmp.top + this.width,
          right: tmp.top + this.height
        };
      }
    },

    registerPopcornWithPlayer: function( popcorn ) {
      if ( !this.swfObj ) {
        this.addEventListener( "load", function() {
          this.registerPopcornWithPlayer( popcorn );
        });
        return;
      }

      this._popcorn = popcorn;

      var api = this._options.api;

      if ( api.key && api.commentdiv ) {
        var self = this;

        Popcorn.xhr({
          url: "http://api.soundcloud.com/tracks/" + self._mediaId + "/comments.js?consumer_key=" + api.key,
          success: function( data ) {
            Popcorn.forEach( data.json, function ( obj ) {
              self.addComment({
                start: obj.timestamp/1000,
                date: new Date( obj.created_at ),
                text: obj.body,
                user: {
                  name: obj.user.username,
                  profile: obj.user.permalink_url,
                  avatar: obj.user.avatar_url
                }
              });
            });
          }
        });
      }
    }
  });

  Popcorn.extend( Popcorn.soundcloud.prototype, {
    addComment: function( obj, displayFn ) {
      var self = this,
          comment = {
            start: obj.start || 0,
            date: obj.date || new Date(),
            text: obj.text || "",
            user: {
              name: obj.user.name || "",
              profile: obj.user.profile || "",
              avatar: obj.user.avatar || ""
            },
            display: function() {
              return ( displayFn || self._options.api.commentformat )( comment );
            }
          };

      this._comments.push( comment );

      if ( !this._popcorn ) {
        return;
      }

      this._popcorn.subtitle({
        start: comment.start,
        target: this._options.api.commentdiv,
        display: 'inline',
        language: 'en',
        text: comment.display()
      });
    }
  });
})( Popcorn, window );
(function() {

  // global callback for vimeo.. yuck.
  vimeo_player_loaded = function( playerId ) {
    vimeo_player_loaded[ playerId ] && vimeo_player_loaded[ playerId ]();
  };
  vimeo_player_loaded.seek = {};
  vimeo_player_loaded.loadProgress = {};
  vimeo_player_loaded.play = {};
  vimeo_player_loaded.pause = {};

  Popcorn.player( "vimeo", {
    _setup: function( options ) {

      var media = this,
          vimeoObject,
          vimeoContainer = document.createElement( "div" ),
          currentTime = 0,
          seekTime = 0,
          seeking = false,
          volumeChanged = false,
          lastMuted = false,
          lastVolume = 0,
          height,
          width;

      vimeoContainer.id = media.id + Popcorn.guid();

      media.appendChild( vimeoContainer );

      // setting vimeo player's height and width, default to 560 x 315
      width = media.style.width ? ""+media.offsetWidth : "100%";
      height = media.style.height ? ""+media.offsetHeight : "100%";

      var vimeoInit = function() {

        var flashvars,
            params,
            attributes = {},
            src = media.src,
            toggleMuteVolume = 0,
            loadStarted = false;

        vimeo_player_loaded[ vimeoContainer.id ] = function() {
          vimeoObject = document.getElementById( vimeoContainer.id );

          vimeo_player_loaded.seek[ vimeoContainer.id ] = function( time ) {
            if( time !== currentTime ) {
              currentTime = time;
              media.dispatchEvent( "seeked" );
              media.dispatchEvent( "timeupdate" );
            }
          };

          vimeo_player_loaded.play[ vimeoContainer.id ] = function() {
            if ( media.paused ) {
              media.paused = false;
              media.dispatchEvent( "play" );

              media.dispatchEvent( "playing" );
              timeUpdate();
            }
          };

          vimeo_player_loaded.pause[ vimeoContainer.id ] = function() {
            if ( !media.paused ) {
              media.paused = true;
              media.dispatchEvent( "pause" );
            }
          };

          vimeo_player_loaded.loadProgress[ vimeoContainer.id ] = function( progress ) {

            if ( !loadStarted ) {
              loadStarted = true;
              media.dispatchEvent( "loadstart" );
            }

            if ( progress.percent === 100 ) {
              media.dispatchEvent( "canplaythrough" );
            }
          };

          vimeoObject.api_addEventListener( "seek", "vimeo_player_loaded.seek." + vimeoContainer.id );
          vimeoObject.api_addEventListener( "loadProgress", "vimeo_player_loaded.loadProgress." + vimeoContainer.id );
          vimeoObject.api_addEventListener( "play", "vimeo_player_loaded.play." + vimeoContainer.id );
          vimeoObject.api_addEventListener( "pause", "vimeo_player_loaded.pause." + vimeoContainer.id );

          var timeUpdate = function() {
            if ( !media.paused ) {
              currentTime = vimeoObject.api_getCurrentTime();
              media.dispatchEvent( "timeupdate" );
              setTimeout( timeUpdate, 10 );
            }
          },

          isMuted = function() {

            return vimeoObject.api_getVolume() === 0;
          };

          var volumeUpdate = function() {

            var muted = isMuted(),
            vol = vimeoObject.api_getVolume();
            if ( lastMuted !== muted ) {
              lastMuted = muted;
              media.dispatchEvent( "volumechange" );
            }

            if ( lastVolume !== vol ) {
              lastVolume = vol;
              media.dispatchEvent( "volumechange" );
            }

            setTimeout( volumeUpdate, 250 );
          };

          media.play = function() {
            media.paused = false;
            media.dispatchEvent( "play" );

            media.dispatchEvent( "playing" );
            timeUpdate();
            vimeoObject.api_play();
          };

          media.pause = function() {

            if ( !media.paused ) {

              media.paused = true;
              media.dispatchEvent( "pause" );
              vimeoObject.api_pause();
            }
          };

          Popcorn.player.defineProperty( media, "currentTime", {

            set: function( val ) {

              if ( !val ) {
                return currentTime;
              }

              currentTime = seekTime = +val;
              seeking = true;

              media.dispatchEvent( "seeked" );
              media.dispatchEvent( "timeupdate" );
              vimeoObject.api_seekTo( currentTime );

              return currentTime;
            },

            get: function() {

              return currentTime;
            }
          });

          Popcorn.player.defineProperty( media, "muted", {

            set: function( val ) {

              if ( isMuted() !== val ) {

                if ( val ) {
                  toggleMuteVolume = vimeoObject.api_getVolume();
                  vimeoObject.api_setVolume( 0 );
                } else {

                  vimeoObject.api_setVolume( toggleMuteVolume );
                }
              }
            },
            get: function() {

              return isMuted();
            }
          });

          Popcorn.player.defineProperty( media, "volume", {

            set: function( val ) {

              if ( !val || typeof val !== "number" || ( val < 0 || val > 1 ) ) {
                return vimeoObject.api_getVolume() / 100;
              }

              if ( vimeoObject.api_getVolume() !== val ) {
                vimeoObject.api_setVolume( val * 100 );
                lastVolume = vimeoObject.api_getVolume();
                media.dispatchEvent( "volumechange" );
              }

              return vimeoObject.api_getVolume() / 100;
            },
            get: function() {

              return vimeoObject.api_getVolume() / 100;
            }
          });

          media.readyState = 4;
          media.dispatchEvent( "canplaythrough" );
          media.dispatchEvent( "load" );
          media.duration = vimeoObject.api_getDuration();
          media.dispatchEvent( "durationchange" );
          volumeUpdate();

          media.dispatchEvent( "loadeddata" );
        };

        function extractId( videoUrl ) {

          if ( !videoUrl ) {
            return;
          }

          var rPlayerUri = /^http:\/\/player\.vimeo\.com\/video\/[\d]+/i,
              rWebUrl = /vimeo\.com\/[\d]+/;

          var matches = videoUrl.match( rPlayerUri ) ? videoUrl.match( rPlayerUri )[ 0 ].substr( 30 ) : "";
          return matches ? matches : videoUrl.match( rWebUrl ) ? videoUrl.match( rWebUrl )[ 0 ].substr( 10 ) : "";
        }

        if ( !( src = extractId( src ) ) ) {

          throw "Invalid Video Id";
        }

        flashvars = {
          clip_id: src,
          js_api: 1,
          js_swf_id: vimeoContainer.id
        };

        //  extend options from user to flashvars. NOTE: Videos owned by Plus Vimeo users may override these options
        Popcorn.extend( flashvars, options );

        params = {
          allowscriptaccess: "always",
          allowfullscreen: "true",
          wmode: "transparent"
        };

        swfobject.embedSWF( "//vimeo.com/moogaloop.swf", vimeoContainer.id,
                            width, height, "9.0.0", "expressInstall.swf",
                            flashvars, params, attributes );

      };

      if ( !window.swfobject ) {

        Popcorn.getScript( "//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js", vimeoInit );
      } else {

        vimeoInit();
      }
    }
  });
})();



// A global callback for youtube... that makes me angry
onYouTubePlayerReady = function( containerId )
{
  onYouTubePlayerReady[ containerId ] && onYouTubePlayerReady[ containerId ]();
};
// fixed 09/28/2012

stateChangeEventHandler = {};
onErrorEventHandler  = new Array();

Popcorn.player( "youtube", {
  _setup : function( options )
  {

    var media = this,
      youtubeObject,
      container = document.createElement( "div" ),
      currentTime = 0,
      seekTime = 0,
      seeking = false,
      delay =false,

      // state code for volume changed polling
      volumeChanged = false,
      lastMuted = false,
      lastVolume = 0;

    container.id = media.id + Popcorn.guid();
    youtubeId = Popcorn.guid();

     var guid = '';
    _.each(Popcorn.guid().toString().split(''), function(num){
      guid += 'abcdefghijklmnopqrstuvwxyz'[num]
    })
    media.youtubeId = guid;//Math.floor( Math.random()*1000).toString(16);
  
    media.appendChild( container );
    media.canPlay=0;
    var youtubeInit = function()
    {
      var flashvars,
          params,
          attributes,
          src,
          width,
          height,
          query;
          canPlay = 0;
    
      // expose a callback to this scope, that is called from the global callback youtube calls
      onYouTubePlayerReady[ container.id ] = function()
      {
        media.youtubeObject = document.getElementById( container.id );
        // more youtube callback nonsense
         stateChangeEventHandler[media.youtubeId] = function( state )
         {

          if ( state === 1&&media.canPlay==0)
          { 
            media.canPlay=1;
            media.pause();
            media.readyState = 4;
            media.duration = media.youtubeObject.getDuration();
            media.dispatchEvent( "canplaythrough" );
            media.dispatchEvent( "load" );
            media.dispatchEvent( "durationchange" );        
            media.dispatchEvent( "loadeddata" );
          
          }
          else if(state===1)
          {
            media.paused && media.play();
            // youtube fires paused events while seeking
            // this is the only way to get seeking events
          }
          else if ( state === 2 )
          {
            // silly logic forced on me by the youtube API
            // calling youtube.seekTo triggers multiple events
            // with the second events getCurrentTime being the old time
            if ( seeking && seekTime === currentTime && Math.abs(parseFloat(seekTime) - parseFloat(media.youtubeObject.getCurrentTime()))>2 )
            {
              media.youtubeObject.seekTo( currentTime );
              return;
            }
            else if(seeking && seekTime === currentTime && Math.abs(parseFloat(seekTime) - parseFloat(media.youtubeObject.getCurrentTime()))<2 )
            {
   
              seeking=false;
              delay=true; 
              currentTime = media.youtubeObject.getCurrentTime();
              media.dispatchEvent( "timeupdate" );
              !media.paused && media.pause();
              return
            }
            
            if(delay)
            {
              delay=false;
              return;
            }
            else
            {     
              currentTime = media.youtubeObject.getCurrentTime();
              media.dispatchEvent( "timeupdate" );
              !media.paused && media.pause();
              if(options.volume>1) media.youtubeObject.setVolume(options.volume);
            }
        
          }
        };

        stateChangeEventHandler[Popcorn.guid()] = function( errorCode )
        {
          if ( [ 2, 100, 101, 150 ].indexOf( errorCode ) !== -1 )
          {
            media.dispatchEvent( "error" );
          }
        };
        var fxnStr = "stateChangeEventHandler."+ media.youtubeId;
        // youtube requires callbacks to be a string to a function path from the global scope
        media.youtubeObject.addEventListener( "onStateChange", fxnStr );

        media.youtubeObject.addEventListener( "onError", "onErrorEventHandler[" + media.youtubeId+']');

        var timeupdate = function()
        {
          if ( !media.paused )
          {
            if( media.youtubeObject.getCurrentTime) currentTime = media.youtubeObject.getCurrentTime();
            media.dispatchEvent( "timeupdate" );
            setTimeout( timeupdate, 10 );
          }
        };

        var volumeupdate = function()
        {
          if(media&&media.youtubeObject&&media.youtubeObject.isMuted())
          {
            if ( lastMuted !== media.youtubeObject.isMuted() )
            {
              lastMuted = media.youtubeObject.isMuted();
              media.dispatchEvent( "volumechange" );
            }

            if ( lastVolume !== media.youtubeObject.getVolume() )
            {
              lastVolume = media.youtubeObject.getVolume();
              media.dispatchEvent( "volumechange" );
            }
            setTimeout( volumeupdate, 250 );
          }
          
        };

        media.play = function()
        {
          media.paused = false;
          media.dispatchEvent( "play" );

          media.dispatchEvent( "playing" );
          timeupdate();
          media.youtubeObject.playVideo();
        };

        media.pause = function()
        {
          if ( !media.paused )
          {
            media.paused = true;
            media.dispatchEvent( "pause" );
            media.youtubeObject.pauseVideo();
          }
        };

        Popcorn.player.defineProperty( media, "currentTime", {
          set : function( val )
          {
            if(val!=0||options.cue_in==0)
            {
              // make sure val is a number
              currentTime = seekTime = +val;
              seeking = true;
              media.dispatchEvent( "seeked" );
              media.dispatchEvent( "timeupdate" );
              media.youtubeObject.seekTo( currentTime );
            }
            else if(val==0&&options.cue_in==0)
            {
              media.dispatchEvent( "timeupdate" );
            }
            return currentTime;
          },
          get: function()
          {
            return currentTime;
          }
        });

        Popcorn.player.defineProperty( media, "muted", {
          set: function( val )
          {
            if ( media.youtubeObject.isMuted() !== val )
            {
              if ( val )
              {
                media.youtubeObject.mute();
              }
              else
              {
                media.youtubeObject.unMute();
              }
              lastMuted = media.youtubeObject.isMuted();
              media.dispatchEvent( "volumechange" );
            }
            return media.youtubeObject.isMuted();
          },

          get: function()
          {
            return media.youtubeObject.isMuted();
          }
        });

        Popcorn.player.defineProperty( media, "volume", {
          set : function( val )
          {
            if( media.youtubeObject.getVolume)
            {
              if ( media.youtubeObject.getVolume() / 100 !== val )
              { 
                media.youtubeObject.setVolume( val * 100 );
                lastVolume = media.youtubeObject.getVolume();
                media.dispatchEvent( "volumechange" );
              }
            }
            return media.youtubeObject.getVolume() / 100;
          },

          get: function()
          {
            if( media.youtubeObject.getVolume) return media.youtubeObject.getVolume() / 100;
          }
        });
    
        media.youtubeObject.loadVideoById(src,options.cue_in);
        
      };

      options.controls = +options.controls === 0 || +options.controls === 1 ? options.controls : 1;
      options.annotations = +options.annotations === 1 || +options.annotations === 3 ? options.annotations : 1;
      options.cue_in=options.cue_in||0
      options.volume=options.volume||1
     
      flashvars = { playerapiid: container.id };

      params = {
        wmode: "opaque", 
        disablekb: "1" ,
        allowScriptAccess: "always"
      };

      attributes = {
        id: container.id
      };

      src = /^.*(?:\/|v=)(.{11})/.exec( media.src )[ 1 ];
      query = ( media.src.split( "?" )[ 1 ] || "" ).replace( /v=.{11}/, "" );

      // setting youtube player's height and width, default to 560 x 315
      width = media.style.width ? ""+media.offsetWidth : "560";
      height = media.style.height ? ""+media.offsetHeight : "315";
      swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3&key=AI39si7oX_eCGjrxs2lil28MMQdXn-ZWhzku8fGsRVhju-pziYgmI3EOt0o4GmEl00vGXsA_OGGEKwX-xAM0a5Gbsr8zgrGpyg&playerapiid="+container.id, 
      container.id, '100%', '100%', "8", null, flashvars, params, attributes);
    };

    if ( !window.swfobject ) Popcorn.getScript( "//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js", youtubeInit );
    else youtubeInit();
  }
});


// A global callback for flashplayer... 


var onPlayerLoaded = function( containerId ) {
  onPlayerLoaded[ containerId ] && onPlayerLoaded[ containerId ]();
};

var onLoading= function( containerId, value ) {
  onLoading[ containerId ] && onLoading[ containerId ](value);
};

var onStateChange= function( containerId, eventid, eventvalue ) {
  onStateChange[ containerId ] && onStateChange[ containerId ](eventid, eventvalue);
};

var onError= function( containerId, value ) {
  onError[ containerId ] && onError[ containerId ](value);
};



Popcorn.player( "flashvideo", {
  _setup: function( options ) {

    var media = this,
        flashvideoObject,
        container = document.createElement( "div" ),
        currentTime = 0,
        seekTime = 0,
        seeking = false,

        // state code for volume changed polling
        volumeChanged = false,
        lastMuted = false,
        lastVolume = 100;

    container.id = media.id + Popcorn.guid();
  media.waiting =true;
    media.appendChild( container );

    var flashvideoInit = function() {

      var flashvars,
          params,
          attributes,
          src,
          width,
          height,
          query;

      // expose a callback to this scope, that is called from the global callback youtube calls
      onPlayerLoaded[ container.id ] = function() {

        console.log('player '+ container.id + ' has loaded');
    flashvideoObject = document.getElementById (container.id);
    
    onLoading[container.id] = function (value){
      console.log('on loading',value);
      if(value==2) media.duration = flashvideoObject.sendToFlash('getEndTime','');
      else if(value==3&&media.waiting){
        media.waiting=false;
        
        
        var timeupdate = function() {
        
            if ( !media.paused ) {
              currentTime = flashvideoObject.sendToFlash('getCurrentTime','');
              media.dispatchEvent( "timeupdate" );
              setTimeout( timeupdate, 10 );
            }
        };
        timeupdate();
        media.play = function() {       
          media.paused = false;
          media.dispatchEvent( "play" );
          
          media.dispatchEvent( "playing" );
          timeupdate();
          flashvideoObject.sendToFlash('play','');
        };
        
        media.pause = function() {
          if ( !media.paused ) {  
            media.paused = true;
            media.dispatchEvent( "pause" );
            flashvideoObject.sendToFlash('pause','');
          }
        };
        
        Popcorn.player.defineProperty( media, "currentTime", {
          set: function( val ) {
            
            //console.log('setting current time to',val);
            
            // make sure val is a number
            currentTime = seekTime = +val;
            seeking = true;
            media.dispatchEvent( "seeked" );
            media.dispatchEvent( "timeupdate" );
            flashvideoObject.sendToFlash('seek',currentTime);
            return currentTime;
            
          },
          get: function() {
            return currentTime;
          }
            });

        

      Popcorn.player.defineProperty( media, "volume", {
        set: function( val ) {
    
        
        if(val !=flashvideoObject.getVolume())flashvideoObject.sendToFlash('setVolume',val);
        return flashvideoObject.getVolume();
        
        },
        get: function() {
  
        return flashvideoObject.getVolume();
        }
      });
  
    
      media.readyState = 4;
      media.dispatchEvent( "canplaythrough" );
      media.dispatchEvent( "load" );
      media.duration = flashvideoObject.sendToFlash('getEndTime','');
      media.dispatchEvent( "durationchange" );
       
  
      media.dispatchEvent( "loadeddata" );
        }
        
    };
    
    
    onStateChange[container.id] = function (playerId, value){
        
        switch(value){
          case 1: // player loaded
            console.log("onLoading - player loaded "+playerId);
              break;
          case 2: // metadata loaded
              console.log("onLoading - metadata loaded "+playerId);
              break;
            case 3: // metadata loaded
              console.log("onLoading - can play "+playerId);
              break;
            default:
              console.log("onLoading - " + value);
        }
    }

    onError[container.id] = function (playerId, value){
        
        switch(value){
          case 1: // player loaded
            console.log("onError - failed to load file");
              break;
          case 2: // metadata loaded
                console.log("onError - wrong url or invalid file");
              break;
        }
    }
    var fun = "onLoading." + container.id;
    
    //Do we need these for any reason?
    //flashvideoObject.addEventListener( "onLoading", "onLoading." + container.id );
    //flashvideoObject.addEventListener( "onStateChange", "onStateChange." + container.id );
    //flashvideoObject.addEventListener( "onError", "onError." + container.id );
    
    console.log('player '+ container.id + ' has loaded');
    flashvideoObject.sendToFlash("load", src+','+options.cue_in); 
  
    
        
      
      };

      flashvars = {
        vidId: container.id
      };

      params = {
        wmode: "transparent",
        allowScriptAccess: "always",
        allownetworking : "all",
        bgcolor : "#000000",
      };

      attributes = {
        id: container.id
      };

      src = /(http.*)/.exec( media.src )[ 1 ];
     
      swfobject.embedSWF("assets/MediaPlayer.swf", container.id, "100%", "100%", "9.0.0", false, flashvars, params, attributes);
    
    
     
    };

    if ( !window.swfobject ) {

      Popcorn.getScript( "//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js", flashvideoInit );
    } else {

      flashvideoInit();
    }
  }
});

// EFFECT: applyclass

(function (Popcorn) {

  /**
   * apply css class to jquery selector
   * selector is relative to plugin target's id
   * so .overlay is actually jQuery( "#target .overlay")
   *
   * @param {Object} options
   * 
   * Example:
     var p = Popcorn('#video')
        .footnote({
          start: 5, // seconds
          end: 15, // seconds
          text: 'This video made exclusively for drumbeat.org',
          target: 'footnotediv',
          effect: 'applyclass',
          applyclass: 'selector: class'
        })
   *
   */

  var toggleClass = function( event, options ) {

    var idx = 0, len = 0, elements;

    Popcorn.forEach( options.classes, function( key, val ) {

      elements = [];

      if ( key === "parent" ) {

        elements[ 0 ] = document.querySelectorAll("#" + options.target )[ 0 ].parentNode;
      } else {

        elements = document.querySelectorAll("#" + options.target + " " + key );
      }

      for ( idx = 0, len = elements.length; idx < len; idx++ ) {

        elements[ idx ].classList.toggle( val );
      }
    });
  };

  Popcorn.compose( "applyclass", {
    
    manifest: {
      about: {
        name: "Popcorn applyclass Effect",
        version: "0.1",
        author: "@scottdowne",
        website: "scottdowne.wordpress.com"
      },
      options: {}
    },
    _setup: function( options ) {

      options.classes = {};
      options.applyclass = options.applyclass || "";

      var classes = options.applyclass.replace( /\s/g, "" ).split( "," ),
          item = [],
          idx = 0, len = classes.length;

      for ( ; idx < len; idx++ ) {

        item = classes[ idx ].split( ":" );

        if ( item[ 0 ] ) {
          options.classes[ item[ 0 ] ] = item[ 1 ] || "";
        }
      }
    },
    start: toggleClass,
    end: toggleClass
  });
})( Popcorn );

zeega.define("libs/popcorn/popcorn-flash", function(){});

zeega.define('zeega_dir/plugins/media-player/media-player',[
	'zeega',
	'libs/modernizr',
	'libs/popcorn/popcorn-flash'
],

function(Zeega){


	var Player = {Views:{}};

	Player.Views.Player = Zeega.Backbone.View.extend({
		
		className : 'media-player-container',
		
		defaults : {
			control_mode : 'none', // none / simple / standard / editor
			control_fade : true,
			
			media_target : null,
			controls_target : null,
			
			autoplay : false,
			cue_in : 0,
			cue_out : null,
			volume : 0.5,
			fade_in :0,
			fade_out : 0
		},
		
		initialize : function(options)
		{
			
			if(!_.isUndefined(this.model))
			{
				//_.extend( this.defaults, this.options );
				//if there is a model then figure out what kind it is
				var cloneAttr = _.extend({},this.model.toJSON());
				if( !_.isUndefined(this.model.get('uri')) )
				{
					// it must be from an item
					this.format = this.getFormat(cloneAttr.attribution_uri);
					this.settings = _.defaults( _.extend(cloneAttr, this.options) , this.defaults);
					this.settings.model = null;
				}
				else if( cloneAttr.attr && cloneAttr.attr.uri )
				{
					//it must be from a layer
					this.format = this.getFormat(cloneAttr.attr.attribution_uri);
					this.settings = _.defaults( _.extend(cloneAttr.attr, this.options), this.defaults );
					this.settings.id = this.model.id;
					this.settings.model = null;
				}
				else
				{
					console.log('I dont know what kind of media this is :(');
				}
			}
			
			this.model.on('pause_play', this.playPause, this);
			
		},
		
		render : function()
		{
			this.$el.css({ 'width':'100%', 'height':'100%'}); // move this to the CSS !!!  .media-player-container{ height, width}
			// choose which template to use
			var format = this.templates[this.format] ? this.format : 'defaulttemplate';
			this.$el.html( _.template( this.templates[format](), this.settings ));
			
			//attach controls. is this the right place?
			this.controls = new Player.Views.Player.Controls[this.settings.control_mode]({
				model:this.model,
				detached_controls : !_.isNull(this.settings.controls_target)
			});
			//draw the controls
			if( _.isNull(this.settings.controls_target) ) this.$el.append( this.controls.render().el );
			else $( this.settings.controls_target ).html( this.controls.render().el );

			return this;
		},
		
		placePlayer : function()
		{
			if( !this.isVideoLoaded)
			{
				var _this = this;
				switch( this.format )
				{
					case 'html5':
						if( this.model.get('type') == 'Audio' && Modernizr.audio.mp3 === '') this.useFlash();
						else if( this.model.get('type') == 'Video' && Modernizr.audio.h264 === '') this.useFlash();
						else this.useHTML5();
						break;
					case 'flashvideo':
						this.useFlash();
						break;
					case 'youtube':
						this.useYoutube();
						break;
					case 'vimeo':
						this.useVimeo();
						break;
					default:
						console.log('none set');
				}

				this.initPopcornEvents();

				this.isVideoLoaded = true;
			}
		},
		
		initPopcornEvents : function()
		{
			if(this.popcorn)
			{
				var _this = this;
				this.popcorn.listen('canplay',function(){
					_this.private_onCanPlay();
					_this.onCanplay();
				});
				
				this.popcorn.listen('timeupdate',function(){ _this.private_onTimeUpdate(); });
				this.popcorn.listen('ended',function(){ _this.onEnded(); });
			}
		},
		
		addPopcornToControls : function()
		{
			if(this.controls && this.popcorn && this.settings.control_mode != 'none' )
			{
				this.controls.addPopcorn( this.popcorn );
			}
		},
		
		useHTML5 : function()
		{
			var _this = this;
			var target = '#media-player-html5-'+ this.model.id;
			
			this.popcorn = Popcorn( target );
			this.addPopcornToControls();
			this.setVolume(0);
		
			this.popcorn.listen( 'canplay', function(){
			
				//_this.$el.spin(false);
				if( _this.settings.fade_in === 0 ) _this.setVolume( _this.settings.volume );
				if( _this.settings.cue_in !== 0 )
				{
					this.listen('seeked',function(){
						_this.model.can_play = true;
						_this.model.trigger('visual_ready', _this.model.id ) ;
					});
					_this.setCurrentTime( _this.settings.cue_in );
				}
				else
				{
					_this.model.can_play = true;
					_this.model.trigger('visual_ready', _this.model.id ) ;
				}
			});
		},
		useYoutube : function()
		{
			var _this = this;
			var target = '#media-player-'+ this.model.id;
			var src = this.model.get('attr').attribution_uri;
			
			this.popcorn = Popcorn.youtube( target, src, {volume:_this.settings.volume * 100, cue_in:_this.settings.cue_in} );
			this.addPopcornToControls();
			this.setVolume(0);

			this.popcorn.listen('canplaythrough',function(){
				_this.model.can_play = true;
				_this.popcorn.play();
				_this.popcorn.pause();
				_this.model.trigger('visual_ready', _this.model.id ) ;
				if(_this.model.get('attr').fade_in === 0) _this.volume(_this.model.get('attr').volume);
				_this.popcorn.pause();
			});
			
		},
		useFlash : function()
		{
			var _this = this;
			var target = '#media-player-'+ this.model.id;
			var src = this.model.get('attr').uri;
			
			this.popcorn = Popcorn.flashvideo( target, src, {volume:_this.settings.volume, cue_in:_this.settings.cue_in} );
			
			this.popcorn.listen('loadeddata',function(){
				//_this.$el.spin(false);
				
				_this.model.can_play = true;
				_this.model.trigger('visual_ready', _this.model.id ) ;
				
				if(_this.model.get('attr').fade_in === 0) _this.volume(_this.model.get('attr').volume);
			});
		},

		useVimeo : function()
		{
			this.popcorn = Popcorn.vimeo('#media-player-'+ this.model.id, this.get('url') );
			this.popcorn.listen('loadeddata',function(){
				_this.trigger('video_canPlay');
				_this.popcorn.currentTime(_this.get('cue_in'));
			});
		},
		private_onCanPlay : function()
		{
			this.model.set('duration', this.popcorn.duration() );
			if( _.isNull(this.model.get('cue_out')) ) this.model.set('cue_out', this.popcorn.duration() );
			
		},
		onCanplay : function()
		{
			if(this.settings.autoplay && this.popcorn) this.popcorn.play();
		},

		_onEnded : function()
		{
			this.model.trigger('media_ended', this.model.toJSON() );
		},
		
		// getters && setters //
		
		setVolume : function(vol)
		{
			// constrain volume to 0 < v < 1
			var volume = vol < 0 ? 0 : vol;
			volume = vol > 1 ? 1 : vol;
			if( _.isNumber(vol) ) this.popcorn.volume( volume );
		},
		getVolume : function(){ return this.popcorn.volume(); },

		setCurrentTime : function(t){ if( _.isNumber(t) )  this.popcorn.currentTime(t); },
		getCurrentTime : function(){ return this.popcorn.currentTime(); },

		private_onTimeUpdate : function()
		{
			// pause if player gets to the cue out point
			
			if(this.settings.cue_out === 0) this.settings.cue_out = this.getDuration();
			
			if( !_.isNull(this.settings.cue_out) && this.popcorn.currentTime() >= this.settings.cue_out )
			{
				this.pause();
				this.popcorn.currentTime( this.settings.cue_in );
			}
		},

		getDuration: function(){ return this.popcorn.duration(); },

		play : function(){ if( this.popcorn && this.popcorn.paused() ) this.popcorn.play(); },
		pause : function(){ if( this.popcorn && !this.popcorn.paused() ) this.popcorn.pause(); },
		playPause : function()
		{
			if(this.popcorn)
			{
				if(this.popcorn.paused()) this.popcorn.play();
				else this.popcorn.pause();
			}
		},
		
		destroy : function()
		{
			if(this.popcorn)
			{
				this.popcorn.pause();
				
				Popcorn.destroy( this.popcorn );
				//this.popcorn.destroy();
			}
		},
		
		getFormat : function(url)
		{
			//separated to make it easier to isolate and update this list
			var format = '';
//			if( url.match(/http:\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#\!)v=)([\w-]{11}).*/gi) ) format = 'youtube';
			if( url.match(/http:\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#\!)v=)([\w\-]{11}).*/gi) ) format = 'youtube'; // linted?
			else if ( url.match(/^http:\/\/(?:www\.)?vimeo.com\/(.*)/) ) format = 'vimeo';
			else format = 'html5';
			//Force flash for html5 in Firefox browser
			if( navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length-1].split('/')[0] == 'Firefox' && format=='html5' ) format='flashvideo';
			return format;
		},
		
		
		templates : {
			
			html5 : function()
			{
				html =
				"<div id='media-player-<%= id %>' class='media-container'><video id='media-player-html5-<%= id %>' class='media-element media-type-<%= media_type %>' src='<%= uri %>'></video></div>";
				return html;
			},
			
			flashvideo : function()
			{
				html =
				"<div id='media-player-<%= id %>' class='media-container' style='width:100%;height:100%;'></div>";
				return html;
			},

			defaulttemplate : function()
			{
				html =
				"<div id='media-player-<%= id %>' class='media-container' style='width:100%;height:100%;'></div>";
				return html;
			}
			
		}
		
	});
	
	
	/*****************************
	
		CONTROLS
		
	*****************************/
	
	Player.Views.Player.Controls = Player.Views.Player.Controls || {};
	
	Player.Views.Player.Controls.none = Zeega.Backbone.View.extend({
		className : 'controls playback-controls controls-none',
		item_mode : false,
		
		initialize : function()
		{
			if(this.options.detached_controls) this.$el.addClass('playback-layer-controls');
			if(this.model.get('uri')) this.item_mode = true;
			this.init();
		},
		
		init : function(){}
	});
	
	Player.Views.Player.Controls.simple = Player.Views.Player.Controls.none.extend({
		
		className : 'controls playback-controls controls-simple',
		
		addPopcorn : function(pop)
		{
			this.popcorn = pop;
			this.initPopcornEvents();
		},
		
		initPopcornEvents : function()
		{
			var _this = this;
			this.popcorn.listen('canplay',function(){ _this.onCanPlay(); });
			this.popcorn.listen('canplaythrough',function(){ _this.onCanPlay(); });
			this.popcorn.listen('ended',function(){ _this.onEnded(); });
			this.popcorn.listen('playing',function(){ _this.onPlaying(); });
			this.popcorn.listen('pause',function(){ _this.onPause(); });
		},
		
		render : function()
		{
			this.$el.html( this.getTemplate() );
			return this;
		},
		
		events : {
			'click' : 'playPause',
			'mouseover' : 'onMouseover',
			'mouseout' : 'onMouseout'
		},
		
		onCanPlay : function()
		{
			this.updatePlayPauseIcon();
			this.updateCues();
		},
		
		updateCues : function()
		{
			this.cueIn = this.item_mode === true ? this.model.get('cue_in') : this.model.get('attr').cue_in;
			this.cueOut = (this.item_mode === true ? this.model.get('cue_out') : this.model.get('attr').cue_out) || this.duration;
		},
		
		playPause : function()
		{
			
			if(this.popcorn)
			{
				if(this.popcorn.paused()) this.popcorn.play();
				else this.popcorn.pause();
				this.updatePlayPauseIcon();
			}
			return false;
		},
		
		updatePlayPauseIcon : function()
		{
			if(this.popcorn)
			{
				if( !this.popcorn.paused() ) this.$el.find('.pause-play i').addClass('icon-pause').removeClass('icon-play');
				else this.$el.find('.pause-play i').removeClass('icon-pause').addClass('icon-play');
			}
		},
		
		onPlaying : function()
		{
			// fade out after play
			if( this.model.get('control_fade') ) this.setFadeTimeout();
			this.updatePlayPauseIcon();
			this.updatePlayPauseIcon();
		},
		
		setFadeTimeout : function()
		{
			var _this = this;
			if(this.timer) clearTimeout(_this.timer);
			this.timer = setTimeout( function(){
				_this.fadeOutControls();
				clearTimeout(_this.timer);
			}, 3500);
		},
		
		onMouseover : function()
		{
			if(this.model.get('control_fade') && !this.popcorn.paused() )
			{
				if(this.timer) clearTimeout( this.timer );
				this.fadeInControls();
			}
		},
		onMouseout : function()
		{
			if(this.model.get('control_fade') && !this.popcorn.paused() )
				this.setFadeTimeout();
		},
		
		fadeOutControls : function()
		{
			if(this.$el.find('.player-control-inner').is(':visible') && !this.popcorn.paused()) this.$el.find('.player-control-inner').fadeOut('slow');
		},
		fadeInControls : function()
		{
			if(this.$el.find('.player-control-inner').is(':hidden')) this.$el.find('.player-control-inner').fadeIn('fast');
		},
		
		onPause : function()
		{
			if(this.timer) clearTimeout( this.timer );
			// make sure  controls are visible
			this.fadeInControls();
			this.updatePlayPauseIcon();
		},
		
		onEnded : function()
		{
			this.$el.find('.pause-play i').addClass('icon-play').removeClass('icon-pause');
		},
		
		getTemplate : function()
		{
			var html =
			
			"<div class='player-control-inner'><a href='#' class='pause-play pull-left'><i class='icon-pause icon-white'></i></a></div>";
			
			return html;
		}
	});
	
	Player.Views.Player.Controls.standard = Player.Views.Player.Controls.simple.extend({
		
		isSeeking : false,
		
		className : 'controls playback-controls controls-standard',
		
		addPopcorn : function(pop)
		{
			this.popcorn = pop;
			this.initPopcornEvents();
		},
		
		initPopcornEvents : function()
		{
			var _this = this;
			this.popcorn.listen('canplay',function(){ _this.onCanPlay(); });
			this.popcorn.listen('ended',function(){ _this.onEnded(); });
			this.popcorn.listen('timeupdate',function(){ _this.updateElapsed(); });
			this.popcorn.listen('playing',function(){ _this.onPlaying(); });
			this.popcorn.listen('pause',function(){ _this.onPause(); });
		},
		
		events : {
			'click .pause-play' : 'playPause',
			'mouseover' : 'onMouseover',
			'mouseout' : 'onMouseout'
		},
		
		onCanPlay : function()
		{
			this.updateDuration();
			this.updateCues();
			this.updatePlayPauseIcon();
			
			this.initScrubber();
		},
		
		initScrubber : function()
		{
			var _this = this;
			this.$el.find('.media-scrubber').slider({
				range: 'min',
				min: 0,
				max : this.duration,
				
				slide : function(e,ui){ _this.scrub( ui.value ); },
				stop : function(e,ui){ _this.seek(ui.value); }
			});
		},
		
		updateDuration : function()
		{
			this.duration = this.popcorn.duration();
			this.$el.find('.media-time-duration').html( convertTime(this.duration) );
		},
		updateElapsed : function()
		{
			var elapsed = this.popcorn.currentTime();
			this.$el.find('.media-time-elapsed').html( convertTime( elapsed ) );
			this.$el.find('.media-scrubber').slider('value', elapsed);
		},
		
		scrub : function( time )
		{
			var _this = this;
			this.isSeeking = true;

		},
		seek : function( time )
		{
			var wasPlaying = !this.popcorn.paused();
			if(wasPlaying) this.popcorn.pause();

			if( time < this.cueIn )
			{
				this.$el.find('.media-scrubber').slider('value',this.cueIn);
				time = this.cueIn;
			}
			else if( time > this.cueOut )
			{
				this.$el.find('.media-scrubber').slider('value',this.cueOut);
				time = this.cueOut;
			}
			else
			{
				this.$el.find('.media-scrubber').slider('value',time);
			}
			
			this.popcorn.currentTime(time);
			if(wasPlaying) this.popcorn.play();
		},
		
		getTemplate : function()
		{
			var html =
			"<div class='player-control-inner'>"+
				"<div class='media-scrubber'></div>"+
				"<div class='control-panel-inner'>"+
					"<a href='#' class='pause-play pull-left'><i class='icon-pause icon-white'></i></a>"+
					"<div class='pull-right'><span class='media-time-elapsed'>0:00</span> / <span class='media-time-duration'>0:00</span></div>"+
				"</div>"+
			"</div>";
			
			return html;
		}
	});
	
	Player.Views.Player.Controls.editor = Player.Views.Player.Controls.standard.extend({
		
		className : 'controls playback-controls controls-editor',
		
		initPopcornEvents : function()
		{
			var _this = this;
			this.popcorn.listen('canplay',function(){ _this.onCanPlay(); });
			this.popcorn.listen('canplaythrough',function(){ _this.onCanPlay(); });
			this.popcorn.listen('ended',function(){ _this.onEnded(); });
			this.popcorn.listen('timeupdate',function(){ _this.updateElapsed(); });
			this.popcorn.listen('playing',function(){ _this.onPlaying(); });
			this.popcorn.listen('pause',function(){ _this.onPause(); });
		},
		
		events : {
			'click .pause-play' : 'playPause',
			'mouseover' : 'onMouseover',
			'mouseout' : 'onMouseout',
			'mousedown .progress-outer' : 'scrub'
		},
		
		onCanPlay : function()
		{
			this.updateDuration();
			this.updateCues();
			this.updatePlayPauseIcon();
			
			this.initScrubber();
			this.initCropTool();
		},
		
		updateDuration : function()
		{
			this.duration = this.popcorn.duration();
			this.$el.find('.media-time-duration').html( convertTime(this.duration) );
		},
		updateElapsed : function()
		{
			var elapsed = this.popcorn.currentTime();
			this.$el.find('.media-time-elapsed').html( convertTime( elapsed ) );
			this.$el.find('.media-scrubber').slider('value', elapsed);
			if(elapsed >= this.cueOut) this.popcorn.pause();
		},
		
		initCropTool : function()
		{
			var _this = this;
			
			//this.cueIn = this.item_mode ? this.model.get('cue_in') : this.model.get('attr').cue_in;
			//this.cueOut = (this.item_mode ? this.model.get('cue_out') : this.model.get('attr').cue_out) || this.duration;
			
			this.$el.find('.crop-time-left .time').text( convertTime( this.cueIn ) );
			this.$el.find('.crop-time-right .time').text( convertTime( this.cueOut ) );
			
			this.$el.find('.crop-slider').slider({
				range:true,
				min:0,
				max:_this.duration,
				values : [ _this.cueIn , _this.cueOut ],
				slide : function(e,ui){ _this.onCropSlide(e,ui); },
				stop : function(e,ui){ _this.onCropStop(e,ui); }
			});
			
			this.$el.find('.crop-time-left .time').unbind('keypress').keypress(function(e){
				if((e.which >= 48 && e.which <= 58) || e.which == 13)
				{
					if( e.which == 13 )
					{
						var sec = _this.convertToSeconds($(this).text());
						if(sec === false)
						{
							$(this).text( convertTime(_this.model.get('cue_in')) );
						
						}
						else
						{

							sec = sec < 0 ? 0 : sec;
							sec = sec > _this.model.get('cue_out') ? _this.model.get('cue_out') : sec;
							$(this).text( convertTime(sec) );
							_this.$el.find('.crop-slider').slider('values',0, sec );
							_this.cueIn =sec;
							_this.model.update({ 'cue_in' : sec });
							_this.seek( sec );
						}
						this.blur();
						return false;
					}
				}
				else return false;
			});
			this.$el.find('.crop-time-right .time').unbind('keypress').keypress(function(e){
				if((e.which >= 48 && e.which <= 58) || e.which == 13)
				{
					if( e.which == 13 )
					{
						var sec = _this.convertToSeconds( $(this).text() );
					
						if(sec === false)
						{
							$(this).text( convertTime(_this.model.get('cue_out')) );
						}
						else
						{
							sec = sec > _this.duration ? _this.duration : sec;
							sec = sec < _this.model.get('cue_in') ? _this.model.get('cue_in') : sec;
							$(this).text( convertTime(sec) );
							_this.$el.find('.crop-slider').slider('values',1, sec );
							_this.cueOut = sec;
							_this.seek( Math.max(sec-5,_this.cueIn) );
							_this.model.update({ 'cue_out' : sec });
						}
						this.blur();
						return false;
						
					}
				}
				else return false;
			});

			//Temp fix, this should be removed
			$('.time').mousedown(function(){$(this).focus();});
		},
		
		convertToSeconds : function( string )
		{
			var st = string.split(/:/);
			var flag = false;
			var sec = 0;
			
			_.each( st.reverse(), function(number,i){
				if(number.length > 2)
				{
					flag = true;
					return false;
				}
				else
				{
					var num = parseInt(number,10);
					if( !_.isNumber(num) )
					{
						flag = true;
						return false;
					}
					else
					{
						if(i) sec += num * i * 60;
						else sec += num;
					}
				}
			});
			if( flag ) return false;
			else return sec;
		},
		
		onCropSlide : function(e,ui)
		{
			this.$el.find('.crop-time-left .time').html( convertTime(ui.values[0]) );
			this.$el.find('.crop-time-right .time').html( convertTime(ui.values[1]) );
		},
		
		onCropStop : function(e,ui)
		{
			this.cueIn = ui.values[0];
			this.cueOut = ui.values[1];
			
			if( !this.item_mode)
			{
				this.model.update({
					'cue_in' : ui.values[0],
					'cue_out' : ui.values[1]
				});
			}

			this.popcorn.pause();
			this.seek( ui.values[0] );
		},
		
		getTemplate : function()
		{
			var html =
			"<div class='player-control-inner'>"+
			
				"<div class='crop-wrapper'>"+
					"<div class='crop-time-values clearfix'><span class='crop-time-left'>in [<span class='time' contenteditable='true'>0:00</span>]</span><span class='crop-time-right'>out [<span class='time' contenteditable='true'>0:00</span>]</span></div>"+
					"<div class='crop-slider'></div>"+
				"</div>"+
				
				"<div class='media-scrubber'></div>"+
			
				"<div class='control-panel-inner'>"+
					"<a href='#' class='pause-play pull-left'><i class='icon-play icon-white'></i></a>"+
					"<div class='pull-right'><span class='media-time-elapsed'>0:00</span> / <span class='media-time-duration'>0:00</span></div>"+
				"</div>"+
			
			"</div>";
			
			return html;
		}
	});


	return Player;

});

zeega.define('zeega_dir/plugins/layers/video/video',[
	"zeega",
	'zeega_dir/plugins/layers/_layer/_layer',

	'zeega_dir/plugins/media-player/media-player'
],

function(Zeega, _Layer, MediaPlayer){

	var Layer = Zeega.module();

	Layer.Video = _Layer.extend({
			
		layerType : 'Video',

		defaultAttributes : {
			'title' : 'Video Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'volume' : 0.5,
			'cue_in'  : 0,
			'cue_out' : null,
			'fade_in' : 0,
			'fade_out' : 0,
			'dissolve': false,
			'loop' : false,
			'opacity':1,
			'dimension':1.5,
			'citation':true
		}

	});

	Layer.Video.Visual = _Layer.Visual.extend({
		
		template : 'plugins/video',

		ended : false,
		playbackCount : 0,

		init : function()
		{
			//this.mediaPlayer = new MediaPlayer.Views.Player({
			//	model:this.model,
			//	control_mode : 'editor',
			//	media_target : '#layer-visual-'+this.id,
			//	controls_target : '#media-controls-'+this.id
			//})
		},

		onPlay : function()
		{
			this.ended = false;
			this.mediaPlayer.play();
		},

		onPause : function()
		{
			this.mediaPlayer.pause();
		},
		
		onExit : function()
		{
			this.mediaPlayer.pause();
		},
		
		verifyReady : function()
		{
			if( this.mediaPlayer_loaded !== true )
			{
				var _this = this;
				this.mediaPlayer = new MediaPlayer.Views.Player({
					model:this.model,
					control_mode : 'none',
					media_target : '#visual-element-'+ this.id
				});
				this.$el.append( this.mediaPlayer.el );
				this.mediaPlayer.render();
				this.mediaPlayer.placePlayer();
				this.mediaPlayer.popcorn.listen('timeupdate', function(){ _this.onTimeUpdate(); });
				this.model.on('media_ended', function(){ _this.onEnded(); });

				this.mediaPlayer_loaded = true;
			}
			else
			{
				this.mediaPlayer.pause();
			}
		},

		onTimeUpdate : function()
		{
			if(!this.ended)
			{
				//Fades
				var out,vol;
				if( this.getAttr('cue_out') === 0 || this.getAttr('cue_out') === null ) out = this.mediaPlayer.getDuration();
				else out = this.getAttr('cue_out');
				var t = this.mediaPlayer.getCurrentTime();
				var f = parseFloat(this.getAttr('cue_in'))+parseFloat(this.getAttr('fade_in'));
				var g = out - parseFloat(this.getAttr('fade_out'));

				if(this.getAttr('fade_in') > 0 && t < f )
				{
					vol = this.getAttr('volume') *(1.0-((f-t)/this.getAttr('fade_in')) * ((f-t) / this.getAttr('fade_in')));
					this.mediaPlayer.setVolume(vol);
				}
				else if(this.getAttr('fade_out') > 0 && t > g )
				{
					//vol = this.getAttr('volume') * (1.0-((t-g) / this.getAttr('fade_out') ))*(1.0-((t-g)/this.getAttr('fade_out') ));
					//this.mediaPlayer.setVolume(vol);
				}
				else if(Math.abs(this.getAttr('volume') - this.mediaPlayer.getVolume())>0.01)
				{
					this.mediaPlayer.setVolume(this.getAttr('volume'));
				}
				// send updates to the player. must include the layer info incase there are > 1 media layers on a single frame
				var info = {
					id : this.model.id,
					media_type : this.getAttr('media_type'),
					layer_type : this.getAttr('layer_type'),
					current_time : this.mediaPlayer.getCurrentTime(),
					duration : this.mediaPlayer.getDuration()
				};
				this.model.trigger('media_timeupdate', info);
				if( this.mediaPlayer.getCurrentTime() >= out ) this.onEnded();
			}
		},

		onEnded : function()
		{
			this.playbackCount++;
			this.model.trigger('playback_ended', this.model.toJSON() );
			if(this.getAttr('loop'))
			{
				this.mediaPlayer.currentTime( this.getAttr('cue_in') );
				this.mediaPlayer.play();
			}
			else
			{
				this.ended = true;
			}
		}

	});

	Layer.Youtube = Layer.Video.extend();
	Layer.Youtube.Visual = Layer.Video.Visual.extend();

	Layer.Vimeo = Layer.Video.extend();
	Layer.Vimeo.Visual = Layer.Video.Visual.extend();

	return Layer;

});
zeega.define('zeega_dir/plugins/layers/audio/audio',[
	'zeega',
	'zeega_dir/plugins/layers/_layer/_layer',
	'zeega_dir/plugins/layers/video/video'
],

function(Zeega, _Layer, VideoLayer){

	var Layer = Zeega.module();

	Layer.Audio = _Layer.extend({
			
		layerType : 'Audio',

		defaultAttributes : 
		{
			'title' : 'Audio Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 0,
			'width' : 0,
			'volume' : 0.5,
			'cue_in'  : 0,
			'cue_out' : null,
			'fade_in'  : 0,
			'fade_out' : 0,
			'opacity' : 0,
			'citation':true
		}

	});
	Layer.Audio.Visual = VideoLayer.Video.Visual.extend({
		template : 'plugins/audio'
	});

	return Layer;

});

/*

plugin/layer manifest file

this should be auto generated probably!!

*/

zeega.define('zeega_dir/plugins/layers/_all',[
	'zeega_dir/plugins/layers/image/image',
	'zeega_dir/plugins/layers/link/link',
	'zeega_dir/plugins/layers/slideshow/slideshow',
	'zeega_dir/plugins/layers/video/video',
	'zeega_dir/plugins/layers/audio/audio'		
],
	function(
		image,
		link,
		slideshow,
		video,
		audio
	)
	{
		var Plugins = {};
		_.extend( Plugins, image, link, slideshow, video, audio ); // extend the plugin object with all the layers
		return Plugins;
	}
);
zeega.define('zeega_dir/player/layer',[
	"zeega",
	"zeega_dir/plugins/layers/_all"
],

function(Zeega, Plugin)
{
	var Layer = Zeega.module();

	var LayerModel = Zeega.Backbone.Model.extend({

		ready : false,
		status : 'waiting', // waiting, loading, ready, destroyed, error
		
		defaults : {
			mode: 'player'
		},

		initialize : function()
		{
			// init link layer type inside here
			if( Plugin[this.get('type')] )
			{
				this.layerClass = new Plugin[this.get('type')]();
				var def = _.defaults( this.toJSON(), this.layerClass.defaults );
				this.set(def);

				// create and store the layerClass
				this.visualElement = new Plugin[this.get('type')].Visual({
					model:this,
					attributes:{
						id : 'visual-element-' + this.id,
						'data-layer_id' : this.id
					}
				});
				// listen to visual element events
				this.on('visual_ready', this.onVisualReady, this);
				this.on('visual_error', this.onVisualError, this);
			}
			else
			{
				this.ready = true;
				this.status = 'error';
				console.log('could not find valid layer type: ',this.get('type'));
			}
		},

		render : function()
		{
			// make sure the layer class is loaded or fail gracefully
			if( this.visualElement )
			{
				// if the layer is ready, then just show it
				if( this.status == 'waiting')
				{
					this.status = 'loading';
					this.trigger('layer_loading', this.toJSON());
					this.visualElement.player_onPreload();
				}
				else if( this.status == 'ready' )
				{
					this.visualElement.play();
				}
			}
			else
			{
				console.log('***	The layer '+ this.get('type') +' is missing. ): ', this.id);
			}
		},

		onVisualReady : function()
		{
			this.ready = true;
			this.status = 'ready';
			this.trigger('layer_ready', this.toJSON());
		},

		onVisualError : function()
		{
			this.ready = true;
			this.status = 'error';
			this.trigger('layer_error', this.toJSON());
		},

		updateZIndex : function(z)
		{
			this.visualElement.updateZIndex(z);
		},

		pause : function()
		{
			this.visualElement.player_onPause();
		},

		play : function()
		{
			this.visualElement.player_onPlay();
		},

		exit : function()
		{
			if( this.layerClass )
			{
				this.visualElement.player_onExit();
			}
		},

		remove : function()
		{
			if( this.layerClass )
			{
				this.visualElement.remove();
			}
		},

		// removes the layer. destroys players, removes from dom, etc
		destroy : function()
		{
			// do not attempt to destroy if the layer is waiting or destroyed
			if( this.status != 'waiting' && this.status != 'destroyed' )
			{
				this.status = 'destroyed';
			}
		}
	});

	Layer.Collection = Zeega.Backbone.Collection.extend({
		model : LayerModel
	});

	return Layer;
});
zeega.define('zeega_dir/player/frame',[
	"zeega",
	"zeega_dir/player/layer"
],

function(Zeega, Layer)
{
	var Frame = Zeega.module();

	var FrameModel = Zeega.Backbone.Model.extend({

		ready : false,
		status : 'waiting', // waiting, loading, ready, destroyed
		hasPlayed : false,

		// frame render as soon as it's loaded. used primarily for the initial frame
		renderOnReady : null,

		defaults : {
			attr : { advance : 0 },
			common_layers : {},			// ids of frames and their common layers for loading
			layers : [],				// ids of layers contained on frame
			link_to : [],				// ids of frames this frame can lead to
			link_from : [],				// ids of frames this frame can be accessed from
			preload_frames : [],
			next : null,				// id of the next frame
			prev : null					// id of the previous frame
		},

		// for convenience
		getNext : function(){ return this.get('next'); },
		getPrev : function(){ return this.get('prev'); },

		// sets the sequence adjacencies as a string
		setConnections : function()
		{
			if( !_.isNull(this.get('prev')) && !_.isNull(this.get('next')) ) this.set('connections','lr');
			else if( !_.isNull(this.get('prev')) && _.isNull(this.get('next')) ) this.set('connections','l');
			else if( _.isNull(this.get('prev')) && !_.isNull(this.get('next')) ) this.set('connections','r');
			else this.set('connections','none');
		},

		preload : function()
		{
			var _this = this;
			if(this.status != 'ready')
			{
				this.layers.each(function(layer){
					if( layer.status == 'waiting' )
					{
						layer.on('layer_ready', _this.onLayerReady, _this);
						layer.render();
					}
				});
			}
		},

		// render from frame.
		render : function( oldID )
		{
			// if frame is completely loaded, then just render it
			// else try preloading the layers
			var _this = this;
			if( _this.status == 'ready' )
			{
				// only render non-common layers. allows for persistent layers
				var commonLayers = this.get('common_layers')[oldID] || [];
				// if the frame is 'ready', then just render the layers
				this.layers.each(function(layer){
					if( !_.include(commonLayers, layer.id) ) layer.render();
				});
				this.trigger('frame_rendered', _.extend({}, this.toJSON(), {layers: this.layers.toJSON()} ));
			}
			else
			{
				this.renderOnReady = oldID;
			}
			this.layers.each(function(layer, i){
				layer.updateZIndex( _this.layers.length - i );
			});
		},

		onLayerReady : function( layer )
		{
			//this.trigger('layer_ready',layer.toJSON() );
			this.trigger('frame_progress', this.getLayerStates() );

			if( this.isFrameReady() ) this.onFrameReady();

			// trigger events on layer readiness
			var statuses = this.layers.map(function(layer){ return layer.status;	});
			//var include
		},

		onFrameReady : function()
		{
			this.ready = true;
			this.status = 'ready';
			this.trigger('frame_ready',{ frame: this.toJSON(),layers: this.layers.toJSON() });
			if( !_.isNull(this.renderOnReady) )
			{
				this.trigger('can_play');
				this.render( this.renderOnReady );
				this.renderOnReady = null;
			}
		},

		getLayerStates : function()
		{
			var states = {};
			states.ready =		_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'ready'; }), function(layer){ return layer.attributes; });
			states.waiting =	_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'waiting'; }), function(layer){ return layer.attributes; });
			states.loading =	_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'loading'; }), function(layer){ return layer.attributes; });
			states.destroyed =	_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'destroyed'; }), function(layer){ return layer.attributes; });
			states.error =		_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'error'; }), function(layer){ return layer.attributes; });
			return states;
		},

		isFrameReady : function()
		{
			var states = this.getLayerStates();
			if( states.ready.length + states.error.length  == this.layers.length ) return true;
			return false;
		},

		pause : function()
		{
			this.layers.each(function(layer){
				layer.pause();
			});
		},

		play : function()
		{
			this.layers.each(function(layer){
				layer.play();
			});
		},

		exit : function( newID )
		{
			var commonLayers = this.get('common_layers')[newID] || [];
			this.layers.each(function(layer){
				if( !_.include(commonLayers, layer.id) ) layer.exit();
			});
		},

		unrender : function( newID )
		{
			// not sure I need this
		},

		// manages the removal of all child layers
		destroy : function()
		{
			// do not attempt to destroy if the layer is waiting or destroyed
			if( this.status != 'waiting' && this.status != 'destroyed' )
			{
				this.layers.each(function(layer){ layer.destroy(); });
				this.status = 'destroyed';
			}
		}

	});

	Frame.Collection = Zeega.Backbone.Collection.extend({
		model : FrameModel,

		// logic that populates the frame with information about it's connections, state, and position within the project
		load : function( sequences,layers, preload_ahead )
		{
			var _this = this;
			// create a layer collection. this does not need to be saved anywhere
			var layerCollection = new Layer.Collection(layers);

			this.each(function(frame){

				var linkedArray = [];
				// make a layer collection inside the frame
				frame.layers = new Layer.Collection();
				// add each layer to the collection
				_.each( frame.get('layers'), function(layerID){
					frame.layers.add( layerCollection.get(layerID) );
				});

				// make connections by sequence>frame order
				_.each( sequences, function(sequence){
					if( sequence.frames.length > 1 )
					{
						var index = _.indexOf( sequence.frames, frame.id );
						if( index > -1 )
						{
							var prev = sequence.frames[index-1] || null;
							var next = sequence.frames[index+1] || null;

							frame.set({
								prev : prev,
								next : next
							});
							frame.setConnections();
						}
					}
				});

				// make connections by link layers
				// get all a frame's link layers
				var linkLayers = frame.layers.where({type:'Link'});
				var linkTo = [];
				var linkFrom = [];
				_.each( linkLayers, function(layer){
					// links that originate from this frame
					if( layer.get('attr').from_frame == frame.id )
						linkTo.push( layer.get('attr').to_frame );
					else
					{
						// links that originate on other frames
						// remove layer model from collection because it shouldn't be rendered
						frame.layers.remove( layer );
						linkFrom.push( layer.get('attr').from_frame );
					}
				});
				frame.set({
					link_to : linkTo,
					link_from : linkFrom
				});

				// listen for layer events and propagate through the frame to the player
				frame.layers.on('all',function(e,obj){
					var emit = _.extend({},obj,{frame:frame.id});
					_this.trigger(e, emit);
				});
				
			});
			
			// another for loop that has to happen after all link layers are populated
			this.each(function(frame){
				// set common layers object
				// {
				//		123 : [a,b,c],
				//		234 : [c,d,e]
				// }
				var commonLayers = {};
				var allConnected = _.uniq( _.compact( _.union( frame.get('prev'), frame.get('next'), frame.get('link_to'), frame.get('link_from') ) ) );
				_.each( allConnected, function(frameID){
					commonLayers[frameID] = _.intersection( frame.layers.pluck('id'), _this.get(frameID).layers.pluck('id') );
				});
				frame.set({ common_layers: commonLayers });
			});

			// figure out the frames that should preload when this frame is rendered
			var preloadAhead = preload_ahead || 0;
			if(preloadAhead)
			{

				this.each(function(frame){

					var framesToPreload = [frame.id];
					var targetArray = [frame.id];

					var loop = function()
					{
						_.each( targetArray, function(frameID){
							targetArray = _.compact([ frame.get('prev'), frame.get('next') ]);
							framesToPreload = _.union( framesToPreload, targetArray, frame.get('link_to'), frame.get('link_from'));
						});
					};

					for( var i = 0 ; i < preloadAhead ; i++) loop();

					frame.set('preload_frames', framesToPreload );
				});

			}
		}

		

	});

	

	return Frame;
});
// parsers.zeega_project

zeega.define('zeega_dir/parsers/zeega-project',["lodash"],

function()
{
	var type = 'zeega-project';
	var Parser = {};
	Parser[type] = { name: type };

	Parser[type].parse = function( res, opts )
	{
		// no op
		return res;
	};

	Parser[type].validate = function( res )
	{
		if( res.sequences && res.frames && res.layers ) return true;
		return false;
	};

	return Parser;
});
// parsers.zeega-collection

zeega.define('zeega_dir/parsers/zeega-collection',["lodash"],

function()
{
	var type = 'zeega-collection';
	var Parser = {};
	Parser[type] = { name: type };

	Parser[type].parse = function( res, opts )
	{
		var project = {};
		if(opts.collection_mode == 'slideshow' && res.items[0].child_items.length > 0 ) project = parseSlideshowCollection( res );
		else project = parseStandardCollection( res );

		return project;
	};

	Parser[type].validate = function( res )
	{
		if( res.items && res.items[0] && res.items[0].child_items ) return true;
		return false;
	};

	var parseStandardCollection = function( res )
	{
		// layers from timebased items
		var layers = generateLayerArrayFromItems( res.items[0].child_items );
		// frames from timebased items
		var frames = generateFrameArrayFromItems( res.items[0].child_items );

		var sequence = {
			id : 0,
			title : "collection",
			persistent_layers : [],
			frames : _.pluck( frames, 'id')
		};

		return _.extend( res.items[0], {
			sequences : [ sequence ],
			frames : frames,
			layers : layers
		});
	};

	var parseSlideshowCollection = function( res )
	{
		var frames,slideshowLayer;
		var imageLayers = [];
		var timebasedLayers = [];
		_.each( res.items[0].child_items, function(item){
			if(item.layer_type == 'Image') imageLayers.push(item);
			else if( item.layer_type == 'Audio' || item.media_type == 'Video' ) timebasedLayers.push(item);
		});

		// slideshow layer from image items
		if(imageLayers.length) slideshowLayer = generateSlideshowLayer( imageLayers );
		// layers from timebased items
		var layers = generateLayerArrayFromItems( timebasedLayers );
		if(slideshowLayer) layers.push(slideshowLayer);

		if( timebasedLayers.length )
		{
			// frames from timebased items
			frames = generateFrameArrayFromItems( timebasedLayers, slideshowLayer ? [ slideshowLayer.id ] : [] );
		}
		else
		{
			// create single frame if no timebased layers exist
			frames = [{
				id : 1,
				layers : [1],
				attr : { advance : 0 }
			}];
		}

		var sequence = {
			id : 0,
			title : "collection",
			persistent_layers : slideshowLayer ? [ slideshowLayer.id ] : [],
			frames : _.pluck( frames, 'id')
		};

		return _.extend( res.items[0], {
			sequences : [ sequence ],
			frames : frames,
			layers : layers
		});
	};

	var generateLayerArrayFromItems = function(itemsArray)
	{
		var layerDefaults = {
			width:100,
			top:0,
			left:0,
			loop:false
		};
		return _.map( itemsArray, function(item){
			return {
				attr: _.defaults(item,layerDefaults),
				type : item.layer_type,
				id : item.id
				//target_div : divID
			};
		});
	};

	var generateFrameArrayFromItems = function(itemsArray, persistentLayers)
	{
		return _.map( itemsArray, function(item){
			return {
				id : item.id,
				layers : _.compact( [item.id].concat(persistentLayers) ),
				attr : { advance : 0 }
			};
		});
	};

	var generateSlideshowLayer = function( imageLayerArray )
	{
		var layerDefaults = {
			keyboard : false,
			width:100,
			top:0,
			left:0
		};
		var slides = _.map( imageLayerArray, function(item){
			return {
				attr: item,
				type : item.layer_type,
				id : item.id
			};
		});

		return {
			attr : _.defaults( {slides:slides}, layerDefaults),
			type : 'SlideShow',
			id : 1
		};
	};

	return Parser;
});
// parsers.zeega-dynamic-collection;
zeega.define("zeega_dir/parsers/zeega-dynamic-collection", function(){});

// parsers.flickr

zeega.define('zeega_dir/parsers/flickr',["lodash"],

function()
{
	var type = 'flickr';
	var Parser = {};
	Parser[type] = { name: type };

	Parser[type].parse = function( res, opts )
	{
		// layers from timebased items
		var layers = generateLayerArrayFromItems( res.items );
		// frames from timebased items
		var frames = generateFrameArrayFromItems( res.items );

		var sequence = {
			id : 0,
			title : "flickr collection",
			persistent_layers : [],
			frames : _.pluck( frames, 'id')
		};

		return _.extend( res, {
			sequences : [ sequence ],
			frames : frames,
			layers : layers
		});
	};

	Parser[type].validate = function( res )
	{
		if( res.generator && res.generator == 'http://www.flickr.com/' ) return true;
		return false;
	};

	var generateLayerArrayFromItems = function(itemsArray)
	{
		var layerDefaults = {
			width:100,
			top:0,
			left:0
		};
		return _.map( itemsArray, function(item){
			item.uri = item.media.m;
			return {
				attr: _.defaults(item,layerDefaults),
				type : "Image",
				id : item.link
				//target_div : divID
			};
		});
	};

	var generateFrameArrayFromItems = function(itemsArray, persistentLayers)
	{
		return _.map( itemsArray, function(item){
			return {
				id : item.link,
				layers : _.compact( [item.link].concat(persistentLayers) ),
				attr : { advance : 0 }
			};
		});
	};

	return Parser;
});
/*

parser manifest file

this should be auto generated probably!!

*/

zeega.define('zeega_dir/parsers/_all',[
	'zeega_dir/parsers/zeega-project',
	'zeega_dir/parsers/zeega-collection',
	'zeega_dir/parsers/zeega-dynamic-collection',
	'zeega_dir/parsers/flickr'
],
	function(
		zProject,
		zCollection,
		zDynamicCollection,
		flickr
	)
	{
		var Parsers = {};
		_.extend( Parsers, zProject, zCollection, zDynamicCollection, flickr ); // extend the plugin object with all the layers
		return Parsers;
	}
);
zeega.define('modules/player/player',[
	"zeega",
	"zeega_dir/player/frame",

	// parsers
	"zeega_dir/parsers/_all"
],

function(Zeega, Frame, Parser)
{
	/**
	Player

	can accept:
	
	- valid ZEEGA data (json)
	
	- valid url returning valid ZEEGA data
	
	exposes the player API (play, pause, stop, destroy, getCitations, etc) // to be documented further
	
	broadcasts events (ready, play, pause, stop, timeupdate, frameadvance, etc) // to be documented further
	
	is the only external contact point

		// initialize player
		var player = new Player.Model({ url: "<valid url>"} });
		// or
		var player = new Player.Model({ data: {<valid data>} });
		// or
		var player  = new Player.Model();
		player.on('all', fxn); // log all events
		player.load({data: {<valid data>}})

	@class Player
	@constructor
	*/

	Player = Zeega.Backbone.Model.extend({

		ready : false,			// the player is parsed and in the dom. can call play play. layers have not been preloaded yet
		complete : false,		// have all layers been preloaded
		initialized : false,	// has the project data been loaded and parsed
		status : 'paused',

		currentFrame : null,

		// default settings -  can be overridden by project data
		defaults : {
			/**
			Sets the player to play when data is successfully parsed and rendered to the dom

			@property autoplay 
			@type Boolean
			@default true
			**/
			autoplay : true,
			/**
			Creates a player with no visual controls. Useful if wrapping the player in custom UI

			@property chromeless 
			@type Boolean
			@default true
			**/
			chromeless : true,

			/**
			Sets the collection project playback

			@property collection_mode 
			@type String
			@default 'standard'
			**/
			collection_mode : 'standard',

			/**
			Time to wait after player is ready before playing project

			overrides any overlay attributes

			@property delay
			@type Integer
			@default 0
			**/
			delay : 0,
			/**
			Sets if the project be escaped through user input (esc or close buttons)

			@property escapable
			@type Boolean
			@default true
			**/
			escapable : true,
			/**
			If there are overlays, do they fade out?

			@property fade_overlays
			@type Boolean
			@default true
			**/
			fade_overlays : true,
			/**
			ms the player takes to fade in

			@property fadeIn
			@type Integer
			@default 500
			**/
			fadeIn : 500,
			/**
			ms the player takes to fade out

			@property fadeOut
			@type Integer
			@default 500
			**/
			fadeOut : 500,
			/**
			Sets if the player be set to fullscreen

			@property fullscreenEnable
			@type Boolean
			@default true
			**/
			fullscreenEnable : true,
			/**
			Turns the keyboard controls on or off

			@property keyboard
			@type Boolean
			@default true
			**/
			keyboard : true,
			/**
			Sets the player mode

			@property mode
			@type String
			@default 'standalone'
			@deprecated
			**/
			mode :'standalone',
			/**
			Sets the individual properties of overlays

			@property overlays
			@type Object
			@default mixed
			**/
			overlays : {
				/**
				Turn on/off arrows

				@property overlays.arrows
				@type Boolean
				@default true
				**/
				arrows : true,
				/**
				Turn on/off Zeega branding

				@property overlays.branding
				@type Boolean
				@default true
				**/
				branding : true,
				/**
				Turn on/off Zeega layer level citations

				@property overlays.citations_layers
				@type Boolean
				@default true
				**/
				citations_layer : true,
				/**
				Turn on/off frame level citations

				@property overlays.citations_frame
				@type Boolean
				@default true
				**/
				citations_frame : true,
				/**
				Turn on/off frame project level citations

				@property overlays.citations_project
				@type Boolean
				@default true
				**/
				citations_project : true,
				/**
				Turn on/off social share icons

				@property overlays.social
				@type Boolean
				@default true
				**/
				social : true
			},

			/**
			The number of frames to attempt preload on
			
			@property preload_ahead
			@type Integer
			@default 2
			**/
			preload_ahead : 2,
			
			/**
			The frame id to start the player
			
			@property start_frame
			@type Integer
			@default null
			**/
			start_frame : null,
			/**
			The id of the target div to draw the player into
			
			@property div
			@type String
			@default null
			**/
			div_id : null,
			/**
			Defines whether or not the player is fullscreen or scales to fit the browser.

			@property window_fit
			@type Boolean
			@default false
			**/
			window_fit : false,
			/**
			Defines aspect ratio of the Zeega project

			@property window_ratio
			@type Float
			@default 4/3
			**/
			window_ratio : 4/3
		},


		/**
		* initialize the zeega player:
		*
		* can be initialized like so:
		*
		* var player = new Player.Model({ url: "<valid url>"} });
		* var player = new Player.Model({ data: {<valid data>} });
		*
		* or
		*
		* var player  = new Player.Model();
		* player.on('all', fxn); // log all events
		* player.load({data: {<valid data>}})
		*/

		initialize : function( obj )
		{
			if( !_.isUndefined(obj) ) this.load(obj); // allow for load later
		},

		/**
		* load 
		* loads the project with data or supplied project_url
		*
		* @method load
		* @param {Object} setup Setup object
		* @param {String} [setup.project_url] A complete project_url pointing to a valid Zeega project data file.
		* @param {Object} [setup.data]A valid Zeega project data object.
		*/

		load : function( obj )
		{
			this.off('data_loaded', this.start); // cancel previous listeners
			this.on('data_loaded', this.start, this); // make a new listener
			// this if may be able to be replaced by a _.once(**)
			if( !this.initialized )
			{
				var _this = this;
				this.set(obj,{silent:true}); // overwrite project settings and add data
				
				if( obj && obj.data && _.isObject( obj.data ) )
				{
					this._dataDetect(obj.data);
				}
				else if( obj && obj.url && _.isString( obj.url ) )
				{
					// try to load project from project_url
					this.url = obj.url;
					this.fetch({silent: true})
						.success(function(res){
							_this._dataDetect(res);
						})
						.error(function(){ _this._onError('3 - fetch error. bad project_url?'); });
				}
				else this._onError('1 - invalid or missing data. could be setting up player. nonfatal.');
			}
			else this._onError('2 - already loaded');
		},

		_dataDetect : function(res)
		{
			var _this = this;
			var parsed;
			//determine which parser to use
			_.each(Parser,function(p){
				if(p.validate(res))
				{
					console.log('parsed using: '+ p.name);
					// parse the response
					parsed = p.parse(res, _this.toJSON() );
					return false;
				}
			});

			if( !_.isUndefined(parsed) )
			{
				// continue loading the player
				_this.set( parsed, {silent:true} );
				parseProject( _this );
				_this._listen();
			}
			else _this._onError('4 - no valid parser found');
		},

		_listen : function()
		{
			var _this = this;
			this.frames.on('all',function(e,obj){
				_this.trigger(e,obj);
			});

			this.on('cue_frame', this.cueFrame, this);
		},

		// renders the player to the dom // this could be a _.once
		render : function()
		{
			var _this = this;
			this.Layout = new PlayerLayout({
				model: this,
				attributes: {
					id : 'ZEEGA-player-'+ this.id,
					'data-projectID' : this.id
				}
			});
			// draw the player in to the target div if defined. or append to the body
			if( this.get('div_id') )
			{
				$('#'+ this.get('div_id')).css('position','relative').html(this.Layout.el);
			}
			else $('body').append(this.Layout.el);
			this.Layout.render();
			this.Layout.$el.fadeIn(this.get('fadeIn'),function(){
				_this.onRendered();
			});
		},

		onRendered : function()
		{
			this.ready = true;
			this._initEvents(); // this should be elsewhere. in an onReady fxn?
			this.trigger('ready');

			this.preloadFramesFrom( this.get('start_frame') );

			if( this.get('autoplay') ) this.play();
		},

		_initEvents : function()
		{
			var _this = this;
			if( this.get('keyboard') )
			{
				$(window).keyup(function(e){
					switch( e.which )
					{
						case 27: // esc
							if(_this.get('escapable')) _this.destroy();
							break;
						case 37: // left arrow
							_this.cuePrev();
							break;
						case 39: // right arrow
							_this.cueNext();
							break;
						case 32: // spacebar
							_this.playPause();
							break;
					}
				});
			}
		},

		start : function()
		{
			this.render();
		},

		// if the player is paused, then play the project
		// if the player is not rendered, then render it first
		/**
		* play 
		* plays the project
		* -if the player is paused, then play the project
		* -if the player is not rendered, then render it first
		*
		* @method play
		*/

		play : function()
		{
			if( !this.ready )
			{
				this.render(); // render the player first!
			}
			else if( this.status == 'paused' )
			{
				if( this.currentFrame )
				{
					this.status ='playing';
					this.currentFrame.play();
				}
				// if there is no info on where the player is or where to start go to first frame in project
				if( _.isNull(this.currentFrame) && _.isNull( this.get('start_frame') ) )
				{
					this.cueFrame( this.get('sequences')[0].frames[0] );
				}
				else if( _.isNull(this.currentFrame) && !_.isNull( this.get('start_frame') ) && this.frames.get( this.get('start_frame') ) )
				{
					this.cueFrame( this.get('start_frame') );
				}
				else if( !_.isNull(this.currentFrame) )
				{
					// unpause the player
				}
				else this._onError('3 - could not play');
			}
		},

		// if the player is playing, pause the project
		pause : function()
		{
			if( this.status == 'playing' )
			{
				this.status ='paused';
				// pause each frame - layer
				this.currentFrame.pause();
				// pause auto advance
				this.trigger('pause');
			}
		},

		playPause : function()
		{
			if( this.status == 'paused' ) this.play();
			else this.pause();
		},

		// goes to the next frame after n ms
		cueNext : function(ms)
		{
			this.cueFrame( this.currentFrame.get('next'), ms );
		},

		// goes to the prev frame after n ms
		cuePrev : function(ms)
		{
			this.cueFrame( this.currentFrame.get('prev'), ms );
		},

		// goes to specified frame after n ms
		cueFrame : function( id, ms)
		{
			if( !_.isUndefined(id) && !_.isUndefined( this.frames.get(id) ) )
			{
				var _this = this;
				var time = ms || 0;
				if( time !== 0 ) _.delay(function(){ _this.goToFrame(id); }, time);
				else this.goToFrame(id);
			}
		},

		// should this live in the cueFrame method so it's not exposed?
		goToFrame :function(id)
		{
			this.preloadFramesFrom( id );
			var oldID;
			if(this.currentFrame)
			{
				this.currentFrame.exit( id );
				oldID = this.currentFrame.id;
			}
			// unrender current frame
			// swap out current frame with new one
			this.currentFrame = this.frames.get( id );
			// render current frame // should trigger a frame rendered event when successful
			this.currentFrame.render( oldID );

			if( this.status != 'playing' )
			{
				this.status = 'playing';
				this.trigger('play');
			}
		},

		preloadFramesFrom : function( id )
		{
			var _this = this;
			var frame = this.frames.get( id );
			_.each( frame.get('preload_frames'), function(frameID){
				_this.frames.get(frameID).preload();
			});
		},

		// returns project metadata
		getProjectData : function()
		{
			var frames = this.frames.map(function(frame){
				return _.extend({},
					frame.toJSON(),
					{ layers: frame.layers.toJSON() }
				);
			});
			return _.extend({},
				this.toJSON(),
				{ frames : frames }
			);
		},

		getFrameData : function()
		{
			var _this = this;
			if( this.currentFrame ) return _.extend({},
				_this.currentFrame.toJSON(),
				{ layers: _this.currentFrame.layers.toJSON() }
			);
			return false;
		},

		// returns the frame structure for the project // not implemented
		getProjectTree : function()
		{
			return false;
		},

		// completely obliterate the player. triggers event
		destroy : function()
		{
			var _this = this;
			this.Layout.$el.fadeOut( this.get('fadeOut'), function(){
				// destroy all layers before calling player_destroyed
				_this.frames.each(function(frame){ frame.destroy(); });
				_this.trigger('player_destroyed');
			});
		},

		/**
		resize the players based on the current browser window dimensions

		@method fitPlayer
		**/
		fitWindow : function()
		{
			this.Layout.resizeWindow();
		},

		/**
		Fired when an error occurs...

		@event onError
		@param {String} str A description of the error
		**/
		_onError : function(str)
		{
			this.trigger('error', str);
			console.log('Error code: ' + str );
		},

		parse : function(res)
		{
			// parses zeega collections pulled from the library api
			if( res.items && res.items[0].child_items)
			{
				res = res.items[0];
				res.items = res.child_items;
			}
			return res;
		}

	});

	/*
		parse the project and trigger data_loaded when finished

		private
	*/
	var parseProject = function( player )
	{
		addTargetDivToLayers(player.get('layers'), player.get('div_id'));
		
		var frames = new Frame.Collection( player.get('frames') );
		frames.load( player.get('sequences'), player.get('layers'), player.get('preload_ahead') );
			
		console.log('parse project', player, frames);
		
		player.frames = frames;

		// set start frame
		if(_.isNull(player.get('start_frame')))
		{
			player.set({'start_frame': player.get('sequences')[0].frames[0]},{silent:true});
		}

		player.initialized = true;
		player.trigger('data_loaded');
	};

	var addTargetDivToLayers = function(layerArray, targetDiv)
	{
		_.each(layerArray, function(layer){
			layer.target_div = targetDiv;
		});
	};


	/*
		the player layout

		# contains resize logic
		# renders the window target for frames/layers

		private
	*/
	var PlayerLayout = Zeega.Backbone.Layout.extend({

		fetch: function(path) {
			// Initialize done for use in async-mode
			var done;

			// Concatenate the file extension.
			path = 'app/templates/layouts/'+ path + ".html";

			// If cached, use the compiled template.
			if (JST[path]) {
				return JST[path];
			} else {
				// Put fetch into `async-mode`.
				done = this.async();

				// Seek out the template asynchronously.
				return $.ajax({ url: Zeega.root + path }).then(function(contents) {
					done(JST[path] = _.template(contents));
				});
			}
		},

		template : 'player-layout',
		className : 'ZEEGA-player',

		initialize : function()
		{
			var _this = this;
			// debounce the resize function so it doesn't bog down the browser
			var lazyResize = _.debounce(function(){ _this.resizeWindow(); }, 300);
			// attempt to detect if the parent container is being resized
			if(this.model.get('div_id')) $('#'+ this.model.get('div_id') ).resize(lazyResize); // < ——— not sure if this works
			else $(window).resize(lazyResize);
		},

		serialize : function(){ return this.model.toJSON(); },

		afterRender : function()
		{
			// correctly size the player window
			this.$('.ZEEGA-player-window').css( this.getWindowSize() );
		},

		resizeWindow : function()
		{
			// animate the window size in place
			var css = this.getWindowSize();
			this.$('.ZEEGA-player-window').animate( css );
			this.model.trigger('window_resized', css );
		},

		// calculate and return the correct window size for the player window
		// uses the player's window_ratio attribute
		getWindowSize : function()
		{
			var css = {};
			var winWidth =  this.model.get('div_id') ? $('#'+ this.model.get('div_id')).width() : window.innerWidth;
			var winHeight = this.model.get('div_id') ? $('#'+ this.model.get('div_id')).height() : window.innerHeight;
			var winRatio = winWidth / winHeight;

			if(this.model.get('window_fit'))
			{
				if( winRatio > this.model.get('window_ratio') )
				{
					css.width = winWidth + 'px';
					css.height = winWidth / this.model.get('window_ratio') +'px';
				}
				else
				{
					css.width = winHeight * this.model.get('window_ratio') +'px';
					css.height = winHeight +'px';
				}
			}
			else
			{
				if( winRatio > this.model.get('window_ratio') )
				{
					css.width = winHeight * this.model.get('window_ratio') +'px';
					css.height = winHeight +'px';
				}
				else
				{
					css.width = winWidth + 'px';
					css.height = winWidth / this.model.get('window_ratio') +'px';
				}
			}
			return css;
		}
	});

	Zeega.player = Player;

	return Zeega;
});
zeega.require([
  // Application.
  "modules/player/player"
],
function(Zeega){
  window.Zeega = Zeega;
  $(window).trigger('zeega_ready');
});

zeega.define("main", function(){});
}());