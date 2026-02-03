# STORE KNOWLEDGE BASE

## OVERVIEW
Zustand slices for game state, inventory, combat, and UI.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Core resources + lamp | src/store/gameStore.ts | Lamps, gold, lamp level |
| Inventory + equipment | src/store/inventoryStore.ts | Gear, drops, stats |
| Combat state | src/store/combatStore.ts | Enemy/player combat state |
| Pets | src/store/petStore.ts | Companion data |
| Skills | src/store/skillStore.ts | Active skills state |
| Toasts | src/store/toastStore.ts | Notifications |
| UI state | src/store/uiStore.ts | UI toggles and tabs |

## CONVENTIONS
- Keep store state normalized and derived values in selectors/helpers.
- Share shapes with src/lib/gameTypes.ts for consistency.

## ANTI-PATTERNS
- Avoid storing UI-only transient state here unless shared across screens.
- Do not import components into stores.
