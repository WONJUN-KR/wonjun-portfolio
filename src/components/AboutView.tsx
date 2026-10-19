import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, ChevronDown, ExternalLink, Mail, MapPin } from "lucide-react";
import type { AboutContent } from "@/lib/api";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import SkillGroups from "@/components/SkillGroups";
import { Chip, Eyebrow, MOBILE_OPEN_ONLY_ITEM, MOBILE_TOGGLE, MobileMoreInput, MobileMoreToggle, StackChips } from "@/components/ui";

// resume 페이지 본문 - 데이터는 src/lib/about.ts
export default function AboutView({ about }: { about: AboutContent }) {

  const { profile, careers, educations, trainings, certifications, skills, portfolios, military, coverLetter } = about;
  const sortedCareers = [...careers].sort((a, b) => a.sortOrder - b.sortOrder);
  const currentCareer = sortedCareers.find((c) => c.isCurrent);
  const sortedEducations = [...educations].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedTrainings = [...trainings].sort((a, b) => a.sortOrder - b.sortOrder);

  const links = [
    { href: profile.contacts.githubPersonal, label: "GitHub", icon: <GithubIcon className="size-4" /> },
    { href: profile.contacts.blog, label: "Blog", icon: <BookOpen className="size-4" /> },
    { href: profile.contacts.linkedin, label: "LinkedIn", icon: <LinkedinIcon className="size-4" /> },
  ].filter((l): l is typeof l & { href: string } => Boolean(l.href));

  return (
    <div className="flex flex-col gap-20 py-6">
      {/* 상단 헤더 */}
      <header className="animate-fade-up flex flex-col gap-6 pt-8">
        <Eyebrow>Resume</Eyebrow>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-lg sm:text-xl text-muted">{profile.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5"><Mail className="size-4" />{profile.email}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{profile.region}</span>
        </div>
        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                {l.icon}
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* 정보 박스 */}
      {/* 이력서 요약 4칸 - 사람인·잡코리아 상단 요약 기준 (총 경력 · 최종 학력 · 자격증 · 전문 분야) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <InfoBox
          label="총 경력"
          value={profile.careerPeriod}
          sub={currentCareer ? `${currentCareer.company} 재직 중` : undefined}
        />
        <InfoBox label="최종 학력" value="대학교(4년) 졸업" sub="정보통신학과" />
        <InfoBox
          label="자격증"
          value={certifications.slice(0, 2).map((c) => c.name.replace(/\s*\(.*\)$/, "")).join(" · ")}
          sub={certifications.length > 2 ? `외 ${certifications.length - 2}개` : undefined}
        />
        <InfoBox label="전문 분야" value="의료 IT (CGM)" sub="혈당 데이터 서비스" />
      </section>

      <Section eyebrow="Cover Letter" title="자기소개서">
        <div className="rounded-3xl border border-line bg-surface p-5 sm:p-10 max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:p-0">
          {/* 휴대폰은 앞부분만 보여주고 '전체 읽기' ↔ '접기' - JS 없이 체크박스 + :has */}
          <div className="group/cover flex flex-col">
            <div className="relative max-sm:max-h-[22rem] max-sm:overflow-hidden max-sm:group-has-[:checked]/cover:max-h-none max-sm:after:absolute max-sm:after:inset-x-0 max-sm:after:bottom-0 max-sm:after:h-24 max-sm:after:bg-gradient-to-t max-sm:after:from-background max-sm:after:to-transparent max-sm:group-has-[:checked]/cover:after:hidden">
              <div className="prose prose-invert max-w-none prose-headings:font-[family-name:var(--font-display)] prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-a:text-accent-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{coverLetter}</ReactMarkdown>
              </div>
            </div>
            <label className={`sm:hidden mt-3 ${MOBILE_TOGGLE}`}>
              <input type="checkbox" className="peer sr-only" />
              <span className="peer-checked:hidden">전체 읽기</span>
              <span className="hidden peer-checked:inline">접기</span>
              <ChevronDown className="size-3.5 transition-transform peer-checked:rotate-180" />
            </label>
          </div>
        </div>
      </Section>

      <Section eyebrow="Skills" title="역량">
        <SkillGroups skills={skills} />
      </Section>

      <Section eyebrow="Experience" title="경력" sub={profile.careerPeriod}>
        {/* 휴대폰은 프로젝트마다 대표 1줄만 - 경력 전체를 위·아래 버튼 하나로 같이 펼침 */}
        <div className="group/more flex flex-col gap-6">
          <MobileMoreInput id="experience-more" />
          <MobileMoreToggle htmlFor="experience-more" more="경력 상세 전부 보기" />
          <Timeline>
            {sortedCareers.map((c, idx) => (
              <TimelineItem key={idx} period={c.period} current={c.isCurrent}>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="text-lg font-bold tracking-tight">{c.company}</h3>
                  <span className="text-sm text-muted">{[c.position, c.role].filter(Boolean).join(" · ")}</span>
                </div>
                {c.summary && <p className="text-sm leading-relaxed">{c.summary}</p>}
                {c.projects && c.projects.length > 0 && (
                  <div className="flex flex-col gap-4 max-sm:gap-6 mt-1">
                    {c.projects.map((p, pi) => (
                      <div key={pi} className="rounded-2xl border border-line bg-background p-4 sm:p-5 flex flex-col gap-2 max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:p-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                          <h4 className="font-semibold">{p.title}</h4>
                          <span className="text-xs tabular-nums text-muted">{p.period}</span>
                        </div>
                        <BulletList items={p.details} mobileKeep={1} />
                      </div>
                    ))}
                  </div>
                )}
                {c.stack && <StackChips items={c.stack} grouped />}
              </TimelineItem>
            ))}
          </Timeline>
          <MobileMoreToggle htmlFor="experience-more" more="경력 상세 전부 보기" />
        </div>
      </Section>

      <Section eyebrow="Education" title="학력">
        <Timeline>
          {sortedEducations.map((e, idx) => (
            <TimelineItem key={idx} period={[e.period, e.status].filter(Boolean).join(" · ")}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="text-lg font-bold tracking-tight">{e.school}</h3>
                {e.department && <span className="text-sm text-muted">{e.department}</span>}
              </div>
              {(e.region || e.gpa) && (
                <div className="flex flex-wrap gap-x-4 text-xs text-muted">
                  {e.region && <span>지역 {e.region}</span>}
                  {e.gpa && <span>학점 {e.gpa}</span>}
                </div>
              )}
              {e.projects && e.projects.length > 0 && <BulletList items={e.projects} />}
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      <Section eyebrow="Training" title="교육">
        <Timeline>
          {sortedTrainings.map((t, idx) => (
            <TimelineItem key={idx} period={t.period}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="text-lg font-bold tracking-tight">{t.org}</h3>
                <span className="text-sm text-muted">{t.course}</span>
              </div>
              {t.learned && t.learned.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {t.learned.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              )}
              {/* 교육 중 사이드 프로젝트는 제목만 ("제목 (팀·기간) - 설명" 에서 설명 앞까지) - 자세한 건 포트폴리오에서 */}
              {t.projects && t.projects.length > 0 && <BulletList items={t.projects.map((x) => x.split(" - ")[0])} />}
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      <Section eyebrow="Certifications" title="자격증">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((c, idx) => (
            <li key={idx} className="rounded-2xl border border-line bg-surface p-5 flex flex-col gap-1">
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-muted">{c.issuer} · {c.acquiredAt}</div>
            </li>
          ))}
        </ul>
      </Section>

      {military && (
        <Section eyebrow="Etc" title="취업 우대사항">
          <div className="rounded-2xl border border-line bg-surface p-5 text-sm">
            <span className="font-semibold">병역 · {military.status}</span>
            <span className="text-muted"> - {military.type} ({military.period})</span>
          </div>
        </Section>
      )}

      <Section eyebrow="Portfolio" title="포트폴리오" sub={`총 ${portfolios.length}건`}>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {portfolios.map((p, idx) => (
            <li key={idx}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="font-semibold group-hover:text-accent-2 transition-colors">{p.title}</div>
                  <div className="text-xs text-muted">
                    {p.period}
                    {p.teamSize && ` · 팀 ${p.teamSize}명`}
                  </div>
                </div>
                <ExternalLink className="size-4 shrink-0 text-muted group-hover:text-accent-2 transition-colors" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function InfoBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 flex flex-col gap-1">
      <div className="text-sm text-muted">{label}</div>
      <div className="text-lg font-bold tracking-tight text-accent-2">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}

function Section({ eyebrow, title, sub, children }: {
  eyebrow: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
          {sub && <span className="text-sm text-muted">{sub}</span>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Timeline({ children }: { children: React.ReactNode }) {
  return <ol className="relative flex flex-col gap-10 border-l border-line ml-1.5">{children}</ol>;
}

function TimelineItem({ period, current, children }: {
  period: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="relative pl-5 sm:pl-8 flex flex-col gap-3">
      <span
        className={`absolute -left-[5px] top-1.5 size-2.5 rounded-full ring-4 ring-background ${
          current ? "bg-accent" : "bg-muted"
        }`}
      />
      <span className="text-xs tabular-nums text-muted">{period}</span>
      {children}
    </li>
  );
}

// mobileKeep 을 주면 휴대폰에선 앞 N개만 보이고 나머지는 바깥 group/more 버튼으로 펼침
function BulletList({ items, mobileKeep }: { items: string[]; mobileKeep?: number }) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm text-muted">
      {items.map((d, i) => (
        <li
          key={i}
          className={`relative pl-4 before:absolute before:left-0 before:top-2 before:size-1 before:rounded-full before:bg-accent ${
            mobileKeep !== undefined && i >= mobileKeep ? MOBILE_OPEN_ONLY_ITEM : ""
          }`}
        >
          {d}
        </li>
      ))}
    </ul>
  );
}
