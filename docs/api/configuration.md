# Configuration

Complete reference for widget configuration options.

## SupprtConfig

The configuration object passed to `init()`.

```typescript
interface SupprtConfig {
  projectId: string
  apiUrl?: string
  position?: 'bottom-right' | 'bottom-left'
  primaryColor?: string
  welcomeMessage?: string
  zIndex?: number
  user?: SupprtUser
}
```

## Options

### projectId

- **Type:** `string`
- **Required:** Yes

Your project's unique identifier. Found in your project settings on the dashboard.

```javascript
init({
  projectId: 'proj_abc123'
})
```

### apiUrl

- **Type:** `string`
- **Required:** No
- **Default:** `'https://api.supprt.io'`

The API endpoint URL. Only change this if you're self-hosting.

```javascript
init({
  projectId: 'proj_abc123',
  apiUrl: 'https://api.your-domain.com'
})
```

### position

- **Type:** `'bottom-right' | 'bottom-left'`
- **Required:** No
- **Default:** `'bottom-right'`

Position of the widget on the page.

```javascript
init({
  projectId: 'proj_abc123',
  position: 'bottom-left'
})
```

### primaryColor

- **Type:** `string`
- **Required:** No
- **Default:** `'#14b8a6'`

The primary brand color used for buttons and accents. Must be a valid hex color.

```javascript
init({
  projectId: 'proj_abc123',
  primaryColor: '#8b5cf6'
})
```

### welcomeMessage

- **Type:** `string`
- **Required:** No
- **Default:** `undefined`

A welcome message shown when the user first opens the widget.

```javascript
init({
  projectId: 'proj_abc123',
  welcomeMessage: 'Hi! 👋 How can we help you today?'
})
```

### zIndex

- **Type:** `number`
- **Required:** No
- **Default:** `999999`

The CSS z-index of the widget. Increase if the widget appears behind other elements.

```javascript
init({
  projectId: 'proj_abc123',
  zIndex: 2147483647 // Maximum z-index
})
```

### user

- **Type:** `SupprtUser`
- **Required:** No
- **Default:** `undefined`

User information for identified users. See [SupprtUser](#supprtuser).

```javascript
init({
  projectId: 'proj_abc123',
  user: {
    id: 'user_123',
    email: 'john@example.com',
    name: 'John Doe'
  }
})
```

## SupprtUser

User identification object.

```typescript
interface SupprtUser {
  id: string
  email?: string
  name?: string
  avatar?: string
}
```

### id

- **Type:** `string`
- **Required:** Yes

A unique identifier for the user. Use your database user ID.

### email

- **Type:** `string`
- **Required:** No

The user's email address. Shown to your support team.

### name

- **Type:** `string`
- **Required:** No

The user's display name. Shown to your support team.

### avatar

- **Type:** `string`
- **Required:** No

URL to the user's avatar image.

## Data Attributes

When using the script tag, configuration is passed via data attributes:

| Attribute | Config Property |
|-----------|-----------------|
| `data-project-id` | `projectId` |
| `data-api-url` | `apiUrl` |
| `data-position` | `position` |
| `data-primary-color` | `primaryColor` |
| `data-welcome-message` | `welcomeMessage` |
| `data-z-index` | `zIndex` |
| `data-user-id` | `user.id` |
| `data-user-email` | `user.email` |
| `data-user-name` | `user.name` |
| `data-user-avatar` | `user.avatar` |

## Full Example

```javascript
import { init } from '@supprt/widget'

init({
  // Required
  projectId: 'proj_abc123',

  // API
  apiUrl: 'https://api.supprt.io',

  // Appearance
  position: 'bottom-right',
  primaryColor: '#14b8a6',
  zIndex: 999999,

  // Content
  welcomeMessage: 'Welcome! How can we help?',

  // User identification
  user: {
    id: 'user_123',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg'
  }
})
```
