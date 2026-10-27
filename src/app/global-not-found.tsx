import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import NotFoundView from "@/components/NotFoundView";
import { setRequestLocale } from "next-intl/server";
import { tFor } from "@/i18n/translator";

// 어느 라우트에도 안 맞는 요청의 404 - 루트 레이아웃이 app/[locale] 아래라 이 파일이 따로 필요(next.config experimental.globalNotFound)
// 보통 없는 주소는 proxy 를 거쳐 [locale]/[...missing] → 그 언어 404 로 가고, 여기는 proxy 를 안 거치는 경우의 안전망(한국어)
export const metadata: Metadata = { title: tFor("ko")("notFound.title") };

export default function GlobalNotFound() {
  // 요청 헤더를 안 읽게 언어를 정해 둠 → 정적 404
  setRequestLocale("ko");
  return (
    <SiteShell lang="ko">
      <NotFoundView lang="ko" />
    </SiteShell>
  );
}
