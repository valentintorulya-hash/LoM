# PROJECT KNOWLEDGE BASE

Generated: 2026-02-02
Commit: n/a
Branch: n/a

## OVERVIEW
Browser-based idle/gacha RPG built with React 19, Vite, TypeScript, Zustand, Tailwind v4, and break_infinity.js for large numbers.

## STRUCTURE
MyHeroIdleRPG/
├── src/
│   ├── components/        # UI: layout, game views, UI primitives
│   ├── lib/               # game logic, types, utilities
│   ├── store/             # Zustand state slices
│   ├── hooks/             # shared app-level hooks
│   ├── App.tsx            # ErrorBoundary + MainLayout
│   └── main.tsx           # React entry
├── public/
├── rules/                 # MCP usage rules
└── dist/                  # build output

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| App entry | src/main.tsx | React root + CSS import |
| Global layout | src/components/layout/MainLayout.tsx | Main screen composition |
| Game views | src/components/game/ | Lamp, gacha, combat UI |
| Game logic | src/lib/ | Types, loot, enemy logic |
| State | src/store/ | Zustand slices |
| UI primitives | src/components/ui/ | Toasts, tooltip, effects |
| Temp debug UI | src/components/DevDashboard.tsx | Not wired in App |

## CONVENTIONS
- Imports grouped: external, internal, relative; prefer type-only imports.
- 2-space indent, single quotes; keep Tailwind class lists readable.
- Prefer interfaces for public shapes; type aliases for unions/mapped types.
- Exported functions should have explicit return types.

## ANTI-PATTERNS (THIS PROJECT)
- Do not swallow errors; rethrow with context.
- Do not log secrets or API keys.
- Do not commit secrets; use env vars.

## UNIQUE STYLES
- Simplified Feature-Sliced structure.
- Big numbers via src/lib/decimal.ts (break_infinity.js wrapper).

## COMMANDS
```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## NOTES
- MCP tool choice must follow rules/rule1.md (see .cursorrules).
- Known issue: app may show white screen on start (see README).
- LSP not configured in this environment; code map not generated.
