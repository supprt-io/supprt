# @supprt/widget

[![npm version](https://img.shields.io/npm/v/@supprt/widget.svg)](https://www.npmjs.com/package/@supprt/widget)
[![npm downloads](https://img.shields.io/npm/dm/@supprt/widget.svg)](https://www.npmjs.com/package/@supprt/widget)
[![CI](https://github.com/supprt-io/supprt/actions/workflows/ci.yml/badge.svg)](https://github.com/supprt-io/supprt/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Embeddable chat widget for customer support. Works with **any framework** - React, Vue, Svelte, Angular, or vanilla JavaScript.

## Installation

### Option 1: Script Tag (Recommended)

Add this single line to your HTML, just before the closing `</body>` tag:

```html
<script src="https://cdn.supprt.dev/widget.js" data-supprt-key="pk_live_xxx"></script>
```

That's it! The widget will automatically appear on your site.

#### Configuration via data attributes

```html
<script
  src="https://cdn.supprt.dev/widget.js"
  data-supprt-key="pk_live_xxx"
  data-api-url="https://api.supprt.dev"
  data-position="bottom-right"
  data-color="#04b3a4"
></script>
```

### Option 2: NPM Package

```bash
npm install @supprt/widget
```

#### Vanilla JavaScript

```javascript
import { init } from '@supprt/widget'

init({
  publicKey: 'pk_live_xxx',
  apiUrl: 'https://api.supprt.dev', // optional
  position: 'bottom-right',         // optional: 'bottom-right' | 'bottom-left'
  primaryColor: '#04b3a4',          // optional
})
```

#### React

```jsx
import { useEffect } from 'react'
import { init, destroy } from '@supprt/widget'

function App() {
  useEffect(() => {
    init({
      publicKey: 'pk_live_xxx',
    })

    return () => destroy()
  }, [])

  return <div>Your app content</div>
}
```

#### Vue

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { init, destroy } from '@supprt/widget'

onMounted(() => {
  init({
    publicKey: 'pk_live_xxx',
  })
})

onUnmounted(() => {
  destroy()
})
</script>
```

#### Svelte

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import { init, destroy } from '@supprt/widget'

  onMount(() => {
    init({
      publicKey: 'pk_live_xxx',
    })
  })

  onDestroy(() => {
    destroy()
  })
</script>
```

#### Angular

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core'
import { init, destroy } from '@supprt/widget'

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, OnDestroy {
  ngOnInit() {
    init({
      publicKey: 'pk_live_xxx',
    })
  }

  ngOnDestroy() {
    destroy()
  }
}
```

## API

### `init(config)`

Initialize the widget with the given configuration.

```typescript
interface SupprtConfig {
  publicKey: string              // Required: Your project's public key
  apiUrl?: string                // Optional: API URL (defaults to https://api.supprt.dev)
  position?: 'bottom-right' | 'bottom-left'  // Optional: Widget position
  primaryColor?: string          // Optional: Brand color (hex)
  zIndex?: number                // Optional: CSS z-index
  user?: {                       // Optional: Identify the user
    id: string
    email?: string
    name?: string
    avatar?: string
  }
}
```

### `destroy()`

Remove the widget from the page.

### `isInitialized()`

Returns `true` if the widget is currently active.

## User Identification

For authenticated users, pass user data to link conversations:

```javascript
import { init } from '@supprt/widget'

init({
  publicKey: 'pk_live_xxx',
  user: {
    id: 'user_123',           // Required: Unique user ID
    email: 'user@example.com', // Optional
    name: 'John Doe',          // Optional
    avatar: 'https://...',     // Optional
  },
})
```

## Style Isolation

The widget uses Shadow DOM for complete style isolation. Your CSS won't affect the widget, and the widget's CSS won't affect your site.

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome for Android)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start

```bash
git clone https://github.com/supprt-io/supprt.git
cd supprt
npm install
npm run dev
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## License

MIT - see [LICENSE](LICENSE) for details.
