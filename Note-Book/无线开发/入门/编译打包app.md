1. `node --harmony wing-tools/bin/wing build trade --base`打包应用，不区分ios ，android。最后生成wz包。
2. 使用主客扫描该地址`http://10.19.200.221:10000/trade/dist/trade-base-0.3.12.wz#product`  由`ip:port/package-path#product` 组成。

**	NOTE**： 安装包以前，需要注意（pwd:wx1688syycjf）

     1. 打开无线的`灰度安装插件`功能，
  
     2. 并且要打开spdy降级，spdy就是针对是采用http还是https协议
  
     3. 线上环境和测试环境都可以
####切换了app的环境之后，需要修改版本号，重新打包，重新扫码安装


  