# Events

::: warning Coming Soon
The events API is planned for a future release. Currently, the widget does not expose event listeners.
:::

## Planned Events

The following events are planned for future implementation:

| Event | Description |
|-------|-------------|
| `ready` | Widget is initialized and ready |
| `open` | Widget window opened |
| `close` | Widget window closed |
| `message:sent` | User sent a message |
| `message:received` | New message received |

## Current Workaround

For now, you can observe the widget state by checking the DOM:

```javascript
// Check if widget is open
const isOpen = document.querySelector('#supprt-widget-host')
  ?.shadowRoot?.querySelector('.supprt-window') !== null
```
