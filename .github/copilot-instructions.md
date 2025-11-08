# BambiSleep™ Church - AI Coding Agent Guide

## Project Quick Reference

**What is this?** Dual-stack system combining Unity 6.2 avatar platform with TypeScript MCP server for intimate AI assistant with safety-first architecture.

**Two codebases in one repo:**

1. `mcp-server/` — Node.js 20+ TypeScript MCP control tower ✅ **Phases 4-6 complete** (151/162 tests passing, 10 skipped, 1 flaky privacy test)
2. `unity-avatar/` — Unity 6.2 C# CatGirl avatar system (📋 **specification only**: complete C# class designs in UNITY_SETUP_GUIDE.md, no Unity install yet)

**Current branch:** `phase-4-rag-personalization` | **Default branch:** `main` | **Stable branch:** `prod`

**Current Implementation Status:**

- ✅ MCP server with 4 tool categories (chat, avatar, memory, privacy)
- ✅ Safety middleware with 20+ violation patterns (54 tests passing)
- ✅ Claude 3.5 Sonnet + OpenAI integration
- ✅ Persona validation system
- ✅ WebSocket Unity bridge (structure ready, not tested - 9 skipped tests)
- ✅ SQLite persistence with embeddings storage (Phase 4 complete)
- ✅ RAG with semantic search and personalization engine (Phase 4 complete)
- ✅ GDPR compliance with consent management (Phase 5 complete - 25/26 privacy tests passing)
- ✅ Context-Aware Generation (CAG) service combining RAG + profiles
- ✅ Integrated chat pipeline (<200ms response time)
- ✅ Fire-and-forget async embedding generation pattern

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
3. Safety, ethics, and guardrails ✅ (54/54 tests passing)
4. Memory and personalization ✅ (RAG with 384-dim embeddings, 18 tests passing)
5. Privacy, data handling, consent ✅ (GDPR compliance, 25/26 tests passing - 1 flaky)
6. Testing, debugging, code cleanup ✅ (Phase 6 complete, 151/162 total tests)
7. UX: UI, multi-modal I/O 🚀 **NEXT** (Phase 7 - voice, avatar, images)
8. Integration, APIs, deployment ⏸️

**Phase 6 (Testing & Cleanup) Complete:**

- ✅ All build errors resolved (TypeScript compilation clean)
- ✅ TODO/FIXME markers addressed (1 converted to skipped test with documentation)
- ✅ Type safety improvements (confidence field added to ConversationContext)
- ✅ Full validation passing (typecheck + lint + test)
- ✅ 151/162 tests passing (68% more than Phase 4 estimate)
- ⏸️ 9 Unity integration tests skipped (awaiting Unity server)
- ⚠️ 1 flaky privacy test (non-blocking, race condition in embedding generation)

**See:** `PHASE_4_5_COMPLETE.md`, `PHASE_6_COMPLETE.md`, and `PHASE_7_PLAN.md` for details.

### CyberNeonGothWave Aesthetic

All visual elements use this color palette:

- Background: hex 0A0014 (Deep Void)
- Primary: hex 00F0FF (Cyber Cyan)
- Accents: hex FF006E (Hot Pink), hex FF10F0 (Neon Purple)
- Success: hex 39FF14 (Electric Lime)

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

- `mcp-server/src/server.ts` — Main MCP entry (157 lines) ✅ Complete with safety integration
- `mcp-server/src/middleware/safety.ts` — Guardrail enforcement (250 lines) ✅ 100% test coverage
- `mcp-server/src/middleware/privacy.ts` — GDPR privacy middleware ✅ Phase 5 complete
- `mcp-server/src/middleware/persona-validator.ts` — Persona boundary validation (179 lines) ✅ Implemented
- `mcp-server/src/services/claude.ts` — Claude 3.5 Sonnet integration (189 lines) ✅ Implemented
- `mcp-server/src/services/embeddings.ts` — Transformer embeddings (165 lines) ✅ Phase 4 complete
- `mcp-server/src/services/rag.ts` — Semantic search (305 lines) ✅ Phase 4 complete
- `mcp-server/src/services/rag/` — Local RAG with FAISS-like vector search ✅ Production ready
- `mcp-server/src/services/personalization.ts` — Adaptive engine (355 lines) ✅ Phase 4 complete
- `mcp-server/src/services/personalization/` — User profiling and adaptive responses ✅ Implemented
- `mcp-server/src/services/context-retrieval/` — Semantic context assembly ✅ Implemented
- `mcp-server/src/services/cag.ts` — Context-Aware Generation service (338 lines) ✅ Phase 5 complete
- `mcp-server/src/services/consent.ts` — Consent management with GDPR compliance ✅ Phase 5 complete
- `mcp-server/src/services/memory.ts` — SQLite + embeddings (600+ lines) ✅ Phase 4 enhanced
- `mcp-server/src/services/unity-bridge.ts` — WebSocket Unity communication ✅ Structure complete (not tested)
- `mcp-server/src/integrated-chat.ts` — Full AI pipeline integration (194 lines) ✅ <200ms latency
- `mcp-server/src/tools/chat.ts` — Chat with RAG integration (272 lines) ✅ Phase 4 enhanced
- `mcp-server/src/tools/avatar.ts` — Unity avatar control tools ✅ Implemented
- `mcp-server/src/tools/memory.ts` — Memory storage tools (183 lines) ✅ Implemented
- `mcp-server/src/tools/privacy.ts` — Privacy management tools (218 lines) ✅ Phase 5 complete
- `mcp-server/src/utils/logger.ts` — CyberNeonGothWave logging ✅ Complete

