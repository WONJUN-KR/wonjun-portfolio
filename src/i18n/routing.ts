import { defineRouting } from "next-intl/routing";
import { DEFAULT_LANG, LANGS } from "./config";

// next-intl 라우팅 - 한국어는 주소 앞부분 없이(/projects), 영어는 /en (as-needed: proxy 가 /projects 를 내부 /ko/projects 로 rewrite)
// localeDetection · localeCookie 꺼 둠: 브라우저 언어 · 쿠키로 자동 이동하지 않고 주소 그대로 (켜면 영어 브라우저가 / 로 들어올 때 /en 으로 보냄)
// alternateLinks 꺼 둠: hreflang 은 lib/seo.ts 가 페이지마다 넣음 (영어판에 없는 페이지는 빼야 해서)
export const routing = defineRouting({
  locales: LANGS,
  defaultLocale: DEFAULT_LANG,
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});
