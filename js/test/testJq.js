

;(function(window,undefind){

    //jquery的类
    var jQuery = (function () {

        var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,     //匹配id混搭的html字段，防止xss
            rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;      //当前的html是否单独标签

        //jquery类
        var jQuery = function (selector, context) {
            //实列化jquery的类
            return new jQuery.fn.init(selector, context);
        },

        // Map over jQuery in case of overwrite
             _jQuery = window.jQuery,

            // Map over the $ in case of overwrite
            _$ = window.$,

            // A central reference to the root jQuery(document)
            rootjQuery,

            // A simple way to check for HTML strings or ID strings
            // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
            quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

            // Check if a string has a non-whitespace character in it
            rnotwhite = /\S/,

            // Used for trimming whitespace
            trimLeft = /^\s+/,
            trimRight = /\s+$/,

            // Match a standalone tag
            rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

            // JSON RegExp
            rvalidchars = /^[\],:{}\s]*$/,
            rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

            // Useragent RegExp
            rwebkit = /(webkit)[ \/]([\w.]+)/,
            ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            rmsie = /(msie) ([\w.]+)/,
            rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

            // Matches dashed string for camelizing
            rdashAlpha = /-([a-z]|[0-9])/ig,
            rmsPrefix = /^-ms-/,

            // Used by jQuery.camelCase as callback to replace()
            fcamelCase = function( all, letter ) {
                return ( letter + "" ).toUpperCase();
            },

            // Keep a UserAgent string for use with jQuery.browser
            userAgent = navigator.userAgent,

            // For matching the engine and version of the browser
            browserMatch,

            // The deferred used on DOM ready
            readyList,

            // The ready event handler
            DOMContentLoaded,

            // Save a reference to some core methods
            toString = Object.prototype.toString,
            hasOwn = Object.prototype.hasOwnProperty,
            push = Array.prototype.push,
            slice = Array.prototype.slice,
            trim = String.prototype.trim,
            indexOf = Array.prototype.indexOf,

            // [[Class]] -> type pairs
            class2type = {};

        jQuery.fn = jQuery.prototype = {
            constructor: jQuery,
            init: function( selector, context, rootjQuery ) {
                var match, elem, ret, doc;

                // Handle $(""), $(null), or $(undefined)
                if ( !selector ) {
                    return this;
                }

                // Handle $(DOMElement)
                if ( selector.nodeType ) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }

                // The body element only exists once, optimize finding it
                if ( selector === "body" && !context && document.body ) {
                    this.context = document;
                    this[0] = document.body;
                    this.selector = selector;
                    this.length = 1;
                    return this;
                }

                // Handle HTML strings
                if ( typeof selector === "string" ) {
                    // Are we dealing with HTML string or an ID?
                    if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                        // Assume that strings that start and end with <> are HTML and skip the regex check
                        match = [ null, selector, null ];

                    } else {
                        match = quickExpr.exec( selector );
                    }

                    // Verify a match, and that no context was specified for #id
                    if ( match && (match[1] || !context) ) {

                        // HANDLE: $(html) -> $(array)
                        if ( match[1] ) {
                            context = context instanceof jQuery ? context[0] : context;
                            doc = ( context ? context.ownerDocument || context : document );

                            // If a single string is passed in and it's a single tag
                            // just do a createElement and skip the rest
                            ret = rsingleTag.exec( selector );

                            if ( ret ) {
                                if ( jQuery.isPlainObject( context ) ) {
                                    selector = [ document.createElement( ret[1] ) ];
                                    jQuery.fn.attr.call( selector, context, true );

                                } else {
                                    selector = [ doc.createElement( ret[1] ) ];
                                }

                            } else {
                                ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
                                selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
                            }

                            return jQuery.merge( this, selector );

                            // HANDLE: $("#id")
                        } else {
                            elem = document.getElementById( match[2] );

                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if ( elem && elem.parentNode ) {
                                // Handle the case where IE and Opera return items
                                // by name instead of ID
                                if ( elem.id !== match[2] ) {
                                    return rootjQuery.find( selector );
                                }

                                // Otherwise, we inject the element directly into the jQuery object
                                this.length = 1;
                                this[0] = elem;
                            }

                            this.context = document;
                            this.selector = selector;
                            return this;
                        }

                        // HANDLE: $(expr, $(...))
                    } else if ( !context || context.jquery ) {
                        return ( context || rootjQuery ).find( selector );

                        // HANDLE: $(expr, context)
                        // (which is just equivalent to: $(context).find(expr)
                    } else {
                        return this.constructor( context ).find( selector );
                    }

                    // HANDLE: $(function)
                    // Shortcut for document ready
                } else if ( jQuery.isFunction( selector ) ) {
                    return rootjQuery.ready( selector );
                }

                if ( selector.selector !== undefined ) {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return jQuery.makeArray( selector, this );
            },

            // Start with an empty selector
            selector: "",

            // The current version of jQuery being used
            jquery: "1.7.1",

            // The default length of a jQuery object is 0
            length: 0,

            // The number of elements contained in the matched element set
            size: function() {
                return this.length;
            },

            toArray: function() {
                return slice.call( this, 0 );
            },

            // Get the Nth element in the matched element set OR
            // Get the whole matched element set as a clean array
            get: function( num ) {
                return num == null ?

                    // Return a 'clean' array
                    this.toArray() :

                    // Return just the object
                    ( num < 0 ? this[ this.length + num ] : this[ num ] );
            },

            // Take an array of elements and push it onto the stack
            // (returning the new matched element set)
            pushStack: function( elems, name, selector ) {
                // Build a new jQuery matched element set
                var ret = this.constructor();

                if ( jQuery.isArray( elems ) ) {
                    push.apply( ret, elems );

                } else {
                    jQuery.merge( ret, elems );
                }

                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;

                ret.context = this.context;

                if ( name === "find" ) {
                    ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
                } else if ( name ) {
                    ret.selector = this.selector + "." + name + "(" + selector + ")";
                }

                // Return the newly-formed element set
                return ret;
            },

            // Execute a callback for every element in the matched set.
            // (You can seed the arguments with an array of args, but this is
            // only used internally.)
            each: function( callback, args ) {
                return jQuery.each( this, callback, args );
            },

            ready: function( fn ) {
                // Attach the listeners
                jQuery.bindReady();

                // Add the callback
                readyList.add( fn );

                return this;
            },

            eq: function( i ) {
                i = +i;
                return i === -1 ?
                    this.slice( i ) :
                    this.slice( i, i + 1 );
            },

            first: function() {
                return this.eq( 0 );
            },

            last: function() {
                return this.eq( -1 );
            },

            slice: function() {
                return this.pushStack( slice.apply( this, arguments ),
                    "slice", slice.call(arguments).join(",") );
            },

            map: function( callback ) {
                return this.pushStack( jQuery.map(this, function( elem, i ) {
                    return callback.call( elem, i, elem );
                }));
            },

            end: function() {
                return this.prevObject || this.constructor(null);
            },

            // For internal use only.
            // Behaves like an Array's method, not like a jQuery method.
            push: push,
            sort: [].sort,
            splice: [].splice
        };

        //讲jquery.fn.init的实例化对象覆盖到jqury.fn上，以便能调用里面的方法
        jQuery.fn.init.prototype = jQuery.fn;

        //todo 还有jQuery.isPlainObject需要研究
        jQuery.extend = jQuery.fn.extend = function() {
            var options,    //表示某个源对象
                name,       //表示某个源对象的某个属性名
                src,        //表示某个源对象的某个属性的原始值
                copy,       //表示某个源对象的某个属性的值
                copyIsArray,//指示遍历copy是否是数组
                clone,      //表示深度复制时原始值得修正值
                target = arguments[0] || {},    //指向目标对象
                i = 1,  //表示源对象的起始下标
                length = arguments.length,  //
                deep = false;   //是否执行深度复制

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if ( length === i ) {
                target = this;
                --i;
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                            if ( copyIsArray ) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : [];

                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[ name ] = jQuery.extend( deep, clone, copy );

                            // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        jQuery.extend({
            noConflict: function( deep ) {
                if ( window.$ === jQuery ) {
                    window.$ = _$;
                }

                if ( deep && window.jQuery === jQuery ) {
                    window.jQuery = _jQuery;
                }

                return jQuery;
            },

            // Is the DOM ready to be used? Set to true once it occurs.
            isReady: false,

            // A counter to track how many items to wait for before
            // the ready event fires. See #6781
            readyWait: 1,

            // Hold (or release) the ready event
            holdReady: function( hold ) {
                if ( hold ) {
                    jQuery.readyWait++;
                } else {
                    jQuery.ready( true );
                }
            },

            // Handle when the DOM is ready
            ready: function( wait ) {
                // Either a released hold or an DOMready/load event and not yet ready
                if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
                    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                    if ( !document.body ) {
                        return setTimeout( jQuery.ready, 1 );
                    }

                    // Remember that the DOM is ready
                    jQuery.isReady = true;

                    // If a normal DOM Ready event fired, decrement, and wait if need be
                    if ( wait !== true && --jQuery.readyWait > 0 ) {
                        return;
                    }

                    // If there are functions bound, to execute
                    readyList.fireWith( document, [ jQuery ] );

                    // Trigger any bound ready events
                    if ( jQuery.fn.trigger ) {
                        jQuery( document ).trigger( "ready" ).off( "ready" );
                    }
                }
            },

            bindReady: function() {
                if ( readyList ) {
                    return;
                }

                readyList = jQuery.Callbacks( "once memory" );

                // Catch cases where $(document).ready() is called after the
                // browser event has already occurred.
                if ( document.readyState === "complete" ) {
                    // Handle it asynchronously to allow scripts the opportunity to delay ready
                    return setTimeout( jQuery.ready, 1 );
                }

                // Mozilla, Opera and webkit nightlies currently support this event
                if ( document.addEventListener ) {
                    // Use the handy event callback
                    document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

                    // A fallback to window.onload, that will always work
                    window.addEventListener( "load", jQuery.ready, false );

                    // If IE event model is used
                } else if ( document.attachEvent ) {
                    // ensure firing before onload,
                    // maybe late but safe also for iframes
                    document.attachEvent( "onreadystatechange", DOMContentLoaded );

                    // A fallback to window.onload, that will always work
                    window.attachEvent( "onload", jQuery.ready );

                    // If IE and not a frame
                    // continually check to see if the document is ready
                    var toplevel = false;

                    try {
                        toplevel = window.frameElement == null;
                    } catch(e) {}

                    if ( document.documentElement.doScroll && toplevel ) {
                        doScrollCheck();
                    }
                }
            },

            // See test/unit/core.js for details concerning isFunction.
            // Since version 1.3, DOM methods and functions like alert
            // aren't supported. They return false on IE (#2968).
            isFunction: function( obj ) {
                return jQuery.type(obj) === "function";
            },

            isArray: Array.isArray || function( obj ) {
                return jQuery.type(obj) === "array";
            },

            // A crude way of determining if an object is a window
            isWindow: function( obj ) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            },

            isNumeric: function( obj ) {
                return !isNaN( parseFloat(obj) ) && isFinite( obj );
            },

            type: function( obj ) {
                return obj == null ?
                    String( obj ) :
                class2type[ toString.call(obj) ] || "object";
            },

            isPlainObject: function( obj ) {
                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
                    return false;
                }

                try {
                    // Not own constructor property must be Object
                    //todo 有构造函数创建的会有constructor属性，而直接对象量没有constructor属性
                    if ( obj.constructor &&
                        !hasOwn.call(obj, "constructor") &&
                        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                        return false;
                    }
                } catch ( e ) {
                    // IE8,9 Will throw exceptions on certain host objects #9897
                    return false;
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.

                var key;
                for ( key in obj ) {}

                return key === undefined || hasOwn.call( obj, key );
            },

            isEmptyObject: function( obj ) {
                for ( var name in obj ) {
                    return false;
                }
                return true;
            },

            error: function( msg ) {
                throw new Error( msg );
            },

            parseJSON: function( data ) {
                if ( typeof data !== "string" || !data ) {
                    return null;
                }

                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = jQuery.trim( data );

                // Attempt to parse using the native JSON parser first
                if ( window.JSON && window.JSON.parse ) {
                    return window.JSON.parse( data );
                }

                // Make sure the incoming data is actual JSON
                // Logic borrowed from http://json.org/json2.js
                if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                        .replace( rvalidtokens, "]" )
                        .replace( rvalidbraces, "")) ) {

                    return ( new Function( "return " + data ) )();

                }
                jQuery.error( "Invalid JSON: " + data );
            },

            // Cross-browser xml parsing
            parseXML: function( data ) {
                var xml, tmp;
                try {
                    if ( window.DOMParser ) { // Standard
                        tmp = new DOMParser();
                        xml = tmp.parseFromString( data , "text/xml" );
                    } else { // IE
                        xml = new ActiveXObject( "Microsoft.XMLDOM" );
                        xml.async = "false";
                        xml.loadXML( data );
                    }
                } catch( e ) {
                    xml = undefined;
                }
                if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
                    jQuery.error( "Invalid XML: " + data );
                }
                return xml;
            },

            noop: function() {},

            // Evaluates a script in a global context
            // Workarounds based on findings by Jim Driscoll
            // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
            globalEval: function( data ) {
                if ( data && rnotwhite.test( data ) ) {
                    // We use execScript on Internet Explorer
                    // We use an anonymous function so that context is window
                    // rather than jQuery in Firefox
                    ( window.execScript || function( data ) {
                        window[ "eval" ].call( window, data );
                    } )( data );
                }
            },

            // Convert dashed to camelCase; used by the css and data modules
            // Microsoft forgot to hump their vendor prefix (#9572)
            camelCase: function( string ) {
                return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
            },

            nodeName: function( elem, name ) {
                return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
            },

            // args is for internal usage only
            each: function( object, callback, args ) {
                var name, i = 0,
                    length = object.length,
                    isObj = length === undefined || jQuery.isFunction( object );

                if ( args ) {
                    if ( isObj ) {
                        for ( name in object ) {
                            if ( callback.apply( object[ name ], args ) === false ) {
                                break;
                            }
                        }
                    } else {
                        for ( ; i < length; ) {
                            if ( callback.apply( object[ i++ ], args ) === false ) {
                                break;
                            }
                        }
                    }

                    // A special, fast, case for the most common use of each
                } else {
                    if ( isObj ) {
                        for ( name in object ) {
                            if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                                break;
                            }
                        }
                    } else {
                        for ( ; i < length; ) {
                            if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
                                break;
                            }
                        }
                    }
                }

                return object;
            },

            // Use native String.trim function wherever possible
            trim: trim ?
                function( text ) {
                    return text == null ?
                        "" :
                        trim.call( text );
                } :

                // Otherwise use our own trimming functionality
                function( text ) {
                    return text == null ?
                        "" :
                        text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
                },

            // results is for internal usage only
            makeArray: function( array, results ) {
                var ret = results || [];

                if ( array != null ) {
                    // The window, strings (and functions) also have 'length'
                    // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                    var type = jQuery.type( array );

                    if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
                        push.call( ret, array );
                    } else {
                        jQuery.merge( ret, array );
                    }
                }

                return ret;
            },

            inArray: function( elem, array, i ) {
                var len;

                if ( array ) {
                    if ( indexOf ) {
                        return indexOf.call( array, elem, i );
                    }

                    len = array.length;
                    i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

                    for ( ; i < len; i++ ) {
                        // Skip accessing in sparse arrays
                        if ( i in array && array[ i ] === elem ) {
                            return i;
                        }
                    }
                }

                return -1;
            },

            merge: function( first, second ) {
                var i = first.length,
                    j = 0;

                if ( typeof second.length === "number" ) {
                    for ( var l = second.length; j < l; j++ ) {
                        first[ i++ ] = second[ j ];
                    }

                } else {
                    while ( second[j] !== undefined ) {
                        first[ i++ ] = second[ j++ ];
                    }
                }

                first.length = i;

                return first;
            },

            grep: function( elems, callback, inv ) {
                var ret = [], retVal;
                inv = !!inv;

                // Go through the array, only saving the items
                // that pass the validator function
                for ( var i = 0, length = elems.length; i < length; i++ ) {
                    retVal = !!callback( elems[ i ], i );
                    if ( inv !== retVal ) {
                        ret.push( elems[ i ] );
                    }
                }

                return ret;
            },

            // arg is for internal usage only
            map: function( elems, callback, arg ) {
                var value, key, ret = [],
                    i = 0,
                    length = elems.length,
                // jquery objects are treated as arrays
                    isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

                // Go through the array, translating each of the items to their
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        value = callback( elems[ i ], i, arg );

                        if ( value != null ) {
                            ret[ ret.length ] = value;
                        }
                    }

                    // Go through every key on the object,
                } else {
                    for ( key in elems ) {
                        value = callback( elems[ key ], key, arg );

                        if ( value != null ) {
                            ret[ ret.length ] = value;
                        }
                    }
                }

                // Flatten any nested arrays
                return ret.concat.apply( [], ret );
            },

            // A global GUID counter for objects
            guid: 1,

            // Bind a function to a context, optionally partially applying any
            // arguments.
            proxy: function( fn, context ) {
                if ( typeof context === "string" ) {
                    var tmp = fn[ context ];
                    context = fn;
                    fn = tmp;
                }

                // Quick check to determine if target is callable, in the spec
                // this throws a TypeError, but we will just return undefined.
                if ( !jQuery.isFunction( fn ) ) {
                    return undefined;
                }

                // Simulated bind
                var args = slice.call( arguments, 2 ),
                    proxy = function() {
                        return fn.apply( context, args.concat( slice.call( arguments ) ) );
                    };

                // Set the guid of unique handler to the same of original handler, so it can be removed
                proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

                return proxy;
            },

            // Mutifunctional method to get and set values to a collection
            // The value/s can optionally be executed if it's a function
            access: function( elems, key, value, exec, fn, pass ) {
                var length = elems.length;

                // Setting many attributes
                if ( typeof key === "object" ) {
                    for ( var k in key ) {
                        jQuery.access( elems, k, key[k], exec, fn, value );
                    }
                    return elems;
                }

                // Setting one attribute
                if ( value !== undefined ) {
                    // Optionally, function values get executed if exec is true
                    exec = !pass && exec && jQuery.isFunction(value);

                    for ( var i = 0; i < length; i++ ) {
                        fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
                    }

                    return elems;
                }

                // Getting an attribute
                return length ? fn( elems[0], key ) : undefined;
            },

            now: function() {
                return ( new Date() ).getTime();
            },

            // Use of jQuery.browser is frowned upon.
            // More details: http://docs.jquery.com/Utilities/jQuery.browser
            uaMatch: function( ua ) {
                ua = ua.toLowerCase();

                var match = rwebkit.exec( ua ) ||
                    ropera.exec( ua ) ||
                    rmsie.exec( ua ) ||
                    ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
                    [];

                return { browser: match[1] || "", version: match[2] || "0" };
            },

            sub: function() {
                function jQuerySub( selector, context ) {
                    return new jQuerySub.fn.init( selector, context );
                }
                jQuery.extend( true, jQuerySub, this );
                jQuerySub.superclass = this;
                jQuerySub.fn = jQuerySub.prototype = this();
                jQuerySub.fn.constructor = jQuerySub;
                jQuerySub.sub = this.sub;
                jQuerySub.fn.init = function init( selector, context ) {
                    if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                        context = jQuerySub( context );
                    }

                    return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
                };
                jQuerySub.fn.init.prototype = jQuerySub.fn;
                var rootjQuerySub = jQuerySub(document);
                return jQuerySub;
            },

            browser: {}
        });

        jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
            class2type[ "[object " + name + "]" ] = name.toLowerCase();
        });

        browserMatch = jQuery.uaMatch( userAgent );
        if ( browserMatch.browser ) {
            jQuery.browser[ browserMatch.browser ] = true;
            jQuery.browser.version = browserMatch.version;
        }

