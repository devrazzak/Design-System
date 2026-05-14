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
  type ReactElement,
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

// ─── Slot ─────────────────────────────────────────────────────────────────────
/**
 * Slot merges its props onto its single child element.
 * The child element's props take precedence for className and event handlers
 * (both are composed rather than one overriding the other).
 */
const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, ref) => {
    if (!isValidElement(children)) {
      if (Children.count(children) > 1) {
        throw new Error("<Slot> must have exactly one child");
      }
      return null;
    }

    const child = children as ReactElement<
      Record<string, unknown> & { ref?: Ref<unknown> }
    >;

    return cloneElement(child, {
      ...slotProps,
      ...child.props,
      // Merge className (slot class + child class)
      className: mergeClasses(
        slotProps.className as string | undefined,
        child.props.className as string | undefined,
      ),
      // Compose event handlers so both fire
      onClick: composeEventHandlers(
        slotProps.onClick as ((e: unknown) => void) | undefined,
        child.props.onClick as ((e: unknown) => void) | undefined,
      ),
      onKeyDown: composeEventHandlers(
        slotProps.onKeyDown as ((e: unknown) => void) | undefined,
        child.props.onKeyDown as ((e: unknown) => void) | undefined,
      ),
      // Forward ref to child's element
      ref,
    });
  },
);

Slot.displayName = "Slot";

export { Slot };
export type { SlotProps };
