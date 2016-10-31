#Native APP 与内嵌 HTML 页面通信的基本原理探析
### 背景    
 在项目开发过程中，需要在千牛app的内嵌html页面中，调用支付宝的sdk，然后进行支付宝密码验证，验证完毕之后，回调html页面的函数，提交表单数据到后台。其中有两个最主要的环节，1.唤起支付宝；2.支付宝验密之后回调html页面的函数。这两个环节都涉及到了html页面和千牛客户端的交互，交互的实现基于JSBridge。 借此探究一下Native与页面交互的基本原理。

### JSBridge简介    
  在开发中，为了追求开发的效率以及移植的便利性，一些展示性强的页面我们会偏向于使用h5来完成，功能性强的页面我们会偏向于使用native来完成，而一旦使用了H5，为了在H5中尽可能的得到native的体验，我们native层需要暴露一些方法给js调用，比如，弹Toast提醒，弹Dialog，获取照片列表，分享等等，有时候甚至把h5的网络请求放着native去完成，而JSBridge就是使用JS书写的，为H5页面提供了调用Native方法的接口，例如我们使用的butterfly。
     Native 主要分为安卓和IOS两大阵营，我们的JSBridge需要考虑两套系统的差异性，提供统一的调用接口。下面分别介绍安卓和IOS与HTML页面通信的原理。

