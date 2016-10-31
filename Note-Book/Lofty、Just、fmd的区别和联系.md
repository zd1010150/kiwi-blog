#背景知识
###模块是什么？
   一个定义了私有变量和函数的函数，利用闭包创建可以访问私有变量和函数的特权函数，最后返回这个特权函数，模块避免了全局变量的使用，促进了信息的隐藏，对于应用程序的封装，模块模式非常有效。
   
###CommonJS&AMD模块规范


* what is CommonJS?

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node.js的模块系统，就是参照CommonJS规范实现的。

* what is AMD？

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AMD is short for Asynchronous Module Definition。因为node.js运行在服务器端，那么加载模块，就是从物理磁盘上读取文件这么简单，但是对于在浏览器端，加载一个模块需要进行网络传输，就会影响代码的执行的顺序。

### requirejs    

依据AMD规范实现的模块管理框架，主要解决两个问题：

* 实现js文件的异步加载，避免网页失去响应
* 管理模块之间的依赖性

require.js要求每个模块是一个单独的js文件，这样的话，如果是多个模块，就要发出多次HTTP请求，require提过了一个工具，可以将多个模块合并在一个文件中。

**试述fmd.js与RequireJS（AMD的一个实现）之间的差异，试述AMD和CommonJS之间的差异**

### fmdjs
fmd is short for Formatting Module Definition。是一种语法机制，而非文件层的，定义一切皆模块。只是定义模块，解决了模块之间的依赖性，也提供了文件的异步加载，但是在实际开发中，使用的是justPage去管理模块的异步加载。

### loftyjs（fdevlib/js/lofty/port/lofty.js）
loftyjs就是fdev-5版本，以前的fdev-4版本就是封装了jquery和部分jquery的扩展，loftyjs中包括了fmdjs，用于模块的组织，模块的异步加载等等。

### juqery-latest(fdevlib/js/gallery/jquery/jquery-latest.js)

在jquery基础上，。使用lofty的模块化定义方法，进行了一次模块化封装，并且对ajax进行了支持https请求功能的封装


### justjs

依赖于loftyjs和jquery-latest。提供了一些页面级的方法，包括

 * justPage用于页面模块组织，常用页面级方法，
 * justCache用于全局页面节点data数据的存取，
 * justRuntime页面运行环境的一些方法，例如判断当前是测试环境还是线上环境，是ios还是安卓还是wap等等。
 * justTracker用于打点
 * 页面常用的一些规范，从文字显示的样式，各个表单控件到


