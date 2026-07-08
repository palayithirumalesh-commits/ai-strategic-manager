import type { KpiCard } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { cn } from "@/lib/utils";

export function KpiCardGrid({ kpis }: { kpis: KpiCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <Card key={kpi.id} className="transition-transform hover:-translate-y-0.5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-brand-50 p-2 text-brand-600 dark:bg-white/10">
                <DynamicIcon name={kpi.icon} className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-semibold",
                  kpi.trend === "up" ? "text-success-500" : "text-danger-500"
                )}
              >
                <DynamicIcon name={kpi.trend === "up" ? "arrow-up-right" : "arrow-down-right"} className="h-3 w-3" />
                {Math.abs(kpi.delta)}%
              </span>
            </div>
            <p className="mt-3 text-xl font-semibold text-ink-800 dark:text-white">{kpi.value}</p>
            <p className="text-xs text-ink-400">{kpi.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
