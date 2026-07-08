import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateProfile, changePassword, toggleTwoFactor, fetchNotifications } from "@/api/api";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateUser } from "@/app/authSlice";
import { PageHeader } from "@/components/shared/PageHeader";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { initials } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  department: z.string().min(1, "Department is required"),
  title: z.string().min(1, "Title is required"),
});
type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { toast } = useToast();
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? false);

  const { data: notifications = [] } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      department: user?.department ?? "",
      title: user?.title ?? "",
    },
  });

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      dispatch(updateUser(updated));
      toast({ title: "Profile updated", variant: "success" });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      toast({ title: "Password changed", description: res.message, variant: "success" });
      passwordForm.reset();
    },
  });

  const twoFactorMutation = useMutation({
    mutationFn: toggleTwoFactor,
    onSuccess: (res) => {
      setTwoFactor(res.enabled);
      dispatch(updateUser({ twoFactorEnabled: res.enabled }));
      toast({ title: res.enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled", variant: "success" });
    },
  });

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Profile" description="Manage your personal information and security settings." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl">{initials(user.name)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => toast({ title: "Photo upload", description: "Pick a new photo — wire this up to your storage of choice." })}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white shadow"
              >
                <DynamicIcon name="camera" className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink-800">{user.name}</p>
              <p className="text-sm text-ink-400">{user.title}</p>
              <p className="text-xs text-ink-300">{user.department}</p>
            </div>
            <div className="mt-2 w-full rounded-xl bg-ink-50 p-3 text-left text-xs text-ink-500 dark:bg-white/5">
              <p className="mb-1 font-medium text-ink-600">Recent activity</p>
              {notifications.slice(0, 3).map((n) => (
                <p key={n.id} className="truncate">· {n.title}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>This is shown across the app and on generated reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                onSubmit={profileForm.handleSubmit((v) => profileMutation.mutate(v))}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" {...profileForm.register("name")} />
                  {profileForm.formState.errors.name && (
                    <p className="text-xs text-danger-500">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...profileForm.register("email")} />
                  {profileForm.formState.errors.email && (
                    <p className="text-xs text-danger-500">{profileForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" {...profileForm.register("department")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...profileForm.register("title")} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={profileMutation.isPending}>
                    {profileMutation.isPending ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Choose a strong password you don't use elsewhere.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                onSubmit={passwordForm.handleSubmit((v) => passwordMutation.mutate(v))}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-xs text-danger-500">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-xs text-danger-500">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-danger-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit" variant="outline" disabled={passwordMutation.isPending}>
                    {passwordMutation.isPending ? "Updating…" : "Change password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-factor authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-xl border border-ink-100 p-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-100 text-success-500">
                    <DynamicIcon name="shield-check" className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-700">
                      {twoFactor ? "Two-factor authentication is on" : "Two-factor authentication is off"}
                    </p>
                    <p className="text-xs text-ink-400">Use an authenticator app to approve sign-ins.</p>
                  </div>
                </div>
                <Switch
                  checked={twoFactor}
                  onCheckedChange={(v) => twoFactorMutation.mutate(v)}
                  disabled={twoFactorMutation.isPending}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
