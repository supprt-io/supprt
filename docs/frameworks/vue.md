# Vue

Integrate Supprt with Vue 3 applications.

## Installation

```bash
npm install @supprt/widget
```

## Basic Usage

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { init, destroy } from '@supprt/widget'

onMounted(() => {
  init({
    publicKey: 'pk_xxx'
  })
})

onUnmounted(() => {
  destroy()
})
</script>

<template>
  <div>Your app</div>
</template>
```

## Composable

Create a reusable composable:

```javascript
// composables/useSupprt.js
import { onMounted, onUnmounted, ref } from 'vue'
import { init, destroy, on, off, isInitialized } from '@supprt/widget'

export function useSupprt(config) {
  const ready = ref(false)

  onMounted(() => {
    init(config)

    on('ready', () => {
      ready.value = true
    })
  })

  onUnmounted(() => {
    destroy()
  })

  return {
    ready,
    isInitialized
  }
}
```

Usage:

```vue
<script setup>
import { useSupprt } from '@/composables/useSupprt'

const { ready } = useSupprt({
  publicKey: 'pk_xxx'
})
</script>

<template>
  <div v-if="ready">Widget is ready!</div>
</template>
```

## With Authentication

```vue
<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { init, destroy } from '@supprt/widget'

const { user, isAuthenticated } = useAuth()

function initWidget() {
  destroy() // Clean up previous instance

  const config = {
    publicKey: 'pk_xxx'
  }

  if (isAuthenticated.value && user.value) {
    config.user = {
      id: user.value.id,
      email: user.value.email,
      name: user.value.name
    }
  }

  init(config)
}

onMounted(() => {
  initWidget()
})

watch([isAuthenticated, () => user.value?.id], () => {
  initWidget()
})

onUnmounted(() => {
  destroy()
})
</script>
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
import { onMounted, onUnmounted, ref } from 'vue'
import { init, destroy, on, off } from '@supprt/widget'

const unreadCount = ref(0)

onMounted(() => {
  init({ publicKey: 'pk_xxx' })

  on('message:received', () => {
    unreadCount.value++
  })
})

onUnmounted(() => {
  destroy()
})
</script>

<template>
  <span v-if="unreadCount > 0" class="badge">
    {{ unreadCount }}
  </span>
</template>
```

## Plugin

Create a Vue plugin for global access:

```javascript
// plugins/supprt.js
import { init, destroy } from '@supprt/widget'

export const SupprtPlugin = {
  install(app, options) {
    init(options)

    app.config.globalProperties.$supprt = {
      destroy
    }

    // Clean up on app unmount
    const originalUnmount = app.unmount
    app.unmount = function() {
      destroy()
      originalUnmount.call(this)
    }
  }
}
```

Usage:

```javascript
// main.js
import { createApp } from 'vue'
import { SupprtPlugin } from './plugins/supprt'
import App from './App.vue'

const app = createApp(App)

app.use(SupprtPlugin, {
  publicKey: 'pk_xxx'
})

app.mount('#app')
```

## TypeScript

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { init, destroy, on, off } from '@supprt/widget'
import type { SupprtConfig, Message } from '@supprt/widget'

interface Props {
  publicKey: string
  user?: {
    id: string
    email: string
    name: string
  }
}

const props = defineProps<Props>()

onMounted(() => {
  const config: SupprtConfig = {
    publicKey: props.publicKey,
    user: props.user
  }

  init(config)

  const handleMessage = (message: Message) => {
    console.log(message.content)
  }

  on('message:received', handleMessage)
})

onUnmounted(() => {
  destroy()
})
</script>
```

## Options API

```vue
<script>
import { init, destroy, on, off } from '@supprt/widget'

export default {
  mounted() {
    init({
      publicKey: 'pk_xxx'
    })

    on('message:received', this.handleMessage)
  },

  beforeUnmount() {
    off('message:received', this.handleMessage)
    destroy()
  },

  methods: {
    handleMessage(message) {
      console.log(message)
    }
  }
}
</script>
```

## Best Practices

1. **Initialize in `onMounted`** to ensure DOM is ready
2. **Clean up in `onUnmounted`** with `destroy()`
3. **Watch auth state** to reinitialize with user data
4. **Use composables** for reusable logic
