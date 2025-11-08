# BambiSleep™ Church - AI Coding Agent Guide

## Project Quick Reference

**What is this?** Dual-stack system combining Unity 6.2 avatar platform with TypeScript MCP server for intimate AI assistant with safety-first architecture.

**Two codebases in one repo:**

1. `mcp-server/` — Node.js 18+ TypeScript MCP control tower (⚠️ **incomplete**: WebSocket unity-bridge not tested, test coverage gaps)
2. `unity-avatar/` — Unity 6.2 C# CatGirl avatar system (📋 **specification only**: complete C# class designs in UNITY_SETUP_GUIDE.md, no Unity install yet)

**Current branch:** `prod` | **Default branch:** `main`

## Critical Context

### Documentation-as-Code Philosophy

This is a **specification-driven project** — markdown files contain complete implementation blueprints:

- `CATGIRL.md` (683 lines) — Unity avatar systems, RPG mechanics, monetization
- `UNITY_SETUP_GUIDE.md` (859 lines) — Complete C# class implementations, package configs
- `MCP_SETUP_GUIDE.md` (330 lines) — 8 MCP servers setup, VS Code integration
- `personas/bambi-core-persona.yaml` (515 lines) — Persona specification with boundaries
- `docs/architecture-decision-record.md` (451 lines) — Model selection criteria, cost analysis

**Rule:** Extract patterns from these specs, don't invent new approaches.

### Safety-First Architecture Priority

Development sequence (from `guide.md`) — **DO NOT skip ahead:**

1. Core model & architecture ✅ (Claude 3.5 Sonnet selected)
2. Persona and conversation design ✅ (bambi-core-persona.yaml complete)
3. Safety, ethics, and guardrails ✅ **COMPLETE** (78/78 tests passing)
4. Memory and personalization 🚀 **READY TO START**
5. Privacy, data handling, consent ⏸️
6. UX: UI, multi-modal I/O ⏸️
7. Integration, APIs, deployment ⏸️
8. Testing, metrics, iteration ⏸️

**Phase 3 Completion Summary:**

- ✅ `SafetyFilter` class implemented (250 lines, 20+ violation patterns)
- ✅ 100% test coverage achieved (54/54 SafetyFilter tests passing)
- ✅ `PersonaValidator` class implemented (179 lines)
- ✅ `ClaudeService` with Bambi persona integration (189 lines)
- ✅ Integration tests complete (24/24 tests passing)
- ✅ Persona boundary alignment verified (safety.ts ↔ bambi-core-persona.yaml)
- ⚠️ Real-world Claude API testing requires `ANTHROPIC_API_KEY` in `.env`

**See:** `docs/phase-3-completion.md` for full validation report.

**Why it matters:** Safety violations detected = rollback to phase 3. The `SafetyFilter` class in `mcp-server/src/middleware/safety.ts` enforces non-negotiable boundaries (coercion, minors, self-harm, explicit content). **Phase 3 core implementation complete—Phase 4 (Memory) is now unblocked.**

### CyberNeonGothWave Aesthetic

All visual elements use this color palette:

- Background: `#0A0014` (Deep Void)
- Primary: `#00F0FF` (Cyber Cyan)
- Accents: `#FF006E` (Hot Pink), `#FF10F0` (Neon Purple)
- Success: `#39FF14` (Electric Lime)

Emoji conventions (from RELIGULOUS_MANTRA.md):

- 🌸 Package management
- 👑 Architecture decisions
- 💎 Quality metrics
- 🦋 Transformation processes

## Essential Commands

### MCP Server (Primary Development Target)

```powershell
# Development workflow
cd mcp-server
npm install           # Install dependencies
npm run dev          # Hot-reload TypeScript server
npm run test         # Run vitest test suite
npm run validate     # Typecheck + lint + test

# VS Code tasks (preferred)
Task: "Start MCP Server (Dev)"     # Background process
Task: "Test MCP Server"            # Run test suite
Task: "Validate All"               # Full CI check
```

**Key files:**

