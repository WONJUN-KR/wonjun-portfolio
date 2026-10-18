import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import NavLinks from "@/components/NavLinks";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 링크 미리보기 이미지 등 절대 주소의 기준 - 도메인 바꾸면 여기만 수정
const SITE_URL = "https://wonjun.page";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // 페이지별 제목은 "연혁 · 오원준 포트폴리오" 처럼 뒤에 사이트 이름이 붙음
  title: { default: "오원준 포트폴리오", template: "%s · 오원준 포트폴리오" },
  description: "의료 IT 풀스택 개발자",
  openGraph: {
    type: "website",
    siteName: "오원준 포트폴리오",
    title: "오원준 포트폴리오",
    description: "의료 IT 풀스택 개발자",
    url: "/",
    locale: "ko_KR",
  },
  twitter: { card: "summary_large_image" },
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
          <nav className="max-w-5xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 h-14">
            {/* 휴대폰 폭에선 메뉴가 한 줄에 들어가도록 로고를 줄임 */}
            <Link href="/" className="shrink-0 whitespace-nowrap font-semibold tracking-tight">
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
