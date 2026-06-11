"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listAdminSubscriptions, listAdminRefundRequests, reviewAdminRefundRequest,
  listAdminPromoCodes, createAdminPromoCode, updateAdminPromoCode, deleteAdminPromoCode,
} from "../../../lib/api";
import type { AdminSubscription, AdminRefundRequest, AdminPromoCode } from "../../../lib/api";
import Popup from "@/components/Popup";
import { useToast } from "@/components/Toast";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

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
function SubSkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
          {Array.from({ length: 6 }).map((__, j) => (
            <td key={j} className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
          ))}
        </tr>
      ))}
    </>
  );
}

function SubscriptionsTab() {
  const [subs, setSubs]           = useState<AdminSubscription[]>([]);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(false);
  const [error, setError]         = useState("");

  const fetchSubs = useCallback(async (pg: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setError("");
    try {
      const res = await listAdminSubscriptions(pg);
      setSubs((prev) => append ? [...prev, ...res.subscriptions] : res.subscriptions);
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubs(1, false); }, [fetchSubs]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchSubs(next, true);
  }, [loading, loadingMore, hasMore, page, fetchSubs]);

  const sentinelRef = useInfiniteScroll(handleLoadMore, hasMore && !loading && !loadingMore);

  function statusColor(status: string) {
    if (status === "completed")        return "bg-[#F0FDF4] text-[#2E7D32]";
    if (status === "failed" || status === "refund_requested") return "bg-[#FFF0F3] text-[#B31B38]";
    if (status === "refund_approved")  return "bg-[#FFF8E1] text-[#E65100]";
    return "bg-[#F2F2F2] text-[#6B6B6B]";
  }

  return (
    <>
      {error && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-[12px] md:text-[14px] text-[#B31B38]">
          {error}
        </div>
      )}
      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Period End</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SubSkeletonRows count={8} />
              ) : subs.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-[12px] md:text-[14px] text-[#888]">No subscriptions.</td></tr>
              ) : (
                <>
                  {subs.map((sub) => (
                    <tr key={sub.id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-[12px] md:text-[14px] font-medium text-[#0A0A0A]">{sub.userName}</p>
                        <p className="text-[12px] md:text-[14px] text-[#888]">{sub.displayId}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] md:text-[14px] text-[#444]">
                        Elite {PLAN_LABELS[sub.planKey] ?? sub.planKey} · {sub.months}mo
                      </td>
                      <td className="px-5 py-3.5 text-[12px] md:text-[14px] text-[#444]">
                        {sub.amountCents === 0
                          ? <span className="text-[#2E7D32] font-medium">Free (Admin)</span>
                          : formatAmount(sub.amountCents, sub.currency)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[12px] md:text-[14px] font-semibold capitalize ${statusColor(sub.status)}`}>
                          {sub.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] md:text-[14px] text-[#888]">{formatDate(sub.periodEnd)}</td>
                      <td className="px-5 py-3.5 text-[12px] md:text-[14px] text-[#888]">{formatDate(sub.createdAt)}</td>
                    </tr>
                  ))}
                  {loadingMore && <SubSkeletonRows count={3} />}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {!hasMore && subs.length > 0 && (
        <p className="text-center text-[12px] md:text-[14px] text-[#CCCCCC] mt-4">All subscriptions loaded 🎉</p>
      )}
    </>
  );
}

// ── Refund Requests tab ───────────────────────────────────────────────────────
type PendingRefund = {
  id: string;
  userName: string;
  amount: string;
  note: string;
  action: "approve" | "reject";
};

function RefundsTab() {
  const [requests, setRequests]     = useState<AdminRefundRequest[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("pending");
  const [acting, setActing]         = useState<string | null>(null);
  const [noteMap, setNoteMap]       = useState<Record<string, string>>({});
  const [error, setError]           = useState("");
  const [pendingRefund, setPending] = useState<PendingRefund | null>(null);

  const fetchRequests = useCallback(async (status: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await listAdminRefundRequests(status || undefined);
      setRequests(res.refundRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(filter); }, [fetchRequests, filter]);

  async function executeRefund() {
    if (!pendingRefund) return;
    const { id, action, note } = pendingRefund;
    setPending(null);
    setActing(id);
    try {
      await reviewAdminRefundRequest(id, action, note || undefined);
      const newStatus = action === "approve" ? "approved" : "rejected";
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActing(null);
    }
  }

  return (
    <>
      {/* Sub-filter — scrollable on mobile */}
      <div className="flex gap-1 bg-[#F2F2F2] rounded-xl p-1 mb-6">
        {["pending", "approved", "rejected"].map((s) => (
          <button key={s} type="button" onClick={() => setFilter(s)}
            className={`flex-1 py-2 rounded-lg text-[14px] md:text-[16px] font-medium capitalize touch-manipulation ${
              filter === s ? "bg-white text-[#0A0A0A] shadow-sm" : "text-[#6B6B6B] hover:text-[#222]"
            }`}>
            {s}
          </button>
        ))}
      </div>

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
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Plan / Amount</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Reason</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Requested</th>
                {filter === "pending" && (
                  <th className="text-right px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
                    {Array.from({ length: filter === "pending" ? 5 : 4 }).map((__, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={filter === "pending" ? 5 : 4}
                    className="px-5 py-16 text-center text-[12px] md:text-[14px] text-[#888]">
                    No {filter} refund requests.
                  </td>
                </tr>
              ) : requests.map((req) => (
                <tr key={req.id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-[12px] md:text-[14px] font-semibold text-[#0A0A0A]">{req.userName}</p>
                    <p className="text-[12px] md:text-[14px] text-[#888]">{req.displayId}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] text-[#444]">Elite {PLAN_LABELS[req.planKey] ?? req.planKey}</p>
                    <p className="text-[12px] md:text-[14px] text-[#888]">{formatAmount(req.amountCents, req.currency)}</p>
                  </td>
                  <td className="px-5 py-3.5 max-w-[200px]">
                    <p className="text-[12px] md:text-[14px] text-[#444] line-clamp-2">{req.reason}</p>
                    {req.otherText && <p className="text-[12px] md:text-[14px] text-[#888] mt-0.5 italic">{req.otherText}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] md:text-[14px] text-[#888]">{formatDate(req.createdAt)}</td>
                  {filter === "pending" && (
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-end gap-2">
                        <input
                          type="text"
                          placeholder="Admin note (optional)"
                          value={noteMap[req.id] ?? ""}
                          onChange={(e) => setNoteMap((prev) => ({ ...prev, [req.id]: e.target.value }))}
                          className="text-[12px] md:text-[14px] border border-[#E6E6E6] rounded-lg px-2 py-1.5 w-48
                            outline-none focus:border-[#B31B38] bg-white transition-colors"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={acting === req.id}
                            onClick={() => setPending({
                              id: req.id,
                              userName: req.userName,
                              amount: formatAmount(req.amountCents, req.currency),
                              note: noteMap[req.id] ?? "",
                              action: "reject",
                            })}
                            className="px-3 py-1.5 rounded-lg text-[12px] md:text-[14px] font-semibold bg-[#FFF0F3] text-[#B31B38]
                              hover:bg-[#FFE0E7] disabled:opacity-40 transition-colors touch-manipulation"
                          >
                            {acting === req.id ? "…" : "Reject"}
                          </button>
                          <button
                            type="button"
                            disabled={acting === req.id}
                            onClick={() => setPending({
                              id: req.id,
                              userName: req.userName,
                              amount: formatAmount(req.amountCents, req.currency),
                              note: noteMap[req.id] ?? "",
                              action: "approve",
                            })}
                            className="px-3 py-1.5 rounded-lg text-[12px] md:text-[14px] font-semibold bg-[#F0FDF4] text-[#2E7D32]
                              hover:bg-[#DCFCE7] disabled:opacity-40 transition-colors touch-manipulation"
                          >
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

      {/* Refund confirmation popup */}
      <Popup
        open={!!pendingRefund}
        onClose={() => setPending(null)}
        title={pendingRefund?.action === "approve" ? "Approve this refund?" : "Reject this refund request?"}
        subtitle={
          pendingRefund?.action === "approve"
            ? `Approve ${pendingRefund.amount} refund for ${pendingRefund.userName}. This will trigger the refund process.`
            : `Reject ${pendingRefund?.userName}'s refund request. They will be notified of the decision.`
        }
        buttons={[
          { label: "Cancel",   onClick: () => setPending(null), variant: "secondary" },
          {
            label:   pendingRefund?.action === "approve" ? "Yes, approve" : "Yes, reject",
            onClick: executeRefund,
            variant: pendingRefund?.action === "approve" ? "primary" : "danger",
          },
        ]}
      />
    </>
  );
}

// ── Promo Codes tab ───────────────────────────────────────────────────────────
type PendingDelete = { id: string; code: string };

function PromoCodesTab() {
  const { toast } = useToast();
  const [codes, setCodes]           = useState<AdminPromoCode[]>([]);
  const [loading, setLoading]       = useState(true);
  const [acting, setActing]         = useState<string | null>(null);
  const [error, setError]           = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState({ code: "", discountLkr: "", discountUsd: "", maxUses: "", expiresAt: "" });
  const [formError, setFormError]   = useState("");
  const [creating, setCreating]     = useState(false);
  const [pendingDelete, setPending] = useState<PendingDelete | null>(null);

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
      toast({ type: "success", title: isActive ? "Promo code disabled" : "Promo code enabled" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update";
      setError(msg);
      toast({ type: "error", title: "Update failed", message: msg });
    } finally {
      setActing(null);
    }
  }

  async function executeDelete() {
    if (!pendingDelete) return;
    const { id, code } = pendingDelete;
    setPending(null);
    setActing(`del_${id}`);
    try {
      await deleteAdminPromoCode(id);
      setCodes((prev) => prev.filter((c) => c.id !== id));
      toast({ type: "success", title: "Promo code deleted", message: `${code} has been removed.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      setError(msg);
      toast({ type: "error", title: "Delete failed", message: msg });
    } finally {
      setActing(null);
    }
  }

  async function handleCreate(e: { preventDefault(): void }) {
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
        maxUses:   form.maxUses ? parseInt(form.maxUses, 10) : undefined,
        expiresAt: form.expiresAt || undefined,
      });
      setCodes((prev) => [res.promoCode, ...prev]);
      setForm({ code: "", discountLkr: "", discountUsd: "", maxUses: "", expiresAt: "" });
      setShowForm(false);
      toast({ type: "success", title: "Promo code created", message: `${res.promoCode.code} is now active.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create.";
      setFormError(msg);
      toast({ type: "error", title: "Failed to create", message: msg });
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[12px] md:text-[14px] text-[#888]">Manage promo codes for checkout discounts.</p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className={`px-4 flex ${showForm ? "" : "min-w-[116.7px]"} py-2 bg-[#B31B38] text-white text-[14px] md:text-[16px] font-semibold rounded-xl
            hover:bg-[#9A1730] transition-colors touch-manipulation`}
        >
          {showForm ? "Cancel" : "+ New Code"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 bg-white rounded-2xl border border-[#EEEEEE] p-5">
          <h3 className="text-[14px] md:text-[16px] font-semibold text-[#0A0A0A] mb-4">New Promo Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] md:text-[14px] font-medium text-[#222] mb-1 block">Code *</label>
              <input type="text" placeholder="e.g. WELCOME50" value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2.5 text-[12px] md:text-[14px] bg-white
                  outline-none focus:border-[#B31B38] transition-colors" />
            </div>
            <div>
              <label className="text-[12px] md:text-[14px] font-medium text-[#222] mb-1 block">Discount LKR (Rs)</label>
              <input type="number" placeholder="e.g. 500" value={form.discountLkr}
                onChange={(e) => setForm((f) => ({ ...f, discountLkr: e.target.value }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2.5 text-[12px] md:text-[14px] bg-white
                  outline-none focus:border-[#B31B38] transition-colors" />
            </div>
            <div>
              <label className="text-[12px] md:text-[14px] font-medium text-[#222] mb-1 block">Discount USD ($)</label>
              <input type="number" step="0.01" placeholder="e.g. 2.00" value={form.discountUsd}
                onChange={(e) => setForm((f) => ({ ...f, discountUsd: e.target.value }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2.5 text-[12px] md:text-[14px] bg-white
                  outline-none focus:border-[#B31B38] transition-colors" />
            </div>
            <div>
              <label className="text-[12px] md:text-[14px] font-medium text-[#222] mb-1 block">Max Uses (blank = unlimited)</label>
              <input type="number" placeholder="e.g. 100" value={form.maxUses}
                onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2.5 text-[12px] md:text-[14px] bg-white
                  outline-none focus:border-[#B31B38] transition-colors" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12px] md:text-[14px] font-medium text-[#222] mb-1 block">Expires At (blank = never)</label>
              <input type="datetime-local" value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className="w-full border border-[#E6E6E6] rounded-xl px-3 py-2.5 text-[12px] md:text-[14px] bg-white
                  outline-none focus:border-[#B31B38] transition-colors" />
            </div>
          </div>
          {formError && <p className="mt-3 text-[12px] md:text-[14px] text-[#B31B38]">{formError}</p>}
          <button
            type="submit"
            disabled={creating}
            className="mt-4 px-6 py-2.5 bg-[#B31B38] text-white text-[14px] md:text-[16px] font-semibold rounded-xl
              hover:bg-[#9A1730] disabled:opacity-50 transition-colors touch-manipulation"
          >
            {creating ? "Creating…" : "Create Code"}
          </button>
        </form>
      )}

      {error && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-[12px] md:text-[14px] text-[#B31B38]">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Code</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Discount LKR</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Discount USD</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Uses</th>
                <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Expires</th>
                <th className="text-right px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : codes.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-[12px] md:text-[14px] text-[#888]">No promo codes yet.</td></tr>
              ) : codes.map((c) => (
                <tr key={c.id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-mono font-semibold text-[#0A0A0A]">{c.code}</span>
                      {!c.isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F2F2F2] text-[#888] text-[10px] font-semibold">
                          Disabled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#444]">
                    Rs {c.discountLkr.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#444]">
                    ${(c.discountUsdCents / 100).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#444]">
                    {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-[#888]">{formatDate(c.expiresAt)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={!!acting}
                        onClick={() => handleToggle(c.id, c.isActive)}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-[12px] md:text-[14px] font-semibold transition-colors
                          disabled:opacity-40 touch-manipulation border ${
                          c.isActive
                            ? "bg-[#FFFFFF] text-[#B31B38] hover:bg-[#FFF0F3]"
                            : "bg-[#FFF0F3] text-[#B31B38] hover:bg-[#FFF0F3]"
                        }`}
                      >
                        {acting === c.id ? "…" : c.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        disabled={!!acting}
                        onClick={() => setPending({ id: c.id, code: c.code })}
                        className="cursor-pointer px-3 py-1.5 rounded-lg text-[12px] md:text-[14px] font-semibold bg-[#B31B38] text-[#FFFFFF]
                          hover:bg-[#8E162D] active:bg-[#6F1023] disabled:opacity-40 transition-colors touch-manipulation"
                      >
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

      {/* Delete confirmation popup */}
      <Popup
        open={!!pendingDelete}
        onClose={() => setPending(null)}
        title={`Delete ${pendingDelete?.code}?`}
        subtitle="This promo code will be permanently deleted and can no longer be used at checkout."
        buttons={[
          { label: "Cancel", onClick: () => setPending(null), variant: "secondary" },
          { label: "Delete", onClick: executeDelete,          variant: "danger"    },
        ]}
      />
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BillingPage() {
  const [tab, setTab] = useState<Tab>("subscriptions");

  const TAB_LABELS: Record<Tab, string> = {
    subscriptions: "Subscriptions",
    refunds:       "Refund Requests",
    promo:         "Promo Codes",
  };

  const TAB_SHORT: Record<Tab, string> = {
    subscriptions: "Subs",
    refunds:       "Refunds",
    promo:         "Promo",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">Billing</h1>
      </div>

      <div className="flex gap-1 bg-[#F2F2F2] rounded-xl p-1 mb-6">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-[14px] md:text-[16px] font-medium touch-manipulation ${
              tab === t ? "bg-white text-[#0A0A0A] shadow-sm" : "text-[#6B6B6B] hover:text-[#222]"
            }`}
          >
            <span className="sm:hidden">{TAB_SHORT[t]}</span>
            <span className="hidden sm:inline">{TAB_LABELS[t]}</span>
          </button>
        ))}
      </div>

      {tab === "subscriptions" && <SubscriptionsTab />}
      {tab === "refunds"       && <RefundsTab />}
      {tab === "promo"         && <PromoCodesTab />}
    </div>
  );
}
