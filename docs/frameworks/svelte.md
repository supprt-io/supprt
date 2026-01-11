# Svelte

Integrate Supprt with Svelte applications.

## Installation

```bash
npm install @supprt/widget
```

## Basic Usage

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import { init, destroy } from '@supprt/widget'

  onMount(() => {
    init({
      projectId: 'YOUR_PROJECT_ID'
    })
  })

  onDestroy(() => {
    destroy()
  })
</script>

<div>Your app</div>
```

## With Store

```javascript
// stores/supprt.js
import { writable } from 'svelte/store'
import { init, destroy, on, off, isInitialized } from '@supprt/widget'

export const supprtReady = writable(false)
export const unreadCount = writable(0)

export function initSupprt(config) {
  init(config)

  on('ready', () => {
    supprtReady.set(true)
  })

  on('message:received', () => {
    unreadCount.update(n => n + 1)
  })
}

export function destroySupprt() {
  destroy()
  supprtReady.set(false)
}
```

Usage:

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import { initSupprt, destroySupprt, supprtReady, unreadCount } from './stores/supprt'

  onMount(() => {
    initSupprt({ projectId: 'YOUR_PROJECT_ID' })
  })

  onDestroy(() => {
    destroySupprt()
  })
</script>

{#if $supprtReady}
  <p>Widget ready!</p>
{/if}

{#if $unreadCount > 0}
  <span class="badge">{$unreadCount}</span>
{/if}
```

## With Authentication

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import { init, destroy } from '@supprt/widget'
  import { user, isAuthenticated } from './stores/auth'

  let unsubscribe

  function initWidget($user, $isAuthenticated) {
    destroy()

    const config = {
      projectId: 'YOUR_PROJECT_ID'
    }

    if ($isAuthenticated && $user) {
      config.user = {
        id: $user.id,
        email: $user.email,
        name: $user.name
      }
    }

    init(config)
  }

  onMount(() => {
    // Subscribe to auth changes
    unsubscribe = user.subscribe($user => {
      let $isAuth
      isAuthenticated.subscribe(v => $isAuth = v)()
      initWidget($user, $isAuth)
    })
  })

  onDestroy(() => {
    unsubscribe?.()
    destroy()
  })
</script>
```

## Programmatic Control

```svelte
<script>
  import { open, close, toggle } from '@supprt/widget'
</script>

<button on:click={toggle}>
  Need help?
</button>
```

## Event Handling

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import { init, destroy, on, off } from '@supprt/widget'

  let unreadCount = 0

  function handleMessage() {
    unreadCount++
  }

  onMount(() => {
    init({ projectId: 'YOUR_PROJECT_ID' })
    on('message:received', handleMessage)
  })

  onDestroy(() => {
    off('message:received', handleMessage)
    destroy()
  })
</script>

{#if unreadCount > 0}
  <span class="badge">{unreadCount}</span>
{/if}
```

## Action

Create a Svelte action for declarative usage:

```javascript
// actions/supprt.js
import { init, destroy } from '@supprt/widget'

export function supprt(node, config) {
  init(config)

  return {
    update(newConfig) {
      destroy()
      init(newConfig)
    },
    destroy() {
      destroy()
    }
  }
}
```

Usage:

```svelte
<script>
  import { supprt } from './actions/supprt'

  const config = {
    projectId: 'YOUR_PROJECT_ID'
  }
</script>

<div use:supprt={config}>
  Your app
</div>
```

## SvelteKit

For SvelteKit, initialize in the layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte'
  import { browser } from '$app/environment'
  import { init, destroy } from '@supprt/widget'

  onMount(() => {
    if (browser) {
      init({
        projectId: 'YOUR_PROJECT_ID'
      })
    }
  })

  onDestroy(() => {
    if (browser) {
      destroy()
    }
  })
</script>

<slot />
```

## TypeScript

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { init, destroy, on, off } from '@supprt/widget'
  import type { SupprtConfig, Message } from '@supprt/widget'

  export let projectId: string
  export let user: { id: string; email: string; name: string } | undefined = undefined

  onMount(() => {
    const config: SupprtConfig = {
      projectId,
      user
    }

    init(config)

    const handleMessage = (message: Message) => {
      console.log(message.content)
    }

    on('message:received', handleMessage)

    return () => {
      off('message:received', handleMessage)
    }
  })

  onDestroy(() => {
    destroy()
  })
</script>
```

## Best Practices

1. **Use `onMount`** for client-side initialization
2. **Check `browser`** in SvelteKit for SSR safety
3. **Clean up in `onDestroy`** with `destroy()`
4. **Use stores** for reactive state management
