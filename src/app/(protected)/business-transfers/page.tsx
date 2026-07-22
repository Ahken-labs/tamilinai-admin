"use client";

import { useCallback, useEffect, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useRouter } from "next/navigation";
import { listBoostOrders, downloadBoostReceiptBlob } from "../../../lib/api";
import type { AdminBoostOrder } from "../../../lib/api";
import TabBar from "@/components/layout/TabBar";

type StatusFilter = "pending" | "approved" | "rejected";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatLkr(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString()}`;
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

export default function BusinessTransfersPage() {
  const router = useRouter();
  const [filter, setFilter]           = useState<StatusFilter>("pending");
  const [orders, setOrders]           = useState<AdminBoostOrder[]>([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState("");
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async (status: StatusFilter, pg: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setError("");
    try {
      const res = await listBoostOrders(status, pg);
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

  async function handleDownloadReceipt(e: React.MouseEvent, order: AdminBoostOrder) {
    e.stopPropagation();
    if (!order.receiptKey || downloadingIds.has(order.id)) return;
    setDownloadingIds((prev) => new Set(prev).add(order.id));
    try {
      const { blob, filename } = await downloadBoostReceiptBlob(order.id);
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

  // pending: Business Amount Submitted Actions = 4
  // approved/rejected: + Status = 5
  const colCount = filter === "pending" ? 4 : 5;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[20px] md:text-[24px] font-bold text-[#0A0A0A]">Business Transfers</h1>
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
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Business</th>
                <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Submitted</th>
                {filter !== "pending" && (
                  <th className="text-left px-5 py-3 text-[13px] font-semibold text-[#888] uppercase tracking-wide">Status</th>
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
                    No {filter} business boost transfers.
                  </td>
                </tr>
              ) : (
                <>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => router.push(`/business-transfers/${order.id}`)}
                      className="border-b border-[#F5F5F5] hover:bg-[#EAEAEA] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-[14px] md:text-[16px] font-semibold text-[#0A0A0A]">{order.businessName ?? "—"}</p>
                        <p className="text-[12px] md:text-[14px] text-[#888]">@{order.username ?? "—"}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-[14px] md:text-[16px] text-[#444]">{formatLkr(order.amountLkr)}</p>
                        {order.discountLkr > 0 && (
                          <p className="text-[12px] text-[#2E7D32]">− {formatLkr(order.discountLkr)}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-[#888]">{formatDate(order.createdAt)}</td>
                      {filter !== "pending" && (
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[12px] font-semibold capitalize ${
                            order.status === "approved" ? "bg-[#F0FDF4] text-[#2E7D32]" : "bg-[#FFF0F3] text-[#B31B38]"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      )}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          disabled={!order.receiptKey || downloadingIds.has(order.id)}
                          onClick={(e) => handleDownloadReceipt(e, order)}
                          className="px-3 py-2 rounded-xl text-[12px] md:text-[14px] font-semibold text-[#B31B38] bg-[#FFF0F3] hover:bg-[#FFE0E7] active:bg-[#FFE0E7] transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
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
