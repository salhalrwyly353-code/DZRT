"use client";

import { useEffect, useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "dashboard_unlocked";
const DEFAULT_PASSWORD = "dzrt-admin-2026";

function getDashboardPassword(): string {
  return (
    (import.meta.env.VITE_DASHBOARD_PASSWORD as string | undefined) ||
    DEFAULT_PASSWORD
  );
}

interface Props {
  children: React.ReactNode;
}

export function DashboardGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd === getDashboardPassword()) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#0e1621] text-white px-4"
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-sm rounded-2xl border border-white/10 bg-[#17212b] p-8 shadow-2xl ${
          shake ? "animate-pulse" : ""
        }`}
        data-testid="form-dashboard-login"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold mb-1">لوحة التحكم</h1>
          <p className="text-white/50 text-sm">أدخل كلمة المرور للمتابعة</p>
        </div>

        <div className="space-y-3">
          <Input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setError(false);
            }}
            placeholder="كلمة المرور"
            autoFocus
            autoComplete="current-password"
            className="bg-[#242f3d] border-transparent text-center font-mono text-lg h-12 rounded-xl placeholder:text-white/30"
            data-testid="input-dashboard-password"
          />

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs justify-center" data-testid="error-dashboard-password">
              <ShieldAlert className="h-3.5 w-3.5" />
              كلمة المرور غير صحيحة
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-semibold text-base"
            disabled={!pwd}
            data-testid="button-dashboard-unlock"
          >
            دخول
          </Button>
        </div>
      </form>
    </div>
  );
}
