### 异步编程 & 响应式编程
#### 异步编程
对于异步编程并不陌生，DOM事件处理，ajax请求都是典型的异步编程，例如鼠标点击按钮，我们在页面中通过DOM提供的事件接口（addEventListener|attachEvent）添加事件处理函数（handler），然后我们的线程去做其他事情了，在未来的某个时间点，按钮被点击，事件处理函数被执行，在这个过程中，事件处理函数不是由它在程序中所处的位置决定何时运行的，而是在未来的某个时间点被点击事件触发执行，ajax请求也是类似，由于网络情况的不稳定，不知道某个请求的响应何时到达客户端，在jquery中我们通过给ajax请求传递一个success回调函数（类似于事件处理函数），响应成功到达（时间点）客户端（事件）的时候，success函数被执行。在业务情况不复杂的时候，我们使用事件接口处理dom事件，或者使用回调函数处理ajax异步请求，就够了，但是一旦业务变得复杂，情况也许就没有容易处理了，例如在处理复杂异步请求的探索过程中，我们探索的promise 解决方案。

想象一下有这样一个页面，页面需要首先发起一个异步请求，获取后续请求列表的url前缀，然后拼接url发起两个异步请求，分别获取列表和配置文件，只有当列表和配置文件都获取到之后，并且页面加载完毕之后，才渲染列表，代码如下：

```
function(window, $, showMovieLists, showError) {
	var error,
		configDone,
		movieLists,
		queueList,
		windowLoaded,
		outputDisplayed,
		errorHandler = function() {
			// Otherwise show the error.
			error = "There was a connectivity error";

			// We may be ready to display out
			tryToDisplayOutput();
		},
		tryToDisplayOutput = function() {
			if (outputDisplayed) {
				return;
			}
			if (windowLoaded) {
				if (configDone && movieLists !== undefined) {
					if (queueList !== undefined) {
						movieLists.push(queueList);
					}
					outputDisplayed = true;
					showMovieLists(JSON.stringify(movieLists));
				}
				else if (error) {
					outputDisplayed = true;
					showError(error);
				}
			}
		},
		windowLoadHandler = function() {
			windowLoaded = true;

			// Remember to unsubscribe from events
			window.removeEventListener("load", windowLoadHandler);

			// This may be the last task we're waiting on, so try and display output.
			tryToDisplayOutput();
		};

	// Register for the load event
	window.addEventListener("load", windowLoadHandler);

	// Request the service url prefix for the users AB test
	$.getJSON(
		"http://api-global.netflix.com/abTestInformation",
		{
			success: function(abTestInformation) {
				// Request the member's config information to determine whether their instant
				// queue should be displayed.
				$.getJSON(
					"http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/config",
					{
						success: function(config) {
							// Parallel retrieval of movie list could've failed,
							// in which case we don't want to issue this call.
							if (!error) {
								// If we're supposed to
								if (config.showInstantQueue) {
									$.getJSON(
										"http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/queue",
										{
											success: function(queueMessage) {
												queueList = queueMessage.list;

												configDone = true;
												tryToDisplayOutput();
											},
											error: errorHandler
										});
								}
								else {
									configDone = true;
									tryToDisplayOutput();
								}
							}
						},
						error: errorHandler
					});

				// Retrieve the movie list
				$.getJSON(
					"http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/movieLists",
					{
						success: function(movieListMessage) {
							movieLists = movieListMessage.list;
							tryToDisplayOutput();
						},
						error: errorHandler
					});
			},
			error: errorHandler
		});
}
		
```
略显复杂，为了监控页面加载，同时拉取列表和拉取配置文件，加入了多个条件标志位判断。代码的可读性也不是很强，略显复杂。
#### 响应式编程
响应式编程所要解决的问题和异步编程所要解决的问题是一样的，但是解决问题的思想却是不同的。响应式编程的精华在于响应和事件流，它融合了观察者模式，迭代器模型和函数式编程。
 
