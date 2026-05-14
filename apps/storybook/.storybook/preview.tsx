import type { Preview } from '@storybook/react';
import React from 'react';

// ★ Token CSS import — এটাই সব CSS variables load করে
// Button এর সব color, spacing, radius এখান থেকে আসবে
import '../../../packages/tokens/dist/css/tokens.css';

// ─── Theme Decorator ──────────────────────────────────────────────────────────
// প্রতিটা story কে একটা wrapper div এ wrap করে
// যাতে light/dark theme toggle করা যায়
const withTheme = (Story: React.ComponentType, context: { globals: { theme?: string } }) => {
  const theme = context.globals?.theme ?? 'light';

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: '100px',
        padding: '24px',
        background: 'var(--semantic-color-background-page, #ffffff)',
        color: 'var(--semantic-color-text-primary, #191c1f)',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      <Story />
    </div>
  );
};

// ─── Preview Config ───────────────────────────────────────────────────────────
const preview: Preview = {
  // Global decorators — সব stories এ apply হবে
  decorators: [withTheme],

  // Global types — Storybook toolbar এ theme toggle button দেখাবে
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light / Dark theme toggle',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  // Default parameters — সব stories এ apply হবে
  parameters: {
    // Controls panel — args এর sorting এবং grouping
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: 'requiredFirst',
    },

    // Actions — onClick, onChange etc. auto-detect করবে
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Viewport — responsive testing
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
    },

    // A11y — default accessibility rules
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'button-name', enabled: true },
        ],
      },
    },
  },
};

export default preview;
