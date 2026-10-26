import HomeView from "@/components/HomeView";
import { getAbout } from "@/lib/about";

// ?year= 는 읽지 않음 - 연도 전환은 잔디 컴포넌트가 브라우저에서 /api/contributions 로 처리 → 홈을 정적(ISR) 페이지로
export default function Home() {
  return <HomeView about={getAbout("ko")} lang="ko" />;
}
