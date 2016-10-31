###js中使用new Function（）定义函数

1. var fun=new Function("arg1","arg2"……，"body"); 前面的参数都是fun的参数，最后一个是function的函数体代码，是一个字符串对象,最终获得的函数如下：
	
	```
		var fun=function(arg1,arg2){
			//body
		}	
	```
2. 该种定义方式的使用场景，例如在js模板引擎中，扫描代码，将语法解析后的字符串构造出一个函数，执行这个函数就可以进行渲染。`new Function 和eval ，setTimeout，setInterval一样都具有以字符串形式访问函数的能力，但是这种方式效率比较低下`
参考地址：[http://www.iteye.com/news/25340](http://www.iteye.com/news/25340)