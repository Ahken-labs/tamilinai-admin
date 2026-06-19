"use client";

import { useCallback, useEffect, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useRouter } from "next/navigation";
import { listBankTransfers, downloadBankReceiptBlob } from "../../../lib/api";
import type { AdminBankTransferOrder } from "../../../lib/api";
import TabBar from "@/components/layout/TabBar";
import Button from "@/components/layout/Button";
import { exportToExcel } from "@/lib/exportExcel";
import { DownloadExcelIcon } from "@/assets/Icons";

type StatusFilter = "pending" | "approved" | "rejected";

const PLAN_LABELS: Record<string, string> = { basic: "Basic", pro: "Pro", max: "Max" };

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatAmount(cents: number, currency: string) {
  const symbol = currency.toLowerCase() === "lkr" ? "Rs" : "£";
  const amount = cents / 100;
  return `${symbol} ${currency.toLowerCase() === "lkr" ? Math.round(amount).toLocaleString() : amount.toFixed(2)}`;
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-5 py-4">
              <div className="h-3 bg-[#F2F2F2] rounded w-24" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function BankTransfersPage() {
  const router = useRouter();
  const [filter, setFilter]     = useState<StatusFilter>("pending");
  const [orders, setOrders]     = useState<AdminBankTransferOrder[]>([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]       = useState("");
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async (status: StatusFilter, pg: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setError("");
    try {
      const res = await listBankTransfers(status, pg);
      setOrders((prev) => append ? [...prev, ...res.orders] : res.orders);
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchOrders(filter, 1, false);
  }, [filter, fetchOrders]);

  function handleLoadMore() {
    if (loading || loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchOrders(filter, next, true);
  }

  const sentinelRef = useInfiniteScroll(handleLoadMore, hasMore && !loading && !loadingMore);

  function handleExport() {
    const rows = orders.map((o) => {
      const daysLeft = o.status === "rejected" && o.reviewedAt
        ? Math.max(0, 30 - Math.floor((Date.now() - new Date(o.reviewedAt).getTime()) / 86_400_000))
        : null;
      return {
        "Inai ID":       o.userDisplayId ?? "—",
        "Name":          o.userName ?? "—",
        "Plan":          `Elite ${PLAN_LABELS[o.planKey] ?? o.planKey}`,
        "Months":        o.months,
        "Amount":        formatAmount(o.amountCents, o.currency),
        "Discount":      o.discountCents > 0 ? formatAmount(o.discountCents, o.currency) : "0",
        "Promo Code":    o.promoCode ?? "—",
        "Net Charged":   formatAmount(o.amountCents - o.discountCents, o.currency),
        "Currency":      o.currency.toUpperCase(),
        "Receipt Key":   o.receiptUrl ?? "—",
        "Status":        o.status,
        "Submitted":     formatDate(o.createdAt),
        "Reviewed":      formatDate(o.reviewedAt),
        ...(filter === "rejected" ? { "Days Left (auto-delete)": daysLeft === 0 ? "Deletes today" : daysLeft !== null ? `${daysLeft}d` : "—" } : {}),
      };
    });
    exportToExcel(rows, `inai-bank-transfers-${filter}-${new Date().toISOString().slice(0, 10)}`);
  }

  async function handleDownloadReceipt(e: React.MouseEvent, order: AdminBankTransferOrder) {
    e.stopPropagation();
    if (!order.receiptUrl || downloadingIds.has(order.id)) return;
    setDownloadingIds((prev) => new Set(prev).add(order.id));
    try {
      const { blob, filename } = await downloadBankReceiptBlob(order.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingIds((prev) => { const s = new Set(prev); s.delete(order.id); return s; });
    }
  }

  // pending: User Plan Amount Submitted Actions = 5
  // approved: + Status = 6
  // rejected: + Status + Days left = 7
  const colCount = filter === "pending" ? 5 : filter === "approved" ? 6 : 7;

  function daysLeftColor(days: number) {
    if (days > 15) return "bg-[#F0FDF4] text-[#2E7D32]";
    if (days > 5)  return "bg-[#FFF8E1] text-[#E65100]";
    return "bg-[#FFF0F3] text-[#B31B38]";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[20px] md:text-[24px] font-bold text-[#0A0A0A]">Bank Transfers</h1>
        {orders.length > 0 && (
          <Button white className="!py-2" text="Export Excel" iconLeft={<DownloadExcelIcon className="w-5 h-5" />} onPress={handleExport} />
        )}
      </div>

      <TabBar
        tabs={[
          { key: "pending",  label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ]}
        active={filter}
        onChange={(k) => setFilter(k as StatusFilter)}
        className="mb-6"
      />

      {error && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-[13px] text-[#B31B38]">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Submitted</th>
                {filter !== "pending" && (
                  <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Status</th>
                )}
                {filter === "rejected" && (
                  <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Days left</th>
                )}
                <th className="text-right px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={colCount} />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="px-5 py-16 text-center text-[14px] md:text-[16px] text-[#888]">
                    No {filter} bank transfers.
                  </td>
                </tr>
              ) : (
                <>
                  {orders.map((order) => (
                    <tr key={order.id} onClick={() => router.push(`/bank-transfers/${order.id}`)} className="border-b border-[#F5F5F5] hover:bg-[#EAEAEA] transition-colors cursor-pointer">
                      <td className="px-5 py-3.5">
                        <p className="text-[14px] md:text-[16px] font-semibold text-[#0A0A0A]">{order.userName ?? "—"}</p>
                        <p className="text-[12px] md:text-[14px] text-[#888]">{order.userDisplayId ?? "—"}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[14px] md:text-[16px] text-[#444]">
                        Elite {PLAN_LABELS[order.planKey] ?? order.planKey} · {order.months}mo
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-[14px] md:text-[16px] text-[#444]">{formatAmount(order.amountCents, order.currency)}</p>
                        {order.discountCents > 0 && (
                          <p className="text-[12px] text-[#2E7D32]">
                            − {formatAmount(order.discountCents, order.currency)}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-[#888]">
                        {formatDate(order.createdAt)}
                      </td>
                      {filter !== "pending" && (
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[12px] font-semibold capitalize ${
                            order.status === "approved" ? "bg-[#F0FDF4] text-[#2E7D32]" : "bg-[#FFF0F3] text-[#B31B38]"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      )}
                      {filter === "rejected" && (
                        <td className="px-5 py-3.5">
                          {order.reviewedAt ? (() => {
                            const d = Math.max(0, 30 - Math.floor((Date.now() - new Date(order.reviewedAt).getTime()) / 86_400_000));
                            return (
                              <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${daysLeftColor(d)}`}>
                                {d === 0 ? "Today" : `${d}d`}
                              </span>
                            );
                          })() : <span className="text-[#CCC]">—</span>}
                        </td>
                      )}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          disabled={!order.receiptUrl || downloadingIds.has(order.id)}
                          onClick={(e) => handleDownloadReceipt(e, order)}
                          className="px-3 py-2 rounded-xl text-[12px] md:text-[14px] font-semibold text-[#B31B38] bg-[#FFF0F3]  hover:bg-[#FFE0E7] active:bg-[#FFE0E7] transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
                        >
                          {downloadingIds.has(order.id) ? "Downloading..." : "Download Receipt"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {loadingMore && <SkeletonRows cols={colCount} />}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div ref={sentinelRef} className="h-1" />

      {!hasMore && orders.length > 0 && (
        <p className="text-center text-[14px] md:text-[16px] text-[#CCCCCC] mt-4">All {filter} transfers loaded 🎉</p>
      )}

    </div>
  );
}
