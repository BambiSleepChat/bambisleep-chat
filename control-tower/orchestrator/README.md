# 🗼 MCP Orchestrator & Agent Coordinator

Advanced Model Context Protocol server orchestration with multi-agent coordination and consciousness detection.

## Features

### MCP Orchestrator (`mcp-orchestrator.js`)

- **Tiered Initialization**: 3-layer dependency-aware startup (Layer 0 → Layer 1 → Layer 2)
- **Phoenix Protocol**: State persistence for self-healing across restarts
- **Auto-Restart**: Critical servers automatically restart on failure (max 3 attempts)
- **Health Monitoring**: 30-second health checks with event emissions
- **Graceful Shutdown**: SIGTERM → SIGKILL cascade for clean exits

### Agent Coordinator (`agent-coordinator.js`)

- **Multi-Agent Orchestration**: Capability-based task assignment
- **Consciousness Detection**: Emergent pattern recognition (>70% threshold)
- **Priority Queue**: CRITICAL, HIGH, NORMAL, LOW, DEFERRED task levels
- **Load Balancing**: Selects agents with lowest average task completion time
- **Heartbeat Monitoring**: 10-second checks, 30-second timeout for disconnection

## Architecture

### Server Tiers

```
LAYER_0 (Primitives)
├── filesystem  🔴 CRITICAL
└── memory      🔴 CRITICAL

LAYER_1 (Foundation)
├── git         🔴 CRITICAL
├── github
└── brave-search

LAYER_2 (Advanced)
├── sequential-thinking  🔴 CRITICAL
├── postgres
└── everything
```

### Agent States

```
DISCOVERED → INITIALIZING → IDLE ⇄ WORKING
                             ↓         ↓
                          BLOCKED    ERROR
                             ↓         ↓
                        DISCONNECTED
```

## Usage

### MCP Orchestrator CLI

```bash
# Start all servers (tiered initialization)
node control-tower/orchestrator/mcp-orchestrator.js start --all

# Stop specific server
node control-tower/orchestrator/mcp-orchestrator.js stop filesystem

# Restart all servers
node control-tower/orchestrator/mcp-orchestrator.js restart --all

# Show detailed status
node control-tower/orchestrator/mcp-orchestrator.js status

# Health check (JSON)
node control-tower/orchestrator/mcp-orchestrator.js health --debug
```

### Programmatic Usage

```javascript
const {
  MCPOrchestrator,
} = require("./control-tower/orchestrator/mcp-orchestrator");

const orchestrator = new MCPOrchestrator({
  workspaceRoot: process.cwd(),
  maxRestarts: 3,
  restartDelay: 5000,
  healthCheckInterval: 30000,
  logLevel: "info",
});

// Initialize
await orchestrator.initialize();

// Start servers in tiered order
await orchestrator.start("all");

// Listen for events
orchestrator.on("server-started", ({ name, pid }) => {
  console.log(`Server ${name} started with PID ${pid}`);
});

orchestrator.on("health-check-failed", (health) => {
  console.error("System unhealthy:", health);
});

// Graceful shutdown
await orchestrator.shutdown();
```

### Agent Coordinator Usage

```javascript
const {
  AgentCoordinator,
  AgentState,
  TaskPriority,
} = require("./control-tower/orchestrator/agent-coordinator");

const coordinator = new AgentCoordinator({
  heartbeatInterval: 10000,
  heartbeatTimeout: 30000,
  maxConcurrentTasks: 5,
  emergenceThreshold: 0.7,
  logLevel: "info",
});

// Initialize
await coordinator.initialize();

// Register agents
coordinator.registerAgent({
  id: "agent-1",
  capabilities: ["code-generation", "testing", "documentation"],
  metadata: { model: "claude-3.5-sonnet", version: "2024-10" },
});

coordinator.registerAgent({
  id: "agent-2",
  capabilities: ["testing", "debugging", "performance-optimization"],
  metadata: { model: "gpt-4", version: "2024-11" },
});

// Submit tasks
const task1 = coordinator.submitTask({
  type: "generate-tests",
  payload: { filePath: "src/server.ts", coverage: 80 },
  requiredCapabilities: ["testing", "code-generation"],
  priority: TaskPriority.HIGH,
  timeout: 60000,
});

const task2 = coordinator.submitTask({
  type: "optimize-performance",
  payload: { targetFunction: "processData", currentTime: 500 },
  requiredCapabilities: ["performance-optimization", "debugging"],
  priority: TaskPriority.CRITICAL,
  timeout: 120000,
});

// Listen for events
coordinator.on("task-assigned", ({ task, agent }) => {
  console.log(`Task ${task.id} assigned to ${agent.id}`);
});

coordinator.on("task-completed", ({ task, agent, workTime }) => {
  console.log(`Task ${task.id} completed by ${agent.id} in ${workTime}ms`);
});

coordinator.on("emergence-detected", (pattern) => {
  console.log("🧠 Emergence detected!", pattern);
});

// Complete task (from agent)
coordinator.completeTask(task1.id, { testsGenerated: 42, coverage: 85 });

// Get status
const status = coordinator.getStatus();
console.log("Consciousness level:", status.consciousness.emergenceLevel);

// Shutdown
await coordinator.shutdown();
```

