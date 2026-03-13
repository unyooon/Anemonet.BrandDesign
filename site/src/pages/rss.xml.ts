import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

/**
 * @description RSS フィードを生成するエンドポイント
 * - /rss.xml でアクセス可能
 * - ドラフトを除いた全記事を公開日降順で出力する
 * @param context - Astro の API コンテキスト（site URL の取得に使用）
 * @returns RSS フィードのレスポンス
 */
export async function GET(context: APIContext) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );

  return rss({
    title: "Anemonet Blog",
    description: "AI駆動開発、デザインシステム、Web開発の知見を発信します。",
    site: context.site!.toString(),
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.description,
      link: `/blog/${post.id}/`
    }))
  });
}
