import React from 'react'
import PropTypes from 'prop-types'

export default class MirrorLight extends React.Component {
  static propTypes = {
    codeMirror: PropTypes.func.isRequired,
    className: PropTypes.string,
    theme: PropTypes.string,
    inline: PropTypes.bool,
    language: PropTypes.string,
    prefix: PropTypes.string,
    value: PropTypes.string.isRequired
  }

  static defaultProps = {
    className: '',
    prefix: 'cm-'
  }

  render () {
    const { inline, codeMirror, value, language, className, prefix, theme } = this.props
    const elements = []
    let index = 0
    let lastStyle = null
    let tokenBuf = ''
    const pushElement = (token, style) => {
      elements.push(<span className={style ? prefix + style : ''} key={++index}>{token}</span>)
    }
    codeMirror.runMode(value, language, (token, style) => {
      if (lastStyle === style) {
        tokenBuf += token
        lastStyle = style
      } else {
        if (tokenBuf) {
          pushElement(tokenBuf, lastStyle)
        }
        tokenBuf = token
        lastStyle = style
      }
    })
    pushElement(tokenBuf, lastStyle)

    const code = (
      <code className={inline ? `inline ${prefix}s-${theme}` : ''}>
        {elements}
      </code>
    )

    return inline ? code : <pre className={`${className} ${prefix}s-${theme}`}>{code}</pre>
  }
}
