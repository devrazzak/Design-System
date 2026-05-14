import { addons } from "@storybook/manager-api";
import { themes } from "@storybook/theming";

addons.setConfig({
  // Storybook UI theme
  theme: themes.light,

  // Sidebar settings
  sidebar: {
    showRoots: true,
  },

  // Panel position (controls, a11y, actions)
  panelPosition: "bottom",
});
