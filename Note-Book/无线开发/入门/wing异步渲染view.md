###渲染方法
`wing.app.view`,`wing.app.render`

```
Wing.app.view(info, options)

渲染一个view，返回一个defer对象。

//请求参数
var param = {
  page: 2
}

//Wing.app.view 默认会带上url中的query参数; Wing.app.action 不会带上
var defer = Wing.app.view('pages/demo/view', {
  data: param
});

defer.done(function(html, o) {
  console.log(html);  // html就是渲染结果
  console.log(o);     // 更详细的信息，如assetss等，这样就可以动态加载依赖的js/css资源
});
```
**tips:**

* wing.app.render和wing.app.view 类似,只不过前者不会指向ds逻辑，而是由options指定数据

* wing.app.view 里面的参数回去请求相应的view，此处是view的路径，而wing.app.action里面的请求参数是一个ds的路径。