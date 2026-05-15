import { addons } from "@storybook/manager-api";
import { themes } from "@storybook/theming";

addons.setConfig({
  // Storybook UI theme — extend the default light theme and add Raxora branding
  theme: {
    ...themes.light,
    brandTitle: "Raxora",
    brandUrl: "/",
    brandImage: "/raxora-logo.svg",
  },

  // Sidebar settings
  sidebar: {
    showRoots: true,
  },

  // Panel position (controls, a11y, actions)
  panelPosition: "bottom",
});
