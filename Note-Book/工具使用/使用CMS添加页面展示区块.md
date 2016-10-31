##两类CMS模板添加方式

###1.通过external方式
**优点：**能在测试或者线上都可以进行验证

**缺点：**不能设置展示时间段；不会立即生效，修改之后，有时延
###2.通过js引入
**优点：**可以设置展示的时间段；会立即生效，不会有显示的时间差

**缺点：**只能在线上或者预发验证效果

**第一种方式的实现步骤**

1. 在cms里新建页面位置
   
   分为三步：
   			
   			1.建立区块（id）>>选择『用于展示规则的模板』
   			
   			2.建立页面规则（id_rule）>> 时间尽量设置长
   			
   			3.建立页面位置（id_pos）>>选择调用方法为『js』
   			
   			4.审核通过所有的区块，页面位置，页面规则
   			
   			
2. 在页面中引入js和css，html中引入CMS页面位置

```
**merge.js**

/*顶部通知渲染js的引擎*/
ImportJavscript.url('//astyle-src.alicdn.com/sys/js/trace/cms/drive-min.js');

/*顶部通知关闭js*/
ImportJavscript.url('//astyle-src.alicdn.com/app/trade/js/module/notice-support.js');

**done.js**
define(['module/notice-support'],function(){
		noticeSupport($('#app-content'));
	}
)

**merge.css**
@import url("//astyle-src.alicdn.com/app/trade/css/just/mod/admin-notice.css");

**html**
`<div style="display:none" class="dcms-position-beacon-js" data-url="//dcms.1688.com/open/pos/$id_pos.htm"></div>`
使用页面位置的id来替换url中的$id_pos

```



