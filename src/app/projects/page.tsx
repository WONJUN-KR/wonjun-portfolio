import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/projects";
import SafeImage from "@/components/SafeImage";
import { GithubIcon } from "@/components/icons";
import { MOBILE_OPEN_ONLY, MobileMoreToggle, PageHeader, StackChips } from "@/components/ui";

export const metadata: Metadata = { title: "포트폴리오" };

function BrowserFrame({ children, fixedAspect = true }: { children: React.ReactNode; fixedAspect?: boolean }) {
  return (
    <div className="w-full rounded-2xl border border-line bg-background overflow-hidden shadow-2xl shadow-black/20">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-line">
        {/* macOS 창 버튼 색 (닫기·최소화·확대) */}
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className={fixedAspect ? "relative aspect-[16/10] max-sm:aspect-[2/1] flex items-center justify-center" : "relative max-sm:aspect-[2/1] max-sm:overflow-hidden"}>
        {children}
      </div>
    </div>
  );
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[240px] max-sm:max-w-[150px] mx-auto">
      <div className="rounded-[2rem] border-[6px] border-surface-hover bg-background overflow-hidden shadow-2xl shadow-black/20">
        <div className="aspect-[9/16] relative overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

// preload = 첫 카드(첫 화면에서 가장 큰 요소)만 먼저 불러옴
function ProjectVisual({ project, preload = false }: { project: Project; preload?: boolean }) {
  if (project.thumbnail) {
    if (project.device === "mobile") {
      return (
        <MobileFrame>
          <SafeImage src={project.thumbnail} alt={project.title} fill sizes="240px" preload={preload} className="object-cover" />
        </MobileFrame>
      );
    }
    return (
      <BrowserFrame fixedAspect={false}>
        <SafeImage
          src={project.thumbnail}
          alt={project.title}
          width={1002}
          height={558}
          sizes="(max-width: 1024px) 100vw, 50vw"
          preload={preload}
          // 휴대폰에선 2:1 로 잘리므로 프로젝트별 기준 위치(없으면 위쪽)에 맞춤 - 홈 카드와 같은 값
          className={`w-full h-auto block max-sm:h-full max-sm:object-cover ${project.mobileThumbPosition ?? "max-sm:object-top"}`}
        />
      </BrowserFrame>
    );
  }
  if (project.logo) {
    return (
      <BrowserFrame>
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <SafeImage
            src={project.logo}
            alt={project.title}
            width={800}
            height={800}
            sizes="(max-width: 1024px) 100vw, 50vw"
            preload={preload}
            className="w-full h-full object-contain p-8 max-sm:p-4"
          />
        </div>
      </BrowserFrame>
    );
  }
  const Frame = project.device === "mobile" ? MobileFrame : BrowserFrame;
  return (
    <Frame>
      <div className="flex flex-col items-center gap-2 text-muted">
        <span className="tabular-nums text-xs uppercase tracking-widest">preview</span>
        <span className="text-2xl font-semibold tracking-tight text-center px-4">{project.title}</span>
      </div>
    </Frame>
  );
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-16 py-6">
      <PageHeader
        eyebrow="Projects"
        title="포트폴리오"
      />

      <div className="flex flex-col gap-6">
        {PROJECTS.map((p, i) => (
          <article
            key={p.slug}
            id={p.slug}
            // 홈 카드에서 /projects#slug 로 오면 해당 카드로 스크롤 (상단 고정 헤더만큼 여백) + 테두리 강조
            className="scroll-mt-24 target:border-accent/60 rounded-3xl border border-line bg-surface p-4 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-sm:flex max-sm:flex-col max-sm:items-stretch max-sm:gap-4 group/more"
          >
            {/* 왼쪽: 화면 + 핵심 기능(사용자가 할 수 있는 것) / 오른쪽: 소개 + 내가 맡은 부분 */}
            <div className="flex flex-col gap-6 max-sm:contents">
              <div className="max-sm:order-1"><ProjectVisual project={p} preload={i === 0} /></div>
              <div className="flex flex-col gap-1 max-sm:order-3">
                <p className="text-base text-muted">{p.subtitle}</p>
                <p className="text-lg font-semibold leading-snug">{p.tagline}</p>
              </div>
              {/* 휴대폰은 카드마다 '자세히 보기' 버튼 하나로 핵심 기능·맡은 부분·기술을 같이 펼침 */}
              <div className={`flex flex-col gap-2 max-sm:order-4 ${MOBILE_OPEN_ONLY} max-sm:flex-col`}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-2">핵심 기능</span>
                <ul className="flex flex-col gap-1.5 text-sm leading-relaxed">
                  {p.features.map((f) => (
                    <li key={f} className="relative pl-4 before:absolute before:left-0 before:top-2 before:size-1 before:rounded-full before:bg-accent">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-5 max-sm:contents">
              <div className="flex flex-col gap-2 max-sm:order-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  {p.pinned && (
                    <span className="rounded-full bg-accent-soft text-accent-2 px-2.5 py-0.5 font-semibold">대표</span>
                  )}
                  {p.status === "live" && (
                    <span className="rounded-full border border-line px-2.5 py-0.5 font-semibold text-foreground">
                      운영 중
                    </span>
                  )}
                  {p.lead && (
                    <span className="rounded-full bg-accent-soft text-accent-2 px-2.5 py-0.5 font-semibold">팀장</span>
                  )}
                  <span className="tabular-nums">{p.period}</span>
                  <span>·</span>
                  <span>{p.role}</span>
                </div>
                <h2 className="text-3xl max-sm:text-2xl font-bold tracking-tight">{p.title}</h2>
              </div>

              <div className={`flex flex-col gap-2 rounded-2xl border border-line bg-background p-4 max-sm:order-5 max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:p-0 ${MOBILE_OPEN_ONLY} max-sm:flex-col`}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">내가 맡은 부분</span>
                <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-muted">
                  {p.myPart.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className={`max-sm:order-6 ${MOBILE_OPEN_ONLY}`}>
                <StackChips items={p.stack} grouped />
              </div>

              <MobileMoreToggle className="max-sm:order-7" />

              {/* 링크 버튼은 한 줄로 - 휴대폰은 버튼을 같은 폭으로 나눠 한 줄에 (360px 미만은 GitHub 아이콘 생략) */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2 pt-2 max-sm:order-8 max-sm:flex-nowrap max-sm:gap-1.5 max-sm:pt-0">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent-strong text-foreground px-4 py-2.5 text-sm font-bold hover:opacity-85 transition-opacity max-sm:min-w-0 max-sm:flex-1 max-sm:justify-center max-sm:gap-1 max-sm:px-2 max-sm:text-[13px]"
                  >
                    라이브 보기
                    <ExternalLink className="size-4 max-sm:size-3.5" />
                  </a>
                )}
                {p.repos.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-4 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors max-sm:min-w-0 max-sm:flex-1 max-sm:justify-center max-sm:gap-1 max-sm:px-2 max-sm:text-[13px]"
                  >
                    <GithubIcon className="size-4 max-sm:size-3.5 max-[359px]:hidden" />
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
