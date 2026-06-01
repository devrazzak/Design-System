/**
 * Merges className strings and conditional class objects into a single string.
 * Accepts any number of arguments, which can be:
 * - Strings (e.g. "btn", "btn-primary")
 * - Objects with boolean values (e.g. { "btn-disabled": isDisabled })
 * - undefined or null (these are ignored)
 *
 * @example
 * cn("btn", "btn-primary", { "btn-disabled": isDisabled }, undefined, null)
 * => "btn btn-primary btn-disabled" (if isDisabled is true)
 *
 * This utility helps keep className logic clean and readable in components.
 * It is similar to the popular "classnames" library but implemented in-house
 * to avoid external dependencies and allow for tree-shaking.
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
