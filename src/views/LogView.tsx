import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { t, type Lang } from "@/i18n";
import { getPosts, getSeries, getSeriesList } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import LogBrowser, { type LogPost, type LogSeries } from "@/components/LogBrowser";

export function logMetadata(lang: Lang): Metadata {
  return pageMetadata({ title: t(lang, "meta.log.title"), description: t(lang, "meta.log.description"), path: "/log", lang });
}

// 기록 페이지 본문 - 한국어 · 영어 페이지가 같이 씀
export default async function LogView({ lang }: { lang: Lang }) {
  const [seriesList, posts] = await Promise.all([getSeriesList(), getPosts()]);

  // 시리즈 필터용 - 글 id 마다 속한 시리즈 id
  const details = await Promise.all(seriesList.map((s) => getSeries(s.slug).catch(() => null)));
  const seriesOf = new Map<string, string[]>();
  for (const d of details) {
    if (!d) continue;
    for (const p of d.posts) seriesOf.set(p.id, [...(seriesOf.get(p.id) ?? []), d.id]);
  }

  const logPosts: LogPost[] = posts.map((p) => ({ ...p, seriesIds: seriesOf.get(p.id) ?? [] }));
  const logSeries: LogSeries[] = seriesList.map((s) => ({
    id: s.id,
    name: s.name,
    postsCount: s.postsCount,
    updatedAt: s.updatedAt,
  }));

  return (
    <div className="flex flex-col gap-20 py-6">
      <PageHeader eyebrow="Log" title={t(lang, "log.title")} />
      <LogBrowser posts={logPosts} seriesList={logSeries} lang={lang} />
    </div>
  );
}
