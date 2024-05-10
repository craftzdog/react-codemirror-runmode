import React from 'react';
import type { HighlightStyle } from '@codemirror/language';
export type HighlighterProps = {
    lang: string;
    children: string;
    highlightStyle: HighlightStyle;
};
export declare const Highlighter: React.NamedExoticComponent<HighlighterProps>;
