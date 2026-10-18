import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { normalizePostMarkdown } from "@/lib/markdown";
import { BackLink, TagList } from "@/components/ui";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt ?? undefined } : {};
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="flex flex-col gap-10 py-6 max-w-3xl mx-auto w-full">
      <BackLink href="/log" label="기록으로" />

      <header className="animate-fade-up flex flex-col gap-4 border-b border-line pb-8">
        <time className="text-sm tabular-nums text-muted">{formatDate(post.publishedAt)}</time>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{post.title}</h1>
        <TagList tags={post.tags} />
      </header>

      <div className="prose prose-invert max-w-none prose-headings:font-[family-name:var(--font-display)] prose-headings:tracking-tight prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-a:text-accent-2 prose-code:text-accent-2 prose-pre:bg-surface prose-pre:border prose-pre:border-line prose-blockquote:border-accent prose-hr:border-line">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{normalizePostMarkdown(post.content)}</ReactMarkdown>
      </div>
    </article>
  );
}
