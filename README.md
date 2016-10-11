# think-template-dot

## 安装

```
npm install think-template-dot
```

## 配置

### 注册 adapter

```
// src/bootstrap/adapter.js
import doTAdapter from 'think-template-dot';
think.adapter('template', 'dot', doTAdapter);
```

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
            strip: false,
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

#### adapter.dot.prerender

prerender传入三个参数：

- doT：及doT模板插件对象
- def：doT模板预编译时传入的参数
  这里没有提供预编译这一步骤，所以def主要作为针对所有模板提供预编译的函数支持，默认加入了`def.loadfile`方法，可以在模板中通过`{{#def.loadfile('filepath')}}`的方式载入模板
- dot: global.dot命名空间，可以将一些全局变量、方法如（过滤器）存入，方便模板使用：`{{=dot.filter.filter1(it.array)}}`

## LICENSE

MIT