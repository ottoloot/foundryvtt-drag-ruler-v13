/**
 * Drag Ruler (v13 Overlay) settings
 *
 * This project is a "restored" multi-file dev layout based on the Drag Ruler v1.13.x codebase,
 * but updated to work with Foundry VTT v13 by *overlaying* color styling onto the new v13
 * Token Drag Measurement (TokenRuler) instead of replacing the core ruler implementation.
 */

"use strict";

export const settingsKey = "drag-ruler";

// Kept for backwards compatibility with the older codebase; not used by the v13 overlay.
export const RightClickAction = Object.freeze({
	CREATE_WAYPOINT: 0,
	DELETE_WAYPOINT: 1,
	ABORT_DRAG: 2,
});

export function registerSettings() {
	// Actor data path for speed (PF2e-friendly default).
	game.settings.register(settingsKey, "speedAttribute", {
		name: "Speed attribute path",
		hint: "Object path on the actor to read base speed from (PF2e default works out of the box).",
		scope: "world",
		config: true,
		type: String,
		default: "system.attributes.speed.total",
	});

	// Multiplier for the second ring/band. 0 disables it.
	game.settings.register(settingsKey, "dashMultiplier", {
		name: "Dash multiplier / action rings",
		hint: "2 → two-action ring, 3 → three-action ring. 0 disables the secondary ring.",
		scope: "world",
		config: true,
		type: Number,
		range: {min: 0, max: 5, step: 1},
		default: 2,
	});

	// Colors
	game.settings.register(settingsKey, "walkColor", {
		name: "Color for walk (ring 1)",
		scope: "world",
		config: true,
		type: String,
		default: "#00ff00",
	});

	game.settings.register(settingsKey, "dashColor", {
		name: "Color for dash (ring 2)",
		scope: "world",
		config: true,
		type: String,
		default: "#ffff00",
	});

	game.settings.register(settingsKey, "unreachableColor", {
		name: "Color for unreachable",
		scope: "world",
		config: true,
		type: String,
		default: "#ff0000",
	});

	// Used when measuring with the Measure tool and no token is associated.
	game.settings.register(settingsKey, "fallbackSpeed", {
		name: "Fallback speed (when no token)",
		hint: "Used when measuring distance with no token ruler (e.g. Measure tool).",
		scope: "world",
		config: true,
		type: Number,
		range: {min: 0, max: 200, step: 5},
		default: 30,
	});
}
