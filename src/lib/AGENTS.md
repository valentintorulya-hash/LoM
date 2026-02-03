# LIBRARY KNOWLEDGE BASE

## OVERVIEW
Pure game logic, data definitions, and utilities.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Core types | src/lib/gameTypes.ts | Item, rarity, stats shapes |
| Item tables | src/lib/items.ts | Base item data |
| Enemy scaling | src/lib/enemyLogic.ts | Combat scaling rules |
| Big numbers | src/lib/decimal.ts | break_infinity.js wrapper |
| Formatting | src/lib/formatters.ts | Display helpers |
| Constants | src/lib/constants.ts | Game tuning values |
| Helpers | src/lib/utils.ts | Shared small utilities |

## CONVENTIONS
- Keep logic side-effect free; return derived values for stores to use.
- Use Decimal from src/lib/decimal.ts for large-number math.

## ANTI-PATTERNS
- Do not import UI components here.
- Avoid mutating shared objects; prefer pure functions.
