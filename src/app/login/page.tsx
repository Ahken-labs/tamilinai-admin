"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_token")) router.replace("/photos");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      localStorage.setItem("admin_token", res.accessToken);
      localStorage.setItem("admin_user", JSON.stringify(res.admin));
      window.location.href = "/photos";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#EEEEEE] w-full max-w-md p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#B31B38]">Inai</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-[#222222] block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@inai.lk"
              className="w-full border border-[#E6E6E6] rounded-xl px-4 py-3 text-sm text-[#222222] placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#222222] block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#E6E6E6] rounded-xl px-4 py-3 text-sm text-[#222222] outline-none focus:border-[#B31B38] transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38] text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-[#B31B38] text-white text-sm font-semibold py-3 rounded-xl disabled:opacity-60 hover:bg-[#9A1730] transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
