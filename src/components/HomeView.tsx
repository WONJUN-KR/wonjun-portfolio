import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Building2, ChevronDown, Mail } from "lucide-react";
import ContributionsCalendar from "@/components/ContributionsCalendar";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { SectionHeader, StackChips } from "@/components/ui";
import { CONTRIBUTIONS_EARLIEST_YEAR, detailText, getContributions, getPosts, type AboutContent } from "@/lib/api";
import { HOME_HIGHLIGHTS } from "@/lib/about";
import SafeImage from "@/components/SafeImage";
import { getProjects } from "@/lib/projects";
import { localizedPath, t, type Lang } from "@/i18n";
import { yearIn } from "@/lib/time";
import LocalDate from "@/components/LocalDate";

const LATEST_POSTS_COUNT = 3;
const FEATURED_PROJECTS_COUNT = 3;

const COMPANY_LOGOS: Record<string, string> = {
  "(주)유엑스엔": "/logos/uxn.jpg",
  "상상스토리(주)": "/logos/sangs.jpg",
};

const PROFILE_IMG = "/img/profile.jpg";
const hasProfileImg = fs.existsSync(path.join(process.cwd(), "public", PROFILE_IMG));

function availableYears(): number[] {
  const now = yearIn();
  const years: number[] = [];
  for (let y = now; y >= CONTRIBUTIONS_EARLIEST_YEAR; y--) years.push(y);
  return years;
}

