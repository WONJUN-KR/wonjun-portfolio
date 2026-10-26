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
  // live = 운영 중 / released = 앱 배포(서버는 내려감) / local = 로컬 실행
  status: "live" | "released" | "local";
  device: "mobile" | "laptop";
  mockup?: Mockup;
};

// 영어 파일(content/projects/en.ts)이 slug 별로 갖는 글자 - 배열은 한국어와 개수가 같아야 함(getProjects 가 검사)
export type ProjectText = {
  title: string;
  subtitle: string;
  period: string;
  role: string;
  tagline: string;
  features: string[];
  myPart: string[];
  mockup?: { note?: string; shots: string[]; videos: string[]; related?: string };
};

import { PROJECTS_KO } from "@/content/projects/ko";
import { PROJECTS_EN_TEXT } from "@/content/projects/en";
import type { Lang } from "@/i18n";

// 영어 글자를 한국어 기준 데이터에 덮어씀 - 배열 개수가 다르면(캡션 · 기능 줄 수) 어느 slug · 칸인지 알려주며 에러(빌드 때 걸림)
function withText(p: Project, text: ProjectText): Project {
  const same = (field: string, a: unknown[], b: unknown[]) => {
    if (a.length !== b.length) throw new Error(`[projects/en] '${p.slug}' ${field} 개수가 다름 (ko ${a.length} · en ${b.length})`);
  };
  same("features", p.features, text.features);
  same("myPart", p.myPart, text.myPart);
  let mockup = p.mockup;
  if (p.mockup) {
    if (!text.mockup) throw new Error(`[projects/en] '${p.slug}' mockup 글자가 없음`);
    same("mockup.shots", p.mockup.shots, text.mockup.shots);
    same("mockup.videos", p.mockup.videos, text.mockup.videos);
    const t = text.mockup;
    mockup = {
      ...p.mockup,
      note: t.note ?? p.mockup.note,
      shots: p.mockup.shots.map((s, i) => ({ ...s, caption: t.shots[i] })),
      videos: p.mockup.videos.map((v, i) => ({ ...v, caption: t.videos[i] })),
      related: p.mockup.related && { ...p.mockup.related, label: t.related ?? p.mockup.related.label },
    };
  }
  return { ...p, title: text.title, subtitle: text.subtitle, period: text.period, role: text.role, tagline: text.tagline, features: text.features, myPart: text.myPart, mockup };
}

const PROJECTS_EN: Project[] = PROJECTS_KO.map((p) => withText(p, PROJECTS_EN_TEXT[p.slug]));

// 언어별 프로젝트 목록 - 순서 · 사진 · 스택은 한국어 데이터 그대로
export function getProjects(lang: Lang): Project[] {
  return lang === "en" ? PROJECTS_EN : PROJECTS_KO;
}
