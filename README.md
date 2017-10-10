react-codemirror-runmode
========================

[![build status](https://secure.travis-ci.org/craftzdog/react-codemirror-runmode.svg)](http://travis-ci.org/craftzdog/react-codemirror-runmode)

Syntax highlighter for React, utilizing CodeMirror's parser

## Installation

```sh
npm install --save react-codemirror-runmode codemirror
```

You'll also need to provide the CodeMirror language definitions you want to use. We don't bundle these in order to not bloat the component with unused definitions.

## Usage

```javascript
import CodeMirror from 'codemirror'
import 'codemirror/addon/runmode/runmode'
import 'codemirror/mode/meta'
import 'codemirror/mode/javascript/javascript'
import Highlighter from 'react-codemirror-runmode'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <Highlighter
    codeMirror={CodeMirror}
    theme='solarized'
    value='/* Code to highlight */'
    language='javascript'
  />,
  document.getElementById('root')
)
```

## Styling

Stylesheets are not automatically handled for you - but there is [a bunch of premade styles](https://codemirror.net/demo/theme.html) for CodeMirror which you can simply drop in and they'll "just work". You can either grab these from the source, of pull them in using a CSS loader - whatever works best for you. They're also available on [cdnjs](https://cdnjs.com/libraries/codemirror):

```html
<link
  rel="stylesheet"
  href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.30.0/theme/solarized.min.css"
/>
```

## Props

| Name | Description |
|------|-------------|
| `className` | Class name for the outermost `pre` tag. Default: `''` |
| `language` | Language to use for syntax highlighting this value. Must be registered prior to usage. |
| `value` | The code snippet to syntax highlight |
| `prefix` | Class name prefix for individual node. Default: `cm-` |
| `inline` | Whether code should be displayed inline (no `<pre>` tag, sets `display: inline`) |

## License

MIT License. Developed by Takuya Matsuyama <hi@craftz.dog>