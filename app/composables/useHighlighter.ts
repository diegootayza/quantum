import type { HighlighterGeneric } from 'shiki'

import { createHighlighter } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs'

let highlighter: HighlighterGeneric<any, any> | null = null

let promise: null | Promise<HighlighterGeneric<any, any>> = null

export const useHighlighter = async () => {
    if (!promise) {
        promise = createHighlighter({
            engine: createJavaScriptRegexEngine(),
            langs: ['vue', 'js', 'ts', 'css', 'html', 'json', 'yaml', 'markdown', 'bash'],
            themes: ['material-theme-palenight', 'material-theme-lighter'],
        })
    }
    if (!highlighter) {
        highlighter = await promise
    }

    return highlighter
}
