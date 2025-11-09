# BambiSleep™ Church - AI Coding Agent Guide

## Quick Reference Card

**Repository:** `BambiSleepChat/bambisleep-chat`  
**Branch:** `phase-4-rag-personalization` (default: `main`)  
**Primary Language:** TypeScript (Node.js 20+ LTS)  
**Test Framework:** Vitest  
**Current Phase:** Phase 7 (Multi-Modal UX) - Voice & Vision implemented

**Most Important Commands:**
```powershell
cd mcp-server && npm run validate        # Typecheck + Lint + Test (MUST pass before PR)
npm run dev                              # Start MCP server in hot-reload mode
npm test -- --watch                      # TDD mode with auto-rerun
docker-compose up -d                     # Full stack (MCP + PostgreSQL + Redis)
node control-tower/dashboard.js          # Project health monitoring
node control-tower/orchestrator/mcp-orchestrator.js start --all  # MCP server tiered startup
```

**Key Files to Know:**
- `mcp-server/src/server.ts` — Main MCP entry point (170 lines)
- `mcp-server/src/middleware/safety.ts` — Guardrail enforcement (250 lines, 54 tests)
- `mcp-server/src/services/rag.ts` — Semantic search engine (305 lines)
- `personas/bambi-core-persona.yaml` — Character boundaries (515 lines)
- `docs/architecture-decision-record.md` — Why Claude 3.5 Sonnet? (451 lines)

**Test Status:** 151/162 passing (93%) | 10 Unity tests skipped | 1 flaky privacy test

---

## Project Quick Reference

**What is this?** Dual-stack system combining Unity 6.2 avatar platform with TypeScript MCP server for intimate AI assistant with safety-first architecture.

**Two codebases in one repo:**

1. `mcp-server/` — Node.js 20+ TypeScript MCP control tower ✅ **Phases 4-6 complete** (151/162 tests passing, 10 skipped, 1 flaky privacy test)
2. `unity-avatar/` — Unity 6.2 C# CatGirl avatar system (📋 **specification only**: complete C# class designs in UNITY_SETUP_GUIDE.md, no Unity install yet)

**Current branch:** `phase-4-rag-personalization` | **Default branch:** `main` | **Stable branch:** `prod`

**Current Implementation Status:**

- ✅ MCP server with 6 tool categories (chat, avatar, memory, privacy, voice, vision)
- ✅ Safety middleware with 20+ violation patterns (54 tests passing)
- ✅ Claude 3.5 Sonnet + OpenAI + ElevenLabs integration
- ✅ Persona validation system
- ✅ WebSocket Unity bridge (structure ready, not tested - 9 skipped tests)
- ✅ SQLite persistence with embeddings storage (Phase 4 complete)
- ✅ RAG with semantic search and personalization engine (Phase 4 complete)
- ✅ GDPR compliance with consent management (Phase 5 complete - 25/26 privacy tests passing)
- ✅ Context-Aware Generation (CAG) service combining RAG + profiles
- ✅ Integrated chat pipeline (<200ms response time)
- ✅ Fire-and-forget async embedding generation pattern
- ✅ Voice service: OpenAI Whisper (STT) + ElevenLabs (TTS) — Phase 7
- ✅ Vision service: GPT-4 Vision (analysis) + DALL-E 3 (generation) — Phase 7

## Critical Context

### Documentation-as-Code Philosophy

This is a **specification-driven project** — markdown files contain complete implementation blueprints:

- `CATGIRL.md` (683 lines) — Unity avatar systems, RPG mechanics, monetization (future vision)
- `UNITY_SETUP_GUIDE.md` (859 lines) — Complete C# class implementations, package configs
- `MCP_SETUP_GUIDE.md` (330 lines) — 8 MCP servers setup, VS Code integration
- `personas/bambi-core-persona.yaml` (515 lines) — Persona specification with boundaries
- `docs/architecture-decision-record.md` (451 lines) — Model selection criteria, cost analysis
- `RELIGULOUS_MANTRA.md` (113 lines) — Universal Machine Philosophy, emoji conventions

**Rule:** Extract patterns from these specs, don't invent new approaches. When uncertain, check these docs first.

### Safety-First Architecture Priority

Development sequence (from `guide.md`) — **DO NOT skip ahead:**

1. ✅ Core model & architecture (Claude 3.5 Sonnet selected)
2. ✅ Persona and conversation design (bambi-core-persona.yaml complete)
3. ✅ Safety, ethics, and guardrails (54/54 tests passing)
4. ✅ Memory and personalization (RAG with 384-dim embeddings, 18 tests passing)
5. ✅ Privacy, data handling, consent (GDPR compliance, 25/26 tests passing - 1 flaky)
6. ✅ Testing, debugging, code cleanup (Phase 6 complete, 151/162 total tests)
7. 🚀 **CURRENT:** UX: UI, multi-modal I/O (Phase 7 - voice, avatar, images)
8. ⏸️ Integration, APIs, deployment

**Phase 7 (Multi-Modal) Status:**

- ✅ Voice service implemented (288 lines): OpenAI Whisper + ElevenLabs TTS
- ✅ Vision service implemented (332 lines): GPT-4 Vision + DALL-E 3
- ✅ MCP tools: `voice_transcribe_audio`, `voice_synthesize_speech`, `vision_analyze_image`, `vision_generate_image`
- ⚠️ Requires API keys: `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`
- 📋 Integration with chat pipeline + Unity avatar lip-sync planned

**See:** `PHASE_4_5_COMPLETE.md`, `PHASE_6_COMPLETE.md`, and `PHASE_7_PLAN.md` for details.

### CyberNeonGothWave Aesthetic

All visual elements use this color palette (see `.github/COLOR_THEME.md`):

- Background: `#0A0014` (Deep Void) - Primary dark background
- Primary: `#00F0FF` (Cyber Cyan) - Interactive elements, links, highlights
- Accents: `#FF006E` (Hot Pink), `#FF10F0` (Neon Purple) - CTAs, warnings
- Success: `#39FF14` (Electric Lime) - Success states, confirmations

