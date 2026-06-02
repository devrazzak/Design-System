/**
 * Button — Storybook Stories
 * ==========================
 * CSF3 format with autodocs enabled.
 * Play functions double as interaction tests (Storybook test-runner + Chromatic).
 */

import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Button } from "./Button";

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
A button triggers an action or event.

**Built on native \`<button>\`** — keyboard support, focus management, and
form integration work out of the box.

### Accessibility
| Key | Action |
|-----|--------|
| \`Tab\` / \`Shift+Tab\` | Move focus to/from button |
| \`Space\` | Activate |
| \`Enter\` | Activate |

### When NOT to use
- **Navigation** → use \`<a>\` or \`<Button asChild><a/></Button>\`
- **Toggle on/off** → use \`Switch\` or \`Checkbox\`
- **Select from options** → use \`Select\` or \`RadioGroup\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────
export const Default: Story = {};

// ─── Variants ─────────────────────────────────────────────────────────────────
export const AllVariants: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Button {...args} loading={true} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
    </div>
  ),
};

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Danger: Story = {
  args: { variant: "danger", children: "Delete account" },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true, children: "Saving…" },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ width: 320, border: "1px dashed #ccc", padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

// ─── With icons ───────────────────────────────────────────────────────────────
// Using plain text as icon placeholder (swap for your icon library)
export const WithIconStart: Story = {
  args: {
    iconStart: <span>+</span>,
    children: "Add item",
  },
};

export const WithIconEnd: Story = {
  args: {
    iconEnd: <span>→</span>,
    children: "Continue",
  },
};

export const IconOnly: Story = {
  args: {
    "aria-label": "Delete item",
    iconStart: <span aria-hidden="true">🗑</span>,
    children: undefined,
  },
};

// ─── asChild (link button) ────────────────────────────────────────────────────
export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Open in new tab
      </a>
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `asChild` to render the button as an `<a>` tag for navigation. All button styles are applied to the anchor.",
      },
    },
  },
};

// ─── Interaction tests (play functions) ───────────────────────────────────────
export const ClickInteraction: Story = {
  args: { children: "Click me" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole("button", { name: /click me/i });
    await expect(btn).toBeEnabled();
    await userEvent.click(btn);
  },
};

export const KeyboardActivation: Story = {
  args: { children: "Press me" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole("button");
    await userEvent.tab();
    await expect(btn).toHaveFocus();
    await userEvent.keyboard(" ");
    await userEvent.keyboard("{Enter}");
  },
};

export const DisabledState: Story = {
  args: { disabled: true, children: "Cannot click" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button")).toBeDisabled();
  },
};

export const LoadingState: Story = {
  args: { loading: true, children: "Saving…" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole("button");
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute("aria-busy", "true");
  },
};
