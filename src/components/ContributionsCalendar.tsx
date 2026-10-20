"use client";

import { useEffect, useRef, useState } from "react";
import YearSelector from "@/components/YearSelector";
import type { ContributionDay } from "@/lib/api";
import {
  HEATMAP_BG_CLASS,
  HEATMAP_FILL_CLASS,
  levelFor,
  quartileThresholds,
} from "@/lib/heatmap";

type Props = {
  initialDays: ContributionDay[]; // 서버가 처음 그릴 때 받은 최근 1년 데이터 (홈은 정적 페이지라 주소의 ?year= 는 안 봄)
  initialYear?: string;
  years: number[]; // 연도 선택 상자에 넣을 연도들
};
// 연도 "" = 최근: 1년 데이터를 받아서 화면 폭에 들어가는 만큼만 (휴대폰 6개월 ~ 넓은 화면 12개월)
// 연도 YYYY = 그 해 전체 (좁으면 가로 스크롤)

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP; // 기본 칸 간격 (연도 모드, 범례)
const HEADER_H = 20;
const MIN_WEEKS = 26; // 6개월 - 휴대폰처럼 좁아도 이만큼은 보여줌 (칸이 작아짐)
const MAX_STEP = 18; // 넓은 화면에서 칸이 너무 커지지 않게