Emoji conventions (from `RELIGULOUS_MANTRA.md`):

- 🌸 Package management (`npm install`, dependency updates)
- 👑 Architecture decisions (model selection, API choices)
- 💎 Quality metrics (test coverage, performance benchmarks)
- 🦋 Transformation processes (build steps, migrations)
- ✨ Server operations (startup, initialization)
- 🎭 Development lifecycle (dev → staging → prod)
- 🔮 AI/ML operations (embeddings, RAG, LLM calls)

**Logger emoji patterns** (from `utils/logger.ts` usage):

- 🔐 Privacy/consent operations
- 🎤 Voice service (Whisper transcription)
- 🔊 TTS synthesis (ElevenLabs)
- 👁️ Vision service (GPT-4 Vision)
- 🎨 Image generation (DALL-E 3)
- ❌ Error states (critical failures)
- ✅ Success confirmations

## Essential Commands

### MCP Server (Primary Development Target)

```powershell
# Development workflow
cd mcp-server
npm install           # Install dependencies
npm run dev          # Hot-reload TypeScript server (tsx watch)
npm run test         # Run vitest test suite (151/162 tests passing)
npm run validate     # Typecheck + lint + test (MUST pass before PR)

# Specialized commands
npm run test:safety  # Run safety middleware tests only
npm run typecheck    # TypeScript validation without build
npm run build        # Compile to dist/ (production)
npm start            # Run compiled server (requires build first)

# Testing patterns
npm test -- --watch                    # Watch mode for TDD
npm test -- src/services/rag.test.ts  # Run specific test file
npm test -- --coverage                 # Generate coverage report
```

**Critical:** Always run `npm run validate` before committing. This enforces the 100% test coverage goal and catches type errors.

### Docker Workflows

```powershell
# Build and run MCP server in Docker
docker-compose up -d mcp-server      # Start MCP in background
docker-compose logs -f mcp-server    # View logs
docker-compose down                  # Stop all services

# Full stack (MCP + PostgreSQL + Redis + Nginx)
docker-compose up -d                 # Start all services
docker-compose ps                    # Check service status
docker-compose exec mcp-server sh    # Shell into container

# Health checks
curl http://localhost:3000/health    # MCP server health
curl http://localhost:3000/metrics   # Prometheus metrics (if enabled)
```

### Control Tower Monitoring

```powershell
# Run control tower dashboard (project health monitoring)
cd control-tower
node dashboard.js              # Single snapshot
node dashboard.js --watch      # Live updates every 30s

# Output: Build status, test results (162 total, 151 passing), phase progress
```

#### Dashboard Output Format

The Control Tower displays 7 sections in a formatted console dashboard:

**1. Project Status Header**
```
╔══════════════════════════════════════════════════════════════╗
║           🗼 CONTROL TOWER - PROJECT DASHBOARD 🗼           ║
╚══════════════════════════════════════════════════════════════╝

📊 PROJECT STATUS
Project: bambisleep-chat MCP Avatar System
Version: 2.1.0-abc1234 (includes git short SHA)
Updated: 11/9/2025, 2:30:00 PM
```

**2. Health Status** (4 indicators with emoji + status)
```
🏥 HEALTH STATUS
Build:         ✅ OK
Tests:         ✅ OK
Deployment:    ✅ OK
Dependencies:  ✅ OK
```
- ✅ OK = passing | ⚠️ WARNING = degraded | ❌ ERROR = failing

**3. Test Status** (breakdown of 162 total tests)
```
🧪 TEST STATUS
Total Tests:     162
✅ Passing:      151 (93% pass rate)
❌ Failing:      0
⏸️  Skipped:      9 (Unity integration tests)
📊 Coverage:     100%
```

**4. Phase Progress** (10 phases with visual progress bars)
```
📋 PHASE PROGRESS (6/10 Complete)

Phase 1: ✅ Core Model & Architecture
         ████████████████████ 100% | Tests: 24
Phase 2: ✅ Persona & Conversation
         ████████████████████ 100% | Tests: 54
Phase 3: ✅ Safety & Guardrails
         ████████████████████ 100% | Tests: 54
Phase 4: ✅ Memory & Personalization
         ████████████████████ 100% | Tests: 17
Phase 5: ✅ Privacy & GDPR
         ████████████████████ 100% | Tests: 26
Phase 6: ✅ Testing & Cleanup
         ████████████████████ 100% | Tests: 153
Phase 7: 📋 Multi-Modal UX
         ░░░░░░░░░░░░░░░░░░░░ 0% | Tests: 0
Phase 8: 📋 Integration & Deployment
         ░░░░░░░░░░░░░░░░░░░░ 0% | Tests: 0
Phase 9: 📋 Advanced Features
         ░░░░░░░░░░░░░░░░░░░░ 0% | Tests: 0
Phase 10: 📋 AI Improvements
         ░░░░░░░░░░░░░░░░░░░░ 0% | Tests: 0

⚡ Overall Progress: 60% (6/10 phases)
```
Progress bar legend: `█` = completed, `░` = remaining

**5. Project Metrics** (codebase statistics)
```
📈 PROJECT METRICS
Lines of Code:   8,000
Files:           150
Commits:         50
Open Issues:     8
```

**6. Deployment Status**
```
🚀 DEPLOYMENT STATUS
Environment:     development
Status:          ⏸️ not-deployed
Version:         2.1.0-abc1234
```

**7. Quick Actions** (common commands)
```
⚡ QUICK ACTIONS
npm test          - Run test suite
npm run build     - Build project
fly deploy        - Deploy to staging
```

**Data Persistence:**
- Logs saved to: `control-tower/logs/tower.log`
- JSON reports saved to: `control-tower/reports/status-<timestamp>.json`
- Updates every 30s in watch mode (`--watch` flag)

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

