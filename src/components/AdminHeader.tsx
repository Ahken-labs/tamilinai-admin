"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, PhotoIcon, UsersIcon, BillingIcon } from "../assets/Icons";

const NAV = [
  { label: "Photos",  href: "/photos",  Icon: PhotoIcon },
  { label: "Users",   href: "/users",   Icon: UsersIcon },
  { label: "Billing", href: "/billing", Icon: BillingIcon },
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
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F0EAEA]">
      <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center gap-6">

        {/* Brand */}
        <Link href="/photos" className="flex items-center gap-2.5 flex-shrink-0">
          <Logo />
          <div className="flex flex-col leading-none">
            <span className="font-tamil text-[16px] font-semibold tracking-[0.5px] text-[#222222]">
              இணை.lk
            </span>
            <span className="text-[9px] font-medium text-[#B31B38] tracking-[1.2px] uppercase mt-[1px]">
              Admin
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-px h-5 bg-[#EEEEEE] flex-shrink-0" />

        {/* Nav */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV.map(({ label, href, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors duration-150 ${
                  active
                    ? "bg-[#FFF0F3] text-[#B31B38]"
                    : "text-[#6B6B6B] hover:text-[#222222] hover:bg-[#F5F5F5]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-[#B31B38]" : "text-[#888888]"}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {adminName && (
            <span className="text-[13px] text-[#6B6B6B] font-medium hidden sm:block">
              {adminName}
            </span>
          )}
          <button
            type="button"
            onClick={logout}
            className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#B31B38]
              px-3 py-1.5 rounded-[8px] hover:bg-[#FFF0F3]
              transition-colors duration-150 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
