import React, { memo, useEffect, useState } from 'react'
import { highlightCode } from './highlight'
import type { HighlightStyle } from '@codemirror/language'

export type HighlighterProps = {
  lang: string
  children: string
  highlightStyle: HighlightStyle
}

export const Highlighter = memo<HighlighterProps>((props: HighlighterProps) => {
  const { lang, children: code, highlightStyle } = props
  const [highlightedCode, setHighlightedCode] = useState<
    React.ReactNode[] | null
  >(null)

  useEffect(() => {
    highlightCode(
      lang,
      code,
      highlightStyle,
      (text: string, style: string | null, from: number) => {
        return (
          <span key={from} className={style || ''}>
            {text}
          </span>
        )
      }
    ).then(setHighlightedCode)
  }, [lang, code, highlightStyle])

  return <>{highlightedCode || code}</>
})
