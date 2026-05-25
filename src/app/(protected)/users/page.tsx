"use client";

import { useCallback, useEffect, useState } from "react";
import { listUsers, blockUser, unblockUser, toggleElite, listClosedAccounts } from "../../../lib/api";
import type { AdminListUser, ClosedUser } from "../../../lib/api";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

type Tab = "all" | "closed";

export default function UsersPage() {
  const [tab, setTab] = useState<Tab>("all");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#222222]">User Management</h1>
      </div>

      <div className="flex gap-1 mb-6 bg-[#F2F2F2] rounded-xl p-1 w-fit">
        {(["all", "closed"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-white text-[#222222] shadow-sm" : "text-[#6B6B6B] hover:text-[#222222]"
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

function AllUsersTab() {
  const [users, setUsers] = useState<AdminListUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [elitePlan, setElitePlan] = useState<Record<string, "basic" | "pro" | "max">>({});
  const [error, setError] = useState("");

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput);
  }

  function handleClear() {
    setSearchInput("");
    setAppliedSearch("");
    setPage(1);
  }

  async function handleBlock(userId: string, isBlocked: boolean) {
    setActing(userId);
    try {
      if (isBlocked) await unblockUser(userId); else await blockUser(userId);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isBlocked: !isBlocked } : u));
    } catch (err) { alert(err instanceof Error ? err.message : "Action failed"); }
    finally { setActing(null); }
  }

  async function handleElite(userId: string, isElite: boolean, planKey?: "basic" | "pro" | "max") {
    const key = `${userId}_elite`;
    setActing(key);
    try {
      await toggleElite(userId, !isElite, planKey);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isElite: !isElite } : u));
    } catch (err) { alert(err instanceof Error ? err.message : "Action failed"); }
    finally { setActing(null); }
  }

  return (
    <>
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by email or phone number…"
          className="flex-1 border border-[#E6E6E6] rounded-xl px-4 py-2.5 text-sm text-[#222222] placeholder:text-[#AAAAAA] outline-none focus:border-[#B31B38] transition-colors"
        />
        <button type="submit" className="px-5 py-2.5 bg-[#B31B38] text-white text-sm font-semibold rounded-xl hover:bg-[#9A1730] transition-colors">Search</button>
        {appliedSearch && (
          <button type="button" onClick={handleClear} className="px-4 py-2.5 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl hover:bg-[#F2F2F2] transition-colors">Clear</button>
        )}
      </form>

      {error && <div className="mb-4 p-4 bg-[#FFF0F3] rounded-xl text-sm text-[#B31B38]">{error}</div>}

      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#EEEEEE]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Gender</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Joined</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F2F2F2] animate-pulse">
                    <td className="px-5 py-3.5"><div className="h-4 bg-[#F2F2F2] rounded w-32 mb-1.5" /><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
                    <td className="px-5 py-3.5"><div className="h-3 bg-[#F2F2F2] rounded w-12" /></td>
                    <td className="px-5 py-3.5"><div className="h-5 bg-[#F2F2F2] rounded-full w-14" /></td>
                    <td className="px-5 py-3.5"><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
                    <td className="px-5 py-3.5 text-right"><div className="h-7 bg-[#F2F2F2] rounded-lg w-32 ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center text-sm text-[#6B6B6B]">No users found.</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-[#F2F2F2] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-[#222222]">{user.name}</p>
                    <p className="text-xs text-[#6B6B6B]">{user.displayId}</p>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-sm text-[#6B6B6B] capitalize">{user.gender?.toLowerCase() ?? "—"}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {user.isElite && <span className="px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#E65100] text-[10px] font-semibold">Elite</span>}
                      {user.isBlocked && <span className="px-2 py-0.5 rounded-full bg-[#FFF0F3] text-[#B31B38] text-[10px] font-semibold">Blocked</span>}
                      {user.isClosed && <span className="px-2 py-0.5 rounded-full bg-[#F2F2F2] text-[#6B6B6B] text-[10px] font-semibold">Closed</span>}
                      {user.trustBadge && <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#2E7D32] text-[10px] font-semibold">Verified</span>}
                      {!user.isElite && !user.isBlocked && !user.isClosed && !user.trustBadge && <span className="text-xs text-[#CCCCCC]">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-xs text-[#6B6B6B]">{formatDate(user.createdAt)}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" disabled={acting === user.id} onClick={() => handleBlock(user.id, user.isBlocked)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${user.isBlocked ? "bg-[#F0FDF4] text-[#2E7D32] hover:bg-[#DCFCE7]" : "bg-[#FFF0F3] text-[#B31B38] hover:bg-[#FFE0E7]"}`}>
                        {acting === user.id ? "…" : user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      {user.isElite ? (
                        <button type="button" disabled={acting === `${user.id}_elite`} onClick={() => handleElite(user.id, true)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 bg-[#FFF8E1] text-[#E65100] hover:bg-[#FEF3C7]">
                          {acting === `${user.id}_elite` ? "…" : "Remove Elite"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <select
                            value={elitePlan[user.id] ?? "basic"}
                            onChange={(e) => setElitePlan((prev) => ({ ...prev, [user.id]: e.target.value as "basic" | "pro" | "max" }))}
                            disabled={acting === `${user.id}_elite`}
                            className="text-xs border border-[#E6E6E6] rounded-lg px-2 py-1.5 bg-white text-[#222] outline-none disabled:opacity-50"
                          >
                            <option value="basic">Basic</option>
                            <option value="pro">Pro</option>
                            <option value="max">Max</option>
                          </select>
                          <button type="button" disabled={acting === `${user.id}_elite`}
                            onClick={() => handleElite(user.id, false, elitePlan[user.id] ?? "basic")}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 bg-[#F2F2F2] text-[#6B6B6B] hover:bg-[#EEEEEE]">
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

      <div className="flex items-center justify-between mt-5">
        <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Prev</button>
        <span className="text-sm text-[#6B6B6B]">Page {page}</span>
        <button type="button" disabled={!hasMore || loading} onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next →</button>
      </div>
    </>
  );
}

function ClosedAccountsTab() {
  const [users, setUsers] = useState<ClosedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

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
      <p className="text-sm text-[#6B6B6B] mb-4">Accounts pending deletion. Data is permanently erased after the 30-day grace period.</p>

      {error && <div className="mb-4 p-4 bg-[#FFF0F3] rounded-xl text-sm text-[#B31B38]">{error}</div>}

      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#EEEEEE]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Reason</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Closed</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Days left</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F2F2F2] animate-pulse">
                    <td className="px-5 py-3.5"><div className="h-4 bg-[#F2F2F2] rounded w-28 mb-1.5" /><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
                    <td className="px-5 py-3.5"><div className="h-3 bg-[#F2F2F2] rounded w-36 mb-1.5" /><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
                    <td className="px-5 py-3.5"><div className="h-3 bg-[#F2F2F2] rounded w-40" /></td>
                    <td className="px-5 py-3.5"><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
                    <td className="px-5 py-3.5"><div className="h-5 bg-[#F2F2F2] rounded-full w-12" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center text-sm text-[#6B6B6B]">No closed accounts.</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-[#F2F2F2] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-[#222222]">{user.name}</p>
                    <p className="text-xs text-[#6B6B6B]">{user.displayId}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-[#444444]">{user.email}</p>
                    {user.phone && <p className="text-xs text-[#6B6B6B] mt-0.5">{user.phone}</p>}
                  </td>
                  <td className="px-5 py-3.5 max-w-[220px]">
                    <p className="text-xs text-[#444444] line-clamp-2">{user.closeReason ?? <span className="text-[#AAAAAA]">No reason given</span>}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-[#6B6B6B]">{user.closedAt ? formatDate(user.closedAt) : "—"}</span>
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
        <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Prev</button>
        <span className="text-sm text-[#6B6B6B]">Page {page}</span>
        <button type="button" disabled={!hasMore || loading} onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl hover:bg-[#F2F2F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next →</button>
      </div>
    </>
  );
}