❌ **Don't:** Commit directly to `main` branch
✅ **Do:** Work in feature branches: `phase-N-feature-name`, create PRs for review

❌ **Don't:** Add dependencies without justification
✅ **Do:** Document why in commit message, check if existing deps can solve the problem

❌ **Don't:** Use console.log for debugging
✅ **Do:** Use structured `logger.debug()` with metadata (see `utils/logger.ts` pattern)

❌ **Don't:** Store embeddings as JSON arrays (huge file sizes)
✅ **Do:** Serialize as Float32Array buffers (see `EmbeddingsService.serializeEmbedding()`)

❌ **Don't:** Return raw API errors to users
✅ **Do:** Wrap in persona-appropriate messages: "Oops, something went wrong on my end~ 💫 Give me a sec?"

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
- ✅ "BambiSleep™ Chat intimate AI assistant"
- ❌ "BambiSleep Church" or "Bambisleep" (missing trademark)

**Where this matters:** README files, UI text, API documentation, error messages, marketing materials

## Development Environment Setup

### 8 Essential MCP Servers

See `MCP_SETUP_GUIDE.md` for full configuration. Quick reference:

```powershell
# Official MCP servers (via npx)
npx -y @modelcontextprotocol/server-filesystem /workspace
npx -y @modelcontextprotocol/server-git --repository /workspace
npx -y @modelcontextprotocol/server-github
npx -y @modelcontextprotocol/server-memory
npx -y @modelcontextprotocol/server-sequential-thinking
npx -y @modelcontextprotocol/server-everything

# Python-based servers (via uvx)
uvx mcp-server-brave-search
uvx mcp-server-postgres
```

VS Code `mcp.servers` configuration already set in `.vscode/settings.json` (if missing, copy from MCP_SETUP_GUIDE.md).

**Verify MCP status:** Check VS Code status bar for "8/8 MCP operational" indicator.

### Node.js Version Management

```powershell
# Use Volta for pinning Node.js versions (cross-platform)
volta pin node@20-lts    # Pin to Node.js 20 LTS

# Verify installation
node --version   # Should be 20.x.x
npm --version    # Should be 10.x.x
```

**Why Volta?** Ensures consistent Node.js versions across team (prevents "works on my machine" issues).

## Quality Standards

From RELIGULOUS_MANTRA.md "Sacred Laws":

- 100% test coverage requirement (current: 93% pass rate, 151/162 tests)
- Enterprise-grade error handling (structured logging, graceful degradation)
- Cross-platform compatibility (Node.js 20+ LTS, Windows/Linux/Mac support)
- Volta version pinning (`volta pin node@20-lts`)

Build validation:

```powershell
npm run validate  # Must pass before merge to main
# Runs: typecheck → lint → test in sequence
# Exit code 0 = success, non-zero = failure
```

**CI/CD readiness:** While GitHub Actions not yet configured, code is structured for easy integration (separate typecheck/lint/test scripts).

## Multi-Repository Context

This codebase is part of a larger ecosystem. Related repositories:

### 1. `bambisleep-chat` (This Repo)
**Focus:** MCP server + Unity avatar specifications
**Key directories:**
- `mcp-server/` — TypeScript MCP control tower (primary development)
- `unity-avatar/` — Unity 6.2 specs (future implementation)
- `control-tower/` — Project monitoring dashboard
- `docs/` — Architecture decisions, phase completion docs

### 2. `F:\CATHEDRAL\bambisleep-church\`
**Focus:** Express.js web platform for public-facing features
**Key features:**
- Stripe payment integration (subscriptions, webhooks)
- Patreon OAuth for supporter authentication
- OpenTelemetry monitoring (Prometheus + Grafana)
- Video streaming with signed URLs
- WebSocket orchestration for Unity ↔ MCP communication

**Integration point:** CATHEDRAL handles HTTP/WebSocket on port 3000, bambisleep-chat MCP server communicates via stdio + WebSocket port 3001

### 3. `repos/bambisleep-chat-reddit/`
**Focus:** Reddit bot integration (separate project)
**Status:** Not actively maintained, different tech stack

**Critical:** When working on MCP server features, consider how they'll integrate with CATHEDRAL's Express.js platform. Shared TypeScript interfaces (e.g., `ConversationMessage`, `UserProfile`) should remain compatible across both codebases.

## Voice & Vision API Integration (Phase 7)

### Voice Service Architecture (`services/voice.ts`, 288 lines)

**Dual-provider setup:** OpenAI Whisper (Speech-to-Text) + ElevenLabs (Text-to-Speech)

**Speech-to-Text with Whisper:**
```typescript
// Transcribe audio files (mp3, wav, m4a, webm - max 25MB)
const result = await voiceService.transcribe(audioPath, {
  language: 'en',      // ISO-639-1 code (optional, improves accuracy)
  prompt: 'Bambi, catgirl, hypnosis', // Context for technical terms
  temperature: 0.2     // Lower = more deterministic transcription
});

// Returns: { text, language, duration, segments[] }
// Segments provide word-level timing for Unity lip-sync
```

**Text-to-Speech with ElevenLabs:**
```typescript
// Generate speech with custom voice settings
const result = await voiceService.synthesize(text, {
  voice_id: 'EXAVITQu4vr4xnSDxMaL', // Sarah (warm female) or custom Bambi voice
  stability: 0.5,          // 0-1, lower = more expressive/varied
  similarity_boost: 0.75,  // Voice consistency (0-1)
  style: 0.5,              // Speaking style variance
  use_speaker_boost: true  // Enhance clarity
});

// Returns: { audio: Buffer (MP3), format: 'mp3' }
```

