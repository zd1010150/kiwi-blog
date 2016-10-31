##模块机制探究##

常见的模块化规范有两种，一种是AMD，一种是CMD。

###模块的加载
一种是通过ajax请求去加载，但是如果是跨域的话，那么直接通过scipt标签动态加载，但是这个是有问题的？？

```
function callback(){
		alert("callback");
	}
	function loadScript(path,callback){
		var scriptElement=document.createElement("script");
		if("onload" in scriptElement){
				scriptElement.onload=function(e){
				callback();
			};
		}else if("onreadystatechange" in scriptElement){
			scriptElement.onreadystatechange=function(){
			if(scriptElement.readyState==="loaded"){
				callback();
				}
	  		}; 
		}
		scriptElement.src=path;
		(document.getElementsByTagName("head")[0] || document.body).appendChild(scriptElement);
	
	}
		
	loadScript("js/test.js",callback);
```

###模块依赖的管理

```
var moduleCache={};//缓存所有加载的模块

function start(script){
	//通过正则去扫描path路径所对应的代码，获得所有require
	var  reg=/require\((.+)\)/g;
	while(path=reg.exec(scirpt)){
		path&&require(path);
	}
	
}

function require(path){
	if(!moduleCache[path]){//如果该模块没有加载过，就进行加载
		var script=loadScript(path);//假设存在一个loadScript方法加载该文件
		moduleCache[path]=script;
		start(script);
	
	}

}


```