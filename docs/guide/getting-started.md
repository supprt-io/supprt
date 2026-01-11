# Getting Started

This guide will help you add Supprt to your website in under 5 minutes.

## Prerequisites

Before you begin, you'll need:

1. A Supprt account ([sign up here](https://app.supprt.io))
2. A project with at least one integration (Discord, Slack, or Webhook)
3. Your project's **Project ID** (found in project settings)

## Step 1: Create a Project

1. Log in to your [Supprt Dashboard](https://app.supprt.io)
2. Click **New Project**
3. Enter a name for your project
4. Copy your **Project ID** from the project settings

## Step 2: Add an Integration

Connect at least one channel to receive messages:

### Discord
1. Go to **Integrations** → **Add Integration** → **Discord**
2. Click **Add to Discord** to install the bot
3. Select a channel for receiving messages

### Slack
1. Go to **Integrations** → **Add Integration** → **Slack**
2. Click **Add to Slack** to install the app
3. Select a channel for receiving messages

### Webhook
1. Go to **Integrations** → **Add Integration** → **Webhook**
2. Enter your webhook URL
3. Configure the payload format

## Step 3: Install the Widget

Choose your preferred installation method:

### Script Tag (Easiest)

Add this line before your closing `</body>` tag:

```html
<script
  src="https://cdn.supprt.io/widget.js"
  data-project-id="YOUR_PROJECT_ID"
></script>
```

Replace `YOUR_PROJECT_ID` with your actual project ID.

### npm Package

Install the package:

::: code-group

```bash [npm]
npm install @supprt/widget
```

```bash [yarn]
yarn add @supprt/widget
```

```bash [pnpm]
pnpm add @supprt/widget
```

```bash [bun]
bun add @supprt/widget
```

:::

Initialize in your app:

```javascript
import { init } from '@supprt/widget'

init({
  projectId: 'YOUR_PROJECT_ID'
})
```

## Step 4: Test It

1. Open your website
2. Look for the chat bubble in the bottom-right corner
3. Click it and send a test message
4. Check your Discord/Slack channel for the message

::: tip
If you don't see the widget, check the browser console for errors. Common issues:
- Invalid project ID
- Project has no active integrations
- Script blocked by ad blockers
:::

## Next Steps

Now that you have the basic setup working:

- [Customize the appearance](/guide/customization)
- [Identify users](/guide/user-identification)
- [Handle events](/guide/events)
- [Framework-specific guides](/frameworks/react)

## Troubleshooting

### Widget not appearing

1. Check that the script is loaded (Network tab in DevTools)
2. Verify the project ID is correct
3. Ensure the project has at least one active integration
4. Check for JavaScript errors in the console

### Messages not being delivered

1. Verify your integration is connected and active
2. Check that the bot has permission to post in the channel
3. Look at the integration logs in the dashboard

### Styling issues

The widget uses Shadow DOM for isolation. If you see styling issues:
1. Ensure your CSS doesn't use `!important` on `*` selectors
2. Check for browser extensions that might interfere
3. Try disabling other chat widgets

Need more help? [Open an issue on GitHub](https://github.com/supprt-io/supprt/issues).
