# Events

Complete reference for widget events.

## Listening to Events

### Using the API

```javascript
import { on, off } from '@supprt/widget'

// Subscribe
on('eventName', handler)

// Unsubscribe
off('eventName', handler)
```

### Using DOM Events

```javascript
document.addEventListener('supprt:eventName', (event) => {
  console.log(event.detail)
})
```

## Event Reference

### ready

Fired when the widget is fully initialized and ready to use.

```javascript
on('ready', () => {
  console.log('Widget is ready')
})
```

**Payload:** None

**Use case:** Initialize other features that depend on the widget.

---

### open

Fired when the chat window is opened.

```javascript
on('open', () => {
  console.log('Chat opened')
})
```

**Payload:** None

**Use case:** Track engagement, hide other UI elements.

---

### close

Fired when the chat window is closed.

```javascript
on('close', () => {
  console.log('Chat closed')
})
```

**Payload:** None

**Use case:** Track engagement, show other UI elements.

---

### message:sent

Fired when the user sends a message.

```javascript
on('message:sent', (message) => {
  console.log(message)
})
```

**Payload:**

```typescript
{
  id: string           // Message ID
  content: string      // Message text
  createdAt: string    // ISO timestamp
  attachments?: Array<{
    id: string
    filename: string
    url: string
  }>
}
```

**Use case:** Analytics, trigger automations.

---

### message:received

Fired when a new message is received from the support team.

```javascript
on('message:received', (message) => {
  console.log(message)
})
```

**Payload:**

```typescript
{
  id: string           // Message ID
  content: string      // Message text
  senderType: string   // 'admin' | 'bot'
  senderName: string   // Sender's name
  createdAt: string    // ISO timestamp
  attachments?: Array<{
    id: string
    filename: string
    url: string
  }>
}
```

**Use case:** Browser notifications, sound alerts.

---

### conversation:started

Fired when a new conversation is created.

```javascript
on('conversation:started', (conversation) => {
  console.log(conversation)
})
```

**Payload:**

```typescript
{
  id: string           // Conversation ID
  createdAt: string    // ISO timestamp
}
```

**Use case:** Track conversion, analytics.

---

### error

Fired when an error occurs.

```javascript
on('error', (error) => {
  console.error(error)
})
```

**Payload:**

```typescript
{
  code: string         // Error code
  message: string      // Error message
}
```

**Use case:** Error tracking, fallback UI.

---

## DOM Events

All events are also dispatched as custom DOM events with the `supprt:` prefix:

| API Event | DOM Event |
|-----------|-----------|
| `ready` | `supprt:ready` |
| `open` | `supprt:open` |
| `close` | `supprt:close` |
| `message:sent` | `supprt:message:sent` |
| `message:received` | `supprt:message:received` |
| `conversation:started` | `supprt:conversation:started` |
| `error` | `supprt:error` |

### Example

```javascript
document.addEventListener('supprt:message:received', (event) => {
  const message = event.detail
  console.log('New message:', message.content)
})
```

## Full Example

```javascript
import { init, on } from '@supprt/widget'

init({ projectId: 'YOUR_PROJECT_ID' })

// Track all events
on('ready', () => {
  analytics.track('Supprt Ready')
})

on('open', () => {
  analytics.track('Chat Opened')
})

on('close', () => {
  analytics.track('Chat Closed')
})

on('message:sent', (message) => {
  analytics.track('Message Sent', {
    messageId: message.id
  })
})

on('message:received', (message) => {
  analytics.track('Message Received', {
    messageId: message.id,
    sender: message.senderName
  })
})

on('conversation:started', (conv) => {
  analytics.track('Conversation Started', {
    conversationId: conv.id
  })
})

on('error', (error) => {
  analytics.track('Supprt Error', {
    code: error.code,
    message: error.message
  })
})
```
