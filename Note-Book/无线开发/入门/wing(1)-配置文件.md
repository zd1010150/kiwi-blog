###config中的各种配置文件
**tips：**所有的配置信息，都可以通过`Wing.app.productInfo.config.配置文件名.key`来获取

####remote.json
*****
在remote.json中配置可以远程调用的模块白名单，例如doit中配置了这些模块
,那么在其他的项目中，就可以通过`wing.view('doit:modules/newHeader/view',{data})`,不在此配置的模块，其他项目不能远程调用

```
{
    "whiteList": [
     "modules/pageLoading/view",
     "modules/webviewDialog/view",
     "modules/webviewDialog/main",
     "modules/header/view",
     "modules/header/header",
     "modules/backBtn/view",
     "modules/moreBtn/view",
     "modules/footer/view",
     "modules/newHeader/view",
     "modules/title/view"

    ]
}
```
####wing.json
*****
配置web层的一些功能，例如assetAware：true表示加载view的时候，是否自动加载响应的css和js。
####urls.json&urls.development.json
*****
是自己配置的两个文件，创建相应的developement文件，那么在开发阶段的时候，就会读取development里面的配置，而在正式的时候读取urls.json里的配置