// 링크 미리보기 썸네일 (한국어) - 그리는 건 lib/ogImage.tsx
import { OG_ALT, OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = OG_ALT.ko;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("ko");
}
