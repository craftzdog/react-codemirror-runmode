import { Parser } from '@lezer/common';
import { HighlightStyle, Language } from '@codemirror/language';
export declare function getCodeParser(languageName: string, defaultLanguage?: Language): Promise<Parser | null>;
export declare function highlightCode<Output>(languageName: string, input: string, highlightStyle: HighlightStyle, callback: (text: string, style: string | null, from: number, to: number) => Output): Promise<Output[]>;
