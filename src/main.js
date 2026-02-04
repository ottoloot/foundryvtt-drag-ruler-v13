/**
 * Drag Ruler (v13 Overlay) entry point.
 *
 * Why the minimal v13 version works:
 * - It does NOT replace Foundry's ruler or token drag workflow.
 * - Instead, it wraps v13's Ruler/TokenRuler "style" methods to change colors based on speed.
 *
 * This restored project keeps that same stable approach, while using the multi-file layout
 * from the older Drag Ruler codebase.
 */

"use strict";

import {registerSettings, settingsKey} from "./settings.js";
import {isV13Plus, patchRulers} from "./ruler.js";

// Provide simple polyfills for older Drag Ruler files (and any third-party add-ons)
// that may still call the old global helper names in Foundry v13.
Hooks.once("init", () => {
	// Register v13 overlay settings
	registerSettings();

	// Polyfill some Foundry v11/v12-era globals if v13 removed them.
	const fu = globalThis.foundry?.utils;
	if (fu) {
		if (globalThis.duplicate === undefined && typeof fu.duplicate === "function") {
			globalThis.duplicate = fu.duplicate;
		}
		if (globalThis.mergeObject === undefined && typeof fu.mergeObject === "function") {
			globalThis.mergeObject = fu.mergeObject;
		}
		if (globalThis.getProperty === undefined && typeof fu.getProperty === "function") {
			globalThis.getProperty = fu.getProperty;
		}
		if (globalThis.setProperty === undefined && typeof fu.setProperty === "function") {
			globalThis.setProperty = fu.setProperty;
		}
	}
});

Hooks.once("ready", () => {
	if (!isV13Plus()) {
		console.warn(`${settingsKey}: Foundry < v13 detected. This build is v13-only.`);
		return;
	}

	patchRulers();
	console.info(`${settingsKey}: v13 overlay active.`);
});
