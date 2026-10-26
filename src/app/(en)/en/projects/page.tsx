import ProjectsView, { projectsMetadata } from "@/views/ProjectsView";

export const metadata = projectsMetadata("en");

export default function ProjectsPage() {
  return <ProjectsView lang="en" />;
}
