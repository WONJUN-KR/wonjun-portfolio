import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/i18n/translator";
import type { Lang } from "@/i18n";

type Props = { params: Promise<{ locale: Lang }> };

// 탭 제목도 404 문구로 (없으면 사이트 이름만 나옴)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: tFor((await params).locale)("notFound.title") };
}

// 없는 주소 → 그 언어 레이아웃의 404(not-found.tsx). 이게 없으면 전역 404(global-not-found)로 가서 언어가 안 맞음
export default function MissingPage() {
  notFound();
}
