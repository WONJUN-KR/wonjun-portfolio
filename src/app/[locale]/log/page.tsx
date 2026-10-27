import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import LogView, { logMetadata } from "@/views/LogView";
import type { Lang } from "@/i18n";

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return logMetadata((await params).locale);
}

export default async function LogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LogView lang={locale} />;
}
