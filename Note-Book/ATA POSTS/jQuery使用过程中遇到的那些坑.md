在近期的项目开发中，涉及到很多页面dom元素的处理，包括操作元素的可见性，新增和删除元素，使用到了很多jQuery API。jQuery API 的数量不少，想一个一个记住是不可能的（又特别对于我这种记忆力不好的人~~），所以大多数API，大概知道存在这样一个方法，具体参数和返回值就不那么清楚了，更别说其中的实现原理了。所以一边写一边查API 就成了一种常态化的开发模式。但是即使知道了API，不了解其中的实现原理，还是会踩到坑，其次还有jQuery1.7.2中的几个bug，这篇文章就总结了常用的几个API使用过程中自己总结的一些问题和心得。

### 1. data()返回的是什么？jQuery如何将dom元素和元素存储的值关联起来的？
	首先看一个例子：
	```html
	<div class='product' data-id='012345678901234567' data-product='{"name":"ZA Moisture"}'></div>
	```
	```javascript
	var $product = $(".product"),
        id = $product.data("id"),
        product = $product.data("product");

	console.log(id);//12345678901234568
	console.log(product);//[object Object]{name: "ZA Moisture"}
    console.log($product.attr("data-product"));//"{\"name\":\"ZA Moisture\"}"
	```   
    
通过data("id")获取的值不是string类型，而是number类型，而且由于javascript的Number类型，最大存储的整数的范围是2^-53~2^53，大概就是十六位十进制数，造成了精度丢失，第17位变成了`8`，而不是`7`。
再看data-product这个属性值,通过data获取的是一个对象。注意此处是一个对象，对象是引用类型，如果碰巧，在我的模块之中，将此处的product对象传给另外一个方法，进行了某些处理，改变了引用的值，那么当协同开发的另一个人，打算也使用data()获取$product上的product的值的时候，就会发生错误，他只会获取改变后的值。
```
function changeSomething(obj){
    obj.name= "Zhang " + obj.name;
}
changeSomething(product);
console.log($product.data("product"));//[object Object] {
  name: "Zhang ZA Moisture"
}
console.log($product.attr("data-product"));//"{\"name\":\"ZA Moisture\"}"
```
结论一：使用data()来获取dom节点上的值的时候，jQuery会自动对值进行转换，转换成javascript的类型（number,object,array,date）等，特别是当转换成引用类型的时候，必须小心谨慎的使用，因为可能无心的一次改变，可能会造成别人获取该dom属性的值的时候出错，此时的解决办法就是克隆。或者使用attr方法
```
var cloneProduct = $.extend({},product);
changeSomething(cloneProduct);
console.log($product.data("product"));//[object Object]{name: "ZA Moisture"}
```
仔细观察会发现，在调用changeSomething方法前后，实际上data-product属性值并没有发生变化，但是通过data("product")获取的值却变了，其原因是jQuery在内部为jQ对象开辟了缓存空间，
```
jQuery.cache = {};
```
然后将每一个jQuery对象关联的数据对象data缓存起来，每一个jQ对象都有一个key为Data.expando的value，这个value，就是存储在jQuery.cache中的key。
```
jQuery.cache = {
    5:{product:{name:"xxxxx"},id:"12345678901234568"}
    6:{xxx:xxx}
}
$product[Data.expando] = 5;
$(document)[Data.expando] = 6 ;
```
注意Data.expando是一个随机值,是由Data对象维护这个随机值(例如jQuery21400174593341601205762)，基本获取一次就不会改变，$(el)[Data.expando]属性取值是uid++ ;
```
function Data() {
   Object.defineProperty( this.cache = {}, 0, {
        get: function() {
            return {};
        }
    });
     this.expando = jQuery.expando + Data.uid++;
}
Data.uid = 1;
```
结论二：当jQuery在其内部通过给jQ添加额外的属性，来关联维护了关联的数据对象，只有在jQuery.cache中没有找到数据时，jQuery.data会在DOM元素的data-*属性中查找数据。
### 2. $.inArray(array,element)  的返回值是啥？
  该方法表示的是element在array中的index，看到也有同学误以为该方法返回的是bool。
