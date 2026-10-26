import type { DictKey } from "./ko";

// 짧은 UI 문구 사전 (영어) - ko.ts 와 키가 정확히 같아야 함(satisfies: 빠진 키 · 남는 키 모두 타입 에러)
export const en = {
  "site.name": "WonJun Oh Portfolio",
  "site.description": "Full-stack developer in medical IT",
  "nav.logoSuffix": " · PORTFOLIO",
  "nav.resume": "Resume",
  "nav.projects": "Projects",
  "nav.log": "Log",
  "nav.history": "History",
  "lang.switch.short": "KO",
  "lang.switch.label": "한국어로 보기",
  "footer.analytics": "This site uses Google Analytics (cookies) for visitor statistics.",
  "meta.resume.title": "Resume",
  "meta.resume.description": "Career summary",
  "meta.projects.title": "Projects",
  "meta.projects.description": "Personal projects",
  "meta.log.title": "Log",
  "meta.log.description": "Tech blog",
  "meta.history.title": "History",
  "meta.history.description": "Timeline",
  "meta.series.description": "Blog series '{name}' - {count} posts in order.",
  "notFound.title": "Page not found",
  "notFound.body": "The address may have changed, or the page doesn't exist.",
  "notFound.home": "Go home",
} satisfies Record<DictKey, string>;
