// public 이미지 경로 → 빌드 전에 줄여둔 WebP 경로 (scripts/optimize-images.mjs 가 만듦)
// "/projects/ocp.png" → "/_opt/projects/ocp.webp". 대상 폴더가 아니면 그대로
export function optimized(src: string): string {
  return src.replace(/^\/((?:img|projects|logos|blog\/naver)\/.+)\.(png|jpe?g)$/i, "/_opt/$1.webp");
}