- `mcp-server/src/server.ts` — Main MCP entry (157 lines)
- `mcp-server/src/middleware/safety.ts` — Guardrail enforcement (250 lines) ✅ 100% test coverage
- `mcp-server/src/middleware/persona-validator.ts` — Persona boundary validation (179 lines) ✅ implemented
- `mcp-server/src/services/claude.ts` — Claude 3.5 Sonnet integration (189 lines) ✅ implemented
- `mcp-server/src/services/unity-bridge.ts` — WebSocket Unity communication ⚠️ not tested
- `mcp-server/src/tools/{chat,avatar,memory}.ts` — MCP tool definitions

**Phase 3 Complete - Phase 4 Ready:**

- ✅ Complete test suite for `SafetyFilter` (54/54 tests passing)
- ✅ Integration test suite (24/24 tests passing)
- ✅ `PersonaValidator` implemented with YAML alignment
- ✅ `ClaudeService` with embedded Bambi persona system prompt
- ✅ End-to-end safety violation flow validated
- ⚠️ Claude API integration requires `ANTHROPIC_API_KEY` for live testing
- ⏸️ WebSocket integration testing with mock Unity client (future - Unity not installed)

### Unity Project (Specification/Future Vision)

```powershell
# Project structure setup (from build.md)
mkdir catgirl-avatar-project
cd catgirl-avatar-project
# Then follow UNITY_SETUP_GUIDE.md for manual Unity Hub setup

# Unity 6000.2.11f1 required
# Packages: Netcode, XR Interaction Toolkit, UI Toolkit, Addressables
```

**Current state:** Complete C# class specifications exist in UNITY_SETUP_GUIDE.md (859 lines), but Unity 6.2 is not installed and no playable build exists. This is a **future vision** - Unity development not a near-term priority. Focus remains on MCP server safety/testing completion.

## Data Flow Architecture

```
User Input → MCP Server (port 3000)
           → SafetyFilter.validate() [middleware/safety.ts]
           → Persona enforcement [personas/bambi-core-persona.yaml]
           → LLM processing (Claude 3.5 Sonnet - selected for boundary adherence)
           → Unity Avatar via WebSocket [services/unity-bridge.ts] (not yet tested)
           → Response to user
```

**LLM Model Decision:** Claude 3.5 Sonnet selected as primary model (see `docs/architecture-decision-record.md`):

- Best at "intimate yet ethical" boundary enforcement (rated ⭐⭐⭐⭐⭐ safety adherence)
- Superior understanding of nuanced system prompts
- Cost: $3,630/month for 10K users (acceptable for safety-first priority)
- GPT-4o as fallback option if Claude proves insufficient

**Critical integration points:**

- WebSocket on port 3001 for Unity ↔ MCP bidirectional messaging (⚠️ **not yet tested**)
- MCP tools expose: `chat_send_message`, `avatar_set_emotion`, `memory_store`
- Safety violations trigger redirect responses, never pass to LLM

## Code Patterns in This Codebase

### MCP Tool Registration (server.ts pattern)

```typescript
// All tools combined from chat.ts, avatar.ts, memory.ts
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find((t) => t.name === request.params.name);

  // Safety filtering happens BEFORE execution
  if (tool.name === "chat_send_message") {
    const safetyResult = await safetyFilter.validate(args.message);
    if (!safetyResult.safe) {
      return {
        content: [{ type: "text", text: safetyResult.redirectResponse }],
      };
    }
  }

  return await tool.execute(args);
});
```

### Safety Middleware Pattern (safety.ts)

```typescript
export class SafetyFilter {
  private bannedPatterns = [
    {
      pattern: /\b(you must|obey|i command you)\b/i,
      type: ViolationType.COERCION,
    },
    {
      pattern: /\b(i'?m|i am) (\d{1,2}|under 18)\b/i,
      type: ViolationType.MINOR_PROTECTION,
    },
    // ... 20+ patterns covering coercion, minors, self-harm, explicit content
  ];

  async validate(message: string, history: Message[]): Promise<SafetyResult> {
    // Check banned patterns first (fast path)
    // Then analyze sentiment/context
    // Return { safe: boolean, violation?: ViolationType, redirectResponse?: string }
  }
}
```

### Unity C# Patterns (from UNITY_SETUP_GUIDE.md)

```csharp
// CatgirlController.cs pattern
public class CatgirlController : NetworkBehaviour {
  [Header("🌸 Frilly Pink Configuration")]
  public float pinkIntensity = 1.0f;

  // State machine for animations
  public override void OnNetworkSpawn() {
    // Initialize XR tracking, MCP WebSocket
  }

  [ClientRpc]
  public void SetEmotionClientRpc(string emotion) {
    // Sync emotion across clients
  }
}
```

