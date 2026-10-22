"use client";

import { useEffect } from "react";

// 제목·본문 폰트 페이퍼로지 (눈누, OFL·웹 임베딩 허용) - globals.css 의 --font-sans / --font-display 가 "Paperozi" 를 먼저 찾음
// CSS @font-face 로 두면 첫 화면 CSS 와 함께 VeryHigh 우선순위로 받아져서(굵기당 약 157KB, 3개 약 470KB)
// 첫 페인트·LCP 보다 먼저 끝나는 회차만 라이트하우스 시뮬레이션(Lantern)이 render-blocking 으로 계산 → 휴대폰 점수가 98 ↔ 70 으로 흔들림
// → window load 이후에 FontFace 를 등록해 요청 자체를 첫 화면 뒤로 미룸. 그 전엔 Pretendard 로 보이고 받아지면 바뀜(swap 과 같은 동작)
// 등록만 하고 load() 는 안 부름 - 화면에서 실제로 쓰는 굵기만 브라우저가 받음
const FAMILY = "Paperozi";
const BASE = "https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0";
const WEIGHTS: [string, string][] = [
  ["400", "Paperlogy-4Regular"],
  ["500", "Paperlogy-5Medium"],
  ["600", "Paperlogy-6SemiBold"],
  ["700", "Paperlogy-7Bold"],
  ["800", "Paperlogy-8ExtraBold"],
];

export default function HeadingFontLoader() {
  useEffect(() => {
    const register = () => {
      // 본문 폰트 Pretendard(npm, unicode-range 조각 CSS)도 같은 이유로 load 이후에 CSS 청크를 불러옴 - 그 전엔 시스템 글꼴
      import("pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css");
      // 클라이언트 이동·재마운트 때 중복 등록 방지
      if ([...document.fonts].some((f) => f.family.replace(/"/g, "") === FAMILY)) return;
      for (const [weight, file] of WEIGHTS) {
        document.fonts.add(new FontFace(FAMILY, `url("${BASE}/${file}.woff2") format("woff2")`, { weight, display: "swap" }));
      }
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);
  return null;
}
