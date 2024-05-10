// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { Parser } from '@lezer/common'
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { getCodeParser, highlightCode, Highlighter } from '../src'
import { render, screen } from '@testing-library/react'

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec))

describe('getCodeParser', () => {
  it('loads a JavaScript parser', async () => {
    const parser = await getCodeParser('js')
    expect(parser).toBeInstanceOf(Parser)
  })
  it('loads a Python parser', async () => {
    const parser = await getCodeParser('python')
    expect(parser).toBeInstanceOf(Parser)
  })
  it('returns null for non-existing languages', async () => {
    const parser = await getCodeParser('foobar123')
    expect(parser).toBeNull()
  })
})

describe('highlightCode', () => {
  it('highlights JavaScript code', async () => {
    const highlighted = await highlightCode(
      'js',
      'const x = 123',
      oneDarkHighlightStyle,
      (text, style, from, to) => ({ text, style, from, to })
    )
    expect(highlighted).toHaveLength(7)
    expect(highlighted[0]).toEqual({
      text: 'const',
      style: 'ͼp',
      from: 0,
      to: 5
    })
    expect(highlighted[1]).toEqual({
      text: ' ',
      style: null,
      from: 5,
      to: 6
    })
    expect(highlighted[2]).toEqual({
      text: 'x',
      style: 'ͼt',
      from: 6,
      to: 7
    })
    expect(highlighted[4]).toEqual({
      text: '=',
      style: 'ͼv',
      from: 8,
      to: 9
    })
    expect(highlighted[6]).toEqual({
      text: '123',
      style: 'ͼu',
      from: 10,
      to: 13
    })
  })
})

describe('React Highlighter', () => {
  it('renders highlighted code', async () => {
    const code = 'const x = 123'
    render(
      <code className="mde-preview">
        <Highlighter lang="js" theme={oneDarkHighlightStyle}>
          {code}
        </Highlighter>
      </code>
    )
    await sleep(100)
    const element = screen.getByText('const')
    expect(element).toBeDefined()
    expect(element).toHaveProperty('className', 'ͼp')
    expect(screen.getByText('123')).toHaveProperty('className', 'ͼu')
  })
})
