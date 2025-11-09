#!/usr/bin/env node

/**
 * 🗼 BambiSleep™ Chat - MCP Server Orchestrator
 *
 * Coordinates all Model Context Protocol servers for the bambisleep-chat project
 * Based on CATHEDRAL advanced orchestration patterns
 *
 * Architecture: Tiered initialization prevents circular dependencies
 * Pattern: 3-layer dependency awareness (Layer 0 → Layer 1 → Layer 2)
 */

const { spawn } = require("child_process");
const { EventEmitter } = require("events");
const fs = require("fs").promises;
const path = require("path");

// Server lifecycle states
const ServerState = {
  STOPPED: "stopped",
  STARTING: "starting",
  RUNNING: "running",
  STOPPING: "stopping",
  ERROR: "error",
  RESTARTING: "restarting",
};

// Tiered initialization order (prevents circular dependencies)
const SERVER_TIERS = {
  LAYER_0: ["filesystem", "memory"], // Primitives (no deps)
  LAYER_1: ["git", "github", "brave-search"], // Foundation (depends on L0)
  LAYER_2: ["sequential-thinking", "postgres", "everything"], // Advanced (depends on L0-L1)
};

// Critical servers MUST start (system cannot function without them)
const CRITICAL_SERVERS = ["filesystem", "memory", "git", "sequential-thinking"];

/**
 * MCP Server Orchestrator
 * Event-driven architecture for real-time monitoring and dynamic server management
 */
class MCPOrchestrator extends EventEmitter {
  constructor(config = {}) {
    super();

    const workspaceRoot = config.workspaceRoot || process.cwd();

    this.config = {
      workspaceRoot,
      maxRestarts: config.maxRestarts || 3,
      restartDelay: config.restartDelay || 5000,
      healthCheckInterval: config.healthCheckInterval || 30000,
      logLevel: config.logLevel || "info",
      stateFile:
        config.stateFile ||
        path.join(workspaceRoot, "control-tower", "cache", "mcp-state.json"),
      autoStart: config.autoStart || ["filesystem", "memory", "git"],
      ...config,
    };

    this.servers = new Map();
    this.processes = new Map();
    this.restartCounts = new Map();
    this.healthCheckTimer = null;
    this._initialized = false;
    this._initializing = false;
    this._shuttingDown = false;
  }

  /**
   * Initialize the orchestrator
   */
  async initialize() {
    if (this._initialized) {
      this.log("warn", "⚠️  Orchestrator already initialized");
      return;
    }

    if (this._initializing) {
      throw new Error("Initialization already in progress");
    }

    this._initializing = true;

    try {
      this.log("info", "🗼 Initializing MCP Orchestrator...");

      await this._ensureDirectories();
      await this._loadServerConfigurations();
      await this._restoreState();
      this._startHealthChecks();

      this._initialized = true;
      this._initializing = false;

      this.log("info", "✅ MCP Orchestrator initialized");
      this.emit("initialized");
    } catch (error) {
      this._initializing = false;
      this.log("error", "❌ Initialization failed:", error);
      throw error;
    }
  }

  /**
   * Start MCP servers in tiered order
   */
  async start(serverNames = "all") {
    if (!this._initialized) {
      throw new Error("Orchestrator not initialized. Call initialize() first.");
    }

    try {
      if (serverNames === "all") {
        this.log("info", "🚀 Starting all MCP servers in tiered order...");

        this.log("info", "📦 Layer 0: Starting primitives...");
        await this._startServerTier(SERVER_TIERS.LAYER_0);

        this.log("info", "🏗️  Layer 1: Starting foundation...");
        await this._startServerTier(SERVER_TIERS.LAYER_1);

        this.log("info", "🎯 Layer 2: Starting advanced servers...");
        await this._startServerTier(SERVER_TIERS.LAYER_2);

        this.log("info", "✅ All servers started successfully");
        this.emit("all-servers-started");
      } else {
        const names = Array.isArray(serverNames) ? serverNames : [serverNames];
        for (const name of names) {
          await this._startServer(name);
        }
      }

      await this._saveState();
    } catch (error) {
      this.log("error", "❌ Failed to start servers:", error);
      throw error;
    }
  }

