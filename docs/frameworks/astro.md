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
      src="https://cdn.supprt.io/widget.js"
      data-project-id="YOUR_PROJECT_ID"
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
        projectId: 'YOUR_PROJECT_ID'
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
  projectId: string
  position?: 'bottom-right' | 'bottom-left'
  primaryColor?: string
}

const { projectId, position, primaryColor } = Astro.props
---

<script
  define:vars={{ projectId, position, primaryColor }}
>
  import { init } from '@supprt/widget'

  init({
    projectId,
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
      projectId="YOUR_PROJECT_ID"
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
  projectId: string
}

export default function SupprtWidget({ projectId }: Props) {
  useEffect(() => {
    init({ projectId })
    return () => destroy()
  }, [projectId])

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
    <SupprtWidget client:load projectId="YOUR_PROJECT_ID" />
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
  projectId: String
})

onMounted(() => {
  init({ projectId: props.projectId })
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
<SupprtWidget client:load projectId="YOUR_PROJECT_ID" />
```

## Environment Variables

```bash
# .env
PUBLIC_SUPPRT_PROJECT_ID=your_project_id
```

```astro
---
// src/layouts/Layout.astro
const projectId = import.meta.env.PUBLIC_SUPPRT_PROJECT_ID
---
<script define:vars={{ projectId }}>
  import { init } from '@supprt/widget'
  init({ projectId })
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
        init({ projectId: 'YOUR_PROJECT_ID' })
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
    projectId: 'YOUR_PROJECT_ID',
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
        init({ projectId: 'YOUR_PROJECT_ID' })
      }

      // Re-initialize after view transitions
      document.addEventListener('astro:page-load', () => {
        if (!isInitialized()) {
          init({ projectId: 'YOUR_PROJECT_ID' })
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
