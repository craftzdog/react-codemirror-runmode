# react-codemirror-runmode

Syntax highlighter for React, using CodeMirror 6.
It automatically loads [the language metadata](https://github.com/codemirror/language-data) and dynamically loads language parser modules based on the specified language.

## Installation

```sh
npm install --save react-codemirror-runmode
```

## Usage

```javascript
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { Highlighter } from 'react-codemirror-runmode'
import React from 'react'
import ReactDOM from 'react-dom/client'

const code = 'const x = 123'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <Highlighter lang="js" theme={oneDarkHighlightStyle}>
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
- `theme`: [`Highlighter`](https://lezer.codemirror.net/docs/ref/#highlight.Highlighter) - The highlight style
- `children`: `string` - The code to highlight
- `fallbackLanguage`: `Language` - Optional fallback language to use if the specified language isn't found
- `languages`: `LanguageDescription[]` - Optional custom list of language descriptions

### `highlightCode<o>(languageName, input, highlightStyle, fallbackLanguage?, languages?, callback): Promise<Output[]>`

Parameters:

- `languageName`: `string` - The name of the language
- `input`: `string` - The code to highlight
- `highlighter`: [`Highlighter`](https://lezer.codemirror.net/docs/ref/#highlight.Highlighter) - The highlight style
- `fallbackLanguage`: `Language` - Optional fallback language to use if the specified language isn't found
- `languages`: `LanguageDescription[]` - Optional custom list of language descriptions
- `callback`: `(text: string, style: string | null, from: number, to: number) => Output)` - A callback function that converts the parsed tokens

### `getCodeParser(languageName, defaultLanguage?): Promise<Parser | null>`

Parameters:

- `languageName: string` - The name of the language
- `defaultLanguage?: Language` - A fallback language (Optional)

## License

MIT License. Developed by Takuya Matsuyama <hi@craftz.dog>
