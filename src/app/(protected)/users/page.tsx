"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { listUsers, blockUser, unblockUser, toggleElite, listClosedAccounts, listInactiveUsers, markUserCalled } from "../../../lib/api";
import type { AdminListUser, ClosedUser, InactiveUser } from "../../../lib/api";
import Popup from "@/components/Popup";
import TabBar from "@/components/TabBar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { AlertTriangleIcon, CopyDocumentIcon, EliteIcon, VerifiedIcon, DownloadExcelIcon } from "@/assets/Icons";
import { exportToExcel } from "@/lib/exportExcel";
import { useToast } from "@/components/Toast";
import Button from "@/components/Button";

// ── Module-level cache (persists across tab switches, cleared on logout) ───────
type CacheEntry = { users: AdminListUser[]; page: number; hasMore: boolean };
const usersCache = new Map<string, CacheEntry>();
export function clearUsersCache() { usersCache.clear(); }


function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function ucFirst(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function PhoneCopyCell({ phone }: { phone: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(phone).then(() => {
      toast({ type: "success", title: "Copied!", message: "Phone number copied to clipboard." });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex items-center gap-2 group">
      <a
        href={`https://wa.me/${phone.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#222222] font-medium hover:underline inline-block w-[120px] tabular-nums"
      >
        {phone}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        title="Copy phone number"
        className="text-[#8C8C8C] hover:text-[#B31B38] transition-colors opacity-100 group-hover:opacity-100 cursor-pointer"
      >
        {copied ? (
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-[#2E7D32]">
            <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <CopyDocumentIcon className="w-4 md:w-5 h-4 md:h-5 " />
        )}
      </button>
    </div>
  );
}

type Tab = "all" | "blocked" | "elite" | "on_break" | "closed" | "inactive45" | "inactive7";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All Users" },
  { key: "blocked", label: "Blocked" },
  { key: "elite", label: "Elite" },
  { key: "on_break", label: "On Break" },
  { key: "closed", label: "Closed" },
  { key: "inactive45", label: "Inactive 45d+" },
  { key: "inactive7", label: "Inactive 7d" },
];

// ── Skeleton rows ─────────────────────────────────────────────────────────────

function UserSkeletonRows({ count = 10 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
          <td className="px-5 py-4">
            <div className="h-4 bg-[#F2F2F2] rounded w-32 mb-1.5" />
            <div className="h-3 bg-[#F2F2F2] rounded w-20" />
          </td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-12" /></td>
          <td className="px-5 py-4"><div className="h-5 bg-[#F2F2F2] rounded-full w-14" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
          <td className="px-5 py-4 text-right"><div className="h-7 bg-[#F2F2F2] rounded-lg w-32 ml-auto" /></td>
        </tr>
      ))}
    </>
  );
}

function ClosedSkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
          <td className="px-5 py-4"><div className="h-4 bg-[#F2F2F2] rounded w-28 mb-1.5" /><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-36 mb-1.5" /><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-40" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
          <td className="px-5 py-4"><div className="h-5 bg-[#F2F2F2] rounded-full w-12" /></td>
        </tr>
      ))}
    </>
  );
}

// ── Pending action union ──────────────────────────────────────────────────────
type PendingUserAction =
  | { type: "block"; userId: string; name: string }
  | { type: "unblock"; userId: string; name: string }
  | { type: "elite_grant"; userId: string; name: string; plan: "basic" | "pro" | "max" }
  | { type: "elite_remove"; userId: string; name: string };

function AllUsersTab({ filter }: { filter?: "blocked" | "elite" | "on_break" }) {
  const router = useRouter();
  const { toast } = useToast();
  const cacheKey = filter ?? "all";
  const cached = usersCache.get(cacheKey);

  const [users, setUsers] = useState<AdminListUser[]>(cached?.users ?? []);
  const [loading, setLoading] = useState(!cached);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setApplied] = useState("");
  const [page, setPage] = useState(cached?.page ?? 1);
  const [hasMore, setHasMore] = useState(cached?.hasMore ?? false);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pendingAction, setPending] = useState<PendingUserAction | null>(null);

  const fetchUsers = useCallback(async (pg: number, q: string, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setError("");
    try {
      const res = await listUsers(pg, q || undefined, filter);
      setUsers((prev) => {
        const merged = append ? [...prev, ...res.users] : res.users;
        if (!q) usersCache.set(cacheKey, { users: merged, page: pg, hasMore: res.hasMore });
        return merged;
      });
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
  }, [filter, cacheKey]);

  // Skip initial fetch if we have cached data, only fetch when search changes
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      if (cached) return; // use cache, skip fetch
    }
    setPage(1);
    setUsers([]);
    fetchUsers(1, appliedSearch, false);
  }, [appliedSearch, fetchUsers]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchUsers(next, appliedSearch, true);
  }, [loading, loadingMore, hasMore, page, appliedSearch, fetchUsers]);

  const sentinelRef = useInfiniteScroll(handleLoadMore, hasMore && !loading && !loadingMore);

  function handleSearch(e: { preventDefault(): void }) {
    e.preventDefault();
    setApplied(searchInput);
  }

  function handleClear() {
    setSearchInput("");
    setApplied("");
  }

  async function executeAction() {
    if (!pendingAction) return;
    const act = pendingAction;
    setPending(null);
    const actKey = act.type.startsWith("elite") ? `${act.userId}_elite` : act.userId;
    setActing(actKey);
    try {
      if (act.type === "block") {
        await blockUser(act.userId);
        setUsers((p) => p.map((u) => u.id === act.userId ? { ...u, isBlocked: true } : u));
        toast({ type: "success", title: `${act.name} blocked` });
      } else if (act.type === "unblock") {
        await unblockUser(act.userId);
        setUsers((p) => p.map((u) => u.id === act.userId ? { ...u, isBlocked: false } : u));
        toast({ type: "success", title: `${act.name} unblocked` });
      } else if (act.type === "elite_grant") {
        await toggleElite(act.userId, true, act.plan);
        setUsers((p) => p.map((u) => u.id === act.userId ? { ...u, isElite: true } : u));
      } else if (act.type === "elite_remove") {
        await toggleElite(act.userId, false);
        setUsers((p) => p.map((u) => u.id === act.userId ? { ...u, isElite: false } : u));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActing(null);
    }
  }

  const popupTitle =
    !pendingAction ? "" :
      pendingAction.type === "block" ? `Block ${pendingAction.name}?` :
        pendingAction.type === "unblock" ? `Unblock ${pendingAction.name}?` :
          pendingAction.type === "elite_remove" ? "Remove Elite access?" :
            `Grant Elite ${ucFirst(pendingAction.plan)}?`;

  const popupSubtitle =
    !pendingAction ? "" :
      pendingAction.type === "block" ? "This user won't be able to log in or use the platform." :
        pendingAction.type === "unblock" ? `${pendingAction.name} will regain full access to the platform.` :
          pendingAction.type === "elite_remove" ? `${pendingAction.name} will lose Elite access and revert to the free plan.` :
            `${pendingAction.name} will receive Elite ${ucFirst(pendingAction.plan)} access.`;

  const popupLabel =
    !pendingAction ? "Confirm" :
      pendingAction.type === "block" ? "Yes, block" :
        pendingAction.type === "unblock" ? "Yes, unblock" :
          pendingAction.type === "elite_remove" ? "Yes, remove" :
            "Yes, grant";

  const isDestructive =
    pendingAction?.type === "block" || pendingAction?.type === "elite_remove";

  return (
    <>
      <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by email or phone…"
          className="flex-1 border border-[#E6E6E6] rounded-xl px-4 py-2.5 text-[14px] md:text-[16px] text-[#222]
            placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors bg-white"
        />
        <Button type="submit" text="Search" />
        {appliedSearch && (
          <Button white text="Clear" onPress={handleClear} />
        )}
      </form>

      {error && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38]">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Gender</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Joined</th>
                <th className="text-right px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <UserSkeletonRows count={10} />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-[#888]">
                    No users found.
                  </td>
                </tr>
              ) : (
                <>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#EAEAEA] hover:bg-[#EAEAEA] transition-colors cursor-pointer"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("button,select")) return;
                        router.push(`/users/${user.id}`);
                      }}
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-[12px] md:text-[14px] font-medium text-[#222222]">{user.name}</p>
                        <p className="text-[12px] md:text-[14px] text-[#888]">{user.displayId}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] md:text-[14px] text-[#555] capitalize">
                          {user.gender?.toLowerCase() ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {user.isElite && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF3DC] text-[#A97216] text-[13px] font-semibold"><EliteIcon className="w-4 md:w-4.5 h-4 md:h-4.5 shrink-0" />Elite</span>}
                          {user.isBlocked && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF0F3] text-[#B31B38] text-[13px] font-semibold">Blocked</span>}
                          {user.isClosed && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B31B38] text-[#FFFFFF] text-[12px] sm:text-[13px] font-semibold"> <AlertTriangleIcon className="w-3.5 h-3.5"/> Closed</span>}
                          {user.trustBadge && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#8D5900] text-[13px] font-semibold"><VerifiedIcon className="w-4.5 md:w-5 h-4.5 md:h-5 shrink-0" />Verified</span>}
                          {!user.isElite && !user.isBlocked && !user.isClosed && !user.trustBadge &&
                            <span className="text-[14px] text-[#CCCCCC]">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] md:text-[14px] text-[#888]">{formatDate(user.createdAt)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            pink
                            disabled={acting === user.id}
                            text={acting === user.id ? "…" : user.isBlocked ? "Unblock" : "Block"}
                            className={`!py-1.5 ${user.isBlocked ? "!bg-[#B31B38] !text-white hover:!bg-[#8E162D]" : "!bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE0E7]"}`}
                            onPress={() => setPending(
                              user.isBlocked
                                ? { type: "unblock", userId: user.id, name: user.name }
                                : { type: "block", userId: user.id, name: user.name }
                            )}
                          />

                        </div>
                      </td>
                    </tr>
                  ))}
                  {loadingMore && <UserSkeletonRows count={3} />}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {!hasMore && users.length > 0 && (
        <p className="text-center text-[14px] md:text-[16px] text-[#CCCCCC] mt-4">All users loaded 🎉</p>
      )}

      <Popup
        open={!!pendingAction}
        onClose={() => setPending(null)}
        title={popupTitle}
        subtitle={popupSubtitle}
        buttons={[
          { label: "Cancel", onClick: () => setPending(null), variant: "secondary" },
          { label: popupLabel, onClick: executeAction, variant: isDestructive ? "danger" : "primary" },
        ]}
      />
    </>
  );
}

function InactiveSkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
          <td className="px-5 py-4"><div className="h-4 bg-[#F2F2F2] rounded w-28 mb-1.5" /><div className="h-3 bg-[#F2F2F2] rounded w-16" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-12" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-28" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-16" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
          <td className="px-5 py-4"><div className="h-7 bg-[#F2F2F2] rounded-lg w-28 ml-auto" /></td>
        </tr>
      ))}
    </>
  );
}

type GenderFilter = "all" | "male" | "female";

function GenderFilterDropdown({ value, onChange }: { value: GenderFilter; onChange: (v: GenderFilter) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const options: { value: GenderFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 md:text-[16px] text-[14px] font-semibold uppercase tracking-wide transition-colors
          ${value !== "all" ? "text-[#888]" : "text-[#888] hover:text-[#555]"}`}
      >
        Gender
        {value !== "all" && (
          <span className="normal-case tracking-normal font-normal md:text-[16px] text-[14px] ">({value})</span>
        )}
        <svg viewBox="0 0 10 10" fill="none" className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[100px] rounded-[10px] border border-[#EBEBEB] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`flex w-full items-center px-3 py-2 md:text-[16px] text-[14px] text-left transition-colors
                first:rounded-t-[10px] last:rounded-b-[10px]
                ${value === o.value ? "bg-[#FFF0F3] text-[#B31B38] font-medium" : "text-[#222] hover:bg-[#F5F5F5] font-medium"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function InactiveUsersTab({ days, onReady }: { days: 45 | 7; onReady?: (fn: () => void) => void }) {
  const router = useRouter();
  const [users, setUsers] = useState<InactiveUser[]>([]);
  const usersRef = useRef<InactiveUser[]>([]);
  const genderFilterRef = useRef<GenderFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [acting, setActing] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");

  useEffect(() => {
    setLoading(true);
    listInactiveUsers(days)
      .then((res) => {
        usersRef.current = res.users;
        setUsers(res.users);
        if (res.users.length > 0) onReady?.(handleExport);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [days]);

  async function handleMarkCalled(userId: string) {
    setActing(userId);
    try {
      await markUserCalled(userId, noteInputs[userId] || undefined);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, calledAt: new Date().toISOString(), callNote: noteInputs[userId] ?? null }
            : u
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActing(null);
    }
  }

  const isPhoneTab = days === 7;
  const visibleUsers = genderFilter === "all" ? users : users.filter((u) => u.gender.toLowerCase() === genderFilter);

  function handleExport() {
    const g = genderFilterRef.current;
    const all = usersRef.current;
    const data = g === "all" ? all : all.filter((u) => u.gender.toLowerCase() === g);
    const rows = data.map((u) => ({
      "Inai ID":       u.displayId,
      "Name":          u.name,
      "Gender":        u.gender,
      "Country Code":  u.countryCode,
      "Phone":         u.phone ?? "",
      "Last Active":   u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString("en-GB") : "Never",
      "Days Inactive": u.inactiveDays,
      "Warning Sent":  u.inactivityWarningSentAt ? new Date(u.inactivityWarningSentAt).toLocaleDateString("en-GB") : "No",
      "Called":        u.calledAt ? new Date(u.calledAt).toLocaleDateString("en-GB") : "No",
      "Call Note":     u.callNote ?? "",
    }));
    exportToExcel(rows, `inai-inactive-${days}d-${new Date().toISOString().slice(0, 10)}`);
  }

  return (
    <>
      <p className="text-[14px] text-[#888] mb-4">
        {isPhoneTab
          ? "Users inactive for 7+ days — phone numbers for WhatsApp outreach."
          : "Users inactive for 45+ days — at risk of deletion on day 60."}
      </p>

      {error && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38]">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3 md:text-[16px] text-[14px]  font-semibold text-[#888] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3">
                  <GenderFilterDropdown value={genderFilter} onChange={(v) => { genderFilterRef.current = v; setGenderFilter(v); }} />
                </th>
                {isPhoneTab && <th className="text-left px-5 py-3 md:text-[16px] text-[14px]  font-semibold text-[#888] uppercase tracking-wide">Phone</th>}
                <th className="text-left px-5 py-3 md:text-[16px] text-[14px]  font-semibold text-[#888] uppercase tracking-wide">Last active</th>
                <th className="text-left px-5 py-3 md:text-[16px] text-[14px]  font-semibold text-[#888] uppercase tracking-wide">Days</th>
                {!isPhoneTab && <th className="text-right px-5 py-3 md:text-[16px] text-[14px]  font-semibold text-[#888] uppercase tracking-wide">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <InactiveSkeletonRows count={8} />
              ) : visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-[#888]">
                    {users.length === 0 ? "No inactive users found." : `No ${genderFilter} users found.`}
                  </td>
                </tr>
              ) : (
                visibleUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[#F5F5F5] hover:bg-[#F5F5F5] transition-colors">
                    <td className="px-5 py-3.5 cursor-pointer" onClick={() => router.push(`/users/${u.id}`)}>
                      <p className="text-[13px] font-medium text-[#0A0A0A]">{u.name}</p>
                      <p className="text-[12px] text-[#888]">{u.displayId}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#555] capitalize">{u.gender}</td>
                    {isPhoneTab && (
                      <td className="px-5 py-3.5 text-[13px]">
                        {u.phone
                          ? <PhoneCopyCell phone={u.phone} />
                          : <span className="text-[#CCCCCC]">—</span>
                        }
                      </td>
                    )}
                    <td className="px-5 py-3.5 text-[13px] text-[#888]">
                      {formatDate(u.lastActiveAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.inactiveDays >= 55 ? "bg-[#FFF0F3] text-[#B31B38]" :
                          u.inactiveDays >= 45 ? "bg-[#FFF8E1] text-[#E65100]" :
                            "bg-[#F2F2F2] text-[#6B6B6B]"
                        }`}>
                        {u.inactiveDays}d
                      </span>
                    </td>
                    {!isPhoneTab && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {u.calledAt ? (
                            <div className="text-right">
                              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F0FDF4] text-[#2E7D32]">
                                Called
                              </span>
                              {u.callNote && (
                                <p className="text-[11px] text-[#888] mt-0.5 max-w-[160px] text-right">{u.callNote}</p>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={noteInputs[u.id] ?? ""}
                                onChange={(e) => setNoteInputs((p) => ({ ...p, [u.id]: e.target.value }))}
                                placeholder="Note (optional)"
                                className="border border-[#E6E6E6] rounded-lg px-2.5 py-1.5 text-xs text-[#222]
                                  placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] w-[130px] transition-colors"
                              />
                              <button
                                type="button"
                                disabled={acting === u.id}
                                onClick={() => handleMarkCalled(u.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F5F5F5] text-[#555]
                                  hover:bg-[#EEEEEE] transition-colors disabled:opacity-40 touch-manipulation"
                              >
                                {acting === u.id ? "…" : "Mark Called"}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ClosedAccountsTab() {
  const [users, setUsers] = useState<ClosedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  const fetchClosed = useCallback(async (pg: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setError("");
    try {
      const res = await listClosedAccounts(pg);
      setUsers((prev) => append ? [...prev, ...res.users] : res.users);
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClosed(1, false); }, [fetchClosed]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchClosed(next, true);
  }, [loading, loadingMore, hasMore, page, fetchClosed]);

  const sentinelRef = useInfiniteScroll(handleLoadMore, hasMore && !loading && !loadingMore);

  function daysColor(days: number) {
    if (days > 15) return "bg-[#F0FDF4] text-[#2E7D32]";
    if (days > 5) return "bg-[#FFF8E1] text-[#E65100]";
    return "bg-[#FFF0F3] text-[#B31B38]";
  }

  return (
    <>
      <p className="text-[14px] text-[#888] mb-4">
        Accounts pending deletion. Data is permanently erased after the 30-day grace period.
      </p>

      {error && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-[12px] md:text-[14px] text-[#B31B38]">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Contact</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Reason</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Closed</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Days left</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <ClosedSkeletonRows count={8} />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-[14px] md:text-[16px] text-[#888]">
                    No closed accounts.
                  </td>
                </tr>
              ) : (
                <>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-[#F5F5F5] hover:bg-[#F5F5F5] transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-[12px] md:text-[14px] font-medium text-[#0A0A0A]">{user.name}</p>
                        <p className="text-[12px] md:text-[14px] text-[#888]">{user.displayId}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-[12px] md:text-[14px] text-[#444]">{user.email}</p>
                        {user.phone && <p className="text-[12px] text-[#888] mt-0.5">{user.phone}</p>}
                      </td>
                      <td className="px-5 py-3.5 max-w-[220px]">
                        <p className="text-[12px] md:text-[14px] text-[#444] line-clamp-2">
                          {user.closeReason ?? <span className="text-[#AAAAAA]">No reason given</span>}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] md:text-[14px] text-[#888]">
                          {user.closedAt ? formatDate(user.closedAt) : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${daysColor(user.daysRemaining)}`}>
                          {user.daysRemaining}d
                        </span>
                      </td>
                    </tr>
                  ))}
                  {loadingMore && <ClosedSkeletonRows count={3} />}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div ref={sentinelRef} className="h-1" />

      {!hasMore && users.length > 0 && (
        <p className="text-center text-[14px] md:text-[16px] text-[#CCCCCC] mt-4">All accounts loaded 🎉</p>
      )}
    </>
  );
}

// ── Page — defined last so all tab components are resolved before JSX references them ──

export default function UsersPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab | null) ?? "all";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);

  const isInactiveTab = tab === "inactive45" || tab === "inactive7";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">User Management</h1>
        {isInactiveTab && exportFn && (
          <Button white className="!py-2" text="Export Excel" iconLeft={<DownloadExcelIcon className="w-5 h-5" />} onPress={exportFn} />
        )}
      </div>

      <TabBar tabs={TABS} active={tab} onChange={(k) => { setTab(k as Tab); setExportFn(null); }} className="mb-6" />

      {tab === "all" && <AllUsersTab />}
      {tab === "blocked" && <AllUsersTab filter="blocked" />}
      {tab === "elite" && <AllUsersTab filter="elite" />}
      {tab === "on_break" && <AllUsersTab filter="on_break" />}
      {tab === "closed" && <ClosedAccountsTab />}
      {tab === "inactive45" && <InactiveUsersTab days={45} onReady={(fn) => setExportFn(() => fn)} />}
      {tab === "inactive7" && <InactiveUsersTab days={7} onReady={(fn) => setExportFn(() => fn)} />}
    </div>
  );
}
