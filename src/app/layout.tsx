import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import NavLinks from "@/components/NavLinks";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WebFontLoader from "@/components/WebFontLoader";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {/* GA 는 쿠키를 써서 이용 안내 한 줄 (Google Analytics 약관의 고지 의무) */}
        <footer className="max-w-5xl w-full mx-auto px-4 sm:px-6 pb-8 text-xs text-muted print:hidden">
          방문 통계에 Google Analytics(쿠키)를 써요.
        </footer>
        {/* 방문 통계 (Vercel Web Analytics) - 쿠키 없이 페이지뷰·유입 경로·기기만 집계, Vercel 배포에서만 수집 */}
        <Analytics />
        {/* 웹폰트(페이퍼로지 · Pretendard)는 첫 페인트 뒤에 등록 */}
        <WebFontLoader />
      </body>
      {/* 방문 통계 (Google Analytics 4) - 체류 시간 · 스크롤 · 클릭까지. 페이지 로드가 끝난 뒤 받아서 첫 화면엔 영향 없음
          운영 배포에서만 넣음 - 로컬 · 미리보기 방문이 통계에 섞이지 않게 */}
      {process.env.VERCEL_ENV === "production" && <GoogleAnalytics />}
    </html>
  );
}
