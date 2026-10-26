import ProjectsView, { projectsMetadata } from "@/views/ProjectsView";

export const metadata = projectsMetadata("ko");

export default function ProjectsPage() {
  return <ProjectsView lang="ko" />;
}
