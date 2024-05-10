# react-codemirror-runmode

Syntax highlighter for React, using CodeMirror 6

## Installation

```sh
npm install --save react-codemirror-runmode
```

You'll also need to provide the CodeMirror language definitions you want to use. We don't bundle these in order to not bloat the component with unused definitions.

## Usage

```javascript
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { Highlighter } from 'react-codemirror-runmode'
import React from 'react'
import ReactDOM from 'react-dom/client'

const code = 'const x = 123'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <Highlighter lang="js" highlightStyle={oneDarkHighlightStyle}>
    {code}
  </Highlighter>
)
```

## Theming

You can apply custom themes using CodeMirror's theme system. This component uses [`HighlightStyle`](https://codemirror.net/docs/ref#language.HighlightStyle) objects to apply styles, which you can customize or replace.

## Reference

### `Highlighter`

Props:

- `lang`: `string` - The name of the language
- `highlightStyle`: [`HighlightStyle`](https://codemirror.net/docs/ref#language.HighlightStyle) - The highlight style
- `children`: `string` - The code to highlight

### `highlightCode<Output>(languageName, input, highlightStyle, callback): Promise<Output[]>`

Parameters:

- `languageName`: `string` - The name of the language
- `input`: `string` - The code to highlight
- `highlightStyle`: [`HighlightStyle`](https://codemirror.net/docs/ref#language.HighlightStyle) - The highlight style
- `callback`: `(text: string, style: string | null, from: number, to: number) => Output)` - A callback function that converts the parsed tokens

### `getCodeParser(languageName, defaultLanguage?): Promise<Parser | null>`

Parameters:

- `languageName: string` - The name of the language
- `defaultLanguage?: Language` - A fallback language (Optional)

## License

MIT License. Developed by Takuya Matsuyama <hi@craftz.dog>
