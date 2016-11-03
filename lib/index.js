'use strict';

exports.__esModule = true;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _dot = require("dot");

var _dot2 = _interopRequireDefault(_dot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * dot template
 * @type {Class}
 */
var Base = think.adapter('template', 'base');
var DEF_CACHE_NAME = thinkCache.VIEW_CONTENT + '-def';
var VIEW_CACHE_NAME = thinkCache.VIEW_CONTENT;

global.dot = global.dot || {};
global.dot.filter = global.dot.filter || {};
global.dot.default = global.dot.default || {
  startSymbol: '{{',
  endSymbol: '}}'
};
global.dot.loadfile = fnLoadfile;

function fnLoadfile(filePath) {
  var data = _fs2.default.readFileSync(filePath);
  if (data) return data.toString();
}

var ThinkTemplateDot = function (_Base) {
  (0, _inherits3.default)(ThinkTemplateDot, _Base);

  function ThinkTemplateDot() {
    (0, _classCallCheck3.default)(this, ThinkTemplateDot);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  /**
   * 设置模板的编译时参数，根据模板文件名称(形参templateFile)进行配置。
   * 如果templateFile有值，则配置该templateFile的def
   * 如果templateFile为空，则配置全局的global.dot对象
   */
  ThinkTemplateDot.reconfig = function reconfig(def, templateFile) {
    if (templateFile && think.isString(templateFile)) {
      thinkCache(DEF_CACHE_NAME, templateFile, def);
      thinkCache(VIEW_CACHE_NAME, templateFile + '-compile', null);
    } else {
      thinkCache(DEF_CACHE_NAME, def);
      thinkCache(VIEW_CACHE_NAME, null);
    }
  };

  /**
   * 获取指定模板的编译时参数
   */


  ThinkTemplateDot.getConfig = function getConfig(templateFile) {
    return templateFile && thinkCache(DEF_CACHE_NAME, templateFile);
  };

  ThinkTemplateDot.prototype.run = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(templateFile, tVar, config) {
      var dotConfig, options, def, _doTCompiled, content, doTCompiled;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dotConfig = config && config.adapter && config.adapter.dot || {};
              options = this.parseConfig(_dot2.default.templateSettings, dotConfig);
              def = thinkCache(DEF_CACHE_NAME, _path2.default.relative(config.root_path, templateFile));

              this.prerender(options, _dot2.default, def, global.dot);

              if (!options.cache_compile) {
                _context.next = 8;
                break;
              }

              _doTCompiled = thinkCache(VIEW_CACHE_NAME, templateFile + '-compile');

              if (!_doTCompiled) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", _doTCompiled(tVar));

            case 8:
              _context.next = 10;
              return this.getContent(templateFile);

            case 10:
              content = _context.sent;
              doTCompiled = _dot2.default.template(content, options, def);

              if (options.cache_compile) {
                thinkCache(VIEW_CACHE_NAME, templateFile + '-compile', doTCompiled);
              }

              return _context.abrupt("return", doTCompiled(tVar));

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function run(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    }

    return run;
  }();

  return ThinkTemplateDot;
}(Base);

exports.default = ThinkTemplateDot;
;
//# sourceMappingURL=index.js.map