### 3. 单选radio是监听change or click？
    ```
    <input type="radio" name="gender" value="female">男
    <input type="radio" name="gender" value="male">女
    <!--1.7.2-->
    <script   src="https://code.jquery.com/jquery-1.7.2.min.js" ></script>
    
        <script>
        $("input[name=gender]").on('change',function(){
            alert($(this).val());
        });
        $("input[name=gender]").eq(0).click(); 
        </script>
    ```
以上代码在ie8中不生效，对话框不会弹出，改正方法有2种： 
1. 改变jquery的版本，使用新版本的jquery就会弹出对话框。这是jquery1.7.2的bug。 
2.将radio的change事件，变成click事件。这个时候就需要判断单选框的状态了，代码变成下面这样：
```
        $("input[name=gender]").on('click',function(){
        if($(this).prop('checked')){
            alert($(this).val());
            }
        });
        $("input[name=gender]").eq(0).prop('checked',true).click();    
```
在项目开发中，因为历史原因，不能升级jquery版本，只能采取第二种方法，
### 3.prop()和attr()？
在理解jQuery的prop和attr之前，先看看DOM本身提供的一些访问DOM的接口，一个DOM 元素对应一个DOM Element对象，对象就有其属性（property）和方法，DOM Element有一个getAttribute方法，这个方法获取的是DOM Element对应的html标签上的属性。
```
<a href='foo.html' class='test one' name='fooAnchor' id='fooAnchor'>Hi</a>

var a = document.getElementById("fooAnchor");

console.log(a.href); //"http://null.jsbin.com/foo.html"
console.log(a.getAttribute('href')); //"foo.html"
console.log(a.id) //"fooAnchor"
console.log(a.getAttribute("id")); //"fooAnchor"
console.log(a.className); //"test one"
console.log(a.getAttribute('class')); //"test one"
console.log(a.dataset); // [object DOMStringMap] {source: "lili"}
console.log(a.getAttribute('data-source'));//"lili"
```
从上面的例子可以看出:
* DOM Element的property基本都有其对应的attribute，但是不一定相同，例如className这个property对应的是「class」这个attribute，另外还有一些属性，例如chiledren，就没有对应的attribute，具体可参考[Element property and methods](https://developer.mozilla.org/en-US/docs/Web/API/Element).
* a.href 和 a.getAttribute('href')的取值也是不一样的。
那么，jQuery的prop()类比于访问DOM Element的property，而attr()就类比于使用DOM Element的getAttribute，当然jquery在实现的方法的时候会更复杂，考虑到那么多property和attr。
```
var a = document.getElementById("fooAnchor");
var $a = $("#fooAnchor");
console.log(a.href);//"http://null.jsbin.com/foo.html"
console.log($a.prop("href"));//"http://null.jsbin.com/foo.html"
console.log(a.getAttribute('href'));//"foo.html"
console.log($a.attr("href"));//"foo.html"
console.log(a.getAttribute('data-source'));//"lili"
console.log($a.attr('data-source'));//"lili"
console.log(a["data-source"]);//undefined
console.log($a.prop('data-source'));//undefined

```
在使用的过程中，如果对DOM Element本身具有的一些property有很好的了解的话，就能很轻松的分辨出究竟是使用prop（）还是attr（）,例如，经常使用的判断复选框的状态，其实DOM Element对象本身就具有一个checked属性，这个checked属性实时反映的是复选框的状态，通过设置DOM Element的checked属性也可以勾选复选框。根据上面的结论，那么就应该使用prop()方法来获取和操作checkbox的checked属性。
```
var checkbox = document.getElementById("foo-check");
console.log(checkbox.checked)
checkbox.checked = true ;//选中复选框
```

一直使用jQ，所以以致于原生的DOM 对象究竟是一个怎么的对象都忘记了，其实jQ的实现都是基于DOM最基本基本的API，所以通过看源码可以温习一遍基础的DOM 知识。
