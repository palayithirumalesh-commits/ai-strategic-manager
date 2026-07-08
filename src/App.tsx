import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "@/routes/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { useDarkModeSync } from "@/hooks/useDarkModeSync";

import SplashPage from "@/pages/auth/SplashPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import StrategicPlanningPage from "@/pages/admin/StrategicPlanningPage";
import DecisionIntelligencePage from "@/pages/admin/DecisionIntelligencePage";
import ScenarioSimulatorPage from "@/pages/admin/ScenarioSimulatorPage";
import TeamManagementPage from "@/pages/admin/TeamManagementPage";
import RiskMonitorPage from "@/pages/admin/RiskMonitorPage";
import OpportunityDiscoveryPage from "@/pages/admin/OpportunityDiscoveryPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";

import UserDashboardPage from "@/pages/user/UserDashboardPage";
import MyTasksPage from "@/pages/user/MyTasksPage";
import GoalsPage from "@/pages/user/GoalsPage";
import ProjectsPage from "@/pages/user/ProjectsPage";

import AIAssistantPage from "@/pages/shared/AIAssistantPage";
import ReportsPage from "@/pages/shared/ReportsPage";
import SettingsPage from "@/pages/shared/SettingsPage";
import ProfilePage from "@/pages/shared/ProfilePage";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-ink-50 text-center">
      <p className="font-display text-3xl font-bold text-ink-800">404</p>
      <p className="text-sm text-ink-400">This page doesn't exist.</p>
    </div>
  );
}

export default function App() {
  useDarkModeSync();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/splash" replace />} />
      <Route path="/splash" element={<SplashPage />} />

      {/* Public-only auth routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AppShell />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/strategic-planning" element={<StrategicPlanningPage />} />
          <Route path="/admin/decisions" element={<DecisionIntelligencePage />} />
          <Route path="/admin/scenarios" element={<ScenarioSimulatorPage />} />
          <Route path="/admin/team" element={<TeamManagementPage />} />
          <Route path="/admin/risks" element={<RiskMonitorPage />} />
          <Route path="/admin/opportunities" element={<OpportunityDiscoveryPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
          <Route path="/admin/ai-assistant" element={<AIAssistantPage />} />
        </Route>
      </Route>

      {/* User routes */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route element={<AppShell />}>
          <Route path="/user/dashboard" element={<UserDashboardPage />} />
          <Route path="/user/tasks" element={<MyTasksPage />} />
          <Route path="/user/goals" element={<GoalsPage />} />
          <Route path="/user/projects" element={<ProjectsPage />} />
          <Route path="/user/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/user/reports" element={<ReportsPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/user/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
