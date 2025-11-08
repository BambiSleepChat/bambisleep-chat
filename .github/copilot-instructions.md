# BambiSleep™ Church - AI Agent Guide# BambiSleep™ Church - AI Agent Guide

## Quick Reference## Quick Reference

**Dual-stack:** MCP TypeScript server + Unity 6.2 avatar (spec-only, not installed)

**Dual-stack:** MCP TypeScript server + Unity 6.2 avatar (spec-only, not installed) **Status:** Phase 6 complete — 152/162 tests (94%), 0 lint errors, 54 warnings, production ready

**Status:** Phase 6 complete — 152/162 tests (94%), 0 lint errors, 54 warnings, production ready **Branch:** `phase-4-rag-personalization` (default: `main`, stable: `prod`)

**Branch:** `phase-4-rag-personalization` (default: `main`, stable: `prod`)

### Implementation Complete ✅

### Implementation Complete ✅- MCP server: 4 tool categories (chat, avatar, memory, privacy)

- Safety: 20+ violation patterns, 54 tests passing

- MCP server: 4 tool categories (chat, avatar, memory, privacy)- LLM: Claude 3.5 Sonnet + OpenAI integration

- Safety: 20+ violation patterns, 54 tests passing- Persona validation system

- LLM: Claude 3.5 Sonnet + OpenAI integration- WebSocket Unity bridge (not tested, 10 skipped tests)

- Persona validation system- SQLite + embeddings (384-dim vectors, Xenova/all-MiniLM-L6-v2)

- WebSocket Unity bridge (not tested, 10 skipped tests)- RAG semantic search + personalization (4 styles)

- SQLite + embeddings (384-dim vectors, Xenova/all-MiniLM-L6-v2)- GDPR: consent, export, deletion, audit (26 tests)

- RAG semantic search + personalization (4 styles)- CAG service (context-aware generation)

- GDPR: consent, export, deletion, audit (26 tests)- Integrated chat: <200ms pipeline

- CAG service (context-aware generation)

- Integrated chat: <200ms pipeline## Critical Context

## Critical Context### Documentation-as-Code

**Specs = Implementation blueprints** — Extract patterns, don't invent:

### Documentation-as-Code- `CATGIRL.md` (683 lines) — Unity systems, RPM, monetization

- `UNITY_SETUP_GUIDE.md` (859 lines) — Complete C# classes

**Specs = Implementation blueprints** — Extract patterns, don't invent:- `MCP_SETUP_GUIDE.md` (330 lines) — 8 MCP servers setup

- `personas/bambi-core-persona.yaml` (515 lines) — Character boundaries

- `CATGIRL.md` (683 lines) — Unity systems, RPM, monetization- `docs/architecture-decision-record.md` (451 lines) — Model selection

- `UNITY_SETUP_GUIDE.md` (859 lines) — Complete C# classes- `docs/phases/` — Phase reports (4-7)

- `MCP_SETUP_GUIDE.md` (330 lines) — 8 MCP servers setup

- `personas/bambi-core-persona.yaml` (515 lines) — Character boundaries### Development Sequence (DO NOT skip)

- `docs/architecture-decision-record.md` (451 lines) — Model selection1. ✅ Core model (Claude 3.5 Sonnet)

- `docs/phases/` — Phase reports (4-7)2. ✅ Persona design (bambi-core-persona.yaml)

3. ✅ Safety guardrails (54/54 tests)

### Development Sequence (DO NOT skip)4. ✅ Memory/RAG (18 tests, 384-dim embeddings)

5. ✅ Privacy/GDPR (26/26 tests)

1. ✅ Core model (Claude 3.5 Sonnet)6. ✅ Testing/cleanup (152/162 tests)

1. ✅ Persona design (bambi-core-persona.yaml)7. 🚀 **NEXT:** UX (voice, avatar, images)

1. ✅ Safety guardrails (54/54 tests)8. ⏸️ Deployment

1. ✅ Memory/RAG (18 tests, 384-dim embeddings)

