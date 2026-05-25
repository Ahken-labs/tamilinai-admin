"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listAdminSubscriptions, listAdminRefundRequests, reviewAdminRefundRequest,
  listAdminPromoCodes, createAdminPromoCode, updateAdminPromoCode, deleteAdminPromoCode,
} from "../../../lib/api";
import type { AdminSubscription, AdminRefundRequest, AdminPromoCode } from "../../../lib/api";

type Tab = "subscriptions" | "refunds" | "promo";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatAmount(cents: number, currency: string) {
  const symbol = currency.toLowerCase() === "lkr" ? "Rs" : "$";
  const amount = cents / 100;
  return `${symbol} ${currency === "lkr" ? Math.round(amount).toLocaleString() : amount.toFixed(2)}`;
}

const PLAN_LABELS: Record<string, string> = { basic: "Basic", pro: "Pro", max: "Max" };

// ── Subscriptions tab ─────────────────────────────────────────────────────────
function SubscriptionsTab() {
  const [subs, setSubs] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  const fetch = useCallback(async (pg: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await listAdminSubscriptions(pg);
      setSubs(res.subscriptions);
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(page); }, [fetch, page]);

  function statusColor(status: string) {
    if (status === "completed") return "bg-[#F0FDF4] text-[#2E7D32]";
    if (status === "failed" || status === "refund_requested") return "bg-[#FFF0F3] text-[#B31B38]";
    if (status === "cancelled") return "bg-[#F2F2F2] text-[#6B6B6B]";
    if (status === "refund_approved") return "bg-[#FFF8E1] text-[#E65100]";
    return "bg-[#F2F2F2] text-[#6B6B6B]";
  }

  return (
    <>
      {error && <div className="mb-4 p-4 bg-[#FFF0F3] rounded-xl text-sm text-[#B31B38]">{error}</div>}
      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#EEEEEE]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Period End</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F2F2F2] animate-pulse">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-5 py-3.5"><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : subs.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-[#6B6B6B]">No subscriptions.</td></tr>
              ) : subs.map((sub) => (
                <tr key={sub.id} className="border-b border-[#F2F2F2] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-[#222]">{sub.userName}</p>
                    <p className="text-xs text-[#6B6B6B]">{sub.displayId}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#444]">
                    Elite {PLAN_LABELS[sub.planKey] ?? sub.planKey} · {sub.months}mo
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#444]">
                    {sub.amountCents === 0 ? <span className="text-[#2E7D32] font-medium">Free (Admin)</span> : formatAmount(sub.amountCents, sub.currency)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusColor(sub.status)}`}>
                      {sub.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6B6B6B]">{formatDate(sub.periodEnd)}</td>
                  <td className="px-5 py-3.5 text-xs text-[#6B6B6B]">{formatDate(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5">
        <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl hover:bg-[#F2F2F2] disabled:opacity-40 transition-colors">← Prev</button>
        <span className="text-sm text-[#6B6B6B]">Page {page}</span>
        <button type="button" disabled={!hasMore || loading} onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border border-[#E6E6E6] text-[#6B6B6B] text-sm rounded-xl hover:bg-[#F2F2F2] disabled:opacity-40 transition-colors">Next →</button>
      </div>
    </>
  );
}

// ── Refund Requests tab ───────────────────────────────────────────────────────
function RefundsTab() {
  const [requests, setRequests] = useState<AdminRefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [acting, setActing] = useState<string | null>(null);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const fetchRequests = useCallback(async (status: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await listAdminRefundRequests(status || undefined);
      setRequests(res.requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(filter); }, [fetchRequests, filter]);

  async function handleReview(id: string, action: "approved" | "rejected") {
    setActing(id);
    try {
      await reviewAdminRefundRequest(id, action, noteMap[id]);
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActing(null);
    }
  }

  return (
    <>
      <div className="flex gap-1 mb-6 bg-[#F2F2F2] rounded-xl p-1 w-fit">
        {["pending", "approved", "rejected"].map((s) => (
          <button key={s} type="button" onClick={() => setFilter(s)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filter === s ? "bg-white text-[#222] shadow-sm" : "text-[#6B6B6B] hover:text-[#222]"}`}>
            {s}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 p-4 bg-[#FFF0F3] rounded-xl text-sm text-[#B31B38]">{error}</div>}

      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#EEEEEE]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Plan / Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Reason</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Requested</th>
                {filter === "pending" && <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F2F2F2] animate-pulse">
                    {Array.from({ length: filter === "pending" ? 5 : 4 }).map((__, j) => (
                      <td key={j} className="px-5 py-3.5"><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr><td colSpan={filter === "pending" ? 5 : 4} className="px-5 py-16 text-center text-sm text-[#6B6B6B]">No {filter} refund requests.</td></tr>
              ) : requests.map((req) => (
                <tr key={req.id} className="border-b border-[#F2F2F2] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-[#222]">{req.userName}</p>
                    <p className="text-xs text-[#6B6B6B]">{req.displayId}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-[#444]">Elite {PLAN_LABELS[req.planKey] ?? req.planKey}</p>
                    <p className="text-xs text-[#6B6B6B]">{formatAmount(req.amountCents, req.currency)}</p>
                  </td>
                  <td className="px-5 py-3.5 max-w-[200px]">
                    <p className="text-xs text-[#444] line-clamp-2">{req.reason}</p>
                    {req.otherText && <p className="text-xs text-[#6B6B6B] mt-0.5 italic">{req.otherText}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6B6B6B]">{formatDate(req.createdAt)}</td>
                  {filter === "pending" && (
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-end gap-2">
                        <input
                          type="text"
                          placeholder="Admin note (optional)"
                          value={noteMap[req.id] ?? ""}
                          onChange={(e) => setNoteMap((prev) => ({ ...prev, [req.id]: e.target.value }))}
                          className="text-xs border border-[#E6E6E6] rounded-lg px-2 py-1 w-48 outline-none focus:border-[#B31B38]"
                        />
                        <div className="flex gap-2">
                          <button type="button" disabled={acting === req.id} onClick={() => handleReview(req.id, "rejected")}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFF0F3] text-[#B31B38] hover:bg-[#FFE0E7] disabled:opacity-50 transition-colors">
                            {acting === req.id ? "…" : "Reject"}
                          </button>
                          <button type="button" disabled={acting === req.id} onClick={() => handleReview(req.id, "approved")}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F0FDF4] text-[#2E7D32] hover:bg-[#DCFCE7] disabled:opacity-50 transition-colors">
                            {acting === req.id ? "…" : "Approve & Refund"}
                          </button>
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Promo Codes tab ───────────────────────────────────────────────────────────
function PromoCodesTab() {
  const [codes, setCodes] = useState<AdminPromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discountLkr: "", discountUsd: "", maxUses: "", expiresAt: "" });
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await listAdminPromoCodes();
      setCodes(res.promoCodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  async function handleToggle(id: string, isActive: boolean) {
    setActing(id);
    try {
      await updateAdminPromoCode(id, { isActive: !isActive });
      setCodes((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !isActive } : c));
    } catch (err) { alert(err instanceof Error ? err.message : "Failed"); }
    finally { setActing(null); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this promo code?")) return;
    setActing(`del_${id}`);
    try {
      await deleteAdminPromoCode(id);
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) { alert(err instanceof Error ? err.message : "Failed"); }
    finally { setActing(null); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (!code) { setFormError("Code is required."); return; }
    const discountLkr = parseInt(form.discountLkr || "0", 10);
    const discountUsdCents = Math.round(parseFloat(form.discountUsd || "0") * 100);
    if (!discountLkr && !discountUsdCents) { setFormError("Enter at least one discount amount."); return; }

    setCreating(true);
    setFormError("");
    try {
      const res = await createAdminPromoCode({
        code,
        discountLkr,
        discountUsdCents,
        maxUses: form.maxUses ? parseInt(form.maxUses, 10) : undefined,
        expiresAt: form.expiresAt || undefined,
      });
      setCodes((prev) => [res.promoCode, ...prev]);
      setForm({ code: "", discountLkr: "", discountUsd: "", maxUses: "", expiresAt: "" });
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#6B6B6B]">Manage promo codes for checkout discounts.</p>
        <button type="button" onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 bg-[#B31B38] text-white text-sm font-semibold rounded-xl hover:bg-[#9A1730] transition-colors">
          {showForm ? "Cancel" : "+ New Code"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 bg-white rounded-2xl border border-[#EEEEEE] p-5">
          <h3 className="text-sm font-semibold text-[#222] mb-4">New Promo Code</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6B6B6B] mb-1 block">Code *</label>
              <input type="text" placeholder="e.g. WELCOME50" value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B31B38]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B6B6B] mb-1 block">Discount LKR (Rs)</label>
              <input type="number" placeholder="e.g. 500 = Rs 5.00" value={form.discountLkr}
                onChange={(e) => setForm((f) => ({ ...f, discountLkr: e.target.value }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B31B38]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B6B6B] mb-1 block">Discount USD ($)</label>
              <input type="number" step="0.01" placeholder="e.g. 2.00" value={form.discountUsd}
                onChange={(e) => setForm((f) => ({ ...f, discountUsd: e.target.value }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B31B38]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B6B6B] mb-1 block">Max Uses (blank = unlimited)</label>
              <input type="number" placeholder="e.g. 100" value={form.maxUses}
                onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B31B38]" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-[#6B6B6B] mb-1 block">Expires At (blank = never)</label>
              <input type="datetime-local" value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B31B38]" />
            </div>
          </div>
          {formError && <p className="mt-3 text-xs text-[#B31B38]">{formError}</p>}
          <button type="submit" disabled={creating}
            className="mt-4 px-6 py-2 bg-[#B31B38] text-white text-sm font-semibold rounded-xl hover:bg-[#9A1730] disabled:opacity-50 transition-colors">
            {creating ? "Creating…" : "Create Code"}
          </button>
        </form>
      )}

      {error && <div className="mb-4 p-4 bg-[#FFF0F3] rounded-xl text-sm text-[#B31B38]">{error}</div>}

      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#EEEEEE]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Code</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Discount LKR</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Discount USD</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Uses</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Expires</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F2F2F2] animate-pulse">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-5 py-3.5"><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : codes.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-[#6B6B6B]">No promo codes yet.</td></tr>
              ) : codes.map((c) => (
                <tr key={c.id} className="border-b border-[#F2F2F2] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-[#222]">{c.code}</span>
                      {!c.isActive && <span className="px-2 py-0.5 rounded-full bg-[#F2F2F2] text-[#6B6B6B] text-[10px] font-semibold">Disabled</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#444]">Rs {c.discountLkr.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-[#444]">${(c.discountUsdCents / 100).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-sm text-[#444]">
                    {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6B6B6B]">{formatDate(c.expiresAt)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" disabled={!!acting} onClick={() => handleToggle(c.id, c.isActive)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${c.isActive ? "bg-[#FFF8E1] text-[#E65100] hover:bg-[#FEF3C7]" : "bg-[#F0FDF4] text-[#2E7D32] hover:bg-[#DCFCE7]"}`}>
                        {acting === c.id ? "…" : c.isActive ? "Disable" : "Enable"}
                      </button>
                      <button type="button" disabled={!!acting} onClick={() => handleDelete(c.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFF0F3] text-[#B31B38] hover:bg-[#FFE0E7] disabled:opacity-50 transition-colors">
                        {acting === `del_${c.id}` ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BillingPage() {
  const [tab, setTab] = useState<Tab>("subscriptions");

  const TAB_LABELS: Record<Tab, string> = {
    subscriptions: "Subscriptions",
    refunds: "Refund Requests",
    promo: "Promo Codes",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#222222]">Billing</h1>
      </div>

      <div className="flex gap-1 mb-6 bg-[#F2F2F2] rounded-xl p-1 w-fit">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-white text-[#222] shadow-sm" : "text-[#6B6B6B] hover:text-[#222]"}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "subscriptions" && <SubscriptionsTab />}
      {tab === "refunds" && <RefundsTab />}
      {tab === "promo" && <PromoCodesTab />}
    </div>
  );
}
