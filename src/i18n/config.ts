// 언어 설정 - 한국어는 지금 주소 그대로(/projects), 영어는 /en 을 앞에 붙임(/en/projects)
// 언어는 상태가 아니라 주소로 정함 → 페이지가 정적으로 유지되고, 검색엔진이 언어별 주소를 따로 색인
export const LANGS = ["ko", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "ko";

// 날짜 형식(Intl) · 링크 미리보기(og:locale) 언어 코드
export const DATE_LOCALE: Record<Lang, string> = { ko: "ko-KR", en: "en-US" };
export const OG_LOCALE: Record<Lang, string> = { ko: "ko_KR", en: "en_US" };

// "/projects" → 한국어 "/projects" · 영어 "/en/projects" (홈은 "/" · "/en")
export function localizedPath(lang: Lang, path: string): string {
  if (lang === DEFAULT_LANG) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

// "/en/projects" → "/projects" (언어 앞부분을 뗀 같은 페이지 주소)
export function pathWithoutLang(pathname: string): string {
  for (const lang of LANGS) {
    if (lang === DEFAULT_LANG) continue;
    if (pathname === `/${lang}`) return "/";
    if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
  }
  return pathname;
}

export function langFromPath(pathname: string): Lang {
  return LANGS.find((lang) => lang !== DEFAULT_LANG && (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`))) ?? DEFAULT_LANG;
}
