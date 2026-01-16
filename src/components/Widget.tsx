import type { JSX } from 'preact'
import { useWidget } from '../hooks/useWidget'
import { I18nContext } from '../i18n'
import type { SupprtConfig } from '../types'
import { ChatBubble } from './ChatBubble'
import { ChatWindow } from './ChatWindow'

interface WidgetProps {
  config: SupprtConfig
}

export function Widget({ config }: WidgetProps): JSX.Element | null {
  const {
    state,
    isComposing,
    isAgentTyping,
    uploadProgress,
    connectionStatus,
    queuedMessages,
    hasMoreMessages,
    isLoadingMore,
    primaryColor,
    position,
    customStyle,
    translations,
    initFailed,
    actions,
  } = useWidget(config)

  // Don't render anything if initialization failed
  if (initFailed) {
    return null
  }

  // Count unread conversations
  const unreadCount = state.conversations.filter((c) => c.hasUnread).length

  return (
    <I18nContext.Provider value={translations}>
      <div class="supprt-widget" style={{ '--supprt-z-index': config.zIndex ?? 9999 } as any}>
        <ChatWindow
          isOpen={state.isOpen}
          isLoading={state.isLoading}
          error={state.error}
          project={state.project}
          messages={state.messages}
          activeConversation={state.activeConversation}
          conversations={state.conversations}
          isSending={state.isSending}
          isComposing={isComposing}
          isAgentTyping={isAgentTyping}
          uploadProgress={uploadProgress}
          connectionStatus={connectionStatus}
          queuedMessagesCount={queuedMessages.length}
          hasMoreMessages={hasMoreMessages}
          isLoadingMore={isLoadingMore}
          primaryColor={primaryColor}
          position={position}
          customStyle={customStyle}
          onSendMessage={actions.sendMessage}
          onTyping={actions.setTyping}
          onDownloadAttachment={actions.downloadAttachment}
          onClose={actions.closeWindow}
          onSelectConversation={actions.loadConversation}
          onNewConversation={actions.startNewConversation}
          onBackToList={actions.backToList}
          onLoadMore={actions.loadMoreMessages}
          onRetry={actions.retry}
        />

        <ChatBubble
          onClick={actions.toggleOpen}
          isOpen={state.isOpen}
          primaryColor={primaryColor}
          position={position}
          customStyle={customStyle}
          unreadCount={unreadCount}
        />
      </div>
    </I18nContext.Provider>
  )
}
