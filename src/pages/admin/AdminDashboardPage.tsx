import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";
import { fetchAdminDashboard } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCardGrid } from "@/components/shared/KpiCardGrid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { formatCurrency } from "@/lib/utils";
import { useAppSelector } from "@/app/hooks";

export default function AdminDashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: fetchAdminDashboard });

  if (isLoading || !data) {
    return <div className="flex h-64 items-center justify-center text-ink-400">Loading dashboard…</div>;
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Admin"}`}
        description="Here's what's shaping your business strategy today."
      />

      <KpiCardGrid kpis={data.kpis} />

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue vs. target across the fiscal year.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.revenueTrend} margin={{ left: 8, right: 16 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f5fea" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2f5fea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickFormatter={(v) => formatCurrency(v)} tickLine={false} axisLine={false} fontSize={12} width={56} />
                <Tooltip formatter={(v) => formatCurrency(Number(v), false)} />
                <Area type="monotone" dataKey="target" stroke="#c7d2fe" fill="none" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="revenue" stroke="#2f5fea" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Executive Summary</CardTitle>
            <CardDescription>Generated from this week's data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-600">
            <p>
              Revenue is tracking <span className="font-semibold text-success-500">12.4% above plan</span>, driven mainly
              by Engineering and Sales performance. Risk score improved to 32/100 after mitigating the vendor contract issue.
            </p>
            <p>
              Two decisions are pending approval and one initiative (Infra Cost Reduction) is behind schedule.
              Consider reviewing the APAC expansion opportunity — it shows the strongest ROI this quarter.
            </p>
            <div className="flex items-center gap-2 rounded-xl bg-violet-50 p-3 text-xs text-violet-700">
              <DynamicIcon name="sparkles" className="h-4 w-4 shrink-0" />
              Confidence: 84% · Based on 6 data sources
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Score out of 100, by department.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.departmentPerformance} margin={{ left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7f0" />
                <XAxis dataKey="department" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-12} textAnchor="end" height={50} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Score" fill="#2f5fea" radius={[6, 6, 0, 0]} />
                <Bar dataKey="budgetUsed" name="Budget used %" fill="#7b4cf0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategic Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.goals.map((goal) => (
              <div key={goal.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-700">{goal.title}</span>
                  <StatusBadge status={goal.status} />
                </div>
                <Progress value={goal.progress} />
                <p className="mt-1 text-xs text-ink-400">{goal.owner} · Due {goal.dueDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <div>
                  <p className="text-ink-700">
                    <span className="font-medium">{a.actor}</span> {a.action}{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="text-xs text-ink-400">{a.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.approvals.map((a) => (
              <div key={a.id} className="rounded-xl border border-ink-100 p-3 dark:border-white/10">
                <p className="text-sm font-medium text-ink-700">{a.title}</p>
                <p className="text-xs text-ink-400">
                  {a.requestedBy} {a.amount && `· ${a.amount}`} · Due {a.dueDate}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.meetings.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3 dark:border-white/10">
                <div>
                  <p className="text-sm font-medium text-ink-700">{m.title}</p>
                  <p className="text-xs text-ink-400">{m.time}</p>
                </div>
                <Badge variant="neutral">{m.attendees} attendees</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {data.recommendations.map((r) => (
            <div key={r.id} className="rounded-xl border border-ink-100 p-4 dark:border-white/10">
              <div className="flex items-center justify-between">
                <Badge variant="violet">{r.category}</Badge>
                <span className="text-xs text-ink-400">{r.confidence}% confidence</span>
              </div>
              <p className="mt-2 text-sm font-medium text-ink-700">{r.title}</p>
              <p className="mt-1 text-xs text-ink-400">{r.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
