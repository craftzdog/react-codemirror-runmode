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
- `theme`: [`Highlighter`](https://lezer.codemirror.net/docs/ref/#highlight.Highlighter)` | readonly Highlighter[]` - The highlight style. Pass an array to combine several highlighters; their emitted classes are merged per token (e.g. a generic token theme plus a markdown-specific one).
- `children`: `string` - The code to highlight
- `fallbackLanguage`: `Language` - Optional fallback language to use if the specified language isn't found
- `languages`: `LanguageDescription[]` - Optional custom list of language descriptions
- `markdownConfig`: `MarkdownConfig` - Optional markdown parser options, applied only when `lang` is `markdown`/`md`. See [Markdown highlighting](#markdown-highlighting).

### `highlightCode<o>(languageName, input, highlighter, fallbackLanguage?, languages?, callback, markdownConfig?): Promise<Output[]>`

Parameters:

- `languageName`: `string` - The name of the language
- `input`: `string` - The code to highlight
- `highlighter`: [`Highlighter`](https://lezer.codemirror.net/docs/ref/#highlight.Highlighter)` | readonly Highlighter[]` - The highlight style, or an array of styles whose classes are merged
- `fallbackLanguage`: `Language` - Optional fallback language to use if the specified language isn't found
- `languages`: `LanguageDescription[]` - Optional custom list of language descriptions
- `callback`: `(text: string, style: string | null, from: number, to: number) => Output)` - A callback function that converts the parsed tokens
- `markdownConfig`: `MarkdownConfig` - Optional markdown parser options, applied only when `languageName` is `markdown`/`md`

### `getCodeParser(input, languageName, fallbackLanguage?, languages?, markdownConfig?): Promise<Parser | null>`

Parameters:

- `input`: `string` - The code to highlight (used to preload nested code-fence languages for markdown)
- `languageName`: `string` - The name of the language
- `fallbackLanguage?`: `Language` - A fallback language (Optional)
- `languages?`: `LanguageDescription[]` - Optional custom list of language descriptions
- `markdownConfig?`: `MarkdownConfig` - Optional markdown parser options, applied only when `languageName` is `markdown`/`md`

## Markdown highlighting

When `lang` is `markdown` (or `md`), the markdown source is parsed with
[`@codemirror/lang-markdown`](https://github.com/codemirror/lang-markdown). By default this
uses a **CommonMark** base with no extensions. Pass `markdownConfig` to opt into GFM and/or
custom [Lezer markdown extensions](https://github.com/lezer-parser/markdown#user-content-markdownextension):

```javascript
import { Highlighter } from 'react-codemirror-runmode'
import { markdownLanguage } from '@codemirror/lang-markdown'

// GFM (tables, strikethrough, task lists, autolinks) + custom extensions,
// with two highlighters whose classes are merged per token.
;<Highlighter
  lang="markdown"
  theme={[tokenHighlighter, mdTokenHighlighter]}
  markdownConfig={{
    base: markdownLanguage,
    extensions: [
      /* your @lezer/markdown extensions */
    ]
  }}
>
  {markdownSource}
</Highlighter>
```

`MarkdownConfig` mirrors the `base` and `extensions` options of `markdown()`. Prefer a stable
reference for `markdownConfig` (e.g. a module-level constant) to avoid re-highlighting on every
render.

## License

MIT License. Developed by Takuya Matsuyama <hi@craftz.dog>
