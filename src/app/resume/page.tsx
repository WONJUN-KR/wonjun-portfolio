import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import AboutView from "@/components/AboutView";
import { ABOUT } from "@/lib/about";

export const metadata: Metadata = pageMetadata({
  title: "이력서",
  description: "경력 기술서",
  path: "/resume",
});

// 경력 기간이 오늘 날짜로 계산되므로 하루에 한 번 다시 그림
export const revalidate = 86400;

export default function ResumePage() {
  return <AboutView about={ABOUT} />;
}
