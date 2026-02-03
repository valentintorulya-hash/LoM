# COMPONENTS KNOWLEDGE BASE

## OVERVIEW
React components for layout, gameplay screens, and reusable UI primitives.

## STRUCTURE
components/
├── game/
│   ├── Lamp/
│   ├── Gacha/
│   └── Combat/
├── layout/
└── ui/

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Main layout shell | src/components/layout/MainLayout.tsx | Top-level view composition |
| Navigation + header | src/components/layout/TopBar.tsx, src/components/layout/BottomNav.tsx | Global UI chrome |
| Lamp flow | src/components/game/Lamp/ | Lamp interaction UI |
| Gacha flow | src/components/game/Gacha/ | Drop rates + summon modal |
| Combat UI | src/components/layout/CombatView.tsx | Visual combat panel |
| UI primitives | src/components/ui/ | Toasts, tooltip, effects |
| Debug panel | src/components/DevDashboard.tsx | Temporary testing UI |

## CONVENTIONS
- Keep heavy logic in stores or controller hooks (e.g., useLampController.ts).
- Reuse primitives from src/components/ui before creating new ones.

## ANTI-PATTERNS
- Avoid duplicating calculations from src/lib or state from src/store.
- Do not embed long-running loops or timers in UI components; use hooks.