  /**
   * Stop MCP servers gracefully
   */
  async stop(serverNames = "all") {
    try {
      if (serverNames === "all") {
        this.log("info", "🛑 Stopping all MCP servers...");

        // Reverse order - advanced first to prevent orphaned connections
        await this._stopServerTier(SERVER_TIERS.LAYER_2);
        await this._stopServerTier(SERVER_TIERS.LAYER_1);
        await this._stopServerTier(SERVER_TIERS.LAYER_0);

        this.log("info", "✅ All servers stopped");
        this.emit("all-servers-stopped");
      } else {
        const names = Array.isArray(serverNames) ? serverNames : [serverNames];
        for (const name of names) {
          await this._stopServer(name);
        }
      }

      await this._saveState();
    } catch (error) {
      this.log("error", "❌ Failed to stop servers:", error);
      throw error;
    }
  }

  /**
   * Restart servers
   */
  async restart(serverNames = "all") {
    this.log("info", "🔄 Restarting servers...");
    await this.stop(serverNames);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.start(serverNames);
  }

  /**
   * Get health status of all servers
   */
  async health() {
    const status = {
      timestamp: new Date().toISOString(),
      servers: {},
      overall: "healthy",
    };

    for (const [name, server] of this.servers) {
      const serverStatus = {
        state: server.state,
        pid: this.processes.has(name) ? this.processes.get(name).pid : null,
        restarts: this.restartCounts.get(name) || 0,
        layer: this._getServerLayer(name),
        critical: CRITICAL_SERVERS.includes(name),
        uptime: server.startedAt ? Date.now() - server.startedAt : 0,
      };

      status.servers[name] = serverStatus;

      if (
        CRITICAL_SERVERS.includes(name) &&
        server.state !== ServerState.RUNNING
      ) {
        status.overall = "unhealthy";
      }
    }

    return status;
  }

  /**
   * Get detailed status of all servers
   */
  async status() {
    const health = await this.health();

    console.log("\n🗼 BambiSleep™ Chat - MCP Control Tower Status\n");
    console.log("═".repeat(70));
    console.log(
      `Overall Health: ${
        health.overall === "healthy" ? "✅" : "❌"
      } ${health.overall.toUpperCase()}`
    );
    console.log(`Timestamp: ${health.timestamp}`);
    console.log("═".repeat(70));

    for (const [layerName, serverNames] of Object.entries(SERVER_TIERS)) {
      console.log(`\n${layerName}:`);

      for (const serverName of serverNames) {
        const serverStatus = health.servers[serverName];
        if (!serverStatus) continue;

        const stateIcon = this._getStateIcon(serverStatus.state);
        const criticalBadge = serverStatus.critical ? "🔴 CRITICAL" : "";

        console.log(
          `  ${stateIcon} ${serverName.padEnd(25)} ${serverStatus.state
            .toUpperCase()
            .padEnd(12)} ${criticalBadge}`
        );
        console.log(
          `     PID: ${(serverStatus.pid || "N/A")
            .toString()
            .padEnd(8)}  Restarts: ${
            serverStatus.restarts
          }  Uptime: ${this._formatUptime(serverStatus.uptime)}`
        );
      }
    }

    console.log("\n" + "═".repeat(70) + "\n");

    return health;
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    this.log("info", "🌙 Shutting down MCP Orchestrator...");

    this._shuttingDown = true;

    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    await this.stop("all");
    await this._saveState();

    this.log("info", "✅ Orchestrator shutdown complete");
    this.emit("shutdown");
  }

  // ═══════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════

