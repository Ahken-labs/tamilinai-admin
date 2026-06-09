"use client";

import { useCallback, useEffect, useState } from "react";
import { listUsers, blockUser, unblockUser, toggleElite, listClosedAccounts } from "../../../lib/api";
import type { AdminListUser, ClosedUser } from "../../../lib/api";
import Popup from "@/components/Popup";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function ucFirst(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

type Tab = "all" | "closed";

export default function UsersPage() {
  const [tab, setTab] = useState<Tab>("all");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">User Management</h1>
      </div>

      {/* Scrollable tab bar — no wrapping on small screens */}
      <div className="flex gap-1 bg-[#F2F2F2] rounded-xl p-1 w-fit mb-6">
        {(["all", "closed"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium touch-manipulation ${
              tab === t ? "bg-white text-[#0A0A0A] shadow-sm" : "text-[#6B6B6B] hover:text-[#222]"
            }`}
          >
            {t === "all" ? "All Users" : "Closed Accounts"}
          </button>
        ))}
      </div>

      {tab === "all" ? <AllUsersTab /> : <ClosedAccountsTab />}
    </div>
  );
}

// ── Pending action union ───────────────────────────────────────────────────────
type PendingUserAction =
  | { type: "block";        userId: string; name: string }
  | { type: "unblock";      userId: string; name: string }
  | { type: "elite_grant";  userId: string; name: string; plan: "basic" | "pro" | "max" }
  | { type: "elite_remove"; userId: string; name: string };

function AllUsersTab() {
  const [users, setUsers]             = useState<AdminListUser[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setApplied]   = useState("");
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(false);
  const [acting, setActing]           = useState<string | null>(null);
  const [elitePlan, setElitePlan]     = useState<Record<string, "basic" | "pro" | "max">>({});
  const [error, setError]             = useState("");
  const [pendingAction, setPending]   = useState<PendingUserAction | null>(null);

  const fetchUsers = useCallback(async (pg: number, q: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await listUsers(pg, q || undefined);
      setUsers(res.users);
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(page, appliedSearch); }, [fetchUsers, page, appliedSearch]);

  function handleSearch(e: { preventDefault(): void }) {
    e.preventDefault();
    setPage(1);
    setApplied(searchInput);
  }

  function handleClear() {
    setSearchInput("");
    setApplied("");
    setPage(1);
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
      } else if (act.type === "unblock") {
        await unblockUser(act.userId);
        setUsers((p) => p.map((u) => u.id === act.userId ? { ...u, isBlocked: false } : u));
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

  // Popup strings derived from pending action type
  const popupTitle =
    !pendingAction ? "" :
    pendingAction.type === "block"        ? `Block ${pendingAction.name}?` :
    pendingAction.type === "unblock"      ? `Unblock ${pendingAction.name}?` :
    pendingAction.type === "elite_remove" ? "Remove Elite access?" :
    `Grant Elite ${ucFirst(pendingAction.plan)}?`;

  const popupSubtitle =
    !pendingAction ? "" :
    pendingAction.type === "block"        ? "This user won't be able to log in or use the platform." :
    pendingAction.type === "unblock"      ? `${pendingAction.name} will regain full access to the platform.` :
    pendingAction.type === "elite_remove" ? `${pendingAction.name} will lose Elite access and revert to the free plan.` :
    `${pendingAction.name} will receive Elite ${ucFirst(pendingAction.plan)} access.`;

  const popupLabel =
    !pendingAction ? "Confirm" :
    pendingAction.type === "block"        ? "Yes, block" :
    pendingAction.type === "unblock"      ? "Yes, unblock" :
    pendingAction.type === "elite_remove" ? "Yes, remove" :
    "Yes, grant";

  const isDestructive =
    pendingAction?.type === "block" || pendingAction?.type === "elite_remove";

  return (
    <>
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by email or phone…"
          className="flex-1 border border-[#E6E6E6] rounded-xl px-4 py-2.5 text-sm text-[#222]
            placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors bg-white"
        />
        <button
          type="submit"
          className="px-4 sm:px-5 py-2.5 bg-[#B31B38] text-white text-sm font-semibold rounded-xl
            hover:bg-[#9A1730] transition-colors shrink-0 touch-manipulation"
        >
          Search
        </button>
        {appliedSearch && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 sm:px-4 py-2.5 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl
              hover:bg-[#F2F2F2] transition-colors shrink-0 touch-manipulation"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38]">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">Gender</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">Joined</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-[#F2F2F2] rounded w-32 mb-1.5" /><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-12" /></td>
                    <td className="px-5 py-4"><div className="h-5 bg-[#F2F2F2] rounded-full w-14" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
                    <td className="px-5 py-4 text-right"><div className="h-7 bg-[#F2F2F2] rounded-lg w-32 ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-[#888]">
                    No users found.
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-semibold text-[#0A0A0A]">{user.name}</p>
                    <p className="text-[11px] text-[#888]">{user.displayId}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] text-[#555] capitalize">
                      {user.gender?.toLowerCase() ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {user.isElite    && <span className="px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#E65100] text-[10px] font-semibold">Elite</span>}
                      {user.isBlocked  && <span className="px-2 py-0.5 rounded-full bg-[#FFF0F3] text-[#B31B38] text-[10px] font-semibold">Blocked</span>}
                      {user.isClosed   && <span className="px-2 py-0.5 rounded-full bg-[#F2F2F2] text-[#6B6B6B] text-[10px] font-semibold">Closed</span>}
                      {user.trustBadge && <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#2E7D32] text-[10px] font-semibold">Verified</span>}
                      {!user.isElite && !user.isBlocked && !user.isClosed && !user.trustBadge &&
                        <span className="text-[12px] text-[#CCCCCC]">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] text-[#888]">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {/* Block / Unblock */}
                      <button
                        type="button"
                        disabled={acting === user.id}
                        onClick={() => setPending(
                          user.isBlocked
                            ? { type: "unblock", userId: user.id, name: user.name }
                            : { type: "block",   userId: user.id, name: user.name }
                        )}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                          disabled:opacity-40 touch-manipulation ${
                          user.isBlocked
                            ? "bg-[#F0FDF4] text-[#2E7D32] hover:bg-[#DCFCE7]"
                            : "bg-[#FFF0F3] text-[#B31B38] hover:bg-[#FFE0E7]"
                        }`}
                      >
                        {acting === user.id ? "…" : user.isBlocked ? "Unblock" : "Block"}
                      </button>

                      {/* Elite toggle */}
                      {user.isElite ? (
                        <button
                          type="button"
                          disabled={acting === `${user.id}_elite`}
                          onClick={() => setPending({ type: "elite_remove", userId: user.id, name: user.name })}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                            disabled:opacity-40 bg-[#FFF8E1] text-[#E65100] hover:bg-[#FEF3C7] touch-manipulation"
                        >
                          {acting === `${user.id}_elite` ? "…" : "Remove Elite"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <select
                            value={elitePlan[user.id] ?? "basic"}
                            onChange={(e) =>
                              setElitePlan((p) => ({ ...p, [user.id]: e.target.value as "basic" | "pro" | "max" }))
                            }
                            disabled={acting === `${user.id}_elite`}
                            className="text-xs border border-[#E6E6E6] rounded-lg px-2 py-1.5 bg-white
                              text-[#222] outline-none disabled:opacity-40 cursor-pointer"
                          >
                            <option value="basic">Basic</option>
                            <option value="pro">Pro</option>
                            <option value="max">Max</option>
                          </select>
                          <button
                            type="button"
                            disabled={acting === `${user.id}_elite`}
                            onClick={() => setPending({
                              type:   "elite_grant",
                              userId: user.id,
                              name:   user.name,
                              plan:   elitePlan[user.id] ?? "basic",
                            })}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                              disabled:opacity-40 bg-[#F5F5F5] text-[#555] hover:bg-[#EEEEEE] touch-manipulation"
                          >
                            {acting === `${user.id}_elite` ? "…" : "Grant"}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-5">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl
            hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          ← Prev
        </button>
        <span className="text-sm text-[#888]">Page {page}</span>
        <button
          type="button"
          disabled={!hasMore || loading}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl
            hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          Next →
        </button>
      </div>

      {/* Confirmation popup */}
      <Popup
        open={!!pendingAction}
        onClose={() => setPending(null)}
        title={popupTitle}
        subtitle={popupSubtitle}
        buttons={[
          { label: "Cancel",    onClick: () => setPending(null), variant: "secondary" },
          { label: popupLabel,  onClick: executeAction,          variant: isDestructive ? "danger" : "primary" },
        ]}
      />
    </>
  );
}

function ClosedAccountsTab() {
  const [users, setUsers]     = useState<ClosedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError]     = useState("");

  const fetchClosed = useCallback(async (pg: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await listClosedAccounts(pg);
      setUsers(res.users);
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClosed(page); }, [fetchClosed, page]);

  function daysColor(days: number) {
    if (days > 15) return "bg-[#F0FDF4] text-[#2E7D32]";
    if (days > 5)  return "bg-[#FFF8E1] text-[#E65100]";
    return "bg-[#FFF0F3] text-[#B31B38]";
  }

  return (
    <>
      <p className="text-sm text-[#888] mb-5">
        Accounts pending deletion. Data is permanently erased after the 30-day grace period.
      </p>

      {error && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38]">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">Contact</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">Reason</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">Closed</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#888] uppercase tracking-wide">Days left</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-[#F2F2F2] rounded w-28 mb-1.5" /><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-36 mb-1.5" /><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-40" /></td>
                    <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-5 bg-[#F2F2F2] rounded-full w-12" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-[#888]">
                    No closed accounts.
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-semibold text-[#0A0A0A]">{user.name}</p>
                    <p className="text-[11px] text-[#888]">{user.displayId}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[12px] text-[#444]">{user.email}</p>
                    {user.phone && <p className="text-[12px] text-[#888] mt-0.5">{user.phone}</p>}
                  </td>
                  <td className="px-5 py-3.5 max-w-[220px]">
                    <p className="text-[12px] text-[#444] line-clamp-2">
                      {user.closeReason ?? <span className="text-[#AAAAAA]">No reason given</span>}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] text-[#888]">
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
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl
            hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          ← Prev
        </button>
        <span className="text-sm text-[#888]">Page {page}</span>
        <button
          type="button"
          disabled={!hasMore || loading}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl
            hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          Next →
        </button>
      </div>
    </>
  );
}
