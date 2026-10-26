// 시각 표시 공용 - 데이터는 UTC ISO(...Z)로 저장하고, 화면에선 보는 사람 시간대로 그림
// '2021.07' 같은 날짜만 있는 값(기간 · 커밋 달력 날짜)은 시간대와 무관해서 여기서 다루지 않음

// 서버(정적 렌더)가 쓰는 기본 시간대 - 방문자 대부분이 한국이라 첫 화면부터 맞게 보이도록. 다른 시간대면 클라이언트에서 바꿈(LocalDate)
export const DEFAULT_TIME_ZONE = "Asia/Seoul";

// "2026년 1월 26일"
export function formatDateIn(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone });
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

// 마우스를 올리면 보이는 전체 시각 - "2026. 1. 26. 오후 5:34 (KST)"
export function formatDateTimeIn(iso: string, timeZone: string): string {
  const text = new Date(iso).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short", timeZone });
  return `${text} (${timeZoneLabel(timeZone, iso)})`;
}