1. ✅ Privacy/GDPR (26/26 tests)### Color Palette (CyberNeonGothWave)

1. ✅ Testing/cleanup (152/162 tests)| Color | Hex | Use |

1. 🚀 **NEXT:** UX (voice, avatar, images)|-------|-----|-----|

1. ⏸️ Deployment| Background | hex 0A0014 | Deep Void |

| Primary | hex 00F0FF | Cyber Cyan |

### Color Palette (CyberNeonGothWave)| Accent 1 | hex FF006E | Hot Pink |

| Accent 2 | hex FF10F0 | Neon Purple |

| Color | Hex | Use || Success | hex 39FF14 | Electric Lime |

|-------|-----|-----|

| Background | hex 0A0014 | Deep Void |**Emoji:** 🌸 packages, 👑 architecture, 💎 quality, 🦋 transformation

| Primary | hex 00F0FF | Cyber Cyan |

| Accent 1 | hex FF006E | Hot Pink |## Essential Commands

| Accent 2 | hex FF10F0 | Neon Purple |

| Success | hex 39FF14 | Electric Lime |### MCP Server (Primary Target)

```powershell

**Emoji:** 🌸 packages, 👑 architecture, 💎 quality, 🦋 transformationcd mcp-server

npm install          # Dependencies

## Essential Commandsnpm run dev         # Hot-reload dev server

npm run test        # Vitest suite

### MCP Server (Primary Target)npm run validate    # Typecheck + lint + test (CI gate)

```

````powershell

cd mcp-server**Key Files:**

npm install          # Dependencies- `src/server.ts` (157 lines) — Main MCP entry

npm run dev         # Hot-reload dev server- `src/middleware/safety.ts` (250 lines) — 20+ violation patterns

npm run test        # Vitest suite- `src/middleware/privacy.ts` — GDPR compliance

npm run validate    # Typecheck + lint + test (CI gate)- `src/middleware/persona-validator.ts` (179 lines) — Boundary checks

```- `src/services/claude.ts` (189 lines) — Claude integration

- `src/services/embeddings.ts` (165 lines) — Transformer embeddings

**Key Files:**- `src/services/rag.ts` (305 lines) — Semantic search

- `src/services/personalization.ts` (355 lines) — 4 conversation styles

- `src/server.ts` (157 lines) — Main MCP entry- `src/services/cag.ts` (338 lines) — Context assembly

- `src/middleware/safety.ts` (250 lines) — 20+ violation patterns- `src/services/consent.ts` — GDPR consent management

- `src/middleware/privacy.ts` — GDPR compliance- `src/services/memory.ts` (600+ lines) — SQLite + embeddings

- `src/middleware/persona-validator.ts` (179 lines) — Boundary checks- `src/services/unity-bridge.ts` — WebSocket (structure only)

- `src/services/claude.ts` (189 lines) — Claude integration- `src/integrated-chat.ts` (194 lines) — Full AI pipeline

- `src/services/embeddings.ts` (165 lines) — Transformer embeddings- `src/tools/{chat,avatar,memory,privacy}.ts` — MCP tools

- `src/services/rag.ts` (305 lines) — Semantic search- `src/utils/logger.ts` — CyberNeonGothWave logging

- `src/services/personalization.ts` (355 lines) — 4 conversation styles

- `src/services/cag.ts` (338 lines) — Context assembly**Dependencies:** @modelcontextprotocol/sdk, @anthropic-ai/sdk, openai, @xenova/transformers, better-sqlite3, ws, express, zod, vitest

- `src/services/consent.ts` — GDPR consent management

- `src/services/memory.ts` (600+ lines) — SQLite + embeddings**Test Status:**

- `src/services/unity-bridge.ts` — WebSocket (structure only)- 152/162 passing (94%)

- `src/integrated-chat.ts` (194 lines) — Full AI pipeline- 10 Unity tests skipped (Unity not installed)

- `src/tools/{chat,avatar,memory,privacy}.ts` — MCP tools- 0 lint errors, 54 warnings (production ready)

- `src/utils/logger.ts` — CyberNeonGothWave logging- ⚠️ Requires `ANTHROPIC_API_KEY` for live Claude testing



**Dependencies:** @modelcontextprotocol/sdk, @anthropic-ai/sdk, openai, @xenova/transformers, better-sqlite3, ws, express, zod, vitest### Unity (Spec Only)

```powershell

