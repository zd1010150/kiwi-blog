### mix-to ,mix-in

  client.mixTo(server)，返回的是server
  
  
### define

 只有在第一次依赖某个模块的时候，会执行该模块，后面就不会再执行该模块的代码了

```
1.
    define('classB',[],fucntion(){
	
	     return obj;
	});
	
2.
	define('classA',['classB','classC'],function(b,c){
	//第一次依赖classB的时候，会执行第一部分代码，返回一个obj
	
	});
3.
	define('classD',['classB','classE'],function(b,e){
	//第二次依赖classB的时候，就不会再执行第一部分代码，而直接使用obj
	
	});
```

### array-slice&splice

1. slice是返回一个数组的子数组，有两个参数（start，end）表示的是下标，都从0开始编号，
   * start 可以用负数，-1表示倒数第一个，-2，表示倒数第二个，
   * 注意返回的不包括end这个index的值，但是包括start，
   * 不会修改原数组的内容，返回的是子数组。
   * 如果不指定end这个值，默认是会取到数组最后一个数
2. 而splice(startindex,howmany,parm1,param2……)是删除增加元素，会修改原数组的内容，返回的是增加，修改带内容
   * howmany表示要删除的个数
   * 是从startindex开始进行操作，删除是从startindex开始的,插入是在startindex之前插入
    
### 定义一个类，这样做的好处是？

```
var $=function(){
	return new _$();
}
var _$=function(){};
_$.prototype={};

``` 
### DOM元素在js中的原型链关系

例如针对一个p元素，对应的是一个HTMLParagraphElement.prototype → HTMLElement.prototype → Element.prototype → Node.prototype → Object.prototype → null,那么我们就可以在原型上扩展一些方法

### 以后写一个类的时候，最好还是给个类结构图，包括类的私有变量（方法），公共变量（方法），或者规定一个规范，怎么书写类，如何给类命名共有变量，私有变量，要不然让代码阅读者自己去一步一步摸索，真心累，学习java给个类图？描述一下各个类之间的关系？
![](img/36.png)

### 修改存档，变为删除

1.添加一个浮层，显示确定是否删除。
  
   
  