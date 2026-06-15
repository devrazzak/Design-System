/**
 * Slot — The `asChild` primitive
 * ================================
 * Allows a component to render AS a different element while keeping
 * all the component's props/behavior.
 *
 * @example
 * // Button renders as an <a> tag — no extra DOM node
 * <Button asChild>
 *   <a href="/home">Go home</a>
 * </Button>
 *
 * Why this exists:
 *   The naive approach `<Button as="a">` requires complex TypeScript generics.
 *   Radix's Slot pattern is simpler: it clones the child and merges props.
 *   The consumer controls the element, we control the behavior.
 */

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

// ─── Utility: merge two className strings ────────────────────────────────────
function mergeClasses(a?: string, b?: string): string | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  return `${a} ${b}`;
}

// ─── Utility: compose two event handlers ─────────────────────────────────────
// If both handlers exist, call both. Neither suppresses the other.
function composeEventHandlers<E>(
  original?: (event: E) => void,
  override?: (event: E) => void,
): (event: E) => void {
  return (event: E) => {
    original?.(event);
    override?.(event);
  };
}

// ─── Slot Props ───────────────────────────────────────────────────────────────
interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

type SlotChildProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<unknown>;
};

// ─── Slot ─────────────────────────────────────────────────────────────────────
/**
 * Slot merges its props onto its single child element.
 * The child element's props take precedence for className and event handlers
 * (both are composed rather than one overriding the other).
 */
const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, ref) => {
    if (!isValidElement<SlotChildProps>(children)) {
      if (Children.count(children) > 1) {
        throw new Error("<Slot> must have exactly one child");
      }
      return null;
    }

    const child = children;

    return cloneElement(child, {
      ...slotProps,
      ...child.props,
      // Merge className (slot class + child class)
      className: mergeClasses(
        slotProps.className,
        child.props.className,
      ),
      // Compose event handlers so both fire
      onClick: composeEventHandlers(
        slotProps.onClick,
        child.props.onClick,
      ),
      onKeyDown: composeEventHandlers(
        slotProps.onKeyDown,
        child.props.onKeyDown,
      ),
      // Forward ref to child's element
      ref,
    });
  },
);

Slot.displayName = "Slot";

export { Slot };
export type { SlotProps };
