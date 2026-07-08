import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { fetchOpportunities } from "@/api/api";
import type { Opportunity } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function OpportunityDiscoveryPage() {
  const { data: opportunities = [], isLoading } = useQuery({ queryKey: ["opportunities"], queryFn: fetchOpportunities });

  const columns = useMemo<ColumnDef<Opportunity>[]>(
    () => [
      { accessorKey: "rank", header: "Rank", cell: ({ getValue }) => <Badge variant="violet">#{getValue<number>()}</Badge> },
      { accessorKey: "title", header: "Opportunity" },
      { accessorKey: "category", header: "Category", cell: ({ getValue }) => <Badge variant="neutral">{getValue<string>()}</Badge> },
      {
        accessorKey: "potentialValue",
        header: "Potential Value",
        cell: ({ getValue }) => formatCurrency(getValue<number>() * 1_000_000),
      },
      { accessorKey: "roi", header: "ROI", cell: ({ getValue }) => `${getValue<number>()}x` },
      {
        accessorKey: "confidence",
        header: "Confidence",
        cell: ({ getValue }) => <Badge variant={getValue<number>() >= 75 ? "success" : "warning"}>{getValue<number>()}%</Badge>,
      },
    ],
    []
  );

  return (
    <div>
      <PageHeader title="Opportunity Discovery" description="AI-surfaced growth, cost, and investment opportunities." />
      <Card>
        <CardHeader>
          <CardTitle>Ranked by Potential Value</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={opportunities} emptyMessage="No opportunities found." />
        </CardContent>
      </Card>
      {isLoading && <p className="mt-2 text-sm text-ink-400">Loading opportunities…</p>}
    </div>
  );
}
