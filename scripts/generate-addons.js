#!/usr/bin/env node
/**
 * Addon bridge generator for Anemonet Brand Design tokens
 *
 * Reads dist/css/tokens.css and generates:
 *   - dist/addons/tailwind-bridge.css  — Tailwind v4 @theme mapping
 *   - dist/addons/nuxtui-bridge.css    — @nuxt/ui variable mapping
 *
 * Called by: npm run build:addons
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Read and parse dist/css/tokens.css
// ---------------------------------------------------------------------------

const tokensCssPath = path.join(rootDir, 'dist/css/tokens.css');

if (!fs.existsSync(tokensCssPath)) {
  console.error('❌ dist/css/tokens.css not found. Run `npm run build` first.');
  process.exit(1);
}

const tokensCss = fs.readFileSync(tokensCssPath, 'utf-8');

/**
 * Parse CSS custom property declarations from a CSS string.
 * Returns an array of { name, value } objects.
 * @param {string} css
 * @returns {{ name: string; value: string }[]}
 */
function parseCssVars(css) {
  const vars = [];
  // Match --anm-xxx: value; lines
  const re = /^\s*(--anm-[a-zA-Z0-9_-]+)\s*:\s*(.+?)\s*;/gm;
  let m;
  while ((m = re.exec(css)) !== null) {
    vars.push({ name: m[1], value: m[2] });
  }
  return vars;
}

const allVars = parseCssVars(tokensCss);

// ---------------------------------------------------------------------------
// Categorise tokens
// ---------------------------------------------------------------------------

/** @param {string} name */
const isColor = (name) => name.startsWith('--anm-color-');
/** @param {string} name */
const isSpace = (name) => name.startsWith('--anm-space-');
/** @param {string} name */
const isFontFamily = (name) => name.startsWith('--anm-font-family-') || name.startsWith('--anm-font-sans') || name.startsWith('--anm-font-mono') || name.startsWith('--anm-font-jp');
/** @param {string} name */
const isFontSize = (name) => name.startsWith('--anm-text-') && name.endsWith('-size');
/** @param {string} name */
const isRadius = (name) => name.startsWith('--anm-radius-');
/** @param {string} name */
const isShadow = (name) => name.startsWith('--anm-shadow-');

// ---------------------------------------------------------------------------
// Generate Tailwind v4 bridge
// ---------------------------------------------------------------------------

