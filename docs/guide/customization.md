# Customization

Customize the widget's appearance to match your brand.

## Colors

### Primary Color

The primary color affects buttons, links, and accents:

```javascript
init({
  publicKey: 'pk_xxx',
  primaryColor: '#14b8a6' // Teal
})
```

```html
<script
  src="https://unpkg.com/@supprt/widget"
  data-public-key="pk_xxx"
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

### Presets

Place the widget in either bottom corner using the `position` preset:

```javascript
init({
  publicKey: 'pk_xxx',
  position: 'bottom-right' // or 'bottom-left'
})
```

| Value | Description |
|-------|-------------|
| `bottom-right` | Bottom-right corner (default) |
| `bottom-left` | Bottom-left corner |

### Custom Positioning

For full control over positioning, use the `style` option. This lets you apply any CSS properties to the widget:

```javascript
// Position widget higher up
init({
  publicKey: 'pk_xxx',
  style: {
    bottom: '100px',
    right: '50px'
  }
})

// Position in top-right corner
init({
  publicKey: 'pk_xxx',
  style: {
    top: '20px',
    right: '20px'
  }
})

// Use absolute positioning within a parent container
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
When using `style`, the default `position: fixed` and offset values are reset. You have full control over the widget placement.
:::

## Z-Index

Control the stacking order:

```javascript
init({
  publicKey: 'pk_xxx',
  zIndex: 999999 // Default
})
```

Use a higher value if the widget appears behind other elements.

## Locale

Set the UI language:

```javascript
init({
  publicKey: 'pk_xxx',
  locale: 'fr' // 'en', 'fr', 'es', 'de'
})
```

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
  publicKey: 'pk_xxx',

  // Appearance
  primaryColor: '#8b5cf6',
  position: 'bottom-right',
  zIndex: 999999,

  // Localization
  locale: 'en',

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
