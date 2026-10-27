import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { DEFAULT_TIME_ZONE } from "@/lib/time";
import { routing } from "./routing";
import { MESSAGES } from "./messages";

// 요청(정적 빌드 포함)마다 쓸 언어 · 메시지 - 언어는 레이아웃 · 페이지의 setRequestLocale(정적) 또는 proxy 가 넘긴 값
// timeZone: next-intl 날짜 포맷 기준(서버 · 브라우저 같게). 화면 날짜는 LocalDate 가 보는 사람 시간대로 다시 그림
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, messages: MESSAGES[locale], timeZone: DEFAULT_TIME_ZONE };
});
