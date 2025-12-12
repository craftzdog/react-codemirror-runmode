import { Parser } from '@lezer/common'
import { Language, LanguageDescription } from '@codemirror/language'
import { Highlighter, highlightTree } from '@lezer/highlight'
import { languages as builtinLanguages } from '@codemirror/language-data'
import { markdown } from '@codemirror/lang-markdown'

/**
 * Extract language names from code blocks in markdown text
 */
function extractCodeBlockLanguages(text: string): string[] {
  const codeBlockRegex = /```(\w+)/g
  const languages: string[] = []
  let match
  while ((match = codeBlockRegex.exec(text)) !== null) {
    languages.push(match[1])
  }
  return languages
}

/**
 * Pre-load parsers for a list of language names
 */
async function preloadLanguageParsers(
  languageNames: string[],
  languages: LanguageDescription[]
): Promise<LanguageDescription[]> {
  return (
    await Promise.all(
      languageNames.map(async langName => {
        const found = LanguageDescription.matchLanguageName(
          languages,
          langName,
          true
        )
        if (found instanceof LanguageDescription) {
          if (!found.support) await found.load()
          if (found.support) {
            return found
          }
        }
      })
    )
  ).filter((desc): desc is LanguageDescription => !!desc)
}

export async function getMarkdownParser(
  input: string,
  languages: LanguageDescription[] = builtinLanguages
): Promise<Parser> {
  const codeBlockLanguages = extractCodeBlockLanguages(input)
  const preloadedLanguages = await preloadLanguageParsers(
    codeBlockLanguages || [],
    languages
  )
  const langSupport = markdown({
    codeLanguages: preloadedLanguages
  })
  return langSupport.language.parser
}

export async function getCodeParser(
  input: string,
  languageName: string,
  fallbackLanguage?: Language,
  languages: LanguageDescription[] = builtinLanguages
): Promise<Parser | null> {
  if (languageName === 'markdown' || languageName === 'md') {
    return await getMarkdownParser(input, languages)
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
  const parser = await getCodeParser(
    input,
    languageName,
    fallbackLanguage,
    languages
  )
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
