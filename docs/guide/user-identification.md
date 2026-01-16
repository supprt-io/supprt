# User Identification

Identify logged-in users to provide personalized support and track conversation history.

## Why Identify Users?

When you identify users:
- **Conversation history** is preserved across sessions
- **User context** is shown to your support team
- **User profiles** are linked in the dashboard

Without identification, users are tracked anonymously via fingerprinting.

## Identifying Users

### With npm Package

```javascript
import { init } from '@supprt/widget'

init({
  publicKey: 'pk_xxx',
  user: {
    id: 'user_123',           // Required: Unique user ID
    email: 'john@example.com', // Optional
    name: 'John Doe',          // Optional
    avatar: 'https://...'      // Optional: Avatar URL
  }
})
```

### With Script Tag

```html
<script
  src="https://unpkg.com/@supprt/widget"
  data-public-key="pk_xxx"
  data-user-id="user_123"
  data-user-email="john@example.com"
  data-user-name="John Doe"
></script>
```

## User Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the user |
| `email` | string | No | User's email address |
| `name` | string | No | User's display name |
| `avatar` | string | No | URL to user's avatar image |
| `metadata` | object | No | Custom key-value pairs for context |

## Best Practices

### Use Consistent IDs

Always use the same ID for a user across sessions:

```javascript
// ✅ Good: Use your database user ID
user: { id: user.id }

// ❌ Bad: Using email as ID (can change)
user: { id: user.email }

// ❌ Bad: Generated IDs (different each session)
user: { id: crypto.randomUUID() }
```

### Provide Complete Data

The more data you provide, the better context your team has:

```javascript
// ✅ Better
user: {
  id: 'user_123',
  email: 'john@example.com',
  name: 'John Doe',
  avatar: user.avatarUrl
}

// 😐 Minimal
user: {
  id: 'user_123'
}
```

## Custom Metadata

Use metadata to provide additional context to your support team. This data is displayed in the dashboard alongside user information.

### Common Use Cases

```javascript
// SaaS Application
user: {
  id: 'user_123',
  email: 'john@example.com',
  metadata: {
    plan: 'pro',
    company: 'Acme Inc',
    role: 'admin',
    trialEndsAt: '2026-02-15'
  }
}

// E-commerce
user: {
  id: 'user_123',
  metadata: {
    orderCount: 5,
    lastOrderId: 'ord_abc123',
    lifetimeValue: 499.99,
    preferredCurrency: 'EUR'
  }
}

// Mobile App
user: {
  id: 'user_123',
  metadata: {
    appVersion: '2.1.0',
    platform: 'ios',
    deviceModel: 'iPhone 15',
    osVersion: '17.2'
  }
}
```

### Widget Version

The widget automatically includes `_widgetVersion` in metadata. This helps your team identify version-specific issues:

```json
{
  "_widgetVersion": "1.2.0",
  "plan": "pro",
  "company": "Acme Inc"
}
```

::: tip
Metadata is merged with the automatic widget version, so you don't need to include it yourself.
:::

### Handle Authentication Changes

Update user data when auth state changes:

```javascript
import { init, destroy } from '@supprt/widget'

// On login
function onLogin(user) {
  destroy() // Remove anonymous widget
  init({
    publicKey: 'pk_xxx',
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  })
}

// On logout
function onLogout() {
  destroy() // Remove authenticated widget
  init({
    publicKey: 'pk_xxx'
    // No user = anonymous mode
  })
}
```

## Anonymous Users

When no user is provided, Supprt uses browser fingerprinting:

- Fingerprint is generated from browser characteristics
- Stored in localStorage for persistence
- Conversations are linked to the fingerprint

::: info
Anonymous users can still have continuous conversations within the same browser. Their history is preserved via the fingerprint.
:::

## Privacy Considerations

- User data is transmitted securely via HTTPS
- Data is stored encrypted at rest
- You can delete user data via the API

## Security

::: warning
Never include sensitive data in user properties:
- Passwords
- API keys
- Payment information
- Social security numbers
:::

## Example: React with Auth

```jsx
import { useEffect } from 'react'
import { useAuth } from './auth-context'
import { init, destroy } from '@supprt/widget'

function App() {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      init({
        publicKey: 'pk_xxx',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        }
      })
    } else {
      init({
        publicKey: 'pk_xxx'
      })
    }

    return () => destroy()
  }, [isAuthenticated, user])

  return <div>{/* Your app */}</div>
}
```

## Next Steps

- [Customize the widget](/guide/customization)
- [Handle events](/guide/events)
- [API Reference](/api/configuration)
