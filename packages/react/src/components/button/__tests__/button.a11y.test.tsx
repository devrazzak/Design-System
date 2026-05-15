/**
 * Button — Accessibility Tests
 * ==============================
 * Uses jest-axe to catch automated WCAG violations.
 *
 * ⚠️  axe catches ~30–40% of a11y issues.
 *     Manual screen reader testing (VoiceOver / NVDA) is still required.
 *
 * Run: pnpm test packages/react/src/components/button/__tests__/button.a11y.test.tsx
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../button';

expect.extend(toHaveNoViolations);

describe('Button — Accessibility (axe)', () => {
  it('has no violations in default state', async () => {
    const { container } = render(<Button>Save changes</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no violations when disabled', async () => {
    const { container } = render(<Button disabled>Save changes</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no violations when loading', async () => {
    const { container } = render(<Button loading>Saving…</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no violations for each variant', async () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
    for (const variant of variants) {
      const { container } = render(
        <Button variant={variant}>Button text</Button>,
      );
      expect(await axe(container)).toHaveNoViolations();
    }
  });

  it('has no violations for each size', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { container } = render(<Button size={size}>Button text</Button>);
      expect(await axe(container)).toHaveNoViolations();
    }
  });

  it('has no violations when used as a link (asChild)', async () => {
    const { container } = render(
      <Button asChild>
        <a href="/home">Go home</a>
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no violations for icon-only button WITH aria-label', async () => {
    const { container } = render(
      <Button aria-label="Delete item" iconStart={<span aria-hidden="true">🗑</span>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('REPORTS a violation for icon-only button WITHOUT aria-label', async () => {
    // This test documents the failure mode.
    // It SHOULD fail — that's the point.
    const { container } = render(
      <Button iconStart={<span aria-hidden="true">🗑</span>} />,
    );
    const results = await axe(container);
    // axe should find a "button-name" violation
    expect(results.violations.some(v => v.id === 'button-name')).toBe(true);
  });
});
