import HistoryView, { historyMetadata } from "@/views/HistoryView";

export const metadata = historyMetadata("ko");

export default function HistoryPage() {
  return <HistoryView lang="ko" />;
}
