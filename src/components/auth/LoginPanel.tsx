"use client";

import { useEffect, useRef, useState, useId } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import { InaiMarkIcon } from "@/assets/Icons";

// ─── Floating-label input — mirrors main website's InputBox style ─────────────
function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  error,
  autoFocus = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  useEffect(() => {
    if (autoFocus) setTimeout(() => ref.current?.focus(), 80);
  }, [autoFocus]);

  return (
    <div className="flex flex-col">
      <div
        className={`relative flex h-[52px] sm:h-[58px] items-center rounded-[14px] border px-4
          bg-[#F2F2F2] transition-colors duration-150
          ${focused ? "border-[#B31B38]" : "border-[#F2F2F2]"}`}
      >
        {/* Floating label */}
        <label
          htmlFor={id}
          className={`absolute left-4 pointer-events-none select-none text-[#888]
            transition-all duration-200 ease-in-out
            ${isActive
              ? "top-2 text-[11px] leading-none"
              : "top-1/2 -translate-y-1/2 text-[15px]"
            }`}
        >
          {label}
        </label>

        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          autoComplete={type === "password" ? "current-password" : "email"}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-[16px] text-[#0A0A0A] outline-none pt-5 leading-none"
        />
      </div>
      {error && (
        <p className="mt-1.5 text-[13px] text-[#B31B38] leading-snug">{error}</p>
      )}
    </div>
  );
}

// ─── Login panel modal ────────────────────────────────────────────────────────
export default function LoginPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [emailErr, setEmailErr]     = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [loading, setLoading]       = useState(false);

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();

    // Local validation
    let hasError = false;
    if (!email.trim())    { setEmailErr("Email is required");    hasError = true; }
    if (!password.trim()) { setPasswordErr("Password is required"); hasError = true; }
    if (hasError) return;

    setLoading(true);
    setEmailErr(""); setPasswordErr("");

    try {
      const res = await adminLogin(email, password);
      localStorage.setItem("admin_token", res.accessToken);
      localStorage.setItem("admin_user", JSON.stringify(res.admin));
      router.push("/dashboard");
    } catch (err) {
      setPasswordErr(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[8px]"/>

      {/* Card */}
      <div className="slide-in relative w-full max-w-[480px] bg-white rounded-[28px]
        shadow-[0_32px_80px_rgba(0,0,0,0.28)] overflow-hidden">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
            rounded-full text-[#AAAAAA] hover:text-[#222] hover:bg-[#F5F5F5]
            transition-colors cursor-pointer z-10"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Brand header */}
        <div className="flex flex-col items-center pt-10 pb-7 px-8 border-b border-[#F5F5F5]">
          <div className="w-16 h-16 rounded-[22px] bg-[#B31B38] text-white
            flex items-center justify-center mb-5
            shadow-[0_8px_28px_rgba(179,27,56,0.30)]">
            <InaiMarkIcon size={36}/>
          </div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#0A0A0A] leading-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-[14px] text-[#888] text-center leading-snug max-w-[260px]">
            Sign in to your Inai admin account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="px-7 sm:px-8 pt-7 pb-8 flex flex-col gap-4">
          <FloatingInput
            label="Email address"
            type="email"
            value={email}
            onChange={v => { setEmail(v); setEmailErr(""); }}
            error={emailErr}
            autoFocus
          />
          <FloatingInput
            label="Password"
            type="password"
            value={password}
            onChange={v => { setPassword(v); setPasswordErr(""); }}
            error={passwordErr}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full h-[52px] bg-[#B31B38] text-white text-[15px] font-semibold
              rounded-[14px] flex items-center justify-center gap-2
              hover:bg-[#9A1730] active:scale-[0.99] disabled:opacity-50
              transition-all duration-150 cursor-pointer
              shadow-[0_4px_20px_rgba(179,27,56,0.30)]"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
