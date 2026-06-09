"use client";

import { useCallback, useEffect, useState } from "react";
import { listPendingPhotos, reviewPhoto } from "../../../lib/api";
import type { PendingPhoto } from "../../../lib/api";
import Popup from "@/components/Popup";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

type PendingAction = {
  reviewId: string;
  userName: string;
  action: "approve" | "deny";
};

export default function PhotosPage() {
  const [photos, setPhotos]   = useState<PendingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState<string | null>(null);
  const [error, setError]     = useState("");
  const [pending, setPending] = useState<PendingAction | null>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await listPendingPhotos();
      setPhotos(res.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load photos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  async function confirmReview() {
    if (!pending) return;
    const { reviewId, action } = pending;
    setPending(null);
    setActing(reviewId);
    try {
      await reviewPhoto(reviewId, action);
      setPhotos((prev) => prev.filter((p) => p.reviewId !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActing(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#0A0A0A]">Photo Approval</h1>
          <p className="text-[13px] text-[#888] mt-0.5">
            {loading
              ? "Loading…"
              : photos.length === 0
              ? "All caught up"
              : `${photos.length} pending ${photos.length === 1 ? "submission" : "submissions"}`}
          </p>
        </div>
        {!loading && (
          <button
            type="button"
            onClick={fetchPhotos}
            className="shrink-0 text-[13px] text-[#6B6B6B] hover:text-[#B31B38] border border-[#E6E6E6]
              hover:border-[#B31B38] px-4 py-2 rounded-xl transition-colors touch-manipulation"
          >
            Refresh
          </button>
        )}
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-[#FFF0F3] border border-[#FFD5DF] rounded-xl text-sm text-[#B31B38]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] animate-pulse">
              <div className="aspect-square bg-[#F2F2F2]" />
              <div className="p-3 space-y-2">
                <div className="h-3.5 bg-[#F2F2F2] rounded w-3/4" />
                <div className="h-3 bg-[#F2F2F2] rounded w-1/2" />
                <div className="flex gap-2 mt-3">
                  <div className="h-8 bg-[#F2F2F2] rounded-xl flex-1" />
                  <div className="h-8 bg-[#F2F2F2] rounded-xl flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-[#0A0A0A]">All caught up!</p>
          <p className="text-sm text-[#888] mt-1">No pending photo submissions right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {photos.map((photo) => (
            <div
              key={photo.reviewId}
              className="bg-white rounded-2xl overflow-hidden border border-[#EEEEEE]
                hover:border-[#F0C8D0] hover:shadow-sm transition-all duration-200"
            >
              <div className="aspect-square bg-[#F2F2F2] relative">
                <img
                  src={photo.photoUrl}
                  alt={photo.userName}
                  className="w-full h-full object-cover"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                {acting === photo.reviewId && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#B31B38] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-[13px] font-semibold text-[#0A0A0A] truncate">{photo.userName}</p>
                <p className="text-[11px] text-[#888]">{photo.displayId}</p>
                <p className="text-[11px] text-[#BBBBBB] mt-0.5">{timeAgo(photo.submittedAt)}</p>
                <div className="flex gap-1.5 mt-3">
                  <button
                    type="button"
                    disabled={acting === photo.reviewId}
                    onClick={() => setPending({ reviewId: photo.reviewId, userName: photo.userName, action: "approve" })}
                    className="flex-1 py-2 rounded-xl bg-[#F0FDF4] text-[#2E7D32] text-xs font-semibold
                      hover:bg-[#DCFCE7] active:bg-[#DCFCE7] disabled:opacity-40 transition-colors touch-manipulation"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={acting === photo.reviewId}
                    onClick={() => setPending({ reviewId: photo.reviewId, userName: photo.userName, action: "deny" })}
                    className="flex-1 py-2 rounded-xl bg-[#FFF0F3] text-[#B31B38] text-xs font-semibold
                      hover:bg-[#FFE0E7] active:bg-[#FFE0E7] disabled:opacity-40 transition-colors touch-manipulation"
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Popup
        open={!!pending}
        onClose={() => setPending(null)}
        title={pending?.action === "approve" ? "Approve this photo?" : "Deny this photo?"}
        subtitle={
          pending?.action === "approve"
            ? `${pending.userName}'s photo will be approved and shown on their profile.`
            : `${pending?.userName}'s photo will be rejected. They can re-upload a new one.`
        }
        buttons={[
          { label: "Cancel",       onClick: () => setPending(null), variant: "secondary" },
          {
            label:   pending?.action === "approve" ? "Yes, approve" : "Yes, deny",
            onClick: confirmReview,
            variant: pending?.action === "approve" ? "primary" : "danger",
          },
        ]}
      />
    </div>
  );
}
