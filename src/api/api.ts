// =============================================================================
// api.ts — SINGLE SOURCE FOR ALL NETWORK CALLS
// -----------------------------------------------------------------------------
// This file intentionally contains BOTH the dummy data AND the dummy (mocked)
// API functions the rest of the app calls. Every real backend call is written
// out in a commented block directly above/below its mock counterpart so that
// swapping to the real MySQL-backed API later is a matter of:
//   1. Deleting the mock body / setTimeout simulation
//   2. Uncommenting the real axios call
//   3. Making sure the endpoint path matches your Express/Nest/etc. route
//
// Auth: JWT is stored in localStorage under "asm_token" / "asm_refresh_token"
// and attached to every request via the axios request interceptor below.
// A response interceptor handles 401s (token refresh placeholder + logout).
// =============================================================================

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type {
  ActivityItem,
  AIRecommendation,
  ApprovalItem,
  AuthUser,
  ChatMessage,
  DecisionCard,
  DepartmentPerformance,
  Employee,
  GoalProgress,
  Initiative,
  KpiCard,
  MeetingItem,
  NotificationItem,
  OKR,
  Opportunity,
  Project,
  ReportItem,
  RevenuePoint,
  RiskItem,
  Role,
  Scenario,
  SwotItem,
  Task,
} from "@/types";

// -----------------------------------------------------------------------------
// AXIOS INSTANCE + JWT INTERCEPTORS
// -----------------------------------------------------------------------------