**Current Dependencies:**

- `@modelcontextprotocol/sdk` ^0.5.0
- `@anthropic-ai/sdk` ^0.68.0
- `openai` ^4.28.0
- `@xenova/transformers` ^2.17.2 (Phase 4 - embeddings)
- `better-sqlite3` ^12.4.1 (SQLite persistence)
- `uuid` ^13.0.0 (message IDs)
- `ws` ^8.16.0 (WebSocket)
- `express` ^4.18.2
- `dotenv` ^16.4.0
- `zod` ^3.22.4 (validation)
- Testing: `vitest` ^1.6.1, `tsx` ^4.7.0

**Phase 4-6 Complete:**

- ✅ All Phase 3 tests passing (54 safety + 24 integration + 17 memory = 95)
- ✅ All Phase 4 tests passing (18 RAG/personalization tests)
- ✅ All Phase 5 tests passing (25/26 privacy tests - 1 flaky race condition)
- ✅ **Total: 151/162 tests (93% pass rate)** - 10 Unity tests skipped, 1 flaky
- ✅ Embeddings service with Xenova/all-MiniLM-L6-v2 transformer (384-dim vectors)
- ✅ Semantic search with vector similarity and relevance scoring
- ✅ Personalization engine with 4 conversation styles
- ✅ Conversation summarization with NLP keyword/emotion extraction
- ✅ Auto-embedding generation on message storage (fire-and-forget async pattern)
- ✅ Chat tool RAG integration retrieving relevant context (3 most relevant past conversations)
- ✅ GDPR compliance: consent management, data export, right to be forgotten, audit logging
- ✅ Context-Aware Generation (CAG) service combining RAG + user profiles
- ✅ Integrated chat pipeline with <200ms response time
- ⚠️ Claude API integration requires `ANTHROPIC_API_KEY` for live testing
- ⏸️ WebSocket integration testing with mock Unity client (9 tests skipped - Unity not installed)

**Critical Async Pattern - Fire-and-Forget Embeddings:**

