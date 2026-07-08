import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fetchScenarios, runScenarioSimulation } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import type { Scenario } from "@/types";

const VARIABLES = ["Marketing Budget", "Headcount Growth", "Product Pricing", "R&D Investment", "Sales Commission Rate"];

export default function ScenarioSimulatorPage() {
  const { data: scenarios = [] } = useQuery({ queryKey: ["scenarios"], queryFn: fetchScenarios });
  const [variable, setVariable] = useState(VARIABLES[0]);
  const [changePercent, setChangePercent] = useState(20);
  const [result, setResult] = useState<Scenario | null>(null);

  const simMutation = useMutation({
    mutationFn: () => runScenarioSimulation({ variable, changePercent }),
    onSuccess: (data) => setResult(data),
  });

  return (
    <div>
      <PageHeader title="Scenario Simulator" description="Model 'what-if' business changes before you commit." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Create Scenario</CardTitle>
            <CardDescription>e.g. Increase Marketing Budget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Variable</Label>
              <Select value={variable} onValueChange={setVariable}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VARIABLES.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Change (%)</Label>
              <Input
                type="number"
                value={changePercent}
                onChange={(e) => setChangePercent(Number(e.target.value))}
              />
            </div>
            <Button className="w-full" onClick={() => simMutation.mutate()} disabled={simMutation.isPending}>
              {simMutation.isPending ? "Running AI simulation…" : "Run Simulation"}
            </Button>

            {result && (
              <div className="space-y-3 rounded-xl border border-ink-100 p-4 dark:border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Projected Revenue</span>
                  <span className="font-semibold text-ink-800 dark:text-white">{formatCurrency(result.projectedRevenue * 1_000_000)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Projected Profit</span>
                  <span className="font-semibold text-ink-800 dark:text-white">{formatCurrency(result.projectedProfit * 1_000_000)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-400">Business Risk Delta</span>
                  <span className={"font-semibold " + (result.riskDelta > 0 ? "text-danger-500" : "text-success-500")}>
                    {result.riskDelta > 0 ? "+" : ""}{result.riskDelta} pts
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comparison Chart</CardTitle>
            <CardDescription>Baseline vs. simulated projection.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={result?.results ?? scenarios[0]?.results ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7f0" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => formatCurrency(v)} fontSize={12} tickLine={false} axisLine={false} width={56} />
                <Tooltip formatter={(v) => formatCurrency(Number(v), false)} />
                <Legend />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#a5b4fc" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="simulated" name="Simulated" stroke="#7b4cf0" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Saved Scenarios</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {scenarios.map((s) => (
            <div key={s.id} className="rounded-xl border border-ink-100 p-4 dark:border-white/10">
              <p className="text-sm font-medium text-ink-700">{s.name}</p>
              <p className="mt-1 text-xs text-ink-400">{s.description}</p>
              <div className="mt-2 flex gap-4 text-xs text-ink-500">
                <span>Revenue: <b className="text-ink-700">{formatCurrency(s.projectedRevenue * 1_000_000)}</b></span>
                <span>Profit: <b className="text-ink-700">{formatCurrency(s.projectedProfit * 1_000_000)}</b></span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
