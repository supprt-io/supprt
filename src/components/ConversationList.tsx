import { CircleAlert, Plus } from 'lucide-preact'
import type { JSX } from 'preact'
import { useTranslation } from '../i18n'
import type { Conversation } from '../types'
import { formatRelativeDate } from '../utils/date'

interface ConversationListProps {
  conversations: Conversation[]
  primaryColor: string
  onSelectConversation: (conversation: Conversation) => void
  onNewConversation: () => void
}

export function ConversationList({
  conversations,
  primaryColor,
  onSelectConversation,
  onNewConversation,
}: ConversationListProps): JSX.Element {
  const t = useTranslation()

  return (
    <div class="supprt-conversations">
      <button
        type="button"
        class="supprt-new-conversation"
        onClick={onNewConversation}
        style={{ color: primaryColor }}
      >
        <Plus size={20} aria-hidden="true" />
        <span>{t.newConversation}</span>
      </button>

      <div class="supprt-conversations__list">
        {conversations.map((conv) => (
          <ConversationItem key={conv.id} conversation={conv} onSelect={onSelectConversation} />
        ))}
      </div>
    </div>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  onSelect: (conversation: Conversation) => void
}

function ConversationItem({ conversation, onSelect }: ConversationItemProps): JSX.Element {
  const t = useTranslation()
  const isClosed = conversation.status === 'closed'

  return (
    <button
      type="button"
      class={`supprt-conversation-item ${isClosed ? 'supprt-conversation-item--closed' : ''}`}
      onClick={() => onSelect(conversation)}
    >
      <div class="supprt-conversation-item__content">
        <span class="supprt-conversation-item__preview">
          {conversation.lastMessage?.content || t.noMessages}
        </span>
        <div class="supprt-conversation-item__meta">
          {isClosed && <span class="supprt-conversation-item__badge">{t.resolved}</span>}
          <span class="supprt-conversation-item__time">
            {formatRelativeDate(conversation.updatedAt, t.yesterday)}
          </span>
        </div>
      </div>
      {conversation.hasUnread && (
        <CircleAlert size={18} class="supprt-conversation-item__unread" aria-label={t.unread} />
      )}
    </button>
  )
}
