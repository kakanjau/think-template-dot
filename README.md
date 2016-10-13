# think-template-dot

## 安装

```
npm install think-template-dot
```

## 配置

### 注册 adapter

// src/bootstrap/adapter.js
import doTAdapter from 'think-template-dot';

doTAdapter.reconfig(def, dot) {
  def.env = 'product';
  def.xx = xxx;

  dot.filter.filter1 = function() {};
};

think.adapter('template', 'dot', doTAdapter);

#### doTAdapter.reconfig 

函数接受两个参数：
- def: 替换doT模板的compile阶段参数def
- dot: 替换doT模板的run-time阶段使用的global.dot对象

提供这个函数有2个目的：
1. thinkjs推荐的在`view.js`的`adapter`中配置`prerender`函数的方式，在每次页面请求渲染时都会被调用，效率不高
2. 启用`cache_compile`缓存后，会缓存dot经过compile之后的模板，在执行compile之前，将一些短时间内不会变的系统参数通过本函数存入def中，在页面渲染时根据def参数生成对应的模板缓存，之后再次有页面渲染请求，直接取用缓存即可，提高页面渲染效率。**本函数被调用后，由于def变量会被修改，所以会清空模板的缓存数据**

> 推荐在配置中开启`cache_compile`，并且在模板编写时，根据业务情况，区分哪些是与用户无关切不频繁变更的数据，将这些数据提前存入def变量中，并在模板中通过`{{# }}`这样的compile时变量插入，能进一步提高渲染效率


### 配置 view

```
// src/config/view.js
export default {
    type: 'dot',
    content_type: 'text/html',
    file_ext: '.html',
    file_depr: '_',
    root_path: think.ROOT_PATH + '/view',
    adapter: {
        dot: {
            cache_compile: true, // 启用模板缓存
            strip: false, // 禁用dot模板的strip功能
            prerender: function(doT, def, dot){
                dot.filter.filter1 = function() {};
            }
        }
    }
}
```

#### adapter.dot 

adapter.dot中可以配置doT模板的templateSettings。
默认的templateSettings如下：
```
{
  evaluate:    /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode:      /\{\{!([\s\S]+?)\}\}/g,
  use:         /\{\{#([\s\S]+?)\}\}/g,
  define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: 'it',
  strip: true,
  append: true,
  selfcontained: false
}
```

#### adapter.dot.cache_compile

配置dot模板启用缓存。dot模板本身的渲染分为compile和run-time两个阶段，这里缓存的是compile之后的内容，即`doT.template(template, optioin, def)`之后的内容。  

由于thinkJs的视图功能不区分这两个阶段，所以在compile阶段时，def没办法实时传参。因此提供了`doTAdapter.reconfig`方法来进行统一配置。事例参考上面的**注册 adapter**


#### adapter.dot.prerender

prerender传入三个参数：

- doT：及doT模板插件对象
- def：doT模板预编译时传入的参数
  这里没有提供预编译这一步骤，所以def主要作为针对所有模板提供预编译的函数支持，默认加入了`def.loadfile`方法，可以在模板中通过`{{#def.loadfile('filepath')}}`的方式载入模板
- dot: global.dot命名空间，可以将一些全局变量、方法如（过滤器）存入，方便模板使用：`{{=dot.filter.filter1(it.array)}}`

# dot 模板使用入门

doT是一个性能非常高的JavaScript模板，可以用于nodeJs和web端。 该项目在github上开源：[github.com/olado/doT](github.com/olado/doT)，官网内容相对简单，国内也没有太过详细的使用说明（可能是因为上手确实太简单了）。

由于官网文档对于如何在node端和web端使用doT说明的比较详细，这里就不再赘述。重点说明一下doT的编译和语法。

## doT compile

doT渲染模板分为2个阶段，这一点从它的使用方法中也能看出来：

``` javascript
var tempFn = doT.template(“<div>{{= it.foo}}</div>”);
var resultText = tempFn({foo: ‘hello world'});
```

这一点是与其他主流的模板引擎不同的。
在compile阶段，可以依赖其他模板文件，缓存模板等操作。还可以传入参数，通过条件判断生成模板内容。
在页面载入或是服务器启动时，根据一些环境变量或其他条件预先编译模板，可以进一步提高模板渲染是的效率。

`doT.template`方法的第2个参数为配置项，第3个参数为编译时可接收的参数，参数在模板中被默认存储在`def`对象下，具体用法在`{{#}}`语法中介绍。

`doT.template`方法返回值为`function`类型：`tempFn`，`tempFn`接收的参数是模板渲染时可传入的数据（与前面编译时的数据不是同一份数据）。该数据在模板中被默认存储在`it`对象下具体用法在`{{}}`和`{{=}}`等语法中都会介绍。

## 默认语法

