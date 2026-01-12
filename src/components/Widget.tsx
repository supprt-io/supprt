import type { JSX } from 'preact'
import { useWidget } from '../hooks/useWidget'
import { I18nContext } from '../i18n'
import type { SupprtConfig } from '../types'
import { ChatBubble } from './ChatBubble'
import { ChatWindow } from './ChatWindow'

interface WidgetProps {
  config: SupprtConfig
}

export function Widget({ config }: WidgetProps): JSX.Element {
  const { state, isComposing, hasUnread, primaryColor, position, translations, actions } =
    useWidget(config)

  return (
    <I18nContext.Provider value={translations}>
      <div class="supprt-widget" style={{ '--supprt-z-index': config.zIndex ?? 9999 } as any}>
        <ChatWindow
          isOpen={state.isOpen}
          isLoading={state.isLoading}
          project={state.project}
          messages={state.messages}
          activeConversation={state.activeConversation}
          conversations={state.conversations}
          isSending={state.isSending}
          isComposing={isComposing}
          primaryColor={primaryColor}
          position={position}
          onSendMessage={actions.sendMessage}
          onDownloadAttachment={actions.downloadAttachment}
          onClose={actions.closeWindow}
          onSelectConversation={actions.loadConversation}
          onNewConversation={actions.startNewConversation}
          onBackToList={actions.backToList}
        />

        <ChatBubble
          onClick={actions.toggleOpen}
          isOpen={state.isOpen}
          primaryColor={primaryColor}
          position={position}
          hasUnread={hasUnread}
        />
      </div>
    </I18nContext.Provider>
  )
}
