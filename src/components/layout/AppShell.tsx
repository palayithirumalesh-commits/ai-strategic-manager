import { Outlet } from "react-router-dom";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppSelector } from "@/app/hooks";

export function AppShell() {
  const user = useAppSelector((s) => s.auth.user);
  if (!user) return null;
  return (
    <div className="min-h-screen">
      <Sidebar role={user.role} />
      <MobileSidebar role={user.role} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header />
        <main className="scrollbar-thin flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
