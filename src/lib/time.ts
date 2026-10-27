// 시각 표시 공용 - 데이터는 UTC ISO(...Z)로 저장하고, 화면에선 보는 사람 시간대로 그림
// '2021.07' 같은 날짜만 있는 값(기간 · 커밋 달력 날짜)은 시간대와 무관해서 여기서 다루지 않음

// 사이트 기준 시간대 - 서버(정적 렌더)의 날짜 표시 기본값이자, 연도 · 경력 개월 수 같은 '오늘' 계산의 기준
// 방문자 대부분이 한국이라 Asia/Seoul. NEXT_PUBLIC_DEFAULT_TIME_ZONE 으로 바꿀 수 있음(빌드 때 서버 · 클라이언트 양쪽에 같은 값이 박힘)
// 잘못된 시간대 문자열이면 Asia/Seoul 로 대체
const FALLBACK_TIME_ZONE = "Asia/Seoul";
function validTimeZone(tz: string | undefined): string {
  if (!tz) return FALLBACK_TIME_ZONE;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return FALLBACK_TIME_ZONE;
  }
}
export const DEFAULT_TIME_ZONE = validTimeZone(process.env.NEXT_PUBLIC_DEFAULT_TIME_ZONE);

// 그 시간대의 '오늘' - 서버 시계(Vercel = UTC)를 그대로 쓰면 한국 1월 1일 · 매월 1일 00~09시에 연도 · 개월 수가 9시간 늦게 바뀜
function datePartsIn(timeZone: string, now: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}
export function yearIn(timeZone = DEFAULT_TIME_ZONE, now = new Date()): number {
  return datePartsIn(timeZone, now).year;
}
// 1 ~ 12
export function monthIn(timeZone = DEFAULT_TIME_ZONE, now = new Date()): number {
  return datePartsIn(timeZone, now).month;
}
// "2026-10-26"
export function todayIn(timeZone = DEFAULT_TIME_ZONE, now = new Date()): string {
  const { year, month, day } = datePartsIn(timeZone, now);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// "2026년 1월 26일" / en-US 면 "Jan 26, 2026"
export function formatDateIn(iso: string, timeZone: string, locale = "ko-KR"): string {
  return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: locale.startsWith("ko") ? "long" : "short", day: "numeric", timeZone });
}

// 시간 옆 작은 표시 - Intl 은 Asia/Seoul 을 'GMT+9' 로 줘서 자주 보는 곳만 약어로
const ABBR: Record<string, string> = { "Asia/Seoul": "KST", "Asia/Tokyo": "JST", UTC: "UTC", "Etc/UTC": "UTC" };
export function timeZoneLabel(timeZone: string, iso: string): string {
  if (ABBR[timeZone]) return ABBR[timeZone];
  const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
    .formatToParts(new Date(iso))
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? timeZone;
}

// 마우스를 올리면 보이는 전체 시각 - "2026. 1. 26. 오후 5:34 (KST)" / en-US 면 "Jan 26, 2026, 5:34 PM (KST)"
export function formatDateTimeIn(iso: string, timeZone: string, locale = "ko-KR"): string {
  const text = new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short", timeZone });
  return `${text} (${timeZoneLabel(timeZone, iso)})`;
}
