import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchTasks, updateTaskStatus, createTask } from "@/api/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import type { Task } from "@/types";

const STATUSES: Task["status"][] = ["todo", "in-progress", "review", "done"];

const STATUS_LABEL: Record<Task["status"], string> = {
  todo: "To do",
  "in-progress": "In progress",
  review: "In review",
  done: "Done",
};

const taskSchema = z.object({
  title: z.string().min(3, "Give the task a short, clear title"),
  project: z.string().min(1, "Pick a project"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().min(1, "Pick a due date"),
});
type TaskForm = z.infer<typeof taskSchema>;

export default function MyTasksPage() {
  const [filter, setFilter] = useState<"all" | Task["priority"]>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: "medium", project: "Market Expansion" },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task["status"] }) => updateTaskStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData<Task[]>(["tasks"], (prev) =>
        prev ? prev.map((t) => (t.id === updated.id ? updated : t)) : prev
      );
    },
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(["tasks"], (prev) => (prev ? [task, ...prev] : [task]));
      toast({ title: "Task created", description: task.title, variant: "success" });
      setDialogOpen(false);
      reset();
    },
  });

  const filtered = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((t) => t.priority === filter)),
    [tasks, filter]
  );

  const columns = useMemo(() => {
    const map: Record<Task["status"], Task[]> = { todo: [], "in-progress": [], review: [], done: [] };
    filtered.forEach((t) => map[t.status].push(t));
    return map;
  }, [filtered]);

  return (
    <div>
      <PageHeader
        title="My Tasks"
        description="Drag your work forward — update status as you go."
        actions={
          <>
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <DynamicIcon name="plus" className="h-4 w-4" />
                  New task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a task</DialogTitle>
                  <DialogDescription>Add it to your board — it starts in To do.</DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={handleSubmit((v) => createMutation.mutate(v))}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="e.g. Review vendor proposal" {...register("title")} />
                    {errors.title && <p className="text-xs text-danger-500">{errors.title.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Project</Label>
                      <Select
                        defaultValue={watch("project")}
                        onValueChange={(v) => setValue("project", v)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Market Expansion", "Retention", "AI Onboarding", "Reporting", "Procurement"].map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Priority</Label>
                      <Select
                        defaultValue={watch("priority")}
                        onValueChange={(v) => setValue("priority", v as Task["priority"])}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dueDate">Due date</Label>
                    <Input id="dueDate" type="date" {...register("dueDate")} />
                    {errors.dueDate && <p className="text-xs text-danger-500">{errors.dueDate.message}</p>}
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Creating…" : "Create task"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-ink-400">Loading tasks…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATUSES.map((status) => (
            <div key={status}>
              <div className="mb-2 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-ink-600">{STATUS_LABEL[status]}</h3>
                <Badge variant="neutral">{columns[status].length}</Badge>
              </div>
              <div className="space-y-3">
                {columns[status].length === 0 && (
                  <p className="rounded-xl border border-dashed border-ink-200 p-4 text-center text-xs text-ink-300">
                    Nothing here
                  </p>
                )}
                {columns[status].map((task) => (
                  <Card key={task.id}>
                    <CardContent className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-ink-700">{task.title}</p>
                        <StatusBadge status={task.priority} />
                      </div>
                      <p className="text-xs text-ink-400">{task.project} · Due {task.dueDate}</p>
                      <Select
                        value={task.status}
                        onValueChange={(v) => statusMutation.mutate({ id: task.id, status: v as Task["status"] })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
