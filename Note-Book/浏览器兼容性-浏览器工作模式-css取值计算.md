### js判断浏览器工作模式
document.compatMode,返回CSS1Compat说明时标准模式，BackCompat是混杂模式
### em,px的区别

```
	body{
		font-size:20px;
	}
	#title{
		font-size:1.6em;
	}	
	#content{
		font-size:12px;
	}
```
title和content都位于body内，那么在页面中显示的时候，title字体的大小是1.6*16-20=5.6px
也就是说em具有继承性。会根据继承的font－size大小。来判断自己的显示大小

### css hack principles

* Effective: should pass the examination of Web standard.
* Specifically: only aimed at the older browser,not the current browser.
* Ugly:let the reader remember that this code  is for Hack,so remember it by heart.

### some hack ruler for the different browsers

* IE7: *＋html selector
* IE8: *html selector
* The earlier version IE(6,7(Quirk),8(Quirk)) don`t understand the '!important' this keyword which used to promote the priority.the condition is thst the same property is declear in the same selector,if in different selectors the former ies can render the tag rightly. 

the div will be green in the earlier version ies

```
div｛
	background-color:red!important;
	background-color:green;
｝

```
thd div will be red in the all browsers including the earlier ies.

```
div{
	background-color:red!important;
	}
div{
	background-color:green;
	}
```

### CSS value in the four different stage 

* specified value:(In the js ,'element.style.property' can get this value ,the other can`t get by this attribute)
* computed value: the decedent will heritage this value
* used value :

  this value can be getted by this function in the js
  
```
 function getStyle(obj, style) {
      var _style = (style == "float") ? "styleFloat" : style;
      return document.defaultView ? document.defaultView.getComputedStyle(obj, null).getPropertyValue(style) : obj.currentStyle[_style.replace(/-[a-z]/g, function() {
          return arguments[0].charAt(1).toUpperCase();
      })];
}

 
```
* actual value

###