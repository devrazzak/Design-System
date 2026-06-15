import { cn, Slot } from "@raxora/react";
import { forwardRef } from "react";
import styles from "./ButtonBase.module.css";
import type { ButtonBaseProps } from "./types";

/**
 * ButtonBase — the unstyled, accessible button component.
 * Use as the base for all button variants.
 * Supports rendering as a child element (e.g. <a>) for link-buttons.
 * Handles disabled state and accessibility attributes.
 * Does not include any visual styles — these are added in the Button component.
 */

export const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  function ButtonBase(
    { asChild = false, disabled, className, children, component, ...rest },
    ref,
  ) {
    const Comp = component ?? (asChild ? Slot : "button");

    return (
      <Comp
        ref={ref}
        className={cn(styles.root, className)}
        disabled={!asChild ? disabled : undefined}
        aria-disabled={asChild && disabled ? true : undefined}
        type={!asChild ? (rest.type ?? "button") : undefined}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

ButtonBase.displayName = "ButtonBase";

export { styles as buttonBaseStyles };
