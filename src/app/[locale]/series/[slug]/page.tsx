import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import SeriesView, { seriesMetadata } from "@/views/SeriesView";
import type { Lang } from "@/i18n";

type Props = { params: Promise<{ locale: Lang; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return seriesMetadata(slug, locale);
}

export default async function SeriesPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <SeriesView slug={slug} lang={locale} />;
}
