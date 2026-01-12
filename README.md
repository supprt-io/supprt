# @supprt/widget

[![npm version](https://img.shields.io/npm/v/@supprt/widget.svg)](https://www.npmjs.com/package/@supprt/widget)
[![npm downloads](https://img.shields.io/npm/dm/@supprt/widget.svg)](https://www.npmjs.com/package/@supprt/widget)
[![CI](https://github.com/supprt-io/supprt/actions/workflows/ci.yml/badge.svg)](https://github.com/supprt-io/supprt/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Embeddable chat widget for customer support. Works with **any framework** - React, Vue, Svelte, Angular, Next.js, Nuxt, Astro, or vanilla JavaScript.

## Features

- **Framework Agnostic** - One package that works everywhere
- **Fully Customizable** - Match your brand colors and position
- **Style Isolation** - Shadow DOM for complete CSS isolation
- **Lightweight** - Only ~14KB gzipped, no dependencies
- **Multi-channel** - Route to Discord, Slack, or webhooks

## Quick Start

```bash
npm install @supprt/widget
```

```javascript
import { init } from '@supprt/widget'

init({
  publicKey: 'your-public-key'
})
```

## Documentation

For complete installation guides, API reference, and framework-specific examples:

**[docs.supprt.io](https://docs.supprt.io)**

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
git clone https://github.com/supprt-io/supprt.git
cd supprt
npm install
npm run dev
```

## License

MIT - see [LICENSE](LICENSE) for details.
