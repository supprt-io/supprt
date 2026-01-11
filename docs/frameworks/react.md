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
      projectId: 'YOUR_PROJECT_ID'
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
import { init, destroy, on, off } from '@supprt/widget'

export function useSupprt(config, options = {}) {
  const { onOpen, onClose, onMessage } = options

  useEffect(() => {
    init(config)

    if (onOpen) on('open', onOpen)
    if (onClose) on('close', onClose)
    if (onMessage) on('message:received', onMessage)

    return () => {
      if (onOpen) off('open', onOpen)
      if (onClose) off('close', onClose)
      if (onMessage) off('message:received', onMessage)
      destroy()
    }
  }, [config.projectId])
}
```

Usage:

```jsx
import { useSupprt } from './hooks/useSupprt'

function App() {
  useSupprt(
    { projectId: 'YOUR_PROJECT_ID' },
    {
      onOpen: () => console.log('opened'),
      onMessage: (msg) => console.log('message:', msg)
    }
  )

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
      projectId: 'YOUR_PROJECT_ID'
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

## Programmatic Control

```jsx
import { useState } from 'react'
import { open, close, toggle } from '@supprt/widget'

function HelpButton() {
  return (
    <button onClick={toggle}>
      Need help?
    </button>
  )
}
```

## Event Handling

```jsx
import { useEffect, useState } from 'react'
import { init, destroy, on, off } from '@supprt/widget'

function App() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    init({ projectId: 'YOUR_PROJECT_ID' })

    const handleMessage = () => {
      setUnreadCount(c => c + 1)
    }

    on('message:received', handleMessage)

    return () => {
      off('message:received', handleMessage)
      destroy()
    }
  }, [])

  return (
    <div>
      {unreadCount > 0 && (
        <span className="badge">{unreadCount}</span>
      )}
    </div>
  )
}
```

## With Context

```jsx
// context/SupprtContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { init, destroy, on, off, isInitialized } from '@supprt/widget'

const SupprtContext = createContext(null)

export function SupprtProvider({ projectId, children }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    init({ projectId })

    const handleReady = () => setReady(true)
    on('ready', handleReady)

    return () => {
      off('ready', handleReady)
      destroy()
    }
  }, [projectId])

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
    <SupprtProvider projectId="YOUR_PROJECT_ID">
      <YourApp />
    </SupprtProvider>
  )
}
```

## TypeScript

```tsx
import { useEffect } from 'react'
import { init, destroy, on, off } from '@supprt/widget'
import type { SupprtConfig, Message } from '@supprt/widget'

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
      projectId: 'YOUR_PROJECT_ID',
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name
      } : undefined
    }

    init(config)

    const handleMessage = (message: Message) => {
      console.log(message.content)
    }

    on('message:received', handleMessage)

    return () => {
      off('message:received', handleMessage)
      destroy()
    }
  }, [user?.id])

  return <div>Your app</div>
}
```

## Best Practices

1. **Initialize once** at the app root level
2. **Clean up** with `destroy()` in the useEffect return
3. **Memoize config** to prevent unnecessary re-renders
4. **Use the user ID** in the dependency array for auth changes
