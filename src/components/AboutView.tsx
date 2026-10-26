import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, ChevronDown, ExternalLink, Mail, MapPin } from "lucide-react";
import { detailText, type AboutContent, type CareerDetail, type Evidence } from "@/lib/api";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import SkillGroups from "@/components/SkillGroups";
import PrintButton from "@/components/PrintButton";
import { t, type Lang } from "@/i18n";
import { Eyebrow, MOBILE_OPEN_ONLY_INLINE, MOBILE_OPEN_ONLY_ITEM, MOBILE_TOGGLE, MobileMoreInput, MobileMoreToggle, StackChips } from "@/components/ui";

// 헤더 링크 · PDF 저장 버튼 공통 모양 (색은 따로 - 링크는 테두리만, PDF 저장은 크림색 바탕으로 눈에 띄게)
const HEADER_BUTTON =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold max-sm:min-w-0 max-sm:flex-1 max-sm:justify-center max-sm:gap-1.5 max-sm:px-2 max-sm:text-[15px] [&>svg]:shrink-0 max-[359px]:[&>svg]:hidden";
const LINK_BUTTON = `${HEADER_BUTTON} border-line hover:bg-surface-hover transition-colors`;
const PDF_BUTTON = `${HEADER_BUTTON} cursor-pointer border-transparent bg-foreground text-background font-bold hover:opacity-85 transition-opacity`;

