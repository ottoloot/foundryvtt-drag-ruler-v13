# Drag Ruler

This is a **Foundry VTT v13** port of the amazing *Drag Ruler* module. Please give props where props is due to the original developer.

I am using word-salad-slop factory AI tools to keep this working with version 13+ of FoundryVTT. 

Instead of replacing Foundry's ruler or token dragging workflow, this version keeps **Foundry v13's native Token Drag Measurement** and only changes the **visual styling** (segment colors / grid highlights) so you get Drag-Ruler-style color bands:

- **Walk** (ring 1)
- **Dash / 2nd action ring** (ring 2, optional)
- **Unreachable**

## Compatibility
- Designed for **Foundry VTT v13** (tested against build **13.351**).
- No legaccy support, only Version 13+.

## Settings
Configure Settings → Module Settings → **Drag Ruler (v13 Overlay)**

- **Speed attribute path** (default: `system.attributes.speed.total`)
  - PF2e-ready default.
  - If your system stores speed elsewhere, change this to the correct property path.
  - If the value is an object, the module tries `.total` then `.value`.

- **Dash multiplier / action rings** (default: `2`)
  - `2` = two-action ring, `3` = three-action ring.
  - `0` disables the secondary ring.

- **Colors**
  - Walk, Dash, Unreachable.

- **Fallback speed** (default: `30`)
  - Used when measuring with the Measure tool and there is no token context.

## Notes
- This port focuses on v13 measurement styling.
- The older v11/v12-era Drag Ruler features (waypoints, movement history, socketlib syncing, routinglib pathfinding, terrain-ruler integration) are **not enabled** in this overlay build.
