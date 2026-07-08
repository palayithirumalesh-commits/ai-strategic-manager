import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { fetchReports, generateReport } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import type { ReportItem } from "@/types";

const REPORT_TYPES: ReportItem["type"][] = ["Executive", "Investor", "Quarterly", "Strategic Plan", "Performance"];
const FORMATS: ReportItem["format"][] = ["PDF", "PowerPoint", "Excel", "CSV"];

const FORMAT_ICON: Record<ReportItem["format"], string> = {
  PDF: "file-text",
  PowerPoint: "layers",
  Excel: "bar-chart-3",
  CSV: "clipboard",
};

const columns: ColumnDef<ReportItem, any>[] = [
  {
    accessorKey: "name",
    header: "Report",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DynamicIcon name={FORMAT_ICON[row.original.format]} className="h-4 w-4 text-brand-500" />
        <span className="font-medium text-ink-700">{row.original.name}</span>
      </div>
    ),
  },
  { accessorKey: "type", header: "Type", cell: ({ getValue }) => <Badge variant="violet">{getValue() as string}</Badge> },
  { accessorKey: "format", header: "Format" },
  { accessorKey: "generatedAt", header: "Generated" },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="sm">
        <DynamicIcon name="download" className="h-4 w-4" /> Download
      </Button>
    ),
  },
];

export default function ReportsPage() {
  const [type, setType] = useState<ReportItem["type"]>("Executive");
  const [format, setFormat] = useState<ReportItem["format"]>("PDF");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({ queryKey: ["reports"], queryFn: fetchReports });

  const generateMutation = useMutation({
    mutationFn: () => generateReport({ type, format }),
    onSuccess: (report) => {
      queryClient.setQueryData<ReportItem[]>(["reports"], (prev) => (prev ? [report, ...prev] : [report]));
      toast({ title: "Report generated", description: report.name, variant: "success" });
    },
  });

  return (
    <div>
      <PageHeader title="Reports" description="Generate and export business reports for stakeholders." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate a report</CardTitle>
          <CardDescription>Choose a report type and export format.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="w-48 space-y-1.5">
            <label className="text-xs font-medium text-ink-500">Report type</label>
            <Select value={type} onValueChange={(v) => setType(v as ReportItem["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-40 space-y-1.5">
            <label className="text-xs font-medium text-ink-500">Export format</label>
            <Select value={format} onValueChange={(v) => setFormat(v as ReportItem["format"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FORMATS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
            <DynamicIcon name="sparkles" className="h-4 w-4" />
            {generateMutation.isPending ? "Generating…" : "Generate report"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent reports</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-ink-400">Loading reports…</div>
          ) : (
            <DataTable columns={columns} data={reports} emptyMessage="No reports generated yet." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
