"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminStats } from "../../../lib/api";
import type { AdminStats } from "../../../lib/api";
import {
  UsersIcon, EliteIcon, ActivityIcon, ClockIcon, AlertTriangleIcon,
  TrendingUpIcon, UserXIcon, UserBlockedIcon, UserPauseIcon, ImageIcon, ArrowUpRightIcon, StarIcon,
} from "@/assets/Icons";

function StatCard({
  label, value, sub, Icon, href, badge,
}: {
  label: string;
  value: number | string | null;
  sub?: string;
  Icon: React.FC<{ className?: string }>;
  href?: string;
  badge?: string;
}) {
  const router = useRouter();
  const clickable = !!href;

  return (
    <button
      type="button"
      onClick={() => href && router.push(href)}
      disabled={!clickable}
      className={`group w-full text-left bg-[#FFFFFF] border border-[#EBEBEB] rounded-[20px] max-[500px]:p-2 p-3 md:p-4
        transition-all duration-300
        hover:border-[#F0C8D0] hover:bg-[#FFF8F9] hover:shadow-[0_8px_32px_rgba(179,27,56,0.08)]
        ${clickable ? "cursor-pointer active:scale-[0.98]" : "cursor-default"}`}
    >
      <div className="flex items-start justify-between max-[500px]:mb-2 mb-3 md:mb-4">
        {/* Icon */}
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-[12px] border border-[#EBEBEB] bg-white
          flex items-center justify-center text-[#B31B38] shrink-0
          transition-all duration-300
          group-hover:bg-[#B31B38] group-hover:text-white group-hover:border-[#B31B38]"
        >
          <Icon className="w-4 md:w-4.5 h-4 md:h-4.5" />
        </div>

        {/* Arrow on hover (only clickable cards) */}
        {clickable && (
          <ArrowUpRightIcon className="w-4 h-4 text-[#222222] opacity-0 group-hover:opacity-100
            transition-opacity duration-200 mt-0.5 shrink-0" />
        )}
      </div>

      <p className="text-[14px] font-medium tracking-[0.5px] uppercase text-[#222222] mb-1 leading-none">
        {label}
      </p>
      <p className="text-[26px] md:text-[28px] font-bold text-[#222222] leading-none mb-1.5">
        {value === undefined || value === null ? (
          <span className="inline-flex items-end gap-[3px] h-[30px] pb-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#888888] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
              />
            ))}
          </span>
        ) : value}
      </p>
      {(sub || badge) && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF0F3] text-[#B31B38]">
              {badge}
            </span>
          )}
          {sub && <p className="text-[10px] sm:text-[12px] text-[#AAAAAA]">{sub}</p>}
        </div>
      )}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-[500px]:text-[12px] text-[14px] md:text-[16px] font-semibold tracking-[2px] uppercase text-[#AAAAAA] mb-2 first:mt-0">
      {children}
    </p>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  return (
    <div>
      {/* Page header */}
      <div className="mb-4">
        <h1 className="font-poppins text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">Dashboard</h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-[14px] text-[13px] text-[#B31B38]">
          {error}
        </div>
      )}

      {/* ── Users ─────────────────────────────────────────────────── */}
      <SectionLabel>Users</SectionLabel>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Users"      value={stats?.totalUsers      ?? null} Icon={UsersIcon}     href="/users"              sub="All registered" />
        <StatCard label="Joined - 7 days"  value={stats?.usersLast7Days  ?? null} Icon={TrendingUpIcon} href="/users"             badge="+7d" />
        <StatCard label="Joined - 30 days" value={stats?.usersLast30Days ?? null} Icon={TrendingUpIcon} href="/users"             badge="+30d" />
        <StatCard label="Blocked"          value={stats?.blockedUsers    ?? null} Icon={UserBlockedIcon} href="/users?tab=blocked" />
        <StatCard label="On Break"         value={stats?.onBreakUsers    ?? null} Icon={UserPauseIcon} href="/users?tab=on_break" />
        <StatCard label="Closed Accounts"  value={stats?.closedUsers     ?? null} Icon={UserXIcon}     href="/users?tab=closed"   sub="Pending deletion" />
      </div>

      {/* ── Elite ─────────────────────────────────────────────────── */}
      <SectionLabel>Elite</SectionLabel>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Elite Active"    value={stats?.eliteUsers    ?? null} Icon={StarIcon}   href="/users?tab=elite" sub="Currently subscribed" />
        <StatCard label="Elite - 7 days"  value={stats?.eliteLast7Days  ?? null} Icon={EliteIcon}  href="/users?tab=elite" badge="+7d" />
        <StatCard label="Elite - 30 days" value={stats?.eliteLast30Days ?? null} Icon={EliteIcon}  href="/users?tab=elite" badge="+30d" />
      </div>

      {/* ── Activity ──────────────────────────────────────────────── */}
      <SectionLabel>Activity</SectionLabel>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Active - Live"     value={stats?.activeUsersLive  ?? null} Icon={ActivityIcon}     sub="Past 24 hours" />
        <StatCard label="Inactive - 7 days" value={stats?.inactiveUsers7d  ?? null} Icon={ClockIcon}        href="/users?tab=inactive7"  sub="For outreach" />
        <StatCard label="Inactive - 45 days" value={stats?.inactiveUsers45d ?? null} Icon={AlertTriangleIcon} href="/users?tab=inactive45" sub="At risk of deletion" />
        <StatCard label="Pending Photos"    value={stats?.pendingPhotos    ?? null} Icon={ImageIcon}        href="/photos"               sub="Awaiting review" />
      </div>

      {/* ── Daily active history ───────────────────────────────────── */}
      {stats?.dailyActiveHistory && stats.dailyActiveHistory.length > 0 && (
        <>
        <SectionLabel>End of day active users - last 30 days</SectionLabel>
          <div className="bg-white rounded-[20px] border border-[#EBEBEB] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              <table className="w-full min-w-[340px]">
                <thead>
                  <tr className="border-b border-[#F5F5F5] bg-[#FAFAFA]">
                    <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#222] uppercase tracking-[1.5px]">Date</th>
                    <th className="text-right px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#222] uppercase tracking-[1.5px]">Active users</th>
                  </tr>
                </thead>
                <tbody>
                  {[...stats.dailyActiveHistory].reverse().map((row, i) => (
                    <tr key={row.date} className={`border-b border-[#F5F5F5] last:border-0 transition-colors ${i === 0 ? "bg-[#FFF8F9]" : "hover:bg-[#FAFAFA]"}`}>
                      <td className="px-5 py-3.5">
                        <span className={`text-[13px] ${i === 0 ? "font-semibold text-[#0A0A0A]" : "text-[#555]"}`}>
                          {formatDate(row.date)}
                          {i === 0 && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F3] text-[#B31B38] uppercase tracking-wide">
                              Today
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`text-[14px] font-bold ${i === 0 ? "text-[#B31B38]" : "text-[#0A0A0A]"}`}>
                          {row.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
