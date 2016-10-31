**问题描述**：

 在低版本的ie（6、7）中，设置内联元素的display：inline-block是有效果的，但是对于块级元素设置，就没有效果

**原因**：

在ie中设置块级元素为display：inline-block，只会触发元素的layout,

**解决方法**：

```
#id{
		display:inline-block;
		*zoom:1;
		*display:inline;/*hack ie7*/
	}
	#id{
		display:inline-block;
		_zoom:1;
		_display:inline;/*hack ie6*/
	}

```