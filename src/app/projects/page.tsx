import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/projects";
import { GithubIcon } from "@/components/icons";
import { Chip, PageHeader } from "@/components/ui";

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
      <div className={fixedAspect ? "relative aspect-[16/10] flex items-center justify-center" : "relative"}>
        {children}
      </div>
    </div>
  );
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[240px] mx-auto">
      <div className="rounded-[2rem] border-[6px] border-surface-hover bg-background overflow-hidden shadow-2xl shadow-black/20">
        <div className="aspect-[9/16] relative overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.thumbnail) {
    if (project.device === "mobile") {
      return (
        <MobileFrame>
          <Image src={project.thumbnail} alt={project.title} fill unoptimized className="object-cover" />
        </MobileFrame>
      );
    }
    return (
      <BrowserFrame fixedAspect={false}>
        <Image
          src={project.thumbnail}
          alt={project.title}
          width={1002}
          height={558}
          unoptimized
          className="w-full h-auto block"
        />
      </BrowserFrame>
    );
  }
  if (project.logo) {
    return (
      <BrowserFrame>
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <Image
            src={project.logo}
            alt={project.title}
            width={800}
            height={800}
            unoptimized
            className="w-full h-full object-contain p-8"
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
        {PROJECTS.map((p) => (
          <article
            key={p.slug}
            id={p.slug}
            // 홈 카드에서 /projects#slug 로 오면 해당 카드로 스크롤 (상단 고정 헤더만큼 여백) + 테두리 강조
            className="scroll-mt-24 target:border-accent/60 rounded-3xl border border-line bg-surface p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
          >
            {/* 왼쪽: 화면 + 핵심 기능(사용자가 할 수 있는 것) / 오른쪽: 소개 + 내가 맡은 부분 */}
            <div className="flex flex-col gap-6">
              <ProjectVisual project={p} />
              <div className="flex flex-col gap-1">
                <p className="text-base text-muted">{p.subtitle}</p>
                <p className="text-lg font-semibold leading-snug">{p.tagline}</p>
              </div>
              <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
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
                <h2 className="text-3xl font-bold tracking-tight">{p.title}</h2>
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-line bg-background p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">내가 맡은 부분</span>
                <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-muted">
                  {p.myPart.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>

              {/* 링크 버튼은 한 줄로 - 좁은 화면에서도 줄바꿈 없이 */}
              <div className="flex flex-nowrap gap-2 pt-2">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent-strong text-foreground px-4 py-2.5 text-sm font-bold hover:opacity-85 transition-opacity"
                  >
                    라이브 보기
                    <ExternalLink className="size-4" />
                  </a>
                )}
                {p.repos.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-4 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
                  >
                    <GithubIcon className="size-4" />
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