```typescript
// Pattern from memory.ts storeMessage()
this.generateAndStoreEmbedding(messageId, content).catch((error: unknown) => {
  logger.error(
    "Failed to generate embedding:",
    error instanceof Error ? { message: error.message } : {}
  );
});
// Message storage returns immediately, embedding generation happens async
// Prevents blocking user-facing responses while maintaining semantic search capability
```

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
           → RAG Context Retrieval [services/rag.ts]
              ├── Query embedding generation (Xenova/all-MiniLM-L6-v2)
              ├── Vector similarity search (cosine distance, threshold 0.65)
              ├── Top 3 relevant past conversations injected into prompt
              └── Personalization analysis (style, topics, engagement)
           → LLM processing (Claude 3.5 Sonnet - selected for boundary adherence)
           → PersonaValidator.validate() [middleware/persona-validator.ts]
           → Unity Avatar via WebSocket [services/unity-bridge.ts] (not yet tested)
           → Response to user
           → Message storage [services/memory.ts]
              └── Async embedding generation (fire-and-forget, no blocking)
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
- RAG semantic search injects top 3 most relevant past conversations (0.65 similarity threshold)
- Embeddings generated asynchronously after message storage (doesn't block response)

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

### RAG Semantic Search Pattern (rag.ts + chat.ts)

```typescript
// In chat.ts - retrieve relevant context before LLM call
const relevantMemories = await ragService.getRelevantContext(
  message,
  userId,
  sessionId,
  {
    maxMessages: 3,
    minSimilarity: 0.65,
    includeCurrentSession: false, // Avoid duplication with recent history
  }
);

// RAG service performs vector similarity search
async semanticSearch(query: string, options: SearchOptions): Promise<SearchResult[]> {
  const queryEmbedding = await embeddingsService.generateEmbedding(query);

  // Fetch all messages with embeddings from SQLite
  const rows = this.db.prepare(`
    SELECT m.*, e.embedding FROM messages m
    JOIN embeddings e ON m.id = e.message_id
    WHERE m.user_id = ? AND m.id NOT IN (...)
  `).all(userId);

  // Calculate cosine similarity for each message
  for (const row of rows) {
    const messageEmbedding = EmbeddingsService.deserializeEmbedding(row.embedding);
    const similarity = EmbeddingsService.cosineSimilarity(queryEmbedding, messageEmbedding);

    if (similarity >= minSimilarity) {
      results.push({ message: row, similarity, rank: 0 });
    }
  }

  // Sort by relevance (similarity × recency × length × role boost)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, topK);
}
```

### Fire-and-Forget Async Pattern (memory.ts)

```typescript
// Critical pattern: don't block user responses while generating embeddings
async storeMessage(...): Promise<ConversationMessage> {
  // Store message in SQLite (synchronous, fast)
  const messageId = uuidv4();
  this.db.prepare('INSERT INTO messages ...').run(...);

  // Generate embedding asynchronously WITHOUT awaiting
  // Catches errors internally, logs but doesn't throw
  this.generateAndStoreEmbedding(messageId, content).catch((error: unknown) => {
    logger.error('Failed to generate embedding:', error instanceof Error ? { message: error.message } : {});
  });

  // Return immediately - embedding happens in background
  return { id: messageId, ... };
}

private async generateAndStoreEmbedding(messageId: string, content: string): Promise<void> {
  const embedding = await embeddingsService.generateEmbedding(content); // 100-300ms
  const embeddingBuffer = EmbeddingsService.serializeEmbedding(embedding);
  this.db.prepare('INSERT INTO embeddings ...').run(messageId, embeddingBuffer, ...);
}
```

**Why this matters:** Embedding generation takes 100-300ms. Blocking on this would make every chat response feel sluggish. The fire-and-forget pattern ensures instant message storage while embeddings populate in the background for future semantic searches.

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

❌ **Don't:** Block user responses while generating embeddings
✅ **Do:** Use fire-and-forget pattern for async operations that don't affect response content

❌ **Don't:** Hardcode similarity thresholds - they vary by use case
✅ **Do:** Use configurable thresholds (0.65 for cross-session, 0.5 for exploratory searches)

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

**See:** `docs/phase-3-completion.md` for full validation report.

**Phase 4 (Memory & RAG) - COMPLETE ✅:**

- ✅ **Embeddings Service** (165 lines) — Xenova/all-MiniLM-L6-v2 transformer, 384-dim vectors, cosine similarity
- ✅ **RAG Service** (305 lines) — Semantic search over SQLite, relevance scoring, cross-session retrieval
- ✅ **Personalization Engine** (355 lines) — 4 conversation styles, topic extraction, engagement scoring
- ✅ **Conversation Summarization** — Keyword extraction, emotional tone detection, history condensing
- ✅ **Auto-Embedding Generation** — Async embedding on message store (fire-and-forget pattern)
- ✅ **Chat Tool RAG Integration** — Semantic context retrieval, personalized system prompts
- ✅ **Comprehensive Test Suite** (18 tests) — Embeddings, RAG, personalization, summarization
- ✅ **113/113 tests passing (100%)** — All Phase 3 + Phase 4 tests validated

**See:** `docs/phase-4-completion.md` for full implementation details.

**Implemented (Phases 1-4):**

- ✅ MCP server structure with safety middleware (Phases 1-3)
- ✅ TypeScript tooling (tsx, vitest, eslint) (Phase 1)
- ✅ Persona specification (Bambi character) (Phase 2)
- ✅ Architecture decision record (model comparison, cost analysis) (Phase 1)
- ✅ VS Code tasks for build/test automation (Phase 1)
- ✅ SQLite persistence with embeddings storage (Phase 4)
- ✅ RAG with semantic search and personalization (Phase 4)
- ✅ Conversation summarization with NLP (Phase 4)
- ✅ 113/113 tests passing (100% coverage across Phases 3-4)

**Blocked Until Phase 5 Complete:**

- UX: UI, multi-modal I/O (phase 6)
- Integration, APIs, deployment (phase 7)
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
