import { Parser } from '@lezer/common'
import { Language, LanguageDescription } from '@codemirror/language'
import { Highlighter, highlightTree } from '@lezer/highlight'
import { languages as builtinLanguages } from '@codemirror/language-data'
import { markdown } from '@codemirror/lang-markdown'

export async function getCodeParser(
  languageName: string,
  fallbackLanguage?: Language,
  languages: LanguageDescription[] = builtinLanguages
): Promise<Parser | null> {
  if (languageName === 'markdown' || languageName === 'md') {
    const mdSupport = markdown({
      codeLanguages: builtinLanguages
    })
    return mdSupport.language.parser
  } else {
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
  return fallbackLanguage ? fallbackLanguage.parser : null
}

export async function highlightCode<Output>(
  languageName: string,
  input: string,
  highlighter: Highlighter,
  fallbackLanguage: Language | undefined,
  languages: LanguageDescription[] | undefined,
  callback: (
    text: string,
    style: string | null,
    from: number,
    to: number
  ) => Output
): Promise<Output[]> {
  const parser = await getCodeParser(languageName, fallbackLanguage, languages)
  if (parser) {
    const tree = parser.parse(input)
    const output: Array<Output> = []
    let pos = 0
    highlightTree(tree, highlighter, (from, to, classes) => {
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
