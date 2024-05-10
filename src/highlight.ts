import { Parser } from '@lezer/common'
import {
  HighlightStyle,
  Language,
  LanguageDescription
} from '@codemirror/language'
import { highlightTree } from '@lezer/highlight'
import { languages } from '@codemirror/language-data'

export async function getCodeParser(
  languageName: string,
  defaultLanguage?: Language
): Promise<Parser | null> {
  if (languageName && languages) {
    const found = LanguageDescription.matchLanguageName(
      languages,
      languageName,
      true
    )
    if (found instanceof LanguageDescription) {
      if (!found.support) await found.load()
      return found.support ? found.support.language.parser : null
    } else if (found) return (found as any).parser
  }
  return defaultLanguage ? defaultLanguage.parser : null
}

export async function highlightCode<Output>(
  languageName: string,
  input: string,
  highlightStyle: HighlightStyle,
  callback: (
    text: string,
    style: string | null,
    from: number,
    to: number
  ) => Output
): Promise<Output[]> {
  const parser = await getCodeParser(languageName)
  if (parser) {
    const tree = parser.parse(input)
    const output: Array<Output> = []
    let pos = 0
    highlightTree(tree, highlightStyle, (from, to, classes) => {
      if (from > pos)
        output.push(callback(input.slice(pos, from), null, pos, from))
      output.push(callback(input.slice(from, to), classes, from, to))
      pos = to
    })
    pos != tree.length &&
      output.push(
        callback(input.slice(pos, tree.length), null, pos, tree.length)
      )
    return output
  } else {
    return [callback(input, null, 0, input.length)]
  }
}
