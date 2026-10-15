<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Skills

Use every skill in this catalog as relevant to the task — match the task to the skill instead of defaulting to a fixed subset.

Skills are installed locally across `.agents/skills/`, `.opencode/skills/`, `.claude/skills/`, and the global `~/.claude/skills/`; these tooling directories are not committed (restore with the ECC installer or `find-skills`).

### Design & Frontend
- **frontend-design** — distinctive, intentional UI and visual direction.
- **web-design-guidelines** — review UI against Web Interface Guidelines and accessibility.
- **frontend-patterns** — React/Next.js patterns, state, performance, UI best practices.
- **frontend-slides** — animation-rich HTML presentations (or from PPT/PPTX).
- **tailwind-design-system** — scalable Tailwind v4 design systems, tokens, component libraries.
- **tailwind-4-docs** — Tailwind CSS v4 docs snapshot and workflow guidance.

### Planning & Decisions
- **grill-me** — relentless interview to sharpen a plan or design.
- **grill-with-docs** — grill-me that also writes ADRs and a glossary as you go.
- **improve-codebase-architecture** — find deepening opportunities, report visually, then grill the chosen one.
- **intent-driven-development** — turn ambiguous/high-impact changes into scoped, testable acceptance criteria.
- **product-lens** — validate the "why" before building; pressure-test product direction.
- **product-capability** — turn PRD/roadmap into an implementation-ready capability plan.
- **council** — four-voice deliberation for ambiguous decisions and go/no-go calls.
- **council-multi-model** — optional external Codex critique after a council draft.
- **dev-team** — simulate PM/Architect/Developer/QA on one problem.
- **plan-canvas** — open plans/HTML artifacts in a local browser canvas for review and annotation.
- **loop-design-check** — design an agent loop and review it for runaway/failure modes.
- **change-impact** — evidence-backed impact analysis before a change; compare planned vs actual.
- **context-and-decisions** — govern domain context via CONTEXT.md; route decisions to ADRs.

### Testing & Quality
- **tdd-workflow** — tests-first development with 80%+ coverage.
- **e2e-testing** — Playwright E2E patterns, POM, CI, flaky-test handling.
- **windows-desktop-e2e** — E2E for Windows native apps via pywinauto/UI Automation.
- **ai-regression-testing** — sandbox regression testing for AI-assisted code.
- **browser-qa** — automated visual/UI verification after deploys.
- **click-path-audit** — trace every user touchpoint through its state sequence for cancel-out bugs.
- **verification-loop** — comprehensive pre-completion verification of session work.
- **eval-harness** — formal eval-driven-development evaluations.
- **error-handling** — typed errors, retries, circuit breakers, user-facing failures (TS/Py/Go).
- **santa-method** — two independent adversarial reviewers must pass before shipping.
- **delivery-gate** — stop hook blocking completion until quality checks pass.
- **test-collaboration** — inventory and govern project test assets; TEST-IDs and gap analysis.
- **module-regression** — REGRESSION.md ledger for cross-module regression in large repos.

### Code, Docs & Architecture
- **architecture-decision-records** — capture architectural decisions as structured ADRs.
- **code-tour** — persona-targeted CodeTour `.tour` walkthroughs with real anchors.
- **codebase-onboarding** — generate an onboarding guide for an unfamiliar codebase.
- **inherit-legacy-style** — align an agent to a hand-written legacy project's style.
- **living-docs-governance** — keep long-lived project docs from drifting.
- **docs-governance** — route doc-governance requests; opt-in read-only docs audit.
- **documentation-lookup** — up-to-date library/framework docs via Context7.
- **git-workflow** — branching, commit conventions, merge vs rebase, conflict resolution.
- **coding-standards** — baseline naming, readability, immutability, code-quality conventions.
- **codehealth-mcp** — CodeScene structural code health; review before edits, gate commits/PRs.
- **production-audit** — local-evidence production readiness audit.
- **rules-distill** — distill recurring cross-cutting principles into rule files.
- **iterative-retrieval** — progressively refine context retrieval for subagents.

