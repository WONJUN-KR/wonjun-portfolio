"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { LANGS, hasPage, localizedPath, pathWithoutLang, type Lang } from "@/i18n";
import { KoreaFlag, UsFlag } from "@/components/Flags";

const FLAGS: Record<Lang, { Flag: typeof KoreaFlag; label: string }> = {
  ko: { Flag: KoreaFlag, label: "한국어" },
  en: { Flag: UsFlag, label: "English" },
};

// 언어 전환 - 헤더 아래 본문 오른쪽 위에 국기 두 개(지금 언어는 테두리로 표시). 메뉴 줄은 휴대폰에서 꽉 차서 거기 두지 않음
// 같은 페이지의 반대 언어 주소로 (/projects ↔ /en/projects), 쿼리 · 해시도 그대로 넘김
// 두 언어는 루트 레이아웃이 달라서 어차피 페이지를 새로 받으므로 일반 <a> 로 이동
export default function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  // 전역 404(global-not-found)에선 주소가 내부용 '/_not-found' 로 잡혀서 각 언어 홈으로
  const page = pathname.startsWith("/_not-found") ? "/" : pathWithoutLang(pathname);
  const go = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = href + window.location.search + window.location.hash;
  };
  return (
    <div className="flex items-center gap-1.5 print:hidden">
      {LANGS.map((l) => {
        const { Flag, label } = FLAGS[l];
        const current = l === lang;
        // 그 언어에 없는 페이지(영어판 기록 등)면 그 언어 홈으로
        const href = localizedPath(l, hasPage(l, page) ? page : "/");
        return (
          <a
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            onClick={current ? undefined : go(href)}
            aria-current={current ? "page" : undefined}
            aria-label={label}
            title={label}
            className={`block rounded-[5px] p-[3px] transition-[opacity,box-shadow] ${current ? "ring-2 ring-accent-2/80" : "opacity-60 hover:opacity-100"}`}
          >
            <Flag className="block h-4 w-6 rounded-[2px] shadow-sm" />
          </a>
        );
      })}
    </div>
  );
}
