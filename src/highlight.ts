import { markdown } from '@codemirror/lang-markdown'
import { Language, LanguageDescription } from '@codemirror/language'
import { languages as builtinLanguages } from '@codemirror/language-data'
import { Parser } from '@lezer/common'
import { Highlighter, highlightTree } from '@lezer/highlight'

/**
 * Configuration for the markdown parser used when highlighting `markdown`/`md`
 * input. Mirrors the relevant subset of `@codemirror/lang-markdown`'s `markdown()`
 * options so callers can opt into GFM (`base: markdownLanguage`) and custom Lezer
 * markdown extensions (e.g. app-specific node props, GFM alerts).
 *
 * Defaults match `@codemirror/lang-markdown`: a CommonMark base with no extensions.
 */
export type MarkdownConfig = Pick<
  NonNullable<Parameters<typeof markdown>[0]>,
  'base' | 'extensions'
>

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
        const found = LanguageDescription.matchLanguageName(languages, langName, true)
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
  languages: LanguageDescription[] = builtinLanguages,
  markdownConfig: MarkdownConfig = {}
): Promise<Parser> {
  const codeBlockLanguages = extractCodeBlockLanguages(input)
  const preloadedLanguages = await preloadLanguageParsers(codeBlockLanguages || [], languages)
  const langSupport = markdown({
    ...markdownConfig,
    codeLanguages: preloadedLanguages
  })
  return langSupport.language.parser
}

export async function getCodeParser(
  input: string,
  languageName: string,
  fallbackLanguage?: Language,
  languages: LanguageDescription[] = builtinLanguages,
  markdownConfig?: MarkdownConfig
): Promise<Parser | null> {
  if (languageName === 'markdown' || languageName === 'md') {
    return await getMarkdownParser(input, languages, markdownConfig)
  } else {
    const found = LanguageDescription.matchLanguageName(languages, languageName, true)
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
  highlighter: Highlighter | readonly Highlighter[],
  fallbackLanguage: Language | undefined,
  languages: LanguageDescription[] | undefined,
  callback: (text: string, style: string | null, from: number, to: number) => Output,
  markdownConfig?: MarkdownConfig
): Promise<Output[]> {
  const parser = await getCodeParser(
    input,
    languageName,
    fallbackLanguage,
    languages,
    markdownConfig
  )
  if (parser) {
    const tree = parser.parse(input)
    const output: Array<Output> = []
    let pos = 0
    highlightTree(tree, highlighter, (from, to, classes) => {
      if (from > pos) output.push(callback(input.slice(pos, from), null, pos, from))
      output.push(callback(input.slice(from, to), classes, from, to))
      pos = to
    })
    pos != tree.length &&
      output.push(callback(input.slice(pos, tree.length), null, pos, tree.length))
    return output
  } else {
    return [callback(input, null, 0, input.length)]
  }
}
