import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import AboutView from "@/components/AboutView";
import { ABOUT } from "@/lib/about";

export const metadata: Metadata = pageMetadata({
  title: "이력서",
  description: "경력 기술서",
  path: "/resume",
});

// 경력 기간이 오늘(사이트 기준 시간대) 날짜로 계산되므로 1시간마다 다시 그림 - 매월 1일 KST 0시가 지나면 1시간 안에 개월 수가 바뀜 (홈도 잔디 캐시로 1시간)
export const revalidate = 3600;

export default function ResumePage() {
  return <AboutView about={ABOUT} />;
}
