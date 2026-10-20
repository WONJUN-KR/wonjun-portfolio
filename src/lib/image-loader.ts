"use client";

// next/image 사용자 정의 로더 (next.config 의 images.loaderFile) - 브라우저가 고른 너비에 맞춰
// 빌드 전에 만들어 둔 크기별 WebP(public/_opt) 중 그 너비 이상인 가장 작은 파일을 줌. 목록에 없는 이미지는 원본 그대로
import manifest from "@/generated/images.json";

type Entry = { widths: number[] };
const images = manifest as Record<string, Entry>;

export default function imageLoader({ src, width }: { src: string; width: number }) {
  const m = images[src];
  if (!m) return src;
  const w = m.widths.find((x) => x >= width) ?? m.widths[m.widths.length - 1];
  return `/_opt${src.replace(/\.(png|jpe?g)$/i, "")}-${w}.webp`;
}
