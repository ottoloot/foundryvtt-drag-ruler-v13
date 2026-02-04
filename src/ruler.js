/**
 * v13 Ruler/TokenRuler wrappers.
 *
 * Foundry VTT v13 introduces a dedicated TokenRuler for token drag measurement.
 * The original Drag Ruler (v11/v12 era) replaced/extended the core Ruler and hooked token drag events.
 *
 * In v13, the most stable approach is to keep Foundry's measurement logic and only modify
 * the visual styling (segment colors / grid highlights) based on actor speed.
 */

"use strict";

import {libWrapper} from "./libwrapper_shim.js";
import {settingsKey} from "./settings.js";

/**
 * Patch Foundry's rulers (Measure tool + Token drag measurement) to use Drag-Ruler style colors.
 */
export function patchRulers() {
	// Wrap base Ruler segment styling (Measure tool)
	try {
		libWrapper.register(
			settingsKey,
			"foundry.canvas.interaction.Ruler.prototype._getSegmentStyle",
			function (wrapped, waypoint) {
				const style = wrapped.call(this, waypoint) || {width: 6};
				try {
					const dist = waypoint?.measurement?.distance ?? 0;
					const speed = getSpeedForRuler(this) ?? game.settings.get(settingsKey, "fallbackSpeed");
					const color = pickColor(dist, speed);
					if (color) {
						style.color = color;
						style.alpha = 1.0;
					}
				} catch (e) {
					console.error(`${settingsKey}: error in base Ruler _getSegmentStyle`, e);
				}
				return style;
			},
			"WRAPPER",
		);
	} catch (e) {
		console.error(`${settingsKey}: failed to wrap base Ruler _getSegmentStyle`, e);
	}

	// Wrap TokenRuler segment styling (token drag)
	try {
		libWrapper.register(
			settingsKey,
			"foundry.canvas.placeables.tokens.TokenRuler.prototype._getSegmentStyle",
			function (wrapped, waypoint) {
				const style = wrapped.call(this, waypoint) || {width: 6};
				try {
					const dist = waypoint?.measurement?.distance ?? 0;
					const speed = getSpeedForRuler(this) ?? game.settings.get(settingsKey, "fallbackSpeed");
					const color = pickColor(dist, speed);
					if (color) {
						style.color = color;
						style.alpha = 1.0;
					}
				} catch (e) {
					console.error(`${settingsKey}: error in TokenRuler _getSegmentStyle`, e);
				}
				return style;
			},
			"WRAPPER",
		);
	} catch (e) {
		console.error(`${settingsKey}: failed to wrap TokenRuler _getSegmentStyle`, e);
	}

	// Wrap TokenRuler grid highlight styling so squares match the segment color
	try {
		libWrapper.register(
			settingsKey,
			"foundry.canvas.placeables.tokens.TokenRuler.prototype._getGridHighlightStyle",
			function (wrapped, waypoint, offset) {
				const style = wrapped.call(this, waypoint, offset) || {};
				try {
					const dist = waypoint?.measurement?.distance ?? 0;
					const speed = getSpeedForRuler(this) ?? game.settings.get(settingsKey, "fallbackSpeed");
					const color = pickColor(dist, speed);
					if (color) {
						style.color = color;
						style.alpha = 0.35;
					}
				} catch (e) {
					console.error(`${settingsKey}: error in TokenRuler _getGridHighlightStyle`, e);
				}
				return style;
			},
			"WRAPPER",
		);
	} catch (e) {
		console.error(`${settingsKey}: failed to wrap TokenRuler _getGridHighlightStyle`, e);
	}
}

/**
 * Best-effort: detect if we're on Foundry v13+.
 */
export function isV13Plus() {
	try {
		const gen =
			game?.release?.generation ??
			parseInt(String(game?.version ?? "0").split(".")[0] || "0", 10);
		return Number.isFinite(gen) && gen >= 13;
	} catch (_e) {
		return true;
	}
}

/**
 * Return actor speed in scene distance units for this ruler.
 */
export function getSpeedForRuler(ruler) {
	// Prefer token rulers' token; fall back to first controlled token.
	const token = ruler?.token ?? canvas?.tokens?.controlled?.[0] ?? null;
	const actor = token?.actor ?? null;
	if (!actor) return null;

	const path = String(game.settings.get(settingsKey, "speedAttribute") ?? "");
	if (!path) return null;

	const getProp = globalThis.foundry?.utils?.getProperty ?? globalThis.getProperty;
	let v;
	try {
		v = getProp ? getProp(actor, path) : undefined;
	} catch (_e) {
		v = undefined;
	}

	// Try common shapes
	if (typeof v === "number") return v;
	if (v && typeof v.total === "number") return v.total;
	if (v && typeof v.value === "number") return v.value;
	if (typeof v === "string") {
		const m = v.match(/-?\d+(\.\d+)?/);
		if (m) return Number(m[0]);
	}
	return null;
}

/**
 * Decide color by distance thresholds.
 *
 * @param {number} distance
 * @param {number} baseSpeed
 * @returns {string|null} CSS color string
 */
export function pickColor(distance, baseSpeed) {
	const m = Number(game.settings.get(settingsKey, "dashMultiplier")) || 0;
	const walk = Number(baseSpeed) || 0;
	const walkColor = String(game.settings.get(settingsKey, "walkColor") || "#00ff00");
	const dashColor = String(game.settings.get(settingsKey, "dashColor") || "#ffff00");
	const unreachableColor = String(
		game.settings.get(settingsKey, "unreachableColor") || "#ff0000",
	);

	if (walk <= 0) return unreachableColor;

	// Allow a small epsilon to avoid flicker at boundary
	const eps = 1e-6;
	if (distance <= walk + eps) return walkColor;
	if (m > 1 && distance <= walk * m + eps) return dashColor;
	return unreachableColor;
}
