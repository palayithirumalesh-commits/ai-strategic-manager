export type Role = "admin" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  title: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
}

export interface KpiCard {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
  icon: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  profit: number;
  target: number;
}

export interface DepartmentPerformance {
  department: string;
  score: number;
  budgetUsed: number;
  headcount: number;
}

export interface GoalProgress {
  id: string;
  title: string;
  progress: number;
  owner: string;
  dueDate: string;
  status: "on-track" | "at-risk" | "off-track" | "complete";
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  requestedBy: string;
  amount?: string;
  dueDate: string;
}

export interface MeetingItem {
  id: string;
  title: string;
  time: string;
  attendees: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  category: string;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "review" | "done";
  dueDate: string;
}

export interface OKR {
  id: string;
  objective: string;
  keyResults: { text: string; progress: number }[];
  owner: string;
  quarter: string;
}

export interface SwotItem {
  category: "strength" | "weakness" | "opportunity" | "threat";
  text: string;
}

export interface Initiative {
  id: string;
  name: string;
  quarter: string;
  status: "planned" | "in-progress" | "complete" | "delayed";
  progress: number;
  owner: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  references?: string[];
  timestamp: string;
}

export interface DecisionCard {
  id: string;
  name: string;
  recommendation: string;
  confidence: number;
  revenueEffect: number;
  growthEffect: number;
  riskLevel: "low" | "medium" | "high";
  alternatives: string[];
  status: "pending" | "approved" | "rejected";
}

export interface ScenarioResult {
  month: string;
  baseline: number;
  simulated: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  variable: string;
  changePercent: number;
  projectedRevenue: number;
  projectedProfit: number;
  riskDelta: number;
  results: ScenarioResult[];
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  capacity: number;
  performance: number;
  skills: string[];
  avatarUrl?: string;
}

export interface RiskItem {
  id: string;
  title: string;
  category: "Financial" | "Operational" | "Technology" | "Legal" | "Cyber" | "Market";
  level: "low" | "medium" | "high" | "critical";
  probability: number;
  impact: number;
  owner: string;
  mitigation: string;
}

export interface Opportunity {
  id: string;
  title: string;
  category: string;
  potentialValue: number;
  roi: number;
  confidence: number;
  rank: number;
}

export interface ReportItem {
  id: string;
  name: string;
  type: "Executive" | "Investor" | "Quarterly" | "Strategic Plan" | "Performance";
  generatedAt: string;
  format: "PDF" | "PowerPoint" | "Excel" | "CSV";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planned" | "in-progress" | "complete" | "delayed";
  progress: number;
  dueDate: string;
  members: string[];
  taskCount: number;
}

export interface NotificationItem {
  id: string;
  type: "task" | "decision" | "risk" | "meeting" | "goal" | "ai";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}
