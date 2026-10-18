import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Building2, ChevronDown, Mail } from "lucide-react";
import ContributionsCalendar from "@/components/ContributionsCalendar";
import YearSelector from "@/components/YearSelector";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Chip, SectionHeader } from "@/components/ui";
import { getContributions, getPosts, type AboutContent } from "@/lib/api";
import { HOME_HIGHLIGHTS } from "@/lib/about";
import { PROJECTS } from "@/lib/projects";

const EARLIEST_YEAR = 2020;
const LATEST_POSTS_COUNT = 3;
const FEATURED_PROJECTS_COUNT = 3;

const COMPANY_LOGOS: Record<string, string> = {
  "(주)유엑스엔": "/logos/uxn.jpg",
  "상상스토리(주)": "/logos/sangs.jpg",
};

const PROFILE_IMG = "/img/profile.jpg";
const hasProfileImg = fs.existsSync(path.join(process.cwd(), "public", PROFILE_IMG));

function availableYears(): number[] {
  const now = new Date().getFullYear();
  const years: number[] = [];
  for (let y = now; y >= EARLIEST_YEAR; y--) years.push(y);
  return years;
}

// 홈 본문 - 이력서 데이터는 src/lib/about.ts 하드코딩
export default async function HomeView({ year, about }: { year?: string; about: AboutContent }) {
  const [contributions, posts] = await Promise.all([
    getContributions(year).catch(() => null),
    getPosts().catch(() => []),
  ]);

  const profile = about?.profile;
  const contacts = profile?.contacts;
  const careers = [...(about?.careers ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const latestPosts = posts.slice(0, LATEST_POSTS_COUNT);
  const featured = PROJECTS.slice(0, FEATURED_PROJECTS_COUNT);

  // 숫자 카드 - 커밋 수 같은 활동량 대신 결과 지표 + 근거 한 줄
  const stats = [
    { label: "경력", value: profile?.careerPeriod ?? "-", basis: "CGM 의료기기 기업 재직" },
    ...HOME_HIGHLIGHTS,
  ];

  return (
    <div className="flex flex-col gap-28 py-6">
      {/* Hero */}
      <section className="animate-fade-up flex flex-col-reverse sm:flex-row sm:items-start gap-10 sm:gap-10 pt-2">
        <div className="flex flex-col gap-6 min-w-0">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.15] bg-gradient-to-br from-foreground via-foreground to-accent-2 bg-clip-text text-transparent">
              {profile?.tagline ?? "풀스택 개발자"}
            </h1>
            <p className="text-lg text-muted">안녕하세요, {profile?.name ?? "WonJun"}입니다.</p>
          </div>
          {profile?.intro && (
            <p className="text-base sm:text-lg leading-relaxed text-muted whitespace-pre-line">
              {profile.intro}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent-strong text-foreground font-bold px-5 py-2.5 text-sm font-semibold hover:opacity-85 transition-opacity"
              >
                <Mail className="size-4" />
                연락하기
              </a>
            )}
            {contacts?.githubPersonal && (
              <a
                href={contacts.githubPersonal}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
            )}
            {contacts?.blog && (
              <a
                href={contacts.blog}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                <BookOpen className="size-4" />
                Blog
              </a>
            )}
            {contacts?.linkedin && (
              <a
                href={contacts.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                <LinkedinIcon className="size-4" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
        <div className="shrink-0 size-40 sm:size-60 rounded-3xl overflow-hidden border border-line bg-surface flex items-center justify-center">
          {hasProfileImg ? (
            <Image src={PROFILE_IMG} alt={profile?.name ?? "WonJun"} width={416} height={416} className="size-full object-cover object-[center_5%]" />
          ) : (
            <span className="text-5xl sm:text-7xl font-bold tracking-tight text-muted/40">WJ</span>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="animate-fade-up [animation-delay:100ms] grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5 flex flex-col gap-1">
            <span className="text-sm text-muted">{s.label}</span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-accent-2">{s.value}</span>
            <span className="text-xs text-muted truncate" title={s.basis}>{s.basis}</span>
          </div>
        ))}
      </section>

      {/* Experience - 타임라인 */}
      {careers.length > 0 && (
        <section className="flex flex-col gap-8">
          <SectionHeader eyebrow="Experience" title="경력" href="/resume" linkLabel="이력서 보기" />
          <ol className="relative flex flex-col gap-4">
            {careers.map((c) => {
              const logo = COMPANY_LOGOS[c.company];
              return (
                <li key={c.company + c.period} className="rounded-3xl border border-line bg-surface p-6 sm:p-8 flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 size-12 rounded-xl bg-white border border-line flex items-center justify-center overflow-hidden p-1.5">
                      {logo ? (
                        <Image src={logo} alt={c.company} width={96} height={96} unoptimized className="size-full object-contain" />
                      ) : (
                        <Building2 className="size-6 text-muted" />
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 flex-1 min-w-0">
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-lg font-bold tracking-tight">{c.company}</h3>
                        <span className="text-sm text-muted">
                          {[c.role, c.position].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                      <span className="text-sm tabular-nums text-muted shrink-0">
                        {c.period}
                      </span>
                    </div>
                  </div>
                  {c.summary && <p className="text-base leading-relaxed">{c.summary}</p>}
                  {c.projects && c.projects.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {c.projects.map((proj) => (
                        <details key={proj.title} className="group rounded-2xl border border-line bg-background open:bg-background">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                            <span className="font-semibold text-sm sm:text-base">{proj.title}</span>
                            <span className="flex items-center gap-3 shrink-0">
                              <span className="hidden sm:inline text-xs tabular-nums text-muted">{proj.period}</span>
                              <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
                            </span>
                          </summary>
                          <ul className="flex flex-col gap-2 px-5 pb-5 text-sm text-muted">
                            {proj.details.map((d) => (
                              <li key={d} className="relative pl-4 before:absolute before:left-0 before:top-2 before:size-1 before:rounded-full before:bg-accent">
                                {d}
                              </li>
                            ))}
                          </ul>
                        </details>
                      ))}
                    </div>
                  )}
                  {c.stack && c.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {c.stack.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Projects - 벤토 그리드: 첫 카드는 크게 */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Projects" title="포트폴리오" href="/projects" linkLabel="전체 보기" />
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
          {featured.map((p, i) => {
            const isHero = i === 0;
            const visual = p.thumbnail ?? p.logo;
            return (
              <Link
                key={p.slug}
                href="/projects"
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 ${
                  isHero ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                {visual && (
                  <div className={`relative bg-background border-b border-line overflow-hidden ${isHero ? "aspect-[16/9]" : "aspect-[16/7]"}`}>
                    <Image
                      src={visual}
                      alt={p.title}
                      fill
                      unoptimized
                      className={`${p.thumbnail ? "object-cover object-top" : "object-contain p-6"} transition-transform duration-500 group-hover:scale-[1.03]`}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3 p-6 flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>{p.period}</span>
                    {p.status === "live" && (
                      <span className="rounded-full bg-accent-soft text-accent-2 px-2 py-0.5 font-semibold">운영 중</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className={`${isHero ? "text-2xl" : "text-lg"} font-bold tracking-tight`}>{p.title}</h3>
                      <p className="text-sm text-muted">{p.subtitle}</p>
                    </div>
                    <ArrowUpRight className="size-5 shrink-0 text-muted transition-all group-hover:text-accent-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {p.stack.slice(0, isHero ? 6 : 3).map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Activity - 글 + 잔디 */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Activity" title="기록" href="/log" linkLabel="모든 글" />
        {latestPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/log/${encodeURIComponent(post.slug)}`}
                className="group flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/40"
              >
                <span className="text-xs tabular-nums text-muted">{post.publishedAt?.slice(0, 10) ?? ""}</span>
                <h3 className="font-bold tracking-tight leading-snug line-clamp-2 group-hover:text-accent-2 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && <p className="text-sm text-muted line-clamp-3">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
        {contributions && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">GitHub Contributions</span>
              <YearSelector years={availableYears()} />
            </div>
            <ContributionsCalendar days={contributions.days} totalCount={contributions.totalCount} />
          </div>
        )}
      </section>

      {/* Contact CTA */}
      <section className="rounded-3xl border border-line bg-surface px-6 py-14 sm:py-20 flex flex-col items-center text-center gap-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-2">Contact</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">함께 이야기 나눠요</h2>
        <p className="text-muted max-w-md">궁금한 점이나 제안이 있다면 편하게 연락 주세요.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-accent-strong text-foreground font-bold px-6 py-3 text-sm font-semibold hover:opacity-85 transition-opacity"
            >
              <Mail className="size-4" />
              {profile.email}
            </a>
          )}
          {contacts?.linkedin && (
            <a
              href={contacts.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold hover:bg-surface-hover transition-colors"
            >
              <LinkedinIcon className="size-4" />
              LinkedIn
            </a>
          )}
        </div>
      </section>

      <footer className="text-center text-xs text-muted pb-4">
        © {new Date().getFullYear()} WonJun. All rights reserved.
      </footer>
    </div>
  );
}
