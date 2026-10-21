import type { Metadata } from "next";
import { alt as ogImageAlt, size as ogImageSize } from "@/app/opengraph-image";

// 링크 미리보기 이미지 등 절대 주소의 기준 - 도메인 바꾸면 여기만 수정
export const SITE_URL = "https://wonjun.page";
export const SITE_NAME = "오원준 포트폴리오";
// 메신저 링크 미리보기의 회색 한 줄 - 짧게 유지
export const SITE_DESCRIPTION = "의료 IT 풀스택 개발자";

// openGraph 는 레이아웃과 얕게 병합돼서 페이지가 openGraph 를 쓰면 레이아웃 값(파일 기반 og 이미지 포함)이 통째로 사라짐
// → 공통 필드와 미리보기 이미지(app/opengraph-image.tsx 라우트)를 여기서 같이 넣음
const OG_IMAGE = { url: "/opengraph-image", ...ogImageSize, alt: ogImageAlt };
const OPEN_GRAPH_BASE = { type: "website" as const, siteName: SITE_NAME, locale: "ko_KR", images: [OG_IMAGE] };

// 페이지별 제목·설명·주소를 description · og · twitter 에 똑같이 반영
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: { ...OPEN_GRAPH_BASE, title: fullTitle, description, url: path },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE] },
  };
}
