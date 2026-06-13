"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  InaiMarkIcon,
  PhotoIcon,
  UsersIcon,
  BillingIcon,
  BellIcon,
  SignOutIcon,
  MenuIcon,
  DashboardIcon,
  SeedIcon, // remove this once website gets real profile traffic
} from "@/assets/Icons";
import Popup from "./Popup";
import { clearUsersCache } from "@/app/(protected)/users/page";
import { clearPhotosCache } from "@/app/(protected)/photos/page";

const NAV = [
  { label: "Dashboard", href: "/dashboard", Icon: DashboardIcon },
  { label: "Users", href: "/users", Icon: UsersIcon },
  { label: "Photos", href: "/photos", Icon: PhotoIcon },
  { label: "Billing", href: "/billing", Icon: BillingIcon },
  { label: "Notifications", href: "/notifications", Icon: BellIcon },
  // remove this once website gets real profile traffic
  { label: "Seeded", href: "/seeded", Icon: SeedIcon },
  // end-removal
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [adminName, setAdminName] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin_user");
      if (raw) setAdminName((JSON.parse(raw) as { name: string }).name);
    } catch { /* ignore */ }
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  function handleLogout() {
    clearUsersCache();
    clearPhotosCache();
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/");
  }

  const initials = adminName
    ? adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "I";

  // ── Shared sidebar body ───────────────────────────────────────────────────
  const SidebarBody = (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="h-[60px] flex items-center px-4 md:px-5 border-b border-[#EBEBEB] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 select-none">
          <div className="w-10 h-10 pr-0.5 pb-0.5 rounded-[20px] bg-[#BA0453] text-white
            flex items-center justify-center shrink-0">
            <InaiMarkIcon size={22} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-tamil text-[16px] font-bold tracking-[0.5px] text-[#222222]">
              இணை.lk
            </span>
            <span className="text-[10px] font-bold text-[#B31B38] tracking-[1.8px] uppercase mt-1">
              Admin
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 md:px-4 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[12px] font-semibold tracking-[1.8px] uppercase text-[#CCCCCC] px-3 mb-3">
          Management
        </p>
        {NAV.map(({ label, href, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-[10px] text-[14px] md:text-[16px] font-medium
                transition-colors duration-150 select-none
                ${active
                  ? "bg-[#FFF0F3] text-[#B31B38]"
                  : "text-[#555555] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
                }`}
            >
              <Icon className={`w-4 md:w-4.5 h-4 md:h-4.5 shrink-0 transition-colors
                ${active ? "text-[#B31B38]" : "text-[#222222]"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="border-t border-[#EBEBEB] px-3 py-3 shrink-0 space-y-0.5">
        {adminName && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-[10px]">
            <div className="w-7 h-7 rounded-full bg-[#B31B38] text-white flex items-center
              justify-center shrink-0 text-[10px] font-bold">
              {initials}
            </div>
            <span className="text-[14px] md:text-[16px] font-medium text-[#0A0A0A] truncate">{adminName}</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[14px] md:text-[16px] font-medium
            text-[#B31B38] hover:text-[#B31B38] hover:bg-[#FFF0F3]
            transition-colors duration-150 cursor-pointer"
        >
          <SignOutIcon className="w-4 md:w-5 h-4 md:h-5 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar — sticky, full height ── */}
      <aside className="hidden sm:flex w-[180px] md:w-[210px] shrink-0 flex-col h-screen sticky top-0
        border-r border-[#EBEBEB] bg-white">
        {SidebarBody}
      </aside>

      {/* ── Mobile: fixed top bar ── */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-40 h-[56px] z-50 w-full bg-white/60 backdrop-blur-sm
        border-b border-[#EBEBEB] flex items-center max-[370px]:px-2 px-4 gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen(v => !v)}
          className="w-8 h-8 flex items-center justify-center rounded-[8px]
            text-[#555555] hover:bg-[#F5F5F5] transition-colors cursor-pointer shrink-0"
          aria-label="Open menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 select-none flex-1"
        >
          <div className="w-8 h-8 pr-0.5 pb-0.5 rounded-[20px] bg-[#BA0453] text-white flex items-center justify-center shrink-0">
            <InaiMarkIcon size={18} />
          </div>

          <span className="font-tamil text-[16px] font-semibold text-[#0A0A0A]">
            இணை.lk
          </span>

          <span className="ml-auto text-[10px] font-bold text-[#B31B38] tracking-[1.5px] uppercase">
            Admin
          </span>
        </Link>
      </div>

      {/* ── Mobile: sidebar overlay ── */}
      {mobileOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="sm:hidden fixed top-0 left-0 bottom-0 z-50 w-[220px] bg-white
            border-r border-[#EBEBEB] flex flex-col
            shadow-[4px_0_24px_rgba(0,0,0,0.12)]">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-3.5 right-3 w-7 h-7 flex items-center justify-center
                rounded-full text-[#AAAAAA] hover:text-[#222] bg-[#F5F5F5] hover:bg-[#F5F5F5]
                transition-colors cursor-pointer z-10 duration-150 "
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor"
                  strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
            {SidebarBody}
          </aside>
        </>
      )}

      {/* Logout confirmation */}
      <Popup
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Log out"
        subtitle="Are you sure you want to log out of the admin panel?"
        buttons={[
          { label: "Cancel", onClick: () => setLogoutOpen(false), variant: "secondary" },
          { label: "Yes, log out", onClick: handleLogout, variant: "danger" },
        ]}
      />
    </>
  );
}
