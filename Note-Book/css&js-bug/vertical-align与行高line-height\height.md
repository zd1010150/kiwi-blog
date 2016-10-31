[http://www.cnblogs.com/fengzheng126/archive/2012/05/18/2507632.html](http://www.cnblogs.com/fengzheng126/archive/2012/05/18/2507632.html)
该文章讲解的很仔细有关line-height和font-size的计算。

height在不设置值的时候，是由`line-height`决定的，line-height的高度是有line box 决定的，line box就是其中包含的所有的子元素的最高高度，例如图片，文字等等的最高高度。综上，line-height就是包含的子元素的最高高度。

`文字位于line-height的垂直中点的位置。`

####单行文字在块中垂直对齐
只需要设置块的line-height的高度为box的高度，就可以实现文字在块中的垂直对齐
####多行文字在块中垂直对齐
利用linebox的高度是由其子元素的最高高度决定的原理，插入一个占位的元素，此处就是i，此处i的line-height继承自父元素，也就是150px,设置display:inline-block是为了显示在一行。

html：

```

		<p class="mulit_line">
        <span style="font-size:12px;">这里是高度为150像素的标签内的多行文字，文字大小为12像素。&lt;br />这里是第二行，用来测试多行的显示效果。
        </span>
        <i>&nbsp;</i>
    </p>

```
css:

```
    .mulit_line {
        line-height: 150px;
        border: 1px dashed #cccccc;
        padding-left: 5px;
    }
    
    .mulit_line span {
        display: -moz-inline-stack;
        display: inline-block;
        line-height: 1.4em;
        vertical-align: middle;
    }
    
    .mulit_line i {
        width: 0;
        display: -moz-inline-stack;
        display: inline-block;
        vertical-align: middle;
        font-size: 0;
    }

```