export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.ai-strategic-manager.example.com/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export const TOKEN_KEY = "asm_token";
export const REFRESH_TOKEN_KEY = "asm_refresh_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function setStoredRefreshToken(token: string | null): void {
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Attach JWT bearer token to every outgoing request.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Handle 401 (expired token) — placeholder refresh flow.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // ---------------------------------------------------------------
        // REAL CALL — refresh the access token using the refresh token
        // ---------------------------------------------------------------
        // const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        // const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        // setStoredToken(data.accessToken);
        // setStoredRefreshToken(data.refreshToken);
        // originalRequest.headers.set("Authorization", `Bearer ${data.accessToken}`);
        // return apiClient(originalRequest);

        // No backend yet — clear session and force re-login.
        setStoredToken(null);
        setStoredRefreshToken(null);
        window.location.href = "/login";
      } catch (refreshError) {
        setStoredToken(null);
        setStoredRefreshToken(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Small helper used everywhere below to simulate network latency.
const mockDelay = <T>(data: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

// =============================================================================
// DUMMY DATA
// =============================================================================

export const DUMMY_USERS: (AuthUser & { password: string })[] = [
  {
    id: "u-1001",
    name: "Ava Sterling",
    email: "admin@asm.io",
    password: "Admin@123",
    role: "admin",
    department: "Executive Office",
    title: "Chief Strategy Officer",
    twoFactorEnabled: true,
  },
  {
    id: "u-2044",
    name: "Noah Patel",
    email: "user@asm.io",
    password: "User@123",
    role: "user",
    department: "Product",
    title: "Senior Product Manager",
    twoFactorEnabled: false,
  },
];

export const DUMMY_KPIS: KpiCard[] = [
  { id: "kpi-1", label: "Revenue", value: "$4.82M", delta: 12.4, trend: "up", icon: "banknote" },
  { id: "kpi-2", label: "Growth", value: "18.6%", delta: 3.1, trend: "up", icon: "trending-up" },
  { id: "kpi-3", label: "Profit", value: "$1.21M", delta: 6.8, trend: "up", icon: "wallet" },
  { id: "kpi-4", label: "Risk Score", value: "32 / 100", delta: -4.2, trend: "down", icon: "shield-alert" },
  { id: "kpi-5", label: "Projects", value: "27", delta: 2.0, trend: "up", icon: "kanban" },
  { id: "kpi-6", label: "Employees", value: "312", delta: 1.3, trend: "up", icon: "users" },
];

export const DUMMY_REVENUE_TREND: RevenuePoint[] = [
  { month: "Jan", revenue: 320000, profit: 78000, target: 300000 },
  { month: "Feb", revenue: 342000, profit: 81000, target: 310000 },
  { month: "Mar", revenue: 365000, profit: 90000, target: 330000 },
  { month: "Apr", revenue: 351000, profit: 84000, target: 340000 },
  { month: "May", revenue: 398000, profit: 101000, target: 350000 },
  { month: "Jun", revenue: 421000, profit: 112000, target: 370000 },
  { month: "Jul", revenue: 447000, profit: 121000, target: 390000 },
  { month: "Aug", revenue: 462000, profit: 128000, target: 400000 },
  { month: "Sep", revenue: 455000, profit: 118000, target: 410000 },
  { month: "Oct", revenue: 481000, profit: 133000, target: 420000 },
  { month: "Nov", revenue: 498000, profit: 140000, target: 430000 },
  { month: "Dec", revenue: 520000, profit: 152000, target: 450000 },
];

export const DUMMY_DEPARTMENT_PERFORMANCE: DepartmentPerformance[] = [
  { department: "Sales", score: 88, budgetUsed: 74, headcount: 48 },
  { department: "Marketing", score: 76, budgetUsed: 91, headcount: 32 },
  { department: "Engineering", score: 92, budgetUsed: 68, headcount: 87 },
  { department: "Product", score: 84, budgetUsed: 72, headcount: 29 },
  { department: "Customer Success", score: 79, budgetUsed: 60, headcount: 41 },
  { department: "Finance", score: 95, budgetUsed: 55, headcount: 18 },
];

export const DUMMY_GOALS: GoalProgress[] = [
  { id: "g-1", title: "Expand into APAC market", progress: 62, owner: "Ava Sterling", dueDate: "2026-09-30", status: "on-track" },
  { id: "g-2", title: "Reduce customer churn to 4%", progress: 45, owner: "Noah Patel", dueDate: "2026-08-15", status: "at-risk" },
  { id: "g-3", title: "Launch AI-assisted onboarding", progress: 88, owner: "Priya Nair", dueDate: "2026-07-20", status: "on-track" },
  { id: "g-4", title: "Cut infra cost by 15%", progress: 30, owner: "Marcus Lee", dueDate: "2026-10-01", status: "off-track" },
  { id: "g-5", title: "Ship v2 mobile app", progress: 100, owner: "Elena Cruz", dueDate: "2026-06-01", status: "complete" },
];

export const DUMMY_ACTIVITIES: ActivityItem[] = [
  { id: "a-1", actor: "Priya Nair", action: "submitted decision", target: "Q3 Pricing Strategy", timestamp: "10 min ago" },
  { id: "a-2", actor: "Marcus Lee", action: "updated risk", target: "Vendor Contract Renewal", timestamp: "42 min ago" },
  { id: "a-3", actor: "AI Assistant", action: "flagged opportunity", target: "Southeast Asia expansion", timestamp: "1 hr ago" },
  { id: "a-4", actor: "Elena Cruz", action: "completed goal", target: "Ship v2 mobile app", timestamp: "3 hrs ago" },
  { id: "a-5", actor: "Noah Patel", action: "commented on", target: "Scenario: Marketing Budget +20%", timestamp: "5 hrs ago" },
];

export const DUMMY_APPROVALS: ApprovalItem[] = [
  { id: "ap-1", title: "Increase marketing spend — Q3", requestedBy: "Priya Nair", amount: "$120,000", dueDate: "2026-07-10" },
  { id: "ap-2", title: "New hires — Engineering (3 roles)", requestedBy: "Marcus Lee", dueDate: "2026-07-12" },
  { id: "ap-3", title: "Vendor contract renewal — CloudOps", requestedBy: "Elena Cruz", amount: "$48,500", dueDate: "2026-07-15" },
];

export const DUMMY_MEETINGS: MeetingItem[] = [
  { id: "m-1", title: "Executive Strategy Sync", time: "Today, 3:00 PM", attendees: 6 },
  { id: "m-2", title: "Risk Review Board", time: "Tomorrow, 10:00 AM", attendees: 4 },
  { id: "m-3", title: "Product Roadmap Review", time: "Wed, 1:30 PM", attendees: 9 },
];

export const DUMMY_AI_RECOMMENDATIONS: AIRecommendation[] = [
  { id: "rec-1", title: "Reallocate 8% of marketing budget to APAC", description: "Regional CAC trending 22% lower with higher LTV over the last 2 quarters.", confidence: 87, impact: "high", category: "Growth" },
  { id: "rec-2", title: "Renegotiate cloud vendor contract", description: "Usage-based pricing shift could save an estimated $180K annually.", confidence: 74, impact: "medium", category: "Cost" },
  { id: "rec-3", title: "Accelerate hiring for Customer Success", description: "Ticket backlog growth outpacing headcount by 3 weeks.", confidence: 81, impact: "medium", category: "Operations" },
  { id: "rec-4", title: "Pilot dynamic pricing in EU region", description: "Elasticity modeling suggests 4-6% margin uplift with low churn risk.", confidence: 69, impact: "high", category: "Revenue" },
];

export const DUMMY_TASKS: Task[] = [
  { id: "t-1", title: "Finalize APAC market entry deck", project: "Market Expansion", priority: "high", status: "in-progress", dueDate: "2026-07-08" },
  { id: "t-2", title: "Review churn dashboard with CS team", project: "Retention", priority: "medium", status: "todo", dueDate: "2026-07-09" },
  { id: "t-3", title: "Approve onboarding copy revisions", project: "AI Onboarding", priority: "low", status: "review", dueDate: "2026-07-07" },
  { id: "t-4", title: "Publish Q2 performance report", project: "Reporting", priority: "high", status: "done", dueDate: "2026-06-30" },
  { id: "t-5", title: "Sync with vendor on contract terms", project: "Procurement", priority: "medium", status: "todo", dueDate: "2026-07-14" },
];

export const DUMMY_PROJECTS: Project[] = [
  { id: "pr-1", name: "Market Expansion", description: "APAC entry — go-to-market, legal, and localization workstreams.", status: "in-progress", progress: 62, dueDate: "2026-09-30", members: ["Ava Sterling", "Priya Nair"], taskCount: 14 },
  { id: "pr-2", name: "Retention", description: "Churn-reduction initiatives across onboarding and support.", status: "in-progress", progress: 45, dueDate: "2026-08-15", members: ["Noah Patel", "Lin Zhao"], taskCount: 9 },
  { id: "pr-3", name: "AI Onboarding", description: "AI-assisted onboarding flow for new enterprise accounts.", status: "in-progress", progress: 88, dueDate: "2026-07-20", members: ["Priya Nair", "Elena Cruz"], taskCount: 11 },
  { id: "pr-4", name: "Reporting", description: "Automated executive and investor reporting pipeline.", status: "complete", progress: 100, dueDate: "2026-06-30", members: ["Noah Patel"], taskCount: 6 },
  { id: "pr-5", name: "Procurement", description: "Vendor contract renewals and cost optimization.", status: "planned", progress: 20, dueDate: "2026-10-01", members: ["Marcus Lee"], taskCount: 5 },
];

export const DUMMY_OKRS: OKR[] = [
  {
    id: "okr-1",
    objective: "Become the category leader in APAC",
    owner: "Ava Sterling",
    quarter: "Q3 2026",
    keyResults: [
      { text: "Sign 12 new enterprise accounts", progress: 58 },
      { text: "Open 2 regional offices", progress: 40 },
      { text: "Reach $1.2M ARR in region", progress: 65 },
    ],
  },
  {
    id: "okr-2",
    objective: "Improve product-led retention",
    owner: "Noah Patel",
    quarter: "Q3 2026",
    keyResults: [
      { text: "Reduce churn to 4%", progress: 45 },
      { text: "Increase NPS to 55", progress: 70 },
      { text: "Ship 3 retention features", progress: 80 },
    ],
  },
];

export const DUMMY_SWOT: SwotItem[] = [
  { category: "strength", text: "Strong brand trust in enterprise segment" },
  { category: "strength", text: "High-performing engineering org (92 score)" },
  { category: "weakness", text: "Customer Success capacity below demand" },
  { category: "weakness", text: "Marketing budget concentrated in one region" },
  { category: "opportunity", text: "APAC market showing 22% lower CAC" },
  { category: "opportunity", text: "AI-assisted onboarding could cut ramp time 30%" },
  { category: "threat", text: "New competitor entering mid-market segment" },
  { category: "threat", text: "Cloud vendor pricing volatility" },
];

export const DUMMY_INITIATIVES: Initiative[] = [
  { id: "in-1", name: "APAC Market Entry", quarter: "Q3 2026", status: "in-progress", progress: 62, owner: "Ava Sterling" },
  { id: "in-2", name: "AI Onboarding Rollout", quarter: "Q3 2026", status: "in-progress", progress: 88, owner: "Priya Nair" },
  { id: "in-3", name: "Infra Cost Reduction", quarter: "Q4 2026", status: "planned", progress: 12, owner: "Marcus Lee" },
  { id: "in-4", name: "Mobile App v2", quarter: "Q2 2026", status: "complete", progress: 100, owner: "Elena Cruz" },
  { id: "in-5", name: "EU Dynamic Pricing Pilot", quarter: "Q4 2026", status: "delayed", progress: 20, owner: "Noah Patel" },
];

export const DUMMY_DECISIONS: DecisionCard[] = [
  {
    id: "d-1",
    name: "Q3 Pricing Strategy Adjustment",
    recommendation: "Introduce tiered enterprise pricing with usage-based add-ons.",
    confidence: 82,
    revenueEffect: 6.4,
    growthEffect: 3.2,
    riskLevel: "low",
    alternatives: ["Keep flat pricing", "Discount-led promotion"],
    status: "pending",
  },
  {
    id: "d-2",
    name: "Vendor Contract Renewal — CloudOps",
    recommendation: "Renew with usage-based clause, negotiate 12% discount.",
    confidence: 74,
    revenueEffect: 0,
    growthEffect: 0,
    riskLevel: "medium",
    alternatives: ["Switch vendor", "Renew as-is"],
    status: "pending",
  },
  {
    id: "d-3",
    name: "Customer Success Headcount Increase",
    recommendation: "Hire 4 additional CS reps in Q3 to offset backlog growth.",
    confidence: 79,
    revenueEffect: 1.1,
    growthEffect: 0.4,
    riskLevel: "low",
    alternatives: ["Outsource support", "Delay to Q4"],
    status: "approved",
  },
  {
    id: "d-4",
    name: "Discontinue Legacy SKU Line",
    recommendation: "Sunset legacy SKU within 2 quarters, migrate customers to core plan.",
    confidence: 68,
    revenueEffect: -2.1,
    growthEffect: 1.8,
    riskLevel: "high",
    alternatives: ["Keep indefinitely", "Sunset in 1 quarter"],
    status: "rejected",
  },
];

export const DUMMY_SCENARIOS: Scenario[] = [
  {
    id: "sc-1",
    name: "Increase Marketing Budget +20%",
    description: "Simulate reallocating additional spend into performance marketing channels.",
    variable: "Marketing Budget",
    changePercent: 20,
    projectedRevenue: 5.42,
    projectedProfit: 1.18,
    riskDelta: 4,
    results: [
      { month: "Jul", baseline: 447000, simulated: 468000 },
      { month: "Aug", baseline: 462000, simulated: 501000 },
      { month: "Sep", baseline: 455000, simulated: 512000 },
      { month: "Oct", baseline: 481000, simulated: 548000 },
      { month: "Nov", baseline: 498000, simulated: 571000 },
      { month: "Dec", baseline: 520000, simulated: 602000 },
    ],
  },
  {
    id: "sc-2",
    name: "Reduce Headcount Growth -10%",
    description: "Model the impact of slower hiring on burn rate and delivery velocity.",
    variable: "Headcount Growth",
    changePercent: -10,
    projectedRevenue: 4.61,
    projectedProfit: 1.34,
    riskDelta: -6,
    results: [
      { month: "Jul", baseline: 447000, simulated: 439000 },
      { month: "Aug", baseline: 462000, simulated: 451000 },
      { month: "Sep", baseline: 455000, simulated: 448000 },
      { month: "Oct", baseline: 481000, simulated: 470000 },
      { month: "Nov", baseline: 498000, simulated: 486000 },
      { month: "Dec", baseline: 520000, simulated: 505000 },
    ],
  },
];

export const DUMMY_EMPLOYEES: Employee[] = [
  { id: "e-1", name: "Priya Nair", department: "Product", role: "Product Manager", capacity: 82, performance: 91, skills: ["Roadmapping", "AI/ML", "UX Research"] },
  { id: "e-2", name: "Marcus Lee", department: "Engineering", role: "Engineering Manager", capacity: 76, performance: 88, skills: ["System Design", "Cloud", "Leadership"] },
  { id: "e-3", name: "Elena Cruz", department: "Engineering", role: "Mobile Lead", capacity: 90, performance: 94, skills: ["iOS", "Android", "React Native"] },
  { id: "e-4", name: "Sofia Rossi", department: "Marketing", role: "Growth Lead", capacity: 68, performance: 80, skills: ["Performance Marketing", "SEO", "Analytics"] },
  { id: "e-5", name: "James Okafor", department: "Sales", role: "Account Executive", capacity: 85, performance: 86, skills: ["Enterprise Sales", "Negotiation"] },
  { id: "e-6", name: "Lin Zhao", department: "Customer Success", role: "CS Manager", capacity: 95, performance: 77, skills: ["Retention", "Onboarding"] },
];

export const DUMMY_RISKS: RiskItem[] = [
  { id: "r-1", title: "Customer concentration in top 5 accounts", category: "Financial", level: "high", probability: 62, impact: 84, owner: "Ava Sterling", mitigation: "Diversify pipeline across 3 new verticals by Q4." },
  { id: "r-2", title: "Support backlog exceeding SLA", category: "Operational", level: "medium", probability: 70, impact: 55, owner: "Lin Zhao", mitigation: "Hire 4 additional CS reps and automate tier-1 tickets." },
  { id: "r-3", title: "Legacy auth system vulnerability", category: "Cyber", level: "critical", probability: 40, impact: 95, owner: "Marcus Lee", mitigation: "Migrate to managed identity provider within 60 days." },
  { id: "r-4", title: "Pending data-residency regulation (EU)", category: "Legal", level: "medium", probability: 55, impact: 60, owner: "Ava Sterling", mitigation: "Engage counsel; evaluate EU hosting region." },
  { id: "r-5", title: "Core platform dependency version EOL", category: "Technology", level: "medium", probability: 48, impact: 58, owner: "Marcus Lee", mitigation: "Schedule migration sprint in Q3." },
  { id: "r-6", title: "New entrant undercutting mid-market pricing", category: "Market", level: "low", probability: 35, impact: 40, owner: "Sofia Rossi", mitigation: "Monitor win/loss reports; adjust packaging." },
];

export const DUMMY_OPPORTUNITIES: Opportunity[] = [
  { id: "o-1", title: "APAC enterprise expansion", category: "Emerging Markets", potentialValue: 2.4, roi: 3.1, confidence: 84, rank: 1 },
  { id: "o-2", title: "Cloud infra consolidation", category: "Cost Saving", potentialValue: 0.6, roi: 4.8, confidence: 90, rank: 2 },
  { id: "o-3", title: "AI-assisted analytics add-on", category: "New Products", potentialValue: 1.8, roi: 2.6, confidence: 71, rank: 3 },
  { id: "o-4", title: "Mid-market upsell campaign", category: "Customer Opportunities", potentialValue: 1.1, roi: 3.4, confidence: 77, rank: 4 },
  { id: "o-5", title: "Strategic fintech partnership", category: "Investment Opportunities", potentialValue: 3.2, roi: 2.2, confidence: 58, rank: 5 },
];

export const DUMMY_REPORTS: ReportItem[] = [
  { id: "rp-1", name: "Q2 2026 Executive Summary", type: "Executive", generatedAt: "2026-07-01", format: "PDF" },
  { id: "rp-2", name: "Investor Update — July 2026", type: "Investor", generatedAt: "2026-07-03", format: "PowerPoint" },
  { id: "rp-3", name: "Q2 2026 Quarterly Report", type: "Quarterly", generatedAt: "2026-06-30", format: "Excel" },
  { id: "rp-4", name: "FY26 Strategic Plan Draft", type: "Strategic Plan", generatedAt: "2026-06-25", format: "PDF" },
  { id: "rp-5", name: "Department Performance — June", type: "Performance", generatedAt: "2026-06-28", format: "CSV" },
];

export const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  { id: "n-1", type: "decision", title: "Decision pending your review", description: "Q3 Pricing Strategy Adjustment needs approval.", timestamp: "10 min ago", read: false },
  { id: "n-2", type: "risk", title: "Risk level escalated", description: "Legacy auth system vulnerability moved to Critical.", timestamp: "1 hr ago", read: false },
  { id: "n-3", type: "task", title: "Task assigned to you", description: "Review churn dashboard with CS team.", timestamp: "2 hrs ago", read: true },
  { id: "n-4", type: "meeting", title: "Meeting reminder", description: "Executive Strategy Sync starts in 30 minutes.", timestamp: "3 hrs ago", read: true },
  { id: "n-5", type: "goal", title: "Goal completed", description: "Ship v2 mobile app marked complete.", timestamp: "1 day ago", read: true },
  { id: "n-6", type: "ai", title: "New AI recommendation", description: "Pilot dynamic pricing in EU region.", timestamp: "1 day ago", read: true },
];

export const DUMMY_CHAT_SUGGESTIONS: string[] = [
  "Summarize this quarter's biggest risks",
  "What's driving the APAC growth opportunity?",
  "Draft a recommendation for the pricing decision",
  "Compare department performance vs last quarter",
];

// =============================================================================
// AUTH
// =============================================================================

export async function loginRequest(payload: { email: string; password: string; role: Role }): Promise<{
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}> {
  // ---------------------------------------------------------------------
  // REAL CALL
  // ---------------------------------------------------------------------
  // const { data } = await apiClient.post("/auth/login", payload);
  // return data;

  // DUMMY BEHAVIOR: any email/password combination signs in successfully
  // (fastest path for frontend-only demos with no real backend yet).
  // If the email matches one of our seeded demo accounts, use its rich
  // profile data; otherwise synthesize a fresh user for whatever role
  // was selected on the login screen.
  const existing = DUMMY_USERS.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  const { password: _password, ...user } = existing ?? {
    id: `u-${Math.floor(Math.random() * 90000 + 10000)}`,
    name: payload.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "New User",
    email: payload.email,
    password: payload.password,
    role: payload.role,
    department: payload.role === "admin" ? "Executive Office" : "General",
    title: payload.role === "admin" ? "Administrator" : "Team Member",
    twoFactorEnabled: false,
  };
  const finalUser = { ...user, role: payload.role };
  return mockDelay({ user: finalUser, accessToken: `mock-jwt-${finalUser.id}`, refreshToken: `mock-refresh-${finalUser.id}` });
}

export async function signupRequest(payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
  // ---------------------------------------------------------------------
  // REAL CALL
  // ---------------------------------------------------------------------
  // const { data } = await apiClient.post("/auth/signup", payload);
  // return data;

  const user: AuthUser = {
    id: `u-${Math.floor(Math.random() * 90000 + 10000)}`,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    department: "Unassigned",
    title: payload.role === "admin" ? "Administrator" : "Team Member",
    twoFactorEnabled: false,
  };
  return mockDelay({ user, accessToken: `mock-jwt-${user.id}`, refreshToken: `mock-refresh-${user.id}` });
}

// Google OAuth signup/login — client ID left empty intentionally; will be
// supplied later. Wire this up with @react-oauth/google or Google Identity
// Services once the client ID is available.
export const GOOGLE_CLIENT_ID = ""; // TODO: paste Google OAuth Client ID here

export async function googleAuthRequest(_googleIdToken: string): Promise<{
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}> {
  // ---------------------------------------------------------------------
  // REAL CALL
  // ---------------------------------------------------------------------
  // const { data } = await apiClient.post("/auth/google", { idToken: googleIdToken });
  // return data;

  const user = DUMMY_USERS[1];
  const { password: _password, ...rest } = user;
  return mockDelay({ user: rest, accessToken: `mock-jwt-${rest.id}`, refreshToken: `mock-refresh-${rest.id}` });
}

export async function requestPasswordReset(_email: string): Promise<{ message: string }> {
  // ---------------------------------------------------------------------
  // REAL CALL
  // ---------------------------------------------------------------------
  // const { data } = await apiClient.post("/auth/forgot-password", { email });
  // return data;

  return mockDelay({ message: "OTP sent to your email." });
}

export async function verifyOtp(_email: string, otp: string): Promise<{ verified: boolean }> {
  // ---------------------------------------------------------------------
  // REAL CALL
  // ---------------------------------------------------------------------
  // const { data } = await apiClient.post("/auth/verify-otp", { email, otp });
  // return data;

  return mockDelay({ verified: otp.length === 6 });
}

export async function resetPassword(_email: string, _newPassword: string): Promise<{ message: string }> {
  // ---------------------------------------------------------------------
  // REAL CALL
  // ---------------------------------------------------------------------
  // const { data } = await apiClient.post("/auth/reset-password", { email, newPassword });
  // return data;

  return mockDelay({ message: "Password updated successfully." });
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  // ---------------------------------------------------------------------
  // REAL CALL
  // ---------------------------------------------------------------------
  // const { data } = await apiClient.get("/auth/me");
  // return data;

  const { password: _password, ...user } = DUMMY_USERS[0];
  return mockDelay(user, 300);
}

// =============================================================================
// DASHBOARD
// =============================================================================

export async function fetchAdminDashboard() {
  // const { data } = await apiClient.get("/dashboard/admin");
  // return data;
  return mockDelay({
    kpis: DUMMY_KPIS,
    revenueTrend: DUMMY_REVENUE_TREND,
    departmentPerformance: DUMMY_DEPARTMENT_PERFORMANCE,
    goals: DUMMY_GOALS,
    activities: DUMMY_ACTIVITIES,
    approvals: DUMMY_APPROVALS,
    meetings: DUMMY_MEETINGS,
    recommendations: DUMMY_AI_RECOMMENDATIONS,
  });
}

export async function fetchUserDashboard() {
  // const { data } = await apiClient.get("/dashboard/user");
  // return data;
  return mockDelay({
    tasks: DUMMY_TASKS,
    kpis: DUMMY_KPIS.slice(0, 3),
    goals: DUMMY_GOALS.slice(0, 3),
    recommendations: DUMMY_AI_RECOMMENDATIONS.slice(0, 2),
    activities: DUMMY_ACTIVITIES.slice(0, 3),
  });
}

// =============================================================================
// STRATEGIC PLANNING
// =============================================================================

export async function fetchStrategicPlanning() {
  // const { data } = await apiClient.get("/strategic-planning");
  // return data;
  return mockDelay({
    okrs: DUMMY_OKRS,
    swot: DUMMY_SWOT,
    initiatives: DUMMY_INITIATIVES,
    recommendations: DUMMY_AI_RECOMMENDATIONS.slice(0, 3),
  });
}

// =============================================================================
// AI STRATEGY ASSISTANT (chat)
// =============================================================================

export async function sendChatMessage(_history: ChatMessage[], message: string): Promise<ChatMessage> {
  // const { data } = await apiClient.post("/ai-assistant/chat", { history, message });
  // return data;
  const canned =
    "Based on current KPI trends, I'd recommend prioritizing the APAC expansion initiative — it shows the highest projected ROI with manageable risk exposure. Want me to draft a scenario simulation for a 20% budget increase?";
  return mockDelay(
    {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: message.trim().length > 0 ? canned : "Could you rephrase that?",
      confidence: 82,
      references: ["Revenue Trend Q2-Q3", "Opportunity Discovery: APAC Expansion"],
      timestamp: new Date().toISOString(),
    },
    900
  );
}

// =============================================================================
// DECISION INTELLIGENCE
// =============================================================================

export async function fetchDecisions(): Promise<DecisionCard[]> {
  // const { data } = await apiClient.get("/decisions");
  // return data;
  return mockDelay(DUMMY_DECISIONS);
}

export async function updateDecisionStatus(
  _id: string,
  _status: "approved" | "rejected"
): Promise<{ success: boolean }> {
  // const { data } = await apiClient.patch(`/decisions/${id}`, { status });
  // return data;
  return mockDelay({ success: true }, 300);
}

// =============================================================================
// SCENARIO SIMULATOR
// =============================================================================

export async function fetchScenarios(): Promise<Scenario[]> {
  // const { data } = await apiClient.get("/scenarios");
  // return data;
  return mockDelay(DUMMY_SCENARIOS);
}

export async function runScenarioSimulation(input: {
  variable: string;
  changePercent: number;
}): Promise<Scenario> {
  // const { data } = await apiClient.post("/scenarios/simulate", input);
  // return data;
  const factor = 1 + input.changePercent / 100;
  const results = DUMMY_REVENUE_TREND.slice(-6).map((point) => ({
    month: point.month,
    baseline: point.revenue,
    simulated: Math.round(point.revenue * (1 + (factor - 1) * 0.6)),
  }));
  return mockDelay(
    {
      id: `sc-${Date.now()}`,
      name: `${input.variable} ${input.changePercent > 0 ? "+" : ""}${input.changePercent}%`,
      description: "AI-generated simulation based on historical elasticity models.",
      variable: input.variable,
      changePercent: input.changePercent,
      projectedRevenue: +(5.1 * factor).toFixed(2),
      projectedProfit: +(1.2 * factor).toFixed(2),
      riskDelta: Math.round(input.changePercent / 4),
      results,
    },
    1100
  );
}

// =============================================================================
// MY TASKS
// =============================================================================

let taskStore: Task[] = [...DUMMY_TASKS];

export async function fetchTasks(): Promise<Task[]> {
  // const { data } = await apiClient.get("/tasks");
  // return data;
  return mockDelay([...taskStore]);
}

export async function updateTaskStatus(id: string, status: Task["status"]): Promise<Task> {
  // const { data } = await apiClient.patch(`/tasks/${id}`, { status });
  // return data;
  taskStore = taskStore.map((t) => (t.id === id ? { ...t, status } : t));
  const updated = taskStore.find((t) => t.id === id)!;
  return mockDelay(updated, 250);
}

export async function createTask(payload: {
  title: string;
  project: string;
  priority: Task["priority"];
  dueDate: string;
}): Promise<Task> {
  // const { data } = await apiClient.post("/tasks", payload);
  // return data;
  const task: Task = { id: `t-${Date.now()}`, status: "todo", ...payload };
  taskStore = [task, ...taskStore];
  return mockDelay(task, 400);
}

// =============================================================================
// GOALS
// =============================================================================

export async function fetchGoals(): Promise<GoalProgress[]> {
  // const { data } = await apiClient.get("/goals");
  // return data;
  return mockDelay(DUMMY_GOALS);
}

// =============================================================================
// PROJECTS
// =============================================================================

export async function fetchProjects(): Promise<Project[]> {
  // const { data } = await apiClient.get("/projects");
  // return data;
  return mockDelay(DUMMY_PROJECTS);
}

// =============================================================================
// TEAM & RESOURCE MANAGEMENT
// =============================================================================

export async function fetchEmployees(): Promise<Employee[]> {
  // const { data } = await apiClient.get("/team/employees");
  // return data;
  return mockDelay(DUMMY_EMPLOYEES);
}

// =============================================================================
// RISK MONITOR
// =============================================================================

export async function fetchRisks(): Promise<RiskItem[]> {
  // const { data } = await apiClient.get("/risks");
  // return data;
  return mockDelay(DUMMY_RISKS);
}

// =============================================================================
// OPPORTUNITY DISCOVERY
// =============================================================================

export async function fetchOpportunities(): Promise<Opportunity[]> {
  // const { data } = await apiClient.get("/opportunities");
  // return data;
  return mockDelay(DUMMY_OPPORTUNITIES);
}

// =============================================================================
// ANALYTICS
// =============================================================================

export async function fetchAnalytics(_range: "daily" | "weekly" | "monthly" | "quarterly" | "yearly") {
  // const { data } = await apiClient.get(`/analytics?range=${range}`);
  // return data;
  return mockDelay({
    revenueTrend: DUMMY_REVENUE_TREND,
    departmentPerformance: DUMMY_DEPARTMENT_PERFORMANCE,
    goals: DUMMY_GOALS,
  });
}

// =============================================================================
// REPORTS
// =============================================================================

export async function fetchReports(): Promise<ReportItem[]> {
  // const { data } = await apiClient.get("/reports");
  // return data;
  return mockDelay(DUMMY_REPORTS);
}

export async function generateReport(payload: {
  type: ReportItem["type"];
  format: ReportItem["format"];
}): Promise<ReportItem> {
  // const { data } = await apiClient.post("/reports/generate", payload);
  // return data;
  return mockDelay(
    {
      id: `rp-${Date.now()}`,
      name: `${payload.type} Report — ${new Date().toLocaleDateString()}`,
      type: payload.type,
      generatedAt: new Date().toISOString().slice(0, 10),
      format: payload.format,
    },
    1200
  );
}

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export async function fetchNotifications(): Promise<NotificationItem[]> {
  // const { data } = await apiClient.get("/notifications");
  // return data;
  return mockDelay(DUMMY_NOTIFICATIONS);
}

export async function markNotificationRead(_id: string): Promise<{ success: boolean }> {
  // const { data } = await apiClient.patch(`/notifications/${id}/read`);
  // return data;
  return mockDelay({ success: true }, 200);
}

// =============================================================================
// PROFILE / SETTINGS
// =============================================================================

export async function updateProfile(payload: Partial<AuthUser>): Promise<AuthUser> {
  // const { data } = await apiClient.put("/profile", payload);
  // return data;
  const { password: _password, ...base } = DUMMY_USERS[0];
  return mockDelay({ ...base, ...payload }, 500);
}

export async function changePassword(_payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  // const { data } = await apiClient.post("/profile/change-password", payload);
  // return data;
  return mockDelay({ message: "Password changed successfully." });
}

export async function toggleTwoFactor(_enabled: boolean): Promise<{ enabled: boolean }> {
  // const { data } = await apiClient.post("/profile/2fa", { enabled });
  // return data;
  return mockDelay({ enabled: _enabled }, 400);
}
