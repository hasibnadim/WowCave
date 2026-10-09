"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function ProfilePage() {
  const router = useRouter();
  const { user, status, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldState, setFieldState] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });
  const [passwordState, setPasswordState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (user) {
      setFieldState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      await updateProfile({
        firstName: fieldState.firstName,
        lastName: fieldState.lastName,
        username: fieldState.username,
      });
      setMessage("Profile information saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const hasExistingPassword = Boolean(user?.hasPassword);

  const handlePasswordSave = async () => {
    if (!passwordState.newPassword || passwordState.newPassword.length < 8) {
      setMessage("New password must be at least 8 characters long.");
      return;
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    if (hasExistingPassword && !passwordState.oldPassword) {
      setMessage("Current password is required to change your password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await updateProfile({
        ...(hasExistingPassword ? { oldPassword: passwordState.oldPassword } : {}),
        newPassword: passwordState.newPassword,
        confirmPassword: passwordState.confirmPassword,
      });
      setPasswordState({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setMessage(hasExistingPassword ? "Password changed successfully." : "Password set successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="flex-1 px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-primary/20 bg-card/80 p-6 shadow-[0_0_35px_rgba(0,255,136,0.08)] backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <UserRound className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-primary">Profile</p>
                <h1 className="mt-2 text-3xl font-black tracking-wider text-foreground">{user.displayName}</h1>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => void logout()}
              className="border-border bg-background/70 text-foreground"
            >
              Sign out
            </Button>
          </div>
        </div>

        {message ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
            {message}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card/80 p-6">
            <div className="mb-5 flex items-center gap-2 text-primary">
              <UserRound className="h-4 w-4" />
              <h2 className="text-xl font-bold tracking-wider">Account details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">First name</label>
                <input
                  value={fieldState.firstName}
                  onChange={(event) => setFieldState((state) => ({ ...state, firstName: event.target.value }))}
                  className={inputClass}
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Last name</label>
                <input
                  value={fieldState.lastName}
                  onChange={(event) => setFieldState((state) => ({ ...state, lastName: event.target.value }))}
                  className={inputClass}
                  placeholder="Last name"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Username</label>
                <input
                  value={fieldState.username}
                  onChange={(event) => setFieldState((state) => ({ ...state, username: event.target.value }))}
                  className={inputClass}
                  placeholder="username"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{user.email}</span>
                </div>
              </div>

              <Button onClick={() => void handleProfileSave()} disabled={loading} className="w-full">
                Save profile
              </Button>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card/80 p-6">
            <div className="mb-5 flex items-center gap-2 text-primary">
              <ShieldCheck className="h-4 w-4" />
              <h2 className="text-xl font-bold tracking-wider">Change password</h2>
            </div>

            <div className="space-y-4">
              {hasExistingPassword ? (
                <div>
                  <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Current password</label>
                  <input
                    type="password"
                    value={passwordState.oldPassword}
                    onChange={(event) => setPasswordState((state) => ({ ...state, oldPassword: event.target.value }))}
                    className={inputClass}
                    placeholder="Current password"
                  />
                </div>
              ) : null}

              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">New password</label>
                <input
                  type="password"
                  value={passwordState.newPassword}
                  onChange={(event) => setPasswordState((state) => ({ ...state, newPassword: event.target.value }))}
                  className={inputClass}
                  placeholder="New password"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Confirm password</label>
                <input
                  type="password"
                  value={passwordState.confirmPassword}
                  onChange={(event) => setPasswordState((state) => ({ ...state, confirmPassword: event.target.value }))}
                  className={inputClass}
                  placeholder="Confirm password"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                <Lock className="h-4 w-4 text-primary" />
                Use at least 8 characters for password updates.
              </div>

              <Button onClick={() => void handlePasswordSave()} disabled={loading} className="w-full" variant="outline">
                Update password
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
