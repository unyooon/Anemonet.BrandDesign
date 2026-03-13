import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    /** 記事タイトル (60文字以内) */
    title: z.string().max(60),
    /** 記事の説明文 (155文字以内、OGP・meta description に使用) */
    description: z.string().max(155),
    /** 公開日 */
    publishedAt: z.coerce.date(),
    /** 最終更新日 (省略可) */
    updatedAt: z.coerce.date().optional(),
    /** タグ一覧 */
    tags: z.array(z.string()).default([]),
    /** OGP 画像パス (省略可) */
    ogImage: z.string().optional(),
    /** 下書きフラグ (true の場合は公開しない) */
    draft: z.boolean().default(false)
  })
});

export const collections = { blog };
