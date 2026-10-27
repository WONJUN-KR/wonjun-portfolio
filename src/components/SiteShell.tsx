import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import NavLinks from "@/components/NavLinks";
import LangSwitch from "@/components/LangSwitch";
import "@/app/globals.css";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import { localizedPath, t, type Lang } from "@/i18n";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WebFontLoader from "@/components/WebFontLoader";
import MoreToggleScrollRestore from "@/components/MoreToggleScrollRestore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 언어별 루트 레이아웃((ko) · (en)/en)의 홈 기준 메타데이터 - 다른 페이지는 각 page.tsx 에서 pageMetadata 로 설명·주소를 덮어씀
export function rootMetadata(lang: Lang): Metadata {
  const siteName = t(lang, "site.name");
  return {
    ...pageMetadata({ description: t(lang, "site.description"), path: "/", lang }),
    metadataBase: new URL(SITE_URL),
    // 페이지별 제목은 "연혁 · 오원준 포트폴리오" 처럼 뒤에 사이트 이름이 붙음
    title: { default: siteName, template: `%s · ${siteName}` },
  };
}

// 사이트 공통 틀 - <html> 부터 헤더 · 푸터 · 분석 도구까지. 한국어 · 영어 두 루트 레이아웃이 같이 씀
export default function SiteShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-40 border-b border-line bg-background/70 backdrop-blur-xl">
          <nav className="max-w-5xl mx-auto flex items-center justify-between gap-3 max-[359px]:gap-2 px-4 max-[359px]:px-3 sm:px-6 h-14">
            {/* 휴대폰 폭에선 메뉴가 한 줄에 들어가도록 로고를 줄임. 360px 미만(가장 작은 폰 320px)은 여백·글자를 한 단계 더 줄임 */}
            <Link href={localizedPath(lang, "/")} className="shrink-0 whitespace-nowrap max-[359px]:text-[15px] font-semibold tracking-tight">
              WONJUN<span className="hidden sm:inline">{t(lang, "nav.logoSuffix")}</span>
            </Link>
            <NavLinks lang={lang} />
          </nav>
        </header>
        <main className="relative flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* 언어 전환 국기 - 본문 위 여백(py-8) 안 오른쪽에 겹쳐 둬서 본문 위치는 그대로 */}
          <div className="absolute right-4 sm:right-6 top-2 sm:top-3">
            <LangSwitch lang={lang} />
          </div>
          {children}
        </main>
        {/* GA 는 쿠키를 써서 이용 안내 한 줄 (Google Analytics 약관의 고지 의무) */}
        <footer className="max-w-5xl w-full mx-auto px-4 sm:px-6 pb-8 text-xs text-muted print:hidden">{t(lang, "footer.analytics")}</footer>
        {/* 방문 통계 (Vercel Web Analytics) - 쿠키 없이 페이지뷰·유입 경로·기기만 집계, Vercel 배포에서만 수집 */}
        <Analytics />
        {/* 웹폰트(페이퍼로지 · Pretendard)는 첫 페인트 뒤에 등록 */}
        <WebFontLoader />
        {/* 휴대폰 접기 버튼: 접으면 펼쳤던 화면 위치로 */}
        <MoreToggleScrollRestore />
      </body>
      {/* 방문 통계 (Google Analytics 4) - 체류 시간 · 스크롤 · 클릭까지. 페이지 로드가 끝난 뒤 받아서 첫 화면엔 영향 없음
          운영 배포에서만 넣음 - 로컬 · 미리보기 방문이 통계에 섞이지 않게 */}
      {process.env.VERCEL_ENV === "production" && <GoogleAnalytics />}
    </html>
  );
}
