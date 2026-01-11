---
layout: home

hero:
  name: Supprt
  text: Customer support made simple
  tagline: Embeddable chat widget that connects your users to Discord, Slack, or webhooks. Set up in minutes.
  image:
    src: /logo.svg
    alt: Supprt
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/supprt-io/supprt

features:
  - icon: ⚡
    title: Framework Agnostic
    details: One package that works everywhere. React, Vue, Svelte, Angular, Next.js, Nuxt, Astro, or vanilla JavaScript.
  - icon: 🎨
    title: Fully Customizable
    details: Match your brand with custom colors, position, and welcome messages. Full control over the look and feel.
  - icon: 🔒
    title: Style Isolation
    details: Uses Shadow DOM for complete CSS isolation. Your styles won't break the widget, and vice versa.
  - icon: 🚀
    title: Lightweight
    details: Only ~14KB gzipped. No external dependencies. Fast loading and minimal impact on your page performance.
  - icon: 🔌
    title: Multi-channel
    details: Route conversations to Discord, Slack, or custom webhooks. Your team responds where they already work.
  - icon: 🆓
    title: Open Source
    details: MIT licensed. Fully transparent code. Self-host or use our managed cloud service.
---

## Quick Start

### Option 1: Script Tag

Add this single line to your HTML:

```html
<script src="https://cdn.supprt.io/widget.js" data-project-id="your-project-id"></script>
```

### Option 2: npm Package

```bash
npm install @supprt/widget
```

```javascript
import { init } from '@supprt/widget'

init({
  projectId: 'your-project-id'
})
```

That's it! The widget will appear on your site. [Learn more →](/guide/getting-started)
