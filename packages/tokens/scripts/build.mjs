import { getTransforms, register } from "@tokens-studio/sd-transforms";
import { promises as fs } from "fs";
import { dirname, join } from "path";
import StyleDictionary from "style-dictionary";
import { fileURLToPath } from "url";

// Define paths and sources for token files and output directories
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src/tokens");
const DIST = join(ROOT, "dist");
const CSS_DIST = join(DIST, "css");
const THEME_DIST = join(CSS_DIST, "themes");
const JS_DIST = join(DIST, "js");
const TAILWIND_DIST = join(DIST, "tailwind");
const CORE_SOURCE = `${SRC}/core/**/*.json`;
const COMPONENT_SOURCE = `${SRC}/component/**/*.json`;

// Define themes with their corresponding CSS selectors
const THEMES = [
  { name: "light", selector: ':root, [data-color-mode="light"]' },
  { name: "dark", selector: '[data-color-mode="dark"]' },
  { name: "dim", selector: '[data-color-mode="dim"]' },
  { name: "high-contrast-light", selector: '[data-color-mode="hc-light"]' },
  { name: "high-contrast-dark", selector: '[data-color-mode="hc-dark"]' },
];

// Register the transforms with StyleDictionary
register(StyleDictionary, { alwaysAddFontStyle: false });

// Get the transforms from @tokens-studio/sd-transforms, excluding any that are not needed
const tsTransforms = getTransforms({ excludes: [] });

// Register custom transform groups for CSS and JS outputs
StyleDictionary.registerTransformGroup({
  name: "ts/css",
  transforms: [...tsTransforms, "name/kebab"],
});

// For JS, we want camelCase names and to preserve references, so we don't include "ts/resolve-references"
StyleDictionary.registerTransformGroup({
  name: "ts/js",
  transforms: [...tsTransforms, "name/camel"],
});

// Register a custom format for Tailwind themes, which outputs CSS variables in a @theme block
StyleDictionary.registerFormat({
  name: "css/tailwind-theme",
  format({ dictionary }) {
    return [
      "/** Tailwind v4 @theme - auto-generated */",
      "",
      "@theme {",
      ...dictionary.allTokens
        .map((token) => {
          const value = token.$value ?? token.value;
          if (
            value === undefined ||
            value === null ||
            typeof value === "object"
          ) {
            return null;
          }

          return `  --${token.name}: ${value};`;
        })
        .filter(Boolean),
      "}",
      "",
    ].join("\n");
  },
});

// Helper function to create a StyleDictionary instance with the given source and platforms
function createDictionary({ source, platforms }) {
  return new StyleDictionary({
    source,
    preprocessors: ["tokens-studio"],
    log: { verbosity: "silent" },
    platforms,
  });
}

// Build core tokens, which are the base variables used across themes and components
async function buildCoreTokens() {
  console.log("Building core tokens");

  await createDictionary({
    source: [CORE_SOURCE],
    platforms: {
      css: {
        transformGroup: "ts/css",
        buildPath: `${CSS_DIST}/`,
        files: [
          {
            destination: "core.css",
            format: "css/variables",
            options: {
              outputReferences: false,
              selector: ":root",
            },
          },
        ],
      },
      js: {
        transformGroup: "ts/js",
        buildPath: `${JS_DIST}/`,
        files: [
          { destination: "index.js", format: "javascript/es6" },
          { destination: "index.d.ts", format: "typescript/es6-declarations" },
        ],
      },
    },
  }).buildAllPlatforms();

  console.log("Core tokens built");
}

// Build themes by combining core tokens with theme-specific overrides and component tokens
async function buildThemes() {
  for (const theme of THEMES) {
    console.log(`Building ${theme.name} theme`);

    await createDictionary({
      source: [
        CORE_SOURCE,
        `${SRC}/semantic/${theme.name}.json`,
        COMPONENT_SOURCE,
      ],
      platforms: {
        css: {
          transformGroup: "ts/css",
          buildPath: `${THEME_DIST}/`,
          files: [
            {
              destination: `${theme.name}.css`,
              format: "css/variables",
              filter: (token) =>
                Boolean(
                  token.filePath?.includes("semantic/") ||
                  token.filePath?.includes("component/"),
                ),
              options: {
                outputReferences: true,
                selector: theme.selector,
              },
            },
          ],
        },
      },
    }).buildAllPlatforms();

    console.log(`Theme built: ${theme.name}`);
  }
}

// Build a Tailwind theme by combining all tokens and outputting them in a format compatible with Tailwind v4's @theme feature
async function buildTailwindTheme() {
  console.log("Building Tailwind theme");

  await createDictionary({
    source: [CORE_SOURCE, `${SRC}/semantic/light.json`, COMPONENT_SOURCE],
    platforms: {
      tailwind: {
        transformGroup: "ts/css",
        buildPath: `${TAILWIND_DIST}/`,
        files: [
          {
            destination: "theme.css",
            format: "css/tailwind-theme",
            options: { outputReferences: false },
          },
        ],
      },
    },
  }).buildAllPlatforms();

  console.log("Tailwind theme built");
}

// Helper function to create the content of CSS entrypoint files, which import the generated theme styles
function createCssEntrypoint(imports) {
  return `/**
 * @raxora/tokens
 * Auto-generated. Do not edit.
 * Import this file to load the generated theme styles.
 */

${imports.map((file) => `@import "${file}";`).join("\n")}
`;
}

// Write CSS entrypoint files that import the generated theme styles, providing a single entrypoint for users to include in their projects
async function writeCssEntrypoints() {
  console.log("Writing CSS entrypoints");

  await Promise.all([
    fs.writeFile(
      `${DIST}/index.css`,
      createCssEntrypoint(
        THEMES.map((theme) => `./css/themes/${theme.name}.css`),
      ),
      "utf8",
    ),
    fs.writeFile(
      `${CSS_DIST}/tokens.css`,
      createCssEntrypoint(THEMES.map((theme) => `./themes/${theme.name}.css`)),
      "utf8",
    ),
  ]);

  console.log("CSS entrypoints written");
}

// Main function to orchestrate the build process, including building core tokens, themes, Tailwind theme, and writing CSS entrypoints
async function main() {
  const startedAt = Date.now();

  console.log(`Building tokens\n${"=".repeat(44)}`);

  await Promise.all([
    fs.mkdir(CSS_DIST, { recursive: true }),
    fs.mkdir(THEME_DIST, { recursive: true }),
    fs.mkdir(JS_DIST, { recursive: true }),
    fs.mkdir(TAILWIND_DIST, { recursive: true }),
  ]);

  await buildCoreTokens();
  await buildThemes();
  await buildTailwindTheme();
  await writeCssEntrypoints();

  console.log(`\n${"=".repeat(44)}\nDone in ${Date.now() - startedAt}ms`);
  console.log("\nOutputs:");
  console.log("  dist/index.css           root CSS entrypoint");
  console.log("  dist/css/tokens.css      package CSS entrypoint");
  console.log("  dist/css/core.css        core variables");
  console.log("  dist/css/themes/*.css    theme overrides");
  console.log("  dist/js/index.js         JS constants");
  console.log("  dist/tailwind/theme.css  Tailwind v4");
}

// Run the main function and catch any errors, logging them to the console and exiting with a non-zero status code
main().catch((err) => {
  console.error("\n", err.message);
  process.exit(1);
});
