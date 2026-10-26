import NotFoundView from "@/components/NotFoundView";

// 이 언어 안에서 notFound() 가 불렸을 때(없는 시리즈 등) - 레이아웃 · 언어 그대로 404
export default function NotFound() {
  return <NotFoundView lang="en" />;
}
