# Events

Listen to widget events to integrate with your application.

## Available Events

| Event | Description |
|-------|-------------|
| `ready` | Widget is initialized and ready |
| `open` | Widget window opened |
| `close` | Widget window closed |
| `message:sent` | User sent a message |
| `message:received` | New message received |

## Listening to Events

### Using the API

```javascript
import { init, on, off } from '@supprt/widget'

init({
  publicKey: 'pk_xxx'
})

// Listen to events
on('open', () => {
  console.log('Widget opened')
})

on('message:sent', (message) => {
  console.log('User sent:', message.content)
})

// Remove listener
const handler = () => console.log('closed')
on('close', handler)
off('close', handler)
```

### Using Custom Events

The widget dispatches custom DOM events:

```javascript
document.addEventListener('supprt:open', () => {
  console.log('Widget opened')
})

document.addEventListener('supprt:message:sent', (event) => {
  console.log('Message:', event.detail)
})
```

## Event Reference

### ready

Fired when the widget is fully initialized.

```javascript
on('ready', () => {
  console.log('Widget ready')
})
```

### open

Fired when the chat window is opened.

```javascript
on('open', () => {
  // Track analytics
  analytics.track('Chat Opened')
})
```

### close

Fired when the chat window is closed.

```javascript
on('close', () => {
  // Track analytics
  analytics.track('Chat Closed')
})
```

### message:sent

Fired when the user sends a message.

```javascript
on('message:sent', (message) => {
  console.log(message)
  // {
  //   id: 'msg_123',
  //   content: 'Hello!',
  //   createdAt: '2024-01-01T00:00:00Z'
  // }
})
```

### message:received

Fired when a new message is received.

```javascript
on('message:received', (message) => {
  console.log(message)
  // {
  //   id: 'msg_456',
  //   content: 'Hi! How can I help?',
  //   senderType: 'admin',
  //   senderName: 'Support Team',
  //   createdAt: '2024-01-01T00:00:01Z'
  // }
})
```

## Use Cases

### Analytics Integration

```javascript
import { on } from '@supprt/widget'

on('open', () => {
  gtag('event', 'chat_open', {
    event_category: 'engagement'
  })
})

on('message:sent', () => {
  gtag('event', 'chat_message_sent', {
    event_category: 'engagement'
  })
})
```

### Show/Hide Other Elements

```javascript
import { on } from '@supprt/widget'

const helpButton = document.getElementById('help-button')

on('open', () => {
  helpButton.style.display = 'none'
})

on('close', () => {
  helpButton.style.display = 'block'
})
```

### Trigger Actions on Messages

```javascript
import { on } from '@supprt/widget'

on('message:received', (message) => {
  // Show browser notification
  if (Notification.permission === 'granted') {
    new Notification('New message from Support', {
      body: message.content
    })
  }
})
```

### React Integration

```jsx
import { useEffect } from 'react'
import { init, on, off } from '@supprt/widget'

function App() {
  useEffect(() => {
    init({ publicKey: 'pk_xxx' })

    const handleOpen = () => {
      console.log('Chat opened')
    }

    on('open', handleOpen)

    return () => {
      off('open', handleOpen)
    }
  }, [])

  return <div>Your app</div>
}
```

## Next Steps

- [API Reference](/api/events)
- [Methods API](/api/methods)
- [Framework guides](/frameworks/react)
