import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/app/authSlice";
import { toggleDarkMode, toggleMobileNav } from "@/app/uiSlice";
import { fetchNotifications } from "@/api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { initials } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });
  const unread = notifications.filter((n) => !n.read).length;

  const aiPath = user?.role === "admin" ? "/admin/ai-assistant" : "/user/ai-assistant";
  const profilePath = user?.role === "admin" ? "/admin/profile" : "/user/profile";
  const settingsPath = user?.role === "admin" ? "/admin/settings" : "/user/settings";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-100 bg-white/70 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/70 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={() => dispatch(toggleMobileNav())}
      >
        <DynamicIcon name="menu" className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>
      <div className="flex shrink-0 items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-sm">
          <DynamicIcon name="brain-circuit" className="h-4 w-4" />
        </div>
      </div>
      <div className="relative hidden max-w-sm flex-1 sm:block">
        <DynamicIcon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <Input
          placeholder="Search decisions, risks, reports…"
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              toast({ title: "Search", description: `Showing results for "${(e.target as HTMLInputElement).value}"` });
            }
          }}
        />
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="violet" size="sm" onClick={() => navigate(aiPath)} className="hidden sm:inline-flex">
          <DynamicIcon name="brain-circuit" className="h-4 w-4" />
          AI Assistant
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <DynamicIcon name="bell" className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger-500" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unread > 0 && <Badge variant="danger">{unread} new</Badge>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="scrollbar-thin max-h-80 space-y-1 overflow-y-auto">
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-ink-400">{n.description}</span>
                  <span className="text-[11px] text-ink-300">{n.timestamp}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={() => dispatch(toggleDarkMode())}>
          <DynamicIcon name={darkMode ? "sun" : "moon"} className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-ink-100 dark:hover:bg-white/10">
              <Avatar>
                <AvatarFallback>{initials(user?.name ?? "U")}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-none text-ink-700 dark:text-white">{user?.name}</p>
                <p className="text-[11px] text-ink-400">{user?.title}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(profilePath)}>
              <DynamicIcon name="user" className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(settingsPath)}>
              <DynamicIcon name="settings" className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              <DynamicIcon name="log-out" className="h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
