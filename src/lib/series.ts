// Velog 시리즈 이름 끝의 연도 표기 "(26)", "(22~24)" 를 떼어내 "2026", "2022 ~ 2024" 로 보여줌
const YEAR_SUFFIX = /\s*\((\d{2})(?:\s*~\s*(\d{2})?)?\)\s*$/;

export function splitSeriesName(name: string): { title: string; years: string | null } {
  const m = name.match(YEAR_SUFFIX);
  if (!m) return { title: name, years: null };
  const from = `20${m[1]}`;
  const years = m[2] ? `${from} ~ 20${m[2]}` : name.includes("~") ? `${from} ~` : from;
  return { title: name.slice(0, m.index).trim(), years };
}
