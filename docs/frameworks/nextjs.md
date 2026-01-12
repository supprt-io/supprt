# Next.js

Integrate Supprt with Next.js applications.

## Installation

```bash
npm install @supprt/widget
```

## App Router (Next.js 13+)

### Basic Setup

Create a client component for the widget:

```tsx
// components/Supprt.tsx
'use client'

import { useEffect } from 'react'
import { init, destroy } from '@supprt/widget'

export function Supprt() {
  useEffect(() => {
    init({
      publicKey: 'pk_xxx'
    })

    return () => destroy()
  }, [])

  return null
}
```

Add to your root layout:

```tsx
// app/layout.tsx
import { Supprt } from '@/components/Supprt'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Supprt />
      </body>
    </html>
  )
}
```

### With Authentication

```tsx
// components/Supprt.tsx
'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { init, destroy } from '@supprt/widget'

export function Supprt() {
  const { data: session } = useSession()

  useEffect(() => {
    const config = {
      publicKey: 'pk_xxx',
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.image
      } : undefined
    }

    init(config)

    return () => destroy()
  }, [session?.user?.id])

  return null
}
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPPRT_PUBLIC_KEY=pk_xxx
```

```tsx
// components/Supprt.tsx
'use client'

import { useEffect } from 'react'
import { init, destroy } from '@supprt/widget'

export function Supprt() {
  useEffect(() => {
    init({
      publicKey: process.env.NEXT_PUBLIC_SUPPRT_PUBLIC_KEY!
    })

    return () => destroy()
  }, [])

  return null
}
```

## Pages Router

### Basic Setup

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { init, destroy } from '@supprt/widget'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    init({
      publicKey: 'pk_xxx'
    })

    return () => destroy()
  }, [])

  return <Component {...pageProps} />
}
```

### With Authentication

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { init, destroy } from '@supprt/widget'

export default function App({ Component, pageProps }: AppProps) {
  const { data: session } = useSession()

  useEffect(() => {
    const config = {
      publicKey: 'pk_xxx',
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined
      } : undefined
    }

    init(config)

    return () => destroy()
  }, [session?.user?.id])

  return <Component {...pageProps} />
}
```

## Conditional Loading

Only load on certain pages:

```tsx
// components/Supprt.tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { init, destroy } from '@supprt/widget'

const SUPPRT_PAGES = ['/support', '/contact', '/help']

export function Supprt() {
  const pathname = usePathname()
  const shouldShow = SUPPRT_PAGES.some(p => pathname.startsWith(p))

  useEffect(() => {
    if (shouldShow) {
      init({ publicKey: 'pk_xxx' })
      return () => destroy()
    }
  }, [shouldShow])

  return null
}
```

## Dynamic Import

For better performance, load the widget dynamically:

```tsx
// components/Supprt.tsx
'use client'

import { useEffect, useState } from 'react'

export function Supprt() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    import('@supprt/widget').then(({ init }) => {
      init({ publicKey: 'pk_xxx' })
      setLoaded(true)
    })

    return () => {
      import('@supprt/widget').then(({ destroy }) => {
        destroy()
      })
    }
  }, [])

  return null
}
```

## Script Tag Alternative

If you prefer the script tag approach:

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://unpkg.com/@supprt/widget"
          data-public-key="pk_xxx"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
```

## TypeScript

```tsx
// components/Supprt.tsx
'use client'

import { useEffect } from 'react'
import { init, destroy } from '@supprt/widget'
import type { SupprtConfig } from '@supprt/widget'

interface SupprtProps {
  publicKey: string
  user?: {
    id: string
    email?: string
    name?: string
  }
}

export function Supprt({ publicKey, user }: SupprtProps) {
  useEffect(() => {
    const config: SupprtConfig = {
      publicKey,
      user
    }

    init(config)

    return () => destroy()
  }, [publicKey, user?.id])

  return null
}
```

## Best Practices

1. **Use client components** (`'use client'`) for the widget
2. **Initialize in layout** for app-wide availability
3. **Use environment variables** for the project ID
4. **Handle auth changes** with useEffect dependencies
5. **Consider lazy loading** for better initial page load
