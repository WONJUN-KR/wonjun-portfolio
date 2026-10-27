import { getLocale } from "next-intl/server";
import NotFoundView from "@/components/NotFoundView";

// 이 언어 안에서 notFound() 가 불렸을 때(없는 시리즈 · 없는 주소) - 레이아웃 · 언어 그대로 404
export default async function NotFound() {
  return <NotFoundView lang={await getLocale()} />;
}
