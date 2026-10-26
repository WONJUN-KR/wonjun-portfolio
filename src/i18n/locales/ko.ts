// 짧은 UI 문구 사전 (한국어) - 키는 '화면.의미'. 문구를 추가 · 수정할 땐 en.ts 도 항상 같이
// en.ts 는 이 파일의 키를 그대로 요구해서(satisfies) 키가 빠지거나 남으면 타입 검사(빌드)가 실패함
export const ko = {
  "site.name": "오원준 포트폴리오",
  "site.description": "의료 IT 풀스택 개발자",
  "nav.logoSuffix": " · PORTFOLIO",
  "nav.resume": "Resume",
  "nav.projects": "Projects",
  "nav.log": "Log",
  "nav.history": "History",
  "lang.switch.short": "EN",
  "lang.switch.label": "English 버전으로 보기",
  "footer.analytics": "방문 통계에 Google Analytics(쿠키)를 써요.",
  "meta.resume.title": "이력서",
  "meta.resume.description": "경력 기술서",
  "meta.projects.title": "포트폴리오",
  "meta.projects.description": "개인 프로젝트",
  "meta.log.title": "기록",
  "meta.log.description": "기술 블로그",
  "meta.history.title": "연혁",
  "meta.history.description": "연혁",
  "meta.series.description": "기술 블로그 시리즈 '{name}' - 글 {count}편을 순서대로 모아 봅니다.",
  "notFound.title": "페이지를 찾을 수 없어요",
  "notFound.body": "주소가 바뀌었거나 없는 페이지예요.",
  "notFound.home": "홈으로",
} as const;

export type DictKey = keyof typeof ko;
