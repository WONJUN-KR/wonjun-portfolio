"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 상단 메뉴 - 지금 보고 있는 페이지 탭은 마우스를 올린 상태처럼 계속 강조
const NAV_ITEMS = [
  { href: "/resume", label: "Resume", match: ["/resume"] },
  { href: "/projects", label: "Projects", match: ["/projects"] },
  { href: "/log", label: "Log", match: ["/log", "/series"] },
  { href: "/history", label: "History", match: ["/history"] },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-0.5 max-[359px]:gap-0 sm:gap-1 text-[13px] max-[359px]:text-[12px] sm:text-sm font-semibold text-accent-2">
      {NAV_ITEMS.map((item) => {
        const active = item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`px-2 max-[359px]:px-1 sm:px-3 py-1.5 rounded-full transition-colors ${
              active ? "text-foreground bg-surface-hover" : "hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