###  安卓与HTML页面通信
  在android app中，通过将页面嵌在WebView这个控件中，如果java要调用h5页面的js，使用`WebView.loadUrl(“javascript:function()”)`即可，这样，就做到了JSBridge的native层调用h5层的单向通信。但是h5层如何调native层呢?这个过程稍显复杂，android目前有4种方法，具体可[参阅这儿](http://gold.xitu.io/entry/573534f82e958a0069b27646)
下面以其中的`WebChromeClient.onJsPrompt()`为例，部分千牛jsBridge的代码说明通信过程。
千牛的jsBridge代码：
```
function invokeAndroid(){
    var on = this.on;
    var fire = this.fire;
    var _list = this._list;
    var env = androidEnv();
    this['invoke']=function(method,params,cb,timeout){
     // 生成每次请求的id
        var uuid = guid();
//构造向native请求的参数
        var bridge = {
            command:method,
            parameter:params,
            sequence:uuid
        };
        var timer;
//将每次请求的回调进行注册，注册的标识是id
        on(invokeEvent,uuid,function(data){
            if (timer) {
                clearTimeoutFn(timer);
            };
            cb && cb(data);
        },true);

        //android 2.3下，一使用JDY对象就会抛错，这个时候需要调用prompt
        if(env){
            JDY.dispatchEvent(JSON.stringify(bridge));
        }else{
            prompt('dispatchEvent',JSON.stringify(bridge));
        }
        if(!timeout){
            timeout = defaultTimeout;
        }
//设置请求回调超时
        if(timeout > 0){
            timer = setTimeoutFn(function(){
                timer = null;
                fire(invokeEvent,uuid,'timeout');
            },timeout);
        }
    }

    this['callback']=function(uuid,data,stream){// id ,ev ,data
        var cb = null;
        if(stream){
            var listener = _list(invokeEvent,uuid);
            if(listener && listener.length > 0){
                cb = listener[0];
            }
        }
//触发回调
        fire(invokeEvent,uuid,data);
        if(stream && cb){ //如果是stream类型，会收到多次
            on(invokeEvent,uuid,cb,true);
        }
    }

};
```



native和H5页面之间的通信， 其实类比于RPC远程调用，都属于异构系统的交互，H5的js环境和native环境相互进行调用，RPC调用过程中，我们需要指明调用的目标主机，方法名，和参数，此处也是类似，例如千牛JSBridge中的
```
 var bridge = {
            command:method,
            parameter:params,
            sequence:uuid
        };
```
然后我们需要将这些信息发送给native，在WebView有一个方法，叫`setWebChromeClient`，可以设置WebChromeClient对象，而这个对象中有三个方法，分别是`onJsAlert,onJsConfirm,onJsPrompt`，当js调用window对象的对应的方法，即`window.alert，window.confirm，window.prompt`，WebChromeClient对象中的三个方法对应的就会被触发，在千牛的jsBridge中，通过prompt方法来发送信息给native端。

```
  prompt('dispatchEvent',JSON.stringify(bridge));
      
```

熟悉异步编程的同学们都知道，我们调用了远程的方法，或者发起一个请求，例如ajax，我们都需要显示的指定一个回调函数来处理结果，不例外，我们调用native方法后，我们也需要执行我们自己的回调函数，在千牛JSBridge中，通过维护一个HashMap来存储每次请求对应的回调,而事件的触发则是由native通过执行*callback*方法来触发。下面详细介绍整个过程

首先第一步，为每次请求生成id

```
 var uuid = guid();
```
第二步：将每次请求的id和回调进行存储成HashMap的形式（on方法所做的事情），id就是key，回调cb就是value
```
//将回调进行注册
        on(invokeEvent,uuid,function(data){
            if (timer) {
                clearTimeoutFn(timer);
            };
            cb && cb(data);
        },true);
```
第三步：将请求的信息加上请求的id同时发送给客户端：

```
 //android 2.3下，一使用JDY对象就会抛错，这个时候需要调用prompt
        if(env){
            JDY.dispatchEvent(JSON.stringify(bridge));
        }else{
            prompt('dispatchEvent',JSON.stringify(bridge));
        }
        if(!timeout){
            timeout = defaultTimeout;
        }
  }
```
第四步：客户端将请求的结果和id回传给h5，这个回传是通过调用H5页面的callback方法来实现的，在H5页面中有这样的方法：（注意此处的this=TOP.mobile）
```
 this['callback']=function(uuid,data,stream){// id ,ev ,data
        var cb = null;
        if(stream){
            var listener = _list(invokeEvent,uuid);
            if(listener && listener.length > 0){
                cb = listener[0];
            }
        }

        fire(invokeEvent,uuid,data);//执行本次请求对应的回调，同时把data作为参数传入回调
        if(stream && cb){ //如果是stream类型，会收到多次
            on(invokeEvent,uuid,cb,true);
        }
    }

};
```
在native端，将uuid和调用结果拼接成一个字符串`·String str ="javascript:TOP.mobile.callback（'fmd12345',{'success:true,data:{xxx}'})"`,然后`WebView.loadUrl(str)` 来执行这句js代码就执行了H5页面发起请求之后的回调，当然实际情况可能还需要考虑超时等问题。

###  IOS与HTML页面通信
IOS与HTML页面的通信和安卓与HTML页面的通信类似，不同之处有两点，

1.  Native调用H5中的js的方法不同。IOS是通过UIWebView组件的stringByEvaluatingJavaScriptFromString方法来实现的，该方法返回js脚本的执行结果。
```
// Swift
webview.stringByEvaluatingJavaScriptFromString("Math.random()")
// OC
[webView stringByEvaluatingJavaScriptFromString:@"Math.random();"];
```

2. H5页面如何调用native的方法不同。在IOS中，H5页面调用Native，并没有现成的API可以直接拿来用，而是需要间接地通过一些方法来实现。UIWebView有个特性：在UIWebView内发起的所有网络请求，都可以通过delegate函数在Native层得到通知。这样，我们就可以在UIWebView内发起一个自定义的网络请求，通常是这样的格式：`jsbridge://methodName?param1=value1&param2=value2`.
于是在UIWebView的delegate函数中，我们只要发现是jsbridge://开头的地址，就不进行内容的加载，转而执行相应的调用逻辑。
在千牛的JSBridge就是通过创建一个iframe来发起一个请求，该请求的协议就是自定义的"tbsellerplatformbrage",在这个请求中同样指明了调用的方法，请求的id，以及参数。
```
this['invoke']=function(method,params,cb,timeout){

            if(document.body){
                if(!timeout){
                    timeout = defaultTimeout;
                }

                var uuid = guid();
                var timer;
                //构造iframe的src
                var src = 'tbsellerplatformbrage://'+method+'/'+uuid+"?"+param(trim(params));
               //构造iframe，设置src,发起请求
                var execIframe = createExecIframe(src);
                on(invokeEvent,uuid,function(data){
                    if (timer) {
                        clearTimeoutFn(timer);
                    }
                    execIframe && execIframe.parentNode.removeChild(execIframe);
                    execIframe = null;
                    cb && cb(data);
                },true);

                if(timeout > 0){
                    timer = setTimeoutFn(function(){
                        timer = null;
                        fire(invokeEvent,uuid,'timeout');
                    },timeout);
                }
            }else{
                var self = this;
                setTimeout(function(){
                    self.invoke(method,params,cb,timeout);
                },500);
            }
    }
```




