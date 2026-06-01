/**
 * cn — className utility
 * =======================
 * Merges className strings, filtering out falsy values.
 * Simpler than clsx but sufficient for a DS — avoids an extra dependency.
 *
 * @example
 * cn('button', isActive && 'button--active', undefined, 'extra')
 * // → 'button button--active extra'
 */

export function cn(
  ...classes: Array<
    string | boolean | undefined | null | { [key: string]: boolean }
  >
): string {
  return classes
    .flatMap((c) => {
      if (typeof c === "object" && c !== null) {
        return Object.entries(c)
          .filter(([_, value]) => value)
          .map(([key]) => key);
      }
      return c;
    })
    .filter(Boolean)
    .join(" ");
}
