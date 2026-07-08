import type { Role } from "@/types";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "layout-dashboard" },
  { label: "Strategic Planning", path: "/admin/strategic-planning", icon: "compass" },
  { label: "Decision Intelligence", path: "/admin/decisions", icon: "brain-circuit" },
  { label: "Scenario Simulator", path: "/admin/scenarios", icon: "flask-conical" },
  { label: "Team Management", path: "/admin/team", icon: "users" },
  { label: "Risk Monitor", path: "/admin/risks", icon: "shield-alert" },
  { label: "Opportunity Discovery", path: "/admin/opportunities", icon: "sparkles" },
  { label: "Analytics", path: "/admin/analytics", icon: "bar-chart-3" },
  { label: "Reports", path: "/admin/reports", icon: "file-text" },
  { label: "Settings", path: "/admin/settings", icon: "settings" },
];

export const USER_NAV: NavItem[] = [
  { label: "Dashboard", path: "/user/dashboard", icon: "layout-dashboard" },
  { label: "My Tasks", path: "/user/tasks", icon: "list-checks" },
  { label: "Goals", path: "/user/goals", icon: "target" },
  { label: "Projects", path: "/user/projects", icon: "kanban" },
  { label: "AI Assistant", path: "/user/ai-assistant", icon: "bot" },
  { label: "Reports", path: "/user/reports", icon: "file-text" },
  { label: "Profile", path: "/user/profile", icon: "user" },
  { label: "Settings", path: "/user/settings", icon: "settings" },
];

export function navForRole(role: Role): NavItem[] {
  return role === "admin" ? ADMIN_NAV : USER_NAV;
}
