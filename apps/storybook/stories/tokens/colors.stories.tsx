import type { Meta, StoryObj } from "@storybook/react";

// ─── Color Swatch Component ───────────────────────────────────────────────────
function ColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "8px",
          background: `var(${cssVar})`,
          border: "1px solid rgba(0,0,0,0.1)",
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontWeight: 500, fontSize: "14px" }}>{name}</div>
        <div
          style={{
            fontSize: "12px",
            color: "#77878f",
            fontFamily: "monospace",
          }}
        >
          {cssVar}
        </div>
      </div>
    </div>
  );
}

// ─── Color Scale Component ────────────────────────────────────────────────────
function ColorScale({
  title,
  prefix,
  steps,
}: {
  title: string;
  prefix: string;
  steps: number[];
}) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: 600 }}>
        {title}
      </h3>
      {steps.map((step) => (
        <ColorSwatch
          key={step}
          name={`${title} ${step}`}
          cssVar={`--color-${prefix}-${step}`}
        />
      ))}
    </div>
  );
}

// ─── Semantic Colors Component ────────────────────────────────────────────────
function SemanticColors() {
  const semantics = [
    { name: "Background Page", cssVar: "--semantic-color-background-page" },
    {
      name: "Background Surface",
      cssVar: "--semantic-color-background-surface",
    },
    { name: "Background Subtle", cssVar: "--semantic-color-background-subtle" },
    { name: "Text Primary", cssVar: "--semantic-color-text-primary" },
    { name: "Text Secondary", cssVar: "--semantic-color-text-secondary" },
    { name: "Text Tertiary", cssVar: "--semantic-color-text-tertiary" },
    { name: "Action Primary", cssVar: "--semantic-color-action-primary-bg" },
    {
      name: "Action Primary Hover",
      cssVar: "--semantic-color-action-primary-bg-hover",
    },
    { name: "Border Default", cssVar: "--semantic-color-border-default" },
    { name: "Border Focus", cssVar: "--semantic-color-border-focus" },
    {
      name: "Feedback Success",
      cssVar: "--semantic-color-feedback-success-bg",
    },
    {
      name: "Feedback Warning",
      cssVar: "--semantic-color-feedback-warning-bg",
    },
    { name: "Feedback Danger", cssVar: "--semantic-color-feedback-danger-bg" },
  ];

  return (
    <div>
      <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: 600 }}>
        Semantic Colors
      </h3>
      <p style={{ fontSize: "13px", color: "#77878f", marginBottom: "16px" }}>
        Theme toggle করলে এই colors automatically change হবে।
      </p>
      {semantics.map((s) => (
        <ColorSwatch key={s.cssVar} name={s.name} cssVar={s.cssVar} />
      ))}
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────
const meta = {
  title: "Tokens/Colors",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "All color tokens from the design system. Toggle light/dark theme in the toolbar.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const COLOR_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const PrimitiveColors: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px",
      }}
    >
      <ColorScale title="Gray" prefix="gray" steps={COLOR_STEPS} />
      <ColorScale title="Primary" prefix="primary" steps={COLOR_STEPS} />
      <ColorScale title="Secondary" prefix="secondary" steps={COLOR_STEPS} />
      <ColorScale title="Success" prefix="success" steps={COLOR_STEPS} />
      <ColorScale title="Warning" prefix="warning" steps={COLOR_STEPS} />
      <ColorScale title="Danger" prefix="danger" steps={COLOR_STEPS} />
    </div>
  ),
};

export const SemanticTokens: Story = {
  render: () => <SemanticColors />,
};