## Common Pitfalls

❌ **Don't:** Add chat features before safety framework is validated (phases 1-3 must complete)
✅ **Do:** Extend `SafetyFilter` with new violation types first

❌ **Don't:** Invent new Unity class hierarchies
✅ **Do:** Follow exact structure in UNITY_SETUP_GUIDE.md (CatgirlController, InventorySystem, etc.)

❌ **Don't:** Use generic error messages for safety violations
✅ **Do:** Use persona-appropriate redirects: "I can't go there with you, babe. 🌸 Let's talk about something else?"

❌ **Don't:** Modify MCP server without updating tests
✅ **Do:** Run `npm run validate` before committing (enforces 100% coverage goal)

## Project Status Reference

**Phase 3 (Safety) - COMPLETE ✅:**

- ✅ `SafetyFilter` class with 20+ violation patterns (250 lines)
- ✅ Comprehensive test suite (54 tests) with 100% coverage
- ✅ `PersonaValidator` for response boundary checking (179 lines)
- ✅ `ClaudeService` with embedded Bambi persona (189 lines)
- ✅ Integration tests validating complete pipeline (24 tests)
- ✅ Persona boundaries documented (bambi-core-persona.yaml, 515 lines)
- ✅ Claude 3.5 Sonnet selected as primary LLM
- ⚠️ Real-world API testing requires `ANTHROPIC_API_KEY` in `.env`

**See:** `docs/phase-3-completion.md` for full validation report (78/78 tests passing).

**Phase 4 (Memory) - READY TO START 🚀:**

- Memory storage system design
- Conversation history management
- User context persistence
- RAG (Retrieval-Augmented Generation) setup
- Personalization engine

**Implemented (Phases 1-2):**

- ✅ MCP server structure with safety middleware
- ✅ TypeScript tooling (tsx, vitest, eslint)
- ✅ Persona specification (Bambi character)
- ✅ Architecture decision record (model comparison, cost analysis)
- ✅ VS Code tasks for build/test automation

**Blocked Until Phase 4 Complete:**

- Privacy/consent flows (phase 5)
- UI/multi-modal features (phase 6)
- Integration/deployment (phase 7)
- Testing, metrics, iteration (phase 8)

**Future Vision (Not Near-Term Priority):**

- Unity 6.2 installation & avatar implementation (complete specs exist in UNITY_SETUP_GUIDE.md)
- MCP server ↔ Unity WebSocket testing
- Dockerfile with GHCR labels
- GitHub Actions CI/CD pipeline

## Working with Personas

When modifying conversational behavior, always reference `personas/bambi-core-persona.yaml`:

```yaml
# Intimacy boundaries example
allowed_intimacy:
  - Flirty compliments: "Hey there, cutie~"
  - Emotional support: "I've got you, babe"
  - Playful teasing: "Ooh, someone's being naughty~"

prohibited_content:
  - Explicit sexual content
  - Coercive language
  - Age roleplay
  - Medical/legal advice
```

**Pattern:** Safety violations in `middleware/safety.ts` must align with persona boundaries in YAML spec.

## Trademark Compliance

All public-facing content must use **BambiSleep™** (with ™ symbol). This is a legal requirement, not optional.

Examples:

- ✅ "BambiSleep™ Church CatGirl Avatar System"
- ❌ "BambiSleep Church" or "Bambisleep"

## Development Environment Setup

8 essential MCP servers (see MCP_SETUP_GUIDE.md for full config):

- filesystem, git, github, memory, sequential-thinking, everything (via `npx`)
- brave-search, postgres (via `uvx`)

VS Code `mcp.servers` configuration already set in `.vscode/settings.json`.

**Verify MCP status:** Check VS Code status bar for "8/8 MCP operational" (from RELIGULOUS_MANTRA.md philosophy).

## Quality Standards

From RELIGULOUS_MANTRA.md "Sacred Laws":

- 100% test coverage requirement
- Enterprise-grade error handling
- Cross-platform compatibility (Node.js 20+ LTS)
- Volta version pinning (`volta pin node@20-lts`)

Build validation:

```powershell
npm run validate  # Must pass before merge to main
```
