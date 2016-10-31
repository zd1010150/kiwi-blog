 ### 2. 基本输出格式规范

输出的json字符串如下：

##### 2.1 成功，但不带数据域的情况
```
条件：isSuccess = true
      json结果:{"success" : true}
      jsonp结果：callback({"success" : true}),下面的jsonp结果集类似，以此类推
```

##### 2.2 成功，带数据域的情况
```
条件：isSuccess = true, data != null
      结果:{
           "success" : true,
           "data" : {
               "currentPage" : 1,
               "pageSize" : 10,
               "totalCount" : 3,
               "offerList" : [
                       {
                           "detailUrl" : "http://img.china.alibaba.com/img/ibank/2013/567/525/818525765_106232967.summ.jpg",
                           "offerId" : 1245253679,
                           "price" : 1,
                           "title" : "阿里巴巴测试数据（卖家承担服务费）"
                       },
                       {
                           "detailUrl" : "http://img.china.alibaba.com/img/ibank/2013/567/525/818525765_106232967.summ.jpg",
                           "offerId" : 1245253679,
                           "price" : 1,
                           "title" : "阿里巴巴测试数据（卖家承担服务费）"
                       } ]
           }
       }
```

##### 2.3 失败，不带数据域的情况
```
条件：isSuccess=false, errorCode != null, errorMessage != null
      结果:{
           "success" : false,
           "errorCode" : "GENERIC_FAILURE",
           "errorMessage" : "执行命令失败"
       }
```

##### 2.4 失败，带数据域的情况
```
条件：isSuccess=false, errorCode != null, errorMessage != null, data != null
      结果:{
           "success" : false,
           "errorCode" : "GENERIC_FAILURE",
           "errorMessage" : "执行命令失败",
           "data" : {
               "totalCount" : 2,
               "offerList" : [
                       {
                           "detailUrl" : "http://img.china.alibaba.com/img/ibank/2013/567/525/818525765_106232967.summ.jpg",
                           "offerId" : 1245253679,
                           "price" : 1,
                           "title" : "阿里巴巴测试数据（卖家承担服务费）"
                       },
                       {
                           "detailUrl" : "http://img.china.alibaba.com/img/ibank/2013/567/525/818525765_106232967.summ.jpg",
                           "offerId" : 1245253679,
                           "price" : 1,
                           "title" : "阿里巴巴测试数据（卖家承担服务费）"
                       } ]
           }
       }
```
注：
* 所有数据域全部包含在data内，与success并行的仅可以是errorCode、errorMessage、data，其余任何内容统一放入data内进行包装;
* 当success为false时，尽量将errorCode与errorMessage带上，无论前端是否使用到，后端都应该带上这两项内容;
* 当success为true时，请勿带上errorCode与errorMessage，若需带上这两项，success应该置为false，避免引起后续维护人员理解上的困难，若实在有这样的需求，应该考虑通过data内包装相应的内容。
