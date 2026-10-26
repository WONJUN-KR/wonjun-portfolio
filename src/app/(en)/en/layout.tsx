import type { Metadata } from "next";
import SiteShell, { rootMetadata } from "@/components/SiteShell";

// 영어 루트 레이아웃 - 주소 앞에 /en (/en, /en/projects ...)
export const metadata: Metadata = rootMetadata("en");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
