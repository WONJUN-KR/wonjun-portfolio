"use client";

import { Download } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// 이력서 PDF 저장 - 브라우저 인쇄 창을 열어 'PDF로 저장'으로 받음 (인쇄용 스타일은 globals.css 의 @media print)
// 별도 PDF 파일을 두지 않아서 사이트 내용과 항상 같음. 저장 파일 이름은 document.title 을 따라가므로 인쇄 동안만 바꿈
export default function PrintButton({ fileName, label, className = "" }: { fileName: string; label: string; className?: string }) {
  const onClick = () => {
    const prev = document.title;
    document.title = fileName;
    window.addEventListener("afterprint", () => (document.title = prev), { once: true });
    trackEvent("resume_pdf");
    window.print();
  };
  return (
    <button type="button" onClick={onClick} className={`print:hidden ${className}`}>
      <Download className="size-4" />
      {label}
    </button>
  );
}
