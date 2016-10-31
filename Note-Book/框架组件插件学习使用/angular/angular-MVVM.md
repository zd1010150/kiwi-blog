###基本指令
ng-app : 定义了angularJS应用

ng-controller : 定义了控制器,

ng-model:将html值绑定到controller中

ng-bind:将controller中的数据绑定到html上,功能和表达式类似 `{{}}`

ng-repeat:循环打印数组

ng-if:判断条件是否成立

ng-disabled:直接将一个boolean值绑定到html控件上，如果该值为false就是不可点击的

ng-show:一个boolean值，为true就可以展示，为false就不可以

ng-hide:和ng-show类似，只是表示是否可以隐藏

ng-include:包含页面


```
var app=angular.module('myAPP',[]);
app.controller('myCtrl',function($scope){
	$scope.firstName="John";
});
```

###表达式
angular表达式和js表达式类似，但是没有循环。循环的话要使用ng-repeat.另一方面，angular提供了过滤器，可以完成一些简单的数据转换，包括大小写转换，货币表示，过滤数组等。

###控制器
在控制器内，可以完成一些初始化数据的工作，和一些事件绑定的处理函数的编写。






