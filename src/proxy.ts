import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// 언어 라우팅 (Next.js 16 은 middleware 대신 proxy) - /projects → 내부 /ko/projects rewrite, /ko/projects → /projects redirect
export default createMiddleware(routing);

// api · Next 내부 · Vercel · 미리보기 이미지 · 파일(점 들어간 주소: sitemap.xml, 이미지 등)은 건너뜀
export const config = {
  matcher: "/((?!api|_next|_vercel|og/|opengraph-image|.*\\..*).*)",
};
