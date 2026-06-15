import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "success"
  | "warning"
  | "outline"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  component?: ElementType;
}

export interface ButtonProps extends ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /**
   * Where to render the loading spinner. `auto` places it left when a leftIcon
   * exists (or by default), otherwise right when only an end icon exists.
   */
  loadingPosition?: "auto" | "left" | "right";
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}
