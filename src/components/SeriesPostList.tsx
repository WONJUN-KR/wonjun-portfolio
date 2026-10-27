"use client";

import { useMemo, useState } from "react";
import type { SeriesPostItem } from "@/lib/api";
import LocalDate from "@/components/LocalDate";
import { TagList } from "@/components/ui";
import { DATE_LOCALE, t, type Lang } from "@/i18n";

type Order = "asc" | "desc";

const ORDER_OPTIONS = [
  { value: "desc", label: "series.newest" },
  { value: "asc", label: "series.oldest" },
] as const satisfies readonly { value: Order; label: string }[];

export default function SeriesPostList({ posts, lang = "ko" }: { posts: SeriesPostItem[]; lang?: Lang }) {
  const locale = DATE_LOCALE[lang];
  const [order, setOrder] = useState<Order>("desc");

  const sorted = useMemo(() => {
    const copy = [...posts];
    if (order === "desc") copy.reverse();
    return copy;
  }, [posts, order]);

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-fit rounded-full border border-line bg-surface p-1 text-sm">
        {ORDER_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setOrder(o.value)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              order === o.value ? "bg-surface-hover text-foreground font-semibold" : "text-muted hover:text-foreground"
            }`}
          >
            {t(lang, o.label)}
          </button>
        ))}
      </div>

      <ol className="flex flex-col gap-3">
        {sorted.map((post) => (
          <li key={post.id}>
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="group flex gap-5 rounded-3xl border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft tabular-nums text-sm font-bold text-accent-2">
                {post.seriesIndex ?? "·"}
              </span>
              <div className="flex flex-col gap-2 min-w-0">
                <h2 className="text-lg font-bold tracking-tight group-hover:text-accent-2 transition-colors">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-muted line-clamp-2">{post.excerpt}</p>}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {post.publishedAt && <LocalDate iso={post.publishedAt} locale={locale} className="text-xs tabular-nums text-muted" />}
                  <TagList tags={post.tags} />
                </div>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
