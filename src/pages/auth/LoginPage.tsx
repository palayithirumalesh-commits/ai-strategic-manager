import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { loginRequest, googleAuthRequest, GOOGLE_CLIENT_ID } from "@/api/api";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/app/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { useToast } from "@/components/ui/toast";
import type { Role } from "@/types";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [role, setRole] = useState<Role>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { rememberMe: true } });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginForm) => loginRequest({ email: payload.email, password: payload.password, role }),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast({ title: "Welcome back", description: `Signed in as ${data.user.name}`, variant: "success" });
      navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    },
    onError: (err: Error) => {
      toast({ title: "Sign in failed", description: err.message, variant: "destructive" });
    },
  });

  const googleMutation = useMutation({
    mutationFn: () => googleAuthRequest("mock-id-token"),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast({ title: "Signed in with Google", variant: "success" });
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    },
  });

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left visual panel */}
      <div className="relative hidden overflow-hidden bg-ink-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-brand-600/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500">
            <DynamicIcon name="brain-circuit" className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-white">AI Strategic Manager</span>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            Turn business data into intelligent decisions.
          </h2>
          <p className="mt-4 max-w-md text-ink-300">
            Executive dashboards, scenario simulation, and AI-backed recommendations —
            all in one strategic command center.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: "Revenue Growth", value: "+18.6%", icon: "trending-up" },
              { label: "Risk Reduced", value: "-4.2%", icon: "shield-alert" },
              { label: "Decisions/mo", value: "126", icon: "brain-circuit" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <DynamicIcon name={stat.icon} className="h-4 w-4 text-violet-300" />
                <p className="mt-2 font-display text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-ink-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-ink-400">© 2026 AI Strategic Manager. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold text-ink-800">Sign in</h1>
          <p className="mt-1 text-sm text-ink-400">Access your strategic command center.</p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-ink-100/70 p-1">
            {(["admin", "user"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={
                  "rounded-lg py-2 text-sm font-medium capitalize transition-all " +
                  (role === r ? "bg-white text-brand-700 shadow-sm" : "text-ink-500")
                }
              >
                {r}
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit((v) => loginMutation.mutate(v))}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
              {errors.email && <p className="text-xs text-danger-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger-500">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-500">
                <Checkbox defaultChecked {...register("rememberMe")} />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Signing in…" : `Sign in as ${role}`}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
            <div className="h-px flex-1 bg-ink-200" /> or continue with <div className="h-px flex-1 bg-ink-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (!GOOGLE_CLIENT_ID) {
                  toast({
                    title: "Google sign-in not configured",
                    description: "Add a Google OAuth client ID to enable this — using demo account for now.",
                  });
                }
                googleMutation.mutate();
              }}
            >
              Google
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Microsoft sign-in", description: "Microsoft SSO isn't wired up yet." })}>
              Microsoft
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-ink-400">
            New here?{" "}
            <Link to="/signup" className="font-medium text-brand-600 hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-ink-300">
            <button type="button" className="hover:underline">Privacy Policy</button> ·{" "}
            <button type="button" className="hover:underline">Terms</button> ·{" "}
            <button type="button" className="hover:underline">Support</button>
          </p>
          <p className="mt-3 rounded-lg bg-ink-50 p-2 text-center text-[11px] text-ink-400">
            Demo — admin@asm.io / Admin@123 · user@asm.io / User@123
          </p>
        </div>
      </div>
    </div>
  );
}
