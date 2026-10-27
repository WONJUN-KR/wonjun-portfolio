import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import HistoryView, { historyMetadata } from "@/views/HistoryView";
import type { Lang } from "@/i18n";

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return historyMetadata((await params).locale);
}

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HistoryView lang={locale} />;
}