// Deprecated, use jQuery.browser.webkit instead
        if ( jQuery.browser.webkit ) {
            jQuery.browser.safari = true;
        }

// IE doesn't match non-breaking spaces with \s
        if ( rnotwhite.test( "\xA0" ) ) {
            trimLeft = /^[\s\xA0]+/;
            trimRight = /[\s\xA0]+$/;
        }

// All jQuery objects should point back to these
        rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
        if ( document.addEventListener ) {
            DOMContentLoaded = function() {
                document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                jQuery.ready();
            };

        } else if ( document.attachEvent ) {
            DOMContentLoaded = function() {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if ( document.readyState === "complete" ) {
                    document.detachEvent( "onreadystatechange", DOMContentLoaded );
                    jQuery.ready();
                }
            };
        }

// The DOM ready check for Internet Explorer
        function doScrollCheck() {
            if ( jQuery.isReady ) {
                return;
            }

            try {
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");
            } catch(e) {
                setTimeout( doScrollCheck, 1 );
                return;
            }

            // and execute any waiting functions
            jQuery.ready();
        }


        //外部返回接口
        return jQuery;
    })();

    //当前的html5标签字符串
    var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video";

    var rnocache = /<(?:script|object|embed|option|style)/i,
        rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i");

    /**
     * 将复杂的html字段转化为dom结构
     * @param args  传入的html字段
     * @param nodes 上下文对象
     * @param scripts
     * @returns {{fragment: *, cacheable: *}}
     */
    jQuery.buildFragment = function( args, nodes, scripts ) {
        var fragment,   //指定文档碎片对象
            cacheable,  //是否符合缓存条件
            cacheresults,   //从缓存中取到的dom元素
            doc,        //文档碎片对象
            first = args[ 0 ];  //当前的html片段

        //如果dom节点不存在，则
        if ( nodes && nodes[0] ) {
            doc = nodes[0].ownerDocument || nodes[0];
        }

        //如果node不是dom对象 将Node变为document
        if ( !doc.createDocumentFragment ) {
            doc = document;
        }

        if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
            first.charAt(0) === "<" && !rnocache.test( first ) &&
            (jQuery.support.checkClone || !rchecked.test( first )) &&
            (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

            cacheable = true;

            //读取缓存值
            cacheresults = jQuery.fragments[ first ];
            if ( cacheresults && cacheresults !== 1 ) { //如果缓存值命中，且缓存值不是1，则读文档碎片
                fragment = cacheresults;                //如果缓存命中，则将值赋值给fragment
            }
        }

        if ( !fragment ) {
            fragment = doc.createDocumentFragment();
            jQuery.clean( args, doc, fragment, scripts );
        }

        if ( cacheable ) {
            jQuery.fragments[ first ] = cacheresults ? fragment : 1;
        }

        return { fragment: fragment, cacheable: cacheable };
    };

    //存储html的缓存对象
    jQuery.fragments = {};


    (function(){

        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            expando = "sizcache" + (Math.random() + '').replace('.', ''),
            done = 0,
            toString = Object.prototype.toString,
            hasDuplicate = false,
            baseHasDuplicate = true,
            rBackslash = /\\/g,
            rReturn = /\r\n/g,
            rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
        [0, 0].sort(function() {
            baseHasDuplicate = false;
            return 0;
        });

        var Sizzle = function( selector, context, results, seed ) {
            results = results || [];
            context = context || document;

            var origContext = context;

            if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
                return [];
            }

            if ( !selector || typeof selector !== "string" ) {
                return results;
            }

            var m, set, checkSet, extra, ret, cur, pop, i,
                prune = true,
                contextXML = Sizzle.isXML( context ),
                parts = [],
                soFar = selector;

            // Reset the position of the chunker regexp (start from head)
            do {
                chunker.exec( "" );
                m = chunker.exec( soFar );

                if ( m ) {
                    soFar = m[3];

                    parts.push( m[1] );

                    if ( m[2] ) {
                        extra = m[3];
                        break;
                    }
                }
            } while ( m );

            console.log(parts);
            if ( parts.length > 1 && origPOS.exec( selector ) ) {

                if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
                    set = posProcess( parts[0] + parts[1], context, seed );

                } else {
                    set = Expr.relative[ parts[0] ] ?
                        [ context ] :
                        Sizzle( parts.shift(), context );
                    while ( parts.length ) {
                        selector = parts.shift();

                        if ( Expr.relative[ selector ] ) {
                            selector += parts.shift();
                        }

                        set = posProcess( selector, set, seed );
                    }
                }

            } else {
                // Take a shortcut and set the context if the root selector is an ID
                // (but not if it'll be faster if the inner selector is an ID)
                if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                    Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

                    ret = Sizzle.find( parts.shift(), context, contextXML );
                    context = ret.expr ?
                        Sizzle.filter( ret.expr, ret.set )[0] :
                        ret.set[0];
                }

                if ( context ) {
                    ret = seed ?
                    { expr: parts.pop(), set: makeArray(seed) } :
                        Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

                    set = ret.expr ?
                        Sizzle.filter( ret.expr, ret.set ) :
                        ret.set;

                    if ( parts.length > 0 ) {
                        checkSet = makeArray( set );

                    } else {
                        prune = false;
                    }

                    while ( parts.length ) {
                        cur = parts.pop();
                        pop = cur;

                        if ( !Expr.relative[ cur ] ) {
                            cur = "";
                        } else {
                            pop = parts.pop();
                        }

                        if ( pop == null ) {
                            pop = context;
                        }

                        Expr.relative[ cur ]( checkSet, pop, contextXML );
                    }

                } else {
                    checkSet = parts = [];
                }
            }

            if ( !checkSet ) {
                checkSet = set;
            }

            if ( !checkSet ) {
                Sizzle.error( cur || selector );
            }

            if ( toString.call(checkSet) === "[object Array]" ) {
                if ( !prune ) {
                    results.push.apply( results, checkSet );

                } else if ( context && context.nodeType === 1 ) {
                    for ( i = 0; checkSet[i] != null; i++ ) {
                        if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
                            results.push( set[i] );
                        }
                    }

                } else {
                    for ( i = 0; checkSet[i] != null; i++ ) {
                        if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                            results.push( set[i] );
                        }
                    }
                }

            } else {
                makeArray( checkSet, results );
            }

            if ( extra ) {
                Sizzle( extra, origContext, results, seed );
                Sizzle.uniqueSort( results );
            }

            return results;
        };

        Sizzle.uniqueSort = function( results ) {
            if ( sortOrder ) {
                hasDuplicate = baseHasDuplicate;
                results.sort( sortOrder );

                if ( hasDuplicate ) {
                    for ( var i = 1; i < results.length; i++ ) {
                        if ( results[i] === results[ i - 1 ] ) {
                            results.splice( i--, 1 );
                        }
                    }
                }
            }

            return results;
        };

        Sizzle.matches = function( expr, set ) {
            return Sizzle( expr, null, null, set );
        };

        Sizzle.matchesSelector = function( node, expr ) {
            return Sizzle( expr, null, null, [node] ).length > 0;
        };

        Sizzle.find = function( expr, context, isXML ) {
            var set, i, len, match, type, left;

            if ( !expr ) {
                return [];
            }

            for ( i = 0, len = Expr.order.length; i < len; i++ ) {
                type = Expr.order[i];

                if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
                    left = match[1];
                    match.splice( 1, 1 );

                    if ( left.substr( left.length - 1 ) !== "\\" ) {
                        match[1] = (match[1] || "").replace( rBackslash, "" );
                        set = Expr.find[ type ]( match, context, isXML );

                        if ( set != null ) {
                            expr = expr.replace( Expr.match[ type ], "" );
                            break;
                        }
                    }
                }
            }

            if ( !set ) {
                set = typeof context.getElementsByTagName !== "undefined" ?
                    context.getElementsByTagName( "*" ) :
                    [];
            }

            return { set: set, expr: expr };
        };

        Sizzle.filter = function( expr, set, inplace, not ) {
            var match, anyFound,
                type, found, item, filter, left,
                i, pass,
                old = expr,
                result = [],
                curLoop = set,
                isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

            while ( expr && set.length ) {
                for ( type in Expr.filter ) {
                    if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
                        filter = Expr.filter[ type ];
                        left = match[1];

                        anyFound = false;

                        match.splice(1,1);

                        if ( left.substr( left.length - 1 ) === "\\" ) {
                            continue;
                        }

                        if ( curLoop === result ) {
                            result = [];
                        }

                        if ( Expr.preFilter[ type ] ) {
                            match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

                            if ( !match ) {
                                anyFound = found = true;

                            } else if ( match === true ) {
                                continue;
                            }
                        }

                        if ( match ) {
                            for ( i = 0; (item = curLoop[i]) != null; i++ ) {
                                if ( item ) {
                                    found = filter( item, match, i, curLoop );
                                    pass = not ^ found;

                                    if ( inplace && found != null ) {
                                        if ( pass ) {
                                            anyFound = true;

                                        } else {
                                            curLoop[i] = false;
                                        }

                                    } else if ( pass ) {
                                        result.push( item );
                                        anyFound = true;
                                    }
                                }
                            }
                        }

                        if ( found !== undefined ) {
                            if ( !inplace ) {
                                curLoop = result;
                            }

                            expr = expr.replace( Expr.match[ type ], "" );

                            if ( !anyFound ) {
                                return [];
                            }

                            break;
                        }
                    }
                }

                // Improper expression
                if ( expr === old ) {
                    if ( anyFound == null ) {
                        Sizzle.error( expr );

                    } else {
                        break;
                    }
                }

                old = expr;
            }

            return curLoop;
        };

        Sizzle.error = function( msg ) {
            throw new Error( "Syntax error, unrecognized expression: " + msg );
        };

        /**
         * Utility function for retreiving the text value of an array of DOM nodes
         * @param {Array|Element} elem
         */
        var getText = Sizzle.getText = function( elem ) {
            var i, node,
                nodeType = elem.nodeType,
                ret = "";

            if ( nodeType ) {
                if ( nodeType === 1 || nodeType === 9 ) {
                    // Use textContent || innerText for elements
                    if ( typeof elem.textContent === 'string' ) {
                        return elem.textContent;
                    } else if ( typeof elem.innerText === 'string' ) {
                        // Replace IE's carriage returns
                        return elem.innerText.replace( rReturn, '' );
                    } else {
                        // Traverse it's children
                        for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
                            ret += getText( elem );
                        }
                    }
                } else if ( nodeType === 3 || nodeType === 4 ) {
                    return elem.nodeValue;
                }
            } else {

                // If no nodeType, this is expected to be an array
                for ( i = 0; (node = elem[i]); i++ ) {
                    // Do not traverse comment nodes
                    if ( node.nodeType !== 8 ) {
                        ret += getText( node );
                    }
                }
            }
            return ret;
        };

        var Expr = Sizzle.selectors = {
            order: [ "ID", "NAME", "TAG" ],

            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },

            leftMatch: {},

            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },

            attrHandle: {
                href: function( elem ) {
                    return elem.getAttribute( "href" );
                },
                type: function( elem ) {
                    return elem.getAttribute( "type" );
                }
            },

            relative: {
                "+": function(checkSet, part){
                    var isPartStr = typeof part === "string",
                        isTag = isPartStr && !rNonWord.test( part ),
                        isPartStrNotTag = isPartStr && !isTag;

                    if ( isTag ) {
                        part = part.toLowerCase();
                    }

                    for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                        if ( (elem = checkSet[i]) ) {
                            while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                            elem || false :
                            elem === part;
                        }
                    }

                    if ( isPartStrNotTag ) {
                        Sizzle.filter( part, checkSet, true );
                    }
                },

                ">": function( checkSet, part ) {
                    var elem,
                        isPartStr = typeof part === "string",
                        i = 0,
                        l = checkSet.length;

                    if ( isPartStr && !rNonWord.test( part ) ) {
                        part = part.toLowerCase();

                        for ( ; i < l; i++ ) {
                            elem = checkSet[i];

                            if ( elem ) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }

                    } else {
                        for ( ; i < l; i++ ) {
                            elem = checkSet[i];

                            if ( elem ) {
                                checkSet[i] = isPartStr ?
                                    elem.parentNode :
                                elem.parentNode === part;
                            }
                        }

                        if ( isPartStr ) {
                            Sizzle.filter( part, checkSet, true );
                        }
                    }
                },

                "": function(checkSet, part, isXML){
                    var nodeCheck,
                        doneName = done++,
                        checkFn = dirCheck;

                    if ( typeof part === "string" && !rNonWord.test( part ) ) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
                },

                "~": function( checkSet, part, isXML ) {
                    var nodeCheck,
                        doneName = done++,
                        checkFn = dirCheck;

                    if ( typeof part === "string" && !rNonWord.test( part ) ) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
                }
            },

            find: {
                ID: function( match, context, isXML ) {
                    if ( typeof context.getElementById !== "undefined" && !isXML ) {
                        var m = context.getElementById(match[1]);
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                },

                NAME: function( match, context ) {
                    if ( typeof context.getElementsByName !== "undefined" ) {
                        var ret = [],
                            results = context.getElementsByName( match[1] );

                        for ( var i = 0, l = results.length; i < l; i++ ) {
                            if ( results[i].getAttribute("name") === match[1] ) {
                                ret.push( results[i] );
                            }
                        }

                        return ret.length === 0 ? null : ret;
                    }
                },

                TAG: function( match, context ) {
                    if ( typeof context.getElementsByTagName !== "undefined" ) {
                        return context.getElementsByTagName( match[1] );
                    }
                }
            },
            preFilter: {
                CLASS: function( match, curLoop, inplace, result, not, isXML ) {
                    match = " " + match[1].replace( rBackslash, "" ) + " ";

                    if ( isXML ) {
                        return match;
                    }

                    for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                        if ( elem ) {
                            if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
                                if ( !inplace ) {
                                    result.push( elem );
                                }

                            } else if ( inplace ) {
                                curLoop[i] = false;
                            }
                        }
                    }

                    return false;
                },

                ID: function( match ) {
                    return match[1].replace( rBackslash, "" );
                },

                TAG: function( match, curLoop ) {
                    return match[1].replace( rBackslash, "" ).toLowerCase();
                },

                CHILD: function( match ) {
                    if ( match[1] === "nth" ) {
                        if ( !match[2] ) {
                            Sizzle.error( match[0] );
                        }

                        match[2] = match[2].replace(/^\+|\s*/g, '');

                        // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                            match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                            !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

                        // calculate the numbers (first)n+(last) including if they are negative
                        match[2] = (test[1] + (test[2] || 1)) - 0;
                        match[3] = test[3] - 0;
                    }
                    else if ( match[2] ) {
                        Sizzle.error( match[0] );
                    }

                    // TODO: Move to normal caching system
                    match[0] = done++;

                    return match;
                },

                ATTR: function( match, curLoop, inplace, result, not, isXML ) {
                    var name = match[1] = match[1].replace( rBackslash, "" );

                    if ( !isXML && Expr.attrMap[name] ) {
                        match[1] = Expr.attrMap[name];
                    }

                    // Handle if an un-quoted value was used
                    match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

                    if ( match[2] === "~=" ) {
                        match[4] = " " + match[4] + " ";
                    }

                    return match;
                },

                PSEUDO: function( match, curLoop, inplace, result, not ) {
                    if ( match[1] === "not" ) {
                        // If we're dealing with a complex expression, or a simple one
                        if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
                            match[3] = Sizzle(match[3], null, null, curLoop);

                        } else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                            if ( !inplace ) {
                                result.push.apply( result, ret );
                            }

                            return false;
                        }

                    } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
                        return true;
                    }

                    return match;
                },

                POS: function( match ) {
                    match.unshift( true );

                    return match;
                }
            },

            filters: {
                enabled: function( elem ) {
                    return elem.disabled === false && elem.type !== "hidden";
                },

                disabled: function( elem ) {
                    return elem.disabled === true;
                },

                checked: function( elem ) {
                    return elem.checked === true;
                },

                selected: function( elem ) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if ( elem.parentNode ) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                parent: function( elem ) {
                    return !!elem.firstChild;
                },

                empty: function( elem ) {
                    return !elem.firstChild;
                },

                has: function( elem, i, match ) {
                    return !!Sizzle( match[3], elem ).length;
                },

                header: function( elem ) {
                    return (/h\d/i).test( elem.nodeName );
                },

                text: function( elem ) {
                    var attr = elem.getAttribute( "type" ), type = elem.type;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                    // use getAttribute instead to test this case
                    return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
                },

                radio: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
                },

                checkbox: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
                },

                file: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
                },

                password: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
                },

                submit: function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && "submit" === elem.type;
                },

                image: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
                },

                reset: function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && "reset" === elem.type;
                },

                button: function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && "button" === elem.type || name === "button";
                },

                input: function( elem ) {
                    return (/input|select|textarea|button/i).test( elem.nodeName );
                },

                focus: function( elem ) {
                    return elem === elem.ownerDocument.activeElement;
                }
            },
            setFilters: {
                first: function( elem, i ) {
                    return i === 0;
                },

                last: function( elem, i, match, array ) {
                    return i === array.length - 1;
                },

                even: function( elem, i ) {
                    return i % 2 === 0;
                },

                odd: function( elem, i ) {
                    return i % 2 === 1;
                },

                lt: function( elem, i, match ) {
                    return i < match[3] - 0;
                },

                gt: function( elem, i, match ) {
                    return i > match[3] - 0;
                },

                nth: function( elem, i, match ) {
                    return match[3] - 0 === i;
                },

                eq: function( elem, i, match ) {
                    return match[3] - 0 === i;
                }
            },
            filter: {
                PSEUDO: function( elem, match, i, array ) {
                    var name = match[1],
                        filter = Expr.filters[ name ];

                    if ( filter ) {
                        return filter( elem, i, match, array );

                    } else if ( name === "contains" ) {
                        return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

                    } else if ( name === "not" ) {
                        var not = match[3];

                        for ( var j = 0, l = not.length; j < l; j++ ) {
                            if ( not[j] === elem ) {
                                return false;
                            }
                        }

                        return true;

                    } else {
                        Sizzle.error( name );
                    }
                },

                CHILD: function( elem, match ) {
                    var first, last,
                        doneName, parent, cache,
                        count, diff,
                        type = match[1],
                        node = elem;

                    switch ( type ) {
                        case "only":
                        case "first":
                            while ( (node = node.previousSibling) )	 {
                                if ( node.nodeType === 1 ) {
                                    return false;
                                }
                            }

                            if ( type === "first" ) {
                                return true;
                            }

                            node = elem;

                        case "last":
                            while ( (node = node.nextSibling) )	 {
                                if ( node.nodeType === 1 ) {
                                    return false;
                                }
                            }

                            return true;

                        case "nth":
                            first = match[2];
                            last = match[3];

                            if ( first === 1 && last === 0 ) {
                                return true;
                            }

                            doneName = match[0];
                            parent = elem.parentNode;

                            if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
                                count = 0;

                                for ( node = parent.firstChild; node; node = node.nextSibling ) {
                                    if ( node.nodeType === 1 ) {
                                        node.nodeIndex = ++count;
                                    }
                                }

                                parent[ expando ] = doneName;
                            }

                            diff = elem.nodeIndex - last;

                            if ( first === 0 ) {
                                return diff === 0;

                            } else {
                                return ( diff % first === 0 && diff / first >= 0 );
                            }
                    }
                },

                ID: function( elem, match ) {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                },

                TAG: function( elem, match ) {
                    return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
                },

                CLASS: function( elem, match ) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ")
                            .indexOf( match ) > -1;
                },

                ATTR: function( elem, match ) {
                    var name = match[1],
                        result = Sizzle.attr ?
                            Sizzle.attr( elem, name ) :
                            Expr.attrHandle[ name ] ?
                                Expr.attrHandle[ name ]( elem ) :
                                elem[ name ] != null ?
                                    elem[ name ] :
                                    elem.getAttribute( name ),
                        value = result + "",
                        type = match[2],
                        check = match[4];

                    return result == null ?
                    type === "!=" :
                        !type && Sizzle.attr ?
                        result != null :
                            type === "=" ?
                            value === check :
                                type === "*=" ?
                                value.indexOf(check) >= 0 :
                                    type === "~=" ?
                                    (" " + value + " ").indexOf(check) >= 0 :
                                        !check ?
                                        value && result !== false :
                                            type === "!=" ?
                                            value !== check :
                                                type === "^=" ?
                                                value.indexOf(check) === 0 :
                                                    type === "$=" ?
                                                    value.substr(value.length - check.length) === check :
                                                        type === "|=" ?
                                                        value === check || value.substr(0, check.length + 1) === check + "-" :
                                                            false;
                },

                POS: function( elem, match, i, array ) {
                    var name = match[2],
                        filter = Expr.setFilters[ name ];

                    if ( filter ) {
                        return filter( elem, i, match, array );
                    }
                }
            }
        };

        var origPOS = Expr.match.POS,
            fescape = function(all, num){
                return "\\" + (num - 0 + 1);
            };

        for ( var type in Expr.match ) {
            Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
            Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
        }

        var makeArray = function( array, results ) {
            array = Array.prototype.slice.call( array, 0 );

            if ( results ) {
                results.push.apply( results, array );
                return results;
            }

            return array;
        };

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
        try {
            Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
        } catch( e ) {
            makeArray = function( array, results ) {
                var i = 0,
                    ret = results || [];

                if ( toString.call(array) === "[object Array]" ) {
                    Array.prototype.push.apply( ret, array );

                } else {
                    if ( typeof array.length === "number" ) {
                        for ( var l = array.length; i < l; i++ ) {
                            ret.push( array[i] );
                        }

                    } else {
                        for ( ; array[i]; i++ ) {
                            ret.push( array[i] );
                        }
                    }
                }

                return ret;
            };
        }

        var sortOrder, siblingCheck;

        if ( document.documentElement.compareDocumentPosition ) {
            sortOrder = function( a, b ) {
                if ( a === b ) {
                    hasDuplicate = true;
                    return 0;
                }

                if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
                    return a.compareDocumentPosition ? -1 : 1;
                }

                return a.compareDocumentPosition(b) & 4 ? -1 : 1;
            };

        } else {
            sortOrder = function( a, b ) {
                // The nodes are identical, we can exit early
                if ( a === b ) {
                    hasDuplicate = true;
                    return 0;

                    // Fallback to using sourceIndex (in IE) if it's available on both nodes
                } else if ( a.sourceIndex && b.sourceIndex ) {
                    return a.sourceIndex - b.sourceIndex;
                }

                var al, bl,
                    ap = [],
                    bp = [],
                    aup = a.parentNode,
                    bup = b.parentNode,
                    cur = aup;

                // If the nodes are siblings (or identical) we can do a quick check
                if ( aup === bup ) {
                    return siblingCheck( a, b );

                    // If no parents were found then the nodes are disconnected
                } else if ( !aup ) {
                    return -1;

                } else if ( !bup ) {
                    return 1;
                }

                // Otherwise they're somewhere else in the tree so we need
                // to build up a full list of the parentNodes for comparison
                while ( cur ) {
                    ap.unshift( cur );
                    cur = cur.parentNode;
                }

                cur = bup;

                while ( cur ) {
                    bp.unshift( cur );
                    cur = cur.parentNode;
                }

                al = ap.length;
                bl = bp.length;

                // Start walking down the tree looking for a discrepancy
                for ( var i = 0; i < al && i < bl; i++ ) {
                    if ( ap[i] !== bp[i] ) {
                        return siblingCheck( ap[i], bp[i] );
                    }
                }

                // We ended someplace up the tree so do a sibling check
                return i === al ?
                    siblingCheck( a, bp[i], -1 ) :
                    siblingCheck( ap[i], b, 1 );
            };

            siblingCheck = function( a, b, ret ) {
                if ( a === b ) {
                    return ret;
                }

                var cur = a.nextSibling;

                while ( cur ) {
                    if ( cur === b ) {
                        return -1;
                    }

                    cur = cur.nextSibling;
                }

                return 1;
            };
        }

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
        (function(){
            // We're going to inject a fake input element with a specified name
            var form = document.createElement("div"),
                id = "script" + (new Date()).getTime(),
                root = document.documentElement;

            form.innerHTML = "<a name='" + id + "'/>";

            // Inject it into the root element, check its status, and remove it quickly
            root.insertBefore( form, root.firstChild );

            // The workaround has to do additional checks after a getElementById
            // Which slows things down for other browsers (hence the branching)
            if ( document.getElementById( id ) ) {
                Expr.find.ID = function( match, context, isXML ) {
                    if ( typeof context.getElementById !== "undefined" && !isXML ) {
                        var m = context.getElementById(match[1]);

                        return m ?
                            m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
                                [m] :
                                undefined :
                            [];
                    }
                };

                Expr.filter.ID = function( elem, match ) {
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

                    return elem.nodeType === 1 && node && node.nodeValue === match;
                };
            }

            root.removeChild( form );

            // release memory in IE
            root = form = null;
        })();

        (function(){
            // Check to see if the browser returns only elements
            // when doing getElementsByTagName("*")

            // Create a fake element
            var div = document.createElement("div");
            div.appendChild( document.createComment("") );

            // Make sure no comments are found
            if ( div.getElementsByTagName("*").length > 0 ) {
                Expr.find.TAG = function( match, context ) {
                    var results = context.getElementsByTagName( match[1] );

                    // Filter out possible comments
                    if ( match[1] === "*" ) {
                        var tmp = [];

                        for ( var i = 0; results[i]; i++ ) {
                            if ( results[i].nodeType === 1 ) {
                                tmp.push( results[i] );
                            }
                        }

                        results = tmp;
                    }

                    return results;
                };
            }

            // Check to see if an attribute returns normalized href attributes
            div.innerHTML = "<a href='#'></a>";

            if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
                div.firstChild.getAttribute("href") !== "#" ) {

                Expr.attrHandle.href = function( elem ) {
                    return elem.getAttribute( "href", 2 );
                };
            }

            // release memory in IE
            div = null;
        })();

        if ( document.querySelectorAll ) {
            (function(){
                var oldSizzle = Sizzle,
                    div = document.createElement("div"),
                    id = "__sizzle__";

                div.innerHTML = "<p class='TEST'></p>";

                // Safari can't handle uppercase or unicode characters when
                // in quirks mode.
                if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
                    return;
                }

                Sizzle = function( query, context, extra, seed ) {
                    context = context || document;

                    // Only use querySelectorAll on non-XML documents
                    // (ID selectors don't work in non-HTML documents)
                    if ( !seed && !Sizzle.isXML(context) ) {
                        // See if we find a selector to speed up
                        var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

                        if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
                            // Speed-up: Sizzle("TAG")
                            if ( match[1] ) {
                                return makeArray( context.getElementsByTagName( query ), extra );

                                // Speed-up: Sizzle(".CLASS")
                            } else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
                                return makeArray( context.getElementsByClassName( match[2] ), extra );
                            }
                        }

                        if ( context.nodeType === 9 ) {
                            // Speed-up: Sizzle("body")
                            // The body element only exists once, optimize finding it
                            if ( query === "body" && context.body ) {
                                return makeArray( [ context.body ], extra );

                                // Speed-up: Sizzle("#ID")
                            } else if ( match && match[3] ) {
                                var elem = context.getElementById( match[3] );

                                // Check parentNode to catch when Blackberry 4.6 returns
                                // nodes that are no longer in the document #6963
                                if ( elem && elem.parentNode ) {
                                    // Handle the case where IE and Opera return items
                                    // by name instead of ID
                                    if ( elem.id === match[3] ) {
                                        return makeArray( [ elem ], extra );
                                    }

                                } else {
                                    return makeArray( [], extra );
                                }
                            }

                            try {
                                return makeArray( context.querySelectorAll(query), extra );
                            } catch(qsaError) {}

                            // qSA works strangely on Element-rooted queries
                            // We can work around this by specifying an extra ID on the root
                            // and working up from there (Thanks to Andrew Dupont for the technique)
                            // IE 8 doesn't work on object elements
                        } else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                            var oldContext = context,
                                old = context.getAttribute( "id" ),
                                nid = old || id,
                                hasParent = context.parentNode,
                                relativeHierarchySelector = /^\s*[+~]/.test( query );

                            if ( !old ) {
                                context.setAttribute( "id", nid );
                            } else {
                                nid = nid.replace( /'/g, "\\$&" );
                            }
                            if ( relativeHierarchySelector && hasParent ) {
                                context = context.parentNode;
                            }

                            try {
                                if ( !relativeHierarchySelector || hasParent ) {
                                    return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
                                }

                            } catch(pseudoError) {
                            } finally {
                                if ( !old ) {
                                    oldContext.removeAttribute( "id" );
                                }
                            }
                        }
                    }

                    return oldSizzle(query, context, extra, seed);
                };

                for ( var prop in oldSizzle ) {
                    Sizzle[ prop ] = oldSizzle[ prop ];
                }

                // release memory in IE
                div = null;
            })();
        }

        (function(){
            var html = document.documentElement,
                matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

            if ( matches ) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9 fails this)
                var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
                    pseudoWorks = false;

                try {
                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call( document.documentElement, "[test!='']:sizzle" );

                } catch( pseudoError ) {
                    pseudoWorks = true;
                }

                Sizzle.matchesSelector = function( node, expr ) {
                    // Make sure that attribute selectors are quoted
                    expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

                    if ( !Sizzle.isXML( node ) ) {
                        try {
                            if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
                                var ret = matches.call( node, expr );

                                // IE 9's matchesSelector returns false on disconnected nodes
                                if ( ret || !disconnectedMatch ||
                                        // As well, disconnected nodes are said to be in a document
                                        // fragment in IE 9, so check for that
                                    node.document && node.document.nodeType !== 11 ) {
                                    return ret;
                                }
                            }
                        } catch(e) {}
                    }

                    return Sizzle(expr, null, null, [node]).length > 0;
                };
            }
        })();

        (function(){
            var div = document.createElement("div");

            div.innerHTML = "<div class='test e'></div><div class='test'></div>";

            // Opera can't find a second classname (in 9.6)
            // Also, make sure that getElementsByClassName actually exists
            if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
                return;
            }

            // Safari caches class attributes, doesn't catch changes (in 3.2)
            div.lastChild.className = "e";

            if ( div.getElementsByClassName("e").length === 1 ) {
                return;
            }

            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function( match, context, isXML ) {
                if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
                    return context.getElementsByClassName(match[1]);
                }
            };

            // release memory in IE
            div = null;
        })();

        function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
            for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                var elem = checkSet[i];

                if ( elem ) {
                    var match = false;

                    elem = elem[dir];

                    while ( elem ) {
                        if ( elem[ expando ] === doneName ) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if ( elem.nodeType === 1 && !isXML ){
                            elem[ expando ] = doneName;
                            elem.sizset = i;
                        }

                        if ( elem.nodeName.toLowerCase() === cur ) {
                            match = elem;
                            break;
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
            for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                var elem = checkSet[i];

                if ( elem ) {
                    var match = false;

                    elem = elem[dir];

                    while ( elem ) {
                        if ( elem[ expando ] === doneName ) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if ( elem.nodeType === 1 ) {
                            if ( !isXML ) {
                                elem[ expando ] = doneName;
                                elem.sizset = i;
                            }

                            if ( typeof cur !== "string" ) {
                                if ( elem === cur ) {
                                    match = true;
                                    break;
                                }

                            } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
                                match = elem;
                                break;
                            }
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        if ( document.documentElement.contains ) {
            Sizzle.contains = function( a, b ) {
                return a !== b && (a.contains ? a.contains(b) : true);
            };

        } else if ( document.documentElement.compareDocumentPosition ) {
            Sizzle.contains = function( a, b ) {
                return !!(a.compareDocumentPosition(b) & 16);
            };

        } else {
            Sizzle.contains = function() {
                return false;
            };
        }

        Sizzle.isXML = function( elem ) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        var posProcess = function( selector, context, seed ) {
            var match,
                tmpSet = [],
                later = "",
                root = context.nodeType ? [context] : context;

            // Position selectors must be done after the filter
            // And so must :not(positional) so we move all PSEUDOs to the end
            while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
                later += match[0];
                selector = selector.replace( Expr.match.PSEUDO, "" );
            }

            selector = Expr.relative[selector] ? selector + "*" : selector;

            for ( var i = 0, l = root.length; i < l; i++ ) {
                Sizzle( selector, root[i], tmpSet, seed );
            }

            return Sizzle.filter( later, tmpSet );
        };

// EXPOSE
// Override sizzle attribute retrieval
        Sizzle.attr = jQuery.attr;
        Sizzle.selectors.attrMap = {};
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.filters;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })();

    //外部接口
    window['$'] = jQuery;

})(window);



