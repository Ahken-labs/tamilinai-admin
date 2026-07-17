"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TabBar from "@/components/layout/TabBar";
import Button from "@/components/layout/Button";
import { listAdminBusinesses } from "@/lib/api";
import type { AdminBusinessSummary } from "@/lib/api";

type StatusFilter = "pending" | "approved" | "rejected";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function BusinessSkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-[#F5F5F5] animate-pulse">
          <td className="px-5 py-4">
            <div className="h-4 bg-[#F2F2F2] rounded w-32 mb-1.5" />
            <div className="h-3 bg-[#F2F2F2] rounded w-20" />
          </td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-28" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-20" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-[#F2F2F2] rounded w-24" /></td>
          <td className="px-5 py-4"><div className="h-7 bg-[#F2F2F2] rounded-lg w-20" /></td>
        </tr>
      ))}
    </>
  );
}

export default function BusinessesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [businesses, setBusinesses] = useState<AdminBusinessSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (status: StatusFilter, pg: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setError("");
    try {
      const res = await listAdminBusinesses(status, pg);
      setBusinesses((prev) => append ? [...prev, ...res.businesses] : res.businesses);
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    load(filter, 1, false);
  }, [filter, load]);

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">Businesses</h1>
      </div>

      <TabBar
        tabs={tabs}
        active={filter}
        onChange={(key) => setFilter(key as StatusFilter)}
      />

      <div className="mt-6 flex-1 overflow-auto">
        {error && (
          <div className="mb-4 rounded-[12px] bg-[#FFF0F3] px-4 py-3 text-[14px] text-[#B31B38]">{error}</div>
        )}

        <div className="bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                  <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Business</th>
                  <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Category</th>
                  <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">District</th>
                  <th className="text-left px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Registered</th>
                  <th className="text-right px-5 py-3 text-[14px] md:text-[16px] font-semibold text-[#888] uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <BusinessSkeletonRows count={8} />
                ) : businesses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-[14px] md:text-[16px] text-[#888]">
                      No {filter} businesses
                    </td>
                  </tr>
                ) : (
                  <>
                    {businesses.map((biz) => (
                      <tr key={biz.id} className="border-b border-[#EAEAEA] hover:bg-[#EAEAEA] transition-colors cursor-pointer" onClick={() => router.push(`/businesses/${biz.id}`)}>
                        <td className="px-5 py-3.5">
                          <p className="text-[12px] md:text-[14px] font-medium text-[#0A0A0A]">{biz.businessName}</p>
                          <p className="text-[12px] md:text-[14px] text-[#888]">@{biz.username}</p>
                        </td>
                        <td className="px-5 py-3.5 text-[12px] md:text-[14px] text-[#444]">{biz.category}</td>
                        <td className="px-5 py-3.5 text-[12px] md:text-[14px] text-[#444]">{biz.district}</td>
                        <td className="px-5 py-3.5 text-[12px] md:text-[14px] text-[#888]">{formatDate(biz.createdAt)}</td>
                        <td className="px-5 py-3.5 text-right">
                          <Button
                            text="Review"
                            onPress={() => router.push(`/businesses/${biz.id}`)}
                            pink
                            className="!py-1.5 ml-auto"
                          />
                        </td>
                      </tr>
                    ))}
                    {loadingMore && <BusinessSkeletonRows count={3} />}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {hasMore && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => { const next = page + 1; setPage(next); load(filter, next, true); }}
              disabled={loadingMore}
              className="text-[14px] text-[#B31B38] font-medium hover:underline disabled:opacity-50 cursor-pointer"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
