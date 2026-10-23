"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, Images, Play, X } from "lucide-react";
import type { Mockup } from "@/lib/projects";
import SafeImage from "@/components/SafeImage";

type Slide =
  | { kind: "video"; webm: string; mp4: string; poster: string; caption: string }
  | { kind: "shot"; src: string; caption: string };

// 슬라이드 순서: 첫 흐름 영상(전체 흐름) → 스크린샷 → 나머지 영상
function toSlides(mockup: Mockup): Slide[] {
  const [first, ...rest] = mockup.videos.map((v) => ({ kind: "video" as const, ...v }));
  const shots = mockup.shots.map((s) => ({ kind: "shot" as const, ...s }));
  return [...(first ? [first] : []), ...shots, ...rest];
}

const SWIPE_THRESHOLD = 50; // px - 이보다 짧게 밀면 넘기지 않음

// 프로젝트 화면 둘러보기 - 버튼만 먼저 그리고, 팝업(<dialog>)을 열 때 처음으로 슬라이드를 렌더해서 그때부터 받음
// → /projects 첫 로드에는 이미지·영상 요청이 0개 (페이지 무게·라이트하우스 점수 영향 없음)
// 슬라이드는 현재 장과 바로 옆 장만 이미지를 렌더(나머지는 빈 자리)하고, 영상은 현재 장일 때만 <video> 를 붙여 받고 재생
// 넘기기: ‹ › 버튼 · 키보드 ← → · 터치 스와이프 · 하단 점 / prefers-reduced-motion 이면 슬라이드 전환 애니메이션 없음
export default function MockupGallery({ title, mockup }: { title: string; mockup: Mockup }) {
  const ref = useRef<HTMLDialogElement>(null);
  const startX = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const slides = toSlides(mockup);
  const last = slides.length - 1;
  const go = (i: number) => setIndex(Math.max(0, Math.min(last, i)));

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    // 팝업이 열려 있는 동안 뒤 페이지 스크롤 고정
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) go(index + (dx < 0 ? 1 : -1));
  };

  const current = slides[index];
  const navButton = "absolute top-1/2 -translate-y-1/2 z-10 rounded-full border border-line bg-surface/90 p-2 shadow-lg backdrop-blur hover:bg-surface-hover transition-colors disabled:opacity-0 max-sm:p-1.5";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
      >
        <Images className="size-4 shrink-0" />
        화면 둘러보기
        <span className="text-xs font-normal text-muted">
          스크린샷 {mockup.shots.length} · 영상 {mockup.videos.length}
        </span>
      </button>

      <dialog
        ref={ref}
        aria-label={`${title} 화면 둘러보기`}
        onClose={() => setOpen(false)}
        // 바깥(backdrop) 클릭으로 닫기 - dialog 자신이 클릭 대상이면 안쪽 내용이 아닌 바깥
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] rounded-3xl border border-line bg-surface p-0 text-foreground backdrop:bg-black/70"
      >
        {open && (
          <div className="flex flex-col gap-4 p-5 sm:p-8 max-sm:p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold tracking-tight max-sm:text-lg">{title}</h3>
                {mockup.note && <p className="text-sm text-muted max-sm:text-[13px]">{mockup.note}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm tabular-nums text-muted" aria-live="polite">
                  {index + 1} / {slides.length}
                </span>
                <button
                  type="button"
                  onClick={() => ref.current?.close()}
                  aria-label="닫기"
                  className="rounded-full border border-line p-2 hover:bg-surface-hover transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                className="overflow-hidden rounded-2xl border border-line bg-background touch-pan-y"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={() => {
                  startX.current = null;
                }}
              >
                <div
                  className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {slides.map((s, i) => (
                    <div
                      key={s.kind === "video" ? s.mp4 : s.src}
                      className="relative aspect-[16/10] w-full shrink-0"
                      aria-hidden={i !== index}
                    >
                      {/* 현재 장 ±1 만 렌더 - 멀리 있는 장은 빈 자리로 두어 받지 않음 */}
                      {Math.abs(i - index) <= 1 &&
                        (s.kind === "video" && i === index ? (
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                            preload="auto"
                            className="size-full object-contain"
                          >
                            <source src={s.webm} type="video/webm" />
                            <source src={s.mp4} type="video/mp4" />
                          </video>
                        ) : (
                          <SafeImage
                            src={s.kind === "video" ? s.poster : s.src}
                            alt={s.caption}
                            fill
                            sizes="(max-width: 1024px) 100vw, 960px"
                            className="object-contain"
                          />
                        ))}
                      {s.kind === "video" && i !== index && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <Play className="size-12 rounded-full bg-black/50 p-3 text-white" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="이전" className={`${navButton} left-2`}>
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(index + 1)} disabled={index === last} aria-label="다음" className={`${navButton} right-2`}>
                <ChevronRight className="size-5" />
              </button>
            </div>

            <p className="inline-flex items-center gap-1.5 text-sm text-muted min-h-[1.5em]">
              {current.kind === "video" && <Play className="size-3.5 shrink-0 text-accent-2" />}
              {current.caption}
            </p>

            <div className="flex flex-wrap justify-center gap-0.5" role="tablist" aria-label="슬라이드 선택">
              {slides.map((s, i) => (
                <button
                  key={s.kind === "video" ? s.mp4 : s.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1}번째: ${s.caption}`}
                  onClick={() => go(i)}
                  // 점은 작아도 누르는 영역은 넉넉하게(패딩) - 휴대폰 터치
                  className="group/dot p-1.5"
                >
                  <span className={`block h-2 rounded-full transition-all motion-reduce:transition-none ${i === index ? "w-6 bg-accent" : "w-2 bg-line group-hover/dot:bg-muted"}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
