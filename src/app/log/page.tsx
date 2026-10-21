import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getPosts, getSeries, getSeriesList } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui";
import LogBrowser, { type LogPost, type LogSeries } from "./LogBrowser";

export const metadata: Metadata = pageMetadata({
  title: "기록",
  description: "기술 블로그",
  path: "/log",
});

export default async function LogPage() {
  const [seriesList, posts] = await Promise.all([getSeriesList(), getPosts()]);

  // 시리즈 필터용 - 글 id 마다 속한 시리즈 id
  const details = await Promise.all(seriesList.map((s) => getSeries(s.slug).catch(() => null)));
  const seriesOf = new Map<string, string[]>();
  for (const d of details) {
    if (!d) continue;
    for (const p of d.posts) seriesOf.set(p.id, [...(seriesOf.get(p.id) ?? []), d.id]);
  }

  const logPosts: LogPost[] = posts.map((p) => ({ ...p, date: formatDate(p.publishedAt), seriesIds: seriesOf.get(p.id) ?? [] }));
  const logSeries: LogSeries[] = seriesList.map((s) => ({
    id: s.id,
    name: s.name,
    postsCount: s.postsCount,
    updated: formatDate(s.updatedAt),
  }));

  return (
    <div className="flex flex-col gap-20 py-6">
      <PageHeader eyebrow="Log" title="기록" />
      <LogBrowser posts={logPosts} seriesList={logSeries} />
    </div>
  );
}