function generateTailwindBridge(vars) {
  const lines = [];

  lines.push('/*');
  lines.push(' * Anemonet Brand Design — Tailwind v4 Bridge');
  lines.push(' * Maps --anm-* tokens into Tailwind v4 @theme namespace.');
  lines.push(' * Usage: @import "@anemonet/brand-design/addons/tailwind";');
  lines.push(' */');
  lines.push('');
  lines.push('@theme {');

  // Colors: --anm-color-primary-50 → --color-anm-primary-50
  const colorVars = vars.filter((v) => isColor(v.name));
  if (colorVars.length) {
    lines.push('  /* Colors */');
    for (const { name } of colorVars) {
      // --anm-color-primary-50 → --color-anm-primary-50
      const twName = name.replace(/^--anm-color-/, '--color-anm-');
      lines.push(`  ${twName}: var(${name});`);
    }
    lines.push('');
  }

  // Font families
  const fontFamilyVars = vars.filter((v) => isFontFamily(v.name));
  if (fontFamilyVars.length) {
    lines.push('  /* Font Families */');
    for (const { name } of fontFamilyVars) {
      // --anm-font-family-sans → --font-family-anm-sans
      // --anm-font-sans → --font-family-anm-sans (alias)
      let twName;
      if (name.startsWith('--anm-font-family-')) {
        twName = name.replace(/^--anm-font-family-/, '--font-family-anm-');
      } else {
        twName = name.replace(/^--anm-font-/, '--font-family-anm-');
      }
      lines.push(`  ${twName}: var(${name});`);
    }
    lines.push('');
  }

  // Font sizes
  const fontSizeVars = vars.filter((v) => isFontSize(v.name));
  if (fontSizeVars.length) {
    lines.push('  /* Font Sizes */');
    for (const { name } of fontSizeVars) {
      // --anm-text-base-size → --text-anm-base
      const twName = name.replace(/^--anm-text-/, '--text-anm-').replace(/-size$/, '');
      lines.push(`  ${twName}: var(${name});`);
    }
    lines.push('');
  }

  // Spacing: --anm-space-4 → --spacing-anm-4
  const spaceVars = vars.filter((v) => isSpace(v.name));
  if (spaceVars.length) {
    lines.push('  /* Spacing */');
    for (const { name } of spaceVars) {
      const twName = name.replace(/^--anm-space-/, '--spacing-anm-');
      lines.push(`  ${twName}: var(${name});`);
    }
    lines.push('');
  }

  // Border radius: --anm-radius-md → --radius-anm-md
  const radiusVars = vars.filter((v) => isRadius(v.name));
  if (radiusVars.length) {
    lines.push('  /* Border Radius */');
    for (const { name } of radiusVars) {
      const twName = name.replace(/^--anm-radius-/, '--radius-anm-');
      lines.push(`  ${twName}: var(${name});`);
    }
    lines.push('');
  }

  // Shadows: --anm-shadow-lg → --shadow-anm-lg
  const shadowVars = vars.filter((v) => isShadow(v.name));
  if (shadowVars.length) {
    lines.push('  /* Shadows */');
    for (const { name } of shadowVars) {
      const twName = name.replace(/^--anm-shadow-/, '--shadow-anm-');
      lines.push(`  ${twName}: var(${name});`);
    }
    lines.push('');
  }

  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Generate @nuxt/ui bridge
// ---------------------------------------------------------------------------

function generateNuxtUiBridge(vars) {
  const lines = [];

  lines.push('/*');
  lines.push(' * Anemonet Brand Design — @nuxt/ui Bridge');
  lines.push(' * Maps --anm-* tokens to @nuxt/ui CSS variable conventions.');
  lines.push(' * Usage: @import "@anemonet/brand-design/addons/nuxtui";');
  lines.push(' */');
  lines.push('');
  lines.push(':root {');

  // Primary color mappings — nuxt/ui expects --ui-primary and scale variants
  lines.push('  /* Primary */');

  // Find primary variants
  const primaryVars = vars.filter((v) => v.name.startsWith('--anm-color-primary-'));
  for (const { name } of primaryVars) {
    // --anm-color-primary-600 → --ui-color-primary-600
    const step = name.replace('--anm-color-primary-', '');
    if (step === '600' || step === 'default') {
      // The main UI primary
      lines.push(`  --ui-primary: var(${name});`);
    }
    lines.push(`  --ui-color-primary-${step}: var(${name});`);
  }
  lines.push('');

  // Neutral
  const neutralVars = vars.filter((v) => v.name.startsWith('--anm-color-neutral-'));
  if (neutralVars.length) {
    lines.push('  /* Neutral */');
    for (const { name } of neutralVars) {
      const step = name.replace('--anm-color-neutral-', '');
      lines.push(`  --ui-color-neutral-${step}: var(${name});`);
    }
    lines.push('');
  }

  // Semantic text colors
  const textVars = vars.filter((v) => v.name.startsWith('--anm-color-text-'));
  if (textVars.length) {
    lines.push('  /* Text */');
    for (const { name } of textVars) {
      const role = name.replace('--anm-color-text-', '');
      lines.push(`  --ui-text-${role}: var(${name});`);
    }
    lines.push('');
  }

  // Semantic background colors
  const bgVars = vars.filter((v) => v.name.startsWith('--anm-color-bg-'));
  if (bgVars.length) {
    lines.push('  /* Backgrounds */');
    for (const { name } of bgVars) {
      const role = name.replace('--anm-color-bg-', '');
      lines.push(`  --ui-bg-${role}: var(${name});`);
    }
    lines.push('');
  }

  // Status: error, warning, success, info
  for (const status of ['error', 'warning', 'success', 'info']) {
    const statusVars = vars.filter((v) => v.name.startsWith(`--anm-color-${status}-`));
    if (statusVars.length) {
      lines.push(`  /* ${status.charAt(0).toUpperCase() + status.slice(1)} */`);
      for (const { name } of statusVars) {
        const variant = name.replace(`--anm-color-${status}-`, '');
        lines.push(`  --ui-color-${status}-${variant}: var(${name});`);
      }
      lines.push('');
    }
  }

  // Font families
  const fontFamilyVars = vars.filter((v) => isFontFamily(v.name));
  if (fontFamilyVars.length) {
    lines.push('  /* Typography */');
    for (const { name } of fontFamilyVars) {
      const role = name.replace(/^--anm-font-(family-)?/, '');
      lines.push(`  --ui-font-${role}: var(${name});`);
    }
    lines.push('');
  }

  // Border radius
  const radiusVars = vars.filter((v) => isRadius(v.name));
  if (radiusVars.length) {
    lines.push('  /* Radius */');
    for (const { name } of radiusVars) {
      const size = name.replace('--anm-radius-', '');
      lines.push(`  --ui-radius-${size}: var(${name});`);
    }
    lines.push('');
  }

  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Write output files
// ---------------------------------------------------------------------------

const addonsDir = path.join(rootDir, 'dist/addons');
fs.mkdirSync(addonsDir, { recursive: true });

const tailwindOut = path.join(addonsDir, 'tailwind-bridge.css');
const nuxtUiOut = path.join(addonsDir, 'nuxtui-bridge.css');

console.log('Generating addon bridges...\n');

const tailwindContent = generateTailwindBridge(allVars);
fs.writeFileSync(tailwindOut, tailwindContent, 'utf-8');
console.log(`✓ dist/addons/tailwind-bridge.css (${allVars.filter((v) => isColor(v.name) || isSpace(v.name) || isFontFamily(v.name) || isFontSize(v.name) || isRadius(v.name) || isShadow(v.name)).length} tokens)`);

const nuxtUiContent = generateNuxtUiBridge(allVars);
fs.writeFileSync(nuxtUiOut, nuxtUiContent, 'utf-8');
console.log(`✓ dist/addons/nuxtui-bridge.css`);

console.log('\n✅ Addon bridges generated successfully.');
