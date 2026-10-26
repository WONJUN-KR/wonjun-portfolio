import LogView, { logMetadata } from "@/views/LogView";

export const metadata = logMetadata("en");

export default function LogPage() {
  return <LogView lang="en" />;
}