export default function ContributionsCalendar({ initialDays, initialYear = "", years }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState<number | null>(null);
  const [year, setYear] = useState(initialYear);
  const [days, setDays] = useState(initialDays);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const recent = !year;

  // 연도를 바꾸면 페이지 이동 없이 잔디 데이터만 받아서 다시 그림 (스크롤 위치 그대로).
  // 주소의 ?year= 도 같이 바꿔서 새로고침·공유해도 같은 연도로 열림
  const load = async (next: string) => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const res = await fetch(`/api/contributions${next ? `?year=${next}` : ""}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { days: ContributionDay[] };
      if (id === requestId.current) setDays(data.days);
    } catch {
      // 실패하면 이전 잔디를 그대로 둠
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  const changeYear = (next: string) => {
    setYear(next);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("year", next);
    else url.searchParams.delete("year");
    window.history.replaceState(window.history.state, "", url);
    void load(next);
  };

  // 공유 링크(?year=2025)로 들어오면 그 해로 바꿔 받음 - 서버 HTML 은 항상 최근 1년이라
  useEffect(() => {
    const fromUrl = new URL(window.location.href).searchParams.get("year") ?? "";
    // 선택 상자에 없는 연도(?year=1999 등)는 무시하고 최근 1년 그대로
    if (!fromUrl || fromUrl === initialYear || !years.includes(Number(fromUrl))) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 주소 값은 브라우저에서만 알 수 있음
    setYear(fromUrl);
    void load(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 처음 한 번만
  }, []);

  useEffect(() => {
    if (!recent || !boxRef.current) return;
    const observer = new ResizeObserver(([entry]) => setBoxWidth(entry.contentRect.width));
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [recent]);

  // 제목 줄 - 선택 상자의 "최근 …" 문구가 지금 보이는 기간을 따라가도록 잔디와 같이 그림
  const header = (periodLabel: string) => (
    <div className="flex items-center justify-between gap-3">
      <span className="whitespace-nowrap text-sm font-semibold">GitHub Contributions</span>
      <YearSelector years={years} value={year} onChange={changeYear} defaultLabel={periodLabel} />
    </div>
  );

  if (days.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {header("최근 1년")}
        <p className="text-sm text-muted">잔디 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const byDate = new Map(days.map((d) => [d.date, d]));
  const thresholds = quartileThresholds(days);

  const first = new Date(days[0].date);
  const last = new Date(days[days.length - 1].date);
  const start = new Date(first);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(last);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  // 최근 모드: 폭에 기본 칸이 몇 주 들어가는지로 보여줄 주 수(6~12개월)를 정하고,
  // 칸 크기는 그 주 수가 폭을 꽉 채우도록 다시 계산 (정사각형 유지, 글자는 그대로). 폭을 재기 전(서버 렌더)엔 기본 크기로 전체
  const measured = recent && boxWidth !== null;
  const fitWeeks = measured ? Math.floor(boxWidth / STEP) : totalWeeks;
  const shownWeeks = recent ? Math.min(totalWeeks, Math.max(MIN_WEEKS, fitWeeks)) : totalWeeks;
  const offset = totalWeeks - shownWeeks;
  const step = measured ? Math.min(MAX_STEP, boxWidth / shownWeeks) : STEP;
  const gap = step * (GAP / STEP);
  const cell = step - gap;
  const minLabelGap = 3 * step;

  const dateAt = (week: number, dow: number) => {
    const d = new Date(start);
    d.setDate(d.getDate() + week * 7 + dow);
    return d;
  };

  const width = shownWeeks * step;
  const height = 7 * step + HEADER_H;

  const monthLabels: { x: number; label: string }[] = [];
  const monthDividers: number[] = [];
  let lastMonth = -1;
  let lastLabelX = -Infinity;
  for (let week = offset; week < totalWeeks; week++) {
    let dataDay: Date | null = null;
    for (let dow = 0; dow < 7; dow++) {
      const d = dateAt(week, dow);
      if (d >= first && d <= last) {
        dataDay = d;
        break;
      }
    }
    if (!dataDay) continue;
    const month = dataDay.getMonth();
    if (month !== lastMonth) {
      const x = (week - offset) * step;
      if (lastMonth !== -1) monthDividers.push(x - gap / 2);
      if (x - lastLabelX >= minLabelGap) {
        monthLabels.push({ x, label: `${month + 1}월` });
        lastLabelX = x;
      }
      lastMonth = month;
    }
  }

  const cells: React.ReactElement[] = [];
  let shownTotal = 0;
  for (let week = offset; week < totalWeeks; week++) {
    for (let dow = 0; dow < 7; dow++) {
      const d = dateAt(week, dow);
      if (d < first || d > last) continue;
      const key = d.toISOString().slice(0, 10);
      const count = byDate.get(key)?.count ?? 0;
      shownTotal += count;
      const level = levelFor(count, thresholds);
      cells.push(
        <rect
          key={key}
          x={(week - offset) * step}
          y={HEADER_H + dow * step}
          width={cell}
          height={cell}
          rx={Math.min(3, cell / 4)}
          className={HEATMAP_FILL_CLASS[level]}
        >
          <title>{`${key} - ${count}건`}</title>
        </rect>,
      );
    }
  }

  // 보이는 기간 (최근 모드) - 주 수를 개월로 어림, 12개월은 "1년"
  const shownMonths = Math.min(12, Math.round(shownWeeks / 4.345));
  const periodLabel = shownMonths >= 12 ? "최근 1년" : `최근 ${shownMonths}개월`;

  return (
    <div className="flex flex-col gap-4">
      {header(periodLabel)}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted">
            <span className="text-lg font-bold text-accent-2">{shownTotal.toLocaleString()}</span>건
          </span>
          <span className="text-xs text-muted">(개인 + 회사 계정 합산)</span>
        </div>
        <div ref={boxRef} className={`${recent ? "overflow-hidden" : "overflow-x-auto"} transition-opacity ${loading ? "opacity-40" : ""}`}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            // 폭을 잰 뒤엔 실제 픽셀 크기 그대로 (늘이거나 줄이지 않아 칸·글자가 찌그러지지 않음). 연도 모드는 원래 크기로 스크롤
            className={measured ? "block" : "w-full h-auto"}
            width={measured ? width : undefined}
            height={measured ? height : undefined}
            style={measured ? undefined : { minWidth: `${width}px` }}
            role="img"
            aria-label="GitHub contributions calendar"
          >
            {monthDividers.map((x) => (
              <line
                key={`div-${x}`}
                x1={x}
                y1={HEADER_H - 4}
                x2={x}
                y2={height}
                strokeWidth={1}
                className="stroke-line"
              />
            ))}
            {monthLabels.map((m) => (
              <text
                key={`m-${m.x}`}
                x={m.x + 2}
                y={12}
                fontSize={10}
                className="fill-muted"
              >
                {m.label}
              </text>
            ))}
            {cells}
          </svg>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted self-end">
          <span>Less</span>
          {HEATMAP_BG_CLASS.map((cls, i) => (
            <span
              key={i}
              className={`inline-block rounded-[3px] ${cls}`}
              style={{ width: `${CELL}px`, height: `${CELL}px` }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
