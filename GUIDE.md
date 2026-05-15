# Design System — Complete Guide (Bengali)

তোমার `colors.json` থেকে শুরু করে production-ready Button পর্যন্ত। সব ১১টা প্রশ্নের answer এখানে।

---

## Final Folder Structure

```
my-design-system/                        ← monorepo root
│
├── package.json                         ← workspace scripts, shared devDeps
├── pnpm-workspace.yaml                  ← packages/* define করা আছে
├── tsconfig.json                        ← shared TypeScript config
├── vitest.config.ts                     ← test runner config
├── vitest.setup.ts                      ← jest-dom matchers setup
│
├── packages/
│   │
│   ├── tokens/                          ← @raxora/tokens (publishable)
│   │   ├── package.json
│   │   ├── scripts/
│   │   │   └── build.mjs               ← Style Dictionary build script
│   │   ├── src/
│   │   │   └── tokens/
│   │   │       ├── core/               ← LAYER 1: Primitives
│   │   │       │   ├── color.json      ← তোমার colors.json restructured
│   │   │       │   ├── dimension.json  ← spacing, radius, sizes
│   │   │       │   ├── typography.json ← font scale
│   │   │       │   └── effects.json    ← shadow, motion, z-index
│   │   │       │
│   │   │       ├── semantic/           ← LAYER 2: Purpose-driven
│   │   │       │   ├── light.json      ← light theme mappings
│   │   │       │   └── dark.json       ← dark theme overrides
│   │   │       │
│   │   │       └── component/          ← LAYER 3: Component-specific
│   │   │           └── button.json     ← button component tokens
│   │   │
│   │   └── dist/                       ← AUTO-GENERATED (git-ignored)
│   │       ├── css/
│   │       │   ├── tokens.css          ← ★ This is what you import in app
│   │       │   ├── tokens-light.css
│   │       │   └── tokens-dark.css
│   │       ├── js/
│   │       │   ├── index.js
│   │       │   └── index.d.ts
│   │       └── tailwind/
│   │           └── theme.css
│   │
│   └── react/                          ← @raxora/react (publishable)
│       ├── package.json
│       ├── src/
│       │   │
│       │   ├── _primitives/            ← Low-level building blocks
│       │   │   ├── slot/
│       │   │   │   └── slot.tsx        ← asChild pattern
│       │   │   ├── visually-hidden/
│       │   │   │   ├── visually-hidden.tsx
│       │   │   │   └── visually-hidden.module.css
│       │   │   └── portal/             ← (week 6 এ Dialog এর জন্য)
│       │   │       └── portal.tsx
│       │   │
│       │   ├── components/
│       │   │   └── button/             ← CO-LOCATED: সব কিছু এক folder এ
│       │   │       ├── button.tsx          ← Main component
│       │   │       ├── button.types.ts     ← TypeScript types
│       │   │       ├── button.module.css   ← CSS Modules (scoped styles)
│       │   │       ├── button.stories.tsx  ← Storybook stories
│       │   │       ├── index.ts            ← Public barrel export
│       │   │       └── __tests__/
│       │   │           ├── button.test.tsx      ← Unit tests
│       │   │           └── button.a11y.test.tsx ← Accessibility tests
│       │   │
│       │   ├── hooks/                  ← Shared hooks
│       │   │   ├── use-controllable-state.ts
│       │   │   └── use-id.ts
│       │   │
│       │   ├── utils/
│       │   │   ├── cn.ts                      ← className merger
│       │   │   └── compose-event-handlers.ts
│       │   │
│       │   ├── types/
│       │   │   └── polymorphic.ts
│       │   │
│       │   └── index.ts               ← Root public API
│       │
│       └── dist/                      ← AUTO-GENERATED (git-ignored)
│
└── .gitignore
```

---

## Question 1: Figma এর JSON file export করার পরে কোথায় রাখবো?

```
পদক্ষেপ:
Figma → Tokens Studio → Export → JSON
                                  ↓
    packages/tokens/src/tokens/core/color.json  ← এখানে রাখো
```

