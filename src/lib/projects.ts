export type Repo = { label: string; url: string };

// 프로젝트 화면 둘러보기(팝업) - 로컬에서 띄워 찍은 스크린샷과 짧은 흐름 영상. 팝업을 열 때만 불러옴
export type MockupShot = { src: string; caption: string };
export type MockupVideo = { webm: string; mp4: string; poster: string; caption: string };
// related: 팝업 안에서 바로 넘어갈 짝 프로젝트 (예: 같은 서비스의 2021 원본 ↔ 2026 리빌드)
export type Mockup = { shots: MockupShot[]; videos: MockupVideo[]; note?: string; related?: { slug: string; label: string } };

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
  // 순서: 언어 → 프레임워크 → 라이브러리 → DB → 인프라, 같은 종류 안에서는 백엔드 → 프론트엔드 (이력서 경력 스택과 같은 규칙)
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
    stack: ["Java", "TypeScript", "Spring Boot", "Next.js", "카카오맵", "PostgreSQL", "Vercel"],
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
    mockup: {
      videos: [],
      shots: [
        { src: "/projects/mockups/gotcha/01-home-list.jpg", caption: "홈 - 지도 + 주변 가챠샵 목록(영업 중 · 거리순)" },
        { src: "/projects/mockups/gotcha/02-search.jpg", caption: "위치 검색 - 입력하는 대로 장소 자동완성" },
        { src: "/projects/mockups/gotcha/03-pin-preview.jpg", caption: "핀을 누르면 미리보기 바텀시트 - 주소 · 영업일 · 영업 시간 · 매장 사진" },
        { src: "/projects/mockups/gotcha/04-detail-photos.jpg", caption: "매장 상세 - 매장 사진 모아보기" },
        { src: "/projects/mockups/gotcha/05-report-map.jpg", caption: "제보하기 - 지도에서 위치를 찍으면 주소가 자동으로" },
        { src: "/projects/mockups/gotcha/06-report-form.jpg", caption: "매장 정보 등록 - 매장명 · 위치 힌트 · 영업 정보" },
      ],
      note: "운영 중인 서비스(gotcha.it.com)에서 찍은 화면이에요.",
    },
  },
  {
    slug: "eureka-2026",
    title: "유레카 (2026 리빌드)",
    subtitle: "여행 장소 공유 커뮤니티 - 2021 팀 프로젝트를 최신 스택으로 다시 설계 · 개인 프로젝트",
    period: "2026.01 ~ 진행중",
    role: "1인 · 풀스택",
    tagline: "2021 팀 프로젝트를 Next.js 16 · Spring Boot 3.5로 다시 만들고, 화면 구조는 원본 그대로 반응형으로",
    features: [
      "지역·도시·테마 필터를 주소(쿼리스트링)로 관리 - 새로고침해도, 링크를 공유해도 같은 화면",
      "로그인 · 토큰 재발급 · 좋아요 · 사진 업로드 글쓰기 (S3 ↔ 로컬 디스크 저장소를 프로필로 교체)",
      "이미지 최적화로 홈 이미지 전송량 7.2MB → 0.9MB(-88%)",
    ],
    myPart: [
      "기획 해석부터 FE · BE · 로컬 개발 환경 · 검수 자동화까지 전부 (1인)",
      "[BE] JWT 인증 · 게시글 · 좋아요 · 이미지 API, 이미지 저장소 추상화(S3 / 로컬), 원본 기준 시드 데이터",
      "[FE] 원본 화면 구조(메가 메뉴 · Best 픽 · 떠나기 좋은 도시 · 글쓰기)를 반응형으로 재구성",
      "[개발 환경] docker-compose + local 프로필로 한 번에 실행, headless 브라우저 검수 스크립트",
    ],
    stack: ["Java", "TypeScript", "Spring Boot", "Next.js", "React", "Tailwind CSS", "TanStack Query", "Zustand", "PostgreSQL", "Docker"],
    repos: [
      { label: "Frontend", url: "https://github.com/WONJUN-KR/Eureka-FE" },
      { label: "Backend", url: "https://github.com/WONJUN-KR/Eureka-BE" },
    ],
    // 2026 배너 사진(흐림·어둡게) + 같은 흰색 헤더 로고로 합성 - 2021 썸네일과 같은 방식
    thumbnail: "/projects/mockups/eureka-2026/thumb.jpg",
    status: "local",
    device: "laptop",
    mockup: {
      videos: [
        { webm: "/projects/mockups/eureka-2026/main-scroll.webm", mp4: "/projects/mockups/eureka-2026/main-scroll.mp4", poster: "/projects/mockups/eureka-2026/01-main-banner.jpg", caption: "메인 화면 - 배너 · 장점 · Best 픽 · 떠나기 좋은 도시" },
        { webm: "/projects/mockups/eureka-2026/write-flow.webm", mp4: "/projects/mockups/eureka-2026/write-flow.mp4", poster: "/projects/mockups/eureka-2026/14-write.jpg", caption: "글쓰기 → 사진 2장 업로드 → 등록 → 상세" },
      ],
      shots: [
        { src: "/projects/mockups/eureka-2026/01-main-banner.jpg", caption: "메인 배너" },
        { src: "/projects/mockups/eureka-2026/02-main-megamenu.jpg", caption: "지역·테마 메가 메뉴" },
        { src: "/projects/mockups/eureka-2026/04-main-bestpick.jpg", caption: "이 달의 Best 픽 - 카테고리별 좋아요 1위" },
        { src: "/projects/mockups/eureka-2026/05-main-recommend.jpg", caption: "떠나기 좋은 도시" },
        { src: "/projects/mockups/eureka-2026/08-posts.jpg", caption: "게시글 목록 - 지역·카테고리 필터" },
        { src: "/projects/mockups/eureka-2026/10-detail.jpg", caption: "게시글 상세 - 사진 · 좋아요" },
        { src: "/projects/mockups/eureka-2026/14-write.jpg", caption: "글쓰기 - 사진 업로드" },
        { src: "/projects/mockups/eureka-2026/15-mobile-home.jpg", caption: "휴대폰 화면 (390px)" },
      ],
      note: "로컬에서 띄워 시연용 데이터로 찍은 화면이에요. 사진은 Unsplash 무료 이미지입니다.",
      related: { slug: "eureka-2021", label: "2021 원본 보기" },
    },
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
    stack: ["Java", "TypeScript", "Spring Boot", "JPA", "RabbitMQ", "React", "PostgreSQL"],
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
    mockup: {
      videos: [
        { webm: "/projects/mockups/cos-house/shop-flow.webm", mp4: "/projects/mockups/cos-house/shop-flow.mp4", poster: "/projects/mockups/cos-house/03-shop.jpg", caption: "홈 → 쇼핑 → 상품 상세(옵션 · 리뷰) → 장바구니 담기 → 장바구니" },
        { webm: "/projects/mockups/cos-house/community-flow.webm", mp4: "/projects/mockups/cos-house/community-flow.mp4", poster: "/projects/mockups/cos-house/19-post-detail.jpg", caption: "집들이 목록 → 글 상세 → 사진 넘기기 → 댓글 · 답글" },
      ],
      shots: [
        { src: "/projects/mockups/cos-house/01-home.jpg", caption: "메인" },
        { src: "/projects/mockups/cos-house/03-shop.jpg", caption: "쇼핑 - 카테고리 탭 · 상품 목록" },
        { src: "/projects/mockups/cos-house/04-product-detail.jpg", caption: "상품 상세 - 옵션 · 장바구니 / 구매" },
        { src: "/projects/mockups/cos-house/18-community.jpg", caption: "커뮤니티 - 집들이 목록" },
        { src: "/projects/mockups/cos-house/19-post-detail.jpg", caption: "집들이 상세 - 사진 슬라이드 · 댓글" },
        { src: "/projects/mockups/cos-house/14-mypage-reviews.jpg", caption: "마이페이지 - 내가 쓴 구매 후기 (담당)" },
        { src: "/projects/mockups/cos-house/20-admin.jpg", caption: "관리자 대시보드" },
        { src: "/projects/mockups/cos-house/21-admin-products.jpg", caption: "관리자 상품 관리 · 검색 (담당)" },
        { src: "/projects/mockups/cos-house/26-mobile-home.jpg", caption: "휴대폰 화면 (390px)" },
      ],
      note: "로컬에서 띄워 시연용 데이터로 찍은 화면이에요. 상품 사진은 외부 판매자 이미지라 흐리게 처리했고, 집들이 사진은 Unsplash 무료 이미지입니다.",
    },
  },
  {
    slug: "eureka-2021",
    title: "유레카 (2021 원본)",
    subtitle: "여행 장소 공유 커뮤니티 · 2021 국비 과정 팀 프로젝트",
    period: "2021",
    role: "3인 팀 · 풀스택",
    tagline: "혼자 알기 아까운 여행지를 사진과 함께 공유하는 JSP 커뮤니티",
    features: [
      "지역(시·도 → 도시)·테마 메가 메뉴로 장소 찾기",
      "단계별 글쓰기 창: 카테고리 → 지역 → 누구와 → 세부 테마 → 사진 → 업로드",
      "이 달의 Best 픽 · 떠나기 좋은 도시 · 읽기 창",
    ],
    myPart: [
      "[2026 복원] DB 덤프 없이 DAO SQL로 스키마를 거꾸로 설계해 Oracle(docker)에 재구성",
      "[2026 복원] 코드에 박혀 있던 DB 접속 정보를 환경변수 설정으로 분리",
      "[2026 복원] Tomcat 9 + Oracle 한 줄 실행 스크립트, 화면 캡처 · 흐름 영상 정리",
    ],
    stack: ["Java", "Servlet", "JSP", "JDBC", "jQuery", "Oracle", "Tomcat"],
    repos: [{ label: "Repo", url: "https://github.com/WONJUN-KR/Eureka-2021" }],
    // 원본 배너 사진(흐림·어둡게) + 원본 흰색 헤더 로고로 합성한 썸네일
    thumbnail: "/projects/mockups/eureka-2021/thumb.jpg",
    status: "local",
    device: "laptop",
    mockup: {
      videos: [
        { webm: "/projects/mockups/eureka-2021/main-scroll.webm", mp4: "/projects/mockups/eureka-2021/main-scroll.mp4", poster: "/projects/mockups/eureka-2021/01-main-banner.jpg", caption: "메인 화면 - 배너 · 메가 메뉴 · Best 픽 · 떠나기 좋은 도시" },
        { webm: "/projects/mockups/eureka-2021/write-flow.webm", mp4: "/projects/mockups/eureka-2021/write-flow.mp4", poster: "/projects/mockups/eureka-2021/14-write-modal.jpg", caption: "단계별 글쓰기 → 사진 업로드 → 저장 → 목록 → 읽기 창" },
      ],
      shots: [
        { src: "/projects/mockups/eureka-2021/01-main-banner.jpg", caption: "메인 배너" },
        { src: "/projects/mockups/eureka-2021/02-main-megamenu.jpg", caption: "지역·테마 메가 메뉴" },
        { src: "/projects/mockups/eureka-2021/04-main-bestpick.jpg", caption: "이 달의 Best 픽" },
        { src: "/projects/mockups/eureka-2021/05-main-recommend.jpg", caption: "떠나기 좋은 도시" },
        { src: "/projects/mockups/eureka-2021/08-boardlist.jpg", caption: "게시글 목록" },
        { src: "/projects/mockups/eureka-2021/10-read-popup.jpg", caption: "읽기 창" },
        { src: "/projects/mockups/eureka-2021/14-write-modal.jpg", caption: "단계별 글쓰기 창" },
      ],
      note: "2021년 원본 코드를 2026년에 로컬(Tomcat 9 + Oracle)로 다시 띄워 찍은 화면이에요.",
      related: { slug: "eureka-2026", label: "2026 리빌드 보기" },
    },
  },
];
