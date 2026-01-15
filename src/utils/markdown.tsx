import type { JSX, VNode } from 'preact'

/**
 * Lightweight markdown parser for chat messages.
 * Supports: **bold**, *italic*, `code`, [links](url), code blocks, line breaks
 */

interface Token {
  type: 'text' | 'bold' | 'italic' | 'code' | 'link' | 'codeblock' | 'linebreak'
  content: string
  href?: string
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  const remaining = text

  // Process code blocks first (```)
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null = null

  // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(...tokenizeInline(text.slice(lastIndex, match.index)))
    }
    tokens.push({ type: 'codeblock', content: match[2].trim() })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex === 0) {
    // No code blocks found, tokenize entire string
    tokens.push(...tokenizeInline(remaining))
  } else if (lastIndex < text.length) {
    tokens.push(...tokenizeInline(text.slice(lastIndex)))
  }

  return tokens
}

function tokenizeInline(text: string): Token[] {
  const tokens: Token[] = []
  // Combined regex for inline elements
  const inlineRegex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))|(\n)/g

  let lastIndex = 0
  let match: RegExpExecArray | null = null

  // biome-ignore lint/suspicious/noAssignInExpressions: needed for regex iteration
  while ((match = inlineRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }

    if (match[1]) {
      // Bold: **text**
      tokens.push({ type: 'bold', content: match[2] })
    } else if (match[3]) {
      // Italic: *text*
      tokens.push({ type: 'italic', content: match[4] })
    } else if (match[5]) {
      // Inline code: `code`
      tokens.push({ type: 'code', content: match[6] })
    } else if (match[7]) {
      // Link: [text](url)
      tokens.push({ type: 'link', content: match[8], href: match[9] })
    } else if (match[10]) {
      // Line break
      tokens.push({ type: 'linebreak', content: '' })
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    tokens.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return tokens
}

function renderToken(token: Token, index: number): VNode | string {
  switch (token.type) {
    case 'bold':
      return <strong key={index}>{token.content}</strong>
    case 'italic':
      return <em key={index}>{token.content}</em>
    case 'code':
      return (
        <code key={index} class="supprt-md-code">
          {token.content}
        </code>
      )
    case 'codeblock':
      return (
        <pre key={index} class="supprt-md-codeblock">
          <code>{token.content}</code>
        </pre>
      )
    case 'link':
      return (
        <a
          key={index}
          href={token.href}
          target="_blank"
          rel="noopener noreferrer"
          class="supprt-md-link"
        >
          {token.content}
        </a>
      )
    case 'linebreak':
      return <br key={index} />
    default:
      return token.content
  }
}

export function Markdown({ content }: { content: string }): JSX.Element {
  const tokens = tokenize(content)
  return <>{tokens.map((token, i) => renderToken(token, i))}</>
}
