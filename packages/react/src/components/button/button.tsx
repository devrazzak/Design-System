/**
 * Button
 * ======
 * A polymorphic, accessible button component built from scratch.
 *
 * Key decisions:
 * - Built on native <button> (keyboard, focus, form integration — all free)
 * - asChild pattern via Slot (no runtime polymorphism generics)
 * - data-* attributes for variant CSS (easier to inspect in DevTools)
 * - forwardRef for parent access (focus(), scroll(), animation libs)
 * - type="button" default (prevents accidental form submission)
 * - loading disables but keeps focus (screen readers still announce state)
 * - CSS Modules for scoped styles (no class collision, no runtime)
 */

import { forwardRef } from "react";
import { Slot } from "../../_primitives/slot/slot";
import { cn } from "../../utils/cn";
import styles from "./button.module.css";
import type { ButtonProps } from "./button.types";

// ─── Spinner ──────────────────────────────────────────────────────────────────
// Inline SVG keeps zero external dependency.
// aria-hidden because the button text already describes the loading state.
function Spinner() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={styles.spinner}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="40 60"
      />
    </svg>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    // Own props
    variant = "primary",
    size = "md",
    loading = false,
    asChild = false,
    iconStart,
    iconEnd,
    fullWidth = false,

    // Native button props
    type = "button", // Prevent accidental form submission
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  // Treat loading as disabled — prevents click but allows focus
  // so screen readers can still discover & announce the button.
  const isDisabled = disabled || loading;

  // When asChild=true, Slot merges our props onto the consumer's child
  // element. e.g. <Button asChild><a href="…">…</a></Button>
  const Comp = asChild ? Slot : "button";

  // Slot requires exactly one child element, so the polymorphic path must
  // pass the consumer's element through directly without extra wrappers.
  if (asChild) {
    return (
      <Comp
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        data-full-width={fullWidth || undefined}
        className={cn(styles.button, className)}
        {...rest}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref}
      // Only add type for real <button> elements, not arbitrary children
      {...(!asChild && { type })}
      disabled={isDisabled}
      // aria-busy announces to screen readers that an action is in progress
      aria-busy={loading || undefined}
      // data-* attributes drive CSS variant/size styles.
      // Keeps class names stable (no concat hacks) and visible in DevTools.
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      className={cn(styles.button, className)}
      {...rest}
    >
      {/* Loading spinner replaces iconStart */}
      {loading && <Spinner />}
      {!loading && iconStart && (
        <span className={styles.icon} aria-hidden="true">
          {iconStart}
        </span>
      )}

      {/* Label — wrapped so it can be truncated independently */}
      {children && <span className={styles.label}>{children}</span>}

      {!loading && iconEnd && (
        <span className={styles.icon} aria-hidden="true">
          {iconEnd}
        </span>
      )}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button };
