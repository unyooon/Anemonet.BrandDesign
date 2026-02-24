# Anemonet.BrandDesign — Project Conventions

## Overview

Anemonetブランドのデザインシステム。全システム開発プロジェクトに統一的に適用される。
ブランド名はアネモネ（花）× net（ネットワーク/システム開発）に由来。

## Architecture

### Core Principle: Framework-Agnostic

- **コア**: CSS Custom Properties (`--anm-*`) + Vanilla CSS — Tailwind に依存しない
- **ブリッジ**: Tailwind / @nuxt/ui / shadcn/ui 向けの Optional Addon
- **トークン変換**: Style Dictionary v4 (JSON → CSS / SCSS / JS / JSON)
- **ドキュメントサイト**: Vite + Vanilla HTML/CSS/JS（フレームワーク不使用）

### 鉄則

- `@apply` 使用禁止（Tailwind ロックイン防止）
- コアに Tailwind クラス直書き禁止
- トークン値は常に `--anm-*` 変数から取得
- dist/ は git 管理に含める（消費側のビルド不要化）

## Brand Guidelines

### Colors

| Token | HEX | Usage |
|---|---|---|
| Primary Default | `#5C38C0` | CTA, links, active states |
| Primary Tint 1-3 | (Scale生成) | Hover, soft accent, highlight |
| Primary Deep | (Scale生成) | Press state, dark theme CTA |

- Neutral: 11段階 gray scale
- Status: Error / Warning / Success / Info 各5階調
- Light / Dark 両モード対応 (`[data-theme="dark"]`)

### Typography

| Role | Font | Weights |
|---|---|---|
| Latin (UI) | Inter | 400 / 500 / 600 / 700 |
| Japanese | Noto Sans JP | 400 / 500 / 700 |
| Code | JetBrains Mono | 400 / 700 (ligatures OFF) |

### Type Scale (Base: 16px = 1rem)

| Level | Size | Weight | Line-height |
|---|---|---|---|
| Display | 36px | Bold 700 | 1.20 |
| H1 | 30px | Bold 700 | 1.25 |
| H2 | 24px | SemiBold 600 | 1.30 |
| H3 | 20px | SemiBold 600 | 1.35 |
| Large | 18px | Regular 400 | 1.50 |
| Base | 16px | Regular 400 | 1.60 |
| Small | 14px | Regular 400 | 1.50 |
| XXSmall | 12px | Regular 400 | 1.45 |

### Spacing (4px base)

4, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Token Naming

```
--anm-{category}-{name}-{variant}

Examples:
  --anm-color-primary-default
  --anm-color-text-heading
  --anm-color-bg-page
  --anm-space-4
  --anm-radius-md
  --anm-shadow-lg
  --anm-font-sans
  --anm-text-base-size
```

### Visual Tone

Elegant Modern — "Organic Precision"（有機的精密さ）

### Accessibility

- WCAG 2.1 AA 必須、AAA 推奨
- テキスト: コントラスト比 4.5:1 以上
- 大テキスト: コントラスト比 3:1 以上
- フォーカスリング: 必ず表示、2px 以上
- 色のみに依存しない情報設計

## Directory Structure

```
Anemonet.BrandDesign/
├── CLAUDE.md
├── package.json              # @anemonet/brand-design
├── .gitignore
│
├── tokens/                   # Source of Truth (JSON)
│   ├── base/
│   │   ├── color.json
│   │   ├── typography.json
│   │   ├── spacing.json
│   │   ├── radius.json
│   │   ├── shadow.json
│   │   └── transition.json
│   ├── semantic/
│   │   ├── color-light.json
│   │   ├── color-dark.json
│   │   ├── typography.json
│   │   └── component.json
│   └── config.js
│
├── dist/                     # Built outputs (git-tracked)
│   ├── css/
│   │   ├── tokens.css        # --anm-* CSS Custom Properties
│   │   ├── tokens-dark.css   # [data-theme="dark"] overrides
│   │   └── utilities.css     # Alert/Badge/Card/Button classes
│   ├── scss/
│   │   └── _tokens.scss
│   ├── js/
│   │   ├── tokens.js
│   │   ├── tokens.cjs
│   │   └── tokens.d.ts
│   ├── json/
│   │   └── tokens.json
│   └── addons/
│       ├── tailwind-bridge.css   # @theme mapping (optional)
│       └── nuxtui-bridge.css     # @nuxt/ui mapping (optional)
│
├── docs/                     # Documentation site (Vite + vanilla)
│   ├── index.html
│   ├── styles/
│   │   └── docs.css
│   ├── scripts/
│   │   └── docs.js
│   └── vite.config.ts
│
└── scripts/
    ├── build-tokens.js
    └── generate-addons.js
```

## Commands

```bash
npm run build          # Build tokens → dist/
npm run dev:docs       # Start doc site dev server
npm run build:docs     # Build doc site for production
npm run preview:docs   # Preview built doc site
```

## Consumption Patterns

### Any project (CSS)
```css
@import "@anemonet/brand-design/css";
@import "@anemonet/brand-design/css/dark";
```

### Tailwind v4 project (optional)
```css
@import "tailwindcss";
@import "@anemonet/brand-design/css";
@import "@anemonet/brand-design/addons/tailwind";
```

### SCSS project
```scss
@use "@anemonet/brand-design/scss" as anm;
```

### TypeScript
```ts
import { colors, typography, spacing } from "@anemonet/brand-design";
```
