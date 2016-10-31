### 模块的定义(工厂模式)
  
    define(id,deps,factory);
    deps：模块的依赖，可能是模块名，路径，alias
    
    
模块的定义，模块依赖的解析，（依赖名的处理-->路径的处理-->模块文件的加载处理）      

### 应用的一些知识点：
#### 自定义事件（event）
#### js原型和静态方法（Module）的使用，为什么要这么用？
#### 使用配置config来管理有关模块名缩写的问题

####lofty
lofty/lang/base.js   

```
define( 'lofty/lang/base', ['lofty/lang/class', 
							'lofty/lang/attribute',
							'lofty/lang/observer',
							'lofty/lang/pluginhost'],
	function(Class, Attribute, observer, PluginHost){
	'use strict';
	
    /* helper */
    var mixin = function( target, src ){
        
        var val, name;
        
        src = src.prototype || src;
        
        for ( name in src ){
            val = src[name];
            if ( val !== undefined ){
                target[name] = val;
            }
        }
    };
    
    
    var Base = Class({
		init: function( config ){
			
			this.initOptions( config );
			
			if( config && config.plugins ){
				this.install( config.plugins );
			}
		},
		
		destroy: function(){
				
			this.uninstall();
			
			this.off();
			
			for ( var key in this ){
				if ( this.hasOwnProperty( key ) ){
					delete this[key];
				}
			}
		}
    });
    
    /* 混入attr原型方法 */
    mixin( Base.prototype, Attribute );
    /* 混入pluginHost原型方法 */
    mixin( Base.prototype, PluginHost );
	/* 混入observer原型方法，增加观察者/自定义事件的支持 */
	observer.mixTo( Base.prototype );
	
	return Base;
	
} );
```
