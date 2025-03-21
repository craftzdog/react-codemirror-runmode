import React, { memo, useEffect, useState } from 'react'
import { highlightCode } from './highlight.js'
import type { Highlighter as LezerHighlighter } from '@lezer/highlight'

export type HighlighterProps = {
  lang: string
  children: string
  theme: LezerHighlighter
}

export const Highlighter = memo<HighlighterProps>((props: HighlighterProps) => {
  const { lang, children: code, theme } = props
  const [highlightedCode, setHighlightedCode] = useState<
    React.ReactNode[] | null
  >(null)

  useEffect(() => {
    highlightCode(
      lang,
      code,
      theme,
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
