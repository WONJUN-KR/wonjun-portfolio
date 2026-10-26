import type { MetadataRoute } from "next";
import { getSeriesList } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";
import { LANGS, hasPage, localizedPath } from "@/i18n";

// 검색엔진용 주소 목록 - 페이지마다 한국어 · 영어 주소를 서로 짝(alternates)으로
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const series = await getSeriesList();
  const paths = ["/", "/resume", "/projects", "/log", "/history", ...series.map((s) => `/series/${s.slug}`)];
  // 그 언어에 없는 페이지(영어판 기록 등)는 빼고, 짝도 있는 언어끼리만
  return paths.flatMap((path) => {
    const langs = LANGS.filter((l) => hasPage(l, path));
    return langs.map((lang) => ({
      url: `${SITE_URL}${localizedPath(lang, path)}`,
      alternates: { languages: Object.fromEntries(langs.map((l) => [l, `${SITE_URL}${localizedPath(l, path)}`])) },
    }));
  });
}
