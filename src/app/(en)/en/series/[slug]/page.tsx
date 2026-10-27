import type { Metadata } from "next";
import SeriesView, { seriesMetadata } from "@/views/SeriesView";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return seriesMetadata((await params).slug, "en");
}

export default async function SeriesPage({ params }: PageProps) {
  return <SeriesView slug={(await params).slug} lang="en" />;
}
