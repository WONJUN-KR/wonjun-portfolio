// 홈 잔디의 연도 선택용 - 페이지를 다시 그리지 않고 잔디 데이터만 받아감 (GitHub 응답은 lib 쪽에서 1시간 캐시)
import { NextResponse } from "next/server";
import { getContributions } from "@/lib/api";

export async function GET(request: Request) {
  const year = new URL(request.url).searchParams.get("year") ?? undefined;
  if (year && !/^\d{4}$/.test(year)) {
    return NextResponse.json({ error: "year must be YYYY" }, { status: 400 });
  }
  try {
    return NextResponse.json(await getContributions(year));
  } catch {
    return NextResponse.json({ error: "contributions unavailable" }, { status: 502 });
  }
}
