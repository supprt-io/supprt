# Types

TypeScript type definitions for the widget.

## Installation

Types are included with the package. No additional installation needed.

```typescript
import type { SupprtConfig, SupprtUser } from '@supprt/widget'
```

## Type Definitions

### SupprtConfig

Main configuration object.

```typescript
interface SupprtConfig {
  /**
   * Your project's unique identifier.
   * Found in project settings on the dashboard.
   */
  projectId: string

  /**
   * API endpoint URL.
   * @default 'https://api.supprt.io'
   */
  apiUrl?: string

  /**
   * Widget position on the page.
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left'

  /**
   * Primary brand color (hex).
   * @default '#14b8a6'
   */
  primaryColor?: string

  /**
   * Welcome message shown on first open.
   */
  welcomeMessage?: string

  /**
   * CSS z-index value.
   * @default 999999
   */
  zIndex?: number

  /**
   * User identification data.
   */
  user?: SupprtUser
}
```

---

### SupprtUser

User identification object.

```typescript
interface SupprtUser {
  /**
   * Unique user identifier.
   * Use your database user ID.
   */
  id: string

  /**
   * User's email address.
   */
  email?: string

  /**
   * User's display name.
   */
  name?: string

  /**
   * URL to user's avatar image.
   */
  avatar?: string
}
```

---

### Message

Message object returned in events.

```typescript
interface Message {
  /**
   * Unique message identifier.
   */
  id: string

  /**
   * Message text content.
   */
  content: string

  /**
   * Message sender type.
   */
  senderType: 'user' | 'admin' | 'bot'

  /**
   * Sender's display name (for admin/bot).
   */
  senderName?: string

  /**
   * ISO 8601 timestamp.
   */
  createdAt: string

  /**
   * File attachments.
   */
  attachments?: Attachment[]
}
```

---

### Attachment

File attachment object.

```typescript
interface Attachment {
  /**
   * Unique attachment identifier.
   */
  id: string

  /**
   * Original filename.
   */
  filename: string

  /**
   * MIME content type.
   */
  contentType: string

  /**
   * File size in bytes.
   */
  size: number

  /**
   * Download URL.
   */
  url: string
}
```

---

### Conversation

Conversation object.

```typescript
interface Conversation {
  /**
   * Unique conversation identifier.
   */
  id: string

  /**
   * Conversation status.
   */
  status: 'open' | 'closed'

  /**
   * ISO 8601 creation timestamp.
   */
  createdAt: string

  /**
   * ISO 8601 last update timestamp.
   */
  updatedAt: string
}
```

---

### SupprtError

Error object returned in error events.

```typescript
interface SupprtError {
  /**
   * Error code for programmatic handling.
   */
  code: string

  /**
   * Human-readable error message.
   */
  message: string
}
```

---

### EventHandler

Event handler function types.

```typescript
type ReadyHandler = () => void
type OpenHandler = () => void
type CloseHandler = () => void
type MessageSentHandler = (message: Message) => void
type MessageReceivedHandler = (message: Message) => void
type ConversationStartedHandler = (conversation: Conversation) => void
type ErrorHandler = (error: SupprtError) => void
```

---

## Usage Examples

### Type-safe Configuration

```typescript
import { init } from '@supprt/widget'
import type { SupprtConfig, SupprtUser } from '@supprt/widget'

const user: SupprtUser = {
  id: 'user_123',
  email: 'john@example.com',
  name: 'John Doe'
}

const config: SupprtConfig = {
  projectId: 'YOUR_PROJECT_ID',
  primaryColor: '#8b5cf6',
  position: 'bottom-right',
  user
}

init(config)
```

### Type-safe Event Handlers

```typescript
import { on } from '@supprt/widget'
import type { Message, SupprtError } from '@supprt/widget'

on('message:received', (message: Message) => {
  console.log(message.content)
  console.log(message.senderName)
})

on('error', (error: SupprtError) => {
  console.error(`[${error.code}] ${error.message}`)
})
```

### Generic Event Handler

```typescript
import { on, off } from '@supprt/widget'
import type { Message } from '@supprt/widget'

const handler = (message: Message): void => {
  console.log(message)
}

on('message:sent', handler)
off('message:sent', handler)
```
