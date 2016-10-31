

共同点：loftyjs和requirejs都是通过  
  
  ddd | lofty.js | Requirejs
 ---- | ---- | -----
 加载模块的方式|AMD
 
### loftyjs和requirejs的不同 ###
 
 * 后者需要通过script的data-main来指定程序的主入口，loftyjs不需要，在loftyjs中匿名函数就可以自动执行
 * loftyjs并没有将引用模块的require方法，暴露在全局变量中。而是通过require模块来提供引用其他模块的能力。
 
 * 引用模块的方式：
 
 	匿名模块的引用：在loftyjs中define一个匿名模块是无法被引用的，但是在requirejs中，可以随意定义若干个匿名模块，根据模块文件所在的路径来引用这些匿名模块
 	
 	具名模块
 
 
 * 那么在loftyjs中是否有这样的机制？？引用自：[http://www.requirejs.cn/](http://www.requirejs.cn/)
 
 > 
理想状况下，每个加载的脚本都是通过define()来定义的一个模块；但有些"浏览器全局变量注入"型的传统/遗留库并没有使用define()来定义它们的依赖关系，你必须为此使用shim config来指明它们的依赖关系。 如果你没有指明依赖关系，加载可能报错。这是因为基于速度的原因，RequireJS会异步地以无序的形式加载这些库。







