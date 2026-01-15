import type { Conversation, InitResponse, Message } from './types'

/**
 * Fetch-based SSE client that supports Authorization headers.
 * Native EventSource doesn't support custom headers, which would
 * expose the token in the URL (visible in browser history/logs).
 *
 * Features:
 * - Automatic reconnection with exponential backoff
 * - Configurable max retries and delays
 */
class SecureSSE {
  private controller: AbortController | null = null
  private listeners: Map<string, ((data: string) => void)[]> = new Map()
  private errorHandler: ((error: Error) => void) | null = null
  private reconnectHandler: ((attempt: number, delay: number) => void) | null = null
  private connectedHandler: (() => void) | null = null

  // Reconnection state
  private retryCount = 0
  private isClosedManually = false
  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null

  // Reconnection config
  private readonly maxRetries = 10
  private readonly baseDelay = 1000 // 1 second
  private readonly maxDelay = 30000 // 30 seconds

  constructor(
    private url: string,
    private token: string,
  ) {}

  addEventListener(event: string, handler: (data: string) => void): void {
    const handlers = this.listeners.get(event) || []
    handlers.push(handler)
    this.listeners.set(event, handlers)
  }

  onError(handler: (error: Error) => void): void {
    this.errorHandler = handler
  }

  onReconnecting(handler: (attempt: number, delay: number) => void): void {
    this.reconnectHandler = handler
  }

  onConnected(handler: () => void): void {
    this.connectedHandler = handler
  }

  private getReconnectDelay(): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (capped)
    const delay = Math.min(this.baseDelay * 2 ** this.retryCount, this.maxDelay)
    // Add jitter (±20%) to prevent thundering herd
    const jitter = delay * 0.2 * (Math.random() - 0.5)
    return Math.round(delay + jitter)
  }

  private scheduleReconnect(): void {
    if (this.isClosedManually || this.retryCount >= this.maxRetries) {
      if (this.retryCount >= this.maxRetries) {
        this.errorHandler?.(new Error('Max reconnection attempts reached'))
      }
      return
    }

    const delay = this.getReconnectDelay()
    this.retryCount++

    this.reconnectHandler?.(this.retryCount, delay)

    this.reconnectTimeoutId = setTimeout(() => {
      this.reconnectTimeoutId = null
      this.connect()
    }, delay)
  }

  async connect(): Promise<void> {
    this.controller = new AbortController()

    try {
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          Accept: 'text/event-stream',
          Authorization: `Bearer ${this.token}`,
          'Cache-Control': 'no-cache',
        },
        signal: this.controller.signal,
      })

      if (!response.ok) {
        throw new Error(`SSE connection failed: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('SSE response body is null')
      }

      // Connection successful - reset retry count
      this.retryCount = 0
      this.connectedHandler?.()

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          // Connection closed by server - attempt reconnect
          if (!this.isClosedManually) {
            this.scheduleReconnect()
          }
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || ''

        let currentEvent = 'message'
        let currentData = ''

        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.slice(6).trim()
          } else if (line.startsWith('data:')) {
            currentData = line.slice(5).trim()
          } else if (line === '' && currentData) {
            // Empty line = end of event
            const handlers = this.listeners.get(currentEvent)
            if (handlers) {
              for (const handler of handlers) {
                handler(currentData)
              }
            }
            currentEvent = 'message'
            currentData = ''
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // Manually aborted - don't reconnect
        return
      }

      // Network error or other failure - attempt reconnect
      this.errorHandler?.(error as Error)

      if (!this.isClosedManually) {
        this.scheduleReconnect()
      }
    }
  }

  close(): void {
    this.isClosedManually = true

    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId)
      this.reconnectTimeoutId = null
    }

    this.controller?.abort()
    this.controller = null
    this.listeners.clear()
    this.retryCount = 0
  }
}

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

  constructor(baseUrl: string, publicKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.publicKey = publicKey
  }

  setToken(token: string) {
    this.token = token
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

  subscribeToConversation(
    conversationId: string,
    onMessage: (message: Message) => void,
    onConversationUpdate?: (update: { status: string }) => void,
    onError?: (error: Error) => void,
  ): () => void {
    if (!this.token) {
      onError?.(new Error('Not authenticated'))
      return () => {}
    }

    const url = `${this.baseUrl}/api/v1/conversations/${conversationId}/sse`
    const sse = new SecureSSE(url, this.token)

    sse.addEventListener('message', (data) => {
      try {
        const message = JSON.parse(data)
        onMessage(message)
      } catch {
        // Ignore parse errors
      }
    })

    sse.addEventListener('conversation', (data) => {
      try {
        const update = JSON.parse(data)
        onConversationUpdate?.(update)
      } catch {
        // Ignore parse errors
      }
    })

    sse.addEventListener('connected', () => {
      console.log('[Supprt] SSE connected')
    })

    sse.onError((error) => {
      onError?.(error)
    })

    sse.connect()

    return () => sse.close()
  }

  // Global SSE subscription for all user's conversations
  subscribeToUpdates(
    onMessage: (data: { conversationId: string; message: Message }) => void,
    onConversationUpdate?: (update: { conversationId: string; status: string }) => void,
    onError?: (error: Error) => void,
    onTyping?: (data: { conversationId: string; isTyping: boolean }) => void,
    onConnectionChange?: (status: 'connected' | 'reconnecting' | 'disconnected') => void,
  ): () => void {
    if (!this.token) {
      onError?.(new Error('Not authenticated'))
      return () => {}
    }

    const url = `${this.baseUrl}/api/v1/sse`
    const sse = new SecureSSE(url, this.token)

    sse.addEventListener('message', (data) => {
      try {
        const parsed = JSON.parse(data)
        onMessage(parsed)
      } catch {
        // Ignore parse errors
      }
    })

    sse.addEventListener('conversation', (data) => {
      try {
        const update = JSON.parse(data)
        onConversationUpdate?.(update)
      } catch {
        // Ignore parse errors
      }
    })

    sse.addEventListener('typing', (data) => {
      try {
        const parsed = JSON.parse(data)
        onTyping?.(parsed)
      } catch {
        // Ignore parse errors
      }
    })

    sse.onConnected(() => {
      onConnectionChange?.('connected')
    })

    sse.onReconnecting(() => {
      onConnectionChange?.('reconnecting')
    })

    sse.onError((error) => {
      if (error.message === 'Max reconnection attempts reached') {
        onConnectionChange?.('disconnected')
      }
      onError?.(error)
    })

    sse.connect()

    return () => sse.close()
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
