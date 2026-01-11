# npm Package Installation

For more control over the widget lifecycle and configuration, use the npm package.

## Installation

::: code-group

```bash [npm]
npm install @supprt/widget
```

```bash [yarn]
yarn add @supprt/widget
```

```bash [pnpm]
pnpm add @supprt/widget
```

```bash [bun]
bun add @supprt/widget
```

:::

## Basic Usage

```javascript
import { init, destroy } from '@supprt/widget'

// Initialize the widget
init({
  projectId: 'YOUR_PROJECT_ID'
})

// Later, remove the widget
destroy()
```

## Full Configuration

```javascript
import { init } from '@supprt/widget'

init({
  // Required
  projectId: 'YOUR_PROJECT_ID',

  // Optional: Custom API URL (for self-hosted)
  apiUrl: 'https://api.supprt.io',

  // Optional: Widget position
  position: 'bottom-right', // or 'bottom-left'

  // Optional: Brand color
  primaryColor: '#14b8a6',

  // Optional: Welcome message
  welcomeMessage: 'Hi! How can we help you today?',

  // Optional: CSS z-index
  zIndex: 999999,

  // Optional: User identification
  user: {
    id: 'user_123',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg'
  }
})
```

## TypeScript Support

The package includes TypeScript definitions:

```typescript
import { init, destroy, isInitialized } from '@supprt/widget'
import type { SupprtConfig, SupprtUser } from '@supprt/widget'

const user: SupprtUser = {
  id: 'user_123',
  email: 'john@example.com',
  name: 'John Doe'
}

const config: SupprtConfig = {
  projectId: 'YOUR_PROJECT_ID',
  user
}

init(config)
```

## Module Formats

The package supports multiple module formats:

```javascript
// ES Modules (recommended)
import { init } from '@supprt/widget'

// CommonJS
const { init } = require('@supprt/widget')
```

## Bundle Size

The widget is optimized for size:

| Format | Size | Gzipped |
|--------|------|---------|
| ESM | ~42 KB | ~14 KB |
| UMD | ~41 KB | ~14 KB |

## Tree Shaking

The package supports tree shaking. Only the functions you import will be included in your bundle:

```javascript
// Only imports init function
import { init } from '@supprt/widget'
```

## Framework Integration

For framework-specific integration guides, see:

- [React](/frameworks/react)
- [Vue](/frameworks/vue)
- [Svelte](/frameworks/svelte)
- [Angular](/frameworks/angular)
- [Next.js](/frameworks/nextjs)
- [Nuxt](/frameworks/nuxt)
- [Astro](/frameworks/astro)

## Next Steps

- [API Reference](/api/configuration)
- [User Identification](/guide/user-identification)
- [Customization](/guide/customization)
