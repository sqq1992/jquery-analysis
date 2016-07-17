

;(function(window,undefind){

    //jquery的类
    var jQuery = (function () {

        var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,     //匹配id混搭的html字段，防止xss
            rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;      //当前的html是否单独标签

        //jquery类
        var jQuery = function (selector, context) {
            //实列化jquery的类
            return new jQuery.fn.init(selector, context);
        };

        jQuery.fn = jQuery.prototype = {
            constructor:jQuery,

            //初始化方法
            init:function(selector,context,rootjQuery){
                var match,  //字符串匹配的数组
                    elem,
                    ret,
                    doc;


                //如果selector传入的是空值的话，则直接返回this对象
                if(!selector){
                    return this;
                }

                //如果selector参数是dom元素
                if(selector.nodeType){
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }

                //如果selector是字符串body,则设置context属性指向document,第一个元素为body,属性lenght为1
                if(selector==="body" && !context && document.body){
                    this.context = document;
                    this[0] = document.body;
                    this.selector = selector;
                    this.length = 1;
                    console.log(this);
                    return this;
                }

                if(typeof selector==="string"){

                    //如果匹配到的是一个完整的html字符的话
                    if(selector.charAt(0)==="<" && selector.charAt(selector.length-1)===">" && selector.length>=3){
                        match = [null, selector, null];
                    }else{  //如果匹配到的是不完整的片段, 列如abc<div>这样的
                        match = quickExpr.exec(selector);
                    }

                    //匹配到的是一个普通的html标签字段或者字符与html字段混搭,列如<div>或者ms<div>
                    if(match && (match[1] || !context)){
                        //匹配到纯的html字段
                        if(match[1]){
                            //当前上下文
                            context = context instanceof jQuery ? context[0] : context;
                            //当前的原生节点
                            doc = (context ? context.ownerDocument || context : document);

                            //匹配单独的html标签字段
                            ret = rsingleTag.exec(selector);

                            if(ret){    //匹配到html字段为单个字段的时候


                                if(jQuery.isPlainObject(context)){  //context是否为对象
                                    selector = [document.createElement(ret[1])];
                                    jQuery.fn.attr.call(selector, context, true);
                                }else{
                                    selector = [document.createElement(ret[1])];
                                }

                            }else{  //如果是多个html字段的话,则利用浏览器的innerHTML创建dom
                                console.log(match);
                                ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
                                selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
                            }

                            return jQuery.merge( this, selector );

                        }else{  //匹配id查找器, 列如 #id

                            elem = document.getElementById(match[2]);   //根据id查找到的dom

                            if(elem && elem.parentNode){

                                //兼容ie或者operat下id与form表单中的name冲突的兼容
                                if(elem.id!==match[2]){
                                    return rootjQuery.find(selector);
                                }

                                this.length = 1;
                                this[0] = elem;

                            }
                            this.context = document;
                            this.selector = selector;
                            return this;
                        }

                    }else if(!context || context.jquery){   //匹配普通的选取器 列如 $("id")

                        return (context || rootjQuery).find(selector);

                    }else{  //匹配有上下文的选择器
                        return this.constructor( context ).find( selector );
                    }

                }else if(jQuery.isFunction(selector)){  //匹配到function
                    return rootjQuery.ready(selector);
                }

                //如果匹配到的是jquery对象的话
                if ( selector.selector !== undefined ) {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return jQuery.makeArray( selector, this );

            }


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

    //外部接口
    window['$'] = jQuery;

})(window);


//var na = /<([\w:]+)/;
//var a = '<div></div>';
//
//
//console.log(na.exec(a));