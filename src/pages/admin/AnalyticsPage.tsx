import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fetchAnalytics } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

const RANGES = ["daily", "weekly", "monthly", "quarterly", "yearly"] as const;
const PIE_COLORS = ["#2f5fea", "#7b4cf0", "#16a34a", "#d97706", "#dc2626", "#0ea5e9"];

export default function AnalyticsPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("monthly");
  const { data, isLoading } = useQuery({ queryKey: ["analytics", range], queryFn: () => fetchAnalytics(range) });

  return (
    <div>
      <PageHeader title="Analytics" description="Revenue, customer, department, growth, and goal analytics." />

      <Tabs value={range} onValueChange={(v) => setRange(v as typeof range)} className="mb-4">
        <TabsList>
          {RANGES.map((r) => (
            <TabsTrigger key={r} value={r} className="capitalize">{r}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading || !data ? (
        <div className="flex h-64 items-center justify-center text-ink-400">Loading analytics…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader><CardTitle>Revenue Analytics</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.revenueTrend}>
                  <defs>
                    <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7b4cf0" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#7b4cf0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7f0" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => formatCurrency(v)} fontSize={12} tickLine={false} axisLine={false} width={56} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v), false)} />
                  <Area type="monotone" dataKey="profit" stroke="#7b4cf0" fill="url(#analyticsGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Department Analytics</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={data.departmentPerformance} dataKey="score" nameKey="department" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {data.departmentPerformance.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="xl:col-span-3">
            <CardHeader><CardTitle>Goal Analytics</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.goals}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7f0" />
                  <XAxis dataKey="title" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-10} textAnchor="end" height={60} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="progress" name="Progress %" fill="#2f5fea" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
