// 링크 미리보기 썸네일 (영어, /og/en) - 그리는 건 lib/ogImage.tsx
// opengraph-image 파일 규칙을 (en) 라우트 그룹 안에 두면 주소 끝에 해시가 붙어서(/en/opengraph-image-xxxx) 고정 주소인 라우트 핸들러로 둠
import { renderOgImage } from "@/lib/ogImage";

export const dynamic = "force-static";

export function GET() {
  return renderOgImage("en");
}
