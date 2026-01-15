# Types

TypeScript type definitions for the widget.

## Installation

Types are included with the package. No additional installation needed.

```typescript
import type { SupprtConfig } from '@supprt/widget'
```

## Type Definitions

### SupprtConfig

Main configuration object.

```typescript
interface SupprtConfig {
  /**
   * Your project's public key.
   * Found in project settings on the dashboard.
   */
  publicKey: string

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
   * CSS z-index value.
   * @default 999999
   */
  zIndex?: number

  /**
   * UI language.
   * @default 'en'
   */
  locale?: 'en' | 'fr' | 'es' | 'de'

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

  /**
   * Custom metadata for additional context.
   * Displayed to your support team in the dashboard.
   */
  metadata?: Record<string, unknown>
}
```

---

### Message

Message object.

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
  senderType: 'user' | 'agent' | 'bot'

  /**
   * Sender's display name (for agent/bot).
   */
  senderName?: string

  /**
   * Sender's avatar URL.
   */
  senderAvatarUrl?: string

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
   * Last message in the conversation.
   */
  lastMessage?: Message | null

  /**
   * Whether there are unread messages.
   */
  hasUnread: boolean

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

## Usage Examples

### Type-safe Configuration

```typescript
import { init } from '@supprt/widget'
import type { SupprtConfig } from '@supprt/widget'

const config: SupprtConfig = {
  publicKey: 'pk_xxx',
  primaryColor: '#8b5cf6',
  position: 'bottom-right',
  locale: 'en',
  user: {
    id: 'user_123',
    email: 'john@example.com',
    name: 'John Doe'
  }
}

init(config)
```
