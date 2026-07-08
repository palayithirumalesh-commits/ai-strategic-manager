import { NavLink } from "react-router-dom";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { navForRole } from "./navConfig";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { closeMobileNav } from "@/app/uiSlice";
import { Sheet, SheetContent } from "@/components/ui/sheet";

function SidebarBrand() {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2 px-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-md">
        <DynamicIcon name="brain-circuit" className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-sm font-bold leading-none text-ink-800 dark:text-white">AI Strategic</p>
        <p className="text-[11px] leading-none text-ink-400">Manager</p>
      </div>
    </div>
  );
}

function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const items = navForRole(role);
  return (
    <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-2">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-white/5",
              isActive && "bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-md hover:from-brand-600 hover:to-violet-600 hover:text-white"
            )
          }
        >
          <DynamicIcon name={item.icon} className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

/** Desktop rail — pinned to the viewport, never scrolls with page content. */
export function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/60 lg:flex">
      <SidebarBrand />
      <SidebarNav role={role} />
      <div className="shrink-0 border-t border-ink-100 p-4 text-[11px] text-ink-400 dark:border-white/10">
        AI Strategic Manager v1.0
      </div>
    </aside>
  );
}

/** Off-canvas drawer used on small/medium screens, toggled from the header. */
export function MobileSidebar({ role }: { role: Role }) {
  const open = useAppSelector((s) => s.ui.mobileNavOpen);
  const dispatch = useAppDispatch();

  return (
    <Sheet open={open} onOpenChange={(v) => !v && dispatch(closeMobileNav())}>
      <SheetContent className="p-0">
        <SidebarBrand />
        <SidebarNav role={role} onNavigate={() => dispatch(closeMobileNav())} />
        <div className="shrink-0 border-t border-ink-100 p-4 text-[11px] text-ink-400 dark:border-white/10">
          AI Strategic Manager v1.0
        </div>
      </SheetContent>
    </Sheet>
  );
}
