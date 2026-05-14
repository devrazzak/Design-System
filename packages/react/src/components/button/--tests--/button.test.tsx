/**
 * Button — Unit Tests
 * ===================
 * Philosophy: test BEHAVIOR, not implementation.
 *   ✓ Does it respond to keyboard?
 *   ✓ Does disabled actually prevent clicks?
 *   ✓ Does loading set aria-busy?
 *   ✗ Don't test CSS class names (brittle, wrong abstraction)
 *   ✗ Don't test internal DOM structure (implementation detail)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

afterEach(cleanup);

// ─── Rendering ────────────────────────────────────────────────────────────────
describe('Button — rendering', () => {
  it('renders a <button> element by default', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('has type="button" by default (prevents form submission)', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('accepts type="submit" for form submit buttons', () => {
    render(<Button type="submit">Submit form</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards className to the root element', () => {
    render(<Button className="extra">Save</Button>);
    expect(screen.getByRole('button')).toHaveClass('extra');
  });

  it('forwards arbitrary HTML attributes', () => {
    render(<Button data-testid="my-btn">Save</Button>);
    expect(screen.getByTestId('my-btn')).toBeInTheDocument();
  });

  it('forwards ref to the button element', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// ─── asChild / Slot ───────────────────────────────────────────────────────────
describe('Button — asChild', () => {
  it('renders as a child element when asChild=true', () => {
    render(
      <Button asChild>
        <a href="/home">Go home</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: /go home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('merges classNames onto the child element', () => {
    render(
      <Button asChild className="btn-class">
        <a href="/">Link</a>
      </Button>,
    );
    expect(screen.getByRole('link')).toHaveClass('btn-class');
  });
});

// ─── Interaction ──────────────────────────────────────────────────────────────
describe('Button — interaction', () => {
  it('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('fires onClick when Space is pressed', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);
    screen.getByRole('button').focus();
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('fires onClick when Enter is pressed', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledOnce();
  });
});

// ─── Disabled ─────────────────────────────────────────────────────────────────
describe('Button — disabled', () => {
  it('is disabled when disabled=true', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does NOT fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Save</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does NOT fire onClick when keyboard-activated while disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Save</Button>);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ─── Loading ──────────────────────────────────────────────────────────────────
describe('Button — loading', () => {
  it('sets aria-busy="true" when loading', () => {
    render(<Button loading>Saving…</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('is disabled when loading', () => {
    render(<Button loading>Saving…</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does NOT fire onClick when loading', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Saving…</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does NOT have aria-busy when not loading', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
  });
});

// ─── Icons ────────────────────────────────────────────────────────────────────
describe('Button — icons', () => {
  it('renders iconStart when provided', () => {
    render(
      <Button iconStart={<span data-testid="icon-start" />}>Save</Button>,
    );
    expect(screen.getByTestId('icon-start')).toBeInTheDocument();
  });

  it('hides iconStart while loading', () => {
    render(
      <Button loading iconStart={<span data-testid="icon-start" />}>
        Saving…
      </Button>,
    );
    expect(screen.queryByTestId('icon-start')).toBeNull();
  });

  it('renders iconEnd when provided', () => {
    render(
      <Button iconEnd={<span data-testid="icon-end" />}>Next</Button>,
    );
    expect(screen.getByTestId('icon-end')).toBeInTheDocument();
  });
});
