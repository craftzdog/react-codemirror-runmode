import type { Language, LanguageDescription } from '@codemirror/language'
import type { Highlighter as LezerHighlighter } from '@lezer/highlight'
import React, { memo, useEffect, useState } from 'react'

import { highlightCode, type MarkdownConfig } from './highlight.js'

export type HighlighterProps = {
  lang: string
  children: string
  /**
   * One highlighter, or several whose emitted classes are merged per token.
   * Pass an array to combine, e.g. a generic token theme with a
   * markdown-specific one.
   */
  theme: LezerHighlighter | readonly LezerHighlighter[]
  fallbackLanguage?: Language
  languages?: LanguageDescription[]
  /**
   * Markdown parser options, used only when `lang` is `markdown`/`md`. Enables
   * GFM (`base: markdownLanguage`) and custom Lezer markdown extensions. Pass a
   * stable reference (e.g. a module-level constant) to avoid re-highlighting on
   * every render.
   */
  markdownConfig?: MarkdownConfig
}

export const Highlighter = memo<HighlighterProps>((props: HighlighterProps) => {
  const { lang, children: code, theme, fallbackLanguage, languages, markdownConfig } = props
  const [highlightedCode, setHighlightedCode] = useState<React.ReactNode[] | null>(null)

  useEffect(() => {
    highlightCode(
      lang,
      code,
      theme,
      fallbackLanguage,
      languages,
      (text: string, style: string | null, from: number) => {
        return (
          <span key={from} className={style || ''}>
            {text}
          </span>
        )
      },
      markdownConfig
    ).then(setHighlightedCode)
  }, [lang, code, theme, markdownConfig])

  return <>{highlightedCode || code}</>
})
Highlighter.displayName = 'Highlighter'
