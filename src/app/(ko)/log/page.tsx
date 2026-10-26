import LogView, { logMetadata } from "@/views/LogView";

export const metadata = logMetadata("ko");

export default function LogPage() {
  return <LogView lang="ko" />;
}