**Test Status:**# Follow UNITY_SETUP_GUIDE.md for Unity 6000.2.11f1 + packages

# Specs exist, no playable build yet — Unity not near-term priority

- 152/162 passing (94%)```

- 10 Unity tests skipped (Unity not installed)

- 0 lint errors, 54 warnings (production ready)## Data Flow

- ⚠️ Requires `ANTHROPIC_API_KEY` for live Claude testing```

User → MCP Server (3000)

### Unity (Spec Only)    → SafetyFilter (middleware/safety.ts)

    → Persona enforcement (bambi-core-persona.yaml)

```powershell    → RAG Context (services/rag.ts)

# Follow UNITY_SETUP_GUIDE.md for Unity 6000.2.11f1 + packages       ├─ Query embedding (Xenova/all-MiniLM-L6-v2)

# Specs exist, no playable build yet — Unity not near-term priority       ├─ Vector similarity (cosine, threshold 0.65)

```       ├─ Top 3 relevant conversations

       └─ Personalization (style/topics/engagement)

## Data Flow    → LLM (Claude 3.5 Sonnet)

    → PersonaValidator (middleware/persona-validator.ts)

```text    → Unity via WebSocket:3001 (not tested)

User → MCP Server (3000)    → Response

    → SafetyFilter (middleware/safety.ts)    → Memory storage (async embeddings, fire-and-forget)

    → Persona enforcement (bambi-core-persona.yaml)```

    → RAG Context (services/rag.ts)

       ├─ Query embedding (Xenova/all-MiniLM-L6-v2)**Claude 3.5 Sonnet rationale:** Best "intimate yet ethical" boundary adherence (⭐⭐⭐⭐⭐), superior prompt understanding, $3,630/month for 10K users (see `docs/architecture-decision-record.md`).

       ├─ Vector similarity (cosine, threshold 0.65)

       ├─ Top 3 relevant conversations## Critical Code Patterns

       └─ Personalization (style/topics/engagement)

    → LLM (Claude 3.5 Sonnet)### Fire-and-Forget Embeddings (memory.ts)

    → PersonaValidator (middleware/persona-validator.ts)```typescript

    → Unity via WebSocket:3001 (not tested)// DON'T block user responses while generating embeddings (100-300ms)

    → Responseasync storeMessage(...): Promise<ConversationMessage> {

    → Memory storage (async embeddings, fire-and-forget)  const messageId = uuidv4();

```  this.db.prepare('INSERT INTO messages ...').run(...);



**Claude 3.5 Sonnet rationale:** Best "intimate yet ethical" boundary adherence (⭐⭐⭐⭐⭐), superior prompt understanding, $3,630/month for 10K users (see `docs/architecture-decision-record.md`).  // Async WITHOUT await — catches errors internally

  this.generateAndStoreEmbedding(messageId, content).catch((error: unknown) => {

## Critical Code Patterns    logger.error('Failed to generate embedding:', error);

  });

### Fire-and-Forget Embeddings (memory.ts)

  return { id: messageId, ... }; // Returns immediately

```typescript}

// DON'T block user responses while generating embeddings (100-300ms)```

async storeMessage(...): Promise<ConversationMessage> {

  const messageId = uuidv4();### Safety Middleware (safety.ts)

  this.db.prepare('INSERT INTO messages ...').run(...);```typescript

  export class SafetyFilter {

  // Async WITHOUT await — catches errors internally  private bannedPatterns = [

  this.generateAndStoreEmbedding(messageId, content).catch((error: unknown) => {    { pattern: /\b(you must|obey|i command you)\b/i, type: ViolationType.COERCION },

    logger.error('Failed to generate embedding:', error);    { pattern: /\b(i'?m|i am) (\d{1,2}|under 18)\b/i, type: ViolationType.MINOR_PROTECTION },

  });    // ... 20+ patterns

    ];

  return { id: messageId, ... }; // Returns immediately

}  async validate(message: string, history: Message[]): Promise<SafetyResult> {

```    // Fast path: Check patterns → sentiment → context

    // Return { safe, violation?, redirectResponse? }

### Safety Middleware (safety.ts)  }

}

