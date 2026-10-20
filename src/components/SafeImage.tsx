"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { blurOf } from "@/lib/img";

// next/image + 로딩 중엔 흐린 미리보기가 숨 쉬듯 깜빡이는 로딩 애니메이션, 다 뜨면 멈춤
// 끝내 못 불러오면(파일 없음 등) 로딩을 계속 돌리지 않고 자리표시로 바꿈 - 영원히 도는 로딩은 "기다리면 뜬다"로 오해하게 만듦
// src 는 public 경로 문자열 (크기별 파일은 lib/image-loader 가 고름)
export default function SafeImage({ src, alt, className = "", onLoad, ...rest }: ImageProps & { src: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");
  if (state === "failed") {
    return (
      <span role="img" aria-label={alt} className="flex size-full items-center justify-center bg-surface text-muted/50">
        <ImageOff className="size-6" />
      </span>
    );
  }
  const blur = blurOf(src);
  return (
    <Image
      src={src}
      alt={alt}
      placeholder={blur ? "blur" : "empty"}
      blurDataURL={blur}
      // 움직임 줄이기 설정을 켠 사람에겐 깜빡임 없음
      className={`${className} ${state === "loading" ? "motion-safe:animate-pulse" : ""}`}
      onLoad={(e) => {
        setState("loaded");
        onLoad?.(e);
      }}
      onError={() => setState("failed")}
      {...rest}
    />
  );
}
