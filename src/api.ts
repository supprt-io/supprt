import { io, type Socket } from 'socket.io-client'
import type { Conversation, InitResponse, Message } from './types'

export interface UploadUrlResponse {
  uploadUrl: string
  key: string
}

export interface DownloadUrlResponse {
  downloadUrl: string
  filename: string
  contentType: string
  size: number
}

export interface AttachmentInput {
  key: string
  filename: string
  contentType: string
  size: number
}

export class SupprtApi {
  private baseUrl: string
  private publicKey: string
  private token: string | null = null
  private socket: Socket | null = null
  private connectionChangeHandler:
    | ((status: 'connected' | 'reconnecting' | 'disconnected') => void)
    | null = null

  constructor(baseUrl: string, publicKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.publicKey = publicKey
  }

  setToken(token: string) {
    this.token = token
  }

  /**
   * Connect to the WebSocket server for real-time updates.
   * Must be called after init() when token is available.
   */
  connectSocket(): void {
    if (!this.token) {
      console.error('[Supprt] Cannot connect socket: no token')
      return
    }

    if (this.socket?.connected) {
      return
    }

    this.socket = io(this.baseUrl, {
      auth: {
        clientType: 'widget',
        token: this.token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
    })

    this.socket.on('connect', () => {
      console.log('[Supprt] Socket connected')
      this.connectionChangeHandler?.('connected')
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[Supprt] Socket disconnected:', reason)
      if (reason === 'io server disconnect') {
        // Server closed the connection, won't auto-reconnect
        this.connectionChangeHandler?.('disconnected')
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('[Supprt] Socket connection error:', error.message)
    })

    this.socket.io.on('reconnect_attempt', () => {
      this.connectionChangeHandler?.('reconnecting')
    })

    this.socket.io.on('reconnect_failed', () => {
      this.connectionChangeHandler?.('disconnected')
    })
  }

  /**
   * Disconnect from the WebSocket server.
   */
  disconnectSocket(): void {
    if (this.socket) {
      // Typing indicator will be cleared server-side on disconnect
      this.socket.disconnect()
      this.socket = null
    }
  }

  /**
   * Get the socket instance for direct event handling.
   */
  getSocket(): Socket | null {
    return this.socket
  }

  /**
   * Join a conversation room to receive updates.
   */
  joinConversation(conversationId: string): void {
    this.socket?.emit('join', `conversation:${conversationId}`)
  }

  /**
   * Leave a conversation room.
   */
  leaveConversation(conversationId: string): void {
    this.socket?.emit('leave', `conversation:${conversationId}`)
  }

  /**
   * Send typing indicator via WebSocket.
   */
  setTyping(conversationId: string, isTyping: boolean): void {
    this.socket?.emit('typing', { conversationId, isTyping })
  }

  /**
   * Set handler for connection status changes.
   */
  onConnectionChange(
    handler: (status: 'connected' | 'reconnecting' | 'disconnected') => void,
  ): void {
    this.connectionChangeHandler = handler
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout = 15000,
  ): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      }

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || `Request failed: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timed out')
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async init(user?: {
    id: string
    email?: string
    name?: string
    avatar?: string
    metadata?: Record<string, unknown>
  }): Promise<InitResponse> {
    const fingerprint = this.getFingerprint()

    // Merge user metadata with widget version
    const userWithVersion = user
      ? {
          ...user,
          metadata: {
            _widgetVersion: __WIDGET_VERSION__,
            ...user.metadata,
          },
        }
      : undefined

    const response = await this.request<InitResponse>('/api/v1/widget/init', {
      method: 'POST',
      body: JSON.stringify({
        publicKey: this.publicKey,
        user: userWithVersion,
        fingerprint: user ? undefined : fingerprint,
      }),
    })

    this.token = response.token
    return response
  }

  async getConversations(): Promise<{ conversations: Conversation[] }> {
    return this.request('/api/v1/conversations')
  }

  async getConversation(
    id: string,
    options?: { limit?: number; before?: string },
  ): Promise<{ conversation: Conversation & { messages: Message[] }; hasMore: boolean }> {
    const params = new URLSearchParams()
    if (options?.limit) params.set('limit', options.limit.toString())
    if (options?.before) params.set('before', options.before)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request(`/api/v1/conversations/${id}${query}`)
  }

  async markAsRead(conversationId: string): Promise<void> {
    await this.request(`/api/v1/conversations/${conversationId}/read`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
  }

  async createConversation(
    content: string,
    attachments?: AttachmentInput[],
  ): Promise<{ conversation: Conversation; message: Message }> {
    return this.request('/api/v1/conversations', {
      method: 'POST',
      body: JSON.stringify({ content, attachments }),
    })
  }

  async sendMessage(
    conversationId: string,
    content: string,
    attachments?: AttachmentInput[],
  ): Promise<{ message: Message }> {
    return this.request(`/api/v1/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, attachments }),
    })
  }

  // NOTE: setTyping is now handled via WebSocket (see setTyping method above)

  async getUploadUrl(
    conversationId: string,
    filename: string,
    contentType: string,
    size: number,
  ): Promise<UploadUrlResponse> {
    return this.request(`/api/v1/conversations/${conversationId}/attachments/upload-url`, {
      method: 'POST',
      body: JSON.stringify({ filename, contentType, size }),
    })
  }

  async getDownloadUrl(attachmentId: string): Promise<DownloadUrlResponse> {
    return this.request(`/api/v1/attachments/${attachmentId}/download-url`)
  }

  async uploadFile(
    uploadUrl: string,
    file: File,
    onProgress?: (progress: number) => void,
    timeout = 60000,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const timeoutId = setTimeout(() => {
        xhr.abort()
        reject(new Error('Upload timed out'))
      }, timeout)

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100)
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        clearTimeout(timeoutId)
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100)
          resolve()
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        clearTimeout(timeoutId)
        reject(new Error('Upload failed'))
      })

      xhr.addEventListener('abort', () => {
        clearTimeout(timeoutId)
        reject(new Error('Upload cancelled'))
      })

      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
  }

  /**
   * Subscribe to real-time updates via WebSocket.
   * Uses unified Gateway event format.
   */
  subscribeToUpdates(
    onMessage: (data: { conversationId: string; message: Message }) => void,
    onConversationUpdate?: (update: { conversationId: string; status: string }) => void,
    onError?: (error: Error) => void,
    onTyping?: (data: { conversationId: string; isTyping: boolean; source: string }) => void,
  ): () => void {
    if (!this.socket) {
      onError?.(new Error('Socket not connected'))
      return () => {}
    }

    // Unified event handler for all Gateway events
    const eventHandler = (event: {
      id: string
      type: string
      timestamp: string
      source: { clientType: string; clientId?: string; integrationKind?: string }
      payload: Record<string, unknown>
    }) => {
      switch (event.type) {
        case 'message.created': {
          const payload = event.payload as {
            conversationId: string
            message: Message
          }
          onMessage({
            conversationId: payload.conversationId,
            message: payload.message,
          })
          break
        }
        case 'conversation.status': {
          const payload = event.payload as {
            conversationId: string
            status: string
          }
          onConversationUpdate?.({
            conversationId: payload.conversationId,
            status: payload.status,
          })
          break
        }
        case 'typing': {
          const payload = event.payload as {
            conversationId: string
            isTyping: boolean
          }
          onTyping?.({
            conversationId: payload.conversationId,
            isTyping: payload.isTyping,
            source: event.source.integrationKind ?? event.source.clientType,
          })
          break
        }
      }
    }

    this.socket.on('event', eventHandler)

    // Return cleanup function
    return () => {
      this.socket?.off('event', eventHandler)
    }
  }

  private getFingerprint(): string {
    const key = 'supprt_fp'
    let fingerprint = localStorage.getItem(key)

    if (!fingerprint) {
      fingerprint = this.generateFingerprint()
      localStorage.setItem(key, fingerprint)
    }

    return fingerprint
  }

  private generateFingerprint(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
  }
}
