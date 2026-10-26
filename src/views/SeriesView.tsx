import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeries } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import { DATE_LOCALE, localizedPath, t, type Lang } from "@/i18n";
import LocalDate from "@/components/LocalDate";
import { BackLink, Eyebrow } from "@/components/ui";
import SeriesPostList from "@/components/SeriesPostList";

// 시리즈 페이지 본문 · 메타데이터 - 한국어(/series/x) · 영어(/en/series/x) 페이지가 같이 씀
export async function seriesMetadata(slug: string, lang: Lang): Promise<Metadata> {
  const series = await getSeries(slug);
  if (!series) return {};
  return pageMetadata({
    title: series.name,
    description: series.description || t(lang, "meta.series.description", { name: series.name, count: series.posts.length }),
    path: `/series/${slug}`,
    lang,
  });
}

export default async function SeriesView({ slug, lang }: { slug: string; lang: Lang }) {
  const series = await getSeries(slug);
  if (!series) notFound();

  return (
    <div className="flex flex-col gap-12 py-6">
      <BackLink href={localizedPath(lang, "/log")} label="기록으로" />

      <header className="animate-fade-up flex flex-col gap-4">
        <Eyebrow>Series</Eyebrow>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{series.name}</h1>
        {series.description && <p className="text-base sm:text-lg text-muted max-w-2xl">{series.description}</p>}
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>{series.postsCount}개 글</span>
          {series.updatedAt && (
            <>
              <span>·</span>
              <span><LocalDate iso={series.updatedAt} locale={DATE_LOCALE[lang]} /> 업데이트</span>
            </>
          )}
        </div>
      </header>

      <SeriesPostList posts={series.posts} locale={DATE_LOCALE[lang]} />
    </div>
  );
}
