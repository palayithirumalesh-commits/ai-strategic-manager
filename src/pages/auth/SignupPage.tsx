import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { signupRequest } from "@/api/api";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/app/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { useToast } from "@/components/ui/toast";
import type { Role } from "@/types";

const signupSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [role, setRole] = useState<Role>("user");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const signupMutation = useMutation({
    mutationFn: (v: SignupForm) => signupRequest({ name: v.name, email: v.email, password: v.password, role }),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast({ title: "Account created", description: `Welcome, ${data.user.name}!`, variant: "success" });
      navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
      <div className="w-full max-w-md rounded-[var(--radius-card)] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500">
            <DynamicIcon name="brain-circuit" className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-ink-800">AI Strategic Manager</span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink-800">Create your account</h1>
        <p className="mt-1 text-sm text-ink-400">Start making smarter, faster business decisions.</p>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-ink-100/70 p-1">
          {(["user", "admin"] as Role[]).map((r) => (
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

        <form className="mt-6 space-y-4" onSubmit={handleSubmit((v) => signupMutation.mutate(v))}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Ava Sterling" {...register("name")} />
            {errors.name && <p className="text-xs text-danger-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
            {errors.email && <p className="text-xs text-danger-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="text-xs text-danger-500">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-xs text-danger-500">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
