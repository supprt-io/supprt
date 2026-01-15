import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = 3333

// In-memory storage
const conversations = new Map()
const sseClients = new Map()

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

function sendSSE(userId, event, data) {
  const client = sseClients.get(userId)
  if (client) {
    client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
  })
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

const server = createServer(async (req, res) => {
  cors(res)

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)
  const path = url.pathname

  // Serve static files
  if (req.method === 'GET' && (path === '/' || path === '/index.html')) {
    const html = readFileSync(join(__dirname, 'index.html'), 'utf-8')
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
    return
  }

  // Serve widget bundle
  if (req.method === 'GET' && path === '/supprt.js') {
    const widgetPath = join(__dirname, '../dist/supprt.js')
    if (existsSync(widgetPath)) {
      const js = readFileSync(widgetPath, 'utf-8')
      res.writeHead(200, { 'Content-Type': 'application/javascript' })
      res.end(js)
    } else {
      res.writeHead(404)
      res.end('Widget not built. Run: pnpm build')
    }
    return
  }

  // Widget init
  if (req.method === 'POST' && path === '/api/v1/widget/init') {
    const body = await parseBody(req)
    const userId = body.user?.id || body.fingerprint || generateId()

    const userConversations = Array.from(conversations.values()).filter(
      (c) => c.userId === userId
    )

    json(res, {
      token: `tok_${userId}`,
      endUser: {
        id: userId,
        name: body.user?.name || null,
        email: body.user?.email || null,
      },
      project: {
        id: 'proj_demo',
        name: 'Demo Project',
        agentName: 'Support Team',
        welcomeMessage: 'Hi! How can we help you today?',
        primaryColor: '#0ea5e9',
        position: 'bottom-right',
      },
      conversations: userConversations.map((c) => ({
        id: c.id,
        status: c.status,
        lastMessage: c.messages[c.messages.length - 1] || null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    })
    return
  }

  // Create conversation
  if (req.method === 'POST' && path === '/api/v1/conversations') {
    const body = await parseBody(req)
    const token = req.headers.authorization?.replace('Bearer ', '')
    const userId = token?.replace('tok_', '') || 'anonymous'

    const message = {
      id: generateId(),
      content: body.content,
      senderType: 'user',
      createdAt: new Date().toISOString(),
    }

    const conversation = {
      id: generateId(),
      userId,
      status: 'open',
      messages: [message],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    conversations.set(conversation.id, conversation)

    // Simulate agent response after delay
    setTimeout(() => {
      const agentMessage = {
        id: generateId(),
        content: getAutoResponse(body.content),
        senderType: 'agent',
        senderName: 'Support Team',
        createdAt: new Date().toISOString(),
      }
      conversation.messages.push(agentMessage)
      conversation.updatedAt = new Date().toISOString()

      sendSSE(userId, 'message', {
        conversationId: conversation.id,
        message: agentMessage,
      })
    }, 1500)

    json(res, { conversation, message })
    return
  }

  // Get conversation
  const convMatch = path.match(/^\/api\/v1\/conversations\/([^/]+)$/)
  if (req.method === 'GET' && convMatch) {
    const conversation = conversations.get(convMatch[1])
    if (conversation) {
      json(res, { conversation: { ...conversation } })
    } else {
      json(res, { error: 'Not found' }, 404)
    }
    return
  }

  // Send message
  const msgMatch = path.match(/^\/api\/v1\/conversations\/([^/]+)\/messages$/)
  if (req.method === 'POST' && msgMatch) {
    const body = await parseBody(req)
    const conversation = conversations.get(msgMatch[1])
    const token = req.headers.authorization?.replace('Bearer ', '')
    const userId = token?.replace('tok_', '') || 'anonymous'

    if (!conversation) {
      json(res, { error: 'Not found' }, 404)
      return
    }

    const message = {
      id: generateId(),
      content: body.content,
      senderType: 'user',
      createdAt: new Date().toISOString(),
    }

    conversation.messages.push(message)
    conversation.updatedAt = new Date().toISOString()

    // Simulate typing then response
    setTimeout(() => {
      sendSSE(userId, 'typing', { conversationId: conversation.id, isTyping: true })

      setTimeout(() => {
        const agentMessage = {
          id: generateId(),
          content: getAutoResponse(body.content),
          senderType: 'agent',
          senderName: 'Support Team',
          createdAt: new Date().toISOString(),
        }
        conversation.messages.push(agentMessage)
        conversation.updatedAt = new Date().toISOString()

        sendSSE(userId, 'typing', { conversationId: conversation.id, isTyping: false })
        sendSSE(userId, 'message', {
          conversationId: conversation.id,
          message: agentMessage,
        })
      }, 1500)
    }, 500)

    json(res, { message })
    return
  }

  // SSE endpoint
  if (req.method === 'GET' && path === '/api/v1/sse') {
    const token = url.searchParams.get('token')
    const userId = token?.replace('tok_', '') || 'anonymous'

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    res.write('event: connected\ndata: {}\n\n')
    sseClients.set(userId, res)

    req.on('close', () => {
      sseClients.delete(userId)
    })
    return
  }

  // Upload URL (mock)
  const uploadMatch = path.match(/^\/api\/v1\/conversations\/([^/]+)\/attachments\/upload-url$/)
  if (req.method === 'POST' && uploadMatch) {
    json(res, {
      uploadUrl: `http://localhost:${PORT}/mock-upload`,
      key: `uploads/${generateId()}`,
    })
    return
  }

  // Mock upload
  if (req.method === 'PUT' && path === '/mock-upload') {
    res.writeHead(200)
    res.end()
    return
  }

  // 404
  json(res, { error: 'Not found' }, 404)
})

function getAutoResponse(userMessage) {
  const msg = userMessage.toLowerCase()

  if (msg.includes('pricing') || msg.includes('price') || msg.includes('cost')) {
    return "Our pricing is simple! We have a free tier for small projects, and Pro plans starting at 15 EUR/month. Would you like more details?"
  }
  if (msg.includes('help') || msg.includes('support')) {
    return "I'm here to help! What would you like to know about our service?"
  }
  if (msg.includes('feature') || msg.includes('integration')) {
    return "We support Discord, Slack, and AI integrations. The widget is fully customizable and works with any framework!"
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! Welcome to Supprt. How can I assist you today?"
  }
  if (msg.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with?"
  }

  const responses = [
    "Thanks for your message! Our team will get back to you shortly.",
    "Got it! Let me look into that for you.",
    "Thanks for reaching out! How can I help further?",
    "I understand. Is there anything specific you'd like to know?",
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

server.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🚀 Supprt Widget Dev Server                     ║
  ║                                                   ║
  ║   Local:  http://localhost:${PORT}                  ║
  ║                                                   ║
  ║   Make sure to build the widget first:            ║
  ║   pnpm build                                      ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `)
})
