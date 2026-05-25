"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Photos", href: "/photos" },
  { label: "Users", href: "/users" },
  { label: "Billing", href: "/billing" },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin_user");
      if (raw) setAdminName((JSON.parse(raw) as { name: string }).name);
    } catch { /* ignore */ }
  }, []);

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#EEEEEE]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
        <span className="font-bold text-[#B31B38] text-lg tracking-tight flex-shrink-0">
          Inai{" "}
          <span className="text-[#6B6B6B] font-medium text-base">Admin</span>
        </span>

        <nav className="flex items-center gap-6 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-[#B31B38]"
                  : "text-[#6B6B6B] hover:text-[#222222]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 flex-shrink-0">
          {adminName && (
            <span className="text-sm text-[#222222]">{adminName}</span>
          )}
          <button
            type="button"
            onClick={logout}
            className="text-sm text-[#6B6B6B] hover:text-[#B31B38] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