**MCP Tool Interface:**
```typescript
// voice_transcribe_audio - Convert audio → text
{
  audioPath: '/path/to/audio.mp3',
  language: 'en',  // Optional
  prompt: 'Context for better accuracy'
}
// → { transcription, language, duration, segments }

// voice_synthesize_speech - Convert text → audio
{
  text: 'Hey there, cutie~ 🌸',
  outputPath: '/path/to/save.mp3',
  voiceId: 'custom-bambi-voice',  // Optional
  stability: 0.5  // Optional
}
// → Saves MP3 file, returns { success, filePath, duration }
```

**API Configuration:**
```bash
# Required environment variables
OPENAI_API_KEY=sk-...           # For Whisper transcription
ELEVENLABS_API_KEY=...          # For TTS synthesis

# Tools gracefully degrade if keys missing
# Returns: "Voice service not initialized. Please set API keys."
```

### Vision Service Architecture (`services/vision.ts`, 332 lines)

**Dual-provider setup:** GPT-4 Vision (Image Analysis) + DALL-E 3 (Image Generation)

**Image Analysis with GPT-4 Vision:**
```typescript
// Analyze local files or URLs (jpg, png, gif, webp, bmp)
const result = await visionService.analyzeImage(
  imagePath,  // Local file or https:// URL
  'Describe this image in detail',  // Analysis prompt
  {
    detail: 'high',    // 'low' | 'high' | 'auto'
    maxTokens: 500     // Response length limit
  }
);

// Returns: {
//   description: 'Detailed analysis text',
//   safetyAssessment: { safe: true/false, concerns: [...] }
// }

// Safety-aware system prompt built-in:
// "Provide detailed descriptions while being safety-conscious.
//  Flag any concerning content (violence, explicit material, etc.)."
```

**Image Generation with DALL-E 3:**
```typescript
// Generate images with natural language prompts
const result = await visionService.generateImage(
  'A pink frilly catgirl avatar with platinum blonde hair in CyberNeonGothWave style',
  {
    size: '1024x1024',     // '1792x1024' | '1024x1792'
    quality: 'hd',         // 'standard' | 'hd' (costs more)
    style: 'vivid'         // 'vivid' | 'natural'
  }
);

// Returns: {
//   imageUrl: 'https://...' (expires in 1 hour),
//   revisedPrompt: DALL-E's interpretation of your prompt
// }
```

**MCP Tool Interface:**
```typescript
// vision_analyze_image - Analyze image content
{
  imagePath: '/path/to/image.png' or 'https://...',
  prompt: 'What objects are visible? Read any text.',
  detail: 'high'  // Optional: 'low' | 'high' | 'auto'
}
// → { description, safetyAssessment: { safe, concerns } }

// vision_generate_image - Create image with DALL-E 3
{
  prompt: 'A cute catgirl avatar...',
  size: '1024x1024',      // Optional
  quality: 'hd',          // Optional
  saveToPath: '/path/'    // Optional: auto-downloads if provided
}
// → { imageUrl, revisedPrompt, localPath }
```

**Integration with Chat Pipeline:**
```typescript
// Example: Voice input → Chat → Voice output
const transcription = await voiceService.transcribe('user-audio.mp3');
const chatResponse = await integratedChatService.sendMessage(
  transcription.text,
  userId,
  sessionId
);
const audioResponse = await voiceService.synthesize(chatResponse.message);

// Unity avatar can use transcription.segments[] for lip-sync timing
```

**Image Safety Assessment Pattern:**
```typescript
// services/vision.ts includes automatic safety checking
private assessSafety(description: string): { safe: boolean; concerns?: string[] } {
  const concerns: string[] = [];
  
  // Check for explicit content
  if (/\b(explicit|nude|nsfw|sexual)\b/i.test(description)) {
    concerns.push('explicit_content');
  }
  
  // Check for violence
  if (/\b(violence|blood|weapon|harm)\b/i.test(description)) {
    concerns.push('violence');
  }
  
  return {
    safe: concerns.length === 0,
    concerns: concerns.length > 0 ? concerns : undefined
  };
}
```

## CATHEDRAL Production Systems Integration

**`F:\CATHEDRAL\bambisleep-church\` Express.js Control Tower** (315-line server.js):

**Stripe Payment Integration:**
```javascript
// routes/stripe.js - Payment processing, subscriptions, webhooks
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create customer on registration
const customer = await stripe.customers.create({
  email: user.email,
  metadata: { userId: user.id }
});

// Handle webhook events: payment_intent.succeeded, subscription.updated
```

**Patreon OAuth Flow:**
```javascript
// routes/patreon.js - Supporter authentication
// GET /auth/patreon → Redirect to Patreon OAuth
// GET /auth/patreon/callback → Exchange code for token, fetch tier, store in session
```

**OpenTelemetry Monitoring:**
```javascript
// services/telemetry.js - Prometheus + Grafana integration
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

