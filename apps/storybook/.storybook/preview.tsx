import { type Preview } from "@storybook/react";
import type { ComponentType } from "react";

import "@raxora/tokens/css";

const withTheme = (
  Story: ComponentType,
  context: { globals?: { theme?: string } },
) => {
  const theme = context.globals?.theme ?? "light";

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: "100px",
        padding: "24px",
        background: "var(--semantic-color-background-page, #ffffff)",
        color: "var(--semantic-color-text-primary, #191c1f)",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      name: "Theme",
      description: "Light / Dark theme toggle",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: "requiredFirst",
    },

    actions: { argTypesRegex: "^on[A-Z].*" },

    viewport: {
      viewports: {
        mobile: { name: "Mobile", styles: { width: "375px", height: "667px" } },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },

    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "button-name", enabled: true },
        ],
      },
    },
  },
};

export default preview;
