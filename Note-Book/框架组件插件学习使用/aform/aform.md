reference:[http://xiehuiqi220.github.io/AForm/doc/book/mannual/control.html](http://xiehuiqi220.github.io/AForm/doc/book/mannual/control.html)


###schemaModel

```
设置aform的schemaModel为remote和merge的效果是一样的，都只会渲染render中的字段，local只会渲染fields中的字段

```
### 表单样式（html自有的）
*此处指的是html自己就有的html表单标签，与之对比的是自定义的标签*

在afrom中，我们可以通过轻松的设置控件的defaultValue值，就可以轻松渲染控件的样式

 defaultValue取值|控件样式|示例|注意
 ---- |---- | ----|----
 字符串|input | `a:{defaultValue:"xxx"}`|--
 boolean | checkbox | `b:{defaultValue:true}`|--
 obj | fieldset| `c:{defaultValue:{a:1,b:2}}`|此处的对象只能是简单的字符串，如果想要在fieldset中渲染复杂的控件，那么需要使用`fields`属性去定义复杂的控件
 array |table|`tags: {label: "tags", defaultValue: ["b001", "b002"]}` |--
 
 
####fieldset与select
 
 ```
 c: {
                label: "个人信息",
                fields: {
                    name: {
                        label: "姓名",
                        placeholder: "请输入姓名"

                    },
                    sex: {
                        label: "性别",
                        placeholder: "请输入姓名",
                        type: "select",
                        datalist: [{
                            text: "男",
                            value: "male"
                        }, {
                            text: "女",
                            value: "female"
                        }]


                    }
                }
            }
 ```
 

 