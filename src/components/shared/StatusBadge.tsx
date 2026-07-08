import { Badge } from "@/components/ui/badge";

const MAP: Record<string, { variant: "success" | "warning" | "danger" | "neutral" | "default" | "violet"; label: string }> = {
  "on-track": { variant: "success", label: "On track" },
  "at-risk": { variant: "warning", label: "At risk" },
  "off-track": { variant: "danger", label: "Off track" },
  complete: { variant: "neutral", label: "Complete" },
  todo: { variant: "neutral", label: "To do" },
  "in-progress": { variant: "default", label: "In progress" },
  review: { variant: "warning", label: "In review" },
  done: { variant: "success", label: "Done" },
  low: { variant: "success", label: "Low" },
  medium: { variant: "warning", label: "Medium" },
  high: { variant: "danger", label: "High" },
  critical: { variant: "danger", label: "Critical" },
  pending: { variant: "warning", label: "Pending" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "danger", label: "Rejected" },
  planned: { variant: "neutral", label: "Planned" },
  delayed: { variant: "danger", label: "Delayed" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = MAP[status] ?? { variant: "neutral" as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
