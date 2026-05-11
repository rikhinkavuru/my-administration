"use client";
/**
 * Shared scroll progress for the platform city sequence.
 *
 * Owned by `CitySequence`; consumed by `CityCanvas` / `CityScene` via a
 * ref so per-frame reads never trip React renders. Mirrors the JetSequence
 * pattern (`{ progress: number }` ref) so the codebase stays consistent.
 */
import type { MutableRefObject } from "react";

export type CityProgressRef = MutableRefObject<{ progress: number }>;
