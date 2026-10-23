export type Repo = { label: string; url: string };

// 프로젝트 화면 둘러보기(팝업) - 로컬에서 띄워 찍은 스크린샷과 짧은 흐름 영상. 팝업을 열 때만 불러옴
export type MockupShot = { src: string; caption: string };
export type MockupVideo = { webm: string; mp4: string; poster: string; caption: string };
export type Mockup = { shots: MockupShot[]; videos: MockupVideo[]; note?: string };

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  // 앱스토어식 소개: 사용자가 이걸로 뭘 할 수 있는지(tagline·features) → 내가 맡은 부분(myPart)
  tagline: string;
  features: string[];
  myPart: string[];
  stack: string[];
  liveUrl?: string;
  repos: Repo[];
  thumbnail?: string;
  // 홈 휴대폰 카드(낮은 5:2)에서 썸네일 어디를 보여줄지 - 없으면 위쪽
  mobileThumbPosition?: string;
  logo?: string;
  pinned?: boolean;
  lead?: boolean; // 팀장 - projects 페이지에 '팀장' 배지
  status: "live" | "local";
  device: "mobile" | "laptop";
  mockup?: Mockup;
};

export const PROJECTS: Project[] = [
  {
    slug: "gotcha",
    title: "GOTCHA",
    subtitle: "가챠샵 지도 서비스 · App Store 출시",
    period: "2026.01 ~ 진행중",
    role: "5인 팀 · 풀스택",
    tagline: "근처 가챠샵을 지도에서 찾고, 리뷰와 제보로 함께 채워가는 서비스",
    features: [
      "지도에서 주변 가챠샵 찾기 - 핀을 누르면 미리보기, 이 지역 다시 검색",
      "매장 정보·리뷰 보고 즐겨찾기",
      "새 가챠샵 제보 - 지도에서 위치를 찍으면 주소가 자동으로",
      "새 소식 알림 받기",
    ],
    myPart: [
      "[FE] 홈 지도 탐색 - 핀 미리보기 바텀시트(3단 스냅), 뒤로가기 시 위치·줌 복원",
      "[FE] 제보 등록 흐름 전체, 마이페이지·내가 제보한 업체",
      "[FE+BE] 신고·차단, Web Push 알림(구독 화면 + 발송 서버)",
      "초기 세팅·GitHub Actions CI/CD, 웹 성능 최적화(Critical CSS·폰트·preconnect)",
    ],
    stack: ["Java", "TypeScript", "Spring Boot", "Next.js", "카카오맵", "Vercel", "PostgreSQL"],
    liveUrl: "https://gotcha.it.com/",
    repos: [
      { label: "Frontend", url: "https://github.com/fcde-project9/GOTCHA-FE" },
      { label: "Backend", url: "https://github.com/fcde-project9/GOTCHA-BE" },
    ],
    thumbnail: "/projects/gotcha.png",
    mobileThumbPosition: "max-sm:object-bottom", // 휴대폰(홈 카드·Projects)에선 글자 대신 캐릭터 얼굴이 보이게
    pinned: true,
    status: "live",
    device: "laptop",
  },
  {
    slug: "ai-auto-posting",
    title: "AI Auto Posting",
    subtitle: "블로그 콘텐츠 자동 발행 플랫폼",
    period: "2025.11 ~ 2025.12",
    role: "6인 팀 · 풀스택",
    lead: true,
    tagline: "트렌드 키워드로 AI가 블로그 글을 쓰고, 연결한 블로그에 자동 발행",
    features: [
      "블로그 계정을 연결하고 발행 워크플로우 등록",
      "트렌드 키워드 수집 → AI 글 생성 → 자동 발행",
      "발행 기록·결과 확인",
    ],
    myPart: [
      "[리드] 주제 선정·역할 분배·일정 조율, 팀 협업 규칙 정립",
      "[BE] 관리자 통계 API - 사용자·포스팅·블로그 플랫폼별 발행 통계, AI 토큰 사용량",
      "[BE] 일별 통계 자동 집계 스케줄러, 통계 쿼리 최적화(ISO 주차 버그 수정)",
      "[BE] 관리자 사용자 관리(본인·관리자 정지 방지), 공통코드 관리",
      "[FE] 관리자 대시보드 추이 그래프·통계 테이블 페이징·공통코드 페이지",
    ],
    stack: ["Java", "Spring Boot", "React", "JPA", "RabbitMQ", "PostgreSQL"],
    repos: [
      { label: "Frontend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Frontend" },
      { label: "Backend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Backend" },
    ],
    logo: "/projects/ocp.png",
    status: "local",
    device: "laptop",
    mockup: {
      videos: [
        { webm: "/projects/mockups/ai-auto-posting/flow-1-register-and-run.webm", mp4: "/projects/mockups/ai-auto-posting/flow-1-register-and-run.mp4", poster: "/projects/mockups/ai-auto-posting/02-workflow-settings.jpg", caption: "워크플로우 설정 → 테스트 실행 → 진행 중 → 완료 → 등록" },
        { webm: "/projects/mockups/ai-auto-posting/flow-2-result.webm", mp4: "/projects/mockups/ai-auto-posting/flow-2-result.mp4", poster: "/projects/mockups/ai-auto-posting/05-generated-post.jpg", caption: "생성된 글 확인 → 단계별 실행 로그" },
      ],
      shots: [
        { src: "/projects/mockups/ai-auto-posting/01-home.jpg", caption: "메인" },
        { src: "/projects/mockups/ai-auto-posting/02-workflow-settings.jpg", caption: "워크플로우 설정 - 사이트 · 반복 규칙 · 상품 카테고리 · 블로그" },
        { src: "/projects/mockups/ai-auto-posting/03-run-in-progress.jpg", caption: "테스트 실행 - 진행 중" },
        { src: "/projects/mockups/ai-auto-posting/04-run-completed.jpg", caption: "테스트 완료 - AI 글 생성 · 블로그 업로드 성공" },
        { src: "/projects/mockups/ai-auto-posting/05-generated-post.jpg", caption: "생성된 글 - 선택 상품 · 트렌드 키워드 · 제목 · 본문" },
        { src: "/projects/mockups/ai-auto-posting/06-step-logs.jpg", caption: "단계별 실행 로그 - 크롤링 → 상품 추출 → AI 콘텐츠 생성 → 블로그 포스팅" },
      ],
      note: "OpenAI 키 없이 로컬에서 띄워 시연용 데이터로 찍은 화면이에요. 생성 결과는 예시 데이터입니다.",
    },
  },
  {
    slug: "cos-house",
    title: "Co's House",
    subtitle: "인테리어 커뮤니티 + 쇼핑 플랫폼",
    period: "2025.09 ~ 2025.10",
    role: "5인 팀 · 풀스택",
    lead: true,
    tagline: "'오늘의 집'처럼 인테리어 이야기를 나누고 상품까지 사는 커머스",
    features: [
      "인테리어 상품 검색·구매(토스 결제)",
      "인테리어 커뮤니티 - 글·댓글",
      "구매 후기와 마이페이지",
    ],
    myPart: [
      "[리드] 주제 선정·역할 분배·일정 조율, 팀 협업 규칙 정립",
      "[BE] 마이페이지 - 회원정보 수정·구매 후기·회원 탈퇴",
      "[BE] 관리자 상품 관리·검색, 주문 관리",
      "[BE] 커뮤니티 댓글·게시글 수정",
      "화면(Thymeleaf)·CSS 리팩토링",
    ],
    stack: ["Java", "Spring Boot", "JPA", "Querydsl", "Thymeleaf", "MySQL"],
    repos: [{ label: "Repo", url: "https://github.com/WONJUN-KR/Co-s_House" }],
    logo: "/projects/coshouse.png",
    status: "local",
    device: "laptop",
  },
];
