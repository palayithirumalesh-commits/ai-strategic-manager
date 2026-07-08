import { useQuery } from "@tanstack/react-query";
import { fetchUserDashboard } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCardGrid } from "@/components/shared/KpiCardGrid";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector } from "@/app/hooks";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";

export default function UserDashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { toast } = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["user-dashboard"], queryFn: fetchUserDashboard });
  const [doneTasks, setDoneTasks] = useState<Set<string>>(new Set());

  if (isLoading || !data) {
    return <div className="flex h-64 items-center justify-center text-ink-400">Loading dashboard…</div>;
  }

  return (
    <div>
      <PageHeader title={`Good to see you, ${user?.name?.split(" ")[0] ?? "there"}`} description="Here's your day at a glance." />

      <KpiCardGrid kpis={data.kpis} />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.tasks.map((t) => (
              <label
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 dark:border-white/10"
              >
                <Checkbox
                  checked={doneTasks.has(t.id)}
                  onCheckedChange={(checked) => {
                    setDoneTasks((prev) => {
                      const next = new Set(prev);
                      if (checked) {
                        next.add(t.id);
                        toast({ title: "Task completed", description: t.title, variant: "success" });
                      } else next.delete(t.id);
                      return next;
                    });
                  }}
                />
                <div className="flex-1">
                  <p className={"text-sm font-medium " + (doneTasks.has(t.id) ? "text-ink-300 line-through" : "text-ink-700")}>
                    {t.title}
                  </p>
                  <p className="text-xs text-ink-400">{t.project} · Due {t.dueDate}</p>
                </div>
                <StatusBadge status={doneTasks.has(t.id) ? "done" : t.status} />
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.goals.map((g) => (
              <div key={g.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-700">{g.title}</span>
                  <StatusBadge status={g.status} />
                </div>
                <Progress value={g.progress} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recommendations.map((r) => (
              <div key={r.id} className="rounded-xl border border-ink-100 p-3 dark:border-white/10">
                <p className="text-sm font-medium text-ink-700">{r.title}</p>
                <p className="mt-1 text-xs text-ink-400">{r.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                <div>
                  <p className="text-ink-700">
                    <span className="font-medium">{a.actor}</span> {a.action} <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="text-xs text-ink-400">{a.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
