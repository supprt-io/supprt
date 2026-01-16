# Configuration

Complete reference for widget configuration options.

## SupprtConfig

The configuration object passed to `init()`.

```typescript
interface SupprtConfig {
  publicKey: string
  position?: 'bottom-right' | 'bottom-left'
  style?: Record<string, string>
  primaryColor?: string
  zIndex?: number
  locale?: 'en' | 'fr' | 'es' | 'de'
  user?: SupprtUser
}
```

## Options

### publicKey

- **Type:** `string`
- **Required:** Yes

Your project's public key. Found in your project settings on the dashboard.

```javascript
init({
  publicKey: 'pk_xxx'
})
```

### position

- **Type:** `'bottom-right' | 'bottom-left'`
- **Required:** No
- **Default:** `'bottom-right'`

Position of the widget on the page. For precise positioning, use `containerStyle` instead.

```javascript
init({
  publicKey: 'pk_xxx',
  position: 'bottom-left'
})
```

### style

- **Type:** `Record<string, string>`
- **Required:** No
- **Default:** `undefined`

Custom CSS styles for the widget. When provided, these styles are applied directly to the bubble and window elements, giving you full control over positioning.

```javascript
// Position widget 100px from bottom, 50px from right
init({
  publicKey: 'pk_xxx',
  style: {
    bottom: '100px',
    right: '50px'
  }
})

// Position widget in top-right corner
init({
  publicKey: 'pk_xxx',
  style: {
    top: '20px',
    right: '20px'
  }
})

// Use absolute positioning within a container
init({
  publicKey: 'pk_xxx',
  style: {
    position: 'absolute',
    bottom: '0',
    right: '0'
  }
})
```

::: tip
When `style` is provided, the default positioning is reset. You have full control over where the widget appears using standard CSS properties.
:::

### primaryColor

- **Type:** `string`
- **Required:** No
- **Default:** `'#14b8a6'`

The primary brand color used for buttons and accents. Must be a valid hex color.

```javascript
init({
  publicKey: 'pk_xxx',
  primaryColor: '#8b5cf6'
})
```

### zIndex

- **Type:** `number`
- **Required:** No
- **Default:** `999999`

The CSS z-index of the widget. Increase if the widget appears behind other elements.

```javascript
init({
  publicKey: 'pk_xxx',
  zIndex: 2147483647 // Maximum z-index
})
```

### locale

- **Type:** `'en' | 'fr' | 'es' | 'de'`
- **Required:** No
- **Default:** `'en'`

The UI language for the widget.

```javascript
init({
  publicKey: 'pk_xxx',
  locale: 'fr'
})
```

### user

- **Type:** `SupprtUser`
- **Required:** No
- **Default:** `undefined`

User information for identified users. See [SupprtUser](#supprtuser).

```javascript
init({
  publicKey: 'pk_xxx',
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
  metadata?: Record<string, unknown>
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

### metadata

- **Type:** `Record<string, unknown>`
- **Required:** No

Custom key-value pairs for additional user context. This data is displayed to your support team in the dashboard.

```javascript
init({
  publicKey: 'pk_xxx',
  user: {
    id: 'user_123',
    email: 'john@example.com',
    metadata: {
      plan: 'pro',
      company: 'Acme Inc',
      signupDate: '2026-01-15'
    }
  }
})
```

::: tip Widget Version
The widget automatically includes `_widgetVersion` in metadata to help your team debug version-specific issues.
:::

## Data Attributes

When using the script tag, configuration is passed via data attributes:

| Attribute | Config Property |
|-----------|-----------------|
| `data-public-key` | `publicKey` |
| `data-position` | `position` |
| `data-primary-color` | `primaryColor` |
| `data-z-index` | `zIndex` |
| `data-locale` | `locale` |
| `data-user-id` | `user.id` |
| `data-user-email` | `user.email` |
| `data-user-name` | `user.name` |
| `data-user-avatar` | `user.avatar` |

## Full Example

```javascript
import { init } from '@supprt/widget'

init({
  // Required
  publicKey: 'pk_xxx',

  // Appearance
  position: 'bottom-right',
  primaryColor: '#14b8a6',
  zIndex: 999999,

  // Localization
  locale: 'en',

  // User identification
  user: {
    id: 'user_123',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    metadata: {
      plan: 'pro',
      company: 'Acme Inc',
      role: 'admin'
    }
  }
})
```

## Full Example with Custom Positioning

```javascript
import { init } from '@supprt/widget'

init({
  // Required
  publicKey: 'pk_xxx',

  // Custom positioning (overrides default position)
  style: {
    bottom: '100px',
    right: '50px'
  },

  // Appearance
  primaryColor: '#8b5cf6',
  zIndex: 999999,

  // Localization
  locale: 'en',

  // User identification
  user: {
    id: 'user_123',
    email: 'john@example.com',
    name: 'John Doe'
  }
})
```
