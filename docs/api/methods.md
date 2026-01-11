# Methods

API reference for widget methods.

## init()

Initialize and mount the widget.

```typescript
function init(config: SupprtConfig): void
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `SupprtConfig` | Widget configuration |

### Example

```javascript
import { init } from '@supprt/widget'

init({
  projectId: 'YOUR_PROJECT_ID',
  primaryColor: '#8b5cf6'
})
```

### Behavior

- Creates and mounts the widget element
- Establishes connection to the API
- Loads conversation history (if user identified)
- Does nothing if already initialized

---

## destroy()

Remove the widget from the page.

```typescript
function destroy(): void
```

### Example

```javascript
import { destroy } from '@supprt/widget'

destroy()
```

### Behavior

- Removes the widget element from DOM
- Closes any open connections
- Cleans up event listeners
- Does nothing if not initialized

---

## isInitialized()

Check if the widget is currently active.

```typescript
function isInitialized(): boolean
```

### Returns

`true` if the widget is mounted and active, `false` otherwise.

### Example

```javascript
import { init, isInitialized } from '@supprt/widget'

if (!isInitialized()) {
  init({ projectId: 'YOUR_PROJECT_ID' })
}
```

---

## on()

Subscribe to widget events.

```typescript
function on(event: string, handler: Function): void
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `event` | `string` | Event name |
| `handler` | `Function` | Event handler function |

### Example

```javascript
import { on } from '@supprt/widget'

on('open', () => {
  console.log('Widget opened')
})

on('message:sent', (message) => {
  console.log('Sent:', message.content)
})
```

### Available Events

See [Events API](/api/events) for full event reference.

---

## off()

Unsubscribe from widget events.

```typescript
function off(event: string, handler: Function): void
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `event` | `string` | Event name |
| `handler` | `Function` | The same handler function passed to `on()` |

### Example

```javascript
import { on, off } from '@supprt/widget'

const handler = () => console.log('opened')

on('open', handler)

// Later...
off('open', handler)
```

---

## open()

Programmatically open the chat window.

```typescript
function open(): void
```

### Example

```javascript
import { open } from '@supprt/widget'

document.getElementById('help-btn').addEventListener('click', () => {
  open()
})
```

---

## close()

Programmatically close the chat window.

```typescript
function close(): void
```

### Example

```javascript
import { close } from '@supprt/widget'

// Close after sending a message
on('message:sent', () => {
  setTimeout(close, 2000)
})
```

---

## toggle()

Toggle the chat window open/closed.

```typescript
function toggle(): void
```

### Example

```javascript
import { toggle } from '@supprt/widget'

document.getElementById('chat-toggle').addEventListener('click', toggle)
```

---

## Complete Example

```javascript
import {
  init,
  destroy,
  isInitialized,
  open,
  close,
  toggle,
  on,
  off
} from '@supprt/widget'

// Initialize
init({
  projectId: 'YOUR_PROJECT_ID'
})

// Check status
console.log('Initialized:', isInitialized())

// Listen to events
on('ready', () => {
  console.log('Widget ready!')
})

// Control programmatically
document.getElementById('open-chat').onclick = open
document.getElementById('close-chat').onclick = close
document.getElementById('toggle-chat').onclick = toggle

// Cleanup on page unload
window.addEventListener('beforeunload', destroy)
```
