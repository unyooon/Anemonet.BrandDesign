---
title: "CSS Custom Properties でデザイントークンを管理する"
description: "Anemonet のデザインシステムにおけるトークン設計の考え方と、CSS Custom Properties を活用した実装方法を解説します。"
publishedAt: 2026-03-14
tags: ["design-system", "css"]
draft: false
---

## デザイントークンとは

デザイントークンとは、色・余白・フォントサイズなどのデザイン上の決定を、構造化されたデータとして管理する仕組みです。

Anemonet では、すべてのデザイン値を `--anm-*` プレフィックスの CSS Custom Properties として管理しています。

## トークンの命名規則

```
--anm-{category}-{name}-{variant}
```

例:
- `--anm-color-primary-default` — プライマリカラー
- `--anm-color-text-heading` — 見出しテキストカラー
- `--anm-space-4` — 16px スペーシング
- `--anm-radius-md` — ミディアム角丸

## 実装例

```css
.card {
  background: var(--anm-color-bg-card);
  border-radius: var(--anm-radius-md);
  padding: var(--anm-space-6);
  box-shadow: var(--anm-shadow-md);
  color: var(--anm-color-text-body);
  border: 1px solid var(--anm-color-border-subtle);
}
```

このコードには `white` や `#333` のようなハードコードされた色が一切ありません。すべてがトークン変数を経由しています。これがデザイントークンの本質的な価値です。

## ダークモード対応

### 仕組み

ライトモードのトークンは `:root` に定義し、ダークモードでは `[data-theme="dark"]` セレクタでセマンティックトークンだけを上書きします。

```css
/* tokens.css — ライトモード (デフォルト) */
:root {
  --anm-color-bg-page: #f8f7fd;
  --anm-color-bg-card: #ffffff;
  --anm-color-text-heading: #1c1529;
  --anm-color-text-body: #3e3455;
  --anm-color-border-subtle: #ede9f5;
}

/* tokens-dark.css — ダークモード上書き */
[data-theme="dark"] {
  --anm-color-bg-page: #110e1c;
  --anm-color-bg-card: #1c1830;
  --anm-color-text-heading: #eee9fa;
  --anm-color-text-body: #d0c9e8;
  --anm-color-border-subtle: #2e2947;
}
```

コンポーネント側は `var(--anm-color-bg-card)` としか書いていないので、テーマが切り替わるとトークンの値が自動的に変わり、**コンポーネントのコードは一切変更不要**です。

### メリット

- **コンポーネントの CSS にテーマ分岐が不要** — `@media (prefers-color-scheme: dark)` や `[data-theme="dark"] .card` のような分岐を書く必要がない
- **テーマの追加が容易** — 新しいテーマ（ハイコントラスト等）を追加するときも、トークンの上書きだけで済む
- **一貫性の担保** — 全コンポーネントが同じトークンを参照するので、色のブレが起きない

### Scoped CSS フレームワークでの注意点

Vue や Astro などのコンポーネントフレームワークでは、`<style scoped>`（Vue）や `<style>`（Astro、デフォルトでスコープ付き）を使うことが一般的です。このスコープ機構はスタイルの衝突を防ぐ強力な仕組みですが、**デザイントークンのダークモード切替と相性が悪いケースがあります**。

#### 問題が起きるパターン

テーマ属性（`data-theme="dark"`）は通常 `<html>` 要素に設定されます。しかし、スコープ付きスタイルは**そのコンポーネント内の要素にしかマッチしません**。つまり、コンポーネント外の祖先要素を参照するセレクタが無効になります。

```css
/* これはスコープ付きスタイルでは動かない */
[data-theme="dark"] .my-card {
  background: rgba(20, 18, 30, 0.75);
}
```

`[data-theme="dark"]` は `<html>` 要素（コンポーネントの外）にあるため、Scoped CSS のハッシュ属性セレクタが付与されず、このルールは完全に無視されます。

#### なぜトークンだけなら問題が起きないのか

**CSS Custom Properties（トークン）は CSS のカスケードに従って子孫に継承されます。** `:root` や `[data-theme="dark"]` で定義された変数は、スコープの有無に関係なく、すべての子要素から `var()` で参照できます。

