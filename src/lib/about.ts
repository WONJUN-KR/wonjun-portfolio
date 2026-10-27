import type { AboutContent, SkillItem } from "@/lib/api";
import type { Lang } from "@/i18n";
import { ABOUT_KO, HOME_HIGHLIGHTS_KO } from "@/content/about/ko";
import { ABOUT_EN, HOME_HIGHLIGHTS_EN } from "@/content/about/en";

export { totalCareerPeriod } from "@/lib/career";

// 스킬을 kind 별로 묶음 (처음 나온 순서 유지, kind 없으면 한 덩어리)
export function groupSkillsByKind(items: SkillItem[]): { kind?: string; items: SkillItem[] }[] {
  const groups: { kind?: string; items: SkillItem[] }[] = [];
  for (const s of items) {
    const g = groups.find((x) => x.kind === s.kind);
    if (g) g.items.push(s);
    else groups.push({ kind: s.kind, items: [s] });
  }
  return groups;
}

// 언어별 파일의 경력 · 학력 id 가 서로 다르면 경고 - 한국어에 항목을 추가했는데 영어가 옛날 그대로 남는 걸 빌드 로그에서 잡음 (에러는 아님)
function warnIdMismatch(section: string, ko: { id?: string }[], en: { id?: string }[]) {
  const a = ko.map((x) => x.id ?? "?").join(","), b = en.map((x) => x.id ?? "?").join(",");
  const ka = new Set(a.split(",")), kb = new Set(b.split(","));
  if ([...ka].some((x) => !kb.has(x)) || [...kb].some((x) => !ka.has(x))) console.warn(`[about] ${section} id 가 언어끼리 다름 - ko: ${a} / en: ${b}`);
}
warnIdMismatch("careers", ABOUT_KO.careers, ABOUT_EN.careers);
warnIdMismatch("educations", ABOUT_KO.educations, ABOUT_EN.educations);

export function getAbout(lang: Lang): AboutContent {
  return lang === "en" ? ABOUT_EN : ABOUT_KO;
}

// 홈 숫자 카드 - 커밋 수 대신 결과 지표 (basis = 근거 한 줄)
export function getHomeHighlights(lang: Lang): { label: string; value: string; basis: string }[] {
  return lang === "en" ? HOME_HIGHLIGHTS_EN : HOME_HIGHLIGHTS_KO;
}
