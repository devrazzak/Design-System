import type { ButtonHTMLAttributes, ReactNode } from 'react';

// ─── Variant & Size ───────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';

// ─── Own Props ────────────────────────────────────────────────────────────────

export interface ButtonOwnProps {
  /**
   * Visual style of the button.
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Size — controls height, padding, and font-size.
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Show loading spinner and disable interaction.
   * Automatically sets aria-busy="true".
   * @default false
   */
  loading?: boolean;

  /**
   * Render the button as a child element instead of <button>.
   * The child element receives all button props.
   * Use for link-buttons: <Button asChild><a href="…">…</a></Button>
   * @default false
   */
  asChild?: boolean;

  /**
   * Icon placed before the label.
   * Automatically gets aria-hidden="true".
   */
  iconStart?: ReactNode;

  /**
   * Icon placed after the label.
   * Automatically gets aria-hidden="true".
   */
  iconEnd?: ReactNode;

  /**
   * Stretch the button to fill its container.
   * @default false
   */
  fullWidth?: boolean;
}

// ─── Final Props ──────────────────────────────────────────────────────────────

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;
