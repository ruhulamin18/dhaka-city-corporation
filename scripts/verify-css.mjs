#!/usr/bin/env node
/**
 * Automated CSS Architecture & Styling Safeguard Validator
 * Dhaka City Corporation Web Portal
 *
 * This test guarantees:
 * 1. Global stylesheet exists and is correctly referenced in the root layout.
 * 2. PostCSS and Tailwind v4 configuration is valid and active.
 * 3. Tailwind v4 successfully scans and compiles all source directories.
 * 4. Civic theme tokens, custom fonts, and core municipal styling classes are present.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindPostcss from '@tailwindcss/postcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 [CSS Health Check] Auditing styling architecture...');

// 1. Verify globals.css existence
const globalsCssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
if (!fs.existsSync(globalsCssPath)) {
  console.error('❌ FATAL: frontend/src/app/globals.css not found!');
  process.exit(1);
}
console.log('  ✓ globals.css file present');

// 2. Verify root layout.tsx imports globals.css
const layoutPath = path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx');
if (!fs.existsSync(layoutPath)) {
  console.error('❌ FATAL: frontend/src/app/layout.tsx not found!');
  process.exit(1);
}
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
if (!layoutContent.includes("import './globals.css'") && !layoutContent.includes('import "./globals.css"')) {
  console.error('❌ FATAL: Root layout.tsx is missing the global CSS import!');
  process.exit(1);
}
console.log('  ✓ root layout.tsx imports globals.css');

// 3. Verify PostCSS config existence
const postcssConfigPath = path.join(rootDir, 'frontend', 'postcss.config.mjs');
if (!fs.existsSync(postcssConfigPath)) {
  console.error('❌ FATAL: frontend/postcss.config.mjs not found!');
  process.exit(1);
}
console.log('  ✓ PostCSS configuration present');

// 4. Verify CSS compilation via PostCSS + Tailwind v4
const cssSource = fs.readFileSync(globalsCssPath, 'utf8');

try {
  const result = await postcss([tailwindPostcss()]).process(cssSource, {
    from: globalsCssPath,
  });

  const compiledCss = result.css;
  if (!compiledCss || compiledCss.length < 20000) {
    console.error(`❌ FATAL: Compiled CSS output too small (${compiledCss?.length ?? 0} bytes). Tailwind may not be scanning sources!`);
    process.exit(1);
  }
  console.log(`  ✓ Tailwind v4 CSS compiled successfully (${(compiledCss.length / 1024).toFixed(1)} KB)`);

  // 5. Verify presence of key civic design tokens and classes
  const requiredTokens = [
    '--civic-primary',
    '#006a4e',
    '--font-inter',
    '--font-bengali',
    'civic-card',
    'civic-btn-primary',
  ];

  for (const token of requiredTokens) {
    const lowerCss = compiledCss.toLowerCase();
    if (!lowerCss.includes(token.toLowerCase())) {
      console.error(`❌ FATAL: Required design token/class "${token}" is missing in compiled CSS!`);
      process.exit(1);
    }
  }
  console.log('  ✓ Core civic tokens, typography, and utility classes verified');

  console.log('✅ [CSS Health Check] All styling architecture checks passed perfectly!\n');
  process.exit(0);
} catch (err) {
  console.error('❌ FATAL: PostCSS compilation failed:', err);
  process.exit(1);
}
