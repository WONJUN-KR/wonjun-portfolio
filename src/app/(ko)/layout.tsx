import type { Metadata } from "next";
import SiteShell, { rootMetadata } from "@/components/SiteShell";

// 한국어 루트 레이아웃 - 주소는 지금 그대로(/, /projects ...)
export const metadata: Metadata = rootMetadata("ko");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="ko">{children}</SiteShell>;
}