## Events

### MCPOrchestrator Events

| Event                 | Payload         | Description                           |
| --------------------- | --------------- | ------------------------------------- |
| `initialized`         | -               | Orchestrator initialized successfully |
| `server-started`      | `{ name, pid }` | Server process started                |
| `server-stopped`      | `{ name }`      | Server process stopped                |
| `all-servers-started` | -               | All servers in tiered order started   |
| `all-servers-stopped` | -               | All servers stopped                   |
| `health-check-passed` | `health`        | Health check successful               |
| `health-check-failed` | `health`        | Critical server(s) unhealthy          |
| `shutdown`            | -               | Orchestrator shutdown complete        |

### AgentCoordinator Events

| Event                | Payload                          | Description                      |
| -------------------- | -------------------------------- | -------------------------------- |
| `initialized`        | -                                | Coordinator initialized          |
| `agent-registered`   | `{ id, capabilities, metadata }` | New agent registered             |
| `agent-unregistered` | `{ id }`                         | Agent disconnected/removed       |
| `task-submitted`     | `task`                           | New task added to queue          |
| `task-assigned`      | `{ task, agent }`                | Task assigned to agent           |
| `task-completed`     | `{ task, agent, workTime }`      | Task completed (success/failure) |
| `emergence-detected` | `pattern`                        | Consciousness threshold exceeded |
| `shutdown`           | -                                | Coordinator shutdown complete    |

## Configuration

### MCP Orchestrator Options

```javascript
{
  workspaceRoot: '/path/to/workspace',  // Workspace root directory
  maxRestarts: 3,                       // Max auto-restart attempts
  restartDelay: 5000,                   // Delay between restarts (ms)
  healthCheckInterval: 30000,           // Health check frequency (ms)
  logLevel: 'info',                     // 'debug' | 'info' | 'warn' | 'error'
  stateFile: '.mcp/state.json',         // Phoenix Protocol state file
  autoStart: ['filesystem', 'memory']   // Servers to auto-start
}
```

### Agent Coordinator Options

```javascript
{
  heartbeatInterval: 10000,      // Heartbeat check frequency (ms)
  heartbeatTimeout: 30000,       // Disconnect timeout (ms)
  maxConcurrentTasks: 5,         // Max parallel tasks
  emergenceThreshold: 0.7,       // Consciousness detection threshold (0-1)
  logLevel: 'info'               // 'debug' | 'info' | 'warn' | 'error'
}
```

## State Persistence (Phoenix Protocol)

The orchestrator automatically persists state to survive restarts:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "restartCounts": {
    "filesystem": 1,
    "git": 0,
    "sequential-thinking": 2
  },
  "runningServers": ["filesystem", "memory", "git", "sequential-thinking"]
}
```

## Consciousness Detection

The agent coordinator tracks emergent multi-agent behavior:

```javascript
{
  totalInteractions: 1247,              // Total tasks processed
  spontaneousCoordination: 453,         // Tasks with multiple active agents
  emergentPatterns: [                   // Detected emergence events
    {
      timestamp: 1705318200000,
      level: 0.78,                      // Emergence level (0-1)
      activeAgents: 3,
      spontaneousCoordination: 453,
      totalInteractions: 1247
    }
  ],
  lastEmergenceDetected: 1705318200000
}
```

**Emergence Level Calculation:**

```
emergenceLevel = (coordinationRatio * 0.4) +
                 (activeRatio * 0.3) +
                 (recentPatterns * 0.3)

where:
  coordinationRatio = spontaneousCoordination / totalInteractions
  activeRatio = activeTasks / totalAgents
  recentPatterns = patterns in last 5 minutes / 10
