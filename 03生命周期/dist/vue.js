(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
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
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  // 重写数组

  // 1 获取原来的数组方法
  var oldArrayProtoMethods = Array.prototype;

  // 2 继承
  var ArrayMethods = Object.create(oldArrayProtoMethods);

  // 3 劫持
  var methods = ['push', 'pop', 'unshift', 'shift', 'splice'];
  methods.forEach(function (item) {
    // 函数方式进行数组劫持,重写数组方法
    // console.log('劫持数组,正在重写数组方法',item);
    ArrayMethods[item] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = oldArrayProtoMethods[item].apply(this, args);
      // 对应方法添加响应式
      var inserted;
      switch (item) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.splice(2); // arr.splice(0,1,{b:6})
          break;
      }
      // console.log(`${item}方法 inserted `,inserted);
      var ob = this.__ob__; //指向数组本身
      if (inserted) {
        ob.observerArray(inserted);
      }
      return result;
    };
  });

  function observer(data) {
    // console.log('数据已经劫持：',data);

    // 劫持对象  ---> 为对象、null，即无需劫持，直接返回
    if (_typeof(data) != 'object' || data == null) {
      return data;
    }
    return new Observer(data);
  }
  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      // Object.defineProperty缺点  ---> 只能给对象中的一个属性添加响应式
      Object.defineProperty(data, "__ob__", {
        enumerable: false,
        value: this //指向实例对象vm
      });

      // 劫持数组并重写方法 --->  用于pop、push等方法时，数据也是响应式的
      if (Array.isArray(data)) {
        // console.log('劫持到数组：', data);

        data.__proto__ = ArrayMethods;
        // 为数组添加响应式
        this.observerArray(data);
      } else {
        //由于存在缺点，所以需遍历每个属性进行劫持 
        this.walk(data);
      }
    }
    // 劫持对象中每个属性
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = data[key];
          defineReactive(data, key, value); // 劫持单个属性
        }
      }
      // 为数组添加响应式
    }, {
      key: "observerArray",
      value: function observerArray(data) {
        for (var i = 0; i < data.length; i++) {
          observer(data[i]);
        }
      }
    }]);
    return Observer;
  }(); // 劫持单个属性
  function defineReactive(data, key, value) {
    //深度劫持
    observer(value);
    Object.defineProperty(data, key, {
      get: function get() {
        // console.log("获取返回值：", value);
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        // console.log(`劫持：${value} -> ${newValue}`);
        value = newValue;
      }
    });
  }

  function initState(vm) {
    var opts = vm.$options;
    //判断是否初始化对应配置项
    if (opts.props) ;
    if (opts.data) {
      initData(vm);
    }
    if (opts.watch) ;
    if (opts.computed) ;
    if (opts.methods) ;
  }
  function initData(vm) {
    // 对象形式、函数形式两种
    var data = vm.$options.data;
    // call改变this指向（Windows -> Vue）
    data = vm._data = typeof data === "function" ? data.call(vm) : data;

    // 数据劫持(劫持对象中分劫持简单数据类型、劫持数组) --> 添加响应式原理
    observer(data);

    // 数据代理到vm实例对象上
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  // 从_data中代理到vm实例上
  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  // Regular Expressions for parsing tags and attributes
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 属性id:'app'
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名称
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <span:xx>
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 开头标签< 
  var startTagClose = /^\s*(\/?)>/; // 匹配结束标签 >
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 结束标签</xxx>  or >
  function parseHTML(html) {
    while (html) {
      // 文本结束索引值
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // 没有文本 -> 解析标签
        // 解析开始标签
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          // continue;          
        }
        // console.log(startTagMatch);

        // 解析结束标签
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          end();
          advance(endTagMatch[0].length);
        }
        // console.log(endTagMatch);
        // continue;
      }

      if (textEnd > 0) {
        // 有文本 -> 解析文本内容
        var text = html.substring(0, textEnd);
        if (text) {
          advance(text.length);
          // console.log(text);
          charts(text);
        }
      }
      // break;
    }
    // 获取标签对象【名称、属性】
    function parseStartTag() {
      var start = html.match(startTagOpen);
      // console.log(html,start);

      if (start) {
        var match = {
          tagName: start[1],
          //标签名称
          attrs: []
        };
        // 删除开始标签  start[0] -> '<div'
        advance(start[0].length);

        // 获取属性,添加到标签对象中
        var attr, _end;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 没有> && 有属性 -> 循环

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          }); // {name:'id', value:'app'}
          advance(attr[0].length); // arrt[0] -> id="app"
          // console.log(attr[0]);
          // break
        }

        if (_end) {
          advance(_end[0].length); // end[0] -> >
          // console.log('end',end[0]);

          // console.log(match);
          return match; //结束匹配
        }
      }
    }
    // 删除html中对应的长度 例如：<div
    function advance(str) {
      html = html.substring(str);
      // console.log(`advance函数删除${str}个字符数: `, html);
    }

    // console.log(root);
    return root;
  }

  // 遍历
  var root; //根元素
  var createParent; // 当前元素的父亲
  var stack = []; // 栈  -> 父子级关系

  // 创建抽象语法树格式
  function createASTElement(tag, attrs) {
    return {
      tag: tag,
      attrs: attrs,
      children: [],
      // 子节点
      type: 1,
      // 元素级别
      parent: null
    };
  }

  // 开始标签
  function start(tag, attrs) {
    var element = createASTElement(tag, attrs);
    if (!root) {
      root = element;
    }
    createParent = element;
    stack.push(element);
  }
  // 文本
  function charts(text) {
    text = text.replace(/\s\g/, ''); // 替换空格
    if (text) {
      createParent.children.push({
        type: 3,
        text: text
      });
    }
  }
  // 结束标签
  function end() {
    var element = stack.pop(); // 出栈
    createParent = stack[stack.length - 1];
    if (createParent) {
      element.parent = createParent.tag;
      createParent.children.push(element);
    }
  }

  /**
   * 从
   *    div id="app">hello {{msg}} <span>231</span></div>
   * 
   * 解析成 ast语法树(抽象语法树)
   * {
   * tage: 'div',
   * attrs: [{id:'app'}],
   * children: [{tag:null, text:'hello'}, {tag:'span',text:231},]
   * }
   * 
   */

  var defaultTageRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //匹配插值表达式

  // 生成模板编译字符串
  function generate(el) {
    var children = genChildren(el);
    //  _c解析标签【也可以解析子标签】 _v解析文本 _s解析插值表达式 
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'null', ",").concat(children ? "".concat(children) : 'null', ")");
    // console.log('code',code);
    return code;
  }
  // 处理子节点
  function genChildren(el) {
    var children = el.children;
    if (children) {
      return children.map(function (item) {
        return gen(item);
      }).join(',');
    }
  }
  function gen(node) {
    // 子节点类型 1标签 3文本
    if (node.type === 1) {
      // 标签 
      return generate(node);
    } else {
      // 文本
      var text = node.text;
      if (!defaultTageRE.test(text)) {
        // 没有插值语法
        return "_v(".concat(JSON.stringify(text), ")");
      }
      var tokens = []; // 保存值
      var lastindex = defaultTageRE.lastIndex = 0; //下一次查找的索引位置
      var match;
      while (match = defaultTageRE.exec(text)) {
        // exec捕获插值表达式
        // console.log('match',match);
        var index = match.index; //首次匹配上的子串的起始下标
        if (index > lastindex) {
          tokens.push(JSON.stringify(text.slice(lastindex, index))); //文本内容                
        }

        tokens.push("_s(".concat(match[1].trim(), ")")); // 插值表达式变量名
        lastindex = index + match[0].length;
      }
      if (lastindex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastindex)));
      }
      // console.log(tokens);
      return "_v(".concat(tokens.join('+'), ")");
    }
  }
  /**
   * 处理style属性行内样式
   * {name: 'style', value: 'color: red;font-size: 14px;'} 
   *  ->
   * {name: 'style', attrs: {color: red,font-size: 14px} } 
   */
  function genProps(attrs) {
    var str = '';
    attrs.forEach(function (attr) {
      if (attr.name === 'style') {
        var obj = {};
        var items = attr.value.split(';');
        items.forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value;
        });
        attr.value = obj;
      }
      // 拼接
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    });
    // console.log('style属性行内样式：',str);
    return "{".concat(str.slice(0, -1), "}"); //切除最后一个逗号！！！
  }

  /**
   * 从
   * 
   * {
   *  tage: 'div',
   *  attrs: [{id:'app'}],
   *  children: [{tag:null, text:'hello'}, {tag:'span',text:231},]
   * }
   * 
   * 解析成
   * 
   * render() { _c解析标签【也可以解析子标签】 _v解析文本 _s解析插值表达式 
   *  return _c('div',{id:'app'},_v('hello '+_s(msg)),_c('h1'))
   * }
   * 
   */

  // render函数
  function compileToFunciton(template) {
    // 1 将html字符串 -> ast语法树
    var ast = parseHTML(template);
    // console.log('html字符串 -> ast语法树', ast);

    // 2 ast语法树 -> 模板编译字符串
    var code = generate(ast);
    // console.log('ast语法树 -> 模板编译字符串 ',code);

    // 3 模板编译字符串 -> render函数
    var render = new Function("with(this){return ".concat(code, "}"));
    // console.log('模板编译字符串 -> render函数',render);

    // render函数
    return render;
  }

  // 根据vnode创建真实DOM
  function patch(oldNode, vnode) {
    // 1 vnode -> 真实dom
    var el = createEl(vnode);
    // console.log('createEl方法渲染成真实dom',el);

    // 2 替换   ① 获取父节点 ②插入  ③删除
    var parentEL = oldNode.parentNode; // body节点
    parentEL.insertBefore(el, oldNode.nextsibling);
    parentEL.removeChild(oldNode);
    return el;
  }
  // 递归创建dom
  function createEl(vnode) {
    var tag = vnode.tag,
      children = vnode.children;
      vnode.data;
      vnode.key;
      var text = vnode.text;
    if (typeof tag == 'string') {
      //标签
      vnode.el = document.createElement(tag); // 创建元素
      // 子节点
      if (children.length > 0) {
        children.forEach(function (child) {
          vnode.el.appendChild(createEl(child)); //递归创建子节点
          // console.log(vnode.el.nodeType);
          // console.log('vnode.el',vnode.el);
        });
      }
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el; // 记得返回值啊啊啊啊啊！！！！
  }

  function mountComponent(vm, el) {
    callHook(vm, 'beforeMount');

    // 1 vm._render()生成虚拟dom
    // 2 vm._update将vnode变成真实dom放到页面
    vm._update(vm._render());
    callHook(vm, 'mounted');
  }
  function lifecycleMixin(Vue) {
    //原型链注册update方法
    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode); //  更新DOM（旧DOM参数 新DOM参数）
      // console.log(vnode);
    };
  }

  // 生命周期 -订阅发布模式
  // 即已经订阅好了，要用生命周期调用就行了
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm); // 改变生命周期this指向，指向vm实例对象
      }
    }
  }

  var HOOKS = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestory", "destroyed"];

  // 策略模式   对于有很多种if else的语句，可以使用策略模式
  var starts = {};
  starts.data = function (parentVal, childVal) {
    return childVal;
  }; // 合并data
  starts.computed = function () {}; // 合并computed
  starts.watch = function () {}; // 合并watch
  starts.methods = function () {}; // 合并methods
  // 遍历生命周期
  HOOKS.forEach(function (hook) {
    //不用加(),因为目前是定义很多变量,等待starts[key](parent[key], child[key]) 执行
    starts[hook] = mergeHook;
  });
  // 合并全局方法（Vue.Mixin等 和生命周期）
  // 有孩子、父亲进行拼接成同一个数组，否则返回儿子或父亲
  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal); // 数组连接
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }
  function mergeOptions(parent, child) {
    var options = {};
    // 有父亲，没有儿子 -> 遍历父亲
    for (var key in parent) {
      mergeField(key);
    }
    // 有儿子，没有父亲 -> 遍历儿子
    for (var _key in child) {
      mergeField(_key);
    }
    function mergeField(key) {
      // 根据key 策略模式
      if (starts[key]) {
        //{ created:[a,b,c],watch:[a,b]}
        options[key] = starts[key](parent[key], child[key]);
      } else {
        options[key] = child[key];
      }
    }
    // console.log('options',options);
    return options;
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 指向Vue实例对象
      // vm.$options = options
      vm.$options = mergeOptions(Vue.options, options); // 和Vue.Mixin一起合并配置项
      // console.log('枚举配置项：',vm.$options);

      callHook(vm, 'beforeCreate'); //调用生命周期

      //初始化状态
      initState(vm);
      callHook(vm, 'created'); //调用生命周期
      // 渲染模板 el
      if (vm.$options.el) {
        vm.$mounted(vm.$options.el);
      }
    };

    // 创建$mounted
    Vue.prototype.$mounted = function (el) {
      // 先寻render 再寻template ，都没有再寻el的outerHTML
      var vm = this;
      el = document.querySelector(el);
      // 旧dom挂到实例对象上，方便diff对比更新
      vm.$el = el;
      var options = vm.$options;
      if (!options.render) {
        // 没有render
        var template = options.template;
        if (!template && el) {
          // 没有template 有el
          el = el.outerHTML;
          // console.log(el); 

          // render函数【html字符串 -> ast -> 模板编译字符串 -> render函数 】
          // render是函数  render()是调用函数 -> 会生成对应组件的vnode
          var render = compileToFunciton(el);
          // console.log('render',render);

          // render函数暴露在实例对象上
          vm.$options.render = render;
        }
      }
      // 挂载组件
      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      // 标签
      // 创建标签
      return createElement.apply(void 0, arguments);
    };
    Vue.prototype._v = function (text) {
      // 文本
      return createText(text);
      // return vnode(undefined,undefined,undefined,undefined,text)
    };

    Vue.prototype._s = function (val) {
      // 插值变量
      return val == null ? "" : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };
    // render函数渲染成 vnode
    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(this); //指向vm 【是with语句中的this】
      // console.log(vnode);  // 得到虚拟dom ! ! !
      return vnode;
    };
  }
  // 生成vnode格式
  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }
  // 创建元素
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    return vnode(tag, data, data.key, children);
  }
  // 创建文本
  function createText(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  /**
   * vnode节点  只可描述节点 比ast要垃圾
   * {
   *  tag: 'div',
   *  children: []
   * }
   * 
   */

  function initGlobApi(Vue) {
    // console.log(this);
    // 源码
    // { created:[a,b,c],watch:[a,b]}
    Vue.options = {}; // 全局变量
    Vue.Mixin = function (mixin) {
      //对象合并用的
      Vue.options = mergeOptions(Vue.options, mixin); //this指向Vue  第一次this.options为
      console.log('Vue.options', Vue.options);
    };
  }

  function Vue(options) {
    // console.log(this);
    this._init(options);
  }

  //初始化配置项
  initMixin(Vue);
  // 添加生命周期
  lifecycleMixin(Vue);
  // 添加_render
  renderMixin(Vue);
  // 创建全局方法  如：Vue.Mixin Vue.component Vue.extend
  initGlobApi(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
