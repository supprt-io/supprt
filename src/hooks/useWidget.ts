import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import type { AttachmentInput } from '../api'
import { SupprtApi } from '../api'
import { getTranslations } from '../i18n'
import type { Conversation, Message, SupprtConfig, WidgetState } from '../types'

const DEFAULT_PRIMARY_COLOR = '#04b3a4'
const DEFAULT_POSITION = 'bottom-right'

export interface UploadProgress {
  filename: string
  progress: number
}

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected' | 'offline'

export type InitFailureReason = 'invalid_key' | 'server_unreachable' | null

export interface QueuedMessage {
  content: string
  files?: File[]
  timestamp: number
}

export interface UseWidgetReturn {
  state: WidgetState
  isComposing: boolean
  hasUnread: boolean
  isAgentTyping: boolean
  uploadProgress: UploadProgress | null
  connectionStatus: ConnectionStatus
  queuedMessages: QueuedMessage[]
  hasMoreMessages: boolean
  isLoadingMore: boolean
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  customStyle: Record<string, string> | undefined
  translations: ReturnType<typeof getTranslations>
  initFailed: InitFailureReason
  actions: {
    toggleOpen: () => void
    closeWindow: () => void
    startNewConversation: () => void
    backToList: () => void
    loadConversation: (conversation: Conversation) => Promise<void>
    loadMoreMessages: () => Promise<void>
    sendMessage: (content: string, files?: File[]) => Promise<void>
    setTyping: (isTyping: boolean) => void
    downloadAttachment: (attachmentId: string) => Promise<string>
    clearError: () => void
    retry: () => void
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

  const [isComposing, setIsComposing] = useState(false)
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'connected',
  )
  const [queuedMessages, setQueuedMessages] = useState<QueuedMessage[]>([])
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [initFailed, setInitFailed] = useState<InitFailureReason>(null)
  const initializingRef = useRef(false)
  const processingQueueRef = useRef(false)
  // Set for O(1) message duplicate checks
  const messageIdsRef = useRef<Set<string>>(new Set())

