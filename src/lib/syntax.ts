import path from 'node:path'

import type { Lang } from 'shiki'
import { getHighlighter, renderToHtml } from 'shiki'

const theme = 'tokyo-night'
const themesPath = path.resolve(process.cwd(), 'src/styles')
const langsPath = path.resolve(process.cwd(), 'vendor/shiki-langs')

export async function highlight(code: string, lang?: string) {
  const highlighter = await getHighlighter({
    theme,
    paths: { themes: themesPath, languages: langsPath },
    langs: lang ? [lang as Lang] : undefined,
  })

  const tokens = highlighter.codeToThemedTokens(code, lang)
  const html = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor(theme),
    bg: highlighter.getBackgroundColor(theme),
    elements: {
      pre({ children }) {
        return children
      },
      code({ children }) {
        return `<code class="language-${lang}">${children}</code>`
      },
      line({ children }) {
        return `<span class="line">${children}</span>`
      },
    },
  })

  return html
}
