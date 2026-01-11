# Script Tag Installation

The simplest way to add Supprt to your website is with a script tag. No build tools required.

## Basic Installation

Add this line before your closing `</body>` tag:

```html
<script
  src="https://cdn.supprt.io/widget.js"
  data-project-id="YOUR_PROJECT_ID"
></script>
```

## Configuration via Data Attributes

You can configure the widget using `data-*` attributes:

```html
<script
  src="https://cdn.supprt.io/widget.js"
  data-project-id="YOUR_PROJECT_ID"
  data-position="bottom-right"
  data-primary-color="#14b8a6"
  data-welcome-message="Hi! How can we help you today?"
  data-z-index="9999"
></script>
```

### Available Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-project-id` | Your project ID (required) | - |
| `data-api-url` | Custom API URL | `https://api.supprt.io` |
| `data-position` | Widget position | `bottom-right` |
| `data-primary-color` | Brand color (hex) | `#14b8a6` |
| `data-welcome-message` | Initial greeting | - |
| `data-z-index` | CSS z-index | `999999` |

## User Identification

To identify logged-in users, add user data attributes:

```html
<script
  src="https://cdn.supprt.io/widget.js"
  data-project-id="YOUR_PROJECT_ID"
  data-user-id="user_123"
  data-user-email="john@example.com"
  data-user-name="John Doe"
></script>
```

::: warning
Don't include sensitive user data in HTML attributes. For dynamic user identification, use the [npm package](/guide/installation-npm) instead.
:::

## Loading from CDN

The widget is served from our global CDN for fast loading:

```
https://cdn.supprt.io/widget.js
```

### Specific Version

To pin a specific version:

```html
<script src="https://cdn.supprt.io/widget@1.0.0.js"></script>
```

### Subresource Integrity (SRI)

For added security, use SRI:

```html
<script
  src="https://cdn.supprt.io/widget.js"
  integrity="sha384-..."
  crossorigin="anonymous"
  data-project-id="YOUR_PROJECT_ID"
></script>
```

## Async Loading

To prevent render-blocking, load the script asynchronously:

```html
<script
  async
  src="https://cdn.supprt.io/widget.js"
  data-project-id="YOUR_PROJECT_ID"
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
    script.src = 'https://cdn.supprt.io/widget.js'
    script.dataset.projectId = 'YOUR_PROJECT_ID'
    document.body.appendChild(script)
  }
</script>
```

## Content Security Policy (CSP)

If your site uses CSP, add these directives:

```
script-src 'self' https://cdn.supprt.io;
connect-src 'self' https://api.supprt.io;
style-src 'self' 'unsafe-inline';
```

## Next Steps

- [Configure the widget](/api/configuration)
- [Identify users](/guide/user-identification)
- [Customize appearance](/guide/customization)
