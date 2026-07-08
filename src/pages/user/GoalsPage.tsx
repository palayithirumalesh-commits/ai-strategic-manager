import { useQuery } from "@tanstack/react-query";
import { fetchGoals } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function GoalsPage() {
  const { data: goals = [], isLoading } = useQuery({ queryKey: ["goals"], queryFn: fetchGoals });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-ink-400">Loading goals…</div>;
  }

  const complete = goals.filter((g) => g.status === "complete").length;

  return (
    <div>
      <PageHeader
        title="Goals"
        description={`${complete} of ${goals.length} goals complete this quarter.`}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <DynamicIcon name="target" className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-ink-800">{goal.title}</p>
                </div>
                <StatusBadge status={goal.status} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-ink-400">
                  <span>Progress</span>
                  <span className="font-semibold text-ink-600">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} />
              </div>
              <div className="flex items-center justify-between text-xs text-ink-400">
                <span className="inline-flex items-center gap-1">
                  <DynamicIcon name="user" className="h-3.5 w-3.5" /> {goal.owner}
                </span>
                <span className="inline-flex items-center gap-1">
                  <DynamicIcon name="calendar" className="h-3.5 w-3.5" /> Due {goal.dueDate}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
