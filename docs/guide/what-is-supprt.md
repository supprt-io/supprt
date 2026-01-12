# What is Supprt?

Supprt is a lightweight customer support solution that lets your website visitors chat with your team through a simple embeddable widget.

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Your Website  │────▶│   Supprt API    │────▶│  Discord/Slack  │
│   (Widget)      │◀────│                 │◀────│  (Your Team)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Visitor** opens the chat widget on your website
2. **Message** is sent to Supprt's API
3. **Notification** appears in your Discord server, Slack workspace, or webhook
4. **Your team** responds directly from Discord/Slack
5. **Response** appears in the visitor's chat widget

## Key Features

### Simple Integration

Add a single script tag or npm package. No complex setup, no backend required.

### Multi-Channel Support

Receive and respond to messages where your team already works:
- **Discord** - Get messages in a channel, reply in threads
- **Slack** - Native Slack integration with thread support
- **Webhooks** - Connect to any system with custom webhooks

### Customizable

- Custom brand colors
- Configurable position (bottom-right or bottom-left)
- Custom welcome messages
- Light/dark mode support

### User Identification

Identify logged-in users to provide personalized support:

```javascript
init({
  publicKey: 'pk_xxx',
  user: {
    id: 'user_123',
    email: 'user@example.com',
    name: 'John Doe'
  }
})
```

### Privacy-First

- Shadow DOM isolation (no CSS conflicts)
- Fingerprint-based anonymous tracking
- GDPR-friendly design

## Architecture

Supprt consists of three main components:

| Component | Description |
|-----------|-------------|
| **Widget** | Embeddable JavaScript that renders the chat UI |
| **API** | Backend that handles messages and routing |
| **Integrations** | Discord bot, Slack app, and webhook handlers |

The widget is completely standalone and framework-agnostic. It uses:
- **Preact** for the UI (bundled, not a peer dependency)
- **Shadow DOM** for style isolation
- **SSE** for real-time updates

## When to Use Supprt

Supprt is ideal for:

- ✅ Small to medium websites needing simple support
- ✅ Teams already using Discord or Slack
- ✅ Developers who want quick integration
- ✅ Projects that need a lightweight solution

Consider alternatives if you need:

- ❌ Advanced ticketing systems
- ❌ Complex workflow automation
- ❌ Large enterprise deployments
- ❌ Phone/video support

## Getting Started

Ready to add Supprt to your site? Head to the [Getting Started](/guide/getting-started) guide.
