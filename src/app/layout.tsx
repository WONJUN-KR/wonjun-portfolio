import type { Metadata } from "next";
import Link from "next/link";
import { preload } from "react-dom";
import { Geist, Geist_Mono } from "next/font/google";
import NavLinks from "@/components/NavLinks";
// 본문 폰트 Pretendard 를 npm 패키지로 - 예전엔 외부 CSS 를 @import 로 불러서 첫 화면이 그걸 기다렸음 (휴대폰 라이트하우스 점수가 가끔 70·80 으로 튐)
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 홈 기준값 - 다른 페이지는 각 page.tsx 에서 pageMetadata 로 설명·주소를 덮어씀
export const metadata: Metadata = {
  ...pageMetadata({ description: SITE_DESCRIPTION, path: "/" }),
  metadataBase: new URL(SITE_URL),
  // 페이지별 제목은 "연혁 · 오원준 포트폴리오" 처럼 뒤에 사이트 이름이 붙음
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
};

// 첫 화면에서 실제로 받는 제목 폰트 굵기(globals.css @font-face 와 같은 주소)
// CSS 에서 발견된 폰트는 VeryHigh 우선순위라, 첫 페인트 전에 다 받아지면 라이트하우스 시뮬레이션(Lantern)이 render-blocking 으로 계산해
// 휴대폰 점수가 98 ↔ 70 으로 흔들림 → preload 로 High 우선순위·조기 요청으로 바꿔 계산에서 빠지게 함 (font-display: swap 이라 실제 첫 페인트는 원래 안 막음)
const HEADING_FONT_PRELOADS = [
  "https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2",
  "https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-6SemiBold.woff2",
  "https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-7Bold.woff2",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  for (const href of HEADING_FONT_PRELOADS) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-40 border-b border-line bg-background/70 backdrop-blur-xl">
          <nav className="max-w-5xl mx-auto flex items-center justify-between gap-3 max-[359px]:gap-2 px-4 max-[359px]:px-3 sm:px-6 h-14">
            {/* 휴대폰 폭에선 메뉴가 한 줄에 들어가도록 로고를 줄임. 360px 미만(가장 작은 폰 320px)은 여백·글자를 한 단계 더 줄임 */}
            <Link href="/" className="shrink-0 whitespace-nowrap max-[359px]:text-[15px] font-semibold tracking-tight">
              WONJUN<span className="hidden sm:inline"> · PORTFOLIO</span>
            </Link>
            <NavLinks />
          </nav>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">{children}</main>
      </body>
    </html>
  );
}
