## Quick orientation for AI coding agents

This repo is a **documentation-first architecture specification** for the BambiSleep™ CatGirl Unity avatar system with MCP tooling integration. Unlike typical code repositories, the "source of truth" lives in comprehensive markdown specifications that define everything from Unity C# class structure to container orchestration patterns.

## 3-Step Work Methodology

**ANALYZE** #codebase — Read the existing files to understand current structure and patterns. **Critical**: This is a spec-driven project - the markdown files ARE the implementation blueprint.
**THINK** — Design simple working solution. Don't overcomplicate. Edit existing files rather than creating new ones when possible. IT MUST WORK, NOT BE PERFECT! Keep it simple, less is better. Perfect doesn't exist, just make it work.
**TEST & FIX BUGS** — Run code, verify it works, fix any issues found

## Architecture: Dual Technology Stack

This project has **two distinct but integrated technology stacks**:
1. **Unity 6.2 Gaming Engine**: C# avatar system, economy, networking (files under `Assets/Scripts/`)
2. **MCP Agent Tooling**: Node.js-based Model Context Protocol servers for development automation

Key documentation files (read in order):
- `CATGIRL.md` — **Master architecture specification**: 683 lines defining Unity avatar systems, RPG mechanics, monetization via Unity Gaming Services, and complete technical implementation details
- `UNITY_SETUP_GUIDE.md` — **Concrete implementation guide**: Unity project structure, specific C# class examples (CatgirlController, InventorySystem, UniversalBankingSystem), package dependencies, and build configurations
- `MCP_SETUP_GUIDE.md` — **Development tooling setup**: 8 essential MCP servers, VS Code configuration, exact `npx`/`uvx` commands
- `RELIGULOUS_MANTRA.md` — **Development philosophy & conventions**: Contains the "Sacred Laws" with emoji-coded CI/CD patterns, build command specifications, and the unique cultural context
- `CONTAINER_ORGANIZATION.md` — **Deployment standards**: GHCR registry patterns, trademark compliance, container labeling
- `build.md` + `todo.md` — **Current implementation status**: What works vs what needs to be built

## Critical Project Characteristics

**Documentation-as-Code**: The markdown files contain complete C# class implementations, Unity package configurations, and deployment scripts. Don't invent - extract from these specifications.

**Trademark Requirements**: All public-facing content must use `BambiSleep™` (with trademark symbol). This is not optional - it's a legal compliance requirement.

**Unique Development Culture**: This project follows "Universal Machine Philosophy" with emoji-coded development patterns (🌸 = package management, 👑 = architecture decisions, 💎 = quality metrics). Use these conventions when mirroring existing documentation only.

## Essential Development Workflows

**MCP Development Environment**: 8 servers providing filesystem, git, GitHub, memory, sequential-thinking, everything, brave-search, postgres via `npx`/`uvx`. Full VS Code config in `MCP_SETUP_GUIDE.md`.

**Unity Project Creation**:
```bash
# From UNITY_SETUP_GUIDE.md - exact structure required
mkdir -p catgirl-avatar-project/{Assets,ProjectSettings,Packages}
# ProjectSettings/ProjectVersion.txt: Unity 6000.2.11f1
# Packages/manifest.json: 15+ Unity Gaming Services dependencies
```

**Build Commands** (from RELIGULOUS_MANTRA.md):
```bash
npm test -- --coverage=100        # 100% test coverage requirement
npm run build -- --universal     # Cross-platform build
npm run deploy -- --aigf-mode    # AI girlfriend deployment mode
volta pin node@20-lts            # Version management
```

**Container Deployment**:
- Registry: `ghcr.io/bambisleepchat/bambisleep-church`
- Tags: `v{major}.{minor}.{patch}`, `dev-{branch}`, `latest`
- Required labels include BambiSleep™ trademark attribution

## Code Architecture Patterns

**Unity C# Structure** (complete implementations in UNITY_SETUP_GUIDE.md):
```
Assets/Scripts/
├── Character/CatgirlController.cs     # 150+ line NetworkBehaviour implementation
├── Economy/InventorySystem.cs         # Unity Gaming Services integration
├── Economy/UniversalBankingSystem.cs  # Gambling + auction systems
├── UI/InventoryUI.cs                  # UI Toolkit with pink theming
└── Networking/CatgirlNetworkManager.cs # Netcode for GameObjects
```

**Key Technical Integrations**:
- Unity Gaming Services (Economy, Authentication, Analytics, Lobby)
- Netcode for GameObjects multiplayer
- XR Interaction Toolkit (eye/hand tracking)
- UI Toolkit (modern runtime UI)
- Addressables (asset streaming)

**Monetization Architecture**: Unity IAP + Gaming Services Economy with ethical guidelines (no pay-to-win, transparent drop rates, COPPA compliance)

## Current Implementation Status

**What Exists**: Complete architectural specifications (683-line CATGIRL.md, 859-line UNITY_SETUP_GUIDE.md), VS Code MCP configuration, container organization standards, and philosophical framework.

**What's Missing** (per `todo.md`): 
- `package.json` with Node.js 20+ dependencies
- Unity 6.2 LTS installation verification  
- MCP server connectivity testing
- Dockerfile with proper GHCR labels
- GitHub Actions CI/CD pipeline

## Safe Development Practices

**Unity Code Changes**:
- Follow exact class structure from UNITY_SETUP_GUIDE.md (CatgirlController, InventorySystem, etc.)
- Update `Packages/manifest.json` when adding Unity packages
- Maintain Assets/Scripts folder hierarchy: `{Character,Inventory,Economy,Networking,UI}`

**MCP Configuration Changes**:
- Use exact `mcp.servers` JSON from MCP_SETUP_GUIDE.md
- Prefer `npx -y @modelcontextprotocol/server-*` pattern for official servers
- Use `uvx` for Python-based servers (brave-search, postgres)

**Container Updates**:
- Include all required labels from CONTAINER_ORGANIZATION.md
- Maintain `ghcr.io/bambisleepchat/bambisleep-church` registry
- Follow semantic versioning: `v{major}.{minor}.{patch}`

## Trademark & Cultural Compliance

**Required**: Use `BambiSleep™` (with ™ symbol) in all public-facing content
**Philosophy**: "Universal Machine Philosophy" with 8/8 MCP operational status
**Quality Standards**: 100% test coverage, enterprise-grade error handling, cross-platform compatibility

## Quick Implementation Examples

**Add Unity Feature**: Extend existing classes in UNITY_SETUP_GUIDE.md rather than creating new files
**Add MCP Server**: Copy mcp.servers block and add new entry with npx/uvx pattern  
**Update Container**: Modify labels in CONTAINER_ORGANIZATION.md and rebuild with proper tagging

*This is a specification-driven project - the documentation IS the implementation plan.*
