import type { MetadataRoute } from "next";
import { getSeriesList } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";
import { LANGS, localizedPath } from "@/i18n";

// 검색엔진용 주소 목록 - 페이지마다 한국어 · 영어 주소를 서로 짝(alternates)으로
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const series = await getSeriesList();
  const paths = ["/", "/resume", "/projects", "/log", "/history", ...series.map((s) => `/series/${s.slug}`)];
  return paths.flatMap((path) =>
    LANGS.map((lang) => ({
      url: `${SITE_URL}${localizedPath(lang, path)}`,
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE_URL}${localizedPath(l, path)}`])) },
    })),
  );
}