```css
/* スコープ付きでも問題なく動く */
.my-card {
  background: var(--anm-color-bg-card); /* テーマに応じて自動で値が変わる */
  color: var(--anm-color-text-body);
}
```

つまり、**トークン変数だけを使ってスタイルを書いていれば、スコープ付き CSS でもダークモードは自動的に機能します。**

#### 問題が起きるのはどんなとき？

トークン変数では表現できないスタイル——たとえば半透明の背景やグラデーションなど、**テーマごとに異なる `rgba()` 値を直接指定する必要がある場合**に問題が起きます。

```css
/* ガラスモーフィズム: 透過度付きの背景はトークン1つでは表現しにくい */
.glass-card {
  background: rgba(255, 255, 255, 0.6);  /* ← ライトモード専用 */
  backdrop-filter: blur(8px);
}
```

このような場合、`[data-theme="dark"] .glass-card` でダーク用の `rgba()` を指定したくなりますが、スコープ付きでは前述の通り機能しません。

#### 対処法

**対処法 1: グローバルスタイルにする（推奨度: ページ単位なら高い）**

ページコンポーネントなど、スタイルの衝突リスクが低い場合はスコープを外します。

```html
<!-- Astro -->
<style is:global>
  [data-theme="dark"] .glass-card {
    background: rgba(20, 18, 30, 0.6);
  }
</style>

<!-- Vue -->
<style>
  /* scoped を付けない */
  [data-theme="dark"] .glass-card {
    background: rgba(20, 18, 30, 0.6);
  }
</style>
```

- メリット: シンプル、直感的
- デメリット: スタイルの衝突リスク（クラス名の一意性を自分で管理する必要がある）
- 使いどころ: **ページコンポーネント**（1ページに1つしか存在しないのでクラス名衝突のリスクが低い）

**対処法 2: Vue の `:deep()` / Astro の `:global()` を使う**

スコープを維持しつつ、特定のセレクタだけグローバルに抜け出せます。

```html
<!-- Vue (scoped のまま) -->
<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
}
:global([data-theme="dark"]) .glass-card {
  background: rgba(20, 18, 30, 0.6);
}
</style>
```

- メリット: 基本のスコープを維持しつつ、テーマ切替だけ貫通できる
- デメリット: 記法がやや冗長

**対処法 3: テーマ用のカスタムプロパティを追加定義する（最も堅牢）**

半透明背景のような値もトークン化してしまえば、そもそもテーマ分岐セレクタが不要になります。

```css
/* tokens.css */
:root {
  --anm-color-bg-glass: rgba(255, 255, 255, 0.6);
}

/* tokens-dark.css */
[data-theme="dark"] {
  --anm-color-bg-glass: rgba(20, 18, 30, 0.6);
}
```

```css
/* コンポーネント — scoped でも問題なし */
.glass-card {
  background: var(--anm-color-bg-glass);
  backdrop-filter: blur(8px);
}
```

- メリット: **コンポーネントにテーマ分岐が一切不要**、スコープとの相性問題が根本的に解消
- デメリット: トークン定義が増える、透過度のバリエーションが多いと管理コストが上がる
- 使いどころ: **再利用されるコンポーネント**（カード、モーダル等）

### まとめ: どの方法を選ぶべきか

| 状況 | 推奨する対処法 |
|---|---|
| ページ固有のスタイル | 対処法 1（`is:global` / scoped なし） |
| 再利用コンポーネントで部分的にテーマ分岐 | 対処法 2（`:global()` / `:deep()`） |
| デザインシステムとして広く配布する | 対処法 3（トークン追加定義） |

最も重要な原則は、**可能な限りトークン変数だけでスタイルを書く**ことです。`var(--anm-color-bg-card)` のようにトークンを経由していれば、スコープ付き CSS であってもダークモードは自動的に機能します。テーマ分岐セレクタが必要になること自体が、トークンの不足を示すシグナルです。

## まとめ

デザイントークンを CSS Custom Properties で管理することで、フレームワークに依存しない一貫したデザインシステムを構築できます。

さらに、トークンは CSS のカスケードを通じてスコープ付きコンポーネントにも自然に浸透するため、Vue・Astro・Svelte といったモダンフレームワークとの相性も優れています。「色の値をハードコードしない」という一つのルールを徹底するだけで、テーマ切替・スコープ・フレームワーク移行といった課題の大部分が解消されます。
