'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MirrorLight extends _react2.default.Component {

  render() {
    const { inline, codeMirror, value, language, className, prefix, theme } = this.props;
    const elements = [];
    let index = 0;
    let lastStyle = null;
    let tokenBuf = '';
    const pushElement = (token, style) => {
      elements.push(_react2.default.createElement(
        'span',
        { className: prefix + (style || 'space'), key: ++index },
        token
      ));
    };
    codeMirror.runMode(value, language, (token, style) => {
      if (lastStyle === style) {
        tokenBuf += token;
        lastStyle = style;
      } else {
        if (tokenBuf) {
          pushElement(tokenBuf, lastStyle);
        }
        tokenBuf = token;
        lastStyle = style;
      }
    });
    pushElement(tokenBuf, lastStyle);

    const code = _react2.default.createElement(
      'code',
      { className: inline ? `inline ${prefix}s-${theme}` : '' },
      elements
    );

    return inline ? code : _react2.default.createElement(
      'pre',
      { className: `${className} ${prefix}s-${theme}` },
      code
    );
  }
}
exports.default = MirrorLight;
MirrorLight.propTypes = {
  codeMirror: _propTypes2.default.func.isRequired,
  className: _propTypes2.default.string,
  theme: _propTypes2.default.string,
  inline: _propTypes2.default.bool,
  language: _propTypes2.default.string,
  prefix: _propTypes2.default.string,
  value: _propTypes2.default.string.isRequired
};
MirrorLight.defaultProps = {
  className: '',
  prefix: 'cm-'
};
module.exports = exports['default'];