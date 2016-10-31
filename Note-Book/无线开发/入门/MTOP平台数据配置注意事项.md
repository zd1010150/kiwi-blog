1. mtop配置文件，不能含有boolean类型的字段，无论配置或者不配置，该字段都不起效果
2. 所有的integer类型的默认值是null

```
"orderId" : {
      "type" : "integer",
      "required" : false,
      "description" : "orderId",
      "default" : null
    }
    
```