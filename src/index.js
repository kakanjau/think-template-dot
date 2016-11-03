'use strict';
import path from "path";
import fs from "fs";
import doT from "dot";
/**
 * dot template
 * @type {Class}
 */
let Base = think.adapter('template', 'base');
const DEF_CACHE_NAME = thinkCache.VIEW_CONTENT + '-def';
const VIEW_CACHE_NAME = thinkCache.VIEW_CONTENT;

global.dot = global.dot || {};
global.dot.filter = global.dot.filter || {};
global.dot.default = global.dot.default || {
  startSymbol: '{{',
  endSymbol: '}}'
};
global.dot.loadfile = fnLoadfile;

function fnLoadfile(filePath) {
  var data = fs.readFileSync(filePath);
  if (data) return data.toString();
}

export default class ThinkTemplateDot extends Base {
  /**
   * 设置模板的编译时参数，根据模板文件名称(形参templateFile)进行配置。
   * 如果templateFile有值，则配置该templateFile的def
   * 如果templateFile为空，则配置全局的global.dot对象
   */ 
  static reconfig(def, templateFile) {
    if(templateFile && think.isString(templateFile)) {
      thinkCache(DEF_CACHE_NAME, templateFile, def);
      thinkCache(VIEW_CACHE_NAME, templateFile + '-compile', null);
    }else {
      thinkCache(DEF_CACHE_NAME, def);
      thinkCache(VIEW_CACHE_NAME, null);
    }
  }

  /**
   * 获取指定模板的编译时参数
   */
  static getConfig(templateFile) {
    return templateFile && thinkCache(DEF_CACHE_NAME, templateFile)
  }

  async run(templateFile, tVar, config) {
    let dotConfig = config && config.adapter && config.adapter.dot || {};
    let options = this.parseConfig(doT.templateSettings, dotConfig);

    let def = thinkCache(DEF_CACHE_NAME, path.relative(config.root_path, templateFile));
    this.prerender(options, doT, def, global.dot);
    
    if(options.cache_compile) {
      let doTCompiled = thinkCache(VIEW_CACHE_NAME, templateFile + '-compile');
      if (doTCompiled) {
        return doTCompiled(tVar);
      }
    }
    let content = await this.getContent(templateFile);
    let doTCompiled = doT.template(content, options, def);
    if(options.cache_compile) {
      thinkCache(VIEW_CACHE_NAME, templateFile + '-compile', doTCompiled);
    }

    return doTCompiled(tVar);
  }
};