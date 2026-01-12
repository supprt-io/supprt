# Astro

Integrate Supprt with Astro applications.

## Installation

```bash
npm install @supprt/widget
```

## Script Tag (Simplest)

Add to your layout:

```astro
---
// src/layouts/Layout.astro
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>My Site</title>
  </head>
  <body>
    <slot />
    <script
      src="https://unpkg.com/@supprt/widget"
      data-public-key="pk_xxx"
    ></script>
  </body>
</html>
```

## Inline Script

```astro
---
// src/layouts/Layout.astro
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>My Site</title>
  </head>
  <body>
    <slot />
    <script>
      import { init } from '@supprt/widget'

      init({
        publicKey: 'pk_xxx'
      })
    </script>
  </body>
</html>
```

## Component

Create a reusable component:

```astro
---
// src/components/Supprt.astro
interface Props {
  publicKey: string
  position?: 'bottom-right' | 'bottom-left'
  primaryColor?: string
}

const { publicKey, position, primaryColor } = Astro.props
---

<script
  define:vars={{ publicKey, position, primaryColor }}
>
  import { init } from '@supprt/widget'

  init({
    publicKey,
    position,
    primaryColor
  })
</script>
```

Usage:

```astro
---
// src/layouts/Layout.astro
import Supprt from '../components/Supprt.astro'
---
<html lang="en">
  <body>
    <slot />
    <Supprt
      publicKey="pk_xxx"
      position="bottom-right"
      primaryColor="#8b5cf6"
    />
  </body>
</html>
```

## With React/Vue/Svelte Islands

If you're using framework components:

### React Island

```tsx
// src/components/SupprtWidget.tsx
import { useEffect } from 'react'
import { init, destroy } from '@supprt/widget'

interface Props {
  publicKey: string
}

export default function SupprtWidget({ publicKey }: Props) {
  useEffect(() => {
    init({ publicKey })
    return () => destroy()
  }, [publicKey])

  return null
}
```

```astro
---
// src/layouts/Layout.astro
import SupprtWidget from '../components/SupprtWidget'
---
<html lang="en">
  <body>
    <slot />
    <SupprtWidget client:load publicKey="pk_xxx" />
  </body>
</html>
```

### Vue Island

```vue
<!-- src/components/SupprtWidget.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { init, destroy } from '@supprt/widget'

const props = defineProps({
  publicKey: String
})

onMounted(() => {
  init({ publicKey: props.publicKey })
})

onUnmounted(() => {
  destroy()
})
</script>

<template>
  <div></div>
</template>
```

```astro
---
import SupprtWidget from '../components/SupprtWidget.vue'
---
<SupprtWidget client:load publicKey="pk_xxx" />
```

## Environment Variables

```bash
# .env
PUBLIC_SUPPRT_PUBLIC_KEY=pk_xxx
```

```astro
---
// src/layouts/Layout.astro
const publicKey = import.meta.env.PUBLIC_SUPPRT_PUBLIC_KEY
---
<script define:vars={{ publicKey }}>
  import { init } from '@supprt/widget'
  init({ publicKey })
</script>
```

## Conditional Loading

Only load on certain pages:

```astro
---
// src/layouts/Layout.astro
const { pathname } = Astro.url
const showSupprt = ['/support', '/contact', '/help'].some(p =>
  pathname.startsWith(p)
)
---
<html lang="en">
  <body>
    <slot />
    {showSupprt && (
      <script>
        import { init } from '@supprt/widget'
        init({ publicKey: 'pk_xxx' })
      </script>
    )}
  </body>
</html>
```

## With User Data

For authenticated users, you'll need to pass data from the server:

```astro
---
// src/layouts/Layout.astro
const user = await getUser(Astro.request) // Your auth logic
---
<script define:vars={{ user }}>
  import { init } from '@supprt/widget'

  init({
    publicKey: 'pk_xxx',
    user: user ? {
      id: user.id,
      email: user.email,
      name: user.name
    } : undefined
  })
</script>
```

## View Transitions

If using Astro's View Transitions:

```astro
---
// src/layouts/Layout.astro
import { ViewTransitions } from 'astro:transitions'
---
<html lang="en">
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
    <script>
      import { init, destroy, isInitialized } from '@supprt/widget'

      // Initialize on first load
      if (!isInitialized()) {
        init({ publicKey: 'pk_xxx' })
      }

      // Re-initialize after view transitions
      document.addEventListener('astro:page-load', () => {
        if (!isInitialized()) {
          init({ publicKey: 'pk_xxx' })
        }
      })
    </script>
  </body>
</html>
```

## Best Practices

1. **Add to layout** for site-wide availability
2. **Use `define:vars`** to pass data to scripts
3. **Use environment variables** for configuration
4. **Handle View Transitions** if using them
5. **Use `client:load`** for framework islands