### Backend, API & Frameworks
- **api-design** — REST API design: naming, status codes, pagination, filtering, versioning.
- **backend-patterns** — Node/Express/Next.js backend architecture and data access.
- **security-review** — auth, user input, secrets, API endpoints, payments review.
- **bun-runtime** — Bun runtime/PM/bundler/test runner; Bun vs Node; Vercel support.
- **mcp-server-patterns** — build MCP servers with the Node/TS SDK.
- **mcp-dependency-review** — static review of MCP config for mutable package refs.
- **nextjs-turbopack** — Next.js 16+ and Turbopack bundling/caching.
- **astro** — build with the Astro web framework.
- **mle-workflow** — production ML workflow: data contracts, training, deploy, monitoring.

### Content, Brand & Research
- **article-writing** — long-form articles/guides/blogs in a distinctive voice.
- **brand-discovery** — structured multi-session brand identity discovery.
- **brand-voice** — build a source-derived writing-style profile; reuse across content.
- **content-engine** — platform-native content systems (X, LinkedIn, TikTok, YouTube, newsletters).
- **crosspost** — multi-platform distribution (X, LinkedIn, Threads, Bluesky).
- **deep-research** — multi-source cited research via firecrawl/exa MCPs.
- **exa-search** — neural web/code/company/person search via Exa MCP.
- **market-research** — market/competitive analysis and due diligence with sources.
- **competitive-platform-analysis** — scope, categorise, and filter a competitor set.
- **benchmark-methodology** — score competitors across nine weighted dimensions.
- **competitive-report-structure** — assemble findings into a decision-grade report.
- **investor-materials** — decks, one-pagers, memos, models, fundraising materials.
- **investor-outreach** — cold emails, intro blurbs, follow-ups, investor comms.
- **x-api** — X/Twitter API integration: posting, timelines, search, analytics.

### Media & Integrations
- **fal-ai-media** — image/video/audio generation via fal.ai MCP.
- **video-editing** — AI-assisted video editing pipeline (FFmpeg/Remotion/ElevenLabs).
- **composio** — route Composio work across Gmail, Slack, GitHub, Notion, etc.

### Memory & Context
- **ck** — persistent per-project memory; auto-loads context on session start.
- **unified-memory** — share durable context/handoffs across agents via the ECC Memory Vault.
- **strategic-compact** — suggest manual compaction at logical task boundaries.
- **dmux-workflows** — multi-agent orchestration with dmux/tmux panes.

### Agent & ECC Tooling
- **agent-introspection-debugging** — structured self-debugging of agent run failures.
- **agent-self-evaluation** — 5-axis 1–5 scorecard after non-trivial tasks.
- **agent-sort** — build a DAILY vs LIBRARY ECC install plan for a repo.
- **config-gc** — garbage-collect stale/redundant agent config.
- **configure-ecc** — guide ECC install/update/reconfigure per harness.
- **context-budget** — audit context-window consumption and find token savings.
- **continuous-learning** — DEPRECATED; use continuous-learning-v2.
- **continuous-learning-v2** — instinct-based, project-scoped learning from sessions.
- **ecc-conventions** — development conventions for the ECC repo itself.
- **ecc-guide** — walk through ECC agents, skills, commands, hooks, profiles.
- **ecc-recipes** — map a workflow to the right ECC command group with run order.
- **find-skills** — discover and install skills for a capability need.
- **growth-log** — write reusable-pattern growth logs after complex tasks/failures.
- **hookify-rules** — create/configure hookify hook rules.
- **plankton-code-quality** — write-time formatting/linting/auto-fix on every edit.
- **repo-scan** — bootstrap install of the external repo-scan source audit.
- **skill-comply** — measure whether skills/rules/agents are actually followed.
- **skill-host-compat** — lint skills for Codex/Cursor-safe frontmatter.
- **skill-scout** — search local/marketplace/GitHub/web before creating a skill.
- **skill-stocktake** — audit skills/commands for quality (quick or full).

### Harness Built-ins
- **opencode** — questions about OpenCode itself (config, SDK, plugins, CLI, TUI, API).
- **report** — file an OpenCode issue/bug with diagnostics via GitHub CLI.
