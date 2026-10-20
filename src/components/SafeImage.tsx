"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

// 로딩 표시 - 굵고 끝이 둥근 원(페이퍼로지 획처럼)이 도는 SVG. img 배경으로 깔아서 감싸는 태그 없이(레이아웃 그대로) 보여줌
// 바탕 원 = espresso-700, 도는 호 = brick. SMIL 애니메이션이라 배경 그림에서도 돌아감
const SPINNER = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><circle cx='24' cy='24' r='19' fill='none' stroke='#43362e' stroke-width='6'/><circle cx='24' cy='24' r='19' fill='none' stroke='#d0604c' stroke-width='6' stroke-linecap='round' stroke-dasharray='36 120'><animateTransform attributeName='transform' type='rotate' from='0 24 24' to='360 24 24' dur='0.9s' repeatCount='indefinite'/></circle></svg>`,
)}")`;

// next/image + 불러오는 동안 큰 원형 로딩, 다 뜨면 사라짐
// 끝내 못 불러오면(파일 없음 등) 로딩을 계속 돌리지 않고 자리표시로 바꿈 - 영원히 도는 로딩은 "기다리면 뜬다"로 오해하게 만듦
// src 는 public 경로 문자열 (크기별 파일은 lib/image-loader 가 고름)
export default function SafeImage({ src, alt, style, onLoad, ...rest }: ImageProps & { src: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");
  if (state === "failed") {
    return (
      <span role="img" aria-label={alt} className="flex size-full items-center justify-center bg-surface text-muted/50">
        <ImageOff className="size-6" />
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      // 원 크기: 이미지 칸의 45% 까지, 최대 56px (작은 로고 칸에선 작게)
      style={
        state === "loading"
          ? { ...style, background: `${SPINNER} center / min(56px, 45%) no-repeat var(--color-surface)` }
          : style
      }
      onLoad={(e) => {
        setState("loaded");
        onLoad?.(e);
      }}
      onError={() => setState("failed")}
      {...rest}
    />
  );
}
