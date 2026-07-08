import { useQuery } from "@tanstack/react-query";
import { fetchStrategicPlanning } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/shared/DynamicIcon";

const SWOT_STYLES: Record<string, string> = {
  strength: "border-success-500/30 bg-success-100/60",
  weakness: "border-danger-500/30 bg-danger-100/60",
  opportunity: "border-brand-500/30 bg-brand-50",
  threat: "border-warning-500/30 bg-warning-100/60",
};

export default function StrategicPlanningPage() {
  const { data, isLoading } = useQuery({ queryKey: ["strategic-planning"], queryFn: fetchStrategicPlanning });

  if (isLoading || !data) return <div className="flex h-64 items-center justify-center text-ink-400">Loading…</div>;

  return (
    <div>
      <PageHeader
        title="Strategic Planning"
        description="Company vision, OKRs, SWOT analysis, and the strategic roadmap."
        actions={
          <Button size="sm">
            <DynamicIcon name="plus" className="h-4 w-4" /> New Initiative
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Vision</p>
            <p className="mt-1 text-sm text-ink-700">Be the most trusted AI-driven strategy partner for growing enterprises.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Mission</p>
            <p className="mt-1 text-sm text-ink-700">Turn scattered business data into confident, fast decisions.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Objectives</p>
            <p className="mt-1 text-sm text-ink-700">Grow ARR 35% YoY while keeping risk score under 40.</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="okrs">
        <TabsList>
          <TabsTrigger value="okrs">OKRs</TabsTrigger>
          <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="okrs" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.okrs.map((okr) => (
            <Card key={okr.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{okr.objective}</CardTitle>
                  <Badge variant="neutral">{okr.quarter}</Badge>
                </div>
                <CardDescription>Owner: {okr.owner}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {okr.keyResults.map((kr) => (
                  <div key={kr.text}>
                    <div className="mb-1 flex justify-between text-xs text-ink-500">
                      <span>{kr.text}</span>
                      <span>{kr.progress}%</span>
                    </div>
                    <Progress value={kr.progress} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="swot">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(["strength", "weakness", "opportunity", "threat"] as const).map((cat) => (
              <Card key={cat} className={"border " + SWOT_STYLES[cat]}>
                <CardHeader>
                  <CardTitle className="capitalize">{cat}s</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.swot
                    .filter((s) => s.category === cat)
                    .map((s) => (
                      <p key={s.text} className="text-sm text-ink-700">
                        • {s.text}
                      </p>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roadmap">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Initiatives</CardTitle>
              <CardDescription>Priority matrix &amp; roadmap across quarters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.initiatives.map((init) => (
                <div key={init.id} className="flex flex-col gap-2 rounded-xl border border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                  <div>
                    <p className="text-sm font-medium text-ink-700">{init.name}</p>
                    <p className="text-xs text-ink-400">{init.quarter} · Owner: {init.owner}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32"><Progress value={init.progress} /></div>
                    <StatusBadge status={init.status} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {data.recommendations.map((r) => (
            <div key={r.id} className="rounded-xl border border-ink-100 p-4 dark:border-white/10">
              <Badge variant="violet">{r.category}</Badge>
              <p className="mt-2 text-sm font-medium text-ink-700">{r.title}</p>
              <p className="mt-1 text-xs text-ink-400">{r.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
