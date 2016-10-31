```
只有一个运单,并且没有物流，时的数据结构：

logistics:{
	logisticsBillCount:1,   
	logisticsBills:{
				nologistics:{    //如果该运单没有物流，那么就需要返回这个字段
					nologisticsCondition:0, //没有物流信息的标识码，取值是0-5
					sendTime：2012-2-3 13：30：33 //该运单的发货时间
				}
	
	},

}

只有一个运单,并且有物流，时的数据结构

logistics:{
	logisticsBillCount:1,   
	logisticsBills:{
				nologistics:{    //如果该运单没有物流，那么就需要返回这个字段
					
				}
	
	},

}


一个订单有多个运单时的数据结构：

logistics:{
	logisticsBillCount:2 //多个运单，那么该数量取值大于1   
}
```