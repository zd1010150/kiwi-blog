### domReady的事件<https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp?hl=zh-cn>
JQ的domReady事件，在浏览器中以原生的DOMContentLoaded事件的形式被支持。表示的是dom加载完成而资源加载开始之前触发的。
原生的onload事件则是所有资源都加载完成之后触发的。

domProcessing-->domInteractive(DOM就绪)-->domContentLoad（DOM&&CSSOM就绪，开始构建呈现树）-->domComplete（网页标记及其附加资源都已完成）-->loadEvent