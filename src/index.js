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

function loadfile(filePath) {
  var data = fs.readFileSync(filePath);
  if (data) return data.toString();
}

export default class extends Base {
  /**
   * run
   * @param  {String} templateFile [template filepath]
   * @param  {Object} tVar         [data]
   * @return {String}              []
   */
  async run(templateFile, tVar, config) {
    let dotConfig = config && config.adapter && config.adapter.dot || {};
    let dotDef = {
      loadfile: loadfile
    };
    let options = this.parseConfig(doT.templateSettings, dotConfig);

    this.prerender(options, doT, dotDef, global.dot);

    let content = await this.getContent(templateFile);
    let doTCompiled = doT.template(content, options, dotDef);

    return doTCompiled(tVar);
  }
}