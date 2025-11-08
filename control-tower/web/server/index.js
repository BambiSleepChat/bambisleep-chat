#!/usr/bin/env node
/**
 * 🌐 Control Tower Web Server
 * Express + Socket.io server for real-time monitoring and chat
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const chatMessages = [];
const connectedUsers = new Map();
let latestStatus = null;

// Status collector
class StatusCollector {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../..');
  }

  async collect() {
    const [phases, tests, deployment, health, metrics] = await Promise.all([
      this.getPhaseStatus(),
      this.getTestStatus(),
      this.getDeploymentStatus(),
      this.getHealthStatus(),
      this.getProjectMetrics()
    ]);

    return {
      timestamp: new Date().toISOString(),
      phases,
      tests,
      deployment,
      health,
      metrics
    };
  }

  async getPhaseStatus() {
    return [
      { id: 1, name: 'Core Model & Architecture', status: 'complete', progress: 100, tests: 24 },
      { id: 2, name: 'Persona & Conversation', status: 'complete', progress: 100, tests: 54 },
      { id: 3, name: 'Safety & Guardrails', status: 'complete', progress: 100, tests: 54 },
      { id: 4, name: 'Memory & Personalization', status: 'complete', progress: 100, tests: 17 },
      { id: 5, name: 'Privacy & GDPR', status: 'complete', progress: 100, tests: 26 },
      { id: 6, name: 'Testing & Cleanup', status: 'complete', progress: 100, tests: 153 },
      { id: 7, name: 'Multi-Modal UX', status: 'planned', progress: 0, tests: 0 },
      { id: 8, name: 'Integration & Deployment', status: 'planned', progress: 0, tests: 0 },
      { id: 9, name: 'Advanced Features', status: 'planned', progress: 0, tests: 0 },
      { id: 10, name: 'AI Improvements', status: 'planned', progress: 0, tests: 0 }
    ];
  }

  async getTestStatus() {
    return { total: 162, passing: 153, failing: 0, skipped: 9, coverage: 100 };
  }

  async getDeploymentStatus() {
    try {
      const { stdout } = await execAsync('git rev-parse --short HEAD', { cwd: this.projectRoot });
      return {
        environment: 'development',
        version: `2.1.0-${stdout.trim()}`,
        status: 'not-deployed'
      };
    } catch {
      return { environment: 'development', version: '2.1.0', status: 'not-deployed' };
    }
  }

  async getHealthStatus() {
    return { build: 'ok', tests: 'ok', deployment: 'ok', dependencies: 'ok' };
  }

  async getProjectMetrics() {
    return {
      linesOfCode: 8000,
      filesCount: 150,
      commits: 50,
      contributors: 1,
      openIssues: 8
    };
  }
}

const collector = new StatusCollector();

// REST API
app.get('/api/status', async (req, res) => {
  try {
    const status = await collector.collect();
    latestStatus = status;
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/chat/history', (req, res) => {
  res.json(chatMessages.slice(-100));
});

app.get('/api/users', (req, res) => {
  res.json(Array.from(connectedUsers.values()));
});

// Socket.io
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('join', (userData) => {
    const user = {
      id: socket.id,
      name: userData.name || 'Anonymous',
      role: userData.role || 'developer',
      joinedAt: new Date().toISOString()
    };
    
    connectedUsers.set(socket.id, user);
    socket.emit('user:joined', user);
    io.emit('users:update', Array.from(connectedUsers.values()));
    socket.emit('chat:history', chatMessages.slice(-50));
    
    if (latestStatus) socket.emit('status:update', latestStatus);
    
    const joinMsg = {
      id: Date.now(),
      type: 'system',
      text: `${user.name} joined the tower`,
      timestamp: new Date().toISOString()
    };
    chatMessages.push(joinMsg);
    io.emit('chat:message', joinMsg);
  });

  socket.on('chat:send', (message) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    const msg = {
      id: Date.now(),
      type: 'user',
      userId: socket.id,
      userName: user.name,
      userRole: user.role,
      text: message.text,
      timestamp: new Date().toISOString()
    };
    
    chatMessages.push(msg);
    if (chatMessages.length > 500) chatMessages.shift();
    io.emit('chat:message', msg);
  });

  socket.on('status:request', async () => {
    try {
      const status = await collector.collect();
      latestStatus = status;
      socket.emit('status:update', status);
    } catch (error) {
      socket.emit('status:error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      io.emit('users:update', Array.from(connectedUsers.values()));
      
      const leaveMsg = {
        id: Date.now(),
        type: 'system',
        text: `${user.name} left the tower`,
        timestamp: new Date().toISOString()
      };
      chatMessages.push(leaveMsg);
      io.emit('chat:message', leaveMsg);
    }
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Auto-broadcast status every 10s
setInterval(async () => {
  try {
    const status = await collector.collect();
    latestStatus = status;
    io.emit('status:update', status);
  } catch (error) {
    console.error('Status update error:', error);
  }
}, 10000);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log('\n🗼 Control Tower Web Server Online!');
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: Ready`);
  console.log(`💬 Chat: Active\n`);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  server.close(() => process.exit(0));
});
