import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset, verifyOtp, resetPassword } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { useToast } from "@/components/ui/toast";

type Step = "email" | "otp" | "reset" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const sendOtpMutation = useMutation({
    mutationFn: () => requestPasswordReset(email),
    onSuccess: () => {
      setStep("otp");
      toast({ title: "OTP sent", description: `Check ${email} for your 6-digit code.` });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () => verifyOtp(email, otp),
    onSuccess: (data) => {
      if (data.verified) setStep("reset");
      else toast({ title: "Invalid code", description: "Enter the 6-digit code sent to your email.", variant: "destructive" });
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => resetPassword(email, password),
    onSuccess: () => setStep("success"),
  });

  const steps: Step[] = ["email", "otp", "reset", "success"];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
      <div className="w-full max-w-md rounded-[var(--radius-card)] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          {steps.slice(0, 3).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold " +
                  (i <= currentIndex ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-400")
                }
              >
                {i + 1}
              </div>
              {i < 2 && <div className={"h-0.5 w-8 " + (i < currentIndex ? "bg-brand-600" : "bg-ink-100")} />}
            </div>
          ))}
        </div>

        {step === "email" && (
          <>
            <h1 className="font-display text-xl font-semibold text-ink-800">Forgot your password?</h1>
            <p className="mt-1 text-sm text-ink-400">Enter your email and we'll send a one-time code.</p>
            <div className="mt-6 space-y-1.5">
              <Label htmlFor="reset-email">Email address</Label>
              <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <Button className="mt-6 w-full" size="lg" disabled={!email || sendOtpMutation.isPending} onClick={() => sendOtpMutation.mutate()}>
              {sendOtpMutation.isPending ? "Sending…" : "Send OTP"}
            </Button>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="font-display text-xl font-semibold text-ink-800">Enter verification code</h1>
            <p className="mt-1 text-sm text-ink-400">We sent a 6-digit code to {email}.</p>
            <div className="mt-6 space-y-1.5">
              <Label htmlFor="otp">One-time code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="text-center text-lg tracking-[0.5em]"
              />
            </div>
            <Button className="mt-6 w-full" size="lg" disabled={otp.length !== 6 || verifyOtpMutation.isPending} onClick={() => verifyOtpMutation.mutate()}>
              {verifyOtpMutation.isPending ? "Verifying…" : "Verify code"}
            </Button>
            <button className="mt-3 w-full text-center text-xs text-brand-600 hover:underline" onClick={() => sendOtpMutation.mutate()}>
              Resend code
            </button>
          </>
        )}

        {step === "reset" && (
          <>
            <h1 className="font-display text-xl font-semibold text-ink-800">Create a new password</h1>
            <p className="mt-1 text-sm text-ink-400">Make it strong and memorable.</p>
            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-danger-500">Passwords don't match.</p>
              )}
            </div>
            <Button
              className="mt-6 w-full"
              size="lg"
              disabled={!password || password !== confirmPassword || resetMutation.isPending}
              onClick={() => resetMutation.mutate()}
            >
              {resetMutation.isPending ? "Updating…" : "Reset password"}
            </Button>
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-500">
              <DynamicIcon name="check" className="h-7 w-7" />
            </div>
            <h1 className="mt-4 font-display text-xl font-semibold text-ink-800">Password updated</h1>
            <p className="mt-1 text-sm text-ink-400">You can now sign in with your new password.</p>
            <Button className="mt-6 w-full" size="lg" onClick={() => navigate("/login")}>
              Back to sign in
            </Button>
          </div>
        )}

        {step !== "success" && (
          <p className="mt-6 text-center text-sm text-ink-400">
            Remembered it?{" "}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
