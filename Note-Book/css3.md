reference：[http://w3schools.bootcss.com/css/default.html](http://w3schools.bootcss.com/css/default.html)

### 1.box-shadow 
阴影模糊半径和阴影扩展半径的区别：
>阴影模糊半径：此参数可选，其值只能是为正值，如果其值为0时，表示阴影不具有模糊效果，其值越大阴影的边缘就越模糊；

>阴影扩展半径：此参数可选，其值可以是正负值，如果值为正，则整个阴影都延展扩大，反之值为负值时，则缩小；

### 2.border-image
![](./img/slice_here.png)
`border-image:url() 30% 35% 40% 30% round`

* [border-image-clip详细讲解](http://www.zhangxinxu.com/wordpress/2010/01/css3-border-image%E8%AF%A6%E8%A7%A3%E3%80%81%E5%BA%94%E7%94%A8%E5%8F%8Ajquery%E6%8F%92%E4%BB%B6/) 
看图说话就是，离图片上部30%的地方剪裁一下，在右边35%的地方剪裁一下，在离底部40%的地方裁剪一下，在距左边30%的地方也剪裁一下。于是总共对图片进行了“四刀切”，形成了九个分离的区域，这就是九宫格，这是下面深入讲解border-image的基础。
*  [border-image-repeat详细讲解](http://www.imooc.com/code/383) 
	*  repeat就是一直重复，然后超出部分剪裁掉，而且是居中开始重复。

	* Round 参数：Round可以理解为圆满的铺满。为了实现圆满所以会压缩（或拉伸）；
	
### 3.CSS函数
* attr()
* linear-gradient
* radial-gradient

### 4.text-overflow/white-space/word-wrap
 *  text-overflow:取值有ellipsis|clip|visible|string，注意string只能在firefox中起作用，此属性是对整个文本的样式控制
 * white-space:表示的是如何处理空白符以及文本是否折行显示，normal|nowrap|pre|pre-line，
 * word-wrap:控制的是当单词过长如何折行显示的问题。
 
### 5.backgroung-origin,background-clip,background-size
* backgroung-origin,background-clip 取值：border-box,padding-box,content-box
* background-size 取值：cover，contain,百分比
* background-attachment:设置背景

 
 
  
