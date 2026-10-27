import HistoryView, { historyMetadata } from "@/views/HistoryView";

export const metadata = historyMetadata("en");

export default function HistoryPage() {
  return <HistoryView lang="en" />;
}