在响应式编程中，我们监视事件，然后做出响应（观察者模式）。 这一点其实很相似订阅简讯。 当您订阅Web上发布的新闻，您得提供您的电子邮件地址，每次有新的时事通讯时候，您的电子邮件地址将得到该新闻的一个副本。 同样，我们使用某个函数订阅事件流，每当有一个新的事件时，流将激活这个函数，以使我们的代码能够对事件作出响应。 在这个比喻中，新闻通讯平台是事件流，电子报的每一个新闻是一个事件，电子邮件是您使用订阅事件流的函数。响应式编程就是因为我们得“响应”这些事件而得以命名。

响应式编程中，将这些事件流和数组进行类比，可以通过对数组进行迭代操作，从而到达控制事件执行的目的。 和数组不同的是，数组是在空间值的序列，对数组的操作都是同步的，例如map操作，我们知道每一次映射操作的入参；事件流是随时间的值的序列，例如鼠标移动事件产生的一系列事件对象构成的一个序列，这个序列产生的时间点是未知的，但是却可以抽象成数组，构成事件流。

在响应式编程中，所有函数操作都可以针对一个数组阵列上 - 比如filter，reduce，mapping，reduce，zip - 也可以在事件流完成！ 我们可以过滤的事件流，reduce合并事件流的值，将事件流映射到另一个另外一个，结合组合事件流，将一个流的输入输出到另一个。

### Rx JS

