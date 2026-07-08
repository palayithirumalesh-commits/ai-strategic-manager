import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-ink-400">Loading projects…</div>;
  }

  return (
    <div>
      <PageHeader title="Projects" description="Every workstream you're contributing to, in one place." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <DynamicIcon name="folder" className="h-5 w-5" />
                </div>
                <StatusBadge status={project.status} />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-ink-800">{project.name}</p>
                <p className="mt-1 text-xs text-ink-400">{project.description}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-ink-400">
                  <span>{project.taskCount} tasks</span>
                  <span className="font-semibold text-ink-600">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.members.map((m) => (
                    <Avatar key={m} className="h-7 w-7 ring-2 ring-white">
                      <AvatarFallback className="text-[10px]">{initials(m)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                  <DynamicIcon name="calendar" className="h-3.5 w-3.5" /> {project.dueDate}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
