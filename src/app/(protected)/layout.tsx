"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { ToastProvider } from "../../components/Toast";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      window.location.replace("/");
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-[#B31B38] border-t-transparent rounded-full animate-spin"/>
          <span className="text-[13px] text-[#888888]">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
        <AdminSidebar/>
        {/* pt-[56px] accounts for the mobile fixed top bar; removed on lg */}
        <main className="flex-1 overflow-y-auto pt-[56px] sm:pt-0">
          <div className="max-w-6xl mx-auto max-[370px]:px-3 px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
