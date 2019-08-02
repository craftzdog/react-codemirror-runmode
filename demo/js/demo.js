import MirrorLight from '../../src/index'
import React from 'react'
import ReactDOM from 'react-dom'

const exampleCode = `
* Incremental highlighted search (/, ?, #, *, g#, g*)
  * Search/replace with confirm (:substitute, :%s)
  * Search history

\`\`\`javascript
import React from 'react'
import PropTypes from 'prop-types'

export default class MirrorLight extends React.Component {
  static propTypes = {
    codeMirror: PropTypes.object.isRequired,
    className: PropTypes.string,
    inline: PropTypes.bool,
    language: PropTypes.string,
    prefix: PropTypes.string,
    subset: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.string.isRequired
  }

  render () {
    const { inline, codeMirror, value, language, className } = this.props
    const elements = []
    codeMirror.runMode(value, language, (token, style) => {
      elements.push(<span className={style}>{token}</span>)
    })
    const code = (
      <code className={inline ? 'inline' : ''}>
        {elements}
      </code>
    )

    return inline ? code : <pre className={className}>{code}</pre>
  }
}
\`\`\`
`

ReactDOM.render(
  <MirrorLight
    codeMirror={CodeMirror}
    theme="solarized"
    value={exampleCode}
    language="gfm"
  />,
  document.getElementById('root')
)
