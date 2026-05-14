/**
 * VisuallyHidden
 * ==============
 * Renders content that is invisible on screen but announced by screen readers.
 *
 * @example
 * // Icon-only button — screen reader reads "Close dialog"
 * <button>
 *   <XIcon aria-hidden="true" />
 *   <VisuallyHidden>Close dialog</VisuallyHidden>
 * </button>
 *
 * Why NOT `display:none` or `visibility:hidden`?
 *   Those hide content from screen readers too.
 *   This technique positions the element off-screen without hiding it.
 */

import { type HTMLAttributes } from "react";
import styles from "./visually-hidden.module.css";

interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {}

function VisuallyHidden({
  children,
  className,
  ...props
}: VisuallyHiddenProps) {
  return (
    <span
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

export { VisuallyHidden };
export type { VisuallyHiddenProps };