**কিন্তু directly paste করলে হবে না।** তোমার `colors.json` এ top-level keys আছে (`Gray`, `Primary`, etc.)। এগুলো restructure করতে হবে:

তোমার `colors.json` (Tokens Studio output):

```json
{
  "Gray": { "50": { "$type": "color", "$value": "#f2f4f5" } },
  "Primary": { "500": { "$type": "color", "$value": "#fa8232" } }
}
```

Restructured `core/color.json`:

```json
{
  "color": {
    "gray": { "50": { "$type": "color", "$value": "#f2f4f5" } },
    "primary": { "500": { "$type": "color", "$value": "#fa8232" } }
  }
}
```

**কেন:** lowercase + নেস্টেড করলে CSS variable name হবে `--color-gray-50` আর `--color-primary-500` — industry standard।

**একটাই file:** `packages/tokens/src/tokens/core/color.json` এ সব color primitives রাখো।

---

## Question 2: semantic.json কোথায় আর কী থাকবে?

দুটো file, দুটো theme:

```
packages/tokens/src/tokens/semantic/
├── light.json   ← light theme
└── dark.json    ← dark theme
```

**`light.json` এ কী থাকে:**

```json
{
  "semantic": {
    "color": {
      "background": {
        "page": { "$type": "color", "$value": "{color.white}" },
        "surface": { "$type": "color", "$value": "{color.gray.50}" }
      },
      "text": {
        "primary": { "$type": "color", "$value": "{color.gray.900}" },
        "secondary": { "$type": "color", "$value": "{color.gray.700}" }
      },
      "action": {
        "primary-bg": { "$type": "color", "$value": "{color.primary.500}" },
        "primary-bg-hover": {
          "$type": "color",
          "$value": "{color.primary.600}"
        },
        "primary-text": { "$type": "color", "$value": "{color.white}" }
      },
      "border": {
        "default": { "$type": "color", "$value": "{color.gray.200}" },
        "focus": { "$type": "color", "$value": "{color.primary.500}" }
      }
    }
  }
}
```

**Rule:** semantic tokens শুধু primitive tokens reference করবে `{color.gray.50}` syntax দিয়ে। কখনো raw hex না।

**`dark.json` এ:** Same keys, different values — dark এর জন্য উল্টো mapping।

---

## Question 3: component.json এ কী রাখবো?

```
packages/tokens/src/tokens/component/
└── button.json
```

**কী থাকে:** Component-specific tokens যেগুলো semantic tokens reference করে।

```json
{
  "component": {
    "button": {
      "border-radius": { "$type": "dimension", "$value": "{radius.md}" },
      "font-weight": {
        "$type": "fontWeight",
        "$value": "{font.weight.medium}"
      },
      "variant": {
        "primary": {
          "bg": {
            "$type": "color",
            "$value": "{semantic.color.action.primary-bg}"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "{semantic.color.action.primary-bg-hover}"
          },
          "text": {
            "$type": "color",
            "$value": "{semantic.color.action.primary-text}"
          }
        }
      },
      "size": {
        "md": {
          "height": { "$type": "dimension", "$value": "{size.control-md}" },
          "padding-inline": { "$type": "dimension", "$value": "{space.4}" },
          "font-size": { "$type": "dimension", "$value": "{font.size.sm}" }
        }
      }
    }
  }
}
```

**Rule:** component tokens → semantic tokens → core tokens। Never skip a layer।

**কেন component tokens দরকার:** যদি কোনো product team চায় শুধু Button এর রং আলাদা রাখতে (not the full brand), তারা শুধু `--component-button-variant-primary-bg` override করবে। পুরো theme না বদলিয়ে।

---

## Question 4: এই files থেকে CSS তে কীভাবে convert হবে?

Style Dictionary v4 এই কাজ করে।

**Flow:**

