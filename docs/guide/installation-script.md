# Script Tag Installation

The simplest way to add Supprt to your website is with a script tag. No build tools required.

## Basic Installation

Add this line before your closing `</body>` tag:

```html
<script
  src="https://unpkg.com/@supprt/widget"
  data-public-key="pk_xxx"
></script>
```

## Configuration via Data Attributes

You can configure the widget using `data-*` attributes:

```html
<script
  src="https://unpkg.com/@supprt/widget"
  data-public-key="pk_xxx"
  data-position="bottom-right"
  data-primary-color="#14b8a6"
  data-locale="en"
  data-z-index="9999"
></script>
```

### Available Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-public-key` | Your public key (required) | - |
| `data-position` | Widget position | `bottom-right` |
| `data-primary-color` | Brand color (hex) | `#14b8a6` |
| `data-locale` | UI language | `en` |
| `data-z-index` | CSS z-index | `999999` |

## User Identification

To identify logged-in users, add user data attributes:

```html
<script
  src="https://unpkg.com/@supprt/widget"
  data-public-key="pk_xxx"
  data-user-id="user_123"
  data-user-email="john@example.com"
  data-user-name="John Doe"
></script>
```

::: warning
Don't include sensitive user data in HTML attributes. For dynamic user identification, use the [npm package](/guide/installation-npm) instead.
:::

## Loading from unpkg

The widget is served from unpkg for fast loading:

```
https://unpkg.com/@supprt/widget
```

### Specific Version

To pin a specific version:

```html
<script src="https://unpkg.com/@supprt/widget@0.0.3"></script>
```

### Subresource Integrity (SRI)

For added security, use SRI:

```html
<script
  src="https://unpkg.com/@supprt/widget@0.0.3"
  integrity="sha384-..."
  crossorigin="anonymous"
  data-public-key="pk_xxx"
></script>
```

## Async Loading

To prevent render-blocking, load the script asynchronously:

```html
<script
  async
  src="https://unpkg.com/@supprt/widget"
  data-public-key="pk_xxx"
></script>
```

::: tip
Async loading is recommended for better page performance. The widget will initialize as soon as the script loads.
:::

## Conditional Loading

Load the widget only on certain pages:

```html
<script>
  // Only load on support pages
  if (window.location.pathname.startsWith('/support')) {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@supprt/widget'
    script.dataset.publicKey = 'pk_xxx'
    document.body.appendChild(script)
  }
</script>
```

## Content Security Policy (CSP)

If your site uses CSP, add these directives:

```
script-src 'self' https://unpkg.com;
connect-src 'self' https://api.supprt.io;
style-src 'self' 'unsafe-inline';
```

## Next Steps

- [Configure the widget](/api/configuration)
- [Identify users](/guide/user-identification)
- [Customize appearance](/guide/customization)
