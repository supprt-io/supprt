# Events

::: warning Coming Soon
The events API is planned for a future release. Currently, the widget does not expose event listeners.
:::

## Planned Features

In a future release, you'll be able to listen to widget events:

```javascript
import { init, on } from '@supprt/widget'

init({ publicKey: 'pk_xxx' })

on('open', () => {
  console.log('Widget opened')
})

on('message:received', (message) => {
  console.log('New message:', message.content)
})
```

## Planned Events

| Event | Description |
|-------|-------------|
| `ready` | Widget is initialized and ready |
| `open` | Widget window opened |
| `close` | Widget window closed |
| `message:sent` | User sent a message |
| `message:received` | New message received |

## Next Steps

- [Configuration](/api/configuration)
- [Methods API](/api/methods)
