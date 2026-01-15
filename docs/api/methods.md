# Methods

API reference for widget methods.

## init()

Initialize and mount the widget.

```typescript
function init(config: SupprtConfig): SupprtInstance
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `SupprtConfig` | Widget configuration |

### Returns

Returns a `SupprtInstance` object with a `destroy()` method.

### Example

```javascript
import { init } from '@supprt/widget'

const widget = init({
  publicKey: 'pk_xxx',
  primaryColor: '#8b5cf6'
})

// Later, to remove the widget:
widget.destroy()
```

### Behavior

- Creates and mounts the widget element in a Shadow DOM
- Establishes connection to the API
- Loads conversation history (if user identified)
- Returns an instance for cleanup

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
  init({ publicKey: 'pk_xxx' })
}
```

---

## Complete Example

```javascript
import { init, destroy, isInitialized } from '@supprt/widget'

// Initialize
const widget = init({
  publicKey: 'pk_xxx',
  user: {
    id: 'user_123',
    email: 'john@example.com',
    name: 'John Doe'
  }
})

// Check status
console.log('Initialized:', isInitialized())

// Cleanup on page unload
window.addEventListener('beforeunload', destroy)
```

## Global API (Script Tag)

When using the script tag, the widget is available globally:

```javascript
// Initialize
window.Supprt.init({
  publicKey: 'pk_xxx'
})

// Check status
window.Supprt.isInitialized()

// Destroy
window.Supprt.destroy()
```
