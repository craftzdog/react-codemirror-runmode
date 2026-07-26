import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { createRoot } from 'react-dom/client'
import { bench, describe } from 'vitest'

import { highlightCode, Highlighter } from '../src'

const page = readFileSync(resolve(process.cwd(), 'test/fixtures/large.html'), 'utf8')

/**
 * Rendering ~90k spans into jsdom costs seconds per iteration, so the defaults
 * (5 warmup + 10 timed runs) would take minutes. Keep the run bounded.
 */
const RENDER_BENCH_OPTIONS = { time: 0, iterations: 5, warmupTime: 0, warmupIterations: 1 }

/**
 * Resolves once the highlighted spans are in the document. The pending state is
 * itself a single wrapper `<span>`, so waiting for *any* span would return
 * immediately and measure nothing — hence the count.
 */
const waitForHighlight = (host: HTMLElement) =>
  new Promise<void>(resolve => {
    const poll = () => (host.querySelectorAll('span').length > 1 ? resolve() : setTimeout(poll, 5))
    poll()
  })

describe(`html highlighting (${(page.length / 1024).toFixed(0)}KB)`, () => {
  bench('highlightCode: parse + tokenize', async () => {
    await highlightCode(
      'html',
      page,
      oneDarkHighlightStyle,
      undefined,
      undefined,
      (text, style, from, to) => ({ text, style, from, to })
    )
  })

  // Rendered through createRoot rather than @testing-library/react so the
  // measurement excludes act() overhead and each iteration starts on an empty DOM.
  bench(
    'Highlighter: parse + tokenize + React render into jsdom',
    async () => {
      const host = document.createElement('div')
      document.body.appendChild(host)
      const root = createRoot(host)

      root.render(
        <code>
          <Highlighter lang="html" theme={oneDarkHighlightStyle}>
            {page}
          </Highlighter>
        </code>
      )
      await waitForHighlight(host)

      root.unmount()
      host.remove()
    },
    RENDER_BENCH_OPTIONS
  )
})
