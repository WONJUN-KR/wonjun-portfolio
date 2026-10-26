import { notFound } from "next/navigation";

// /en 아래 없는 주소 → 영어 레이아웃의 404(not-found.tsx) - 이게 없으면 전역 404(global-not-found)로 가서 언어가 안 맞음
export default function MissingPage() {
  notFound();
}
