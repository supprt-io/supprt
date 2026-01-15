# React

Integrate Supprt with React applications.

## Installation

```bash
npm install @supprt/widget
```

## Basic Usage

```jsx
import { useEffect } from 'react'
import { init, destroy } from '@supprt/widget'

function App() {
  useEffect(() => {
    init({
      publicKey: 'pk_xxx'
    })

    return () => destroy()
  }, [])

  return <div>Your app</div>
}
```

## Custom Hook

Create a reusable hook:

```jsx
// hooks/useSupprt.js
import { useEffect } from 'react'
import { init, destroy } from '@supprt/widget'

export function useSupprt(config) {
  useEffect(() => {
    init(config)
    return () => destroy()
  }, [config.publicKey])
}
```

Usage:

```jsx
import { useSupprt } from './hooks/useSupprt'

function App() {
  useSupprt({ publicKey: 'pk_xxx' })

  return <div>Your app</div>
}
```

## With Authentication

```jsx
import { useEffect } from 'react'
import { useAuth } from './auth-context'
import { init, destroy } from '@supprt/widget'

function App() {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const config = {
      publicKey: 'pk_xxx'
    }

    if (isAuthenticated && user) {
      config.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    }

    init(config)

    return () => destroy()
  }, [isAuthenticated, user?.id])

  return <div>Your app</div>
}
```

## With Context

```jsx
// context/SupprtContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { init, destroy, isInitialized } from '@supprt/widget'

const SupprtContext = createContext(null)

export function SupprtProvider({ publicKey, user, children }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    init({ publicKey, user })
    setReady(true)

    return () => destroy()
  }, [publicKey, user?.id])

  return (
    <SupprtContext.Provider value={{ ready, isInitialized }}>
      {children}
    </SupprtContext.Provider>
  )
}

export const useSupprtContext = () => useContext(SupprtContext)
```

Usage:

```jsx
import { SupprtProvider } from './context/SupprtContext'

function App() {
  return (
    <SupprtProvider publicKey="pk_xxx">
      <YourApp />
    </SupprtProvider>
  )
}
```

## TypeScript

```tsx
import { useEffect } from 'react'
import { init, destroy } from '@supprt/widget'
import type { SupprtConfig } from '@supprt/widget'

interface Props {
  user?: {
    id: string
    email: string
    name: string
  }
}

function App({ user }: Props) {
  useEffect(() => {
    const config: SupprtConfig = {
      publicKey: 'pk_xxx',
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name
      } : undefined
    }

    init(config)

    return () => destroy()
  }, [user?.id])

  return <div>Your app</div>
}
```

## Best Practices

1. **Initialize once** at the app root level
2. **Clean up** with `destroy()` in the useEffect return
3. **Memoize config** to prevent unnecessary re-renders
4. **Use the user ID** in the dependency array for auth changes
