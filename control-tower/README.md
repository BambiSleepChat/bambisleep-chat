# 🗼 Control Tower - Project Management System

**Real-time monitoring and control for bambisleep-chat development**

## 🎯 Overview

The Control Tower provides a centralized dashboard for monitoring project health, tracking phase progress, and managing deployments.

## 📊 Features

- **Real-time Dashboard** - Live project status updates
- **Phase Tracking** - Visual progress for all 10 phases
- **Test Monitoring** - Continuous test coverage tracking
- **Health Checks** - Build, test, deployment status
- **Metrics Collection** - Lines of code, commits, issues
- **Deployment Status** - Environment and version tracking

## 🚀 Quick Start

```bash
# Single snapshot
node control-tower/dashboard.js

# Live dashboard (updates every 30s)
node control-tower/dashboard.js --watch
```

## 📁 Directory Structure

```
control-tower/
├── dashboard.js          # Main dashboard application
├── logs/                 # System logs
├── reports/              # Status reports (JSON)
├── cache/                # Cached data
└── README.md             # This file
```

## 📊 Dashboard Sections

### 1. Project Status
- Project name and version
- Last update timestamp
- Current branch

### 2. Health Status
- ✅ Build: TypeScript compilation
- ✅ Tests: Test suite results
- ✅ Deployment: Infrastructure status
- ✅ Dependencies: npm packages

### 3. Test Status
- Total tests: 162
- Passing: 153 (100%)
- Failing: 0
- Skipped: 9 (Unity integration)
- Coverage: 100%

### 4. Phase Progress
Visual progress bars for all 10 phases:
- Phase 1-6: ✅ Complete (60%)
- Phase 7-10: 📋 Planned (40%)

### 5. Project Metrics
- Lines of code
- File count
- Commit history
- Open issues/PRs

### 6. Deployment Status
- Current environment
- Deployment status
- Version number
- URL (when deployed)

### 7. Quick Actions
Common commands for development:
- `npm test` - Run test suite
- `npm run build` - Build project
- `fly deploy` - Deploy to staging

## 🔧 Configuration

The dashboard automatically detects:
- Git repository information
- Test results from npm test
- Build status from TypeScript
- File system metrics

## 📝 Logs

Logs are stored in `control-tower/logs/tower.log`:

```
[2025-11-08T20:50:00.000Z] Control Tower initialized
[2025-11-08T20:50:30.000Z] Status updated
```

## 📊 Reports

Status snapshots are saved to `control-tower/reports/`:

```json
{
  "timestamp": "2025-11-08T20:50:00.000Z",
  "phases": [...],
  "tests": {...},
  "deployment": {...},
  "health": {...},
  "metrics": {...}
}
```

## 🎨 Dashboard Preview

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🗼 CONTROL TOWER - PROJECT DASHBOARD 🗼           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📊 PROJECT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: bambisleep-chat MCP Avatar System
Version: 2.1.0-0bfc3ca
Updated: 11/8/2025, 8:50:00 PM

🏥 HEALTH STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build:          ✅ OK
Tests:          ✅ OK
Deployment:     ✅ OK
Dependencies:   ✅ OK

🧪 TEST STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tests:     162
✅ Passing:      153
❌ Failing:      0
⏸️  Skipped:      9
📊 Coverage:     100%

📋 PHASE PROGRESS (6/10 Complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1: ✅ Core Model & Architecture
         ████████████████████ 100% | Tests: 24
Phase 2: ✅ Persona & Conversation
         ████████████████████ 100% | Tests: 54
...

⚡ Overall Progress: 60% (6/10 phases)
```

## 🤖 Integration

The Control Tower can be integrated with:

### CI/CD Pipelines
```yaml
# .github/workflows/status.yml
- name: Generate Status Report
  run: node control-tower/dashboard.js
```

### Monitoring Systems
- Export reports to monitoring dashboards
- Alert on test failures or build errors
- Track metrics over time

### Deployment Tools
- Check deployment readiness
- Verify all health checks pass
- Generate deployment reports

## 🔮 Future Enhancements

Planned features for Control Tower:

- [ ] Web-based dashboard
- [ ] Real-time WebSocket updates
- [ ] Email/Slack notifications
- [ ] Historical trend analysis
- [ ] Custom alerts and thresholds
- [ ] Integration with GitHub Actions
- [ ] Performance benchmarking
- [ ] Cost tracking
- [ ] Team collaboration features

## 📞 Support

For issues or questions:
1. Check logs in `control-tower/logs/`
2. Review reports in `control-tower/reports/`
3. Verify all dependencies installed
4. Ensure git repository is initialized

## 🎉 Example Usage

### Monitor Development
```bash
# Watch mode for active development
node control-tower/dashboard.js --watch

# Let it run in the background while you work
# Dashboard updates every 30 seconds automatically
```

### CI/CD Integration
```bash
# Generate snapshot for CI
node control-tower/dashboard.js > build-status.txt

# Check exit code for automation
if node control-tower/dashboard.js; then
  echo "All systems go!"
else
  echo "Issues detected"
fi
```

### Generate Reports
```bash
# Run dashboard to save report
node control-tower/dashboard.js

# Find latest report
ls -lt control-tower/reports/ | head -1

# View report
cat control-tower/reports/status-*.json | jq .
```

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-08  
**Maintained by:** BambiSleepChurch
