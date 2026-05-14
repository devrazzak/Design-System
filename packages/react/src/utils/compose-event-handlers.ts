/**
 * composeEventHandlers
 * =====================
 * Merges two event handlers. Both fire unless the first calls
 * event.preventDefault().
 *
 * Used by Slot and compound components to merge consumer handlers
 * with internal handlers without one suppressing the other.
 *
 * @example
 * const handleClick = composeEventHandlers(props.onClick, internalOnClick);
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  external?: (event: E) => void,
  internal?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
): (event: E) => void {
  return (event: E) => {
    external?.(event);
    if (checkForDefaultPrevented && event.defaultPrevented) return;
    internal?.(event);
  };
}
