"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoURL?: string;
  provider?: string;
  hasPassword?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  loading: boolean;
  error: string;
  loginWithCredential: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshSession: () => Promise<void>;
  updateProfile: (payload: Record<string, unknown>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const authRequestId = useRef(0);

  const refreshSession = useCallback(async () => {
    const requestId = ++authRequestId.current;
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      if (requestId !== authRequestId.current) return;
      if (!response.ok) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      const result = (await response.json()) as { user: AuthUser };
      if (requestId !== authRequestId.current) return;
      setUser(result.user);
      setStatus("authenticated");
      setError("");
    } catch {
      if (requestId !== authRequestId.current) return;
      setUser(null);
      setStatus("unauthenticated");
      setError("Unable to check your session.");
    } finally {
      if (requestId === authRequestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const loginWithCredential = useCallback(async (idToken: string) => {
    const requestId = ++authRequestId.current;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const result = (await response.json()) as { error?: string; user?: AuthUser };
      if (requestId !== authRequestId.current) return;
      if (!response.ok || !result.user) {
        throw new Error(result.error || "Sign in failed.");
      }

      setUser(result.user);
      setStatus("authenticated");
    } catch (cause) {
      if (requestId !== authRequestId.current) return;
      setUser(null);
      setStatus("unauthenticated");
      setError(cause instanceof Error ? cause.message : "Sign in failed.");
    } finally {
      if (requestId === authRequestId.current) setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    ++authRequestId.current;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Sign out failed.");
      setUser(null);
      setStatus("unauthenticated");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Sign out failed.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload: Record<string, unknown>) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/session", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; user?: AuthUser };
      if (!response.ok || !result.user) {
        throw new Error(result.error || "Unable to update profile.");
      }

      setUser(result.user);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to update profile.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    status,
    loading,
    error,
    loginWithCredential,
    logout,
    clearError: () => setError(""),
    refreshSession,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
