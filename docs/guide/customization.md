# Customization

Customize the widget's appearance to match your brand.

## Colors

### Primary Color

The primary color affects buttons, links, and accents:

```javascript
init({
  projectId: 'YOUR_PROJECT_ID',
  primaryColor: '#14b8a6' // Teal
})
```

```html
<script
  src="https://cdn.supprt.io/widget.js"
  data-project-id="YOUR_PROJECT_ID"
  data-primary-color="#14b8a6"
></script>
```

### Color Examples

| Color | Hex | Preview |
|-------|-----|---------|
| Teal (default) | `#14b8a6` | 🟢 |
| Blue | `#3b82f6` | 🔵 |
| Purple | `#8b5cf6` | 🟣 |
| Pink | `#ec4899` | 🩷 |
| Orange | `#f97316` | 🟠 |
| Green | `#22c55e` | 🟢 |

::: tip
Choose a color with good contrast against white. The widget automatically adjusts text color for readability.
:::

## Position

Place the widget in either bottom corner:

```javascript
init({
  projectId: 'YOUR_PROJECT_ID',
  position: 'bottom-right' // or 'bottom-left'
})
```

### Position Values

| Value | Description |
|-------|-------------|
| `bottom-right` | Bottom-right corner (default) |
| `bottom-left` | Bottom-left corner |

## Z-Index

Control the stacking order:

```javascript
init({
  projectId: 'YOUR_PROJECT_ID',
  zIndex: 999999 // Default
})
```

Use a higher value if the widget appears behind other elements.

## Welcome Message

Set a custom greeting:

```javascript
init({
  projectId: 'YOUR_PROJECT_ID',
  welcomeMessage: 'Hi there! 👋 How can we help you today?'
})
```

::: info
The welcome message appears when a user opens the widget for the first time.
:::

## Dark Mode

The widget automatically detects and matches your site's color scheme:

- Uses `prefers-color-scheme` media query
- Respects system preferences
- Smooth transitions between modes

No configuration needed!

## Style Isolation

The widget uses Shadow DOM, which means:

- ✅ Your CSS won't affect the widget
- ✅ Widget CSS won't affect your site
- ✅ No class name conflicts
- ✅ Consistent appearance everywhere

## Full Example

```javascript
init({
  projectId: 'YOUR_PROJECT_ID',

  // Appearance
  primaryColor: '#8b5cf6',
  position: 'bottom-right',
  zIndex: 999999,

  // Content
  welcomeMessage: 'Welcome! How can we assist you?',

  // User (optional)
  user: {
    id: 'user_123',
    name: 'John Doe'
  }
})
```

## Hiding the Widget

Temporarily hide the widget without destroying it:

```javascript
// Hide
document.querySelector('supprt-widget')?.setAttribute('hidden', '')

// Show
document.querySelector('supprt-widget')?.removeAttribute('hidden')
```

## CSS Custom Properties

For advanced customization, you can override CSS custom properties on the widget's host element:

```css
supprt-widget {
  --supprt-primary: #8b5cf6;
  --supprt-radius: 12px;
}
```

::: warning
CSS custom property support is limited due to Shadow DOM isolation. For most use cases, use the JavaScript configuration.
:::

## Next Steps

- [Handle events](/guide/events)
- [API Reference](/api/configuration)
- [Framework guides](/frameworks/react)
