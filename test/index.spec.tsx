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
      undefined,
      undefined,
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

describe('Highlight codeblocks', () => {
  it('highlights codeblocks in markdown', async () => {
    const mdCode = '```js\nconst x = 123\n```'
    const highlighted = await highlightCode(
      'markdown',
      mdCode,
      oneDarkHighlightStyle,
      undefined,
      undefined,
      (text, style, from, to) => ({ text, style, from, to })
    )
    // Should have tokens for the markdown code block structure and the JS code inside
    expect(highlighted.length).toBeGreaterThan(0)

    // Find the code fence markers
    const fenceStart = highlighted.find(t => t.text === '```')
    expect(fenceStart).toBeDefined()

    // Find the language info token
    const langInfo = highlighted.find(t => t.text === 'js')
    expect(langInfo).toBeDefined()

    // Find the JS keyword 'const' inside the code block
    const constToken = highlighted.find(t => t.text === 'const')
    expect(constToken).toBeDefined()
    expect(constToken?.style).not.toBeNull()

    // Find the number '123'
    const numberToken = highlighted.find(t => t.text === '123')
    expect(numberToken).toBeDefined()
    expect(numberToken?.style).not.toBeNull()
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
