import { getTransforms, register } from "@tokens-studio/sd-transforms";
import { promises as fs } from "fs";
import { dirname, join } from "path";
import StyleDictionary from "style-dictionary";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src/tokens");
const DIST = join(ROOT, "dist");

// Register Tokens Studio transforms + preprocessors
register(StyleDictionary);

// Register custom transform groups
// ts/css  = TS transforms + kebab names  (for CSS vars: --color-primary-500)
// ts/js   = TS transforms + camel names  (for JS:  colorPrimary500)
const tsTransforms = getTransforms({ excludes: [] });
StyleDictionary.registerTransformGroup({
  name: "ts/css",
  transforms: [...tsTransforms, "name/kebab"],
});
StyleDictionary.registerTransformGroup({
  name: "ts/js",
  transforms: [...tsTransforms, "name/camel"],
});

// Tailwind v4 @theme format
StyleDictionary.registerFormat({
  name: "css/tailwind-theme",
  format({ dictionary }) {
    const lines = [
      "/** Tailwind v4 @theme — auto-generated */",
      "",
      "@theme {",
    ];
    dictionary.allTokens.forEach((token) => {
      const val = token.$value ?? token.value;
      if (val === undefined || val === null || typeof val === "object") return;
      lines.push(`  --${token.name}: ${val};`);
    });
    lines.push("}", "");
    return lines.join("\n");
  },
});

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function buildLight() {
  console.log("\n☀️  Light theme...");
  const sd = new StyleDictionary({
    source: [
      `${SRC}/core/**/*.json`,
      `${SRC}/semantic/light.json`,
      `${SRC}/component/**/*.json`,
    ],
    preprocessors: ["tokens-studio"],
    log: { verbosity: "silent" },
    platforms: {
      css: {
        transformGroup: "ts/css",
        buildPath: `${DIST}/css/`,
        files: [
          {
            destination: "tokens-light.css",
            format: "css/variables",
            options: {
              outputReferences: true,
              selector: ':root, [data-theme="light"]',
            },
          },
        ],
      },
      js: {
        transformGroup: "ts/js",
        buildPath: `${DIST}/js/`,
        files: [
          { destination: "index.js", format: "javascript/es6" },
          { destination: "index.d.ts", format: "typescript/es6-declarations" },
        ],
      },
      tailwind: {
        transformGroup: "ts/css",
        buildPath: `${DIST}/tailwind/`,
        files: [
          {
            destination: "theme.css",
            format: "css/tailwind-theme",
            options: { outputReferences: false },
          },
        ],
      },
    },
  });
  await sd.buildAllPlatforms();
  console.log("   ✓ tokens-light.css  ✓ index.js  ✓ index.d.ts  ✓ theme.css");
}

async function buildDark() {
  console.log("\n🌙 Dark theme...");
  const sd = new StyleDictionary({
    source: [`${SRC}/core/**/*.json`, `${SRC}/semantic/dark.json`],
    preprocessors: ["tokens-studio"],
    log: { verbosity: "silent" },
    platforms: {
      css: {
        transformGroup: "ts/css",
        buildPath: `${DIST}/css/`,
        files: [
          {
            destination: "tokens-dark.css",
            format: "css/variables",
            filter: (token) =>
              Boolean(token.filePath?.includes("semantic/dark")),
            options: {
              outputReferences: true,
              selector: '[data-theme="dark"]',
            },
          },
        ],
      },
    },
  });
  await sd.buildAllPlatforms();
  console.log("   ✓ tokens-dark.css");
}

async function combine() {
  console.log("\n🔗 Combining...");
  const [light, dark] = await Promise.all([
    fs.readFile(`${DIST}/css/tokens-light.css`, "utf8"),
    fs.readFile(`${DIST}/css/tokens-dark.css`, "utf8"),
  ]);
  const banner =
    '/**\n * @raxora/tokens\n * Auto-generated. Do not edit.\n * Dark mode: <html data-theme="dark">\n */\n\n';
  await fs.writeFile(
    `${DIST}/css/tokens.css`,
    banner + light.trim() + "\n\n" + dark.trim() + "\n",
    "utf8",
  );
  console.log("   ✓ tokens.css");
}

async function main() {
  const t = Date.now();
  console.log("🏗  Building tokens...\n" + "=".repeat(44));
  await Promise.all([
    ensureDir(`${DIST}/css`),
    ensureDir(`${DIST}/js`),
    ensureDir(`${DIST}/tailwind`),
  ]);
  await buildLight();
  await buildDark();
  await combine();
  console.log(`\n${"=".repeat(44)}\n✅ Done in ${Date.now() - t}ms`);
  console.log("\n📦 Outputs:");
  console.log("   dist/css/tokens.css      ← import in your app");
  console.log("   dist/js/index.js         ← JS constants");
  console.log("   dist/tailwind/theme.css  ← Tailwind v4\n");
}

main().catch((err) => {
  console.error("\n❌", err.message);
  process.exit(1);
});
