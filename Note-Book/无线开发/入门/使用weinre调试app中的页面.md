1.本地安装weinre，开启服务

    1.sudo tnpm install weinre -g
    2. weinre -httpPort 8087 --bound 10.19.201.58 --deathTimeout 24  ；注意后面是本机的ip地址,设置deathTimeout
  			
  			weinre -httpPort 8087 --bound 30.34.138.122 --deathTimeout 24000

            <script src="http://30.34.138.122:8087/target/target-script-min.js"></script>
2.在项目中的index。html中加入script脚本

     <script src="http://10.19.200.221:8087/target/target-script-min.js"></script>
     
3.关闭主客的https访问模式