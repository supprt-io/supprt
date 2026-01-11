import type { JSX } from 'preact'
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { SupprtApi } from '../api'
import { I18nContext, getTranslations } from '../i18n'
import type { Conversation, Message, SupprtConfig, WidgetState } from '../types'
import { ChatBubble } from './ChatBubble'
import { ChatWindow } from './ChatWindow'

interface WidgetProps {
  config: SupprtConfig
}

const DEFAULT_PRIMARY_COLOR = '#04b3a4'
const DEFAULT_POSITION = 'bottom-right'

export function Widget({ config }: WidgetProps): JSX.Element {
  const [state, setState] = useState<WidgetState>({
    isOpen: false,
    isLoading: false,
    isInitialized: false,
    error: null,
    token: null,
    endUser: null,
    project: null,
    conversations: [],
    activeConversation: null,
    messages: [],
    isSending: false,
  })

  const [hasUnread, setHasUnread] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  const initializingRef = useRef(false)

  const [api] = useState(
    () => new SupprtApi(config.apiUrl || window.location.origin, config.publicKey),
  )

  const primaryColor = config.primaryColor || state.project?.primaryColor || DEFAULT_PRIMARY_COLOR
  const position =
    config.position ||
    (state.project?.position as 'bottom-right' | 'bottom-left') ||
    DEFAULT_POSITION

  const translations = useMemo(
    () => getTranslations(config.locale || state.project?.locale || undefined),
    [config.locale, state.project?.locale],
  )

  const initialize = useCallback(async () => {
    if (initializingRef.current) return
    initializingRef.current = true

    setState((s) => ({ ...s, isLoading: true, error: null }))

    try {
      const response = await api.init(config.user)
      setState((s) => ({
        ...s,
        isLoading: false,
        isInitialized: true,
        token: response.token,
        endUser: response.endUser,
        project: response.project,
        conversations: response.conversations,
      }))
    } catch (error) {
      initializingRef.current = false
      setState((s) => ({
        ...s,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize',
      }))
    }
  }, [api, config.user])

  const loadConversation = useCallback(
    async (conversation: Conversation) => {
      setIsComposing(false)
      setState((s) => ({
        ...s,
        activeConversation: conversation,
        isLoading: true,
      }))

      try {
        const response = await api.getConversation(conversation.id)
        setState((s) => ({
          ...s,
          isLoading: false,
          messages: response.conversation.messages,
        }))
      } catch (error) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load messages',
        }))
      }
    },
    [api],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      setState((s) => ({ ...s, isSending: true }))

      try {
        if (state.activeConversation) {
          const response = await api.sendMessage(state.activeConversation.id, content)
          const newMessage: Message = {
            ...response.message,
            senderType: 'user',
            createdAt: response.message.createdAt || new Date().toISOString(),
          }
          setState((s) => ({
            ...s,
            isSending: false,
            messages: [...s.messages, newMessage],
          }))
        } else {
          const response = await api.createConversation(content)
          const newMessage: Message = {
            ...response.message,
            senderType: 'user',
            createdAt: response.message.createdAt || new Date().toISOString(),
          }
          setIsComposing(false)
          setState((s) => ({
            ...s,
            isSending: false,
            activeConversation: response.conversation,
            conversations: [response.conversation, ...s.conversations],
            messages: [newMessage],
          }))
        }
      } catch (error) {
        setState((s) => ({
          ...s,
          isSending: false,
          error: error instanceof Error ? error.message : 'Failed to send message',
        }))
      }
    },
    [api, state.activeConversation],
  )

  const toggleOpen = useCallback(() => {
    setState((s) => {
      // Reset unread when opening
      if (!s.isOpen) {
        setHasUnread(false)
      }
      return { ...s, isOpen: !s.isOpen }
    })
  }, [])

  const closeWindow = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }))
  }, [])

  const startNewConversation = useCallback(() => {
    setIsComposing(true)
    setState((s) => ({
      ...s,
      activeConversation: null,
      messages: [],
    }))
  }, [])

  const backToList = useCallback(() => {
    setIsComposing(false)
    setState((s) => ({
      ...s,
      activeConversation: null,
      messages: [],
    }))
  }, [])

  useEffect(() => {
    if (state.isOpen && !state.isInitialized) {
      initialize()
    }
  }, [state.isOpen, state.isInitialized, initialize])

  // Subscribe to global SSE for real-time updates (works for list and conversation views)
  useEffect(() => {
    if (!state.isInitialized) {
      return
    }

    const unsubscribe = api.subscribeToUpdates(
      (data) => {
        // Skip user messages - they are already added locally
        if (data.message.senderType === 'user') {
          return
        }

        setState((s) => {
          // If this message is for the active conversation, add it to messages
          if (s.activeConversation?.id === data.conversationId) {
            // Avoid duplicates
            if (s.messages.some((m) => m.id === data.message.id)) {
              return s
            }

            // Mark as unread if widget is closed
            if (!s.isOpen) {
              setHasUnread(true)
            }

            return {
              ...s,
              messages: [...s.messages, data.message],
            }
          }

          // If on list view, mark as unread
          if (!s.isOpen) {
            setHasUnread(true)
          }

          return s
        })
      },
      (update) => {
        // Handle conversation status updates
        setState((s) => ({
          ...s,
          // Update active conversation status if it matches
          activeConversation:
            s.activeConversation?.id === update.conversationId
              ? { ...s.activeConversation, status: update.status as 'open' | 'closed' }
              : s.activeConversation,
          // Update in conversations list
          conversations: s.conversations.map((c) =>
            c.id === update.conversationId
              ? { ...c, status: update.status as 'open' | 'closed' }
              : c,
          ),
        }))
      },
      (error) => {
        console.error('[Supprt] SSE error:', error)
      },
    )

    return () => unsubscribe()
  }, [api, state.isInitialized])

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
          onSendMessage={sendMessage}
          onClose={closeWindow}
          onSelectConversation={loadConversation}
          onNewConversation={startNewConversation}
          onBackToList={backToList}
        />

        <ChatBubble
          onClick={toggleOpen}
          isOpen={state.isOpen}
          primaryColor={primaryColor}
          position={position}
          hasUnread={hasUnread}
        />
      </div>
    </I18nContext.Provider>
  )
}
