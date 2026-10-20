import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 서버 왼쪽 아래 Next.js 표시(동그라미 버튼) 숨김 - 배포 화면엔 원래 안 나옴
  devIndicators: false,
  // 이미지는 빌드 전에 scripts/optimize-images.mjs 가 크기별로 만들어 두고, 로더가 화면에 맞는 크기를 고름 (요청 때 서버 최적화 안 씀)
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
  // 이름이 바뀐 페이지의 예전 주소는 새 주소로 (about → resume, 로드맵 → 연혁)
  async redirects() {
    return [
      { source: "/about", destination: "/resume", permanent: true },
      { source: "/roadmap", destination: "/history", permanent: true },
      { source: "/roadmap/:slug", destination: "/history", permanent: true },
      // 글 상세는 네이버 원문으로 옮겨서, 예전 글 주소는 목록으로
      { source: "/log/:slug", destination: "/log", permanent: false },
    ];
  },
};

export default nextConfig;
