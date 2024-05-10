import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useEffect, useState } from 'react';
import { highlightCode } from './highlight';
export const Highlighter = memo((props) => {
    const { lang, children: code, highlightStyle } = props;
    const [highlightedCode, setHighlightedCode] = useState(null);
    useEffect(() => {
        highlightCode(lang, code, highlightStyle, (text, style, from) => {
            return (_jsx("span", { className: style || '', children: text }, from));
        }).then(setHighlightedCode);
    }, [lang, code, highlightStyle]);
    return _jsx(_Fragment, { children: highlightedCode || code });
});