// 홈 본문 - 이력서 데이터는 src/lib/about.ts 하드코딩
// 정적 페이지(ISR) - 잔디는 최근 1년으로 그리고, 주소의 ?year= 는 잔디 컴포넌트가 브라우저에서 처리
export default async function HomeView({ about, lang }: { about: AboutContent; lang: Lang }) {
  const [contributions, posts] = await Promise.all([
    getContributions().catch(() => null),
    getPosts().catch(() => []),
  ]);

  const profile = about?.profile;
  const contacts = profile?.contacts;
  const careers = [...(about?.careers ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const latestPosts = posts.slice(0, LATEST_POSTS_COUNT);
  const featured = getProjects(lang).slice(0, FEATURED_PROJECTS_COUNT);

  // 숫자 카드 - 커밋 수 같은 활동량 대신 결과 지표 + 근거 한 줄
  const stats = [
    { label: t(lang, "home.stat.career"), value: profile?.careerPeriod ?? "-", basis: t(lang, "home.stat.careerBasis") },
    ...HOME_HIGHLIGHTS,
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 py-6">
      {/* Hero */}
      <section className="animate-fade-up flex flex-col-reverse sm:flex-row sm:items-start gap-10 max-sm:gap-6 sm:gap-10 pt-2">
        <div className="flex flex-col gap-6 min-w-0">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.15] bg-gradient-to-br from-foreground via-foreground to-accent-2 bg-clip-text text-transparent">
              {profile?.tagline ?? t(lang, "home.taglineFallback")}
            </h1>
            <p className="text-lg text-muted">{t(lang, "home.greeting", { name: profile?.name ?? "WonJun" })}</p>
          </div>
          {profile?.intro && (
            <p className="text-base max-sm:text-[15px] sm:text-lg leading-relaxed text-muted whitespace-pre-line">
              {profile.intro}
            </p>
          )}
          <div className="flex flex-wrap gap-3 max-sm:gap-2 pt-2">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-transparent bg-accent-strong text-foreground font-bold px-5 py-2.5 text-sm font-semibold hover:opacity-85 transition-opacity"
              >
                <Mail className="size-4" />
                {t(lang, "home.contact")}
              </a>
            )}
            {contacts?.githubPersonal && (
              <a
                href={contacts.githubPersonal}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 max-sm:px-3 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                <GithubIcon className="size-4" />
                <span className="max-sm:sr-only">GitHub</span>
              </a>
            )}
            {contacts?.blog && (
              <a
                href={contacts.blog}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 max-sm:px-3 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                <BookOpen className="size-4" />
                <span className="max-sm:sr-only">Blog</span>
              </a>
            )}
            {contacts?.linkedin && (
              <a
                href={contacts.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 max-sm:px-3 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                <LinkedinIcon className="size-4" />
                <span className="max-sm:sr-only">LinkedIn</span>
              </a>
            )}
          </div>
        </div>
        <div className="relative shrink-0 size-40 max-sm:size-24 max-sm:rounded-2xl sm:size-60 rounded-3xl overflow-hidden border border-line bg-surface flex items-center justify-center">
          {hasProfileImg ? (
            <SafeImage src={PROFILE_IMG} alt={profile?.name ?? "WonJun"} width={416} height={416} sizes="(max-width: 640px) 96px, 240px" preload className="size-full object-cover object-[center_5%]" />
          ) : (
            <span className="text-5xl sm:text-7xl font-bold tracking-tight text-muted/40">WJ</span>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="animate-fade-up [animation-delay:100ms] grid grid-cols-2 max-sm:grid-cols-1 md:grid-cols-4 gap-3 max-sm:gap-0 max-sm:rounded-2xl max-sm:border max-sm:border-line max-sm:bg-surface max-sm:divide-y max-sm:divide-line">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5 flex flex-col gap-1 max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-3 max-sm:gap-y-0.5 max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:px-4 max-sm:py-3.5">
            <span className="text-sm text-muted max-sm:col-start-1 max-sm:row-start-1">{s.label}</span>
            <span className="text-2xl max-sm:text-xl sm:text-3xl font-bold tracking-tight text-accent-2 max-sm:col-start-2 max-sm:row-start-1 max-sm:row-span-2 max-sm:self-center max-sm:text-right">{s.value}</span>
            <span className="text-xs text-muted sm:truncate max-sm:col-start-1 max-sm:row-start-2" title={s.basis}>{s.basis}</span>
          </div>
        ))}
      </section>

      {/* Experience - 타임라인 */}
      {careers.length > 0 && (
        <section className="flex flex-col gap-8">
          <SectionHeader eyebrow="Experience" title={t(lang, "home.experience.title")} href={localizedPath(lang, "/resume")} linkLabel={t(lang, "home.experience.link")} />
          <ol className="relative flex flex-col gap-4 max-sm:gap-10">
            {careers.map((c) => {
              const logo = COMPANY_LOGOS[c.company];
              return (
                <li key={c.company + c.period} className="rounded-3xl border border-line bg-surface p-4 sm:p-8 flex flex-col gap-5 max-sm:rounded-none max-sm:border-x-0 max-sm:border-b-0 max-sm:bg-transparent max-sm:px-0 max-sm:pb-0 max-sm:pt-6">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0 size-12 rounded-xl bg-white border border-line flex items-center justify-center overflow-hidden p-1.5">
                      {logo ? (
                        <SafeImage src={logo} alt={c.company} width={96} height={96} sizes="48px" className="size-full object-contain" />
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
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 sm:px-5 py-4 [&::-webkit-details-marker]:hidden">
                            <span className="font-semibold text-sm sm:text-base">{proj.title}</span>
                            <span className="flex items-center gap-3 shrink-0">
                              <span className="hidden sm:inline text-xs tabular-nums text-muted">{proj.period}</span>
                              <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
                            </span>
                          </summary>
                          <ul className="flex flex-col gap-2 px-4 sm:px-5 pb-5 text-sm text-muted">
                            {proj.details.map(detailText).map((d) => (
                              <li key={d} className="relative pl-4 before:absolute before:left-0 before:top-2 before:size-1 before:rounded-full before:bg-accent">
                                {d}
                              </li>
                            ))}
                          </ul>
                        </details>
                      ))}
                    </div>
                  )}
                  {c.stack && <StackChips items={c.stack} lang={lang} />}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Projects - 같은 크기 카드 3개 나란히 */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Projects" title={t(lang, "home.projects.title")} href={localizedPath(lang, "/projects")} linkLabel={t(lang, "home.projects.link")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-sm:gap-3">
          {featured.map((p) => {
            // 홈은 맛보기(이미지 + 한 줄 소개), 핵심 기능·내가 맡은 부분은 /projects 에서
            const visual = p.thumbnail ?? p.logo;
            return (
              <Link
                key={p.slug}
                href={`${localizedPath(lang, "/projects")}#${p.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
              >
                {visual && (
                  <div className={`relative aspect-[16/9] max-sm:aspect-[5/2] border-b border-line overflow-hidden ${p.thumbnail ? "bg-background" : "bg-white"}`}>
                    <SafeImage
                      src={visual}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={`${p.thumbnail ? `object-cover object-top ${p.mobileThumbPosition ?? ""}` : "object-contain p-6 max-sm:p-3"} transition-transform duration-500 group-hover:scale-[1.03]`}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3 p-6 flex-1 max-sm:gap-1.5 max-sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="text-xl max-sm:text-lg font-bold tracking-tight truncate">{p.title}</h3>
                      {p.status !== "local" && (
                        <span className="shrink-0 rounded-full border border-transparent bg-accent-soft text-accent-2 px-2 py-0.5 text-xs font-semibold">
                          {t(lang, p.status === "live" ? "status.live" : "status.released")}
                        </span>
                      )}
                    </div>
                    <ArrowUpRight className="size-5 shrink-0 text-muted transition-all group-hover:text-accent-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-base max-sm:text-sm leading-snug max-sm:line-clamp-2">{p.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Activity - 글 + 잔디 */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Activity" title={t(lang, "home.log.title")} href={localizedPath(lang, "/log")} linkLabel={t(lang, "home.log.link")} />
        {latestPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-sm:gap-3">
            {latestPosts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/40 max-sm:gap-1.5 max-sm:rounded-2xl max-sm:p-4"
              >
                {post.publishedAt && <LocalDate iso={post.publishedAt} numeric className="text-xs tabular-nums text-muted" />}
                <h3 className="font-bold tracking-tight leading-snug line-clamp-2 group-hover:text-accent-2 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && <p className="text-sm text-muted line-clamp-3 max-sm:line-clamp-2">{post.excerpt}</p>}
              </a>
            ))}
          </div>
        )}
        {contributions && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 flex flex-col gap-4">
            <ContributionsCalendar initialDays={contributions.days} years={availableYears()} />
          </div>
        )}
      </section>

      {/* Contact CTA */}
      <section className="rounded-3xl border border-line bg-surface px-6 max-[359px]:px-4 py-14 sm:py-20 flex flex-col items-center text-center gap-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-2">Contact</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t(lang, "home.cta.title")}</h2>
        <p className="text-muted max-w-md">{t(lang, "home.cta.body")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {/* 360px 미만은 메일 주소가 버튼 여백·아이콘까지 들어갈 폭이 안 돼서 여백·글자 크기를 줄이고 아이콘 생략 */}
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-transparent bg-accent-strong text-foreground font-bold px-6 py-3 text-sm font-semibold max-[359px]:px-4 max-[359px]:text-[15px] hover:opacity-85 transition-opacity"
            >
              <Mail className="size-4 shrink-0 max-[359px]:hidden" />
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
        © {yearIn()} WonJun. All rights reserved.
      </footer>
    </div>
  );
}
