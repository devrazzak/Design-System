// ─── Components ───────────────────────────────────────────────────────────────
export * from "./components/button";

// Future components:
// export * from './components/input';
// export * from './components/checkbox';
// export * from './components/dialog';

// ─── Primitives (for DS consumers who extend the system) ─────────────────────
export { Slot } from "./_primitives/slot/slot";
export { VisuallyHidden } from "./_primitives/visually-hidden/visually-hidden";

// ─── Utilities ────────────────────────────────────────────────────────────────
export { cn } from "./utils/cn";
export { composeEventHandlers } from "./utils/compose-event-handlers";
