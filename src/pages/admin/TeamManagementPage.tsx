import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { fetchEmployees, DUMMY_DEPARTMENT_PERFORMANCE } from "@/api/api";
import type { Employee } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";

export default function TeamManagementPage() {
  const { data: employees = [], isLoading } = useQuery({ queryKey: ["employees"], queryFn: fetchEmployees });

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Employee",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar><AvatarFallback>{initials(row.original.name)}</AvatarFallback></Avatar>
            <div>
              <p className="font-medium text-ink-700 dark:text-white">{row.original.name}</p>
              <p className="text-xs text-ink-400">{row.original.role}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: "department", header: "Department" },
      {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ getValue }) => (
          <div className="w-28">
            <Progress value={getValue<number>()} />
            <span className="text-xs text-ink-400">{getValue<number>()}%</span>
          </div>
        ),
      },
      {
        accessorKey: "performance",
        header: "Performance",
        cell: ({ getValue }) => <Badge variant={getValue<number>() >= 85 ? "success" : "warning"}>{getValue<number>()} / 100</Badge>,
      },
      {
        accessorKey: "skills",
        header: "Skills",
        cell: ({ getValue }) => (
          <div className="flex flex-wrap gap-1">
            {getValue<string[]>().map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <PageHeader title="Team & Resource Management" description="Departments, capacity, skills, and staffing insights." />

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization by Department</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DUMMY_DEPARTMENT_PERFORMANCE.map((d) => (
              <div key={d.department}>
                <div className="mb-1 flex justify-between text-xs text-ink-500">
                  <span>{d.department} · {d.headcount} people</span>
                  <span>{d.budgetUsed}%</span>
                </div>
                <Progress value={d.budgetUsed} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Staffing Suggestions</CardTitle>
            <CardDescription>Training recommendations included.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-600">
            <p>• Add 2 Customer Success reps — capacity at 95% and rising.</p>
            <p>• Cross-train 3 Engineering members in cloud cost optimization.</p>
            <p>• Marketing budget utilization (91%) suggests reallocating 1 headcount toward Product.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={employees} />
        </CardContent>
      </Card>
      {isLoading && <p className="mt-2 text-sm text-ink-400">Loading employees…</p>}
    </div>
  );
}
