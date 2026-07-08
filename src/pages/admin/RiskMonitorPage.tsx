import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRisks } from "@/api/api";
import type { RiskItem } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Financial", "Operational", "Technology", "Legal", "Cyber", "Market"] as const;

export default function RiskMonitorPage() {
  const { data: risks = [], isLoading } = useQuery({ queryKey: ["risks"], queryFn: fetchRisks });
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(
    () => (category === "All" ? risks : risks.filter((r) => r.category === category)),
    [risks, category]
  );

  const counts = useMemo(() => {
    return { critical: risks.filter((r) => r.level === "critical").length, high: risks.filter((r) => r.level === "high").length };
  }, [risks]);

  return (
    <div>
      <PageHeader
        title="Risk Monitor"
        description="Track financial, operational, technology, legal, cyber, and market risk."
        actions={<Badge variant="danger">{counts.critical} critical · {counts.high} high</Badge>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)}>
            {c}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-ink-400">Loading risks…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r: RiskItem) => (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">{r.category}</Badge>
                  <StatusBadge status={r.level} />
                </div>
                <CardTitle className="mt-2">{r.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-center text-sm">
                  <div className="rounded-xl bg-ink-50 p-2 dark:bg-white/5">
                    <p className="text-xs text-ink-400">Probability</p>
                    <p className="font-semibold text-ink-800 dark:text-white">{r.probability}%</p>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-2 dark:bg-white/5">
                    <p className="text-xs text-ink-400">Impact</p>
                    <p className="font-semibold text-ink-800 dark:text-white">{r.impact}%</p>
                  </div>
                </div>
                <p className="text-xs text-ink-400">Owner: {r.owner}</p>
                <div className="rounded-xl bg-violet-50 p-3 text-xs text-violet-700">{r.mitigation}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
