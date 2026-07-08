import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleDarkMode } from "@/app/uiSlice";
import { PageHeader } from "@/components/shared/PageHeader";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

function SettingRow({ icon, label, description, control }: { icon: string; label: string; description: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-ink-100 p-4 dark:border-white/10">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <DynamicIcon name={icon} className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-700">{label}</p>
          <p className="text-xs text-ink-400">{description}</p>
        </div>
      </div>
      {control}
    </div>
  );
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const { toast } = useToast();
  const isAdmin = user?.role === "admin";

  const [notif, setNotif] = useState({ email: true, push: true, weekly: false });
  const [aiConfidence, setAiConfidence] = useState(70);
  const [language, setLanguage] = useState("en");

  const saveToast = (label: string) => toast({ title: "Settings saved", description: label, variant: "success" });

  return (
    <div>
      <PageHeader title="Settings" description={isAdmin ? "Manage your organization, users, and platform configuration." : "Manage your preferences."} />

      <Tabs defaultValue="appearance">
        <TabsList className="flex-wrap">
          {isAdmin && <TabsTrigger value="organization">Organization</TabsTrigger>}
          {isAdmin && <TabsTrigger value="users">Users & Permissions</TabsTrigger>}
          {isAdmin && <TabsTrigger value="ai">AI Configuration</TabsTrigger>}
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && <TabsTrigger value="integrations">Integrations</TabsTrigger>}
          {isAdmin && <TabsTrigger value="audit">Audit Logs</TabsTrigger>}
        </TabsList>

        {isAdmin && (
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle>Organization details</CardTitle>
                <CardDescription>These appear on generated reports and the login screen.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Organization name</Label>
                  <Input defaultValue="Sterling & Cruz Holdings" />
                </div>
                <div className="space-y-1.5">
                  <Label>Industry</Label>
                  <Input defaultValue="Enterprise SaaS" />
                </div>
                <div className="space-y-1.5">
                  <Label>Fiscal year start</Label>
                  <Select defaultValue="jan">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">January</SelectItem>
                      <SelectItem value="apr">April</SelectItem>
                      <SelectItem value="jul">July</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Time zone</Label>
                  <Select defaultValue="ist">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">India Standard Time</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Button onClick={() => saveToast("Organization details")}>Save changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users & roles</CardTitle>
                <CardDescription>Invite teammates and control what they can see.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Ava Sterling", email: "admin@asm.io", role: "Admin" },
                  { name: "Noah Patel", email: "user@asm.io", role: "Member" },
                  { name: "Priya Nair", email: "priya@asm.io", role: "Member" },
                ].map((u) => (
                  <div key={u.email} className="flex items-center justify-between rounded-xl border border-ink-100 p-3 dark:border-white/10">
                    <div>
                      <p className="text-sm font-medium text-ink-700">{u.name}</p>
                      <p className="text-xs text-ink-400">{u.email}</p>
                    </div>
                    <Badge variant={u.role === "Admin" ? "violet" : "neutral"}>{u.role}</Badge>
                  </div>
                ))}
                <Button variant="outline" onClick={() => saveToast("Invitation sent")}>
                  <DynamicIcon name="plus" className="h-4 w-4" /> Invite teammate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI configuration</CardTitle>
                <CardDescription>Tune how confident the AI assistant needs to be before surfacing a recommendation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-700">Minimum confidence threshold</span>
                    <span className="font-semibold text-brand-600">{aiConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={aiConfidence}
                    onChange={(e) => setAiConfidence(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
                <SettingRow
                  icon="brain-circuit"
                  label="Proactive recommendations"
                  description="Let the AI surface suggestions on the dashboard automatically."
                  control={<Switch defaultChecked />}
                />
                <SettingRow
                  icon="database"
                  label="Include historical data (3yr)"
                  description="Broader context improves scenario accuracy but slows responses slightly."
                  control={<Switch defaultChecked />}
                />
                <Button onClick={() => saveToast("AI configuration")}>Save configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Personalize how the workspace looks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <SettingRow
                icon={darkMode ? "sun" : "moon"}
                label="Dark mode"
                description="Switch between light and dark themes."
                control={<Switch checked={darkMode} onCheckedChange={() => dispatch(toggleDarkMode())} />}
              />
              <SettingRow
                icon="globe"
                label="Language"
                description="Choose your interface language."
                control={
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                    </SelectContent>
                  </Select>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>Choose how you want to hear about updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <SettingRow
                icon="mail"
                label="Email notifications"
                description="Decision approvals, risk alerts, and weekly summaries."
                control={<Switch checked={notif.email} onCheckedChange={(v) => setNotif((n) => ({ ...n, email: v }))} />}
              />
              <SettingRow
                icon="bell"
                label="Push notifications"
                description="Real-time alerts in your browser."
                control={<Switch checked={notif.push} onCheckedChange={(v) => setNotif((n) => ({ ...n, push: v }))} />}
              />
              <SettingRow
                icon="file-text"
                label="Weekly digest"
                description="A Monday-morning summary of KPIs and goal progress."
                control={<Switch checked={notif.weekly} onCheckedChange={(v) => setNotif((n) => ({ ...n, weekly: v }))} />}
              />
              <Button onClick={() => saveToast("Notification preferences")}>Save preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>API integrations</CardTitle>
                <CardDescription>Connect external systems to sync data automatically.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "MySQL Database", status: "Connected", icon: "database" },
                  { name: "Slack", status: "Not connected", icon: "message-square" },
                  { name: "Google Workspace", status: "Connected", icon: "mail" },
                  { name: "Salesforce", status: "Not connected", icon: "building2" },
                ].map((i) => (
                  <SettingRow
                    key={i.name}
                    icon={i.icon}
                    label={i.name}
                    description={i.status}
                    control={
                      <Button variant={i.status === "Connected" ? "outline" : "default"} size="sm">
                        {i.status === "Connected" ? "Manage" : "Connect"}
                      </Button>
                    }
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit log</CardTitle>
                <CardDescription>Recent security-relevant activity across the organization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { actor: "Ava Sterling", action: "Updated organization time zone", time: "10 min ago" },
                  { actor: "Marcus Lee", action: "Invited priya@asm.io as Member", time: "2 hrs ago" },
                  { actor: "System", action: "Nightly backup completed successfully", time: "6 hrs ago" },
                  { actor: "Ava Sterling", action: "Enabled two-factor authentication", time: "1 day ago" },
                ].map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-ink-100 pb-3 text-sm last:border-0 last:pb-0 dark:border-white/10">
                    <DynamicIcon name="activity" className="mt-0.5 h-4 w-4 text-ink-300" />
                    <div>
                      <p className="text-ink-700"><span className="font-medium">{entry.actor}</span> — {entry.action}</p>
                      <p className="text-xs text-ink-400">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
