import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import NotFoundView from "@/components/NotFoundView";
import { t } from "@/i18n";

// 어느 주소에도 안 맞는 요청의 404 - 루트 레이아웃이 언어별로 두 개라 이 파일이 따로 필요(next.config experimental.globalNotFound)
// /en 아래 없는 주소는 (en)/en/[...missing] 이 받아서 영어 404 로 가고, 여기는 그 밖(한국어 주소 쪽)
export const metadata: Metadata = { title: t("ko", "notFound.title") };

export default function GlobalNotFound() {
  return (
    <SiteShell lang="ko">
      <NotFoundView lang="ko" />
    </SiteShell>
  );
}
