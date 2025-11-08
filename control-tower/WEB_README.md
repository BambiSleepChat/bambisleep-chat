# 🌐 Control Tower Web - Live Dashboard with Chat

**Real-time monitoring dashboard with WebSocket updates and team chat**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start server
npm run server

# Or use Node directly
node web/server/index.js
```

Then open: **http://localhost:3002**

## ✨ Features

### 📊 Real-Time Monitoring
- Project status updates every 10 seconds
- Health checks (build, tests, deployment, dependencies)
- Test coverage with live results
- All 10 phases with visual progress bars

### 💬 Live Team Chat
- Real-time WebSocket messaging
- System notifications (join/leave)
- User presence indicator
- Chat history persistence
- Auto-scrolling messages

### 👥 User Management
- Online user list
- User roles (developer, designer, tester, manager)
- Auto-generated names for demo
- Connection status indicators

### 🎨 CyberNeonGothWave Design
- Gradient background (#0A0014 → #1a0a2e)
- Neon accents (Cyan #00F0FF, Pink #FF006E)
- Glassmorphism cards
- Smooth animations
- Responsive layout

## 📡 WebSocket Events

### Client → Server
- `join` - User joins with {name, role}
- `chat:send` - Send message {text}
- `status:request` - Request status update

### Server → Client
- `user:joined` - User info after join
- `users:update` - Updated user list
- `chat:history` - Chat history (last 50)
- `chat:message` - New message
- `status:update` - Project status (auto every 10s)

## 🔌 REST API

### GET /api/status
Project status snapshot

### GET /api/chat/history
Last 100 chat messages

### GET /api/users
Currently connected users

## 🛠️ Tech Stack

- **Backend:** Express.js + Socket.io
- **Frontend:** Vanilla JS + HTML5
- **Real-time:** WebSocket
- **Styling:** CSS3 + Animations

## 📊 Dashboard Sections

1. **Project Status** - Build, tests, deployment, dependencies
2. **Test Coverage** - Total passing, failing, skipped with %
3. **Phase Progress** - All 10 phases with visual bars
4. **Online Users** - Real-time user list
5. **Team Chat** - Live messaging system

## 🎯 Use Cases

- **Development Team:** Monitor project health while chatting
- **Project Managers:** Track progress and coordinate
- **QA Team:** Monitor test results in real-time
- **DevOps:** Watch deployment status

## 🔧 Configuration

Edit `web/server/index.js`:

```javascript
const PORT = process.env.PORT || 3002;
```

CORS origins in Socket.io config:
```javascript
origin: ['http://localhost:3000', 'http://localhost:3001']
```

## 🚀 Deployment

### Local Development
```bash
npm run server
```

### Production
```bash
PORT=8080 node web/server/index.js
```

### Docker (Future)
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3002
CMD ["node", "web/server/index.js"]
```

## 📸 Screenshot Preview

```
╔════════════════════════════════════════════════════╗
║  🗼 Control Tower                                  ║
║  Real-Time Project Monitoring & Team Chat         ║
║  ● Connected                                       ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  📊 Project Status    |  👥 Online Users (3)      ║
║  ✅ Build: OK         |  Alice (developer)        ║
║  ✅ Tests: OK         |  Bob (designer)           ║
║  ✅ Deploy: OK        |  Charlie (tester)         ║
║  ✅ Deps: OK          |                           ║
║                       |  💬 Team Chat             ║
║  🧪 Test Coverage     |  ┌─────────────────────┐ ║
║  100%                 |  │ Alice: Server online│ ║
║  ✅ 153 passing       |  │ Bob: Testing UI     │ ║
║  ❌ 0 failing         |  │ System: Charlie     │ ║
║  ⏸️ 9 skipped         |  │ joined the tower    │ ║
║                       |  └─────────────────────┘ ║
║  📋 Phase Progress    |  [Type message...]  Send ║
║  Phase 1: ✅ 100%     |                           ║
║  Phase 2: ✅ 100%     |                           ║
║  ...                  |                           ║
╚════════════════════════════════════════════════════╝
```

## 🔮 Future Enhancements

- [ ] User authentication
- [ ] Private messaging
- [ ] File sharing in chat
- [ ] Code snippet formatting
- [ ] Emoji support
- [ ] Dark/Light theme toggle
- [ ] Historical data graphs
- [ ] Alert notifications
- [ ] Mobile app
- [ ] Slack/Discord integration

---

**Status:** ✅ Ready to use  
**Port:** 3002  
**WebSocket:** Enabled
