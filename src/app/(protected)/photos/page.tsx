"use client";

import { useCallback, useEffect, useState } from "react";
import { listPendingPhotos, reviewPhoto } from "../../../lib/api";
import type { PendingPhoto } from "../../../lib/api";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState("");

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

  async function handleReview(reviewId: string, action: "approve" | "deny") {
    setActing(reviewId);
    try {
      await reviewPhoto(reviewId, action);
      setPhotos((prev) => prev.filter((p) => p.reviewId !== reviewId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActing(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#222222]">Photo Approval</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            {loading
              ? "Loading…"
              : `${photos.length} pending ${photos.length === 1 ? "submission" : "submissions"}`}
          </p>
        </div>
        {!loading && (
          <button
            type="button"
            onClick={fetchPhotos}
            className="text-sm text-[#6B6B6B] hover:text-[#B31B38] transition-colors border border-[#E6E6E6] px-4 py-2 rounded-xl hover:border-[#B31B38]"
          >
            Refresh
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-[#FFF0F3] rounded-xl text-sm text-[#B31B38]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] animate-pulse">
              <div className="aspect-square bg-[#F2F2F2]" />
              <div className="p-3 space-y-2">
                <div className="h-3.5 bg-[#F2F2F2] rounded w-3/4" />
                <div className="h-3 bg-[#F2F2F2] rounded w-1/2" />
                <div className="flex gap-2 mt-3">
                  <div className="h-8 bg-[#F2F2F2] rounded-lg flex-1" />
                  <div className="h-8 bg-[#F2F2F2] rounded-lg flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4 text-3xl">
            ✓
          </div>
          <p className="text-base font-medium text-[#222222]">All caught up!</p>
          <p className="text-sm text-[#6B6B6B] mt-1">No pending photo submissions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.reviewId}
              className="bg-white rounded-2xl overflow-hidden border border-[#EEEEEE]"
            >
              <div className="aspect-square bg-[#F2F2F2]">
                <img
                  src={photo.photoUrl}
                  alt={photo.userName}
                  className="w-full h-full object-cover"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-[#222222] truncate">{photo.userName}</p>
                <p className="text-xs text-[#6B6B6B]">{photo.displayId}</p>
                <p className="text-xs text-[#AAAAAA] mt-0.5">{timeAgo(photo.submittedAt)}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    disabled={acting === photo.reviewId}
                    onClick={() => handleReview(photo.reviewId, "approve")}
                    className="flex-1 py-1.5 rounded-lg bg-[#F0FDF4] text-[#2E7D32] text-xs font-semibold hover:bg-[#DCFCE7] disabled:opacity-50 transition-colors"
                  >
                    {acting === photo.reviewId ? "…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={acting === photo.reviewId}
                    onClick={() => handleReview(photo.reviewId, "deny")}
                    className="flex-1 py-1.5 rounded-lg bg-[#FFF0F3] text-[#B31B38] text-xs font-semibold hover:bg-[#FFE0E7] disabled:opacity-50 transition-colors"
                  >
                    {acting === photo.reviewId ? "…" : "Deny"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
