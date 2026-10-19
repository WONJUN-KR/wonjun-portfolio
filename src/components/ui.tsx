import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import type { Tag } from "@/lib/api";

// 페이지 공용 UI 조각 - 색은 globals.css 토큰만 사용

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group inline-flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}

export function TagList({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span key={tag.id} className="text-xs text-accent-2">
          #{tag.name}
        </span>
      ))}
    </div>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-md border border-line bg-surface text-muted">
      {children}
    </span>
  );
}

// 휴대폰 접기·펼치기 버튼 - 본문 글자와 헷갈리지 않게 강조색 테두리 알약 모양
export const MOBILE_TOGGLE =
  "inline-flex w-fit cursor-pointer select-none items-center gap-1 rounded-full border border-accent/40 bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-2 transition-colors hover:border-accent/70";

// 휴대폰 접기 묶음 - 바깥 상자에 group/more 를 주고 버튼(MobileMoreToggle)을 하나만 두면
// 안쪽의 MOBILE_OPEN_ONLY 붙은 것들이 그 버튼 하나로 같이 펼쳐지고 접힘 (JS 없이 체크박스 + :has). sm 이상은 항상 펼침
export const MOBILE_OPEN_ONLY = "max-sm:hidden max-sm:group-has-[:checked]/more:flex";
export const MOBILE_OPEN_ONLY_ITEM = "max-sm:hidden max-sm:group-has-[:checked]/more:list-item";
export const MOBILE_OPEN_ONLY_INLINE = "max-sm:hidden max-sm:group-has-[:checked]/more:inline";

// htmlFor 를 주면 같은 체크박스를 여는 버튼을 위·아래 두 군데 둘 수 있음 (체크박스는 MobileMoreInput 으로 앞에 한 번)
export function MobileMoreToggle({ more = "자세히 보기", less = "접기", htmlFor, className = "" }: {
  more?: string;
  less?: string;
  htmlFor?: string;
  className?: string;
}) {
  // 체크박스가 버튼 안에 있으면 peer, 밖(htmlFor)에 있으면 바깥 group/more 의 :has 로 글자·화살표를 바꿈
  const [moreCls, lessCls, iconCls] = htmlFor
    ? ["group-has-[:checked]/more:hidden", "hidden group-has-[:checked]/more:inline", "group-has-[:checked]/more:rotate-180"]
    : ["peer-checked:hidden", "hidden peer-checked:inline", "peer-checked:rotate-180"];
  return (
    <label htmlFor={htmlFor} className={`sm:hidden ${MOBILE_TOGGLE} ${className}`}>
      {!htmlFor && <input type="checkbox" className="peer sr-only" />}
      <span className={moreCls}>{more}</span>
      <span className={lessCls}>{less}</span>
      <ChevronDown className={`size-3.5 transition-transform ${iconCls}`} />
    </label>
  );
}

export function MobileMoreInput({ id }: { id: string }) {
  return <input id={id} type="checkbox" className="peer sr-only" />;
}

// 기술 칩 - 휴대폰은 칩이 화면을 많이 차지해서 '기술 스택 N개'로 접어둠
// grouped 면 자체 버튼 없이 바깥 group/more 버튼으로 같이 펼쳐짐
export function StackChips({ items, grouped = false }: { items: string[]; grouped?: boolean }) {
  if (items.length === 0) return null;
  const chips = items.map((s) => <Chip key={s}>{s}</Chip>);
  if (grouped) return <div className={`flex flex-wrap gap-1.5 ${MOBILE_OPEN_ONLY}`}>{chips}</div>;
  return (
    <>
      <div className="flex flex-wrap gap-1.5 max-sm:hidden">{chips}</div>
      <details className="group sm:hidden">
        <summary className={`list-none [&::-webkit-details-marker]:hidden ${MOBILE_TOGGLE}`}>
          기술 스택 {items.length}개
          <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="flex flex-wrap gap-1.5 pt-3">{chips}</div>
      </details>
    </>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-2">{children}</span>
  );
}

export function SectionHeader({ eyebrow, title, href, linkLabel }: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm text-muted hover:text-foreground shrink-0"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

// 각 페이지 맨 위 제목 블록
export function PageHeader({ eyebrow, title, description }: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="animate-fade-up flex flex-col gap-4 pt-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-base sm:text-lg text-muted max-w-2xl">{description}</p>}
    </section>
  );
}
