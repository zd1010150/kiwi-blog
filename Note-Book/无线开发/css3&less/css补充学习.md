###文本数量超过div长度时的显示控制属性
```
text-overflow:ellipsis;当文本超过长度的时候，使用省略号
text-overflow:clip;当文本超过长度的时候，直接剪掉
```

### 使用css3对元素进行缩放
[http://www.w3school.com.cn/cssref/pr_transform.asp](http://www.w3school.com.cn/cssref/pr_transform.asp)

```
transform:scaleX();X轴缩放
transform:scaleY();Y轴缩放
```
### 节点奇数与偶数选择

```
:nth-child(odd) 与 :nth-child(even)
```
### 旋转图片

     transform:rotate(xdeg)
     -ms-transform:rotage()
     -webkit-transform:rotage() ;顺时针旋转x度
     -o-transform:rotage()
### 背景图片的大小
    background-size：100 200  ；设置背景图片的长宽，但是需要注意的是该值一定要设置在background之后，否则没有效果
### 子元素绝对定位，父元素高度自适应  
    这是不可以的，因为父元素高度自适应的前提是以文档流布局为基础的，而绝对定位已经脱离了文档流   
    
    
