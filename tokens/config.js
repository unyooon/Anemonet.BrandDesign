/**
 * Style Dictionary v4 configuration for Anemonet Brand Design System
 *
 * Outputs:
 *   - dist/css/tokens.css        — :root CSS custom properties (--anm-*)
 *   - dist/css/tokens-dark.css   — [data-theme="dark"] overrides
 *   - dist/scss/_tokens.scss     — $anm-* SCSS variables
 *   - dist/js/tokens.js          — ESM named exports
 *   - dist/js/tokens.cjs         — CommonJS named exports
 *   - dist/js/tokens.d.ts        — TypeScript declarations
 *   - dist/json/tokens.json      — Flat JSON
 */

import StyleDictionary from 'style-dictionary';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Filter: exclude semantic/color-dark.json tokens (path starts with "color"
 * and comes from the dark source).  We use a source-file approach instead
 * so the dark platform only sources dark tokens.
 */

// ---------------------------------------------------------------------------
// Shared platform base options
// ---------------------------------------------------------------------------

const prefix = 'anm';

// ---------------------------------------------------------------------------
// Build: main (light) — all tokens except dark semantic overrides
// ---------------------------------------------------------------------------

export async function buildMain() {
  const sd = new StyleDictionary({
    // Base tokens + semantic light tokens
    source: [
      'tokens/base/**/*.json',
      'tokens/semantic/color-light.json',
      'tokens/semantic/typography.json',
      'tokens/semantic/component.json',
    ],
    platforms: {
      // ------------------------------------------------------------------
      // CSS — :root custom properties
      // ------------------------------------------------------------------
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: 'dist/css/',
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables',
            options: {
              selector: ':root',
              outputReferences: false,
            },
          },
        ],
      },

      // ------------------------------------------------------------------
      // SCSS — $anm-* variables
      // ------------------------------------------------------------------
      scss: {
        transformGroup: 'scss',
        prefix,
        buildPath: 'dist/scss/',
        files: [
          {
            destination: '_tokens.scss',
            format: 'scss/variables',
            options: {
              outputReferences: false,
            },
          },
        ],
      },

      // ------------------------------------------------------------------
      // JavaScript ESM — named exports
      // ------------------------------------------------------------------
      jsEsm: {
        transformGroup: 'js',
        prefix,
        buildPath: 'dist/js/',
        files: [
          {
            destination: 'tokens.js',
            format: 'javascript/es6',
          },
        ],
      },

      // ------------------------------------------------------------------
      // JavaScript CJS — CommonJS
      // ------------------------------------------------------------------
      jsCjs: {
        transformGroup: 'js',
        prefix,
        buildPath: 'dist/js/',
        files: [
          {
            destination: 'tokens.cjs',
            format: 'javascript/module-flat',
          },
        ],
      },

      // ------------------------------------------------------------------
      // TypeScript declarations
      // ------------------------------------------------------------------
      ts: {
        transformGroup: 'js',
        prefix,
        buildPath: 'dist/js/',
        files: [
          {
            destination: 'tokens.d.ts',
            format: 'typescript/es6-declarations',
          },
        ],
      },

      // ------------------------------------------------------------------
      // JSON — flat
      // ------------------------------------------------------------------
      json: {
        transformGroup: 'js',
        prefix,
        buildPath: 'dist/json/',
        files: [
          {
            destination: 'tokens.json',
            format: 'json/flat',
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}

// ---------------------------------------------------------------------------
// Build: dark — only semantic dark overrides, output [data-theme="dark"]
// ---------------------------------------------------------------------------

export async function buildDark() {
  const sd = new StyleDictionary({
    // Base tokens included for reference resolution only; not emitted
    include: ['tokens/base/**/*.json'],
    // Only the dark semantic color overrides are treated as source (output)
    source: ['tokens/semantic/color-dark.json'],
    platforms: {
      cssDark: {
        transformGroup: 'css',
        prefix,
        buildPath: 'dist/css/',
        files: [
          {
            destination: 'tokens-dark.css',
            format: 'css/variables',
            // Only emit tokens that came from the source (dark file), not include
            filter: (token) => token.isSource === true,
            options: {
              selector: '[data-theme="dark"]',
              outputReferences: false,
            },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}
