import { forwardRef, useMemo } from "react";
import { cn } from "../../utils/cn";
import styles from "./Button.module.css";
import { ButtonBase } from "./ButtonBase";
import type { ButtonProps } from "./types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      loadingPosition = "auto",
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const { showLeftSpinner, showRightSpinner } = useMemo(() => {
      if (loadingPosition === "left")
        return { showLeftSpinner: true, showRightSpinner: false };
      if (loadingPosition === "right")
        return { showLeftSpinner: false, showRightSpinner: true };

      const onRight = !leftIcon && Boolean(rightIcon);
      return { showLeftSpinner: !onRight, showRightSpinner: onRight };
    }, [loadingPosition, leftIcon, rightIcon]);

    return (
      <ButtonBase
        ref={ref}
        disabled={disabled ?? loading}
        aria-busy={loading || undefined}
        data-variant={variant}
        data-size={size}
        data-loading={loading ? "true" : undefined}
        className={cn(styles.button, className)}
        {...props}
      >
        {loading && showLeftSpinner && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        {leftIcon && !loading && (
          <span className={styles.icon}>{leftIcon}</span>
        )}

        {children}

        {loading && showRightSpinner && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        {rightIcon && !loading && (
          <span className={styles.icon}>{rightIcon}</span>
        )}
      </ButtonBase>
    );
  },
);

Button.displayName = "Button";
