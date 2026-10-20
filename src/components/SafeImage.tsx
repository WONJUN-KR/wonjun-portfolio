"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { blurOf } from "@/lib/img";

// next/image + 로딩 중 흐린 미리보기 + 못 불러오면 깨진 아이콘 대신 자리표시
// src 는 public 경로 문자열 (크기별 파일은 lib/image-loader 가 고름)
export default function SafeImage({ src, alt, ...rest }: ImageProps & { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
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
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