// resume 페이지 본문 - 데이터는 src/lib/about.ts
export default function AboutView({ about, lang = "ko" }: { about: AboutContent; lang?: Lang }) {

  const { profile, careers, educations, trainings, certifications, skills, portfolios, military, coverLetter } = about;
  const sortedCareers = [...careers].sort((a, b) => a.sortOrder - b.sortOrder);
  const currentCareer = sortedCareers.find((c) => c.isCurrent);
  const sortedEducations = [...educations].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedTrainings = [...trainings].sort((a, b) => a.sortOrder - b.sortOrder);
  // 짧은 소개(영어판 3~4문장)는 휴대폰에서도 다 보여서 접기 없이 그대로
  const coverFolds = coverLetter.length > 800;

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
        {/* 링크 버튼은 한 줄로 - 휴대폰은 같은 폭으로 나눠 한 줄에 (360px 미만은 아이콘 생략, /projects 링크 버튼과 같은 방식) */}
        {/* 끝에 PDF 저장 버튼 - 휴대폰은 한 줄에 4개가 안 들어가서 다음 줄에 꽉 차게(basis-full). 인쇄물에선 버튼 줄 전체를 숨김 */}
        <div className="flex flex-wrap gap-2 max-sm:gap-1.5 print:hidden">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={LINK_BUTTON}>
              {l.icon}
              {l.label}
            </a>
          ))}
          <PrintButton fileName={t(lang, "resume.pdfFile", { name: profile.name })} label={t(lang, "resume.pdf")} className={`${PDF_BUTTON} max-sm:basis-full`} />
        </div>
      </header>

      {/* 정보 박스 */}
      {/* 이력서 요약 4칸 - 사람인·잡코리아 상단 요약 기준 (총 경력 · 전문 분야 · 최종 학력 · 자격증) */}
      {/* 휴대폰은 홈 숫자 카드처럼 한 상자 안에 한 줄씩 (이름·설명 왼쪽, 값 오른쪽) - 값 칸은 최대 65%, 넘으면 값도 줄바꿈 (영어 자격증 이름처럼 긴 값이 화면 밖으로 안 나가게) */}
      <section className="grid grid-cols-2 max-sm:grid-cols-1 md:grid-cols-4 gap-3 max-sm:gap-0 max-sm:rounded-2xl max-sm:border max-sm:border-line max-sm:bg-surface max-sm:divide-y max-sm:divide-line">
        <InfoBox
          label={t(lang, "resume.info.career")}
          value={profile.careerPeriod}
          sub={currentCareer ? t(lang, "resume.info.currentAt", { company: currentCareer.company }) : undefined}
        />
        <InfoBox label={t(lang, "resume.info.field")} value={t(lang, "resume.info.fieldValue")} sub={t(lang, "resume.info.fieldSub")} />
        <InfoBox label={t(lang, "resume.info.education")} value={t(lang, "resume.info.educationValue")} sub={t(lang, "resume.info.educationSub")} />
        <InfoBox
          label={t(lang, "resume.info.certs")}
          value={certifications.slice(0, 2).map((c) => c.name.replace(/\s*\(.*\)$/, "")).join(" · ")}
          sub={certifications.length > 2 ? t(lang, "resume.info.certsMore", { n: certifications.length - 2 }) : undefined}
        />
      </section>

      {coverLetter && (
      <Section eyebrow={t(lang, "resume.coverLetterEyebrow")} title={t(lang, "resume.coverLetter")}>
        <div className="rounded-3xl border border-line bg-surface p-5 sm:p-10 max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:p-0">
          {/* 휴대폰은 앞부분만 보여주고 '전체 읽기' ↔ '접기' - JS 없이 체크박스 + :has */}
          <div className="group/cover flex flex-col">
            <div className={coverFolds ? "relative max-sm:max-h-[22rem] max-sm:overflow-hidden max-sm:group-has-[:checked]/cover:max-h-none max-sm:after:absolute max-sm:after:inset-x-0 max-sm:after:bottom-0 max-sm:after:h-24 max-sm:after:bg-gradient-to-t max-sm:after:from-background max-sm:after:to-transparent max-sm:group-has-[:checked]/cover:after:hidden" : undefined}>
              <div className="prose prose-invert max-w-none prose-headings:font-[family-name:var(--font-display)] prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-a:text-accent-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{coverLetter}</ReactMarkdown>
              </div>
            </div>
            {coverFolds && (
            <label data-more-toggle="" className={`sm:hidden mt-3 ${MOBILE_TOGGLE}`}>
              <input type="checkbox" className="peer sr-only" />
              <span className="peer-checked:hidden">{t(lang, "resume.readAll")}</span>
              <span className="hidden peer-checked:inline">{t(lang, "toggle.less")}</span>
              <ChevronDown className="size-3.5 transition-transform peer-checked:rotate-180" />
            </label>
            )}
          </div>
        </div>
      </Section>
      )}

      <Section eyebrow="Skills" title={t(lang, "resume.skills")}>
        <SkillGroups skills={skills} lang={lang} />
      </Section>

      <Section eyebrow="Experience" title={t(lang, "resume.experience")} sub={profile.careerPeriod}>
        {/* 휴대폰은 회사마다 프로젝트 제목만 - 기간·상세(작은 글씨)·기술은 내용 아래 '자세히 보기'로 그 회사만 펼침, 같은 버튼이 '접기'로 바뀜 */}
        <Timeline>
          {sortedCareers.map((c, idx) => (
            <TimelineItem key={idx} period={c.period} current={c.isCurrent}>
              <div className="group/more flex flex-col gap-3">
                <MobileMoreInput id={`career-more-${idx}`} />
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="text-lg font-bold tracking-tight">{c.company}</h3>
                  <span className="text-sm text-muted">{[c.position, c.role].filter(Boolean).join(" · ")}</span>
                </div>
                {c.summary && <p className="text-sm leading-relaxed">{c.summary}</p>}
                {c.projects && c.projects.length > 0 && (
                  <div className="flex flex-col gap-4 max-sm:gap-5 mt-1">
                    {c.projects.map((p, pi) => (
                      <div key={pi} className="rounded-2xl border border-line bg-background p-4 sm:p-5 flex flex-col gap-2 max-sm:gap-0 max-sm:group-has-[:checked]/more:gap-2 max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:p-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                          <h4 className="font-semibold">{p.title}</h4>
                          <span className={`text-xs tabular-nums text-muted ${MOBILE_OPEN_ONLY_INLINE}`}>{p.period}</span>
                        </div>
                        <BulletList items={p.details} mobileKeep={0} lang={lang} />
                      </div>
                    ))}
                  </div>
                )}
                {c.stack && <StackChips items={c.stack} grouped lang={lang} />}
                {/* 자기소개서 '전체 읽기'처럼 내용 아래 버튼 하나 - 자세히 보기 ↔ 접기, 접으면 이 버튼 자리로 화면 복귀 */}
                <MobileMoreToggle htmlFor={`career-more-${idx}`} lang={lang} />
              </div>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      {sortedTrainings.length > 0 && (
      <Section eyebrow="Training" title={t(lang, "resume.training")}>
        <Timeline>
          {sortedTrainings.map((tr, idx) => (
            <TimelineItem key={idx} period={tr.period}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="text-lg font-bold tracking-tight">{tr.org}</h3>
                <span className="text-sm text-muted">{tr.course}</span>
              </div>
              {/* 배운 기술(learned)은 역량과 겹쳐서 안 그림 - 데이터는 about.ts 에 그대로 */}
              {/* 교육 중 사이드 프로젝트는 제목만 ("제목 (팀·기간) - 설명" · 영어 "Title (team, period): 설명" 에서 설명 앞까지) - 자세한 건 포트폴리오에서 */}
              {tr.projects && tr.projects.length > 0 && <BulletList items={tr.projects.map((x) => x.split(/ - |(?<=\)): /)[0])} lang={lang} />}
            </TimelineItem>
          ))}
        </Timeline>
      </Section>
      )}

      <Section eyebrow="Education" title={t(lang, "resume.education")}>
        <Timeline>
          {sortedEducations.map((e, idx) => (
            <TimelineItem key={idx} period={[e.period, e.status].filter(Boolean).join(" · ")}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="text-lg font-bold tracking-tight">{e.school}</h3>
                {e.department && <span className="text-sm text-muted">{e.department}</span>}
              </div>
              {(e.region || e.gpa) && (
                <div className="flex flex-wrap gap-x-4 text-xs text-muted">
                  {e.region && <span>{t(lang, "resume.region", { v: e.region })}</span>}
                  {e.gpa && <span>{t(lang, "resume.gpa", { v: e.gpa })}</span>}
                </div>
              )}
              {e.projects && e.projects.length > 0 && <BulletList items={e.projects} lang={lang} />}
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      {certifications.length > 0 && (
      <Section eyebrow="Certifications" title={t(lang, "resume.certifications")}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((c, idx) => (
            <li key={idx} className="rounded-2xl border border-line bg-surface p-5 flex flex-col gap-1">
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-muted">{c.issuer} · {c.acquiredAt}</div>
            </li>
          ))}
        </ul>
      </Section>
      )}

      {military && (
        <Section eyebrow="Etc" title={t(lang, "resume.etc")}>
          <div className="rounded-2xl border border-line bg-surface p-5 text-sm">
            <span className="font-semibold">{t(lang, "resume.military")} · {military.status}</span>
            <span className="text-muted"> - {military.type} ({military.period})</span>
          </div>
        </Section>
      )}

      {portfolios.length > 0 && (
      <Section eyebrow="Portfolio" title={t(lang, "resume.portfolio")} sub={t(lang, "resume.portfolioCount", { n: portfolios.length })}>
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
                    {p.teamSize && ` · ${t(lang, "resume.teamSize", { n: p.teamSize })}`}
                  </div>
                </div>
                <ExternalLink className="size-4 shrink-0 text-muted group-hover:text-accent-2 transition-colors" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
      )}
    </div>
  );
}

function InfoBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 flex flex-col gap-1 max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_fit-content(65%)] max-sm:gap-x-3 max-sm:gap-y-0.5 max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:px-4 max-sm:py-3.5">
      <div className="text-sm text-muted max-sm:col-start-1 max-sm:row-start-1">{label}</div>
      <div className="text-lg font-bold tracking-tight text-accent-2 max-sm:col-start-2 max-sm:row-start-1 max-sm:row-span-2 max-sm:self-center max-sm:text-right max-sm:text-base">{value}</div>
      {sub && <div className="text-xs text-muted max-sm:col-start-1 max-sm:row-start-2">{sub}</div>}
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
      {/* 인쇄할 때 영문 소제목 · 제목이 페이지 끝에 떨어져 남지 않게 다음 내용과 붙임 */}
      <div className="flex flex-col gap-1.5 print:break-inside-avoid print:break-after-avoid">
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
function BulletList({ items, mobileKeep, lang }: { items: CareerDetail[]; mobileKeep?: number; lang: Lang }) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm text-muted">
      {items.map((d, i) => (
        <li
          key={i}
          className={`relative pl-4 before:absolute before:left-0 before:top-2 before:size-1 before:rounded-full before:bg-accent ${
            mobileKeep !== undefined && i >= mobileKeep ? MOBILE_OPEN_ONLY_ITEM : ""
          }`}
        >
          {detailText(d)}
          {typeof d !== "string" && <EvidencePin evidence={d.evidence} lang={lang} />}
        </li>
      ))}
    </ul>
  );
}

