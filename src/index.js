'use strict';
import path from "path";
import fs from "fs";
import doT from "dot";
/**
 * dot template
 * @type {Class}
 */
let Base = think.adapter('template', 'base');

global.dot = global.dot || {};
global.dot.filter = global.dot.filter || {};
global.dot.default = global.dot.default || {
  startSymbol: '{{',
  endSymbol: '}}'
};

let dotDef = {
  loadfile: fnLoadfile
};

function fnLoadfile(filePath) {
  var data = fs.readFileSync(filePath);
  if (data) return data.toString();
}

export default class ThinkTemplateDot extends Base {
  /**
   * run
   * @param  {String} templateFile [template filepath]
   * @param  {Object} tVar         [data]
   * @return {String}              []
   */

  static reconfig(def = dotDef, dot = global.dot) {
    dotDef = def;
    global.dot = dot;
    dotDef.loadfile = dotDef.loadfile || fnLoadfile;
    thinkCache(thinkCache.VIEW_CONTENT, null);
  }

  async run(templateFile, tVar, config) {
    let dotConfig = config && config.adapter && config.adapter.dot || {};

    let options = this.parseConfig(doT.templateSettings, dotConfig);

    this.prerender(options, doT, dotDef, global.dot);
    
    if(options.cache_compile) {
      let doTCompiled = thinkCache(thinkCache.VIEW_CONTENT, templateFile + '-compile');
      if (doTCompiled) {
        return doTCompiled(tVar);
      }
    }
    let content = await this.getContent(templateFile);
    let doTCompiled = doT.template(content, options, dotDef);
    if(options.cache_compile) {
      thinkCache(thinkCache.VIEW_CONTENT, templateFile + '-compile', doTCompiled);
    }

    return doTCompiled(tVar);
  }
};