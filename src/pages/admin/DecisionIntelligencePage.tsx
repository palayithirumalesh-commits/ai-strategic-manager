import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDecisions, updateDecisionStatus } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { useToast } from "@/components/ui/toast";
import { formatPercent } from "@/lib/utils";
import type { DecisionCard } from "@/types";

export default function DecisionIntelligencePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: decisions = [], isLoading } = useQuery({ queryKey: ["decisions"], queryFn: fetchDecisions });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) => updateDecisionStatus(id, status),
    onSuccess: (_res, vars) => {
      queryClient.setQueryData<DecisionCard[]>(["decisions"], (prev) =>
        prev?.map((d) => (d.id === vars.id ? { ...d, status: vars.status } : d))
      );
      toast({
        title: vars.status === "approved" ? "Decision approved" : "Decision rejected",
        variant: vars.status === "approved" ? "success" : "destructive",
      });
    },
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center text-ink-400">Loading…</div>;

  return (
    <div>
      <PageHeader title="Decision Intelligence" description="AI-backed recommendations awaiting your judgment." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {decisions.map((d) => (
          <Card key={d.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{d.name}</CardTitle>
                <StatusBadge status={d.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-ink-600">{d.recommendation}</p>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-ink-50 p-3 dark:bg-white/5">
                  <p className="text-xs text-ink-400">Confidence</p>
                  <p className="mt-1 font-display text-lg font-semibold text-ink-800 dark:text-white">{d.confidence}%</p>
                </div>
                <div className="rounded-xl bg-ink-50 p-3 dark:bg-white/5">
                  <p className="text-xs text-ink-400">Revenue Effect</p>
                  <p className="mt-1 font-display text-lg font-semibold text-success-500">{formatPercent(d.revenueEffect)}</p>
                </div>
                <div className="rounded-xl bg-ink-50 p-3 dark:bg-white/5">
                  <p className="text-xs text-ink-400">Growth Effect</p>
                  <p className="mt-1 font-display text-lg font-semibold text-brand-600">{formatPercent(d.growthEffect)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-400">Risk:</span>
                <StatusBadge status={d.riskLevel} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Alternatives</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {d.alternatives.map((a) => (
                    <Badge key={a} variant="outline">{a}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="success"
                  size="sm"
                  disabled={d.status !== "pending" || statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ id: d.id, status: "approved" })}
                  className="flex-1"
                >
                  <DynamicIcon name="check" className="h-4 w-4" /> Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={d.status !== "pending" || statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ id: d.id, status: "rejected" })}
                  className="flex-1"
                >
                  <DynamicIcon name="x" className="h-4 w-4" /> Reject
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toast({ title: "Discussion started", description: "Opened in AI Strategy Assistant." })}
                >
                  Discuss
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