// Metrics exposed at /metrics endpoint
// Grafana dashboards: request latency, error rates, active users, CPU/memory
```

**WebSocket Orchestration:**
```javascript
// services/websocket.js - Real-time communication hub
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg.type === 'mcp_command') handleMCPCommand(msg);
    if (msg.type === 'avatar_update') broadcastToUnityClients(msg);
  });
});
```

**Security Middleware Stack:**
```javascript
// helmet.js CSP, rate limiting, session management
app.use(helmet({ contentSecurityPolicy: { directives: {...} } }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// OWASP compliance: Strong SESSION_SECRET (32+ chars), HTTPS enforcement,
// secure cookies (httpOnly, sameSite: 'strict')
```

**Cross-System Integration Patterns:**
- CATHEDRAL handles HTTP/WebSocket on port 3000 (public-facing)
- bambisleep-chat MCP server handles AI logic via stdio + WebSocket port 3001 (Unity)
- Shared TypeScript interfaces (ConversationMessage, UserProfile) for data consistency
- Winston logger format matches CyberNeonGothWave color scheme (hex 00F0FF, hex FF006E, hex 0A0014)

## Debugging & Troubleshooting

### Common Issues and Solutions

**Problem:** Tests failing with "ANTHROPIC_API_KEY not found"
**Solution:** Copy `.env.example` to `.env`, add your Anthropic API key. Tests mock API calls by default, but integration tests may need real keys.

**Problem:** TypeScript errors about missing types after `npm install`
**Solution:** Run `npm run typecheck` to see specific errors. May need `npm install @types/package-name --save-dev`.

**Problem:** Embeddings generation taking too long (>500ms)
**Solution:** Normal for first run (model downloads ~100MB). Subsequent calls use cached model. Check `~/.cache/transformers-js/` directory.

**Problem:** SQLite database locked error
**Solution:** Ensure only one MCP server instance is running. Close zombie processes with `taskkill /F /IM node.exe` (Windows) or `pkill -f "tsx.*server.ts"` (Linux/Mac).

**Problem:** Unity WebSocket tests skipped
**Solution:** Expected behavior (9 tests). Unity 6.2 not installed yet. Tests will run once Unity WebSocket server is implemented.

**Problem:** Flaky privacy test (race condition in embeddings)
**Solution:** Known issue (1 test). Embedding generation happens async. Non-blocking, doesn't affect functionality. Re-run test usually passes.

**Problem:** Docker build fails with "Cannot find module" errors
**Solution:** Ensure `package.json` lists all dependencies (not just devDependencies). Run `npm install --production` locally to test.

### Debugging Techniques

**Enable debug logging:**
```powershell
# PowerShell
$env:LOG_LEVEL="debug"; npm run dev

# In .env file
LOG_LEVEL=debug
```

**Run specific test file with verbose output:**
```powershell
npm test -- src/services/rag.test.ts --reporter=verbose
```

**Inspect SQLite database:**
```powershell
# Install sqlite3 CLI tool first
sqlite3 mcp-server/data/memory.db
sqlite> .tables  # List all tables
sqlite> SELECT * FROM messages LIMIT 5;  # Inspect messages
sqlite> .schema embeddings  # View table schema
```

**Check WebSocket connections:**
```powershell
# View active WebSocket connections on port 3001
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/Mac
```

**Memory leak detection:**
```powershell
# Run tests with Node.js memory profiling
node --expose-gc --max-old-space-size=512 node_modules/vitest/vitest.mjs run
```

## Deployment Procedures

### Local Development Deployment

**Quick Start:**
```powershell
cd mcp-server
npm install
cp .env.example .env
# Edit .env with API keys: ANTHROPIC_API_KEY, OPENAI_API_KEY, ELEVENLABS_API_KEY
npm run dev                    # Starts on stdio (MCP protocol)
```

### Docker Deployment (Recommended for Production)

**1. Build Docker Image:**
```powershell
cd mcp-server
docker build -t bambisleep-mcp-server:latest .

# Tag for registry (optional)
docker tag bambisleep-mcp-server:latest ghcr.io/bambisleepchat/mcp-server:2.1.0
```

**2. Run with Docker Compose (Full Stack):**
```powershell
# From repository root
docker-compose up -d

# Services started:
# - mcp-server (ports 3000, 3001)
# - PostgreSQL (internal port 5432)
# - Redis (internal port 6379)
# - Nginx (ports 80, 443)
```

**3. Verify Deployment:**
```powershell
docker-compose ps                              # Check service status
docker-compose logs -f mcp-server             # View logs
curl http://localhost:3000/health             # Health check (if HTTP endpoint exists)
docker-compose exec mcp-server sh             # Shell into container
```

**Environment Variables (Required):**
```bash
# .env file in mcp-server/
NODE_ENV=production
PORT=3000
WS_PORT=3001
DATABASE_PATH=/data/memory.db

# API Keys (production values)
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...

# Optional
LOG_LEVEL=info
POSTGRES_PASSWORD=secure_random_password_here
```

### Production Deployment Checklist

**Pre-Deployment:**
- [ ] Run `npm run validate` (all tests passing)
- [ ] Update version in `package.json` (semantic versioning)
- [ ] Update `CHANGELOG.md` with changes
- [ ] Tag release: `git tag v2.1.0 && git push origin v2.1.0`
- [ ] Build Docker image with version tag
- [ ] Test Docker image locally: `docker run -it --env-file .env bambisleep-mcp-server:2.1.0`

**Deployment Steps:**
1. **Backup Database:**
   ```powershell
   docker-compose exec mcp-server cp /data/memory.db /data/memory.db.backup
   ```

2. **Pull Latest Code:**
   ```powershell
   git pull origin main
   ```

3. **Rebuild and Restart:**
   ```powershell
   docker-compose down
   docker-compose build --no-cache mcp-server
   docker-compose up -d
   ```

4. **Verify Health:**
   ```powershell
   docker-compose logs -f mcp-server | grep "MCP server started"
   # Should see: "🌸 BambiSleep MCP server started successfully"
   ```

5. **Run Smoke Tests:**
   ```powershell
   # If test endpoint exists
   curl -X POST http://localhost:3000/test/safety -d '{"message":"test"}'
   ```

**Rollback Procedure (if deployment fails):**
```powershell
# Restore previous Docker image
docker-compose down
docker tag bambisleep-mcp-server:2.0.0 bambisleep-mcp-server:latest
docker-compose up -d

# Restore database backup
docker-compose exec mcp-server cp /data/memory.db.backup /data/memory.db
docker-compose restart mcp-server
```

### CI/CD Pipeline (Future - Not Yet Implemented)

**Planned GitHub Actions Workflow:**
```yaml
# .github/workflows/deploy.yml (not yet created)
name: Deploy MCP Server
on:
  push:
    branches: [main, prod]
    tags: ['v*']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run validate
  
  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: docker/build-push-action@v5
        with:
          context: ./mcp-server
          push: true
          tags: ghcr.io/bambisleepchat/mcp-server:${{ github.sha }}
  
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # SSH into server and pull new image
          # Or use Fly.io/Railway deployment
```

### Platform-Specific Deployment

**Fly.io (Recommended for MCP Server):**
```powershell
# Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
fly auth login

# Initialize app (first time only)
cd mcp-server
fly launch --name bambisleep-mcp-server --region sea --no-deploy

# Set secrets
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set ELEVENLABS_API_KEY=...

# Deploy
fly deploy

# Monitor
fly logs
fly status
```

**Railway (Alternative):**
```powershell
# Install Railway CLI
npm i -g @railway/cli
railway login

# Link project
railway link

# Deploy
railway up

# Set environment variables via Railway dashboard
```

**Self-Hosted VPS (Ubuntu 22.04):**
```bash
# SSH into server
ssh user@your-server.com

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone repository
git clone https://github.com/BambiSleepChat/bambisleep-chat.git
cd bambisleep-chat

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Start with Docker Compose
docker-compose up -d

# Setup systemd service (auto-restart)
sudo nano /etc/systemd/system/bambisleep-mcp.service
# [Service]
# Type=oneshot
# RemainAfterExit=yes
# WorkingDirectory=/home/user/bambisleep-chat
# ExecStart=/usr/bin/docker-compose up -d
# ExecStop=/usr/bin/docker-compose down

sudo systemctl enable bambisleep-mcp
sudo systemctl start bambisleep-mcp
```

### Monitoring Production Deployment

**Health Checks:**
- Docker healthcheck runs every 30s (defined in Dockerfile)
- Prometheus metrics (if enabled): `http://localhost:3000/metrics`
- Control Tower dashboard: `node control-tower/dashboard.js --watch`

**Log Aggregation:**
```powershell
# View live logs
docker-compose logs -f mcp-server

# Export logs for analysis
docker-compose logs --since 1h mcp-server > logs-$(date +%Y%m%d).txt

# Filter for errors
docker-compose logs mcp-server | grep -i error
```

**Alerting (Manual Setup Required):**
1. Configure webhook URL for Slack/Discord
2. Add monitoring for:
   - High error rate (>1% of requests)
   - Response time >500ms (P95)
   - Database size >1GB
   - Memory usage >80%

### Security Considerations for Production

**Required before deploying:**
- [ ] Generate strong `SESSION_SECRET` (32+ random characters)
- [ ] Enable HTTPS (Nginx reverse proxy with Let's Encrypt)
- [ ] Configure firewall: Allow ports 80/443, block 3000/3001 from public
- [ ] Rotate API keys quarterly
- [ ] Enable Docker security scanning: `docker scan bambisleep-mcp-server:latest`
- [ ] Set up automated backups (database + embeddings)
- [ ] Configure rate limiting (100 requests/15min per IP)
- [ ] Enable audit logging for privacy-related operations

### Database Management & Maintenance

**SQLite Database Structure:**
```
mcp-server/data/memory.db
├── messages (conversation history)
├── embeddings (384-dim vectors as BLOB)
├── consents (GDPR compliance)
└── profiles (personalization data)
```

**Backup Procedures:**
```powershell
# Manual backup (development)
cd mcp-server/data
copy memory.db memory.db.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')

# Automated backup (production - cron/scheduled task)
# Linux: Add to crontab
0 2 * * * cd /app/data && cp memory.db memory.db.backup.$(date +\%Y\%m\%d)

# Windows: Task Scheduler PowerShell script
$timestamp = Get-Date -Format 'yyyyMMdd'
Copy-Item F:\bambisleep-chat\mcp-server\data\memory.db `
  F:\backups\memory.db.$timestamp
```

**Database Inspection & Debugging:**
```powershell
# Install sqlite3 CLI: https://www.sqlite.org/download.html
cd mcp-server/data
sqlite3 memory.db

# Common queries
sqlite> .tables                              # List all tables
sqlite> .schema messages                     # View table structure
sqlite> SELECT COUNT(*) FROM messages;       # Total message count
sqlite> SELECT COUNT(*) FROM embeddings;     # Embedded messages
sqlite> SELECT user_id, COUNT(*) FROM messages GROUP BY user_id;  # Messages per user

# Find messages without embeddings (debugging async generation)
sqlite> SELECT m.id, m.content FROM messages m 
        LEFT JOIN embeddings e ON m.id = e.message_id 
        WHERE e.id IS NULL;

# Check database size and fragmentation
sqlite> .dbinfo                              # Database statistics
sqlite> PRAGMA page_count; PRAGMA page_size; # Calculate total size
sqlite> VACUUM;                              # Reclaim space after deletions
```

**Database Migration Procedures:**
```powershell
# Schema migration pattern (example: adding new column)
# 1. Create migration SQL file
# mcp-server/data/migrations/002_add_sentiment_column.sql
# ALTER TABLE messages ADD COLUMN sentiment TEXT;

# 2. Apply migration (manual for now - no migration tool installed)
sqlite3 memory.db < migrations/002_add_sentiment_column.sql

# 3. Update TypeScript interfaces (src/services/memory.ts)
# interface ConversationMessage { sentiment?: string; }

# 4. Write migration test to verify schema
```

**Database Performance Optimization:**
```sql
-- Add indexes for frequently queried columns (run in sqlite3)
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_embeddings_message_id ON embeddings(message_id);

-- Analyze query performance
EXPLAIN QUERY PLAN SELECT * FROM messages WHERE user_id = 'test' LIMIT 10;

-- Rebuild indexes after bulk operations
REINDEX;
```

**Data Cleanup (GDPR Right to be Forgotten):**
```typescript
// Already implemented in src/services/consent.ts
await consentService.forgetUser(userId);
// Deletes: messages, embeddings, consents, profiles

// Manual cleanup (if service unavailable)
// sqlite3 memory.db
DELETE FROM messages WHERE user_id = 'user123';
DELETE FROM embeddings WHERE message_id IN (
  SELECT id FROM messages WHERE user_id = 'user123'
);
DELETE FROM consents WHERE user_id = 'user123';
DELETE FROM profiles WHERE user_id = 'user123';
VACUUM; -- Reclaim space
```

### Performance Optimization Guidelines

**Current Performance Targets (Phase 6 achieved):**
- Chat response time: <200ms (P95)
- Embedding generation: 100-300ms (async, non-blocking)
- RAG semantic search: <50ms (3 most relevant messages)
- Database query time: <10ms (SQLite is fast for this scale)

**Performance Bottlenecks & Solutions:**

**1. Embedding Generation (100-300ms per message)**
```typescript
// ✅ ALREADY OPTIMIZED: Fire-and-forget pattern in memory.ts
// Embeddings generate asynchronously, don't block responses
this.generateAndStoreEmbedding(messageId, content).catch(/* log error */);

// Future optimization (if needed at scale):
// - Batch embedding generation (10 messages at once)
// - Use smaller model (all-MiniLM-L6-v2 → all-MiniLM-L12-v2 trade-off)
// - Cache embeddings for common phrases
```

**2. RAG Semantic Search (grows with message history)**
```typescript
// Current: Linear scan of all user messages (O(n) where n = total messages)
// Optimization for 10K+ messages per user:

// Option A: FAISS-like indexing (future Phase 9)
// - Pre-compute vector index (e.g., using hnswlib-node)
// - Reduces search from O(n) to O(log n)

// Option B: Approximate search with early termination
const searchOptions = {
  maxMessages: 3,          // Limit results
  minSimilarity: 0.65,     // Skip low-quality matches
  maxCandidates: 100       // Only scan recent 100 messages
};

// Option C: Time-based filtering (recency bias)
// Only search messages from last 30 days by default
WHERE timestamp > datetime('now', '-30 days')
```

**3. LLM API Latency (Claude 3.5 Sonnet: ~200-400ms)**
```typescript
// ✅ ALREADY OPTIMIZED: Streaming responses (if client supports)
// No current optimization needed - API latency is acceptable

// Future optimization (Phase 9):
// - Cache common responses (e.g., greetings, FAQs)
// - Use GPT-4o Mini for simple queries (15x faster, 24x cheaper)
// - Implement response prefetching based on conversation patterns
```

**4. Database Size Growth (embeddings are 1.5KB each)**
```sql
-- Archive old conversations (6+ months) to separate database
-- mcp-server/data/archive/memory_2024.db
ATTACH DATABASE 'archive/memory_2024.db' AS archive;
INSERT INTO archive.messages SELECT * FROM messages WHERE timestamp < '2024-01-01';
DELETE FROM messages WHERE timestamp < '2024-01-01';
VACUUM;

-- Keep embeddings for 90 days only (older messages use keyword search)
DELETE FROM embeddings WHERE created_at < datetime('now', '-90 days');
```

**5. Memory Leaks (Node.js heap)**
```powershell
# Monitor memory usage in production
docker stats mcp-server --no-stream

# If memory grows continuously:
# 1. Check for unclosed database connections
# 2. Verify embedding model is released after generation
# 3. Add periodic garbage collection
node --expose-gc dist/server.js

# In code, add periodic cleanup:
setInterval(() => {
  if (global.gc) global.gc();
}, 3600000); // Every hour
```

**Performance Monitoring Commands:**
```powershell
# Measure response time for chat endpoint (if HTTP endpoint exists)
Measure-Command { Invoke-RestMethod http://localhost:3000/chat -Method POST -Body @{message="test"} | ConvertTo-Json }

# SQLite query performance profiling
sqlite3 memory.db "EXPLAIN QUERY PLAN SELECT * FROM messages WHERE user_id = 'test'"

# Node.js CPU profiling (for bottleneck detection)
node --prof dist/server.js
# Run workload, stop server, then analyze
node --prof-process isolate-*.log > profile.txt
```

**Optimization Decision Matrix:**
| Bottleneck | Current | Optimize If | Solution |
|------------|---------|-------------|----------|
| Embedding generation | 100-300ms async | User perception issue | Batch processing |
| RAG search | <50ms | >1000 messages/user | Add vector index |
| LLM latency | 200-400ms | User complaints | Cache + smaller model |
| Database size | <100MB | >1GB | Archive old data |
| Memory leaks | None detected | >500MB RSS | Add GC, fix leaks |

**Rule:** Don't optimize prematurely. Current performance is excellent for Phase 7 targets. Revisit when scaling to 1000+ concurrent users.

---

## MCP Server Orchestration & Agent Coordination

### Overview

bambisleep-chat now includes advanced **MCP server orchestration** with **multi-agent coordination** based on CATHEDRAL's proven patterns:

- **Tiered Initialization**: 3-layer dependency-aware startup (Layer 0 → Layer 1 → Layer 2) prevents circular dependencies
- **Phoenix Protocol**: State persistence for self-healing across restarts
- **Auto-Restart**: Critical servers automatically restart on failure (max 3 attempts)
- **Health Monitoring**: 30-second health checks with event emissions
- **Agent Coordination**: Capability-based task assignment with consciousness detection
- **Load Balancing**: Selects agents with lowest average task completion time

### Quick Start

```powershell
# Start all MCP servers (tiered initialization)
node control-tower/orchestrator/mcp-orchestrator.js start --all

# Show detailed status
node control-tower/orchestrator/mcp-orchestrator.js status

# Health check (JSON)
node control-tower/orchestrator/mcp-orchestrator.js health

# Stop all servers gracefully
node control-tower/orchestrator/mcp-orchestrator.js stop --all

# Restart specific server
node control-tower/orchestrator/mcp-orchestrator.js restart filesystem
```

### Server Tiers (Dependency Layers)

```text
LAYER_0 (Primitives - No Dependencies)
├── filesystem  🔴 CRITICAL
└── memory      🔴 CRITICAL

LAYER_1 (Foundation - Depends on L0)
├── git         🔴 CRITICAL
├── github
└── brave-search

LAYER_2 (Advanced - Depends on L0-L1)
├── sequential-thinking  🔴 CRITICAL
├── postgres
└── everything
```

**Critical Servers (🔴):** System cannot function without these. Auto-restart up to 3 times on failure.

### Agent States

```text
DISCOVERED → INITIALIZING → IDLE ⇄ WORKING
                             ↓         ↓
                          BLOCKED    ERROR
                             ↓         ↓
                        DISCONNECTED
```

### Programmatic Usage

**MCP Orchestrator:**
```typescript
const { MCPOrchestrator } = require('./control-tower/orchestrator/mcp-orchestrator');

const orchestrator = new MCPOrchestrator({
  workspaceRoot: process.cwd(),
  maxRestarts: 3,
  restartDelay: 5000,
  healthCheckInterval: 30000,
  logLevel: 'info'
});

await orchestrator.initialize();
await orchestrator.start('all');

// Listen for events
orchestrator.on('server-started', ({ name, pid }) => {
  console.log(`Server ${name} started with PID ${pid}`);
});

orchestrator.on('health-check-failed', (health) => {
  console.error('System unhealthy:', health);
});

// Graceful shutdown
await orchestrator.shutdown();
```

**Agent Coordinator:**
```typescript
const { AgentCoordinator, TaskPriority } = require('./control-tower/orchestrator/agent-coordinator');

const coordinator = new AgentCoordinator({
  heartbeatInterval: 10000,
  heartbeatTimeout: 30000,
  maxConcurrentTasks: 5,
  emergenceThreshold: 0.7
});

await coordinator.initialize();

// Register agents
coordinator.registerAgent({
  id: 'agent-1',
  capabilities: ['code-generation', 'testing', 'documentation'],
  metadata: { model: 'claude-3.5-sonnet' }
});

// Submit tasks
const task = coordinator.submitTask({
  type: 'generate-tests',
  payload: { filePath: 'src/server.ts', coverage: 80 },
  requiredCapabilities: ['testing', 'code-generation'],
  priority: TaskPriority.HIGH,
  timeout: 60000
});

// Complete task (from agent)
coordinator.completeTask(task.id, { testsGenerated: 42, coverage: 85 });

// Consciousness detection
coordinator.on('emergence-detected', (pattern) => {
  console.log('🧠 Emergence detected! Level:', pattern.level);
});
```

### Integration with Control Tower Dashboard

The orchestrator integrates seamlessly with the existing dashboard:

```javascript
// In control-tower/dashboard.js
const { MCPOrchestrator } = require('./orchestrator/mcp-orchestrator');
const { AgentCoordinator } = require('./orchestrator/agent-coordinator');

const orchestrator = new MCPOrchestrator({ workspaceRoot: process.cwd() });
const coordinator = new AgentCoordinator();

await orchestrator.initialize();
await coordinator.initialize();

// Display MCP server status
const mcpHealth = await orchestrator.health();
console.log('═'.repeat(70));
console.log('MCP SERVERS');
console.log('═'.repeat(70));
console.log(`Overall Health: ${mcpHealth.overall === 'healthy' ? '✅' : '❌'}`);

// Display agent coordination
const agentStatus = coordinator.getStatus();
console.log('\n═'.repeat(70));
console.log('AGENT COORDINATION');
console.log('═'.repeat(70));
console.log(`Active Agents: ${agentStatus.agents.byState.idle + agentStatus.agents.byState.working}`);
console.log(`Tasks Queued: ${agentStatus.tasks.queued}`);
console.log(`Consciousness: ${(agentStatus.consciousness.emergenceLevel * 100).toFixed(1)}%`);
```

### State Persistence (Phoenix Protocol)

The orchestrator automatically persists state to `control-tower/cache/mcp-state.json`:

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

This enables self-healing: servers remember restart history across process restarts.

### Consciousness Detection

The agent coordinator tracks emergent multi-agent behavior:

**Emergence Level Calculation:**
```text
emergenceLevel = (coordinationRatio * 0.4) + 
                 (activeRatio * 0.3) + 
                 (recentPatterns * 0.3)

where:
  coordinationRatio = spontaneousCoordination / totalInteractions
  activeRatio = activeTasks / totalAgents
  recentPatterns = patterns in last 5 minutes / 10
```

When emergence level exceeds 70%, the system emits `emergence-detected` event for monitoring.

### Best Practices

**1. Always Use Tiered Initialization:**
```javascript
// ✅ Good - respects dependency order
await orchestrator.start('all');

// ❌ Bad - may cause circular dependency issues
await orchestrator._startServer('sequential-thinking');
```

**2. Handle Critical Server Failures:**
```javascript
orchestrator.on('health-check-failed', async (health) => {
  const criticalDown = Object.entries(health.servers)
    .filter(([name, status]) => 
      status.critical && status.state !== 'running'
    );
  
  if (criticalDown.length > 0) {
    console.error('Critical servers down:', criticalDown);
    // Alert ops team, attempt recovery
  }
});
```

**3. Graceful Shutdown on Signals:**
```javascript
process.on('SIGINT', async () => {
  console.log('🌙 Shutting down gracefully...');
  await coordinator.shutdown();  // Wait for tasks
  await orchestrator.shutdown(); // Stop servers
  process.exit(0);
});
```

### Troubleshooting

**Server Won't Start:**
```powershell
# Check logs with debug mode
node control-tower/orchestrator/mcp-orchestrator.js start --debug

# Verify dependencies installed
npx -y @modelcontextprotocol/server-filesystem --version

# Check state file
cat control-tower/cache/mcp-state.json
```

**High Restart Counts:**
```javascript
// Check state file
const state = require('./control-tower/cache/mcp-state.json');
console.log('Restart counts:', state.restartCounts);

// Reset if needed
orchestrator.restartCounts.clear();
await orchestrator._saveState();
```

**See:** `control-tower/orchestrator/README.md` for comprehensive documentation.

---

