import type { JSX } from 'preact'

interface TypingIndicatorProps {
  primaryColor: string
  agentName?: string
}

export function TypingIndicator({ primaryColor, agentName }: TypingIndicatorProps): JSX.Element {
  return (
    <div class="supprt-typing">
      <div class="supprt-typing__avatar" style={{ backgroundColor: primaryColor }}>
        {agentName ? agentName.charAt(0).toUpperCase() : 'S'}
      </div>
      <div class="supprt-typing__bubble">
        <span class="supprt-typing__dot" />
        <span class="supprt-typing__dot" />
        <span class="supprt-typing__dot" />
      </div>
    </div>
  )
}
