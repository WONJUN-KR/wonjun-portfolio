import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ProjectsView, { projectsMetadata } from "@/views/ProjectsView";
import type { Lang } from "@/i18n";

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return projectsMetadata((await params).locale);
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectsView lang={locale} />;
}
