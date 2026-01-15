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
    publicKey: config.public.supprtPublicKey
  })

  // Clean up on app unmount
  nuxtApp.hook('app:beforeMount', () => {
    init({
      publicKey: config.public.supprtPublicKey
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
      supprtPublicKey: process.env.NUXT_PUBLIC_SUPPRT_PUBLIC_KEY
    }
  }
})
```

Environment variables:

```bash
# .env
NUXT_PUBLIC_SUPPRT_PUBLIC_KEY=pk_xxx
```

## Composable

Create a composable for more control:

```typescript
// composables/useSupprt.ts
import { init, destroy, isInitialized } from '@supprt/widget'
import type { SupprtConfig } from '@supprt/widget'

export function useSupprt() {
  const config = useRuntimeConfig()

  function initialize(options: Partial<SupprtConfig> = {}) {
    if (import.meta.client) {
      init({
        publicKey: config.public.supprtPublicKey,
        ...options
      })
    }
  }

  function cleanup() {
    if (import.meta.client) {
      destroy()
    }
  }

  onMounted(() => {
    initialize()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
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
useSupprt()
</script>

<template>
  <div>
    <NuxtPage />
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
      publicKey: config.public.supprtPublicKey,
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

## Module (Advanced)

Create a Nuxt module for better DX:

```typescript
// modules/supprt/index.ts
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  publicKey: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'supprt',
    configKey: 'supprt'
  },
  defaults: {
    publicKey: ''
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add runtime config
    nuxt.options.runtimeConfig.public.supprtPublicKey = options.publicKey

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
    publicKey: 'pk_xxx'
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
      init({ publicKey: config.public.supprtPublicKey })
    } else {
      destroy()
    }
  }, { immediate: true })
})
```

## Best Practices

1. **Use `.client.ts`** suffix for client-only plugins
2. **Check `import.meta.client`** for SSR safety
3. **Use runtime config** for public key
4. **Create composables** for reusable logic
5. **Watch auth state** to reinitialize with user data
