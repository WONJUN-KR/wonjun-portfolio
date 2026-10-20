"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";

// next/image + 불러오는 동안 큰 원형 로딩, 다 뜨면 로딩은 스르륵 사라지고 이미지는 스르륵 나타남(0.5초 겹쳐서)
// 로딩 층은 이미지 옆에 absolute 로 겹쳐 그려서, 부모 칸이 relative 여야 함 (fill 이미지는 원래 그럼)
// 가혹한 환경 대비
//  - JS 가 안 뜨면: 투명 시작·로딩 층을 JS 가 붙이므로 서버 HTML 의 이미지는 처음부터 그대로 보임
//  - JS 가 늦게 뜨면: 그 사이 이미 다 받아진 이미지는 기다리지 않고 바로 보임 (스르륵 없이)
//  - preload(첫 화면 큰 이미지): 투명 시작이면 LCP 가 밀려서 이미지는 그대로 두고, 로딩 원만 이미지 뒤에 깔아 둠
//  - 끝내 못 불러오면: 로딩을 계속 돌리지 않고 자리표시 - 영원히 도는 로딩은 "기다리면 뜬다"로 오해하게 만듦
// src 는 public 경로 문자열 (크기별 파일은 lib/image-loader 가 고름)
export default function SafeImage({ src, alt, className = "", onLoad, preload, ...rest }: ImageProps & { src: string }) {
  const ref = useRef<HTMLImageElement>(null);
  // mounted: JS 가 붙었나 / done: 이미지 다 받음 / fade: 스르륵 효과를 쓸지
  const [view, setView] = useState({ mounted: false, done: false, fade: false });
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const img = ref.current;
    const already = !!img && img.complete && img.naturalWidth > 0;
    setView({ mounted: true, done: already, fade: !preload && !already });
  }, [preload]);
  const { mounted, done, fade } = view;

  if (failed) {
    return (
      <span role="img" aria-label={alt} className="flex size-full items-center justify-center bg-surface text-muted/50">
        <ImageOff className="size-6" />
      </span>
    );
  }
  // 로딩 층 - 굵고 끝이 둥근 원(페이퍼로지 획처럼). 바탕 원 espresso-700, 도는 호 brick. 칸의 45%·최대 56px
  const spinner = (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-surface ${
        fade ? `transition-opacity duration-500 ${done ? "opacity-0" : "opacity-100"}` : ""
      }`}
    >
      <svg viewBox="0 0 48 48" className="w-[min(56px,45%)] aspect-square motion-safe:animate-spin [animation-duration:0.9s]">
        <circle cx="24" cy="24" r="19" fill="none" stroke="#43362e" strokeWidth="6" />
        <circle cx="24" cy="24" r="19" fill="none" stroke="#d0604c" strokeWidth="6" strokeLinecap="round" strokeDasharray="36 120" />
      </svg>
    </span>
  );
  return (
    <>
      {/* preload 는 로딩 원을 이미지 뒤에 - 이미지가 다 그려지면 그대로 덮음 */}
      {mounted && preload && !done && spinner}
      <Image
        ref={ref}
        src={src}
        alt={alt}
        preload={preload}
        className={`${className} ${fade ? `transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}` : ""}`}
        onLoad={(e) => {
          setView((v) => ({ ...v, done: true }));
          onLoad?.(e);
        }}
        onError={() => setFailed(true)}
        {...rest}
      />
      {/* 나머지는 로딩 원을 위에 두고 스르륵 걷어냄 */}
      {fade && spinner}
    </>
  );
}
