// 데이터: 글 = 네이버 블로그(src/content/posts.json, scripts/sync-naver.mjs 로 동기화), 잔디 = GitHub (src/lib/github.ts)
// 글을 누르면 네이버 원문으로 이동 - 시리즈 = 네이버 카테고리
import { contributionAllTime, contributionDays } from "@/lib/github";
import postsData from "@/content/posts.json";

export type Tag = {
  id: string;
  name: string;
};

export type PostListItem = {
  id: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  thumbnail: string | null;
  tags: Tag[];
  url: string; // 네이버 원문
};

type StoredPost = {
  id: string;
  title: string;
  excerpt: string | null;
  publishedAt: string;
  thumbnail: string | null;
  tags: string[];
  category: string;
  url: string;
};

const POSTS = postsData.posts as StoredPost[];

function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// 카테고리 이름 → 주소용 slug ("취업준비 기록지(21)" → "취업준비-기록지-21")
export function categorySlug(name: string): string {
  return name.replace(/[^가-힣a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toListItem(p: StoredPost): PostListItem {
  return {
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    thumbnail: p.thumbnail,
    tags: p.tags.map((name) => ({ id: name, name })),
    url: p.url,
  };
}

// 최신 글이 위
export async function getPosts(): Promise<PostListItem[]> {
  return POSTS.map(toListItem).sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export type SeriesListItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  postsCount: number;
  updatedAt: string | null;
};

export type SeriesPostItem = PostListItem & { seriesIndex: number | null };

export type SeriesDetail = SeriesListItem & {
  posts: SeriesPostItem[];
};

// 시리즈 = 네이버 카테고리. 글 수·업데이트일(가장 최근 글)은 글에서 계산, 최근 업데이트된 시리즈가 앞
export async function getSeriesList(): Promise<SeriesListItem[]> {
  const names = [...new Set(POSTS.map((p) => p.category).filter(Boolean))];
  return names
    .map((name) => {
      const mine = POSTS.filter((p) => p.category === name);
      const updatedAt = mine.map((p) => p.publishedAt).sort().at(-1) ?? null;
      const slug = categorySlug(name);
      return { id: slug, slug, name, description: null, postsCount: mine.length, updatedAt };
    })
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

// 시리즈 글은 오래된 글부터 1, 2, 3… 번호
export async function getSeries(slug: string): Promise<SeriesDetail | null> {
  const target = (await getSeriesList()).find((s) => s.slug === decodeSlug(slug));
  if (!target) return null;
  const mine = POSTS.filter((p) => categorySlug(p.category) === target.slug).sort((a, b) =>
    a.publishedAt.localeCompare(b.publishedAt),
  );
  return { ...target, posts: mine.map((p, i) => ({ ...toListItem(p), seriesIndex: i + 1 })) };
}

// 글 → 속한 시리즈 id (Log 필터용)
export function seriesIdOf(postId: string): string | null {
  const p = POSTS.find((x) => x.id === postId);
  return p?.category ? categorySlug(p.category) : null;
}

export type RoadmapStatus = "PLANNED" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "LEARNED";

export type RoadmapItem = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  period: string | null;
  story: string | null;
  status: RoadmapStatus;
  targetDate: string | null;
  sortOrder: number;
};

// 연혁(History) 데이터는 src/lib/history.ts 하드코딩 (백엔드 /api/roadmaps 는 더 이상 안 씀)

export type ContributionDay = {
  date: string;
  count: number;
};

export type ContributionsResponse = {
  totalCount: number;
  days: ContributionDay[];
};

// 잔디에 합산하는 GitHub 계정 (개인 + 회사)
export const GITHUB_ACCOUNTS = ["WONJUN-KR", "WonJun-Uxn"];

// 두 계정의 날짜별 기여를 더함 (year 없으면 최근 6개월)
const RECENT_MONTHS = 6;

export async function getContributions(year?: string): Promise<ContributionsResponse> {
  const perAccount = await Promise.all(GITHUB_ACCOUNTS.map((login) => contributionDays(login, year)));
  const merged = new Map<string, number>();
  for (const days of perAccount) {
    for (const d of days) merged.set(d.date, (merged.get(d.date) ?? 0) + d.count);
  }
  let days = [...merged.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
  // 연도를 안 고르면 최근 6개월만 (일요일부터 시작해 주 단위로 깔끔하게)
  if (!year) {
    const from = new Date();
    from.setUTCMonth(from.getUTCMonth() - RECENT_MONTHS);
    from.setUTCDate(from.getUTCDate() - from.getUTCDay());
    const fromKey = from.toISOString().slice(0, 10);
    days = days.filter((d) => d.date >= fromKey);
  }
  return { totalCount: days.reduce((sum, d) => sum + d.count, 0), days };
}

// GitHub 계정 하나의 가입 이후 전체 기여 합계 - 홈 숫자 카드용
export async function getGithubContributionAllTime(username: string): Promise<number> {
  return contributionAllTime(username);
}

// kind: 같은 분야(백엔드 등) 안의 세부 묶음 - 언어·프레임워크·라이브러리·데이터베이스
export type SkillItem = { name: string; kind?: string };

export type CareerProject = {
  title: string;
  period: string;
  details: string[];
};

export type CareerItem = {
  company: string;
  position?: string;
  role?: string;
  period: string;
  isCurrent?: boolean;
  region?: string;
  resignReason?: string;
  summary?: string;
  projects?: CareerProject[];
  stack?: string[];
  sortOrder: number;
};

export type EducationItem = {
  school: string;
  department?: string;
  period: string;
  status?: string;
  region?: string;
  gpa?: string;
  projects?: string[];
  sortOrder: number;
};

export type TrainingItem = {
  org: string;
  course: string;
  period: string;
  learned?: string[];
  sortOrder: number;
};

export type CertificationItem = {
  name: string;
  issuer: string;
  acquiredAt: string;
};

export type PortfolioItem = {
  title: string;
  url: string;
  period: string;
  teamSize?: number;
};

export type AboutProfile = {
  name: string;
  tagline: string;
  email: string;
  region: string;
  careerPeriod: string;
  isEmployed: boolean;
  contacts: {
    githubPersonal?: string;
    blog?: string;
    linkedin?: string;
  };
  intro: string;
};

export type AboutContent = {
  profile: AboutProfile;
  careers: CareerItem[];
  educations: EducationItem[];
  trainings: TrainingItem[];
  certifications: CertificationItem[];
  skills: Record<string, SkillItem[]>;
  portfolios: PortfolioItem[];
  military?: { status: string; type: string; period: string };
  coverLetter: string;
};