  async _ensureDirectories() {
    const dirs = [
      path.join(this.config.workspaceRoot, "control-tower", "cache"),
      path.join(this.config.workspaceRoot, "control-tower", "logs"),
      path.join(this.config.workspaceRoot, "control-tower", "reports"),
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async _loadServerConfigurations() {
    const serverConfigs = {
      filesystem: {
        command: "npx",
        args: [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          this.config.workspaceRoot,
        ],
        layer: 0,
        critical: true,
      },
      memory: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-memory"],
        layer: 0,
        critical: true,
      },
      git: {
        command: "npx",
        args: [
          "-y",
          "@modelcontextprotocol/server-git",
          "--repository",
          this.config.workspaceRoot,
        ],
        layer: 1,
        critical: true,
      },
      github: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-github"],
        layer: 1,
        critical: false,
      },
      "brave-search": {
        command: "uvx",
        args: ["mcp-server-brave-search"],
        layer: 1,
        critical: false,
      },
      "sequential-thinking": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
        layer: 2,
        critical: true,
      },
      postgres: {
        command: "uvx",
        args: ["mcp-server-postgres"],
        layer: 2,
        critical: false,
      },
      everything: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-everything"],
        layer: 2,
        critical: false,
      },
    };

    for (const [name, config] of Object.entries(serverConfigs)) {
      this.servers.set(name, {
        name,
        config,
        state: ServerState.STOPPED,
        startedAt: null,
        stoppedAt: null,
      });
    }

    this.log(
      "info",
      `📋 Loaded ${this.servers.size} MCP server configurations`
    );
  }

  async _startServerTier(tierServers) {
    const startPromises = tierServers.map((name) => this._startServer(name));
    await Promise.all(startPromises);
  }

  async _stopServerTier(tierServers) {
    const stopPromises = tierServers.map((name) => this._stopServer(name));
    await Promise.all(stopPromises);
  }

  async _startServer(name) {
    const server = this.servers.get(name);
    if (!server) {
      throw new Error(`Server '${name}' not found in registry`);
    }

    if (server.state === ServerState.RUNNING) {
      this.log("warn", `⚠️  Server '${name}' already running`);
      return;
    }

    server.state = ServerState.STARTING;
    this.log("info", `🚀 Starting server: ${name}`);

    try {
      // On Windows, we need shell to find npx/uvx
      const isWindows = process.platform === "win32";
      const serverProcess = spawn(server.config.command, server.config.args, {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, NODE_ENV: "development" },
        shell: isWindows,
      });

      this.processes.set(name, serverProcess);

      serverProcess.stdout.on("data", (data) => {
        this.log("debug", `[${name}] ${data.toString().trim()}`);
      });

      serverProcess.stderr.on("data", (data) => {
        this.log("error", `[${name}] ERROR: ${data.toString().trim()}`);
      });

      serverProcess.on("exit", (code, signal) => {
        this.log(
          "warn",
          `⚠️  Server '${name}' exited (code: ${code}, signal: ${signal})`
        );
        this._handleServerExit(name, code);
      });

      // Wait for server to be ready
      await new Promise((resolve) => setTimeout(resolve, 2000));

      server.state = ServerState.RUNNING;
      server.startedAt = Date.now();

      this.log(
        "info",
        `✅ Server '${name}' started (PID: ${serverProcess.pid})`
      );
      this.emit("server-started", { name, pid: serverProcess.pid });
    } catch (error) {
      server.state = ServerState.ERROR;
      this.log("error", `❌ Failed to start server '${name}':`, error);
      throw error;
    }
  }

  async _stopServer(name) {
    const server = this.servers.get(name);
    const serverProcess = this.processes.get(name);

    if (!server || !serverProcess) {
      this.log("warn", `⚠️  Server '${name}' not running`);
      return;
    }

    server.state = ServerState.STOPPING;
    this.log("info", `🛑 Stopping server: ${name}`);

    try {
      serverProcess.kill("SIGTERM");

      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.log(
            "warn",
            `⚠️  Server '${name}' did not exit gracefully, forcing...`
          );
          serverProcess.kill("SIGKILL");
          resolve();
        }, 5000);

        serverProcess.on("exit", () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      this.processes.delete(name);
      server.state = ServerState.STOPPED;
      server.stoppedAt = Date.now();

      this.log("info", `✅ Server '${name}' stopped`);
      this.emit("server-stopped", { name });
    } catch (error) {
      this.log("error", `❌ Failed to stop server '${name}':`, error);
      throw error;
    }
  }

  async _handleServerExit(name, exitCode) {
    const server = this.servers.get(name);
    if (!server) return;

    // Don't restart if we're shutting down
    if (this._shuttingDown) {
      server.state = ServerState.STOPPED;
      return;
    }

    const restartCount = this.restartCounts.get(name) || 0;

    if (restartCount < this.config.maxRestarts && server.config.critical) {
      this.restartCounts.set(name, restartCount + 1);

      this.log(
        "info",
        `🔄 Restarting server '${name}' (attempt ${restartCount + 1}/${
          this.config.maxRestarts
        })`
      );

      server.state = ServerState.RESTARTING;

      await new Promise((resolve) =>
        setTimeout(resolve, this.config.restartDelay)
      );

      try {
        await this._startServer(name);
      } catch (error) {
        this.log("error", `❌ Failed to restart server '${name}':`, error);
        server.state = ServerState.ERROR;
      }
    } else {
      server.state = ServerState.ERROR;
      this.log(
        "error",
        `❌ Server '${name}' exceeded restart limit or is non-critical`
      );
    }
  }

  _startHealthChecks() {
    this.healthCheckTimer = setInterval(async () => {
      const health = await this.health();

      if (health.overall !== "healthy") {
        this.log("warn", "⚠️  System health check: UNHEALTHY");
        this.emit("health-check-failed", health);
      } else {
        this.log("debug", "✅ System health check: HEALTHY");
        this.emit("health-check-passed", health);
      }
    }, this.config.healthCheckInterval);
  }

  async _restoreState() {
    try {
      const stateData = await fs.readFile(this.config.stateFile, "utf8");
      const state = JSON.parse(stateData);

      this.log("info", "📂 Restoring previous state...");

      if (state.restartCounts) {
        this.restartCounts = new Map(Object.entries(state.restartCounts));
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        this.log("info", "📝 No previous state found, starting fresh");
      } else {
        this.log("error", "❌ Failed to restore state:", error);
      }
    }
  }

  async _saveState() {
    const state = {
      timestamp: new Date().toISOString(),
      restartCounts: Object.fromEntries(this.restartCounts),
      runningServers: Array.from(this.servers.entries())
        .filter(([_, server]) => server.state === ServerState.RUNNING)
        .map(([name]) => name),
    };

    try {
      await fs.writeFile(
        this.config.stateFile,
        JSON.stringify(state, null, 2),
        "utf8"
      );
      this.log("debug", "💾 State persisted successfully");
    } catch (error) {
      this.log("error", "❌ Failed to save state:", error);
    }
  }

  _getServerLayer(name) {
    for (const [layerName, servers] of Object.entries(SERVER_TIERS)) {
      if (servers.includes(name)) {
        return layerName;
      }
    }
    return "UNKNOWN";
  }

  _getStateIcon(state) {
    const icons = {
      [ServerState.STOPPED]: "⚫",
      [ServerState.STARTING]: "🟡",
      [ServerState.RUNNING]: "🟢",
      [ServerState.STOPPING]: "🟠",
      [ServerState.ERROR]: "🔴",
      [ServerState.RESTARTING]: "🔵",
    };
    return icons[state] || "⚪";
  }

  _formatUptime(ms) {
    if (!ms) return "0s";

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  log(level, ...args) {
    const levels = {
      debug: { emoji: "🔍", priority: 0 },
      info: { emoji: "📘", priority: 1 },
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
// CLI INTERFACE
// ═══════════════════════════════════════════════════════════════

async function cli() {
  const args = process.argv.slice(2);
  const command = args[0];
  const serverArg = args.includes("--all") ? "all" : args[1];

  const orchestrator = new MCPOrchestrator({
    workspaceRoot: path.resolve(__dirname, "..", ".."),
    logLevel: args.includes("--debug") ? "debug" : "info",
  });

  process.on("SIGINT", async () => {
    console.log("\n\n🌙 Received SIGINT, shutting down gracefully...");
    await orchestrator.shutdown();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\n\n🌙 Received SIGTERM, shutting down gracefully...");
    await orchestrator.shutdown();
    process.exit(0);
  });

  try {
    await orchestrator.initialize();

    switch (command) {
      case "start":
        await orchestrator.start(serverArg || "all");
        console.log("\n✅ Servers started. Press Ctrl+C to stop.\n");
        await new Promise(() => {});
        break;

      case "stop":
        await orchestrator.stop(serverArg || "all");
        await orchestrator.shutdown();
        break;

      case "restart":
        await orchestrator.restart(serverArg || "all");
        console.log("\n✅ Servers restarted. Press Ctrl+C to stop.\n");
        await new Promise(() => {});
        break;

      case "status":
        await orchestrator.status();
        await orchestrator.shutdown();
        break;

      case "health":
        const health = await orchestrator.health();
        console.log(JSON.stringify(health, null, 2));
        await orchestrator.shutdown();
        break;

      default:
        console.log(`
🗼 BambiSleep™ Chat - MCP Orchestrator CLI

Usage: node mcp-orchestrator.js <command> [options]

Commands:
  start [name|--all]    Start MCP servers (default: all)
  stop [name|--all]     Stop MCP servers (default: all)
  restart [name|--all]  Restart MCP servers (default: all)
  status                Show detailed server status
  health                Show health check results (JSON)

Options:
  --debug               Enable debug logging
  --all                 Apply command to all servers

Examples:
  node mcp-orchestrator.js start --all
  node mcp-orchestrator.js stop filesystem
  node mcp-orchestrator.js restart --all --debug
  node mcp-orchestrator.js status
        `);
        process.exit(1);
    }
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

module.exports = {
  MCPOrchestrator,
  ServerState,
  SERVER_TIERS,
  CRITICAL_SERVERS,
};

if (require.main === module) {
  cli();
}
