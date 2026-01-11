# Nuxt

Integrate Supprt with Nuxt 3 applications.

## Installation

```bash
npm install @supprt/widget
```

## Plugin

Create a Nuxt plugin for the widget:

```typescript
// plugins/supprt.client.ts
import { init, destroy } from '@supprt/widget'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  init({
    projectId: config.public.supprtProjectId
  })

  // Clean up on app unmount
  nuxtApp.hook('app:beforeMount', () => {
    init({
      projectId: config.public.supprtProjectId
    })
  })
})
```

Configure in `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      supprtProjectId: process.env.NUXT_PUBLIC_SUPPRT_PROJECT_ID
    }
  }
})
```

Environment variables:

```bash
# .env
NUXT_PUBLIC_SUPPRT_PROJECT_ID=your_project_id
```

## Composable

Create a composable for more control:

```typescript
// composables/useSupprt.ts
import { init, destroy, on, off, isInitialized } from '@supprt/widget'
import type { SupprtConfig } from '@supprt/widget'

export function useSupprt() {
  const ready = ref(false)
  const config = useRuntimeConfig()

  function initialize(options: Partial<SupprtConfig> = {}) {
    if (import.meta.client) {
      init({
        projectId: config.public.supprtProjectId,
        ...options
      })

      on('ready', () => {
        ready.value = true
      })
    }
  }

  function cleanup() {
    if (import.meta.client) {
      destroy()
      ready.value = false
    }
  }

  onMounted(() => {
    initialize()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    ready: readonly(ready),
    initialize,
    cleanup,
    isInitialized
  }
}
```

Usage:

```vue
<!-- app.vue -->
<script setup>
const { ready } = useSupprt()
</script>

<template>
  <div>
    <NuxtPage />
    <div v-if="ready">Widget ready!</div>
  </div>
</template>
```

## With Authentication

```typescript
// composables/useSupprt.ts
import { init, destroy } from '@supprt/widget'

export function useSupprt() {
  const { data: session } = useAuth()
  const config = useRuntimeConfig()

  function initialize() {
    if (!import.meta.client) return

    destroy()

    const supprtConfig = {
      projectId: config.public.supprtProjectId,
      user: session.value?.user ? {
        id: session.value.user.id,
        email: session.value.user.email,
        name: session.value.user.name
      } : undefined
    }

    init(supprtConfig)
  }

  watch(() => session.value?.user?.id, () => {
    initialize()
  })

  onMounted(() => {
    initialize()
  })

  onUnmounted(() => {
    destroy()
  })
}
```

## Programmatic Control

```vue
<script setup>
import { open, close, toggle } from '@supprt/widget'
</script>

<template>
  <button @click="toggle">Need help?</button>
</template>
```

## Event Handling

```vue
<script setup>
import { on, off } from '@supprt/widget'

const unreadCount = ref(0)

onMounted(() => {
  on('message:received', () => {
    unreadCount.value++
  })
})

onUnmounted(() => {
  // Clean up handled by plugin
})
</script>

<template>
  <span v-if="unreadCount > 0" class="badge">
    {{ unreadCount }}
  </span>
</template>
```

## Module (Advanced)

Create a Nuxt module for better DX:

```typescript
// modules/supprt/index.ts
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  projectId: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'supprt',
    configKey: 'supprt'
  },
  defaults: {
    projectId: ''
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add runtime config
    nuxt.options.runtimeConfig.public.supprtProjectId = options.projectId

    // Add plugin
    addPlugin(resolver.resolve('./runtime/plugin.client'))
  }
})
```

Usage in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['./modules/supprt'],
  supprt: {
    projectId: 'YOUR_PROJECT_ID'
  }
})
```

## Conditional Loading

Only load on certain pages:

```typescript
// plugins/supprt.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  const route = useRoute()
  const config = useRuntimeConfig()

  const supportPages = ['/support', '/contact', '/help']

  watch(() => route.path, (path) => {
    const shouldShow = supportPages.some(p => path.startsWith(p))

    if (shouldShow) {
      init({ projectId: config.public.supprtProjectId })
    } else {
      destroy()
    }
  }, { immediate: true })
})
```

## Best Practices

1. **Use `.client.ts`** suffix for client-only plugins
2. **Check `import.meta.client`** for SSR safety
3. **Use runtime config** for project ID
4. **Create composables** for reusable logic
5. **Watch auth state** to reinitialize with user data
