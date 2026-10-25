import Script from "next/script";
import { GA_ID } from "@/lib/analytics";

// Google Analytics 4 - 페이지 로드가 끝난 뒤(lazyOnload) 받음
// @next/third-parties 의 GoogleAnalytics 는 afterInteractive 라 HTML 맨 위에 <link rel="preload"> 를 넣어서
// gtag.js(약 177KB, 높은 우선순위)가 첫 화면에 필요한 CSS · 폰트와 같은 시간에 받아짐 → 느린 망에서 첫 화면이 늦어짐
// dataLayer 는 바로 만들어 두어서, gtag.js 가 받아지기 전에 생긴 이벤트(trackEvent)도 쌓였다가 전송됨
export default function GoogleAnalytics() {
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
    </>
  );
}
