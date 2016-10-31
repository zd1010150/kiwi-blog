1. `mocha [directoryname] --recursive`如果省略directory，就会默认执行test目录下的测试用例
2. 在mocha命令中可以使用shell通配符和node通配符，这两者是不一样的。

```
shell 通配符：mocha test/{,**/}*.{js,jsx}
node 通配符 ： mocha 'test/**/*.@(js|jsx)' ;注意此处的node通配符是由单引号引起来的
```
3.  `mocha --compilers js:bable-core/register` 可以使用compilers进行测试脚本的编译，但是必须注意，如果使用的是全局的mocha，那么转换器 babel-core，babel-preset-es2015 都需要安装成全局的
4.  

```
Babel默认不会对Iterator、Generator、Promise、Map、Set等全局对象，以及一些全局对象的方法（比如Object.assign）转码。如果你想要对这些对象转码，就要安装babel-polyfill。
```