```
JSON files (source)
      ↓
  Style Dictionary reads all JSON
      ↓
  References resolve: {color.gray.50} → #f2f4f5
      ↓
  Transforms run: "Bold" → 700, "16" → 16px
      ↓
  Output formats:
      ├── CSS variables  → dist/css/tokens-light.css
      ├── JS constants   → dist/js/index.js
      └── Tailwind theme → dist/tailwind/theme.css
```

**চালানো:**

```bash
cd packages/tokens
node scripts/build.mjs
```

**Output:**

```css
/* dist/css/tokens-light.css */
:root,
[data-theme="light"] {
  --color-primary-500: #fa8232;
  --semantic-color-action-primary-bg: var(--color-primary-500);
  --component-button-variant-primary-bg: var(
    --semantic-color-action-primary-bg
  );
}

/* dist/css/tokens-dark.css */
[data-theme="dark"] {
  --semantic-color-action-primary-bg: var(--color-primary-400);
}
```

লক্ষ্য করো — CSS variables reference করছে একে অপরকে। `outputReferences: true` এই কারণে।

---

## Question 5: GitHub Primer এর folder structure follow করছি?

হ্যাঁ, কিছুটা। Primer এর pattern:

| Primer              | আমাদের                               |
| ------------------- | ------------------------------------ |
| `primitives/`       | `src/tokens/core/`                   |
| `functional/`       | `src/tokens/semantic/`               |
| Per-component CSS   | `src/tokens/component/`              |
| Co-located tests    | `__tests__/` inside component folder |
| Separate types file | `button.types.ts`                    |

**GitHub Primer এর real structure দেখার link:**
https://github.com/primer/primitives/tree/main/data

**আমরা এখানে আলাদা:** Component folder structure আমরা Radix Primitives এর pattern follow করেছি (co-location) — Primer এর চেয়ে বেশি modern।

---

## Question 6: JSON থেকে CSS হওয়ার পর CSS কোথায় থাকবে?

```
packages/tokens/dist/css/
├── tokens.css          ← এটাই তোমার app এ import করবে
├── tokens-light.css    ← light only
└── tokens-dark.css     ← dark overrides only
```

**App এ use:**

```css
/* packages/react/src/styles/globals.css অথবা app এর main CSS */
@import "@raxora/tokens/css";
```

অথবা JS এ:

```tsx
// app's main entry point
import "@raxora/tokens/css";
```

**`dist/` folder gitignore করো:**

```gitignore
packages/tokens/dist/
packages/react/dist/
```

CI তে `pnpm build` চালালে auto-generate হবে।

---

## Question 7: Token এর test case লিখতে হবে কি?

**হ্যাঁ — কিন্তু tokens এর test আলাদা ধরনের।**

Component test (behavior) নয় — token test হলো **contract test**:

```typescript
// packages/tokens/src/__tests__/tokens.test.ts
import { describe, it, expect } from "vitest";
import * as tokens from "../dist/js/index.js";

describe("Token contracts", () => {
  it("exports primary brand color", () => {
    // তোমার orange brand color সঠিক আছে কিনা
    expect(tokens.colorPrimary500).toBe("#fa8232");
  });

  it("critical semantic tokens are defined", () => {
    // Build করার পরে এই tokens exist করছে কিনা
    expect(tokens.semanticColorActionPrimaryBg).toBeDefined();
    expect(tokens.semanticColorBorderFocus).toBeDefined();
  });

  it("color values are valid hex", () => {
    const hexRegex = /^#[0-9a-fA-F]{3,8}$/;
    Object.entries(tokens).forEach(([name, value]) => {
      if (name.toLowerCase().includes("color") && typeof value === "string") {
        if (value.startsWith("#")) {
          expect(value).toMatch(hexRegex);
        }
      }
    });
  });
});
```

**আর CSS output এর test:**

