#!/usr/bin/env node
/**
 * Build script for Anemonet Brand Design tokens
 *
 * Runs Style Dictionary v4 to generate all dist/ outputs.
 * Called by: npm run build
 */

import { buildMain, buildDark } from '../tokens/config.js';

async function main() {
  console.log('Building Anemonet design tokens...\n');

  try {
    console.log('▶ Building main tokens (light mode)...');
    await buildMain();
    console.log('✓ Main tokens built.\n');

    console.log('▶ Building dark mode overrides...');
    await buildDark();
    console.log('✓ Dark tokens built.\n');

    console.log('✅ All tokens built successfully.');
    console.log('   dist/css/tokens.css');
    console.log('   dist/css/tokens-dark.css');
    console.log('   dist/scss/_tokens.scss');
    console.log('   dist/js/tokens.js');
    console.log('   dist/js/tokens.cjs');
    console.log('   dist/js/tokens.d.ts');
    console.log('   dist/json/tokens.json');
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

main();
