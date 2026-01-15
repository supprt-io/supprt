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
      publicKey: 'pk_xxx'
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
import { init, destroy, isInitialized } from '@supprt/widget'

export function initSupprt(config) {
  init(config)
}

export function destroySupprt() {
  destroy()
}

export { isInitialized }
```

Usage:

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import { initSupprt, destroySupprt } from './stores/supprt'

  onMount(() => {
    initSupprt({ publicKey: 'pk_xxx' })
  })

  onDestroy(() => {
    destroySupprt()
  })
</script>

<div>Your app</div>
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
      publicKey: 'pk_xxx'
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
    publicKey: 'pk_xxx'
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
        publicKey: 'pk_xxx'
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
  import { init, destroy } from '@supprt/widget'
  import type { SupprtConfig } from '@supprt/widget'

  export let publicKey: string
  export let user: { id: string; email: string; name: string } | undefined = undefined

  onMount(() => {
    const config: SupprtConfig = {
      publicKey,
      user
    }

    init(config)
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