下面的例子以web客户端为运行环境，例子中调用的全局变量的例子都是Bom下的window对象内容。如果是nodejs，则对应的全局变量有差异，但道理是一样的。  
> 提供一个比较简单的doT模板在线编辑网站：[kakanjau.github.io/dot](kakanjau.github.io/dot)

### {{ }}

{{ }} interpolation 代码片段  
{{ }} 的用法非常灵活，里面可以直接写js语句。定义的变量可以直接在`{{= }}`中调用。也可以调用通过`tempFn`传入的数据(数据默认放在it对象内)。

``` html
// 模板字符串：
{{
  var a = 1;
   it.a = a + 1;
}}

{{= a}} //  a 输出 1
{{= it.a}}  // it.a 输出 2
```

也可以定义函数。并在其他的`{{}}` 区块内调用：

``` html
// 模板字符串：
{{
 function fn() {
   return 123
 }
}}

{{= fn()}} //  fn 输出 123

也可以直接运行匿名函数
{{
  (function() {
    it.b = 123
  })();
}}

{{= it.b}} // it.b通过直接执行的匿名函数赋值为123
```

`{{}}`中的代码块随时可以被打断，插入dom片段等html内容：

``` html
// 模板字符串：
{{
  var a = 3;
  if(a > 2) {
}}
  a的值大于2
{{
  } else {
}}
  a的值小于2
{{
 }
}}

```

此外，`{{}}`中也可以直接调用全局对象下的函数或变量。可以以此特点实现比较复杂的功能（通过专用的命名空间给doT模板提供一些过滤器等特色的支持等）。

> ! 如果在`tempFn`函数的调用中不传参数或者传入的是`undefined`等空对象，则doT不会实例化`it`对象。此时在`{{}}`中赋值的it对象的值，`{{=}}`中无法拿到（js的值引用问题）。

### {{= }}

{{= }} evaluation 输出表达式  
`{{= }}` 将其中的内容直接输出到html中。其中可以是在`{{ }}`中定义的变量、通过函数传入在`it`中的变量、也可以是全局变量、甚至可以是一个立即执行的function的返回结果。
可以简单的理解为可以获取特定作用于下变量的单行js语句：

``` html
// 模板字符串：
{{
  it.a = 1;
  a = 2;
}}
{{= it.a}} it.a = 1
{{= a}} a = 2
{{= window}} window = [object Window]
{{= (function(){return 123})()}} function(){return 123})() = 123
```

### {{! }}

{{! }} encode 转义  
{{! }} 会将其中的内容中特定字符进行转义，如：`{{! location.href}}`

### {{? }}

{{? }} conditionals 条件  
{{?}}标签必须成对出现，起始标签中写入判断条件，并以另外一个`{{?}}`标签为结束。该标签和下面的`{{~}}`是`{{if for}}`的语法糖。

如上面的：
``` html
// 模板字符串：
{{
  var a = 3;
  if(a > 2) {
}}
  a的值大于2
{{
  } else {
}}
  a的值小于2
{{
 }
}}
```
可以用本标签简写为：
``` html
// 模板字符串：
{{
  var a = 3;
}}
{{? a>2}}
  a的值大于2
{{?? true}}
  a的值小于2
{{?}}
```

### {{~ }}
``` html
// 模板字符串：
{{
  var array = [1,2,3,4];
}}
{{~ array:value:index}}
  value:{{=value}}, index:{{=index}}
{{~}}
```

{{~}} array iteration 循环  
{{~}}标签必须成对出现，起始标签中写入对数组遍历的变量赋值：`{{~it.array :value:index}}`，并以另外一个`{{~}}`标签为结束。

### {{# }}

{{#}} compile-time evalution/includes and partials 编译时载入代码片段、文件  
类似于宏编译，在compile阶段，将对应的变量或文件内容插入指定的位置  
传入的参数默认在对象`def`中。此外，通过`{{## #}}`定义的变量，也都是在`def`对象中的

用法与`{{}}`基本一致，只是生效的阶段不同。  

> ps: 虽然官方文档中提到了`{{#def.loadfile(‘/snippet.text')}}`这样载入模板的例子。但其实这一功能并不是默认集成的。loadfile函数需要自己去实现，并通过参数传入。  
> 所以在使用doT时，可以考虑通过插件等形式封装的时候，给def、it提供一些默认的行为方法

### {{## #}}

{{## #}} compile-time defines 编译时变量定义  

{{## #}}有两种赋值方式：使用`=`赋值和使用`:`赋值。二者的区别是，`=`赋值时，右侧是一个js的表达式。可以是函数定义、真值判断、字符串等等，`:`赋值时，紧跟`:`之后的所有内容，都被当做静态模板直接赋值给变量：

``` html
// 模板字符串：
{{##
  def.array = [1,2,3,4]
#}}
{{#def.array[0]}} 的值是 1

{{##
  def.array2:[1,2,3,4]
#}}
{{#def.array2[0]}} 的值是 [  // array2是字符串的：”[1,2,3,4]”，所以第0位是 [ 
```


## LICENSE

MIT