// 숫자 줄 끝의 ⓘ - 누르면 측정 방식·환경·시기가 아래로 펼쳐짐 (details/summary 라 JS 없이 동작, 키보드 Enter/Space 로도 열림)
function EvidencePin({ evidence, lang }: { evidence: Evidence; lang: Lang }) {
  const rows: [string, string][] = [
    [t(lang, "evidence.method"), evidence.method],
    [t(lang, "evidence.env"), evidence.env],
    [t(lang, "evidence.when"), evidence.when],
  ];
  return (
    <details className="group/pin inline">
      <summary
        aria-label={t(lang, "evidence.aria")}
        className="ml-1 inline-flex size-5 cursor-pointer list-none items-center justify-center rounded-full border border-accent-2 align-[1px] text-[12px] font-bold leading-none text-accent-2 transition-colors group-open/pin:bg-accent-2 group-open/pin:text-background [&::-webkit-details-marker]:hidden"
      >
        i
      </summary>
      <div className="mt-2 mb-1 rounded-[10px] border border-line border-l-[3px] border-l-accent bg-surface max-sm:bg-background px-3.5 py-3 text-[14px] text-foreground">
        <dl className="grid grid-cols-[minmax(3.25rem,auto)_1fr] gap-x-2.5 gap-y-1 m-0">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd className="m-0">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}
