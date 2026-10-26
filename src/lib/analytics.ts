// Google Analytics 측정 ID - 운영(Vercel production) 배포에서만 태그를 넣음 (layout.tsx)
export const GA_ID = "G-DJ76KV1RBS";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// 사용자 행동 이벤트 - GA 태그가 없는 환경(로컬 · 미리보기)에선 조용히 건너뜀
// gtag.js 가 아직 안 받아졌어도 dataLayer 에 쌓아두면 받아진 뒤 그대로 전송됨
// 외부 링크(GitHub · LinkedIn 등) 클릭은 GA 향상된 측정이 'click' 이벤트로 자동 수집해서 따로 안 보냄
export function trackEvent(name: string, params: Record<string, string> = {}) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  // gtag() 와 같은 형식 - 배열이 아니라 arguments 객체여야 gtag.js 가 명령으로 읽음
  (function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  })("event", name, params);
}
