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

global.dot = global.dot || {};
global.dot.filter = global.dot.filter || {};
global.dot.default = global.dot.default || {
  startSymbol: '{{',
  endSymbol: '}}'
};

function loadfile(filePath) {
  var data = _fs2.default.readFileSync(filePath);
  if (data) return data.toString();
}

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  /**
   * run
   * @param  {String} templateFile [template filepath]
   * @param  {Object} tVar         [data]
   * @return {String}              []
   */
  _class.prototype.run = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(templateFile, tVar, config) {
      var dotConfig, dotDef, options, content, doTCompiled;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dotConfig = config && config.adapter && config.adapter.dot || {};
              dotDef = {
                loadfile: loadfile
              };
              options = this.parseConfig(_dot2.default.templateSettings, dotConfig);


              this.prerender(options, _dot2.default, dotDef, global.dot);

              _context.next = 6;
              return this.getContent(templateFile);

            case 6:
              content = _context.sent;
              doTCompiled = _dot2.default.template(content, options, dotDef);
              return _context.abrupt("return", doTCompiled(tVar));

            case 9:
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

  return _class;
}(Base);

exports.default = _class;
//# sourceMappingURL=index.js.map