```typescript```

export class SafetyFilter {

  private bannedPatterns = [### RAG Semantic Search (rag.ts + chat.ts)

    { pattern: /\b(you must|obey|i command you)\b/i, type: ViolationType.COERCION },```typescript

    { pattern: /\b(i'?m|i am) (\d{1,2}|under 18)\b/i, type: ViolationType.MINOR_PROTECTION },// Retrieve context before LLM call

    // ... 20+ patternsconst relevantMemories = await ragService.getRelevantContext(message, userId, sessionId, {

  ];  maxMessages: 3,

    minSimilarity: 0.65,

  async validate(message: string, history: Message[]): Promise<SafetyResult> {  includeCurrentSession: false // Avoid duplication

    // Fast path: Check patterns → sentiment → context});

    // Return { safe, violation?, redirectResponse? }

  }// Vector similarity search

}async semanticSearch(query: string, options: SearchOptions): Promise<SearchResult[]> {

```  const queryEmbedding = await embeddingsService.generateEmbedding(query);



### RAG Semantic Search (rag.ts + chat.ts)  // Fetch messages with embeddings from SQLite

  const rows = this.db.prepare('SELECT m.*, e.embedding FROM messages m JOIN embeddings e...').all(userId);

```typescript

// Retrieve context before LLM call  // Calculate cosine similarity, filter by threshold, sort by relevance

const relevantMemories = await ragService.getRelevantContext(message, userId, sessionId, {  for (const row of rows) {

  maxMessages: 3,    const similarity = EmbeddingsService.cosineSimilarity(queryEmbedding, deserialize(row.embedding));

  minSimilarity: 0.65,    if (similarity >= minSimilarity) results.push({ message: row, similarity, rank: 0 });

  includeCurrentSession: false // Avoid duplication  }

});

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, topK);

// Vector similarity search}

async semanticSearch(query: string, options: SearchOptions): Promise<SearchResult[]> {```

  const queryEmbedding = await embeddingsService.generateEmbedding(query);

  ### CAG Context Assembly (cag.ts)

  // Fetch messages with embeddings from SQLite```typescript

  const rows = this.db.prepare('SELECT m.*, e.embedding FROM messages m JOIN embeddings e...').all(userId);// Balance token budgets: current session (50%) + RAG (30%) + profile (20%)

  async assembleContext(message, userId, sessionId, options): Promise<CAGContext> {

  // Calculate cosine similarity, filter by threshold, sort by relevance  const currentMessages = this.getCurrentSessionMessages(sessionId, maxTokens * 0.5);

  for (const row of rows) {  const retrievedContext = await this.ragService.semanticSearch(message, {

    const similarity = EmbeddingsService.cosineSimilarity(queryEmbedding, deserialize(row.embedding));    userId, topK: 5, minSimilarity: 0.6, sessionId: null, // Cross-session

    if (similarity >= minSimilarity) results.push({ message: row, similarity, rank: 0 });    excludeMessageIds: currentMessages.map(m => parseInt(m.id)).filter(id => id > 0)

  }  });

    const userProfile = includeUserProfile ? this.getUserProfile(userId) : undefined;

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, topK);  const temporalContext = includeTemporalContext ? this.getTemporalContext(sessionId) : undefined;

}

```  return { currentMessages, retrievedContext, userProfile, temporalContext, metadata: {...} };

}

### CAG Context Assembly (cag.ts)```



```typescript### Integrated Chat Pipeline (integrated-chat.ts)

// Balance token budgets: current session (50%) + RAG (30%) + profile (20%)```typescript

async assembleContext(message, userId, sessionId, options): Promise<CAGContext> {// Safety → Personalization → RAG → LLM → Validation (<200ms total)

  const currentMessages = this.getCurrentSessionMessages(sessionId, maxTokens * 0.5);async chat(userMessage: string, config: ChatConfig): Promise<ChatResponse> {

  const retrievedContext = await this.ragService.semanticSearch(message, {  if (enablePersonalization) this.personalization.learn(userId, userMessage); // Async

    userId, topK: 5, minSimilarity: 0.6, sessionId: null, // Cross-session  const relevantContext = await this.contextRetrieval.getRelevantContext(userMessage, history, { topK: contextWindow });

    excludeMessageIds: currentMessages.map(m => parseInt(m.id)).filter(id => id > 0)  const baseResponse = await this.generateResponse(userMessage, relevantContext.messages);

  });  const personalizedResponse = this.personalization.adapt(userId, baseResponse);

  const userProfile = includeUserProfile ? this.getUserProfile(userId) : undefined;  await this.storeConversation(userId, userMessage, personalizedResponse); // Fire-and-forget embeddings

  const temporalContext = includeTemporalContext ? this.getTemporalContext(sessionId) : undefined;  return { content: personalizedResponse, confidence, context, metadata };

  }

  return { currentMessages, retrievedContext, userProfile, temporalContext, metadata: {...} };```

}

```### MCP Tool Registration (server.ts)

```typescript

### Integrated Chat Pipeline (integrated-chat.ts)server.setRequestHandler(CallToolRequestSchema, async (request) => {

  const tool = allTools.find(t => t.name === request.params.name);

```typescript

// Safety → Personalization → RAG → LLM → Validation (<200ms total)  // Safety filtering BEFORE execution

async chat(userMessage: string, config: ChatConfig): Promise<ChatResponse> {  if (tool.name === 'chat_send_message') {

  if (enablePersonalization) this.personalization.learn(userId, userMessage); // Async    const safetyResult = await safetyFilter.validate(args.message);

  const relevantContext = await this.contextRetrieval.getRelevantContext(userMessage, history, { topK: contextWindow });    if (!safetyResult.safe) {

  const baseResponse = await this.generateResponse(userMessage, relevantContext.messages);      return { content: [{ type: 'text', text: safetyResult.redirectResponse }] };

  const personalizedResponse = this.personalization.adapt(userId, baseResponse);    }

  await this.storeConversation(userId, userMessage, personalizedResponse); // Fire-and-forget embeddings  }

  return { content: personalizedResponse, confidence, context, metadata };

}  return await tool.execute(args);

```});

````

### MCP Tool Registration (server.ts)

## Common Pitfalls

````typescript

server.setRequestHandler(CallToolRequestSchema, async (request) => {| ❌ Don't | ✅ Do |

  const tool = allTools.find(t => t.name === request.params.name);|---------|-------|

  | Add chat features before safety validation | Extend `SafetyFilter` first, validate with tests |

  // Safety filtering BEFORE execution| Invent new Unity class hierarchies | Follow UNITY_SETUP_GUIDE.md structure exactly |

  if (tool.name === 'chat_send_message') {| Generic safety error messages | Persona-appropriate redirects: "I can't go there with you, babe. 🌸" |

    const safetyResult = await safetyFilter.validate(args.message);| Modify server without tests | Run `npm run validate` before committing |

    if (!safetyResult.safe) {| Block responses generating embeddings | Fire-and-forget async pattern (memory.ts) |

      return { content: [{ type: 'text', text: safetyResult.redirectResponse }] };| Hardcode similarity thresholds | Use configurable (0.65 cross-session, 0.5 exploratory) |

    }

  }## Project Status



  return await tool.execute(args);**Phases 1-6 Complete ✅:**

});- Phase 3: Safety (54 tests, 20+ violation patterns, PersonaValidator, Claude integration)

```- Phase 4: Memory/RAG (18 tests, embeddings, semantic search, personalization, summarization)

- Phase 5: Privacy (26 tests, GDPR consent/export/deletion/audit)

## Common Pitfalls- Phase 6: Testing (152/162 tests, 0 lint errors, type safety, flaky test fixed)



| ❌ Don't | ✅ Do |**Phase 7 (Next) ⏸️:** Voice (Whisper STT, ElevenLabs TTS), Unity WebSocket testing, Vision (GPT-4V, DALL-E), multi-modal flows

|---------|-------|

| Add chat features before safety validation | Extend `SafetyFilter` first, validate with tests |**Future:** Unity 6.2 install (specs in UNITY_SETUP_GUIDE.md), Dockerfile, GitHub Actions CI/CD

| Invent new Unity class hierarchies | Follow UNITY_SETUP_GUIDE.md structure exactly |

| Generic safety error messages | Persona-appropriate redirects: "I can't go there with you, babe. 🌸" |**See:** `docs/phases/PHASES.md` for consolidated phase reports

| Modify server without tests | Run `npm run validate` before committing |

| Block responses generating embeddings | Fire-and-forget async pattern (memory.ts) |## Working with Personas

| Hardcode similarity thresholds | Use configurable (0.65 cross-session, 0.5 exploratory) |

Reference `personas/bambi-core-persona.yaml`:

## Project Status```yaml

allowed_intimacy:

**Phases 1-6 Complete ✅:**  - Flirty compliments: "Hey there, cutie~"

  - Emotional support: "I've got you, babe"

- Phase 3: Safety (54 tests, 20+ violation patterns, PersonaValidator, Claude integration)  - Playful teasing: "Ooh, someone's being naughty~"

- Phase 4: Memory/RAG (18 tests, embeddings, semantic search, personalization, summarization)

- Phase 5: Privacy (26 tests, GDPR consent/export/deletion/audit)prohibited_content:

- Phase 6: Testing (152/162 tests, 0 lint errors, type safety, flaky test fixed)  - Explicit sexual content

  - Coercive language

**Phase 7 (Next) ⏸️:** Voice (Whisper STT, ElevenLabs TTS), Unity WebSocket testing, Vision (GPT-4V, DALL-E), multi-modal flows  - Age roleplay

  - Medical/legal advice

**Future:** Unity 6.2 install (specs in UNITY_SETUP_GUIDE.md), Dockerfile, GitHub Actions CI/CD```



**See:** `docs/phases/PHASES.md` for consolidated phase reports**Pattern:** Safety violations (middleware/safety.ts) must align with persona boundaries (YAML spec).



## Working with Personas## Trademark & Environment



Reference `personas/bambi-core-persona.yaml`:**Trademark:** Always use **BambiSleep™** (with ™) in public content — legal requirement.



```yaml**8 MCP Servers:** filesystem, git, github, memory, sequential-thinking, everything (npx), brave-search, postgres (uvx) — Config in `.vscode/settings.json` (see MCP_SETUP_GUIDE.md)

allowed_intimacy:

  - Flirty compliments: "Hey there, cutie~"**Quality Standards:** 100% test coverage goal, enterprise error handling, Node.js 20+ LTS, Volta pinning (`volta pin node@20-lts`)

  - Emotional support: "I've got you, babe"

  - Playful teasing: "Ooh, someone's being naughty~"**Build validation:** `npm run validate` (typecheck + lint + test) must pass before merge.


prohibited_content:
  - Explicit sexual content
  - Coercive language
  - Age roleplay
  - Medical/legal advice
````

**Pattern:** Safety violations (middleware/safety.ts) must align with persona boundaries (YAML spec).

## Trademark & Environment

**Trademark:** Always use **BambiSleep™** (with ™) in public content — legal requirement.

**8 MCP Servers:** filesystem, git, github, memory, sequential-thinking, everything (npx), brave-search, postgres (uvx) — Config in `.vscode/settings.json` (see MCP_SETUP_GUIDE.md)

**Quality Standards:** 100% test coverage goal, enterprise error handling, Node.js 20+ LTS, Volta pinning (`volta pin node@20-lts`)

**Build validation:** `npm run validate` (typecheck + lint + test) must pass before merge.
