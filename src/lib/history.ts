import type { RoadmapItem } from "@/lib/api";
import type { Lang } from "@/i18n";
import { HISTORY_KO } from "@/content/history/ko";
import { HISTORY_EN } from "@/content/history/en";

// 언어별 연혁 - period(YYYY.MM)로 연도별로 묶여 최신이 위로
export function getHistory(lang: Lang): RoadmapItem[] {
  return lang === "en" ? HISTORY_EN : HISTORY_KO;
}
