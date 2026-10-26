"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_TIME_ZONE, formatDateIn, formatDateTimeIn, timeZoneLabel } from "@/lib/time";

// 보는 사람 시간대 - 서버 · 하이드레이션 중엔 기본 시간대(Asia/Seoul), 하이드레이션 뒤 브라우저 시간대로
// useSyncExternalStore 의 서버 스냅샷을 쓰면 하이드레이션 불일치 없이 한 번 다시 그림 (같은 시간대면 화면 변화 없음)
const subscribe = () => () => {};
const viewerTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIME_ZONE;
const serverTimeZone = () => DEFAULT_TIME_ZONE;

export default function LocalDate({ iso, className = "" }: { iso: string; className?: string }) {
  const timeZone = useSyncExternalStore(subscribe, viewerTimeZone, serverTimeZone);
  return (
    <time dateTime={iso} title={formatDateTimeIn(iso, timeZone)} className={className}>
      {formatDateIn(iso, timeZone)}
      <span className="ml-1 text-[0.8em] opacity-70">{timeZoneLabel(timeZone, iso)}</span>
    </time>
  );
}