响应式编程是一种编程模型，模型的具体实现语言有很多种，目前有java,.net 等等，这儿只是介绍javascript的响应式编程实现，（目前微软的响应式编程js库 [Rxjs](https://github.com/Reactive-Extensions/RxJS)），前面提到了，在响应式编程中，事件流和数组进行类比，所以下面首先会提一下数组的操作，然后介绍如何用响应式编程处理dom事件和ajax异步请求。
#### 数组的操作
此处介绍的数组操作，和javascript中的操作都尽可能的避免使用索引去实现。所有的方法都返回数组，这样就可以实现链式调用。

* foreach 原生的数组方法，用于遍历数组,表示对每一个数组项需要进行的操作
* map，就是数学上的函数（又名映射），将数组中的项，通过一个映射变成另一个值，返回由新值构成的数组。

```
Array.prototype.map = function(projectionFunction) {
	var results = [];
	this.forEach(function(itemInArray) {
		results.push(projectionFunction(itemInArray));

	});

	return results;
};

```

* filter，通过传入一个过滤函数，返回满足条件的数组项构成的数组。

```
Array.prototype.filter = function(predicateFunction) {
	var results = [];
	this.forEach(function(itemInArray) {
	  if (predicateFunction(itemInArray)) {
		results.push(itemInArray);
	  }
	});

	return results;
};

```
* concatAll,将二维数组扁平化诚一个数组，这样就可以进行对树状的数组结构进行操作。例如`[[1,2,3],4,[5,6]].cacatAll === [1,2,3,4,5,6]`

```
Array.prototype.concatAll = function() {
	var results = [];
	this.forEach(function(subArray) {
		results.push.apply(results, subArray);
	});

	return results;
};
```

* concatMap,首先对二维数组项进行map操作，然后扁平化（concatAll）数组。

```
Array.prototype.concatMap = function(projectionFunctionThatReturnsArray) {
	return this.
		map(function(item) {
			return projectionFunctionThatReturnsArray(item);
		}).
		concatAll();
};
```

* reduce，按照数组的索引顺序，依次迭代递归数组；此方法有两个参数，第一个参数是一个迭代函数，该迭代函数有两个形参，第一个表示的是数组项进行迭代的值构成的数组，而第二个参数是当前遍历的数组项。reduce的第二个参数，可选，是迭代函数的初始值。

```
// [1,2,3].reduce(function(accumulatedValue, currentValue) { return accumulatedValue + currentValue; }); === [6];
// [1,2,3].reduce(function(accumulatedValue, currentValue) { return accumulatedValue + currentValue; }, 10); === [16];

Array.prototype.reduce = function(combiner, initialValue) {
	var counter,
		accumulatedValue;

	// If the array is empty, do nothing
	if (this.length === 0) {
		return this;
	}
	else {
		// If the user didn't pass an initial value, use the first item.
		if (arguments.length === 1) {
			counter = 1;
			accumulatedValue = this[0];
		}
		else if (arguments.length >= 2) {
			counter = 0;
			accumulatedValue = initialValue;
		}
		else {
			throw "Invalid arguments.";
		}

		// Loop through the array, feeding the current value and the result of
		// the previous computation back into the combiner function until
		// we've exhausted the entire array and are left with only one function.
		while(counter < this.length) {
			accumulatedValue = combiner(accumulatedValue, this[counter])
			counter++;
		}

		return [accumulatedValue];
	}
};
		
```

* zip。对两个数组的数组项一一对应的进行combin操作，返回combin操作的值构成的数组。

```
Array.zip = function(left, right, combinerFunction) {
	var counter,
		results = [];

	for(counter = 0; counter < Math.min(left.length, right.length); counter++) {
		results.push(combinerFunction(left[counter],right[counter]));
	}

	return results;
};
   
```

以上的五个操作可以混合链式调用，几乎可以处理绝大多数的数组问题。
#### DOM事件的响应式处理
假如目前需要模拟鼠标拖拽的事件，其实dom事件原生并没有拖拽事件，mousedown事件，如果在随后发生的mouseup事件之前，发生了mousemove事件，就可以将mousedown和mouseup之间的整个过程视为触发了拖拽事件。

所有的鼠标事件的mouseEvent都含有pageX，pageY，offsetX,offsetY这些属性，在事件触发的时候，其实就是产生了一系列的mouseEvent对象，将这些mouseEvent对象视为一个数组，这个数组是随着鼠标事件发生的时间不断增长，形成了这样一个数组，
`[ {pageX: 22, pageY: 3423, offsetX: 14, offsetY: 22} ,,,{pageX: 30, pageY: 3500, offsetX: 14, offsetY: 22},,,,,,{pageX: 100, pageY: 2500, offsetX: 14, offsetY: 22} ,,,]`

其中的,,,表示一秒钟。类似于事件流。

**遍历数组对象和dom事件触发回调函数执行有什么区别呢？**

*  相同点：遍历数组是把数据项传入回调函数，执行回调函数。而dom事件将事件对象传入回调函数；

* 不同点：遍历数组的时候，我们明确的知道遍历的下一个数据项的值，但是对于dom操作，不知道下一次dom事件什么时候发生，如果不移除事件处理函数，那么遍历的事件流就不会结束。前者是同步的，而后者是异步的。

我们把dom事件流看成一个数组，这个数组的每一个数据项之间间隔的时间点是不一样的，并且该数组可能有无数个数据项，不会结束，然后采用操作数组的方式来操作事件流。

在Rxjs中，提供了`Observable.fromEvent(dom, "mouseMove"),`,通过这个方法，可以获得dom事件的事件对象构成的数组。Observables 提供了两个很有用的方法 `take,takeUntil`方法，take是用来控制事件发生的次数，而observer1.takeUntil(observer2)是获取observer2发生之前的observer1
。

例如一个按钮的点击事件的处理函数只能执行一次，可以如下的方式实现：注意其中传递给forEach的回调就是点击事件发生时的处理函数。

```
var buttonClickObserver = Observable.fromEvent(document.getElementById("btn1"), "click");
buttonClickObserver.take(1).forEach(function(e){
	console.log("我已经被点击一次了。不能再点了");
});
```
例如上面的鼠标拖拽事件：其中的sprite就是被拖拽的目标，而spriteContainer就是可以拖拽目标所在的可拖拽区域，其中有*spriteContainerMouseMoves.takeUntil(spriteContainerMouseUps);* 就是获取鼠标up事件之前的鼠标move事件流

```
function(sprite, spriteContainer) {
	var spriteMouseDowns = Observable.fromEvent(sprite, "mousedown"),
		spriteContainerMouseMoves = Observable.fromEvent(spriteContainer, "mousemove"),
		spriteContainerMouseUps = Observable.fromEvent(spriteContainer, "mouseup"),
		spriteMouseDrags =
			// For every mouse down event on the sprite...
			spriteMouseDowns.
				concatMap(function(contactPoint) {
					// ...retrieve all the mouse move events on the sprite container...
					return spriteContainerMouseMoves.
						// ...until a mouse up event occurs.
						takeUntil(spriteContainerMouseUps);
				});

	// For each mouse drag event, move the sprite to the absolute page position.
	spriteMouseDrags.forEach(function(dragPoint) {
		sprite.style.left = dragPoint.pageX + "px";
		sprite.style.top = dragPoint.pageY + "px";
	});
}
     
```

#### ajax异步请求的响应式处理

ajax的异步请求也可以看成是由异步请求结果构成的响应流，和dom事件流不一样，发起一个ajax异步请求一般情况下就对应一个响应结果，把这个响应结果看成只有一个数据项的数组。

rxjs中有一个*Observable.create(function(observer){})*方法，用于创建一个异步请求的响应流，注意传入的是一个函数，函数的形参是observer，这个observer是一个对象，该对象有三个方法onNext，onComplete，onError，onNext用于将数据发送给回调函数用于消费，onComplete用于完成异步请求，onError当请求发生错误时。注意返回的是移除监听的函数。

`getJSON("http://api-global.netflix.com/abTestInformation").
			forEach(function（onNext,onComplete,onError）{}）`传入的是3个函数。
			
```
var getJSON = function(url) {
		return Observable.create(function(observer) {
			var subscribed = true;

			$.getJSON(url,
				{
					success:
						function(data) {
							// If client is still interested in the results, send them.
							if (subscribed) {
								// Send data to the client
								observer.onNext(data);
								// Immediately complete the sequence
								observer.onCompleted();
							}
						},
					error: function(ex) {
						// If client is still interested in the results, send them.
						if (subscribed) {
							// Inform the client that an error occurred.
							observer.onError(ex);
						}
					}
				});

			// Definition of the Subscription objects dispose() method.
			return function() {
				subscribed = false;
			}
		});
	};

	var subscription =
		getJSON("http://api-global.netflix.com/abTestInformation").
			forEach(
				// observer.onNext()
				function(data) {
					alert(JSON.stringify(data));
				},
				// observer.onError()
				function(err) {
					alert(err)
				},
				// observer.onCompleted()
				function() {
					alert("The asynchronous operation has completed.")
				});
```
文章一开始的那个问题，就可以改写成一下的形式：将几个observable组合起来，包括异步请求的observable和页面加载事件的obervable，少了很多标志位，看起来也清晰很多

```
 function(window, getJSON, showMovieLists, showError) {
	var movieListsSequence =
		Observable.zip(
			getJSON("http://api-global.netflix.com/abTestInformation").
				concatMap(function(abTestInformation) {
					return Observable.zip(
						getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/config").
							concatMap(function(config) {
								if (config.showInstantQueue) {
									return getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/queue").
										map(function(queueMessage) {
											return queueMessage.list;
										});
								}
								else {
									return Observable.returnValue(undefined);
								}
							}),
						getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/movieLists"),
						function(queue, movieListsMessage) {
							var copyOfMovieLists = Object.create(movieListsMessage.list);
							if (queue !== undefined) {
								copyOfMovieLists.push(queue);
							}

							return copyOfMovieLists;
						});
				}),
			Observable.fromEvent(window, "load"),
			function(movieLists, loadEvent) {
				return movieLists;
			});

	movieListsSequence.
		forEach(
			function(movieLists) {
				showMovieLists(movieLists);
			},
			function(err) {
				showError(err);
			});
}
```


* We can traverse Observables using forEach().
* We can use fromEvent() to convert Events into Observables that never complete.
* We can apply take() and takeUntil() to an Observable to create a new sequence which does complete.


**So how do we convert a callback API into an Observable sequence?** Unfortunately, because callback-based APIs vary so much in their interfaces, we can't create a conversion function like we did with fromEvent(). However there is a more flexible function we can use to build Observable sequences...

** Observable.create() is powerful enough to convert any asynchronous API into an Observable.**  Observable.create() relies on the fact that all asynchronous APIs have the following semantics:

* The client needs to be able to receive data.
* The client needs to be able to receive error information.
* The client needs to be able to be alerted that the operation is complete.
* The client needs to be able to indicate that they're no longer interested in the 
result of the operation.

```
响应式编程：
```
响应式编程(Reactive Programming 或称反应式编程)是一种流行的编程方法，编写代码是基于对变化的反应。它的灵感来自于我们的日常生活，也即我们如何采取行动以及与他人沟通。

我们在执行日常生活活动时，我们会尽可能多任务，但大脑无法处理多任务，不管我们如何努力去做。我们人类实现多任务的唯一办法是在时间线上在任务之间切换。事实上，我们总是切换任务，即使我们没有意识到它。

例如，要执行一个任务：在星巴克喝一杯咖啡饮料，你需要发出一个命令，等待它准备好，然后接受你的饮料。当你在等待的时候，你很可能会找到别的事情做。这是最简单的执行任务的反应(响应)形式，你会在你等待来自咖啡师的“响应”时做别的事情，当你的咖啡已经准备好后，会叫你的名字时。

响应编程能够简化编程，它依赖于事件，代码运行的顺序不是代码行的顺序，而是和一个以上的事件有关，这些事件发生是以随着时间的推移的序列。我们把这一系列事件称为“流”。

何为事件？例如，你知道某个名人总是在发送有趣微博，每次他推发一条微博我们可以称之为一个“事件”。如果你看看这位名人微博系列，你会发现其实是一个随着时间的推移（一系列的事件）发生的一序列的“事件”。

响应式编程就是因为我们得“响应”这些事件而得以命名。例如，想象一下，你在等待某人发送一个很酷商品的促销码，当这条促销码发出时，你会立即响应，去购买这个很酷的商品。这正是什么响应性编程的原理。

为了能够对事件作出反应，我们必须要监督它。 如果我们没有监听的情况下，我们永远不会知道什么时候它会有事件反应。 在微博上，可以设置监测微博的事件，我们遵循简并设置我们的电话，每次她发微博事件时就会第一时间通知我们。 

在响应式编程中，监视事件被称为侦听或订阅该事件。 这一点其实很相似订阅简讯。 当您订阅Web上发布的新闻，您得提供您的电子邮件地址，每次有新的时事通讯时候，您的电子邮件地址将得到该新闻的一个副本。 同样，我们使用某个函数订阅事件流，每当有一个新的事件时，流将激活这个函数，以使我们的代码能够对事件作出响应。 在这个比喻中，新闻通讯平台是事件流，电子报的每一个新闻是一个事件，你的电子邮件是您使用订阅事件流的函数。

现在想象一个动态的通讯，您可以选择主题，并只会发送匹配主题的新闻项目。 你可根据自己的喜好过滤的通讯新闻，而这一点我们可以在事件流做的一样好。 想像你已经使用不同的电子邮件地址订阅多个通讯，以及后来决定你想要的通讯的所有新闻发送到一个新的单电子邮件地址。 简单可以做的是设置通讯新闻发送到新的电子邮件地址的转发邮件规则。 我们可以用事件流同样做到。

** 将事件流可以和通常数组比较。 他们其实很相似。 数组是在空间值的序列，而事件流是随时间的值的序列。 **在响应式编程中，所有函数操作都可以针对一个数组阵列上 - 比如过滤，reduce，mapping，结合，管道 - 也可以在事件流完成！ 我们可以过滤的事件流，reduce合并事件流的值，将事件流映射到另一个另外一个，结合组合事件流，将一个流的输入输出到另一个。