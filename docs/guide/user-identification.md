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
  projectId: 'YOUR_PROJECT_ID',
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
  src="https://cdn.supprt.io/widget.js"
  data-project-id="YOUR_PROJECT_ID"
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

### Handle Authentication Changes

Update user data when auth state changes:

```javascript
import { init, destroy } from '@supprt/widget'

// On login
function onLogin(user) {
  destroy() // Remove anonymous widget
  init({
    projectId: 'YOUR_PROJECT_ID',
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
    projectId: 'YOUR_PROJECT_ID'
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
- Self-hosting gives you full data control

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
        projectId: 'YOUR_PROJECT_ID',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        }
      })
    } else {
      init({
        projectId: 'YOUR_PROJECT_ID'
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