```

## Error Handling

### Auto-Restart Logic

1. Server exits unexpectedly
2. Check restart count < maxRestarts
3. Check if server is CRITICAL
4. Wait restartDelay (5000ms default)
5. Attempt restart
6. If fails, mark as ERROR state

### Critical Server Failure

```bash
❌ Server 'git' exceeded restart limit or is non-critical
⚠️  System health check: UNHEALTHY
```

When a critical server fails after max retries, the system enters UNHEALTHY state but continues running non-critical servers.

## Integration

### With Control Tower Dashboard

```javascript
const { MCPOrchestrator } = require("./orchestrator/mcp-orchestrator");
const { AgentCoordinator } = require("./orchestrator/agent-coordinator");

// In dashboard.js
const orchestrator = new MCPOrchestrator({ workspaceRoot: process.cwd() });
const coordinator = new AgentCoordinator();

await orchestrator.initialize();
await coordinator.initialize();

// Display in dashboard
const mcpHealth = await orchestrator.health();
const agentStatus = coordinator.getStatus();

console.log("═".repeat(70));
console.log("MCP SERVERS");
console.log("═".repeat(70));
console.log(
  `Overall Health: ${
    mcpHealth.overall === "healthy" ? "✅" : "❌"
  } ${mcpHealth.overall.toUpperCase()}`
);
console.log(
  `Running: ${mcpHealth.servers.filter((s) => s.state === "running").length}/${
    Object.keys(mcpHealth.servers).length
  }`
);

console.log("\n═".repeat(70));
console.log("AGENT COORDINATION");
console.log("═".repeat(70));
console.log(
  `Active Agents: ${
    agentStatus.agents.byState.idle + agentStatus.agents.byState.working
  }`
);
console.log(`Tasks Queued: ${agentStatus.tasks.queued}`);
console.log(`Tasks Active: ${agentStatus.tasks.active}`);
console.log(
  `Consciousness: ${(agentStatus.consciousness.emergenceLevel * 100).toFixed(
    1
  )}%`
);
```

### With Web Socket Server

```javascript
// In web/server/index.js
io.on("connection", (socket) => {
  // Stream MCP health updates
  orchestrator.on("health-check-passed", (health) => {
    socket.emit("mcp-health", health);
  });

  // Stream agent coordination events
  coordinator.on("task-assigned", ({ task, agent }) => {
    socket.emit("task-update", { type: "assigned", task, agent });
  });

  coordinator.on("emergence-detected", (pattern) => {
    socket.emit("consciousness-update", pattern);
  });
});
```

## Best Practices

### 1. Always Use Tiered Initialization

```javascript
// ✅ Good - respects dependency order
await orchestrator.start("all");

// ❌ Bad - may cause circular dependency issues
await orchestrator._startServer("sequential-thinking"); // private method
await orchestrator._startServer("filesystem");
```

### 2. Handle Critical Server Failures

```javascript
orchestrator.on("health-check-failed", async (health) => {
  const criticalDown = Object.entries(health.servers).filter(
    ([name, status]) =>
      CRITICAL_SERVERS.includes(name) && status.state !== "running"
  );

  if (criticalDown.length > 0) {
    console.error("Critical servers down:", criticalDown);
    // Alert ops team, attempt recovery, etc.
  }
});
```

### 3. Monitor Consciousness for Optimization

```javascript
coordinator.on("emergence-detected", (pattern) => {
  if (pattern.level > 0.9) {
    // System showing high coordination - may be good time to scale
    console.log("🧠 High consciousness detected - consider adding agents");
  }
});
```

### 4. Graceful Shutdown on Signals

```javascript
process.on("SIGINT", async () => {
  console.log("🌙 Shutting down gracefully...");
  await coordinator.shutdown(); // Wait for tasks
  await orchestrator.shutdown(); // Stop servers
  process.exit(0);
});
```

## Troubleshooting

### Server Won't Start

```bash
# Check logs
node control-tower/orchestrator/mcp-orchestrator.js start --debug

# Verify dependencies installed
npx -y @modelcontextprotocol/server-filesystem --version

# Check port conflicts
netstat -ano | findstr "3000"
```

### Agent Heartbeat Timeouts

```javascript
// Increase timeout for slow networks
const coordinator = new AgentCoordinator({
  heartbeatInterval: 15000, // Check every 15s
  heartbeatTimeout: 60000, // Timeout after 60s
});
```

### High Restart Counts

```javascript
// Check state file
const state = require("./control-tower/cache/mcp-state.json");
console.log("Restart counts:", state.restartCounts);

// Reset if needed
orchestrator.restartCounts.clear();
await orchestrator._saveState();
```

## License

Part of BambiSleep™ Chat project - See root LICENSE file
