import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import type { AttachmentInput } from '../api'
import { SupprtApi } from '../api'
import { getTranslations } from '../i18n'
import type { Conversation, Message, SupprtConfig, WidgetState } from '../types'

const DEFAULT_PRIMARY_COLOR = '#04b3a4'
const DEFAULT_POSITION = 'bottom-right'

export interface UseWidgetReturn {
  state: WidgetState
  isComposing: boolean
  hasUnread: boolean
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  translations: ReturnType<typeof getTranslations>
  actions: {
    toggleOpen: () => void
    closeWindow: () => void
    startNewConversation: () => void
    backToList: () => void
    loadConversation: (conversation: Conversation) => Promise<void>
    sendMessage: (content: string, files?: File[]) => Promise<void>
    downloadAttachment: (attachmentId: string) => Promise<string>
  }
}

export function useWidget(config: SupprtConfig): UseWidgetReturn {
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

  const [api] = useState(() => new SupprtApi('https://api.supprt.io', config.publicKey))

  const primaryColor = config.primaryColor || state.project?.primaryColor || DEFAULT_PRIMARY_COLOR
  const position =
    config.position ||
    (state.project?.position as 'bottom-right' | 'bottom-left') ||
    DEFAULT_POSITION

  const translations = useMemo(
    () => getTranslations(config.locale || state.project?.locale || undefined),
    [config.locale, state.project?.locale],
  )

  // Initialize the widget
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

  // Load a conversation's messages
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

  // Upload files to S3
  const uploadFiles = useCallback(
    async (conversationId: string, files: File[]): Promise<AttachmentInput[]> => {
      const attachments: AttachmentInput[] = []

      for (const file of files) {
        const { uploadUrl, key } = await api.getUploadUrl(
          conversationId,
          file.name,
          file.type || 'application/octet-stream',
          file.size,
        )
        await api.uploadFile(uploadUrl, file)
        attachments.push({
          key,
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          size: file.size,
        })
      }

      return attachments
    },
    [api],
  )

  // Send a message (with optional file attachments)
  const sendMessage = useCallback(
    async (content: string, files?: File[]) => {
      setState((s) => ({ ...s, isSending: true }))

      try {
        if (state.activeConversation) {
          // Existing conversation: upload files then send message
          let attachments: AttachmentInput[] | undefined
          if (files && files.length > 0) {
            attachments = await uploadFiles(state.activeConversation.id, files)
          }

          const response = await api.sendMessage(state.activeConversation.id, content, attachments)
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
          // New conversation: create first, then upload files if any
          const response = await api.createConversation(content)
          const newMessage: Message = {
            ...response.message,
            senderType: 'user',
            createdAt: response.message.createdAt || new Date().toISOString(),
          }
          setIsComposing(false)
          setState((s) => ({
            ...s,
            activeConversation: response.conversation,
            conversations: [response.conversation, ...s.conversations],
            messages: [newMessage],
          }))

          // If there are files, upload them and send a follow-up message
          if (files && files.length > 0) {
            const attachments = await uploadFiles(response.conversation.id, files)
            const filesResponse = await api.sendMessage(response.conversation.id, '', attachments)
            const filesMessage: Message = {
              ...filesResponse.message,
              senderType: 'user',
              createdAt: filesResponse.message.createdAt || new Date().toISOString(),
            }
            setState((s) => ({
              ...s,
              isSending: false,
              messages: [...s.messages, filesMessage],
            }))
          } else {
            setState((s) => ({ ...s, isSending: false }))
          }
        }
      } catch (error) {
        setState((s) => ({
          ...s,
          isSending: false,
          error: error instanceof Error ? error.message : 'Failed to send message',
        }))
      }
    },
    [api, state.activeConversation, uploadFiles],
  )

  // Toggle widget open/close
  const toggleOpen = useCallback(() => {
    setState((s) => {
      if (!s.isOpen) {
        setHasUnread(false)
      }
      return { ...s, isOpen: !s.isOpen }
    })
  }, [])

  // Close the widget
  const closeWindow = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }))
  }, [])

  // Start composing a new conversation
  const startNewConversation = useCallback(() => {
    setIsComposing(true)
    setState((s) => ({
      ...s,
      activeConversation: null,
      messages: [],
    }))
  }, [])

  // Go back to conversation list
  const backToList = useCallback(() => {
    setIsComposing(false)
    setState((s) => ({
      ...s,
      activeConversation: null,
      messages: [],
    }))
  }, [])

  // Download an attachment
  const downloadAttachment = useCallback(
    async (attachmentId: string): Promise<string> => {
      const response = await api.getDownloadUrl(attachmentId)
      return response.downloadUrl
    },
    [api],
  )

  // Initialize on first open
  useEffect(() => {
    if (state.isOpen && !state.isInitialized) {
      initialize()
    }
  }, [state.isOpen, state.isInitialized, initialize])

  // Subscribe to real-time updates via SSE
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
          activeConversation:
            s.activeConversation?.id === update.conversationId
              ? { ...s.activeConversation, status: update.status as 'open' | 'closed' }
              : s.activeConversation,
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

  return {
    state,
    isComposing,
    hasUnread,
    primaryColor,
    position,
    translations,
    actions: {
      toggleOpen,
      closeWindow,
      startNewConversation,
      backToList,
      loadConversation,
      sendMessage,
      downloadAttachment,
    },
  }
}
