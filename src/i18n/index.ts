import type { Lang } from "./config";
import { ko, type DictKey } from "./locales/ko";
import { en } from "./locales/en";

export * from "./config";
export type { DictKey };

const DICTIONARIES: Record<Lang, Partial<Record<DictKey, string>>> = { ko, en };

// 사전 찾기 - 그 언어에 없으면 한국어, 그것도 없으면 키 문자열. {name} 같은 자리는 vars 로 채움
export function t(lang: Lang, key: DictKey, vars?: Record<string, string | number>): string {
  const text = DICTIONARIES[lang][key] ?? ko[key] ?? key;
  return vars ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : text;
}
