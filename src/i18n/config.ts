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

// 영어판 기록(Log) - 영어 글이 생기면 true 로. 메뉴 · 홈 글 목록 · /en/log · /en/series 주소 · sitemap · hreflang 이 같이 켜짐
// 꺼져 있으면 /en/log · /en/series 는 한국어 주소로 보냄(next.config.ts)
// 켤 때 할 일: log.countShort · log.filtered · log.all · series.count 가 '{n} posts' 라 글 1개면 '1 posts' - t() 에 단수형(.one) 키 추가
export const EN_LOG_ENABLED = false;
const LOG_PATHS = ["/log", "/series"];

// 그 언어에 이 페이지가 있는지 (path = 언어 앞부분 없는 주소)
export function hasPage(lang: Lang, path: string): boolean {
  if (lang === "en" && !EN_LOG_ENABLED) return !LOG_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
  return true;
}
