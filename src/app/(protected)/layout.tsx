"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      window.location.replace("/login");
    } else {
      setReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
        <span className="text-sm text-[#6B6B6B]">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