```typescript
import { readFileSync } from "fs";

describe("CSS output", () => {
  it("generated CSS contains light theme selector", () => {
    const css = readFileSync("dist/css/tokens.css", "utf-8");
    expect(css).toContain('[data-theme="light"]');
    expect(css).toContain('[data-theme="dark"]');
  });

  it("uses CSS variable references, not literal values in semantic layer", () => {
    const css = readFileSync("dist/css/tokens-light.css", "utf-8");
    // Semantic tokens should reference primitives, not hardcode
    expect(css).toMatch(
      /--semantic-color-action-primary-bg:\s*var\(--color-primary/,
    );
  });
});
```

---

## Question 8: Button folder এ কী কী file থাকবে?

```
packages/react/src/components/button/
│
├── button.tsx              ← Main component
│   কী আছে: forwardRef, Slot integration, data-* attributes,
│            loading state, icons, aria-busy
│
├── button.types.ts         ← TypeScript types
│   কী আছে: ButtonVariant, ButtonSize, ButtonOwnProps, ButtonProps
│
├── button.module.css       ← Scoped styles (CSS Modules)
│   কী আছে: .button base, variants via [data-variant], sizes,
│            states (hover, active, disabled, loading),
│            reduced motion media query
│
├── button.stories.tsx      ← Storybook stories
│   কী আছে: AllVariants, AllSizes, Loading, Disabled, AsLink,
│            play functions for interaction tests
│
├── index.ts                ← Public barrel
│   কী আছে: export { Button }, export type { ButtonProps, ... }
│
└── __tests__/
    ├── button.test.tsx      ← Unit + behavior tests (Vitest + RTL)
    │   কী আছে: rendering, interaction, disabled, loading, icons, asChild
    └── button.a11y.test.tsx ← axe accessibility tests
        কী আছে: all variants, loading, disabled, icon-only with/without label
```

**কোন file এ কী থাকা উচিত না:**

- `button.tsx` তে CSS class name string কোনো logic নেই (সব `data-*` attribute)
- `button.module.css` তে raw color values নেই (সব `var(--token-name)`)
- `button.types.ts` এ implementation নেই, শুধু types

---

## Question 9: CSS tokens আর component কীভাবে connect করবো?

এটাই সবচেয়ে important প্রশ্ন।

**Step 1:** Token build চালাও

```bash
pnpm build:tokens
# Output: packages/tokens/dist/css/tokens.css
```

**Step 2:** App এর entry point এ import করো

```tsx
// apps/your-app/src/main.tsx অথবা index.tsx
import "@raxora/tokens/css"; // এটাই সব CSS variables load করে
```

**Step 3:** React package configure করো dependency

```json
// packages/react/package.json
{
  "dependencies": {
    "@raxora/tokens": "workspace:*"
  }
}
```

**Step 4:** Component এর CSS এ শুধু tokens reference করো

```css
/* button.module.css */
.button[data-variant="primary"] {
  /* Fallback chain: component token → semantic token → raw value */
  background-color: var(
    --component-button-variant-primary-bg,
    /* component level */
    var(
        --semantic-color-action-primary-bg,
        /* semantic level */
        var(--color-primary-500, /* primitive level */ #fa8232)
      )
      /* hardcoded fallback */
  );
}
```

**কেন এই fallback chain:**

- `--component-button-variant-primary-bg` দেখবে — specific button override
- না থাকলে `--semantic-color-action-primary-bg` — theme level
- না থাকলে `--color-primary-500` — raw primitive
- তারপরও না থাকলে `#fa8232` — last resort

**Theme toggle:**

```tsx
// কোনো component এ
function ThemeToggle() {
  const toggle = () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme") ?? "light";
    html.setAttribute("data-theme", current === "light" ? "dark" : "light");
  };
  return <button onClick={toggle}>Toggle Theme</button>;
}
```

HTML এ `data-theme="dark"` set হলে সব `--semantic-*` variables dark values এ override হয়। তোমার component code কিছু জানে না।

---

## Question 10: Primitive core component কী কী?

এই primitives ই হলো building blocks — components এর components:

### 1. Slot (`_primitives/slot/slot.tsx`)

`asChild` pattern implement করে। Consumer এর child element কে button এর মতো behave করায়।

```tsx
// Consumer writes:
<Button asChild>
  <a href="/home">Go home</a>  ← এটা button হয়ে যাবে
</Button>

// DOM এ:
<a href="/home" class="button-classes" type="button">Go home</a>
```

### 2. VisuallyHidden (`_primitives/visually-hidden/`)

Screen reader accessible কিন্তু visually invisible।

```tsx
<Button iconStart={<TrashIcon />}>
  <VisuallyHidden>Delete item</VisuallyHidden> ← SR reads this
</Button>
```

### 3. Portal (`_primitives/portal/portal.tsx`)

React tree এর বাইরে DOM এ render করে। Dialog, Tooltip, Dropdown এ দরকার।

```tsx
// Dialog এর content body এর directly child হবে
<Portal>
  <div role="dialog">...</div>
</Portal>
```

### 4. FocusTrap (Dialog week এ লাগবে)

Modal open থাকলে keyboard focus ভেতরে আটকে রাখে।

### 5. DismissableLayer (Dialog week এ লাগবে)

Click outside / Escape press এ dismiss করে।

---

## Question 11: Production level এর জন্য আর কী দরকার?

### GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build:tokens
      - run: pnpm typecheck
      - run: pnpm test --coverage
      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_TOKEN }}
          onlyChanged: true
```

### Changeset versioning

```bash
pnpm add -D @changesets/cli -w
pnpm changeset init
```

### `.gitignore`

```
packages/*/dist/
packages/*/node_modules/
node_modules/
*.local
```

### ADR (Architecture Decision Records)

```
docs/adrs/
├── 001-monorepo-pnpm-workspaces.md
├── 002-token-3-layer-architecture.md
├── 003-css-modules-over-tailwind.md
└── 004-slot-asChild-pattern.md
```

---

## Token → CSS → Component: Complete Data Flow

```
Figma Variables
     ↓  (Tokens Studio export)
colors.json
     ↓  (restructure)
core/color.json
     ↓  (reference in)
semantic/light.json  +  semantic/dark.json
     ↓  (reference in)
component/button.json
     ↓  (Style Dictionary build)
dist/css/tokens.css
     │
     │  CSS custom properties:
     │    --color-primary-500: #fa8232
     │    --semantic-color-action-primary-bg: var(--color-primary-500)
     │    --component-button-variant-primary-bg: var(--semantic-...)
     │
     ↓  (imported in app)
button.module.css
     │
     │    background-color: var(--component-button-variant-primary-bg, ...)
     │
     ↓  (used in)
button.tsx
     │
     │    <button data-variant="primary" className={styles.button}>
     │
     ↓  (tests)
button.test.tsx + button.a11y.test.tsx
     ↓  (stories)
button.stories.tsx
     ↓  (CI)
Chromatic visual regression
```

---

## Quick Start

```bash
# 1. Repo clone করার পর
pnpm install

# 2. Tokens build করো
pnpm build:tokens

# 3. Tests চালাও
pnpm test

# 4. Storybook চালাও (docs app setup হলে)
pnpm dev
```

**Colors কীভাবে update করবে:**

1. Figma এ color change করো
2. Tokens Studio দিয়ে export করো নতুন JSON
3. `core/color.json` এ paste করো
4. `pnpm build:tokens` চালাও
5. সব auto-update হবে — component code change করতে হবে না

---

## পরের Component — এই template follow করো

Button বানানোর পরে Input বানাতে হলে:

```
packages/react/src/components/input/
├── input.tsx
├── input.types.ts
├── input.module.css
├── input.stories.tsx
├── index.ts
└── __tests__/
    ├── input.test.tsx
    └── input.a11y.test.tsx
```

আর `packages/tokens/src/tokens/component/input.json` এ Input এর component tokens।

একই pattern, বারবার। এটাই design system এর শক্তি।
