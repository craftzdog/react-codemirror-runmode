import React, { memo, useEffect, useState } from 'react'
import { highlightCode } from './highlight.js'
import type { Highlighter as LezerHighlighter } from '@lezer/highlight'
import type { Language, LanguageDescription } from '@codemirror/language'

export type HighlighterProps = {
  lang: string
  children: string
  theme: LezerHighlighter
  fallbackLanguage?: Language
  languages?: LanguageDescription[]
}

export const Highlighter = memo<HighlighterProps>((props: HighlighterProps) => {
  const { lang, children: code, theme, fallbackLanguage, languages } = props
  const [highlightedCode, setHighlightedCode] = useState<
    React.ReactNode[] | null
  >(null)

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
      }
    ).then(setHighlightedCode)
  }, [lang, code, theme])

  return <>{highlightedCode || code}</>
})
Highlighter.displayName = 'Highlighter'