  const [api] = useState(
    () => new SupprtApi(config.apiUrl || 'https://api.supprt.io', config.publicKey),
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

  // Compute hasUnread from conversations
  const hasUnread = useMemo(
    () => state.conversations.some((c) => c.hasUnread),
    [state.conversations],
  )

  // Initialize the widget
  const initialize = useCallback(async () => {
    if (initializingRef.current) return
    initializingRef.current = true

    setState((s) => ({ ...s, isLoading: true, error: null }))

    try {
      const response = await api.init(config.user)

      // Connect WebSocket after initialization
      api.connectSocket()

      // Set up connection status handler
      api.onConnectionChange((status) => {
        if (navigator.onLine) {
          setConnectionStatus(status)
        }
      })

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
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize'

      // Determine failure reason based on error type
      const isInvalidKey =
        errorMessage.includes('401') ||
        errorMessage.includes('403') ||
        errorMessage.includes('Invalid') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('Project not found')

      const isServerUnreachable =
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('timed out') ||
        errorMessage.includes('Network request failed')

      if (isInvalidKey) {
        setInitFailed('invalid_key')
        console.warn(
          '[Supprt] Widget not loaded: Invalid or revoked API key. Please check your publicKey configuration.',
        )
      } else if (isServerUnreachable) {
        setInitFailed('server_unreachable')
        console.warn(
          '[Supprt] Widget not loaded: Unable to reach the server. Please check your network connection or API URL.',
        )
      } else {
        // For other errors, still set as failed but with generic message
        setInitFailed('server_unreachable')
        console.warn(`[Supprt] Widget not loaded: ${errorMessage}`)
      }

      setState((s) => ({
        ...s,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [api, config.user])

  // Load a conversation's messages
  const loadConversation = useCallback(
    async (conversation: Conversation) => {
      // Leave previous conversation room if any
      if (state.activeConversation) {
        api.leaveConversation(state.activeConversation.id)
      }
      // Join new conversation room
      api.joinConversation(conversation.id)

      setIsComposing(false)
      setHasMoreMessages(false)
      setState((s) => ({
        ...s,
        activeConversation: conversation,
        isLoading: true,
      }))

      try {
        const response = await api.getConversation(conversation.id)
        // Rebuild the message IDs Set for O(1) duplicate checks
        messageIdsRef.current = new Set(response.conversation.messages.map((m) => m.id))
        setHasMoreMessages(response.hasMore)

        // Mark as read if conversation has unread messages
        if (conversation.hasUnread) {
          await api.markAsRead(conversation.id)
          // Update local state to reflect read status
          setState((s) => ({
            ...s,
            isLoading: false,
            messages: response.conversation.messages,
            conversations: s.conversations.map((c) =>
              c.id === conversation.id ? { ...c, hasUnread: false } : c,
            ),
          }))
        } else {
          setState((s) => ({
            ...s,
            isLoading: false,
            messages: response.conversation.messages,
          }))
        }
      } catch (error) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load messages',
        }))
      }
    },
    [api, state.activeConversation],
  )

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!state.activeConversation || isLoadingMore || !hasMoreMessages) return

    const oldestMessage = state.messages[0]
    if (!oldestMessage) return

    setIsLoadingMore(true)

    try {
      const response = await api.getConversation(state.activeConversation.id, {
        before: oldestMessage.id,
      })

      // Add new messages to the Set
      for (const msg of response.conversation.messages) {
        messageIdsRef.current.add(msg.id)
      }

      setHasMoreMessages(response.hasMore)
      setState((s) => ({
        ...s,
        messages: [...response.conversation.messages, ...s.messages],
      }))
    } catch (error) {
      setState((s) => ({
        ...s,
        error: error instanceof Error ? error.message : 'Failed to load more messages',
      }))
    } finally {
      setIsLoadingMore(false)
    }
  }, [api, state.activeConversation, state.messages, isLoadingMore, hasMoreMessages])

  // Upload files to S3
  const uploadFiles = useCallback(
    async (conversationId: string, files: File[]): Promise<AttachmentInput[]> => {
      const attachments: AttachmentInput[] = []

      for (const file of files) {
        setUploadProgress({ filename: file.name, progress: 0 })

        const { uploadUrl, key } = await api.getUploadUrl(
          conversationId,
          file.name,
          file.type || 'application/octet-stream',
          file.size,
        )

        await api.uploadFile(uploadUrl, file, (progress) => {
          setUploadProgress({ filename: file.name, progress })
        })

        attachments.push({
          key,
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          size: file.size,
        })
      }

      setUploadProgress(null)
      return attachments
    },
    [api],
  )

  // Send a message (with optional file attachments)
  const sendMessageInternal = useCallback(
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
          messageIdsRef.current.add(newMessage.id)
          setState((s) => ({
            ...s,
            isSending: false,
            messages: [...s.messages, newMessage],
          }))
        } else {
          // New conversation: create first, then upload files if any
          const response = await api.createConversation(content)
          // Join the new conversation room
          api.joinConversation(response.conversation.id)

          const newMessage: Message = {
            ...response.message,
            senderType: 'user',
            createdAt: response.message.createdAt || new Date().toISOString(),
          }
          // Reset the Set for the new conversation
          messageIdsRef.current = new Set([newMessage.id])
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
            messageIdsRef.current.add(filesMessage.id)
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

  // Queue message when offline, send immediately when online
  const sendMessage = useCallback(
    async (content: string, files?: File[]) => {
      if (!isOnline) {
        // Queue the message for later (only text, files need network)
        if (files && files.length > 0) {
          setState((s) => ({
            ...s,
            error: 'Cannot send files while offline',
          }))
          return
        }
        setQueuedMessages((prev) => [...prev, { content, timestamp: Date.now() }])
        return
      }
      await sendMessageInternal(content, files)
    },
    [isOnline, sendMessageInternal],
  )

  // Set typing status via WebSocket
  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!api || !state.activeConversation) return
      // Fire and forget via WebSocket
      api.setTyping(state.activeConversation.id, isTyping)
    },
    [api, state.activeConversation],
  )

  // Process queued messages when back online
  const processQueue = useCallback(async () => {
    if (processingQueueRef.current || queuedMessages.length === 0) return
    processingQueueRef.current = true

    const queue = [...queuedMessages]
    setQueuedMessages([])

    for (const msg of queue) {
      try {
        await sendMessageInternal(msg.content, msg.files)
      } catch {
        // Re-queue failed messages
        setQueuedMessages((prev) => [...prev, msg])
      }
    }

    processingQueueRef.current = false
  }, [queuedMessages, sendMessageInternal])

  // Toggle widget open/close
  const toggleOpen = useCallback(() => {
    setState((s) => ({ ...s, isOpen: !s.isOpen }))
  }, [])

  // Close the widget
  const closeWindow = useCallback(() => {
    // Stop typing indicator when closing
    if (state.activeConversation) {
      api.setTyping(state.activeConversation.id, false)
    }
    setState((s) => ({ ...s, isOpen: false }))
  }, [api, state.activeConversation])

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
    // Stop typing indicator and leave room when going back
    if (state.activeConversation) {
      api.setTyping(state.activeConversation.id, false)
      api.leaveConversation(state.activeConversation.id)
    }
    setIsComposing(false)
    setHasMoreMessages(false)
    messageIdsRef.current.clear()

    setState((s) => {
      // Update conversation in list with latest message and sort
      const lastMessage = s.messages[s.messages.length - 1] || null
      const now = new Date().toISOString()

      const updatedConversations = s.conversations
        .map((c) =>
          c.id === s.activeConversation?.id
            ? { ...c, lastMessage, updatedAt: lastMessage ? now : c.updatedAt }
            : c,
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

      return {
        ...s,
        activeConversation: null,
        messages: [],
        conversations: updatedConversations,
      }
    })
  }, [api, state.activeConversation])

  // Clear error
  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }))
  }, [])

  // Retry initialization
  const retry = useCallback(() => {
    initializingRef.current = false
    setState((s) => ({ ...s, error: null, isInitialized: false }))
    initialize()
  }, [initialize])

  // Download an attachment
  const downloadAttachment = useCallback(
    async (attachmentId: string): Promise<string> => {
      const response = await api.getDownloadUrl(attachmentId)
      return response.downloadUrl
    },
    [api],
  )

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setConnectionStatus('connected')
    }

    const handleOffline = () => {
      setIsOnline(false)
      setConnectionStatus('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Process queued messages when back online
  useEffect(() => {
    if (isOnline && queuedMessages.length > 0) {
      processQueue()
    }
  }, [isOnline, queuedMessages.length, processQueue])

  // Initialize on mount to establish SSE connection early
  // This allows receiving messages even when widget is closed
  useEffect(() => {
    if (!state.isInitialized) {
      initialize()
    }
  }, [state.isInitialized, initialize])

  // Subscribe to real-time updates via WebSocket
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

        // Clear typing indicator when a new message arrives
        setIsAgentTyping(false)

        // O(1) duplicate check using Set
        if (messageIdsRef.current.has(data.message.id)) {
          return
        }

        setState((s) => {
          // If this message is for the active conversation, add it to messages
          if (s.activeConversation?.id === data.conversationId) {
            // Add to the Set
            messageIdsRef.current.add(data.message.id)

            return {
              ...s,
              messages: [...s.messages, data.message],
            }
          }

          // Update the conversation's hasUnread status and lastMessage
          const updatedConversations = s.conversations
            .map((c) =>
              c.id === data.conversationId
                ? {
                    ...c,
                    hasUnread: true,
                    lastMessage: data.message,
                    updatedAt: new Date().toISOString(),
                  }
                : c,
            )
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

          return {
            ...s,
            conversations: updatedConversations,
          }
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
      () => {
        // Errors handled via connection status
      },
      (typingData) => {
        // Handle typing indicator events (only from integrations, not from self/widget)
        if (
          typingData.source !== 'widget' &&
          typingData.conversationId === state.activeConversation?.id
        ) {
          setIsAgentTyping(typingData.isTyping)
        }
      },
    )

    return () => {
      unsubscribe()
    }
  }, [api, state.isInitialized, state.activeConversation?.id])

  return {
    state,
    isComposing,
    hasUnread,
    isAgentTyping,
    uploadProgress,
    connectionStatus,
    queuedMessages,
    hasMoreMessages,
    isLoadingMore,
    primaryColor,
    position,
    customStyle: config.style,
    translations,
    initFailed,
    actions: {
      toggleOpen,
      closeWindow,
      startNewConversation,
      backToList,
      loadConversation,
      loadMoreMessages,
      sendMessage,
      setTyping,
      downloadAttachment,
      clearError,
      retry,
    },
  }
}
