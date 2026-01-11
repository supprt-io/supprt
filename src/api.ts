import type { Conversation, InitResponse, Message } from './types'

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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || `Request failed: ${response.status}`)
    }

    return response.json()
  }

  async init(user?: {
    id: string
    email?: string
    name?: string
    avatar?: string
  }): Promise<InitResponse> {
    const fingerprint = this.getFingerprint()

    const response = await this.request<InitResponse>('/api/v1/widget/init', {
      method: 'POST',
      body: JSON.stringify({
        publicKey: this.publicKey,
        user,
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
  ): Promise<{ conversation: Conversation & { messages: Message[] } }> {
    return this.request(`/api/v1/conversations/${id}`)
  }

  async createConversation(
    content: string,
  ): Promise<{ conversation: Conversation; message: Message }> {
    return this.request('/api/v1/conversations', {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  }

  async sendMessage(conversationId: string, content: string): Promise<{ message: Message }> {
    return this.request(`/api/v1/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
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

    const url = `${this.baseUrl}/api/v1/conversations/${conversationId}/sse?token=${encodeURIComponent(this.token)}`
    const eventSource = new EventSource(url)

    eventSource.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data)
        onMessage(message)
      } catch {
        // Ignore parse errors
      }
    })

    eventSource.addEventListener('conversation', (event) => {
      try {
        const update = JSON.parse(event.data)
        onConversationUpdate?.(update)
      } catch {
        // Ignore parse errors
      }
    })

    eventSource.addEventListener('connected', () => {
      console.log('[Supprt] SSE connected')
    })

    eventSource.onerror = () => {
      onError?.(new Error('Connection lost'))
    }

    return () => eventSource.close()
  }

  // Global SSE subscription for all user's conversations
  subscribeToUpdates(
    onMessage: (data: { conversationId: string; message: Message }) => void,
    onConversationUpdate?: (update: { conversationId: string; status: string }) => void,
    onError?: (error: Error) => void,
  ): () => void {
    if (!this.token) {
      onError?.(new Error('Not authenticated'))
      return () => {}
    }

    const url = `${this.baseUrl}/api/v1/sse?token=${encodeURIComponent(this.token)}`
    const eventSource = new EventSource(url)

    eventSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch {
        // Ignore parse errors
      }
    })

    eventSource.addEventListener('conversation', (event) => {
      try {
        const update = JSON.parse(event.data)
        onConversationUpdate?.(update)
      } catch {
        // Ignore parse errors
      }
    })

    eventSource.addEventListener('connected', () => {
      console.log('[Supprt] Global SSE connected')
    })

    eventSource.onerror = () => {
      onError?.(new Error('Connection lost'))
    }

    return () => eventSource.close()
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
