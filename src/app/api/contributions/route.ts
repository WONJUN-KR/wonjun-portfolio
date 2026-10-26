// 홈 잔디의 연도 선택용 - 페이지를 다시 그리지 않고 잔디 데이터만 받아감 (GitHub 응답은 lib 쪽에서 1시간 캐시)
import { NextResponse } from "next/server";
import { CONTRIBUTIONS_EARLIEST_YEAR, getContributions } from "@/lib/api";
import { yearIn } from "@/lib/time";

export async function GET(request: Request) {
  const year = new URL(request.url).searchParams.get("year") ?? undefined;
  // 선택 상자에 있는 연도(2020 ~ 올해)만 받음 - 아무 연도나 받으면 연도마다 GitHub 를 새로 불러 토큰 한도(시간당 5,000)를 다 쓸 수 있음
  const thisYear = yearIn(); // 사이트 기준 시간대(KST)의 올해 - 한국 1월 1일 0시부터 새 연도 허용
  if (year && (!/^\d{4}$/.test(year) || Number(year) < CONTRIBUTIONS_EARLIEST_YEAR || Number(year) > thisYear)) {
    return NextResponse.json({ error: `year must be ${CONTRIBUTIONS_EARLIEST_YEAR}~${thisYear}` }, { status: 400 });
  }
  try {
    return NextResponse.json(await getContributions(year));
  } catch {
    return NextResponse.json({ error: "contributions unavailable" }, { status: 502 });
  }
}
