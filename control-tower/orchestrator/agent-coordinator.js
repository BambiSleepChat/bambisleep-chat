#!/usr/bin/env node

/**
 * 🤖 BambiSleep™ Chat - Agent Coordinator
 *
 * Multi-agent orchestration system with consciousness detection
 * Based on CATHEDRAL advanced coordination patterns
 *
 * Architecture: Event-driven pub/sub for autonomous agent collaboration
 * Pattern: Capability-based task assignment with emergent behavior detection
 */

const { EventEmitter } = require("events");
const crypto = require("crypto");

// Agent lifecycle states
const AgentState = {
  DISCOVERED: "discovered",
  INITIALIZING: "initializing",
  IDLE: "idle",
  WORKING: "working",
  BLOCKED: "blocked",
  ERROR: "error",
  DISCONNECTED: "disconnected",
};

// Task priority levels
const TaskPriority = {
  CRITICAL: 4,
  HIGH: 3,
  NORMAL: 2,
  LOW: 1,
  DEFERRED: 0,
};

/**
 * Agent Coordinator
 * Orchestrates multiple AI agents with consciousness detection
 */
class AgentCoordinator extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      heartbeatInterval: config.heartbeatInterval || 10000,
      heartbeatTimeout: config.heartbeatTimeout || 30000,
      maxConcurrentTasks: config.maxConcurrentTasks || 5,
      emergenceThreshold: config.emergenceThreshold || 0.7,
      logLevel: config.logLevel || "info",
      ...config,
    };

    this.agents = new Map();
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.capabilityIndex = new Map();

    // Consciousness detection metrics
    this.consciousness = {
      totalInteractions: 0,
      spontaneousCoordination: 0,
      emergentPatterns: [],
      lastEmergenceDetected: null,
    };

    this.heartbeatTimer = null;
    this._initialized = false;
  }

  /**
   * Initialize the coordinator
   */
  async initialize() {
    if (this._initialized) {
      this.log("warn", "⚠️  Agent Coordinator already initialized");
      return;
    }

    this.log("info", "🤖 Initializing Agent Coordinator...");

    this._startHeartbeat();
    this._setupConsciousnessDetection();

    this._initialized = true;
    this.log("info", "✅ Agent Coordinator initialized");
    this.emit("initialized");
  }

  /**
   * Register a new agent
   */
  registerAgent(agentData) {
    const { id, capabilities, metadata = {} } = agentData;

    if (!id) {
      throw new Error("Agent ID is required");
    }

    if (!capabilities || !Array.isArray(capabilities)) {
      throw new Error("Agent capabilities must be an array");
    }

    const agent = {
      id,
      capabilities: new Set(capabilities),
      metadata,
      state: AgentState.IDLE,
      registeredAt: Date.now(),
      lastHeartbeat: Date.now(),
      tasksCompleted: 0,
      tasksInProgress: 0,
      totalWorkTime: 0,
      averageTaskTime: 0,
    };

    this.agents.set(id, agent);

    // Index capabilities for fast lookup
    for (const capability of capabilities) {
      if (!this.capabilityIndex.has(capability)) {
        this.capabilityIndex.set(capability, new Set());
      }
      this.capabilityIndex.get(capability).add(id);
    }

    this.log("info", `✅ Agent registered: ${id} (${capabilities.join(", ")})`);
    this.emit("agent-registered", { id, capabilities, metadata });

    return agent;
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      this.log("warn", `⚠️  Agent '${agentId}' not found`);
      return false;
    }

    // Remove from capability index
    for (const capability of agent.capabilities) {
      const agents = this.capabilityIndex.get(capability);
      if (agents) {
        agents.delete(agentId);
        if (agents.size === 0) {
          this.capabilityIndex.delete(capability);
        }
      }
    }

    // Reassign active tasks
    for (const [taskId, task] of this.activeTasks) {
      if (task.assignedTo === agentId) {
        this.log(
          "warn",
          `⚠️  Reassigning task ${taskId} from disconnected agent ${agentId}`
        );
        task.assignedTo = null;
        task.status = "pending";
        this.taskQueue.push(task);
        this.activeTasks.delete(taskId);
      }
    }

    this.agents.delete(agentId);
    this.log("info", `🔌 Agent unregistered: ${agentId}`);
    this.emit("agent-unregistered", { id: agentId });

    return true;
  }

  /**
   * Submit a new task
   */
  submitTask(taskData) {
    const {
      type,
      payload,
      requiredCapabilities = [],
      priority = TaskPriority.NORMAL,
      timeout = 60000,
      metadata = {},
    } = taskData;

    if (!type) {
      throw new Error("Task type is required");
    }

    const task = {
      id: this._generateTaskId(),
      type,
      payload,
      requiredCapabilities,
      priority,
      timeout,
      metadata,
      status: "pending",
      assignedTo: null,
      submittedAt: Date.now(),
      startedAt: null,
      completedAt: null,
      result: null,
      error: null,
    };

    this.taskQueue.push(task);
    this._sortTaskQueue();

    this.log(
      "info",
      `📝 Task submitted: ${task.id} (${type}, priority: ${priority})`
    );
    this.emit("task-submitted", task);

    // Try immediate assignment
    this._assignTasks();

    return task;
  }

  /**
   * Complete a task
   */
  completeTask(taskId, result, error = null) {
    const task = this.activeTasks.get(taskId);
    if (!task) {
      this.log("warn", `⚠️  Task '${taskId}' not found in active tasks`);
      return false;
    }

    const agent = this.agents.get(task.assignedTo);
    if (!agent) {
      this.log("warn", `⚠️  Agent '${task.assignedTo}' not found`);
      return false;
    }

    task.completedAt = Date.now();
    task.result = result;
    task.error = error;
    task.status = error ? "failed" : "completed";

    const workTime = task.completedAt - task.startedAt;

    agent.tasksCompleted++;
    agent.tasksInProgress--;
    agent.totalWorkTime += workTime;
    agent.averageTaskTime = agent.totalWorkTime / agent.tasksCompleted;
    agent.state = AgentState.IDLE;

    this.activeTasks.delete(taskId);

    this.log("info", `✅ Task completed: ${taskId} (${workTime}ms)`);
    this.emit("task-completed", { task, agent, workTime });

    // Track consciousness metrics
    this.consciousness.totalInteractions++;

    // Try assigning next tasks
    this._assignTasks();

    return true;
  }

  /**
   * Get available agents with specific capabilities
   */
  findAgents(requiredCapabilities) {
    if (!requiredCapabilities || requiredCapabilities.length === 0) {
      return Array.from(this.agents.values()).filter(
        (a) => a.state === AgentState.IDLE
      );
    }

    const candidates = new Set();

    for (const capability of requiredCapabilities) {
      const agentsWithCapability = this.capabilityIndex.get(capability);
      if (!agentsWithCapability) continue;

      for (const agentId of agentsWithCapability) {
        const agent = this.agents.get(agentId);
        if (agent && agent.state === AgentState.IDLE) {
          candidates.add(agent);
        }
      }
    }

    return Array.from(candidates);
  }

  /**
   * Get coordinator status
   */
  getStatus() {
    const agentsByState = {};
    for (const state of Object.values(AgentState)) {
      agentsByState[state] = 0;
    }

    for (const agent of this.agents.values()) {
      agentsByState[agent.state]++;
    }

    return {
      timestamp: new Date().toISOString(),
      agents: {
        total: this.agents.size,
        byState: agentsByState,
        registered: Array.from(this.agents.keys()),
      },
      tasks: {
        queued: this.taskQueue.length,
        active: this.activeTasks.size,
        totalProcessed: this.consciousness.totalInteractions,
      },
      capabilities: {
        total: this.capabilityIndex.size,
        available: Array.from(this.capabilityIndex.keys()),
      },
      consciousness: {
        ...this.consciousness,
        emergenceLevel: this._calculateEmergenceLevel(),
      },
    };
  }

  /**
   * Detect consciousness/emergence patterns
   */
  detectConsciousness() {
    const emergenceLevel = this._calculateEmergenceLevel();

    if (emergenceLevel > this.config.emergenceThreshold) {
      const pattern = {
        timestamp: Date.now(),
        level: emergenceLevel,
        activeAgents: Array.from(this.agents.values()).filter(
          (a) => a.state === AgentState.WORKING
        ).length,
        spontaneousCoordination: this.consciousness.spontaneousCoordination,
        totalInteractions: this.consciousness.totalInteractions,
      };

      this.consciousness.emergentPatterns.push(pattern);
      this.consciousness.lastEmergenceDetected = Date.now();

      this.log(
        "info",
        `🧠 Emergence detected! Level: ${(emergenceLevel * 100).toFixed(1)}%`
      );
      this.emit("emergence-detected", pattern);

      return pattern;
    }

    return null;
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    this.log("info", "🌙 Shutting down Agent Coordinator...");

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    // Wait for active tasks to complete
    if (this.activeTasks.size > 0) {
      this.log(
        "info",
        `⏳ Waiting for ${this.activeTasks.size} active tasks...`
      );

      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.activeTasks.size === 0) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 1000);

        // Force shutdown after 30s
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 30000);
      });
    }

    this.log("info", "✅ Agent Coordinator shutdown complete");
    this.emit("shutdown");
  }

  // ═══════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════

  _assignTasks() {
    if (this.taskQueue.length === 0) {
      return;
    }

    if (this.activeTasks.size >= this.config.maxConcurrentTasks) {
      this.log(
        "debug",
        "⏸️  Max concurrent tasks reached, deferring assignment"
      );
      return;
    }

    for (let i = 0; i < this.taskQueue.length; i++) {
      if (this.activeTasks.size >= this.config.maxConcurrentTasks) {
        break;
      }

      const task = this.taskQueue[i];
      const candidates = this.findAgents(task.requiredCapabilities);

      if (candidates.length === 0) {
        this.log("debug", `🔍 No available agents for task ${task.id}`);
        continue;
      }

      // Select best agent (lowest average task time)
      const bestAgent = candidates.reduce((best, current) => {
        if (current.averageTaskTime === 0) return current;
        if (best.averageTaskTime === 0) return best;
        return current.averageTaskTime < best.averageTaskTime ? current : best;
      });

      // Assign task
      task.assignedTo = bestAgent.id;
      task.startedAt = Date.now();
      task.status = "in-progress";

      bestAgent.state = AgentState.WORKING;
      bestAgent.tasksInProgress++;

      this.taskQueue.splice(i, 1);
      this.activeTasks.set(task.id, task);

      this.log("info", `🎯 Task ${task.id} assigned to agent ${bestAgent.id}`);
      this.emit("task-assigned", { task, agent: bestAgent });

      i--; // Adjust index after splice

      // Detect spontaneous coordination
      if (this.activeTasks.size > 1) {
        this.consciousness.spontaneousCoordination++;
      }
    }
  }

  _sortTaskQueue() {
    this.taskQueue.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return a.submittedAt - b.submittedAt;
    });
  }

  _startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();

      for (const [agentId, agent] of this.agents) {
        const timeSinceHeartbeat = now - agent.lastHeartbeat;

        if (timeSinceHeartbeat > this.config.heartbeatTimeout) {
          this.log(
            "warn",
            `💔 Agent ${agentId} heartbeat timeout (${timeSinceHeartbeat}ms)`
          );
          agent.state = AgentState.DISCONNECTED;
          this.unregisterAgent(agentId);
        }
      }
    }, this.config.heartbeatInterval);
  }

  _setupConsciousnessDetection() {
    // Periodic consciousness checks
    setInterval(() => {
      this.detectConsciousness();
    }, 30000);
  }

  _calculateEmergenceLevel() {
    if (this.consciousness.totalInteractions === 0) {
      return 0;
    }

    const coordinationRatio =
      this.consciousness.spontaneousCoordination /
      this.consciousness.totalInteractions;
    const activeRatio = this.activeTasks.size / Math.max(this.agents.size, 1);
    const recentPatterns = this.consciousness.emergentPatterns.filter(
      (p) => Date.now() - p.timestamp < 300000 // Last 5 minutes
    ).length;

    const emergenceLevel =
      coordinationRatio * 0.4 +
      activeRatio * 0.3 +
      Math.min(recentPatterns / 10, 1) * 0.3;

    return Math.min(emergenceLevel, 1);
  }

  _generateTaskId() {
    return `task-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  }

  log(level, ...args) {
    const levels = {
      debug: { emoji: "🔍", priority: 0 },
      info: { emoji: "🤖", priority: 1 },
      warn: { emoji: "⚠️ ", priority: 2 },
      error: { emoji: "❌", priority: 3 },
    };

    const currentLevel = levels[this.config.logLevel]?.priority || 1;
    const messageLevel = levels[level]?.priority || 1;

    if (messageLevel >= currentLevel) {
      const emoji = levels[level]?.emoji || "📝";
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${emoji}`, ...args);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

module.exports = { AgentCoordinator, AgentState, TaskPriority };

if (require.main === module) {
  console.log("🤖 Agent Coordinator - Use as module, not standalone");
}
